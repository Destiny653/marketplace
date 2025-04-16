'use client'

import { MapPin, Truck, CreditCard, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type CheckoutStep = 'information' | 'shipping' | 'payment' | 'review'

interface CheckoutStepsProps {
  currentStep: CheckoutStep
  userId: string
}

export function CheckoutSteps({ currentStep, userId }: CheckoutStepsProps) {
  const steps = [
    { id: 'information', label: 'Information', icon: MapPin },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'review', label: 'Review', icon: CheckCircle }
  ]

  const currentIndex = steps.findIndex(step => step.id === currentStep)

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center max-w-3xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center mb-1',
                index <= currentIndex ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400',
                index === currentIndex && 'ring-2 ring-blue-500'
              )}
            >
              <step.icon className="h-5 w-5" />
            </div>
            <span
              className={cn(
                'text-xs',
                index <= currentIndex ? 'text-blue-600' : 'text-gray-400'
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
      <div className="relative max-w-3xl mx-auto">
        <div className="absolute top-5 left-0 right-0 flex justify-between px-10">
          {steps.slice(0, -1).map((_, index) => (
            <div
              key={index}
              className={cn(
                'h-0.5 w-16',
                index < currentIndex ? 'bg-blue-500' : 'bg-gray-200'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}