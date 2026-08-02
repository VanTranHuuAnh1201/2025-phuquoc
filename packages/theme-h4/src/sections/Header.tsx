'use client'

import {
    pick,
    themeHref,
    themePath,
    themeRoot,
    type Locale,
    type PropertyData,
} from '@repo/core'
import { useScrolled } from '@repo/ui'

import { meta } from '../meta'
import { ui } from '../strings'

const SLUG = meta.slug

/**
 * Thanh điều hướng của mẫu 04 — khác hẳn ba mẫu kia.
 *
 * Ở đầu trang header CHỈ có logo, đổi ngôn ngữ và nút đặt phòng; thanh menu
 * ẩn hoàn toàn (max-width 0, opacity 0). Cuộn quá ngưỡng thì thanh liên hệ
 * phía trên thu lại, nền chuyển trắng đặc và menu mới trượt vào. Đây là hành
 * vi ghi trong `chrome` của prototype, giữ nguyên vì nó tạo nên tính cách
 * "thoáng, ít chữ" của mẫu này.
 */

export function Header({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui[locale]
    const { brand, nav } = data
    const scrolled = useScrolled(120)

    const telHref = `tel:${brand.phone.replace(/\s/g, '')}`

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60 }}>
            {/* Thanh trên cùng: lời chào nghiêng + liên hệ, biến mất khi cuộn. */}
            <div
                style={{
                    maxHeight: scrolled ? 0 : 46,
                    opacity: scrolled ? 0 : 1,
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    transition: 'max-height 280ms ease, opacity 200ms ease',
                }}
            >
                <div
                    style={{
                        maxWidth: 'var(--container)',
                        margin: '0 auto',
                        padding: '9px var(--space-6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 'var(--space-4)',
                        flexWrap: 'wrap',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 600,
                        fontStyle: 'italic',
                        color: 'var(--brand)',
                    }}
                >
                    <span>{t.topline}</span>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 18,
                            fontStyle: 'normal',
                            fontWeight: 500,
                        }}
                    >
                        <a
                            href={`mailto:${brand.email}`}
                            style={{ color: 'var(--brand)', textDecoration: 'none' }}
                        >
                            {brand.email}
                        </a>
                        <a href={telHref} style={{ color: 'var(--brand)', textDecoration: 'none' }}>
                            {brand.phone}
                        </a>
                    </div>
                </div>
            </div>

            <header
                style={{
                    background: scrolled ? 'var(--surface)' : 'transparent',
                    boxShadow: scrolled ? 'var(--shadow)' : undefined,
                    transition: 'background 260ms ease, box-shadow 260ms ease',
                }}
            >
                <div
                    style={{
                        maxWidth: 'var(--container)',
                        margin: '0 auto',
                        padding: 'var(--space-2) var(--space-6)',
                        minHeight: 64,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-5)',
                    }}
                >
                    <a
                        href={themeRoot(SLUG)}
                        style={{
                            flexShrink: 0,
                            display: 'grid',
                            gap: 1,
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        <span
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'var(--text-sm)',
                                fontWeight: 900,
                                letterSpacing: '0.02em',
                                color: 'var(--brand)',
                            }}
                        >
                            {brand.name.toUpperCase()}
                        </span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                            {brand.suffix} · Nam Du Island
                        </span>
                    </a>

                    {/* Menu chỉ xuất hiện sau khi cuộn — nét riêng của mẫu 04. */}
                    <nav
                        style={{
                            display: 'flex',
                            gap: 4,
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            minWidth: 0,
                            overflow: 'hidden',
                            marginLeft: scrolled ? 'var(--space-8)' : 0,
                            opacity: scrolled ? 1 : 0,
                            maxWidth: scrolled ? 900 : 0,
                            pointerEvents: scrolled ? 'auto' : 'none',
                            transition: 'opacity 260ms ease, max-width 300ms ease',
                        }}
                    >
                        {nav.map((item) => (
                            <a
                                key={item.href}
                                href={themeHref(SLUG, item.href, true)}
                                style={{
                                    padding: 'var(--space-2) var(--space-3)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 700,
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0,
                                    textDecoration: 'none',
                                    color: 'var(--brand)',
                                }}
                            >
                                {pick(item.label, locale)}
                            </a>
                        ))}
                    </nav>

                    <a
                        href={themePath(SLUG, 'rooms')}
                        style={{
                            marginLeft: 'auto',
                            flexShrink: 0,
                            padding: '11px 22px',
                            borderRadius: 'var(--radius-pill)',
                            background: 'var(--accent)',
                            // Chữ trên nền xanh lá phải là xanh rừng đậm mới đủ tương phản.
                            color: 'var(--text)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 800,
                            whiteSpace: 'nowrap',
                            textDecoration: 'none',
                        }}
                    >
                        {t.bookNow}
                    </a>
                </div>
            </header>
        </div>
    )
}
