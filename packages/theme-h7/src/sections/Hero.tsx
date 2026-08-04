'use client'

import { useEffect, useState } from 'react'
import { pick, themePath, type Locale, type PropertyData } from '@repo/core'

import { meta } from '../meta'
import { ui } from '../strings'

const SLUG = meta.slug

const HERO_IMAGES = ['/hero-1.jpg', '/hero-2.jpg']

/**
 * Hero mẫu 07 — ảnh nền tràn màn hình, nội dung căn trái, form tra cứu nổi
 * đè lên mép dưới.
 *
 * Hai bố cục form tách hẳn theo bản thiết kế:
 *   desktop — một hàng ngang: nhận · trả · người lớn · trẻ em · nút vàng.
 *   mobile  — xếp dọc: 2 ô ngày cạnh nhau, 2 ô khách cạnh nhau, nút vàng
 *             full-width bên dưới, rồi dải ba cam kết.
 *
 * Dải cam kết (đưa đón · cọc 50% · tàu hoãn) nằm ngay trong khối form ở cả hai
 * bố cục — đúng thiết kế, và đây là thông tin quyết định đặt phòng ở Nam Du.
 *
 * Form hiện là vỏ tĩnh; nối vào luồng đặt phòng thật ở bước sau. Không tính
 * giá tại đây (luật R8) — bấm nút là sang `/h7/rooms`.
 */

const FIELD: React.CSSProperties = {
    display: 'grid',
    gap: 3,
    alignContent: 'center',
    minWidth: 0,
    padding: '8px 16px',
}

const INPUT: React.CSSProperties = {
    width: '100%',
    border: 'none',
    background: 'transparent',
    fontSize: '15px',
    fontWeight: 700,
    color: 'var(--text)',
    outline: 'none',
    padding: 0,
    fontFamily: 'inherit',
}

const LABEL: React.CSSProperties = {
    fontSize: '11.5px',
    fontWeight: 500,
    color: 'var(--text-muted)',
}

function IconCalendar() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="5" width="18" height="16" rx="2" stroke="var(--brand)" strokeWidth="1.7" />
            <path d="M3 10h18M8 3v4M16 3v4" stroke="var(--brand)" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
    )
}

function IconUser() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="8" r="3.4" stroke="var(--brand)" strokeWidth="1.7" />
            <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" stroke="var(--brand)" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
    )
}

/** Ba cam kết dưới form — icon + chữ, dùng chung cho desktop và mobile. */
function Assurances({ locale }: { locale: Locale }) {
    const items =
        locale === 'vi'
            ? ['Xe resort đón tại cầu cảng', 'Cọc 50% để giữ phòng', 'Tàu hoãn do thời tiết: đổi ngày miễn phí']
            : ['Resort pickup at the pier', '50% deposit to hold your room', 'Weather delays: free date change']

    return (
        <div className="h7-assure">
            {items.map((label) => (
                <span key={label} className="h7-assure-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" stroke="var(--brand)" strokeWidth="1.7" />
                        <path d="M8 12.4l2.6 2.6L16 9.6" stroke="var(--brand)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {label}
                </span>
            ))}
        </div>
    )
}

