'use client'

import { UI } from '@repo/core'

import React, { useState } from 'react'
import Link from 'next/link'
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
    <section className="py-5 sm:py-7 bg-white border-b border-[#ECECEC]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-7 sm:space-y-10">
        
        {/* 1. Special Offer Promo Banner */}
        <div>
          <h2 className="font-serif text-base sm:text-xl md:text-2xl font-bold text-[#1A1A1A] tracking-tight mb-3">
            {tx(UI.specialOffers)}
          </h2>
          <div className="relative overflow-hidden rounded-[12px] bg-gradient-to-r from-[#0F2D52] via-[#163B6C] to-[#1D4E89] text-white p-6 sm:p-8 shadow-md">
            {/* Background Decorative Graphic */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-blue-400 to-transparent" />
            
            <div className="relative z-10 max-w-xl space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#C6A86A]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{tx(UI.summerSpecial)}</span>
              </div>
              <h3 className="font-serif text-xl sm:text-3xl font-bold leading-tight">
                {tx(UI.getUpTo20OffEarly)}
              </h3>
              <p className="text-xs sm:text-sm text-white/90 font-normal">
                {tx(UI.book14DaysInAdvanceTo)}
              </p>
              <div className="pt-2">
                <Link href="/rooms">
                  <Button variant="secondary" size="md" radius="6px">
                    {tx(UI.viewDetails)}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Resort Location Map Box */}
        <div>
          <h2 className="font-serif text-base sm:text-xl md:text-2xl font-bold text-[#1A1A1A] tracking-tight mb-3">
            {tx(UI.ourLocation)}
          </h2>
          <div className="bg-[#FAFAF8] border border-[#ECECEC] rounded-[12px] overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-3">
            {/* Map Preview Visual */}
            <div className="relative md:col-span-2 h-48 sm:h-64 bg-[#E5E7EB] overflow-hidden">
              <img
                src="/uploads/hero-2.jpg"
                alt="Bản đồ Nam Du"
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="bg-white p-3 rounded-full shadow-2xl animate-bounce">
                  <MapPin className="w-6 h-6 text-[#1D4E89]" />
                </div>
              </div>
            </div>

            {/* Location Info Box */}
            <div className="p-5 sm:p-6 flex flex-col justify-between gap-4 bg-white">
              <div>
                <div className="flex items-center gap-2 text-[#0F2D52] font-serif font-bold text-base">
                  <MapPin className="w-4 h-4 text-[#1D4E89]" />
                  <span>The Nam Du Hill Resort</span>
                </div>
                <p className="text-xs text-[#4B5563] mt-2 leading-relaxed font-normal">
                  {tx(UI.cuTronVillageNamDuIsland2)}
                </p>
              </div>

              <a
                href="https://maps.google.com/?q=The+Nam+Du+Hill+Resort"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="outline" size="md" fullWidth radius="6px">
                  <span className="flex items-center justify-center gap-1.5">
                    {tx(UI.viewOnGoogleMaps)}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* 3. Newsletter Subscription Box */}
        <div>
          <h2 className="font-serif text-base sm:text-xl md:text-2xl font-bold text-[#1A1A1A] tracking-tight mb-3">
            {tx(UI.joinForExclusiveOffers)}
          </h2>
          <div className="bg-[#FAFAF8] border border-[#ECECEC] rounded-[12px] p-5 sm:p-7 max-w-2xl">
            <p className="text-xs sm:text-sm text-[#4B5563] mb-4 font-normal">
              {tx(UI.getTheLatestResortPromotionsAnd)}
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[8px] text-emerald-700 text-xs font-semibold">
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
                  className="flex-1 h-[42px] bg-white border border-[#E5E7EB] rounded-[8px] px-3.5 text-xs sm:text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1D4E89] shadow-sm"
                />
                <Button type="submit" variant="primary" size="md" radius="6px">
                  <span className="flex items-center justify-center gap-1.5">
                    <Send className="w-3.5 h-3.5" />
                    <span>{tx(UI.subscribe)}</span>
                  </span>
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
