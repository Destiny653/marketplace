import { stripe } from './client' 
import { cookies } from 'next/headers'
import { Stripe } from 'stripe'
import { supabase } from '../supabase/client'

/**
 * Handles all Stripe webhook events
 * @param {Stripe.Event} event - The Stripe webhook event
 */
export async function handleStripeWebhook(event: Stripe.Event) { 
  const session = event.data.object as Stripe.Checkout.Session

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(session)
      break
    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
      break
    // Add more event handlers as needed
    default:
      console.warn(`Unhandled event type: ${event.type}`)
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  if (!supabase) {
    console.error('Supabase client is not initialized')
    return
  }

  const result = await supabase.from('orders')
    .update({
      payment_status: 'paid',
      status: 'processing'
    })
    .eq('payment_intent_id', session.payment_intent as string)
    .select()
    .single()

  if (!result || !result.data) {
    console.error('Order not found for payment intent:', session.payment_intent)
    return
  }

  const order = result.data

  // Send confirmation email or trigger other business logic
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  // Additional payment success logic if needed
}