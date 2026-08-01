# PHẦN 2 — FORMAT STYLES CỐ ĐỊNH (Design System)

> **Nguồn sự thật:** trích xuất trực tiếp từ codebase `d:\2026\2025-phuquoc`.
> Mọi component mới **BẮT BUỘC** tuân theo file này. Không tự phát minh style mới.

---

## 1. Tech stack (đã chốt — không đổi)

| Layer | Công nghệ | Version |
|---|---|---|
| Framework | Next.js App Router + Turbopack | ^15.5.4 |
| React | React | ^19.1.1 |
| Ngôn ngữ | TypeScript | ^5 |
| CSS | Tailwind CSS v4 (`@import "tailwindcss"`) | ^4 |
| Icons | lucide-react | ^0.544.0 |
| i18n | Custom `LanguageContext` + middleware (KHÔNG dùng next-intl dù đã cài) | — |
| Font | `Inter` từ `next/font/google` | — |

```bash
yarn dev     # next dev --turbopack
yarn build   # next build --turbopack
yarn lint
```

---

## 2. Bảng màu (Color tokens)

### 2.1 Brand — khai báo ở `tailwind.config.js` + `globals.css`
```
brand-50  #eff6ff    brand-500 #3b82f6
brand-100 #dbeafe    brand-600 #2563eb
brand-200 #bfdbfe    brand-700 #1d4ed8
brand-300 #93c5fd    brand-800 #1e40af
brand-400 #60a5fa    brand-900 #1e3a8a
```

### 2.2 ⚠️ Gradient THỰC TẾ đang dùng — **đây mới là bản sắc visual**
Codebase dùng **orange→pink** làm signature, KHÔNG dùng `brand-*` (blue) cho trang public.

| Mục đích | Class chuẩn |
|---|---|
| **Tiêu đề section** | `text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent` |
| **Nút CTA chính** | `bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium rounded-lg sm:rounded-xl transition-colors shadow-lg` |
| **Nền trang (`<main>`)** | `bg-gradient-to-br from-orange-50/80 via-pink-50/60 to-orange-50/40 min-h-screen` |
| **Breadcrumb bar** | `bg-gradient-to-r from-orange-50/50 to-pink-50/50 border-b border-orange-100/50` |
| **Hover viền card** | `border-gray-200 hover:border-orange-300` |
| **Hover chữ tiêu đề card** | `group-hover:text-orange-600 transition-colors` |
| **Badge tích cực** | `bg-green-50 text-green-700 border-green-200 rounded-full` (prefix `✓ `) |
| **Badge giảm giá** | `bg-red-500 text-white rounded-md text-xs font-bold` |
| **Form / BookingForm** (ngoại lệ) | dùng `blue-600` / `focus:ring-blue-500` — giữ nguyên cho consistency với `shared/BookingForm.tsx` |

> **QUY TẮC:** public marketing UI = **orange/pink**. Form input & nút submit trong `BookingForm` = **blue**. Không trộn lẫn.

---

## 3. Layout & spacing

```
Container:      max-w-7xl mx-auto px-3 sm:px-4 lg:px-6      (chuẩn section)
                max-w-7xl mx-auto px-4 sm:px-6 lg:px-8      (chuẩn page/breadcrumb)
Section wrapper: py-4 sm:py-6 bg-white/90 backdrop-blur-sm rounded-2xl
                 mx-2 sm:mx-3 lg:mx-4 shadow-lg
Header section:  flex justify-between items-center mb-4 sm:mb-6
Grid card:       grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4
Breakpoints:     sm 640 · md 768 · lg 1024 · xl 1280   (mobile-first)
```

### Sticky (từ `globals.css`)
```css
.sticky-tabs   { top: 64px;  z-index: 30; background: rgba(255,255,255,.9);  backdrop-filter: blur(6px); }
.sticky-filter { top: 116px; z-index: 25; background: rgba(255,255,255,.95); backdrop-filter: blur(4px); }
section[id]    { scroll-margin-top: 104px; }
html           { scroll-behavior: smooth; }
```

---

## 4. Card pattern chuẩn (copy từ `Transportation.tsx`)

