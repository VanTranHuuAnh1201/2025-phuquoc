'use client'

/**
 * Đơn của tôi — ba tab: sắp tới · đã ở · đã huỷ.
 *
 * Dùng đúng format bảng ở `.claude/rules/app-flows.md` §F6, giống hệt bảng đơn
 * hàng bên CMS — cùng một cách đọc thông tin cho cả khách lẫn nhân viên.
 */

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatPrice, getPropertySync, pick } from '@repo/core'
import type { Booking } from '@repo/core'
import { Badge, Button, DataTable } from '@repo/ui'
import type { Column } from '@repo/ui'
import { LocaleProvider, useLocale } from '@/components/LocaleProvider'
import { AccountBar } from '@/components/AccountBar'
import { useAuthStore } from '@/stores/auth.store'
import { useBookingStore } from '@/stores/booking.store'
import { todayKey } from '@/stores/demo-data'
import { S, STATUS_LABEL, STATUS_TONE, tr } from '@/strings'

type Tab = 'upcoming' | 'past' | 'cancelled'

export default function MyOrdersPage() {
    return (
        <LocaleProvider>
            <MyOrdersScreen />
        </LocaleProvider>
    )
}

function MyOrdersScreen() {
    const { locale } = useLocale()
    const router = useRouter()
    const user = useAuthStore((s) => s.user)
    const bookings = useBookingStore((s) => s.bookings)

    const [tab, setTab] = useState<Tab>('upcoming')
    /** Chờ zustand nạp xong localStorage rồi mới quyết định có chặn hay không. */
    const [hydrated, setHydrated] = useState(false)

    useEffect(() => setHydrated(true), [])

    useEffect(() => {
        if (hydrated && !user) router.replace('/login?next=/my-orders')
    }, [hydrated, user, router])

    const mine = useMemo(() => {
        if (!user) return []
        const today = todayKey()
        return bookings
            .filter((b) => b.customerId === user.id)
            .filter((b) => {
                if (tab === 'cancelled') {
                    return b.status === 'cancelled' || b.status === 'no_show' || b.status === 'expired'
                }
                if (tab === 'past') return b.status === 'checked_out' || b.checkOut < today
                return b.checkOut >= today && b.status !== 'cancelled'
            })
            .sort((a, b) => b.checkIn.localeCompare(a.checkIn))
    }, [bookings, user, tab])

    if (!hydrated || !user) return null

    const tabs: { id: Tab; label: string }[] = [
        { id: 'upcoming', label: tr(S.tabUpcoming, locale) },
        { id: 'past', label: tr(S.tabPast, locale) },
        { id: 'cancelled', label: tr(S.tabCancelled, locale) },
    ]

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
                        maxWidth: 1100,
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
                            letterSpacing: '0.02em',
                        }}
                    >
                        THE NAM DU HILL
                    </Link>
                    <AccountBar />
                </div>
            </header>

            <main
                style={{
                    maxWidth: 1100,
                    margin: '0 auto',
                    padding: 'var(--space-8) var(--space-5) var(--space-20)',
                }}
            >
                <h1
                    style={{
                        margin: '0 0 var(--space-2)',
                        fontSize: 'var(--text-2xl)',
                        fontFamily: 'var(--font-display)',
                    }}
                >
                    {tr(S.myOrders, locale)}
                </h1>
                <p style={{ margin: '0 0 var(--space-6)', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                    {mine.length} {tr(S.bookingsCountSuffix, locale)}
                </p>

                <div
                    role="tablist"
                    style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}
                >
                    {tabs.map((item) => (
                        <button
                            key={item.id}
                            role="tab"
                            aria-selected={tab === item.id}
                            onClick={() => setTab(item.id)}
                            style={{
                                padding: 'var(--space-3) var(--space-5)',
                                fontSize: 'var(--text-sm)',
                                fontFamily: 'var(--font-body)',
                                fontWeight: tab === item.id ? 600 : 400,
                                color: tab === item.id ? 'var(--text-inverse)' : 'var(--text)',
                                background: tab === item.id ? 'var(--brand)' : 'var(--surface)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-pill)',
                                cursor: 'pointer',
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                <div
                    style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        overflow: 'hidden',
                    }}
                >
                    <BookingTable rows={mine} onOpen={(b) => router.push(`/my-orders/${b.id}`)} />
                </div>
            </main>
        </div>
    )
}

function BookingTable({
    rows,
    onOpen,
}: {
    rows: Booking[]
    onOpen: (booking: Booking) => void
}) {
    const { locale } = useLocale()
    const property = getPropertySync()

    const roomName = (id: string) => {
        const room = property.rooms.find((r) => r.id === id)
        return room ? pick(room.name, locale) : id
    }

    const columns: Column<Booking>[] = [
        {
            key: 'code',
            header: tr(S.bookingCode, locale),
            cell: (b) => (
                <div>
                    <div style={{ fontWeight: 600 }}>{b.code}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                        {new Date(b.createdAt).toLocaleDateString(
                            tr(S.localeCode, locale),
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: 'room',
            header: tr(S.roomType, locale),
            cell: (b) => (
                <div>
                    <div>{roomName(b.roomTypeId)}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                        {b.nights} {tr(S.nights, locale)} · {b.guests.adults + b.guests.children.length}{' '}
                        {tr(S.guests, locale)}
                    </div>
                </div>
            ),
        },
        {
            key: 'dates',
            header: `${tr(S.checkIn, locale)} – ${tr(S.checkOut, locale)}`,
            cell: (b) => (
                <span style={{ whiteSpace: 'nowrap' }}>
                    {b.checkIn} → {b.checkOut}
                </span>
            ),
        },
        {
            key: 'total',
            header: tr(S.totalAmount, locale),
            align: 'right',
            cell: (b) => (
                <div>
                    <div style={{ fontWeight: 600 }}>{formatPrice(b.totalAmount, locale)}</div>
                    {b.paidAmount < b.totalAmount && (
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                            {tr(S.due, locale)}{' '}
                            {formatPrice(b.totalAmount - b.paidAmount, locale)}
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'status',
            header: tr(S.status, locale),
            cell: (b) => (
                <Badge tone={STATUS_TONE[b.status]}>{tr(STATUS_LABEL[b.status], locale)}</Badge>
            ),
        },
        {
            key: 'actions',
            header: '',
            align: 'right',
            inCard: false,
            cell: (b) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={(event) => {
                        event.stopPropagation()
                        onOpen(b)
                    }}
                    aria-label={`${tr(S.view, locale)} ${b.code}`}
                >
                    {tr(S.view, locale)}
                </Button>
            ),
        },
    ]

    return (
        <DataTable
            caption={tr(S.myOrders, locale)}
            columns={columns}
            rows={rows}
            rowKey={(b) => b.id}
            onRowClick={onOpen}
            empty={tr(S.noBookings, locale)}
        />
    )
}
