'use client'

import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { ImageSlot } from '../../components/common/ImageSlot'

const MENU_ITEMS = [
  {
    category: 'MÓN ĐẶC SẢN NAM DU',
    categoryEn: 'NAM DU SPECIALTIES',
    items: [
      { name: 'Gỏi cá trích Nam Du', desc: 'Cá trích tươi dừa nạo & rau rừng nguyên bản', price: '180.000₫', imgId: 'ndh-goica' },
      { name: 'Lẩu hải sản chua cay', desc: 'Tôm, mực, cá bớp đánh bắt trong ngày', price: '350.000₫', imgId: 'ndh-lau' },
      { name: 'Mực nướng sa tế', desc: 'Mực ống nướng than hoa thơm lừng', price: '220.000₫', imgId: 'ndh-muc' },
      { name: 'Cháo cá đập đập', desc: 'Cháo cá truyền thống đồi Nam Du', price: '150.000₫', imgId: 'ndh-bbq' },
    ],
  },
  {
    category: 'SUNSET CAFÉ & COCKTAILS',
    categoryEn: 'SUNSET CAFÉ & COCKTAILS',
    items: [
      { name: 'Cà phê phin Củ Tron', desc: 'Đậm đà phong vị biển đảo', price: '35.000₫', imgId: 'ndh-pool' },
      { name: 'Trà hoa đậu biếc chanh dây', desc: 'Thức uống mát lành ngắm hoàng hôn', price: '45.000₫', imgId: 'ndh-room-05' },
      { name: 'Nam Du Sunset Cocktail', desc: 'Rượu rum, chanh leo, dừa xiêm nhiệt đới', price: '95.000₫', imgId: 'ndh-pool' },
    ],
  },
]

export default function DiningPage() {
  const { t } = useLanguage()

  return (
    <main style={{ paddingTop: '110px', minHeight: '100vh', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 32px' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '40px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.16em', color: '#00a85c', textTransform: 'uppercase' }}>
            {t('ẨM THỰC ĐẢO NAM DU', 'ISLAND CUISINE')}
          </span>
          <h1 style={{ margin: '12px 0 16px', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: '#0b1b26', letterSpacing: '-0.03em' }}>
            {t('Hải Sản Tươi Sống & Sunset Bar', 'Fresh Seafood & Sunset Bar')}
          </h1>
          <p style={{ fontSize: '16px', color: '#566e7d', maxWidth: '680px', lineHeight: 1.6 }}>
            {t(
              'Thưởng thức hải sản được đánh bắt và mua trực tiếp tại bến tàu Củ Tron mỗi sáng. Tiệc BBQ ngoài trời dưới trời sao từ 18:30 hàng ngày.',
              'Enjoy fresh seafood landed daily at Cu Tron pier. Outdoor seafood BBQ every evening from 18:30.'
            )}
          </p>
        </div>

        {/* Menu Sections */}
        {MENU_ITEMS.map((sec, idx) => (
          <div key={idx} style={{ marginBottom: '50px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0284c7', letterSpacing: '0.05em', marginBottom: '24px' }}>
              {t(sec.category, sec.categoryEn)}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {sec.items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    padding: '16px',
                    borderRadius: '20px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ width: '80px', height: '80px', borderRadius: '14px', overflow: 'hidden', flexShrink: 0 }}>
                    <ImageSlot id={item.imgId} placeholder={item.name} />
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 800, color: '#0b1b26' }}>{item.name}</h3>
                    <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#64748b' }}>{item.desc}</p>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#0284c7' }}>{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
