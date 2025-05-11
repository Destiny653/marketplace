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

    // Create Payment Intent with Google Pay support
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Convert to cents
      currency: 'usd',
      payment_method_types: ['card', 'google_pay'], // Explicitly enable Google Pay
      automatic_payment_methods: {
        enabled: true, // Still allow other methods dynamically
      },
      metadata: {
        orderId: orderId || 'unknown',
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (err) {
    console.error('Stripe error:', err);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}