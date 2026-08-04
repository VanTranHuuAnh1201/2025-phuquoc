'use client'

import { UI } from '@repo/core'

import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { property } from '../../data/property'
import { SectionHeading } from '../common/SectionHeading'
import { Star } from 'lucide-react'

export function DiningSection() {
  const { tx } = useLanguage()

  const reviews = property.reviews ?? []

  return (
    <section className="py-5 sm:py-7 bg-[#FAFAF8] border-b border-[#ECECEC]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          title={tx(UI.whatOurGuestsSay)}
          description={tx(UI.youArePickedUpAtThe)}
          href="/contact"
          actionLabel={tx(UI.viewAll)}
        />

        {/* Content Layout: Score Card + Review Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          
          {/* Overall Rating Box */}
          <div className="bg-gradient-to-br from-[#0B192C] to-[#163B6C] text-white rounded-[12px] p-6 flex flex-col justify-center items-center text-center shadow-md border border-white/10">
            <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              4.9<span className="text-lg font-normal text-[#FFB800]">/5</span>
            </span>
            <div className="flex items-center gap-1 text-[#FFB800] my-2">
              <Star className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
              <Star className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
              <Star className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
              <Star className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
              <Star className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
            </div>
            <span className="font-bold text-sm text-white">
              {tx(UI.outstanding)}
            </span>
            <span className="text-xs text-white/70 mt-0.5">
              {tx(UI.basedOn83VerifiedReviews)}
            </span>
          </div>

          {/* User Review Cards (3 Columns, Card Radius 12px) */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
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
                    <div className="flex text-[#FFB800] gap-0.5">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-[#FFB800] text-[#FFB800]" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#4B5563] leading-relaxed italic">
                    &quot;{tx(rev.comment)}&quot;
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#ECECEC] flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                  <span>✓</span>
                  <span>{tx(UI.verifiedStay2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
