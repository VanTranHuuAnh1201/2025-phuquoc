'use client'

import React from 'react'

const IMAGE_MAP: Record<string, string> = {
  'ndh-pool': 'https://thenamduhill.com/image/catalog/news/experiences-feel/ho-boi-1.jpg',
  'ndh-room-14': 'https://thenamduhill.com/image/catalog/room-suite/14-rock-deluxe-room/cover14.jpg',
  'ndh-room-05': 'https://thenamduhill.com/image/catalog/room-suite/5-phong-tieu-chuan-luc-giac/full.jpg',
  'ndh-room-07': 'https://thenamduhill.com/image/catalog/room-suite/7-phong-superior-co-giuong-co-king/dai-dien-2.jpg',
  'ndh-bbq': 'https://thenamduhill.com/image/catalog/news/winning-dinning/nha-hang-3.jpg',
  'ndh-goica': 'https://thenamduhill.com/image/catalog/news/winning-dinning/mon-an-1.jpg',
  'ndh-lau': 'https://thenamduhill.com/image/catalog/news/winning-dinning/mon-an-2.jpg',
  'ndh-muc': 'https://thenamduhill.com/image/catalog/news/winning-dinning/mon-an-3.jpg',
  'ndh-island-haibodap': 'https://thenamduhill.com/image/catalog/news/news-1.png',
  'ndh-island-honmau': 'https://thenamduhill.com/image/catalog/news/news-2.png',
  'ndh-spot-caymen': 'https://thenamduhill.com/image/catalog/news/news-3.png',
  'ndh-spot-haidang': 'https://thenamduhill.com/image/catalog/news/news-4.png',
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
  const finalSrc = src || (id && IMAGE_MAP[id]) || 'https://thenamduhill.com/image/catalog/banner/namdu-3.jpg'

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
        src={finalSrc}
        alt={alt || placeholder || 'The Nam Du Hill'}
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
