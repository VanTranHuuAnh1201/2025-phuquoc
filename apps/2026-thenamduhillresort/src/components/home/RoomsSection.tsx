'use client'

import { UI } from '@repo/core'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'
import { Button } from '../common/Button'
import { SectionHeading } from '../common/SectionHeading'
import { ROOMS, formatVND, roomSlug } from '../../data/rooms'
import { Maximize2, Users } from 'lucide-react'

export function RoomsSection() {
  const { language, tx } = useLanguage()
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
    <section className="py-5 sm:py-8 bg-[#FAFAF8] border-b border-[#ECECEC]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          title={tx(UI.featuredRoomTypes)}
          description={
            isEn
              ? 'Sea-view rooms, villas and family suites'
              : 'Phòng hướng biển, biệt thự và phòng gia đình'
          }
          className="sm:mb-6"
          href="/rooms"
          actionLabel={tx(UI.viewAll)}
        />

        {/* Room Cards Grid (1 col Mobile, 2 col Tablet, 4 col Desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredRooms.map((room) => (
            <Link
              key={room.id}
              href={`/rooms/${roomSlug(room.code)}`}
              className="bg-white rounded-[12px] border border-[#ECECEC] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition flex flex-col group"
            >
              {/* Image Banner */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#F5F7FA]">
                <img
                  src={room.image}
                  alt={room.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Card Content */}
              <div className="p-4 flex flex-col flex-1 justify-between gap-2">
                <div>
                  <h3 className="font-serif font-bold text-[#1A1A1A] text-sm sm:text-base group-hover:text-[#1D4E89] transition-colors line-clamp-1">
                    {isEn ? room.title : room.titleVi}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-[#6B7280] mt-1 font-medium">
                    <span className="flex items-center gap-1">
                      <Maximize2 className="w-3.5 h-3.5 text-[#1D4E89]" />
                      {room.area}m²
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#1D4E89]" />
                      {room.cap} {tx(UI.guests)}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#ECECEC] flex items-center justify-between mt-1">
                  <div className="flex items-baseline gap-1">
                    <span className="font-bold text-sm sm:text-base text-[#0F2D52]">
                      {formatVND(room.price)}
                    </span>
                    <span className="text-[10px] text-[#6B7280]">/{tx(UI.nights)}</span>
                  </div>
                  <Button variant="primary" size="sm" radius="6px">
                    {tx(UI.viewRoom)}
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
