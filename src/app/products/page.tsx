import { Suspense } from 'react'
import { Metadata } from 'next'
import { supabase } from '@/lib/supabase/client'
// import ProductGrid from '@/components/products/ProductGrid'
import FilterSection from '@/components/common/FilterSection'
import SearchBar from '@/components/common/SearchBar'
import SortDropdown from '@/components/products/SortDropdown'
import { Filter, ShoppingBag } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Products | Marketplace',
  description: 'Browse our extensive collection of quality products at competitive prices.',
}

interface SearchParams {
  category?: string
  search?: string
  sort?: string
  page?: string
  price?: string
  [key: string]: string | undefined
}

const createSearchParams = (params: SearchParams, newPage: number) => {
  return new URLSearchParams({
    category: params.category || '',
    search: params.search || '',
    sort: params.sort || '',
    price: params.price || '',
    page: newPage.toString(),
  }).toString()
}

// Using any type as a temporary workaround to fix build errors
export default async function ProductsPage({ searchParams }: any) {
  // Check if supabase client is available
  if (!supabase) {
    // Return empty products for build time
    // This will be replaced with actual data during runtime
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Products</h1>
        <div className="text-center py-12">
          <p className="text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }
  
  // Destructure and await searchParams
  const category = await Promise.resolve(searchParams.category)
  const search = await Promise.resolve(searchParams.search)
  const sort = await Promise.resolve(searchParams.sort) || 'newest'
  const page = await Promise.resolve(searchParams.page) || '1'
  const price = await Promise.resolve(searchParams.price)
  const itemsPerPage = 12
  const currentPage = parseInt(page)

  const query = supabase
    .from('products')
    .select('*, categories(*)', { count: 'exact' })

  if (category) {
    query.eq('category_id', category)
  }

  if (search) {
    query.ilike('name', `%${search}%`)
  }

  // Apply price filter if present
  if (price) {
    const [minPrice, maxPrice] = price.split('-').map(Number)
    if (!isNaN(minPrice)) {
      query.gte('price', minPrice)
    }
    if (!isNaN(maxPrice) && maxPrice < 1000) {
      query.lte('price', maxPrice)
    }
  }

  switch (sort) {
    case 'price_asc':
      query.order('price', { ascending: true })
      break
    case 'price_desc':
      query.order('price', { ascending: false })
      break
    case 'newest':
      query.order('created_at', { ascending: false })
      break
    case 'popular':
      query.order('avg_rating', { ascending: false })
      break
    default:
      query.order('created_at', { ascending: false })
  }

  const { data: products, count } = await query
    .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1)

  const { data: categories } = await supabase.from('categories').select('*')

  // Get the current category name if category is selected
  let currentCategoryName = "All Products"
  if (category && categories) {
    const currentCategory = categories.find(cat => cat.id === category)
    if (currentCategory) {
      currentCategoryName = currentCategory.name
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero section for products page */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 rounded-2xl p-8 mb-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
            {search ? `Search Results: ${search}` : currentCategoryName}
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-3xl text-blue-100">
            {search 
              ? `Showing results for "${search}"`
              : `Discover our curated collection of premium products at competitive prices.`
            }
          </p>
          <div className="max-w-xl backdrop-blur-sm bg-white/10 rounded-lg p-1">
            <SearchBar />
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
            <FilterSection
              categories={categories || []}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2 text-blue-600" />
                <span className="font-medium">
                  {count || 0} {count === 1 ? 'Product' : 'Products'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm">Sort by:</span>
                <SortDropdown currentSort={sort} />
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
            {/* <ProductGrid products={products || []} /> */}
          </Suspense>

          {/* No results message */}
          {products?.length === 0 && (
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
          {count && count > itemsPerPage && (
            <div className="mt-8 flex justify-center">
              <nav className="inline-flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                {/* Previous page */}
                <a
                  href={`/products?${createSearchParams(searchParams, Math.max(1, currentPage - 1))}`}
                  className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${
                    currentPage === 1 ? 'text-gray-400 pointer-events-none' : 'text-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </a>

                {/* Page numbers */}
                {Array.from({ length: Math.ceil(count / itemsPerPage) }, (_, i) => i + 1)
                  .filter(num => {
                    const maxPages = 5;
                    const half = Math.floor(maxPages / 2);
                    return num === 1 || 
                           num === Math.ceil(count / itemsPerPage) ||
                           (num >= currentPage - half && num <= currentPage + half);
                  })
                  .map((pageNum, index, array) => {
                    // Add ellipsis
                    if (index > 0 && pageNum - array[index - 1] > 1) {
                      return [
                        <span key={`ellipsis-${pageNum}`} className="px-2 text-gray-400">…</span>,
                        <a
                          key={pageNum}
                          href={`/products?${createSearchParams(searchParams, pageNum)}`}
                          className={`min-w-[2.5rem] h-10 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </a>
                      ];
                    }
                    return (
                      <a
                        key={pageNum}
                        href={`/products?${createSearchParams(searchParams, pageNum)}`}
                        className={`min-w-[2.5rem] h-10 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </a>
                    );
                  })}

                {/* Next page */}
                <a
                  href={`/products?${createSearchParams(searchParams, Math.min(Math.ceil(count / itemsPerPage), currentPage + 1))}`}
                  className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${
                    currentPage === Math.ceil(count / itemsPerPage) ? 'text-gray-400 pointer-events-none' : 'text-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </nav>
            </div>
          )}
        </div>
      </div>
      
      {/* Featured Categories Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories?.slice(0, 4).map((category) => (
            <a 
              key={category.id}
              href={`/products?category=${category.id}`}
              className="group"
            >
              <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square relative hover:shadow-md transition-shadow">
                {category.image_url && (
                  <img 
                    src={category.image_url} 
                    alt={category.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <h3 className="text-white font-bold p-4">{category.name}</h3>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}