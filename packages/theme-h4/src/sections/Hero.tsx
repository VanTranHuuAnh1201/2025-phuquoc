import { formatPrice, pick, themePath, type Locale, type PropertyData } from '@repo/core'
import { ImageSlot } from '@repo/ui'

import { meta } from '../meta'
import { ui } from '../strings'

const SLUG = meta.slug

/**
 * Hero mẫu 04 — bố cục CHÉO, không phải ảnh nền tràn như ba mẫu kia.
 *
 * Hai lớp ảnh cắt xiên (`clip-path`) chiếm nửa phải, chữ nằm trọn nửa trái
 * trên nền sáng. Bổ sung: hai thẻ nổi bên phải (điểm đánh giá + giá thấp
 * nhất), dải ảnh nhỏ góc dưới trái và thanh tra cứu bo tròn đè lên mép dưới.
 *
 * Section chỉ lo HÌNH THỨC. Giá lấy qua `formatPrice` của core, không tự
 * định dạng (luật R4, R8).
 */

const LABEL: React.CSSProperties = {
    fontSize: 'var(--text-xs)',
    fontWeight: 700,
    color: 'var(--brand)',
}

const FIELD: React.CSSProperties = {
    width: '100%',
    padding: '11px 13px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    fontFamily: 'var(--font-body)',
    background: 'var(--surface)',
    color: 'var(--text)',
    outline: 'none',
}

const THUMBS = [
    { vi: 'Ảnh nhỏ 1', en: 'Thumbnail 1' },
    { vi: 'Ảnh nhỏ 2', en: 'Thumbnail 2' },
    { vi: 'Ảnh nhỏ 3', en: 'Thumbnail 3' },
] as const

