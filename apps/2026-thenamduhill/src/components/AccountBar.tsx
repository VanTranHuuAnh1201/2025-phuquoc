'use client'

/**
 * Cụm điều khiển góc phải header: chuyển ngôn ngữ · chuông · tài khoản.
 *
 * Khách yêu cầu "một icon nhỏ nằm ở top header" cho đăng nhập, và một chuông
 * thông báo. Cả hai gộp ở đây để mọi theme chỉ phải nhúng một component.
 * Xem `.claude/rules/app-flows.md` §F1 và §F3.
 */

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { formatPrice, LOCALES, pick } from '@repo/core'
import type { Notification } from '@repo/core'
import { useAuthStore } from '@/stores/auth.store'
import { useNotifyStore } from '@/stores/notify.store'
import { useLocale } from './LocaleProvider'
import { BellIcon, UserIcon } from './icons'
import { NOTIFICATION_TITLE, S, tr } from '@/strings'

const ICON_BUTTON: React.CSSProperties = {
    width: 34,
    height: 34,
    display: 'grid',
    placeItems: 'center',
    background: 'transparent',
    border: 'none',
    borderRadius: 'var(--radius-pill)',
    color: 'inherit',
    cursor: 'pointer',
    position: 'relative',
    flexShrink: 0,
    transition: 'opacity 180ms ease',
}

const PANEL: React.CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + var(--space-2))',
    right: 0,
    minWidth: 260,
    maxWidth: 'min(340px, calc(100vw - var(--space-8)))',
    background: 'var(--surface)',
    color: 'var(--text)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 60,
    overflow: 'hidden',
}

export function AccountBar() {
    const { locale, setLocale } = useLocale()
    const user = useAuthStore((s) => s.user)
    const logout = useAuthStore((s) => s.logout)
    const pathname = usePathname()

    const [openPanel, setOpenPanel] = useState<'none' | 'bell' | 'user'>('none')
    const wrapRef = useRef<HTMLDivElement>(null)

    // Đóng khi bấm ra ngoài hoặc bấm Esc — hai lối thoát mà người dùng luôn thử.
    useEffect(() => {
        if (openPanel === 'none') return

        function onPointerDown(event: MouseEvent) {
            if (!wrapRef.current?.contains(event.target as Node)) setOpenPanel('none')
        }
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') setOpenPanel('none')
        }

        document.addEventListener('mousedown', onPointerDown)
        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.removeEventListener('mousedown', onPointerDown)
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [openPanel])

    const loginHref = `/login?next=${encodeURIComponent(pathname)}`

    return (
        <div
            ref={wrapRef}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                position: 'relative',
            }}
        >
            {/* ---- chuyển ngôn ngữ ---- */}
            <div
                role="group"
                aria-label={pick({ vi: 'Chọn ngôn ngữ', en: 'Choose language' }, locale)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontSize: 12.5,
                    fontWeight: 600,
                    marginRight: 2,
                }}
            >
                {LOCALES.map((code, index) => (
                    <span key={code} style={{ display: 'inline-flex', alignItems: 'center' }}>
                        {index > 0 && (
                            <span style={{ opacity: 0.35, fontSize: 11, margin: '0 3px' }}>|</span>
                        )}
                        <button
                            type="button"
                            onClick={() => setLocale(code)}
                            aria-pressed={locale === code}
                            style={{
                                padding: '2px 3px',
                                fontSize: '12px',
                                fontWeight: locale === code ? 700 : 400,
                                fontFamily: 'var(--font-body)',
                                color: 'inherit',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                opacity: locale === code ? 1 : 0.55,
                                textTransform: 'uppercase',
                                transition: 'opacity 180ms ease',
                            }}
                        >
                            {code}
                        </button>
                    </span>
                ))}
            </div>

            {/* ---- chuông, chỉ khi đã đăng nhập ---- */}
            {user && (
                <NotificationBell
                    accountId={user.id}
                    open={openPanel === 'bell'}
                    onToggle={() => setOpenPanel((p) => (p === 'bell' ? 'none' : 'bell'))}
                />
            )}

            {/* ---- tài khoản ---- */}
            {user ? (
                <>
                    <button
                        type="button"
                        onClick={() => setOpenPanel((p) => (p === 'user' ? 'none' : 'user'))}
                        aria-expanded={openPanel === 'user'}
                        aria-label={user.fullName || tr(S.myOrders, locale)}
                        style={ICON_BUTTON}
                    >
                        <UserIcon size={18} />
                    </button>

                    {openPanel === 'user' && (
                        <div style={PANEL} role="menu">
                            <div
                                style={{
                                    padding: 'var(--space-4)',
                                    borderBottom: '1px solid var(--border)',
                                }}
                            >
                                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                                    {user.fullName || tr(S.guest, locale)}
                                </div>
                                <div
                                    style={{
                                        fontSize: 'var(--text-xs)',
                                        color: 'var(--text-muted)',
                                    }}
                                >
                                    {user.phone || user.email}
                                </div>
                            </div>
                            <MenuLink href="/my-orders" onClick={() => setOpenPanel('none')}>
                                {tr(S.myOrders, locale)}
                            </MenuLink>
                            {user.role !== 'customer' && (
                                <MenuLink href="/admin" onClick={() => setOpenPanel('none')}>
                                    {tr(S.adminPanel, locale)}
                                </MenuLink>
                            )}
                            <button
                                type="button"
                                onClick={() => {
                                    logout()
                                    setOpenPanel('none')
                                }}
                                style={{
                                    width: '100%',
                                    padding: 'var(--space-3) var(--space-4)',
                                    textAlign: 'left',
                                    fontSize: 'var(--text-sm)',
                                    fontFamily: 'var(--font-body)',
                                    color: 'var(--danger)',
                                    background: 'transparent',
                                    border: 'none',
                                    borderTop: '1px solid var(--border)',
                                    cursor: 'pointer',
                                }}
                            >
                                {tr(S.logout, locale)}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <Link
                    href={loginHref}
                    aria-label={tr(S.login, locale)}
                    style={{ ...ICON_BUTTON, textDecoration: 'none' }}
                >
                    <UserIcon size={18} />
                </Link>
            )}
        </div>
    )
}

