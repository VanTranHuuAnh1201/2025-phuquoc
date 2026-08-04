'use client'

import { UI } from '@repo/core'

import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { hostPerks } from '../../data/property'
import { iconFor } from '../../data/icons'
import { Star } from 'lucide-react'

export function HostServiceSection() {
  const { tx } = useLanguage()

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

          {/* Right Host Testimonials Stack */}
          <div className="grid grid-cols-1 gap-3">
            <blockquote className="bg-white rounded-[12px] p-4 border border-[#ECECEC] shadow-2xs hover:shadow-sm transition">
              <div className="flex text-[#C6A86A] gap-0.5 mb-2">
                <Star className="w-3.5 h-3.5 fill-[#C6A86A]" />
                <Star className="w-3.5 h-3.5 fill-[#C6A86A]" />
                <Star className="w-3.5 h-3.5 fill-[#C6A86A]" />
                <Star className="w-3.5 h-3.5 fill-[#C6A86A]" />
                <Star className="w-3.5 h-3.5 fill-[#C6A86A]" />
              </div>
              <p className="text-xs text-[#4B5563] italic leading-relaxed">
                {tx(UI.theHostIsGenuinelyAttentiveShe)}
              </p>
              <footer className="text-[10px] font-semibold text-[#6B7280] mt-2 uppercase tracking-wider">
                Ngọc Anh · TP.HCM
              </footer>
            </blockquote>

            <blockquote className="bg-[#0F2D52] text-white rounded-[12px] p-4 shadow-sm">
              <div className="flex text-[#C6A86A] gap-0.5 mb-2">
                <Star className="w-3.5 h-3.5 fill-[#C6A86A]" />
                <Star className="w-3.5 h-3.5 fill-[#C6A86A]" />
                <Star className="w-3.5 h-3.5 fill-[#C6A86A]" />
                <Star className="w-3.5 h-3.5 fill-[#C6A86A]" />
                <Star className="w-3.5 h-3.5 fill-[#C6A86A]" />
              </div>
              <p className="text-xs text-white/95 italic leading-relaxed">
                {tx(UI.weWokeForTheSunriseAnd)}
              </p>
              <footer className="text-[10px] font-semibold text-white/70 mt-2 uppercase tracking-wider">
                Minh Trí · Cần Thơ
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}
