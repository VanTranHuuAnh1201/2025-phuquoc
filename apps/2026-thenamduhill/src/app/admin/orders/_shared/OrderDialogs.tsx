'use client'

/**
 * Hộp thoại và mảnh giao diện dùng chung cho CHI TIẾT ĐƠN.
 *
 * VÌ SAO TÁCH RA ĐÂY: cùng một đơn hàng nay xem được ở hai nơi — route đầy đủ
 * `/admin/orders/[id]` và bảng trượt phải mở từ mọi màn vận hành. Hai bản
 * trình bày, MỘT bộ nghiệp vụ. Copy khối này sang panel là tạo ra bản thứ hai
 * sẽ trôi khỏi bản gốc ngay lần sửa đầu tiên (luật C10).
 *
 * Các dialog ở đây thuần trình bày: nhận vào `units`/`booking`, trả ra bản ghi
 * qua `onSubmit`. Chúng KHÔNG gọi store — quyết định ghi gì thuộc về nơi gọi.
 */

import { useMemo, useState } from 'react'
import {
    DEFAULT_LATE_CHECKOUT_FEE,
    computeSettlement,
    formatPrice,
    pick,
} from '@repo/core'
import type { Booking, IncidentalCharge } from '@repo/core'
import { Button, CheckField, Field, Modal, SelectField, TextAreaField } from '@repo/ui'
import { useLocale } from '@/components/LocaleProvider'
import { useAuthStore } from '@/stores/auth.store'
import { TrashIcon } from '@/components/icons'
import { S, tr } from '@/strings'

/**
 * Vỏ của form nhận/trả phòng — hộp thoại NỔI hay khối PHẲNG.
 *
 * Cùng một form phải sống ở hai chỗ: bung ra từ trang chi tiết đầy đủ (nổi,
 * chặn nền lại), và nằm trong một tab của bảng trượt phải (phẳng, vì panel đã
 * là lớp nổi rồi — nổi chồng nổi trên màn 375px thì không còn thấy gì).
 *
 * Tách vỏ ra khỏi ruột như thế này để phần thân form — vốn là chỗ chứa nghiệp
 * vụ thật (validate CCCD, tính phụ phí, gán phòng) — chỉ tồn tại MỘT bản.
 */
function DialogShell({
    open,
    inline,
    onClose,
    title,
    description,
    footer,
    children,
}: {
    open: boolean
    inline?: boolean
    onClose: () => void
    title: string
    description?: string
    footer: React.ReactNode
    children: React.ReactNode
}) {
    if (!open) return null

    if (!inline) {
        return (
            <Modal open onClose={onClose} title={title} description={description} footer={footer}>
                {children}
            </Modal>
        )
    }

    return (
        <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
            {description && (
                <p
                    style={{
                        margin: 0,
                        fontSize: 'var(--cms-text-meta)',
                        color: 'var(--cms-text-muted)',
                    }}
                >
                    {description}
                </p>
            )}
            {children}
            {/* Nút dính đáy vùng cuộn của tab. Form nhận phòng dài hơn một màn
                nên nút Lưu ở cuối luồng cuộn là phải cuộn hết mới bấm được. */}
            <div
                style={{
                    position: 'sticky',
                    bottom: 0,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 8,
                    flexWrap: 'wrap',
                    paddingTop: 'var(--space-4)',
                    marginTop: 'var(--space-2)',
                    borderTop: '1px solid var(--cms-border)',
                    background: 'var(--cms-bg)',
                }}
            >
                {footer}
            </div>
        </div>
    )
}

// ============================================================== nhận phòng

