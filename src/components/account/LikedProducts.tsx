'use client'

import { useEffect } from 'react'
import { useLikes } from '@/hooks/useLikes'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function LikedProducts() {
  const { likedProducts, loading, error, toggleLike, refreshLikes } = useLikes()

  useEffect(() => {
    refreshLikes()
  }, [refreshLikes])

  if (loading) {
    return <p className="text-gray-500">Loading your liked products...</p>
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  if (likedProducts.length === 0) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {likedProducts.map(product => (
        <Card key={product.id} className="overflow-hidden flex flex-col">
          <div className="h-48 overflow-hidden">
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 flex flex-col flex-1">
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-3 flex-1 line-clamp-2">
              {product.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="font-bold">${product.price.toFixed(2)}</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleLike(product.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Unlike
                </button>
                <Link 
                  href={`/products/${product.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}