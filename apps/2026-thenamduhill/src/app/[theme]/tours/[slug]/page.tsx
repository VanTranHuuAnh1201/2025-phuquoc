import { notFound } from 'next/navigation'
import { findTheme, getProperty, isLocale, DEFAULT_LOCALE } from '@repo/core'

import { themes } from '@/themes/registry'
import { LocaleProvider } from '@/components/LocaleProvider'
import { SiteOverlay } from '@/components/SiteOverlay'

/** /[theme]/tours/[slug] — chi tiết một combo. */

interface PageProps {
    params: Promise<{ theme: string; slug: string }>
    searchParams: Promise<{ lang?: string }>
}

export async function generateMetadata({ params }: PageProps) {
    const { theme: slug, slug: tourSlug } = await params
    if (!findTheme(themes, slug)) return {}

    const data = await getProperty()
    const tour = data.tours.find((t) => t.id === tourSlug) ?? data.tours[0]
    return {
        title: `${tour?.name.vi} — ${data.brand.name}`,
        description: tour?.summary.vi,
    }
}

export default async function Page({ params, searchParams }: PageProps) {
    const { theme: slug, slug: tourSlug } = await params
    const { lang } = await searchParams

    const theme = findTheme(themes, slug)
    if (!theme) notFound()

    const locale = lang && isLocale(lang) ? lang : DEFAULT_LOCALE
    const data = await getProperty()

    if (theme.TourDetail) {
        const Component = theme.TourDetail
        return (
            <LocaleProvider>
                <SiteOverlay />
                <Component data={data} locale={locale} tourSlug={tourSlug} />
            </LocaleProvider>
        )
    }

    const Fallback = theme.Home
    return (
        <LocaleProvider>
            <SiteOverlay />
            <Fallback data={data} locale={locale} />
        </LocaleProvider>
    )
}
