'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer style={{ background: '#075985', color: '#ffffff', marginTop: '96px' }}>
      <div
        style={{
          maxWidth: '1320px',
          margin: '0 auto',
          padding: '56px 32px 40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '44px',
        }}
      >
        {/* Column 1: Brand & Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '20px' }}>
            <img
              src="/uploads/OP5-b8f91eaa.png"
              alt="The Nam Du Hill"
              style={{
                width: '44px',
                height: '44px',
                objectFit: 'contain',
                background: '#ffffff',
                borderRadius: '12px',
                padding: '3px',
              }}
            />
            <span style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-0.01em', color: '#ffffff' }}>
              THE NAM DU HILL
            </span>
          </div>

          <div
            style={{
              fontSize: '12.5px',
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.72)',
              marginBottom: '18px',
            }}
          >
            {t(
              'Hộ kinh doanh THE NAM DU HILL · Đăng ký lần đầu 18/10/2021 · MST 1702244746',
              'THE NAM DU HILL business household · Registered 18/10/2021 · Tax ID 1702244746'
            )}
          </div>

          <div style={{ display: 'grid', gap: '11px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ color: '#7dd3fc', fontSize: '13px', lineHeight: 1.5 }}>◆</span>
              <span style={{ fontSize: '13.5px', lineHeight: 1.55, color: 'rgba(255,255,255,0.92)' }}>
                {t(
                  'Ấp Củ Tron, Đặc Khu Kiên Hải, tỉnh An Giang, Việt Nam',
                  'Cu Tron hamlet, Kien Hai Special Zone, An Giang province, Vietnam'
                )}
              </span>
            </div>
            <a
              href="mailto:thenamduhill@gmail.com"
              style={{
                fontSize: '13.5px',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.92)',
                textDecoration: 'none',
              }}
            >
              thenamduhill@gmail.com
            </a>
            <a
              href="tel:0985000650"
              style={{
                fontSize: '19px',
                fontWeight: 800,
                letterSpacing: '-0.01em',
                color: '#ffffff',
                textDecoration: 'none',
              }}
            >
              0985 000 650
            </a>
          </div>
        </div>

        {/* Column 2: Information */}
        <div>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.14em',
              color: '#ffffff',
              marginBottom: '8px',
            }}
          >
            {t('THÔNG TIN', 'INFORMATION')}
          </div>
          <div style={{ width: '26px', height: '3px', background: '#fbbf24', borderRadius: '2px', marginBottom: '18px' }} />
          <div style={{ display: 'grid', gap: '11px' }}>
            <a href="#" style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.78)', textDecoration: 'none' }}>
              {t('Chính sách bảo mật', 'Privacy policy')}
            </a>
            <a href="#" style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.78)', textDecoration: 'none' }}>
              {t('Quy định chung', 'General terms')}
            </a>
            <a href="#" style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.78)', textDecoration: 'none' }}>
              {t('Hướng dẫn đặt phòng', 'How to book')}
            </a>
            <a href="#" style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.78)', textDecoration: 'none' }}>
              {t('Hướng dẫn nhận & huỷ phòng', 'Check-in & cancellation')}
            </a>
            <a href="#" style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.78)', textDecoration: 'none' }}>
              {t('Hướng dẫn thanh toán', 'Payment guide')}
            </a>
          </div>
        </div>

        {/* Column 3: Navigation Links */}
        <div>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.14em',
              color: '#ffffff',
              marginBottom: '8px',
            }}
          >
            {t('KHÁM PHÁ', 'EXPLORE')}
          </div>
          <div style={{ width: '26px', height: '3px', background: '#fbbf24', borderRadius: '2px', marginBottom: '18px' }} />
          <div style={{ display: 'grid', gap: '11px' }}>
            <Link href="/rooms" style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.78)', textDecoration: 'none' }}>
              {t('20 hạng phòng', '20 room types')}
            </Link>
            <Link href="/contact" style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.78)', textDecoration: 'none' }}>
              {t('Liên hệ & bản đồ', 'Contact & map')}
            </Link>
            <Link href="/dining" style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.78)', textDecoration: 'none' }}>
              {t('Ẩm thực & BBQ', 'Dining & BBQ')}
            </Link>
            <Link href="/explore" style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.78)', textDecoration: 'none' }}>
              {t('Khám phá Nam Du', 'Explore Nam Du')}
            </Link>
            <Link href="/blog" style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.78)', textDecoration: 'none' }}>
              {t('Cẩm nang kinh nghiệm', 'Resort Journal')}
            </Link>
          </div>
        </div>

        {/* Column 4: Follow & Social */}
        <div>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.14em',
              color: '#ffffff',
              marginBottom: '8px',
            }}
          >
            {t('KẾT NỐI', 'FOLLOW')}
          </div>
          <div style={{ width: '26px', height: '3px', background: '#fbbf24', borderRadius: '2px', marginBottom: '18px' }} />
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <a
              href="https://facebook.com/thenamduhill"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 800,
                color: '#ffffff',
                textDecoration: 'none',
              }}
            >
              f
            </a>
            <a
              href="https://zalo.me/0985000650"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Zalo"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 800,
                color: '#ffffff',
                textDecoration: 'none',
              }}
            >
              Za
            </a>
            <a
              href="https://thenamduhill.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Website"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 800,
                color: '#ffffff',
                textDecoration: 'none',
              }}
            >
              ◍
            </a>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.10)',
              border: '1px solid rgba(255,255,255,0.16)',
              borderRadius: '10px',
              padding: '9px 12px',
            }}
          >
            <span style={{ fontSize: '15px', color: '#38bdf8' }}>✓</span>
            <span style={{ fontSize: '10.5px', fontWeight: 700, lineHeight: 1.35, color: 'rgba(255,255,255,0.86)' }}>
              {t('ĐÃ THÔNG BÁO\nBỘ CÔNG THƯƠNG', 'Registered with the\nMinistry of Industry & Trade')}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.14)' }}>
        <div
          style={{
            maxWidth: '1320px',
            margin: '0 auto',
            padding: '20px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.60)' }}>
            © 2026 The Nam Du Hill · thenamduhill.com
          </span>
          <span style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.60)' }}>
            {t(
              'Giá tốt nhất khi đặt trực tiếp · Đưa đón bến tàu miễn phí · Huỷ miễn phí trước 7 ngày',
              'Best rate when you book direct · Free pier transfer · Free cancellation up to 7 days'
            )}
          </span>
        </div>
      </div>
    </footer>
  )
}
