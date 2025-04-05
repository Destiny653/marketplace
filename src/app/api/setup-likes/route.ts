import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check if the product_likes table exists
    const { error: checkError } = await supabase
      .from('product_likes')
      .select('id')
      .limit(1)
      .maybeSingle()
    
    // If there's an error and it's not just that there are no results
    if (checkError && !checkError.message.includes('does not exist')) {
      throw new Error(`Error checking product_likes table: ${checkError.message}`)
    }
    
    // If the table doesn't exist, inform the user to run the migration
    if (checkError && checkError.message.includes('does not exist')) {
      return NextResponse.json({ 
        success: false, 
        message: 'Product likes table does not exist. Please run the product_likes.sql migration in your Supabase dashboard.' 
      }, { status: 404 })
    }
    
    // Check if the increment_product_likes function exists and has proper permissions
    try {
      const { error: funcError } = await supabase.rpc('increment_product_likes', { product_id: '00000000-0000-0000-0000-000000000000' })
      
      // If the error is about the function not existing or permission issues
      if (funcError && (funcError.message.includes('does not exist') || funcError.message.includes('permission denied'))) {
        return NextResponse.json({ 
          success: false, 
          message: 'Product likes functions exist but may have permission issues. Please run the product_likes.sql migration in your Supabase dashboard.' 
        }, { status: 403 })
      }
      
      // If the error is about the product not existing, that means the function works!
      if (funcError && funcError.message.includes('not found')) {
        return NextResponse.json({ 
          success: true, 
          message: 'Product likes system is properly set up and functioning' 
        })
      }
    } catch (funcCheckError) {
      console.error('Error checking product likes functions:', funcCheckError)
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product likes table exists' 
    })
  } catch (error) {
    console.error('Error in setup-likes route:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check product likes setup' },
      { status: 500 }
    )
  }
}