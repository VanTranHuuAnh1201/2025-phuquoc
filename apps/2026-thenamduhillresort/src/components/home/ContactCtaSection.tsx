'use client'

import { UI } from '@repo/core'

import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { Button } from '../common/Button'
import { MapPin, Sparkles, Send, ExternalLink } from 'lucide-react'

export function ContactCtaSection() {
  const { tx } = useLanguage()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <section className="py-6 sm:py-9 bg-[#FAFAF8] border-b border-[#ECECEC]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Streamlined 2-Column Luxury Grid: Location + Exclusive Offers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          {/* Card 1: Vị Trí Của Chúng Tôi (Resort Location) */}
          <div className="bg-white border border-[#ECECEC] rounded-[16px] overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between p-6 sm:p-7">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFB800] uppercase tracking-wider bg-[#FFFBEB] px-3 py-1 rounded-full border border-[#FFEBAA]">
                  <MapPin className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>{tx(UI.ourLocation)}</span>
                </span>
                <span className="text-[11px] font-medium text-[#6B7280]">Áp Củ Tron, Nam Du</span>
              </div>

              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0F2D52] tracking-tight">
                  The Nam Du Hill Resort
                </h3>
                <p className="text-xs sm:text-sm text-[#4B5563] mt-1.5 leading-relaxed font-normal">
                  {tx(UI.cuTronVillageNamDuIsland2)}
                </p>
              </div>

              {/* Compact Map Preview Banner */}
              <div className="relative h-32 sm:h-36 rounded-[12px] overflow-hidden bg-[#E5E7EB] border border-[#ECECEC] group">
                <img
                  src="/uploads/hero-2.jpg"
                  alt="Bản đồ vị trí Nam Du"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center">
                  <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-2 text-xs font-bold text-[#0F2D52]">
                    <MapPin className="w-4 h-4 text-[#1D4E89]" />
                    <span>Đỉnh Đồi Hòn Lớn · View Biển 360°</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2">
              <a
                href="https://maps.google.com/?q=The+Nam+Du+Hill+Resort"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="outline" size="md" fullWidth radius="8px">
                  <span className="flex items-center justify-center gap-2 text-xs font-bold text-[#1D4E89]">
                    <span>{tx(UI.viewOnGoogleMaps)}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </Button>
              </a>
            </div>
          </div>

          {/* Card 2: Tham Gia Nhận Ưu Đãi (Newsletter & Exclusive Privileges) */}
          <div className="bg-gradient-to-br from-[#0B192C] via-[#0F2D52] to-[#163B6C] text-white rounded-[16px] p-6 sm:p-7 shadow-md border border-white/10 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#FFB800] border border-[#FFB800]/30">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>{tx(UI.summerSpecial)}</span>
                </span>
                <span className="text-[11px] font-medium text-white/70">Ưu Đãi Đặt Phụ Thuộc Số Lượng</span>
              </div>

              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                  {tx(UI.joinForExclusiveOffers)}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 mt-1.5 leading-relaxed font-normal">
                  {tx(UI.getTheLatestResortPromotionsAnd)}
                </p>
              </div>
            </div>

            <div className="pt-5">
              {subscribed ? (
                <div className="p-3.5 bg-emerald-500/20 border border-emerald-400/40 rounded-[10px] text-emerald-300 text-xs font-semibold text-center backdrop-blur-md">
                  ✓ {tx(UI.thankYouForSubscribing)}
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    placeholder={tx(UI.yourEmailAddress)}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 h-[44px] bg-white/10 border border-white/20 rounded-[8px] px-3.5 text-xs sm:text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-[#FFB800] focus:bg-white/15 transition backdrop-blur-md"
                  />
                  <Button type="submit" variant="primary" size="md" radius="8px">
                    <span className="flex items-center justify-center gap-2 font-bold">
                      <Send className="w-3.5 h-3.5" />
                      <span>{tx(UI.subscribe)}</span>
                    </span>
                  </Button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
