'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
  product_count: number
}

export default function CategoryBlocks() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Get categories with product counts
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select(`
            *,
            products (count)
          `)
          .order('name')

        if (categoriesError) throw categoriesError

        if (!categoriesData) {
          throw new Error('No categories found')
        }

        // Transform the data to include product count
        const categoriesWithCounts = categoriesData.map(category => ({
          ...category,
          product_count: category.products?.[0]?.count || 0,
          slug: category.id // Use ID as slug since we don't have a slug column
        }))

        setCategories(categoriesWithCounts)
      } catch (error) {
        console.error('Error fetching categories:', error)
        toast.error('Failed to load categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [supabase])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
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

  if (categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No categories found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {categories.map((category) => (
        <Link 
          key={category.id}
          href={`/categories/${category.slug}`}
          className="group block text-center"
        >
          <div className="bg-white rounded-lg overflow-hidden mb-3 shadow-sm group-hover:shadow-md transition-shadow">
            <div className="relative aspect-square">
              <Image
                src={category.image_url}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          <h3 className="font-medium text-gray-800 uppercase mb-1">
            {category.name} ({category.product_count})
          </h3>
          {category.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
          )}
        </Link>
      ))}
    </div>
  )
}