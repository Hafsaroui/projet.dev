-- eCaution Database - Étape 3: Tables de livraison et escrow
-- Exécutez ce script après l'étape 2

-- ============================================================================
-- TABLE DELIVERY_VERIFICATIONS - Vérification de livraison
-- ============================================================================
CREATE TABLE IF NOT EXISTS delivery_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    
    -- Expédition
    tracking_number VARCHAR(100),
    carrier VARCHAR(50),
    shipping_label_url TEXT,
    
    -- Preuves vendeur
    seller_proof_type VARCHAR(50) CHECK (seller_proof_type IN ('tracking_number', 'receipt_photo', 'shipping_label', 'carrier_confirmation')),
    seller_proof_data JSONB,
    seller_proof_submitted_at TIMESTAMPTZ,
    
    -- Confirmation acheteur
    buyer_confirmation_type VARCHAR(50) CHECK (buyer_confirmation_type IN ('manual_confirmation', 'photo_proof', 'signature', 'auto_confirmation')),
    buyer_confirmation_data JSONB,
    buyer_confirmed_at TIMESTAMPTZ,
    
    -- Suivi automatique
    auto_tracking_status VARCHAR(50),
    last_tracking_update TIMESTAMPTZ,
    tracking_events JSONB,
    
    -- Géolocalisation
    delivery_photo_url TEXT,
    delivery_signature_url TEXT,
    
    -- Délais
    expected_delivery_date DATE,
    delivery_deadline TIMESTAMPTZ,
    auto_release_date TIMESTAMPTZ,
    
    -- Statut
    verification_status VARCHAR(30) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'shipped', 'in_transit', 'delivered', 'confirmed', 'disputed', 'lost')),
    
    -- Notifications
    seller_notified_at TIMESTAMPTZ,
    buyer_reminder_sent_at TIMESTAMPTZ,
    escalation_triggered_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE ESCROW_TRANSACTIONS - Transactions escrow
-- ============================================================================
CREATE TABLE IF NOT EXISTS escrow_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id),
    
    -- Type de transaction
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('hold', 'release', 'partial_release', 'refund', 'partial_refund', 'dispute_hold', 'fee_deduction')),
    
    -- Montants
    amount DECIMAL(10,2) NOT NULL,
    fee_amount DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(10,2) NOT NULL,
    
    -- Statut
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    
    -- Stripe
    stripe_transaction_id VARCHAR(255),
    stripe_transfer_id VARCHAR(255),
    stripe_refund_id VARCHAR(255),
    
    -- Métadonnées
    reason VARCHAR(255),
    admin_notes TEXT,
    processed_by UUID REFERENCES users(id),
    
    -- Dates
    scheduled_for TIMESTAMPTZ,
    processed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE MESSAGES - Messages entre utilisateurs
-- ============================================================================
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES users(id),
    recipient_id UUID NOT NULL REFERENCES users(id),
    order_id UUID REFERENCES orders(id),
    subject VARCHAR(255),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE FAVORITES - Favoris
-- ============================================================================
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- ============================================================================
-- INDEX POUR LES PERFORMANCES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_delivery_verifications_order_id ON delivery_verifications(order_id);
CREATE INDEX IF NOT EXISTS idx_delivery_verifications_status ON delivery_verifications(verification_status);
CREATE INDEX IF NOT EXISTS idx_escrow_transactions_order_id ON escrow_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_escrow_transactions_type ON escrow_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product_id ON favorites(product_id);

-- Message de confirmation
SELECT 'Étape 3 terminée: Tables de livraison et escrow créées avec succès!' AS status;
