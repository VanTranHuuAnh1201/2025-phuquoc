'use client'

import { UI } from '@repo/core'

import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { Button } from '../../components/common/Button'
import { MapPin, Mail, Clock, Send, MessageCircle, Navigation, CheckCircle } from 'lucide-react'

export default function ContactPage() {
  const { tx } = useLanguage()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] pt-20 pb-20">
      {/* Hero / Header Section */}
      <section className="bg-white border-b border-[#ECECEC] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D4E89]/10 text-[#1D4E89] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{tx(UI.n247ReceptionSupport)}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F2D52] tracking-tight">
            {tx(UI.contactReservations)}
          </h1>

          <p className="text-sm sm:text-base text-[#4B5563] max-w-2xl leading-relaxed">
            {tx(UI.sendARequestOrMessageOn)}
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Quick Booking Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-[#ECECEC] rounded-[12px] p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#0F2D52]">
                {tx(UI.quickReservationRequest)}
              </h2>
              <p className="text-xs text-[#6B7280] mt-1">
                {tx(UI.ourReceptionistWillConfirmYourInquiry)}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-[#1A1A1A]">
                    {tx(UI.fullName)}
                  </label>
                  <input
                    required
                    type="text"
                    placeholder={tx(UI.enterFullName)}
                    className="w-full border border-[#D1D5DB] rounded-[6px] px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1D4E89]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-[#1A1A1A]">
                    {tx(UI.phoneZaloNumber)}
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="0985 000 650"
                    className="w-full border border-[#D1D5DB] rounded-[6px] px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1D4E89]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#1A1A1A]">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full border border-[#D1D5DB] rounded-[6px] px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1D4E89]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-[#1A1A1A]">
                    {tx(UI.checkInDate)}
                  </label>
                  <input
                    type="date"
                    className="w-full border border-[#D1D5DB] rounded-[6px] px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1D4E89]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-[#1A1A1A]">
                    {tx(UI.checkOutDate)}
                  </label>
                  <input
                    type="date"
                    className="w-full border border-[#D1D5DB] rounded-[6px] px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1D4E89]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-[#1A1A1A]">
                    {tx(UI.numberOfGuests)}
                  </label>
                  <select className="w-full border border-[#D1D5DB] rounded-[6px] px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1D4E89]">
                    <option>{tx(UI.n2Guests)}</option>
                    <option>{tx(UI.n3Guests)}</option>
                    <option>{tx(UI.n4Guests)}</option>
                    <option>{tx(UI.n6Guests)}</option>
                    <option>{tx(UI.n8Guests)}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-[#1A1A1A]">
                    {tx(UI.preferredRoom)}
                  </label>
                  <select className="w-full border border-[#D1D5DB] rounded-[6px] px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1D4E89]">
                    <option>{tx(UI.needRecommendation)}</option>
                    <option>Deluxe Sea View</option>
                    <option>Rock Deluxe Sunset</option>
                    <option>Superior King Sea View</option>
                    <option>Family Suite 8 Guests</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#1A1A1A]">
                  {tx(UI.messageOrSpecialRequests)}
                </label>
                <textarea
                  rows={3}
                  placeholder={tx(UI.eGNeedPierPickUp)}
                  className="w-full border border-[#D1D5DB] rounded-[6px] px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1D4E89] resize-none"
                />
              </div>

              {submitted && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-[8px] p-3 flex items-center gap-2 text-xs text-emerald-800 font-medium">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{tx(UI.requestSentReceptionistWillMessageYou)}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  radius="6px"
                  className="flex-1 py-3"
                >
                  <Send className="w-4 h-4 mr-1.5" />
                  {tx(UI.submitRequest)}
                </Button>

                <a
                  href="https://zalo.me/0985000650"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    radius="6px"
                    className="w-full py-3 border-[#0068FF] text-[#0068FF] hover:bg-[#0068FF]/5"
                  >
                    <MessageCircle className="w-4 h-4 mr-1.5 text-[#0068FF]" />
                    {tx(UI.messageOnZalo)}
                  </Button>
                </a>
              </div>
            </form>
          </div>

          {/* Right Column: Resort Contact Info & Direct Transfer Guide (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Direct Contact Card */}
            <div className="bg-[#0F2D52] text-white rounded-[12px] p-6 space-y-5 shadow-xs">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#C6A86A] uppercase tracking-wider">
                  {tx(UI.reservationHotline)}
                </span>
                <a
                  href="tel:0985000650"
                  className="block font-serif text-3xl font-bold text-white hover:text-[#C6A86A] transition tracking-tight"
                >
                  0985 000 650
                </a>
                <p className="text-xs text-white/70">
                  {tx(UI.zaloWhatsappAvailable247Service)}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#C6A86A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-white">{tx(UI.resortAddress)}</span>
                    <span className="text-white/80 leading-relaxed">
                      {tx(UI.cuTronHamletKienHaiSpecial)}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#C6A86A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-white">Email:</span>
                    <a href="mailto:thenamduhill@gmail.com" className="text-white/80 hover:text-white transition">
                      thenamduhill@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#C6A86A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-white">{tx(UI.receptionHours)}</span>
                    <span className="text-white/80">
                      {tx(UI.checkIn1400CheckOut)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Guide Card */}
            <div className="bg-white border border-[#ECECEC] rounded-[12px] p-5 space-y-3 shadow-xs">
              <h3 className="font-serif text-sm font-bold text-[#0F2D52] flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-[#1D4E89]" />
                <span>{tx(UI.gettingToNamDuIsland)}</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#1D4E89]/10 text-[#1D4E89] text-[10px] font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div>
                    <span className="font-bold text-[#1A1A1A] block">{tx(UI.hcmcRachGia)}</span>
                    <span className="text-[#6B7280]">{tx(UI.overnightSleeperCoachApprox7Hours)}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#1D4E89]/10 text-[#1D4E89] text-[10px] font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div>
                    <span className="font-bold text-[#1A1A1A] block">{tx(UI.rachGiaCuTronPier)}</span>
                    <span className="text-[#6B7280]">{tx(UI.speedboatSuperdongPhuQuocExpress2)}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <div>
                    <span className="font-bold text-emerald-800 block">{tx(UI.pierTheNamDuHill)}</span>
                    <span className="text-emerald-700 font-medium">{tx(UI.resortCarPicksYouUpAt)}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white border border-[#ECECEC] rounded-[12px] overflow-hidden shadow-xs relative">
          <div className="h-[360px] w-full bg-[#E5E7EB] relative">
            <iframe
              title="Bản đồ The Nam Du Hill"
              src="https://www.openstreetmap.org/export/embed.html?bbox=104.28%2C9.64%2C104.42%2C9.72&amp;layer=mapnik&amp;marker=9.6835%2C104.3595"
              className="w-full h-full border-0"
              loading="lazy"
            />
            
            {/* Floating Location Card */}
            <div className="absolute left-4 bottom-4 bg-white/95 backdrop-blur-md border border-[#ECECEC] rounded-[10px] p-4 shadow-lg max-w-[300px] text-xs space-y-1.5">
              <h4 className="font-serif font-bold text-[#0F2D52] text-sm">THE NAM DU HILL RESORT</h4>
              <p className="text-[#6B7280]">{tx(UI.cuTronHamletKienHaiKien)}</p>
              <a
                href="https://www.google.com/maps/search/?api=1&amp;query=THE+NAM+DU+HILL+resort+Nam+Du"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[#1D4E89] font-semibold hover:underline pt-1"
              >
                {tx(UI.openInGoogleMaps)}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
