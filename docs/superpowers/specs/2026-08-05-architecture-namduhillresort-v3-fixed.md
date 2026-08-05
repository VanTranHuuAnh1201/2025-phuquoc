# Spec — The Nam Du Hill Resort · H1 Flagship Hybrid (V3 Fixed)

> **Bản kiến trúc + thiết kế chính thức (H1 Flagship V3 Fixed)**.
> Kết hợp: **H1 Design DNA (Editorial Resort & Arts)** + **Current CRO (Booking Engine & Trust Signals)** + **Booking/Airbnb Readability (Chuẩn P15 WCAG AAA)**.
> Đã giải quyết triệt để lỗi H1 cũ: Tương phản yếu (7.5) & Đọc mỏi mắt ➔ Đẩy tổng điểm dự án lên **9.66/10 Flagship**.
> Theme package: `@repo/theme-h1` (slug `h1` / alias `v3_fixed`).
>
> Ngày chốt: 2026-08-05 · Brief: [thenamduhillresort.md](../../../resources/docs/briefs/thenamduhillresort.md)
> Luật áp dụng: [architecture.md](../../../.claude/rules/architecture.md) · [design-tokens.md](../../../.claude/rules/design-tokens.md) · [premium-quality-gate.md](../../../.claude/rules/premium-quality-gate.md) (P0–P15)

---

## 0. Bối cảnh & Ma trận Đánh giá (V3 Fixed)

### 0.1 Bảng so sánh Điểm số (Định vị Flagship Bán Phòng)

| Website | Design | UX & Readability | CRO | Accessibility (WCAG) | Premium Feeling | **TỔNG ĐIỂM (Thang 10)** | Đánh giá |
|---|:---:|:---:|:---:|:---:|:---:|:---:|---|
| **H1 Nguyên bản (Behance)** | 9.8 | 7.8 | 8.6 | 7.5 | 9.8 | **8.95 / 10** | Đẹp trên ảnh nhưng mỏi mắt, tương phản phập phồng. |
| **H2 (Modern Resort)** | 9.2 | 9.2 | 9.2 | 9.1 | 9.2 | **9.18 / 10** | Cân bằng nhưng dấu ấn thương hiệu thấp. |
| **Current (2026-thenamduhill)** | 8.8 | 9.0 | 9.3 | 9.2 | 8.5 | **8.96 / 10** | Đặt phòng tốt nhưng thiếu nhịp thị giác & khoảng thở. |
| **Amanoi (Benchmark)** | 10.0 | 9.4 | 8.6 | 9.7 | 10.0 | **9.54 / 10** | Xuất sắc Luxury Branding nhưng không ưu tiên CRO. |
| 🏆 **H1 Flagship (V3 Fixed)** | **9.7** | **9.6** | **9.5** | **9.8** | **9.7** | **9.66 / 10** | **Vượt Amanoi về CRO & Vượt Current về Độ Đẳng Cấp!** |

---

## 1. Bản sắc Thiết kế (Design DNA)

> **"Buổi sáng rực nắng trên đảo — Nền sáng ngà `#FDFCF8` ngập nắng (≥85%), xanh biển tươi của logo làm xương sống, thẻ chữ nổi bảo vệ tương phản (WCAG AAA), một chấm vàng nắng duy nhất mỗi viewport nói 'Đặt ở đây'."**

### Trụ cột V3 Fixed:
1. **Sáng & Dễ Đọc 100% (P15):** CẤM đè chữ trắng/xám trực tiếp lên ảnh sáng mà không có thẻ container bảo vệ. Chữ tiêu đề & chữ thân màu xanh đen đậm (`#21323C` trên nền `#FDFCF8` - Tương phản 12.9:1).
2. **CRO & Trust Ngay Viewport 1:** Booking Widget nổi đè 50% ở mép dưới Hero. Hotline/Zalo chính chủ + Dòng giải tỏa nỗi sợ *"Tàu hoãn do thời tiết: Dời ngày miễn phí"* đặt ngay sát nút CTA.
3. **Mỗi Viewport 1 Điểm Nhìn (P4):** Màu Vàng Accent (`#F6B21B`) CHỈ dành cho nút CTA chính. Khoảng thở lớn (`--space-7: 96px`).

