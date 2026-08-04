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
    <section className="py-12 sm:py-16 lg:py-20 bg-white border-b border-slate-200/60">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Standardized Luxury Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-widest block mb-1">
              {t('DỊCH VỤ & TIỆN ÍCH ĐẲNG CẤP', 'LUXURY AMENITIES & SERVICES')}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B192C] tracking-tight">
              {t('Tiện ích đặc quyền tại Resort', 'Exclusive Resort Amenities')}
            </h2>
          </div>
          <Link href="/explore">
            <Button variant="secondary" size="md" radius="full" className="shadow-sm hover:shadow border border-slate-200 font-bold text-xs sm:text-sm text-[#0F2D52]">
              {t('Xem tất cả dịch vụ →', 'Explore All Services →')}
            </Button>
          </Link>
        </div>

        {/* 📱 MOBILE VIEW: 4 Icon Amenities Row (Interactive Cards) */}
        <div className="grid grid-cols-4 gap-3 text-center md:hidden">
          {mobileAmenities.map((item, idx) => {
            const IconComp = item.icon
            return (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-full bg-white group-hover:bg-[#FFB800] shadow-sm flex items-center justify-center text-[#1D4E89] group-hover:text-slate-950 transition-all duration-300 mb-2">
                  <IconComp className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-xs font-bold text-[#0F172A] leading-tight">
                  {item.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* 🖥️ DESKTOP VIEW: 6 Amenities Cards with Shadows and Micro-interactions */}
        <div className="hidden md:grid md:grid-cols-6 gap-5 text-center">
          {desktopAmenities.map((item, idx) => {
            const IconComp = item.icon
            return (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:bg-white hover:border-[#FFB800] hover:shadow-[0_16px_36px_rgba(255,184,0,0.2)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white group-hover:bg-[#FFB800] border border-slate-200/80 shadow-sm flex items-center justify-center text-[#1D4E89] group-hover:text-slate-950 transition-all duration-300 mb-3 group-hover:scale-110">
                  <IconComp className="w-6 h-6 stroke-[2]" />
                </div>
                <span className="text-sm font-bold text-[#0F172A] leading-snug group-hover:text-[#1D4E89] transition-colors">
                  {item.label}
                </span>
                <span className="text-xs text-slate-500 font-medium mt-1 leading-tight">
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
