'use client'

/**
 * Chi tiết một đơn của khách.
 *
 * Nút huỷ hiện RÕ số tiền được hoàn trước khi bấm — không để khách bấm rồi mới
 * biết mất tiền (xem `.claude/rules/booking-domain.md` §B5).
 */

import { use, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    formatPrice,
    getPropertySync,
    pick,
    quoteRefund,
    ratePlans,
} from '@repo/core'
import type { ActivityLog, Booking } from '@repo/core'
import { Badge, Button, Modal, TextAreaField } from '@repo/ui'
import { LocaleProvider, useLocale } from '@/components/LocaleProvider'
import { AccountBar } from '@/components/AccountBar'
import { useAuthStore } from '@/stores/auth.store'
import { useBookingStore } from '@/stores/booking.store'
import { useNotifyStore } from '@/stores/notify.store'
import { todayKey } from '@/stores/demo-data'
import { S, STATUS_LABEL, STATUS_TONE, tr } from '@/strings'

export default function BookingDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = use(params)
    return (
        <LocaleProvider>
            <DetailScreen bookingId={id} />
        </LocaleProvider>
    )
}

function DetailScreen({ bookingId }: { bookingId: string }) {
    const { locale } = useLocale()
    const router = useRouter()
    const user = useAuthStore((s) => s.user)
    const booking = useBookingStore((s) => s.bookings.find((b) => b.id === bookingId))
    const logs = useBookingStore((s) => s.logs)
    const cancelBooking = useBookingStore((s) => s.cancelBooking)
    const pushNotification = useNotifyStore((s) => s.push)

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [reason, setReason] = useState('')

    const property = getPropertySync()
    const room = booking ? property.rooms.find((r) => r.id === booking.roomTypeId) : undefined
    const plan = booking ? ratePlans.find((p) => p.id === booking.ratePlanId) : undefined

    const timeline = useMemo(
        () =>
            logs
                .filter((l) => l.bookingId === bookingId)
                .sort((a, b) => a.at.localeCompare(b.at)),
        [logs, bookingId],
    )

    const refund = useMemo(
        () =>
            booking ? quoteRefund(booking, plan?.cancellationRules ?? [], todayKey()) : null,
        [booking, plan],
    )

    if (!booking) {
        return (
            <Shell>
                <p style={{ color: 'var(--text-muted)' }}>
                    {tr(S.bookingNotFound, locale)}
                </p>
                <Link href="/my-orders" style={{ color: 'var(--brand)' }}>
                    ← {tr(S.myOrders, locale)}
                </Link>
            </Shell>
        )
    }

    const canCancel =
        booking.status === 'confirmed' || booking.status === 'pending_payment'

    const doCancel = () => {
        const error = cancelBooking(booking.id, 'customer', {
            id: user?.id ?? 'guest',
            name: user?.fullName || booking.guest.fullName,
            role: 'customer',
        }, reason || undefined)

        if (!error && user) {
            pushNotification({
                accountId: user.id,
                kind: 'booking-cancelled',
                bookingId: booking.id,
                bookingCode: booking.code,
                payload: {
                    roomTypeName: room?.name,
                    nights: booking.nights,
                    amount: refund?.amount ?? 0,
                },
            })
        }
        setConfirmOpen(false)
    }

    return (
        <Shell>
            <Link
                href="/my-orders"
                style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                }}
            >
                ← {tr(S.myOrders, locale)}
            </Link>

            <header
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 'var(--space-4)',
                    flexWrap: 'wrap',
                    margin: 'var(--space-4) 0 var(--space-6)',
                }}
            >
                <div>
                    <h1
                        style={{
                            margin: 0,
                            fontSize: 'var(--text-2xl)',
                            fontFamily: 'var(--font-display)',
                        }}
                    >
                        {booking.code}
                    </h1>
                    <p
                        style={{
                            margin: 'var(--space-2) 0 0',
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-muted)',
                        }}
                    >
                        {room ? pick(room.name, locale) : booking.roomTypeId} · {booking.checkIn} →{' '}
                        {booking.checkOut}
                    </p>
                </div>
                <Badge tone={STATUS_TONE[booking.status]}>
                    {tr(STATUS_LABEL[booking.status], locale)}
                </Badge>
            </header>

            <div className="detail-grid" style={{ display: 'grid', gap: 'var(--space-5)' }}>
                <Card title={tr(S.priceSummary, locale)}>
                    <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                        {booking.priceLines.map((line, i) => (
                            <Row
                                key={i}
                                label={lineLabel(line, locale)}
                                value={formatPrice(line.total, locale)}
                            />
                        ))}
                        <hr style={{ border: 0, borderTop: '1px solid var(--border)' }} />
                        <Row
                            label={tr(S.subtotal, locale)}
                            value={formatPrice(booking.subtotal, locale)}
                            muted
                        />
                        {booking.appliedPromotions.map((promo) => (
                            <Row
                                key={promo.promotionId}
                                label={pick(promo.name, locale)}
                                value={`−${formatPrice(promo.discount, locale)}`}
                                tone="success"
                            />
                        ))}
                        <hr style={{ border: 0, borderTop: '1px solid var(--border)' }} />
                        <Row
                            label={tr(S.totalAmount, locale)}
                            value={formatPrice(booking.totalAmount, locale)}
                            strong
                        />
                        <Row
                            label={tr(S.paidStatus, locale)}
                            value={formatPrice(booking.paidAmount, locale)}
                            tone="info"
                        />
                        {booking.paidAmount < booking.totalAmount && (
                            <Row
                                label={tr(S.balanceDue, locale)}
                                value={formatPrice(booking.totalAmount - booking.paidAmount, locale)}
                                muted
                            />
                        )}
                    </div>
                </Card>

                <Card title={tr(S.guestInfo, locale)}>
                    <dl style={{ display: 'grid', gap: 'var(--space-3)', margin: 0 }}>
                        <Row label={tr(S.fullName, locale)} value={booking.guest.fullName} />
                        <Row label={tr(S.phone, locale)} value={booking.guest.phone} />
                        {booking.guest.email && (
                            <Row label={tr(S.email, locale)} value={booking.guest.email} />
                        )}
                        {booking.guest.estimatedArrivalTime && (
                            <Row
                                label={tr(S.arrivalTime, locale)}
                                value={booking.guest.estimatedArrivalTime}
                            />
                        )}
                        {booking.guest.specialRequests && (
                            <Row
                                label={tr(S.specialRequests, locale)}
                                value={booking.guest.specialRequests}
                            />
                        )}
                    </dl>
                </Card>

                <Card title={tr(S.bookingTimeline, locale)}>
                    <Timeline logs={timeline} />
                </Card>

                {booking.cancellation && (
                    <Card title={tr(S.tabCancelled, locale)}>
                        <dl style={{ display: 'grid', gap: 'var(--space-3)', margin: 0 }}>
                            <Row
                                label={tr(S.cancelledAtLabel, locale)}
                                value={new Date(booking.cancellation.at).toLocaleString(
                                    tr(S.localeCode, locale),
                                )}
                            />
                            {booking.cancellation.reason && (
                                <Row
                                    label={tr(S.reasonLabel, locale)}
                                    value={booking.cancellation.reason}
                                />
                            )}
                            <Row
                                label={tr(S.refundAmount, locale)}
                                value={formatPrice(booking.cancellation.refundAmount, locale)}
                                tone="success"
                            />
                        </dl>
                    </Card>
                )}
            </div>

            <div
                style={{
                    display: 'flex',
                    gap: 'var(--space-3)',
                    marginTop: 'var(--space-6)',
                    flexWrap: 'wrap',
                }}
            >
                {canCancel && (
                    <Button variant="secondary" onClick={() => setConfirmOpen(true)}>
                        {tr(S.cancelBooking, locale)}
                    </Button>
                )}
                <Button variant="ghost" onClick={() => router.push('/booking')}>
                    {tr(S.bookAgain, locale)}
                </Button>
            </div>

            <Modal
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                title={tr(S.cancelConfirmTitle, locale)}
                description={`${booking.code} · ${room ? pick(room.name, locale) : ''}`}
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
                            {tr(S.close, locale)}
                        </Button>
                        <Button onClick={doCancel}>{tr(S.cancelBooking, locale)}</Button>
                    </>
                }
            >
                <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
                    {refund && (
                        <div
                            style={{
                                padding: 'var(--space-4)',
                                background:
                                    refund.percent > 0 ? 'var(--success-bg)' : 'var(--warning-bg)',
                                color: refund.percent > 0 ? 'var(--success)' : 'var(--warning)',
                                borderRadius: 'var(--radius)',
                                fontSize: 'var(--text-sm)',
                            }}
                        >
                            <strong>
                                {tr(S.refundAmount, locale)}: {formatPrice(refund.amount, locale)} (
                                {refund.percent}%)
                            </strong>
                            <div style={{ marginTop: 4, fontSize: 'var(--text-xs)' }}>
                                {pick(
                                    {
                                        vi: `Còn ${refund.daysUntilCheckIn} ngày tới ngày nhận phòng.`,
                                        en: `${refund.daysUntilCheckIn} days until check-in.`,
                                    },
                                    locale,
                                )}
                            </div>
                        </div>
                    )}
                    <TextAreaField
                        label={tr(S.cancelReasonLabel, locale)}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        hint={tr(S.optional, locale)}
                    />
                </div>
            </Modal>

            <style>{`
                @media (min-width: 860px) {
                    .detail-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                }
            `}</style>
        </Shell>
    )
}

