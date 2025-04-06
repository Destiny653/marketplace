import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
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
      .select('id, user_id, payment_status')
      .eq('id', params.id)
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
      status: order.payment_status || 'pending'
    })
  } catch (error) {
    console.error('Error fetching payment status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
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
    
    const { paymentStatus } = await request.json()
    
    // Update the order payment status
    const { data, error } = await supabase
      .from('orders')
      .update({ payment_status: paymentStatus })
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .select()
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to update payment status' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      status: 'success',
      data
    })
  } catch (error) {
    console.error('Error updating payment status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
