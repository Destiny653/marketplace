'use client'

import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import CartSidebar from '@/components/cart/CartSidebar'
import { formatPrice } from '@/lib/utils/helpers'

export default function CartButton() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const { items } = useCart()
  
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  
  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
      >
      {/* Mini Cart Preview */}
      {showPreview && items.length > 0 && !isCartOpen && (
        <div className="absolute top-full right-0 w-64 bg-white rounded-lg shadow-lg p-3 mt-2 border border-gray-200 z-30">
          <div className="text-sm font-medium mb-2">Cart Summary</div>
          <div className="max-h-40 overflow-y-auto mb-2">
            {items.slice(0, 2).map((item) => (
              <div key={item.id} className="flex items-center py-2 border-b border-gray-100">
                <span className="text-xs truncate flex-1">{item.name}</span>
                <span className="text-xs text-gray-500 ml-2">
                  {item.quantity} × {formatPrice(item.price)}
          </span>
              </div>
            ))}
            {items.length > 2 && (
              <div className="text-xs text-gray-500 mt-1 text-center">
                + {items.length - 2} more items
              </div>
            )}
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span>Subtotal:</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
        </div>
      )}
      
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
        aria-label="Open cart"
      >
        <ShoppingBag className="h-6 w-6" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transition-all">
            {itemCount}
          </span>
        )}
      </button>
      
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  )
}