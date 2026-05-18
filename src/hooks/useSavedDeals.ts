import { useState, useCallback, useEffect } from 'react'
import { getSavedDealsFromLocalStorage, saveToLocalStorage, removeFromLocalStorage } from '../utils/storage'

export const useSavedDeals = () => {
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load saved deals from localStorage on mount
    const saved = getSavedDealsFromLocalStorage()
    setSavedIds(saved)
    setIsLoading(false)
  }, [])

  const toggleSave = useCallback((dealId: string) => {
    setSavedIds(prev => {
      const isCurrentlySaved = prev.includes(dealId)
      if (isCurrentlySaved) {
        removeFromLocalStorage(dealId)
        return prev.filter(id => id !== dealId)
      } else {
        saveToLocalStorage(dealId)
        return [...prev, dealId]
      }
    })
  }, [])

  const isSaved = useCallback((dealId: string) => {
    return savedIds.includes(dealId)
  }, [savedIds])

  return { savedIds, toggleSave, isSaved, isLoading }
}
