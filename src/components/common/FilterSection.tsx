 'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
}

interface PriceRange {
  min: number
  max: number
  label: string
}

interface FilterSectionProps {
  categories: Category[]
}

const priceRanges: PriceRange[] = [
  { min: 0, max: 50, label: 'Under $50' },
  { min: 50, max: 100, label: '$50 - $100' },
  { min: 100, max: 200, label: '$100 - $200' },
  { min: 200, max: 500, label: '$200 - $500' },
  { min: 500, max: Infinity, label: '$500+' },
]

function FilterSectionContent({ categories }: FilterSectionProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
  })

  const currentCategory = searchParams.get('category')
  const currentPriceRange = searchParams.get('price')

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const updateFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Update params based on new values
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    
    // Always reset pagination when filters change
    params.delete('page')
    
    // Use replace instead of push to avoid adding to history stack
    router.replace(`/products?${params.toString()}`, { scroll: false })
  }

  const handleCategoryClick = (categoryId: string) => {
    updateFilters({
      category: categoryId === currentCategory ? null : categoryId
    })
  }

  const handlePriceRangeClick = (range: PriceRange) => {
    const priceParam = `${range.min}-${range.max}`
    updateFilters({
      price: priceParam === currentPriceRange ? null : priceParam
    })
  }

  return (
    <div className="space-y-6">
      {/* Categories Section */}
      <div className="border rounded-lg bg-white shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
        <button
          onClick={() => toggleSection('categories')}
          className="w-full px-4 py-3 flex items-center justify-between text-left bg-gradient-to-r from-blue-50 to-white"
        >
          <span className="font-medium text-blue-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Categories
          </span>
          {expandedSections.categories ? (
            <ChevronUp className="h-5 w-5 text-blue-600" />
          ) : (
            <ChevronDown className="h-5 w-5 text-blue-600" />
          )}
        </button>

        {expandedSections.categories && (
          <div className="px-4 pb-4 space-y-2">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="radio"  // Changed from checkbox to radio for single selection
                  name="category"
                  checked={category.id === currentCategory}
                  onChange={() => handleCategoryClick(category.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">{category.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Section */}
      <div className="border rounded-lg bg-white shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
        <button
          onClick={() => toggleSection('price')}
          className="w-full px-4 py-3 flex items-center justify-between text-left bg-gradient-to-r from-blue-50 to-white"
        >
          <span className="font-medium text-blue-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Price Range
          </span>
          {expandedSections.price ? (
            <ChevronUp className="h-5 w-5 text-blue-600" />
          ) : (
            <ChevronDown className="h-5 w-5 text-blue-600" />
          )}
        </button>

        {expandedSections.price && (
          <div className="px-4 pb-4 space-y-2">
            {priceRanges.map((range) => (
              <label
                key={range.label}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="radio"  // Changed from checkbox to radio for single selection
                  name="price"
                  checked={`${range.min}-${range.max}` === currentPriceRange}
                  onChange={() => handlePriceRangeClick(range)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">{range.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters Button */}
      {(currentCategory || currentPriceRange) && (
        <button
          onClick={() => {
            router.replace('/products', { scroll: false })
          }}
          className="w-full py-2 px-4 text-sm text-blue-600 hover:text-blue-700 flex items-center justify-center"
        >
          Clear all filters
        </button>
      )}
    </div>
  )
}

export default function FilterSection(props: FilterSectionProps) {
  return (
    <Suspense fallback={<div className="animate-pulse h-64 bg-gray-100 rounded-lg"></div>}>
      <FilterSectionContent {...props} />
    </Suspense>
  )
}