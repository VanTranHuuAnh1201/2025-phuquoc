'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import {
    formatPrice,
    pick,
    themePath,
    themeRoot,
    type Locale,
    type PropertyData,
} from '@repo/core'

import { PageBody, PageFooter, PageHeader } from '@repo/ui-layout'
import { defaultPageStrings, type PageStrings } from './strings'
import { shellPropsOf } from '../shell-adapter'

/**
 * Trang thanh toán — port từ `Checkout / Checkout H2 / H3 / H4 - Nam Du Hill.dc.html`.
 *
 * Bốn bản prototype khác nhau ở màu, bo góc và cỡ chữ, nhưng CÙNG một bố cục:
 *   breadcrumb + tiêu đề + dải 3 bước
 *   → lưới `1fr / 400px`: trái là ba khối đánh số (thông tin người đặt ·
 *     phương thức thanh toán · chính sách & điều kiện), phải là thẻ đơn hàng
 *     DÍNH có ảnh phòng, bộ đếm số đêm, tiện ích và bảng tiền
 *
 * Vì khác biệt nằm trọn trong token, đây là một component dùng chung thay vì
 * bốn bản chép tay (luật R1).
 *
 * ⚠️ ĐÂY LÀ GIAO DIỆN, CHƯA NỐI NGHIỆP VỤ. Nút "Thanh toán" chưa tạo đơn, chưa
 * gọi cổng nào — luồng đặt phòng thật sẽ nối sau (xem `.claude/rules/app-flows.md`
 * §F2). Bảng tiền chỉ cộng những gì đang chọn trên màn hình.
 *
 * Trang KHÔNG tự nghĩ ra quy tắc giá: `depositPercent` truyền từ ngoài vào
 * (nguồn thật là `RatePlan.depositPercent` của core), và mọi con số hiển thị
 * qua `formatPrice` (luật R8).
 */

export interface CheckoutPageProps {
    data: PropertyData
    locale: Locale
    slug: string
    /** Id hạng phòng đang đặt — route truyền qua `?room=`. */
    roomId?: string
    /**
     * Phần trăm cọc phải trả ngay. Mặc định 30 — con số phổ biến ở resort Việt
     * (xem `.claude/rules/booking-domain.md` §B1). Khi nối `buildQuote()` của
     * core, truyền `ratePlan.depositPercent` vào đây.
     */
    depositPercent?: number
    strings?: Record<Locale, PageStrings>
}

