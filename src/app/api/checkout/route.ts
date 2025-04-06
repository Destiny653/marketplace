import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { CartItem } from '@/hooks/useCart'
import { PaymentMethod } from '@/lib/payment-methods'
import Stripe from 'stripe'

interface ShippingAddress {
  fullName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phoneNumber: string
}

interface CheckoutRequestBody {
  items: CartItem[]
  shippingAddress: ShippingAddress
  billingAddress?: ShippingAddress
  shippingMethod: string
  paymentMethod: PaymentMethod
  paymentDetails?: any
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get the current user
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const userId = session.user.id
    const body: CheckoutRequestBody = await request.json()
    
    // Validate the request body
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No items provided for checkout' },
        { status: 400 }
      )
    }
    
    if (!body.shippingAddress) {
      return NextResponse.json(
        { success: false, error: 'Shipping address is required' },
        { status: 400 }
      )
    }

    if (!body.paymentMethod) {
      return NextResponse.json(
        { success: false, error: 'Payment method is required' },
        { status: 400 }
      )
    }
    
    // Format items for the database function
    const formattedItems = body.items.map(item => ({
      product_id: item.id,
      quantity: item.quantity
    }))

    // Calculate total amount
    const total = await calculateOrderTotal(supabase, formattedItems)

    // Initialize payment based on method
    let paymentIntentId = null
    let paymentStatus = 'pending'

    const paymentMethodStr = body.paymentMethod as string
    if (paymentMethodStr.startsWith('stripe_')) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2025-03-31.basil',
      })

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100), // Convert to cents
        currency: 'usd',
        payment_method_types: [paymentMethodStr.replace('stripe_', '')],
        metadata: {
          userId: userId,
        },
      })

      paymentIntentId = paymentIntent.id
    } else if (paymentMethodStr.startsWith('crypto_')) {
      // Generate crypto payment address and details
      const cryptoPayment = await generateCryptoPaymentDetails(paymentMethodStr, total)
      paymentIntentId = cryptoPayment.paymentId
    }
    
    // Call the database function to create the order
    const { data, error } = await supabase.rpc('create_order', {
      p_user_id: userId,
      p_shipping_address: body.shippingAddress,
      p_billing_address: body.billingAddress || body.shippingAddress,
      p_shipping_method: body.shippingMethod || 'Standard Shipping',
      p_payment_method: body.paymentMethod,
      p_payment_status: paymentStatus,
      p_payment_intent_id: paymentIntentId,
      p_items: formattedItems
    })
    
    if (error) {
      console.error('Error creating order:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    
    // Return the order details
    return NextResponse.json({
      success: true,
      orderId: data,
      paymentIntentId,
      paymentDetails: paymentMethodStr.startsWith('crypto_') && paymentIntentId ? await getCryptoPaymentDetails(paymentIntentId) : null,
      message: 'Order created successfully'
    })
    
  } catch (error: any) {
    console.error('Checkout process error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

async function calculateOrderTotal(supabase: any, items: { product_id: string; quantity: number }[]) {
  let total = 0
  for (const item of items) {
    const { data: product } = await supabase
      .from('products')
      .select('price')
      .eq('id', item.product_id)
      .single()
    
    if (product) {
      total += product.price * item.quantity
    }
  }
  return total
}

async function generateCryptoPaymentDetails(method: string, amount: number) {
  // This is a placeholder. In a real implementation, you would:
  // 1. Generate a unique payment address for the specific cryptocurrency
  // 2. Calculate the crypto amount based on current exchange rates
  // 3. Set up payment monitoring
  // 4. Return payment details
  
  const paymentId = `CRYPTO_${Date.now()}_${Math.random().toString(36).substring(7)}`
  
  return {
    paymentId,
    address: '0x1234...', // Example address
    amount: amount,
    currency: method.replace('crypto_', '').toUpperCase()
  }
}

async function getCryptoPaymentDetails(paymentId: string) {
  // This would retrieve the payment details for a specific crypto payment
  // In a real implementation, you would fetch this from your crypto payment processor
  return {
    address: '0x1234...', // Example address
    amountPaid: 0,
    status: 'pending',
    expiresAt: new Date(Date.now() + 3600000).toISOString() // 1 hour expiry
  }
}