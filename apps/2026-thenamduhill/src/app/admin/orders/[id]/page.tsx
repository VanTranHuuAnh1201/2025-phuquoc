'use client'

/**
 * Chi tiết đơn ở CMS — nơi lễ tân làm việc thật.
 *
 * Nút hành động sinh từ `nextStatuses()` của core, không hard-code: trạng thái
 * nào đi được sang đâu là nghiệp vụ, không phải chuyện giao diện. Nhờ vậy đổi
 * đồ thị trạng thái ở core là toàn bộ CMS theo ngay.
 *
 * Form nhận phòng và trả phòng theo đúng `.claude/rules/app-flows.md` §F5.
 */

import { use, useMemo, useState } from 'react'
import Link from 'next/link'
import {
    can,
    formatPrice,
    getPropertySync,
    nextStatuses,
    pick,
    quoteRefund,
    ratePlans,
} from '@repo/core'
import type { BookingStatus, IncidentalCharge } from '@repo/core'
import {
    Badge,
    Button,
    CheckField,
    Field,
    Modal,
    SelectField,
    TextAreaField,
} from '@repo/ui'
import { useLocale } from '@/components/LocaleProvider'
import { priceLineLabel } from '@/components/PriceBreakdown'
import { useAuthStore } from '@/stores/auth.store'
import { useBookingStore } from '@/stores/booking.store'
import { useNotifyStore } from '@/stores/notify.store'
import type { WriteError } from '@/stores/booking.store'
import { TrashIcon } from '@/components/icons'
import { todayKey } from '@/stores/demo-data'
import { CHANNEL_LABEL, S, STATUS_LABEL, STATUS_TONE, WRITE_ERROR_LABEL, tr } from '@/strings'

