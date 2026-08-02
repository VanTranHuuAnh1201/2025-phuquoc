'use client'

import React, { useState, useEffect } from 'react'

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

  // Island spots
  'ndh-island-haibodap': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  'ndh-island-honmau': 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80',
  'ndh-spot-caymen': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  'ndh-spot-haidang': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',

  // Blog
  'ndh-blog-tau-ra-nam-du-hero': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
  'ndh-blog-tau-ra-nam-du-b4': 'https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?auto=format&fit=crop&w=800&q=80',
  'ndh-blog-phong-hang-da-hero': '/uploads/pasted-1785689529606-0.png',
  'ndh-blog-phong-hang-da-b4': '/uploads/pasted-1785689827914-0.png',
  'ndh-blog-an-gi-o-nam-du-hero': 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=80',
  'ndh-blog-ba-ngay-o-dao-hero': '/uploads/pasted-1785691965790-0.png',
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
