import { previewPath, t, type ThemeMeta } from '@repo/core'

export const meta: ThemeMeta = {
    slug: 'h3',
    num: '03',
    name: t('Navy ven biển', 'Coastal Navy'),
    description: t(
        'Navy đậm và vàng nhấn 5%. Hero ảnh tràn viền với thanh tìm phòng nổi, lưới ảnh thật và lời khách cuộn liên tục.',
        'Deep navy with a 5% gold accent. Full-bleed hero over a floating search bar, real-photo grids and continuously scrolling guest quotes.',
    ),
    preview: previewPath('h3'),
    /* Chỉ để vẽ chip trên trang hub — KHÔNG phải nguồn token. Nguồn thật là
       `tokens.css`; hai chỗ này phải khớp tay khi đổi bảng màu. */
    swatch: {
        brand: '#1D4E89',
        accent: '#FFB800',
    },
}
