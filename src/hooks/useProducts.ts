import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Product } from '@/lib/supabase/types'

interface UseProductsOptions {
  category?: string
  search?: string
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular'
  limit?: number
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        let query = supabase
          .from('products')
          .select('*, categories(*)')

        if (options.category) {
          query = query.eq('category_id', options.category)
        }

        if (options.search) {
          query = query.ilike('name', `%${options.search}%`)
        }

        if (options.sort) {
          switch (options.sort) {
            case 'price_asc':
              query = query.order('price', { ascending: true })
              break
            case 'price_desc':
              query = query.order('price', { ascending: false })
              break
            case 'newest':
              query = query.order('created_at', { ascending: false })
              break
            case 'popular':
              query = query.order('avg_rating', { ascending: false })
              break
          }
        }

        if (options.limit) {
          query = query.limit(options.limit)
        }

        const { data, error: supabaseError } = await query

        if (supabaseError) throw supabaseError

        setProducts(data || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [options.category, options.search, options.sort, options.limit])

  return { products, loading, error }
}
