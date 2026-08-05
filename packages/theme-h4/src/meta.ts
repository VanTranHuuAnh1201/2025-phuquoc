import { previewPath, t, type ThemeMeta } from '@repo/core'

export const meta: ThemeMeta = {
    slug: 'h4',
    num: '04',
    name: t('Tĩnh lặng Nam Du', 'Nam Du Quiet Luxury'),
    description: t(
        'Ultra-luxury tĩnh lặng theo tinh thần Amanoi. Ảnh tràn khổ, khoảng thở 160px, chữ serif thưa nét trên nền ngà — mọi dòng chữ nằm trên thẻ nền riêng để đọc được ở mọi vùng ảnh.',
        'Amanoi-inspired quiet luxury. Full-bleed imagery, 160px breathing room and airy serif display type on warm alabaster — every line of copy sits on its own surface so it stays legible over any photograph.',
    ),
    preview: previewPath('h4'),
    /* Chỉ để vẽ chip trên trang hub — KHÔNG phải nguồn token. Nguồn thật là
       `tokens.css`; hai chỗ này phải khớp tay khi đổi bảng màu. */
    swatch: {
        brand: '#0E5E70',
        accent: '#E8A317',
    },
}
