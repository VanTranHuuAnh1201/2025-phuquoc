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
 */

import {
    BuildingIcon,
    CheckCircleIcon,
    CoinsIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
    UsersIcon,
} from '@/components/icons'
import { I18nField } from '@/components/I18nField'
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
import {
    Badge,
    Button,
    DataTable,
    Field,
    FilterSelect,
    Modal,
    Toolbar,
    useDataTable,
} from '@repo/ui'
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
    price: number
    guests: number
    maxGuests: number
    area: string
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

    const isFiltered = search !== '' || priceBand !== 'all' || capacityBand !== 'all'

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

    const { tableProps } = useDataTable<Room>({
        data: filtered,
        rowKey: (room) => room.id,
        pageSize: 10,
        columns: [
            {
                key: 'id',
                header: tr(S.colRoomCode, locale),
                width: '130px',
                sortable: true,
                cell: (room) => (
                    <span className="font-mono text-xs font-bold text-slate-700">{room.id}</span>
                ),
            },
            {
                key: 'name',
                header: tr(S.colRoomName, locale),
                cell: (room) => (
                    <div>
                        <div className="font-bold text-xs text-slate-900">{tr(room.name, locale)}</div>
                        {/* Hiện luôn ngôn ngữ còn lại: biên tập viên thấy ngay
                            bản dịch có bị bỏ trống hay không (luật R6). */}
                        <div className="text-[10px] text-slate-400">
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
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-700">
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
                sortable: true,
                cell: (room) => (
                    <span className="font-extrabold text-xs text-slate-900 tabular-nums">
                        {formatPrice(room.price, locale)}
                    </span>
                ),
            },
            {
                key: 'remaining',
                header: tr(S.colPhysicalUnits, locale),
                align: 'center',
                width: '140px',
                cell: (room) => (
                    <Badge tone="info">
                        {room.remaining ?? 4} {tr(S.unitsSuffix, locale)}
                    </Badge>
                ),
            },
            {
                key: 'status',
                header: tr(S.colStatus, locale),
                width: '140px',
                cell: () => <Badge tone="success">{tr(S.onSale, locale)}</Badge>,
            },
            {
                key: 'actions',
                header: tr(S.colActions, locale),
                align: 'right',
                width: '100px',
                cell: (room) => (
                    <div className="flex items-center justify-end gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openModal(room)}
                            aria-label={`${tr(S.edit, locale)} ${tr(room.name, locale)}`}
                        >
                            <PencilIcon size={14} />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(room)}
                            aria-label={`${tr(S.delete, locale)} ${tr(room.name, locale)}`}
                        >
                            <TrashIcon size={14} />
                        </Button>
                    </div>
                ),
            },
        ],
    })

    function openModal(room?: Room) {
        setErrors([])
        setNotice(null)
        setPriceConfirm(null)
        if (room) {
            setEditing(room)
            setDraft({
                id: room.id,
                name: { ...room.name },
                price: room.price,
                guests: room.guests,
                maxGuests: roomExtras[room.id]?.maxGuests ?? room.guests,
                area: room.area,
            })
        } else {
            setEditing(null)
            setDraft({
                id: '',
                name: { vi: '', en: '' },
                price: 1_500_000,
                guests: 2,
                maxGuests: 3,
                area: '35 m²',
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

        const result = editing
            ? updateRoom(
                  editing.id,
                  {
                      name: draft.name,
                      // Ô giá chỉ gửi lên khi vai trò được sửa giá — `editor`
                      // không thấy ô này nên cũng không được ghi đè giá cũ.
                      ...(canEditPrice ? { price: draft.price } : {}),
                      guests: draft.guests,
                      maxGuests: draft.maxGuests,
                      area: draft.area,
                  },
                  actor,
              )
            : createRoom(
                  {
                      id: draft.id,
                      name: draft.name,
                      desc: draft.name,
                      price: canEditPrice ? draft.price : 0,
                      guests: draft.guests,
                      area: draft.area,
                      tags: [],
                      remaining: 4,
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

    const cheapest = rooms.length > 0 ? Math.min(...rooms.map((r) => r.price)) : 0
    const totalUnits = rooms.reduce((sum, r) => sum + (r.remaining ?? 4), 0)

    return (
        <div className="h-full flex flex-col min-h-0 bg-slate-100 p-2 gap-2 overflow-hidden">
            {/* KPI */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 shrink-0">
                <KpiCard
                    label={tr(S.roomTypesTitle, locale)}
                    value={`${rooms.length} ${tr(S.roomTypesCount, locale)}`}
                    icon={<BuildingIcon size={16} />}
                />
                <KpiCard
                    label={tr(S.colPhysicalUnits, locale)}
                    value={`${totalUnits} ${tr(S.unitsSuffix, locale)}`}
                    icon={<UsersIcon size={16} />}
                    tone="text-emerald-600"
                />
                <KpiCard
                    label={tr(S.colStatus, locale)}
                    value={tr(S.onSale, locale)}
                    icon={<CheckCircleIcon size={16} />}
                    tone="text-blue-600"
                />
                <KpiCard
                    label={tr(S.colBasePrice, locale)}
                    value={formatPrice(cheapest, locale)}
                    icon={<CoinsIcon size={16} />}
                />
            </div>

            {notice && (
                <div
                    role="alert"
                    aria-live="polite"
                    className="shrink-0 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-md text-xs font-medium"
                >
                    {tr(notice, locale)}
                </div>
            )}

            {!canEditPrice && (
                <div className="shrink-0 p-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-md text-[11px]">
                    {tr(S.priceHiddenForRole, locale)}
                </div>
            )}

            {/* Bảng theo format §F6: tiêu đề + đếm, tìm kiếm, bộ lọc + Đặt lại, phân trang, trạng thái rỗng */}
            <div className="flex-1 min-h-0 bg-white rounded border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="flex flex-wrap items-center justify-between gap-2 px-3 pt-3 shrink-0">
                    <div className="flex items-center gap-2">
                        <h1 className="text-base font-bold text-slate-900 tracking-tight">
                            {tr(S.roomTypesTitle, locale)}
                        </h1>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 tabular-nums">
                            {filtered.length} {tr(S.roomTypesCount, locale)}
                        </span>
                    </div>
                    <Button onClick={() => openModal()}>
                        <PlusIcon size={16} />
                        <span>{tr(S.addRoomType, locale)}</span>
                    </Button>
                </div>

                <Toolbar
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder={tr(S.searchRoomType, locale)}
                    isFiltered={isFiltered}
                    onReset={() => {
                        setSearch('')
                        setPriceBand('all')
                        setCapacityBand('all')
                    }}
                    resetLabel={tr(S.reset, locale)}
                >
                    <FilterSelect
                        label={tr(S.colBasePrice, locale)}
                        value={priceBand}
                        onChange={setPriceBand}
                        options={PRICE_BANDS.map((b) => ({ value: b.value, label: b[locale] }))}
                    />
                    <FilterSelect
                        label={tr(S.colCapacity, locale)}
                        value={capacityBand}
                        onChange={setCapacityBand}
                        options={CAPACITY_BANDS.map((b) => ({ value: b.value, label: b[locale] }))}
                    />
                </Toolbar>

                <DataTable<Room>
                    {...tableProps}
                    caption={tr(S.roomTypesTitle, locale)}
                    pagination={{
                        ...tableProps.pagination,
                        prevLabel: tr(S.paginationPrev, locale),
                        nextLabel: tr(S.paginationNext, locale),
                        pageSizeLabel: tr(S.paginationPageSize, locale),
                        summaryText: (a, b, c) =>
                            `${tr(S.paginationSummary, locale)} ${a}–${b} / ${c} ${tr(S.roomTypesCount, locale)}`,
                    }}
                    empty={tr(S.emptyRoomTypes, locale)}
                />
            </div>

            {modalOpen && draft && (
                <Modal
                    open
                    onClose={() => setModalOpen(false)}
                    title={tr(editing ? S.editRoomType : S.addRoomType, locale)}
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
                    <div className="space-y-3 text-xs">
                        {!editing && (
                            <Field
                                fieldId="room-field-id"
                                label={tr(S.idFieldLabel, locale)}
                                hint={tr(S.idFieldHint, locale)}
                                value={draft.id}
                                onChange={(e) => setDraft({ ...draft, id: e.target.value })}
                                placeholder="bungalow-hill"
                                required
                                error={maybe(errorOf(errors, 'id'), locale)}
                            />
                        )}

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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Field
                                fieldId="room-field-guests"
                                label={tr(S.standardGuests, locale)}
                                type="number"
                                min={1}
                                value={draft.guests}
                                onChange={(e) =>
                                    setDraft({ ...draft, guests: Number(e.target.value) })
                                }
                                required
                                error={maybe(errorOf(errors, 'guests'), locale)}
                            />
                            <Field
                                fieldId="room-field-maxGuests"
                                label={tr(S.maxGuests, locale)}
                                type="number"
                                min={1}
                                value={draft.maxGuests}
                                onChange={(e) =>
                                    setDraft({ ...draft, maxGuests: Number(e.target.value) })
                                }
                                hint={tr(S.childCapacityHint, locale)}
                                error={maybe(errorOf(errors, 'maxGuests'), locale)}
                            />
                        </div>

                        {/* AC-9: `editor` KHÔNG thấy ô giá gốc. Điều kiện render trong
                            cùng một form, không tách hai component. */}
                        {canEditPrice && (
                            <Field
                                fieldId="room-field-price"
                                label={tr(S.basePriceLabel, locale)}
                                type="number"
                                min={0}
                                step={50000}
                                value={draft.price}
                                onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
                                required
                                error={maybe(errorOf(errors, 'price'), locale)}
                            />
                        )}

                        <Field
                            fieldId="room-field-area"
                            label={tr(S.displayArea, locale)}
                            value={draft.area}
                            onChange={(e) => setDraft({ ...draft, area: e.target.value })}
                            placeholder="48 m²"
                        />
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
                    <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
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
                        <p className="m-0 font-semibold text-slate-900">
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

function KpiCard({
    label,
    value,
    icon,
    tone = 'text-slate-900',
}: {
    label: string
    value: string
    icon: React.ReactNode
    tone?: string
}) {
    return (
        <div className="bg-white p-2.5 rounded border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">
                    {label}
                </div>
                <div className={`text-base font-extrabold mt-0.5 truncate ${tone}`}>{value}</div>
            </div>
            <div className="w-8 h-8 rounded bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                {icon}
            </div>
        </div>
    )
}
