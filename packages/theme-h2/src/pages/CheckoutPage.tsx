'use client'

import { useMemo, useState } from 'react'
import {
    formatPrice,
    pick,
    roomPath,
    themePath,
    themeRoot,
    type Locale,
    type PropertyData,
} from '@repo/core'
import { ImageSlot } from '@repo/ui'

import { meta } from '../meta'
import { ui } from '../strings'
import { Header } from '../sections/Header'
import { Contact } from '../sections/Contact'

const SLUG = meta.slug

interface CheckoutPageProps {
    data: PropertyData
    locale: Locale
    searchParams?: Record<string, string | string[] | undefined>
}

export function CheckoutPage({ data, locale, searchParams }: CheckoutPageProps) {
    const t = ui[locale]
    const isVi = locale === 'vi'

    // Parse query params if provided
    const roomParam = typeof searchParams?.room === 'string' ? searchParams.room : undefined
    const roomsParam = typeof searchParams?.rooms === 'string' ? searchParams.rooms.split(',') : undefined

    const selectedRoom = useMemo(() => {
        if (roomParam) {
            const found = data.rooms.find((r) => r.id === roomParam)
            if (found) return found
        }
        if (roomsParam && roomsParam.length > 0) {
            const found = data.rooms.find((r) => r.id === roomsParam[0])
            if (found) return found
        }
        return data.rooms[0]!
    }, [data.rooms, roomParam, roomsParam])

    const [step, setStep] = useState<0 | 1 | 2>(0)
    const [nights, setNights] = useState(1)
    const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({
        'addon-ferry': true,
    })
    const [selectedPayment, setSelectedPayment] = useState(0)
    const [agreed, setAgreed] = useState(false)
    const [isConfirmed, setIsConfirmed] = useState(false)

    // Form inputs state
    const [guestName, setGuestName] = useState('')
    const [guestPhone, setGuestPhone] = useState('')
    const [guestEmail, setGuestEmail] = useState('')
    const [guestId, setGuestId] = useState('')
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [notes, setNotes] = useState('')

    const roomsSubtotal = selectedRoom.price * nights

    const addonsSubtotal = useMemo(() => {
        const guestsCount = selectedRoom.guests
        return data.addons.reduce((sum, a) => {
            if (!selectedAddons[a.id] || !a.price) return sum
            const multiplier = a.id === 'addon-bike' ? nights : guestsCount
            return sum + a.price * multiplier
        }, 0)
    }, [data.addons, selectedAddons, nights, selectedRoom.guests])

    const vat = (roomsSubtotal + addonsSubtotal) * 0.08
    const grandTotal = roomsSubtotal + addonsSubtotal + vat
    const depositAmount = grandTotal * 0.3

    const toggleAddon = (id: string) => {
        setSelectedAddons((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const paymentMethods = [
        {
            name: 'VNPay QR',
            note: isVi
                ? 'Quét mã bằng app ngân hàng, xác nhận tức thì'
                : 'Scan with your banking app, confirmed instantly',
            badge: isVi ? 'Phổ biến' : 'Popular',
        },
        {
            name: 'MoMo',
            note: isVi
                ? 'Ví MoMo, hoàn tiền vào ví nếu huỷ đúng hạn'
                : 'MoMo wallet, refunded on timely cancellation',
            badge: '',
        },
        {
            name: 'Thẻ quốc tế',
            note: isVi
                ? 'Visa · Mastercard · JCB, thanh toán 3D Secure'
                : 'Visa · Mastercard · JCB with 3D Secure',
            badge: '',
        },
        {
            name: 'Chuyển khoản ngân hàng',
            note: isVi
                ? 'Chuyển cọc, gửi biên lai qua Zalo'
                : 'Transfer deposit and send receipt on Zalo',
            badge: isVi ? 'Không phí' : 'No fee',
        },
    ]

    const policies = [
        isVi
            ? 'Huỷ miễn phí trước 72 giờ so với ngày nhận phòng.'
            : 'Free cancellation up to 72 hours before check-in.',
        isVi
            ? 'Đổi lịch miễn phí nếu tàu cao tốc ngừng chạy do biển động.'
            : 'Free rescheduling if the speedboat is cancelled due to rough seas.',
        isVi
            ? 'Nhận phòng từ 14:00, trả phòng trước 12:00.'
            : 'Check in from 14:00, check out before 12:00.',
        isVi
            ? 'Vui lòng mang CCCD hoặc hộ chiếu để làm thủ tục lên tàu.'
            : 'Bring your ID or passport for ferry boarding.',
    ]

    const handleConfirmPayment = () => {
        if (!agreed) return
        setIsConfirmed(true)
    }

    return (
        <div
            style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--text)',
                background: 'var(--surface)',
                overflowX: 'hidden',
                minHeight: '100vh',
            }}
        >
            <Header data={data} locale={locale} />

            {/* Hero Section */}
            <section
                style={{
                    background: 'var(--brand)',
                    padding: 'calc(var(--space-20) + var(--space-12)) var(--space-6) var(--space-10)',
                }}
            >
                <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            fontSize: 'var(--text-xs)',
                            color: 'rgba(255,255,255,0.72)',
                            marginBottom: 'var(--space-4)',
                        }}
                    >
                        <a
                            href={themeRoot(SLUG)}
                            style={{ color: 'rgba(255,255,255,0.72)', textDecoration: 'none' }}
                        >
                            {t.home}
                        </a>
                        <span>/</span>
                        <a
                            href={themePath(SLUG, 'rooms')}
                            style={{ color: 'rgba(255,255,255,0.72)', textDecoration: 'none' }}
                        >
                            {t.roomsPage}
                        </a>
                        <span>/</span>
                        <span style={{ color: 'var(--surface)' }}>{t.checkoutPageTitle}</span>
                    </div>

                    <h1
                        style={{
                            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                            lineHeight: 1.15,
                            fontWeight: 800,
                            color: 'var(--surface)',
                            margin: '0 0 var(--space-6)',
                            letterSpacing: '-0.03em',
                        }}
                    >
                        {t.checkoutPageTitle}
                    </h1>

                    {/* Steps Pills */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                        {[
                            { idx: 0, label: t.stepGuest },
                            { idx: 1, label: t.stepPay },
                            { idx: 2, label: t.stepDone },
                        ].map((s) => {
                            const active = step === s.idx
                            return (
                                <button
                                    key={s.idx}
                                    type="button"
                                    onClick={() => setStep(s.idx as any)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-2)',
                                        padding: 'var(--space-3) var(--space-5)',
                                        borderRadius: 'var(--radius-pill)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 800,
                                        background: active ? 'var(--accent)' : 'var(--overlay-soft)',
                                        color: active ? 'var(--text)' : 'rgba(255,255,255,0.84)',
                                        transition: 'all 200ms ease',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: 22,
                                            height: 22,
                                            borderRadius: 'var(--radius-pill)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 'var(--text-xs)',
                                            fontWeight: 800,
                                            background: active ? 'var(--brand)' : 'var(--overlay-soft)',
                                            color: 'var(--surface)',
                                        }}
                                    >
                                        {s.idx + 1}
                                    </span>
                                    <span>{s.label}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Content & Sidebar Grid */}
            <section
                style={{
                    background: 'var(--surface)',
                    padding: 'var(--space-10) var(--space-6) var(--space-20)',
                    flex: 1,
                }}
            >
                <div
                    style={{
                        maxWidth: 'var(--container)',
                        margin: '0 auto',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
                        gap: 'var(--space-8)',
                        alignItems: 'start',
                    }}
                >
                    {/* Form Step Container */}
                    <div>
                        {isConfirmed ? (
                            <div
                                style={{
                                    borderRadius: 30,
                                    background: 'var(--surface-tint)',
                                    padding: 'var(--space-8) var(--space-8)',
                                    border: '2px solid var(--brand)',
                                    textAlign: 'center',
                                }}
                            >
                                <div
                                    style={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: 'var(--radius-pill)',
                                        background: 'var(--brand)',
                                        color: 'var(--surface)',
                                        fontSize: 32,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 16px',
                                    }}
                                >
                                    ✓
                                </div>
                                <h2
                                    style={{
                                        fontSize: 'var(--text-2xl)',
                                        fontWeight: 800,
                                        color: 'var(--brand)',
                                        margin: '0 0 var(--space-2)',
                                    }}
                                >
                                    {t.successTitle}
                                </h2>
                                <p
                                    style={{
                                        fontSize: 'var(--text-base)',
                                        color: 'var(--text-muted)',
                                        marginBottom: 'var(--space-6)',
                                        lineHeight: 1.6,
                                    }}
                                >
                                    {t.successSub}
                                </p>
                                <div
                                    style={{
                                        padding: 'var(--space-4)',
                                        borderRadius: 'var(--radius-lg)',
                                        background: 'var(--surface)',
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 700,
                                        color: 'var(--brand)',
                                        marginBottom: 'var(--space-6)',
                                    }}
                                >
                                    Mã đơn: <strong style={{ color: 'var(--brand-dark)' }}>NDH-{Math.floor(100000 + Math.random() * 900000)}</strong>
                                </div>
                                <a
                                    href={themeRoot(SLUG)}
                                    style={{
                                        display: 'inline-block',
                                        padding: '12px 28px',
                                        borderRadius: 'var(--radius-pill)',
                                        background: 'var(--brand)',
                                        color: 'var(--surface)',
                                        fontWeight: 800,
                                        textDecoration: 'none',
                                    }}
                                >
                                    {t.home}
                                </a>
                            </div>
                        ) : (
                            <>
                                {/* Step 0: Guest Info */}
                                {step === 0 && (
                                    <div
                                        style={{
                                            borderRadius: 30,
                                            background: 'var(--surface-tint)',
                                            padding: 'var(--space-8) var(--space-8)',
                                        }}
                                    >
                                        <h2
                                            style={{
                                                fontSize: 'var(--text-2xl)',
                                                fontWeight: 800,
                                                color: 'var(--brand)',
                                                margin: '0 0 var(--space-2)',
                                                letterSpacing: '-0.02em',
                                            }}
                                        >
                                            {t.step1Title}
                                        </h2>
                                        <p
                                            style={{
                                                fontSize: 'var(--text-sm)',
                                                color: 'var(--text-muted)',
                                                margin: '0 0 var(--space-6)',
                                            }}
                                        >
                                            {t.step1Sub}
                                        </p>

                                        <div
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                                gap: 'var(--space-4)',
                                            }}
                                        >
                                            <div style={{ display: 'grid', gap: 6 }}>
                                                <label htmlFor="h2co-name" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--brand)' }}>
                                                    {t.fName} *
                                                </label>
                                                <input
                                                    id="h2co-name"
                                                    type="text"
                                                    placeholder={t.phName}
                                                    value={guestName}
                                                    onChange={(e) => setGuestName(e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px 14px',
                                                        border: 'none',
                                                        borderRadius: 'var(--radius)',
                                                        fontSize: 'var(--text-sm)',
                                                        background: 'var(--surface)',
                                                        outline: 'none',
                                                    }}
                                                />
                                            </div>

                                            <div style={{ display: 'grid', gap: 6 }}>
                                                <label htmlFor="h2co-phone" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--brand)' }}>
                                                    {t.fPhone} *
                                                </label>
                                                <input
                                                    id="h2co-phone"
                                                    type="tel"
                                                    placeholder="09xx xxx xxx"
                                                    value={guestPhone}
                                                    onChange={(e) => setGuestPhone(e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px 14px',
                                                        border: 'none',
                                                        borderRadius: 'var(--radius)',
                                                        fontSize: 'var(--text-sm)',
                                                        background: 'var(--surface)',
                                                        outline: 'none',
                                                    }}
                                                />
                                            </div>

                                            <div style={{ display: 'grid', gap: 6 }}>
                                                <label htmlFor="h2co-email" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--brand)' }}>
                                                    {t.fEmail}
                                                </label>
                                                <input
                                                    id="h2co-email"
                                                    type="email"
                                                    placeholder="email@example.com"
                                                    value={guestEmail}
                                                    onChange={(e) => setGuestEmail(e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px 14px',
                                                        border: 'none',
                                                        borderRadius: 'var(--radius)',
                                                        fontSize: 'var(--text-sm)',
                                                        background: 'var(--surface)',
                                                        outline: 'none',
                                                    }}
                                                />
                                            </div>

                                            <div style={{ display: 'grid', gap: 6 }}>
                                                <label htmlFor="h2co-id" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--brand)' }}>
                                                    {t.fId}
                                                </label>
                                                <input
                                                    id="h2co-id"
                                                    type="text"
                                                    placeholder={t.phId}
                                                    value={guestId}
                                                    onChange={(e) => setGuestId(e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px 14px',
                                                        border: 'none',
                                                        borderRadius: 'var(--radius)',
                                                        fontSize: 'var(--text-sm)',
                                                        background: 'var(--surface)',
                                                        outline: 'none',
                                                    }}
                                                />
                                            </div>

                                            <div style={{ display: 'grid', gap: 6 }}>
                                                <label htmlFor="h2co-in" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--brand)' }}>
                                                    {t.checkIn}
                                                </label>
                                                <input
                                                    id="h2co-in"
                                                    type="date"
                                                    value={checkIn}
                                                    onChange={(e) => setCheckIn(e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px 14px',
                                                        border: 'none',
                                                        borderRadius: 'var(--radius)',
                                                        fontSize: 'var(--text-sm)',
                                                        background: 'var(--surface)',
                                                        outline: 'none',
                                                    }}
                                                />
                                            </div>

                                            <div style={{ display: 'grid', gap: 6 }}>
                                                <label htmlFor="h2co-out" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--brand)' }}>
                                                    {t.checkOut}
                                                </label>
                                                <input
                                                    id="h2co-out"
                                                    type="date"
                                                    value={checkOut}
                                                    onChange={(e) => setCheckOut(e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px 14px',
                                                        border: 'none',
                                                        borderRadius: 'var(--radius)',
                                                        fontSize: 'var(--text-sm)',
                                                        background: 'var(--surface)',
                                                        outline: 'none',
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gap: 6, marginTop: 'var(--space-4)' }}>
                                            <label htmlFor="h2co-note" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--brand)' }}>
                                                {t.fNote}
                                            </label>
                                            <textarea
                                                id="h2co-note"
                                                rows={3}
                                                placeholder={t.phNote}
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 14px',
                                                    border: 'none',
                                                    borderRadius: 'var(--radius)',
                                                    fontSize: 'var(--text-sm)',
                                                    background: 'var(--surface)',
                                                    outline: 'none',
                                                    resize: 'vertical',
                                                }}
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            style={{
                                                marginTop: 'var(--space-6)',
                                                padding: '14px 34px',
                                                borderRadius: 'var(--radius-pill)',
                                                border: 'none',
                                                background: 'var(--accent)',
                                                color: 'var(--text)',
                                                fontSize: 'var(--text-sm)',
                                                fontWeight: 800,
                                                cursor: 'pointer',
                                                transition: 'all 200ms ease',
                                            }}
                                        >
                                            {t.nextPay} →
                                        </button>
                                    </div>
                                )}

                                {/* Step 1: Payment Method */}
                                {step === 1 && (
                                    <div
                                        style={{
                                            borderRadius: 30,
                                            background: 'var(--surface-tint)',
                                            padding: 'var(--space-8) var(--space-8)',
                                        }}
                                    >
                                        <h2
                                            style={{
                                                fontSize: 'var(--text-2xl)',
                                                fontWeight: 800,
                                                color: 'var(--brand)',
                                                margin: '0 0 var(--space-2)',
                                            }}
                                        >
                                            {t.step2Title}
                                        </h2>
                                        <p
                                            style={{
                                                fontSize: 'var(--text-sm)',
                                                color: 'var(--text-muted)',
                                                margin: '0 0 var(--space-6)',
                                            }}
                                        >
                                            {t.step2Sub}
                                        </p>

                                        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                                            {paymentMethods.map((pm, idx) => {
                                                const active = selectedPayment === idx
                                                return (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        onClick={() => setSelectedPayment(idx)}
                                                        style={{
                                                            width: '100%',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 'var(--space-4)',
                                                            padding: 'var(--space-4) var(--space-5)',
                                                            borderRadius: 'var(--radius-lg)',
                                                            cursor: 'pointer',
                                                            textAlign: 'left',
                                                            background: 'var(--surface)',
                                                            border: active
                                                                ? '2px solid var(--brand)'
                                                                : '1px solid var(--border)',
                                                            boxShadow: active ? 'var(--shadow-sm)' : 'none',
                                                            transition: 'all 200ms ease',
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                width: 18,
                                                                height: 18,
                                                                borderRadius: 'var(--radius-pill)',
                                                                flexShrink: 0,
                                                                border: active
                                                                    ? '5px solid var(--brand)'
                                                                    : '2px solid var(--border-strong)',
                                                                background: 'var(--surface)',
                                                            }}
                                                        />
                                                        <span style={{ display: 'grid', gap: 2, flex: 1 }}>
                                                            <span style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--brand)' }}>
                                                                {pm.name}
                                                            </span>
                                                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                                                                {pm.note}
                                                            </span>
                                                        </span>
                                                        {pm.badge && (
                                                            <span
                                                                style={{
                                                                    fontSize: 'var(--text-xs)',
                                                                    fontWeight: 800,
                                                                    color: 'var(--brand-dark)',
                                                                    background: 'var(--surface-tint)',
                                                                    padding: '2px 8px',
                                                                    borderRadius: 'var(--radius-pill)',
                                                                }}
                                                            >
                                                                {pm.badge}
                                                            </span>
                                                        )}
                                                    </button>
                                                )
                                            })}
                                        </div>

                                        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
                                            <button
                                                type="button"
                                                onClick={() => setStep(0)}
                                                style={{
                                                    padding: '14px 28px',
                                                    borderRadius: 'var(--radius-pill)',
                                                    border: '1px solid var(--brand)',
                                                    background: 'transparent',
                                                    color: 'var(--brand)',
                                                    fontSize: 'var(--text-sm)',
                                                    fontWeight: 800,
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                ← {t.back}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setStep(2)}
                                                style={{
                                                    padding: '14px 34px',
                                                    borderRadius: 'var(--radius-pill)',
                                                    border: 'none',
                                                    background: 'var(--accent)',
                                                    color: 'var(--text)',
                                                    fontSize: 'var(--text-sm)',
                                                    fontWeight: 800,
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                {t.nextConfirm} →
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Policies & Confirmation */}
                                {step === 2 && (
                                    <div
                                        style={{
                                            borderRadius: 30,
                                            background: 'var(--surface-tint)',
                                            padding: 'var(--space-8) var(--space-8)',
                                        }}
                                    >
                                        <h2
                                            style={{
                                                fontSize: 'var(--text-2xl)',
                                                fontWeight: 800,
                                                color: 'var(--brand)',
                                                margin: '0 0 var(--space-2)',
                                            }}
                                        >
                                            {t.step3Title}
                                        </h2>
                                        <p
                                            style={{
                                                fontSize: 'var(--text-sm)',
                                                color: 'var(--text-muted)',
                                                margin: '0 0 var(--space-5)',
                                            }}
                                        >
                                            {t.step3Sub}
                                        </p>

                                        <div style={{ display: 'grid', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                                            {policies.map((p, idx) => (
                                                <div
                                                    key={idx}
                                                    style={{
                                                        display: 'flex',
                                                        gap: 'var(--space-3)',
                                                        alignItems: 'flex-start',
                                                        background: 'var(--surface)',
                                                        borderRadius: 'var(--radius-lg)',
                                                        padding: 'var(--space-4) var(--space-4)',
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            width: 20,
                                                            height: 20,
                                                            borderRadius: 'var(--radius-pill)',
                                                            background: 'var(--accent)',
                                                            color: 'var(--text)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: 'var(--text-xs)',
                                                            fontWeight: 800,
                                                            flexShrink: 0,
                                                            marginTop: 2,
                                                        }}
                                                    >
                                                        ✓
                                                    </span>
                                                    <span style={{ fontSize: 'var(--text-sm)', lineHeight: 1.6, color: 'var(--text)' }}>
                                                        {p}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <label
                                            htmlFor="h2co-agree"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: 'var(--space-3)',
                                                cursor: 'pointer',
                                                background: 'var(--surface)',
                                                borderRadius: 'var(--radius-lg)',
                                                padding: 'var(--space-4) var(--space-4)',
                                                border: agreed ? '2px solid var(--brand)' : '1px solid var(--border)',
                                            }}
                                        >
                                            <input
                                                id="h2co-agree"
                                                type="checkbox"
                                                checked={agreed}
                                                onChange={(e) => setAgreed(e.target.checked)}
                                                style={{ marginTop: 2, width: 18, height: 18, accentColor: 'var(--brand)' }}
                                            />
                                            <span style={{ fontSize: 'var(--text-sm)', lineHeight: 1.6, color: 'var(--text)' }}>
                                                {t.agree}
                                            </span>
                                        </label>

                                        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                style={{
                                                    padding: '14px 28px',
                                                    borderRadius: 'var(--radius-pill)',
                                                    border: '1px solid var(--brand)',
                                                    background: 'transparent',
                                                    color: 'var(--brand)',
                                                    fontSize: 'var(--text-sm)',
                                                    fontWeight: 800,
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                ← {t.back}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleConfirmPayment}
                                                disabled={!agreed}
                                                style={{
                                                    padding: '14px 34px',
                                                    borderRadius: 'var(--radius-pill)',
                                                    border: 'none',
                                                    background: agreed ? 'var(--brand)' : 'var(--border)',
                                                    color: agreed ? 'var(--surface)' : 'var(--text-muted)',
                                                    fontSize: 'var(--text-sm)',
                                                    fontWeight: 800,
                                                    cursor: agreed ? 'pointer' : 'not-allowed',
                                                    transition: 'all 200ms ease',
                                                }}
                                            >
                                                {agreed ? `${t.payNow} · ${formatPrice(depositAmount, locale)}` : t.payDisabled}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Right Sticky Sidebar Order Summary */}
                    <aside style={{ position: 'sticky', top: 100 }}>
                        <div style={{ borderRadius: 30, overflow: 'hidden', background: 'var(--brand)', boxShadow: 'var(--shadow)' }}>
                            <div style={{ padding: 'var(--space-6) var(--space-6) var(--space-4)' }}>
                                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 4 }}>
                                    {t.orderTitle}
                                </div>
                                <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.72)' }}>
                                    {t.orderSub}
                                </div>
                            </div>

                            <div style={{ background: 'var(--surface)', margin: '0 10px 10px', borderRadius: 22, padding: 'var(--space-5) var(--space-5)' }}>
                                <div style={{ display: 'flex', gap: 'var(--space-3)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border)', marginBottom: 'var(--space-4)' }}>
                                    <div style={{ width: 84, height: 64, borderRadius: 'var(--radius)', overflow: 'hidden', background: 'var(--surface-tint)', flexShrink: 0 }}>
                                        <ImageSlot
                                            placeholder={pick(selectedRoom.name, locale)}
                                            src={selectedRoom.images?.[0]}
                                            height={64}
                                        />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--brand)', lineHeight: 1.4, marginBottom: 2 }}>
                                            {pick(selectedRoom.name, locale)}
                                        </div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                                            {selectedRoom.area} · {selectedRoom.guests} {t.guestsWord}
                                        </div>
                                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--brand-dark)', marginTop: 4 }}>
                                            {formatPrice(selectedRoom.price, locale)} / {t.nightsWord}
                                        </div>
                                    </div>
                                </div>

                                {/* Nights Selector */}
                                <div style={{ marginBottom: 'var(--space-4)' }}>
                                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--brand)', display: 'block', marginBottom: 4 }}>
                                        {t.nights}
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderRadius: 'var(--radius)', background: 'var(--surface-tint)' }}>
                                        <button
                                            type="button"
                                            onClick={() => setNights(Math.max(1, nights - 1))}
                                            style={{ width: 28, height: 28, borderRadius: 'var(--radius-pill)', border: 'none', background: 'var(--surface)', cursor: 'pointer', fontWeight: 800 }}
                                        >
                                            −
                                        </button>
                                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--brand)' }}>
                                            {nights} {t.nightsWord}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setNights(nights + 1)}
                                            style={{ width: 28, height: 28, borderRadius: 'var(--radius-pill)', border: 'none', background: 'var(--accent)', cursor: 'pointer', fontWeight: 800 }}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Addons Selector */}
                                <div style={{ display: 'grid', gap: 8, marginBottom: 'var(--space-4)' }}>
                                    {data.addons.map((a) => {
                                        const active = !!selectedAddons[a.id]
                                        return (
                                            <label
                                                key={a.id}
                                                htmlFor={`co-addon-${a.id}`}
                                                style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer', fontSize: 'var(--text-xs)' }}
                                            >
                                                <input
                                                    id={`co-addon-${a.id}`}
                                                    type="checkbox"
                                                    checked={active}
                                                    onChange={() => toggleAddon(a.id)}
                                                    style={{ margin: '2px 0 0', accentColor: 'var(--brand)' }}
                                                />
                                                <span style={{ flex: 1, color: 'var(--text)' }}>{pick(a.name, locale)}</span>
                                                <span style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                                    {a.price ? formatPrice(a.price, locale) : pick(a.unit, locale)}
                                                </span>
                                            </label>
                                        )
                                    })}
                                </div>

                                {/* Totals Breakdown */}
                                <div style={{ paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border)', display: 'grid', gap: 6 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                                        <span>{t.roomsTotal}</span>
                                        <span style={{ fontWeight: 800, color: 'var(--text)' }}>{formatPrice(roomsSubtotal, locale)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                                        <span>{t.addonsTotal}</span>
                                        <span style={{ fontWeight: 800, color: 'var(--text)' }}>{formatPrice(addonsSubtotal, locale)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                                        <span>{t.vat}</span>
                                        <span style={{ fontWeight: 800, color: 'var(--text)' }}>{formatPrice(vat, locale)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--brand)' }}>{t.total}</span>
                                        <span style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--brand)', letterSpacing: '-0.025em' }}>
                                            {formatPrice(grandTotal, locale)}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', paddingTop: 2 }}>
                                        <span>{t.deposit}</span>
                                        <span style={{ fontWeight: 800, color: 'var(--brand-dark)' }}>{formatPrice(depositAmount, locale)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            <Contact data={data} locale={locale} />
        </div>
    )
}
