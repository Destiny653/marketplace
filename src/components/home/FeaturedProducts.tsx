'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/hooks/useCart'
import { supabase } from '@/lib/supabase/client'
import StarRating from '../common/StarRating'

interface Product {
  id: string
  name: string
  price: number
  sale_price: number | null
  image_url: string
  avg_rating: number
  slug: string
  category_id: string
  status: string
}

interface FeaturedProductsProps {
  title: string
  viewMoreLink: string
  limit?: number
  productIds?: string[]
}


export default function FeaturedProducts({ title, viewMoreLink, limit = 6, productIds }: FeaturedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      let query = supabase
        .from('products')
        .select('*')
        .eq('status', 'active')

      if (productIds && productIds.length > 0) {
        query = query.in('id', productIds)
      }

      const { data, error } = await query
        .limit(limit)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching featured products:', error)
        return
      }

      setProducts(data || [])
      setLoading(false)
    }

    fetchProducts()
  }, [limit, productIds])



  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.sale_price || product.price,
      image: product.image_url,
      quantity: 1
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          <Link href={viewMoreLink} className="text-blue-600 hover:text-blue-700">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(limit)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
              <div className="aspect-w-1 aspect-h-1 w-full bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        <Link href={viewMoreLink} className="text-blue-600 hover:text-blue-700">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <Link href={`/products/${product.slug}`}>
              <div className="aspect-w-1 aspect-h-1 w-full mb-4">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  className="object-cover rounded-lg"
                  width={400}
                  height={400}
                />
              </div>
            </Link>
            <div className="space-y-2">
              <Link href={`/products/${product.slug}`} className="block">
                <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
              </Link>
              <div className="flex items-center">
                <StarRating rating={product.avg_rating} size="sm" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-semibold text-gray-900">
                    ${product.sale_price || product.price}
                  </span>
                  {product.sale_price && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.price}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}