import { Metadata } from 'next'
import { RotateCcw, CheckCircle, AlertCircle, HelpCircle, Package } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Returns & Exchanges | Marketplace',
  description: 'Learn about our return policy, exchange process, and refund information.',
}

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 mb-10 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Returns & Exchanges</h1>
        <p className="text-lg md:text-xl mb-6 max-w-3xl">
          Our hassle-free return policy makes it easy to return or exchange items if you're not completely satisfied.
        </p>
      </div>

      {/* Return Policy Overview */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Return Policy Overview</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 mb-6">
            We want you to be completely satisfied with your purchase. If you're not happy with your order for any reason, you can return most items within 30 days of delivery for a full refund or exchange.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <RotateCcw className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold mb-2">30-Day Returns</h3>
              <p className="text-gray-600">
                Return most items within 30 days of delivery
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold mb-2">Easy Process</h3>
              <p className="text-gray-600">
                Simple online return initiation
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold mb-2">Free Returns</h3>
              <p className="text-gray-600">
                Free return shipping on eligible items
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Return Process */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">How to Return an Item</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <ol className="space-y-6">
            <li className="flex">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Initiate Your Return</h3>
                <p className="text-gray-600 mb-2">
                  Log into your account, go to your order history, and select the item you wish to return. 
                  Choose the reason for your return and whether you want a refund or an exchange.
                </p>
                <p className="text-gray-600">
                  Alternatively, you can contact our customer service team to initiate a return.
                </p>
              </div>
            </li>
            
            <li className="flex">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Print Return Label</h3>
                <p className="text-gray-600">
                  Once your return is approved, you'll receive a return shipping label via email. 
                  Print the label and attach it to the package containing the items you're returning.
                </p>
              </div>
            </li>
            
            <li className="flex">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Package Your Return</h3>
                <p className="text-gray-600">
                  Place the item(s) in the original packaging if possible, or in a sturdy box. 
                  Include all original tags, accessories, and documentation that came with the product.
                </p>
              </div>
            </li>
            
            <li className="flex">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Ship Your Return</h3>
                <p className="text-gray-600">
                  Drop off the package at any authorized shipping location or schedule a pickup. 
                  Keep the tracking number for your records.
                </p>
              </div>
            </li>
            
            <li className="flex">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                5
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Receive Your Refund or Exchange</h3>
                <p className="text-gray-600">
                  Once we receive and inspect your return, we'll process your refund or ship your exchange item. 
                  Refunds typically take 5-7 business days to appear on your original payment method.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>

      {/* Return Eligibility */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Return Eligibility</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
              <h3 className="font-bold text-lg">Eligible for Return</h3>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Unworn, unwashed, and undamaged items</li>
              <li>Items with original tags and packaging</li>
              <li>Items returned within 30 days of delivery</li>
              <li>Items that are not final sale or clearance</li>
              <li>Defective or damaged items received</li>
              <li>Incorrect items received</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="font-bold text-lg">Not Eligible for Return</h3>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Items marked as final sale or clearance</li>
              <li>Items returned after 30 days of delivery</li>
              <li>Used, worn, or damaged items (unless received defective)</li>
              <li>Items without original tags or packaging</li>
              <li>Gift cards and downloadable products</li>
              <li>Personal care items and undergarments</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Refund Information */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Refund Information</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-3">Refund Processing Time</h3>
            <p className="text-gray-600">
              Once we receive your return, it typically takes 1-2 business days to inspect and process. 
              After processing, refunds will be issued to your original payment method and may take 5-7 business days to appear, depending on your financial institution.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-3">Refund Methods</h3>
            <p className="text-gray-600">
              Refunds will be issued using the original payment method:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 mt-2">
              <li>Credit/Debit Card: Refunded to the original card</li>
              <li>PayPal: Refunded to your PayPal account</li>
              <li>Store Credit: Issued as additional store credit</li>
              <li>Gift Card Purchases: Refunded as a new gift card</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-3">Partial Refunds</h3>
            <p className="text-gray-600">
              We may issue partial refunds for items that show signs of use, are damaged when returned, or are missing parts or accessories.
              In such cases, we'll notify you about the adjusted refund amount before processing.
            </p>
          </div>
        </div>
      </div>

      {/* Exchanges */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Exchanges</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 mb-4">
            If you'd like to exchange an item for a different size, color, or product, you can request an exchange when initiating your return.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg mb-2">Exchange Process</h3>
              <p className="text-gray-600">
                When initiating your return, select "Exchange" and choose the item you'd like instead. 
                If the new item has a different price:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 mt-2">
                <li>If the new item costs more, you'll be charged the difference</li>
                <li>If the new item costs less, you'll be refunded the difference</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-2">Exchange Availability</h3>
              <p className="text-gray-600">
                Exchanges are subject to product availability. If your desired exchange item is out of stock, we'll notify you and process a refund instead.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-2">Exchange Shipping</h3>
              <p className="text-gray-600">
                Standard shipping for exchanges is free. If you'd like expedited shipping for your exchange, additional shipping charges will apply.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold mb-2">How long do I have to return an item?</h3>
            <p className="text-gray-600">
              Most items can be returned within 30 days of delivery. Some seasonal or special items may have different return windows, which will be noted on the product page.
            </p>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold mb-2">Do I have to pay for return shipping?</h3>
            <p className="text-gray-600">
              Return shipping is free for eligible items. For items that don't qualify for free returns, a shipping fee will be deducted from your refund amount.
            </p>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold mb-2">Can I return a gift?</h3>
            <p className="text-gray-600">
              Yes, gifts can be returned. You'll need the order number or gift receipt. Refunds for gifts will be issued as store credit unless otherwise specified.
            </p>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold mb-2">What if my item arrives damaged?</h3>
            <p className="text-gray-600">
              If your item arrives damaged or defective, please contact our customer service team within 48 hours of delivery. We'll arrange a return or replacement at no cost to you.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-100 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Need Help with a Return?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Our customer service team is available to assist you with any questions about returns or exchanges.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href="/contact" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Contact Customer Service
          </a>
          <a href="/help-center" className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
            Visit Help Center
          </a>
        </div>
      </div>
    </div>
  )
}