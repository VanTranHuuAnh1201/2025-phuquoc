'use client'

import React from 'react'
import { useLanguage } from '../../context/LanguageContext'

export function HostServiceSection() {
  const { t } = useLanguage()

  return (
    <section id="experience" style={{ maxWidth: '1280px', margin: '0 auto', padding: '100px 32px 0' }}>
      <div
        style={{
          borderRadius: '34px',
          background: '#f2f8fc',
          border: '1px solid rgba(2,132,199,0.10)',
          padding: '54px 56px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '64px',
          alignItems: 'center',
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
            {t('Chủ nhà & dịch vụ', 'Host & services')}
          </span>
          <h2
            style={{
              margin: '14px 0 16px',
              fontSize: '38px',
              lineHeight: 1.1,
              fontWeight: 800,
              letterSpacing: '-0.032em',
              color: '#0b1b26',
              textWrap: 'balance',
            }}
          >
            {t('Bạn được đón tận bến. Phần còn lại đã có người lo.', 'You are met at the pier. The rest is arranged.')}
          </h2>
          <p style={{ margin: '0 0 26px', fontSize: '15.5px', lineHeight: 1.65, color: '#566e7d' }}>
            {t(
              'Xe riêng đưa đón hai chiều từ bến tàu Củ Tron miễn phí, tour cano lặn ngắm san hô Hòn Dầu – Hòn Ngang sắp xếp theo yêu cầu, và luôn có người trực máy bất kể giờ nào.',
              'Private car both ways from Cu Tron pier at no charge, canoe tours to Hon Dau and Hon Ngang arranged on request, and someone on the line at any hour.'
            )}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ background: '#ffffff', border: '1px solid rgba(2,132,199,0.16)', fontSize: '13px', fontWeight: 700, color: '#0284c7', padding: '9px 16px', borderRadius: '999px' }}>
              {t('Hỗ trợ 24/7', '24/7 support')}
            </span>
            <span style={{ background: '#ffffff', border: '1px solid rgba(2,132,199,0.16)', fontSize: '13px', fontWeight: 700, color: '#0284c7', padding: '9px 16px', borderRadius: '999px' }}>
              {t('Đón tiễn miễn phí', 'Free pier transfer')}
            </span>
            <span style={{ background: '#ffffff', border: '1px solid rgba(2,132,199,0.16)', fontSize: '13px', fontWeight: 700, color: '#0284c7', padding: '9px 16px', borderRadius: '999px' }}>
              {t('Tour cano riêng', 'Private canoe tour')}
            </span>
            <span style={{ background: '#ffffff', border: '1px solid rgba(2,132,199,0.16)', fontSize: '13px', fontWeight: 700, color: '#0284c7', padding: '9px 16px', borderRadius: '999px' }}>
              {t('Bàn bida', 'Billiards & games')}
            </span>
          </div>
        </div>

        {/* 3 Review Blockquotes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          <blockquote style={{ margin: 0, background: '#ffffff', borderRadius: '22px', padding: '26px', boxShadow: '0 4px 18px rgba(6,40,58,0.06)' }}>
            <div style={{ fontSize: '15px', color: '#00c46a', letterSpacing: '2px', marginBottom: '12px' }}>★★★★★</div>
            <p style={{ margin: '0 0 16px', fontSize: '15px', lineHeight: 1.6, fontWeight: 500, color: '#0b1b26' }}>
              {t('“Bà chủ rất chu đáo, tận tâm với khách hàng.”', '“The owner is genuinely attentive — she checked on us more than any hotel we’ve stayed at.”')}
            </p>
            <footer style={{ fontSize: '12.5px', fontWeight: 600, color: '#8fa5b3' }}>Ngọc Anh · TP.HCM</footer>
          </blockquote>

          <blockquote style={{ margin: 0, background: '#0284c7', borderRadius: '22px', padding: '26px' }}>
            <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)', letterSpacing: '2px', marginBottom: '12px' }}>★★★★★</div>
            <p style={{ margin: '0 0 16px', fontSize: '15px', lineHeight: 1.6, fontWeight: 500, color: '#ffffff' }}>
              {t('“Dậy ngắm bình minh rồi ngồi luôn trên sân thượng tới lúc chợ đêm lên đèn.”', '“We woke for the sunrise and stayed on the terrace until the night market lit up.”')}
            </p>
            <footer style={{ fontSize: '12.5px', fontWeight: 600, color: 'rgba(255,255,255,0.68)' }}>Minh Trí · Cần Thơ</footer>
          </blockquote>

          <blockquote style={{ gridColumn: '1 / -1', margin: 0, background: '#ffffff', borderRadius: '22px', padding: '26px', boxShadow: '0 4px 18px rgba(6,40,58,0.06)' }}>
            <div style={{ fontSize: '15px', color: '#00c46a', letterSpacing: '2px', marginBottom: '12px' }}>★★★★★</div>
            <p style={{ margin: '0 0 16px', fontSize: '15px', lineHeight: 1.6, fontWeight: 500, color: '#0b1b26' }}>
              {t('“Phòng 14 không phải phòng trang trí theo chủ đề. Đó là vách đá thật trong phòng ngủ, đêm nghe rõ tiếng suối.”', '“Room 14 is not a themed room. That is an actual cliff in the bedroom, and you can hear the stream at night.”')}
            </p>
            <footer style={{ fontSize: '12.5px', fontWeight: 600, color: '#8fa5b3' }}>Hoài Thu · Hà Nội</footer>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
