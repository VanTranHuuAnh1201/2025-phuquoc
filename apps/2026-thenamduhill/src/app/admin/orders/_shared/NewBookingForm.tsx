'use client'

/**
 * Form tạo đơn thủ công — lễ tân nhập hộ khách gọi điện hoặc tới thẳng quầy.
 *
 * MỘT NỘI DUNG, HAI CHỖ DÙNG: route đầy đủ `/admin/orders/new` (deep-link, mở
 * tab mới trong lúc đang nghe điện thoại — ticket 100-02 §6.4) và drawer phải
 * mở từ Dashboard (không rời màn đang làm). Cùng khuôn với `OrderDetailPanel`:
 * một component nội dung thuần + một hook mở nó trong drawer.
 *
 * Giá đi qua `useQuoteOf()` — CÙNG engine với luồng khách tự đặt trên web, chỉ
 * khác chỗ nạp tham số. Nhờ vậy hai con số khớp từng đồng do dùng chung hàm,
 * không phải do trùng hợp (luật R8).
 *
 * Cố ý KHÔNG đọc `cart.store`: lễ tân nhập đơn hộ mà giẫm lên giỏ hàng của
 * khách đang mở tab bên cạnh là mất đơn của khách.
 *
 * KHÔNG TỰ ĐIỀU HƯỚNG: tạo xong thì gọi `onCreated(id)`. Route đẩy sang trang
 * chi tiết, drawer thì đóng mình rồi mở drawer chi tiết — hai luồng khác nhau,
 * và component nội dung không có quyền quyết định thay nơi gọi (C2).
 */

import { useCallback, useMemo, useState } from 'react'
import { addDays, can, formatPrice, getPropertySync, pick, ratePlans } from '@repo/core'
import type { Channel, GuestCount } from '@repo/core'
import { Badge, Button, CheckField, Field, SelectField, TextAreaField } from '@repo/ui'
import { useDrawerRight } from '@repo/cms-ui'
import { useLocale } from '@/components/LocaleProvider'
import { PriceBreakdown } from '@/components/PriceBreakdown'
import { useAuthStore } from '@/stores/auth.store'
import { useBookingStore } from '@/stores/booking.store'
import { useQuoteOf } from '@/stores/useQuote'
import { todayKey } from '@/stores/demo-data'
import { BLOCK_REASON_LABEL, CHANNEL_LABEL, S, tr } from '@/strings'
import { useOrderDrawer } from './OrderDetailPanel'

/** Kênh lễ tân được chọn. `web` là khách tự đặt, `ota` do đối tác đẩy về. */
const MANUAL_CHANNELS: Channel[] = ['phone', 'walk-in']

export interface NewBookingFormProps {
    /** Gọi sau khi đơn đã tạo xong và store đã nạp lại. Nơi gọi quyết định đi đâu. */
    onCreated: (bookingId: string) => void
    /** Người dùng bỏ giữa chừng — đóng drawer hoặc quay lại trang trước. */
    onCancel: () => void
    /**
     * `page`: lưới 2 cột, panel giá dính bên phải — y hệt bản cũ.
     * `drawer`: một cột dọc, nút hành động dính đáy vùng cuộn.
     */
    variant?: 'page' | 'drawer'
}

