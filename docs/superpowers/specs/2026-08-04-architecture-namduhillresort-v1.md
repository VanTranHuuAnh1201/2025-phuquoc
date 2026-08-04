# Spec — Theme Nam Du Hill Resort (Bản 2 — PA3 / Figma)

> Bản thiết kế giao diện chi tiết cho phiên bản thứ 2 của The Nam Du Hill Resort.
> Biên soạn dựa trên bản mẫu Figma (`apps/2026-thenamduhillresort/figma/`) và bộ định hướng thiết kế PA3.
>
> Trạng thái: **Đã thử nghiệm (Khách hàng nhận xét: Màu sắc u buồn, không đặc biệt)**  
> Nguồn Figma & Code: `apps/2026-thenamduhillresort/`  
> Tài liệu thiết kế gốc: `DESIGN_DIRECTION.md` (PA3 Standard)

---

## 0. Bối cảnh và quyết định nền

### 0.1 Vì sao có bản 2

Repo có bản đầu tiên `apps/2026-thenamduhill` (Theme H1) bị đánh giá là giống website khách sạn phổ thông. Bản 2 được khởi tạo dưới dạng một giao diện **Luxury Boutique Resort** độc lập với thiết kế Figma riêng (`apps/2026-thenamduhillresort/figma/`), áp dụng tiêu chuẩn thiết kế **PA3 (Precision Aesthetic v3)** để nâng tầm nhận diện thương hiệu.

| Bản | Vị trí | Định hướng Figma / Style | Vấn đề từ Khách hàng |
|---|---|---|---|
| 1 | `apps/2026-thenamduhill` | Theme Package H1 (Standard Hotel) | Đúng luật monorepo, nhưng gu thẩm mỹ chưa đạt |
| 2 | `apps/2026-thenamduhillresort` | Figma PA3 — Luxury Navy & Playfair Serif | **Màu sắc u buồn, tăm tối, giao diện thiếu điểm nhấn nhiệt đới** |

### 0.2 Quyết định thiết kế chốt trong Figma (PA3 Standard)

| # | Quyết định | Ghi chú |
|---|---|---|
| D-1 | Định hướng phong cách: **Luxury Boutique Resort** | Lấy cảm hứng từ Aman / Six Senses / Banyan Tree |
| D-2 | Bảng màu chủ đạo: **Deep Midnight Navy & Primary Blue** | `#0B192C`, `#0F2D52`, `#1D4E89`, `#2563A6` |
| D-3 | Điểm nhấn thương hiệu: **Amber Gold 5%** | `#FFB800` / `#C6A86A` cho rating star, pill badge, đường kẻ |
| D-4 | Bộ phông chữ: **Playfair Display + Inter** | Serif cổ điển cho tiêu đề, Inter cho nội dung |
| D-5 | Quy chuẩn bo góc (Border Radii): **Tầng bậc 6px - 24px** | Button 6px, Input 8px-14px, Card 18px, Image 22px, Modal 24px |
| D-6 | Nền trang: **Xám đục nhạt (`#FAFAF8` / `#F8FAFC`)** | Nền trung tính làm nổi bật các thẻ nổi trắng |
| D-7 | Mobile Specification: **Thanh Đặt phòng Cố định (Mobile Sticky CTA)** | Hiển thị giá từ `1.250.000đ/đêm` ở đáy màn hình di động |

### 0.3 Điều KHÔNG làm ở phiên bản này

- Không sử dụng bảng màu tươi sáng nhiệt đới (Teal / Turquoise) của biển Nam Du.
- Không áp dụng nhịp bố cục so le kiểu tạp chí (Editorial layout) mà tuân theo khung lưới container cân đối.
- Không sử dụng font display thủ công như Fraunces.

---

## 1. Point of view (K1)

> **"Luxury Boutique Resort trên đỉnh đồi — Tông Navy đại dương trầm tối, khung thẻ bo góc 18px nổi bật trên nền xám nhạt, điểm xuyết ánh vàng kim sang trọng."**

