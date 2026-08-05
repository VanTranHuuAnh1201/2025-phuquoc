'use client'

import { useState } from 'react'

/**
 * Một đơn trong bảng quản trị — dữ liệu demo, chưa nối `Booking` của core.
 *
 * Khai tường minh thay vì `any`: `selectedBooking` được lan ra khắp modal chi
 * tiết, `any` ở đây là mất kiểm tra kiểu cho cả file.
 */
interface AdminBooking {
  id: string
  customer: string
  phone: string
  email: string
  roomCode: string
  roomName: string
  checkIn: string
  checkOut: string
  nights: number
  /** Một số đơn seed thiếu trường này. */
  guests?: number
  amount: number
  depositAmount: number
  paymentStatus: string
  status: string
  notes: string
  createdAt: string
}

export default function BookingsManagement() {
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null)

  const [bookings, setBookings] = useState<AdminBooking[]>([
    {
      id: '#NDH-8821',
      customer: 'Nguyễn Văn Minh',
      phone: '0912 345 678',
      email: 'minh.nguyen@gmail.com',
      roomCode: '#07',
      roomName: 'Superior King Jacuzzi',
      checkIn: '15/08/2025',
      checkOut: '17/08/2025',
      nights: 2,
      guests: 4,
      amount: 5942000,
      depositAmount: 2971000,
      paymentStatus: 'Đã cọc 50%',
      status: 'confirmed',
      notes: 'Khách đến tàu Superdong 11:15. Đã hẹn xe điện đón bến Củ Tron.',
      createdAt: '10/08/2025',
    },
    {
      id: '#NDH-8822',
      customer: 'Trần Thị Hồng Anh',
      phone: '0988 765 432',
      email: 'honganh.tran@yahoo.com',
      roomCode: '#05',
      roomName: 'Hexagon 360° Glass Room',
      checkIn: '14/08/2025',
      checkOut: '17/08/2025',
      nights: 3,
      amount: 4638000,
      depositAmount: 4638000,
      paymentStatus: 'Đã thanh toán 100%',
      status: 'checked_in',
      notes: 'Khách cặp đôi kỷ niệm ngày cưới. Đã chuẩn bị hoa dừa tươi tại phòng.',
      createdAt: '08/08/2025',
    },
    {
      id: '#NDH-8823',
      customer: 'Lê Hoàng Nam',
      phone: '0903 112 233',
      email: 'hoangnam.le@gmail.com',
      roomCode: '#01',
      roomName: 'Phòng Gia Đình View Biển',
      checkIn: '18/08/2025',
      checkOut: '20/08/2025',
      nights: 2,
      guests: 4,
      amount: 3772000,
      depositAmount: 0,
      paymentStatus: 'Chưa thanh toán',
      status: 'pending',
      notes: 'Chờ khách gửi bill chuyển khoản cọc trong 24h.',
      createdAt: '12/08/2025',
    },
    {
      id: '#NDH-8824',
      customer: 'David Miller',
      phone: '+8490 888 999',
      email: 'david.m@expedia.com',
      roomCode: '#06',
      roomName: 'Deluxe Sea & Pool View',
      checkIn: '17/08/2025',
      checkOut: '19/08/2025',
      nights: 2,
      guests: 2,
      amount: 3552000,
      depositAmount: 1776000,
      paymentStatus: 'Đã cọc 50%',
      status: 'confirmed',
      notes: 'Khách quốc tế, giao tiếp tiếng Anh. Yêu cầu phòng tầng cao.',
      createdAt: '09/08/2025',
    },
    {
      id: '#NDH-8825',
      customer: 'Phạm Quỳnh Như',
      phone: '0977 123 999',
      email: 'quynhnhu.p@gmail.com',
      roomCode: '#08',
      roomName: 'Family Sea View, Mezzanine',
      checkIn: '01/08/2025',
      checkOut: '03/08/2025',
      nights: 2,
      guests: 4,
      amount: 6176000,
      depositAmount: 6176000,
      paymentStatus: 'Đã thanh toán 100%',
      status: 'checked_out',
      notes: 'Khách đánh giá 5 sao trên Google Maps.',
      createdAt: '25/07/2025',
    },
    {
      id: '#NDH-8826',
      customer: 'Vũ Quốc Khánh',
      phone: '0934 555 666',
      email: 'khanh.vu@hotmail.com',
      roomCode: '#02',
      roomName: 'Phòng Giường Đôi View Vườn',
      checkIn: '10/08/2025',
      checkOut: '12/08/2025',
      nights: 2,
      guests: 2,
      amount: 3092000,
      depositAmount: 0,
      paymentStatus: 'Đã hoàn cọc',
      status: 'cancelled',
      notes: 'Hủy do thời tiết biển động tàu không chạy. Đã hoàn tiền cọc.',
      createdAt: '05/08/2025',
    },
  ])

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      b.id.toLowerCase().includes(query) ||
      b.customer.toLowerCase().includes(query) ||
      b.phone.includes(query) ||
      b.roomCode.toLowerCase().includes(query) ||
      b.roomName.toLowerCase().includes(query)
    return matchesStatus && matchesSearch
  })

  const updateBookingStatus = (id: string, newStatus: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    )
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking({ ...selectedBooking, status: newStatus })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'checked_in':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-300'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border border-blue-300'
      case 'pending':
        return 'bg-amber-100 text-amber-800 border border-amber-300'
      case 'checked_out':
        return 'bg-slate-100 text-slate-700 border border-slate-300'
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 border border-rose-300'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'checked_in':
        return 'Đang lưu trú'
      case 'confirmed':
        return 'Đã xác nhận'
      case 'pending':
        return 'Chờ cọc'
      case 'checked_out':
        return 'Đã trả phòng'
      case 'cancelled':
        return 'Đã hủy'
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-900">
            📅 Quản Lý Đặt Phòng (Hotel Bookings)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi trạng thái check-in, xác nhận đặt cọc và quản lý khách lưu trú
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => alert('Xuất file danh sách đặt phòng Excel')}
            className="px-4 py-2 bg-[#0F2D52] hover:bg-[#163B6C] text-white text-xs font-bold rounded-xl shadow-sm transition"
          >
            📥 Xuất báo cáo Excel
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div
          onClick={() => setFilterStatus('all')}
          className={`cursor-pointer p-4 rounded-xl border text-center transition ${
            filterStatus === 'all'
              ? 'bg-[#0F2D52] text-white border-[#0F2D52]'
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-xl font-bold">{bookings.length}</div>
          <div className="text-[11px] opacity-80 mt-0.5">Tất cả đơn</div>
        </div>

        <div
          onClick={() => setFilterStatus('pending')}
          className={`cursor-pointer p-4 rounded-xl border text-center transition ${
            filterStatus === 'pending'
              ? 'bg-amber-600 text-white border-amber-600'
              : 'bg-white text-slate-800 border-slate-200 hover:border-amber-400'
          }`}
        >
          <div className="text-xl font-bold text-amber-600">
            {bookings.filter((b) => b.status === 'pending').length}
          </div>
          <div className="text-[11px] text-slate-600 mt-0.5">Chờ cọc</div>
        </div>

        <div
          onClick={() => setFilterStatus('confirmed')}
          className={`cursor-pointer p-4 rounded-xl border text-center transition ${
            filterStatus === 'confirmed'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400'
          }`}
        >
          <div className="text-xl font-bold text-blue-600">
            {bookings.filter((b) => b.status === 'confirmed').length}
          </div>
          <div className="text-[11px] text-slate-600 mt-0.5">Đã xác nhận</div>
        </div>

        <div
          onClick={() => setFilterStatus('checked_in')}
          className={`cursor-pointer p-4 rounded-xl border text-center transition ${
            filterStatus === 'checked_in'
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-400'
          }`}
        >
          <div className="text-xl font-bold text-emerald-600">
            {bookings.filter((b) => b.status === 'checked_in').length}
          </div>
          <div className="text-[11px] text-slate-600 mt-0.5">Đang lưu trú</div>
        </div>

        <div
          onClick={() => setFilterStatus('checked_out')}
          className={`cursor-pointer p-4 rounded-xl border text-center transition ${
            filterStatus === 'checked_out'
              ? 'bg-slate-700 text-white border-slate-700'
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400'
          }`}
        >
          <div className="text-xl font-bold text-slate-600">
            {bookings.filter((b) => b.status === 'checked_out').length}
          </div>
          <div className="text-[11px] text-slate-600 mt-0.5">Đã trả phòng</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="w-full sm:w-96 relative">
          <input
            type="text"
            placeholder="Tìm theo tên khách, SĐT, mã đơn, phòng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0F2D52]"
          />
          <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs">
          <span className="text-slate-500 whitespace-nowrap">Lọc nhanh:</span>
          {['all', 'pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'].map(
            (st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition capitalize whitespace-nowrap ${
                  filterStatus === st
                    ? 'bg-[#0F2D52] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'all' ? 'Tất cả' : getStatusText(st)}
              </button>
            )
          )}
        </div>
      </div>

      {/* Bookings Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Mã đơn</th>
                <th className="px-5 py-3.5">Khách hàng</th>
                <th className="px-5 py-3.5">Phòng gán</th>
                <th className="px-5 py-3.5">Check-in / Check-out</th>
                <th className="px-5 py-3.5">Tổng tiền</th>
                <th className="px-5 py-3.5">Thanh toán</th>
                <th className="px-5 py-3.5">Trạng thái</th>
                <th className="px-5 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-4 font-bold text-slate-900">{b.id}</td>
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900">{b.customer}</div>
                    <div className="text-[11px] text-slate-500">{b.phone}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-[#0F2D52] bg-blue-50 px-2 py-0.5 rounded">
                      {b.roomCode}
                    </span>
                    <div className="text-[11px] text-slate-600 mt-0.5 max-w-[150px] truncate">
                      {b.roomName}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-700">
                    <div>
                      {b.checkIn} → {b.checkOut}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {b.nights} đêm ({b.guests || 2} khách)
                    </div>
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-900">
                    ₫{b.amount.toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block px-2.5 py-1 text-[11px] font-semibold rounded-full ${getStatusBadge(
                        b.status
                      )}`}
                    >
                      {getStatusText(b.status)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
                      >
                        Chi tiết
                      </button>
                      {b.status === 'pending' && (
                        <button
                          onClick={() => updateBookingStatus(b.id, 'confirmed')}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                        >
                          Xác nhận cọc
                        </button>
                      )}
                      {b.status === 'confirmed' && (
                        <button
                          onClick={() => updateBookingStatus(b.id, 'checked_in')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition"
                        >
                          Check-in
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Chi Tiết Đơn Đặt Phòng {selectedBooking.id}
                </h3>
                <span className="text-xs text-slate-500">
                  Tạo ngày {selectedBooking.createdAt}
                </span>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-slate-400 hover:text-slate-600 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-slate-500 block">Khách hàng:</span>
                  <span className="font-bold text-slate-900">{selectedBooking.customer}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Số điện thoại:</span>
                  <span className="font-bold text-slate-900">{selectedBooking.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Email:</span>
                  <span className="font-medium text-slate-800">{selectedBooking.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Hạng phòng:</span>
                  <span className="font-bold text-[#0F2D52]">{selectedBooking.roomCode} - {selectedBooking.roomName}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-slate-500 block">Ngày Check-in:</span>
                  <span className="font-bold text-slate-900">{selectedBooking.checkIn} (14:00)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Ngày Check-out:</span>
                  <span className="font-bold text-slate-900">{selectedBooking.checkOut} (12:00)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Tổng số tiền:</span>
                  <span className="font-bold text-lg text-[#0F2D52]">₫{selectedBooking.amount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Thanh toán:</span>
                  <span className="font-bold text-emerald-700">{selectedBooking.paymentStatus}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <span className="font-bold text-amber-900 block mb-1">📝 Ghi chú lưu trú & Đón bến tàu:</span>
                <p className="text-amber-800">{selectedBooking.notes}</p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Đóng
                </button>
                {selectedBooking.status === 'pending' && (
                  <button
                    onClick={() => updateBookingStatus(selectedBooking.id, 'confirmed')}
                    className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700"
                  >
                    Xác nhận cọc
                  </button>
                )}
                {selectedBooking.status === 'confirmed' && (
                  <button
                    onClick={() => updateBookingStatus(selectedBooking.id, 'checked_in')}
                    className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700"
                  >
                    Hoàn tất Check-in
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
