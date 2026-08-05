# Spec — The Nam Du Hill Resort · Bản 3 "Tropical Bright"

> Bản kiến trúc + thiết kế chi tiết cho phiên bản thứ 3 của The Nam Du Hill Resort.
> Kế thừa: [v2 — PA3 Navy](./2026-08-04-architecture-namduhillresort-v2.md)
> (khách chê "màu u buồn, thiếu điểm nhấn nhiệt đới") và bản nháp
> [theme-namdu-design](./2026-08-04-theme-namdu-design.md) (Coastal editorial
> teal — teal trầm có nguy cơ lặp lại lỗi u buồn, không dùng palette đó nữa).
> Phạm vi: **Home + Rooms + RoomDetail**, theme package `@repo/theme-namdu` slug `h5`.
>
> Ngày chốt: 2026-08-04 · Brief: [thenamduhillresort.md](../../../resources/docs/briefs/thenamduhillresort.md)
> Đầu vào: teardown thenamduhill.com · customer-mindset Nam Du · conversion-blueprint
> Luật áp dụng: [architecture.md](../../../.claude/rules/architecture.md) ·
> [design-tokens.md](../../../.claude/rules/design-tokens.md) ·
> [app-flows.md](../../../.claude/rules/app-flows.md) ·
> [the-10k-checklist.md](../../../.claude/rules/the-10k-checklist.md)

---

## 0. Bối cảnh và quyết định nền

### 0.1 Vì sao có bản 3

Repo đã có hai bản cho cùng khách hàng, cả hai chưa chốt được — **nguyên nhân
chung: màu sắc u buồn**:

| Bản | Vị trí | Kiến trúc / Style | Vấn đề |
|---|---|---|---|
| 1 | `apps/2026-thenamduhill` (theme h1–h4) | Theme package + core, đúng luật | Gu thẩm mỹ chưa đạt, giống khách sạn phổ thông |
| 2 | `apps/2026-thenamduhillresort` | Standalone, Figma PA3 Navy `#0B192C` | **Khách chê: màu u buồn, tăm tối, thiếu điểm nhấn nhiệt đới**; data riêng vi phạm R8 |

Bản này lấy **kiến trúc của bản 1** (theme package + core) và làm lại toàn bộ
hình thức theo hướng **sáng, rực nắng đảo**. Hai bản cũ giữ nguyên làm tham
chiếu.

### 0.2 Quyết định đã chốt với người dùng (2026-08-04)

| # | Quyết định | Ghi chú |
|---|---|---|
| D-1 | Theme package thứ 5 `@repo/theme-namdu`, slug `h5` | Dùng lại core + login OTP + giỏ hàng + CMS có sẵn |
| D-2 | Design direction: **Tropical Bright** — sáng ≥85% diện tích trang | Chữa trực tiếp lỗi "u buồn"; xem §2 |
| D-3 | Kèm **Option B "Sunset Coral"** để khách so — cũng SÁNG, chỉ khác `tokens.css` | Layout không đổi một dòng giữa 2 option |
| D-4 | Phạm vi vòng này: **Home + Rooms + RoomDetail** | 3 trang người dùng kỳ vọng nhất |
| D-5 | Rooms: **hàng ngang so sánh** (ảnh trái · thông tin · giá + CTA phải) | Mobile đổi thẻ dọc |
| D-6 | RoomDetail: **booking-first** — gallery trên, panel đặt phòng sticky phải | Mobile: sticky bottom bar + bottom-sheet |
| D-7 | Thanh toán: 3 phương thức (thẻ OnePay / chuyển khoản / tại quầy) **chỉ là option giao diện**, chưa nối cổng | Parity đúng site cũ; bổ sung cổng thật sau |
| D-8 | Zalo footer/floating: **placeholder fake data** | Chờ khách cấp Zalo OA thật |
| D-9 | Motion: **tĩnh vòng này** (chỉ hover/focus), animation đồng bộ vòng cuối | Brief K0-Q4 |
| D-10 | Ảnh: dùng ảnh crawl nguyên trạng, **DEV-ONLY theo R9**, kèm danh sách ảnh cần chụp §8.3 | |
| D-11 | Mobile là spec ngang hàng desktop | K7 |

### 0.3 Phát hiện quyết định từ teardown + customer-mindset

Ba phát hiện định hình spec này:

1. **Site cũ không có trang chi tiết phòng** — chỉ popup AJAX → SEO phòng = 0,
   không share link được. Trang `/h5/rooms/[id]` là khoảng trống lớn nhất bản
   remake lấp.
2. **Thanh toán site cũ** (trả lời câu hỏi trong brief): checkout OpenCart có
   3 radio — OnePay thẻ tín dụng (mặc định) · chuyển khoản · tại quầy; hướng
   dẫn nêu thêm MoMo/QR; **cọc 50%**, mất cọc khi huỷ trừ lý do thời tiết.
3. **Trust là sản phẩm số 1, không phải phòng.** Nỗi đau lớn nhất của khách
   (brief): "không biết có phải website chính chủ không". Objection đặc thù
   Nam Du chưa site nào trả lời: *"tàu hoãn thì mất cọc à?"* — phải trả lời
   bằng chữ in ngay cạnh nút đặt.

### 0.4 Điều KHÔNG làm ở vòng này

- Không dựng Checkout/Gallery/Contact/Blog riêng — slot trống tự rơi về mặc
  định của registry.
- Không sửa `packages/core`, `packages/ui` ngoài mục §6.4 (ánh xạ ảnh + nội
  dung "Đường ra đảo" nếu cần thêm data — phải đủ `{vi,en}`).
