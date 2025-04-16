'use client'

import { X, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button' 
import Image from 'next/image'
import { useCart } from '@/hooks/useCart'
import type { CartItem as CartItemType } from '@/types/cartItem'

export function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className="flex items-center gap-4 border-b py-4">
      <div className="relative h-16 w-16 rounded-md overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="font-medium">{item.name}</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeItem(item.id)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {item.variant && (
          <p className="text-sm text-muted-foreground">
            Variant: {item.variant.name}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= item.stock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-right">
            {item.original_price && item.original_price > item.price ? (
              <>
                <span className="line-through text-muted-foreground mr-2">
                  ${item.original_price.toFixed(2)}
                </span>
                <span className="font-medium text-red-600">
                  ${item.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="font-medium">
                ${item.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}