import { notFound } from 'next/navigation' 
import { supabase } from '@/lib/supabase/client'
import ProductDetails from '@/components/products/ProductDetails'
import RelatedProductsSlug from '@/components/products/RelatedProductsSlug'
import type { Metadata } from 'next'

// Define your params type
type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Your implementation
  if (!supabase) {
    return {
      title: 'Product - Loading',
      description: 'Loading product details...',
    };
  }
  
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.name} | Your Store Name`,
    description: product.description,
    alternates: {
      canonical: `/products/${params.slug}`,
    },
  }
}

export default async function ProductSlugPage({ params }: Props) {
  if (!supabase) {
    // Return placeholder UI for build time
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 bg-gray-100 rounded-lg h-96 animate-pulse"></div>
          <div className="md:w-1/2">
            <div className="h-8 bg-gray-100 w-3/4 rounded mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-100 w-1/2 rounded mb-8 animate-pulse"></div>
            <div className="h-24 bg-gray-100 rounded mb-6 animate-pulse"></div>
            <div className="h-10 bg-gray-100 w-1/3 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }
  
  const { data: product } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('slug', params.slug)
    .single()

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails product={product} />
      
      <div className="mt-16">
        <RelatedProductsSlug
          currentProductSlug={product.slug}
          categoryId={product.category_id}
        />
      </div>
    </div>
  )
}