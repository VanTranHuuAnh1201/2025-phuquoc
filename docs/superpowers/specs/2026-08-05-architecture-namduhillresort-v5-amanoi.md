# Spec — The Nam Du Hill Resort · Bản 5 "Amanoi Ultra-Luxury Resort"

> **Bản kiến trúc + thiết kế chính thức cho Phiên bản 5 (`v5_amanoi`)**.
> Định vị: **Ultra-Luxury Hospitality** học trực tiếp từ benchmark **Amanoi** (`https://www.aman.com/vi-vn/resorts/amanoi`).
> Kết hợp: Thần thái sang trọng đỉnh cao của Amanoi + Cá tính thiên nhiên đồi Củ Tron Nam Du + Phễu đặt phòng ẩn tinh tế (Luxury Concierge Booking).
> Scope: **Home + Rooms + RoomDetail**, theme package slug `h4` (hoặc `v5_amanoi`).
>
> Ngày khởi tạo: 2026-08-05 · Brief: [thenamduhillresort-v3-fixed.md](../../../resources/docs/briefs/thenamduhillresort-v3-fixed.md)
> Luật áp dụng: [architecture.md](../../../.claude/rules/architecture.md) · [design-tokens.md](../../../.claude/rules/design-tokens.md) · [premium-quality-gate.md](../../../.claude/rules/premium-quality-gate.md) (P0–P15)

---

## 0. Bối cảnh & Mục tiêu Định vị Bản 5 (Amanoi Style)

### 0.1 So sánh Định vị Bản 5 vs Bản v3_fixed

| Tiêu chí | Bản 3_fixed (Flagship Hybrid) | **Bản 5 (Amanoi Ultra-Luxury)** |
|---|---|---|
| **Mẫu Benchmark chính** | Current + Booking.com + H1 | **Amanoi Resort** (`https://www.aman.com/vi-vn/resorts/amanoi`) |
| **Triết lý Thiết kế** | Editorial CRO Bright (Sáng rực nắng, Widget nổi) | **Quiet Luxury & Immersive Hospitality** (Sang trọng tĩnh lặng, Ảnh tràn khổ, Khoảng thở siêu rộng) |
| **Tone màu chủ đạo** | Trắng ngà `#FDFCF8` + Xanh tươi `#1173B8` | **Alabaster Warm `#FAF8F5` + Ocean Navy `#1E3A4C` + Champagne Gold `#C8A261`** |
| **Thanh Booking** | Widget đè nổi 50% ở Hero | **Luxury Concierge Bar** (Thanh đặt phòng chìm tinh tế ở đáy Hero) |
| **Typography** | Lora + Be Vietnam Pro (Tương phản cao AAA) | **Lora Display (Luxury Serif) + Inter/Be Vietnam Pro** (Tracking rộng, Nhịp điệu thơ) |
| **Mục tiêu chính** | Tối ưu số lượng booking trực tiếp | **Nâng tầm đẳng cấp thương hiệu resort đạt chuẩn 10k USD + Thu hút phân khúc khách cao cấp** |

---

## 1. Design DNA — Bản 5 (Amanoi Ultra-Luxury × Natural Nam Du)

> **"Sự hòa quyện giữa Thần thái Tĩnh lặng Amanoi và Bảng màu Thiên nhiên đặc trưng Đảo Nam Du: Nắng đảo Củ Tron ngập ngã `#FAF8F5`, sắc xanh ngọc đại dương Bãi Cây Mến `#1173B8`/`#1E3A4C` (chuẩn màu Logo OP5), màu đá bãi biển `#F3ECE1` và điểm nhấn Vàng hoàng hôn hòn Hàng Bè `#F6B21B`."**

### 4 Trụ cột Thẩm mỹ Nam Du Bản 5:

1. **Sắc màu Thiên nhiên Đảo Nam Du:** Lấy trực tiếp từ cảnh sắc biển Bãi Cây Mến, đá đồi Củ Tron, và logo thương hiệu resort `OP5.png`.
2. **Quiet Luxury Whitespace (P5):** Khoảng thở siêu rộng giữa các section (`--space-8: 140px`). Mỗi phần như một trang sách ảnh nghệ thuật.
3. **Full-Bleed Photography (P6):** Khung ảnh 16:9 & 21:9 khổ lớn full-width, hiển thị nét đẹp tự nhiên của biển và đồi Củ Tron Nam Du mà không bị đè bởi quá nhiều văn bản.
4. **Protected Typography (P15):** Toàn bộ văn bản đặt trên thẻ nền đá alabaster hoặc khung đọc riêng biệt, đảm bảo độ tương phản **WCAG AAA ≥ 7.0:1** tuyệt đối.

---

## 2. Design Tokens — Bản 5 `[data-theme='h4']`

