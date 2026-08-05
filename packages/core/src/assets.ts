/**
 * Đường dẫn ảnh GẮN VỚI NGHIỆP VỤ lưu trú.
 *
 * Phần vô danh (`brand`, `previews`) đã chuyển sang `@repo/utils` theo luật
 * R15 — tầng nền không được nhắc khái niệm của ngành nào. Còn lại ở đây là
 * ảnh của cơ sở lưu trú: phòng, ẩm thực, điểm đến.
 *
 * VÌ SAO CHỈ LÀ CHUỖI ĐƯỜNG DẪN, KHÔNG PHẢI FILE: `packages/core` không phục
 * vụ file tĩnh được. Next chỉ phục vụ những gì nằm trong `public/` của app.
 * Nên file ảnh nằm ở `apps/<app>/public/property/`, còn `core` chỉ giữ ĐƯỜNG
 * DẪN tới chúng.
 *
 * Ảnh trong `property/` là nơi thay thế cho ảnh crawl đang hotlink — xem
 * `propertyImages()` trong `data/seed-dto.ts`.
 */

/** Thư mục ảnh của cơ sở lưu trú. */
export const PROPERTY_ASSET_DIR = '/property' as const

/** Ảnh thuộc cơ sở lưu trú, đặt trong `public/property/`. */
export function propertyPath(file: string): string {
    return `${PROPERTY_ASSET_DIR}/${file}`
}
