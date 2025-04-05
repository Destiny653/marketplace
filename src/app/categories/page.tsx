import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

export const metadata: Metadata = {
  title: 'Categories | Your Store Name',
  description: 'Browse our product categories',
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
}

export default async function CategoriesPage() {
  const { data: categories } = await supabase.from('categories').select('*')

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Product Categories</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories?.map((category: Category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="group block"
          >
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
            src={category.image_url || '/placeholder.jpg'}
            alt={category.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h2 className="text-2xl font-bold text-white">{category.name}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