```css
[data-theme='h4'] {
    /* ---- Màu sắc Thiên nhiên Đảo Nam Du & Amanoi ---- */
    --color-brand:            #1173B8;  /* Xanh biển tươi ngọc Nam Du — Logo OP5.png */
    --color-brand-dark:       #1E3A4C;  /* Xanh đại dương trầm Củ Tron */
    --color-accent:           #F6B21B;  /* Vàng hoàng hôn nắng đảo — CHỈ cho CTA chính */
    --color-accent-gold:      #C8A261;  /* Vàng Sâm-panh mờ phụ trợ */

    --color-text-primary:     #1A242B;  /* Đen xanh bọt biển (Tương phản 14.1:1 AAA) */
    --color-text-secondary:   #4E606C;  /* Xám bọt biển trầm */
    --color-text-inverse:     #FAF8F5;

    --color-surface-base:     #FAF8F5;  /* Trắng nắng ngà Củ Tron — Nền chính 85% */
    --color-surface-raised:   #FFFFFF;  /* Thẻ nội dung nổi */
    --color-surface-dark:     #142733;  /* Section điểm nhấn tối (Footer/Experience) */
    --color-surface-sand:     #F3ECE1;  /* Nền cát & đá nắng Nam Du */

    --color-border-default:   #E2D9CC;
    --color-border-muted:     #EFE8DE;

    /* ---- Typography Luxury ---- */
    --font-display:           'Lora', Georgia, serif;
    --font-family-primary:    'Be Vietnam Pro', system-ui, sans-serif;
    --font-size-xs: 12px;  --font-size-sm: 14px;  --font-size-base: 16px;
    --font-size-lg: 19px;  --font-size-xl: 24px;  --font-size-2xl: 32px;
    --font-size-3xl: 44px; --font-size-4xl: 64px;
    --line-height-base: 1.7;

    /* ---- Khoảng thở Amanoi ---- */
    --space-1: 4px;   --space-2: 8px;   --space-3: 16px;  --space-4: 24px;
    --space-5: 48px;  --space-6: 80px;  --space-7: 120px; --space-8: 160px;
    --radius-md: 4px;  --radius-lg: 8px;   --radius-xl: 12px;
}
```

---

## 3. Cấu trúc Trang Bản 5 (Amanoi Experience Flow)

### 3.1 HOME (`/h4` hoặc `/v5_amanoi`)

#### Section 1: Hero Magazine Experience & Luxury Concierge Bar
- **Hero Image Slider (Danh sách Ứng viên Đề xuất — Linh hoạt theo AI Audit):**
  - **Option 1:** `public/property/hero-1.jpg` (hoặc `public/uploads/hero-1.jpg`) — Ảnh đồi Củ Tron view đại dương góc rộng.
  - **Option 2:** `public/property/hero-hai-dang.jpg` (hoặc `public/uploads/hai-dang-Ke-Ga-2.jpg`) — Hải đăng Nam Du ngắm biển.
  - **Option 3:** `public/property/hero-drone.jpg` — Toàn cảnh đảo ngập nắng.
  - **Quy tắc Chọn Ảnh:** Agent `image-curator` tự do thẩm định góc chụp, độ sắc nét và tương phản P15 để chọn 1 ảnh tĩnh xuất sắc nhất hoặc làm Slider 2-3 tấm linh hoạt.
- **Overlay & Typography:** 
  - Subtitle: *"THE NAM DU HILL RESORT · CỦ TRON ISLAND"* (Tracking 0.25em, màu vàng `#F6B21B`).
  - Title: *"Nơi đại dương chạm mây trời Nam Du"* (Font *Lora* 64px, chữ trắng nổi trên màng scrim tối 35%).
- **Luxury Concierge Booking Bar (Đáy Hero):** Thanh mỏng đính ở đáy màn hình Hero, chứa:
  - *Ngày nhận / trả* · *Hạng phòng* · *Số khách* · Nút **[Kiểm tra phòng trống]** (Màu Vàng Accent `#F6B21B`).

#### Section 2: Section "Vị thế Tĩnh lặng" & Intro Video Modal
- **Background:** Nền Alabaster `#FAF8F5`, khoảng thở 140px top/bottom.
- **Video Giới thiệu Resort:** Bật Modal Video khi bấm Play trên ảnh nền resort, tích hợp trực tiếp file video địa phương:
  - **Path Video:** `public/video/8102936365457.mp4`
  - **Click-to-Play Modal:** Tích hợp trình phát video mượt mà không làm chậm tốc độ tải trang ban đầu.

#### Section 3: Sanctuary Rooms (Không gian Nghỉ dưỡng)
- Grid 2 cột lớn so le:
  - Cột 1: Ảnh dọc 4:5 nghệ thuật + Tên phòng + Giá điểm nhấn + Link *"Khám phá không gian"*.
  - Cột 2: Ảnh ngang 16:9 + Trải nghiệm ngắm bình minh từ giường ngủ.

#### Section 4: Culinary & Wellness (Ẩm thực & Thư giãn)
- Full-bleed 21:9 image Bãi Cây Mến + Khối nội dung giới thiệu hải sản tươi sống đánh bắt trong ngày và tiệc BBQ hoàng hôn trên đỉnh đồi.

#### Section 5: Concierge Service & Direct Trust
- Dòng khẳng định tín nhiệm: *"Resort chính chủ đồi Củ Tron · Hỗ trợ đặt vé tàu cao tốc & đưa đón bến tàu · Miễn phí dời ngày khi thời tiết xấu."*

---

## 4. Kiểm định Chất lượng & Tự động Audit (P0–P15)

- [ ] Kích hoạt Agent `image-curator` chọn bộ ảnh ngập nắng chuẩn sắc độ Amanoi.
- [ ] Kích hoạt Agent `visual-auditor` tự động bật trình duyệt chụp ảnh 1440px Desktop & 375px Mobile.
- [ ] Chấm điểm đối chiếu với **16 Cổng P0–P15** (Yêu cầu điểm số ≥ 9.6/10).
