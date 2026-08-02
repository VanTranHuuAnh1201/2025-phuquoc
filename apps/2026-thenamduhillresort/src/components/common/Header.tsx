'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '../../context/LanguageContext'

interface HeaderProps {
  forceSolid?: boolean
}

export function Header({ forceSolid = false }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage()
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [favCount, setFavCount] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const updateFavs = () => {
      try {
        const stored = localStorage.getItem('ndh:saved-rooms')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed)) setFavCount(parsed.length)
        }
      } catch (e) {
        // ignore
      }
    }
    updateFavs()
    window.addEventListener('storage', updateFavs)
    const interval = setInterval(updateFavs, 1000)
    return () => {
      window.removeEventListener('storage', updateFavs)
      clearInterval(interval)
    }
  }, [])

  const isSolid = forceSolid || !isHomePage || scrolled

  const brandColor = isSolid ? '#0b1b26' : '#ffffff'
  const brandSubColor = isSolid ? '#0284c7' : 'rgba(255,255,255,0.72)'
  const navLinkColor = isSolid ? '#3d5462' : 'rgba(255,255,255,0.90)'
  const headerBg = isSolid ? 'rgba(255, 255, 255, 0.94)' : 'transparent'
  const headerBorder = isSolid
    ? '1px solid rgba(2, 132, 199, 0.10)'
    : '1px solid rgba(255, 255, 255, 0.14)'
  const headerShadow = isSolid ? '0 4px 20px rgba(6, 40, 58, 0.06)' : 'none'
  const langBoxBg = isSolid ? '#eef6fb' : 'rgba(255,255,255,0.18)'

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: headerBg,
        backdropFilter: isSolid ? 'blur(18px)' : 'none',
        borderBottom: headerBorder,
        boxShadow: headerShadow,
        transition: 'background 200ms ease, border-color 200ms ease, box-shadow 200ms ease',
      }}
    >
      <div
        className="nd-header-container"
        style={{
          maxWidth: '1320px',
          margin: '0 auto',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        {/* Brand Logo & Title */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexShrink: 0,
            textDecoration: 'none',
          }}
        >
          <img
            src="/uploads/OP5-b8f91eaa.png"
            alt="The Nam Du Hill"
            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
          />
          <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span
              style={{
                fontSize: '14.5px',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: brandColor,
                transition: 'color 200ms ease',
              }}
            >
              THE NAM DU HILL
            </span>
            <span
              style={{
                fontSize: '9.5px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: brandSubColor,
                transition: 'color 200ms ease',
              }}
            >
              HILLTOP BOUTIQUE RESORT
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '22px',
            marginLeft: 'auto',
            flexWrap: 'nowrap',
          }}
        >
          <Link
            href="/rooms"
            style={{
              fontSize: '14px',
              fontWeight: pathname === '/rooms' ? 700 : 600,
              color: pathname === '/rooms' ? '#0284c7' : navLinkColor,
              whiteSpace: 'nowrap',
              textDecoration: 'none',
              transition: 'color 200ms ease',
            }}
          >
            {t('Phòng nghỉ', 'Rooms')}
          </Link>
          <Link
            href="/dining"
            style={{
              fontSize: '14px',
              fontWeight: pathname === '/dining' ? 700 : 600,
              color: pathname === '/dining' ? '#0284c7' : navLinkColor,
              whiteSpace: 'nowrap',
              textDecoration: 'none',
              transition: 'color 200ms ease',
            }}
          >
            {t('Ẩm thực', 'Dining')}
          </Link>
          <Link
            href="/explore"
            style={{
              fontSize: '14px',
              fontWeight: pathname === '/explore' ? 700 : 600,
              color: pathname === '/explore' ? '#0284c7' : navLinkColor,
              whiteSpace: 'nowrap',
              textDecoration: 'none',
              transition: 'color 200ms ease',
            }}
          >
            {t('Khám phá Nam Du', 'Explore Nam Du')}
          </Link>
          <Link
            href="/contact"
            style={{
              fontSize: '14px',
              fontWeight: pathname === '/contact' ? 700 : 600,
              color: pathname === '/contact' ? '#0284c7' : navLinkColor,
              whiteSpace: 'nowrap',
              textDecoration: 'none',
              transition: 'color 200ms ease',
            }}
          >
            {t('Liên hệ', 'Contact')}
          </Link>
        </nav>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Mở menu"
          className="mobile-menu-btn"
          style={{
            display: 'none',
            marginLeft: 'auto',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            border: isSolid ? '1px solid #dbe7ef' : '1px solid rgba(255,255,255,0.28)',
            background: isSolid ? '#ffffff' : 'rgba(255,255,255,0.14)',
            color: isSolid ? '#0b1b26' : '#ffffff',
            fontSize: '17px',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        {/* Language Switcher & Book Now CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          {favCount > 0 && (
            <Link
              href="/rooms"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid #dbe7ef',
                background: '#ffffff',
                color: '#0b1b26',
                padding: '6px 12px',
                borderRadius: '999px',
                fontSize: '12.5px',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <span>♥</span>
              <span>{favCount}</span>
            </Link>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: langBoxBg,
              borderRadius: '999px',
              padding: '3px',
              transition: 'background 200ms ease',
            }}
          >
            <button
              onClick={() => setLanguage('vi')}
              style={{
                border: 'none',
                background: language === 'vi' ? '#ffffff' : 'transparent',
                color: language === 'vi' ? '#0b1b26' : '#6b8394',
                fontSize: '12px',
                fontWeight: 700,
                padding: '5px 12px',
                borderRadius: '999px',
                cursor: 'pointer',
                boxShadow: language === 'vi' ? '0 1px 3px rgba(0,0,0,0.10)' : 'none',
              }}
            >
              VI
            </button>
            <button
              onClick={() => setLanguage('en')}
              style={{
                border: 'none',
                background: language === 'en' ? '#ffffff' : 'transparent',
                color: language === 'en' ? '#0b1b26' : '#6b8394',
                fontSize: '12px',
                fontWeight: 700,
                padding: '5px 12px',
                borderRadius: '999px',
                cursor: 'pointer',
                boxShadow: language === 'en' ? '0 1px 3px rgba(0,0,0,0.10)' : 'none',
              }}
            >
              EN
            </button>
          </div>

          <Link
            href="/rooms"
            style={{
              background: '#0284c7',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              padding: '11px 20px',
              borderRadius: '999px',
              boxShadow: '0 6px 18px rgba(2,132,199,0.30)',
              whiteSpace: 'nowrap',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            {t('Đặt phòng', 'Book a room')}
          </Link>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div
          style={{
            borderTop: '1px solid rgba(2,132,199,0.10)',
            background: '#ffffff',
            padding: '12px 32px 18px',
          }}
        >
          <div
            style={{
              maxWidth: '1320px',
              margin: '0 auto',
              display: 'grid',
              gap: '2px',
            }}
          >
            <Link
              href="/rooms"
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#0b1b26',
                padding: '12px 0',
                borderBottom: '1px solid #eef4f8',
                textDecoration: 'none',
              }}
            >
              {t('Phòng nghỉ', 'Rooms')}
            </Link>
            <Link
              href="/dining"
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#0b1b26',
                padding: '12px 0',
                borderBottom: '1px solid #eef4f8',
                textDecoration: 'none',
              }}
            >
              {t('Ẩm thực', 'Dining')}
            </Link>
            <Link
              href="/explore"
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#0b1b26',
                padding: '12px 0',
                borderBottom: '1px solid #eef4f8',
                textDecoration: 'none',
              }}
            >
              {t('Khám phá Nam Du', 'Explore Nam Du')}
            </Link>
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#0b1b26',
                padding: '12px 0',
                textDecoration: 'none',
              }}
            >
              {t('Liên hệ', 'Contact')}
            </Link>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media (max-width: 900px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
          .nd-header-container {
            padding-top: max(14px, env(safe-area-inset-top, 14px)) !important;
            padding-bottom: 10px !important;
            padding-left: 14px !important;
            padding-right: 14px !important;
          }
        }
      `}</style>
    </header>
  )
}
