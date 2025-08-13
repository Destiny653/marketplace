"use client";
import { useState, useEffect } from 'react'
import { StripePaymentForm } from '@/components/ui/stripe-payment-form'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { getPaymentMethodById } from '@/lib/constants/payment-methods'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { updateOrderPaymentStatus } from '@/lib/actions/order-actions';
import { useCart } from '@/hooks/useCart';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function PaymentForm({
  orderId,
  amount,
  paymentMethodId
}: {
  orderId: string;
  amount: number;
  paymentMethodId: any;
}) {
  const router = useRouter()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const paymentMethod = getPaymentMethodById(paymentMethodId)
   const { items, clearCart } = useCart()

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        if (isNaN(amount)) {
          throw new Error('Invalid payment amount')
        }

        const response = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            amount: Math.round(amount),
            payment_method_type: paymentMethod?.type
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to create payment')
        }

        const { clientSecret ,
          paymentIntentId, 
          status,
          created,
          currency,
          paymentMethodTypes,
          error,
          success,
         } = await response.json() 
         console.log('Payment Intent:', {
          clientSecret,
          paymentIntentId,
          status,
          created,
          currency,
          paymentMethodTypes,
          error,
          success,
         })
        await updateOrderPaymentStatus(orderId, status, paymentIntentId)

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
  }, [orderId, router, amount, paymentMethod?.type])

  const handleSuccess = () => {
    toast.success('Payment successful!')
    clearCart()
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
    <div className=" w-full max- mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-blue-600">Payment Details</h2>
      <Elements stripe={stripePromise} options={{clientSecret}}>
        <StripePaymentForm
          clientSecret={clientSecret}
          onSuccess={handleSuccess}
          paymentMethodType={paymentMethodId}
          orderId={orderId}
        />
      </Elements>
    </div>
  )
}
