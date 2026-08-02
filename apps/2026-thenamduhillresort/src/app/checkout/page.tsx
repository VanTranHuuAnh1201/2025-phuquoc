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
      {/* Checkout Header / Step Indicator */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(18px)',
          background: 'rgba(255,255,255,0.94)',
          borderBottom: '1px solid rgba(2,132,199,0.10)',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '13px 32px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, textDecoration: 'none' }}>
            <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontSize: '14.5px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0b1b26' }}>
                THE NAM DU HILL
              </span>
              <span style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.15em', color: '#0284c7' }}>
                HILLTOP BOUTIQUE RESORT
              </span>
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 auto', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <span
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: step > 1 ? '#00c46a' : step === 1 ? '#0284c7' : '#e6eef4',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {step > 1 ? '✓' : '1'}
              </span>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: step === 1 ? 700 : 600,
                  color: step === 1 ? '#0b1b26' : step > 1 ? '#00a85c' : '#8fa5b3',
                  whiteSpace: 'nowrap',
                }}
              >
                {t('Thông tin', 'Your details')}
              </span>
            </div>

            <span style={{ width: '30px', height: '1px', background: '#dbe7ef' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <span
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: step > 2 ? '#00c46a' : step === 2 ? '#0284c7' : '#e6eef4',
                  color: step >= 2 ? '#ffffff' : '#8fa5b3',
                  fontSize: '12px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {step > 2 ? '✓' : '2'}
              </span>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: step === 2 ? 700 : 600,
                  color: step === 2 ? '#0b1b26' : step > 2 ? '#00a85c' : '#8fa5b3',
                  whiteSpace: 'nowrap',
                }}
              >
                {t('Thanh toán', 'Payment')}
              </span>
            </div>

            <span style={{ width: '30px', height: '1px', background: '#dbe7ef' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <span
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: step === 3 ? '#0284c7' : '#e6eef4',
                  color: step === 3 ? '#ffffff' : '#8fa5b3',
                  fontSize: '12px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                3
              </span>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: step === 3 ? 700 : 600,
                  color: step === 3 ? '#0b1b26' : '#8fa5b3',
                  whiteSpace: 'nowrap',
                }}
              >
                {t('Xác nhận', 'Confirmed')}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <a
              href="tel:0985000650"
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#0284c7',
                whiteSpace: 'nowrap',
                textDecoration: 'none',
              }}
            >
              {t('Cần hỗ trợ? 0985 000 650', 'Need help? 0985 000 650')}
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '36px 32px 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.55fr) minmax(0, 1fr)', gap: '26px', alignItems: 'start' }}>
          
          {/* Main Form Columns */}
          <div style={{ display: 'grid', gap: '16px' }}>
            {/* Step 1: Your Details */}
            {step === 1 && (
              <div style={{ display: 'grid', gap: '16px' }}>
                <section style={{ background: '#ffffff', border: '1px solid #e6eef4', borderRadius: '24px', padding: '28px 30px' }}>
                  <h2 style={{ margin: '0 0 4px', fontSize: '21px', fontWeight: 800, letterSpacing: '-0.024em', color: '#0b1b26' }}>
                    {t('Ai sẽ đến ở', 'Who is staying')}
                  </h2>
                  <p style={{ margin: '0 0 22px', fontSize: '13.5px', color: '#8fa5b3' }}>
                    {t('Chúng tôi chỉ hỏi những gì lễ tân thật sự cần.', 'We only ask for what the front desk actually needs.')}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px' }}>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#3d5462' }}>{t('Họ và tên *', 'Full name *')}</span>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        style={{ border: '1px solid #dbe7ef', borderRadius: '13px', padding: '14px 16px', fontSize: '15px', fontWeight: 500, color: '#0b1b26', background: '#ffffff', width: '100%' }}
                      />
                    </label>

                    <label style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#3d5462' }}>{t('Số điện thoại *', 'Phone number *')}</span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0912 345 678"
                        style={{ border: '1px solid #dbe7ef', borderRadius: '13px', padding: '14px 16px', fontSize: '15px', fontWeight: 500, color: '#0b1b26', background: '#ffffff', width: '100%' }}
                      />
                    </label>

                    <label style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#3d5462' }}>Email</span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        style={{ border: '1px solid #dbe7ef', borderRadius: '13px', padding: '14px 16px', fontSize: '15px', fontWeight: 500, color: '#0b1b26', background: '#ffffff', width: '100%' }}
                      />
                    </label>

                    <label style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#3d5462' }}>{t('Số khách', 'Guests')}</span>
                      <input
                        type="number"
                        min={1}
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value) || 1)}
                        style={{ border: '1px solid #dbe7ef', borderRadius: '13px', padding: '14px 16px', fontSize: '15px', fontWeight: 500, color: '#0b1b26', background: '#ffffff', width: '100%' }}
                      />
                    </label>

                    <label style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#3d5462' }}>{t('Ngày nhận phòng', 'Check in')}</span>
                      <input
                        type="date"
                        value={ci}
                        onChange={(e) => setCi(e.target.value)}
                        style={{ border: '1px solid #dbe7ef', borderRadius: '13px', padding: '14px 16px', fontSize: '15px', fontWeight: 500, color: '#0b1b26', background: '#ffffff', width: '100%' }}
                      />
                    </label>

                    <label style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#3d5462' }}>{t('Ngày trả phòng', 'Check out')}</span>
                      <input
                        type="date"
                        value={co}
                        onChange={(e) => setCo(e.target.value)}
                        style={{ border: '1px solid #dbe7ef', borderRadius: '13px', padding: '14px 16px', fontSize: '15px', fontWeight: 500, color: '#0b1b26', background: '#ffffff', width: '100%' }}
                      />
                    </label>
                  </div>

                  <label style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginTop: '14px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#3d5462' }}>{t('Yêu cầu đặc biệt', 'Anything we should know')}</span>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={t('Đến muộn, giường phụ, ăn chay, kỷ niệm...', 'Late arrival, extra bed, vegetarian, anniversary...')}
                      style={{ border: '1px solid #dbe7ef', borderRadius: '13px', padding: '14px 16px', fontSize: '15px', fontWeight: 500, color: '#0b1b26', background: '#ffffff', width: '100%', resize: 'vertical' }}
                    />
                  </label>
                </section>

                <section style={{ background: '#ffffff', border: '1px solid #e6eef4', borderRadius: '24px', padding: '28px 30px' }}>
                  <h2 style={{ margin: '0 0 4px', fontSize: '21px', fontWeight: 800, letterSpacing: '-0.024em', color: '#0b1b26' }}>
                    {t('Đưa đón bến tàu', 'Pier transfer')}
                  </h2>
                  <p style={{ margin: '0 0 20px', fontSize: '13.5px', color: '#8fa5b3' }}>
                    {t('Miễn phí hai chiều. Cho chúng tôi biết chuyến tàu, xe sẽ đợi sẵn ở bến Củ Tron.', 'Free both ways. Tell us the boat and we will be standing at Cu Tron pier.')}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px' }}>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#3d5462' }}>{t('Chuyến tàu đến', 'Arriving boat')}</span>
                      <select
                        value={boat}
                        onChange={(e) => setBoat(e.target.value)}
                        style={{ border: '1px solid #dbe7ef', borderRadius: '13px', padding: '14px 16px', fontSize: '15px', fontWeight: 500, color: '#0b1b26', background: '#ffffff', width: '100%', cursor: 'pointer' }}
                      >
                        <option value="">{t('Chưa biết — sẽ báo sau', 'Not sure — will notify later')}</option>
                        <option value="superdong">Superdong · 07:30 Rạch Giá</option>
                        <option value="phuquoc_express">Phú Quốc Express · 08:00 Rạch Giá</option>
                        <option value="ngoc_thanh">Ngọc Thành · 08:30 Rạch Giá</option>
                        <option value="hoa_binh">Hòa Bình Ship · 13:00 Rạch Giá</option>
                      </select>
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#3d5462' }}>{t('Thuê xe máy', 'Scooter rental')}</span>
                      <select
                        value={bikes}
                        onChange={(e) => setBikes(Number(e.target.value) || 0)}
                        style={{ border: '1px solid #dbe7ef', borderRadius: '13px', padding: '14px 16px', fontSize: '15px', fontWeight: 500, color: '#0b1b26', background: '#ffffff', width: '100%', cursor: 'pointer' }}
                      >
                        <option value={0}>{t('Không cần', 'No thanks')}</option>
                        <option value={1}>{t('1 xe · 150.000₫/ngày', '1 scooter · 150,000 VND/day')}</option>
                        <option value={2}>{t('2 xe · 300.000₫/ngày', '2 scooters · 300,000 VND/day')}</option>
                      </select>
                    </label>
                  </div>
                </section>

                <button
                  onClick={() => {
                    setStep(2)
                    window.scrollTo(0, 0)
                  }}
                  style={{
                    justifySelf: 'start',
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '15px',
                    fontWeight: 700,
                    padding: '17px 34px',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    boxShadow: '0 8px 22px rgba(2,132,199,0.30)',
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
                <section style={{ background: '#ffffff', border: '1px solid #e6eef4', borderRadius: '24px', padding: '28px 30px' }}>
                  <h2 style={{ margin: '0 0 4px', fontSize: '21px', fontWeight: 800, letterSpacing: '-0.024em', color: '#0b1b26' }}>
                    {t('Giữ phòng bằng cọc 50%', 'Hold your room with a 50% deposit')}
                  </h2>
                  <p style={{ margin: '0 0 22px', fontSize: '13.5px', color: '#8fa5b3' }}>
                    {t('Thời tiết biển có thể đổi kế hoạch. Tàu ngừng chạy thì cọc luôn được hoàn.', 'Sea weather can change plans. Deposits are always refunded when the boats stop running.')}
                  </p>

                  <div style={{ display: 'grid', gap: '10px', marginBottom: '24px' }}>
                    {methodsList.map((m) => {
                      const on = method === m.k
                      return (
                        <button
                          key={m.k}
                          onClick={() => setMethod(m.k as 'qr' | 'momo' | 'cash')}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            width: '100%',
                            textAlign: 'left',
                            padding: '18px 20px',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            transition: 'all 150ms ease',
                            background: on ? '#f2f8fc' : '#ffffff',
                            border: `1.5px solid ${on ? '#0284c7' : '#e6eef4'}`,
                          }}
                        >
                          <span
                            style={{
                              width: '19px',
                              height: '19px',
                              borderRadius: '50%',
                              flexShrink: 0,
                              border: `5.5px solid ${on ? '#0284c7' : '#dbe7ef'}`,
                              background: '#ffffff',
                              boxSizing: 'border-box',
                            }}
                          />
                          <span style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                            <span style={{ display: 'block', fontSize: '15px', fontWeight: 700, color: '#0b1b26' }}>
                              {isEn ? m.titleEn : m.titleVi}
                            </span>
                            <span style={{ display: 'block', fontSize: '12.5px', color: '#8fa5b3', marginTop: '3px' }}>
                              {isEn ? m.subEn : m.subVi}
                            </span>
                          </span>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: '#00a85c', whiteSpace: 'nowrap' }}>
                            {isEn ? m.tagEn : m.tagVi}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  {method === 'qr' && (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '188px minmax(0, 1fr)',
                        gap: '26px',
                        alignItems: 'center',
                        padding: '24px',
                        borderRadius: '20px',
                        background: '#f7fbfd',
                        border: '1px solid #e6eef4',
                      }}
                    >
                      <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #e6eef4', background: '#ffffff' }}>
                        {/* QR Code image */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={qrSrc}
                          alt="VietQR"
                          style={{ width: '100%', height: '188px', objectFit: 'contain', display: 'block' }}
                        />
                      </div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#0b1b26', marginBottom: '12px' }}>
                          {t('Quét bằng bất kỳ app ngân hàng nào', 'Scan with any Vietnamese banking app')}
                        </div>
                        <div style={{ display: 'grid', gap: '9px', marginBottom: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', fontSize: '13.5px' }}>
                            <span style={{ color: '#8fa5b3', fontWeight: 600 }}>{t('Tài khoản', 'Account')}</span>
                            <span style={{ color: '#0b1b26', fontWeight: 700 }}>THE NAM DU HILL</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', fontSize: '13.5px' }}>
                            <span style={{ color: '#8fa5b3', fontWeight: 600 }}>{t('Số tài khoản', 'Number')}</span>
                            <span style={{ color: '#0b1b26', fontWeight: 700, fontFamily: 'ui-monospace, monospace' }}>0985 000 650</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', fontSize: '13.5px' }}>
                            <span style={{ color: '#8fa5b3', fontWeight: 600 }}>{t('Nội dung', 'Reference')}</span>
                            <span style={{ color: '#0284c7', fontWeight: 800, fontFamily: 'ui-monospace, monospace' }}>{refCode}</span>
                          </div>
                        </div>
                        <div style={{ fontSize: '12px', lineHeight: 1.55, color: '#8fa5b3' }}>
                          {t('Giữ đúng nội dung chuyển khoản như trên — đó là cách chúng tôi khớp tiền với đơn của bạn.', 'Keep the reference exactly as shown — it is how we match your transfer to this booking.')}
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      setStep(1)
                      window.scrollTo(0, 0)
                    }}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #dbe7ef',
                      color: '#0b1b26',
                      fontSize: '15px',
                      fontWeight: 700,
                      padding: '17px 28px',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      transition: 'background 150ms ease',
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
                      background: '#00c46a',
                      color: '#04241a',
                      border: 'none',
                      fontSize: '15px',
                      fontWeight: 800,
                      padding: '17px 34px',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      boxShadow: '0 8px 22px rgba(0,196,106,0.30)',
                      transition: 'background 150ms ease',
                    }}
                  >
                    {t('Tôi đã chuyển cọc', 'I have transferred the deposit')}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <section style={{ background: '#ffffff', border: '1px solid #e6eef4', borderRadius: '24px', padding: '44px 40px' }}>
                <div
                  style={{
                    width: '62px',
                    height: '62px',
                    borderRadius: '50%',
                    background: '#e8f9f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '27px',
                    color: '#00a85c',
                    marginBottom: '22px',
                  }}
                >
                  ✓
                </div>
                <h2
                  style={{
                    margin: '0 0 12px',
                    fontSize: '27px',
                    fontWeight: 800,
                    letterSpacing: '-0.028em',
                    color: '#0b1b26',
                    lineHeight: 1.16,
                    maxWidth: '22ch',
                  }}
                >
                  {t('Đã ghi nhận — chúng tôi xác nhận trong 30 phút', 'Deposit received — we will confirm within 30 minutes')}
                </h2>
                <p style={{ margin: '0 0 26px', fontSize: '15.5px', lineHeight: 1.6, color: '#566e7d', maxWidth: '56ch' }}>
                  {t(
                    'Có người ở resort kiểm tra chuyển khoản thủ công, nên bạn sẽ nhận tin nhắn Zalo từ người thật, không phải email tự động.',
                    'Someone at the resort checks transfers by hand, so you will get a Zalo message from a real person, not an automated email.'
                  )}
                </p>

                <div
                  style={{
                    display: 'inline-block',
                    background: '#0b1b26',
                    color: '#ffffff',
                    fontSize: '17px',
                    fontWeight: 800,
                    fontFamily: 'ui-monospace, monospace',
                    padding: '15px 24px',
                    borderRadius: '14px',
                    marginBottom: '26px',
                  }}
                >
                  {refCode}
                </div>

                <div style={{ display: 'grid', gap: '10px', maxWidth: '460px' }}>
                  <a
                    href="https://zalo.me/0985000650"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textAlign: 'center',
                      background: '#0284c7',
                      color: '#ffffff',
                      fontSize: '15px',
                      fontWeight: 700,
                      padding: '16px 24px',
                      borderRadius: '14px',
                      textDecoration: 'none',
                    }}
                  >
                    {t('Gửi ảnh chuyển khoản qua Zalo', 'Send the receipt on Zalo')}
                  </a>
                  <Link
                    href="/explore"
                    style={{
                      textAlign: 'center',
                      border: '1px solid #dbe7ef',
                      color: '#0b1b26',
                      fontSize: '15px',
                      fontWeight: 700,
                      padding: '16px 24px',
                      borderRadius: '14px',
                      textDecoration: 'none',
                    }}
                  >
                    {t('Lên kế hoạch chơi gì ngoài đảo', 'Plan what to do on the island')}
                  </Link>
                </div>
              </section>
            )}
          </div>

          {/* Sticky Summary Sidebar */}
          <aside style={{ position: 'sticky', top: '92px', display: 'grid', gap: '14px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e6eef4', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 14px 40px rgba(6,40,58,0.08)' }}>
              <div style={{ position: 'relative', height: '152px', background: '#eef4f8' }}>
                <ImageSlot
                  id={`${roomSlug(room.code)}_g0`}
                  placeholder={`${room.code} — ${isEn ? room.nameEn : room.name}`}
                  style={{ position: 'absolute', inset: 0 }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                    background: 'rgba(255,255,255,0.94)',
                    backdropFilter: 'blur(8px)',
                    color: '#0b1b26',
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    padding: '6px 11px',
                    borderRadius: '999px',
                  }}
                >
                  {room.code}
                </span>
              </div>
              <div style={{ padding: '20px 22px 22px' }}>
                <h3 style={{ margin: '0 0 6px', fontSize: '17px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0b1b26', lineHeight: 1.26 }}>
                  {isEn ? room.nameEn : room.name}
                </h3>
                <div style={{ fontSize: '13px', color: '#8fa5b3', marginBottom: '16px' }}>
                  {room.area} m² · {room.cap} {t('khách', 'guests')}
                </div>

                <div style={{ display: 'grid', gap: '9px', padding: '16px 0', borderTop: '1px solid #eef4f8', borderBottom: '1px solid #eef4f8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '13.5px' }}>
                    <span style={{ color: '#8fa5b3', fontWeight: 600 }}>{t('Nhận phòng', 'Check in')}</span>
                    <span style={{ color: '#0b1b26', fontWeight: 700 }}>{formatDate(ci)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '13.5px' }}>
                    <span style={{ color: '#8fa5b3', fontWeight: 600 }}>{t('Trả phòng', 'Check out')}</span>
                    <span style={{ color: '#0b1b26', fontWeight: 700 }}>{formatDate(co)}</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '7px', padding: '16px 0 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', fontSize: '13.5px', fontWeight: 600, color: '#566e7d' }}>
                    <span>{formatVND(room.price)} × {nights} {isEn ? 'night(s)' : 'đêm'}</span>
                    <span style={{ color: '#0b1b26', fontWeight: 700 }}>{formatVND(room.price * nights)}</span>
                  </div>
                  {bikes > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', fontSize: '13.5px', fontWeight: 600, color: '#566e7d' }}>
                      <span>{bikes} {isEn ? 'scooter(s)' : 'xe máy'} × {nights} {isEn ? 'day(s)' : 'ngày'}</span>
                      <span style={{ color: '#0b1b26', fontWeight: 700 }}>{formatVND(bikes * BIKE_RATE * nights)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', fontSize: '13.5px', fontWeight: 600, color: '#566e7d' }}>
                    <span>{t('Bữa sáng & đưa đón bến tàu', 'Breakfast & pier transfer')}</span>
                    <span style={{ color: '#00a85c', fontWeight: 700 }}>{t('Đã gồm', 'Included')}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', paddingTop: '13px', marginTop: '6px', borderTop: '1px solid #eef4f8', fontSize: '15px', fontWeight: 800, color: '#0b1b26' }}>
                    <span>{t('Tổng cộng', 'Total')}</span>
                    <span style={{ color: '#0b1b26', fontWeight: 800 }}>{formatVND(totalAmount)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', paddingTop: '13px', marginTop: '6px', borderTop: '1px solid #eef4f8', fontSize: '15px', fontWeight: 800, color: '#0284c7' }}>
                    <span>{t('Cọc ngay (50%)', 'Deposit now (50%)')}</span>
                    <span style={{ color: '#0284c7', fontWeight: 800 }}>{formatVND(depositAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e6eef4', borderRadius: '20px', padding: '20px 22px', display: 'grid', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: '#00c46a', fontSize: '13px', lineHeight: 1.4 }}>✓</span>
                <span style={{ fontSize: '13px', lineHeight: 1.5, color: '#3d5462' }}>{t('Huỷ miễn phí trước 7 ngày', 'Free cancellation up to 7 days before arrival')}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: '#00c46a', fontSize: '13px', lineHeight: 1.4 }}>✓</span>
                <span style={{ fontSize: '13px', lineHeight: 1.5, color: '#3d5462' }}>{t('Hoàn 100% nếu tàu ngừng chạy do thời tiết', 'Full refund if the boats stop for weather')}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: '#00c46a', fontSize: '13px', lineHeight: 1.4 }}>✓</span>
                <span style={{ fontSize: '13px', lineHeight: 1.5, color: '#3d5462' }}>{t('Đã gồm bữa sáng và đưa đón bến tàu', 'Breakfast and pier transfer already included')}</span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer style={{ maxWidth: '1240px', margin: '56px auto 0', padding: '26px 32px 48px', borderTop: '1px solid #e6eef4', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12.5px', color: '#8fa5b3' }}>© 2026 The Nam Du Hill · Ấp Củ Tron, Đặc Khu Kiên Hải, tỉnh An Giang</span>
        <span style={{ fontSize: '12.5px', color: '#8fa5b3' }}>MST 1702244746 · <a href="tel:0985000650" style={{ fontWeight: 700, color: '#0b1b26', textDecoration: 'none' }}>0985 000 650</a></span>
      </footer>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ padding: '100px 32px', textAlign: 'center' }}>Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
