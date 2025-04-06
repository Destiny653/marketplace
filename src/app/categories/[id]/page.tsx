import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { supabase } from '@/lib/supabase/client'
import ProductGrid from '@/components/products/ProductGrid'

// Define the params type for this page
type Params = {
  id: string  // This is actually the slug
}

// Define the proper Next.js 15 page props type
type PageProps = {
  params: Params
  searchParams: Record<string, string | string[] | undefined>
}

// Using any type as a temporary workaround to fix build errors
export async function generateMetadata({ params }: any): Promise<Metadata> {
  if (!supabase) {
    return {
      title: 'Category - Loading',
      description: 'Loading category details...',
    };
  }
  
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

export default async function CategoryPage({ params }: any) {
  if (!supabase) {
    // Return placeholder UI for build time
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Loading Category...</h1>
          <p className="text-gray-600 mt-2">Please wait while we load the category details.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }
  
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
          <p className="text-gray-600 mt-2">{category.description}</p>
        )}
      </div>
      
      <ProductGrid products={products || []} />
    </div>
  )
}
