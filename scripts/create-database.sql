-- eCaution Database Schema - Tables Essentielles
-- Script de création des tables principales pour utilisateurs et vérification de livraison

-- Enable UUID extension et extensions de sécurité
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table des utilisateurs avec sécurité renforcée
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Stockage sécurisé du hash bcrypt
    salt VARCHAR(255) NOT NULL, -- Salt unique pour chaque utilisateur
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    
    -- Vérification et sécurité
    is_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    phone_verified_at TIMESTAMP WITH TIME ZONE,
    
    -- Authentification à deux facteurs
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(32),
    backup_codes TEXT[], -- Codes de récupération
    
    -- Informations de profil
    date_of_birth DATE,
    address JSONB, -- Adresse complète en JSON
    identity_verified BOOLEAN DEFAULT FALSE,
    identity_document_url TEXT,
    
    -- Réputation et notation
    rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    total_sales INTEGER DEFAULT 0,
    total_purchases INTEGER DEFAULT 0,
    
    -- Sécurité du compte
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_login_ip INET,
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE -- Soft delete
);

-- Table des sessions utilisateur pour la gestion sécurisée des connexions
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255) UNIQUE NOT NULL,
    device_info JSONB, -- Informations sur l'appareil
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des tentatives de connexion pour la sécurité
CREATE TABLE login_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255),
    ip_address INET NOT NULL,
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    failure_reason VARCHAR(100),
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de vérification email/téléphone
CREATE TABLE verification_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255),
    phone VARCHAR(20),
    code VARCHAR(10) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('email_verification', 'phone_verification', 'password_reset', '2fa_setup')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des produits
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    condition VARCHAR(50) NOT NULL CHECK (condition IN ('Neuf', 'Comme neuf', 'Très bon état', 'Bon état', 'État correct')),
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    brand VARCHAR(100),
    model VARCHAR(100),
    
    -- Localisation
    location VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Statut et visibilité
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'paused', 'deleted', 'under_review')),
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Spécifications techniques en JSON
    specifications JSONB,
    
    -- Métriques
    view_count INTEGER DEFAULT 0,
    favorite_count INTEGER DEFAULT 0,
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Table des images de produits
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    alt_text VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des commandes avec système d'escrow
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(20) UNIQUE NOT NULL,
    buyer_id UUID NOT NULL REFERENCES users(id),
    seller_id UUID NOT NULL REFERENCES users(id),
    product_id UUID NOT NULL REFERENCES products(id),
    
    -- Montants
    product_price DECIMAL(10,2) NOT NULL,
    service_fee DECIMAL(10,2) NOT NULL DEFAULT 2.50,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Statuts de la commande
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'confirmed', 'shipped', 'delivered', 'completed', 'cancelled', 'disputed', 'refunded')),
    
    -- Statut de l'escrow (système de séquestre)
    escrow_status VARCHAR(20) DEFAULT 'held' CHECK (escrow_status IN ('held', 'released', 'disputed', 'refunded', 'partial_refund')),
    
    -- Informations de paiement
    payment_method VARCHAR(50),
    payment_intent_id VARCHAR(255), -- Stripe Payment Intent ID
    stripe_charge_id VARCHAR(255),
    
    -- Adresse de livraison
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    
    -- Informations de livraison
    shipping_method VARCHAR(50),
    estimated_delivery_date DATE,
    
    -- Métadonnées temporelles
    paid_at TIMESTAMP WITH TIME ZONE,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de vérification et suivi de livraison
CREATE TABLE delivery_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    
    -- Informations d'expédition
    tracking_number VARCHAR(100),
    carrier VARCHAR(50), -- La Poste, Chronopost, UPS, etc.
    shipping_label_url TEXT,
    
    -- Preuves d'expédition du vendeur
    seller_proof_type VARCHAR(50) CHECK (seller_proof_type IN ('tracking_number', 'receipt_photo', 'shipping_label', 'carrier_confirmation')),
    seller_proof_data JSONB, -- Photos, documents, etc.
    seller_proof_submitted_at TIMESTAMP WITH TIME ZONE,
    
    -- Confirmation de réception de l'acheteur
    buyer_confirmation_type VARCHAR(50) CHECK (buyer_confirmation_type IN ('manual_confirmation', 'photo_proof', 'signature', 'auto_confirmation')),
    buyer_confirmation_data JSONB, -- Photos de réception, signature, etc.
    buyer_confirmed_at TIMESTAMP WITH TIME ZONE,
    
    -- Vérification automatique
    auto_tracking_status VARCHAR(50), -- Statut du suivi automatique
    last_tracking_update TIMESTAMP WITH TIME ZONE,
    tracking_events JSONB, -- Historique des événements de suivi
    
    -- Géolocalisation de livraison (optionnel)
    delivery_location POINT,
    delivery_photo_url TEXT,
    delivery_signature_url TEXT,
    
    -- Délais et escalade
    expected_delivery_date DATE,
    delivery_deadline TIMESTAMP WITH TIME ZONE, -- Délai maximum avant escalade automatique
    auto_release_date TIMESTAMP WITH TIME ZONE, -- Date de libération automatique des fonds
    
    -- Statut de vérification
    verification_status VARCHAR(30) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'shipped', 'in_transit', 'delivered', 'confirmed', 'disputed', 'lost')),
    
    -- Notifications et rappels
    seller_notified_at TIMESTAMP WITH TIME ZONE,
    buyer_reminder_sent_at TIMESTAMP WITH TIME ZONE,
    escalation_triggered_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des transactions escrow (séquestre)
