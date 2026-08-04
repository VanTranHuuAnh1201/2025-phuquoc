'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'
import { Button } from '../common/Button'

export function PanoramaSection() {
  const { t } = useLanguage()

  const galleryItems = [
    {
      title: t('Bãi biển riêng', 'Private Beach'),
      subtitle: t('Yên bình & tĩnh lặng', 'Peaceful & Pristine'),
      image: '/uploads/hero-1.jpg',
    },
    {
      title: t('Hồ bơi vô cực', 'Infinity Pool'),
      subtitle: t('View biển 360°', '360° Ocean Panorama'),
      image: '/uploads/hero-2.jpg',
    },
    {
      title: t('Nhà hàng view biển', 'Oceanfront Dining'),
      subtitle: t('Ẩm thực hải tươi sống', 'Fresh Island Seafood'),
      image: '/uploads/pasted-1785690604574-0.png',
    },
    {
      title: t('Lặn ngắm san hô', 'Coral Reef Diving'),
      subtitle: t('Khám phá đại dương', 'Underwater Discovery'),
      image: '/uploads/pasted-1785691965790-0.png',
    },
  ]

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white border-b border-slate-200/60">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Standardized Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-widest block mb-1">
              {t('KHOẢNH KHẮC THIÊN NHIÊN', 'RESORT GALLERY')}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B192C] tracking-tight">
              {t('Khoảnh khắc tại The Nam Du Hill', 'Moments at The Nam Du Hill')}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1 max-w-xl">
              {t('Ghi lại những ký ức tuyệt đẹp và góc nhìn 360° ôm trọn biển đảo Nam Du', 'Capture unforgettable island memories and 360° ocean panoramas')}
            </p>
          </div>
          <Link href="/explore">
            <Button variant="secondary" size="md" radius="full" className="shadow-sm hover:shadow border border-slate-200 font-bold text-xs sm:text-sm text-[#0F2D52]">
              {t('Xem bộ sưu tập →', 'View Gallery →')}
            </Button>
          </Link>
        </div>

        {/* 2x2 Grid on Mobile, 4-col on Desktop (Image Radius 20px & Soft Shadow) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_45px_rgba(11,25,44,0.22)] hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer border border-slate-200/50"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C]/95 via-[#0B192C]/30 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-bold text-sm sm:text-base leading-tight drop-shadow-sm group-hover:text-[#FFB800] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-200 font-normal mt-1 line-clamp-1">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
