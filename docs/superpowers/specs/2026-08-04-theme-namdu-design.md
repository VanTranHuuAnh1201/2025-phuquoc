# Spec — Theme Nam Du (mẫu 05)

> Bản thiết kế kiến trúc cho giao diện thứ 3 của The Nam Du Hill Resort.
> Mọi thay đổi sau này đối chiếu với tài liệu này.
>
> Ngày chốt: 2026-08-04 · Brief: [thenamduhillresort.md](../../../resources/docs/briefs/thenamduhillresort.md)
> Luật áp dụng: [architecture.md](../../../.claude/rules/architecture.md) ·
> [design-tokens.md](../../../.claude/rules/design-tokens.md) ·
> [app-flows.md](../../../.claude/rules/app-flows.md) ·
> [the-10k-checklist.md](../../../.claude/rules/the-10k-checklist.md)

---

## 0. Bối cảnh và quyết định nền

### 0.1 Vì sao có bản thứ 3

Repo đã có hai bản cho cùng khách hàng này, cả hai đều chưa đạt:

| Bản | Vị trí | Kiến trúc | Vấn đề |
|---|---|---|---|
| 1 | `apps/2026-thenamduhill` | Theme package h1–h4 + `@repo/core` + CMS | Đúng luật, nhưng gu thẩm mỹ chưa đạt |
| 2 | `apps/2026-thenamduhillresort` | Standalone, `src/data/*.ts` riêng | Vi phạm R8 (data riêng, không dùng core), không tái dùng được |

Bản 3 lấy **kiến trúc của bản 1** và **làm lại hoàn toàn phần hình thức**.
Hai bản cũ giữ nguyên làm tham chiếu, không xoá trong phạm vi spec này.

### 0.2 Quyết định đã chốt với người dùng

| # | Quyết định | Ghi chú |
|---|---|---|
| D-1 | Giao diện mới là **theme package thứ 5**, không phải app mới | Dùng lại ngay core + login OTP + giỏ hàng + Đơn của tôi + CMS |
| D-2 | Tên package `@repo/theme-namdu`, slug route `h5` | Xem `/h5` tại `localhost:3000` |
| D-3 | Design direction: **Coastal editorial** | Sáng, nhiều khoảng thở, ảnh lớn |
| D-4 | Bảng màu lấy theo **ảnh thật của resort**, logo là điểm nhấn | Xem §2.1 |
| D-5 | Motion: **tĩnh ở vòng này**, thêm animation đồng bộ ở vòng cuối | Brief K0-Q4 |
| D-6 | Phạm vi vòng này: **chỉ Home** | Chốt gu trước, nhân ra sau |
| D-7 | Ảnh: dùng **ảnh crawl nguyên trạng**, thay sau | DEV-ONLY theo R9 |
| D-8 | Khối "bằng chứng chính chủ" **tạm bỏ khỏi Home** | Chờ khách cấp MST, Zalo OA, địa chỉ |
| D-9 | Mobile là **spec ngang hàng desktop** | Xem §4, không phải phụ lục |

### 0.3 Điều KHÔNG làm ở vòng này

Ghi rõ để không hiểu nhầm phạm vi:

- Không dựng trang Rooms / RoomDetail / Checkout / Gallery / Contact riêng —
  theme khai `Home`, các slot khác **để trống** và tự rơi về mặc định của
  registry (cơ chế đã có sẵn, xem `apps/2026-thenamduhill/src/themes/registry.ts`).
- Không sửa `packages/core`, `packages/ui`, hay bất kỳ route nào (luật R5).
- Không đụng vào theme h1–h4.
- Không thêm animation (D-5).
- Không thêm khối tin cậy / social proof (D-8).

---

## 1. Point of view (K1)

> **"Đảo hoang sơ nhìn từ trên đồi — ảnh lớn thở, chữ serif tĩnh,
> ngọc lam và vàng nghệ lấy thẳng từ chính resort."**

Đây là câu đối chiếu cho mọi quyết định sau. Ba trụ cột:

| Trụ cột | Quyết định | Lý do |
|---|---|---|
| **Ảnh** | Full-bleed, tỷ lệ cao, ít ảnh nhưng lớn | Resort bán *cảm giác ở đó*. Nhiều ảnh nhỏ = catalogue; ít ảnh lớn = tạp chí |
| **Chữ** | Serif display cho tiêu đề + sans cho thân | Serif tạo cảm giác lâu năm, đáng tin — đánh trực tiếp vào nỗi đau "có phải chính chủ" |
| **Màu** | Ngọc lam sâu là brand, vàng nghệ là CTA duy nhất | Rút từ chính ảnh resort → giao diện và ảnh cùng một tông (K5) |

