import { notFound } from 'next/navigation'
import { findTheme, getProperty, isLocale, themeSlugs, DEFAULT_LOCALE } from '@repo/core'

import { themes } from '@/themes/registry'
import { LocaleProvider } from '@/components/LocaleProvider'

interface PageProps {
    params: Promise<{ theme: string }>
    searchParams: Promise<Record<string, string | string[] | undefined>>
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
        title: `Hoàn tất đặt phòng — ${data.brand.name}`,
        description: data.brand.tagline.vi,
    }
}

export default async function CheckoutPage({ params, searchParams }: PageProps) {
    const { theme: slug } = await params
    const resolvedSearchParams = await searchParams
    const lang = typeof resolvedSearchParams.lang === 'string' ? resolvedSearchParams.lang : undefined

    const theme = findTheme(themes, slug)
    if (!theme) notFound()

    const locale = lang && isLocale(lang) ? lang : DEFAULT_LOCALE
    const data = await getProperty()

    const CheckoutComponent = theme.Checkout || theme.Home

    return (
        <LocaleProvider>
            <CheckoutComponent
                data={data}
                locale={locale}
                searchParams={resolvedSearchParams}
            />
        </LocaleProvider>
    )
}
