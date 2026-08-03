'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'
import { ImageSlot } from '../common/ImageSlot'

export function ExploreSection() {
  const { t } = useLanguage()

  return (
    <section id="explore" className="nd-section-container">
      <div
        className="explore-section-header"
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
            {t('21 hòn đảo · 9,12 km²', '21 islands · 9.12 km²')}
          </span>
          <h2 className="nd-h2">
            {t('Bạn không đi xa thế này chỉ để nằm trong phòng.', 'You did not come all this way for the room.')}
          </h2>
        </div>
        <p className="nd-lead-p">
          {t(
            'Sáng nào cũng có tàu gỗ rời bến ngay dưới chân đồi. Lễ tân đặt chỗ giúp từ tối hôm trước — 200.000–400.000₫ mỗi người.',
            'A wooden boat leaves the pier below every morning. Reception books your seat the evening before — 200,000–400,000 VND a head.'
          )}
        </p>
      </div>

      {/* 4 Island Cards Grid */}
      <div
        className="island-cards-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '14px',
          marginBottom: '24px',
        }}
      >
        <Link
          href="/explore"
          className="nd-card nd-card-img-zoom island-card-item"
          style={{
            borderRadius: '22px',
            overflow: 'hidden',
            position: 'relative',
            minHeight: '260px',
            background: '#0a3b4d',
            display: 'flex',
            alignItems: 'flex-end',
            textDecoration: 'none',
          }}
        >
          <ImageSlot id="ndh-island-haibodap" placeholder="Hòn Hai Bờ Đập" style={{ position: 'absolute', inset: 0 }} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 38%, rgba(3,20,32,0.90) 100%)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'relative', padding: '18px', pointerEvents: 'none' }}>
            <span className="nd-card-tag" style={{ color: '#00e07a', display: 'block', marginBottom: '4px' }}>
              {t('MALDIVES THU NHỎ', 'MINI MALDIVES')}
            </span>
            <h3 className="nd-card-title" style={{ color: '#ffffff' }}>
              Hòn Hai Bờ Đập
            </h3>
            <p className="nd-card-desc" style={{ color: 'rgba(255,255,255,0.78)' }}>
              {t('Hai đảo nối nhau bằng dải đá tự nhiên — chỗ lặn ngắm san hô.', 'Two islets joined by a natural stone causeway — the snorkelling stop.')}
            </p>
          </div>
        </Link>

        <Link
          href="/explore"
          className="nd-card nd-card-img-zoom island-card-item"
          style={{
            borderRadius: '22px',
            overflow: 'hidden',
            position: 'relative',
            minHeight: '260px',
            background: '#0a3b4d',
            display: 'flex',
            alignItems: 'flex-end',
            textDecoration: 'none',
          }}
        >
          <ImageSlot id="ndh-island-honmau" placeholder="Hòn Mấu" style={{ position: 'absolute', inset: 0 }} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 38%, rgba(3,20,32,0.90) 100%)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'relative', padding: '18px', pointerEvents: 'none' }}>
            <span className="nd-card-tag" style={{ color: '#00e07a', display: 'block', marginBottom: '4px' }}>
              {t('5 BÃI BIỂN', 'FIVE BEACHES')}
            </span>
            <h3 className="nd-card-title" style={{ color: '#ffffff' }}>
              Hòn Mấu
            </h3>
            <p className="nd-card-desc" style={{ color: 'rgba(255,255,255,0.78)' }}>
              {t('Đầu này cát trắng, đầu kia toàn đá cuội đen bóng.', 'White sand at one end, polished black pebbles at the other.')}
            </p>
          </div>
        </Link>

        <Link
          href="/explore"
          className="nd-card nd-card-img-zoom island-card-item"
          style={{
            borderRadius: '22px',
            overflow: 'hidden',
            position: 'relative',
            minHeight: '260px',
            background: '#0a3b4d',
            display: 'flex',
            alignItems: 'flex-end',
            textDecoration: 'none',
          }}
        >
          <ImageSlot id="ndh-spot-caymen" placeholder="Bãi Cây Mến" style={{ position: 'absolute', inset: 0 }} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 38%, rgba(3,20,32,0.90) 100%)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'relative', padding: '18px', pointerEvents: 'none' }}>
            <span className="nd-card-tag" style={{ color: '#00e07a', display: 'block', marginBottom: '4px' }}>
              {t('4 PHÚT XE MÁY', '4 MIN BY BIKE')}
            </span>
            <h3 className="nd-card-title" style={{ color: '#ffffff' }}>
              Bãi Cây Mến
            </h3>
            <p className="nd-card-desc" style={{ color: 'rgba(255,255,255,0.78)' }}>
              {t('Bãi đẹp nhất đảo, dưới hàng dừa 80 năm tuổi.', 'The prettiest beach on the island, under 80-year-old palms.')}
            </p>
          </div>
        </Link>

        <Link
          href="/explore"
          className="nd-card nd-card-img-zoom island-card-item"
          style={{
            borderRadius: '22px',
            overflow: 'hidden',
            position: 'relative',
            minHeight: '260px',
            background: '#0a3b4d',
            display: 'flex',
            alignItems: 'flex-end',
            textDecoration: 'none',
          }}
        >
          <ImageSlot id="ndh-spot-haidang" placeholder="Hải đăng Nam Du" style={{ position: 'absolute', inset: 0 }} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 38%, rgba(3,20,32,0.90) 100%)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'relative', padding: '18px', pointerEvents: 'none' }}>
            <span className="nd-card-tag" style={{ color: '#00e07a', display: 'block', marginBottom: '4px' }}>
              309 M
            </span>
            <h3 className="nd-card-title" style={{ color: '#ffffff' }}>
              Hải đăng Nam Du
            </h3>
            <p className="nd-card-desc" style={{ color: 'rgba(255,255,255,0.78)' }}>
              {t('Từ trên đỉnh nhìn thấy cả 21 hòn đảo cùng lúc.', 'From the top you see all 21 islands at once.')}
            </p>
          </div>
        </Link>
      </div>

      {/* 3 Itinerary Cards Row */}
      <div
        className="itinerary-cards-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '14px',
        }}
      >
        <Link
          href="/explore"
          className="nd-card itinerary-card-item"
          style={{
            border: '1px solid #e6eef4',
            borderRadius: '22px',
            padding: '20px 22px',
            display: 'flex',
            flexDirection: 'column',
            textDecoration: 'none',
            background: '#ffffff',
          }}
        >
          <span className="nd-card-tag" style={{ color: '#0284c7', display: 'block', marginBottom: '6px' }}>
            {t('LỊCH TRÌNH · 2 NGÀY 1 ĐÊM', 'ITINERARY · 2 DAYS 1 NIGHT')}
          </span>
          <h3 className="nd-card-title" style={{ color: '#0b1b26', marginBottom: '10px' }}>
            {t('Đi cuối tuần: chiều đầu đi tàu ra đảo nhỏ, sáng hôm sau chạy vòng 11 km.', 'Weekend run: island boat on the first afternoon, the 11 km loop on the second morning.')}
          </h3>
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span className="nd-card-price">
              2,1 – 2,8tr
            </span>
            <span className="nd-card-price-unit">
              {t('mỗi khách, trọn gói', 'per person, all in')}
            </span>
          </div>
        </Link>

        <Link
          href="/explore"
          className="nd-card itinerary-card-item"
          style={{
            border: '1px solid #e6eef4',
            borderRadius: '22px',
            padding: '20px 22px',
            display: 'flex',
            flexDirection: 'column',
            textDecoration: 'none',
            background: '#ffffff',
          }}
        >
          <span className="nd-card-tag" style={{ color: '#00a85c', display: 'block', marginBottom: '6px' }}>
            {t('LỊCH TRÌNH · 3 NGÀY 2 ĐÊM', 'ITINERARY · 3 DAYS 2 NIGHTS')}
          </span>
          <h3 className="nd-card-title" style={{ color: '#0b1b26', marginBottom: '10px' }}>
            {t('Đi thong thả: trọn một ngày trên biển qua bốn đảo, thêm hải đăng và đền miếu.', 'The unhurried one: a whole day at sea across four islands, plus the lighthouse and the shrines.')}
          </h3>
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span className="nd-card-price">
              2,8 – 4,0tr
            </span>
            <span className="nd-card-price-unit">
              {t('mỗi khách, trọn gói', 'per person, all in')}
            </span>
          </div>
        </Link>

        <Link
          href="/explore"
          className="nd-card nd-glow-card itinerary-card-item"
          style={{
            borderRadius: '22px',
            padding: '20px 22px',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(150deg, #0284c7 0%, #075985 100%)',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            textDecoration: 'none',
          }}
        >
          <div>
            <span className="nd-card-tag" style={{ color: 'rgba(255,255,255,0.70)', display: 'block', marginBottom: '6px' }}>
              {t('CẨM NANG ĐẦY ĐỦ', 'FULL GUIDE')}
            </span>
            <h3 className="nd-card-title" style={{ color: '#ffffff', marginBottom: '10px' }}>
              {t('Tàu xe, giá cả, mùa đẹp nhất và những thứ cần mang theo.', 'Boats, scooters, prices, the best season and what to bring.')}
            </h3>
          </div>
          <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#ffffff' }}>
            {t('Khám phá Nam Du →', 'Explore Nam Du →')}
          </span>
        </Link>
      </div>

      <style jsx global>{`
        @media (max-width: 640px) {
          .explore-section-header {
            gap: 10px !important;
            margin-bottom: 16px !important;
          }
          .island-cards-grid, .itinerary-cards-grid {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
          .island-card-item {
            min-height: 200px !important;
            border-radius: 16px !important;
          }
          .itinerary-card-item {
            border-radius: 16px !important;
            padding: 14px 16px !important;
          }
        }
      `}</style>
    </section>
  )
}
