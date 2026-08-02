'use client'

import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { ImageSlot } from '../../components/common/ImageSlot'
import { DINING_MENU } from '../../data/dining'

export default function DiningPage() {
  const { t, language } = useLanguage()
  const isEn = language === 'en'

  const [activeTab, setActiveTab] = useState<'coffee' | 'tea' | 'hot'>('coffee')

  const currentCategory = DINING_MENU[activeTab]

  return (
    <main style={{ minHeight: '100vh', background: '#ffffff', color: '#0b1b26' }}>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          minHeight: '62vh',
          display: 'flex',
          alignItems: 'flex-end',
          overflow: 'hidden',
          background: '#06283a',
          paddingTop: '80px',
        }}
      >
        <ImageSlot
          id="ndh-dining-hero"
          placeholder="Nhà hàng đỉnh đồi nhìn ra biển"
          style={{ position: 'absolute', inset: 0 }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(3,20,32,0.66) 0%, rgba(3,20,32,0.22) 40%, rgba(3,20,32,0.88) 100%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1320px',
            margin: '0 auto',
            padding: '160px 32px 52px',
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
              {t('Ẩm thực trên đỉnh đồi', 'Dining at the top of the hill')}
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
              maxWidth: '17ch',
              textWrap: 'balance',
            }}
          >
            {t(
              'Ẩm thực biển đảo. Giản dị, tươi mới, đậm chất Nam Du.',
              'Island cooking. Plain, fresh, unmistakably Nam Du.'
            )}
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(15px, 1.3vw, 17.5px)',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.84)',
              maxWidth: '58ch',
            }}
          >
            {t(
              'Mọi con cá, con ghẹ, con mực đều mua từ ngư dân Nam Du ngay trong ngày đánh bắt. Không đông lạnh, không chở từ đất liền ra.',
              'Every fish, crab and squid is bought from Nam Du fishermen the same day it is landed. Nothing frozen, nothing shipped from the mainland.'
            )}
          </p>
        </div>
      </section>

      {/* 3 Venue Cards Grid */}
      <section style={{ maxWidth: '1320px', margin: '0 auto', padding: '72px 32px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          {/* Card 1 */}
          <article
            className="nd-card"
            style={{
              borderRadius: '26px',
              overflow: 'hidden',
              background: '#ffffff',
              border: '1px solid #e6eef4',
              display: 'flex',
              flexDirection: 'column',
              transition: 'box-shadow 200ms ease, transform 200ms ease',
            }}
          >
            <div style={{ position: 'relative', height: '216px', background: '#eef4f8' }}>
              <ImageSlot
                id="ndh-dining-restaurant"
                placeholder="Hilltop Restaurant — bàn ăn nhìn ra biển"
                style={{ position: 'absolute', inset: 0 }}
              />
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ fontSize: '10.5px', fontWeight: 800, letterSpacing: '0.14em', color: '#0284c7', marginBottom: '9px' }}>
                {t('CẢ NGÀY · 06:30 – 21:30', 'ALL DAY · 06:30 – 21:30')}
              </div>
              <h3 style={{ margin: '0 0 9px', fontSize: '21px', fontWeight: 800, letterSpacing: '-0.022em', color: '#0b1b26' }}>
                Hilltop Restaurant
              </h3>
              <p style={{ margin: '0 0 18px', fontSize: '14px', lineHeight: 1.55, color: '#566e7d' }}>
                {t(
                  'Phòng ăn nhìn thẳng xuống làn nước ngọc bích Hòn Lớn. Hương vị truyền thống Nam Du, chế biến hiện đại và nhẹ tay hơn. Bố trí bàn gia đình và bàn nhóm.',
                  'The dining room looks straight down onto the jade water of Hon Lon. Traditional Nam Du flavours, cooked with a lighter modern hand. Family and group tables.'
                )}
              </p>
              <a
                href="https://zalo.me/0985000650"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginTop: 'auto',
                  textAlign: 'center',
                  background: '#f2f8fc',
                  border: '1px solid rgba(2,132,199,0.16)',
                  color: '#0284c7',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  padding: '13px 18px',
                  borderRadius: '14px',
                  textDecoration: 'none',
                }}
              >
                {t('Đặt bàn qua Zalo', 'Reserve a table')}
              </a>
            </div>
          </article>

          {/* Card 2 */}
          <article
            className="nd-card"
            style={{
              borderRadius: '26px',
              overflow: 'hidden',
              background: '#ffffff',
              border: '1px solid #e6eef4',
              display: 'flex',
              flexDirection: 'column',
              transition: 'box-shadow 200ms ease, transform 200ms ease',
            }}
          >
            <div style={{ position: 'relative', height: '216px', background: '#eef4f8' }}>
              <ImageSlot
                id="ndh-dining-bar"
                placeholder="Sunset Café & Bar trên nóc đồi"
                style={{ position: 'absolute', inset: 0 }}
              />
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ fontSize: '10.5px', fontWeight: 800, letterSpacing: '0.14em', color: '#00a85c', marginBottom: '9px' }}>
                {t('06:00 – ĐẾN KHUYA', '06:00 – LATE')}
              </div>
              <h3 style={{ margin: '0 0 9px', fontSize: '21px', fontWeight: 800, letterSpacing: '-0.022em', color: '#0b1b26' }}>
                Sunset Café & Bar
              </h3>
              <p style={{ margin: '0 0 18px', fontSize: '14px', lineHeight: 1.55, color: '#566e7d' }}>
                {t(
                  'Trên boong cao nhất resort. Cà phê túi lọc và trà miễn phí lúc bình minh; cocktail và đồ uống lạnh khi mặt trời ngả xuống sau những hòn đảo.',
                  'On the highest deck of the resort. Free filter coffee and tea at sunrise; cocktails and cold drinks as the sun drops behind the islands.'
                )}
              </p>
              <a
                href="#menu"
                style={{
                  marginTop: 'auto',
                  textAlign: 'center',
                  background: '#f2f8fc',
                  border: '1px solid rgba(2,132,199,0.16)',
                  color: '#0284c7',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  padding: '13px 18px',
                  borderRadius: '14px',
                  textDecoration: 'none',
                }}
              >
                {t('Xem menu đồ uống', 'See the drinks menu')}
              </a>
            </div>
          </article>

          {/* Card 3 */}
          <article
            className="nd-card"
            style={{
              borderRadius: '26px',
              overflow: 'hidden',
              background: '#ffffff',
              border: '1px solid #e6eef4',
              display: 'flex',
              flexDirection: 'column',
              transition: 'box-shadow 200ms ease, transform 200ms ease',
            }}
          >
            <div style={{ position: 'relative', height: '216px', background: '#eef4f8' }}>
              <ImageSlot
                id="ndh-dining-bbq"
                placeholder="Tiệc BBQ hải sản ngoài trời buổi tối"
                style={{ position: 'absolute', inset: 0 }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: '14px',
                  left: '14px',
                  display: 'inline-block',
                  whiteSpace: 'nowrap',
                  background: 'rgba(0,196,106,0.94)',
                  color: '#04241a',
                  fontSize: '10.5px',
                  fontWeight: 800,
                  letterSpacing: '0.07em',
                  padding: '6px 11px',
                  borderRadius: '999px',
                }}
              >
                300.000₫ / BÀN
              </span>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ fontSize: '10.5px', fontWeight: 800, letterSpacing: '0.14em', color: '#0284c7', marginBottom: '9px' }}>
                {t('TỪ 18:30', 'FROM 18:30')}
              </div>
              <h3 style={{ margin: '0 0 9px', fontSize: '21px', fontWeight: 800, letterSpacing: '-0.022em', color: '#0b1b26' }}>
                Outdoor BBQ & Karaoke
              </h3>
              <p style={{ margin: '0 0 18px', fontSize: '14px', lineHeight: 1.55, color: '#566e7d' }}>
                {t(
                  'Tự nướng hải sản dưới trời sao trên đỉnh đồi, có dàn karaoke cho cả nhà. Chiều mua hải sản của ngư dân rồi mang lên nướng.',
                  'Grill your own seafood under the stars on the hilltop, with a karaoke rig for the family. Buy your catch from the fishermen in the afternoon and bring it up.'
                )}
              </p>
              <a
                href="#bbq"
                style={{
                  marginTop: 'auto',
                  textAlign: 'center',
                  background: '#0284c7',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  padding: '13px 18px',
                  borderRadius: '14px',
                  textDecoration: 'none',
                }}
              >
                {t('Xem giá tiệc BBQ', 'BBQ pricing')}
              </a>
            </div>
          </article>
        </div>
      </section>

      {/* Signature Dishes Grid */}
      <section style={{ maxWidth: '1320px', margin: '0 auto', padding: '88px 32px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '60px', alignItems: 'end', marginBottom: '30px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#00a85c' }}>
              {t('Món đặc trưng', 'Signature dishes')}
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
              {t('Mua ở bến sáng nay. Lên bàn bạn tối nay.', 'Bought at the pier this morning. On your table tonight.')}
            </h2>
          </div>
          <p style={{ margin: '0 0 6px', fontSize: '16px', lineHeight: 1.65, color: '#566e7d' }}>
            {t(
              'Hải sản tươi tính theo giá trong ngày — hỏi lễ tân để xem bảng giá hôm nay.',
              'Prices for fresh seafood follow the daily catch — ask reception for today’s board.'
            )}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gridAutoRows: '230px', gap: '14px' }}>
          {/* Main Dish (2x2) */}
          <div
            style={{
              gridColumn: 'span 2',
              gridRow: 'span 2',
              borderRadius: '26px',
              overflow: 'hidden',
              position: 'relative',
              background: '#f6ede4',
            }}
          >
            <ImageSlot
              id="ndh-dish-goica"
              placeholder="Gỏi cá trích Nam Du"
              style={{ position: 'absolute', inset: 0 }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0) 46%, rgba(38,16,4,0.86) 100%)',
                pointerEvents: 'none',
              }}
            />
            <div style={{ position: 'absolute', left: '32px', right: '32px', bottom: '30px', pointerEvents: 'none' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: '30px', fontWeight: 800, letterSpacing: '-0.028em', color: '#ffffff', lineHeight: 1.12 }}>
                Gỏi cá trích Nam Du
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.82)' }}>
                {t('Cá trích tươi cuốn bánh tráng với rau rừng bản địa và dừa nạo', 'Fresh herring rolled in rice paper with wild island herbs and grated coconut')}
              </p>
            </div>
          </div>

          {/* Dish 2 */}
          <div style={{ borderRadius: '26px', overflow: 'hidden', position: 'relative', background: '#eef4f8' }}>
            <ImageSlot
              id="ndh-dish-chao"
              placeholder="Cháo cá đập đập"
              style={{ position: 'absolute', inset: 0 }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 'auto 0 0 0',
                padding: '18px',
                background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(11,27,38,0.86) 100%)',
                pointerEvents: 'none',
              }}
            >
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>Cháo cá đập đập</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.74)' }}>
                {t('Đậm đà vị biển miền Tây', 'Crushed-fish porridge, Mekong style')}
              </div>
            </div>
          </div>

          {/* Dish 3 */}
          <div style={{ borderRadius: '26px', overflow: 'hidden', position: 'relative', background: '#eef4f8' }}>
            <ImageSlot
              id="ndh-dish-lau"
              placeholder="Lẩu hải sản chua cay"
              style={{ position: 'absolute', inset: 0 }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 'auto 0 0 0',
                padding: '18px',
                background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(11,27,38,0.86) 100%)',
                pointerEvents: 'none',
              }}
            >
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>Lẩu hải sản chua cay</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.74)' }}>
                {t('Nồi cho 2–4 người', 'Hot & sour pot, for 2–4')}
              </div>
            </div>
          </div>

          {/* Dish 4 */}
          <div style={{ borderRadius: '26px', overflow: 'hidden', position: 'relative', background: '#eef4f8' }}>
            <ImageSlot
              id="ndh-dish-nuong"
              placeholder="Hải sản nướng sa tế"
              style={{ position: 'absolute', inset: 0 }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 'auto 0 0 0',
                padding: '18px',
                background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(11,27,38,0.86) 100%)',
                pointerEvents: 'none',
              }}
            >
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>Nướng sa tế / hấp bia</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.74)' }}>
                {t('Cua, ghẹ, tôm hùm, ốc vú nàng, mực trứng', 'Crab, blue swimmer, lobster, sea snails, egg squid')}
              </div>
            </div>
          </div>

          {/* 100% Quality Box */}
          <div
            style={{
              borderRadius: '26px',
              padding: '26px',
              background: '#0b1b26',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '28px', fontWeight: 900, color: '#00c46a', letterSpacing: '-0.03em', lineHeight: 1 }}>
              100%
            </span>
            <div>
              <h3 style={{ margin: '0 0 6px', fontSize: '17px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.018em' }}>
                {t('Đánh bắt trong ngày', 'Landed the same day')}
              </h3>
              <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.5, color: 'rgba(255,255,255,0.62)' }}>
                {t(
                  'Mua thẳng từ ngư dân Nam Du — không đông lạnh, không nhập từ ngoài.',
                  'Bought straight from Nam Du fishermen — never frozen, never shipped in.'
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Full Drinks Menu (#menu) */}
      <section id="menu" style={{ maxWidth: '1320px', margin: '0 auto', padding: '88px 32px 0' }}>
        <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: '40px', flexWrap: 'wrap', marginBottom: '26px' }}>
          <div style={{ maxWidth: '620px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#00a85c' }}>
              {t('Sunset Café & Bar · menu đầy đủ', 'Sunset Café & Bar · full menu')}
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
              {t('Cà phê, trà và mọi thứ mát lạnh, trên boong cao nhất.', 'Coffee, tea and everything cold, on the highest deck.')}
            </h2>
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
            {(['coffee', 'tea', 'hot'] as const).map((key) => {
              const active = activeTab === key
              const cat = DINING_MENU[key]
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  style={{
                    border: `1px solid ${active ? '#0284c7' : '#dbe7ef'}`,
                    background: active ? '#0284c7' : '#ffffff',
                    color: active ? '#ffffff' : '#3d5462',
                    fontSize: '13px',
                    fontWeight: 700,
                    padding: '11px 18px',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 150ms ease',
                  }}
                >
                  {isEn ? cat?.nameEn : cat?.nameVi}
                </button>
              )
            })}
          </div>
        </div>

        {/* Menu Table Card */}
        <div style={{ border: '1px solid #e6eef4', borderRadius: '26px', overflow: 'hidden' }}>
          <div
            style={{
              background: '#f7fbfd',
              borderBottom: '1px solid #e6eef4',
              padding: '18px 28px',
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: '20px',
            }}
          >
            <span style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.01em', color: '#0b1b26' }}>
              {isEn ? currentCategory?.nameEn : currentCategory?.nameVi}
            </span>
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#8fa5b3' }}>
              {t('Giá tính bằng VNĐ, đã gồm phục vụ', 'Prices in VND, service included')}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))' }}>
            {currentCategory?.items.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '16px 28px',
                  borderBottom: '1px solid #f0f6fa',
                  borderRight: idx % 2 === 0 ? '1px solid #f0f6fa' : 'none',
                }}
              >
                <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#cbd9e3', width: '26px', flexShrink: 0, paddingTop: '2px' }}>
                  {String(item.id).padStart(2, '0')}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#0b1b26', lineHeight: 1.35 }}>{item.nameVi}</div>
                  <div style={{ fontSize: '12.5px', fontStyle: 'italic', color: '#8fa5b3', marginTop: '2px' }}>{item.nameEn}</div>
                </div>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#0284c7', flexShrink: 0 }}>{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BBQ & Karaoke Pricing Section (#bbq) */}
      <section id="bbq" style={{ maxWidth: '1320px', margin: '0 auto', padding: '72px 32px 0' }}>
        <div
          style={{
            borderRadius: '32px',
            overflow: 'hidden',
            position: 'relative',
            background: '#0b1b26',
            padding: '52px 56px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: '-140px',
              top: '-140px',
              width: '480px',
              height: '480px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,196,106,0.30) 0%, rgba(0,196,106,0) 68%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)',
              gap: '56px',
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#00e07a' }}>
                {t('Tiệc nướng ngoài trời & Karaoke', 'Outdoor BBQ & Karaoke Night')}
              </span>
              <h2
                style={{
                  margin: '14px 0 16px',
                  fontSize: 'clamp(26px, 3vw, 38px)',
                  lineHeight: 1.1,
                  fontWeight: 800,
                  letterSpacing: '-0.032em',
                  color: '#ffffff',
                  textWrap: 'balance',
                }}
              >
                {t('Bạn mua hải sản. Chúng tôi dọn bàn và nhóm than.', 'Buy your own catch. We set the table and light the coals.')}
              </h2>
              <p style={{ margin: '0 0 26px', fontSize: '16px', lineHeight: 1.62, color: 'rgba(255,255,255,0.72)', maxWidth: '52ch' }}>
                {t(
                  'Chiều mua hải sản tươi của ngư dân, mang lên đồi tự nướng dưới trời sao. Có sẵn dàn karaoke cho cả nhà.',
                  'Buy fresh seafood from the fishermen in the afternoon, bring it up to the hill and grill it yourself under the stars. Karaoke rig included for the family.'
                )}
              </p>
              <a
                href="https://zalo.me/0985000650"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  background: '#00c46a',
                  color: '#04241a',
                  fontSize: '15px',
                  fontWeight: 800,
                  padding: '16px 30px',
                  borderRadius: '999px',
                  textDecoration: 'none',
                }}
              >
                {t('Đặt bàn BBQ qua Zalo', 'Book a BBQ table on Zalo')}
              </a>
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px', padding: '24px 26px' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.48)', marginBottom: '10px' }}>
                  {t('Setup bàn, 6–10 khách', 'Table setup, 6–10 guests')}
                </div>
                <div style={{ fontSize: '30px', fontWeight: 900, letterSpacing: '-0.035em', color: '#ffffff', lineHeight: 1 }}>
                  300.000₫ <span style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.60)' }}>{t('/ bàn', '/ table')}</span>
                </div>
                <div style={{ marginTop: '10px', fontSize: '13px', lineHeight: 1.5, color: 'rgba(255,255,255,0.66)' }}>
                  {t('Bếp nướng, than, kẹp, chén dĩa, nước chấm và chỗ ngồi', 'Grill, coals, tongs, plates, sauces and seating')}
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px', padding: '24px 26px' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.48)', marginBottom: '10px' }}>
                  {t('Phụ thu bia mang từ ngoài', 'Corkage on outside beer')}
                </div>
                <div style={{ fontSize: '30px', fontWeight: 900, letterSpacing: '-0.035em', color: '#ffffff', lineHeight: 1 }}>
                  150.000₫ <span style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.60)' }}>{t('/ thùng', '/ crate')}</span>
                </div>
                <div style={{ marginTop: '10px', fontSize: '13px', lineHeight: 1.5, color: 'rgba(255,255,255,0.66)' }}>
                  {t('Đã bao gồm đá', 'Ice included')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Info Service Boxes */}
      <section style={{ maxWidth: '1320px', margin: '0 auto', padding: '72px 32px 96px' }}>
        <div
          style={{
            borderRadius: '28px',
            background: '#f2f8fc',
            border: '1px solid rgba(2,132,199,0.10)',
            padding: '40px 44px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '32px',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8fa5b3', marginBottom: '10px' }}>
              {t('Bữa sáng', 'Breakfast')}
            </div>
            <div style={{ fontSize: '14.5px', fontWeight: 700, lineHeight: 1.5, color: '#0b1b26' }}>
              {t('Set kiểu Á hoặc gọi món, tại sân hiên từ 06:30', 'Asian set or à la carte, on the terrace from 06:30')}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8fa5b3', marginBottom: '10px' }}>
              {t('Miễn phí cho khách lưu trú', 'Included for guests')}
            </div>
            <div style={{ fontSize: '14.5px', fontWeight: 700, lineHeight: 1.5, color: '#0b1b26' }}>
              {t('Cà phê túi lọc và trà lúc bình minh, trên boong cao', 'Filter coffee and tea at sunrise, on the top deck')}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8fa5b3', marginBottom: '10px' }}>
              {t('Đoàn & nhóm', 'Group bookings')}
            </div>
            <div style={{ fontSize: '14.5px', fontWeight: 700, lineHeight: 1.5, color: '#0b1b26' }}>
              {t('Set menu cho nhóm 10+ đặt trước 1 ngày', 'Set menus for 10+ arranged a day ahead')}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8fa5b3', marginBottom: '10px' }}>
              {t('Đặt bàn', 'Reservations')}
            </div>
            <a href="tel:0985000650" style={{ fontSize: '19px', fontWeight: 800, color: '#0284c7', textDecoration: 'none' }}>
              0985 000 650
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
