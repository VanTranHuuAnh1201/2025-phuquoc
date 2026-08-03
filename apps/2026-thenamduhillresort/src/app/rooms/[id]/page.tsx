'use client'

import React, { useState, use } from 'react'
import Link from 'next/link'
import { useLanguage } from '../../../context/LanguageContext'
import { ROOMS, formatVND, roomSlug, Room } from '../../../data/rooms'
import { Button } from '../../../components/common/Button'
import {
  ArrowLeft, Share2, Heart, Users, Calendar, Ban, CreditCard, Coffee, Star,
  Bed, Bath, Shirt, Utensils, Armchair, Flower2, Info
} from 'lucide-react'

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

  const { t, language } = useLanguage()
  const isEn = language === 'en'

  const [currentSlide, setCurrentSlide] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

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
    <main className="min-h-screen bg-white text-[#1A1A1A] pt-12 pb-36">
      
      {/* 1. Full Width Edge-to-Edge Hero Image Banner */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[21/9] bg-[#F5F7FA] overflow-hidden">
        <img
          src={roomImages[0]}
          alt={room.name}
          className="w-full h-full object-cover"
        />

        {/* Floating Action Buttons */}
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

        {/* Slide Counter Badge */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
          {currentSlide}/12
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4 pt-3">
        
        {/* 2. Room Title & Rating */}
        <div className="space-y-2 border-b border-[#ECECEC] pb-4">
          <h1 className="font-serif text-lg sm:text-2xl font-bold text-[#1A1A1A]">
            {isEn ? room.nameEn : room.name}
          </h1>

          <div className="flex items-center gap-2 text-xs">
            <div className="flex text-[#C6A86A] gap-0.5">
              <Star className="w-3.5 h-3.5 fill-[#C6A86A]" />
              <Star className="w-3.5 h-3.5 fill-[#C6A86A]" />
              <Star className="w-3.5 h-3.5 fill-[#C6A86A]" />
              <Star className="w-3.5 h-3.5 fill-[#C6A86A]" />
              <Star className="w-3.5 h-3.5 fill-[#C6A86A]" />
            </div>
            <span className="font-bold text-[#1D4E89]">8.9</span>
            <span className="text-[#6B7280]">(83 {t('đánh giá', 'reviews')})</span>
          </div>
        </div>

        {/* 3. Luxury Rate Plan Card */}
        <div className="border border-[#ECECEC] rounded-[12px] p-4 bg-[#FAFAF8] space-y-3">
          <h3 className="font-serif text-sm font-bold text-[#0F2D52]">
            {t('Quyền lợi phòng', 'Room Inclusions')}
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#4B5563]">
              <Users className="w-4 h-4 text-[#1D4E89] shrink-0" />
              <span>{t(`Giá cho ${room.cap} người lớn`, `Price for ${room.cap} adults`)}</span>
            </div>
            <div className="flex items-center gap-2 text-[#4B5563]">
              <Calendar className="w-4 h-4 text-[#1D4E89] shrink-0" />
              <span>{t('Linh động đổi ngày khi kế hoạch thay đổi', 'Flexible date changes')}</span>
            </div>
            <div className="flex items-center gap-2 text-[#4B5563]">
              <Ban className="w-4 h-4 text-[#1D4E89] shrink-0" />
              <span className="font-medium">{t('Không hoàn tiền', 'Non-refundable')}</span>
            </div>
            <div className="flex items-center gap-2 text-[#4B5563]">
              <CreditCard className="w-4 h-4 text-[#1D4E89] shrink-0" />
              <span>{t('Thanh toán cho chỗ nghỉ trước khi đến', 'Pay before arrival')}</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-700 font-medium">
              <Coffee className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('Bao gồm bữa sáng hàng ngày', 'Daily breakfast included')}</span>
            </div>
          </div>
        </div>

        {/* 4. Bed Types Section */}
        <div className="border-t border-[#ECECEC] pt-4 space-y-1">
          <h2 className="font-serif text-sm font-bold text-[#1A1A1A]">
            {t('Các loại giường có sẵn', 'Available bed types')}
          </h2>
          <p className="text-xs text-[#4B5563]">
            1 {t('giường đôi lớn: rộng 151-180 cm', 'large double bed: 151-180 cm wide')}
          </p>
        </div>

        {/* 5. Room Description Section */}
        <div className="border-t border-[#ECECEC] pt-4 space-y-1.5">
          <h2 className="font-serif text-sm font-bold text-[#1A1A1A]">
            {t('Miêu tả phòng', 'Room Description')}
          </h2>
          <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
            {isEn
              ? room.blurbEn || 'Spacious Deluxe Sea View room with ocean-facing balcony, offering a relaxing sanctuary for your vacation with full modern amenities and complimentary pier transfers.'
              : room.blurb || 'Phòng Deluxe Sea View rộng rãi với ban công hướng biển, mang đến không gian thư giãn tuyệt vời với đầy đủ tiện nghi hiện đại và đưa đón bến tàu miễn phí.'}
          </p>
        </div>

        {/* 6. Clean Categorized Amenities Section matching screenshot format */}
        <div className="border-t border-[#ECECEC] pt-4 space-y-4">
          <h2 className="font-serif text-base sm:text-lg font-bold text-[#1A1A1A]">
            {t('Tiện nghi phòng', 'Room Amenities')}
          </h2>

          <div className="space-y-5 pt-1">
            {amenityCategories.map((cat, idx) => {
              const CatIcon = cat.icon
              return (
                <div key={idx} className="flex items-start gap-3">
                  <CatIcon className="w-5 h-5 text-[#1A1A1A] shrink-0 mt-0.5 stroke-[1.75]" />
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-[#1A1A1A]">
                      {cat.title}
                    </h3>
                    <ul className="space-y-1">
                      {cat.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="text-xs text-[#4B5563] leading-snug">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 7. Clean Luxury Sticky Bottom Bar */}
      <div className="fixed bottom-[56px] sm:bottom-0 inset-x-0 bg-white border-t border-[#ECECEC] p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-40 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-[#6B7280] block leading-none">{t('Từ', 'From')}</span>
          <span className="font-bold text-base text-[#0F2D52]">
            {formatVND(room.price)}
          </span>
          <span className="text-[10px] text-[#6B7280]">/{t('đêm', 'night')}</span>
        </div>
        <Link href={`/checkout?room=${encodeURIComponent(room.code)}`}>
          <Button variant="primary" size="md" radius="6px">
            {t('Đặt phòng', 'Book Now')}
          </Button>
        </Link>
      </div>
    </main>
  )
}
