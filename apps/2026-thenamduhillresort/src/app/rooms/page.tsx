'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useLanguage } from '../../context/LanguageContext'
import { ROOMS, Room, formatVND, roomSlug } from '../../data/rooms'
import { ImageSlot } from '../../components/common/ImageSlot'
import { BookingModal } from '../../components/rooms/BookingModal'

const FILTERS = [
  { k: 'all', vi: 'Tất cả', en: 'All' },
  { k: 'couple', vi: '2 khách', en: 'For two' },
  { k: 'family', vi: 'Gia đình', en: 'Family' },
  { k: 'suite', vi: 'Suite', en: 'Suites' },
  { k: 'sea', vi: 'View biển', en: 'Sea view' },
  { k: 'signature', vi: 'Độc bản', en: 'Signature' },
]

const FAV_KEY = 'ndh:saved-rooms'

function RoomsContent() {
  const searchParams = useSearchParams()
  const checkIn = searchParams.get('checkIn')
  const checkOut = searchParams.get('checkOut')
  const guests = searchParams.get('guests')
  const roomType = searchParams.get('roomType')

  const { t, language } = useLanguage()
  const isEn = language === 'en'

  const [activeFilter, setActiveFilter] = useState('all')
  const [activeSort, setActiveSort] = useState('rec')
  const [favOnly, setFavOnly] = useState(false)
  const [favs, setFavs] = useState<string[]>([])
  const [bookingRoom, setBookingRoom] = useState<Room | null>(null)

  // Sync category filter from query params
  useEffect(() => {
    if (roomType) {
      if (roomType.includes('Rock Deluxe') || roomType.includes('#14')) setActiveFilter('signature')
      else if (roomType.includes('Lục Giác') || roomType.includes('#05')) setActiveFilter('couple')
      else if (roomType.includes('Superior') || roomType.includes('#07')) setActiveFilter('family')
      else if (roomType.includes('Suite') || roomType.includes('#08-09')) setActiveFilter('suite')
    } else if (guests) {
      if (guests.includes('2')) setActiveFilter('couple')
      else if (guests.includes('3') || guests.includes('4')) setActiveFilter('family')
      else if (guests.includes('6') || guests.includes('8')) setActiveFilter('suite')
    }
  }, [guests, roomType])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAV_KEY)
      if (stored) {
        setFavs(JSON.parse(stored))
      }
    } catch (e) {
      // ignore
    }
  }, [])

  const toggleFav = (code: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const next = favs.includes(code) ? favs.filter((c) => c !== code) : [...favs, code]
    setFavs(next)
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(next))
    } catch (err) {
      // ignore
    }
  }

  // Filter & Sort Logic
  const getVisibleRooms = () => {
    let list = ROOMS.filter((r) => (favOnly ? favs.includes(r.code) : true)).filter((r) => {
      if (activeFilter === 'all') return true
      if (activeFilter === 'sea') return /biển|sea/i.test(r.view)
      if (activeFilter === 'signature') return !!r.tag
      return r.group === activeFilter
    })

    if (activeSort === 'asc') {
      list = [...list].sort((a, b) => a.price - b.price)
    } else if (activeSort === 'desc') {
      list = [...list].sort((a, b) => b.price - a.price)
    } else if (activeSort === 'area') {
      list = [...list].sort((a, b) => b.area - a.area)
    } else {
      list = [...list].sort((a, b) => (b.hot || 0) - (a.hot || 0))
    }
    return list
  }

  const visibleRooms = getVisibleRooms()
  const hasDateFilter = !!(checkIn || checkOut)

  return (
    <main className="nd-page-main" style={{ paddingTop: '90px', minHeight: '100vh', background: '#ffffff', color: '#0b1b26' }}>
      {/* Top Title Banner */}
      <section className="nd-section-container" style={{ padding: '32px 32px 0', maxWidth: '1320px', margin: '0 auto' }}>
        {/* Availability Notice Banner if search params present */}
        {hasDateFilter && (
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '20px',
              padding: '16px 24px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '24px' }}>🗓️</span>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#166534' }}>
                  {t(
                    `Kiểm tra phòng trống: ${checkIn || ''} đến ${checkOut || ''} ${guests ? `(${guests})` : ''}`,
                    `Availability search: ${checkIn || ''} to ${checkOut || ''} ${guests ? `(${guests})` : ''}`
                  )}
                </div>
                <div style={{ fontSize: '13.5px', color: '#15803d', marginTop: '2px', fontWeight: 600 }}>
                  {t(
                    `Còn ${visibleRooms.length} hạng phòng trống cho ngày bạn chọn — Rock Deluxe #14 chỉ còn 1 phòng.`,
                    `${visibleRooms.length} room types available for your dates — Rock Deluxe #14 has 1 room left.`
                  )}
                </div>
              </div>
            </div>
            <Link
              href="/rooms"
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#15803d',
                background: '#dcfce7',
                padding: '8px 16px',
                borderRadius: '999px',
                textDecoration: 'none',
              }}
            >
              {t('Xóa bộ lọc ngày ✕', 'Clear date filter ✕')}
            </Link>
          </div>
        )}

        <div className="nd-grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)', gap: '32px', alignItems: 'end', padding: '20px 0 30px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00c46a' }} />
              <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#0284c7' }}>
                {t('20 hạng phòng · 17 phòng & 3 suite', '20 room types · 17 rooms & 3 suites')}
              </span>
            </div>
            <h1
              style={{
                margin: '0 0 16px',
                fontSize: 'clamp(32px, 4vw, 50px)',
                lineHeight: 1.04,
                fontWeight: 800,
                letterSpacing: '-0.035em',
                color: '#0b1b26',
                textWrap: 'balance',
              }}
            >
              {t('Mỗi căn phòng dựng quanh thứ vốn đã có sẵn trên đồi.', 'Every room was built around what was already on the hill.')}
            </h1>
            <p style={{ margin: 0, fontSize: '16.5px', lineHeight: 1.62, color: '#566e7d', maxWidth: '640px' }}>
              {t(
                'Vách đá, kính lục giác, gác lửng, bồn sục hướng thung lũng. Từ 15 m² cho hai người đến suite 70 m² cho tám người.',
                'Rock walls, hexagonal glass, mezzanines, jacuzzis facing the valley. Sizes from 15 m² for two to a 70 m² suite for eight.'
              )}
            </p>
          </div>

          {/* Rating Cards */}
          <div className="nd-grid-responsive" style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, background: 'linear-gradient(150deg, #0284c7 0%, #075985 100%)', borderRadius: '22px', padding: '22px 24px', color: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '38px', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>8.5</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.82)' }}>{t('Rất tốt', 'Very good')}</span>
              </div>
              <div style={{ marginTop: '10px', fontSize: '12.5px', fontWeight: 500, color: 'rgba(255,255,255,0.72)' }}>
                {t('300+ đánh giá trên Booking.com', '300+ reviews on Booking.com')}
              </div>
            </div>
            <div style={{ flex: 1, background: 'linear-gradient(150deg, #00c46a 0%, #059669 100%)', borderRadius: '22px', padding: '22px 24px', color: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '38px', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>9.1</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.86)' }}>{t('Nhân viên', 'Staff')}</span>
              </div>
              <div style={{ marginTop: '10px', fontSize: '12.5px', fontWeight: 500, color: 'rgba(255,255,255,0.80)' }}>
                {t('Điểm cao nhất: sự tận tâm của chủ nhà', 'Highest-rated: host care')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Filter & Sort Bar */}
      <div
        style={{
          position: 'sticky',
          top: '68px',
          zIndex: 60,
          background: 'rgba(255,255,255,0.94)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #eef4f8',
        }}
      >
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '14px 32px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {/* Category Filter Buttons */}
          <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
            {FILTERS.map((f) => {
              const active = activeFilter === f.k
              return (
                <button
                  key={f.k}
                  onClick={() => setActiveFilter(f.k)}
                  style={{
                    border: `1px solid ${active ? '#0284c7' : '#dbe7ef'}`,
                    background: active ? '#0284c7' : '#ffffff',
                    color: active ? '#ffffff' : '#3d5462',
                    fontSize: '13px',
                    fontWeight: 700,
                    padding: '10px 17px',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 150ms ease',
                  }}
                >
                  {isEn ? f.en : f.vi}
                </button>
              )
            })}
          </div>

          {/* Right Controls: Favorites Counter & Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>
            <button
              onClick={() => setFavOnly(!favOnly)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                borderRadius: '999px',
                padding: '8px 14px',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                border: `1px solid ${favOnly ? '#0284c7' : '#dbe7ef'}`,
                background: favOnly ? '#0284c7' : '#ffffff',
                color: favOnly ? '#ffffff' : '#0b1b26',
              }}
            >
              <span style={{ fontSize: '14px', lineHeight: 1 }}>{favOnly ? '♥' : '♡'}</span>
              <span style={{ fontSize: '13px', fontWeight: 700 }}>{favs.length}</span>
            </button>

            <span style={{ fontSize: '13px', fontWeight: 600, color: '#8fa5b3' }}>
              {visibleRooms.length} {t('phòng', 'rooms')}
            </span>

            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value)}
              style={{
                border: '1px solid #dbe7ef',
                background: '#ffffff',
                color: '#0b1b26',
                fontSize: '13px',
                fontWeight: 600,
                padding: '9px 14px',
                borderRadius: '999px',
                cursor: 'pointer',
              }}
            >
              <option value="rec">{t('Sắp xếp: Khuyên dùng', 'Sort: Recommended')}</option>
              <option value="asc">{t('Giá: Thấp đến cao', 'Price: Low to High')}</option>
              <option value="desc">{t('Giá: Cao đến thấp', 'Price: High to Low')}</option>
              <option value="area">{t('Diện tích rộng nhất', 'Largest area')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Room Cards Grid */}
      <section className="nd-section-container" style={{ maxWidth: '1320px', margin: '0 auto', padding: '40px 32px 80px' }}>
        <div className="nd-grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {visibleRooms.map((r) => {
            const isFavorite = favs.includes(r.code)
            return (
              <article
                key={r.code}
                className="nd-card"
                style={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  background: '#ffffff',
                  border: '1px solid #e6eef4',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Image & Badges */}
                <div style={{ position: 'relative', height: '208px', background: '#eef4f8' }}>
                  <Link href={`/rooms/${encodeURIComponent(r.code.replace('#', ''))}`} style={{ display: 'block', position: 'absolute', inset: 0 }}>
                    <ImageSlot
                      id={roomSlug(r.code)}
                      placeholder={`${r.code} — ${isEn ? r.nameEn : r.name}`}
                      src={r.images?.[0]}
                      style={{ position: 'absolute', inset: 0 }}
                    />
                  </Link>

                  {/* Room Code Badge */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(6,40,58,0.85)',
                      backdropFilter: 'blur(8px)',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      padding: '5px 11px',
                      borderRadius: '999px',
                    }}
                  >
                    {r.code}
                  </span>

                  {/* Optional Hot/Tag Badge */}
                  {r.tag && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '60px',
                        background: 'rgba(0,196,106,0.92)',
                        backdropFilter: 'blur(8px)',
                        color: '#04241a',
                        fontSize: '10.5px',
                        fontWeight: 800,
                        letterSpacing: '0.06em',
                        padding: '5px 10px',
                        borderRadius: '999px',
                      }}
                    >
                      {r.tag}
                    </span>
                  )}

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => toggleFav(r.code, e)}
                    aria-label={isFavorite ? 'Bỏ lưu' : 'Lưu phòng'}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      border: 'none',
                      background: isFavorite ? '#0284c7' : 'rgba(255,255,255,0.88)',
                      backdropFilter: 'blur(8px)',
                      color: isFavorite ? '#ffffff' : '#0b1b26',
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                    }}
                  >
                    {isFavorite ? '♥' : '♡'}
                  </button>
                </div>

                {/* Card Content Body */}
                <div style={{ padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h2 style={{ margin: '0 0 6px', fontSize: '19px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0b1b26' }}>
                    <Link href={`/rooms/${encodeURIComponent(r.code.replace('#', ''))}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {isEn ? r.nameEn : r.name}
                    </Link>
                  </h2>

                  <p style={{ margin: '0 0 16px', fontSize: '13.5px', lineHeight: 1.5, color: '#566e7d', flex: 1 }}>
                    {isEn ? r.blurbEn : r.blurb}
                  </p>

                  {/* Specifications Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#3d5462', background: '#f2f8fc', padding: '5px 10px', borderRadius: '8px' }}>
                      {r.area} m²
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#3d5462', background: '#f2f8fc', padding: '5px 10px', borderRadius: '8px' }}>
                      {r.cap} {t('khách', 'guests')}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#3d5462', background: '#f2f8fc', padding: '5px 10px', borderRadius: '8px' }}>
                      {isEn ? r.viewEn : r.view}
                    </span>
                  </div>

                  {/* Card Footer: Price & Actions */}
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid #eef4f8' }}>
                    <div>
                      <span style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0b1b26' }}>
                        {formatVND(r.price)}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 500, color: '#8fa5b3' }}>{t('/đêm', '/night')}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link
                        href={`/rooms/${encodeURIComponent(r.code.replace('#', ''))}`}
                        style={{
                          background: '#f2f8fc',
                          border: '1px solid rgba(2,132,199,0.16)',
                          color: '#0284c7',
                          fontSize: '13px',
                          fontWeight: 700,
                          padding: '10px 16px',
                          borderRadius: '999px',
                          textDecoration: 'none',
                          display: 'inline-block',
                        }}
                      >
                        {t('Chi tiết', 'Details')}
                      </Link>

                      <button
                        onClick={() => setBookingRoom(r)}
                        style={{
                          background: '#0284c7',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: '13px',
                          fontWeight: 700,
                          padding: '11px 19px',
                          borderRadius: '999px',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'background 150ms ease',
                        }}
                      >
                        {t('Đặt phòng', 'Book')}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* 4 Benefits Included Grid */}
        <div style={{ margin: '44px 0 60px', borderRadius: '26px', background: '#f2f8fc', border: '1px solid rgba(2,132,199,0.10)', padding: '32px 36px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '28px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8fa5b3', marginBottom: '10px' }}>
              {t('Phòng nào cũng có', 'Included in every room')}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.5, color: '#0b1b26' }}>
              {t('Phòng tắm riêng, két an toàn, ấm đun nước, Wi-Fi, ga & khăn', 'Private bathroom, safe, kettle, free Wi-Fi, linen & towels')}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8fa5b3', marginBottom: '10px' }}>
              {t('Trong khuôn viên', 'On site')}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.5, color: '#0b1b26' }}>
              {t('Hồ bơi ngoài trời, sân vườn, sân hiên, nhà hàng, bida, đỗ xe miễn phí', 'Outdoor pool, garden, terrace, restaurant, billiards, free parking')}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8fa5b3', marginBottom: '10px' }}>
              {t('Bữa sáng', 'Breakfast')}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.5, color: '#0b1b26' }}>
              {t('Kiểu Á hoặc gọi món, phục vụ tại sân hiên đỉnh đồi', 'Asian or à la carte, served on the hilltop terrace')}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8fa5b3', marginBottom: '10px' }}>
              {t('Đưa đón', 'Transfer')}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.5, color: '#0b1b26' }}>
              {t('Xe riêng hai chiều từ bến tàu Củ Tron, miễn phí', 'Free private car both ways from Cu Tron pier')}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Deposit Modal */}
      {bookingRoom && <BookingModal room={bookingRoom} onClose={() => setBookingRoom(null)} />}
    </main>
  )
}

export default function RoomsPage() {
  return (
    <Suspense fallback={<div style={{ paddingTop: '120px', textAlign: 'center' }}>Đang tải...</div>}>
      <RoomsContent />
    </Suspense>
  )
}
