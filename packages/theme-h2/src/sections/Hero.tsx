'use client'

import { useEffect, useState } from 'react'
import { pick, themePath, type Locale, type PropertyData } from '@repo/core'

import { meta } from '../meta'
import { ui } from '../strings'

const SLUG = meta.slug

const HERO_IMAGES = ['/hero-1.jpg', '/hero-2.jpg']

/**
 * Hero mẫu 02 — CHIA ĐÔI với Banner Slider auto-slide 5s bên phải.
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
    color: 'var(--brand)',
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
    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    return (
        <section
            id="top"
            style={{
                position: 'relative',
                minHeight: 'min(100vh, 880px)',
                overflow: 'hidden',
                background: 'var(--surface-inverse)',
            }}
        >
            {/* Mảng ảnh bên phải với Auto-sliding Banner Slider 5s */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '62%',
                    height: '78%',
                    borderBottomLeftRadius: 50,
                    overflow: 'hidden',
                }}
            >
                {HERO_IMAGES.map((src, idx) => (
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
                            transform: idx === currentSlide ? 'scale(1.03)' : 'scale(1)',
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
                        bottom: 24,
                        right: 32,
                        zIndex: 20,
                        display: 'flex',
                        gap: 8,
                    }}
                >
                    {HERO_IMAGES.map((_, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => setCurrentSlide(idx)}
                            aria-label={`Slide ${idx + 1}`}
                            style={{
                                width: idx === currentSlide ? 24 : 10,
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

                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                            'linear-gradient(200deg, rgba(0,0,0,0.25) 0%, rgba(6,97,104,0.1) 45%, rgba(6,97,104,0.32) 100%)',
                        pointerEvents: 'none',
                    }}
                />
            </div>

            {/* Vòng tròn cam mờ trang trí, nằm lệch ra ngoài mép trái. */}
            <div
                style={{
                    position: 'absolute',
                    left: -80,
                    top: '34%',
                    width: 420,
                    height: 420,
                    borderRadius: 'var(--radius-pill)',
                    background: 'rgba(255,170,13,0.14)',
                    pointerEvents: 'none',
                }}
            />

            <div
                style={{
                    position: 'relative',
                    minHeight: 'min(100vh, 880px)',
                    maxWidth: 'var(--container)',
                    margin: '0 auto',
                    padding: '148px var(--space-6) 250px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                }}
            >
                <div style={{ maxWidth: 'min(36%, 520px)', minWidth: 300 }}>
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            padding: '7px 16px',
                            borderRadius: 'var(--radius-pill)',
                            background: 'var(--accent)',
                            color: 'var(--text)',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 700,
                            marginBottom: 22,
                        }}
                    >
                        {pick(hero.kicker, locale)}
                    </span>

                    <h1
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'var(--text-3xl)',
                            lineHeight: 1.1,
                            fontWeight: 800,
                            letterSpacing: '-0.03em',
                            color: 'var(--text-inverse)',
                            margin: '0 0 18px',
                            textWrap: 'balance',
                        }}
                    >
                        {pick(hero.title, locale)}
                    </h1>

                    <p
                        style={{
                            fontSize: 'var(--text-lg)',
                            lineHeight: 1.65,
                            color: 'var(--text-inverse)',
                            opacity: 0.82,
                            margin: '0 0 var(--space-6)',
                            textWrap: 'pretty',
                        }}
                    >
                        {pick(hero.sub, locale)}
                    </p>

                    <div
                        style={{
                            display: 'flex',
                            gap: 'var(--space-3)',
                            flexWrap: 'wrap',
                            pointerEvents: 'auto',
                        }}
                    >
                        <a
                            href={themePath(SLUG, 'rooms')}
                            style={{
                                padding: '15px 32px',
                                borderRadius: 'var(--radius-pill)',
                                background: 'var(--accent)',
                                color: 'var(--text)',
                                fontSize: 'var(--text-base)',
                                fontWeight: 700,
                                textDecoration: 'none',
                            }}
                        >
                            {t.bookNow}
                        </a>
                        <a
                            href={themePath(SLUG, 'tours')}
                            style={{
                                padding: '15px 30px',
                                borderRadius: 'var(--radius-pill)',
                                border: '1px solid var(--overlay-line)',
                                color: 'var(--text-inverse)',
                                fontSize: 'var(--text-base)',
                                fontWeight: 600,
                                textDecoration: 'none',
                            }}
                        >
                            {t.toursKicker}
                        </a>
                    </div>
                </div>
            </div>

            {/* Thanh tra cứu — hiện tại là vỏ tĩnh; nối vào luồng đặt phòng ở
                bước sau, khi section #booking có form thật. */}
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 56,
                    zIndex: 25,
                    padding: '0 var(--space-6)',
                }}
            >
                <form
                    style={{
                        maxWidth: 1020,
                        margin: '0 auto',
                        background: 'var(--surface)',
                        borderRadius: 'var(--radius-pill)',
                        boxShadow: 'var(--shadow-lg)',
                        padding: '12px 12px 12px 10px',
                        display: 'grid',
                        /**
                         * Bốn ô bằng nhau + nút tròn.
                         *
                         * KHÔNG dùng `auto-fit` ở đây: khi chỗ hẹp, `auto-fit`
                         * gộp các ô về một cột và chúng chồng lên nhau. Bốn ô
                         * này phải luôn nằm ngang; hẹp quá thì cả thanh xuống
                         * dòng nhờ `flexWrap` của khối cha.
                         */
                        gridTemplateColumns: 'repeat(4, minmax(0, 1fr)) auto',
                        alignItems: 'stretch',
                    }}
                >
                    <div style={FIELD}>
                        <label htmlFor="h2-in" style={LABEL}>
                            {t.checkIn}
                        </label>
                        <input id="h2-in" type="date" style={INPUT} />
                    </div>
                    <div style={FIELD}>
                        <label htmlFor="h2-out" style={LABEL}>
                            {t.checkOut}
                        </label>
                        <input id="h2-out" type="date" style={INPUT} />
                    </div>
                    <div style={FIELD}>
                        <label htmlFor="h2-guests" style={LABEL}>
                            {t.guests}
                        </label>
                        <select id="h2-guests" style={INPUT} defaultValue="2 · 1">
                            <option>2 · 1</option>
                            <option>4 · 2</option>
                            <option>6 · 2</option>
                            <option>8 · 3</option>
                        </select>
                    </div>
                    <div style={{ ...FIELD, borderRight: 'none' }}>
                        <label htmlFor="h2-type" style={LABEL}>
                            {t.stayType}
                        </label>
                        <select id="h2-type" style={INPUT} defaultValue={t.stayRoom}>
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
                            background: 'var(--brand)',
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
