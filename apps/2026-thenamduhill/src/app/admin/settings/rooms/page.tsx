'use client'

/**
 * Hạng phòng & giá gốc (ticket `100-04` màn 1, `100-05` màn 1).
 *
 * Dữ liệu đọc/ghi qua `catalog.store` (persist) — KHÔNG `useState` cục bộ,
 * F5 phải còn nguyên (AC-2 của `100-05`).
 *
 * Một màn, HAI bộ trường tuỳ vai trò (AC-9): `editor` sửa được tên/mô tả/ảnh
 * nhưng không thấy ô giá gốc. Làm bằng điều kiện render trong cùng một form,
 * không phải hai component — hai bản là hai chỗ phải sửa khi thêm trường.
 *
 * Áp design system `@repo/cms-ui` (màn 7/7 nhóm Hệ thống) — đi theo đúng khuôn
 * `settings/rate-plans/page.tsx` đã áp: cùng là màn CRUD danh mục giá (id/tên
 * i18n/số tiền/modal), gần với rooms nhất trong nhóm đã xong. Bố cục: hàng 1
 * tiêu đề+đếm+nút thêm (`PageHeaderBar`), hàng 2 tìm kiếm+`FilterBar` (dải
 * giá, sức chứa)+Đặt lại, `MetricStrip` 4 KPI, `DataGrid` chiếm hết chỗ còn
 * lại. Khác `rate-plans` ở chỗ: có KPI (số hạng/tổng phòng vật lý/giá thấp
 * nhất) vì đây là màn quản lý tồn kho hạng phòng, có số liệu vận hành đáng
 * theo dõi — không copy máy móc.
 */

import { PencilIcon, PlusIcon, TrashIcon, UsersIcon } from '@/components/icons'
import { I18nField } from '@/components/I18nField'
import { ImageUploadField } from '@/components/ImageUploadField'
import { useLocale } from '@/components/LocaleProvider'
import { RequirePermission, useCan } from '@/components/RequirePermission'
import { useAuthStore } from '@/stores/auth.store'
import { useBookingStore } from '@/stores/booking.store'
import { useCatalogStore } from '@/stores/catalog.store'
import { todayKey } from '@/stores/demo-data'
import { useRoomExtras, useRoomTypes } from '@/stores/useCatalog'
import { S, tr } from '@/strings'
import {
    addDays,
    errorOf,
    formatPrice,
    inventoryKey,
    listStayDates,
    pick,
    validateRoomType,
} from '@repo/core'
import type { FieldError, I18nText, Room } from '@repo/core'
import { DataGrid, DotBadge, FilterBar, InlineAlert, KpiCard, MetricStrip, PageHeaderBar } from '@repo/cms-ui'
import { Button, Field, Modal, TextAreaField } from '@repo/ui'
import type { Column } from '@repo/ui'
import { useMemo, useState } from 'react'

/** Bộ lọc dải giá — nhóm sẵn để admin không phải gõ số. */
const PRICE_BANDS = [
    { value: 'all', vi: 'Mọi mức giá', en: 'All price bands' },
    { value: 'low', vi: 'Dưới 1,5 triệu', en: 'Under 1.5M' },
    { value: 'mid', vi: '1,5 – 3 triệu', en: '1.5M – 3M' },
    { value: 'high', vi: 'Trên 3 triệu', en: 'Above 3M' },
] as const

const CAPACITY_BANDS = [
    { value: 'all', vi: 'Mọi sức chứa', en: 'Any capacity' },
    { value: '2', vi: 'Tối đa 2 khách', en: 'Up to 2 guests' },
    { value: '4', vi: '3 – 4 khách', en: '3 – 4 guests' },
    { value: '5', vi: 'Từ 5 khách', en: '5+ guests' },
] as const

export default function RoomSettingsPage() {
    return (
        // `editor` vào được để sửa nội dung; `receptionist` bị chặn hoàn toàn
        // (ma trận `100-04` §4.3). Gõ thẳng URL cũng không lọt.
        <RequirePermission anyOf={['price.edit', 'content.edit']}>
            <RoomSettingsScreen />
        </RequirePermission>
    )
}

