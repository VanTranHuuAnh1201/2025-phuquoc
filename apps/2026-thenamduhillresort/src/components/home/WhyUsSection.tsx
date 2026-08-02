'use client'

import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { ImageSlot } from '../common/ImageSlot'

export function WhyUsSection() {
  const { t } = useLanguage()

  return (
    <section style={{ maxWidth: '1320px', margin: '0 auto', padding: '96px 32px 0' }}>
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
            {t('Vì sao là Nam Du Hill', 'Why Nam Du Hill')}
          </span>
          <h2
            style={{
              margin: '14px 0 0',
              fontSize: 'clamp(30px, 3.2vw, 42px)',
              lineHeight: 1.08,
              fontWeight: 800,
              letterSpacing: '-0.032em',
              color: '#0b1b26',
              textWrap: 'balance',
            }}
          >
            {t(
              'Bốn điều bạn không tìm thấy ở nơi nào khác trên đảo.',
              'Four things you will not find elsewhere on the island.'
            )}
          </h2>
        </div>
        <p style={{ margin: '0 0 6px', fontSize: '16px', lineHeight: 1.65, color: '#566e7d' }}>
          {t(
            'Không phải một khách sạn bê nguyên từ đất liền ra đảo. Đây là ngôi nhà trên đồi được dựng quanh vách đá, ngọn gió và ánh sáng của Nam Du.',
            'Not a hotel copied from the mainland. A hilltop house built around the rock, the wind and the light of Nam Du.'
          )}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gridAutoRows: '250px',
          gap: '14px',
        }}
      >
        {/* Card 01 */}
        <div
          style={{
            gridColumn: 'span 2',
            borderRadius: '26px',
            padding: '32px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 55%, #075985 100%)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: '-60px',
              top: '-60px',
              width: '220px',
              height: '220px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.07)',
            }}
          />
          <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.60)' }}>
            01 · TẦM NHÌN
          </span>
          <div>
            <h3
              style={{
                margin: '0 0 10px',
                fontSize: '27px',
                fontWeight: 800,
                letterSpacing: '-0.028em',
                color: '#ffffff',
                lineHeight: 1.14,
              }}
            >
              {t('Ngắm bình minh và hoàng hôn từ một sân hiên', 'Sunrise and sunset from one terrace')}
            </h3>
            <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.55, color: 'rgba(255,255,255,0.78)' }}>
              {t(
                'Ngọn đồi duy nhất ở Củ Tron có tầm nhìn thông cả hướng đông lẫn hướng tây.',
                'The only hill on Cu Tron with an open line of sight both east and west.'
              )}
            </p>
          </div>
        </div>

        {/* Card 02 */}
        <div
          style={{
            borderRadius: '26px',
            padding: '28px',
            background: '#f2f8fc',
            border: '1px solid rgba(2,132,199,0.12)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.15em', color: '#8fa5b3' }}>
            02 · KIẾN TRÚC
          </span>
          <div>
            <h3 style={{ margin: '0 0 8px', fontSize: '21px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0b1b26', lineHeight: 1.18 }}>
              {t('Phòng ngủ trong lòng đá', 'A bedroom inside living rock')}
            </h3>
            <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.52, color: '#566e7d' }}>
              {t(
                'Rock Deluxe #14 giữ nguyên vách đá tự nhiên, giường đặt trên mỏm đá nguyên khối.',
                'Rock Deluxe #14 keeps the natural cliff face; the bed sits on a single boulder.'
              )}
            </p>
          </div>
        </div>

        {/* Card 03 */}
        <div
          style={{
            borderRadius: '26px',
            padding: '28px',
            background: 'linear-gradient(160deg, #00c46a 0%, #059669 100%)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.65)' }}>
            03 · ẨM THỰC
          </span>
          <div>
            <h3 style={{ margin: '0 0 8px', fontSize: '21px', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff', lineHeight: 1.18 }}>
              {t('Hải sản mua thẳng từ thuyền', 'Seafood bought off the boat')}
            </h3>
            <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.52, color: 'rgba(255,255,255,0.86)' }}>
              {t(
                'Gỏi cá trích, cháo cá đập đập, mực nướng sa tế — đánh bắt trong ngày.',
                'Herring salad, crushed-fish porridge, satay grilled squid — landed the same morning.'
              )}
            </p>
          </div>
        </div>

        {/* Card 04 */}
        <div
          style={{
            borderRadius: '26px',
            padding: '28px',
            background: '#0b1b26',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.45)' }}>
            04 · CHỦ NHÀ
          </span>
          <div>
            <h3 style={{ margin: '0 0 8px', fontSize: '21px', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff', lineHeight: 1.18 }}>
              {t('Được chăm, không phải được nhận phòng', 'Looked after, not checked in')}
            </h3>
            <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.52, color: 'rgba(255,255,255,0.62)' }}>
              {t(
                'Đón tiễn miễn phí từ bến tàu Củ Tron, hỗ trợ 24/7, đặt tour cano giúp bạn.',
                'Free private-car transfer from Cu Tron pier, 24/7 support, canoe tours arranged for you.'
              )}
            </p>
          </div>
        </div>

        {/* Pool Feature Card */}
        <div
          style={{
            gridColumn: 'span 2',
            borderRadius: '26px',
            overflow: 'hidden',
            position: 'relative',
            background: '#0a3b4d',
          }}
        >
          <ImageSlot id="ndh-pool" placeholder="Hồ bơi ngoài trời trên đỉnh đồi" style={{ position: 'absolute', inset: 0 }} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(3,20,32,0.80) 100%)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'absolute', left: '30px', bottom: '26px', pointerEvents: 'none' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: '24px', fontWeight: 800, letterSpacing: '-0.024em', color: '#ffffff' }}>
              {t('Hồ bơi ngoài trời trên đỉnh đồi', 'Outdoor pool at the top of the hill')}
            </h3>
            <p style={{ margin: 0, fontSize: '13.5px', color: 'rgba(255,255,255,0.76)' }}>
              {t('Mở 06:00 – 21:00 · Sunset Café & Bar ngay bên cạnh', 'Open 06:00 – 21:00 · Sunset Café & Bar alongside')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
