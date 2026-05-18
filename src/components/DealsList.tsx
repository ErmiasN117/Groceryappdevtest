import React, { useState, useMemo } from 'react'
import { mockDeals } from '../data/mockDeals'
import { DealCard } from './DealCard'
import { useSavedDeals } from '../hooks/useSavedDeals'

interface DealsListProps {
  onSelectDeal: (dealId: string) => void
}

export const DealsList: React.FC<DealsListProps> = ({ onSelectDeal }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [sortBy, setSortBy] = useState<'discount' | 'distance' | 'price'>('discount')
  const { isSaved, toggleSave, isLoading } = useSavedDeals()

  const categories = ['All', ...new Set(mockDeals.map(d => d.category))]

  const filteredAndSortedDeals = useMemo(() => {
    let result = [...mockDeals]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(deal =>
        deal.productName.toLowerCase().includes(query) ||
        deal.retailer.toLowerCase().includes(query) ||
        deal.category.toLowerCase().includes(query)
      )
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(deal => deal.category === selectedCategory)
    }

    // Sort
    switch (sortBy) {
      case 'discount':
        result.sort((a, b) => b.discount - a.discount)
        break
      case 'distance':
        result.sort((a, b) => a.distance - b.distance)
        break
      case 'price':
        result.sort((a, b) => a.salePrice - b.salePrice)
        break
    }

    return result
  }, [searchQuery, selectedCategory, sortBy])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading deals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="sticky top-0 bg-white z-10 p-4 -mx-4">
        <div className="relative">
          <svg
            className="absolute left-3 top-3 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search deals, products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Category Filter */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Category</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="text-sm font-semibold text-gray-700">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'discount' | 'distance' | 'price')}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="discount">Highest Discount</option>
            <option value="distance">Nearest</option>
            <option value="price">Lowest Price</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {filteredAndSortedDeals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <svg
            className="w-16 h-16 text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M20 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">No deals found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredAndSortedDeals.map(deal => (
            <DealCard
              key={deal.id}
              deal={deal}
              isSaved={isSaved(deal.id)}
              onSave={toggleSave}
              onClick={onSelectDeal}
            />
          ))}
        </div>
      )}

      <div className="text-center text-sm text-gray-500 py-4">
        Showing {filteredAndSortedDeals.length} of {mockDeals.length} deals
      </div>
    </div>
  )
}