Ba trụ cột thiết kế:

| Trụ cột | Quyết định Figma PA3 | Lý do thiết kế |
|---|---|---|
| **Màu sắc** | Deep Navy (`#0B192C`) làm chủ đạo, Accent Gold (`#FFB800`) | Tạo vẻ thượng lưu, chuyên nghiệp chuẩn nghỉ dưỡng 5 sao quốc tế |
| **Chữ** | `Playfair Display` serif cho tiêu đề + `Inter` cho thân | Font Serif mang tính di sản, lịch lãm; Sans-serif tối ưu khả năng đọc |
| **Khối & Bóng** | Container trắng `rounded-[18px]` nổi trên nền `#FAFAF8` với shadow `0 8px 24px rgba(0,0,0,0.08)` | Định hình các vùng thông tin rõ ràng, mạch lạc |

**Phép thử K1:** Nhìn vào giao diện phải thấy sự chuẩn chỉnh, ngăn nắp như một khu nghỉ dưỡng cao cấp. Thử nghiệm thực tế: Khi áp dụng lên Nam Du Hill, giao diện bị đánh giá là **quá lạnh và nghiêm cẩn**, giống khách sạn thương mại/tài chính hơn là một resort nghỉ dưỡng biển hoang sơ.

---

## 2. Design tokens

### 2.1 Nguồn gốc bảng màu Figma (PA3 Palette)

Màu sắc của Bản 2 được trích xuất từ tài liệu `DESIGN_DIRECTION.md` và mã nguồn `globals.css`:

- **Navy đại dương (`#0B192C` / `#0F2D52` / `#1D4E89`):** Lấy làm màu nhận diện chính cho Header, Footer, Hero overlay và các tiêu đề quan trọng.
- **Amber Gold (`#FFB800` / `#C6A86A`):** Dùng làm điểm nhấn cho rating 4.9★, các icon ngôi sao, badge danh mục và nút bấm CTA chính.
- **Nền xám đục (`#FAFAF8` / `#F8FAFC`):** Được chọn làm nền trang với mục đích tạo tương phản cho các thẻ trắng (`#FFFFFF`).

### 2.2 Bảng token CSS (`apps/2026-thenamduhillresort/src/app/globals.css`)

```css
@theme {
    /* ---- Màu nhận diện PA3 ---- */
    --color-primary-900: #0B192C;  /* Deep Midnight Navy */
    --color-primary-800: #0F2D52;  /* Dark Blue Header/Footer */
    --color-primary-700: #1D4E89;  /* Primary Brand Navy */
    --color-primary-600: #2563A6;  /* Accent Button Blue */
    --color-primary-500: #0284C7;  /* Sky Blue Highlight */

    /* ---- Màu điểm nhấn Gold ---- */
    --color-gold-500: #FFB800;     /* Vibrant Amber Gold */
    --color-gold-400: #FBBF24;
    --color-gold-300: #FDE68A;

    /* ---- Bề mặt & Nền ---- */
    --color-background: #F8FAFC;   /* Nền trang xám lạnh */
    --color-surface:    #FFFFFF;   /* Nền thẻ nổi */
    --color-hover:      #F1F5F9;

    /* ---- Chữ ---- */
    --font-serif: 'Playfair Display', Georgia, serif;
    --font-sans:  'Inter', system-ui, -apple-system, sans-serif;
    
    --color-text-main:  #0F172A;   /* Slate 900 */
    --color-text-body:  #334155;   /* Slate 700 */
    --color-text-muted: #475569;   /* Slate 600 */

    /* ---- Bo góc quy chuẩn PA3 ---- */
    --radius-button: 6px;
    --radius-input:  14px;
    --radius-card:   18px;
    --radius-image:  22px;
    --radius-modal:  24px;

    /* ---- Đổ bóng PA3 ---- */
    --shadow-pa3-sm: 0 2px 8px rgba(0, 0, 0, 0.05);
    --shadow-pa3-md: 0 8px 24px rgba(0, 0, 0, 0.08);
    --shadow-pa3-lg: 0 20px 60px rgba(0, 0, 0, 0.12);
}
```

