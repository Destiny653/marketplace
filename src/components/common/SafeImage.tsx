'use client'

import Image from 'next/image'
import { ImageProps } from 'next/image'

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src: string | null | undefined;
  fallbackSrc?: string;
}

export default function SafeImage({ 
  src, 
  fallbackSrc = '/images/product-placeholder.jpg',
  alt = 'Image', 
  ...props 
}: SafeImageProps) {
  const isValidImageUrl = (url: string | null | undefined): boolean => {
    if (!url) return false
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }

  const imageUrl = isValidImageUrl(src) ? src : fallbackSrc

  return <Image src={imageUrl} alt={alt} {...props} />
}