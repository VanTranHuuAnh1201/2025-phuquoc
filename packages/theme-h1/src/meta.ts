import { t, type ThemeMeta } from '@repo/core'

export const meta: ThemeMeta = {
    slug: 'h1',
    num: '01',
    name: t('Xanh biển', 'Coastal Blue'),
    description: t(
        'Gọn gàng, chuẩn mực. Bố cục chặt chẽ, tạo cảm giác tin cậy.',
        'Clean and corporate. Structured layout, confidence-first.',
    ),
    preview: '/previews/h1.webp',
    swatch: {
        brand: '#075E9E',
        accent: '#0B6FB8',
    },
}