### 2.3 Ba luật riêng của giao diện Bản 2

1. **Mọi nút bấm phải tuân theo 3 quy chuẩn kích thước Figma:** Button S (36px), Button M (42px), Button L (46px) với bo góc `rounded-[6px]`.
2. **Tiêu đề Section chuẩn di động 16px:** Mobile Section Heading không được vượt quá `text-base` (16px) để tránh chiếm hết không gian màn hình di động (`sm:text-xl md:text-2xl font-bold text-[#1A1A1A] font-serif`).
3. **Màu Navy đè bóng mờ trên Hero:** Hero Banner bắt buộc dùng gradient mờ từ `#0B192C` để làm rõ tiêu đề trắng.

### 2.4 Font và tiếng Việt

| Vai trò | Font | Đặc điểm |
|---|---|---|
| Display / Heading | **Playfair Display** | Serif cổ điển, đường nét sắc sảo, hỗ trợ Tiếng Việt qua Google Fonts |
| Body / Content | **Inter** | Sans-serif hiện đại, tối ưu hiển thị số liệu và văn bản nhỏ |

Nạp qua Google Fonts CDN trong `src/app/layout.tsx`:
`https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,900&display=swap`

### 2.5 Tương phản & Phân tích vì sao u buồn

| Cặp màu | Tỷ lệ tương phản | Đánh giá WCAG | Ảnh hưởng thị giác |
|---|---|---|---|
| `#FFFFFF` trên `#0B192C` | ~16:1 | Đạt AAA | Chữ trắng rất rõ trên nền Navy mờ |
| `#0F172A` trên `#FAFAF8` | ~15:1 | Đạt AAA | Chữ thân dễ đọc |
| `#0B192C` (Navy đậm) chiếm 40% diện tích | — | — | **Tạo hiệu ứng tăm tối, nặng nề, mất tính khoáng đạt của biển đảo** |
| `#F8FAFC` (Nền xám đục) | — | — | **Làm ảnh thiên nhiên bị xỉn màu, thiếu sức sống** |

---

## 3. Cấu trúc Home — Desktop

### 3.1 Contract section

Danh sách 8 section trình bày trên `HomePage` (`src/app/page.tsx`):

```ts
export const sections = [
    'hero',       // Hero banner slider + Floating Search Bar
    'why-us',     // 4 Lý do chọn resort
    'panorama',   // Banner góc rộng 360 độ
    'rooms',      // Danh sách 7 hạng phòng tiêu biểu
    'dining',     // Nhà hàng & Sunset Bar
    'explore',    // Khám phá điểm đến đảo Nam Du
    'services',   // Dịch vụ đón đưa / Thuê xe / Tour
    'contact-cta' // Banner chốt đặt phòng & hotline Zalo
]
```

### 3.2 Nhịp section

Bản 2 thiết kế theo nhịp **đều dặn chuẩn mực (Standard Grid Rhythm)**:

```
hero        ████████████████████  Slider full-width 700px + Floating Search Bar đè mép
why-us      ▓▓▓  ▓▓▓  ▓▓▓  ▓▓▓   Grid 4 cột đều, container 1280px, padding 64px
panorama    ████████████████████  Banner ảnh full-width 450px
rooms       ▓▓▓   ▓▓▓   ▓▓▓      Grid 3 cột card phòng đều chằn chặn
dining      ▓▓▓▓▓▓▓   ░░░░░░░    Layout 2 cột: Ảnh bên trái (7fr), Chữ bên phải (5fr)
explore     ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓    Lưới 3x2 các thẻ điểm đến du lịch
services    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    Dải danh sách dịch vụ đi kèm
contact-cta ████████████████████  Banner Navy đặc 100% width + Hotline & Zalo CTA
```

