/**
 * Tiêm nguồn dữ liệu Supabase vào `@repo/core` — ticket 200-01 §6.2/§6.3.
 *
 * CHỈ SERVER. Gọi `initPropertySource()` một lần từ Server Component / Route
 * Handler trước khi đọc dữ liệu. Chưa gọi thì `core` dùng seed tĩnh như cũ, nên
 * 4 theme và `pnpm build:safe` không vỡ (AC-13).
 *
 * ⚠️ Dùng ANON KEY, không phải service role — đường B của 000-02 §6.3.
 *
 *   Toàn bộ bảng đọc ở đây (`room_types`, `addons`, `property_settings`, nhóm
 *   marketing) đều có policy `*_public_read` trong 20260101000200_rls_policies.sql.
 *   Vì vậy ticket này KHÔNG bị chặn bởi nợ M13 (`SUPABASE_SERVICE_ROLE_KEY`
 *   đang là publishable key). Chỉ `requireAuth()` đọc bảng `accounts` mới cần
 *   key thật, và đó là nợ đã ghi ở 000-03.
 *
 * Không có nhánh `catch` nuốt lỗi ở đây (luật C3 / §6.2): DB hỏng thì phải nổ
 * rõ ràng, không được âm thầm trả nội dung cũ như thể mọi thứ bình thường.
 */

import 'server-only'

import { createClient } from '@supabase/supabase-js'
import {
    DEFAULT_PROPERTY_ID,
    setPropertySource,
    type PropertyData,
    type PropertySource,
} from '@repo/core'

import { loadPropertyFromSupabase } from './property-source'

let installed = false

export function initPropertySource(): void {
    if (installed) return

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey =
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

    // Thiếu cấu hình thì KHÔNG tiêm — core tiếp tục dùng seed tĩnh. Đây là
    // trạng thái hợp lệ ở môi trường dev chưa nối DB, khác hẳn với "DB có mà
    // truy vấn hỏng" ở dưới (chỗ đó phải nổ).
    if (!url || !anonKey) return

    const client = createClient(url, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    })

    const source: PropertySource = {
        async load(propertyId: string): Promise<PropertyData> {
            return loadPropertyFromSupabase(client, propertyId)
        },
    }

    setPropertySource(source)
    installed = true
}

export { DEFAULT_PROPERTY_ID }
