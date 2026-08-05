'use client'

import { useState } from 'react'
import { formatPrice, telHref, type Locale, type PropertyData } from '@repo/core'
import { useScrolled } from '@repo/ui'

import { ui } from '../strings'
import { IconClose } from '../components/icons'
import { SearchFields, submitHref } from '../components/SearchWidget'
import { useStaySearch } from '../components/search'

/**
 * Section `top` — hero 85vh + widget tìm phòng + ĐỊNH DANH CHÍNH CHỦ.
 *
 * Trust số 1 của phễu (spec §0.3): dòng "Resort chính chủ… Hotline/Zalo" nằm
 * ngay dưới H1, SĐT bấm gọi được. CTA vàng duy nhất của viewport là nút tìm
 * phòng (K4).
 *
 * Mobile (K7): 92vh, widget thu thành MỘT nút mở bottom-sheet 3 field; H1 +
 * nút phải nằm trong viewport đầu ở 375px. Sticky bottom bar hiện sau khi cuộn
 * qua hero.
 */

export function Hero({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui(locale)
    const [search, setSearch] = useStaySearch()
    const [sheetOpen, setSheetOpen] = useState(false)
    // Sticky bottom bar mobile chỉ hiện sau khi cuộn qua hero (spec §3.1).
    const scrolled = useScrolled(480)

    const heroImage = data.hero.images?.[0] ?? '/hero-1.jpg'
    const cheapest = data.rooms.reduce(
        (min, room) => Math.min(min, room.price),
        Number.POSITIVE_INFINITY,
    )
    const findHref = submitHref(search, locale)

    return (
        <section id="top" style={{ position: 'relative' }}>
            <div
                className="h5-hero"
                style={{
                    position: 'relative',
                    minHeight: '85vh',
                    display: 'flex',
                    alignItems: 'flex-end',
                    overflow: 'hidden',
                }}
            >
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
                        background: 'var(--scrim-hero)',
                    }}
                />

                <div
                    className="h5-container h5-hero-inner"
                    style={{
                        position: 'relative',
                        width: '100%',
                        paddingBottom: 'var(--space-6)',
                        color: 'var(--color-text-inverse)',
                    }}
                >
                    <p
                        className="h5-kicker"
                        style={{
                            color: 'var(--color-text-inverse)',
                            opacity: 0.92,
                            margin: '0 0 var(--space-3)',
                        }}
                    >
                        {locale === 'vi'
                            ? 'Quần đảo Nam Du · Kiên Hải'
                            : 'Nam Du Archipelago · Kien Hai'}
                    </p>

                    <h1
                        className="h5-display h5-hero-title"
                        style={{
                            fontSize: 'var(--font-size-4xl)',
                            maxWidth: '18ch',
                            margin: '0 0 var(--space-3)',
                        }}
                    >
                        {t.heroTitle}
                    </h1>

                    {/* Định danh chính chủ — trả lời "có phải website thật không"
                        ngay viewport đầu (spec §3.1). */}
                    <p
                        style={{
                            margin: '0 0 var(--space-5)',
                            fontSize: 'var(--font-size-base)',
                            fontWeight: 'var(--font-weight-medium)' as never,
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            gap: '0 8px',
                        }}
                    >
                        <span>{t.identityPrefix}</span>
                        <a
                            href={telHref(data.brand.phone)}
                            style={{
                                color: 'var(--color-text-inverse)',
                                fontWeight: 'var(--font-weight-bold)' as never,
                                textDecoration: 'underline',
                                textUnderlineOffset: 4,
                                minHeight: 24,
                                display: 'inline-flex',
                                alignItems: 'center',
                            }}
                        >
                            {data.brand.phone}
                        </a>
                    </p>

                    {/* Mobile: một nút mở bottom-sheet. */}
                    <button
                        type="button"
                        className="h5-btn h5-btn-primary h5-hero-cta-mobile"
                        onClick={() => setSheetOpen(true)}
                    >
                        {t.searchSheetOpen}
                    </button>
                </div>
            </div>

            {/* Widget desktop — MỘT hàng, đậu vắt qua mép hero và band cát của
                `about` phía dưới (margin âm hai chiều): đây là mô liên kết giữa
                hero và phần thân trang, chữa cảm giác "card trôi giữa trắng". */}
            <div
                className="h5-container h5-hero-widget"
                style={{ position: 'relative', zIndex: 5 }}
            >
                <div
                    style={{
                        display: 'grid',
                        gap: 'var(--space-3)',
                        alignItems: 'end',
                        background: 'var(--color-surface-raised)',
                        borderRadius: 'var(--radius-xl)',
                        boxShadow: 'var(--shadow-2)',
                        padding: 'var(--space-4)',
                        color: 'var(--color-text-primary)',
                    }}
                    className="h5-hero-widget-row"
                >
                    <SearchFields locale={locale} value={search} onChange={setSearch} columns />
                    <a
                        className="h5-btn h5-btn-primary h5-hero-cta"
                        href={findHref}
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        {t.ctaMain}
                    </a>
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
                                className="h5-display"
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
                                className="h5-btn h5-btn-primary"
                                href={findHref}
                                style={{ width: '100%' }}
                            >
                                {t.ctaMain}
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* ---- sticky bottom bar mobile (hiện sau hero nhờ position:sticky) ---- */}
            {Number.isFinite(cheapest) && scrolled && (
                <div
                    className="h5-sticky-bar"
                    style={{
                        position: 'fixed',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 50,
                        background: 'var(--color-surface-raised)',
                        borderTop: '1px solid var(--color-border-muted)',
                        boxShadow: 'var(--shadow-up)',
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
                        className="h5-btn h5-btn-primary"
                        href={findHref}
                        style={{ minHeight: 44, flexShrink: 0 }}
                    >
                        {t.stickyFind}
                    </a>
                </div>
            )}

            <style>{`
                .h5-hero-cta-mobile { display: none; width: 100%; }
                @media (min-width: 900px) {
                    /* Widget đậu 50/50 giữa ảnh hero và band cát kế tiếp. */
                    .h5-hero-widget { margin-top: -60px; margin-bottom: -60px; }
                    .h5-hero-widget-row {
                        grid-template-columns: 1.1fr 1.1fr 0.6fr 0.6fr auto;
                    }
                    .h5-hero-inner { padding-bottom: calc(var(--space-6) + 60px) !important; }
                }
                @media (max-width: 899.98px) {
                    .h5-hero { min-height: 92vh; }
                    .h5-hero-title { font-size: var(--font-size-2xl) !important; }
                    .h5-hero-widget { display: none; }
                    .h5-hero-cta-mobile { display: inline-flex; }
                    .h5-sticky-bar { display: flex !important; }
                }
            `}</style>
        </section>
    )
}