CREATE TABLE escrow_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id),
    
    -- Type de transaction
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('hold', 'release', 'partial_release', 'refund', 'partial_refund', 'dispute_hold', 'fee_deduction')),
    
    -- Montants
    amount DECIMAL(10,2) NOT NULL,
    fee_amount DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(10,2) NOT NULL,
    
    -- Statut et traitement
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    
    -- Intégration Stripe
    stripe_transaction_id VARCHAR(255),
    stripe_transfer_id VARCHAR(255),
    stripe_refund_id VARCHAR(255),
    
    -- Raison et métadonnées
    reason VARCHAR(255),
    admin_notes TEXT,
    processed_by UUID REFERENCES users(id), -- Admin qui a traité
    
    -- Dates importantes
    scheduled_for TIMESTAMP WITH TIME ZONE, -- Date programmée pour la transaction
    processed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des litiges
CREATE TABLE disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id),
    complainant_id UUID NOT NULL REFERENCES users(id), -- Qui ouvre le litige
    respondent_id UUID NOT NULL REFERENCES users(id), -- Contre qui
    
    -- Détails du litige
    dispute_type VARCHAR(50) NOT NULL CHECK (dispute_type IN ('not_received', 'not_as_described', 'damaged', 'fake_item', 'return_request', 'payment_issue')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    
    -- Preuves
    evidence JSONB, -- Photos, documents, messages
    
    -- Statut et résolution
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'awaiting_response', 'mediation', 'resolved', 'closed', 'escalated')),
    priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- Résolution
    resolution_type VARCHAR(50) CHECK (resolution_type IN ('refund_buyer', 'release_seller', 'partial_refund', 'return_item', 'no_action')),
    resolution_amount DECIMAL(10,2),
    resolution_notes TEXT,
    
    -- Assignation et traitement
    assigned_to UUID REFERENCES users(id), -- Admin assigné
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    -- Délais
    response_deadline TIMESTAMP WITH TIME ZONE,
    resolution_deadline TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des messages de litige
CREATE TABLE dispute_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dispute_id UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    attachments JSONB, -- Fichiers joints
    is_internal BOOLEAN DEFAULT FALSE, -- Message interne admin
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Type et contenu
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Données associées
    related_entity_type VARCHAR(50), -- 'order', 'product', 'dispute', etc.
    related_entity_id UUID,
    data JSONB,
    
    -- Statut
    is_read BOOLEAN DEFAULT FALSE,
    is_email_sent BOOLEAN DEFAULT FALSE,
    is_sms_sent BOOLEAN DEFAULT FALSE,
    
    -- Priorité et canal
    priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    channels TEXT[] DEFAULT ARRAY['in_app'], -- 'in_app', 'email', 'sms', 'push'
    
    -- Métadonnées
    read_at TIMESTAMP WITH TIME ZONE,
    email_sent_at TIMESTAMP WITH TIME ZONE,
    sms_sent_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création des index pour optimiser les performances
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_is_verified ON users(is_verified);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_active ON user_sessions(is_active, expires_at);

CREATE INDEX idx_login_attempts_email ON login_attempts(email);
CREATE INDEX idx_login_attempts_ip ON login_attempts(ip_address);
CREATE INDEX idx_login_attempts_time ON login_attempts(attempted_at DESC);

CREATE INDEX idx_verification_codes_user_id ON verification_codes(user_id);
CREATE INDEX idx_verification_codes_code ON verification_codes(code);
CREATE INDEX idx_verification_codes_type ON verification_codes(type);

