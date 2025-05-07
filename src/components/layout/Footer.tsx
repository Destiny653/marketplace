import Link from 'next/link'
import Image from 'next/image'
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Linkedin, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  RotateCcw 
} from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      Features section
      <div className="container mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center space-x-4 bg-gray-800 p-6 rounded-lg">
            <div className="bg-blue-600 p-3 rounded-full">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold">Free Shipping</h3>
              <p className="text-gray-400 text-sm">On orders over $50</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 bg-gray-800 p-6 rounded-lg">
            <div className="bg-blue-600 p-3 rounded-full">
              <RotateCcw className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold">Easy Returns</h3>
              <p className="text-gray-400 text-sm">30-day return policy</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 bg-gray-800 p-6 rounded-lg">
            <div className="bg-blue-600 p-3 rounded-full">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold">Secure Shopping</h3>
              <p className="text-gray-400 text-sm">100% secure payment</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 bg-gray-800 p-6 rounded-lg">
            <div className="bg-blue-600 p-3 rounded-full">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold">Flexible Payment</h3>
              <p className="text-gray-400 text-sm">Multiple payment methods</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* About Section */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Marketplace
              </h2>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Your trusted marketplace for quality products and excellent service. We connect buyers and sellers to create a seamless shopping experience.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
                <p className="text-gray-400">123 Commerce St, Market City, MC 12345</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-500" />
                <p className="text-gray-400">+1 (555) 123-4567</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-500" />
                <p className="text-gray-400">support@yourmarketplace.com</p>
              </div>
            </div>
            
            <div className="flex space-x-4 pt-2">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-1 after:w-12 after:bg-blue-600">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="mr-2">›</span> Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="mr-2">›</span> Categories
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="mr-2">›</span> Special Deals
                </Link>
              </li>
              <li>
                <Link href="/new-arrivals" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="mr-2">›</span> New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/best-sellers" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="mr-2">›</span> Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="mr-2">›</span> Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-1 after:w-12 after:bg-blue-600">
              Customer Service
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="mr-2">›</span> Contact Us
                </Link>
              </li>
              <li>
                <Link href="/help-center" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="mr-2">›</span> Help Center
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="mr-2">›</span> Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="mr-2">›</span> Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="mr-2">›</span> FAQs
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="mr-2">›</span> Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-1 after:w-12 after:bg-blue-600">
              Newsletter
            </h3>
            <p className="text-gray-400">
              Subscribe to our newsletter for updates, promotions, and exclusive offers.
            </p>
            <form className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Subscribe
              </button>
            </form>
            <p className="text-gray-500 text-sm">
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </p>
          </div>
        </div>

        {/* Payment methods */}
        <div className="border-t border-gray-800 pt-8 pb-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h4 className="text-gray-400 mb-3">Accepted Payment Methods</h4>
              <div className="flex space-x-3">
                <div className="bg-white p-2 rounded">
                  <Image src="/images/payment/visa.svg" alt="Visa" width={40} height={25} />
                </div>
                <div className="bg-white p-2 rounded">
                  <Image src="/images/payment/mastercard.svg" alt="Mastercard" width={40} height={25} />
                </div>
                <div className="bg-white p-2 rounded">
                  <Image src="/images/payment/paypal.svg" alt="PayPal" width={40} height={25} />
                </div>
                <div className="bg-white p-2 rounded">
                  <Image src="/images/payment/applepay.svg" alt="Apple Pay" width={40} height={25} />
                </div>
                <div className="bg-white p-2 rounded">
                  <Image src="/images/payment/googlepay.svg" alt="Google Pay" width={40} height={25} />
                </div>
                <div className="bg-white p-2 rounded">
                  <Image src="/images/payment/bitcoin.svg" alt="Bitcoin" width={40} height={25} />
                </div>
                <div className="bg-white p-2 rounded">
                  <Image src="/images/payment/ethereum.svg" alt="Ethereum" width={40} height={25} />
                </div>
              </div>
            </div> 
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500">
            {currentYear} Marketplace. All rights reserved.
          </p>
          <div className="flex justify-center space-x-6 mt-4">
            <Link href="/privacy" className="text-gray-500 hover:text-gray-400 transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-gray-400 transition-colors text-sm">
              Terms of Service
            </Link>
            <Link href="/sitemap" className="text-gray-500 hover:text-gray-400 transition-colors text-sm">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}