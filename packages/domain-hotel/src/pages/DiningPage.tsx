'use client'

import { useState } from 'react'
import {
    formatPrice,
    pick,
    themePath,
    themeRoot,
    type Locale,
    type MenuCategory,
    type PropertyData,
} from '@repo/core'

import { PageBody, PageFooter, PageHeader, PageHero } from '@repo/ui-layout'
import { defaultPageStrings, type PageStrings } from './strings'
import { shellPropsOf } from '../shell-adapter'

/**
 * Trang Ẩm thực — đích đến của nút "Xem thực đơn & dịch vụ" ở section `dining`.
 *
 * Cùng lý do với Tours/Gallery/Contact: chỉ có MỘT bản thiết kế cho trang này,
 * nên bố cục sống ở `ui` và cả N mẫu dùng chung, chỉ khác `tokens.css`
 * (luật R1 — không chép giữa các theme).
 *
 * Dữ liệu vào từ hai nguồn của `core`: `data.dining` (các điểm ăn uống, đã có
 * sẵn trong `PropertyData`) và `menu` (thực đơn, route lấy qua
 * `getDiningMenu()` rồi truyền xuống). Trang KHÔNG tự khai món hay tự định
 * dạng giá — `formatPrice` của core lo việc đó (luật R8).
 */

export interface DiningPageProps {
    data: PropertyData
    locale: Locale
    slug: string
    /** Thực đơn theo nhóm. Thiếu thì trang chỉ hiện phần điểm ăn uống. */
    menu?: Record<string, MenuCategory>
    /** Bộ nhãn riêng của mẫu. Không truyền thì dùng bản mặc định. */
    strings?: Record<Locale, PageStrings>
}

function IconClock() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="8.4" stroke="currentColor" strokeWidth="1.7" />
            <path d="M12 7.4V12l3 1.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
    )
}

