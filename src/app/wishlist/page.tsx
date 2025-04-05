'use client'

import { useState, useEffect } from 'react'
import { useProductLikes } from '@/hooks/useProductLikes'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import ProductCard from '@/components/products/ProductCard'
import { Product } from '@/lib/supabase/types'
import Link from 'next/link'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function WishlistPage() {
  const { likedProductIds, loading: likesLoading, refreshLikes } = useProductLikes()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchLikedProducts = async () => {
      if (likedProductIds.length === 0) {
        setProducts([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .in('id', likedProductIds)

        if (error) {
          throw error
        }

        setProducts(data || [])
      } catch (error) {
        console.error('Error fetching liked products:', error)
      } finally {
        setLoading(false)
      }
    }

    if (!likesLoading) {
      fetchLikedProducts()
    }
  }, [likedProductIds, supabase, likesLoading])

  // Refresh likes when component mounts
  useEffect(() => {
    refreshLikes()
  }, [refreshLikes])

  const renderContent = () => {
    if (likesLoading || loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )
    }

    if (products.length === 0) {
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Browse our products and add items to your wishlist by clicking the heart icon.</p>
          <Link href="/products" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Browse Products
          </Link>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>
        {renderContent()}
      </div>
    </ProtectedRoute>
  )
}