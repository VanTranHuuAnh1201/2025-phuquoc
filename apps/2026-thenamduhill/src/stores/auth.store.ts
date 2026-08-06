'use client'

/**
 * Phiên đăng nhập của khách và của quản trị viên.
 *
 * Chốt v1.0.0: **email + mật khẩu**, gọi thẳng `/api/auth/*`. Luồng OTP qua SMS
 * đã gỡ bỏ vì chưa có nhà cung cấp SMS Brandname (MANUAL.md M3/M16) — giữ một
 * cửa đăng nhập không gửi được mã chính là để lại cửa sau mà M16 cảnh báo.
 *
 * Phiên thật nằm trong cookie `HttpOnly` do server cấp; store này chỉ giữ bản
 * sao thông tin tài khoản để giao diện hiển thị. Cookie mới là nguồn sự thật —
 * store bị sửa trong DevTools cũng không vượt được quyền, vì mọi API đều đọc
 * vai trò từ token đã verify phía server (BE2).
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Account, Role } from '@repo/core'

/** Lỗi hiển thị được cho người dùng, đã dịch sẵn theo ngôn ngữ đang chọn. */
export interface AuthError {
    code: string
    message: string
}

interface ApiResponse {
    success: boolean
    data?: { account?: unknown }
    error?: { code?: string; message?: { vi?: string; en?: string } }
}

export interface RegisterInput {
    email: string
    password: string
    fullName: string
    phone: string
}

interface AuthState {
    user: Account | null
    /** Đang gọi API — dùng để khoá nút và hiện chỉ báo (luật FE1). */
    pending: boolean

    login: (email: string, password: string, locale: 'vi' | 'en') => Promise<AuthError | null>
    register: (input: RegisterInput, locale: 'vi' | 'en') => Promise<AuthError | null>
    logout: () => Promise<void>
    /** Đồng bộ lại từ cookie — cookie hết hạn thì xoá bản sao cục bộ. */
    refresh: () => Promise<void>
    hasRole: (...roles: Role[]) => boolean
}

const MSG_NETWORK = {
    vi: 'Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.',
    en: 'Cannot reach the server. Check your connection and try again.',
}

/** Chuyển tài khoản dạng snake_case của API sang `Account` của core. */
function toAccount(raw: unknown): Account | null {
    if (!raw || typeof raw !== 'object') return null
    const a = raw as Record<string, unknown>
    if (typeof a.id !== 'string' || typeof a.role !== 'string') return null
    return {
        id: a.id,
        role: a.role as Role,
        fullName: typeof a.fullName === 'string' ? a.fullName : '',
        phone: typeof a.phone === 'string' ? a.phone : '',
        email: typeof a.email === 'string' ? a.email : '',
        createdAt: typeof a.createdAt === 'string' ? a.createdAt : new Date().toISOString(),
        active: a.active !== false,
    }
}

/**
 * Gọi một endpoint auth và đặt `user` nếu thành công.
 * Trả `null` khi thành công, `AuthError` khi thất bại — nơi gọi chỉ việc hiện.
 */
async function callAuth(
    set: (partial: Partial<AuthState>) => void,
    url: string,
    body: unknown,
    locale: 'vi' | 'en',
): Promise<AuthError | null> {
    set({ pending: true })
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })
        const json = (await res.json()) as ApiResponse

        if (!res.ok || !json.success) {
            return {
                code: json.error?.code ?? 'UNKNOWN',
                message: json.error?.message?.[locale] ?? MSG_NETWORK[locale],
            }
        }

        const account = toAccount(json.data?.account)
        if (!account) {
            return { code: 'BAD_RESPONSE', message: MSG_NETWORK[locale] }
        }
        set({ user: account })
        return null
    } catch {
        return { code: 'NETWORK', message: MSG_NETWORK[locale] }
    } finally {
        set({ pending: false })
    }
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            pending: false,

            login: (email, password, locale) =>
                callAuth(set, '/api/auth/login', { email, password }, locale),

            register: (input, locale) => callAuth(set, '/api/auth/register', input, locale),

            logout: async () => {
                try {
                    await fetch('/api/auth/logout', { method: 'POST' })
                } catch {
                    // Xoá được cookie hay không thì bản sao cục bộ vẫn phải sạch:
                    // để lại `user` sau khi bấm Đăng xuất là hiểu nhầm nguy hiểm.
                }
                set({ user: null })
            },

            refresh: async () => {
                try {
                    const res = await fetch('/api/auth/me')
                    if (!res.ok) {
                        set({ user: null })
                        return
                    }
                    const json = (await res.json()) as ApiResponse
                    set({ user: json.success ? toAccount(json.data?.account) : null })
                } catch {
                    // Mất mạng không phải là đăng xuất — giữ nguyên bản sao cũ.
                }
            },

            hasRole: (...roles) => {
                const user = get().user
                return user ? roles.includes(user.role) : false
            },
        }),
        {
            name: 'namduhill.auth',
            // `pending` cố ý KHÔNG persist: mở lại tab mà nút vẫn đang quay là
            // trạng thái kẹt vĩnh viễn.
            partialize: (state) => ({ user: state.user }),
        },
    ),
)
