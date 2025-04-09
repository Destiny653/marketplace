'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import StarRating from '../common/StarRating'

interface Product {
  id: string
  name: string
  price: number
  sale_price: number | null
  image_url: string
  avg_rating: number
  slug: string
  category_id: string
  status: string
}

interface Category {
  id: string
  name: string
  slug: string
  image_url: string
  description: string
}

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryProducts, setCategoryProducts] = useState<Record<string, Product[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      if (!supabase) {
        console.error('Database service unavailable');
        setLoading(false);
        return;
      }
      
      // First fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .limit(6)

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError)
        return
      }

      setCategories(categoriesData || [])

      // Then fetch one product for each category
      const productsMap: Record<string, Product[]> = {}
      for (const category of categoriesData || []) {
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', category.id)
          .eq('status', 'active')
          .order('avg_rating', { ascending: false })
          .limit(1)

        productsMap[category.id] = productsData || []
      }

      setCategoryProducts(productsMap)
      setLoading(false)
    }

    fetchCategoriesAndProducts()
  }, [])



  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg aspect-square mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category) => {
        const products = categoryProducts[category.id] || []
        const product = products[1]

        return (
          <Link 
            key={category.id}
            href={`/categories/${category.slug}`}
            className="group block"
          >
            <div className="bg-white rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
              <div className="relative aspect-square aspect-[5/4] group">
                <Image
                  src={category.image_url}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                {product && (
                  <>
                    <div className="flex mb-1">
                      <StarRating rating={product.avg_rating} size="sm" />
                    </div>
                    <div className="flex items-center">
                      {product.sale_price && (
                        <span className="text-gray-400 line-through mr-2">${product.price.toFixed(2)}</span>
                      )}
                      <span className="text-blue-600 font-bold">
                        ${(product.sale_price || product.price).toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  );
}