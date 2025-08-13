 'use client'

import { useEffect, useState } from 'react'
import { useCart } from '@/hooks/useCart' 
import { useRouter } from 'next/navigation'
import { CheckCircle, ChevronRight, CreditCard, MapPin, Truck, User, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { processCheckout, ShippingAddress } from '@/lib/services/checkout'
// import { paymentMethods } from '@/lib/constants/payment-methods' 
import { PaymentMethods } from '@/components/checkout/payment-methods'

// Define checkout steps
const CHECKOUT_STEPS = {
  INFORMATION: 'information',
  SHIPPING: 'shipping',
  PAYMENT: 'payment',
  REVIEW: 'review'
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart } = useCart()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(CHECKOUT_STEPS.INFORMATION)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    state: '',
    phoneNumber: '',
    shippingMethod: 'standard',
    paymentMethod: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: ''
  })

  // Calculate total price of items
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const shippingCost =
    formData.shippingMethod === 'express' ? 12.99 :
    formData.shippingMethod === 'overnight' ? 24.99 :
    5.99
  const tax = subtotal * 0.07
  const totalPrice = subtotal + shippingCost + tax

  // Redirect to cart if no items
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items, router])
  
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl text-center">
        <p>Your cart is empty. Redirecting to cart...</p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (currentStep !== CHECKOUT_STEPS.REVIEW) {
      // Move to next step
      switch (currentStep) {
        case CHECKOUT_STEPS.INFORMATION:
          setCurrentStep(CHECKOUT_STEPS.SHIPPING)
          break
        case CHECKOUT_STEPS.SHIPPING:
          setCurrentStep(CHECKOUT_STEPS.PAYMENT)
          break
        case CHECKOUT_STEPS.PAYMENT:
          setCurrentStep(CHECKOUT_STEPS.REVIEW)
          break
      }
      window.scrollTo(0, 0)
      return
    }
    
    // Check if user is logged in
    if (!user) {
      setError('You must be logged in to complete your order')
      return
    }
    
    // Final submission
    setIsSubmitting(true)
    
    try {
      // Format address for API
      const shippingAddress: ShippingAddress = {
        fullName: `${formData.firstName} ${formData.lastName}`,
        addressLine1: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        phoneNumber: formData.phoneNumber
      }
      
      // Process checkout with the API
      const result = await processCheckout({
        items,
        shippingAddress,
        shippingMethod: formData.shippingMethod,
        paymentMethod: formData.paymentMethod,
      })
      console.log('Checkout result:', result)
      if (!result.success) {
        throw new Error(result.error || 'Failed to process order')
      }
      
      // Clear the cart after successful checkout
      // clearCart()
      
      // Redirect to payment page with order ID
      router.push(`/checkout/payment/${result.orderId}`) 
    } catch (error: any) {
      console.error('Checkout error:', error)
      setError(error.message || 'An error occurred during checkout')
      setIsSubmitting(false)
    }
  }

  const getStepLabel = () => {
    switch (currentStep) {
      case CHECKOUT_STEPS.INFORMATION: return 'Customer Information'
      case CHECKOUT_STEPS.SHIPPING: return 'Shipping Method'
      case CHECKOUT_STEPS.PAYMENT: return 'Payment Details'
      case CHECKOUT_STEPS.REVIEW: return 'Review Order'
      default: return 'Checkout'
    }
  }

  const getButtonLabel = () => {
    if (isSubmitting) return 'Processing...'
    
    switch (currentStep) {
      case CHECKOUT_STEPS.REVIEW: return 'Place Order'
      default: return 'Continue'
    }
  }

  const handlePaymentMethodSelect = (methodId: string) => {
    setFormData({ ...formData, paymentMethod: methodId })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-2 text-center">Checkout</h1>
      
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center max-w-3xl mx-auto">
          <div className={`flex flex-col items-center ${currentStep === CHECKOUT_STEPS.INFORMATION || currentStep === CHECKOUT_STEPS.SHIPPING || currentStep === CHECKOUT_STEPS.PAYMENT || currentStep === CHECKOUT_STEPS.REVIEW ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${currentStep === CHECKOUT_STEPS.INFORMATION || currentStep === CHECKOUT_STEPS.SHIPPING || currentStep === CHECKOUT_STEPS.PAYMENT || currentStep === CHECKOUT_STEPS.REVIEW ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <User size={20} />
            </div>
            <span className="text-xs">Information</span>
          </div>
          
          <div className="w-16 h-0.5 bg-gray-200"></div>
          
          <div className={`flex flex-col items-center ${currentStep === CHECKOUT_STEPS.SHIPPING || currentStep === CHECKOUT_STEPS.PAYMENT || currentStep === CHECKOUT_STEPS.REVIEW ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${currentStep === CHECKOUT_STEPS.SHIPPING || currentStep === CHECKOUT_STEPS.PAYMENT || currentStep === CHECKOUT_STEPS.REVIEW ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <Truck size={20} />
            </div>
            <span className="text-xs">Shipping</span>
          </div>
          
          <div className="w-16 h-0.5 bg-gray-200"></div>
          
          <div className={`flex flex-col items-center ${currentStep === CHECKOUT_STEPS.PAYMENT || currentStep === CHECKOUT_STEPS.REVIEW ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${currentStep === CHECKOUT_STEPS.PAYMENT || currentStep === CHECKOUT_STEPS.REVIEW ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <CreditCard size={20} />
            </div>
            <span className="text-xs">Payment</span>
          </div>
          
          <div className="w-16 h-0.5 bg-gray-200"></div>
          
          <div className={`flex flex-col items-center ${currentStep === CHECKOUT_STEPS.REVIEW ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${currentStep === CHECKOUT_STEPS.REVIEW ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <CheckCircle size={20} />
            </div>
            <span className="text-xs">Review</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">{getStepLabel()}</h2>
            
            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
            
            {/* Authentication check */}
            {!user && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-md">
                <p className="font-medium mb-2">You are not logged in</p>
                <p className="text-sm mb-3">Please log in to your account to complete your purchase.</p>
                <button 
                  type="button"
                  onClick={() => router.push('/login?redirect=/checkout')}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm"
                >
                  Log in to continue
                </button>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information Step */}
              {currentStep === CHECKOUT_STEPS.INFORMATION && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, phoneNumber: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State/Province
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.postalCode}
                        onChange={(e) =>
                          setFormData({ ...formData, postalCode: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <select
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.country}
                        onChange={(e) =>
                          setFormData({ ...formData, country: e.target.value })
                        }
                      >
                        <option value="">Select a country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="JP">Japan</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Shipping Step */}
              {currentStep === CHECKOUT_STEPS.SHIPPING && (
                <div className="space-y-4">
                  <div className="flex items-center p-4 border rounded-lg mb-3 cursor-pointer bg-blue-50 border-blue-500">
                    <input
                      type="radio"
                      name="shipping"
                      id="standard"
                      value="standard"
                      checked={formData.shippingMethod === 'standard'}
                      onChange={() => setFormData({ ...formData, shippingMethod: 'standard' })}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label htmlFor="standard" className="ml-3 flex flex-1 justify-between cursor-pointer">
                      <div>
                        <p className="font-medium">Standard Shipping</p>
                        <p className="text-sm text-gray-500">Delivery in 3-5 business days</p>
                      </div>
                      <span className="font-medium">$5.99</span>
                    </label>
                  </div>
                  
                  <div className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="shipping"
                      id="express"
                      value="express"
                      checked={formData.shippingMethod === 'express'}
                      onChange={() => setFormData({ ...formData, shippingMethod: 'express' })}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label htmlFor="express" className="ml-3 flex flex-1 justify-between cursor-pointer">
                      <div>
                        <p className="font-medium">Express Shipping</p>
                        <p className="text-sm text-gray-500">Delivery in 1-2 business days</p>
                      </div>
                      <span className="font-medium">$12.99</span>
                    </label>
                  </div>
                  
                  <div className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="shipping"
                      id="overnight"
                      value="overnight"
                      checked={formData.shippingMethod === 'overnight'}
                      onChange={() => setFormData({ ...formData, shippingMethod: 'overnight' })}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label htmlFor="overnight" className="ml-3 flex flex-1 justify-between cursor-pointer">
                      <div>
                        <p className="font-medium">Overnight Shipping</p>
                        <p className="text-sm text-gray-500">Next day delivery</p>
                      </div>
                      <span className="font-medium">$24.99</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Payment Step */}
              {currentStep === CHECKOUT_STEPS.PAYMENT && (
                <div className="space-y-6">
                  <PaymentMethods 
                    onSelect={handlePaymentMethodSelect} 
                  />
                  
                  {formData.paymentMethod === 'credit-card' && (
                    <div className="space-y-4 mt-6 p-4 border rounded-lg bg-gray-50">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.cardNumber}
                          onChange={(e) =>
                            setFormData({ ...formData, cardNumber: e.target.value })
                          }
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expiration Date
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="MM/YY"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.cardExpiry}
                            onChange={(e) =>
                              setFormData({ ...formData, cardExpiry: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CVC
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="123"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.cardCvc}
                            onChange={(e) =>
                              setFormData({ ...formData, cardCvc: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Review Step */}
              {currentStep === CHECKOUT_STEPS.REVIEW && (
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Customer Information</h3>
                      <button 
                        type="button" 
                        className="text-sm text-blue-600 hover:text-blue-800"
                        onClick={() => setCurrentStep(CHECKOUT_STEPS.INFORMATION)}
                      >
                        Edit
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>{formData.firstName} {formData.lastName}</p>
                      <p>{formData.email}</p>
                      <p>{formData.phoneNumber}</p>
                      <p>{formData.address}</p>
                      <p>{formData.city}, {formData.state} {formData.postalCode}</p>
                      <p>{formData.country}</p>
                    </div>
                  </div>
                  
                  <div className="border-b pb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Shipping Method</h3>
                      <button 
                        type="button" 
                        className="text-sm text-blue-600 hover:text-blue-800"
                        onClick={() => setCurrentStep(CHECKOUT_STEPS.SHIPPING)}
                      >
                        Edit
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      {formData.shippingMethod === 'standard' && (
                        <p>Standard Shipping (3-5 business days) - $5.99</p>
                      )}
                      {formData.shippingMethod === 'express' && (
                        <p>Express Shipping (1-2 business days) - $12.99</p>
                      )}
                      {formData.shippingMethod === 'overnight' && (
                        <p>Overnight Shipping (Next day delivery) - $24.99</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="border-b pb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Payment Method</h3>
                      <button 
                        type="button" 
                        className="text-sm text-blue-600 hover:text-blue-800"
                        onClick={() => setCurrentStep(CHECKOUT_STEPS.PAYMENT)}
                      >
                        Edit
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      {formData.paymentMethod === 'credit-card' && formData.cardNumber && (
                        <p>Credit Card ending in {formData.cardNumber.slice(-4)}</p>
                      )}
                      {formData.paymentMethod === 'credit-card' && !formData.cardNumber && (
                        <p>Credit Card</p>
                      )}
                      {formData.paymentMethod !== 'credit-card' && (
                        <p>{formData.paymentMethod}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Order Summary</h3>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center">
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                            {item.image && (
                              <div className="relative h-full w-full">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  sizes="64px"
                                  className="object-cover object-center"
                                />
                              </div>
                            )}
                          </div>
                          <div className="ml-4 flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-lg flex items-center justify-center text-white font-medium ${
                  isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {getButtonLabel()}
                {!isSubmitting && <ChevronRight size={18} className="ml-1" />}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            {/* Display cart items */}
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.quantity} × {item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Shipping</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 border-t pt-4">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin size={16} className="mr-2" />
                <span>Free returns within 30 days</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Truck size={16} className="mr-2" />
                <span>Free shipping on orders over $75</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}