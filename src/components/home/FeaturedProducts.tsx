'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/hooks/useCart'
import { supabase } from '@/lib/supabase/client'
import StarRating from '../common/StarRating'
import { ShoppingCart, Heart, Eye } from 'lucide-react'

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
  stock_quantity: number
}

interface FeaturedProductsProps {
  title: string
  viewMoreLink: string
  limit?: number
  productIds?: string[]
}


export default function FeaturedProducts({ title, viewMoreLink, limit = 6, productIds }: FeaturedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!supabase) {
          console.error('Supabase client is not available');
          setLoading(false);
          return;
        }
        
        let query = supabase
          .from('products')
          .select('*')
          .eq('status', 'active')
          .gt('stock_quantity', 0) // Only show products that are in stock

        if (productIds && productIds.length > 0) {
          query = query.in('id', productIds)
        }

        const { data, error } = await query
          .limit(limit)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching featured products:', error)
          return
        }

        setProducts(data || [])
        setLoading(false)
      } catch (err) {
        console.error('Failed to fetch products:', err)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [limit, productIds])

  const handleAddToCart = (product: Product) => {
    if (product.stock_quantity <= 0) {
      alert('Sorry, this product is out of stock.')
      return
    }
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.sale_price || product.price,
      image: product.image_url,
      quantity: 1,
      stock: product.stock_quantity
    })
  }

  const calculateDiscount = (original: number, sale: number) => {
    return Math.round(((original - sale) / original) * 100)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <Link href={viewMoreLink} className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(limit)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm animate-pulse">
              <div className="aspect-square w-full bg-gray-200 rounded-t-lg"></div>
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <Link href={viewMoreLink} className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
          View All →
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all group relative">
            {/* Sale badge */}
            {product.sale_price && (
              <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-sm">
                {calculateDiscount(product.price, product.sale_price)}% OFF
              </div>
            )}
            
            {/* Stock badge */}
            {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
              <div className="absolute top-2 right-2 z-10 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-sm">
                Low Stock
              </div>
            )}
            
            {/* Product image with overlay actions */}
            <div className="relative overflow-hidden">
              <Link href={`/products/slug/${product.slug}`}>
                <div className="aspect-square relative aspect-[5/4]">
                  <Image
                    src={product.image_url}
                    alt={product.name} 
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300 "
                  />
                </div>
              </Link>
              
              {/* Quick action buttons */}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock_quantity <= 0}
                  className="bg-white p-2 rounded-full hover:bg-blue-600 hover:text-white transition-colors"
                  title="Add to cart"
                >
                  <ShoppingCart size={18} />
                </button>
                <Link 
                  href={`/products/slug/${product.slug}`} 
                  className="bg-white p-2 rounded-full hover:bg-blue-600 hover:text-white transition-colors"
                  title="View details"
                >
                  <Eye size={18} />
                </Link>
              </div>
            </div>
            
            {/* Product info */}
            <div className="p-3">
              <Link href={`/products/slug/${product.slug}`} className="block">
                <h3 className="font-medium text-gray-800 mb-1 truncate hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
              </Link>
              
              <div className="flex mb-2">
                <StarRating rating={product.avg_rating} size="sm" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  {product.sale_price ? (
                    <>
                      <span className="text-blue-600 font-bold">${product.sale_price.toFixed(2)}</span>
                      <span className="text-gray-400 text-sm line-through">${product.price.toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="text-blue-600 font-bold">${product.price.toFixed(2)}</span>
                  )}
                </div>
                
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock_quantity <= 0}
                  className={`p-2 rounded-full ${
                    product.stock_quantity <= 0 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white'
                  } transition-colors`}
                  title={product.stock_quantity <= 0 ? 'Out of stock' : 'Add to cart'}
                >
                  <ShoppingCart size={18} />
                </button>
              </div>
              
              {/* Stock indicator */}
              <div className="mt-2">
                {product.stock_quantity <= 0 ? (
                  <span className="text-red-500 text-xs">Out of stock</span>
                ) : product.stock_quantity <= 5 ? (
                  <span className="text-amber-500 text-xs">Only {product.stock_quantity} left</span>
                ) : (
                  <span className="text-green-500 text-xs">In stock</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}