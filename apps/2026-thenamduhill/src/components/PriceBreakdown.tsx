'use client'

/**
 * Bảng giải thích giá.
 *
 * Đây là component quan trọng nhất về mặt lòng tin: khách và admin nhìn CÙNG
 * một bảng, dựng từ CÙNG một `Quote` (luật R8). Nếu hai bên thấy số khác nhau
 * thì mọi thứ khác trở nên vô nghĩa.
 *
 * Mẫu bảng: `.claude/rules/booking-domain.md` §B4.
 */

import { formatPrice, getPropertySync, pick } from '@repo/core'
import type { BookingPriceLine, Locale, Quote } from '@repo/core'
import { S, tr } from '@/strings'

export interface PriceBreakdownProps {
    quote: Quote
    locale: Locale
    /** Hiện dòng cọc và số còn lại. Tắt ở thẻ phòng, bật ở màn thanh toán. */
    showDeposit?: boolean
    /** Hiện cách tính của từng khuyến mãi. Bật ở màn xem trước của admin. */
    explainPromotions?: boolean
}

/**
 * Nhãn hiển thị của một dòng giá.
 *
 * Tách ra khỏi component vì màn chi tiết đơn của lễ tân
 * (`admin/orders/[id]`) dựng bảng từ `Booking.priceLines` đã lưu chứ không từ
 * `Quote` sống, nên không dùng lại được cả component — nhưng **phải** dùng
 * chung đúng quy tắc đặt nhãn này. Có hai bản sao là sớm muộn lệch nhau, và
 * `kind` là mã nội bộ nên lệch nghĩa là lộ chữ "extra-bed" ra cho khách.
 */
export function priceLineLabel(line: BookingPriceLine, locale: Locale): string {
    if (line.label) return pick(line.label, locale)
    const property = getPropertySync()
    switch (line.kind) {
        case 'room': {
            const room = property.rooms.find((r) => r.id === line.refId)
            const name = room ? pick(room.name, locale) : tr(S.roomCharge, locale)
            return `${name} · ${line.quantity} ${tr(S.nights, locale)}`
        }
        case 'extra-bed':
            return `${tr(S.extraBed, locale)} · ${line.quantity}`
        case 'child':
            return `${tr(S.childCharge, locale)} · ${line.quantity}`
        case 'addon': {
            const addon = property.addons.find((a) => a.id === line.refId)
            const name = addon ? pick(addon.name, locale) : line.refId
            return `${name} · ${line.quantity}`
        }
        case 'surcharge':
            return line.refId
    }
}

export function PriceBreakdown({
    quote,
    locale,
    showDeposit = true,
    explainPromotions = false,
}: PriceBreakdownProps) {
    const labelOf = (line: BookingPriceLine): string => priceLineLabel(line, locale)

    return (
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            {quote.lines.map((line, index) => (
                <Row
                    key={`${line.kind}-${line.refId}-${index}`}
                    label={labelOf(line)}
                    value={formatPrice(line.total, locale)}
                />
            ))}

            {quote.lines.length > 0 && <Divider />}

            <Row
                label={tr(S.subtotal, locale)}
                value={formatPrice(quote.subtotal, locale)}
                muted
            />

            {quote.promotion.applied.length > 0 && (
                <>
                    <div
                        style={{
                            fontSize: 'var(--text-xs)',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            color: 'var(--success)',
                            marginTop: 'var(--space-2)',
                        }}
                    >
                        {tr(S.discount, locale)}
                    </div>

                    {quote.promotion.applied.map((applied) => (
                        <div key={applied.promotionId} style={{ display: 'grid', gap: 2 }}>
                            <Row
                                label={pick(applied.name, locale)}
                                value={`−${formatPrice(applied.discount, locale)}`}
                                tone="success"
                            />
                            {explainPromotions && (
                                <div
                                    style={{
                                        fontSize: 'var(--text-xs)',
                                        color: 'var(--text-muted)',
                                        paddingLeft: 'var(--space-3)',
                                    }}
                                >
                                    {tr(S.remainingAfter, locale)}:{' '}
                                    {formatPrice(applied.remainingAfter, locale)}
                                    {applied.cappedByMax && ` · ${tr(S.cappedNote, locale)}`}
                                </div>
                            )}
                        </div>
                    ))}
                </>
            )}

            <Divider />

            <Row
                label={tr(S.totalAmount, locale)}
                value={formatPrice(quote.totalAmount, locale)}
                strong
            />

            {showDeposit && quote.depositAmount < quote.totalAmount && (
                <>
                    <Row
                        label={tr(S.deposit, locale)}
                        value={formatPrice(quote.depositAmount, locale)}
                        tone="info"
                    />
                    <Row
                        label={tr(S.balanceDue, locale)}
                        value={formatPrice(quote.balanceDue, locale)}
                        muted
                    />
                </>
            )}
        </div>
    )
}

function Row({
    label,
    value,
    strong,
    muted,
    tone,
}: {
    label: string
    value: string
    strong?: boolean
    muted?: boolean
    tone?: 'success' | 'info'
}) {
    const color =
        tone === 'success'
            ? 'var(--success)'
            : tone === 'info'
              ? 'var(--info)'
              : muted
                ? 'var(--text-muted)'
                : 'var(--text)'

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: 'var(--space-4)',
                fontSize: strong ? 'var(--text-lg)' : 'var(--text-sm)',
                fontWeight: strong ? 700 : 400,
                color,
            }}
        >
            <span>{label}</span>
            <span style={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{value}</span>
        </div>
    )
}

function Divider() {
    return <hr style={{ border: 0, borderTop: '1px solid var(--border)', margin: 0 }} />
}
