/**
 * Phân giải điều hướng: từ id section sang URL thật.
 *
 * Vì sao thứ này nằm ở `core` chứ không ở từng theme:
 *
 * Prototype nối các trang bằng anchor (`#rooms`) vì nó là HTML tĩnh một file.
 * Port thẳng sang React thì bấm "Phòng" chỉ cuộn xuống section, không sang
 * trang danh sách — đúng lỗi "action bị sai" đang thấy. Trang con của mẫu 01
 * từng tự vá bằng một bảng `NAV_ROUTES` hard-code `/h1`; nhân bảng đó ra bốn
 * bản là copy code giữa các theme, vi phạm luật R1.
 *
 * Đây là logic thuần (chuỗi vào, chuỗi ra), không JSX, không CSS — hợp luật R2.
 * Theme chỉ gọi `themeHref(slug, item.href)` và không cần biết mẫu nào có
 * những trang con nào.
 */

import { SECTION_IDS, type SectionId } from './types'

/**
 * Những section đã có trang riêng.
 *
 * Section nào có tên ở đây thì `#id` được nâng thành `/<slug>/<đường dẫn>`;
 * còn lại giữ nguyên dạng neo để cuộn trong trang chủ. Thêm trang con mới chỉ
 * là thêm một dòng vào bảng này — không sửa theme nào (luật R5).
 */
const SECTION_ROUTES: Partial<Record<SectionId, string>> = {
    rooms: 'rooms',
    tours: 'tours',
    gallery: 'gallery',
    contact: 'contact',
}

/** Trang con không gắn với section nào trong bộ id chuẩn của luật R7. */
export type ThemeSubPage = 'rooms' | 'tours' | 'gallery' | 'contact' | 'checkout'

/** Gốc của một mẫu: `/h1`. */
export function themeRoot(slug: string): string {
    return `/${slug}`
}

/**
 * Đường dẫn tới một trang con: `themePath('h3', 'rooms')` → `/h3/rooms`.
 */
export function themePath(slug: string, page: ThemeSubPage): string {
    return `/${slug}/${page}`
}

/** Chi tiết một hạng phòng: `/h3/rooms/bungalow-bien`. */
export function roomPath(slug: string, roomId: string): string {
    return `/${slug}/rooms/${roomId}`
}

/** Chi tiết một combo: `/h3/tours/nam-du-3n2d`. */
export function tourPath(slug: string, tourId: string): string {
    return `/${slug}/tours/${tourId}`
}

/**
 * Nâng một href của prototype thành đường dẫn thật trong app.
 *
 * Quy tắc, theo đúng thứ tự:
 *   `#top`      → `/h1`             về trang chủ của mẫu
 *   `#rooms`    → `/h1/rooms`       section đã có trang riêng
 *   `#dining`   → `/h1#dining`      chưa có trang riêng, giữ neo
 *   `/h1/rooms` → giữ nguyên        đã là đường dẫn thật
 *   `https://…` → giữ nguyên        liên kết ngoài
 *
 * `fromHome` cho biết đang đứng ở trang chủ hay trang con. Ở trang chủ, neo của
 * section chưa có trang riêng phải để trần (`#dining`) mới cuộn mượt; ở trang
 * con phải kèm đường dẫn (`/h1#dining`) mới quay về đúng chỗ.
 */
export function themeHref(slug: string, href: string, fromHome = false): string {
    // Liên kết ngoài, mailto:, tel: — không đụng vào.
    if (!href.startsWith('#')) return href

    const id = href.slice(1)

    if (id === 'top' || id === '') return themeRoot(slug)

    const route = SECTION_ROUTES[id as SectionId]
    if (route) return `/${slug}/${route}`

    // Chưa có trang riêng: cuộn trong trang chủ.
    return fromHome ? href : `${themeRoot(slug)}${href}`
}

/** Section này đã có trang riêng chưa. */
export function hasSubPage(sectionId: string): boolean {
    return sectionId in SECTION_ROUTES
}

/**
 * Breadcrumb chuẩn cho trang con. Trả về dữ liệu thuần; theme tự vẽ.
 *
 * Phần tử cuối không có `href` — nó là trang hiện tại (`aria-current="page"`).
 */
export interface CrumbData {
    label: string
    href?: string
}

export function buildCrumbs(
    slug: string,
    homeLabel: string,
    trail: readonly { label: string; page?: ThemeSubPage }[],
): CrumbData[] {
    const crumbs: CrumbData[] = [{ label: homeLabel, href: themeRoot(slug) }]

    trail.forEach((step, index) => {
        const isLast = index === trail.length - 1
        crumbs.push({
            label: step.label,
            href: isLast || !step.page ? undefined : themePath(slug, step.page),
        })
    })

    return crumbs
}

/** Bộ id chuẩn, re-export cho tiện tra khi dựng nav. */
export { SECTION_IDS }
