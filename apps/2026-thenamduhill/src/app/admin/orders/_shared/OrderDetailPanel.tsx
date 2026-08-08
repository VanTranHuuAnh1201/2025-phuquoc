'use client'

/**
 * Chi tiết một đơn — nội dung thuần + hook mở nó trong drawer phải.
 *
 * VÌ SAO TỒN TẠI: trước đây xem một đơn là rời trang hiện tại
 * (`router.push('/admin/orders/<id>')`) rồi bấm Back để quay lại. Lễ tân duyệt
 * 20 đơn là 40 lần chuyển trang, mỗi lần mất chỗ đang dò trong bảng. Drawer giữ
 * nền còn nhìn thấy nên chuỗi "mở → xử lý → đóng → mở tiếp" không đứt.
 *
 * QUAN HỆ VỚI ROUTE `/admin/orders/[id]`: route vẫn sống, không xoá. Hai bản
 * TRÌNH BÀY, một bộ nghiệp vụ — mọi hộp thoại và mảnh hiển thị đến từ
 * `OrderDialogs.tsx`; file này chỉ sắp xếp chúng vào tab và nối vào store.
 *
 * VÌ SAO TÁCH THÀNH `OrderDetailView` + `useOrderDrawer`: `DrawerRight` là API
 * mệnh lệnh (`show({ children })`) chứ không phải component có prop `open`.
 * Nội dung phải là một component ĐỘC LẬP tự lo state của mình, còn việc mở là
 * một lệnh gọi hàm. Nhờ vậy màn gọi không phải giữ `openOrderId` nữa.
 *
 * TAB HIỆN THEO TRẠNG THÁI, KHÔNG CỐ ĐỊNH: tab "Nhận phòng" chỉ có nghĩa khi
 * đơn thật sự nhận phòng được. Tab luôn hiện nhưng bấm vào thì rỗng sẽ dạy
 * người dùng bỏ qua cả hàng tab. Điều kiện lấy từ `nextStatuses()` của core —
 * cùng một nguồn sự thật với các nút hành động, nên không thể lệch nhau.
 *
 * TAB NẰM TRONG NỘI DUNG, KHÔNG PHẢI TRONG SHELL: `DrawerRight` thuộc tầng nền
 * (R15) nên không được biết "đơn hàng có mấy tab". Hàng tab là chi tiết nghiệp
 * vụ của màn này, vì vậy nó sống ở đây.
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
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
import { useDrawerRight } from '@repo/cms-ui'
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
} from './OrderDialogs'

type PanelTabId = 'overview' | 'check-in' | 'check-out' | 'history'

interface PanelTab {
    id: PanelTabId
    label: string
}

export interface OrderDetailViewProps {
    /** Mã hoặc id đơn cần xem. */
    bookingId: string
    /** Đóng chính lớp drawer đang chứa view này. */
    onRequestClose: () => void
    /** Mở hồ sơ khách — chỉ truyền ở màn có chỗ hiển thị hồ sơ. */
    onOpenCustomer?: (customerId: string) => void
}

