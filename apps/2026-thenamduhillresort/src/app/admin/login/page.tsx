'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('manager@thenamduhill.com')
  const [password, setPassword] = useState('123456')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      localStorage.setItem('ndh_admin_authenticated', 'true')
    } catch {}
    setTimeout(() => {
      setLoading(false)
      router.push('/admin/dashboard')
    }, 500)
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Banner */}
        <div className="bg-[#0F2D52] p-8 text-center text-white relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C6A86A] to-[#9E8246] mx-auto grid place-items-center text-white font-serif font-bold text-2xl shadow-lg mb-3">
            ND
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-white">
            The Nam Du Hill Resort
          </h1>
          <p className="text-xs text-[#C6A86A] mt-1 font-medium">
            Hệ thống Quản lý Hotel Booking & CMS
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Email Quản trị
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#0F2D52] focus:ring-2 focus:ring-[#0F2D52]/20 transition"
              placeholder="manager@thenamduhill.com"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 block">
                Mật khẩu
              </label>
              <a href="#" className="text-xs text-[#0F2D52] hover:underline font-semibold">
                Quên mật khẩu?
              </a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#0F2D52] focus:ring-2 focus:ring-[#0F2D52]/20 transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#0F2D52] hover:bg-[#163B6C] text-white text-sm font-bold shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Đang đăng nhập...</span>
            ) : (
              <>
                <span>Đăng nhập hệ thống CMS</span>
                <span>→</span>
              </>
            )}
          </button>

          <div className="pt-2 text-center border-t border-slate-100">
            <Link
              href="/"
              className="text-xs font-medium text-slate-500 hover:text-slate-800 transition"
            >
              ← Quay lại Website Nam Du Hill Resort
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