**Điều làm nó khác h1–h4:** bốn mẫu cũ đều là "web khách sạn" — header đặc,
section đều nhau, card lưới. Bản này đi hướng **ấn phẩm**: nhịp section so le,
có section chỉ một ảnh và một câu, khoảng thở lớn gấp đôi.

**Phép thử K1:** nhìn 3 section bất kỳ phải thấy cùng một giọng. Nếu một section
cắm sang website khách sạn bất kỳ mà không lạc lõng → đang là template, chưa đạt.

---

## 2. Design tokens

### 2.1 Nguồn gốc bảng màu

Đây là quyết định D-4, cần ghi rõ vì nó phản trực giác.

**Vấn đề:** logo `OP5.png` là xanh dương sáng (`#38A8F0`) + mặt trời đỏ cam
(`#E8442A`). Nhưng ảnh chụp thật của resort cho thấy bản sắc là **ngọc lam +
vàng nghệ + gỗ mộc**: cửa chớp xanh ngọc, khăn trải giường teal, gối vàng,
đèn dây vàng ấm, tường đá và gỗ.

**Quyết định:** lấy màu theo **ảnh thật**. Lý do — nếu ép giao diện theo xanh
dương logo, ảnh sẽ chọi với nền, đúng kiểu lệch tông mà K5 cấm. Logo giữ
nguyên trên header; nó vốn có nền xanh riêng nên không xung đột.

Mặt trời đỏ `#E8442A` **không vào bảng màu**: thêm màu thứ ba sẽ phá quy tắc
3–5 màu của K3, và đỏ xung với vàng nghệ khi đứng cạnh.

### 2.2 Bảng token (`packages/theme-namdu/src/tokens.css`)

Khai **đủ** bộ biến bắt buộc ở D1. Thiếu một biến = component `ui` vỡ.

```css
[data-theme='namdu'] {
    /* ---- màu ngữ nghĩa ---- */
    --color-brand:            #0E5B63;  /* ngọc lam sâu — cửa chớp, khăn trải */
    --color-accent:           #E8A317;  /* vàng nghệ — gối, đèn dây → CHỈ dùng cho CTA */

    --color-text-primary:     #1A2E31;  /* gần đen ngả xanh */
    --color-text-secondary:   #4A5F62;
    --color-text-tertiary:    #7C8E90;
    --color-text-inverse:     #FBF9F5;

    --color-surface-base:     #FBF9F5;  /* trắng ngà ấm, KHÔNG phải #fff */
    --color-surface-raised:   #FFFFFF;
    --color-surface-strong:   #0E5B63;

    --color-border-default:   #D8CFC0;
    --color-border-muted:     #E5DFD4;  /* viền cát */

    /* ---- trạng thái ---- */
    --color-success:    #1E7A5A;   --color-success-bg: #E6F2ED;
    --color-warning:    #A8720C;   --color-warning-bg: #FBF0DA;
    --color-danger:     #B3341F;   --color-danger-bg:  #FBE9E6;
    --color-info:       #0E5B63;   --color-info-bg:    #E4F0F1;

    /* ---- chữ ---- */
    --font-display:           'Fraunces', Georgia, serif;
    --font-family-primary:    'Be Vietnam Pro', system-ui, sans-serif;
    --font-size-xs:   12px;  --font-size-sm:   14px;
    --font-size-base: 16px;  --font-size-lg:   18px;
    --font-size-xl:   22px;  --font-size-2xl:  28px;
    --font-size-3xl:  40px;  --font-size-4xl:  60px;
    --font-weight-base: 400; --font-weight-medium: 500; --font-weight-bold: 700;
    --line-height-base: 1.65;

    /* ---- khoảng cách: thang 4px, rộng hơn h1–h4 để có khoảng thở ---- */
    --space-1: 4px;   --space-2: 8px;   --space-3: 16px;  --space-4: 24px;
    --space-5: 40px;  --space-6: 64px;  --space-7: 96px;  --space-8: 140px;

    /* ---- bo góc: sắc, gần vuông — ấn phẩm không bo tròn ---- */
    --radius-xs: 2px;  --radius-sm: 4px;  --radius-md: 8px;
    --radius-lg: 12px; --radius-xl: 16px;

    /* ---- đổ bóng: rất nhẹ, gần như không có ---- */
    --shadow-1: 0 1px 2px rgba(26, 46, 49, .06);
    --shadow-2: 0 8px 24px rgba(26, 46, 49, .10);

    /* ---- chuyển động: khai đủ, vòng này chỉ dùng cho hover ---- */
    --motion-instant: 120ms;  --motion-fast: 220ms;  --motion-normal: 400ms;
}
```

### 2.3 Ba luật riêng của theme này

