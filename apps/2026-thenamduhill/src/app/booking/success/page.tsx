'use client'

/**
 * Bước 5 — xác nhận đặt phòng thành công.
 *
 * Mã đơn hiện thật to vì đây là thứ khách chụp màn hình và đọc qua điện thoại
 * cho lễ tân. Mọi thứ khác là phụ.
 *
 * VÌ SAO LÀ ROUTE RIÊNG chứ không phải bước thứ 5 trong state của `/booking`:
 * đơn đã tạo xong rồi. Khách F5, bấm back, hay gửi link cho người đi cùng đều
 * không được kích hoạt lại `createBooking()`. Stepper dùng chung với `/booking`
 * để khách vẫn thấy mình đang đứng ở cuối một luồng 5 bước.
 */

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { formatPrice, getPropertySync, pick } from '@repo/core'
import { Badge, Button } from '@repo/ui'
import { LocaleProvider, useLocale } from '@/components/LocaleProvider'
import { useBookingStore } from '@/stores/booking.store'
import { S, STATUS_LABEL, STATUS_TONE, tr } from '@/strings'
import { Stepper } from '../Stepper'

export default function SuccessPage() {
    return (
        <LocaleProvider>
            <Suspense fallback={null}>
                <SuccessScreen />
            </Suspense>
        </LocaleProvider>
    )
}