/** Nhãn chỉ dùng ở trang này — song ngữ tại chỗ (luật R6). */
const L = {
    pageTitle: { vi: 'Thanh toán & xác nhận', en: 'Checkout & confirmation' },
    pageSub: {
        vi: 'Điền một lần, xem tổng tiền ngay bên phải. Chúng tôi xác nhận trong 15 phút.',
        en: 'Fill it in once — the total sits on the right. We confirm within 15 minutes.',
    },
    stepGuest: { vi: 'Thông tin khách', en: 'Guest details' },
    stepPay: { vi: 'Thanh toán', en: 'Payment' },
    stepDone: { vi: 'Xác nhận', en: 'Confirmation' },

    step1: { vi: 'Thông tin người đặt', en: "Who's booking" },
    step2: { vi: 'Phương thức thanh toán', en: 'Payment method' },
    step3: { vi: 'Chính sách & điều kiện', en: 'Policies & conditions' },

    fName: { vi: 'Họ và tên', en: 'Full name' },
    phName: { vi: 'Nguyễn Văn A', en: 'Jane Doe' },
    fPhone: { vi: 'Số điện thoại / Zalo', en: 'Phone / Zalo' },
    fEmail: { vi: 'Email', en: 'Email' },
    fId: { vi: 'CCCD / Hộ chiếu', en: 'ID card / Passport' },
    phId: { vi: 'Số giấy tờ dùng để lên tàu', en: 'Document number used for boarding' },
    checkIn: { vi: 'Ngày nhận phòng', en: 'Check-in date' },
    checkOut: { vi: 'Ngày trả phòng', en: 'Check-out date' },
    fNote: { vi: 'Ghi chú thêm', en: 'Anything else' },
    phNote: {
        vi: 'Giờ đến dự kiến, yêu cầu giường phụ, dị ứng thực phẩm…',
        en: 'Arrival time, extra bed, food allergies…',
    },

    orderTitle: { vi: 'Đơn của bạn', en: 'Your order' },
    orderSub: { vi: 'Giữ chỗ trong 30 phút', en: 'Held for 30 minutes' },
    nights: { vi: 'Số đêm', en: 'Nights' },
    nightsWord: { vi: 'đêm', en: 'nights' },
    guestsWord: { vi: 'khách', en: 'guests' },
    roomsTotal: { vi: 'Tiền phòng', en: 'Rooms' },
    addonsTotal: { vi: 'Tiện ích', en: 'Add-ons' },
    total: { vi: 'Tổng cộng', en: 'Total' },
    balance: { vi: 'Còn lại trả tại quầy', en: 'Balance due at check-in' },
    payNow: { vi: 'Thanh toán', en: 'Pay now' },
    payDisabled: { vi: 'Vui lòng đồng ý điều kiện', en: 'Please accept the conditions' },
    secureNote: {
        vi: 'Giao dịch mã hoá. Chúng tôi xác nhận qua Zalo và email trong 15 phút.',
        en: 'Encrypted transaction. We confirm by Zalo and email within 15 minutes.',
    },
    demoNote: {
        vi: 'Bản demo — nút này chưa tạo đơn và chưa gọi cổng thanh toán nào.',
        en: 'Demo build — this button does not create an order or call any payment gateway.',
    },
    agree: {
        vi: 'Tôi đã đọc và đồng ý với chính sách huỷ, đổi lịch và điều kiện lưu trú của resort.',
        en: 'I have read and accept the cancellation, rescheduling and stay conditions.',
    },
    step2Sub: {
        vi: 'Cọc {p}% khi đặt, phần còn lại thanh toán khi nhận phòng.',
        en: '{p}% deposit now, the balance is due at check-in.',
    },
    deposit: { vi: 'Cọc {p}% khi đặt', en: '{p}% deposit now' },
} satisfies Record<string, Record<Locale, string>>

const PAYMENTS: { id: string; name: Record<Locale, string>; note: Record<Locale, string> }[] = [
    {
        id: 'vnpay',
        name: { vi: 'VNPay QR', en: 'VNPay QR' },
        note: {
            vi: 'Quét mã bằng app ngân hàng, xác nhận tức thì',
            en: 'Scan with your banking app, confirmed instantly',
        },
    },
    {
        id: 'momo',
        name: { vi: 'MoMo', en: 'MoMo' },
        note: {
            vi: 'Ví MoMo, hoàn tiền vào ví nếu huỷ đúng hạn',
            en: 'MoMo wallet, refunded to the wallet on eligible cancellations',
        },
    },
    {
        id: 'card',
        name: { vi: 'Thẻ quốc tế', en: 'International card' },
        note: {
            vi: 'Visa · Mastercard · JCB, thanh toán 3D Secure',
            en: 'Visa · Mastercard · JCB, 3D Secure',
        },
    },
    {
        id: 'transfer',
        name: { vi: 'Chuyển khoản ngân hàng', en: 'Bank transfer' },
        note: {
            vi: 'Chuyển cọc, gửi biên lai qua Zalo',
            en: 'Transfer the deposit, send the receipt via Zalo',
        },
    },
]

const POLICIES: Record<Locale, string[]> = {
    vi: [
        'Huỷ miễn phí trước 72 giờ so với ngày nhận phòng.',
        'Đổi lịch miễn phí nếu tàu cao tốc ngừng chạy do biển động.',
        'Nhận phòng từ 14:00, trả phòng trước 12:00.',
        'Vui lòng mang CCCD hoặc hộ chiếu để làm thủ tục lên tàu.',
    ],
    en: [
        'Free cancellation up to 72 hours before check-in.',
        'Free rescheduling if the speedboat is cancelled due to rough seas.',
        'Check-in from 14:00, check-out by 12:00.',
        'Bring your ID card or passport for boarding.',
    ],
}

