'use client'

import { UI } from '@repo/core'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '../../context/LanguageContext'
import { MapPin, Mail, Phone, CheckCircle } from 'lucide-react'

export function Footer() {
  const { tx } = useLanguage()
  const pathname = usePathname()

  if (pathname?.startsWith('/checkout') || pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <footer className="bg-[#0F2D52] text-white mt-12 md:mt-20 pb-16 md:pb-0">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Column 1: Brand & Contact Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <img
              src="/uploads/OP5-b8f91eaa.png"
              alt="The Nam Du Hill Resort Logo"
              className="w-10 h-10 object-contain rounded-full bg-white p-1 shadow-sm"
            />
            <div className="flex flex-col leading-none">
              <span className="font-serif font-bold text-sm tracking-tight uppercase text-white">
                THE NAM DU HILL
              </span>
              <span className="text-[10px] text-white/70 font-medium tracking-widest uppercase">
                Resort
              </span>
            </div>
          </div>

          <p className="text-xs text-white/70 leading-relaxed">
            {tx(UI.theNamDuHillBusinessHousehold)}
          </p>

          <div className="space-y-2 text-xs text-white/90">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#C6A86A] flex-shrink-0 mt-0.5 stroke-[1.75]" />
              <span>
                {tx(UI.cuTronVillageNamDuIsland)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C6A86A] flex-shrink-0 stroke-[1.75]" />
              <a href="mailto:thenamduhill@gmail.com" className="hover:underline">
                thenamduhill@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C6A86A] flex-shrink-0 stroke-[1.75]" />
              <a href="tel:0985000650" className="text-base font-bold text-white hover:text-[#C6A86A] transition">
                0985 000 650
              </a>
            </div>
          </div>
        </div>

        {/* Column 2: Information */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
            {tx(UI.information)}
          </h3>
          <div className="w-8 h-0.5 bg-[#C6A86A] rounded-full" />
          <ul className="space-y-2 text-xs text-white/80">
            <li><a href="#" className="hover:text-white transition">{tx(UI.privacyPolicy)}</a></li>
            <li><a href="#" className="hover:text-white transition">{tx(UI.generalTerms)}</a></li>
            <li><a href="#" className="hover:text-white transition">{tx(UI.bookingGuide)}</a></li>
            <li><a href="#" className="hover:text-white transition">{tx(UI.cancellationPolicy)}</a></li>
            <li><a href="#" className="hover:text-white transition">{tx(UI.paymentOptions)}</a></li>
          </ul>
        </div>

        {/* Column 3: Explore */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
            {tx(UI.explore)}
          </h3>
          <div className="w-8 h-0.5 bg-[#C6A86A] rounded-full" />
          <ul className="space-y-2 text-xs text-white/80">
            <li><Link href="/rooms" className="hover:text-white transition">{tx(UI.roomList)}</Link></li>
            <li><Link href="/dining" className="hover:text-white transition">{tx(UI.diningBbq)}</Link></li>
            <li><Link href="/explore" className="hover:text-white transition">{tx(UI.exploreNamDu)}</Link></li>
            <li><Link href="/blog" className="hover:text-white transition">{tx(UI.travelJournal)}</Link></li>
            <li><Link href="/contact" className="hover:text-white transition">{tx(UI.contactUs)}</Link></li>
          </ul>
        </div>

        {/* Column 4: Social & Verification */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
            {tx(UI.connect)}
          </h3>
          <div className="w-8 h-0.5 bg-[#C6A86A] rounded-full" />
          
          <div className="flex gap-2">
            <a
              href="https://facebook.com/thenamduhill"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm hover:bg-white/20 transition"
            >
              f
            </a>
            <a
              href="https://zalo.me/0985000650"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs hover:bg-white/20 transition"
            >
              Za
            </a>
          </div>

          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl p-3">
            <CheckCircle className="w-4 h-4 text-[#C6A86A] flex-shrink-0 stroke-[1.75]" />
            <span className="text-[10px] font-semibold text-white/90 leading-tight">
              {tx(UI.registeredWithMinistryOfCommerce)}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Legal Line */}
      <div className="border-t border-white/10 py-4">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/60">
          <span>© 2026 The Nam Du Hill Resort · thenamduhill.com</span>
          <span>{tx(UI.bestRatesWhenBookingDirect)}</span>
        </div>
      </div>
    </footer>
  )
}
