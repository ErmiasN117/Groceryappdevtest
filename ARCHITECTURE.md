# Prox Deals App - Architecture & Design Document

## Executive Summary

The Prox Deals mobile app is a React + TypeScript prototype demonstrating a modern, mobile-first approach to grocery deal discovery. The architecture prioritizes user experience, code maintainability, and performance while keeping implementation simple enough for rapid prototyping.

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Browser                          │
├─────────────────────────────────────────────────────┤
│                   React App (18.2)                  │
│  ┌────────────────────────────────────────────┐   │
│  │         App.tsx (Navigation Hub)           │   │
│  │  - Route management (deals/detail/saved)   │   │
│  │  - Screen state machine                    │   │
│  └────────────────────────────────────────────┘   │
│         ↓              ↓              ↓             │
│  ┌────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ DealsList  │  │  DealDetail  │  │ SavedDeals │ │
│  └────────────┘  └──────────────┘  └────────────┘ │
│         ↓              ↓              ↓             │
│  ┌────────────────────────────────────────────┐   │
│  │          useSavedDeals Hook                │   │
│  │  - Manage saved state                      │   │
│  │  - Persist to localStorage                 │   │
│  └────────────────────────────────────────────┘   │
│         ↓                                          │
│  ┌────────────────────────────────────────────┐   │
│  │        Browser localStorage                │   │
│  │   Key: prox_saved_deals                    │   │
│  │   Value: ["1", "3", "5"]                   │   │
│  └────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## Data Flow

### Deal Discovery Flow
```
User Opens App
    ↓
DealsList Renders
    ↓
Search/Filter Active
    ↓
useMemo Recalculates Results
    ↓
User Sees Filtered Results
    ↓
User Clicks Deal Card
    ↓
App Routes to DealDetail
```

### Save/Unsave Flow
```
User Clicks Bookmark Icon
    ↓
toggleSave() Called
    ↓
State Updated in useSavedDeals
    ↓
saveToLocalStorage/removeFromLocalStorage
    ↓
localStorage Updated
    ↓
Component Re-renders
    ↓
User Sees Updated UI
```

## Component Hierarchy

```
App
├── Header
│   └── Branding
├── Main
│   ├── DealsList (Screen 1)
│   │   ├── SearchBar
│   │   ├── Filters
│   │   │   ├── CategoryFilter
│   │   │   └── SortSelect
│   │   └── DealGrid
│   │       └── DealCard[] (repeating)
│   │           ├── Image
│   │           ├── Bookmark Button
│   │           ├── ProductInfo
│   │           ├── Pricing
│   │           └── Location
│   ├── DealDetail (Screen 2)
│   │   ├── BackButton
│   │   ├── Image
│   │   ├── ProductInfo
│   │   ├── PricingDetails
│   │   ├── LocationInfo
│   │   └── SaveButton
│   └── SavedDeals (Screen 3)
│       ├── SavedCount Badge
│       └── DealGrid
│           └── DealCard[] (filtered)
└── BottomNav / TopNav
    ├── DealsLink
    └── SavedLink
```

## State Management Strategy

### Why This Approach?

We use React hooks + localStorage instead of Redux/Context for:
1. **Simplicity**: No boilerplate, easy to understand
2. **Performance**: No unnecessary re-renders across tree
3. **Bundle Size**: ~5KB vs Redux ~50KB
4. **Maintainability**: All save logic in one place

### State Patterns

#### Local Component State
```typescript
// DealsList.tsx
const [searchQuery, setSearchQuery] = useState('')
const [selectedCategory, setSelectedCategory] = useState('All')
const [sortBy, setSortBy] = useState('discount')
```
- Encapsulated within component
- UI-only, not persisted
- Re-computed on every change

#### Custom Hook State
```typescript
// useSavedDeals.ts
const [savedIds, setSavedIds] = useState<string[]>([])
const [isLoading, setIsLoading] = useState(true)
```
- Shared between components (DealCard, DealDetail, SavedDeals)
- Persisted to localStorage
- Lazy-loaded on mount

#### Computed State
```typescript
const filteredAndSortedDeals = useMemo(() => {
  // Expensive computation
}, [searchQuery, selectedCategory, sortBy])
```
- Only recomputed when dependencies change
- Prevents unnecessary filtering/sorting

## Performance Optimizations

### Rendering Optimizations
1. **useMemo**: Prevents recomputation of filtered/sorted deals
2. **useCallback**: Event handlers maintain referential equality
3. **React.memo**: DealCard could wrap in memo if list gets large

### Data Structure
- Flat array of deals (not nested)
- IDs as strings for easy localStorage serialization
- Denormalized data (no joins needed)

### Bundle Size
- React 18: ~40KB (minified)
- Tailwind: ~50KB (minified, purged)
- Total: ~90-100KB gzipped

### Future Optimizations
- Code splitting by route
- Lazy load images
- Service Worker for offline support
- Virtual scrolling for 1000+ deals

## localStorage Implementation

### Schema
```javascript
{
  "prox_saved_deals": "[\"1\", \"3\", \"5\", \"7\"]"
}
```

### API
```typescript
// Read
const saved = JSON.parse(
  localStorage.getItem('prox_saved_deals') || '[]'
)

// Write
localStorage.setItem('prox_saved_deals', 
  JSON.stringify(updated)
)
```

### Limits & Considerations
- Storage limit: ~5-10MB depending on browser
- Our use case: ~200 bytes max (need <1KB)
- No cleanup needed for this prototype

### Migration Path
If data grows beyond localStorage:
- IndexedDB: For larger datasets
- Service Worker: Offline support
- Backend API: Cross-device sync

## Error Handling Strategy

