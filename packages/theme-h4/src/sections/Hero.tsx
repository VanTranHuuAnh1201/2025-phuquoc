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
        // `basis-[190px]` + `px-4`: `<input type=date>` render "08/13/2026" kèm
        // icon lịch của trình duyệt và KHÔNG tự xuống dòng — hụt chỗ là nó cắt
        // cụt thành "08/13/" chứ không co chữ. 190px là mức đo được vừa đủ ở
        // cả Chrome lẫn Firefox. `flex-1` cho giãn thêm khi còn chỗ.
        <label className="flex min-h-[44px] min-w-0 flex-1 basis-[190px] flex-col justify-center gap-1 px-4 py-3">
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
/**
 * `w-full min-w-0`: ô nhập phải co theo `<label>` cha, KHÔNG được tự giữ bề
 * rộng riêng. Đặt `min-width` ở đây thì input phình quá khung cha và hai ô
 * ngày đè chữ lên nhau. Ràng buộc bề rộng tối thiểu nằm ở `<label>` (`basis`),
 * là chỗ duy nhất flex tính được.
 */
const conciergeInputClass =
    'w-full min-w-0 border-none bg-transparent p-0 text-base font-medium text-text-inverse outline-none [color-scheme:dark] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]'

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
                <div className="border-t border-solid border-[rgb(250_248_245/0.18)] bg-[rgb(26_30_36/0.65)] backdrop-blur-[10px]">
                    <Container>
                        <form
                            action={searchHref}
                            onSubmit={handleSubmit}
                            className="flex flex-col items-stretch gap-2 py-3 lg:flex-row lg:items-center lg:gap-0 lg:py-0"
                        >
                            {/* Nhãn là thứ ÍT quan trọng nhất trên thanh này, nên
                                nó là thứ đầu tiên bị cắt khi hết chỗ. Chỉ hiện
                                từ 2xl (1536px): dưới mức đó, ba ô nhập + nút CTA
                                đã ăn hết bề ngang container, và nhãn chen vào là
                                đẩy nút tràn khỏi mép phải. */}
                            <p className="m-0 hidden shrink-0 pr-6 text-xs tracking-[0.2em] text-[rgb(250_248_245/0.72)] uppercase 2xl:block">
                                {pick(H4.concierge, locale)}
                            </p>

                            {/* `lg:basis-[520px]`: cụm ba ô phải giữ được chỗ
                                cho 3×168px, nếu không nhãn concierge và nút CTA
                                nén nó xuống ~97px/ô và hai ô ngày đè chữ lên
                                nhau (`<input type=date>` không xuống dòng, nó
                                tràn ra ngoài khung).

                                Divider dọc chỉ hiện từ lg — mobile xếp dọc, mỗi
                                ô một dòng, không nhồi ngang (P9). */}
                            {/* `min-w` chỉ từ xl (1280px) trở lên. Ở 1024–1279px
                                container chưa đủ rộng để vừa 3×190px vừa nút
                                CTA — ép min-width ở đó là đẩy nút tràn khỏi
                                viewport. Dưới xl để flex tự chia, ô hẹp hơn
                                một chút nhưng ngày vẫn hiện đủ. */}
                            <div className="flex min-w-0 flex-1 flex-col divide-y divide-solid divide-[rgb(250_248_245/0.16)] lg:flex-row lg:divide-x lg:divide-y-0 xl:min-w-[570px]">
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

                            {/* `lg:pl-4 xl:pl-8`: ở 1024–1279px mọi khoảng đệm
                                đều phải nhường chỗ cho ba ô ngày. Nhãn nút cũng
                                rút gọn ở mức đó — "Kiểm tra phòng trống" dài 20
                                ký tự, đủ để đẩy ngày cụt thành "08/13/2(". */}
                            <div className="shrink-0 py-3 lg:py-4 lg:pl-4 xl:pl-8">
                                <button
                                    type="submit"
                                    className={`${primaryButtonClass} w-full lg:w-auto lg:px-4 xl:px-6`}
                                >
                                    <span className="lg:hidden xl:inline">
                                        {pick(UI.checkAvailability, locale)}
                                    </span>
                                    {/* Nhãn ngắn CHỈ ở dải 1024–1279px. Vẫn là
                                        động từ rõ nghĩa, không phải "Xem" mơ hồ
                                        (luật D5). */}
                                    <span className="hidden lg:inline xl:hidden">
                                        {pick(H4.checkShort, locale)}
                                    </span>
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
