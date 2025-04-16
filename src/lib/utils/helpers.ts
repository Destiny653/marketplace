export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }
  
  export const calculateDiscount = (originalPrice: number, salePrice: number): number => {
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
  }
  
  export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }
  
  export const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }
  

  export function getCurrencyForCountry(countryCode: string): string {
    const countryToCurrency: Record<string, string> = {
      US: 'usd', GB: 'gbp', DE: 'eur', FR: 'eur',
      CA: 'cad', AU: 'aud', JP: 'jpy', // Add more as needed
    }
    return countryToCurrency[countryCode] || 'usd'
  }