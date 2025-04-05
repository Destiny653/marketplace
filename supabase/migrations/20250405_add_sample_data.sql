-- Insert Categories
INSERT INTO categories (id, name, description) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Electronics', 'Latest electronic gadgets and devices'),
    ('22222222-2222-2222-2222-222222222222', 'Fashion', 'Trendy clothing and accessories'),
    ('33333333-3333-3333-3333-333333333333', 'Home & Living', 'Furniture and home decor'),
    ('44444444-4444-4444-4444-444444444444', 'Books', 'Books across all genres'),
    ('55555555-5555-5555-5555-555555555555', 'Sports', 'Sports equipment and accessories'),
    ('66666666-6666-6666-6666-666666666666', 'Beauty', 'Beauty and personal care products');

-- Insert Products in Electronics Category
INSERT INTO products (name, description, price, stock_quantity, image_url, category_id) VALUES
    ('iPhone 14 Pro', 'Latest Apple iPhone with advanced camera system', 999.99, 50, 'https://example.com/iphone14.jpg', '11111111-1111-1111-1111-111111111111'),
    ('Samsung 4K TV', '65-inch Smart TV with HDR', 799.99, 30, 'https://example.com/samsung-tv.jpg', '11111111-1111-1111-1111-111111111111'),
    ('MacBook Pro M2', '14-inch MacBook Pro with M2 chip', 1499.99, 25, 'https://example.com/macbook.jpg', '11111111-1111-1111-1111-111111111111');

-- Insert Products in Fashion Category
INSERT INTO products (name, description, price, stock_quantity, image_url, category_id) VALUES
    ('Leather Jacket', 'Premium leather jacket for men', 199.99, 40, 'https://example.com/leather-jacket.jpg', '22222222-2222-2222-2222-222222222222'),
    ('Designer Handbag', 'Luxury designer handbag', 299.99, 20, 'https://example.com/handbag.jpg', '22222222-2222-2222-2222-222222222222'),
    ('Running Shoes', 'Professional running shoes', 89.99, 60, 'https://example.com/shoes.jpg', '22222222-2222-2222-2222-222222222222');

-- Insert Products in Home & Living Category
INSERT INTO products (name, description, price, stock_quantity, image_url, category_id) VALUES
    ('Sofa Set', 'Modern 3-piece sofa set', 899.99, 15, 'https://example.com/sofa.jpg', '33333333-3333-3333-3333-333333333333'),
    ('Dining Table', '6-seater wooden dining table', 499.99, 20, 'https://example.com/table.jpg', '33333333-3333-3333-3333-333333333333'),
    ('Smart LED Lamp', 'WiFi-enabled smart LED lamp', 49.99, 100, 'https://example.com/lamp.jpg', '33333333-3333-3333-3333-333333333333');

-- Insert Products in Books Category
INSERT INTO products (name, description, price, stock_quantity, image_url, category_id) VALUES
    ('The Great Gatsby', 'Classic novel by F. Scott Fitzgerald', 14.99, 200, 'https://example.com/gatsby.jpg', '44444444-4444-4444-4444-444444444444'),
    ('Python Programming', 'Comprehensive guide to Python', 39.99, 150, 'https://example.com/python-book.jpg', '44444444-4444-4444-4444-444444444444'),
    ('Cooking Masterclass', 'Professional cooking techniques', 29.99, 100, 'https://example.com/cooking.jpg', '44444444-4444-4444-4444-444444444444');

-- Insert Products in Sports Category
INSERT INTO products (name, description, price, stock_quantity, image_url, category_id) VALUES
    ('Tennis Racket', 'Professional tennis racket', 159.99, 40, 'https://example.com/racket.jpg', '55555555-5555-5555-5555-555555555555'),
    ('Basketball', 'Official size basketball', 29.99, 80, 'https://example.com/basketball.jpg', '55555555-5555-5555-5555-555555555555'),
    ('Yoga Mat', 'Premium non-slip yoga mat', 24.99, 120, 'https://example.com/yoga-mat.jpg', '55555555-5555-5555-5555-555555555555');

-- Insert Products in Beauty Category
INSERT INTO products (name, description, price, stock_quantity, image_url, category_id) VALUES
    ('Face Cream', 'Anti-aging face cream', 49.99, 100, 'https://example.com/face-cream.jpg', '66666666-6666-6666-6666-666666666666'),
    ('Hair Dryer', 'Professional hair dryer', 79.99, 45, 'https://example.com/hair-dryer.jpg', '66666666-6666-6666-6666-666666666666'),
    ('Perfume Set', 'Luxury perfume gift set', 129.99, 30, 'https://example.com/perfume.jpg', '66666666-6666-6666-6666-666666666666');

-- Add some initial inventory transactions
INSERT INTO inventory_transactions (product_id, quantity_change, type, notes, created_by)
SELECT 
    id as product_id,
    stock_quantity as quantity_change,
    'purchase' as type,
    'Initial inventory' as notes,
    (SELECT id FROM auth.users LIMIT 1) as created_by
FROM products;

-- Update products statistics
SELECT update_product_likes_count();
SELECT update_product_avg_rating();
