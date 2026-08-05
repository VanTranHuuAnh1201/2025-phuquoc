/**
 * Đường dẫn ảnh tĩnh KHÔNG mang khái niệm ngành nào (luật R15).
 *
 * VÌ SAO CHỈ CÓ `brand` VÀ `previews`: hai thứ này tồn tại ở mọi sản phẩm —
 * website nào cũng có logo và trang hub liệt kê mẫu. Ảnh gắn với nghiệp vụ
 * (phòng, ẩm thực, điểm đến) thuộc về package domain tương ứng, không phải
 * tầng nền.
 *
 * VÌ SAO CHỈ LÀ CHUỖI ĐƯỜNG DẪN, KHÔNG PHẢI FILE: package này không phục vụ
 * file tĩnh được. Next chỉ phục vụ những gì nằm trong `public/` của app. Nên
 * file ảnh nằm ở `apps/<app>/public/`, còn đây chỉ giữ ĐƯỜNG DẪN tới chúng —
 * nhờ vậy đổi cấu trúc thư mục chỉ phải sửa một chỗ.
 */

/** Thư mục gốc của từng nhóm asset, để không rải chuỗi khắp code. */
export const ASSET_DIR = {
    brand: '/brand',
    previews: '/previews',
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
