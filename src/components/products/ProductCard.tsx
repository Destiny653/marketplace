'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useProductLikes } from '@/hooks/useProductLikes'
import { useAuth } from '@/hooks/useAuth'
import { useAuthContext } from '@/providers/AuthProvider'
import { formatPrice } from '@/lib/utils/helpers'
import { toast } from 'sonner'
import type { Product } from '@/lib/supabase/types'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { isLiked, toggleLike } = useProductLikes()
  const [isLikeLoading, setIsLikeLoading] = useState(false)

  const { showAuthModal } = useAuthContext()
  const { user } = useAuth()

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!user) {
      showAuthModal('cart')
      return
    }
    
    // Check if product is in stock
    if (product.stock_quantity <= 0) {
      toast.error(`${product.name} is out of stock`)
      return
    }
    
    addItem({ 
      ...product, 
      image: product.image_url, 
      quantity: 1,
      stock: product.stock_quantity 
    })
    
    // Add notification when product is added to cart
    toast.success(`${product.name} added to cart`, {
      description: '1 item added',
      action: {
        label: 'View Cart',
        onClick: () => window.location.href = '/cart'
      }
    })
  }

  const handleToggleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!user) {
      showAuthModal('like')
      return
    }
    setIsLikeLoading(true)
    try {
      await toggleLike(product.id, product.name)
    } finally {
      setIsLikeLoading(false)
    }
  }

  // Check if this product is liked
  const liked = isLiked(product.id)

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/products/${product.id}`} className="block relative">
        <div className="aspect-square relative overflow-hidden">
          <img
            src={product?.image_url}
            alt={product?.name} 
            className="object-cover transition-transform group-hover:scale-105"
          />
          {product.is_on_sale && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm">
              Sale
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.avg_rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500">
              ({product.avg_rating?.toFixed(1)})
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {product.is_on_sale && product.sale_price ? (
                <>
                  <span className="text-lg font-bold text-red-500">
                    {formatPrice(product.sale_price)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {product.stock_quantity > 0 ? (
                <span>In Stock ({product.stock_quantity})</span>
              ) : (
                <span>Out of Stock</span>
              )}
            </div>
          </div>
        </div>
      </Link>
      <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleToggleLike}
          disabled={isLikeLoading}
          className={`p-2 rounded-full shadow-md ${
            liked 
              ? 'bg-red-50 hover:bg-red-100' 
              : 'bg-white hover:bg-gray-50'
          }`}
          aria-label={liked ? "Remove from liked items" : "Add to liked items"}
        >
          <Heart 
            className={`h-5 w-5 ${
              liked 
                ? 'text-red-500 fill-red-500' 
                : 'text-gray-600'
            }`} 
          />
        </button>
        <button
          onClick={handleAddToCart}
          className="p-2 bg-blue-600 rounded-full shadow-md hover:bg-blue-700"
          aria-label="Add to cart"
        >
          <ShoppingCart className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  )
}