export function CheckInDialog({
    open,
    inline,
    onClose,
    units,
    defaultGuests,
    onSubmit,
}: {
    open: boolean
    /** Render phẳng trong tab thay vì bung ra thành lớp nổi. */
    inline?: boolean
    onClose: () => void
    units: { id: string; code: string }[]
    defaultGuests: { adults: number; children: number[] }
    onSubmit: (record: {
        roomUnitId: string
        idNumber: string
        actualGuests: { adults: number; children: number[] }
        earlyCheckIn: boolean
        vehiclePlate?: string
        note?: string
        staffId: string
        staffName: string
    }) => void
}) {
    const { locale } = useLocale()
    const user = useAuthStore((s) => s.user)

    const [unitId, setUnitId] = useState('')
    const [idNumber, setIdNumber] = useState('')
    const [adults, setAdults] = useState(defaultGuests.adults)
    const [childCount, setChildCount] = useState(defaultGuests.children.length)
    const [early, setEarly] = useState(false)
    const [plate, setPlate] = useState('')
    const [note, setNote] = useState('')
    const [unitError, setUnitError] = useState<string | null>(null)
    const [idError, setIdError] = useState<string | null>(null)

    // Không còn phòng trống thì KHOÁ nút Lưu — để select rỗng im lặng là lễ tân
    // bấm mãi không hiểu vì sao (§6.9).
    const noUnits = units.length === 0

    const trySubmit = () => {
        // AC-10: bấm Lưu khi chưa chọn phòng phải BÁO LỖI BẰNG CHỮ, không im
        // lặng. Vì thế nút vẫn bấm được, việc chặn nằm ở đây.
        const missingUnit = !unitId
        const missingId = !idNumber.trim()
        setUnitError(
            missingUnit
                ? pick({ vi: 'Chọn phòng vật lý trước khi lưu.', en: 'Select a physical room before saving.' }, locale)
                : null,
        )
        setIdError(
            missingId
                ? pick({
                    vi: 'Nhập số CCCD / hộ chiếu — bắt buộc theo quy định khai báo lưu trú.',
                    en: 'Enter the ID / passport number — required by guest registration rules.',
                  }, locale)
                : null,
        )
        if (missingUnit || missingId) return

        onSubmit({
            roomUnitId: unitId,
            idNumber: idNumber.trim(),
            actualGuests: {
                adults,
                children: defaultGuests.children.slice(0, childCount),
            },
            earlyCheckIn: early,
            vehiclePlate: plate || undefined,
            note: note || undefined,
            staffId: user?.id ?? '',
            staffName: user?.fullName ?? '',
        })
    }

    return (
        <DialogShell
            open={open}
            inline={inline}
            onClose={onClose}
            title={tr(S.doCheckIn, locale)}
            description={
                pick({
                    vi: 'Gán phòng và ghi thông tin lưu trú.',
                    en: 'Assign a room and record stay details.',
                }, locale)
            }
            footer={
                <>
                    <Button variant="ghost" onClick={onClose}>
                        {tr(S.cancel, locale)}
                    </Button>
                    <Button disabled={noUnits} onClick={trySubmit}>
                        {tr(S.doCheckIn, locale)}
                    </Button>
                </>
            }
        >
            <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
                <SelectField
                    label={tr(S.assignRoom, locale)}
                    value={unitId}
                    onChange={(e) => {
                        setUnitId(e.target.value)
                        setUnitError(null)
                    }}
                    disabled={noUnits}
                    error={
                        noUnits
                            ? pick({
                                vi: 'Không còn phòng trống của hạng này. Đổi phòng ở màn Buồng phòng rồi quay lại.',
                                en: 'No available rooms of this type. Free one up in Housekeeping, then come back.',
                              }, locale)
                            : unitError
                    }
                    required
                >
                    <option value="">
                        {pick({ vi: '— Chọn phòng —', en: '— Select a room —' }, locale)}
                    </option>
                    {units.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                            {unit.code}
                        </option>
                    ))}
                </SelectField>

                <Field
                    label={tr(S.idNumber, locale)}
                    value={idNumber}
                    onChange={(e) => {
                        setIdNumber(e.target.value)
                        setIdError(null)
                    }}
                    hint={
                        pick({
                            vi: 'Bắt buộc theo quy định khai báo lưu trú.',
                            en: 'Required for mandatory guest registration.',
                        }, locale)
                    }
                    error={idError}
                    required
                />

                <div style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: '1fr 1fr' }}>
                    <Field
                        label={tr(S.adults, locale)}
                        type="number"
                        min={1}
                        value={adults}
                        onChange={(e) => setAdults(Number(e.target.value) || 1)}
                    />
                    <Field
                        label={tr(S.children, locale)}
                        type="number"
                        min={0}
                        value={childCount}
                        onChange={(e) => setChildCount(Number(e.target.value) || 0)}
                    />
                </div>

                <CheckField
                    label={tr(S.earlyCheckIn, locale)}
                    checked={early}
                    onChange={(e) => setEarly(e.target.checked)}
                    hint={pick({ vi: 'Có phụ phí theo chính sách.', en: 'Surcharge applies per policy.' }, locale)}
                />

                <Field
                    label={tr(S.vehiclePlate, locale)}
                    value={plate}
                    onChange={(e) => setPlate(e.target.value)}
                    hint={tr(S.optional, locale)}
                />

                <TextAreaField
                    label={tr(S.staffNote, locale)}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    hint={tr(S.optional, locale)}
                />
            </div>
        </DialogShell>
    )
}

