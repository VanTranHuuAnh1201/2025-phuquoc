/** 🔒 INTERFACE FROZEN — 08/08/2026 — ndh-sa (ticket `380-02`)
 *
 *  Đổi bất kỳ interface nào trong file này phải qua ticket `900-*` + `ndh-sa`
 *  duyệt. Không sửa lén: FE code theo bản cũ mà không biết thì đến lượt 5 mới
 *  vỡ, lúc đó phải sửa cả hai bên.
 *
 *  Đã đối chiếu DB sống ngày 08/08/2026 (`information_schema.columns` +
 *  `pg_constraint`) — không phải đọc file migration. 6/6 câu hỏi review PASS.
 */

/**
 * Hợp đồng API — Request / Response / Error cho mọi endpoint mà release v1.0.1
 * chạm tới (ticket `380-01`).
 *
 * ─── VÌ SAO FILE NÀY TỒN TẠI ───────────────────────────────────────────────
 *
 * Mô hình contract-first do chủ dự án chốt: **FE không cần route chạy được, FE
 * cần biết hình dạng dữ liệu.** Tách hai thứ đó ra thì lượt FE code và lượt BE
 * viết thân hàm chạy song song thật, không ai chờ ai.
 *
 * File này là **điểm đồng bộ duy nhất** của cả release. BE sở hữu, FE chỉ đọc.
 * Đổi bất cứ interface nào sau khi `380-02` freeze phải qua ticket `900-*` +
 * `ndh-sa` duyệt + tăng cột `v` ở API_INTEGRATION_MAP.
 *
 * ─── LUẬT ÁP DỤNG ──────────────────────────────────────────────────────────
 *
 *   R2/BE9   Chỉ `interface`/`type` — KHÔNG một dòng thân hàm nào. Chạy được
 *            trong Node thuần, không JSX/CSS/browser API.
 *   R6/C7    Mọi chuỗi khách nhìn thấy là `I18nText`, không phải `string`.
 *   C6       Tiền là `number` VNĐ **nguyên**. Ngày lịch là chuỗi `YYYY-MM-DD`,
 *            timestamp là chuỗi ISO 8601 — KHÔNG bao giờ `Date` object.
 *   BE1      Hợp đồng `{ success, data, error }` — xem `ApiEnvelope` bên dưới.
 *   BE8      SQL là nguồn sự thật. Mọi enum dưới đây đã đối chiếu CHECK
 *            constraint thật trong DB ngày 08/08/2026, không phải suy đoán.
 *
 * ─── BẰNG CHỨNG SCHEMA (đọc `information_schema` + `pg_constraint` DB sống) ──
 *
 *   payments.method    ∈ bank-transfer | card | at-property | momo   ← GẠCH NGANG
 *   payments.kind      ∈ deposit | balance | refund | surcharge
 *   bookings.status    ∈ pending_payment | confirmed | checked_in |
 *                        checked_out | cancelled | no_show | expired
 *   bookings.channel   ∈ web | phone | walk-in | ota
 *   room_units.status  ∈ available | occupied | dirty | cleaning | maintenance
 *
 *   ⚠️ KIỂU ID — chỗ này rất dễ sai:
 *     room_types.id   text  slug  `^[a-z0-9][a-z0-9-]{1,62}$`   (chk_room_types_id_slug)
 *     rate_plans.id   text  slug  cùng ràng buộc                (chk_rate_plans_id_slug)
 *     addons.id       text  slug  cùng ràng buộc                (chk_addons_id_slug)
 *     promotions.id   text  slug  cùng ràng buộc
 *     bookings.id     uuid
 *     room_units.id   uuid        ← KHÔNG phải slug (bẫy đã gặp ở M6)
 *     accounts.id     uuid
 *
 *   Nói cách khác: **không phải id nào cũng UUID.** Danh mục dùng slug do người
 *   đặt, đơn hàng và phòng vật lý dùng UUID do DB sinh. Gửi nhầm chiều nào cũng
 *   ra `22P02 invalid input syntax for type uuid`.
 */

import type { I18nText } from '@repo/utils'
import type {
    AppliedPromotion,
    AvailabilityResult,
    BookingPriceLine,
    BookingStatus,
    CancellationRule,
    Channel,
    GuestCount,
    PaymentMethod,
} from './booking-types'
import type { RoomGroup } from './types'

// ═══════════════════════════════════════════════════════════ khung chung BE1

/**
 * Vỏ response chuẩn — MỌI Route Handler trả đúng hình dạng này (luật BE1).
 * Khớp một-một với `ok()` / `fail()` ở `src/lib/auth/errors.ts`.
 */
export type ApiEnvelope<TData, TError extends ApiErrorShape = ApiErrorShape> =
    | { success: true; data: TData; error: null }
    | { success: false; data: null; error: TError }

/** Hình dạng tối thiểu của một lỗi API. `message` LUÔN song ngữ, không `string`. */
export interface ApiErrorShape {
    code: string
    message: I18nText
}

/**
 * Hai lỗi xác thực dùng chung, phải **phân biệt được** ở mọi endpoint cần auth.
 *
 * FE xử lý khác hẳn nhau (luật FE4):
 *   401 → điều hướng `/login?next=<đường dẫn hiện tại>`
 *   403 → hiện "Tài khoản của bạn không có quyền thực hiện thao tác này"
 *
 * ⚠️ Mã 401 là `UNAUTHENTICATED`, KHÔNG phải `UNAUTHORIZED`. Đây là giá trị
 * `withAuthGuard()` đang ném thật (`src/lib/auth/guard.ts:96`) — code là nguồn
 * sự thật, tài liệu bám theo code.
 */
export type AuthErrorUnion =
    /** 401 — không cookie · chữ ký sai · token hết hạn · tài khoản không còn. */
    | { code: 'UNAUTHENTICATED'; message: I18nText }
    /** 403 — đã đăng nhập nhưng `active = false`. */
    | { code: 'ACCOUNT_DISABLED'; message: I18nText }
    /** 403 — đã đăng nhập, đúng tài khoản, nhưng thiếu permission. */
    | { code: 'FORBIDDEN'; message: I18nText }

/** 500 — lỗi hệ thống, không lộ chi tiết nội bộ ra ngoài. */
export interface InternalError {
    code: 'INTERNAL_ERROR'
    message: I18nText
}

