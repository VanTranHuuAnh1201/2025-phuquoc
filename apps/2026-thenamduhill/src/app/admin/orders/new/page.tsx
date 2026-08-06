'use client'

/**
 * Tạo đơn thủ công — lễ tân nhập hộ khách gọi điện hoặc tới thẳng quầy.
 *
 * Trang riêng chứ không phải Modal: form hơn 10 trường và lễ tân cần deep-link
 * để mở tab mới trong lúc đang nghe điện thoại (ticket 100-02 §6.4).
 *
 * Giá đi qua `useQuoteOf()` — CÙNG engine với luồng khách tự đặt trên web, chỉ
 * khác chỗ nạp tham số. Nhờ vậy hai con số khớp từng đồng do dùng chung hàm,
 * không phải do trùng hợp (luật R8).
 *
 * Cố ý KHÔNG đọc `cart.store`: lễ tân nhập đơn hộ mà giẫm lên giỏ hàng của
 * khách đang mở tab bên cạnh là mất đơn của khách.
 */

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { addDays, can, formatPrice, getPropertySync, pick, ratePlans } from '@repo/core'
import type { Channel, GuestCount } from '@repo/core'
import { Badge, Button, CheckField, Field, SelectField, TextAreaField } from '@repo/ui'
import { useLocale } from '@/components/LocaleProvider'
import { useAuthStore } from '@/stores/auth.store'
import { useBookingStore } from '@/stores/booking.store'
import { useQuoteOf } from '@/stores/useQuote'
import { todayKey } from '@/stores/demo-data'
import { BLOCK_REASON_LABEL, CHANNEL_LABEL, S, tr } from '@/strings'

/** Kênh lễ tân được chọn. `web` là khách tự đặt, `ota` do đối tác đẩy về. */
const MANUAL_CHANNELS: Channel[] = ['phone', 'walk-in']