- Không đụng theme h1–h4.
- Không animation (D-9). Không nối cổng thanh toán (D-7).
- Không đưa ảnh crawl lên production (R9).

---

## 1. Point of view (K1)

> **"Buổi sáng rực nắng trên đảo — nền trắng ngà ngập sáng, xanh biển tươi của
> logo làm xương sống, một chấm vàng nắng duy nhất mỗi màn hình nói 'đặt ở đây'."**

| Trụ | Quyết định | Vì sao tăng chuyển đổi |
|---|---|---|
| **Sáng** | ≥85% diện tích là nền `#FDFCF8`; dải màu đậm chỉ ở `booking` band và footer | Sáng = "mở, minh bạch, không giấu gì" — đánh vào nỗi sợ lừa đảo; ảnh biển nổi trên nền ngà thay vì chìm vào nền tối |
| **Brand từ logo** | Xanh `#38A8F0` của `OP5.png` tinh chỉnh đậm hơn để đạt WCAG | Giao diện trùng màu logo = tín hiệu "cùng một chủ thể" — trust rẻ nhất mua được bằng CSS |
| **Một chấm vàng** | `--color-accent` CHỈ dành cho CTA chính | Mắt luôn biết bấm đâu (K4); vàng + xanh biển = mã màu "biển & nắng" site cũ đã gieo |

Kế thừa từ v1: nhịp section so le, serif nhẹ cho display, khoảng thở lớn.
**Chỉ đổi nhiệt độ màu từ "chiều muộn" sang "sáng rực nắng".**

**Phép thử K1:** 3 section bất kỳ cùng giọng "sáng + serif nhẹ + một chấm vàng";
phân biệt được với h1–h4 trong 3 giây trên hub.

---

## 2. Design tokens — hai option, layout chung

Cả hai option khai **đủ bộ biến D1**. Hex CHỈ sống trong `tokens.css` (D0).
Số tương phản là **ước tính — phải đo lại bằng công cụ, ghi số vào PR** (D4).

### 2.1 OPTION A — "Tropical Bright" (khuyến nghị, đã chốt hướng)

```css
[data-theme='namdu'] {
    /* ---- màu ngữ nghĩa ---- */
    --color-brand:            #1173B8;  /* xanh biển tươi — tinh chỉnh đậm từ logo #38A8F0 */
    --color-accent:           #F6B21B;  /* vàng nắng — CHỈ cho CTA chính */

    --color-text-primary:     #21323C;  /* xanh đen ấm */
    --color-text-secondary:   #4C6270;
    --color-text-tertiary:    #7C8B93;  /* chỉ dùng chữ ≥18.66px bold / ≥24px */
    --color-text-inverse:     #FDFCF8;

    --color-surface-base:     #FDFCF8;  /* trắng ngà sáng — 85% diện tích trang */
    --color-surface-raised:   #FFFFFF;  /* card, panel đặt phòng */
    --color-surface-strong:   #1173B8;  /* dải booking, footer */
    --color-surface-sand:     #F7F0E4;  /* NGOÀI bộ D1 — lý do K3: nền cát ấm cho khối
                                           "Đường ra đảo" + section xen kẽ, tránh trang
                                           trắng tuyền một mạch */

    --color-border-default:   #DCD6CA;
    --color-border-muted:     #ECE7DC;

    /* ---- trạng thái ---- */
    --color-success: #1E7A4E;  --color-success-bg: #E7F3EC;
    --color-warning: #9A6A08;  --color-warning-bg: #FBF1DB;
    --color-danger:  #B3341F;  --color-danger-bg:  #FBEAE6;
    --color-info:    #1173B8;  --color-info-bg:    #E6F1F9;

    /* ---- chữ ---- */
    --font-display:           'Lora', Georgia, serif;
    --font-family-primary:    'Be Vietnam Pro', system-ui, sans-serif;
    --font-size-xs: 12px;  --font-size-sm: 14px;  --font-size-base: 16px;
    --font-size-lg: 18px;  --font-size-xl: 22px;  --font-size-2xl: 28px;
    --font-size-3xl: 40px; --font-size-4xl: 56px;
    --font-weight-base: 400; --font-weight-medium: 500; --font-weight-bold: 700;
    --line-height-base: 1.65;

    /* ---- khoảng cách: thang 4px, rộng để có khoảng thở ---- */
    --space-1: 4px;  --space-2: 8px;  --space-3: 16px; --space-4: 24px;
    --space-5: 40px; --space-6: 64px; --space-7: 96px; --space-8: 140px;
    --radius-xs: 2px; --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px; --radius-xl: 16px;
    --shadow-1: 0 1px 2px rgba(33, 50, 60, .06);
    --shadow-2: 0 8px 24px rgba(33, 50, 60, .10);
    --motion-instant: 120ms; --motion-fast: 220ms; --motion-normal: 400ms;
}
```

**Tương phản ước tính (Option A):**

| Cặp | Ước tính | Ngưỡng | Dùng ở |
|---|---|---|---|
| `#21323C` / `#FDFCF8` | ~12.9:1 | ≥4.5 ✓ | chữ thân |
| `#4C6270` / `#FDFCF8` | ~6.3:1 | ≥4.5 ✓ | chữ phụ |
| `#7C8B93` / `#FDFCF8` | ~3.6:1 | ✗ chữ thường | CHỈ metadata cỡ lớn |
| `#1173B8` / `#FDFCF8` | ~4.9:1 | ≥4.5 ✓ (sát — đo kỹ) | heading/link xanh |
| `#21323C` / `#F6B21B` | ~7.1:1 | ≥4.5 ✓ | chữ trên nút CTA vàng |
| `#FDFCF8` / `#1173B8` | ~4.9:1 | ≥3 ✓ chữ lớn | dải booking — chữ thường phải đo, nếu <4.5 tăng ≥18.66px bold |
| `#21323C` / `#F7F0E4` | ~11.5:1 | ✓ | chữ trên nền cát |

