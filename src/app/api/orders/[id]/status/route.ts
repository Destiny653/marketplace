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
    
    // Get the order
    const { data: order, error } = await supabase
      .from('orders')
      .select('id, user_id, status')
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
    
    return NextResponse.json({
      status: order.status || 'pending'
    })
  } catch (error) {
    console.error('Error fetching order status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
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
    
    const { status } = await request.json()
    
    // Update the order status
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', context.params.id)
      .eq('user_id', session.user.id)
      .select()
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to update order status' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      status: 'success',
      data
    })
  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
