'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'

export function ContactCtaSection() {
  const { t } = useLanguage()

  return (
    <section id="contact" style={{ maxWidth: '1280px', margin: '100px auto 0', padding: '0 32px' }}>
      <div
        style={{
          borderRadius: '34px',
          overflow: 'hidden',
          position: 'relative',
          background: '#0b1b26',
          padding: '74px 56px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: '-120px',
            top: '-120px',
            width: '460px',
            height: '460px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(2,132,199,0.45) 0%, rgba(2,132,199,0) 68%)',
          }}
        />

        <div
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '64px',
            alignItems: 'center',
          }}
        >
          <div>
            <h2
              style={{
                margin: '0 0 16px',
                fontSize: 'clamp(32px, 3.8vw, 44px)',
                lineHeight: 1.06,
                fontWeight: 800,
                letterSpacing: '-0.034em',
                color: '#ffffff',
                textWrap: 'balance',
              }}
            >
              {t('Đặt phòng trực tiếp với chính chủ nhà.', 'Book direct with the people who run the hill.')}
            </h2>

            <p
              style={{
                margin: '0 0 30px',
                fontSize: '16.5px',
                lineHeight: 1.6,
                color: 'rgba(255,255,255,0.68)',
                maxWidth: '520px',
              }}
            >
              {t(
                'Cam kết giá tốt nhất, đón tiễn miễn phí, huỷ miễn phí trước 7 ngày, và luôn có người thật nghe máy.',
                'Best rate guaranteed, free pier transfer, free cancellation up to 7 days before arrival, and a real person on the phone.'
              )}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                href="/rooms"
                className="nd-btn-primary"
                style={{
                  background: '#00c46a',
                  color: '#04241a',
                  fontSize: '15px',
                  fontWeight: 800,
                  padding: '17px 32px',
                  borderRadius: '999px',
                  textDecoration: 'none',
                }}
              >
                {t('Xem phòng & giá', 'See rooms & prices')}
              </Link>
              <a
                href="tel:0985000650"
                className="nd-interactive-pill"
                style={{
                  border: '1px solid rgba(255,255,255,0.28)',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: 600,
                  padding: '17px 30px',
                  borderRadius: '999px',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                📞 0985 000 650
              </a>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            <div
              className="nd-card"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '20px',
                padding: '22px 24px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.50)',
                  marginBottom: '7px',
                }}
              >
                {t('Địa chỉ', 'Address')}
              </div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', lineHeight: 1.5 }}>
                {t(
                  'Ấp Củ Tron, Đặc Khu Kiên Hải,\ntỉnh An Giang, Việt Nam',
                  'Cu Tron hamlet, Kien Hai Special Zone,\nAn Giang province, Vietnam'
                )}
              </div>
            </div>

            <div
              className="nd-card"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '20px',
                padding: '22px 24px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.50)',
                  marginBottom: '7px',
                }}
              >
                {t('Cách đến', 'Getting here')}
              </div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', lineHeight: 1.5 }}>
                {t(
                  'Rạch Giá → bến Củ Tron bằng tàu cao tốc (2h15). Chúng tôi đón bạn tại bến.',
                  'Rach Gia → Cu Tron pier by speedboat (2h15). We meet you there.'
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
