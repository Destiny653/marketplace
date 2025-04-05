-- Create the wishlists table
CREATE OR REPLACE FUNCTION create_wishlists_table()
RETURNS void AS $$
BEGIN
  -- Create the wishlists table if it doesn't exist
  CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    product_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    CONSTRAINT unique_user_product UNIQUE (user_id, product_id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
  );

  -- Create an index for faster lookups by user_id
  CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON public.wishlists(user_id);

  -- Set up RLS (Row Level Security)
  ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

  -- Create policies for wishlist access
  -- Allow users to view only their own wishlist items
  DROP POLICY IF EXISTS "Users can view their own wishlist items" ON public.wishlists;
  CREATE POLICY "Users can view their own wishlist items"
    ON public.wishlists
    FOR SELECT
    USING (auth.uid() = user_id);

  -- Allow users to insert items into their own wishlist
  DROP POLICY IF EXISTS "Users can add to their own wishlist" ON public.wishlists;
  CREATE POLICY "Users can add to their own wishlist"
    ON public.wishlists
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

  -- Allow users to delete items from their own wishlist
  DROP POLICY IF EXISTS "Users can remove from their own wishlist" ON public.wishlists;
  CREATE POLICY "Users can remove from their own wishlist"
    ON public.wishlists
    FOR DELETE
    USING (auth.uid() = user_id);
END;
$$ LANGUAGE plpgsql;