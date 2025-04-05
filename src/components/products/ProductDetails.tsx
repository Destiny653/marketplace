'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Minus, Plus, ShoppingCart, Heart } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useProductLikes } from '@/hooks/useProductLikes'
import { formatPrice } from '@/lib/utils/helpers'
import { toast } from 'sonner'
import type { Product } from '@/lib/supabase/types'

interface ProductDetailsProps {
  product: Product
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [isLikeLoading, setIsLikeLoading] = useState(false)
  const { addItem } = useCart()
  const { isLiked, toggleLike } = useProductLikes()

  // Default fallback image URL - replace with your actual fallback image path
  const fallbackImageUrl = '/images/product-placeholder.jpg'

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity < 1) return
    setQuantity(newQuantity)
  }

  const handleAddToCart = () => {
    if (product.stock_quantity && product.stock_quantity < quantity) {
      toast.error('Not enough stock available', {
        description: `Only ${product.stock_quantity} items are available.`,
      })
      return
    }

    addItem({ 
      id: product.id, 
      name: product.name, 
      price: product.price, 
      stock: product.stock_quantity, // Add the 'stock' property
      // Use fallback image if product image is missing
      image: product.image_url || fallbackImageUrl, 
      quantity 
    })
    
    // Show success notification
    toast.success(`${product.name} added to cart`, {
      description: `${quantity} ${quantity > 1 ? 'items' : 'item'} added`,
      action: {
        label: 'View Cart',
        onClick: () => window.location.href = '/cart'
      }
    })
  }

  const handleToggleLike = async () => {
    setIsLikeLoading(true)
    try {
      await toggleLike(product.id, product.name)
    } finally {
      setIsLikeLoading(false)
    }
  }

  // Check if this product is liked
  const liked = isLiked(product.id)

  // Check if the image URL is valid
  const isValidImageUrl = (url: string | null | undefined): boolean => {
    if (!url) return false
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }

  // Get the image URL to use (either the product image or fallback)
  const imageUrl = isValidImageUrl(product.image_url) 
    ? product.image_url 
    : fallbackImageUrl

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product Image */}
      <div className="relative aspect-square">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        
        <div className="flex items-center space-x-4">
          {product.is_on_sale && product.sale_price ? (
            <>
              <span className="text-3xl font-bold text-red-500">
                {formatPrice(product.sale_price)}
              </span>
              <span className="text-xl text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-3xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <p className="text-gray-600">{product.description}</p>

        <div className="border-t border-b py-4">
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Quantity:</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="p-2 border rounded-md hover:bg-gray-50"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="p-2 border rounded-md hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
            className={`flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 ${
              product.stock_quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Add to Cart</span>
          </button>
          <button 
            onClick={handleToggleLike}
            disabled={isLikeLoading}
            className={`p-3 border rounded-lg ${
              liked 
                ? 'bg-red-50 border-red-200 hover:bg-red-100' 
                : 'hover:bg-gray-50'
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
        </div>

        {/* Stock Status */}
        <div className="text-sm text-gray-600">
          {product.stock_quantity && product.stock_quantity > 0 ? (
            <span className="text-green-600">
              In Stock ({product.stock_quantity} available)
            </span>
          ) : (
            <span className="text-red-600">Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  )
}