import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

/**
 * Provides client-side Stripe configuration with dynamic country/currency detection
 */
export async function GET() {
  try {
    // Get request headers for potential geo-location
    const headersList = await headers()

    // Try to get country from headers (Vercel provides this)
    const country = headersList.get('x-vercel-ip-country') ||
      headersList.get('cf-ipcountry') ||
      'US' // Fallback to US

    // Determine currency based on country
    const currency = getCurrencyForCountry(country)

    return NextResponse.json({
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      country,
      currency,
      paymentMethods: getSupportedPaymentMethods(country, currency)
    })
  } catch (error) {
    console.error('Stripe config error:', error)
    return NextResponse.json({
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      country: 'US',
      currency: 'usd',
      paymentMethods: [
        'card',
        'apple_pay',
        'google_pay',
        'paypal',
        'link'
      ]
    }, { status: 200 })
  }
}

// NextResponse.json({
//   publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
//   country: 'US', // Set your country code
//   currency: 'usd',
//   paymentMethods: [
//     'card',
//     'apple_pay',
//     'google_pay',
//     'ach_debit',
//     'us_bank_account',
//     'sepa_debit',
//     'ideal',
//     'paypal',
//     'sofort',
//     'afterpay_clearpay',
//     'klarna',
//     'link'
//   ] // Supported payment methods
// })

// Helper function to determine currency based on country
function getCurrencyForCountry(country: string): string {
  const countryToCurrency: Record<string, string> = {
    US: 'usd',
    GB: 'gbp',
    EU: 'eur',
    CA: 'cad',
    AU: 'aud',
    JP: 'jpy',
    // Add more country-currency mappings as needed
  }

  return countryToCurrency[country] || 'usd'
}

// Helper function to determine supported payment methods
function getSupportedPaymentMethods(country: string, currency: string): string[] {
  const baseMethods = ['card', 'apple_pay', 'google_pay', 'link']

  // Country-specific methods
  if (country === 'US') {
    baseMethods.push('ach_debit', 'us_bank_account')
  }
  if (country === 'EU') {
    baseMethods.push('sepa_debit', 'sofort')
  }
  if (country === 'NL') {
    baseMethods.push('ideal')
  }
  if (['US', 'GB', 'FR', 'DE', 'AU'].includes(country)) {
    baseMethods.push('paypal')
  }
  if (['US', 'GB', 'FR', 'DE', 'ES', 'IT'].includes(country)) {
    baseMethods.push('afterpay_clearpay')
  }
  if (['US', 'GB', 'DE', 'AT', 'NL', 'BE', 'ES', 'IT', 'SE'].includes(country)) {
    baseMethods.push('klarna')
  }

  // Currency-specific adjustments
  if (currency !== 'usd') {
    baseMethods.filter(method => method !== 'us_bank_account' && method !== 'ach_debit')
  }

  return Array.from(new Set(baseMethods)) // Remove duplicates
}