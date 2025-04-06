'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

function ProtectedRouteContent({ 
  children, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    // Only take action once loading is complete
    if (!loading) {
      if (!user) {
        // Get the current path to redirect back after login
        const currentPath = window.location.pathname
        const redirectPath = `${redirectTo}?redirectTo=${encodeURIComponent(currentPath)}`
        
        toast.error('Please sign in to access this page')
        router.push(redirectPath)
      } else {
        setIsAuthorized(true)
      }
    }
  }, [user, loading, router, redirectTo])

  if (loading || isAuthorized === null) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}

export default function ProtectedRoute(props: ProtectedRouteProps) {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <ProtectedRouteContent {...props} />
    </Suspense>
  )
}