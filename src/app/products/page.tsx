 import { Suspense } from 'react'
import { Metadata } from 'next'
import { supabase } from '@/lib/supabase/client'
import ProductGrid from '@/components/products/ProductGrid'
import FilterSection from '@/components/common/FilterSection'
import SearchBar from '@/components/common/SearchBar'
import SortDropdown from '@/components/products/SortDropdown'
import { Filter, ShoppingBag } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Products | Marketplace',
  description: 'Browse our extensive collection of quality products at competitive prices.',
}

// Type declaration for search params
type ProductQuery = {
  category?: string | string[]
  search?: string | string[]
  sort?: string | string[]
  page?: string | string[]
  price?: string | string[]
  rating?: string | string[]
}

const ITEMS_PER_PAGE = 12
const DEFAULT_SORT = 'newest'

export default async function ProductsPage({ 
  searchParams 
}: { 
  searchParams: any
}) {
  // Validate supabase client
  if (!supabase) {
    console.error('Supabase client not initialized')
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <h2 className="text-xl font-bold text-red-800 mb-2">Service Unavailable</h2>
          <p className="text-red-600">We're experiencing technical difficulties. Please try again later.</p>
        </div>
      </div>
    )
  }

  // Helper function to safely get string params
  const getStringParam = (param: string | string[] | undefined): string | undefined => {
    return Array.isArray(param) ? param[0] : param
  }

  // Extract and validate parameters
  const category = getStringParam(searchParams.category)
  const search = getStringParam(searchParams.search)?.trim()
  const sort = ['price_asc', 'price_desc', 'newest', 'popular'].includes(getStringParam(searchParams.sort) || '')
    ? getStringParam(searchParams.sort) || DEFAULT_SORT
    : DEFAULT_SORT
  const page = Math.max(1, parseInt(getStringParam(searchParams.page) || '1'))
  const price = getStringParam(searchParams.price)
  const rating = getStringParam(searchParams.rating)

  try {
    // Base query
    let query = supabase
      .from('products')
      .select('*, categories(*)', { count: 'exact' })

    // Apply filters
    if (category) query = query.eq('category_id', category)
    if (search) query = query.ilike('name', `%${search}%`)
    if (price) {
      const [minPrice, maxPrice] = price.split('-').map(Number)
      if (!isNaN(minPrice)) query = query.gte('price', minPrice)
      if (!isNaN(maxPrice)) query = query.lte('price', maxPrice)
    }
    if (rating) {
      const minRating = parseFloat(rating)
      if (!isNaN(minRating)) query = query.gte('avg_rating', minRating)
    }

    // Apply sorting and pagination
    query = query
      .order(getSortField(sort), { ascending: getSortDirection(sort) })
      .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1)

    // Fetch data in parallel
    const [productsQuery, categoriesQuery] = await Promise.all([
      query,
      supabase.from('categories').select('*')
    ])

    // Handle errors
    if (productsQuery.error) throw productsQuery.error
    if (categoriesQuery.error) throw categoriesQuery.error

    // Get current category name
    const currentCategoryName = category
      ? categoriesQuery.data?.find(c => c.id === category)?.name || 'All Products'
      : 'All Products'

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 mb-10 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {search ? `Search Results: ${search}` : currentCategoryName}
            </h1>
            <div className="max-w-xl backdrop-blur-sm bg-white/10 rounded-lg p-1">
              <SearchBar defaultValue={search} />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 sticky top-24">
              <FilterSection categories={categoriesQuery.data || []} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2 text-blue-600" />
                  <span className="font-medium">
                    {productsQuery.count || 0} {productsQuery.count === 1 ? 'Product' : 'Products'}
                  </span>
                </div>
                <SortDropdown currentSort={sort} />
              </div>
            </div>

            <ProductGrid products={productsQuery.data || []} />

            {/* Pagination */}
            {productsQuery.count && productsQuery.count > ITEMS_PER_PAGE && (
              <Pagination 
                currentPage={page}
                totalPages={Math.ceil(productsQuery.count / ITEMS_PER_PAGE)}
                searchParams={searchParams}
              />
            )}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Products page error:', error)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Products</h2>
          <p className="text-red-600">We encountered an error while loading products. Please try again.</p>
        </div>
      </div>
    )
  }
}

// Helper functions remain the same
function getSortField(sort: string) {
  switch (sort) {
    case 'price_asc':
    case 'price_desc': return 'price'
    case 'popular': return 'avg_rating'
    default: return 'created_at'
  }
}

function getSortDirection(sort: string) {
  return !sort.endsWith('_asc')
}

function generatePageNumbers(currentPage: number, totalPages: number) {
  const pages = []
  const maxVisible = 5
  const half = Math.floor(maxVisible / 2)

  let start = Math.max(1, currentPage - half)
  let end = Math.min(totalPages, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  if (start > 1) pages.push(1)
  if (start > 2) pages.push('...')

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (end < totalPages - 1) pages.push('...')
  if (end < totalPages) pages.push(totalPages)

  return pages
}

function Pagination({
  currentPage,
  totalPages,
  searchParams
}: {
  currentPage: number
  totalPages: number
  searchParams: ProductQuery
}) {
  const createSearchParams = (newPage: number) => {
    const params = new URLSearchParams()
    if (searchParams.category) params.set('category', String(searchParams.category))
    if (searchParams.search) params.set('search', String(searchParams.search))
    if (searchParams.sort) params.set('sort', String(searchParams.sort))
    if (searchParams.price) params.set('price', String(searchParams.price))
    if (searchParams.rating) params.set('rating', String(searchParams.rating))
    params.set('page', newPage.toString())
    return params.toString()
  }

  return (
    <div className="mt-8 flex justify-center">
      <nav className="inline-flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
        <PaginationArrow 
          direction="prev" 
          currentPage={currentPage}
          totalPages={totalPages}
          createSearchParams={createSearchParams}
        />
        
        {generatePageNumbers(currentPage, totalPages).map((item, index) => (
          item === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-400">…</span>
          ) : (
            <a
              key={item}
              href={`/products?${createSearchParams(Number(item))}`}
              className={`min-w-[2.5rem] h-10 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                currentPage === item
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item}
            </a>
          )
        ))}

        <PaginationArrow 
          direction="next" 
          currentPage={currentPage}
          totalPages={totalPages}
          createSearchParams={createSearchParams}
        />
      </nav>
    </div>
  )
}

function PaginationArrow({
  direction,
  currentPage,
  totalPages,
  createSearchParams
}: {
  direction: 'prev' | 'next'
  currentPage: number
  totalPages: number
  createSearchParams: (page: number) => string
}) {
  const isDisabled = direction === 'prev' ? currentPage === 1 : currentPage === totalPages
  const newPage = direction === 'prev' ? currentPage - 1 : currentPage + 1

  return (
    <a
      href={`/products?${createSearchParams(newPage)}`}
      className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${
        isDisabled ? 'text-gray-400 pointer-events-none' : 'text-gray-700'
      }`}
      aria-disabled={isDisabled}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
          d={direction === 'prev' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
      </svg>
    </a>
  )
}