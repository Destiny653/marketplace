import { Metadata } from 'next'
import Link from 'next/link'
import { HelpCircle, Book, FileQuestion, MessageSquare, ShoppingBag, Truck, RotateCcw, CreditCard } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Help Center | Marketplace',
  description: 'Find answers to common questions and get support for your shopping experience.',
}

export default function HelpCenterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 mb-10 text-white text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Help Center</h1>
        <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
          Find answers to your questions and get the support you need for a seamless shopping experience.
        </p>
        <div className="max-w-xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help topics..."
              className="w-full px-5 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full hover:bg-blue-700 transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Help Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-8 text-center">How Can We Help You?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/faq" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center">
            <div className="bg-blue-100 p-3 rounded-full inline-flex mb-4">
              <FileQuestion className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">FAQs</h3>
            <p className="text-gray-600">Find answers to frequently asked questions</p>
          </Link>
          
          <Link href="/shipping" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center">
            <div className="bg-blue-100 p-3 rounded-full inline-flex mb-4">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Shipping</h3>
            <p className="text-gray-600">Learn about shipping options and delivery times</p>
          </Link>
          
          <Link href="/returns" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center">
            <div className="bg-blue-100 p-3 rounded-full inline-flex mb-4">
              <RotateCcw className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Returns & Refunds</h3>
            <p className="text-gray-600">Understand our return policy and process</p>
          </Link>
          
          <Link href="/contact" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center">
            <div className="bg-blue-100 p-3 rounded-full inline-flex mb-4">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Contact Us</h3>
            <p className="text-gray-600">Get in touch with our customer support team</p>
          </Link>
        </div>
      </div>

      {/* Popular Help Topics */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Popular Help Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-5 rounded-lg">
            <h3 className="font-medium mb-3 flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2 text-blue-600" />
              How to place an order
            </h3>
            <p className="text-gray-600 mb-3">
              Learn how to browse products, add items to your cart, and complete your purchase.
            </p>
            <Link href="/faq#placing-orders" className="text-blue-600 hover:underline font-medium">
              Read more →
            </Link>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg">
            <h3 className="font-medium mb-3 flex items-center">
              <Truck className="h-5 w-5 mr-2 text-blue-600" />
              Tracking your order
            </h3>
            <p className="text-gray-600 mb-3">
              Find out how to track your package and get delivery updates.
            </p>
            <Link href="/faq#order-tracking" className="text-blue-600 hover:underline font-medium">
              Read more →
            </Link>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg">
            <h3 className="font-medium mb-3 flex items-center">
              <RotateCcw className="h-5 w-5 mr-2 text-blue-600" />
              Return process
            </h3>
            <p className="text-gray-600 mb-3">
              Step-by-step guide on how to return items and get a refund.
            </p>
            <Link href="/returns" className="text-blue-600 hover:underline font-medium">
              Read more →
            </Link>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg">
            <h3 className="font-medium mb-3 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
              Payment methods
            </h3>
            <p className="text-gray-600 mb-3">
              Information about accepted payment methods and secure transactions.
            </p>
            <Link href="/faq#payments" className="text-blue-600 hover:underline font-medium">
              Read more →
            </Link>
          </div>
        </div>
      </div>

      {/* Help Guides */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Help Guides</h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Book className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="font-bold text-lg">Comprehensive Shopping Guides</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Our detailed guides cover everything from creating an account to managing your orders and returns.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Link href="/help-center/account-management" className="text-blue-600 hover:underline">
                Account Management
              </Link>
              <Link href="/help-center/shopping-guide" className="text-blue-600 hover:underline">
                Shopping Guide
              </Link>
              <Link href="/help-center/payment-guide" className="text-blue-600 hover:underline">
                Payment Guide
              </Link>
              <Link href="/help-center/shipping-guide" className="text-blue-600 hover:underline">
                Shipping Guide
              </Link>
              <Link href="/help-center/returns-guide" className="text-blue-600 hover:underline">
                Returns & Refunds Guide
              </Link>
              <Link href="/help-center/security-guide" className="text-blue-600 hover:underline">
                Security Guide
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-gray-100 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Our customer support team is available to assist you with any questions or concerns.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/contact" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center justify-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Contact Support
          </Link>
          <a href="tel:+11234567890" className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors inline-flex items-center justify-center">
            <Phone className="h-5 w-5 mr-2" />
            Call Us
          </a>
        </div>
      </div>
    </div>
  )
}