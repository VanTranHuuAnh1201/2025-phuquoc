'use client'

import { useState } from 'react'
import { formatPrice, pick, telHref, type Locale, type PropertyData } from '@repo/core'
import { useScrolled } from '@repo/ui'

import { ui } from '../strings'
import { IconCheck, IconClose, IconPhone, IconShuttle, IconWave } from '../components/icons'
import { SearchFields, submitHref } from '../components/SearchWidget'
import { useStaySearch } from '../components/search'

/**
 * Section `top` — spec v4 §4.3 + §4.4, dựng theo trục dọc "quầy lễ tân":
 *
 *   ảnh 85vh, nội dung CĂN GIỮA        ← thiện cảm + định danh chính chủ
 *   thanh tìm phòng MỘT HÀNG NGANG     ← vắt qua mép ảnh, nửa trên ảnh nửa
 *   dải cát: trust note + 4 mục trust  ←   trên dải cát — điểm neo thị giác
 *
 * Khác các mẫu trước: không dồn nội dung vào góc trái, không widget dạng thẻ
 * đứng. Search bar ngang + chip chính chủ là ngôn ngữ của site booking thật.
 *
 * Mobile (K7): bar ẩn, MỘT nút vàng mở bottom-sheet; sticky bottom bar hiện
 * sau khi cuộn qua hero.
 *
 * Ngưỡng 900px là breakpoint riêng của mẫu (không nằm trong thang mặc định của
 * Tailwind) nên mọi chỗ đổi bố cục desktop/mobile viết bằng arbitrary variant
 * `min-[900px]:` / `max-[899px]:`.
 *
 * Khi kiểm CSS bundle đừng grep `max-width` — Tailwind v4 sinh `max-[…]` thành
 * `@media not all and (min-width:…)`, không phải `@media (max-width:…)`.
 */

