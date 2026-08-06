'use client'

import { useState } from 'react'
import {
    pick,
    telHref,
    themePath,
    themeRoot,
    UI,
    type BlogPost,
    type Locale,
    type PropertyData,
} from '@repo/core'
import { siteFooterPropsOf, siteHeaderPropsOf } from '@repo/domain-hotel'
import { ImageSlot } from '@repo/ui'
import { SiteFooter, SiteHeader } from '@repo/ui-layout'

import { meta } from '../meta'
import { H3 } from '../strings'

/**
 * Chi tiết một bài cẩm nang — BẢN RIÊNG CỦA MẪU 03.
 *
 * VÌ SAO KHÔNG DÙNG `BlogDetailPage` CỦA `@repo/domain-hotel`: bản dùng chung
 * mở bằng `PageHero` ảnh 420px rồi đổ một cột chữ. Mẫu 03 lấy bố cục của app
 * resort — breadcrumb chữ, tiêu đề cỡ `clamp`, thanh tác giả có nút chép liên
 * kết, ảnh mở màn 420px bo 24px, và một SIDEBAR DÍNH hai thẻ bên phải theo lưới
 * `1.65fr / 1fr`. Đóng lại bằng dải "đọc tiếp" ba thẻ. Khác nhau ở HÌNH THỨC
 * nên nó thuộc về theme (luật R4).
 *
 * VÌ SAO CÓ `'use client'` DÙ TRANG THUẦN ĐỌC: nút "Chép liên kết" cần
 * `navigator.clipboard` và một state hai giây để đổi nhãn thành "Đã chép". Nút
 * đó là một phần của thanh tác giả trong bản resort; bỏ đi là đổi bố cục chứ
 * không phải port bố cục.
 *
 * MÀU: riêng trang này bản resort dùng một bảng XANH BIỂN nhạt của một prototype
 * cũ, khác hẳn bảng navy mà ba trang kia dùng. Ánh xạ THEO VAI TRÒ chứ không
 * theo mã màu — link/nhấn → `--brand`, chữ mờ → `--text-soft`, nền nhạt →
 * `--surface-alt`, gạch trích dẫn → `--accent`. Sai lệch thị giác so với bản
 * resort là CỐ Ý: mẫu 03 là navy, và một trang lạc sang xanh biển là vi phạm
 * P1 (một Point of View duy nhất).
 *
 * `slug` mặc định về `meta.slug` vì registry hiện không truyền nó xuống.
 */

export interface BlogDetailPageProps {
    data: PropertyData
    locale: Locale
    slug?: string
    /** Bài đang xem. Route tra qua `getBlogPost(id)`. */
    post?: BlogPost
    /** Vài bài khác để gợi ý đọc tiếp. */
    related?: BlogPost[]
    extra?: React.ReactNode
}

