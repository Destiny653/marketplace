import { Metadata } from 'next'
import Link from 'next/link'
import { Tag, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import ProductGrid from '@/components/products/ProductGrid'

export const metadata: Metadata = {
  title: 'Super Deals | Marketplace',
  description: 'Discover our limited-time super deals and discounts on a wide range of products.',
}

export default async function DealsPage() {
  // Check if supabase client is available
  if (!supabase) {
    // Return empty products for build time
    // This will be replaced with actual data during runtime
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl p-8 mb-10 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900">SUPER DEALS!!</h1>
          <p className="text-xl md:text-2xl mb-6 max-w-2xl font-semibold">
            UPTO 15% DISCOUNT on our best products
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center bg-blue-900 px-4 py-2 rounded-full text-white">
              <Tag className="h-5 w-5 mr-2" />
              <span>Limited time offers</span>
            </div>
            <div className="flex items-center bg-blue-900 px-4 py-2 rounded-full text-white">
              <Clock className="h-5 w-5 mr-2" />
              <span>Hurry before they're gone!</span>
            </div>
          </div>
        </div>

        {/* Empty state for build time */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Today's Super Deals</h2>
          <p className="text-center py-8 text-gray-500">Loading deals...</p>
        </div>
      </div>
    );
  }
  
  // Fetch products with sale prices
  const { data: saleProducts, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .not('sale_price', 'is', null)
    .order('sale_price', { ascending: true })
    .limit(12)

  if (error) {
    console.error('Error fetching sale products:', error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl p-8 mb-10 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900">SUPER DEALS!!</h1>
        <p className="text-xl md:text-2xl mb-6 max-w-2xl font-semibold">
          UPTO 15% DISCOUNT on our best products
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center bg-blue-900 px-4 py-2 rounded-full text-white">
            <Tag className="h-5 w-5 mr-2" />
            <span>Limited time offers</span>
          </div>
          <div className="flex items-center bg-blue-900 px-4 py-2 rounded-full text-white">
            <Clock className="h-5 w-5 mr-2" />
            <span>Hurry before they're gone!</span>
          </div>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Today's Super Deals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(saleProducts || []).slice(0, 8).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Weekly Deals */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">More Great Deals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(saleProducts || []).slice(8).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
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

// Product Card Component
function ProductCard({ product }: { product: any }) {
  const discountPercentage = product.sale_price && product.price 
    ? Math.round(((product.price - product.sale_price) / product.price) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md group">
      <div className="relative">
        {product.sale_price && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-sm z-10">
            SALE! {discountPercentage}% OFF
          </div>
        )}
        <Link href={`/products/${product.slug}`}>
          <div className="aspect-square overflow-hidden">
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
      </div>
      
      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center mb-3">
          {product.sale_price && (
            <span className="text-gray-400 line-through mr-2">${product.price.toFixed(2)}</span>
          )}
          <span className="text-blue-600 font-bold">${(product.sale_price || product.price).toFixed(2)}</span>
        </div>
        
        <Link 
          href={`/products/${product.slug}`}
          className="block w-full bg-gray-100 hover:bg-blue-600 text-gray-800 hover:text-white py-2 px-4 text-center text-sm font-medium transition-colors duration-300"
        >
          VIEW PRODUCT
        </Link>
      </div>
    </div>
  );
}