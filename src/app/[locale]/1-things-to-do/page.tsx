"use client"

import { useSearchParams } from 'next/navigation'

import FloatingChat from '@/app/components/FloatingChat'
import Footer from '@/app/components/Footer'
import PhoGroupHero from '@/app/components/PhoGroupHero'
import ThingsCard from '@/app/components/ThingsCard'
import ThingsFilterBar from '@/app/components/ThingsFilterBar'
import { ThingItem, thingsMock } from './mockData'

function useFilters() {
  const searchParams = useSearchParams()
  const cats = searchParams.get('cats')?.split(',').filter(Boolean) ?? []
  const date = searchParams.get('date') ?? undefined
  const price = searchParams.get('price') ?? undefined
  const rating = searchParams.get('rating') ?? undefined
  const sort = searchParams.get('sort') ?? undefined
  return { cats, date, price, rating, sort }
}

function applyFilters(items: ThingItem[], cats: string[], date?: string, price?: string, rating?: string) {
  let result = items

  // Category filter
  if (cats.length) {
    const set = new Set(cats)
    result = result.filter((it) => it.tags?.some((t) => set.has(t)))
  }

  // Date filter
  if (date) {
    result = result.filter((it) => !it.availableDates || it.availableDates.length === 0 || it.availableDates.includes(date))
  }

  // Price filter
  if (price) {
    const priceRanges = {
      '0-500k': { min: 0, max: 500000 },
      '500k-1m': { min: 500000, max: 1000000 },
      '1m-2m': { min: 1000000, max: 2000000 },
      '2m+': { min: 2000000, max: Infinity }
    }
    const range = priceRanges[price as keyof typeof priceRanges]
    if (range) {
      result = result.filter((it) => it.price >= range.min && it.price <= range.max)
    }
  }

  // Rating filter
  if (rating) {
    const ratingThresholds = {
      '4+': 4.0,
      '4.5+': 4.5,
      '4.8+': 4.8
    }
    const threshold = ratingThresholds[rating as keyof typeof ratingThresholds]
    if (threshold) {
      result = result.filter((it) => it.rating >= threshold)
    }
  }

  return result
}

function applySorting(items: ThingItem[], sort?: string) {
  const sorted = [...items]

  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'rating-desc':
      return sorted.sort((a, b) => b.rating - a.rating)
    case 'reviews-desc':
      return sorted.sort((a, b) => b.reviews - a.reviews)
    case 'popular':
      return sorted.sort((a, b) => {
        const aBookings = parseInt(a.bookings?.replace(/[^\d]/g, '') || '0')
        const bBookings = parseInt(b.bookings?.replace(/[^\d]/g, '') || '0')
        return bBookings - aBookings
      })
    default:
      // Default sort: mix of rating and popularity
      return sorted.sort((a, b) => {
        const aScore = a.rating * 0.7 + (parseInt(a.bookings?.replace(/[^\d]/g, '') || '0') / 1000) * 0.3
        const bScore = b.rating * 0.7 + (parseInt(b.bookings?.replace(/[^\d]/g, '') || '0') / 1000) * 0.3
        return bScore - aScore
      })
  }
}

export default function ThingsToDoPage() {
  const { cats, date, price, rating, sort } = useFilters()
  const filtered = applyFilters(thingsMock, cats, date, price, rating)
  const sorted = applySorting(filtered, sort)

  return (
    <>
      {/* Breadcrumbs */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="text-sm text-gray-500 flex items-center gap-1">
            <span className="hover:text-gray-700">Trang chủ</span>
            <span>›</span>
            <span>Việt Nam</span>
            <span>›</span>
            <strong className="text-gray-700">Phú Quốc</strong>
          </nav>
        </div>
      </section>

      <PhoGroupHero activeTab="things" />

      <main>
        <ThingsFilterBar />

        <section className="py-8 bg-gradient-to-br from-gray-50 via-orange-50/30 to-pink-50/30 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm">
                <p className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  {sorted.length} hoạt động tại Phú Quốc
                </p>
                {(cats.length > 0 || date || price || rating) && (
                  <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                    <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                    </svg>
                    {[...cats, date, price, rating].filter(Boolean).length} bộ lọc đã áp dụng
                  </p>
                )}
              </div>
              {/* Sort options */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 hidden sm:block font-medium">Sắp xếp:</span>
                <select
                  value={sort || ''}
                  className="border-2 border-white bg-white/90 backdrop-blur-sm rounded-xl text-sm px-4 py-2 hover:border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent min-w-[140px] shadow-sm font-medium"
                  onChange={(e) => {
                    const params = new URLSearchParams(window.location.search)
                    if (e.target.value) params.set('sort', e.target.value)
                    else params.delete('sort')
                    const newUrl = `${window.location.pathname}?${params.toString()}`
                    window.history.pushState({}, '', newUrl)
                  }}
                >
                  <option value="">✨ Đề xuất</option>
                  <option value="price-asc">💰 Giá thấp → cao</option>
                  <option value="price-desc">💎 Giá cao → thấp</option>
                  <option value="rating-desc">⭐ Đánh giá cao nhất</option>
                  <option value="reviews-desc">🔥 Phổ biến nhất</option>
                  <option value="popular">🎯 Nhiều đặt nhất</option>
                </select>
              </div>
            </div>

            {sorted.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sorted.map((item, index) => (
                  <div
                    key={item.id}
                    className="animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ThingsCard item={item} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="mx-auto max-w-md bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Không tìm thấy hoạt động</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Không có hoạt động nào phù hợp với tiêu chí lọc của bạn.
                    Hãy thử điều chỉnh bộ lọc hoặc xóa một số điều kiện.
                  </p>
                  <button
                    onClick={() => {
                      const params = new URLSearchParams()
                      window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`)
                      window.location.reload()
                    }}
                    className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all transform hover:scale-105"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Xóa tất cả bộ lọc
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Mobile Floating Filter Button */}
      <div className="fixed bottom-6 right-6 md:hidden z-40">
        <button
          onClick={() => {
            // Trigger filter modal - we'll need to pass this through context or props
            const filterButton = document.querySelector('[data-filter-modal-trigger]') as HTMLButtonElement
            if (filterButton) filterButton.click()
          }}
          className="w-14 h-14 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 flex items-center justify-center group"
        >
          <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <Footer />
      <FloatingChat />
    </>
  )
}
