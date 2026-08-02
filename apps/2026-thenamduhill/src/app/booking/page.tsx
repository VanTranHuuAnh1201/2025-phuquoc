'use client'

/**
 * Luồng đặt phòng 4 bước.
 *
 * Bước 1–2 tự do; bấm "Đặt phòng" ở cuối bước 2 mới bị chặn đăng nhập. Chi tiết
 * và lý do: `.claude/rules/app-flows.md` §F1–F2.
 */

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    addDays,
    formatPrice,
    getPropertySync,
    pick,
    ratePlans,
    validateGuestInfo,
} from '@repo/core'
import type { PaymentMethod } from '@repo/core'
import { Badge, Button, CheckField, Field, TextAreaField } from '@repo/ui'
import { LocaleProvider, useLocale } from '@/components/LocaleProvider'
import { AccountBar } from '@/components/AccountBar'
import { PriceBreakdown } from '@/components/PriceBreakdown'
import { useAuthStore } from '@/stores/auth.store'
import { useBookingStore } from '@/stores/booking.store'
import { useCartStore } from '@/stores/cart.store'
import { useNotifyStore } from '@/stores/notify.store'
import { useAvailability, useCurrentQuote } from '@/stores/useQuote'
import { todayKey } from '@/stores/demo-data'
import { BLOCK_REASON_LABEL, S, tr } from '@/strings'

type Step = 1 | 2 | 3 | 4

export default function BookingPage() {
    return (
        <LocaleProvider>
            <BookingFlow />
        </LocaleProvider>
    )
}

