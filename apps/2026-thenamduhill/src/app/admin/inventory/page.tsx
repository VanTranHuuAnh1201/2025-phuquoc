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

import { useEffect, useMemo, useState } from 'react'
import {
    addDays,
    availableUnits,
    calculateNightlyPrice,
    formatPrice,

    inventoryKey,
    isWeekend,
    pick,
    seasons,
} from '@repo/core'
import type { Inventory } from '@repo/core'
import { Button, CheckField, Field, Modal } from '@repo/ui'
import { useLocale } from '@/components/LocaleProvider'
import { RequirePermission, useCan } from '@/components/RequirePermission'
import { useBookingStore } from '@/stores/booking.store'
import { useBookingsData } from '@/hooks/useAdminData'
import { useRoomTypes } from '@/stores/useCatalog'
import { todayKey } from '@/stores/demo-data'
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'
import { S, tr } from '@/strings'

/** Khoảng ngày hiển thị — bộ chọn, KHÔNG hard-code (§6.8 mục 1, AC-13). */
type RangeLength = 14 | 30

export default function InventoryPage() {
    return (
        // Lễ tân VÀO ĐƯỢC lịch tồn kho (AC-8) — khác với bốn màn dữ liệu nền.
        <RequirePermission anyOf={['inventory.view']}>
            <InventoryScreen />
        </RequirePermission>
    )
}

