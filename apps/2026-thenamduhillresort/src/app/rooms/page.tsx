'use client'

import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { ImageSlot } from '../../components/common/ImageSlot'

const ROOM_LIST = [
  {
    id: 'room-14',
    name: 'Rock Deluxe #14',
    badge: 'ĐỘC BẢN',
    desc: 'Vách đá tự nhiên trong phòng ngủ, phòng tắm trong hang đá, lò sưởi Châu Âu, suối chảy nội khu.',
    descEn: 'Natural cliff wall in bedroom, cave bathroom, European fireplace, internal stream.',
    size: '21 m²',
    guests: '2 khách',
    tag: 'Lò sưởi',
    price: '1.776.000₫',
    imgId: 'ndh-room-14',
    cat: 'signature',
  },
  {
    id: 'room-05',
    name: 'Lục Giác Khung Kính #05',
    badge: 'ĐƯỢC ĐẶT NHIỀU',
    desc: 'Lục giác hai tầng bọc kính — ngắm 360° rừng và biển ngay tại giường.',
    descEn: 'Two-storey hexagon wrapped in glass — 360° forest and sea view.',
    size: '42 m²',
    guests: '2 khách',
    tag: 'Kính 360°',
    price: '1.546.000₫',
    imgId: 'ndh-room-05',
    cat: 'signature',
  },
  {
    id: 'room-07',
    name: 'Superior King #07',
    desc: '53 m² với bồn sục Jacuzzi riêng và bàn trang điểm gỗ mộc hướng thung lũng.',
    descEn: '53 m² with private Jacuzzi and raw-wood vanity facing the valley.',
    size: '53 m²',
    guests: '3 khách',
    tag: 'Jacuzzi',
    price: '2.971.000₫',
    imgId: 'ndh-room-07',
    cat: 'signature',
  },
  {
    id: 'room-08',
    name: 'Gia Đình Gác Lửng #08',
    desc: 'Thiết kế gác lửng ấm cúng, 2 giường đôi lớn, ban công ngắm toàn cảnh thung lũng.',
    descEn: 'Cozy loft design, 2 large double beds, panoramic valley balcony.',
    size: '48 m²',
    guests: '4 khách',
    tag: 'Gác lửng',
    price: '3.088.000₫',
    imgId: 'ndh-pool',
    cat: 'family',
  },
  {
    id: 'room-08-09',
    name: 'Suite Gia Đình #08-09',
    desc: 'Căn hộ liên thông 2 tầng dành cho đại gia đình hoặc nhóm bạn, đầy đủ tiện nghi.',
    descEn: 'Connecting two-floor family suite ideal for large groups.',
    size: '85 m²',
    guests: '8 khách',
    tag: 'Suite lớn',
    price: '5.662.000₫',
    imgId: 'ndh-room-05',
    cat: 'family',
  },
  {
    id: 'room-01',
    name: 'Hilltop Sea View #01',
    desc: 'Phòng view biển ngắm trọn bình minh Nam Du từ giường ngủ.',
    descEn: 'Sea view room capturing sunrise directly from bed.',
    size: '28 m²',
    guests: '2 khách',
    tag: 'View biển',
    price: '1.450.000₫',
    imgId: 'ndh-room-14',
    cat: 'standard',
  },
]