export function CheckoutPage({
    data,
    locale,
    slug,
    roomId,
    depositPercent = 30,
    strings,
}: CheckoutPageProps) {
    const t = (strings ?? defaultPageStrings)[locale]

    const room = data.rooms.find((r) => r.id === roomId) ?? data.rooms[0]

    const [nights, setNights] = useState(2)
    const [payment, setPayment] = useState('vnpay')
    const [agreed, setAgreed] = useState(false)
    const [addons, setAddons] = useState<Record<string, boolean>>({ 'addon-ferry': true })

    const guests = room?.guests ?? 2

    const roomsSubtotal = (room?.price ?? 0) * nights

    const addonsSubtotal = useMemo(
        () =>
            data.addons.reduce((sum, addon) => {
                if (!addons[addon.id]) return sum
                return sum + addon.price * (addon.id === 'addon-bike' ? nights : guests)
            }, 0),
        [data.addons, addons, nights, guests],
    )

    const total = roomsSubtotal + addonsSubtotal
    const deposit = Math.round((total * depositPercent) / 100)
    const balance = total - deposit

    const steps = [L.stepGuest[locale], L.stepPay[locale], L.stepDone[locale]]

    if (!room) return null

    return (
        <PageBody theme={slug}>
            <PageHeader {...shellPropsOf(data, locale, slug, t)} />

            {/* ---- tiêu đề + dải bước ---- */}
            <section
                style={{
                    background: 'var(--surface-alt)',
                    padding: '118px var(--space-6) var(--space-6)',
                }}
            >
                <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                    <nav
                        aria-label="Breadcrumb"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-muted)',
                            padding: 'var(--space-4) 0 var(--space-5)',
                            flexWrap: 'wrap',
                        }}
                    >
                        <a href={themeRoot(slug)} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {t.home}
                        </a>
                        <span aria-hidden="true">/</span>
                        <a
                            href={themePath(slug, 'rooms')}
                            style={{ color: 'inherit', textDecoration: 'none' }}
                        >
                            {t.roomsPage}
                        </a>
                        <span aria-hidden="true">/</span>
                        <span aria-current="page" style={{ color: 'var(--text)', fontWeight: 600 }}>
                            {L.pageTitle[locale]}
                        </span>
                    </nav>

                    <h1
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'var(--text-2xl)',
                            lineHeight: 1.16,
                            fontWeight: 800,
                            color: 'var(--text)',
                            margin: '0 0 var(--space-2)',
                            letterSpacing: '-0.03em',
                        }}
                    >
                        {L.pageTitle[locale]}
                    </h1>
                    <p
                        style={{
                            fontSize: 'var(--text-base)',
                            color: 'var(--text-muted)',
                            margin: '0 0 var(--space-5)',
                            maxWidth: 620,
                        }}
                    >
                        {L.pageSub[locale]}
                    </p>

                    {/* Dải bước: bước 1 đang mở, hai bước sau chưa tới. Trạng thái
                        thể hiện bằng CHỮ + màu, không chỉ bằng màu (luật D4). */}
                    <ol
                        style={{
                            listStyle: 'none',
                            margin: 0,
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            flexWrap: 'wrap',
                        }}
                    >
                        {steps.map((label, index) => {
                            const active = index === 0
                            return (
                                <li
                                    key={label}
                                    aria-current={active ? 'step' : undefined}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-2)',
                                        padding: 'var(--space-2) var(--space-4)',
                                        borderRadius: 'var(--radius-pill)',
                                        background: active ? 'var(--brand)' : 'var(--surface)',
                                        color: active ? 'var(--text-inverse)' : 'var(--text-muted)',
                                        border: active ? 'none' : '1px solid var(--border)',
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: active ? 700 : 500,
                                    }}
                                >
                                    <span
                                        aria-hidden="true"
                                        style={{
                                            display: 'grid',
                                            placeItems: 'center',
                                            width: 22,
                                            height: 22,
                                            borderRadius: 'var(--radius-pill)',
                                            background: active
                                                ? 'var(--overlay-soft)'
                                                : 'var(--surface-alt)',
                                            fontSize: 'var(--text-xs)',
                                            fontWeight: 800,
                                        }}
                                    >
                                        {index + 1}
                                    </span>
                                    {label}
                                </li>
                            )
                        })}
                    </ol>
                </div>
            </section>

            {/* ---- nội dung ---- */}
            <section
                style={{
                    background: 'var(--surface)',
                    padding: 'var(--space-8) var(--space-6) var(--space-20)',
                }}
            >
                <div
                    className="ui-checkout-layout"
                    style={{
                        maxWidth: 'var(--container)',
                        margin: '0 auto',
                        display: 'grid',
                        gap: 'var(--space-8)',
                        alignItems: 'start',
                    }}
                >
                    {/* ---- cột trái: ba bước ---- */}
                    <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
                        {/* bước 1 */}
                        <div style={CARD}>
                            <StepHeading n={1} title={L.step1[locale]} />

                            <div className="ui-form-grid" style={{ display: 'grid', gap: 'var(--space-4)' }}>
                                <Field id="co-name" label={L.fName[locale]} placeholder={L.phName[locale]} />
                                <Field
                                    id="co-phone"
                                    label={L.fPhone[locale]}
                                    type="tel"
                                    placeholder="09xx xxx xxx"
                                />
                                <Field
                                    id="co-email"
                                    label={L.fEmail[locale]}
                                    type="email"
                                    placeholder="ban@email.com"
                                />
                                <Field id="co-id" label={L.fId[locale]} placeholder={L.phId[locale]} />
                                <Field id="co-in" label={L.checkIn[locale]} type="date" />
                                <Field id="co-out" label={L.checkOut[locale]} type="date" />
                            </div>

                            <div
                                style={{
                                    display: 'grid',
                                    gap: 'var(--space-2)',
                                    marginTop: 'var(--space-4)',
                                }}
                            >
                                <label htmlFor="co-note" style={LABEL}>
                                    {L.fNote[locale]}
                                </label>
                                <textarea
                                    id="co-note"
                                    rows={3}
                                    placeholder={L.phNote[locale]}
                                    style={{ ...INPUT, resize: 'vertical', minHeight: 84 }}
                                />
                            </div>
                        </div>

                        {/* bước 2 */}
                        <div style={CARD}>
                            <StepHeading n={2} title={L.step2[locale]} />
                            <p
                                style={{
                                    fontSize: 'var(--text-sm)',
                                    color: 'var(--text-muted)',
                                    margin: '0 0 var(--space-4)',
                                    paddingLeft: 40,
                                }}
                            >
                                {L.step2Sub[locale].replace('{p}', String(depositPercent))}
                            </p>

                            <div role="radiogroup" style={{ display: 'grid', gap: 'var(--space-2)' }}>
                                {PAYMENTS.map((option) => {
                                    const active = payment === option.id
                                    return (
                                        <button
                                            key={option.id}
                                            type="button"
                                            role="radio"
                                            aria-checked={active}
                                            onClick={() => setPayment(option.id)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--space-3)',
                                                width: '100%',
                                                padding: 'var(--space-4)',
                                                borderRadius: 'var(--radius)',
                                                border: `1px solid ${
                                                    active ? 'var(--brand)' : 'var(--border)'
                                                }`,
                                                background: active
                                                    ? 'var(--surface-tint)'
                                                    : 'var(--surface)',
                                                cursor: 'pointer',
                                                fontFamily: 'var(--font-body)',
                                                textAlign: 'left',
                                                transition:
                                                    'border-color var(--duration) var(--ease), background var(--duration) var(--ease)',
                                            }}
                                        >
                                            <span
                                                aria-hidden="true"
                                                style={{
                                                    width: 18,
                                                    height: 18,
                                                    borderRadius: 'var(--radius-pill)',
                                                    border: `2px solid ${
                                                        active ? 'var(--brand)' : 'var(--border-strong)'
                                                    }`,
                                                    background: active
                                                        ? 'var(--brand)'
                                                        : 'var(--surface)',
                                                    boxShadow: active
                                                        ? 'inset 0 0 0 3px var(--surface)'
                                                        : undefined,
                                                    flexShrink: 0,
                                                }}
                                            />
                                            <span style={{ display: 'grid', gap: 3, flex: 1 }}>
                                                <span
                                                    style={{
                                                        fontSize: 'var(--text-sm)',
                                                        fontWeight: 700,
                                                        color: 'var(--text)',
                                                    }}
                                                >
                                                    {option.name[locale]}
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: 'var(--text-xs)',
                                                        color: 'var(--text-muted)',
                                                    }}
                                                >
                                                    {option.note[locale]}
                                                </span>
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* bước 3 */}
                        <div style={CARD}>
                            <StepHeading n={3} title={L.step3[locale]} />

                            <div
                                style={{
                                    display: 'grid',
                                    gap: 'var(--space-2)',
                                    marginBottom: 'var(--space-4)',
                                }}
                            >
                                {POLICIES[locale].map((line, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            display: 'flex',
                                            gap: 'var(--space-3)',
                                            alignItems: 'flex-start',
                                        }}
                                    >
                                        <span
                                            aria-hidden="true"
                                            style={{
                                                display: 'grid',
                                                placeItems: 'center',
                                                width: 18,
                                                height: 18,
                                                borderRadius: 'var(--radius-pill)',
                                                background: 'var(--surface-tint)',
                                                color: 'var(--brand)',
                                                fontSize: 11,
                                                fontWeight: 800,
                                                flexShrink: 0,
                                                marginTop: 1,
                                            }}
                                        >
                                            ✓
                                        </span>
                                        <span
                                            style={{
                                                fontSize: 'var(--text-sm)',
                                                lineHeight: 1.6,
                                                color: 'var(--text-muted)',
                                            }}
                                        >
                                            {line}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <label
                                htmlFor="co-agree"
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 'var(--space-3)',
                                    cursor: 'pointer',
                                    padding: 'var(--space-4)',
                                    borderRadius: 'var(--radius)',
                                    background: 'var(--surface-alt)',
                                }}
                            >
                                <input
                                    id="co-agree"
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={() => setAgreed((v) => !v)}
                                    style={{
                                        margin: '2px 0 0',
                                        width: 17,
                                        height: 17,
                                        accentColor: 'var(--brand)',
                                        flexShrink: 0,
                                    }}
                                />
                                <span
                                    style={{
                                        fontSize: 'var(--text-sm)',
                                        lineHeight: 1.6,
                                        color: 'var(--text)',
                                    }}
                                >
                                    {L.agree[locale]}
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* ---- cột phải: đơn hàng dính ---- */}
                    <aside className="ui-checkout-aside" style={{ display: 'grid', gap: 'var(--space-4)' }}>
                        <div
                            style={{
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-lg)',
                                boxShadow: 'var(--shadow)',
                                overflow: 'hidden',
                                background: 'var(--surface)',
                            }}
                        >
                            <div
                                style={{
                                    padding: 'var(--space-5)',
                                    background: 'var(--surface-inverse)',
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 'var(--text-xs)',
                                        fontWeight: 700,
                                        letterSpacing: '0.08em',
                                        textTransform: 'uppercase',
                                        color: 'var(--accent)',
                                        marginBottom: 4,
                                    }}
                                >
                                    {L.orderTitle[locale]}
                                </div>
                                <div
                                    style={{
                                        fontSize: 'var(--text-sm)',
                                        color: 'var(--text-inverse)',
                                        opacity: 0.7,
                                    }}
                                >
                                    {L.orderSub[locale]}
                                </div>
                            </div>

                            <div style={{ padding: 'var(--space-5)' }}>
                                {/* phòng đang đặt */}
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: 'var(--space-3)',
                                        paddingBottom: 'var(--space-4)',
                                        borderBottom: '1px solid var(--border)',
                                        marginBottom: 'var(--space-4)',
                                    }}
                                >
                                    <div
                                        style={{
                                            position: 'relative',
                                            width: 86,
                                            height: 66,
                                            borderRadius: 'var(--radius)',
                                            overflow: 'hidden',
                                            background: 'var(--surface-alt)',
                                            flexShrink: 0,
                                        }}
                                    >
                                        {room.images?.[0] && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={room.images[0]}
                                                alt={pick(room.name, locale)}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        )}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div
                                            style={{
                                                fontSize: 'var(--text-sm)',
                                                fontWeight: 700,
                                                color: 'var(--text)',
                                                lineHeight: 1.4,
                                                marginBottom: 4,
                                            }}
                                        >
                                            {pick(room.name, locale)}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 'var(--text-xs)',
                                                color: 'var(--text-muted)',
                                            }}
                                        >
                                            {room.area} · {room.guests} {L.guestsWord[locale]}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 'var(--text-sm)',
                                                fontWeight: 700,
                                                color: 'var(--brand)',
                                                marginTop: 4,
                                            }}
                                        >
                                            {formatPrice(room.price, locale)}
                                        </div>
                                    </div>
                                </div>

                                {/* số đêm */}
                                <div
                                    style={{
                                        display: 'grid',
                                        gap: 'var(--space-2)',
                                        marginBottom: 'var(--space-4)',
                                    }}
                                >
                                    <span style={LABEL}>{L.nights[locale]}</span>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: 'var(--space-2) var(--space-3)',
                                            border: '1px solid var(--border)',
                                            borderRadius: 'var(--radius)',
                                            background: 'var(--surface-alt)',
                                        }}
                                    >
                                        <StepperButton
                                            label="−"
                                            onClick={() => setNights((n) => Math.max(1, n - 1))}
                                            aria-label={
                                                locale === 'vi' ? 'Giảm số đêm' : 'Decrease nights'
                                            }
                                        />
                                        <span
                                            aria-live="polite"
                                            style={{
                                                fontSize: 'var(--text-sm)',
                                                fontWeight: 700,
                                                color: 'var(--text)',
                                            }}
                                        >
                                            {nights} {L.nightsWord[locale]}
                                        </span>
                                        <StepperButton
                                            label="+"
                                            onClick={() => setNights((n) => Math.min(30, n + 1))}
                                            aria-label={
                                                locale === 'vi' ? 'Tăng số đêm' : 'Increase nights'
                                            }
                                        />
                                    </div>
                                </div>

                                {/* tiện ích */}
                                <div
                                    style={{
                                        display: 'grid',
                                        gap: 'var(--space-2)',
                                        marginBottom: 'var(--space-4)',
                                    }}
                                >
                                    {data.addons.map((addon) => (
                                        <label
                                            key={addon.id}
                                            htmlFor={`co-addon-${addon.id}`}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: 'var(--space-3)',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <input
                                                id={`co-addon-${addon.id}`}
                                                type="checkbox"
                                                checked={!!addons[addon.id]}
                                                onChange={() =>
                                                    setAddons((prev) => ({
                                                        ...prev,
                                                        [addon.id]: !prev[addon.id],
                                                    }))
                                                }
                                                style={{
                                                    margin: '2px 0 0',
                                                    width: 16,
                                                    height: 16,
                                                    accentColor: 'var(--brand)',
                                                    flexShrink: 0,
                                                }}
                                            />
                                            <span
                                                style={{
                                                    flex: 1,
                                                    fontSize: 'var(--text-sm)',
                                                    color: 'var(--text)',
                                                }}
                                            >
                                                {pick(addon.name, locale)}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: 'var(--text-xs)',
                                                    color: 'var(--text-muted)',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {formatPrice(addon.price, locale)}
                                            </span>
                                        </label>
                                    ))}
                                </div>

                                {/* bảng tiền */}
                                <div
                                    style={{
                                        display: 'grid',
                                        gap: 'var(--space-2)',
                                        paddingTop: 'var(--space-4)',
                                        borderTop: '1px solid var(--border)',
                                    }}
                                >
                                    <SumRow
                                        label={`${L.roomsTotal[locale]} · ${nights} ${L.nightsWord[locale]}`}
                                        value={formatPrice(roomsSubtotal, locale)}
                                    />
                                    <SumRow
                                        label={L.addonsTotal[locale]}
                                        value={formatPrice(addonsSubtotal, locale)}
                                    />

                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'baseline',
                                            justifyContent: 'space-between',
                                            paddingTop: 'var(--space-3)',
                                            marginTop: 4,
                                            borderTop: '1px solid var(--border)',
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 'var(--text-sm)',
                                                fontWeight: 800,
                                                color: 'var(--text)',
                                            }}
                                        >
                                            {L.total[locale]}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: 'var(--text-xl)',
                                                fontWeight: 800,
                                                color: 'var(--brand)',
                                                letterSpacing: '-0.02em',
                                            }}
                                        >
                                            {formatPrice(total, locale)}
                                        </span>
                                    </div>

                                    {/* Cọc và số còn lại — khách Việt luôn hỏi hai con
                                        số này (xem booking-domain §B1). */}
                                    <SumRow
                                        label={L.deposit[locale].replace('{p}', String(depositPercent))}
                                        value={formatPrice(deposit, locale)}
                                        strong
                                    />
                                    <SumRow
                                        label={L.balance[locale]}
                                        value={formatPrice(balance, locale)}
                                    />
                                </div>

                                <button
                                    type="button"
                                    disabled={!agreed}
                                    style={{
                                        width: '100%',
                                        marginTop: 'var(--space-5)',
                                        padding: 'var(--space-4)',
                                        borderRadius: 'var(--radius-pill)',
                                        border: 'none',
                                        background: agreed ? 'var(--accent)' : 'var(--border)',
                                        color: agreed ? 'var(--text-inverse)' : 'var(--text-muted)',
                                        fontSize: 'var(--text-sm)',
                                        fontFamily: 'var(--font-body)',
                                        fontWeight: 800,
                                        cursor: agreed ? 'pointer' : 'not-allowed',
                                        minHeight: 48,
                                    }}
                                >
                                    {agreed
                                        ? `${L.payNow[locale]} ${formatPrice(deposit, locale)}`
                                        : L.payDisabled[locale]}
                                </button>

                                <p
                                    style={{
                                        margin: 'var(--space-3) 0 0',
                                        fontSize: 'var(--text-xs)',
                                        lineHeight: 1.6,
                                        color: 'var(--text-muted)',
                                        textAlign: 'center',
                                    }}
                                >
                                    {L.secureNote[locale]}
                                </p>
                                <p
                                    style={{
                                        margin: 'var(--space-2) 0 0',
                                        fontSize: 'var(--text-xs)',
                                        lineHeight: 1.6,
                                        color: 'var(--warning)',
                                        textAlign: 'center',
                                        fontWeight: 600,
                                    }}
                                >
                                    {L.demoNote[locale]}
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            <PageFooter {...shellPropsOf(data, locale, slug, t)} />

            <style>{`
                .ui-form-grid { grid-template-columns: minmax(0, 1fr); }
                @media (min-width: 560px) {
                    .ui-form-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                }
                @media (min-width: 1040px) {
                    .ui-checkout-layout { grid-template-columns: minmax(0, 1fr) minmax(0, 400px); }
                    .ui-checkout-aside { position: sticky; top: 100px; }
                }
            `}</style>
        </PageBody>
    )
}

