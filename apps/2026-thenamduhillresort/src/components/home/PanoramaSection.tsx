'use client'

import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'

const STAGES = [
  {
    sky: 'linear-gradient(178deg, #bae6fd 0%, #7dd3fc 34%, #38bdf8 68%, #0284c7 100%)',
    sunLeft: '76%',
    sunTop: '150px',
    sunBg: 'radial-gradient(circle, #ffffff 0%, #fff3c4 48%, #ffd166 100%)',
    sunGlow: '0 0 90px 34px rgba(255,240,190,0.42)',
    photo: 'https://thenamduhill.com/image/catalog/banner/namdu-3.jpg',
    timeLabel: '06:10 · Sáng sớm trên sân hiên',
    timeLabelEn: '06:10 · First light on the terrace',
    timeSub: 'Cà phê được dọn ra sân hiên từ 06:00',
    timeSubEn: 'Coffee is served on the terrace from 06:00',
  },
  {
    sky: 'linear-gradient(178deg, #38bdf8 0%, #0ea5e9 42%, #0284c7 78%, #075985 100%)',
    sunLeft: '50%',
    sunTop: '34px',
    sunBg: 'radial-gradient(circle, #ffffff 0%, #fff3c4 50%, #ffd166 100%)',
    sunGlow: '0 0 110px 44px rgba(255,255,255,0.38)',
    photo: 'https://thenamduhill.com/image/catalog/banner/banner2.jpg',
    timeLabel: '12:20 · Giữa trưa, vịnh Củ Tron xanh ngọc',
    timeLabelEn: '12:20 · Midday over Cu Tron bay',
    timeSub: 'Hồ bơi vắng nhất vào giờ này',
    timeSubEn: 'The pool is emptiest at this hour',
  },
  {
    sky: 'linear-gradient(178deg, #fbbf24 0%, #fb7185 32%, #9333ea 68%, #312e81 100%)',
    sunLeft: '20%',
    sunTop: '224px',
    sunBg: 'radial-gradient(circle, #ffe4a3 0%, #fb923c 45%, #e11d48 100%)',
    sunGlow: '0 0 100px 40px rgba(251,146,60,0.44)',
    photo: 'https://thenamduhill.com/image/catalog/banner/namdu-2.jpg',
    timeLabel: '18:05 · Hoàng hôn xuống bến Củ Tron',
    timeLabelEn: '18:05 · Sunset over Cu Tron pier',
    timeSub: 'Trời chuyển màu trong khoảng hai mươi phút',
    timeSubEn: 'The sky turns over about twenty minutes',
  },
  {
    sky: 'linear-gradient(178deg, #0b1b26 0%, #082f49 46%, #0c4a6e 78%, #155e75 100%)',
    sunLeft: '15%',
    sunTop: '300px',
    sunBg: 'radial-gradient(circle, #ffd166 0%, #f2724b 60%, rgba(242,114,75,0) 100%)',
    sunGlow: '0 0 70px 26px rgba(255,196,84,0.20)',
    photo: 'https://thenamduhill.com/application/assets/img/bg-video-home.jpg',
    timeLabel: '20:30 · Resort lên đèn, chợ đêm sáng dưới chân đồi',
    timeLabelEn: '20:30 · The resort lights up over the night market',
    timeSub: 'Bar mở đến khuya, BBQ bắt đầu từ 18:30',
    timeSubEn: 'The bar runs late; BBQ starts at 18:30',
  },
]

