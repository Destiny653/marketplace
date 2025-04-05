'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from './useAuth'
import { toast } from 'sonner'

export interface ProductLike {
  id: string
  user_id: string
  product_id: string
  created_at: string
}

export function useProductLikes() {
  const [likedProductIds, setLikedProductIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const supabase = createClientComponentClient()

  // Fetch liked product IDs when user changes
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
      
      if (error) {
        console.error('Error fetching liked products:', error)
        throw error
      }

      // Update products total_likes count
      await supabase.rpc('update_product_likes_count')

      setLikedProductIds(data?.map(item => item.product_id) || [])
    } catch (err) {
      console.error('Error in fetchLikedProducts:', err)
      toast.error('Failed to load your liked products')
    } finally {
      setLoading(false)
    }
  }, [supabase, user])

  // Toggle like status for a product
  const toggleLike = useCallback(async (productId: string, productName?: string, retryCount = 0) => {
    if (!user) {
      toast.error('Please sign in to like products')
      return false
    }
    
    try {
      const isCurrentlyLiked = likedProductIds.includes(productId)
      
      // First verify if the product exists
      const { data: productExists, error: productError } = await supabase
        .from('products')
        .select('id')
        .eq('id', productId)
        .single()

      if (productError || !productExists) {
        toast.error('Product not found')
        return false
      }
      
      if (isCurrentlyLiked) {
        // Unlike the product
        const { error } = await supabase
          .from('product_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId)
        
        if (error) {
          console.error('Error removing like:', error)
          toast.error('Failed to remove like')
          return false
        }
        
        // Update local state
        setLikedProductIds(prev => prev.filter(id => id !== productId))
        
        if (productName) {
          toast.success(`Removed ${productName} from your liked items`)
        }
      } else {
        // Like the product
        const { error } = await supabase
          .from('product_likes')
          .insert([
            { 
              user_id: user.id, 
              product_id: productId
            }
          ])
        
        if (error) {
          if (error.code === '23505' && retryCount < 3) { // Unique constraint violation, retry
            await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)))
            return toggleLike(productId, productName, retryCount + 1)
          }
          throw error
        }
        
        // Update local state
        setLikedProductIds(prev => [...prev, productId])
        
        if (productName) {
          toast.success(`Added ${productName} to your liked items`, {
            action: {
              label: 'View Liked Items',
              onClick: () => window.location.href = '/wishlist'
            }
          })
        }
      }
      
      return true
    } catch (err: any) {
      console.error('Error toggling product like:', err)
      toast.error(err.message || 'Failed to update like status')
      return false
    }
  }, [supabase, user, likedProductIds])

  // Check if a product is liked
  const isLiked = useCallback((productId: string) => {
    return likedProductIds.includes(productId)
  }, [likedProductIds])

  // Load liked products when component mounts or user changes
  useEffect(() => {
    fetchLikedProducts()
  }, [fetchLikedProducts])

  return {
    likedProductIds,
    loading,
    toggleLike,
    isLiked,
    refreshLikes: fetchLikedProducts
  }
}