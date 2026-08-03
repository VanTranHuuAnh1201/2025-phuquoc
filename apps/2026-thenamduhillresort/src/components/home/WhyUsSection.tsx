'use client'

import { useLanguage } from '../../context/LanguageContext'
import { ImageSlot } from '../common/ImageSlot'

export function WhyUsSection() {
  const { t } = useLanguage()

  return (
    <section className="why-us-container nd-section-container" style={{ maxWidth: '1320px', margin: '0 auto', padding: '56px 32px 0' }}>
      <div
        className="why-us-header"
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
            {t('Vì sao là Nam Du Hill', 'Why Nam Du Hill')}
          </span>
          <h2 className="nd-h2">
            {t(
              'Bốn điều bạn không tìm thấy ở nơi nào khác trên đảo.',
              'Four things you will not find elsewhere on the island.'
            )}
          </h2>
        </div>
        <p className="nd-lead-p">
          {t(
            'Không phải một khách sạn bê nguyên từ đất liền ra đảo. Đây là ngôi nhà trên đồi được dựng quanh vách đá, ngọn gió và ánh sáng của Nam Du.',
            'Not a hotel copied from the mainland. A hilltop house built around the rock, the wind and the light of Nam Du.'
          )}
        </p>
      </div>

      <div
        className="why-us-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gridAutoRows: '220px',
          gap: '14px',
        }}
      >
        {/* Card 01 */}
        <div
          className="nd-card nd-glow-card why-card-large"
          style={{
            gridColumn: 'span 2',
            borderRadius: '22px',
            padding: '24px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 55%, #075985 100%)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 12px 32px -8px rgba(2,132,199,0.35)',
            cursor: 'pointer',
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
              background: 'rgba(255,255,255,0.08)',
              animation: 'ndGlowPulse 4s infinite ease-in-out',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="nd-card-tag" style={{ color: 'rgba(255,255,255,0.70)' }}>
              01 · TẦM NHÌN
            </span>
            <span className="nd-card-badge" style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', color: '#ffffff' }}>
              ✦ {t('ĐỘC BẢN CỦ TRON', 'UNIQUE SPOT')}
            </span>
          </div>
          <div>
            <h3 className="nd-card-title" style={{ color: '#ffffff' }}>
              {t('Ngắm bình minh và hoàng hôn từ một sân hiên', 'Sunrise and sunset from one terrace')}
            </h3>
            <p className="nd-card-desc" style={{ color: 'rgba(255,255,255,0.84)' }}>
              {t(
                'Ngọn đồi duy nhất ở Củ Tron có tầm nhìn thông cả hướng đông lẫn hướng tây.',
                'The only hill on Cu Tron with an open line of sight both east and west.'
              )}
            </p>
          </div>
        </div>

        {/* Card 02 */}
        <div
          className="nd-card"
          style={{
            borderRadius: '26px',
            padding: '24px 26px',
            background: '#ffffff',
            border: '1px solid rgba(2,132,199,0.14)',
            boxShadow: '0 4px 20px rgba(6,40,58,0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="nd-card-tag" style={{ color: '#8fa5b3' }}>
              02 · KIẾN TRÚC
            </span>
            <span className="nd-card-badge" style={{ color: '#0284c7', background: '#f0f9ff' }}>
              Rock Deluxe #14
            </span>
          </div>
          <div>
            <h3 className="nd-card-title" style={{ color: '#0b1b26' }}>
              {t('Phòng ngủ trong lòng đá', 'A bedroom inside living rock')}
            </h3>
            <p className="nd-card-desc" style={{ color: '#566e7d' }}>
              {t(
                'Rock Deluxe #14 giữ nguyên vách đá tự nhiên, giường đặt trên mỏm đá nguyên khối.',
                'Rock Deluxe #14 keeps the natural cliff face; the bed sits on a single boulder.'
              )}
            </p>
          </div>
        </div>

        {/* Card 03 */}
        <div
          className="nd-card"
          style={{
            borderRadius: '26px',
            padding: '24px 26px',
            background: 'linear-gradient(160deg, #00c46a 0%, #059669 100%)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 8px 24px -6px rgba(0,196,106,0.3)',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="nd-card-tag" style={{ color: 'rgba(255,255,255,0.75)' }}>
              03 · ẨM THỰC
            </span>
            <span className="nd-card-badge" style={{ color: '#04241a', background: 'rgba(255,255,255,0.9)' }}>
              {t('TƯƠI SỐNG', 'FRESH DAILY')}
            </span>
          </div>
          <div>
            <h3 className="nd-card-title" style={{ color: '#ffffff' }}>
              {t('Hải sản mua thẳng từ thuyền', 'Seafood bought off the boat')}
            </h3>
            <p className="nd-card-desc" style={{ color: 'rgba(255,255,255,0.88)' }}>
              {t(
                'Gỏi cá trích, cháo cá đập đập, mực nướng sa tế — đánh bắt trong ngày.',
                'Herring salad, crushed-fish porridge, satay grilled squid — landed the same morning.'
              )}
            </p>
          </div>
        </div>

        {/* Card 04 */}
        <div
          className="nd-card"
          style={{
            borderRadius: '26px',
            padding: '24px 26px',
            background: '#0b1b26',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 10px 28px -6px rgba(11,27,38,0.4)',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="nd-card-tag" style={{ color: 'rgba(255,255,255,0.50)' }}>
              04 · CHỦ NHÀ
            </span>
            <span className="nd-card-badge" style={{ color: '#00c46a', background: 'rgba(0,196,106,0.14)' }}>
              <span className="nd-pulse-dot" style={{ color: '#00c46a', width: '5px', height: '5px', borderRadius: '50%', background: '#00c46a', marginRight: '5px' }} />
              24/7
            </span>
          </div>
          <div>
            <h3 className="nd-card-title" style={{ color: '#ffffff' }}>
              {t('Được chăm, không phải được nhận phòng', 'Looked after, not checked in')}
            </h3>
            <p className="nd-card-desc" style={{ color: 'rgba(255,255,255,0.68)' }}>
              {t(
                'Đón tiễn miễn phí từ bến tàu Củ Tron, hỗ trợ 24/7, đặt tour cano giúp bạn.',
                'Free private-car transfer from Cu Tron pier, 24/7 support, canoe tours arranged for you.'
              )}
            </p>
          </div>
        </div>

        {/* Pool Feature Card */}
        <div
          className="nd-card nd-card-img-zoom"
          style={{
            gridColumn: 'span 3',
            borderRadius: '26px',
            overflow: 'hidden',
            position: 'relative',
            background: '#0a3b4d',
            boxShadow: '0 12px 32px -8px rgba(6,40,58,0.25)',
            cursor: 'pointer',
          }}
        >
          <ImageSlot id="ndh-pool" placeholder="Hồ bơi ngoài trời trên đỉnh đồi" style={{ position: 'absolute', inset: 0 }} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(3,20,32,0.85) 100%)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'absolute', top: '24px', left: '26px', pointerEvents: 'none' }}>
            <span className="nd-card-badge" style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', color: '#0b1b26', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00c46a', display: 'inline-block' }} />
              {t('HỒ BƠI VÔ CỰC', 'INFINITY POOL')}
            </span>
          </div>
          <div style={{ position: 'absolute', left: '26px', bottom: '22px', pointerEvents: 'none' }}>
            <h3 className="nd-card-title" style={{ color: '#ffffff' }}>
              {t('Hồ bơi ngoài trời trên đỉnh đồi', 'Outdoor pool at the top of the hill')}
            </h3>
            <p className="nd-card-desc" style={{ color: 'rgba(255,255,255,0.82)' }}>
              {t('Mở 06:00 – 21:00 · Sunset Café & Bar ngay bên cạnh', 'Open 06:00 – 21:00 · Sunset Café & Bar alongside')}
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 640px) {
          .why-us-container {
            padding-top: 24px !important;
            padding-left: 12px !important;
            padding-right: 12px !important;
          }
          .why-us-header {
            gap: 6px !important;
            margin-bottom: 14px !important;
          }
          .why-us-header h2 {
            font-size: 15px !important;
            font-weight: 600 !important;
            line-height: 1.25 !important;
          }
          .why-us-grid {
            grid-template-columns: 1fr !important;
            grid-auto-rows: auto !important;
            gap: 10px !important;
          }
          .why-us-grid > div {
            grid-column: span 1 !important;
            padding: 16px 14px !important;
            min-height: 125px !important;
            border-radius: 16px !important;
          }
          }
        }
      `}</style>
    </section>
  )
}

