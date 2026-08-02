'use client'

import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'

export default function ContactPage() {
  const { t } = useLanguage()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <main style={{ paddingTop: '110px', minHeight: '100vh', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 32px' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '40px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.16em', color: '#00a85c', textTransform: 'uppercase' }}>
            {t('THÔNG TIN LIÊN HỆ', 'CONTACT INFO')}
          </span>
          <h1 style={{ margin: '12px 0 16px', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: '#0b1b26', letterSpacing: '-0.03em' }}>
            {t('Liên Hệ Trực Tiếp Nam Du Hill', 'Contact The Nam Du Hill')}
          </h1>
          <p style={{ fontSize: '16px', color: '#566e7d', maxWidth: '680px', lineHeight: 1.6 }}>
            {t(
              'Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ quý khách 24/7. Hỗ trợ đón tiễn bến tàu miễn phí và tư vấn vé tàu cao tốc.',
              'We are ready to support you 24/7. Free pier pickup & speedboat ticket support.'
            )}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          {/* Contact Details */}
          <div style={{ display: 'grid', gap: '20px' }}>
            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#0284c7', marginBottom: '8px' }}>{t('ĐIỆN THOẠI HOTLINE', 'HOTLINE')}</div>
              <a href="tel:0985000650" style={{ fontSize: '24px', fontWeight: 800, color: '#0b1b26', textDecoration: 'none' }}>
                0985 000 650
              </a>
              <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#64748b' }}>{t('Trực máy 24/7 (Zalo / Call)', 'Available 24/7 (Zalo / Call)')}</p>
            </div>

            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#0284c7', marginBottom: '8px' }}>{t('ĐỊA CHỈ', 'ADDRESS')}</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#0b1b26', lineHeight: 1.5 }}>
                Ấp Củ Tron, Đặc Khu Kiên Hải, tỉnh An Giang, Việt Nam
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#0284c7', marginBottom: '8px' }}>{t('EMAIL', 'EMAIL')}</div>
              <a href="mailto:thenamduhill@gmail.com" style={{ fontSize: '16px', fontWeight: 700, color: '#0b1b26', textDecoration: 'none' }}>
                thenamduhill@gmail.com
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{ background: '#ffffff', padding: '32px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0b1b26', marginBottom: '20px' }}>
              {t('Gửi yêu cầu đặt phòng', 'Send booking inquiry')}
            </h2>

            {submitted ? (
              <div style={{ padding: '20px', borderRadius: '16px', background: '#dcfce7', color: '#14532d', fontWeight: 700 }}>
                {t('✓ Cảm ơn quý khách! Chúng tôi sẽ liên hệ lại trong ít phút.', '✓ Thank you! We will get back to you shortly.')}
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    {t('Họ và tên', 'Full name')}
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Nguyễn Văn A"
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14.5px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    {t('Số điện thoại', 'Phone number')}
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="0912 345 678"
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14.5px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    {t('Lời nhắn / Ngày dự kiến', 'Message / Expected dates')}
                  </label>
                  <textarea
                    rows={4}
                    placeholder={t('Tôi muốn đặt phòng 2 người ngày...', 'I want to book a room for 2 guests...')}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14.5px' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    background: '#0284c7',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '15px',
                    padding: '14px 28px',
                    borderRadius: '999px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {t('Gửi tin nhắn', 'Send message')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
