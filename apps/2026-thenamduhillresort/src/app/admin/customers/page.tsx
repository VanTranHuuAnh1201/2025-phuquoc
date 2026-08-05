'use client'

import { useState } from 'react'

export default function CustomersManagement() {
  const [activeTab, setActiveTab] = useState<'guests' | 'inquiries'>('guests')

  const [guests] = useState([
    {
      id: '#GST-01',
      name: 'Nguyễn Văn Minh',
      phone: '0912 345 678',
      email: 'minh.nguyen@gmail.com',
      totalStays: 3,
      totalSpent: 16400000,
      vipTier: 'VIP Silver',
      lastStay: '15/08/2025',
      favoriteRoom: '#07 - Superior King Jacuzzi',
    },
    {
      id: '#GST-02',
      name: 'Trần Thị Hồng Anh',
      phone: '0988 765 432',
      email: 'honganh.tran@yahoo.com',
      totalStays: 2,
      totalSpent: 9276000,
      vipTier: 'Thành viên',
      lastStay: '14/08/2025',
      favoriteRoom: '#05 - Hexagon 360° Glass',
    },
    {
      id: '#GST-03',
      name: 'Lê Hoàng Nam',
      phone: '0903 112 233',
      email: 'hoangnam.le@gmail.com',
      totalStays: 1,
      totalSpent: 3772000,
      vipTier: 'Mới',
      lastStay: '18/08/2025',
      favoriteRoom: '#01 - Gia Đình View Biển',
    },
  ])

  const [inquiries] = useState([
    {
      id: '#INQ-201',
      name: 'Phạm Minh Anh',
      phone: '0918 888 777',
      email: 'minhanh@gmail.com',
      subject: 'Hỏi tour lặn biển & tư vấn hạng phòng cho 10 người',
      message: 'Đoàn gia đình tôi đi 10 người từ 20/09 đến 22/09. Resort tư vấn giúp tổ chức tiệc nướng BBQ bãi biển và tour cano 3 đảo.',
      date: '13/08/2025',
      status: 'new',
    },
    {
      id: '#INQ-202',
      name: 'Hoàng Ngọc Bích',
      phone: '0977 444 333',
      email: 'bich.hoang@company.com',
      subject: 'Đặt phòng chụp ảnh cưới & combo đưa đón',
      message: 'Tôi muốn đặt phòng Hexagon Lục Giác #05 để chụp ảnh cưới. Cho hỏi resort có hỗ trợ hoa tươi và xe đưa đón 2 chiều không?',
      date: '11/08/2025',
      status: 'replied',
    },
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-slate-900">
          👥 Quản Lý Khách Hàng & Yêu Cầu Liên Hệ
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Hồ sơ lưu trú của khách hàng, thứ hạng VIP và danh sách tư vấn hỏi đáp
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('guests')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition ${
            activeTab === 'guests'
              ? 'border-[#0F2D52] text-[#0F2D52]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Hồ Sơ Khách Lưu Trú ({guests.length})
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'inquiries'
              ? 'border-[#0F2D52] text-[#0F2D52]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Tin Nhắn & Yêu Cầu Tư Vấn ({inquiries.length})</span>
          <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
            1 tin mới
          </span>
        </button>
      </div>

      {/* Guests Tab */}
      {activeTab === 'guests' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Mã khách</th>
                  <th className="px-5 py-3.5">Họ & Tên</th>
                  <th className="px-5 py-3.5">Số điện thoại / Email</th>
                  <th className="px-5 py-3.5">Số lần lưu trú</th>
                  <th className="px-5 py-3.5">Tổng chi tiêu</th>
                  <th className="px-5 py-3.5">Hạng thành viên</th>
                  <th className="px-5 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {guests.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-4 font-bold text-slate-900">{g.id}</td>
                    <td className="px-5 py-4 font-bold text-slate-900">{g.name}</td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-800">{g.phone}</div>
                      <div className="text-[11px] text-slate-500">{g.email}</div>
                    </td>
                    <td className="px-5 py-4 font-bold text-[#0F2D52]">
                      {g.totalStays} lần
                    </td>
                    <td className="px-5 py-4 font-bold text-emerald-700">
                      ₫{g.totalSpent.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full font-bold text-[11px]">
                        {g.vipTier}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => alert(`Lịch sử lưu trú của ${g.name}`)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
                      >
                        Xem lịch sử
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inquiries Tab */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-900">
                    {inq.subject}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Từ: <span className="font-bold text-slate-800">{inq.name}</span> ({inq.phone} • {inq.email}) — {inq.date}
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${
                    inq.status === 'new'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {inq.status === 'new' ? 'Chưa phản hồi' : 'Đã trả lời'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                &ldquo;{inq.message}&rdquo;
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <a
                  href={`tel:${inq.phone}`}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                >
                  📞 Gọi điện tư vấn ({inq.phone})
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