function InventoryScreen() {
    const { locale } = useLocale()
    const { inventory } = useBookingsData()
    const updateInventory = useBookingStore((s) => s.updateInventory)

    const rooms = useRoomTypes()
    const canEditPrice = useCan('price.edit')

    const [offset, setOffset] = useState(0)
    const [rangeLength, setRangeLength] = useState<RangeLength>(14)
    const [editing, setEditing] = useState<{ roomTypeId: string; date: string } | null>(null)
    const [error, setError] = useState<string | null>(null)

    const startDate = addDays(todayKey(), offset)
    const dates = useMemo(
        () => Array.from({ length: rangeLength }, (_, i) => addDays(startDate, i)),
        [startDate, rangeLength],
    )

    const current = editing ? inventory[inventoryKey(editing.roomTypeId, editing.date)] : undefined

    return (
        <div className="flex-1 flex flex-col min-h-0 space-y-3 overflow-hidden p-3 bg-slate-100">
            {/* High-density Unified Top Header Bar */}
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2 shrink-0">
                    <h1 className="text-base font-bold text-slate-900 tracking-tight">
                        {tr(S.inventoryCalendar, locale)}
                    </h1>
                    <span className="text-xs text-slate-500 hidden sm:inline">
                        {pick(
                            {
                                vi: 'Bấm ô để sửa giá, đóng bán hoặc đêm tối thiểu.',
                                en: 'Click cell to adjust price or restrictions.',
                            },
                            locale,
                        )}
                    </span>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {/* Bộ chọn 14 / 30 ngày — AC-13 */}
                    <select
                        value={rangeLength}
                        onChange={(e) => setRangeLength(Number(e.target.value) as RangeLength)}
                        aria-label={tr(S.dateRangeLabel, locale)}
                        className="h-8 px-2 text-xs font-medium bg-slate-100 border border-slate-300 rounded-md text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-600"
                    >
                        <option value={14}>{tr(S.days14, locale)}</option>
                        <option value={30}>{tr(S.days30, locale)}</option>
                    </select>

                    <div className="flex items-center bg-slate-100 border border-slate-300 rounded-md p-0.5">
                        <button
                            type="button"
                            onClick={() => setOffset(offset - rangeLength)}
                            className="p-1 min-w-[24px] min-h-[24px] flex items-center justify-center hover:bg-white rounded transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-600"
                            aria-label={tr(S.previousRange, locale)}
                        >
                            <ChevronLeftIcon size={16} />
                        </button>
                        <span className="text-xs font-semibold px-2 text-slate-800 tabular-nums">
                            {dates[0]} → {dates[dates.length - 1]}
                        </span>
                        <button
                            type="button"
                            onClick={() => setOffset(offset + rangeLength)}
                            className="p-1 min-w-[24px] min-h-[24px] flex items-center justify-center hover:bg-white rounded transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-600"
                            aria-label={tr(S.nextRange, locale)}
                        >
                            <ChevronRightIcon size={16} />
                        </button>
                    </div>

                    {offset !== 0 && (
                        <button
                            type="button"
                            onClick={() => setOffset(0)}
                            className="h-8 px-2.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                        >
                            {tr(S.todayLabel, locale)}
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div
                    role="alert"
                    className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-md text-xs font-medium shrink-0"
                >
                    {error === 'version-conflict' ? tr(S.versionConflict, locale) : error}
                </div>
            )}

            {/* Matrix Table Container - Maximized Full Height */}
            <div className="w-full flex-1 min-h-0 bg-white rounded-lg border border-slate-200 shadow-sm overflow-auto">

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
                                {tr(S.roomType, locale)}
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
                                            tr(S.localeCode, locale),
                                            { weekday: 'short', timeZone: 'UTC' },
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map((room) => (
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
                                                {/* Màu KÈM CHỮ — bật grayscale(1) vẫn phân
                                                    biệt được ô hết phòng (luật D4, AC-14). */}
                                                {free === 0 && (
                                                    <span
                                                        style={{
                                                            fontSize: 9,
                                                            fontWeight: 700,
                                                            color: 'var(--danger)',
                                                        }}
                                                    >
                                                        {tr(S.soldOutShort, locale)}
                                                    </span>
                                                )}
                                                {free > 0 && free <= 2 && (
                                                    <span
                                                        style={{
                                                            fontSize: 9,
                                                            fontWeight: 700,
                                                            color: 'var(--warning)',
                                                        }}
                                                    >
                                                        {tr(S.lowStockShort, locale)}
                                                    </span>
                                                )}
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
                    canEditPrice={canEditPrice}
                    roomName={pick(
                        rooms.find((r) => r.id === editing.roomTypeId)?.name ?? {
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
        { color: 'var(--danger-bg)', label: tr(S.soldOutShort, locale) },
        { color: 'var(--warning-bg)', label: pick({ vi: 'Sắp hết (≤2)', en: 'Low (≤2)' }, locale) },
        {
            color: 'transparent',
            border: 'var(--brand)',
            label: pick({ vi: 'Đã đè giá', en: 'Price overridden' }, locale),
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
            <span>CTA = {pick({ vi: 'cấm nhận phòng', en: 'closed to arrival' }, locale)}</span>
            <span>≥N = {pick({ vi: 'số đêm tối thiểu', en: 'minimum nights' }, locale)}</span>
        </div>
    )
}

function EditCellDialog({
    inv,
    roomName,
    canEditPrice,
    onClose,
    onSave,
}: {
    inv: Inventory
    roomName: string
    /** Lễ tân chỉ ĐỌC giá (AC-8) — ô giá render thành `<span>`, không phải
     *  `<button disabled>`: target chết vẫn nằm trong luồng Tab (§6.11). */
    canEditPrice: boolean
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
                                // Lễ tân không gửi giá lên — không sửa được thì
                                // cũng không được vô tình xoá giá đè đang có.
                                ...(canEditPrice
                                    ? { priceOverride: override ? Number(override) : undefined }
                                    : {}),
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
                    <Stat label={tr(S.bookedLabel, locale)} value={inv.bookedUnits} />
                    <Stat
                        label={tr(S.availableUnits, locale)}
                        value={inv.totalUnits - inv.bookedUnits - inv.blockedUnits}
                    />
                </div>

                {canEditPrice ? (
                    <Field
                        label={tr(S.priceOverride, locale)}
                        type="number"
                        min={0}
                        step={50000}
                        value={override}
                        onChange={(e) => setOverride(e.target.value)}
                        hint={tr(S.priceOverrideHint, locale)}
                        placeholder={
                            pick(
                                {
                                    vi: 'Để trống = dùng giá theo mùa',
                                    en: 'Blank = use seasonal price',
                                },
                                locale,
                            )
                        }
                    />
                ) : (
                    <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                            {tr(S.priceOverride, locale)}
                        </span>
                        <span
                            style={{
                                fontSize: 'var(--text-sm)',
                                fontVariantNumeric: 'tabular-nums',
                                color: 'var(--text)',
                            }}
                        >
                            {override
                                ? formatPrice(Number(override), locale)
                                : pick({ vi: 'Dùng giá theo mùa', en: 'Seasonal price' }, locale)}
                        </span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                            {tr(S.priceReadOnly, locale)}
                        </span>
                    </div>
                )}

                <Field
                    label={tr(S.blockedUnits, locale)}
                    type="number"
                    min={0}
                    max={maxBlocked}
                    value={blocked}
                    onChange={(e) => setBlocked(Number(e.target.value) || 0)}
                    hint={pick(
                        {
                            vi: `Phòng đóng để bảo trì hoặc giữ riêng. Tối đa ${maxBlocked} (số phòng chưa bán).`,
                            en: `Rooms held back for maintenance. Maximum ${maxBlocked} (unsold rooms).`,
                        },
                        locale,
                    )}
                />

                <Field
                    label={tr(S.minNights, locale)}
                    type="number"
                    min={1}
                    value={minNights}
                    onChange={(e) => setMinNights(e.target.value)}
                    hint={pick(
                        {
                            vi: 'Khách nhận phòng ngày này phải ở ít nhất bấy nhiêu đêm. Hay dùng dịp lễ.',
                            en: 'Guests arriving on this date must stay at least this many nights. Common on holidays.',
                        },
                        locale,
                    )}
                />

                <CheckField
                    label={tr(S.closedToArrival, locale)}
                    checked={cta}
                    onChange={(e) => setCta(e.target.checked)}
                    hint={pick(
                        {
                            vi: 'Không cho nhận phòng ngày này. Khách đang ở vẫn ở tiếp bình thường.',
                            en: 'No new arrivals on this date. Guests already staying are unaffected.',
                        },
                        locale,
                    )}
                />

                <CheckField
                    label={tr(S.closedToDeparture, locale)}
                    checked={ctd}
                    onChange={(e) => setCtd(e.target.checked)}
                    hint={pick(
                        {
                            vi: 'Không cho trả phòng ngày này.',
                            en: 'No departures allowed on this date.',
                        },
                        locale,
                    )}
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
