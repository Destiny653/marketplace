'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import ProductGrid from './ProductGrid'
import type { Product } from '@/lib/supabase/types'

interface RelatedProductsSlugProps {
  currentProductSlug: string
  categoryId: string
  limit?: number
}

export default function RelatedProductsSlug({
  currentProductSlug,
  categoryId,
  limit = 4,
}: RelatedProductsSlugProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        if (!supabase) {
          console.error('Database service unavailable');
          setLoading(false);
          return;
        }
        
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', categoryId)
          .neq('slug', currentProductSlug)
          .limit(limit)

        setProducts(data || [])
      } catch (error) {
        console.error('Error fetching related products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedProducts()
  }, [categoryId, currentProductSlug, limit])

  if (loading) {
    return <div>Loading...</div>
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Related Products</h2>
      <ProductGrid products={products} columns={4} />
    </div>
  )
}