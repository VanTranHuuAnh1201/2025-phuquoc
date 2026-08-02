'use client'

import type { CSSProperties } from 'react'
import {
    formatPrice,
    pick,
    themePath,
    themeRoot,
    tourPath,
    type Locale,
    type PropertyData,
} from '@repo/core'

import { LightCrumbs, PageBody, PageFooter, PageHeader } from './PageShell'
import { defaultPageStrings, type PageStrings } from './strings'

/**
 * Chi tiết một combo — port từ `Tour Detail - Nam Du Hill.dc.html`.
 *
 * Prototype chỉ có MỘT bản trang này, nên cả N mẫu dùng chung (luật R1).
 *
 * Bố cục bám sát prototype:
 *   breadcrumb nền sáng → tiêu đề + dải thông tin nhanh
 *   → lưới `1fr / 360px`: trái là lịch trình theo ngày + bao gồm/không bao gồm,
 *     phải là thẻ giá dính (sticky)
 *   → dải "Combo khác"
 *
 * Trang KHÔNG tự tính giá: `tour.price` đến từ `core` và hiển thị qua
 * `formatPrice` (luật R8).
 */

export interface TourDetailPageProps {
    data: PropertyData
    locale: Locale
    slug: string
    /** Id combo lấy từ route. Không khớp thì rơi về combo đầu tiên. */
    tourSlug?: string
    strings?: Record<Locale, PageStrings>
}

/** Nhãn chỉ dùng ở trang này — song ngữ tại chỗ (luật R6). */
const L = {
    included: {
        vi: ['Tàu cao tốc khứ hồi Rạch Giá – Nam Du', 'Phòng nghỉ theo hạng đã chọn', 'Bữa sáng hằng ngày', 'Tàu tham quan các hòn', 'Hướng dẫn viên địa phương', 'Bảo hiểm du lịch'],
        en: ['Return speedboat Rach Gia – Nam Du', 'Accommodation in the selected room type', 'Daily breakfast', 'Island-hopping boat', 'Local guide', 'Travel insurance'],
    },
    excluded: {
        vi: ['Chi phí cá nhân, đồ uống ngoài thực đơn', 'Vé máy bay / xe khách tới Rạch Giá', 'Phụ thu phòng đơn', 'Tiền tip cho hướng dẫn viên'],
        en: ['Personal expenses and drinks off the set menu', 'Flights or coach tickets to Rach Gia', 'Single-room supplement', 'Gratuities for the guide'],
    },
    notes: {
        vi: [
            'Lịch trình có thể đổi theo điều kiện thời tiết và lịch tàu.',
            'Mang theo CCCD hoặc hộ chiếu để làm thủ tục lên tàu.',
            'Trẻ dưới 5 tuổi miễn phí, 6–11 tuổi tính 50% giá tour.',
        ],
        en: [
            'The itinerary may shift with weather and ferry schedules.',
            'Bring your ID card or passport for boarding.',
            'Children under 5 travel free; ages 6–11 pay 50%.',
        ],
    },
    duration: { vi: 'Theo lịch trình', en: 'Per itinerary' },
    groupSize: { vi: '2–16 khách', en: '2–16 guests' },
    departure: { vi: 'Cảng Rạch Giá, hằng ngày', en: 'Rach Gia port, daily' },
    dayWord: { vi: 'Ngày', en: 'Day' },
} satisfies Record<string, Record<Locale, unknown>>

