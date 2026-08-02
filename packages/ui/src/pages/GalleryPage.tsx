'use client'

import { useMemo, useState } from 'react'
import { pick, themePath, themeRoot, type Locale, type PropertyData } from '@repo/core'

import { PageBody, PageFooter, PageHeader, PageHero } from './PageShell'
import { defaultPageStrings, type PageStrings } from './strings'

/**
 * Thư viện ảnh — port từ `Gallery - Nam Du Hill.dc.html`.
 *
 * Prototype chỉ có MỘT bản trang này (không có `Gallery H2/H3/H4`), nên cả N
 * mẫu dùng chung bố cục và chỉ khác token (luật R1 — không chép giữa các theme).
 *
 * Bố cục bám sát prototype:
 *   hero 400px → nút lọc theo nhóm + nhãn đếm
 *   → lưới 4 cột, hàng cao 200px, cứ 7 ô có một ô rộng gấp đôi
 *   → dải kêu gọi đặt phòng nền nhạt mang sắc thương hiệu
 */

type Category = 'all' | 'rooms' | 'dining' | 'places' | 'resort'

interface Shot {
    id: string
    hint: string
    src?: string
    category: Exclude<Category, 'all'>
}

export interface GalleryPageProps {
    data: PropertyData
    locale: Locale
    slug: string
    /** Bộ nhãn riêng của mẫu. Không truyền thì dùng bản mặc định. */
    strings?: Record<Locale, PageStrings>
}

/** Nhãn nhóm ảnh — song ngữ tại chỗ vì chúng chỉ dùng ở trang này. */
const CATEGORY_LABELS: Record<Exclude<Category, 'all'>, Record<Locale, string>> = {
    rooms: { vi: 'Phòng nghỉ', en: 'Rooms' },
    dining: { vi: 'Ẩm thực', en: 'Dining' },
    places: { vi: 'Điểm đến', en: 'Destinations' },
    resort: { vi: 'Khuôn viên', en: 'Grounds' },
}

const PHOTOS_WORD: Record<Locale, string> = { vi: 'ảnh', en: 'photos' }

