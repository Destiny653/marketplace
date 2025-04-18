'use client'

import {
  CardElement,
  useStripe,
  useElements,
  PaymentElement,
  IbanElement,
  IdealBankElement,
} from '@stripe/react-stripe-js'
import { StripeError } from '@stripe/stripe-js'
import { FormEvent, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User } from '@supabase/supabase-js'

interface Address {
  fullName?: string
  addressLine1?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  phoneNumber?: string
}

interface Order {
  id: string
  total_amount: number
  status: string
  payment_status: string
  user_id: string
  billing_address?: Address
  shipping_address?: Address
}

interface StripePaymentFormProps {
  clientSecret: string
  onSuccess: () => void
  paymentMethodType: string
  orderId: string
}

// Define a custom error type that extends StripeError to include the element property
interface ElementsSubmitError extends StripeError {
  element?: {
    focus: () => void;
  };
}

export function StripePaymentForm({
  clientSecret,
  onSuccess,
  paymentMethodType,
  orderId
}: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [order, setOrder] = useState<Order | null>(null)
  const [paymentElementLoaded, setPaymentElementLoaded] = useState(false)
  const supabase = createClientComponentClient()

  // Validate orderId format
  const isValidUUID = (uuid: string) => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid)
  }

  useEffect(() => {
    if (!orderId || !isValidUUID(orderId)) {
      setError('Invalid order ID')
      return
    }

    const fetchData = async () => {
      try {
        // Get authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError
        if (!user) throw new Error('User not authenticated')
        setUser(user)

        // Get order details
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single()

        if (orderError) throw orderError
        if (!orderData) throw new Error('Order not found')

        setOrder(orderData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
        console.error('Data loading error:', err)
      }
    }

    fetchData()
  }, [supabase, orderId])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      setError('Payment system not ready')
      return
    }

    if (!user) {
      setError('User not authenticated')
      return
    }

    if (!order) {
      setError('Order data not loaded')
      return
    }

    setProcessing(true)
    setError(null)

    try {
      // First submit the elements to validate them
      const { error: submitError } = await elements.submit()
      if (submitError) {
        // Cast to our custom error type that includes the element property
        const elementError = submitError as ElementsSubmitError
        if (elementError.element) {
          elementError.element.focus()
        }
        throw submitError
      }

      // Prepare billing details
      const address = order.billing_address || order.shipping_address
      const baseBillingDetails = {
        name: address?.fullName || user.user_metadata?.full_name || user.user_metadata?.name || 'Customer',
        email: user.email || '',
        phone: address?.phoneNumber || '',
        address: {
          line1: address?.addressLine1 || 'Unknown',
          city: address?.city || 'Unknown',
          state: address?.state || '',
          postal_code: address?.postalCode || '',
          country: address?.country || 'US'
        }
      }

      let result

      // Handle different payment methods
      switch (paymentMethodType) {
        case 'card':
          result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: elements.getElement(CardElement)!,
              billing_details: baseBillingDetails
            }
          })
          break

        case 'apple_pay':
        case 'google_pay':
        case 'link':
          result = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
              return_url: `${window.location.origin}/checkout/success?order_id=${orderId}`,
              payment_method_data: {
                billing_details: baseBillingDetails
              }
            },
          })
          break

        case 'us_bank_account':
          result = await stripe.confirmUsBankAccountPayment(clientSecret, {
            payment_method: {
              us_bank_account: {
                account_number: '000123456789',
                routing_number: '110000000',
                account_holder_type: 'individual'
              },
              billing_details: baseBillingDetails
            },
          })
          break

        case 'sepa_debit':
          const ibanElement = elements.getElement(IbanElement)
          if (!ibanElement) throw new Error('IBAN element not found')

          result = await stripe.confirmSepaDebitPayment(clientSecret, {
            payment_method: {
              sepa_debit: ibanElement,
              billing_details: baseBillingDetails
            },
            return_url: `${window.location.origin}/checkout/success?order_id=${orderId}`,
          })
          break

        case 'ideal':
          const idealElement = elements.getElement(IdealBankElement)
          if (!idealElement) throw new Error('iDEAL element not found')

          result = await stripe.confirmIdealPayment(clientSecret, {
            payment_method: {
              ideal: idealElement,
            },
            return_url: `${window.location.origin}/checkout/success?order_id=${orderId}`,
          })
          break

        case 'paypal':
          result = await stripe.confirmPayPalPayment(clientSecret, {
            return_url: `${window.location.origin}/checkout/success?order_id=${orderId}`,
          })
          break

        case 'sofort':
          result = await stripe.confirmSofortPayment(clientSecret, {
            payment_method: {
              sofort: {
                country: address?.country || 'DE'
              },
              billing_details: baseBillingDetails
            },
            return_url: `${window.location.origin}/checkout/success?order_id=${orderId}`,
          })
          break

        case 'afterpay_clearpay':
          result = await stripe.confirmAfterpayClearpayPayment(clientSecret, {
            payment_method: {
              afterpay_clearpay: {
                // Add shipping details from order
              }
            },
            return_url: `${window.location.origin}/checkout/success?order_id=${orderId}`,
          })
          break

        case 'klarna':
          result = await stripe.confirmKlarnaPayment(clientSecret, {
            payment_method: {
              billing_details: baseBillingDetails
            },
            shipping: {
              name: order.shipping_address?.fullName || baseBillingDetails.name,
              address: {
                line1: order.shipping_address?.addressLine1 || 'Unknown',
                city: order.shipping_address?.city || 'Unknown',
                state: order.shipping_address?.state || '',
                postal_code: order.shipping_address?.postalCode || '',
                country: order.shipping_address?.country || 'US'
              }
            },
            return_url: `${window.location.origin}/checkout/success?order_id=${orderId}`,
          })
          break

        default:
          throw new Error('Unsupported payment method')
      }

      if (result?.error) {
        throw result.error
      }

      if (result?.paymentIntent?.status === 'succeeded') {
        // Update order status in database
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            payment_intent_id: result.paymentIntent.id,
            status: 'processing',
            updated_at: new Date().toISOString()
          })
          .eq('id', orderId)

        if (updateError) throw updateError

        onSuccess()
      }
    } catch (err) {
      const error = err as StripeError | Error
      setError(error.message || 'Payment processing failed')
      console.error('Payment error:', error)
    } finally {
      setProcessing(false)
    }
  }

  const renderPaymentElement = () => {
    if (!stripe || !elements) {
      return <div className="text-center py-8">Loading payment form...</div>
    }

    switch (paymentMethodType) {
      case 'card':
        return (
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': { color: '#aab7c4' }
                },
                invalid: { color: '#9e2146' }
              }
            }}
          />
        )
      case 'sepa_debit':
        return <IbanElement options={{ supportedCountries: ['SEPA'] }} />
      case 'ideal':
        return <IdealBankElement options={{}} />
      case 'us_bank_account':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Routing Number</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="110000000 (test value)"
                defaultValue="110000000"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Account Number</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="000123456789 (test value)"
                defaultValue="000123456789"
                required
              />
            </div>
          </div>
        )
      case 'apple_pay':
      case 'google_pay':
      case 'link':
        return (
          <PaymentElement
            options={{
              fields: {
                billingDetails: {
                  name: 'auto',
                  email: 'never',
                  phone: 'never'
                }
              }
            }}
            onReady={() => setPaymentElementLoaded(true)}
          />
        )
      case 'paypal':
        return (
          <div className="space-y-4">
            <PaymentElement
              options={{
                paymentMethodOrder: ['paypal'],
                fields: {
                  billingDetails: 'never'
                }
              }}
            />
            <p className="text-sm text-gray-500">
              You'll be redirected to PayPal to complete your payment
            </p>
          </div>
        )
      default:
        return <div>Selected payment method: {paymentMethodType}</div>
    }
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-4 bg-red-50 text-red-600 rounded-lg">
        <h3 className="font-medium text-lg mb-2">Error</h3>
        <p>{error}</p>
        {orderId && <p className="mt-2 text-sm">Order ID: {orderId}</p>}
        <button
          onClick={() => setError(null)}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!user || !order) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-2">Loading payment details...</p>
      </div>
    )
  }

  const isPaymentElementLoading = ['apple_pay', 'google_pay', 'link'].includes(paymentMethodType) && !paymentElementLoaded

  return (
    <div className="w-full mx-auto">
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-lg mb-2">Order Summary</h3>
        <p className="text-gray-700">Order ID: {order.id}</p>
        <p className="text-gray-700">Total: ${(order.total_amount / 100).toFixed(2)}</p>

        <div className="mt-4">
          <h4 className="font-medium">Shipping Address:</h4>
          <p className="text-gray-600">
            {order.shipping_address?.fullName}<br />
            {order.shipping_address?.addressLine1}<br />
            {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.postalCode}<br />
            {order.shipping_address?.country}
          </p>
        </div>

        {order.billing_address && (
          <div className="mt-2">
            <h4 className="font-medium">Billing Address:</h4>
            <p className="text-gray-600">
              {order.billing_address?.fullName}<br />
              {order.billing_address?.addressLine1}<br />
              {order.billing_address?.city}, {order.billing_address?.state} {order.billing_address?.postalCode}<br />
              {order.billing_address?.country}
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {renderPaymentElement()}

        <button
          type="submit"
          disabled={!stripe || processing || isPaymentElementLoading}
          className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors
            ${!stripe || processing || isPaymentElementLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {processing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Payment...
            </span>
          ) : (
            `Pay $${(order.total_amount / 100).toFixed(2)}`
          )}
        </button>
      </form>
    </div>
  )
}