1. **Vàng nghệ `--color-accent` CHỈ dùng cho CTA chính.** Không dùng cho badge,
   icon, đường kẻ, hover. Đó là cách một màu duy nhất luôn có nghĩa "bấm vào
   đây" (K4 — mỗi viewport một điểm nhìn chính).
2. **Nền là trắng ngà `#FBF9F5`, không phải `#fff`.** Ảnh resort ngả ấm; nền
   trắng lạnh làm ảnh trông cũ và ngả vàng.
3. **Không hex nào nằm ngoài file này** (D0). Mọi component đọc `var(--…)`.

### 2.4 Font và tiếng Việt

| Vai trò | Font | Vì sao |
|---|---|---|
| Display | **Fraunces** | Serif có bộ dấu tiếng Việt đầy đủ, có trục `SOFT`/`WONK` tạo cảm giác thủ công |
| Body | **Be Vietnam Pro** | Thiết kế riêng cho tiếng Việt — dấu không vỡ, không fallback giữa câu |

Cả hai đều là Google Fonts, license mở, không tốn phí (K0-Q5).

Nạp qua `next/font/google` trong `apps/2026-thenamduhill/src/app/layout.tsx`
với `display: 'swap'` (K8 — LCP). Đây là **ngoại lệ duy nhất** được sửa file
app, cùng với dòng import `tokens.css` — đã được CLAUDE.md §4 cho phép.

**Bắt buộc kiểm:** gõ thử `ệ ự ỡ ẳ Đ` ở cả hai font, ở cả weight 400 và 700.
Dấu vỡ hoặc nhảy font giữa câu = chưa đạt (K2).

### 2.5 Tương phản (D4 / K8)

Đo và ghi số vào PR. Ước tính trước:

| Cặp màu | Tỷ lệ ước tính | Ngưỡng | Dùng ở |
|---|---|---|---|
| `#1A2E31` trên `#FBF9F5` | ~14:1 | ≥4.5:1 | Chữ thân |
| `#4A5F62` trên `#FBF9F5` | ~7.5:1 | ≥4.5:1 | Chữ phụ |
| `#7C8E90` trên `#FBF9F5` | ~3.6:1 | ≥4.5:1 ✗ | **CHỈ dùng cho chữ ≥18.66px bold hoặc ≥24px** |
| `#FBF9F5` trên `#0E5B63` | ~9:1 | ≥4.5:1 | Chữ trên dải ngọc lam |
| `#1A2E31` trên `#E8A317` | ~8:1 | ≥4.5:1 | Chữ trên nút CTA vàng |

`--color-text-tertiary` không đạt AA cho chữ thường — đây là ràng buộc phải
tôn trọng khi dựng, không phải lỗi cần sửa token (nó dành cho metadata cỡ lớn).

---

## 3. Cấu trúc Home — Desktop

### 3.1 Contract section (R7)

Giữ đúng bộ id, được bỏ bớt nhưng **không đổi tên**:

```ts
export const sections: readonly SectionId[] = [
    'top', 'about', 'rooms', 'places', 'dining', 'tours', 'gallery', 'booking', 'contact',
] as const
```

Bỏ `practical` (h1 có) — Home đã đủ dài, đẩy sang trang riêng ở vòng sau.

### 3.2 Nhịp section — điểm khác biệt cốt lõi

Bốn theme cũ có nhịp **đều**: section nào cũng cùng padding, cùng kiểu lưới.
Bản này cố ý **so le** để tạo cảm giác ấn phẩm:

```
top       ████████████████████  ảnh toàn màn, 85vh
about     ░░░░░  ▓▓▓▓▓▓▓▓▓▓     ảnh trái + chữ phải, khoảng thở lớn
rooms     ▓▓▓  ▓▓▓  ▓▓▓         3 card đều — nhịp nhanh, đây là chỗ bán hàng
places    ████████████████████  ảnh full-bleed + MỘT câu — nhịp nghỉ
dining    ▓▓▓▓▓▓  ░░░░░         hai cột so le, ngược chiều about
tours     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    danh sách ngang
gallery   ▓▓ ▓▓▓▓ ▓▓  ▓▓▓▓ ▓▓   lưới bất đối xứng
booking   ████████████████████  dải ngọc lam đặc + CTA vàng
contact   ▓▓▓▓▓▓▓▓  ░░░░        hotline bấm gọi + Zalo
```

Nguyên tắc: **hai section liền nhau không bao giờ cùng một bố cục.**

### 3.3 Đặc tả từng section

Khung nội dung tối đa `1200px`, căn giữa. Padding dọc mặc định `--space-7` (96px),
riêng `about` và `places` dùng `--space-8` (140px) để tạo khoảng thở.

#### `top` — Hero