export function TourDetailPage({ data, locale, slug, tourSlug, strings }: TourDetailPageProps) {
    const t = (strings ?? defaultPageStrings)[locale]

    const tour = data.tours.find((item) => item.id === tourSlug) ?? data.tours[0]
    if (!tour) return null

    const others = data.tours.filter((item) => item.id !== tour.id).slice(0, 3)

    return (
        <PageBody slug={slug}>
            <PageHeader data={data} locale={locale} slug={slug} t={t} />

            <LightCrumbs
                crumbs={[
                    { label: t.home, href: themeRoot(slug) },
                    { label: t.toursPage, href: themePath(slug, 'tours') },
                    { label: pick(tour.name, locale) },
                ]}
            />

            {/* ---- tiêu đề ---- */}
            <section style={{ background: 'var(--surface-alt)', padding: '0 var(--space-6) var(--space-8)' }}>
                <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                    <span
                        style={{
                            display: 'inline-block',
                            padding: 'var(--space-1) var(--space-3)',
                            borderRadius: 'var(--radius-pill)',
                            background: 'var(--accent)',
                            color: 'var(--text-inverse)',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 700,
                            marginBottom: 'var(--space-3)',
                        }}
                    >
                        {tour.code}
                    </span>
                    <h1
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'var(--text-3xl)',
                            lineHeight: 1.15,
                            fontWeight: 800,
                            color: 'var(--text)',
                            margin: '0 0 var(--space-3)',
                            letterSpacing: '-0.03em',
                        }}
                    >
                        {pick(tour.name, locale)}
                    </h1>
                    <p
                        style={{
                            fontSize: 'var(--text-base)',
                            lineHeight: 1.7,
                            color: 'var(--text-muted)',
                            margin: 0,
                            maxWidth: 720,
                        }}
                    >
                        {pick(tour.summary, locale)}
                    </p>
                </div>
            </section>

            {/* ---- nội dung ---- */}
            <section style={{ background: 'var(--surface)', padding: 'var(--space-12) var(--space-6) var(--space-20)' }}>
                <div
                    className="ui-detail-grid"
                    style={{
                        maxWidth: 'var(--container)',
                        margin: '0 auto',
                        display: 'grid',
                        gap: 'var(--space-8)',
                        alignItems: 'start',
                    }}
                >
                    {/* ---- cột trái ---- */}
                    <div>
                        <h2 style={HEADING}>{t.itineraryTitle}</h2>

                        <ol style={{ listStyle: 'none', margin: '0 0 var(--space-12)', padding: 0, display: 'grid', gap: 'var(--space-4)' }}>
                            {tour.days.map((day, index) => (
                                <li
                                    key={index}
                                    style={{
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-lg)',
                                        padding: 'var(--space-5)',
                                        background: 'var(--surface)',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-3)',
                                            marginBottom: 'var(--space-3)',
                                        }}
                                    >
                                        <span
                                            aria-hidden="true"
                                            style={{
                                                display: 'grid',
                                                placeItems: 'center',
                                                width: 30,
                                                height: 30,
                                                flexShrink: 0,
                                                borderRadius: 'var(--radius-pill)',
                                                background: 'var(--brand)',
                                                color: 'var(--text-inverse)',
                                                fontSize: 'var(--text-xs)',
                                                fontWeight: 800,
                                            }}
                                        >
                                            {index + 1}
                                        </span>
                                        <span
                                            style={{
                                                fontFamily: 'var(--font-display)',
                                                fontSize: 'var(--text-lg)',
                                                fontWeight: 800,
                                                color: 'var(--text)',
                                                letterSpacing: '-0.02em',
                                            }}
                                        >
                                            {pick(day.label, locale)}
                                        </span>
                                    </div>

                                    <div style={{ display: 'grid', gap: 'var(--space-2)', paddingLeft: 42 }}>
                                        {day.items.map((item, i) => (
                                            <div
                                                key={i}
                                                style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}
                                            >
                                                <span aria-hidden="true" style={DOT} />
                                                <span
                                                    style={{
                                                        fontSize: 'var(--text-sm)',
                                                        lineHeight: 1.65,
                                                        color: 'var(--text-muted)',
                                                    }}
                                                >
                                                    {pick(item, locale)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </li>
                            ))}
                        </ol>

                        {/* ---- bao gồm / không bao gồm ---- */}
                        <div className="ui-include-grid" style={{ display: 'grid', gap: 'var(--space-6)' }}>
                            <div>
                                <h2 style={HEADING}>{t.includedTitle}</h2>
                                <ul style={LIST}>
                                    {L.included[locale].map((line, i) => (
                                        <li key={i} style={LIST_ITEM}>
                                            <span aria-hidden="true" style={{ ...DOT, background: 'var(--success)' }} />
                                            <span>{line}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h2 style={HEADING}>{t.excludedTitle}</h2>
                                <ul style={LIST}>
                                    {L.excluded[locale].map((line, i) => (
                                        <li key={i} style={LIST_ITEM}>
                                            <span aria-hidden="true" style={{ ...DOT, background: 'var(--border-strong)' }} />
                                            <span>{line}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* ---- lưu ý ---- */}
                        <div
                            style={{
                                marginTop: 'var(--space-8)',
                                border: '1px solid var(--warning)',
                                background: 'var(--warning-bg)',
                                borderRadius: 'var(--radius-lg)',
                                padding: 'var(--space-5)',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 700,
                                    color: 'var(--text)',
                                    marginBottom: 'var(--space-2)',
                                }}
                            >
                                {t.tourNotesTitle}
                            </div>
                            <ul style={{ ...LIST, gap: 'var(--space-1)' }}>
                                {L.notes[locale].map((line, i) => (
                                    <li key={i} style={LIST_ITEM}>
                                        <span aria-hidden="true" style={{ ...DOT, background: 'var(--warning)' }} />
                                        <span>{line}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* ---- thẻ giá dính ---- */}
                    <aside
                        style={{
                            position: 'sticky',
                            top: 96,
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: 'var(--space-6)',
                            background: 'var(--surface)',
                            boxShadow: 'var(--shadow-sm)',
                        }}
                    >
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                            {t.fromPrice}
                        </div>
                        <div
                            style={{
                                fontSize: 'var(--text-3xl)',
                                fontWeight: 800,
                                color: 'var(--text)',
                                letterSpacing: '-0.03em',
                                lineHeight: 1.1,
                            }}
                        >
                            {formatPrice(tour.price, locale)}
                        </div>
                        <div
                            style={{
                                fontSize: 'var(--text-xs)',
                                color: 'var(--text-muted)',
                                marginBottom: 'var(--space-5)',
                            }}
                        >
                            {t.perGuest}
                        </div>

                        <dl style={{ margin: '0 0 var(--space-5)', display: 'grid', gap: 'var(--space-3)' }}>
                            <SpecRow label={t.departureTitle} value={L.departure[locale]} />
                            <SpecRow label={t.durationLabel} value={L.duration[locale]} />
                            <SpecRow label={t.groupSizeLabel} value={L.groupSize[locale]} />
                        </dl>

                        <a
                            href={themePath(slug, 'rooms')}
                            style={{
                                display: 'block',
                                textAlign: 'center',
                                padding: 'var(--space-3) var(--space-5)',
                                borderRadius: 'var(--radius-pill)',
                                background: 'var(--accent)',
                                color: 'var(--text-inverse)',
                                fontSize: 'var(--text-sm)',
                                fontWeight: 700,
                                textDecoration: 'none',
                            }}
                        >
                            {t.bookTour}
                        </a>

                        <a
                            href={themePath(slug, 'tours')}
                            style={{
                                display: 'block',
                                textAlign: 'center',
                                marginTop: 'var(--space-2)',
                                padding: 'var(--space-3) var(--space-5)',
                                borderRadius: 'var(--radius-pill)',
                                border: '1px solid var(--border-strong)',
                                color: 'var(--text)',
                                fontSize: 'var(--text-sm)',
                                fontWeight: 600,
                                textDecoration: 'none',
                            }}
                        >
                            {t.backToTours}
                        </a>
                    </aside>
                </div>
            </section>

            {/* ---- combo khác ---- */}
            {others.length > 0 && (
                <section
                    style={{
                        background: 'var(--surface-alt)',
                        padding: 'var(--space-16) var(--space-6)',
                    }}
                >
                    <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                        <h2 style={{ ...HEADING, marginBottom: 'var(--space-6)' }}>{t.otherTours}</h2>

                        <div className="ui-others-grid" style={{ display: 'grid', gap: 'var(--space-5)' }}>
                            {others.map((other) => (
                                <a
                                    key={other.id}
                                    href={tourPath(slug, other.id)}
                                    className="ui-place-card"
                                    style={{
                                        display: 'block',
                                        background: 'var(--surface)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-lg)',
                                        padding: 'var(--space-5)',
                                        textDecoration: 'none',
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 'var(--text-xs)',
                                            fontWeight: 700,
                                            color: 'var(--brand)',
                                            marginBottom: 'var(--space-2)',
                                        }}
                                    >
                                        {other.code}
                                    </div>
                                    <div
                                        style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: 'var(--text-lg)',
                                            fontWeight: 800,
                                            color: 'var(--text)',
                                            marginBottom: 'var(--space-2)',
                                            letterSpacing: '-0.02em',
                                        }}
                                    >
                                        {pick(other.name, locale)}
                                    </div>
                                    <p
                                        style={{
                                            fontSize: 'var(--text-sm)',
                                            lineHeight: 1.6,
                                            color: 'var(--text-muted)',
                                            margin: '0 0 var(--space-3)',
                                        }}
                                    >
                                        {pick(other.summary, locale)}
                                    </p>
                                    <div
                                        style={{
                                            fontSize: 'var(--text-lg)',
                                            fontWeight: 800,
                                            color: 'var(--text)',
                                        }}
                                    >
                                        {formatPrice(other.price, locale)}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <PageFooter data={data} locale={locale} slug={slug} t={t} />

            <style>{`
                @media (min-width: 980px) {
                    .ui-detail-grid { grid-template-columns: minmax(0, 1fr) 360px; }
                    .ui-include-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                    .ui-others-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                }
                @media (min-width: 640px) and (max-width: 979px) {
                    .ui-others-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                }
                .ui-place-card { transition: box-shadow var(--duration) var(--ease), transform var(--duration) var(--ease); }
                .ui-place-card:hover { box-shadow: var(--shadow); transform: translateY(-4px); }
            `}</style>
        </PageBody>
    )
}

function SpecRow({ label, value }: { label: string; value: string }) {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 'var(--space-3)',
                fontSize: 'var(--text-sm)',
                paddingBottom: 'var(--space-3)',
                borderBottom: '1px solid var(--border)',
            }}
        >
            <dt style={{ color: 'var(--text-muted)' }}>{label}</dt>
            <dd style={{ margin: 0, color: 'var(--text)', fontWeight: 600, textAlign: 'right' }}>
                {value}
            </dd>
        </div>
    )
}

const HEADING: CSSProperties = {
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--text-xl)',
    fontWeight: 800,
    color: 'var(--text)',
    margin: '0 0 var(--space-4)',
    letterSpacing: '-0.025em',
}

const LIST: CSSProperties = {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'grid',
    gap: 'var(--space-2)',
}

const LIST_ITEM: CSSProperties = {
    display: 'flex',
    gap: 'var(--space-3)',
    alignItems: 'flex-start',
    fontSize: 'var(--text-sm)',
    lineHeight: 1.65,
    color: 'var(--text-muted)',
}

const DOT: CSSProperties = {
    width: 5,
    height: 5,
    borderRadius: 'var(--radius-pill)',
    background: 'var(--accent)',
    flexShrink: 0,
    marginTop: 8,
}
