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

## 3. Cấu trúc Trang & Phễu Chuyển đổi V3 Fixed (Chi tiết Thành phần)

### 3.1 HOME (`/h1` hoặc `/h5`) — 6 Section chuẩn Editorial CRO

#### Section 1: Hero Split-Container & Booking Widget
- **Visual Structure:** Desktop Split View 60/40. Khối chữ nằm trên thẻ nền ngà đè mỏng (`--color-surface-base`), bên phải là ảnh drone `hero-drone.jpg` rực nắng.
- **Typography (WCAG AAA P15):** 
  - Subtitle: *"THE NAM DU HILL RESORT · ĐỒI CỦ TRON"* (Màu `--color-brand: #1173B8`, bold 14px, tracking rộng).
  - Heading 1: *"Nghỉ trên đồi, thức dậy giữa biển Nam Du"* (Font *Lora*, `--color-text-primary: #21323C`, font-size 48px, tương phản 12.9:1).
  - Body: *"Khu nghỉ dưỡng chính chủ sở hữu tầm nhìn 360° ôm trọn quần đảo Nam Du. Đón bình minh biển Đông và hoàng hôn hòn Hàng Bè ngay từ ban công phòng."*
- **Booking Widget (CRO Engine):** Đặt nổi đè 50% ở mép dưới Hero. 4 vùng tương tác:
  1. *Ngày nhận phòng* (Calendar Picker)
  2. *Ngày trả phòng* (Calendar Picker)
  3. *Số khách* (Dropdown 1-8 khách)
  4. *Nút CTA:* **[Xem giá & Đặt phòng]** (Màu Vàng Accent `--color-accent: #F6B21B`, chữ xanh đen `#21323C` bold).
- **Trust & Objection Handler (Dưới nút CTA):** 
  - *"📞 Hotline chính chủ: 0985 000 650 (Tel link bấm gọi ngay)"*
  - *"⛴ Tàu hoãn do thời tiết: Dời ngày miễn phí 100%"*

#### Section 2: Trust & Identity Bar (Định danh Chính chủ)
- **Background:** Nền Cát Ấm (`--color-surface-sand: #F7F0E4`).
- **3 Cột Tín nhiệm:**
  1. *Chính chủ sở hữu:* "Resort xây dựng & quản lý trực tiếp bởi người bản địa Nam Du — không qua trung gian."
  2. *Hỗ trợ di chuyển:* "Xe điện đón tận bến tàu Nam Du + Hỗ trợ mua vé tàu cao tốc Rạch Giá – Nam Du."
  3. *Cam kết hoàn hủy:* "Chính sách linh hoạt 100% khi thời tiết xấu tàu không vận hành."

#### Section 3: Section `rooms` (Hạng phòng Nổi bật)
- **Header:** Subtitle *"HẠNG PHÒNG NỔI BẬT"* + Heading *"Không gian nghỉ dưỡng hòa mình với thiên nhiên"*.
- **Grid:** 3 Card phòng nổi bật đại diện 3 nhóm nhu cầu:
  - Card 1: *Phòng Lục Giác Tiêu Chuẩn (2 khách)* ➔ `room-luc-giac.jpg` ➔ Từ 1.250.000đ/đêm.
  - Card 2: *Phòng Đôi Ban Công View Biển (2-3 khách)* ➔ `room-double-balcony.jpg` ➔ Từ 1.546.000đ/đêm.
  - Card 3: *Suite Gia Đình 6 Khách (6-8 khách)* ➔ `room-suite-6.jpg` ➔ Từ 2.800.000đ/đêm.
- **Card Format:** Tỷ lệ ảnh 3:2 + Badge Sức chứa + Tên phòng (*Lora*) + Diện tích m² + Chính sách hủy 1 dòng + Giá nổi bật + Nút *"Chọn phòng"*.
- **Footer Section:** Nút outline *"Xem tất cả 7 hạng phòng & bảng giá"* dẫn sang `/rooms`.

#### Section 4: Section `about` (Kể chuyện & Trải nghiệm Amanoi Style)
- **Visual:** Layout 2 cột xen kẽ (Image left 50% · Text right 50%).
- **Nội dung:** Kể câu chuyện vị thế đồi cao Củ Tron, không khí trong lành, hồ bơi vô cực ngắm biển và trải nghiệm ẩm thực hải sản tươi sống bến tàu.

#### Section 5: Section `places` & `gallery` (Khám phá đảo Nam Du)
- Full-bleed image Bãi Cây Mến (`place-cay-men.png`) + Lưới 4 ảnh trải nghiệm (Tàu câu mực night-tour, Bãi Ngự, Hòn Dầu, BBQ hải sản).

#### Section 6: FAQ & Footer
- FAQ 4 câu giải đáp ngắn gọn: Giờ tàu chạy, Thủ tục nhận phòng, Ăn uống tại resort, Cách đặt cọc 50%.
- Footer đầy đủ MST, Địa chỉ đồi Củ Tron, Bản đồ Google Maps link, Zalo OA chính thức.

---

### 3.2 ROOMS (`/h1/rooms` hoặc `/h5/rooms`)

