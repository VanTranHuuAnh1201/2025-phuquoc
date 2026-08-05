'use client'

import { useMemo, useState } from 'react'
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
 * Cẩm nang — đích đến của nút "Xem tất cả điểm đến & trải nghiệm" ở section
 * `places`.
 *
 * Bố cục: bài nổi bật ở đầu → nút lọc theo chuyên mục → lưới thẻ bài viết.
 * Chuyên mục KHÔNG khai cứng ở đây: nó suy ra từ chính `post.category` của dữ
 * liệu, nên biên tập thêm mục mới trong CMS là nút lọc tự xuất hiện — không
 * phải sửa `ui` (luật R5/R8).
 */

export interface BlogPageProps {
    data: PropertyData
    locale: Locale
    slug: string
    /** Danh sách bài. Route lấy qua `getBlogPosts()` rồi truyền xuống. */
    posts?: BlogPost[]
    strings?: Record<Locale, PageStrings>
}

const ALL = '__all__'

function IconClock() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="8.4" stroke="currentColor" strokeWidth="1.7" />
            <path d="M12 7.4V12l3 1.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
    )
}

export function BlogPage({ data, locale, slug, posts = [], strings }: BlogPageProps) {
    const t = (strings ?? defaultPageStrings)[locale]
    const [category, setCategory] = useState<string>(ALL)

    /**
     * Chuyên mục suy ra từ dữ liệu. Khoá là bản tiếng Việt (ổn định, không đổi
     * khi người dùng chuyển ngôn ngữ); nhãn hiển thị theo `locale` hiện tại.
     */
    const categories = useMemo(() => {
        const seen = new Map<string, string>()
        posts.forEach((post) => {
            if (!seen.has(post.category.vi)) seen.set(post.category.vi, pick(post.category, locale))
        })
        return [...seen.entries()].map(([key, label]) => ({ key, label }))
    }, [posts, locale])

    const visible = category === ALL ? posts : posts.filter((p) => p.category.vi === category)

    const [featured, ...rest] = visible

    const cats = [{ key: ALL, label: t.filterAll }, ...categories]

    return (
        <PageBody theme={slug}>
            <PageHeader {...shellPropsOf(data, locale, slug, t)} />

            <PageHero
                title={t.blogTitle}
                sub={t.blogSub}
                crumbs={[{ label: t.home, href: themeRoot(slug) }, { label: t.blogPage }]}
                height={400}
            />

            <section
                style={{
                    background: 'var(--surface)',
                    padding: 'var(--space-8) var(--space-6) var(--space-16)',
                }}
            >
                <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
                    {/* --------------------------------------- lọc chuyên mục */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 'var(--space-5)',
                            flexWrap: 'wrap',
                            marginBottom: 'var(--space-6)',
                        }}
                    >
                        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                            {cats.map((cat) => {
                                const on = category === cat.key
                                return (
                                    <button
                                        key={cat.key}
                                        type="button"
                                        onClick={() => setCategory(cat.key)}
                                        aria-pressed={on}
                                        style={{
                                            padding: 'var(--space-2) var(--space-4)',
                                            borderRadius: 'var(--radius-pill)',
                                            border: `1px solid ${on ? 'transparent' : 'var(--border-strong)'}`,
                                            background: on ? 'var(--accent)' : 'var(--surface)',
                                            color: on ? 'var(--text-inverse)' : 'var(--text)',
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: on ? 700 : 500,
                                            fontFamily: 'var(--font-body)',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap',
                                            minHeight: 40,
                                            transition:
                                                'background var(--duration) var(--ease), color var(--duration) var(--ease)',
                                        }}
                                    >
                                        {cat.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Trạng thái rỗng nói rõ phải làm gì tiếp (luật D6). */}
                    {visible.length === 0 && (
                        <p
                            style={{
                                padding: 'var(--space-12) var(--space-6)',
                                textAlign: 'center',
                                fontSize: 'var(--text-sm)',
                                color: 'var(--text-muted)',
                                border: '1px dashed var(--border-strong)',
                                borderRadius: 'var(--radius-lg)',
                            }}
                        >
                            {t.blogEmpty}
                        </p>
                    )}

                    {/* ------------------------------------------ bài nổi bật */}
                    {featured && (
                        <a
                            href={`${themePath(slug, 'blog')}/${featured.id}`}
                            className="ui-post-hero"
                            style={{
                                display: 'grid',
                                gap: 'var(--space-6)',
                                alignItems: 'center',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                                background: 'var(--surface)',
                                textDecoration: 'none',
                                marginBottom: 'var(--space-8)',
                            }}
                        >
                            <div style={{ minHeight: 260, background: 'var(--surface-alt)' }} />
                            <div style={{ padding: 'var(--space-6) var(--space-6) var(--space-6) 0' }}>
                                <span
                                    style={{
                                        display: 'inline-block',
                                        padding: 'var(--space-1) var(--space-3)',
                                        borderRadius: 'var(--radius-pill)',
                                        background: 'var(--surface-tint)',
                                        color: 'var(--brand)',
                                        fontSize: 'var(--text-xs)',
                                        fontWeight: 700,
                                        marginBottom: 'var(--space-3)',
                                    }}
                                >
                                    {pick(featured.category, locale)}
                                </span>
                                <h2
                                    style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: 'var(--text-2xl)',
                                        fontWeight: 800,
                                        color: 'var(--text)',
                                        letterSpacing: '-0.02em',
                                        lineHeight: 1.25,
                                        margin: '0 0 var(--space-3)',
                                    }}
                                >
                                    {pick(featured.title, locale)}
                                </h2>
                                <p
                                    style={{
                                        fontSize: 'var(--text-sm)',
                                        lineHeight: 1.65,
                                        color: 'var(--text-muted)',
                                        margin: '0 0 var(--space-4)',
                                    }}
                                >
                                    {pick(featured.lede, locale)}
                                </p>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-4)',
                                        fontSize: 'var(--text-xs)',
                                        color: 'var(--text-muted)',
                                    }}
                                >
                                    <span>
                                        {t.byAuthor} {pick(featured.author, locale)}
                                    </span>
                                    <span
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-1)',
                                        }}
                                    >
                                        <IconClock />
                                        {featured.readMin} {t.minRead}
                                    </span>
                                </div>
                            </div>
                        </a>
                    )}

                    {/* ------------------------------------------ lưới bài còn lại */}
                    {rest.length > 0 && (
                        <>
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
                                {t.latestTitle}
                            </h2>

                            <div
                                className="ui-post-grid"
                                style={{ display: 'grid', gap: 'var(--space-5)' }}
                            >
                                {rest.map((post) => (
                                    <a
                                        key={post.id}
                                        href={`${themePath(slug, 'blog')}/${post.id}`}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            border: '1px solid var(--border)',
                                            borderRadius: 'var(--radius-lg)',
                                            overflow: 'hidden',
                                            background: 'var(--surface)',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        <div style={{ height: 170, background: 'var(--surface-alt)' }} />
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                flex: 1,
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
                                                {pick(post.category, locale)}
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
                                                {pick(post.title, locale)}
                                            </h3>
                                            <p
                                                style={{
                                                    fontSize: 'var(--text-sm)',
                                                    lineHeight: 1.6,
                                                    color: 'var(--text-muted)',
                                                    margin: '0 0 var(--space-4)',
                                                    flex: 1,
                                                }}
                                            >
                                                {pick(post.lede, locale)}
                                            </p>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    gap: 'var(--space-3)',
                                                    fontSize: 'var(--text-xs)',
                                                    color: 'var(--text-muted)',
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: 'var(--space-1)',
                                                    }}
                                                >
                                                    <IconClock />
                                                    {post.readMin} {t.minRead}
                                                </span>
                                                <span style={{ color: 'var(--brand)', fontWeight: 700 }}>
                                                    {t.readMore} →
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>

            <PageFooter {...shellPropsOf(data, locale, slug, t)} />

            <style>{`
                .ui-post-hero { grid-template-columns: 1fr; }
                .ui-post-hero > div:last-child { padding: 0 var(--space-6) var(--space-6); }
                .ui-post-grid { grid-template-columns: repeat(1, minmax(0, 1fr)); }
                @media (min-width: 720px) {
                    .ui-post-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                }
                @media (min-width: 980px) {
                    .ui-post-hero { grid-template-columns: 1.1fr 1fr; }
                    .ui-post-hero > div:last-child {
                        padding: var(--space-6) var(--space-6) var(--space-6) 0;
                    }
                    .ui-post-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                }
            `}</style>
        </PageBody>
    )
}
