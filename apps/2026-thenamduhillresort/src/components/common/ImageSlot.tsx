'use client'

import React, { useEffect, useState } from 'react'

const DEFAULT_FALLBACK = '/uploads/pasted-1785690604574-0.png'

const IMAGE_MAP: Record<string, string> = {
  // Pool
  'ndh-pool': '/uploads/pasted-1785690635080-0.png',

  // Rooms (Crawled seed data)
  'ndh-room-14': 'https://thenamduhill.com/image/catalog/room-suite/14-rock-deluxe-room/cover14.jpg',
  'ndh-room-05': 'https://thenamduhill.com/image/catalog/room-suite/5-phong-tieu-chuan-luc-giac/full.jpg',
  'ndh-room-07': 'https://thenamduhill.com/image/catalog/room-suite/7-phong-superior-co-giuong-co-king/dai-dien-2.jpg',

  // Dining Venues
  'ndh-dining-hero': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
  'ndh-dining-restaurant': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
  'ndh-dining-bar': 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
  'ndh-dining-bbq': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
  'ndh-bbq': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',

  // Dishes
  'ndh-dish-goica': 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
  'ndh-goica': 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
  'ndh-dish-chao': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
  'ndh-dish-lau': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
  'ndh-lau': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
  'ndh-dish-nuong': 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
  'ndh-muc': 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',

  // Cụm đảo vệ tinh — 4 đảo trong `satelliteIslands` của core
  'ndh-island-haibodap': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  'ndh-island-honmau': 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80',
  // Hòn Dầu: 90% rừng nguyên sinh, dừa ngả ra mặt nước
  'ndh-island-hondau': 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=80',
  // Hòn Ngang: làng bè nổi, vùng biển êm nhất quần đảo
  'ndh-island-honngang': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80',

  // Điểm dừng chân trên Hòn Lớn — 6 spot trong `exploreSpots` của core
  'ndh-spot-caymen': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  'ndh-spot-haidang': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
  // Bãi Ngự & Giếng Vua: vịnh phía Tây, nước ngọt sát bờ biển
  'ndh-spot-baingu': 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?auto=format&fit=crop&w=800&q=80',
  // Bãi Chệt: bến tàu chính, chợ hải sản tươi sống
  'ndh-spot-baichet': 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=800&q=80',
  // Dinh Ông Nam Hải: đền thờ ven biển
  'ndh-spot-dinhong': 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80',
  // Chợ đêm Nam Du: hải sản nướng, đèn chợ lên lúc 19 giờ
  'ndh-spot-chodem': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',

  // Blog
  'ndh-blog-tau-ra-nam-du-hero': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
  'ndh-blog-tau-ra-nam-du-b4': 'https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?auto=format&fit=crop&w=800&q=80',
  'ndh-blog-phong-hang-da-hero': '/uploads/pasted-1785689529606-0.png',
  'ndh-blog-phong-hang-da-b4': '/uploads/pasted-1785689827914-0.png',
  'ndh-blog-an-gi-o-nam-du-hero': 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=80',
  'ndh-blog-ba-ngay-o-dao-hero': '/uploads/pasted-1785691965790-0.png',
  'ndh-explore-hero': '/uploads/hai-dang-Ke-Ga-2.jpg',
}

interface ImageSlotProps {
  id?: string
  placeholder?: string
  src?: string
  alt?: string
  style?: React.CSSProperties
  className?: string
}

export function ImageSlot({ id, placeholder, src, alt, style, className }: ImageSlotProps) {
  const initialSrc = src || (id && IMAGE_MAP[id]) || DEFAULT_FALLBACK
  const [imgSrc, setImgSrc] = useState(initialSrc)

  useEffect(() => {
    setImgSrc(initialSrc)
  }, [initialSrc])

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...style,
      }}
      className={className}
    >
      <img
        src={imgSrc}
        alt={alt || placeholder || 'The Nam Du Hill'}
        onError={() => {
          if (imgSrc !== DEFAULT_FALLBACK) {
            setImgSrc(DEFAULT_FALLBACK)
          }
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: 'transform 500ms ease',
        }}
      />
    </div>
  )
}
