import { notFound } from 'next/navigation'
import {
    findTheme,
    getDiningMenu,
    getProperty,
    isLocale,
    themeSlugs,
    DEFAULT_LOCALE,
} from '@repo/core'

import { themes } from '@/themes/registry'
import { LocaleProvider } from '@/components/LocaleProvider'

/** /[theme]/dining — điểm ăn uống và thực đơn. */

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
        title: `Ẩm thực — ${data.brand.name}`,
        description: data.brand.tagline.vi,
    }
}

export default async function Page({ params, searchParams }: PageProps) {
    const { theme: slug } = await params
    const { lang } = await searchParams

    const theme = findTheme(themes, slug)
    if (!theme) notFound()

    const locale = lang && isLocale(lang) ? lang : DEFAULT_LOCALE
    const [data, menu] = await Promise.all([getProperty(), getDiningMenu()])

    // Mẫu chưa dựng trang này thì rơi về trang chủ — nó vẫn có section `dining`.
    const Component = theme.Dining ?? theme.Home

    return (
        <LocaleProvider>
            <Component data={data} locale={locale} menu={menu} />
        </LocaleProvider>
    )
}
