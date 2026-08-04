'use client'

import { useState } from 'react'
import { pick, type Locale, type PropertyData } from '@repo/core'
import { ImageSlot } from '@repo/ui'

/**
 * Dải cam kết (USP) + khối giới thiệu hai cột.
 *
 * Bản thiết kế đặt bốn cam kết ngay dưới hero — mỗi cam kết là icon tuyến +
 * tiêu đề + một dòng phụ. Desktop chia 4 cột ngăn bằng vạch dọc; mobile là
 * lưới 4 ô trong một thẻ trắng, chữ hai dòng.
 *
 * Khối about bên dưới: ảnh/video bên trái, nội dung bên phải, kèm dải bốn
 * tiện ích và nút "Khám phá thêm". Mobile xếp dọc, ảnh trước.
 *
 * Icon vẽ tại chỗ bằng SVG — luật D5 cấm emoji làm icon ở sản phẩm mới.
 * Nội dung lấy từ `data.facts` / `data.about` của core (luật R8).
 */

const USP_ICONS: readonly (() => React.ReactElement)[] = [
    IconShield,
    IconVan,
    IconDeposit,
    IconWaves,
]

function IconShield() {
    return (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3l7 3v5.2c0 4.3-2.9 8.2-7 9.4-4.1-1.2-7-5.1-7-9.4V6l7-3Z" stroke="var(--brand)" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M8.8 12.2l2.3 2.3 4.3-4.4" stroke="var(--brand)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function IconVan() {
    return (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M2 15V9.5A1.5 1.5 0 0 1 3.5 8H14l4 3.5h2.5A1.5 1.5 0 0 1 22 13v2h-2.2M9.8 15H7.2M2 15h1.2" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="5.6" cy="16.4" r="1.9" stroke="var(--brand)" strokeWidth="1.5" />
            <circle cx="17.6" cy="16.4" r="1.9" stroke="var(--brand)" strokeWidth="1.5" />
        </svg>
    )
}

function IconDeposit() {
    return (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="var(--brand)" strokeWidth="1.5" />
            <path d="M15.5 8.5l-7 7" stroke="var(--brand)" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="9.5" cy="9.5" r="1.4" stroke="var(--brand)" strokeWidth="1.4" />
            <circle cx="14.5" cy="14.5" r="1.4" stroke="var(--brand)" strokeWidth="1.4" />
        </svg>
    )
}

function IconWaves() {
    return (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M2 8.5c1.7 0 1.7 1.6 3.3 1.6S7 8.5 8.7 8.5s1.7 1.6 3.3 1.6 1.7-1.6 3.3-1.6 1.7 1.6 3.4 1.6S20.3 8.5 22 8.5M2 13.4c1.7 0 1.7 1.6 3.3 1.6s1.7-1.6 3.4-1.6 1.7 1.6 3.3 1.6 1.7-1.6 3.3-1.6 1.7 1.6 3.4 1.6 1.6-1.6 3.3-1.6" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    )
}

function IconPlay() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="var(--brand)" />
        </svg>
    )
}

