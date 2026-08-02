'use client'

/**
 * Khuyến mãi — màn hình tự giải thích.
 *
 * Khách yêu cầu rõ: phải GIẢI THÍCH cách tính ngay tại đây. Màn hình có đủ 5
 * phần theo `.claude/rules/booking-domain.md` §B4:
 *   1. bảng danh sách
 *   2. form có dòng giải thích dưới từng trường
 *   3. khối "Xem trước cách tính" — chạy đúng engine thật
 *   4. cảnh báo xung đột, nói rõ ai thắng và vì sao
 *   5. bảng thứ tự áp dụng trực quan
 */

import { useMemo, useState } from 'react'
import {
    addDays,
    buildQuote,
    childPolicy,
    findPromotionConflicts,
    formatPrice,
    getPropertySync,
    pick,
    ratePlans,
    seasons,
    t,
} from '@repo/core'
import type { Promotion, PromotionType } from '@repo/core'
import {
    Badge,
    Button,
    CheckField,
    DataTable,
    Field,
    Modal,
    SelectField,
    TextAreaField,
} from '@repo/ui'
import type { Column } from '@repo/ui'
import { useLocale } from '@/components/LocaleProvider'
import { useBookingStore } from '@/stores/booking.store'
import { usePromotionStore } from '@/stores/promotion.store'
import { todayKey } from '@/stores/demo-data'
import { PriceBreakdown } from '@/components/PriceBreakdown'
import {
    PROMO_TYPE_HINT,
    PROMO_TYPE_LABEL,
    REJECT_REASON_LABEL,
    S,
    tr,
} from '@/strings'
import { PencilIcon } from '@/components/icons'

const TYPES: PromotionType[] = [
    'percent',
    'fixed',
    'nth-night-free',
    'long-stay',
    'early-bird',
    'last-minute',
    'free-addon',
]