/** 400 — dữ liệu vào sai định dạng hoặc thiếu trường bắt buộc. */
export interface ValidationError {
    code: 'VALIDATION_FAILED'
    message: I18nText
    /** Trường nào sai — FE gắn thông báo vào đúng ô nhập. */
    fields?: ValidationFieldError[]
}

export interface ValidationFieldError {
    /** Đường dẫn tới trường, ví dụ `name.vi` hoặc `capacity.adults`. */
    field: string
    message: I18nText
}

/** 429 — vượt giới hạn tần suất. Route công khai nào cũng phải có. */
export interface RateLimitedError {
    code: 'RATE_LIMITED'
    message: I18nText
    /** Số giây nên đợi trước khi thử lại. */
    retryAfterSeconds?: number
}

/** 404 — không tìm thấy tài nguyên. */
export interface NotFoundError {
    code: 'NOT_FOUND'
    message: I18nText
}

/**
 * Quyền cần có để gọi một endpoint. Khai bằng chuỗi để file này không phụ
 * thuộc thứ tự khai báo của `permissions.ts` — giá trị đối chiếu bằng mắt với
 * `Permission` ở đó.
 */
export type RequiredPermission =
    | 'booking.view.all'
    | 'booking.view.own'
    | 'booking.create'
    | 'booking.change-status'
    | 'booking.cancel'
    | 'booking.cancel.own'
    | 'booking.refund'
    | 'booking.surcharge'
    | 'inventory.view'
    | 'inventory.edit'
    | 'price.view'
    | 'price.edit'
    | 'promotion.view'
    | 'promotion.edit'
    | 'content.edit'
    | 'account.manage'
    | 'settings.bank'
    | 'report.view'
    | 'report.view.full'
    /** Route công khai — không cần đăng nhập. */
    | 'public'

// ══════════════════════════════════════════ M9 · Danh mục — hạng phòng (390-01)

/**
 * `GET /api/admin/room-types` — danh sách hạng phòng cho CMS.
 * Quyền: `price.view` (lễ tân CÓ quyền xem, KHÔNG có quyền sửa).
 *
 * Khác `GET /api/rooms` của trang khách: trả cả hạng `active = false` để admin
 * còn bật lại được, và kèm `unitCount` để biết xoá có an toàn không.
 */
export interface ListRoomTypesRequest {
    /** Mặc định `false` — chỉ trả hạng đang bán. `true` = trả cả hạng đã tắt. */
    includeInactive?: boolean
}

export interface ListRoomTypesResponse {
    items: RoomTypeDto[]
    total: number
}

export type ListRoomTypesError = AuthErrorUnion | InternalError

/**
 * Một hạng phòng như CMS nhìn thấy.
 *
 * Cột DB tương ứng ghi kèm vì snake_case ⇄ camelCase là chỗ hay lệch nhất.
 */
export interface RoomTypeDto {
    /** `room_types.id` — **slug** `^[a-z0-9][a-z0-9-]{1,62}$`, KHÔNG phải UUID. */
    id: string
    /** `room_types.name` jsonb — DB có CHECK bắt buộc đủ `vi` + `en` khác rỗng. */
    name: I18nText
    /** `room_types.description`. */
    description: I18nText
    /** `room_types.area` — chuỗi hiển thị nguyên văn, ví dụ `"48 m²"`. */
    area: string
    /** `room_types.guests` — số khách tiêu chuẩn. CHECK `guests > 0`. */
    guests: number
    /** `room_types.max_guests` — CHECK `max_guests >= guests`. */
    maxGuests: number
    /** `room_types.default_guests`. */
    defaultGuests: number
    /** `room_types.base_price` numeric — VNĐ nguyên. CHECK `>= 0`. */
    basePrice: number
    /** `room_types.extra_bed` — phụ thu giường phụ, VNĐ nguyên. */
    extraBed: number
    /** `room_types.extra_bed_fee` — nullable trong DB. */
    extraBedFee?: number
    /** `room_types.group` — CHECK ∈ `couple | family | suite`, cho phép NULL. */
    group?: RoomGroup
    /** `room_types.tags` jsonb — mảng I18nText. */
    tags: I18nText[]
    /** `room_types.images` jsonb — mảng URL. */
    images: string[]
    /** `room_types.bed` / `.view` / `.long_desc` / `.long_desc_2` — nullable. */
    bed?: I18nText
    view?: I18nText
    longDesc?: I18nText
    longDesc2?: I18nText
    /** `room_types.amenities` / `.conditions` jsonb. */
    amenities: I18nText[]
    conditions: I18nText[]
    /** `room_types.sort_order`. */
    sortOrder: number
    /** `room_types.active` — soft delete dùng cờ này (xem `DeleteRoomTypeResponse`). */
    active: boolean
    /** ISO 8601. */
    createdAt: string
    updatedAt: string
    /**
     * Số `room_units` đang trỏ vào hạng này. Không phải cột DB — API đếm thêm.
     * CMS dùng để cảnh báo trước khi tắt bán một hạng còn phòng vật lý.
     */
    unitCount?: number
}

/**
 * `POST /api/admin/room-types` — tạo hạng phòng mới.
 * Quyền: `price.edit` — **lễ tân KHÔNG có** (`booking-domain.md §B8`).
 */
export interface CreateRoomTypeRequest {
    /**
     * Slug do người đặt, phải khớp `^[a-z0-9][a-z0-9-]{1,62}$`.
     * Không gửi → server tự sinh từ `name.en`. Sai định dạng → 400.
     */
    id?: string
    /** BẮT BUỘC đủ `vi` + `en`, cả hai khác rỗng — DB có CHECK, thiếu là 400. */
    name: I18nText
    description: I18nText
    area: string
    guests: number
    maxGuests: number
    defaultGuests: number
    /** VNĐ nguyên, `>= 0`. */
    basePrice: number
    extraBed?: number
    extraBedFee?: number
    group?: RoomGroup
    tags?: I18nText[]
    images?: string[]
    bed?: I18nText
    view?: I18nText
    longDesc?: I18nText
    longDesc2?: I18nText
    amenities?: I18nText[]
    conditions?: I18nText[]
    sortOrder?: number
    active?: boolean
}

/** 201 khi tạo thành công. Trả bản ghi đầy đủ để CMS không phải gọi lại GET. */
export interface CreateRoomTypeResponse {
    item: RoomTypeDto
}

export type CreateRoomTypeError =
    | ValidationError // 400 — thiếu {vi,en}, slug sai, maxGuests < guests, basePrice < 0
    | AuthErrorUnion // 401 UNAUTHENTICATED · 403 ACCOUNT_DISABLED/FORBIDDEN
    | { code: 'DUPLICATE_ID'; message: I18nText } // 409 — slug đã tồn tại
    | InternalError // 500

