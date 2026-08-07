'use client'

/**
 * Đăng nhập & Đăng ký — email + mật khẩu, gọi thẳng `/api/auth/*`.
 *
 * Chốt v1.0.0: **không có OTP**. Chưa có nhà cung cấp SMS Brandname
 * (MANUAL.md M3/M16) nên dựng màn OTP là dựng một cửa không gửi được mã —
 * đúng cửa sau mà M16 cảnh báo: ai nhập `1234` cũng vào được tài khoản người
 * khác. Email + mật khẩu chạy được ngay và không nợ nhà cung cấp nào.
 *
 * Chặn ở đây là bắt buộc theo yêu cầu khách: khách chọn ngày và phòng tự do,
 * bấm "Đặt phòng" mới bị đẩy tới màn này, rồi quay lại ĐÚNG chỗ đã rời đi qua
 * `?next=` (`.claude/rules/app-flows.md` §F1). Giỏ hàng nằm trong `cart.store`
 * có persist nên không mất khi đi qua đây.
 */

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Field } from '@repo/ui'
import { useAuthStore } from '@/stores/auth.store'
import type { AuthError } from '@/stores/auth.store'
import { LocaleProvider, useLocale } from '@/components/LocaleProvider'
import { AccountBar } from '@/components/AccountBar'
import { S, tr } from '@/strings'

type Tab = 'login' | 'register'

export default function LoginPage() {
    return (
        <LocaleProvider>
            <Suspense fallback={null}>
                <AuthScreen />
            </Suspense>
        </LocaleProvider>
    )
}

