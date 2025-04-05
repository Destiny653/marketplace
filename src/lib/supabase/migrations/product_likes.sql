-- Consolidated product likes migration file
-- This combines functionality from create_product_likes_table.sql, create_like_functions.sql, and fix_like_permissions.sql

-- Ensure the product_likes table exists with the correct structure
CREATE TABLE IF NOT EXISTS public.product_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Add total_likes column to products table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'total_likes'
  ) THEN
    ALTER TABLE public.products ADD COLUMN total_likes INTEGER DEFAULT 0;
  END IF;
END $$;

-- Function to increment the total_likes count for a product
CREATE OR REPLACE FUNCTION increment_product_likes(product_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE products
  SET total_likes = total_likes + 1
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement the total_likes count for a product
CREATE OR REPLACE FUNCTION decrement_product_likes(product_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE products
  SET total_likes = GREATEST(total_likes - 1, 0)  -- Prevent negative counts
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update the total_likes count on the products table
CREATE OR REPLACE FUNCTION update_product_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE products SET total_likes = total_likes + 1 WHERE id = NEW.product_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE products SET total_likes = GREATEST(total_likes - 1, 0) WHERE id = OLD.product_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_trigger 
    WHERE tgname = 'update_product_likes_count_trigger'
  ) THEN
    CREATE TRIGGER update_product_likes_count_trigger
      AFTER INSERT OR DELETE ON public.product_likes
      FOR EACH ROW
      EXECUTE FUNCTION update_product_likes_count();
  END IF;
END $$;

-- Enable RLS on the product_likes table
ALTER TABLE public.product_likes ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own likes" ON public.product_likes;
DROP POLICY IF EXISTS "Users can add their own likes" ON public.product_likes;
DROP POLICY IF EXISTS "Users can remove their own likes" ON public.product_likes;

-- Create RLS policies
CREATE POLICY "Users can view their own likes"
  ON public.product_likes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own likes"
  ON public.product_likes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own likes"
  ON public.product_likes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add a policy for authenticated users to view products they've liked
CREATE POLICY "Authenticated users can view products they've liked"
  ON public.products
  FOR SELECT
  USING (true);  -- Allow all authenticated users to view products

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.increment_product_likes(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.decrement_product_likes(UUID) TO authenticated;