/**
 * `PATCH /api/admin/room-types/[id]` — sửa một phần.
 * Quyền: `price.edit`.
 *
 * Mọi trường tuỳ chọn: không gửi = giữ nguyên. Gửi `null` KHÔNG được hỗ trợ —
 * muốn xoá giá trị nullable thì gửi chuỗi rỗng / mảng rỗng theo đúng kiểu.
 */
export interface UpdateRoomTypeRequest {
    name?: I18nText
    description?: I18nText
    area?: string
    guests?: number
    maxGuests?: number
    defaultGuests?: number
    basePrice?: number
    extraBed?: number
    extraBedFee?: number
    group?: RoomGroup
    tags?: I18nText[]
    images?: string[]
    bed?: I18nText
    view?: I18nText
    longDesc?: I18nText
    longDesc2?: I18nText
    amenities?: I18nText[]
    conditions?: I18nText[]
    sortOrder?: number
    active?: boolean
}

export interface UpdateRoomTypeResponse {
    item: RoomTypeDto
}

export type UpdateRoomTypeError =
    | ValidationError // 400
    | AuthErrorUnion // 401 / 403
    | NotFoundError // 404 — slug không tồn tại
    | InternalError // 500

/**
 * `DELETE /api/admin/room-types/[id]` — **soft delete** (đặt `active = false`).
 * Quyền: `price.edit`.
 *
 * ⚠️ KHÔNG xoá vật lý: `bookings.room_type_id` là khoá ngoại trỏ vào đây. Xoá
 * cứng một hạng đang có đơn sẽ làm mất lịch sử đơn — thứ tranh chấp được với
 * khách. Hạng còn đơn chưa đóng → **409** kèm số đơn còn lại để admin biết
 * phải xử lý bao nhiêu, không phải mò.
 */
export interface DeleteRoomTypeRequest {
    /** Không có body. Id nằm trên đường dẫn. */
    readonly _noBody?: never
}

export interface DeleteRoomTypeResponse {
    id: string
    /** Luôn `false` sau khi soft delete — nói rõ đây không phải xoá cứng. */
    active: false
    /** `true` để FE hiển thị đúng chữ "Đã ngừng bán", không phải "Đã xoá". */
    softDeleted: true
}

export type DeleteRoomTypeError =
    | AuthErrorUnion // 401 / 403
    | NotFoundError // 404
    | {
          // 409 — còn đơn chưa đóng (pending_payment | confirmed | checked_in)
          code: 'ROOM_TYPE_IN_USE'
          message: I18nText
          /** Số đơn còn hoạt động — FE hiện thẳng con số này cho admin. */
          activeBookingCount: number
      }
    | InternalError // 500

// ═══════════════════════════════════════════ M9 · Danh mục — gói giá (390-01)

/**
 * `GET /api/admin/rate-plans` — danh sách gói giá.
 * Quyền: `price.view`.
 */
export interface ListRatePlansRequest {
    includeInactive?: boolean
    /** Lọc gói áp cho một hạng phòng cụ thể (slug). */
    roomTypeId?: string
}

export interface ListRatePlansResponse {
    items: RatePlanDto[]
    total: number
}

export type ListRatePlansError = AuthErrorUnion | InternalError

export interface RatePlanDto {
    /** `rate_plans.id` — **slug**, không phải UUID. */
    id: string
    name: I18nText
    description: I18nText
    /** `rate_plans.adjust_percent` — CHECK `> -100`. `-15` = rẻ hơn 15%. */
    adjustPercent: number
    includesBreakfast: boolean
    /** `rate_plans.refundable` — CHECK: `false` thì `cancellationRules` phải RỖNG. */
    refundable: boolean
    /** Bậc thang hoàn tiền (`booking-domain.md §B5`). */
    cancellationRules: CancellationRule[]
    /** `rate_plans.deposit_percent` — CHECK `0 <= x <= 100`. */
    depositPercent: number
    /** Slug các hạng phòng áp dụng. Rỗng = mọi hạng. */
    roomTypeIds: string[]
    active: boolean
    createdAt: string
    updatedAt: string
}

/**
 * `POST /api/admin/rate-plans` — tạo gói giá.
 * Quyền: `price.edit` — lễ tân KHÔNG có.
 */
export interface CreateRatePlanRequest {
    id?: string
    name: I18nText
    description: I18nText
    adjustPercent: number
    includesBreakfast?: boolean
    refundable?: boolean
    /** Phải rỗng khi `refundable = false` — DB có CHECK, sai là 400. */
    cancellationRules?: CancellationRule[]
    depositPercent: number
    roomTypeIds?: string[]
    active?: boolean
}

export interface CreateRatePlanResponse {
    item: RatePlanDto
}

export type CreateRatePlanError =
    | ValidationError // 400 — thiếu {vi,en}, adjustPercent <= -100, deposit ngoài 0..100
    | AuthErrorUnion // 401 / 403
    | { code: 'DUPLICATE_ID'; message: I18nText } // 409
    | {
          // 400 — vi phạm chk_rate_plans_refund: không hoàn nhưng vẫn khai bậc thang
          code: 'REFUND_RULES_CONFLICT'
          message: I18nText
      }
    | InternalError // 500

/** `PATCH /api/admin/rate-plans/[id]`. Quyền: `price.edit`. */
export interface UpdateRatePlanRequest {
    name?: I18nText
    description?: I18nText
    adjustPercent?: number
    includesBreakfast?: boolean
    refundable?: boolean
    cancellationRules?: CancellationRule[]
    depositPercent?: number
    roomTypeIds?: string[]
    active?: boolean
}

export interface UpdateRatePlanResponse {
    item: RatePlanDto
}

export type UpdateRatePlanError =
    | ValidationError // 400
    | AuthErrorUnion // 401 / 403
    | NotFoundError // 404
    | { code: 'REFUND_RULES_CONFLICT'; message: I18nText } // 400
    | InternalError // 500

/**
 * `DELETE /api/admin/rate-plans/[id]` — soft delete (`active = false`).
 * Quyền: `price.edit`. Cùng lý do với hạng phòng: `bookings.rate_plan_id` là FK.
 */
export interface DeleteRatePlanResponse {
    id: string
    active: false
    softDeleted: true
}

