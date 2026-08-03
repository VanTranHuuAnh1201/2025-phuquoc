'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '../../context/LanguageContext'
import { Home, Bed, Tag, MessageSquare, User } from 'lucide-react'

export function MobileStickyCta() {
  const pathname = usePathname()
  const { t } = useLanguage()

  // Hide global bottom navigation bar on checkout page and room detail page to avoid clutter and covering the room CTA bar
  if (
    pathname === '/checkout' ||
    pathname.startsWith('/checkout') ||
    (pathname.startsWith('/rooms/') && pathname !== '/rooms')
  ) {
    return null
  }

  const tabs = [
    {
      href: '/',
      label: t('Trang chủ', 'Home'),
      icon: Home,
    },
    {
      href: '/rooms',
      label: t('Phòng', 'Rooms'),
      icon: Bed,
    },
    {
      href: '/explore',
      label: t('Ưu đãi', 'Offers'),
      icon: Tag,
    },
    {
      href: '/contact',
      label: t('Đánh giá', 'Reviews'),
      icon: MessageSquare,
    },
    {
      href: '/my-bookings',
      label: t('Đơn hàng', 'My Bookings'),
      icon: User,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#ECECEC] py-2 px-2 flex justify-around items-center md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {tabs.map((tab) => {
        const IconComp = tab.icon
        const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href))
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center justify-center w-full py-0.5 gap-0.5 transition-colors ${
              isActive ? 'text-[#1D4E89] font-semibold' : 'text-[#6B7280] hover:text-[#1A1A1A] font-normal'
            }`}
          >
            <IconComp className={`w-5 h-5 stroke-[1.75] ${isActive ? 'text-[#1D4E89]' : 'text-[#6B7280]'}`} />
            <span className="text-[10px] tracking-tight">{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
