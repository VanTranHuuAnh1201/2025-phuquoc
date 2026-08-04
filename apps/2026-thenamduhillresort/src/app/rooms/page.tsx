'use client'

import { UI } from '@repo/core'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useLanguage } from '../../context/LanguageContext'
import { ROOMS, Room, formatVND, roomSlug } from '../../data/rooms'
import { Button } from '../../components/common/Button'
import { BookingModal } from '../../components/rooms/BookingModal'
import { ArrowLeft, SlidersHorizontal, Check, Maximize2, Users } from 'lucide-react'

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

function RoomsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const checkIn = searchParams.get('checkIn') || '15 Th8'
  const checkOut = searchParams.get('checkOut') || '17 Th8'
  const guests = searchParams.get('guests') || '2 người lớn'
  const roomType = searchParams.get('roomType')

  const { t, language, tx } = useLanguage()
  const isEn = language === 'en'

  const [activeFilter, setActiveFilter] = useState('all')
  const [activeSort, setActiveSort] = useState('rec')
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

  const getVisibleRooms = () => {
    let list = ROOMS.filter((r) => {
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
    <main className="min-h-screen bg-[#FAFAF8] text-[#1A1A1A] pt-16 pb-20 sm:pb-12">
      
      {/* 📱 1. MOBILE ONLY SEARCH BAR & HEADER (100% Intact Mobile View) */}
      <div className="block md:hidden">
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
            {tx(UI.change)}
          </Link>
        </div>

        <div className="max-w-[1280px] mx-auto px-4 py-3.5 flex items-center justify-between">
          <span className="text-xs font-semibold text-[#4B5563]">
            {visibleRooms.length} {tx(UI.matchingRooms)}
          </span>
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-1.5 bg-white border border-[#ECECEC] text-xs font-medium px-3 py-1.5 rounded-[6px] shadow-2xs hover:bg-[#F5F7FA] transition"
          >
            <span>{tx(UI.sortFilter)}</span>
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#1D4E89]" />
          </button>
        </div>

        {/* Mobile Room List */}
        <div className="px-4 divide-y divide-[#ECECEC]">
          {visibleRooms.map((r) => (
            <div
              key={r.code}
              onClick={() => router.push(`/rooms/${roomSlug(r.code)}`)}
              className="py-3.5 cursor-pointer flex flex-row gap-3 items-stretch group"
            >
              <div className="relative w-[115px] aspect-[4/3] rounded-[10px] overflow-hidden bg-[#F5F7FA] shrink-0">
                <img
                  src={r.images?.[0] || 'https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/cover6.jpg'}
                  alt={r.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-1.5 left-1.5 bg-[#1A1A1A]/80 backdrop-blur-md text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-[4px]">
                  {r.code}
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                <div>
                  <h2 className="font-serif text-xs font-bold text-[#1A1A1A] group-hover:text-[#1D4E89] transition-colors leading-tight truncate">
                    {isEn ? r.nameEn : r.name}
                  </h2>
                  <div className="flex items-center gap-2.5 text-[10px] text-[#4B5563] font-normal mt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Maximize2 className="w-3 h-3 text-[#4B5563]" />
                      {r.area}m²
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-[#4B5563]" />
                      1 {tx(UI.doubleBed)}
                    </span>
                  </div>
                  <div className="mt-1.5 space-y-0.5">
                    <div className="flex items-center gap-1 text-[10px] text-[#4B5563] font-medium">
                      <Check className="w-3 h-3 text-[#1D4E89] shrink-0" />
                      <span>{tx(UI.freeBreakfast)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-1.5 border-t border-[#F5F7FA] flex items-center justify-between mt-1">
                  <div className="flex items-baseline gap-0.5">
                    <span className="font-bold text-xs text-[#0F2D52]">
                      {formatVND(r.price)}
                    </span>
                    <span className="text-[9px] text-[#6B7280]">/{tx(UI.nights)}</span>
                  </div>
                  <Link href={`/rooms/${roomSlug(r.code)}`} onClick={(e) => e.stopPropagation()}>
                    <Button variant="primary" size="xs" radius="6px">
                      {tx(UI.select)}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🖥️ 2. DESKTOP ONLY SEARCH & 2-COLUMN LAYOUT (Figma 3-desktop.png Section 02) */}
      <div className="hidden md:block max-w-[1280px] mx-auto px-6 lg:px-8 space-y-6 pt-4">
        
        {/* Desktop Header & Search Bar Card */}
        <div className="space-y-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-[#1A1A1A]">
              {tx(UI.roomTypes)}
            </h1>
            <p className="text-sm text-[#6B7280] mt-1">
              {tx(UI.selectTheRoomThatBestFits)}
            </p>
          </div>

          {/* Desktop Search Inputs Bar */}
          <div className="bg-white rounded-[12px] p-3 border border-[#ECECEC] shadow-sm flex items-center gap-3">
            <div className="flex-1 px-4 py-2 bg-[#FAFAF8] rounded-[8px] border border-[#E5E7EB] flex items-center justify-between text-sm">
              <span className="font-semibold text-[#1A1A1A]">15/08/2025</span>
              <span className="text-[#6B7280]">|</span>
              <span className="font-semibold text-[#1A1A1A]">17/08/2025</span>
            </div>
            <div className="flex-1 px-4 py-2 bg-[#FAFAF8] rounded-[8px] border border-[#E5E7EB] flex items-center justify-between text-sm">
              <span className="font-semibold text-[#1A1A1A]">{guests}</span>
              <span className="text-xs text-[#6B7280]">▼</span>
            </div>
            <Button variant="primary" size="md" radius="8px" className="px-8 bg-[#0F2D52] hover:bg-[#163B6C]">
              {tx(UI.search)}
            </Button>
          </div>
        </div>

        {/* 2-Column Grid: Left Filter Sidebar + Right Room Cards List */}
        <div className="flex gap-8 items-start">
          
          {/* Left Sidebar Filters */}
          <div className="w-[260px] bg-white rounded-[12px] border border-[#ECECEC] p-5 space-y-6 shrink-0 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#ECECEC] pb-3">
              <h3 className="font-bold text-sm text-[#1A1A1A]">{tx(UI.filters)}</h3>
              <button
                onClick={() => setActiveFilter('all')}
                className="text-xs font-semibold text-[#1D4E89] hover:underline"
              >
                {tx(UI.clearAll)}
              </button>
            </div>

            {/* Room Categories */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider block">
                {tx(UI.roomType)}
              </span>
              <div className="space-y-2 text-xs">
                {[
                  { k: 'all', label: `Tất cả (${ROOMS.length})` },
                  { k: 'couple', label: 'Deluxe (4)' },
                  { k: 'sea', label: 'Villa (4)' },
                  { k: 'suite', label: 'Suite (3)' },
                  { k: 'family', label: 'Family (1)' },
                ].map((cat) => (
                  <label
                    key={cat.k}
                    onClick={() => setActiveFilter(cat.k)}
                    className="flex items-center gap-2 text-[#4B5563] cursor-pointer hover:text-[#1A1A1A]"
                  >
                    <input
                      type="checkbox"
                      checked={activeFilter === cat.k}
                      onChange={() => {}}
                      className="rounded border-[#E5E7EB] text-[#1D4E89] focus:ring-0"
                    />
                    <span>{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-2.5 border-t border-[#ECECEC] pt-4">
              <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider block">
                {tx(UI.priceRangeNight)}
              </span>
              <input type="range" min="2000000" max="5000000" className="w-full accent-[#1D4E89]" />
              <div className="flex justify-between text-[11px] text-[#6B7280] font-medium">
                <span>2.000.000đ</span>
                <span>5.000.000đ</span>
              </div>
            </div>

            {/* Amenities Checkboxes */}
            <div className="space-y-2.5 border-t border-[#ECECEC] pt-4">
              <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider block">
                {tx(UI.amenities)}
              </span>
              <div className="space-y-2 text-xs">
                {['Wi-Fi miễn phí', 'Hồ bơi', 'View biển', 'Ban công', 'Bồn tắm', 'Đưa đón sân bay'].map((item, idx) => (
                  <label key={idx} className="flex items-center gap-2 text-[#4B5563] cursor-pointer hover:text-[#1A1A1A]">
                    <input type="checkbox" className="rounded border-[#E5E7EB] text-[#1D4E89] focus:ring-0" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sort Dropdown & Desktop Room Cards */}
          <div className="flex-1 space-y-4">
            
            {/* Top Sort Header */}
            <div className="flex justify-end items-center">
              <div className="flex items-center gap-2 text-xs text-[#6B7280] font-medium">
                <span>{tx(UI.sortBy2)}</span>
                <select
                  value={activeSort}
                  onChange={(e) => setActiveSort(e.target.value)}
                  className="bg-white border border-[#ECECEC] rounded-[6px] px-3 py-1.5 text-xs font-semibold text-[#1A1A1A] focus:outline-none cursor-pointer"
                >
                  <option value="rec">{tx(UI.priceLowToHigh)}</option>
                  <option value="asc">{tx(UI.priceLowToHigh)}</option>
                  <option value="desc">{tx(UI.priceHighToLow)}</option>
                  <option value="area">{tx(UI.largestArea)}</option>
                </select>
              </div>
            </div>

            {/* Desktop Room Cards List */}
            <div className="space-y-4">
              {visibleRooms.map((r) => (
                <div
                  key={r.code}
                  className="bg-white rounded-[12px] border border-[#ECECEC] p-4 flex gap-5 hover:shadow-md transition group"
                >
                  {/* Image */}
                  <div className="w-64 aspect-[16/10] rounded-[10px] overflow-hidden bg-[#F5F7FA] shrink-0 relative">
                    <img
                      src={r.images?.[0] || 'https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/cover6.jpg'}
                      alt={r.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 bg-[#1A1A1A]/80 backdrop-blur-md text-white text-xs font-semibold px-2 py-0.5 rounded-[4px]">
                      {r.code}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h2 className="font-serif text-lg font-bold text-[#1A1A1A] group-hover:text-[#1D4E89] transition-colors">
                        {isEn ? r.nameEn : r.name}
                      </h2>

                      <div className="flex items-center gap-4 text-xs text-[#6B7280] mt-1 font-medium">
                        <span>📐 {r.area}m²</span>
                        <span>👤 {r.cap} {tx(UI.guests)}</span>
                        <span>🛏️ 1 {tx(UI.doubleBed)}</span>
                        <span>👁️ {isEn ? r.viewEn : r.view}</span>
                      </div>

                      <div className="mt-3 space-y-1 text-xs text-[#1D4E89] font-medium">
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{tx(UI.freeBreakfast)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{tx(UI.freeHighSpeedWiFi)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{tx(UI.freeCancellation)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="w-[180px] flex flex-col justify-between items-end border-l border-[#ECECEC] pl-5 py-1 text-right">
                    <div>
                      <span className="font-bold text-xl text-[#0F2D52] block">
                        {formatVND(r.price)}
                      </span>
                      <span className="text-xs text-[#6B7280]">/{tx(UI.nights)}</span>
                    </div>

                    <Link href={`/rooms/${roomSlug(r.code)}`}>
                      <Button variant="primary" size="md" radius="6px" className="bg-[#0F2D52] hover:bg-[#163B6C] px-6">
                        {tx(UI.viewDetails)}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-[#ECECEC] p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-40 flex items-center justify-between sm:hidden">
        <div>
          <span className="text-[10px] text-[#6B7280] block leading-none">{tx(UI.from)}</span>
          <span className="font-bold text-base text-[#0F2D52]">
            {formatVND(minPrice)}
          </span>
          <span className="text-[10px] text-[#6B7280]">/{tx(UI.nights)}</span>
        </div>
        <Button
          variant="primary"
          size="md"
          radius="6px"
          onClick={() => {
            if (visibleRooms[0]) router.push(`/rooms/${roomSlug(visibleRooms[0].code)}`)
          }}
        >
          {tx(UI.viewRoom)}
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
                {tx(UI.sortFilter2)}
              </h3>
              <button onClick={() => setIsFilterModalOpen(false)} className="text-xs font-semibold text-[#6B7280]">
                ✕
              </button>
            </div>

            {/* Category Filter Pills Inside Modal */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider block">
                {tx(UI.roomCategory)}
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
                {tx(UI.sortBy)}
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
