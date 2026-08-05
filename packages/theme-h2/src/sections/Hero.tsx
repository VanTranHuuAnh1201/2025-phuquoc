'use client'

import { useEffect, useState } from 'react'
import { pick, themePath, type Locale, type PropertyData } from '@repo/core'
import { BookingCalendarModal } from '@repo/domain-hotel'
import { useCartStore } from '../../../../apps/2026-thenamduhill/src/stores/cart.store'

import { meta } from '../meta'
import { ui } from '../strings'

const SLUG = meta.slug

const HERO_IMAGES = ['/hero-1.jpg', '/hero-2.jpg']

/**
 * Hero mẫu 07 — ảnh nền tràn màn hình, nội dung căn trái, form tra cứu nổi
 * đè lên mép dưới.
 *
 * Hai bố cục form tách hẳn theo bản thiết kế:
 *   desktop — một hàng ngang: nhận · trả · người lớn · trẻ em · nút vàng.
 *   mobile  — xếp dọc: 2 ô ngày cạnh nhau, 2 ô khách cạnh nhau, nút vàng
 *             full-width bên dưới, rồi dải ba cam kết.
 *
 * Dải cam kết (đưa đón · cọc 50% · tàu hoãn) nằm ngay trong khối form ở cả hai
 * bố cục — đúng thiết kế, và đây là thông tin quyết định đặt phòng ở Nam Du.
 *
 * Form hiện là vỏ tĩnh; nối vào luồng đặt phòng thật ở bước sau. Không tính
 * giá tại đây (luật R8) — bấm nút là sang `/h7/rooms`.
 *
 * Breakpoint 960px là của bản thiết kế, không trùng thang mặc định của
 * Tailwind (md 768 · lg 1024) nên viết bằng biến tuỳ ý `min-[960px]:`.
 */

/** Một ô nhập của form tra cứu. Desktop bỏ nền, ngăn nhau bằng vạch dọc. */
const FIELD =
    'grid content-center gap-[3px] min-w-0 rounded-sm bg-[var(--surface-alt)] px-3 py-2 ' +
    'min-[960px]:rounded-none min-[960px]:bg-transparent ' +
    'min-[960px]:border-r min-[960px]:border-border-default'

const INPUT = 'w-full p-0 text-[15px] font-bold text-text-primary'

const LABEL = 'text-[11.5px] font-medium text-text-secondary'

function IconCalendar() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="5" width="18" height="16" rx="2" stroke="var(--brand)" strokeWidth="1.7" />
            <path d="M3 10h18M8 3v4M16 3v4" stroke="var(--brand)" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
    )
}

function IconUser() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="8" r="3.4" stroke="var(--brand)" strokeWidth="1.7" />
            <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" stroke="var(--brand)" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
    )
}

/** Ba cam kết dưới form — icon + chữ, dùng chung cho desktop và mobile. */
function Assurances({ locale }: { locale: Locale }) {
    const items =
        locale === 'vi'
            ? ['Xe resort đón tại cầu cảng', 'Cọc 50% để giữ phòng', 'Tàu hoãn do thời tiết: đổi ngày miễn phí']
            : ['Resort pickup at the pier', '50% deposit to hold your room', 'Weather delays: free date change']

    return (
        <div className="grid gap-[10px] px-[6px] pt-3 pb-[2px] min-[960px]:grid-cols-3 min-[960px]:gap-0 min-[960px]:border-t min-[960px]:border-border-default min-[960px]:p-0">
            {items.map((label) => (
                <span
                    key={label}
                    className="flex items-center gap-2 text-[12.5px] font-semibold text-text-primary min-[960px]:justify-center min-[960px]:border-r min-[960px]:border-border-default min-[960px]:px-3 min-[960px]:py-[13px] min-[960px]:last:border-r-0"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" stroke="var(--brand)" strokeWidth="1.7" />
                        <path d="M8 12.4l2.6 2.6L16 9.6" stroke="var(--brand)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {label}
                </span>
            ))}
        </div>
    )
}