function BookingFlow() {
    const { locale } = useLocale()
    const router = useRouter()
    const cart = useCartStore()
    const user = useAuthStore((s) => s.user)
    const quote = useCurrentQuote()

    const [step, setStep] = useState<Step>(1)
    const [showErrors, setShowErrors] = useState(false)

    const availability = useAvailability(cart.checkIn, cart.checkOut, cart.guests)

    // Khách đăng nhập xong quay lại: nhảy thẳng tới bước thông tin, không bắt
    // chọn lại từ đầu. Đây chính là "fallback về màn thanh toán" trong yêu cầu.
    useEffect(() => {
        if (user && step === 2 && cart.isSelectionComplete()) setStep(3)
        // Chỉ chạy khi trạng thái đăng nhập đổi.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    // Điền sẵn thông tin từ tài khoản.
    useEffect(() => {
        if (!user) return
        cart.updateGuest({
            fullName: cart.guest.fullName || user.fullName,
            phone: cart.guest.phone || user.phone,
            email: cart.guest.email || user.email,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    const guestErrors = useMemo(() => validateGuestInfo(cart.guest), [cart.guest])

    const goToGuestStep = () => {
        if (!cart.isSelectionComplete()) return
        if (!user) {
            router.push(`/login?next=${encodeURIComponent('/booking')}`)
            return
        }
        setStep(3)
    }

    return (
        <div
            data-theme="h1"
            style={{
                minHeight: '100vh',
                background: 'var(--surface-alt)',
                fontFamily: 'var(--font-body)',
                color: 'var(--text)',
            }}
        >
            <TopBar />

            <main
                style={{
                    maxWidth: 1100,
                    margin: '0 auto',
                    padding: 'var(--space-8) var(--space-5) var(--space-20)',
                }}
            >
                <Stepper current={step} />

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 1fr)',
                        gap: 'var(--space-8)',
                        marginTop: 'var(--space-8)',
                    }}
                    className="booking-grid"
                >
                    <div style={{ display: 'grid', gap: 'var(--space-6)', alignContent: 'start' }}>
                        {step === 1 && (
                            <SearchStep
                                onNext={() => setStep(2)}
                                availableCount={availability.filter((a) => a.result.available).length}
                            />
                        )}

                        {step === 2 && (
                            <SelectStep
                                availability={availability}
                                onBack={() => setStep(1)}
                                onNext={goToGuestStep}
                            />
                        )}

                        {step === 3 && (
                            <GuestStep
                                errors={showErrors ? guestErrors : []}
                                onBack={() => setStep(2)}
                                onNext={() => {
                                    setShowErrors(true)
                                    if (guestErrors.length === 0) {
                                        setShowErrors(false)
                                        setStep(4)
                                    }
                                }}
                            />
                        )}

                        {step === 4 && <PaymentStep onBack={() => setStep(3)} />}
                    </div>

                    {/* Thanh tóm tắt: dính khi cuộn, để giá luôn trong tầm mắt */}
                    {quote && cart.roomTypeId && step >= 2 && (
                        <aside
                            style={{
                                position: 'sticky',
                                top: 'var(--space-5)',
                                alignSelf: 'start',
                                background: 'var(--surface)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-lg)',
                                padding: 'var(--space-6)',
                            }}
                        >
                            <h2
                                style={{
                                    margin: '0 0 var(--space-5)',
                                    fontSize: 'var(--text-lg)',
                                    fontFamily: 'var(--font-display)',
                                }}
                            >
                                {tr(S.priceSummary, locale)}
                            </h2>

                            <div
                                style={{
                                    marginBottom: 'var(--space-5)',
                                    paddingBottom: 'var(--space-5)',
                                    borderBottom: '1px solid var(--border)',
                                    fontSize: 'var(--text-sm)',
                                    color: 'var(--text-muted)',
                                    display: 'grid',
                                    gap: 4,
                                }}
                            >
                                <div>
                                    {cart.checkIn} → {cart.checkOut}
                                </div>
                                <div>
                                    {quote.nights} {tr(S.nights, locale)} ·{' '}
                                    {cart.guests.adults} {tr(S.adults, locale).toLowerCase()}
                                    {cart.guests.children.length > 0 &&
                                        ` · ${cart.guests.children.length} ${tr(S.children, locale).toLowerCase()}`}
                                </div>
                            </div>

                            <PriceBreakdown quote={quote} locale={locale} />
                        </aside>
                    )}
                </div>
            </main>

            <style>{`
                @media (min-width: 900px) {
                    .booking-grid {
                        grid-template-columns: minmax(0, 1fr) 340px;
                    }
                }
            `}</style>
        </div>
    )
}

// ================================================================== khung

function TopBar() {
    const { locale } = useLocale()
    return (
        <header
            style={{
                background: 'var(--surface)',
                borderBottom: '1px solid var(--border)',
                padding: 'var(--space-4) var(--space-5)',
            }}
        >
            <div
                style={{
                    maxWidth: 1100,
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--space-4)',
                }}
            >
                <Link
                    href="/h1"
                    style={{
                        fontSize: 'var(--text-base)',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        color: 'var(--brand)',
                        textDecoration: 'none',
                        letterSpacing: '0.02em',
                    }}
                >
                    THE NAM DU HILL
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                        {tr(S.bookNow, locale)}
                    </span>
                    <AccountBar />
                </div>
            </div>
        </header>
    )
}

function Stepper({ current }: { current: Step }) {
    const { locale } = useLocale()
    const steps = [
        { n: 1, label: tr(S.stepSearch, locale) },
        { n: 2, label: tr(S.stepSelect, locale) },
        { n: 3, label: tr(S.stepGuest, locale) },
        { n: 4, label: tr(S.stepPayment, locale) },
    ]

    return (
        <ol
            style={{
                display: 'flex',
                gap: 'var(--space-2)',
                listStyle: 'none',
                margin: 0,
                padding: 0,
                flexWrap: 'wrap',
            }}
        >
            {steps.map((step) => {
                const state = step.n < current ? 'done' : step.n === current ? 'current' : 'todo'
                return (
                    <li
                        key={step.n}
                        aria-current={state === 'current' ? 'step' : undefined}
                        style={{
                            flex: '1 1 120px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            padding: 'var(--space-3) var(--space-4)',
                            background: state === 'current' ? 'var(--surface)' : 'transparent',
                            border: `1px solid ${state === 'current' ? 'var(--brand)' : 'var(--border)'}`,
                            borderRadius: 'var(--radius)',
                            fontSize: 'var(--text-sm)',
                            color: state === 'todo' ? 'var(--text-muted)' : 'var(--text)',
                            fontWeight: state === 'current' ? 600 : 400,
                        }}
                    >
                        <span
                            style={{
                                width: 22,
                                height: 22,
                                display: 'grid',
                                placeItems: 'center',
                                borderRadius: '50%',
                                fontSize: 'var(--text-xs)',
                                fontWeight: 700,
                                flexShrink: 0,
                                background:
                                    state === 'done'
                                        ? 'var(--success)'
                                        : state === 'current'
                                          ? 'var(--brand)'
                                          : 'var(--border)',
                                color:
                                    state === 'todo' ? 'var(--text-muted)' : 'var(--text-inverse)',
                            }}
                        >
                            {state === 'done' ? '✓' : step.n}
                        </span>
                        {step.label}
                    </li>
                )
            })}
        </ol>
    )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section
            style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-6)',
            }}
        >
            <h2
                style={{
                    margin: '0 0 var(--space-5)',
                    fontSize: 'var(--text-lg)',
                    fontFamily: 'var(--font-display)',
                }}
            >
                {title}
            </h2>
            {children}
        </section>
    )
}

