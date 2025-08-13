import { CheckCircle, Package, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface OrderConfirmationProps {
  order: {
    id: string
    total_amount: number
    status: string
    payment_status: string
    created_at: string 
  }
}


export function OrderConfirmation({ order }: OrderConfirmationProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      
      <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
      <p className="text-gray-600 mb-6">
        Thank you for your purchase. Your order #{order.id} has been received.
      </p>
      
      <div className="bg-gray-50 p-6 rounded-lg mb-8 text-left">
        <div className="flex justify-between items-center mb-4 pb-4 border-b">
          <span className="text-gray-600">Order Number:</span>
          <span className="font-medium">{order.id}</span>
        </div>
        
        <div className="flex justify-between items-center mb-4 pb-4 border-b">
          <span className="text-gray-600">Date:</span>
          <span>{new Date(order.created_at).toLocaleDateString()}</span>
        </div>
        
        <div className="flex justify-between items-center mb-4 pb-4 border-b">
          <span className="text-gray-600">Status:</span>
          <span className="capitalize">{order.status.replace('_', ' ')}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total:</span>
          <span className="font-medium">${order.total_amount.toFixed(2)}</span>
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
              You'll receive an order confirmation email with details.
            </p>
          </li>
          
          <li className="flex">
            <div className="bg-blue-100 rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
              <span className="text-blue-800 text-sm font-medium">2</span>
            </div>
            <p className="text-gray-600">
              We're processing your order and will notify you when it ships.
            </p>
          </li>
        </ol>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
        {/* <Button variant="outline" asChild>
          <Link href={`/account/orders/${order.id}`}>
            <CreditCard className="mr-2 h-4 w-4" />
            View Order Details
          </Link>
        </Button> */}
      </div>
    </div>
  )
}