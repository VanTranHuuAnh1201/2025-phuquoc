'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'

export function ContactCtaSection() {
  const { t } = useLanguage()

  return (
    <section id="contact" className="nd-section-container">
      <div
        className="contact-cta-wrapper"
        style={{
          borderRadius: '30px',
          overflow: 'hidden',
          position: 'relative',
          background: '#0b1b26',
          padding: '48px 40px',
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
            pointerEvents: 'none',
          }}
        />

        <div
          className="contact-cta-grid"
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '36px',
            alignItems: 'center',
          }}
        >
          <div>
            <h2 className="nd-h2" style={{ color: '#ffffff', marginBottom: '8px' }}>
              {t('Đặt phòng trực tiếp với chính chủ nhà.', 'Book direct with the people who run the hill.')}
            </h2>

            <p className="nd-lead-p" style={{ color: 'rgba(255,255,255,0.76)', marginBottom: '20px', maxWidth: '520px' }}>
              {t(
                'Cam kết giá tốt nhất, đón tiễn miễn phí, huỷ miễn phí trước 7 ngày, và luôn có người thật nghe máy.',
                'Best rate guaranteed, free pier transfer, free cancellation up to 7 days before arrival, and a real person on the phone.'
              )}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <Link
                href="/rooms"
                style={{
                  background: '#00c46a',
                  color: '#04241a',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  padding: '10px 20px',
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
                  fontSize: '12.5px',
                  fontWeight: 600,
                  padding: '10px 20px',
                  borderRadius: '999px',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                📞 0985 000 650
              </a>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '10px' }}>
            <div
              className="nd-card contact-info-card"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '18px',
                padding: '18px 20px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div className="nd-card-tag" style={{ color: 'rgba(255,255,255,0.50)', marginBottom: '4px' }}>
                {t('ĐỊA CHỈ', 'ADDRESS')}
              </div>
              <div className="nd-card-desc" style={{ color: '#ffffff', lineHeight: 1.45 }}>
                {t(
                  'Ấp Củ Tron, Đặc Khu Kiên Hải, tỉnh An Giang, Việt Nam',
                  'Cu Tron hamlet, Kien Hai Special Zone, An Giang province, Vietnam'
                )}
              </div>
            </div>

            <div
              className="nd-card contact-info-card"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '18px',
                padding: '18px 20px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div className="nd-card-tag" style={{ color: 'rgba(255,255,255,0.50)', marginBottom: '4px' }}>
                {t('CÁCH ĐẾN', 'GETTING HERE')}
              </div>
              <div className="nd-card-desc" style={{ color: '#ffffff', lineHeight: 1.45 }}>
                {t(
                  'Rạch Giá → bến Củ Tron bằng tàu cao tốc (2h15). Chúng tôi đón bạn tại bến.',
                  'Rach Gia → Cu Tron pier by speedboat (2h15). We meet you there.'
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 640px) {
          .contact-cta-wrapper {
            border-radius: 18px !important;
            padding: 20px 14px !important;
          }
          .contact-cta-grid {
            gap: 18px !important;
          }
          .contact-info-card {
            border-radius: 14px !important;
            padding: 14px !important;
          }
        }
      `}</style>
    </section>
  )
}
