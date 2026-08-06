'use client'

import { useState, type FormEvent } from 'react'
import { pick, telHref, UI, type Locale, type PropertyData } from '@repo/core'
import { siteFooterPropsOf, siteHeaderPropsOf } from '@repo/domain-hotel'
import { SiteFooter, SiteHeader } from '@repo/ui-layout'
import { CheckCircle, Clock, Mail, MapPin, MessageCircle, Navigation, Send } from 'lucide-react'

import { meta } from '../meta'
import { H3 } from '../strings'

/**
 * Trang liên hệ — BẢN RIÊNG CỦA MẪU 03.
 *
 * VÌ SAO KHÔNG DÙNG `ContactPage` CỦA `@repo/domain-hotel`: bản dùng chung port
 * từ prototype (hero ảnh 380px, lưới `1fr / 380px`, dải hỏi đáp ở cuối). Mẫu 03
 * lấy bố cục của app resort — mở bằng dải nền trắng có badge trạng thái, lưới
 * 12 cột `7 / 5`, cột phải là thẻ navy đặc + hướng dẫn ba chặng, đóng bằng bản
 * đồ nhúng. Khác nhau ở HÌNH THỨC nên nó thuộc về theme (luật R4); bản dùng
 * chung vẫn nguyên vẹn cho h1/h2.
 *
 * BIỂU MẪU CỐ Ý KHÔNG GỬI ĐI ĐÂU — đây là bản demo. Nút bấm hiện thông báo
 * thành công tại chỗ để trạng thái `sent` và vùng `aria-live` vẫn kiểm chứng
 * được (luật D3/D4).
 *
 * SỐ ĐIỆN THOẠI VÀ ĐỊA CHỈ ĐỌC TỪ `data.brand` chứ không viết cứng như bản
 * resort: theme không được giữ bản sao dữ liệu (luật R8). Đổi số một chỗ trong
 * `core` là cả N mẫu đổi theo.
 *
 * `slug` mặc định về `meta.slug` vì registry hiện không truyền nó xuống.
 */

export interface ContactPageProps {
    data: PropertyData
    locale: Locale
    slug?: string
    extra?: React.ReactNode
}

