'use client'

import { UI } from '@repo/core'

import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { Room, formatVND, roomSlug } from '../../data/rooms'
import { ImageSlot } from '../common/ImageSlot'

interface BookingModalProps {
  room: Room
  onClose: () => void
}

export function BookingModal({ room, onClose }: BookingModalProps) {
  const { language, tx } = useLanguage()
  const isEn = language === 'en'

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

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(6,24,36,0.58)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
        animation: 'ndFade 150ms ease both',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '880px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#ffffff',
          borderRadius: '28px',
          animation: 'ndPop 200ms cubic-bezier(0.22,1,0.36,1) both',
        }}
      >
        {/* Top Header Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div
            style={{
              position: 'relative',
              minHeight: '236px',
              background: '#eef4f8',
              borderRadius: '28px 0 0 0',
              overflow: 'hidden',
            }}
          >
            <ImageSlot
              id={roomSlug(room.code)}
              placeholder={`${room.code} — ${isEn ? room.nameEn : room.name}`}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div style={{ padding: '30px 32px 26px', position: 'relative' }}>
            <button
              onClick={onClose}
              aria-label="Đóng"
              style={{
                position: 'absolute',
                top: '20px',
                right: '22px',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                border: 'none',
                background: '#f2f8fc',
                color: '#3d5462',
                fontSize: '18px',
                fontWeight: 700,
                cursor: 'pointer',
                lineHeight: 1,
                transition: 'background 150ms ease',
              }}
            >
              ×
            </button>
            <div
              style={{
                fontSize: '11.5px',
                fontWeight: 800,
                letterSpacing: '0.12em',
                color: '#0284c7',
                marginBottom: '8px',
              }}
            >
              {room.code}
            </div>
            <h3
              style={{
                margin: '0 0 8px',
                fontSize: '24px',
                fontWeight: 800,
                letterSpacing: '-0.026em',
                color: '#0b1b26',
                lineHeight: 1.18,
              }}
            >
              {isEn ? room.nameEn : room.name}
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '14px', lineHeight: 1.5, color: '#566e7d' }}>
              {isEn ? room.viewEn : room.view}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <span
                style={{
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: '#3d5462',
                  background: '#f2f8fc',
                  padding: '6px 10px',
                  borderRadius: '8px',
                }}
              >
                {room.area} m²
              </span>
              <span
                style={{
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: '#3d5462',
                  background: '#f2f8fc',
                  padding: '6px 10px',
                  borderRadius: '8px',
                }}
              >
                {isEn ? `${room.cap} guests` : `${room.cap} khách`}
              </span>
              <span
                style={{
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: '#3d5462',
                  background: '#f2f8fc',
                  padding: '6px 10px',
                  borderRadius: '8px',
                }}
              >
                {room.exPrice
                  ? isEn
                    ? `Extra bed ${formatVND(room.exPrice)}`
                    : `Giường phụ ${formatVND(room.exPrice)}`
                  : isEn
                  ? 'No surcharge'
                  : 'Không phụ thu'}
              </span>
            </div>
          </div>
        </div>

        {/* Dates & Guests Input */}
        <div style={{ padding: '16px 32px 0', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', border: '1px solid #dbe7ef', borderRadius: '14px', padding: '11px 14px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8fa5b3' }}>
              {tx(UI.checkIn)}
            </span>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              style={{ border: 'none', background: 'transparent', fontSize: '14px', fontWeight: 600, color: '#0b1b26', padding: 0, width: '100%' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', border: '1px solid #dbe7ef', borderRadius: '14px', padding: '11px 14px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8fa5b3' }}>
              {tx(UI.checkOut)}
            </span>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              style={{ border: 'none', background: 'transparent', fontSize: '14px', fontWeight: 600, color: '#0b1b26', padding: 0, width: '100%' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', border: '1px solid #dbe7ef', borderRadius: '14px', padding: '11px 14px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8fa5b3' }}>
              {tx(UI.guests2)}
            </span>
            <input
              type="number"
              min={1}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value) || 1)}
              style={{ border: 'none', background: 'transparent', fontSize: '14px', fontWeight: 600, color: '#0b1b26', padding: 0, width: '100%' }}
            />
          </label>
        </div>

        {/* Pricing Summary */}
        <div style={{ padding: '18px 32px 0' }}>
          <div style={{ borderRadius: '18px', background: '#f7fbfd', border: '1px solid #e6eef4', padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', fontSize: '14px', fontWeight: 600, color: '#566e7d' }}>
              <span>{formatVND(room.price)} × {isEn ? `${nights} night(s)` : `${nights} đêm`}</span>
              <span style={{ color: '#0b1b26', fontWeight: 700 }}>{formatVND(totalPrice)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', fontSize: '14px', fontWeight: 600, color: '#566e7d' }}>
              <span>{isEn ? 'Breakfast & pier transfer' : 'Bữa sáng & đưa đón bến tàu'}</span>
              <span style={{ color: '#00a85c', fontWeight: 700 }}>{isEn ? 'Included' : 'Đã gồm'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0 2px', marginTop: '6px', borderTop: '1px solid #e6eef4', fontSize: '15px', fontWeight: 800, color: '#0b1b26' }}>
              <span>{isEn ? 'Deposit to confirm (50%)' : 'Cọc giữ phòng (50%)'}</span>
              <span style={{ color: '#0284c7', fontWeight: 800 }}>{formatVND(deposit)}</span>
            </div>
          </div>
        </div>

        {/* VietQR Section */}
        <div style={{ padding: '18px 32px 30px', display: 'grid', gridTemplateColumns: '148px 1fr', gap: '22px', alignItems: 'center' }}>
          <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #e6eef4', background: '#ffffff' }}>
            <img
              src={qrUrl}
              alt="VietQR Deposit"
              style={{ width: '100%', height: '148px', objectFit: 'contain', display: 'block', background: '#f7fbfd' }}
            />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0b1b26', marginBottom: '6px' }}>
              {tx(UI.payA50DepositToConfirm)}
            </div>
            <div style={{ fontSize: '13px', lineHeight: 1.55, color: '#566e7d', marginBottom: '14px' }}>
              Cú pháp: <span style={{ fontWeight: 700, color: '#0284c7' }}>{syntaxText}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <a
                href={`tel:0985000650`}
                style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  padding: '12px 20px',
                  borderRadius: '999px',
                  textDecoration: 'none',
                  transition: 'background 150ms ease',
                }}
              >
                {tx(UI.confirmViaHotline0985000650)}
              </a>
            </div>
            <div style={{ marginTop: '12px', fontSize: '11.5px', color: '#8fa5b3', lineHeight: 1.5 }}>
              {tx(UI.freeCancellationUpTo7Days)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
