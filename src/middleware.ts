import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected and public routes
const protectedRoutes = [
  // '/checkout',
  '/wishlist',
  // '/account',
  // Add other protected routes here
]

const publicRoutes = [
  '/login',
  '/signup',
  '/forgot-password',
  // Add other public routes here
]

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  // Get session and user data in a single call
  const { 
    data: { session }, 
    error
  } = await supabase.auth.getSession()

  // Handle any auth errors
  if (error) {
    console.error('Auth error in middleware:', error)
    // Optionally redirect to error page or handle differently
  }

  // Check route protection status
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname)

  // Redirect logic for protected routes
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect logged-in users away from public auth pages
  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL('/', req.url))
  }
 
  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - svg files
     * - public routes (optional, if you want to exclude them)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg|login|signup|forgot-password).*)',
  ],
}