export default function RoomsPage() {
  const { t } = useLanguage()
  const [filter, setFilter] = useState<'all' | 'signature' | 'family' | 'standard'>('all')

  const filteredRooms = filter === 'all' ? ROOM_LIST : ROOM_LIST.filter((r) => r.cat === filter)

  return (
    <main style={{ paddingTop: '110px', minHeight: '100vh', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 32px' }}>
        {/* Header Title */}
        <div style={{ marginBottom: '40px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.16em', color: '#00a85c', textTransform: 'uppercase' }}>
            {t('DANH SÁCH PHÒNG NGHỈ', 'ROOM CATEGORIES')}
          </span>
          <h1 style={{ margin: '12px 0 16px', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: '#0b1b26', letterSpacing: '-0.03em' }}>
            {t('20 Hạng Phòng Nghỉ Tại Nam Du Hill', '20 Room Types at Nam Du Hill')}
          </h1>
          <p style={{ fontSize: '16px', color: '#566e7d', maxWidth: '680px', lineHeight: 1.6 }}>
            {t(
              'Từ các căn Bungalow vách đá độc bản đến phòng kính 360° ngắm biển trời. Mọi căn phòng đều có ban công riêng và đón gió biển tự nhiên.',
              'From unique cliffside bungalows to 360° glass suites overlooking the ocean.'
            )}
          </p>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '36px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '10px 22px',
              borderRadius: '999px',
              border: filter === 'all' ? 'none' : '1px solid #cbd5e1',
              background: filter === 'all' ? '#0284c7' : '#ffffff',
              color: filter === 'all' ? '#ffffff' : '#475569',
              fontWeight: 700,
              fontSize: '13.5px',
              cursor: 'pointer',
            }}
          >
            {t('Tất cả phòng', 'All rooms')}
          </button>
          <button
            onClick={() => setFilter('signature')}
            style={{
              padding: '10px 22px',
              borderRadius: '999px',
              border: filter === 'signature' ? 'none' : '1px solid #cbd5e1',
              background: filter === 'signature' ? '#0284c7' : '#ffffff',
              color: filter === 'signature' ? '#ffffff' : '#475569',
              fontWeight: 700,
              fontSize: '13.5px',
              cursor: 'pointer',
            }}
          >
            {t('Hạng độc bản', 'Signatures')}
          </button>
          <button
            onClick={() => setFilter('family')}
            style={{
              padding: '10px 22px',
              borderRadius: '999px',
              border: filter === 'family' ? 'none' : '1px solid #cbd5e1',
              background: filter === 'family' ? '#0284c7' : '#ffffff',
              color: filter === 'family' ? '#ffffff' : '#475569',
              fontWeight: 700,
              fontSize: '13.5px',
              cursor: 'pointer',
            }}
          >
            {t('Phòng gia đình', 'Family suites')}
          </button>
        </div>

        {/* Room Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredRooms.map((room) => (
            <article
              key={room.id}
              id={room.id}
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                background: '#ffffff',
                border: '1px solid #e6eef4',
                boxShadow: '0 4px 18px rgba(6,40,58,0.06)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ position: 'relative', height: '240px' }}>
                <ImageSlot id={room.imgId} placeholder={room.name} style={{ position: 'absolute', inset: 0 }} />
                {room.badge && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      background: 'rgba(11,27,38,0.85)',
                      backdropFilter: 'blur(8px)',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '6px 12px',
                      borderRadius: '999px',
                    }}
                  >
                    {room.badge}
                  </span>
                )}
              </div>

              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ margin: '0 0 8px', fontSize: '21px', fontWeight: 800, color: '#0b1b26' }}>
                  {room.name}
                </h3>
                <p style={{ margin: '0 0 18px', fontSize: '14px', color: '#566e7d', lineHeight: 1.55 }}>
                  {t(room.desc, room.descEn)}
                </p>

                <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#3d5462', background: '#f2f8fc', padding: '6px 11px', borderRadius: '8px' }}>
                    {room.size}
                  </span>
                  <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#3d5462', background: '#f2f8fc', padding: '6px 11px', borderRadius: '8px' }}>
                    {room.guests}
                  </span>
                  <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#3d5462', background: '#f2f8fc', padding: '6px 11px', borderRadius: '8px' }}>
                    {room.tag}
                  </span>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: '18px', borderTop: '1px solid #eef4f8' }}>
                  <div>
                    <span style={{ fontSize: '22px', fontWeight: 800, color: '#0b1b26' }}>{room.price}</span>
                    <span style={{ fontSize: '12.5px', color: '#8fa5b3' }}>{t('/đêm', '/night')}</span>
                  </div>
                  <a
                    href="tel:0985000650"
                    style={{
                      background: '#0284c7',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 700,
                      padding: '11px 20px',
                      borderRadius: '999px',
                      textDecoration: 'none',
                    }}
                  >
                    {t('Đặt giữ phòng', 'Book room')}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
