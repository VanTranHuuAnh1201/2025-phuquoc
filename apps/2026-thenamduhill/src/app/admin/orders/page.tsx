'use client'

/**
 * Danh sách đơn hàng — bảng chính của CMS.
 *
 * Theo đúng format ở `.claude/rules/app-flows.md` §F6: tiêu đề + đếm, ô tìm,
 * bộ lọc có nút Đặt lại, chọn nhiều, badge có chữ, phân trang, trạng thái rỗng
 * nói rõ việc cần làm.
 *
 * Dưới 640px `DataTable` tự đổi bảng sang thẻ — không bọc `overflow-x` quanh
 * bảng ở đây, đó chính là thứ AC-7 cấm.
 */

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { can, formatPrice, getPropertySync, pick } from '@repo/core'
import type { Booking, BookingStatus, Channel } from '@repo/core'
import { Badge, Button, DataTable, FilterSelect, Toolbar } from '@repo/ui'
import type { Column } from '@repo/ui'
import { useLocale } from '@/components/LocaleProvider'
import { useAuthStore } from '@/stores/auth.store'
import { useBookingStore } from '@/stores/booking.store'
import { CHANNEL_LABEL, S, STATUS_LABEL, STATUS_TONE, tr } from '@/strings'
import { DownloadIcon, EyeIcon, PlusIcon } from '@/components/icons'

const PAGE_SIZE = 10

const STATUSES: BookingStatus[] = [
    'pending_payment',
    'confirmed',
    'checked_in',
    'checked_out',
    'cancelled',
    'no_show',
]

const CHANNELS: Channel[] = ['web', 'phone', 'walk-in', 'ota']

