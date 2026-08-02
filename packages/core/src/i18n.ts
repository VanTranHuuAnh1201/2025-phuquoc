/**
 * Song ngữ ở tầng dữ liệu (luật R6).
 * Mọi chuỗi khách nhìn thấy đều mang dạng { vi, en } — không có ngoại lệ.
 */

export const LOCALES = ['vi', 'en'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'vi'

/** Một chuỗi song ngữ. */
export type I18nText = Record<Locale, string>

/** Khai báo chuỗi song ngữ gọn — tương đương `T()` trong prototype. */
export const t = (vi: string, en: string): I18nText => ({ vi, en })

export function isLocale(value: string): value is Locale {
    return (LOCALES as readonly string[]).includes(value)
}

/** Lấy đúng ngôn ngữ đang chọn. Theme chỉ hiển thị, không tự dịch. */
export function pick(text: I18nText, locale: Locale): string {
    return text[locale] ?? text[DEFAULT_LOCALE]
}

/**
 * Định dạng tiền theo locale.
 * vi: 1.890.000đ · en: 1,890,000₫
 */
export function formatPrice(amount: number, locale: Locale): string {
    return locale === 'vi'
        ? `${amount.toLocaleString('vi-VN')}đ`
        : `${amount.toLocaleString('en-US')}₫`
}

/**
 * Số điện thoại → href cho thẻ `tel:`.
 *
 * Cả bốn mẫu đều lặp lại phép này ở header, khối đặt phòng và chân trang. Nó
 * là phép định dạng dữ liệu chứ không phải hình thức, nên chỗ của nó là `core`.
 */
export function telHref(phone: string): string {
    return `tel:${phone.replace(/\s/g, '')}`
}

export function formatDate(date: Date, locale: Locale): string {
    return date.toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
}
