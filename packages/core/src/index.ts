/**
 * @repo/core — type, dữ liệu, nghiệp vụ, i18n.
 *
 * KHÔNG chứa JSX, CSS, mã màu hay bất cứ thứ gì gắn với trình duyệt (luật R2).
 * Phép thử: package này phải chạy được trong Node thuần.
 */

export * from './i18n'
export * from './env'
export * from './types'
export * from './theme'
export * from './navigation'
export * from './repository'
export * from './assets'

// ---------------------------------------------------------------- nghiệp vụ đặt phòng
//
// `booking.ts` (bản đầu, tính giá một mức) đã được thay bằng bộ dưới đây:
//   pricing.ts            giá theo mùa / theo ngày / theo gói
//   promotion.ts          khuyến mãi và quy tắc kết hợp
//   availability.ts       tra phòng trống + báo giá trọn gói
//   booking-lifecycle.ts  vòng đời đơn, chính sách huỷ, nhật ký
//
// `booking.ts` vẫn export để 4 theme hiện có không vỡ; nó sẽ được gỡ khi các
// theme chuyển hết sang `buildQuote()`. Xem `.claude/rules/booking-domain.md`.
export * from './booking-types'
export * from './pricing'
export * from './promotion'
export * from './availability'
export * from './booking-lifecycle'
export {
    calculatePrice,
    validateBooking,
    type BookingSelection,
    type PriceBreakdown,
    type PriceLine,
} from './booking'

// -------------------------------------------------------------------- dữ liệu demo
export { seasons, ratePlans, promotions, childPolicy, buildRoomUnits } from './data/operations.seed'
export { generateDemoData, buildInventory } from './data/demo-generator'
export type { DemoData, DemoDataOptions } from './data/demo-generator'
