'use client'

import { useState } from 'react'
import { formatPrice, pick, themePath, type Locale, type PropertyData } from '@repo/core'
import { SectionHeader } from '@repo/ui'

import { meta } from '../meta'
import { ui } from '../strings'

const SLUG = meta.slug

/**
 * Lịch trình combo — tab chọn tour, lịch trình từng ngày bên trái, thẻ giá
 * dính (sticky) bên phải.
 *
 * Đây là section duy nhất của mẫu 01 cần trạng thái, nên chỉ file này là
 * client component; phần còn lại của trang vẫn render trên server.
 */

export function Tours({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui[locale]
    const [current, setCurrent] = useState(0)

    const active = data.tours[current] ?? data.tours[0]
    if (!active) return null

    return (
        <section
            id="tours"
            style={{
                background: 'var(--surface)',
                padding: 'var(--space-16) var(--space-6) var(--space-20)',
                scrollMarginTop: '80px',
            }}
        >
            <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                <SectionHeader
                    kicker={t.toursKicker}
                    title={t.toursTitle}
                    sub={t.toursSub}
                    align="center"
                />

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 'var(--space-2)',
                        marginBottom: 'var(--space-8)',
                        flexWrap: 'wrap',
                    }}
                >
                    {data.tours.map((tour, index) => {
                        const selected = index === current
                        return (
                            <button
                                key={tour.id}
                                type="button"
                                onClick={() => setCurrent(index)}
                                aria-pressed={selected}
                                style={{
                                    padding: '11px 24px',
                                    borderRadius: 'var(--radius-pill)',
                                    border: `1px solid ${selected ? 'var(--surface-inverse)' : 'var(--border)'}`,
                                    background: selected ? 'var(--surface-inverse)' : 'var(--surface)',
                                    color: selected ? 'var(--text-inverse)' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 600,
                                    fontFamily: 'var(--font-body)',
                                    transition: 'background var(--duration) var(--ease)',
                                }}
                            >
                                {pick(tour.name, locale)}
                            </button>
                        )
                    })}
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                        gap: 'var(--space-8)',
                        alignItems: 'start',
                    }}
                >
                    <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                        {active.days.map((day, index) => (
                            <div
                                key={day.label.en}
                                style={{
                                    background: 'var(--surface)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: 'var(--space-6)',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-3)',
                                        marginBottom: 'var(--space-4)',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: 30,
                                            height: 30,
                                            borderRadius: 'var(--radius-pill)',
                                            background: 'var(--accent)',
                                            color: 'var(--text-inverse)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 700,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {index + 1}
                                    </span>
                                    <h3
                                        style={{
                                            fontSize: 'var(--text-lg)',
                                            fontWeight: 700,
                                            color: 'var(--text)',
                                            margin: 0,
                                        }}
                                    >
                                        {pick(day.label, locale)}
                                    </h3>
                                </div>

                                <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                                    {day.items.map((item) => (
                                        <div
                                            key={item.en}
                                            style={{
                                                display: 'flex',
                                                gap: 'var(--space-3)',
                                                alignItems: 'flex-start',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    width: 6,
                                                    height: 6,
                                                    borderRadius: 'var(--radius-pill)',
                                                    background: 'var(--accent)',
                                                    marginTop: 8,
                                                    flexShrink: 0,
                                                }}
                                            />
                                            <span
                                                style={{
                                                    fontSize: 'var(--text-base)',
                                                    lineHeight: 1.65,
                                                    color: 'var(--text-muted)',
                                                }}
                                            >
                                                {pick(item, locale)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <aside
                        style={{
                            background: 'var(--surface-inverse)',
                            borderRadius: 'var(--radius-lg)',
                            padding: 'var(--space-6)',
                            position: 'sticky',
                            top: 96,
                            maxWidth: 360,
                        }}
                    >
                        <div
                            style={{
                                fontSize: 'var(--text-xs)',
                                fontWeight: 600,
                                color: 'var(--brand-light)',
                                marginBottom: 'var(--space-2)',
                            }}
                        >
                            {active.code}
                        </div>
                        <div
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'var(--text-xl)',
                                fontWeight: 700,
                                color: 'var(--text-inverse)',
                                marginBottom: 'var(--space-2)',
                                lineHeight: 1.3,
                            }}
                        >
                            {pick(active.name, locale)}
                        </div>
                        <p
                            style={{
                                fontSize: 'var(--text-sm)',
                                lineHeight: 1.65,
                                color: 'var(--text-inverse)',
                                opacity: 0.66,
                                margin: '0 0 var(--space-5)',
                            }}
                        >
                            {pick(active.summary, locale)}
                        </p>

                        <div
                            style={{
                                padding: 'var(--space-4) 0',
                                borderTop: '1px solid var(--overlay-line)',
                                borderBottom: '1px solid var(--overlay-line)',
                                marginBottom: 'var(--space-5)',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--text-inverse)',
                                    opacity: 0.5,
                                    marginBottom: 4,
                                }}
                            >
                                {t.fromPrice}
                            </div>
                            <div
                                style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '26px',
                                    fontWeight: 800,
                                    color: 'var(--text-inverse)',
                                    letterSpacing: '-0.02em',
                                }}
                            >
                                {formatPrice(active.price, locale)}
                            </div>
                            <div
                                style={{
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--text-inverse)',
                                    opacity: 0.5,
                                }}
                            >
                                {t.perGuest}
                            </div>
                        </div>

                        <a
                            href={themePath(SLUG, 'tours')}
                            style={{
                                display: 'block',
                                textAlign: 'center',
                                padding: 'var(--space-3)',
                                borderRadius: 'var(--radius-pill)',
                                background: 'var(--accent)',
                                color: 'var(--text-inverse)',
                                fontSize: 'var(--text-base)',
                                fontWeight: 700,
                                textDecoration: 'none',
                            }}
                        >
                            {t.bookTour}
                        </a>
                    </aside>
                </div>
            </div>
        </section>
    )
}
