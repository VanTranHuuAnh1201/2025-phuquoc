'use client'

import type { CSSProperties } from 'react'
import {
    formatPrice,
    pick,
    themeRoot,
    tourPath,
    type Locale,
    type PropertyData,
} from '@repo/core'

import { PageBody, PageFooter, PageHeader, PageHero } from './PageShell'
import { defaultPageStrings, type PageStrings } from './strings'

/**
 * Trang danh sách combo & tour — port từ `Tours - Nam Du Hill.dc.html`.
 *
 * Prototype chỉ có MỘT bản trang này, nên cả N mẫu dùng chung bố cục và chỉ
 * khác token (luật R1).
 *
 * Bố cục bám sát prototype:
 *   hero 420px → dải 4 số liệu → danh sách combo (ảnh 380px | nội dung)
 *   → dải "Điểm đến" nền xám với lưới 4 cột
 */

export interface ToursPageProps {
    data: PropertyData
    locale: Locale
    slug: string
    strings?: Record<Locale, PageStrings>
}

export function ToursPage({ data, locale, slug, strings }: ToursPageProps) {
    const t = (strings ?? defaultPageStrings)[locale]

    return (
        <PageBody slug={slug}>
            <PageHeader data={data} locale={locale} slug={slug} t={t} />

            <PageHero
                title={t.toursTitle}
                sub={t.toursSub}
                crumbs={[{ label: t.home, href: themeRoot(slug) }, { label: t.toursPage }]}
            />

            {/* ---- dải số liệu ---- */}
            <section style={{ background: 'var(--surface)', padding: 'var(--space-8) var(--space-6) 0' }}>
                <div
                    className="ui-facts-grid"
                    style={{
                        maxWidth: 'var(--container)',
                        margin: '0 auto',
                        display: 'grid',
                        gap: 'var(--space-4)',
                    }}
                >
                    {data.facts.map((fact, i) => (
                        <div
                            key={i}
                            style={{
                                background: 'var(--surface-alt)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius)',
                                padding: 'var(--space-5)',
                            }}
                        >
                            <div
                                style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: 'var(--text-2xl)',
                                    fontWeight: 800,
                                    color: 'var(--accent)',
                                    letterSpacing: '-0.03em',
                                    marginBottom: 'var(--space-1)',
                                }}
                            >
                                {fact.value}
                            </div>
                            <div
                                style={{
                                    fontSize: 'var(--text-sm)',
                                    color: 'var(--text-muted)',
                                    lineHeight: 1.5,
                                }}
                            >
                                {pick(fact.label, locale)}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ---- danh sách combo ---- */}
            <section
                id="tours"
                style={{
                    background: 'var(--surface)',
                    padding: 'var(--space-12) var(--space-6) var(--space-5)',
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
                            margin: '0 0 var(--space-6)',
                            letterSpacing: '-0.025em',
                        }}
                    >
                        {t.combosTitle}
                    </h2>

                    <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
                        {data.tours.map((tour) => (
                            <article
                                key={tour.id}
                                className="ui-tour-card"
                                style={{
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-lg)',
                                    overflow: 'hidden',
                                    background: 'var(--surface)',
                                    display: 'grid',
                                }}
                            >
                                <div
                                    style={{
                                        position: 'relative',
                                        minHeight: 260,
                                        background: 'var(--surface-alt)',
                                    }}
                                >
                                    {/* `Tour` trong core chưa có trường ảnh — ô giữ nền
                                        xám như `image-slot` của prototype. */}
                                    <span
                                        style={{
                                            position: 'absolute',
                                            top: 'var(--space-3)',
                                            left: 'var(--space-3)',
                                            zIndex: 1,
                                            padding: 'var(--space-1) var(--space-3)',
                                            borderRadius: 'var(--radius-pill)',
                                            background: 'var(--accent)',
                                            color: 'var(--text-inverse)',
                                            fontSize: 'var(--text-xs)',
                                            fontWeight: 700,
                                        }}
                                    >
                                        {tour.code}
                                    </span>
                                </div>

                                <div
                                    style={{
                                        padding: 'var(--space-6)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <h3
                                        style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: 'var(--text-xl)',
                                            fontWeight: 800,
                                            color: 'var(--text)',
                                            margin: '0 0 var(--space-2)',
                                            letterSpacing: '-0.025em',
                                        }}
                                    >
                                        {pick(tour.name, locale)}
                                    </h3>

                                    <p
                                        style={{
                                            fontSize: 'var(--text-sm)',
                                            lineHeight: 1.7,
                                            color: 'var(--text-muted)',
                                            margin: '0 0 var(--space-4)',
                                        }}
                                    >
                                        {pick(tour.summary, locale)}
                                    </p>

                                    {/* Điểm nổi bật: lấy mục đầu của mỗi ngày trong lịch trình. */}
                                    <div
                                        style={{
                                            display: 'grid',
                                            gap: 'var(--space-2)',
                                            marginBottom: 'var(--space-5)',
                                        }}
                                    >
                                        {tour.days.slice(0, 3).map((day, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    display: 'flex',
                                                    gap: 'var(--space-3)',
                                                    alignItems: 'flex-start',
                                                }}
                                            >
                                                <span aria-hidden="true" style={DOT} />
                                                <span
                                                    style={{
                                                        fontSize: 'var(--text-sm)',
                                                        lineHeight: 1.6,
                                                        color: 'var(--text-muted)',
                                                    }}
                                                >
                                                    {pick(day.label, locale)}
                                                    {day.items[0] ? ` — ${pick(day.items[0], locale)}` : ''}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div
                                        style={{
                                            marginTop: 'auto',
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                            justifyContent: 'space-between',
                                            gap: 'var(--space-4)',
                                            flexWrap: 'wrap',
                                            paddingTop: 'var(--space-4)',
                                            borderTop: '1px solid var(--border)',
                                        }}
                                    >
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: 'var(--text-xs)',
                                                    color: 'var(--text-muted)',
                                                }}
                                            >
                                                {t.fromPrice}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 'var(--text-2xl)',
                                                    fontWeight: 800,
                                                    color: 'var(--text)',
                                                    letterSpacing: '-0.03em',
                                                }}
                                            >
                                                {formatPrice(tour.price, locale)}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 'var(--text-xs)',
                                                    color: 'var(--text-muted)',
                                                }}
                                            >
                                                {t.perGuest}
                                            </div>
                                        </div>

                                        <div
                                            style={{
                                                display: 'flex',
                                                gap: 'var(--space-2)',
                                                flexWrap: 'wrap',
                                            }}
                                        >
                                            <a href={tourPath(slug, tour.id)} style={GHOST_BUTTON}>
                                                {t.viewItinerary}
                                            </a>
                                            <a href={tourPath(slug, tour.id)} style={SOLID_BUTTON}>
                                                {t.bookTour}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---- điểm đến ---- */}
            <section
                id="places"
                style={{
                    background: 'var(--surface-alt)',
                    padding: 'var(--space-16) var(--space-6) var(--space-20)',
                    marginTop: 'var(--space-12)',
                    scrollMarginTop: '80px',
                }}
            >
                <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                        <div
                            style={{
                                display: 'inline-block',
                                padding: 'var(--space-1) var(--space-3)',
                                borderRadius: 'var(--radius-pill)',
                                background: 'var(--surface-tint)',
                                color: 'var(--brand)',
                                fontSize: 'var(--text-xs)',
                                fontWeight: 600,
                                marginBottom: 'var(--space-3)',
                            }}
                        >
                            {t.placesKicker}
                        </div>
                        <h2
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'var(--text-2xl)',
                                lineHeight: 1.18,
                                fontWeight: 800,
                                color: 'var(--text)',
                                margin: '0 0 var(--space-2)',
                                letterSpacing: '-0.03em',
                            }}
                        >
                            {t.placesTitle}
                        </h2>
                        <p
                            style={{
                                fontSize: 'var(--text-base)',
                                color: 'var(--text-muted)',
                                margin: '0 auto',
                                maxWidth: 540,
                            }}
                        >
                            {t.placesSub}
                        </p>
                    </div>

                    <div className="ui-places-grid" style={{ display: 'grid', gap: 'var(--space-5)' }}>
                        {data.places.map((place) => (
                            <article
                                key={place.id}
                                className="ui-place-card"
                                style={{
                                    background: 'var(--surface)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-lg)',
                                    overflow: 'hidden',
                                }}
                            >
                                <div
                                    style={{
                                        position: 'relative',
                                        height: 156,
                                        background: 'var(--surface-alt)',
                                    }}
                                >
                                    {place.image && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={place.image}
                                            alt={pick(place.name, locale)}
                                            loading="lazy"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    )}
                                </div>
                                <div style={{ padding: 'var(--space-4) var(--space-5) var(--space-5)' }}>
                                    <div
                                        style={{
                                            fontSize: 'var(--text-xs)',
                                            fontWeight: 700,
                                            letterSpacing: '0.06em',
                                            textTransform: 'uppercase',
                                            color: 'var(--brand)',
                                            marginBottom: 'var(--space-1)',
                                        }}
                                    >
                                        {pick(place.tag, locale)}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 'var(--text-base)',
                                            fontWeight: 700,
                                            color: 'var(--text)',
                                            marginBottom: 'var(--space-1)',
                                            lineHeight: 1.35,
                                        }}
                                    >
                                        {pick(place.name, locale)}
                                    </div>
                                    <p
                                        style={{
                                            fontSize: 'var(--text-sm)',
                                            lineHeight: 1.6,
                                            color: 'var(--text-muted)',
                                            margin: 0,
                                        }}
                                    >
                                        {pick(place.desc, locale)}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <PageFooter data={data} locale={locale} slug={slug} t={t} />

            <style>{`
                @media (min-width: 640px) {
                    .ui-facts-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
                    .ui-places-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                }
                @media (min-width: 980px) {
                    .ui-tour-card { grid-template-columns: minmax(220px, 380px) minmax(0, 1fr); }
                    .ui-places-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
                }
                .ui-tour-card { transition: box-shadow var(--duration) var(--ease); }
                .ui-tour-card:hover { box-shadow: var(--shadow); }
                .ui-place-card { transition: box-shadow var(--duration) var(--ease), transform var(--duration) var(--ease); }
                .ui-place-card:hover { box-shadow: var(--shadow); transform: translateY(-4px); }
            `}</style>
        </PageBody>
    )
}

const DOT: CSSProperties = {
    width: 5,
    height: 5,
    borderRadius: 'var(--radius-pill)',
    background: 'var(--accent)',
    flexShrink: 0,
    marginTop: 8,
}

const GHOST_BUTTON: CSSProperties = {
    padding: 'var(--space-3) var(--space-5)',
    borderRadius: 'var(--radius-pill)',
    border: '1px solid var(--border-strong)',
    color: 'var(--text)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    textDecoration: 'none',
}

const SOLID_BUTTON: CSSProperties = {
    padding: 'var(--space-3) var(--space-6)',
    borderRadius: 'var(--radius-pill)',
    background: 'var(--accent)',
    color: 'var(--text-inverse)',
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
    whiteSpace: 'nowrap',
    textDecoration: 'none',
}