```tsx
<Link href={...} className="group cursor-pointer block">
  <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:border-orange-300
                  transition-all duration-200 overflow-hidden shadow-md hover:shadow-lg
                  transform hover:-translate-y-1 h-full flex flex-col">

    {/* ẢNH — luôn aspect 16/10 */}
    <div className="relative aspect-[16/10] overflow-hidden flex-shrink-0">
      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />

      {/* top-left: subtitle pill */}
      <div className="absolute top-2 left-2">
        <span className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-gray-700 shadow-sm" />
      </div>

      {/* top-right: % giảm giá */}
      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-md" />

      {/* bottom-left: rating */}
      <div className="absolute bottom-2 left-2">
        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md">
          <span className="text-yellow-400 text-xs">⭐</span>
          <span className="font-bold text-xs text-white">{rating}</span>
          <span className="text-white/90 text-xs">({reviews})</span>
        </div>
      </div>
    </div>

    {/* BODY */}
    <div className="p-3">
      <h3 className="font-bold text-base leading-tight text-gray-900 group-hover:text-orange-600
                     transition-colors line-clamp-2 mb-2" />
      <div className="flex flex-wrap gap-1 mb-3">{/* badges: ✓ + text */}</div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 mb-1">Từ</span>
          <span className="text-lg font-bold text-gray-900">đ{price.toLocaleString()}</span>
          <span className="text-sm text-gray-400 line-through">đ{originalPrice}</span>
        </div>
        <div className="text-xs text-gray-500">{bookings} đặt</div>
      </div>
    </div>
  </div>
</Link>
```

### Carousel pattern (scroll-snap theo nhóm 4)
```tsx
const ref = useRef<HTMLDivElement>(null)
const scrollLeft  = () => ref.current?.scrollBy({ left: -ref.current.clientWidth, behavior: 'smooth' })
const scrollRight = () => ref.current?.scrollBy({ left:  ref.current.clientWidth, behavior: 'smooth' })

<div ref={ref}
     className="grid auto-cols-[100%] grid-flow-col gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-3 sm:pb-4"
     style={{ scrollSnapType: 'x mandatory' }}>
  {Array.from({ length: Math.ceil(items.length / 4) }, (_, g) => (
    <div key={g} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 min-w-0"
         style={{ scrollSnapAlign: 'start' }}>
      {items.slice(g * 4, (g + 1) * 4).map(...)}
    </div>
  ))}
</div>
```
Nút mũi tên: `p-2 sm:p-3 rounded-full bg-white shadow-md hover:shadow-lg border border-gray-200 hover:border-orange-300 group` + SVG stroke `currentColor`, `group-hover:text-orange-500`.

---

## 5. Animation (`tailwind.config.js`)
```
animate-fadeInUp     fadeInUp 0.6s ease-out forwards   (opacity 0→1, translateY 30px→0)
animate-slideUp      slideUp 0.3s ease-out             (translateY 100%→0)
animate-bounce-slow  bounce 2s infinite
shadow-soft          0 8px 24px rgba(0,0,0,.08)
```
Utility: `.no-scrollbar` · `.skeleton` (sheen 1.2s)

---

## 6. Form pattern chuẩn (từ `shared/BookingForm.tsx`)

```tsx
{/* Label */}
<label className="block text-sm font-medium text-gray-700 mb-2">
  Nhãn <span className="text-red-500">*</span>
</label>

{/* Input — normal / error */}
className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500
           focus:border-transparent border-gray-300"     // hoặc border-red-500 khi lỗi

{/* Error message */}
<p className="text-red-500 text-sm mt-1">{error}</p>

{/* Stepper số lượng */}
<div className="flex items-center border border-gray-300 rounded-lg">
  <button className="p-3 hover:bg-gray-50">-</button>
  <span className="flex-1 text-center py-3">{n}</span>
  <button className="p-3 hover:bg-gray-50">+</button>
</div>

{/* Submit */}
className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold
           hover:bg-blue-700 transition-colors
           disabled:bg-gray-400 disabled:cursor-not-allowed"
```

**Validation rules đã có (tái sử dụng nguyên):**
| Field | Rule |
|---|---|
| date | bắt buộc → `'Vui lòng chọn ngày'`; `min={new Date().toISOString().split('T')[0]}` |
| guests | `>= 1` → `'Số khách phải lớn hơn 0'`; `<= maxGuests` → `` `Tối đa ${maxGuests} khách` `` |
| name | `.trim()` → `'Vui lòng nhập họ tên'` |
| email | `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` → `'Email không hợp lệ'` |
| phone | `/^[0-9+\-\s()]{10,}$/` → `'Số điện thoại không hợp lệ'` |

