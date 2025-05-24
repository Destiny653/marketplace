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
      amount: Math.round(amount), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: orderId || 'unknown'
      }
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: paymentIntent.metadata.orderId,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      status: paymentIntent.status,
      created: paymentIntent.created,
      currency: paymentIntent.currency,
      paymentMethodTypes: paymentIntent.payment_method_types,
      error: null,
      success: true,
    });
  } catch (err) {
    console.error('Stripe error:', err);
    return NextResponse.json(
      { error: 'Failed to create payment intent: '+err},
      { status: 500 }
    );
  }
}