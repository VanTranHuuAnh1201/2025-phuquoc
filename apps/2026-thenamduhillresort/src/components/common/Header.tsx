'use client'

import { Menu, User, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { Button } from '../common/Button'

interface HeaderProps {
  forceSolid?: boolean
}

export function Header({ forceSolid = false }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage()
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const isCheckout = pathname === '/checkout' || pathname.startsWith('/checkout')

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.user-dropdown-container')) {
        setUserDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Hide public header completely on admin pages
  if (pathname?.startsWith('/admin')) {
    return null
  }

  const isSolid = forceSolid || !isHomePage || scrolled

  const navLinks = [
    { href: '/rooms', label: t('Phòng', 'Rooms') },
    { href: '/dining', label: t('Tiện ích', 'Amenities') },
    { href: '/explore', label: t('Ưu đãi', 'Offers') },
    // { href: '/my-bookings', label: t('Đơn của tôi', 'My Bookings') },
    { href: '/blog', label: t('Về chúng tôi', 'About Us') },
    { href: '/contact', label: t('Liên hệ', 'Contact') },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isSolid
        ? 'bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.05)] text-[#1A1A1A] py-2.5'
        : 'bg-gradient-to-b from-black/60 via-black/20 to-transparent text-white py-3'
        }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* Left Side: Authentic Resort Logo */}
        <Link href={isCheckout ? '#' : '/'} className={`flex items-center gap-2.5 group ${isCheckout ? 'cursor-default pointer-events-none' : ''}`}>
          <img
            src="/uploads/OP5-b8f91eaa.png"
            alt="The Nam Du Hill Resort Logo"
            className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-full bg-white p-0.5 shadow-sm group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col leading-none">
            <span
              className={`font-serif font-bold tracking-tight text-xs sm:text-sm ${isSolid ? 'text-[#0F2D52]' : 'text-white'
                }`}
            >
              The Nam Du Hill
            </span>
            <span
              className={`text-[10px] font-medium tracking-normal mt-0.5 ${isSolid ? 'text-[#6B7280]' : 'text-white/80'
                }`}
            >
              Nam Du, Kiên Giang
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Disabled during checkout) */}
        {!isCheckout && (
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-[#1D4E89] relative py-1 ${isActive
                    ? 'text-[#1D4E89] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#1D4E89] after:rounded-full'
                    : isSolid
                      ? 'text-[#4B5563]'
                      : 'text-white/90 hover:text-white'
                    }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        )}

        {/* Right Side Action Controls: Disabled on checkout */}
        {!isCheckout && (
          <div className="flex items-center gap-3">
            {/* Desktop Language Selector */}
            <div className="hidden md:flex items-center gap-1 text-xs font-medium cursor-pointer py-1 px-2 rounded-md hover:bg-black/5 transition">
              <button
                onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
                className={`flex items-center gap-1 font-semibold ${isSolid ? 'text-[#1A1A1A]' : 'text-white'}`}
              >
                <span>{language === 'vi' ? 'VI' : 'EN'}</span>
                <span className="text-[10px] opacity-70">▾</span>
              </button>
            </div>

            {/* User Account Dropdown Container */}
            <div className="relative user-dropdown-container">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-[6px] transition border ${
                  pathname === '/my-bookings' || pathname.startsWith('/admin')
                    ? 'bg-[#1D4E89] text-white border-[#1D4E89]'
                    : isSolid
                    ? 'border-[#ECECEC] text-[#0F2D52] hover:bg-[#F5F7FA]'
                    : 'border-white/40 text-white hover:bg-white/10'
                }`}
                aria-label="User Account Menu"
              >
                <User className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden lg:inline">{t('Tài khoản', 'Account')}</span>
              </button>

              {/* Dropdown Options */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#ECECEC] py-2 z-50 text-slate-800 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link
                    href="/my-bookings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 font-medium text-slate-700 transition"
                  >
                    <span className="text-base">📋</span>
                    <div>
                      <div className="font-bold text-[#0F2D52]">{t('Đơn đặt của tôi', 'My Bookings')}</div>
                      <div className="text-[10px] text-slate-500">{t('Xem lịch sử phòng đã đặt', 'View booking history')}</div>
                    </div>
                  </Link>

                  <div className="my-1 border-t border-slate-100" />

                  <Link
                    href="/admin"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 font-medium text-slate-700 transition"
                  >
                    <span className="text-base">🏨</span>
                    <div>
                      <div className="font-bold text-[#0F2D52]">{t('Quản lý hệ thống (Admin)', 'Admin CMS')}</div>
                      <div className="text-[10px] text-slate-500">{t('Trang quản lý resort Nam Du', 'Resort management panel')}</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link href="/rooms" className="hidden md:inline-block">
              <Button variant="primary" size="md" radius="6px">
                {t('Đặt phòng', 'Book Now')}
              </Button>
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition shadow-[0_2px_8px_rgba(0,0,0,0.05)] focus:outline-none md:hidden ${isSolid
                ? 'bg-[#F5F7FA] text-[#1A1A1A] hover:bg-[#E5E7EB]'
                : 'bg-white/90 text-[#1A1A1A] hover:bg-white'
                }`}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5 stroke-[1.75]" /> : <Menu className="w-5 h-5 stroke-[1.75]" />}
            </button>
          </div>
        )}

        {/* Focused Badge on Checkout Screen */}
        {isCheckout && (
          <div className="text-xs font-semibold text-[#1D4E89] bg-[#F2F7FC] px-3 py-1 rounded-full border border-[#1D4E89]/20">
            {t('Thanh toán an toàn', 'Secure Checkout')}
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu (Hidden on Checkout) */}
      {!isCheckout && menuOpen && (
        <div className="fixed inset-x-0 top-[53px] bg-white border-b border-[#E5E7EB] shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-5 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-2 duration-200 text-[#1A1A1A]">
          <div className="flex items-center justify-between pb-3 border-b border-[#ECECEC]">
            <div className="flex items-center gap-2">
              <img src="/uploads/OP5-b8f91eaa.png" alt="Logo" className="w-7 h-7 object-contain rounded-full bg-white" />
              <div>
                <p className="text-xs font-bold text-[#1A1A1A] tracking-tight font-serif">
                  The Nam Du Hill
                </p>
                <p className="text-[11px] text-[#6B7280]">Nam Du, Kiên Giang</p>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-[#F5F7FA] p-1 rounded-full border border-[#E5E7EB]">
              <button
                onClick={() => setLanguage('vi')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-full transition ${language === 'vi' ? 'bg-[#1D4E89] text-white shadow-sm' : 'text-[#6B7280] hover:text-[#1A1A1A]'
                  }`}
              >
                🇻🇳 VI
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-full transition ${language === 'en' ? 'bg-[#1D4E89] text-white shadow-sm' : 'text-[#6B7280] hover:text-[#1A1A1A]'
                  }`}
              >
                🇺🇸 EN
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${isActive
                    ? 'bg-[#1D4E89]/10 text-[#1D4E89] font-semibold'
                    : 'text-[#4B5563] hover:bg-[#F5F7FA]'
                    }`}
                >
                  <span>{link.label}</span>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#1D4E89]" />}
                </Link>
              )
            })}

            <div className="my-1 border-t border-[#ECECEC]" />

            <Link
              href="/my-bookings"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                pathname === '/my-bookings'
                  ? 'bg-[#1D4E89]/10 text-[#1D4E89] font-semibold'
                  : 'text-[#4B5563] hover:bg-[#F5F7FA]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>📋</span>
                <span>{t('Đơn đặt của tôi', 'My Bookings')}</span>
              </div>
            </Link>

            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                pathname.startsWith('/admin')
                  ? 'bg-[#1D4E89]/10 text-[#1D4E89] font-semibold'
                  : 'text-[#4B5563] hover:bg-[#F5F7FA]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>🏨</span>
                <span>{t('Quản lý hệ thống (Admin)', 'Admin CMS')}</span>
              </div>
            </Link>
          </div>

          <div className="pt-3 border-t border-[#ECECEC]">
            <Link href="/rooms" onClick={() => setMenuOpen(false)}>
              <Button variant="primary" size="lg" fullWidth radius="6px">
                {t('Đặt phòng ngay', 'Book a Room Now')}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
