'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'
import { Button } from '../common/Button'
import { Star } from 'lucide-react'
import { ROOMS, formatVND, roomSlug } from '../../data/rooms'

export function RoomsSection() {
  const { t, language } = useLanguage()
  const isEn = language === 'en'

  const featuredRooms = [
    {
      id: 'deluxe-sea-view',
      title: 'Deluxe Sea View',
      titleVi: 'Phòng Deluxe Hướng Biển',
      area: 30,
      cap: 2,
      price: 2300000,
      image: ROOMS[3]?.images?.[0] || 'https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/cover6.jpg',
      code: '#06',
    },
    {
      id: 'villa-ocean-view',
      title: 'Villa Ocean View',
      titleVi: 'Biệt Thự Hướng Biển',
      area: 45,
      cap: 2,
      price: 3500000,
      image: ROOMS[1]?.images?.[0] || 'https://thenamduhill.com/image/catalog/room-suite/8-phong-sute-02-phong-ngu/cover8.jpg',
      code: '#08',
    },
    {
      id: 'premium-sea-view',
      title: 'Premium Sea View',
      titleVi: 'Phòng Premium Hướng Biển',
      area: 35,
      cap: 2,
      price: 2900000,
      image: ROOMS[5]?.images?.[0] || 'https://thenamduhill.com/image/catalog/room-suite/7-phong-superior-co-giuong-co-king/dai-dien-2.jpg',
      code: '#07',
    },
    {
      id: 'family-suite-ocean-view',
      title: 'Family Suite Ocean View',
      titleVi: 'Phòng Gia Đình Hướng Biển',
      area: 60,
      cap: 4,
      price: 4500000,
      image: ROOMS[0]?.images?.[0] || 'https://thenamduhill.com/image/catalog/room-suite/8-phong-sute-02-phong-ngu/dai-dien.jpg',
      code: '#01',
    },
  ]

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#FAFAF8] border-b border-slate-200/60">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Standardized Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-widest block mb-1">
              {t('HẠNG PHÒNG NGHỈ DƯỠNG', 'LUXURY ROOM SUITES')}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B192C] tracking-tight">
              {t('Các loại phòng nổi bật', 'Featured Room Types')}
            </h2>
          </div>
          <Link href="/rooms">
            <Button variant="secondary" size="md" radius="full" className="shadow-sm hover:shadow border border-slate-200 font-bold text-xs sm:text-sm text-[#0F2D52]">
              {t('Xem tất cả phòng →', 'View All Rooms →')}
            </Button>
          </Link>
        </div>

        {/* Room Cards Grid (1 col Mobile, 2 col Tablet, 4 col Desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredRooms.map((room) => (
            <Link
              key={room.id}
              href={`/rooms/${roomSlug(room.code)}`}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_22px_50px_rgba(11,25,44,0.18)] hover:-translate-y-2 hover:border-[#FFB800] transition-all duration-300 flex flex-col group"
            >
              {/* Image Banner */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={room.image}
                  alt={room.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-3 left-3 bg-[#0B192C]/85 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md border border-white/20">
                  {room.code}
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[#0F172A] text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md border border-slate-200/60 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
                  <span>5.0</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <h3 className="font-serif font-bold text-[#0B192C] text-base sm:text-lg group-hover:text-[#1D4E89] transition-colors line-clamp-1">
                    {isEn ? room.title : room.titleVi}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 font-medium">
                    <span className="flex items-center gap-1">📐 {room.area}m²</span>
                    <span className="flex items-center gap-1">👤 {room.cap} {t('người', 'guests')}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="font-extrabold text-base sm:text-lg text-[#0B192C]">
                      {formatVND(room.price)}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">/{t('đêm', 'night')}</span>
                  </div>
                  <Button variant="primary" size="sm" radius="full" className="bg-[#0F2D52] hover:bg-[#1D4E89] text-xs px-4 font-bold shadow-sm">
                    {t('Xem phòng', 'View Room')}
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
