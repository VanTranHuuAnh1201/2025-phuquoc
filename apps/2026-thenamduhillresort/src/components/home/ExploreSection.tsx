'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'
import { ImageSlot } from '../common/ImageSlot'

export function ExploreSection() {
  const { t } = useLanguage()

  return (
    <section id="explore" style={{ maxWidth: '1320px', margin: '0 auto', padding: '100px 32px 0' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '60px',
          alignItems: 'end',
          marginBottom: '30px',
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
            {t('21 hòn đảo · 9,12 km²', '21 islands · 9.12 km²')}
          </span>
          <h2
            style={{
              margin: '14px 0 0',
              fontSize: 'clamp(28px, 3.2vw, 42px)',
              lineHeight: 1.08,
              fontWeight: 800,
              letterSpacing: '-0.032em',
              color: '#0b1b26',
              textWrap: 'balance',
            }}
          >
            {t('Bạn không đi xa thế này chỉ để nằm trong phòng.', 'You did not come all this way for the room.')}
          </h2>
        </div>
        <p style={{ margin: '0 0 6px', fontSize: '16px', lineHeight: 1.65, color: '#566e7d' }}>
          {t(
            'Sáng nào cũng có tàu gỗ rời bến ngay dưới chân đồi. Lễ tân đặt chỗ giúp từ tối hôm trước — 200.000–400.000₫ mỗi người.',
            'A wooden boat leaves the pier below every morning. Reception books your seat the evening before — 200,000–400,000 VND a head.'
          )}
        </p>
      </div>

      {/* 4 Island Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '14px',
          marginBottom: '40px',
        }}
      >
        <article
          style={{
            borderRadius: '24px',
            overflow: 'hidden',
            position: 'relative',
            minHeight: '320px',
            background: '#0a3b4d',
            display: 'flex',
            alignItems: 'flex-end',
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
          <div style={{ position: 'relative', padding: '22px', pointerEvents: 'none' }}>
            <div style={{ fontSize: '10.5px', fontWeight: 800, letterSpacing: '0.12em', color: '#00e07a', marginBottom: '8px' }}>
              {t('MALDIVES THU NHỎ', 'MINI MALDIVES')}
            </div>
            <h3 style={{ margin: '0 0 7px', fontSize: '20px', fontWeight: 800, letterSpacing: '-0.024em', color: '#ffffff' }}>
              Hòn Hai Bờ Đập
            </h3>
            <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: 'rgba(255,255,255,0.78)' }}>
              {t('Hai đảo nối nhau bằng dải đá tự nhiên — chỗ lặn ngắm san hô.', 'Two islets joined by a natural stone causeway — the snorkelling stop.')}
            </p>
          </div>
        </article>

        <article
          style={{
            borderRadius: '24px',
            overflow: 'hidden',
            position: 'relative',
            minHeight: '320px',
            background: '#0a3b4d',
            display: 'flex',
            alignItems: 'flex-end',
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
          <div style={{ position: 'relative', padding: '22px', pointerEvents: 'none' }}>
            <div style={{ fontSize: '10.5px', fontWeight: 800, letterSpacing: '0.12em', color: '#00e07a', marginBottom: '8px' }}>
              {t('5 BÃI BIỂN', 'FIVE BEACHES')}
            </div>
            <h3 style={{ margin: '0 0 7px', fontSize: '20px', fontWeight: 800, letterSpacing: '-0.024em', color: '#ffffff' }}>
              Hòn Mấu
            </h3>
            <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: 'rgba(255,255,255,0.78)' }}>
              {t('Đầu này cát trắng, đầu kia toàn đá cuội đen bóng.', 'White sand at one end, polished black pebbles at the other.')}
            </p>
          </div>
        </article>

        <article
          style={{
            borderRadius: '24px',
            overflow: 'hidden',
            position: 'relative',
            minHeight: '320px',
            background: '#0a3b4d',
            display: 'flex',
            alignItems: 'flex-end',
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
          <div style={{ position: 'relative', padding: '22px', pointerEvents: 'none' }}>
            <div style={{ fontSize: '10.5px', fontWeight: 800, letterSpacing: '0.12em', color: '#00e07a', marginBottom: '8px' }}>
              {t('4 PHÚT XE MÁY', '4 MIN BY BIKE')}
            </div>
            <h3 style={{ margin: '0 0 7px', fontSize: '20px', fontWeight: 800, letterSpacing: '-0.024em', color: '#ffffff' }}>
              Bãi Cây Mến
            </h3>
            <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: 'rgba(255,255,255,0.78)' }}>
              {t('Bãi đẹp nhất đảo, dưới hàng dừa 80 năm tuổi.', 'The prettiest beach on the island, under 80-year-old palms.')}
            </p>
          </div>
        </article>

        <article
          style={{
            borderRadius: '24px',
            overflow: 'hidden',
            position: 'relative',
            minHeight: '320px',
            background: '#0a3b4d',
            display: 'flex',
            alignItems: 'flex-end',
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
          <div style={{ position: 'relative', padding: '22px', pointerEvents: 'none' }}>
            <div style={{ fontSize: '10.5px', fontWeight: 800, letterSpacing: '0.12em', color: '#00e07a', marginBottom: '8px' }}>
              309 M
            </div>
            <h3 style={{ margin: '0 0 7px', fontSize: '20px', fontWeight: 800, letterSpacing: '-0.024em', color: '#ffffff' }}>
              Hải đăng Nam Du
            </h3>
            <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: 'rgba(255,255,255,0.78)' }}>
              {t('Từ trên đỉnh nhìn thấy cả 21 hòn đảo cùng lúc.', 'From the top you see all 21 islands at once.')}
            </p>
          </div>
        </article>
      </div>

      {/* 3 Itinerary Cards Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        <Link
          href="/explore"
          style={{
            border: '1px solid #e6eef4',
            borderRadius: '24px',
            padding: '28px 30px',
            display: 'flex',
            flexDirection: 'column',
            textDecoration: 'none',
          }}
        >
          <div style={{ fontSize: '10.5px', fontWeight: 800, letterSpacing: '0.14em', color: '#0284c7', marginBottom: '12px' }}>
            {t('LỊCH TRÌNH · 2 NGÀY 1 ĐÊM', 'ITINERARY · 2 DAYS 1 NIGHT')}
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.022em', color: '#0b1b26', lineHeight: 1.32, marginBottom: '14px' }}>
            {t('Đi cuối tuần: chiều đầu đi tàu ra đảo nhỏ, sáng hôm sau chạy vòng 11 km.', 'Weekend run: island boat on the first afternoon, the 11 km loop on the second morning.')}
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '-0.03em', color: '#0b1b26' }}>
              2,1 – 2,8tr
            </span>
            <span style={{ fontSize: '12.5px', fontWeight: 500, color: '#8fa5b3' }}>
              {t('mỗi khách, trọn gói', 'per person, all in')}
            </span>
          </div>
        </Link>

        <Link
          href="/explore"
          style={{
            border: '1px solid #e6eef4',
            borderRadius: '24px',
            padding: '28px 30px',
            display: 'flex',
            flexDirection: 'column',
            textDecoration: 'none',
          }}
        >
          <div style={{ fontSize: '10.5px', fontWeight: 800, letterSpacing: '0.14em', color: '#00a85c', marginBottom: '12px' }}>
            {t('LỊCH TRÌNH · 3 NGÀY 2 ĐÊM', 'ITINERARY · 3 DAYS 2 NIGHTS')}
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.022em', color: '#0b1b26', lineHeight: 1.32, marginBottom: '14px' }}>
            {t('Đi thong thả: trọn một ngày trên biển qua bốn đảo, thêm hải đăng và đền miếu.', 'The unhurried one: a whole day at sea across four islands, plus the lighthouse and the shrines.')}
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '-0.03em', color: '#0b1b26' }}>
              2,8 – 4,0tr
            </span>
            <span style={{ fontSize: '12.5px', fontWeight: 500, color: '#8fa5b3' }}>
              {t('mỗi khách, trọn gói', 'per person, all in')}
            </span>
          </div>
        </Link>

        <Link
          href="/explore"
          style={{
            borderRadius: '24px',
            padding: '28px 30px',
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
            <div style={{ fontSize: '10.5px', fontWeight: 800, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.60)', marginBottom: '12px' }}>
              {t('Cẩm nang đầy đủ', 'Full guide')}
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.022em', lineHeight: 1.32 }}>
              {t('Tàu xe, giá cả, mùa đẹp nhất và những thứ cần mang theo.', 'Boats, scooters, prices, the best season and what to bring.')}
            </div>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
            {t('Khám phá Nam Du →', 'Explore Nam Du →')}
          </span>
        </Link>
      </div>
    </section>
  )
}
