'use client'

import { useState } from 'react'
import { ROOMS, formatVND } from '../../../data/rooms'

export default function RoomsManagement() {
  const [roomList, setRoomList] = useState(
    ROOMS.map((r, index) => ({
      ...r,
      status: index === 3 || index === 7 ? 'maintenance' : index % 2 === 0 ? 'occupied' : 'available',
      totalBookingsThisMonth: Math.floor(Math.random() * 15) + 5,
    }))
  )
  const [selectedGroup, setSelectedGroup] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [editingRoom, setEditingRoom] = useState<any | null>(null)

  const filteredRooms = roomList.filter((r) => {
    const matchesGroup = selectedGroup === 'all' || r.group === selectedGroup
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      r.code.toLowerCase().includes(query) ||
      r.name.toLowerCase().includes(query) ||
      r.view.toLowerCase().includes(query)
    return matchesGroup && matchesSearch
  })

  const handlePriceChange = (code: string, newPrice: number) => {
    setRoomList((prev) =>
      prev.map((r) => (r.code === code ? { ...r, price: newPrice } : r))
    )
    if (editingRoom && editingRoom.code === code) {
      setEditingRoom({ ...editingRoom, price: newPrice })
    }
  }

  const handleStatusChange = (code: string, newStatus: string) => {
    setRoomList((prev) =>
      prev.map((r) => (r.code === code ? { ...r, status: newStatus } : r))
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-[#0F2D52] text-white border border-[#0F2D52]'
      case 'occupied':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-300'
      case 'maintenance':
        return 'bg-amber-100 text-amber-800 border border-amber-300'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Sẵn sàng đón khách'
      case 'occupied':
        return 'Đang có khách ở'
      case 'maintenance':
        return 'Đang bảo trì / Dọn'
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-900">
            🛏️ Quản Lý Hạng Phòng (20 Room Types)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Cập nhật tình trạng phòng, bảng giá theo mùa và quản lý tiện nghi phòng nghỉ
          </p>
        </div>

        <button
          onClick={() => alert('Chức năng thêm hạng phòng mới')}
          className="px-4 py-2 bg-[#0F2D52] hover:bg-[#163B6C] text-white text-xs font-bold rounded-xl shadow-sm transition"
        >
          + Thêm Hạng Phòng Mới
        </button>
      </div>

      {/* Summary Room Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 grid place-items-center text-2xl">
            🏨
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Tổng hạng phòng</div>
            <div className="text-xl font-bold text-slate-900">{roomList.length} phòng</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 grid place-items-center text-2xl">
            ✅
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Đang có khách</div>
            <div className="text-xl font-bold text-emerald-600">
              {roomList.filter((r) => r.status === 'occupied').length} phòng
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 grid place-items-center text-2xl">
            ✨
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Phòng trống sẵn sàng</div>
            <div className="text-xl font-bold text-[#0F2D52]">
              {roomList.filter((r) => r.status === 'available').length} phòng
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 grid place-items-center text-2xl">
            🛠️
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Bảo trì / Đang dọn</div>
            <div className="text-xl font-bold text-amber-600">
              {roomList.filter((r) => r.status === 'maintenance').length} phòng
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="w-full sm:w-80 relative">
          <input
            type="text"
            placeholder="Tìm theo mã phòng (#01, #07...), tên phòng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0F2D52]"
          />
          <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
        </div>

        <div className="flex items-center gap-2 text-xs w-full sm:w-auto overflow-x-auto">
          <span className="text-slate-500 whitespace-nowrap">Nhóm phòng:</span>
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'couple', label: 'Cặp đôi (Couple)' },
            { id: 'family', label: 'Gia đình (Family)' },
            { id: 'suite', label: 'Suite cao cấp' },
          ].map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGroup(g.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
                selectedGroup === g.id
                  ? 'bg-[#0F2D52] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRooms.map((r) => (
          <div
            key={r.code}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              {/* Room Image Banner */}
              <div className="aspect-[16/9] relative bg-slate-100 overflow-hidden">
                <img
                  src={
                    r.images?.[0] ||
                    'https://thenamduhill.com/image/catalog/room-suite/6-phong-deluxe/cover6.jpg'
                  }
                  alt={r.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-[#0F2D52]/90 backdrop-blur-md text-white font-bold text-xs px-2.5 py-1 rounded-lg">
                  Mã phòng {r.code}
                </span>
                {r.tag && (
                  <span className="absolute top-2 right-2 bg-[#C6A86A] text-[#0F2D52] font-bold text-[10px] px-2 py-0.5 rounded">
                    {r.tag}
                  </span>
                )}
              </div>

              {/* Card Details */}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-base font-bold text-slate-900 leading-snug">
                      {r.name}
                    </h3>
                    <p className="text-xs text-slate-500 italic mt-0.5">{r.nameEn}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                  <span>📐 {r.area}m²</span>
                  <span>👤 Tối đa {r.cap} khách</span>
                  <span>👁️ {r.view}</span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Giá niêm yết:</span>
                    <span className="font-bold text-base text-[#0F2D52]">
                      {formatVND(r.price)}
                    </span>
                    <span className="text-[10px] text-slate-500">/đêm</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block text-right">Tình trạng:</span>
                    <select
                      value={r.status}
                      onChange={(e) => handleStatusChange(r.code, e.target.value)}
                      className={`text-xs font-bold rounded-lg px-2 py-1 focus:outline-none cursor-pointer ${getStatusBadge(
                        r.status
                      )}`}
                    >
                      <option value="available">Sẵn sàng</option>
                      <option value="occupied">Đang ở</option>
                      <option value="maintenance">Bảo trì</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                📊 {r.totalBookingsThisMonth} lượt đặt tháng này
              </span>
              <button
                onClick={() => setEditingRoom(r)}
                className="px-3 py-1.5 bg-[#0F2D52] hover:bg-[#163B6C] text-white font-bold rounded-lg transition"
              >
                Chỉnh sửa giá
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Room Price Modal */}
      {editingRoom && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Cập Nhật Giá Hạng Phòng {editingRoom.code}
              </h3>
              <button
                onClick={() => setEditingRoom(null)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Tên hạng phòng:</label>
                <input
                  type="text"
                  disabled
                  value={editingRoom.name}
                  className="w-full p-2 bg-slate-100 rounded-lg text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  Giá phòng mỗi đêm (VNĐ):
                </label>
                <input
                  type="number"
                  value={editingRoom.price}
                  onChange={(e) =>
                    handlePriceChange(editingRoom.code, Number(e.target.value))
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-bold text-[#0F2D52] focus:outline-none focus:border-[#0F2D52]"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Hiển thị: {formatVND(editingRoom.price)} / đêm
                </span>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  onClick={() => setEditingRoom(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    alert(`Đã cập nhật giá phòng ${editingRoom.code} thành công!`)
                    setEditingRoom(null)
                  }}
                  className="px-4 py-2 bg-[#0F2D52] text-white font-bold rounded-xl text-xs hover:bg-[#163B6C]"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
