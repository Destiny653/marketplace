'use client'

import { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, ShoppingCart } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info' | 'cart'

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onClose: () => void
  isVisible: boolean
}

export default function Toast({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose,
  isVisible 
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])
  
  if (!isVisible) return null
  
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
    cart: <ShoppingCart className="h-5 w-5 text-blue-500" />
  }
  
  const bgColors = {
    success: 'bg-green-50',
    error: 'bg-red-50',
    info: 'bg-blue-50',
    cart: 'bg-blue-50'
  }
  
  const borderColors = {
    success: 'border-green-200',
    error: 'border-red-200',
    info: 'border-blue-200',
    cart: 'border-blue-200'
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
      <div className={`rounded-lg shadow-lg px-4 py-3 flex items-center ${bgColors[type]} border ${borderColors[type]}`}>
        <div className="mr-3">
          {icons[type]}
        </div>
        <div className="mr-2 text-sm font-medium text-gray-800">
          {message}
        </div>
        <button 
          onClick={onClose}
          className="ml-auto p-1 rounded-full hover:bg-gray-200 text-gray-500"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}