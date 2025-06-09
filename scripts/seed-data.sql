-- Seed data for eCaution marketplace
-- This script populates the database with sample data for testing

-- Insert categories
INSERT INTO categories (id, name, slug, description) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Électronique', 'electronique', 'Smartphones, ordinateurs, tablettes et accessoires'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Mode', 'mode', 'Vêtements, chaussures et accessoires'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Maison & Jardin', 'maison-jardin', 'Meubles, décoration et jardinage'),
    ('550e8400-e29b-41d4-a716-446655440004', 'Sport & Loisirs', 'sport-loisirs', 'Équipements sportifs et loisirs'),
    ('550e8400-e29b-41d4-a716-446655440005', 'Véhicules', 'vehicules', 'Voitures, motos et vélos');

-- Insert subcategories
INSERT INTO categories (id, name, slug, description, parent_id) VALUES
    ('550e8400-e29b-41d4-a716-446655440011', 'Smartphones', 'smartphones', 'Téléphones mobiles', '550e8400-e29b-41d4-a716-446655440001'),
    ('550e8400-e29b-41d4-a716-446655440012', 'Ordinateurs', 'ordinateurs', 'PC et Mac', '550e8400-e29b-41d4-a716-446655440001'),
    ('550e8400-e29b-41d4-a716-446655440013', 'Consoles', 'consoles', 'PlayStation, Xbox, Nintendo', '550e8400-e29b-41d4-a716-446655440001'),
    ('550e8400-e29b-41d4-a716-446655440021', 'Vélos', 'velos', 'Vélos classiques et électriques', '550e8400-e29b-41d4-a716-446655440005');

-- Insert sample users
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, is_verified, rating, review_count) VALUES
    ('550e8400-e29b-41d4-a716-446655440101', 'marie.dupont@email.com', '$2b$10$example_hash_1', 'Marie', 'Dupont', '0612345678', true, 4.8, 23),
    ('550e8400-e29b-41d4-a716-446655440102', 'pierre.martin@email.com', '$2b$10$example_hash_2', 'Pierre', 'Martin', '0623456789', true, 4.6, 15),
    ('550e8400-e29b-41d4-a716-446655440103', 'sophie.bernard@email.com', '$2b$10$example_hash_3', 'Sophie', 'Bernard', '0634567890', true, 4.9, 31),
    ('550e8400-e29b-41d4-a716-446655440104', 'alex.rousseau@email.com', '$2b$10$example_hash_4', 'Alex', 'Rousseau', '0645678901', true, 4.7, 18),
    ('550e8400-e29b-41d4-a716-446655440105', 'julie.blanc@email.com', '$2b$10$example_hash_5', 'Julie', 'Blanc', '0656789012', true, 4.5, 12);

-- Insert sample products
INSERT INTO products (id, seller_id, category_id, title, description, price, condition, location, specifications) VALUES
    ('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440011', 'iPhone 13 Pro - Excellent état', 'iPhone 13 Pro en excellent état, utilisé avec précaution pendant 1 an. Toujours dans sa boîte d''origine avec tous les accessoires.', 650.00, 'Excellent', 'Paris, 75001', '{"marque": "Apple", "modele": "iPhone 13 Pro", "stockage": "128 GB", "couleur": "Bleu Alpin", "batterie": "89%"}'),
    ('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440012', 'MacBook Air M1 - Comme neuf', 'MacBook Air M1 en parfait état, très peu utilisé. Idéal pour les étudiants et professionnels.', 850.00, 'Comme neuf', 'Lyon, 69000', '{"marque": "Apple", "modele": "MacBook Air M1", "ram": "8 GB", "stockage": "256 GB", "couleur": "Gris sidéral"}'),
    ('550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440021', 'Vélo électrique Decathlon', 'Vélo électrique en bon état, batterie changée récemment. Parfait pour les trajets urbains.', 450.00, 'Bon état', 'Marseille, 13000', '{"marque": "Decathlon", "modele": "Elops 940E", "autonomie": "50 km", "vitesses": "7"}'),
    ('550e8400-e29b-41d4-a716-446655440204', '550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440013', 'Console PS5 + 2 manettes', 'PlayStation 5 en très bon état avec 2 manettes DualSense. Quelques jeux inclus.', 400.00, 'Très bon état', 'Toulouse, 31000', '{"marque": "Sony", "modele": "PlayStation 5", "stockage": "825 GB", "accessoires": "2 manettes, câbles"}'),
    ('550e8400-e29b-41d4-a716-446655440205', '550e8400-e29b-41d4-a716-446655440105', '550e8400-e29b-41d4-a716-446655440001', 'Appareil photo Canon EOS', 'Appareil photo reflex Canon en bon état avec objectif 18-55mm. Idéal pour débuter en photographie.', 320.00, 'Bon état', 'Nice, 06000', '{"marque": "Canon", "modele": "EOS 2000D", "megapixels": "24.1 MP", "objectif": "18-55mm"}');