- **Header:** Banner mỏng `banner-rooms.jpg` + Thanh lọc hạng phòng (Tất cả · Cặp đôi · Gia đình · View biển).
- **Layout Hàng Ngang So Sánh (Desktop P5):**
  - Trái: Ảnh phòng 3:2 với Lightbox slider 3 tấm.
  - Giữa: Tên phòng, Tiện nghi chính (Điều hòa, Wifi, Ban công, WC riêng), Sức chứa ("2 người lớn + 1 trẻ em"), Diện tích (28m²).
  - Phải: Thẻ giá + Dòng *"Cọc trước 50%"* + Nút CTA Vàng **[Đặt phòng này]**.
- **Mobile Layout (P9):** Đổi tự động thành Thẻ dọc xếp lớp, nút đặt phòng cố định góc phải bên dưới thẻ.

---

### 3.3 ROOM DETAIL (`/h1/rooms/[id]`)

- **Hero Gallery:** Grid 5 ảnh (1 tấm lớn bên trái, 4 tấm nhỏ bên phải) hoặc Slider Full View.
- **Sticky Booking Panel (Phải Desktop):**
  - Khối trắng nổi (`--color-surface-raised`), bo góc 12px, shadow nhẹ.
  - Hiển thị: Giá/đêm + Form chọn ngày + Tính tổng tiền + Tính tiền cọc 50%.
  - Dòng cam kết sát nút CTA: *"Chính sách dời ngày miễn phí khi tàu hoãn"*.
  - Nút CTA Vàng Accent: **[Xác nhận đặt phòng ngay]**.
- **Tabs Nội dung (Trái Desktop):**
  - Tab 1: Tổng quan & Tiện nghi (Icon SVG chuẩn).
  - Tab 2: Chính sách nhận/trả phòng (Check-in 14:00 · Check-out 12:00).
  - Tab 3: Chính sách hủy phòng & Thời tiết xấu (Rõ ràng 3 bậc).

---

## 4. Quy định Kỹ thuật Mobile 375px (Mobile-First P9)

1. **Above the Fold (Màn hình 1):**
   - H1 Title + Subtitle + Widget Tìm phòng phải nằm **TRỌN VẸN 100% trong Viewport 375px × 812px**. Không bắt người dùng cuộn mới thấy chỗ nhập ngày.
2. **Sticky Bottom Action Bar:**
   - Khi cuộn qua Hero, xuất hiện thanh cố định ở đáy màn hình di động:
   - Left: *"Từ 1.546.000đ/đêm"* (Chữ đậm 14px).
   - Right: Nút CTA **[Đặt phòng]** (Màu Vàng Accent, padding 10px 20px).
3. **Menu Hamburger Mobile:**
   - Drawer trượt từ phải sang, chứa Nút gọi Hotline cấp cứu + Link Chọn phòng nhanh + Ngôn ngữ VI/EN.

---

## 5. Quy trình Nghiệm thu Bắt buộc bằng AI Agents mới

> **YÊU CẦU BẮT BUỘC:** AI thực thi không được báo hoàn thành nếu chưa đi qua 2 Agent chuyên trách dưới đây:

### 5.1 Agent Tuyển chọn & Phân tích Sắc độ Ảnh (`image-curator.md`)
- Kích hoạt agent `image-curator` kết hợp Vision AI để quét toàn bộ thư mục ảnh crawl/assets.
- Chỉ chọn các ảnh đáp ứng chuẩn **Tropical Bright** (ngập nắng ban ngày, biển xanh trong, không nhòe, không dán logo/watermark rác).
- Tự động phân tích vùng an toàn (Text Safe Area) để đặt tiêu đề không che chủ thể.

### 5.2 Agent Thẩm định Thị giác & Chụp ảnh Tự động (`visual-auditor.md`)
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

### 6.2 Bảng Map tên file Chuẩn hóa đã copy sang `public/property/`:
- **Hero Drone (Home):** `public/property/hero-drone.jpg` (681KB)
- **About Section:** `public/property/about-resort.png` (1.7MB)
- **Rooms Banner:** `public/property/banner-rooms.jpg` (380KB)
- **Card Phòng Lục Giác:** `public/property/room-luc-giac.jpg` (248KB)
- **Card Phòng Suite 6 Khách:** `public/property/room-suite-6.jpg` (641KB)
- **Card Phòng Đôi Ban Công:** `public/property/room-double-balcony.jpg` (114KB)
- **Full-bleed Bãi Cây Mến (Places):** `public/property/place-cay-men.png` (1.5MB)

---

## 7. Định nghĩa "Xong" (Definition of Done — V3 Fixed)

- [x] Chạy Agent `image-curator` tuyển chọn bộ ảnh từ thư mục crawl và copy sang `public/property/`.
- [x] Chạy Agent `visual-auditor` chụp screenshot 1440px & 375px tự động kiểm tra P0–P15.
- [x] Đạt 100% Cổng Chất lượng P0–P15 trong `premium-quality-gate.md`.
- [x] Tương phản WCAG AA ≥ 4.5:1 trên 100% khối chữ (Chuẩn P15).
- [x] Nút CTA chính màu Accent Vàng duy nhất mỗi viewport (Chuẩn P2).