export function Hero({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui[locale]
    const { hero, rooms } = data

    // Giá thấp nhất trong các hạng phòng — chỉ đọc từ dữ liệu, không tự khai.
    const lowest = rooms.length ? Math.min(...rooms.map((room) => room.price)) : 0
    const thumbSources = rooms.flatMap((room) => room.images ?? [])

    return (
        <section
            id="top"
            style={{
                position: 'relative',
                minHeight: 'min(100vh, 900px)',
                background: 'var(--surface-alt)',
                overflow: 'hidden',
            }}
        >
            {/* Lớp ảnh chính, cắt xiên từ 26% mép trên. */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: '58%',
                    clipPath: 'polygon(26% 0, 100% 0, 100% 100%, 0 100%)',
                    overflow: 'hidden',
                }}
            >
                <ImageSlot
                    placeholder={t.heroImage}
                    src={thumbSources[0]}
                    height="100%"
                    style={{ borderRadius: 0 }}
                />
            </div>

            {/* Lớp ảnh phụ chồng lên, tạo hai nhát cắt song song. */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: '30%',
                    clipPath: 'polygon(48% 0, 100% 0, 100% 100%, 0 100%)',
                    overflow: 'hidden',
                }}
            >
                <ImageSlot
                    placeholder={locale === 'vi' ? 'Ảnh hero phụ — hồ bơi' : 'Secondary hero — pool'}
                    src={thumbSources[1]}
                    height="100%"
                    style={{ borderRadius: 0 }}
                />
            </div>

            {/* Vân sọc xiên mảnh phủ toàn hero. */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage:
                        'repeating-linear-gradient(115deg, rgba(6,97,104,0.05) 0 1.5px, transparent 1.5px 22px)',
                    pointerEvents: 'none',
                    zIndex: 2,
                }}
            />

            <div
                style={{
                    position: 'relative',
                    zIndex: 3,
                    maxWidth: 'var(--container)',
                    margin: '0 auto',
                    minHeight: 'min(100vh, 900px)',
                    padding: '124px var(--space-6) 260px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                }}
            >
                <div style={{ maxWidth: 'min(46%, 620px)', minWidth: 'min(100%, 320px)' }}>
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 9,
                            padding: '7px 15px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--surface)',
                            boxShadow: 'var(--shadow-sm)',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 700,
                            color: 'var(--brand)',
                            marginBottom: 22,
                        }}
                    >
                        <span
                            style={{
                                width: 7,
                                height: 7,
                                borderRadius: 'var(--radius-pill)',
                                background: 'var(--accent)',
                            }}
                        />
                        {pick(hero.kicker, locale)}
                    </span>

                    <div
                        style={{
                            fontSize: 'var(--text-xl)',
                            fontWeight: 700,
                            color: 'var(--brand-light)',
                            letterSpacing: '-0.02em',
                            marginBottom: 4,
                        }}
                    >
                        {t.heroLead}
                    </div>

                    <h1
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'var(--text-3xl)',
                            lineHeight: 1.02,
                            fontWeight: 900,
                            color: 'var(--brand)',
                            letterSpacing: '-0.045em',
                            margin: '0 0 var(--space-5)',
                            textWrap: 'balance',
                        }}
                    >
                        {t.heroTitleA} <span style={{ color: 'var(--accent-dark)' }}>{t.heroTitleB}</span>
                    </h1>

                    <p
                        style={{
                            fontSize: 'var(--text-lg)',
                            lineHeight: 1.7,
                            color: 'var(--text-muted)',
                            margin: '0 0 30px',
                            maxWidth: 500,
                            textWrap: 'pretty',
                        }}
                    >
                        {pick(hero.sub, locale)}
                    </p>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 26,
                            flexWrap: 'wrap',
                            pointerEvents: 'auto',
                        }}
                    >
                        <a
                            href={themePath(SLUG, 'rooms')}
                            style={{
                                padding: '16px 34px',
                                borderRadius: 'var(--radius-pill)',
                                background: 'var(--accent)',
                                // Xanh rừng đậm trên nền xanh lá — trắng sẽ không đọc được.
                                color: 'var(--text)',
                                fontSize: 'var(--text-lg)',
                                fontWeight: 800,
                                textDecoration: 'none',
                            }}
                        >
                            {t.bookNow}
                        </a>

                        <a
                            href={`tel:${data.brand.phone.replace(/\s/g, '')}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-3)',
                                textDecoration: 'none',
                            }}
                        >
                            <span
                                style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 'var(--radius-pill)',
                                    background: 'var(--surface)',
                                    boxShadow: 'var(--shadow-sm)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 17,
                                    color: 'var(--brand)',
                                    flexShrink: 0,
                                }}
                                aria-hidden="true"
                            >
                                ☎
                            </span>
                            <span style={{ display: 'grid', gap: 1 }}>
                                <span
                                    style={{
                                        fontSize: 'var(--text-xs)',
                                        fontWeight: 700,
                                        color: 'var(--brand)',
                                    }}
                                >
                                    {t.moreInfo}
                                </span>
                                <span
                                    style={{
                                        fontSize: 'var(--text-base)',
                                        fontWeight: 800,
                                        fontStyle: 'italic',
                                        color: 'var(--accent-dark)',
                                    }}
                                >
                                    {data.brand.phone}
                                </span>
                            </span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Hai thẻ nổi bên phải — điểm đánh giá và giá thấp nhất. */}
            <div
                style={{
                    position: 'absolute',
                    right: 'var(--space-6)',
                    top: 150,
                    zIndex: 25,
                    display: 'grid',
                    gap: 'var(--space-3)',
                    width: 250,
                    maxWidth: 'calc(100% - var(--space-12))',
                }}
            >
                <div
                    style={{
                        background: 'var(--surface)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '16px 18px',
                        boxShadow: 'var(--shadow)',
                    }}
                >
                    <div
                        style={{
                            fontSize: 'var(--text-xs)',
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: 'var(--accent-dark)',
                            marginBottom: 6,
                        }}
                    >
                        {t.ratingLabel}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
                        <span
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 28,
                                fontWeight: 900,
                                color: 'var(--brand)',
                                letterSpacing: '-0.03em',
                            }}
                        >
                            4.8
                        </span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                            / 5 · {t.reviews}
                        </span>
                    </div>
                </div>

                <div
                    style={{
                        background: 'var(--brand)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '16px 18px',
                        boxShadow: 'var(--shadow)',
                    }}
                >
                    <div
                        style={{
                            fontSize: 'var(--text-xs)',
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: 'var(--accent)',
                            marginBottom: 6,
                        }}
                    >
                        {t.fromPrice}
                    </div>
                    <div
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 22,
                            fontWeight: 900,
                            color: 'var(--text-inverse)',
                            letterSpacing: '-0.03em',
                        }}
                    >
                        {formatPrice(lowest, locale)}
                    </div>
                    <div
                        style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-inverse)',
                            opacity: 0.66,
                        }}
                    >
                        {t.perNight}
                    </div>
                </div>
            </div>

            {/* Dải ảnh nhỏ góc dưới trái. */}
            <div
                style={{
                    position: 'absolute',
                    left: 'var(--space-6)',
                    bottom: 176,
                    zIndex: 25,
                    display: 'flex',
                    gap: 'var(--space-2)',
                }}
            >
                {THUMBS.map((thumb, index) => (
                    <div
                        key={thumb.en}
                        style={{
                            width: 86,
                            height: 64,
                            borderRadius: 'var(--radius-sm)',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow)',
                        }}
                    >
                        <ImageSlot
                            placeholder={thumb[locale]}
                            src={thumbSources[index + 2]}
                            height="100%"
                            style={{ borderRadius: 'var(--radius-sm)' }}
                        />
                    </div>
                ))}
            </div>

            {/* Thanh tra cứu — vỏ tĩnh, nối vào luồng đặt phòng ở bước sau. */}
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 34,
                    zIndex: 26,
                    padding: '0 var(--space-6)',
                }}
            >
                <form
                    style={{
                        maxWidth: 1228,
                        margin: '0 auto',
                        background: 'var(--surface)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-lg)',
                        padding: '18px 20px',
                        display: 'grid',
                        /**
                         * Bốn ô bằng nhau, luôn nằm ngang. `auto-fit` gộp
                         * chúng lại khi hẹp và làm hỏng thanh tra cứu.
                         */
                        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                        gap: 'var(--space-3)',
                        alignItems: 'end',
                    }}
                >
                    <div style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                        <label htmlFor="h4-in" style={LABEL}>
                            {t.checkIn}
                        </label>
                        <input id="h4-in" type="date" style={FIELD} />
                    </div>
                    <div style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                        <label htmlFor="h4-out" style={LABEL}>
                            {t.checkOut}
                        </label>
                        <input id="h4-out" type="date" style={FIELD} />
                    </div>
                    <div style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                        <label htmlFor="h4-guests" style={LABEL}>
                            {t.guests}
                        </label>
                        <select id="h4-guests" style={FIELD} defaultValue="2 · 1">
                            <option>2 · 1</option>
                            <option>4 · 2</option>
                            <option>6 · 2</option>
                            <option>8 · 3</option>
                        </select>
                    </div>
                    <div style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                        <label htmlFor="h4-type" style={LABEL}>
                            {t.stayType}
                        </label>
                        <select id="h4-type" style={FIELD} defaultValue={t.stayRoom}>
                            <option>{t.stayRoom}</option>
                            <option>{t.stayCombo2}</option>
                            <option>{t.stayCombo3}</option>
                        </select>
                    </div>
                    <a
                        href={themePath(SLUG, 'rooms')}
                        style={{
                            padding: '13px 32px',
                            borderRadius: 'var(--radius-pill)',
                            background: 'var(--brand)',
                            color: 'var(--text-inverse)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 800,
                            whiteSpace: 'nowrap',
                            textAlign: 'center',
                            textDecoration: 'none',
                        }}
                    >
                        {t.search}
                    </a>
                </form>
            </div>
        </section>
    )
}
