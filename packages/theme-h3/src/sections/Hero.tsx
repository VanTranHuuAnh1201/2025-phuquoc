'use client'

import React, { useEffect, useState } from 'react'
import { Calendar } from 'lucide-react'
import { pick, UI, type I18nText, type Locale } from '@repo/core'
import { BookingCalendarModal } from '@repo/domain-hotel'

import { H3 } from '../strings'

/**
 * Section `top` — ảnh hero trình chiếu + thanh tìm phòng.
 *
 * BA THỨ ĐÃ CẮT KHI ĐƯA LÊN PACKAGE:
 *
 *   1. `useLanguage()` → nhận `locale` qua prop, dùng `pick()`. Theme không
 *      được đọc context của app: hai app có hai cơ chế i18n khác nhau, mà
 *      theme phải chạy được ở cả hai (luật R4).
 *
 *   2. `useRouter()` → nhận `onSearch` qua prop, có `searchHref` làm đường lui.
 *      Router là thứ của app; theme chỉ nói "người dùng đã bấm tìm, đây là
 *      tham số". App quyết định điều hướng thế nào.
 *
 *   3. `HERO_SLIDES` từ `data/property` → prop `slides`. File ảnh nằm trong
 *      `public/` của TỪNG app nên không chia sẻ được qua package; app truyền
 *      đường dẫn xuống, theme chỉ biết bố cục.
 */

export interface HeroSlide {
    src: string
    alt: I18nText
}

export interface HeroSearchParams {
    checkIn: string
    checkOut: string
    guests: string
    roomType: string
}

export interface HeroProps {
    locale: Locale
    /** Ảnh trình chiếu, theo thứ tự. Rỗng thì chỉ còn nền màu — không sập. */
    slides: readonly HeroSlide[]
    /**
     * Người dùng bấm "Kiểm tra phòng trống". Không truyền thì nút rơi về
     * `searchHref` — theme luôn có lối đi, kể cả khi app chưa nối handler.
     */
    onSearch?: (params: HeroSearchParams) => void
    /** Đích mặc định khi không có `onSearch`. */
    searchHref?: string
}

/** State của modal là ISO (YYYY-MM-DD); thanh tìm kiếm hiện dd/mm/yyyy. */
function formatDisplayDate(iso: string) {
    const [y, m, d] = iso.split('-')
    return y && m && d ? `${d}/${m}/${y}` : iso
}

function countNights(checkIn: string, checkOut: string) {
    const start = new Date(checkIn).getTime()
    const end = new Date(checkOut).getTime()
    if (Number.isNaN(start) || Number.isNaN(end)) return 0
    return Math.max(0, Math.round((end - start) / 86400000))
}

/**
 * Một ô của thanh tìm kiếm — bấm vào đâu cũng mở modal, vì mọi trường đều được
 * sửa ở trong đó.
 *
 * Khai ở CẤP MODULE chứ không lồng trong `Hero`: component định nghĩa lại mỗi
 * lần render là một type mới với React, nên cả cây con bị unmount/remount —
 * mất focus và nháy hình mỗi lần đổi ngày.
 */
function Field({
    label,
    value,
    hint,
    divider = true,
    onOpen,
}: {
    label: string
    value: string
    hint?: string
    divider?: boolean
    onOpen: () => void
}) {
    return (
        <button
            type="button"
            onClick={onOpen}
            className={`group flex flex-col gap-1 rounded-md px-4 py-2.5 text-left transition-colors hover:bg-[var(--hero-tint)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--hero-focus)] ${
                divider ? 'md:border-r md:border-[var(--hero-line)]' : ''
            }`}
        >
            <span className="text-[10.5px] font-extrabold tracking-[0.13em] text-[var(--hero-label)] uppercase">
                {label}
            </span>
            <span className="flex items-baseline gap-2">
                <span className="truncate text-[14.5px] font-semibold text-[var(--text-on-hero)]">
                    {value}
                </span>
                {hint ? (
                    <span className="text-[11.5px] font-medium text-[var(--hero-label)]">
                        {hint}
                    </span>
                ) : null}
            </span>
        </button>
    )
}

