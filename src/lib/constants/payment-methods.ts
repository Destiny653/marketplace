import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from '../payment-methods'

// Create a structured array of payment methods for the UI
export const paymentMethods = [
  {
    id: 'card',
    name: PAYMENT_METHOD_LABELS.stripe_card,
    description: 'Visa, Mastercard, American Express, and more',
    type: PAYMENT_METHODS.STRIPE.CARD
  },
  {
    id: 'apple_pay',
    name: PAYMENT_METHOD_LABELS.stripe_apple_pay,
    description: 'Fast and secure checkout with Apple Pay',
    type: PAYMENT_METHODS.STRIPE.APPLE_PAY
  },
  {
    id: 'google_pay',
    name: PAYMENT_METHOD_LABELS.stripe_google_pay,
    description: 'Fast and secure checkout with Google Pay',
    type: PAYMENT_METHODS.STRIPE.GOOGLE_PAY
  },
  {
    id: 'sepa',
    name: PAYMENT_METHOD_LABELS.stripe_sepa,
    description: 'European bank transfer via SEPA Direct Debit',
    type: PAYMENT_METHODS.STRIPE.SEPA
  },
  {
    id: 'ideal',
    name: PAYMENT_METHOD_LABELS.stripe_ideal,
    description: 'Dutch payment method',
    type: PAYMENT_METHODS.STRIPE.IDEAL
  },
  {
    id: 'sofort',
    name: PAYMENT_METHOD_LABELS.stripe_sofort,
    description: 'European bank transfer',
    type: PAYMENT_METHODS.STRIPE.SOFORT
  },
  {
    id: 'giropay',
    name: PAYMENT_METHOD_LABELS.stripe_giropay,
    description: 'German online bank transfer',
    type: PAYMENT_METHODS.STRIPE.GIROPAY
  },
  {
    id: 'bancontact',
    name: PAYMENT_METHOD_LABELS.stripe_bancontact,
    description: 'Belgian payment method',
    type: PAYMENT_METHODS.STRIPE.BANCONTACT
  },
  {
    id: 'eps',
    name: PAYMENT_METHOD_LABELS.stripe_eps,
    description: 'Austrian online bank transfer',
    type: PAYMENT_METHODS.STRIPE.EPS
  },
  {
    id: 'p24',
    name: PAYMENT_METHOD_LABELS.stripe_p24,
    description: 'Polish payment method',
    type: PAYMENT_METHODS.STRIPE.P24
  },
  {
    id: 'alipay',
    name: PAYMENT_METHOD_LABELS.stripe_alipay,
    description: 'Chinese digital wallet',
    type: PAYMENT_METHODS.STRIPE.ALIPAY
  },
  {
    id: 'wechat',
    name: PAYMENT_METHOD_LABELS.stripe_wechat,
    description: 'Chinese digital wallet',
    type: PAYMENT_METHODS.STRIPE.WECHAT
  },
  {
    id: 'bitcoin',
    name: PAYMENT_METHOD_LABELS.crypto_bitcoin,
    description: 'Pay with Bitcoin',
    type: PAYMENT_METHODS.CRYPTO.BITCOIN
  },
  {
    id: 'ethereum',
    name: PAYMENT_METHOD_LABELS.crypto_ethereum,
    description: 'Pay with Ethereum',
    type: PAYMENT_METHODS.CRYPTO.ETHEREUM
  },
  {
    id: 'usdc',
    name: PAYMENT_METHOD_LABELS.crypto_usdc,
    description: 'Pay with USD Coin',
    type: PAYMENT_METHODS.CRYPTO.USDC
  },
  {
    id: 'usdt',
    name: PAYMENT_METHOD_LABELS.crypto_usdt,
    description: 'Pay with Tether',
    type: PAYMENT_METHODS.CRYPTO.USDT
  },
  {
    id: 'paypal',
    name: PAYMENT_METHOD_LABELS.paypal,
    description: 'Pay using your PayPal account',
    type: PAYMENT_METHODS.PAYPAL
  },
  {
    id: 'us_bank_account',
    name: PAYMENT_METHOD_LABELS.bank_transfer,
    description: 'Direct bank transfer',
    type: PAYMENT_METHODS.BANK_TRANSFER
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