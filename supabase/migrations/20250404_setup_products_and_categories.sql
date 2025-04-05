-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    image_url TEXT,
    stock_quantity INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create orders table with status tracking
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_intent_id VARCHAR(255),
    shipping_method VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create order items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    price_at_time DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Sample categories
INSERT INTO categories (name, slug, description, image_url) VALUES
('Watch', 'watch', 'Luxury and smart watches', 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop'),
('Wardrobe', 'wardrobe', 'Stylish clothing and accessories', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=800&auto=format&fit=crop'),
('Technology', 'technology', 'Latest gadgets and electronics', 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=800&auto=format&fit=crop'),
('Kids Toy', 'kids-toy', 'Educational and fun toys for children', 'https://images.unsplash.com/photo-1584399069166-9aad7fd2be8d?q=80&w=800&auto=format&fit=crop'),
('Furniture', 'furniture', 'Modern and classic furniture', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop'),
('Fashion', 'fashion', 'Trendy fashion items', 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=800&auto=format&fit=crop');

-- Sample products
INSERT INTO products (name, slug, description, price, category_id, image_url, stock_quantity, status) 
SELECT 
    'Premium Watch',
    'premium-watch',
    'Elegant premium watch with advanced features',
    299.99,
    id,
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop',
    50,
    'active'
FROM categories 
WHERE slug = 'watch';

INSERT INTO products (name, slug, description, price, category_id, image_url, stock_quantity, status) 
SELECT 
    'Designer Jacket',
    'designer-jacket',
    'Premium designer jacket for all seasons',
    199.99,
    id,
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=800&auto=format&fit=crop',
    30,
    'active'
FROM categories 
WHERE slug = 'wardrobe';

INSERT INTO products (name, slug, description, price, category_id, image_url, stock_quantity, status) 
SELECT 
    'Smart Tablet',
    'smart-tablet',
    'High-performance tablet with stunning display',
    499.99,
    id,
    'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=800&auto=format&fit=crop',
    20,
    'active'
FROM categories 
WHERE slug = 'technology';

-- Create RPC function for order creation with status
CREATE OR REPLACE FUNCTION create_order(
    p_user_id UUID,
    p_items JSONB,
    p_shipping_address JSONB,
    p_billing_address JSONB,
    p_shipping_method VARCHAR,
    p_payment_method VARCHAR
) RETURNS UUID AS $$
DECLARE
    v_order_id UUID;
    v_total DECIMAL(10, 2) := 0;
    v_item JSONB;
BEGIN
    -- Calculate total amount
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_total := v_total + (v_item->>'quantity')::INTEGER * (
            SELECT price FROM products WHERE id = (v_item->>'product_id')::UUID
        );
    END LOOP;

    -- Create order
    INSERT INTO orders (
        user_id,
        total_amount,
        shipping_address,
        billing_address,
        shipping_method,
        payment_method,
        status,
        payment_status
    ) VALUES (
        p_user_id,
        v_total,
        p_shipping_address,
        p_billing_address,
        p_shipping_method,
        p_payment_method,
        'pending',
        'pending'
    ) RETURNING id INTO v_order_id;

    -- Create order items
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        INSERT INTO order_items (
            order_id,
            product_id,
            quantity,
            price_at_time
        ) VALUES (
            v_order_id,
            (v_item->>'product_id')::UUID,
            (v_item->>'quantity')::INTEGER,
            (SELECT price FROM products WHERE id = (v_item->>'product_id')::UUID)
        );
    END LOOP;

    RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
