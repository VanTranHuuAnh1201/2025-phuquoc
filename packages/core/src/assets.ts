/**
 * Đường dẫn ảnh tĩnh dùng chung cho cả N theme.
 *
 * VÌ SAO Ở ĐÂY MÀ KHÔNG PHẢI TRONG TỪNG THEME: logo, favicon, ảnh cơ sở lưu
 * trú là *nội dung của khách hàng*, không phải hình thức của một mẫu. Đổi logo
 * một chỗ phải đổi ở cả bốn mẫu — đúng tinh thần luật R8.
 *
 * VÌ SAO CHỈ LÀ CHUỖI ĐƯỜNG DẪN, KHÔNG PHẢI FILE: `packages/core` không phục
 * vụ file tĩnh được. Next chỉ phục vụ những gì nằm trong `public/` của app.
 * Nên file ảnh nằm ở `apps/<app>/public/`, còn `core` chỉ giữ ĐƯỜNG DẪN tới
 * chúng — nhờ vậy theme không phải hard-code chuỗi rải rác, và đổi cấu trúc
 * thư mục chỉ phải sửa ở một chỗ.
 *
 * File thật đặt tại `apps/2026-thenamduhill/public/`:
 *
 *     public/
 *       brand/      logo, favicon — nhận diện của khách hàng
 *       previews/   ảnh xem trước từng mẫu, cho trang hub
 *       property/   ảnh phòng, ẩm thực, điểm đến khi có ảnh gốc từ khách
 *
 * Ảnh trong `property/` là nơi thay thế cho ảnh crawl đang hotlink — xem
 * `propertyImages()` trong `data/seed-dto.ts`.
 */

/** Thư mục gốc của từng nhóm asset, để không rải chuỗi khắp code. */
export const ASSET_DIR = {
    brand: '/brand',
    previews: '/previews',
    property: '/property',
} as const

/** Nhận diện thương hiệu — mọi theme dùng chung đúng bộ này. */
export const BRAND_ASSETS = {
    logo: `${ASSET_DIR.brand}/logo.png`,
} as const

/**
 * Ảnh xem trước của một mẫu, hiển thị trên trang hub.
 * Quy ước tên file theo slug: `h1` → `/previews/h1.webp`.
 */
export function previewPath(slug: string): string {
    return `${ASSET_DIR.previews}/${slug}.webp`
}

/** Ảnh thuộc cơ sở lưu trú, đặt trong `public/property/`. */
export function propertyPath(file: string): string {
    return `${ASSET_DIR.property}/${file}`
}
