import { fail, ok, serverError } from '@/lib/auth/errors'
import { createAdminClient } from '@/utils/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
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

        const mapped = (accounts || []).map((a: any) => ({
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
    } catch (err: any) {
        console.error('[GET /api/admin/accounts error]', err)
        return serverError()
    }
}
