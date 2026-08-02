import { notFound } from 'next/navigation'
import { findTheme, getProperty, isLocale, themeSlugs, DEFAULT_LOCALE } from '@repo/core'

import { themes } from '@/themes/registry'
import { LocaleProvider } from '@/components/LocaleProvider'
import { SiteOverlay } from '@/components/SiteOverlay'

/** /[theme]/gallery — thư viện ảnh. */

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
        title: `Thư viện ảnh — ${data.brand.name}`,
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
    const Component = theme.Gallery ?? theme.Home

    return (
        <LocaleProvider>
            <SiteOverlay />
            <Component data={data} locale={locale} />
        </LocaleProvider>
    )
}
