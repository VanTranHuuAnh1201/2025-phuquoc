'use client'

import { useState } from 'react'
import { pick, type Locale, type PropertyData } from '@repo/core'
import { ImageSlot } from '@repo/ui'

/**
 * Dải cam kết (USP) + khối giới thiệu hai cột.
 *
 * Bản thiết kế đặt bốn cam kết ngay dưới hero — mỗi cam kết là icon tuyến +
 * tiêu đề + một dòng phụ. Desktop chia 4 cột ngăn bằng vạch dọc; mobile là
 * lưới 4 ô trong một thẻ trắng, chữ hai dòng.
 *
 * Khối about bên dưới: ảnh/video bên trái, nội dung bên phải, kèm dải bốn
 * tiện ích và nút "Khám phá thêm". Mobile xếp dọc, ảnh trước.
 *
 * Icon vẽ tại chỗ bằng SVG — luật D5 cấm emoji làm icon ở sản phẩm mới.
 * Nội dung lấy từ `data.facts` / `data.about` của core (luật R8).
 *
 * Breakpoint 960px là của bản thiết kế, không trùng thang mặc định của
 * Tailwind (md 768 · lg 1024) nên viết bằng biến tuỳ ý `min-[960px]:`.
 */

const USP_ICONS: readonly (() => React.ReactElement)[] = [
    IconShield,
    IconVan,
    IconDeposit,
    IconWaves,
]

function IconShield() {
    return (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3l7 3v5.2c0 4.3-2.9 8.2-7 9.4-4.1-1.2-7-5.1-7-9.4V6l7-3Z" stroke="var(--brand)" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M8.8 12.2l2.3 2.3 4.3-4.4" stroke="var(--brand)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function IconVan() {
    return (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M2 15V9.5A1.5 1.5 0 0 1 3.5 8H14l4 3.5h2.5A1.5 1.5 0 0 1 22 13v2h-2.2M9.8 15H7.2M2 15h1.2" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="5.6" cy="16.4" r="1.9" stroke="var(--brand)" strokeWidth="1.5" />
            <circle cx="17.6" cy="16.4" r="1.9" stroke="var(--brand)" strokeWidth="1.5" />
        </svg>
    )
}

function IconDeposit() {
    return (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="var(--brand)" strokeWidth="1.5" />
            <path d="M15.5 8.5l-7 7" stroke="var(--brand)" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="9.5" cy="9.5" r="1.4" stroke="var(--brand)" strokeWidth="1.4" />
            <circle cx="14.5" cy="14.5" r="1.4" stroke="var(--brand)" strokeWidth="1.4" />
        </svg>
    )
}

function IconWaves() {
    return (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M2 8.5c1.7 0 1.7 1.6 3.3 1.6S7 8.5 8.7 8.5s1.7 1.6 3.3 1.6 1.7-1.6 3.3-1.6 1.7 1.6 3.4 1.6S20.3 8.5 22 8.5M2 13.4c1.7 0 1.7 1.6 3.3 1.6s1.7-1.6 3.4-1.6 1.7 1.6 3.3 1.6 1.7-1.6 3.3-1.6 1.7 1.6 3.4 1.6 1.6-1.6 3.3-1.6" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    )
}

function IconPlay() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="var(--brand)" />
        </svg>
    )
}