export function OrderDetailView({
    bookingId,
    onRequestClose,
    onOpenCustomer,
}: OrderDetailViewProps) {
    const { locale } = useLocale()
    const user = useAuthStore((s) => s.user)

    const booking = useBookingStore((s) =>
        s.bookings.find((b) => b.id === bookingId || b.code === bookingId),
    )
    const logs = useBookingStore((s) => s.logs)
    const roomUnits = useBookingStore((s) => s.roomUnits)

    const changeStatus = useBookingStore((s) => s.changeStatus)
    const doCheckIn = useBookingStore((s) => s.checkIn)
    const doCheckOut = useBookingStore((s) => s.checkOut)
    const cancelBooking = useBookingStore((s) => s.cancelBooking)
    const addNote = useBookingStore((s) => s.addNote)
    const pushNotification = useNotifyStore((s) => s.push)

    const [tab, setTab] = useState<PanelTabId>('overview')
    const [dialog, setDialog] = useState<'none' | 'cancel' | 'note'>('none')
    const [error, setError] = useState<WriteError | null>(null)
    const [busy, setBusy] = useState(false)

    // Đổi sang đơn khác thì trả tab về đầu — giữ tab "Trả phòng" của đơn trước
    // cho một đơn vừa mới đặt là hiển thị một tab không tồn tại.
    useEffect(() => {
        setTab('overview')
        setDialog('none')
        setError(null)
    }, [bookingId])

    const property = getPropertySync()
    const room = booking ? property.rooms.find((r) => r.id === booking.roomTypeId) : undefined
    const plan = booking ? ratePlans.find((p) => p.id === booking.ratePlanId) : undefined

    const timeline = useMemo(
        () =>
            booking
                ? logs.filter((l) => l.bookingId === booking.id).sort((a, b) => a.at.localeCompare(b.at))
                : [],
        [logs, booking],
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

    // Bọc trong `useMemo` vì `nextStatuses()` trả MẢNG MỚI mỗi lần gọi — để
    // trần thì `tabs` bên dưới tính lại ở mọi lần render dù trạng thái đơn
    // không đổi, kéo theo `useEffect` chỉnh tab chạy theo.
    const next = useMemo(
        () => (booking ? nextStatuses(booking.status) : []),
        [booking],
    )

    const tabs = useMemo<PanelTab[]>(() => {
        const list: PanelTab[] = [{ id: 'overview', label: tr(S.panelOverview, locale) }]
        // `nextStatuses()` là nguồn sự thật duy nhất: tab chỉ hiện khi đơn thật
        // sự đi được sang trạng thái đó.
        if (next.includes('checked_in')) list.push({ id: 'check-in', label: tr(S.doCheckIn, locale) })
        if (next.includes('checked_out')) list.push({ id: 'check-out', label: tr(S.doCheckOut, locale) })
        list.push({ id: 'history', label: tr(S.panelHistory, locale) })
        return list
    }, [next, locale])

    // Tab đang mở biến mất sau khi đổi trạng thái (vừa nhận phòng xong thì tab
    // "Nhận phòng" hết lý do tồn tại) — kéo về Tổng quan thay vì để trống.
    useEffect(() => {
        if (!tabs.some((t) => t.id === tab)) setTab('overview')
    }, [tabs, tab])

    if (!booking || !user) {
        return (
            <p className="text-[length:var(--cms-text-body)] text-[var(--cms-text-muted)]">
                {tr(S.panelNotFound, locale)}
            </p>
        )
    }

    const actor = { id: user.id, name: user.fullName, role: user.role }

    // Ẩn nút KHÔNG phải là bảo mật (BE2) — chặn thật nằm ở Route Handler và RLS.
    // Ở đây chỉ để lễ tân đỡ bấm vào thứ chắc chắn bị từ chối.
    const canChangeStatus = can(user.role, 'booking.change-status')
    const canCancel = can(user.role, 'booking.cancel')
    const canRefund = can(user.role, 'booking.refund')

    const runStatus = (to: BookingStatus) => {
        setBusy(true)
        const result = changeStatus(booking.id, to, actor)
        setBusy(false)
        setError(result)
        if (!result && to === 'confirmed' && booking.customerId) {
            pushNotification({
                accountId: booking.customerId,
                kind: 'booking-confirmed',
                bookingId: booking.id,
                bookingCode: booking.code,
                payload: {
                    roomTypeName: room?.name,
                    nights: booking.nights,
                    amount: booking.totalAmount,
                },
            })
        }
    }

    const assignedUnit = booking.checkInRecord
        ? roomUnits.find((u) => u.id === booking.checkInRecord!.roomUnitId)
        : undefined

    return (
        <>
            {/* Hàng tab. `role="tablist"` + `aria-selected` để trình đọc màn hình
                hiểu đây là nhóm lựa chọn chứ không phải mấy nút rời rạc (FE11). */}
            <div
                role="tablist"
                aria-label={tr(S.panelOverview, locale)}
                className="mb-[var(--cms-gap)] flex flex-wrap gap-1 border-b border-[var(--cms-border)]"
            >
                {tabs.map((t) => {
                    const active = t.id === tab
                    return (
                        <button
                            key={t.id}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            onClick={() => setTab(t.id)}
                            // Viền dưới 2px LUÔN chiếm chỗ ở cả hai nhánh, chỉ đổi
                            // MÀU theo `active` — cùng kỹ thuật với menu của
                            // `AppShell`, tránh nhảy layout khi chuyển tab.
                            className={`flex h-9 shrink-0 items-center whitespace-nowrap border-b-2 px-3 text-[length:var(--cms-text-body)] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)] ${
                                active
                                    ? 'border-[var(--cms-accent)] text-[var(--cms-accent)]'
                                    : 'border-transparent text-[var(--cms-text-muted)] hover:bg-[var(--cms-bg-subtle)] hover:text-[var(--cms-text)] active:bg-[var(--cms-accent-weak)]'
                            }`}
                        >
                            {t.label}
                        </button>
                    )
                })}
            </div>

            {error && (
                <div
                    role="alert"
                    aria-live="polite"
                    className="mb-[var(--cms-gap)] rounded-[var(--cms-radius)] bg-[var(--cms-tone-rose-bg)] px-3 py-2.5 text-[length:var(--cms-text-body)] text-[var(--cms-tone-rose)]"
                >
                    {tr(WRITE_ERROR_LABEL[error], locale)}
                </div>
            )}

            {tab === 'overview' && (
                <div style={{ display: 'grid', gap: 'var(--cms-gap)' }}>
                    <Card title={tr(S.priceSummary, locale)}>
                        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                            {booking.priceLines.map((line, i) => (
                                <Row
                                    key={i}
                                    label={priceLineLabel(line, locale)}
                                    value={formatPrice(line.total, locale)}
                                />
                            ))}
                            <hr style={{ border: 0, borderTop: '1px solid var(--cms-border)' }} />
                            <Row
                                label={tr(S.subtotal, locale)}
                                value={formatPrice(booking.subtotal, locale)}
                                muted
                            />
                            {booking.appliedPromotions.map((p) => (
                                <Row
                                    key={p.promotionId}
                                    label={pick(p.name, locale)}
                                    value={`−${formatPrice(p.discount, locale)}`}
                                    tone="success"
                                />
                            ))}
                            <hr style={{ border: 0, borderTop: '1px solid var(--cms-border)' }} />
                            <Row
                                label={tr(S.totalAmount, locale)}
                                value={formatPrice(booking.totalAmount, locale)}
                                strong
                            />
                            <Row
                                label={pick({ vi: 'Đã thu', en: 'Paid' }, locale)}
                                value={formatPrice(booking.paidAmount, locale)}
                                tone="info"
                            />
                            {booking.paidAmount < booking.totalAmount && (
                                <Row
                                    label={tr(S.balanceDue, locale)}
                                    value={formatPrice(
                                        booking.totalAmount - booking.paidAmount,
                                        locale,
                                    )}
                                    tone="success"
                                />
                            )}
                            {canRefund && booking.cancellation && (
                                <div
                                    style={{
                                        marginTop: 'var(--space-2)',
                                        padding: 'var(--space-4)',
                                        background: 'var(--cms-tone-amber-bg)',
                                        borderRadius: 'var(--cms-radius)',
                                        display: 'grid',
                                        gap: 'var(--space-3)',
                                    }}
                                >
                                    <Row
                                        label={tr(S.refundAmount, locale)}
                                        value={formatPrice(
                                            booking.cancellation.refundAmount,
                                            locale,
                                        )}
                                    />
                                    <Button
                                        size="sm"
                                        disabled={busy}
                                        onClick={() =>
                                            setError(
                                                addNote(
                                                    booking.id,
                                                    pick(
                                                        {
                                                            vi: `Duyệt hoàn ${booking.cancellation!.refundAmount.toLocaleString('vi-VN')}đ`,
                                                            en: `Refund approved: ${booking.cancellation!.refundAmount}`,
                                                        },
                                                        locale,
                                                    ),
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
                                label={tr(S.roomType, locale)}
                                value={room ? pick(room.name, locale) : booking.roomTypeId}
                            />
                            {/* Liên kết chéo sang hồ sơ khách. Chỉ hiện khi đơn
                                THẬT SỰ có `customerId` — đơn khách vãng lai
                                không có hồ sơ, hiện link chết là tệ hơn không
                                có link. */}
                            {booking.customerId && onOpenCustomer && (
                                <button
                                    type="button"
                                    onClick={() => onOpenCustomer(booking.customerId!)}
                                    className="cms-crosslink"
                                >
                                    {tr(S.linkCustomerProfile, locale)} →
                                </button>
                            )}
                        </div>
                    </Card>

                    {booking.checkInRecord && (
                        <Card title={tr(S.doCheckIn, locale)}>
                            <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                                <Row
                                    label={tr(S.assignRoom, locale)}
                                    value={assignedUnit?.code ?? booking.checkInRecord.roomUnitId}
                                />
                                <Row
                                    label={tr(S.idNumber, locale)}
                                    value={booking.checkInRecord.idNumber}
                                />
                                <Row
                                    label={pick({ vi: 'Giờ nhận', en: 'Checked in at' }, locale)}
                                    value={new Date(booking.checkInRecord.at).toLocaleString(
                                        tr(S.localeCode, locale),
                                    )}
                                />
                                {booking.checkInRecord.vehiclePlate && (
                                    <Row
                                        label={tr(S.vehiclePlate, locale)}
                                        value={booking.checkInRecord.vehiclePlate}
                                    />
                                )}
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
                                    <Row
                                        label={tr(S.closingComment, locale)}
                                        value={booking.checkOutRecord.comment}
                                    />
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

                    <Link
                        href={`/admin/orders/${booking.id}`}
                        className="text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)]"
                    >
                        {tr(S.panelFullPage, locale)} →
                    </Link>

                    {/*
                     * Hàng hành động ở CUỐI tab Tổng quan, không phải chân drawer:
                     * chân drawer là của tầng nền và không biết đơn này làm được
                     * gì. Đặt ngay dưới nội dung vừa đọc xong cũng đúng thứ tự
                     * "xem rồi mới quyết".
                     *
                     * Nút chính luôn NÊU RÕ việc nó làm ("Xác nhận đơn") thay vì
                     * "Lưu" chung chung — luật C8/D6 cấm nhãn mơ hồ, và ở đây nó
                     * còn là chốt an toàn: lễ tân biết mình sắp đổi trạng thái gì.
                     *
                     * Tab nhận/trả phòng KHÔNG có hàng nút này: form của chúng tự
                     * mang nút Lưu. Thêm nút thứ hai là hai lối làm cùng một việc.
                     */}
                    <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[var(--cms-border)] pt-[var(--cms-gap)]">
                        {next.length === 0 && (
                            <span className="mr-auto text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)]">
                                {tr(S.panelClosedBooking, locale)}
                            </span>
                        )}
                        <button
                            type="button"
                            className="cms-btn-secondary"
                            onClick={() => setDialog('note')}
                            disabled={busy}
                        >
                            {tr(S.staffNote, locale)}
                        </button>
                        {canCancel && next.includes('cancelled') && (
                            <button
                                type="button"
                                className="cms-btn-secondary"
                                onClick={() => setDialog('cancel')}
                                disabled={busy}
                            >
                                {tr(S.cancelBooking, locale)}
                            </button>
                        )}
                        {canChangeStatus && next.includes('no_show') && (
                            <button
                                type="button"
                                className="cms-btn-secondary"
                                onClick={() => runStatus('no_show')}
                                disabled={busy}
                                aria-busy={busy}
                            >
                                {tr(S.markNoShow, locale)}
                            </button>
                        )}
                        {canChangeStatus && next.includes('confirmed') && (
                            <button
                                type="button"
                                className="cms-btn-primary"
                                onClick={() => runStatus('confirmed')}
                                disabled={busy}
                                aria-busy={busy}
                            >
                                {tr(S.doConfirm, locale)}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Hộp thoại nhận/trả phòng render NGAY TRONG tab, không phải lớp
                nổi chồng lên drawer: `Modal` có `open` nên truyền `open` cứng
                và bỏ nút đóng của nó đi là được form phẳng trong tab. */}
            {tab === 'check-in' && (
                <CheckInDialog
                    open
                    inline
                    onClose={() => setTab('overview')}
                    units={freeUnits.map((u) => ({ id: u.id, code: u.code }))}
                    defaultGuests={booking.guests}
                    onSubmit={(record) => {
                        const result = doCheckIn(booking.id, record, actor)
                        setError(result)
                        if (!result) setTab('overview')
                    }}
                />
            )}

            {tab === 'check-out' && (
                <CheckOutDialog
                    open
                    inline
                    onClose={() => setTab('overview')}
                    booking={booking}
                    onSubmit={(record) => {
                        const result = doCheckOut(booking.id, record, actor)
                        setError(result)
                        if (!result) {
                            setTab('overview')
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
            )}

            {tab === 'history' && (
                <Card title={tr(S.bookingTimeline, locale)}>
                    <ol
                        style={{
                            listStyle: 'none',
                            margin: 0,
                            padding: 0,
                            display: 'grid',
                            gap: 'var(--space-4)',
                        }}
                    >
                        {timeline.map((log) => (
                            <li key={log.id} style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                <span
                                    aria-hidden="true"
                                    style={{
                                        width: 8,
                                        height: 8,
                                        marginTop: 6,
                                        borderRadius: '50%',
                                        background: 'var(--cms-accent)',
                                        flexShrink: 0,
                                    }}
                                />
                                <div
                                    style={{
                                        fontSize: 'var(--cms-text-body)',
                                        minWidth: 0,
                                        overflowWrap: 'anywhere',
                                    }}
                                >
                                    <div>
                                        {log.action}
                                        {log.from && log.to ? `: ${log.from} → ${log.to}` : ''}
                                    </div>
                                    {log.note && (
                                        <div
                                            style={{
                                                color: 'var(--cms-text-muted)',
                                                fontSize: 'var(--cms-text-meta)',
                                            }}
                                        >
                                            {log.note}
                                        </div>
                                    )}
                                    <div
                                        style={{
                                            color: 'var(--cms-text-muted)',
                                            fontSize: 'var(--cms-text-meta)',
                                        }}
                                    >
                                        {new Date(log.at).toLocaleString(tr(S.localeCode, locale))} ·{' '}
                                        {log.actorName} ({log.actorRole})
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ol>
                </Card>
            )}

            {/* Huỷ đơn và ghi chú vẫn là hộp thoại nổi: chúng là hành động dứt
                điểm cần chặn mọi thứ khác lại, không phải nội dung để xem.
                `Modal` ở bậc z-100, nằm TRÊN drawer (z-60) — đúng thứ tự. */}
            <CancelDialog
                open={dialog === 'cancel'}
                onClose={() => setDialog('none')}
                refund={quoteRefund(booking, plan?.cancellationRules ?? [], todayKey())}
                onSubmit={(reason) => {
                    const result = cancelBooking(booking.id, 'admin', actor, reason)
                    setError(result)
                    // Huỷ xong thì đơn đóng hẳn: đóng luôn drawer để lễ tân quay
                    // về bảng thay vì phải tự bấm ✕.
                    if (!result) {
                        setDialog('none')
                        onRequestClose()
                    }
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
        </>
    )
}

export interface UseOrderDrawerOptions {
    /** Mở hồ sơ khách từ trong đơn — chỉ truyền ở màn có chỗ hiển thị hồ sơ. */
    onOpenCustomer?: (customerId: string) => void
}

/**
 * Mở chi tiết một đơn trong drawer phải bằng một lệnh gọi.
 *
 *     const { openOrder } = useOrderDrawer()
 *     <button onClick={() => openOrder(row.id)}>…</button>
 */
export function useOrderDrawer({ onOpenCustomer }: UseOrderDrawerOptions = {}) {
    const { show } = useDrawerRight()
    const { locale } = useLocale()

    const openOrder = useCallback(
        (bookingId: string) => {
            // Tiêu đề/dòng phụ được tính MỘT LẦN tại thời điểm mở, nên phải đọc
            // store bằng `getState()` — hook `useBookingStore(selector)` chỉ gọi
            // được ở thân component, không gọi được trong callback này.
            const booking = useBookingStore
                .getState()
                .bookings.find((b) => b.id === bookingId || b.code === bookingId)

            // Con trỏ gián tiếp: `children` cần hàm đóng, mà hàm đóng chỉ có sau
            // khi `show()` trả về. Bọc trong một ô chứa (thay vì biến `let`) để
            // hàm bên trong đọc được giá trị gán sau. Render xảy ra SAU lệnh gán
            // nên lúc bấm nút ô này chắc chắn đã có giá trị.
            const layer: { close?: () => void } = {}

            const closeThis = show({
                title: booking?.code ?? tr(S.panelNotFound, locale),
                subtitle: booking ? (
                    <>
                        <span>{booking.guest.fullName}</span>
                        <Badge tone={STATUS_TONE[booking.status]}>
                            {tr(STATUS_LABEL[booking.status], locale)}
                        </Badge>
                    </>
                ) : undefined,
                isHeader: true,
                // Không có chân trang: các nút hành động phụ thuộc trạng thái đơn
                // và tab đang mở, nên chúng sống trong nội dung (xem ghi chú ở
                // hàng hành động của tab Tổng quan).
                isFooter: false,
                contentClassname: 'sm:!max-w-[560px]',
                children: (
                    <OrderDetailView
                        bookingId={bookingId}
                        onRequestClose={() => layer.close?.()}
                        onOpenCustomer={onOpenCustomer}
                    />
                ),
            })

            layer.close = closeThis
            return closeThis
        },
        [show, locale, onOpenCustomer],
    )

    return { openOrder }
}