export function About({ data, locale }: { data: PropertyData; locale: Locale }) {
    const { facts, about } = data
    const [showVideo, setShowVideo] = useState(false)

    const videoLabel = locale === 'vi' ? 'Xem video giới thiệu' : 'Watch video'
    const moreLabel = locale === 'vi' ? 'Khám phá thêm về resort' : 'Learn more'

    return (
        <>
            {/* ---------- DẢI CAM KẾT ---------- */}
            <section className="h7-usp-section">
                <div className="h7-usp">
                    {facts.slice(0, 4).map((fact, idx) => {
                        const Icon = USP_ICONS[idx % USP_ICONS.length] ?? IconShield
                        return (
                            <div key={fact.label.en} className="h7-usp-item">
                                <Icon />
                                <div className="h7-usp-text">
                                    <div className="h7-usp-title">{fact.value}</div>
                                    <div className="h7-usp-sub">{pick(fact.label, locale)}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* ---------- GIỚI THIỆU ---------- */}
            <section id="about" className="h7-about">
                <div className="h7-about-grid">
                    <div className="h7-about-media">
                        {showVideo ? (
                            <div
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 'var(--radius)',
                                    overflow: 'hidden',
                                    background: '#000000',
                                }}
                            >
                                <video
                                    controls
                                    autoPlay
                                    playsInline
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                >
                                    <source src="/video/8102936365457.mp4" type="video/mp4" />
                                </video>
                            </div>
                        ) : (
                            <>
                                <ImageSlot
                                    placeholder={locale === 'vi' ? 'Toàn cảnh resort' : 'Resort overview'}
                                    src="/uploads/hero-1.jpg"
                                    height="100%"
                                    style={{ borderRadius: 'var(--radius)' }}
                                />
                                <button
                                    type="button"
                                    className="h7-video-btn"
                                    aria-label={videoLabel}
                                    onClick={() => setShowVideo(true)}
                                >
                                    <span className="h7-video-dot">
                                        <IconPlay />
                                    </span>
                                    {videoLabel}
                                </button>
                            </>
                        )}
                    </div>

                    <div>
                        <p className="h7-about-kicker">{pick(about.kicker, locale)}</p>

                        <h2 className="h7-about-title">{pick(about.title, locale)}</h2>

                        {about.body.map((paragraph) => (
                            <p key={paragraph.en} className="h7-about-body">
                                {pick(paragraph, locale)}
                            </p>
                        ))}

                        <ul className="h7-about-services">
                            {about.services.slice(0, 4).map((service) => (
                                <li key={service.en} className="h7-about-service">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <circle cx="12" cy="12" r="9" stroke="var(--brand)" strokeWidth="1.5" />
                                        <path d="M8.2 12.3l2.5 2.5 5.1-5.2" stroke="var(--brand)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {pick(service, locale)}
                                </li>
                            ))}
                        </ul>

                        <a href="#rooms" className="h7-about-more">
                            {moreLabel}
                            <span aria-hidden="true">→</span>
                        </a>
                    </div>
                </div>
            </section>

            <style>{`
                .h7-usp-section {
                    background: var(--surface);
                    padding: 22px var(--space-4) 0;
                }
                .h7-usp {
                    max-width: var(--container);
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 4px 0;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    padding: 14px 6px;
                    box-shadow: var(--shadow-sm);
                }
                .h7-usp-item {
                    display: grid;
                    justify-items: center;
                    text-align: center;
                    gap: 7px;
                    padding: 12px 8px;
                }
                .h7-usp-title {
                    font-size: 13px;
                    font-weight: 700;
                    color: var(--text);
                    line-height: 1.35;
                }
                .h7-usp-sub {
                    font-size: 12px;
                    color: var(--text-muted);
                    line-height: 1.45;
                    margin-top: 2px;
                }

                .h7-about {
                    background: var(--surface);
                    padding: 40px var(--space-4) 8px;
                    scroll-margin-top: 80px;
                }
                .h7-about-grid {
                    max-width: var(--container);
                    margin: 0 auto;
                    display: grid;
                    gap: 26px;
                    align-items: center;
                }
                .h7-about-media { position: relative; min-height: 220px; }
                .h7-video-btn {
                    position: absolute;
                    left: 14px;
                    bottom: 14px;
                    display: inline-flex;
                    align-items: center;
                    gap: 9px;
                    padding: 9px 16px 9px 9px;
                    border: none;
                    border-radius: 999px;
                    background: rgba(255,255,255,0.94);
                    backdrop-filter: blur(6px);
                    font-family: inherit;
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--text);
                    cursor: pointer;
                    box-shadow: var(--shadow);
                    transition: background 180ms ease, transform 150ms ease;
                }
                .h7-video-btn:hover  { background: #fff; }
                .h7-video-btn:active { transform: translateY(1px); }
                .h7-video-btn:focus-visible {
                    outline: 2px solid var(--brand);
                    outline-offset: 2px;
                }
                .h7-video-dot {
                    width: 30px; height: 30px;
                    display: grid; place-items: center;
                    border-radius: 999px;
                    background: var(--surface-tint);
                }

                .h7-about-kicker {
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 0.09em;
                    text-transform: uppercase;
                    color: var(--brand);
                    margin: 0 0 10px;
                }
                .h7-about-title {
                    font-family: var(--font-display);
                    font-size: clamp(1.6rem, 4.4vw, 2.1rem);
                    line-height: 1.22;
                    font-weight: 600;
                    color: var(--text);
                    margin: 0 0 14px;
                    text-wrap: balance;
                }
                .h7-about-body {
                    font-size: var(--text-base);
                    line-height: 1.78;
                    color: var(--text-muted);
                    margin: 0 0 var(--space-3);
                    text-wrap: pretty;
                }
                .h7-about-services {
                    list-style: none;
                    padding: 0;
                    margin: 22px 0 24px;
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 14px;
                }
                .h7-about-service {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--text);
                    line-height: 1.4;
                }
                .h7-about-more {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 22px;
                    border: 1px solid var(--border-strong);
                    border-radius: var(--radius-sm);
                    background: var(--surface);
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--text);
                    text-decoration: none;
                    transition: border-color 180ms ease, background 180ms ease;
                }
                .h7-about-more:hover { border-color: var(--brand); background: var(--surface-tint); }
                .h7-about-more:focus-visible {
                    outline: 2px solid var(--brand);
                    outline-offset: 2px;
                }

                @media (min-width: 960px) {
                    .h7-usp-section { padding: 34px var(--space-6) 0; }
                    .h7-usp {
                        grid-template-columns: repeat(4, 1fr);
                        border: none;
                        box-shadow: none;
                        padding: 8px 0;
                    }
                    .h7-usp-item {
                        grid-template-columns: auto 1fr;
                        justify-items: start;
                        text-align: left;
                        align-items: center;
                        gap: 14px;
                        padding: 10px 26px;
                        border-right: 1px solid var(--border);
                    }
                    .h7-usp-item:last-child { border-right: none; }
                    .h7-usp-title { font-size: 14.5px; }

                    .h7-about { padding: 56px var(--space-6) 16px; }
                    .h7-about-grid {
                        grid-template-columns: minmax(0, 1.02fr) minmax(0, 1fr);
                        gap: 52px;
                    }
                    .h7-about-media { min-height: 340px; }
                    .h7-about-services { gap: 16px 22px; }
                }
            `}</style>
        </>
    )
}