// ============================================================== trả phòng

export function CheckOutDialog({
    open,
    inline,
    onClose,
    booking,
    onSubmit,
}: {
    open: boolean
    /** Render phẳng trong tab thay vì bung ra thành lớp nổi. */
    inline?: boolean
    onClose: () => void
    booking: Booking
    onSubmit: (record: {
        lateCheckOut: boolean
        lateCheckOutFee: number
        incidentals: IncidentalCharge[]
        computedDue: number
        collectedAmount: number
        settled: boolean
        comment?: string
        guestRating?: number
        staffId: string
        staffName: string
    }) => void
}) {
    const { locale } = useLocale()
    const user = useAuthStore((s) => s.user)

    // Giờ trả mặc định = lúc mở form. Tính MỘT LẦN cho mỗi lần dựng component
    // (deps rỗng) — bản trước để `[open]`, nhưng khi form render phẳng trong
    // tab thì `open` luôn `true` nên deps đó không bao giờ đổi và chỉ khiến
    // ESLint cảnh báo. React tự dựng lại component khi mở form lần sau, nên
    // giờ vẫn được làm mới đúng như ý định ban đầu.
    const nowTime = useMemo(() => {
        const d = new Date()
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    }, [])

    const [actualTime, setActualTime] = useState(nowTime)
    const [late, setLate] = useState(false)
    const [items, setItems] = useState<IncidentalCharge[]>([])
    const [settled, setSettled] = useState(false)
    const [comment, setComment] = useState('')
    const [rating, setRating] = useState(5)

    const [customCollected, setCustomCollected] = useState<string>('')
    const [touchedCollected, setTouchedCollected] = useState(false)

    const validIncidentals = useMemo(
        () => items.filter((i) => i.description.trim() && i.amount > 0),
        [items],
    )

    const lateCheckOutFee = late ? DEFAULT_LATE_CHECKOUT_FEE : 0

    const settlement = useMemo(
        () =>
            computeSettlement({
                booking,
                incidentals: validIncidentals,
                lateCheckOutFee,
            }),
        [booking, validIncidentals, lateCheckOutFee],
    )

    const computedDue = settlement.totalDue
    const collectedAmount = touchedCollected ? Number(customCollected) || 0 : computedDue

    const dueFormatted = formatPrice(computedDue, locale)

    return (
        <DialogShell
            open={open}
            inline={inline}
            onClose={onClose}
            title={tr(S.doCheckOut, locale)}
            description={pick(
                {
                    vi: 'Ghi phát sinh và chốt bill tiền phòng trước khi đóng đơn.',
                    en: 'Record charges and settle room bill before closing the booking.',
                },
                locale,
            )}
            footer={
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={onClose}>
                            {tr(S.cancel, locale)}
                        </Button>
                        <Button
                            disabled={!settled}
                            onClick={() =>
                                onSubmit({
                                    lateCheckOut: late,
                                    lateCheckOutFee,
                                    incidentals: validIncidentals,
                                    computedDue,
                                    collectedAmount,
                                    settled,
                                    comment: comment.trim() || undefined,
                                    guestRating: rating,
                                    staffId: user?.id ?? '',
                                    staffName: user?.fullName ?? '',
                                })
                            }
                        >
                            {tr(S.doCheckOut, locale)}
                        </Button>
                    </div>
                    {!settled && (
                        <div
                            aria-live="polite"
                            style={{
                                fontSize: 'var(--text-xs)',
                                color: 'var(--warning)',
                                background: 'var(--warning-bg)',
                                padding: 'var(--space-2) var(--space-3)',
                                borderRadius: 'var(--radius)',
                                textAlign: 'right',
                            }}
                        >
                            {tr(S.unsettledWarningText, locale).replace('{amount}', dueFormatted)}
                        </div>
                    )}
                </div>
            }
        >
            <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
                {/* 1. Giờ trả thực tế */}
                <Field
                    label={pick({ vi: 'Giờ trả thực tế', en: 'Actual check-out time' }, locale)}
                    type="time"
                    value={actualTime}
                    onChange={(e) => setActualTime(e.target.value)}
                    required
                />

                {/* 2. Trả phòng muộn */}
                <CheckField
                    label={`${tr(S.lateCheckOut, locale)} (${formatPrice(DEFAULT_LATE_CHECKOUT_FEE, locale)})`}
                    checked={late}
                    onChange={(e) => setLate(e.target.checked)}
                />

                {/* 3. Phát sinh tại phòng */}
                <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                        {tr(S.incidentalChargesTotal, locale)}
                    </div>

                    {items.map((item, index) => (
                        <div key={item.id} style={{ display: 'flex', gap: 'var(--space-2)' }}>
                            <input
                                value={item.description}
                                placeholder={pick({ vi: 'Minibar, giặt ủi…', en: 'Minibar, laundry…' }, locale)}
                                aria-label={pick({ vi: 'Mô tả khoản phát sinh', en: 'Charge description' }, locale)}
                                onChange={(e) => {
                                    const next = [...items]
                                    next[index] = { ...item, description: e.target.value }
                                    setItems(next)
                                }}
                                style={inlineInput}
                            />
                            <input
                                type="number"
                                min={0}
                                step={10000}
                                value={item.amount || ''}
                                aria-label={pick({ vi: 'Số tiền', en: 'Amount' }, locale)}
                                onChange={(e) => {
                                    const next = [...items]
                                    next[index] = { ...item, amount: Math.max(0, Number(e.target.value) || 0) }
                                    setItems(next)
                                }}
                                style={{ ...inlineInput, width: 130, textAlign: 'right' }}
                            />
                            <button
                                type="button"
                                onClick={() => setItems(items.filter((_, i) => i !== index))}
                                aria-label={`${tr(S.delete, locale)}: ${item.description || tr(S.incidentals, locale)}`}
                                style={{
                                    display: 'grid',
                                    placeItems: 'center',
                                    width: 32,
                                    minHeight: 32,
                                    background: 'transparent',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius)',
                                    color: 'var(--danger)',
                                    cursor: 'pointer',
                                }}
                            >
                                <TrashIcon size={14} />
                            </button>
                        </div>
                    ))}

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                            setItems([
                                ...items,
                                { id: `inc-${items.length}-${Date.now()}`, description: '', amount: 0 },
                            ])
                        }
                    >
                        + {tr(S.addIncidental, locale)}
                    </Button>
                </div>

                {/* Khối tiền hiển thị (§3 / §6.2) */}
                <div
                    style={{
                        padding: 'var(--space-4)',
                        background: 'var(--surface-sunken, var(--neutral-100, #f8fafc))',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        display: 'grid',
                        gap: 'var(--space-2)',
                        position: 'sticky',
                        bottom: 0,
                        zIndex: 2,
                    }}
                >
                    <Row
                        label={tr(S.totalAmount, locale)}
                        value={formatPrice(booking.totalAmount, locale)}
                    />
                    <Row
                        label={pick({ vi: 'Đã thu cọc / thanh toán', en: 'Paid amount' }, locale)}
                        value={formatPrice(booking.paidAmount, locale)}
                    />
                    <div style={{ borderTop: '1px dashed var(--border)', margin: 'var(--space-1) 0' }} />
                    <Row
                        label={tr(S.roomBalanceDue, locale)}
                        value={formatPrice(settlement.roomBalance, locale)}
                    />
                    {settlement.incidentalTotal > 0 && (
                        <Row
                            label={tr(S.incidentalChargesTotal, locale)}
                            value={formatPrice(settlement.incidentalTotal, locale)}
                        />
                    )}
                    {settlement.lateCheckOutFee > 0 && (
                        <Row
                            label={tr(S.lateCheckOutSurcharge, locale)}
                            value={formatPrice(settlement.lateCheckOutFee, locale)}
                        />
                    )}
                    <div style={{ borderTop: '1px solid var(--border)', margin: 'var(--space-1) 0' }} />
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'baseline',
                            gap: 'var(--space-4)',
                        }}
                    >
                        <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                            {tr(S.totalDueNow, locale)}
                        </span>
                        <span
                            style={{
                                fontSize: 'var(--text-2xl)',
                                fontWeight: 700,
                                fontVariantNumeric: 'tabular-nums',
                                color: 'var(--text)',
                            }}
                        >
                            {formatPrice(computedDue, locale)}
                        </span>
                    </div>
                </div>

                {/* 4. Số tiền thu thêm thực tế (sửa được) */}
                <Field
                    label={tr(S.collectedAmountLabel, locale)}
                    type="number"
                    min={0}
                    value={touchedCollected ? customCollected : computedDue}
                    onChange={(e) => {
                        setTouchedCollected(true)
                        setCustomCollected(e.target.value)
                    }}
                    hint={tr(S.collectedAmountHint, locale)}
                />

                {/* 5. Đã thanh toán đủ */}
                <CheckField
                    label={tr(S.settled, locale)}
                    checked={settled}
                    onChange={(e) => setSettled(e.target.checked)}
                    hint={tr(S.settledHint, locale)}
                />

                {/* 6. Nhận xét kết thúc */}
                <TextAreaField
                    label={tr(S.closingComment, locale)}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    hint={pick(
                        {
                            vi: 'Ghi lại tình trạng phòng, thái độ khách, việc cần lưu ý lần sau.',
                            en: 'Note room condition, guest behaviour, anything worth remembering.',
                        },
                        locale,
                    )}
                    rows={3}
                />

                {/* 7. Đánh giá khách (nội bộ, 1-5 sao) */}
                <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text)' }}>
                        {tr(S.guestRating, locale)}
                    </label>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                        {tr(S.internalRatingHint, locale)}
                    </div>
                    <fieldset
                        style={{
                            border: 'none',
                            padding: 0,
                            margin: 0,
                            display: 'flex',
                            gap: 'var(--space-2)',
                        }}
                    >
                        {[1, 2, 3, 4, 5].map((star) => (
                            <label
                                key={star}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    cursor: 'pointer',
                                    padding: 'var(--space-2) var(--space-3)',
                                    borderRadius: 'var(--radius)',
                                    border: star <= rating ? '1px solid var(--brand)' : '1px solid var(--border)',
                                    background: star <= rating ? 'var(--brand-subtle, rgba(0,0,0,0.03))' : 'transparent',
                                    fontSize: 'var(--text-sm)',
                                }}
                            >
                                <input
                                    type="radio"
                                    name="guest-rating"
                                    value={star}
                                    checked={rating === star}
                                    onChange={() => setRating(star)}
                                    aria-label={pick(
                                        { vi: `${star} sao — đánh giá nội bộ`, en: `${star} stars — internal rating` },
                                        locale,
                                    )}
                                />
                                {'★'.repeat(star)}
                            </label>
                        ))}
                    </fieldset>
                </div>
            </div>
        </DialogShell>
    )
}

