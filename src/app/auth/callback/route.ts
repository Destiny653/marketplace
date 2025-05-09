// app/auth/callback/route.ts
import { createClient } from '@/lib/utils/supabase/client'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const error = searchParams.get('error')
  
  // Get the correct base URL for redirects
  const baseUrl = process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_SITE_URL || 'https://marketplace-five-gold.vercel.app'
    : new URL(request.url).origin

  // If there's an error in the OAuth flow
  if (error) {
    return NextResponse.redirect(`${baseUrl}/auth/auth-code-error?error=${error}`)
  }

  // If we have a code, exchange it for a session
  if (code) {
    const supabase = createClient()
    const { error: authError } = await supabase.auth.exchangeCodeForSession(code)

    if (!authError) {
      // Successful authentication
      return NextResponse.redirect(`${baseUrl}${next}`)
    } else {
      // Failed to exchange code
      return NextResponse.redirect(
        `${baseUrl}/auth/auth-code-error?error=${encodeURIComponent(authError.message)}`
      )
    }
  }

  // No code and no error - malformed request
  return NextResponse.redirect(`${baseUrl}/auth/auth-code-error?error=invalid_request`)
}