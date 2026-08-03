'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useLanguage } from '../../context/LanguageContext'
import { ROOMS, Room, formatVND, roomSlug } from '../../data/rooms'
import { Button } from '../../components/common/Button'
import { BookingModal } from '../../components/rooms/BookingModal'
import { ArrowLeft, SlidersHorizontal, Check, Maximize2, Users, Eye } from 'lucide-react'

const FILTERS = [
  { k: 'all', vi: 'Tất cả', en: 'All' },
  { k: 'couple', vi: '2 khách', en: 'For two' },
  { k: 'family', vi: 'Gia đình', en: 'Family' },
  { k: 'suite', vi: 'Suite', en: 'Suites' },
  { k: 'sea', vi: 'View biển', en: 'Sea view' },
]

const SORTS = [
  { k: 'rec', vi: 'Khuyên dùng', en: 'Recommended' },
  { k: 'asc', vi: 'Giá: Thấp đến cao', en: 'Price: Low to High' },
  { k: 'desc', vi: 'Giá: Cao đến thấp', en: 'Price: High to Low' },
  { k: 'area', vi: 'Diện tích rộng nhất', en: 'Largest area' },
]

const FAV_KEY = 'ndh:saved-rooms'

function RoomsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const checkIn = searchParams.get('checkIn') || '15 Th8'
  const checkOut = searchParams.get('checkOut') || '17 Th8'
  const guests = searchParams.get('guests') || '2 người lớn'
  const roomType = searchParams.get('roomType')

  const { t, language } = useLanguage()
  const isEn = language === 'en'

  const [activeFilter, setActiveFilter] = useState('all')
  const [activeSort, setActiveSort] = useState('rec')
  const [favOnly, setFavOnly] = useState(false)
  const [favs, setFavs] = useState<string[]>([])
  const [bookingRoom, setBookingRoom] = useState<Room | null>(null)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  // Sync category filter from query params
  useEffect(() => {
    if (roomType) {
      if (roomType.includes('Rock Deluxe') || roomType.includes('#14')) setActiveFilter('sea')
      else if (roomType.includes('Lục Giác') || roomType.includes('#05')) setActiveFilter('couple')
      else if (roomType.includes('Superior') || roomType.includes('#07')) setActiveFilter('family')
      else if (roomType.includes('Suite') || roomType.includes('#08-09')) setActiveFilter('suite')
    }
  }, [roomType])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAV_KEY)
      if (stored) setFavs(JSON.parse(stored))
    } catch (e) {
      // ignore
    }
  }, [])

  const getVisibleRooms = () => {
    let list = ROOMS.filter((r) => (favOnly ? favs.includes(r.code) : true)).filter((r) => {
      if (activeFilter === 'all') return true
      if (activeFilter === 'sea') return /biển|sea/i.test(r.view)
      return r.group === activeFilter
    })

    if (activeSort === 'asc') list = [...list].sort((a, b) => a.price - b.price)
    else if (activeSort === 'desc') list = [...list].sort((a, b) => b.price - a.price)
    else if (activeSort === 'area') list = [...list].sort((a, b) => b.area - a.area)
    else list = [...list].sort((a, b) => (b.hot || 0) - (a.hot || 0))

    return list
  }

  const visibleRooms = getVisibleRooms()
  const minPrice = visibleRooms.length > 0 ? Math.min(...visibleRooms.map((r) => r.price)) : 2300000

  return (
    <main className="min-h-screen bg-[#FAFAF8] text-[#1A1A1A] pt-14 pb-20 sm:pb-10">
      
      {/* 1. Mobile Search Bar Header */}
      <div className="bg-white border-b border-[#ECECEC] sticky top-12 z-40 px-4 py-2.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-8 h-8 rounded-full bg-[#F5F7FA] flex items-center justify-center text-[#1A1A1A] hover:bg-[#E5E7EB] transition">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="text-xs sm:text-sm font-semibold text-[#1A1A1A] flex items-center gap-1.5">
              <span>{checkIn} - {checkOut}</span>
              <span className="text-[#6B7280]">|</span>
              <span>{guests}</span>
            </div>
          </div>
        </div>
        <Link href="/?openSearch=true" className="text-xs font-semibold text-[#1D4E89] hover:underline">
          {t('Thay đổi', 'Change')}
        </Link>
      </div>

      {/* 2. Sub-header: Results count & Sort/Filter Trigger */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <span className="text-xs sm:text-sm font-semibold text-[#4B5563]">
          {visibleRooms.length} {t('phòng phù hợp', 'matching rooms')}
        </span>
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="flex items-center gap-1.5 bg-white border border-[#ECECEC] text-xs font-medium px-3 py-1.5 rounded-[6px] shadow-2xs hover:bg-[#F5F7FA] transition"
        >
          <span>{t('Sắp xếp', 'Sort & Filter')}</span>
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#1D4E89]" />
        </button>
      </div>

      {/* 3. Room List (Divider-separated cards, borderless & paddingless per feedback) */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 divide-y divide-[#ECECEC]">
        {visibleRooms.map((r) => {
          return (
            <div
              key={r.code}
              onClick={() => router.push(`/rooms/${roomSlug(r.code)}`)}
              className="py-3.5 sm:py-4 cursor-pointer flex flex-row gap-3 sm:gap-4 items-stretch group"
            >
              {/* Image Banner (No heart overlay button) */}
              <div className="relative w-[115px] sm:w-56 md:w-64 aspect-[4/3] rounded-[10px] overflow-hidden bg-[#F5F7FA] shrink-0">
                <img
                  src={r.images?.[0] || 'https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/cover6.jpg'}
                  alt={r.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Room Code Badge */}
                <span className="absolute top-1.5 left-1.5 bg-[#1A1A1A]/80 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px]">
                  {r.code}
                </span>
              </div>

              {/* Info Body (Normalized uniform dark icon colors) */}
              <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                <div>
                  <h2 className="font-serif text-xs sm:text-base font-bold text-[#1A1A1A] group-hover:text-[#1D4E89] transition-colors leading-tight truncate">
                    {isEn ? r.nameEn : r.name}
                  </h2>

                  {/* Room Specs Row with Uniform Dark Icons */}
                  <div className="flex items-center gap-2.5 text-[10px] sm:text-xs text-[#4B5563] font-normal mt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Maximize2 className="w-3 h-3 text-[#4B5563]" />
                      {r.area}m²
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-[#4B5563]" />
                      1 {t('giường đôi', 'double bed')}
                    </span>
                    <span className="hidden sm:flex items-center gap-1">
                      <Eye className="w-3 h-3 text-[#4B5563]" />
                      {isEn ? r.viewEn : r.view}
                    </span>
                  </div>

                  {/* Included Perks List with Uniform Dark Icons */}
                  <div className="mt-1.5 space-y-0.5">
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-[#4B5563] font-medium">
                      <Check className="w-3 h-3 text-[#1D4E89] shrink-0" />
                      <span>{t('Bữa sáng miễn phí', 'Free Breakfast')}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-[#4B5563] font-medium">
                      <Check className="w-3 h-3 text-[#1D4E89] shrink-0" />
                      <span>{t('Wifi miễn phí', 'Free Wifi')}</span>
                    </div>
                  </div>
                </div>

                {/* Price & Compact xs Select Button (Reduced 1 level height) */}
                <div className="pt-1.5 border-t border-[#F5F7FA] flex items-center justify-between mt-1">
                  <div className="flex items-baseline gap-0.5">
                    <span className="font-bold text-xs sm:text-base text-[#0F2D52]">
                      {formatVND(r.price)}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-[#6B7280]">/{t('đêm', 'night')}</span>
                  </div>

                  <Link href={`/rooms/${roomSlug(r.code)}`} onClick={(e) => e.stopPropagation()}>
                    <Button variant="primary" size="xs" radius="6px">
                      {t('Chọn', 'Select')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 4. Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-[#ECECEC] p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-40 flex items-center justify-between sm:hidden">
        <div>
          <span className="text-[10px] text-[#6B7280] block leading-none">{t('Từ', 'From')}</span>
          <span className="font-bold text-base text-[#0F2D52]">
            {formatVND(minPrice)}
          </span>
          <span className="text-[10px] text-[#6B7280]">/{t('đêm', 'night')}</span>
        </div>
        <Button
          variant="primary"
          size="md"
          radius="6px"
          onClick={() => {
            if (visibleRooms[0]) router.push(`/rooms/${roomSlug(visibleRooms[0].code)}`)
          }}
        >
          {t('Xem phòng', 'View Room')}
        </Button>
      </div>

      {/* 5. Filter & Sort Modal */}
      {isFilterModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setIsFilterModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-t-[20px] sm:rounded-[20px] p-5 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#ECECEC]">
              <h3 className="font-serif font-bold text-base text-[#1A1A1A]">
                {t('Sắp xếp & Bộ lọc', 'Sort & Filter')}
              </h3>
              <button onClick={() => setIsFilterModalOpen(false)} className="text-xs font-semibold text-[#6B7280]">
                ✕
              </button>
            </div>

            {/* Category Filter Pills Inside Modal */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider block">
                {t('Danh mục phòng', 'Room Category')}
              </span>
              <div className="flex flex-wrap gap-2">
                {FILTERS.map((f) => {
                  const active = activeFilter === f.k
                  return (
                    <button
                      key={f.k}
                      onClick={() => setActiveFilter(f.k)}
                      className={`px-3 py-1.5 rounded-[6px] text-xs font-medium transition ${
                        active
                          ? 'bg-[#1D4E89] text-white shadow-2xs'
                          : 'bg-white text-[#4B5563] border border-[#ECECEC] hover:bg-[#F5F7FA]'
                      }`}
                    >
                      {isEn ? f.en : f.vi}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Sort Options */}
            <div className="space-y-2 pt-2 border-t border-[#ECECEC]">
              <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider block">
                {t('Sắp xếp theo', 'Sort by')}
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {SORTS.map((s) => (
                  <button
                    key={s.k}
                    onClick={() => {
                      setActiveSort(s.k)
                      setIsFilterModalOpen(false)
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-[8px] text-xs font-medium text-left border transition ${
                      activeSort === s.k
                        ? 'border-[#1D4E89] bg-[#1D4E89]/5 text-[#1D4E89] font-semibold'
                        : 'border-[#ECECEC] text-[#4B5563] hover:bg-[#F5F7FA]'
                    }`}
                  >
                    <span>{isEn ? s.en : s.vi}</span>
                    {activeSort === s.k && <Check className="w-4 h-4 text-[#1D4E89]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <div className="pt-3 border-t border-[#ECECEC]">
              <Button variant="primary" size="md" fullWidth radius="6px" onClick={() => setIsFilterModalOpen(false)}>
                {t(`Áp dụng (${visibleRooms.length} phòng)`, `Apply (${visibleRooms.length} rooms)`)}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal fallback */}
      {bookingRoom && <BookingModal room={bookingRoom} onClose={() => setBookingRoom(null)} />}
    </main>
  )
}

export default function RoomsPage() {
  return (
    <Suspense fallback={<div className="pt-24 text-center text-xs text-[#6B7280]">Đang tải danh sách phòng...</div>}>
      <RoomsContent />
    </Suspense>
  )
}