// ================================================================== huỷ đơn

export function CancelDialog({
    open,
    onClose,
    refund,
    onSubmit,
}: {
    open: boolean
    onClose: () => void
    refund: { percent: number; amount: number; daysUntilCheckIn: number }
    onSubmit: (reason: string) => void
}) {
    const { locale } = useLocale()
    const [reason, setReason] = useState('')

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={tr(S.cancelConfirmTitle, locale)}
            footer={
                <>
                    <Button variant="ghost" onClick={onClose}>
                        {tr(S.close, locale)}
                    </Button>
                    <Button onClick={() => onSubmit(reason)}>{tr(S.cancelBooking, locale)}</Button>
                </>
            }
        >
            <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
                <div
                    style={{
                        padding: 'var(--space-4)',
                        background: refund.percent > 0 ? 'var(--success-bg)' : 'var(--warning-bg)',
                        color: refund.percent > 0 ? 'var(--success)' : 'var(--warning)',
                        borderRadius: 'var(--radius)',
                        fontSize: 'var(--text-sm)',
                    }}
                >
                    <strong>
                        {tr(S.refundAmount, locale)}: {formatPrice(refund.amount, locale)} ({refund.percent}%)
                    </strong>
                    <div style={{ marginTop: 4, fontSize: 'var(--text-xs)' }}>
                        {pick({
                            vi: `Còn ${refund.daysUntilCheckIn} ngày tới ngày nhận phòng.`,
                            en: `${refund.daysUntilCheckIn} days until check-in.`,
                        }, locale)}
                    </div>
                </div>
                <TextAreaField
                    label={pick({ vi: 'Lý do huỷ', en: 'Cancellation reason' }, locale)}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />
            </div>
        </Modal>
    )
}

