'use client'

import { useEffect, useState } from 'react'
import { pick, UI, type I18nText, type Locale } from '@repo/core'

import { H4 } from '../strings'
import { Container, primaryButtonClass } from './primitives'

/**
 * Section `top` — hero ảnh tràn khổ + thanh đặt phòng Concierge ở đáy.
 *
 * KHÁC BIỆT CÓ CHỦ ĐÍCH SO VỚI CÁC MẪU KHÁC:
 *
 * Mẫu 03 đặt một THẺ tìm phòng nổi đè lên hero — mạnh về chuyển đổi, nhưng
 * cắt đôi bức ảnh và phá "khoảng lặng". Ở mẫu này thanh đặt phòng CHÌM thành
 * một dải mảnh ở đáy hero, cùng bảng màu với màng phủ. Ảnh giữ nguyên khổ,
 * mà lối vào booking vẫn nằm trong viewport đầu tiên (luật P10).
 *
 * BA THỨ NHẬN QUA PROP, KHÔNG TỰ LẤY (luật R4/R13):
 *   1. `locale`  — theme không đọc context i18n của app.
 *   2. `slides`  — file ảnh nằm trong `public/` của từng app.
 *   3. `onSearch`/`searchHref` — điều hướng là việc của app.
 *
 * CHUYỂN ĐỘNG (ngân sách P8 = 2/viewport): ken-burns trên ảnh + reveal của
 * khối chữ. Slider KHÔNG tự chạy — ảnh tự đổi làm mắt không nghỉ được, đúng
 * thứ "Calm" của P11 cấm. Người dùng bấm chấm để đổi.
 */

export interface HeroSlide {
    src: string
    alt: I18nText
}

export interface HeroSearchParams {
    checkIn: string
    checkOut: string
    guests: string
}

export interface HeroProps {
    locale: Locale
    /** Ảnh hero theo thứ tự. Rỗng thì còn nền tối — không sập. */
    slides: readonly HeroSlide[]
    onSearch?: (params: HeroSearchParams) => void
    /** Đích mặc định khi app chưa nối handler. */
    searchHref?: string
}

/** Hôm nay + n ngày, dạng YYYY-MM-DD cho `<input type="date">`. */
function isoPlusDays(days: number): string {
    const d = new Date()
    d.setDate(d.getDate() + days)
    return d.toISOString().slice(0, 10)
}

/**
 * Một ô của thanh concierge.
 *
 * Khai ở CẤP MODULE chứ không lồng trong `Hero`: component định nghĩa lại mỗi
 * lần render là một type mới với React, nên cả cây con bị unmount/remount —
 * mất focus ngay giữa lúc người dùng đang chọn ngày.
 *
 * `<label>` bọc `<input>` nên bấm vào nhãn là focus vào ô (D4).
 */
function ConciergeField({
    label,
    children,
}: {
    label: string
    children: React.ReactNode
}) {
    return (
        // `basis-[150px]`: đủ rộng để "08/12/2026" và nhãn "NGÀY ĐẾN" hiện
        // trọn, nhưng vẫn co giãn được. Để `basis-0` thì ba ô bị bóp tới mức
        // ngày cụt thành "08,"; để `flex-1` trần thì ô ngày (nội dung dài) ăn
        // hết chỗ và đẩy nút CTA đè lên ô "Số khách".
        <label className="flex min-h-[44px] min-w-0 flex-1 basis-[150px] flex-col justify-center gap-1 px-5 py-3">
            <span className="truncate text-xs tracking-[0.16em] text-[rgb(250_248_245/0.72)] uppercase">
                {label}
            </span>
            {children}
        </label>
    )
}

/**
 * Ô nhập trong thanh concierge — nền trong suốt, chỉ có chữ.
 *
 * `[color-scheme:dark]` để lịch bật ra của trình duyệt cũng ở tông tối, không
 * loè một mảng trắng giữa hero.
 */
const conciergeInputClass =
    'w-full min-w-[135px] border-none bg-transparent p-0 text-base font-medium text-text-inverse outline-none [color-scheme:dark] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]'

