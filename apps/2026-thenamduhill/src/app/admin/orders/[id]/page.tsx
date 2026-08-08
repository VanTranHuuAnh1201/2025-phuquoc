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

import { use, useEffect, useMemo, useState } from 'react'
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
import type { BookingStatus } from '@repo/core'
import { Badge, Button } from '@repo/ui'
import { useLocale } from '@/components/LocaleProvider'
import { priceLineLabel } from '@/components/PriceBreakdown'
import { useAuthStore } from '@/stores/auth.store'
import { useBookingStore } from '@/stores/booking.store'
import { useNotifyStore } from '@/stores/notify.store'
import type { WriteError } from '@/stores/booking.store'
import { todayKey } from '@/stores/demo-data'
import { CHANNEL_LABEL, S, STATUS_LABEL, STATUS_TONE, WRITE_ERROR_LABEL, tr } from '@/strings'
import {
    Card,
    CancelDialog,
    CheckInDialog,
    CheckOutDialog,
    NoteDialog,
    Row,
} from '../_shared/OrderDialogs'

export default function AdminBookingDetail({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = use(params)
    const { locale } = useLocale()
    const user = useAuthStore((s) => s.user)
    const fetchBookingsFromApi = useBookingStore((s) => s.fetchBookingsFromApi)

    const booking = useBookingStore((s) => s.bookings.find((b) => b.id === id || b.code === id))
    const logs = useBookingStore((s) => s.logs)
    const roomUnits = useBookingStore((s) => s.roomUnits)

    useEffect(() => {
        fetchBookingsFromApi()
    }, [fetchBookingsFromApi])
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
                {pick({ vi: 'Không tìm thấy đơn.', en: 'Booking not found.' }, locale)}
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
                        {pick({ vi: 'Đơn đã đóng, không sửa được nữa.', en: 'This booking is closed.' }, locale)}
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
                            label={pick({ vi: 'Đã thu', en: 'Paid' }, locale)}
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
                                                pick({
                                                    vi: `Duyệt hoàn ${booking.cancellation!.refundAmount.toLocaleString('vi-VN')}đ`,
                                                    en: `Refund approved: ${booking.cancellation!.refundAmount}`,
                                                }, locale),
                                                actor,
                                            ),
                                        )
                                    }
                                >
                                    {pick({ vi: 'Duyệt hoàn tiền', en: 'Approve refund' }, locale)}
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
                                label={pick({ vi: 'Giờ nhận', en: 'Checked in at' }, locale)}
                                value={new Date(booking.checkInRecord.at).toLocaleString(
                                    tr(S.localeCode, locale),
                                )}
                            />
                            {booking.checkInRecord.vehiclePlate && (
                                <Row label={tr(S.vehiclePlate, locale)} value={booking.checkInRecord.vehiclePlate} />
                            )}
                            <Row
                                label={pick({ vi: 'Lễ tân', en: 'Staff' }, locale)}
                                value={booking.checkInRecord.staffName}
                            />
                        </div>
                    </Card>
                )}

                {booking.checkOutRecord && (
                    <Card title={tr(S.doCheckOut, locale)}>
                        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                            <Row
                                label={pick({ vi: 'Giờ trả', en: 'Checked out at' }, locale)}
                                value={new Date(booking.checkOutRecord.at).toLocaleString(
                                    tr(S.localeCode, locale),
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
                                        {new Date(log.at).toLocaleString(tr(S.localeCode, locale))} ·{' '}
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
                booking={booking}
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

