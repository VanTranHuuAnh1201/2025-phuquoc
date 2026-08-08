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

import { useCallback, useMemo, useState } from 'react'
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
import type { Booking, BookingStatus, Inventory } from '@repo/core'
import { Button, CheckField, Field, Modal } from '@repo/ui'
import { DotBadge, InlineAlert, PageHeaderBar } from '@repo/cms-ui'
import { useLocale } from '@/components/LocaleProvider'
import { RequirePermission, useCan } from '@/components/RequirePermission'
import { useBookingStore } from '@/stores/booking.store'
import { useBookingsData } from '@/hooks/useAdminData'
import { useRoomTypes } from '@/stores/useCatalog'
import { todayKey } from '@/stores/demo-data'
import { AlertTriangleIcon, ChevronLeftIcon, ChevronRightIcon, InfoIcon } from '@/components/icons'
import { useOrderDrawer } from '../orders/_shared/OrderDetailPanel'
import { S, STATUS_CMS_TONE, STATUS_LABEL, tr } from '@/strings'

/**
 * Các trạng thái ĐANG THỰC SỰ GIỮ PHÒNG trong đêm đó.
 *
 * `bookedUnits` của `Inventory` chỉ là một con số — nhìn "đã bán 8" mà không
 * biết 8 đơn nào. Muốn liệt kê lại đúng con số ấy thì phải lọc đúng nhóm trạng
 * thái đã cộng vào nó: `cancelled` / `no_show` / `expired` đã nhả phòng ra, còn
 * `checked_out` là lượt lưu trú đã đóng — cả bốn đều KHÔNG chiếm tồn kho nữa.
 * Đưa nhầm chúng vào danh sách thì số dòng sẽ nhiều hơn "đã bán", người bán mất
 * niềm tin vào chính màn hình này.
 */