### 3.3 Đặc tả từng section

Khung nội dung tối đa `1280px` (`max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8`).

#### `HeroSection` — Banner chính
- **Chiều cao:** `700px` (`lg:h-[700px] min-h-[80vh]`), bo góc đáy `rounded-b-[40px]`.
- **Background:** Slider 4 ảnh chuyển động mượt 8 giây/lần. Gradient mờ từ `#0B192C`.
- **Top Badge:** Badge mờ `★ RESORT NGHỈ DƯỠNG BIỂN NAM DU ★` chữ màu vàng `#FFB800`.
- **Rating Tag:** `4.9 / 5` ★ kèm "83 đánh giá xuất sắc".
- **Tiêu đề:** `Playfair Display`, `text-6xl`, font-black, gradient chữ "The Nam Du Hill" ánh vàng kim.
- **Floating Booking Bar (Desktop):** Khối trắng nổi `bg-white/95 backdrop-blur-xl rounded-3xl` đè lên mép dưới Hero. Gồm 3 vùng (Nhận phòng, Trả phòng, Số khách) + Nút vàng kim **"TÌM PHÒNG NGAY"** (h-56px, radius full).

#### `WhyUsSection` — Lý do lựa chọn
- **Bố cục:** Lưới 4 cột đều (`grid-cols-4 gap-6`).
- **Nội dung:** 4 thẻ trắng `rounded-[18px]` shadow `pa3-md`:
  1. *Vị thế đỉnh đồi ngắm 2 mặt biển*
  2. *Bể bơi vô cực ngắm hoàng hôn*
  3. *Không gian biệt lập riêng tư*
  4. *Hỗ trợ trải nghiệm bản địa 24/7*

#### `PanoramaSection` — Góc nhìn 360°
- **Bố cục:** Ảnh khổ lớn trải rộng toàn màn hình (`h-[450px]`).
- **Nội dung:** Ảnh góc rộng ôm trọn vịnh Nam Du nhìn từ đồi resort, phủ lớp gradient nhẹ đè dòng chữ Serif "Bình Minh & Hoàng Hôn Từ Cùng Một Sân Hiên".

#### `RoomsSection` — Hạng phòng tiêu biểu
- **Bố cục:** Lưới 3 cột card phòng (`grid-cols-3 gap-8`).
- **Cấu trúc Card:**
  - Ảnh phòng tỷ lệ `16:10`, bo góc `16px`, hover zoom 1.05.
  - Badge giá nổi trên ảnh: `Từ 1.250.000đ / đêm`.
  - Tên phòng `Playfair Display` 20px, thông số diện tích (`35m²`), sức chứa (`2 người`).
  - Nút "Xem chi tiết & Đặt phòng" (`Button M` 42px).

#### `DiningSection` — Ẩm thực & Sunset Bar
- **Bố cục:** 2 cột asymmetric `7fr 5fr`.
- **Trái:** Grid 2 ảnh lớn nhỏ thể hiện món ăn hải sản tươi sống & đồ uống tại bar.
- **Phải:** Khối văn bản giới thiệu nhà hàng, giờ phục vụ (`06:00 - 22:00`) và nút đặt bàn.

#### `ExploreSection` — Khám phá Nam Du
- **Bố cục:** Lưới 3 cột (Bãi Cây Mến, Hòn Mấu, Hải Đăng Nam Du, Tour câu mực đêm).
- **Thẻ điểm đến:** Ảnh bo góc `18px`, hiệu ứng phủ mờ khi hover hiện mô tả ngắn và khoảng cách từ resort.

#### `HostServiceSection` — Dịch vụ đi kèm
- **Bố cục:** Dải 3 cột dịch vụ (Đón đưa bến tàu, Thuê xe máy đảo, Tour cano ngắm san hô).

