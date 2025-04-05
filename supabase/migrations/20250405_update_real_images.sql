-- Update product images with real Unsplash images
UPDATE products 
SET image_url = CASE 
    -- Electronics
    WHEN name = 'iPhone 14 Pro' THEN 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?q=80&w=800&auto=format&fit=crop'
    WHEN name = 'Samsung 4K TV' THEN 'https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=800&auto=format&fit=crop'
    WHEN name = 'MacBook Pro M2' THEN 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop'
    
    -- Fashion
    WHEN name = 'Leather Jacket' THEN 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop'
    WHEN name = 'Designer Handbag' THEN 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop'
    WHEN name = 'Running Shoes' THEN 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop'
    
    -- Home & Living
    WHEN name = 'Sofa Set' THEN 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop'
    WHEN name = 'Dining Table' THEN 'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=800&auto=format&fit=crop'
    WHEN name = 'Smart LED Lamp' THEN 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop'
    
    -- Books
    WHEN name = 'The Great Gatsby' THEN 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=800&auto=format&fit=crop'
    WHEN name = 'Python Programming' THEN 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop'
    WHEN name = 'Cooking Masterclass' THEN 'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?q=80&w=800&auto=format&fit=crop'
    
    -- Sports
    WHEN name = 'Tennis Racket' THEN 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=800&auto=format&fit=crop'
    WHEN name = 'Basketball' THEN 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop'
    WHEN name = 'Yoga Mat' THEN 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=800&auto=format&fit=crop'
    
    -- Beauty
    WHEN name = 'Face Cream' THEN 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=800&auto=format&fit=crop'
    WHEN name = 'Hair Dryer' THEN 'https://images.unsplash.com/photo-1522338140262-f46f5913618a?q=80&w=800&auto=format&fit=crop'
    WHEN name = 'Perfume Set' THEN 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop'
END
WHERE name IN (
    'iPhone 14 Pro', 'Samsung 4K TV', 'MacBook Pro M2',
    'Leather Jacket', 'Designer Handbag', 'Running Shoes',
    'Sofa Set', 'Dining Table', 'Smart LED Lamp',
    'The Great Gatsby', 'Python Programming', 'Cooking Masterclass',
    'Tennis Racket', 'Basketball', 'Yoga Mat',
    'Face Cream', 'Hair Dryer', 'Perfume Set'
);

-- Also update category images
UPDATE categories 
SET image_url = CASE 
    WHEN name = 'Electronics' THEN 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800&auto=format&fit=crop'
    WHEN name = 'Fashion' THEN 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800&auto=format&fit=crop'
    WHEN name = 'Home & Living' THEN 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=800&auto=format&fit=crop'
    WHEN name = 'Books' THEN 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?q=80&w=800&auto=format&fit=crop'
    WHEN name = 'Sports' THEN 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop'
    WHEN name = 'Beauty' THEN 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop'
END
WHERE name IN ('Electronics', 'Fashion', 'Home & Living', 'Books', 'Sports', 'Beauty');
