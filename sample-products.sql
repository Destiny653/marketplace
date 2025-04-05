-- Sample Products SQL for Marketplace
-- This script will insert sample products for all categories

-- First, let's create the categories if they don't exist
INSERT INTO categories (id, name, slug, description, image_url)
VALUES 
  ('electronics', 'Electronics', 'electronics', 'Latest electronic gadgets and devices', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1000&auto=format&fit=crop'),
  ('wardrobe', 'Wardrobe', 'wardrobe', 'Stylish clothing and accessories', 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=1000&auto=format&fit=crop'),
  ('furniture', 'Furniture', 'furniture', 'Modern and classic furniture for your home', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop'),
  ('cosmetics', 'Cosmetics', 'cosmetics', 'Beauty and skincare products', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1000&auto=format&fit=crop'),
  ('mens', 'Men\'s Style', 'mens', 'Fashion and accessories for men', 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1000&auto=format&fit=crop'),
  ('watch', 'Watches', 'watch', 'Luxury and smart watches', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop')
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, 
    description = EXCLUDED.description, 
    image_url = EXCLUDED.image_url;

-- Electronics Products
INSERT INTO products (id, name, slug, description, price, sale_price, image_url, category_id, status, avg_rating, created_at)
VALUES
  ('e1', 'Wireless Headphones', 'wireless-headphones', 'Premium noise-cancelling wireless headphones with 30-hour battery life', 299.99, 249.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop', 'electronics', 'active', 4.7, NOW()),
  ('e2', 'Smart Speaker', 'smart-speaker', 'Voice-controlled smart speaker with premium sound quality', 199.99, 159.99, 'https://images.unsplash.com/photo-1589003077984-894e133dabab?q=80&w=1000&auto=format&fit=crop', 'electronics', 'active', 4.5, NOW()),
  ('e3', 'Ultra HD Smart TV', 'ultra-hd-smart-tv', '65-inch 4K Ultra HD Smart TV with HDR and built-in streaming apps', 1299.99, 999.99, 'https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=1000&auto=format&fit=crop', 'electronics', 'active', 4.8, NOW()),
  ('e4', 'Smartphone Pro', 'smartphone-pro', 'Latest flagship smartphone with triple camera system and all-day battery life', 999.99, 899.99, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=1000&auto=format&fit=crop', 'electronics', 'active', 4.6, NOW()),
  ('e5', 'Wireless Earbuds', 'wireless-earbuds', 'True wireless earbuds with active noise cancellation and water resistance', 179.99, 149.99, 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f37?q=80&w=1000&auto=format&fit=crop', 'electronics', 'active', 4.4, NOW()),
  ('e6', 'Laptop Pro', 'laptop-pro', 'Powerful laptop with 16GB RAM, 512GB SSD, and dedicated graphics card', 1499.99, NULL, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000&auto=format&fit=crop', 'electronics', 'active', 4.9, NOW())
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, 
    description = EXCLUDED.description, 
    price = EXCLUDED.price, 
    sale_price = EXCLUDED.sale_price, 
    image_url = EXCLUDED.image_url, 
    category_id = EXCLUDED.category_id, 
    status = EXCLUDED.status, 
    avg_rating = EXCLUDED.avg_rating;

-- Wardrobe Products
INSERT INTO products (id, name, slug, description, price, sale_price, image_url, category_id, status, avg_rating, created_at)
VALUES
  ('w1', 'Designer Dress', 'designer-dress', 'Elegant designer dress perfect for special occasions', 199.99, 149.99, 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1000&auto=format&fit=crop', 'wardrobe', 'active', 4.6, NOW()),
  ('w2', 'Premium Jeans', 'premium-jeans', 'High-quality denim jeans with perfect fit and comfort', 89.99, 69.99, 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?q=80&w=1000&auto=format&fit=crop', 'wardrobe', 'active', 4.5, NOW()),
  ('w3', 'Casual T-Shirt', 'casual-tshirt', 'Comfortable cotton t-shirt for everyday wear', 29.99, NULL, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop', 'wardrobe', 'active', 4.3, NOW()),
  ('w4', 'Winter Jacket', 'winter-jacket', 'Warm and stylish winter jacket with water-resistant exterior', 249.99, 199.99, 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=1000&auto=format&fit=crop', 'wardrobe', 'active', 4.7, NOW()),
  ('w5', 'Summer Dress', 'summer-dress', 'Light and breezy summer dress with floral pattern', 79.99, 59.99, 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop', 'wardrobe', 'active', 4.4, NOW()),
  ('w6', 'Formal Suit', 'formal-suit', 'Classic formal suit for professional settings and special events', 349.99, 299.99, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop', 'wardrobe', 'active', 4.8, NOW())
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, 
    description = EXCLUDED.description, 
    price = EXCLUDED.price, 
    sale_price = EXCLUDED.sale_price, 
    image_url = EXCLUDED.image_url, 
    category_id = EXCLUDED.category_id, 
    status = EXCLUDED.status, 
    avg_rating = EXCLUDED.avg_rating;

-- Furniture Products
INSERT INTO products (id, name, slug, description, price, sale_price, image_url, category_id, status, avg_rating, created_at)
VALUES
  ('f1', 'Modern Sofa', 'modern-sofa', 'Contemporary 3-seater sofa with premium fabric upholstery', 899.99, 749.99, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop', 'furniture', 'active', 4.7, NOW()),
  ('f2', 'Dining Table Set', 'dining-table-set', 'Elegant dining table with 6 chairs made from solid wood', 1299.99, 999.99, 'https://images.unsplash.com/photo-1617098900591-3f90928e8c54?q=80&w=1000&auto=format&fit=crop', 'furniture', 'active', 4.6, NOW()),
  ('f3', 'Queen Size Bed', 'queen-size-bed', 'Luxurious queen size bed with upholstered headboard', 799.99, 699.99, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1000&auto=format&fit=crop', 'furniture', 'active', 4.8, NOW()),
  ('f4', 'Bookshelf', 'bookshelf', 'Modern bookshelf with adjustable shelves and ample storage space', 249.99, NULL, 'https://images.unsplash.com/photo-1588279102080-82bbdaa1aef2?q=80&w=1000&auto=format&fit=crop', 'furniture', 'active', 4.5, NOW()),
  ('f5', 'Coffee Table', 'coffee-table', 'Stylish coffee table with glass top and wooden base', 199.99, 159.99, 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=1000&auto=format&fit=crop', 'furniture', 'active', 4.4, NOW()),
  ('f6', 'Office Chair', 'office-chair', 'Ergonomic office chair with adjustable height and lumbar support', 299.99, 249.99, 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?q=80&w=1000&auto=format&fit=crop', 'furniture', 'active', 4.6, NOW())
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, 
    description = EXCLUDED.description, 
    price = EXCLUDED.price, 
    sale_price = EXCLUDED.sale_price, 
    image_url = EXCLUDED.image_url, 
    category_id = EXCLUDED.category_id, 
    status = EXCLUDED.status, 
    avg_rating = EXCLUDED.avg_rating;

-- Cosmetics Products
INSERT INTO products (id, name, slug, description, price, sale_price, image_url, category_id, status, avg_rating, created_at)
VALUES
  ('c1', 'Premium Skincare Set', 'premium-skincare-set', 'Complete skincare routine with cleanser, toner, serum, and moisturizer', 149.99, 119.99, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1000&auto=format&fit=crop', 'cosmetics', 'active', 4.8, NOW()),
  ('c2', 'Luxury Perfume', 'luxury-perfume', 'Elegant fragrance with notes of jasmine, rose, and sandalwood', 89.99, 74.99, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop', 'cosmetics', 'active', 4.7, NOW()),
  ('c3', 'Makeup Palette', 'makeup-palette', 'Versatile eyeshadow palette with 24 highly pigmented shades', 59.99, 49.99, 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1000&auto=format&fit=crop', 'cosmetics', 'active', 4.6, NOW()),
  ('c4', 'Natural Face Mask', 'natural-face-mask', 'Hydrating face mask with natural ingredients for all skin types', 24.99, NULL, 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1000&auto=format&fit=crop', 'cosmetics', 'active', 4.5, NOW()),
  ('c5', 'Hair Care Bundle', 'hair-care-bundle', 'Complete hair care set with shampoo, conditioner, and treatment mask', 79.99, 64.99, 'https://images.unsplash.com/photo-1626015729844-dd1745233467?q=80&w=1000&auto=format&fit=crop', 'cosmetics', 'active', 4.4, NOW()),
  ('c6', 'Lipstick Collection', 'lipstick-collection', 'Set of 5 premium lipsticks in versatile everyday colors', 49.99, 39.99, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1000&auto=format&fit=crop', 'cosmetics', 'active', 4.7, NOW())
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, 
    description = EXCLUDED.description, 
    price = EXCLUDED.price, 
    sale_price = EXCLUDED.sale_price, 
    image_url = EXCLUDED.image_url, 
    category_id = EXCLUDED.category_id, 
    status = EXCLUDED.status, 
    avg_rating = EXCLUDED.avg_rating;

-- Men's Style Products
INSERT INTO products (id, name, slug, description, price, sale_price, image_url, category_id, status, avg_rating, created_at)
VALUES
  ('m1', 'Business Suit', 'business-suit', 'Classic tailored business suit in navy blue', 399.99, 349.99, 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1000&auto=format&fit=crop', 'mens', 'active', 4.8, NOW()),
  ('m2', 'Casual Shirt', 'casual-shirt', 'Comfortable button-down shirt for casual and semi-formal occasions', 59.99, 49.99, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop', 'mens', 'active', 4.5, NOW()),
  ('m3', 'Designer Jeans', 'designer-jeans', 'Premium denim jeans with perfect fit and modern style', 89.99, 74.99, 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1000&auto=format&fit=crop', 'mens', 'active', 4.6, NOW()),
  ('m4', 'Leather Jacket', 'leather-jacket', 'Classic leather jacket with timeless design', 299.99, 249.99, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop', 'mens', 'active', 4.7, NOW()),
  ('m5', 'Formal Shoes', 'formal-shoes', 'Elegant leather formal shoes for business and special occasions', 149.99, NULL, 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1000&auto=format&fit=crop', 'mens', 'active', 4.6, NOW()),
  ('m6', 'Accessories Set', 'accessories-set', 'Complete set with tie, cufflinks, and pocket square', 79.99, 64.99, 'https://images.unsplash.com/photo-1623998021446-45a51a0c506c?q=80&w=1000&auto=format&fit=crop', 'mens', 'active', 4.5, NOW())
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, 
    description = EXCLUDED.description, 
    price = EXCLUDED.price, 
    sale_price = EXCLUDED.sale_price, 
    image_url = EXCLUDED.image_url, 
    category_id = EXCLUDED.category_id, 
    status = EXCLUDED.status, 
    avg_rating = EXCLUDED.avg_rating;

-- Watch Products
INSERT INTO products (id, name, slug, description, price, sale_price, image_url, category_id, status, avg_rating, created_at)
VALUES
  ('wt1', 'Luxury Automatic Watch', 'luxury-automatic-watch', 'Premium automatic watch with sapphire crystal and leather strap', 999.99, 849.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop', 'watch', 'active', 4.9, NOW()),
  ('wt2', 'Smart Watch Pro', 'smart-watch-pro', 'Advanced smartwatch with health monitoring and GPS', 349.99, 299.99, 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1000&auto=format&fit=crop', 'watch', 'active', 4.7, NOW()),
  ('wt3', 'Chronograph Watch', 'chronograph-watch', 'Stylish chronograph watch with stainless steel bracelet', 249.99, 199.99, 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1000&auto=format&fit=crop', 'watch', 'active', 4.6, NOW()),
  ('wt4', 'Minimalist Watch', 'minimalist-watch', 'Elegant minimalist watch with clean design and premium materials', 179.99, NULL, 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=1000&auto=format&fit=crop', 'watch', 'active', 4.5, NOW()),
  ('wt5', 'Dive Watch', 'dive-watch', 'Professional dive watch with 300m water resistance', 399.99, 349.99, 'https://images.unsplash.com/photo-1548171312-c6a5ff919daf?q=80&w=1000&auto=format&fit=crop', 'watch', 'active', 4.8, NOW()),
  ('wt6', 'Fitness Tracker', 'fitness-tracker', 'Advanced fitness tracker with heart rate monitoring and sleep tracking', 129.99, 99.99, 'https://images.unsplash.com/photo-1575311373937-040b8e1fd6b0?q=80&w=1000&auto=format&fit=crop', 'watch', 'active', 4.4, NOW())
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, 
    description = EXCLUDED.description, 
    price = EXCLUDED.price, 
    sale_price = EXCLUDED.sale_price, 
    image_url = EXCLUDED.image_url, 
    category_id = EXCLUDED.category_id, 
    status = EXCLUDED.status, 
    avg_rating = EXCLUDED.avg_rating;

-- Sample Blog Posts
INSERT INTO blog_posts (id, title, slug, excerpt, content, image_url, status, created_at)
VALUES
  ('blog1', 'Top Fashion Trends for 2025', 'top-fashion-trends-2025', 'Discover the hottest fashion trends that will dominate 2025.', '<p>Fashion is always evolving, and 2025 is set to bring some exciting new trends. From sustainable materials to bold colors, here''s what you need to know to stay ahead of the curve.</p><p>This year, we''re seeing a strong emphasis on eco-friendly fashion, with designers focusing on sustainable materials and ethical production methods. Vibrant colors are making a comeback, with electric blue and bright orange leading the way.</p><p>Oversized silhouettes continue to dominate casual wear, while tailored pieces are seeing a renaissance in professional settings. The line between gendered clothing continues to blur, with more unisex options available than ever before.</p>', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop', 'published', NOW() - INTERVAL '2 days'),
  
  ('blog2', 'How to Choose the Perfect Watch for Your Style', 'choose-perfect-watch-style', 'A comprehensive guide to finding the ideal timepiece that matches your personal style.', '<p>A watch is more than just a timekeeping device—it''s a statement piece that reflects your personal style. Whether you''re looking for a luxury timepiece or a practical everyday watch, this guide will help you make the right choice.</p><p>First, consider your lifestyle. Are you active and need something durable? Or do you attend formal events where an elegant dress watch would be appropriate? Your daily activities should influence your choice.</p><p>Next, think about your personal style. Classic dressers might prefer a minimalist design with a leather strap, while those with a more contemporary style might opt for a chronograph or a watch with unique features.</p><p>Budget is also an important consideration. While luxury watches can be an investment, there are plenty of high-quality options at more accessible price points.</p>', 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1000&auto=format&fit=crop', 'published', NOW() - INTERVAL '5 days'),
  
  ('blog3', 'The Ultimate Guide to Home Furniture Arrangement', 'guide-home-furniture-arrangement', 'Learn how to arrange your furniture for optimal space and comfort in your home.', '<p>The way you arrange your furniture can transform the look and feel of your home. Good furniture arrangement maximizes space, enhances functionality, and creates a welcoming atmosphere.</p><p>Start by identifying the focal point of each room—whether it''s a fireplace, a window with a view, or a large piece of art. Arrange your main furniture pieces to highlight this focal point.</p><p>Consider traffic flow when placing furniture. Leave enough space for people to walk comfortably between pieces. In living rooms, create conversation areas where people can sit and talk without raising their voices.</p><p>Don''t push all your furniture against the walls. Floating some pieces in the room can create a more intimate and interesting space. And remember, balance is key—distribute visual weight evenly throughout the room.</p>', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop', 'published', NOW() - INTERVAL '10 days'),
  
  ('blog4', 'Essential Skincare Routine for Every Skin Type', 'essential-skincare-routine', 'Discover the perfect skincare routine tailored to your specific skin type.', '<p>A good skincare routine is essential for maintaining healthy, glowing skin. But with so many products and advice out there, it can be overwhelming to know where to start. This guide breaks down the essentials for each skin type.</p><p>For oily skin, focus on gentle cleansing and lightweight, non-comedogenic moisturizers. Look for products with ingredients like salicylic acid and niacinamide to help control oil production.</p><p>Dry skin needs extra hydration. Choose cream-based cleansers and rich moisturizers with ingredients like hyaluronic acid and ceramides to lock in moisture.</p><p>Combination skin requires a balanced approach. You might need different products for different areas of your face, or look for balanced formulations that address both oily and dry concerns.</p><p>Sensitive skin benefits from fragrance-free, gentle products with soothing ingredients like aloe vera and chamomile.</p>', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1000&auto=format&fit=crop', 'published', NOW() - INTERVAL '15 days')
ON CONFLICT (id) DO UPDATE 
SET title = EXCLUDED.title, 
    excerpt = EXCLUDED.excerpt, 
    content = EXCLUDED.content, 
    image_url = EXCLUDED.image_url, 
    status = EXCLUDED.status;
