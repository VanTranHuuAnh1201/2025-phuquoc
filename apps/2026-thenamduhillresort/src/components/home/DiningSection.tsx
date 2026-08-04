'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'
import { Button } from '../common/Button'
import { Star } from 'lucide-react'

export function DiningSection() {
  const { t } = useLanguage()

  const reviews = [
    {
      name: 'Nguyễn Minh Tuấn',
      date: '12/06/2025',
      rating: 5,
      comment: t(
        'View đẹp, phòng sạch sẽ, nhân viên nhiệt tình. Sẽ quay lại lần sau!',
        'Stunning view, clean rooms, extremely friendly staff. Will definitely come back!'
      ),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    },
    {
      name: 'Trần Hồng Anh',
      date: '05/06/2025',
      rating: 5,
      comment: t(
        'Không gian yên tĩnh, phù hợp nghỉ dưỡng cùng gia đình. Rất hài lòng.',
        'Peaceful ambience, perfect for family vacations. Extremely satisfied.'
      ),
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    },
    {
      name: 'Lê Quốc Bảo',
      date: '01/06/2025',
      rating: 5,
      comment: t(
        'Đồ ăn ngon, hải sản tươi, bể bơi view biển cực chill!',
        'Delicious food, fresh seafood, the infinity ocean view pool is super relaxing!'
      ),
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    },
  ]

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#FAFAF8] border-b border-slate-200/60">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Standardized Luxury Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-widest block mb-1">
              {t('TRẢI NGHIỆM THỰC TẾ', 'VERIFIED GUEST REVIEWS')}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B192C] tracking-tight">
              {t('Khách hàng nói gì về chúng tôi', 'What Our Guests Say')}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1 max-w-xl">
              {t('Bạn được đón tận bến. Phần còn lại đã có người lo.', 'You are picked up at the pier. We take care of everything else.')}
            </p>
          </div>
          <Link href="/contact">
            <Button variant="secondary" size="md" radius="full" className="shadow-sm hover:shadow border border-slate-200 font-bold text-xs sm:text-sm text-[#0F2D52]">
              {t('Xem tất cả đánh giá →', 'View All Reviews →')}
            </Button>
          </Link>
        </div>

        {/* Content Layout: Score Card + Review Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Overall Rating Box (Primary Navy #0B192C, Luxury Card Radius 24px) */}
          <div className="bg-[#0B192C] text-white rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-[0_16px_40px_rgba(11,25,44,0.25)] border border-amber-400/30 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FFB800]/25 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
            
            <span className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight">
              4.9<span className="text-xl font-light text-white/60">/5</span>
            </span>
            <div className="flex items-center gap-1.5 text-[#FFB800] my-3">
              <Star className="w-5 h-5 fill-[#FFB800] text-[#FFB800] drop-shadow-[0_2px_8px_rgba(255,184,0,0.8)]" />
              <Star className="w-5 h-5 fill-[#FFB800] text-[#FFB800] drop-shadow-[0_2px_8px_rgba(255,184,0,0.8)]" />
              <Star className="w-5 h-5 fill-[#FFB800] text-[#FFB800] drop-shadow-[0_2px_8px_rgba(255,184,0,0.8)]" />
              <Star className="w-5 h-5 fill-[#FFB800] text-[#FFB800] drop-shadow-[0_2px_8px_rgba(255,184,0,0.8)]" />
              <Star className="w-5 h-5 fill-[#FFB800] text-[#FFB800] drop-shadow-[0_2px_8px_rgba(255,184,0,0.8)]" />
            </div>
            <span className="font-extrabold text-base text-[#FFB800] tracking-wide">
              {t('Tuyệt vời', 'Outstanding')}
            </span>
            <span className="text-xs text-white/80 mt-1 font-medium">
              {t('Dựa trên 83 đánh giá đã xác minh', 'Based on 83 verified reviews')}
            </span>
          </div>

          {/* User Review Cards (3 Columns, Card Radius 24px) */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {reviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_45px_rgba(15,45,82,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.avatar}
                        alt={rev.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-amber-400/40 shadow-xs"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-bold text-[#0F172A] leading-tight">
                          {rev.name}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                          {rev.date}
                        </span>
                      </div>
                    </div>
                    <div className="flex text-[#FFB800] gap-0.5">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#FFB800] text-[#FFB800] drop-shadow-[0_1px_4px_rgba(255,184,0,0.5)]" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic font-medium">
                    &quot;{rev.comment}&quot;
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold tracking-wide">
                  <span>✓</span>
                  <span>{t('Đã xác minh lưu trú', 'Verified Stay')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