export function NoteDialog({
    open,
    onClose,
    onSubmit,
}: {
    open: boolean
    onClose: () => void
    onSubmit: (note: string) => void
}) {
    const { locale } = useLocale()
    const [note, setNote] = useState('')

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={tr(S.staffNote, locale)}
            footer={
                <>
                    <Button variant="ghost" onClick={onClose}>
                        {tr(S.cancel, locale)}
                    </Button>
                    <Button
                        disabled={!note.trim()}
                        onClick={() => {
                            onSubmit(note.trim())
                            setNote('')
                        }}
                    >
                        {tr(S.save, locale)}
                    </Button>
                </>
            }
        >
            <TextAreaField
                label={tr(S.staffNote, locale)}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                hint={
                    pick({
                        vi: 'Ghi chú vào nhật ký đơn — không sửa hay xoá được sau khi lưu.',
                        en: 'Appended to the activity log — cannot be edited or deleted afterwards.',
                    }, locale)
                }
                rows={4}
                autoFocus
            />
        </Modal>
    )
}

// ================================================================== tiện ích

const inlineInput: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    padding: 'var(--space-2) var(--space-3)',
    fontSize: 'var(--text-sm)',
    fontFamily: 'var(--font-body)',
    border: '1px solid var(--border-strong)',
    borderRadius: 'var(--radius)',
}

