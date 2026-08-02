'use client'

import React from 'react'

const IMAGE_MAP: Record<string, string> = {
  'ndh-pool': '/uploads/pasted-1785608001958-0.png',
  'ndh-room-14': '/uploads/pasted-1785607149739-0.png',
  'ndh-room-05': '/uploads/pasted-1785607295384-0.png',
  'ndh-room-07': '/uploads/pasted-1785607796156-0.png',
  'ndh-bbq': '/uploads/pasted-1785607821771-0.png',
  'ndh-goica': '/uploads/pasted-1785607752468-0.png',
  'ndh-lau': '/uploads/pasted-1785607766498-0.png',
  'ndh-muc': '/uploads/pasted-1785607713755-0.png',
  'ndh-island-haibodap': '/uploads/pasted-1785689810524-0.png',
  'ndh-island-honmau': '/uploads/pasted-1785689827914-0.png',
  'ndh-spot-caymen': '/uploads/pasted-1785689832530-0.png',
  'ndh-spot-haidang': '/uploads/pasted-1785689833000-0.png',
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
  const finalSrc = src || (id && IMAGE_MAP[id]) || '/uploads/hero-1.jpg'

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
