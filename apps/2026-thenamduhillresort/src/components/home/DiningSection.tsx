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
    <section className="py-5 sm:py-7 bg-[#FAFAF8] border-b border-[#ECECEC]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Standardized Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-serif text-base sm:text-xl md:text-2xl font-bold text-[#1A1A1A] tracking-tight">
              {t('Khách hàng nói gì về chúng tôi', 'What Our Guests Say')}
            </h2>
            <p className="text-xs sm:text-sm font-normal text-[#6B7280] mt-0.5">
              {t('Bạn được đón tận bến. Phần còn lại đã có người lo.', 'You are picked up at the pier. We take care of everything else.')}
            </p>
          </div>
          <Link href="/contact">
            <Button variant="secondary" size="sm" radius="6px">
              {t('Xem tất cả', 'View all')}
            </Button>
          </Link>
        </div>

        {/* Content Layout: Score Card + Review Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          
          {/* Overall Rating Box (Primary Navy #0F2D52, Card Radius 12px) */}
          <div className="bg-[#0F2D52] text-white rounded-[12px] p-6 flex flex-col justify-center items-center text-center shadow-sm">
            <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              4.9<span className="text-lg font-normal text-white/60">/5</span>
            </span>
            <div className="flex items-center gap-1 text-[#C6A86A] my-2">
              <Star className="w-4 h-4 fill-[#C6A86A]" />
              <Star className="w-4 h-4 fill-[#C6A86A]" />
              <Star className="w-4 h-4 fill-[#C6A86A]" />
              <Star className="w-4 h-4 fill-[#C6A86A]" />
              <Star className="w-4 h-4 fill-[#C6A86A]" />
            </div>
            <span className="font-bold text-sm text-white">
              {t('Tuyệt vời', 'Outstanding')}
            </span>
            <span className="text-xs text-white/70 mt-0.5">
              {t('Dựa trên 83 đánh giá', 'Based on 83 verified reviews')}
            </span>
          </div>

          {/* User Review Cards (3 Columns, Card Radius 12px) */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {reviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[12px] p-4 border border-[#ECECEC] shadow-sm flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={rev.avatar}
                        alt={rev.name}
                        className="w-8 h-8 rounded-full object-cover border border-[#ECECEC]"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#1A1A1A] leading-tight">
                          {rev.name}
                        </span>
                        <span className="text-[10px] text-[#6B7280]">
                          {rev.date}
                        </span>
                      </div>
                    </div>
                    <div className="flex text-[#C6A86A] gap-0.5">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-[#C6A86A]" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#4B5563] leading-relaxed italic">
                    &quot;{rev.comment}&quot;
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#ECECEC] flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
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
