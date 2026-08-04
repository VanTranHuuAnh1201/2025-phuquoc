/**
 * Thực đơn quán café — nội dung do khách hàng biên tập.
 *
 * Giá để dạng SỐ (VND) chứ không phải chuỗi '35K': chuỗi thì không đổi được
 * theo ngôn ngữ và không tính toán được. Tầng hiển thị dùng `formatPrice()`.
 *
 * Mọi chuỗi song ngữ `{ vi, en }` theo luật R6.
 */

import { t } from '../i18n'
import type { MenuCategory } from '../types'

export const diningMenu: Record<string, MenuCategory> = {
    coffee: {
        key: 'coffee',
        name: t('Cà phê Việt Nam', 'Vietnamese Coffee'),
        items: [
            {
                id: 1,
                name: t('Cà phê đen pha phin', 'Vietnamese Black Coffee (Filtered)'),
                price: 35000,
            },
            {
                id: 2,
                name: t('Cà phê đen pha máy', 'Black Coffee (Espresso)'),
                price: 35000,
            },
            {
                id: 3,
                name: t('Cà phê sữa pha phin', 'Vietnamese Coffee with Condensed Milk'),
                price: 40000,
            },
            {
                id: 4,
                name: t('Cà phê sữa pha máy', 'Coffee with Condensed Milk (Espresso)'),
                price: 40000,
            },
            {
                id: 5,
                name: t('Cà phê trứng', 'Egg Coffee'),
                price: 69000,
            },
            {
                id: 6,
                name: t('Bạc xỉu', 'White Coffee (Condensed Milk)'),
                price: 55000,
            },
            {
                id: 7,
                name: t('Cold brew latte', 'Cold Brew Latte'),
                price: 55000,
            },
            {
                id: 8,
                name: t('Cold brew cam vàng', 'Cold Brew Orange'),
                price: 55000,
            },
            {
                id: 9,
                name: t('Miss Nam Du Hill Island', 'Miss Nam Du Hill Island'),
                price: 69000,
            },
            {
                id: 10,
                name: t('Sparkling berries coffee', 'Sparkling Berries Coffee'),
                price: 69000,
            },
            {
                id: 11,
                name: t('Latte (nóng / lạnh)', 'Latte (Hot / Iced)'),
                price: 55000,
            },
            {
                id: 12,
                name: t('Cappuccino', 'Cappuccino'),
                price: 55000,
            },
            {
                id: 13,
                name: t('Americano (nóng / lạnh)', 'Americano (Hot / Iced)'),
                price: 50000,
            },
            {
                id: 14,
                name: t('Baileys coffee', 'Baileys Coffee'),
                price: 69000,
            },
            {
                id: 15,
                name: t('Cà phê muối', 'Salted Coffee'),
                price: 69000,
            },
        ],
    },
    tea: {
        key: 'tea',
        name: t('Trà đá & trà trái cây', 'Iced & Fruit Tea'),
        items: [
            {
                id: 25,
                name: t('Matcha Latte', 'Matcha Latte'),
                price: 55000,
            },
            {
                id: 26,
                name: t('Trà Nam Du Hill', 'Nam Du Hill Tea'),
                price: 55000,
            },
            {
                id: 27,
                name: t('Trà ổi hồng', 'Pink Guava Tea'),
                price: 55000,
            },
            {
                id: 28,
                name: t('Trà đào cam sả', 'Peach Orange Lemongrass Tea'),
                price: 55000,
            },
            {
                id: 29,
                name: t('Trà sả tắc hạt chia', 'Lemongrass Kumquat Chia Tea'),
                price: 55000,
            },
            {
                id: 30,
                name: t('Trà lài kiwi', 'Jasmine Kiwi Tea'),
                price: 55000,
            },
            {
                id: 31,
                name: t('Trà sả tắc xí muội', 'Lemongrass Kumquat Plum Tea'),
                price: 55000,
            },
            {
                id: 32,
                name: t('Trà hoa đậu biếc mật ong', 'Butterfly Pea Flower Honey Tea'),
                price: 55000,
            },
            {
                id: 33,
                name: t('Trà Atiso hạt chia mật ong', 'Artichoke Chia Honey Tea'),
                price: 55000,
            },
            {
                id: 34,
                name: t('Nam Du Island (Welcome drink)', 'Nam Du Island (Welcome drink)'),
                price: 55000,
            },
            {
                id: 35,
                name: t('Nam Du Tropical', 'Nam Du Tropical'),
                price: 69000,
            },
            {
                id: 36,
                name: t('Trà sữa lài', 'Jasmine Milk Tea'),
                price: 55000,
            },
        ],
    },
    hot: {
        key: 'hot',
        name: t('Trà nóng', 'Hot Tea'),
        items: [
            {
                id: 37,
                name: t('Trà gừng mật ong', 'Ginger Honey Tea'),
                price: 45000,
            },
            {
                id: 38,
                name: t('Trà táo đỏ hoa cúc', 'Red Date Chrysanthemum Tea'),
                price: 55000,
            },
            {
                id: 39,
                name: t('Trà bạc hà cam sả', 'Mint Orange Lemongrass Tea'),
                price: 55000,
            },
            {
                id: 40,
                name: t('Trà hoa cúc', 'Chrysanthemum Tea'),
                price: 45000,
            },
        ],
    },
}
