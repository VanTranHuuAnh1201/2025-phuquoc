export interface MenuItem {
  id: number
  nameVi: string
  nameEn: string
  price: string
}

export interface MenuCategory {
  key: 'coffee' | 'tea' | 'hot'
  nameVi: string
  nameEn: string
  items: MenuItem[]
}

export const DINING_MENU: Record<string, MenuCategory> = {
  coffee: {
    key: 'coffee',
    nameVi: 'Cà phê Việt Nam',
    nameEn: 'Vietnamese Coffee',
    items: [
      { id: 1, nameVi: 'Cà phê đen pha phin', nameEn: 'Vietnamese Black Coffee (Filtered)', price: '35K' },
      { id: 2, nameVi: 'Cà phê đen pha máy', nameEn: 'Black Coffee (Espresso)', price: '35K' },
      { id: 3, nameVi: 'Cà phê sữa pha phin', nameEn: 'Vietnamese Coffee with Condensed Milk', price: '40K' },
      { id: 4, nameVi: 'Cà phê sữa pha máy', nameEn: 'Coffee with Condensed Milk (Espresso)', price: '40K' },
      { id: 5, nameVi: 'Cà phê trứng', nameEn: 'Egg Coffee', price: '69K' },
      { id: 6, nameVi: 'Bạc xỉu', nameEn: 'White Coffee (Condensed Milk)', price: '55K' },
      { id: 7, nameVi: 'Cold brew latte', nameEn: 'Cold Brew Latte', price: '55K' },
      { id: 8, nameVi: 'Cold brew cam vàng', nameEn: 'Cold Brew Orange', price: '55K' },
      { id: 9, nameVi: 'Miss Nam Du Hill Island', nameEn: 'Miss Nam Du Hill Island', price: '69K' },
      { id: 10, nameVi: 'Sparkling berries coffee', nameEn: 'Sparkling Berries Coffee', price: '69K' },
      { id: 11, nameVi: 'Latte (nóng / lạnh)', nameEn: 'Latte (Hot / Iced)', price: '55K' },
      { id: 12, nameVi: 'Cappuccino', nameEn: 'Cappuccino', price: '55K' },
      { id: 13, nameVi: 'Americano (nóng / lạnh)', nameEn: 'Americano (Hot / Iced)', price: '50K' },
      { id: 14, nameVi: 'Baileys coffee', nameEn: 'Baileys Coffee', price: '69K' },
      { id: 15, nameVi: 'Cà phê muối', nameEn: 'Salted Coffee', price: '69K' },
    ],
  },
  tea: {
    key: 'tea',
    nameVi: 'Trà đá & trà trái cây',
    nameEn: 'Iced & Fruit Tea',
    items: [
      { id: 25, nameVi: 'Matcha Latte', nameEn: 'Matcha Latte', price: '55K' },
      { id: 26, nameVi: 'Trà Nam Du Hill', nameEn: 'Nam Du Hill Tea', price: '55K' },
      { id: 27, nameVi: 'Trà ổi hồng', nameEn: 'Pink Guava Tea', price: '55K' },
      { id: 28, nameVi: 'Trà đào cam sả', nameEn: 'Peach Orange Lemongrass Tea', price: '55K' },
      { id: 29, nameVi: 'Trà sả tắc hạt chia', nameEn: 'Lemongrass Kumquat Chia Tea', price: '55K' },
      { id: 30, nameVi: 'Trà lài kiwi', nameEn: 'Jasmine Kiwi Tea', price: '55K' },
      { id: 31, nameVi: 'Trà sả tắc xí muội', nameEn: 'Lemongrass Kumquat Plum Tea', price: '55K' },
      { id: 32, nameVi: 'Trà hoa đậu biếc mật ong', nameEn: 'Butterfly Pea Flower Honey Tea', price: '55K' },
      { id: 33, nameVi: 'Trà Atiso hạt chia mật ong', nameEn: 'Artichoke Chia Honey Tea', price: '55K' },
      { id: 34, nameVi: 'Nam Du Island (Welcome drink)', nameEn: 'Nam Du Island (Welcome drink)', price: '55K' },
      { id: 35, nameVi: 'Nam Du Tropical', nameEn: 'Nam Du Tropical', price: '69K' },
      { id: 36, nameVi: 'Trà sữa lài', nameEn: 'Jasmine Milk Tea', price: '55K' },
    ],
  },
  hot: {
    key: 'hot',
    nameVi: 'Trà nóng',
    nameEn: 'Hot Tea',
    items: [
      { id: 37, nameVi: 'Trà gừng mật ong', nameEn: 'Ginger Honey Tea', price: '45K' },
      { id: 38, nameVi: 'Trà táo đỏ hoa cúc', nameEn: 'Red Date Chrysanthemum Tea', price: '55K' },
      { id: 39, nameVi: 'Trà bạc hà cam sả', nameEn: 'Mint Orange Lemongrass Tea', price: '55K' },
      { id: 40, nameVi: 'Trà hoa cúc', nameEn: 'Chrysanthemum Tea', price: '45K' },
    ],
  },
}