const HOLDING_STATUSES: readonly BookingStatus[] = ['pending_payment', 'confirmed', 'checked_in']

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
    const { inventory, bookings } = useBookingsData()
    const updateInventory = useBookingStore((s) => s.updateInventory)
    const { openOrder } = useOrderDrawer()

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

    // Hàng TỔNG mỗi ngày (yêu cầu chủ dự án): cộng dồn `free` của MỌI hạng
    // phòng cho từng ngày — lễ tân nhìn một dòng là biết ngày nào toàn khu
    // đang căng, không phải dò từng ô trong 20 hạng phòng. Cùng ngưỡng tone
    // với ô thường (0 = hết, ≤2 = sắp hết) nhưng tính trên TỔNG, không phải
    // trên một hạng — vì "còn 2 phòng loại A" không đáng lo bằng "cả khu chỉ
    // còn 2 phòng bất kỳ loại nào".
    const dailyTotals = useMemo(
        () =>
            dates.map((date) => {
                const free = rooms.reduce((sum, room) => {
                    const inv = inventory[inventoryKey(room.id, date)]
                    return sum + (inv ? availableUnits(inv) : 0)
                }, 0)
                const total = rooms.reduce((sum, room) => {
                    const inv = inventory[inventoryKey(room.id, date)]
                    return sum + (inv?.totalUnits ?? 0)
                }, 0)
                return { date, free, total }
            }),
        [dates, rooms, inventory],
    )

    // Liệt kê các đơn ĐANG chiếm một đêm cụ thể của một hạng phòng — thứ mà
    // `bookedUnits` (một con số trần) không trả lời được: "8 đơn đó là đơn nào?".
    const bookingsOnNight = useCallback(
        (roomTypeId: string, date: string): Booking[] =>
            bookings.filter(
                (b) =>
                    b.roomTypeId === roomTypeId &&
                    // So sánh chuỗi 'YYYY-MM-DD' trực tiếp là ĐÚNG: định dạng này
                    // sắp xếp theo từ điển trùng khớp thứ tự thời gian, nên không
                    // cần dựng `Date` (luật C6 — tránh luôn bẫy lệch múi giờ).
                    //
                    // `< b.checkOut` chứ KHÔNG phải `<=`: đơn nhận 20/8 trả 22/8
                    // chiếm hai ĐÊM 20 và 21; đêm 22 phòng đã trống để bán lại.
                    // Dùng `<=` sẽ đếm dư một đêm cho mọi đơn, khiến danh sách
                    // đông hơn `bookedUnits` đúng ở ngày trả phòng.
                    date >= b.checkIn &&
                    date < b.checkOut &&
                    HOLDING_STATUSES.includes(b.status),
            ),
        [bookings],
    )

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-[var(--cms-bg)]">
            {/* Hàng 1: tiêu đề trái + cụm điều hướng khoảng ngày phải — đúng bố
                cục `PageHeaderBar` chuẩn của dashboard, không card lồng card. */}
            <PageHeaderBar
                title={tr(S.inventoryCalendar, locale)}
                actions={
                    <>
                        {/* Bộ chọn 14 / 30 ngày — AC-13 */}
                        <select
                            value={rangeLength}
                            onChange={(e) => setRangeLength(Number(e.target.value) as RangeLength)}
                            aria-label={tr(S.dateRangeLabel, locale)}
                            className="rounded-[var(--cms-radius)] border border-[var(--cms-border)] bg-[var(--cms-bg)] px-3 py-1.5 text-[length:var(--cms-text-body)] font-medium text-[var(--cms-text)] transition-colors hover:bg-[var(--cms-bg-subtle)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                        >
                            <option value={14}>{tr(S.days14, locale)}</option>
                            <option value={30}>{tr(S.days30, locale)}</option>
                        </select>

                        <div className="flex items-center gap-0.5 rounded-[var(--cms-radius)] border border-[var(--cms-border)] bg-[var(--cms-bg)] p-0.5">
                            <button
                                type="button"
                                onClick={() => setOffset(offset - rangeLength)}
                                className="flex min-w-[24px] min-h-[24px] items-center justify-center rounded-[var(--cms-radius-sm)] p-1 transition-colors hover:bg-[var(--cms-bg-subtle)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--cms-accent)]"
                                aria-label={tr(S.previousRange, locale)}
                            >
                                <ChevronLeftIcon size={16} />
                            </button>
                            <span className="px-2 text-[length:var(--cms-text-body)] font-semibold tabular-nums text-[var(--cms-text)]">
                                {dates[0]} → {dates[dates.length - 1]}
                            </span>
                            <button
                                type="button"
                                onClick={() => setOffset(offset + rangeLength)}
                                className="flex min-w-[24px] min-h-[24px] items-center justify-center rounded-[var(--cms-radius-sm)] p-1 transition-colors hover:bg-[var(--cms-bg-subtle)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--cms-accent)]"
                                aria-label={tr(S.nextRange, locale)}
                            >
                                <ChevronRightIcon size={16} />
                            </button>
                        </div>

                        {offset !== 0 && (
                            <button
                                type="button"
                                onClick={() => setOffset(0)}
                                className="rounded-[var(--cms-radius)] border border-[var(--cms-border)] bg-[var(--cms-bg)] px-3 py-1.5 text-[length:var(--cms-text-body)] font-medium text-[var(--cms-text)] transition-colors hover:bg-[var(--cms-bg-subtle)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                            >
                                {tr(S.todayLabel, locale)}
                            </button>
                        )}
                    </>
                }
            />

            {/* Hàng 2: CHÚ GIẢI đưa lên đầu, cạnh bộ lọc — không còn nằm cuối
                trang ngoài vùng đọc. Cùng hàng cũng nói rõ luật tương tác
                ("bấm ô để sửa") để người xem lần đầu không phải đoán. */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-[var(--cms-border)] px-[var(--cms-pad)] py-2 text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)]">
                <DotBadge tone="rose" label={tr(S.soldOutShort, locale)} />
                <DotBadge tone="amber" label={pick({ vi: 'Sắp hết (≤2)', en: 'Low (≤2)' }, locale)} />
                <DotBadge tone="emerald" label={tr(S.inventoryLegendPlenty, locale)} />
                <span className="flex items-center gap-1.5">
                    <span
                        aria-hidden="true"
                        className="h-3.5 w-3.5 rounded-[3px] border-2 border-[var(--cms-accent)]"
                    />
                    {tr(S.inventoryPriceOverriddenTag, locale)}
                </span>
                <span className="flex items-center gap-1 text-[var(--cms-text-muted)]">
                    <InfoIcon size={13} />
                    {tr(S.inventoryClickToEditHint, locale)}
                </span>
            </div>

            {error && (
                <div className="border-t border-[var(--cms-border)] px-[var(--cms-pad)] py-2">
                    <InlineAlert tone="rose">
                        {error === 'version-conflict' ? tr(S.versionConflict, locale) : error}
                    </InlineAlert>
                </div>
            )}

            {/* Ma trận hạng phòng × ngày — không phải bảng 1-record-1-hàng nên
                KHÔNG dùng DataGrid (Column<T>[] không biểu diễn được cột động
                theo ngày + ô có 4 tầng thông tin tương tác). Giữ <table> viết
                tay, chỉ đổi hệ token sang --cms-* để nhất quán với phần còn
                lại của CMS; wrapper bỏ shadow/rounded, chỉ còn viền 1px (P7). */}
            <div className="w-full flex-1 min-h-0 border-t border-[var(--cms-border)] overflow-auto">

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
                                    background: 'var(--cms-bg-subtle)',
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
                                        // Cuối tuần tô nhẹ bằng --cms-accent-weak (token
                                        // thật của hệ cms-ui, dùng sẵn cho trạng thái
                                        // "được chọn nhẹ") — phân biệt được với ngày
                                        // thường (--cms-bg-subtle) mà không bịa thêm
                                        // biến mới riêng cho một mình chỗ này.
                                        background: isWeekend(date)
                                            ? 'var(--cms-accent-weak)'
                                            : 'var(--cms-bg-subtle)',
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
                        {/* HÀNG TỔNG — cố định ngay dưới header, TÁCH khỏi các
                            hàng hạng phòng bằng viền đậm hơn + nền nhấn nhẹ, để
                            mắt nhận ra ngay đây là dòng đọc trước tiên, không
                            phải một hạng phòng thứ 21. Lễ tân nhìn một dòng này
                            là biết ngay ngày nào toàn khu căng, không phải dò
                            280 ô bên dưới. */}
                        <tr>
                            <th
                                scope="row"
                                style={{
                                    ...bodyCell,
                                    position: 'sticky',
                                    left: 0,
                                    zIndex: 1,
                                    textAlign: 'left',
                                    fontWeight: 700,
                                    fontSize: 'var(--cms-text-body)',
                                    background: 'var(--cms-bg-subtle)',
                                    borderBottom: '2px solid var(--cms-border)',
                                }}
                            >
                                {tr(S.inventoryTotalRowLabel, locale)}
                                <div
                                    style={{
                                        fontWeight: 400,
                                        fontSize: 'var(--cms-text-meta)',
                                        color: 'var(--cms-text-muted)',
                                    }}
                                >
                                    {tr(S.inventoryTotalRowHint, locale)}
                                </div>
                            </th>
                            {dailyTotals.map(({ date, free, total }) => {
                                const tone =
                                    free === 0
                                        ? 'var(--cms-tone-rose)'
                                        : free <= 2
                                          ? 'var(--cms-tone-amber)'
                                          : 'var(--cms-tone-emerald)'
                                return (
                                    <td
                                        key={date}
                                        style={{
                                            ...bodyCell,
                                            background: 'var(--cms-bg-subtle)',
                                            borderBottom: '2px solid var(--cms-border)',
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 700,
                                                fontVariantNumeric: 'tabular-nums',
                                                color: tone,
                                            }}
                                        >
                                            {free}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 'var(--cms-text-meta)',
                                                color: 'var(--cms-text-muted)',
                                                fontVariantNumeric: 'tabular-nums',
                                            }}
                                        >
                                            / {total} {tr(S.inventoryFreeUnitLabel, locale)}
                                        </div>
                                    </td>
                                )
                            })}
                        </tr>

                        {rooms.map((room) => (
                            <tr key={room.id}>
                                <th
                                    scope="row"
                                    style={{
                                        ...bodyCell,
                                        position: 'sticky',
                                        left: 0,
                                        background: 'var(--cms-bg)',
                                        zIndex: 1,
                                        textAlign: 'left',
                                        fontWeight: 600,
                                        fontSize: 'var(--cms-text-body)',
                                    }}
                                >
                                    {pick(room.name, locale)}
                                    <div
                                        style={{
                                            fontWeight: 400,
                                            fontSize: 'var(--cms-text-meta)',
                                            color: 'var(--cms-text-muted)',
                                        }}
                                    >
                                        {formatPrice(room.price, locale)}
                                        {tr(S.perNight, locale)}
                                    </div>
                                </th>

                                {dates.map((date) => {
                                    const inv = inventory[inventoryKey(room.id, date)]
                                    const free = inv ? availableUnits(inv) : 0
                                    const total = inv?.totalUnits ?? 0
                                    const price = calculateNightlyPrice({
                                        date,
                                        basePrice: room.price,
                                        seasons,
                                        inventory: inv,
                                    })

                                    // Tone đổi sang hệ --cms-tone-* (cùng bộ DotBadge
                                    // dùng ở dashboard) — ngưỡng nghiệp vụ free===0 /
                                    // free<=2 giữ nguyên, không đụng (booking-domain).
                                    // Thêm nhánh "còn nhiều" (emerald) — trước đây ô
                                    // an toàn không có tone nào, người xem không phân
                                    // biệt được "đã kiểm tra, ổn" với "chưa có dữ liệu".
                                    const tone =
                                        free === 0
                                            ? { bg: 'var(--cms-tone-rose-bg)', fg: 'var(--cms-tone-rose)' }
                                            : free <= 2
                                              ? { bg: 'var(--cms-tone-amber-bg)', fg: 'var(--cms-tone-amber)' }
                                              : { bg: 'var(--cms-tone-emerald-bg)', fg: 'var(--cms-tone-emerald)' }

                                    const statusLabel =
                                        free === 0
                                            ? tr(S.soldOutShort, locale)
                                            : free <= 2
                                              ? tr(S.lowStockShort, locale)
                                              : tr(S.inventoryLegendPlenty, locale)

                                    // Tooltip gộp mọi cờ phụ (CTA/min-nights) — dấu
                                    // hiệu trong ô chỉ còn một ký hiệu nhỏ, chi tiết
                                    // đầy đủ đọc được qua `title` khi rê chuột/focus.
                                    const flagParts: string[] = []
                                    if (inv?.closedToArrival) {
                                        flagParts.push(tr(S.inventoryClosedArrivalTooltip, locale))
                                    }
                                    if (inv?.minNights) {
                                        flagParts.push(
                                            pick(S.inventoryMinNightsTooltip, locale).replace(
                                                '{n}',
                                                String(inv.minNights),
                                            ),
                                        )
                                    }

                                    return (
                                        <td key={date} style={{ ...bodyCell, padding: 2 }}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setError(null)
                                                    setEditing({ roomTypeId: room.id, date })
                                                }}
                                                aria-label={`${pick(room.name, locale)} ${date}: ${free}/${total} ${statusLabel}`}
                                                title={flagParts.length ? flagParts.join(' · ') : undefined}
                                                style={{
                                                    width: '100%',
                                                    padding: 6,
                                                    display: 'grid',
                                                    gap: 1,
                                                    background: tone.bg,
                                                    border: `1px solid ${
                                                        inv?.priceOverride !== undefined
                                                            ? 'var(--cms-accent)'
                                                            : 'transparent'
                                                    }`,
                                                    borderRadius: 'var(--cms-radius-sm)',
                                                    cursor: 'pointer',
                                                    color: tone.fg,
                                                }}
                                            >
                                                {/* SỐ PHÒNG TRỐNG là thông tin CHÍNH — to,
                                                    đậm, kèm nhãn trạng thái bằng chữ (D4:
                                                    không chỉ dựa vào màu). Giá chuyển xuống
                                                    hàng phụ, nhỏ và nhạt hơn hẳn. */}
                                                <span
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'baseline',
                                                        justifyContent: 'center',
                                                        gap: 3,
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontSize: 15,
                                                            fontWeight: 700,
                                                            fontVariantNumeric: 'tabular-nums',
                                                        }}
                                                    >
                                                        {free}
                                                    </span>
                                                    <span
                                                        style={{
                                                            fontSize: 'var(--cms-text-meta)',
                                                            fontWeight: 400,
                                                            opacity: 0.75,
                                                        }}
                                                    >
                                                        /{total}
                                                    </span>
                                                </span>
                                                <span style={{ fontSize: 9, fontWeight: 700 }}>
                                                    {statusLabel}
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: 10,
                                                        color: 'var(--cms-text-muted)',
                                                        fontVariantNumeric: 'tabular-nums',
                                                    }}
                                                >
                                                    {Math.round(price / 1000)}k
                                                </span>
                                                {/* Cờ phụ rút gọn thành 1 hàng ký hiệu nhỏ,
                                                    chi tiết đầy đủ nằm trong `title` — không
                                                    còn chiếm một dòng riêng "≥N" không nhãn
                                                    như bản cũ. */}
                                                {flagParts.length > 0 && (
                                                    <span
                                                        aria-hidden="true"
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            gap: 3,
                                                            color: 'var(--cms-tone-blue)',
                                                        }}
                                                    >
                                                        <AlertTriangleIcon size={11} />
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
                    nightBookings={bookingsOnNight(editing.roomTypeId, editing.date)}
                    // Modal sửa ô là `Modal` của @repo/ui (z-index 100) còn drawer
                    // đơn là z-60 — mở drawer khi modal còn đó thì nó nằm DƯỚI,
                    // người dùng bấm xong tưởng hỏng. Đóng modal TRƯỚC rồi mới mở.
                    onOpenBooking={(id) => {
                        setEditing(null)
                        openOrder(id)
                    }}
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

function EditCellDialog({
    inv,
    roomName,
    canEditPrice,
    nightBookings,
    onOpenBooking,
    onClose,
    onSave,
}: {
    inv: Inventory
    roomName: string
    /** Lễ tân chỉ ĐỌC giá (AC-8) — ô giá render thành `<span>`, không phải
     *  `<button disabled>`: target chết vẫn nằm trong luồng Tab (§6.11). */
    canEditPrice: boolean
    /** Các đơn đang giữ phòng trong đúng đêm này — diễn giải cho `bookedUnits`. */
    nightBookings: Booking[]
    onOpenBooking: (bookingId: string) => void
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

                {/* Diễn giải con số "đã bán" ở trên: liệt kê ĐÍCH DANH từng đơn
                    đang giữ phòng đêm này, bấm mã đơn là mở thẳng chi tiết. */}
                <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                        {tr(S.linkBookingsOnDate, locale)}
                    </span>

                    {nightBookings.length === 0 ? (
                        // Rỗng phải nói rõ đang rỗng, không để một khoảng trắng
                        // câm khiến người xem tưởng màn hình lỗi (FE7).
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                            {tr(S.linkNoBookingsOnDate, locale)}
                        </span>
                    ) : (
                        <ul
                            style={{
                                display: 'grid',
                                gap: 'var(--space-1)',
                                listStyle: 'none',
                                margin: 0,
                                padding: 0,
                            }}
                        >
                            {nightBookings.map((b) => (
                                <li
                                    key={b.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-2)',
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => onOpenBooking(b.id)}
                                        aria-label={`${tr(S.inventoryViewBookingAria, locale)} ${b.code}`}
                                        className="cms-crosslink font-semibold"
                                    >
                                        {b.code}
                                    </button>
                                    <span
                                        style={{
                                            flex: 1,
                                            minWidth: 0,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            fontSize: 'var(--text-sm)',
                                            color: 'var(--text)',
                                        }}
                                    >
                                        {b.guest.fullName}
                                    </span>
                                    <DotBadge
                                        tone={STATUS_CMS_TONE[b.status]}
                                        label={tr(STATUS_LABEL[b.status], locale)}
                                        width={116}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
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
    padding: 8,
    fontSize: 'var(--cms-text-meta)',
    fontWeight: 600,
    color: 'var(--cms-text-muted)',
    background: 'var(--cms-bg-subtle)',
    borderBottom: '1px solid var(--cms-border)',
    textAlign: 'center',
    whiteSpace: 'nowrap',
}

const bodyCell: React.CSSProperties = {
    padding: 8,
    borderBottom: '1px solid var(--cms-border)',
    textAlign: 'center',
    verticalAlign: 'middle',
}