export function GalleryPage({ data, locale, slug, strings }: GalleryPageProps) {
    const t = (strings ?? defaultPageStrings)[locale]
    const [category, setCategory] = useState<Category>('all')

    /**
     * Nguồn ảnh: gom từ chính dữ liệu `core` — ảnh phòng, ảnh điểm đến. Không
     * khai danh sách ảnh riêng trong theme (luật R8); thiếu ảnh thì ô hiện nền
     * xám, đúng như `image-slot` của prototype.
     */
    const shots: Shot[] = useMemo(() => {
        const roomShots: Shot[] = data.rooms.flatMap((room) =>
            (room.images ?? [undefined]).slice(0, 2).map((src, i) => ({
                id: `${room.id}-${i}`,
                hint: pick(room.name, locale),
                src,
                category: 'rooms' as const,
            })),
        )

        const placeShots: Shot[] = data.places.map((place) => ({
            id: place.id,
            hint: pick(place.name, locale),
            src: place.image,
            category: 'places' as const,
        }))

        const diningShots: Shot[] = data.dining.map((item) => ({
            id: item.id,
            hint: pick(item.name, locale),
            category: 'dining' as const,
        }))

        // Khuôn viên chưa có nguồn ảnh riêng trong core — giữ 4 ô trống để nhịp
        // lưới khớp prototype, thay bằng ảnh thật khi có.
        const resortShots: Shot[] = Array.from({ length: 4 }, (_, i) => ({
            id: `resort-${i}`,
            hint: CATEGORY_LABELS.resort[locale],
            category: 'resort' as const,
        }))

        return [...roomShots, ...placeShots, ...diningShots, ...resortShots]
    }, [data, locale])

    const visible = category === 'all' ? shots : shots.filter((s) => s.category === category)

    const cats: { id: Category; label: string }[] = [
        { id: 'all', label: t.filterAll },
        { id: 'rooms', label: CATEGORY_LABELS.rooms[locale] },
        { id: 'dining', label: CATEGORY_LABELS.dining[locale] },
        { id: 'places', label: CATEGORY_LABELS.places[locale] },
        { id: 'resort', label: CATEGORY_LABELS.resort[locale] },
    ]

    return (
        <PageBody slug={slug}>
            <PageHeader data={data} locale={locale} slug={slug} t={t} />

            <PageHero
                title={t.galleryTitle}
                sub={t.gallerySub}
                crumbs={[{ label: t.home, href: themeRoot(slug) }, { label: t.galleryPage }]}
                height={400}
            />

            <section
                id="gallery"
                style={{
                    background: 'var(--surface)',
                    padding: 'var(--space-8) var(--space-6) var(--space-20)',
                    scrollMarginTop: '80px',
                }}
            >
                <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 'var(--space-5)',
                            flexWrap: 'wrap',
                            marginBottom: 'var(--space-6)',
                        }}
                    >
                        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                            {cats.map((cat) => {
                                const active = category === cat.id
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setCategory(cat.id)}
                                        aria-pressed={active}
                                        style={{
                                            padding: 'var(--space-2) var(--space-4)',
                                            borderRadius: 'var(--radius-pill)',
                                            border: `1px solid ${
                                                active ? 'transparent' : 'var(--border-strong)'
                                            }`,
                                            background: active ? 'var(--accent)' : 'var(--surface)',
                                            color: active ? 'var(--text-inverse)' : 'var(--text)',
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: active ? 700 : 500,
                                            fontFamily: 'var(--font-body)',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap',
                                            minHeight: 40,
                                            transition:
                                                'background var(--duration) var(--ease), color var(--duration) var(--ease)',
                                        }}
                                    >
                                        {cat.label}
                                    </button>
                                )
                            })}
                        </div>
                        <span
                            aria-live="polite"
                            style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}
                        >
                            {visible.length} {PHOTOS_WORD[locale]}
                        </span>
                    </div>

                    <div
                        className="ui-gallery-grid"
                        style={{ display: 'grid', gridAutoRows: '200px', gap: 'var(--space-3)' }}
                    >
                        {visible.map((shot, index) => (
                            <div
                                key={shot.id}
                                // Cứ mỗi 7 ô lại có một ô rộng gấp đôi — nhịp bất đối xứng
                                // của prototype, tránh lưới đều tăm tắp.
                                className={index % 7 === 0 ? 'ui-shot ui-shot--wide' : 'ui-shot'}
                                style={{
                                    position: 'relative',
                                    borderRadius: 'var(--radius-lg)',
                                    overflow: 'hidden',
                                    background: 'var(--surface-alt)',
                                }}
                            >
                                {shot.src && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={shot.src}
                                        alt={shot.hint}
                                        loading="lazy"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                )}
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        padding: 'var(--space-6) var(--space-4) var(--space-3)',
                                        background:
                                            'linear-gradient(180deg, transparent 0%, var(--overlay-scrim) 100%)',
                                        fontSize: 'var(--text-xs)',
                                        fontWeight: 600,
                                        color: 'var(--text-inverse)',
                                        pointerEvents: 'none',
                                    }}
                                >
                                    {shot.hint}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div
                        style={{
                            marginTop: 'var(--space-12)',
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
                                {t.galleryCtaTitle}
                            </div>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--brand-dark)' }}>
                                {t.galleryCtaSub}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                            <a
                                href={themePath(slug, 'rooms')}
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
                                {t.viewRooms}
                            </a>
                            <a
                                href={themePath(slug, 'contact')}
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
                                {t.contactUs}
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <PageFooter data={data} locale={locale} slug={slug} t={t} />

            <style>{`
                .ui-gallery-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                @media (min-width: 720px) {
                    .ui-gallery-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                }
                @media (min-width: 980px) {
                    .ui-gallery-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
                    .ui-shot--wide { grid-column: span 2; }
                }
            `}</style>
        </PageBody>
    )
}
