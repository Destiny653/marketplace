'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

// In your type definitions file (e.g., types.ts)
export interface OrderResponse {
  data?: OrderDetails;
  error?: string;
  status?: number;
  user_id?: string;
}



export interface OrderDetails {
  payment_status: string;
  status: string;
  user_id: string;
  id: string;
  total_amount: number;
  // Add other order properties as needed
}

export interface GetOrderByIdOptions {
  signal?: AbortSignal;
}

/**
 * Get order details by ID
 */
// Update the function signature to accept options
export async function getOrderById(orderId: string) {
  // Create Supabase client with proper cookie handling
  const supabase = createServerComponentClient({
    cookies
  })
  try {
    const { data, error, status } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (error) throw error
    
    return { 
      data: {
        id: data.id,
        total_amount: data.total_amount,
        payment_status: data.payment_status || 'unpaid',
        status: data.status || 'pending',
        user_id: data.user_id
      }
    }
  } catch (error) {
    console.error('Error fetching order:', error)
    return { 
      error: error instanceof Error ? error.message : 'Failed to fetch order',
      status: 500 
    }
  }
}
/**
 * Get order payment status
 */
export async function getOrderPaymentStatus(orderId: string) {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return {
        error: 'Unauthorized',
        status: 401
      }
    }
    
    // Get the order
    const { data: order, error } = await supabase
      .from('orders')
      .select('id, user_id, payment_status')
      .eq('id', orderId)
      .single()
    
    if (error) {
      return {
        error: 'Failed to fetch order',
        status: 500
      }
    }
    
    if (!order) {
      return {
        error: 'Order not found',
        status: 404
      }
    }
    
    // Check if the user is authorized to view this order
    if (order.user_id !== session.user.id) {
      return {
        error: 'Unauthorized',
        status: 403
      }
    }
    
    return { 
      data: {
        status: order.payment_status || 'pending'
      }
    }
  } catch (error) {
    console.error('Error fetching payment status:', error)
    return {
      error: 'Internal server error',
      status: 500
    }
  }
}

/**
 * Update order payment status
 */
export async function updateOrderPaymentStatus(orderId: string, paymentStatus: string, paymentIntentId: string) {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return {
        error: 'Unauthorized',
        status: 401
      }
    }
    
    // Update the order payment status
    const { data, error } = await supabase
      .from('orders')
      .update({ payment_status: paymentStatus, payment_intent_id: paymentIntentId })
      .eq('id', orderId)
      .eq('user_id', session.user.id)
      .select()
    
    if (error) {
      return {
        error: 'Failed to update payment status',
        status: 500
      }
    }
    
    // Revalidate the order pages
    revalidatePath(`/checkout/payment/${orderId}`)
    revalidatePath(`/checkout/success`)
    
    return {
      data,
      status: 'success'
    }
  } catch (error) {
    console.error('Error updating payment status:', error)
    return {
      error: 'Internal server error',
      status: 500
    }
  }
}

/**
 * Get order status
 */
export async function getOrderStatus(orderId: string) {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return {
        error: 'Unauthorized',
        status: 401
      }
    }
    
    // Get the order
    const { data: order, error } = await supabase
      .from('orders')
      .select('id, user_id, status')
      .eq('id', orderId)
      .single()
    
    if (error) {
      return {
        error: 'Failed to fetch order',
        status: 500
      }
    }
    
    if (!order) {
      return {
        error: 'Order not found',
        status: 404
      }
    }
    
    // Check if the user is authorized to view this order
    if (order.user_id !== session.user.id) {
      return {
        error: 'Unauthorized',
        status: 403
      }
    }
    
    return { 
      data: {
        status: order.status || 'pending'
      }
    }
  } catch (error) {
    console.error('Error fetching order status:', error)
    return {
      error: 'Internal server error',
      status: 500
    }
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return {
        error: 'Unauthorized',
        status: 401
      }
    }
    
    // Update the order status
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .eq('user_id', session.user.id)
      .select()
    
    if (error) {
      return {
        error: 'Failed to update order status',
        status: 500
      }
    }
    
    // Revalidate the order pages
    revalidatePath(`/checkout/payment/${orderId}`)
    revalidatePath(`/checkout/success`)
    
    return {
      data,
      status: 'success'
    }
  } catch (error) {
    console.error('Error updating order status:', error)
    return {
      error: 'Internal server error',
      status: 500
    }
  }
}
