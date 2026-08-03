'use client'

import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'

interface BookingCalendarModalProps {
  isOpen: boolean
  onClose: () => void
  checkIn: string
  checkOut: string
  guests: string
  roomType: string
  onSave: (checkIn: string, checkOut: string, guests: string, roomType: string) => void
}

export function BookingCalendarModal({
  isOpen,
  onClose,
  checkIn: initialCheckIn,
  checkOut: initialCheckOut,
  guests: initialGuests,
  roomType: initialRoomType,
  onSave,
}: BookingCalendarModalProps) {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<'calendar' | 'flex'>('calendar')
  const [step, setStep] = useState<'overview' | 'calendar' | 'guests'>('overview')

  const [selCheckIn, setSelCheckIn] = useState<string>(initialCheckIn || '2026-08-03')
  const [selCheckOut, setSelCheckOut] = useState<string>(initialCheckOut || '2026-08-04')
  const [selGuests, setSelGuests] = useState<string>(initialGuests || '2 khách')
  const [selRoomType, setSelRoomType] = useState<string>(initialRoomType || 'Tất cả 20 hạng phòng')
  const [flexTolerance, setFlexTolerance] = useState<number>(0)

  if (!isOpen) return null

  // Helpers for calendar rendering (Aug 2026 & Sept 2026)
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOffset = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay()
    return day === 0 ? 6 : day - 1 // Monday = 0
  }

  const renderMonth = (year: number, monthIdx: number, monthName: string) => {
    const totalDays = getDaysInMonth(year, monthIdx)
    const offset = getFirstDayOffset(year, monthIdx)
    const days = []

    // Empty cells before day 1
    for (let i = 0; i < offset; i++) {
      days.push(<div key={`empty-${i}`} className="cal-cell empty" />)
    }

    // Day cells
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const isStart = dateStr === selCheckIn
      const isEnd = dateStr === selCheckOut
      const inRange = selCheckIn && selCheckOut && dateStr > selCheckIn && dateStr < selCheckOut

      days.push(
        <button
          key={dateStr}
          onClick={() => {
            if (!selCheckIn || (selCheckIn && selCheckOut)) {
              setSelCheckIn(dateStr)
              setSelCheckOut('')
            } else if (dateStr > selCheckIn) {
              setSelCheckOut(dateStr)
            } else {
              setSelCheckIn(dateStr)
              setSelCheckOut('')
            }
          }}
          className={`cal-cell ${isStart ? 'start-date' : ''} ${isEnd ? 'end-date' : ''} ${inRange ? 'in-range' : ''}`}
        >
          <span className="day-number">{d}</span>
        </button>
      )
    }

    return (
      <div key={`${year}-${monthIdx}`} style={{ marginBottom: '24px' }}>
        <h4 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{monthName}</h4>
        <div className="cal-grid">{days}</div>
      </div>
    )
  }

  // Calculate nights
  const calculateNights = () => {
    if (!selCheckIn || !selCheckOut) return 1
    const start = new Date(selCheckIn).getTime()
    const end = new Date(selCheckOut).getTime()
    const diff = Math.max(1, Math.round((end - start) / (1000 * 3600 * 24)))
    return diff
  }

  const handleApply = () => {
    onSave(selCheckIn, selCheckOut || selCheckIn, selGuests, selRoomType)
    onClose()
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 350,
        background: 'rgba(15,23,42,0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      {/* Bottom Sheet Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="booking-modal-sheet"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          background: '#ffffff',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          overflowY: 'auto',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.20)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Handle bar */}
        <div style={{ width: '40px', height: '5px', borderRadius: '3px', background: '#cbd5e1', margin: '10px auto 4px' }} />

        {/* Header */}
        <div
          style={{
            padding: '12px 20px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <button
            onClick={() => (step !== 'overview' ? setStep('overview') : onClose())}
            style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer', color: '#0f172a', padding: 0 }}
          >
            ✕
          </button>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
            {step === 'calendar' ? t('Chọn ngày', 'Select Dates') : t('Chỉnh sửa tìm kiếm', 'Edit Search')}
          </h3>
          <div style={{ width: '20px' }} />
        </div>

        {/* Modal Content */}
        <div style={{ padding: '16px 20px 100px', flex: 1, overflowY: 'auto' }}>
          {step === 'overview' && (
            <div style={{ display: 'grid', gap: '12px' }}>
              {/* Destination Card */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: '#f8fafc',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  border: '1.5px solid #e2e8f0',
                }}
              >
                <span style={{ fontSize: '18px' }}>📍</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>
                    {t('Điểm đến', 'Destination')}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>The Nam Du Hill (Ấp Củ Tron)</div>
                </div>
              </div>

              {/* Dates Selector Box */}
              <div
                onClick={() => setStep('calendar')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: '#ffffff',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  border: '2px solid #006ce4',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0,108,228,0.08)',
                }}
              >
                <span style={{ fontSize: '18px' }}>📅</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '10px', color: '#006ce4', fontWeight: 800, textTransform: 'uppercase' }}>
                    {t('Ngày nhận & trả phòng', 'Check-in & Check-out')}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                    {selCheckIn} — {selCheckOut || selCheckIn} ({calculateNights()} {t('đêm', 'night(s)')})
                  </div>
                </div>
                <span style={{ fontSize: '12px', color: '#006ce4', fontWeight: 700 }}>{t('Thay đổi ›', 'Change ›')}</span>
              </div>

              {/* Guests & Room Box */}
              <div
                onClick={() => setStep('guests')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: '#f8fafc',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  border: '1.5px solid #e2e8f0',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: '18px' }}>👤</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>
                    {t('Số khách & Hạng phòng', 'Guests & Room')}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                    {selGuests} · {selRoomType}
                  </div>
                </div>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>{t('Thay đổi ›', 'Change ›')}</span>
              </div>
            </div>
          )}

          {/* Calendar Date Picker View */}
          {step === 'calendar' && (
            <div>
              {/* Calendar Tab switcher */}
              <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: '16px' }}>
                <button
                  onClick={() => setActiveTab('calendar')}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '14px',
                    fontWeight: 800,
                    color: activeTab === 'calendar' ? '#006ce4' : '#64748b',
                    borderBottom: activeTab === 'calendar' ? '3px solid #006ce4' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  {t('Lịch', 'Calendar')}
                </button>
                <button
                  onClick={() => setActiveTab('flex')}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '14px',
                    fontWeight: 800,
                    color: activeTab === 'flex' ? '#006ce4' : '#64748b',
                    borderBottom: activeTab === 'flex' ? '3px solid #006ce4' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  {t('Ngày linh hoạt', 'Flexible dates')}
                </button>
              </div>

              {/* Day headers */}
              <div className="cal-grid-header" style={{ marginBottom: '12px' }}>
                <span>T2</span>
                <span>T3</span>
                <span>T4</span>
                <span>T5</span>
                <span>T6</span>
                <span>T7</span>
                <span>CN</span>
              </div>

              {/* Month 1: August 2026 */}
              {renderMonth(2026, 7, t('tháng 8 năm 2026', 'August 2026'))}

              {/* Month 2: September 2026 */}
              {renderMonth(2026, 8, t('tháng 9 năm 2026', 'September 2026'))}

              {/* Quick tolerance chips */}
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginTop: '12px' }}>
                {[0, 1, 2, 3, 7].map((num) => (
                  <button
                    key={num}
                    onClick={() => setFlexTolerance(num)}
                    style={{
                      border: flexTolerance === num ? '2px solid #006ce4' : '1px solid #cbd5e1',
                      background: flexTolerance === num ? '#eff6ff' : '#ffffff',
                      color: flexTolerance === num ? '#006ce4' : '#334155',
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '6px 12px',
                      borderRadius: '999px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {num === 0 ? t('Ngày chính xác', 'Exact dates') : `± ${num} ${t('ngày', 'day(s)')}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Guests Selector View */}
          {step === 'guests' && (
            <div style={{ display: 'grid', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  {t('Số lượng khách', 'Number of Guests')}
                </label>
                <select
                  value={selGuests}
                  onChange={(e) => setSelGuests(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '15px',
                    fontWeight: 700,
                    marginTop: '6px',
                  }}
                >
                  <option value="1 khách">1 khách</option>
                  <option value="2 khách">2 khách</option>
                  <option value="3 khách">3 khách</option>
                  <option value="4 khách">4 khách</option>
                  <option value="6 khách">6 khách (Gia đình)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  {t('Hạng phòng mong muốn', 'Preferred Room Type')}
                </label>
                <select
                  value={selRoomType}
                  onChange={(e) => setSelRoomType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '15px',
                    fontWeight: 700,
                    marginTop: '6px',
                  }}
                >
                  <option value="Tất cả 20 hạng phòng">Tất cả 20 hạng phòng</option>
                  <option value="#14 Rock Deluxe">#14 Rock Deluxe (View biển độc bản)</option>
                  <option value="#05 Lục Giác Kính">#05 Lục Giác Kính (Panorama 360°)</option>
                  <option value="#07 Superior King">#07 Superior King (Bồn tắm Jacuzzi)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Fixed Action Footer Bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>
              {selCheckIn} — {selCheckOut || selCheckIn}
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>
              {calculateNights()} {t('đêm', 'night(s)')} · {selGuests}
            </div>
          </div>

          <button
            onClick={handleApply}
            style={{
              background: '#006ce4',
              color: '#ffffff',
              border: 'none',
              fontSize: '15px',
              fontWeight: 800,
              padding: '14px 28px',
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0,108,228,0.30)',
            }}
          >
            {step === 'calendar' ? t('Chọn ngày', 'Select dates') : t('Tìm', 'Search')}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .cal-grid-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          font-size: 12px;
          font-weight: 800;
          color: #64748b;
        }
        .cal-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }
        .cal-cell {
          aspect-ratio: 1;
          border: none;
          background: transparent;
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cal-cell:hover {
          background: #f1f5f9;
        }
        .cal-cell.start-date {
          background: #006ce4 !important;
          color: #ffffff !important;
          border-top-left-radius: 12px;
          border-bottom-left-radius: 12px;
        }
        .cal-cell.end-date {
          background: #006ce4 !important;
          color: #ffffff !important;
          border-top-right-radius: 12px;
          border-bottom-right-radius: 12px;
        }
        .cal-cell.in-range {
          background: #dbeafe !important;
          color: #1e40af !important;
          border-radius: 0;
        }
        .cal-cell.empty {
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
