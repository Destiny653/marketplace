-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create initial categories
INSERT INTO categories (name, slug, description, image_url) VALUES
  ('Electronics', 'electronics', 'Electronic devices and gadgets', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'),
  ('Wardrobe', 'wardrobe', 'Fashion and clothing items', 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3'),
  ('Furniture', 'furniture', 'Home and office furniture', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc'),
  ('Cosmetics', 'cosmetics', 'Beauty and personal care products', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348'),
  ('Mens', 'mens', 'Men''s fashion and accessories', 'https://images.unsplash.com/photo-1617137968427-85924c800a22'),
  ('Watch', 'watch', 'Watches and accessories', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30');
