// Seed script for populating the database with sample products
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: '.env.local' });

// Use the service role key to bypass RLS policies
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seedDatabase() {
  console.log('Starting database seeding...');

  // Categories with UUIDs
  const categoryIds = {
    electronics: uuidv4(),
    wardrobe: uuidv4(),
    furniture: uuidv4(),
    cosmetics: uuidv4(),
    mens: uuidv4(),
    watch: uuidv4()
  };

  const categories = [
    {
      id: categoryIds.electronics,
      name: 'Electronics',
      slug: 'electronics',
      description: 'Latest electronic gadgets and devices',
      image_url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: categoryIds.wardrobe,
      name: 'Wardrobe',
      slug: 'wardrobe',
      description: 'Stylish clothing and accessories',
      image_url: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: categoryIds.furniture,
      name: 'Furniture',
      slug: 'furniture',
      description: 'Modern and classic furniture for your home',
      image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: categoryIds.cosmetics,
      name: 'Cosmetics',
      slug: 'cosmetics',
      description: 'Beauty and skincare products',
      image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: categoryIds.mens,
      name: 'Men\'s Style',
      slug: 'mens',
      description: 'Fashion and accessories for men',
      image_url: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: categoryIds.watch,
      name: 'Watches',
      slug: 'watch',
      description: 'Luxury and smart watches',
      image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'
    }
  ];

  // Insert categories
  console.log('Inserting categories...');
  for (const category of categories) {
    const { error } = await supabase
      .from('categories')
      .upsert(category);
    
    if (error) {
      console.error(`Error inserting category ${category.name}:`, error);
    } else {
      console.log(`Inserted category: ${category.name}`);
    }
  }

  // Products data by category
  const productsByCategory = {
    electronics: [
      {
        id: uuidv4(),
        name: 'Wireless Headphones',
        slug: 'wireless-headphones',
        description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
        price: 299.99,
        sale_price: 249.99,
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
        category_id: categoryIds.electronics,
        status: 'active',
        avg_rating: 4.7
      },
      {
        id: uuidv4(),
        name: 'Smart Speaker',
        slug: 'smart-speaker',
        description: 'Voice-controlled smart speaker with premium sound quality',
        price: 199.99,
        sale_price: 159.99,
        image_url: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?q=80&w=1000&auto=format&fit=crop',
        category_id: categoryIds.electronics,
        status: 'active',
        avg_rating: 4.5
      },
      {
        id: uuidv4(),
        name: 'Ultra HD Smart TV',
        slug: 'ultra-hd-smart-tv',
        description: '65-inch 4K Ultra HD Smart TV with HDR and built-in streaming apps',
        price: 1299.99,
        sale_price: 999.99,
        image_url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=1000&auto=format&fit=crop',
        category_id: categoryIds.electronics,
        status: 'active',
        avg_rating: 4.8
      }
    ],
    wardrobe: [
      {
        id: uuidv4(),
        name: 'Designer Dress',
        slug: 'designer-dress',
        description: 'Elegant designer dress perfect for special occasions',
        price: 199.99,
        sale_price: 149.99,
        image_url: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1000&auto=format&fit=crop',
        category_id: categoryIds.wardrobe,
        status: 'active',
        avg_rating: 4.6
      },
      {
        id: uuidv4(),
        name: 'Premium Jeans',
        slug: 'premium-jeans',
        description: 'High-quality denim jeans with perfect fit and comfort',
        price: 89.99,
        sale_price: 69.99,
        image_url: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?q=80&w=1000&auto=format&fit=crop',
        category_id: categoryIds.wardrobe,
        status: 'active',
        avg_rating: 4.5
      },
      {
        id: uuidv4(),
        name: 'Casual T-Shirt',
        slug: 'casual-tshirt',
        description: 'Comfortable cotton t-shirt for everyday wear',
        price: 29.99,
        sale_price: null,
        image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop',
        category_id: categoryIds.wardrobe,
        status: 'active',
        avg_rating: 4.3
      }
    ],
    furniture: [
      {
        id: uuidv4(),
        name: 'Modern Sofa',
        slug: 'modern-sofa',
        description: 'Contemporary 3-seater sofa with premium fabric upholstery',
        price: 899.99,
        sale_price: 749.99,
        image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop',
        category_id: categoryIds.furniture,
        status: 'active',
        avg_rating: 4.7
      },
      {
        id: uuidv4(),
        name: 'Dining Table Set',
        slug: 'dining-table-set',
        description: 'Elegant dining table with 6 chairs made from solid wood',
        price: 1299.99,
        sale_price: 999.99,
        image_url: 'https://images.unsplash.com/photo-1617098900591-3f90928e8c54?q=80&w=1000&auto=format&fit=crop',
        category_id: categoryIds.furniture,
        status: 'active',
        avg_rating: 4.6
      },
      {
        id: uuidv4(),
        name: 'Queen Size Bed',
        slug: 'queen-size-bed',
        description: 'Luxurious queen size bed with upholstered headboard',
        price: 799.99,
        sale_price: 699.99,
        image_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1000&auto=format&fit=crop',
        category_id: categoryIds.furniture,
        status: 'active',
        avg_rating: 4.8
      }
    ],
    cosmetics: [
      {
        id: uuidv4(),
        name: 'Premium Skincare Set',
        slug: 'premium-skincare-set',
        description: 'Complete skincare routine with cleanser, toner, serum, and moisturizer',
        price: 149.99,
        sale_price: 119.99,
        image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1000&auto=format&fit=crop',
        category_id: categoryIds.cosmetics,
        status: 'active',
        avg_rating: 4.8
      },
      {
        id: uuidv4(),
        name: 'Luxury Perfume',
        slug: 'luxury-perfume',
        description: 'Elegant fragrance with notes of jasmine, rose, and sandalwood',
        price: 89.99,
        sale_price: 74.99,
        image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop',
        category_id: categoryIds.cosmetics,
        status: 'active',
        avg_rating: 4.7
      },
      {
        id: uuidv4(),
        name: 'Makeup Palette',
        slug: 'makeup-palette',
        description: 'Versatile eyeshadow palette with 24 highly pigmented shades',
        price: 59.99,
        sale_price: 49.99,
        image_url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1000&auto=format&fit=crop',
        category_id: categoryIds.cosmetics,
        status: 'active',
        avg_rating: 4.6
      }
    ],
    mens: [
      {
        id: uuidv4(),
        name: 'Business Suit',
        slug: 'business-suit',
        description: 'Classic tailored business suit in navy blue',
        price: 399.99,
        sale_price: 349.99,
        image_url: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1000&auto=format&fit=crop',
        category_id: categoryIds.mens,
        status: 'active',
        avg_rating: 4.8
      },
      {
        id: uuidv4(),
        name: 'Casual Shirt',
        slug: 'casual-shirt',
        description: 'Comfortable button-down shirt for casual and semi-formal occasions',
        price: 59.99,
        sale_price: 49.99,
        image_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop',
        category_id: categoryIds.mens,
        status: 'active',
        avg_rating: 4.5
      },
      {
        id: uuidv4(),
        name: 'Designer Jeans',
        slug: 'designer-jeans',
        description: 'Premium denim jeans with perfect fit and modern style',
        price: 89.99,
        sale_price: 74.99,
        image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1000&auto=format&fit=crop',
        category_id: categoryIds.mens,
        status: 'active',
        avg_rating: 4.6
      }
    ],
    watch: [
      {
        id: uuidv4(),
        name: 'Luxury Automatic Watch',
        slug: 'luxury-automatic-watch',
        description: 'Premium automatic watch with sapphire crystal and leather strap',
        price: 999.99,
        sale_price: 849.99,
        image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
        category_id: categoryIds.watch,
        status: 'active',
        avg_rating: 4.9
      },
      {
        id: uuidv4(),
        name: 'Smart Watch Pro',
        slug: 'smart-watch-pro',
        description: 'Advanced smartwatch with health monitoring and GPS',
        price: 349.99,
        sale_price: 299.99,
        image_url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1000&auto=format&fit=crop',
        category_id: categoryIds.watch,
        status: 'active',
        avg_rating: 4.7
      },
      {
        id: uuidv4(),
        name: 'Chronograph Watch',
        slug: 'chronograph-watch',
        description: 'Stylish chronograph watch with stainless steel bracelet',
        price: 249.99,
        sale_price: 199.99,
        image_url: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1000&auto=format&fit=crop',
        category_id: categoryIds.watch,
        status: 'active',
        avg_rating: 4.6
      }
    ]
  };

  // Insert products
  console.log('Inserting products...');
  for (const categoryId in productsByCategory) {
    const products = productsByCategory[categoryId];
    for (const product of products) {
      const { error } = await supabase
        .from('products')
        .upsert(product);
      
      if (error) {
        console.error(`Error inserting product ${product.name}:`, error);
      } else {
        console.log(`Inserted product: ${product.name}`);
      }
    }
  }

  // Blog posts
  const blogPosts = [
    {
      id: uuidv4(),
      title: 'Top Fashion Trends for 2025',
      slug: 'top-fashion-trends-2025',
      excerpt: 'Discover the hottest fashion trends that will dominate 2025.',
      content: '<p>Fashion is always evolving, and 2025 is set to bring some exciting new trends. From sustainable materials to bold colors, here\'s what you need to know to stay ahead of the curve.</p>',
      image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop',
      status: 'published',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
    },
    {
      id: uuidv4(),
      title: 'How to Choose the Perfect Watch for Your Style',
      slug: 'choose-perfect-watch-style',
      excerpt: 'A comprehensive guide to finding the ideal timepiece that matches your personal style.',
      content: '<p>A watch is more than just a timekeeping device—it\'s a statement piece that reflects your personal style. Whether you\'re looking for a luxury timepiece or a practical everyday watch, this guide will help you make the right choice.</p>',
      image_url: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1000&auto=format&fit=crop',
      status: 'published',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
    }
  ];

  // Insert blog posts
  console.log('Inserting blog posts...');
  for (const post of blogPosts) {
    const { error } = await supabase
      .from('blog_posts')
      .upsert(post);
    
    if (error) {
      console.error(`Error inserting blog post ${post.title}:`, error);
    } else {
      console.log(`Inserted blog post: ${post.title}`);
    }
  }

  console.log('Database seeding completed!');
}

seedDatabase().catch(console.error);