| | |
|---|---|
| Chiều cao | `85vh` (thấy được mép section sau → gợi ý cuộn; không phải 100vh) |
| Ảnh | `hero.images[0]`, `object-fit: cover`, phủ toàn khung |
| Lớp phủ | Gradient dọc từ `transparent` → `rgba(26,46,49,.55)` ở đáy — để chữ đọc được mà ảnh không bị tối đều |
| Nội dung | Căn **trái-dưới**, không căn giữa |
| Kicker | `hero.kicker` — "Quần đảo Nam Du · Kiên Giang", `--font-size-sm`, letter-spacing rộng, chữ hoa |
| Tiêu đề | `hero.title` — `--font-display`, `--font-size-4xl` (60px), `line-height: 1.1`, tối đa 18 chữ/dòng |
| Phụ đề | `hero.sub` — `--font-size-lg`, `max-width: 52ch` |
| Badge | `hero.badges` (3 mục) — viền mảnh `--color-text-inverse`, nền trong suốt |
| Ô tìm phòng | Khối nổi, nền `--color-surface-raised`, đè lên mép dưới hero |

Ô tìm phòng desktop: 4 vùng ngang — Nhận phòng · Trả phòng · Số khách · nút
**"Tìm phòng trống"** (nền `--color-accent`). Đây là CTA chính của viewport đầu.

#### `about` — Giới thiệu

Lưới 2 cột `5fr 7fr`, khoảng cách `--space-6`.

- Trái: một ảnh dọc tỷ lệ `3:4` (`about.image` hoặc ảnh resort chọn tay)
- Phải: `about.kicker` (nhỏ, hoa, ngọc lam) → `about.title` (`--font-display`,
  `--font-size-3xl`) → `about.body` (mảng đoạn văn, `max-width: 60ch`)
- Dưới khối chữ: **dải `facts`** — 4 số liệu thật từ core
  (`21 hòn đảo` · `309m đỉnh cao nhất` · `9,12 km²` · `T12–T3 mùa đẹp nhất`),
  bày ngang, số dùng `--font-display` cỡ `--font-size-2xl`

Dải `facts` phục vụ mục tiêu "giới thiệu Nam Du để tạo thiện cảm" trong brief.

#### `rooms` — Hạng phòng

Nhịp nhanh nhất trang, vì đây là chỗ chuyển đổi.

- Tiêu đề section + link "Xem tất cả 7 hạng phòng" (chuẩn bị cho vòng sau)
- 3 card đầu tiên từ `data.rooms`, lưới `repeat(3, 1fr)`, gap `--space-4`
- Mỗi card: ảnh `4:5` → tên (`--font-display`, `--font-size-xl`) → `desc` →
  hàng meta (`area` · `guests` khách) → `tags` (tối đa 2) → **giá**
- Giá: `--font-display`, `--font-size-xl`, `tabular-nums`, kèm "/ đêm" cỡ nhỏ.
  Định dạng qua helper của `core`, **không tự viết** (R8)

**Ảnh (D-7):** dùng ảnh crawl nguyên trạng. Vì là ảnh ghép collage 3-trong-1,
mỗi card đặt `object-position` riêng để lấy một góc hợp lý thay vì bóp cả
collage. Ghi lại danh sách ảnh cần chụp thay ở §7.

#### `places` — Điểm đến

**Nhịp nghỉ.** Section này cố ý không có card.

- Một ảnh full-bleed (tràn mép trình duyệt, không giới hạn 1200px), cao `60vh`
- Đè lên: một câu duy nhất — tên bãi + mô tả ngắn từ `places[0]`
  ("Bãi Cây Mến — vịnh kín gió, cát trắng mịn, hàng dừa cổ thụ 70–80 năm tuổi")
- Dưới ảnh: 8 địa danh còn lại bày thành hàng chữ đơn giản, mỗi mục
  `name` + `tag`, phân cách bằng đường kẻ `--color-border-muted`

Đây là section chứng minh point of view rõ nhất: không khách sạn nào khác dám
để một section chỉ có một ảnh và một câu.

#### `dining` — Ẩm thực

Lưới 2 cột `7fr 5fr` — **ngược chiều** `about` (chữ trái, ảnh phải).

4 mục từ `data.dining`, mỗi mục: `name` + `desc` + `note` (giờ mở cửa).
Bày dọc, phân cách bằng đường kẻ mảnh.

#### `tours` — Lịch trình

Danh sách ngang, 2 tour từ `data.tours`.

Mỗi hàng: `code` (2N1Đ) → `name` → `summary` → `price` → link "Xem lịch trình".
Không dùng card — dùng hàng có đường kẻ, hợp giọng ấn phẩm hơn.

#### `gallery` — Thư viện ảnh

