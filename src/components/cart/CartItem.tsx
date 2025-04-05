import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, X } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils/helpers'
import type { Product } from '@/lib/supabase/types'

interface CartItemProps {
  item: Product & { quantity: number }
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (item.stock_quantity || 10)) {
      updateQuantity(item.id, newQuantity)
    }
  }

  return (
    <div className="flex items-center py-6 border-b">
      <div className="flex-shrink-0 w-24 h-24 relative">
        <Image
          src={item.image_url}
          alt={item.name}
          fill
          className="object-cover rounded-md"
        />
      </div>

      <div className="ml-4 flex-1">
        <div className="flex justify-between">
          <div>
            <Link
              href={`/products/${item.id}`}
              className="text-lg font-medium text-gray-900 hover:text-blue-600"
            >
              {item.name}
            </Link>
            <p className="mt-1 text-sm text-gray-500">
              {item.is_on_sale && item.sale_price
                ? formatPrice(item.sale_price)
                : formatPrice(item.price)}
            </p>
          </div>
          <button
            onClick={() => removeItem(item.id)}
            className="text-gray-400 hover:text-red-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex items-center">
          <div className="flex items-center border rounded-md">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="p-2 hover:bg-gray-50"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-4 py-2 text-center min-w-[40px]">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="p-2 hover:bg-gray-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="ml-auto font-medium">
            {formatPrice(
              (item.is_on_sale && item.sale_price
                ? item.sale_price
                : item.price) * item.quantity
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
