import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Đường A của ticket 000-02 §6.3 — client `service_role`, BỎ QUA RLS.
 *
 * ⚠️ CHỈ SERVER. Cấm import từ file có `'use client'`. Cấm đặt key vào biến có
 * tiền tố `NEXT_PUBLIC_`. Service role bỏ qua toàn bộ RLS — lộ nó là lộ cả DB.
 *
 * Mọi truy vấn qua client này BẮT BUỘC đã đi qua `requirePermission()` trước
 * đó. RLS không còn chắn được gì ở đường này (luật BE2 / 000-02 §6.3 điều 3).
 */

let cached: SupabaseClient | null = null

export function createAdminClient(): SupabaseClient {
    if (cached) return cached

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    // C4: thiếu cấu hình thì ném ngay, không fallback thầm lặng sang anon key —
    // fallback kiểu đó làm truy vấn trả rỗng và bị hiểu nhầm là "không có dữ liệu".
    if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL chưa cấu hình')
    if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY chưa cấu hình')

    cached = createClient(url, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    })
    return cached
}
