'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { ShoppingCart, User, Heart, MessageSquare, Search, Menu, X, ChevronDown, Phone, Mail, MapPin } from 'lucide-react'
import CartButton from '@/components/layout/CartButton'

export default function Header() {
  const { user } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header className="w-full bg-white">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-2 text-sm hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Phone className="h-3 w-3 mr-1" />
              <span>+1 (234) 567-8900</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-3 w-3 mr-1" />
              <span>support@marketplace.com</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/shipping" className="hover:text-blue-300 transition-colors">Shipping</Link>
            <Link href="/returns" className="hover:text-blue-300 transition-colors">Returns</Link>
            <Link href="/faq" className="hover:text-blue-300 transition-colors">Help</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className={`w-full ${isScrolled ? 'shadow-md sticky top-0 z-50 bg-white' : ''} transition-all duration-300`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Mobile Menu Button */}
            <div className="flex items-center">
              <button 
                className="mr-4 md:hidden" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Marketplace
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <form onSubmit={handleSearch} className="w-full relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full py-2 px-4 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </button>
              </form>
            </div>

            {/* Navigation Icons */}
            <div className="flex items-center space-x-5">
              {user && (
                <Link 
                  href="/wishlist" 
                  className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Heart className="h-5 w-5" />
                  <span className="text-xs hidden md:block mt-1">Wishlist</span>
                </Link>
              )}
              
              {/* Cart Button */}
              <CartButton />
              
              {user ? (
                <Link 
                  href="/account" 
                  className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="text-xs hidden md:block mt-1">Account</span>
                </Link>
              ) : (
                <Link 
                  href="/login" 
                  className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="text-xs hidden md:block mt-1">Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Menu - Desktop */}
        <nav className="bg-blue-600 text-white hidden md:block">
          <div className="container mx-auto px-4">
            <ul className="flex">
              <li className="relative group">
                <button 
                  className="py-3 px-4 flex items-center hover:bg-blue-700 transition-colors"
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                >
                  <span>Categories</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                {isCategoryDropdownOpen && (
                  <div className="absolute left-0 top-full bg-white text-gray-800 shadow-lg rounded-b-md w-64 z-50">
                    <ul className="py-2">
                      <li>
                        <Link href="/categories/electronics" className="block px-4 py-2 hover:bg-gray-100">
                          Electronics
                        </Link>
                      </li>
                      <li>
                        <Link href="/categories/fashion" className="block px-4 py-2 hover:bg-gray-100">
                          Fashion
                        </Link>
                      </li>
                      <li>
                        <Link href="/categories/home" className="block px-4 py-2 hover:bg-gray-100">
                          Home & Garden
                        </Link>
                      </li>
                      <li>
                        <Link href="/categories/beauty" className="block px-4 py-2 hover:bg-gray-100">
                          Beauty & Health
                        </Link>
                      </li>
                      <li>
                        <Link href="/categories" className="block px-4 py-2 text-blue-600 font-medium hover:bg-gray-100">
                          View All Categories
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
              <li>
                <Link href="/wishlist" className="py-3 px-4 block hover:bg-blue-700 transition-colors">
                   Wishlist
                </Link>
              </li>
              <li>
                <Link href="/new-arrivals" className="py-3 px-4 block hover:bg-blue-700 transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products" className="py-3 px-4 block hover:bg-blue-700 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/contact" className="py-3 px-4 block hover:bg-blue-700 transition-colors flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Mobile Search - Only shown when menu is open */}
        {isMenuOpen && (
          <div className="p-4 border-b md:hidden">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full py-2 px-4 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <nav className="md:hidden bg-white border-b">
            <ul className="py-2">
              <li>
                <Link 
                  href="/categories" 
                  className="block px-4 py-3 hover:bg-gray-100 border-b border-gray-100"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link 
                  href="/deals" 
                  className="block px-4 py-3 hover:bg-gray-100 border-b border-gray-100"
                >
                  Deals
                </Link>
              </li>
              <li>
                <Link 
                  href="/new-arrivals" 
                  className="block px-4 py-3 hover:bg-gray-100 border-b border-gray-100"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link 
                  href="/bestsellers" 
                  className="block px-4 py-3 hover:bg-gray-100 border-b border-gray-100"
                >
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="block px-4 py-3 hover:bg-gray-100 border-b border-gray-100"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/shipping" 
                  className="block px-4 py-3 hover:bg-gray-100 border-b border-gray-100"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link 
                  href="/whishlist" 
                  className="block px-4 py-3 hover:bg-gray-100 border-b border-gray-100"
                >
                  Whishlist
                </Link>
              </li>
              <li>
                <Link 
                  href="/products" 
                  className="block px-4 py-3 hover:bg-gray-100"
                >
                   Products
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}