'use client'

import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils/helpers'

export default function CartSummary() {
  const { items } = useCart()

  const subtotal = items.reduce(
    (total, item) =>
      total +
      ((item as any).salePrice != null ? (item as any).salePrice : item.price) *
        item.quantity,
    0
  )

  const shipping = 0 // Free shipping
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + shipping + tax

  return (
    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>

      <div className="space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax</span>
          <span>{formatPrice(tax)}</span>
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between font-medium text-gray-900">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <button
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        onClick={() => {
          // Handle checkout logic
        }}
      >
        Proceed to Checkout
      </button>

      <div className="text-sm text-gray-500 text-center">
        Taxes and shipping calculated at checkout
      </div>
    </div>
  )
}
