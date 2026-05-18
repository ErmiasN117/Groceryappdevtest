export interface Deal {
  id: string
  productName: string
  retailer: string
  originalPrice: number
  salePrice: number
  discount: number
  size: string
  category: string
  image: string
  distance: number
  location: string
  description: string
  expiresAt: string
}

export interface SavedItem {
  id: string
  savedAt: string
  type: 'deal' | 'search'
}