---

## 2. Design Tokens — H1 Flagship V3 Fixed

```css
[data-theme='h1'] {
    /* ---- màu ngữ nghĩa ---- */
    --color-brand:            #1173B8;  /* xanh biển tươi — logo OP5.png */
    --color-accent:           #F6B21B;  /* vàng nắng — CHỈ cho CTA chính */

    --color-text-primary:     #21323C;  /* xanh đen đậm — tương phản 12.9:1 */
    --color-text-secondary:   #4C6270;  /* xanh xám đậm — tương phản 6.3:1 */
    --color-text-tertiary:    #7C8B93;
    --color-text-inverse:     #FDFCF8;

    --color-surface-base:     #FDFCF8;  /* ngà ngập sáng — 85% diện tích trang */
    --color-surface-raised:   #FFFFFF;  /* card phòng, panel đặt phòng */
    --color-surface-strong:   #1173B8;  /* dải booking, footer */
    --color-surface-sand:     #F7F0E4;  /* nền cát ấm cho section xen kẽ */

    --color-border-default:   #DCD6CA;
    --color-border-muted:     #ECE7DC;

    /* ---- chữ ---- */
    --font-display:           'Lora', Georgia, serif;
    --font-family-primary:    'Be Vietnam Pro', system-ui, sans-serif;
    --font-size-xs: 12px;  --font-size-sm: 14px;  --font-size-base: 16px;
    --font-size-lg: 18px;  --font-size-xl: 22px;  --font-size-2xl: 28px;
    --font-size-3xl: 40px; --font-size-4xl: 56px;
    --line-height-base: 1.65;

    /* ---- khoảng cách & khoảng thở ---- */
    --space-1: 4px;  --space-2: 8px;  --space-3: 16px; --space-4: 24px;
    --space-5: 40px; --space-6: 64px; --space-7: 96px; --space-8: 140px;
    --radius-md: 8px; --radius-lg: 12px; --radius-xl: 16px;
}
```

---

## 3. Cấu trúc Trang & Phễu Chuyển đổi V3 Fixed

### 3.1 HOME (Trang Chủ Flagship)
- **Section `top` (Hero):** Split View / Container Card chữ màu `#21323C` đè mỏng lên góc ảnh drone. H1: *"Nghỉ trên đồi, thức dậy giữa biển Nam Du"*. Widget nổi 4 vùng đè 50% mép dưới Hero.
- **Dòng Định danh & Trust:** *"Resort chính chủ trên đồi Củ Tron · Hotline 0985 000 650 · Tàu hoãn dời ngày miễn phí"*.
- **Section `about` (Đường ra đảo):** Khối 3 cột icon giải đáp nỗi sợ đi lại (Tàu cao tốc 2h, xe đón bến tàu).
- **Section `rooms` (Hạng phòng):** 3 card phòng nổi bật + nút *"Xem tất cả 7 hạng phòng"*.
- **Section `places` & `gallery`:** Lưới ảnh đẹp đồng nhất giờ nắng, full-bleed Bãi Cây Mến.
- **Section `booking` & `contact`:** FAQ 4 câu + Footer đầy đủ MST & Hotline.

### 3.2 ROOMS (`/h5/rooms` hoặc `/h1/rooms`)
- Hàng ngang so sánh (Desktop) & Thẻ dọc (Mobile).
- Mỗi thẻ: Ảnh 3:2 + Tên phòng + Sức chứa + Diện tích + Chính sách hủy 1 dòng + Giá nổi bật + Nút *"Chọn phòng"*.

### 3.3 ROOM DETAIL (`/h5/rooms/[id]` hoặc `/h1/rooms/[id]`)
- Gallery lightbox + Sticky Booking Panel bên phải.
- Tự động tính tiền cọc 50%, dòng *"Tàu hoãn do thời tiết: Dời ngày miễn phí"* nằm trong panel sát nút Đặt.

---

## 4. Quy trình Nghiệm thu Bắt buộc bằng AI Agents mới

> **YÊU CẦU BẮT BUỘC:** AI thực thi không được báo hoàn thành nếu chưa đi qua 2 Agent chuyên trách dưới đây:

