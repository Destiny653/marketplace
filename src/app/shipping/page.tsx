import { Metadata } from 'next'
import { Truck, Clock, Globe, CreditCard, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shipping Policy | Marketplace',
  description: 'Learn about our shipping methods, delivery times, and shipping policies.',
}

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 mb-10 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Shipping Policy</h1>
        <p className="text-lg md:text-xl mb-6 max-w-3xl">
          Everything you need to know about our shipping methods, delivery times, and policies.
        </p>
      </div>

      {/* Shipping Options */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Shipping Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg">Standard Shipping</h3>
            </div>
            <p className="text-gray-600 mb-3">
              Delivery within 5-7 business days
            </p>
            <p className="font-medium">
              $4.99 (Free on orders over $50)
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg">Express Shipping</h3>
            </div>
            <p className="text-gray-600 mb-3">
              Delivery within 2-3 business days
            </p>
            <p className="font-medium">
              $9.99
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg">International Shipping</h3>
            </div>
            <p className="text-gray-600 mb-3">
              Delivery within 7-14 business days
            </p>
            <p className="font-medium">
              Starting at $14.99
            </p>
          </div>
        </div>
      </div>

      {/* Shipping Policy Details */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Shipping Policy Details</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-3">Processing Time</h3>
            <p className="text-gray-600">
              All orders are processed within 1-2 business days after payment confirmation. 
              Orders placed on weekends or holidays will be processed on the next business day.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-3">Shipping Destinations</h3>
            <p className="text-gray-600">
              We ship to all 50 US states and to over 100 countries worldwide. Some restrictions may apply for certain products or destinations.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-3">Tracking Information</h3>
            <p className="text-gray-600">
              Once your order ships, you will receive a shipping confirmation email with a tracking number. 
              You can use this number to track your package on our website or directly through the carrier's website.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-3">Shipping Delays</h3>
            <p className="text-gray-600">
              Occasionally, shipping may be delayed due to unforeseen circumstances such as weather conditions, 
              customs clearance, or carrier delays. We will notify you if there are any significant delays with your order.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-3">Address Changes</h3>
            <p className="text-gray-600">
              If you need to change your shipping address after placing an order, please contact our customer service team immediately. 
              We can only accommodate address changes if the order has not yet been processed for shipping.
            </p>
          </div>
        </div>
      </div>

      {/* International Shipping */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">International Shipping Information</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 mb-4">
            For international orders, please note the following:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-4">
            <li>Delivery times may vary depending on the destination country and customs clearance process.</li>
            <li>The customer is responsible for any customs duties, taxes, or import fees that may apply.</li>
            <li>Some products may not be available for international shipping due to regulations or restrictions.</li>
            <li>International orders may require additional verification for security purposes.</li>
            <li>Return shipping costs for international orders are the responsibility of the customer unless the return is due to a product defect or our error.</li>
          </ul>
          <p className="text-gray-600">
            For specific information about shipping to your country, please contact our customer service team.
          </p>
        </div>
      </div>

      {/* Free Shipping Policy */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Free Shipping Policy</h2>
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex items-center mb-4">
            <ShieldCheck className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="font-bold text-lg">Free Standard Shipping on Orders Over $50</h3>
          </div>
          <p className="text-gray-600 mb-4">
            We offer free standard shipping on all domestic orders over $50. This applies to the subtotal of your order before taxes and after any discounts have been applied.
          </p>
          <p className="text-gray-600 mb-4">
            Exclusions may apply for oversized items, expedited shipping, or certain remote locations. Free shipping is only available for standard shipping within the continental United States.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800 font-medium">
              Note: Promotional free shipping offers may have different terms and conditions. Please refer to the specific promotion details.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold mb-2">How can I track my order?</h3>
            <p className="text-gray-600">
              Once your order ships, you'll receive a shipping confirmation email with tracking information. You can also track your order by logging into your account and viewing your order history.
            </p>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold mb-2">Can I change my shipping address after placing an order?</h3>
            <p className="text-gray-600">
              If your order hasn't shipped yet, we may be able to change the shipping address. Please contact our customer service team as soon as possible with your order number.
            </p>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold mb-2">Do you ship to PO boxes?</h3>
            <p className="text-gray-600">
              Yes, we can ship to PO boxes for standard shipping. However, expedited shipping methods may require a physical address.
            </p>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold mb-2">What happens if my package is lost or damaged?</h3>
            <p className="text-gray-600">
              If your package is lost or arrives damaged, please contact our customer service team within 7 days of the expected delivery date. We'll work with the shipping carrier to resolve the issue.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-100 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Need More Information?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          If you have any questions about our shipping policy or need assistance with a specific order, our customer service team is here to help.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href="/contact" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Contact Customer Service
          </a>
          <a href="/faq" className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
            View FAQs
          </a>
        </div>
      </div>
    </div>
  )
}