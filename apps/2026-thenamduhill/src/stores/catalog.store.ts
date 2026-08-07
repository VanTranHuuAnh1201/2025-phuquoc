'use client'

/**
 * Dữ liệu nền admin sửa được: hạng phòng, gói giá, dịch vụ thêm, tài khoản
 * nhận cọc (ticket `100-04` §6.1).
 *
 * ---------------------------------------------------------------- mô hình
 *
 * LỚP ĐÈ (override), KHÔNG sao chép toàn bộ seed vào `localStorage`.
 * Chỉ giữ đúng những trường admin đã đổi, khoá theo id. Rỗng = dùng nguyên seed.
 *
 * Vì sao không chép cả `PropertyData`: chép rồi thì mọi lần sửa nội dung seed
 * (ảnh, mô tả — `200-01`) sẽ bị `localStorage` cũ đè và không ai hiểu vì sao
 * trang khách không đổi. Lớp đè cũng chính là hình dạng payload
 * `PATCH /api/room-types/:id` mà `200-05` sẽ gửi — cố ý, để chuyển giai đoạn
 * không phải đổi cấu trúc dữ liệu (§6.10).
 *
 * ---------------------------------------------- hạn chế đã biết ở GD1
 *
 * ⚠️ Trang khách (theme) nhận dữ liệu qua props từ Server Component nên KHÔNG
 * thấy override ở đây — `localStorage` chỉ tồn tại phía client. Đây là hạn chế
 * **đã biết và chấp nhận được** ở giai đoạn 1, không phải lỗi: luồng đặt phòng
 * (`useQuote`, client) đọc qua lớp merge nên vẫn đúng giá mới. `200-06` xoá
 * hạn chế này khi dữ liệu về Postgres.
 *
 * ⚠️ `getPropertySync()` VẪN là nguồn cho nội dung marketing (tours, dining,
 * gallery…) — không đụng. Chỉ ba danh mục dưới đây đi qua lớp merge.
 *
 * Store chỉ GIỮ state, không chứa công thức tính giá (luật R8) — `buildQuote()`
 * vẫn là nơi duy nhất tính tiền.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getPropertySync, makeLog, ratePlans as seedRatePlans } from '@repo/core'
import type {
    ActivityLog,
    Addon,
    BankConfig,
    RatePlan,
    Room,
    RoomExtra,
} from '@repo/core'
import type { Actor } from './booking.store'

/** Thao tác ghi bị từ chối và vì sao. Cùng họ với `WriteError` của `booking.store`. */
export type CatalogWriteError = 'not-found' | 'duplicate-id' | 'in-use' | 'validation-failed'

/** Ba loại dữ liệu nền có cùng vòng đời CRUD. */
export type CatalogKind = 'room' | 'rate-plan' | 'addon'

/** Phần hạng phòng admin sửa được — gộp `Room` và phần mở rộng của nó. */
export type RoomPatch = Partial<Room & Pick<RoomExtra, 'maxGuests'>>

/**
 * Giá trị mặc định lấy đúng `MANUAL.md` M1 (chưa có số tài khoản thật của
 * khách). KHÔNG mở mục ghi nợ mới, KHÔNG dừng workflow.
 */
export const DEFAULT_BANK: BankConfig = {
    bankName: 'MB Bank',
    accountNumber: '9999999999',
    accountHolder: 'RESORT NAM DU HILL',
    defaultDepositPercent: 30,
}

interface CatalogState {
    /** Chỉ những trường admin đã sửa. Khoá = id. Rỗng = dùng nguyên seed. */
    roomOverrides: Record<string, RoomPatch>
    ratePlanOverrides: Record<string, Partial<RatePlan>>
    addonOverrides: Record<string, Partial<Addon>>
    /** Bản ghi admin tạo mới, không có trong seed. */
    roomsAdded: Room[]
    ratePlansAdded: RatePlan[]
    addonsAdded: Addon[]
    /** Id bị xoá — xoá MỀM, bản ghi seed không xoá được thật. */
    removedIds: string[]
    bank: BankConfig
    /** Nhật ký thay đổi dữ liệu nền. `bookingId: 'system'` (§6.7). */
    logs: ActivityLog[]

    updateRoom: (id: string, patch: RoomPatch, actor: Actor) => CatalogWriteError | null
    updateRatePlan: (id: string, patch: Partial<RatePlan>, actor: Actor) => CatalogWriteError | null
    updateAddon: (id: string, patch: Partial<Addon>, actor: Actor) => CatalogWriteError | null

    createRoom: (room: Room, actor: Actor) => CatalogWriteError | null
    createRatePlan: (plan: RatePlan, actor: Actor) => CatalogWriteError | null
    createAddon: (addon: Addon, actor: Actor) => CatalogWriteError | null

    remove: (kind: CatalogKind, id: string, actor: Actor) => CatalogWriteError | null
    setBank: (config: BankConfig, actor: Actor) => CatalogWriteError | null
    resetCatalog: () => void
}

