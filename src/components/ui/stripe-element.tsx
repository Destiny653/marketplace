'use client'

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { FormEvent, useState } from 'react'

/**
 * Stripe Elements form for secure credit card input
 * @param {string} clientSecret - From PaymentIntent
 * @param {function} onSuccess - Callback on successful payment
 */
export function StripeElementsForm({
  clientSecret,
  onSuccess
}: {
  clientSecret: string
  onSuccess: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)
    setError(null)

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
          }
        }
      )

      if (stripeError) {
        setError(stripeError.message || 'Payment failed')
        return
      }

      if (paymentIntent.status === 'succeeded') {
        onSuccess()
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': { color: '#aab7c4' }
            },
            invalid: { color: '#9e2146' }
          }
        }}
      />
      
      {error && <div className="text-red-500 text-sm">{error}</div>}
      
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  )
}