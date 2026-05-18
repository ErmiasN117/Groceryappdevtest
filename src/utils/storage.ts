const SAVED_DEALS_KEY = 'prox_saved_deals'

export const saveToLocalStorage = (dealId: string) => {
  try {
    const saved = getSavedDealsFromLocalStorage()
    if (!saved.includes(dealId)) {
      saved.push(dealId)
      localStorage.setItem(SAVED_DEALS_KEY, JSON.stringify(saved))
    }
  } catch (error) {
    console.error('Error saving to local storage:', error)
  }
}

export const removeFromLocalStorage = (dealId: string) => {
  try {
    const saved = getSavedDealsFromLocalStorage()
    const filtered = saved.filter(id => id !== dealId)
    localStorage.setItem(SAVED_DEALS_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('Error removing from local storage:', error)
  }
}

export const getSavedDealsFromLocalStorage = (): string[] => {
  try {
    const saved = localStorage.getItem(SAVED_DEALS_KEY)
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.error('Error reading from local storage:', error)
    return []
  }
}

export const isSavedInLocalStorage = (dealId: string): boolean => {
  const saved = getSavedDealsFromLocalStorage()
  return saved.includes(dealId)
}
