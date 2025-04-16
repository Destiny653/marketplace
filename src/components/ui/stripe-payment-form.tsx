import { CardElement, useStripe, useElements,PaymentElement,IbanElement,IdealBankElement,AuBankAccountElement} from '@stripe/react-stripe-js'
import { FormEvent, useState } from 'react'

interface StripePaymentFormProps {
  clientSecret: string
  onSuccess: () => void
  paymentMethodType: string
}

export function StripePaymentForm({
  clientSecret,
  onSuccess,
  paymentMethodType
}: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)
    setError(null)

    try {
      let result
      
      switch(paymentMethodType) {
        case 'card':
          result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: elements.getElement(CardElement)!,
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
              return_url: `${window.location.origin}/checkout/success`,
            },
          })
          break

        case 'us_bank_account':
          const auBankAccountElement = elements.getElement(AuBankAccountElement)
          if (!auBankAccountElement) {
            throw new Error('Bank account element not found')
          }
          result = await stripe.confirmUsBankAccountPayment(clientSecret, {
            payment_method: {
              us_bank_account: {
                account_number: '000123456789', // Collect from form
                routing_number: '110000000',    // Collect from form
                account_holder_type: 'individual', // or 'company'
              },
              billing_details: {
                name: 'Customer Name',    // Collect from form
                email: 'customer@example.com' // Collect from form
              }
            }
          });
          break;

        case 'sepa_debit':
          const ibanElement = elements.getElement(IbanElement)
          if (!ibanElement) {
            throw new Error('IBAN element not found')
          }
          result = await stripe.confirmSepaDebitPayment(clientSecret, {
            payment_method: {
              sepa_debit: ibanElement,
              billing_details: {
                name: 'Customer Name', // Collect from form
                email: 'customer@example.com' // Collect from form
              }
            }
          })
          break

        case 'ideal':
          const idealElement = elements.getElement(IdealBankElement)
          if (!idealElement) {
            throw new Error('iDEAL element not found')
          }
          result = await stripe.confirmIdealPayment(clientSecret, {
            payment_method: {
              ideal: idealElement,
            },
            return_url: `${window.location.origin}/checkout/success`,
          })
          break

        case 'paypal':
          result = await stripe.confirmPayPalPayment(clientSecret, {
            return_url: `${window.location.origin}/checkout/success`,
          })
          break

        case 'sofort':
          result = await stripe.confirmSofortPayment(clientSecret, {
            payment_method: {
              sofort: {
                country: 'DE' // Set appropriate country
              },
              billing_details: {
                name: 'Customer Name' // Collect from form
              }
            },
            return_url: `${window.location.origin}/checkout/success`,
          })
          break

        case 'afterpay_clearpay':
          result = await stripe.confirmAfterpayClearpayPayment(clientSecret, {
            payment_method: {
              afterpay_clearpay: {
                // Collect shipping details from form
              }
            },
            return_url: `${window.location.origin}/checkout/success`,
          })
          break

          case 'klarna':
            result = await stripe.confirmKlarnaPayment(clientSecret, {
              payment_method: {
                billing_details: {
                  email: 'customer@example.com', // Collect from form
                  address: {
                    line1: '123 Main St',       // Collect from form
                    city: 'San Francisco',      // Collect from form
                    postal_code: '94111',       // Collect from form
                    country: 'US'               // Collect from form
                  }
                }
              },
              return_url: `${window.location.origin}/checkout/success`,
              shipping: {
                name: 'Customer Name',          // Collect from form
                address: {
                  line1: '123 Main St',         // Collect from form (same as billing or different)
                  city: 'San Francisco',
                  postal_code: '94111',
                  country: 'US'
                }
              }
            });
            break;
        default:
          throw new Error('Unsupported payment method')
      }

      if (result.error) {
        setError(result.error.message || 'Payment failed')
        return
      }

      if (result.paymentIntent?.status === 'succeeded') {
        onSuccess()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  const renderPaymentElement = () => {
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
        return <AuBankAccountElement options={{}} />
      case 'apple_pay':
      case 'google_pay':
      case 'link':
        return <PaymentElement options={{}} />
      default:
        return <div>Selected payment method: {paymentMethodType}</div>
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {renderPaymentElement()}
      
      {error && <div className="text-red-500 text-sm">{error}</div>}
      
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  )
}