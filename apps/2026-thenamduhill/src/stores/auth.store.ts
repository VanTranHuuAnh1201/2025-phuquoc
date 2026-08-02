'use client'

/**
 * Phiên đăng nhập của khách và của quản trị viên.
 *
 * Bản demo: OTP cố định `1234`, hiện thẳng trên màn hình login. Không có mật
 * khẩu, không gọi SMS. Khi lên Supabase, chỉ thay thân `verifyOtp()` — chữ ký
 * và mọi nơi gọi giữ nguyên.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isValidEmail, isValidPhone } from '@repo/core'
import type { Account, Role } from '@repo/core'

/** OTP dùng chung cho mọi tài khoản trong bản demo. */
export const DEMO_OTP = '1234'

/** Tài khoản quản trị dựng sẵn, để vào được CMS ngay. */
export const DEMO_STAFF: Account[] = [
    {
        id: 'staff-owner',
        role: 'owner',
        fullName: 'Trần Văn Hải',
        phone: '0901000001',
        email: 'owner@namduhill.vn',
        createdAt: '2026-01-01T00:00:00.000Z',
        active: true,
    },
    {
        id: 'staff-01',
        role: 'receptionist',
        fullName: 'Lê Thị Ngọc',
        phone: '0901000002',
        email: 'ngoc@namduhill.vn',
        createdAt: '2026-01-01T00:00:00.000Z',
        active: true,
    },
    {
        id: 'staff-editor',
        role: 'editor',
        fullName: 'Phạm Quốc Bảo',
        phone: '0901000003',
        email: 'bao@namduhill.vn',
        createdAt: '2026-01-01T00:00:00.000Z',
        active: true,
    },
]

export type IdentifierKind = 'phone' | 'email' | 'invalid'

/** Định danh khách nhập là số điện thoại hay email. */
export function classifyIdentifier(value: string): IdentifierKind {
    const trimmed = value.trim()
    if (isValidPhone(trimmed)) return 'phone'
    if (isValidEmail(trimmed)) return 'email'
    return 'invalid'
}

export type OtpError = 'identifier-invalid' | 'otp-wrong' | 'account-disabled'

interface AuthState {
    user: Account | null
    /** Định danh đang chờ xác thực OTP. */
    pendingIdentifier: string | null

    /** Bước 1: nhận định danh, chuyển sang màn nhập OTP. */
    requestOtp: (identifier: string) => OtpError | null
    /** Bước 2: xác thực. Tài khoản khách chưa có thì tự tạo. */
    verifyOtp: (otp: string) => OtpError | null
    /** Đăng nhập thẳng bằng tài khoản dựng sẵn — dùng cho nút demo ở CMS. */
    loginAs: (accountId: string) => void
    logout: () => void
    cancelOtp: () => void
    hasRole: (...roles: Role[]) => boolean
}

/** Tài khoản khách mới, sinh từ định danh vừa xác thực. */
function makeCustomerAccount(identifier: string): Account {
    const kind = classifyIdentifier(identifier)
    const clean = identifier.trim()
    return {
        id: `cus-${clean}`,
        role: 'customer',
        fullName: '',
        phone: kind === 'phone' ? clean : '',
        email: kind === 'email' ? clean : '',
        createdAt: new Date().toISOString(),
        active: true,
    }
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            pendingIdentifier: null,

            requestOtp: (identifier) => {
                if (classifyIdentifier(identifier) === 'invalid') {
                    return 'identifier-invalid'
                }
                set({ pendingIdentifier: identifier.trim() })
                return null
            },

            verifyOtp: (otp) => {
                const identifier = get().pendingIdentifier
                if (!identifier) return 'identifier-invalid'
                if (otp.trim() !== DEMO_OTP) return 'otp-wrong'

                // Tài khoản nội bộ khớp SĐT/email thì đăng nhập bằng vai trò đó;
                // còn lại là khách, tự tạo tài khoản sau khi xác thực thành công.
                const staff = DEMO_STAFF.find(
                    (a) => a.phone === identifier || a.email === identifier,
                )
                if (staff && !staff.active) return 'account-disabled'

                set({
                    user: staff ?? makeCustomerAccount(identifier),
                    pendingIdentifier: null,
                })
                return null
            },

            loginAs: (accountId) => {
                const staff = DEMO_STAFF.find((a) => a.id === accountId)
                if (staff) set({ user: staff, pendingIdentifier: null })
            },

            logout: () => set({ user: null, pendingIdentifier: null }),
            cancelOtp: () => set({ pendingIdentifier: null }),

            hasRole: (...roles) => {
                const user = get().user
                return user ? roles.includes(user.role) : false
            },
        }),
        {
            name: 'namduhill.auth',
            // `pendingIdentifier` cố ý KHÔNG persist: mở lại tab mà vẫn đang kẹt
            // ở màn OTP là trạng thái khó hiểu cho người dùng.
            partialize: (state) => ({ user: state.user }),
        },
    ),
)
