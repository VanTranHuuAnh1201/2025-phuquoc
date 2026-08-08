import { ok, serverError } from '@/lib/auth/errors'
import { withAuthGuard } from '@/lib/auth/guard'
import { createAdminClient } from '@/utils/supabase/admin'

export const dynamic = 'force-dynamic'

/**
 * Hàng thô từ bảng `accounts` — key rắn (snake_case), giá trị chưa ép kiểu.
 * `.select('*')` của Supabase trả `any` khi client chưa gắn generic schema;
 * khai type biên này để thu hẹp về `unknown` field-by-field thay vì `any`
 * (luật C1), theo đúng pattern `DbRow` ở `src/lib/db/mappers.ts`.
 */
interface AccountRow {
    id: string
    email?: string | null
    full_name?: string | null
    role?: string | null
    phone?: string | null
    active?: boolean | null
    created_at?: string | null
}

/**
 * Danh sách tài khoản — email, SĐT, vai trò của cả nhân viên lẫn khách.
 *
 * `account.manage` chứ KHÔNG phải một quyền đọc chung chung: §B8 chỉ cấp quyền
 * này cho `owner`. `manager` cố ý KHÔNG có — bản đồ tài khoản quản trị kèm vai
 * trò là đầu vào trực tiếp cho việc dò mật khẩu, nên nó hẹp hơn quyền vận hành.
 *
 * Trước ticket `900-02` route này là `export async function GET()` trần dùng
 * `createAdminClient()` (service role ⇒ bỏ qua RLS), nên gọi không cookie vẫn
 * trả đủ 46 tài khoản. Cả ba lớp phòng thủ của `backend.md` đều vắng cùng lúc:
 * middleware không phủ `/api/**`, không `requirePermission`, RLS bị service role
 * vô hiệu. `withAuthGuard` là lớp DUY NHẤT còn lại ở đường này — đừng gỡ.
 */
export const GET = withAuthGuard(async () => {
    try {
        const adminSupabase = createAdminClient()
        const { data: accounts, error } = await adminSupabase
            .from('accounts')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('[GET /api/admin/accounts DB error]', error)
            return ok([])
        }

        const mapped = ((accounts ?? []) as AccountRow[]).map((a) => ({
            id: a.id,
            username: a.email ? a.email.split('@')[0] : a.id.slice(0, 8),
            fullName: a.full_name || a.email || 'N/A',
            email: a.email || '',
            role: a.role || 'receptionist',
            roleLabel: a.role === 'owner' ? 'Chủ cơ sở (Owner)' : a.role === 'superadmin' ? 'Super Admin' : 'Lễ tân',
            phone: a.phone || 'N/A',
            status: a.active !== false ? 'active' : 'suspended',
            statusLabel: a.active !== false ? 'Hoạt động' : 'Tạm khóa',
            lastActive: a.created_at ? new Date(a.created_at).toLocaleDateString('vi-VN') : 'Mới tạo',
        }))

        return ok(mapped)
    } catch (err: unknown) {
        console.error('[GET /api/admin/accounts error]', err)
        return serverError()
    }
}, 'account.manage')