// -------------------------------------------------------------------- phụ trợ

function StepHeading({ n, title }: { n: number; title: string }) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                marginBottom: 'var(--space-5)',
            }}
        >
            <span
                aria-hidden="true"
                style={{
                    display: 'grid',
                    placeItems: 'center',
                    width: 28,
                    height: 28,
                    borderRadius: 'var(--radius-pill)',
                    background: 'var(--brand)',
                    color: 'var(--text-inverse)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 700,
                    flexShrink: 0,
                }}
            >
                {n}
            </span>
            <h2
                style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-lg)',
                    fontWeight: 800,
                    color: 'var(--text)',
                    margin: 0,
                    letterSpacing: '-0.02em',
                }}
            >
                {title}
            </h2>
        </div>
    )
}

function Field({
    id,
    label,
    type = 'text',
    placeholder,
}: {
    id: string
    label: string
    type?: string
    placeholder?: string
}) {
    return (
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
            <label htmlFor={id} style={LABEL}>
                {label}
            </label>
            <input id={id} type={type} placeholder={placeholder} style={INPUT} />
        </div>
    )
}

function StepperButton({
    label,
    onClick,
    'aria-label': ariaLabel,
}: {
    label: string
    onClick: () => void
    'aria-label': string
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={ariaLabel}
            style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius)',
                border: 'none',
                background: 'var(--surface)',
                cursor: 'pointer',
                fontSize: 16,
                fontWeight: 700,
                color: 'var(--brand)',
                flexShrink: 0,
            }}
        >
            {label}
        </button>
    )
}

function SumRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--space-3)',
                fontSize: 'var(--text-sm)',
                color: strong ? 'var(--text)' : 'var(--text-muted)',
            }}
        >
            <span>{label}</span>
            <span style={{ fontWeight: strong ? 800 : 600, color: 'var(--text)' }}>{value}</span>
        </div>
    )
}

const CARD: CSSProperties = {
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-6)',
    background: 'var(--surface)',
}

const LABEL: CSSProperties = {
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--text-muted)',
}

const INPUT: CSSProperties = {
    width: '100%',
    padding: 'var(--space-3) var(--space-4)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    fontSize: 'var(--text-sm)',
    fontFamily: 'var(--font-body)',
    background: 'var(--surface-alt)',
    color: 'var(--text)',
    minHeight: 44,
}
