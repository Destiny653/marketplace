 'use client'

import { 
  CardElement, 
  useStripe, 
  useElements,
  PaymentElement,
  IbanElement,
  IdealBankElement,
  AuBankAccountElement
} from '@stripe/react-stripe-js'
import { FormEvent, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface StripePaymentFormProps {
  clientSecret: string
  onSuccess: () => void
  paymentMethodType: string
  orderId: string
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
  const [user, setUser] = useState<any>(null)
  const [order, setOrder] = useState<any>(null)
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
      let result
      
      // Use billing address if available, otherwise fallback to shipping address
      const address = order.billing_address || order.shipping_address
      
      const baseBillingDetails = {
        name: address?.fullName || user.user_metadata?.full_name || user.user_metadata?.name || 'Customer',
        email: user.email,
        phone: address?.phoneNumber || '',
        address: {
          line1: address?.addressLine1 || 'Unknown',
          city: address?.city || 'Unknown',
          state: address?.state || '',
          postal_code: address?.postalCode || '',
          country: address?.country || 'US'
        }
      }

      switch(paymentMethodType) {
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
            }
          })
          break

        case 'sepa_debit':
          const ibanElement = elements.getElement(IbanElement)
          if (!ibanElement) throw new Error('IBAN element not found')
          
          result = await stripe.confirmSepaDebitPayment(clientSecret, {
            payment_method: {
              sepa_debit: ibanElement,
              billing_details: baseBillingDetails
            }
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
        throw new Error(result.error.message || 'Payment failed')
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
      setError(err instanceof Error ? err.message : 'Payment processing failed')
      console.error('Payment error:', err)
    } finally {
      setProcessing(false)
    }
  }

  const renderPaymentElement = () => {
    if (!stripe || !elements) {
      return <div className="text-center py-8">Loading payment form...</div>
    }

    switch(paymentMethodType) {
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
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Account Number</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded" 
                placeholder="000123456789 (test value)"
                defaultValue="000123456789"
              />
            </div>
          </div>
        )
      case 'apple_pay':
      case 'google_pay':
      case 'link':
        return <PaymentElement 
          options={{
            fields: {
              billingDetails: {
                name: 'never',
                email: 'never',
                phone: 'never'
              }
            }
          }} 
        />
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
      </div>
    )
  }

  if (!user || !order) {
    return <div className="text-center py-8">Loading payment details...</div>
  }

  return (
    <div className="max-w-md mx-auto">
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
          disabled={!stripe || processing}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {processing ? 'Processing Payment...' : `Pay $${(order.total_amount / 100).toFixed(2)}`}
        </button>
      </form>
    </div>
  )
}