import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from './useAuth'

interface UseLikesReturn {
  isLiked: (productId: string) => boolean
  toggleLike: (productId: string) => Promise<void>
  likeCount: (productId: string) => number
  loading: boolean
  error: string | null
}

interface ProductLike {
  id: string
  product_id: string
  user_id: string
  created_at: string
}

export function useLikes(): UseLikesReturn {
  const [likes, setLikes] = useState<ProductLike[]>([])
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()
  const { user } = useAuth()

  // Fetch user's likes
  useEffect(() => {
    async function fetchLikes() {
      if (!user) {
        setLikes([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('product_likes')
          .select('*')
          .eq('user_id', user.id)

        if (error) {
          throw error
        }

        setLikes(data || [])
      } catch (err) {
        console.error('Error fetching likes:', err)
        setError('Failed to load likes')
      } finally {
        setLoading(false)
      }
    }

    fetchLikes()
  }, [user, supabase])

  // Check if setup is complete using Supabase directly instead of fetch API
  useEffect(() => {
    async function checkSetup() {
      try {
        // Check if the product_likes table exists
        const { error: checkError } = await supabase
          .from('product_likes')
          .select('id')
          .limit(1)
          .maybeSingle()
        
        // If there's an error and it's not just that there are no results
        if (checkError && !checkError.message.includes('does not exist')) {
          throw new Error(`Error checking product_likes table: ${checkError.message}`)
        }
        
        // If the table doesn't exist, inform the user to run the migration
        if (checkError && checkError.message.includes('does not exist')) {
          console.warn('Product likes table does not exist. Please run the product_likes.sql migration in your Supabase dashboard.')
          setError('Product likes table does not exist. Please run the product_likes.sql migration in your Supabase dashboard.')
          return
        }
        
        // Check if the increment_product_likes function exists and has proper permissions
        try {
          const { error: funcError } = await supabase.rpc('increment_product_likes', { product_id: '00000000-0000-0000-0000-000000000000' })
          
          // If the error is about the function not existing or permission issues
          if (funcError && (funcError.message.includes('does not exist') || funcError.message.includes('permission denied'))) {
            console.warn('Product likes functions exist but may have permission issues.')
            setError('Product likes functions exist but may have permission issues. Please run the product_likes.sql migration in your Supabase dashboard.')
          }
        } catch (funcCheckError) {
          console.error('Error checking product likes functions:', funcCheckError)
        }
      } catch (err) {
        console.error('Error checking likes setup:', err)
      }
    }

    checkSetup()
  }, [supabase])

  // Check if a product is liked by the current user
  const isLiked = (productId: string): boolean => {
    return likes.some(like => like.product_id === productId)
  }

  // Toggle like status for a product
  const toggleLike = async (productId: string): Promise<void> => {
    if (!user) {
      setError('You must be logged in to like products')
      return
    }

    try {
      if (isLiked(productId)) {
        // Unlike the product
        const { error } = await supabase.rpc('decrement_product_likes', {
          product_id: productId
        })

        if (error) throw error

        // Update local state
        setLikes(likes.filter(like => like.product_id !== productId))
        setLikeCounts(prev => ({
          ...prev,
          [productId]: Math.max(0, (prev[productId] || 1) - 1)
        }))
      } else {
        // Like the product
        const { error } = await supabase.rpc('increment_product_likes', {
          product_id: productId
        })

        if (error) throw error

        // Update local state
        const newLike: ProductLike = {
          id: `${user.id}-${productId}`,
          product_id: productId,
          user_id: user.id,
          created_at: new Date().toISOString()
        }
        setLikes([...likes, newLike])
        setLikeCounts(prev => ({
          ...prev,
          [productId]: (prev[productId] || 0) + 1
        }))
      }
    } catch (err) {
      console.error('Error toggling like:', err)
      setError('Failed to update like status')
    }
  }

  // Get like count for a product
  const likeCount = (productId: string): number => {
    return likeCounts[productId] || 0
  }

  // Load like counts for visible products
  const fetchLikeCount = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('likes_count')
        .eq('id', productId)
        .single()

      if (error) throw error

      if (data) {
        setLikeCounts(prev => ({
          ...prev,
          [productId]: data.likes_count || 0
        }))
      }
    } catch (err) {
      console.error(`Error fetching like count for product ${productId}:`, err)
    }
  }

  return {
    isLiked,
    toggleLike,
    likeCount,
    loading,
    error
  }
}