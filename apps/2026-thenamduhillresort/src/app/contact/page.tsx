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
    <main style={{ minHeight: '100vh', background: '#ffffff', color: '#0b1b26' }}>
      {/* Header section */}
      <section style={{ maxWidth: '1320px', margin: '0 auto', padding: '116px 32px 0' }}>
        <div style={{ padding: '30px 0 34px', maxWidth: '720px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00c46a' }} />
            <span
              style={{
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#0284c7',
              }}
            >
              {t('Luôn có người nghe máy', 'Someone answers, any hour')}
            </span>
          </div>
          <h1
            style={{
              margin: '0 0 14px',
              fontSize: 'clamp(32px, 4vw, 52px)',
              lineHeight: 1.04,
              fontWeight: 800,
              letterSpacing: '-0.036em',
              color: '#0b1b26',
              textWrap: 'balance',
            }}
          >
            {t('Liên hệ & đặt phòng', 'Contact & booking')}
          </h1>
          <p style={{ margin: 0, fontSize: '17px', lineHeight: 1.6, color: '#566e7d' }}>
            {t(
              'Gửi form và chúng tôi trả lời qua Zalo trong vòng một tiếng — thường là nhanh hơn nhiều. Đặt trực tiếp luôn rẻ hơn giá trên OTA.',
              'Send the form and we reply on Zalo within the hour — usually much sooner. Booking direct always beats the OTA rate.'
            )}
          </p>
        </div>

        {/* Main Grid: Form Left, Contact Info Right */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)',
            gap: '26px',
            alignItems: 'start',
          }}
        >
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              background: '#ffffff',
              border: '1px solid #e6eef4',
              borderRadius: '26px',
              padding: '32px 34px',
              boxShadow: '0 14px 40px rgba(6,40,58,0.07)',
            }}
          >
            <h2 style={{ margin: '0 0 4px', fontSize: '21px', fontWeight: 800, letterSpacing: '-0.024em', color: '#0b1b26' }}>
              {t('Đặt phòng nhanh', 'Quick booking request')}
            </h2>
            <p style={{ margin: '0 0 24px', fontSize: '13.5px', color: '#8fa5b3' }}>
              {t('Liên hệ ngay để nhận ưu đãi tốt nhất.', 'Get in touch for the best available rate.')}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#3d5462' }}>
                  {t('Họ và tên *', 'Full name *')}
                </span>
                <input
                  required
                  type="text"
                  placeholder={t('Nhập họ và tên', 'Enter full name')}
                  style={{
                    border: '1px solid #dbe7ef',
                    borderRadius: '13px',
                    padding: '14px 16px',
                    fontSize: '15px',
                    fontWeight: 500,
                    color: '#0b1b26',
                    background: '#ffffff',
                    width: '100%',
                  }}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#3d5462' }}>
                  {t('Số điện thoại *', 'Phone number *')}
                </span>
                <input
                  required
                  type="tel"
                  placeholder="0123 456 789"
                  style={{
                    border: '1px solid #dbe7ef',
                    borderRadius: '13px',
                    padding: '14px 16px',
                    fontSize: '15px',
                    fontWeight: 500,
                    color: '#0b1b26',
                    background: '#ffffff',
                    width: '100%',
                  }}
                />
              </label>

              <label style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#3d5462' }}>
                  {t('Email', 'Email')}
                </span>
                <input
                  type="email"
                  placeholder="email@example.com"
                  style={{
                    border: '1px solid #dbe7ef',
                    borderRadius: '13px',
                    padding: '14px 16px',
                    fontSize: '15px',
                    fontWeight: 500,
                    color: '#0b1b26',
                    background: '#ffffff',
                    width: '100%',
                  }}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#3d5462' }}>
                  {t('Ngày nhận phòng', 'Check in')}
                </span>
                <input
                  type="date"
                  style={{
                    border: '1px solid #dbe7ef',
                    borderRadius: '13px',
                    padding: '14px 16px',
                    fontSize: '15px',
                    fontWeight: 500,
                    color: '#0b1b26',
                    background: '#ffffff',
                    width: '100%',
                  }}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#3d5462' }}>
                  {t('Ngày trả phòng', 'Check out')}
                </span>
                <input
                  type="date"
                  style={{
                    border: '1px solid #dbe7ef',
                    borderRadius: '13px',
                    padding: '14px 16px',
                    fontSize: '15px',
                    fontWeight: 500,
                    color: '#0b1b26',
                    background: '#ffffff',
                    width: '100%',
                  }}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#3d5462' }}>
                  {t('Số khách', 'Guests')}
                </span>
                <select
                  style={{
                    border: '1px solid #dbe7ef',
                    borderRadius: '13px',
                    padding: '14px 16px',
                    fontSize: '15px',
                    fontWeight: 500,
                    color: '#0b1b26',
                    background: '#ffffff',
                    width: '100%',
                    cursor: 'pointer',
                  }}
                >
                  <option>{t('2 khách', '2 guests')}</option>
                  <option>{t('3 khách', '3 guests')}</option>
                  <option>{t('4 khách', '4 guests')}</option>
                  <option>{t('6 khách', '6 guests')}</option>
                  <option>{t('8 khách', '8 guests')}</option>
                </select>
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#3d5462' }}>
                  {t('Hạng phòng', 'Room type')}
                </span>
                <select
                  style={{
                    border: '1px solid #dbe7ef',
                    borderRadius: '13px',
                    padding: '14px 16px',
                    fontSize: '15px',
                    fontWeight: 500,
                    color: '#0b1b26',
                    background: '#ffffff',
                    width: '100%',
                    cursor: 'pointer',
                  }}
                >
                  <option>{t('Chưa quyết — tư vấn giúp', 'Not decided — please advise')}</option>
                  <option>#14 Rock Deluxe · 1.776.000₫</option>
                  <option>#05 Lục Giác Kính · 1.546.000₫</option>
                  <option>#07 Superior King · 2.971.000₫</option>
                  <option>#08-09 Suite 8 khách · 5.662.000₫</option>
                </select>
              </label>

              <label style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#3d5462' }}>
                  {t('Tin nhắn', 'Message')}
                </span>
                <textarea
                  rows={4}
                  placeholder={t('Yêu cầu đặc biệt, loại phòng mong muốn...', 'Special requests, preferred room...')}
                  style={{
                    border: '1px solid #dbe7ef',
                    borderRadius: '13px',
                    padding: '14px 16px',
                    fontSize: '15px',
                    fontWeight: 500,
                    color: '#0b1b26',
                    background: '#ffffff',
                    width: '100%',
                    resize: 'vertical',
                  }}
                />
              </label>
            </div>

            {submitted && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '14px 18px',
                  borderRadius: '14px',
                  background: '#e8f9f0',
                  border: '1px solid rgba(0,196,106,0.30)',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#04684a',
                }}
              >
                {t(
                  'Đã gửi yêu cầu. Chúng tôi sẽ trả lời qua Zalo trong vòng một tiếng.',
                  'Request sent. We will reply on Zalo within the hour.'
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '22px' }}>
              <button
                type="submit"
                style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: 700,
                  padding: '16px 32px',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 22px rgba(2,132,199,0.28)',
                  transition: 'background 150ms ease',
                }}
              >
                {t('Gửi yêu cầu', 'Send request')}
              </button>
              <a
                href="https://zalo.me/0985000650"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  border: '1px solid #dbe7ef',
                  color: '#0b1b26',
                  fontSize: '15px',
                  fontWeight: 700,
                  padding: '16px 26px',
                  borderRadius: '15px',
                  textDecoration: 'none',
                  transition: 'background 150ms ease',
                }}
              >
                {t('Hoặc nhắn Zalo ngay', 'Or message us on Zalo')}
              </a>
            </div>

            <p style={{ margin: '16px 0 0', fontSize: '12.5px', lineHeight: 1.55, color: '#8fa5b3' }}>
              {t(
                'Đặt trực tiếp: cam kết giá tốt nhất, đưa đón bến tàu miễn phí, huỷ miễn phí trước 7 ngày.',
                'Booking direct: best rate guaranteed, free pier transfer, free cancellation up to 7 days before arrival.'
              )}
            </p>
          </form>

          {/* Contact Details & Getting Here Sidebar */}
          <aside style={{ display: 'grid', gap: '14px' }}>
            <div style={{ background: '#0b1b26', borderRadius: '26px', padding: '30px 32px', color: '#ffffff' }}>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.44)',
                  marginBottom: '14px',
                }}
              >
                {t('Đặt phòng', 'Reservations')}
              </div>
              <a
                href="tel:0985000650"
                style={{
                  display: 'block',
                  fontSize: '30px',
                  fontWeight: 900,
                  letterSpacing: '-0.035em',
                  color: '#ffffff',
                  marginBottom: '6px',
                  textDecoration: 'none',
                }}
              >
                0985 000 650
              </a>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.62)', marginBottom: '24px' }}>
                {t('Zalo cùng số · 24/7', 'Zalo on the same number · 24/7')}
              </div>

              <div style={{ display: 'grid', gap: '18px', paddingTop: '22px', borderTop: '1px solid rgba(255,255,255,0.14)' }}>
                <div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.13em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.44)',
                      marginBottom: '7px',
                    }}
                  >
                    {t('Địa chỉ', 'Address')}
                  </div>
                  <div style={{ fontSize: '14.5px', fontWeight: 600, lineHeight: 1.5, color: '#ffffff' }}>
                    {t('Tổ 6, Ấp Củ Tron, Đặc Khu Kiên Hải, tỉnh An Giang, Việt Nam', 'Group 6, Cu Tron hamlet, Kien Hai Special Zone, An Giang province, Vietnam')}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.13em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.44)',
                      marginBottom: '7px',
                    }}
                  >
                    Email
                  </div>
                  <a href="mailto:thenamduhill@gmail.com" style={{ fontSize: '14.5px', fontWeight: 600, color: '#ffffff', textDecoration: 'none' }}>
                    thenamduhill@gmail.com
                  </a>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.13em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.44)',
                      marginBottom: '7px',
                    }}
                  >
                    {t('Giờ lễ tân', 'Reception hours')}
                  </div>
                  <div style={{ fontSize: '14.5px', fontWeight: 600, lineHeight: 1.5, color: '#ffffff' }}>
                    {t(
                      'Nhận phòng từ 14:00 · trả phòng trước 12:00 · trực 24/7',
                      'Check in from 14:00 · check out by 12:00 · desk staffed 24/7'
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e6eef4', borderRadius: '26px', padding: '26px 28px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#8fa5b3', marginBottom: '16px' }}>
                {t('Cách di chuyển', 'Getting here')}
              </div>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '13px', alignItems: 'flex-start' }}>
                  <span
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: '#eef6fb',
                      color: '#0284c7',
                      fontSize: '11px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    1
                  </span>
                  <div>
                    <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#0b1b26' }}>
                      {t('TP.HCM → Rạch Giá', 'HCMC → Rach Gia')}
                    </div>
                    <div style={{ fontSize: '13px', color: '#8fa5b3', marginTop: '2px' }}>
                      {t('Xe giường nằm đêm, 7 tiếng, 210–250k', 'Overnight sleeper coach, 7 h, 210–250k')}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '13px', alignItems: 'flex-start' }}>
                  <span
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: '#eef6fb',
                      color: '#0284c7',
                      fontSize: '11px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    2
                  </span>
                  <div>
                    <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#0b1b26' }}>
                      {t('Rạch Giá → bến Củ Tron', 'Rach Gia → Cu Tron pier')}
                    </div>
                    <div style={{ fontSize: '13px', color: '#8fa5b3', marginTop: '2px' }}>
                      {t(
                        'Tàu cao tốc, 2–3 tiếng, ~226k. Superdong, Phú Quốc Express, Ngọc Thành.',
                        'Speedboat, 2–3 h, ~226k. Superdong, Phu Quoc Express, Ngoc Thanh.'
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '13px', alignItems: 'flex-start' }}>
                  <span
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: '#e8f9f0',
                      color: '#00a85c',
                      fontSize: '11px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    3
                  </span>
                  <div>
                    <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#0b1b26' }}>
                      {t('Bến tàu → lên đồi', 'Pier → the hill')}
                    </div>
                    <div style={{ fontSize: '13px', color: '#00a85c', fontWeight: 600, marginTop: '2px' }}>
                      {t('Xe riêng của resort đón tận tàu. Miễn phí, hai chiều.', 'Our private car meets your boat. Free, both ways.')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* OpenStreetMap Section */}
      <section style={{ maxWidth: '1320px', margin: '0 auto', padding: '40px 32px 88px' }}>
        <div style={{ borderRadius: '26px', overflow: 'hidden', border: '1px solid #e6eef4', position: 'relative', height: '420px', background: '#eef4f8' }}>
          <iframe
            title="Bản đồ The Nam Du Hill"
            src="https://www.openstreetmap.org/export/embed.html?bbox=104.28%2C9.64%2C104.42%2C9.72&amp;layer=mapnik&amp;marker=9.6835%2C104.3595"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
            loading="lazy"
          />
          <div
            style={{
              position: 'absolute',
              left: '24px',
              bottom: '24px',
              background: '#ffffff',
              borderRadius: '18px',
              padding: '20px 24px',
              boxShadow: '0 12px 32px rgba(3,20,32,0.20)',
              maxWidth: '330px',
            }}
          >
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0b1b26', marginBottom: '6px' }}>
              THE NAM DU HILL
            </div>
            <div style={{ fontSize: '13px', lineHeight: 1.5, color: '#566e7d', marginBottom: '12px' }}>
              {t('Tổ 6, Ấp Củ Tron, tỉnh An Giang', 'Group 6, Cu Tron hamlet, An Giang')}
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&amp;query=THE+NAM+DU+HILL+resort+Nam+Du"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '13px', fontWeight: 700, color: '#0284c7', textDecoration: 'none' }}
            >
              {t('Mở trong Google Maps →', 'Open in Google Maps →')}
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
