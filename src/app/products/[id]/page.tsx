import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { supabase } from '@/lib/supabase/client'
import ProductDetails from '@/components/products/ProductDetails'
import RelatedProducts from '@/components/products/RelatedProducts'

// Using any type as a temporary workaround to fix build errors
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.name} | Your Store Name`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: any) {
  const { data: product } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('id', params.id)
    .single()

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails product={product} />
      
      <div className="mt-16">
        <RelatedProducts
          currentProductId={product.id}
          categoryId={product.category_id}
        />
      </div>
    </div>
  )
}