export default function PromotionsPage() {
    const { locale } = useLocale()
    const promotions = usePromotionStore((s) => s.items)
    const toggle = usePromotionStore((s) => s.toggle)
    const upsert = usePromotionStore((s) => s.upsert)

    const [editing, setEditing] = useState<Promotion | null>(null)
    const conflicts = useMemo(() => findPromotionConflicts(promotions), [promotions])

    const columns: Column<Promotion>[] = [
        {
            key: 'name',
            header: tr(S.promoName, locale),
            cell: (p) => (
                <div>
                    <div style={{ fontWeight: 600 }}>{pick(p.name, locale)}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                        {p.code ? (
                            <code
                                style={{
                                    padding: '1px 6px',
                                    background: 'var(--surface-tint)',
                                    borderRadius: 3,
                                }}
                            >
                                {p.code}
                            </code>
                        ) : locale === 'vi' ? (
                            'Tự động áp'
                        ) : (
                            'Applied automatically'
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: 'type',
            header: tr(S.promoType, locale),
            cell: (p) => (
                <div>
                    <div>{tr(PROMO_TYPE_LABEL[p.type], locale)}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                        {describeValue(p, locale)}
                    </div>
                </div>
            ),
        },
        {
            key: 'window',
            header: tr(S.stayWindow, locale),
            cell: (p) =>
                p.conditions.stayFrom || p.conditions.stayTo ? (
                    <span style={{ whiteSpace: 'nowrap', fontSize: 'var(--text-xs)' }}>
                        {p.conditions.stayFrom ?? '…'} → {p.conditions.stayTo ?? '…'}
                    </span>
                ) : (
                    <span style={{ color: 'var(--text-muted)' }}>
                        {locale === 'vi' ? 'Mọi ngày' : 'Any date'}
                    </span>
                ),
        },
        {
            key: 'stacking',
            header: tr(S.stackable, locale),
            cell: (p) => (
                <div style={{ display: 'grid', gap: 4 }}>
                    <Badge tone={p.stackable ? 'success' : 'warning'}>
                        {p.stackable
                            ? locale === 'vi'
                                ? 'Cộng dồn'
                                : 'Stacks'
                            : locale === 'vi'
                              ? 'Độc quyền'
                              : 'Exclusive'}
                    </Badge>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                        {tr(S.priority, locale)} {p.priority}
                    </span>
                </div>
            ),
        },
        {
            key: 'usage',
            header: locale === 'vi' ? 'Đã dùng' : 'Used',
            align: 'right',
            cell: (p) => (
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {p.usageCount}
                    {p.usageLimit !== undefined ? ` / ${p.usageLimit}` : ''}
                </span>
            ),
        },
        {
            key: 'active',
            header: locale === 'vi' ? 'Trạng thái' : 'Status',
            cell: (p) => (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation()
                        toggle(p.id)
                    }}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                    aria-label={`${pick(p.name, locale)}: ${p.active ? 'bật' : 'tắt'}`}
                >
                    <Badge tone={p.active ? 'success' : 'neutral'}>
                        {p.active
                            ? locale === 'vi'
                                ? 'Đang chạy'
                                : 'Active'
                            : locale === 'vi'
                              ? 'Đã tắt'
                              : 'Off'}
                    </Badge>
                </button>
            ),
        },
        {
            key: 'actions',
            header: '',
            align: 'right',
            inCard: false,
            cell: (p) => (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation()
                        setEditing(p)
                    }}
                    aria-label={`${tr(S.edit, locale)} ${pick(p.name, locale)}`}
                    style={{
                        width: 28,
                        height: 28,
                        display: 'grid',
                        placeItems: 'center',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                    }}
                >
                    <PencilIcon size={16} />
                </button>
            ),
        },
    ]

    return (
        <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
            <header
                style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    gap: 'var(--space-4)',
                    flexWrap: 'wrap',
                }}
            >
                <div>
                    <h1 style={{ margin: 0, fontSize: 'var(--text-2xl)', fontFamily: 'var(--font-display)' }}>
                        {tr(S.promotions, locale)}
                    </h1>
                    <p style={{ margin: 'var(--space-2) 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                        {promotions.filter((p) => p.active).length}{' '}
                        {locale === 'vi' ? 'đang chạy' : 'active'} / {promotions.length}
                    </p>
                </div>
                <Button onClick={() => setEditing(blankPromotion())}>
                    + {tr(S.newPromotion, locale)}
                </Button>
            </header>

            <HowItWorks />

            {conflicts.length > 0 && (
                <ConflictWarnings conflicts={conflicts} promotions={promotions} />
            )}

            <ApplyOrder promotions={promotions.filter((p) => p.active)} />

            <div
                style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                }}
            >
                <DataTable
                    caption={tr(S.promotions, locale)}
                    columns={columns}
                    rows={promotions}
                    rowKey={(p) => p.id}
                    empty={tr(S.noPromotions, locale)}
                />
            </div>

            <PreviewCalculator />

            {editing && (
                <PromotionForm
                    promotion={editing}
                    onClose={() => setEditing(null)}
                    onSave={(next) => {
                        upsert(next)
                        setEditing(null)
                    }}
                />
            )}
        </div>
    )
}

// ================================================== khối giải thích thuật toán

