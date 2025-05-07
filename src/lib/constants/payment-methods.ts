import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from '../payment-methods'

// Create a structured array of payment methods for the UI
export const paymentMethods = [
  {
    id: 'card',
    name: PAYMENT_METHOD_LABELS.stripe_card,
    description: 'Visa, Mastercard, American Express, and more',
    type: PAYMENT_METHODS.STRIPE.CARD
  },
  // {
  //   id: 'apple_pay',
  //   name: PAYMENT_METHOD_LABELS.stripe_apple_pay,
  //   description: 'Fast and secure checkout with Apple Pay',
  //   type: PAYMENT_METHODS.STRIPE.APPLE_PAY
  // },
  // {
  //   id: 'google_pay',
  //   name: PAYMENT_METHOD_LABELS.stripe_google_pay,
  //   description: 'Fast and secure checkout with Google Pay',
  //   type: PAYMENT_METHODS.STRIPE.GOOGLE_PAY
  // }, 
  {
    id: 'bitcoin',
    name: PAYMENT_METHOD_LABELS.crypto_bitcoin,
    description: 'Pay with Bitcoin',
    type: PAYMENT_METHODS.CRYPTO.BITCOIN
  }, 
  // {
  //   id: 'paypal',
  //   name: PAYMENT_METHOD_LABELS.paypal,
  //   description: 'Pay using your PayPal account',
  //   type: PAYMENT_METHODS.PAYPAL
  // },
   
]

// Helper function to get payment method details by ID
export function getPaymentMethodById(id: string) {
  return paymentMethods.find(method => method.id === id)
}

// Helper function to get payment method label by type
export function getPaymentMethodLabel(type: string) {
  return PAYMENT_METHOD_LABELS[type] || 'Unknown Payment Method'
}