# PA3 - Design Direction: The Nam Du Hill Resort Website

**Version**: 1.3  
**Status**: Mandatory Single Source of Truth for Design Guidelines & Principles

---

# 1. Vision
Tạo ra một website mang cảm giác của một **Luxury Boutique Resort** (phong cách Aman / Six Senses / Banyan Tree / Apple): tối giản, nhiều khoảng trắng, tinh tế.

Website không cạnh tranh với OTA về số lượng tính năng.  
Website cạnh tranh bằng: Trải nghiệm, Cảm xúc, Thương hiệu, Sự tin tưởng.

---

# 2. Component & Sizing Specifications (Figma Pixel Perfect Standard)

## Section Headings (Chuẩn Figma Mobile 16px)
* **Mobile Section Heading**: `text-base` (**16px**) `sm:text-xl md:text-2xl font-bold text-[#1A1A1A] font-serif tracking-tight`
* **Section Subtitle**: `text-xs` (**12px**) `sm:text-sm font-normal text-[#6B7280]`
* **Casing**: Normal text casing.

> ❌ **Không dùng font size 28px - 32px quá to trên giao diện di động.**

---

## Reusable Button Component (`src/components/common/Button.tsx`)
Mọi nút bấm trong dự án đều phải sử dụng component dùng chung `<Button />`.

| Token | Height | Padding X | Font Size | Radius | Variant | Sử dụng |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Button S** | **36px** | 14px | 13px | **6px** | `secondary` / `outline` | Filter, Tag, "Xem thêm", Gallery |
| **Button M** | **42px** | 20px | 14px | **6px** | `primary` | CTA mặc định trên toàn website (90% nút) |
| **Button L** | **46px** | 24px | 15px | **6px** | `primary` | Hero Search, Booking CTA chính |

---

## Input Heights & Radius
| Thành phần | Height | Radius |
| :--- | :---: | :---: |
| **Hero Search Input** | **48px** | **8px** |
| **Form Booking Input** | **46px** | **8px** |
| **Form Checkout Input** | **46px** | **8px** |

---

## Border Radii Standards
| Component | Radius | Tailwind Class |
| :--- | :---: | :--- |
| **Button** | **6px** | `rounded-[6px]` |
| **Input** | **8px** | `rounded-[8px]` |
| **Card** | **12px** | `rounded-[12px]` |
| **Image** | **16px** | `rounded-[16px]` |
| **Modal / Dialog** | **20px** | `rounded-[20px]` |

---

## Responsive Layout Rules
* ❌ **Không gán cứng `max-w-[358px]` cho các container di động.**
* ✅ Sử dụng container đáp ứng linh hoạt: `w-full max-w-lg mx-auto px-4` hoặc `max-w-[1280px]`.

---

# 3. Color Strategy (PA3 Palette)
* **Primary-900**: `#0F2D52` (Header, Footer)
* **Primary-800**: `#163B6C` (CTA Hover)
* **Primary-700**: `#1D4E89` (Primary Brand Color)
* **Primary-600**: `#2563A6` (Primary Button)
* **Primary-500**: `#3B82C4` (Link / Highlight)
* **Gold Accent (5%)**: `#C6A86A` (Rating pill `8.9`, icons, dividers)
* **Background**: `#FAFAF8`
* **Surface / Card**: `#FFFFFF`
* **Border**: `#E5E7EB` | **Divider**: `#ECECEC`
* **Heading Text**: `#1A1A1A` | **Body Text**: `#4B5563` | **Caption**: `#6B7280`

---

# 4. Kim chỉ nam (7 Core Design Principles)
1. **Hình ảnh dẫn dắt trải nghiệm, giao diện hỗ trợ hình ảnh.**
2. **Một màn hình chỉ có một mục tiêu chính.**
3. **Khoảng trắng là thành phần thiết kế, không phải khoảng trống.**
4. **Ít thành phần nhưng chất lượng trình bày cao.**
5. **Đặt phòng nhanh nhưng không làm mất cảm xúc khám phá.**
6. **Mobile là nền tảng thiết kế, Desktop là phần mở rộng.**
7. **Mọi thành phần đều phải nhất quán về nhịp điệu, khoảng cách và ngôn ngữ thị giác.**
