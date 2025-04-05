'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import LikedProducts from '@/components/account/LikedProducts'
import Link from 'next/link'

export default function AccountPage() {
  const { user, loading, signOut } = useAuth()
  const [userDetails, setUserDetails] = useState({
    email: '',
    name: '',
    avatar_url: '',
    provider: ''
  })
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }

    if (user) {
      setUserDetails({
        email: user.email || '',
        name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        avatar_url: user.user_metadata?.avatar_url || '',
        provider: user.app_metadata?.provider || 'email'
      })
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      const { error } = await signOut()
      if (error) throw error
      
      // Force a page refresh after sign out to clear any cached state
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
      alert('Failed to sign out. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-gray-200 mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header with user info */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8 md:py-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white p-1 shadow-lg flex-shrink-0">
                {userDetails.avatar_url ? (
                  <img 
                    src={userDetails.avatar_url} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
                    {userDetails?.name ? userDetails?.name[0].toUpperCase() : userDetails?.email[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {userDetails.name || 'Welcome'}
                </h1>
                <p className="text-blue-100 mt-1">{userDetails?.email}</p>
                <div className="mt-3 inline-block bg-blue-800 bg-opacity-30 px-3 py-1 rounded-full text-sm text-white">
                  Signed in with <span className="font-semibold capitalize">{userDetails?.provider}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              {/* Account actions */}
              <div className="w-full md:w-64 flex-shrink-0">
                <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
                  <div className="space-y-4">
                    <Button 
                      onClick={handleSignOut} 
                      disabled={isLoading}
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                    >
                      {isLoading ? 'Signing out...' : 'Sign Out'}
                    </Button>
                    
                    <Link href="/wishlist" className="block">
                      <Button variant="outline" className="w-full">
                        My Wishlist
                      </Button>
                    </Link>
                    
                    <Link href="/products" className="block">
                      <Button variant="outline" className="w-full">
                        Browse Products
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Liked products */}
              <div className="w-full flex-1">
                <h2 className="text-2xl font-semibold mb-6">My Liked Products</h2>
                <LikedProducts />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}