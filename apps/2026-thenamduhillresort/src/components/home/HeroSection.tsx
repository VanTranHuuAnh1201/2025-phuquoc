'use client'

import { UI } from '@repo/core'

import { Calendar, Play } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { HERO_SLIDES as SLIDES } from '../../data/property'
import { BookingCalendarModal } from '../modals/BookingCalendarModal'

/** Modal state is ISO (YYYY-MM-DD); the bar shows dd/mm/yyyy. */
function formatDisplayDate(iso: string) {
  const [y, m, d] = iso.split('-')
  return y && m && d ? `${d}/${m}/${y}` : iso
}

function countNights(checkIn: string, checkOut: string) {
  const start = new Date(checkIn).getTime()
  const end = new Date(checkOut).getTime()
  if (Number.isNaN(start) || Number.isNaN(end)) return 0
  return Math.max(0, Math.round((end - start) / 86400000))
}

export function HeroSection() {
  const { t, tx } = useLanguage()
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false)

  const [checkIn, setCheckIn] = useState('2026-08-15')
  const [checkOut, setCheckOut] = useState('2026-08-17')
  const [guests, setGuests] = useState('2 khách')
  const [roomType, setRoomType] = useState('Tất cả 20 hạng phòng')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  const nights = countNights(checkIn, checkOut)

  const handleSearch = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const params = new URLSearchParams()
    if (checkIn) params.set('checkIn', checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    if (guests) params.set('guests', guests)
    if (roomType) params.set('roomType', roomType)
    router.push(`/rooms?${params.toString()}`)
  }

  /** One field of the search bar — opens the modal, since every field is edited there. */
  const Field = ({
    label,
    value,
    hint,
    divider = true,
  }: {
    label: string
    value: string
    hint?: string
    divider?: boolean
  }) => (
    <button
      type="button"
      onClick={() => setIsCalendarModalOpen(true)}
      className={`group flex flex-col gap-1 px-4 py-2.5 text-left rounded-[12px] transition-colors hover:bg-[#eefafd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#06b6d4] ${divider ? 'md:border-r md:border-[#d9eff5]' : ''
        }`}
    >
      <span className="text-[10.5px] font-extrabold uppercase tracking-[0.13em] text-[#78a3ae]">
        {label}
      </span>
      <span className="flex items-baseline gap-2">
        <span className="text-[14.5px] font-semibold text-[#0b1b26] truncate">{value}</span>
        {hint ? <span className="text-[11.5px] font-medium text-[#78a3ae]">{hint}</span> : null}
      </span>
    </button>
  )

  return (
    <section id="top" className="relative w-full overflow-hidden bg-[#0b4f5e]">

      {/* Slides */}
      {SLIDES.map((slide, idx) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          aria-hidden={currentSlide !== idx}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[900ms] ease-in-out ${currentSlide === idx ? 'opacity-100' : 'opacity-0'
            }`}
        />
      ))}

      {/* Gradient overlay — keeps white text legible over any slide */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(4,70,86,0.44) 0%, rgba(6,140,160,0.10) 34%, rgba(4,90,108,0.30) 64%, rgba(4,74,90,0.72) 100%)',
        }}
      />

      <div className="relative z-10 w-full max-w-[1320px] mx-auto px-5 sm:px-8 pt-[96px] sm:pt-[130px] lg:pt-[160px] pb-5 sm:pb-[42px] min-h-[70vh] flex flex-col justify-end">

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-4 sm:mb-[18px] hidden md:flex">
          <span className="w-[7px] h-[7px] rounded-full bg-[#00c46a]" />
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-white/[0.86]">
            {tx(UI.hilltopBoutiqueResortCuTronNam)}
          </span>
        </div>

        <h1 className="m-0 mb-4 sm:mb-[18px] font-bold text-white text-[clamp(32px,5vw,68px)] leading-[1.04] tracking-[-0.038em] max-w-[15ch] text-balance">
          {tx(UI.sunriseAndSunsetFromTheVery)}
        </h1>

        <p className="hidden md:flex m-0 mb-5 sm:mb-[26px] text-[clamp(15px,1.3vw,17.5px)] leading-[1.6] text-white/[0.84] max-w-[58ch] line-clamp-3 sm:line-clamp-none">
          {tx(UI.onTheHighestHillOfCu)}
        </p>

        {/* CTAs + rating strip — desktop only; mobile keeps just the search card */}
        <div className="hidden sm:flex items-center gap-4 sm:gap-[26px] flex-wrap mb-6 sm:mb-[26px]">
          <button
            type="button"
            onClick={() => router.push('/rooms')}
            className="bg-white text-[#0b1b26] text-[15px] font-bold px-[30px] py-4 rounded-full whitespace-nowrap transition-all duration-150 hover:bg-[#00c46a] hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {tx(UI.see20RoomTypes)}
          </button>

          <button
            type="button"
            onClick={() => router.push('/rooms')}
            className="hidden sm:flex items-center gap-[11px] border border-white/[0.46] bg-white/10 backdrop-blur-[10px] text-white text-[14.5px] font-semibold pl-3.5 pr-[22px] py-[13px] rounded-full whitespace-nowrap transition-colors duration-150 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span className="w-[30px] h-[30px] rounded-full bg-white text-[#0b1b26] flex items-center justify-center">
              <Play className="w-3 h-3 fill-current translate-x-[1px]" />
            </span>
            <span>{tx(UI.watchTheFilm300)}</span>
          </button>

          <div className="flex items-center gap-5 sm:gap-[22px] flex-wrap">
            {[
              { value: '8.5', accent: false, label: tx(UI.n300BookingComReviews) },
              { value: '9.1', accent: true, label: tx(UI.staffHostCare) },
              { value: '0₫', accent: false, label: tx(UI.pierTransfer) },
            ].map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-[7px]">
                <span
                  className={`text-[21px] font-black tracking-[-0.03em] ${stat.accent ? 'text-[#00e07a]' : 'text-white'
                    }`}
                >
                  {stat.value}
                </span>
                <span className="text-[12.5px] font-medium text-white/[0.74]">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 📱 MOBILE — single compact pill: summary + CTA side by side */}
        <div
          id="booking"
          className="md:hidden bg-white/[0.96] backdrop-blur-[18px] rounded-[14px] shadow-[0_14px_36px_rgba(5,60,72,0.32)] p-1.5 flex items-center gap-1.5"
        >
          <button
            type="button"
            onClick={() => setIsCalendarModalOpen(true)}
            aria-label={tx(UI.changeDatesAndGuests)}
            className="flex-1 min-w-0 min-h-[44px] rounded-[10px] px-2.5 py-1.5 flex items-center gap-2 text-left transition-colors hover:bg-[#eefafd] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#06b6d4]"
          >
            <Calendar className="w-4 h-4 shrink-0 text-[#06b6d4]" />
            <span className="flex flex-col min-w-0">
              <span className="text-[13px] font-semibold text-[#0b1b26] leading-tight truncate">
                {formatDisplayDate(checkIn)} — {formatDisplayDate(checkOut)}
              </span>
              <span className="text-[11px] font-medium text-[#78a3ae] leading-tight truncate">
                {nights > 0 ? `${nights} ${tx(nights > 1 ? UI.nights : UI.night)} · ` : ''}
                {guests}
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={handleSearch}
            className="shrink-0 h-[44px] px-4 bg-[#1D4E89] text-white text-[13px] font-bold rounded-[10px] whitespace-nowrap shadow-sm transition-colors duration-150 hover:bg-[#0F2D52] active:bg-[#0B192C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4E89]"
          >
            {tx(UI.search)}
          </button>
        </div>

        {/* 🖥️ DESKTOP — full 5-column bar; every field opens BookingCalendarModal */}
        <div className="hidden md:grid bg-white/[0.96] backdrop-blur-[18px] rounded-[22px] shadow-[0_22px_54px_rgba(5,60,72,0.34)] px-4 py-3.5 gap-1 [grid-template-columns:minmax(128px,1fr)_minmax(128px,1fr)_minmax(128px,0.8fr)_minmax(200px,1.5fr)_auto] items-stretch">
          <Field
            label={tx(UI.checkIn)}
            value={formatDisplayDate(checkIn)}
          />
          <Field
            label={tx(UI.checkOut)}
            value={formatDisplayDate(checkOut)}
            hint={nights > 0 ? `${nights} ${tx(nights > 1 ? UI.nights : UI.night)}` : undefined}
          />
          <Field label={tx(UI.guests2)} value={guests} />
          <Field label={tx(UI.selectRoom)} value={roomType} divider={false} />

          <button
            type="button"
            onClick={handleSearch}
            className="bg-[#1D4E89] text-white text-sm font-bold px-[26px] py-[17px] rounded-[15px] whitespace-nowrap shadow-md transition-colors duration-150 hover:bg-[#0F2D52] active:bg-[#0B192C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4E89]"
          >
            {tx(UI.checkAvailability)}
          </button>
        </div>

        {/* Reassurance + slide dots */}
        <div className="mt-[18px] hidden lg:flex items-center justify-between gap-6 flex-wrap">
          <span className="text-[12.5px] font-medium text-white/[0.72]">
            {tx(UI.bestRateGuaranteedWhenYouBook)}
          </span>
          <div className="flex gap-2">
            {SLIDES.map((slide, idx) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={t(`Ảnh ${idx + 1}`, `Slide ${idx + 1}`)}
                aria-current={currentSlide === idx}
                className={`w-[26px] h-1 rounded-sm p-0 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${currentSlide === idx ? 'bg-white' : 'bg-white/[0.36] hover:bg-white/60'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      <BookingCalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        checkIn={checkIn}
        checkOut={checkOut}
        guests={guests}
        roomType={roomType}
        onSave={(cIn, cOut, g, rt) => {
          setCheckIn(cIn)
          setCheckOut(cOut)
          setGuests(g)
          setRoomType(rt)
          setIsCalendarModalOpen(false)
        }}
      />
    </section>
  )
}
