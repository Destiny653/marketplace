'use client'

import { useState, JSX, useEffect } from 'react'
import Image from 'next/image'
import { Minus, Plus, ShoppingCart, Heart, Star, Share2, ChevronRight } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useProductLikes } from '@/hooks/useProductLikes'
import { formatPrice } from '@/lib/utils/helpers'
import { toast } from 'sonner'
import type { Product } from '@/lib/supabase/types'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/button'
import { useAuthContext } from '@/providers/AuthProvider'
import { useAuth } from '@/hooks/useAuth'

interface ProductDetailsProps {
  product: Product
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [isLikeLoading, setIsLikeLoading] = useState(false)
  const { addItem, items, updateQuantity } = useCart()
  const { isLiked, toggleLike } = useProductLikes()

  // Image handling
  const fallbackImageUrl = '/images/product-placeholder.jpg'
  const getValidImages = () => {
    try {
      if (!product.image_url) return [fallbackImageUrl]

      const images = Array.isArray(product.image_url)
        ? product.image_url
        : [product.image_url]

      return images.filter(img => {
        try {
          new URL(img)
          return true
        } catch {
          return false
        }
      }) || [fallbackImageUrl]
    } catch {
      return [fallbackImageUrl]
    }
  }
  const productImages = getValidImages()
  const isOutOfStock = !product.stock_quantity || product.stock_quantity <= 0
 
  useEffect(() => {
    const item = items.find((item) => item.id === product.id);
    setQuantity(item ? item.quantity : 1);
  }, [items, product.id]);


  const handleQuantityChange = async (
    productId: string,
    currentQuantity: number,
    change: number
  ) => {
    const newQuantity = currentQuantity + change
    if (newQuantity < 1) return

    setLoading((prev) => ({ ...prev, [productId]: true }))
    try {
      updateQuantity(productId, newQuantity)
    } catch (error) {
      toast.error('Failed to update quantity')
    } finally {
      setLoading((prev) => ({ ...prev, [productId]: false }))
    }
  }

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


  const handleToggleLike = async () => {
    setIsLikeLoading(true)
    try {
      await toggleLike(product.id, product.name)
      toast.success(
        isLiked(product.id)
          ? 'Removed from your favorites'
          : 'Added to your favorites'
      )
    } catch (error) {
      toast.error('Failed to update favorites')
    } finally {
      setIsLikeLoading(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this product: ${product.name}`,
        url: window.location.href,
      }).catch(() => {
        toast.info('Share canceled')
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    }
  }

  const renderPrice = () => {
    if (product.is_on_sale && product.sale_price) {
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-primary">
              {formatPrice(product.sale_price)}
            </span>
            <Badge variant="destructive" className="px-2 py-1">
              Save {Math.round((1 - product.sale_price / product.price) * 100)}%
            </Badge>
          </div>
          <span className="text-lg text-muted-foreground line-through">
            {formatPrice(product.price)}
          </span>
        </div>
      )
    }
    return (
      <span className="text-3xl font-bold text-primary">
        {formatPrice(product.price)}
      </span>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
      {/* Product Images Section */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted aspect-[4/4]">
          {productImages.length > 0 ? (
            <Image
              src={productImages[activeImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = fallbackImageUrl
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-100">
              <span className="text-gray-500">No image available</span>
            </div>
          )}

          {product.is_on_sale && (
            <Badge variant="destructive" className="absolute left-4 top-4">
              Sale
            </Badge>
          )}
        </div>

        {/* Thumbnail Gallery */}
        {productImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {productImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border transition-all ${activeImage === index ? 'border-primary ring-2 ring-primary' : 'border-border'}`}
              >
                <Image
                  src={img}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = fallbackImageUrl
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info Section */}
      <div className="space-y-6">
        {/* Header with title and actions */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            {product.brand && (
              <p className="text-sm text-muted-foreground">Brand: {product.brand}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleLike}
              disabled={isLikeLoading}
              aria-label={isLiked(product.id) ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={`h-5 w-5 ${isLiked(product.id) ? 'fill-red-500 text-red-500' : ''}`}
              />
            </Button>
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Rating */}
        <div className="mt-2 flex items-center">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(product.avg_rating)
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

        {/* Price */}
        {renderPrice()}

        {/* Description */}
        <div className="space-y-2">
          <h3 className="font-semibold">Description</h3>
          <p className="text-muted-foreground">{product.description}</p>
        </div>

        {/* Variants (if applicable) */}
        {product.variants && (
          <div className="space-y-2">
            <h3 className="font-semibold">Options</h3>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => (
                <Button
                  key={variant}
                  variant="outline"
                  size="sm"
                  className="capitalize"
                >
                  {variant}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-4">
            <span className="font-medium">Quantity:</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(product.id, quantity, -1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(product.id, quantity, 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className={`p-3 rounded-lg ${isOutOfStock ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {isOutOfStock ? (
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-600"></span>
                This product is currently out of stock
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-600"></span>
                {product.stock_quantity} item{product.stock_quantity !== 1 ? 's' : ''} available
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            size="lg"
            className={`flex-1 text-white gap-2 bg-blue-600 hover:bg-blue-700 ${isOutOfStock ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <ShoppingCart className="h-5 w-5" />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="flex-1 gap-2"
            disabled={isOutOfStock}
          >
            Buy Now
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Additional Info */}
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between border-t pt-4">
            <span className="text-sm text-muted-foreground">SKU</span>
            <span className="text-sm font-medium">{product.sku || 'N/A'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Category</span>
            <span className="text-sm font-medium capitalize">
              {product.categories?.name || 'Uncategorized'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Shipping</span>
            <span className="text-sm font-medium">Free shipping</span>
          </div>
        </div>
      </div>
    </div>
  )
}