import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const getSupabaseConfig = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marketplave-five-gold.vercel.app'

  if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error(
        `Supabase environment variables not configured!\n
        NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl}\n
        NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey?.slice(0, 5)}...`
      )
    }
    console.error('Supabase client initialization failed - missing env vars')
    return null
  }

  return { supabaseUrl, supabaseAnonKey, siteUrl }
}

let client: ReturnType<typeof createClient<Database>> | null = null

export const getSupabaseClient = () => {
  if (client) return client

  const config = getSupabaseConfig()
  if (!config) return null

  client = createClient<Database>(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  })

  return client
}

export const supabase = getSupabaseClient() 