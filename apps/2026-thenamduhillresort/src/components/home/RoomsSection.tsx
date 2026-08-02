'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'
import { ImageSlot } from '../common/ImageSlot'

export function RoomsSection() {
  const { t } = useLanguage()

  return (
    <section id="rooms" style={{ maxWidth: '1280px', margin: '0 auto', padding: '100px 32px 0' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '40px',
          marginBottom: '34px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ maxWidth: '620px' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#00a85c',
            }}
          >
            {t('20 hạng phòng · 3 hạng độc bản', '20 room types · 3 signatures')}
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
            {t('Những căn phòng dựng quanh thứ vốn đã ở đó.', 'Rooms built around what was already there.')}
          </h2>
        </div>
        <Link
          href="/rooms"
          style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#0284c7',
            whiteSpace: 'nowrap',
            paddingBottom: '6px',
            borderBottom: '2px solid #0284c7',
            textDecoration: 'none',
          }}
        >
          {t('Xem cả 20 hạng phòng →', 'All 20 room types →')}
        </Link>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '18px',
        }}
      >
        {/* Room 14 */}
        <article
          style={{
            borderRadius: '26px',
            overflow: 'hidden',
            background: '#ffffff',
            border: '1px solid #e6eef4',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ position: 'relative', height: '250px', background: '#eef4f8' }}>
            <ImageSlot id="ndh-room-14" placeholder="Rock Deluxe #14" style={{ position: 'absolute', inset: 0 }} />
            <span
              style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                display: 'inline-block',
                whiteSpace: 'nowrap',
                background: 'rgba(11,27,38,0.80)',
                backdropFilter: 'blur(8px)',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.08em',
                padding: '7px 13px',
                borderRadius: '999px',
              }}
            >
              {t('ĐỘC BẢN', 'SIGNATURE')}
            </span>
          </div>
          <div style={{ padding: '24px 24px 26px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <h3 style={{ margin: '0 0 6px', fontSize: '21px', fontWeight: 800, letterSpacing: '-0.022em', color: '#0b1b26' }}>
              Rock Deluxe #14
            </h3>
            <p style={{ margin: '0 0 18px', fontSize: '14px', lineHeight: 1.55, color: '#566e7d' }}>
              {t(
                'Vách đá tự nhiên trong phòng ngủ, phòng tắm trong hang đá, lò sưởi Châu Âu, suối chảy nội khu.',
                'Natural cliff wall in the bedroom, bathroom carved into the cave, European fireplace, stream running through.'
              )}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#3d5462', background: '#f2f8fc', padding: '6px 11px', borderRadius: '8px' }}>
                21 m²
              </span>
              <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#3d5462', background: '#f2f8fc', padding: '6px 11px', borderRadius: '8px' }}>
                {t('2 khách', '2 guests')}
              </span>
              <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#3d5462', background: '#f2f8fc', padding: '6px 11px', borderRadius: '8px' }}>
                {t('Lò sưởi', 'Fireplace')}
              </span>
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: '18px', borderTop: '1px solid #eef4f8' }}>
              <div>
                <span style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0b1b26' }}>
                  1.776.000₫
                </span>
                <span style={{ fontSize: '12.5px', fontWeight: 500, color: '#8fa5b3' }}>{t('/đêm', '/night')}</span>
              </div>
              <Link
                href="/rooms/14"
                style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  padding: '11px 20px',
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
          style={{
            borderRadius: '26px',
            overflow: 'hidden',
            background: '#ffffff',
            border: '1px solid #e6eef4',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ position: 'relative', height: '250px', background: '#eef4f8' }}>
            <ImageSlot id="ndh-room-05" placeholder="Lục Giác Khung Kính #05" style={{ position: 'absolute', inset: 0 }} />
            <span
              style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                display: 'inline-block',
                whiteSpace: 'nowrap',
                background: 'rgba(0,196,106,0.92)',
                backdropFilter: 'blur(8px)',
                color: '#04241a',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.08em',
                padding: '7px 13px',
                borderRadius: '999px',
              }}
            >
              {t('ĐƯỢC ĐẶT NHIỀU', 'POPULAR')}
            </span>
          </div>
          <div style={{ padding: '24px 24px 26px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <h3 style={{ margin: '0 0 6px', fontSize: '21px', fontWeight: 800, letterSpacing: '-0.022em', color: '#0b1b26' }}>
              Lục Giác Khung Kính #05
            </h3>
            <p style={{ margin: '0 0 18px', fontSize: '14px', lineHeight: 1.55, color: '#566e7d' }}>
              {t(
                'Lục giác hai tầng bọc kính — ngắm 360° rừng và biển ngay tại giường.',
                'Two-storey hexagon wrapped in glass — 360° of forest and sea from the bed itself.'
              )}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#3d5462', background: '#f2f8fc', padding: '6px 11px', borderRadius: '8px' }}>
                42 m²
              </span>
              <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#3d5462', background: '#f2f8fc', padding: '6px 11px', borderRadius: '8px' }}>
                {t('2 khách', '2 guests')}
              </span>
              <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#3d5462', background: '#f2f8fc', padding: '6px 11px', borderRadius: '8px' }}>
                {t('Kính 360°', '360° Glass')}
              </span>
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: '18px', borderTop: '1px solid #eef4f8' }}>
              <div>
                <span style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0b1b26' }}>
                  1.546.000₫
                </span>
                <span style={{ fontSize: '12.5px', fontWeight: 500, color: '#8fa5b3' }}>{t('/đêm', '/night')}</span>
              </div>
              <Link
                href="/rooms/05"
                style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  padding: '11px 20px',
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
          style={{
            borderRadius: '26px',
            overflow: 'hidden',
            background: '#ffffff',
            border: '1px solid #e6eef4',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ position: 'relative', height: '250px', background: '#eef4f8' }}>
            <ImageSlot id="ndh-room-07" placeholder="Superior King #07" style={{ position: 'absolute', inset: 0 }} />
          </div>
          <div style={{ padding: '24px 24px 26px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <h3 style={{ margin: '0 0 6px', fontSize: '21px', fontWeight: 800, letterSpacing: '-0.022em', color: '#0b1b26' }}>
              Superior King #07
            </h3>
            <p style={{ margin: '0 0 18px', fontSize: '14px', lineHeight: 1.55, color: '#566e7d' }}>
              {t(
                '53 m² với bồn sục Jacuzzi riêng và bàn trang điểm gỗ mộc hướng thung lũng.',
                '53 m² with a private Jacuzzi and a raw-wood dressing table facing the valley.'
              )}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#3d5462', background: '#f2f8fc', padding: '6px 11px', borderRadius: '8px' }}>
                53 m²
              </span>
              <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#3d5462', background: '#f2f8fc', padding: '6px 11px', borderRadius: '8px' }}>
                {t('3 khách', '3 guests')}
              </span>
              <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#3d5462', background: '#f2f8fc', padding: '6px 11px', borderRadius: '8px' }}>
                Jacuzzi
              </span>
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: '18px', borderTop: '1px solid #eef4f8' }}>
              <div>
                <span style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0b1b26' }}>
                  2.971.000₫
                </span>
                <span style={{ fontSize: '12.5px', fontWeight: 500, color: '#8fa5b3' }}>{t('/đêm', '/night')}</span>
              </div>
              <Link
                href="/rooms/07"
                style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  padding: '11px 20px',
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
    </section>
  )
}
