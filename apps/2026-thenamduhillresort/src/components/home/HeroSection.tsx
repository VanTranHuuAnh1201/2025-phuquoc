'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { VideoModal } from '../modals/VideoModal'
import { BookingCalendarModal } from '../modals/BookingCalendarModal'

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
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false)

  // Default dates: Today & Tomorrow
  const [checkIn, setCheckIn] = useState('2026-08-03')
  const [checkOut, setCheckOut] = useState('2026-08-04')
  const [guests, setGuests] = useState('2 khách')
  const [roomType, setRoomType] = useState('Tất cả 20 hạng phòng')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
    }, 30000)
    return () => clearInterval(timer)
  }, [])

  const handleCheckAvailability = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
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
        minHeight: 'auto',
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
              transition: 'opacity 2500ms ease-in-out, transform 3000ms ease-out',
              transform: currentSlide === idx ? 'scale(1.03)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      {/* Cloud Layer (Tạm thời dừng animation đám mây theo yêu cầu) */}
      <div
        style={{
          display: 'none', // Tạm thời dừng animation đám mây
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
            animation: 'floatCloudRight1 70s linear infinite',
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
            animation: 'floatCloudRight2 90s linear infinite 6s',
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

      {/* Single Unified Fluid Hero Content Container */}
      <div
        className="hero-container nd-section-container"
        style={{
          position: 'relative',
          zIndex: 4,
          width: '100%',
          maxWidth: '1320px',
          margin: '0 auto',
          padding: '120px 32px 36px',
        }}
      >
        {/* Top Rating & Badge Bar */}
        <div className="hero-badge-bar" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#0284c7',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 800,
              padding: '3px 9px',
              borderRadius: '999px',
            }}
          >
            <span>⭐ 8.5/10</span>
            <span>·</span>
            <span>{t('300+ đánh giá', '300+ reviews')}</span>
          </span>

          <span className="nd-section-subtitle" style={{ color: 'rgba(255,255,255,0.82)' }}>
            {t('Hilltop resort · Nam Du', 'Hilltop resort · Nam Du')}
          </span>
        </div>

        {/* Fluid Responsive Headline */}
        <h1 className="hero-headline nd-h1" style={{ color: '#ffffff', maxWidth: '22ch', margin: '0 0 10px' }}>
          {t('Bình minh và hoàng hôn từ cùng một sân hiên.', 'Sunrise and sunset, from the very same terrace.')}
        </h1>

        {/* Sub-headline (Fluid text density) */}
        <p className="hero-subheadline nd-lead-p" style={{ color: 'rgba(255,255,255,0.85)', maxWidth: '56ch', margin: '0 0 16px' }}>
          {t(
            'Trên ngọn đồi cao nhất Ấp Củ Tron, thung lũng mở ra ôm trọn vịnh Hòn Lớn — và về đêm, ánh đèn chợ đêm Nam Du nằm ngay dưới chân bạn.',
            'On the highest hill of Cu Tron, the valley opens onto Hon Lon bay — and at night, the lights of the Nam Du night market sit right below you.'
          )}
        </p>

        {/* Floating Booking Search Bar (Super Simplified Compact Booking.com Pill) */}
        <div
          id="booking"
          onClick={() => setIsCalendarModalOpen(true)}
          className="booking-search-widget"
          style={{ cursor: 'pointer' }}
        >
          <div className="booking-pill-info">
            <span className="booking-pill-icon">🔍</span>
            <div className="booking-pill-text">
              <div className="booking-pill-title">The Nam Du Hill · {checkIn} — {checkOut}</div>
              <div className="booking-pill-sub">{guests} · {roomType}</div>
            </div>
          </div>

          <button
            onClick={handleCheckAvailability}
            className="booking-submit-btn"
          >
            {t('Tìm phòng', 'Search')}
          </button>
        </div>

        {/* Perks Bar & Slide Dots */}
        <div
          style={{
            marginTop: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <div className="hero-perks-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.14)', padding: '3px 8px', borderRadius: '999px' }}>
              ✓ Free bữa sáng
            </span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.14)', padding: '3px 8px', borderRadius: '999px' }}>
              ✓ Đưa đón bến tàu
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Slide ${i + 1}`}
                style={{
                  width: '24px',
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
      <BookingCalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        checkIn={checkIn}
        checkOut={checkOut}
        guests={guests}
        roomType={roomType}
        onSave={(cIn, cOut, g, r) => {
          setCheckIn(cIn)
          setCheckOut(cOut)
          setGuests(g)
          setRoomType(r)
        }}
      />

      <style jsx global>{`
        #top {
          height: 70vh;
          min-height: 70vh;
        }

        /* Fluid Compact Booking Pill Bar */
        .booking-search-widget {
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(18px);
          border-radius: 999px;
          box-shadow: 0 16px 40px rgba(3,20,32,0.30);
          padding: 8px 10px 8px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border: 2px solid transparent;
          max-width: 680px;
          transition: transform 150ms ease, box-shadow 150ms ease, border-color 200ms ease;
        }
        .booking-search-widget:hover {
          transform: translateY(-2px);
          box-shadow: 0 22px 50px rgba(3,20,32,0.36);
          border-color: rgba(0,108,228,0.35);
        }
        .booking-pill-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 0;
        }
        .booking-pill-icon {
          font-size: 20px;
          flex-shrink: 0;
        }
        .booking-pill-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
          min-width: 0;
        }
        .booking-pill-title {
          font-size: 14px;
          font-weight: 800;
          color: #0b1b26;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .booking-pill-sub {
          font-size: 11.5px;
          font-weight: 600;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .booking-submit-btn {
          background: #006ce4;
          color: #ffffff;
          border: none;
          font-size: 14px;
          font-weight: 800;
          padding: 12px 24px;
          border-radius: 999px;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 4px 14px rgba(0,108,228,0.30);
          flex-shrink: 0;
          transition: background 150ms ease, transform 150ms ease;
        }
        .booking-submit-btn:hover {
          background: #0056b3;
          transform: scale(1.02);
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .hero-container {
            padding-top: calc(85px + max(14px, env(safe-area-inset-top, 14px))) !important;
            padding-bottom: 28px !important;
          }
        }

        @media (max-width: 640px) {
          #top {
            min-height: 45vh !important;
            height: 45vh !important;
          }
          .hero-container {
            padding-top: calc(54px + max(14px, env(safe-area-inset-top, 14px))) !important;
            padding-left: 14px !important;
            padding-right: 14px !important;
            padding-bottom: 12px !important;
          }
          .hero-badge-bar {
            display: none !important;
          }
          .hero-headline {
            font-size: 16px !important;
            font-weight: 500 !important;
            margin-bottom: 4px !important;
            line-height: 1.25 !important;
            letter-spacing: 0 !important;
          }
          .hero-subheadline {
            display: block !important;
            font-size: 12.5px !important;
            font-weight: 400 !important;
            color: rgba(255,255,255,0.88) !important;
            margin-bottom: 8px !important;
            line-height: 1.45 !important;
            overflow: visible !important;
          }
          .hero-perks-bar {
            display: none !important;
          }
          .booking-search-widget {
            border: 2px solid #ffb700;
            border-radius: 999px;
            padding: 5px 6px 5px 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.25);
            margin-top: 4px;
          }
          .booking-pill-title {
            font-size: 12px;
            font-weight: 500;
          }
          .booking-pill-sub {
            font-size: 10px;
            font-weight: 400;
          }
          .booking-submit-btn {
            font-size: 12px;
            font-weight: 600;
            padding: 8px 14px;
          }
        }
      `}</style>
    </section>
  )
}