### Current Implementation
```typescript
try {
  // localStorage operation
} catch (error) {
  console.error('Error:', error)
  // Gracefully degrade
}
```

### Future Improvements
- Error boundaries for React errors
- Sentry integration for production monitoring
- User-facing error messages
- Retry logic for API calls

## Responsive Design Approach

### Mobile First
```css
/* Base: mobile (320px+) */
.card { @apply rounded-lg shadow-md; }

/* Tablet (768px+) */
@media (min-width: 768px) {
  .grid { @apply grid-cols-2; }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .grid { @apply grid-cols-3; }
}
```

### Breakpoints
- sm: 640px (tablets)
- md: 768px (larger tablets)
- lg: 1024px (desktops)
- xl: 1280px (large desktops)

### Touch Optimization
- Min 44px tap targets (iOS guideline)
- No hover-only interactions
- Full-width buttons on mobile
- Bottom navigation avoids thumb scroll area

## Security Considerations

### Current State
✅ **Safe:**
- No authentication needed (public demo)
- No user data collected
- No backend calls
- localStorage is browser-sandboxed

⚠️ **To Address Before Production:**
- XSS prevention (React auto-escapes)
- CSRF protection (if using backend API)
- Rate limiting (if using backend)
- HTTPS enforced
- Content Security Policy headers

## Testing Strategy

### Unit Tests
```typescript
// Test custom hooks
it('should save deal', () => {
  const { result } = renderHook(() => useSavedDeals())
  act(() => result.current.toggleSave('1'))
  expect(result.current.isSaved('1')).toBe(true)
})
```

### Component Tests
```typescript
// Test DealCard rendering
it('should render deal information', () => {
  render(<DealCard deal={mockDeal} ... />)
  expect(screen.getByText('Organic Bananas')).toBeInTheDocument()
})
```

### Integration Tests
```typescript
// Test full user flow
it('should save and retrieve deals', () => {
  // 1. Render app
  // 2. Find and save deal
  // 3. Navigate to SavedDeals
  // 4. Verify deal appears
})
```

### E2E Tests (Cypress)
```typescript
it('should complete deal discovery flow', () => {
  cy.visit('/')
  cy.get('[data-testid=search-input]').type('Bananas')
  cy.get('[data-testid=deal-card]').first().click()
  cy.get('[data-testid=save-button]').click()
  cy.get('[data-testid=nav-saved]').click()
  cy.contains('Organic Bananas').should('be.visible')
})
```

## Scaling Architecture

### Phase 1: Current (Prototype)
- React + localStorage
- Mock data
- Single user, single device

### Phase 2: Real-Time Data (1-2 weeks)
```
React App → JSON API → Mock Database
  ↓
Local State + API Cache
  ↓
localStorage
```

### Phase 3: User Accounts (1 month)
```
React App
  ↓
Authentication Service (Auth0)
  ↓
Backend API (Node.js)
  ↓
PostgreSQL Database
  ↓
localStorage (cache layer)
```

### Phase 4: Full Platform (2-3 months)
```
                    ┌─── Grocery API
                    │
React Web App ────  Backend ──── PostgreSQL
                    │     ↓
React Native App ──  Redis (cache)
                    │
Admin Dashboard ──   ↑
                    
                    Microservices:
                    - Deal Service
                    - User Service
                    - Location Service
                    - Notification Service
```

## API Integration Plan

### Current (Mock)
```typescript
const deals = mockDeals
```

### Next (Simple Backend)
```typescript
const response = await fetch('/api/deals')
const deals = await response.json()
```

### With Search
```typescript
const response = await fetch(
  `/api/deals?q=${query}&category=${cat}&lat=${lat}&lng=${lng}`
)
```

## Real-World Considerations

### Grocery Deal Data Sources
1. **Retailer APIs**: Whole Foods, Trader Joe's, Kroger, Sprouts
2. **Third-party services**: ShopRite API, Basket (food platform)
3. **Web scraping**: Monitor retailer sites for deals
4. **User submissions**: Community-driven deals

### Geolocation
```typescript
// Get user location
navigator.geolocation.getCurrentPosition(pos => {
  const { latitude, longitude } = pos.coords
  // Filter deals by distance
})
```

### Real-Time Updates
```typescript
// WebSocket for live deal updates
const ws = new WebSocket('wss://api.example.com/deals')
ws.onmessage = (event) => {
  const newDeal = JSON.parse(event.data)
  setDeals(prev => [newDeal, ...prev])
}
```

## Known Limitations & Future Work

### Limitations
1. **Mock data**: Only 10 deals, not real grocery data
2. **No real-time**: Data doesn't update from retailers
3. **No locations**: Distance calculation is static
4. **No sync**: Saves only on current device
5. **No notifications**: Can't alert users of price drops

### Future Improvements (Priority Order)
1. **Backend integration** (enables real data)
2. **User authentication** (enables sync)
3. **Notifications** (drives engagement)
4. **Personalization** (improves relevance)
5. **Social sharing** (increases virality)
6. **Receipt scanning** (tracks actual savings)

## Deployment Architecture

### Development
```
Local Dev → npm run dev → http://localhost:5173
```

### Production
```
GitHub → GitHub Actions → Build & Test → Vercel → CDN → Users
    ↓
    Automatic deployment on push to main
```

### Monitoring
```
Production App → Sentry (errors) + Vercel Analytics
                ↓
                Alert on critical errors
                ↓
                Developer notification
```

## Conclusion

This architecture demonstrates:
- ✅ Clean separation of concerns
- ✅ Scalable component structure
- ✅ Efficient state management
- ✅ Mobile-first responsive design
- ✅ Production-ready code quality
- ✅ Clear path to scaling

The foundation is solid for rapid iteration and feature development.
