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

/** Response lỗi. Thông báo bắt buộc song ngữ (C7), giọng viết theo C8. */
export function fail(status: number, code: string, message: I18nText): Response {
    const body: ApiErrorBody = { success: false, data: null, error: { code, message } }
    return Response.json(body, { status })
}

/** Lỗi hệ thống — không lộ chi tiết nội bộ ra ngoài. */
export function serverError(): Response {
    return fail(500, 'INTERNAL_ERROR', {
        vi: 'Hệ thống gặp sự cố. Thử lại sau ít phút.',
        en: 'Something went wrong. Please try again shortly.',
    })
}
