'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AnalyticsPage() {
  const [dataMode, setDataMode] = useState<'detailed' | 'empty'>('detailed')
  type TimeRange = 'this_month' | 'last_month' | 'quarter' | 'year'

  const [timeRange, setTimeRange] = useState<TimeRange>('this_month')

  // Detailed sample data
  const monthlyData = [
    { month: 'Tháng 3', revenue: 195000000, occupancy: 72, bookings: 32 },
    { month: 'Tháng 4', revenue: 240000000, occupancy: 81, bookings: 40 },
    { month: 'Tháng 5', revenue: 298000000, occupancy: 86, bookings: 52 },
    { month: 'Tháng 6', revenue: 385000000, occupancy: 94, bookings: 68 },
    { month: 'Tháng 7', revenue: 410000000, occupancy: 96, bookings: 74 },
    { month: 'Tháng 8 (Dự kiến)', revenue: 342500000, occupancy: 88, bookings: 60 },
  ]

  const roomCategoryBreakdown = [
    { category: 'Deluxe Sea View', bookings: 24, revenue: 142800000, percentage: 41.7, color: 'bg-[#0F2D52]' },
    { category: 'Rock Deluxe Sunset', bookings: 18, revenue: 99000000, percentage: 28.9, color: 'bg-blue-600' },
    { category: 'Superior King Sea View', bookings: 12, revenue: 58800000, percentage: 17.2, color: 'bg-emerald-600' },
    { category: 'Family Suite (8 Guests)', bookings: 6, revenue: 41900000, percentage: 12.2, color: 'bg-amber-600' },
  ]

  const paymentMethodBreakdown = [
    { method: 'Chuyển khoản QR (VietQR)', percentage: 68, amount: 232900000, color: 'bg-[#0F2D52]' },
    { method: 'Thẻ tín dụng / Thẻ ghi nợ', percentage: 22, amount: 75350000, color: 'bg-blue-600' },
    { method: 'Tiền mặt tại Lễ tân', percentage: 10, amount: 34250000, color: 'bg-emerald-600' },
  ]

  const dailyTransactions = [
    {
      id: '#NDH-8821',
      date: '03/08/2026',
      customer: 'Nguyễn Văn Minh',
      room: 'Superior King Jacuzzi (#07)',
      nights: 2,
      amount: 5942000,
      paymentMethod: 'Chuyển khoản QR',
      status: 'Đã cọc 50%',
    },
    {
      id: '#NDH-8822',
      date: '03/08/2026',
      customer: 'Trần Thị Hồng Anh',
      room: 'Hexagon 360° Glass (#05)',
      nights: 3,
      amount: 4638000,
      paymentMethod: 'Thẻ tín dụng',
      status: 'Đã thanh toán',
    },
    {
      id: '#NDH-8823',
      date: '02/08/2026',
      customer: 'Lê Hoàng Nam',
      room: 'Phòng Gia Đình View Biển (#01)',
      nights: 2,
      amount: 3772000,
      paymentMethod: 'Chuyển khoản QR',
      status: 'Chờ cọc',
    },
    {
      id: '#NDH-8824',
      date: '01/08/2026',
      customer: 'David Miller',
      room: 'Deluxe Sea & Pool View (#06)',
      nights: 2,
      amount: 3552000,
      paymentMethod: 'Chuyển khoản QR',
      status: 'Đã cọc 50%',
    },
    {
      id: '#NDH-8820',
      date: '01/08/2026',
      customer: 'Phạm Thu Hương',
      room: 'Bungalow Gỗ Đỉnh Đồi (#03)',
      nights: 1,
      amount: 1850000,
      paymentMethod: 'Tiền mặt',
      status: 'Đã thanh toán',
    },
  ]

  const totalRevenue = dataMode === 'detailed' ? 342500000 : 0
  const completedBookings = dataMode === 'detailed' ? 60 : 0
  const adr = dataMode === 'detailed' ? 1850000 : 0
  const occupancyRate = dataMode === 'detailed' ? 88 : 0

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span>📈</span> Báo Cáo Doanh Thu & Thống Kê Công Suất
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Chi tiết tổng thu, công suất phòng, kênh đặt phòng và hình thức thanh toán
          </p>
        </div>

        {/* State Toggle & Date Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Data Mode Switcher */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setDataMode('detailed')}
              className={`px-3 py-1.5 rounded-lg transition ${
                dataMode === 'detailed'
                  ? 'bg-[#0F2D52] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📊 Đầy đủ chi tiết
            </button>
            <button
              onClick={() => setDataMode('empty')}
              className={`px-3 py-1.5 rounded-lg transition ${
                dataMode === 'empty'
                  ? 'bg-[#0F2D52] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⚪ Trống (Empty)
            </button>
          </div>

          {/* Time Filter */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="text-xs font-semibold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#0F2D52]"
          >
            <option value="this_month">Tháng này (T8/2026)</option>
            <option value="last_month">Tháng trước (T7/2026)</option>
            <option value="quarter">Quý 3/2026</option>
            <option value="year">Cả năm 2026</option>
          </select>

          <button
            onClick={() => alert('Đang xuất báo cáo CSV...')}
            className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl transition border border-slate-200 flex items-center gap-1.5"
          >
            <span>📥</span> Xuất File
          </button>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Tổng Doanh Thu
          </span>
          <div className="text-2xl font-bold text-[#0F2D52] mt-1">
            ₫{totalRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            {dataMode === 'detailed' ? '↑ +18.4% so với kỳ trước' : 'Chưa ghi nhận doanh thu'}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Số Đơn Hoàn Tất
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {completedBookings} <span className="text-xs font-normal text-slate-500">đơn</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            {dataMode === 'detailed' ? 'Trung bình 2.2 đêm/đơn' : '0 lượt đặt phòng'}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Giá Phòng Trung Bình (ADR)
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            ₫{adr.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            {dataMode === 'detailed' ? 'Đã bao gồm ăn sáng & đón bến' : '—'}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Công Suất Phòng (Occupancy)
          </span>
          <div className="text-2xl font-bold text-[#0F2D52] mt-1">
            {occupancyRate}%
          </div>
          <span className="text-[11px] text-blue-600 font-semibold mt-1 block">
            {dataMode === 'detailed' ? '17/20 phòng đang hoạt động' : 'Chưa phát sinh lưu trú'}
          </span>
        </div>
      </div>

      {/* Main Data Section or Empty View */}
      {dataMode === 'empty' ? (
        /* Empty State Container */
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center text-3xl mx-auto">
            📊
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="font-serif text-lg font-bold text-slate-900">
              Chưa có dữ liệu báo cáo doanh thu
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Hiện tại chưa phát sinh giao dịch hoặc đơn đặt phòng trong khoảng thời gian đã chọn.
              Bạn có thể thêm đơn đặt phòng mới để hệ thống tự động tổng hợp.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/admin/bookings"
              className="inline-flex items-center gap-2 bg-[#0F2D52] text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#163B6C] transition shadow-xs"
            >
              <span>➕</span> Quản Lý Đặt Phòng
            </Link>
          </div>
        </div>
      ) : (
        /* Detailed Analytics Grid */
        <div className="space-y-8">
          {/* Monthly Revenue & Occupancy Bar Chart View */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h2 className="font-serif text-lg font-bold text-slate-900">
                Xu Hướng Doanh Thu & Tỷ Lệ Lấp Đầy Theo Tháng
              </h2>
              <span className="text-xs text-slate-500 font-medium">Đơn vị: VNĐ / %</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 pt-4">
              {monthlyData.map((d, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between space-y-3 text-center hover:border-[#0F2D52]/30 transition"
                >
                  <span className="text-xs font-bold text-slate-700">{d.month}</span>
                  <div className="w-full bg-slate-200 h-28 rounded-lg relative flex items-end justify-center overflow-hidden">
                    <div
                      className="w-full bg-gradient-to-t from-[#0F2D52] to-[#163B6C] rounded-b-lg transition-all duration-500"
                      style={{ height: `${(d.revenue / 450000000) * 100}%` }}
                    />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-[#0F2D52] block">
                      ₫{(d.revenue / 1000000).toFixed(0)}Tr
                    </span>
                    <span className="text-[10px] text-slate-500">Lấp đầy {d.occupancy}% ({d.bookings} đơn)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Breakdown Grid: Room Category & Payment Method */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Room Category Breakdown */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
              <h2 className="font-serif text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                Doanh Thu Theo Hạng Phòng
              </h2>

              <div className="space-y-4 text-xs">
                {roomCategoryBreakdown.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-800">{item.category} ({item.bookings} đơn)</span>
                      <span className="text-[#0F2D52]">
                        ₫{item.revenue.toLocaleString()} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Breakdown */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
              <h2 className="font-serif text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                Hình Thức Thanh Toán & Nhận Cọc
              </h2>

              <div className="space-y-4 text-xs">
                {paymentMethodBreakdown.map((pm, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-800">{pm.method}</span>
                      <span className="text-[#0F2D52]">
                        ₫{pm.amount.toLocaleString()} ({pm.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${pm.color} rounded-full transition-all duration-500`}
                        style={{ width: `${pm.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Daily Transaction Log Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden space-y-4">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-slate-900">
                  Nhật Ký Giao Dịch Doanh Thu Gần Đây
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Danh sách chi tiết hóa đơn thanh toán và đặt cọc phòng
                </p>
              </div>
              <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl">
                5 Giao dịch mới nhất
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-3.5">Ngày</th>
                    <th className="px-6 py-3.5">Mã đơn</th>
                    <th className="px-6 py-3.5">Khách hàng</th>
                    <th className="px-6 py-3.5">Phòng / Đêm</th>
                    <th className="px-6 py-3.5">Thanh toán</th>
                    <th className="px-6 py-3.5">Doanh thu</th>
                    <th className="px-6 py-3.5">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dailyTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4 font-mono text-slate-600">{tx.date}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">{tx.id}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">{tx.customer}</td>
                      <td className="px-6 py-4 text-slate-700">
                        <div>{tx.room}</div>
                        <div className="text-[10px] text-slate-500">{tx.nights} đêm</div>
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-medium">{tx.paymentMethod}</td>
                      <td className="px-6 py-4 font-bold text-[#0F2D52]">
                        ₫{tx.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2.5 py-1 text-[11px] font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