// ================================================================== khung

function Shell({ children }: { children: React.ReactNode }) {
    return (
        <div
            data-theme="h1"
            style={{
                minHeight: '100vh',
                background: 'var(--surface-alt)',
                fontFamily: 'var(--font-body)',
                color: 'var(--text)',
            }}
        >
            <header
                style={{
                    background: 'var(--surface)',
                    borderBottom: '1px solid var(--border)',
                    padding: 'var(--space-4) var(--space-5)',
                }}
            >
                <div
                    style={{
                        maxWidth: 900,
                        margin: '0 auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 'var(--space-4)',
                    }}
                >
                    <Link
                        href="/h1"
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 700,
                            color: 'var(--brand)',
                            textDecoration: 'none',
                        }}
                    >
                        THE NAM DU HILL
                    </Link>
                    <AccountBar />
                </div>
            </header>
            <main
                style={{
                    maxWidth: 900,
                    margin: '0 auto',
                    padding: 'var(--space-8) var(--space-5) var(--space-20)',
                }}
            >
                {children}
            </main>
        </div>
    )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
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
                fontSize: strong ? 'var(--text-lg)' : 'var(--text-sm)',
                fontWeight: strong ? 700 : 400,
                color,
            }}
        >
            <span style={{ color: strong ? color : 'var(--text-muted)' }}>{label}</span>
            <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
        </div>
    )
}

