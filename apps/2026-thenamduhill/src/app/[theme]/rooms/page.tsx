import { notFound } from 'next/navigation'
import { findTheme, getProperty, isLocale, themeSlugs, DEFAULT_LOCALE } from '@repo/core'

import { themes } from '@/themes/registry'
import { LocaleProvider } from '@/components/LocaleProvider'
import { SiteOverlay } from '@/components/SiteOverlay'
import { AccountBar } from '@/components/AccountBar'

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
        title: `Hạng phòng & Suite — ${data.brand.name}`,
        description: data.brand.tagline.vi,
    }
}

export default async function RoomsListingPage({ params, searchParams }: PageProps) {
    const { theme: slug } = await params
    const { lang } = await searchParams

    const theme = findTheme(themes, slug)
    if (!theme) notFound()

    const locale = lang && isLocale(lang) ? lang : DEFAULT_LOCALE
    const data = await getProperty()

    const RoomsComponent = theme.Rooms || theme.Home

    return (
        <LocaleProvider>
            <SiteOverlay />
            <RoomsComponent data={data} locale={locale} extra={<AccountBar />} />
        </LocaleProvider>
    )
}
