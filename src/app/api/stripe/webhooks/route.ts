import { stripe } from '@/lib/stripe/client';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { handleStripeWebhook } from '@/lib/stripe/webhooks';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature')!;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    
    await handleStripeWebhook(event);
    return NextResponse.json({ received: true });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 400 });
  }
}