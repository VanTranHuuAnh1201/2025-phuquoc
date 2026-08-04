'use client'

import { UI } from '@repo/core'

import {
  Armchair,
  ArrowLeft,
  Ban,
  Bath,
  Bed,
  Calendar,
  Check,
  ChevronRight,
  Coffee,
  CreditCard,
  Eye,
  Flower2,
  Heart,
  Info,
  Share2,
  Shirt,
  Star,
  Users,
  Utensils
} from 'lucide-react'
import Link from 'next/link'
import { use, useState } from 'react'
import { Button } from '../../../components/common/Button'
import { BookingCalendarModal } from '../../../components/modals/BookingCalendarModal'
import { useLanguage } from '../../../context/LanguageContext'
import { ROOMS, Room, formatVND, roomSlug } from '../../../data/rooms'

/** Số đêm giữa hai mốc ISO; tối thiểu 1 để tổng tiền không bao giờ bằng 0. */
function countNights(checkIn: string, checkOut: string) {
  const start = new Date(checkIn).getTime()
  const end = new Date(checkOut).getTime()
  if (Number.isNaN(start) || Number.isNaN(end)) return 1
  return Math.max(1, Math.round((end - start) / 86400000))
}

function formatDisplayDate(iso: string) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return y && m && d ? `${d}/${m}/${y}` : iso
}

interface RoomDetailPageProps {
  params: Promise<{ id: string }>
}

