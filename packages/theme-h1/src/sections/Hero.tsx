'use client'

import { useEffect, useState } from 'react'
import { pick, themePath, type Locale, type PropertyData } from '@repo/core'

import { meta } from '../meta'
import { ui } from '../strings'

const SLUG = meta.slug

const HERO_IMAGES = ['/hero-1.jpg', '/hero-2.jpg']

/**
 * Hero mẫu 01 — ảnh nền tràn màn hình dạng Banner Slider auto-slide 5s,
 * nội dung căn trái, thanh tìm kiếm nổi đè lên mép dưới.
 */

const FIELD: React.CSSProperties = {
    padding: '6px 26px',
    display: 'grid',
    gap: 3,
    alignContent: 'center',
    minWidth: 0,
    borderRight: '1px solid var(--border)',
}

const INPUT: React.CSSProperties = {
    width: '100%',
    border: 'none',
    background: 'transparent',
    fontSize: '14.5px',
    fontWeight: 700,
    color: 'var(--brand-light)',
    outline: 'none',
    padding: 0,
}

const LABEL: React.CSSProperties = {
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--text-muted)',
}

export function Hero({ data, locale }: { data: PropertyData; locale: Locale }) {
    const { hero } = data
    const t = ui[locale]
    const heroImages = hero.images?.length ? hero.images : HERO_IMAGES
    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [heroImages.length])

    return (
        <section
            id="top"
            style={{
                position: 'relative',
                minHeight: 'min(100vh, 860px)',
                overflow: 'hidden',
                background: 'var(--surface-inverse)',
            }}
        >
            {/* Auto-sliding Banner Images */}
            {heroImages.map((src, idx) => (
                <div
                    key={src}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: idx === currentSlide ? 1 : 0,
                        transition: 'opacity 1200ms ease-in-out',
                        backgroundImage: `url(${src})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        filter: 'brightness(1.06) contrast(1.03)',
                        transform: idx === currentSlide ? 'scale(1.02)' : 'scale(1)',
                        transitionProperty: 'opacity, transform',
                        transitionDuration: '1200ms, 6000ms',
                        transitionTimingFunction: 'ease-in-out, linear',
                    }}
                />
            ))}

            {/* Slide Navigation Dots */}
            <div
                style={{
                    position: 'absolute',
                    top: 140,
                    right: 40,
                    zIndex: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                }}
            >
                {heroImages.map((_, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentSlide(idx)}
                        aria-label={`Slide ${idx + 1}`}
                        style={{
                            width: idx === currentSlide ? 28 : 10,
                            height: 10,
                            borderRadius: 10,
                            border: 'none',
                            background: idx === currentSlide ? 'var(--accent)' : 'rgba(255,255,255,0.6)',
                            cursor: 'pointer',
                            transition: 'all 300ms ease',
                        }}
                    />
                ))}
            </div>

            {/* Subtle gradient overlay to keep white text readable while maintaining vibrant image colors */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                        'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.2) 65%, rgba(0,0,0,0.55) 100%)',
                    pointerEvents: 'none',
                }}
            />

            <div
                style={{
                    position: 'relative',
                    maxWidth: 'var(--container)',
                    margin: '0 auto',
                    padding: '140px var(--space-6) 240px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minHeight: 'min(100vh, 880px)',
                    zIndex: 10,
                }}
            >
                <span
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        padding: '8px 18px',
                        borderRadius: 'var(--radius-pill)',
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 700,
                        color: '#ffffff',
                        marginBottom: 24,
                        width: 'max-content',
                        letterSpacing: '0.04em',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                    }}
                >
                    <span
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: 'var(--radius-pill)',
                            background: 'var(--accent)',
                            boxShadow: '0 0 10px var(--accent)',
                        }}
                    />
                    {pick(hero.kicker, locale)}
                </span>

                <h1
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2.25rem, 5.2vw, 3.8rem)',
                        lineHeight: 1.12,
                        fontWeight: 800,
                        letterSpacing: '-0.03em',
                        color: '#ffffff',
                        margin: '0 0 20px',
                        maxWidth: '860px',
                        textWrap: 'balance',
                        textShadow: '0 4px 30px rgba(0,0,0,0.45)',
                    }}
                >
                    {pick(hero.title, locale)}
                </h1>

                <p
                    style={{
                        fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                        lineHeight: 1.65,
                        color: 'rgba(255,255,255,0.92)',
                        margin: '0 0 var(--space-6)',
                        maxWidth: '620px',
                        textWrap: 'pretty',
                        textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                    }}
                >
                    {pick(hero.sub, locale)}
                </p>

                <ul
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 'var(--space-3)',
                        listStyle: 'none',
                        padding: 0,
                        margin: '0 0 32px',
                    }}
                >
                    {hero.badges.map((badge) => (
                        <li
                            key={badge.en}
                            style={{
                                padding: '8px 16px',
                                borderRadius: 'var(--radius-pill)',
                                background: 'rgba(255, 255, 255, 0.16)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                backdropFilter: 'blur(8px)',
                                fontSize: 'var(--text-xs)',
                                fontWeight: 600,
                                color: '#ffffff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            }}
                        >
                            ✓ {pick(badge, locale)}
                        </li>
                    ))}
                </ul>

                <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                    <a
                        href={themePath(SLUG, 'rooms')}
                        style={{
                            padding: '16px 36px',
                            borderRadius: 'var(--radius-pill)',
                            background: 'linear-gradient(135deg, var(--accent) 0%, #d97706 100%)',
                            color: '#ffffff',
                            fontSize: '16px',
                            fontWeight: 800,
                            textDecoration: 'none',
                            boxShadow: '0 8px 24px rgba(217, 119, 6, 0.4)',
                            transition: 'transform 200ms ease, box-shadow 200ms ease',
                        }}
                    >
                        {t.bookNow} →
                    </a>
                    <a
                        href={themePath(SLUG, 'tours')}
                        style={{
                            padding: '16px 32px',
                            borderRadius: 'var(--radius-pill)',
                            background: 'rgba(255, 255, 255, 0.18)',
                            border: '1px solid rgba(255, 255, 255, 0.35)',
                            color: '#ffffff',
                            fontSize: '15px',
                            fontWeight: 700,
                            textDecoration: 'none',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                        }}
                    >
                        {t.toursKicker}
                    </a>
                </div>
            </div>

            {/* Thanh tra cứu — hiện tại là vỏ tĩnh; nối vào luồng đặt phòng ở
                bước sau, khi section #booking có form thật. */}
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 52,
                    padding: '0 var(--space-6)',
                }}
            >
                <form
                    style={{
                        maxWidth: 1000,
                        margin: '0 auto',
                        background: 'var(--surface)',
                        borderRadius: 'var(--radius-pill)',
                        border: '1px solid var(--border)',
                        boxShadow: 'var(--shadow-lg)',
                        padding: '12px 12px 12px 8px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, minmax(0,1fr)) auto',
                        alignItems: 'stretch',
                    }}
                >
                    <div style={FIELD}>
                        <label htmlFor="h1-in" style={LABEL}>
                            {t.checkIn}
                        </label>
                        <input id="h1-in" type="date" style={INPUT} />
                    </div>
                    <div style={FIELD}>
                        <label htmlFor="h1-out" style={LABEL}>
                            {t.checkOut}
                        </label>
                        <input id="h1-out" type="date" style={INPUT} />
                    </div>
                    <div style={FIELD}>
                        <label htmlFor="h1-guests" style={LABEL}>
                            {t.guests}
                        </label>
                        <select id="h1-guests" style={INPUT} defaultValue="2 · 1">
                            <option>2 · 1</option>
                            <option>4 · 2</option>
                            <option>6 · 2</option>
                            <option>8 · 3</option>
                        </select>
                    </div>
                    <div style={{ ...FIELD, borderRight: 'none' }}>
                        <label htmlFor="h1-type" style={LABEL}>
                            {t.stayType}
                        </label>
                        <select id="h1-type" style={INPUT} defaultValue={t.stayRoom}>
                            <option>{t.stayRoom}</option>
                            <option>{t.stayCombo2}</option>
                            <option>{t.stayCombo3}</option>
                        </select>
                    </div>
                    <a
                        href={themePath(SLUG, 'rooms')}
                        aria-label={t.search}
                        style={{
                            width: 54,
                            height: 54,
                            borderRadius: 'var(--radius-pill)',
                            background: 'var(--accent)',
                            color: 'var(--text-inverse)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 20,
                            fontWeight: 700,
                            flexShrink: 0,
                            textDecoration: 'none',
                        }}
                    >
                        ⌕
                    </a>
                </form>
            </div>
        </section>
    )
}