export function Hero({ data, locale }: { data: PropertyData; locale: Locale }) {
    const { hero } = data
    const t = ui[locale]
    const heroImages = hero.images?.length ? hero.images : HERO_IMAGES
    const [currentSlide, setCurrentSlide] = useState(0)

    const cart = useCartStore()
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false)

    useEffect(() => {
        if (heroImages.length < 2) return
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length)
        }, 6000)
        return () => clearInterval(timer)
    }, [heroImages.length])

    const adultsLabel = locale === 'vi' ? 'Người lớn' : 'Adults'
    const childrenLabel = locale === 'vi' ? 'Trẻ em' : 'Children'
    const ctaLabel = locale === 'vi' ? 'Chọn ngày & xem phòng' : 'Choose dates & view rooms'

    const formatDisplayDate = (iso: string) => {
        if (!iso) return ''
        const [y, m, d] = iso.split('-')
        return y && m && d ? `${d}/${m}/${y}` : iso
    }

    const totalGuests = cart.guests.adults + (cart.guests.children?.length || 0)
    const guestsDisplay = locale === 'vi' ? `${totalGuests} khách` : `${totalGuests} guests`
    const roomTypeDisplay = locale === 'vi' ? 'Tất cả 20 hạng phòng' : 'All 20 rooms'

    const handleSave = (checkIn: string, checkOut: string, guestsStr: string) => {
        cart.setDates(checkIn, checkOut)
        const num = parseInt(guestsStr) || 2
        cart.setGuests({ adults: num, children: [] })
    }

    return (
        <section
            id="top"
            className="relative flex min-h-[620px] flex-col justify-end overflow-hidden bg-[var(--surface-inverse)] pt-[88px] min-[960px]:min-h-[min(100vh,780px)] min-[960px]:pt-[96px]"
        >
            {heroImages.map((src, idx) => (
                <div
                    key={src}
                    className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[1200ms] ease-in-out ${
                        idx === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ backgroundImage: `url(${src})` }}
                />
            ))}

            {/* Lớp phủ giữ chữ trắng đọc được mà không làm ảnh xỉn màu. */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,var(--overlay-scrim)_0%,color-mix(in_srgb,var(--overlay-scrim)_55%,transparent)_42%,transparent_72%)]" />

            <div className="relative z-10 mx-auto w-full max-w-[var(--container)] px-4 pt-[32px] pb-5 min-[960px]:px-6 min-[960px]:pt-[48px] min-[960px]:pb-[28px]">
                {/* Badge pill — bản mobile đặt badge lên trên tiêu đề. */}
                {hero.kicker && (
                    <span className="mb-3 inline-block rounded-full border border-[var(--overlay-line)] bg-[var(--overlay-soft)] px-4 py-[7px] text-[12.5px] font-semibold text-text-inverse [backdrop-filter:blur(10px)]">
                        {pick(hero.kicker, locale)}
                    </span>
                )}

                <h1 className="mt-0 mb-[14px] max-w-[15ch] font-display text-[clamp(2rem,6.2vw,3.5rem)] leading-[1.14] font-semibold tracking-[-0.01em] text-balance text-text-inverse [text-shadow:0_3px_24px_var(--overlay-scrim)] min-[960px]:max-w-[18ch]">
                    {pick(hero.title, locale)}
                </h1>

                <p className="m-0 max-w-[46ch] text-[clamp(0.95rem,2vw,1.05rem)] leading-[1.6] text-text-inverse/95 [text-shadow:0_2px_12px_var(--overlay-scrim)]">
                    {pick(hero.sub, locale)}
                </p>
            </div>

            {/* ---------- FORM TRA CỨU ---------- */}
            <div className="relative z-10 mx-auto w-full max-w-[var(--container)] px-4 pb-[28px] min-[960px]:px-6 min-[960px]:pb-[56px]">
                <form
                    className="grid gap-[10px] rounded-md bg-surface-raised p-[10px] shadow-[var(--shadow-lg)] min-[960px]:grid-cols-[1fr_auto] min-[960px]:items-center min-[960px]:gap-3 min-[960px]:rounded-b-none min-[960px]:py-[10px] min-[960px]:pr-[10px] min-[960px]:pl-1"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <div
                        className="grid cursor-pointer grid-cols-2 gap-2 min-[960px]:grid-cols-4 min-[960px]:gap-0"
                        onClick={() => setIsCalendarModalOpen(true)}
                    >
                        <div className={FIELD}>
                            <div className={LABEL}>{t.checkIn}</div>
                            <span className="flex items-center gap-2">
                                <IconCalendar />
                                <div className={INPUT}>{formatDisplayDate(cart.checkIn)}</div>
                            </span>
                        </div>

                        <div className={FIELD}>
                            <div className={LABEL}>{t.checkOut}</div>
                            <span className="flex items-center gap-2">
                                <IconCalendar />
                                <div className={INPUT}>{formatDisplayDate(cart.checkOut)}</div>
                            </span>
                        </div>

                        <div className={FIELD}>
                            <div className={LABEL}>{adultsLabel}</div>
                            <span className="flex items-center gap-2">
                                <IconUser />
                                <div className={INPUT}>{cart.guests.adults}</div>
                            </span>
                        </div>

                        {/* Ô cuối không có vạch ngăn bên phải. */}
                        <div className={`${FIELD} min-[960px]:border-r-0`}>
                            <div className={LABEL}>{childrenLabel}</div>
                            <span className="flex items-center gap-2">
                                <IconUser />
                                <div className={INPUT}>{cart.guests.children?.length || 0}</div>
                            </span>
                        </div>
                    </div>

                    <a
                        href={themePath(SLUG, 'rooms')}
                        className={[
                            'block rounded-sm px-6 py-[15px] text-center text-[15px] font-bold whitespace-nowrap no-underline',
                            // Navy trên vàng ≈ 9.2:1. Trắng trên vàng chỉ 1.9:1 — trượt AA.
                            'bg-[var(--accent)] text-[var(--on-accent)]',
                            'transition-[background,transform] duration-200 ease-out',
                            'hover:bg-[var(--accent-dark)] active:translate-y-px',
                            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                            'min-[960px]:px-[30px]',
                        ].join(' ')}
                    >
                        {ctaLabel}
                    </a>
                </form>

                {/* Mobile: dải cam kết là một thẻ riêng luồn xuống dưới form (z-index
                    âm để mép bo của form nằm trên). Desktop: nằm liền trong cùng thẻ. */}
                <div className="relative z-[-1] mx-[10px] mt-[-10px] rounded-b-md bg-surface-raised px-[10px] pb-2 shadow-[var(--shadow-lg)] min-[960px]:z-auto min-[960px]:m-0 min-[960px]:p-0">
                    <Assurances locale={locale} />
                </div>
            </div>

            <BookingCalendarModal
                isOpen={isCalendarModalOpen}
                onClose={() => setIsCalendarModalOpen(false)}
                checkIn={cart.checkIn}
                checkOut={cart.checkOut}
                guests={guestsDisplay}
                roomType={roomTypeDisplay}
                locale={locale}
                onSave={handleSave}
            />
        </section>
    )
}
