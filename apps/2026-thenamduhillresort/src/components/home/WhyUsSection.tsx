'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'
import { Button } from '../common/Button'
import { Waves, Utensils, Wifi, Bus } from 'lucide-react'

export function WhyUsSection() {
  const { t } = useLanguage()

  const amenities = [
    { icon: Waves, label: t('Hồ bơi', 'Infinity Pool') },
    { icon: Utensils, label: t('Nhà hàng', 'Restaurant') },
    { icon: Wifi, label: t('Wifi miễn phí', 'Free Wifi') },
    { icon: Bus, label: t('Đưa đón', 'Transfer') },
  ]

  return (
    <section className="py-5 sm:py-7 bg-white border-b border-[#ECECEC]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Standardized Section Header (Mobile 16px font size per Figma) */}
        <div className="flex items-center justify-between mb-4">
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

        {/* 4 Icon Amenities Row */}
        <div className="grid grid-cols-4 gap-2 text-center">
          {amenities.map((item, idx) => {
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
      </div>
    </section>
  )
}
