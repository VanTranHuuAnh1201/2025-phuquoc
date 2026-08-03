'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'
import { ArrowRight } from 'lucide-react'

export function ExploreSection() {
  const { t } = useLanguage()

  const islands = [
    {
      title: 'Hòn Hai Bờ Đập',
      tag: t('MALDIVES THU NHỎ', 'MINI MALDIVES'),
      desc: t('Hai đảo nối nhau bằng dải đá tự nhiên — chỗ lặn ngắm san hô.', 'Two islets joined by a natural stone causeway.'),
      image: '/uploads/hero-1.jpg',
    },
    {
      title: 'Hòn Mấu',
      tag: t('5 BÃI BIỂN', 'FIVE BEACHES'),
      desc: t('Đầu này cát trắng, đầu kia toàn đá cuội đen bóng.', 'White sand at one end, polished black pebbles at the other.'),
      image: '/uploads/pasted-1785691965790-0.png',
    },
    {
      title: 'Bãi Cây Mến',
      tag: t('4 PHÚT XE MÁY', '4 MIN BY BIKE'),
      desc: t('Bãi đẹp nhất đảo, dưới hàng dừa 80 năm tuổi.', 'The prettiest beach on the island, under 80-year-old palms.'),
      image: '/uploads/pasted-1785690604574-0.png',
    },
    {
      title: 'Hải đăng Nam Du',
      tag: '309 M',
      desc: t('Từ trên đỉnh nhìn thấy cả 21 hòn đảo cùng lúc.', 'From the top you see all 21 islands at once.'),
      image: '/uploads/hero-2.jpg',
    },
  ]

  return (
    <section id="explore" className="py-5 sm:py-7 bg-white border-b border-[#ECECEC]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        
        {/* Standardized Section Header (Mobile 16px font size per Figma) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-[#1D4E89]">
              {t('21 hòn đảo · 9,12 km²', '21 islands · 9.12 km²')}
            </span>
            <h2 className="font-serif text-base sm:text-xl md:text-2xl font-bold text-[#1A1A1A] tracking-tight mt-0.5">
              {t('Khám phá quần đảo Nam Du', 'Explore Nam Du Archipelago')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] max-w-lg font-normal">
            {t(
              'Sáng nào cũng có tàu gỗ rời bến ngay dưới chân đồi. Lễ tân đặt chỗ giúp từ tối hôm trước — 200.000–400.000₫ mỗi người.',
              'Wooden boats leave the pier below every morning. Reception books your seat the evening before.'
            )}
          </p>
        </div>

        {/* 4 Island Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {islands.map((item, idx) => (
            <Link
              key={idx}
              href="/explore"
              className="relative aspect-[4/3] rounded-[16px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex items-end p-4"
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101828]/90 via-[#101828]/40 to-transparent" />
              
              <div className="relative z-10 text-white">
                <span className="text-[10px] font-semibold text-[#C6A86A] uppercase tracking-wider block mb-1">
                  {item.tag}
                </span>
                <h3 className="font-bold text-base text-white leading-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-white/80 font-normal mt-1 line-clamp-2">
                  {item.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* 3 Itinerary Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          <Link
            href="/explore"
            className="bg-[#FAFAF8] border border-[#ECECEC] rounded-[12px] p-5 hover:bg-white hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-semibold text-[#1D4E89] uppercase tracking-wider block mb-2">
                {t('LỊCH TRÌNH · 2 NGÀY 1 ĐÊM', 'ITINERARY · 2 DAYS 1 NIGHT')}
              </span>
              <h3 className="font-serif font-bold text-[#1A1A1A] text-sm leading-snug">
                {t('Đi cuối tuần: chiều đầu đi tàu ra đảo nhỏ, sáng hôm sau chạy vòng 11 km.', 'Weekend run: island boat on first afternoon, 11 km loop on second morning.')}
              </h3>
            </div>
            <div className="mt-4 pt-3 border-t border-[#ECECEC] flex items-baseline gap-1 text-xs">
              <span className="font-bold text-[#0F2D52] text-sm">2,1 – 2,8tr</span>
              <span className="text-[#6B7280]">{t('mỗi khách, trọn gói', 'per person, all in')}</span>
            </div>
          </Link>

          <Link
            href="/explore"
            className="bg-[#FAFAF8] border border-[#ECECEC] rounded-[12px] p-5 hover:bg-white hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-semibold text-[#1D4E89] uppercase tracking-wider block mb-2">
                {t('LỊCH TRÌNH · 3 NGÀY 2 ĐÊM', 'ITINERARY · 3 DAYS 2 NIGHTS')}
              </span>
              <h3 className="font-serif font-bold text-[#1A1A1A] text-sm leading-snug">
                {t('Đi thong thả: trọn một ngày trên biển qua bốn đảo, thêm hải đăng và đền miếu.', 'Unhurried: a full day at sea across four islands, plus the lighthouse.')}
              </h3>
            </div>
            <div className="mt-4 pt-3 border-t border-[#ECECEC] flex items-baseline gap-1 text-xs">
              <span className="font-bold text-[#0F2D52] text-sm">2,8 – 4,0tr</span>
              <span className="text-[#6B7280]">{t('mỗi khách, trọn gói', 'per person, all in')}</span>
            </div>
          </Link>

          <Link
            href="/explore"
            className="bg-gradient-to-br from-[#1D4E89] to-[#0F2D52] text-white rounded-[12px] p-5 shadow-md flex flex-col justify-between hover:shadow-lg transition group"
          >
            <div>
              <span className="text-[10px] font-semibold text-[#C6A86A] uppercase tracking-wider block mb-2">
                {t('CẨM NANG ĐẦY ĐỦ', 'FULL GUIDE')}
              </span>
              <h3 className="font-serif font-bold text-white text-sm leading-snug">
                {t('Tàu xe, giá cả, mùa đẹp nhất và những thứ cần mang theo.', 'Boats, scooters, prices, best season and packing list.')}
              </h3>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-white group-hover:translate-x-1 transition-transform">
              <span>{t('Khám phá Nam Du', 'Explore Nam Du')}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
