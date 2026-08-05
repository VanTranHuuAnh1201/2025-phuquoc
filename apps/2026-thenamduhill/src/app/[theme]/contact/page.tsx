import { notFound } from 'next/navigation'
import { findTheme, getProperty, isLocale, themeSlugs, DEFAULT_LOCALE } from '@repo/core'

import { themes } from '@/themes/registry'
import { LocaleProvider } from '@/components/LocaleProvider'

/** /[theme]/contact — trang liên hệ. */

interface PageProps {
    params: Promise<{ theme: string }>
    searchParams: Promise<{ lang?: string }>
}

export function generateStaticParams() {
    return themeSlugs(themes).map((theme) => ({ theme }))
}

export async function generateMetadata({ params }: PageProps) {
    const { theme: slug } = await params
    if (!findTheme(themes, slug)) return {}

    const data = await getProperty()
    return {
        title: `Liên hệ & Đặt chỗ — ${data.brand.name}`,
        description: data.brand.tagline.vi,
    }
}

export default async function Page({ params, searchParams }: PageProps) {
    const { theme: slug } = await params
    const { lang } = await searchParams

    const theme = findTheme(themes, slug)
    if (!theme) notFound()

    const locale = lang && isLocale(lang) ? lang : DEFAULT_LOCALE
    const data = await getProperty()
    const Component = theme.Contact ?? theme.Home

    return (
        <LocaleProvider>
            <Component data={data} locale={locale} />
        </LocaleProvider>
    )
}
