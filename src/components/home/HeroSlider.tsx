'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Using high-quality watch images that match the reference design
const slides = [
  {
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1920&auto=format&fit=crop',
    title: 'HUGE DISCOUNT',
    subtitle: 'OFFER',
    description: 'UPTO 70% OFF!',
    buttonText: 'DISCOVER SHOP',
    buttonLink: '/products?on_sale=true',
    position: 'left',
  },
  {
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1920&auto=format&fit=crop',
    title: 'PREMIUM WATCHES',
    subtitle: 'COLLECTION',
    description: 'UPTO 40% OFF!',
    buttonText: 'SHOP NOW',
    buttonLink: '/categories/watch',
    position: 'left',
  },
  {
    image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=1920&auto=format&fit=crop',
    title: 'NEW ARRIVALS',
    subtitle: 'LUXURY WATCHES',
    description: 'SPECIAL OFFERS',
    buttonText: 'EXPLORE NOW',
    buttonLink: '/products?collection=new',
    position: 'left',
  }
]

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Auto-advance slides
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAnimating) {
        goToNextSlide()
      }
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [currentSlide, isAnimating])

  const goToPrevSlide = () => {
    if (isAnimating) return
    
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
    
    setTimeout(() => {
      setIsAnimating(false)
    }, 500)
  }

  const goToNextSlide = () => {
    if (isAnimating) return
    
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    
    setTimeout(() => {
      setIsAnimating(false)
    }, 500)
  }

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden bg-black">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="relative h-full w-full">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover opacity-90"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent">
              <div className="container mx-auto px-6 h-full flex items-center">
                <div className="max-w-lg">
                  <div className="animate-fade-in-up">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
                      {slide.title}
                    </h1>
                    <h2 className="text-6xl md:text-7xl font-bold text-red-500 mb-2">
                      {slide.subtitle}
                    </h2>
                    <p className="text-white text-3xl md:text-4xl font-bold mb-8">
                      {slide.description}
                    </p>
                    <Link 
                      href={slide.buttonLink}
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-medium"
                    >
                      {slide.buttonText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation Arrows */}
      <button 
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      
      <button 
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>
      
      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              currentSlide === index ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}