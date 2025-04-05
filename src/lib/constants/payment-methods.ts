import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from '../payment-methods'

// Create a structured array of payment methods for the UI
export const paymentMethods = [
  {
    id: 'credit-card',
    name: 'Credit/Debit Card',
    description: 'Visa, Mastercard, American Express, and more',
    type: PAYMENT_METHODS.STRIPE.CARD
  },
  {
    id: 'apple-pay',
    name: 'Apple Pay',
    description: 'Fast and secure checkout with Apple Pay',
    type: PAYMENT_METHODS.STRIPE.APPLE_PAY
  },
  {
    id: 'google-pay',
    name: 'Google Pay',
    description: 'Fast and secure checkout with Google Pay',
    type: PAYMENT_METHODS.STRIPE.GOOGLE_PAY
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Pay using your PayPal account',
    type: PAYMENT_METHODS.PAYPAL
  },
  {
    id: 'bank-transfer',
    name: 'Bank Transfer',
    description: 'Direct transfer from your bank account',
    type: PAYMENT_METHODS.BANK_TRANSFER
  },
  {
    id: 'crypto-bitcoin',
    name: 'Bitcoin (BTC)',
    description: 'Pay with cryptocurrency',
    type: PAYMENT_METHODS.CRYPTO.BITCOIN
  },
  {
    id: 'crypto-ethereum',
    name: 'Ethereum (ETH)',
    description: 'Pay with cryptocurrency',
    type: PAYMENT_METHODS.CRYPTO.ETHEREUM
  }
]

// Helper function to get payment method details by ID
export function getPaymentMethodById(id: string) {
  return paymentMethods.find(method => method.id === id)
}

// Helper function to get payment method label by type
export function getPaymentMethodLabel(type: string) {
  return PAYMENT_METHOD_LABELS[type] || 'Unknown Payment Method'
}