// ============================================================ bước 1: tìm

function SearchStep({
    onNext,
    availableCount,
}: {
    onNext: () => void
    availableCount: number
}) {
    const { locale } = useLocale()
    const cart = useCartStore()
    const today = todayKey()

    return (
        <Panel title={tr(S.stepSearch, locale)}>
            <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
                <div
                    style={{
                        display: 'grid',
                        gap: 'var(--space-4)',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    }}
                >
                    <Field
                        label={tr(S.checkIn, locale)}
                        type="date"
                        value={cart.checkIn}
                        min={today}
                        onChange={(e) => {
                            const checkIn = e.target.value
                            // Trả phòng phải luôn sau nhận phòng — đẩy theo thay vì
                            // để người dùng tự phát hiện lỗi ở bước sau.
                            const checkOut =
                                cart.checkOut <= checkIn ? addDays(checkIn, 1) : cart.checkOut
                            cart.setDates(checkIn, checkOut)
                        }}
                    />
                    <Field
                        label={tr(S.checkOut, locale)}
                        type="date"
                        value={cart.checkOut}
                        min={addDays(cart.checkIn, 1)}
                        onChange={(e) => cart.setDates(cart.checkIn, e.target.value)}
                    />
                    <Field
                        label={tr(S.adults, locale)}
                        type="number"
                        min={1}
                        max={10}
                        value={cart.guests.adults}
                        onChange={(e) =>
                            cart.setGuests({
                                ...cart.guests,
                                adults: Math.max(1, Number(e.target.value) || 1),
                            })
                        }
                    />
                    <Field
                        label={tr(S.children, locale)}
                        type="number"
                        min={0}
                        max={6}
                        value={cart.guests.children.length}
                        hint={locale === 'vi' ? 'Mặc định 8 tuổi' : 'Defaults to age 8'}
                        onChange={(e) => {
                            const count = Math.max(0, Number(e.target.value) || 0)
                            cart.setGuests({
                                ...cart.guests,
                                // Giữ tuổi đã nhập, chỉ thêm/bớt phần cuối.
                                children: Array.from(
                                    { length: count },
                                    (_, i) => cart.guests.children[i] ?? 8,
                                ),
                            })
                        }}
                    />
                </div>

                {cart.guests.children.length > 0 && (
                    <div
                        style={{
                            display: 'grid',
                            gap: 'var(--space-3)',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                        }}
                    >
                        {cart.guests.children.map((age, index) => (
                            <Field
                                key={index}
                                label={`${tr(S.children, locale)} ${index + 1}`}
                                type="number"
                                min={0}
                                max={17}
                                value={age}
                                onChange={(e) => {
                                    const next = [...cart.guests.children]
                                    next[index] = Math.max(0, Number(e.target.value) || 0)
                                    cart.setGuests({ ...cart.guests, children: next })
                                }}
                            />
                        ))}
                    </div>
                )}

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 'var(--space-4)',
                        flexWrap: 'wrap',
                    }}
                >
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                        {availableCount > 0
                            ? locale === 'vi'
                                ? `${availableCount} hạng phòng còn trống`
                                : `${availableCount} room types available`
                            : locale === 'vi'
                              ? 'Hết phòng cho ngày đã chọn. Thử ngày khác.'
                              : 'Sold out for these dates. Try other dates.'}
                    </span>
                    <Button onClick={onNext} disabled={availableCount === 0} size="lg">
                        {tr(S.searchRooms, locale)}
                    </Button>
                </div>
            </div>
        </Panel>
    )
}

