'use client'

import React, { useState, useRef } from 'react'

const PAGES = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Phòng nghỉ', href: '/rooms' },
  { label: 'Ẩm thực', href: '/dining' },
  { label: 'Khám phá', href: '/explore' },
  { label: 'Đặt phòng', href: '/checkout?room=%2314' },
  { label: 'Liên hệ', href: '/contact' },
]

const DEVICES = [
  { label: 'iPhone SE', w: 375, h: 667, note: 'iPhone SE' },
  { label: 'iPhone 15', w: 390, h: 844, note: 'iPhone 14/15' },
  { label: 'Pro Max', w: 430, h: 932, note: 'iPhone Pro Max' },
  { label: 'Tablet', w: 834, h: 1000, note: 'iPad dọc' },
]

export function MobilePreviewModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [activePageIndex, setActivePageIndex] = useState(0)
  const [activeDeviceIndex, setActiveDeviceIndex] = useState(1)
  const [iframeKey, setIframeKey] = useState(0)

  const iframeRef = useRef<HTMLIFrameElement>(null)

  const currentDevice = DEVICES[activeDeviceIndex]!
  const currentPage = PAGES[activePageIndex]!

  const handleReload = () => {
    setIframeKey((prev) => prev + 1)
  }

  return (
    <>
      {/* Floating Mobile Preview Toggle Icon (Bottom-Right) */}
      <button
        onClick={() => setIsOpen(true)}
        title="Xem bản Mobile Preview"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#0b1b26',
          color: '#ffffff',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: '999px',
          padding: '12px 20px',
          fontSize: '13.5px',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(6,30,46,0.35)',
          transition: 'transform 150ms ease, background 150ms ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)'
          e.currentTarget.style.background = '#0284c7'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.background = '#0b1b26'
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
        <span>Mobile Preview</span>
      </button>

      {/* Mobile Preview Modal Overlay */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(11, 27, 38, 0.86)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflowY: 'auto',
            padding: '30px 20px 60px',
          }}
        >
          {/* Close button top right */}
          <button
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: '20px',
              right: '24px',
              zIndex: 10000,
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
            }}
          >
            ✕
          </button>

          <div style={{ width: '100%', maxWidth: '940px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', marginBottom: '20px', color: '#ffffff' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#00c46a', marginBottom: '6px' }}>
                XEM THỬ MOBILE
              </div>
              <h2 style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                Bản mobile · The Nam Du Hill
              </h2>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5, color: 'rgba(255,255,255,0.72)', maxWidth: '52ch' }}>
                Đúng những gì khách nhìn thấy trên điện thoại. Bấm, cuộn, mở menu, đặt phòng ngay trong khung.
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                fontSize: '13px',
                fontWeight: 700,
                padding: '10px 18px',
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.25)',
                background: 'rgba(255,255,255,0.1)',
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              Thoát bản xem thử
            </button>
          </div>

          {/* Navigation & Device Switchers */}
          <div style={{ width: '100%', maxWidth: '940px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {/* Pages switch */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '999px', padding: '5px' }}>
              {PAGES.map((p, idx) => {
                const on = idx === activePageIndex
                return (
                  <button
                    key={p.label}
                    onClick={() => setActivePageIndex(idx)}
                    style={{
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      padding: '8px 15px',
                      borderRadius: '999px',
                      whiteSpace: 'nowrap',
                      transition: 'all 150ms ease',
                      background: on ? '#0284c7' : 'transparent',
                      color: on ? '#ffffff' : 'rgba(255,255,255,0.75)',
                    }}
                  >
                    {p.label}
                  </button>
                )
              })}
            </div>

            {/* Devices switch */}
            <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '999px', padding: '5px' }}>
              {DEVICES.map((d, idx) => {
                const on = idx === activeDeviceIndex
                return (
                  <button
                    key={d.label}
                    onClick={() => setActiveDeviceIndex(idx)}
                    style={{
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      padding: '8px 14px',
                      borderRadius: '999px',
                      whiteSpace: 'nowrap',
                      transition: 'all 150ms ease',
                      background: on ? '#00c46a' : 'transparent',
                      color: on ? '#04241a' : 'rgba(255,255,255,0.75)',
                    }}
                  >
                    {d.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* iPhone Frame Simulator */}
          <div
            style={{
              position: 'relative',
              borderRadius: '54px',
              padding: '12px',
              background: 'linear-gradient(160deg, #2b3a44 0%, #0f1a21 100%)',
              boxShadow: '0 40px 90px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1) inset',
              transition: 'width 200ms ease, height 200ms ease',
            }}
          >
            {/* Notch / Dynamic Island */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '12px',
                transform: 'translateX(-50%)',
                width: '124px',
                height: '28px',
                borderRadius: '0 0 18px 18px',
                background: '#0f1a21',
                zIndex: 3,
                pointerEvents: 'none',
              }}
            />
            {/* Side hardware buttons */}
            <div style={{ position: 'absolute', right: '-3px', top: '148px', width: '3px', height: '78px', borderRadius: '0 3px 3px 0', background: '#3b4c57' }} />
            <div style={{ position: 'absolute', left: '-3px', top: '122px', width: '3px', height: '46px', borderRadius: '3px 0 0 3px', background: '#3b4c57' }} />
            <div style={{ position: 'absolute', left: '-3px', top: '184px', width: '3px', height: '46px', borderRadius: '3px 0 0 3px', background: '#3b4c57' }} />

            {/* Screen iframe container */}
            <div style={{ borderRadius: '44px', overflow: 'hidden', background: '#ffffff', position: 'relative' }}>
              <iframe
                key={iframeKey}
                ref={iframeRef}
                title="Mobile Preview Frame"
                src={currentPage.href}
                style={{
                  display: 'block',
                  width: `${currentDevice.w}px`,
                  height: `${currentDevice.h}px`,
                  border: 'none',
                  background: '#ffffff',
                  transition: 'width 200ms ease, height 200ms ease',
                }}
              />
            </div>
          </div>

          {/* Footer Info & Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '22px', flexWrap: 'wrap', justifyContent: 'center', color: '#ffffff' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
              {currentDevice.w} × {currentDevice.h} · {currentDevice.note}
            </span>
            <button
              onClick={handleReload}
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#0284c7',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 8px',
              }}
            >
              Tải lại frame
            </button>
            <a
              href={currentPage.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '13px', fontWeight: 700, color: '#00c46a', textDecoration: 'none' }}
            >
              Mở riêng tab mới →
            </a>
          </div>
        </div>
      )}
    </>
  )
}
