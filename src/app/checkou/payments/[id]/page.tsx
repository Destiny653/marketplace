import { StripeProvider } from '@/providers/stripe-provider'
import { getOrderById } from '@/lib/actions/order-action'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { PaymentForm } from '@/components/checkout/payment-form'

interface PaymentPageProps {
  params: { id: string }
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?redirect=/checkout/payment/${params.id}`)
  }

  const order = await getOrderById(params.id)

  if (!order || order.user_id !== user.id) {
    notFound()
  }

  if (order.payment_status === 'paid') {
    redirect(`/checkout/payment/success?orderId=${params.id}`)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <StripeProvider>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">Complete Your Payment</h1>
          <p className="text-gray-600 mb-6">
            Order Total: ${order.total_amount.toFixed(2)}
          </p>
          <PaymentForm orderId={params.id} amount={order.total_amount.toFixed(2)} />
        </div>
      </StripeProvider>
    </div>
  )
}