function HowItWorks() {
    const { locale } = useLocale()
    const [open, setOpen] = useState(false)

    const steps =
        locale === 'vi'
            ? [
                  'Lọc: giữ lại các khuyến mãi đang bật, thoả MỌI điều kiện, chưa hết lượt.',
                  'Sắp xếp theo thứ tự áp dụng — số nhỏ áp trước.',
                  'Nếu có khuyến mãi độc quyền: chọn DUY NHẤT cái có số thứ tự nhỏ nhất, bỏ hết phần còn lại.',
                  'Áp lần lượt. Mỗi khuyến mãi tính trên SỐ TIỀN CÒN LẠI sau các lần áp trước.',
                  'Cắt phần giảm xuống trần nếu có đặt trần.',
                  'Tổng giảm không bao giờ vượt quá số tiền đơn hàng.',
              ]
            : [
                  'Filter: keep active promotions that satisfy ALL conditions and have quota left.',
                  'Sort by priority — lower number applies first.',
                  'If any exclusive promotion qualifies: keep ONLY the one with the lowest priority, drop the rest.',
                  'Apply in order. Each promotion is computed on the REMAINING amount after previous ones.',
                  'Cap the discount if a maximum is set.',
                  'Total discount never exceeds the order value.',
              ]

    return (
        <section
            style={{
                background: 'var(--info-bg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-5)',
            }}
        >
            <button
                type="button"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-base)',
                    fontWeight: 600,
                    color: 'var(--info)',
                    textAlign: 'left',
                }}
            >
                {open ? '▾' : '▸'}{' '}
                {locale === 'vi'
                    ? 'Hệ thống tính khuyến mãi thế nào?'
                    : 'How are promotions calculated?'}
            </button>

            {open && (
                <div style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text)' }}>
                    <ol style={{ margin: '0 0 var(--space-5)', paddingLeft: 'var(--space-6)', lineHeight: 1.7 }}>
                        {steps.map((step, i) => (
                            <li key={i}>{step}</li>
                        ))}
                    </ol>

                    <div
                        style={{
                            padding: 'var(--space-4)',
                            background: 'var(--surface)',
                            borderRadius: 'var(--radius)',
                            fontSize: 'var(--text-sm)',
                        }}
                    >
                        <strong>
                            {locale === 'vi'
                                ? 'Vì sao cộng dồn theo cách nhân, không cộng phần trăm?'
                                : 'Why compound multiplicatively instead of adding percentages?'}
                        </strong>
                        <div style={{ marginTop: 'var(--space-3)', lineHeight: 1.7 }}>
                            {locale === 'vi'
                                ? 'Đơn 1.000.000đ, hai khuyến mãi 10% và 20%:'
                                : 'A 1,000,000₫ order with two promotions, 10% and 20%:'}
                            <div style={{ marginTop: 'var(--space-2)', fontVariantNumeric: 'tabular-nums' }}>
                                <div style={{ color: 'var(--danger)' }}>
                                    ✗ 1.000.000 × 30% ={' '}
                                    {locale === 'vi' ? 'giảm 300.000' : '300,000 off'}
                                </div>
                                <div style={{ color: 'var(--success)' }}>
                                    ✓ 1.000.000 × 0,9 = 900.000 → × 0,8 = 720.000 ={' '}
                                    {locale === 'vi' ? 'giảm 280.000' : '280,000 off'}
                                </div>
                            </div>
                            <p style={{ margin: 'var(--space-3) 0 0', color: 'var(--text-muted)' }}>
                                {locale === 'vi'
                                    ? 'Cách ✓ khớp cách khách hiểu ("giảm thêm 20% trên giá đã giảm") và không bao giờ ra mức giảm quá 100%.'
                                    : 'The ✓ method matches how guests read it ("another 20% off the discounted price") and can never exceed 100%.'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

// ==================================================== cảnh báo xung đột

function ConflictWarnings({
    conflicts,
    promotions,
}: {
    conflicts: ReturnType<typeof findPromotionConflicts>
    promotions: Promotion[]
}) {
    const { locale } = useLocale()
    const nameOf = (id: string) => {
        const promo = promotions.find((p) => p.id === id)
        return promo ? pick(promo.name, locale) : id
    }

    return (
        <section
            style={{
                background: 'var(--warning-bg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-5)',
            }}
        >
            <h2
                style={{
                    margin: '0 0 var(--space-3)',
                    fontSize: 'var(--text-base)',
                    color: 'var(--warning)',
                }}
            >
                {tr(S.conflictWarning, locale)} ({conflicts.length})
            </h2>
            <ul style={{ margin: 0, paddingLeft: 'var(--space-6)', display: 'grid', gap: 'var(--space-3)' }}>
                {conflicts.map((conflict, i) => (
                    <li key={i} style={{ fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                        <strong>
                            {nameOf(conflict.a)} ↔ {nameOf(conflict.b)}
                        </strong>
                        <div style={{ color: 'var(--text-muted)' }}>
                            {conflict.kind === 'both-exclusive'
                                ? tr(S.conflictBothExclusive, locale)
                                : tr(S.conflictSamePriority, locale)}
                            {conflict.winnerId && (
                                <>
                                    {' '}
                                    <strong style={{ color: 'var(--text)' }}>
                                        {tr(S.winnerIs, locale)}: {nameOf(conflict.winnerId)}
                                    </strong>{' '}
                                    (
                                    {locale === 'vi'
                                        ? 'thứ tự áp dụng nhỏ hơn'
                                        : 'lower priority number'}
                                    )
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    )
}

// ================================================== bảng thứ tự áp dụng

function ApplyOrder({ promotions }: { promotions: Promotion[] }) {
    const { locale } = useLocale()
    const ordered = [...promotions].sort((a, b) => a.priority - b.priority)

    if (ordered.length === 0) return null

    return (
        <section
            style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-5)',
            }}
        >
            <h2 style={{ margin: '0 0 var(--space-4)', fontSize: 'var(--text-base)', fontFamily: 'var(--font-display)' }}>
                {tr(S.applyOrder, locale)}
            </h2>
            <ol
                style={{
                    display: 'flex',
                    gap: 'var(--space-2)',
                    flexWrap: 'wrap',
                    margin: 0,
                    padding: 0,
                    listStyle: 'none',
                    alignItems: 'center',
                }}
            >
                {ordered.map((promo, index) => (
                    <li key={promo.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        {index > 0 && <span style={{ color: 'var(--text-muted)' }}>→</span>}
                        <span
                            style={{
                                padding: 'var(--space-2) var(--space-3)',
                                background: promo.stackable ? 'var(--surface-tint)' : 'var(--warning-bg)',
                                border: `1px solid ${promo.stackable ? 'var(--border)' : 'var(--warning)'}`,
                                borderRadius: 'var(--radius)',
                                fontSize: 'var(--text-xs)',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <strong>{promo.priority}</strong> · {pick(promo.name, locale)}
                            {!promo.stackable && (
                                <span style={{ color: 'var(--warning)' }}>
                                    {' '}
                                    ({locale === 'vi' ? 'độc quyền' : 'exclusive'})
                                </span>
                            )}
                        </span>
                    </li>
                ))}
            </ol>
        </section>
    )
}

// ================================================== khối xem trước cách tính

function PreviewCalculator() {
    const { locale } = useLocale()
    const property = getPropertySync()
    const inventory = useBookingStore((s) => s.inventory)
    const promotions = usePromotionStore((s) => s.items)

    const today = todayKey()
    const [roomTypeId, setRoomTypeId] = useState(property.rooms[0]?.id ?? '')
    const [checkIn, setCheckIn] = useState(addDays(today, 40))
    const [nights, setNights] = useState(3)
    const [adults, setAdults] = useState(2)
    const [code, setCode] = useState('')

    const quote = useMemo(() => {
        const room = property.rooms.find((r) => r.id === roomTypeId)
        if (!room) return null
        return buildQuote({
            room,
            roomExtra: property.roomExtras[room.id],
            checkIn,
            checkOut: addDays(checkIn, nights),
            guests: { adults, children: [] },
            seasons,
            inventory,
            ratePlan: ratePlans[0],
            addons: {},
            addonCatalog: property.addons,
            childPolicy,
            promotions: promotions.filter((p) => p.active),
            channel: 'web',
            today,
            enteredCode: code || undefined,
        })
    }, [roomTypeId, checkIn, nights, adults, code, inventory, promotions, property, today])

    // Các khuyến mãi bị loại và lý do — đây là thứ khiến admin hiểu vì sao một
    // chương trình không xuất hiện, thay vì phải tự đoán.
    const rejected = quote?.promotion.evaluations.filter((e) => !e.eligible) ?? []

    return (
        <section
            style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-5)',
            }}
        >
            <h2 style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-base)', fontFamily: 'var(--font-display)' }}>
                {tr(S.previewTitle, locale)}
            </h2>
            <p style={{ margin: '0 0 var(--space-5)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                {tr(S.previewHint, locale)}
            </p>

            <div className="preview-grid" style={{ display: 'grid', gap: 'var(--space-5)' }}>
                <div style={{ display: 'grid', gap: 'var(--space-4)', alignContent: 'start' }}>
                    <SelectField
                        label={locale === 'vi' ? 'Hạng phòng' : 'Room type'}
                        value={roomTypeId}
                        onChange={(e) => setRoomTypeId(e.target.value)}
                    >
                        {property.rooms.map((room) => (
                            <option key={room.id} value={room.id}>
                                {pick(room.name, locale)}
                            </option>
                        ))}
                    </SelectField>

                    <Field
                        label={tr(S.checkIn, locale)}
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                    />

                    <div style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: '1fr 1fr' }}>
                        <Field
                            label={locale === 'vi' ? 'Số đêm' : 'Nights'}
                            type="number"
                            min={1}
                            max={14}
                            value={nights}
                            onChange={(e) => setNights(Math.max(1, Number(e.target.value) || 1))}
                        />
                        <Field
                            label={tr(S.adults, locale)}
                            type="number"
                            min={1}
                            value={adults}
                            onChange={(e) => setAdults(Math.max(1, Number(e.target.value) || 1))}
                        />
                    </div>

                    <Field
                        label={tr(S.promoCode, locale)}
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        hint={locale === 'vi' ? 'Thử NAMDU10 hoặc WELCOME' : 'Try NAMDU10 or WELCOME'}
                    />
                </div>

                <div
                    style={{
                        padding: 'var(--space-5)',
                        background: 'var(--surface-alt)',
                        borderRadius: 'var(--radius)',
                    }}
                >
                    {quote ? (
                        <>
                            <PriceBreakdown quote={quote} locale={locale} explainPromotions />

                            {rejected.length > 0 && (
                                <div
                                    style={{
                                        marginTop: 'var(--space-5)',
                                        paddingTop: 'var(--space-4)',
                                        borderTop: '1px solid var(--border)',
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 'var(--text-xs)',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.04em',
                                            color: 'var(--text-muted)',
                                            marginBottom: 'var(--space-3)',
                                        }}
                                    >
                                        {locale === 'vi'
                                            ? 'Khuyến mãi không áp được'
                                            : 'Promotions not applied'}
                                    </div>
                                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 'var(--space-2)' }}>
                                        {rejected.map((item) => (
                                            <li
                                                key={item.promotion.id}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    gap: 'var(--space-3)',
                                                    fontSize: 'var(--text-xs)',
                                                    color: 'var(--text-muted)',
                                                }}
                                            >
                                                <span>{pick(item.promotion.name, locale)}</span>
                                                <span style={{ textAlign: 'right' }}>
                                                    {item.reason
                                                        ? tr(REJECT_REASON_LABEL[item.reason], locale)
                                                        : ''}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    ) : (
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                            {locale === 'vi' ? 'Chọn hạng phòng để xem.' : 'Pick a room type to preview.'}
                        </p>
                    )}
                </div>
            </div>

            <style>{`
                @media (min-width: 860px) {
                    .preview-grid { grid-template-columns: 300px minmax(0, 1fr); }
                }
            `}</style>
        </section>
    )
}

// ==================================================================== form

function blankPromotion(): Promotion {
    return {
        id: `promo-${Date.now()}`,
        name: t('', ''),
        description: t('', ''),
        type: 'percent',
        value: 10,
        conditions: {},
        stackable: true,
        priority: 50,
        usageCount: 0,
        active: false,
    }
}

function PromotionForm({
    promotion,
    onClose,
    onSave,
}: {
    promotion: Promotion
    onClose: () => void
    onSave: (promotion: Promotion) => void
}) {
    const { locale } = useLocale()
    const property = getPropertySync()
    const [draft, setDraft] = useState<Promotion>(promotion)

    const patch = (changes: Partial<Promotion>) => setDraft({ ...draft, ...changes })
    const patchConditions = (changes: Partial<Promotion['conditions']>) =>
        setDraft({ ...draft, conditions: { ...draft.conditions, ...changes } })

    const ready = draft.name.vi.trim() && draft.name.en.trim()

    return (
        <Modal
            open
            onClose={onClose}
            title={promotion.name.vi ? tr(S.edit, locale) : tr(S.newPromotion, locale)}
            width={640}
            footer={
                <>
                    <Button variant="ghost" onClick={onClose}>
                        {tr(S.cancel, locale)}
                    </Button>
                    <Button disabled={!ready} onClick={() => onSave(draft)}>
                        {tr(S.save, locale)}
                    </Button>
                </>
            }
        >
            <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
                {/* --- tên song ngữ: bắt buộc theo luật R6 --- */}
                <FormGroup title={locale === 'vi' ? 'Nội dung' : 'Content'}>
                    <Field
                        label={`${tr(S.promoName, locale)} (VI)`}
                        value={draft.name.vi}
                        onChange={(e) => patch({ name: { ...draft.name, vi: e.target.value } })}
                        required
                    />
                    <Field
                        label={`${tr(S.promoName, locale)} (EN)`}
                        value={draft.name.en}
                        onChange={(e) => patch({ name: { ...draft.name, en: e.target.value } })}
                        hint={
                            locale === 'vi'
                                ? 'Bắt buộc — mọi chuỗi khách nhìn thấy phải có cả hai ngôn ngữ.'
                                : 'Required — every guest-facing string needs both languages.'
                        }
                        required
                    />
                    <TextAreaField
                        label={`${tr(S.promoDescription, locale)} (VI)`}
                        value={draft.description.vi}
                        onChange={(e) =>
                            patch({ description: { ...draft.description, vi: e.target.value } })
                        }
                    />
                    <TextAreaField
                        label={`${tr(S.promoDescription, locale)} (EN)`}
                        value={draft.description.en}
                        onChange={(e) =>
                            patch({ description: { ...draft.description, en: e.target.value } })
                        }
                    />
                </FormGroup>

                {/* --- kiểu và giá trị --- */}
                <FormGroup title={locale === 'vi' ? 'Cách giảm' : 'Discount mechanics'}>
                    <SelectField
                        label={tr(S.promoType, locale)}
                        value={draft.type}
                        onChange={(e) => patch({ type: e.target.value as PromotionType })}
                        hint={tr(PROMO_TYPE_HINT[draft.type], locale)}
                    >
                        {TYPES.map((type) => (
                            <option key={type} value={type}>
                                {tr(PROMO_TYPE_LABEL[type], locale)}
                            </option>
                        ))}
                    </SelectField>

                    {draft.type !== 'long-stay' && (
                        <Field
                            label={tr(S.promoValue, locale)}
                            type="number"
                            min={0}
                            value={draft.value}
                            onChange={(e) => patch({ value: Number(e.target.value) || 0 })}
                            hint={valueHint(draft.type, locale)}
                        />
                    )}

                    <Field
                        label={tr(S.promoCodeField, locale)}
                        value={draft.code ?? ''}
                        onChange={(e) => patch({ code: e.target.value.toUpperCase() || undefined })}
                        hint={tr(S.promoCodeHint, locale)}
                        placeholder={locale === 'vi' ? 'Để trống = tự động' : 'Blank = automatic'}
                    />

                    <Field
                        label={tr(S.maxDiscount, locale)}
                        type="number"
                        min={0}
                        step={50000}
                        value={draft.maxDiscount ?? ''}
                        onChange={(e) =>
                            patch({ maxDiscount: e.target.value ? Number(e.target.value) : undefined })
                        }
                        hint={tr(S.maxDiscountHint, locale)}
                    />
                </FormGroup>

                {/* --- quy tắc kết hợp: phần dễ sai nhất --- */}
                <FormGroup title={locale === 'vi' ? 'Quy tắc kết hợp' : 'Stacking rules'}>
                    <CheckField
                        label={tr(S.stackable, locale)}
                        checked={draft.stackable}
                        onChange={(e) => patch({ stackable: e.target.checked })}
                        hint={tr(S.stackableHint, locale)}
                    />
                    <Field
                        label={tr(S.priority, locale)}
                        type="number"
                        min={0}
                        value={draft.priority}
                        onChange={(e) => patch({ priority: Number(e.target.value) || 0 })}
                        hint={tr(S.priorityHint, locale)}
                    />
                </FormGroup>

                {/* --- điều kiện --- */}
                <FormGroup title={tr(S.conditionsTitle, locale)}>
                    <div style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: '1fr 1fr' }}>
                        <Field
                            label={`${tr(S.stayWindow, locale)} — ${tr(S.from, locale)}`}
                            type="date"
                            value={draft.conditions.stayFrom ?? ''}
                            onChange={(e) => patchConditions({ stayFrom: e.target.value || undefined })}
                        />
                        <Field
                            label={`${tr(S.stayWindow, locale)} — ${locale === 'vi' ? 'đến' : 'to'}`}
                            type="date"
                            value={draft.conditions.stayTo ?? ''}
                            onChange={(e) => patchConditions({ stayTo: e.target.value || undefined })}
                        />
                    </div>

                    <div style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: '1fr 1fr' }}>
                        <Field
                            label={tr(S.minNights, locale)}
                            type="number"
                            min={1}
                            value={draft.conditions.minNights ?? ''}
                            onChange={(e) =>
                                patchConditions({
                                    minNights: e.target.value ? Number(e.target.value) : undefined,
                                })
                            }
                        />
                        <Field
                            label={tr(S.minAmountLabel, locale)}
                            type="number"
                            min={0}
                            step={100000}
                            value={draft.conditions.minAmount ?? ''}
                            onChange={(e) =>
                                patchConditions({
                                    minAmount: e.target.value ? Number(e.target.value) : undefined,
                                })
                            }
                        />
                    </div>

                    {(draft.type === 'early-bird' || draft.type === 'last-minute') && (
                        <Field
                            label={tr(S.daysBeforeLabel, locale)}
                            type="number"
                            min={0}
                            value={draft.conditions.daysBeforeCheckIn ?? ''}
                            onChange={(e) =>
                                patchConditions({
                                    daysBeforeCheckIn: e.target.value
                                        ? Number(e.target.value)
                                        : undefined,
                                })
                            }
                            hint={
                                draft.type === 'early-bird'
                                    ? locale === 'vi'
                                        ? 'Khách phải đặt SỚM HƠN số ngày này.'
                                        : 'Guest must book EARLIER than this many days.'
                                    : locale === 'vi'
                                      ? 'Khách phải đặt TRONG VÒNG số ngày này.'
                                      : 'Guest must book WITHIN this many days.'
                            }
                        />
                    )}

                    <div>
                        <div
                            style={{
                                fontSize: 'var(--text-sm)',
                                fontWeight: 600,
                                marginBottom: 'var(--space-2)',
                            }}
                        >
                            {tr(S.appliesToRooms, locale)}
                        </div>
                        <p
                            style={{
                                margin: '0 0 var(--space-3)',
                                fontSize: 'var(--text-xs)',
                                color: 'var(--text-muted)',
                            }}
                        >
                            {tr(S.appliesToRoomsHint, locale)}
                        </p>
                        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                            {property.rooms.map((room) => {
                                const list = draft.conditions.roomTypeIds ?? []
                                const checked = list.includes(room.id)
                                return (
                                    <CheckField
                                        key={room.id}
                                        label={pick(room.name, locale)}
                                        checked={checked}
                                        onChange={(e) =>
                                            patchConditions({
                                                roomTypeIds: e.target.checked
                                                    ? [...list, room.id]
                                                    : list.filter((id) => id !== room.id),
                                            })
                                        }
                                    />
                                )
                            })}
                        </div>
                    </div>
                </FormGroup>

                {/* --- hạn mức --- */}
                <FormGroup title={locale === 'vi' ? 'Giới hạn' : 'Limits'}>
                    <div style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: '1fr 1fr' }}>
                        <Field
                            label={tr(S.usageLimit, locale)}
                            type="number"
                            min={0}
                            value={draft.usageLimit ?? ''}
                            onChange={(e) =>
                                patch({ usageLimit: e.target.value ? Number(e.target.value) : undefined })
                            }
                        />
                        <Field
                            label={tr(S.perCustomerLimit, locale)}
                            type="number"
                            min={0}
                            value={draft.perCustomerLimit ?? ''}
                            onChange={(e) =>
                                patch({
                                    perCustomerLimit: e.target.value
                                        ? Number(e.target.value)
                                        : undefined,
                                })
                            }
                        />
                    </div>
                    <CheckField
                        label={locale === 'vi' ? 'Bật chương trình' : 'Activate promotion'}
                        checked={draft.active}
                        onChange={(e) => patch({ active: e.target.checked })}
                        hint={
                            locale === 'vi'
                                ? 'Chỉ khuyến mãi đang bật mới được áp vào giá khách thấy.'
                                : 'Only active promotions affect the price guests see.'
                        }
                    />
                </FormGroup>
            </div>
        </Modal>
    )
}

