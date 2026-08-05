import { notFound } from 'next/navigation'
import {
    findTheme,
    getBlogPost,
    getBlogPosts,
    getProperty,
    isLocale,
    DEFAULT_LOCALE,
} from '@repo/core'

import { themes } from '@/themes/registry'
import { LocaleProvider } from '@/components/LocaleProvider'

/** /[theme]/blog/[slug] — chi tiết một bài cẩm nang. */

interface PageProps {
    params: Promise<{ theme: string; slug: string }>
    searchParams: Promise<{ lang?: string }>
}

export async function generateMetadata({ params }: PageProps) {
    const { theme: slug, slug: postId } = await params
    if (!findTheme(themes, slug)) return {}

    const post = await getBlogPost(postId)
    if (!post) return {}

    const data = await getProperty()
    return {
        title: `${post.title.vi} — ${data.brand.name}`,
        description: post.lede.vi,
    }
}

export default async function Page({ params, searchParams }: PageProps) {
    const { theme: slug, slug: postId } = await params
    const { lang } = await searchParams

    const theme = findTheme(themes, slug)
    if (!theme) notFound()

    const locale = lang && isLocale(lang) ? lang : DEFAULT_LOCALE
    const [data, post, all] = await Promise.all([getProperty(), getBlogPost(postId), getBlogPosts()])

    // Id không có thật thì 404 — không im lặng rơi về bài đầu tiên.
    if (!post) notFound()

    if (theme.BlogDetail) {
        const Component = theme.BlogDetail
        const related = all.filter((p) => p.id !== post.id).slice(0, 3)
        return (
            <LocaleProvider>
                <Component data={data} locale={locale} post={post} related={related} />
            </LocaleProvider>
        )
    }

    const Fallback = theme.Home
    return (
        <LocaleProvider>
            <Fallback data={data} locale={locale} />
        </LocaleProvider>
    )
}
