'use client'

import React from 'react'
import { useLanguage } from '../../context/LanguageContext'

export function HostServiceSection() {
  const { t } = useLanguage()

  return (
    <section id="experience" className="nd-section-container">
      <div
        className="host-card-wrapper"
        style={{
          borderRadius: '30px',
          background: '#f2f8fc',
          border: '1px solid rgba(2,132,199,0.10)',
          padding: '36px 32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '28px',
          alignItems: 'center',
        }}
      >
        <div>
          <span className="nd-section-subtitle">
            {t('Chủ nhà & tiện ích đi kèm', 'Host & amenities')}
          </span>
          <h2 className="nd-h2">
            {t('Bạn được đón tận bến. Phần còn lại đã có người lo.', 'You are met at the pier. The rest is arranged.')}
          </h2>
          <p className="nd-lead-p" style={{ marginBottom: '20px' }}>
            {t(
              'Xe riêng đưa đón hai chiều từ bến tàu Củ Tron miễn phí, tour cano lặn ngắm san hô Hòn Dầu – Hòn Ngang sắp xếp theo yêu cầu, và luôn có người trực máy bất kể giờ nào.',
              'Private car both ways from Cu Tron pier at no charge, canoe tours to Hon Dau and Hon Ngang arranged on request, and someone on the line at any hour.'
            )}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <span className="nd-interactive-pill" style={{ background: '#ffffff', border: '1px solid rgba(2,132,199,0.16)', fontSize: '11.5px', fontWeight: 600, color: '#0284c7', padding: '6px 13px', borderRadius: '999px' }}>
              🚗 {t('Đón tiễn bến tàu miễn phí', 'Free pier transfer')}
            </span>
            <span className="nd-interactive-pill" style={{ background: '#ffffff', border: '1px solid rgba(2,132,199,0.16)', fontSize: '11.5px', fontWeight: 600, color: '#0284c7', padding: '6px 13px', borderRadius: '999px' }}>
              🚤 {t('Tour cano lặn ngắm san hô', 'Private canoe & snorkeling')}
            </span>
            <span className="nd-interactive-pill" style={{ background: '#ffffff', border: '1px solid rgba(2,132,199,0.16)', fontSize: '11.5px', fontWeight: 600, color: '#0284c7', padding: '6px 13px', borderRadius: '999px' }}>
              🍳 {t('Bữa sáng ngắm biển', 'Seaview breakfast')}
            </span>
            <span className="nd-interactive-pill" style={{ background: '#ffffff', border: '1px solid rgba(2,132,199,0.16)', fontSize: '11.5px', fontWeight: 600, color: '#0284c7', padding: '6px 13px', borderRadius: '999px' }}>
              🎱 {t('Bàn bida & giải trí', 'Billiards & games')}
            </span>
            <span className="nd-interactive-pill" style={{ background: '#ffffff', border: '1px solid rgba(2,132,199,0.16)', fontSize: '11.5px', fontWeight: 600, color: '#0284c7', padding: '6px 13px', borderRadius: '999px' }}>
              🛵 {t('Cho thuê xe máy đồi', 'Motorbike rental')}
            </span>
            <span className="nd-interactive-pill" style={{ background: '#ffffff', border: '1px solid rgba(2,132,199,0.16)', fontSize: '11.5px', fontWeight: 600, color: '#0284c7', padding: '6px 13px', borderRadius: '999px' }}>
              🎧 {t('Hỗ trợ 24/7', '24/7 support')}
            </span>
          </div>
        </div>

        {/* 3 Review Blockquotes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          <blockquote className="nd-card host-quote-card" style={{ margin: 0, background: '#ffffff', borderRadius: '18px', padding: '20px', boxShadow: '0 4px 18px rgba(6,40,58,0.05)', border: '1px solid #e6eef4' }}>
            <div style={{ fontSize: '12px', color: '#00c46a', letterSpacing: '1px', marginBottom: '8px' }}>★★★★★</div>
            <p className="nd-card-desc" style={{ color: '#0b1b26', marginBottom: '12px', lineHeight: 1.45 }}>
              {t('“Bà chủ rất chu đáo, tận tâm với khách hàng.”', '“The owner is genuinely attentive — she checked on us more than any hotel we’ve stayed at.”')}
            </p>
            <footer style={{ fontSize: '11px', fontWeight: 600, color: '#8fa5b3' }}>Ngọc Anh · TP.HCM</footer>
          </blockquote>

          <blockquote className="nd-card host-quote-card" style={{ margin: 0, background: '#0284c7', borderRadius: '18px', padding: '20px', boxShadow: '0 8px 24px -4px rgba(2,132,199,0.30)' }}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.9)', letterSpacing: '1px', marginBottom: '8px' }}>★★★★★</div>
            <p className="nd-card-desc" style={{ color: '#ffffff', marginBottom: '12px', lineHeight: 1.45 }}>
              {t('“Dậy ngắm bình minh rồi ngồi luôn trên sân thượng tới lúc chợ đêm lên đèn.”', '“We woke for the sunrise and stayed on the terrace until the night market lit up.”')}
            </p>
            <footer style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.76)' }}>Minh Trí · Cần Thơ</footer>
          </blockquote>

          <blockquote className="nd-card host-quote-card" style={{ gridColumn: '1 / -1', margin: 0, background: '#ffffff', borderRadius: '18px', padding: '20px', boxShadow: '0 4px 18px rgba(6,40,58,0.05)', border: '1px solid #e6eef4' }}>
            <div style={{ fontSize: '12px', color: '#00c46a', letterSpacing: '1px', marginBottom: '8px' }}>★★★★★</div>
            <p className="nd-card-desc" style={{ color: '#0b1b26', marginBottom: '12px', lineHeight: 1.45 }}>
              {t('“Phòng 14 không phải phòng trang trí theo chủ đề. Đó là vách đá thật trong phòng ngủ, đêm nghe rõ tiếng suối.”', '“Room 14 is not a themed room. That is an actual cliff in the bedroom, and you can hear the stream at night.”')}
            </p>
            <footer style={{ fontSize: '11px', fontWeight: 600, color: '#8fa5b3' }}>Hoài Thu · Hà Nội</footer>
          </blockquote>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 640px) {
          .host-card-wrapper {
            border-radius: 18px !important;
            padding: 20px 14px !important;
            gap: 20px !important;
          }
          .host-quote-card {
            border-radius: 14px !important;
            padding: 14px !important;
          }
        }
      `}</style>
    </section>
  )
}
