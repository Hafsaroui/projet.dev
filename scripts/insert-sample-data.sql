-- eCaution Database - Données d'exemple
-- Exécutez ce script après avoir créé toutes les tables

-- ============================================================================
-- INSERTION DES CATÉGORIES
-- ============================================================================
INSERT INTO categories (id, name, slug, description, icon, sort_order) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Électronique', 'electronique', 'Smartphones, ordinateurs, tablettes et accessoires', 'smartphone', 1),
    ('550e8400-e29b-41d4-a716-446655440002', 'Mode', 'mode', 'Vêtements, chaussures et accessoires', 'shirt', 2),
    ('550e8400-e29b-41d4-a716-446655440003', 'Maison & Jardin', 'maison-jardin', 'Meubles, décoration et jardinage', 'home', 3),
    ('550e8400-e29b-41d4-a716-446655440004', 'Sport & Loisirs', 'sport-loisirs', 'Équipements sportifs et loisirs', 'dumbbell', 4),
    ('550e8400-e29b-41d4-a716-446655440005', 'Véhicules', 'vehicules', 'Voitures, motos et vélos', 'car', 5)
ON CONFLICT (id) DO NOTHING;

-- Sous-catégories
INSERT INTO categories (id, name, slug, description, parent_id, sort_order) VALUES
    ('550e8400-e29b-41d4-a716-446655440011', 'Smartphones', 'smartphones', 'Téléphones mobiles', '550e8400-e29b-41d4-a716-446655440001', 1),
    ('550e8400-e29b-41d4-a716-446655440012', 'Ordinateurs', 'ordinateurs', 'PC et Mac', '550e8400-e29b-41d4-a716-446655440001', 2),
    ('550e8400-e29b-41d4-a716-446655440013', 'Consoles', 'consoles', 'PlayStation, Xbox, Nintendo', '550e8400-e29b-41d4-a716-446655440001', 3),
    ('550e8400-e29b-41d4-a716-446655440021', 'Vélos', 'velos', 'Vélos classiques et électriques', '550e8400-e29b-41d4-a716-446655440005', 1)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- INSERTION D'UTILISATEURS DE TEST
-- ============================================================================
INSERT INTO users (id, email, password_hash, salt, first_name, last_name, phone, is_verified, rating, review_count) VALUES
    ('550e8400-e29b-41d4-a716-446655440101', 'marie.dupont@email.com', '$2b$12$example_hash_1', 'salt1', 'Marie', 'Dupont', '0612345678', true, 4.8, 23),
    ('550e8400-e29b-41d4-a716-446655440102', 'pierre.martin@email.com', '$2b$12$example_hash_2', 'salt2', 'Pierre', 'Martin', '0623456789', true, 4.6, 15),
    ('550e8400-e29b-41d4-a716-446655440103', 'sophie.bernard@email.com', '$2b$12$example_hash_3', 'salt3', 'Sophie', 'Bernard', '0634567890', true, 4.9, 31)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- INSERTION DE PRODUITS D'EXEMPLE
-- ============================================================================
INSERT INTO products (id, seller_id, category_id, title, description, price, condition, location, specifications) VALUES
    ('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440011', 'iPhone 13 Pro - Excellent état', 'iPhone 13 Pro en excellent état, utilisé avec précaution pendant 1 an.', 650.00, 'Excellent', 'Paris, 75001', '{"marque": "Apple", "modele": "iPhone 13 Pro", "stockage": "128 GB"}'),
    ('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440012', 'MacBook Air M1 - Comme neuf', 'MacBook Air M1 en parfait état, très peu utilisé.', 850.00, 'Comme neuf', 'Lyon, 69000', '{"marque": "Apple", "modele": "MacBook Air M1", "ram": "8 GB"}'),
    ('550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440021', 'Vélo électrique Decathlon', 'Vélo électrique en bon état, batterie changée récemment.', 450.00, 'Bon état', 'Marseille, 13000', '{"marque": "Decathlon", "modele": "Elops 940E", "autonomie": "50 km"}')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- INSERTION D'IMAGES DE PRODUITS
-- ============================================================================
INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
    ('550e8400-e29b-41d4-a716-446655440201', '/placeholder.svg?height=400&width=400', true, 1),
    ('550e8400-e29b-41d4-a716-446655440202', '/placeholder.svg?height=400&width=400', true, 1),
    ('550e8400-e29b-41d4-a716-446655440203', '/placeholder.svg?height=400&width=400', true, 1)
ON CONFLICT DO NOTHING;

-- Message de confirmation
SELECT 'Données d''exemple insérées avec succès!' AS status;
