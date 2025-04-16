'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, ArrowRight, Package, CreditCard, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { getOrderById, getOrderPaymentStatus, getOrderStatus } from '@/lib/actions/order-actions'

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('orderId')
  const [paymentStatus, setPaymentStatus] = useState(null)
  const [orderStatus, setOrderStatus] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) {
      router.push('/')
      return
    }

    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const [paymentResult, statusResult] = await Promise.all([
          getOrderPaymentStatus(orderId),
          getOrderStatus(orderId)
        ])

        if (paymentResult.error || statusResult.error) {
          setError(paymentResult.error || statusResult.error || 'Failed to load order details')
          return
        }

        setPaymentStatus(paymentResult.data?.status || null)
        setOrderStatus(statusResult.data?.status || null)
      } catch (err) {
        setError('Failed to load order details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [orderId, router])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p>Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Error Loading Order</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/account')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View Account
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>

        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <div className="flex justify-between items-center mb-4 pb-4 border-b">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-medium">{orderId}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status:</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {orderStatus || 'Processing'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Payment Status:</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {paymentStatus || 'Pending'}
            </span>
          </div>
        </div>

        <div className="mb-8 text-left">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Package className="mr-2 h-5 w-5" />
            What happens next?
          </h2>

          <ol className="space-y-4">
            <li className="flex">
              <div className="bg-blue-100 rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <span className="text-blue-800 text-sm font-medium">1</span>
              </div>
              <p className="text-gray-600">
                You will receive an order confirmation email with details of your purchase.
              </p>
            </li>

            <li className="flex">
              <div className="bg-blue-100 rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <span className="text-blue-800 text-sm font-medium">2</span>
              </div>
              <p className="text-gray-600">
                Our team will process your order and prepare it for shipping.
              </p>
            </li>

            <li className="flex">
              <div className="bg-blue-100 rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <span className="text-blue-800 text-sm font-medium">3</span>
              </div>
              <p className="text-gray-600">
                Once your order ships, you'll receive a shipping confirmation email with tracking information.
              </p>
            </li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
          >
            Continue Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>

          <Link
            href="/account"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            View Order History
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading order details...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  )
}