export type DeleteRatePlanError =
    | AuthErrorUnion // 401 / 403
    | NotFoundError // 404
    | {
          code: 'RATE_PLAN_IN_USE'
          message: I18nText
          activeBookingCount: number
      } // 409
    | InternalError // 500

// ═══════════════════════════════════════════ M9 · Danh mục — dịch vụ (390-01)

/**
 * `GET /api/admin/addons` — danh sách dịch vụ thêm.
 * Quyền: `content.edit` — **khác hai nhóm trên**: dịch vụ là nội dung, không
 * phải giá phòng, nên biên tập viên sửa được mà không cần `price.edit`.
 */
export interface ListAddonsRequest {
    includeInactive?: boolean
}

export interface ListAddonsResponse {
    items: AddonDto[]
    total: number
}

export type ListAddonsError = AuthErrorUnion | InternalError

export interface AddonDto {
    /** `addons.id` — **slug**, ví dụ `addon-ferry`. Không phải UUID. */
    id: string
    name: I18nText
    /** `addons.price` numeric — VNĐ nguyên. CHECK `>= 0`. */
    price: number
    /** `addons.unit` jsonb I18nText — ví dụ `{vi:"khách / chiều", en:"guest / way"}`. */
    unit: I18nText
    sortOrder: number
    active: boolean
    createdAt: string
    updatedAt: string
}

/** `POST /api/admin/addons`. Quyền: `content.edit`. */
export interface CreateAddonRequest {
    id?: string
    name: I18nText
    price: number
    unit: I18nText
    sortOrder?: number
    active?: boolean
}

export interface CreateAddonResponse {
    item: AddonDto
}

export type CreateAddonError =
    | ValidationError // 400 — thiếu {vi,en}, price < 0, slug sai
    | AuthErrorUnion // 401 / 403
    | { code: 'DUPLICATE_ID'; message: I18nText } // 409
    | InternalError // 500

/** `PATCH /api/admin/addons/[id]`. Quyền: `content.edit`. */
export interface UpdateAddonRequest {
    name?: I18nText
    price?: number
    unit?: I18nText
    sortOrder?: number
    active?: boolean
}

export interface UpdateAddonResponse {
    item: AddonDto
}

export type UpdateAddonError =
    | ValidationError // 400
    | AuthErrorUnion // 401 / 403
    | NotFoundError // 404
    | InternalError // 500

/**
 * `DELETE /api/admin/addons/[id]` — soft delete (`active = false`).
 * Quyền: `content.edit`.
 *
 * Addon đã bán nằm trong `bookings.addons` jsonb (id → số lượng), không phải
 * khoá ngoại. Nhưng xoá cứng vẫn làm breakdown giá của đơn cũ mất tên dịch vụ
 * ⇒ vẫn soft delete.
 */
export interface DeleteAddonResponse {
    id: string
    active: false
    softDeleted: true
}

export type DeleteAddonError =
    | AuthErrorUnion // 401 / 403
    | NotFoundError // 404
    | InternalError // 500

// ══════════════════════════════════ M9 · Cấu hình ngân hàng nhận cọc (390-01)

/**
 * `GET /api/admin/settings/bank` — đọc tài khoản ngân hàng nhận cọc.
 * Quyền: `settings.bank` — **chỉ `owner`**. Manager và lễ tân đều KHÔNG có.
 *
 * ⚠️ NỢ SCHEMA — `ndh-sa` phải chốt ở `380-02`:
 * `booking-types.ts` khai `BankConfig` và ghi rằng nó map vào
 * `property_settings.bank` (jsonb). **Cột đó chưa tồn tại trong DB.** Đã đọc
 * `information_schema.columns` ngày 08/08/2026: `property_settings` chỉ có
 * `id, brand, hero, about, facts, nav, transport, notes, child_policy,
 * created_at, updated_at`.
 *
 * ⇒ `390-01` phải thêm migration `ALTER TABLE property_settings ADD COLUMN bank
 * jsonb NOT NULL DEFAULT '{}'` trước khi viết route, nếu không sẽ ăn
 * `42703 column does not exist`.
 */
export interface GetBankSettingsRequest {
    readonly _noBody?: never
}

export interface GetBankSettingsResponse {
    bank: BankSettingsDto
}

export type GetBankSettingsError = AuthErrorUnion | InternalError

/**
 * Khớp `BankConfig` ở `booking-types.ts`. Mọi trường tuỳ chọn ở tầng đọc vì
 * cơ sở mới cài đặt chưa nhập gì — FE phải chịu được trạng thái rỗng, không
 * được giả định đã có số tài khoản.
 */
export interface BankSettingsDto {
    bankName?: string
    accountNumber?: string
    accountHolder?: string
    /** % cọc mặc định khi `RatePlan` không khai riêng. `0 <= x <= 100`. */
    defaultDepositPercent?: number
}

/**
 * `PATCH /api/admin/settings/bank` — sửa cấu hình ngân hàng.
 * Quyền: `settings.bank`.
 *
 * Đây là thông tin khách chuyển tiền vào. Sai một chữ số là tiền cọc đi lạc,
 * nên mọi lần sửa phải ghi `ActivityLog` kèm giá trị cũ (luật BE5).
 */
export interface UpdateBankSettingsRequest {
    bankName?: string
    accountNumber?: string
    accountHolder?: string
    defaultDepositPercent?: number
}

export interface UpdateBankSettingsResponse {
    bank: BankSettingsDto
    /** ISO 8601 — `property_settings.updated_at` sau khi ghi. */
    updatedAt: string
}

export type UpdateBankSettingsError =
    | ValidationError // 400 — defaultDepositPercent ngoài 0..100, số TK không phải chữ số
    | AuthErrorUnion // 401 / 403 (manager và lễ tân rơi vào 403)
    | InternalError // 500

// ═════════════════════════════════ M11 · Tra cứu đơn công khai (390-03)

