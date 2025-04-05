import { Metadata } from 'next'
import ProductGrid from '@/components/products/ProductGrid'
import { Award, Star, ThumbsUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Best Sellers | Marketplace',
  description: 'Explore our most popular and top-rated products that customers love.',
}

export default async function BestSellersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-8 mb-10 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Best Sellers</h1>
        <p className="text-lg md:text-xl mb-6 max-w-2xl">
          Our most popular products loved by thousands of customers. Quality and satisfaction guaranteed!
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
            <Star className="h-5 w-5 mr-2" />
            <span>Top rated</span>
          </div>
          <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
            <ThumbsUp className="h-5 w-5 mr-2" />
            <span>Customer favorites</span>
          </div>
        </div>
      </div>

      {/* Top Sellers Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Top 10 Best Sellers</h2>
        <ProductGrid 
          options={{ 
            sort: 'popular',
            limit: 10 
          }} 
        />
      </div>

      {/* Category Best Sellers */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Category Best Sellers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-100 p-6 rounded-lg text-center">
            <Award className="h-10 w-10 mx-auto mb-3 text-amber-500" />
            <h3 className="font-bold text-lg mb-2">Electronics</h3>
            <p className="text-gray-600 mb-4">Most popular tech gadgets</p>
            <a href="/categories/electronics" className="text-blue-600 hover:underline font-medium">
              Shop now →
            </a>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg text-center">
            <Award className="h-10 w-10 mx-auto mb-3 text-amber-500" />
            <h3 className="font-bold text-lg mb-2">Fashion</h3>
            <p className="text-gray-600 mb-4">Trending styles and apparel</p>
            <a href="/categories/fashion" className="text-blue-600 hover:underline font-medium">
              Shop now →
            </a>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg text-center">
            <Award className="h-10 w-10 mx-auto mb-3 text-amber-500" />
            <h3 className="font-bold text-lg mb-2">Home & Garden</h3>
            <p className="text-gray-600 mb-4">Top home improvement items</p>
            <a href="/categories/home" className="text-blue-600 hover:underline font-medium">
              Shop now →
            </a>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg text-center">
            <Award className="h-10 w-10 mx-auto mb-3 text-amber-500" />
            <h3 className="font-bold text-lg mb-2">Beauty & Health</h3>
            <p className="text-gray-600 mb-4">Best wellness products</p>
            <a href="/categories/beauty" className="text-blue-600 hover:underline font-medium">
              Shop now →
            </a>
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="bg-gray-100 rounded-xl p-8 mb-10">
        <h2 className="text-2xl font-bold mb-6 text-center">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex text-amber-500 mb-3">
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
            </div>
            <p className="text-gray-700 mb-4">"Absolutely love the quality of products. Fast shipping and excellent customer service!"</p>
            <p className="font-medium">- Sarah J.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex text-amber-500 mb-3">
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
            </div>
            <p className="text-gray-700 mb-4">"Been shopping here for years. Always reliable and the best prices on the market!"</p>
            <p className="font-medium">- Michael T.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex text-amber-500 mb-3">
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
            </div>
            <p className="text-gray-700 mb-4">"The best online shopping experience I've had. Will definitely be a repeat customer!"</p>
            <p className="font-medium">- Emma R.</p>
          </div>
        </div>
      </div>
    </div>
  )
}