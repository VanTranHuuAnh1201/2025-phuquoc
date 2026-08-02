import type { Locale, PropertyData, SectionId } from '@repo/core'

import { Hero } from './sections/Hero'
import { Rooms } from './sections/Rooms'

/**
 * Bố cục mẫu 01 — quyết định thứ tự và biến thể của từng section.
 *
 * Theme được bỏ bớt section, nhưng KHÔNG được đổi tên id (luật R7).
 */

export const sections: readonly SectionId[] = ['top', 'rooms'] as const

export interface HomeProps {
    data: PropertyData
    locale: Locale
}

export function Home({ data, locale }: HomeProps) {
    return (
        <main data-theme="h1" style={{ fontFamily: 'var(--font-body)' }}>
            <Hero data={data} locale={locale} />
            <Rooms data={data} locale={locale} />
        </main>
    )
}