export function Hero({ data, locale }: { data: PropertyData; locale: Locale }) {
    const { hero } = data
    const t = ui[locale]
    const heroImages = hero.images?.length ? hero.images : HERO_IMAGES
    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        if (heroImages.length < 2) return
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length)
        }, 6000)
        return () => clearInterval(timer)
    }, [heroImages.length])

    const adultsLabel = locale === 'vi' ? 'Người lớn' : 'Adults'
    const childrenLabel = locale === 'vi' ? 'Trẻ em' : 'Children'
    const ctaLabel = locale === 'vi' ? 'Chọn ngày & xem phòng' : 'Choose dates & view rooms'

    return (
        <section id="top" className="h7-hero">
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
                    }}
                />
            ))}

            {/* Lớp phủ giữ chữ trắng đọc được mà không làm ảnh xỉn màu. */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                        'linear-gradient(100deg, rgba(9,29,51,0.62) 0%, rgba(9,29,51,0.34) 42%, rgba(9,29,51,0.06) 72%)',
                    pointerEvents: 'none',
                }}
            />

            <div className="h7-hero-inner">
                {/* Badge pill — bản mobile đặt badge lên trên tiêu đề. */}
                {hero.kicker && (
                    <span className="h7-hero-badge">{pick(hero.kicker, locale)}</span>
                )}

                <h1 className="h7-hero-title">{pick(hero.title, locale)}</h1>

                <p className="h7-hero-sub">{pick(hero.sub, locale)}</p>
            </div>

            {/* ---------- FORM TRA CỨU ---------- */}
            <div className="h7-searchwrap">
                <form className="h7-search" onSubmit={(e) => e.preventDefault()}>
                    <div className="h7-search-fields">
                        <div style={FIELD} className="h7-field">
                            <label htmlFor="h7-in" style={LABEL}>
                                {t.checkIn}
                            </label>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <IconCalendar />
                                <input id="h7-in" type="date" style={INPUT} defaultValue="2026-08-11" />
                            </span>
                        </div>

                        <div style={FIELD} className="h7-field">
                            <label htmlFor="h7-out" style={LABEL}>
                                {t.checkOut}
                            </label>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <IconCalendar />
                                <input id="h7-out" type="date" style={INPUT} defaultValue="2026-08-13" />
                            </span>
                        </div>

                        <div style={FIELD} className="h7-field">
                            <label htmlFor="h7-adults" style={LABEL}>
                                {adultsLabel}
                            </label>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <IconUser />
                                <select id="h7-adults" style={INPUT} defaultValue="2">
                                    {[1, 2, 3, 4, 5, 6].map((n) => (
                                        <option key={n} value={n}>
                                            {n}
                                        </option>
                                    ))}
                                </select>
                            </span>
                        </div>

                        <div style={FIELD} className="h7-field h7-field-last">
                            <label htmlFor="h7-children" style={LABEL}>
                                {childrenLabel}
                            </label>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <IconUser />
                                <select id="h7-children" style={INPUT} defaultValue="0">
                                    {[0, 1, 2, 3, 4].map((n) => (
                                        <option key={n} value={n}>
                                            {n}
                                        </option>
                                    ))}
                                </select>
                            </span>
                        </div>
                    </div>

                    <a href={themePath(SLUG, 'rooms')} className="h7-search-cta">
                        {ctaLabel}
                    </a>
                </form>

                <div className="h7-assure-wrap">
                    <Assurances locale={locale} />
                </div>
            </div>

            <style>{`
                .h7-hero {
                    position: relative;
                    overflow: hidden;
                    background: var(--surface-inverse);
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    min-height: 620px;
                    padding-top: 88px;
                }
                .h7-hero-inner {
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    max-width: var(--container);
                    margin: 0 auto;
                    padding: 32px var(--space-4) 20px;
                }
                .h7-hero-badge {
                    display: inline-block;
                    padding: 7px 16px;
                    border-radius: 999px;
                    background: rgba(255,255,255,0.16);
                    border: 1px solid rgba(255,255,255,0.4);
                    backdrop-filter: blur(10px);
                    font-size: 12.5px;
                    font-weight: 600;
                    color: #fff;
                    margin-bottom: 16px;
                }
                .h7-hero-title {
                    font-family: var(--font-display);
                    font-size: clamp(2rem, 6.2vw, 3.5rem);
                    line-height: 1.14;
                    font-weight: 600;
                    letter-spacing: -0.01em;
                    color: #fff;
                    margin: 0 0 14px;
                    max-width: 15ch;
                    text-wrap: balance;
                    text-shadow: 0 3px 24px rgba(0,0,0,0.4);
                }
                .h7-hero-sub {
                    font-size: clamp(0.95rem, 2vw, 1.05rem);
                    line-height: 1.6;
                    color: rgba(255,255,255,0.95);
                    margin: 0;
                    max-width: 46ch;
                    text-shadow: 0 2px 12px rgba(0,0,0,0.35);
                }

                /* ---- form: khung chung ---- */
                .h7-searchwrap {
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    max-width: var(--container);
                    margin: 0 auto;
                    padding: 0 var(--space-4) 28px;
                }
                .h7-search {
                    background: var(--surface);
                    border-radius: var(--radius);
                    box-shadow: var(--shadow-lg);
                    padding: 10px;
                    display: grid;
                    gap: 10px;
                }
                .h7-search-fields { display: grid; gap: 8px; }
                .h7-field { border-radius: var(--radius-sm); background: var(--surface-alt); }
                .h7-search-cta {
                    display: block;
                    padding: 15px 24px;
                    border-radius: var(--radius-sm);
                    background: var(--accent);
                    /* Navy trên vàng ≈ 9.2:1. Trắng trên vàng chỉ 1.9:1 — trượt AA. */
                    color: var(--on-accent);
                    font-size: 15px;
                    font-weight: 700;
                    text-align: center;
                    text-decoration: none;
                    transition: background 200ms ease, transform 150ms ease;
                }
                .h7-search-cta:hover  { background: var(--accent-dark); }
                .h7-search-cta:active { transform: translateY(1px); }
                .h7-search-cta:focus-visible {
                    outline: 2px solid var(--brand);
                    outline-offset: 2px;
                }

                /* ---- dải cam kết ---- */
                .h7-assure {
                    display: grid;
                    gap: 10px;
                    padding: 14px 6px 2px;
                }
                .h7-assure-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 12.5px;
                    font-weight: 600;
                    color: var(--text);
                }
                .h7-assure-wrap {
                    background: var(--surface);
                    border-radius: 0 0 var(--radius) var(--radius);
                    margin: -10px 10px 0;
                    padding: 0 10px 8px;
                    box-shadow: var(--shadow-lg);
                    position: relative;
                    z-index: -1;
                }

                /* ---- MOBILE: hai ô ngày cạnh nhau, hai ô khách cạnh nhau ---- */
                @media (max-width: 959px) {
                    .h7-search-fields {
                        grid-template-columns: 1fr 1fr;
                    }
                }

                /* ---- DESKTOP: một hàng ngang, cam kết nằm trong cùng thẻ ---- */
                @media (min-width: 960px) {
                    .h7-hero { min-height: min(100vh, 780px); padding-top: 96px; }
                    .h7-hero-inner { padding: 48px var(--space-6) 28px; }
                    .h7-hero-title { max-width: 18ch; }

                    .h7-searchwrap { padding: 0 var(--space-6) 56px; }
                    .h7-search {
                        padding: 10px 10px 10px 4px;
                        grid-template-columns: 1fr auto;
                        align-items: center;
                        gap: 12px;
                        border-radius: var(--radius) var(--radius) 0 0;
                    }
                    .h7-search-fields {
                        grid-template-columns: repeat(4, minmax(0, 1fr));
                        gap: 0;
                    }
                    .h7-field {
                        background: transparent;
                        border-right: 1px solid var(--border);
                        border-radius: 0;
                    }
                    .h7-field-last { border-right: none; }
                    .h7-search-cta { padding: 15px 30px; white-space: nowrap; }

                    .h7-assure-wrap {
                        margin: 0;
                        padding: 0;
                        border-radius: 0 0 var(--radius) var(--radius);
                        box-shadow: var(--shadow-lg);
                        z-index: auto;
                    }
                    .h7-assure {
                        grid-template-columns: repeat(3, 1fr);
                        gap: 0;
                        padding: 0;
                        border-top: 1px solid var(--border);
                    }
                    .h7-assure-item {
                        justify-content: center;
                        padding: 13px 12px;
                        border-right: 1px solid var(--border);
                    }
                    .h7-assure-item:last-child { border-right: none; }
                }
            `}</style>
        </section>
    )
}
