'use client'

/**
 * Bảng hôm nay — màn hình lễ tân mở đầu ca.
 *
 * Bốn câu hỏi phải trả lời được trong ba giây: hôm nay ai đến, ai đi, ai đang
 * ở, và có đơn nào đang chờ mình xử lý không.
 */

import { useMemo } from 'react'
import Link from 'next/link'
import { formatPrice, getPropertySync, inventoryKey, pick } from '@repo/core'
import type { Booking } from '@repo/core'
import { Badge, DataTable, StatCard } from '@repo/ui'
import type { Column } from '@repo/ui'
import { useLocale } from '@/components/LocaleProvider'
import { useBookingStore } from '@/stores/booking.store'
import { todayKey } from '@/stores/demo-data'
import { S, STATUS_LABEL, STATUS_TONE, tr } from '@/strings'

export default function AdminDashboard() {
    const { locale } = useLocale()
    const bookings = useBookingStore((s) => s.bookings)
    const inventory = useBookingStore((s) => s.inventory)
    const today = todayKey()
    const property = getPropertySync()

    const stats = useMemo(() => {
        const arrivals = bookings.filter(
            (b) => b.checkIn === today && (b.status === 'confirmed' || b.status === 'checked_in'),
        )
        const departures = bookings.filter(
            (b) => b.checkOut === today && (b.status === 'checked_in' || b.status === 'checked_out'),
        )
        const inHouse = bookings.filter((b) => b.status === 'checked_in')
        const pending = bookings.filter((b) => b.status === 'pending_payment')

        // Công suất hôm nay: tổng phòng đã bán / tổng phòng mở bán.
        let total = 0
        let booked = 0
        for (const room of property.rooms) {
            const inv = inventory[inventoryKey(room.id, today)]
            if (!inv) continue
            total += inv.totalUnits - inv.blockedUnits
            booked += inv.bookedUnits
        }
        const occupancy = total > 0 ? Math.round((booked / total) * 100) : 0

        // Doanh thu: chỉ tính đơn đã hoàn thành trong 30 ngày qua — đơn đang ở
        // chưa chắc thành tiền, cộng vào sẽ thổi phồng con số.
        const since = new Date(Date.parse(`${today}T00:00:00Z`) - 30 * 86_400_000)
            .toISOString()
            .slice(0, 10)
        const revenue = bookings
            .filter((b) => b.status === 'checked_out' && b.checkOut >= since)
            .reduce((sum, b) => sum + b.totalAmount, 0)

        return { arrivals, departures, inHouse, pending, occupancy, revenue }
    }, [bookings, inventory, today, property.rooms])

    return (
        <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
            <header>
                <h1
                    style={{
                        margin: 0,
                        fontSize: 'var(--text-2xl)',
                        fontFamily: 'var(--font-display)',
                    }}
                >
                    {tr(S.dashboard, locale)}
                </h1>
                <p
                    style={{
                        margin: 'var(--space-2) 0 0',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-muted)',
                    }}
                >
                    {new Date().toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                    })}
                </p>
            </header>

            <div
                style={{
                    display: 'grid',
                    gap: 'var(--space-4)',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                }}
            >
                <StatCard label={tr(S.arrivals, locale)} value={stats.arrivals.length} />
                <StatCard label={tr(S.departures, locale)} value={stats.departures.length} />
                <StatCard
                    label={tr(S.inHouse, locale)}
                    value={stats.inHouse.length}
                    tone="success"
                />
                <StatCard
                    label={tr(S.occupancy, locale)}
                    value={`${stats.occupancy}%`}
                    tone={stats.occupancy >= 85 ? 'warning' : 'default'}
                    note={
                        stats.occupancy >= 85
                            ? locale === 'vi'
                                ? 'Gần kín — cân nhắc nâng giá'
                                : 'Nearly full — consider raising rates'
                            : undefined
                    }
                />
                <StatCard
                    label={tr(S.pendingReview, locale)}
                    value={stats.pending.length}
                    tone={stats.pending.length > 0 ? 'warning' : 'default'}
                />
                <StatCard
                    label={`${tr(S.revenue, locale)} · 30d`}
                    value={formatPrice(stats.revenue, locale)}
                />
            </div>

            <Panel
                title={tr(S.arrivals, locale)}
                action={
                    <Link
                        href="/admin/orders"
                        style={{
                            fontSize: 'var(--text-sm)',
                            color: 'var(--brand)',
                            textDecoration: 'none',
                        }}
                    >
                        {tr(S.orders, locale)} →
                    </Link>
                }
            >
                <BookingMiniTable
                    rows={stats.arrivals}
                    empty={
                        locale === 'vi'
                            ? 'Hôm nay không có khách đến.'
                            : 'No arrivals scheduled today.'
                    }
                />
            </Panel>

            <Panel title={tr(S.departures, locale)}>
                <BookingMiniTable
                    rows={stats.departures}
                    empty={
                        locale === 'vi'
                            ? 'Hôm nay không có khách trả phòng.'
                            : 'No departures scheduled today.'
                    }
                />
            </Panel>

            {stats.pending.length > 0 && (
                <Panel title={tr(S.pendingReview, locale)}>
                    <BookingMiniTable rows={stats.pending} empty="" />
                </Panel>
            )}
        </div>
    )
}

function Panel({
    title,
    action,
    children,
}: {
    title: string
    action?: React.ReactNode
    children: React.ReactNode
}) {
    return (
        <section
            style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    padding: 'var(--space-4) var(--space-5)',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--space-4)',
                }}
            >
                <h2 style={{ margin: 0, fontSize: 'var(--text-base)', fontFamily: 'var(--font-display)' }}>
                    {title}
                </h2>
                {action}
            </div>
            {children}
        </section>
    )
}

function BookingMiniTable({ rows, empty }: { rows: Booking[]; empty: string }) {
    const { locale } = useLocale()
    const property = getPropertySync()

    const columns: Column<Booking>[] = [
        {
            key: 'guest',
            header: locale === 'vi' ? 'Khách' : 'Guest',
            cell: (b) => (
                <div>
                    <div style={{ fontWeight: 600 }}>{b.guest.fullName}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                        {b.code} · {b.guest.phone}
                    </div>
                </div>
            ),
        },
        {
            key: 'room',
            header: locale === 'vi' ? 'Hạng phòng' : 'Room type',
            cell: (b) => {
                const room = property.rooms.find((r) => r.id === b.roomTypeId)
                return room ? pick(room.name, locale) : b.roomTypeId
            },
        },
        {
            key: 'arrival',
            header: tr(S.arrivalTime, locale),
            cell: (b) => b.guest.estimatedArrivalTime ?? '—',
        },
        {
            key: 'status',
            header: locale === 'vi' ? 'Trạng thái' : 'Status',
            cell: (b) => (
                <Badge tone={STATUS_TONE[b.status]}>{tr(STATUS_LABEL[b.status], locale)}</Badge>
            ),
        },
        {
            key: 'action',
            header: '',
            align: 'right',
            inCard: false,
            cell: (b) => (
                <Link
                    href={`/admin/orders/${b.id}`}
                    style={{ color: 'var(--brand)', fontSize: 'var(--text-sm)' }}
                    aria-label={`${tr(S.view, locale)} ${b.code}`}
                >
                    {tr(S.view, locale)}
                </Link>
            ),
        },
    ]

    return (
        <DataTable
            caption={empty || 'bookings'}
            columns={columns}
            rows={rows}
            rowKey={(b) => b.id}
            empty={empty}
        />
    )
}