// ========================================================== bước 2: chọn

function SelectStep({
    availability,
    onBack,
    onNext,
}: {
    availability: ReturnType<typeof useAvailability>
    onBack: () => void
    onNext: () => void
}) {
    const { locale } = useLocale()
    const cart = useCartStore()
    const property = getPropertySync()
    const quote = useCurrentQuote()

    const [codeInput, setCodeInput] = useState(cart.promoCode)

    // Mã nhập vào có được nhận không — tra ngay trong kết quả báo giá.
    const codeAccepted =
        !cart.promoCode ||
        quote?.promotion.applied.some(
            (a) => a.code?.toUpperCase() === cart.promoCode.trim().toUpperCase(),
        )

    return (
        <>
            <Panel title={tr(S.stepSelect, locale)}>
                <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                    {availability.map(({ roomTypeId, result }) => {
                        const room = property.rooms.find((r) => r.id === roomTypeId)
                        if (!room) return null
                        const selected = cart.roomTypeId === roomTypeId

                        return (
                            <article
                                key={roomTypeId}
                                style={{
                                    padding: 'var(--space-5)',
                                    border: `1px solid ${selected ? 'var(--brand)' : 'var(--border)'}`,
                                    borderRadius: 'var(--radius)',
                                    background: selected ? 'var(--surface-tint)' : 'var(--surface)',
                                    opacity: result.available ? 1 : 0.6,
                                    display: 'grid',
                                    gap: 'var(--space-3)',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        gap: 'var(--space-4)',
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <div>
                                        <h3
                                            style={{
                                                margin: 0,
                                                fontSize: 'var(--text-base)',
                                                fontFamily: 'var(--font-display)',
                                            }}
                                        >
                                            {pick(room.name, locale)}
                                        </h3>
                                        <p
                                            style={{
                                                margin: '4px 0 0',
                                                fontSize: 'var(--text-sm)',
                                                color: 'var(--text-muted)',
                                            }}
                                        >
                                            {room.area} · {room.guests} {tr(S.guests, locale)}
                                        </p>
                                    </div>

                                    <div style={{ textAlign: 'right' }}>
                                        {result.roomTotal > 0 && (
                                            <div
                                                style={{
                                                    fontSize: 'var(--text-lg)',
                                                    fontWeight: 700,
                                                    fontVariantNumeric: 'tabular-nums',
                                                }}
                                            >
                                                {formatPrice(result.roomTotal, locale)}
                                            </div>
                                        )}
                                        {result.available ? (
                                            <Badge tone={result.availableUnits <= 2 ? 'warning' : 'success'}>
                                                {locale === 'vi'
                                                    ? `Còn ${result.availableUnits} phòng`
                                                    : `${result.availableUnits} left`}
                                            </Badge>
                                        ) : (
                                            <Badge tone="danger">
                                                {result.blockedReason
                                                    ? tr(BLOCK_REASON_LABEL[result.blockedReason], locale)
                                                    : tr(S.all, locale)}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {result.available && (
                                    <div>
                                        <Button
                                            variant={selected ? 'primary' : 'secondary'}
                                            size="sm"
                                            onClick={() => cart.selectRoom(roomTypeId)}
                                        >
                                            {selected ? tr(S.selected, locale) : tr(S.selectRoom, locale)}
                                        </Button>
                                    </div>
                                )}
                            </article>
                        )
                    })}
                </div>
            </Panel>

            {cart.roomTypeId && (
                <Panel title={tr(S.ratePlan, locale)}>
                    <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                        {ratePlans
                            .filter((plan) => plan.active)
                            .map((plan) => (
                                <label
                                    key={plan.id}
                                    style={{
                                        display: 'flex',
                                        gap: 'var(--space-3)',
                                        padding: 'var(--space-4)',
                                        border: `1px solid ${
                                            cart.ratePlanId === plan.id
                                                ? 'var(--brand)'
                                                : 'var(--border)'
                                        }`,
                                        borderRadius: 'var(--radius)',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="ratePlan"
                                        checked={cart.ratePlanId === plan.id}
                                        onChange={() => cart.selectRatePlan(plan.id)}
                                        style={{ marginTop: 4, accentColor: 'var(--brand)' }}
                                    />
                                    <div>
                                        <div
                                            style={{
                                                fontWeight: 600,
                                                fontSize: 'var(--text-sm)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--space-2)',
                                                flexWrap: 'wrap',
                                            }}
                                        >
                                            {pick(plan.name, locale)}
                                            {plan.adjustPercent !== 0 && (
                                                <Badge
                                                    tone={plan.adjustPercent < 0 ? 'success' : 'info'}
                                                    hideDot
                                                >
                                                    {plan.adjustPercent > 0 ? '+' : ''}
                                                    {plan.adjustPercent}%
                                                </Badge>
                                            )}
                                        </div>
                                        <p
                                            style={{
                                                margin: '4px 0 0',
                                                fontSize: 'var(--text-xs)',
                                                color: 'var(--text-muted)',
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            {pick(plan.description, locale)}
                                        </p>
                                    </div>
                                </label>
                            ))}
                    </div>
                </Panel>
            )}

            {cart.roomTypeId && property.addons.length > 0 && (
                <Panel title={tr(S.addons, locale)}>
                    <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                        {property.addons
                            .filter((addon) => addon.price > 0)
                            .map((addon) => (
                                <div
                                    key={addon.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: 'var(--space-4)',
                                        padding: 'var(--space-3) 0',
                                        borderBottom: '1px solid var(--border)',
                                    }}
                                >
                                    <div>
                                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                                            {pick(addon.name, locale)}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 'var(--text-xs)',
                                                color: 'var(--text-muted)',
                                            }}
                                        >
                                            {formatPrice(addon.price, locale)} /{' '}
                                            {pick(addon.unit, locale)}
                                        </div>
                                    </div>
                                    <input
                                        type="number"
                                        min={0}
                                        max={10}
                                        value={cart.addons[addon.id] ?? 0}
                                        onChange={(e) =>
                                            cart.setAddon(addon.id, Number(e.target.value) || 0)
                                        }
                                        aria-label={pick(addon.name, locale)}
                                        style={{
                                            width: 64,
                                            padding: 'var(--space-2)',
                                            textAlign: 'center',
                                            fontSize: 'var(--text-sm)',
                                            fontFamily: 'var(--font-body)',
                                            border: '1px solid var(--border-strong)',
                                            borderRadius: 'var(--radius)',
                                        }}
                                    />
                                </div>
                            ))}
                    </div>
                </Panel>
            )}

            {cart.roomTypeId && (
                <Panel title={tr(S.promoCode, locale)}>
                    <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1 }}>
                            <Field
                                label={tr(S.promoCode, locale)}
                                placeholder={tr(S.promoPlaceholder, locale)}
                                value={codeInput}
                                onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                                error={
                                    cart.promoCode && !codeAccepted
                                        ? tr(S.promoInvalid, locale)
                                        : undefined
                                }
                            />
                        </div>
                        <Button
                            variant="secondary"
                            onClick={() => cart.setPromoCode(codeInput)}
                            style={{ marginBottom: 2 }}
                        >
                            {tr(S.applyPromo, locale)}
                        </Button>
                    </div>
                    {cart.promoCode && codeAccepted && (
                        <p
                            style={{
                                margin: 'var(--space-3) 0 0',
                                fontSize: 'var(--text-sm)',
                                color: 'var(--success)',
                            }}
                        >
                            ✓ {tr(S.promoApplied, locale)}: {cart.promoCode}
                        </p>
                    )}
                </Panel>
            )}

            <StepNav
                onBack={onBack}
                onNext={onNext}
                nextLabel={tr(S.bookNow, locale)}
                nextDisabled={!cart.isSelectionComplete()}
            />
        </>
    )
}

// ==================================================== bước 3: thông tin khách

function GuestStep({
    errors,
    onBack,
    onNext,
}: {
    errors: string[]
    onBack: () => void
    onNext: () => void
}) {
    const { locale } = useLocale()
    const cart = useCartStore()
    const g = cart.guest

    const errorOf = (code: string) =>
        errors.includes(code)
            ? code === 'guest-name-required'
                ? tr(S.errNameRequired, locale)
                : code === 'guest-phone-required'
                  ? tr(S.errPhoneRequired, locale)
                  : tr(S.errEmailInvalid, locale)
            : undefined

    return (
        <>
            <Panel title={tr(S.guestInfo, locale)}>
                <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
                    <Field
                        label={tr(S.fullName, locale)}
                        value={g.fullName}
                        onChange={(e) => cart.updateGuest({ fullName: e.target.value })}
                        error={errorOf('guest-name-required')}
                        autoComplete="name"
                        required
                    />
                    <div
                        style={{
                            display: 'grid',
                            gap: 'var(--space-4)',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        }}
                    >
                        <Field
                            label={tr(S.phone, locale)}
                            value={g.phone}
                            onChange={(e) => cart.updateGuest({ phone: e.target.value })}
                            error={errorOf('guest-phone-required')}
                            autoComplete="tel"
                            inputMode="tel"
                            required
                        />
                        <Field
                            label={tr(S.email, locale)}
                            type="email"
                            value={g.email}
                            onChange={(e) => cart.updateGuest({ email: e.target.value })}
                            error={errorOf('guest-email-invalid')}
                            autoComplete="email"
                        />
                    </div>
                    <div
                        style={{
                            display: 'grid',
                            gap: 'var(--space-4)',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        }}
                    >
                        <Field
                            label={tr(S.idNumber, locale)}
                            value={g.idNumber}
                            onChange={(e) => cart.updateGuest({ idNumber: e.target.value })}
                            hint={tr(S.optional, locale)}
                        />
                        <Field
                            label={tr(S.arrivalTime, locale)}
                            type="time"
                            value={g.estimatedArrivalTime}
                            onChange={(e) =>
                                cart.updateGuest({ estimatedArrivalTime: e.target.value })
                            }
                            hint={tr(S.arrivalHint, locale)}
                        />
                    </div>
                    <TextAreaField
                        label={tr(S.specialRequests, locale)}
                        value={g.specialRequests}
                        onChange={(e) => cart.updateGuest({ specialRequests: e.target.value })}
                        hint={tr(S.specialRequestsHint, locale)}
                    />
                </div>
            </Panel>

            <Panel title={tr(S.needInvoice, locale)}>
                <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                    <CheckField
                        label={tr(S.needInvoice, locale)}
                        checked={g.needInvoice}
                        onChange={(e) => cart.updateGuest({ needInvoice: e.target.checked })}
                    />
                    {g.needInvoice && (
                        <div
                            style={{
                                display: 'grid',
                                gap: 'var(--space-4)',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            }}
                        >
                            <Field
                                label={tr(S.taxCode, locale)}
                                value={g.taxCode}
                                onChange={(e) => cart.updateGuest({ taxCode: e.target.value })}
                            />
                            <Field
                                label={tr(S.companyName, locale)}
                                value={g.companyName}
                                onChange={(e) => cart.updateGuest({ companyName: e.target.value })}
                            />
                        </div>
                    )}
                </div>
            </Panel>

            <StepNav onBack={onBack} onNext={onNext} nextLabel={tr(S.next, locale)} />
        </>
    )
}

// ======================================================= bước 4: thanh toán

const METHODS: { id: PaymentMethod; label: keyof typeof S }[] = [
    { id: 'bank-transfer', label: 'payBankTransfer' },
    { id: 'card', label: 'payCard' },
    { id: 'momo', label: 'payMomo' },
    { id: 'at-property', label: 'payAtProperty' },
]

function PaymentStep({ onBack }: { onBack: () => void }) {
    const { locale } = useLocale()
    const router = useRouter()
    const cart = useCartStore()
    const user = useAuthStore((s) => s.user)
    const quote = useCurrentQuote()
    const createBooking = useBookingStore((s) => s.createBooking)
    const pushNotification = useNotifyStore((s) => s.push)
    const property = getPropertySync()

    const [method, setMethod] = useState<PaymentMethod>('bank-transfer')
    const [submitting, setSubmitting] = useState(false)

    const submit = () => {
        if (!quote || !cart.roomTypeId || !user) return
        setSubmitting(true)

        const booking = createBooking({
            quote,
            roomTypeId: cart.roomTypeId,
            ratePlanId: cart.ratePlanId,
            checkIn: cart.checkIn,
            checkOut: cart.checkOut,
            guests: cart.guests,
            addons: cart.addons,
            guest: {
                fullName: cart.guest.fullName,
                phone: cart.guest.phone,
                email: cart.guest.email,
                idNumber: cart.guest.idNumber || undefined,
                estimatedArrivalTime: cart.guest.estimatedArrivalTime || undefined,
                specialRequests: cart.guest.specialRequests || undefined,
                taxCode: cart.guest.needInvoice ? cart.guest.taxCode : undefined,
                companyName: cart.guest.needInvoice ? cart.guest.companyName : undefined,
            },
            customerId: user.id,
            channel: 'web',
        })

        const room = property.rooms.find((r) => r.id === cart.roomTypeId)
        pushNotification({
            accountId: user.id,
            kind: 'payment-success',
            bookingId: booking.id,
            bookingCode: booking.code,
            payload: {
                roomTypeName: room?.name,
                nights: booking.nights,
                amount: booking.totalAmount,
            },
        })

        cart.reset()
        router.push(`/booking/success?id=${booking.id}`)
    }

    if (!quote) return null

    return (
        <>
            <Panel title={tr(S.paymentMethod, locale)}>
                <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                    {METHODS.map((item) => (
                        <label
                            key={item.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-3)',
                                padding: 'var(--space-4)',
                                border: `1px solid ${method === item.id ? 'var(--brand)' : 'var(--border)'}`,
                                borderRadius: 'var(--radius)',
                                cursor: 'pointer',
                                fontSize: 'var(--text-sm)',
                            }}
                        >
                            <input
                                type="radio"
                                name="method"
                                checked={method === item.id}
                                onChange={() => setMethod(item.id)}
                                style={{ accentColor: 'var(--brand)' }}
                            />
                            {tr(S[item.label], locale)}
                        </label>
                    ))}
                </div>

                <p
                    style={{
                        margin: 'var(--space-5) 0 0',
                        padding: 'var(--space-3) var(--space-4)',
                        background: 'var(--warning-bg)',
                        color: 'var(--warning)',
                        borderRadius: 'var(--radius)',
                        fontSize: 'var(--text-xs)',
                    }}
                >
                    {tr(S.paymentDemoNote, locale)}
                </p>
            </Panel>

            <Panel title={tr(S.priceSummary, locale)}>
                <PriceBreakdown quote={quote} locale={locale} explainPromotions />
            </Panel>

            <StepNav
                onBack={onBack}
                onNext={submit}
                nextLabel={tr(S.completeBooking, locale)}
                nextDisabled={submitting}
            />
        </>
    )
}

// ================================================================ điều hướng

function StepNav({
    onBack,
    onNext,
    nextLabel,
    nextDisabled,
}: {
    onBack: () => void
    onNext: () => void
    nextLabel: string
    nextDisabled?: boolean
}) {
    const { locale } = useLocale()
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 'var(--space-4)',
                flexWrap: 'wrap',
            }}
        >
            <Button variant="ghost" onClick={onBack}>
                ← {tr(S.back, locale)}
            </Button>
            <Button onClick={onNext} disabled={nextDisabled} size="lg">
                {nextLabel}
            </Button>
        </div>
    )
}
