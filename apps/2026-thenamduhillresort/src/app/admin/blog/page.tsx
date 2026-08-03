'use client'

import { useState } from 'react'

export default function BlogManagement() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Kinh nghiệm du lịch đảo Nam Du tự túc trọn gói 2025',
      category: 'Cẩm nang du lịch',
      author: 'Nam Du Editorial',
      date: '10/08/2025',
      views: 3420,
      status: 'published',
      cover: '/uploads/pasted-1785691965790-0.png',
    },
    {
      id: 2,
      title: 'Top 5 góc check-in sống ảo cực chill tại The Nam Du Hill Resort',
      category: 'Trải nghiệm Resort',
      author: 'Nam Du Team',
      date: '05/08/2025',
      views: 1890,
      status: 'published',
      cover: '/uploads/pasted-1785690604574-0.png',
    },
    {
      id: 3,
      title: 'Hướng dẫn đặt vé tàu cao tốc Superdong & Phú Quốc Express ra Nam Du',
      category: 'Hướng dẫn di chuyển',
      author: 'Lê Văn Tùng',
      date: '01/08/2025',
      views: 5210,
      status: 'published',
      cover: '/uploads/hero-1.jpg',
    },
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-900">
            📝 Quản Lý Bài Viết & Blog Du Lịch
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Đăng tải kinh nghiệm du lịch, hướng dẫn di chuyển & sự kiện tại Nam Du Hill Resort
          </p>
        </div>

        <button
          onClick={() => alert('Chức năng tạo bài viết blog mới')}
          className="px-4 py-2 bg-[#0F2D52] hover:bg-[#163B6C] text-white text-xs font-bold rounded-xl shadow-sm transition"
        >
          + Viết Bài Blog Mới
        </button>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Bài viết</th>
                <th className="px-5 py-3.5">Chuyên mục</th>
                <th className="px-5 py-3.5">Tác giả</th>
                <th className="px-5 py-3.5">Lượt xem</th>
                <th className="px-5 py-3.5">Ngày đăng</th>
                <th className="px-5 py-3.5">Trạng thái</th>
                <th className="px-5 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.cover}
                        alt={p.title}
                        className="w-12 h-10 rounded-lg object-cover border border-slate-200"
                      />
                      <span className="font-bold text-slate-900 max-w-xs line-clamp-2">
                        {p.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-semibold text-[#0F2D52]">{p.category}</td>
                  <td className="px-5 py-4 text-slate-600">{p.author}</td>
                  <td className="px-5 py-4 font-bold text-slate-800">
                    👁️ {p.views.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-slate-600">{p.date}</td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                      Đã xuất bản
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => alert(`Chỉnh sửa bài viết ${p.title}`)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
                    >
                      Chỉnh sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
