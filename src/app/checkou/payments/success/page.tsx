import { OrderConfirmation } from '@/components/checkout/order-confirmation'
import { getOrderById } from '@/lib/actions/order-action'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: { orderId: string }
}) {
  if (!searchParams.orderId) {
    redirect('/')
  }

  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  const order = await getOrderById(searchParams.orderId)

  if (!order || (user && order.user_id !== user.id)) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <OrderConfirmation order={order} />
    </div>
  )
}