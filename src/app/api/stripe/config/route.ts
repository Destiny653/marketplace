import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'

/**
 * Provides client-side Stripe configuration
 */
export async function GET() {
  return NextResponse.json({
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    country: 'US', // Set your country code
    currency: 'usd',
    paymentMethods: ['card'] // Supported payment methods
  })
}