export default function NewBookingPage() {
    const { locale } = useLocale()
    const router = useRouter()
    const user = useAuthStore((s) => s.user)
    const createBooking = useBookingStore((s) => s.createBooking)
    const property = getPropertySync()

    const today = todayKey()

    // Trạng thái cục bộ, không store, không persist: đơn nháp của lễ tân không
    // đáng để tồn tại qua reload (§6.4).
    const [checkIn, setCheckIn] = useState(addDays(today, 1))
    const [checkOut, setCheckOut] = useState(addDays(today, 3))
    const [adults, setAdults] = useState(2)
    const [childAges, setChildAges] = useState<number[]>([])
    const [roomTypeId, setRoomTypeId] = useState('')
    const [ratePlanId, setRatePlanId] = useState('standard')
    const [addons, setAddons] = useState<Record<string, number>>({})
    const [promoCode, setPromoCode] = useState('')
    const [channel, setChannel] = useState<Channel>('phone')

    const [fullName, setFullName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [arrivalTime, setArrivalTime] = useState('')
    const [note, setNote] = useState('')

    const [submitting, setSubmitting] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)

    const guests: GuestCount = useMemo(
        () => ({ adults, children: childAges }),
        [adults, childAges],
    )

    const quote = useQuoteOf(
        roomTypeId && checkOut > checkIn
            ? { roomTypeId, checkIn, checkOut, guests, ratePlanId, addons, promoCode, channel }
            : null,
    )

    const availability = quote?.availability
    const blockReason = availability?.blockedReason

    // Lễ tân KHÔNG có `price.edit` → không có ô sửa giá gốc. Tổng tiền chỉ đọc.
    // Ẩn nút không phải bảo mật; chặn thật ở Route Handler (000-03) + RLS.
    const canEditPrice = user ? can(user.role, 'price.edit') : false
    const canCreate = user ? can(user.role, 'booking.create') : false

    if (user && !canCreate) {
        return (
            <p role="alert" style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                {locale === 'vi'
                    ? 'Tài khoản của bạn không có quyền tạo đơn.'
                    : 'Your account cannot create bookings.'}
            </p>
        )
    }

    const validate = (): string | null => {
        if (checkOut <= checkIn) {
            return locale === 'vi'
                ? 'Ngày trả phòng phải sau ngày nhận phòng.'
                : 'Check-out must be after check-in.'
        }
        if (!roomTypeId) {
            return locale === 'vi' ? 'Chọn một hạng phòng.' : 'Pick a room type.'
        }
        if (!fullName.trim()) return tr(S.errNameRequired, locale)
        if (!/^0\d{8,10}$/.test(phone.trim())) return tr(S.errPhoneRequired, locale)
        if (email.trim() && !email.includes('@')) return tr(S.errEmailInvalid, locale)
        if (!quote) return tr(S.selectRoomFirst, locale)
        // AC-16: hết phòng thì chặn hẳn, đọc lý do từ core chứ không tự viết câu.
        if (!availability?.available) {
            return blockReason
                ? tr(BLOCK_REASON_LABEL[blockReason], locale)
                : tr(S.errSoldOut, locale)
        }
        return null
    }

    const submit = () => {
        const problem = validate()
        if (problem) {
            setFormError(problem)
            return
        }
        if (!quote || !user) return

        setSubmitting(true)
        setFormError(null)

        try {
            const booking = createBooking({
                quote,
                roomTypeId,
                ratePlanId,
                checkIn,
                checkOut,
                guests,
                addons,
                guest: {
                    fullName: fullName.trim(),
                    phone: phone.trim(),
                    email: email.trim(),
                    estimatedArrivalTime: arrivalTime || undefined,
                    specialRequests: note.trim() || undefined,
                },
                channel,
                // Nhật ký phải ghi nhân viên đã nhập, không phải khách (§6.4).
                actor: { id: user.id, name: user.fullName, role: user.role },
            })
            router.push(`/admin/orders/${booking.id}`)
        } catch (error) {
            // Không nuốt lỗi (luật C3): hiện bằng chữ và mở khoá lại nút.
            setFormError(
                locale === 'vi'
                    ? `Không tạo được đơn: ${String(error)}`
                    : `Could not create the booking: ${String(error)}`,
            )
            setSubmitting(false)
        }
    }

    return (
        <div style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 960 }}>
            <Link
                href="/admin/orders"
                style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                }}
            >
                ← {tr(S.orders, locale)}
            </Link>

            <header>
                <h1
                    style={{
                        margin: 0,
                        fontSize: 'var(--text-2xl)',
                        fontFamily: 'var(--font-display)',
                    }}
                >
                    {tr(S.newBooking, locale)}
                </h1>
                <p
                    style={{
                        margin: 'var(--space-2) 0 0',
                        maxWidth: '65ch',
                        fontSize: 'var(--text-sm)',
                        lineHeight: 1.6,
                        color: 'var(--text-muted)',
                    }}
                >
                    {tr(S.newBookingSubtitle, locale)}
                </p>
            </header>

            {formError && (
                <div
                    role="alert"
                    aria-live="polite"
                    style={{
                        padding: 'var(--space-4)',
                        background: 'var(--danger-bg)',
                        color: 'var(--danger)',
                        borderRadius: 'var(--radius)',
                        fontSize: 'var(--text-sm)',
                    }}
                >
                    {formError}
                </div>
            )}

            <div className="new-booking-grid" style={{ display: 'grid', gap: 'var(--space-5)' }}>
                <div style={{ display: 'grid', gap: 'var(--space-5)', minWidth: 0 }}>
                    <Panel title={tr(S.stayDetails, locale)}>
                        <div className="nb-two-col" style={{ display: 'grid', gap: 'var(--space-4)' }}>
                            <Field
                                label={tr(S.checkIn, locale)}
                                type="date"
                                value={checkIn}
                                min={today}
                                onChange={(e) => setCheckIn(e.target.value)}
                                required
                            />
                            <Field
                                label={tr(S.checkOut, locale)}
                                type="date"
                                value={checkOut}
                                min={addDays(checkIn, 1)}
                                onChange={(e) => setCheckOut(e.target.value)}
                                required
                            />
                            <Field
                                label={tr(S.adults, locale)}
                                type="number"
                                min={1}
                                max={12}
                                value={adults}
                                onChange={(e) => setAdults(Math.max(1, Number(e.target.value) || 1))}
                                required
                            />
                            <Field
                                label={tr(S.children, locale)}
                                type="number"
                                min={0}
                                max={8}
                                value={childAges.length}
                                hint={
                                    locale === 'vi'
                                        ? 'Nhập tuổi từng trẻ bên dưới — giá trẻ em tính theo tuổi.'
                                        : 'Enter each child’s age below — child pricing depends on age.'
                                }
                                onChange={(e) => {
                                    const count = Math.max(0, Math.min(8, Number(e.target.value) || 0))
                                    setChildAges((prev) =>
                                        Array.from({ length: count }, (_, i) => prev[i] ?? 6),
                                    )
                                }}
                            />
                        </div>

                        {childAges.length > 0 && (
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 'var(--space-3)',
                                    marginTop: 'var(--space-4)',
                                }}
                            >
                                {childAges.map((age, index) => (
                                    <div key={index} style={{ width: 110 }}>
                                        <Field
                                            label={`${tr(S.children, locale)} ${index + 1}`}
                                            type="number"
                                            min={0}
                                            max={17}
                                            value={age}
                                            onChange={(e) => {
                                                const next = [...childAges]
                                                next[index] = Math.max(
                                                    0,
                                                    Math.min(17, Number(e.target.value) || 0),
                                                )
                                                setChildAges(next)
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </Panel>

                    <Panel title={tr(S.roomTypeLabel, locale)}>
                        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                            <SelectField
                                label={tr(S.roomTypeLabel, locale)}
                                value={roomTypeId}
                                onChange={(e) => setRoomTypeId(e.target.value)}
                                required
                            >
                                <option value="">
                                    {locale === 'vi' ? '— Chọn hạng phòng —' : '— Select a room type —'}
                                </option>
                                {property.rooms.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        {pick(room.name, locale)} · {formatPrice(room.price, locale)}
                                        {tr(S.perNight, locale)}
                                    </option>
                                ))}
                            </SelectField>

                            <SelectField
                                label={tr(S.ratePlan, locale)}
                                value={ratePlanId}
                                onChange={(e) => setRatePlanId(e.target.value)}
                                hint={pick(
                                    ratePlans.find((p) => p.id === ratePlanId)?.description ?? {
                                        vi: '',
                                        en: '',
                                    },
                                    locale,
                                )}
                            >
                                {ratePlans
                                    .filter((p) => p.active)
                                    .map((plan) => (
                                        <option key={plan.id} value={plan.id}>
                                            {pick(plan.name, locale)}
                                        </option>
                                    ))}
                            </SelectField>

                            <fieldset
                                style={{
                                    border: 0,
                                    margin: 0,
                                    padding: 0,
                                    display: 'grid',
                                    gap: 'var(--space-3)',
                                }}
                            >
                                <legend
                                    style={{
                                        padding: 0,
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 600,
                                    }}
                                >
                                    {tr(S.addons, locale)}
                                </legend>
                                {property.addons.map((addon) => (
                                    <CheckField
                                        key={addon.id}
                                        label={`${pick(addon.name, locale)} — ${formatPrice(addon.price, locale)} / ${pick(addon.unit, locale)}`}
                                        checked={Boolean(addons[addon.id])}
                                        onChange={(e) =>
                                            setAddons((prev) => {
                                                const next = { ...prev }
                                                if (e.target.checked) next[addon.id] = 1
                                                else delete next[addon.id]
                                                return next
                                            })
                                        }
                                    />
                                ))}
                            </fieldset>

                            <Field
                                label={tr(S.promoCode, locale)}
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                placeholder={tr(S.promoPlaceholder, locale)}
                                hint={canEditPrice ? undefined : tr(S.priceEditNoPermission, locale)}
                            />
                        </div>
                    </Panel>

                    <Panel title={tr(S.guestInfo, locale)}>
                        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                            <Field
                                label={tr(S.fullName, locale)}
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                            <div className="nb-two-col" style={{ display: 'grid', gap: 'var(--space-4)' }}>
                                <Field
                                    label={tr(S.phone, locale)}
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="0901234567"
                                    required
                                />
                                <Field
                                    label={tr(S.email, locale)}
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    hint={tr(S.optional, locale)}
                                />
                            </div>
                            <Field
                                label={tr(S.arrivalTime, locale)}
                                type="time"
                                value={arrivalTime}
                                onChange={(e) => setArrivalTime(e.target.value)}
                                hint={tr(S.arrivalHint, locale)}
                            />
                            <SelectField
                                label={tr(S.channel, locale)}
                                value={channel}
                                onChange={(e) => setChannel(e.target.value as Channel)}
                                hint={tr(S.channelHint, locale)}
                                required
                            >
                                {MANUAL_CHANNELS.map((c) => (
                                    <option key={c} value={c}>
                                        {tr(CHANNEL_LABEL[c], locale)}
                                    </option>
                                ))}
                            </SelectField>
                            <TextAreaField
                                label={tr(S.specialRequests, locale)}
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                hint={tr(S.specialRequestsHint, locale)}
                                rows={3}
                            />
                        </div>
                    </Panel>
                </div>

                {/* ---- tóm tắt giá: chỉ đọc, không có ô sửa tổng tiền ---- */}
                <aside style={{ minWidth: 0 }}>
                    <div
                        style={{
                            position: 'sticky',
                            top: 'var(--space-5)',
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: 'var(--space-5)',
                            display: 'grid',
                            gap: 'var(--space-4)',
                        }}
                    >
                        <h2
                            style={{
                                margin: 0,
                                fontSize: 'var(--text-base)',
                                fontFamily: 'var(--font-display)',
                            }}
                        >
                            {tr(S.priceSummary, locale)}
                        </h2>

                        {!quote && (
                            <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                                {tr(S.selectRoomFirst, locale)}
                            </p>
                        )}

                        {quote && !availability?.available && (
                            <div
                                role="alert"
                                style={{
                                    display: 'grid',
                                    gap: 'var(--space-2)',
                                    padding: 'var(--space-4)',
                                    background: 'var(--danger-bg)',
                                    color: 'var(--danger)',
                                    borderRadius: 'var(--radius)',
                                    fontSize: 'var(--text-sm)',
                                }}
                            >
                                <Badge tone="danger">
                                    {locale === 'vi' ? 'Không đặt được' : 'Not bookable'}
                                </Badge>
                                <span>
                                    {blockReason
                                        ? tr(BLOCK_REASON_LABEL[blockReason], locale)
                                        : tr(S.errSoldOut, locale)}
                                </span>
                            </div>
                        )}

                        {quote && availability?.available && (
                            <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                                {quote.lines.map((line, index) => (
                                    <SummaryRow
                                        key={index}
                                        label={`${line.kind} · ${line.quantity}`}
                                        value={formatPrice(line.total, locale)}
                                    />
                                ))}
                                <hr style={{ border: 0, borderTop: '1px solid var(--border)' }} />
                                <SummaryRow
                                    label={tr(S.subtotal, locale)}
                                    value={formatPrice(quote.subtotal, locale)}
                                    muted
                                />
                                {quote.promotion.applied.map((promo) => (
                                    <SummaryRow
                                        key={promo.promotionId}
                                        label={pick(promo.name, locale)}
                                        value={`−${formatPrice(promo.discount, locale)}`}
                                        tone="success"
                                    />
                                ))}
                                <hr style={{ border: 0, borderTop: '1px solid var(--border)' }} />
                                <SummaryRow
                                    label={tr(S.totalAmount, locale)}
                                    value={formatPrice(quote.totalAmount, locale)}
                                    strong
                                />
                                <SummaryRow
                                    label={tr(S.deposit, locale)}
                                    value={formatPrice(quote.depositAmount, locale)}
                                />
                                <SummaryRow
                                    label={tr(S.balanceDue, locale)}
                                    value={formatPrice(quote.balanceDue, locale)}
                                    muted
                                />
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: 'var(--text-xs)',
                                        lineHeight: 1.6,
                                        color: 'var(--text-muted)',
                                    }}
                                >
                                    {tr(S.priceReadOnlyHint, locale)}
                                </p>
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: 'var(--text-xs)',
                                        color: 'var(--text-muted)',
                                    }}
                                >
                                    {locale === 'vi' ? 'Còn trống' : 'Available'}:{' '}
                                    <strong style={{ fontVariantNumeric: 'tabular-nums' }}>
                                        {availability.availableUnits}
                                    </strong>
                                </p>
                            </div>
                        )}

                        <Button
                            onClick={submit}
                            disabled={submitting || !availability?.available}
                            aria-busy={submitting}
                            style={{ width: '100%', minHeight: 44 }}
                        >
                            {submitting ? tr(S.creatingBooking, locale) : tr(S.createBookingCta, locale)}
                        </Button>
                    </div>
                </aside>
            </div>

            <style>{`
                @media (min-width: 900px) {
                    .new-booking-grid { grid-template-columns: minmax(0, 1fr) 340px; align-items: start; }
                }
                @media (min-width: 640px) {
                    .nb-two-col { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                }
            `}</style>
        </div>
    )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section
            style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-5)',
            }}
        >
            <h2
                style={{
                    margin: '0 0 var(--space-4)',
                    fontSize: 'var(--text-base)',
                    fontFamily: 'var(--font-display)',
                }}
            >
                {title}
            </h2>
            {children}
        </section>
    )
}

function SummaryRow({
    label,
    value,
    strong,
    muted,
    tone,
}: {
    label: string
    value: string
    strong?: boolean
    muted?: boolean
    tone?: 'success'
}) {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 'var(--space-4)',
                fontSize: strong ? 'var(--text-lg)' : 'var(--text-sm)',
                fontWeight: strong ? 700 : 400,
                color:
                    tone === 'success'
                        ? 'var(--success)'
                        : muted
                          ? 'var(--text-muted)'
                          : 'var(--text)',
            }}
        >
            <span style={{ color: 'var(--text-muted)' }}>{label}</span>
            <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
        </div>
    )
}
