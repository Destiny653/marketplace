'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/hooks/useAuth'
import { useCart, CartItem } from '@/hooks/useCart'
import FloatingCartButton from '@/components/cart/FloatingCartButton'
import { toast } from 'sonner'

interface CartAccessProviderProps {
  children: React.ReactNode
}

interface DatabaseCart {
  items: CartItem[]
}

export default function CartAccessProvider({ children }: CartAccessProviderProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const cart = useCart()
  const supabase = createClientComponentClient()
  const initialSyncDone = useRef(false)
  
  // Don't show floating cart on cart or checkout pages
  const hideFloatingCart = ['/cart', '/checkout'].some(path => pathname?.startsWith(path))
  
  // Update cart user ID when auth state changes
  useEffect(() => {
    if (user?.id !== cart.userId) {
      cart.setUserId(user?.id ?? null)
    }
  }, [user?.id, cart.userId])

  // Initial sync with database
  useEffect(() => {
    const syncCart = async () => {
      if (!user?.id || initialSyncDone.current) return

      try {
        // Get cart from database
        const { data: cartData, error } = await supabase
          .from('carts')
          .select('items')
          .eq('user_id', user.id)
          .single()

        if (error) {
          if (error.code !== 'PGRST116') { // PGRST116 is "not found"
            throw error
          }
          return // No cart found, that's okay
        }

        const dbCart = cartData as DatabaseCart
        if (dbCart?.items?.length) {
          cart.mergeWithServerCart(dbCart.items)
        }
      } catch (err) {
        console.error('Error syncing cart:', err)
        toast.error('Failed to sync your cart')
      } finally {
        initialSyncDone.current = true
      }
    }

    syncCart()
  }, [user?.id])

  // Sync local cart changes to database
  useEffect(() => {
    const syncToDatabase = async () => {
      if (!user?.id || !initialSyncDone.current) return

      try {
        await supabase
          .from('carts')
          .upsert({
            user_id: user.id,
            items: cart.items,
            updated_at: new Date().toISOString()
          })
      } catch (err) {
        console.error('Error syncing cart to database:', err)
        toast.error('Failed to save cart changes')
      }
    }

    const timeoutId = setTimeout(syncToDatabase, 1000) // Debounce updates
    return () => clearTimeout(timeoutId)
  }, [cart.items, user?.id])
  
  return (
    <>
      {children}
      {!hideFloatingCart && <FloatingCartButton />}
    </>
  )
}