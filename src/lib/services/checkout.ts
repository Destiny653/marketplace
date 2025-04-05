'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { CartItem } from '@/hooks/useCart'

export interface ShippingAddress {
  fullName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phoneNumber: string
}

export interface CheckoutData {
  items: CartItem[]
  shippingAddress: ShippingAddress
  billingAddress?: ShippingAddress
  shippingMethod: string
}

export interface CheckoutResult {
  success: boolean
  orderId?: string
  error?: string
}

export async function processCheckout(checkoutData: CheckoutData): Promise<CheckoutResult> {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    // Get the current user
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session) {
      return {
        success: false,
        error: 'You must be logged in to checkout'
      }
    }
    
    const userId = session.user.id
    
    // Format items for the database function
    const itemsArray = checkoutData.items.map(item => ({
      id: item.id,
      quantity: item.quantity
    }))
    
    // Log the data for debugging
    console.log('Items array:', itemsArray)
    
    // Call the database function to create the order
    const { data, error } = await supabase.rpc('create_order', {
      p_user_id: userId,
      p_items: itemsArray,
      p_shipping_address: checkoutData.shippingAddress,
      p_billing_address: checkoutData.billingAddress || checkoutData.shippingAddress,
      p_shipping_method: checkoutData.shippingMethod
    })
    
    // Log any error for debugging
    if (error) {
      console.log('Order creation params:', {
        p_user_id: userId,
        p_items: itemsArray,
        p_shipping_address: checkoutData.shippingAddress,
        p_billing_address: checkoutData.billingAddress || checkoutData.shippingAddress,
        p_shipping_method: checkoutData.shippingMethod
      })
      
      console.error('Error creating order:', error)
      return {
        success: false,
        error: error.message
      }
    }
    
    return {
      success: true,
      orderId: data
    }
  } catch (error: any) {
    console.error('Checkout process error:', error)
    return {
      success: false,
      error: error.message || 'An unexpected error occurred during checkout'
    }
  }
}