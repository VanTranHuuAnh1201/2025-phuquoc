import { previewPath, t, type ThemeMeta } from '@repo/core'

export const meta: ThemeMeta = {
    slug: 'h4',
    num: '04',
    name: t('Teal & Xanh lá', 'Teal & Lime'),
    description: t(
        'Tươi, thiên nhiên, bo góc mềm. Nhấn xanh lá và bố cục chéo hướng khách trẻ.',
        'Fresh and natural, softly rounded. Lime accents and diagonal framing for younger guests.',
    ),
    preview: previewPath('h4'),
    swatch: {
        brand: '#066168',
        accent: '#85D200',
    },
}