#### `ContactCtaSection` — Liên hệ & Chốt đơn
- **Bố cục:** Banner Navy đậm (`bg-[#0B192C]`) tràn mép màn hình, bo góc `32px`.
- **Nội dung:** Tiêu đề Serif trắng, nút Hotline bấm gọi ngay (`tel:0941444442`) màu vàng `#FFB800` + Nút Chat Zalo OA.

---

## 4. Cấu trúc Home — Mobile

### 4.1 Breakpoint & Sizing Standard (Figma Pixel Perfect)

| Tiêu chuẩn | Quy định Figma PA3 |
|---|---|
| **Mobile Section Heading** | `text-base` (**16px**) `font-bold font-serif text-[#1A1A1A]` |
| **Section Subtitle** | `text-xs` (**12px**) `text-[#6B7280]` |
| **Container Padding** | `px-4` (`max-w-lg mx-auto`) |

### 4.2 Layout riêng từng Section trên Mobile

| Section | Xử lý giao diện Mobile |
|---|---|
| `HeroSection` | Thu gọn Hero xuống `h-[520px]`. Ô tìm kiếm phòng chuyển từ thanh ngang thành **Floating Card dọc 2 hàng** (`Check-in/Check-out` + `Số khách`) đè lên mép dưới Hero. |
| `WhyUsSection` | Chuyển từ 4 cột ngang thành **lưới 2x2** hoặc stack dọc 1 cột. |
| `RoomsSection` | Chuyển 3 card ngang thành danh sách cuộn dọc 1 cột (`grid-cols-1 gap-6`). |
| `DiningSection` | Stack dọc: Ảnh ẩm thực lên trên, văn bản giới thiệu xuống dưới. |
| `Explore` | Lưới 1 cột, ảnh dạng `aspect-[16/9]` cho dễ nhìn trên di động. |
| `ContactCta` | Nút Hotline và Zalo mở rộng **100% chiều ngang** (`w-full`). |

### 4.3 Mobile Sticky Bottom CTA Bar (`src/components/common/MobileStickyCta.tsx`)

Cố định ở đáy màn hình di động khi người dùng cuộn qua Hero:

```
┌────────────────────────────────────────┐
│ Từ 1.250.000đ / đêm   [ ĐẶT PHÒNG NGAY ]│
└────────────────────────────────────────┘
```

- **Nền:** White backdrop blur `bg-white/95`, viền trên `border-t border-slate-200`, shadow `0 -4px 20px rgba(0,0,0,0.1)`.
- **Nút bấm:** `bg-[#FFB800]` chữ đen, chiều cao `46px`, bo góc `12px`.
- **Safe Area:** Tôn trọng `env(safe-area-inset-bottom)` trên iPhone.

### 4.4 Vùng chạm và Kích thước Nút bấm (Button Tokens)

Quy định kích thước nút bấm chuẩn Figma (`src/components/common/Button.tsx`):

| Token | Height | Padding X | Font Size | Radius | Variant |
|---|:---:|:---:|:---:|:---:|---|
| **Button S** | **36px** | 14px | 13px | `6px` | Filter, Tag, "Xem thêm" |
| **Button M** | **42px** | 20px | 14px | `6px` | CTA Card phòng, Nút phụ (90% nút) |
| **Button L** | **46px** | 24px | 15px | `6px` | Search Bar, Booking CTA chính |

---

## 5. Mã nguồn & Figma Assets

### 5.1 Thư mục Figma Templates (`apps/2026-thenamduhillresort/figma/`)

Các bản thiết kế HTML/Figma prototype có sẵn trong kho lưu trữ:

