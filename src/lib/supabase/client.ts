import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

// This function creates a Supabase client only when it's actually needed
// This prevents errors during build time when environment variables might not be available
const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    // During build time, return a mock client that won't be used
    if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
      console.warn('Supabase environment variables not available during build');
      return null;
    }
    throw new Error('Supabase environment variables are missing');
  }
  
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
};

// Export a lazy-loaded client that's only created when actually used
// This prevents errors during static site generation
export const supabase = typeof window === 'undefined' 
  ? (process.env.NODE_ENV === 'production' ? null : createSupabaseClient())
  : createSupabaseClient();