function Timeline({ logs }: { logs: ActivityLog[] }) {
    const { locale } = useLocale()

    if (logs.length === 0) {
        return (
            <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                {tr(S.noActivityYet, locale)}
            </p>
        )
    }

    return (
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--space-4)' }}>
            {logs.map((log) => (
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
                    <div style={{ fontSize: 'var(--text-sm)' }}>
                        <div>
                            {log.action === 'status-changed' && log.to
                                ? `${log.from ?? ''} → ${log.to}`
                                : log.action}
                        </div>
                        {log.note && (
                            <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
                                {log.note}
                            </div>
                        )}
                        <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
                            {new Date(log.at).toLocaleString(tr(S.localeCode, locale))} ·{' '}
                            {log.actorName}
                        </div>
                    </div>
                </li>
            ))}
        </ol>
    )
}

function lineLabel(line: Booking['priceLines'][number], locale: 'vi' | 'en'): string {
    const property = getPropertySync()
    if (line.label) return pick(line.label, locale)
    switch (line.kind) {
        case 'room': {
            const room = property.rooms.find((r) => r.id === line.refId)
            return room ? pick(room.name, locale) : tr(S.roomCharge, locale)
        }
        case 'extra-bed':
            return tr(S.extraBed, locale)
        case 'child':
            return tr(S.childCharge, locale)
        case 'addon': {
            const addon = property.addons.find((a) => a.id === line.refId)
            return addon ? pick(addon.name, locale) : line.refId
        }
        default:
            return line.refId
    }
}
