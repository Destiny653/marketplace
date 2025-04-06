// Mock data for blog posts since we don't have a blog table in the database
export interface MockBlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  image_url: string;
  created_at: string;
  slug: string;
  status: string;
}

export const mockBlogPosts: MockBlogPost[] = [
  {
    id: '1',
    title: 'Top 10 Summer Fashion Trends for 2025',
    excerpt: 'Discover the hottest fashion trends that will dominate the summer season this year.',
    content: 'Summer 2025 is all about vibrant colors, sustainable materials, and comfortable silhouettes. This season, we\'re seeing a resurgence of 90s-inspired looks with a modern twist.\n\nBright neon colors are making a comeback, especially in accessories and statement pieces. Sustainable fashion continues to grow, with more brands focusing on eco-friendly materials and ethical production processes.\n\nLoose-fitting clothing remains popular, with oversized shirts, wide-leg pants, and flowy dresses dominating runways and street style alike. Comfort is key, but that doesn\'t mean sacrificing style.\n\nAccessories are bolder than ever, with chunky jewelry, statement sunglasses, and colorful bags being must-have items this season.',
    author: 'Fashion Editor',
    image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000',
    created_at: '2025-03-15T09:00:00Z',
    slug: 'top-10-summer-fashion-trends-2025',
    status: 'published'
  },
  {
    id: '2',
    title: 'How to Choose the Perfect Smartphone in 2025',
    excerpt: 'A comprehensive guide to selecting the right smartphone for your needs and budget.',
    content: 'With so many options available in the market, choosing the perfect smartphone can be overwhelming. Here\'s a guide to help you make an informed decision.\n\nFirst, determine your budget. Smartphones range from budget-friendly options under $300 to premium models over $1000. Knowing your price range will narrow down your choices significantly.\n\nNext, consider your priorities. Are you a photography enthusiast? Look for phones with exceptional camera systems. Do you play graphics-intensive games? Focus on devices with powerful processors and high refresh rate displays.\n\nBattery life is another crucial factor. If you\'re frequently away from charging points, prioritize phones with larger batteries and fast charging capabilities.\n\nFinally, consider the operating system. Android offers more customization options, while iOS provides a seamless ecosystem if you own other Apple devices.',
    author: 'Tech Reviewer',
    image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000',
    created_at: '2025-03-10T14:30:00Z',
    slug: 'how-to-choose-perfect-smartphone-2025',
    status: 'published'
  },
  {
    id: '3',
    title: 'Essential Home Office Setup for Remote Workers',
    excerpt: 'Create a productive and comfortable workspace at home with these essential items and tips.',
    content: 'Working from home requires a well-designed workspace that promotes productivity and comfort. Here are the essentials for an effective home office setup.\n\nStart with a proper desk and chair. Your chair should provide adequate lumbar support, while your desk should be at the right height to prevent strain on your wrists and neck.\n\nLighting is crucial. Position your workspace near a window for natural light, and supplement with a good desk lamp to reduce eye strain during darker hours.\n\nInvest in a quality monitor (or two) positioned at eye level. This helps maintain good posture and reduces neck strain.\n\nDon\'t overlook accessories like a good keyboard, mouse, and possibly a headset for video calls. These items can significantly impact your comfort and productivity.\n\nFinally, consider the aesthetics of your space. Plants, artwork, and good organization can make your workspace more pleasant and inspiring.',
    author: 'Workspace Designer',
    image_url: 'https://images.unsplash.com/photo-1593642532744-d377ab507dc8?q=80&w=1000',
    created_at: '2025-03-05T11:15:00Z',
    slug: 'essential-home-office-setup-remote-workers',
    status: 'published'
  },
  {
    id: '4',
    title: 'Sustainable Living: Small Changes with Big Impact',
    excerpt: 'Learn how small adjustments to your daily routine can contribute to a more sustainable lifestyle.',
    content: 'Living sustainably doesn\'t require a complete lifestyle overhaul. Small, consistent changes can make a significant difference.\n\nStart in the kitchen by reducing food waste. Plan meals, store food properly, and compost scraps when possible. Consider reducing meat consumption, even if just for one or two days a week.\n\nIn the bathroom, switch to products with minimal packaging or refillable options. Bamboo toothbrushes, solid shampoo bars, and reusable cotton pads are excellent alternatives to traditional products.\n\nFor cleaning, choose eco-friendly products or make your own using simple ingredients like vinegar, baking soda, and essential oils.\n\nWhen shopping, bring reusable bags and containers, and try to buy local and seasonal products when possible.\n\nRemember, sustainability is a journey, not a destination. Every small change contributes to a larger positive impact on our planet.',
    author: 'Environmental Specialist',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000',
    created_at: '2025-02-28T16:45:00Z',
    slug: 'sustainable-living-small-changes-big-impact',
    status: 'published'
  }
];

// Function to get all published blog posts
export function getAllBlogPosts() {
  return mockBlogPosts.filter(post => post.status === 'published');
}

// Function to get a specific blog post by slug
export function getBlogPostBySlug(slug: string) {
  return mockBlogPosts.find(post => post.slug === slug);
}

// Function to get related blog posts (excluding the current one)
export function getRelatedBlogPosts(currentSlug: string, limit = 3) {
  return mockBlogPosts
    .filter(post => post.status === 'published' && post.slug !== currentSlug)
    .slice(0, limit);
}

// Function to get latest blog posts
export function getLatestBlogPosts(limit = 4) {
  return mockBlogPosts
    .filter(post => post.status === 'published')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}