function SuccessScreen() {
    const { locale } = useLocale()
    const params = useSearchParams()
    const bookingId = params.get('id') ?? ''
    const booking = useBookingStore((s) => s.bookings.find((b) => b.id === bookingId))

    const property = getPropertySync()
    const room = booking ? property.rooms.find((r) => r.id === booking.roomTypeId) : undefined

    return (
        <main
            data-theme="h3"
            style={{
                minHeight: '100vh',
                padding: 'var(--space-4) var(--space-3) var(--space-6)',
                background: 'var(--surface-alt)',
                fontFamily: 'var(--font-body)',
                color: 'var(--text)',
            }}
        >
            <div style={{ maxWidth: 560, margin: '0 auto' }}>
                {/* Bước 5 của cùng một luồng — khách phải thấy mình đã đi hết
                    đường, không phải rơi vào một trang lạ (ticket §4.1). */}
                <Stepper current={5} />
            </div>

            <div
                style={{
                    width: '100%',
                    maxWidth: 560,
                    margin: 'var(--space-4) auto 0',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-4)',
                    textAlign: 'center',
                }}
            >
                {!booking ? (
                    <>
                        <h1
                            style={{
                                fontSize: 'var(--text-xl)',
                                margin: '0 0 var(--space-2)',
                                fontFamily: 'var(--font-display)',
                            }}
                        >
                            {tr(S.bookingNotFound, locale)}
                        </h1>
                        {/* Trạng thái rỗng phải chỉ đường đi tiếp (luật FE7). */}
                        <p
                            style={{
                                margin: '0 0 var(--space-4)',
                                fontSize: 'var(--text-sm)',
                                color: 'var(--text-muted)',
                                lineHeight: 1.6,
                            }}
                        >
                            {tr(S.bookingNotFoundHint, locale)}
                        </p>
                        <div
                            style={{
                                display: 'flex',
                                gap: 'var(--space-2)',
                                justifyContent: 'center',
                                flexWrap: 'wrap',
                            }}
                        >
                            <Link href="/my-orders" style={{ textDecoration: 'none' }}>
                                <Button size="lg">{tr(S.viewMyOrders, locale)}</Button>
                            </Link>
                            <Link href="/h3" style={{ textDecoration: 'none' }}>
                                <Button variant="secondary" size="lg">
                                    {tr(S.backHome, locale)}
                                </Button>
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <div
                            aria-hidden="true"
                            style={{
                                width: 56,
                                height: 56,
                                margin: '0 auto var(--space-3)',
                                display: 'grid',
                                placeItems: 'center',
                                borderRadius: '50%',
                                background: 'var(--success-bg)',
                                color: 'var(--success)',
                            }}
                        >
                            <SuccessCheck />
                        </div>

                        <h1
                            style={{
                                margin: '0 0 var(--space-2)',
                                fontSize: 'var(--text-2xl)',
                                fontFamily: 'var(--font-display)',
                            }}
                        >
                            {tr(S.bookingSuccess, locale)}
                        </h1>

                        <p
                            style={{
                                margin: '0 0 var(--space-4)',
                                fontSize: 'var(--text-sm)',
                                color: 'var(--text-muted)',
                                lineHeight: 1.6,
                            }}
                        >
                            {tr(S.successNote, locale)}
                        </p>

                        <div
                            style={{
                                padding: 'var(--space-4) var(--space-3)',
                                background: 'var(--surface-tint)',
                                borderRadius: 'var(--radius)',
                                marginBottom: 'var(--space-4)',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 'var(--text-xs)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em',
                                    color: 'var(--text-muted)',
                                    marginBottom: 'var(--space-2)',
                                }}
                            >
                                {tr(S.bookingCode, locale)}
                            </div>
                            <div
                                style={{
                                    fontSize: 'var(--text-2xl)',
                                    fontFamily: 'var(--font-display)',
                                    fontWeight: 700,
                                    letterSpacing: '0.04em',
                                    color: 'var(--brand)',
                                    fontVariantNumeric: 'tabular-nums',
                                }}
                            >
                                {booking.code}
                            </div>

                            <CheckInCode code={booking.code} />
                        </div>

                        <dl
                            style={{
                                display: 'grid',
                                gap: 'var(--space-2)',
                                margin: '0 0 var(--space-4)',
                                textAlign: 'left',
                                fontSize: 'var(--text-sm)',
                            }}
                        >
                            <SummaryRow
                                label={room ? pick(room.name, locale) : booking.roomTypeId}
                                value={
                                    <Badge tone={STATUS_TONE[booking.status]}>
                                        {tr(STATUS_LABEL[booking.status], locale)}
                                    </Badge>
                                }
                            />
                            <SummaryRow
                                label={`${tr(S.checkIn, locale)} → ${tr(S.checkOut, locale)}`}
                                value={`${booking.checkIn} → ${booking.checkOut}`}
                            />
                            <SummaryRow
                                label={tr(S.totalAmount, locale)}
                                value={
                                    <strong>{formatPrice(booking.totalAmount, locale)}</strong>
                                }
                            />
                            <SummaryRow
                                label={tr(S.deposit, locale)}
                                value={formatPrice(booking.paidAmount, locale)}
                            />
                        </dl>

                        <div
                            style={{
                                display: 'flex',
                                gap: 'var(--space-2)',
                                justifyContent: 'center',
                                flexWrap: 'wrap',
                            }}
                        >
                            <Link
                                href={`/my-orders/${booking.id}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <Button size="lg">{tr(S.viewMyOrders, locale)}</Button>
                            </Link>
                            <Link href="/h3" style={{ textDecoration: 'none' }}>
                                <Button variant="secondary" size="lg">
                                    {tr(S.backHome, locale)}
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </main>
    )
}

/**
 * Mã nhận phòng để lễ tân quét.
 *
 * ⚠️ ĐÂY LÀ BẢN TẠM, CHƯA PHẢI QR THẬT — xem `MANUAL.md` mục **M20**.
 * Repo chưa có thư viện mã hoá QR, và tự viết bộ mã hoá (Reed-Solomon, mặt nạ,
 * phiên bản) là ~300 dòng thuật toán không ai trong nhóm kiểm chứng được bằng
 * mắt: một lỗi lệch bit thì mã vẫn VẼ RA ĐẸP nhưng máy quét không đọc nổi, và
 * chỉ phát hiện khi khách đã đứng ở quầy. Thêm dependency là quyết định của SA
 * (§6.2 chốt "không tạo package mới"), nên để SA chọn ở `200-07`.
 *
 * Trong lúc chờ, hiển thị mã đơn ở dạng ĐỌC ĐƯỢC BẰNG MẮT và tách nhóm ký tự —
 * đây mới là thứ khách thật sự dùng: đọc qua điện thoại cho lễ tân. Không vẽ
 * một ô vuông giả hình QR, vì khách sẽ chĩa máy vào đó và không quét được.
 */
function CheckInCode({ code }: { code: string }) {
    const { locale } = useLocale()

    return (
        <div
            style={{
                marginTop: 'var(--space-3)',
                paddingTop: 'var(--space-3)',
                borderTop: '1px solid var(--border)',
            }}
        >
            <div
                style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-muted)',
                    marginBottom: 'var(--space-1)',
                }}
            >
                {tr(S.checkInCodeHint, locale)}
            </div>
            <div
                style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    fontSize: 'var(--text-lg)',
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    color: 'var(--text)',
                    wordBreak: 'break-all',
                }}
            >
                {code}
            </div>
        </div>
    )
}

/** Dấu tích SVG — không dùng emoji trong sản phẩm mới (luật FE9/D5). */
function SuccessCheck() {
    return (
        <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    )
}

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 'var(--space-4)',
            }}
        >
            <dt style={{ color: 'var(--text-muted)' }}>{label}</dt>
            <dd style={{ margin: 0, textAlign: 'right' }}>{value}</dd>
        </div>
    )
}
