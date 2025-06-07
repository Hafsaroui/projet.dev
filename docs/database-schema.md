# Schéma de Base de Données eCaution

## Vue d'ensemble

La base de données eCaution est construite sur PostgreSQL via Supabase, avec un accent particulier sur la sécurité et la performance.

## Tables Principales

### 1. Users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. Products
```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. Orders
```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID NOT NULL REFERENCES users(id),
    seller_id UUID NOT NULL REFERENCES users(id),
    product_id UUID NOT NULL REFERENCES products(id),
    status VARCHAR(20) DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Relations

### 1. Relations Utilisateur-Produit
- Un utilisateur peut être vendeur de plusieurs produits
- Un utilisateur peut acheter plusieurs produits
- Relation many-to-many pour les favoris

### 2. Relations Commande
- Une commande lie un acheteur, un vendeur et un produit
- Une commande peut avoir plusieurs statuts
- Une commande peut avoir plusieurs preuves de livraison

## Politiques de Sécurité (RLS)

### 1. Politiques Utilisateur
```sql
-- Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own profile" 
ON users FOR SELECT 
USING (auth.uid() = id);

-- Les utilisateurs peuvent modifier leur propre profil
CREATE POLICY "Users can update own profile" 
ON users FOR UPDATE 
USING (auth.uid() = id);
```

### 2. Politiques Produit
```sql
-- Tout le monde peut voir les produits actifs
CREATE POLICY "Products are viewable by everyone" 
ON products FOR SELECT 
USING (status = 'active');

-- Seuls les vendeurs peuvent modifier leurs produits
CREATE POLICY "Users can update own products" 
ON products FOR UPDATE 
USING (auth.uid() = seller_id);
```

### 3. Politiques Commande
```sql
-- Les acheteurs et vendeurs peuvent voir leurs commandes
CREATE POLICY "Users can view own orders" 
ON orders FOR SELECT 
USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
```

## Indexes

### 1. Index Utilisateur
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
```

### 2. Index Produit
```sql
CREATE INDEX idx_products_seller_id ON products(seller_id);
CREATE INDEX idx_products_status ON products(status);
```

### 3. Index Commande
```sql
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_seller_id ON orders(seller_id);
CREATE INDEX idx_orders_status ON orders(status);
```

## Fonctions et Triggers

### 1. Mise à jour automatique
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
```

### 2. Génération de numéro de commande
```sql
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('order_number_seq')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;
```

## Vues

### 1. Vue des statistiques utilisateur
```sql
CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.email,
    COUNT(DISTINCT o.id) as total_orders,
    AVG(o.total_amount) as average_order_value
FROM users u
LEFT JOIN orders o ON u.id = o.buyer_id
GROUP BY u.id, u.email;
```

### 2. Vue des produits avec détails vendeur
```sql
CREATE VIEW product_details AS
SELECT 
    p.*,
    u.email as seller_email,
    u.rating as seller_rating
FROM products p
JOIN users u ON p.seller_id = u.id;
```

