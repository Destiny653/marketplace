 'use client'

import { useEffect, useState } from 'react'
import { useLikes } from '@/hooks/useLikes'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Heart, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  price: number
  sale_price: number | null
  image_url: string
  slug: string
}

export default function LikedProducts() {
  const { likedProductIds, toggleLike, loading: likesLoading, error: likesError } = useLikes()
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [processingIds, setProcessingIds] = useState<string[]>([])

  // Enhanced fetching with caching and error handling
  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const fetchLikedProducts = async () => {
      if (!isMounted) return
      
      try {
        setLoadingProducts(true)
        
        if (likedProductIds.length === 0) {
          setProducts([])
          return
        }

        // Check cache first
        const cachedProducts = sessionStorage.getItem('likedProducts')
        if (cachedProducts) {
          const parsed = JSON.parse(cachedProducts)
          if (parsed.ids.join() === likedProductIds.join()) {
            setProducts(parsed.products)
            return
          }
        }

        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('id, name, price, sale_price, image_url, slug')
          .in('id', likedProductIds)
          .order('created_at', { ascending: false })

        if (productsError) throw productsError

        if (isMounted) {
          setProducts(productsData || [])
          // Cache the results
          sessionStorage.setItem('likedProducts', JSON.stringify({
            ids: likedProductIds,
            products: productsData || []
          }))
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching products:', err)
          toast.error('Failed to load products')
        }
      } finally {
        if (isMounted) setLoadingProducts(false)
      }
    }

    if (likedProductIds.length >= 0) {
      fetchLikedProducts()
    }

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [likedProductIds])

  const handleUnlike = async (productId: string) => {
    try {
      setProcessingIds(prev => [...prev, productId])
      const success = await toggleLike(productId)
      if (success) {
        // Optimistic update with cache invalidation
        setProducts(prev => prev.filter(p => p.id !== productId))
        sessionStorage.removeItem('likedProducts')
      }
    } catch (err) {
      console.error('Failed to unlike product:', err)
      toast.error('Failed to remove like')
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== productId))
    }
  }

  if (likesLoading || loadingProducts) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (likesError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{likesError}</p>
        <Link href="/login" className="text-blue-600 hover:underline">
          Login to view your liked products
        </Link>
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">You haven't liked any products yet.</p>
        <Link href="/products" className="text-blue-600 hover:underline">
          Browse products
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-8">Your Liked Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
            <Link href={`/products/${product.slug}`} className="block">
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
              </div>
            </Link>
            <div className="p-4 space-y-2">
              <Link href={`/products/${product.slug}`}>
                <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                  {product.name}
                </h3>
              </Link>
              <div className="flex items-center justify-between mt-2">
                <div className="flex flex-col">
                  {product.sale_price ? (
                    <>
                      <span className="text-blue-600 font-bold">${product.sale_price.toFixed(2)}</span>
                      <span className="text-gray-400 text-xs line-through">${product.price.toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="font-semibold text-gray-900">${product.price.toFixed(2)}</span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    handleUnlike(product.id)
                  }}
                  disabled={processingIds.includes(product.id)}
                  className="p-2 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
                  aria-label="Remove from favorites"
                >
                  {processingIds.includes(product.id) ? (
                    <Loader2 className="h-5 w-5 animate-spin text-red-500" />
                  ) : (
                    <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                  )}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}