---

## 7. Format tiền tệ — **CHỐT 1 CHUẨN DUY NHẤT**

Codebase hiện **KHÔNG NHẤT QUÁN** — phải sửa:
- `Transportation.tsx`: `đ{parseInt(price).toLocaleString()}` → `đ931,000` (dấu phẩy, prefix `đ`)
- `BookingForm.tsx`: `price.toLocaleString('vi-VN') + '₫'` → `931.000₫` (dấu chấm, suffix `₫`)
- `data.ts`: giá là **string** `"2,800,000"`; `mockData.ts`: giá là **number** `590000`

### ✅ Quy chuẩn mới (bắt buộc cho code mới)
```ts
// src/app/lib/format.ts  ← TẠO MỚI
export const formatVND = (n: number) => `${n.toLocaleString('vi-VN')}₫`   // 1.546.000₫
export const formatVNDShort = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1).replace('.0','')}tr₫` : `${(n/1000).toFixed(0)}k₫`
```
- **Kiểu dữ liệu giá: LUÔN là `number`** (VND, không thập phân). Không lưu string.
- Migrate dần `data.ts` sang number khi refactor.

---

## 8. Routing & i18n conventions

```
src/app/[locale]/<route>/page.tsx      → public pages, locale = 'vi' | 'en'
src/app/admin/<route>/page.tsx         → admin (middleware SKIP locale)
```

**Middleware** (`src/middleware.ts`): redirect path thiếu locale → `/${locale}${pathname}`. Bỏ qua `_next`, `api`, `admin`, `favicon`, path có dấu `.`.

**Dùng i18n trong component:**
```tsx
'use client'
import { useLanguage } from '../contexts/LanguageContext'
const { t, currentLocale } = useLanguage()
// LUÔN guard: if (!t || !t.sections) return <SkeletonBlock />
```
> ⚠️ Guard skeleton là **bắt buộc** — pattern này có ở mọi component hiện tại.

**Link nội bộ:** luôn `` href={`/${currentLocale}/...`} `` — không hardcode `/vi/`.

Text strings mới → thêm vào **cả `vi` và `en`** trong `src/i18n.ts` (+ `src/locales/*.json` nếu dùng).

---

## 9. Component export convention

`src/app/components/index.ts`:
```ts
export * from './TenComponent'                              // named re-export
export { default as TenLayout } from './layouts/TenLayout'   // layouts
export { default as TenShared } from './shared/TenShared'    // shared
```
Import: `import { Transportation, BookingForm } from '@/app/components'`

**Cấu trúc thư mục:**
```
src/app/components/
├── <Section>.tsx           # section trang chủ
├── layouts/                # layout trang detail (nhận props data)
├── shared/                 # component tái dùng (BookingForm, ImageGallery)
└── index.ts                # barrel export — LUÔN cập nhật khi thêm file
```

---

## 10. Quy ước dữ liệu & ảnh

- **Mock data:** đặt cạnh page → `src/app/[locale]/<route>/mockData.ts`. Data dùng chung → `src/app/lib/data.ts`.
- **Interface:** export cùng file với data.
- **Ảnh:** ưu tiên `/images/*.webp` local. Đang dùng `<img>` + `/* eslint-disable @next/next/no-img-element */`. Code mới **nên** dùng `next/image`.
- **Filter:** dùng `tags: string[]` chứa **slug** (xem `CATEGORIES` trong `1-things-to-do/mockData.ts`), không filter theo tên hiển thị.

---

## 11. Checklist trước khi commit component mới

- [ ] Gradient `orange→pink` cho tiêu đề & CTA (không dùng blue ngoài form)
- [ ] Card theo đúng pattern §4 (aspect 16/10, overlay pill, hover translate)
- [ ] Container `max-w-7xl mx-auto px-3 sm:px-4 lg:px-6`
- [ ] Section wrapper `bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg`
- [ ] Mobile-first, test 375 / 768 / 1280
- [ ] Guard `if (!t || !t.sections) return <Skeleton />`
- [ ] Text mới thêm vào **cả** `vi` + `en`
- [ ] Link có `/${currentLocale}/`
- [ ] Giá là `number`, render qua `formatVND()`
- [ ] Đã thêm export vào `components/index.ts`
- [ ] `yarn lint` sạch
