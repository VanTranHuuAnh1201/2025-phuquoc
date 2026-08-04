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
    <section id="explore" className="py-12 sm:py-16 lg:py-20 bg-white border-b border-slate-200/60">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        
        {/* Standardized Luxury Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-widest block mb-1">
              {t('21 HÒN ĐẢO · 9,12 KM²', '21 ISLANDS · 9.12 KM²')}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B192C] tracking-tight">
              {t('Khám phá quần đảo Nam Du', 'Explore Nam Du Archipelago')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg font-medium leading-relaxed">
            {t(
              'Sáng nào cũng có tàu gỗ rời bến ngay dưới chân đồi. Lễ tân đặt chỗ giúp từ tối hôm trước — 200.000–400.000₫ mỗi người.',
              'Wooden boats leave the pier below every morning. Reception books your seat the evening before.'
            )}
          </p>
        </div>

        {/* 4 Island Cards Grid with Luxury Visual Depth */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {islands.map((item, idx) => (
            <Link
              key={idx}
              href="/explore"
              className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_22px_50px_rgba(11,25,44,0.2)] hover:-translate-y-2 hover:border-[#FFB800] transition-all duration-300 group flex items-end p-5 border border-slate-200/50"
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C]/95 via-[#0B192C]/40 to-transparent" />
              
              <div className="relative z-10 text-white">
                <span className="text-[10px] font-extrabold text-[#FFB800] uppercase tracking-widest block mb-1">
                  {item.tag}
                </span>
                <h3 className="font-bold text-base sm:text-lg text-white leading-tight group-hover:text-[#FFB800] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-200 font-normal mt-1 line-clamp-2">
                  {item.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* 3 Itinerary Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          
          <Link
            href="/explore"
            className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-6 hover:bg-white hover:border-[#FFB800] hover:shadow-[0_16px_36px_rgba(255,184,0,0.18)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <span className="text-[11px] font-bold text-[#1D4E89] uppercase tracking-wider block mb-2">
                {t('LỊCH TRÌNH · 2 NGÀY 1 ĐÊM', 'ITINERARY · 2 DAYS 1 NIGHT')}
              </span>
              <h3 className="font-serif font-bold text-[#0B192C] text-base leading-snug">
                {t('Đi cuối tuần: chiều đầu đi tàu ra đảo nhỏ, sáng hôm sau chạy vòng 11 km.', 'Weekend run: island boat on first afternoon, 11 km loop on second morning.')}
              </h3>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-baseline gap-1.5 text-xs">
              <span className="font-extrabold text-[#0B192C] text-base">2,1 – 2,8tr</span>
              <span className="text-slate-500 font-medium">{t('mỗi khách, trọn gói', 'per person, all in')}</span>
            </div>
          </Link>

          <Link
            href="/explore"
            className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-6 hover:bg-white hover:border-[#FFB800] hover:shadow-[0_16px_36px_rgba(255,184,0,0.18)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <span className="text-[11px] font-bold text-[#1D4E89] uppercase tracking-wider block mb-2">
                {t('LỊCH TRÌNH · 3 NGÀY 2 ĐÊM', 'ITINERARY · 3 DAYS 2 NIGHTS')}
              </span>
              <h3 className="font-serif font-bold text-[#0B192C] text-base leading-snug">
                {t('Đi thong thả: trọn một ngày trên biển qua bốn đảo, thêm hải đăng và đền miếu.', 'Unhurried: a full day at sea across four islands, plus the lighthouse.')}
              </h3>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-baseline gap-1.5 text-xs">
              <span className="font-extrabold text-[#0B192C] text-base">2,8 – 4,0tr</span>
              <span className="text-slate-500 font-medium">{t('mỗi khách, trọn gói', 'per person, all in')}</span>
            </div>
          </Link>

          <Link
            href="/explore"
            className="bg-gradient-to-br from-[#1D4E89] to-[#0B192C] text-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group border border-white/10"
          >
            <div>
              <span className="text-[11px] font-bold text-[#FFB800] uppercase tracking-wider block mb-2">
                {t('CẨM NANG ĐẦY ĐỦ', 'FULL GUIDE')}
              </span>
              <h3 className="font-serif font-bold text-white text-base leading-snug">
                {t('Tàu xe, giá cả, mùa đẹp nhất và những thứ cần mang theo.', 'Boats, scooters, prices, best season and packing list.')}
              </h3>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs sm:text-sm font-bold text-white group-hover:translate-x-1.5 transition-transform">
              <span>{t('Khám phá Nam Du', 'Explore Nam Du')}</span>
              <ArrowRight className="w-4 h-4 text-[#FFB800]" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
