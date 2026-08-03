'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '../../context/LanguageContext'

export function MobileStickyCta() {
  const pathname = usePathname()
  const { t } = useLanguage()

  let ctaLabel = t('Khám phá phòng nghỉ', 'Explore rooms')
  let targetHref = '/rooms'

  if (pathname.startsWith('/rooms/')) {
    // Room detail page -> Go to checkout for this room
    const rawRoomCode = pathname.split('/')[2] || ''
    ctaLabel = t('Tiếp tục thanh toán', 'Proceed to Checkout')
    targetHref = `/checkout?room=${encodeURIComponent(rawRoomCode)}`
  } else if (pathname.startsWith('/checkout')) {
    // Checkout page -> MobileStickyCta is KEPT as the main 'Tiếp tục thanh toán' button
    ctaLabel = t('Tiếp tục thanh toán', 'Proceed to Checkout')
    targetHref = '#checkout-next'
  } else if (pathname === '/') {
    ctaLabel = t('Khám phá phòng nghỉ Nam Du', 'Explore Nam Du rooms')
    targetHref = '/rooms'
  } else if (pathname === '/rooms') {
    ctaLabel = t('Tư vấn & Đặt phòng · 0985 000 650', 'Call 0985 000 650')
    targetHref = 'tel:0985000650'
  } else if (pathname.startsWith('/dining')) {
    ctaLabel = t('Đặt bàn & BBQ · 0985 000 650', 'Reserve table & BBQ · 0985 000 650')
    targetHref = 'tel:0985000650'
  } else if (pathname.startsWith('/explore')) {
    ctaLabel = t('Tư vấn tour cano · 0985 000 650', 'Canoe tour advice · 0985 000 650')
    targetHref = 'tel:0985000650'
  }

  const handleCustomClick = (e: React.MouseEvent) => {
    if (targetHref === '#checkout-next') {
      e.preventDefault()
      // Dispatch event or click the step button
      const evt = new CustomEvent('ndh:checkout-next')
      window.dispatchEvent(evt)
    }
  }

  return (
    <aside className="nd-mobile-sticky-bar">
      <div className="nd-mobile-sticky-inner">
        {targetHref.startsWith('tel:') ? (
          <a href={targetHref} className="nd-mobile-cta-btn">
            {ctaLabel}
          </a>
        ) : targetHref.startsWith('#') ? (
          <a href={targetHref} onClick={handleCustomClick} className="nd-mobile-cta-btn">
            {ctaLabel}
          </a>
        ) : (
          <Link href={targetHref} className="nd-mobile-cta-btn">
            {ctaLabel}
          </Link>
        )}
      </div>

      <style jsx global>{`
        /* Mobile Sticky Bottom Bar */
        .nd-mobile-sticky-bar {
          display: none;
        }

        @media (max-width: 640px) {
          .nd-mobile-sticky-bar {
            display: block !important;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 999;
            padding: 6px 12px calc(6px + env(safe-area-inset-bottom, 0px));
            background: rgba(255, 255, 255, 0.96);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-top: 1px solid rgba(0, 0, 0, 0.08);
            box-shadow: 0 -4px 16px rgba(6, 40, 58, 0.08);
            animation: slideUpMobileBar 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .nd-mobile-sticky-inner {
            display: flex;
            align-items: center;
            justify-content: center;
            max-width: 480px;
            margin: 0 auto;
          }

          .nd-mobile-cta-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 40px;
            background: #0284c7;
            color: #ffffff;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 0;
            border-radius: 6px !important;
            border: none !important;
            box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25) !important;
            text-decoration: none;
            transition: opacity 0.15s ease, background 0.15s ease;
          }

          .nd-mobile-cta-btn:active {
            opacity: 0.9;
            background: #0369a1;
          }
        }

        @keyframes slideUpMobileBar {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </aside>
  )
}
