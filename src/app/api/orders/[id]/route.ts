import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Get the order with items
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (
            name,
            image_url
          )
        )
      `)
      .eq('id', context.params.id)
      .single()
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch order' },
        { status: 500 }
      )
    }
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }
    
    // Check if the user is authorized to view this order
    if (order.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
