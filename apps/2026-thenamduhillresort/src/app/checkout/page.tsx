'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'
import { ROOMS, formatVND, roomSlug, Room } from '../../data/rooms'
import { Button } from '../../components/common/Button'
import { ArrowLeft, Calendar, Users, CheckCircle, Copy, ChevronRight, ShieldCheck, CreditCard, MessageCircle, Phone } from 'lucide-react'

const BIKE_RATE = 150000

function CheckoutContent() {
  const { t, language } = useLanguage()
  const isEn = language === 'en'
  const searchParams = useSearchParams()
  const router = useRouter()

  const [step, setStep] = useState<1 | 2 | 3>(1)
  
  // Auto-filled default values matching design mockups (15 Aug - 17 Aug, 2 Guests)
  const [ci, setCi] = useState('2025-08-15')
  const [co, setCo] = useState('2025-08-17')
  const [guests, setGuests] = useState(2)
  const [bikes, setBikes] = useState(0)
  const [method, setMethod] = useState<'qr' | 'momo' | 'cash'>('qr')
  const [name, setName] = useState('Nguyễn Văn A')
  const [phone, setPhone] = useState('0901234567')
  const [email, setEmail] = useState('nguyenvana@gmail.com')
  const [notes, setNotes] = useState('')
  const [boat, setBoat] = useState('')
  const [room, setRoom] = useState<Room>(ROOMS[0]!) // Default Deluxe Sea View

  // Handle URL query parameters or stored selections
  useEffect(() => {
    const rCode = searchParams.get('room')
    if (rCode) {
      const searchId = decodeURIComponent(rCode).toLowerCase().replace('#', '')
      const found = ROOMS.find((r) => {
        const cleanCode = r.code.replace('#', '').toLowerCase()
        return cleanCode === searchId || r.code.toLowerCase() === searchId || roomSlug(r.code).toLowerCase() === searchId
      })
      if (found) {
        setRoom(found)
        return
      }
    }
    try {
      const saved = localStorage.getItem('ndh:last-room')
      if (saved) {
        const searchId = saved.toLowerCase().replace('#', '')
        const found = ROOMS.find((r) => r.code.toLowerCase().replace('#', '') === searchId)
        if (found) setRoom(found)
      }
    } catch {}
  }, [searchParams])

  const calculateNights = () => {
    if (!ci || !co) return 2
    const d = (new Date(co).getTime() - new Date(ci).getTime()) / (1000 * 3600 * 24)
    return d > 0 ? Math.round(d) : 2
  }

  const nights = calculateNights()
  const totalAmount = room.price * nights + bikes * BIKE_RATE * nights
  const depositAmount = Math.round(totalAmount / 2)
  const bookingCode = '#NDH123456'

  const phoneLast4 = phone.replace(/\D/g, '').slice(-4)
  const refCode = `NAMDU ${room.code.replace('#', '')} ${nights}D${phoneLast4 ? ' ' + phoneLast4 : ''}`

  const qrSrc = `https://img.vietqr.io/image/970436-0985000650-compact.png?amount=${depositAmount}&addInfo=${encodeURIComponent(refCode)}&accountName=${encodeURIComponent('THE NAM DU HILL')}`

  const formatDateLabel = (ciStr: string, coStr: string) => {
    if (!ciStr || !coStr) return '15 Th8 - 17 Th8 (2 đêm)'
    const ciD = new Date(ciStr)
    const coD = new Date(coStr)
    const d1 = ciD.getDate()
    const m1 = ciD.getMonth() + 1
    const d2 = coD.getDate()
    const m2 = coD.getMonth() + 1
    return `${d1} Th${m1} - ${d2} Th${m2} (${nights} đêm)`
  }

  // Handle saving booking to localStorage for "Đơn đặt của tôi"
  const handleCompleteBooking = () => {
    try {
      const newBooking = {
        id: bookingCode,
        roomName: room.name,
        roomCode: room.code,
        roomImage: room.images && room.images.length > 0 ? room.images[0] : 'https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/cover6.jpg',
        dates: formatDateLabel(ci, co),
        guests: `${guests} người lớn, 1 phòng`,
        contactName: name,
        contactPhone: phone,
        contactEmail: email,
        notes: notes || 'Không có',
        totalPrice: totalAmount,
        depositPrice: depositAmount,
        status: 'Sắp tới',
        createdAt: new Date().toLocaleDateString('vi-VN'),
        paymentMethod: method === 'qr' ? 'Thanh toán chuyển khoản' : method === 'momo' ? 'Ví MoMo' : 'Thanh toán khi nhận phòng',
      }
      const existing = JSON.parse(localStorage.getItem('ndh:my-bookings') || '[]')
      localStorage.setItem('ndh:my-bookings', JSON.stringify([newBooking, ...existing]))
    } catch (e) {
      console.error(e)
    }
    setStep(3)
    window.scrollTo(0, 0)
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] pt-14 pb-28">
      {/* Step Progress Header */}
      <div className="bg-white border-b border-[#ECECEC] sticky top-12 z-30 px-4 py-3">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <button
            onClick={() => {
              if (step > 1) setStep((prev) => (prev - 1) as 1 | 2 | 3)
              else router.back()
            }}
            className="flex items-center gap-1.5 text-xs text-[#4B5563] hover:text-[#0F2D52] transition font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('Quay lại', 'Back')}</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#0F2D52]">
            <span className={step === 1 ? 'text-[#1D4E89]' : 'text-[#6B7280]'}>
              1. {t('Thông tin', 'Details')}
            </span>
            <span className="text-[#D1D5DB]">•</span>
            <span className={step === 2 ? 'text-[#1D4E89]' : 'text-[#6B7280]'}>
              2. {t('Thanh toán', 'Payment')}
            </span>
            <span className="text-[#D1D5DB]">•</span>
            <span className={step === 3 ? 'text-[#1D4E89]' : 'text-[#6B7280]'}>
              3. {t('Hoàn tất', 'Complete')}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 pt-4 space-y-4">

        {/* STEP 1: Fast-Checkout Form (Screen 6) */}
        {step === 1 && (
          <div className="space-y-4">
            
            {/* 1. Room Summary Card */}
            <div className="bg-white border border-[#ECECEC] rounded-[12px] p-4 space-y-3 shadow-xs">
              <h2 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                {t('Thông tin đặt phòng', 'Booking Details')}
              </h2>

              <div className="flex items-center gap-3">
                <div className="w-20 h-16 rounded-[8px] overflow-hidden bg-[#F5F7FA] shrink-0">
                  <img
                    src={room.images && room.images.length > 0 ? room.images[0] : 'https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/cover6.jpg'}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <h3 className="font-serif text-sm sm:text-base font-bold text-[#0F2D52] truncate">
                    {isEn ? room.nameEn : room.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#4B5563]">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#1D4E89]" />
                      <span>{formatDateLabel(ci, co)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#1D4E89]" />
                      <span>{guests} {t('người lớn', 'adults')}, 1 {t('phòng', 'room')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Guest Contact Info Form */}
            <div className="bg-white border border-[#ECECEC] rounded-[12px] p-4 space-y-4 shadow-xs">
              <div className="border-b border-[#ECECEC] pb-2">
                <h2 className="font-serif text-base font-bold text-[#0F2D52]">
                  {t('Thông tin liên hệ', 'Contact Information')}
                </h2>
                <p className="text-xs text-[#6B7280]">
                  {t('Chúng tôi sử dụng thông tin này để đón quý khách tại bến tàu Nam Du.', 'We use this to arrange your pier transfer in Nam Du.')}
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="block font-semibold text-[#1A1A1A]">
                    {t('Họ và tên *', 'Full Name *')}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full border border-[#D1D5DB] rounded-[6px] px-3 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1D4E89]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-[#1A1A1A]">
                    {t('Số điện thoại *', 'Phone Number *')}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0901234567"
                    className="w-full border border-[#D1D5DB] rounded-[6px] px-3 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1D4E89]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-[#1A1A1A]">
                    {t('Email *', 'Email *')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nguyenvana@gmail.com"
                    className="w-full border border-[#D1D5DB] rounded-[6px] px-3 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1D4E89]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-[#1A1A1A]">
                    {t('Yêu cầu đặc biệt (tùy chọn)', 'Special Requests (optional)')}
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t('Nhập yêu cầu của bạn...', 'Enter special requests...')}
                    className="w-full border border-[#D1D5DB] rounded-[6px] px-3 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1D4E89] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Additional Services (Pier & Scooter) */}
            <div className="bg-white border border-[#ECECEC] rounded-[12px] p-4 space-y-3 shadow-xs">
              <h2 className="font-serif text-sm font-bold text-[#0F2D52]">
                {t('Đưa đón bến tàu & Xe máy', 'Pier Transfer & Scooter')}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="block font-semibold text-[#1A1A1A]">
                    {t('Chuyến tàu đến', 'Arriving Boat')}
                  </label>
                  <select
                    value={boat}
                    onChange={(e) => setBoat(e.target.value)}
                    className="w-full border border-[#D1D5DB] rounded-[6px] px-3 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1D4E89]"
                  >
                    <option value="">{t('Chưa xác định — báo sau', 'Not sure — notify later')}</option>
                    <option value="superdong">Superdong · 07:30 Rạch Giá</option>
                    <option value="phuquoc_express">Phú Quốc Express · 08:00 Rạch Giá</option>
                    <option value="ngoc_thanh">Ngọc Thành · 08:30 Rạch Giá</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-[#1A1A1A]">
                    {t('Thuê xe máy', 'Scooter Rental')}
                  </label>
                  <select
                    value={bikes}
                    onChange={(e) => setBikes(Number(e.target.value) || 0)}
                    className="w-full border border-[#D1D5DB] rounded-[6px] px-3 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1D4E89]"
                  >
                    <option value={0}>{t('Không thuê', 'No scooter')}</option>
                    <option value={1}>{t('1 xe · 150.000đ/ngày', '1 scooter · 150,000 VND/day')}</option>
                    <option value={2}>{t('2 xe · 300.000đ/ngày', '2 scooters · 300,000 VND/day')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Price Summary Breakdown */}
            <div className="bg-white border border-[#ECECEC] rounded-[12px] p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#4B5563]">
                <span>{formatVND(room.price)} × {nights} {t('đêm', 'nights')}</span>
                <span className="font-semibold text-[#1A1A1A]">{formatVND(room.price * nights)}</span>
              </div>
              {bikes > 0 && (
                <div className="flex items-center justify-between text-[#4B5563]">
                  <span>{bikes} {t('xe máy', 'scooters')} × {nights} {t('ngày', 'days')}</span>
                  <span className="font-semibold text-[#1A1A1A]">{formatVND(bikes * BIKE_RATE * nights)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-emerald-700 font-medium pt-1">
                <span>{t('Đưa đón bến tàu & Bữa sáng', 'Pier Transfer & Breakfast')}</span>
                <span>{t('Miễn phí', 'Free')}</span>
              </div>
              <div className="border-t border-[#ECECEC] pt-2 flex items-center justify-between text-sm font-bold text-[#0F2D52]">
                <span>{t('Tổng cộng', 'Total Amount')}</span>
                <span className="text-base text-[#1D4E89]">{formatVND(totalAmount)}</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Confirm & Payment Methods (Screen 7 & 8) */}
        {step === 2 && (
          <div className="space-y-4">
            
            {/* 1. Confirmation Summary Block */}
            <div className="bg-white border border-[#ECECEC] rounded-[12px] p-4 space-y-3 shadow-xs">
              <h2 className="font-serif text-base font-bold text-[#0F2D52]">
                {t('Xác nhận đặt phòng', 'Confirm Booking Details')}
              </h2>

              <div className="flex gap-3 pb-3 border-b border-[#ECECEC]">
                <div className="w-16 h-14 rounded-[6px] overflow-hidden bg-[#F5F7FA] shrink-0">
                  <img
                    src={room.images && room.images.length > 0 ? room.images[0] : 'https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/cover6.jpg'}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs space-y-1">
                  <h3 className="font-bold text-[#0F2D52]">{isEn ? room.nameEn : room.name}</h3>
                  <p className="text-[#4B5563]">{formatDateLabel(ci, co)}</p>
                  <p className="text-[#4B5563]">{guests} {t('người lớn', 'adults')}, 1 {t('phòng', 'room')}</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-[#4B5563]">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">{t('Họ và tên:', 'Guest Name:')}</span>
                  <span className="font-semibold text-[#1A1A1A]">{name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">{t('Số điện thoại:', 'Phone:')}</span>
                  <span className="font-semibold text-[#1A1A1A]">{phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">{t('Email:', 'Email:')}</span>
                  <span className="font-semibold text-[#1A1A1A]">{email}</span>
                </div>
              </div>
            </div>

            {/* 2. Payment Method Selector */}
            <div className="bg-white border border-[#ECECEC] rounded-[12px] p-4 space-y-3 shadow-xs">
              <h2 className="font-serif text-base font-bold text-[#0F2D52]">
                {t('Phương thức thanh toán', 'Payment Method')}
              </h2>

              <div className="space-y-2">
                {/* VietQR */}
                <button
                  onClick={() => setMethod('qr')}
                  className={`w-full p-3 rounded-[8px] border text-left flex items-start gap-3 transition ${
                    method === 'qr' ? 'border-[#1D4E89] bg-[#F2F7FC]' : 'border-[#ECECEC] bg-white'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                    method === 'qr' ? 'border-[#1D4E89] bg-[#1D4E89]' : 'border-[#D1D5DB]'
                  }`}>
                    {method === 'qr' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <div className="space-y-0.5 text-xs">
                    <span className="font-bold text-[#0F2D52] block">
                      VietQR — {t('Chuyển khoản ngân hàng tự động', 'Automatic Bank Transfer')}
                    </span>
                    <span className="text-[#6B7280] block">
                      {t('Quét mã QR bằng app ngân hàng, tiền xác nhận tức thì.', 'Scan QR code with any banking app for instant confirmation.')}
                    </span>
                  </div>
                </button>

                {/* MoMo */}
                <button
                  onClick={() => setMethod('momo')}
                  className={`w-full p-3 rounded-[8px] border text-left flex items-start gap-3 transition ${
                    method === 'momo' ? 'border-[#1D4E89] bg-[#F2F7FC]' : 'border-[#ECECEC] bg-white'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                    method === 'momo' ? 'border-[#1D4E89] bg-[#1D4E89]' : 'border-[#D1D5DB]'
                  }`}>
                    {method === 'momo' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <div className="space-y-0.5 text-xs">
                    <span className="font-bold text-[#0F2D52] block">Ví MoMo</span>
                    <span className="text-[#6B7280] block">Chuyển tiền tới Hotline 0985 000 650</span>
                  </div>
                </button>

                {/* Pay on arrival */}
                <button
                  onClick={() => setMethod('cash')}
                  className={`w-full p-3 rounded-[8px] border text-left flex items-start gap-3 transition ${
                    method === 'cash' ? 'border-[#1D4E89] bg-[#F2F7FC]' : 'border-[#ECECEC] bg-white'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                    method === 'cash' ? 'border-[#1D4E89] bg-[#1D4E89]' : 'border-[#D1D5DB]'
                  }`}>
                    {method === 'cash' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <div className="space-y-0.5 text-xs">
                    <span className="font-bold text-[#0F2D52] block">
                      {t('Thanh toán khi nhận phòng', 'Pay in Full on Arrival')}
                    </span>
                    <span className="text-[#6B7280] block">
                      {t('Xác nhận đặt giữ chỗ qua Zalo lễ tân.', 'Confirm reservation with receptionist on Zalo.')}
                    </span>
                  </div>
                </button>
              </div>

              {/* QR Code Display if VietQR selected */}
              {method === 'qr' && (
                <div className="bg-[#FAFAF8] border border-[#ECECEC] rounded-[8px] p-3 flex flex-col sm:flex-row items-center gap-3 mt-3">
                  <div className="w-36 h-36 bg-white p-1 rounded-[6px] border border-[#ECECEC] shrink-0">
                    <img src={qrSrc} alt="VietQR" className="w-full h-full object-contain" />
                  </div>
                  <div className="space-y-1.5 text-xs flex-1">
                    <div className="font-bold text-[#0F2D52]">{t('Cọc 50% giữ phòng:', 'Deposit 50% to hold room:')}</div>
                    <div className="text-base font-bold text-[#1D4E89]">{formatVND(depositAmount)}</div>
                    <div className="text-[#6B7280] flex justify-between border-t border-[#ECECEC] pt-1">
                      <span>{t('Số tài khoản:', 'Account No:')}</span>
                      <span className="font-mono font-bold text-[#1A1A1A]">0985 000 650</span>
                    </div>
                    <div className="text-[#6B7280] flex justify-between">
                      <span>{t('Nội dung chuyển:', 'Transfer Note:')}</span>
                      <span className="font-mono font-bold text-[#1D4E89]">{refCode}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Booking Success (Screen 9) */}
        {step === 3 && (
          <div className="bg-white border border-[#ECECEC] rounded-[12px] p-6 text-center space-y-5 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 stroke-[1.75]" />
            </div>

            <div className="space-y-1">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0F2D52]">
                {t('Đặt phòng thành công!', 'Booking Successful!')}
              </h2>
              <p className="text-xs text-[#6B7280]">
                {t('Cảm ơn bạn đã lựa chọn nghỉ dưỡng tại The Nam Du Hill Resort.', 'Thank you for choosing to stay at The Nam Du Hill Resort.')}
              </p>
            </div>

            <div className="inline-block bg-[#F2F7FC] border border-[#1D4E89]/20 rounded-[8px] px-4 py-2 text-xs text-[#0F2D52] font-semibold">
              {t('Mã đặt phòng của bạn là:', 'Your booking code is:')} <span className="text-[#1D4E89] font-mono text-sm font-bold ml-1">{bookingCode}</span>
            </div>

            {/* Summary Block */}
            <div className="bg-[#FAFAF8] border border-[#ECECEC] rounded-[8px] p-4 text-left space-y-2 text-xs">
              <div className="flex items-center gap-3 pb-2 border-b border-[#ECECEC]">
                <div className="w-12 h-12 rounded-[6px] overflow-hidden bg-[#F5F7FA] shrink-0">
                  <img
                    src={room.images && room.images.length > 0 ? room.images[0] : 'https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/cover6.jpg'}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-[#0F2D52]">{isEn ? room.nameEn : room.name}</h4>
                  <p className="text-[#6B7280]">{formatDateLabel(ci, co)}</p>
                </div>
              </div>

              <div className="flex justify-between text-[#4B5563]">
                <span>{t('Người đặt:', 'Guest Name:')}</span>
                <span className="font-semibold text-[#1A1A1A]">{name}</span>
              </div>
              <div className="flex justify-between text-[#4B5563]">
                <span>{t('Số điện thoại:', 'Phone:')}</span>
                <span className="font-semibold text-[#1A1A1A]">{phone}</span>
              </div>
              <div className="flex justify-between text-[#4B5563]">
                <span>{t('Tổng tiền:', 'Total Amount:')}</span>
                <span className="font-bold text-[#1D4E89]">{formatVND(totalAmount)}</span>
              </div>
            </div>

            <p className="text-xs text-[#6B7280]">
              {t('Thông tin xác nhận đã được gửi đến email ', 'Confirmation details sent to ')}
              <span className="font-semibold text-[#1A1A1A]">{email}</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/my-bookings" className="flex-1">
                <Button variant="outline" size="md" radius="6px" className="w-full">
                  {t('Xem đơn đặt', 'View My Bookings')}
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button variant="primary" size="md" radius="6px" className="w-full">
                  {t('Quay về trang chủ', 'Back to Home')}
                </Button>
              </Link>
            </div>
          </div>
        )}

      </div>

      {/* Fixed Full-Width Bottom Bar on Checkout Screen */}
      {step < 3 && (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t border-[#ECECEC] p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50 flex items-center justify-between gap-3">
          <div className="max-w-[800px] mx-auto w-full flex items-center justify-between gap-3">
            <div className="shrink-0">
              <span className="text-[10px] text-[#6B7280] block leading-none">{t('Tổng tiền', 'Total')}</span>
              <span className="font-bold text-base text-[#0F2D52]">
                {formatVND(totalAmount)}
              </span>
            </div>
            <Button
              variant="primary"
              size="lg"
              radius="6px"
              className="flex-1 py-3 font-bold"
              onClick={() => {
                if (step === 1) setStep(2)
                else handleCompleteBooking()
                window.scrollTo(0, 0)
              }}
            >
              {step === 1 ? t('Tiếp tục thanh toán', 'Continue to Payment') : t('Xác nhận đặt phòng', 'Confirm Booking')}
            </Button>
          </div>
        </div>
      )}
    </main>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#6B7280]">Đang tải...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
