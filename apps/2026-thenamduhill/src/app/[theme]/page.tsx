import { notFound } from 'next/navigation'
import { findTheme, getProperty, isLocale, themeSlugs, DEFAULT_LOCALE } from '@repo/core'

import { themes } from '@/themes/registry'
import { LocaleProvider } from '@/components/LocaleProvider'
import { AccountBar } from '@/components/AccountBar'

/**
 * Route render mọi mẫu: /<slug>  (vd /h1, /h2)
 *
 * Route này KHÔNG biết có bao nhiêu mẫu. Nó tra registry, lấy dữ liệu từ core
 * rồi giao cho theme. Thêm mẫu thứ 20 không phải sửa file này (luật R5).
 */

interface PageProps {
    params: Promise<{ theme: string }>
    searchParams: Promise<{ lang?: string }>
}

export function generateStaticParams() {
    return themeSlugs(themes).map((theme) => ({ theme }))
}

export async function generateMetadata({ params }: PageProps) {
    const { theme: slug } = await params
    const theme = findTheme(themes, slug)
    if (!theme) return {}

    const data = await getProperty()
    return {
        title: `${data.brand.name} — ${theme.meta.name.vi}`,
        description: data.brand.tagline.vi,
    }
}

export default async function ThemePage({ params, searchParams }: PageProps) {
    const { theme: slug } = await params
    const { lang } = await searchParams

    const theme = findTheme(themes, slug)
    if (!theme) notFound()

    const locale = lang && isLocale(lang) ? lang : DEFAULT_LOCALE
    const data = await getProperty()

    const { Home } = theme
    return (
        <LocaleProvider>
            <Home data={data} locale={locale} extra={<AccountBar />} />
        </LocaleProvider>
    )
}
