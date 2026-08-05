import {
    pick,
    themePath,
    themeRoot,
    type BlogPost,
    type Locale,
    type PropertyData,
} from '@repo/core'

import { PageBody, PageFooter, PageHeader, PageHero } from '@repo/ui-layout'
import { defaultPageStrings, type PageStrings } from './strings'
import { shellPropsOf } from '../shell-adapter'

/**
 * Chi tiết một bài cẩm nang.
 *
 * Thân bài là mảng `BlogBlock` của `core` — năm kiểu khối: tiêu đề (`h`), đoạn
 * văn (`p`), trích dẫn (`q`), ảnh (`i`) và danh sách (`l`). Trang chỉ ánh xạ
 * kiểu khối sang thẻ HTML; nội dung và thứ tự do biên tập quyết định, nên thêm
 * bài mới không phải sửa file này (luật R8).
 *
 * Không có `'use client'`: trang thuần đọc, không state — để nó chạy như
 * Server Component đúng yêu cầu SEO ở §F8.
 */

export interface BlogDetailPageProps {
    data: PropertyData
    locale: Locale
    slug: string
    /** Bài đang xem. Route tra qua `getBlogPost(id)`. */
    post?: BlogPost
    /** Vài bài khác để gợi ý đọc tiếp. */
    related?: BlogPost[]
    strings?: Record<Locale, PageStrings>
}

