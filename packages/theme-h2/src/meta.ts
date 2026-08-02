import { previewPath, t, type ThemeMeta } from '@repo/core'

export const meta: ThemeMeta = {
    slug: 'h2',
    num: '02',
    name: t('Teal & Cam', 'Teal & Amber'),
    description: t(
        'Ấm áp, mời gọi. Hero chia đôi, bo góc lớn, nhấn cam dẫn mắt tới nút đặt phòng.',
        'Warm and inviting. Split hero, generous curves, amber accents leading to the booking button.',
    ),
    preview: previewPath('h2'),
    swatch: {
        brand: '#066168',
        accent: '#FFAA0D',
    },
}
