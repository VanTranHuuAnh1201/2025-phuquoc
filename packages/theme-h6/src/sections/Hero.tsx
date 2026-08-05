'use client'

import { useState } from 'react'
import { formatPrice, pick, telHref, type Locale, type PropertyData } from '@repo/core'
import { useScrolled } from '@repo/ui'

import { ui } from '../strings'
import { IconCheck, IconClose, IconPhone, IconShuttle, IconWave } from '../components/icons'
import { SearchFields, submitHref } from '../components/SearchWidget'
import { useStaySearch } from '../components/search'

/**
 * Section `top` — spec v4 §4.3 + §4.4, dựng theo trục dọc "quầy lễ tân":
 *
 *   ảnh 85vh, nội dung CĂN GIỮA        ← thiện cảm + định danh chính chủ
 *   thanh tìm phòng MỘT HÀNG NGANG     ← vắt qua mép ảnh, nửa trên ảnh nửa
 *   dải cát: trust note + 4 mục trust  ←   trên dải cát — điểm neo thị giác
 *
 * Khác các mẫu trước: không dồn nội dung vào góc trái, không widget dạng thẻ
 * đứng. Search bar ngang + chip chính chủ là ngôn ngữ của site booking thật.
 *
 * Mobile (K7): bar ẩn, MỘT nút vàng mở bottom-sheet; sticky bottom bar hiện
 * sau khi cuộn qua hero.
 */

