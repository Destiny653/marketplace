import { stripe } from '@/lib/stripe/client';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  console.log("stripe user checkout: ", user)

  if (!user) return new NextResponse('Unauthorized user not found', { status: 401 });

  const { amount } = await req.json();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'usd',
    metadata: { userId: user.id },
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}