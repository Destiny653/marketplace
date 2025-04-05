'use server'

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check if the wishlists table already exists
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'wishlists')
    
    if (tablesError) {
      throw tablesError
    }
    
    // If the table doesn't exist, create it
    if (!tables || tables.length === 0) {
      // Create the wishlists table
      const { error: createTableError } = await supabase.rpc('create_wishlists_table')
      
      if (createTableError) {
        throw createTableError
      }
    }
    
    return NextResponse.json({ success: true, message: 'Wishlists table is ready' })
  } catch (error) {
    console.error('Error setting up wishlists table:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to set up wishlists table' },
      { status: 500 }
    )
  }
}