/**
 * `GET /api/bookings/lookup?code=…&phone=…` — tra cứu đơn **KHÔNG cần đăng nhập**.
 * Quyền: `public`.
 *
 * ─── VÌ SAO PHẢI CÓ ROUTE RIÊNG ────────────────────────────────────────────
 *
 * Trang `/lookup` đang gọi `GET /api/bookings?code=&phone=`, mà route đó bọc
 * `withAuthGuard` ⇒ trả **401** cho khách chưa đăng nhập (đo bằng `curl` không
 * cookie). `app-flows.md §F4` yêu cầu tra cứu không cần đăng nhập — rất hay
 * dùng khi người này đặt hộ người khác.
 *
 * ─── VÌ SAO KHÔNG DÙNG RLS ─────────────────────────────────────────────────
 *
 * Policy SELECT của `bookings` là `customer_id = current_account_id()`. Khách
 * chưa đăng nhập không có id ⇒ hàm đó rỗng ⇒ luôn trả `[]`. Route này lọc ở
 * **tầng ứng dụng** bằng cặp `code` + `phone`, không dựa RLS.
 *
 * ─── HAI ĐIỀU BẮT BUỘC ─────────────────────────────────────────────────────
 *
 * ① Bắt buộc **cả hai** `code` và `phone`, thiếu một cái → 400. Chỉ có `code`
 *    là ai đoán được mã đơn cũng đọc được thông tin khách.
 * ② **Sai `phone`** và **`code` không tồn tại** phải trả **CÙNG MỘT** mã lỗi và
 *    CÙNG MỘT thông báo (`LOOKUP_FAILED`). Phân biệt hai trường hợp là lộ mã
 *    đơn nào có thật ⇒ dò được toàn bộ dải mã.
 */
export interface LookupBookingRequest {
    /** Mã đơn khách nhìn thấy. So sánh không phân biệt hoa thường. */
    code: string
    /** SĐT người đứng tên đơn, phải khớp `bookings.guest_phone`. */
    phone: string
}

/** Trả đúng **một** đơn — không phải mảng. */
export interface LookupBookingResponse {
    booking: PublicBookingDto
}

export type LookupBookingError =
    | ValidationError // 400 — thiếu code hoặc phone
    | {
          /**
           * 404 — dùng CHUNG cho cả "không có mã này" lẫn "sai số điện thoại".
           * KHÔNG tách thành hai mã. Xem §② ở khối chú thích trên.
           */
          code: 'LOOKUP_FAILED'
          message: I18nText
      }
    | RateLimitedError // 429 — chống dò mã đơn
    | InternalError // 500

/**
 * Đơn hàng ở góc nhìn **công khai** — đã lược bỏ mọi thứ nhạy cảm.
 *
 * KHÔNG có và không được thêm vào: email đầy đủ · CCCD (`guest_id_number`) ·
 * địa chỉ · ghi chú nội bộ · `activity_logs` · `check_in_record` /
 * `check_out_record` · `customer_id`.
 *
 * Đây là kiểu riêng, KHÔNG dùng lại `Booking` của `booking-types.ts` — dùng lại
 * là sớm muộn cũng có người `select('*')` rồi rò cả bảng ra internet.
 */
export interface PublicBookingDto {
    /** `bookings.id` — UUID. */
    id: string
    code: string
    status: BookingStatus
    /** Nhãn trạng thái song ngữ, để FE không phải tự map (luật R6). */
    statusLabel: I18nText
    /** YYYY-MM-DD. */
    checkIn: string
    checkOut: string
    nights: number
    /** Slug hạng phòng + tên song ngữ. Không trả toàn bộ bản ghi hạng phòng. */
    roomTypeId: string
    roomTypeName: I18nText
    ratePlanId: string
    ratePlanName: I18nText
    guests: GuestCount
    guest: PublicBookingGuestDto
    /** VNĐ nguyên — 4 con số ở `booking-domain.md §B1`. */
    subtotal: number
    discountTotal: number
    totalAmount: number
    depositAmount: number
    paidAmount: number
    /** `totalAmount - paidAmount`. Server tính, FE không tự trừ. */
    balanceDue: number
    priceLines: BookingPriceLine[]
    appliedPromotions: AppliedPromotion[]
    channel: Channel
    /** ISO 8601. */
    createdAt: string
    /** Chỉ có khi `status = 'cancelled'`. */
    cancellation?: PublicCancellationDto
}

/** Thông tin khách ở mức công khai — **che bớt**, không trả nguyên văn. */
export interface PublicBookingGuestDto {
    fullName: string
    /**
     * SĐT đã che, ví dụ `090****567`. Người tra đã biết số thật (phải nhập mới
     * tra được), trả lại đầy đủ chỉ tăng rủi ro nếu màn hình bị nhìn trộm.
     */
    phoneMasked: string
    /** Email đã che, ví dụ `a***@gmail.com`. KHÔNG bao giờ trả email đầy đủ. */
    emailMasked: string
    estimatedArrivalTime?: string
    specialRequests?: string
}

export interface PublicCancellationDto {
    /** ISO 8601. */
    at: string
    by: 'customer' | 'admin'
    /** VNĐ nguyên. */
    refundAmount: number
}

// ═══════════════════════════════ M2 · Tồn kho & báo giá (đã có, 390-05 nối FE)

/**
 * `POST /api/availability/search` — tra phòng trống + giá cho một khoảng ngày.
 * Quyền: `public` (có rate limit 60 lượt / 60 giây theo IP).
 *
 * ─── VÌ SAO FE PHẢI GỌI ROUTE NÀY ──────────────────────────────────────────
 *
 * Hiện `stores/useQuote.ts:68` gọi `buildQuote()` của `@repo/core` **chạy trong
 * trình duyệt**. Hậu quả: giá khách thấy do client tự tính, giá chốt đơn do
 * server tính — hai đường khác nhau; admin sửa giá gốc trong CMS thì trang
 * khách không đổi vì client đọc seed cục bộ.
 *
 * Công thức vẫn nằm ở `core` — chỉ đổi **nơi chạy**, không đổi phép tính.
 */
export interface AvailabilitySearchRequest {
    /** YYYY-MM-DD. Sai định dạng → 400. */
    checkIn: string
    /** YYYY-MM-DD. Phải **lớn hơn** `checkIn` (DB CHECK `check_out > check_in`). */
    checkOut: string
    guests: {
        adults: number
        /** TUỔI từng trẻ, không phải số lượng (`booking-domain.md §B2`). */
        children: number[]
    }
    /** Slug gói giá. Không gửi = tính theo giá gốc, không áp `adjustPercent`. */
    ratePlanId?: string
}

/**
 * Hình dạng này khớp **đúng** response route đang chạy: `{ rooms: [...] }`,
 * mỗi phần tử `{ room, availability }`.
 *
 * ⚠️ Hạng phòng KHÔNG bán được vẫn nằm trong mảng, kèm
 * `availability.blockedReason` — FE cần biết *vì sao* hết để hiện đúng câu
 * ("Hết phòng cho 20/8–22/8", "Tối thiểu 2 đêm"), không phải lọc đi im lặng.
 */
