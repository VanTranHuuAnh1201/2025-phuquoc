'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const publicPages = ['/admin/login']
  const isPublicPage = publicPages.some((page) => pathname === page || pathname.endsWith('/login'))

  useEffect(() => {
    if (!isPublicPage) {
      const isAuth = localStorage.getItem('ndh_admin_authenticated') === 'true'
      if (!isAuth) {
        router.push('/admin/login')
      }
    }
  }, [pathname, isPublicPage, router])

  const handleLogout = () => {
    try {
      localStorage.removeItem('ndh_admin_authenticated')
    } catch {}
    router.push('/admin/login')
  }

  if (isPublicPage) {
    return <>{children}</>
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { name: 'Quản lý Đặt phòng', href: '/admin/bookings', icon: '📅' },
    { name: 'Quản lý Hạng phòng', href: '/admin/rooms', icon: '🛏️' },
    { name: 'Dịch vụ & Tour', href: '/admin/services', icon: '🛥️' },
    { name: 'Khách hàng & Yêu cầu', href: '/admin/customers', icon: '👥' },
    { name: 'Quản lý Blog', href: '/admin/blog', icon: '📝' },
    { name: 'Báo cáo & Doanh thu', href: '/admin/analytics', icon: '📈' },
    { name: 'Cài đặt Resort', href: '/admin/settings', icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Mobile optimized & Nam Du Navy styling */}
      <div
        className={`fixed inset-y-0 left-0 w-64 sm:w-72 bg-[#0F2D52] text-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 lg:static lg:inset-0 flex flex-col justify-between ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C6A86A] to-[#9E8246] grid place-items-center text-white font-serif font-bold text-lg shadow-md">
                ND
              </div>
              <div>
                <div className="font-serif font-bold text-white text-base tracking-wide">
                  The Nam Du Hill
                </div>
                <div className="text-[11px] text-[#C6A86A] font-medium">
                  Resort Management CMS
                </div>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-4 space-y-1.5">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#C6A86A] text-[#0F2D52] font-semibold shadow-md translate-x-1'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-base sm:text-lg">{item.icon}</span>
                  <span className="truncate">{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Profile & Web link */}
        <div className="border-t border-white/10 p-4 space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="w-9 h-9 rounded-full bg-[#C6A86A] text-[#0F2D52] font-bold grid place-items-center text-sm">
              M
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-white text-xs truncate">Quản lý Nam Du</div>
              <div className="text-[10px] text-white/60 truncate">manager@thenamduhill.com</div>
            </div>
          </div>
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white/90 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <span>🌐</span>
            <span>Xem Website Khách Hàng</span>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                  Hệ Thống Quản Lý Nam Du Hill Resort
                </h1>
                <span className="text-xs text-slate-500 hidden sm:inline-block">
                  Hòn Củ Tron, Đảo Nam Du, Kiên Giang
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Live Status Pill */}
              <div className="hidden md:flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200 text-xs font-semibold">
                <span className="w-2 h-[#0F2D52] bg-emerald-500 rounded-full animate-pulse"></span>
                <span>Hệ thống hoạt động ổn định</span>
              </div>

              {/* Notification icon */}
              <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5zm-2-2V9a6 6 0 00-12 0v6l-2 2h14z"
                  />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
              </button>

              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </header>

        {/* Page Content View */}
        <main className="p-4 sm:p-8 flex-1">{children}</main>
      </div>
    </div>
  )
}
