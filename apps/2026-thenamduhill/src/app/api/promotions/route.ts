import { fail, ok, serverError } from '@/lib/auth/errors'
import { createAdminClient } from '@/utils/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const adminSupabase = createAdminClient()
        const { data: promotions, error } = await adminSupabase
            .from('promotions')
            .select('*')
            .order('priority', { ascending: true })

        if (error) {
            console.error('[GET /api/promotions DB error]', error)
            return ok([])
        }

        return ok(promotions || [])
    } catch (err: any) {
        console.error('[GET /api/promotions error]', err)
        return serverError()
    }
}
