import { CartSummary } from '@/components/checkout/cart-summary'
import { getOrderById } from '@/lib/actions/order-action'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function CartPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/checkout/cart')
    
  }

  const cartItems = await getOrderById(user.id)

  if (cartItems === 0) {
    redirect('/products')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      <CartSummary items={cartItems} userId={user.id} />
    </div>
  )
}