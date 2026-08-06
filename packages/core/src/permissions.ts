import type { Role } from './booking-types'

/**
 * Nguồn sự thật duy nhất về quyền (ticket 000-02 §4.3, luật BE2).
 *
 * Hàm thuần: không đọc trạng thái toàn cục, không gọi API, không import React,
 * không chạm trình duyệt. Chạy được trong Node thuần (luật R2 / BE9).
 *
 * Ba nơi cùng đọc file này:
 *   UI          ẩn/hiện nút        (thuận tiện, KHÔNG phải bảo mật)
 *   API route   chặn request       (bắt buộc — requirePermission())
 *   RLS policy  chặn ở tầng DB     (bắt buộc — lớp phòng thủ thứ ba)
 */
export type Permission =
    // đơn hàng
    | 'booking.view.all'
    | 'booking.view.own'
    | 'booking.create'
    | 'booking.change-status'
    | 'booking.cancel'
    | 'booking.cancel.own'
    | 'booking.refund'
    | 'booking.surcharge'
    // tồn kho & giá
    | 'inventory.view'
    | 'inventory.edit'
    | 'price.view'
    | 'price.edit'
    | 'promotion.view'
    | 'promotion.edit'
    // nội dung
    | 'content.edit'
    // hệ thống
    | 'account.manage'
    | 'settings.bank'
    | 'report.view'
    | 'report.view.full'

/**
 * Toàn bộ permission tồn tại, đúng thứ tự khai báo ở `Permission`.
 *
 * `Object.freeze` chứ không chỉ `readonly`: `readonly` biến mất sau khi biên
 * dịch, mảng lúc chạy vẫn `push()` được. Module là singleton nên một lần ghi
 * bậy là ô nhiễm suốt vòng đời tiến trình (000-02 §6.1 điều 3).
 */
export const ALL_PERMISSIONS: readonly Permission[] = Object.freeze([
    'booking.view.all',
    'booking.view.own',
    'booking.create',
    'booking.change-status',
    'booking.cancel',
    'booking.cancel.own',
    'booking.refund',
    'booking.surcharge',
    'inventory.view',
    'inventory.edit',
    'price.view',
    'price.edit',
    'promotion.view',
    'promotion.edit',
    'content.edit',
    'account.manage',
    'settings.bank',
    'report.view',
    'report.view.full',
] as const)

/**
 * Ma trận quyền — bản chốt ở ticket 000-02 §6.2, dịch từ bảng phân quyền
 * bản PM §3.1 và `booking-domain.md §B8`.
 *
 * `satisfies` để thiếu một vai trò là lỗi BIÊN DỊCH, không phải lỗi chạy.
 *
 * Owner được liệt kê đủ quyền chứ KHÔNG dùng nhánh tắt `if (role==='owner')`
 * trong `can()` — nhánh tắt là chỗ quyền âm thầm sinh ra khi thêm permission mới.
 *
 * `Object.freeze` cả object ngoài LẪN từng mảng con. `as const satisfies` chỉ
 * chặn được lúc biên dịch; lúc chạy `permissionsOf()` trả về chính tham chiếu
 * này ra tới `/api/auth/me`, nên một `push()`/`sort()` vô ý ở tầng gọi là leo
 * thang quyền cho mọi request sau đó.
 */
export const ROLE_PERMISSIONS = Object.freeze({
    owner: Object.freeze([
        'booking.view.all',
        'booking.view.own',
        'booking.create',
        'booking.change-status',
        'booking.cancel',
        'booking.cancel.own',
        'booking.refund',
        'booking.surcharge',
        'inventory.view',
        'inventory.edit',
        'price.view',
        'price.edit',
        'promotion.view',
        'promotion.edit',
        'content.edit',
        'account.manage',
        'settings.bank',
        'report.view',
        'report.view.full',
    ] as const),
    manager: Object.freeze([
        'booking.view.all',
        'booking.view.own',
        'booking.create',
        'booking.change-status',
        'booking.cancel',
        'booking.cancel.own',
        'booking.refund',
        'booking.surcharge',
        'inventory.view',
        'inventory.edit',
        'price.view',
        'price.edit',
        'promotion.view',
        'promotion.edit',
        'content.edit',
        'report.view',
    ] as const),
    // Lễ tân vận hành đơn nhưng KHÔNG sửa giá, KHÔNG duyệt hoàn tiền.
    // Đây là điểm chốt với khách doanh nghiệp (000-02 §4.4).
    receptionist: Object.freeze([
        'booking.view.all',
        'booking.view.own',
        'booking.create',
        'booking.change-status',
        'booking.cancel',
        'booking.cancel.own',
        'booking.surcharge',
        'inventory.view',
        'inventory.edit',
        'price.view',
        'promotion.view',
    ] as const),
    // Biên tập nội dung: không xem đơn, không chạm tiền.
    editor: Object.freeze(['content.edit'] as const),
    // Khách: chỉ đơn của chính mình. Điều kiện "của mình" kiểm ở Route Handler,
    // `can()` không biết đơn nào thuộc về ai.
    customer: Object.freeze(['booking.view.own', 'booking.create', 'booking.cancel.own'] as const),
}) satisfies Record<Role, readonly Permission[]>

/** Vai trò X có quyền Y không. Đây là hàm duy nhất mọi tầng được gọi. */
export function can(role: Role, permission: Permission): boolean {
    const granted: readonly Permission[] = ROLE_PERMISSIONS[role]
    return granted.includes(permission)
}

/** Có ÍT NHẤT MỘT trong các quyền. Dùng cho màn hình đọc nhiều nguồn. */
export function canAny(role: Role, permissions: readonly Permission[]): boolean {
    return permissions.some((p) => can(role, p))
}

/**
 * Có ĐỦ MỌI quyền. Dùng cho thao tác ghi chạm nhiều bảng — ví dụ trả phòng
 * vừa đổi trạng thái vừa thu phụ phí.
 */
export function canAll(role: Role, permissions: readonly Permission[]): boolean {
    return permissions.every((p) => can(role, p))
}

/**
 * Toàn bộ quyền của một vai trò. `/api/auth/me` trả mảng này để FE ẩn/hiện nút
 * — FE không tự suy từ `role`, tránh hai nguồn sự thật.
 */
export function permissionsOf(role: Role): readonly Permission[] {
    return ROLE_PERMISSIONS[role]
}

/**
 * Nhãn hiển thị cho khách (000-02 §4.2). Song ngữ theo luật R6/C7.
 * Đặt ở đây vì nó là ánh xạ 1-1 với `Role`, không phải chuỗi giao diện tự do.
 *
 * Freeze cả object ngoài lẫn từng cặp `{vi, en}` — cùng lý do với
 * `ROLE_PERMISSIONS`: nhãn này đi thẳng ra response API.
 */
export const ROLE_LABELS = Object.freeze({
    owner: Object.freeze({ vi: 'SuperAdmin — Chủ Resort', en: 'SuperAdmin — Resort Owner' }),
    manager: Object.freeze({ vi: 'Admin — Quản lý', en: 'Admin — Manager' }),
    receptionist: Object.freeze({ vi: 'User — Lễ tân', en: 'User — Receptionist' }),
    editor: Object.freeze({ vi: 'Biên tập nội dung', en: 'Content Editor' }),
    customer: Object.freeze({ vi: 'Khách hàng', en: 'Customer' }),
} as const) satisfies Record<Role, { vi: string; en: string }>

/** Vai trò nhân viên — mọi vai trò trừ `customer`. Middleware dùng để chặn `/admin/*`. */
export function isStaffRole(role: Role): boolean {
    return role !== 'customer'
}
