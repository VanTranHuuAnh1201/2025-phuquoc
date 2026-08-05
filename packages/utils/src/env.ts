/**
 * Đọc biến môi trường một cách an toàn.
 *
 * VÌ SAO CẦN FILE NÀY
 * `@repo/core` được các package khác biên dịch lại từ mã nguồn (`@repo/ui`,
 * `theme-*` đều compile thẳng file .ts của core). Những package đó không khai
 * `@types/node`, nên gọi thẳng `process.env` sẽ vỡ typecheck ở phía họ dù core
 * tự nó vẫn sạch. Thay vì bắt mọi package tiêu thụ phải cài `@types/node`, core
 * tự khai đúng phần mình cần và giữ nguyên tắc "tự chứa".
 *
 * Đồng thời hàm này chịu được môi trường KHÔNG có `process` (trình duyệt, edge
 * runtime) — trả `undefined` chứ không ném lỗi.
 *
 * Vẫn tuân thủ luật R2: không JSX, không CSS, chạy được trong Node thuần.
 */

declare const process: { env?: Record<string, string | undefined> } | undefined

/** Giá trị biến môi trường, hoặc `undefined` nếu không có / không đọc được. */
export function readEnv(name: string): string | undefined {
    if (typeof process === 'undefined' || !process?.env) return undefined
    return process.env[name]
}

/** Có đang chạy ở production không? Dùng để chặn nội dung chỉ dành cho dev. */
export function isProduction(): boolean {
    return readEnv('NODE_ENV') === 'production'
}
