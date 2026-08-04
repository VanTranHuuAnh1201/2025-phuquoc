import { previewPath, t, type ThemeMeta } from '@repo/core'

export const meta: ThemeMeta = {
    slug: 'h7',
    num: '07',
    name: t('Nắng biển', 'Sunlit Coastal'),
    description: t(
        'Navy và vàng nghệ, tiêu đề serif. Bố cục thoáng, nút hành động nổi bật.',
        'Navy and sunlit gold, serif headings. Airy layout with high-contrast calls to action.',
    ),
    preview: previewPath('h7'),
    swatch: {
        brand: '#075E9E',
        accent: '#F5B921',
    },
}
