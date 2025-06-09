-- eCaution Database Schema pour Supabase
-- Script complet pour créer toutes les tables dans Supabase

-- Enable extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- TABLE USERS - Gestion sécurisée des utilisateurs
-- ============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
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
    backup_codes TEXT[],
    
    -- Informations de profil
    date_of_birth DATE,
    address JSONB,
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
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- TABLE USER_SESSIONS - Sessions utilisateur sécurisées
-- ============================================================================
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255) UNIQUE NOT NULL,
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABLE LOGIN_ATTEMPTS - Audit des tentatives de connexion
-- ============================================================================
CREATE TABLE login_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255),
    ip_address INET NOT NULL,
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    failure_reason VARCHAR(100),
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABLE VERIFICATION_CODES - Codes de vérification
-- ============================================================================
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

-- ============================================================================
-- TABLE CATEGORIES - Catégories de produits
-- ============================================================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id),
    icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABLE PRODUCTS - Catalogue de produits
-- ============================================================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    condition VARCHAR(50) NOT NULL CHECK (condition IN ('Neuf', 'Comme neuf', 'Très bon état', 'Bon état', 'État correct')),
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

-- ============================================================================
-- TABLE PRODUCT_IMAGES - Images des produits
-- ============================================================================
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

-- ============================================================================
-- TABLE ORDERS - Commandes avec système d'escrow
-- ============================================================================
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
    
    -- Statut de l'escrow
    escrow_status VARCHAR(20) DEFAULT 'held' CHECK (escrow_status IN ('held', 'released', 'disputed', 'refunded', 'partial_refund')),
    
    -- Informations de paiement
    payment_method VARCHAR(50),
    payment_intent_id VARCHAR(255),
    stripe_charge_id VARCHAR(255),
    
    -- Adresses
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

-- ============================================================================
-- TABLE DELIVERY_VERIFICATIONS - Vérification de livraison
-- ============================================================================
CREATE TABLE delivery_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    
    -- Informations d'expédition
    tracking_number VARCHAR(100),
    carrier VARCHAR(50),
    shipping_label_url TEXT,
    
    -- Preuves d'expédition du vendeur
    seller_proof_type VARCHAR(50) CHECK (seller_proof_type IN ('tracking_number', 'receipt_photo', 'shipping_label', 'carrier_confirmation')),
    seller_proof_data JSONB,
    seller_proof_submitted_at TIMESTAMP WITH TIME ZONE,
    
    -- Confirmation de réception de l'acheteur
    buyer_confirmation_type VARCHAR(50) CHECK (buyer_confirmation_type IN ('manual_confirmation', 'photo_proof', 'signature', 'auto_confirmation')),
    buyer_confirmation_data JSONB,
    buyer_confirmed_at TIMESTAMP WITH TIME ZONE,
    
    -- Vérification automatique
    auto_tracking_status VARCHAR(50),
    last_tracking_update TIMESTAMP WITH TIME ZONE,
    tracking_events JSONB,
    
    -- Géolocalisation de livraison
    delivery_location POINT,
    delivery_photo_url TEXT,
    delivery_signature_url TEXT,
    
    -- Délais et escalade
    expected_delivery_date DATE,
    delivery_deadline TIMESTAMP WITH TIME ZONE,
    auto_release_date TIMESTAMP WITH TIME ZONE,
    
    -- Statut de vérification
    verification_status VARCHAR(30) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'shipped', 'in_transit', 'delivered', 'confirmed', 'disputed', 'lost')),
    
    -- Notifications et rappels
    seller_notified_at TIMESTAMP WITH TIME ZONE,
    buyer_reminder_sent_at TIMESTAMP WITH TIME ZONE,
    escalation_triggered_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABLE ESCROW_TRANSACTIONS - Transactions de séquestre
-- ============================================================================
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
    processed_by UUID REFERENCES users(id),
    
    -- Dates importantes
    scheduled_for TIMESTAMP WITH TIME ZONE,
    processed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABLE DISPUTES - Gestion des litiges
