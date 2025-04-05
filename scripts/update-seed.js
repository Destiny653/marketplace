// Updated seeding script that works with existing categories
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

// Direct credentials
const supabaseUrl = 'https://fadfwafokisfdatjcteu.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhZGZ3YWZva2lzZmRhdGpjdGV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzE1NDI2MSwiZXhwIjoyMDU4NzMwMjYxfQ.-_alAFIwYL5PU1kpNW5FB1gjTZM1l4_6rGbe_-xT5HI';

// Create Supabase client with admin privileges
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seedDatabase() {
  console.log('Starting updated database seeding...');

  // First, fetch existing categories
  console.log('Fetching existing categories...');
  const { data: existingCategories, error: categoriesError } = await supabase
    .from('categories')
    .select('id, name, slug');

  if (categoriesError) {
    console.error('Error fetching categories:', categoriesError);
    return;
  }

  console.log(`Found ${existingCategories.length} existing categories`);
  
  // Create a map of category slugs to IDs
  const categoryMap = {};
  existingCategories.forEach(category => {
    categoryMap[category.slug] = category.id;
  });

  // If any of our required categories don't exist, create them
  const requiredCategories = ['electronics', 'wardrobe', 'furniture', 'cosmetics', 'mens', 'watch'];
  const categoriesToCreate = [];

  for (const slug of requiredCategories) {
    if (!categoryMap[slug]) {
      const newCategory = {
        id: uuidv4(),
        name: slug.charAt(0).toUpperCase() + slug.slice(1),
        slug: slug,
        description: `Products in the ${slug} category`,
        image_url: `https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop`
      };
      categoriesToCreate.push(newCategory);
      categoryMap[slug] = newCategory.id;
    }
  }

  if (categoriesToCreate.length > 0) {
    console.log(`Creating ${categoriesToCreate.length} missing categories...`);
    const { error: createCategoriesError } = await supabase
      .from('categories')
      .upsert(categoriesToCreate);

    if (createCategoriesError) {
      console.error('Error creating categories:', createCategoriesError);
      return;
    }
  }

  // Now create products using the correct category IDs
  const products = [
    // Electronics
    {
      id: uuidv4(),
      name: 'Wireless Headphones',
      slug: 'wireless-headphones',
      description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
      price: 299.99,
      sale_price: 249.99,
      image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
      category_id: categoryMap['electronics'],
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
      category_id: categoryMap['electronics'],
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
      category_id: categoryMap['electronics'],
      status: 'active',
      avg_rating: 4.8
    },
    // Wardrobe
    {
      id: uuidv4(),
      name: 'Designer Dress',
      slug: 'designer-dress',
      description: 'Elegant designer dress perfect for special occasions',
      price: 199.99,
      sale_price: 149.99,
      image_url: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1000&auto=format&fit=crop',
      category_id: categoryMap['wardrobe'],
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
      category_id: categoryMap['wardrobe'],
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
      category_id: categoryMap['wardrobe'],
      status: 'active',
      avg_rating: 4.3
    },
    // Furniture
    {
      id: uuidv4(),
      name: 'Modern Sofa',
      slug: 'modern-sofa',
      description: 'Contemporary 3-seater sofa with premium fabric upholstery',
      price: 899.99,
      sale_price: 749.99,
      image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop',
      category_id: categoryMap['furniture'],
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
      category_id: categoryMap['furniture'],
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
      category_id: categoryMap['furniture'],
      status: 'active',
      avg_rating: 4.8
    },
    // Cosmetics
    {
      id: uuidv4(),
      name: 'Premium Skincare Set',
      slug: 'premium-skincare-set',
      description: 'Complete skincare routine with cleanser, toner, serum, and moisturizer',
      price: 149.99,
      sale_price: 119.99,
      image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1000&auto=format&fit=crop',
      category_id: categoryMap['cosmetics'],
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
      category_id: categoryMap['cosmetics'],
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
      category_id: categoryMap['cosmetics'],
      status: 'active',
      avg_rating: 4.6
    },
    // Men's Style
    {
      id: uuidv4(),
      name: 'Business Suit',
      slug: 'business-suit',
      description: 'Classic tailored business suit in navy blue',
      price: 399.99,
      sale_price: 349.99,
      image_url: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1000&auto=format&fit=crop',
      category_id: categoryMap['mens'],
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
      category_id: categoryMap['mens'],
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
      category_id: categoryMap['mens'],
      status: 'active',
      avg_rating: 4.6
    },
    // Watches
    {
      id: uuidv4(),
      name: 'Luxury Automatic Watch',
      slug: 'luxury-automatic-watch',
      description: 'Premium automatic watch with sapphire crystal and leather strap',
      price: 999.99,
      sale_price: 849.99,
      image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
      category_id: categoryMap['watch'],
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
      category_id: categoryMap['watch'],
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
      category_id: categoryMap['watch'],
      status: 'active',
      avg_rating: 4.6
    }
  ];

  // Insert products in smaller batches to avoid potential issues
  console.log('Inserting products...');
  const batchSize = 5;
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    const { error: productsError } = await supabase
      .from('products')
      .upsert(batch);
    
    if (productsError) {
      console.error(`Error inserting products batch ${i/batchSize + 1}:`, productsError);
    } else {
      console.log(`Inserted products batch ${i/batchSize + 1} (${batch.length} products)`);
    }
  }

  // Blog posts
  const blogPosts = [
    {
      id: uuidv4(),
      title: 'Top Fashion Trends for 2025',
      slug: 'top-fashion-trends-2025',
      excerpt: 'Discover the hottest fashion trends that will dominate 2025.',
      content: '<p>Fashion is always evolving, and 2025 is set to bring some exciting new trends. From sustainable materials to bold colors, here\'s what you need to know to stay ahead of the curve.</p><p>This year, we\'re seeing a strong emphasis on eco-friendly fashion, with designers focusing on sustainable materials and ethical production methods. Vibrant colors are making a comeback, with electric blue and bright orange leading the way.</p><p>Oversized silhouettes continue to dominate casual wear, while tailored pieces are seeing a renaissance in professional settings. The line between gendered clothing continues to blur, with more unisex options available than ever before.</p>',
      image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop',
      status: 'published',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
    },
    {
      id: uuidv4(),
      title: 'How to Choose the Perfect Watch for Your Style',
      slug: 'choose-perfect-watch-style',
      excerpt: 'A comprehensive guide to finding the ideal timepiece that matches your personal style.',
      content: '<p>A watch is more than just a timekeeping device—it\'s a statement piece that reflects your personal style. Whether you\'re looking for a luxury timepiece or a practical everyday watch, this guide will help you make the right choice.</p><p>First, consider your lifestyle. Are you active and need something durable? Or do you attend formal events where an elegant dress watch would be appropriate? Your daily activities should influence your choice.</p><p>Next, think about your personal style. Classic dressers might prefer a minimalist design with a leather strap, while those with a more contemporary style might opt for a chronograph or a watch with unique features.</p><p>Budget is also an important consideration. While luxury watches can be an investment, there are plenty of high-quality options at more accessible price points.</p>',
      image_url: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1000&auto=format&fit=crop',
      status: 'published',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
    }
  ];

  // Insert blog posts
  console.log('Inserting blog posts...');
  const { error: blogError } = await supabase
    .from('blog_posts')
    .upsert(blogPosts);
  
  if (blogError) {
    console.error('Error inserting blog posts:', blogError);
  } else {
    console.log(`Inserted ${blogPosts.length} blog posts successfully`);
  }

  console.log('Database seeding completed!');
}

// Run the seeding function
seedDatabase()
  .then(() => {
    console.log('All done!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error in seeding process:', error);
    process.exit(1);
  });
