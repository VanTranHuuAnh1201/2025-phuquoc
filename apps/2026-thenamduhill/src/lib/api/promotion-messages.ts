import type { I18nText, PromotionRejectReason } from '@repo/core'

const PROMOTION_REASON_MESSAGES: Record<PromotionRejectReason, I18nText> = {
    inactive: {
        vi: 'Khuyến mãi hiện không hoạt động.',
        en: 'This promotion is currently inactive.',
    },
    'code-required': {
        vi: 'Vui lòng nhập mã khuyến mãi.',
        en: 'Please enter a promotion code.',
    },
    'code-mismatch': {
        vi: 'Mã khuyến mãi không chính xác hoặc không tồn tại.',
        en: 'Invalid promotion code.',
    },
    'stay-window': {
        vi: 'Khuyến mãi không áp dụng cho khoảng thời gian lưu trú đã chọn.',
        en: 'Promotion is not valid for the selected stay dates.',
    },
    'book-window': {
        vi: 'Khuyến mãi đã hết hạn hoặc chưa đến đợt áp dụng.',
        en: 'Promotion booking window is not active.',
    },
    'room-type': {
        vi: 'Mã khuyến mãi không áp dụng cho hạng phòng này.',
        en: 'Promotion is not applicable to this room type.',
    },
    'rate-plan': {
        vi: 'Mã khuyến mãi không áp dụng cho gói giá này.',
        en: 'Promotion is not applicable to this rate plan.',
    },
    'min-nights': {
        vi: 'Chưa đủ số đêm tối thiểu để áp dụng khuyến mãi.',
        en: 'Minimum stay requirement for this promotion is not met.',
    },
    'max-nights': {
        vi: 'Vượt quá số đêm tối đa áp dụng khuyến mãi.',
        en: 'Stay exceeds maximum nights limit for this promotion.',
    },
    'min-amount': {
        vi: 'Chưa đạt giá trị đơn tối thiểu để áp dụng khuyến mãi.',
        en: 'Minimum booking amount for this promotion is not met.',
    },
    weekday: {
        vi: 'Khuyến mãi chỉ áp dụng cho một số ngày trong tuần nhất định.',
        en: 'Promotion is valid only on specified weekdays.',
    },
    'lead-time': {
        vi: 'Thời gian đặt phòng không thỏa mãn điều kiện khuyến mãi.',
        en: 'Booking lead time does not meet promotion conditions.',
    },
    channel: {
        vi: 'Khuyến mãi không áp dụng cho kênh đặt phòng này.',
        en: 'Promotion is not valid for this booking channel.',
    },
    'usage-limit': {
        vi: 'Mã khuyến mãi đã hết lượt sử dụng.',
        en: 'Promotion usage limit has been reached.',
    },
    'per-customer-limit': {
        vi: 'Bạn đã sử dụng hết lượt cho phép của mã khuyến mãi này.',
        en: 'You have reached your limit for this promotion.',
    },
    'superseded-by-exclusive': {
        vi: 'Bị thay thế bởi khuyến mãi độc quyền có ưu tiên cao hơn.',
        en: 'Superseded by a higher priority exclusive promotion.',
    },
}

export function formatPromotionReason(reason: PromotionRejectReason): I18nText {
    return (
        PROMOTION_REASON_MESSAGES[reason] ?? {
            vi: 'Mã khuyến mãi không áp dụng cho lựa chọn này.',
            en: 'Promotion code is not applicable to this selection.',
        }
    )
}