Lưới bất đối xứng, 7 ảnh: 1 ảnh lớn chiếm 2×2 ô, còn lại 1×1.
`gap: --space-2` (8px) — sát nhau, để cụm ảnh đọc như một khối.

#### `booking` — Chốt

Dải ngọc lam đặc `--color-surface-strong`, tràn mép, cao ~`--space-8`.

- Tiêu đề `--font-display` màu `--color-text-inverse`
- Một câu phụ
- Nút CTA nền `--color-accent`, chữ `--color-text-primary`

Đây là **CTA chính thứ hai và cuối cùng** của trang. Toàn trang chỉ có đúng hai
nút vàng: ô tìm phòng ở hero và nút này.

#### `contact` — Liên hệ

Lưới 2 cột `6fr 6fr`.

- Trái: `brand.address`, **hotline `tel:` bấm gọi được**, email `mailto:`
- Phải: nút Zalo (theo brief — kênh chính của khách Việt), Facebook, TikTok, YouTube

Icon SVG, có `aria-label` song ngữ. **Không dùng emoji** (D5).

Khối "bằng chứng chính chủ" (MST, pháp nhân, bản đồ) **tạm bỏ** theo D-8 — có
placeholder đánh dấu trong code để vòng sau điền.

---

## 4. Cấu trúc Home — Mobile

**Mobile được thiết kế riêng, không phải desktop bị nén (K7).**
Đây là chỗ 90% site rẻ tiền sụp đổ, và là spec ngang hàng §3.

### 4.1 Breakpoint

| Tên | Ngưỡng | Ghi chú |
|---|---|---|
| Mobile | `< 640px` | Spec chính của mục này |
| Tablet | `640–1023px` | Lưới 3 cột → 2 cột; còn lại theo desktop |
| Desktop | `≥ 1024px` | §3 |

Viết **mobile-first**: CSS mặc định là mobile, `@media (min-width: …)` mở rộng lên.

### 4.2 Quyết định layout riêng từng section

Bảng này là bắt buộc của K7 — mỗi section phải có quyết định riêng, không được
ghi "stack dọc lại".

| Section | Mobile khác desktop thế nào |
|---|---|
| `top` | Chiều cao `92vh`. Tiêu đề tụt xuống `--font-size-2xl` (28px). Badge còn **1 mục** quan trọng nhất, không phải 3. Ô tìm phòng thu thành **một nút duy nhất** "Tìm phòng trống" → mở bottom-sheet chứa 3 field. **Tiêu đề + nút phải nằm trong viewport đầu, không bắt cuộn.** |
| `about` | Ảnh lên trước, chữ xuống dưới. Dải `facts` từ hàng ngang → **lưới 2×2**, không cuộn ngang |
| `rooms` | Từ lưới 3 cột → **cuộn ngang có snap** (`scroll-snap-type: x mandatory`), card rộng `82vw` để lộ mép card sau, gợi ý còn nữa. Không stack dọc — 3 card dọc đẩy các section sau xuống quá xa |
| `places` | Ảnh full-bleed giảm còn `50vh`. Câu đè chuyển xuống **dưới ảnh** thay vì đè lên — chữ đè ảnh ở màn nhỏ luôn khó đọc. Danh sách 8 địa danh giữ nguyên dạng hàng |
| `dining` | Bỏ ảnh phụ, chỉ giữ danh sách chữ. 4 mục dọc, đường kẻ phân cách |
| `tours` | Hàng ngang → **thẻ dọc**, mỗi thẻ hiện `code` + `name` + `price` + link |
| `gallery` | Lưới bất đối xứng → **lưới 2 cột đều**, 6 ảnh, bỏ ảnh lớn 2×2 |
| `booking` | Dải ngọc lam, chữ căn giữa, nút CTA **rộng hết chiều ngang** |
| `contact` | 2 cột → 1 cột. Nút Zalo và hotline lên **trên cùng**, vì đó là hành động thật của khách Việt |

### 4.3 Sticky bottom bar

Xuất hiện khi người dùng cuộn **qua khỏi hero**, ẩn khi ở hero (tránh che CTA gốc).

```
┌────────────────────────────────────────┐
│  Từ 1.546.000đ / đêm    [ Tìm phòng ]  │
└────────────────────────────────────────┘
```

- Nền `--color-surface-raised`, viền trên `--color-border-muted`, `--shadow-2`
- Nút nền `--color-accent`, cao ≥ 44px
- `position: fixed; bottom: 0`, tôn trọng `env(safe-area-inset-bottom)` (iPhone)
- Có `z-index` thấp hơn bottom-sheet của ô tìm phòng

Đây là mục K7 yêu cầu rõ: "booking bar thành sticky bottom bar".