export interface AvailabilitySearchResponse {
    rooms: AvailabilitySearchItem[]
}

export interface AvailabilitySearchItem {
    room: SearchRoomDto
    availability: AvailabilityResult
}

/** Hạng phòng ở góc nhìn trang tìm kiếm — khớp `Room` của `types.ts`. */
export interface SearchRoomDto {
    /** Slug. */
    id: string
    name: I18nText
    desc: I18nText
    area: string
    guests: number
    /** Giá niêm yết mỗi đêm, VNĐ nguyên. Giá THẬT nằm ở `availability`. */
    price: number
    tags: I18nText[]
    images?: string[]
    group?: RoomGroup
    extraBedFee?: number
    /** Chỉ có khi là **số thật** từ `Inventory` — cấm bịa khan hiếm (luật FE13). */
    remaining?: number
}

export type AvailabilitySearchError =
    | ValidationError // 400 — ngày sai định dạng
    | { code: 'INVALID_DATE_RANGE'; message: I18nText } // 400 — checkOut <= checkIn
    | RateLimitedError // 429
    | InternalError // 500

// ══════════════════════════════ M4/M5 · Huỷ đơn & hoàn tiền (đã có, 390-07)

/**
 * `GET /api/bookings/[id]/cancel/quote` — huỷ bây giờ thì hoàn bao nhiêu.
 * Quyền: `booking.cancel.own` (khách có quyền này cho đơn của chính mình).
 *
 * `[id]` nhận **UUID hoặc mã đơn** — route tự nhận diện bằng regex UUID.
 *
 * Bắt buộc gọi trước khi hiện nút huỷ: `app-flows.md §F4` yêu cầu nút huỷ
 * **hiện rõ mất bao nhiêu tiền trước khi bấm**. Con số đó phải từ server, vì
 * bậc thang hoàn tiền nằm ở `rate_plans.cancellation_rules`.
 */
export interface CancelQuoteRequest {
    readonly _noBody?: never
}

export interface CancelQuoteResponse {
    /** UUID. */
    bookingId: string
    bookingCode: string
    /** YYYY-MM-DD. */
    checkIn: string
    /** VNĐ nguyên — đã thu thực tế. */
    paidAmount: number
    /** % được hoàn theo bậc thang, `0..100`. */
    refundPercent: number
    /** VNĐ nguyên — số tiền hoàn thực tế. FE hiện thẳng con số này. */
    refundAmount: number
    /**
     * Số ngày còn lại tới ngày nhận phòng. Âm = đã quá ngày.
     * FE dùng để giải thích vì sao ra mức % đó.
     */
    daysUntilCheckIn: number
}

export type CancelQuoteError =
    | ValidationError // 400 — thiếu id
    | AuthErrorUnion // 401 / 403 — khách xem đơn người khác rơi vào 403 FORBIDDEN
    | { code: 'BOOKING_NOT_FOUND'; message: I18nText } // 404
    | InternalError // 500

/**
 * `POST /api/bookings/[id]/cancel` — huỷ đơn.
 * Quyền: `booking.cancel.own`. Khách chỉ huỷ được đơn của chính mình (route
 * so `bookings.customer_id` với id trong token).
 *
 * Nhả tồn kho + ghi `ActivityLog` nằm trong RPC `cancel_booking`, cùng một
 * transaction — không tách ra tầng ứng dụng được (luật BE5/BE7).
 */
export interface CancelBookingRequest {
    /** Không gửi → server dùng mặc định `"Khách yêu cầu hủy đơn"`. */
    reason?: string
}

/**
 * ⚠️ Route hiện trả **hàng thô snake_case** của bảng `bookings`, không phải
 * camelCase. Khai đúng như thực tế thay vì khai cái đẹp hơn — FE phải biết để
 * map, nếu không sẽ đọc `undefined` mà typecheck vẫn xanh.
 *
 * `ndh-sa` chốt ở `380-02`: giữ nguyên (FE tự map) hay chuẩn hoá về camelCase
 * (BE phải sửa route, FE sửa một chỗ). Xem §"Điểm cần SA quyết" ở ticket.
 */
export interface CancelBookingResponse {
    id: string
    code: string
    status: BookingStatus
    /** ISO 8601. */
    cancelled_at: string | null
    /** `bookings.cancellation` jsonb — KHÔNG phải `cancellation_reason`. */
    cancellation: {
        at: string
        by: 'customer' | 'admin'
        reason?: string
        refundAmount: number
    } | null
    paid_amount: number
    total_amount: number
    updated_at: string
}

export type CancelBookingError =
    | ValidationError // 400 — thiếu id
    | AuthErrorUnion // 401 / 403
    | { code: 'BOOKING_NOT_FOUND'; message: I18nText } // 404
    | {
          /** 422 — `checked_out`/`cancelled` không huỷ được (đồ thị §B1). */
          code: 'INVALID_TRANSITION'
          message: I18nText
          currentStatus: BookingStatus
      }
    | InternalError // 500

/**
 * `POST /api/bookings/[id]/refund` — ghi một lần hoàn tiền.
 * Quyền: `booking.refund` — **lễ tân KHÔNG có** (chỉ `owner` và `manager`).
 *
 * Tách khỏi `cancel` vì hoàn tiền có thể xảy ra mà không huỷ đơn (hoàn một
 * phần do sự cố phòng), và ngược lại huỷ sát ngày có thể hoàn 0đ.
 */
export interface RefundBookingRequest {
    /** VNĐ nguyên, **> 0**. DB CHECK `payments.amount > 0`. Không vượt `paidAmount`. */
    amount: number
    /**
     * Mặc định `bank-transfer` nếu không gửi.
     * ⚠️ **GẠCH NGANG** — `bank_transfer` sẽ vi phạm `chk_payments_method` (23514).
     */
    paymentMethod?: PaymentMethod
    /** Mã giao dịch. Không gửi → server sinh `REF-<timestamp>`. */
    reference?: string
}

/** Cùng cảnh báo snake_case như `CancelBookingResponse`. */
export interface RefundBookingResponse {
    id: string
    code: string
    status: BookingStatus
    paid_amount: number
    total_amount: number
    updated_at: string
}

export type RefundBookingError =
    | ValidationError // 400 — amount <= 0 hoặc không phải số
    | AuthErrorUnion // 401 / 403 — lễ tân rơi vào 403 FORBIDDEN
    | { code: 'BOOKING_NOT_FOUND'; message: I18nText } // 404
    | {
          /** 400 — hoàn quá số đã thu. */
          code: 'EXCEEDS_PAID_AMOUNT'
          message: I18nText
          paidAmount: number
      }
    | InternalError // 500

