'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'
import { Button } from '../common/Button'
import { Waves, Utensils, Wifi, Bus, Bike, Sparkles } from 'lucide-react'

export function WhyUsSection() {
  const { t } = useLanguage()

  const mobileAmenities = [
    { icon: Waves, label: t('Hồ bơi', 'Infinity Pool') },
    { icon: Utensils, label: t('Nhà hàng', 'Restaurant') },
    { icon: Wifi, label: t('Wifi miễn phí', 'Free Wifi') },
    { icon: Bus, label: t('Đưa đón', 'Transfer') },
  ]

  const desktopAmenities = [
    { icon: Waves, label: t('Hồ bơi vô cực', 'Infinity Pool'), desc: t('View biển', 'Sea view') },
    { icon: Utensils, label: t('Nhà hàng', 'Restaurant'), desc: t('Ẩm thực đa dạng', 'Diverse cuisine') },
    { icon: Wifi, label: t('Wi-Fi miễn phí', 'Free Wi-Fi'), desc: t('Tốc độ cao', 'High speed') },
    { icon: Bus, label: t('Đưa đón sân bay', 'Airport transfer'), desc: t('Xe đưa đón tận nơi', 'Door-to-door shuttle') },
    { icon: Bike, label: t('Thuê xe máy', 'Motorbike rental'), desc: t('Khám phá đảo', 'Explore the island') },
    { icon: Sparkles, label: t('Tổ chức sự kiện', 'Event organizing'), desc: t('Hội nghị, tiệc cưới', 'Conferences, weddings') },
  ]

  return (
    <section className="py-5 sm:py-8 bg-white border-b border-[#ECECEC]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Standardized Section Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="font-serif text-base sm:text-xl md:text-2xl font-bold text-[#1A1A1A] tracking-tight">
              {t('Tiện ích nổi bật', 'Featured Amenities')}
            </h2>
          </div>
          <Link href="/explore">
            <Button variant="secondary" size="sm" radius="6px">
              {t('Xem thêm', 'See more')}
            </Button>
          </Link>
        </div>

        {/* 📱 MOBILE VIEW: 4 Icon Amenities Row (100% Intact) */}
        <div className="grid grid-cols-4 gap-2 text-center md:hidden">
          {mobileAmenities.map((item, idx) => {
            const IconComp = item.icon
            return (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-2 rounded-[12px] hover:bg-[#F5F7FA] transition cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-[#F5F7FA] group-hover:bg-[#C6A86A]/15 flex items-center justify-center text-[#1D4E89] group-hover:text-[#C6A86A] transition-colors mb-1.5">
                  <IconComp className="w-5 h-5 stroke-[1.75]" />
                </div>
                <span className="text-xs font-medium text-[#4B5563] leading-tight">
                  {item.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* 🖥️ DESKTOP VIEW: 6 Amenities Row with Subtitles (Figma 3-desktop.png) */}
        <div className="hidden md:grid md:grid-cols-6 gap-4 text-center">
          {desktopAmenities.map((item, idx) => {
            const IconComp = item.icon
            return (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-4 rounded-[12px] bg-[#FAFAF8] border border-[#ECECEC] hover:bg-white hover:shadow-md transition cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-white group-hover:bg-[#C6A86A]/15 border border-[#E5E7EB] flex items-center justify-center text-[#1D4E89] group-hover:text-[#C6A86A] transition-colors mb-2">
                  <IconComp className="w-6 h-6 stroke-[1.75]" />
                </div>
                <span className="text-sm font-semibold text-[#1A1A1A] leading-snug">
                  {item.label}
                </span>
                <span className="text-xs text-[#6B7280] font-normal mt-0.5">
                  {item.desc}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