-- ============================================================================
CREATE TABLE disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id),
    complainant_id UUID NOT NULL REFERENCES users(id),
    respondent_id UUID NOT NULL REFERENCES users(id),
    
    -- Détails du litige
    dispute_type VARCHAR(50) NOT NULL CHECK (dispute_type IN ('not_received', 'not_as_described', 'damaged', 'fake_item', 'return_request', 'payment_issue')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    
    -- Preuves
    evidence JSONB,
    
    -- Statut et résolution
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'awaiting_response', 'mediation', 'resolved', 'closed', 'escalated')),
    priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- Résolution
    resolution_type VARCHAR(50) CHECK (resolution_type IN ('refund_buyer', 'release_seller', 'partial_refund', 'return_item', 'no_action')),
    resolution_amount DECIMAL(10,2),
    resolution_notes TEXT,
    
    -- Assignation et traitement
    assigned_to UUID REFERENCES users(id),
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    -- Délais
    response_deadline TIMESTAMP WITH TIME ZONE,
    resolution_deadline TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABLE DISPUTE_MESSAGES - Messages de litige
-- ============================================================================
CREATE TABLE dispute_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dispute_id UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    attachments JSONB,
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABLE MESSAGES - Messages entre utilisateurs
-- ============================================================================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES users(id),
    recipient_id UUID NOT NULL REFERENCES users(id),
    order_id UUID REFERENCES orders(id),
    subject VARCHAR(255),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABLE REVIEWS - Avis et évaluations
-- ============================================================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id),
    reviewer_id UUID NOT NULL REFERENCES users(id),
    reviewee_id UUID NOT NULL REFERENCES users(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABLE FAVORITES - Produits favoris
-- ============================================================================
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- ============================================================================
-- TABLE NOTIFICATIONS - Notifications utilisateur
-- ============================================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Type et contenu
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Données associées
    related_entity_type VARCHAR(50),
    related_entity_id UUID,
    data JSONB,
    
    -- Statut
    is_read BOOLEAN DEFAULT FALSE,
    is_email_sent BOOLEAN DEFAULT FALSE,
    is_sms_sent BOOLEAN DEFAULT FALSE,
    
    -- Priorité et canal
    priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    channels TEXT[] DEFAULT ARRAY['in_app'],
    
    -- Métadonnées
    read_at TIMESTAMP WITH TIME ZONE,
    email_sent_at TIMESTAMP WITH TIME ZONE,
    sms_sent_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CRÉATION DES INDEX POUR OPTIMISER LES PERFORMANCES
-- ============================================================================

-- Index pour la table users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_is_verified ON users(is_verified);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);

-- Index pour user_sessions
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_active ON user_sessions(is_active, expires_at);

-- Index pour login_attempts
CREATE INDEX idx_login_attempts_email ON login_attempts(email);
CREATE INDEX idx_login_attempts_ip ON login_attempts(ip_address);
CREATE INDEX idx_login_attempts_time ON login_attempts(attempted_at DESC);

-- Index pour verification_codes
CREATE INDEX idx_verification_codes_user_id ON verification_codes(user_id);
CREATE INDEX idx_verification_codes_code ON verification_codes(code);
CREATE INDEX idx_verification_codes_type ON verification_codes(type);
CREATE INDEX idx_verification_codes_expires ON verification_codes(expires_at);

-- Index pour categories
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_active ON categories(is_active);