CREATE INDEX idx_products_seller_id ON products(seller_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_location ON products(location);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_products_price ON products(price);

CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_seller_id ON orders(seller_id);
CREATE INDEX idx_orders_product_id ON orders(product_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_escrow_status ON orders(escrow_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

CREATE INDEX idx_delivery_verifications_order_id ON delivery_verifications(order_id);
CREATE INDEX idx_delivery_verifications_tracking ON delivery_verifications(tracking_number);
CREATE INDEX idx_delivery_verifications_status ON delivery_verifications(verification_status);
CREATE INDEX idx_delivery_verifications_auto_release ON delivery_verifications(auto_release_date);

CREATE INDEX idx_escrow_transactions_order_id ON escrow_transactions(order_id);
CREATE INDEX idx_escrow_transactions_type ON escrow_transactions(transaction_type);
CREATE INDEX idx_escrow_transactions_status ON escrow_transactions(status);
CREATE INDEX idx_escrow_transactions_scheduled ON escrow_transactions(scheduled_for);

CREATE INDEX idx_disputes_order_id ON disputes(order_id);
CREATE INDEX idx_disputes_complainant ON disputes(complainant_id);
CREATE INDEX idx_disputes_status ON disputes(status);
CREATE INDEX idx_disputes_assigned ON disputes(assigned_to);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Application des triggers pour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_delivery_verifications_updated_at BEFORE UPDATE ON delivery_verifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON disputes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour générer un numéro de commande unique
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    counter INTEGER := 1;
BEGIN
    LOOP
        new_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(counter::TEXT, 4, '0');
        
        IF NOT EXISTS (SELECT 1 FROM orders WHERE order_number = new_number) THEN
            RETURN new_number;
        END IF;
        
        counter := counter + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour générer automatiquement le numéro de commande
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number_trigger 
    BEFORE INSERT ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION set_order_number();

-- Fonction pour calculer automatiquement la date de libération des fonds
CREATE OR REPLACE FUNCTION set_auto_release_date()
RETURNS TRIGGER AS $$
BEGIN
    -- Libération automatique après 7 jours si pas de confirmation
    NEW.auto_release_date := NEW.expected_delivery_date + INTERVAL '7 days';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_auto_release_date_trigger 
    BEFORE INSERT ON delivery_verifications 
    FOR EACH ROW 
    EXECUTE FUNCTION set_auto_release_date();

-- Vues pour faciliter les requêtes courantes

-- Vue des commandes avec détails complets
CREATE VIEW order_details AS
SELECT 
    o.*,
    buyer.first_name || ' ' || buyer.last_name AS buyer_name,
    buyer.email AS buyer_email,
    seller.first_name || ' ' || seller.last_name AS seller_name,
    seller.email AS seller_email,
    p.title AS product_title,
    p.condition AS product_condition,
    dv.verification_status AS delivery_status,
    dv.tracking_number,
    dv.buyer_confirmed_at
FROM orders o
JOIN users buyer ON o.buyer_id = buyer.id
JOIN users seller ON o.seller_id = seller.id
JOIN products p ON o.product_id = p.id
LEFT JOIN delivery_verifications dv ON o.id = dv.order_id;

-- Vue des statistiques utilisateur
CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.first_name || ' ' || u.last_name AS full_name,
    u.email,
    u.rating,
    u.review_count,
    COUNT(DISTINCT CASE WHEN o.seller_id = u.id THEN o.id END) AS total_sales,
    COUNT(DISTINCT CASE WHEN o.buyer_id = u.id THEN o.id END) AS total_purchases,
    COUNT(DISTINCT CASE WHEN p.seller_id = u.id AND p.status = 'active' THEN p.id END) AS active_listings,
    COALESCE(SUM(CASE WHEN o.seller_id = u.id AND o.status = 'completed' THEN o.product_price END), 0) AS total_revenue
FROM users u
LEFT JOIN orders o ON (u.id = o.seller_id OR u.id = o.buyer_id)
LEFT JOIN products p ON u.id = p.seller_id
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.first_name, u.last_name, u.email, u.rating, u.review_count;

COMMENT ON TABLE users IS 'Table des utilisateurs avec sécurité renforcée et vérification d''identité';
COMMENT ON TABLE delivery_verifications IS 'Table de vérification et suivi de livraison avec preuves multiples';
COMMENT ON TABLE escrow_transactions IS 'Table des transactions de séquestre pour la sécurité des paiements';
COMMENT ON TABLE disputes IS 'Table de gestion des litiges avec workflow complet';
