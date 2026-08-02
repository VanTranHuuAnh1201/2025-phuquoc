'use client'

/**
 * Danh sách đơn hàng — bảng chính của CMS.
 *
 * Theo đúng format ở `.claude/rules/app-flows.md` §F6: tiêu đề + đếm, ô tìm,
 * bộ lọc có nút Đặt lại, badge có chữ, phân trang, trạng thái rỗng nói rõ việc
 * cần làm.
 */

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatPrice, getPropertySync, pick } from '@repo/core'
import type { Booking, BookingStatus } from '@repo/core'
import { Badge, DataTable, FilterSelect, Toolbar } from '@repo/ui'
import type { Column } from '@repo/ui'
import { useLocale } from '@/components/LocaleProvider'
import { useBookingStore } from '@/stores/booking.store'
import { S, STATUS_LABEL, STATUS_TONE, tr } from '@/strings'
import { EyeIcon } from '@/components/icons'

const PAGE_SIZE = 10

const STATUSES: BookingStatus[] = [
    'pending_payment',
    'confirmed',
    'checked_in',
    'checked_out',
    'cancelled',
    'no_show',
]

export default function AdminOrdersPage() {
    const { locale } = useLocale()
    const router = useRouter()
    const bookings = useBookingStore((s) => s.bookings)
    const property = getPropertySync()

    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('')
    const [roomType, setRoomType] = useState('')
    const [page, setPage] = useState(1)

    const isFiltered = Boolean(search || status || roomType)

    const filtered = useMemo(() => {
        const needle = search.trim().toLowerCase()
        return bookings
            .filter((b) => {
                if (status && b.status !== status) return false
                if (roomType && b.roomTypeId !== roomType) return false
                if (!needle) return true
                return (
                    b.code.toLowerCase().includes(needle) ||
                    b.guest.fullName.toLowerCase().includes(needle) ||
                    b.guest.phone.includes(needle)
                )
            })
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    }, [bookings, search, status, roomType])

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const safePage = Math.min(page, totalPages)
    const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

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
                        {new Date(b.createdAt).toLocaleString(
                            locale === 'vi' ? 'vi-VN' : 'en-US',
                            { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' },
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: 'guest',
            header: locale === 'vi' ? 'Khách hàng' : 'Guest',
            cell: (b) => (
                <div>
                    <div>{b.guest.fullName}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                        {b.guest.phone}
                    </div>
                </div>
            ),
        },
        {
            key: 'room',
            header: locale === 'vi' ? 'Hạng phòng' : 'Room type',
            cell: (b) => (
                <div>
                    <div>{roomName(b.roomTypeId)}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                        {b.nights} {tr(S.nights, locale)} ·{' '}
                        {b.guests.adults + b.guests.children.length} {tr(S.guests, locale)}
                    </div>
                </div>
            ),
        },
        {
            key: 'dates',
            header: `${tr(S.checkIn, locale)} – ${tr(S.checkOut, locale)}`,
            cell: (b) => (
                <span style={{ whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                    {b.checkIn.slice(5)} → {b.checkOut.slice(5)}
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
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--warning)' }}>
                            {locale === 'vi' ? 'còn' : 'due'}{' '}
                            {formatPrice(b.totalAmount - b.paidAmount, locale)}
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'status',
            header: locale === 'vi' ? 'Trạng thái' : 'Status',
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
                <Link
                    href={`/admin/orders/${b.id}`}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`${tr(S.view, locale)} ${b.code}`}
                    style={{
                        display: 'inline-grid',
                        placeItems: 'center',
                        width: 28,
                        height: 28,
                        color: 'var(--text-muted)',
                    }}
                >
                    <EyeIcon size={16} />
                </Link>
            ),
        },
    ]

    return (
        <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
            <header>
                <h1
                    style={{
                        margin: 0,
                        fontSize: 'var(--text-2xl)',
                        fontFamily: 'var(--font-display)',
                    }}
                >
                    {tr(S.orders, locale)}
                </h1>
                <p
                    style={{
                        margin: 'var(--space-2) 0 0',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-muted)',
                    }}
                >
                    {filtered.length} {locale === 'vi' ? 'đơn' : 'bookings'}
                    {isFiltered &&
                        ` / ${bookings.length} ${locale === 'vi' ? 'tổng' : 'total'}`}
                </p>
            </header>

            <div
                style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                }}
            >
                <Toolbar
                    searchValue={search}
                    onSearchChange={(value) => {
                        setSearch(value)
                        setPage(1)
                    }}
                    searchPlaceholder={
                        locale === 'vi'
                            ? 'Tìm mã đơn, tên khách, số điện thoại…'
                            : 'Search code, guest name, phone…'
                    }
                    isFiltered={isFiltered}
                    onReset={() => {
                        setSearch('')
                        setStatus('')
                        setRoomType('')
                        setPage(1)
                    }}
                    resetLabel={tr(S.reset, locale)}
                >
                    <FilterSelect
                        label={locale === 'vi' ? 'Trạng thái' : 'Status'}
                        value={status}
                        onChange={(value) => {
                            setStatus(value)
                            setPage(1)
                        }}
                        options={[
                            {
                                value: '',
                                label: `${tr(S.all, locale)} ${locale === 'vi' ? 'trạng thái' : 'statuses'}`,
                            },
                            ...STATUSES.map((s) => ({
                                value: s,
                                label: tr(STATUS_LABEL[s], locale),
                            })),
                        ]}
                    />
                    <FilterSelect
                        label={locale === 'vi' ? 'Hạng phòng' : 'Room type'}
                        value={roomType}
                        onChange={(value) => {
                            setRoomType(value)
                            setPage(1)
                        }}
                        options={[
                            {
                                value: '',
                                label: `${tr(S.all, locale)} ${locale === 'vi' ? 'hạng phòng' : 'room types'}`,
                            },
                            ...property.rooms.map((r) => ({
                                value: r.id,
                                label: pick(r.name, locale),
                            })),
                        ]}
                    />
                </Toolbar>

                <DataTable
                    caption={tr(S.orders, locale)}
                    columns={columns}
                    rows={pageRows}
                    rowKey={(b) => b.id}
                    onRowClick={(b) => router.push(`/admin/orders/${b.id}`)}
                    empty={
                        isFiltered
                            ? locale === 'vi'
                                ? 'Không có đơn nào khớp bộ lọc. Bấm "Đặt lại" để xem tất cả.'
                                : 'No bookings match these filters. Click "Reset" to see all.'
                            : locale === 'vi'
                              ? 'Chưa có đơn nào.'
                              : 'No bookings yet.'
                    }
                />

                {filtered.length > 0 && (
                    <div
                        style={{
                            padding: 'var(--space-4)',
                            borderTop: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 'var(--space-4)',
                            flexWrap: 'wrap',
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-muted)',
                        }}
                    >
                        <span>
                            {locale === 'vi' ? 'Hiển thị' : 'Showing'}{' '}
                            <strong style={{ color: 'var(--text)' }}>
                                {(safePage - 1) * PAGE_SIZE + 1}–
                                {Math.min(safePage * PAGE_SIZE, filtered.length)}
                            </strong>{' '}
                            {locale === 'vi' ? 'trong' : 'of'}{' '}
                            <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong>
                        </span>

                        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                            <PageButton
                                disabled={safePage === 1}
                                onClick={() => setPage(safePage - 1)}
                            >
                                ← {locale === 'vi' ? 'Trước' : 'Prev'}
                            </PageButton>
                            <span style={{ padding: '0 var(--space-2)' }}>
                                {safePage} / {totalPages}
                            </span>
                            <PageButton
                                disabled={safePage === totalPages}
                                onClick={() => setPage(safePage + 1)}
                            >
                                {locale === 'vi' ? 'Sau' : 'Next'} →
                            </PageButton>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function PageButton({
    disabled,
    onClick,
    children,
}: {
    disabled: boolean
    onClick: () => void
    children: React.ReactNode
}) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            style={{
                padding: 'var(--space-2) var(--space-3)',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-body)',
                color: disabled ? 'var(--text-muted)' : 'var(--text)',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
                minHeight: 28,
            }}
        >
            {children}
        </button>
    )
}
