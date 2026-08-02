'use client'

/**
 * Bước 5 — xác nhận đặt phòng thành công.
 *
 * Mã đơn hiện thật to vì đây là thứ khách chụp màn hình và đọc qua điện thoại
 * cho lễ tân. Mọi thứ khác là phụ.
 */

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { formatPrice, getPropertySync, pick } from '@repo/core'
import { Badge, Button } from '@repo/ui'
import { LocaleProvider, useLocale } from '@/components/LocaleProvider'
import { useBookingStore } from '@/stores/booking.store'
import { S, STATUS_LABEL, STATUS_TONE, tr } from '@/strings'

export default function SuccessPage() {
    return (
        <LocaleProvider>
            <Suspense fallback={null}>
                <SuccessScreen />
            </Suspense>
        </LocaleProvider>
    )
}

function SuccessScreen() {
    const { locale } = useLocale()
    const params = useSearchParams()
    const bookingId = params.get('id') ?? ''
    const booking = useBookingStore((s) => s.bookings.find((b) => b.id === bookingId))

    const property = getPropertySync()
    const room = booking ? property.rooms.find((r) => r.id === booking.roomTypeId) : undefined

    return (
        <main
            data-theme="h1"
            style={{
                minHeight: '100vh',
                display: 'grid',
                placeItems: 'center',
                padding: 'var(--space-6)',
                background: 'var(--surface-alt)',
                fontFamily: 'var(--font-body)',
                color: 'var(--text)',
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: 520,
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-8)',
                    textAlign: 'center',
                }}
            >
                {!booking ? (
                    <>
                        <h1 style={{ fontSize: 'var(--text-xl)', margin: 0 }}>
                            {locale === 'vi' ? 'Không tìm thấy đơn' : 'Booking not found'}
                        </h1>
                        <Link href="/my-orders" style={{ color: 'var(--brand)' }}>
                            {tr(S.viewMyOrders, locale)}
                        </Link>
                    </>
                ) : (
                    <>
                        <div
                            aria-hidden="true"
                            style={{
                                width: 56,
                                height: 56,
                                margin: '0 auto var(--space-5)',
                                display: 'grid',
                                placeItems: 'center',
                                borderRadius: '50%',
                                background: 'var(--success-bg)',
                                color: 'var(--success)',
                                fontSize: 28,
                            }}
                        >
                            ✓
                        </div>

                        <h1
                            style={{
                                margin: '0 0 var(--space-2)',
                                fontSize: 'var(--text-2xl)',
                                fontFamily: 'var(--font-display)',
                            }}
                        >
                            {tr(S.bookingSuccess, locale)}
                        </h1>

                        <p
                            style={{
                                margin: '0 0 var(--space-6)',
                                fontSize: 'var(--text-sm)',
                                color: 'var(--text-muted)',
                                lineHeight: 1.6,
                            }}
                        >
                            {tr(S.successNote, locale)}
                        </p>

                        <div
                            style={{
                                padding: 'var(--space-5)',
                                background: 'var(--surface-tint)',
                                borderRadius: 'var(--radius)',
                                marginBottom: 'var(--space-6)',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 'var(--text-xs)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em',
                                    color: 'var(--text-muted)',
                                    marginBottom: 'var(--space-2)',
                                }}
                            >
                                {tr(S.bookingCode, locale)}
                            </div>
                            <div
                                style={{
                                    fontSize: 'var(--text-2xl)',
                                    fontFamily: 'var(--font-display)',
                                    fontWeight: 700,
                                    letterSpacing: '0.04em',
                                    color: 'var(--brand)',
                                }}
                            >
                                {booking.code}
                            </div>
                        </div>

                        <dl
                            style={{
                                display: 'grid',
                                gap: 'var(--space-3)',
                                margin: '0 0 var(--space-6)',
                                textAlign: 'left',
                                fontSize: 'var(--text-sm)',
                            }}
                        >
                            <SummaryRow
                                label={room ? pick(room.name, locale) : booking.roomTypeId}
                                value={
                                    <Badge tone={STATUS_TONE[booking.status]}>
                                        {tr(STATUS_LABEL[booking.status], locale)}
                                    </Badge>
                                }
                            />
                            <SummaryRow
                                label={`${tr(S.checkIn, locale)} → ${tr(S.checkOut, locale)}`}
                                value={`${booking.checkIn} → ${booking.checkOut}`}
                            />
                            <SummaryRow
                                label={tr(S.totalAmount, locale)}
                                value={
                                    <strong>{formatPrice(booking.totalAmount, locale)}</strong>
                                }
                            />
                            <SummaryRow
                                label={tr(S.deposit, locale)}
                                value={formatPrice(booking.paidAmount, locale)}
                            />
                        </dl>

                        <div
                            style={{
                                display: 'flex',
                                gap: 'var(--space-3)',
                                justifyContent: 'center',
                                flexWrap: 'wrap',
                            }}
                        >
                            <Link href={`/my-orders/${booking.id}`} style={{ textDecoration: 'none' }}>
                                <Button size="lg">{tr(S.viewMyOrders, locale)}</Button>
                            </Link>
                            <Link href="/h1" style={{ textDecoration: 'none' }}>
                                <Button variant="secondary" size="lg">
                                    {tr(S.backHome, locale)}
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </main>
    )
}

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 'var(--space-4)',
            }}
        >
            <dt style={{ color: 'var(--text-muted)' }}>{label}</dt>
            <dd style={{ margin: 0, textAlign: 'right' }}>{value}</dd>
        </div>
    )
}