-- Index pour products
CREATE INDEX idx_products_seller_id ON products(seller_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_location ON products(location);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_condition ON products(condition);
CREATE INDEX idx_products_deleted_at ON products(deleted_at);

-- Index pour product_images
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_primary ON product_images(is_primary);

-- Index pour orders
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_seller_id ON orders(seller_id);
CREATE INDEX idx_orders_product_id ON orders(product_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_escrow_status ON orders(escrow_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_number ON orders(order_number);

-- Index pour delivery_verifications
CREATE INDEX idx_delivery_verifications_order_id ON delivery_verifications(order_id);
CREATE INDEX idx_delivery_verifications_tracking ON delivery_verifications(tracking_number);
CREATE INDEX idx_delivery_verifications_status ON delivery_verifications(verification_status);
CREATE INDEX idx_delivery_verifications_auto_release ON delivery_verifications(auto_release_date);

-- Index pour escrow_transactions
CREATE INDEX idx_escrow_transactions_order_id ON escrow_transactions(order_id);
CREATE INDEX idx_escrow_transactions_type ON escrow_transactions(transaction_type);
CREATE INDEX idx_escrow_transactions_status ON escrow_transactions(status);
CREATE INDEX idx_escrow_transactions_scheduled ON escrow_transactions(scheduled_for);

-- Index pour disputes
CREATE INDEX idx_disputes_order_id ON disputes(order_id);
CREATE INDEX idx_disputes_complainant ON disputes(complainant_id);
CREATE INDEX idx_disputes_respondent ON disputes(respondent_id);
CREATE INDEX idx_disputes_status ON disputes(status);
CREATE INDEX idx_disputes_assigned ON disputes(assigned_to);

-- Index pour messages
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_order_id ON messages(order_id);
CREATE INDEX idx_messages_read ON messages(is_read);

-- Index pour notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Index pour reviews
CREATE INDEX idx_reviews_order_id ON reviews(order_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);

-- Index pour favorites
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_product_id ON favorites(product_id);

-- ============================================================================
-- FONCTIONS ET TRIGGERS
-- ============================================================================

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
    IF NEW.expected_delivery_date IS NOT NULL THEN
        NEW.auto_release_date := NEW.expected_delivery_date + INTERVAL '7 days';
    ELSE
        NEW.auto_release_date := NOW() + INTERVAL '14 days';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_auto_release_date_trigger 
    BEFORE INSERT ON delivery_verifications 
    FOR EACH ROW 
    EXECUTE FUNCTION set_auto_release_date();

-- ============================================================================
-- VUES POUR FACILITER LES REQUÊTES
-- ============================================================================

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
    p.price AS product_price,
    dv.verification_status AS delivery_status,
    dv.tracking_number,
    dv.buyer_confirmed_at
FROM orders o
JOIN users buyer ON o.buyer_id = buyer.id
JOIN users seller ON o.seller_id = seller.id
JOIN products p ON o.product_id = p.id
LEFT JOIN delivery_verifications dv ON o.id = dv.order_id
WHERE buyer.deleted_at IS NULL AND seller.deleted_at IS NULL;

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

-- Vue des produits avec informations vendeur
CREATE VIEW product_details AS
SELECT 
    p.*,
    u.first_name || ' ' || u.last_name AS seller_name,
    u.rating AS seller_rating,
    u.review_count AS seller_review_count,
    c.name AS category_name,
    c.slug AS category_slug,
    (SELECT image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = true LIMIT 1) AS primary_image
FROM products p
JOIN users u ON p.seller_id = u.id
JOIN categories c ON p.category_id = c.id
WHERE p.deleted_at IS NULL AND u.deleted_at IS NULL;

-- ============================================================================
-- COMMENTAIRES SUR LES TABLES
-- ============================================================================

COMMENT ON TABLE users IS 'Table des utilisateurs avec sécurité renforcée et vérification d''identité';
COMMENT ON TABLE user_sessions IS 'Sessions utilisateur sécurisées avec gestion des tokens';
COMMENT ON TABLE login_attempts IS 'Audit des tentatives de connexion pour la sécurité';
COMMENT ON TABLE verification_codes IS 'Codes de vérification pour email, téléphone et 2FA';
COMMENT ON TABLE categories IS 'Catégories hiérarchiques des produits';
COMMENT ON TABLE products IS 'Catalogue des produits avec géolocalisation';
COMMENT ON TABLE product_images IS 'Images des produits avec ordre et miniatures';
COMMENT ON TABLE orders IS 'Commandes avec système d''escrow intégré';
COMMENT ON TABLE delivery_verifications IS 'Vérification et suivi de livraison avec preuves multiples';
COMMENT ON TABLE escrow_transactions IS 'Transactions de séquestre pour la sécurité des paiements';
COMMENT ON TABLE disputes IS 'Gestion des litiges avec workflow complet';
COMMENT ON TABLE dispute_messages IS 'Messages dans le cadre des litiges';
COMMENT ON TABLE messages IS 'Messages entre utilisateurs';
COMMENT ON TABLE reviews IS 'Avis et évaluations des utilisateurs';
COMMENT ON TABLE favorites IS 'Produits favoris des utilisateurs';
COMMENT ON TABLE notifications IS 'Notifications multi-canaux pour les utilisateurs';

-- ============================================================================
-- POLITIQUES RLS (Row Level Security) pour Supabase
-- ============================================================================

-- Activer RLS sur toutes les tables sensibles
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Politique pour les utilisateurs (peuvent voir et modifier leurs propres données)
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Politique pour les sessions (utilisateur peut voir ses propres sessions)
CREATE POLICY "Users can view own sessions" ON user_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON user_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Politique pour les produits (publics en lecture, propriétaire en écriture)
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Users can insert own products" ON products FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Users can update own products" ON products FOR UPDATE USING (auth.uid() = seller_id);

-- Politique pour les commandes (acheteur et vendeur peuvent voir)
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Buyers can insert orders" ON orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Users can update own orders" ON orders FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Politique pour les messages (expéditeur et destinataire)
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Politique pour les notifications (utilisateur peut voir ses propres notifications)
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Politique pour les favoris
CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);

-- Politique pour les avis
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- ============================================================================
-- DONNÉES INITIALES
-- ============================================================================

-- Insertion des catégories principales
INSERT INTO categories (id, name, slug, description, icon, sort_order) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Électronique', 'electronique', 'Smartphones, ordinateurs, tablettes et accessoires', 'smartphone', 1),
    ('550e8400-e29b-41d4-a716-446655440002', 'Mode', 'mode', 'Vêtements, chaussures et accessoires', 'shirt', 2),
    ('550e8400-e29b-41d4-a716-446655440003', 'Maison & Jardin', 'maison-jardin', 'Meubles, décoration et jardinage', 'home', 3),
    ('550e8400-e29b-41d4-a716-446655440004', 'Sport & Loisirs', 'sport-loisirs', 'Équipements sportifs et loisirs', 'dumbbell', 4),
    ('550e8400-e29b-41d4-a716-446655440005', 'Véhicules', 'vehicules', 'Voitures, motos et vélos', 'car', 5);

-- Insertion des sous-catégories
INSERT INTO categories (id, name, slug, description, parent_id, sort_order) VALUES
    ('550e8400-e29b-41d4-a716-446655440011', 'Smartphones', 'smartphones', 'Téléphones mobiles', '550e8400-e29b-41d4-a716-446655440001', 1),
    ('550e8400-e29b-41d4-a716-446655440012', 'Ordinateurs', 'ordinateurs', 'PC et Mac', '550e8400-e29b-41d4-a716-446655440001', 2),
    ('550e8400-e29b-41d4-a716-446655440013', 'Consoles', 'consoles', 'PlayStation, Xbox, Nintendo', '550e8400-e29b-41d4-a716-446655440001', 3),
    ('550e8400-e29b-41d4-a716-446655440014', 'Tablettes', 'tablettes', 'iPad, Samsung Galaxy Tab', '550e8400-e29b-41d4-a716-446655440001', 4),
    ('550e8400-e29b-41d4-a716-446655440021', 'Vélos', 'velos', 'Vélos classiques et électriques', '550e8400-e29b-41d4-a716-446655440005', 1),
    ('550e8400-e29b-41d4-a716-446655440022', 'Motos', 'motos', 'Motos et scooters', '550e8400-e29b-41d4-a716-446655440005', 2);

-- Message de confirmation
SELECT 'Base de données eCaution créée avec succès! Toutes les tables, index, fonctions et politiques RLS sont en place.' AS status;
