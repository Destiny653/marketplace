-- Add nullable slug column to categories table first
ALTER TABLE categories
ADD COLUMN slug VARCHAR(255);

-- Update existing categories with slugs based on their names
UPDATE categories
SET slug = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g'));

-- Now make it NOT NULL and UNIQUE
ALTER TABLE categories
ALTER COLUMN slug SET NOT NULL,
ADD CONSTRAINT categories_slug_unique UNIQUE (slug);

-- Add nullable slug and sale_price columns to products table
ALTER TABLE products
ADD COLUMN slug VARCHAR(255),
ADD COLUMN sale_price DECIMAL(10,2);

-- Update existing products with slugs based on their names
UPDATE products
SET slug = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g'));

-- Now make slug NOT NULL and UNIQUE
ALTER TABLE products
ALTER COLUMN slug SET NOT NULL,
ADD CONSTRAINT products_slug_unique UNIQUE (slug);
