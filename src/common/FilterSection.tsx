'use client'

import { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'

interface FilterProps {
  categories: { id: string; name: string }[]
  onFilterChange: (filters: FilterState) => void
}

interface FilterState {
  priceRange: [number, number]
  categories: string[]
  inStock: boolean
  onSale: boolean
}

export default function FilterSection({ categories, onFilterChange }: FilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    categories: [],
    inStock: false,
    onSale: false,
  })

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }

  return (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Price Range</h3>
        <Slider
          defaultValue={filters.priceRange}
          max={1000}
          step={10}
          onValueChange={(value) => 
            handleFilterChange({ priceRange: value as [number, number] })
          }
        />
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>${filters.priceRange[0]}</span>
          <span>${filters.priceRange[1]}</span>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center space-x-2">
              <Checkbox
                checked={filters.categories.includes(category.id)}
                onCheckedChange={(checked) => {
                  const newCategories = checked
                    ? [...filters.categories, category.id]
                    : filters.categories.filter((id) => id !== category.id)
                  handleFilterChange({ categories: newCategories })
                }}
              />
              <span className="text-sm">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Additional Filters */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Additional Filters</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={filters.inStock}
              onCheckedChange={(checked) => 
                handleFilterChange({ inStock: checked as boolean })
              }
            />
            <span className="text-sm">In Stock</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={filters.onSale}
              onCheckedChange={(checked) => 
                handleFilterChange({ onSale: checked as boolean })
              }
            />
            <span className="text-sm">On Sale</span>
          </label>
        </div>
      </div>
    </div>
  )
}
