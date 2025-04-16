import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe/client'
import { handleStripeWebhook } from '@/lib/stripe/webhooks'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const body = await req.text()
  const signature =  (await headers()).get('stripe-signature') || ''

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    await handleStripeWebhook(event)
    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}