'use client'

import { useState } from 'react'

export default function SettingsPage() {
  const [resortInfo, setResortInfo] = useState({
    name: 'The Nam Du Hill Resort',
    phone: '090 123 4567',
    zalo: '0901234567',
    email: 'info@thenamduhill.com',
    address: 'Đỉnh Đồi Hòn Củ Tron, Quần Đảo Nam Du, Kiên Giang',
    bankName: 'MBBank (Ngân hàng Quân Đội)',
    accountNumber: '9999 8888 666',
    accountHolder: 'THE NAM DU HILL RESORT',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    depositPercent: 50,
  })

  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-slate-900">
          ⚙️ Cài Đặt Hệ Thống & Thông Tin Resort
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Cấu hình thông tin liên hệ, ngân hàng chuyển khoản cọc & giờ nhận trả phòng
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold animate-fade-in">
          ✓ Đã lưu thay đổi cấu hình thành công!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Resort Contact Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h2 className="font-serif text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            📍 Thông Tin Liên Hệ Resort
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Tên Chỗ Nghỉ</label>
              <input
                type="text"
                value={resortInfo.name}
                onChange={(e) => setResortInfo({ ...resortInfo, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F2D52]"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Hotline Lễ Tân / Đón Tàu</label>
              <input
                type="text"
                value={resortInfo.phone}
                onChange={(e) => setResortInfo({ ...resortInfo, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F2D52]"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Zalo Hỗ Trợ Đặt Phòng</label>
              <input
                type="text"
                value={resortInfo.zalo}
                onChange={(e) => setResortInfo({ ...resortInfo, zalo: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F2D52]"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Email Resort</label>
              <input
                type="email"
                value={resortInfo.email}
                onChange={(e) => setResortInfo({ ...resortInfo, email: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F2D52]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Địa Chỉ Chi Tiết</label>
              <input
                type="text"
                value={resortInfo.address}
                onChange={(e) => setResortInfo({ ...resortInfo, address: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F2D52]"
              />
            </div>
          </div>
        </div>

        {/* Payment & Bank Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h2 className="font-serif text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            🏦 Tài Khoản Ngân Hàng Nhận Tiền Đặt Cọc
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Ngân Hàng</label>
              <input
                type="text"
                value={resortInfo.bankName}
                onChange={(e) => setResortInfo({ ...resortInfo, bankName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F2D52]"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Số Tài Khoản</label>
              <input
                type="text"
                value={resortInfo.accountNumber}
                onChange={(e) => setResortInfo({ ...resortInfo, accountNumber: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold focus:outline-none focus:border-[#0F2D52]"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Chủ Tài Khoản</label>
              <input
                type="text"
                value={resortInfo.accountHolder}
                onChange={(e) => setResortInfo({ ...resortInfo, accountHolder: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 uppercase font-bold focus:outline-none focus:border-[#0F2D52]"
              />
            </div>
          </div>
        </div>

        {/* Check-in / Out Policy */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h2 className="font-serif text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            ⏰ Quy Đơn Giờ Giấc & Đặt Cọc
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Giờ Check-in</label>
              <input
                type="text"
                value={resortInfo.checkInTime}
                onChange={(e) => setResortInfo({ ...resortInfo, checkInTime: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-center font-bold focus:outline-none focus:border-[#0F2D52]"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Giờ Check-out</label>
              <input
                type="text"
                value={resortInfo.checkOutTime}
                onChange={(e) => setResortInfo({ ...resortInfo, checkOutTime: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-center font-bold focus:outline-none focus:border-[#0F2D52]"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">% Đặt Cọc Giữ Phòng</label>
              <input
                type="number"
                value={resortInfo.depositPercent}
                onChange={(e) => setResortInfo({ ...resortInfo, depositPercent: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-center font-bold focus:outline-none focus:border-[#0F2D52]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-[#0F2D52] hover:bg-[#163B6C] text-white text-xs font-bold rounded-xl shadow-lg transition"
          >
            Lưu Cấu Hình Cài Đặt
          </button>
        </div>
      </form>
    </div>
  )
}
