'use client'

import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { Room, BASE_AMENITIES, formatVND, roomSlug } from '../../data/rooms'
import { ImageSlot } from '../common/ImageSlot'

interface RoomDetailModalProps {
  room: Room
  onClose: () => void
  onSelectOtherRoom?: (room: Room) => void
}

export function RoomDetailModal({ room, onClose }: RoomDetailModalProps) {
  const { t, language } = useLanguage()
  const isEn = language === 'en'

  const [lightbox, setLightbox] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  const [checkIn, setCheckIn] = useState(today)
  const [checkOut, setCheckOut] = useState(tomorrow)
  const [guests, setGuests] = useState(room.cap || 2)

  const calcNights = () => {
    if (!checkIn || !checkOut) return 1
    const diff = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000
    return diff > 0 ? Math.round(diff) : 1
  }

  const nights = calcNights()
  const totalPrice = room.price * nights
  const deposit = Math.round(totalPrice / 2)

  const cleanCode = room.code.replace('#', '').replace('-', '_')
  const syntaxText = `NAMDU ${cleanCode} ${guests}K ${nights}D`

  const qrUrl = `https://img.vietqr.io/image/970436-0985000650-compact.png?amount=${deposit}&addInfo=${encodeURIComponent(
    syntaxText
  )}&accountName=${encodeURIComponent('THE NAM DU HILL')}`

  const allAmenities = (room.amenities || []).concat(BASE_AMENITIES)

  const shotsCount = room.shots || 8
  const galleryItems = Array.from({ length: shotsCount }, (_, i) => ({
    slotId: `${roomSlug(room.code)}_g${i}`,
    hint: `${room.code} — ${isEn ? room.nameEn : room.name} (${i + 1})`,
  }))

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(4,16,26,0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        justifyContent: 'center',
        overflowY: 'auto',
        padding: '40px 20px',
        animation: 'ndFade 150ms ease both',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '1240px',
          background: '#ffffff',
          borderRadius: '32px',
          position: 'relative',
          padding: '36px 40px 48px',
          margin: 'auto 0',
          boxShadow: '0 24px 64px rgba(0,0,0,0.32)',
          animation: 'ndPop 200ms cubic-bezier(0.22,1,0.36,1) both',
        }}
      >
        {/* Close Modal Button */}
        <button
          onClick={onClose}
          aria-label="Đóng"
          style={{
            position: 'absolute',
            top: '24px',
            right: '28px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            background: '#f2f8fc',
            color: '#0b1b26',
            fontSize: '22px',
            fontWeight: 700,
            cursor: 'pointer',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 150ms ease',
          }}
        >
          ×
        </button>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '13px', color: '#8fa5b3', fontWeight: 600 }}>
          <span>Trang chủ</span>
          <span>›</span>
          <span>Phòng nghỉ</span>
          <span>›</span>
          <span style={{ color: '#0b1b26', fontWeight: 700 }}>{isEn ? room.nameEn : room.name}</span>
        </div>

        {/* Hero Photo Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2.1fr) minmax(0, 1fr)', gridTemplateRows: '210px 210px', gap: '10px', marginBottom: '36px' }}>
          <div
            onClick={() => setLightbox(true)}
            style={{ gridRow: 'span 2', position: 'relative', borderRadius: '24px 8px 8px 24px', overflow: 'hidden', background: '#eef4f8', cursor: 'zoom-in' }}
          >
            <ImageSlot id={`${roomSlug(room.code)}_g0`} placeholder={`${room.code} — Main`} style={{ position: 'absolute', inset: 0 }} />
          </div>
          <div
            onClick={() => setLightbox(true)}
            style={{ position: 'relative', borderRadius: '8px 24px 8px 8px', overflow: 'hidden', background: '#eef4f8', cursor: 'zoom-in' }}
          >
            <ImageSlot id={`${roomSlug(room.code)}_g1`} placeholder="Góc giường" style={{ position: 'absolute', inset: 0 }} />
          </div>
          <div
            onClick={() => setLightbox(true)}
            style={{ position: 'relative', borderRadius: '8px 8px 24px 8px', overflow: 'hidden', background: '#eef4f8', cursor: 'zoom-in' }}
          >
            <ImageSlot id={`${roomSlug(room.code)}_g2`} placeholder="Phòng tắm / ban công" style={{ position: 'absolute', inset: 0 }} />
            <button
              onClick={(e) => {
                e.stopPropagation()
                setLightbox(true)
              }}
              style={{
                position: 'absolute',
                right: '14px',
                bottom: '14px',
                background: 'rgba(255,255,255,0.96)',
                backdropFilter: 'blur(8px)',
                border: 'none',
                color: '#0b1b26',
                fontSize: '12.5px',
                fontWeight: 800,
                padding: '11px 18px',
                borderRadius: '999px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 14px rgba(3,20,32,0.22)',
              }}
            >
              {isEn ? `All ${shotsCount} photos` : `Xem ${shotsCount} ảnh`}
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.65fr) minmax(0, 1fr)', gap: '48px', alignItems: 'start' }}>
          {/* Main Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <span style={{ background: '#0284c7', color: '#ffffff', fontSize: '11.5px', fontWeight: 800, padding: '6px 12px', borderRadius: '999px' }}>
                {room.code}
              </span>
              {room.tag && (
                <span
                  style={{
                    background: room.darkTag ? '#0b1b26' : '#00c46a',
                    color: room.darkTag ? '#ffffff' : '#04241a',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '6px 12px',
                    borderRadius: '999px',
                  }}
                >
                  {isEn ? room.tagEn : room.tag}
                </span>
              )}
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#00a85c', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                ★ 8.5 <span style={{ fontWeight: 500, color: '#8fa5b3' }}>· 300+ Booking.com reviews</span>
              </span>
            </div>

            <h1 style={{ margin: '0 0 12px', fontSize: 'clamp(28px, 3.2vw, 40px)', lineHeight: 1.1, fontWeight: 800, color: '#0b1b26' }}>
              {isEn ? room.nameEn : room.name}
            </h1>

            <p style={{ margin: '0 0 26px', fontSize: '16.5px', lineHeight: 1.62, color: '#566e7d' }}>
              {isEn ? room.blurbEn || room.viewEn : room.blurb || room.view}
            </p>

            {/* 4 Specs Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '10px', marginBottom: '40px' }}>
              <div style={{ border: '1px solid #e6eef4', borderRadius: '16px', padding: '16px 18px' }}>
                <div style={{ fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase', color: '#8fa5b3', marginBottom: '6px' }}>
                  {t('Diện tích', 'Size')}
                </div>
                <div style={{ fontSize: '17px', fontWeight: 800, color: '#0b1b26' }}>{room.area} m²</div>
              </div>
              <div style={{ border: '1px solid #e6eef4', borderRadius: '16px', padding: '16px 18px' }}>
                <div style={{ fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase', color: '#8fa5b3', marginBottom: '6px' }}>
                  {t('Sức chứa', 'Sleeps')}
                </div>
                <div style={{ fontSize: '17px', fontWeight: 800, color: '#0b1b26' }}>{isEn ? `${room.cap} guests` : `${room.cap} khách`}</div>
              </div>
              <div style={{ border: '1px solid #e6eef4', borderRadius: '16px', padding: '16px 18px' }}>
                <div style={{ fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase', color: '#8fa5b3', marginBottom: '6px' }}>
                  {t('Hướng nhìn', 'View')}
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0b1b26', lineHeight: 1.3 }}>{isEn ? room.viewEn : room.view}</div>
              </div>
              <div style={{ border: '1px solid #e6eef4', borderRadius: '16px', padding: '16px 18px' }}>
                <div style={{ fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase', color: '#8fa5b3', marginBottom: '6px' }}>
                  {t('Giường phụ', 'Extra bed')}
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0b1b26', lineHeight: 1.3 }}>
                  {room.exPrice ? formatVND(room.exPrice) : t('Không phụ thu', 'No surcharge')}
                </div>
              </div>
            </div>

            {/* Amenities Grid */}
            <h2 style={{ margin: '0 0 18px', fontSize: '22px', fontWeight: 800, color: '#0b1b26' }}>
              {t('Trong phòng có gì', 'What is in this room')}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px 20px', marginBottom: '40px' }}>
              {allAmenities.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', padding: '6px 0' }}>
                  <span style={{ color: '#00c46a', fontSize: '13px', lineHeight: 1.5, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: '14px', lineHeight: 1.5, color: '#3d5462' }}>{isEn ? item[1] : item[0]}</span>
                </div>
              ))}
            </div>

            {/* Guest Reviews */}
            {room.reviews && room.reviews.length > 0 && (
              <>
                <h2 style={{ margin: '0 0 18px', fontSize: '22px', fontWeight: 800, color: '#0b1b26' }}>
                  {t('Vì sao khách chọn phòng này', 'Why guests pick this one')}
                </h2>
                <div style={{ display: 'grid', gap: '12px', marginBottom: '40px' }}>
                  {room.reviews.map((rev, idx) => (
                    <blockquote
                      key={idx}
                      style={{ margin: 0, border: '1px solid #e6eef4', borderRadius: '20px', padding: '20px 22px', background: '#ffffff' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#0b1b26' }}>{rev.who}</span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#00a85c' }}>★ {rev.score}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#3d5462' }}>
                        {isEn ? rev.textEn : rev.text}
                      </p>
                    </blockquote>
                  ))}
                </div>
              </>
            )}

            {/* House Rules */}
            <h2 style={{ margin: '0 0 18px', fontSize: '22px', fontWeight: 800, color: '#0b1b26' }}>
              {t('Quy định phòng', 'House rules')}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px' }}>
              <div style={{ background: '#f7fbfd', border: '1px solid #e6eef4', borderRadius: '18px', padding: '18px 20px' }}>
                <div style={{ fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase', color: '#8fa5b3', marginBottom: '6px' }}>
                  {t('Nhận / trả phòng', 'Check-in / check-out')}
                </div>
                <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#0b1b26' }}>
                  {t('Từ 14:00 · đến 12:00', 'From 14:00 · until 12:00')}
                </div>
              </div>
              <div style={{ background: '#f7fbfd', border: '1px solid #e6eef4', borderRadius: '18px', padding: '18px 20px' }}>
                <div style={{ fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase', color: '#8fa5b3', marginBottom: '6px' }}>
                  {t('Huỷ phòng', 'Cancellation')}
                </div>
                <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#0b1b26' }}>
                  {t('Miễn phí trước 7 ngày', 'Free up to 7 days before arrival')}
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Booking Sidebar */}
          <aside style={{ position: 'sticky', top: '24px' }}>
            <div style={{ border: '1px solid #e6eef4', borderRadius: '24px', boxShadow: '0 14px 40px rgba(6,40,58,0.09)', padding: '24px', background: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '30px', fontWeight: 800, color: '#0b1b26', letterSpacing: '-0.03em' }}>{formatVND(room.price)}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#8fa5b3' }}>/ đêm</span>
              </div>
              <div style={{ fontSize: '12.5px', fontWeight: 500, color: '#8fa5b3', marginBottom: '18px' }}>
                {t('Đã gồm bữa sáng và đưa đón bến tàu', 'Breakfast and pier transfer included')}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px', marginBottom: '8px' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', border: '1px solid #dbe7ef', borderRadius: '14px', padding: '10px 12px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#8fa5b3' }}>{t('Nhận phòng', 'Check in')}</span>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    style={{ border: 'none', background: 'transparent', fontSize: '13.5px', fontWeight: 600, color: '#0b1b26', padding: 0, width: '100%' }}
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', border: '1px solid #dbe7ef', borderRadius: '14px', padding: '10px 12px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#8fa5b3' }}>{t('Trả phòng', 'Check out')}</span>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    style={{ border: 'none', background: 'transparent', fontSize: '13.5px', fontWeight: 600, color: '#0b1b26', padding: 0, width: '100%' }}
                  />
                </label>
              </div>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', border: '1px solid #dbe7ef', borderRadius: '14px', padding: '10px 12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#8fa5b3' }}>{t('Số khách', 'Guests')}</span>
                <input
                  type="number"
                  min={1}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value) || 1)}
                  style={{ border: 'none', background: 'transparent', fontSize: '13.5px', fontWeight: 600, color: '#0b1b26', padding: 0, width: '100%' }}
                />
              </label>

              <div style={{ borderRadius: '16px', background: '#f7fbfd', border: '1px solid #e6eef4', padding: '16px 18px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '13.5px', fontWeight: 600, color: '#566e7d' }}>
                  <span>{formatVND(room.price)} × {isEn ? `${nights} night(s)` : `${nights} đêm`}</span>
                  <span style={{ color: '#0b1b26', fontWeight: 700 }}>{formatVND(totalPrice)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '13.5px', fontWeight: 600, color: '#566e7d' }}>
                  <span>{isEn ? 'Breakfast & transfer' : 'Bữa sáng & đưa đón'}</span>
                  <span style={{ color: '#00a85c', fontWeight: 700 }}>{isEn ? 'Included' : 'Đã gồm'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 2px', marginTop: '5px', borderTop: '1px solid #e6eef4', fontSize: '14.5px', fontWeight: 800, color: '#0b1b26' }}>
                  <span>{isEn ? 'Deposit to confirm (50%)' : 'Cọc giữ phòng (50%)'}</span>
                  <span style={{ color: '#0284c7', fontWeight: 800 }}>{formatVND(deposit)}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '108px minmax(0, 1fr)', gap: '14px', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #e6eef4' }}>
                  <img src={qrUrl} alt="VietQR" style={{ width: '100%', height: '108px', objectFit: 'contain', display: 'block', background: '#f7fbfd' }} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0b1b26', marginBottom: '5px' }}>
                    {t('Quét mã để cọc 50%', 'Scan to pay 50% deposit')}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0284c7', fontFamily: 'monospace' }}>{syntaxText}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '8px' }}>
                <a
                  href={`tel:0985000650`}
                  style={{
                    textAlign: 'center',
                    background: '#0284c7',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 700,
                    padding: '14px 20px',
                    borderRadius: '14px',
                    textDecoration: 'none',
                  }}
                >
                  {t('Gọi 0985 000 650 giữ phòng', 'Call 0985 000 650 to book')}
                </a>
              </div>
            </div>
          </aside>
        </div>

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
              padding: '28px 32px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                  {room.code} · {isEn ? room.nameEn : room.name}
                </div>
                <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.60)', marginTop: '3px' }}>
                  {isEn ? `${shotsCount} photographs` : `${shotsCount} ảnh thực tế`}
                </div>
              </div>
              <button
                onClick={() => setLightbox(false)}
                aria-label="Đóng"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.28)',
                  background: 'rgba(255,255,255,0.10)',
                  color: '#ffffff',
                  fontSize: '20px',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}
            >
              {galleryItems.map((g, idx) => (
                <div key={idx} style={{ position: 'relative', aspectRatio: '4 / 3', borderRadius: '16px', overflow: 'hidden', background: 'rgba(255,255,255,0.06)' }}>
                  <ImageSlot id={g.slotId} placeholder={g.hint} style={{ position: 'absolute', inset: 0 }} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