export function BlogDetailPage({
    data,
    locale,
    slug = meta.slug,
    post,
    related = [],
    extra,
}: BlogDetailPageProps) {
    const [copied, setCopied] = useState(false)

    const blogHref = themePath(slug, 'blog')

    const copyLink = () => {
        if (typeof window !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    // Route đã `notFound()` khi không có bài; nhánh này giữ trang không sập nếu
    // một nơi gọi khác quên truyền.
    if (!post) {
        return (
            <div data-theme="h3" className="font-primary overflow-x-clip">
                <SiteHeader {...siteHeaderPropsOf(data, locale, slug)} extra={extra} />
                <main className="bg-surface text-text-primary min-h-screen pt-[140px] pb-[100px] text-center">
                    <h1 className="text-[28px] font-extrabold">{pick(UI.articleNotFound, locale)}</h1>
                    <p className="mb-[24px] text-[var(--text-muted)]">
                        {pick(UI.theRequestedArticleMayHaveBeen, locale)}
                    </p>
                    <a
                        href={blogHref}
                        className="bg-brand text-text-inverse inline-block rounded-full px-[24px] py-[12px] font-bold no-underline"
                    >
                        {pick(UI.backToJournal, locale)}
                    </a>
                </main>
                <SiteFooter {...siteFooterPropsOf(data, locale, slug)} />
            </div>
        )
    }

    const title = pick(post.title, locale)
    const author = pick(post.author, locale)
    const metaLine = `${pick(post.date, locale)} · ${post.readMin} ${pick(UI.minRead, locale)}`
    const heroCaption = pick(post.heroCaption, locale)

    /** Chữ cái đầu của hai từ cuối trong tên — đúng cách bản resort dựng avatar. */
    const authorInitials = author
        .split(' ')
        .slice(-2)
        .map((w) => w[0])
        .join('')
        .toUpperCase()

    return (
        <div data-theme="h3" className="font-primary overflow-x-clip">
            <SiteHeader {...siteHeaderPropsOf(data, locale, slug)} extra={extra} />

            <main className="bg-surface text-text-primary min-h-screen pt-[82px]">
                {/* Breadcrumb */}
                <div className="mx-auto max-w-[1320px] px-[32px] pt-[16px]">
                    <nav
                        aria-label="Breadcrumb"
                        className="flex flex-wrap items-center gap-[8px] pt-[12px] pb-[16px] text-[12.5px] font-semibold text-[var(--text-soft)]"
                    >
                        <a href={themeRoot(slug)} className="text-inherit no-underline">
                            {pick(UI.home, locale)}
                        </a>
                        <span aria-hidden="true">›</span>
                        <a href={blogHref} className="text-inherit no-underline">
                            {pick(UI.namDuJournal, locale)}
                        </a>
                        <span aria-hidden="true">›</span>
                        <span
                            className="max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap text-[var(--text-on-hero)]"
                            aria-current="page"
                        >
                            {title}
                        </span>
                    </nav>
                </div>

                {/* Lưới bài + sidebar */}
                <section className="mx-auto max-w-[1320px] px-[32px]">
                    <div className="h3-blog-layout grid items-start gap-[56px]">
                        <article>
                            <div className="mb-[14px] flex flex-wrap items-center gap-[10px]">
                                <span className="bg-brand text-text-inverse inline-block rounded-full px-[12px] py-[6px] text-[11.5px] font-extrabold tracking-[0.06em] whitespace-nowrap">
                                    {pick(post.category, locale)}
                                </span>
                                <span className="text-[12.5px] font-semibold text-[var(--text-soft)]">
                                    {metaLine}
                                </span>
                            </div>

                            {/* `clamp()` giữ nguyên từ bản resort — tiêu đề co theo bề
                                rộng khung chứ không nhảy bậc ở breakpoint. */}
                            <h1 className="font-display mb-[14px] text-[clamp(28px,3.4vw,44px)] leading-[1.08] font-extrabold tracking-[-0.034em] text-[var(--text-on-hero)] [text-wrap:balance]">
                                {title}
                            </h1>

                            <p className="mb-[24px] max-w-[62ch] text-[18px] leading-[1.6] text-[var(--text-muted)]">
                                {pick(post.lede, locale)}
                            </p>

                            {/* Thanh tác giả */}
                            <div className="border-border-muted mb-[28px] flex items-center gap-[12px] border-t border-b pt-[16px] pb-[22px]">
                                <div className="text-brand flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-[var(--surface-tint)] text-[13px] font-extrabold">
                                    {authorInitials}
                                </div>
                                <div className="flex flex-col leading-[1.3]">
                                    <span className="text-[13.5px] font-extrabold text-[var(--text-on-hero)]">
                                        {author}
                                    </span>
                                    <span className="text-[12px] font-medium text-[var(--text-soft)]">
                                        {pick(post.role, locale)}
                                    </span>
                                </div>
                                <div className="ml-auto flex items-center gap-[8px]">
                                    <button
                                        type="button"
                                        onClick={copyLink}
                                        // `aria-live` để trình đọc màn hình biết nhãn
                                        // vừa đổi sang "Đã chép" (luật D4).
                                        aria-live="polite"
                                        className="border-[var(--border-strong)] bg-surface cursor-pointer rounded-full border px-[14px] py-[9px] text-[12.5px] font-bold text-[var(--text-on-hero)] transition-[background] duration-150 hover:bg-[var(--surface-hover)]"
                                    >
                                        {copied ? pick(UI.copied, locale) : pick(UI.copyLink, locale)}
                                    </button>
                                </div>
                            </div>

                            {/* Ảnh mở màn */}
                            <div className="mb-[12px] h-[420px] overflow-hidden rounded-[24px] bg-[var(--surface-alt)]">
                                <ImageSlot placeholder={title} height="100%" />
                            </div>
                            {heroCaption && (
                                <div className="mb-[34px] text-[12px] font-medium text-[var(--text-soft)]">
                                    {heroCaption}
                                </div>
                            )}

                            {/* Thân bài — năm kiểu khối của `BlogBlock` */}
                            <div className="grid gap-[22px]">
                                {post.blocks.map((block, idx) => {
                                    const text = block.text ? pick(block.text, locale) : ''

                                    if (block.kind === 'h') {
                                        return (
                                            <h2
                                                key={idx}
                                                className="font-display mt-[12px] mb-[6px] text-[24px] font-extrabold tracking-[-0.026em] text-[var(--text-on-hero)]"
                                            >
                                                {text}
                                            </h2>
                                        )
                                    }

                                    if (block.kind === 'p') {
                                        // 66ch: chiều rộng dòng chữ dễ đọc (luật P15).
                                        return (
                                            <p
                                                key={idx}
                                                className="m-0 max-w-[66ch] text-[16.5px] leading-[1.75] text-[var(--text-muted)]"
                                            >
                                                {text}
                                            </p>
                                        )
                                    }

                                    if (block.kind === 'q') {
                                        return (
                                            <blockquote
                                                key={idx}
                                                className="m-0 border-l-[3px] border-[var(--accent)] py-[4px] pl-[22px] text-[19px] leading-[1.55] font-semibold tracking-[-0.015em] text-[var(--text-on-hero)]"
                                            >
                                                {text}
                                            </blockquote>
                                        )
                                    }

                                    if (block.kind === 'i') {
                                        return (
                                            <figure key={idx} className="m-0">
                                                <div className="h-[300px] overflow-hidden rounded-[20px] bg-[var(--surface-alt)]">
                                                    <ImageSlot placeholder={text} height="100%" />
                                                </div>
                                                {block.caption && (
                                                    <figcaption className="mt-[8px] text-[12px] font-medium text-[var(--text-soft)]">
                                                        {pick(block.caption, locale)}
                                                    </figcaption>
                                                )}
                                            </figure>
                                        )
                                    }

                                    if (block.kind === 'l' && block.items) {
                                        return (
                                            <div
                                                key={idx}
                                                className="border-border-muted grid gap-[9px] rounded-[20px] border bg-[var(--surface-alt)] px-[24px] py-[22px]"
                                            >
                                                {block.items.map((item, i) => (
                                                    <div key={i} className="flex items-start gap-[10px]">
                                                        <span
                                                            aria-hidden="true"
                                                            className="shrink-0 text-[13px] leading-[1.6] text-[var(--success)]"
                                                        >
                                                            ✓
                                                        </span>
                                                        <span className="text-[15px] leading-[1.6] text-[var(--text-muted)]">
                                                            {pick(item, locale)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    }

                                    return null
                                })}
                            </div>

                            {/* Thẻ chủ đề */}
                            <div className="border-border-muted mt-[40px] flex flex-wrap items-center gap-[8px] border-t pt-[26px]">
                                {post.tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="border-border-muted rounded-full border bg-[var(--surface-alt)] px-[14px] py-[8px] text-[12.5px] font-bold text-[var(--text-muted)]"
                                    >
                                        #{pick(tag, locale)}
                                    </span>
                                ))}
                            </div>
                        </article>

                        {/* Sidebar dính */}
                        <aside className="h3-blog-aside grid gap-[20px]">
                            {/* Bài khác */}
                            <div className="border-border-muted bg-surface rounded-[24px] border p-[24px] shadow-2">
                                <div className="mb-[16px] text-[10.5px] font-extrabold tracking-[0.13em] uppercase text-[var(--text-soft)]">
                                    {pick(UI.moreFromJournal, locale)}
                                </div>
                                <div className="grid gap-[12px]">
                                    {related.map((op) => (
                                        <a
                                            key={op.id}
                                            href={`${blogHref}/${op.id}`}
                                            className="h3-blog-related grid grid-cols-[72px_minmax(0,1fr)] items-center gap-[13px] rounded-[16px] p-[8px] no-underline transition-[background] duration-150"
                                        >
                                            <div className="h-[60px] overflow-hidden rounded-[12px] bg-[var(--surface-alt)]">
                                                <ImageSlot
                                                    placeholder={pick(op.title, locale)}
                                                    height="100%"
                                                />
                                            </div>
                                            <div>
                                                <div className="text-brand mb-[4px] text-[10px] font-extrabold tracking-[0.08em] uppercase">
                                                    {pick(op.category, locale)}
                                                </div>
                                                <div className="mb-[4px] text-[13.5px] leading-[1.3] font-bold tracking-[-0.016em] text-[var(--text-on-hero)]">
                                                    {pick(op.title, locale)}
                                                </div>
                                                <div className="text-[11.5px] font-medium text-[var(--text-soft)]">
                                                    {pick(op.date, locale)}
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                                <div className="bg-[var(--border-muted)] my-[16px] h-[1px]" />
                                <a
                                    href={themePath(slug, 'tours')}
                                    className="text-brand text-[13.5px] font-bold no-underline"
                                >
                                    {pick(UI.exploreNamDu, locale)}
                                </a>
                            </div>

                            {/* Khối mời đặt phòng */}
                            <div className="border-border-muted rounded-[24px] border bg-[var(--surface-alt)] p-[24px]">
                                <div className="mb-[6px] text-[16px] font-extrabold tracking-[-0.02em] text-[var(--text-on-hero)]">
                                    {pick(UI.planningYourIslandTrip, locale)}
                                </div>
                                <div className="mb-[16px] text-[13px] leading-[1.55] text-[var(--text-muted)]">
                                    {pick(UI.bookDirectForBestRateFree, locale)}
                                </div>
                                <div className="grid gap-[8px]">
                                    <a
                                        href={themePath(slug, 'rooms')}
                                        className="bg-brand text-text-inverse rounded-[14px] px-[20px] py-[14px] text-center text-[14px] font-bold no-underline"
                                    >
                                        {pick(H3.seeRoomTypes, locale)}
                                    </a>
                                    <a
                                        href={telHref(data.brand.phone)}
                                        className="border-[var(--border-strong)] bg-surface rounded-[14px] border px-[20px] py-[14px] text-center text-[14px] font-bold text-[var(--text-on-hero)] no-underline"
                                    >
                                        {pick(H3.callHotline, locale)} {data.brand.phone}
                                    </a>
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>

                {/* Dải đọc tiếp */}
                {related.length > 0 && (
                    <section className="mx-auto max-w-[1320px] px-[32px] pt-[80px] pb-[40px]">
                        <div className="mb-[24px] flex items-end justify-between gap-[40px]">
                            <h2 className="font-display m-0 text-[28px] font-extrabold tracking-[-0.028em] text-[var(--text-on-hero)]">
                                {pick(UI.keepReading, locale)}
                            </h2>
                            <a
                                href={themePath(slug, 'tours')}
                                className="text-brand text-[14px] font-bold whitespace-nowrap no-underline"
                            >
                                {pick(UI.exploreNamDu, locale)}
                            </a>
                        </div>

                        <div className="h3-blog-next grid gap-[18px]">
                            {related.slice(0, 3).map((op) => (
                                <a
                                    key={op.id}
                                    href={`${blogHref}/${op.id}`}
                                    className="border-border-muted bg-surface flex flex-col overflow-hidden rounded-[22px] border no-underline"
                                >
                                    <div className="h-[168px] bg-[var(--surface-alt)]">
                                        <ImageSlot placeholder={pick(op.title, locale)} height="100%" />
                                    </div>
                                    <div className="flex flex-1 flex-col px-[20px] pt-[18px] pb-[20px]">
                                        <div className="text-brand mb-[6px] text-[11px] font-extrabold tracking-[0.08em] uppercase">
                                            {pick(op.category, locale)}
                                        </div>
                                        <div className="mb-[8px] text-[16px] leading-[1.28] font-extrabold tracking-[-0.02em] text-[var(--text-on-hero)]">
                                            {pick(op.title, locale)}
                                        </div>
                                        <div className="mb-[12px] flex-1 text-[13.5px] leading-[1.55] text-[var(--text-muted)]">
                                            {pick(op.lede, locale)}
                                        </div>
                                        <div className="text-[12px] font-semibold text-[var(--text-soft)]">
                                            {pick(op.date, locale)} · {op.readMin} {pick(UI.min, locale)}
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <SiteFooter {...siteFooterPropsOf(data, locale, slug)} />

            {/* GIỮ `<style>`: ba lưới dưới đây là `grid-template-columns` KHÔNG
                ĐỀU (`1.65fr / 1fr`) và điểm ngắt 1024px không nằm trong thang
                arbitrary nào ngắn hơn. Bản resort dùng class `nd-grid-responsive`
                định nghĩa ở `globals.css` của app — thứ theme không mang theo
                được, nên khai tại chỗ (luật R5: mẫu tự mang hình thức của mình). */}
            <style>{`
                .h3-blog-layout { grid-template-columns: minmax(0, 1fr); }
                .h3-blog-next   { grid-template-columns: minmax(0, 1fr); }
                @media (min-width: 1024px) {
                    .h3-blog-layout { grid-template-columns: minmax(0, 1.65fr) minmax(0, 1fr); }
                    .h3-blog-next   { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                    .h3-blog-aside  { position: sticky; top: 96px; }
                }
                .h3-blog-related:hover { background: var(--surface-hover); }
            `}</style>
        </div>
    )
}
