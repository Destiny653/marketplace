-- Function to update product total likes
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
      (SELECT COUNT(*) 
       FROM product_likes pl 
       WHERE pl.product_id = p.id
      ), 0
    );
  ELSE
    -- Update specific product
    UPDATE products p
    SET total_likes = COALESCE(
      (SELECT COUNT(*) 
       FROM product_likes pl 
       WHERE pl.product_id = p.id
      ), 0
    )
    WHERE p.id = product_id_param;
  END IF;
END;
$$;

-- Function to update product average rating
CREATE OR REPLACE FUNCTION update_product_avg_rating(product_id_param UUID DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF product_id_param IS NULL THEN
    -- Update all products
    UPDATE products p
    SET avg_rating = COALESCE(
      (SELECT AVG(rating)::real
       FROM product_reviews pr
       WHERE pr.product_id = p.id
      ), 0
    );
  ELSE
    -- Update specific product
    UPDATE products p
    SET avg_rating = COALESCE(
      (SELECT AVG(rating)::real
       FROM product_reviews pr
       WHERE pr.product_id = p.id
      ), 0
    )
    WHERE p.id = product_id_param;
  END IF;
END;
$$;

-- Function to update product stock quantity
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update product stock based on inventory transaction
  UPDATE products
  SET stock_quantity = stock_quantity + NEW.quantity_change
  WHERE id = NEW.product_id;
  
  -- Ensure stock doesn't go negative
  IF EXISTS (
    SELECT 1 FROM products 
    WHERE id = NEW.product_id 
    AND stock_quantity < 0
  ) THEN
    RAISE EXCEPTION 'Stock quantity cannot be negative';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger for product likes count
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

-- Trigger for product average rating
CREATE OR REPLACE FUNCTION update_product_avg_rating_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    PERFORM update_product_avg_rating(NEW.product_id);
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM update_product_avg_rating(OLD.product_id);
  END IF;
  RETURN NULL;
END;
$$;

-- Drop existing triggers
DROP TRIGGER IF EXISTS product_likes_count_update ON product_likes;
DROP TRIGGER IF EXISTS product_reviews_rating_update ON product_reviews;
DROP TRIGGER IF EXISTS inventory_stock_update ON inventory_transactions;

-- Create triggers
CREATE TRIGGER product_likes_count_update
  AFTER INSERT OR DELETE ON product_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_product_likes_count_trigger();

CREATE TRIGGER product_reviews_rating_update
  AFTER INSERT OR UPDATE OR DELETE ON product_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_avg_rating_trigger();

CREATE TRIGGER inventory_stock_update
  BEFORE INSERT ON inventory_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_product_stock();
