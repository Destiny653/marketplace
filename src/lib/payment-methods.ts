export const PAYMENT_METHODS = {
  STRIPE: {
    CARD: 'stripe_card',
    APPLE_PAY: 'stripe_apple_pay',
    GOOGLE_PAY: 'stripe_google_pay',
    SEPA: 'stripe_sepa',
    IDEAL: 'stripe_ideal',
    SOFORT: 'stripe_sofort',
    GIROPAY: 'stripe_giropay',
    BANCONTACT: 'stripe_bancontact',
    EPS: 'stripe_eps',
    P24: 'stripe_p24',
    ALIPAY: 'stripe_alipay',
    WECHAT: 'stripe_wechat',
  },
  CRYPTO: {
    BITCOIN: 'crypto_bitcoin',
    ETHEREUM: 'crypto_ethereum',
    USDC: 'crypto_usdc',
    USDT: 'crypto_usdt',
  },
  PAYPAL: 'paypal',
  BANK_TRANSFER: 'bank_transfer',
} as const

type PaymentMethodsFlat = {
  [K in keyof typeof PAYMENT_METHODS]: typeof PAYMENT_METHODS[K] extends Record<string, string>
    ? typeof PAYMENT_METHODS[K][keyof typeof PAYMENT_METHODS[K]]
    : typeof PAYMENT_METHODS[K]
}[keyof typeof PAYMENT_METHODS]

export type PaymentMethod = PaymentMethodsFlat

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  stripe_card: 'Credit/Debit Card',
  stripe_apple_pay: 'Apple Pay',
  stripe_google_pay: 'Google Pay',
  stripe_sepa: 'SEPA Direct Debit',
  stripe_ideal: 'iDEAL',
  stripe_sofort: 'Sofort',
  stripe_giropay: 'Giropay',
  stripe_bancontact: 'Bancontact',
  stripe_eps: 'EPS',
  stripe_p24: 'Przelewy24',
  stripe_alipay: 'Alipay',
  stripe_wechat: 'WeChat Pay',
  crypto_bitcoin: 'Bitcoin (BTC)',
  crypto_ethereum: 'Ethereum (ETH)',
  crypto_usdc: 'USD Coin (USDC)',
  crypto_usdt: 'Tether (USDT)',
  paypal: 'PayPal',
  bank_transfer: 'Bank Transfer',
}

export const PAYMENT_METHOD_ICONS: Record<string, string> = {
  stripe_card: '/images/payment/cards.svg',
  stripe_apple_pay: '/images/payment/apple-pay.svg',
  stripe_google_pay: '/images/payment/google-pay.svg',
  stripe_sepa: '/images/payment/sepa.svg',
  stripe_ideal: '/images/payment/ideal.svg',
  stripe_sofort: '/images/payment/sofort.svg',
  stripe_giropay: '/images/payment/giropay.svg',
  stripe_bancontact: '/images/payment/bancontact.svg',
  stripe_eps: '/images/payment/eps.svg',
  stripe_p24: '/images/payment/p24.svg',
  stripe_alipay: '/images/payment/alipay.svg',
  stripe_wechat: '/images/payment/wechat.svg',
  crypto_bitcoin: '/images/payment/bitcoin.svg',
  crypto_ethereum: '/images/payment/ethereum.svg',
  crypto_usdc: '/images/payment/usdc.svg',
  crypto_usdt: '/images/payment/usdt.svg',
  paypal: '/images/payment/paypal.svg',
  bank_transfer: '/images/payment/bank.svg',
}
