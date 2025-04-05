'use client'

import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import CartSidebar from '@/components/cart/CartSidebar'
import { formatPrice } from '@/lib/utils/helpers'

export default function FloatingCartButton() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const { items } = useCart()
  
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  
  // Don't show if cart is empty
  if (itemCount === 0) return null
  
  return (
    <>
      <div 
        className="fixed bottom-6 right-6 z-30"
        onMouseEnter={() => setShowPreview(true)}
        onMouseLeave={() => setShowPreview(false)}
      >
        {/* Mini Cart Preview */}
        {showPreview && items.length > 0 && (
          <div className="absolute bottom-16 right-0 w-64 bg-white rounded-lg shadow-lg p-4 mb-2 border border-gray-200 transform transition-all duration-200 ease-in-out">
            <div className="text-sm font-medium mb-2">Cart Summary</div>
            <div className="max-h-40 overflow-y-auto mb-2">
              {items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center py-2 border-b border-gray-100">
                  <span className="text-xs truncate flex-1">{item.name}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    {item.quantity} × {formatPrice(item.price)}
                  </span>
                </div>
              ))}
              {items.length > 3 && (
                <div className="text-xs text-gray-500 mt-1 text-center">
                  + {items.length - 3} more items
                </div>
              )}
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span>Subtotal:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1 text-center">
              Click to view full cart
            </div>
          </div>
        )}
        
        {/* Floating Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg flex items-center justify-center transition-all hover:scale-105"
          aria-label="Open cart"
        >
          <ShoppingBag className="h-6 w-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium">
            {itemCount}
          </span>
        </button>
      </div>
      
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  )
}