export function About({ data, locale }: { data: PropertyData; locale: Locale }) {
    const { facts, about } = data
    const [showVideo, setShowVideo] = useState(false)

    const videoLabel = locale === 'vi' ? 'Xem video giới thiệu' : 'Watch video'
    const moreLabel = locale === 'vi' ? 'Khám phá thêm về resort' : 'Learn more'

    return (
        <>
            {/* ---------- DẢI CAM KẾT ---------- */}
            <section className="bg-surface-raised px-4 pt-[22px] min-[960px]:px-6 min-[960px]:pt-[34px]">
                {/* Mobile: thẻ trắng có viền + bóng. Desktop: bỏ viền/bóng, bốn
                    cột ngăn bằng vạch dọc trên từng ô. */}
                <div className="mx-auto grid max-w-[var(--container)] grid-cols-2 gap-x-0 gap-y-1 rounded-md border border-border-default bg-surface-raised px-[6px] py-3 shadow-1 min-[960px]:grid-cols-4 min-[960px]:border-none min-[960px]:px-0 min-[960px]:py-2 min-[960px]:shadow-none">
                    {facts.slice(0, 4).map((fact, idx) => {
                        const Icon = USP_ICONS[idx % USP_ICONS.length] ?? IconShield
                        return (
                            <div
                                key={fact.label.en}
                                className={[
                                    'grid justify-items-center gap-[7px] px-2 py-3 text-center',
                                    'min-[960px]:grid-cols-[auto_1fr] min-[960px]:items-center min-[960px]:justify-items-start',
                                    'min-[960px]:gap-3 min-[960px]:px-[26px] min-[960px]:py-[10px] min-[960px]:text-left',
                                    'min-[960px]:border-r min-[960px]:border-border-default min-[960px]:last:border-r-0',
                                ].join(' ')}
                            >
                                <Icon />
                                <div>
                                    <div className="text-[13px] leading-[1.35] font-bold text-text-primary min-[960px]:text-[14.5px]">
                                        {fact.value}
                                    </div>
                                    <div className="mt-[2px] text-[12px] leading-[1.45] text-text-secondary">
                                        {pick(fact.label, locale)}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* ---------- GIỚI THIỆU ---------- */}
            <section
                id="about"
                className="bg-surface-raised px-4 pt-[40px] pb-2 [scroll-margin-top:80px] min-[960px]:px-6 min-[960px]:pt-[56px] min-[960px]:pb-3"
            >
                <div className="mx-auto grid max-w-[var(--container)] items-center gap-[26px] min-[960px]:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)] min-[960px]:gap-[52px]">
                    <div className="relative min-h-[220px] min-[960px]:min-h-[340px]">
                        {showVideo ? (
                            <div className="absolute inset-0 h-full w-full overflow-hidden rounded-md bg-[var(--surface-inverse)]">
                                <video controls autoPlay playsInline className="h-full w-full object-cover">
                                    <source src="/video/8102936365457.mp4" type="video/mp4" />
                                </video>
                            </div>
                        ) : (
                            <>
                                <ImageSlot
                                    placeholder={locale === 'vi' ? 'Toàn cảnh resort' : 'Resort overview'}
                                    src="/uploads/hero-1.jpg"
                                    height="100%"
                                    style={{ borderRadius: 'var(--radius)' }}
                                />
                                <button
                                    type="button"
                                    className={[
                                        'absolute bottom-[14px] left-[14px] inline-flex items-center gap-[9px]',
                                        'rounded-full border-none py-[9px] pr-3 pl-[9px]',
                                        // Nền trắng mờ 94% + blur để chữ đọc được
                                        // trên ảnh. Lấy alpha từ token surface,
                                        // không viết rgba thô (luật D0).
                                        'bg-surface-raised/94 [backdrop-filter:blur(6px)]',
                                        'font-[inherit] text-[13px] font-semibold text-text-primary',
                                        'cursor-pointer shadow-2',
                                        'transition-[background,transform] duration-200 ease-out',
                                        'hover:bg-surface-raised active:translate-y-px',
                                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                                    ].join(' ')}
                                    aria-label={videoLabel}
                                    onClick={() => setShowVideo(true)}
                                >
                                    <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-[var(--surface-tint)]">
                                        <IconPlay />
                                    </span>
                                    {videoLabel}
                                </button>
                            </>
                        )}
                    </div>

                    <div>
                        <p className="mt-0 mb-[10px] text-[12px] font-bold tracking-[0.09em] text-brand uppercase">
                            {pick(about.kicker, locale)}
                        </p>

                        <h2 className="mt-0 mb-3 font-display text-[clamp(1.6rem,4.4vw,2.1rem)] leading-[1.22] font-semibold text-balance text-text-primary">
                            {pick(about.title, locale)}
                        </h2>

                        {about.body.map((paragraph) => (
                            <p
                                key={paragraph.en}
                                className="mt-0 mb-3 text-base leading-[1.78] text-pretty text-text-secondary"
                            >
                                {pick(paragraph, locale)}
                            </p>
                        ))}

                        <ul className="mt-[22px] mb-3 grid list-none grid-cols-2 gap-3 p-0 min-[960px]:gap-x-[22px] min-[960px]:gap-y-4">
                            {about.services.slice(0, 4).map((service) => (
                                <li
                                    key={service.en}
                                    className="flex items-center gap-2 text-[13px] leading-[1.4] font-semibold text-text-primary"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <circle cx="12" cy="12" r="9" stroke="var(--brand)" strokeWidth="1.5" />
                                        <path d="M8.2 12.3l2.5 2.5 5.1-5.2" stroke="var(--brand)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {pick(service, locale)}
                                </li>
                            ))}
                        </ul>

                        <a
                            href="#rooms"
                            className={[
                                'inline-flex items-center gap-2 rounded-sm px-[22px] py-3',
                                'border border-[var(--border-strong)] bg-surface-raised',
                                'text-[14px] font-semibold text-text-primary no-underline',
                                'transition-[border-color,background] duration-200 ease-out',
                                'hover:border-brand hover:bg-[var(--surface-tint)]',
                                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                            ].join(' ')}
                        >
                            {moreLabel}
                            <span aria-hidden="true">→</span>
                        </a>
                    </div>
                </div>
            </section>
        </>
    )
}
