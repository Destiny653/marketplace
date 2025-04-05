'use client'

import { useState } from 'react'
import { useProductLikes } from '@/hooks/useProductLikes'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface LikeButtonProps {
  productId: string
  productName?: string
  className?: string
}

export default function LikeButton({ productId, productName, className = '' }: LikeButtonProps) {
  const { user } = useAuth()
  const { isLiked, toggleLike } = useProductLikes()
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  
  const liked = isLiked(productId)

  const handleLikeToggle = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      toast.error('Please sign in to like products')
      router.push(`/login?redirectTo=${encodeURIComponent(window.location.pathname)}`)
      return
    }
    
    setIsProcessing(true)
    try {
      await toggleLike(productId, productName)
    } catch (error) {
      console.error('Error in like button:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Button
      onClick={handleLikeToggle}
      disabled={isProcessing}
      variant={liked ? "default" : "outline"}
      className={`flex items-center gap-2 ${className}`}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
      {liked ? 'Liked' : 'Like'}
    </Button>
  )
}