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


// import { NextResponse } from 'next/server'
// import Stripe from 'stripe'

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2023-10-16'
// })

// export async function POST(request: Request) {
//   try {
//     const { orderId, amount } = await request.json()

//     // Validate input
//     if (!orderId || typeof orderId !== 'string') {
//       return NextResponse.json(
//         { error: 'Invalid order ID' },
//         { status: 400 }
//       )
//     }

//     if (isNaN(amount) || amount <= 0) {
//       return NextResponse.json(
//         { error: 'Invalid payment amount' },
//         { status: 400 }
//       )
//     }

//     // Create payment intent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(amount), // Amount in cents
//       currency: 'usd',
//       metadata: {
//         orderId
//       }
//     })

//     return NextResponse.json({
//       clientSecret: paymentIntent.client_secret
//     })

//   } catch (err) {
//     console.error('Stripe error:', err)
//     return NextResponse.json(
//       { error: 'Failed to create payment intent' },
//       { status: 500 }
//     )
//   }
// }