'use client'

import { UI } from '@repo/core'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'
import { featuredPlaces } from '../../data/property'

export function ExploreSection() {
  const { tx } = useLanguage()

  return (
    <section id="explore" className="py-5 sm:py-7 bg-white border-b border-[#ECECEC]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-5">

        {/* Standardized Section Header (Mobile 16px font size per Figma) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-[#1D4E89]">
              {tx(UI.n21Islands912Km)}
            </span>
            <h2 className="font-serif text-base sm:text-xl md:text-2xl font-bold text-[#1A1A1A] tracking-tight mt-0.5">
              {tx(UI.exploreNamDuArchipelago)}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] max-w-lg font-normal">
            {tx(UI.woodenBoatsLeaveThePierBelow)}
          </p>
        </div>

        {/* 4 Island Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredPlaces.map((item) => (
            <Link
              key={item.id}
              href="/explore"
              className="relative aspect-[4/3] rounded-[16px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex items-end p-4"
            >
              <img
                src={item.image}
                alt={tx(item.name)}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101828]/90 via-[#101828]/40 to-transparent" />

              <div className="relative z-10 text-white">
                <span className="text-[10px] font-semibold text-[#C6A86A] uppercase tracking-wider block mb-1">
                  {tx(item.tag)}
                </span>
                <h3 className="font-bold text-base text-white leading-tight">
                  {tx(item.name)}
                </h3>
                <p className="text-xs text-white/80 font-normal mt-1 line-clamp-2">
                  {tx(item.desc)}
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
                {tx(UI.itinerary2Days1Night)}
              </span>
              <h3 className="font-serif font-bold text-[#1A1A1A] text-sm leading-snug">
                {tx(UI.weekendRunIslandBoatOnFirst)}
              </h3>
            </div>
            <div className="mt-4 pt-3 border-t border-[#ECECEC] flex items-baseline gap-1 text-xs">
              <span className="font-bold text-[#0F2D52] text-sm">2,1 – 2,8tr</span>
              <span className="text-[#6B7280]">{tx(UI.perPersonAllIn)}</span>
            </div>
          </Link>

          <Link
            href="/explore"
            className="bg-[#FAFAF8] border border-[#ECECEC] rounded-[12px] p-5 hover:bg-white hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-semibold text-[#1D4E89] uppercase tracking-wider block mb-2">
                {tx(UI.itinerary3Days2Nights)}
              </span>
              <h3 className="font-serif font-bold text-[#1A1A1A] text-sm leading-snug">
                {tx(UI.unhurriedAFullDayAtSea)}
              </h3>
            </div>
            <div className="mt-4 pt-3 border-t border-[#ECECEC] flex items-baseline gap-1 text-xs">
              <span className="font-bold text-[#0F2D52] text-sm">2,8 – 4,0tr</span>
              <span className="text-[#6B7280]">{tx(UI.perPersonAllIn)}</span>
            </div>
          </Link>

          <Link
            href="/explore"
            className="bg-gradient-to-br from-[#1D4E89] to-[#0F2D52] text-white rounded-[12px] p-5 shadow-md flex flex-col justify-between hover:shadow-lg transition group"
          >
            <div>
              <span className="text-[10px] font-semibold text-[#C6A86A] uppercase tracking-wider block mb-2">
                {tx(UI.fullGuide)}
              </span>
              <h3 className="font-serif font-bold text-white text-sm leading-snug">
                {tx(UI.boatsScootersPricesBestSeasonAnd)}
              </h3>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-white group-hover:translate-x-1 transition-transform">
              <span>{tx(UI.exploreNamDu)}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