export default function AdminBookingDetail({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = use(params)
    const { locale } = useLocale()
    const user = useAuthStore((s) => s.user)

    const booking = useBookingStore((s) => s.bookings.find((b) => b.id === id))
    const logs = useBookingStore((s) => s.logs)
    const roomUnits = useBookingStore((s) => s.roomUnits)
    const changeStatus = useBookingStore((s) => s.changeStatus)
    const doCheckIn = useBookingStore((s) => s.checkIn)
    const doCheckOut = useBookingStore((s) => s.checkOut)
    const cancelBooking = useBookingStore((s) => s.cancelBooking)
    const addNote = useBookingStore((s) => s.addNote)
    const pushNotification = useNotifyStore((s) => s.push)

    const [dialog, setDialog] = useState<'none' | 'check-in' | 'check-out' | 'cancel' | 'note'>(
        'none',
    )
    const [error, setError] = useState<WriteError | null>(null)
    /**
     * Hành động đang gửi. Ở GD1 store trả kết quả đồng bộ nên gần như không
     * thấy, nhưng `200-06` đổi thân hàm thành `await fetch()` là dùng ngay —
     * nút giữ nguyên kích thước và khoá tương tác (FE1).
     */
    const [busy, setBusy] = useState(false)

    const property = getPropertySync()
    const room = booking ? property.rooms.find((r) => r.id === booking.roomTypeId) : undefined
    const plan = booking ? ratePlans.find((p) => p.id === booking.ratePlanId) : undefined

    const timeline = useMemo(
        () => logs.filter((l) => l.bookingId === id).sort((a, b) => a.at.localeCompare(b.at)),
        [logs, id],
    )

    const freeUnits = useMemo(
        () =>
            booking
                ? roomUnits.filter(
                      (u) => u.roomTypeId === booking.roomTypeId && u.status === 'available',
                  )
                : [],
        [roomUnits, booking],
    )

    if (!booking || !user) {
        return (
            <p style={{ color: 'var(--text-muted)' }}>
                {locale === 'vi' ? 'Không tìm thấy đơn.' : 'Booking not found.'}
            </p>
        )
    }

    const actor = { id: user.id, name: user.fullName, role: user.role }
    const next = nextStatuses(booking.status)

    // Ẩn nút KHÔNG phải bảo mật (luật A3/BE2) — chỉ để lễ tân đỡ bấm nhầm vào
    // thứ sẽ bị từ chối. Chặn thật nằm ở Route Handler (`000-03`) và RLS
    // (`000-02`). Bản GD1 chạy trên store nên chưa có lớp đó — `200-06` trả nợ.
    const canChangeStatus = can(user.role, 'booking.change-status')
    const canCancel = can(user.role, 'booking.cancel')
    const canRefund = can(user.role, 'booking.refund')

    const runStatus = (to: BookingStatus) => {
        setBusy(true)
        const result = changeStatus(booking.id, to, actor)
        setBusy(false)
        // Không được bỏ qua giá trị trả về (§6.6) — kể cả khi GD1 luôn trả null.
        setError(result)
        if (!result && to === 'confirmed' && booking.customerId) {
            pushNotification({
                accountId: booking.customerId,
                kind: 'booking-confirmed',
                bookingId: booking.id,
                bookingCode: booking.code,
                payload: { roomTypeName: room?.name, nights: booking.nights, amount: booking.totalAmount },
            })
        }
    }

    return (
        <div style={{ display: 'grid', gap: 'var(--space-5)', minWidth: 0 }}>
            <Link
                href="/admin/orders"
                style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', textDecoration: 'none' }}
            >
                ← {tr(S.orders, locale)}
            </Link>

            <header
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 'var(--space-4)',
                    flexWrap: 'wrap',
                }}
            >
                <div style={{ minWidth: 0 }}>
                    <h1 style={{ margin: 0, fontSize: 'var(--text-2xl)', fontFamily: 'var(--font-display)' }}>
                        {booking.code}
                    </h1>
                    <p
                        style={{
                            margin: 'var(--space-2) 0 0',
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-muted)',
                            overflowWrap: 'anywhere',
                        }}
                    >
                        {booking.guest.fullName} · {booking.guest.phone} ·{' '}
                        {room ? pick(room.name, locale) : booking.roomTypeId}
                    </p>
                </div>
                <Badge tone={STATUS_TONE[booking.status]}>
                    {tr(STATUS_LABEL[booking.status], locale)}
                </Badge>
            </header>

            {/* ---- thanh hành động, sinh từ đồ thị trạng thái ---- */}
            <div
                style={{
                    display: 'flex',
                    gap: 'var(--space-3)',
                    flexWrap: 'wrap',
                    padding: 'var(--space-4)',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                }}
            >
                {canChangeStatus && next.includes('confirmed') && (
                    <Button onClick={() => runStatus('confirmed')} disabled={busy} aria-busy={busy}>
                        {tr(S.doConfirm, locale)}
                    </Button>
                )}
                {canChangeStatus && next.includes('checked_in') && (
                    <Button onClick={() => setDialog('check-in')} disabled={busy}>
                        {tr(S.doCheckIn, locale)}
                    </Button>
                )}
                {canChangeStatus && next.includes('checked_out') && (
                    <Button onClick={() => setDialog('check-out')} disabled={busy}>
                        {tr(S.doCheckOut, locale)}
                    </Button>
                )}
                {canChangeStatus && next.includes('no_show') && (
                    <Button
                        variant="secondary"
                        onClick={() => runStatus('no_show')}
                        disabled={busy}
                        aria-busy={busy}
                    >
                        {tr(S.markNoShow, locale)}
                    </Button>
                )}
                {canCancel && next.includes('cancelled') && (
                    <Button variant="secondary" onClick={() => setDialog('cancel')} disabled={busy}>
                        {tr(S.cancelBooking, locale)}
                    </Button>
                )}
                <Button variant="ghost" onClick={() => setDialog('note')} disabled={busy}>
                    {tr(S.staffNote, locale)}
                </Button>

                {next.length === 0 && (
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', alignSelf: 'center' }}>
                        {locale === 'vi' ? 'Đơn đã đóng, không sửa được nữa.' : 'This booking is closed.'}
                    </span>
                )}
            </div>

            {error && (
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
                    {/* Mỗi mã lỗi một câu riêng — gộp thành "Có lỗi xảy ra" là lấy
                        đi thông tin duy nhất giúp lễ tân xử lý được (§6.6). */}
                    {tr(WRITE_ERROR_LABEL[error], locale)}
                </div>
            )}

            <div
                className="admin-detail-grid"
                style={{ display: 'grid', gap: 'var(--space-5)', minWidth: 0 }}
            >
                <Card title={tr(S.priceSummary, locale)}>
                    <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                        {booking.priceLines.map((line, i) => (
                            <Row
                                key={i}
                                label={priceLineLabel(line, locale)}
                                value={formatPrice(line.total, locale)}
                            />
                        ))}
                        <hr style={{ border: 0, borderTop: '1px solid var(--border)' }} />
                        <Row label={tr(S.subtotal, locale)} value={formatPrice(booking.subtotal, locale)} muted />
                        {booking.appliedPromotions.map((p) => (
                            <Row
                                key={p.promotionId}
                                label={pick(p.name, locale)}
                                value={`−${formatPrice(p.discount, locale)}`}
                                tone="success"
                            />
                        ))}
                        <hr style={{ border: 0, borderTop: '1px solid var(--border)' }} />
                        <Row label={tr(S.totalAmount, locale)} value={formatPrice(booking.totalAmount, locale)} strong />
                        <Row
                            label={locale === 'vi' ? 'Đã thu' : 'Paid'}
                            value={formatPrice(booking.paidAmount, locale)}
                            tone="info"
                        />
                        {booking.paidAmount < booking.totalAmount && (
                            <Row
                                label={tr(S.balanceDue, locale)}
                                value={formatPrice(booking.totalAmount - booking.paidAmount, locale)}
                                tone="success"
                            />
                        )}

                        {/* Duyệt hoàn tiền — lễ tân KHÔNG có `booking.refund` nên
                            khối này biến mất hẳn với họ, không hiện dạng disabled
                            (§4.3). Ẩn nút không phải bảo mật: chặn thật ở API. */}
                        {canRefund && booking.cancellation && (
                            <div
                                style={{
                                    marginTop: 'var(--space-2)',
                                    padding: 'var(--space-4)',
                                    background: 'var(--warning-bg)',
                                    borderRadius: 'var(--radius)',
                                    display: 'grid',
                                    gap: 'var(--space-3)',
                                }}
                            >
                                <Row
                                    label={tr(S.refundAmount, locale)}
                                    value={formatPrice(booking.cancellation.refundAmount, locale)}
                                />
                                <Button
                                    size="sm"
                                    disabled={busy}
                                    onClick={() =>
                                        setError(
                                            addNote(
                                                booking.id,
                                                locale === 'vi'
                                                    ? `Duyệt hoàn ${booking.cancellation!.refundAmount.toLocaleString('vi-VN')}đ`
                                                    : `Refund approved: ${booking.cancellation!.refundAmount}`,
                                                actor,
                                            ),
                                        )
                                    }
                                >
                                    {locale === 'vi' ? 'Duyệt hoàn tiền' : 'Approve refund'}
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>

                <Card title={tr(S.guestInfo, locale)}>
                    <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                        <Row label={tr(S.fullName, locale)} value={booking.guest.fullName} />
                        <Row label={tr(S.phone, locale)} value={booking.guest.phone} />
                        <Row label={tr(S.email, locale)} value={booking.guest.email || '—'} />
                        <Row
                            label={tr(S.channel, locale)}
                            value={tr(CHANNEL_LABEL[booking.channel], locale)}
                        />
                        <Row
                            label={`${tr(S.checkIn, locale)} → ${tr(S.checkOut, locale)}`}
                            value={`${booking.checkIn} → ${booking.checkOut}`}
                        />
                        <Row
                            label={tr(S.guests, locale)}
                            value={`${booking.guests.adults} ${tr(S.adults, locale).toLowerCase()}${
                                booking.guests.children.length
                                    ? ` · ${booking.guests.children.length} ${tr(S.children, locale).toLowerCase()} (${booking.guests.children.join(', ')})`
                                    : ''
                            }`}
                        />
                        {booking.guest.estimatedArrivalTime && (
                            <Row label={tr(S.arrivalTime, locale)} value={booking.guest.estimatedArrivalTime} />
                        )}
                        {booking.guest.specialRequests && (
                            <Row label={tr(S.specialRequests, locale)} value={booking.guest.specialRequests} />
                        )}
                        {booking.guest.taxCode && (
                            <Row
                                label={tr(S.taxCode, locale)}
                                value={`${booking.guest.taxCode} · ${booking.guest.companyName ?? ''}`}
                            />
                        )}
                    </div>
                </Card>

                {booking.checkInRecord && (
                    <Card title={tr(S.doCheckIn, locale)}>
                        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                            <Row
                                label={tr(S.assignRoom, locale)}
                                value={
                                    roomUnits.find((u) => u.id === booking.checkInRecord!.roomUnitId)?.code ??
                                    booking.checkInRecord.roomUnitId
                                }
                            />
                            <Row label={tr(S.idNumber, locale)} value={booking.checkInRecord.idNumber} />
                            <Row
                                label={locale === 'vi' ? 'Giờ nhận' : 'Checked in at'}
                                value={new Date(booking.checkInRecord.at).toLocaleString(
                                    locale === 'vi' ? 'vi-VN' : 'en-US',
                                )}
                            />
                            {booking.checkInRecord.vehiclePlate && (
                                <Row label={tr(S.vehiclePlate, locale)} value={booking.checkInRecord.vehiclePlate} />
                            )}
                            <Row
                                label={locale === 'vi' ? 'Lễ tân' : 'Staff'}
                                value={booking.checkInRecord.staffName}
                            />
                        </div>
                    </Card>
                )}

                {booking.checkOutRecord && (
                    <Card title={tr(S.doCheckOut, locale)}>
                        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                            <Row
                                label={locale === 'vi' ? 'Giờ trả' : 'Checked out at'}
                                value={new Date(booking.checkOutRecord.at).toLocaleString(
                                    locale === 'vi' ? 'vi-VN' : 'en-US',
                                )}
                            />
                            {booking.checkOutRecord.incidentals.map((item) => (
                                <Row
                                    key={item.id}
                                    label={item.description}
                                    value={formatPrice(item.amount, locale)}
                                />
                            ))}
                            {booking.checkOutRecord.comment && (
                                <Row label={tr(S.closingComment, locale)} value={booking.checkOutRecord.comment} />
                            )}
                            {booking.checkOutRecord.guestRating && (
                                <Row
                                    label={tr(S.guestRating, locale)}
                                    value={'★'.repeat(booking.checkOutRecord.guestRating)}
                                />
                            )}
                        </div>
                    </Card>
                )}

                <Card title={tr(S.bookingTimeline, locale)}>
                    <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--space-4)' }}>
                        {timeline.map((log) => (
                            <li key={log.id} style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                <span
                                    aria-hidden="true"
                                    style={{
                                        width: 8,
                                        height: 8,
                                        marginTop: 6,
                                        borderRadius: '50%',
                                        background: 'var(--brand)',
                                        flexShrink: 0,
                                    }}
                                />
                                <div style={{ fontSize: 'var(--text-sm)', minWidth: 0, overflowWrap: 'anywhere' }}>
                                    <div>
                                        {log.action}
                                        {log.from && log.to ? `: ${log.from} → ${log.to}` : ''}
                                    </div>
                                    {log.note && (
                                        <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
                                            {log.note}
                                        </div>
                                    )}
                                    <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
                                        {new Date(log.at).toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US')} ·{' '}
                                        {log.actorName} ({log.actorRole})
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ol>
                </Card>
            </div>

            <CheckInDialog
                open={dialog === 'check-in'}
                onClose={() => setDialog('none')}
                units={freeUnits.map((u) => ({ id: u.id, code: u.code }))}
                defaultGuests={booking.guests}
                onSubmit={(record) => {
                    const result = doCheckIn(booking.id, record, actor)
                    setError(result)
                    if (!result) setDialog('none')
                }}
            />

            <CheckOutDialog
                open={dialog === 'check-out'}
                onClose={() => setDialog('none')}
                onSubmit={(record) => {
                    const result = doCheckOut(booking.id, record, actor)
                    setError(result)
                    if (!result) {
                        setDialog('none')
                        if (booking.customerId) {
                            pushNotification({
                                accountId: booking.customerId,
                                kind: 'review-request',
                                bookingId: booking.id,
                                bookingCode: booking.code,
                                payload: { roomTypeName: room?.name, nights: booking.nights },
                            })
                        }
                    }
                }}
            />

            <CancelDialog
                open={dialog === 'cancel'}
                onClose={() => setDialog('none')}
                refund={quoteRefund(booking, plan?.cancellationRules ?? [], todayKey())}
                onSubmit={(reason) => {
                    const result = cancelBooking(booking.id, 'admin', actor, reason)
                    setError(result)
                    if (!result) setDialog('none')
                }}
            />

            <NoteDialog
                open={dialog === 'note'}
                onClose={() => setDialog('none')}
                onSubmit={(note) => {
                    addNote(booking.id, note, actor)
                    setDialog('none')
                }}
            />

            <style>{`
                @media (min-width: 900px) {
                    .admin-detail-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                }
            `}</style>
        </div>
    )
}

// ============================================================== nhận phòng

function CheckInDialog({
    open,
    onClose,
    units,
    defaultGuests,
    onSubmit,
}: {
    open: boolean
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
                ? locale === 'vi'
                    ? 'Chọn phòng vật lý trước khi lưu.'
                    : 'Select a physical room before saving.'
                : null,
        )
        setIdError(
            missingId
                ? locale === 'vi'
                    ? 'Nhập số CCCD / hộ chiếu — bắt buộc theo quy định khai báo lưu trú.'
                    : 'Enter the ID / passport number — required by guest registration rules.'
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
        <Modal
            open={open}
            onClose={onClose}
            title={tr(S.doCheckIn, locale)}
            description={
                locale === 'vi'
                    ? 'Gán phòng và ghi thông tin lưu trú.'
                    : 'Assign a room and record stay details.'
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
                            ? locale === 'vi'
                                ? 'Không còn phòng trống của hạng này. Đổi phòng ở màn Buồng phòng rồi quay lại.'
                                : 'No available rooms of this type. Free one up in Housekeeping, then come back.'
                            : unitError
                    }
                    required
                >
                    <option value="">
                        {locale === 'vi' ? '— Chọn phòng —' : '— Select a room —'}
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
                        locale === 'vi'
                            ? 'Bắt buộc theo quy định khai báo lưu trú.'
                            : 'Required for mandatory guest registration.'
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
                    hint={locale === 'vi' ? 'Có phụ phí theo chính sách.' : 'Surcharge applies per policy.'}
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
        </Modal>
    )
}

// ============================================================== trả phòng

function CheckOutDialog({
    open,
    onClose,
    onSubmit,
}: {
    open: boolean
    onClose: () => void
    onSubmit: (record: {
        lateCheckOut: boolean
        incidentals: IncidentalCharge[]
        settled: boolean
        comment?: string
        guestRating?: number
        staffId: string
        staffName: string
    }) => void
}) {
    const { locale } = useLocale()
    const user = useAuthStore((s) => s.user)

    const [late, setLate] = useState(false)
    const [items, setItems] = useState<IncidentalCharge[]>([])
    const [settled, setSettled] = useState(false)
    const [comment, setComment] = useState('')
    const [rating, setRating] = useState(5)

    const total = items.reduce((sum, i) => sum + i.amount, 0)

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={tr(S.doCheckOut, locale)}
            description={
                locale === 'vi'
                    ? 'Ghi phát sinh và nhận xét trước khi đóng đơn.'
                    : 'Record charges and comments before closing the booking.'
            }
            footer={
                <>
                    <Button variant="ghost" onClick={onClose}>
                        {tr(S.cancel, locale)}
                    </Button>
                    <Button
                        disabled={!settled}
                        onClick={() =>
                            onSubmit({
                                lateCheckOut: late,
                                incidentals: items.filter((i) => i.description && i.amount > 0),
                                settled,
                                comment: comment || undefined,
                                guestRating: rating,
                                staffId: user?.id ?? '',
                                staffName: user?.fullName ?? '',
                            })
                        }
                    >
                        {tr(S.doCheckOut, locale)}
                    </Button>
                </>
            }
        >
            <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
                <CheckField
                    label={tr(S.lateCheckOut, locale)}
                    checked={late}
                    onChange={(e) => setLate(e.target.checked)}
                />

                <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                        {tr(S.incidentals, locale)}
                    </div>

                    {items.map((item, index) => (
                        <div key={item.id} style={{ display: 'flex', gap: 'var(--space-2)' }}>
                            <input
                                value={item.description}
                                placeholder={locale === 'vi' ? 'Minibar, giặt ủi…' : 'Minibar, laundry…'}
                                aria-label={locale === 'vi' ? 'Mô tả khoản phát sinh' : 'Charge description'}
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
                                value={item.amount}
                                aria-label={locale === 'vi' ? 'Số tiền' : 'Amount'}
                                onChange={(e) => {
                                    const next = [...items]
                                    next[index] = { ...item, amount: Number(e.target.value) || 0 }
                                    setItems(next)
                                }}
                                style={{ ...inlineInput, width: 120, textAlign: 'right' }}
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

                    {total > 0 && (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: 'var(--text-sm)',
                                fontWeight: 600,
                                paddingTop: 'var(--space-2)',
                                borderTop: '1px solid var(--border)',
                            }}
                        >
                            <span>{tr(S.totalAmount, locale)}</span>
                            <span>{formatPrice(total, locale)}</span>
                        </div>
                    )}
                </div>

                <CheckField
                    label={tr(S.settled, locale)}
                    checked={settled}
                    onChange={(e) => setSettled(e.target.checked)}
                    hint={tr(S.settledHint, locale)}
                />

                <TextAreaField
                    label={tr(S.closingComment, locale)}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    hint={
                        locale === 'vi'
                            ? 'Ghi lại tình trạng phòng, thái độ khách, việc cần lưu ý lần sau.'
                            : 'Note room condition, guest behaviour, anything worth remembering.'
                    }
                    rows={4}
                />

                <SelectField
                    label={tr(S.guestRating, locale)}
                    value={String(rating)}
                    onChange={(e) => setRating(Number(e.target.value))}
                    hint={
                        locale === 'vi'
                            ? 'Chỉ nhân viên thấy, khách không biết.'
                            : 'Internal only — never shown to the guest.'
                    }
                >
                    {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>
                            {'★'.repeat(n)}
                        </option>
                    ))}
                </SelectField>
            </div>
        </Modal>
    )
}

// ================================================================== huỷ đơn

function CancelDialog({
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
                        {locale === 'vi'
                            ? `Còn ${refund.daysUntilCheckIn} ngày tới ngày nhận phòng.`
                            : `${refund.daysUntilCheckIn} days until check-in.`}
                    </div>
                </div>
                <TextAreaField
                    label={locale === 'vi' ? 'Lý do huỷ' : 'Cancellation reason'}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />
            </div>
        </Modal>
    )
}

function NoteDialog({
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
                    locale === 'vi'
                        ? 'Ghi chú vào nhật ký đơn — không sửa hay xoá được sau khi lưu.'
                        : 'Appended to the activity log — cannot be edited or deleted afterwards.'
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

function Card({ title, children }: { title: string; children: React.ReactNode }) {
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

function Row({
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
