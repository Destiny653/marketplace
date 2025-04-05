import { type NextRouter } from 'next/navigation'

/**
 * Redirects the user after login
 * @param router Next.js router
 * @param searchParams URL search parameters that may contain a redirectTo parameter
 * @param defaultPath Default path to redirect to if no redirectTo is specified
 */
export function handleAuthRedirect(
  router: NextRouter,
  searchParams: URLSearchParams,
  defaultPath: string = '/'
): void {
  const redirectTo = searchParams.get('redirectTo')
  
  if (redirectTo) {
    // Validate the redirectTo URL to prevent open redirect vulnerabilities
    // Only allow redirects to relative paths within the same origin
    if (redirectTo.startsWith('/') && !redirectTo.includes('//')) {
      router.push(redirectTo)
      return
    }
  }
  
  // Default redirect if no valid redirectTo parameter
  router.push(defaultPath)
}