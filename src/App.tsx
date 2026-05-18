import React, { useState } from 'react'
import './index.css'
import { DealsList } from './components/DealsList'
import { DealDetail } from './components/DealDetail'
import { SavedDeals } from './components/SavedDeals'

type Screen = 'deals' | 'detail' | 'saved'

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('deals')
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null)

  const handleSelectDeal = (dealId: string) => {
    setSelectedDealId(dealId)
    setCurrentScreen('detail')
    window.scrollTo(0, 0)
  }

  const handleBackFromDetail = () => {
    setCurrentScreen('deals')
    setSelectedDealId(null)
  }

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen)
    window.scrollTo(0, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg">
                P
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Prox</h1>
                <p className="text-xs text-gray-500">Grocery Deals</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Save on groceries
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {currentScreen === 'deals' && (
          <DealsList onSelectDeal={handleSelectDeal} />
        )}
        {currentScreen === 'detail' && selectedDealId && (
          <DealDetail dealId={selectedDealId} onBack={handleBackFromDetail} />
        )}
        {currentScreen === 'saved' && (
          <SavedDeals onSelectDeal={handleSelectDeal} />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg sm:hidden">
        <div className="flex justify-around">
          <button
            onClick={() => handleNavigate('deals')}
            className={`flex-1 py-4 px-4 flex flex-col items-center gap-1 transition-colors ${
              currentScreen === 'deals'
                ? 'text-primary border-t-2 border-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 100-2h-1.017A6 6 0 119.02 4H15a1 1 0 100 2h-4.975A6 6 0 1015 8z" />
            </svg>
            <span className="text-xs font-medium">Deals</span>
          </button>
          <button
            onClick={() => handleNavigate('saved')}
            className={`flex-1 py-4 px-4 flex flex-col items-center gap-1 transition-colors ${
              currentScreen === 'saved'
                ? 'text-primary border-t-2 border-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
            <span className="text-xs font-medium">Saved</span>
          </button>
        </div>
      </nav>

      {/* Desktop Navigation */}
      <nav className="hidden sm:block fixed top-20 right-6 z-20">
        <div className="flex gap-2">
          <button
            onClick={() => handleNavigate('deals')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              currentScreen === 'deals'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Browse Deals
          </button>
          <button
            onClick={() => handleNavigate('saved')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              currentScreen === 'saved'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Saved Deals
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Padding */}
      <div className="h-20 sm:h-0" />
    </div>
  )
}

export default App
