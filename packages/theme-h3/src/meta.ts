import { previewPath, t, type ThemeMeta } from '@repo/core'

export const meta: ThemeMeta = {
    slug: 'h3',
    num: '03',
    name: t('Tạp chí đảo', 'Island Magazine'),
    description: t(
        'Bố cục kiểu tạp chí, nhịp trình bày dày. Nhiều dải nội dung sát nhau, dẫn khách đi liền mạch.',
        'Magazine-style layout with a dense rhythm. Bands sit close together and carry the reader straight through.',
    ),
    preview: previewPath('h3'),
    swatch: {
        brand: '#066168',
        accent: '#FFAA0D',
    },
}