**Font:** Display **Lora** + Body **Be Vietnam Pro** — cả hai Google Fonts,
subset `['latin','vietnamese']`, nạp `next/font/google` với `display: swap`
trong `apps/2026-thenamduhill/src/app/layout.tsx` (ngoại lệ duy nhất được sửa
app, cùng dòng import `tokens.css` — CLAUDE.md §4). **Bắt buộc kiểm** `ệ ự ỡ ẳ Đ`
ở weight 400/500/700 (K2).

**Ba luật riêng của theme:**

1. Vàng `--color-accent` CHỈ cho CTA chính — không badge, không icon, không hover.
2. Dải đậm (`surface-strong`) tối đa 2 lần/trang: booking band + footer.
3. Không hex nào ngoài `tokens.css`.

### 2.2 OPTION B — "Sunset Coral" (trình khách so sánh — cũng SÁNG)

Cảm giác: hoàng hôn ấm trên cầu cảng — san hô + cát hồng + vàng hổ phách.
Vẫn ≥85% nền sáng. **Chỉ đổi giá trị biến; layout không đổi một dòng.**

```css
[data-theme='namdu'] { /* OPTION B */
    --color-brand:            #C24434;  /* san hô đậm */
    --color-accent:           #F2A93B;  /* vàng hổ phách — CTA chính */
    --color-text-primary:     #33302B;  /* nâu đen ấm */
    --color-text-secondary:   #63594F;
    --color-text-tertiary:    #948A7E;  /* chỉ chữ lớn */
    --color-text-inverse:     #FFFBF6;
    --color-surface-base:     #FFFBF6;  /* ngà ấm hơn Option A */
    --color-surface-raised:   #FFFFFF;
    --color-surface-strong:   #C24434;
    --color-surface-sand:     #FAEDE0;
    --color-border-default:   #E2D8CB;
    --color-border-muted:     #F0E8DC;
    --color-success: #2E7D46;  --color-success-bg: #E9F3EB;
    --color-warning: #9A6A08;  --color-warning-bg: #FBF1DB;
    --color-danger:  #A82E1F;  --color-danger-bg:  #FAE9E5;
    --color-info:    #1173B8;  --color-info-bg:    #E6F1F9;
    --font-display:           'Playfair Display', Georgia, serif;
    --font-family-primary:    'Nunito Sans', system-ui, sans-serif;
    /* thang cỡ chữ, space, radius, shadow, motion: GIỐNG HỆT Option A */
}
```

Tương phản ước tính: `#33302B`/`#FFFBF6` ~12.5:1 ✓ · `#63594F`/`#FFFBF6` ~6.2:1 ✓ ·
`#C24434`/`#FFFBF6` ~4.9:1 (sát, đo kỹ) · `#33302B`/`#F2A93B` ~6.8:1 ✓.

**Khuyến nghị trình khách:** Option A khớp logo hiện có → trust nhận diện cao
hơn; Option B nổi bật hơn giữa các resort biển nhưng lệch màu logo — chọn B thì
nên cân nhắc bản logo màu ấm. Cả hai KHÔNG lặp lại teal trầm.

**Cách triển khai 2 option:** Option A là `tokens.css` chính; Option B để ở
`tokens.sunset.css` cùng package, đổi 1 dòng import khi demo cho khách so.

---

## 3. Cấu trúc trang & phễu chuyển đổi

Phễu: **Home "Chọn ngày & xem phòng" → Rooms "Chọn phòng" → RoomDetail "Đặt
phòng" → checkout có sẵn của app.** Mỗi trang đúng MỘT CTA chính; Zalo là van
xả phụ (floating toàn site, fake data theo D-8).

### 3.1 HOME — Step 1 (Khám phá)

Contract R7: dùng `top · about · rooms · dining · places · gallery · booking ·
contact` (bỏ `tours` khỏi Home — dữ liệu tour hiển thị gọn trong `places`; bỏ
bớt hợp lệ, không đổi tên id). Khung 1200px. Nhịp so le: **hai section liền
nhau không bao giờ cùng bố cục.**

```
top       ████████████████████  hero 85vh + widget tìm phòng + ĐỊNH DANH CHÍNH CHỦ
about     ▒▒▒ cát ▒▒▒           "Đường ra đảo" (nền cát) + giới thiệu + facts
rooms     ▓▓▓  ▓▓▓  ▓▓▓         3 card + link "Xem tất cả 7 hạng phòng"
dining    ▓▓▓▓▓▓  ░░░░░         chữ trái ảnh phải
places    ████████████████████  full-bleed Bãi Cây Mến + MỘT câu — nhịp nghỉ
gallery   ▓▓ ▓▓▓▓ ▓▓  ▓▓▓▓ ▓▓   lưới bất đối xứng, ảnh thật
booking   ████████████████████  dải xanh biển + CTA vàng + FAQ 4 câu
contact   ▓▓▓▓▓▓▓▓  ░░░░        địa chỉ, hotline, Zalo/social
```

