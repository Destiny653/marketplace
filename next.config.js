/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'fadfwafokisfdatjcteu.supabase.co',
      'images.unsplash.com',  // Added Unsplash domain
      'placehold.co', 
      'example.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fadfwafokisfdatjcteu.supabase.co',
        pathname: '/storage/v1/object/public/products/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',  // Added Unsplash remote pattern
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**',
      }
    ],
  },
}

module.exports = nextConfig