-- Insert product images
INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
    ('550e8400-e29b-41d4-a716-446655440201', '/placeholder.svg?height=400&width=400', true, 1),
    ('550e8400-e29b-41d4-a716-446655440201', '/placeholder.svg?height=400&width=400', false, 2),
    ('550e8400-e29b-41d4-a716-446655440202', '/placeholder.svg?height=400&width=400', true, 1),
    ('550e8400-e29b-41d4-a716-446655440203', '/placeholder.svg?height=400&width=400', true, 1),
    ('550e8400-e29b-41d4-a716-446655440204', '/placeholder.svg?height=400&width=400', true, 1),
    ('550e8400-e29b-41d4-a716-446655440205', '/placeholder.svg?height=400&width=400', true, 1);

-- Insert sample orders
INSERT INTO orders (id, order_number, buyer_id, seller_id, product_id, amount, service_fee, total_amount, status, escrow_status) VALUES
    ('550e8400-e29b-41d4-a716-446655440301', 'ORD-001', '550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440201', 650.00, 2.50, 652.50, 'completed', 'released'),
    ('550e8400-e29b-41d4-a716-446655440302', 'ORD-002', '550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440202', 850.00, 2.50, 852.50, 'shipped', 'held'),
    ('550e8400-e29b-41d4-a716-446655440303', 'ORD-003', '550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440203', 450.00, 2.50, 452.50, 'pending', 'held');

-- Insert sample escrow transactions
INSERT INTO escrow_transactions (order_id, transaction_type, amount, status, processed_at) VALUES
    ('550e8400-e29b-41d4-a716-446655440301', 'hold', 652.50, 'completed', NOW() - INTERVAL '5 days'),
    ('550e8400-e29b-41d4-a716-446655440301', 'release', 650.00, 'completed', NOW() - INTERVAL '1 day'),
    ('550e8400-e29b-41d4-a716-446655440302', 'hold', 852.50, 'completed', NOW() - INTERVAL '3 days'),
    ('550e8400-e29b-41d4-a716-446655440303', 'hold', 452.50, 'completed', NOW() - INTERVAL '2 days');

-- Insert sample messages
INSERT INTO messages (sender_id, recipient_id, order_id, subject, content) VALUES
    ('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440301', 'Question sur l''iPhone', 'Bonjour, l''iPhone est-il toujours sous garantie ?'),
    ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440301', 'Re: Question sur l''iPhone', 'Bonjour, la garantie Apple a expiré mais l''appareil fonctionne parfaitement.');

-- Insert sample reviews
INSERT INTO reviews (order_id, reviewer_id, reviewee_id, rating, comment) VALUES
    ('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440101', 5, 'Vendeur très sérieux, produit conforme à la description. Transaction parfaite !'),
    ('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440102', 5, 'Acheteur très réactif et paiement rapide. Je recommande !');

-- Insert sample notifications
INSERT INTO notifications (user_id, type, title, message, data) VALUES
    ('550e8400-e29b-41d4-a716-446655440101', 'order_completed', 'Commande terminée', 'Votre vente d''iPhone 13 Pro a été finalisée. Le paiement a été libéré.', '{"order_id": "550e8400-e29b-41d4-a716-446655440301", "amount": 650.00}'),
    ('550e8400-e29b-41d4-a716-446655440102', 'new_message', 'Nouveau message', 'Vous avez reçu un nouveau message concernant votre commande.', '{"message_id": "550e8400-e29b-41d4-a716-446655440401"}'),
    ('550e8400-e29b-41d4-a716-446655440103', 'order_shipped', 'Commande expédiée', 'Votre commande MacBook Air M1 a été expédiée.', '{"order_id": "550e8400-e29b-41d4-a716-446655440302", "tracking": "FR123456789"}');
