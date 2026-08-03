'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
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

const SORTS = [
  { k: 'rec', vi: 'Khuyên dùng', en: 'Recommended' },
  { k: 'asc', vi: 'Giá: Thấp đến cao', en: 'Price: Low to High' },
  { k: 'desc', vi: 'Giá: Cao đến thấp', en: 'Price: High to Low' },
  { k: 'area', vi: 'Diện tích rộng nhất', en: 'Largest area' },
]

const FAV_KEY = 'ndh:saved-rooms'

function RoomsContent() {
  const router = useRouter()
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

  // State for Filter Popup Modal
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  const handleCardClick = (e: React.MouseEvent, code: string) => {
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('a')) return
    router.push(`/rooms/${encodeURIComponent(code.replace('#', ''))}`)
  }

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

  const activeFilterCount = (activeFilter !== 'all' ? 1 : 0) + (activeSort !== 'rec' ? 1 : 0) + (favOnly ? 1 : 0)

  return (
    <main className="nd-page-main rooms-page-wrapper" style={{ paddingTop: '60px', minHeight: '100vh', background: '#ffffff', color: '#0b1b26' }}>
      {/* Top Title Banner */}
      <section className="nd-section-container" style={{ maxWidth: '1320px', margin: '0 auto' }}>
        {/* Availability Notice Banner if search params present */}
        {hasDateFilter && (
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '16px',
              padding: '12px 18px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>🗓️</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 400, color: '#166534' }}>
                  {t(
                    `Kiểm tra phòng trống: ${checkIn || ''} đến ${checkOut || ''} ${guests ? `(${guests})` : ''}`,
                    `Availability search: ${checkIn || ''} to ${checkOut || ''} ${guests ? `(${guests})` : ''}`
                  )}
                </div>
                <div style={{ fontSize: '11.5px', color: '#15803d', marginTop: '2px' }}>
                  {t(
                    `Còn ${visibleRooms.length} hạng phòng trống cho ngày bạn chọn.`,
                    `${visibleRooms.length} room types available for your dates.`
                  )}
                </div>
              </div>
            </div>
            <Link
              href="/rooms"
              style={{
                fontSize: '11.5px',
                fontWeight: 400,
                color: '#15803d',
                background: '#dcfce7',
                padding: '6px 12px',
                borderRadius: '6px',
                textDecoration: 'none',
              }}
            >
              {t('Xóa bộ lọc ✕', 'Clear date filter ✕')}
            </Link>
          </div>
        )}

        <div className="rooms-page-title-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)', gap: '28px', alignItems: 'end', padding: '16px 0 24px' }}>
          <div>
            <div className="nd-section-subtitle" style={{ color: '#0284c7', marginBottom: '4px' }}>
              {t('20 HẠNG PHÒNG · 17 PHÒNG & 3 SUITE', '20 ROOM TYPES · 17 ROOMS & 3 SUITES')}
            </div>
            <h1 className="nd-h1" style={{ color: '#0b1b26', marginBottom: '8px' }}>
              {t('Mỗi căn phòng dựng quanh thứ vốn đã có sẵn trên đồi.', 'Every room was built around what was already on the hill.')}
            </h1>
            <p className="nd-lead-p" style={{ color: '#566e7d', maxWidth: '640px' }}>
              {t(
                'Vách đá, kính lục giác, gác lửng, bồn sục hướng thung lũng. Từ 15 m² cho hai người đến suite 70 m² cho tám người.',
                'Rock walls, hexagonal glass, mezzanines, jacuzzis facing the valley. Sizes from 15 m² for two to a 70 m² suite for eight.'
              )}
            </p>
          </div>

          {/* Rating Cards */}
          <div className="rating-cards-wrapper" style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1, background: 'linear-gradient(150deg, #0284c7 0%, #075985 100%)', borderRadius: '16px', padding: '16px 18px', color: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '28px', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1 }}>8.5</span>
                <span style={{ fontSize: '11.5px', fontWeight: 400, color: 'rgba(255,255,255,0.85)' }}>{t('Rất tốt', 'Very good')}</span>
              </div>
              <div style={{ marginTop: '6px', fontSize: '10.5px', fontWeight: 400, color: 'rgba(255,255,255,0.75)' }}>
                {t('300+ đánh giá Booking.com', '300+ Booking.com reviews')}
              </div>
            </div>
            <div style={{ flex: 1, background: 'linear-gradient(150deg, #00c46a 0%, #059669 100%)', borderRadius: '16px', padding: '16px 18px', color: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '28px', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1 }}>9.1</span>
                <span style={{ fontSize: '11.5px', fontWeight: 400, color: 'rgba(255,255,255,0.88)' }}>{t('Nhân viên', 'Staff')}</span>
              </div>
              <div style={{ marginTop: '6px', fontSize: '10.5px', fontWeight: 400, color: 'rgba(255,255,255,0.80)' }}>
                {t('Điểm cao nhất: chủ nhà', 'Highest-rated: host care')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Sticky Filter Bar - Single Horizontal Row (Scroll X) */}
      <div
        className="rooms-filter-bar"
        style={{
          position: 'sticky',
          top: '64px',
          zIndex: 60,
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          borderTop: '1px solid rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Main Filter Popup Trigger Button */}
          <button
            onClick={() => setIsFilterModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: `1px solid ${activeFilterCount > 0 ? '#0284c7' : '#dbe7ef'}`,
              background: activeFilterCount > 0 ? '#f0f9ff' : '#ffffff',
              color: activeFilterCount > 0 ? '#0284c7' : '#0b1b26',
              fontSize: '11.5px',
              fontWeight: 400,
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            <span>{t('Bộ lọc', 'Filter')}</span>
            {activeFilterCount > 0 && (
              <span
                style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  fontSize: '9.5px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Separator hairline */}
          <span style={{ width: '1px', height: '18px', background: '#e2e8f0', flexShrink: 0 }} />

          {/* Single Row Horizontal Scrollable Category Filter Pills (Scroll X) */}
          <div
            className="no-scrollbar"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              flex: 1,
              scrollBehavior: 'smooth',
              paddingRight: '8px',
            }}
          >
            {FILTERS.map((f) => {
              const active = activeFilter === f.k
              return (
                <button
                  key={f.k}
                  onClick={() => setActiveFilter(f.k)}
                  style={{
                    border: `1px solid ${active ? '#0284c7' : '#e2e8f0'}`,
                    background: active ? '#0284c7' : '#ffffff',
                    color: active ? '#ffffff' : '#475569',
                    fontSize: '11.5px',
                    fontWeight: 400,
                    padding: '6px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'all 120ms ease',
                  }}
                >
                  {isEn ? f.en : f.vi}
                </button>
              )
            })}

            {/* Favorite Filter Toggle Pill */}
            <button
              onClick={() => setFavOnly(!favOnly)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                border: `1px solid ${favOnly ? '#0284c7' : '#e2e8f0'}`,
                background: favOnly ? '#0284c7' : '#ffffff',
                color: favOnly ? '#ffffff' : '#475569',
                fontSize: '11.5px',
                fontWeight: 400,
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              <span>{favOnly ? '♥' : '♡'}</span>
              <span>{t('Yêu thích', 'Saved')} ({favs.length})</span>
            </button>
          </div>

          {/* Total rooms count badge */}
          <span style={{ fontSize: '11px', fontWeight: 400, color: '#8fa5b3', flexShrink: 0, marginLeft: 'auto' }}>
            {visibleRooms.length} {t('phòng', 'rooms')}
          </span>
        </div>
      </div>

      {/* Main Room Cards Grid */}
      <section className="nd-section-container" style={{ maxWidth: '1320px', margin: '0 auto', padding: '24px 16px 60px' }}>
        <div className="rooms-grid-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {visibleRooms.map((r) => {
            const isFavorite = favs.includes(r.code)
            return (
              <article
                key={r.code}
                className="nd-card nd-card-img-zoom"
                onClick={(e) => handleCardClick(e, r.code)}
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: '#ffffff',
                  border: '1px solid #e6eef4',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                }}
              >
                {/* Image & Badges */}
                <div style={{ position: 'relative', height: '175px', background: '#eef4f8' }}>
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
                      top: '10px',
                      left: '10px',
                      background: 'rgba(6,40,58,0.85)',
                      backdropFilter: 'blur(8px)',
                      color: '#ffffff',
                      fontSize: '10px',
                      fontWeight: 400,
                      letterSpacing: '0.04em',
                      padding: '3px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    {r.code}
                  </span>

                  {/* Optional Hot/Tag Badge */}
                  {r.tag && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '56px',
                        background: 'rgba(0,196,106,0.92)',
                        backdropFilter: 'blur(8px)',
                        color: '#04241a',
                        fontSize: '9.5px',
                        fontWeight: 400,
                        letterSpacing: '0.04em',
                        padding: '3px 8px',
                        borderRadius: '6px',
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
                      top: '10px',
                      right: '10px',
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      border: 'none',
                      background: isFavorite ? '#0284c7' : 'rgba(255,255,255,0.88)',
                      backdropFilter: 'blur(8px)',
                      color: isFavorite ? '#ffffff' : '#0b1b26',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                    }}
                  >
                    {isFavorite ? '♥' : '♡'}
                  </button>
                </div>

                {/* Card Content Body */}
                <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h2 className="nd-card-title" style={{ margin: '0 0 4px', color: '#0b1b26' }}>
                    <Link href={`/rooms/${encodeURIComponent(r.code.replace('#', ''))}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {isEn ? r.nameEn : r.name}
                    </Link>
                  </h2>

                  <p className="nd-card-desc" style={{ margin: '0 0 10px', color: '#566e7d', flex: 1 }}>
                    {isEn ? r.blurbEn : r.blurb}
                  </p>

                  {/* Specifications Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 400, color: '#3d5462', background: '#f2f8fc', padding: '3px 7px', borderRadius: '4px' }}>
                      {r.area} m²
                    </span>
                    <span style={{ fontSize: '10px', fontWeight: 400, color: '#3d5462', background: '#f2f8fc', padding: '3px 7px', borderRadius: '4px' }}>
                      {r.cap} {t('khách', 'guests')}
                    </span>
                    <span style={{ fontSize: '10px', fontWeight: 400, color: '#3d5462', background: '#f2f8fc', padding: '3px 7px', borderRadius: '4px' }}>
                      {isEn ? r.viewEn : r.view}
                    </span>
                  </div>

                  {/* Card Footer: Price & Actions */}
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #eef4f8' }}>
                    <div>
                      <span className="nd-card-price">
                        {formatVND(r.price)}
                      </span>
                      <span className="nd-card-price-unit">{t('/đêm', '/night')}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <Link
                        href={`/rooms/${encodeURIComponent(r.code.replace('#', ''))}`}
                        style={{
                          background: '#f2f8fc',
                          border: '1px solid rgba(2,132,199,0.16)',
                          color: '#0284c7',
                          fontSize: '11.5px',
                          fontWeight: 400,
                          padding: '6px 12px',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          display: 'inline-block',
                        }}
                      >
                        {t('Chi tiết', 'Details')}
                      </Link>

                      <Link
                        href={`/rooms/${encodeURIComponent(r.code.replace('#', ''))}`}
                        style={{
                          background: '#0284c7',
                          color: '#ffffff',
                          fontSize: '11.5px',
                          fontWeight: 400,
                          padding: '6px 12px',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          display: 'inline-block',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {t('Đặt phòng', 'Book')}
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* 4 Benefits Included Grid */}
        <div className="room-benefits-grid" style={{ margin: '32px 0 40px', borderRadius: '16px', background: '#f2f8fc', border: '1px solid rgba(2,132,199,0.10)', padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8fa5b3', marginBottom: '6px' }}>
              {t('Phòng nào cũng có', 'Included in every room')}
            </div>
            <div style={{ fontSize: '12.5px', fontWeight: 400, lineHeight: 1.45, color: '#0b1b26' }}>
              {t('Phòng tắm riêng, két an toàn, ấm đun nước, Wi-Fi, ga & khăn', 'Private bathroom, safe, kettle, free Wi-Fi, linen & towels')}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8fa5b3', marginBottom: '6px' }}>
              {t('Trong khuôn viên', 'On site')}
            </div>
            <div style={{ fontSize: '12.5px', fontWeight: 400, lineHeight: 1.45, color: '#0b1b26' }}>
              {t('Hồ bơi ngoài trời, sân vườn, sân hiên, nhà hàng, bida, đỗ xe miễn phí', 'Outdoor pool, garden, terrace, restaurant, billiards, free parking')}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8fa5b3', marginBottom: '6px' }}>
              {t('Bữa sáng', 'Breakfast')}
            </div>
            <div style={{ fontSize: '12.5px', fontWeight: 400, lineHeight: 1.45, color: '#0b1b26' }}>
              {t('Kiểu Á hoặc gọi món, phục vụ tại sân hiên đỉnh đồi', 'Asian or à la carte, served on the hilltop terrace')}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8fa5b3', marginBottom: '6px' }}>
              {t('Đưa đón', 'Transfer')}
            </div>
            <div style={{ fontSize: '12.5px', fontWeight: 400, lineHeight: 1.45, color: '#0b1b26' }}>
              {t('Xe riêng hai chiều từ bến tàu Củ Tron, miễn phí', 'Free private car both ways from Cu Tron pier')}
            </div>
          </div>
        </div>
      </section>

      {/* FILTER POPUP MODAL */}
      {isFilterModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(6, 30, 48, 0.45)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
          onClick={() => setIsFilterModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '480px',
              background: '#ffffff',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              padding: '20px 20px 24px',
              boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15)',
              maxHeight: '85vh',
              overflowY: 'auto',
              animation: 'slideUpFilter 0.25s ease-out',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '14px', fontWeight: 400, color: '#0b1b26' }}>
                {t('Tất cả bộ lọc phòng', 'All room filters')}
              </div>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b',
                }}
              >
                ✕
              </button>
            </div>

            {/* Filter Group 1: Category */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', fontWeight: 400, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {t('Danh mục phòng', 'Room Category')}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {FILTERS.map((f) => {
                  const active = activeFilter === f.k
                  return (
                    <button
                      key={f.k}
                      onClick={() => setActiveFilter(f.k)}
                      style={{
                        border: `1px solid ${active ? '#0284c7' : '#e2e8f0'}`,
                        background: active ? '#0284c7' : '#ffffff',
                        color: active ? '#ffffff' : '#334155',
                        fontSize: '11.5px',
                        fontWeight: 400,
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      {isEn ? f.en : f.vi}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Filter Group 2: Sort By */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', fontWeight: 400, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {t('Sắp xếp theo', 'Sort by')}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {SORTS.map((s) => {
                  const active = activeSort === s.k
                  return (
                    <button
                      key={s.k}
                      onClick={() => setActiveSort(s.k)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: `1px solid ${active ? '#0284c7' : '#e2e8f0'}`,
                        background: active ? '#f0f9ff' : '#ffffff',
                        color: active ? '#0284c7' : '#334155',
                        fontSize: '11.5px',
                        fontWeight: 400,
                        padding: '8px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <span>{isEn ? s.en : s.vi}</span>
                      {active && <span>✓</span>}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Filter Group 3: Saved / Favorites Only */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '11px', fontWeight: 400, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {t('Phòng đã lưu', 'Saved rooms')}
              </div>
              <button
                onClick={() => setFavOnly(!favOnly)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  border: `1px solid ${favOnly ? '#0284c7' : '#e2e8f0'}`,
                  background: favOnly ? '#f0f9ff' : '#ffffff',
                  color: favOnly ? '#0284c7' : '#334155',
                  fontSize: '11.5px',
                  fontWeight: 400,
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                <span>{favOnly ? '♥' : '♡'}</span>
                <span>{t('Chỉ hiển thị phòng tôi đã yêu thích', 'Only show rooms I favorited')} ({favs.length})</span>
              </button>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  setActiveFilter('all')
                  setActiveSort('rec')
                  setFavOnly(false)
                }}
                style={{
                  flex: 1,
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  color: '#64748b',
                  fontSize: '11.5px',
                  fontWeight: 400,
                  padding: '9px 0',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                {t('Thiết lập lại', 'Reset')}
              </button>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                style={{
                  flex: 2,
                  border: 'none',
                  background: '#0284c7',
                  color: '#ffffff',
                  fontSize: '11.5px',
                  fontWeight: 400,
                  padding: '9px 0',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                {t(`Áp dụng (${visibleRooms.length} phòng)`, `Apply (${visibleRooms.length} rooms)`)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Deposit Modal */}
      {bookingRoom && <BookingModal room={bookingRoom} onClose={() => setBookingRoom(null)} />}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes slideUpFilter {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        @media (max-width: 640px) {
          .rooms-page-wrapper {
            padding-top: 52px !important;
          }
          .rooms-page-title-grid {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
            padding: 10px 0 16px !important;
          }
          .rating-cards-wrapper {
            flex-direction: row !important;
            gap: 8px !important;
          }
          .rooms-filter-bar {
            top: 56px !important;
          }
          .rooms-grid-list {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .room-benefits-grid {
            padding: 14px 16px !important;
            margin: 20px 0 30px !important;
            gap: 14px !important;
          }
        }
      `}</style>
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
