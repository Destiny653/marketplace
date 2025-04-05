import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { supabase } from '@/lib/supabase/client'
import ProductGrid from '@/components/products/ProductGrid'

interface Props {
  params: {
    id: string  // This is actually the slug
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', params.id)
    .single()

  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: `${category.name} | Your Store Name`,
    description: category.description,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', params.id)
    .single()

  if (!category) {
    notFound()
  }

  // Use the actual category.id instead of params.id (which is the slug)
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', category.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{category.name}</h1>
        {category.description && (
          <p className="mt-2 text-gray-600">{category.description}</p>
        )}
      </div>

      <ProductGrid products={products || []} />
    </div>
  )
}