function MenuLink({
    href,
    onClick,
    children,
}: {
    href: string
    onClick: () => void
    children: React.ReactNode
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            role="menuitem"
            style={{
                display: 'block',
                padding: 'var(--space-3) var(--space-4)',
                fontSize: 'var(--text-sm)',
                color: 'var(--text)',
                textDecoration: 'none',
            }}
        >
            {children}
        </Link>
    )
}

// ================================================================== chuông

function NotificationBell({
    accountId,
    open,
    onToggle,
}: {
    accountId: string
    open: boolean
    onToggle: () => void
}) {
    const { locale } = useLocale()
    const items = useNotifyStore((s) => s.items)
    const markAllRead = useNotifyStore((s) => s.markAllRead)

    const mine = items
        .filter((n) => n.accountId === accountId)
        .sort((a, b) => b.at.localeCompare(a.at))
    const unread = mine.filter((n) => !n.read).length

    return (
        <>
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                aria-label={
                    unread > 0
                        ? `${tr(S.notifications, locale)} (${unread})`
                        : tr(S.notifications, locale)
                }
                style={ICON_BUTTON}
            >
                <BellIcon size={18} />
                {unread > 0 && (
                    <span
                        style={{
                            position: 'absolute',
                            top: -2,
                            right: -2,
                            minWidth: 16,
                            height: 16,
                            padding: '0 4px',
                            display: 'grid',
                            placeItems: 'center',
                            background: 'var(--danger)',
                            color: '#fff',
                            fontSize: 10,
                            fontWeight: 700,
                            borderRadius: 'var(--radius-pill)',
                        }}
                    >
                        {unread > 9 ? '9+' : unread}
                    </span>
                )}
            </button>

            {open && (
                <div style={{ ...PANEL, minWidth: 320 }}>
                    <div
                        style={{
                            padding: 'var(--space-3) var(--space-4)',
                            borderBottom: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 'var(--space-4)',
                        }}
                    >
                        <strong style={{ fontSize: 'var(--text-sm)' }}>
                            {tr(S.notifications, locale)}
                        </strong>
                        {unread > 0 && (
                            <button
                                type="button"
                                onClick={() => markAllRead(accountId)}
                                style={{
                                    fontSize: 'var(--text-xs)',
                                    fontFamily: 'var(--font-body)',
                                    color: 'var(--brand)',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    minHeight: 24,
                                }}
                            >
                                {tr(S.markAllRead, locale)}
                            </button>
                        )}
                    </div>

                    <div style={{ maxHeight: 380, overflowY: 'auto' }}>
                        {mine.length === 0 ? (
                            <p
                                style={{
                                    padding: 'var(--space-8) var(--space-4)',
                                    margin: 0,
                                    textAlign: 'center',
                                    fontSize: 'var(--text-sm)',
                                    color: 'var(--text-muted)',
                                }}
                            >
                                {tr(S.noNotifications, locale)}
                            </p>
                        ) : (
                            mine.slice(0, 20).map((item) => (
                                <NotificationRow key={item.id} item={item} />
                            ))
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

function NotificationRow({ item }: { item: Notification }) {
    const { locale } = useLocale()
    const markRead = useNotifyStore((s) => s.markRead)

    const roomName = item.payload?.roomTypeName
        ? pick(item.payload.roomTypeName, locale)
        : undefined

    const body = [
        roomName,
        item.payload?.nights ? `${item.payload.nights} ${tr(S.nights, locale)}` : undefined,
    ]
        .filter(Boolean)
        .join(' · ')

    const content = (
        <>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 'var(--space-2)',
                }}
            >
                {!item.read && (
                    <span
                        aria-hidden="true"
                        style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: 'var(--brand)',
                            flexShrink: 0,
                        }}
                    />
                )}
                <strong style={{ fontSize: 'var(--text-sm)' }}>
                    {tr(NOTIFICATION_TITLE[item.kind], locale)}
                </strong>
            </div>
            {body && (
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{body}</div>
            )}
            {item.payload?.amount !== undefined && (
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                    {formatPrice(item.payload.amount, locale)}
                </div>
            )}
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                {new Date(item.at).toLocaleString(pick({ vi: 'vi-VN', en: 'en-US' }, locale), {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                })}

                {item.bookingCode ? ` · ${item.bookingCode}` : ''}
            </div>
        </>
    )

    const style: React.CSSProperties = {
        display: 'grid',
        gap: 2,
        padding: 'var(--space-3) var(--space-4)',
        borderBottom: '1px solid var(--border)',
        textDecoration: 'none',
        color: 'var(--text)',
        background: item.read ? 'transparent' : 'var(--surface-tint)',
    }

    if (item.bookingId) {
        return (
            <Link href={`/my-orders/${item.bookingId}`} onClick={() => markRead(item.id)} style={style}>
                {content}
            </Link>
        )
    }

    return <div style={style}>{content}</div>
}
