'use client'

/**
 * Luồng đặt phòng — bước 1–4 (bước 5 ở `/booking/success`).
 *
 * Bước 1–2 tự do; bấm "Đặt phòng" ở cuối bước 2 mới bị chặn đăng nhập. Chi tiết
 * và lý do: `.claude/rules/app-flows.md` §F1–F2.
 *
 * MẶC `data-theme` CỦA MẪU H3 nhưng luồng VẪN Ở TẦNG APP: nó gọi store, điều
 * hướng và kiểm đăng nhập — ba thứ theme không được chứa (luật R4/R13/FE3).
 * Theme chỉ cấp `tokens.css`; đổi mẫu là đổi đúng một thuộc tính ở đây.
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
import { CheckIcon, Stepper } from './Stepper'

/** Bước 5 sống ở `/booking/success`, nên state ở đây chỉ tới 4. */
type Step = 1 | 2 | 3 | 4

export default function BookingPage() {
    return (
        <LocaleProvider>
            <BookingFlow />
        </LocaleProvider>
    )
}

function BookingFlow() {
    const router = useRouter()
    const cart = useCartStore()
    const user = useAuthStore((s) => s.user)
    const quote = useCurrentQuote()

    const [step, setStep] = useState<Step>(1)
    const [showErrors, setShowErrors] = useState(false)

    // `cart.store` persist đọc `localStorage`, thứ chỉ có SAU lần render đầu.
    // Không chờ mốc này thì effect khôi phục bước ở dưới chạy trên giỏ rỗng mặc
    // định, kết luận "chưa chọn gì" rồi không bao giờ chạy lại — khách vừa đăng
    // nhập xong bị ném về bước 1 dù giỏ còn nguyên trong localStorage.
    const [hydrated, setHydrated] = useState(false)
    useEffect(() => setHydrated(true), [])

    const availability = useAvailability(cart.checkIn, cart.checkOut, cart.guests)

    // Khách đăng nhập xong quay lại: nhảy thẳng tới bước thông tin, không bắt
    // chọn lại từ đầu. Đây chính là "fallback về màn thanh toán" trong yêu cầu.
    //
    // ĐIỀU KIỆN LÀ `step < 3`, KHÔNG PHẢI `step === 2`. Đi qua `/login` là rời
    // hẳn trang này, nên lúc quay lại component MOUNT MỚI và `step` khởi tạo
    // bằng 1 — không bao giờ bằng 2. Điều kiện cũ vì thế không bao giờ đúng ở
    // đúng cái trường hợp nó sinh ra để phục vụ, và khách phải chọn phòng lại
    // từ đầu dù giỏ còn nguyên.
    //
    // Chặn trên `< 3` để không kéo ngược khách đang ở bước 4 về bước 3.
    useEffect(() => {
        if (user && step < 3 && cart.isSelectionComplete()) setStep(3)
        // Chỉ chạy khi trạng thái đăng nhập đổi hoặc giỏ vừa hydrate xong.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, hydrated])

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

    // Thanh tóm tắt chỉ có nghĩa khi đã chọn phòng — trước đó chưa có gì để
    // cộng. Giữ nguyên điều kiện cũ, chỉ đặt tên để dùng lại ở hai chỗ render.
    const showSummary = Boolean(quote && cart.roomTypeId && step >= 2)

    return (
        <div
            data-theme="h3"
            style={{
                minHeight: '100vh',
                background: 'var(--surface-alt)',
                fontFamily: 'var(--font-body)',
                color: 'var(--text)',
            }}
        >
            <TopBar />

            <main
                className="booking-main"
                data-sheet={showSummary ? 'on' : 'off'}
                style={{ maxWidth: 1100, margin: '0 auto' }}
            >
                <Stepper current={step} />

                <div
                    style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)' }}
                    className="booking-grid"
                >
                    {/* `minWidth: 0` là bắt buộc: mặc định grid item lấy
                        `min-width:auto` nên nội dung rộng (thẻ phòng, ô nhập)
                        đẩy cột phình ra và tràn ngang ở 375px. */}
                    <div
                        className="booking-col"
                        style={{ display: 'grid', alignContent: 'start', minWidth: 0 }}
                    >
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

                    {/* Thanh tóm tắt: dính khi cuộn, để giá luôn trong tầm mắt.
                        Từ 900px trở lên là cột phải; dưới đó chuyển hẳn sang
                        bottom sheet ở cuối file — CÙNG MỘT nội dung, hai chỗ
                        đặt (luật FE5/P9: mobile là thiết kế riêng, không phải
                        cột bị đẩy xuống cuối trang). */}
                    {showSummary && quote && (
                        <aside className="booking-summary">
                            <SummaryCard quote={quote} />
                        </aside>
                    )}
                </div>
            </main>

            {/* Bottom sheet — chỉ tồn tại dưới 900px, xem ghi chú ở khối style */}
            {showSummary && quote && <SummarySheet quote={quote} />}

            <style>{`
                /* THANG KHOẢNG CÁCH CỦA h3 TO HƠN HẲN h1 Ở CÙNG TÊN BIẾN:
                   --space-6 là 64px (h1 cũng 64px) và --space-8 là 140px. Bê
                   nguyên "padding: var(--space-6)" xuống màn 375px thì riêng
                   đệm hai bên đã ăn 128px, thẻ phình tới 457px và TRÀN NGANG —
                   đúng thứ luật FE5 cấm. Build vẫn xanh, chỉ nhìn ở 375px mới
                   thấy.
                   Cách xử lý: bậc nhỏ ở màn hẹp, bậc lớn ở màn rộng. Vẫn lấy
                   từ thang token, không có số lẻ nào (luật FE2/P5). */
                .booking-main {
                    padding: var(--space-4) var(--space-3) var(--space-6);
                }

                .booking-panel {
                    padding: var(--space-3);
                    /* Không cho thẻ phình quá ô lưới chứa nó. */
                    min-width: 0;
                    max-width: 100%;
                }

                /* Khoảng cách giữa các thẻ: --space-6 (64px) quá thoáng ở màn
                   hẹp, đẩy nút "Tiếp tục" xuống rất sâu. */
                .booking-col {
                    gap: var(--space-3);
                }

                @media (min-width: 900px) {
                    .booking-col {
                        gap: var(--space-4);
                    }
                }

                /* Ô nhập trong lưới: mặc định min-width:auto của grid item lấy
                   theo bề rộng nội tại của input (với type="date" là khá lớn),
                   nên ô không co lại được và đẩy tràn ngang ở 375px. */
                .booking-panel input,
                .booking-panel select,
                .booking-panel textarea {
                    min-width: 0;
                    max-width: 100%;
                }

                /* --space-8 (140px) là bậc dành cho khoảng nghỉ GIỮA CÁC SECTION
                   của trang marketing, không phải cho form. Dùng nó ở đây thì
                   riêng khoảng trắng đã chiếm gần hai màn điện thoại. */
                .booking-grid {
                    gap: var(--space-4);
                    margin-top: var(--space-3);
                }

                .booking-summary {
                    display: none;
                }

                @media (min-width: 640px) {
                    .booking-main {
                        padding: var(--space-5) var(--space-4) var(--space-6);
                    }

                    .booking-panel {
                        padding: var(--space-4);
                    }
                }

                @media (min-width: 900px) {
                    .booking-main {
                        padding: var(--space-5) var(--space-5) var(--space-20);
                    }

                    .booking-panel {
                        padding: var(--space-5);
                    }
                }

                @media (min-width: 900px) {
                    .booking-grid {
                        grid-template-columns: minmax(0, 1fr) 340px;
                    }

                    .booking-summary {
                        display: block;
                        position: sticky;
                        top: var(--space-4);
                        align-self: start;
                    }
                }

                /* Dưới 900px sheet chiếm chỗ ở đáy màn. Không chừa đệm thì nó
                   NẰM ĐÈ lên nút "Tiếp tục" — nút vẫn đủ 44px và vẫn hiện,
                   nhưng bấm không được. Đây là lỗi dễ bỏ sót nhất của bố cục
                   này vì nhìn ảnh chụp không thấy. */
                @media (max-width: 899px) {
                    .booking-main[data-sheet='on'] {
                        padding-bottom: 96px;
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
                {/* Về đúng mẫu khách đi ra — bấm logo mà nhảy sang mẫu khác là
                    đứt mạch, đúng thứ AC-1 muốn tránh. */}
                <Link
                    href="/h3"
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

// ========================================================= tóm tắt giá

/** Dòng ngày + số khách, dùng chung cho cả cột phải lẫn bottom sheet. */
function StayLine({ nights }: { nights: number }) {
    const { locale } = useLocale()
    const cart = useCartStore()

    return (
        <div
            style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-muted)',
                display: 'grid',
                gap: 'var(--space-1)',
            }}
        >
            <div>
                {cart.checkIn} → {cart.checkOut}
            </div>
            <div>
                {nights} {tr(S.nights, locale)} · {cart.guests.adults}{' '}
                {tr(S.adults, locale).toLowerCase()}
                {cart.guests.children.length > 0 &&
                    ` · ${cart.guests.children.length} ${tr(S.children, locale).toLowerCase()}`}
            </div>
        </div>
    )
}

/** Thẻ tóm tắt đầy đủ — nội dung giống hệt ở desktop và trong sheet mobile. */
function SummaryCard({ quote }: { quote: NonNullable<ReturnType<typeof useCurrentQuote>> }) {
    const { locale } = useLocale()

    return (
        <div
            style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4)',
            }}
        >
            <h2
                style={{
                    margin: '0 0 var(--space-3)',
                    fontSize: 'var(--text-lg)',
                    fontFamily: 'var(--font-display)',
                }}
            >
                {tr(S.priceSummary, locale)}
            </h2>

            <div
                style={{
                    marginBottom: 'var(--space-3)',
                    paddingBottom: 'var(--space-3)',
                    borderBottom: '1px solid var(--border)',
                }}
            >
                <StayLine nights={quote.nights} />
            </div>

            <PriceBreakdown quote={quote} locale={locale} />
        </div>
    )
}

/**
 * Bottom sheet giá cho màn hẹp.
 *
 * MỐC 900px, KHÔNG PHẢI 640px: lưới hai cột của luồng bật ở 900px. Đặt sheet ở
 * 640px thì khoảng 640–900px không có cột phải (chưa đủ rộng) mà cũng chưa có
 * sheet — thanh giá rơi xuống tận cuối trang, đúng thứ FE5 gọi là "chưa thiết
 * kế mobile".
 */
function SummarySheet({ quote }: { quote: NonNullable<ReturnType<typeof useCurrentQuote>> }) {
    const { locale } = useLocale()
    const [open, setOpen] = useState(false)

    return (
        <div className="booking-sheet">
            <button
                type="button"
                className="booking-sheet__toggle"
                aria-expanded={open}
                aria-controls="booking-sheet-body"
                onClick={() => setOpen((v) => !v)}
            >
                <span className="booking-sheet__total">
                    <span className="booking-sheet__total-label">
                        {tr(S.totalAmount, locale)}
                    </span>
                    <strong className="booking-sheet__total-value">
                        {formatPrice(quote.totalAmount, locale)}
                    </strong>
                </span>
                <span className="booking-sheet__hint">
                    {tr(open ? S.hidePriceDetails : S.showPriceDetails, locale)}
                    <ChevronIcon up={!open} />
                </span>
            </button>

            {/* Ẩn bằng `hidden` chứ không tháo khỏi cây: giữ nguyên id để
                `aria-controls` luôn trỏ tới một phần tử có thật. */}
            <div id="booking-sheet-body" className="booking-sheet__body" hidden={!open}>
                <StayLine nights={quote.nights} />
                <div style={{ marginTop: 'var(--space-3)' }}>
                    <PriceBreakdown quote={quote} locale={locale} />
                </div>
            </div>

            <style>{`
                .booking-sheet {
                    position: fixed;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 50;
                    background: var(--surface);
                    border-top: 1px solid var(--border);
                    box-shadow: var(--shadow-lg);
                }

                /* Từ 900px trở lên đã có cột phải — hai bản cùng hiện là thừa. */
                @media (min-width: 900px) {
                    .booking-sheet {
                        display: none;
                    }
                }

                .booking-sheet__toggle {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: var(--space-3);
                    width: 100%;
                    /* AC-12: mốc chạm chính của màn hẹp, không được dưới 56px. */
                    min-height: 56px;
                    padding: var(--space-2) var(--space-3);
                    background: transparent;
                    border: 0;
                    font-family: var(--font-body);
                    color: var(--text);
                    text-align: left;
                    cursor: pointer;
                    transition: background var(--motion-instant) var(--ease);
                }

                .booking-sheet__toggle:hover {
                    background: var(--surface-hover);
                }

                .booking-sheet__toggle:active {
                    background: var(--surface-tint);
                }

                /* Nút này có hình dạng riêng nên không dùng được @repo/ui —
                   phải TỰ khai viền focus. Tuyệt đối không tắt outline
                   (luật FE1/D3). */
                .booking-sheet__toggle:focus-visible {
                    outline: 2px solid var(--focus-ring);
                    outline-offset: -3px;
                }

                .booking-sheet__total {
                    display: grid;
                    gap: 2px;
                    min-width: 0;
                }

                .booking-sheet__total-label {
                    font-size: var(--text-xs);
                    color: var(--text-muted);
                }

                .booking-sheet__total-value {
                    font-size: var(--text-lg);
                    font-weight: 700;
                    font-variant-numeric: tabular-nums;
                }

                .booking-sheet__hint {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--space-1);
                    flex-shrink: 0;
                    font-size: var(--text-xs);
                    color: var(--brand);
                    font-weight: 600;
                }

                .booking-sheet__chevron {
                    transition: transform var(--motion-instant) var(--ease);
                }

                .booking-sheet__body {
                    /* Cuộn TRONG sheet: breakdown dài (nhiều khuyến mãi, nhiều
                       addon) không được đẩy cao quá màn rồi che hết trang. */
                    max-height: 70vh;
                    overflow-y: auto;
                    padding: var(--space-3);
                    border-top: 1px solid var(--border);
                }

                /* WCAG 2.2 §2.3.3 / luật FE12. Hai chuyển động ở sheet này đều
                   là trang trí — đổi nền khi rê chuột và xoay mũi tên — nên tắt
                   hẳn, không chỉ rút ngắn.
                   Phải khai tường minh: biến --motion-instant là hằng số 150ms
                   của theme, KHÔNG tự về 0 như --duration của contract. */
                @media (prefers-reduced-motion: reduce) {
                    .booking-sheet__toggle,
                    .booking-sheet__chevron {
                        transition: none;
                    }
                }
            `}</style>
        </div>
    )
}

/** Mũi tên quay lại. SVG, không dùng ký tự `←` (luật FE9). */
function BackIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M19 12H5m0 0 7 7m-7-7 7-7" />
        </svg>
    )
}

/** Icon SVG, không emoji (luật FE9). */
function ChevronIcon({ up }: { up: boolean }) {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="booking-sheet__chevron"
            style={{ transform: up ? 'rotate(180deg)' : 'none' }}
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section
            className="booking-panel"
            style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
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
            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                {/* `minmax(150px, …)` để trần: ô `type="date"` có bề rộng nội
                    tại lớn hơn 150px nên nó ĐẨY rộng ô lưới ra và tràn ngang ở
                    375px. `min(150px, 100%)` cho track co lại được khi màn hẹp
                    hơn 150px, còn `minmax(0, 1fr)` chặn nội dung phình track. */}
                <div
                    className="booking-field-grid"
                    style={{
                        display: 'grid',
                        gap: 'var(--space-3)',
                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(min(150px, 100%), 1fr))',
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
                            gridTemplateColumns: 'repeat(auto-fit, minmax(min(110px, 100%), 1fr))',
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
                    {/* Trạng thái rỗng phải nói RÕ NGÀY NÀO hết và làm gì tiếp
                        (luật FE7): "không có kết quả" bắt khách tự đoán. */}
                    <span
                        role={availableCount === 0 ? 'status' : undefined}
                        style={{
                            fontSize: 'var(--text-sm)',
                            color: availableCount === 0 ? 'var(--warning)' : 'var(--text-muted)',
                        }}
                    >
                        {availableCount > 0
                            ? tr(S.roomsAvailable, locale).replace(
                                  '{count}',
                                  String(availableCount),
                              )
                            : tr(S.soldOutForDates, locale).replace(
                                  '{range}',
                                  `${cart.checkIn} – ${cart.checkOut}`,
                              )}
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
                            role="status"
                            style={{
                                margin: 'var(--space-3) 0 0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-1)',
                                fontSize: 'var(--text-sm)',
                                color: 'var(--success)',
                            }}
                        >
                            <CheckIcon />
                            {tr(S.promoApplied, locale)}: {cart.promoCode}
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
                            gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
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
                            gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
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
                                gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
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
            <Button
                variant="ghost"
                onClick={onBack}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)' }}
            >
                <BackIcon />
                {tr(S.back, locale)}
            </Button>
            <Button onClick={onNext} disabled={nextDisabled} size="lg">
                {nextLabel}
            </Button>
        </div>
    )
}
