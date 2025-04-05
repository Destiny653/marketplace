-- Create UUIDs for categories
DO $$ 
DECLARE
    electronics_id UUID := gen_random_uuid();
    wardrobe_id UUID := gen_random_uuid();
    furniture_id UUID := gen_random_uuid();
    cosmetics_id UUID := gen_random_uuid();
    mens_id UUID := gen_random_uuid();
    watch_id UUID := gen_random_uuid();
    toys_id UUID := gen_random_uuid();
BEGIN

-- First, create the categories if they don't exist
INSERT INTO categories (id, name, slug, description, image_url)
VALUES
  (electronics_id, 'Electronics', 'electronics', 'Electronic gadgets and devices', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'),
  (wardrobe_id, 'Wardrobe', 'wardrobe', 'Fashion and clothing items', 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3'),
  (furniture_id, 'Furniture', 'furniture', 'Home and office furniture', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc'),
  (cosmetics_id, 'Cosmetics', 'cosmetics', 'Beauty and personal care', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348'),
  (mens_id, 'Men''s Style', 'mens', 'Men''s fashion and accessories', 'https://images.unsplash.com/photo-1617137968427-85924c800a22'),
  (watch_id, 'Watches', 'watch', 'Smart watches and traditional timepieces', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'),
  (toys_id, 'Toys', 'toys', 'Children''s toys and games', 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f')
ON CONFLICT (slug) DO UPDATE 
SET 
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  description = EXCLUDED.description;

-- Now add the products
INSERT INTO products (id, name, slug, description, price, sale_price, category_id, image_url, stock_quantity, status, avg_rating)
VALUES
  -- Featured Products
  (gen_random_uuid(), 'Study Chair', 'study-chair', 'Comfortable study chair for long hours', 90.00, 70.00, (SELECT id FROM categories WHERE slug = 'furniture'), 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8', 50, 'active', 5),
  (gen_random_uuid(), 'Conditioner', 'conditioner', 'Premium hair conditioner', 24.00, NULL, (SELECT id FROM categories WHERE slug = 'cosmetics'), 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b', 100, 'active', 4.5),
  (gen_random_uuid(), 'Printed Shirt', 'printed-shirt', 'Stylish printed shirt', 18.00, 14.00, (SELECT id FROM categories WHERE slug = 'wardrobe'), 'https://images.unsplash.com/photo-1562157873-818bc0726f68', 75, 'active', 3.5),
  (gen_random_uuid(), 'Titan Watch', 'titan-watch', 'Classic Titan watch', 170.00, NULL, (SELECT id FROM categories WHERE slug = 'watch'), 'https://images.unsplash.com/photo-1524592094714-0f0654e20314', 30, 'active', 4),
  (gen_random_uuid(), 'VR Box Set', 'vr-box', 'Virtual Reality headset', 72.00, 55.00, (SELECT id FROM categories WHERE slug = 'electronics'), 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac', 25, 'active', 4.5),
  (gen_random_uuid(), 'Office Table', 'office-table', 'Modern office table', 85.00, 72.00, (SELECT id FROM categories WHERE slug = 'furniture'), 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd', 20, 'active', 5),

  -- Super Deals
  (gen_random_uuid(), 'Head Phone', 'headphone', 'Premium wireless headphones', 120.00, 110.00, (SELECT id FROM categories WHERE slug = 'electronics'), 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', 40, 'active', 4),
  (gen_random_uuid(), 'Play Station', 'playstation', 'Gaming console', 190.00, 170.00, (SELECT id FROM categories WHERE slug = 'electronics'), 'https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42', 15, 'active', 4.5),
  (gen_random_uuid(), 'Gaming Laptop', 'gaming-laptop', 'High-performance gaming laptop', 225.00, 215.00, (SELECT id FROM categories WHERE slug = 'electronics'), 'https://images.unsplash.com/photo-1603302576837-37561b2e2302', 10, 'active', 4.5),
  (gen_random_uuid(), 'Smart Watch', 'smartwatch', 'Feature-rich smartwatch', 75.00, 50.00, (SELECT id FROM categories WHERE slug = 'watch'), 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', 35, 'active', 4),
  (gen_random_uuid(), 'Mobile Phone', 'mobile-phone', 'Latest smartphone', 150.00, 125.00, (SELECT id FROM categories WHERE slug = 'electronics'), 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', 45, 'active', 4.5),

  -- Featured Categories Products
  (gen_random_uuid(), 'Rocket Toy', 'rocket-toy', 'Educational rocket toy', 70.00, NULL, (SELECT id FROM categories WHERE slug = 'toys'), 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f', 30, 'active', 4),
  (gen_random_uuid(), 'Half T-shirt', 'half-tshirt', 'Casual half sleeve t-shirt', 10.00, 8.00, (SELECT id FROM categories WHERE slug = 'wardrobe'), 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 100, 'active', 5),
  (gen_random_uuid(), 'Glass Table', 'glass-table', 'Modern glass coffee table', 88.00, NULL, (SELECT id FROM categories WHERE slug = 'furniture'), 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4', 15, 'active', 4.5),
  (gen_random_uuid(), 'Casual Shoe', 'casual-shoe', 'Comfortable casual shoes', 45.00, NULL, (SELECT id FROM categories WHERE slug = 'wardrobe'), 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77', 60, 'active', 4),
  (gen_random_uuid(), 'Nail Polish', 'nail-polish', 'Long-lasting nail polish', 18.25, NULL, (SELECT id FROM categories WHERE slug = 'cosmetics'), 'https://images.unsplash.com/photo-1632345031435-8727f6897d53', 80, 'active', 4.5),
  (gen_random_uuid(), 'Slide Toy', 'slide-toy', 'Fun slide toy for kids', 55.00, NULL, (SELECT id FROM categories WHERE slug = 'toys'), 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4', 25, 'active', 4)
ON CONFLICT (slug) DO UPDATE 
SET 
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  sale_price = EXCLUDED.sale_price,
  category_id = EXCLUDED.category_id,
  image_url = EXCLUDED.image_url,
  avg_rating = EXCLUDED.avg_rating,
  stock_quantity = EXCLUDED.stock_quantity;

END $$;