function AuthScreen() {
    const { locale } = useLocale()
    const router = useRouter()
    const params = useSearchParams()

    const login = useAuthStore((s) => s.login)
    const register = useAuthStore((s) => s.register)
    const pending = useAuthStore((s) => s.pending)

    const [tab, setTab] = useState<Tab>('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [phone, setPhone] = useState('')
    const [error, setError] = useState<AuthError | null>(null)

    /**
     * Chỉ nhận đường dẫn nội bộ. Không kiểm thì `?next=https://kẻ-xấu` biến màn
     * đăng nhập thành bàn đạp chuyển hướng (open redirect).
     */
    const rawNext = params.get('next')
    const next = rawNext && rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : null

    /** Nhân viên về CMS, khách về đơn của mình — trừ khi `?next=` chỉ chỗ khác. */
    const goAfterAuth = () => {
        const role = useAuthStore.getState().user?.role
        const home = role && role !== 'customer' ? '/admin' : '/my-orders'
        router.replace(next ?? home)
    }

    const submit = async (event: React.FormEvent) => {
        event.preventDefault()
        setError(null)

        const result =
            tab === 'login'
                ? await login(email, password, locale)
                : await register({ email, password, fullName, phone }, locale)

        if (result) {
            setError(result)
            return
        }
        goAfterAuth()
    }

    const switchTab = (nextTab: Tab) => {
        setTab(nextTab)
        setError(null)
    }

    const isLogin = tab === 'login'

    return (
        <main
            data-theme="h3"
            style={{
                minHeight: '100vh',
                display: 'grid',
                placeItems: 'center',
                padding: 'var(--space-4) var(--space-4)',
                background: 'linear-gradient(135deg, var(--brand-darker, #0b192c) 0%, #0f2d52 50%, var(--brand-mid, #163b6c) 100%)',
                fontFamily: 'var(--font-body)',
                color: 'var(--text)',
                position: 'relative',
            }}
        >
            <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 10 }}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginBottom: 'var(--space-3)',
                    }}
                >
                    <AccountBar />
                </div>

                <div
                    style={{
                        background: 'var(--surface, #ffffff)',
                        border: '1px solid var(--border-muted, #e5e7eb)',
                        borderRadius: 'var(--radius-lg, 16px)',
                        padding: 'var(--space-6) var(--space-6)',
                        boxShadow: 'var(--shadow-lg, 0 20px 60px rgba(0,0,0,0.25))',
                    }}
                >
                    <header style={{ textAlign: 'center', marginBottom: 'var(--space-5)' }}>
                        <div
                            style={{
                                fontSize: 'var(--text-base)',
                                fontFamily: 'var(--font-display)',
                                fontWeight: 700,
                                color: 'var(--accent-text, #9a6600)',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                marginBottom: 4,
                            }}
                        >
                            THE NAM DU HILL
                        </div>
                        <h1
                            style={{
                                margin: '0 0 var(--space-2)',
                                fontSize: '1.625rem',
                                fontFamily: 'var(--font-display)',
                                color: 'var(--brand-dark, #0f2d52)',
                                fontWeight: 700,
                            }}
                        >
                            {tr(isLogin ? S.loginTitle : S.registerTitle, locale)}
                        </h1>
                        <p
                            style={{
                                margin: 0,
                                fontSize: 'var(--text-sm)',
                                color: 'var(--text-muted, #4b5563)',
                                lineHeight: 1.5,
                            }}
                        >
                            {next && isLogin
                                ? tr(S.loginRequired, locale)
                                : tr(isLogin ? S.loginSubtitle : S.registerSubtitle, locale)}
                        </p>
                    </header>

                    {/* Hai tab, không phải hai trang: khách đang nhập dở mà bị
                        chuyển trang là mất chữ đã gõ. */}
                    <div
                        role="tablist"
                        aria-label={tr(S.loginTitle, locale)}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 'var(--space-1)',
                            padding: 'var(--space-1)',
                            marginBottom: 'var(--space-6)',
                            background: 'var(--surface-alt)',
                            borderRadius: 'var(--radius)',
                        }}
                    >
                        {(['login', 'register'] as const).map((key) => {
                            const active = tab === key
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    role="tab"
                                    aria-selected={active}
                                    onClick={() => switchTab(key)}
                                    disabled={pending}
                                    style={{
                                        minHeight: 40,
                                        padding: 'var(--space-2) var(--space-3)',
                                        fontSize: 'var(--text-sm)',
                                        fontFamily: 'var(--font-body)',
                                        fontWeight: active ? 600 : 400,
                                        color: active ? 'var(--brand)' : 'var(--text-muted)',
                                        background: active ? 'var(--surface)' : 'transparent',
                                        border: 'none',
                                        borderRadius: 'var(--radius-sm)',
                                        boxShadow: active ? 'var(--shadow-sm)' : 'none',
                                        cursor: pending ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {tr(key === 'login' ? S.tabLogin : S.tabRegister, locale)}
                                </button>
                            )
                        })}
                    </div>

                    <form onSubmit={submit} style={{ display: 'grid', gap: 'var(--space-5)' }}>
                        {!isLogin && (
                            <>
                                <Field
                                    label={tr(S.fullNameLabel, locale)}
                                    placeholder={tr(S.fullNamePlaceholder, locale)}
                                    value={fullName}
                                    onChange={(e) => {
                                        setFullName(e.target.value)
                                        setError(null)
                                    }}
                                    autoComplete="name"
                                    disabled={pending}
                                    required
                                />
                                <Field
                                    label={tr(S.phoneLabel, locale)}
                                    placeholder={tr(S.phonePlaceholder, locale)}
                                    value={phone}
                                    onChange={(e) => {
                                        setPhone(e.target.value)
                                        setError(null)
                                    }}
                                    autoComplete="tel"
                                    inputMode="tel"
                                    disabled={pending}
                                    required
                                />
                            </>
                        )}

                        <Field
                            label={tr(S.emailLabel, locale)}
                            placeholder={tr(S.emailPlaceholder, locale)}
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setError(null)
                            }}
                            type="email"
                            autoComplete="email"
                            inputMode="email"
                            disabled={pending}
                            autoFocus
                            required
                        />

                        <Field
                            label={tr(S.passwordLabel, locale)}
                            placeholder={tr(S.passwordPlaceholder, locale)}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setError(null)
                            }}
                            type="password"
                            autoComplete={isLogin ? 'current-password' : 'new-password'}
                            disabled={pending}
                            required
                        />

                        {/* Lỗi báo bằng CHỮ, không chỉ đổi màu (luật FE1/D3).
                            `aria-live` để trình đọc màn hình đọc lên (D4). */}
                        {error && (
                            <div
                                role="alert"
                                aria-live="polite"
                                style={{
                                    padding: 'var(--space-3) var(--space-4)',
                                    background: 'var(--danger-bg)',
                                    color: 'var(--danger)',
                                    border: '1px solid var(--danger)',
                                    borderRadius: 'var(--radius)',
                                    fontSize: 'var(--text-sm)',
                                }}
                            >
                                {error.message}
                            </div>
                        )}

                        <Button type="submit" size="md" disabled={pending} style={{ width: '100%' }}>
                            {pending
                                ? tr(isLogin ? S.loginProcessing : S.registerProcessing, locale)
                                : tr(isLogin ? S.login : S.register, locale)}
                        </Button>
                    </form>

                    <p
                        style={{
                            margin: 'var(--space-6) 0 0',
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-muted)',
                            textAlign: 'center',
                        }}
                    >
                        {tr(isLogin ? S.noAccountYet : S.hadAccount, locale)}{' '}
                        <button
                            type="button"
                            onClick={() => switchTab(isLogin ? 'register' : 'login')}
                            disabled={pending}
                            style={linkButtonStyle}
                        >
                            {tr(isLogin ? S.tabRegister : S.tabLogin, locale)}
                        </button>
                    </p>
                </div>

                <div style={{ textAlign: 'center', marginTop: 'var(--space-5)' }}>
                    <Link
                        href="/"
                        style={{
                            fontSize: 'var(--text-sm)',
                            color: 'rgba(255, 255, 255, 0.85)',
                            textDecoration: 'none',
                            fontWeight: 500,
                            transition: 'color 0.2s',
                        }}
                    >
                        ← {tr(S.backHome, locale)}
                    </Link>
                </div>
            </div>
        </main>
    )
}

const linkButtonStyle: React.CSSProperties = {
    fontSize: 'var(--text-sm)',
    fontFamily: 'var(--font-body)',
    color: 'var(--brand)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    minHeight: 24,
    padding: 0,
}
