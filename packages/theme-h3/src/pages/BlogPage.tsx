'use client'

import { useMemo, useState } from 'react'
import {
    pick,
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
import { ArrowRight, BookOpen, ChevronRight, Clock, Sparkles } from 'lucide-react'

import { meta } from '../meta'
import { H3 } from '../strings'

/**
 * Cẩm nang — BẢN RIÊNG CỦA MẪU 03.
 *
 * VÌ SAO KHÔNG DÙNG `BlogPage` CỦA `@repo/domain-hotel`: bản dùng chung mở bằng
 * `PageHero` ảnh tràn viền có breadcrumb. Mẫu 03 lấy bố cục của app resort —
 * dải nền trắng có breadcrumb chữ, thẻ bài nổi bật chia 12 cột `7 / 5`, rồi
 * thanh lọc chuyên mục cuộn ngang và lưới 3 cột. Khác nhau ở HÌNH THỨC nên nó
 * thuộc về theme (luật R4).
 *
 * VÌ SAO VẪN LÀ CLIENT COMPONENT: thanh lọc chuyên mục là một phần của bố cục
 * bản resort, và lọc bằng `useState` giữ được cảm giác tức thì. Bỏ nó đi để
 * trang thành Server Component là ĐỔI bố cục, không phải port bố cục. Chi phí
 * SEO thấp: nội dung bài vẫn render đầy đủ trong HTML đầu tiên, chỉ có nút lọc
 * cần JS.
 *
 * CHUYÊN MỤC SUY RA TỪ DỮ LIỆU, không khai cứng năm mục như bản resort: biên
 * tập thêm mục mới trong CMS là nút lọc tự xuất hiện, không phải sửa theme
 * (luật R5/R8). Khoá là bản tiếng Việt — ổn định khi người dùng đổi ngôn ngữ.
 *
 * `slug` mặc định về `meta.slug` vì registry hiện không truyền nó xuống.
 */

const ALL = '__all__'

export interface BlogPageProps {
    data: PropertyData
    locale: Locale
    slug?: string
    /** Danh sách bài. Route lấy qua `getBlogPosts()` rồi truyền xuống. */
    posts?: BlogPost[]
    extra?: React.ReactNode
}

export function BlogPage({
    data,
    locale,
    slug = meta.slug,
    posts = [],
    extra,
}: BlogPageProps) {
    const [category, setCategory] = useState<string>(ALL)

    const categories = useMemo(() => {
        const seen = new Map<string, string>()
        posts.forEach((post) => {
            if (!seen.has(post.category.vi)) seen.set(post.category.vi, pick(post.category, locale))
        })
        return [{ key: ALL, label: pick(H3.blogFilterAll, locale) }, ...[...seen.entries()].map(
            ([key, label]) => ({ key, label }),
        )]
    }, [posts, locale])

    const visible = category === ALL ? posts : posts.filter((p) => p.category.vi === category)

    const blogHref = themePath(slug, 'blog')
    const heroPost = posts[0]

    return (
        <div data-theme="h3" className="font-primary overflow-x-clip">
            <SiteHeader {...siteHeaderPropsOf(data, locale, slug)} extra={extra} />

            <main className="bg-surface-base text-text-primary min-h-screen pt-[80px] pb-[80px]">
                {/* Dải mở đầu */}
                <section className="bg-surface-raised border-border-muted border-b px-[16px] py-[40px] sm:px-[24px] lg:px-[32px]">
                    <div className="mx-auto max-w-[var(--container)] space-y-[12px]">
                        <nav
                            aria-label="Breadcrumb"
                            className="flex items-center gap-[8px] text-[12px] font-medium text-[var(--text-soft)]"
                        >
                            <a
                                href={themeRoot(slug)}
                                className="text-inherit no-underline transition hover:text-[var(--brand)]"
                            >
                                {pick(UI.home, locale)}
                            </a>
                            <ChevronRight
                                className="h-[14px] w-[14px] text-[var(--border-strong)]"
                                aria-hidden="true"
                            />
                            <span className="font-semibold text-[var(--brand-dark)]" aria-current="page">
                                {pick(UI.namDuJournal, locale)}
                            </span>
                        </nav>

                        <div className="max-w-[768px] space-y-[8px]">
                            <div className="text-brand inline-flex items-center gap-[6px] rounded-full bg-[var(--surface-tint)] px-[12px] py-[4px] text-[12px] font-semibold">
                                <BookOpen className="h-[14px] w-[14px]" aria-hidden="true" />
                                <span>{pick(UI.notesFromTheNamDuHill, locale)}</span>
                            </div>

                            <h1 className="font-display text-[30px] font-bold tracking-tight text-[var(--brand-dark)] sm:text-[36px] lg:text-[48px]">
                                {pick(UI.travelGuideIslandStories, locale)}
                            </h1>

                            <p className="text-[14px] leading-relaxed text-[var(--text-muted)] sm:text-[16px]">
                                {pick(UI.insightsGatheredOverYearsOfHosting, locale)}
                            </p>
                        </div>
                    </div>
                </section>

                <div className="mx-auto max-w-[var(--container)] space-y-[40px] px-[16px] py-[40px] sm:px-[24px] lg:px-[32px]">
                    {/* Thẻ bài nổi bật */}
                    {heroPost && (
                        <div className="bg-surface-raised border-border-muted grid grid-cols-1 overflow-hidden rounded-[12px] border shadow-1 transition hover:shadow-2 lg:grid-cols-12">
                            <div className="relative min-h-[280px] bg-[var(--surface-hover)] sm:min-h-[340px] lg:col-span-7">
                                <a
                                    href={`${blogHref}/${heroPost.id}`}
                                    className="absolute inset-0 block"
                                >
                                    <ImageSlot
                                        placeholder={pick(heroPost.title, locale)}
                                        style={{ position: 'absolute', inset: 0 }}
                                    />
                                </a>
                                <span className="bg-accent text-[var(--on-accent)] absolute top-[16px] left-[16px] flex items-center gap-[4px] rounded-full px-[12px] py-[4px] text-[11px] font-bold tracking-wider uppercase shadow-1">
                                    <Sparkles className="h-[12px] w-[12px]" aria-hidden="true" />
                                    <span>{pick(UI.featured, locale)}</span>
                                </span>
                            </div>

                            <div className="flex flex-col justify-between space-y-[16px] p-[24px] sm:p-[32px] lg:col-span-5">
                                <div className="space-y-[12px]">
                                    <span className="text-brand block text-[11px] font-bold tracking-wider uppercase">
                                        {pick(heroPost.category, locale)}
                                    </span>

                                    <h2 className="font-display text-[20px] leading-snug font-bold text-[var(--brand-dark)] sm:text-[24px]">
                                        <a
                                            href={`${blogHref}/${heroPost.id}`}
                                            className="text-inherit no-underline transition hover:text-[var(--brand)]"
                                        >
                                            {pick(heroPost.title, locale)}
                                        </a>
                                    </h2>

                                    <p className="line-clamp-3 text-[12px] leading-relaxed text-[var(--text-muted)]">
                                        {pick(heroPost.lede, locale)}
                                    </p>
                                </div>

                                <div className="border-border-muted flex items-center justify-between gap-[12px] border-t pt-[16px] text-[12px]">
                                    <div className="text-[11px] text-[var(--text-soft)]">
                                        <span>{pick(heroPost.date, locale)}</span>
                                        <span className="mx-[4px]">•</span>
                                        <span className="inline-flex items-center gap-[4px]">
                                            <Clock className="text-brand h-[12px] w-[12px]" aria-hidden="true" />
                                            {heroPost.readMin} {pick(UI.min, locale)}
                                        </span>
                                    </div>

                                    <a
                                        href={`${blogHref}/${heroPost.id}`}
                                        className="bg-brand text-text-inverse inline-flex h-[36px] items-center justify-center rounded-[6px] px-[14px] text-[12px] font-semibold whitespace-nowrap no-underline shadow-1 transition-all duration-200 hover:bg-[var(--brand-mid)] hover:shadow-2 active:scale-[0.98]"
                                    >
                                        {pick(UI.readArticle, locale)}
                                        <ArrowRight className="ml-[4px] h-[14px] w-[14px]" aria-hidden="true" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Thanh lọc chuyên mục */}
                    <div className="flex items-center gap-[8px] overflow-x-auto pb-[8px] [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
                        {categories.map((c) => {
                            const active = category === c.key
                            return (
                                <button
                                    key={c.key}
                                    type="button"
                                    onClick={() => setCategory(c.key)}
                                    aria-pressed={active}
                                    className={`shrink-0 rounded-[6px] px-[16px] py-[8px] text-[12px] font-bold whitespace-nowrap transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)] ${
                                        active
                                            ? 'bg-brand text-text-inverse shadow-1'
                                            : 'bg-surface-raised border-border-muted border text-[var(--text-muted)] hover:border-[var(--brand)] hover:text-[var(--brand)]'
                                    }`}
                                >
                                    {c.label}
                                </button>
                            )
                        })}
                    </div>

                    {/* Lưới bài viết */}
                    {visible.length === 0 ? (
                        // Trạng thái rỗng phải nói rõ làm gì tiếp (luật D6)
                        <p className="bg-surface-raised border-border-muted rounded-[12px] border p-[24px] text-center text-[14px] text-[var(--text-muted)]">
                            {pick(H3.blogEmpty, locale)}
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3">
                            {visible.map((post) => (
                                <article
                                    key={post.id}
                                    className="bg-surface-raised border-border-muted group flex flex-col overflow-hidden rounded-[12px] border shadow-1 transition hover:shadow-2"
                                >
                                    <div className="relative h-[192px] overflow-hidden bg-[var(--surface-hover)]">
                                        <a
                                            href={`${blogHref}/${post.id}`}
                                            className="absolute inset-0 block"
                                        >
                                            <ImageSlot
                                                placeholder={pick(post.title, locale)}
                                                style={{ position: 'absolute', inset: 0 }}
                                            />
                                        </a>
                                        <span className="text-text-inverse absolute top-[12px] left-[12px] rounded-full bg-[rgb(15_45_82/0.9)] px-[10px] py-[4px] text-[10px] font-bold tracking-wider uppercase backdrop-blur-sm">
                                            {pick(post.category, locale)}
                                        </span>
                                    </div>

                                    <div className="flex flex-1 flex-col justify-between space-y-[12px] p-[20px]">
                                        <div className="space-y-[8px]">
                                            <h3 className="font-display line-clamp-2 text-[16px] leading-snug font-bold text-[var(--brand-dark)] transition group-hover:text-[var(--brand)]">
                                                <a
                                                    href={`${blogHref}/${post.id}`}
                                                    className="text-inherit no-underline"
                                                >
                                                    {pick(post.title, locale)}
                                                </a>
                                            </h3>
                                            <p className="line-clamp-3 text-[12px] leading-relaxed text-[var(--text-muted)]">
                                                {pick(post.lede, locale)}
                                            </p>
                                        </div>

                                        <div className="border-border-muted flex items-center justify-between border-t pt-[12px] text-[11px] text-[var(--text-soft)]">
                                            <div className="flex items-center gap-[6px]">
                                                <Clock className="text-brand h-[12px] w-[12px]" aria-hidden="true" />
                                                <span>
                                                    {post.readMin} {pick(UI.minRead, locale)}
                                                </span>
                                            </div>
                                            <a
                                                href={`${blogHref}/${post.id}`}
                                                className="text-brand flex items-center gap-[4px] font-semibold no-underline hover:underline"
                                                aria-label={`${pick(UI.read, locale)}: ${pick(post.title, locale)}`}
                                            >
                                                <span>{pick(UI.read, locale)}</span>
                                                <ArrowRight className="h-[12px] w-[12px]" aria-hidden="true" />
                                            </a>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <SiteFooter {...siteFooterPropsOf(data, locale, slug)} />
        </div>
    )
}