export function Card({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section
            style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-5)',
                minWidth: 0,
            }}
        >
            <h2 style={{ margin: '0 0 var(--space-4)', fontSize: 'var(--text-base)', fontFamily: 'var(--font-display)' }}>
                {title}
            </h2>
            {children}
        </section>
    )
}

export function Row({
    label,
    value,
    strong,
    muted,
    tone,
}: {
    label: string
    value: React.ReactNode
    strong?: boolean
    muted?: boolean
    tone?: 'success' | 'info'
}) {
    const color =
        tone === 'success'
            ? 'var(--success)'
            : tone === 'info'
              ? 'var(--info)'
              : muted
                ? 'var(--text-muted)'
                : 'var(--text)'
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 'var(--space-4)',
                // Giá trị dài (tên hạng phòng, ghi chú) phải xuống dòng chứ
                // không được đẩy thẻ rộng ra và sinh cuộn ngang ở 375px (AC-7).
                flexWrap: 'wrap',
                minWidth: 0,
                fontSize: strong ? 'var(--text-lg)' : 'var(--text-sm)',
                fontWeight: strong ? 700 : 400,
                color,
            }}
        >
            <span style={{ color: 'var(--text-muted)', minWidth: 0 }}>{label}</span>
            <span
                style={{
                    textAlign: 'right',
                    fontVariantNumeric: 'tabular-nums',
                    minWidth: 0,
                    overflowWrap: 'anywhere',
                }}
            >
                {value}
            </span>
        </div>
    )
}
