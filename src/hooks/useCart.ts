'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  stock: number
}

interface CartStore {
  items: CartItem[]
  userId: string | null
  setUserId: (userId: string | null) => void
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  mergeWithServerCart: (serverItems: CartItem[]) => void
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => {
      const supabase = createClientComponentClient()

      const syncCartWithSupabase = async (userId: string, items: CartItem[]) => {
        try {
          const { error } = await supabase
            .from('carts')
            .upsert([
              {
                user_id: userId,
                items: items
              }
            ], {
              onConflict: 'user_id'
            })

          if (error) {
            console.error('Error syncing cart:', error)
            throw error
          }
        } catch (error: any) {
          console.error('Error syncing cart:', error)
          toast.error('Failed to sync cart: ' + (error.message || 'Unknown error'))
        }
      }

      return {
        items: [],
        userId: null,
        setUserId: (userId: string | null) => set({ userId }),
        addItem: (item) =>
          set((state) => {
            if (item.quantity > item.stock) {
              toast.error('Not enough stock to add item to cart')
              return state
            }

            const existingItem = state.items.find((i) => i.id === item.id)
            const newState = existingItem
              ? {
                  items: state.items.map((i) =>
                    i.id === item.id
                      ? { ...i, quantity: i.quantity + item.quantity }
                      : i
                  ),
                }
              : { items: [...state.items, item] }

            if (state.userId) {
              syncCartWithSupabase(state.userId, newState.items)
            }

            return newState
          }),

        removeItem: (id) =>
          set((state) => {
            const newState = {
              items: state.items.filter((i) => i.id !== id),
            }

            if (state.userId) {
              syncCartWithSupabase(state.userId, newState.items)
            }

            return newState
          }),

        updateQuantity: (id, quantity) =>
          set((state) => {
            const item = state.items.find((i) => i.id === id)
            if (item && quantity > item.stock) {
              toast.error('Not enough stock to update quantity')
              return state
            }

            const newState = {
              items: state.items.map((i) =>
                i.id === id ? { ...i, quantity } : i
              ),
            }

            if (state.userId) {
              syncCartWithSupabase(state.userId, newState.items)
            }

            return newState
          }),

        clearCart: () =>
          set((state) => {
            const newState = { items: [] }
            if (state.userId) {
              syncCartWithSupabase(state.userId, [])
            }
            return newState
          }),

        mergeWithServerCart: (serverItems) =>
          set((state) => {
            // Create a map of existing items for faster lookup
            const existingItems = new Map(state.items.map(item => [item.id, item]))
            
            // Merge server items with local items
            const mergedItems = serverItems.map(serverItem => {
              const localItem = existingItems.get(serverItem.id)
              if (localItem) {
                // If item exists locally, use the higher quantity
                return {
                  ...serverItem,
                  quantity: Math.max(localItem.quantity, serverItem.quantity)
                }
              }
              return serverItem
            })

            // Add any local items that weren't in the server cart
            state.items.forEach(localItem => {
              if (!serverItems.some(serverItem => serverItem.id === localItem.id)) {
                mergedItems.push(localItem)
              }
            })

            // Sync the merged cart back to the server if we have a user
            if (state.userId) {
              syncCartWithSupabase(state.userId, mergedItems)
            }

            return { items: mergedItems }
          }),
      }
    },
    {
      name: 'cart-storage-v1',
    }
  )
)
