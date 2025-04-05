import { Metadata } from 'next'
import Link from 'next/link'
import { Tag, Clock } from 'lucide-react'
import ProductGrid from '@/components/products/ProductGrid'

export const metadata: Metadata = {
  title: 'Special Deals | Marketplace',
  description: 'Discover our limited-time special deals and discounts on a wide range of products.',
}

export default async function DealsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 mb-10 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Special Deals & Offers</h1>
        <p className="text-lg md:text-xl mb-6 max-w-2xl">
          Limited-time discounts on top products. Don't miss these amazing deals!
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
            <Tag className="h-5 w-5 mr-2" />
            <span>Up to 70% off</span>
          </div>
          <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
            <Clock className="h-5 w-5 mr-2" />
            <span>Limited time only</span>
          </div>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Today's Hot Deals</h2>
        <ProductGrid 
          options={{ 
            sort: 'price_asc',
            limit: 8 
          }} 
        />
      </div>

      {/* Weekly Deals */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Weekly Deals</h2>
        <ProductGrid 
          options={{ 
            sort: 'popular',
            limit: 4 
          }} 
        />
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Don't Miss Out!</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Subscribe to our newsletter to get notified about upcoming deals and promotions.
        </p>
        <div className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}