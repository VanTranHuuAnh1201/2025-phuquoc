'use client'

import { useState } from 'react'
import { pick, tourPath, type Locale, type PropertyData } from '@repo/core'
import { SectionHeader } from '@repo/ui'

import { meta } from '../meta'
import { ui } from '../strings'

const SLUG = meta.slug

/**
 * Lịch trình combo mẫu 03 — cột TAB DỌC dính bên trái, lịch trình từng ngày
 * bên phải. Mẫu 01 làm ngược lại (tab ngang trên, thẻ giá dính bên phải).
 *
 * Mỗi tab hiện mã combo, tên và câu tóm tắt — prototype dùng `summary` ở chỗ
 * này chứ không dùng giá, nên section không cần `formatPrice`.
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
                padding: '76px var(--space-6) var(--space-20)',
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
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                        gap: 'var(--space-8)',
                        alignItems: 'start',
                    }}
                >
                    <div
                        style={{
                            display: 'grid',
                            gap: 'var(--space-3)',
                            position: 'sticky',
                            top: 100,
                            maxWidth: 340,
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
                                        textAlign: 'left',
                                        display: 'grid',
                                        gap: 4,
                                        padding: '18px 22px',
                                        borderRadius: 'var(--radius-lg)',
                                        border: `1px solid ${selected ? 'var(--brand)' : 'var(--border)'}`,
                                        background: selected ? 'var(--brand)' : 'var(--surface)',
                                        color: selected ? 'var(--text-inverse)' : 'var(--brand)',
                                        cursor: 'pointer',
                                        fontFamily: 'var(--font-body)',
                                        transition:
                                            'background var(--duration) var(--ease), color var(--duration) var(--ease)',
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: 'var(--text-xs)',
                                            fontWeight: 700,
                                            letterSpacing: '0.1em',
                                            opacity: 0.72,
                                        }}
                                    >
                                        {tour.code}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: 'var(--text-lg)',
                                            fontWeight: 800,
                                            letterSpacing: '-0.02em',
                                        }}
                                    >
                                        {pick(tour.name, locale)}
                                    </span>
                                    <span style={{ fontSize: 'var(--text-sm)', opacity: 0.78 }}>
                                        {pick(tour.summary, locale)}
                                    </span>
                                </button>
                            )
                        })}

                        {/* Nút đặt nằm NGOÀI vòng lặp: nó đi theo tour đang chọn
                            ở cột tab bên trái, không phải một tour cố định. */}
                        <a
                            href={tourPath(SLUG, data.tours[current]!.id)}
                            style={{
                                marginTop: 6,
                                textAlign: 'center',
                                padding: 'var(--space-3)',
                                borderRadius: 'var(--radius-pill)',
                                background: 'var(--brand)',
                                color: 'var(--text-inverse)',
                                fontSize: '14.5px',
                                fontWeight: 700,
                                textDecoration: 'none',
                            }}
                        >
                            {t.bookTour}
                        </a>
                    </div>

                    <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                        {active.days.map((day, index) => (
                            <div
                                key={day.label.en}
                                style={{
                                    background: 'var(--surface-tint)',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: 'var(--space-6) 28px',
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
                                            color: 'var(--text)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 800,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {index + 1}
                                    </span>
                                    <h3
                                        style={{
                                            fontSize: 'var(--text-lg)',
                                            fontWeight: 800,
                                            color: 'var(--brand)',
                                            margin: 0,
                                            letterSpacing: '-0.01em',
                                        }}
                                    >
                                        {pick(day.label, locale)}
                                    </h3>
                                </div>

                                <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
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
                                                    background: 'var(--brand)',
                                                    marginTop: 8,
                                                    flexShrink: 0,
                                                }}
                                            />
                                            <span
                                                style={{
                                                    fontSize: 'var(--text-base)',
                                                    lineHeight: 1.68,
                                                    color: 'var(--text)',
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
                </div>
            </div>
        </section>
    )
}
