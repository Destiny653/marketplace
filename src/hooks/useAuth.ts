'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { User, Session } from '@supabase/auth-helpers-nextjs'

type AuthError = {
  message: string
  status?: number
}

type AuthReturnType = {
  user: User | null
  loading: boolean
  error: AuthError | null
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  refreshSession: () => Promise<{ error: AuthError | null }>
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
}

interface AuthSession {
  session: Session | null
}

interface AuthSubscription {
  subscription: {
    unsubscribe: () => void
  }
}

interface AuthResponse {
  data: AuthSession
  error: AuthError | null
}

interface AuthStateChangeResponse {
  data: AuthSubscription
}

interface SignInCredentials {
  email: string
  password: string
}

interface SignUpOptions extends SignInCredentials {
  options: {
    emailRedirectTo: string
  }
}

export function useAuth(): AuthReturnType {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<AuthError | null>(null)
  const supabase = createClientComponentClient()

  const getSession = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      const { data: { session }, error }: AuthResponse = await supabase.auth.getSession()
      
      if (error) {
        // Handle token errors specifically
        if (error.message.includes('token') || error.message.includes('JWT')) {
          console.warn('Invalid token detected, signing out')
          await supabase.auth.signOut()
          setUser(null)
          throw new Error('Your session has expired. Please sign in again.')
        }
        throw error
      }
      
      setUser(session?.user ?? null)
      console.log("Authentication: Session loaded", session ? "User authenticated" : "No active session")
    } catch (err) {
      console.error("Authentication error:", err)
      setError(err as AuthError)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  // Function to refresh the session
  const refreshSession = useCallback(async (): Promise<{ error: AuthError | null }> => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.refreshSession()
      
      if (error) {
        throw error
      }
      
      // Reload the session to get the updated user
      await getSession()
      return { error: null }
    } catch (err) {
      const authError = err as AuthError
      setError(authError)
      return { error: authError }
    } finally {
      setLoading(false)
    }
  }, [supabase, getSession])
  const checkAuth = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      // First try to get the user directly
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (!userError && user) {
        setUser(user)
        return
      }
      
      // Fallback to session if getUser fails
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) throw error
      setUser(session?.user ?? null)
    } catch (err) {
      console.error("Authentication error:", err)
      setError(err as AuthError)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`Auth state changed: ${event}`)
        setUser(session?.user ?? null)
        await checkAuth()
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase, checkAuth])

  const signIn = useCallback(async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({ email, password } as SignInCredentials)
      
      if (!error) {
        await getSession()
      }
      
      return { error }
    } catch (err) {
      const authError = err as AuthError
      setError(authError)
      return { error: authError }
    } finally {
      setLoading(false)
    }
  }, [supabase, getSession])

  const signUp = useCallback(async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`
        }
      } as SignUpOptions)
      return { error }
    } catch (err) {
      const authError = err as AuthError
      setError(authError)
      return { error: authError }
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const signOut = useCallback(async (): Promise<{ error: AuthError | null }> => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      
      if (!error) {
        // Clear the user immediately on successful sign out
        setUser(null)
      }
      
      return { error }
    } catch (err) {
      const authError = err as AuthError
      setError(authError)
      return { error: authError }
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const signInWithGoogle = useCallback(async (): Promise<{ error: AuthError | null }> => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      })
      
      if (error) throw error
      return { error: null }
    } catch (err) {
      const authError = err as AuthError
      setError(authError)
      return { error: authError }
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const resetPassword = useCallback(async (email: string): Promise<{ error: AuthError | null }> => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      
      if (error) {
        throw error
      }
      
      return { error: null }
    } catch (err) {
      const authError = err as AuthError
      setError(authError)
      return { error: authError }
    } finally {
      setLoading(false)
    }
  }, [supabase])

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    refreshSession,
    signInWithGoogle,
    resetPassword
  } satisfies AuthReturnType
}