export function DiningPage({ data, locale, slug, menu, strings }: DiningPageProps) {
    const t = (strings ?? defaultPageStrings)[locale]

    const categories = Object.values(menu ?? {})
    const [activeKey, setActiveKey] = useState<string>(categories[0]?.key ?? '')
    const active = categories.find((c) => c.key === activeKey) ?? categories[0]

    return (
        <PageBody theme={slug}>
            <PageHeader {...shellPropsOf(data, locale, slug, t)} />

            <PageHero
                title={t.diningTitle}
                sub={t.diningSub}
                crumbs={[{ label: t.home, href: themeRoot(slug) }, { label: t.diningPage }]}
                height={400}
                image={data.dining[0]?.image}
            />

            {/* ---------------------------------------------- các điểm ăn uống */}
            <section
                id="dining"
                style={{
                    background: 'var(--surface)',
                    padding: 'var(--space-8) var(--space-6) var(--space-4)',
                    scrollMarginTop: '80px',
                }}
            >
                <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                    <h2
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'var(--text-2xl)',
                            fontWeight: 800,
                            color: 'var(--text)',
                            letterSpacing: '-0.02em',
                            margin: '0 0 var(--space-6)',
                        }}
                    >
                        {t.venuesTitle}
                    </h2>

                    <div className="ui-dining-grid" style={{ display: 'grid', gap: 'var(--space-5)' }}>
                        {data.dining.map((venue) => (
                            <article
                                key={venue.id}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-lg)',
                                    overflow: 'hidden',
                                    background: 'var(--surface)',
                                }}
                            >
                                <div
                                    style={{
                                        height: 180,
                                        background: 'var(--surface-alt)',
                                        position: 'relative',
                                    }}
                                >
                                    {venue.image && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={venue.image}
                                            alt={pick(venue.name, locale)}
                                            loading="lazy"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    )}
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        flex: 1,
                                        padding: 'var(--space-5)',
                                    }}
                                >
                                    <h3
                                        style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: 'var(--text-lg)',
                                            fontWeight: 700,
                                            color: 'var(--text)',
                                            margin: '0 0 var(--space-2)',
                                        }}
                                    >
                                        {pick(venue.name, locale)}
                                    </h3>

                                    <p
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-2)',
                                            fontSize: 'var(--text-sm)',
                                            color: 'var(--brand)',
                                            fontWeight: 600,
                                            margin: '0 0 var(--space-3)',
                                        }}
                                    >
                                        <IconClock />
                                        {pick(venue.note, locale)}
                                    </p>

                                    <p
                                        style={{
                                            fontSize: 'var(--text-sm)',
                                            lineHeight: 1.6,
                                            color: 'var(--text-muted)',
                                            margin: 0,
                                        }}
                                    >
                                        {pick(venue.desc, locale)}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ------------------------------------------------------ thực đơn */}
            {active && (
                <section
                    style={{
                        background: 'var(--surface-alt)',
                        padding: 'var(--space-12) var(--space-6)',
                    }}
                >
                    <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                        <h2
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'var(--text-2xl)',
                                fontWeight: 800,
                                color: 'var(--text)',
                                letterSpacing: '-0.02em',
                                margin: '0 0 var(--space-1)',
                            }}
                        >
                            {t.menuTitle}
                        </h2>
                        <p
                            style={{
                                fontSize: 'var(--text-sm)',
                                color: 'var(--text-muted)',
                                margin: '0 0 var(--space-6)',
                            }}
                        >
                            {t.menuSub}
                        </p>

                        {/* Nhóm món — cùng cơ chế nút lọc với Gallery. */}
                        <div
                            style={{
                                display: 'flex',
                                gap: 'var(--space-2)',
                                flexWrap: 'wrap',
                                marginBottom: 'var(--space-6)',
                            }}
                        >
                            {categories.map((cat) => {
                                const on = cat.key === active.key
                                return (
                                    <button
                                        key={cat.key}
                                        type="button"
                                        onClick={() => setActiveKey(cat.key)}
                                        aria-pressed={on}
                                        style={{
                                            padding: 'var(--space-2) var(--space-4)',
                                            borderRadius: 'var(--radius-pill)',
                                            border: `1px solid ${on ? 'transparent' : 'var(--border-strong)'}`,
                                            background: on ? 'var(--accent)' : 'var(--surface)',
                                            color: on ? 'var(--text-inverse)' : 'var(--text)',
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: on ? 700 : 500,
                                            fontFamily: 'var(--font-body)',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap',
                                            minHeight: 40,
                                            transition:
                                                'background var(--duration) var(--ease), color var(--duration) var(--ease)',
                                        }}
                                    >
                                        {pick(cat.name, locale)}
                                    </button>
                                )
                            })}
                        </div>

                        <ul
                            className="ui-menu-list"
                            style={{
                                listStyle: 'none',
                                display: 'grid',
                                gap: 'var(--space-1)',
                                margin: 0,
                                padding: 0,
                            }}
                        >
                            {active.items.map((item) => (
                                <li
                                    key={item.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'baseline',
                                        gap: 'var(--space-3)',
                                        padding: 'var(--space-3) var(--space-4)',
                                        background: 'var(--surface)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius)',
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 600,
                                            color: 'var(--text)',
                                        }}
                                    >
                                        {pick(item.name, locale)}
                                    </span>
                                    {/* Đường kẻ nối tên món sang giá — nhịp thực đơn in. */}
                                    <span
                                        aria-hidden="true"
                                        style={{
                                            flex: 1,
                                            borderBottom: '1px dotted var(--border-strong)',
                                            transform: 'translateY(-4px)',
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 700,
                                            color: 'var(--brand)',
                                            fontVariantNumeric: 'tabular-nums',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {formatPrice(item.price, locale)}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <p
                            style={{
                                marginTop: 'var(--space-5)',
                                fontSize: 'var(--text-xs)',
                                color: 'var(--text-muted)',
                            }}
                        >
                            {t.menuNote}
                        </p>
                    </div>
                </section>
            )}

            {/* ----------------------------------------------------- dải CTA */}
            <section style={{ background: 'var(--surface)', padding: 'var(--space-12) var(--space-6)' }}>
                <div
                    style={{
                        maxWidth: 'var(--container)',
                        margin: '0 auto',
                        border: '1px solid var(--brand-light)',
                        background: 'var(--surface-tint)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 'var(--space-8)',
                        flexWrap: 'wrap',
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'var(--text-lg)',
                                fontWeight: 800,
                                color: 'var(--text)',
                                marginBottom: 'var(--space-1)',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            {t.diningCtaTitle}
                        </div>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--brand-dark)' }}>
                            {t.diningCtaSub}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                        <a
                            href={themePath(slug, 'contact')}
                            style={{
                                padding: 'var(--space-3) var(--space-6)',
                                borderRadius: 'var(--radius-pill)',
                                background: 'var(--accent)',
                                color: 'var(--text-inverse)',
                                fontSize: 'var(--text-sm)',
                                fontWeight: 700,
                                whiteSpace: 'nowrap',
                                textDecoration: 'none',
                            }}
                        >
                            {t.contactUs}
                        </a>
                        <a
                            href={themePath(slug, 'rooms')}
                            style={{
                                padding: 'var(--space-3) var(--space-6)',
                                borderRadius: 'var(--radius-pill)',
                                background: 'var(--surface)',
                                color: 'var(--brand)',
                                fontSize: 'var(--text-sm)',
                                fontWeight: 700,
                                whiteSpace: 'nowrap',
                                textDecoration: 'none',
                            }}
                        >
                            {t.viewRooms}
                        </a>
                    </div>
                </div>
            </section>

            <PageFooter {...shellPropsOf(data, locale, slug, t)} />

            <style>{`
                .ui-dining-grid { grid-template-columns: repeat(1, minmax(0, 1fr)); }
                .ui-menu-list   { grid-template-columns: repeat(1, minmax(0, 1fr)); }
                @media (min-width: 720px) {
                    .ui-dining-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                    .ui-menu-list   { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                }
                @media (min-width: 980px) {
                    .ui-dining-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
                }
            `}</style>
        </PageBody>
    )
}
