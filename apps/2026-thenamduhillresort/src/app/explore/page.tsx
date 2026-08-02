'use client'

import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { ImageSlot } from '../../components/common/ImageSlot'

export default function ExplorePage() {
  const { t } = useLanguage()

  return (
    <main style={{ paddingTop: '110px', minHeight: '100vh', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 32px' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '40px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.16em', color: '#00a85c', textTransform: 'uppercase' }}>
            {t('CẨM NANG DU LỊCH', 'TRAVEL GUIDE')}
          </span>
          <h1 style={{ margin: '12px 0 16px', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: '#0b1b26', letterSpacing: '-0.03em' }}>
            {t('Khám Phá Quần Đảo Nam Du', 'Explore Nam Du Archipelago')}
          </h1>
          <p style={{ fontSize: '16px', color: '#566e7d', maxWidth: '680px', lineHeight: 1.6 }}>
            {t(
              'Quần đảo Nam Du gồm 21 hòn đảo lớn nhỏ nằm tại Vịnh Thái Lan. Hãy cùng Nam Du Hill lên lịch trình trọn vẹn nhất cho chuyến đi của bạn.',
              'Nam Du Archipelago consists of 21 islands in the Gulf of Thailand.'
            )}
          </p>
        </div>

        {/* Highlighted Locations */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '60px' }}>
          <div style={{ background: '#f8fafc', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <div style={{ height: '180px', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' }}>
              <ImageSlot id="ndh-island-haibodap" placeholder="Hòn Hai Bờ Đập" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0b1b26', marginBottom: '8px' }}>Hòn Hai Bờ Đập</h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.5 }}>
              {t('Dải đá tự nhiên nối liền 2 hòn đảo nhỏ. Địa điểm lý tưởng nhất để lặn ngắm san hô và bắt nhum biển.', 'Natural rock causeway connecting two islets.')}
            </p>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <div style={{ height: '180px', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' }}>
              <ImageSlot id="ndh-island-honmau" placeholder="Hòn Mấu" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0b1b26', marginBottom: '8px' }}>Hòn Mấu</h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.5 }}>
              {t('Sở hữu 5 bãi biển thơ mộng với dải cát trắng mịn và hàng dừa nghiêng bóng.', 'Features 5 pristine beaches with white sand and coconut trees.')}
            </p>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <div style={{ height: '180px', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' }}>
              <ImageSlot id="ndh-spot-caymen" placeholder="Bãi Cây Mến" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0b1b26', marginBottom: '8px' }}>Bãi Cây Mến</h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.5 }}>
              {t('Bãi biển đẹp nhất đảo Hòn Lớn chỉ cách Nam Du Hill 4 phút đi xe máy.', 'The most beautiful beach on the main island, 4 mins by bike.')}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
