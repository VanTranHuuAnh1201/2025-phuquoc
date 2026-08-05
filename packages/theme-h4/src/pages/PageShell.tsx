import type { ReactNode } from 'react'
import { pick, type Locale, type PropertyData } from '@repo/core'
import { siteFooterPropsOf, siteHeaderPropsOf } from '@repo/domain-hotel'
import { SiteFooter, SiteHeader } from '@repo/ui-layout'

import { meta } from '../meta'
import { Container } from '../sections/primitives'

/**
 * Khung dùng chung của các trang con mẫu 04.
 *
 * Cả `Rooms` và `RoomDetail` lặp lại đúng ba khối: header, một dải mở đầu có
 * breadcrumb, chân trang. Gom vào đây thay vì chép hai lần — và khi có trang
 * con thứ ba thì nó lấy sẵn cùng nhịp, không phải căn lại (P0/P7).
 *
 * KHÁC HERO CỦA TRANG CHỦ: trang con KHÔNG dùng ảnh nền cho tiêu đề. Chữ nằm
 * trên nền ngà đặc → tương phản AAA không phụ thuộc vào việc ảnh sáng hay tối
 * (P15). Ảnh của trang con xuất hiện ở thân trang, trong `Frame` có scrim.
 *
 * `transparentOnTop={false}`: không có ảnh sau header thì header phải đặc
 * ngay từ đầu, nếu không chữ nav sẽ nằm trên nền ngà mà vẫn đang màu sáng.
 */

export interface Crumb {
    label: string
    href?: string
}

export function PageShell({
    data,
    locale,
    extra,
    children,
}: {
    data: PropertyData
    locale: Locale
    extra?: ReactNode
    children: ReactNode
}) {
    return (
        <div
            data-theme="h4"
            className="font-primary overflow-x-clip bg-surface-base text-text-primary"
        >
            {/* `locales={[]}` — cùng lý do như ở `composition.tsx`: tránh hai
                bộ chuyển ngôn ngữ cạnh nhau khi app cắm `AccountBar`. */}
            <SiteHeader
                {...siteHeaderPropsOf(data, locale, meta.slug)}
                locales={[]}
                extra={extra}
            />
            <main>{children}</main>
            <SiteFooter {...siteFooterPropsOf(data, locale, meta.slug)} />
        </div>
    )
}

/**
 * Dải mở đầu của trang con — breadcrumb + tiêu đề + dẫn nhập.
 *
 * `pt` lớn để chừa chỗ cho header cố định. Nhịp dưới nhỏ hơn nhịp section
 * thường (`--space-5`) vì đây là phần mở, không phải một section độc lập.
 */
export function PageOpening({
    crumbs,
    title,
    lede,
    aside,
}: {
    crumbs: Crumb[]
    title: string
    lede?: string
    /** Khối phụ bên phải — vd số lượng kết quả. */
    aside?: ReactNode
}) {
    return (
        <section className="border-b border-solid border-[var(--border)] bg-surface-base pt-[calc(var(--space-6)+var(--space-5))] pb-[var(--space-5)]">
            <Container>
                <nav aria-label="Breadcrumb" className="mb-6">
                    <ol className="m-0 flex flex-wrap items-center gap-2 p-0 text-xs tracking-[0.12em] text-text-tertiary uppercase">
                        {crumbs.map((crumb, index) => (
                            <li key={index} className="flex items-center gap-2">
                                {index > 0 && (
                                    <span aria-hidden="true" className="text-[var(--border)]">
                                        /
                                    </span>
                                )}
                                {crumb.href ? (
                                    <a
                                        href={crumb.href}
                                        className="text-inherit no-underline underline-offset-4 hover:text-brand hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)]"
                                    >
                                        {crumb.label}
                                    </a>
                                ) : (
                                    <span aria-current="page" className="text-text-secondary">
                                        {crumb.label}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>

                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex flex-col gap-4">
                        <h1 className="m-0 font-display text-2xl leading-[1.12] font-normal tracking-[-0.015em] text-balance text-text-primary md:text-3xl">
                            {title}
                        </h1>
                        {lede && (
                            <p className="m-0 max-w-[var(--measure)] text-base leading-[var(--line-height-base)] text-text-secondary">
                                {lede}
                            </p>
                        )}
                    </div>
                    {aside && <div className="shrink-0">{aside}</div>}
                </div>
            </Container>
        </section>
    )
}

/** Breadcrumb chuẩn: Trang chủ → (trang hiện tại). */
export function baseCrumbs(locale: Locale, homeLabel: { vi: string; en: string }) {
    return [{ label: pick(homeLabel, locale), href: `/${meta.slug}` }]
}
