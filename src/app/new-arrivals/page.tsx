import { Metadata } from 'next'
import ProductGrid from '@/components/products/ProductGrid'
import { Calendar, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'New Arrivals | Marketplace',
  description: 'Discover the latest products and newest additions to our marketplace.',
}

export default async function NewArrivalsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 mb-10 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">New Arrivals</h1>
        <p className="text-lg md:text-xl mb-6 max-w-2xl">
          Discover our freshest products and latest additions to the marketplace. Be the first to shop what's new!
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
            <Calendar className="h-5 w-5 mr-2" />
            <span>Updated weekly</span>
          </div>
          <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
            <TrendingUp className="h-5 w-5 mr-2" />
            <span>Trending products</span>
          </div>
        </div>
      </div>

      {/* Latest Products */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Just Arrived</h2>
        <ProductGrid 
          options={{ 
            sort: 'newest',
            limit: 8 
          }} 
        />
      </div>

      {/* Featured New Arrivals */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured New Arrivals</h2>
        <ProductGrid 
          options={{ 
            sort: 'newest',
            limit: 4 
          }} 
        />
      </div>

      {/* Coming Soon Section */}
      <div className="bg-gray-100 rounded-xl p-8 text-center mb-10">
        <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Get a sneak peek of products that will be available soon. Subscribe to get notified when they launch.
        </p>
        <div className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              Notify Me
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}