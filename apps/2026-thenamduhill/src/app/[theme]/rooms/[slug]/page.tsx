import { notFound } from 'next/navigation'
import { findTheme, getProperty, isLocale, DEFAULT_LOCALE } from '@repo/core'

import { themes } from '@/themes/registry'
import { LocaleProvider } from '@/components/LocaleProvider'

interface PageProps {
    params: Promise<{ theme: string; slug: string }>
    searchParams: Promise<{ lang?: string }>
}

export async function generateMetadata({ params }: PageProps) {
    const { theme: slug, slug: roomSlug } = await params
    const theme = findTheme(themes, slug)
    if (!theme) return {}

    const data = await getProperty()
    const room = data.rooms.find((r) => r.id === roomSlug) || data.rooms[0]
    return {
        title: `${room?.name.vi} — ${data.brand.name}`,
        description: room?.desc.vi,
    }
}

export default async function RoomDetailPage({ params, searchParams }: PageProps) {
    const { theme: slug, slug: roomSlug } = await params
    const { lang } = await searchParams

    const theme = findTheme(themes, slug)
    if (!theme) notFound()

    const locale = lang && isLocale(lang) ? lang : DEFAULT_LOCALE
    const data = await getProperty()

    const RoomDetailComponent = theme.RoomDetail || theme.Home

    return (
        <LocaleProvider>
            <RoomDetailComponent data={data} locale={locale} roomSlug={roomSlug} />
        </LocaleProvider>
    )
}