export function Hero({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui(locale)
    const [search, setSearch] = useStaySearch()
    const [sheetOpen, setSheetOpen] = useState(false)
    const scrolled = useScrolled(480)

    const heroImage = data.hero.images?.[0] ?? '/hero-1.jpg'
    const cheapest = data.rooms.reduce(
        (min, room) => Math.min(min, room.price),
        Number.POSITIVE_INFINITY,
    )
    const findHref = submitHref(search, locale)

    const trustItems = [
        {
            icon: <IconCheck size={20} />,
            content: (
                <>
                    <strong>{data.brand.name}</strong>
                    {' · '}
                    {pick(data.brand.address, locale)}
                </>
            ),
        },
        {
            icon: <IconPhone size={20} />,
            content: (
                <>
                    {t.trustHotline}{' '}
                    <a
                        href={telHref(data.brand.phone)}
                        className="h6-link"
                        style={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                        {data.brand.phone}
                    </a>
                </>
            ),
        },
        { icon: <IconShuttle size={20} />, content: t.trustShuttle },
        { icon: <IconWave size={20} />, content: t.weatherLine },
    ]

    return (
        <section id="top">
            {/* ---- ảnh hero, nội dung căn giữa ---- */}
            <div className="h6-hero" style={{ position: 'relative', overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={heroImage}
                    alt={
                        locale === 'vi'
                            ? 'Toàn cảnh The Nam Du Hill Resort trên đồi hướng biển'
                            : 'The Nam Du Hill Resort on the hillside facing the sea'
                    }
                    fetchPriority="high"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        /* Scrim nhẹ để chữ giữa ảnh đọc được — KHÔNG kéo tối cả
                           khung (spec: xoá cảm giác u buồn). */
                        background:
                            'linear-gradient(180deg, rgba(20,34,44,0.30) 0%, rgba(20,34,44,0.16) 45%, rgba(20,34,44,0.42) 100%)',
                    }}
                />

                <div
                    className="h6-container h6-hero-inner"
                    style={{
                        position: 'relative',
                        minHeight: '85vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        paddingTop: 88,
                        paddingBottom: 'var(--space-7)',
                        color: 'var(--color-text-inverse)',
                    }}
                >
                    <p
                        className="h6-kicker"
                        style={{
                            color: 'var(--color-text-inverse)',
                            opacity: 0.92,
                            margin: '0 0 var(--space-3)',
                        }}
                    >
                        {pick(data.hero.kicker, locale)}
                    </p>

                    <h1
                        className="h6-display h6-hero-title"
                        style={{
                            fontSize: 'var(--font-size-4xl)',
                            maxWidth: '20ch',
                            margin: '0 0 var(--space-4)',
                        }}
                    >
                        {t.heroTitle}
                    </h1>

                    {/* Chip chính chủ — trả lời "web thật hay giả" ngay giữa
                        viewport đầu (spec §4.1 câu 1). */}
                    <p
                        style={{
                            margin: 0,
                            display: 'inline-flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px 8px',
                            background: 'var(--color-surface-raised)',
                            color: 'var(--color-text-primary)',
                            borderRadius: 999,
                            padding: '10px 20px',
                            boxShadow: 'var(--shadow-1)',
                            fontSize: 'var(--font-size-sm)',
                            fontWeight: 'var(--font-weight-medium)' as never,
                        }}
                    >
                        <span aria-hidden="true" style={{ color: 'var(--color-brand)', display: 'inline-flex' }}>
                            <IconCheck size={16} />
                        </span>
                        <span>{t.identityPrefix}</span>
                        <a
                            href={telHref(data.brand.phone)}
                            className="h6-link"
                            style={{
                                fontWeight: 'var(--font-weight-bold)' as never,
                                fontVariantNumeric: 'tabular-nums',
                                minHeight: 24,
                                display: 'inline-flex',
                                alignItems: 'center',
                            }}
                        >
                            {data.brand.phone}
                        </a>
                    </p>

                    {/* Mobile: một nút vàng mở bottom-sheet. */}
                    <button
                        type="button"
                        className="h6-btn h6-btn-primary h6-hero-cta-mobile"
                        onClick={() => setSheetOpen(true)}
                        style={{ marginTop: 'var(--space-5)' }}
                    >
                        {t.searchSheetOpen}
                    </button>
                </div>
            </div>

            {/* ---- dải cát: booking bar vắt lên ảnh + trust strip (spec §4.4) ---- */}
            <div
                className="h6-hero-dock"
                style={{ background: 'var(--color-surface-sand)' }}
            >
                <div className="h6-container">
                    <div
                        className="h6-hero-bar"
                        style={{
                            position: 'relative',
                            zIndex: 2,
                            background: 'var(--color-surface-raised)',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: 'var(--shadow-2)',
                            padding: 'var(--space-3) var(--space-4) var(--space-4)',
                            display: 'flex',
                            gap: 'var(--space-3)',
                            alignItems: 'flex-end',
                            flexWrap: 'wrap',
                        }}
                    >
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <SearchFields locale={locale} value={search} onChange={setSearch} columns />
                        </div>
                        <a
                            className="h6-btn h6-btn-primary"
                            href={findHref}
                            style={{ minWidth: 220, flexShrink: 0 }}
                        >
                            {t.ctaMain}
                        </a>
                    </div>

                    {/* Dòng trust dưới bar (spec §4.3) — trả lời nỗi sợ cọc/tàu
                        ngay tại điểm bấm. */}
                    <p
                        className="h6-hero-note"
                        style={{
                            margin: 'var(--space-3) 0 0',
                            textAlign: 'center',
                            fontSize: 'var(--font-size-sm)',
                            color: 'var(--color-text-secondary)',
                        }}
                    >
                        {t.heroTrustNote}
                    </p>

                    {/* 4 mục trust — chính chủ · hotline · đưa đón · tàu hoãn. */}
                    <ul
                        className="h6-trust-strip"
                        style={{
                            listStyle: 'none',
                            display: 'grid',
                            gap: 'var(--space-3) 0',
                            margin: 0,
                            padding: 'var(--space-4) 0 var(--space-5)',
                        }}
                    >
                        {trustItems.map((item, i) => (
                            <li
                                key={i}
                                style={{
                                    display: 'flex',
                                    gap: 10,
                                    alignItems: 'flex-start',
                                    fontSize: 'var(--font-size-sm)',
                                    color: 'var(--color-text-secondary)',
                                    padding: '0 var(--space-4)',
                                }}
                            >
                                <span
                                    aria-hidden="true"
                                    style={{ color: 'var(--color-brand)', marginTop: 1 }}
                                >
                                    {item.icon}
                                </span>
                                <span>{item.content}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* ---- bottom-sheet tìm phòng (mobile) ---- */}
            {sheetOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={t.searchSheetOpen}
                    style={{ position: 'fixed', inset: 0, zIndex: 80 }}
                >
                    <button
                        type="button"
                        aria-label={t.close}
                        onClick={() => setSheetOpen(false)}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'var(--overlay-scrim)',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'var(--color-surface-raised)',
                            borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
                            padding:
                                'var(--space-4) var(--space-4) calc(var(--space-4) + env(safe-area-inset-bottom, 0px))',
                            maxHeight: '85vh',
                            overflowY: 'auto',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 'var(--space-3)',
                            }}
                        >
                            <span
                                className="h6-display"
                                style={{ fontSize: 'var(--font-size-xl)' }}
                            >
                                {t.searchSheetOpen}
                            </span>
                            <button
                                type="button"
                                onClick={() => setSheetOpen(false)}
                                aria-label={t.close}
                                style={{
                                    width: 40,
                                    height: 40,
                                    display: 'grid',
                                    placeItems: 'center',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--color-text-secondary)',
                                }}
                            >
                                <IconClose size={22} />
                            </button>
                        </div>
                        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                            <SearchFields locale={locale} value={search} onChange={setSearch} />
                            <a
                                className="h6-btn h6-btn-primary"
                                href={findHref}
                                style={{ width: '100%' }}
                            >
                                {t.ctaMain}
                            </a>
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: 'var(--font-size-sm)',
                                    color: 'var(--color-text-secondary)',
                                    textAlign: 'center',
                                }}
                            >
                                {t.heroTrustNote}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ---- sticky bottom bar mobile ---- */}
            {Number.isFinite(cheapest) && scrolled && (
                <div
                    className="h6-sticky-bar"
                    style={{
                        position: 'fixed',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 50,
                        background: 'var(--color-surface-raised)',
                        borderTop: '1px solid var(--color-border-muted)',
                        boxShadow: '0 -8px 24px rgba(33, 50, 60, 0.1)',
                        padding:
                            '10px var(--space-4) calc(10px + env(safe-area-inset-bottom, 0px))',
                        display: 'none',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 'var(--space-3)',
                    }}
                >
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                        {t.stickyFrom}{' '}
                        <strong
                            style={{
                                color: 'var(--color-text-primary)',
                                fontSize: 'var(--font-size-base)',
                                fontVariantNumeric: 'tabular-nums',
                            }}
                        >
                            {formatPrice(cheapest, locale)}
                        </strong>
                        {t.stickyPerNight}
                    </span>
                    <a
                        className="h6-btn h6-btn-primary"
                        href={findHref}
                        style={{ minHeight: 44, flexShrink: 0 }}
                    >
                        {t.stickyFind}
                    </a>
                </div>
            )}

            <style>{`
                .h6-hero-cta-mobile { display: none; }
                .h6-trust-strip { grid-template-columns: 1fr; }
                .h6-trust-strip strong { color: var(--color-text-primary); }
                @media (min-width: 900px) {
                    /* Bar vắt qua mép ảnh: nửa trên ảnh, nửa trên dải cát. */
                    .h6-hero-bar { margin-top: -52px; }
                }
                @media (min-width: 640px) {
                    .h6-trust-strip { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                }
                @media (min-width: 1080px) {
                    .h6-trust-strip { grid-template-columns: repeat(4, minmax(0, 1fr)); }
                    .h6-trust-strip li + li { border-left: 1px solid var(--color-border-default); }
                }
                @media (max-width: 899.98px) {
                    .h6-hero-inner { min-height: 88vh !important; }
                    .h6-hero-title { font-size: var(--font-size-2xl) !important; }
                    .h6-hero-bar, .h6-hero-note { display: none !important; }
                    .h6-hero-cta-mobile { display: inline-flex; width: 100%; max-width: 360px; }
                    .h6-sticky-bar { display: flex !important; }
                    .h6-trust-strip li { padding: 0; }
                }
            `}</style>
        </section>
    )
}
