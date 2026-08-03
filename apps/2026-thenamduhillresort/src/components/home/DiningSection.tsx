'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'
import { ImageSlot } from '../common/ImageSlot'

export function DiningSection() {
  const { t } = useLanguage()

  return (
    <section id="dining" className="nd-section-container">
      <div
        className="dining-section-header"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          alignItems: 'end',
          marginBottom: '24px',
        }}
      >
        <div>
          <span className="nd-section-subtitle">
            {t('Ẩm thực', 'Dining')}
          </span>
          <h2 className="nd-h2">
            {t('Mua ở bến sáng nay. Lên bàn bạn tối nay.', 'Bought at the pier in the morning. On your table by evening.')}
          </h2>
        </div>
        <div style={{ margin: '0 0 2px' }}>
          <p className="nd-lead-p" style={{ marginBottom: '8px' }}>
            {t(
              'Không hàng đông lạnh, không nhà cung cấp từ đất liền. Bếp mua trực tiếp từ những chiếc thuyền cập bến dưới chân đồi.',
              'No frozen stock, no mainland supplier. The kitchen buys from the boats that dock below the hill.'
            )}
          </p>
          <Link href="/dining" className="nd-link-action">
            {t('Xem menu đầy đủ — cà phê, trà & BBQ →', 'Full menu — coffee, tea & BBQ →')}
          </Link>
        </div>
      </div>

      <div
        className="dining-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gridAutoRows: '220px',
          gap: '14px',
        }}
      >
        {/* Large Feature Card: BBQ */}
        <div
          className="nd-card nd-card-img-zoom dining-card-large"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2',
            borderRadius: '22px',
            overflow: 'hidden',
            position: 'relative',
            background: '#f6ede4',
            cursor: 'pointer',
          }}
        >
          <ImageSlot id="ndh-bbq" placeholder="BBQ hải sản ngoài trời buổi tối" style={{ position: 'absolute', inset: 0 }} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(38,16,4,0.84) 100%)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'absolute', left: '24px', right: '24px', bottom: '24px', pointerEvents: 'none' }}>
            <h3
              className="nd-card-title"
              style={{
                margin: '0 0 4px',
                fontSize: 'clamp(16px, 1.8vw, 22px)',
                color: '#ffffff',
              }}
            >
              {t('BBQ hải sản ngoài trời dưới trời sao', 'Outdoor seafood BBQ under the stars')}
            </h3>
            <p className="nd-card-desc" style={{ color: 'rgba(255,255,255,0.80)' }}>
              {t('Mỗi tối từ 18:30 · đặt tại lễ tân trong ngày', 'Every evening from 18:30 · booked at reception the same day')}
            </p>
          </div>
        </div>

        {/* Gỏi cá trích */}
        <div className="nd-card nd-card-img-zoom" style={{ borderRadius: '22px', overflow: 'hidden', position: 'relative', background: '#eef4f8', cursor: 'pointer' }}>
          <ImageSlot id="ndh-goica" placeholder="Gỏi cá trích" style={{ position: 'absolute', inset: 0 }} />
          <div
            style={{
              position: 'absolute',
              inset: 'auto 0 0 0',
              padding: '14px',
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(11,27,38,0.82) 100%)',
              pointerEvents: 'none',
            }}
          >
            <div className="nd-card-title" style={{ color: '#ffffff' }}>Gỏi cá trích</div>
            <div className="nd-card-desc" style={{ color: 'rgba(255,255,255,0.74)' }}>
              {t('Cá trích, dừa nạo & rau rừng', 'Herring salad, coconut & wild herbs')}
            </div>
          </div>
        </div>

        {/* Sunset Café & Bar */}
        <div
          className="nd-card"
          style={{
            borderRadius: '22px',
            padding: '20px',
            background: '#0b1b26',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '24px', fontWeight: 700, color: '#00c46a', letterSpacing: '-0.02em', lineHeight: 1 }}>
            06:00
          </span>
          <div>
            <h3 className="nd-card-title" style={{ color: '#ffffff' }}>
              Sunset Café & Bar
            </h3>
            <p className="nd-card-desc" style={{ color: 'rgba(255,255,255,0.62)' }}>
              {t('Cà phê từ 6h, cocktail đến khuya — trên boong cao nhất.', 'Coffee from six, cocktails until late — on the highest deck.')}
            </p>
          </div>
        </div>

        {/* Lẩu hải sản */}
        <div className="nd-card nd-card-img-zoom" style={{ borderRadius: '22px', overflow: 'hidden', position: 'relative', background: '#eef4f8', cursor: 'pointer' }}>
          <ImageSlot id="ndh-lau" placeholder="Lẩu hải sản chua cay" style={{ position: 'absolute', inset: 0 }} />
          <div
            style={{
              position: 'absolute',
              inset: 'auto 0 0 0',
              padding: '14px',
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(11,27,38,0.82) 100%)',
              pointerEvents: 'none',
            }}
          >
            <div className="nd-card-title" style={{ color: '#ffffff' }}>Lẩu hải sản chua cay</div>
            <div className="nd-card-desc" style={{ color: 'rgba(255,255,255,0.74)' }}>
              {t('Nồi cho 2–4 người', 'Hot & sour seafood pot, for 2–4')}
            </div>
          </div>
        </div>

        {/* Mực nướng sa tế */}
        <div className="nd-card nd-card-img-zoom" style={{ borderRadius: '22px', overflow: 'hidden', position: 'relative', background: '#eef4f8', cursor: 'pointer' }}>
          <ImageSlot id="ndh-muc" placeholder="Mực nướng sa tế" style={{ position: 'absolute', inset: 0 }} />
          <div
            style={{
              position: 'absolute',
              inset: 'auto 0 0 0',
              padding: '14px',
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(11,27,38,0.82) 100%)',
              pointerEvents: 'none',
            }}
          >
            <div className="nd-card-title" style={{ color: '#ffffff' }}>Mực nướng sa tế</div>
            <div className="nd-card-desc" style={{ color: 'rgba(255,255,255,0.74)' }}>
              {t('Nướng than hoa', 'Satay grilled squid, charcoal')}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 640px) {
          .dining-section-header {
            gap: 10px !important;
            margin-bottom: 16px !important;
          }
          .dining-grid {
            grid-template-columns: 1fr !important;
            grid-auto-rows: auto !important;
            gap: 10px !important;
          }
          .dining-card-large {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
            height: 180px !important;
          }
          .dining-grid > div {
            border-radius: 16px !important;
            min-height: 125px !important;
          }
        }
      `}</style>
    </section>
  )
}
