'use client'

import { useState } from 'react'
import { Loader2, Mail, Phone, User, MessageSquare, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'

// Country codes for phone numbers
const countryCodes = [
  { code: '+1', country: 'United States/Canada' },
  { code: '+44', country: 'United Kingdom' },
  { code: '+49', country: 'Germany' },
  { code: '+33', country: 'France' },
  { code: '+61', country: 'Australia' },
  { code: '+86', country: 'China' },
  { code: '+91', country: 'India' },
  { code: '+234', country: 'Nigeria' },
  { code: '+27', country: 'South Africa' },
  { code: '+55', country: 'Brazil' },
  { code: '+52', country: 'Mexico' },
  { code: '+81', country: 'Japan' },
  { code: '+82', country: 'South Korea' },
  // Add more country codes as needed
]

export default function ContactPage() {
  const {user} = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+1',
    phone: '',
    subject: '',
    message: '',
  })

  console.log("userDta: ",user?.id, user)
  const userid = user?.id 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try { 
      if(!user){
        toast.error("Please sign in to send a message.")
        return
      }
      // Format the phone number with country code
      const fullPhoneNumber = `${formData.countryCode} ${formData.phone}` 
        
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: fullPhoneNumber,
          subject: formData.subject,
          message: formData.message,
          userId: userid
        }),
      })

      const data = await response.json()
      if (!response.ok) { 
        toast.error(data.message || 'Failed to send message. Please try again later.')
      }

      if(data.error){
        toast.error(data.message || 'Failed to send message. Please try again later.')
        return
      }

      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        countryCode: '+1',
        phone: '',
        subject: '',
        message: '',
      })

      toast.success(data.message || 'Message sent successfully! We will get back to you soon.')
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto md:max-w-none md:grid md:grid-cols-2 md:gap-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Get in touch</h2>
            <p className="mt-3 text-lg text-gray-600">
              Have questions about our products or services? Need help with an order? 
              Our customer support team is here to help.
            </p>
            <div className="mt-9">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-3 text-base text-gray-600">
                  <p>+1 (555) 123-4567</p>
                  <p className="mt-1">Mon-Fri 8am to 6pm</p>
                </div>
              </div>
              <div className="mt-6 flex items-center">
                <div className="flex-shrink-0">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-3 text-base text-gray-600">
                  <p>support@yourstore.com</p>
                </div>
              </div>
              <div className="mt-6 flex items-center">
                <div className="flex-shrink-0">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-3 text-base text-gray-600">
                  <p>123 Market Street</p>
                  <p>Suite 456</p>
                  <p>San Francisco, CA 94103</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 md:mt-0">
            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Send us a message</h2>
            <p className="mt-3 text-lg text-gray-600">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
            
            <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="pl-11 block w-full py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="pl-11 block w-full py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="flex">
                  <select
                    id="countryCode"
                    name="countryCode"
                    className="w-1/3 border border-gray-300 rounded-l-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.code} ({country.country})
                      </option>
                    ))}
                  </select>
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="pl-11 block w-full py-3 border border-gray-300 border-l-0 rounded-r-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  className="block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="" disabled>Please select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Product Question">Product Question</option>
                  <option value="Order Status">Order Status</option>
                  <option value="Return Request">Return Request</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="pl-11 block w-full py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}