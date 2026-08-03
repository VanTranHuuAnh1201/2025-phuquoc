'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'
import { ImageSlot } from '../../components/common/ImageSlot'
import { ROOMS, formatVND, roomSlug, Room } from '../../data/rooms'

const BIKE_RATE = 150000

function CheckoutContent() {
  const { t, language } = useLanguage()
  const isEn = language === 'en'
  const searchParams = useSearchParams()

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [ci, setCi] = useState('')
  const [co, setCo] = useState('')
  const [guests, setGuests] = useState(2)
  const [bikes, setBikes] = useState(0)
  const [method, setMethod] = useState<'qr' | 'momo' | 'cash'>('qr')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [boat, setBoat] = useState('')
  const [room, setRoom] = useState<Room>(ROOMS[12]!)

  useEffect(() => {
    const handleNextStep = () => {
      setStep((prev) => (prev < 3 ? ((prev + 1) as 1 | 2 | 3) : 3))
      window.scrollTo(0, 0)
    }
    window.addEventListener('ndh:checkout-next', handleNextStep)
    return () => window.removeEventListener('ndh:checkout-next', handleNextStep)
  }, [])

  useEffect(() => {
    const rCode = searchParams.get('room')
    if (rCode) {
      const want = '#' + rCode.replace(/^#/, '')
      const found = ROOMS.find((r) => r.code === want)
      if (found) {
        setRoom(found)
        return
      }
    }
    try {
      const saved = localStorage.getItem('ndh:last-room')
      if (saved) {
        const want = '#' + saved.replace(/^#/, '')
        const found = ROOMS.find((r) => r.code === want)
        if (found) setRoom(found)
      }
    } catch {}
  }, [searchParams])

  const calculateNights = () => {
    if (!ci || !co) return 1
    const d = (new Date(co).getTime() - new Date(ci).getTime()) / (1000 * 3600 * 24)
    return d > 0 ? Math.round(d) : 1
  }

  const nights = calculateNights()
  const totalAmount = room.price * nights + bikes * BIKE_RATE * nights
  const depositAmount = Math.round(totalAmount / 2)

  const phoneLast4 = phone.replace(/\D/g, '').slice(-4)
  const refCode = `NAMDU ${room.code.replace('#', '')} ${nights}D${phoneLast4 ? ' ' + phoneLast4 : ''}`

  const qrSrc = `https://img.vietqr.io/image/970436-0985000650-compact.png?amount=${depositAmount}&addInfo=${encodeURIComponent(refCode)}&accountName=${encodeURIComponent('THE NAM DU HILL')}`

  const formatDate = (d: string) => {
    if (!d) return isEn ? 'Not set' : 'Chưa chọn'
    const [y, m, dd] = d.split('-')
    return `${dd}/${m}/${y}`
  }

  const methodsList = [
    {
      k: 'qr',
      titleVi: 'VietQR — chuyển khoản ngân hàng',
      titleEn: 'VietQR — bank transfer',
      subVi: 'Quét mã, tiền vào ngay, không phí',
      subEn: 'Scan, instant, no fee',
      tagVi: 'PHỔ BIẾN NHẤT',
      tagEn: 'MOST USED',
    },
    {
      k: 'momo',
      titleVi: 'Ví MoMo',
      titleEn: 'MoMo wallet',
      subVi: 'Chuyển tới 0985 000 650',
      subEn: 'Send to 0985 000 650',
      tagVi: '',
      tagEn: '',
    },
    {
      k: 'cash',
      titleVi: 'Trả toàn bộ khi nhận phòng',
      titleEn: 'Pay in full on arrival',
      subVi: 'Chỉ áp dụng ngoài mùa cao điểm, cần xác nhận qua Zalo',
      subEn: 'Off-peak only, needs Zalo confirmation',
      tagVi: '',
      tagEn: '',
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f7fbfd', color: '#0b1b26' }}>
      {/* Main Container */}
      <main className="nd-page-main checkout-main-container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '72px 24px 48px' }}>
        <div className="checkout-grid-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.55fr) minmax(0, 1fr)', gap: '24px', alignItems: 'start' }}>
          
          {/* Main Form Columns */}
          <div style={{ display: 'grid', gap: '16px' }}>
            {/* Step 1: Your Details */}
            {step === 1 && (
              <div style={{ display: 'grid', gap: '16px' }}>
                <section className="checkout-card-section" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '16px', padding: '20px 22px' }}>
                  <h2 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: 600, letterSpacing: '-0.015em', color: '#0b1b26' }}>
                    {t('Thông tin người đặt phòng', 'Who is staying')}
                  </h2>
                  <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#566e7d' }}>
                    {t('Chúng tôi chỉ xin các thông tin cần thiết để phục vụ đón bến tàu.', 'We only ask for details needed to arrange your pier transfer.')}
                  </p>

                  <div className="checkout-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 500, color: '#0b1b26' }}>{t('Họ và tên *', 'Full name *')}</span>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        style={{ border: '1px solid #dbe7ef', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#0b1b26', background: '#ffffff', width: '100%' }}
                      />
                    </label>

                    <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 500, color: '#0b1b26' }}>{t('Số điện thoại *', 'Phone number *')}</span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0912 345 678"
                        style={{ border: '1px solid #dbe7ef', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#0b1b26', background: '#ffffff', width: '100%' }}
                      />
                    </label>

                    <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 500, color: '#0b1b26' }}>Email</span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        style={{ border: '1px solid #dbe7ef', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#0b1b26', background: '#ffffff', width: '100%' }}
                      />
                    </label>

                    <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 500, color: '#0b1b26' }}>{t('Số khách', 'Guests')}</span>
                      <input
                        type="number"
                        min={1}
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value) || 1)}
                        style={{ border: '1px solid #dbe7ef', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#0b1b26', background: '#ffffff', width: '100%' }}
                      />
                    </label>

                    <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 500, color: '#0b1b26' }}>{t('Ngày nhận phòng', 'Check in')}</span>
                      <input
                        type="date"
                        value={ci}
                        onChange={(e) => setCi(e.target.value)}
                        style={{ border: '1px solid #dbe7ef', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#0b1b26', background: '#ffffff', width: '100%' }}
                      />
                    </label>

                    <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 500, color: '#0b1b26' }}>{t('Ngày trả phòng', 'Check out')}</span>
                      <input
                        type="date"
                        value={co}
                        onChange={(e) => setCo(e.target.value)}
                        style={{ border: '1px solid #dbe7ef', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#0b1b26', background: '#ffffff', width: '100%' }}
                      />
                    </label>
                  </div>

                  <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '12px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 500, color: '#0b1b26' }}>{t('Yêu cầu đặc biệt', 'Anything we should know')}</span>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={t('Đến muộn, giường phụ, ăn chay, kỷ niệm...', 'Late arrival, extra bed, vegetarian, anniversary...')}
                      style={{ border: '1px solid #dbe7ef', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#0b1b26', background: '#ffffff', width: '100%', resize: 'vertical' }}
                    />
                  </label>
                </section>

                <section className="checkout-card-section" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '16px', padding: '20px 22px' }}>
                  <h2 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: 600, letterSpacing: '-0.015em', color: '#0b1b26' }}>
                    {t('Đưa đón bến tàu & Xe máy', 'Pier transfer & Scooter')}
                  </h2>
                  <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#566e7d' }}>
                    {t('Miễn phí xe đón bến tàu Củ Tron 2 chiều cho tất cả du khách.', 'Free pier transfer both ways for all guests.')}
                  </p>
                  <div className="checkout-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 500, color: '#0b1b26' }}>{t('Chuyến tàu đến', 'Arriving boat')}</span>
                      <select
                        value={boat}
                        onChange={(e) => setBoat(e.target.value)}
                        style={{ border: '1px solid #dbe7ef', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#0b1b26', background: '#ffffff', width: '100%', cursor: 'pointer' }}
                      >
                        <option value="">{t('Chưa biết — sẽ báo sau', 'Not sure — will notify later')}</option>
                        <option value="superdong">Superdong · 07:30 Rạch Giá</option>
                        <option value="phuquoc_express">Phú Quốc Express · 08:00 Rạch Giá</option>
                        <option value="ngoc_thanh">Ngọc Thành · 08:30 Rạch Giá</option>
                        <option value="hoa_binh">Hòa Bình Ship · 13:00 Rạch Giá</option>
                      </select>
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 500, color: '#0b1b26' }}>{t('Thuê xe máy', 'Scooter rental')}</span>
                      <select
                        value={bikes}
                        onChange={(e) => setBikes(Number(e.target.value) || 0)}
                        style={{ border: '1px solid #dbe7ef', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#0b1b26', background: '#ffffff', width: '100%', cursor: 'pointer' }}
                      >
                        <option value={0}>{t('Không cần', 'No thanks')}</option>
                        <option value={1}>{t('1 xe · 150.000₫/ngày', '1 scooter · 150,000 VND/day')}</option>
                        <option value={2}>{t('2 xe · 300.000₫/ngày', '2 scooters · 300,000 VND/day')}</option>
                      </select>
                    </label>
                  </div>
                </section>

                <button
                  className="checkout-step-action-btn"
                  onClick={() => {
                    setStep(2)
                    window.scrollTo(0, 0)
                  }}
                  style={{
                    width: '100%',
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    padding: '14px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'background 150ms ease',
                  }}
                >
                  {t('Tiếp tục thanh toán', 'Continue to payment')}
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div style={{ display: 'grid', gap: '16px' }}>
                <section className="checkout-card-section" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '16px', padding: '20px 22px' }}>
                  <h2 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: 600, letterSpacing: '-0.015em', color: '#0b1b26' }}>
                    {t('Giữ phòng bằng cọc 50%', 'Hold your room with a 50% deposit')}
                  </h2>
                  <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#566e7d' }}>
                    {t('Thời tiết biển có thể đổi kế hoạch. Tàu ngừng chạy thì cọc luôn được hoàn 100%.', 'Deposits are always 100% refunded when boats stop running.')}
                  </p>

                  <div style={{ display: 'grid', gap: '8px', marginBottom: '20px' }}>
                    {methodsList.map((m) => {
                      const on = method === m.k
                      return (
                        <button
                          key={m.k}
                          onClick={() => setMethod(m.k as 'qr' | 'momo' | 'cash')}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            width: '100%',
                            textAlign: 'left',
                            padding: '12px 14px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            transition: 'all 150ms ease',
                            background: on ? '#f2f8fc' : '#ffffff',
                            border: `1.5px solid ${on ? '#0284c7' : '#e6eef4'}`,
                          }}
                        >
                          <span
                            style={{
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              flexShrink: 0,
                              border: `4.5px solid ${on ? '#0284c7' : '#dbe7ef'}`,
                              background: '#ffffff',
                              boxSizing: 'border-box',
                            }}
                          />
                          <span style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                            <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0b1b26' }}>
                              {isEn ? m.titleEn : m.titleVi}
                            </span>
                            <span style={{ display: 'block', fontSize: '11px', color: '#566e7d', marginTop: '1px' }}>
                              {isEn ? m.subEn : m.subVi}
                            </span>
                          </span>
                          {m.tagVi && (
                            <span style={{ fontSize: '9.5px', fontWeight: 600, color: '#00a85c', whiteSpace: 'nowrap' }}>
                              {isEn ? m.tagEn : m.tagVi}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {method === 'qr' && (
                    <div
                      className="checkout-qr-box"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '160px minmax(0, 1fr)',
                        gap: '16px',
                        alignItems: 'center',
                        padding: '16px',
                        borderRadius: '12px',
                        background: '#f7fbfd',
                        border: '1px solid rgba(0,0,0,0.06)',
                      }}
                    >
                      <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #e6eef4', background: '#ffffff' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={qrSrc}
                          alt="VietQR"
                          style={{ width: '100%', height: '160px', objectFit: 'contain', display: 'block' }}
                        />
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#0b1b26', marginBottom: '8px' }}>
                          {t('Quét bằng app ngân hàng', 'Scan with any banking app')}
                        </div>
                        <div style={{ display: 'grid', gap: '6px', marginBottom: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', fontSize: '12px' }}>
                            <span style={{ color: '#566e7d' }}>{t('Tài khoản', 'Account')}</span>
                            <span style={{ color: '#0b1b26', fontWeight: 600 }}>THE NAM DU HILL</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', fontSize: '12px' }}>
                            <span style={{ color: '#566e7d' }}>{t('Số tài khoản', 'Number')}</span>
                            <span style={{ color: '#0b1b26', fontWeight: 600, fontFamily: 'monospace' }}>0985 000 650</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', fontSize: '12px' }}>
                            <span style={{ color: '#566e7d' }}>{t('Nội dung', 'Reference')}</span>
                            <span style={{ color: '#0284c7', fontWeight: 700, fontFamily: 'monospace' }}>{refCode}</span>
                          </div>
                        </div>
                        <div style={{ fontSize: '10.5px', lineHeight: 1.4, color: '#566e7d' }}>
                          {t('Giữ đúng nội dung chuyển khoản như trên để tự động xác nhận.', 'Keep exact transfer reference for auto verification.')}
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => {
                      setStep(1)
                      window.scrollTo(0, 0)
                    }}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #dbe7ef',
                      color: '#0b1b26',
                      fontSize: '13px',
                      fontWeight: 500,
                      padding: '12px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    {t('Quay lại', 'Back')}
                  </button>
                  <button
                    onClick={() => {
                      setStep(3)
                      window.scrollTo(0, 0)
                    }}
                    style={{
                      flex: 1,
                      background: '#00c46a',
                      color: '#04241a',
                      border: 'none',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      padding: '12px 24px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    {t('Tôi đã chuyển cọc', 'I have transferred the deposit')}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <section className="checkout-card-section" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '16px', padding: '24px 22px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: '#e8f9f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    color: '#00a85c',
                    marginBottom: '16px',
                  }}
                >
                  ✓
                </div>
                <h2
                  style={{
                    margin: '0 0 10px',
                    fontSize: '20px',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: '#0b1b26',
                    lineHeight: 1.25,
                  }}
                >
                  {t('Đã ghi nhận — Resort sẽ xác nhận trong 30 phút', 'Deposit received — Resort will confirm within 30 minutes')}
                </h2>
                <p style={{ margin: '0 0 20px', fontSize: '13px', lineHeight: 1.55, color: '#566e7d' }}>
                  {t(
                    'Lễ tân resort đang đối soát thủ công và sẽ nhắn Zalo cho bạn ngay khi tiền vào tài khoản.',
                    'Our receptionist is verifying your deposit and will text you on Zalo shortly.'
                  )}
                </p>

                <div
                  style={{
                    display: 'inline-block',
                    background: '#0b1b26',
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                  }}
                >
                  {refCode}
                </div>

                <div style={{ display: 'grid', gap: '8px' }}>
                  <a
                    href="https://zalo.me/0985000650"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textAlign: 'center',
                      background: '#0284c7',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 600,
                      padding: '12px 20px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                    }}
                  >
                    {t('Gửi ảnh chuyển khoản qua Zalo', 'Send receipt via Zalo')}
                  </a>
                  <Link
                    href="/explore"
                    style={{
                      textAlign: 'center',
                      border: '1px solid #dbe7ef',
                      color: '#0b1b26',
                      fontSize: '13px',
                      fontWeight: 500,
                      padding: '12px 20px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                    }}
                  >
                    {t('Khám phá Nam Du', 'Explore Nam Du')}
                  </Link>
                </div>
              </section>
            )}
          </div>

          {/* Sticky Summary Sidebar */}
          <aside className="checkout-summary-sidebar" style={{ position: 'sticky', top: '72px', display: 'grid', gap: '12px' }}>
            <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: '130px', background: '#eef4f8' }}>
                {room.images && room.images.length > 0 ? (
                  <img
                    src={room.images[0]}
                    alt={isEn ? room.nameEn : room.name}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <ImageSlot
                    id={`${roomSlug(room.code)}_g0`}
                    placeholder={`${room.code} — ${isEn ? room.nameEn : room.name}`}
                    style={{ position: 'absolute', inset: 0 }}
                  />
                )}
                <span
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: 'rgba(255,255,255,0.94)',
                    backdropFilter: 'blur(8px)',
                    color: '#0b1b26',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    padding: '4px 9px',
                    borderRadius: '999px',
                  }}
                >
                  {room.code}
                </span>
              </div>
              <div style={{ padding: '16px 18px 18px' }}>
                <h3 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 600, color: '#0b1b26', lineHeight: 1.25 }}>
                  {isEn ? room.nameEn : room.name}
                </h3>
                <div style={{ fontSize: '11.5px', color: '#566e7d', marginBottom: '12px' }}>
                  {room.area} m² · {room.cap} {t('khách', 'guests')}
                </div>

                <div style={{ display: 'grid', gap: '6px', padding: '12px 0', borderTop: '1px solid #eef4f8', borderBottom: '1px solid #eef4f8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', fontSize: '12px' }}>
                    <span style={{ color: '#566e7d' }}>{t('Nhận phòng', 'Check in')}</span>
                    <span style={{ color: '#0b1b26', fontWeight: 600 }}>{formatDate(ci)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', fontSize: '12px' }}>
                    <span style={{ color: '#566e7d' }}>{t('Trả phòng', 'Check out')}</span>
                    <span style={{ color: '#0b1b26', fontWeight: 600 }}>{formatDate(co)}</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '6px', padding: '12px 0 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', fontSize: '12px', color: '#566e7d' }}>
                    <span>{formatVND(room.price)} × {nights} {isEn ? 'night(s)' : 'đêm'}</span>
                    <span style={{ color: '#0b1b26', fontWeight: 600 }}>{formatVND(room.price * nights)}</span>
                  </div>
                  {bikes > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', fontSize: '12px', color: '#566e7d' }}>
                      <span>{bikes} {isEn ? 'scooter(s)' : 'xe máy'} × {nights} {isEn ? 'day(s)' : 'ngày'}</span>
                      <span style={{ color: '#0b1b26', fontWeight: 600 }}>{formatVND(bikes * BIKE_RATE * nights)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', fontSize: '12px', color: '#566e7d' }}>
                    <span>{t('Bữa sáng & đưa đón bến tàu', 'Breakfast & pier transfer')}</span>
                    <span style={{ color: '#00a85c', fontWeight: 600 }}>{t('Đã gồm', 'Included')}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', paddingTop: '10px', marginTop: '4px', borderTop: '1px solid #eef4f8', fontSize: '13.5px', fontWeight: 700, color: '#0b1b26' }}>
                    <span>{t('Tổng cộng', 'Total')}</span>
                    <span>{formatVND(totalAmount)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', paddingTop: '8px', marginTop: '4px', borderTop: '1px solid #eef4f8', fontSize: '13.5px', fontWeight: 700, color: '#0284c7' }}>
                    <span>{t('Cọc ngay (50%)', 'Deposit now (50%)')}</span>
                    <span>{formatVND(depositAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '14px', padding: '14px 16px', display: 'grid', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <span style={{ color: '#00c46a', fontSize: '12px', lineHeight: 1.4 }}>✓</span>
                <span style={{ fontSize: '11.5px', lineHeight: 1.4, color: '#566e7d' }}>{t('Huỷ miễn phí trước 7 ngày', 'Free cancellation up to 7 days before arrival')}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <span style={{ color: '#00c46a', fontSize: '12px', lineHeight: 1.4 }}>✓</span>
                <span style={{ fontSize: '11.5px', lineHeight: 1.4, color: '#566e7d' }}>{t('Hoàn 100% nếu tàu ngừng chạy do thời tiết', 'Full refund if boats stop for weather')}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <span style={{ color: '#00c46a', fontSize: '12px', lineHeight: 1.4 }}>✓</span>
                <span style={{ fontSize: '11.5px', lineHeight: 1.4, color: '#566e7d' }}>{t('Đã gồm bữa sáng và đưa đón bến tàu', 'Breakfast and pier transfer included')}</span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="checkout-footer" style={{ maxWidth: '1240px', margin: '40px auto 0', padding: '20px 24px 36px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '11.5px', color: '#8fa5b3' }}>© 2026 The Nam Du Hill · Ấp Củ Tron, Đặc Khu Kiên Hải, tỉnh An Giang</span>
        <span style={{ fontSize: '11.5px', color: '#8fa5b3' }}>Hotline <a href="tel:0985000650" style={{ fontWeight: 600, color: '#0b1b26', textDecoration: 'none' }}>0985 000 650</a></span>
      </footer>

      {/* Global Responsive Styles for Mobile Checkout */}
      <style jsx global>{`
        @media (max-width: 640px) {
          .checkout-header-inner {
            padding: 8px 12px !important;
            gap: 8px !important;
          }
          .checkout-step-nav {
            gap: 4px !important;
          }
          .step-label {
            display: none !important;
          }
          .step-divider {
            width: 10px !important;
          }
          .checkout-help-link {
            display: none !important;
          }
          .checkout-main-container {
            padding: 72px 12px 48px !important;
          }
          .checkout-grid-layout {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .checkout-form-grid {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
          .checkout-card-section {
            padding: 14px 14px !important;
            border-radius: 12px !important;
          }
          .checkout-step-action-btn {
            display: none !important;
          }
          .checkout-qr-box {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
            text-align: center;
          }
          .checkout-summary-sidebar {
            position: static !important;
            order: -1; /* Place room summary at the top on mobile if needed, or normal flow */
          }
          .checkout-footer {
            padding: 16px 12px 64px !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 6px !important;
          }
        }
      `}</style>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px 20px', textAlign: 'center', fontSize: '13px', color: '#566e7d' }}>Đang tải màn hình đặt phòng...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
