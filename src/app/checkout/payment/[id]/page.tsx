'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CreditCard, AlertCircle } from 'lucide-react' 
import { useAuth } from '@/hooks/useAuth'
import { getOrderById } from '@/lib/actions/order-actions'
import { StripeProvider } from '@/providers/stripe-provider'
import { PaymentForm } from '@/components/checkout/payment-form'
import { usePayment } from '@/contexts/PaymentContext'

interface OrderDetails {
  id: string
  total_amount: number
  status: string
  payment_status: string
  user_id: string
}

export default function PaymentConfirmationPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params as { id: string } // Type assertion for dynamic route param
  const { user, loading: authLoading } = useAuth()
  const { paymentMethod } = usePayment()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (!id || authLoading) return

    const fetchOrderDetails = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const { data: order, error } = await getOrderById(id)

        if (error || !order) {
          throw new Error(error || 'Order not found')
        }

        if (user && order.user_id !== user.id) {
          throw new Error('Unauthorized access to order')
        }

        const totalAmount = Number(order.total_amount)
        if (isNaN(totalAmount)) {
          throw new Error('Invalid order total amount')
        }

        setOrderDetails({
          id: order.id,
          total_amount: totalAmount,
          status: order.status || 'pending',
          payment_status: order.payment_status || 'unpaid',
          user_id: order.user_id
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order')
        
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1)
          }, 1000 * (retryCount + 1))
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [id, router, user, retryCount, authLoading])
  // Calculate amount in cents for Stripe
  const stripeAmount = orderDetails ? Math.round(orderDetails.total_amount * 100) : 0

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading your order details...</p>
            <p className="text-sm text-gray-500">
              {retryCount > 0 ? `Attempt ${retryCount + 1} of 3` : 'This should only take a moment'}
            </p>
          </div>
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <AlertCircle className="h-16 w-16 text-red-500" />
            <p className="text-red-600 font-semibold">{error}</p>
            <button
              onClick={() => router.push('/checkout')}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }
  if (!orderDetails) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-600">No order details available.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <CreditCard className="mr-2 h-6 w-6 text-blue-600" />
          Complete Your Payment
        </h1>

        <StripeProvider>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-4">Complete Your Payment</h1>
            <p className="text-gray-600 mb-6">
              Order Total: ${orderDetails.total_amount.toFixed(2)}
            </p>
            <PaymentForm 
              orderId={id}
              amount={stripeAmount} // Pass the amount in cents
              paymentMethodId={paymentMethod}
            />
          </div>
        </StripeProvider>

        <div className="text-sm text-gray-500 border-t pt-6">
          <p>
            This is a secure payment process. Your payment information is encrypted and processed securely.
          </p>
        </div>
      </div>
    </div>
  )
}