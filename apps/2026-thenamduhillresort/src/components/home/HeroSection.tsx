'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '../../context/LanguageContext'
import { BookingCalendarModal } from '../modals/BookingCalendarModal'
import { Button } from '../common/Button'
import { Calendar, Users, MapPin, ChevronRight, Star } from 'lucide-react'

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
      
      {/* Hero Visual Banner */}
      <div className="relative w-full h-[380px] sm:h-[460px] md:h-[520px] rounded-b-[20px] sm:rounded-b-[28px] overflow-hidden">
        
        {/* Background Images Slider */}
        {SLIDES.map((slide, idx) => (
          <img
            key={idx}
            src={slide.src}
            alt={slide.alt}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              currentSlide === idx ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            } transition-transform duration-10000`}
          />
        ))}

        {/* Gradient Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#101828]/90 via-[#101828]/35 to-[#101828]/40" />

        {/* Hero Overlay Content */}
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-20 sm:pb-24 text-white">
          
          {/* Main Title (Playfair Display, 700 Bold) */}
          <h1 className="font-serif text-[30px] sm:text-[40px] md:text-[56px] font-bold tracking-tight drop-shadow-md text-white leading-[1.2]">
            The Nam Du Hill Resort
          </h1>

          {/* Subtitle & Rating Row */}
          <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
            
            {/* Location Tag */}
            <div className="flex items-center gap-1 text-xs sm:text-sm font-medium text-white/90">
              <MapPin className="w-4 h-4 text-white stroke-[1.75]" />
              <span>Nam Du, Kiên Giang</span>
            </div>

            {/* PA3 Luxury Gold Rating Badge (#C6A86A) */}
            {/* <div className="inline-flex items-center gap-1.5 bg-[#C6A86A] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
              <div className="flex text-amber-100 gap-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-100 stroke-[1.75]" />
                <Star className="w-3.5 h-3.5 fill-amber-100 stroke-[1.75]" />
                <Star className="w-3.5 h-3.5 fill-amber-100 stroke-[1.75]" />
              </div>
              <span>8.9</span>
            </div> */}
          </div>
        </div>
      </div>

      {/* FLOATING BOOKING CARD (Responsive width max-w-lg, Card Radius 12px, Shadow Medium 0 8px 24px rgba(0,0,0,.08), Border 1px #ECECEC) */}
      <div className="w-full max-w-lg mx-auto px-4 relative z-20 -mt-14 sm:-mt-16 pb-6">
        <div
          onClick={() => setIsCalendarModalOpen(true)}
          className="bg-white rounded-[12px] p-4 sm:p-5 shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-[#ECECEC] space-y-3 cursor-pointer hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition-all"
        >
          {/* Row 1: Check-in / Check-out (Input Height 48px, Radius 8px, Border #E5E7EB) */}
          <div className="h-[48px] bg-[#F5F7FA] border border-[#E5E7EB] rounded-[8px] px-3.5 flex items-center justify-between hover:bg-[#E5E7EB]/60 transition">
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-normal text-[#6B7280] leading-none">
                {t('Nhận phòng - Trả phòng', 'Check-in - Check-out')}
              </span>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1A1A1A]">
                <Calendar className="w-4 h-4 text-[#1D4E89] stroke-[1.75]" />
                <span>15 Th8 - 17 Th8</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#1D4E89] stroke-[1.75]" />
          </div>

          {/* Row 2: Guests (Input Height 48px, Radius 8px, Border #E5E7EB) */}
          <div className="h-[48px] bg-[#F5F7FA] border border-[#E5E7EB] rounded-[8px] px-3.5 flex items-center justify-between hover:bg-[#E5E7EB]/60 transition">
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-normal text-[#6B7280] leading-none">
                {t('Số khách', 'Guests')}
              </span>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1A1A1A]">
                <Users className="w-4 h-4 text-[#1D4E89] stroke-[1.75]" />
                <span>{guests}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#1D4E89] stroke-[1.75]" />
          </div>

          {/* Reusable Common Button Component (Size lg 46px, Radius 6px) */}
          <Button
            size="lg"
            fullWidth
            radius="6px"
            onClick={handleSearch}
            className="mt-1"
          >
            {t('Tìm phòng', 'Search')}
          </Button>
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