// ═══════════════════════════════════ M8 · Upload ảnh (đổi response, 430-01)

/**
 * `POST /api/admin/upload` — tải ảnh lên, server tự tối ưu.
 * Quyền: `content.edit`. Body là `multipart/form-data`, field `file`.
 *
 * ⚠️ **Chỉ THÊM trường, KHÔNG đổi trường cũ.** `url` / `fileName` /
 * `originalBytes` / `optimizedBytes` giữ nguyên ý nghĩa ⇒ `ImageUploadField.tsx`
 * không phải sửa dòng nào; màn nào muốn ảnh responsive thì đọc thêm `srcSet`.
 *
 * Đổi tên hay đổi ý nghĩa trường cũ là hỏng CMS ngay lập tức.
 */
export interface UploadImageRequest {
    /**
     * Gửi qua `FormData`, không phải JSON. Khai ở đây để FE biết tên field.
     * Chấp nhận JPEG · PNG · WebP · AVIF. **Loại SVG** (chứa script được).
     * Trần 15MB.
     */
    file: 'multipart/form-data field named "file"'
}

/** 201 khi tải lên thành công. */
export interface UploadImageResponse {
    /** URL dùng được ngay. **GIỮ NGUYÊN** từ v1.0.0. */
    url: string
    /** **GIỮ NGUYÊN**. */
    fileName: string
    /** Byte trước nén. **GIỮ NGUYÊN**. */
    originalBytes: number
    /** Byte sau nén (bản lớn nhất). **GIỮ NGUYÊN**. */
    optimizedBytes: number

    // ---- THÊM MỚI ở v1.0.1 (`430-01`) — trường cũ không đụng ----

    /**
     * Chuỗi dán thẳng vào `<img srcset>` / `next/image`.
     * 4 bề ngang: 480 · 960 · 1440 · 2000. **Không phóng to** ảnh nhỏ hơn ⇒ ảnh
     * gốc 600px chỉ sinh 480 và 600, `srcSet` ngắn hơn. FE không được giả định
     * luôn đủ 4 mục.
     */
    srcSet: string
    /** Từng biến thể, cho nơi cần kích thước cụ thể thay vì cả chuỗi `srcSet`. */
    variants: UploadImageVariant[]
    /**
     * Ảnh mờ base64 (`data:image/...;base64,...`) cho `next/image`
     * `placeholder="blur"`. Rất nhỏ, nhúng thẳng vào HTML được.
     */
    blurDataURL: string
    /** Bề ngang bản lớn nhất, px. `next/image` cần để chừa chỗ, tránh nhảy layout. */
    width: number
    /** Bề cao bản lớn nhất, px. */
    height: number
}

export interface UploadImageVariant {
    url: string
    /** Bề ngang thật của biến thể, px. */
    width: number
    height: number
    /** `image/webp` hoặc `image/avif`. */
    format: 'image/webp' | 'image/avif'
    bytes: number
}

export type UploadImageError =
    | { code: 'NO_FILE'; message: I18nText } // 400 — chưa chọn tệp
    | { code: 'UNSUPPORTED_TYPE'; message: I18nText } // 400 — SVG hoặc định dạng lạ
    | { code: 'FILE_TOO_LARGE'; message: I18nText } // 400 — vượt 15MB
    | { code: 'INVALID_IMAGE'; message: I18nText } // 400 — tệp hỏng / đuôi giả
    | AuthErrorUnion // 401 / 403
    | InternalError // 500

// ═════════════════════════════ M12 · Outbox tích hợp kênh bán (420-01/420-03)

/**
 * `GET /api/admin/outbox` — theo dõi hàng đợi sự kiện gửi sang kênh bán ngoài.
 * Quyền: `report.view`.
 *
 * Vì sao có màn này: sự kiện `inventory.changed` gửi hỏng mà không ai biết thì
 * **OTA vẫn bán phòng đã bán**. Đây là màn để người vận hành nhìn thấy sự cố
 * đó, và bấm gửi lại.
 */
export interface ListOutboxRequest {
    /** Không gửi = mọi trạng thái. */
    status?: OutboxStatus
    /** Lọc theo loại sự kiện. */
    eventType?: string
    /** Lọc theo kênh nhận. */
    channel?: string
    /** Mặc định 50, trần 200. */
    limit?: number
    /** Bỏ qua bao nhiêu bản ghi. Mặc định 0. */
    offset?: number
}

export interface ListOutboxResponse {
    items: OutboxEntryDto[]
    total: number
    /** Đếm nhanh theo trạng thái — dựng badge trên đầu màn không phải gọi thêm. */
    counts: Record<OutboxStatus, number>
}

export type ListOutboxError = AuthErrorUnion | InternalError

/**
 * Trạng thái một bản ghi outbox.
 *
 * ⚠️ Giá trị này sẽ thành CHECK constraint ở migration `420-01`. Đổi ở đây thì
 * phải đổi cả migration — TS không kiểm được ràng buộc trong DB (bẫy §3 MAP).
 */
export type OutboxStatus =
    /** Chưa gửi lần nào. */
    | 'pending'
    /** Đang gửi. */
    | 'sending'
    /** Gửi thành công. */
    | 'sent'
    /** Gửi hỏng, còn lượt thử lại. */
    | 'failed'
    /** Hết lượt thử hoặc lỗi 4xx sai dữ liệu — không thử lại nữa. */
    | 'dead'

export interface OutboxEntryDto {
    /** UUID. */
    id: string
    /** Ví dụ `inventory.changed`, `booking.confirmed`. */
    eventType: string
    /** Kênh nhận, ví dụ `booking-com`, `echo` (adapter giả để test). */
    channel: string
    status: OutboxStatus
    /**
     * Dữ liệu sự kiện — **tự đủ**, adapter không phải query thêm bảng nào.
     * `unknown` chứ không `any`: nơi tiêu thụ phải thu hẹp trước khi dùng (C1).
     */
    payload: unknown
    /** Đã thử gửi bao nhiêu lần. */
    attemptCount: number
    /** ISO 8601 — lần thử tiếp theo. `null` khi `sent` hoặc `dead`. */
    nextRetryAt: string | null
    /** Nguyên văn lỗi lần gần nhất. Cắt bớt là mất đúng thứ cần để chẩn đoán. */
    lastError: string | null
    /** ISO 8601. */
    createdAt: string
    updatedAt: string
    /** ISO 8601 — thời điểm gửi thành công. `null` nếu chưa. */
    sentAt: string | null
}

