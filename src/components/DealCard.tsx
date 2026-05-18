import React from 'react'
import { Deal } from '../types/deals'

interface DealCardProps {
  deal: Deal
  isSaved: boolean
  onSave: (dealId: string) => void
  onClick: (dealId: string) => void
}

export const DealCard: React.FC<DealCardProps> = ({ deal, isSaved, onSave, onClick }) => {
  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSave(deal.id)
  }

  return (
    <div
      className="card bg-white cursor-pointer"
      onClick={() => onClick(deal.id)}
    >
      <div className="relative">
        <img
          src={deal.image}
          alt={deal.productName}
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
          -{deal.discount}%
        </div>
        <button
          onClick={handleSaveClick}
          className="absolute top-2 left-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
        >
          <svg
            className={`w-5 h-5 ${isSaved ? 'fill-primary' : 'fill-none stroke-primary'}`}
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
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate">{deal.productName}</h3>
        <p className="text-sm text-gray-600 mb-1">{deal.retailer}</p>
        <p className="text-sm text-gray-500 mb-2">{deal.size}</p>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-xl font-bold text-primary">${deal.salePrice.toFixed(2)}</span>
          <span className="text-sm text-gray-500 line-through">${deal.originalPrice.toFixed(2)}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600 gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span>{deal.distance} mi • {deal.location}</span>
        </div>
      </div>
    </div>
  )
}
