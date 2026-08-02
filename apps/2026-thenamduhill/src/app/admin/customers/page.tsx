'use client'

/**
 * Hồ sơ khách — gộp theo số điện thoại.
 *
 * Giá trị thật của màn này là cột "Đã ở" và "Tổng chi tiêu": lễ tân nhìn thấy
 * ngay ai là khách quen để đối xử khác đi.
 */

import { useMemo, useState } from 'react'
import { formatPrice } from '@repo/core'
import type { Customer } from '@repo/core'
import { DataTable, StatCard, Toolbar } from '@repo/ui'
import type { Column } from '@repo/ui'
import { useLocale } from '@/components/LocaleProvider'
import { useBookingStore } from '@/stores/booking.store'
import { S, tr } from '@/strings'

export default function CustomersPage() {
    const { locale } = useLocale()
    const customers = useBookingStore((s) => s.customers)
    const bookings = useBookingStore((s) => s.bookings)

    const [search, setSearch] = useState('')

    const rows = useMemo(() => {
        const needle = search.trim().toLowerCase()
        return customers
            .filter(
                (c) =>
                    !needle ||
                    c.fullName.toLowerCase().includes(needle) ||
                    c.phone.includes(needle) ||
                    c.email.toLowerCase().includes(needle),
            )
            .sort((a, b) => b.totalSpent - a.totalSpent)
    }, [customers, search])

    const returning = customers.filter((c) => c.stayCount > 1).length
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)

    const bookingCount = (customerId: string) =>
        bookings.filter((b) => b.customerId === customerId).length

    const columns: Column<Customer>[] = [
        {
            key: 'name',
            header: locale === 'vi' ? 'Khách hàng' : 'Guest',
            cell: (c) => (
                <div>
                    <div style={{ fontWeight: 600 }}>{c.fullName}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                        {c.phone}
                    </div>
                </div>
            ),
        },
        { key: 'email', header: tr(S.email, locale), cell: (c) => c.email || '—' },
        {
            key: 'bookings',
            header: tr(S.orders, locale),
            align: 'right',
            cell: (c) => bookingCount(c.id),
        },
        {
            key: 'stays',
            header: locale === 'vi' ? 'Đã ở' : 'Stays',
            align: 'right',
            cell: (c) => c.stayCount,
        },
        {
            key: 'spent',
            header: locale === 'vi' ? 'Tổng chi tiêu' : 'Total spent',
            align: 'right',
            cell: (c) => <strong>{formatPrice(c.totalSpent, locale)}</strong>,
        },
    ]

    return (
        <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
            <header>
                <h1 style={{ margin: 0, fontSize: 'var(--text-2xl)', fontFamily: 'var(--font-display)' }}>
                    {tr(S.customers, locale)}
                </h1>
                <p style={{ margin: 'var(--space-2) 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                    {rows.length} {locale === 'vi' ? 'khách' : 'guests'}
                </p>
            </header>

            <div
                style={{
                    display: 'grid',
                    gap: 'var(--space-4)',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                }}
            >
                <StatCard label={locale === 'vi' ? 'Tổng khách' : 'Total guests'} value={customers.length} />
                <StatCard
                    label={locale === 'vi' ? 'Khách quay lại' : 'Returning guests'}
                    value={returning}
                    tone="success"
                    note={
                        customers.length > 0
                            ? `${Math.round((returning / customers.length) * 100)}%`
                            : undefined
                    }
                />
                <StatCard
                    label={locale === 'vi' ? 'Doanh thu tích luỹ' : 'Lifetime revenue'}
                    value={formatPrice(totalRevenue, locale)}
                />
            </div>

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
                    onSearchChange={setSearch}
                    searchPlaceholder={
                        locale === 'vi' ? 'Tìm tên, số điện thoại, email…' : 'Search name, phone, email…'
                    }
                    isFiltered={Boolean(search)}
                    onReset={() => setSearch('')}
                    resetLabel={tr(S.reset, locale)}
                />
                <DataTable
                    caption={tr(S.customers, locale)}
                    columns={columns}
                    rows={rows}
                    rowKey={(c) => c.id}
                    empty={
                        search
                            ? locale === 'vi'
                                ? 'Không tìm thấy khách nào.'
                                : 'No guests found.'
                            : locale === 'vi'
                              ? 'Chưa có khách hàng nào.'
                              : 'No guests yet.'
                    }
                />
            </div>
        </div>
    )
}
