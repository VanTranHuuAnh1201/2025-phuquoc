import { previewPath, t, type ThemeMeta } from '@repo/core'

export const meta: ThemeMeta = {
    slug: 'h5',
    num: '05',
    name: t('Rực nắng đảo', 'Tropical Bright'),
    description: t(
        'Nền trắng ngà ngập sáng, xanh biển tươi của logo làm xương sống, một chấm vàng nắng duy nhất mỗi màn hình nói "đặt ở đây".',
        'Sun-washed ivory, the logo\'s fresh sea blue as the backbone, and a single sun-yellow dot per screen that says "book here".',
    ),
    preview: previewPath('h5'),
    swatch: {
        brand: '#1173B8',
        accent: '#F6B21B',
    },
}
