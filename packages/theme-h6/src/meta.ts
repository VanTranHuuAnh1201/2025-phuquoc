import { previewPath, t, type ThemeMeta } from '@repo/core'

export const meta: ThemeMeta = {
    slug: 'h6',
    num: '06',
    name: t('Sunlit Booking', 'Sunlit Booking'),
    description: t(
        'Bản v4 thực thi: nền sáng, xanh biển logo, một CTA vàng và trust booking đặt ngay trong phễu.',
        'The v4 implementation: bright surfaces, logo sea blue, one yellow CTA and booking trust placed inside the funnel.',
    ),
    preview: previewPath('h6'),
    swatch: {
        brand: '#1173B8',
        accent: '#F6B21B',
    },
}

