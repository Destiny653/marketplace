import { useState, useEffect } from 'react'
import { StripeElementsForm } from '@/components/ui/stripe-element'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

/**
 * Payment form wrapper that fetches client secret and handles payment
 * @param {string} orderId - The order ID being paid for
 * @param {number} amount - The payment amount in cents
 */
export function PaymentForm({ orderId, amount }: { orderId: string; amount: number }) {
  const router = useRouter()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        // Validate amount
        if (isNaN(amount)) {
          throw new Error('Invalid payment amount')
        }

        const response = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            orderId,
            amount: Math.round(amount) // Ensure amount is a whole number
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to create payment')
        }

        const { clientSecret } = await response.json()
        setClientSecret(clientSecret)
      } catch (err) {
        console.error('Payment initialization error:', err)
        toast.error(err instanceof Error ? err.message : 'Failed to initialize payment')
        router.push('/checkout')
      } finally {
        setIsLoading(false)
      }
    }

    fetchClientSecret()
  }, [orderId, router, amount])

  const handleSuccess = () => {
    toast.success('Payment successful!')
    router.push(`/checkout/success?orderId=${orderId}`)
  }

  if (isLoading) {
    return <div className="text-center py-8">Preparing payment form...</div>
  }

  if (!clientSecret) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to initialize payment. Please try again.
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
      <StripeElementsForm 
        clientSecret={clientSecret} 
        onSuccess={handleSuccess} 
      />
    </div>
  )
}