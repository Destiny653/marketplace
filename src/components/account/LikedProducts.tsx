'use client'

import { useEffect, useState } from 'react'
import { useLikes } from '@/hooks/useLikes'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

interface Product {
  id: string
  name: string
  price: number
  sale_price: number | null
  image_url: string
  slug: string
}

export default function LikedProducts() {
  const { isLiked, toggleLike, loading, error } = useLikes()
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  useEffect(() => {
    async function fetchLikedProducts() {
      try {
        setLoadingProducts(true)
        
        if (!supabase) {
          throw new Error('Database service unavailable');
        }
        
        // Get all products
        const { data: allProducts, error: productsError } = await supabase
          .from('products')
          .select('id, name, price, sale_price, image_url, slug')
        
        if (productsError) {
          throw productsError
        }
        
        // Filter to only liked products
        const likedProducts = allProducts.filter(product => isLiked(product.id))
        setProducts(likedProducts)
      } catch (err) {
        console.error('Error fetching products:', err)
      } finally {
        setLoadingProducts(false)
      }
    }
    
    if (!loading) {
      fetchLikedProducts()
    }
  }, [loading, isLiked])

  if (loading || loadingProducts) {
    return <p className="text-gray-500">Loading your liked products...</p>
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">You haven't liked any products yet.</p>
        <Link href="/products" className="text-blue-600 hover:underline">
          Browse products
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Products You Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <Card key={product.id} className="overflow-hidden">
            <div className="p-4">
              <Link href={`/products/${product.slug}`}>
                <h3 className="font-medium hover:text-blue-600 transition-colors">{product.name}</h3>
              </Link>
              <div className="flex items-center justify-between mt-2">
                <div>
                  {product.sale_price ? (
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 font-semibold">${product.sale_price.toFixed(2)}</span>
                      <span className="text-gray-400 line-through text-sm">${product.price.toFixed(2)}</span>
                    </div>
                  ) : (
                    <span className="font-semibold">${product.price.toFixed(2)}</span>
                  )}
                </div>
                <button
                  onClick={() => toggleLike(product.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Unlike
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}