export function ContactPage({ data, locale, slug = meta.slug, extra }: ContactPageProps) {
    const { brand } = data
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        setSubmitted(true)
    }

    const phoneDigits = brand.phone.replace(/\s/g, '')

    return (
        <div data-theme="h3" className="font-primary overflow-x-clip">
            <SiteHeader {...siteHeaderPropsOf(data, locale, slug)} extra={extra} />

            <main className="bg-surface-base text-text-primary min-h-screen pt-[80px] pb-[80px]">
                {/* Dải mở đầu */}
                <section className="bg-surface-raised border-border-muted border-b px-[16px] py-[48px] sm:px-[24px] lg:px-[32px]">
                    <div className="mx-auto max-w-[var(--container)] space-y-[12px]">
                        <div className="text-brand inline-flex items-center gap-[8px] rounded-full bg-[var(--surface-tint)] px-[12px] py-[4px] text-[12px] font-semibold">
                            <span className="bg-[var(--success)] h-[8px] w-[8px] animate-pulse rounded-full" />
                            <span>{pick(UI.n247ReceptionSupport, locale)}</span>
                        </div>

                        <h1 className="font-display text-[30px] font-bold tracking-tight text-[var(--brand-dark)] sm:text-[36px] lg:text-[48px]">
                            {pick(UI.contactReservations, locale)}
                        </h1>

                        <p className="max-w-[672px] text-[14px] leading-relaxed text-[var(--text-muted)] sm:text-[16px]">
                            {pick(UI.sendARequestOrMessageOn, locale)}
                        </p>
                    </div>
                </section>

                {/* Lưới nội dung chính */}
                <section className="mx-auto max-w-[var(--container)] px-[16px] py-[40px] sm:px-[24px] lg:px-[32px]">
                    <div className="grid grid-cols-1 items-start gap-[32px] lg:grid-cols-12">
                        {/* Trái: biểu mẫu yêu cầu đặt phòng nhanh (7 cột) */}
                        <div className="bg-surface-raised border-border-muted space-y-[24px] rounded-[12px] border p-[24px] shadow-1 sm:p-[32px] lg:col-span-7">
                            <div>
                                <h2 className="font-display text-[20px] font-bold text-[var(--brand-dark)]">
                                    {pick(UI.quickReservationRequest, locale)}
                                </h2>
                                <p className="mt-[4px] text-[12px] text-[var(--text-soft)]">
                                    {pick(UI.ourReceptionistWillConfirmYourInquiry, locale)}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-[16px] text-[12px]">
                                <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
                                    <Field label={pick(UI.fullName, locale)}>
                                        <input
                                            required
                                            type="text"
                                            placeholder={pick(UI.enterFullName, locale)}
                                            className={inputClass}
                                        />
                                    </Field>

                                    <Field label={pick(UI.phoneZaloNumber, locale)}>
                                        <input
                                            required
                                            type="tel"
                                            placeholder={brand.phone}
                                            className={inputClass}
                                        />
                                    </Field>
                                </div>

                                <Field label="Email">
                                    <input
                                        type="email"
                                        placeholder="email@example.com"
                                        className={inputClass}
                                    />
                                </Field>

                                <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
                                    <Field label={pick(UI.checkInDate, locale)}>
                                        <input type="date" className={inputClass} />
                                    </Field>

                                    <Field label={pick(UI.checkOutDate, locale)}>
                                        <input type="date" className={inputClass} />
                                    </Field>
                                </div>

                                <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
                                    <Field label={pick(UI.numberOfGuests, locale)}>
                                        <select className={inputClass}>
                                            {[UI.n2Guests, UI.n3Guests, UI.n4Guests, UI.n6Guests, UI.n8Guests].map(
                                                (option, i) => (
                                                    <option key={i}>{pick(option, locale)}</option>
                                                ),
                                            )}
                                        </select>
                                    </Field>

                                    {/*
                                     * Danh sách hạng phòng lấy từ `data.rooms`
                                     * chứ không liệt kê cứng như bản resort —
                                     * biên tập thêm hạng mới trong CMS là ô này
                                     * tự có (luật R8).
                                     */}
                                    <Field label={pick(UI.preferredRoom, locale)}>
                                        <select className={inputClass}>
                                            <option>{pick(UI.needRecommendation, locale)}</option>
                                            {data.rooms.map((room) => (
                                                <option key={room.id}>{pick(room.name, locale)}</option>
                                            ))}
                                        </select>
                                    </Field>
                                </div>

                                <Field label={pick(UI.messageOrSpecialRequests, locale)}>
                                    <textarea
                                        rows={3}
                                        placeholder={pick(UI.eGNeedPierPickUp, locale)}
                                        className={`${inputClass} resize-none`}
                                    />
                                </Field>

                                {/* Báo kết quả bằng CHỮ, không chỉ đổi màu (luật D3) */}
                                <div aria-live="polite">
                                    {submitted && (
                                        <div className="bg-[var(--color-success-bg)] border-[var(--success)] text-[var(--success)] flex items-center gap-[8px] rounded-[8px] border p-[12px] text-[12px] font-medium">
                                            <CheckCircle
                                                className="h-[16px] w-[16px] shrink-0"
                                                aria-hidden="true"
                                            />
                                            <span>
                                                {pick(UI.requestSentReceptionistWillMessageYou, locale)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-[12px] pt-[8px] sm:flex-row">
                                    <button
                                        type="submit"
                                        className={`${buttonBaseClass} bg-brand text-text-inverse hover:bg-[var(--brand-mid)] flex-1 shadow-1 hover:shadow-2`}
                                    >
                                        <Send className="mr-[6px] h-[16px] w-[16px]" aria-hidden="true" />
                                        {pick(UI.submitRequest, locale)}
                                    </button>

                                    <a
                                        href={`https://zalo.me/${phoneDigits}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`${buttonBaseClass} bg-surface-raised text-brand border-[var(--brand)] hover:bg-[var(--surface-hover)] flex-1 border no-underline`}
                                    >
                                        <MessageCircle
                                            className="mr-[6px] h-[16px] w-[16px]"
                                            aria-hidden="true"
                                        />
                                        {pick(UI.messageOnZalo, locale)}
                                    </a>
                                </div>
                            </form>
                        </div>

                        {/* Phải: thông tin liên hệ + hướng dẫn đường đi (5 cột) */}
                        <div className="space-y-[16px] lg:col-span-5">
                            {/* Thẻ liên hệ trực tiếp */}
                            <div className="bg-[var(--surface-inverse)] text-text-inverse space-y-[20px] rounded-[12px] p-[24px] shadow-1">
                                <div className="space-y-[4px]">
                                    <span className="text-accent text-[11px] font-bold tracking-wider uppercase">
                                        {pick(UI.reservationHotline, locale)}
                                    </span>
                                    <a
                                        href={telHref(brand.phone)}
                                        className="text-text-inverse hover:text-accent font-display block text-[30px] font-bold tracking-tight no-underline transition"
                                    >
                                        {brand.phone}
                                    </a>
                                    <p className="text-[12px] text-[rgb(255_255_255/0.7)]">
                                        {pick(UI.zaloWhatsappAvailable247Service, locale)}
                                    </p>
                                </div>

                                <div className="space-y-[16px] border-t border-[rgb(255_255_255/0.1)] pt-[16px] text-[12px]">
                                    <InfoRow
                                        icon={<MapPin className="text-accent mt-[2px] h-[16px] w-[16px] shrink-0" />}
                                        title={pick(UI.resortAddress, locale)}
                                    >
                                        <span className="leading-relaxed text-[rgb(255_255_255/0.8)]">
                                            {pick(brand.address, locale)}
                                        </span>
                                    </InfoRow>

                                    <InfoRow
                                        icon={<Mail className="text-accent mt-[2px] h-[16px] w-[16px] shrink-0" />}
                                        title="Email:"
                                    >
                                        <a
                                            href={`mailto:${brand.email}`}
                                            className="text-[rgb(255_255_255/0.8)] no-underline transition hover:text-[var(--text-inverse)]"
                                        >
                                            {brand.email}
                                        </a>
                                    </InfoRow>

                                    <InfoRow
                                        icon={<Clock className="text-accent mt-[2px] h-[16px] w-[16px] shrink-0" />}
                                        title={pick(UI.receptionHours, locale)}
                                    >
                                        <span className="text-[rgb(255_255_255/0.8)]">
                                            {pick(UI.checkIn1400CheckOut, locale)}
                                        </span>
                                    </InfoRow>
                                </div>
                            </div>

                            {/* Thẻ hướng dẫn đường đi */}
                            <div className="bg-surface-raised border-border-muted space-y-[12px] rounded-[12px] border p-[20px] shadow-1">
                                <h3 className="font-display flex items-center gap-[6px] text-[14px] font-bold text-[var(--brand-dark)]">
                                    <Navigation className="text-brand h-[16px] w-[16px]" aria-hidden="true" />
                                    <span>{pick(UI.gettingToNamDuIsland, locale)}</span>
                                </h3>

                                <div className="space-y-[12px] text-[12px]">
                                    <TravelStep
                                        step="1"
                                        title={pick(UI.hcmcRachGia, locale)}
                                        note={pick(UI.overnightSleeperCoachApprox7Hours, locale)}
                                    />
                                    <TravelStep
                                        step="2"
                                        title={pick(UI.rachGiaCuTronPier, locale)}
                                        note={pick(UI.speedboatSuperdongPhuQuocExpress2, locale)}
                                    />
                                    {/* Chặng cuối tô xanh thành công: đây là lúc khách đã tới nơi */}
                                    <TravelStep
                                        step="3"
                                        title={pick(UI.pierTheNamDuHill, locale)}
                                        note={pick(UI.resortCarPicksYouUpAt, locale)}
                                        done
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bản đồ */}
                <section className="mx-auto max-w-[var(--container)] px-[16px] pb-[48px] sm:px-[24px] lg:px-[32px]">
                    <div className="bg-surface-raised border-border-muted relative overflow-hidden rounded-[12px] border shadow-1">
                        <div className="bg-[var(--border)] relative h-[360px] w-full">
                            <iframe
                                title={pick(H3.mapTitle, locale)}
                                src="https://www.openstreetmap.org/export/embed.html?bbox=104.28%2C9.64%2C104.42%2C9.72&amp;layer=mapnik&amp;marker=9.6835%2C104.3595"
                                className="h-full w-full border-0"
                                loading="lazy"
                            />

                            {/* Thẻ vị trí nổi trên bản đồ */}
                            <div className="border-border-muted absolute bottom-[16px] left-[16px] max-w-[300px] space-y-[6px] rounded-[10px] border bg-[rgb(255_255_255/0.95)] p-[16px] text-[12px] shadow-2 backdrop-blur-md">
                                <h4 className="font-display text-[14px] font-bold text-[var(--brand-dark)]">
                                    {brand.name} {brand.suffix}
                                </h4>
                                <p className="text-[var(--text-soft)]">{pick(brand.address, locale)}</p>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                        `${brand.name} ${brand.suffix}`,
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-brand inline-block pt-[4px] font-semibold no-underline hover:underline"
                                >
                                    {pick(UI.openInGoogleMaps, locale)}
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter {...siteFooterPropsOf(data, locale, slug)} />
        </div>
    )
}

// ================================================================= mảnh nhỏ

/** Nhãn + ô nhập. `<label>` bọc ngoài nên click nhãn là focus vào ô (luật D4). */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block space-y-[4px]">
            <span className="text-text-primary block font-semibold">{label}</span>
            {children}
        </label>
    )
}

function InfoRow({
    icon,
    title,
    children,
}: {
    icon: React.ReactNode
    title: string
    children: React.ReactNode
}) {
    return (
        <div className="flex items-start gap-[12px]">
            {icon}
            <div>
                <span className="text-text-inverse block font-semibold">{title}</span>
                {children}
            </div>
        </div>
    )
}

function TravelStep({
    step,
    title,
    note,
    done = false,
}: {
    step: string
    title: string
    note: string
    done?: boolean
}) {
    return (
        <div className="flex items-start gap-[12px]">
            <span
                className={`flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    done
                        ? 'bg-[var(--color-success-bg)] text-[var(--success)]'
                        : 'text-brand bg-[var(--surface-tint)]'
                }`}
            >
                {step}
            </span>
            <div>
                <span
                    className={`block font-bold ${done ? 'text-[var(--success)]' : 'text-text-primary'}`}
                >
                    {title}
                </span>
                <span
                    className={done ? 'font-medium text-[var(--success)]' : 'text-[var(--text-soft)]'}
                >
                    {note}
                </span>
            </div>
        </div>
    )
}

// ==================================================================== style

/** Ô nhập của bản resort: viền 1px, bo 6px, ngang 14px, dọc 10px, chữ 12px. */
const inputClass =
    'border-border-default text-text-primary focus:border-[var(--brand)] w-full rounded-[6px] border bg-[var(--surface)] px-[14px] py-[10px] font-primary text-[12px] focus:outline-none'

/** `<Button size="md" radius="6px">` của app resort: cao 42px, chữ 14px. */
const buttonBaseClass =
    'inline-flex h-[42px] cursor-pointer items-center justify-center rounded-[6px] border-none px-[20px] py-[12px] font-primary text-[14px] font-semibold whitespace-nowrap transition-all duration-200 active:scale-[0.98]'
