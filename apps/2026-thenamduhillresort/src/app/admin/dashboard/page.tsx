'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    occupancyRate: 0,
    activeGuests: 0,
    pendingBookings: 0,
    totalRooms: 20,
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalBookings: 184,
        totalRevenue: 342500000,
        occupancyRate: 88,
        activeGuests: 42,
        pendingBookings: 6,
        totalRooms: 20,
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const quickActions = [
    {
      name: 'Tạo Đặt Phòng Mới',
      href: '/admin/bookings/new',
      icon: '➕',
      color: 'from-[#0F2D52] to-[#163B6C]',
    },
    {
      name: 'Quản Lý Hạng Phòng (20)',
      href: '/admin/rooms',
      icon: '🛏️',
      color: 'from-emerald-600 to-teal-700',
    },
    {
      name: 'Lịch Đón Bến Tàu Củ Tron',
      href: '/admin/services',
      icon: '🛥️',
      color: 'from-amber-600 to-amber-700',
    },
    {
      name: 'Viết Bài Blog Mới',
      href: '/admin/blog/new',
      icon: '📝',
      color: 'from-purple-600 to-[#0F2D52]',
    },
  ]

  const recentBookings = [
    {
      id: '#NDH-8821',
      customer: 'Nguyễn Văn Minh',
      roomCode: '#07 - Superior King Jacuzzi',
      checkIn: '15/08/2025',
      nights: 2,
      amount: 5942000,
      status: 'confirmed',
      payment: 'Cọc 50%',
      phone: '0912 345 678',
    },
    {
      id: '#NDH-8822',
      customer: 'Trần Thị Hồng Anh',
      roomCode: '#05 - Hexagon 360° Glass',
      checkIn: '16/08/2025',
      nights: 3,
      amount: 4638000,
      status: 'checked_in',
      payment: 'Đã thanh toán',
      phone: '0988 765 432',
    },
    {
      id: '#NDH-8823',
      customer: 'Lê Hoàng Nam',
      roomCode: '#01 - Phòng Gia Đình View Biển',
      checkIn: '15/08/2025',
      nights: 2,
      amount: 3772000,
      status: 'pending',
      payment: 'Chờ chuyển khoản',
      phone: '0903 112 233',
    },
    {
      id: '#NDH-8824',
      customer: 'David Miller',
      roomCode: '#06 - Deluxe Sea & Pool View',
      checkIn: '17/08/2025',
      nights: 2,
      amount: 3552000,
      status: 'confirmed',
      payment: 'Cọc 50%',
      phone: '+8490 888 999',
    },
  ]

  const todaySchedule = [
    {
      time: '11:15',
      guest: 'Nguyễn Văn Minh (4 người)',
      action: 'Check-in & Đón bến tàu Củ Tron (Tàu Superdong)',
      room: '#07',
      status: 'Ready',
    },
    {
      time: '12:00',
      guest: 'Phạm Thu Hương',
      action: 'Check-out & Hỗ trợ mang hành lý ra bến tàu',
      room: '#03',
      status: 'Completed',
    },
    {
      time: '14:30',
      guest: 'David Miller (2 người)',
      action: 'Check-in & Phục vụ welcome drink nước dừa',
      room: '#06',
      status: 'Pending',
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'checked_in':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border border-blue-200'
      case 'pending':
        return 'bg-amber-100 text-amber-800 border border-amber-200'
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 border border-rose-200'
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
      case 'cancelled':
        return 'Đã hủy'
      default:
        return status
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0F2D52] via-[#163B6C] to-[#204A80] rounded-2xl text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#C6A86A]/20 backdrop-blur-md border border-[#C6A86A]/40 text-[#C6A86A] px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <span>✨ Resort Executive Dashboard</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold mb-2 text-white">
            Chào mừng trở lại, Quản Lý Nam Du Hill! 👋
          </h1>
          <p className="text-sm text-slate-200 max-w-2xl">
            Tổng quan tình hình phòng, đơn đặt chỗ và doanh thu trong ngày của The Nam Du Hill Resort.
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 hidden lg:block pointer-events-none" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Doanh thu tháng này
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                ₫{stats.totalRevenue.toLocaleString()}
              </p>
              <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <span>↑ +18.4%</span>
                <span className="text-slate-400 font-normal">so với tháng trước</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-2xl grid place-items-center text-2xl text-[#C6A86A] border border-amber-200">
              💰
            </div>
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tỷ lệ lấp đầy phòng
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {stats.occupancyRate}%
              </p>
              <p className="text-xs text-[#0F2D52] font-semibold mt-1">
                17/20 phòng đang có khách
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-2xl grid place-items-center text-2xl border border-blue-200">
              🛏️
            </div>
          </div>
        </div>

        {/* Active Guests */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Khách đang lưu trú
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {stats.activeGuests} khách
              </p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">
                +12 khách mới check-in hôm nay
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl grid place-items-center text-2xl border border-emerald-200">
              👥
            </div>
          </div>
        </div>

        {/* Pending Bookings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Đơn cọc chờ xác nhận
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {stats.pendingBookings} đơn
              </p>
              <p className="text-xs text-amber-600 font-semibold mt-1">
                Cần kiểm tra bill chuyển khoản
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-2xl grid place-items-center text-2xl border border-amber-200">
              ⏰
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>⚡</span> Thao tác nhanh
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className={`p-4 rounded-xl bg-gradient-to-r ${action.color} text-white hover:shadow-lg transition-all duration-200 flex items-center gap-3 group`}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                {action.icon}
              </span>
              <span className="font-semibold text-sm">{action.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Grid Section: Today Schedule & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Today's Check-in / Pier Transfer Schedule (1 col) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h2 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
              <span>🛥️</span> Lịch Check-in & Đón Bến Tàu
            </h2>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-semibold">
              Hôm nay
            </span>
          </div>

          <div className="space-y-3">
            {todaySchedule.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-100 bg-[#FAFAF8] space-y-1.5 hover:border-[#0F2D52]/30 transition"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0F2D52] bg-blue-50 px-2 py-0.5 rounded">
                    ⏰ {item.time}
                  </span>
                  <span className="font-bold text-slate-700">Phòng {item.room}</span>
                </div>
                <p className="text-xs font-bold text-slate-900">{item.guest}</p>
                <p className="text-xs text-slate-600">{item.action}</p>
              </div>
            ))}
          </div>

          <Link
            href="/admin/services"
            className="block text-center text-xs font-bold text-[#0F2D52] hover:underline pt-2"
          >
            Xem toàn bộ lịch đưa đón tàu →
          </Link>
        </div>

        {/* Right Column: Recent Bookings Table (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-slate-900">
                Đơn Đặt Phòng Gần Đây
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Cập nhật tự động từ website & các kênh trực tuyến
              </p>
            </div>
            <Link
              href="/admin/bookings"
              className="text-xs font-bold text-[#0F2D52] hover:text-[#163B6C] bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition"
            >
              Xem tất cả đơn →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/60 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Mã đơn</th>
                  <th className="px-6 py-3.5">Khách hàng</th>
                  <th className="px-6 py-3.5">Hạng phòng</th>
                  <th className="px-6 py-3.5">Check-in</th>
                  <th className="px-6 py-3.5">Giá trị</th>
                  <th className="px-6 py-3.5">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 font-bold text-slate-900">{b.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{b.customer}</div>
                      <div className="text-[11px] text-slate-500">{b.phone}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">{b.roomCode}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <div>{b.checkIn}</div>
                      <div className="text-[11px] text-slate-500">{b.nights} đêm</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#0F2D52]">
                      ₫{b.amount.toLocaleString()}
                      <div className="text-[10px] text-slate-500 font-normal">{b.payment}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-[11px] font-semibold rounded-full ${getStatusBadge(
                          b.status
                        )}`}
                      >
                        {getStatusText(b.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
