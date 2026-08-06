'use client'

import { useState } from 'react'
import {
    ArrowLeft,
    Calendar,
    CheckCircle,
    Users,
} from 'lucide-react'
import {
    formatPrice,
    pick,
    themePath,
    themeRoot,
    UI,
    type Locale,
    type PropertyData,
} from '@repo/core'
import { siteFooterPropsOf, siteHeaderPropsOf } from '@repo/domain-hotel'
import { SiteFooter, SiteHeader } from '@repo/ui-layout'

import { meta } from '../meta'
import { H3 } from '../strings'

/**
 * Trang thanh toán — BẢN RIÊNG CỦA MẪU 03.
 *
 * VÌ SAO KHÔNG DÙNG `CheckoutPage` CỦA `@repo/domain-hotel`: bản chung là một
 * trang DÀI, lưới `1fr / 400px` với ba khối đánh số bên trái và thẻ đơn hàng
 * dính bên phải — bố cục desktop. Mẫu 03 kế thừa luồng của app resort: ba BƯỚC
 * nối tiếp trong một cột hẹp 800px, thanh tổng tiền dính đáy màn hình, và một
 * màn thành công có mã đơn. Đây là luồng thiết kế mobile-first, khác hẳn về
 * cấu trúc điều hướng chứ không chỉ khác token — nên mẫu giữ bản riêng
 * (luật R4). Bản domain vẫn nguyên cho các mẫu khác.
 *
 * ⚠️ NGUỒN DỮ LIỆU ĐÃ ĐỔI, GIAO DIỆN THÌ KHÔNG. Bản resort đọc phòng từ
 * `localStorage`/store của app và ghi đơn vào `localStorage`. Theme không được
 * chạm tầng dữ liệu (luật R13), nên ở đây:
 *   - phòng vào qua `roomId` (route đọc từ `?room=`), khớp chữ ký bản domain;
 *   - `bikeRate`, `depositPercent`, `bookingCode` vào qua prop — không hằng số
 *     nghiệp vụ nằm trong theme;
 *   - `onComplete` để nơi gọi tự quyết định lưu đơn ở đâu. Không truyền thì
 *     trang chỉ chuyển sang bước 3, đúng tinh thần bản demo.
 *
 * ⚠️ BẢN DEMO: nút xác nhận không tạo đơn thật, không gọi cổng thanh toán nào
 * (xem `.claude/rules/app-flows.md` §F2).
 *
 * ⚠️ SỐ TRONG CLASS SPACING KHÔNG PHẢI PIXEL (p-4 = 24px, p-6 = 64px). Khoảng
 * cách chép từ bản resort viết ngoặc vuông theo px gốc.
 */

export interface CheckoutPageProps {
    data: PropertyData
    locale: Locale
    /**
     * Mẫu đang render. TUỲ CHỌN, mặc định `meta.slug`.
     *
     * VÌ SAO KHÔNG BẮT BUỘC: route dùng chung `[theme]/**` chỉ truyền
     * `data`/`locale` (+ `menu`/`searchParams` tuỳ trang) — nó KHÔNG đưa slug
     * xuống. Khai bắt buộc ở đây thì trang vỡ ngay khi cắm vào registry, mà
     * TypeScript không bắt được vì slot của registry dùng type rộng hơn.
     */
    slug?: string
    /** Id hạng phòng đang đặt. */
    roomId?: string
    /**
     * Tham số URL thô do route đưa xuống.
     *
     * VÌ SAO CẦN CẢ HAI: route `[theme]/checkout` truyền `searchParams` chứ
     * KHÔNG truyền `roomId` — nó không biết mẫu nào đọc tham số nào. Bản của
     * mẫu 02 cũng bóc `?room=` ra ngay tại chỗ. Giữ thêm `roomId` để nơi gọi
     * trực tiếp (app resort) khỏi phải dựng một object giả.
     */
    searchParams?: Record<string, string | string[] | undefined>
    /**
     * Phần trăm cọc phải trả ngay. Bản resort thu 50%; con số thật đến từ
     * `RatePlan.depositPercent` của core khi nối nghiệp vụ (booking-domain §B1).
     */
    depositPercent?: number
    /** Giá thuê xe máy một ngày. Nguồn thật là `Addon` của core. */
    bikeRate?: number
    /** Mã đơn hiển thị ở bước 3. Bản thật do backend cấp. */
    bookingCode?: string
    /** Ảnh QR chuyển khoản. Không truyền thì ô QR không render. */
    qrSrc?: string
    /** Gọi khi khách bấm xác nhận ở bước 2 — nơi gọi tự lưu đơn. */
    onComplete?: () => void
    extra?: React.ReactNode
}