export function NewBookingForm({ onCreated, onCancel, variant = 'page' }: NewBookingFormProps) {
    const { locale } = useLocale()
    const user = useAuthStore((s) => s.user)
    const property = getPropertySync()

    const inDrawer = variant === 'drawer'
    const today = todayKey()

    // Trạng thái cục bộ, không store, không persist: đơn nháp của lễ tân không
    // đáng để tồn tại qua reload (§6.4).
    const [checkIn, setCheckIn] = useState(addDays(today, 1))
    const [checkOut, setCheckOut] = useState(addDays(today, 3))
    const [adults, setAdults] = useState(2)
    const [childAges, setChildAges] = useState<number[]>([])
    const [roomTypeId, setRoomTypeId] = useState('')
    const [ratePlanId, setRatePlanId] = useState('standard')
    const [addons, setAddons] = useState<Record<string, number>>({})
    const [promoCode, setPromoCode] = useState('')
    const [channel, setChannel] = useState<Channel>('phone')

    const [fullName, setFullName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [arrivalTime, setArrivalTime] = useState('')
    const [note, setNote] = useState('')

    const [submitting, setSubmitting] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)

    const guests: GuestCount = useMemo(
        () => ({ adults, children: childAges }),
        [adults, childAges],
    )

    const quote = useQuoteOf(
        roomTypeId && checkOut > checkIn
            ? { roomTypeId, checkIn, checkOut, guests, ratePlanId, addons, promoCode, channel }
            : null,
    )

    const availability = quote?.availability
    const blockReason = availability?.blockedReason

    // Lễ tân KHÔNG có `price.edit` → không có ô sửa giá gốc. Tổng tiền chỉ đọc.
    // Ẩn nút không phải bảo mật; chặn thật ở Route Handler (000-03) + RLS.
    const canEditPrice = user ? can(user.role, 'price.edit') : false
    const canCreate = user ? can(user.role, 'booking.create') : false

    if (user && !canCreate) {
        return (
            <p role="alert" style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                {pick(
                    {
                        vi: 'Tài khoản của bạn không có quyền tạo đơn.',
                        en: 'Your account cannot create bookings.',
                    },
                    locale,
                )}
            </p>
        )
    }

    const validate = (): string | null => {
        if (checkOut <= checkIn) {
            return pick(
                {
                    vi: 'Ngày trả phòng phải sau ngày nhận phòng.',
                    en: 'Check-out must be after check-in.',
                },
                locale,
            )
        }
        if (!roomTypeId) {
            return pick({ vi: 'Chọn một hạng phòng.', en: 'Pick a room type.' }, locale)
        }
        if (!fullName.trim()) return tr(S.errNameRequired, locale)
        if (!/^0\d{8,10}$/.test(phone.trim())) return tr(S.errPhoneRequired, locale)
        if (email.trim() && !email.includes('@')) return tr(S.errEmailInvalid, locale)
        if (!quote) return tr(S.selectRoomFirst, locale)
        // AC-16: hết phòng thì chặn hẳn, đọc lý do từ core chứ không tự viết câu.
        if (!availability?.available) {
            return blockReason
                ? tr(BLOCK_REASON_LABEL[blockReason], locale)
                : tr(S.errSoldOut, locale)
        }
        return null
    }

    const submit = async () => {
        const problem = validate()
        if (problem) {
            setFormError(problem)
            return
        }
        if (!quote) return

        setSubmitting(true)
        setFormError(null)

        try {
            // Gắn đơn vào ĐÚNG hồ sơ khách trước khi gửi đi.
            //
            // BUG ĐÃ SỬA: bản cũ không gửi `customerId`, nên mọi đơn nhập từ CMS
            // có `customerId = undefined`. Màn CRM lọc bằng
            // `bookings.filter(b => b.customerId === customer.id)` → đơn vừa tạo
            // không bao giờ hiện trong lịch sử khách, và phân hạng VIP/Quay lại
            // (đếm theo lịch sử đó) tính sai theo.
            //
            // Việc tra/tạo nằm trong `ensureCustomer()` của store, không ở đây:
            // quy tắc "một SĐT = một khách" là nghiệp vụ dùng chung (R8/C2).
            const customerId = useBookingStore.getState().ensureCustomer({
                fullName: fullName.trim(),
                phone: phone.trim(),
                email: email.trim(),
                actor: user ? { id: user.id, name: user.fullName, role: user.role } : undefined,
            })

            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roomTypeId,
                    ratePlanId,
                    checkIn,
                    checkOut,
                    guests,
                    addons,
                    promoCode,
                    channel,
                    customerId: customerId || undefined,
                    guest: {
                        fullName: fullName.trim(),
                        phone: phone.trim(),
                        email: email.trim(),
                        estimatedArrivalTime: arrivalTime || undefined,
                        specialRequests: note.trim() || undefined,
                    },
                }),
            })

            const json = await res.json()
            if (!res.ok) {
                setFormError(json.error?.message?.vi || json.error?.message?.en || 'Tạo đơn thất bại.')
                setSubmitting(false)
                return
            }

            await useBookingStore.getState().fetchBookingsFromApi()
            onCreated(String(json.data?.id || ''))
        } catch (error) {
            setFormError(
                pick(
                    {
                        vi: `Không tạo được đơn: ${String(error)}`,
                        en: `Could not create the booking: ${String(error)}`,
                    },
                    locale,
                ),
            )
            setSubmitting(false)
        }
    }

    /* Hai nút chia 3fr/7fr: "Tạo đơn" là việc lễ tân làm 99% số lần, "Huỷ" là
     * lối thoát hiếm khi dùng — bề rộng phải nói ra tỉ lệ đó thay vì chia đôi.
     * Ở nhánh `page` không có nút Huỷ (đã có breadcrumb quay lại) nên một cột. */
    const actionButtons = (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: inDrawer ? '3fr 7fr' : '1fr',
                gap: 'var(--space-3)',
            }}
        >
            {inDrawer && (
                <Button
                    variant="ghost"
                    onClick={onCancel}
                    disabled={submitting}
                    style={{ minHeight: 44, width: '100%' }}
                >
                    {tr(S.cancel, locale)}
                </Button>
            )}
            <Button
                onClick={submit}
                disabled={submitting || !availability?.available}
                aria-busy={submitting}
                style={{ minHeight: 44, width: '100%' }}
            >
                {submitting ? tr(S.creatingBooking, locale) : tr(S.createBookingCta, locale)}
            </Button>
        </div>
    )

    /* ---- tóm tắt giá: chỉ đọc, không có ô sửa tổng tiền ---- */
    const priceSummary = (
        <>
            <h2
                style={{
                    margin: 0,
                    fontSize: 'var(--text-base)',
                    fontFamily: 'var(--font-display)',
                }}
            >
                {tr(S.priceSummary, locale)}
            </h2>

            {!quote && (
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                    {tr(S.selectRoomFirst, locale)}
                </p>
            )}

            {quote && !availability?.available && (
                <div
                    role="alert"
                    style={{
                        display: 'grid',
                        gap: 'var(--space-2)',
                        padding: 'var(--space-4)',
                        background: 'var(--danger-bg)',
                        color: 'var(--danger)',
                        borderRadius: 'var(--radius)',
                        fontSize: 'var(--text-sm)',
                    }}
                >
                    <Badge tone="danger">
                        {pick({ vi: 'Không đặt được', en: 'Not bookable' }, locale)}
                    </Badge>
                    <span>
                        {blockReason
                            ? tr(BLOCK_REASON_LABEL[blockReason], locale)
                            : tr(S.errSoldOut, locale)}
                    </span>
                </div>
            )}

            {quote && availability?.available && (
                <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                    {/*
                     * CÙNG component với luồng khách (`booking/page.tsx`), không
                     * phải bảng dựng lại. `labelOf()` trong đó tra tên hạng phòng
                     * và tên addon rồi trả nhãn song ngữ, nên lễ tân không còn
                     * nhìn thấy mã nội bộ kiểu "extra-bed" (luật C7/FE6), và số
                     * hai bên khớp vì dùng chung một nhánh hiển thị (R8/C10).
                     *
                     * KHÔNG sửa component này — nó dùng chung với luồng khách,
                     * đổi ở đây là đổi cả bảng giá khách nhìn thấy. Mọi chỉnh
                     * trình bày chỉ nằm ở phần BAO QUANH nó.
                     */}
                    <PriceBreakdown quote={quote} locale={locale} showDeposit />

                    {/* Ghi chú + badge tồn kho xếp cùng một hàng đáy: chú thích
                     * là chữ nhỏ mờ, còn số phòng còn lại là dữ kiện lễ tân phải
                     * thấy ngay nên đóng khung thành badge thay vì dòng chữ trôi. */}
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            gap: 'var(--space-3)',
                            paddingTop: 'var(--space-2)',
                            borderTop: '1px solid var(--border)',
                        }}
                    >
                        <p
                            style={{
                                flex: '1 1 180px',
                                margin: 0,
                                fontSize: 'var(--text-xs)',
                                lineHeight: 1.6,
                                color: 'var(--text-muted)',
                            }}
                        >
                            {tr(S.priceReadOnlyHint, locale)}
                        </p>
                        <span
                            style={{
                                flexShrink: 0,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 'var(--space-2)',
                                padding: '2px var(--space-3)',
                                borderRadius: 'var(--radius-sm, 6px)',
                                background: 'var(--cms-accent-weak)',
                                color: 'var(--text)',
                                fontSize: 'var(--text-xs)',
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {tr(S.availableUnitsBadge, locale)}
                            <strong style={{ fontVariantNumeric: 'tabular-nums' }}>
                                {availability.availableUnits}
                            </strong>
                        </span>
                    </div>
                </div>
            )}
        </>
    )

    /* Dòng "Thành tiền" ghim trên hàng nút của drawer.
     *
     * VÌ SAO LẶP LẠI CON SỐ ĐÃ CÓ TRONG BẢNG GIÁ: form cao hơn màn hình, nên
     * lúc lễ tân cuộn xuống bấm "Tạo đơn" thì bảng giá đã trôi khỏi tầm nhìn.
     * Đọc lại tổng tiền cho khách nghe máy ngay tại nút bấm là thao tác thật,
     * không phải trang trí. Số lấy TỪ CÙNG `quote`, không tính lại (R8). */
    const pinnedTotal = quote && availability?.available && (
        <div
            style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: 'var(--space-4)',
                paddingBottom: 'var(--space-2)',
                marginBottom: 'var(--space-2)',
                borderBottom: '1px solid var(--cms-border)',
            }}
        >
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--cms-text-muted)' }}>
                {tr(S.totalAmount, locale)}
            </span>
            <strong
                style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: 700,
                    color: 'var(--cms-text)',
                    fontVariantNumeric: 'tabular-nums',
                    whiteSpace: 'nowrap',
                }}
            >
                {formatPrice(quote.totalAmount, locale)}
            </strong>
        </div>
    )

    /* THỨ TỰ KHỐI: Kỳ lưu trú → Thông tin người đặt → Hạng phòng & phụ thu →
     * Tóm tắt giá.
     *
     * Đây là thứ tự THAO TÁC THẬT của lễ tân đang nghe điện thoại: hỏi ngày đi,
     * ghi ngay tên và số gọi lại (nếu rớt máy vẫn liên lạc được), rồi mới tra
     * phòng trống và chốt giá. Xếp hạng phòng lên trước bắt họ giữ tên/SĐT
     * trong đầu suốt lúc dò bảng phòng — chính là lúc hay ghi nhầm nhất. */
    const formFields = (
        <>
            <Panel title={tr(S.stayDetails, locale)}>
                <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                    {/* Ba trường quyết định giá nằm cùng một hàng: đọc ngang một
                     * lượt là biết kỳ lưu trú, không phải quét zíc-zắc 2 cột. */}
                    <div className="nb-three-col" style={{ display: 'grid', gap: 'var(--space-4)' }}>
                        <Field
                            label={tr(S.checkIn, locale)}
                            type="date"
                            value={checkIn}
                            min={today}
                            onChange={(e) => setCheckIn(e.target.value)}
                            required
                        />
                        <Field
                            label={tr(S.checkOut, locale)}
                            type="date"
                            value={checkOut}
                            min={addDays(checkIn, 1)}
                            onChange={(e) => setCheckOut(e.target.value)}
                            required
                        />
                        <Field
                            label={tr(S.adults, locale)}
                            type="number"
                            min={1}
                            max={12}
                            value={adults}
                            onChange={(e) => setAdults(Math.max(1, Number(e.target.value) || 1))}
                            required
                        />
                    </div>

                    {/* Hàng trẻ em: ô đếm chỉ chứa 1 chữ số nên ghim 120px, phần
                     * còn lại của hàng dành cho các ô TUỔI hiện ngay bên cạnh —
                     * nhập số rồi khai tuổi liền tay, không phải nhảy xuống dưới. */}
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'flex-start',
                            gap: 'var(--space-3)',
                        }}
                    >
                        <div style={{ width: 120, flexShrink: 0 }}>
                            <Field
                                label={tr(S.children, locale)}
                                type="number"
                                min={0}
                                max={8}
                                value={childAges.length}
                                onChange={(e) => {
                                    const count = Math.max(
                                        0,
                                        Math.min(8, Number(e.target.value) || 0),
                                    )
                                    setChildAges((prev) =>
                                        Array.from({ length: count }, (_, i) => prev[i] ?? 6),
                                    )
                                }}
                            />
                        </div>

                        {childAges.map((age, index) => (
                            <div key={index} style={{ width: 96, flexShrink: 0 }}>
                                <Field
                                    label={`${tr(S.age, locale)} ${index + 1}`}
                                    type="number"
                                    min={0}
                                    max={17}
                                    value={age}
                                    onChange={(e) => {
                                        const next = [...childAges]
                                        next[index] = Math.max(
                                            0,
                                            Math.min(17, Number(e.target.value) || 0),
                                        )
                                        setChildAges(next)
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Chú thích của CẢ HÀNG trẻ em (ô đếm + các ô tuổi), không
                     * thuộc riêng ô nào — nên là <p> tự do, không phải prop
                     * `hint` của một `Field`. */}
                    <p
                        style={{
                            margin: 0,
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-muted)',
                            lineHeight: 1.5,
                        }}
                    >
                        {tr(S.childrenAgeHint, locale)}
                    </p>
                </div>
            </Panel>

            <Panel title={tr(S.guestInfo, locale)}>
                <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                    {/* Ba trường định danh khách đều ngắn → xếp 3 cột, một hàng
                     * là xong phần "ai đang gọi". */}
                    <div className="nb-three-col" style={{ display: 'grid', gap: 'var(--space-4)' }}>
                        <Field
                            label={tr(S.fullName, locale)}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                        <Field
                            label={tr(S.phone, locale)}
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="0901234567"
                            required
                        />
                        <Field
                            label={tr(S.email, locale)}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            hint={tr(S.optional, locale)}
                        />
                    </div>

                    <div className="nb-two-col" style={{ display: 'grid', gap: 'var(--space-4)' }}>
                        <Field
                            label={tr(S.arrivalTime, locale)}
                            type="time"
                            value={arrivalTime}
                            onChange={(e) => setArrivalTime(e.target.value)}
                            hint={tr(S.arrivalHint, locale)}
                        />
                        <SelectField
                            label={tr(S.channel, locale)}
                            value={channel}
                            onChange={(e) => setChannel(e.target.value as Channel)}
                            hint={tr(S.channelHint, locale)}
                            required
                        >
                            {MANUAL_CHANNELS.map((c) => (
                                <option key={c} value={c}>
                                    {tr(CHANNEL_LABEL[c], locale)}
                                </option>
                            ))}
                        </SelectField>
                    </div>

                    {/* 130px ≈ 5 dòng: yêu cầu đặc biệt thường là một đoạn kể
                     * (trăng mật + dị ứng + giờ tàu), 3 dòng mặc định bắt lễ
                     * tân cuộn trong chính ô nhập khi đang gõ vội. */}
                    <TextAreaField
                        label={tr(S.specialRequests, locale)}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        hint={tr(S.specialRequestsHint, locale)}
                        style={{ minHeight: 130, height: 130 }}
                    />
                </div>
            </Panel>

            <Panel title={tr(S.roomAndExtras, locale)}>
                <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                    <div className="nb-two-col" style={{ display: 'grid', gap: 'var(--space-4)' }}>
                        <SelectField
                            label={tr(S.roomTypeLabel, locale)}
                            value={roomTypeId}
                            onChange={(e) => setRoomTypeId(e.target.value)}
                            required
                        >
                            <option value="">
                                {pick(
                                    { vi: '— Chọn hạng phòng —', en: '— Select a room type —' },
                                    locale,
                                )}
                            </option>
                            {property.rooms.map((room) => (
                                <option key={room.id} value={room.id}>
                                    {pick(room.name, locale)} · {formatPrice(room.price, locale)}
                                    {tr(S.perNight, locale)}
                                </option>
                            ))}
                        </SelectField>

                        <SelectField
                            label={tr(S.ratePlan, locale)}
                            value={ratePlanId}
                            onChange={(e) => setRatePlanId(e.target.value)}
                            hint={pick(
                                ratePlans.find((p) => p.id === ratePlanId)?.description ?? {
                                    vi: '',
                                    en: '',
                                },
                                locale,
                            )}
                        >
                            {ratePlans
                                .filter((p) => p.active)
                                .map((plan) => (
                                    <option key={plan.id} value={plan.id}>
                                        {pick(plan.name, locale)}
                                    </option>
                                ))}
                        </SelectField>
                    </div>

                    <fieldset
                        style={{
                            border: 0,
                            margin: 0,
                            padding: 0,
                            display: 'grid',
                            gap: 'var(--space-2)',
                        }}
                    >
                        <legend
                            style={{
                                padding: 0,
                                fontSize: 'var(--text-sm)',
                                fontWeight: 600,
                            }}
                        >
                            {tr(S.addons, locale)}
                        </legend>
                        {property.addons.map((addon) => {
                            const picked = Boolean(addons[addon.id])
                            return (
                                <div
                                    key={addon.id}
                                    style={{
                                        // Dịch vụ đã tick tô nền nhạt: danh sách
                                        // addon dài, chỉ dấu tick 18px thì lúc rà
                                        // lại đơn phải soi từng dòng.
                                        background: picked ? 'var(--cms-accent-weak)' : undefined,
                                        borderRadius: 'var(--radius-sm, 6px)',
                                        // Padding giữ NGUYÊN ở cả hai trạng thái:
                                        // đổi padding theo tick sẽ làm cả danh
                                        // sách nhích lên xuống mỗi lần bấm.
                                        padding: 'var(--space-1) var(--space-2)',
                                    }}
                                >
                                    <CheckField
                                        label={`${pick(addon.name, locale)} — ${formatPrice(addon.price, locale)} / ${pick(addon.unit, locale)}`}
                                        checked={picked}
                                        onChange={(e) =>
                                            setAddons((prev) => {
                                                const next = { ...prev }
                                                if (e.target.checked) next[addon.id] = 1
                                                else delete next[addon.id]
                                                return next
                                            })
                                        }
                                    />
                                </div>
                            )
                        })}
                    </fieldset>

                    {/* Lễ tân không có `price.edit` thì mã khuyến mãi là đường
                     * DUY NHẤT để đổi giá — nói thẳng điều đó ngay dưới ô nhập. */}
                    <Field
                        label={tr(S.promoCode, locale)}
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder={tr(S.promoPlaceholder, locale)}
                        hint={canEditPrice ? undefined : tr(S.priceEditNoPermission, locale)}
                    />
                </div>
            </Panel>
        </>
    )

    const errorBox = formError && (
        <div
            role="alert"
            aria-live="polite"
            style={{
                padding: 'var(--space-4)',
                background: 'var(--danger-bg)',
                color: 'var(--danger)',
                borderRadius: 'var(--radius)',
                fontSize: 'var(--text-sm)',
            }}
        >
            {formError}
        </div>
    )

    /* ---- DRAWER: một cột dọc ----
     * Drawer chỉ rộng 720px nên lưới 2 cột sẽ bóp cả form lẫn panel giá xuống
     * dưới ngưỡng đọc được. Xếp dọc: nhập xong nhìn ngay tổng tiền bên dưới,
     * đúng thứ tự thao tác. Tiêu đề/breadcrumb bỏ đi vì header drawer đã có. */
    if (inDrawer) {
        return (
            /* HAI VÙNG TÁCH BẠCH: phần cuộn được, và thanh nút KHÔNG cuộn.
             *
             * VÌ SAO KHÔNG DÙNG `sticky bottom-0`: đã thử và HỎNG. `sticky` neo
             * phần tử theo vùng cuộn gần nhất, nhưng thanh nút lại là phần tử
             * CUỐI của chính vùng đó — nên nó chỉ "dính" khi đã cuộn tới đáy,
             * còn trước đó vẫn trôi theo nội dung. Đo thật: vùng cuộn cao 667px,
             * nội dung 1696px, nút nổi giữa màn với trường nhập nằm bên dưới.
             *
             * Cách đúng: nhận nguyên khung thân của drawer (`bodyClassname` tắt
             * padding + cuộn mặc định của nó) rồi tự chia flex dọc — nội dung
             * `flex-1` tự cuộn, thanh nút `shrink-0` nằm ngoài luồng cuộn nên
             * luôn ở đáy. */
            <div className="nb-drawer flex h-full min-h-0 flex-col">
                <div
                    className="min-h-0 flex-1 overflow-y-auto p-[var(--cms-pad)]"
                    /* Gap giữa các Panel về `--space-4`: mỗi Panel đã có viền
                     * riêng làm ranh giới, khoảng hở lớn chỉ đẩy tổng chiều cao
                     * form lên và bắt cuộn thêm. */
                    style={{ display: 'grid', gap: 'var(--space-4)', alignContent: 'start' }}
                >
                    {errorBox}
                    {formFields}

                    <section
                        style={{
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: 'var(--space-4)',
                            display: 'grid',
                            gap: 'var(--space-3)',
                        }}
                    >
                        {priceSummary}
                    </section>
                </div>

                {/* Vùng cố định đáy: dòng tổng tiền ghim NGAY TRÊN hàng nút, cùng
                 * một khối `shrink-0` để cả hai nằm ngoài luồng cuộn. */}
                <div className="shrink-0 border-t border-[var(--cms-border)] bg-[var(--cms-bg)] px-[var(--cms-pad)] py-2">
                    {pinnedTotal}
                    {actionButtons}
                </div>

                <style>{`
                    /* Phạm vi [data-cms] trong tokens.css KHÔNG khai --danger và
                     * --danger-bg, nên dấu * bắt buộc của Field cùng hộp lỗi đang
                     * thừa hưởng màu từ ngoài phạm vi CMS. Nối chúng vào tông rose
                     * của CMS ngay tại đây — sửa packages/ui sẽ đổi theo mọi màn
                     * khác đang dùng chung component đó. */
                    .nb-drawer {
                        --danger: var(--cms-tone-rose);
                        --danger-bg: var(--cms-tone-rose-bg);
                    }
                    @media (min-width: 640px) {
                        .nb-two-col { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                        .nb-three-col { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                    }
                `}</style>
            </div>
        )
    }

    /* ---- PAGE: giữ nguyên lưới 2 cột + panel giá dính bên phải ---- */
    return (
        <>
            {errorBox}

            <div className="new-booking-grid" style={{ display: 'grid', gap: 'var(--space-4)' }}>
                <div style={{ display: 'grid', gap: 'var(--space-4)', minWidth: 0 }}>{formFields}</div>

                <aside style={{ minWidth: 0 }}>
                    <div
                        style={{
                            position: 'sticky',
                            top: 'var(--space-5)',
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: 'var(--space-4)',
                            display: 'grid',
                            gap: 'var(--space-3)',
                        }}
                    >
                        {priceSummary}
                        {actionButtons}
                    </div>
                </aside>
            </div>

            <style>{`
                @media (min-width: 900px) {
                    .new-booking-grid { grid-template-columns: minmax(0, 1fr) 340px; align-items: start; }
                }
                @media (min-width: 640px) {
                    .nb-two-col { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                    .nb-three-col { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                }
            `}</style>
        </>
    )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section
            style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                // `--space-4` chứ không `--space-5`: form có 4 khối chồng nhau,
                // mỗi khối dư 8px trên-dưới là dư gần 70px chiều cao cuộn.
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4)',
            }}
        >
            <h2
                style={{
                    margin: '0 0 var(--space-3)',
                    fontSize: 'var(--text-base)',
                    fontFamily: 'var(--font-display)',
                }}
            >
                {title}
            </h2>
            {children}
        </section>
    )
}

