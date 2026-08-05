'use client'

import { siteHeaderPropsOf } from '@repo/domain-hotel'
import { SiteHeader } from '@repo/ui-layout'
import type { Locale, PropertyData } from '@repo/core'
import type { ReactNode } from 'react'

import { meta } from '../meta'

/**
 * Header mẫu 07 — nay dùng chung `SiteHeader` của `@repo/ui-layout`.
 *
 * VÌ SAO KHÔNG CÒN MARKUP RIÊNG: bản trước (214 dòng) dựng hai bố cục desktop
 * và mobile tách hẳn nhau, tự khai lại icon SVG đã có ở nơi khác, và không có
 * menu tài khoản. Bản dùng chung — trích từ app resort, bản đầy đủ tính năng
 * nhất — có đủ những thứ đó.
 *
 * BẢN SẮC CỦA MẪU NẰM Ở ĐÂU: hoàn toàn trong `tokens.css`. Cùng một markup,
 * h1 ra xanh biển #1173B8, h2 ra navy #075E9E, CTA vàng nghệ #F5B921 (luật R4:
 * theme là hình thức, không phải cấu trúc).
 *
 * `transparentOnTop` bật: mẫu này có hero ảnh tràn viền nên header phải trong
 * suốt ở đỉnh rồi đặc lại khi cuộn — đúng bản thiết kế.
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
    return (
        <SiteHeader
            {...siteHeaderPropsOf(data, locale, meta.slug)}
            extra={extra}
            transparentOnTop
        />
    )
}
