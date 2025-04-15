 'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, Check, ArrowRight, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { paymentMethods } from '@/lib/constants/payment-methods'
import { getOrderById, updateOrderPaymentStatus, updateOrderStatus } from '@/actions/order-actions'

interface OrderDetails {
  total_amount: number
}

interface OrderResponse {
  data?: OrderDetails
  error?: string
  status?: number
}

// Client-side cache for orders
const orderCache = new Map<string, OrderDetails>()

export default function PaymentConfirmationPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [orderId, setOrderId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (!params?.id) {
      router.push('/checkout')
      return
    }
    setOrderId(params.id)
  }, [params, router])

  const fetchOrderDetails = async () => {
    setIsLoading(true);
    setError(null);
  
    // Check cache first
    if (orderCache.has(orderId)) {
      setOrderDetails(orderCache.get(orderId)!);
      setIsLoading(false);
      return;
    }
  
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
  
    try {
      const result = await getOrderById(orderId, { 
        signal: controller.signal 
      });
      
      clearTimeout(timeoutId);
  
      if (result.error) {
        throw new Error(result.error);
      }
      
      if (result.data) {
        orderCache.set(orderId, result.data);
        setOrderDetails(result.data);
      }
    } catch (error) {
      // Handle errors
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // if (!orderId || !user) {
    //   if (!user) {
    //     router.push('/login?redirect=/checkout')
    //   }
    //   return
    // }

    fetchOrderDetails()
  }, [orderId, router, user, retryCount])

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method')
      return
    }
    
    setIsProcessing(true)
    
    try {
      // Optimistic updates
      const optimisticUpdate = {
        ...orderDetails,
        payment_status: 'paid',
        order_status: 'processing'
      }
      setOrderDetails(optimisticUpdate as OrderDetails)
      
      // Update payment status
      await updateOrderPaymentStatus(orderId, 'paid')
      
      // Update order status
      await updateOrderStatus(orderId, 'processing')
      
      // Show success message
      toast.success('Payment successful!')
      
      // Redirect to success page
      router.push(`/checkout/success?orderId=${orderId}`)
    } catch (error) {
      console.error('Payment error:', error)
      setOrderDetails(null) // Force refetch
      fetchOrderDetails() // Refresh data
      toast.error('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
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
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Error Loading Order</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setError(null)
                setRetryCount(0)
                fetchOrderDetails()
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/checkout')}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Return to Checkout
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!orderDetails) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find your order details</p>
          <button
            onClick={() => router.push('/checkout')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Return to Checkout
          </button>
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
        
        <div className="mb-8">
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="font-medium mb-2">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Order ID:</span>
              <span>{orderId}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-medium">${orderDetails?.total_amount?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
          
          <form onSubmit={handlePaymentSubmit}>
            <h2 className="font-medium mb-4">Select Payment Method</h2>
            
            <div className="space-y-3 mb-6">
              {paymentMethods.map((method) => (
                <div 
                  key={method.id}
                  className={`border rounded-lg p-4 cursor-pointer flex items-center ${
                    selectedPaymentMethod === method.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    id={method.id}
                    value={method.id}
                    checked={selectedPaymentMethod === method.id}
                    onChange={() => setSelectedPaymentMethod(method.id)}
                    className="mr-3"
                  />
                  <label htmlFor={method.id} className="flex-1 cursor-pointer">
                    <div className="font-medium">{method.name}</div>
                    <div className="text-sm text-gray-500">{method.description}</div>
                  </label>
                  {selectedPaymentMethod === method.id && (
                    <Check className="h-5 w-5 text-blue-600" />
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={isProcessing || !selectedPaymentMethod}
                className={`px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center justify-center ${
                  isProcessing || !selectedPaymentMethod ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Complete Payment'}
                {!isProcessing && <ArrowRight className="ml-2 h-4 w-4" />}
              </button>
              
              <button
                type="button"
                onClick={() => router.back()}
                disabled={isProcessing}
                className={`px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 ${
                  isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Back
              </button>
            </div>
          </form>
        </div>
        
        <div className="text-sm text-gray-500 border-t pt-6">
          <p>
            This is a secure payment process. Your payment information is encrypted and processed securely.
          </p>
        </div>
      </div>
    </div>
  )
}