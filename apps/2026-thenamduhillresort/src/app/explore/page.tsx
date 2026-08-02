'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'
import { ImageSlot } from '../../components/common/ImageSlot'
import { SPOTS, SATELLITE_ISLANDS, TRIPS } from '../../data/explore'

export default function ExplorePage() {
  const { t, language } = useLanguage()
  const isEn = language === 'en'

  const [activeTripKey, setActiveTripKey] = useState<'d2' | 'd3'>('d2')
  const currentTrip = TRIPS[activeTripKey]

  return (
    <main style={{ minHeight: '100vh', background: '#ffffff', color: '#0b1b26' }}>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          minHeight: '66vh',
          display: 'flex',
          alignItems: 'flex-end',
          overflow: 'hidden',
          background: '#06283a',
          paddingTop: '80px',
        }}
      >
        <ImageSlot
          id="ndh-explore-hero"
          placeholder="Vịnh Nam Du"
          style={{ position: 'absolute', inset: 0 }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(3,20,32,0.62) 0%, rgba(3,20,32,0.20) 38%, rgba(3,20,32,0.90) 100%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1320px',
            margin: '0 auto',
            padding: '160px 32px 50px',
            pointerEvents: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00c46a' }} />
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.86)',
              }}
            >
              {t('21 hòn đảo · 9,12 km² · Vịnh Thái Lan', '21 islands · 9.12 km² · Gulf of Thailand')}
            </span>
          </div>
          <h1
            style={{
              margin: '0 0 18px',
              fontSize: 'clamp(34px, 4.6vw, 62px)',
              lineHeight: 1.03,
              fontWeight: 800,
              letterSpacing: '-0.036em',
              color: '#ffffff',
              maxWidth: '19ch',
              textWrap: 'balance',
            }}
          >
            {t(
              'Hai mươi mốt hòn đảo. Bốn ngày không đủ — đây là cách đi trong hai hoặc ba.',
              'Twenty-one islands. Four days is not enough — here is how to spend two or three.'
            )}
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(15px, 1.3vw, 17.5px)',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.84)',
              maxWidth: '60ch',
            }}
          >
            {t(
              'Toàn bộ nội dung dưới đây là những gì khách của chúng tôi thật sự làm. Báo lễ tân, chúng tôi lo tàu, xe và bàn ăn.',
              'Everything below is what our guests actually do. Ask reception and we will arrange the boat, the bike and the table.'
            )}
          </p>
        </div>
      </section>

      {/* Floating Quick Stats Bar */}
      <section style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 32px' }}>
        <div
          style={{
            marginTop: '-40px',
            position: 'relative',
            zIndex: 10,
            background: '#ffffff',
            borderRadius: '24px',
            boxShadow: '0 18px 48px rgba(6,40,58,0.16)',
            border: '1px solid rgba(2,132,199,0.10)',
            padding: '26px 30px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '28px',
          }}
        >
          <div>
            <div style={{ fontSize: '10.5px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8fa5b3', marginBottom: '8px' }}>
              {t('Mùa đẹp nhất', 'Best season')}
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0b1b26' }}>
              {t('Tháng 12 – tháng 3', 'December – March')}
            </div>
            <div style={{ fontSize: '12.5px', color: '#8fa5b3', marginTop: '5px' }}>
              {t('Biển êm, nước trong, ít say sóng', 'Calm sea, clear water, no seasickness')}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '10.5px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8fa5b3', marginBottom: '8px' }}>
              {t('Đỉnh cao nhất', 'Highest point')}
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0b1b26' }}>
              309 m
            </div>
            <div style={{ fontSize: '12.5px', color: '#8fa5b3', marginTop: '5px' }}>
              {t('Hải đăng Nam Du, trên Hòn Lớn', 'Nam Du lighthouse, on Hon Lon')}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '10.5px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8fa5b3', marginBottom: '8px' }}>
              {t('Cách ra đảo', 'Getting here')}
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0b1b26' }}>
              {t('Rạch Giá → 2–3 giờ tàu', 'Rach Gia → 2–3 h by speedboat')}
            </div>
            <div style={{ fontSize: '12.5px', color: '#8fa5b3', marginTop: '5px' }}>
              {t('Chúng tôi đón tại bến Củ Tron, miễn phí', 'We meet you at Cu Tron pier, free')}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '10.5px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8fa5b3', marginBottom: '8px' }}>
              {t('Nhớ mang theo', 'Bring with you')}
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0b1b26' }}>
              {t('CCCD & tiền mặt', 'ID card & cash')}
            </div>
            <div style={{ fontSize: '12.5px', color: '#8fa5b3', marginTop: '5px' }}>
              {t('Kiểm soát vùng biên; ATM rất ít', 'Border-zone checks; ATMs are scarce')}
            </div>
          </div>
        </div>
      </section>

      {/* 6 Spots on Hon Lon ("Trên Hòn Lớn, đảo chính") */}
      <section style={{ maxWidth: '1320px', margin: '0 auto', padding: '80px 32px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '60px', alignItems: 'end', marginBottom: '30px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#00a85c' }}>
              {t('Trên Hòn Lớn, đảo chính', 'On Hon Lon, the main island')}
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
              {t('Mười một cây số đường ven biển, và mọi chỗ đáng dừng lại.', 'Eleven kilometres of coast road, and everything worth stopping for.')}
            </h2>
          </div>
          <p style={{ margin: '0 0 6px', fontSize: '16px', lineHeight: 1.65, color: '#566e7d' }}>
            {t(
              'Thuê xe máy 120.000–150.000₫/ngày. Chạy hết vòng mất một buổi sáng nếu dừng nhiều — và bạn sẽ dừng nhiều.',
              'A rented scooter costs 120,000–150,000 VND a day. The whole loop takes a morning if you stop often — and you will.'
            )}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {SPOTS.map((s) => (
            <article
              key={s.id}
              className="nd-card"
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                background: '#ffffff',
                border: '1px solid #e6eef4',
                display: 'flex',
                flexDirection: 'column',
                transition: 'box-shadow 200ms ease, transform 200ms ease',
              }}
            >
              <div style={{ position: 'relative', height: '196px', background: '#eef4f8' }}>
                <ImageSlot
                  id={`ndh-spot-${s.id}`}
                  placeholder={isEn ? s.nameEn : s.nameVi}
                  style={{ position: 'absolute', inset: 0 }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                    background: 'rgba(255,255,255,0.94)',
                    backdropFilter: 'blur(8px)',
                    color: '#0b1b26',
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    padding: '6px 11px',
                    borderRadius: '999px',
                  }}
                >
                  {isEn ? s.distEn : s.distVi}
                </span>
              </div>
              <div style={{ padding: '20px 22px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0b1b26', lineHeight: 1.24 }}>
                  {isEn ? s.nameEn : s.nameVi}
                </h3>
                <p style={{ margin: '0 0 14px', fontSize: '14px', lineHeight: 1.55, color: '#566e7d' }}>
                  {isEn ? s.textEn : s.textVi}
                </p>
                <div style={{ marginTop: 'auto', fontSize: '12.5px', fontWeight: 700, color: '#0284c7' }}>
                  {isEn ? s.tipEn : s.tipVi}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4 Satellite Islands Section ("Cụm đảo vệ tinh") */}
      <section style={{ maxWidth: '1320px', margin: '0 auto', padding: '80px 32px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '60px', alignItems: 'end', marginBottom: '30px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#00a85c' }}>
              {t('Cụm đảo vệ tinh', 'The satellite islands')}
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
              {t('Một chiếc tàu gỗ, bốn hòn đảo, một ngày dài.', 'A wooden boat, four islands, one long day.')}
            </h2>
          </div>
          <p style={{ margin: '0 0 6px', fontSize: '16px', lineHeight: 1.65, color: '#566e7d' }}>
            {t(
              '200.000–400.000₫/người nếu ghép đoàn, hoặc thuê trọn tàu. Lễ tân đặt giúp từ tối hôm trước.',
              '200,000–400,000 VND per person shared, or charter the whole boat. Reception books it the evening before.'
            )}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          {SATELLITE_ISLANDS.map((i) => (
            <article
              key={i.id}
              className="nd-card"
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                position: 'relative',
                minHeight: '340px',
                background: '#0a3b4d',
                display: 'flex',
                alignItems: 'flex-end',
                transition: 'transform 200ms ease',
              }}
            >
              <ImageSlot
                id={`ndh-island-${i.id}`}
                placeholder={isEn ? i.nameEn : i.nameVi}
                style={{ position: 'absolute', inset: 0 }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0) 38%, rgba(3,20,32,0.90) 100%)',
                  pointerEvents: 'none',
                }}
              />
              <div style={{ position: 'relative', padding: '22px 22px 24px', pointerEvents: 'none' }}>
                <div style={{ fontSize: '10.5px', fontWeight: 800, letterSpacing: '0.12em', color: '#00e07a', marginBottom: '8px' }}>
                  {isEn ? i.badgeEn : i.badgeVi}
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: '21px', fontWeight: 800, letterSpacing: '-0.024em', color: '#ffffff', lineHeight: 1.16 }}>
                  {isEn ? i.nameEn : i.nameVi}
                </h3>
                <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.52, color: 'rgba(255,255,255,0.78)' }}>
                  {isEn ? i.textEn : i.textVi}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Suggested Itineraries & Cost Estimator Section */}
      <section style={{ maxWidth: '1320px', margin: '0 auto', padding: '80px 32px 0' }}>
        <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: '40px', flexWrap: 'wrap', marginBottom: '26px' }}>
          <div style={{ maxWidth: '640px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#00a85c' }}>
              {t('Lịch trình gợi ý', 'Suggested itineraries')}
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
              {t('Hai đêm hay ba đêm. Cả hai đều bắt đầu bằng chuyến xe đêm.', 'Two nights or three. Both start with the overnight coach.')}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '7px' }}>
            {(['d2', 'd3'] as const).map((k) => {
              const active = activeTripKey === k
              const plan = TRIPS[k]
              return (
                <button
                  key={k}
                  onClick={() => setActiveTripKey(k)}
                  style={{
                    border: `1px solid ${active ? '#0284c7' : '#dbe7ef'}`,
                    background: active ? '#0284c7' : '#ffffff',
                    color: active ? '#ffffff' : '#3d5462',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    padding: '12px 22px',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 150ms ease',
                  }}
                >
                  {isEn ? plan?.nameEn : plan?.nameVi}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '26px', alignItems: 'start' }}>
          {/* Itinerary Timeline */}
          <div style={{ border: '1px solid #e6eef4', borderRadius: '26px', overflow: 'hidden' }}>
            {currentTrip?.legs.map((l, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '20px',
                  padding: '22px 26px',
                  borderBottom: i < (currentTrip?.legs.length ?? 0) - 1 ? '1px solid #eef4f8' : 'none',
                }}
              >
                <div style={{ width: '128px', flexShrink: 0 }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', color: '#0284c7', marginBottom: '4px' }}>
                    {isEn ? l.dayEn : l.dayVi}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0b1b26' }}>{l.time}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0b1b26', lineHeight: 1.4, marginBottom: '5px' }}>
                    {isEn ? l.titleEn : l.titleVi}
                  </div>
                  <div style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#566e7d' }}>
                    {isEn ? l.textEn : l.textVi}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sticky Sidebar */}
          <aside style={{ display: 'grid', gap: '14px' }}>
            <div style={{ border: '1px solid #e6eef4', borderRadius: '24px', boxShadow: '0 14px 40px rgba(6,40,58,0.09)', padding: '24px', background: '#ffffff' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#8fa5b3', marginBottom: '14px' }}>
                {t('Dự toán chi phí mỗi khách', 'Estimated cost per person')}
              </div>
              {currentTrip?.costs.map((c, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px', padding: '8px 0', fontSize: '13.5px', fontWeight: 600, color: '#566e7d' }}>
                  <span>{isEn ? c.labelEn : c.labelVi}</span>
                  <span style={{ color: '#0b1b26', fontWeight: 700, whiteSpace: 'nowrap' }}>{c.val}</span>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', padding: '13px 0 2px', marginTop: '6px', borderTop: '1px solid #e6eef4', fontSize: '14.5px', fontWeight: 800, color: '#0b1b26' }}>
                <span>{t('Tổng dự toán', 'Estimated total')}</span>
                <span style={{ color: '#0284c7', fontWeight: 800, whiteSpace: 'nowrap' }}>{currentTrip?.total}</span>
              </div>
              <div style={{ marginTop: '14px', fontSize: '11.5px', lineHeight: 1.5, color: '#8fa5b3' }}>
                {t('Chưa gồm mua sắm cá nhân. Ở Nam Du Hill thì thay vào dòng lưu trú.', 'Excludes personal shopping. Staying at Nam Du Hill replaces the accommodation line.')}
              </div>
            </div>

            <div
              style={{
                borderRadius: '24px',
                background: 'linear-gradient(150deg, #0284c7 0%, #075985 100%)',
                position: 'relative',
                overflow: 'hidden',
                padding: '26px',
                color: '#ffffff',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.62)', marginBottom: '10px' }}>
                {t('Chúng tôi lo hết phần này', 'We arrange all of it')}
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, lineHeight: 1.5, marginBottom: '18px' }}>
                {t(
                  'Vé tàu cao tốc, đón bến, xe máy, tàu đi đảo và bàn BBQ — báo lễ tân trước một ngày.',
                  'Speedboat tickets, pier pickup, scooter, the island boat and the BBQ table — tell reception the day before.'
                )}
              </div>
              <a
                href="https://zalo.me/0985000650"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  background: '#00c46a',
                  color: '#04241a',
                  fontSize: '14px',
                  fontWeight: 800,
                  padding: '14px 20px',
                  borderRadius: '14px',
                  textDecoration: 'none',
                }}
              >
                {t('Nhờ tư vấn qua Zalo', 'Plan my trip on Zalo')}
              </a>
              <Link
                href="/rooms"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  marginTop: '8px',
                  border: '1px solid rgba(255,255,255,0.34)',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 700,
                  padding: '14px 20px',
                  borderRadius: '14px',
                  textDecoration: 'none',
                }}
              >
                {t('Chọn phòng trước', 'Pick a room first')}
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* 3 Travel Advice Cards ("Trước khi bạn đặt vé tàu") */}
      <section style={{ maxWidth: '1320px', margin: '0 auto', padding: '80px 32px 96px' }}>
        <div style={{ borderRadius: '28px', background: '#f2f8fc', border: '1px solid rgba(2,132,199,0.10)', padding: '40px 44px' }}>
          <h2 style={{ margin: '0 0 24px', fontSize: '26px', fontWeight: 800, letterSpacing: '-0.026em', color: '#0b1b26' }}>
            {t('Trước khi bạn đặt vé tàu', 'Before you book the boat')}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '28px' }}>
            <div>
              <div style={{ fontSize: '15.5px', fontWeight: 800, color: '#0b1b26', marginBottom: '8px' }}>
                {t('Đặt trước 2–4 tuần vào cao điểm', 'Book 2–4 weeks ahead in high season')}
              </div>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#566e7d' }}>
                {t(
                  'Từ tháng 12 đến tháng 3 tàu thường hết chỗ. Cả phòng lẫn vé khứ hồi đều nên đặt sớm.',
                  'From December to March boat capacity runs out. Rooms and return tickets both need booking early.'
                )}
              </p>
            </div>

            <div>
              <div style={{ fontSize: '15.5px', fontWeight: 800, color: '#0b1b26', marginBottom: '8px' }}>
                {t('Xem gió, không phải xem mưa', 'Watch the wind, not the rain')}
              </div>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#566e7d' }}>
                {t(
                  'Gió trên cấp 6 là tàu ngừng chạy. Xem dự báo trước 3 ngày — và yên tâm, biển động thì chúng tôi luôn hoàn cọc.',
                  'Speedboats stop running above force 6. Check the forecast three days out — and note that we always refund deposits when the sea closes.'
                )}
              </p>
            </div>

            <div>
              <div style={{ fontSize: '15.5px', fontWeight: 800, color: '#0b1b26', marginBottom: '8px' }}>
                {t('Để san hô lại chỗ của nó', 'Leave the coral where it is')}
              </div>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#566e7d' }}>
                {t(
                  'Nước ngọt và xử lý rác ngoài đảo còn hạn chế. Mang rác về, và tuyệt đối không bẻ hay giẫm lên san hô.',
                  'Fresh water and waste handling are limited out here. Take your rubbish back, and never break or stand on coral.'
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