interface RoomDraft {
    id: string
    name: I18nText
    /** Mô tả ngắn hiện dưới tên phòng. Trước đây form KHÔNG có ô này nên
     *  `createRoom` phải lấy tạm `desc: draft.name` — mọi phòng mới tạo đều có
     *  mô tả trùng tên. */
    desc: I18nText
    price: number
    guests: number
    maxGuests: number
    area: string
    /** Số phòng vật lý — trước đây fix cứng `remaining: 4` cho MỌI hạng. */
    remaining: number
    extraBedFee: number
    /** Đường dẫn ảnh, ảnh đầu tiên là ảnh bìa. `ImageUploadField` trả thẳng
     *  mảng — không còn khâu parse chuỗi nhiều dòng như bản nhập tay. */
    images: string[]
    /** Mỗi dòng `"vi | en"` — xem `parseTags`. */
    tagsText: string
}

/** Chuỗi nhiều dòng → mảng, bỏ dòng trắng và khoảng trắng thừa. */
function parseLines(text: string): string[] {
    return text
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
}

/**
 * `"Hướng biển | Ocean view"` → `{ vi, en }`.
 *
 * Dòng thiếu dấu `|` bị trả về trong `invalid` để form báo lỗi bằng CHỮ thay vì
 * âm thầm lưu một tiện nghi chỉ có tiếng Việt — luật R6 bắt buộc đủ hai ngôn
 * ngữ ở tầng dữ liệu.
 */
function parseTags(text: string): { tags: I18nText[]; invalid: string[] } {
    const tags: I18nText[] = []
    const invalid: string[] = []
    for (const line of parseLines(text)) {
        const [vi, en] = line.split('|').map((part) => part.trim())
        if (!vi || !en) {
            invalid.push(line)
            continue
        }
        tags.push({ vi, en })
    }
    return { tags, invalid }
}

/** Mảng `I18nText` → dạng chữ nhiều dòng để đổ ngược vào ô nhập khi sửa. */
function tagsToText(tags: I18nText[] | undefined): string {
    return (tags ?? []).map((tag) => `${tag.vi} | ${tag.en}`).join('\n')
}

