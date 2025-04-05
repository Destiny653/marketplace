import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// For client components
export const createClient = () => {
  return createClientComponentClient()
}

// For server components
export const createServerClient = () => {
  return createServerComponentClient({ cookies })
}