function initialState() {
    return {
        roomOverrides: {} as Record<string, RoomPatch>,
        ratePlanOverrides: {} as Record<string, Partial<RatePlan>>,
        addonOverrides: {} as Record<string, Partial<Addon>>,
        roomsAdded: [] as Room[],
        ratePlansAdded: [] as RatePlan[],
        addonsAdded: [] as Addon[],
        removedIds: [] as string[],
        bank: { ...DEFAULT_BANK },
        logs: [] as ActivityLog[],
    }
}

/** Một dòng nhật ký cho thay đổi dữ liệu nền. */
function catalogLog(
    actor: Actor,
    action: 'created' | 'price-adjusted' | 'note-added',
    field: string,
    note: string,
): ActivityLog {
    return makeLog({
        // `ActivityLog.bookingId` bắt buộc, mà thay đổi dữ liệu nền không thuộc
        // đơn nào. Chốt v1.0.0: dùng 'system' để dòng thời gian của từng đơn
        // không bị nhiễm — mọi truy vấn đều lọc theo bookingId cụ thể (§6.7).
        bookingId: 'system',
        at: new Date().toISOString(),
        actor,
        action,
        field,
        note,
    })
}

export const useCatalogStore = create<CatalogState>()(
    persist(
        (set, get) => ({
            ...initialState(),

            // ------------------------------------------------------------ sửa

            /**
             * Sửa một hạng phòng.
             *
             * ⚠️ KHÔNG viết thêm bất cứ code nào tính lại tiền của đơn đã tạo
             * (§4.2, AC-5). `Booking.priceLines` / `totalAmount` đã chốt số lúc
             * đặt và không bao giờ đọc lại `basePrice`. Đơn cũ đổi tiền là mất
             * niềm tin của cả khách lẫn chủ resort.
             */
            updateRoom: (id, patch, actor) => {
                const state = get()
                if (!allRoomIds(state).includes(id)) return 'not-found'

                // Bản ghi admin tự tạo thì sửa thẳng, không cần lớp đè.
                const addedIndex = state.roomsAdded.findIndex((r) => r.id === id)
                if (addedIndex >= 0) {
                    const next = [...state.roomsAdded]
                    const target = next[addedIndex]
                    if (!target) return 'not-found'
                    next[addedIndex] = { ...target, ...patch }
                    set({
                        roomsAdded: next,
                        logs: [...state.logs, catalogLog(actor, 'price-adjusted', 'room', id)],
                    })
                    return null
                }

                set({
                    roomOverrides: {
                        ...state.roomOverrides,
                        [id]: { ...state.roomOverrides[id], ...patch },
                    },
                    logs: [...state.logs, catalogLog(actor, 'price-adjusted', 'room', id)],
                })
                return null
            },

            updateRatePlan: (id, patch, actor) => {
                const state = get()
                if (!allRatePlanIds(state).includes(id)) return 'not-found'

                const addedIndex = state.ratePlansAdded.findIndex((p) => p.id === id)
                if (addedIndex >= 0) {
                    const next = [...state.ratePlansAdded]
                    const target = next[addedIndex]
                    if (!target) return 'not-found'
                    next[addedIndex] = { ...target, ...patch }
                    set({
                        ratePlansAdded: next,
                        logs: [...state.logs, catalogLog(actor, 'price-adjusted', 'rate-plan', id)],
                    })
                    return null
                }

                set({
                    ratePlanOverrides: {
                        ...state.ratePlanOverrides,
                        [id]: { ...state.ratePlanOverrides[id], ...patch },
                    },
                    logs: [...state.logs, catalogLog(actor, 'price-adjusted', 'rate-plan', id)],
                })
                return null
            },

            updateAddon: (id, patch, actor) => {
                const state = get()
                if (!allAddonIds(state).includes(id)) return 'not-found'

                const addedIndex = state.addonsAdded.findIndex((a) => a.id === id)
                if (addedIndex >= 0) {
                    const next = [...state.addonsAdded]
                    const target = next[addedIndex]
                    if (!target) return 'not-found'
                    next[addedIndex] = { ...target, ...patch }
                    set({
                        addonsAdded: next,
                        logs: [...state.logs, catalogLog(actor, 'price-adjusted', 'addon', id)],
                    })
                    return null
                }

                set({
                    addonOverrides: {
                        ...state.addonOverrides,
                        [id]: { ...state.addonOverrides[id], ...patch },
                    },
                    logs: [...state.logs, catalogLog(actor, 'price-adjusted', 'addon', id)],
                })
                return null
            },

            // ---------------------------------------------------------- tạo mới

            createRoom: (room, actor) => {
                const state = get()
                if (allRoomIds(state).includes(room.id)) return 'duplicate-id'
                set({
                    roomsAdded: [room, ...state.roomsAdded],
                    removedIds: state.removedIds.filter((r) => r !== room.id),
                    logs: [...state.logs, catalogLog(actor, 'created', 'room', room.id)],
                })
                return null
            },

            createRatePlan: (plan, actor) => {
                const state = get()
                if (allRatePlanIds(state).includes(plan.id)) return 'duplicate-id'
                set({
                    ratePlansAdded: [plan, ...state.ratePlansAdded],
                    removedIds: state.removedIds.filter((r) => r !== plan.id),
                    logs: [...state.logs, catalogLog(actor, 'created', 'rate-plan', plan.id)],
                })
                return null
            },

            createAddon: (addon, actor) => {
                const state = get()
                if (allAddonIds(state).includes(addon.id)) return 'duplicate-id'
                set({
                    addonsAdded: [addon, ...state.addonsAdded],
                    removedIds: state.removedIds.filter((r) => r !== addon.id),
                    logs: [...state.logs, catalogLog(actor, 'created', 'addon', addon.id)],
                })
                return null
            },

            // -------------------------------------------------------------- xoá

            /**
             * Xoá MỀM: id vào `removedIds`, bản ghi seed vẫn nằm nguyên.
             *
             * Chặn xoá khi còn đơn đang dùng là việc của tầng gọi — store không
             * đọc `booking.store` để tránh phụ thuộc vòng. Màn hình gọi
             * `countBookingsUsing()` trước rồi mới gọi `remove()`.
             */
            remove: (kind, id, actor) => {
                const state = get()
                const exists =
                    kind === 'room'
                        ? allRoomIds(state).includes(id)
                        : kind === 'rate-plan'
                          ? allRatePlanIds(state).includes(id)
                          : allAddonIds(state).includes(id)
                if (!exists) return 'not-found'
                if (state.removedIds.includes(id)) return null

                set({
                    removedIds: [...state.removedIds, id],
                    logs: [...state.logs, catalogLog(actor, 'note-added', kind, `removed:${id}`)],
                })
                return null
            },

            // --------------------------------------------------- cấu hình cọc

            setBank: (config, actor) => {
                const state = get()
                set({
                    bank: config,
                    logs: [
                        ...state.logs,
                        catalogLog(actor, 'note-added', 'bank', config.accountNumber),
                    ],
                })
                return null
            },

            resetCatalog: () => set(initialState()),
        }),
        { name: 'namduhill.catalog', version: 1 },
    ),
)

