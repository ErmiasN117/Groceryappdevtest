import React, { useState, useEffect } from 'react'
import { mockDeals } from '../data/mockDeals'
import { useSavedDeals } from '../hooks/useSavedDeals'

interface DealDetailProps {
  dealId: string
  onBack: () => void
}

export const DealDetail: React.FC<DealDetailProps> = ({ dealId, onBack }) => {
  const [isLoading, setIsLoading] = useState(true)
  const { isSaved, toggleSave } = useSavedDeals()

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [dealId])

  const deal = mockDeals.find(d => d.id === dealId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading deal details...</p>
        </div>
      </div>
    )
  }

  if (!deal) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Deal not found</h2>
        <button
          onClick={onBack}
          className="btn btn-primary mt-4"
        >
          Back to Deals
        </button>
      </div>
    )
  }

  const saved = isSaved(deal.id)
  const savings = (deal.originalPrice - deal.salePrice).toFixed(2)

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary hover:text-secondary font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <span className="text-sm font-semibold text-gray-600">{deal.category}</span>
      </div>

      {/* Image */}
      <div className="relative mb-4 rounded-lg overflow-hidden bg-gray-100 h-64 sm:h-80">
        <img
          src={deal.image}
          alt={deal.productName}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-lg font-bold">
          -{deal.discount}%
        </div>
      </div>

      {/* Product Info */}
      <div className="bg-white rounded-lg p-6 mb-4 card">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{deal.productName}</h1>
            <p className="text-gray-600 font-medium">{deal.retailer}</p>
          </div>
          <button
            onClick={() => toggleSave(deal.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: saved ? '#10b981' : '#f3f4f6',
              color: saved ? 'white' : '#374151'
            }}
          >
            <svg
              className={`w-5 h-5 ${saved ? 'fill-current' : 'fill-none stroke-current'}`}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 19V5z"
              />
            </svg>
            {saved ? 'Saved' : 'Save Deal'}
          </button>
        </div>

        <p className="text-gray-700 mb-4">{deal.description}</p>

        {/* Size */}
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{deal.size}</span>
        </div>
      </div>

      {/* Pricing Details */}
      <div className="bg-primary/10 rounded-lg p-6 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Price Details</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Original Price</span>
            <span className="text-gray-900 font-medium">${deal.originalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Sale Price</span>
            <span className="text-primary font-bold text-lg">${deal.salePrice.toFixed(2)}</span>
          </div>
          <div className="border-t border-primary/20 pt-3 flex justify-between items-center">
            <span className="font-semibold text-gray-900">You Save</span>
            <span className="text-primary font-bold text-lg">${savings}</span>
          </div>
        </div>
      </div>

      {/* Location & Availability */}
      <div className="bg-white rounded-lg p-6 mb-4 card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Location & Availability</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold text-gray-900">{deal.location}</p>
              <p className="text-sm text-gray-600">{deal.distance} miles away</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v2h16V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold text-gray-900">Expires: {deal.expiresAt}</p>
              <p className="text-sm text-gray-600">Limited time offer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => toggleSave(deal.id)}
          className={`btn py-3 font-semibold text-lg transition-colors ${
            saved
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              : 'btn-primary'
          }`}
        >
          {saved ? 'Unsave Deal' : 'Save Deal'}
        </button>
        <button className="btn btn-primary py-3 font-semibold text-lg">
          View at Store
        </button>
      </div>

      {/* Similar Deals */}
      <div className="bg-white rounded-lg p-6 card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">More from {deal.retailer}</h2>
        <p className="text-gray-600">
          Save this deal to get similar recommendations from {deal.retailer}!
        </p>
      </div>
    </div>
  )
}
