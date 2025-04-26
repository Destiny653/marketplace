import { stripe } from '@/lib/stripe/client';
import { NextResponse } from 'next/server'; 

export async function POST(request: Request) {
  try {
    const { amount, orderId } = await request.json();

    // Validate the amount
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid payment amount' },
        { status: 400 }
      );
    }

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: orderId || 'unknown'
      }
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret
    });

  } catch (err) {
    console.error('Stripe error:', err);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}