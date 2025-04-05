import { Metadata } from 'next'
import { supabase } from '@/lib/supabase/client'
import ProductGrid from '@/components/products/ProductGrid'

export const metadata: Metadata = {
  title: 'On Sale Products | Marketplace',
  description: 'Browse all our products currently on sale with special discounts.',
}

export default async function OnSaleProductsPage() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .not('sale_price', 'is', null)
    .order('created_at', { ascending: false })
    .limit(24)

  if (error) {
    console.error('Error fetching on-sale products:', error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">On Sale Products</h1>
        <p className="mt-2 text-gray-600">
          Discover our best deals with up to 70% off. Limited time offers on premium products.
        </p>
      </div>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No products on sale at the moment. Check back soon!</p>
        </div>
      )}
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
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-sm z-10">
            {discountPercentage}% OFF
          </div>
        )}
        <a href={`/products/${product.slug}`}>
          <div className="aspect-square overflow-hidden">
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </a>
      </div>
      
      <div className="p-4">
        <a href={`/products/${product.slug}`}>
          <h3 className="font-medium text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </a>
        
        <div className="flex items-center mb-3">
          {product.sale_price && (
            <span className="text-gray-400 line-through mr-2">${product.price.toFixed(2)}</span>
          )}
          <span className="text-blue-600 font-bold">${(product.sale_price || product.price).toFixed(2)}</span>
        </div>
        
        <a 
          href={`/products/${product.slug}`}
          className="block w-full bg-gray-100 hover:bg-blue-600 text-gray-800 hover:text-white py-2 px-4 text-center text-sm font-medium transition-colors duration-300"
        >
          VIEW PRODUCT
        </a>
      </div>
    </div>
  );
}
