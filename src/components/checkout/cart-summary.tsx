 'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation' 
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner' 
import { Database } from '@/lib/supabase/types' 
import { CartItem} from './cart-item' 
import type { CartItem as CartItemType } from '@/types/cartItem'

// Type 'OrderResponse' is missing the following properties from type 'CartItem[]': pop, push, concat, join, and 34 more.ts(2740)

interface CartSummaryProps {
  items: CartItemType[]
  userId: string
}

export function CartSummary({ items, userId }: CartSummaryProps) {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const subtotal = items && items?.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const handleCheckout = async () => {
    try {
      // Create order in Supabase directly
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          total_amount: subtotal,
          status: 'pending',
          payment_status: 'unpaid',
          items: items.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        })
        .select()
        .single()

      if (error) throw error

      // Clear the cart after successful order creation
      await supabase
        .from('carts')
        .delete()
        .eq('user_id', userId)

      router.push(`/checkout/payment/${order.id}`)
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Failed to create order. Please try again.')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Items</h2>
          <div className="space-y-4">
            {items?.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold">
                <span>Estimated Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full mt-4"
              size="lg"
              disabled={items.length === 0}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}