export default function AdminOrdersPage() {
    const { locale } = useLocale()
    const router = useRouter()
    const bookings = useBookingStore((s) => s.bookings)
    const user = useAuthStore((s) => s.user)
    const property = getPropertySync()

    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('')
    const [roomType, setRoomType] = useState('')
    const [channel, setChannel] = useState('')
    const [page, setPage] = useState(1)
    const [selected, setSelected] = useState<string[]>([])

    const isFiltered = Boolean(search || status || roomType || channel)

    const filtered = useMemo(() => {
        const needle = search.trim().toLowerCase()
        return bookings
            .filter((b) => {
                if (status && b.status !== status) return false
                if (roomType && b.roomTypeId !== roomType) return false
                if (channel && b.channel !== channel) return false
                if (!needle) return true
                return (
                    b.code.toLowerCase().includes(needle) ||
                    b.guest.fullName.toLowerCase().includes(needle) ||
                    b.guest.phone.includes(needle)
                )
            })
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    }, [bookings, search, status, roomType, channel])

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const safePage = Math.min(page, totalPages)
    const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

    const resetFilters = () => {
        setSearch('')
        setStatus('')
        setRoomType('')
        setChannel('')
        setPage(1)
    }

    // Ẩn nút KHÔNG phải bảo mật — chỉ để lễ tân đỡ bấm nhầm vào thứ sẽ bị từ
    // chối. Chặn thật nằm ở Route Handler (000-03) và RLS (000-02); bản GD1
    // chạy trên store nên chưa có lớp đó, `200-06` trả nợ này.
    const canCreate = user ? can(user.role, 'booking.create') : false
    const canViewAll = user ? can(user.role, 'booking.view.all') : false

    const roomName = (id: string) => {
        const room = property.rooms.find((r) => r.id === id)
        return room ? pick(room.name, locale) : id
    }

    // ---- xuất Excel: CSV mở được bằng Excel, không kéo thêm thư viện ----
    const exportCsv = () => {
        const rows = selected.length
            ? filtered.filter((b) => selected.includes(b.id))
            : filtered
        const header = [
            tr(S.bookingCode, locale),
            tr(S.fullName, locale),
            tr(S.phone, locale),
            tr(S.roomTypeLabel, locale),
            tr(S.checkIn, locale),
            tr(S.checkOut, locale),
            tr(S.totalAmount, locale),
            tr(S.channel, locale),
        ]
        const body = rows.map((b) => [
            b.code,
            b.guest.fullName,
            b.guest.phone,
            roomName(b.roomTypeId),
            b.checkIn,
            b.checkOut,
            String(b.totalAmount),
            tr(CHANNEL_LABEL[b.channel], locale),
        ])
        const csv = [header, ...body]
            .map((line) => line.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
            .join('\r\n')
        // BOM để Excel đọc đúng dấu tiếng Việt.
        const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`
        link.click()
        URL.revokeObjectURL(url)
    }

    if (user && !canViewAll) {
        return (
            <p role="alert" style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                {locale === 'vi'
                    ? 'Tài khoản của bạn không có quyền xem đơn hàng.'
                    : 'Your account cannot view bookings.'}
            </p>
        )
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
                        {' · '}
                        {tr(CHANNEL_LABEL[b.channel], locale)}
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
            header: tr(S.roomTypeLabel, locale),
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
                    aria-label={`${tr(S.view, locale)} ${locale === 'vi' ? 'đơn' : 'booking'} ${b.code}`}
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
            <header
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 'var(--space-4)',
                    flexWrap: 'wrap',
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
                </div>

                {canCreate && (
                    <Button onClick={() => router.push('/admin/orders/new')}>
                        <span
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 'var(--space-2)',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <PlusIcon size={16} />
                            {tr(S.newBooking, locale)}
                        </span>
                    </Button>
                )}
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
                    onReset={resetFilters}
                    resetLabel={tr(S.reset, locale)}
                    actions={
                        <Button variant="secondary" size="sm" onClick={exportCsv}>
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-2)',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                <DownloadIcon size={14} />
                                {tr(S.exportExcel, locale)}
                            </span>
                        </Button>
                    }
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
                        label={tr(S.roomTypeLabel, locale)}
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
                    <FilterSelect
                        label={tr(S.channel, locale)}
                        value={channel}
                        onChange={(value) => {
                            setChannel(value)
                            setPage(1)
                        }}
                        options={[
                            {
                                value: '',
                                label: `${tr(S.all, locale)} ${locale === 'vi' ? 'kênh' : 'channels'}`,
                            },
                            ...CHANNELS.map((c) => ({
                                value: c,
                                label: tr(CHANNEL_LABEL[c], locale),
                            })),
                        ]}
                    />
                </Toolbar>

                {selected.length > 0 && (
                    <div
                        role="status"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-3)',
                            flexWrap: 'wrap',
                            padding: 'var(--space-3) var(--space-4)',
                            background: 'var(--surface-tint)',
                            borderBottom: '1px solid var(--border)',
                            fontSize: 'var(--text-sm)',
                        }}
                    >
                        <strong>
                            {selected.length} {tr(S.selectedCount, locale)}
                        </strong>
                        <Button variant="ghost" size="sm" onClick={() => setSelected([])}>
                            {tr(S.clearSelection, locale)}
                        </Button>
                    </div>
                )}

                <DataTable
                    caption={tr(S.orders, locale)}
                    columns={columns}
                    rows={pageRows}
                    rowKey={(b) => b.id}
                    onRowClick={(b) => router.push(`/admin/orders/${b.id}`)}
                    selectable
                    selectedKeys={selected}
                    onSelectionChange={setSelected}
                    selectAllLabel={tr(S.selectAllRows, locale)}
                    rowLabel={(b) =>
                        `${locale === 'vi' ? 'Chọn đơn' : 'Select booking'} ${b.code}`
                    }
                    renderCard={(b) => (
                        <>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 'var(--space-3)',
                                }}
                            >
                                <strong style={{ fontSize: 'var(--text-sm)' }}>{b.code}</strong>
                                <Badge tone={STATUS_TONE[b.status]}>
                                    {tr(STATUS_LABEL[b.status], locale)}
                                </Badge>
                            </div>
                            <div style={{ fontSize: 'var(--text-sm)' }}>
                                {b.guest.fullName} · {b.guest.phone}
                            </div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                                {roomName(b.roomTypeId)} · {b.checkIn.slice(5)} →{' '}
                                {b.checkOut.slice(5)} · {b.nights} {tr(S.nights, locale)}
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 'var(--space-3)',
                                    marginTop: 'var(--space-2)',
                                }}
                            >
                                <span
                                    style={{
                                        fontWeight: 600,
                                        fontVariantNumeric: 'tabular-nums',
                                    }}
                                >
                                    {formatPrice(b.totalAmount, locale)}
                                </span>
                                <Link
                                    href={`/admin/orders/${b.id}`}
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label={`${tr(S.view, locale)} ${locale === 'vi' ? 'đơn' : 'booking'} ${b.code}`}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-2)',
                                        minHeight: 44,
                                        padding: '0 var(--space-3)',
                                        fontSize: 'var(--text-sm)',
                                        color: 'var(--brand)',
                                        textDecoration: 'none',
                                    }}
                                >
                                    <EyeIcon size={16} />
                                    {tr(S.view, locale)}
                                </Link>
                            </div>
                        </>
                    )}
                    empty={
                        isFiltered ? (
                            <div style={{ display: 'grid', gap: 'var(--space-4)', justifyItems: 'center' }}>
                                <span>
                                    {locale === 'vi'
                                        ? 'Chưa có đơn nào khớp bộ lọc. Bấm "Đặt lại" để xem tất cả.'
                                        : 'No bookings match these filters. Click "Reset" to see all.'}
                                </span>
                                <Button variant="secondary" size="sm" onClick={resetFilters}>
                                    {tr(S.reset, locale)}
                                </Button>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: 'var(--space-4)', justifyItems: 'center' }}>
                                <span>
                                    {locale === 'vi'
                                        ? 'Chưa có đơn nào. Bấm "Tạo đơn thủ công" để nhập đơn đầu tiên.'
                                        : 'No bookings yet. Click "New booking" to enter the first one.'}
                                </span>
                                {canCreate && (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => router.push('/admin/orders/new')}
                                    >
                                        {tr(S.newBooking, locale)}
                                    </Button>
                                )}
                            </div>
                        )
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
                            <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong>{' '}
                            {locale === 'vi' ? 'đơn' : 'bookings'}
                        </span>

                        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                            <PageButton
                                disabled={safePage === 1}
                                onClick={() => setPage(safePage - 1)}
                                label={locale === 'vi' ? 'Trang trước' : 'Previous page'}
                            >
                                ← {locale === 'vi' ? 'Trước' : 'Prev'}
                            </PageButton>
                            <span style={{ padding: '0 var(--space-2)' }}>
                                {safePage} / {totalPages}
                            </span>
                            <PageButton
                                disabled={safePage === totalPages}
                                onClick={() => setPage(safePage + 1)}
                                label={locale === 'vi' ? 'Trang sau' : 'Next page'}
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
    label,
    children,
}: {
    disabled: boolean
    onClick: () => void
    label: string
    children: React.ReactNode
}) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            aria-label={label}
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
                minHeight: 32,
            }}
        >
            {children}
        </button>
    )
}
