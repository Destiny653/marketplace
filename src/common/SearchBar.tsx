'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex-1 max-w-xl">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for products..."
        className="w-full py-2 pl-4 pr-12 text-sm border rounded-full focus:outline-none focus:border-blue-500"
      />
      <button
        type="submit"
        className="absolute right-0 top-0 h-full px-4 text-gray-500 hover:text-blue-500"
      >
        <Search className="w-5 h-5" />
      </button>
    </form>
  )
}
