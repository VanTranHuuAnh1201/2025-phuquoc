'use client'

/**
 * Lịch tồn kho & giá — màn hình lễ tân nhìn cả ngày.
 *
 * Click một ô để sửa giá, đóng bán, đặt số đêm tối thiểu ngay tại chỗ. Đây là
 * "giao diện calendar cho phép nhập thủ công, bật/tắt riêng" mà khách yêu cầu.
 *
 * Ghi có `version` — hai lễ tân sửa cùng ô trên hai thiết bị thì người sau bị
 * từ chối chứ không âm thầm đè lên (xem `.claude/rules/booking-domain.md` §B7).
 */

import { useMemo, useState } from 'react'
import {
    addDays,
    availableUnits,
    calculateNightlyPrice,
    formatPrice,
    getPropertySync,
    inventoryKey,
    isWeekend,
    pick,
    seasons,
} from '@repo/core'
import type { Inventory } from '@repo/core'
import { Button, CheckField, Field, Modal } from '@repo/ui'
import { useLocale } from '@/components/LocaleProvider'
import { useBookingStore } from '@/stores/booking.store'
import { todayKey } from '@/stores/demo-data'
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'
import { S, tr } from '@/strings'

const DAYS_VISIBLE = 14

export default function InventoryPage() {
    const { locale } = useLocale()
    const inventory = useBookingStore((s) => s.inventory)
    const updateInventory = useBookingStore((s) => s.updateInventory)
    const property = getPropertySync()

    const [offset, setOffset] = useState(0)
    const [editing, setEditing] = useState<{ roomTypeId: string; date: string } | null>(null)
    const [error, setError] = useState<string | null>(null)

    const startDate = addDays(todayKey(), offset)
    const dates = useMemo(
        () => Array.from({ length: DAYS_VISIBLE }, (_, i) => addDays(startDate, i)),
        [startDate],
    )

    const current = editing ? inventory[inventoryKey(editing.roomTypeId, editing.date)] : undefined

    return (
        <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
            <header
                style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    gap: 'var(--space-4)',
                    flexWrap: 'wrap',
                }}
            >
                <div>
                    <h1 style={{ margin: 0, fontSize: 'var(--text-2xl)', fontFamily: 'var(--font-display)' }}>
                        {tr(S.inventoryCalendar, locale)}
                    </h1>
                    <p style={{ margin: 'var(--space-2) 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                        {locale === 'vi'
                            ? 'Bấm vào một ô để sửa giá, đóng bán hoặc đặt số đêm tối thiểu.'
                            : 'Click a cell to change price, close sales, or set a minimum stay.'}
                    </p>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setOffset(offset - DAYS_VISIBLE)}
                        aria-label={locale === 'vi' ? 'Hai tuần trước' : 'Previous two weeks'}
                    >
                        <ChevronLeftIcon size={16} />
                    </Button>
                    <span style={{ fontSize: 'var(--text-sm)', minWidth: 150, textAlign: 'center' }}>
                        {dates[0]} → {dates[dates.length - 1]}
                    </span>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setOffset(offset + DAYS_VISIBLE)}
                        aria-label={locale === 'vi' ? 'Hai tuần sau' : 'Next two weeks'}
                    >
                        <ChevronRightIcon size={16} />
                    </Button>
                    {offset !== 0 && (
                        <Button variant="ghost" size="sm" onClick={() => setOffset(0)}>
                            {locale === 'vi' ? 'Hôm nay' : 'Today'}
                        </Button>
                    )}
                </div>
            </header>

            {error && (
                <div
                    role="alert"
                    style={{
                        padding: 'var(--space-4)',
                        background: 'var(--danger-bg)',
                        color: 'var(--danger)',
                        borderRadius: 'var(--radius)',
                        fontSize: 'var(--text-sm)',
                    }}
                >
                    {error === 'version-conflict' ? tr(S.versionConflict, locale) : error}
                </div>
            )}

            <div
                style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    overflowX: 'auto',
                }}
            >
                <table style={{ borderCollapse: 'collapse', minWidth: 900 }}>
                    <caption
                        style={{
                            position: 'absolute',
                            width: 1,
                            height: 1,
                            overflow: 'hidden',
                            clip: 'rect(0 0 0 0)',
                        }}
                    >
                        {tr(S.inventoryCalendar, locale)}
                    </caption>
                    <thead>
                        <tr>
                            <th
                                scope="col"
                                style={{
                                    ...headerCell,
                                    position: 'sticky',
                                    left: 0,
                                    background: 'var(--surface-alt)',
                                    zIndex: 2,
                                    minWidth: 160,
                                    textAlign: 'left',
                                }}
                            >
                                {locale === 'vi' ? 'Hạng phòng' : 'Room type'}
                            </th>
                            {dates.map((date) => (
                                <th
                                    key={date}
                                    scope="col"
                                    style={{
                                        ...headerCell,
                                        background: isWeekend(date)
                                            ? 'var(--surface-tint)'
                                            : 'var(--surface-alt)',
                                        minWidth: 64,
                                    }}
                                >
                                    <div>{date.slice(8)}/{date.slice(5, 7)}</div>
                                    <div style={{ fontWeight: 400, opacity: 0.7 }}>
                                        {new Date(`${date}T00:00:00Z`).toLocaleDateString(
                                            locale === 'vi' ? 'vi-VN' : 'en-US',
                                            { weekday: 'short', timeZone: 'UTC' },
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {property.rooms.map((room) => (
                            <tr key={room.id}>
                                <th
                                    scope="row"
                                    style={{
                                        ...bodyCell,
                                        position: 'sticky',
                                        left: 0,
                                        background: 'var(--surface)',
                                        zIndex: 1,
                                        textAlign: 'left',
                                        fontWeight: 600,
                                        fontSize: 'var(--text-sm)',
                                    }}
                                >
                                    {pick(room.name, locale)}
                                    <div
                                        style={{
                                            fontWeight: 400,
                                            fontSize: 'var(--text-xs)',
                                            color: 'var(--text-muted)',
                                        }}
                                    >
                                        {formatPrice(room.price, locale)}
                                        {tr(S.perNight, locale)}
                                    </div>
                                </th>

                                {dates.map((date) => {
                                    const inv = inventory[inventoryKey(room.id, date)]
                                    const free = inv ? availableUnits(inv) : 0
                                    const price = calculateNightlyPrice({
                                        date,
                                        basePrice: room.price,
                                        seasons,
                                        inventory: inv,
                                    })

                                    const tone =
                                        free === 0
                                            ? { bg: 'var(--danger-bg)', fg: 'var(--danger)' }
                                            : free <= 2
                                              ? { bg: 'var(--warning-bg)', fg: 'var(--warning)' }
                                              : { bg: 'transparent', fg: 'var(--text)' }

                                    return (
                                        <td key={date} style={{ ...bodyCell, padding: 2 }}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setError(null)
                                                    setEditing({ roomTypeId: room.id, date })
                                                }}
                                                aria-label={`${pick(room.name, locale)} ${date}: ${free}/${inv?.totalUnits ?? 0}`}
                                                style={{
                                                    width: '100%',
                                                    padding: 'var(--space-2)',
                                                    display: 'grid',
                                                    gap: 2,
                                                    background: tone.bg,
                                                    border: `1px solid ${
                                                        inv?.priceOverride !== undefined
                                                            ? 'var(--brand)'
                                                            : 'transparent'
                                                    }`,
                                                    borderRadius: 'var(--radius-sm)',
                                                    cursor: 'pointer',
                                                    fontFamily: 'var(--font-body)',
                                                    color: tone.fg,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontSize: 'var(--text-xs)',
                                                        fontWeight: 700,
                                                        fontVariantNumeric: 'tabular-nums',
                                                    }}
                                                >
                                                    {free}/{inv?.totalUnits ?? 0}
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: 10,
                                                        color: 'var(--text-muted)',
                                                        fontVariantNumeric: 'tabular-nums',
                                                    }}
                                                >
                                                    {Math.round(price / 1000)}k
                                                </span>
                                                {inv?.closedToArrival && (
                                                    <span style={{ fontSize: 9, color: 'var(--danger)' }}>
                                                        CTA
                                                    </span>
                                                )}
                                                {inv?.minNights && (
                                                    <span style={{ fontSize: 9, color: 'var(--info)' }}>
                                                        ≥{inv.minNights}
                                                    </span>
                                                )}
                                            </button>
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Legend />

            {editing && current && (
                <EditCellDialog
                    inv={current}
                    roomName={pick(
                        property.rooms.find((r) => r.id === editing.roomTypeId)?.name ?? {
                            vi: '',
                            en: '',
                        },
                        locale,
                    )}
                    onClose={() => setEditing(null)}
                    onSave={(patch) => {
                        const result = updateInventory(
                            editing.roomTypeId,
                            editing.date,
                            patch,
                            current.version,
                        )
                        setError(result)
                        if (!result) setEditing(null)
                    }}
                />
            )}
        </div>
    )
}

function Legend() {
    const { locale } = useLocale()
    const items = [
        { color: 'var(--danger-bg)', label: locale === 'vi' ? 'Hết phòng' : 'Sold out' },
        { color: 'var(--warning-bg)', label: locale === 'vi' ? 'Sắp hết (≤2)' : 'Low (≤2)' },
        {
            color: 'transparent',
            border: 'var(--brand)',
            label: locale === 'vi' ? 'Đã đè giá' : 'Price overridden',
        },
    ]
    return (
        <div
            style={{
                display: 'flex',
                gap: 'var(--space-5)',
                flexWrap: 'wrap',
                fontSize: 'var(--text-xs)',
                color: 'var(--text-muted)',
            }}
        >
            {items.map((item) => (
                <span key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span
                        aria-hidden="true"
                        style={{
                            width: 14,
                            height: 14,
                            background: item.color,
                            border: `1px solid ${item.border ?? 'var(--border)'}`,
                            borderRadius: 3,
                        }}
                    />
                    {item.label}
                </span>
            ))}
            <span>CTA = {locale === 'vi' ? 'cấm nhận phòng' : 'closed to arrival'}</span>
            <span>≥N = {locale === 'vi' ? 'số đêm tối thiểu' : 'minimum nights'}</span>
        </div>
    )
}

function EditCellDialog({
    inv,
    roomName,
    onClose,
    onSave,
}: {
    inv: Inventory
    roomName: string
    onClose: () => void
    onSave: (patch: Partial<Omit<Inventory, 'date' | 'roomTypeId' | 'version'>>) => void
}) {
    const { locale } = useLocale()

    const [override, setOverride] = useState(inv.priceOverride?.toString() ?? '')
    const [blocked, setBlocked] = useState(inv.blockedUnits)
    const [minNights, setMinNights] = useState(inv.minNights?.toString() ?? '')
    const [cta, setCta] = useState(Boolean(inv.closedToArrival))
    const [ctd, setCtd] = useState(Boolean(inv.closedToDeparture))

    // Không cho khoá nhiều hơn số phòng chưa bán — sẽ ra tồn kho âm.
    const maxBlocked = inv.totalUnits - inv.bookedUnits

    return (
        <Modal
            open
            onClose={onClose}
            title={`${roomName} · ${inv.date}`}
            description={`${tr(S.availableUnits, locale)}: ${
                inv.totalUnits - inv.bookedUnits - inv.blockedUnits
            } / ${inv.totalUnits}`}
            footer={
                <>
                    <Button variant="ghost" onClick={onClose}>
                        {tr(S.cancel, locale)}
                    </Button>
                    <Button
                        onClick={() =>
                            onSave({
                                priceOverride: override ? Number(override) : undefined,
                                blockedUnits: Math.min(Math.max(0, blocked), maxBlocked),
                                minNights: minNights ? Number(minNights) : undefined,
                                closedToArrival: cta || undefined,
                                closedToDeparture: ctd || undefined,
                            })
                        }
                    >
                        {tr(S.save, locale)}
                    </Button>
                </>
            }
        >
            <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
                <div
                    style={{
                        display: 'grid',
                        gap: 'var(--space-3)',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        fontSize: 'var(--text-sm)',
                    }}
                >
                    <Stat label={tr(S.totalUnits, locale)} value={inv.totalUnits} />
                    <Stat label={locale === 'vi' ? 'Đã bán' : 'Booked'} value={inv.bookedUnits} />
                    <Stat
                        label={tr(S.availableUnits, locale)}
                        value={inv.totalUnits - inv.bookedUnits - inv.blockedUnits}
                    />
                </div>

                <Field
                    label={tr(S.priceOverride, locale)}
                    type="number"
                    min={0}
                    step={50000}
                    value={override}
                    onChange={(e) => setOverride(e.target.value)}
                    hint={tr(S.priceOverrideHint, locale)}
                    placeholder={locale === 'vi' ? 'Để trống = dùng giá theo mùa' : 'Blank = use seasonal price'}
                />

                <Field
                    label={tr(S.blockedUnits, locale)}
                    type="number"
                    min={0}
                    max={maxBlocked}
                    value={blocked}
                    onChange={(e) => setBlocked(Number(e.target.value) || 0)}
                    hint={
                        locale === 'vi'
                            ? `Phòng đóng để bảo trì hoặc giữ riêng. Tối đa ${maxBlocked} (số phòng chưa bán).`
                            : `Rooms held back for maintenance. Maximum ${maxBlocked} (unsold rooms).`
                    }
                />

                <Field
                    label={tr(S.minNights, locale)}
                    type="number"
                    min={1}
                    value={minNights}
                    onChange={(e) => setMinNights(e.target.value)}
                    hint={
                        locale === 'vi'
                            ? 'Khách nhận phòng ngày này phải ở ít nhất bấy nhiêu đêm. Hay dùng dịp lễ.'
                            : 'Guests arriving on this date must stay at least this many nights. Common on holidays.'
                    }
                />

                <CheckField
                    label={tr(S.closedToArrival, locale)}
                    checked={cta}
                    onChange={(e) => setCta(e.target.checked)}
                    hint={
                        locale === 'vi'
                            ? 'Không cho nhận phòng ngày này. Khách đang ở vẫn ở tiếp bình thường.'
                            : 'No new arrivals on this date. Guests already staying are unaffected.'
                    }
                />

                <CheckField
                    label={tr(S.closedToDeparture, locale)}
                    checked={ctd}
                    onChange={(e) => setCtd(e.target.checked)}
                    hint={
                        locale === 'vi'
                            ? 'Không cho trả phòng ngày này.'
                            : 'No departures allowed on this date.'
                    }
                />
            </div>
        </Modal>
    )
}

function Stat({ label, value }: { label: string; value: number }) {
    return (
        <div
            style={{
                padding: 'var(--space-3)',
                background: 'var(--surface-alt)',
                borderRadius: 'var(--radius)',
                textAlign: 'center',
            }}
        >
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{label}</div>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>{value}</div>
        </div>
    )
}

const headerCell: React.CSSProperties = {
    padding: 'var(--space-2)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--text-muted)',
    background: 'var(--surface-alt)',
    borderBottom: '1px solid var(--border)',
    textAlign: 'center',
    whiteSpace: 'nowrap',
}

const bodyCell: React.CSSProperties = {
    padding: 'var(--space-2)',
    borderBottom: '1px solid var(--border)',
    textAlign: 'center',
    verticalAlign: 'middle',
}