export function Hero({ data, locale }: { data: PropertyData; locale: Locale }) {
    const t = ui(locale)
    const [search, setSearch] = useStaySearch()
    const [sheetOpen, setSheetOpen] = useState(false)
    const scrolled = useScrolled(480)

    const heroImage = data.hero.images?.[0] ?? '/hero-1.jpg'
    const cheapest = data.rooms.reduce(
        (min, room) => Math.min(min, room.price),
        Number.POSITIVE_INFINITY,
    )
    const findHref = submitHref(search, locale)

    const trustItems = [
        {
            icon: <IconCheck size={20} />,
            content: (
                <>
                    <strong className="text-text-primary">{data.brand.name}</strong>
                    {' · '}
                    {pick(data.brand.address, locale)}
                </>
            ),
        },
        {
            icon: <IconPhone size={20} />,
            content: (
                <>
                    {t.trustHotline}{' '}
                    <a
                        href={telHref(data.brand.phone)}
                        className="h6-link [font-variant-numeric:tabular-nums]"
                    >
                        {data.brand.phone}
                    </a>
                </>
            ),
        },
        { icon: <IconShuttle size={20} />, content: t.trustShuttle },
        { icon: <IconWave size={20} />, content: t.weatherLine },
    ]

    return (
        <section id="top">
            {/* ---- ảnh hero, nội dung căn giữa ---- */}
            <div className="relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={heroImage}
                    alt={
                        locale === 'vi'
                            ? 'Toàn cảnh The Nam Du Hill Resort trên đồi hướng biển'
                            : 'The Nam Du Hill Resort on the hillside facing the sea'
                    }
                    fetchPriority="high"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                {/* Scrim nhẹ để chữ giữa ảnh đọc được — KHÔNG kéo tối cả khung
                    (spec: xoá cảm giác u buồn). Gradient 3 điểm dừng nên phải
                    viết arbitrary; các màu đều là rgba của token nền tối. */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,34,44,0.30)_0%,rgba(20,34,44,0.16)_45%,rgba(20,34,44,0.42)_100%)]"
                />

                <div className="h6-container relative flex min-h-[88vh] flex-col items-center justify-center pt-[88px] pb-7 text-center text-text-inverse min-[900px]:min-h-[85vh]">
                    <p className="h6-kicker mt-0 mb-3 text-text-inverse opacity-92">
                        {pick(data.hero.kicker, locale)}
                    </p>

                    <h1 className="h6-display mt-0 mb-4 max-w-[20ch] text-2xl min-[900px]:text-4xl">
                        {t.heroTitle}
                    </h1>

                    {/* Chip chính chủ — trả lời "web thật hay giả" ngay giữa
                        viewport đầu (spec §4.1 câu 1). */}
                    <p className="m-0 inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full bg-surface-raised px-5 py-[10px] text-sm font-medium text-text-primary shadow-1">
                        <span aria-hidden="true" className="inline-flex text-brand">
                            <IconCheck size={16} />
                        </span>
                        <span>{t.identityPrefix}</span>
                        <a
                            href={telHref(data.brand.phone)}
                            className="h6-link inline-flex min-h-[24px] items-center font-bold [font-variant-numeric:tabular-nums]"
                        >
                            {data.brand.phone}
                        </a>
                    </p>

                    {/* Mobile: một nút vàng mở bottom-sheet. */}
                    <button
                        type="button"
                        className="h6-btn h6-btn-primary mt-5 w-full max-w-[360px] min-[900px]:hidden"
                        onClick={() => setSheetOpen(true)}
                    >
                        {t.searchSheetOpen}
                    </button>
                </div>
            </div>

            {/* ---- dải cát: booking bar vắt lên ảnh + trust strip (spec §4.4) ---- */}
            <div className="bg-[var(--color-surface-sand)]">
                <div className="h6-container">
                    {/* Bar ẩn trên mobile; ≥900px vắt qua mép ảnh (`-mt-[52px]`):
                        nửa trên ảnh, nửa trên dải cát. */}
                    <div className="relative z-2 hidden flex-wrap items-end gap-3 rounded-lg bg-surface-raised px-4 pt-3 pb-4 shadow-2 min-[900px]:-mt-[52px] min-[900px]:flex">
                        <div className="min-w-0 flex-1">
                            <SearchFields locale={locale} value={search} onChange={setSearch} columns />
                        </div>
                        <a
                            className="h6-btn h6-btn-primary min-w-[220px] shrink-0"
                            href={findHref}
                        >
                            {t.ctaMain}
                        </a>
                    </div>

                    {/* Dòng trust dưới bar (spec §4.3) — trả lời nỗi sợ cọc/tàu
                        ngay tại điểm bấm. Ẩn cùng bar trên mobile. */}
                    <p className="mt-3 mb-0 hidden text-center text-sm text-text-secondary min-[900px]:block">
                        {t.heroTrustNote}
                    </p>

                    {/* 4 mục trust — chính chủ · hotline · đưa đón · tàu hoãn. */}
                    <ul className="m-0 grid list-none grid-cols-1 gap-x-0 gap-y-3 px-0 pt-4 pb-5 sm:grid-cols-2 min-[1080px]:grid-cols-4">
                        {trustItems.map((item, i) => (
                            <li
                                key={i}
                                className={[
                                    'flex items-start gap-[10px] px-0 text-sm text-text-secondary min-[900px]:px-4',
                                    // ≥1080px các mục nằm cùng hàng nên kẻ dọc ngăn cách.
                                    i > 0 ? 'min-[1080px]:border-l min-[1080px]:border-border-default' : '',
                                ].join(' ')}
                            >
                                <span aria-hidden="true" className="mt-px text-brand">
                                    {item.icon}
                                </span>
                                <span>{item.content}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* ---- bottom-sheet tìm phòng (mobile) ---- */}
            {sheetOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={t.searchSheetOpen}
                    className="fixed inset-0 z-80"
                >
                    <button
                        type="button"
                        aria-label={t.close}
                        onClick={() => setSheetOpen(false)}
                        className="absolute inset-0 cursor-pointer border-none bg-[var(--overlay-scrim)]"
                    />
                    <div className="absolute right-0 bottom-0 left-0 max-h-[85vh] overflow-y-auto rounded-t-xl bg-surface-raised px-4 pt-4 pb-[calc(var(--space-4)+env(safe-area-inset-bottom,0px))]">
                        <div className="mb-3 flex items-center justify-between">
                            <span className="h6-display text-xl">{t.searchSheetOpen}</span>
                            <button
                                type="button"
                                onClick={() => setSheetOpen(false)}
                                aria-label={t.close}
                                className="grid h-[40px] w-[40px] cursor-pointer place-items-center border-none bg-transparent text-text-secondary"
                            >
                                <IconClose size={22} />
                            </button>
                        </div>
                        <div className="grid gap-3">
                            <SearchFields locale={locale} value={search} onChange={setSearch} />
                            <a className="h6-btn h6-btn-primary w-full" href={findHref}>
                                {t.ctaMain}
                            </a>
                            <p className="m-0 text-center text-sm text-text-secondary">
                                {t.heroTrustNote}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ---- sticky bottom bar mobile — chỉ hiện dưới 900px ---- */}
            {Number.isFinite(cheapest) && scrolled && (
                <div className="fixed right-0 bottom-0 left-0 z-50 hidden items-center justify-between gap-3 border-t border-border-muted bg-surface-raised px-4 pt-[10px] pb-[calc(10px+env(safe-area-inset-bottom,0px))] shadow-[0_-8px_24px_rgba(33,50,60,0.1)] max-[899px]:flex">
                    <span className="text-sm text-text-secondary">
                        {t.stickyFrom}{' '}
                        <strong className="text-base text-text-primary [font-variant-numeric:tabular-nums]">
                            {formatPrice(cheapest, locale)}
                        </strong>
                        {t.stickyPerNight}
                    </span>
                    <a className="h6-btn h6-btn-primary min-h-[44px] shrink-0" href={findHref}>
                        {t.stickyFind}
                    </a>
                </div>
            )}
        </section>
    )
}
