import { previewPath, t, type ThemeMeta } from '@repo/core'

export const meta: ThemeMeta = {
    slug: 'h1',
    num: '01',
    name: t('H1 Flagship Hybrid (V3 Fixed)', 'H1 Flagship Hybrid (V3 Fixed)'),
    description: t(
        'Bản H1 Flagship nâng cấp (V3 Fixed): Nền ngà ngập sáng, H1 Editorial DNA kết hợp Booking CRO Engine & chuẩn dễ đọc P15 WCAG AAA.',
        'The upgraded H1 Flagship (V3 Fixed): Sunlit bright surfaces, H1 Editorial DNA combined with Booking CRO Engine & P15 WCAG AAA readability.',
    ),
    preview: previewPath('h1'),
    swatch: {
        brand: '#1173B8',
        accent: '#F6B21B',
    },
}

