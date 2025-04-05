 'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, ShoppingBag, Minus, Plus, Loader2 } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCart()
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({})

  // Default fallback image URL
  const fallbackImageUrl = '/images/product-placeholder.jpg'

  // Check if the image URL is valid
  const isValidImageUrl = (url: string | null | undefined): boolean => {
    if (!url) return false
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }

  // Calculate subtotal
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
    )

  // Shipping cost (can be modified based on your business logic)
  const shippingCost = subtotal > 100 ? 0 : 10
  
  // Tax calculation (example: 10%)
  const taxRate = 0.1
  const tax = subtotal * taxRate

  // Total cost
  const total = subtotal + shippingCost + tax

  const handleQuantityChange = async (
    productId: string,
    currentQuantity: number,
    change: number
  ) => {
    const newQuantity = currentQuantity + change
    if (newQuantity < 1) return

    setLoading((prev) => ({ ...prev, [productId]: true }))
    try {
      await updateQuantity(productId, newQuantity)
    } catch (error) {
      toast.error('Failed to update quantity')
    } finally {
      setLoading((prev) => ({ ...prev, [productId]: false }))
  }
  }

  const handleRemoveItem = async (productId: string) => {
    setLoading((prev) => ({ ...prev, [productId]: true }))
    try {
      await removeItem(productId)
      toast.success('Item removed from cart')
    } catch (error) {
      toast.error('Failed to remove item')
    } finally {
      setLoading((prev) => ({ ...prev, [productId]: false }))
    }
  }

  if (items.length === 0) {
  return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Your cart is empty
            </h2>
        <p className="text-gray-500 mb-6">
          Looks like you haven't added any items to your cart yet.
        </p>
            <Link
          href="/products"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
          Start Shopping
            </Link>
            </div>
  )
}

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-lg shadow">
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id} className="p-6">
                  <div className="flex items-center">
                    {/* Product Image */}
                    <div className="relative h-24 w-24 flex-shrink-0">
                      <Image
                        src={isValidImageUrl(item.image) ? item.image : fallbackImageUrl}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="ml-6 flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-base font-medium text-gray-900">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {formatPrice(item.price)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={loading[item.id]}
                          className="text-gray-400 hover:text-red-500"
                        >
                          {loading[item.id] ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Trash2 className="h-5 w-5" />
                          )}
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="mt-4 flex items-center">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity, -1)
                          }
                          disabled={loading[item.id] || item.quantity <= 1}
                          className="rounded-full p-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="mx-4 min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity, 1)
                          }
                          disabled={loading[item.id]}
                          className="rounded-full p-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Clear Cart Button */}
          <div className="mt-4">
            <button
              onClick={clearCart}
              className="text-sm text-red-600 hover:text-red-500"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Order Summary
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">
                  {shippingCost === 0
                    ? 'Free'
                    : formatPrice(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">{formatPrice(tax)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-base font-medium text-gray-900">
                    Total
                  </span>
                  <span className="text-base font-medium text-gray-900">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 block w-full bg-blue-600 text-white py-3 px-4 rounded-md text-center font-medium hover:bg-blue-700 transition-colors"
            >
              Proceed to Checkout
            </Link>

            <div className="mt-4 text-center">
              <Link
                href="/products"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}