export function Hero({ locale, slides, onSearch, searchHref = '#rooms' }: HeroProps) {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false)

    const [checkIn, setCheckIn] = useState('2026-08-15')
    const [checkOut, setCheckOut] = useState('2026-08-17')
    const [guests, setGuests] = useState(pick(H3.defaultGuests, locale))
    const [roomType, setRoomType] = useState(pick(H3.defaultRoomType, locale))

    // `slides.length` vào deps: app có thể đổi bộ ảnh giữa chừng, timer phải
    // biết modulo mới nếu không sẽ trỏ vào index không tồn tại.
    useEffect(() => {
        if (slides.length < 2) return
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 8000)
        return () => clearInterval(timer)
    }, [slides.length])

    const nights = countNights(checkIn, checkOut)
    const nightLabel = pick(nights > 1 ? UI.nights : UI.night, locale)

    const openModal = () => setIsCalendarModalOpen(true)

    const handleSearch = () => {
        onSearch?.({ checkIn, checkOut, guests, roomType })
    }

    /**
     * Nút tìm: có `onSearch` thì là `<button>`, không thì là `<a>` sang
     * `searchHref`. Không bao giờ render một nút không làm gì cả.
     */
    const searchButtonClass =
        'shrink-0 whitespace-nowrap bg-brand text-text-inverse transition-colors duration-150 hover:bg-[var(--brand-dark)] active:bg-[var(--brand-darker)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

    return (
        <section id="top" className="relative w-full overflow-hidden bg-[var(--hero-base)]">
            {slides.map((slide, idx) => (
                <img
                    key={slide.src}
                    src={slide.src}
                    alt={pick(slide.alt, locale)}
                    aria-hidden={currentSlide !== idx}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[900ms] ease-in-out ${
                        currentSlide === idx ? 'opacity-100' : 'opacity-0'
                    }`}
                />
            ))}

            {/* Lớp phủ gradient — giữ chữ trắng đọc được trên bất kỳ ảnh nào.
                Gradient khai trong `tokens.css` để không có hex nào ở đây (D0). */}
            <div className="absolute inset-0 bg-[image:var(--hero-scrim)]" />

            <div className="relative z-10 mx-auto flex min-h-[70vh] w-full max-w-[1320px] flex-col justify-end px-5 pt-[96px] pb-5 sm:px-8 sm:pt-[130px] sm:pb-[42px] lg:pt-[160px]">
                {/* Eyebrow — ẩn trên mobile, viewport đầu để dành cho tiêu đề
                    và ô tìm kiếm (luật P9). */}
                <div className="mb-4 hidden items-center gap-3 sm:mb-[18px] md:flex">
                    <span className="h-[7px] w-[7px] rounded-full bg-[var(--hero-dot)]" />
                    <span className="text-text-inverse/[0.86] text-[11px] font-bold tracking-[0.16em] uppercase sm:text-xs">
                        {pick(UI.hilltopBoutiqueResortCuTronNam, locale)}
                    </span>
                </div>

                <h1 className="text-text-inverse m-0 mb-4 max-w-[15ch] text-[clamp(32px,5vw,68px)] leading-[1.04] font-bold tracking-[-0.038em] text-balance sm:mb-[18px]">
                    {pick(UI.sunriseAndSunsetFromTheVery, locale)}
                </h1>

                <p className="text-text-inverse/[0.84] m-0 mb-5 hidden max-w-[58ch] text-[clamp(15px,1.3vw,17.5px)] leading-[1.6] sm:mb-[26px] md:block">
                    {pick(UI.onTheHighestHillOfCu, locale)}
                </p>

                {/* 📱 MOBILE — một viên gộp: tóm tắt + nút tìm nằm cạnh nhau.
                    Mobile không phải desktop xếp dọc (luật P9): năm ô của bản
                    desktop trên màn 390px sẽ chiếm hết viewport đầu. */}
                <div
                    id="booking"
                    className="flex items-center gap-1.5 rounded-lg bg-[var(--hero-card)] p-1.5 shadow-[var(--shadow-hero-sm)] backdrop-blur-[18px] md:hidden"
                >
                    <button
                        type="button"
                        onClick={openModal}
                        aria-label={pick(UI.changeDatesAndGuests, locale)}
                        className="flex min-h-[44px] min-w-0 flex-1 items-center gap-2 rounded-sm px-2.5 py-1.5 text-left transition-colors hover:bg-[var(--hero-tint)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--hero-focus)]"
                    >
                        <Calendar className="text-brand h-4 w-4 shrink-0" />
                        <span className="flex min-w-0 flex-col">
                            <span className="truncate text-[13px] leading-tight font-semibold text-[var(--text-on-hero)]">
                                {formatDisplayDate(checkIn)} — {formatDisplayDate(checkOut)}
                            </span>
                            <span className="truncate text-[11px] leading-tight font-medium text-[var(--hero-label)]">
                                {nights > 0 ? `${nights} ${nightLabel} · ` : ''}
                                {guests}
                            </span>
                        </span>
                    </button>

                    {onSearch ? (
                        <button
                            type="button"
                            onClick={handleSearch}
                            className={`${searchButtonClass} h-[44px] rounded-sm px-4 text-[13px] font-bold shadow-1`}
                        >
                            {pick(UI.search, locale)}
                        </button>
                    ) : (
                        <a
                            href={searchHref}
                            className={`${searchButtonClass} flex h-[44px] items-center rounded-sm px-4 text-[13px] font-bold no-underline shadow-1`}
                        >
                            {pick(UI.search, locale)}
                        </a>
                    )}
                </div>

                {/* 🖥️ DESKTOP — thanh 5 cột; mỗi ô mở `BookingCalendarModal`. */}
                <div className="hidden items-stretch gap-1 rounded-xl bg-[var(--hero-card)] px-4 py-3.5 shadow-[var(--shadow-hero)] backdrop-blur-[18px] [grid-template-columns:minmax(128px,1fr)_minmax(128px,1fr)_minmax(128px,0.8fr)_minmax(200px,1.5fr)_auto] md:grid">
                    <Field
                        label={pick(UI.checkIn, locale)}
                        value={formatDisplayDate(checkIn)}
                        onOpen={openModal}
                    />
                    <Field
                        label={pick(UI.checkOut, locale)}
                        value={formatDisplayDate(checkOut)}
                        hint={nights > 0 ? `${nights} ${nightLabel}` : undefined}
                        onOpen={openModal}
                    />
                    <Field label={pick(UI.guests2, locale)} value={guests} onOpen={openModal} />
                    <Field
                        label={pick(UI.selectRoom, locale)}
                        value={roomType}
                        divider={false}
                        onOpen={openModal}
                    />

                    {onSearch ? (
                        <button
                            type="button"
                            onClick={handleSearch}
                            className={`${searchButtonClass} rounded-lg px-[26px] py-[17px] text-sm font-bold shadow-2`}
                        >
                            {pick(UI.checkAvailability, locale)}
                        </button>
                    ) : (
                        <a
                            href={searchHref}
                            className={`${searchButtonClass} flex items-center rounded-lg px-[26px] py-[17px] text-sm font-bold no-underline shadow-2`}
                        >
                            {pick(UI.checkAvailability, locale)}
                        </a>
                    )}
                </div>

                {/* Cam kết + chấm chỉ vị trí slide */}
                <div className="mt-[18px] hidden flex-wrap items-center justify-between gap-6 lg:flex">
                    <span className="text-text-inverse/[0.72] text-[12.5px] font-medium">
                        {pick(UI.bestRateGuaranteedWhenYouBook, locale)}
                    </span>
                    <div className="flex gap-2">
                        {slides.map((slide, idx) => (
                            <button
                                key={slide.src}
                                type="button"
                                onClick={() => setCurrentSlide(idx)}
                                aria-label={`${pick(H3.slide, locale)} ${idx + 1}`}
                                aria-current={currentSlide === idx}
                                className={`h-1 w-[26px] rounded-xs p-0 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--text-inverse)] ${
                                    currentSlide === idx
                                        ? 'bg-text-inverse'
                                        : 'bg-text-inverse/[0.36] hover:bg-text-inverse/60'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <BookingCalendarModal
                isOpen={isCalendarModalOpen}
                onClose={() => setIsCalendarModalOpen(false)}
                checkIn={checkIn}
                checkOut={checkOut}
                guests={guests}
                roomType={roomType}
                locale={locale}
                onSave={(cIn, cOut, g, rt) => {
                    setCheckIn(cIn)
                    setCheckOut(cOut)
                    setGuests(g)
                    setRoomType(rt)
                    setIsCalendarModalOpen(false)
                }}
            />
        </section>
    )
}
