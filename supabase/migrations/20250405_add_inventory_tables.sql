-- Create inventory transactions table
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    quantity_change INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL,
    reference_id UUID,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add index for product_id
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_product ON inventory_transactions(product_id);

-- Add index for reference_id (for looking up transactions by order)
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_reference ON inventory_transactions(reference_id);

-- Add RLS policies
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users
CREATE POLICY "Allow read access to authenticated users"
ON inventory_transactions FOR SELECT
TO authenticated
USING (true);

-- Allow insert access to authenticated users
CREATE POLICY "Allow insert access to authenticated users"
ON inventory_transactions FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow update access to authenticated users
CREATE POLICY "Allow update access to authenticated users"
ON inventory_transactions FOR UPDATE
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

-- Allow delete access to authenticated users
CREATE POLICY "Allow delete access to authenticated users"
ON inventory_transactions FOR DELETE
TO authenticated
USING (created_by = auth.uid());
