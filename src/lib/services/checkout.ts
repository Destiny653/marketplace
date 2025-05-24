'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { CartItem } from '@/hooks/useCart'
import { v4 as uuidv4 } from 'uuid' 

// Function to validate and convert product IDs
function validateAndConvertProductId(productId: string): string {
  try {
    // Check if the product ID is a valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(productId)) {
      throw new Error('Invalid product ID')
    }
    return productId
  } catch (error) {
    // If the product ID is not a valid UUID, generate a new one
    return uuidv4()
  }
}

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
  paymentMethod: string
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
    
    // Fetch valid product IDs and their stock from the database
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, stock_quantity')
    
    if (productsError) {
      console.error('Error fetching products:', productsError)
      return {
        success: false,
        error: 'Failed to fetch products'
      }
    }
    
    const productStockMap: { [key: string]: number } = products.reduce((map: { [key: string]: number }, product) => {
      map[product.id] = product.stock_quantity ?? 0; // Add null coalescing operator to handle null values
      return map;
    }, {});

    // Format items for the database function
    const itemsArray = checkoutData.items.map(item => {
      const productId = validateAndConvertProductId(item.id)
      if (!(productId in productStockMap)) {
        throw new Error(`Product ID ${productId} does not exist`)
      }
      if (item.quantity > productStockMap[productId]) {
        throw new Error(`Insufficient stock for product ID ${productId}. Available stock: ${productStockMap[productId]}`)
      }
      return {
        id: productId,
        quantity: item.quantity
      }
    })
    
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
    
    // Return the order ID for payment page redirection
    return {
      success: true,
      orderId: data,
    }
  } catch (error: any) {
    console.error('Checkout process error:', error)
    return {
      success: false,
      error: error.message || 'An unexpected error occurred during checkout'
    }
  }
}