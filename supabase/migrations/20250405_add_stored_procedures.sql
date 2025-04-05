-- Function to update total_likes for a specific product
CREATE OR REPLACE FUNCTION update_product_likes_count(product_id_param UUID DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF product_id_param IS NULL THEN
    -- Update all products
    UPDATE products p
    SET total_likes = COALESCE(
      (SELECT COUNT(*)::numeric 
       FROM product_likes pl 
       WHERE pl.product_id = p.id
      ), 0
    );
  ELSE
    -- Update specific product
    UPDATE products p
    SET total_likes = COALESCE(
      (SELECT COUNT(*)::numeric 
       FROM product_likes pl 
       WHERE pl.product_id = p.id
      ), 0
    )
    WHERE p.id = product_id_param;
  END IF;
END;
$$;

-- Trigger to automatically update product likes count
CREATE OR REPLACE FUNCTION update_product_likes_count_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM update_product_likes_count(NEW.product_id);
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM update_product_likes_count(OLD.product_id);
  END IF;
  RETURN NULL;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS product_likes_count_update ON product_likes;

-- Create trigger
CREATE TRIGGER product_likes_count_update
AFTER INSERT OR DELETE ON product_likes
FOR EACH ROW
EXECUTE FUNCTION update_product_likes_count_trigger();
