import type { I18nText } from '@repo/core'

/**
 * Hợp đồng response chuẩn BE1 — dùng cho MỌI Route Handler, không riêng auth.
 *
 *   { "success": true,  "data": {...}, "error": null }
 *   { "success": false, "data": null,  "error": { code, message: {vi,en} } }
 */

export interface ApiError {
    code: string
    message: I18nText
    /**
     * Field phụ đi kèm một số mã lỗi — `ROOM_TYPE_IN_USE.activeBookingCount`,
     * `INVALID_TRANSITION.currentStatus`, `EXCEEDS_PAID_AMOUNT.paidAmount`,
     * `VALIDATION_FAILED.fields[]`, `RATE_LIMITED.retryAfterSeconds`.
     *
     * Khai bằng index signature `unknown` chứ không `any` (C1): mỗi mã lỗi có
     * bộ field riêng, hợp đồng `api-contracts.ts` mới là nơi nói field nào đi
     * với mã nào. Nơi tiêu thụ (FE) đọc theo union đã khai ở hợp đồng.
     */
    [extra: string]: unknown
}

export interface ApiSuccessBody<T> {
    success: true
    data: T
    error: null
}

export interface ApiErrorBody {
    success: false
    data: null
    error: ApiError
}

/** Response thành công. `status` mặc định 200; dùng 201 khi tạo mới. */
export function ok<T>(data: T, status = 200): Response {
    const body: ApiSuccessBody<T> = { success: true, data, error: null }
    return Response.json(body, { status })
}

/**
 * Response lỗi. Thông báo bắt buộc song ngữ (C7), giọng viết theo C8.
 *
 * `extra` (nợ `M32`, mở rộng ở ticket `390-01`): 8 mã lỗi trong hợp đồng mang
 * thêm dữ liệu FE cần **hiển thị**, không chỉ để phân loại. Ví dụ
 * `ROOM_TYPE_IN_USE` phải nói **bao nhiêu** đơn còn lại — thiếu con số đó thì
 * admin biết "còn đơn" nhưng không biết phải xử lý mấy đơn, tức là mất đúng
 * thông tin để hành động.
 *
 * Trước thay đổi này chữ ký chỉ nhận 3 tham số, nên FE đọc
 * `error.activeBookingCount` ra `undefined` mà **typecheck vẫn xanh** (giá trị
 * đi qua JSON, không còn type). Đó là lý do phải mở rộng ở đây thay vì để mỗi
 * route tự dựng `Response.json` — một chỗ tự dựng là một chỗ lệch hợp đồng BE1.
 */
export function fail(
    status: number,
    code: string,
    message: I18nText,
    extra?: Record<string, unknown>,
): Response {
    const body: ApiErrorBody = {
        success: false,
        data: null,
        error: { ...extra, code, message },
    }
    return Response.json(body, { status })
}

/** Lỗi hệ thống — không lộ chi tiết nội bộ ra ngoài. */
export function serverError(): Response {
    return fail(500, 'INTERNAL_ERROR', {
        vi: 'Hệ thống gặp sự cố. Thử lại sau ít phút.',
        en: 'Something went wrong. Please try again shortly.',
    })
}
