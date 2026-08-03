'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'
import { Button } from '../../components/common/Button'
import { ArrowLeft, X } from 'lucide-react'

interface BookingItem {
  id: string
  roomName: string
  roomCode: string
  roomImage: string
  dates: string
  guests: string
  contactName: string
  contactPhone: string
  contactEmail: string
  notes: string
  totalPrice: number
  depositPrice: number
  status: 'Sắp tới' | 'Đã hoàn thành' | 'Đã hủy'
  createdAt: string
  paymentMethod: string
}

export default function MyBookingsPage() {
  const { t } = useLanguage()

  const [tab, setTab] = useState<'upcoming' | 'completed'>('upcoming')
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null)
  const [bookings, setBookings] = useState<BookingItem[]>([])

  // Initial sample bookings (both upcoming & past completed)
  const initialSampleBookings: BookingItem[] = [
    {
      id: '#NDH123456',
      roomName: 'Deluxe Sea View',
      roomCode: '#R6',
      roomImage: 'https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/cover6.jpg',
      dates: '15 Th8 - 17 Th8 (2 đêm)',
      guests: '2 người lớn, 1 phòng',
      contactName: 'Nguyễn Văn A',
      contactPhone: '0901234567',
      contactEmail: 'nguyenvana@gmail.com',
      notes: 'Không có',
      totalPrice: 4600000,
      depositPrice: 2300000,
      status: 'Sắp tới',
      createdAt: '03/08/2026',
      paymentMethod: 'Thanh toán chuyển khoản VietQR',
    },
    {
      id: '#NDH987654',
      roomName: 'Executive Sea View Suite',
      roomCode: '#R5',
      roomImage: 'https://thenamduhill.com/image/catalog/room-suite/5-phong-executive/cover5.jpg',
      dates: '10 Th4 - 12 Th4 2025 (2 đêm)',
      guests: '2 người lớn',
      contactName: 'Nguyễn Văn A',
      contactPhone: '0901234567',
      contactEmail: 'nguyenvana@gmail.com',
      notes: 'Yêu cầu tầng cao view đẹp',
      totalPrice: 5200000,
      depositPrice: 5200000,
      status: 'Đã hoàn thành',
      createdAt: '05/04/2025',
      paymentMethod: 'Thanh toán chuyển khoản VietQR',
    },
    {
      id: '#NDH852963',
      roomName: 'Hillside Bungalow Garden View',
      roomCode: '#R2',
      roomImage: 'https://thenamduhill.com/image/catalog/room-suite/2-bungalow-san-hien/cover2.jpg',
      dates: '20 Th1 - 22 Th1 2025 (2 đêm)',
      guests: '4 người lớn, 1 trẻ em',
      contactName: 'Nguyễn Văn A',
      contactPhone: '0901234567',
      contactEmail: 'nguyenvana@gmail.com',
      notes: 'Cần xe đón bến tàu Củ Tron',
      totalPrice: 3800000,
      depositPrice: 3800000,
      status: 'Đã hoàn thành',
      createdAt: '15/01/2025',
      paymentMethod: 'Thẻ tín dụng / Ghi nợ',
    },
  ]

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ndh:my-bookings')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && parsed.length > 0) {
          setBookings(parsed)
          return
        }
      }
    } catch {}
    setBookings(initialSampleBookings)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCancelBooking = (bookingId: string) => {
    if (confirm(t('Bạn có chắc chắn muốn hủy đơn đặt phòng này?', 'Are you sure you want to cancel this booking?'))) {
      const updated = bookings.map((b) => (b.id === bookingId ? { ...b, status: 'Đã hủy' as const } : b))
      setBookings(updated)
      try {
        localStorage.setItem('ndh:my-bookings', JSON.stringify(updated))
      } catch {}
      setSelectedBooking(null)
    }
  }

  const activeBookings = bookings.filter((b) =>
    tab === 'upcoming' ? b.status === 'Sắp tới' : b.status === 'Đã hoàn thành' || b.status === 'Đã hủy'
  )

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] pt-14 pb-36">
      {/* Top Header */}
      <div className="bg-white border-b border-[#ECECEC] sticky top-12 z-30 px-4 py-3">
        <div className="max-w-[800px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 text-xs text-[#4B5563] hover:text-[#0F2D52] transition font-medium">
            <ArrowLeft className="w-4 h-4" />
            <span>{t('Trang chủ', 'Home')}</span>
          </Link>
          <h1 className="font-serif text-base font-bold text-[#0F2D52]">
            {t('Đơn đặt của tôi', 'My Bookings')}
          </h1>
          <div className="w-12" />
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 pt-4 space-y-4">

        {/* Screen 10 Tabs: Sắp tới vs Đã hoàn thành */}
        <div className="bg-white border border-[#ECECEC] rounded-[10px] p-1 flex items-center shadow-xs">
          <button
            onClick={() => setTab('upcoming')}
            className={`flex-1 py-2 text-xs font-bold rounded-[8px] transition ${
              tab === 'upcoming' ? 'bg-[#F2F7FC] text-[#1D4E89]' : 'text-[#6B7280]'
            }`}
          >
            {t('Sắp tới', 'Upcoming')}
          </button>
          <button
            onClick={() => setTab('completed')}
            className={`flex-1 py-2 text-xs font-bold rounded-[8px] transition ${
              tab === 'completed' ? 'bg-[#F2F7FC] text-[#1D4E89]' : 'text-[#6B7280]'
            }`}
          >
            {t('Đã hoàn thành', 'Completed')}
          </button>
        </div>

        {/* Booking Card List */}
        {activeBookings.length === 0 ? (
          <div className="bg-white border border-[#ECECEC] rounded-[12px] p-8 text-center space-y-3 shadow-xs">
            <div className="text-xs text-[#6B7280]">
              {t('Bạn chưa có đơn đặt phòng nào.', 'No bookings found.')}
            </div>
            <Link href="/rooms">
              <Button variant="primary" size="sm" radius="6px">
                {t('Khám phá danh sách phòng', 'Explore Rooms')}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {activeBookings.map((b, idx) => (
              <div key={`${b.id}-${idx}`} className="bg-white border border-[#ECECEC] rounded-[12px] p-4 space-y-3 shadow-xs">
                {/* Header Row */}
                <div className="flex items-center justify-between border-b border-[#ECECEC] pb-2 text-xs">
                  <span className="font-mono font-bold text-[#1D4E89]">{b.id}</span>
                  <span className={`px-2 py-0.5 rounded-full font-medium ${
                    b.status === 'Sắp tới'
                      ? 'bg-emerald-50 text-emerald-700'
                      : b.status === 'Đã hoàn thành'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}>
                    {b.status}
                  </span>
                </div>

                {/* Content Row */}
                <div className="flex gap-3">
                  <div className="w-20 h-16 rounded-[8px] overflow-hidden bg-[#F5F7FA] shrink-0">
                    <img src={b.roomImage} alt={b.roomName} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0 text-xs">
                    <h3 className="font-serif font-bold text-[#0F2D52] truncate">{b.roomName}</h3>
                    <div className="text-[#6B7280]">{b.dates}</div>
                    <div className="text-[#6B7280]">{b.guests}</div>
                  </div>
                </div>

                {/* Footer Row with 'Xem lại phòng' & 'Xem chi tiết' buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-[#ECECEC]">
                  <div className="text-xs">
                    <span className="text-[#6B7280]">{t('Tổng tiền:', 'Total:')} </span>
                    <span className="font-bold text-[#0F2D52]">{b.totalPrice.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/rooms/${b.roomCode.replace('#', '').toLowerCase()}`}>
                      <Button variant="outline" size="xs" radius="6px" className="border-[#1D4E89] text-[#1D4E89] hover:bg-[#1D4E89]/5">
                        {t('Xem màn hình phòng', 'View Room Page')}
                      </Button>
                    </Link>
                    <Button
                      variant="primary"
                      size="xs"
                      radius="6px"
                      className="bg-[#0F2D52] hover:bg-[#163B6C]"
                      onClick={() => setSelectedBooking(b)}
                    >
                      {t('Xem chi tiết đơn', 'View Order Details')}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Screen 11 Modal: Chi tiết đơn đặt */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-[500px] rounded-t-[16px] sm:rounded-[16px] max-h-[90vh] overflow-y-auto p-4 space-y-4 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#ECECEC] pb-3">
              <h2 className="font-serif text-base font-bold text-[#0F2D52]">
                {t('Chi tiết đơn đặt', 'Booking Details')}
              </h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-8 h-8 rounded-full bg-[#F5F7FA] flex items-center justify-center text-[#6B7280] hover:text-[#1A1A1A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Code & Status */}
            <div className="flex items-center justify-between text-xs bg-[#F8F9FA] p-3 rounded-[8px]">
              <div>
                <span className="text-[#6B7280] block">{t('Mã đặt phòng', 'Booking Code')}</span>
                <span className="font-mono font-bold text-[#1D4E89] text-sm">{selectedBooking.id}</span>
              </div>
              <span className={`px-2.5 py-1 rounded-full font-medium ${
                selectedBooking.status === 'Sắp tới'
                  ? 'bg-emerald-50 text-emerald-700'
                  : selectedBooking.status === 'Đã hoàn thành'
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-rose-50 text-rose-700'
              }`}>
                {selectedBooking.status}
              </span>
            </div>

            {/* Room Info */}
            <div className="space-y-2 text-xs">
              <h3 className="font-bold text-[#0F2D52] uppercase tracking-wider text-[11px]">
                {t('Thông tin đặt phòng', 'Room Info')}
              </h3>
              <div className="flex gap-3">
                <div className="w-16 h-14 rounded-[6px] overflow-hidden bg-[#F5F7FA] shrink-0">
                  <img src={selectedBooking.roomImage} alt={selectedBooking.roomName} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-[#1A1A1A]">{selectedBooking.roomName}</h4>
                  <p className="text-[#6B7280]">{selectedBooking.dates}</p>
                  <p className="text-[#6B7280]">{selectedBooking.guests}</p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 text-xs border-t border-[#ECECEC] pt-3">
              <h3 className="font-bold text-[#0F2D52] uppercase tracking-wider text-[11px]">
                {t('Thông tin liên hệ', 'Contact Details')}
              </h3>
              <div className="space-y-1 text-[#4B5563]">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">{t('Họ và tên:', 'Name:')}</span>
                  <span className="font-semibold text-[#1A1A1A]">{selectedBooking.contactName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">{t('Số điện thoại:', 'Phone:')}</span>
                  <span className="font-semibold text-[#1A1A1A]">{selectedBooking.contactPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">{t('Email:', 'Email:')}</span>
                  <span className="font-semibold text-[#1A1A1A]">{selectedBooking.contactEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">{t('Yêu cầu:', 'Notes:')}</span>
                  <span className="font-semibold text-[#1A1A1A]">{selectedBooking.notes}</span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-2 text-xs border-t border-[#ECECEC] pt-3">
              <h3 className="font-bold text-[#0F2D52] uppercase tracking-wider text-[11px]">
                {t('Chi tiết thanh toán', 'Payment Details')}
              </h3>
              <div className="space-y-1 text-[#4B5563]">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">{t('Tổng tiền:', 'Total Amount:')}</span>
                  <span className="font-bold text-[#0F2D52] text-sm">{selectedBooking.totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">{t('Phương thức:', 'Payment Method:')}</span>
                  <span className="font-medium text-[#1A1A1A]">{selectedBooking.paymentMethod}</span>
                </div>
              </div>
            </div>

            {/* Actions: View Room Screen & Cancel Booking */}
            <div className="pt-3 border-t border-[#ECECEC] space-y-2">
              <Link href={`/rooms/${selectedBooking.roomCode.replace('#', '').toLowerCase()}`} className="block">
                <Button variant="outline" size="md" fullWidth radius="6px" className="border-[#0F2D52] text-[#0F2D52] hover:bg-[#0F2D52]/5 text-xs font-bold py-2.5">
                  {t('Xem lại màn hình phòng', 'Re-view Room Screen')}
                </Button>
              </Link>

              {selectedBooking.status === 'Sắp tới' && (
                <button
                  onClick={() => handleCancelBooking(selectedBooking.id)}
                  className="w-full py-2.5 text-xs font-bold text-rose-600 border border-rose-200 bg-rose-50/50 rounded-[6px] hover:bg-rose-100 transition"
                >
                  {t('Hủy đặt phòng', 'Cancel Booking')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
