-- Function to create a new order
CREATE OR REPLACE FUNCTION create_order(
    p_user_id UUID,
    p_items JSONB,
    p_billing_address JSONB,
    p_shipping_address JSONB,
    p_shipping_method TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_order_id UUID;
    v_total_amount DECIMAL(10,2) := 0;
    v_item JSONB;
    v_product_id UUID;
    v_quantity INTEGER;
    v_unit_price DECIMAL(10,2);
    v_available_stock INTEGER;
BEGIN
    -- Start transaction
    BEGIN
        -- Calculate total and validate stock
        FOR v_item IN SELECT * FROM jsonb_array_elements_text(p_items::jsonb)
        LOOP
            -- Parse the item JSON
            v_product_id := (v_item::jsonb->>'id')::UUID;
            v_quantity := (v_item::jsonb->>'quantity')::INTEGER;
            
            IF v_product_id IS NULL OR v_quantity IS NULL THEN
                RAISE EXCEPTION 'Invalid item format in array';
            END IF;
            
            -- Get current price and stock
            SELECT price, stock_quantity 
            INTO v_unit_price, v_available_stock
            FROM products 
            WHERE id = v_product_id;

            -- Validate stock
            IF v_available_stock < v_quantity THEN
                RAISE EXCEPTION 'Insufficient stock for product %', v_product_id;
            END IF;

            -- Add to total
            v_total_amount := v_total_amount + (v_unit_price * v_quantity);
        END LOOP;

        -- Create order
        INSERT INTO orders (
            user_id,
            status,
            total_amount,
            billing_address,
            shipping_address,
            shipping_method
        ) VALUES (
            p_user_id,
            'pending',
            v_total_amount,
            p_billing_address,
            p_shipping_address,
            p_shipping_method
        ) RETURNING id INTO v_order_id;

        -- Create order items and update stock
        FOR v_item IN SELECT * FROM jsonb_array_elements_text(p_items::jsonb)
        LOOP
            -- Parse the item JSON
            v_product_id := (v_item::jsonb->>'id')::UUID;
            v_quantity := (v_item::jsonb->>'quantity')::INTEGER;
            
            -- Get current price
            SELECT price INTO v_unit_price
            FROM products 
            WHERE id = v_product_id;

            -- Create order item
            INSERT INTO order_items (
                order_id,
                product_id,
                quantity,
                price_at_time
            ) VALUES (
                v_order_id,
                v_product_id,
                v_quantity,
                v_unit_price
            );

            -- Update stock
            UPDATE products
            SET stock_quantity = stock_quantity - v_quantity
            WHERE id = v_product_id;

            -- Create inventory transaction
            INSERT INTO inventory_transactions (
                product_id,
                quantity_change,
                type,
                reference_id,
                notes,
                created_by
            ) VALUES (
                v_product_id,
                -v_quantity,
                'order',
                v_order_id,
                'Order placement',
                p_user_id
            );
        END LOOP;

        -- Clear user's cart
        DELETE FROM carts WHERE user_id = p_user_id;

        RETURN v_order_id;
    EXCEPTION WHEN OTHERS THEN
        -- Rollback happens automatically
        RAISE;
    END;
END;
$$;
