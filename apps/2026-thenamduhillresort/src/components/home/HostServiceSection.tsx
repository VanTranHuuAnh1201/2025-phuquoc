'use client'

import { UI } from '@repo/core'

import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { hostPerks, TESTIMONIALS } from '../../data/property'
import { iconFor } from '../../data/icons'
import { TestimonialColumns } from './TestimonialColumns'

export function HostServiceSection() {
  const { tx, language } = useLanguage()

  return (
    <section id="experience" className="py-5 sm:py-7 bg-white border-b border-[#ECECEC]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAFAF8] border border-[#ECECEC] rounded-[12px] p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          
          {/* Left Text */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1D4E89]">
              {tx(UI.hostAmenities)}
            </span>
            <h2 className="font-serif text-base sm:text-xl md:text-2xl font-bold text-[#1A1A1A] leading-snug">
              {tx(UI.youArePickedUpAtThe)}
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed font-normal">
              {tx(UI.privateRoundtripCarTransferFromCu)}
            </p>

            {/* Perks Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {hostPerks.map((perk) => {
                const IconComp = iconFor(perk.icon)
                return (
                  <span
                    key={perk.id}
                    className="inline-flex items-center gap-1.5 bg-white border border-[#ECECEC] text-[#0F2D52] text-xs font-medium px-3 py-1.5 rounded-full shadow-2xs"
                  >
                    <IconComp className="w-3.5 h-3.5 text-[#1D4E89]" />
                    <span>{tx(perk.label)}</span>
                  </span>
                )
              })}
            </div>
          </div>

          {/* Right — đánh giá của khách, ba cột cuộn lệch chiều */}
          <div>
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2.5">
              {language === 'vi' ? 'Khách đã ở nói gì' : 'What past guests say'}
            </p>
            <TestimonialColumns items={TESTIMONIALS} />
          </div>
        </div>
      </div>
    </section>
  )
}
