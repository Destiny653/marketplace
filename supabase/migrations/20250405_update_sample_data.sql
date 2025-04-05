-- Update product images to use placehold.co
UPDATE products 
SET image_url = CASE 
    -- Electronics
    WHEN name = 'iPhone 14 Pro' THEN 'https://placehold.co/800x800/969696/FFFFFF/png?text=iPhone+14+Pro'
    WHEN name = 'Samsung 4K TV' THEN 'https://placehold.co/800x800/969696/FFFFFF/png?text=Samsung+4K+TV'
    WHEN name = 'MacBook Pro M2' THEN 'https://placehold.co/800x800/969696/FFFFFF/png?text=MacBook+Pro'
    
    -- Fashion
    WHEN name = 'Leather Jacket' THEN 'https://placehold.co/800x800/8B4513/FFFFFF/png?text=Leather+Jacket'
    WHEN name = 'Designer Handbag' THEN 'https://placehold.co/800x800/FFB6C1/FFFFFF/png?text=Designer+Handbag'
    WHEN name = 'Running Shoes' THEN 'https://placehold.co/800x800/4682B4/FFFFFF/png?text=Running+Shoes'
    
    -- Home & Living
    WHEN name = 'Sofa Set' THEN 'https://placehold.co/800x800/8B4513/FFFFFF/png?text=Sofa+Set'
    WHEN name = 'Dining Table' THEN 'https://placehold.co/800x800/DEB887/FFFFFF/png?text=Dining+Table'
    WHEN name = 'Smart LED Lamp' THEN 'https://placehold.co/800x800/FFD700/FFFFFF/png?text=Smart+LED+Lamp'
    
    -- Books
    WHEN name = 'The Great Gatsby' THEN 'https://placehold.co/800x1200/000080/FFFFFF/png?text=The+Great+Gatsby'
    WHEN name = 'Python Programming' THEN 'https://placehold.co/800x1200/4169E1/FFFFFF/png?text=Python+Programming'
    WHEN name = 'Cooking Masterclass' THEN 'https://placehold.co/800x1200/DC143C/FFFFFF/png?text=Cooking+Masterclass'
    
    -- Sports
    WHEN name = 'Tennis Racket' THEN 'https://placehold.co/800x800/32CD32/FFFFFF/png?text=Tennis+Racket'
    WHEN name = 'Basketball' THEN 'https://placehold.co/800x800/FF8C00/FFFFFF/png?text=Basketball'
    WHEN name = 'Yoga Mat' THEN 'https://placehold.co/800x800/DA70D6/FFFFFF/png?text=Yoga+Mat'
    
    -- Beauty
    WHEN name = 'Face Cream' THEN 'https://placehold.co/800x800/FFB6C1/FFFFFF/png?text=Face+Cream'
    WHEN name = 'Hair Dryer' THEN 'https://placehold.co/800x800/FF69B4/FFFFFF/png?text=Hair+Dryer'
    WHEN name = 'Perfume Set' THEN 'https://placehold.co/800x800/DDA0DD/FFFFFF/png?text=Perfume+Set'
END
WHERE name IN (
    'iPhone 14 Pro', 'Samsung 4K TV', 'MacBook Pro M2',
    'Leather Jacket', 'Designer Handbag', 'Running Shoes',
    'Sofa Set', 'Dining Table', 'Smart LED Lamp',
    'The Great Gatsby', 'Python Programming', 'Cooking Masterclass',
    'Tennis Racket', 'Basketball', 'Yoga Mat',
    'Face Cream', 'Hair Dryer', 'Perfume Set'
);
