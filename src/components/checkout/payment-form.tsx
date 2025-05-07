'use client'
import { useState, useEffect } from 'react'
import { StripePaymentForm } from '@/components/ui/stripe-payment-form'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { getPaymentMethodById } from '@/lib/constants/payment-methods'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { StripeElementsOptions } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function PaymentForm({
  orderId,
  amount,
  paymentMethodId
}: {
  orderId: string
  amount: number
  paymentMethodId: string
}) {
  const router = useRouter()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [paymentMethodType, setPaymentMethodType] = useState<string>('card')
  const paymentMethod = getPaymentMethodById(paymentMethodId)

  useEffect(() => {
    if (paymentMethod) {
      setPaymentMethodType(paymentMethod.type)
    }
  }, [paymentMethod])

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        if (isNaN(amount)) {
          throw new Error('Invalid payment amount')
        }

        // Only fetch client secret for Stripe payment methods
        if (paymentMethod?.type !== 'stripe_card') {
          setIsLoading(false)
          return
        }

        const response = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            amount: Math.round(amount * 100), // Convert to cents
            payment_method_type: paymentMethodType,
            currency: 'usd', // Adjust based on your needs
            capture_method: 'automatic' // For immediate payment capture
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
  }, [orderId, router, amount, paymentMethodType, paymentMethod])

  const handleSuccess = () => {
    toast.success('Payment successful!')
    router.push(`/checkout/success?orderId=${orderId}`)
  }

  const options: StripeElementsOptions = {
    clientSecret: clientSecret ?? undefined,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#2563eb',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        fontFamily: 'Inter, system-ui, sans-serif',
      }
    },
    loader: 'auto',
    fonts: [{
      cssSrc: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap'
    }]
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Preparing secure payment form...</p>
      </div>
    )
  }

  if (!paymentMethod) {
    return (
      <div className="text-center py-8 text-red-500">
        Invalid payment method selected. Please try again.
      </div>
    )
  }

  if (paymentMethod.type === 'stripe_card' && !clientSecret) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to initialize payment processor. Please try again.
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Complete Your Payment</h2>
      
      {paymentMethod.type === 'stripe_card' ? (
        <Elements stripe={stripePromise} options={options}>
          <StripePaymentForm
            clientSecret={clientSecret!}
            onSuccess={handleSuccess}
            orderId={orderId}
          />
        </Elements>
      ) : (
        <div className="text-center py-8">
          <p>Selected payment method: {paymentMethod.name}</p>
          {/* Add other payment processor components here */}
        </div>
      )}
    </div>
  )
}