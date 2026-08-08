import { config as loadEnv } from 'dotenv'
import path from 'node:path'

/**
 * Nạp biến môi trường TRƯỚC khi bất kỳ module nào của app được import.
 *
 * Vì sao cần: `createAdminClient()` đọc `process.env.NEXT_PUBLIC_SUPABASE_URL`
 * lúc gọi, và `readSecret()` trong `jwt.ts` ném ngay nếu `JWT_SECRET` rỗng.
 * Next tự nạp `.env.local` khi chạy `next dev`; Vitest thì không — thiếu bước
 * này thì mọi test đỏ bằng "JWT_SECRET chưa cấu hình", một lỗi hoàn toàn giả.
 */
loadEnv({ path: path.resolve(__dirname, '../.env.local'), quiet: true })

/**
 * `next/headers` chỉ chạy trong request scope của Next. Ba route
 * (`/availability`, `/availability/search`, `POST /api/bookings`) gọi
 * `await cookies()` để dựng client `anon`.
 *
 * ⚠️ ĐÂY KHÔNG PHẢI "mock cái đang test" (AC-13 cấm điều đó). Cái đang test là
 * **Route Handler + Supabase thật**. Thứ được thay ở đây là **runtime của Next**
 * — hạ tầng framework mà Vitest không dựng được. Supabase vẫn bị gọi thật, DB
 * vẫn ghi thật, `withAuthGuard` vẫn chạy đủ vì nó đọc header `Cookie` trực tiếp
 * từ `Request` (`guard.ts:63 readSessionCookie`), KHÔNG qua `next/headers`.
 */
import { vi } from 'vitest'

vi.mock('next/headers', () => ({
    cookies: async () => ({
        getAll: () => [],
        get: () => undefined,
        set: () => undefined,
    }),
}))

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
        'Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY. '
        + 'Kiểm tra apps/2026-thenamduhill/.env.local trước khi chạy pnpm test:api.',
    )
}