type Step = 1 | 2 | 3
type PayMethod = 'qr' | 'momo' | 'cash'

export function CheckoutPage({
    data,
    locale,
    slug = meta.slug,
    roomId,
    searchParams,
    depositPercent = 50,
    bikeRate = 150000,
    bookingCode = '#NDH123456',
    qrSrc,
    onComplete,
    extra,
}: CheckoutPageProps) {
    // `roomId` tường minh thắng; không có thì bóc `?room=` từ tham số URL.
    const queryRoom = typeof searchParams?.room === 'string' ? searchParams.room : undefined
    const wantedRoomId = roomId ?? queryRoom
    const room = data.rooms.find((r) => r.id === wantedRoomId) ?? data.rooms[0]

    const [step, setStep] = useState<Step>(1)
    const [ci, setCi] = useState('')
    const [co, setCo] = useState('')
    const [bikes, setBikes] = useState(0)
    const [method, setMethod] = useState<PayMethod>('qr')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [notes, setNotes] = useState('')
    const [boat, setBoat] = useState('')

    if (!room) return null

    const guests = room.guests

    /** Số đêm giữa hai ngày đã chọn. Chưa chọn đủ thì mặc định 2 như bản gốc. */
    const nights = (() => {
        if (!ci || !co) return 2
        const days = (new Date(co).getTime() - new Date(ci).getTime()) / 86_400_000
        return days > 0 ? Math.round(days) : 2
    })()

    const totalAmount = room.price * nights + bikes * bikeRate * nights
    const depositAmount = Math.round((totalAmount * depositPercent) / 100)

    const phoneLast4 = phone.replace(/\D/g, '').slice(-4)
    const refCode = `NAMDU ${room.id.toUpperCase()} ${nights}D${phoneLast4 ? ` ${phoneLast4}` : ''}`

    const dateLabel = ci && co ? `${dmy(ci)} – ${dmy(co)}` : '—'

    const advance = () => {
        if (step === 1) setStep(2)
        else {
            onComplete?.()
            setStep(3)
        }
        if (typeof window !== 'undefined') window.scrollTo(0, 0)
    }

    return (
        <div data-theme={meta.slug} className="font-primary overflow-x-clip">
            <SiteHeader
                {...siteHeaderPropsOf(data, locale, slug)}
                currentHref={themePath(slug, 'checkout')}
                extra={extra}
                // Luồng thanh toán: thay nav bằng một badge để khách không bỏ
                // dở giữa chừng vì bấm nhầm sang trang khác (luật P10).
                focusBadge={pick(UI.bookingDetails, locale)}
            />

            <main className="min-h-screen bg-[var(--surface-alt)] pt-[56px] pb-[112px] text-[var(--text)]">
                {/* -------------------------------------- dải bước, dính đỉnh */}
                <div className="sticky top-[48px] z-30 border-b border-[var(--border-muted)] bg-[var(--surface)] px-[16px] py-[12px]">
                    <div className="mx-auto flex max-w-[var(--container)] items-center justify-between">
                        <button
                            type="button"
                            onClick={() => setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev))}
                            disabled={step === 1}
                            className="flex cursor-pointer items-center gap-[6px] border-none bg-transparent font-primary text-[12px] font-medium text-[var(--text-muted)] transition hover:text-[var(--brand-dark)] disabled:cursor-not-allowed disabled:text-[var(--text-faint)]"
                        >
                            <ArrowLeft className="h-[16px] w-[16px]" />
                            <span>{pick(UI.back, locale)}</span>
                        </button>

                        <ol className="m-0 flex list-none items-center gap-[8px] p-0 text-[12px] font-semibold text-[var(--brand-dark)]">
                            <StepLabel n={1} on={step === 1} label={pick(UI.details, locale)} />
                            <Sep />
                            <StepLabel n={2} on={step === 2} label={pick(UI.payment, locale)} />
                            <Sep />
                            <StepLabel n={3} on={step === 3} label={pick(UI.complete, locale)} />
                        </ol>
                    </div>
                </div>

                {/* Cột hẹp 800px — luồng thanh toán không cần bề rộng, mắt đi
                    thẳng từ trên xuống là xong (luật P4). */}
                <div className="mx-auto max-w-[800px] space-y-[16px] px-[16px] pt-[16px]">
                    {/* ============================== BƯỚC 1 — thông tin khách */}
                    {step === 1 && (
                        <div className="space-y-[16px]">
                            {/* tóm tắt phòng */}
                            <Card>
                                <h2 className="text-[12px] font-semibold tracking-wider text-[var(--text-soft)] uppercase">
                                    {pick(UI.bookingDetails, locale)}
                                </h2>

                                <div className="flex items-center gap-[12px]">
                                    <div className="h-[64px] w-[80px] shrink-0 overflow-hidden rounded-[8px] bg-[var(--surface-hover)]">
                                        {room.images?.[0] && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={room.images[0]}
                                                alt={pick(room.name, locale)}
                                                className="h-full w-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1 space-y-[4px]">
                                        <h3 className="truncate font-display text-[14px] font-bold text-[var(--brand-dark)] sm:text-[16px]">
                                            {pick(room.name, locale)}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-[12px] text-[12px] text-[var(--text-muted)]">
                                            <span className="flex items-center gap-[4px]">
                                                <Calendar className="h-[14px] w-[14px] text-[var(--brand)]" />
                                                <span>
                                                    {dateLabel} · {nights}{' '}
                                                    {pick(UI.nights, locale)}
                                                </span>
                                            </span>
                                            <span className="flex items-center gap-[4px]">
                                                <Users className="h-[14px] w-[14px] text-[var(--brand)]" />
                                                <span>
                                                    {guests} {pick(UI.adults, locale)}, 1{' '}
                                                    {pick(UI.room, locale)}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* liên hệ */}
                            <Card>
                                <div className="border-b border-[var(--border-muted)] pb-[8px]">
                                    <h2 className="font-display text-[16px] font-bold text-[var(--brand-dark)]">
                                        {pick(UI.contactInformation, locale)}
                                    </h2>
                                    <p className="text-[12px] text-[var(--text-soft)]">
                                        {pick(UI.weUseThisToArrangeYour, locale)}
                                    </p>
                                </div>

                                <div className="space-y-[12px] text-[12px]">
                                    <Field
                                        id="co-name"
                                        label={pick(UI.fullName, locale)}
                                        value={name}
                                        onChange={setName}
                                    />
                                    <Field
                                        id="co-phone"
                                        type="tel"
                                        label={pick(UI.phoneNumber, locale)}
                                        value={phone}
                                        onChange={setPhone}
                                        placeholder="09xx xxx xxx"
                                    />
                                    <Field
                                        id="co-email"
                                        type="email"
                                        label={pick(UI.email, locale)}
                                        value={email}
                                        onChange={setEmail}
                                        placeholder="ban@email.com"
                                    />

                                    {/* Ngày ở — bản resort điền sẵn ngày mẫu; ở đây
                                        để trống và nói rõ mặc định 2 đêm, vì điền
                                        sẵn một ngày cụ thể là bịa dữ liệu của khách. */}
                                    <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2">
                                        <Field
                                            id="co-in"
                                            type="date"
                                            label={pick(UI.checkIn, locale)}
                                            value={ci}
                                            onChange={setCi}
                                        />
                                        <Field
                                            id="co-out"
                                            type="date"
                                            label={pick(UI.checkOut, locale)}
                                            value={co}
                                            onChange={setCo}
                                        />
                                    </div>

                                    <div className="space-y-[4px]">
                                        <label
                                            htmlFor="co-note"
                                            className="block font-semibold text-[var(--text)]"
                                        >
                                            {pick(UI.specialRequestsOptional, locale)}
                                        </label>
                                        <textarea
                                            id="co-note"
                                            rows={2}
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder={pick(UI.enterSpecialRequests, locale)}
                                            className={`${INPUT} resize-none`}
                                        />
                                    </div>
                                </div>
                            </Card>

                            {/* đưa đón & xe máy */}
                            <Card>
                                <h2 className="font-display text-[14px] font-bold text-[var(--brand-dark)]">
                                    {pick(UI.pierTransferScooter, locale)}
                                </h2>

                                <div className="grid grid-cols-1 gap-[12px] text-[12px] sm:grid-cols-2">
                                    <div className="space-y-[4px]">
                                        <label
                                            htmlFor="co-boat"
                                            className="block font-semibold text-[var(--text)]"
                                        >
                                            {pick(UI.arrivingBoat, locale)}
                                        </label>
                                        <select
                                            id="co-boat"
                                            value={boat}
                                            onChange={(e) => setBoat(e.target.value)}
                                            className={INPUT}
                                        >
                                            <option value="">
                                                {pick(UI.notSureNotifyLater, locale)}
                                            </option>
                                            <option value="superdong">
                                                Superdong · 07:30 Rạch Giá
                                            </option>
                                            <option value="phuquoc_express">
                                                Phú Quốc Express · 08:00 Rạch Giá
                                            </option>
                                            <option value="ngoc_thanh">
                                                Ngọc Thành · 08:30 Rạch Giá
                                            </option>
                                        </select>
                                    </div>

                                    <div className="space-y-[4px]">
                                        <label
                                            htmlFor="co-bikes"
                                            className="block font-semibold text-[var(--text)]"
                                        >
                                            {pick(UI.scooterRental, locale)}
                                        </label>
                                        <select
                                            id="co-bikes"
                                            value={bikes}
                                            onChange={(e) => setBikes(Number(e.target.value) || 0)}
                                            className={INPUT}
                                        >
                                            <option value={0}>{pick(UI.noScooter, locale)}</option>
                                            <option value={1}>
                                                {pick(UI.n1Scooter150000VndDay, locale)}
                                            </option>
                                            <option value={2}>
                                                {pick(UI.n2Scooters300000VndDay, locale)}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </Card>

                            {/* bảng tiền */}
                            <div className="space-y-[8px] rounded-[12px] border border-[var(--border-muted)] bg-[var(--surface)] p-[16px] text-[12px]">
                                <SumRow
                                    label={`${formatPrice(room.price, locale)} × ${nights} ${pick(UI.nights, locale)}`}
                                    value={formatPrice(room.price * nights, locale)}
                                />
                                {bikes > 0 && (
                                    <SumRow
                                        label={`${bikes} ${pick(UI.scooters, locale)} × ${nights} ${pick(UI.days, locale)}`}
                                        value={formatPrice(bikes * bikeRate * nights, locale)}
                                    />
                                )}
                                <div className="flex items-center justify-between pt-[4px] font-medium text-[var(--success)]">
                                    <span>{pick(UI.pierTransferBreakfast, locale)}</span>
                                    <span>{pick(UI.free, locale)}</span>
                                </div>
                                <div className="flex items-center justify-between border-t border-[var(--border-muted)] pt-[8px] text-[14px] font-bold text-[var(--brand-dark)]">
                                    <span>{pick(UI.totalAmount, locale)}</span>
                                    <span className="text-[16px] text-[var(--brand)] tabular-nums">
                                        {formatPrice(totalAmount, locale)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ============================ BƯỚC 2 — xác nhận & trả tiền */}
                    {step === 2 && (
                        <div className="space-y-[16px]">
                            <Card>
                                <h2 className="font-display text-[16px] font-bold text-[var(--brand-dark)]">
                                    {pick(UI.confirmBookingDetails, locale)}
                                </h2>

                                <div className="flex gap-[12px] border-b border-[var(--border-muted)] pb-[12px]">
                                    <div className="h-[56px] w-[64px] shrink-0 overflow-hidden rounded-[6px] bg-[var(--surface-hover)]">
                                        {room.images?.[0] && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={room.images[0]}
                                                alt={pick(room.name, locale)}
                                                className="h-full w-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="space-y-[4px] text-[12px]">
                                        <h3 className="font-bold text-[var(--brand-dark)]">
                                            {pick(room.name, locale)}
                                        </h3>
                                        <p className="text-[var(--text-muted)]">
                                            {dateLabel} · {nights} {pick(UI.nights, locale)}
                                        </p>
                                        <p className="text-[var(--text-muted)]">
                                            {guests} {pick(UI.adults, locale)}, 1{' '}
                                            {pick(UI.room, locale)}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-[6px] text-[12px] text-[var(--text-muted)]">
                                    <KeyValue label={pick(UI.guestName, locale)} value={name || '—'} />
                                    <KeyValue label={pick(UI.phone, locale)} value={phone || '—'} />
                                    <KeyValue label={pick(UI.email2, locale)} value={email || '—'} />
                                </div>
                            </Card>

                            <Card>
                                <h2 className="font-display text-[16px] font-bold text-[var(--brand-dark)]">
                                    {pick(UI.paymentMethod, locale)}
                                </h2>

                                <div role="radiogroup" className="space-y-[8px]">
                                    <PayOption
                                        on={method === 'qr'}
                                        onClick={() => setMethod('qr')}
                                        title={`VietQR — ${pick(UI.automaticBankTransfer, locale)}`}
                                        note={pick(UI.scanQrCodeWithAnyBanking, locale)}
                                    />
                                    <PayOption
                                        on={method === 'momo'}
                                        onClick={() => setMethod('momo')}
                                        title="Ví MoMo"
                                        note={`${pick(H3.transferToHotline, locale)} ${data.brand.phone}`}
                                    />
                                    <PayOption
                                        on={method === 'cash'}
                                        onClick={() => setMethod('cash')}
                                        title={pick(UI.payInFullOnArrival, locale)}
                                        note={pick(UI.confirmReservationWithReceptionistOnZalo, locale)}
                                    />
                                </div>

                                {method === 'qr' && (
                                    <div className="mt-[12px] flex flex-col items-center gap-[12px] rounded-[8px] border border-[var(--border-muted)] bg-[var(--surface-alt)] p-[12px] sm:flex-row">
                                        {qrSrc && (
                                            <div className="h-[144px] w-[144px] shrink-0 rounded-[6px] border border-[var(--border-muted)] bg-[var(--surface)] p-[4px]">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={qrSrc}
                                                    alt="VietQR"
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 space-y-[6px] text-[12px]">
                                            <div className="font-bold text-[var(--brand-dark)]">
                                                {pick(UI.deposit50ToHoldRoom, locale)}
                                            </div>
                                            <div className="text-[16px] font-bold text-[var(--brand)] tabular-nums">
                                                {formatPrice(depositAmount, locale)}
                                            </div>
                                            <div className="flex justify-between border-t border-[var(--border-muted)] pt-[4px] text-[var(--text-soft)]">
                                                <span>{pick(UI.accountNo, locale)}</span>
                                                <span className="font-bold text-[var(--text)] tabular-nums">
                                                    {data.brand.phone}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-[var(--text-soft)]">
                                                <span>{pick(UI.transferNote, locale)}</span>
                                                <span className="font-bold text-[var(--brand)]">
                                                    {refCode}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </div>
                    )}

                    {/* ================================= BƯỚC 3 — đặt thành công */}
                    {step === 3 && (
                        <div className="space-y-[20px] rounded-[12px] border border-[var(--border-muted)] bg-[var(--surface)] p-[24px] text-center shadow-1">
                            <div className="mx-auto flex h-[64px] w-[64px] items-center justify-center rounded-full bg-[var(--color-success-bg)] text-[var(--success)]">
                                <CheckCircle className="h-[40px] w-[40px] stroke-[1.75]" />
                            </div>

                            <div className="space-y-[4px]">
                                <h2 className="font-display text-[20px] font-bold text-[var(--brand-dark)] sm:text-[24px]">
                                    {pick(UI.bookingSuccessful, locale)}
                                </h2>
                                <p className="text-[12px] text-[var(--text-soft)]">
                                    {pick(UI.thankYouForChoosingToStay, locale)}
                                </p>
                            </div>

                            <div className="inline-block rounded-[8px] border border-[var(--brand)]/20 bg-[var(--surface-tint)] px-[16px] py-[8px] text-[12px] font-semibold text-[var(--brand-dark)]">
                                {pick(UI.yourBookingCodeIs, locale)}{' '}
                                <span className="ml-[4px] text-[14px] font-bold text-[var(--brand)]">
                                    {bookingCode}
                                </span>
                            </div>

                            <div className="space-y-[8px] rounded-[8px] border border-[var(--border-muted)] bg-[var(--surface-alt)] p-[16px] text-left text-[12px]">
                                <div className="flex items-center gap-[12px] border-b border-[var(--border-muted)] pb-[8px]">
                                    <div className="h-[48px] w-[48px] shrink-0 overflow-hidden rounded-[6px] bg-[var(--surface-hover)]">
                                        {room.images?.[0] && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={room.images[0]}
                                                alt={pick(room.name, locale)}
                                                className="h-full w-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[var(--brand-dark)]">
                                            {pick(room.name, locale)}
                                        </h4>
                                        <p className="text-[var(--text-soft)]">
                                            {dateLabel} · {nights} {pick(UI.nights, locale)}
                                        </p>
                                    </div>
                                </div>

                                <KeyValue label={pick(UI.guestName2, locale)} value={name || '—'} />
                                <KeyValue label={pick(UI.phone, locale)} value={phone || '—'} />
                                <div className="flex justify-between text-[var(--text-muted)]">
                                    <span>{pick(UI.totalAmount2, locale)}</span>
                                    <span className="font-bold text-[var(--brand)] tabular-nums">
                                        {formatPrice(totalAmount, locale)}
                                    </span>
                                </div>
                            </div>

                            <p className="text-[12px] text-[var(--text-soft)]">
                                {pick(UI.confirmationDetailsSentTo, locale)}{' '}
                                <span className="font-semibold text-[var(--text)]">
                                    {email || '—'}
                                </span>
                            </p>

                            {/* Bản demo — nói thẳng, không để khách tưởng đã có đơn thật. */}
                            <p className="text-[11px] leading-relaxed font-semibold text-[var(--color-warning)]">
                                {pick(H3.demoNote, locale)}
                            </p>

                            <div className="flex flex-col gap-[12px] pt-[8px] sm:flex-row">
                                <a
                                    href={themePath(slug, 'rooms')}
                                    className="flex-1 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-[16px] py-[10px] text-[14px] font-bold text-[var(--text)] no-underline transition hover:border-[var(--brand)]"
                                >
                                    {pick(UI.viewMyBookings, locale)}
                                </a>
                                <a
                                    href={themeRoot(slug)}
                                    className="flex-1 rounded-[6px] bg-[var(--brand)] px-[16px] py-[10px] text-[14px] font-bold text-[var(--text-inverse)] no-underline transition hover:bg-[var(--brand-light)]"
                                >
                                    {pick(UI.backToHome, locale)}
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* ------------------------------------- thanh tổng tiền dính đáy */}
            {step < 3 && (
                <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border-muted)] bg-[var(--surface)] p-[12px] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
                    <div className="mx-auto flex w-full max-w-[800px] items-center justify-between gap-[12px]">
                        <div className="shrink-0">
                            <span className="block text-[10px] leading-none text-[var(--text-soft)]">
                                {pick(UI.total, locale)}
                            </span>
                            <span className="text-[16px] font-bold text-[var(--brand-dark)] tabular-nums">
                                {formatPrice(totalAmount, locale)}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={advance}
                            className="flex-1 cursor-pointer rounded-[6px] border-none bg-[var(--brand)] px-[16px] py-[12px] font-primary text-[14px] font-bold text-[var(--text-inverse)] transition hover:bg-[var(--brand-light)]"
                        >
                            {step === 1
                                ? pick(UI.continueToPayment, locale)
                                : pick(UI.confirmBookingDetails, locale)}
                        </button>
                    </div>
                </div>
            )}

            {/* `bottomInset` để chân trang không nằm dưới thanh dính. */}
            <SiteFooter {...siteFooterPropsOf(data, locale, slug)} bottomInset={step < 3} />
        </div>
    )
}

// ================================================================= mảnh nhỏ

const INPUT =
    'w-full rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-[12px] py-[10px] font-primary text-[12px] text-[var(--text)] outline-none focus:border-[var(--brand)]'

function Card({ children }: { children: React.ReactNode }) {
    return (
        <div className="space-y-[12px] rounded-[12px] border border-[var(--border-muted)] bg-[var(--surface)] p-[16px] shadow-1">
            {children}
        </div>
    )
}

function StepLabel({ n, on, label }: { n: number; on: boolean; label: string }) {
    return (
        <li
            aria-current={on ? 'step' : undefined}
            className={on ? 'text-[var(--brand)]' : 'text-[var(--text-soft)]'}
        >
            {n}. {label}
        </li>
    )
}

function Sep() {
    return (
        <li aria-hidden="true" className="text-[var(--text-faint)]">
            •
        </li>
    )
}

function Field({
    id,
    label,
    value,
    onChange,
    type = 'text',
    placeholder,
}: {
    id: string
    label: string
    value: string
    onChange: (v: string) => void
    type?: string
    placeholder?: string
}) {
    return (
        <div className="space-y-[4px]">
            <label htmlFor={id} className="block font-semibold text-[var(--text)]">
                {label}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className={INPUT}
            />
        </div>
    )
}

function SumRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span>{label}</span>
            <span className="font-semibold text-[var(--text)] tabular-nums">{value}</span>
        </div>
    )
}

function KeyValue({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between">
            <span className="text-[var(--text-soft)]">{label}</span>
            <span className="font-semibold text-[var(--text)]">{value}</span>
        </div>
    )
}

function PayOption({
    on,
    onClick,
    title,
    note,
}: {
    on: boolean
    onClick: () => void
    title: string
    note: string
}) {
    return (
        <button
            type="button"
            role="radio"
            aria-checked={on}
            onClick={onClick}
            className={[
                'flex w-full cursor-pointer items-start gap-[12px] rounded-[8px] border p-[12px] text-left font-primary transition',
                on
                    ? 'border-[var(--brand)] bg-[var(--surface-tint)]'
                    : 'border-[var(--border-muted)] bg-[var(--surface)]',
            ].join(' ')}
        >
            <span
                aria-hidden="true"
                className={[
                    'mt-[2px] flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-full border',
                    on ? 'border-[var(--brand)] bg-[var(--brand)]' : 'border-[var(--border-strong)]',
                ].join(' ')}
            >
                {on && <span className="h-[6px] w-[6px] rounded-full bg-[var(--surface)]" />}
            </span>
            <span className="space-y-[2px] text-[12px]">
                <span className="block font-bold text-[var(--brand-dark)]">{title}</span>
                <span className="block text-[var(--text-soft)]">{note}</span>
            </span>
        </button>
    )
}

/** `2026-08-15` → `15/08`. Ngắn để hai ngày nằm vừa một dòng trên mobile. */
function dmy(iso: string): string {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}
