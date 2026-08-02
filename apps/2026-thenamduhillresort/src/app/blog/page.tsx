'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'
import { BLOG_POSTS, BlogPost } from '../../data/blog'
import { ImageSlot } from '../../components/common/ImageSlot'

export default function BlogPage() {
  const { t, language } = useLanguage()
  const isEn = language === 'en'
  const [activeCategory, setActiveCategory] = useState<string>('ALL')

  const categories = [
    { key: 'ALL', vi: 'Tất cả bài viết', en: 'All articles' },
    { key: 'DI CHUYỂN', enKey: 'GETTING THERE', vi: 'Di chuyển', en: 'Getting there' },
    { key: 'HẬU TRƯỜNG', enKey: 'BEHIND THE SCENES', vi: 'Hậu trường', en: 'Behind the scenes' },
    { key: 'ẨM THỰC', enKey: 'FOOD', vi: 'Ẩm thực', en: 'Food' },
    { key: 'LỊCH TRÌNH', enKey: 'ITINERARY', vi: 'Lịch trình', en: 'Itinerary' },
  ]

  const filteredPosts = BLOG_POSTS.filter((p) => {
    if (activeCategory === 'ALL') return true
    return p.categoryVi === activeCategory || p.categoryEn === activeCategory
  })

  const heroPost = BLOG_POSTS[0]

  return (
    <main className="nd-page-main" style={{ paddingTop: '90px', minHeight: '100vh', background: '#ffffff', color: '#0b1b26' }}>
      {/* Breadcrumb & Header */}
      <section className="nd-section-container" style={{ maxWidth: '1320px', margin: '0 auto', padding: '24px 32px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', fontWeight: 600, color: '#8fa5b3', marginBottom: '24px' }}>
          <Link href="/" style={{ color: '#8fa5b3', textDecoration: 'none' }}>
            {t('Trang chủ', 'Home')}
          </Link>
          <span>›</span>
          <span style={{ color: '#0b1b26' }}>{t('Cẩm nang Nam Du', 'Nam Du Journal')}</span>
        </div>

        <div style={{ maxWidth: '800px', marginBottom: '40px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#0284c7', display: 'block', marginBottom: '10px' }}>
            {t('Ghi chép từ hilltop resort', 'Notes from the hilltop resort')}
          </span>
          <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.08, margin: '0 0 16px', textWrap: 'balance' }}>
            {t('Cẩm nang du lịch & câu chuyện từ Nam Du', 'Travel guide & stories from Nam Du')}
          </h1>
          <p style={{ fontSize: '17px', lineHeight: 1.6, color: '#566e7d', margin: 0 }}>
            {t(
              'Những kinh nghiệm đúc kết sau 7 năm đón khách lên đồi: từ vé tàu, món ngon theo mùa đến cách đi biển mà không bị say sóng.',
              'Insights gathered over 7 years of receiving guests on the hill: boat tickets, seasonal dishes, and navigating the sea without motion sickness.'
            )}
          </p>
        </div>

        {/* Featured Hero Article */}
        {heroPost && (
          <div
            style={{
              borderRadius: '28px',
              overflow: 'hidden',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '0',
              marginBottom: '56px',
              boxShadow: '0 12px 32px rgba(6,40,58,0.06)',
            }}
          >
            <div style={{ position: 'relative', minHeight: '340px', background: '#eef4f8' }}>
              <Link href={`/blog/${heroPost.id}`} style={{ display: 'block', position: 'absolute', inset: 0 }}>
                <ImageSlot id={heroPost.heroSlot} placeholder={isEn ? heroPost.titleEn : heroPost.titleVi} style={{ position: 'absolute', inset: 0 }} />
              </Link>
              <span
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  background: '#0284c7',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '6px 14px',
                  borderRadius: '999px',
                }}
              >
                {t('Nổi bật', 'Featured')}
              </span>
            </div>

            <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '11.5px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0284c7', marginBottom: '10px' }}>
                {isEn ? heroPost.categoryEn : heroPost.categoryVi}
              </div>
              <h2 style={{ fontSize: 'clamp(22px, 2.5vw, 30px)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.2, margin: '0 0 14px' }}>
                <Link href={`/blog/${heroPost.id}`} style={{ color: '#0b1b26', textDecoration: 'none' }}>
                  {isEn ? heroPost.titleEn : heroPost.titleVi}
                </Link>
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.65, color: '#566e7d', margin: '0 0 24px' }}>
                {isEn ? heroPost.ledeEn : heroPost.ledeVi}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginTop: 'auto' }}>
                <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#8fa5b3' }}>
                  {isEn ? heroPost.authorEn : heroPost.authorVi} · {isEn ? heroPost.dateEn : heroPost.dateVi} · {heroPost.readMin} {t('phút đọc', 'min read')}
                </div>
                <Link
                  href={`/blog/${heroPost.id}`}
                  style={{
                    background: '#0284c7',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    padding: '10px 20px',
                    borderRadius: '999px',
                    textDecoration: 'none',
                  }}
                >
                  {t('Đọc bài viết →', 'Read article →')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Filter Categories Bar */}
      <div style={{ background: '#f8fafc', borderTop: '1px solid #eef4f8', borderBottom: '1px solid #eef4f8', padding: '16px 0', marginBottom: '48px' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 32px', display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {categories.map((c) => {
            const active = activeCategory === c.key || activeCategory === c.enKey
            return (
              <button
                key={c.key}
                onClick={() => setActiveCategory(c.key)}
                style={{
                  border: `1px solid ${active ? '#0284c7' : '#dbe7ef'}`,
                  background: active ? '#0284c7' : '#ffffff',
                  color: active ? '#ffffff' : '#3d5462',
                  fontSize: '13px',
                  fontWeight: 700,
                  padding: '9px 18px',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 150ms ease',
                }}
              >
                {isEn ? c.en : c.vi}
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid of Articles */}
      <section className="nd-section-container" style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 32px 80px' }}>
        <div className="nd-grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px' }}>
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="nd-card nd-card-img-zoom"
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                background: '#ffffff',
                border: '1px solid #e6eef4',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
              }}
            >
              <div style={{ position: 'relative', height: '220px', background: '#eef4f8' }}>
                <Link href={`/blog/${post.id}`} style={{ display: 'block', position: 'absolute', inset: 0 }}>
                  <ImageSlot id={post.heroSlot} placeholder={isEn ? post.titleEn : post.titleVi} style={{ position: 'absolute', inset: 0 }} />
                </Link>
                <span
                  style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    background: 'rgba(6,40,58,0.85)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    fontSize: '10.5px',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    padding: '5px 11px',
                    borderRadius: '999px',
                  }}
                >
                  {isEn ? post.categoryEn : post.categoryVi}
                </span>
              </div>

              <div style={{ padding: '22px 24px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.3, margin: '0 0 10px' }}>
                  <Link href={`/blog/${post.id}`} style={{ color: '#0b1b26', textDecoration: 'none' }}>
                    {isEn ? post.titleEn : post.titleVi}
                  </Link>
                </h3>
                <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#566e7d', margin: '0 0 18px', flex: 1 }}>
                  {isEn ? post.ledeEn : post.ledeVi}
                </p>

                <div style={{ paddingTop: '16px', borderTop: '1px solid #eef4f8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#8fa5b3' }}>
                    {isEn ? post.dateEn : post.dateVi} · {post.readMin} {t('phút', 'min')}
                  </div>
                  <Link
                    href={`/blog/${post.id}`}
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#0284c7',
                      textDecoration: 'none',
                    }}
                  >
                    {t('Chi tiết →', 'Read →')}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
