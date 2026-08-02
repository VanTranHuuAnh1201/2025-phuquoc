'use client'

/**
 * Đăng nhập — hai bước: nhập định danh, rồi nhập OTP.
 *
 * Chặn ở đây là bắt buộc theo yêu cầu khách: khách chọn ngày và phòng tự do,
 * bấm "Đặt phòng" mới bị đẩy tới màn này, và sau khi đăng nhập thì quay lại
 * ĐÚNG chỗ đã rời đi qua tham số `?next=` (xem `.claude/rules/app-flows.md` §F1).
 *
 * Giỏ hàng nằm trong `cart.store` có persist nên không mất khi đi qua đây.
 */

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Field } from '@repo/ui'
import { DEMO_OTP, DEMO_STAFF, useAuthStore } from '@/stores/auth.store'
import type { OtpError } from '@/stores/auth.store'
import { LocaleProvider, useLocale } from '@/components/LocaleProvider'
import { AccountBar } from '@/components/AccountBar'
import { S, ROLE_LABEL, tr } from '@/strings'

export default function LoginPage() {
    return (
        <LocaleProvider>
            <Suspense fallback={null}>
                <LoginScreen />
            </Suspense>
        </LocaleProvider>
    )
}

function LoginScreen() {
    const { locale } = useLocale()
    const router = useRouter()
    const params = useSearchParams()

    const requestOtp = useAuthStore((s) => s.requestOtp)
    const verifyOtp = useAuthStore((s) => s.verifyOtp)
    const cancelOtp = useAuthStore((s) => s.cancelOtp)
    const loginAs = useAuthStore((s) => s.loginAs)
    const pendingIdentifier = useAuthStore((s) => s.pendingIdentifier)

    const [identifier, setIdentifier] = useState('')
    const [otp, setOtp] = useState('')
    const [error, setError] = useState<OtpError | null>(null)

    /**
     * Chỉ nhận đường dẫn nội bộ. Không kiểm thì `?next=https://kẻ-xấu` biến màn
     * đăng nhập thành bàn đạp chuyển hướng (open redirect).
     */
    const rawNext = params.get('next')
    const next = rawNext && rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : null

    const done = () => router.replace(next ?? '/my-orders')

    const submitIdentifier = (event: React.FormEvent) => {
        event.preventDefault()
        setError(requestOtp(identifier))
    }

    const submitOtp = (event: React.FormEvent) => {
        event.preventDefault()
        const result = verifyOtp(otp)
        setError(result)
        if (!result) done()
    }

    const errorText =
        error === 'identifier-invalid'
            ? tr(S.errIdentifierInvalid, locale)
            : error === 'otp-wrong'
              ? tr(S.errOtpWrong, locale)
              : error === 'account-disabled'
                ? tr(S.errAccountDisabled, locale)
                : undefined

    return (
        <main
            data-theme="h1"
            style={{
                minHeight: '100vh',
                display: 'grid',
                placeItems: 'center',
                padding: 'var(--space-6)',
                background: 'var(--surface-alt)',
                fontFamily: 'var(--font-body)',
                color: 'var(--text)',
            }}
        >
            <div style={{ width: '100%', maxWidth: 420 }}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginBottom: 'var(--space-4)',
                    }}
                >
                    <AccountBar />
                </div>

                <div
                    style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-8)',
                        boxShadow: 'var(--shadow)',
                    }}
                >
                    <header style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
                        <div
                            style={{
                                fontSize: 'var(--text-xl)',
                                fontFamily: 'var(--font-display)',
                                fontWeight: 700,
                                color: 'var(--brand)',
                                letterSpacing: '0.02em',
                            }}
                        >
                            THE NAM DU HILL
                        </div>
                        <h1
                            style={{
                                margin: 'var(--space-5) 0 var(--space-2)',
                                fontSize: 'var(--text-2xl)',
                                fontFamily: 'var(--font-display)',
                            }}
                        >
                            {tr(S.loginTitle, locale)}
                        </h1>
                        <p
                            style={{
                                margin: 0,
                                fontSize: 'var(--text-sm)',
                                color: 'var(--text-muted)',
                            }}
                        >
                            {next
                                ? tr(S.loginRequired, locale)
                                : tr(S.loginSubtitle, locale)}
                        </p>
                    </header>

                    {!pendingIdentifier ? (
                        <form
                            onSubmit={submitIdentifier}
                            style={{ display: 'grid', gap: 'var(--space-5)' }}
                        >
                            <Field
                                label={tr(S.identifierLabel, locale)}
                                placeholder={tr(S.identifierPlaceholder, locale)}
                                value={identifier}
                                onChange={(e) => {
                                    setIdentifier(e.target.value)
                                    setError(null)
                                }}
                                error={errorText}
                                autoComplete="tel"
                                inputMode="tel"
                                required
                            />
                            <Button type="submit" size="lg">
                                {tr(S.next, locale)}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={submitOtp} style={{ display: 'grid', gap: 'var(--space-5)' }}>
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: 'var(--text-sm)',
                                    color: 'var(--text-muted)',
                                    textAlign: 'center',
                                }}
                            >
                                {tr(S.otpSentTo, locale)}{' '}
                                <strong style={{ color: 'var(--text)' }}>{pendingIdentifier}</strong>
                            </p>

                            <Field
                                label={tr(S.otpLabel, locale)}
                                placeholder="1234"
                                value={otp}
                                onChange={(e) => {
                                    setOtp(e.target.value)
                                    setError(null)
                                }}
                                error={errorText}
                                inputMode="numeric"
                                maxLength={4}
                                autoFocus
                                required
                                style={{
                                    textAlign: 'center',
                                    fontSize: 'var(--text-xl)',
                                    letterSpacing: '0.5em',
                                }}
                            />

                            <Button type="submit" size="lg">
                                {tr(S.login, locale)}
                            </Button>

                            <button
                                type="button"
                                onClick={() => {
                                    cancelOtp()
                                    setOtp('')
                                    setError(null)
                                }}
                                style={linkButtonStyle}
                            >
                                {tr(S.changeIdentifier, locale)}
                            </button>
                        </form>
                    )}

                    {/* Gợi ý OTP: đây là bản demo, cố ý hiện thẳng để người xem
                        không phải đoán. Production sẽ không có khối này. */}
                    <div
                        style={{
                            marginTop: 'var(--space-6)',
                            padding: 'var(--space-3) var(--space-4)',
                            background: 'var(--info-bg)',
                            color: 'var(--info)',
                            borderRadius: 'var(--radius)',
                            fontSize: 'var(--text-xs)',
                            textAlign: 'center',
                        }}
                    >
                        {tr(S.otpDemoHint, locale)} — <strong>{DEMO_OTP}</strong>
                    </div>

                    {/* Đăng nhập nhanh bằng tài khoản nội bộ, để người xem vào
                        thẳng CMS mà không phải nhớ số điện thoại nào. */}
                    <div style={{ marginTop: 'var(--space-6)' }}>
                        <div
                            style={{
                                fontSize: 'var(--text-xs)',
                                color: 'var(--text-muted)',
                                textAlign: 'center',
                                marginBottom: 'var(--space-3)',
                            }}
                        >
                            {tr(S.loginDemoStaff, locale)}
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 'var(--space-2)',
                                justifyContent: 'center',
                            }}
                        >
                            {DEMO_STAFF.map((staff) => (
                                <button
                                    key={staff.id}
                                    type="button"
                                    onClick={() => {
                                        loginAs(staff.id)
                                        router.replace(next ?? '/admin')
                                    }}
                                    style={{
                                        padding: 'var(--space-2) var(--space-4)',
                                        fontSize: 'var(--text-xs)',
                                        fontFamily: 'var(--font-body)',
                                        color: 'var(--text-muted)',
                                        background: 'var(--surface-alt)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-pill)',
                                        cursor: 'pointer',
                                        minHeight: 28,
                                    }}
                                >
                                    {tr(ROLE_LABEL[staff.role], locale)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: 'var(--space-5)' }}>
                    <Link
                        href="/"
                        style={{
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-muted)',
                            textDecoration: 'none',
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
    color: 'var(--text-muted)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    minHeight: 24,
}
