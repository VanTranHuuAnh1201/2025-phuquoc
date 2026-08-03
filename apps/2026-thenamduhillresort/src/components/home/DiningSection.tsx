'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'
import { ImageSlot } from '../common/ImageSlot'

export function DiningSection() {
  const { t } = useLanguage()

  return (
    <section id="dining" style={{ maxWidth: '1280px', margin: '0 auto', padding: '100px 32px 0' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '60px',
          alignItems: 'end',
          marginBottom: '34px',
        }}
      >
        <div>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#00a85c',
            }}
          >
            {t('Ẩm thực', 'Dining')}
          </span>
          <h2
            style={{
              margin: '14px 0 0',
              fontSize: '42px',
              lineHeight: 1.08,
              fontWeight: 800,
              letterSpacing: '-0.032em',
              color: '#0b1b26',
              textWrap: 'balance',
            }}
          >
            {t('Mua ở bến sáng nay. Lên bàn bạn tối nay.', 'Bought at the pier in the morning. On your table by evening.')}
          </h2>
        </div>
        <div style={{ margin: '0 0 6px' }}>
          <p style={{ margin: '0 0 14px', fontSize: '16px', lineHeight: 1.65, color: '#566e7d' }}>
            {t(
              'Không hàng đông lạnh, không nhà cung cấp từ đất liền. Bếp mua trực tiếp từ những chiếc thuyền cập bến dưới chân đồi.',
              'No frozen stock, no mainland supplier. The kitchen buys from the boats that dock below the hill.'
            )}
          </p>
          <Link
            href="/dining"
            style={{
              fontSize: '14px',
              fontWeight: 700,
              color: '#0284c7',
              paddingBottom: '5px',
              borderBottom: '2px solid #0284c7',
              textDecoration: 'none',
            }}
          >
            {t('Xem menu đầy đủ — cà phê, trà & BBQ →', 'Full menu — coffee, tea & BBQ →')}
          </Link>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gridAutoRows: '220px',
          gap: '14px',
        }}
      >
        {/* Large Feature Card: BBQ */}
        <div
          className="nd-card nd-card-img-zoom"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2',
            borderRadius: '26px',
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
          <div style={{ position: 'absolute', left: '32px', right: '32px', bottom: '30px', pointerEvents: 'none' }}>
            <h3
              style={{
                margin: '0 0 8px',
                fontSize: '30px',
                fontWeight: 800,
                letterSpacing: '-0.028em',
                color: '#ffffff',
                lineHeight: 1.12,
              }}
            >
              {t('BBQ hải sản ngoài trời dưới trời sao', 'Outdoor seafood BBQ under the stars')}
            </h3>
            <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.80)' }}>
              {t('Mỗi tối từ 18:30 · đặt tại lễ tân trong ngày', 'Every evening from 18:30 · booked at reception the same day')}
            </p>
          </div>
        </div>

        {/* Gỏi cá trích */}
        <div className="nd-card nd-card-img-zoom" style={{ borderRadius: '26px', overflow: 'hidden', position: 'relative', background: '#eef4f8', cursor: 'pointer' }}>
          <ImageSlot id="ndh-goica" placeholder="Gỏi cá trích" style={{ position: 'absolute', inset: 0 }} />
          <div
            style={{
              position: 'absolute',
              inset: 'auto 0 0 0',
              padding: '18px',
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(11,27,38,0.82) 100%)',
              pointerEvents: 'none',
            }}
          >
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>Gỏi cá trích</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.74)' }}>
              {t('Cá trích, dừa nạo & rau rừng', 'Herring salad, coconut & wild herbs')}
            </div>
          </div>
        </div>

        {/* Sunset Café & Bar */}
        <div
          className="nd-card"
          style={{
            borderRadius: '26px',
            padding: '26px',
            background: '#0b1b26',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '30px', fontWeight: 900, color: '#00c46a', letterSpacing: '-0.03em', lineHeight: 1 }}>
            06:00
          </span>
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: '17px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.018em' }}>
              Sunset Café & Bar
            </h3>
            <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.5, color: 'rgba(255,255,255,0.62)' }}>
              {t('Cà phê từ 6h, cocktail đến khuya — trên boong cao nhất.', 'Coffee from six, cocktails until late — on the highest deck.')}
            </p>
          </div>
        </div>

        {/* Lẩu hải sản */}
        <div className="nd-card nd-card-img-zoom" style={{ borderRadius: '26px', overflow: 'hidden', position: 'relative', background: '#eef4f8', cursor: 'pointer' }}>
          <ImageSlot id="ndh-lau" placeholder="Lẩu hải sản chua cay" style={{ position: 'absolute', inset: 0 }} />
          <div
            style={{
              position: 'absolute',
              inset: 'auto 0 0 0',
              padding: '18px',
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(11,27,38,0.82) 100%)',
              pointerEvents: 'none',
            }}
          >
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>Lẩu hải sản chua cay</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.74)' }}>
              {t('Nồi cho 2–4 người', 'Hot & sour seafood pot, for 2–4')}
            </div>
          </div>
        </div>

        {/* Mực nướng sa tế */}
        <div className="nd-card nd-card-img-zoom" style={{ borderRadius: '26px', overflow: 'hidden', position: 'relative', background: '#eef4f8', cursor: 'pointer' }}>
          <ImageSlot id="ndh-muc" placeholder="Mực nướng sa tế" style={{ position: 'absolute', inset: 0 }} />
          <div
            style={{
              position: 'absolute',
              inset: 'auto 0 0 0',
              padding: '18px',
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(11,27,38,0.82) 100%)',
              pointerEvents: 'none',
            }}
          >
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>Mực nướng sa tế</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.74)' }}>
              {t('Nướng than hoa', 'Satay grilled squid, charcoal')}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