export default function RoomDetailPage({ params }: RoomDetailPageProps) {
  const resolvedParams = use(params)
  const rawId = resolvedParams.id || ''
  const decodedId = decodeURIComponent(rawId).trim()

  // Find room by code, slug or search
  const foundRoom = ROOMS.find((r) => {
    const cleanCode = r.code.replace('#', '').toLowerCase()
    const searchId = decodedId.replace('#', '').toLowerCase()
    return (
      cleanCode === searchId ||
      r.code.toLowerCase() === decodedId.toLowerCase() ||
      roomSlug(r.code).toLowerCase() === searchId ||
      r.name.toLowerCase().includes(searchId)
    )
  })
  const room: Room = (foundRoom || ROOMS[0]) as Room

  const { t, language, tx } = useLanguage()
  const isEn = language === 'en'

  const [currentSlide] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  // Ngày & số khách của khối đặt phòng — sửa qua cùng popup với hero.
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false)
  const [checkIn, setCheckIn] = useState('2026-08-15')
  const [checkOut, setCheckOut] = useState('2026-08-17')
  const [guests, setGuests] = useState('2 khách')
  const nights = countNights(checkIn, checkOut)

  const roomImages = room.images && room.images.length > 0
    ? room.images
    : ['https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/cover6.jpg']

  // Clean Categorized Amenities matching user screenshot format
  const amenityCategories = [
    {
      icon: Bed,
      title: isEn ? 'Bedroom' : 'Phòng ngủ',
      items: isEn
        ? ['Wardrobe or closet', 'Premium bedding', 'Tiled / marble floor']
        : ['Tủ hoặc phòng để quần áo', 'Nệm cao cấp', 'Sàn lát gạch / đá cẩm thạch'],
    },
    {
      icon: Armchair,
      title: isEn ? 'Living Area' : 'Khu vực phòng khách',
      items: isEn ? ['Sofa / Seating area'] : ['Ghế sofa'],
    },
    {
      icon: Utensils,
      title: isEn ? 'Kitchen Facilities' : 'Tiện nghi nhà bếp',
      items: isEn
        ? ['Electric kettle', 'Refrigerator / Minibar']
        : ['Ấm đun nước điện', 'Tủ lạnh / Minibar'],
    },
    {
      icon: Bath,
      title: isEn ? 'Bathroom' : 'Phòng tắm',
      items: isEn
        ? [
          'Bathrobes',
          'Bed linen & towels',
          'Slippers',
          'Toilet paper',
          'Bath towels',
          'Hairdryer',
          'Private bathroom',
          'Shower',
          'Free toiletries',
        ]
        : [
          'Áo choàng tắm',
          'Bộ khăn trải giường',
          'Dép lê',
          'Giấy vệ sinh',
          'Khăn tắm',
          'Máy sấy tóc',
          'Phòng tắm riêng',
          'Vòi sen',
          'Đồ vệ sinh cá nhân miễn phí',
        ],
    },
    {
      icon: Flower2,
      title: isEn ? 'Outdoor & View' : 'Ngoài trời & Tầm nhìn',
      items: isEn
        ? ['Balcony', 'Terrace / Courtyard', room.viewEn || 'Sea view']
        : ['Ban công', 'Sân trong / Sân hiên', room.view || 'Nhìn ra biển'],
    },
    {
      icon: Shirt,
      title: isEn ? 'Room Amenities' : 'Tiện ích trong phòng',
      items: isEn ? ['Drying rack for clothing'] : ['Giá phơi quần áo'],
    },
    {
      icon: Info,
      title: isEn ? 'General' : 'Tổng quát',
      items: isEn
        ? ['Air conditioning', 'Fan', 'Soundproofing', 'Free Wi-Fi', 'Free pier transfer both ways']
        : ['Máy điều hòa', 'Quạt máy', 'Cách âm', 'Wi-Fi miễn phí', 'Xe riêng đưa đón miễn phí bến tàu Củ Tron'],
    },
  ]

  return (
    <main className="min-h-screen bg-white text-[#1A1A1A] pt-12 md:pt-16 pb-20 md:pb-16">

      {/* 📱 1. MOBILE ONLY VIEW (100% Intact Mobile Preservation) */}
      <div className="block md:hidden">
        {/* Full Width Edge-to-Edge Hero Image Banner */}
        <div className="relative w-full aspect-[16/10] bg-[#F5F7FA] overflow-hidden">
          <img
            src={roomImages[0]}
            alt={room.name}
            className="w-full h-full object-cover"
          />

          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <Link
              href="/rooms"
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#1A1A1A] hover:bg-white transition shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#1A1A1A] hover:bg-white transition shadow-sm"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
              <button
                onClick={() => navigator.clipboard?.writeText?.(window.location.href)}
                className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#1A1A1A] hover:bg-white transition shadow-sm"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
            {currentSlide}/12
          </div>
        </div>

        {/* Main Mobile Content */}
        <div className="px-4 space-y-4 pt-3">
          <div className="space-y-2 border-b border-[#ECECEC] pb-4">
            <h1 className="font-serif text-lg font-bold text-[#1A1A1A]">
              {isEn ? room.nameEn : room.name}
            </h1>

            <div className="flex items-center gap-2 text-xs">
              <div className="flex text-[#FFB800] gap-0.5">
                <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
                <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
                <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
                <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
                <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
              </div>
              <span className="font-bold text-[#1D4E89]">8.9</span>
              <span className="text-[#6B7280]">(83 {tx(UI.reviews)})</span>
            </div>
          </div>

          <div className="border border-[#ECECEC] rounded-[12px] p-4 bg-[#FAFAF8] space-y-3">
            <h3 className="font-serif text-sm font-bold text-[#0F2D52]">
              {tx(UI.roomInclusions)}
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#4B5563]">
                <Users className="w-4 h-4 text-[#1D4E89] shrink-0" />
                <span>{t(`Giá cho ${room.cap} người lớn`, `Price for ${room.cap} adults`)}</span>
              </div>
              <div className="flex items-center gap-2 text-[#4B5563]">
                <Calendar className="w-4 h-4 text-[#1D4E89] shrink-0" />
                <span>{tx(UI.flexibleDateChanges)}</span>
              </div>
              <div className="flex items-center gap-2 text-[#4B5563]">
                <Ban className="w-4 h-4 text-[#1D4E89] shrink-0" />
                <span className="font-medium">{tx(UI.nonRefundable)}</span>
              </div>
              <div className="flex items-center gap-2 text-[#4B5563]">
                <CreditCard className="w-4 h-4 text-[#1D4E89] shrink-0" />
                <span>{tx(UI.payBeforeArrival)}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 font-medium">
                <Coffee className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{tx(UI.dailyBreakfastIncluded)}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#ECECEC] pt-4 space-y-1.5">
            <h2 className="font-serif text-sm font-bold text-[#1A1A1A]">
              {tx(UI.roomDescription)}
            </h2>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              {isEn
                ? room.blurbEn || 'Spacious Deluxe Sea View room with ocean-facing balcony.'
                : room.blurb || 'Phòng Deluxe Sea View rộng rãi với ban công hướng biển.'}
            </p>
          </div>

          {/* 📱 Mobile Tiện nghi phòng (Exact match to screenshot) */}
          <div className="border-t border-[#ECECEC] pt-4 space-y-4">
            <h2 className="font-serif text-base font-bold text-[#1A1A1A]">
              {tx(UI.roomAmenities)}
            </h2>

            <div className="space-y-4">
              {[
                {
                  icon: Bed,
                  title: isEn ? 'Bedroom' : 'Phòng ngủ',
                  items: isEn ? ['Wardrobe or closet'] : ['Tủ hoặc phòng để quần áo'],
                },
                {
                  icon: Armchair,
                  title: isEn ? 'Living Area' : 'Khu vực phòng khách',
                  items: isEn ? ['Sofa'] : ['Ghế sofa'],
                },
                {
                  icon: Utensils,
                  title: isEn ? 'Kitchen Amenities' : 'Tiện nghi nhà bếp',
                  items: isEn ? ['Electric kettle', 'Refrigerator'] : ['Ấm đun nước điện', 'Tủ lạnh'],
                },
                {
                  icon: Bath,
                  title: isEn ? 'Bathroom' : 'Phòng tắm',
                  items: isEn
                    ? ['Bathrobe', 'Linen set', 'Slippers', 'Toilet paper', 'Towels', 'Hairdryer', 'Private bathroom', 'Shower', 'Free toiletries']
                    : ['Áo choàng tắm', 'Bộ khăn trải giường', 'Dép lê', 'Giấy vệ sinh', 'Khăn tắm', 'Máy sấy tóc', 'Phòng tắm riêng', 'Vòi sen', 'Đồ vệ sinh cá nhân miễn phí'],
                },
                {
                  icon: Info,
                  title: isEn ? 'Accessibility' : 'Lối vào dành cho người khuyết tật',
                  items: isEn ? ['Upper floors accessible by stairs only'] : ['Các tầng trên chỉ lên được bằng cầu thang'],
                },
                {
                  icon: Flower2,
                  title: isEn ? 'Outdoors' : 'Ngoài trời',
                  items: isEn ? ['Balcony', 'Patio'] : ['Ban công', 'Sân trong'],
                },
                {
                  icon: Eye,
                  title: isEn ? 'View' : 'Tầm nhìn',
                  items: isEn ? ['Sea view', 'City view'] : ['Nhìn ra biển', 'Nhìn ra thành phố'],
                },
                {
                  icon: Shirt,
                  title: isEn ? 'In-room Amenities' : 'Tiện ích trong phòng',
                  items: isEn ? ['Drying rack for clothing'] : ['Giá phơi quần áo'],
                },
                {
                  icon: Info,
                  title: isEn ? 'General' : 'Tổng quát',
                  items: isEn
                    ? ['Air conditioning', 'Fan', 'Soundproofing', 'Free Wi-Fi', 'Free pier transfer both ways']
                    : ['Máy điều hòa', 'Quạt máy', 'Cách âm', 'Wi-Fi miễn phí', 'Xe riêng đưa đón miễn phí bến tàu Củ Tron'],
                },
              ].map((cat, idx) => {
                const CatIcon = cat.icon
                return (
                  <div key={idx} className="flex items-start gap-3">
                    <CatIcon className="w-5 h-5 text-[#1A1A1A] shrink-0 mt-0.5 stroke-[1.75]" />
                    <div className="space-y-0.5">
                      <h3 className="text-xs font-bold text-[#1A1A1A]">
                        {cat.title}
                      </h3>
                      <div className="space-y-0.5">
                        {cat.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="text-[11px] text-[#4B5563] leading-normal">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 📱 Mobile Gợi ý các phòng khác (Suggested Rooms section) */}
          <div className="border-t border-[#ECECEC] pt-4 pb-6 space-y-3">
            <h2 className="font-serif text-base font-bold text-[#1A1A1A]">
              {tx(UI.suggestedRooms)}
            </h2>

            <div className="space-y-3">
              {ROOMS.filter((r) => r.code !== room.code).slice(0, 3).map((r) => (
                <Link
                  key={r.code}
                  href={`/rooms/${roomSlug(r.code)}`}
                  className="bg-white rounded-[10px] border border-[#ECECEC] p-3 flex gap-3 items-center shadow-2xs hover:border-[#1D4E89] transition group block"
                >
                  <div className="relative w-[90px] aspect-[4/3] rounded-[8px] overflow-hidden bg-[#F5F7FA] shrink-0">
                    <img
                      src={r.images?.[0] || 'https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/cover6.jpg'}
                      alt={r.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-1 left-1 bg-[#1A1A1A]/80 text-white text-[8px] font-semibold px-1 py-0.2 rounded">
                      {r.code}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-xs font-bold text-[#1A1A1A] truncate group-hover:text-[#1D4E89]">
                      {isEn ? r.nameEn : r.name}
                    </h3>
                    <div className="text-[10px] text-[#6B7280] mt-0.5">
                      📐 {r.area}m² • 👤 {r.cap} {tx(UI.guests)}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#F5F7FA]">
                      <span className="font-bold text-xs text-[#0F2D52]">
                        {formatVND(r.price)}
                        <span className="text-[8px] font-normal text-[#6B7280]">/{tx(UI.nights)}</span>
                      </span>
                      <Button variant="primary" size="xs" radius="6px" className="px-2 py-0.5 text-[10px]">
                        {tx(UI.select)}
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Fixed Bottom CTA Bar (Matches screenshot 100%) */}
        <div className="fixed bottom-0 inset-x-0 bg-white border-t border-[#ECECEC] px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsCalendarModalOpen(true)}
            aria-label={t('Thay đổi ngày và số khách', 'Change dates and guests')}
            className="text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4E89] rounded-[4px]"
          >
            <span className="text-[11px] text-[#6B7280] block leading-none">{tx(UI.from)}</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-bold text-lg text-[#1A1A1A]">
                {formatVND(room.price)}
              </span>
              <span className="text-[10px] text-[#6B7280]">/{tx(UI.nights)}</span>
            </div>
            <span className="text-[10px] text-[#1D4E89] font-semibold block mt-0.5 underline">
              {formatDisplayDate(checkIn)} — {formatDisplayDate(checkOut)} · {guests}
            </span>
          </button>
          <Link href={`/checkout?room=${encodeURIComponent(room.code)}`}>
            <Button variant="primary" size="md" radius="8px" className="bg-[#0F2D52] hover:bg-[#163B6C] px-5 py-2.5 text-sm font-bold shadow-sm">
              {tx(UI.selectRoom)}
            </Button>
          </Link>
        </div>
      </div>

      {/* 🖥️ 2. DESKTOP ONLY VIEW (Figma 3-desktop.png Section 03) */}
      <div className="hidden md:block max-w-[1280px] mx-auto px-6 lg:px-8 space-y-6">

        {/* Clean Standard Breadcrumb Navigation with reduced vertical padding (py) */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#6B7280] pt-2 pb-0">
          <Link href="/" className="hover:text-[#1D4E89] font-medium transition">
            {tx(UI.home)}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
          <Link href="/rooms" className="hover:text-[#1D4E89] font-medium transition">
            {tx(UI.roomList)}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
          <span className="text-[#1A1A1A] font-semibold truncate max-w-[300px]">
            {isEn ? room.nameEn : room.name}
          </span>
        </nav>

        {/* 3-Column Top Grid: Gallery (4 cols) | Info & Description (5 cols) | Booking Card (3 cols) */}
        <div className="grid grid-cols-12 gap-6 items-start">

          {/* Column 1: Gallery (Main image + 5 thumbnails) */}
          <div className="col-span-4 space-y-3">
            <div className="aspect-[4/3] rounded-[16px] overflow-hidden bg-[#F5F7FA] border border-[#ECECEC] shadow-2xs">
              <img
                src={roomImages[0]}
                alt={room.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map((idx) => (
                <div
                  key={idx}
                  className="relative aspect-[4/3] rounded-[8px] overflow-hidden bg-[#F5F7FA] cursor-pointer hover:opacity-90 transition border border-[#ECECEC]"
                >
                  <img
                    src={roomImages[idx % roomImages.length] || roomImages[0]}
                    alt={`${room.name} ${idx}`}
                    className="w-full h-full object-cover"
                  />
                  {idx === 4 && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center text-white font-bold text-xs">
                      +12
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Room Info, Rating, Inclusions & Description */}
          <div className="col-span-5 space-y-4">
            <div>
              <h1 className="font-serif text-2xl lg:text-3xl font-bold text-[#1A1A1A]">
                {isEn ? room.nameEn : room.name}
              </h1>

              {/* Specs Row */}
              <div className="flex items-center gap-3 text-xs text-[#6B7280] mt-1.5 font-medium flex-wrap">
                <span>📐 {room.area}m²</span>
                <span>👤 {room.cap} {tx(UI.guests)}</span>
                <span>🛏️ 1 {tx(UI.doubleBed)}</span>
                <span>👁️ {isEn ? room.viewEn : room.view}</span>
              </div>

              {/* Rating Row */}
              <div className="flex items-center gap-2 text-xs pt-2">
                <div className="flex text-[#FFB800] gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
                  ))}
                </div>
                <span className="font-bold text-[#1D4E89]">4.9</span>
                <span className="text-[#6B7280]">(23 {tx(UI.reviews)})</span>
              </div>
            </div>

            {/* Green Inclusions Checkmarks (2 Columns) */}
            <div className="grid grid-cols-2 gap-2 text-xs text-[#1D4E89] font-medium pt-1">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{tx(UI.freeBreakfast)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{tx(UI.privateBalcony)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{tx(UI.freeHighSpeedWiFi)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{tx(UI.airConditioning)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{tx(UI.freeCancellation48h)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{tx(UI.minibar)}</span>
              </div>
            </div>

            {/* Description Block */}
            <div className="space-y-1.5 border-t border-[#ECECEC] pt-3">
              <h3 className="font-bold text-sm text-[#1A1A1A]">{tx(UI.roomDescription2)}</h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                {isEn
                  ? room.blurbEn || 'Spacious Deluxe Sea View room with private ocean-facing balcony, offering a tranquil sanctuary for your Nam Du getaway.'
                  : room.blurb || 'Phòng Deluxe Sea View rộng rãi với ban công riêng hướng biển, mang đến không gian thư giãn tuyệt vời cho kỳ nghỉ của bạn.'}
              </p>
              <button className="text-xs font-semibold text-[#1D4E89] hover:underline block">
                {tx(UI.readMore)}
              </button>
            </div>
          </div>

          {/* Column 3: Sticky Floating Booking Sidebar Card */}
          <div className="col-span-3 sticky top-20">
            <div className="bg-white rounded-[16px] border border-[#ECECEC] p-5 shadow-lg border-t-4 border-t-[#0F2D52] space-y-4">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-bold text-2xl text-[#0F2D52]">
                    {formatVND(room.price)}
                  </span>
                  <span className="text-xs text-[#6B7280]">/{tx(UI.nights)}</span>
                </div>
                <span className="text-[11px] text-[#6B7280] block mt-0.5">
                  {tx(UI.taxesAndFeesIncluded)}
                </span>
              </div>

              {/* Date Selection Box */}
              <button
                type="button"
                onClick={() => setIsCalendarModalOpen(true)}
                aria-label={t('Thay đổi ngày nhận và trả phòng', 'Change check-in and check-out dates')}
                className="w-full text-left border border-[#ECECEC] rounded-[10px] p-2.5 space-y-1.5 bg-[#FAFAF8] hover:border-[#1D4E89] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4E89] transition"
              >
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[10px] text-[#6B7280] block">{tx(UI.checkIn)}</span>
                    <span className="font-semibold text-[#1A1A1A]">{formatDisplayDate(checkIn)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#6B7280] block">{tx(UI.checkOut)}</span>
                    <span className="font-semibold text-[#1A1A1A]">{formatDisplayDate(checkOut)}</span>
                  </div>
                </div>
                <div className="text-center pt-1 border-t border-[#E5E7EB] text-[10px] font-semibold text-[#1D4E89]">
                  {nights} {tx(UI.nights)}
                </div>
              </button>

              {/* Guest Count Box */}
              <div className="border border-[#ECECEC] rounded-[10px] p-2.5 flex justify-between items-center text-xs bg-[#FAFAF8]">
                <div>
                  <span className="text-[10px] text-[#6B7280] block">{tx(UI.guests2)}</span>
                  <span className="font-semibold text-[#1A1A1A] text-xs">{guests}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCalendarModalOpen(true)}
                  aria-label={t('Thay đổi số khách', 'Change number of guests')}
                  className="text-[11px] font-semibold text-[#1D4E89] border border-[#1D4E89] px-2 py-0.5 rounded-[4px] hover:bg-[#1D4E89]/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4E89] active:bg-[#1D4E89]/10 transition"
                >
                  {tx(UI.change)}
                </button>
              </div>

              {/* Total Price */}
              <div className="flex justify-between items-center pt-1 border-t border-[#ECECEC]">
                <span className="text-xs font-semibold text-[#4B5563]">{tx(UI.total)}</span>
                <span className="font-bold text-lg text-[#0F2D52]">
                  {formatVND(room.price * nights)}
                </span>
              </div>

              {/* CTA Button */}
              <Link href={`/checkout?room=${encodeURIComponent(room.code)}`}>
                <Button variant="primary" size="md" fullWidth radius="8px" className="bg-[#0F2D52] hover:bg-[#163B6C] h-[44px] text-sm font-semibold shadow-md">
                  {tx(UI.bookNow)}
                </Button>
              </Link>

              {/* Trust Indicators */}
              <div className="space-y-1 pt-1 text-[11px] text-[#6B7280]">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{tx(UI.instantConfirmation)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{tx(UI.noPrepaymentRequired)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="space-y-3 pt-6 border-t border-[#ECECEC]">
          <h3 className="font-bold text-base text-[#1A1A1A]">{tx(UI.featuredAmenities)}</h3>
          <div className="grid grid-cols-10 gap-2">
            {[
              { name: 'View biển', icon: Eye },
              { name: 'Ban công', icon: Flower2 },
              { name: 'Điều hòa', icon: Info },
              { name: 'TV màn hình phẳng', icon: Info },
              { name: 'Minibar', icon: Utensils },
              { name: 'Két an toàn', icon: Ban },
              { name: 'Máy sấy tóc', icon: Info },
              { name: 'Bồn tắm', icon: Bath },
              { name: 'Đồ vệ sinh cá nhân', icon: Shirt },
              { name: 'Wi-Fi miễn phí', icon: Coffee },
            ].map((item, idx) => {
              const ItemIcon = item.icon
              return (
                <div key={idx} className="flex flex-col items-center text-center p-2.5 bg-[#FAFAF8] rounded-[10px] border border-[#ECECEC] hover:bg-white transition">
                  <ItemIcon className="w-5 h-5 text-[#1D4E89] mb-1 stroke-[1.75]" />
                  <span className="text-[10px] font-medium text-[#1A1A1A] leading-tight">{item.name}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Detailed Categorized Amenities (Same richness as Mobile version) */}
        <div className="space-y-4 pt-6 border-t border-[#ECECEC]">
          <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
            {tx(UI.detailedRoomAmenities)}
          </h3>

          <div className="grid grid-cols-3 gap-6">
            {amenityCategories.map((cat, idx) => {
              const CatIcon = cat.icon
              return (
                <div key={idx} className="p-4 rounded-[12px] bg-[#FAFAF8] border border-[#ECECEC] space-y-2.5">
                  <div className="flex items-center gap-2.5 text-[#0F2D52]">
                    <CatIcon className="w-5 h-5 shrink-0 stroke-[1.75]" />
                    <h4 className="font-bold text-sm text-[#1A1A1A]">
                      {cat.title}
                    </h4>
                  </div>
                  <ul className="space-y-1.5 pl-7">
                    {cat.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="text-xs text-[#4B5563] list-disc marker:text-[#1D4E89]">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>

        {/* 1. Customer Reviews & Ratings Section (Đánh giá từ khách hàng) */}
        <div className="space-y-5 pt-8 border-t border-[#ECECEC]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">
                {tx(UI.customerReviews)}
              </h3>
              <p className="text-xs text-[#6B7280] mt-0.5">
                {tx(UI.realReviewsFromVerifiedGuestsStaying)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#0F2D52]">4.9</span>
              <div className="text-left">
                <div className="flex text-[#FFB800] gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
                  ))}
                </div>
                <span className="text-[11px] text-[#6B7280] font-medium">23 {tx(UI.reviews)}</span>
              </div>
            </div>
          </div>

          {/* Rating Breakdown Sub-bars */}
          <div className="grid grid-cols-4 gap-4 p-4 rounded-[12px] bg-[#FAFAF8] border border-[#ECECEC] text-xs">
            <div>
              <div className="flex justify-between text-[#4B5563] font-medium mb-1">
                <span>{tx(UI.cleanliness)}</span>
                <span className="font-bold text-[#1A1A1A]">4.9/5</span>
              </div>
              <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#1D4E89] h-full w-[98%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[#4B5563] font-medium mb-1">
                <span>{tx(UI.locationView)}</span>
                <span className="font-bold text-[#1A1A1A]">5.0/5</span>
              </div>
              <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#1D4E89] h-full w-[100%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[#4B5563] font-medium mb-1">
                <span>{tx(UI.service)}</span>
                <span className="font-bold text-[#1A1A1A]">4.9/5</span>
              </div>
              <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#1D4E89] h-full w-[98%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[#4B5563] font-medium mb-1">
                <span>{tx(UI.valueForMoney)}</span>
                <span className="font-bold text-[#1A1A1A]">4.8/5</span>
              </div>
              <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#1D4E89] h-full w-[96%]" />
              </div>
            </div>
          </div>

          {/* Guest Reviews Grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                name: 'Nguyễn Văn Minh',
                origin: 'Hà Nội',
                date: 'Tháng 07/2025',
                rating: 5,
                comment: 'Phòng Deluxe view biển rất đẹp, ban công rộng rãi ngắm hoàng hôn ngất ngây. Nhân viên resort đưa đón tận tình từ bến tàu Củ Tron.',
              },
              {
                name: 'Trần Thị Thu Thảo',
                origin: 'TP. Hồ Chí Minh',
                date: 'Tháng 06/2025',
                rating: 5,
                comment: 'Kỳ nghỉ gia đình 3 ngày 2 đêm rất hài lòng. Phòng sạch sẽ, chăn gối thơm tho, không gian yên tĩnh nghỉ dưỡng lý tưởng.',
              },
              {
                name: 'Lê Hoàng Nam',
                origin: 'Cần Thơ',
                date: 'Tháng 05/2025',
                rating: 5,
                comment: 'Phòng giống hệt hình chụp, thiết kế hiện đại và sang trọng. Đưa đón bến tàu miễn phí 2 chiều cực kỳ tiện lợi.',
              },
              {
                name: 'Phạm Quỳnh Như',
                origin: 'Đà Nẵng',
                date: 'Tháng 04/2025',
                rating: 5,
                comment: 'Đồ ăn sáng ngon và phong phú. View từ ban công ngắm nhìn trọn vẹn biển Nam Du xanh ngắt. Sẽ giới thiệu bạn bè quay lại!',
              },
            ].map((rev, idx) => (
              <div key={idx} className="p-4 rounded-[12px] bg-white border border-[#ECECEC] space-y-2.5 shadow-2xs hover:border-[#1D4E89]/40 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#0F2D52] text-white flex items-center justify-center text-xs font-bold">
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#1A1A1A]">{rev.name}</h4>
                      <span className="text-[10px] text-[#6B7280]">{rev.origin} • {rev.date}</span>
                    </div>
                  </div>
                  <div className="flex text-[#FFB800] gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#FFB800] text-[#FFB800]" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[#4B5563] leading-relaxed italic">
                  &quot;{rev.comment}&quot;
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-medium pt-1">
                  <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>{tx(UI.verifiedStay)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Other Available Rooms Section (Danh sách phòng khác) */}
        <div className="space-y-5 pt-8 border-t border-[#ECECEC] pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">
              {tx(UI.suggestedRooms)}
            </h3>
            <p className="text-xs text-[#6B7280] mt-0.5">
              {tx(UI.exploreOtherRoomTypesSuitableFor)}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {ROOMS.filter((r) => r.code !== room.code).slice(0, 3).map((r) => (
              <div
                key={r.code}
                className="bg-white rounded-[12px] border border-[#ECECEC] overflow-hidden shadow-2xs hover:shadow-md transition group flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden relative bg-[#F5F7FA]">
                    <img
                      src={r.images?.[0] || 'https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/cover6.jpg'}
                      alt={r.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 bg-[#1A1A1A]/80 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-[4px]">
                      {r.code}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="font-serif text-base font-bold text-[#1A1A1A] group-hover:text-[#1D4E89] transition-colors truncate">
                      {isEn ? r.nameEn : r.name}
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-[#6B7280] font-medium">
                      <span>📐 {r.area}m²</span>
                      <span>👤 {r.cap} {tx(UI.guests)}</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-[#1D4E89] font-medium pt-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{tx(UI.dailyBreakfastIncluded)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-[#FAFAF8] flex items-center justify-between mt-2">
                  <div>
                    <span className="font-bold text-base text-[#0F2D52]">
                      {formatVND(r.price)}
                    </span>
                    <span className="text-[10px] text-[#6B7280]">/{tx(UI.nights)}</span>
                  </div>

                  <Link href={`/rooms/${roomSlug(r.code)}`}>
                    <Button variant="primary" size="xs" radius="6px" className="bg-[#0F2D52] hover:bg-[#163B6C] px-3 py-1.5">
                      {tx(UI.viewDetails)}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Popup chọn ngày & số khách — dùng chung với hero trang chủ. */}
      <BookingCalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        checkIn={checkIn}
        checkOut={checkOut}
        guests={guests}
        roomType={isEn ? room.nameEn : room.name}
        onSave={(nextCheckIn, nextCheckOut, nextGuests) => {
          setCheckIn(nextCheckIn)
          setCheckOut(nextCheckOut)
          setGuests(nextGuests)
        }}
      />
    </main>
  )
}
