'use client'

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { useProductLikes } from '@/hooks/useProductLikes'
import { AuthModal } from '@/components/auth/AuthModal'

interface AuthContextType {
  showAuthModal: (action: 'like' | 'cart' | 'checkout') => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user } = useAuth()
  const { setUserId } = useCart()
  const { refreshLikes } = useProductLikes()

  // Keep cart and likes in sync with auth state
  useEffect(() => {
    if (user) {
      setUserId(user.id)
      refreshLikes()
    } else {
      setUserId(null)
    }
  }, [user, setUserId, refreshLikes])

  const [showModal, setShowModal] = useState(false)
  const [pendingAction, setPendingAction] = useState<'like' | 'cart' | 'checkout' | null>(null)

  const showAuthModal = useCallback((action: 'like' | 'cart' | 'checkout') => {
    if (!user) {
      setPendingAction(action)
      setShowModal(true)
    }
  }, [user])

  const handleAuthSuccess = useCallback(() => {
    setShowModal(false)
    // Handle the pending action after successful auth
    if (pendingAction) {
      // The action will be handled by the component that triggered it
      // since the auth state will have changed
      setPendingAction(null)
    }
  }, [pendingAction])

  return (
    <AuthContext.Provider value={{ showAuthModal }}>
      {children}
      <AuthModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        onSuccess={handleAuthSuccess}
        action={pendingAction}
      />
    </AuthContext.Provider>
  )
}