| Section | Mục tiêu | Nội dung + desktop | Mobile (K7 — quyết định riêng) | Trust đặt ở đâu |
|---|---|---|---|---|
| `top` | Trả lời "chính chủ + còn phòng?" trong viewport đầu | Ảnh drone 85vh, overlay gradient đáy. Kicker "QUẦN ĐẢO NAM DU · KIÊN HẢI". H1 "Nghỉ trên đồi, thức dậy giữa biển Nam Du" (`--font-display`, `--font-size-4xl`). Widget nổi đè mép dưới: Nhận · Trả · Khách · [Chọn ngày & xem phòng] (nút vàng) | 92vh; H1 → `--font-size-2xl`; widget thu thành 1 nút mở bottom-sheet 3 field; **H1 + nút TRONG viewport đầu ở 375px** | **Dòng định danh dưới H1:** "Resort chính chủ trên đồi Củ Tron · Hotline/Zalo 0985 000 650" — SĐT `tel:` bấm gọi được |
| `about` | Gỡ "ra đó bằng gì" + thiện cảm Nam Du | **Khối "Đường ra đảo"** nền `--color-surface-sand`, 3 cột icon SVG: giờ tàu Rạch Giá–Nam Du ~2h · xe resort đón tại cầu cảng · "đường lên đồi 1,8km — xe resort đưa lên tận nơi" (nói thật điều bất lợi = trust). Dưới: ảnh dọc 3:4 trái + chữ phải + dải facts (21 đảo · 309m · 9,12km² · T12–T3) | "Đường ra đảo" 3 hàng dọc; facts lưới 2×2, không cuộn ngang; ảnh lên trước chữ | Nội dung kéo từ blog crawl lên (viết lại — R9); chi tiết thật thuyết phục hơn slogan |
| `rooms` | Đẩy sang step 2 | 3 card đầu từ `data.rooms` + link "Xem tất cả 7 hạng phòng →". Card: ảnh 4:5 · tên thật (#05 Lục Giác) · "Phù hợp: nhóm 4 bạn / gia đình 2+1" · m² · "từ 1.546.000đ/đêm" (format từ core, R8) | Cuộn ngang snap, card 82vw lộ mép card sau | Tên phòng có số thật — cụ thể = đáng tin |
| `dining` | "Ăn tại chỗ được" | 4 mục: tên + mô tả + giờ mở cụ thể. 2 cột 7:5 chữ trái ảnh phải | Bỏ ảnh, danh sách chữ + đường kẻ | Giờ mở cửa cụ thể |
| `places` | Nhịp nghỉ + "đảo đáng đi" | Full-bleed 60vh Bãi Cây Mến + MỘT câu đè; dưới: hàng địa danh + 2 tour (code · tên · giá) dạng dòng kẻ | 50vh; câu chuyển XUỐNG DƯỚI ảnh | — |
| `gallery` | Bằng chứng ảnh thật | 7 ảnh lưới bất đối xứng (1 ảnh 2×2), gap 8px — KHÔNG dùng `sua-tam-*` | Lưới 2 cột đều, 6 ảnh | Ảnh thật không poster/logo |
| `booking` | Chốt lần cuối | Dải `surface-strong`: "Đặt trực tiếp — đưa đón bến tàu miễn phí, giá không qua trung gian" + nút vàng (lặp cùng hành động CTA chính) + FAQ accordion 4 câu: tàu hoãn? / trẻ em? / wifi? / cọc bao nhiêu? | Nút full-width; FAQ giữ accordion | Lý do đặt trực tiếp = ưu đãi THẬT; **KHÔNG treo "Giảm 20%"** nếu không có promotion seed (M4) |
| `contact` | Đường liên hệ người thật | 2 cột: địa chỉ Ấp Củ Tron · hotline `tel:` · email; phải: Zalo/Facebook/TikTok/YouTube icon SVG, `aria-label` song ngữ | 1 cột; Zalo + hotline LÊN ĐẦU | Footer: MST + địa chỉ (**⚠️ xác minh MST 1702244746 với chủ trước production** — số lấy từ crawl); link chính sách trỏ trang placeholder có nội dung tóm tắt, **cấm `href="#"`** |

**Empty-state widget (F2):** "Hết phòng cho 20/8–22/8. Thử ngày khác hoặc giảm
số khách." + nút phụ "Hỏi ngày còn trống qua Zalo".

**Sticky bottom bar mobile:** hiện sau khi cuộn qua hero — "Từ 1.546.000đ/đêm ·
[Tìm phòng]", cao ≥44px + `env(safe-area-inset-bottom)`, z-index < bottom-sheet.

**Ngày mặc định của widget là ĐỘNG (hôm nay +7)** — teardown phát hiện bản
hiện tại hard-code `'15 Th8'`, sẽ thành tín hiệu "site bỏ hoang".

### 3.2 ROOMS — Step 2a (So sánh) — route `/h5/rooms`

**CTA chính mỗi hàng: "Chọn phòng"** (→ RoomDetail kèm query ngày/khách).
Rào cản gỡ: "7 cái khác chỗ nào, cái nào vừa nhóm mình?".

Desktop — **mỗi hạng 1 hàng ngang so sánh** (D-5):

```
┌ Sticky date bar: [20/08 → 22/08 · 2 khách  Sửa]  "Giá dưới đây tính cho 2 đêm" ┐
├──────────────────────────────────────────────────────────────────────────────┤
│ ┌────────────┐  #05 Lục Giác — Nhìn vườn              3.092.000đ / 2 đêm     │
│ │ ảnh 3:2    │  Phù hợp: cặp đôi · 22m² · 1 giường đôi  đã gồm thuế phí      │
│ │ 360px      │  ✓ Ban công  ✓ Điều hoà  ✓ Nước nóng     Còn 2 phòng          │
│ └────────────┘  Huỷ trước 7 ngày: hoàn 100%            [ Chọn phòng ]        │
└──────────────────────────────────────────────────────────────────────────────┘
```

- Banner mỏng đầu trang (~30vh) + sticky date bar: sửa ngày tại chỗ → giá toàn
  trang tính lại (F2-b1). Giá tính **theo từng đêm** qua core (B3, R8).
- Giữa hàng: tên thật + "phù hợp với ai" + 3 amenity chính (từ `roomExtras`) +
  **tóm tắt huỷ 1 dòng ngay trên hàng** (B5).
- Phải: giá canh phải (`--font-display`, `tabular-nums`, **đậm nhất hàng**) +
  "đã gồm thuế phí" + "Còn X phòng" + nút CTA.
- Thứ tự 7 hạng theo giá tăng dần; khuyến mãi thật (nếu seed) badge chấm màu + chữ.
- **Mobile:** hàng → **thẻ dọc** (ảnh 16:9 trên · thông tin · giá + CTA
  full-width ≥44px đáy thẻ); date bar dính top thu 1 dòng. Không cuộn ngang (F6).
- **Empty-state (F2):** "Hết phòng cho 20/8–22/8. Còn phòng gần nhất: 23/8–25/8
  [Xem] · hoặc hỏi qua Zalo." — không bao giờ "Không có kết quả".

### 3.3 ROOM DETAIL — Step 2b→3 (Quyết định) — route `/h5/rooms/[id]`, trang mới hoàn toàn

Site cũ chỉ có popup AJAX — trang này lấp khoảng trống SEO lớn nhất.
**CTA chính: "Đặt phòng"** trong panel sticky. CTA phụ: "Hỏi phòng này qua
Zalo" — ghost, nhỏ vai rõ rệt, tin nhắn tự đính kèm tên phòng + ngày.

Desktop (booking-first, D-6):

```
┌ Gallery: 1 ảnh lớn + 4 thumb (mở lightbox) ──────────────────────────────────┐
├──────────────────────────────────┬───────────────────────────────────────────┤
│ CỘT TRÁI (7fr)                   │ CỘT PHẢI (5fr) — PANEL STICKY (top 96px)  │
│ H1 tên phòng + breadcrumb        │ Ngày nhận · Ngày trả · Khách              │
│ "Phù hợp: gia đình 2+1"          │   (số trẻ + TUỔI từng trẻ — B2)           │
│ Thông số: m² · giường · view     │ ── Breakdown (từ core, R8): ──            │
│ Tiện nghi thật (wifi khu sảnh —  │ Tiền phòng 2 đêm        3.092.000đ        │
│   nói thật, D6)                  │ Giường phụ                410.000đ        │
│ Chính sách trẻ em theo tuổi (B2) │ Khuyến mãi               −xxx.xxxđ        │
│ Mô tả + vị trí trong resort      │ ─────────────────────────────             │
│ "Các hạng phòng khác" (3 hàng    │ Thành tiền              x.xxx.xxxđ        │
│  rút gọn — giữ khách trong phễu) │ Cọc trả khi đặt (50%)   x.xxx.xxxđ        │
│                                  │ Còn lại trả tại quầy    x.xxx.xxxđ        │
│                                  │ ── Chính sách huỷ bậc thang (B5): ──      │
│                                  │ Trước 7 ngày: hoàn 100% cọc               │
│                                  │ Trước 3 ngày: hoàn 50%                    │
│                                  │ Sát ngày: không hoàn                      │
│                                  │ ⛴ Tàu hoãn do thời tiết: DỜI NGÀY MIỄN PHÍ│
│                                  │ [        Đặt phòng        ] (vàng, 48px)  │
│                                  │ [ Hỏi phòng này qua Zalo ] (ghost)        │
│                                  │ Thanh toán: Thẻ (OnePay) · CK · Tại quầy  │
│                                  │   (icon option — chưa nối cổng, M4)       │
└──────────────────────────────────┴───────────────────────────────────────────┘
```

- Dòng **"Tàu hoãn do thời tiết: dời ngày miễn phí"** bắt buộc nằm TRONG panel,
  cạnh nút — không chôn ở trang chính sách. Đây là câu trả lời objection số 1
  của khách Nam Du.
- Breakdown gọi hàm tính của `core` (R8); con số huỷ-hoàn tự tính từ
  `CancellationRule` (B5). 4 con số tiền theo B1.
- **Mobile:** gallery swipe full-width → nội dung 1 cột → panel thành **sticky
  bottom bar** "x.xxx.xxxđ · 2 đêm [Đặt phòng]" → bấm mở bottom-sheet chứa toàn
  bộ panel; safe-area; CTA ≥44px.
- SEO: `generateMetadata()` riêng từng phòng, Schema `HotelRoom` + `Offer`,
  hreflang vi/en (F8).

### 3.4 Bàn giao checkout

"Đặt phòng" → `cart.store` (persist, sống qua login — F1) → luồng checkout có
sẵn của app (`/h5/booking`, OTP demo 1234). Bước thanh toán: 3 radio option
**Thẻ tín dụng OnePay (mặc định) · Chuyển khoản · Tại quầy** + ghi chú "Hỗ trợ
MoMo/QR khi thanh toán tại quầy" — chỉ UI, bấm Xác nhận → màn thành công (M4).
Trang thành công: mã đơn + QR + **"Lễ tân sẽ nhắn Zalo xác nhận trong 30 phút"**
(gỡ nỗi sợ "chuyển khoản xong bặt vô âm tín").

---

## 4. Thông điệp song ngữ chuẩn (D6 · R6)

| Vị trí | VI | EN |
|---|---|---|
| Hero H1 | Nghỉ trên đồi, thức dậy giữa biển Nam Du | Sleep on the hill, wake up to the Nam Du sea |
| Hero định danh | Resort chính chủ trên đồi Củ Tron · Hotline/Zalo 0985 000 650 | Officially run by the resort on Cu Tron hill · Hotline 0985 000 650 |
| CTA chính Home | Chọn ngày & xem phòng | Pick dates & see rooms |
| Đường ra đảo | Tàu cao tốc Rạch Giá – Nam Du ~2 giờ · Xe resort đón tại cầu cảng | Rach Gia – Nam Du ferry ~2h · Free pier pick-up by our shuttle |
| Card phòng | Phù hợp: nhóm 4 bạn / gia đình 2+1 | Great for: group of 4 / family 2+1 |
| Rooms empty | Hết phòng cho {từ}–{đến}. Thử ngày khác hoặc giảm số khách. | No rooms for {from}–{to}. Try other dates or fewer guests. |
| Panel giá | Cọc trả khi đặt (50%) · Còn lại trả tại quầy | Deposit due now (50%) · Balance paid at check-in |
| Chính sách huỷ | Huỷ trước 7 ngày: hoàn 100% cọc. Tàu hoãn do thời tiết: dời ngày miễn phí. | Free cancellation up to 7 days. Ferry cancelled by weather: reschedule free. |
| CTA RoomDetail | Đặt phòng | Book this room |
| CTA phụ Zalo | Hỏi phòng này qua Zalo | Chat about this room (Zalo/WhatsApp) |
| Thành công | Đơn {mã} đã ghi nhận. Lễ tân sẽ nhắn Zalo xác nhận trong 30 phút. | Booking {code} received. Our team will confirm within 30 minutes. |

Chuỗi giao diện nằm ở `strings.ts` của theme; chuỗi nội dung nằm ở `core` —
đều `{vi, en}` (R6).

---

## 5. Inventory component (D3 — đủ 7 trạng thái, thiếu 1 = chưa xong)

Hover đổi nền/viền trong `--motion-instant`; focus outline 2px `--color-brand`
offset 2px, **không bao giờ `outline: none`**; loading giữ nguyên kích thước;
error viền danger + chữ (`aria-live="polite"`).

| Component | Variant | Kích thước | Ghi chú |
|---|---|---|---|
| `ButtonPrimary` | vàng accent, chữ text-primary | cao 48px desktop / ≥44px mobile, radius md | CTA phẳng, cấm gradient (D5) |
| `ButtonGhost` (Zalo) | viền border-default, icon SVG | cao 44px | rõ ràng NHỎ vai hơn primary |
| `SearchWidget` | desktop 4 vùng ngang / mobile bottom-sheet | field cao 48px | label gắn đúng từng field (D4) |
| `StickyDateBar` (Rooms) | 1 dòng + nút "Sửa" | cao 56px | |
| `RoomRow` | desktop hàng ngang / mobile thẻ dọc | ảnh 360×240 (3:2) | giá là phần tử đậm nhất hàng |
| `BookingPanel` (RoomDetail) | sticky top 96px, nền raised, shadow-2 | 5fr, padding space-5 | breakdown `tabular-nums` canh phải |
| `StickyBottomBar` | Home + RoomDetail mobile | cao 64px + safe-area | z-index < bottom-sheet |
| `PolicyLadder` | 3 bậc + dòng thời tiết, icon SVG | — | chữ + con số, không chỉ màu |
| `PaymentOptions` | 3 radio + logo | target ≥24px | mặc định OnePay như site cũ |
| `ZaloFab` | floating 56×56 mọi trang, góc phải-dưới | trên bottom bar | fake data (D-8); `aria-label` song ngữ |
| `GalleryLightbox` | grid + lightbox | — | `alt` song ngữ |
| `FaqAccordion` | 4 câu ở `booking` | target ≥44px | |

---

## 6. Kiến trúc mã nguồn

### 6.1 Cấu trúc package

```
packages/theme-namdu/
  package.json          name: "@repo/theme-namdu"
  tsconfig.json         extends @repo/tsconfig
  src/
    tokens.css          Option A (§2.1)
    tokens.sunset.css   Option B (§2.2) — demo so sánh, đổi 1 dòng import
    meta.ts             slug 'h5', tên, mô tả, swatch cho hub
    composition.tsx     thứ tự section Home
    index.ts            export ThemeDefinition (Home + Rooms + RoomDetail)
    strings.ts          chuỗi giao diện song ngữ (§4)
    sections/           Header · Hero · About · Rooms · Dining · Places
                        Gallery · Booking · Contact · SearchWidget · StickyBar
    pages/              RoomsPage.tsx · RoomDetailPage.tsx
                        (khuôn tham chiếu: packages/theme-h1/src/pages/)
    components/         ButtonPrimary · ButtonGhost · BookingPanel ·
                        PolicyLadder · PaymentOptions · ZaloFab · …
```

Registry đã hỗ trợ sẵn slot `Rooms` và `RoomDetail` (nhận `roomSlug`) — xem
`apps/2026-thenamduhill/src/themes/registry.ts`. Slot Checkout/Gallery/Contact…
bỏ trống, tự rơi về mặc định.

**Ranh giới (R4):** theme chỉ chứa hình thức — không gọi API, không tính giá,
không định nghĩa type. `Room`/`RoomExtra`/`PropertyData` của core đã đủ trường
(area, guests, price, tags, images?, amenities, bed, view, conditions).

### 6.2 Năm chỗ đăng ký theme (CLAUDE.md §4 — không hơn)

1. Tạo `packages/theme-namdu/`
2. `apps/2026-thenamduhill/package.json` — thêm `"@repo/theme-namdu": "workspace:*"`
3. `apps/2026-thenamduhill/src/themes/registry.ts` — 1 import + 1 phần tử mảng
4. `apps/2026-thenamduhill/src/app/layout.tsx` — import `tokens.css` + khai
   `next/font` Lora, Be Vietnam Pro
5. `apps/2026-thenamduhill/next.config.ts` — thêm `transpilePackages`

Rồi `pnpm install` → `/h5`, `/h5/rooms`, `/h5/rooms/[id]` tự hoạt động.
**Buộc sửa chỗ thứ 6 → kiến trúc rò rỉ (R5), dừng lại báo, không vá.**

### 6.3 Nguồn dữ liệu

Toàn bộ đọc từ `PropertyData` route truyền vào — không mock riêng, không fetch
(R8). `hero` / `about`+`facts` / `rooms`(7) / `roomExtras` / `places`(8) /
`dining`(4) / `tours`(2) / `nav` / `brand` đã có sẵn trong core.

### 6.4 Việc được phép đụng vào `core` (nội dung, không phải logic)

- Ánh xạ `roomId → ảnh` tại `core/assets.ts` (`ASSET_DIR.property` có sẵn) —
  ảnh là nội dung của khách, không phải hình thức của theme (R8).
- Nội dung khối "Đường ra đảo" + FAQ 4 câu nếu chưa có trường phù hợp — viết
  lại từ blog crawl (không copy nguyên văn, R9), đủ `{vi, en}` (R6).
- File ảnh copy vào `apps/2026-thenamduhill/public/property/`.

---

## 7. Parity site cũ — mục chờ duyệt

Teardown kiểm kê site cũ; các mục sau cần user/khách duyệt (đánh dấu để không
tự quyết):

| Mục | Đề xuất | Trạng thái |
|---|---|---|
| **20 hạng phòng site cũ → 7 hạng hiển thị** | Gộp biến thể (#08/#09/tầng…) thành hạng + chú thích "3 phòng thuộc hạng này"; bảng map 20 productId→7 hạng | **CHỜ DUYỆT** trước production |
| Trang `/room-list` trùng chức năng Rooms | Bỏ, gộp về 1 trang | CHỜ DUYỆT |
| Field "Email xác nhận" ở checkout | Bỏ (thêm 1 trường = thêm rơi rụng) | CHỜ DUYỆT |
| MST 1702244746 ở footer | Giữ nhưng **xác minh với chủ resort** (số lấy từ crawl) | CHỜ XÁC MINH |
| Wining&Dining / Experiences / Event / News / Gallery / Contact / 5 trang chính sách | Vòng sau — **trang chính sách thật là nợ trust khẩn nhất** sau 3 trang này | Vòng sau |

---

## 8. Ảnh — hiện trạng và gán vị trí

### 8.1 Hiện trạng (khảo sát 2026-08-04)

| Nguồn | Đánh giá |
|---|---|
| `resources/scripts/crawl/output/thenamduhill/assets/` (58 file) | 7 banner drone rất tốt cho hero; cover phòng đơn dùng được cho card; **`*-full` là collage 3-trong-1** (cấm dùng thẳng cho card); **19 ảnh `sua-tam-*` là poster marketing gắn logo** (cấm dùng cho gallery) |
| `apps/2026-thenamduhillresort/public/uploads/` | logo `OP5.png` + hero-1/2.jpg |

### 8.2 Gán vị trí (DEV-ONLY — R9)

| Vị trí | File | Ghi chú |
|---|---|---|
| Hero Home | `banner/banner2.jpg` | LCP, `priority`, AVIF/WebP |
| Banner Rooms | `banner/banner-rooms.jpg` | cao ~30vh |
| `about` ảnh dọc | chọn tay từ `banner/*` (góc resort/hồ bơi) | 3:4 |
| Card phòng | `room-suite/cover-*.jpg` — cover ĐƠN từng hạng | hạng thiếu cover đơn → crop 1 ô từ collage, ghi vào §8.3 |
| RoomDetail gallery | cover đơn + các ô crop từ collage đúng hạng | crop thật, không bóp collage |
| `places` full-bleed | `news/news-1.jpg` hoặc `news-4.jpg` (drone bãi biển) | rà watermark từng file trước dùng |
| `gallery` 7 ảnh | 3–4 `banner/*` + `news-8.jpg` + 2 cover đẹp nhất | KHÔNG `sua-tam-*` |
| Logo header | `uploads/OP5.png` | brand asset chính thức |

### 8.3 Danh sách ảnh đề nghị khách chụp/cấp bản gốc

| # | Ảnh | Vì sao | Tỷ lệ |
|---|---|---|---|
| 1 | Hero — toàn cảnh resort trên đồi lúc bình minh/hoàng hôn, thấy biển | LCP + ấn tượng đầu | 16:9 |
| 2–8 | Mỗi hạng phòng **một ảnh đơn** (7 hạng) | Thay collage — bắt buộc để card dùng được | 4:5 dọc |
| 9 | Bể bơi / khu sinh hoạt chung | `about` | 3:4 |
| 10 | Bãi Cây Mến từ trên cao | `places` full-bleed | 21:9 |
| 11–12 | BBQ hải sản đèn dây vàng · bữa sáng nhìn ra biển | `dining` | 4:3 |

Nguyên tắc: cùng tông ánh sáng (giờ vàng), không filter bão hoà cao, không watermark.

---

## 9. Backlog triển khai — xếp theo tác động chuyển đổi

| # | Việc | Vị trí | Tác động |
|---|---|---|---|
| 1 | `tokens.css` A + `tokens.sunset.css` B + đăng ký 5 chỗ §6.2 | theme-namdu, app | nền tảng |
| 2 | Home `top`: Hero + SearchWidget + định danh + StickyBottomBar mobile | theme-namdu | cửa vào phễu |
| 3 | Rooms page: RoomRow + StickyDateBar + empty-state F2 | slot Rooms | nơi so sánh |
| 4 | RoomDetail: BookingPanel + PolicyLadder + PaymentOptions + bottom-sheet | slot RoomDetail | **tác động lớn nhất** |
| 5 | Map 20 productId → 7 hạng trong seed core (song ngữ, CHỜ DUYỆT) | core | giá đúng |
| 6 | "Đường ra đảo" + FAQ 4 câu (viết lại từ blog — R9) | core + sections | trust |
| 7 | ZaloFab fake data + đính kèm tên phòng/ngày | theme | van xả |
| 8 | Home các section còn lại | theme-namdu | hoàn thiện |
| 9 | Schema.org + generateMetadata + hreflang 3 trang | app | SEO |

---

## 10. Định nghĩa "xong" cho vòng này

### 10.1 Kiến trúc
- [ ] `pnpm lint` + typecheck sạch; **cả 5 theme build được**
- [ ] Chỉ sửa đúng 5 chỗ §6.2 (+ core theo phạm vi §6.4)
- [ ] Theme không import theme khác (R1); không tính giá/gọi API/định nghĩa type (R4)

### 10.2 Token & thẩm mỹ
- [ ] `tokens.css` đủ bộ D1; không hex ngoài tokens
- [ ] Vàng accent chỉ xuất hiện ở CTA chính; dải đậm ≤2 lần/trang
- [ ] Squint test: mỗi viewport 1 điểm nhìn; 3 section bất kỳ cùng giọng (K1)
- [ ] Hai section liền nhau không cùng bố cục
- [ ] Option B đổi được bằng 1 dòng import, layout không sửa

### 10.3 Chữ
- [ ] Lora + Be Vietnam Pro hiển thị đúng `ệ ự ỡ ẳ Đ` ở 400/500/700, không nhảy font
- [ ] Không cỡ chữ ngoài thang token

### 10.4 Mobile (K7)
- [ ] 375px: H1 hero + nút tìm phòng trong viewport đầu
- [ ] Rooms mobile = thẻ dọc, không cuộn ngang (F6); Home `rooms` snap-scroll
- [ ] Sticky bottom bar sau hero + safe-area; RoomDetail bottom-sheet hoạt động
- [ ] CTA ≥44px, mọi target ≥24px; body không overflow-x

### 10.5 Trust & phễu
- [ ] Định danh chính chủ + SĐT trong viewport đầu Home
- [ ] "Đường ra đảo" trên Home; chính sách huỷ bậc thang + dòng tàu hoãn TRONG panel RoomDetail
- [ ] Mỗi trang đúng 1 CTA chính (M2); Zalo luôn vai phụ
- [ ] Không `href="#"` ở footer 3 trang; không promo không có thật (M4)
- [ ] Giỏ hàng sống qua login (F1); empty-state theo F2 ở widget + Rooms
- [ ] Ngày mặc định động (hôm nay +7), không hard-code

### 10.6 Tiếp cận & hiệu năng (D4/K8)
- [ ] Đo và **ghi số** tương phản mọi cặp §2.1/§2.2 (đặc biệt 2 cặp sát ~4.9:1)
- [ ] Tab toàn phễu không mất focus; thứ tự focus khớp thứ tự đọc
- [ ] Mọi ảnh có `alt` (trang trí `alt=""`); field có `<label>`; landmark/heading đúng cấp
- [ ] `next/image` AVIF/WebP + `sizes`; hero `priority`; font swap
- [ ] Lighthouse: **ghi số LCP vào PR**, mục tiêu <2s
- [ ] Mọi component §5 đủ 7 trạng thái (D3)

### 10.7 Nội dung
- [ ] Mọi chuỗi `{vi, en}` (R6); chuyển VI/EN không vỡ layout
- [ ] Ảnh crawl không lên production (R9); mục CHỜ DUYỆT §7 chưa tự quyết

---

## 11. Rủi ro đã biết

| Rủi ro | Ảnh hưởng | Xử lý |
|---|---|---|
| Ảnh phòng collage 3-trong-1 | Cao — section bán hàng | Cover đơn + crop thật (§8.2); giải thật là §8.3 |
| `#1173B8`/nền ~4.9:1 — sát ngưỡng AA | Trung bình | Đo thật; nếu <4.5 thì đậm brand thêm một nấc |
| MST lấy từ crawl chưa xác minh | Cao nếu sai | Đánh dấu CHỜ XÁC MINH, không lên production trước khi chủ resort xác nhận |
| Map 20→7 hạng phòng chưa duyệt | Cao — sai giá là mất trust | Seed đủ nhưng gắn nhãn CHỜ DUYỆT, trình khách bảng map |
| Zalo fake data bị hiểu là thật | Thấp | Ghi chú placeholder trong code + spec; thay khi có OA |
| Hai bản cũ vẫn trong repo | Trung bình | Ngoài phạm vi; đề xuất dọn sau khi bản này được duyệt |

---

## 12. Sau vòng này (thứ tự đề xuất)

1. **5 trang chính sách thật** (hoàn huỷ, thanh toán, bảo mật…) — nợ trust khẩn
   nhất; footer `href="#"` là tín hiệu lừa đảo kinh điển
2. **Khối tin cậy đầy đủ** — MST xác minh, Zalo OA thật, bản đồ
3. **Nối luồng đặt phòng end-to-end** — login OTP, giỏ, 3 option thanh toán
4. **Các trang parity còn lại** — Dining/Experiences/Event/News/Gallery/Contact
5. **Blog Nam Du** — viết lại 13 bài crawl thành nội dung riêng (R9/F8)
6. **Animation đồng bộ** — trả nợ D-9, một lượt cho cả 3 trang
7. **Cổng thanh toán thật** — trả nợ D-7