export function BlogDetailPage({
    data,
    locale,
    slug,
    post,
    related = [],
    strings,
}: BlogDetailPageProps) {
    const t = (strings ?? defaultPageStrings)[locale]

    // Route đã `notFound()` khi không có bài; nhánh này chỉ để type an toàn.
    if (!post) return null

    const blogHref = themePath(slug, 'blog')

    return (
        <PageBody theme={slug}>
            <PageHeader {...shellPropsOf(data, locale, slug, t)} />

            <PageHero
                title={pick(post.title, locale)}
                sub={pick(post.lede, locale)}
                crumbs={[
                    { label: t.home, href: themeRoot(slug) },
                    { label: t.blogPage, href: blogHref },
                    { label: pick(post.category, locale) },
                ]}
                height={420}
            />

            <article
                style={{
                    background: 'var(--surface)',
                    padding: 'var(--space-10) var(--space-6) var(--space-12)',
                }}
            >
                <div style={{ maxWidth: 760, margin: '0 auto' }}>
                    {/* ------------------------------------------ dòng tác giả */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-4)',
                            flexWrap: 'wrap',
                            paddingBottom: 'var(--space-5)',
                            marginBottom: 'var(--space-6)',
                            borderBottom: '1px solid var(--border)',
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-muted)',
                        }}
                    >
                        <span style={{ fontWeight: 700, color: 'var(--text)' }}>
                            {pick(post.author, locale)}
                        </span>
                        <span>{pick(post.role, locale)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{pick(post.date, locale)}</span>
                        <span aria-hidden="true">·</span>
                        <span>
                            {post.readMin} {t.minRead}
                        </span>
                    </div>

                    {/* ------------------------------------------------ thân bài */}
                    {post.blocks.map((block, index) => {
                        const key = `${block.kind}-${index}`

                        if (block.kind === 'h') {
                            return (
                                <h2
                                    key={key}
                                    style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: 'var(--text-xl)',
                                        fontWeight: 800,
                                        color: 'var(--text)',
                                        letterSpacing: '-0.02em',
                                        lineHeight: 1.3,
                                        margin: 'var(--space-8) 0 var(--space-3)',
                                    }}
                                >
                                    {block.text && pick(block.text, locale)}
                                </h2>
                            )
                        }

                        if (block.kind === 'p') {
                            return (
                                <p
                                    key={key}
                                    style={{
                                        fontSize: 'var(--text-base)',
                                        lineHeight: 1.75,
                                        color: 'var(--text)',
                                        margin: '0 0 var(--space-4)',
                                    }}
                                >
                                    {block.text && pick(block.text, locale)}
                                </p>
                            )
                        }

                        if (block.kind === 'q') {
                            return (
                                <blockquote
                                    key={key}
                                    style={{
                                        margin: 'var(--space-6) 0',
                                        padding: 'var(--space-5) var(--space-6)',
                                        borderLeft: '3px solid var(--accent)',
                                        background: 'var(--surface-tint)',
                                        borderRadius: '0 var(--radius) var(--radius) 0',
                                        fontFamily: 'var(--font-display)',
                                        fontSize: 'var(--text-lg)',
                                        fontStyle: 'italic',
                                        lineHeight: 1.6,
                                        color: 'var(--brand-dark)',
                                    }}
                                >
                                    {block.text && pick(block.text, locale)}
                                </blockquote>
                            )
                        }

                        if (block.kind === 'l') {
                            return (
                                <ul
                                    key={key}
                                    style={{
                                        margin: '0 0 var(--space-5)',
                                        paddingLeft: 'var(--space-5)',
                                        display: 'grid',
                                        gap: 'var(--space-2)',
                                    }}
                                >
                                    {(block.items ?? []).map((item, i) => (
                                        <li
                                            key={i}
                                            style={{
                                                fontSize: 'var(--text-base)',
                                                lineHeight: 1.7,
                                                color: 'var(--text)',
                                            }}
                                        >
                                            {pick(item, locale)}
                                        </li>
                                    ))}
                                </ul>
                            )
                        }

                        // kind === 'i' — ảnh minh hoạ. Chưa có nguồn ảnh thật thì
                        // giữ ô nền xám đúng nhịp `image-slot` của prototype.
                        return (
                            <figure key={key} style={{ margin: 'var(--space-6) 0' }}>
                                <div
                                    style={{
                                        height: 320,
                                        background: 'var(--surface-alt)',
                                        borderRadius: 'var(--radius-lg)',
                                    }}
                                />
                                {block.caption && (
                                    <figcaption
                                        style={{
                                            marginTop: 'var(--space-2)',
                                            fontSize: 'var(--text-xs)',
                                            color: 'var(--text-muted)',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {pick(block.caption, locale)}
                                    </figcaption>
                                )}
                            </figure>
                        )
                    })}

                    {/* ---------------------------------------------- chủ đề */}
                    {post.tags.length > 0 && (
                        <div
                            style={{
                                marginTop: 'var(--space-8)',
                                paddingTop: 'var(--space-5)',
                                borderTop: '1px solid var(--border)',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 'var(--text-xs)',
                                    fontWeight: 700,
                                    color: 'var(--text-muted)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.07em',
                                    marginBottom: 'var(--space-3)',
                                }}
                            >
                                {t.tagsTitle}
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                                {post.tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            padding: 'var(--space-1) var(--space-3)',
                                            borderRadius: 'var(--radius-pill)',
                                            background: 'var(--surface-alt)',
                                            border: '1px solid var(--border)',
                                            fontSize: 'var(--text-xs)',
                                            color: 'var(--text-muted)',
                                        }}
                                    >
                                        {pick(tag, locale)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <a
                        href={blogHref}
                        style={{
                            display: 'inline-block',
                            marginTop: 'var(--space-8)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 700,
                            color: 'var(--brand)',
                            textDecoration: 'none',
                        }}
                    >
                        {t.backToBlog}
                    </a>
                </div>
            </article>

            {/* --------------------------------------------------- bài liên quan */}
            {related.length > 0 && (
                <section
                    style={{
                        background: 'var(--surface-alt)',
                        padding: 'var(--space-12) var(--space-6)',
                    }}
                >
                    <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                        <h2
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'var(--text-xl)',
                                fontWeight: 800,
                                color: 'var(--text)',
                                letterSpacing: '-0.02em',
                                margin: '0 0 var(--space-5)',
                            }}
                        >
                            {t.relatedTitle}
                        </h2>

                        <div className="ui-post-grid" style={{ display: 'grid', gap: 'var(--space-5)' }}>
                            {related.map((item) => (
                                <a
                                    key={item.id}
                                    href={`${blogHref}/${item.id}`}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-lg)',
                                        overflow: 'hidden',
                                        background: 'var(--surface)',
                                        textDecoration: 'none',
                                        padding: 'var(--space-5)',
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: 'var(--text-xs)',
                                            fontWeight: 700,
                                            color: 'var(--brand)',
                                            marginBottom: 'var(--space-2)',
                                        }}
                                    >
                                        {pick(item.category, locale)}
                                    </span>
                                    <h3
                                        style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: 'var(--text-lg)',
                                            fontWeight: 700,
                                            color: 'var(--text)',
                                            lineHeight: 1.35,
                                            margin: '0 0 var(--space-2)',
                                        }}
                                    >
                                        {pick(item.title, locale)}
                                    </h3>
                                    <span
                                        style={{
                                            fontSize: 'var(--text-xs)',
                                            color: 'var(--text-muted)',
                                        }}
                                    >
                                        {item.readMin} {t.minRead}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <PageFooter {...shellPropsOf(data, locale, slug, t)} />

            <style>{`
                .ui-post-grid { grid-template-columns: repeat(1, minmax(0, 1fr)); }
                @media (min-width: 720px) {
                    .ui-post-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                }
            `}</style>
        </PageBody>
    )
}
