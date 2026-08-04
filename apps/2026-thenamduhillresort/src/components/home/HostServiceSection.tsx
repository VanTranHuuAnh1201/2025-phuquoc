'use client'

import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { Car, Anchor, Utensils, Gamepad2, Bike, Headphones, Star } from 'lucide-react'

export function HostServiceSection() {
  const { t } = useLanguage()

  const perks = [
    { icon: Car, label: t('Đón tiễn bến tàu miễn phí', 'Free pier transfer') },
    { icon: Anchor, label: t('Tour cano lặn ngắm san hô', 'Private canoe & snorkeling') },
    { icon: Utensils, label: t('Bữa sáng ngắm biển', 'Seaview breakfast') },
    { icon: Gamepad2, label: t('Bàn bida & giải trí', 'Billiards & games') },
    { icon: Bike, label: t('Cho thuê xe máy đồi', 'Motorbike rental') },
    { icon: Headphones, label: t('Hỗ trợ 24/7', '24/7 support') },
  ]

  return (
    <section id="experience" className="py-12 sm:py-16 lg:py-20 bg-[#FAFAF8] border-b border-slate-200/60">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-[0_16px_40px_rgba(15,45,82,0.06)] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Text */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F59E0B]">
              {t('CHỦ NHÀ & TIỆN ÍCH ĐI KÈM', 'HOST & INCLUDED SERVICES')}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B192C] leading-tight">
              {t('Bạn được đón tận bến. Phần còn lại đã có người lo.', 'Met at the pier. The rest is taken care of.')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {t(
                'Xe riêng đưa đón hai chiều từ bến tàu Củ Tron miễn phí, tour cano lặn ngắm san hô Hòn Dầu – Hòn Ngang sắp xếp theo yêu cầu, và luôn có người trực máy bất kể giờ nào.',
                'Private roundtrip car transfer from Cu Tron pier, private canoe & snorkeling tours arranged on demand, and 24/7 friendly host support.'
              )}
            </p>

            {/* Perks Badges */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              {perks.map((perk, idx) => {
                const IconComp = perk.icon
                return (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 bg-[#F8FAFC] border border-slate-200/80 hover:border-[#1D4E89] hover:bg-[#F0F5FA] text-[#0B192C] text-xs font-semibold px-3.5 py-2 rounded-full shadow-2xs transition-all duration-200 cursor-pointer"
                  >
                    <IconComp className="w-4 h-4 text-[#1D4E89]" />
                    <span>{perk.label}</span>
                  </span>
                )
              })}
            </div>
          </div>

          {/* Right Host Testimonials Stack */}
          <div className="grid grid-cols-1 gap-4">
            <blockquote className="bg-[#F8FAFC] rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-300">
              <div className="flex text-[#FFB800] gap-1 mb-3">
                <Star className="w-4.5 h-4.5 fill-[#FFB800] text-[#FFB800] drop-shadow-[0_1px_4px_rgba(255,184,0,0.5)]" />
                <Star className="w-4.5 h-4.5 fill-[#FFB800] text-[#FFB800] drop-shadow-[0_1px_4px_rgba(255,184,0,0.5)]" />
                <Star className="w-4.5 h-4.5 fill-[#FFB800] text-[#FFB800] drop-shadow-[0_1px_4px_rgba(255,184,0,0.5)]" />
                <Star className="w-4.5 h-4.5 fill-[#FFB800] text-[#FFB800] drop-shadow-[0_1px_4px_rgba(255,184,0,0.5)]" />
                <Star className="w-4.5 h-4.5 fill-[#FFB800] text-[#FFB800] drop-shadow-[0_1px_4px_rgba(255,184,0,0.5)]" />
              </div>
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed font-medium">
                {t('“Bà chủ rất chu đáo, tận tâm với khách hàng. Chu đáo từng bữa ăn đến lịch trình đi đảo.”', '“The host is genuinely attentive — she checked on us more than any hotel we’ve stayed at.”')}
              </p>
              <footer className="text-[11px] font-bold text-slate-500 mt-3 uppercase tracking-wider">
                Ngọc Anh · TP.HCM
              </footer>
            </blockquote>

            <blockquote className="bg-[#0B192C] text-white rounded-2xl p-5 shadow-lg border border-amber-400/30 hover:shadow-xl transition-all duration-300">
              <div className="flex text-[#FFB800] gap-1 mb-3">
                <Star className="w-4.5 h-4.5 fill-[#FFB800] text-[#FFB800] drop-shadow-[0_1px_4px_rgba(255,184,0,0.5)]" />
                <Star className="w-4.5 h-4.5 fill-[#FFB800] text-[#FFB800] drop-shadow-[0_1px_4px_rgba(255,184,0,0.5)]" />
                <Star className="w-4.5 h-4.5 fill-[#FFB800] text-[#FFB800] drop-shadow-[0_1px_4px_rgba(255,184,0,0.5)]" />
                <Star className="w-4.5 h-4.5 fill-[#FFB800] text-[#FFB800] drop-shadow-[0_1px_4px_rgba(255,184,0,0.5)]" />
                <Star className="w-4.5 h-4.5 fill-[#FFB800] text-[#FFB800] drop-shadow-[0_1px_4px_rgba(255,184,0,0.5)]" />
              </div>
              <p className="text-xs sm:text-sm text-white/95 italic leading-relaxed font-medium">
                {t('“Dậy ngắm bình minh rồi ngồi luôn trên sân thượng tới lúc chợ đêm lên đèn.”', '“We woke for the sunrise and stayed on the terrace until the night market lit up.”')}
              </p>
              <footer className="text-[11px] font-bold text-[#FFB800] mt-3 uppercase tracking-wider">
                Minh Trí · Cần Thơ
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}