function RoomSettingsScreen() {
    const { locale } = useLocale()
    const user = useAuthStore((s) => s.user)
    const canEditPrice = useCan('price.edit')

    const rooms = useRoomTypes()
    const roomExtras = useRoomExtras()
    const createRoom = useCatalogStore((s) => s.createRoom)
    const updateRoom = useCatalogStore((s) => s.updateRoom)
    const removeCatalog = useCatalogStore((s) => s.remove)

    const bookings = useBookingStore((s) => s.bookings)
    const inventory = useBookingStore((s) => s.inventory)

    const [search, setSearch] = useState('')
    const [priceBand, setPriceBand] = useState('all')
    const [capacityBand, setCapacityBand] = useState('all')

    const [editing, setEditing] = useState<Room | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [draft, setDraft] = useState<RoomDraft | null>(null)
    const [errors, setErrors] = useState<FieldError[]>([])
    const [saving, setSaving] = useState(false)
    const [notice, setNotice] = useState<I18nText | null>(null)
    /** Số ngày bị ảnh hưởng khi đổi giá gốc — mở hộp xác nhận (§6.7 / AC-4). */
    const [priceConfirm, setPriceConfirm] = useState<{ from: number; to: number; days: number } | null>(
        null,
    )

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase()
        return rooms.filter((room) => {
            if (query) {
                const hit =
                    room.name.vi.toLowerCase().includes(query) ||
                    room.name.en.toLowerCase().includes(query) ||
                    room.id.toLowerCase().includes(query)
                if (!hit) return false
            }
            if (priceBand === 'low' && room.price >= 1_500_000) return false
            if (priceBand === 'mid' && (room.price < 1_500_000 || room.price > 3_000_000)) return false
            if (priceBand === 'high' && room.price <= 3_000_000) return false

            const cap = roomExtras[room.id]?.maxGuests ?? room.guests
            if (capacityBand === '2' && cap > 2) return false
            if (capacityBand === '4' && (cap < 3 || cap > 4)) return false
            if (capacityBand === '5' && cap < 5) return false
            return true
        })
    }, [rooms, roomExtras, search, priceBand, capacityBand])

    function openModal(room?: Room) {
        setErrors([])
        setNotice(null)
        setPriceConfirm(null)
        if (room) {
            setEditing(room)
            setDraft({
                id: room.id,
                name: { ...room.name },
                desc: { ...room.desc },
                price: room.price,
                guests: room.guests,
                maxGuests: roomExtras[room.id]?.maxGuests ?? room.guests,
                area: room.area,
                remaining: room.remaining ?? 0,
                extraBedFee: room.extraBedFee ?? 0,
                images: [...(room.images ?? [])],
                tagsText: tagsToText(room.tags),
            })
        } else {
            setEditing(null)
            setDraft({
                id: '',
                name: { vi: '', en: '' },
                desc: { vi: '', en: '' },
                price: 1_500_000,
                guests: 2,
                maxGuests: 3,
                area: '35 m²',
                // Mặc định 1 phòng, KHÔNG phải 4: chị khai một hạng mới thì số
                // phòng thật là điều chỉ chị biết. Đặt sẵn 4 là mời gọi bấm
                // Lưu mà không sửa — và bán quá 3 phòng không tồn tại.
                remaining: 1,
                extraBedFee: 0,
                images: [],
                tagsText: '',
            })
        }
        setModalOpen(true)
    }

    /**
     * Đếm số ngày trong 30 ngày tới sẽ đổi giá theo giá gốc mới (AC-4).
     *
     * `priceOverride == null` bắt cả `undefined` — KHÔNG dùng `!priceOverride`,
     * vì giá đè bằng `0` (phòng tặng) sẽ bị đếm nhầm là "chưa đặt giá riêng".
     */
    function countAffectedDays(roomId: string): number {
        const today = todayKey()
        return listStayDates(today, addDays(today, 30)).filter(
            (date) => inventory[inventoryKey(roomId, date)]?.priceOverride == null,
        ).length
    }

    function handleSave() {
        if (!draft || !user) return

        const found = validateRoomType({
            name: draft.name,
            price: draft.price,
            guests: draft.guests,
            maxGuests: draft.maxGuests,
            // Chỉ kiểm id khi TẠO MỚI — id của bản ghi seed không sửa được.
            ...(editing ? {} : { id: draft.id, existingIds: rooms.map((r) => r.id) }),
        })

        // Tiện nghi thiếu một ngôn ngữ — `validateRoomType` của `core` không
        // biết ô này (nó nhận `I18nText[]` đã parse), nên kiểm tại đây.
        const { invalid } = parseTags(draft.tagsText)
        if (invalid.length > 0) {
            found.push({
                field: 'tags',
                message: {
                    vi: `${S.roomTagsFormatError.vi} — "${invalid[0]}"`,
                    en: `${S.roomTagsFormatError.en} — "${invalid[0]}"`,
                },
            })
        }

        const first = found[0]
        if (first) {
            setErrors(found)
            setNotice(S.fixErrorsFirst)
            // Focus nhảy vào ô lỗi đầu tiên (FE1 `error`, D3).
            document.getElementById(`room-field-${first.field}`)?.focus()
            return
        }

        setErrors([])
        setNotice(null)

        // Đổi giá gốc là hành động có hậu quả — phải cảnh báo trước (§4.1).
        if (editing && draft.price !== editing.price) {
            setPriceConfirm({
                from: editing.price,
                to: draft.price,
                days: countAffectedDays(editing.id),
            })
            return
        }

        commit()
    }

    function commit() {
        if (!draft || !user) return
        setSaving(true)
        const actor = { id: user.id, name: user.fullName || user.id, role: user.role }

        const { tags } = parseTags(draft.tagsText)
        const images = draft.images

        const result = editing
            ? updateRoom(
                  editing.id,
                  {
                      name: draft.name,
                      desc: draft.desc,
                      // Ô giá chỉ gửi lên khi vai trò được sửa giá — `editor`
                      // không thấy ô này nên cũng không được ghi đè giá cũ.
                      // `extraBedFee` cũng là tiền, nên đi cùng điều kiện.
                      ...(canEditPrice ? { price: draft.price, extraBedFee: draft.extraBedFee } : {}),
                      guests: draft.guests,
                      maxGuests: draft.maxGuests,
                      area: draft.area,
                      remaining: draft.remaining,
                      tags,
                      images,
                  },
                  actor,
              )
            : createRoom(
                  {
                      id: draft.id,
                      name: draft.name,
                      // Mô tả THẬT từ ô nhập. Trước đây gán `desc: draft.name`
                      // vì form chưa có ô mô tả — mọi phòng mới tạo hiện ra
                      // trang khách với mô tả trùng y tên phòng.
                      desc: draft.desc,
                      price: canEditPrice ? draft.price : 0,
                      guests: draft.guests,
                      area: draft.area,
                      tags,
                      images,
                      extraBedFee: canEditPrice ? draft.extraBedFee : 0,
                      // Số phòng vật lý do admin khai, không còn cứng 4.
                      remaining: draft.remaining,
                  },
                  actor,
              )

        setSaving(false)

        if (result === 'duplicate-id') {
            setErrors([{ field: 'id', message: S.duplicateId }])
            setNotice(S.duplicateId)
            return
        }
        if (result) {
            setNotice(S.saveFailed)
            return
        }

        setPriceConfirm(null)
        setModalOpen(false)
        setDraft(null)
    }

    function handleDelete(room: Room) {
        if (!user) return
        // Xoá hạng phòng còn đơn đang dùng là đơn cũ mất tên phòng (§6.12).
        const inUse = bookings.filter(
            (b) =>
                b.roomTypeId === room.id &&
                (b.status === 'confirmed' || b.status === 'checked_in' || b.status === 'pending_payment'),
        ).length

        if (inUse > 0) {
            setNotice({
                vi: `Không xoá được: còn ${inUse} đơn đang dùng hạng "${room.name.vi}".`,
                en: `Cannot delete: ${inUse} booking(s) still use "${room.name.en}".`,
            })
            return
        }

        if (!window.confirm(`${tr(S.deleteRoomTypeConfirm, locale)} — ${tr(room.name, locale)}`)) return
        const actor = { id: user.id, name: user.fullName || user.id, role: user.role }
        const result = removeCatalog('room', room.id, actor)
        if (result) setNotice(S.saveFailed)
    }

    const resetFilters = () => {
        setSearch('')
        setPriceBand('all')
        setCapacityBand('all')
    }

    const cheapest = rooms.length > 0 ? Math.min(...rooms.map((r) => r.price)) : 0
    // `?? 0` — cùng lý do với cột "Số phòng": KPI "tổng phòng vật lý" mà cộng
    // thêm 4 cho mỗi hạng chưa khai thì con số này luôn lớn hơn thực tế.
    const totalUnits = rooms.reduce((sum, r) => sum + (r.remaining ?? 0), 0)

    const columns: Column<Room>[] = [
        {
            key: 'id',
            header: tr(S.colRoomCode, locale),
            width: '130px',
            cell: (room) => (
                <span className="font-mono text-[length:var(--cms-text-meta)] font-semibold text-[var(--cms-text-muted)]">
                    {room.id}
                </span>
            ),
        },
        {
            key: 'name',
            header: tr(S.colRoomName, locale),
            cell: (room) => (
                <div className="min-w-0">
                    <div
                        className="truncate font-semibold text-[var(--cms-text)] text-[length:var(--cms-text-body)]"
                        title={tr(room.name, locale)}
                    >
                        {tr(room.name, locale)}
                    </div>
                    {/* Hiện luôn ngôn ngữ còn lại: biên tập viên thấy ngay
                        bản dịch có bị bỏ trống hay không (luật R6). */}
                    <div className="truncate text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)]">
                        {room.area} · {pick({ vi: room.name.en, en: room.name.vi }, locale)}
                    </div>
                </div>
            ),
        },
        {
            key: 'guests',
            header: tr(S.colCapacity, locale),
            width: '150px',
            cell: (room) => {
                // Sức chứa phải tách người lớn / trẻ em (luật B2, `100-05` AC-1):
                // "2 khách" không cho lễ tân biết có cần chuẩn bị cũi hay không.
                const max = roomExtras[room.id]?.maxGuests ?? room.guests
                const children = Math.max(0, max - room.guests)
                return (
                    <span className="inline-flex items-center gap-1.5 text-[length:var(--cms-text-body)] text-[var(--cms-text)]">
                        <UsersIcon size={13} />
                        <span className="tabular-nums">
                            {room.guests} {tr(S.adults, locale)}
                            {children > 0 ? ` · ${children} ${tr(S.children, locale)}` : ''}
                        </span>
                    </span>
                )
            },
        },
        {
            key: 'price',
            header: tr(S.colBasePrice, locale),
            align: 'right',
            width: '150px',
            cell: (room) => (
                <span className="font-semibold text-[length:var(--cms-text-body)] text-[var(--cms-text)] tabular-nums">
                    {formatPrice(room.price, locale)}
                </span>
            ),
        },
        {
            key: 'remaining',
            header: tr(S.colPhysicalUnits, locale),
            align: 'center',
            width: '140px',
            // `?? 0` chứ không `?? 4`: hạng chưa khai số phòng phải hiện 0 và
            // tô cảnh báo, không phải mượn tạm con số 4 rồi để lễ tân tin là
            // có 4 phòng bán được (luật FE13 — không bịa số tồn kho).
            cell: (room) => {
                const units = room.remaining ?? 0
                return (
                    <DotBadge
                        tone={units === 0 ? 'amber' : 'blue'}
                        label={`${units} ${tr(S.unitsSuffix, locale)}`}
                    />
                )
            },
        },
        {
            key: 'status',
            header: tr(S.colStatus, locale),
            width: '140px',
            cell: () => <DotBadge tone="emerald" label={tr(S.onSale, locale)} width={108} />,
        },
        {
            key: 'actions',
            header: tr(S.colActions, locale),
            align: 'right',
            width: '90px',
            cell: (room) => (
                <div className="flex items-center justify-end gap-1">
                    <button
                        type="button"
                        onClick={() => openModal(room)}
                        aria-label={`${tr(S.edit, locale)} ${tr(room.name, locale)}`}
                        style={{ minWidth: 28, minHeight: 28 }}
                        className="inline-flex items-center justify-center rounded-[var(--cms-radius-sm)] text-[var(--cms-text-muted)] hover:bg-[var(--cms-bg-subtle)] hover:text-[var(--cms-text)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                    >
                        <PencilIcon size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDelete(room)}
                        aria-label={`${tr(S.delete, locale)} ${tr(room.name, locale)}`}
                        style={{ minWidth: 28, minHeight: 28 }}
                        className="inline-flex items-center justify-center rounded-[var(--cms-radius-sm)] text-[var(--cms-text-muted)] hover:bg-[var(--cms-bg-subtle)] hover:text-[var(--cms-text)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                    >
                        <TrashIcon size={14} />
                    </button>
                </div>
            ),
        },
    ]

    const filterGroups = [
        {
            legend: tr(S.colBasePrice, locale),
            value: priceBand,
            onChange: setPriceBand,
            options: PRICE_BANDS.map((b) => ({ value: b.value, label: b[locale] })),
        },
        {
            legend: tr(S.colCapacity, locale),
            value: capacityBand,
            onChange: setCapacityBand,
            options: CAPACITY_BANDS.map((b) => ({ value: b.value, label: b[locale] })),
        },
    ]

    return (
        <div className="flex w-full flex-1 flex-col min-h-0 bg-[var(--cms-bg)]">
            {/* HÀNG 1: tiêu đề + đếm bên trái, nút thêm hạng phòng bên phải. */}
            <PageHeaderBar
                title={tr(S.roomTypesTitle, locale)}
                count={{ value: filtered.length, suffix: tr(S.roomTypesCount, locale) }}
                actions={
                    <Button onClick={() => openModal()}>
                        <PlusIcon size={16} />
                        <span>{tr(S.addRoomType, locale)}</span>
                    </Button>
                }
            />

            {/* HÀNG 2: ô tìm kiếm tự do + FilterBar (dải giá, sức chứa) — cùng
                khuôn rate-plans.tsx: input thô token hoá vì `FilterBar` không
                nhận chữ tự do, đặt cạnh pill lọc trong cùng khối, Đặt lại ở cuối. */}
            <div className="border-t border-[var(--cms-border)] px-[var(--cms-pad)] py-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={tr(S.searchRoomType, locale)}
                    aria-label={tr(S.searchRoomType, locale)}
                    className="w-44 sm:w-64 px-3 py-1 text-[length:var(--cms-text-body)] bg-[var(--cms-bg)] border border-[var(--cms-border)] rounded-[var(--cms-radius)] text-[var(--cms-text)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                    style={{ minHeight: 28 }}
                />

                <FilterBar
                    groups={filterGroups}
                    resultText={`${filtered.length} ${tr(S.roomTypesCount, locale)}`}
                    onReset={resetFilters}
                />
            </div>

            {notice && (
                <div className="px-[var(--cms-pad)] pt-3">
                    <InlineAlert tone="rose">{tr(notice, locale)}</InlineAlert>
                </div>
            )}

            {!canEditPrice && (
                <div className="px-[var(--cms-pad)] pt-3">
                    <InlineAlert tone="amber">{tr(S.priceHiddenForRole, locale)}</InlineAlert>
                </div>
            )}

            {/* MetricStrip — 4 KPI liền mạch thay 4 card rời (P11 Calm). */}
            <div className="border-t border-[var(--cms-border)] bg-[var(--cms-bg-subtle)] px-[var(--cms-pad)] py-2">
                <MetricStrip>
                    <KpiCard
                        label={tr(S.roomTypesTitle, locale)}
                        value={`${rooms.length}`}
                        note={tr(S.roomTypesCount, locale)}
                        tone="slate"
                    />
                    <KpiCard
                        label={tr(S.colPhysicalUnits, locale)}
                        value={`${totalUnits}`}
                        note={tr(S.unitsSuffix, locale)}
                        tone="emerald"
                    />
                    <KpiCard label={tr(S.colStatus, locale)} value={tr(S.onSale, locale)} tone="blue" />
                    <KpiCard
                        label={tr(S.colBasePrice, locale)}
                        value={formatPrice(cheapest, locale)}
                        tone="slate"
                    />
                </MetricStrip>
            </div>

            {/* Vùng nội dung: DataGrid chiếm hết chỗ còn lại — tối ưu chiều
                cao là ưu tiên số 1 cho màn lễ tân/quản lý dùng hằng ngày. */}
            <div className="flex-1 flex flex-col min-h-0 border-t border-[var(--cms-border)]">
                <DataGrid<Room>
                    caption={tr(S.roomTypesTitle, locale)}
                    columns={columns}
                    rows={filtered}
                    rowKey={(room) => room.id}
                    empty={
                        <div className="h-full flex items-center justify-center text-center text-[length:var(--cms-text-body)] text-[var(--cms-text-muted)]">
                            {tr(S.emptyRoomTypes, locale)}
                        </div>
                    }
                />
            </div>

            {modalOpen && draft && (
                <Modal
                    open
                    onClose={() => setModalOpen(false)}
                    title={tr(editing ? S.editRoomType : S.addRoomType, locale)}
                    // 880px thay cho mặc định 560px. Lưới 4 cột trong 560px thì
                    // mỗi cột chỉ ~120px — nhãn "Số khách tiêu chuẩn" xuống hai
                    // dòng và các ô cùng hàng lệch nhau. Đây là chiều rộng đã
                    // dùng cho drawer tạo đơn (commit ea50fa8), giữ cho hai form
                    // CMS cùng khổ.
                    width={880}
                    footer={
                        <>
                            <Button variant="ghost" onClick={() => setModalOpen(false)}>
                                {tr(S.cancel, locale)}
                            </Button>
                            <Button onClick={handleSave} disabled={saving}>
                                {tr(saving ? S.saving : S.save, locale)}
                            </Button>
                        </>
                    }
                >
                    {/*
                        BỐ CỤC LƯỚI 4 CỘT — form đặc, không phải chuỗi ô xếp dọc.

                        Bản trước xếp mỗi hàng 1–2 ô nên 10 trường thành một cột
                        dài phải cuộn hai màn hình mới thấy nút Lưu. Ở đây các ô
                        SỐ ngắn (sức chứa, giá, số phòng) chiếm 1 cột, ô CHỮ dài
                        (tên, mô tả) trải hết hàng — chiều cao form giảm còn
                        khoảng một nửa mà không bỏ trường nào.

                        `gap-x-3 gap-y-2.5`: khoảng cách NGANG rộng hơn DỌC. Mắt
                        đọc form theo cột nên khe dọc hẹp vẫn tách bạch được,
                        trong khi khe ngang cần rộng hơn để hai ô cạnh nhau
                        không dính thành một khối. Cả hai đều nằm trên thang 8pt
                        (12px/10px), không phải số lẻ tuỳ tiện (P5).
                    */}
                    <div
                        // `--field-gap` là hook có sẵn của `FieldShell` trong
                        // `@repo/ui` (mặc định `--space-2` = 8px). Đặt 4px ở
                        // ĐÂY thay vì sửa `packages/ui` — nút vặn dành riêng
                        // cho form đặc của CMS, không ảnh hưởng form phía khách
                        // của cả 4 theme (luật R3/R5).
                        style={{ ['--field-gap' as string]: '4px' }}
                        className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-[length:var(--cms-text-body)] sm:grid-cols-4"
                    >
                        {!editing && (
                            <div className="col-span-2">
                                <Field
                                    fieldId="room-field-id"
                                    label={tr(S.idFieldLabel, locale)}
                                    value={draft.id}
                                    onChange={(e) => setDraft({ ...draft, id: e.target.value })}
                                    placeholder="bungalow-hill"
                                    required
                                    error={maybe(errorOf(errors, 'id'), locale)}
                                />
                            </div>
                        )}

                        {/* Tên trải hết hàng: `I18nField` đã tự chia đôi VI/EN
                            bên trong, nhét vào nửa hàng là hai ô hẹp bằng 1/4. */}
                        <div className={editing ? 'col-span-2 sm:col-span-4' : 'col-span-2'}>
                            <I18nField
                                fieldId="room-field-name"
                                label={tr(S.colRoomName, locale)}
                                value={draft.name}
                                onChange={(name) => setDraft({ ...draft, name })}
                                required
                                placeholderVi="Bungalow Hướng Biển"
                                placeholderEn="Ocean View Bungalow"
                                error={maybe(errorOf(errors, 'name'), locale)}
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-4">
                            <I18nField
                                fieldId="room-field-desc"
                                label={tr(S.roomDescLabel, locale)}
                                value={draft.desc}
                                onChange={(desc) => setDraft({ ...draft, desc })}
                                multiline
                                rows={2}
                                placeholderVi="Bungalow gỗ nhìn thẳng ra vịnh, ban công riêng."
                                placeholderEn="Timber bungalow facing the bay, private balcony."
                                error={maybe(errorOf(errors, 'desc'), locale)}
                            />
                        </div>

                        {/* Bốn ô SỐ trên CÙNG MỘT HÀNG — trước đây chiếm 3 hàng.
                            Hint đã gỡ khỏi ô: nhãn "Số khách tiêu chuẩn" /
                            "Sức chứa tối đa" tự nói đủ nghĩa, dòng giải thích
                            dưới mỗi ô làm form cao gấp rưỡi mà không thêm
                            thông tin. Riêng "Số phòng vật lý" giữ hint vì khai
                            sai là bán quá số phòng — hậu quả không đoán được từ
                            tên trường. */}
                        <Field
                            fieldId="room-field-guests"
                            label={tr(S.standardGuests, locale)}
                            type="number"
                            min={1}
                            value={draft.guests}
                            onChange={(e) => setDraft({ ...draft, guests: Number(e.target.value) })}
                            required
                            error={maybe(errorOf(errors, 'guests'), locale)}
                        />
                        <Field
                            fieldId="room-field-maxGuests"
                            label={tr(S.maxGuests, locale)}
                            type="number"
                            min={1}
                            value={draft.maxGuests}
                            onChange={(e) => setDraft({ ...draft, maxGuests: Number(e.target.value) })}
                            error={maybe(errorOf(errors, 'maxGuests'), locale)}
                        />
                        <Field
                            fieldId="room-field-remaining"
                            label={tr(S.physicalUnitsLabel, locale)}
                            hint={tr(S.physicalUnitsHint, locale)}
                            type="number"
                            min={0}
                            value={draft.remaining}
                            onChange={(e) => setDraft({ ...draft, remaining: Number(e.target.value) })}
                            required
                            error={maybe(errorOf(errors, 'remaining'), locale)}
                        />
                        <Field
                            fieldId="room-field-area"
                            label={tr(S.displayArea, locale)}
                            value={draft.area}
                            onChange={(e) => setDraft({ ...draft, area: e.target.value })}
                            placeholder="48 m²"
                        />

                        {/* AC-9: `editor` KHÔNG thấy ô giá gốc. Điều kiện render
                            trong cùng một form, không tách hai component. */}
                        {canEditPrice && (
                            <>
                                <div className="col-span-1 sm:col-span-2">
                                    <Field
                                        fieldId="room-field-price"
                                        label={tr(S.basePriceLabel, locale)}
                                        type="number"
                                        min={0}
                                        step={50000}
                                        value={draft.price}
                                        onChange={(e) =>
                                            setDraft({ ...draft, price: Number(e.target.value) })
                                        }
                                        required
                                        error={maybe(errorOf(errors, 'price'), locale)}
                                    />
                                </div>
                                <div className="col-span-1 sm:col-span-2">
                                    <Field
                                        fieldId="room-field-extraBedFee"
                                        label={tr(S.extraBedFeeLabel, locale)}
                                        type="number"
                                        min={0}
                                        step={50000}
                                        value={draft.extraBedFee}
                                        onChange={(e) =>
                                            setDraft({ ...draft, extraBedFee: Number(e.target.value) })
                                        }
                                    />
                                </div>
                            </>
                        )}

                        <div className="col-span-2 sm:col-span-4">
                            <ImageUploadField
                                label={tr(S.roomImagesLabel, locale)}
                                hint={tr(S.roomImagesHint, locale)}
                                value={draft.images}
                                onChange={(images) => setDraft({ ...draft, images })}
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-4">
                            <TextAreaField
                                label={tr(S.roomTagsLabel, locale)}
                                hint={tr(S.roomTagsHint, locale)}
                                rows={2}
                                value={draft.tagsText}
                                onChange={(e) => setDraft({ ...draft, tagsText: e.target.value })}
                                placeholder={'Hướng biển | Ocean view\nBan công riêng | Private balcony'}
                                error={maybe(errorOf(errors, 'tags'), locale)}
                            />
                        </div>
                    </div>
                </Modal>
            )}

            {/* Hộp xác nhận đổi giá gốc — AC-4 */}
            {priceConfirm && draft && (
                <Modal
                    open
                    onClose={() => setPriceConfirm(null)}
                    title={tr(S.confirmPriceChange, locale)}
                    footer={
                        <>
                            <Button variant="ghost" onClick={() => setPriceConfirm(null)}>
                                {tr(S.cancel, locale)}
                            </Button>
                            <Button onClick={commit} disabled={saving}>
                                {tr(S.confirm, locale)}
                            </Button>
                        </>
                    }
                >
                    <div className="space-y-2 text-[length:var(--cms-text-body)] text-[var(--cms-text)] leading-relaxed">
                        <p className="m-0">
                            {tr(draft.name, locale)}:{' '}
                            <strong className="tabular-nums">
                                {formatPrice(priceConfirm.from, locale)}
                            </strong>{' '}
                            →{' '}
                            <strong className="tabular-nums">
                                {formatPrice(priceConfirm.to, locale)}
                            </strong>
                        </p>
                        <p className="m-0">
                            <strong className="tabular-nums">{priceConfirm.days}</strong>{' '}
                            {tr(S.priceChangeImpact, locale)}
                        </p>
                        <p className="m-0 font-semibold text-[var(--cms-text)]">
                            {tr(S.bookingsUnaffected, locale)}
                        </p>
                    </div>
                </Modal>
            )}
        </div>
    )
}

/** Lỗi song ngữ → chuỗi đã dịch, hoặc `undefined` khi không có lỗi. */
function maybe(text: I18nText | undefined, locale: 'vi' | 'en'): string | undefined {
    return text ? tr(text, locale) : undefined
}