export function Hero({ locale, slides, onSearch, searchHref = '#rooms' }: HeroProps) {
    const [current, setCurrent] = useState(0)

    /**
     * Ngày mặc định tính ở CLIENT sau khi mount, không ở lúc render đầu.
     *
     * VÌ SAO: trang này là Server Component ở tầng route. Nếu lấy `new Date()`
     * ngay trong khởi tạo state thì HTML server sinh ra (giờ máy chủ, có thể
     * UTC) khác HTML client dựng lại (giờ địa phương) → React báo hydration
     * mismatch, và ở biên nửa đêm thì hiện sai ngày thật.
     */
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [guests, setGuests] = useState('2')

    useEffect(() => {
        setCheckIn(isoPlusDays(7))
        setCheckOut(isoPlusDays(9))
    }, [])

    const handleSubmit = (event: React.FormEvent) => {
        // Không có handler thì để `<form action>` tự điều hướng — theme luôn
        // có lối đi kể cả khi app chưa nối gì.
        if (!onSearch) return
        event.preventDefault()
        onSearch({ checkIn, checkOut, guests })
    }

    const active = slides[current]

    return (
        <section id="top" className="relative isolate min-h-[86svh] overflow-hidden bg-[var(--surface-darker)] md:min-h-svh">
            {/* ---------------------------------------------------------- ảnh */}
            {slides.map((slide, index) => (
                <div
                    key={slide.src}
                    data-decor="image"
                    aria-hidden={index !== current}
                    className={`absolute inset-0 transition-opacity duration-[var(--motion-normal)] ${
                        index === current ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={slide.src}
                        alt={index === current ? pick(slide.alt, locale) : ''}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        fetchPriority={index === 0 ? 'high' : 'auto'}
                        decoding="async"
                        className="h4-kenburns h-full w-full object-cover"
                    />
                </div>
            ))}

            {/* Màng phủ — đủ dày để chữ trắng đạt ≥7:1 trên cả vùng trời sáng
                nhất của ảnh (P15). Không phải hiệu ứng trang trí. */}
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-[image:var(--hero-scrim)]"
            />

            {/* ------------------------------------------------------ nội dung */}
            <div className="relative flex min-h-[86svh] flex-col justify-end pt-[var(--space-7)] md:min-h-svh">
                <Container className="h4-reveal pb-[var(--space-5)] md:pb-[var(--space-6)]">
                    <p className="m-0 mb-5 text-xs font-medium tracking-[0.28em] text-[var(--accent)] uppercase">
                        {pick(H4.heroEyebrow, locale)}
                    </p>

                    {/* Điểm nhìn DUY NHẤT của viewport này (P4). Cỡ 4xl=64px
                        trên desktop, hạ về 2xl trên mobile để không tràn. */}
                    <h1 className="m-0 max-w-[16ch] font-display text-2xl leading-[1.08] font-normal tracking-[-0.02em] text-balance text-text-inverse md:text-4xl">
                        {pick(H4.heroTitle, locale)}
                    </h1>

                    <p className="mt-6 mb-0 max-w-[52ch] text-base leading-[var(--line-height-base)] text-[rgb(250_248_245/0.88)]">
                        {pick(H4.heroLede, locale)}
                    </p>

                    {/* Chấm chuyển ảnh. Nút thật, có nhãn — không phải div. */}
                    {slides.length > 1 && (
                        <div className="mt-8 flex items-center gap-3">
                            {slides.map((slide, index) => (
                                <button
                                    key={slide.src}
                                    type="button"
                                    onClick={() => setCurrent(index)}
                                    aria-label={`${pick(H4.slide, locale)} ${index + 1}`}
                                    aria-current={index === current}
                                    className={`h-[24px] w-[24px] cursor-pointer border-none bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]`}
                                >
                                    {/* Vạch nhỏ nằm giữa target 24×24 (D4/WCAG
                                        2.5.8) — vùng bấm đủ lớn, dấu hiệu nhỏ. */}
                                    <span
                                        className={`block h-[2px] w-full transition-colors duration-[var(--motion-instant)] ${
                                            index === current
                                                ? 'bg-[var(--accent)]'
                                                : 'bg-[rgb(250_248_245/0.42)]'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </Container>

                {/* ------------------------------- thanh Concierge ở đáy hero */}
                <div className="border-t border-solid border-[rgb(250_248_245/0.18)] bg-[rgb(20_39_51/0.62)] backdrop-blur-[10px]">
                    <Container>
                        <form
                            action={searchHref}
                            onSubmit={handleSubmit}
                            className="flex flex-col items-stretch gap-2 py-3 lg:flex-row lg:items-center lg:gap-0 lg:py-0"
                        >
                            {/* Nhãn chỉ hiện từ xl: ở 1024–1279px nó ăn mất chỗ
                                của ba ô nhập và đẩy nút CTA đè lên ô "Số khách". */}
                            <p className="m-0 hidden shrink-0 pr-8 text-xs tracking-[0.2em] text-[rgb(250_248_245/0.72)] uppercase xl:block">
                                {pick(H4.concierge, locale)}
                            </p>

                            {/* `min-w-0`: không có nó, các ô `flex-1` giữ nguyên
                                chiều rộng nội dung tối thiểu và đẩy nút CTA
                                tràn khỏi mép phải viewport — nút chỉ còn hiện
                                chữ "KIỂM". Đây là lỗi thấy rõ ở ảnh audit 1440px.

                                Divider dọc chỉ hiện từ lg — mobile xếp dọc, mỗi
                                ô một dòng, không nhồi ngang (P9). */}
                            <div className="flex min-w-0 flex-1 flex-col divide-y divide-solid divide-[rgb(250_248_245/0.16)] lg:flex-row lg:divide-x lg:divide-y-0">
                                <ConciergeField label={pick(H4.arrival, locale)}>
                                    <input
                                        type="date"
                                        name="checkIn"
                                        value={checkIn}
                                        onChange={(e) => setCheckIn(e.target.value)}
                                        className={conciergeInputClass}
                                    />
                                </ConciergeField>

                                <ConciergeField label={pick(H4.departure, locale)}>
                                    <input
                                        type="date"
                                        name="checkOut"
                                        value={checkOut}
                                        onChange={(e) => setCheckOut(e.target.value)}
                                        className={conciergeInputClass}
                                    />
                                </ConciergeField>

                                <ConciergeField label={pick(UI.guests2, locale)}>
                                    <input
                                        type="number"
                                        name="guests"
                                        min={1}
                                        max={12}
                                        value={guests}
                                        onChange={(e) => setGuests(e.target.value)}
                                        className={conciergeInputClass}
                                    />
                                </ConciergeField>
                            </div>

                            <div className="shrink-0 py-3 lg:py-4 lg:pl-8">
                                <button
                                    type="submit"
                                    className={`${primaryButtonClass} w-full lg:w-auto`}
                                >
                                    {pick(UI.checkAvailability, locale)}
                                </button>
                            </div>
                        </form>
                    </Container>
                </div>
            </div>

            {/* Ảnh hero là nội dung, không phải trang trí — mô tả cho ảnh đang
                hiện đã gắn ở `<img alt>` phía trên. */}
            <span className="sr-only">{active ? pick(active.alt, locale) : ''}</span>
        </section>
    )
}
