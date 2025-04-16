'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '../supabase/types'

export async function getOrderById(orderId: string) {
    const supabase = await createServerComponentClient<Database>({ cookies })

    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single()

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error fetching order:', error)
        return {
            error: error instanceof Error ? error.message : 'Unknown error',
            status: 500
        }
    }
}

export async function createOrder({
    userId,
    items,
    totalAmount
}: {
    userId: string
    items: Array<{
        product_id: string
        quantity: number
        price: number
    }>
    totalAmount: number
}) {
    const supabase = createServerComponentClient<Database>({ cookies })

    try {
        const { data: order, error } = await supabase
            .from('orders')
            .insert({
                user_id: userId,
                total_amount: totalAmount,
                status: 'pending',
                payment_status: 'unpaid',
                items: items.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.price
                }))
            })
            .select()
            .single()

        if (error) throw error
        return order
    } catch (error) {
        console.error('Error creating order:', error)
        return null
    }
}

export async function updateOrderStatus(
    orderId: string,
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
) {
    const supabase = createServerComponentClient<Database>({ cookies })

    try {
        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId)

        if (error) throw error
        return true
    } catch (error) {
        console.error('Error updating order status:', error)
        return false
    }
}

export async function updateOrderPaymentStatus(
    orderId: string,
    paymentStatus: 'unpaid' | 'paid' | 'failed' | 'refunded'
) {
    const supabase = createServerComponentClient<Database>({ cookies })

    try {
        const { error } = await supabase
            .from('orders')
            .update({ payment_status: paymentStatus })
            .eq('id', orderId)

        if (error) throw error
        return true
    } catch (error) {
        console.error('Error updating payment status:', error)
        return false
    }
}  