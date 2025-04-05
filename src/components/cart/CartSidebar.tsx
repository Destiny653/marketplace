'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, X, Plus, Minus, Trash2 } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils/helpers'

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, updateQuantity, removeItem } = useCart()
  const [mounted, setMounted] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  
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

  // Calculate totals
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  // Handle smooth closing animation
  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 300) // Match this with the CSS transition duration
  }

  // Handle client-side rendering to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Reset closing state when opening
  useEffect(() => {
    if (isOpen) setIsClosing(false)
  }, [isOpen])

  // Handle escape key to close
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose()
      }
    }
    
    window.addEventListener('keydown', handleEscKey)
    return () => window.removeEventListener('keydown', handleEscKey)
  }, [isOpen])

  if (!mounted) return null

  return (
    <>
      {/* Overlay - Glass effect */}
      {(isOpen || isClosing) && (
        <div 
          className={`fixed inset-0 backdrop-blur-sm bg-white/30 transition-opacity duration-300 z-40 ${
            isOpen && !isClosing ? 'opacity-100' : 'opacity-0'
          } ${isClosing ? 'pointer-events-none' : ''}`}
          onClick={handleClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen && !isClosing ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-medium">Your Cart</h2>
            <button 
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.id} className="flex py-2 border-b pb-4">
                    <div className="relative h-16 w-16 flex-shrink-0 rounded overflow-hidden">
                      <Image
                        src={isValidImageUrl(item.image) ? item.image : fallbackImageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                          {item.name}
                        </h3>
                        <button 
                          onClick={() => removeItem(item.id)} 
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatPrice(item.price)}
                      </p>
                      <div className="mt-2 flex items-center">
                        <button 
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                          aria-label="Decrease quantity"
                          disabled={item.quantity <= 1}
              >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="mx-2 text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 border-t">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
              <p className="text-xs text-gray-500 mb-4">
                Shipping, taxes, and discounts calculated at checkout
              </p>
              <Link
                href="/cart"
                className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md text-center font-medium hover:bg-blue-700 transition-colors"
                onClick={handleClose}
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                className="mt-2 block w-full border border-gray-300 bg-white py-2 px-4 rounded-md text-center font-medium hover:bg-gray-50 transition-colors"
                onClick={handleClose}
              >
                Checkout
              </Link>
      </div>
          )}
        </div>
      </div>
    </>
  )
}