'use client'

import { UI } from '@repo/core'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'
import { facilityAmenities } from '../../data/property'
import { iconFor } from '../../data/icons'
import { Button } from '../common/Button'

export function WhyUsSection() {
  const { tx } = useLanguage()

  return (
    <section className="py-5 sm:py-8 bg-white border-b border-[#ECECEC]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Standardized Section Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="font-serif text-base sm:text-xl md:text-2xl font-bold text-[#1A1A1A] tracking-tight">
              {tx(UI.featuredAmenities2)}
            </h2>
          </div>
          <Link href="/explore">
            <Button variant="secondary" size="sm" radius="6px">
              {tx(UI.readMore)}
            </Button>
          </Link>
        </div>

        {/* 📱 MOBILE VIEW: 4 Icon Amenities Row (100% Intact) */}
        <div className="grid grid-cols-4 gap-2 text-center md:hidden">
          {facilityAmenities.slice(0, 4).map((item) => {
            const IconComp = iconFor(item.icon)
            return (
              <div
                key={item.id}
                className="flex flex-col items-center justify-center p-2 rounded-[12px] hover:bg-[#F5F7FA] transition cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-[#F5F7FA] group-hover:bg-[#C6A86A]/15 flex items-center justify-center text-[#1D4E89] group-hover:text-[#C6A86A] transition-colors mb-1.5">
                  <IconComp className="w-5 h-5 stroke-[1.75]" />
                </div>
                <span className="text-xs font-medium text-[#4B5563] leading-tight">
                  {tx(item.label)}
                </span>
              </div>
            )
          })}
        </div>

        {/* 🖥️ DESKTOP VIEW: 6 Amenities Row with Subtitles (Figma 3-desktop.png) */}
        <div className="hidden md:grid md:grid-cols-6 gap-4 text-center">
          {facilityAmenities.map((item) => {
            const IconComp = iconFor(item.icon)
            return (
              <div
                key={item.id}
                className="flex flex-col items-center justify-center p-4 rounded-[12px] bg-[#FAFAF8] border border-[#ECECEC] hover:bg-white hover:shadow-md transition cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-white group-hover:bg-[#C6A86A]/15 border border-[#E5E7EB] flex items-center justify-center text-[#1D4E89] group-hover:text-[#C6A86A] transition-colors mb-2">
                  <IconComp className="w-6 h-6 stroke-[1.75]" />
                </div>
                <span className="text-sm font-semibold text-[#1A1A1A] leading-snug">
                  {tx(item.label)}
                </span>
                <span className="text-xs text-[#6B7280] font-normal mt-0.5">
                  {item.desc ? tx(item.desc) : null}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
