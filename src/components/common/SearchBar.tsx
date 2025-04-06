'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'

function SearchBarContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('search') || ''
  
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const debouncedSearch = useDebounce(searchQuery, 500)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (debouncedSearch) {
      params.set('search', debouncedSearch)
    } else {
      params.delete('search')
    }
    
    params.delete('page') // Reset pagination when search changes
    router.push(`/products?${params.toString()}`)
  }, [debouncedSearch, router, searchParams])

  const clearSearch = () => {
    setSearchQuery('')
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        {searchQuery && (
          <button 
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  )
}

export default function SearchBar() {
  return (
    <Suspense fallback={
      <div className="relative w-full max-w-md">
        <div className="relative">
          <div className="w-full h-10 bg-gray-100 animate-pulse rounded-md"></div>
        </div>
      </div>
    }>
      <SearchBarContent />
    </Suspense>
  )
}
