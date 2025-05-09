import { createClient } from '@/lib/utils/supabase/client'
import { NextResponse } from 'next/server'

function getBaseUrl(request: Request) {
  if (process.env.NODE_ENV === 'development') {
    return new URL(request.url).origin
  }
  
  // Use configured site URL in production
  const productionUrl = process.env.NEXT_PUBLIC_SITE_URL
  
  // Fallback to Vercel's provided URL if needed
  const vercelUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : null
    
  return productionUrl || vercelUrl || new URL(request.url).origin
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const baseUrl = getBaseUrl(request)

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${baseUrl}${next}`)
    }
  }

  return NextResponse.redirect(`${baseUrl}/auth/auth-code-error`)
}