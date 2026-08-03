'use client'

import { useState } from 'react'

export default function ServicesManagement() {
  const [services, setServices] = useState([
    {
      id: 1,
      name: 'Xe riêng đưa đón bến tàu Củ Tron (2 chiều)',
      category: 'Đưa đón bến tàu',
      price: 0,
      priceUnit: 'Miễn phí cho khách resort',
      status: 'active',
      totalOrders: 142,
      description: 'Đón tận bến tàu khi tàu Superdong / Ngọc Thành cập bến Củ Tron.',
    },
    {
      id: 2,
      name: 'Tour Cano 3 đảo & Lặn ngắm san hô',
      category: 'Tour trải nghiệm',
      price: 450000,
      priceUnit: 'khách',
      status: 'active',
      totalOrders: 86,
      description: 'Khám phá Hòn Dầu, Hòn Mấu, Hòn Hai Bờ Đập & thưởng thức cháo nhum trên bè.',
    },
    {
      id: 3,
      name: 'Tiệc nướng Hải sản BBQ sân hiên view biển',
      category: 'Ẩm thực',
      price: 350000,
      priceUnit: 'người',
      status: 'active',
      totalOrders: 64,
      description: 'Mực trứng nướng sa tế, nhum nướng mỡ hành, tôm mũ ni, cá bớp nướng muối ớt.',
    },
    {
      id: 4,
      name: 'Cho thuê xe máy phượt đường vòng đảo',
      category: 'Phương tiện',
      price: 150000,
      priceUnit: 'ngày (bao nón bảo hiểm)',
      status: 'active',
      totalOrders: 110,
      description: 'Xe tay ga & xe số đời mới đầy bình xăng hỗ trợ tham quan quanh đảo.',
    },
    {
      id: 5,
      name: 'Set trang trí hoa & rượu mừng kỷ niệm',
      category: 'Dịch vụ đặc biệt',
      price: 650000,
      priceUnit: 'gói phòng',
      status: 'active',
      totalOrders: 18,
      description: 'Trang trí nến, hoa hồng dại & 1 chai vang đỏ mừng sinh nhật / kỷ niệm.',
    },
  ])

  const [activeTab, setActiveTab] = useState<'services' | 'transfers'>('services')

  const transfersToday = [
    { id: '#TR-101', guest: 'Nguyễn Văn Minh', boat: 'Superdong I (Rạch Giá -> Nam Du)', arriveTime: '11:15', passengers: 4, vehicle: 'Xe điện #1' },
    { id: '#TR-102', guest: 'Phạm Quỳnh Như', boat: 'Phú Quốc Express (Nam Du -> Rạch Giá)', arriveTime: '12:00', passengers: 2, vehicle: 'Xe điện #2' },
    { id: '#TR-103', guest: 'David Miller', boat: 'Ngọc Thành 2', arriveTime: '14:30', passengers: 2, vehicle: 'Xe điện #1' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-900">
            🛥️ Dịch Vụ & Tour Đảo Nam Du
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý dịch vụ đưa đón bến tàu Củ Tron, tour trải nghiệm và ẩm thực sân hiên
          </p>
        </div>

        <button
          onClick={() => alert('Thêm dịch vụ mới')}
          className="px-4 py-2 bg-[#0F2D52] hover:bg-[#163B6C] text-white text-xs font-bold rounded-xl shadow-sm transition"
        >
          + Thêm Dịch Vụ Mới
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('services')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition ${
            activeTab === 'services'
              ? 'border-[#0F2D52] text-[#0F2D52]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Danh Mục Dịch Vụ & Tour (5)
        </button>
        <button
          onClick={() => setActiveTab('transfers')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'transfers'
              ? 'border-[#0F2D52] text-[#0F2D52]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Lịch Đưa Đón Bến Tàu Hôm Nay</span>
          <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
            3 chuyến
          </span>
        </button>
      </div>

      {/* Content for Services Tab */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-bold text-[#0F2D52] bg-blue-50 px-2.5 py-1 rounded-lg">
                    {s.category}
                  </span>
                  <span className="text-xs text-slate-500">
                    {s.totalOrders} lượt sử dụng
                  </span>
                </div>

                <h3 className="font-serif text-base font-bold text-slate-900">{s.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-700">
                    {s.price === 0 ? 'Miễn phí' : `₫${s.price.toLocaleString()}`}
                  </span>
                  {s.price > 0 && <span className="text-[10px] text-slate-500"> / {s.priceUnit}</span>}
                </div>

                <button
                  onClick={() => alert(`Chỉnh sửa dịch vụ ${s.name}`)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
                >
                  Chỉnh sửa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content for Transfers Tab */}
      {activeTab === 'transfers' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-serif text-base font-bold text-slate-900">
              Lịch Đón Khách Tại Bến Tàu Củ Tron (Hôm Nay)
            </h3>
            <span className="text-xs text-slate-500">
              Hotline tài xế đón bến: 090 123 4567
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Giờ tàu cập</th>
                  <th className="px-5 py-3.5">Khách hàng</th>
                  <th className="px-5 py-3.5">Tàu cao tốc</th>
                  <th className="px-5 py-3.5">Số lượng</th>
                  <th className="px-5 py-3.5">Xe phụ trách</th>
                  <th className="px-5 py-3.5">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transfersToday.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-4 font-bold text-[#0F2D52]">{t.arriveTime}</td>
                    <td className="px-5 py-4 font-bold text-slate-900">{t.guest}</td>
                    <td className="px-5 py-4 text-slate-700">{t.boat}</td>
                    <td className="px-5 py-4 text-slate-800 font-semibold">{t.passengers} người</td>
                    <td className="px-5 py-4 font-bold text-emerald-700">{t.vehicle}</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full font-semibold">
                        Đang chuẩn bị xe
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
