'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLanguage } from '../../context/LanguageContext'
import { VideoModal } from '../modals/VideoModal'

const SLIDES = [
  { src: '/uploads/pasted-1785691965790-0.png', alt: 'Vịnh Nam Du nhìn từ trên đồi' },
  { src: '/uploads/pasted-1785690604574-0.png', alt: 'Sân hiên The Nam Du Hill' },
  { src: '/uploads/pasted-1785690578814-0.png', alt: 'Sân hiên lục giác nhìn từ trên cao về đêm' },
  { src: '/uploads/hero-1.jpg', alt: 'Bãi biển Nam Du' },
]

export function HeroSection() {
  const { t } = useLanguage()
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  // Default dates: Today & Tomorrow
  const [checkIn, setCheckIn] = useState(() => new Date().toISOString().split('T')[0])
  const [checkOut, setCheckOut] = useState(() => new Date(Date.now() + 86400000).toISOString().split('T')[0])
  const [guests, setGuests] = useState('2 khách')
  const [roomType, setRoomType] = useState('Tất cả 20 hạng phòng')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  const handleCheckAvailability = () => {
    const params = new URLSearchParams()
    if (checkIn) params.set('checkIn', checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    if (guests) params.set('guests', guests)
    if (roomType && roomType !== 'Tất cả 20 hạng phòng') params.set('roomType', roomType)

    router.push(`/rooms?${params.toString()}`)
  }

  return (
    <section
      id="top"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
        background: '#06283a',
      }}
    >
      {/* Background Slides */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {SLIDES.map((slide, idx) => (
          <img
            key={idx}
            src={slide.src}
            alt={slide.alt}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: currentSlide === idx ? 1 : 0,
              transition: 'opacity 900ms ease, transform 1200ms ease-out',
              transform: currentSlide === idx ? 'scale(1.03)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      {/* Cloud Layer on Default Item (Slide 0) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 2,
          opacity: currentSlide === 0 ? 0.95 : 0,
          transition: 'opacity 800ms ease',
          overflow: 'hidden',
        }}
      >
        {/* Cloud 1: Top 100px */}
        <img
          src="/uploads/cloud-1.png"
          alt="Cloud 1"
          style={{
            position: 'absolute',
            top: '100px',
            left: 0,
            width: '340px',
            maxHeight: '170px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.18))',
            animation: 'floatCloudRight1 26s linear infinite',
          }}
        />
        {/* Cloud 2: Top 160px */}
        <img
          src="/uploads/cloud-2.png"
          alt="Cloud 2"
          style={{
            position: 'absolute',
            top: '160px',
            left: 0,
            width: '290px',
            maxHeight: '145px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.15))',
            animation: 'floatCloudRight2 34s linear infinite 5s',
          }}
        />
      </div>

      {/* Dark Overlay Gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          background:
            'linear-gradient(180deg, rgba(3,20,32,0.66) 0%, rgba(3,20,32,0.30) 32%, rgba(3,20,32,0.52) 66%, rgba(3,20,32,0.86) 100%)',
        }}
      />

      {/* Hero Content Container */}
      <div
        className="hero-container nd-section-container"
        style={{
          position: 'relative',
          zIndex: 4,
          width: '100%',
          maxWidth: '1320px',
          margin: '0 auto',
          padding: '160px 32px 42px',
        }}
      >
        {/* Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00c46a' }} />
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.86)',
            }}
          >
            {t('Hilltop boutique resort · Ấp Củ Tron, Nam Du', 'Hilltop boutique resort · Cu Tron, Nam Du')}
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            margin: '0 0 18px',
            fontSize: 'clamp(36px, 5vw, 68px)',
            lineHeight: 1.02,
            fontWeight: 800,
            letterSpacing: '-0.038em',
            color: '#ffffff',
            maxWidth: '15ch',
            textWrap: 'balance',
          }}
        >
          {t('Bình minh và hoàng hôn từ cùng một sân hiên.', 'Sunrise and sunset, from the very same terrace.')}
        </h1>

        {/* Sub-headline */}
        <p
          style={{
            margin: '0 0 26px',
            fontSize: 'clamp(15px, 1.3vw, 17.5px)',
            lineHeight: 1.6,
            fontWeight: 400,
            color: 'rgba(255,255,255,0.84)',
            maxWidth: '58ch',
          }}
        >
          {t(
            'Trên ngọn đồi cao nhất Ấp Củ Tron, thung lũng mở ra ôm trọn vịnh Hòn Lớn — và về đêm, ánh đèn chợ đêm Nam Du nằm ngay dưới chân bạn.',
            'On the highest hill of Cu Tron, the valley opens onto Hon Lon bay — and at night, the lights of the Nam Du night market sit right below you.'
          )}
        </p>

        {/* Action Buttons & Rating Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '26px', flexWrap: 'wrap', marginBottom: '26px' }}>
          <Link
            href="/rooms"
            style={{
              background: '#ffffff',
              color: '#0b1b26',
              fontSize: '15px',
              fontWeight: 700,
              padding: '16px 30px',
              borderRadius: '999px',
              whiteSpace: 'nowrap',
              textDecoration: 'none',
              transition: 'background 150ms ease, transform 150ms ease',
            }}
          >
            {t('Xem 20 hạng phòng', 'Explore 20 room types')}
          </Link>

          <button
            onClick={() => setIsVideoModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '11px',
              border: '1px solid rgba(255,255,255,0.46)',
              background: 'rgba(255,255,255,0.10)',
              backdropFilter: 'blur(10px)',
              color: '#ffffff',
              fontSize: '14.5px',
              fontWeight: 600,
              padding: '13px 22px 13px 14px',
              borderRadius: '999px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <span
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: '#ffffff',
                color: '#0b1b26',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                paddingLeft: '2px',
              }}
            >
              ▶
            </span>
            <span>{t('Xem phim giới thiệu · 3:00', 'Watch the film · 3:00')}</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '22px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '7px' }}>
              <span style={{ fontSize: '21px', fontWeight: 900, letterSpacing: '-0.03em', color: '#ffffff' }}>
                8.5
              </span>
              <span style={{ fontSize: '12.5px', fontWeight: 500, color: 'rgba(255,255,255,0.74)' }}>
                {t('300+ đánh giá Booking.com', '300+ Booking.com reviews')}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '7px' }}>
              <span style={{ fontSize: '21px', fontWeight: 900, letterSpacing: '-0.03em', color: '#00e07a' }}>
                9.1
              </span>
              <span style={{ fontSize: '12.5px', fontWeight: 500, color: 'rgba(255,255,255,0.74)' }}>
                {t('Nhân viên & chủ nhà', 'Staff & host care')}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '7px' }}>
              <span style={{ fontSize: '21px', fontWeight: 900, letterSpacing: '-0.03em', color: '#ffffff' }}>
                0₫
              </span>
              <span style={{ fontSize: '12.5px', fontWeight: 500, color: 'rgba(255,255,255,0.74)' }}>
                {t('Đưa đón bến tàu', 'Pier transfer')}
              </span>
            </div>
          </div>
        </div>

        {/* Floating Booking Search Bar */}
        <div
          id="booking"
          className="booking-bar"
          style={{
            background: 'rgba(255,255,255,0.96)',
            backdropFilter: 'blur(18px)',
            borderRadius: '22px',
            boxShadow: '0 22px 54px rgba(3,20,32,0.34)',
            padding: '14px 16px',
            display: 'grid',
            gridTemplateColumns: 'minmax(128px, 1fr) minmax(128px, 1fr) minmax(128px, 0.8fr) minmax(232px, 1.7fr) auto',
            gap: '4px',
            alignItems: 'stretch',
          }}
        >
          <label className="booking-field" style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px 16px', borderRight: '1px solid #e6eef4' }}>
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 800,
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
                color: '#8fa5b3',
              }}
            >
              {t('Nhận phòng', 'Check in')}
            </span>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '14.5px',
                fontWeight: 600,
                color: '#0b1b26',
                padding: 0,
                width: '100%',
              }}
            />
          </label>

          <label className="booking-field" style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px 16px', borderRight: '1px solid #e6eef4' }}>
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 800,
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
                color: '#8fa5b3',
              }}
            >
              {t('Trả phòng', 'Check out')}
            </span>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '14.5px',
                fontWeight: 600,
                color: '#0b1b26',
                padding: 0,
                width: '100%',
              }}
            />
          </label>

          <label className="booking-field" style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px 16px', borderRight: '1px solid #e6eef4' }}>
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 800,
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
                color: '#8fa5b3',
              }}
            >
              {t('Số khách', 'Guests')}
            </span>
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '14.5px',
                fontWeight: 600,
                color: '#0b1b26',
                padding: 0,
                width: '100%',
                cursor: 'pointer',
              }}
            >
              <option value="2 khách">{t('2 khách', '2 guests')}</option>
              <option value="3 khách">{t('3 khách', '3 guests')}</option>
              <option value="4 khách">{t('4 khách', '4 guests')}</option>
              <option value="6 khách">{t('6 guests', '6 guests')}</option>
              <option value="8 khách">{t('8 khách', '8 guests')}</option>
            </select>
          </label>

          <label className="booking-field" style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px 16px', borderRight: '1px solid #e6eef4' }}>
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 800,
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
                color: '#8fa5b3',
              }}
            >
              {t('Chọn phòng', 'Room type')}
            </span>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '14.5px',
                fontWeight: 600,
                color: '#0b1b26',
                padding: 0,
                width: '100%',
                cursor: 'pointer',
              }}
            >
              <option value="Tất cả 20 hạng phòng">{t('Tất cả 20 hạng phòng', 'All 20 room types')}</option>
              <option value="#14 Rock Deluxe">#14 Rock Deluxe · 1.776.000₫</option>
              <option value="#05 Lục Giác Kính">#05 Lục Giác Kính · 1.546.000₫</option>
              <option value="#07 Superior King">#07 Superior King · 2.971.000₫</option>
              <option value="#08 Gia đình gác lửng">#08 Gia đình gác lửng · 3.088.000₫</option>
              <option value="#08-09 Suite 8 khách">#08-09 Suite 8 khách · 5.662.000₫</option>
            </select>
          </label>

          <button
            onClick={handleCheckAvailability}
            style={{
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              fontSize: '14px',
              fontWeight: 700,
              padding: '17px 26px',
              borderRadius: '15px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 6px 18px rgba(2,132,199,0.30)',
              transition: 'background 150ms ease',
            }}
          >
            {t('Kiểm tra phòng trống', 'Check availability')}
          </button>
        </div>

        {/* Bottom Guarantee Note & Slide Dots */}
        <div
          style={{
            marginTop: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: '12.5px', fontWeight: 500, color: 'rgba(255,255,255,0.72)' }}>
            {t(
              'Cam kết giá tốt nhất khi đặt trực tiếp · Huỷ miễn phí trước 7 ngày',
              'Best rate guaranteed when you book direct · Free cancellation up to 7 days before arrival'
            )}
          </span>

          <div style={{ display: 'flex', gap: '8px' }}>
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Slide ${i + 1}`}
                style={{
                  width: '26px',
                  height: '4px',
                  borderRadius: '2px',
                  border: 'none',
                  background: currentSlide === i ? '#ffffff' : 'rgba(255,255,255,0.36)',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'background 200ms ease',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <VideoModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} />

      <style jsx global>{`
        @keyframes floatCloudRight1 {
          0% {
            transform: translateX(-360px);
          }
          100% {
            transform: translateX(100vw);
          }
        }
        @keyframes floatCloudRight2 {
          0% {
            transform: translateX(-400px);
          }
          100% {
            transform: translateX(100vw);
          }
        }
        @media (max-width: 960px) {
          .hero-container {
            padding-top: calc(90px + max(14px, env(safe-area-inset-top, 14px))) !important;
            padding-left: 14px !important;
            padding-right: 14px !important;
            padding-bottom: 24px !important;
          }
          .booking-bar {
            grid-template-columns: 1fr !important;
          }
          .booking-field {
            border-right: none !important;
            border-bottom: 1px solid #e6eef4 !important;
          }
        }
      `}</style>
    </section>
  )
}