```
figma/
├── Nam Du Hill.dc.html        (Giao diện Trang chủ gốc)
├── Rooms.dc.html              (Giao diện Danh sách 7 hạng phòng)
├── Room Detail.dc.html        (Giao diện Chi tiết phòng)
├── Dining.dc.html             (Giao diện Nhà hàng & Bar)
├── Explore Nam Du.dc.html     (Giao diện Tour & Địa danh)
├── Checkout.dc.html           (Giao diện Luồng đặt phòng & Thanh toán)
├── Contact.dc.html            (Giao diện Liên hệ)
└── Mobile Preview.dc.html     (Giao diện Xem trước Di động)
```

---

## 6. Trạng thái component (D3)

Khung trạng thái quy chuẩn cho các component tương tác trong Bản 2:

| Trạng thái | Yêu cầu thể hiện ở Bản 2 |
|---|---|
| `default` | Nền trắng `#FFFFFF`, chữ `#0F172A`, viền `#E2E8F0` |
| `hover` | Button Primary chuyển từ `#2563A6` sang `#1D4E89`. Card phòng nhấc nổi `translate-y-[-4px]` |
| `focus-visible` | Outline 2px màu `#2563A6` |
| `active` | Scale nhẹ `scale-[0.98]` |
| `disabled` | Opacity 50%, `cursor-not-allowed` |
| `loading` | Spinner xoay giữa nút, giữ nguyên width/height nút |
| `error` | Viền đỏ `border-red-500` kèm chữ thông báo lỗi phía dưới |

---

## 7. Ảnh — Hiện trạng và Nguồn dữ liệu

- **Ảnh Hero:** Đặt trong `public/uploads/` (`hero-1.jpg`, `pasted-1785691965790-0.png`...).
- **Ảnh Phòng:** Dùng ảnh crawl trực tiếp từ backend lưu tại `public/uploads/`.
- **Hạn chế:** Các ảnh phòng dạng collage 3-trong-1 khi đặt vào khung hình `16:10` bo góc `18px` của Bản 2 trông bị nén và thiếu sự tinh tế.

---

## 8. Định nghĩa "xong" cho Bản 2 (Checklist nghiệm thu ban đầu)

- [x] Dựng đủ 8 section trang chủ theo Figma PA3 Standard
- [x] Khai báo bộ màu Navy, Blue & Amber Gold trong `globals.css`
- [x] Đạt chuẩn kích thước nút bấm (Button S/M/L) và bo góc (Card 18px)
- [x] Tích hợp Sticky Bottom CTA trên di động
- [x] Hỗ trợ chuyển đổi ngôn ngữ VI/EN qua `LanguageContext`
- [x] Dựng sẵn các trang phụ: `/rooms`, `/dining`, `/explore`, `/checkout`

---

## 9. Phân tích Rủi ro & Lý do Khách hàng Reject

| Lý do Khách hàng Reject | Phân tích kỹ thuật & Thiết kế |
|---|---|
| **"Màu sắc u buồn, tăm tối"** | Việc lạm dụng màu Navy mờ (`#0B192C`) phủ kín các mảng khối rộng đè lên nền xám đục (`#FAFAF8`) khiến toàn bộ website mang sắc thái lạnh, u ám. Nó phá vỡ hoàn toàn cảm giác nắng vàng, biển xanh tươi mát của đảo Nam Du. |
| **"Giao diện không đặc biệt"** | Nhịp section bị rập khuôn theo lưới đều chằn chặn. Thiếu các section tạo điểm dừng thị giác (visual pause) và thiếu sự đột phá về font chữ display. |

---

## 10. Sau bản này

Từ bài học thất bại của Bản 2:
1. **Dừng phát triển Bản 2**, giữ lại kho code `apps/2026-thenamduhillresort/` làm tài liệu tham chiếu.
2. **Khởi chạy Bản 3 (`packages/theme-namdu` / Theme H5):** Chuyển dịch toàn bộ sang phong cách **Coastal Editorial** với màu **Ngọc lam sâu (`#0E5B63`)**, **Vàng nghệ rực (`#E8A317`)**, nền **Trắng ngà ấm (`#FBF9F5`)** và phông chữ Serif display **Fraunces**.
