import { supabase } from '../supabase/client'
import { stripe } from './client' 
import { cookies } from 'next/headers'

/**
 * Creates a Stripe customer for a Supabase user
 * @param {string} userId - Supabase user ID
 * @param {string} email - User email
 */
export async function createStripeCustomer(userId: string, email: string) {
  const customer = await stripe.customers.create({
    email,
    metadata: { supabase_user_id: userId }
  })
 
  if (supabase) {
    await supabase
    .from('profiles')
    .update({ stripe_customer_id: customer.id })
    .eq('id', userId)
  } else {
    console.error('Supabase client is not initialized')
}

  return customer
}

/**
 * Gets or creates a Stripe customer ID for a user
 */
export async function getOrCreateCustomer(userId: string, email: string) {
  if (!supabase) {
    console.error('Supabase client is not initialized')
    // Fallback to creating a new customer since we can't check if one exists
  const customer = await createStripeCustomer(userId, email)
  return customer.id
}
 
  const result = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single()

  if (result?.data?.stripe_customer_id) {
    return result.data.stripe_customer_id
  }

  const customer = await createStripeCustomer(userId, email)
  return customer.id
}