### 4.4 Vùng chạm và chữ

| Yêu cầu | Giá trị | Nguồn |
|---|---|---|
| CTA chính | ≥ 44×44px | K7 |
| Mọi target khác | ≥ 24×24px | WCAG 2.2 §2.5.8 (D4) |
| Cỡ chữ thân nhỏ nhất | 16px | Dưới 16px iOS tự zoom khi focus input |
| Khoảng cách giữa hai target | ≥ 8px | Tránh bấm nhầm |

### 4.5 Thang chữ mobile

Không dùng cỡ ngoài thang token (D5). Ánh xạ:

| Vai trò | Desktop | Mobile |
|---|---|---|
| Tiêu đề hero | `--font-size-4xl` 60px | `--font-size-2xl` 28px |
| Tiêu đề section | `--font-size-3xl` 40px | `--font-size-xl` 22px |
| Tên phòng | `--font-size-xl` 22px | `--font-size-lg` 18px |
| Thân | `--font-size-base` 16px | `--font-size-base` 16px |

Thân chữ **không đổi** giữa desktop và mobile — 16px là ngưỡng đọc thoải mái ở
cả hai, và giảm xuống sẽ kích hoạt auto-zoom của iOS.

### 4.6 Ảnh trên mobile

- Mọi ảnh qua `next/image` với `sizes` khai đúng — mobile không tải ảnh desktop
- Format AVIF/WebP (K8)
- Ảnh hero có `priority` (là LCP element); mọi ảnh khác `loading="lazy"`
- Ảnh trang trí `alt=""`; ảnh mang thông tin có `alt` song ngữ (D4)

---

## 5. Kiến trúc mã nguồn

### 5.1 Cấu trúc package

```
packages/theme-namdu/
  package.json          name: "@repo/theme-namdu"
  tsconfig.json         extends @repo/tsconfig
  src/
    tokens.css          §2.2 — biến CSS, KHÔNG có hex nào khác nơi
    meta.ts             slug 'h5', tên, mô tả, swatch cho trang hub
    composition.tsx     thứ tự section + Home
    index.ts            export ThemeDefinition
    strings.ts          chuỗi CỦA GIAO DIỆN (nhãn nút, tiêu đề section) — song ngữ
    sections/
      Header.tsx  Hero.tsx  About.tsx  Rooms.tsx  Places.tsx
      Dining.tsx  Tours.tsx  Gallery.tsx  Booking.tsx  Contact.tsx
      SearchBar.tsx      ô tìm phòng (desktop) + bottom-sheet (mobile)
      StickyBar.tsx      §4.3
```

**Ranh giới (R4):** theme chỉ chứa hình thức. Không gọi API, không tính giá,
không định nghĩa type dữ liệu. Nếu đang viết những thứ đó trong theme → sai chỗ.

**`strings.ts` chứa gì:** chuỗi thuộc về *giao diện* ("Tìm phòng trống",
"Xem tất cả hạng phòng"), song ngữ `{vi, en}` theo R6. Chuỗi thuộc về *nội dung*
(tên phòng, mô tả) nằm ở `core`, theme chỉ đọc.

### 5.2 Năm chỗ phải sửa để đăng ký theme (CLAUDE.md §4)

Đúng 5 chỗ, không hơn:

1. Tạo `packages/theme-namdu/`
2. `apps/2026-thenamduhill/package.json` — thêm `"@repo/theme-namdu": "workspace:*"`
3. `apps/2026-thenamduhill/src/themes/registry.ts` — 1 dòng import + 1 phần tử mảng
4. `apps/2026-thenamduhill/src/app/layout.tsx` — 1 dòng import `tokens.css`
   (+ khai `next/font` cho Fraunces và Be Vietnam Pro, §2.4)
5. `apps/2026-thenamduhill/next.config.ts` — thêm vào `transpilePackages`

Rồi `pnpm install`. Route `/h5` và thẻ trên hub **tự xuất hiện** — không sửa route.

**Nếu buộc phải sửa thêm chỗ nào ngoài 5 chỗ này → kiến trúc đang rò rỉ (R5),
dừng lại và báo, không vá tạm.**

### 5.3 Slot chưa dựng

`ThemeDefinition` có các slot `Rooms`, `RoomDetail`, `Checkout`, `Tours`,
`TourDetail`, `Gallery`, `Contact`. Vòng này **chỉ khai `Home`**; các slot khác
bỏ trống và tự rơi về mặc định — cơ chế đã có sẵn trong registry, không phải
viết thêm gì.

### 5.4 Nguồn dữ liệu

Toàn bộ đọc từ `PropertyData` do route truyền vào — **không tự khai mock data,
không fetch** (R8). Dữ liệu đã có sẵn và đủ:

