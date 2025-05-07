 'use client'

import {
  PaymentElement,
  useStripe,
  useElements,
  LinkAuthenticationElement,
} from '@stripe/react-stripe-js'
import { StripeError } from '@stripe/stripe-js'
import { FormEvent, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User } from '@supabase/supabase-js'
import toast from 'react-hot-toast'

interface Address {
  fullName?: string
  addressLine1?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  phoneNumber?: string
}

interface Order {
  id: string
  total_amount: number
  status: string
  payment_status: string
  user_id: string
  billing_address?: Address
  shipping_address?: Address
}

interface StripePaymentFormProps {
  clientSecret: string
  onSuccess: () => void
  orderId: string
}

export function StripePaymentForm({
  clientSecret,
  onSuccess,
  orderId
}: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [order, setOrder] = useState<Order | null>(null)
  const [email, setEmail] = useState('')
  const supabase = createClientComponentClient()

  // Configure Express Checkout options
  const paymentElementOptions = {
    layout: {
      type: 'accordion' as const,
      defaultCollapsed: false,
      radios: true,
      spacedAccordionItems: false
    },
    wallets: {
      applePay: 'never' as const, // Let Stripe auto-detect
      googlePay: 'never' as const // Let Stripe auto-detect
    },
    paymentMethodOrder: [
      'apple_pay',
      'google_pay',
      'link',
      'card'
    ],
    fields: {
      billingDetails: {
        name: 'auto' as const,
        email: 'auto' as const,
        phone: 'auto' as const
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError
        if (!user) throw new Error('User not authenticated')
        setUser(user)
        setEmail(user.email || '')

        // Get order details
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single()

        if (orderError) throw orderError
        if (!orderData) throw new Error('Order not found')

        setOrder(orderData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
        console.error('Data loading error:', err)
      }
    }

    fetchData()
  }, [supabase, orderId])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      setError('Payment system not ready')
      return
    }

    setProcessing(true)
    setError(null)

    try {
      // First submit the elements to validate them
      const { error: submitError } = await elements.submit()
      if (submitError) throw submitError

      const { error: confirmationError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success?order_id=${orderId}`,
          receipt_email: email,
        },
        // Enable automatic payment methods
        redirect: 'if_required'
      })

      if (confirmationError) throw confirmationError

      // Update order status
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          status: 'processing',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)

      if (updateError) throw updateError

      onSuccess()
    } catch (err) {
      const error = err as StripeError | Error
      setError(error.message || 'Payment processing failed')
      console.error('Payment error:', error)
      toast.error(error.message || 'Payment processing failed')
    } finally {
      setProcessing(false)
    }
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-4 bg-red-50 text-red-600 rounded-lg">
        <h3 className="font-medium text-lg mb-2">Error</h3>
        <p>{error}</p>
        <button
          onClick={() => setError(null)}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!user || !order) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-2">Loading payment details...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-lg mb-2">Order Summary</h3>
        <p className="text-gray-700">Total: ${order.total_amount.toFixed(2)}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <LinkAuthenticationElement
          options={{
            defaultValues: {
              email: user.email || ''
            }
          }}
          onChange={(e) => setEmail(e.value.email)}
        />

        <PaymentElement
          options={paymentElementOptions}
          className="mb-4"
        />

        <button
          type="submit"
          disabled={!stripe || processing}
          className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors
            ${!stripe || processing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {processing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Payment...
            </span>
          ) : (
            `Pay $${order.total_amount.toFixed(2)}`
          )}
        </button>
      </form>
    </div>
  )
}