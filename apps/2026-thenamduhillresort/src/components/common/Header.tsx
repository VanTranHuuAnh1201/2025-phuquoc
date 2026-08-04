'use client'

import { namDuHill, pick, UI } from '@repo/core'

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
  const { language, setLanguage, tx } = useLanguage()
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

  const hrefMap: Record<string, string> = {
    '#rooms': '/rooms',
    '#dining': '/dining',
    '#places': '/explore',
    '#gallery': '/gallery',
    '#contact': '/contact',
  }

  const navLinks = namDuHill.nav
    .filter((item: { href: string }) => item.href !== '#tours')
    .map((item: { href: string; label: any }) => ({
      href: hrefMap[item.href] || item.href,
      label: pick(item.label, language as 'vi' | 'en'),
    }))

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isSolid
        ? 'bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.05)] text-[#1A1A1A] py-2.5'
        : 'bg-gradient-to-b from-black/60 via-black/20 to-transparent text-white py-3'
        }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">

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

        {/* Right Side Group: Navigation Links (positioned near right action controls) + Controls */}
        {!isCheckout && (
          <div className="flex items-center gap-5 sm:gap-7 lg:gap-8">
            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-5 lg:gap-7">
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

            {/* Action Controls: Language Selector (VI | EN), User Account & Book Now */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Language Selector: VI | EN */}
              <div className="flex items-center gap-1 text-xs font-medium py-1 px-1">
                <button
                  onClick={() => setLanguage('vi')}
                  className={`px-1 py-0.5 text-xs transition uppercase ${language === 'vi'
                      ? isSolid
                        ? 'font-bold text-[#0F2D52]'
                        : 'font-bold text-white'
                      : isSolid
                        ? 'text-[#6B7280] hover:text-[#1A1A1A]'
                        : 'text-white/60 hover:text-white'
                    }`}
                >
                  VI
                </button>
                <span className={`text-[10px] ${isSolid ? 'text-[#D1D5DB]' : 'text-white/40'}`}>|</span>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-1 py-0.5 text-xs transition uppercase ${language === 'en'
                      ? isSolid
                        ? 'font-bold text-[#0F2D52]'
                        : 'font-bold text-white'
                      : isSolid
                        ? 'text-[#6B7280] hover:text-[#1A1A1A]'
                        : 'text-white/60 hover:text-white'
                    }`}
                >
                  EN
                </button>
              </div>

              {/* User Account Dropdown Container */}
              <div className="relative user-dropdown-container">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition border ${pathname === '/my-bookings' || pathname.startsWith('/admin')
                      ? 'bg-[#1D4E89] text-white border-[#1D4E89]'
                      : isSolid
                        ? 'border-[#ECECEC] text-[#0F2D52] hover:bg-[#F5F7FA]'
                        : 'border-white/40 text-white hover:bg-white/10'
                    }`}
                  aria-label="User Account Menu"
                >
                  <User className="w-4 h-4 shrink-0" />
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
                        <div className="font-bold text-[#0F2D52]">{tx(UI.myBookings)}</div>
                        <div className="text-[10px] text-slate-500">{tx(UI.viewBookingHistory)}</div>
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
                        <div className="font-bold text-[#0F2D52]">{tx(UI.adminCms)}</div>
                        <div className="text-[10px] text-slate-500">{tx(UI.resortManagementPanel)}</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Book Now Button */}
              <Link href="/rooms" className="hidden sm:inline-block">
                <Button variant="primary" size="md" radius="6px">
                  {tx(UI.bookNow2)}
                </Button>
              </Link>

              {/* Mobile Drawer Toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition focus:outline-none md:hidden ${isSolid
                    ? 'bg-[#F5F7FA] text-[#1A1A1A] hover:bg-[#E5E7EB]'
                    : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="w-4 h-4 stroke-[2]" /> : <Menu className="w-4 h-4 stroke-[2]" />}
              </button>
            </div>
          </div>
        )}

        {/* Focused Badge on Checkout Screen */}
        {isCheckout && (
          <div className="text-xs font-semibold text-[#1D4E89] bg-[#F2F7FC] px-3 py-1 rounded-full border border-[#1D4E89]/20">
            {tx(UI.secureCheckout)}
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
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${pathname === '/my-bookings'
                ? 'bg-[#1D4E89]/10 text-[#1D4E89] font-semibold'
                : 'text-[#4B5563] hover:bg-[#F5F7FA]'
                }`}
            >
              <div className="flex items-center gap-2">
                <span>📋</span>
                <span>{tx(UI.myBookings)}</span>
              </div>
            </Link>

            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${pathname.startsWith('/admin')
                ? 'bg-[#1D4E89]/10 text-[#1D4E89] font-semibold'
                : 'text-[#4B5563] hover:bg-[#F5F7FA]'
                }`}
            >
              <div className="flex items-center gap-2">
                <span>🏨</span>
                <span>{tx(UI.adminCms)}</span>
              </div>
            </Link>
          </div>

          <div className="pt-3 border-t border-[#ECECEC]">
            <Link href="/rooms" onClick={() => setMenuOpen(false)}>
              <Button variant="primary" size="lg" fullWidth radius="6px">
                {tx(UI.bookNow)}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
