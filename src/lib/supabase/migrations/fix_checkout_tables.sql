-- This migration fixes issues caused by having two conflicting order table schemas
-- It ensures we're using the schema from create_checkout_tables.sql and removes any duplicates

-- First, check if we have the old schema orders table
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'first_name'
    ) INTO column_exists;
    
    -- If the old schema exists, we need to migrate data and recreate tables
    IF column_exists THEN
        -- Backup any existing orders to a temporary table
        CREATE TABLE IF NOT EXISTS orders_backup AS 
        SELECT * FROM orders;
        
        CREATE TABLE IF NOT EXISTS order_items_backup AS 
        SELECT * FROM order_items;
        
        -- Drop existing tables and their dependencies
        DROP TABLE IF EXISTS order_items CASCADE;
        DROP TABLE IF EXISTS orders CASCADE;
        
        -- Drop existing functions and triggers
        DROP FUNCTION IF EXISTS update_product_stock() CASCADE;
        DROP FUNCTION IF EXISTS update_order_timestamp() CASCADE;
    END IF;
END $$;

-- Recreate the tables with the correct schema (from create_checkout_tables.sql)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  payment_intent_id VARCHAR(255),
  payment_status VARCHAR(50) DEFAULT 'unpaid',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add additional fields for order tracking
  tracking_number VARCHAR(100),
  shipping_method VARCHAR(100),
  estimated_delivery TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Create order items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update product stock when order is placed
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- Decrease the stock quantity for the product
  UPDATE products
  SET stock_quantity = stock_quantity - NEW.quantity
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update stock when order item is inserted
CREATE TRIGGER update_product_stock_trigger
AFTER INSERT ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION update_product_stock();

-- Create function to restore product stock when order item is deleted or updated
CREATE OR REPLACE FUNCTION restore_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- Restore the stock quantity for the product
  UPDATE products
  SET stock_quantity = stock_quantity + OLD.quantity
  WHERE id = OLD.product_id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to restore stock when order item is deleted
CREATE TRIGGER restore_product_stock_on_delete_trigger
BEFORE DELETE ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION restore_product_stock();

-- Create trigger to adjust stock when order item is updated
CREATE OR REPLACE FUNCTION adjust_product_stock_on_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Adjust the stock quantity for the product
  UPDATE products
  SET stock_quantity = stock_quantity + OLD.quantity - NEW.quantity
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to adjust stock when order item is updated
CREATE TRIGGER adjust_product_stock_on_update_trigger
BEFORE UPDATE ON public.order_items
FOR EACH ROW
WHEN (OLD.quantity IS DISTINCT FROM NEW.quantity)
EXECUTE FUNCTION adjust_product_stock_on_update();

-- Setup RLS policies for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;

-- Recreate policies
CREATE POLICY "Users can view their own orders"
  ON public.orders
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders"
  ON public.orders
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Setup RLS policies for order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can insert their own order items" ON public.order_items;

-- Recreate policies
CREATE POLICY "Users can view their own order items"
  ON public.order_items
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own order items"
  ON public.order_items
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  ));

-- Create a function to calculate order total
CREATE OR REPLACE FUNCTION calculate_order_total(order_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
  total DECIMAL(10, 2);
BEGIN
  SELECT SUM(total_price) INTO total
  FROM public.order_items
  WHERE order_id = order_uuid;
  
  RETURN total;
END;
$$ LANGUAGE plpgsql;

-- Add a function to create a complete order with items
CREATE OR REPLACE FUNCTION create_order(
  p_user_id UUID,
  p_shipping_address JSONB,
  p_billing_address JSONB,
  p_shipping_method VARCHAR(100),
  p_items JSONB
)
RETURNS UUID AS $$
DECLARE
  order_id UUID;
  item JSONB;
  product_record RECORD;
  item_total DECIMAL(10, 2);
  order_total DECIMAL(10, 2) := 0;
BEGIN
  -- Create the order first with 0 total (will update later)
  INSERT INTO public.orders (
    user_id, 
    shipping_address, 
    billing_address, 
    shipping_method,
    total_amount
  )
  VALUES (
    p_user_id, 
    p_shipping_address, 
    p_billing_address, 
    p_shipping_method,
    0
  )
  RETURNING id INTO order_id;
  
  -- Process each item in the order
  FOR item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    -- Get product details
    SELECT id, price, stock_quantity INTO product_record
    FROM public.products
    WHERE id = (item->>'product_id')::UUID;
    
    -- Check if product exists and has enough stock
    IF product_record.id IS NULL THEN
      RAISE EXCEPTION 'Product with ID % not found', (item->>'product_id');
    END IF;
    
    IF product_record.stock_quantity < (item->>'quantity')::INTEGER THEN
      RAISE EXCEPTION 'Not enough stock for product %', (item->>'product_id');
    END IF;
    
    -- Calculate item total
    item_total := product_record.price * (item->>'quantity')::INTEGER;
    order_total := order_total + item_total;
    
    -- Insert order item
    INSERT INTO public.order_items (
      order_id,
      product_id,
      quantity,
      unit_price,
      total_price
    )
    VALUES (
      order_id,
      product_record.id,
      (item->>'quantity')::INTEGER,
      product_record.price,
      item_total
    );
  END LOOP;
  
  -- Update order with the total amount
  UPDATE public.orders
  SET total_amount = order_total
  WHERE id = order_id;
  
  RETURN order_id;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.create_order(UUID, JSONB, JSONB, VARCHAR, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_order_total(UUID) TO authenticated;