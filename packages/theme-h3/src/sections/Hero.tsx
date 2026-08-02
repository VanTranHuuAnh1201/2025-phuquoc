import { pick, themePath, type Locale, type PropertyData } from '@repo/core'
import { ImageSlot } from '@repo/ui'

import { meta } from '../meta'
import { ui } from '../strings'

const SLUG = meta.slug

/**
 * Hero mẫu 03 — KHÁC HẲN mẫu 01.
 *
 * Nền không phải một ảnh tràn màn hình mà là bốn cột ảnh song song, hai cột
 * chẵn bị đẩy xuống 46px tạo nhịp so le. Trên đó là scrim teal, nội dung căn
 * GIỮA (mẫu 01 căn trái), và thanh tra cứu là một tấm trắng bo góc trên rất
 * lớn ăn thẳng vào mép dưới hero — không phải viên thuốc nổi như mẫu 01.
 */

const TILES = [
    { vi: 'Ảnh hero 1 — bãi biển', en: 'Hero 1 — beach', offset: false },
    { vi: 'Ảnh hero 2 — phòng nghỉ', en: 'Hero 2 — guest room', offset: true },
    { vi: 'Ảnh hero 3 — hồ bơi', en: 'Hero 3 — pool', offset: false },
    { vi: 'Ảnh hero 4 — hải sản', en: 'Hero 4 — seafood', offset: true },
] as const

const LABEL: React.CSSProperties = {
    fontSize: '12.5px',
    fontWeight: 700,
    color: 'var(--brand)',
}

const FIELD: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--text)',
    background: 'var(--surface)',
    fontFamily: 'var(--font-body)',
    outline: 'none',
}

export function Hero({ data, locale }: { data: PropertyData; locale: Locale }) {
    const { hero } = data
    const t = ui[locale]

    // Ảnh sẵn có lấy từ core; thiếu thì ImageSlot giữ chỗ (luật R8, R9).
    const images = data.rooms.flatMap((room) => room.images ?? [])

    return (
        <section
            id="top"
            style={{
                position: 'relative',
                minHeight: 'min(100vh, 880px)',
                background: 'var(--surface-inverse)',
                overflow: 'hidden',
            }}
        >
            {/* Dải bốn cột ảnh so le — chữ ký hình ảnh của mẫu 03. */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(50%, 220px), 1fr))',
                    gap: 6,
                }}
            >
                {TILES.map((tile, index) => (
                    <div
                        key={tile.en}
                        style={{
                            position: 'relative',
                            overflow: 'hidden',
                            marginTop: tile.offset ? 46 : 0,
                        }}
                    >
                        <ImageSlot
                            placeholder={tile[locale]}
                            src={images[index]}
                            height="100%"
                            style={{
                                borderRadius: 0,
                                background: 'var(--surface-inverse)',
                            }}
                        />
                    </div>
                ))}
            </div>

            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                        // Scrim ba chặng: đậm ở đầu, nhạt giữa, đậm nhất ở chân
                        // để chữ trắng và tấm tra cứu luôn tách khỏi ảnh nền.
                        // Sắc thái dẫn xuất từ token bằng color-mix, không
                        // hard-code mã màu (luật R3).
                        'linear-gradient(180deg, var(--overlay-scrim) 0%, color-mix(in srgb, var(--brand) 50%, transparent) 40%, color-mix(in srgb, var(--brand) 86%, transparent) 100%)',
                    pointerEvents: 'none',
                }}
            />

            <div
                style={{
                    position: 'relative',
                    minHeight: 'min(100vh, 880px)',
                    maxWidth: 'var(--container)',
                    margin: '0 auto',
                    padding: '150px var(--space-6) 300px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    pointerEvents: 'none',
                }}
            >
                <span
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        padding: '7px var(--space-4)',
                        borderRadius: 'var(--radius-pill)',
                        background: 'var(--accent)',
                        color: 'var(--text)',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        marginBottom: 22,
                    }}
                >
                    {pick(hero.kicker, locale)}
                </span>

                <h1
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'var(--text-3xl)',
                        lineHeight: 1.1,
                        fontWeight: 800,
                        letterSpacing: '-0.03em',
                        color: 'var(--text-inverse)',
                        margin: '0 0 18px',
                        maxWidth: '800px',
                        textWrap: 'balance',
                    }}
                >
                    {pick(hero.title, locale)}
                </h1>

                <p
                    style={{
                        fontSize: 'var(--text-lg)',
                        lineHeight: 1.65,
                        color: 'var(--text-inverse)',
                        opacity: 0.85,
                        margin: 0,
                        maxWidth: '560px',
                        textWrap: 'pretty',
                    }}
                >
                    {pick(hero.sub, locale)}
                </p>
            </div>

            {/* Tấm tra cứu bo góc trên rất lớn, dính đáy hero. Hiện là vỏ tĩnh;
                nối vào luồng đặt phòng khi section #booking có form thật. */}
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 25,
                    padding: '0 var(--space-6)',
                }}
            >
                <form
                    style={{
                        maxWidth: 'var(--container)',
                        margin: '0 auto',
                        background: 'var(--surface)',
                        borderTopLeftRadius: 50,
                        borderTopRightRadius: 50,
                        padding: '34px 44px 40px',
                        display: 'grid',
                        /**
                         * Các ô tra cứu phải luôn bằng nhau và nằm ngang.
                         * `auto-fit` gộp chúng lại khi hẹp và làm hỏng thanh —
                         * dùng số cột cố định, hẹp quá thì thu nhỏ đều.
                         */
                        gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
                        gap: 18,
                        alignItems: 'end',
                    }}
                >
                    <div style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                        <label htmlFor="h3-in" style={LABEL}>
                            {t.checkIn}
                        </label>
                        <input id="h3-in" type="date" style={FIELD} />
                    </div>
                    <div style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                        <label htmlFor="h3-out" style={LABEL}>
                            {t.checkOut}
                        </label>
                        <input id="h3-out" type="date" style={FIELD} />
                    </div>
                    <div style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                        <label htmlFor="h3-guests" style={LABEL}>
                            {t.guests}
                        </label>
                        <select id="h3-guests" style={FIELD} defaultValue="2 · 1">
                            <option>2 · 1</option>
                            <option>4 · 2</option>
                            <option>6 · 2</option>
                            <option>8 · 3</option>
                        </select>
                    </div>
                    <div style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                        <label htmlFor="h3-type" style={LABEL}>
                            {t.stayType}
                        </label>
                        <select id="h3-type" style={FIELD} defaultValue={t.stayRoom}>
                            <option>{t.stayRoom}</option>
                            <option>{t.stayCombo2}</option>
                            <option>{t.stayCombo3}</option>
                        </select>
                    </div>
                    <a
                        href={themePath(SLUG, 'rooms')}
                        style={{
                            padding: '13px var(--space-8)',
                            borderRadius: 'var(--radius)',
                            background: 'var(--brand)',
                            color: 'var(--text-inverse)',
                            fontSize: '14.5px',
                            fontWeight: 700,
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