| Trường | Số mục | Dùng ở |
|---|---|---|
| `hero` | — | `top` |
| `about` + `facts` | 4 facts | `about` |
| `rooms` | 7 | `rooms` (hiện 3) |
| `places` | 8 | `places` |
| `dining` | 4 | `dining` |
| `tours` | 2 | `tours` |
| `nav` | 7 | `Header` |
| `brand` | — | `Header`, `contact` |

### 5.5 Ảnh

`Room` trong core **không có `images`** (chỉ `hero.images` có). Vì vậy theme
cần một bảng ánh xạ `roomId → đường dẫn ảnh`.

**Đặt ở đâu:** `core/assets.ts` đã có sẵn `ASSET_DIR.property` cho đúng việc này.
Ánh xạ đặt ở `core` chứ **không phải** trong theme — ảnh là *nội dung của khách
hàng*, không phải hình thức của một mẫu (R8: đổi ảnh một chỗ, cả N theme đổi theo).

File ảnh copy vào `apps/2026-thenamduhill/public/property/`.

---

## 6. Trạng thái component (D3)

Mọi component tương tác phải khai **đủ 7 trạng thái**. Thiếu một = chưa xong.

| Trạng thái | Yêu cầu cụ thể ở theme này |
|---|---|
| `default` | Theo token |
| `hover` | Nút CTA: nền tối đi 8%. Link: gạch chân xuất hiện. Chuyển trong `--motion-instant` |
| `focus-visible` | Outline 2px `--color-brand`, offset 2px. **Không bao giờ `outline: none`**. Tương phản ≥3:1 |
| `active` | Nền tối thêm, dịch xuống 1px |
| `disabled` | `cursor: not-allowed`, opacity .5, **vẫn đọc được** |
| `loading` | Chỉ báo xoay, khoá tương tác, **giữ nguyên kích thước** để không nhảy layout |
| `error` | Viền `--color-danger` + **thông báo bằng chữ**, không chỉ đổi màu |

Component cần đủ 7 trạng thái ở vòng này: nút CTA, các field của ô tìm phòng,
nút chuyển ngôn ngữ, link điều hướng.

---

## 7. Ảnh — hiện trạng và việc cần làm

### 7.1 Hiện trạng (khảo sát 2026-08-04)

| Nguồn | Số file | Đánh giá |
|---|---|---|
| `resources/scripts/crawl/output/thenamduhill/assets/thenamduhill.com/` | 58 | Độ phân giải tốt (1–2MB). **Nhưng ảnh phòng là collage 3-trong-1**; vài ảnh có watermark `kiengiang.vn` |
| `apps/2026-thenamduhillresort/public/uploads/` | 18 | Gồm logo `OP5.png`, `hero-1.jpg`, `hero-2.jpg` |

### 7.2 Xử lý ở vòng này (D-7)

Dùng nguyên trạng, đặt `object-position` riêng từng card để lấy góc hợp lý.
Toàn bộ là **DEV-ONLY theo R9** — không đẩy lên production.

### 7.3 Danh sách ảnh nên chụp lại (đưa cho khách)

Đây là đầu ra phục vụ brief ("nếu chất lượng ảnh không tốt có thể gợi ý ảnh cần tạo"):

| # | Ảnh cần | Vì sao | Tỷ lệ |
|---|---|---|---|
| 1 | Hero — toàn cảnh resort trên đồi lúc hoàng hôn, thấy biển và đảo | Ảnh quyết định LCP và ấn tượng đầu | 16:9 ngang |
| 2–8 | Mỗi hạng phòng **một ảnh đơn** (7 hạng) | Thay ảnh collage — đây là điều bắt buộc để card phòng dùng được | 4:5 dọc |
| 9 | Bể bơi / khu sinh hoạt chung | Section `about` | 3:4 dọc |
| 10 | Bãi Cây Mến nhìn từ trên cao | Section `places` full-bleed | 21:9 rất ngang |
| 11 | BBQ hải sản ban đêm, đèn dây vàng | Section `dining` — bán không khí | 4:3 |
| 12 | Bữa sáng / cà phê rooftop nhìn ra biển | `dining` | 4:3 |

**Nguyên tắc chung cho người chụp:** cùng một tông ánh sáng (ưu tiên giờ vàng
sáng sớm hoặc chiều muộn), không dùng filter bão hoà cao, không đóng watermark.

---

## 8. Định nghĩa "xong" cho vòng này

Một checklist kiểm chứng được, không phải khẩu hiệu.

### 8.1 Kiến trúc

