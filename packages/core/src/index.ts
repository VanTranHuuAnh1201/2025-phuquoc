/**
 * @repo/core — type, dữ liệu, nghiệp vụ, i18n.
 *
 * KHÔNG chứa JSX, CSS, mã màu hay bất cứ thứ gì gắn với trình duyệt (luật R2).
 * Phép thử: package này phải chạy được trong Node thuần.
 */

// Tầng nền — nằm ở `@repo/utils`, re-export ở đây để nơi tiêu thụ không phải
// sửa import cùng lúc với việc tách package. Code MỚI nên import thẳng
// `@repo/utils` cho đúng đồ thị phụ thuộc (luật R15).
export {
    LOCALES,
    DEFAULT_LOCALE,
    t,
    isLocale,
    pick,
    formatPrice,
    telHref,
    formatDate,
    readEnv,
    isProduction,
    ASSET_DIR,
    BRAND_ASSETS,
    previewPath,
    type Locale,
    type I18nText,
} from '@repo/utils'

export * from './types'
export * from './theme'
export * from './navigation'
export * from './repository'
export * from './assets'

// ---------------------------------------------------------------- nghiệp vụ đặt phòng
//
//   pricing.ts            giá theo mùa / theo ngày / theo gói
//   promotion.ts          khuyến mãi và quy tắc kết hợp
//   availability.ts       tra phòng trống + báo giá trọn gói
//   booking-lifecycle.ts  vòng đời đơn, chính sách huỷ, nhật ký
//
// `booking.ts` (bản đầu, tính giá một mức) đã được gỡ — không nơi nào còn
// dùng `calculatePrice`/`validateBooking`, mọi tính toán đi qua `buildQuote()`.
export * from './booking-types'
export * from './permissions'

// Hợp đồng API (ticket `380-01`) — Request/Response/Error của mọi endpoint
// release v1.0.1 chạm tới. BE sở hữu, FE chỉ đọc. Chỉ có type, không thân hàm.
export type * from './api-contracts'
export * from './pricing'
export * from './promotion'
export * from './availability'
export * from './booking-lifecycle'
export * from './validation'

// -------------------------------------------------------------------- dữ liệu demo
export { seasons, ratePlans, promotions, childPolicy, buildRoomUnits } from './data/operations.seed'
export { generateDemoData, buildInventory } from './data/demo-generator'

/** Chuỗi giao diện song ngữ dùng chung cho mọi theme. */
export { UI } from './data/ui-strings'
export type { UIKey } from './data/ui-strings'

/** Nội dung biên tập: blog, khám phá đảo, thực đơn. */
export { blogPosts } from './data/blog'
export { exploreSpots, satelliteIslands, tripPlans } from './data/explore'
export { diningMenu } from './data/dining-menu'
export { roomBusinessInfo } from './data/room-business'
export { namDuHill } from './data/nam-du-hill'
export type { DemoData, DemoDataOptions } from './data/demo-generator'