function FormGroup({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <fieldset style={{ border: 0, margin: 0, padding: 0, display: 'grid', gap: 'var(--space-4)' }}>
            <legend
                style={{
                    padding: 0,
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--text-muted)',
                }}
            >
                {title}
            </legend>
            {children}
        </fieldset>
    )
}

// ================================================================ tiện ích

function describeValue(promo: Promotion, locale: 'vi' | 'en'): string {
    switch (promo.type) {
        case 'percent':
        case 'early-bird':
        case 'last-minute':
            return `−${promo.value}%`
        case 'fixed':
        case 'free-addon':
            return `−${formatPrice(promo.value, locale)}`
        case 'nth-night-free':
            return locale === 'vi' ? `Đêm thứ ${promo.value}` : `Night ${promo.value}`
        case 'long-stay':
            return (promo.conditions.tiers ?? [])
                .map((tier) => `≥${tier.minNights}đ: −${tier.percent}%`)
                .join(' · ')
    }
}

function valueHint(type: PromotionType, locale: 'vi' | 'en'): string {
    switch (type) {
        case 'percent':
        case 'early-bird':
        case 'last-minute':
            return locale === 'vi' ? 'Nhập số phần trăm, ví dụ 15' : 'Enter a percentage, e.g. 15'
        case 'fixed':
        case 'free-addon':
            return locale === 'vi' ? 'Nhập số tiền VNĐ' : 'Enter an amount in VND'
        case 'nth-night-free':
            return locale === 'vi' ? 'Nhập N — đêm thứ N được tặng' : 'Enter N — the Nth night is free'
        default:
            return ''
    }
}
