-- Drop incorrect default values from product_likes
ALTER TABLE product_likes 
ALTER COLUMN product_id DROP DEFAULT,
ALTER COLUMN user_id DROP DEFAULT;

-- Add unique constraint to product_likes
ALTER TABLE product_likes 
ADD CONSTRAINT product_likes_user_product_unique UNIQUE (user_id, product_id);

-- Fix foreign key constraints for product_likes
ALTER TABLE product_likes
DROP CONSTRAINT IF EXISTS product_likes_user_id_fkey,
DROP CONSTRAINT IF EXISTS product_likes_product_id_fkey;

ALTER TABLE product_likes
ADD CONSTRAINT product_likes_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE,
ADD CONSTRAINT product_likes_product_id_fkey 
    FOREIGN KEY (product_id) 
    REFERENCES products(id) 
    ON DELETE CASCADE;

-- Create carts table if it doesn't exist
CREATE TABLE IF NOT EXISTS carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    items JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT carts_user_id_fkey 
        FOREIGN KEY (user_id) 
        REFERENCES auth.users(id) 
        ON DELETE CASCADE,
    CONSTRAINT carts_user_id_unique UNIQUE (user_id)
);

-- Create trigger for carts updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_carts_updated_at ON carts;
CREATE TRIGGER update_carts_updated_at
    BEFORE UPDATE ON carts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_likes_user_product ON product_likes(user_id, product_id);
CREATE INDEX IF NOT EXISTS idx_carts_user ON carts(user_id);

-- Add RLS policies for product_likes
ALTER TABLE product_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all likes" ON product_likes;
CREATE POLICY "Users can view all likes" ON product_likes
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage their own likes" ON product_likes;
CREATE POLICY "Users can manage their own likes" ON product_likes
    FOR ALL USING (auth.uid() = user_id);

-- Add RLS policies for carts
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own cart" ON carts;
CREATE POLICY "Users can view their own cart" ON carts
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own cart" ON carts;
CREATE POLICY "Users can manage their own cart" ON carts
    FOR ALL USING (auth.uid() = user_id);
