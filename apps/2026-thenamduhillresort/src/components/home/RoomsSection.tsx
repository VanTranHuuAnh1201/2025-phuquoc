'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'
import { ImageSlot } from '../common/ImageSlot'
import { ROOMS } from '../../data/rooms'

export function RoomsSection() {
  const { t, language } = useLanguage()
  const isEn = language === 'en'

  // Seed featured rooms directly from official crawled ROOMS dataset
  const room14 = ROOMS.find((r) => r.code === '#14') || ROOMS[0]
  const room05 = ROOMS.find((r) => r.code === '#05') || ROOMS[1]
  const room07 = ROOMS.find((r) => r.code === '#07') || ROOMS[2]

  return (
    <section id="rooms" className="rooms-section-container nd-section-container">
      <div
        className="rooms-section-header"
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '20px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ maxWidth: '620px' }}>
          <span className="nd-section-subtitle">
            {t('20 hạng phòng · 3 hạng độc bản', '20 room types · 3 signatures')}
          </span>
          <h2 className="nd-h2">
            {t('Những căn phòng dựng quanh thứ vốn đã ở đó.', 'Rooms built around what was already there.')}
          </h2>
        </div>
        <Link href="/rooms" className="nd-link-action">
          {t('Xem cả 20 hạng phòng →', 'All 20 room types →')}
        </Link>
      </div>

      <div
        className="rooms-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Room 14 */}
        <article
          className="nd-card room-card-item"
          style={{
            borderRadius: '22px',
            overflow: 'hidden',
            background: '#ffffff',
            border: '1px solid #e6eef4',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className="room-card-img-wrapper" style={{ position: 'relative', height: '200px', background: '#eef4f8' }}>
            <Link href="/rooms/14" style={{ display: 'block', position: 'absolute', inset: 0 }}>
              <ImageSlot
                id="ndh-room-14"
                src={room14?.images?.[0]}
                placeholder={`${room14?.code ?? '#14'} — ${isEn ? room14?.nameEn : room14?.name}`}
                style={{ position: 'absolute', inset: 0 }}
              />
            </Link>
            <span
              className="nd-card-badge"
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: 'rgba(11,27,38,0.80)',
                backdropFilter: 'blur(8px)',
                color: '#ffffff',
                pointerEvents: 'none',
              }}
            >
              {room14?.tag ? (isEn ? room14.tagEn : room14.tag) : t('ĐỘC BẢN', 'SIGNATURE')}
            </span>
          </div>
          <div className="room-card-body" style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <h3 className="nd-card-title" style={{ color: '#0b1b26' }}>
              <Link href="/rooms/14" style={{ color: 'inherit', textDecoration: 'none' }}>
                {isEn ? room14?.nameEn : room14?.name}
              </Link>
            </h3>
            <p className="nd-card-desc" style={{ color: '#566e7d', marginBottom: '10px' }}>
              {isEn ? room14?.blurbEn : room14?.blurb}
            </p>
            <div className="room-card-amenities" style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#3d5462', background: '#f2f8fc', padding: '3px 7px', borderRadius: '6px' }}>
                {room14?.area} m²
              </span>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#3d5462', background: '#f2f8fc', padding: '3px 7px', borderRadius: '6px' }}>
                {room14?.cap} {t('khách', 'guests')}
              </span>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#3d5462', background: '#f2f8fc', padding: '3px 7px', borderRadius: '6px' }}>
                {isEn ? room14?.viewEn : room14?.view}
              </span>
            </div>
            <div className="room-card-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', marginTop: 'auto', borderTop: '1px solid #eef4f8' }}>
              <div>
                <span className="nd-card-price">
                  1.776.000₫
                </span>
                <span className="nd-card-price-unit">{t('/đêm', '/night')}</span>
              </div>
              <Link
                href="/rooms/14"
                style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  padding: '6px 14px',
                  borderRadius: '999px',
                  textDecoration: 'none',
                }}
              >
                {t('Chi tiết', 'Details')}
              </Link>
            </div>
          </div>
        </article>

        {/* Room 05 */}
        <article
          className="nd-card room-card-item"
          style={{
            borderRadius: '22px',
            overflow: 'hidden',
            background: '#ffffff',
            border: '1px solid #e6eef4',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className="room-card-img-wrapper" style={{ position: 'relative', height: '200px', background: '#eef4f8' }}>
            <Link href="/rooms/05" style={{ display: 'block', position: 'absolute', inset: 0 }}>
              <ImageSlot
                id="ndh-room-05"
                src={room05?.images?.[0]}
                placeholder={`${room05?.code ?? '#05'} — ${isEn ? room05?.nameEn : room05?.name}`}
                style={{ position: 'absolute', inset: 0 }}
              />
            </Link>
            <span
              className="nd-card-badge"
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: 'rgba(0,196,106,0.92)',
                backdropFilter: 'blur(8px)',
                color: '#04241a',
                pointerEvents: 'none',
              }}
            >
              {t('ĐƯỢC ĐẶT NHIỀU', 'POPULAR')}
            </span>
          </div>
          <div className="room-card-body" style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <h3 className="nd-card-title" style={{ color: '#0b1b26' }}>
              <Link href="/rooms/05" style={{ color: 'inherit', textDecoration: 'none' }}>
                Lục Giác Khung Kính #05
              </Link>
            </h3>
            <p className="nd-card-desc" style={{ color: '#566e7d', marginBottom: '10px' }}>
              {t(
                'Lục giác hai tầng bọc kính — ngắm 360° rừng và biển ngay tại giường.',
                'Two-storey hexagon wrapped in glass — 360° of forest and sea from the bed itself.'
              )}
            </p>
            <div className="room-card-amenities" style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#3d5462', background: '#f2f8fc', padding: '3px 7px', borderRadius: '6px' }}>
                42 m²
              </span>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#3d5462', background: '#f2f8fc', padding: '3px 7px', borderRadius: '6px' }}>
                {t('2 khách', '2 guests')}
              </span>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#3d5462', background: '#f2f8fc', padding: '3px 7px', borderRadius: '6px' }}>
                {t('Kính 360°', '360° Glass')}
              </span>
            </div>
            <div className="room-card-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', marginTop: 'auto', borderTop: '1px solid #eef4f8' }}>
              <div>
                <span className="nd-card-price">
                  1.546.000₫
                </span>
                <span className="nd-card-price-unit">{t('/đêm', '/night')}</span>
              </div>
              <Link
                href="/rooms/05"
                style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  padding: '6px 14px',
                  borderRadius: '999px',
                  textDecoration: 'none',
                }}
              >
                {t('Chi tiết', 'Details')}
              </Link>
            </div>
          </div>
        </article>

        {/* Room 07 */}
        <article
          className="nd-card room-card-item"
          style={{
            borderRadius: '22px',
            overflow: 'hidden',
            background: '#ffffff',
            border: '1px solid #e6eef4',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className="room-card-img-wrapper" style={{ position: 'relative', height: '200px', background: '#eef4f8' }}>
            <Link href="/rooms/07" style={{ display: 'block', position: 'absolute', inset: 0 }}>
              <ImageSlot
                id="ndh-room-07"
                src={room07?.images?.[0]}
                placeholder={`${room07?.code ?? '#07'} — ${isEn ? room07?.nameEn : room07?.name}`}
                style={{ position: 'absolute', inset: 0 }}
              />
            </Link>
          </div>
          <div className="room-card-body" style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <h3 className="nd-card-title" style={{ color: '#0b1b26' }}>
              <Link href="/rooms/07" style={{ color: 'inherit', textDecoration: 'none' }}>
                Superior King #07
              </Link>
            </h3>
            <p className="nd-card-desc" style={{ color: '#566e7d', marginBottom: '10px' }}>
              {t(
                '53 m² với bồn sục Jacuzzi riêng và bàn trang điểm gỗ mộc hướng thung lũng.',
                '53 m² with a private Jacuzzi and a raw-wood dressing table facing the valley.'
              )}
            </p>
            <div className="room-card-amenities" style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#3d5462', background: '#f2f8fc', padding: '3px 7px', borderRadius: '6px' }}>
                53 m²
              </span>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#3d5462', background: '#f2f8fc', padding: '3px 7px', borderRadius: '6px' }}>
                {t('3 khách', '3 guests')}
              </span>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#3d5462', background: '#f2f8fc', padding: '3px 7px', borderRadius: '6px' }}>
                Jacuzzi
              </span>
            </div>
            <div className="room-card-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', marginTop: 'auto', borderTop: '1px solid #eef4f8' }}>
              <div>
                <span className="nd-card-price">
                  2.971.000₫
                </span>
                <span className="nd-card-price-unit">{t('/đêm', '/night')}</span>
              </div>
              <Link
                href="/rooms/07"
                style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  padding: '6px 14px',
                  borderRadius: '999px',
                  textDecoration: 'none',
                }}
              >
                {t('Chi tiết', 'Details')}
              </Link>
            </div>
          </div>
        </article>
      </div>

      <style jsx global>{`
        @media (max-width: 640px) {
          .rooms-section-header {
            margin-bottom: 12px !important;
            gap: 6px !important;
          }
          .rooms-section-header h2 {
            font-size: 13.5px !important;
            font-weight: 600 !important;
            line-height: 1.25 !important;
            margin-top: 2px !important;
          }
          .rooms-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .room-card-item {
            border-radius: 16px !important;
          }
          .room-card-img-wrapper {
            height: 155px !important;
          }
          .room-card-body {
            padding: 12px 14px 14px !important;
          }
          .room-card-desc {
            margin-bottom: 8px !important;
          }
          .room-card-amenities {
            margin-bottom: 8px !important;
            gap: 4px !important;
          }
          .room-card-footer {
            padding-top: 8px !important;
            margin-top: 4px !important;
          }
        }
      `}</style>
    </section>
  )
}
