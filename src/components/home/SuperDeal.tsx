'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/hooks/useCart'
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
  stock_quantity: number
}

export default function SuperDeal() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState({
    days: 166,
    hours: 20,
    minutes: 10,
    seconds: 10
  })
  const { addItem } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('status', 'active')
          .not('sale_price', 'is', null)
          .gt('stock_quantity', 0) // Only show products that are in stock
          .order('sale_price', { ascending: true })
          .limit(5)

        if (error) {
          console.error('Error fetching super deal products:', error)
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
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleAddToCart = (product: Product) => {
    // Check if product is in stock before adding to cart
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

  if (loading) {
    return (
      <div className="container mx-auto px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg aspect-square"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4">
      <div className="bg-amber-400 p-6 rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-blue-900 mb-2">SUPER DEAL !!</h2>
            <p className="text-xl font-semibold text-white">UPTO 15% DISCOUNT</p>
          </div>
          
          <div className="flex space-x-3 mt-4 md:mt-0">
            <div className="bg-blue-900 text-white p-2 rounded w-16 text-center">
              <div className="text-xl font-bold">{timeLeft.days}</div>
              <div className="text-xs">Days</div>
            </div>
            <div className="bg-blue-900 text-white p-2 rounded w-16 text-center">
              <div className="text-xl font-bold">{timeLeft.hours}</div>
              <div className="text-xs">Hours</div>
            </div>
            <div className="bg-blue-900 text-white p-2 rounded w-16 text-center">
              <div className="text-xl font-bold">{timeLeft.minutes}</div>
              <div className="text-xs">Minutes</div>
            </div>
            <div className="bg-blue-900 text-white p-2 rounded w-16 text-center">
              <div className="text-xl font-bold">{timeLeft.seconds}</div>
              <div className="text-xs">Seconds</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-sm z-10">
                SALE!
              </div>
              
              <Link href={`/products/${product.slug}`} className="block">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>
              
              <div className="p-3">
                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-medium text-gray-800 mb-1 hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="flex mb-2">
                  <StarRating rating={product.avg_rating} size="sm" />
                </div>
                
                <div className="flex items-center mb-3">
                  {product.sale_price && (
                    <span className="text-gray-400 line-through mr-2">${product.price.toFixed(2)}</span>
                  )}
                  <span className="text-blue-600 font-bold">${product?.sale_price?.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-sm ${product.stock_quantity > 5 ? 'text-green-600' : 'text-orange-500'}`}>
                    {product.stock_quantity > 5 
                      ? 'In Stock' 
                      : `Only ${product.stock_quantity} left`}
                  </span>
                </div>
                
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock_quantity <= 0}
                  className={`w-full py-2 px-4 text-sm font-medium transition-colors duration-300 ${
                    product.stock_quantity <= 0 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-100 hover:bg-blue-600 text-gray-800 hover:text-white'
                  }`}
                >
                  {product.stock_quantity <= 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}