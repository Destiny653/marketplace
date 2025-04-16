'use client'

import { useState } from 'react'
import { paymentMethods } from '@/lib/constants/payment-methods'
import { CreditCard, Wallet, Banknote } from 'lucide-react'

/**
 * Component for selecting payment method
 * @param {function} onSelect - Callback when method is selected
 */
export function PaymentMethods({ onSelect }: { onSelect: (method: string) => void }) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)

  const handleSelect = (methodId: string) => {
    setSelectedMethod(methodId)
    onSelect(methodId)
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return <CreditCard className="h-5 w-5" />
      case 'wallet': return <Wallet className="h-5 w-5" />
      case 'bank': return <Banknote className="h-5 w-5" />
      default: return <CreditCard className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-3">
      {paymentMethods.map((method) => (
        <div
          key={method.id}
          className={`border rounded-lg p-4 cursor-pointer flex items-center ${
            selectedMethod === method.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
          }`}
          onClick={() => handleSelect(method.id)}
        >
          <div className="mr-3 text-blue-600">
            {getMethodIcon(method.id)}
          </div>
          <div className="flex-1">
            <div className="font-medium">{method.name}</div>
            <div className="text-sm text-gray-500">{method.description}</div>
          </div>
          {selectedMethod === method.id && (
            <div className="text-blue-600">✓</div>
          )}
        </div>
      ))}
    </div>
  )
}