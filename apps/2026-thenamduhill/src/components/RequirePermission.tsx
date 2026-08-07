'use client'

/**
 * Chặn quyền CẤP TRANG cho CMS (ticket `100-04` §6.5, `100-05` AC-6).
 *
 * ⚠️ Ẩn mục trên menu KHÔNG phải phân quyền — gõ thẳng URL là vào. Mỗi trang
 * quản trị phải tự gate bằng `can()`.
 *
 * ⚠️ Và ngay cả khối này cũng KHÔNG phải bảo mật (luật A3/BE2): nó chỉ chặn ở
 * trình duyệt. Chặn thật nằm ở Route Handler (`requirePermission()`) và RLS —
 * `200-05` cài lớp đó. Ở GD1 dữ liệu nằm trong `localStorage` của chính máy
 * đang đăng nhập nên đây là mức chặn đủ đúng với phạm vi.
 *
 * Dùng `can()` chứ KHÔNG so sánh `role === '...'` bằng tay: ma trận quyền có
 * một nguồn sự thật duy nhất ở `packages/core/src/permissions.ts`.
 */

import type { Permission } from '@repo/core'
import { can, canAny } from '@repo/core'
import { useLocale } from '@/components/LocaleProvider'
import { useAuthStore } from '@/stores/auth.store'
import { tr } from '@/strings'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

const DENIED = {
    title: { vi: 'Không có quyền truy cập', en: 'Access denied' },
    body: {
        vi: 'Tài khoản của bạn không có quyền truy cập trang này. Liên hệ quản trị viên nếu bạn cho rằng đây là nhầm lẫn.',
        en: 'Your account does not have permission to view this page. Contact an administrator if you believe this is a mistake.',
    },
    back: { vi: 'Về bảng hôm nay', en: 'Back to today dashboard' },
}

export interface RequirePermissionProps {
    /** Cần ÍT NHẤT MỘT trong các quyền này. */
    anyOf: readonly Permission[]
    children: ReactNode
}

export function RequirePermission({ anyOf, children }: RequirePermissionProps) {
    const { locale } = useLocale()
    const user = useAuthStore((s) => s.user)

    // Chờ hydrate xong mới kết luận: `persist` của zustand nạp `localStorage` ở
    // effect đầu tiên, render trước đó `user` luôn null và trang sẽ nháy khối
    // "không có quyền" với chính chủ tài khoản hợp lệ.
    const [hydrated, setHydrated] = useState(false)
    useEffect(() => setHydrated(true), [])

    if (!hydrated || !user) return null

    if (!canAny(user.role, anyOf)) {
        return (
            <div className="flex-1 flex items-center justify-center p-6">
                <div
                    role="alert"
                    aria-live="polite"
                    className="max-w-md w-full bg-white border border-slate-200 rounded-lg shadow-sm p-5 text-center space-y-3"
                >
                    <h1 className="text-base font-bold text-slate-900">{tr(DENIED.title, locale)}</h1>
                    <p className="text-xs text-slate-600 leading-relaxed">{tr(DENIED.body, locale)}</p>
                    <Link
                        href="/admin"
                        className="inline-flex items-center justify-center min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-900 text-white hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 transition-colors"
                    >
                        {tr(DENIED.back, locale)}
                    </Link>
                </div>
            </div>
        )
    }

    return <>{children}</>
}

/**
 * Vai trò hiện tại có quyền X không — tiện dụng cho việc ẩn/hiện Ô NHẬP bên
 * trong một trang đã qua guard (ví dụ: ô giá gốc chỉ `price.edit` mới thấy).
 *
 * Trả `false` khi chưa đăng nhập, để mặc định luôn là "không được".
 */
export function useCan(permission: Permission): boolean {
    const user = useAuthStore((s) => s.user)
    return user ? can(user.role, permission) : false
}
