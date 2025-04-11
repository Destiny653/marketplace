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
type SearchParams = {
  category?: string
  search?: string
  sort?: string
  page?: string
  price?: string
}

const ITEMS_PER_PAGE = 12
const DEFAULT_SORT = 'newest'

const createSearchParams = (params: SearchParams, newPage: number) => {
  return new URLSearchParams({
    category: params.category || '',
    search: params.search || '',
    sort: params.sort || '',
    price: params.price || '',
    page: newPage.toString(),
  }).toString()
}

// Fix: Use the correct type for page props
interface PageProps {
  searchParams: SearchParams
}

export default async function ProductsPage({ searchParams }: PageProps) {
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

  // Parse and validate parameters
  const category = searchParams.category
  const search = searchParams.search?.trim()
  const sort = ['price_asc', 'price_desc', 'newest', 'popular'].includes(searchParams.sort || '')
    ? searchParams.sort || DEFAULT_SORT
    : DEFAULT_SORT
  const page = Math.max(1, parseInt(searchParams.page || '1'))
  const price = searchParams.price

  try {
    // Fetch data in parallel
    const [productsQuery, categoriesQuery] = await Promise.all([
      supabase
        .from('products')
        .select('*, categories(*)', { count: 'exact' })
        .eq(category ? 'category_id' : '', category || '')
        .ilike(search ? 'name' : '', search ? `%${search}%` : '')
        .order(getSortField(sort), { ascending: getSortDirection(sort) })
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1),
      supabase.from('categories').select('*')
    ])

    // Handle errors
    if (productsQuery.error) throw productsQuery.error
    if (categoriesQuery.error) throw categoriesQuery.error

    // Apply price filter if needed
    let filteredProducts = productsQuery.data || []
    if (price) {
      const [minPrice, maxPrice] = price.split('-').map(Number)
      filteredProducts = filteredProducts.filter(product => {
        const price = product.price
        return (!isNaN(minPrice) ? price >= minPrice : true) &&
               (!isNaN(maxPrice) ? price <= maxPrice : true)
      })
    }

    // Get current category name
    const currentCategoryName = category
      ? categoriesQuery.data?.find(c => c.id === category)?.name || 'All Products'
      : 'All Products'

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 mb-10 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {search ? `Search Results: ${search}` : currentCategoryName}
            </h1>
            <p className="text-lg md:text-xl mb-6 max-w-3xl text-blue-100">
              {search 
                ? `Showing results for "${search}"`
                : `Discover our curated collection of premium products at competitive prices.`
              }
            </p>
            <div className="max-w-xl backdrop-blur-sm bg-white/10 rounded-lg p-1">
              <SearchBar defaultValue={search} />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-blue-600" />
                  Filters
                </h2>
                <a href="/products" className="text-sm text-blue-600 hover:underline">
                  Clear All
                </a>
              </div>
              <FilterSection categories={categoriesQuery.data || []} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2 text-blue-600" />
                  <span className="font-medium">
                    {productsQuery.count || 0} {productsQuery.count === 1 ? 'Product' : 'Products'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-sm">Sort by:</span>
                  <SortDropdown currentSort={sort ?? DEFAULT_SORT} />
                </div>
              </div>
            </div>

            <Suspense fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="bg-gray-100 rounded-lg p-4 animate-pulse h-80">
                    <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            }>
              <ProductGrid products={filteredProducts} />
            </Suspense>

            {/* No results */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  {search 
                    ? `We couldn't find any products matching "${search}"`
                    : "No products available in this category at the moment."
                  }
                </p>
                <a href="/products" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  View All Products
                </a>
              </div>
            )}

            {/* Pagination */}
            {productsQuery.count && productsQuery.count > ITEMS_PER_PAGE && (
              <div className="mt-8 flex justify-center">
                <nav className="inline-flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                  <PaginationArrow 
                    direction="prev" 
                    currentPage={page}
                    totalPages={Math.ceil(productsQuery.count / ITEMS_PER_PAGE)}
                    searchParams={searchParams}
                  />
                  
                  {generatePageNumbers(page, Math.ceil(productsQuery.count / ITEMS_PER_PAGE)).map((item, index) => (
                    item === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-2 text-gray-400">…</span>
                    ) : (
                      <a
                        key={item}
                        href={`/products?${createSearchParams(searchParams, Number(item))}`}
                        className={`min-w-[2.5rem] h-10 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                          page === item
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
                    currentPage={page}
                    totalPages={Math.ceil(productsQuery.count / ITEMS_PER_PAGE)}
                    searchParams={searchParams}
                  />
                </nav>
              </div>
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

// Helper functions
function getSortField(sort: string = DEFAULT_SORT) {
  switch (sort) {
    case 'price_asc':
    case 'price_desc':
      return 'price'
    case 'popular':
      return 'avg_rating'
    default:
      return 'created_at'
  }
}

function getSortDirection(sort: string = DEFAULT_SORT) {
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

function PaginationArrow({
  direction,
  currentPage,
  totalPages,
  searchParams
}: {
  direction: 'prev' | 'next'
  currentPage: number
  totalPages: number
  searchParams: SearchParams
}) {
  const isDisabled = direction === 'prev' 
    ? currentPage === 1 
    : currentPage === totalPages

  const newPage = direction === 'prev' ? currentPage - 1 : currentPage + 1

  return (
    <a
      href={`/products?${createSearchParams(searchParams, newPage)}`}
      className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${
        isDisabled ? 'text-gray-400 pointer-events-none' : 'text-gray-700'
      }`}
      aria-disabled={isDisabled}
    >
      <svg 
        className="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        style={{ transform: direction === 'prev' ? 'rotate(0deg)' : 'rotate(180deg)' }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
      </svg>
    </a>
  )
}