/**
 * Mở form tạo đơn trong drawer phải bằng một lệnh gọi.
 *
 *     const { openNewBooking } = useNewBookingDrawer()
 *     <button onClick={openNewBooking}>+ Đặt phòng mới</button>
 *
 * Rộng 720px chứ không 560px như drawer chi tiết đơn: form này có hơn 10 trường
 * cộng bảng giá, ở 560px thì hai cột ngày/số khách phải xếp dọc hết và lễ tân
 * cuộn gấp đôi. Đây chính là lý do `DrawerRight` có prop `contentClassname`.
 */
export function useNewBookingDrawer() {
    const { show } = useDrawerRight()
    const { locale } = useLocale()
    const { openOrder } = useOrderDrawer()

    const openNewBooking = useCallback(() => {
        // Con trỏ gián tiếp: `children` cần hàm đóng, mà hàm đóng chỉ có sau khi
        // `show()` trả về. Bọc trong một ô chứa để hàm bên trong đọc được giá
        // trị gán sau — render xảy ra SAU lệnh gán nên lúc bấm nút đã có.
        const layer: { close?: () => void } = {}

        const closeThis = show({
            title: tr(S.newBooking, locale),
            isHeader: true,
            // Không dùng chân trang của drawer: nút "Tạo đơn" phải biết form có
            // hợp lệ chưa và đang gửi hay chưa — state đó nằm trong nội dung,
            // nên nút cũng sống trong nội dung (dính đáy, xem `actionButtons`).
            isFooter: false,
            contentClassname: 'sm:!max-w-[720px]',
            // Nhường quyền chia vùng cho form: nó cần thanh nút nằm NGOÀI vùng
            // cuộn, mà khung thân mặc định của drawer lại bọc trọn `children`.
            bodyClassname: 'min-h-0 flex-1',
            children: (
                <NewBookingForm
                    variant="drawer"
                    onCancel={() => layer.close?.()}
                    onCreated={(id) => {
                        // Đóng form rồi mở NGAY drawer chi tiết đơn vừa tạo:
                        // tạo xong việc tiếp theo luôn là đối soát cọc / xác
                        // nhận đơn, không phải quay về bảng tìm lại nó.
                        layer.close?.()
                        if (id) openOrder(id)
                    }}
                />
            ),
        })

        layer.close = closeThis
        return closeThis
    }, [show, locale, openOrder])

    return { openNewBooking }
}
