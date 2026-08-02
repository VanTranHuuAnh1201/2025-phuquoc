'use client'

import React from 'react'
import { useLanguage } from '../../context/LanguageContext'

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function VideoModal({ isOpen, onClose }: VideoModalProps) {
  const { t } = useLanguage()

  if (!isOpen) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: 'rgba(4,16,26,0.88)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '1040px' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '20px',
            marginBottom: '14px',
          }}
        >
          <div>
            <div style={{ fontSize: '19px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              {t('The Nam Du Hill — phim giới thiệu', 'The Nam Du Hill — the film')}
            </div>
            <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.62)', marginTop: '3px' }}>
              {t('3 phút, quay tại đỉnh đồi', '3 minutes, shot on the hill')}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.28)',
              background: 'rgba(255,255,255,0.10)',
              color: '#ffffff',
              fontSize: '19px',
              cursor: 'pointer',
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            background: '#000000',
            aspectRatio: '16 / 9',
          }}
        >
          <video
            controls
            autoPlay
            playsInline
            poster="/uploads/pasted-1785690578814-0.png"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', background: '#000000' }}
          >
            <source src="/uploads/mv-namdu.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  )
}
