/**
 * `@repo/utils` — TẦNG NỀN, không biết domain nào tồn tại (luật R15).
 *
 * Phép thử trước khi thêm bất cứ thứ gì vào đây:
 *
 *     "File này có nhắc khái niệm của một ngành cụ thể không?"
 *
 * Không nhắc → thuộc về đây. Có nhắc (phòng, đơn hàng, bệnh án, gói cước…)
 * → thuộc về `packages/domain-*`.
 *
 * Được chứa: helper i18n, định dạng tiền/ngày, đọc biến môi trường, đường dẫn
 * asset vô danh.
 *
 * KHÔNG được chứa: JSX, CSS, type nghiệp vụ, dữ liệu của một khách hàng cụ thể.
 * Package này phải chạy được trong Node thuần (kế thừa luật R2).
 */

export {
    LOCALES,
    DEFAULT_LOCALE,
    t,
    isLocale,
    pick,
    formatPrice,
    telHref,
    formatDate,
    type Locale,
    type I18nText,
} from './i18n'

export { readEnv, isProduction } from './env'

export { ASSET_DIR, BRAND_ASSETS, previewPath } from './assets'