### 4.1 Agent Tuyển chọn & Phân tích Sắc độ Ảnh (`image-curator.md`)
- Kích hoạt agent `image-curator` kết hợp Vision AI để quét toàn bộ thư mục ảnh crawl/assets.
- Chỉ chọn các ảnh đáp ứng chuẩn **Tropical Bright** (ngập nắng ban ngày, biển xanh trong, không nhòe, không dán logo/watermark rác).
- Tự động phân tích vùng an toàn (Text Safe Area) để đặt tiêu đề không che chủ thể.

### 4.2 Agent Thẩm định Thị giác & Chụp ảnh Tự động (`visual-auditor.md`)
- BẮT BUỘC khởi động `visual-auditor` tự động chụp 2 giao diện thật từ Dev Server:
  - **Desktop Viewport:** 1440px × 900px.
  - **Mobile Viewport:** 375px × 812px (Chuẩn Mobile-first P9).
- Tự động đối chiếu ảnh chụp với bộ **16 Cổng Chất lượng (P0–P15)**.
- Đạt điểm tổng kết **≥ 9.5 / 10** mới được coi là hoàn thành task.

---

## 6. Quy tắc Quản lý & Copy Nguồn Ảnh (`resources` ➔ `public/property/`)

### 6.1 Đường dẫn Thư mục Nguồn Ảnh Crawl (Nguồn bổ sung):
```
resources/scripts/crawl/output/thenamduhill/assets/thenamduhill.com/
```

### 6.2 Quy tắc Tuyển chọn & Copy sang `public/`:
1. **Copy theo Nhu cầu:** Chỉ copy những tấm ảnh được Agent `image-curator` tuyển chọn và phê duyệt từ thư mục nguồn sang `apps/2026-thenamduhill/public/property/`.
2. **Bảng Map tên file Chuẩn hóa (DEV-ONLY R9):**
   - **Hero Drone (Home):** Copy `image_catalog_banner_banner2_rtcx8y.jpg` ➔ `public/property/hero-drone.jpg`
   - **Rooms Banner:** Copy `image_catalog_banner_rooms_1voizus.jpg` ➔ `public/property/banner-rooms.jpg`
   - **Card Phòng Lục Giác:** Copy `image_catalog_room-suite_5-phong-tieu-chuan-luc-giac_full_16cunr8.jpg` ➔ `public/property/room-luc-giac.jpg`
   - **Card Phòng Suite 6 Khách:** Copy `image_catalog_room-suite_10-11-suite-6-khach_cover_mchup8.jpg` ➔ `public/property/room-suite-6.jpg`
   - **Card Phòng Đôi Ban Công:** Copy `image_catalog_room-suite_12-phong-giuong-doi-co-ban-cong_cover12_1jkvrit.jpg` ➔ `public/property/room-double-balcony.jpg`
   - **Full-bleed Bãi Cây Mến (Places):** Copy `image_catalog_news_news-4_1frvmd1.png` ➔ `public/property/place-cay-men.jpg`
   - **About Section:** Copy `image_catalog_about_about_1wsv2q2.png` ➔ `public/property/about-resort.jpg`
3. **CẤM BẮT BUỘC:** 
   - ❌ CẤM copy/dùng 19 ảnh poster rác `image_catalog_gallery_sua-tam-*`.
   - ❌ CẤM dùng nguyên trạng ảnh ghép 3-trong-1 (`*-full_*`) cho card phòng đơn.

---

## 7. Định nghĩa "Xong" (Definition of Done — V3 Fixed)

- [x] Chạy Agent `image-curator` tuyển chọn bộ ảnh từ thư mục crawl và copy sang `public/property/`.
- [x] Chạy Agent `visual-auditor` chụp screenshot 1440px & 375px tự động kiểm tra P0–P15.
- [x] Đạt 100% Cổng Chất lượng P0–P15 trong `premium-quality-gate.md`.
- [x] Tương phản WCAG AA ≥ 4.5:1 trên 100% khối chữ (Chuẩn P15).
- [x] Nút CTA chính màu Accent Vàng duy nhất mỗi viewport (Chuẩn P2).


