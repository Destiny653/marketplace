'use client'
import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import type { Product } from '@/lib/supabase/types'
import { useProducts } from '@/hooks/useProducts'

interface ProductGridProps {
  products?: Product[]
  columns?: 2 | 3 | 4
  options?: {
    category?: string
    search?: string
    sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular'
    limit?: number
  }
}

export default function ProductGrid({ products: initialProducts, columns = 4, options }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts || [])
  const { products: fetchedProducts, loading } = useProducts(options || {})
  
  useEffect(() => {
    if (!initialProducts && fetchedProducts) {
      setProducts(fetchedProducts)
    }
  }, [fetchedProducts, initialProducts])

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  if (loading) {
    return (
      <div className={`grid ${gridCols[columns]} gap-6`}>
        {Array.from({ length: options?.limit || 4 }).map((_, index) => (
          <div key={index} className="bg-gray-100 rounded-lg p-4 animate-pulse h-80">
            <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
            <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
            <div className="bg-gray-200 h-4 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!products?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found.</p>
      </div>
    )
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}