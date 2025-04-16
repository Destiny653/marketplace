'use client'
import { createContext, useContext, useState, useEffect } from 'react'

type PaymentContextType = {
  paymentMethod: string | null
  setPaymentMethod: (method: string) => void
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined)

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  // Initialize state with value from localStorage if it exists
  const [paymentMethod, setPaymentMethod] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('paymentMethod')
    }
    return null
  })

  // Update localStorage whenever paymentMethod changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (paymentMethod) {
        localStorage.setItem('paymentMethod', paymentMethod)
      } else {
        localStorage.removeItem('paymentMethod')
      }
    }
  }, [paymentMethod])

  return (
    <PaymentContext.Provider value={{ paymentMethod, setPaymentMethod }}>
      {children}
    </PaymentContext.Provider>
  )
}

export function usePayment() {
  const context = useContext(PaymentContext)
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider')
  }
  return context
}