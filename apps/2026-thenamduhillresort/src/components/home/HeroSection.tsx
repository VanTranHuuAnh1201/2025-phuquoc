'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '../../context/LanguageContext'
import { BookingCalendarModal } from '../modals/BookingCalendarModal'
import { Button } from '../common/Button'
import { Calendar, Users, ChevronRight, Star } from 'lucide-react'

const SLIDES = [
  { src: '/uploads/hero-1.jpg', alt: 'Bãi biển Nam Du' },
  { src: '/uploads/pasted-1785691965790-0.png', alt: 'Vịnh Nam Du nhìn từ trên đồi' },
  { src: '/uploads/pasted-1785690604574-0.png', alt: 'Sân hiên The Nam Du Hill' },
  { src: '/uploads/pasted-1785690578814-0.png', alt: 'Sân hiên lục giác nhìn từ trên cao về đêm' },
]

export function HeroSection() {
  const { t } = useLanguage()
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false)

  const [checkIn, setCheckIn] = useState('15/08/2025')
  const [checkOut, setCheckOut] = useState('17/08/2025')
  const [guests, setGuests] = useState('2 người lớn')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  const handleSearch = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const params = new URLSearchParams()
    if (checkIn) params.set('checkIn', checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    if (guests) params.set('guests', guests)
    router.push(`/rooms?${params.toString()}`)
  }

  return (
    <section className="relative w-full bg-[#FAFAF8]">
      
      {/* Hero Visual Banner with Grand height and Luxury Gradient */}
      <div className="relative w-full h-[520px] sm:h-[620px] lg:h-[700px] min-h-[80vh] rounded-b-[28px] sm:rounded-b-[40px] overflow-hidden shadow-2xl">
        
        {/* Background Images Slider with smooth scale effect */}
        {SLIDES.map((slide, idx) => (
          <img
            key={idx}
            src={slide.src}
            alt={slide.alt}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
              currentSlide === idx ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
          />
        ))}

        {/* Clear Vivid Sunlight Overlay: Gradient only from bottom and subtle top shadow to keep ocean picture bright */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-[#0B192C]/40 to-[#0B192C]/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B192C]/60 via-transparent to-transparent h-40" />

        {/* Hero Overlay Content */}
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center pb-20 sm:pb-28 text-white">
          
          {/* Top Category Badge */}
          <div className="inline-flex items-center gap-2 bg-[#FFB800]/20 backdrop-blur-md text-[#FFB800] px-4.5 py-1.5 rounded-full text-xs font-black w-fit mb-3.5 border border-[#FFB800]/50 shadow-[0_4px_20px_rgba(255,184,0,0.3)] tracking-widest uppercase">
            <span>★ RESORT NGHỈ DƯỠNG BIỂN NAM DU ★</span>
          </div>

          {/* Rating & Verified Tag */}
          <div className="inline-flex items-center gap-2.5 bg-[#0B192C]/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold w-fit mb-4 border border-white/20 shadow-xl">
            <div className="flex items-center gap-1.5">
              <Star className="w-4.5 h-4.5 fill-[#FFB800] text-[#FFB800] drop-shadow-[0_2px_8px_rgba(255,184,0,0.9)]" />
              <span className="font-black text-[#FFB800] text-sm">4.9 / 5</span>
            </div>
            <span className="text-white/40">|</span>
            <span className="text-white font-bold">83 {t('đánh giá xuất sắc', 'verified reviews')}</span>
            <span className="text-sm">✨</span>
          </div>

          {/* Main Title with Vibrant Gold Gradient Accent */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12] drop-shadow-2xl max-w-4xl">
            Kỳ Nghỉ Vàng Tại <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-[#FBBF24] to-amber-200 drop-shadow-sm">The Nam Du Hill</span>
          </h1>

          {/* Subtitle & Description */}
          <p className="text-base sm:text-xl text-slate-100 font-medium mt-3 sm:mt-4 max-w-2xl leading-relaxed tracking-wide drop-shadow-md">
            {t(
              'Tuyệt tác nghỉ dưỡng hướng biển giữa thiên nhiên hoang sơ trên đảo Nam Du. Tận hưởng góc nhìn 360° ôm trọn đại dương.',
              'Luxury seaside sanctuary surrounded by pristine nature on Nam Du Island'
            )}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              onClick={() => router.push('/rooms')}
              className="group inline-flex items-center gap-2.5 bg-[#FFB800] hover:bg-[#F59E0B] active:scale-95 text-slate-950 px-7 py-3.5 rounded-full text-sm font-extrabold shadow-[0_10px_25px_rgba(255,184,0,0.4)] hover:shadow-[0_15px_30px_rgba(255,184,0,0.5)] transition-all duration-300"
            >
              <span>{t('Đặt phòng ngay', 'Book Now')}</span>
              <ChevronRight className="w-4.5 h-4.5 stroke-[3] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => router.push('/explore')}
              className="group inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 active:scale-95 backdrop-blur-md text-white px-6 py-3.5 rounded-full text-sm font-bold border border-white/40 shadow-lg transition-all duration-300"
            >
              <span>{t('Khám phá Nam Du', 'Explore Nam Du')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 📱 MOBILE FLOATING BOOKING CARD (Intact Mobile View with Vibrant Gold CTA Button) */}
      <div className="block md:hidden w-full max-w-lg mx-auto px-4 relative z-20 -mt-14 sm:-mt-16 pb-6">
        <div
          onClick={() => setIsCalendarModalOpen(true)}
          className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-[0_20px_50px_rgba(11,25,44,0.2)] border-2 border-amber-400/40 space-y-3 cursor-pointer hover:shadow-[0_24px_50px_rgba(11,25,44,0.25)] transition-all duration-300"
        >
          {/* Row 1: Check-in / Check-out */}
          <div className="h-[52px] bg-[#F8FAFC] border border-slate-200/80 rounded-xl px-4 flex items-center justify-between hover:bg-[#F0F5FA] transition-colors">
            <div className="flex flex-col justify-center gap-0.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-none">
                {t('Nhận phòng - Trả phòng', 'Check-in - Check-out')}
              </span>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#0B192C]">
                <Calendar className="w-4 h-4 text-[#FFB800] stroke-[2.5]" />
                <span>15 Th8 - 17 Th8</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#1D4E89] stroke-[2.5]" />
          </div>

          {/* Row 2: Guests */}
          <div className="h-[52px] bg-[#F8FAFC] border border-slate-200/80 rounded-xl px-4 flex items-center justify-between hover:bg-[#F0F5FA] transition-colors">
            <div className="flex flex-col justify-center gap-0.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-none">
                {t('Số khách', 'Guests')}
              </span>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#0B192C]">
                <Users className="w-4 h-4 text-[#FFB800] stroke-[2.5]" />
                <span>{guests}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#1D4E89] stroke-[2.5]" />
          </div>

          <Button
            size="lg"
            fullWidth
            radius="12px"
            onClick={(e) => {
              e.stopPropagation()
              handleSearch(e)
            }}
            className="mt-1 bg-gradient-to-r from-[#FFB800] to-[#F59E0B] hover:from-[#F59E0B] hover:to-[#D97706] text-slate-950 shadow-[0_8px_25px_rgba(255,184,0,0.45)] h-[52px] text-sm font-black tracking-wide border-none"
          >
            {t('TÌM PHÒNG TRỐNG NGAY →', 'SEARCH ROOMS NOW →')}
          </Button>
        </div>
      </div>

      {/* 🖥️ DESKTOP HORIZONTAL FLOATING SEARCH BAR (Striking Vibrant Gold Design) */}
      <div className="hidden md:block max-w-[1180px] mx-auto px-4 relative z-20 -mt-16 pb-12">
        <div
          onClick={() => setIsCalendarModalOpen(true)}
          className="bg-white/95 backdrop-blur-xl rounded-3xl p-4 shadow-[0_25px_60px_rgba(11,25,44,0.22)] border-2 border-amber-400/40 flex items-center justify-between gap-3 cursor-pointer hover:shadow-[0_30px_70px_rgba(11,25,44,0.3)] transition-all duration-300 hover:-translate-y-0.5"
        >
          {/* Check-in */}
          <div className="flex-1 px-5 py-3 hover:bg-[#F0F5FA] rounded-2xl transition-colors border-r border-slate-200/80 group">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              {t('Nhận phòng', 'Check-in')}
            </span>
            <div className="flex items-center gap-2.5 text-sm font-extrabold text-[#0B192C]">
              <Calendar className="w-4.5 h-4.5 text-[#FFB800] group-hover:scale-110 transition-transform stroke-[2.5]" />
              <span className="text-base">15/08/2025</span>
            </div>
          </div>

          {/* Check-out */}
          <div className="flex-1 px-5 py-3 hover:bg-[#F0F5FA] rounded-2xl transition-colors border-r border-slate-200/80 group">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              {t('Trả phòng', 'Check-out')}
            </span>
            <div className="flex items-center gap-2.5 text-sm font-extrabold text-[#0B192C]">
              <Calendar className="w-4.5 h-4.5 text-[#FFB800] group-hover:scale-110 transition-transform stroke-[2.5]" />
              <span className="text-base">17/08/2025</span>
            </div>
          </div>

          {/* Guests */}
          <div className="flex-1 px-5 py-3 hover:bg-[#F0F5FA] rounded-2xl transition-colors group">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              {t('Số khách', 'Guests')}
            </span>
            <div className="flex items-center gap-2.5 text-sm font-extrabold text-[#0B192C]">
              <Users className="w-4.5 h-4.5 text-[#FFB800] group-hover:scale-110 transition-transform stroke-[2.5]" />
              <span className="text-base">{t('2 người lớn, 0 trẻ em', '2 adults, 0 kids')}</span>
            </div>
          </div>

          {/* Search Button */}
          <div className="w-[220px]" onClick={(e) => e.stopPropagation()}>
            <Button
              size="lg"
              fullWidth
              radius="full"
              onClick={(e) => {
                e.stopPropagation()
                handleSearch(e)
              }}
              className="bg-gradient-to-r from-[#FFB800] via-[#F59E0B] to-[#D97706] hover:from-[#F59E0B] hover:to-[#D97706] text-slate-950 h-[56px] text-base font-black tracking-wide shadow-[0_10px_25px_rgba(255,184,0,0.45)] hover:shadow-[0_15px_35px_rgba(255,184,0,0.6)] hover:scale-[1.03] active:scale-95 transition-all duration-200 border-none"
            >
              {t('TÌM PHÒNG NGAY', 'SEARCH ROOMS')}
            </Button>
          </div>
        </div>
      </div>

      <BookingCalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        checkIn={checkIn}
        checkOut={checkOut}
        guests={guests}
        roomType="Tất cả 20 hạng phòng"
        onSave={(cIn, cOut, g) => {
          setCheckIn(cIn)
          setCheckOut(cOut)
          setGuests(g)
        }}
      />
    </section>
  )
}

