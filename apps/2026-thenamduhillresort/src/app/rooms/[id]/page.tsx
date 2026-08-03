'use client'

import React, { useState, use } from 'react'
import Link from 'next/link'
import { useLanguage } from '../../../context/LanguageContext'
import { ROOMS, BASE_AMENITIES, formatVND, roomSlug, Room } from '../../../data/rooms'
import { ImageSlot } from '../../../components/common/ImageSlot'

interface RoomDetailPageProps {
  params: Promise<{ id: string }> | { id: string }
}

export default function RoomDetailPage({ params }: RoomDetailPageProps) {
  // Handle Next.js 15 async params or sync object safely
  const resolvedParams =
    params && typeof (params as Record<string, unknown>).then === 'function'
      ? use(params as Promise<{ id: string }>)
      : (params as { id: string })
  const rawId = resolvedParams.id || ''
  const decodedId = decodeURIComponent(rawId).trim()

  // Find room by code (#14, 14, 08-09), slug or cleaned string
  const foundRoom = ROOMS.find((r) => {
    const cleanCode = r.code.replace('#', '').toLowerCase()
    const searchId = decodedId.replace('#', '').toLowerCase()
    return (
      cleanCode === searchId ||
      r.code.toLowerCase() === decodedId.toLowerCase() ||
      roomSlug(r.code).toLowerCase() === searchId ||
      r.name.toLowerCase().includes(searchId)
    )
  })
  const room: Room = (foundRoom || ROOMS[0]) as Room

  const { t, language } = useLanguage()
  const isEn = language === 'en'

  const [lightbox, setLightbox] = useState(false)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  const [checkIn, setCheckIn] = useState(today)
  const [checkOut, setCheckOut] = useState(tomorrow)
  const [guests, setGuests] = useState(room.cap || 2)

  // Calculate Nights & Total
  const dIn = new Date(checkIn || '').getTime()
  const dOut = new Date(checkOut || '').getTime()
  const diffDays = Math.max(1, Math.ceil((dOut - dIn) / (1000 * 3600 * 24)))
  const nights = isNaN(diffDays) ? 1 : diffDays
  const totalPrice = room.price * nights
  const deposit = Math.round(totalPrice * 0.5)

  const syntaxText = `NDH ${room.code.replace('#', '')} ${(checkIn || '').replace(/-/g, '')}`
  const qrUrl = `https://img.vietqr.io/image/970422-0985000650-compact2.png?amount=${deposit}&addInfo=${encodeURIComponent(
    syntaxText
  )}`

  const galleryItems = [
    { slotId: `${roomSlug(room.code)}_g0`, hint: `${room.code} — Hình ảnh chính` },
    { slotId: `${roomSlug(room.code)}_g1`, hint: 'Góc giường & ban công' },
    { slotId: `${roomSlug(room.code)}_g2`, hint: 'Phòng tắm & view đồi' },
    { slotId: `${roomSlug(room.code)}_g3`, hint: 'Không gian mở' },
    { slotId: `${roomSlug(room.code)}_g4`, hint: 'Hoàng hôn từ phòng' },
  ]
  const shotsCount = galleryItems.length

  const handleScrollSlides = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const width = el.clientWidth
    if (width > 0) {
      const idx = Math.round(el.scrollLeft / width)
      setCurrentSlideIndex(idx)
    }
  }

  // Categorized Amenities Structure (Booking.com Friendly Layout)
  const amenityCategories = [
    {
      icon: '🛏️',
      title: isEn ? 'Bedroom' : 'Phòng ngủ',
      items: isEn
        ? ['Premium bedding', 'Wardrobe & hangers', 'Tiled/marble floor', 'Drying rack']
        : ['Nệm cao cấp', 'Tủ hoặc phòng để quần áo', 'Sàn lát gạch/đá cẩm thạch', 'Giá phơi quần áo'],
    },
    {
      icon: '🛁',
      title: isEn ? 'Bathroom' : 'Phòng tắm',
      items: isEn
        ? ['Private bathroom', 'Shower', 'Bathrobes', 'Hairdryer', 'Towels & linen', 'Free toiletries']
        : ['Phòng tắm riêng', 'Vòi sen', 'Áo choàng tắm', 'Máy sấy tóc', 'Bộ khăn & ga trải giường', 'Đồ vệ sinh cá nhân miễn phí'],
    },
    {
      icon: '🍽️',
      title: isEn ? 'Food & Drink' : 'Đồ ăn & thức uống',
      items: isEn
        ? ['Electric kettle', 'Minibar / Fridge', 'Complimentary Asian breakfast on terrace']
        : ['Ấm đun nước điện', 'Tủ lạnh / Minibar', 'Bữa sáng miễn phí phục vụ tại sân hiên'],
    },
    {
      icon: '👁️',
      title: isEn ? 'View & Outdoor' : 'Tầm nhìn & ngoài trời',
      items: isEn
        ? [room.viewEn || 'Sea or mountain view', 'Private balcony / terrace', 'Outdoor seating area']
        : [room.view || 'Nhìn ra biển hoặc đồi núi', 'Ban công / sân hiên riêng', 'Góc ngồi thư giãn ngoài trời'],
    },
    {
      icon: 'ℹ️',
      title: isEn ? 'General Facilities' : 'Tiện nghi tổng quát',
      items: isEn
        ? ['Air conditioning', 'Fan', 'Soundproofing', 'Safety deposit box', 'Free Wi-Fi', 'Free pier transfer both ways']
        : ['Máy điều hòa', 'Quạt máy', 'Cách âm', 'Két an toàn', 'Wi-Fi miễn phí', 'Xe riêng đưa đón miễn phí bến tàu Củ Tron'],
    },
  ]

  return (
    <main className="nd-page-main room-detail-wrapper" style={{ paddingTop: '52px', minHeight: '100vh', background: '#ffffff', color: '#0b1b26' }}>
      {/* Top Breadcrumb Navigation */}
      <section className="nd-section-container" style={{ maxWidth: '1320px', margin: '0 auto', paddingTop: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0 8px', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
          <Link href="/rooms" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#0284c7', fontSize: '11px', fontWeight: 400, textDecoration: 'none' }}>
            ← {t('Tất cả phòng nghỉ', 'All rooms')}
          </Link>
          <span style={{ fontSize: '10.5px', fontWeight: 400, color: '#8fa5b3' }}>
            Nam Du Hill Resort · {room.code}
          </span>
        </div>
      </section>

      {/* Gallery Section - 1 Image Scroll X Carousel on Mobile, Grid on Desktop */}
      <section className="nd-section-container" style={{ maxWidth: '1320px', margin: '0 auto', paddingTop: '8px' }}>
        {/* Mobile 1-Image Scroll-X Slideshow */}
        <div className="room-mobile-slider-container">
          <div className="room-mobile-slider no-scrollbar" onScroll={handleScrollSlides}>
            {galleryItems.map((g, idx) => (
              <div key={idx} className="room-mobile-slide" onClick={() => setLightbox(true)}>
                <ImageSlot id={g.slotId} src={room.images?.[idx] || room.images?.[0]} placeholder={g.hint} style={{ position: 'absolute', inset: 0 }} />
              </div>
            ))}
          </div>

          {/* Floating Slide Counter Badge */}
          <div className="room-slide-badge" onClick={() => setLightbox(true)}>
            {currentSlideIndex + 1} / {shotsCount} {t('ảnh', 'photos')}
          </div>
        </div>

        {/* Desktop Grid Layout */}
        <div className="room-desktop-gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '8px' }}>
          <div
            onClick={() => setLightbox(true)}
            style={{
              gridRow: 'span 2',
              position: 'relative',
              borderRadius: '12px 4px 4px 12px',
              overflow: 'hidden',
              background: '#eef4f8',
              cursor: 'zoom-in',
              minHeight: '220px',
            }}
          >
            <ImageSlot id={`${roomSlug(room.code)}_g0`} src={room.images?.[0]} placeholder={`${room.code} — Main`} style={{ position: 'absolute', inset: 0 }} />
          </div>
          <div
            onClick={() => setLightbox(true)}
            style={{ position: 'relative', borderRadius: '4px 12px 4px 4px', overflow: 'hidden', background: '#eef4f8', cursor: 'zoom-in', minHeight: '105px' }}
          >
            <ImageSlot id={`${roomSlug(room.code)}_g1`} src={room.images?.[1] || room.images?.[0]} placeholder="Góc giường" style={{ position: 'absolute', inset: 0 }} />
          </div>
          <div
            onClick={() => setLightbox(true)}
            style={{ position: 'relative', borderRadius: '4px 4px 12px 4px', overflow: 'hidden', background: '#eef4f8', cursor: 'zoom-in', minHeight: '105px' }}
          >
            <ImageSlot id={`${roomSlug(room.code)}_g2`} src={room.images?.[2] || room.images?.[0]} placeholder="Phòng tắm / ban công" style={{ position: 'absolute', inset: 0 }} />
            <button
              onClick={(e) => {
                e.stopPropagation()
                setLightbox(true)
              }}
              style={{
                position: 'absolute',
                right: '8px',
                bottom: '8px',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(8px)',
                border: 'none',
                color: '#0b1b26',
                fontSize: '10.5px',
                fontWeight: 400,
                padding: '4px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
              }}
            >
              {isEn ? `All ${shotsCount} photos` : `Xem ${shotsCount} ảnh`}
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="nd-section-container" style={{ maxWidth: '1320px', margin: '0 auto', padding: '16px 16px 40px' }}>
        <div className="room-detail-content-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.65fr) minmax(0, 1fr)', gap: '28px', alignItems: 'start' }}>
          {/* Main Info Side */}
          <div>
            <div className="nd-section-subtitle" style={{ color: '#00c46a', marginBottom: '4px' }}>
              NAM DU HILL RESORT · {room.code}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
              {room.tag && (
                <span
                  style={{
                    background: room.darkTag ? '#0b1b26' : '#00c46a',
                    color: room.darkTag ? '#ffffff' : '#04241a',
                    fontSize: '9.5px',
                    fontWeight: 400,
                    padding: '2px 7px',
                    borderRadius: '4px',
                  }}
                >
                  {isEn ? room.tagEn : room.tag}
                </span>
              )}
              <span style={{ fontSize: '10.5px', fontWeight: 400, color: '#00a85c', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                ★ 8.5 <span style={{ color: '#8fa5b3' }}>· 300+ Booking.com reviews</span>
              </span>
            </div>

            <h1 className="nd-h1" style={{ margin: '0 0 6px', color: '#0b1b26' }}>
              {isEn ? room.nameEn : room.name}
            </h1>

            <p className="nd-lead-p" style={{ margin: '0 0 14px', color: '#566e7d' }}>
              {isEn ? room.blurbEn || room.viewEn : room.blurb || room.view}
            </p>

            {/* Prominent Price & Rate Information Banner (Mobile only: Below Title & Short Description) */}
            <div
              className="room-mobile-price-banner"
              style={{
                background: '#f7fbfd',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: '10px',
                padding: '12px 14px',
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 400, color: '#8fa5b3', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {t(`Giá phòng cho 1 đêm (${room.cap} khách)`, `Room rate for 1 night (${room.cap} guests)`)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 400, color: '#0b1b26' }}>
                      {formatVND(room.price)}
                    </span>
                    <span style={{ fontSize: '11px', color: '#8fa5b3' }}>/ {t('đêm', 'night')}</span>
                  </div>
                </div>

                <Link
                  href={`/checkout?room=${encodeURIComponent(room.code)}&in=${checkIn}&out=${checkOut}&guests=${guests}`}
                  style={{
                    background: '#0284c7',
                    color: '#ffffff',
                    fontSize: '11.5px',
                    fontWeight: 400,
                    padding: '7px 16px',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    display: 'inline-block',
                  }}
                >
                  {t('Tiến hành đặt phòng', 'Proceed to Checkout')}
                </Link>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '10.5px', color: '#566e7d', borderTop: '1px solid #e6eef4', paddingTop: '8px' }}>
                <span>✓ {t('Đã gồm bữa sáng', 'Breakfast included')}</span>
                <span>✓ {t('Miễn phí xe đưa đón bến tàu', 'Free pier transfer')}</span>
                <span>✓ {t('Đã bao gồm thuế & phí', 'Taxes & fees included')}</span>
              </div>
            </div>

            {/* 4 Key Specs Cards */}
            <div className="room-specs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '6px', marginBottom: '24px' }}>
              <div style={{ border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', padding: '8px 10px', background: '#ffffff' }}>
                <div className="nd-section-subtitle" style={{ color: '#8fa5b3', marginBottom: '2px' }}>
                  {t('Diện tích', 'Size')}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 400, color: '#0b1b26' }}>{room.area} m²</div>
              </div>
              <div style={{ border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', padding: '8px 10px', background: '#ffffff' }}>
                <div className="nd-section-subtitle" style={{ color: '#8fa5b3', marginBottom: '2px' }}>
                  {t('Sức chứa', 'Sleeps')}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 400, color: '#0b1b26' }}>{isEn ? `${room.cap} guests` : `${room.cap} khách`}</div>
              </div>
              <div style={{ border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', padding: '8px 10px', background: '#ffffff' }}>
                <div className="nd-section-subtitle" style={{ color: '#8fa5b3', marginBottom: '2px' }}>
                  {t('Hướng nhìn', 'View')}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 400, color: '#0b1b26', lineHeight: 1.2 }}>{isEn ? room.viewEn : room.view}</div>
              </div>
              <div style={{ border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', padding: '8px 10px', background: '#ffffff' }}>
                <div className="nd-section-subtitle" style={{ color: '#8fa5b3', marginBottom: '2px' }}>
                  {t('Giường phụ', 'Extra bed')}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 400, color: '#0b1b26', lineHeight: 1.2 }}>
                  {room.exPrice ? formatVND(room.exPrice) : t('Không phụ thu', 'No surcharge')}
                </div>
              </div>
            </div>

            {/* Room Descriptions / Highlights */}
            {room.description && room.description.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h2 className="nd-h2" style={{ margin: '0 0 8px', color: '#0b1b26' }}>
                  {t('Mô tả chi tiết', 'Detailed description')}
                </h2>
                <div style={{ display: 'grid', gap: '6px', fontSize: '11.5px', lineHeight: 1.55, color: '#3d5462' }}>
                  {room.description.map((desc, i) => (
                    <p key={i} style={{ margin: 0 }}>
                      {desc}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* CATEGORIZED ROOM AMENITIES */}
            <div style={{ marginBottom: '28px' }}>
              <h2 className="nd-h2" style={{ margin: '0 0 14px', color: '#0b1b26' }}>
                {t('Tiện nghi phòng', 'Room amenities')}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {amenityCategories.map((cat, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '16px', lineHeight: 1.2, flexShrink: 0, marginTop: '1px' }}>{cat.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: 400, color: '#0b1b26', marginBottom: '4px' }}>
                        {cat.title}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {cat.items.map((item, itemIdx) => (
                          <div key={itemIdx} style={{ fontSize: '11px', color: '#566e7d', lineHeight: 1.4 }}>
                            • {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CHILDREN & EXTRA BED POLICY */}
            <div style={{ marginBottom: '28px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
              <h2 className="nd-h2" style={{ margin: '0 0 12px', color: '#0b1b26', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🛏️</span> {t('Trẻ em và giường phụ', 'Children & Extra Beds')}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: '#f7fbfd', borderRadius: '10px', padding: '14px 16px', border: '1px solid rgba(0,0,0,0.04)' }}>
                <div>
                  <div style={{ fontSize: '11.5px', fontWeight: 400, color: '#0b1b26', marginBottom: '3px' }}>
                    {t('Chính sách trẻ em', 'Children policy')}
                  </div>
                  <div style={{ fontSize: '11px', color: '#566e7d', lineHeight: 1.45 }}>
                    {t(
                      'Phù hợp cho tất cả trẻ em. Trẻ em dưới 6 tuổi ở cùng giường với cha mẹ hoàn toàn miễn phí.',
                      'Suitable for all children. Children under 6 stay free when using existing bedding.'
                    )}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11.5px', fontWeight: 400, color: '#0b1b26', marginBottom: '3px' }}>
                    {t('Chính sách nôi (cũi) và giường phụ', 'Cots & Extra Bed policy')}
                  </div>
                  <div style={{ fontSize: '11px', color: '#566e7d', lineHeight: 1.45 }}>
                    {room.exPrice
                      ? t(
                          `Phòng có hỗ trợ kê thêm giường phụ với mức phí ${formatVND(room.exPrice)}/đêm.`,
                          `Extra bed available upon request for ${formatVND(room.exPrice)}/night.`
                        )
                      : t('Chỗ nghỉ chưa hỗ trợ kê nôi (cũi) hoặc giường phụ cho phòng này.', 'Extra beds and cots are not available for this room.')}
                  </div>
                </div>
              </div>
            </div>

            {/* GUEST FAQ / THẮC MẮC CỦA DU KHÁCH */}
            <div style={{ marginBottom: '28px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
              <h2 className="nd-h2" style={{ margin: '0 0 12px', color: '#0b1b26' }}>
                {t('Thắc mắc thường gặp của du khách', 'Frequently asked questions')}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px', padding: '12px 14px', background: '#ffffff' }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 400, color: '#0b1b26', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>💬</span> {t('Có cho phép thú cưng không ạ?', 'Are pets allowed?')}
                  </div>
                  <div style={{ fontSize: '11px', color: '#566e7d', background: '#f7fbfd', padding: '8px 12px', borderRadius: '6px' }}>
                    {t(
                      'Dạ Nam Du Hill Resort hiện chưa nhận thú cưng để đảm bảo không gian yên tĩnh và vệ sinh chung cho du khách ạ.',
                      'Pets are not allowed to ensure a quiet and hygienic environment for all guests.'
                    )}
                  </div>
                </div>

                <div style={{ border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px', padding: '12px 14px', background: '#ffffff' }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 400, color: '#0b1b26', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🚢</span> {t('Có xe đón tại bến tàu không ạ?', 'Is pier pickup provided?')}
                  </div>
                  <div style={{ fontSize: '11px', color: '#566e7d', background: '#f7fbfd', padding: '8px 12px', borderRadius: '6px' }}>
                    {t(
                      'Dạ resort có xe riêng đón và tiễn miễn phí 2 chiều tại bến tàu Củ Tron cho tất cả du khách đặt phòng ạ.',
                      'Yes, free private roundtrip transfer from Cu Tron pier is included with every room booking.'
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Reviews */}
            {room.reviews && room.reviews.length > 0 && (
              <div style={{ marginBottom: '28px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                <h2 className="nd-h2" style={{ margin: '0 0 10px', color: '#0b1b26' }}>
                  {t('Vì sao khách chọn phòng này', 'Why guests pick this one')}
                </h2>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {room.reviews.map((rev, idx) => (
                    <blockquote
                      key={idx}
                      style={{ margin: 0, border: '1px solid rgba(0,0,0,0.05)', borderRadius: '10px', padding: '12px 14px', background: '#ffffff' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 400, color: '#0b1b26' }}>{rev.who}</span>
                        <span style={{ fontSize: '10.5px', fontWeight: 400, color: '#00a85c' }}>★ {rev.score}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '11px', lineHeight: 1.45, color: '#3d5462' }}>
                        {isEn ? rev.textEn : rev.text}
                      </p>
                    </blockquote>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Booking Sidebar */}
          <aside className="room-booking-sidebar" style={{ position: 'sticky', top: '72px' }}>
            <div style={{ border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', boxShadow: '0 2px 14px rgba(6,40,58,0.04)', padding: '16px 18px', background: '#ffffff' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#0b1b26', marginBottom: '12px' }}>
                {t('Chọn ngày & Đặt phòng', 'Select dates & Book')}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '6px', marginBottom: '6px' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '2px', border: '1px solid #dbe7ef', borderRadius: '6px', padding: '6px 8px' }}>
                  <span style={{ fontSize: '8.5px', fontWeight: 400, textTransform: 'uppercase', color: '#8fa5b3' }}>{t('Nhận phòng', 'Check in')}</span>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    style={{ border: 'none', background: 'transparent', fontSize: '11px', fontWeight: 400, color: '#0b1b26', padding: 0, width: '100%' }}
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '2px', border: '1px solid #dbe7ef', borderRadius: '6px', padding: '6px 8px' }}>
                  <span style={{ fontSize: '8.5px', fontWeight: 400, textTransform: 'uppercase', color: '#8fa5b3' }}>{t('Trả phòng', 'Check out')}</span>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    style={{ border: 'none', background: 'transparent', fontSize: '11px', fontWeight: 400, color: '#0b1b26', padding: 0, width: '100%' }}
                  />
                </label>
              </div>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '2px', border: '1px solid #dbe7ef', borderRadius: '6px', padding: '6px 8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '8.5px', fontWeight: 400, textTransform: 'uppercase', color: '#8fa5b3' }}>{t('Số khách', 'Guests')}</span>
                <input
                  type="number"
                  min={1}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value) || 1)}
                  style={{ border: 'none', background: 'transparent', fontSize: '11px', fontWeight: 400, color: '#0b1b26', padding: 0, width: '100%' }}
                />
              </label>

              <div className="room-sidebar-calc-box" style={{ borderRadius: '8px', background: '#f7fbfd', border: '1px solid rgba(0,0,0,0.05)', padding: '10px 12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', fontSize: '11px', fontWeight: 400, color: '#566e7d' }}>
                  <span>{formatVND(room.price)} × {isEn ? `${nights} night(s)` : `${nights} đêm`}</span>
                  <span style={{ color: '#0b1b26' }}>{formatVND(totalPrice)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', fontSize: '11px', fontWeight: 400, color: '#566e7d' }}>
                  <span>{isEn ? 'Breakfast & transfer' : 'Bữa sáng & đưa đón'}</span>
                  <span style={{ color: '#00a85c' }}>{isEn ? 'Included' : 'Đã gồm'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0 2px', marginTop: '4px', borderTop: '1px solid #e6eef4', fontSize: '11.5px', fontWeight: 400, color: '#0b1b26' }}>
                  <span>{isEn ? 'Deposit to confirm (50%)' : 'Cọc giữ phòng (50%)'}</span>
                  <span style={{ color: '#0284c7' }}>{formatVND(deposit)}</span>
                </div>
              </div>

              <div className="room-sidebar-qr-box room-qr-grid" style={{ display: 'grid', gridTemplateColumns: '76px minmax(0, 1fr)', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <img src={qrUrl} alt="VietQR" style={{ width: '100%', height: '76px', objectFit: 'contain', display: 'block', background: '#f7fbfd' }} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 400, color: '#0b1b26', marginBottom: '2px' }}>
                    {t('Quét mã để cọc 50%', 'Scan to pay 50% deposit')}
                  </div>
                  <div style={{ fontSize: '9.5px', fontWeight: 400, color: '#0284c7', fontFamily: 'monospace' }}>{syntaxText}</div>
                </div>
              </div>



              <div style={{ display: 'grid', gap: '6px' }}>
                <Link
                  href={`/checkout?room=${encodeURIComponent(room.code)}&in=${checkIn}&out=${checkOut}&guests=${guests}`}
                  style={{
                    textAlign: 'center',
                    background: '#0284c7',
                    color: '#ffffff',
                    fontSize: '11.5px',
                    fontWeight: 400,
                    padding: '8px 12px',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    display: 'block',
                  }}
                >
                  {t('Tiến hành đặt phòng', 'Proceed to Checkout')}
                </Link>
                <a
                  href="tel:0985000650"
                  style={{
                    textAlign: 'center',
                    background: '#f2f8fc',
                    color: '#0b1b26',
                    fontSize: '11.5px',
                    fontWeight: 400,
                    padding: '8px 12px',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    display: 'block',
                    border: '1px solid rgba(2,132,199,0.16)',
                  }}
                >
                  {t('Gọi 0985 000 650 giữ phòng', 'Call 0985 000 650')}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Lightbox Overlay */}
      {lightbox && (
        <div
          onClick={() => setLightbox(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 300,
            background: 'rgba(4,16,26,0.94)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 400, color: '#ffffff' }}>
                {room.code} · {isEn ? room.nameEn : room.name}
              </div>
              <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.60)', marginTop: '2px' }}>
                {isEn ? `${shotsCount} photographs` : `${shotsCount} ảnh thực tế`}
              </div>
            </div>
            <button
              onClick={() => setLightbox(false)}
              aria-label="Đóng"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.28)',
                background: 'rgba(255,255,255,0.10)',
                color: '#ffffff',
                fontSize: '15px',
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          </div>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}
          >
            {galleryItems.map((g, idx) => (
              <div key={idx} style={{ position: 'relative', aspectRatio: '4 / 3', borderRadius: '10px', overflow: 'hidden', background: 'rgba(255,255,255,0.06)' }}>
                <ImageSlot id={g.slotId} src={room.images?.[idx] || room.images?.[0]} placeholder={g.hint} style={{ position: 'absolute', inset: 0 }} />
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx global>{`
        /* Mobile Image Slider CSS */
        .room-mobile-slider-container {
          display: none;
          position: relative;
        }

        @media (min-width: 641px) {
          .room-mobile-price-banner {
            display: none !important;
          }
        }

        @media (max-width: 640px) {
          .room-mobile-price-banner {
            display: flex !important;
          }
          .room-detail-wrapper {
            padding-top: 52px !important;
          }
          .room-mobile-slider-container {
            display: block !important;
          }
          .room-mobile-slider {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            gap: 0 !important;
            border-radius: 12px !important;
            -webkit-overflow-scrolling: touch;
          }
          .room-mobile-slide {
            flex: 0 0 100% !important;
            scroll-snap-align: start !important;
            aspect-ratio: 16 / 10 !important;
            position: relative !important;
            border-radius: 12px !important;
            overflow: hidden !important;
            background: #eef4f8;
          }
          .room-slide-badge {
            position: absolute;
            bottom: 10px;
            right: 10px;
            background: rgba(6, 30, 48, 0.75);
            backdrop-filter: blur(8px);
            color: #ffffff;
            font-size: 10px;
            font-weight: 400;
            padding: 3px 8px;
            border-radius: 4px;
            cursor: pointer;
            z-index: 5;
          }
          .room-desktop-gallery-grid {
            display: none !important;
          }
          .room-detail-content-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .room-specs-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 6px !important;
          }
          .room-booking-sidebar {
            position: static !important;
            margin-top: 16px !important;
          }
          .room-sidebar-calc-box,
          .room-sidebar-qr-box {
            display: none !important;
          }
        }
      `}</style>
    </main>
  )
}