- [ ] `pnpm lint` và `pnpm typecheck` sạch
- [ ] Chỉ sửa đúng 5 chỗ ở §5.2, không hơn
- [ ] `packages/core` và `packages/ui` **không bị sửa**
- [ ] Theme không import theme khác (R1)
- [ ] Theme không chứa logic tính giá / gọi API / định nghĩa type (R4)
- [ ] **Cả 5 theme còn build được**, không riêng theme mới

### 8.2 Token và thẩm mỹ

- [ ] `tokens.css` khai **đủ** bộ biến ở D1
- [ ] Không hex nào nằm ngoài `tokens.css`
- [ ] Toàn trang chỉ có **đúng 2 nút vàng** (hero + booking)
- [ ] Squint test: mỗi viewport nổi lên đúng 1 điểm nhìn chính
- [ ] Nhìn 3 section bất kỳ thấy cùng một giọng (K1)
- [ ] Không có hai section liền nhau cùng bố cục (§3.2)

### 8.3 Chữ

- [ ] Fraunces và Be Vietnam Pro hiển thị đúng `ệ ự ỡ ẳ Đ` ở weight 400 và 700
- [ ] Không nhảy font giữa câu
- [ ] Không cỡ chữ nào ngoài thang `--font-size-*`

### 8.4 Mobile (K7)

- [ ] Ở 375px: tiêu đề hero + nút tìm phòng **nằm trong viewport đầu**
- [ ] `rooms` cuộn ngang có snap, lộ mép card sau
- [ ] Sticky bottom bar xuất hiện sau hero, tôn trọng safe-area
- [ ] Không section nào cuộn ngang ngoài ý muốn (`overflow-x` của body = 0)
- [ ] CTA ≥44px, mọi target ≥24px
- [ ] Mỗi section có quyết định layout riêng theo §4.2

### 8.5 Khả năng tiếp cận (D4 / K8)

- [ ] Đo và **ghi số** tương phản cho mọi cặp màu ở §2.5
- [ ] Tab qua toàn trang, không mất viền focus, không bẫy focus
- [ ] Thứ tự focus khớp thứ tự đọc
- [ ] Mọi ảnh có `alt` (trang trí thì `alt=""`)
- [ ] Field của ô tìm phòng có `<label>` gắn đúng
- [ ] Landmark đúng (`<header> <main> <footer>`), heading đúng cấp, không nhảy h1→h3
- [ ] `prefers-reduced-motion` được tôn trọng (dù vòng này gần như không có motion)

### 8.6 Hiệu năng (K8)

- [ ] Ảnh qua `next/image`, AVIF/WebP, `sizes` khai đúng
- [ ] Ảnh hero có `priority`; còn lại lazy
- [ ] Font `display: swap`
- [ ] Đo Lighthouse, **ghi số LCP vào PR**, mục tiêu < 2s

### 8.7 Nội dung

- [ ] Mọi chuỗi giao diện trong `strings.ts` đủ `{vi, en}` (R6)
- [ ] Chuyển VI/EN không vỡ layout (tiếng Anh dài hơn tiếng Việt ~15%)
- [ ] Ảnh crawl **không** được đẩy lên production (R9)

---

## 9. Rủi ro đã biết

| Rủi ro | Ảnh hưởng | Cách xử lý |
|---|---|---|
| Ảnh phòng là collage → card trông lộn xộn | Cao — đây là section bán hàng | Đã chấp nhận ở D-7. `object-position` riêng từng card giảm nhẹ. Giải thật là §7.3 |
| Hai bản cũ vẫn nằm trong repo | Trung bình — dễ nhầm khi sửa | Ngoài phạm vi spec này. Đề xuất dọn sau khi bản 3 được duyệt |
| Bỏ khối tin cậy khỏi Home (D-8) | Cao — đó là nỗi đau số 1 của khách | Chấp nhận có ý thức. Phải làm ở vòng ngay sau, khi có MST + Zalo OA + địa chỉ |
| `--color-text-tertiary` không đạt AA cho chữ thường | Trung bình | Đã ghi rõ ở §2.5 — chỉ dùng cho chữ lớn |
| Fraunces là font biến thiên, dung lượng lớn | Thấp | Subset `latin` + `vietnamese`, chỉ nạp weight thật dùng |

---

## 10. Sau vòng này

Thứ tự đề xuất, mỗi mục là một vòng riêng:

1. **Khối tin cậy** — MST, pháp nhân, bản đồ, Zalo OA (trả nợ D-8)
2. **Trang Rooms + RoomDetail** — 7 hạng phòng, dùng lại token đã chốt
3. **Nối luồng đặt phòng** — login OTP, giỏ hàng, thanh toán (đã có sẵn ở app)
4. **Blog Nam Du** — viết lại 11 bài crawl thành nội dung riêng (R9/F8)
5. **Animation đồng bộ** — trả nợ D-5, làm một lượt cho cả trang
