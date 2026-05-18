import React from 'react'
import { mockDeals } from '../data/mockDeals'
import { DealCard } from './DealCard'
import { useSavedDeals } from '../hooks/useSavedDeals'

interface SavedDealsProps {
  onSelectDeal: (dealId: string) => void
}

export const SavedDeals: React.FC<SavedDealsProps> = ({ onSelectDeal }) => {
  const { savedIds, toggleSave, isSaved, isLoading } = useSavedDeals()

  const savedDeals = mockDeals.filter(deal => savedIds.includes(deal.id))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading saved deals...</p>
        </div>
      </div>
    )
  }

  if (savedDeals.length === 0) {
    return (
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
            d="M5 5a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 19V5z"
          />
        </svg>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No saved deals yet</h3>
        <p className="text-gray-500 text-center max-w-xs">
          Browse deals and save your favorites to access them quickly later
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Saved Deals</h2>
        <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
          {savedDeals.length}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {savedDeals.map(deal => (
          <DealCard
            key={deal.id}
            deal={deal}
            isSaved={isSaved(deal.id)}
            onSave={toggleSave}
            onClick={onSelectDeal}
          />
        ))}
      </div>

      <div className="text-center text-sm text-gray-500 py-4">
        {savedDeals.length} of {mockDeals.length} deals saved
      </div>
    </div>
  )
}
