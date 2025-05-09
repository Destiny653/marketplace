 'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from './useAuth'
import { toast } from 'sonner'

interface UseLikesReturn {
  likedProductIds: string[]
  loading: boolean
  error: string | null
  toggleLike: (productId: string, productName?: string) => Promise<boolean>
  isLiked: (productId: string) => boolean
  refreshLikes: () => Promise<void>
}

export function useLikes(): UseLikesReturn {
  const [likedProductIds, setLikedProductIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()
  const { user } = useAuth()

  const fetchLikedProducts = useCallback(async () => {
    if (!user) {
      setLikedProductIds([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('product_likes')
        .select('product_id')
        .eq('user_id', user.id)

      if (error) throw error

      setLikedProductIds(data?.map(item => item.product_id) || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching likes:', err)
      setError('Failed to load liked products')
      setLikedProductIds([])
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  const toggleLike = useCallback(async (productId: string, productName?: string): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in to like products')
      return false
    }

    try {
      setLoading(true)
      const isCurrentlyLiked = likedProductIds.includes(productId)

      if (isCurrentlyLiked) {
        // Unlike the product
        const { error } = await supabase
          .from('product_likes')
          .delete()
          .match({ product_id: productId, user_id: user.id })

        if (error) throw error

        setLikedProductIds(prev => prev.filter(id => id !== productId))
        toast.success(productName ? `Removed ${productName} from likes` : 'Removed from likes')
      } else {
        // Like the product
        const { error } = await supabase
          .from('product_likes')
          .insert({ product_id: productId, user_id: user.id })

        if (error) throw error

        setLikedProductIds(prev => [...prev, productId])
        toast.success(productName ? `Added ${productName} to likes` : 'Added to likes')
      }
      return true
    } catch (err) {
      console.error('Error toggling like:', err)
      toast.error('Failed to update like status')
      return false
    } finally {
      setLoading(false)
    }
  }, [user, supabase, likedProductIds])

  const isLiked = useCallback((productId: string): boolean => {
    return likedProductIds.includes(productId)
  }, [likedProductIds])

  useEffect(() => {
    fetchLikedProducts()
  }, [fetchLikedProducts])

  return {
    likedProductIds,
    loading,
    error,
    toggleLike,
    isLiked,
    refreshLikes: fetchLikedProducts
  }
}