/**
 * `POST /api/admin/outbox/[id]/retry` — đẩy một bản ghi về hàng đợi để gửi lại.
 * Quyền: `settings.bank`.
 *
 * ⚠️ `ndh-sa` chốt ở `380-02`: chưa có permission nào đúng nghĩa "vận hành tích
 * hợp". Tạm mượn `settings.bank` vì nó cũng là quyền chỉ `owner` có. Phương án
 * sạch hơn là thêm `integration.manage` vào `permissions.ts` — nhưng đó là sửa
 * type ở `packages/core`, phải xin SA duyệt.
 *
 * Thao tác **idempotent**: gọi hai lần trên bản ghi `pending` không nhân đôi
 * sự kiện, chỉ đặt lại `next_retry_at`.
 */
export interface RetryOutboxRequest {
    readonly _noBody?: never
}

export interface RetryOutboxResponse {
    id: string
    /** Luôn `pending` sau khi xếp lại hàng. */
    status: 'pending'
    /** Đặt về 0 để bản ghi được ưu tiên gửi ngay. */
    attemptCount: number
    /** ISO 8601. */
    nextRetryAt: string
}

export type RetryOutboxError =
    | AuthErrorUnion // 401 / 403
    | NotFoundError // 404
    | {
          /** 422 — bản ghi đã `sent`, không có gì để gửi lại. */
          code: 'ALREADY_SENT'
          message: I18nText
      }
    | InternalError // 500

// ════════════════════════════════════ M13 · Quét giấy tờ tuỳ thân (440-04)

/**
 * `POST /api/admin/scan-id` — đọc CCCD/hộ chiếu để điền sẵn form nhận phòng.
 * Quyền: `booking.change-status` (lễ tân CÓ — đây là việc của lễ tân).
 *
 * ─── HAI ĐIỀU TUYỆT ĐỐI ────────────────────────────────────────────────────
 *
 * ① **Scanner lỗi KHÔNG được chặn lễ tân nhập tay.** Khách đang đứng ở quầy;
 *    route này hỏng thì form check-in vẫn phải dùng được bình thường. Vì vậy
 *    mọi lỗi ở đây FE xử lý bằng cách *im lặng bỏ qua*, không chặn luồng.
 * ② **KHÔNG lưu ảnh giấy tờ** — không Storage, không DB, không log. Ảnh chỉ
 *    tồn tại trong bộ nhớ suốt vòng đời request. Đây là dữ liệu định danh cá
 *    nhân, lưu lại là mở ra nghĩa vụ pháp lý mà dự án không cần gánh.
 */
export interface ScanIdDocumentRequest {
    /** Gửi qua `FormData`, field `file`. Ảnh JPEG/PNG/WebP. */
    file: 'multipart/form-data field named "file"'
    /** Loại giấy tờ, giúp bộ đọc chọn khuôn mẫu. Không gửi = tự đoán. */
    documentType?: IdDocumentType
}

export type IdDocumentType =
    /** Căn cước công dân. */
    | 'cccd'
    /** Chứng minh nhân dân (bản cũ). */
    | 'cmnd'
    | 'passport'

export interface ScanIdDocumentResponse {
    /** Bộ đọc nào xử lý — `manual` = chưa nối OCR, luôn trả `fields` rỗng. */
    provider: 'manual' | string
    result: ScanIdResult
}

/**
 * Kết quả đọc.
 *
 * ⚠️ Field **không đọc được thì KHÔNG có mặt trong `fields`** — không trả chuỗi
 * rỗng. Chuỗi rỗng sẽ ghi đè giá trị lễ tân vừa gõ tay, đúng lúc họ đang vội.
 */
export interface ScanIdResult {
    fields: ScanIdFields
    /** Độ tin cậy **từng field**, `0..1`. Chỉ có key nào `fields` có. */
    confidence: Partial<Record<keyof ScanIdFields, number>>
    /** `true` khi không đọc được gì — FE để lễ tân nhập tay, không báo lỗi đỏ. */
    empty: boolean
}

export interface ScanIdFields {
    /** Số CCCD/CMND/hộ chiếu. */
    idNumber?: string
    fullName?: string
    /** YYYY-MM-DD — chuỗi, không `Date`. */
    dateOfBirth?: string
    /** Giới tính đọc được, giữ nguyên văn trên giấy tờ. */
    sex?: string
    nationality?: string
    /** Quê quán / nơi thường trú. */
    address?: string
    /** YYYY-MM-DD. */
    issueDate?: string
    expiryDate?: string
}

export type ScanIdDocumentError =
    | { code: 'NO_FILE'; message: I18nText } // 400
    | { code: 'UNSUPPORTED_TYPE'; message: I18nText } // 400
    | { code: 'FILE_TOO_LARGE'; message: I18nText } // 400
    | AuthErrorUnion // 401 / 403
    | {
          /**
           * 503 — bộ đọc bên ngoài không phản hồi.
           * FE **không** hiện lỗi đỏ: chuyển sang nhập tay, xem §① ở trên.
           */
          code: 'SCANNER_UNAVAILABLE'
          message: I18nText
      }
    | InternalError // 500

// ════════════════════════════════════ M14 · Làm mới cache trang tĩnh (410-03)

/**
 * `POST /api/revalidate` — bảo Next dựng lại trang tĩnh sau khi CMS sửa nội dung.
 * Quyền: `content.edit`.
 *
 * Vì sao cần: trang phòng dùng ISR. Admin sửa giá gốc mà không revalidate thì
 * trang khách **vẫn hiện giá cũ** cho tới khi hết hạn cache — nhìn như CMS
 * không hoạt động.
 */
export interface RevalidateRequest {
    /**
     * Đường dẫn cần dựng lại, ví dụ `/h3/rooms`. Gửi kèm `tags` cũng được;
     * ít nhất một trong hai phải có, không thì 400.
     */
    paths?: string[]
    /** Tag cache, ví dụ `room-types`. */
    tags?: string[]
}

export interface RevalidateResponse {
    /** Đường dẫn đã xử lý. */
    revalidatedPaths: string[]
    revalidatedTags: string[]
    /** ISO 8601. */
    at: string
}

export type RevalidateError =
    | ValidationError // 400 — không gửi cả paths lẫn tags
    | AuthErrorUnion // 401 / 403
    | InternalError // 500