export function PanoramaSection() {
  const { t, language } = useLanguage()
  const [stageIndex, setStageIndex] = useState(0)

  const current = STAGES[stageIndex]!

  return (
    <section id="panorama" style={{ margin: '100px 0 0', padding: '0 32px' }}>
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          borderRadius: '34px',
          overflow: 'hidden',
          position: 'relative',
          background: current.sky,
          padding: '62px 56px 46px',
          transition: 'background 700ms ease',
        }}
      >
        {/* Radial Dark Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(120% 70% at 50% 110%, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0) 60%)',
            pointerEvents: 'none',
          }}
        />

        {/* Sun Element */}
        <div
          style={{
            position: 'absolute',
            left: current.sunLeft,
            top: current.sunTop,
            width: '116px',
            height: '116px',
            borderRadius: '50%',
            background: current.sunBg,
            boxShadow: current.sunGlow,
            transform: 'translateX(-50%)',
            transition: 'all 700ms ease',
            pointerEvents: 'none',
          }}
        />

        {/* Grid Content */}
        <div
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '52px',
            alignItems: 'center',
          }}
        >
          {/* Controls Column */}
          <div>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.74)',
              }}
            >
              {t('Một chỗ đứng, bốn khung giờ', 'One viewpoint, four hours')}
            </span>

            <h2
              style={{
                margin: '14px 0 16px',
                fontSize: 'clamp(32px, 3.5vw, 44px)',
                lineHeight: 1.06,
                fontWeight: 800,
                letterSpacing: '-0.034em',
                color: '#ffffff',
                textWrap: 'balance',
              }}
            >
              {t('Kéo thử một ngày. Vẫn là sân hiên đó.', 'Drag through the day. This is the same terrace.')}
            </h2>

            <p
              style={{
                margin: '0 0 30px',
                fontSize: '16px',
                lineHeight: 1.62,
                color: 'rgba(255,255,255,0.86)',
                maxWidth: '460px',
              }}
            >
              {t(
                'Bốn tấm ảnh thật chụp từ sân hiên resort, từ lúc trời hửng đến khi chợ đêm lên đèn. Không có tấm nào là dựng hình.',
                'Four real photographs taken from the resort terrace, from first light to the night market coming on. Nothing here is a render.'
              )}
            </p>

            {/* Range Slider Box */}
            <div
              style={{
                background: 'rgba(255,255,255,0.14)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.24)',
                borderRadius: '22px',
                padding: '22px 24px',
              }}
            >
              <div
                style={{
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.84)',
                  marginBottom: '16px',
                  minHeight: '20px',
                }}
              >
                {language === 'en' ? current.timeSubEn : current.timeSub}
              </div>

              <input
                type="range"
                min="0"
                max="3"
                step="1"
                value={stageIndex}
                onChange={(e) => setStageIndex(parseInt(e.target.value, 10))}
                aria-label="Chọn thời điểm trong ngày"
                style={{ width: '100%', accentColor: '#ffffff', cursor: 'pointer', height: '4px' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', gap: '4px' }}>
                {[
                  { index: 0, vi: 'Sáng sớm', en: 'Early morning' },
                  { index: 1, vi: 'Giữa trưa', en: 'Midday' },
                  { index: 2, vi: 'Hoàng hôn', en: 'Sunset' },
                  { index: 3, vi: 'Lên đèn', en: 'After dark' },
                ].map((item) => (
                  <button
                    key={item.index}
                    onClick={() => setStageIndex(item.index)}
                    className="nd-interactive-pill"
                    style={{
                      border: 'none',
                      background: stageIndex === item.index ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.12)',
                      color: stageIndex === item.index ? '#0b1b26' : 'rgba(255,255,255,0.80)',
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '7px 12px',
                      borderRadius: '999px',
                      cursor: 'pointer',
                    }}
                  >
                    {t(item.vi, item.en)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Photo Display Column */}
          <div
            style={{
              position: 'relative',
              borderRadius: '26px',
              overflow: 'hidden',
              aspectRatio: '4 / 5',
              background: 'rgba(0,0,0,0.24)',
              boxShadow: '0 32px 72px rgba(0,0,0,0.34)',
            }}
          >
            <img
              src={current.photo}
              alt="Sân hiên The Nam Du Hill"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'opacity 350ms ease',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0) 48%, rgba(3,16,26,0.86) 100%)',
                pointerEvents: 'none',
              }}
            />
            <div style={{ position: 'absolute', left: '26px', right: '26px', bottom: '24px', pointerEvents: 'none' }}>
              <div style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.022em', color: '#ffffff', lineHeight: 1.2 }}>
                {language === 'en' ? current.timeLabelEn : current.timeLabel}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