// ==================================================================== merge
//
// Hàm THUẦN, đặt cạnh store chứ KHÔNG vào `packages/core` — core không được
// biết tới `localStorage` hay khái niệm "admin đã sửa" ở GD1 (§6.2).

type CatalogSnapshot = Pick<
    CatalogState,
    | 'roomOverrides'
    | 'ratePlanOverrides'
    | 'addonOverrides'
    | 'roomsAdded'
    | 'ratePlansAdded'
    | 'addonsAdded'
    | 'removedIds'
>

function allRoomIds(state: CatalogSnapshot): string[] {
    return [...getPropertySync().rooms.map((r) => r.id), ...state.roomsAdded.map((r) => r.id)]
}

function allRatePlanIds(state: CatalogSnapshot): string[] {
    return [...seedRatePlans.map((p) => p.id), ...state.ratePlansAdded.map((p) => p.id)]
}

function allAddonIds(state: CatalogSnapshot): string[] {
    return [...getPropertySync().addons.map((a) => a.id), ...state.addonsAdded.map((a) => a.id)]
}

/**
 * Seed + đã thêm − đã xoá, đã áp override.
 *
 * Override cho id không còn tồn tại trong seed bị BỎ QUA — không tạo bản ghi
 * ma. Đây là tình huống thật khi `200-01` gỡ một hạng phòng khỏi seed mà máy
 * admin còn `localStorage` cũ (§6.12).
 */
export function mergeRooms(state: CatalogSnapshot): Room[] {
    return [...state.roomsAdded, ...getPropertySync().rooms]
        .filter((r) => !state.removedIds.includes(r.id))
        .map((r) => ({ ...r, ...state.roomOverrides[r.id] }))
}

export function mergeRatePlans(state: CatalogSnapshot): RatePlan[] {
    return [...state.ratePlansAdded, ...seedRatePlans]
        .filter((p) => !state.removedIds.includes(p.id))
        .map((p) => ({ ...p, ...state.ratePlanOverrides[p.id] }))
}

/**
 * Addon xoá mềm vẫn nằm trong danh sách (`Booking.addons` của đơn cũ tham
 * chiếu tới) — tầng hiển thị tự lọc theo `removedIds` nếu cần (§6.12).
 */
export function mergeAddons(state: CatalogSnapshot): Addon[] {
    return [...state.addonsAdded, ...getPropertySync().addons].map((a) => ({
        ...a,
        ...state.addonOverrides[a.id],
    }))
}

/** Phần mở rộng của hạng phòng, có áp `maxGuests` admin đã sửa. */
export function mergeRoomExtras(state: CatalogSnapshot): Record<string, RoomExtra> {
    const seed = getPropertySync().roomExtras
    const out: Record<string, RoomExtra> = {}
    for (const [id, extra] of Object.entries(seed)) {
        const maxGuests = state.roomOverrides[id]?.maxGuests
        out[id] = typeof maxGuests === 'number' ? { ...extra, maxGuests } : extra
    }
    return out
}
