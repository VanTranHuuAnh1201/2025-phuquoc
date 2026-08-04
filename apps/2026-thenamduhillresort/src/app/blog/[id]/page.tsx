'use client'

import { UI } from '@repo/core'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams, notFound } from 'next/navigation'
import { useLanguage } from '../../../context/LanguageContext'
import { BLOG_POSTS, BlogPost } from '../../../data/blog'
import { ImageSlot } from '../../../components/common/ImageSlot'

export default function BlogPostDetailPage() {
  const params = useParams()
  const postId = params.id as string
  const { language, tx } = useLanguage()
  const isEn = language === 'en'

  const [copied, setCopied] = useState(false)

  const post = BLOG_POSTS.find((p) => p.id === postId)

  if (!post) {
    return (
      <div style={{ paddingTop: '140px', paddingBottom: '100px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800 }}>{tx(UI.articleNotFound)}</h1>
        <p style={{ color: '#566e7d', marginBottom: '24px' }}>
          {tx(UI.theRequestedArticleMayHaveBeen)}
        </p>
        <Link
          href="/blog"
          style={{
            background: '#0284c7',
            color: '#ffffff',
            fontWeight: 700,
            padding: '12px 24px',
            borderRadius: '999px',
            textDecoration: 'none',
          }}
        >
          {tx(UI.backToJournal)}
        </Link>
      </div>
    )
  }

  const title = isEn ? post.titleEn : post.titleVi
  const category = isEn ? post.categoryEn : post.categoryVi
  const lede = isEn ? post.ledeEn : post.ledeVi
  const author = isEn ? post.authorEn : post.authorVi
  const role = isEn ? post.roleEn : post.roleVi
  const date = isEn ? post.dateEn : post.dateVi
  const meta = `${date} · ${post.readMin} ${isEn ? 'min read' : 'phút đọc'}`
  const heroCaption = isEn ? post.heroCaptionEn : post.heroCaptionVi

  const authorInitials = author
    .split(' ')
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  const copyLink = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const otherPosts = BLOG_POSTS.filter((p) => p.id !== post.id)

  return (
    <main className="nd-page-main" style={{ paddingTop: '82px', minHeight: '100vh', background: '#ffffff', color: '#0b1b26' }}>
      {/* Breadcrumbs */}
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '16px 32px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 0 16px', fontSize: '12.5px', fontWeight: 600, color: '#8fa5b3', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#8fa5b3', textDecoration: 'none' }}>
            {tx(UI.home)}
          </Link>
          <span>›</span>
          <Link href="/blog" style={{ color: '#8fa5b3', textDecoration: 'none' }}>
            {tx(UI.namDuJournal)}
          </Link>
          <span>›</span>
          <span style={{ color: '#0b1b26', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
            {title}
          </span>
        </div>
      </div>

      {/* Main Content Layout */}
      <section style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 32px' }}>
        <div className="nd-grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.65fr) minmax(0, 1fr)', gap: '56px', alignItems: 'start' }}>
          {/* Article Main */}
          <article>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
              <span
                style={{
                  display: 'inline-block',
                  whiteSpace: 'nowrap',
                  background: '#0284c7',
                  color: '#ffffff',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  padding: '6px 12px',
                  borderRadius: '999px',
                }}
              >
                {category}
              </span>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#8fa5b3' }}>{meta}</span>
            </div>

            <h1
              style={{
                margin: '0 0 14px',
                fontSize: 'clamp(28px, 3.4vw, 44px)',
                lineHeight: 1.08,
                fontWeight: 800,
                letterSpacing: '-0.034em',
                color: '#0b1b26',
                textWrap: 'balance',
              }}
            >
              {title}
            </h1>

            <p style={{ margin: '0 0 24px', fontSize: '18px', lineHeight: 1.6, color: '#566e7d', maxWidth: '62ch' }}>{lede}</p>

            {/* Author Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 0 22px',
                borderTop: '1px solid #eef4f8',
                borderBottom: '1px solid #eef4f8',
                marginBottom: '28px',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#eef6fb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 800,
                  color: '#0284c7',
                  flexShrink: 0,
                }}
              >
                {authorInitials}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0b1b26' }}>{author}</span>
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#8fa5b3' }}>{role}</span>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={copyLink}
                  style={{
                    border: '1px solid #dbe7ef',
                    background: '#ffffff',
                    color: '#0b1b26',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    padding: '9px 14px',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    transition: 'background 150ms ease',
                  }}
                >
                  {copied ? tx(UI.copied) : tx(UI.copyLink)}
                </button>
              </div>
            </div>

            {/* Main Hero Image */}
            <div style={{ position: 'relative', height: '420px', borderRadius: '24px', overflow: 'hidden', background: '#eef4f8', marginBottom: '12px' }}>
              <ImageSlot id={post.heroSlot} placeholder={title} style={{ position: 'absolute', inset: 0 }} />
            </div>
            {heroCaption && <div style={{ fontSize: '12px', fontWeight: 500, color: '#8fa5b3', marginBottom: '34px' }}>{heroCaption}</div>}

            {/* Dynamic Body Blocks */}
            <div style={{ display: 'grid', gap: '22px' }}>
              {post.blocks.map((block, idx) => {
                if (block.kind === 'h') {
                  return (
                    <h2 key={idx} style={{ margin: '12px 0 6px', fontSize: '24px', fontWeight: 800, letterSpacing: '-0.026em', color: '#0b1b26' }}>
                      {isEn ? block.textEn : block.textVi}
                    </h2>
                  )
                }
                if (block.kind === 'p') {
                  return (
                    <p key={idx} style={{ margin: 0, fontSize: '16.5px', lineHeight: 1.75, color: '#3d5462', maxWidth: '66ch' }}>
                      {isEn ? block.textEn : block.textVi}
                    </p>
                  )
                }
                if (block.kind === 'q') {
                  return (
                    <blockquote
                      key={idx}
                      style={{
                        margin: 0,
                        borderLeft: '3px solid #00c46a',
                        padding: '4px 0 4px 22px',
                        fontSize: '19px',
                        lineHeight: 1.55,
                        fontWeight: 600,
                        letterSpacing: '-0.015em',
                        color: '#0b1b26',
                      }}
                    >
                      {isEn ? block.textEn : block.textVi}
                    </blockquote>
                  )
                }
                if (block.kind === 'i') {
                  return (
                    <div key={idx}>
                      <div style={{ position: 'relative', height: '300px', borderRadius: '20px', overflow: 'hidden', background: '#eef4f8' }}>
                        <ImageSlot id={block.slotId} placeholder={isEn ? block.textEn : block.textVi} style={{ position: 'absolute', inset: 0 }} />
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: '#8fa5b3', marginTop: '8px' }}>
                        {isEn ? block.captionEn : block.captionVi}
                      </div>
                    </div>
                  )
                }
                if (block.kind === 'l' && block.items) {
                  return (
                    <div key={idx} style={{ display: 'grid', gap: '9px', background: '#f7fbfd', border: '1px solid #e6eef4', borderRadius: '20px', padding: '22px 24px' }}>
                      {block.items.map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <span style={{ color: '#00c46a', fontSize: '13px', lineHeight: 1.6, flexShrink: 0 }}>✓</span>
                          <span style={{ fontSize: '15px', lineHeight: 1.6, color: '#3d5462' }}>{isEn ? item.en : item.vi}</span>
                        </div>
                      ))}
                    </div>
                  )
                }
                return null
              })}
            </div>

            {/* Article Tags */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', margin: '40px 0 0', paddingTop: '26px', borderTop: '1px solid #eef4f8' }}>
              {post.tags.map((tag, i) => (
                <span key={i} style={{ fontSize: '12.5px', fontWeight: 700, color: '#566e7d', background: '#f2f8fc', border: '1px solid #e6eef4', padding: '8px 14px', borderRadius: '999px' }}>
                  #{isEn ? tag.en : tag.vi}
                </span>
              ))}
            </div>
          </article>

          {/* Sidebar */}
          <aside style={{ position: 'sticky', top: '96px', display: 'grid', gap: '20px' }}>
            {/* Other articles box */}
            <div style={{ border: '1px solid #e6eef4', borderRadius: '24px', boxShadow: '0 14px 40px rgba(6,40,58,0.06)', padding: '24px', background: '#ffffff' }}>
              <div style={{ fontSize: '10.5px', fontWeight: 800, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#8fa5b3', marginBottom: '16px' }}>
                {tx(UI.moreFromJournal)}
              </div>
              <div style={{ display: 'grid', gap: '12px' }}>
                {otherPosts.map((op) => (
                  <Link
                    key={op.id}
                    href={`/blog/${op.id}`}
                    style={{
                      textDecoration: 'none',
                      display: 'grid',
                      gridTemplateColumns: '72px minmax(0, 1fr)',
                      gap: '13px',
                      alignItems: 'center',
                      padding: '8px',
                      borderRadius: '16px',
                      transition: 'background 150ms ease',
                    }}
                  >
                    <div style={{ position: 'relative', height: '60px', borderRadius: '12px', overflow: 'hidden', background: '#eef4f8' }}>
                      <ImageSlot id={op.heroSlot} placeholder={isEn ? op.titleEn : op.titleVi} style={{ position: 'absolute', inset: 0 }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0284c7', marginBottom: '4px' }}>
                        {isEn ? op.categoryEn : op.categoryVi}
                      </div>
                      <div style={{ fontSize: '13.5px', fontWeight: 700, letterSpacing: '-0.016em', color: '#0b1b26', lineHeight: 1.3, marginBottom: '4px' }}>
                        {isEn ? op.titleEn : op.titleVi}
                      </div>
                      <div style={{ fontSize: '11.5px', fontWeight: 500, color: '#8fa5b3' }}>
                        {isEn ? op.dateEn : op.dateVi}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div style={{ height: '1px', background: '#eef4f8', margin: '16px 0' }} />
              <Link href="/blog" style={{ fontSize: '13.5px', fontWeight: 700, color: '#0284c7', textDecoration: 'none' }}>
                {tx(UI.allJournalArticles)}
              </Link>
            </div>

            {/* Trip Booking Callout Box */}
            <div style={{ border: '1px solid #e6eef4', borderRadius: '24px', padding: '24px', background: '#f7fbfd' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0b1b26', marginBottom: '6px' }}>
                {tx(UI.planningYourIslandTrip)}
              </div>
              <div style={{ fontSize: '13px', lineHeight: 1.55, color: '#566e7d', marginBottom: '16px' }}>
                {tx(UI.bookDirectForBestRateFree)}
              </div>
              <div style={{ display: 'grid', gap: '8px' }}>
                <Link
                  href="/rooms"
                  style={{
                    textAlign: 'center',
                    background: '#0284c7',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 700,
                    padding: '14px 20px',
                    borderRadius: '14px',
                    textDecoration: 'none',
                  }}
                >
                  {tx(UI.see20RoomTypes)}
                </Link>
                <a
                  href="tel:0985000650"
                  style={{
                    textAlign: 'center',
                    border: '1px solid #dbe7ef',
                    background: '#ffffff',
                    color: '#0b1b26',
                    fontSize: '14px',
                    fontWeight: 700,
                    padding: '14px 20px',
                    borderRadius: '14px',
                    textDecoration: 'none',
                  }}
                >
                  {tx(UI.call0985000650)}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Bottom Carousel / Read Next section */}
      <section style={{ maxWidth: '1320px', margin: '0 auto', padding: '80px 32px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: '40px', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 800, letterSpacing: '-0.028em', color: '#0b1b26' }}>
            {tx(UI.keepReading)}
          </h2>
          <Link href="/blog" style={{ fontSize: '14px', fontWeight: 700, color: '#0284c7', whiteSpace: 'nowrap', textDecoration: 'none' }}>
            {tx(UI.allJournalArticles)}
          </Link>
        </div>

        <div className="nd-grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '18px' }}>
          {otherPosts.slice(0, 3).map((op) => (
            <Link
              key={op.id}
              href={`/blog/${op.id}`}
              style={{
                textDecoration: 'none',
                border: '1px solid #e6eef4',
                borderRadius: '22px',
                overflow: 'hidden',
                background: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ position: 'relative', height: '168px', background: '#eef4f8' }}>
                <ImageSlot id={op.heroSlot} placeholder={isEn ? op.titleEn : op.titleVi} style={{ position: 'absolute', inset: 0 }} />
              </div>
              <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0284c7', marginBottom: '6px' }}>
                  {isEn ? op.categoryEn : op.categoryVi}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0b1b26', lineHeight: 1.28, marginBottom: '8px' }}>
                  {isEn ? op.titleEn : op.titleVi}
                </div>
                <div style={{ fontSize: '13.5px', lineHeight: 1.55, color: '#566e7d', marginBottom: '12px', flex: 1 }}>
                  {isEn ? op.ledeEn : op.ledeVi}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#8fa5b3' }}>
                  {isEn ? op.dateEn : op.dateVi} · {op.readMin} {tx(UI.min)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
