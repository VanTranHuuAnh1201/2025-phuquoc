import { siteHeaderPropsOf } from '@repo/domain-hotel'
import { SiteHeader } from '@repo/ui-layout'
import type { Locale, PropertyData } from '@repo/core'
import type { ReactNode } from 'react'

import { meta } from '../meta'

/**
 * Header mẫu 01 — nay dùng chung `SiteHeader` của `@repo/ui-layout`.
 *
 * VÌ SAO KHÔNG CÒN MARKUP RIÊNG: bản trước chỉ có logo + nav + hotline + đổi
 * ngôn ngữ, thiếu nút đặt phòng, thiếu menu mobile (nav biến mất hoàn toàn
 * dưới 1081px), và chừa `pr-[170px]` cho một overlay đã chết. Bản dùng chung
 * — trích từ app resort — có đủ những thứ đó.
 *
 * BẢN SẮC CỦA MẪU NẰM Ở ĐÂU: hoàn toàn trong `tokens.css`. Cùng một markup,
 * h1 ra xanh biển #1173B8, h2 ra navy #075E9E. Đó đúng là điều kiến trúc này
 * sinh ra để làm (luật R4: theme là hình thức, không phải cấu trúc).
 *
 * `transparentOnTop` tắt: spec v4 §2.1 chốt nền ngà ĐẶC từ pixel đầu — một
 * website booking đáng tin trông như quầy lễ tân, không như poster.
 */
export function Header({
    data,
    locale,
    extra,
}: {
    data: PropertyData
    locale: Locale
    extra?: ReactNode
}) {
    return <SiteHeader {...siteHeaderPropsOf(data, locale, meta.slug)} extra={extra} />
}
