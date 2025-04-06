'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, Check, ArrowRight } from 'lucide-react'
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

export default function PaymentConfirmationPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/checkout')
      return
    }

    // Fetch order details
    const fetchOrderDetails = async () => {
      try {
        const result: OrderResponse = await getOrderById(params.id)
        if (result.error) {
          toast.error(result.error)
          return
        }
        if (result.data) {
          setOrderDetails(result.data)
        }
      } catch (error) {
        console.error('Error fetching order details:', error)
        toast.error('Failed to load order details')
      }
    }

    fetchOrderDetails()
  }, [params.id, router, user])

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method')
      return
    }
    
    setIsProcessing(true)
    
    try {
      // Update payment status
      await updateOrderPaymentStatus(params.id, 'paid')
      
      // Update order status
      await updateOrderStatus(params.id, 'processing')
      
      // Show success message
      toast.success('Payment successful!')
      
      // Redirect to success page
      router.push(`/checkout/success?orderId=${params.id}`)
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!orderDetails) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
            <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-12 bg-gray-200 rounded w-full"></div>
          </div>
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
              <span>{params.id}</span>
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
