# Rules — Premium Design Quality Gate v1.0

> **Một website chỉ được coi là "premium" khi vượt qua toàn bộ các tiêu chí
> dưới đây.**

Đây là **cổng chất lượng**: một theme/trang chưa qua đủ P0–P13 thì chưa được
coi là xong, dù lint sạch và build xanh.

Mọi tiêu chí ở đây đều phải **kiểm chứng được**. Cấm dùng "đẹp", "sang",
"cao cấp" làm lý lẽ nghiệm thu — nếu không nêu được cách kiểm thì mục đó chưa
phải luật.

### Vì sao tiền tố `P`, không phải `D`

`design-tokens.md` đã chiếm nhãn **D0–D6** cho luật token. File này dùng **P**
để hai bộ không đè lên nhau. Khi trích dẫn: `D1` = tên biến CSS,
`P1` = Design DNA.

### Quan hệ với các rules khác

File này KHÔNG thay thế [design-tokens.md](./design-tokens.md),
[app-flows.md](./app-flows.md) hay [architecture.md](./architecture.md) — nó
là tầng "hệ thống thiết kế + cảm giác cao cấp" đặt lên trên.

**Xung đột thì luật cũ thắng**: token D2 đã chốt, section id R7 đã chốt,
format bảng F6 đã chốt.

---

## K0 — Giao thức đặt câu hỏi TRƯỚC khi phác thảo

### K0.0 — Brief & kickoff

Mỗi khách một brief tại `resources/docs/briefs/<tên-khách>.md` (mẫu:
`_template.md`). Khi user gõ *"Khởi động theo brief …"* hoặc đưa kickoff
inline, phải theo các quy tắc:

- **Website hiện tại** của khách = *hợp đồng chức năng* — remake phải đầy đủ
  chức năng như nó (teardown xuất parity checklist); **website recommend** =
  *tham chiếu thẩm mỹ*. Không rõ URL nào vai nào → hỏi, không đoán.
- **Folder crawl** quy ước tại `resources/scripts/crawl/output/<tên-khách>/`.
  Chưa có / không rõ → **hỏi user** crawl site nào hay nhận link bản có sẵn —
  không tự ý crawl.
- Review/comment của khách hàng cuối **không crawl** (chính sách nền tảng) —
  social proof chỉ lấy từ tư liệu khách cung cấp, không bịa số liệu.
- Trường brief ghi `chưa có` → hỏi đúng trường đó; trường đã điền không hỏi lại.

Hướng dẫn vận hành đầy đủ cho người dùng: `resources/docs/CLAUDE-GUIDE.md`.

### K0.1 — 5 câu bắt buộc

Tự động hoá không có nghĩa là đoán mò. Trước khi `conversion-blueprint` xuất
tài liệu, phiên chính **bắt buộc hỏi user** (AskUserQuestion) những điều dưới
đây NẾU chưa có trong context/teardown — mỗi mục một câu, có phương án gợi ý:

| # | Phải làm rõ | Vì sao không được tự bịa |
|---|---|---|
| Q1 | **Design direction** khách muốn: editorial / dark-luxury / tropical-minimal / retro-modern…? (kèm mẫu tham chiếu nếu có) | P1 — Design DNA là quyết định của khách trả tiền, không phải của AI |
| Q2 | **Nguồn ảnh**: khách có bộ ảnh chụp thật chưa? Nếu chưa — dùng ảnh sinh theo art direction hay chờ chụp? | P6 + R9 — ảnh crawl không được lên production |
| Q3 | **Nội dung thật**: tên phòng, giá, chính sách đã có bản chính thức chưa hay dùng placeholder có đánh dấu? | R9/F8 — nội dung crawl làm hại SEO chính mình |
| Q4 | **Mức độ chuyển động**: khách thích tĩnh sang trọng hay có scroll effect? | P8 — motion là thứ dễ làm lố nhất |
| Q5 | Có **brand asset** sẵn (logo, font đã mua, màu nhận diện) phải tôn trọng không? | P2/P3 — font display có thể tốn license |

Trả lời xong mới chạy blueprint. Câu nào user đã trả lời ở phiên trước / đã
ghi trong teardown thì **không hỏi lại** (nguyên tắc CLAUDE.md).

---

## P0 — Design System Integrity (nền tảng)

Website phải được xây trên **một Design System thống nhất**, không phải tập
hợp component rời rạc.

### PASS

Không hardcode bất kỳ thứ nào sau đây — tất cả đi qua Design Token:

| Nhóm | Ví dụ token |
|---|---|
| Màu | `--color-brand`, `--color-surface-raised` |
| Spacing | `--space-1 … --space-8` |
| Radius | `--radius-xs … --radius-xl` |
| Shadow | `--shadow-1`, `--shadow-2` |
| Typography | `--font-size-*`, `--font-weight-*`, `--line-height-base` |

### FAIL

```css
/* component A */  border-radius: 18px;
/* component B */  border-radius: 16px;
/* component C */  border-radius: 20px;
/* component D */  border-radius: 22px;
```

Bốn giá trị cho cùng một vai trò = chưa có hệ thống.

### Cách kiểm

```bash
# hex nằm ngoài tokens.css → FAIL (luật D0)
grep -rn "#[0-9a-fA-F]\{3,8\}" packages/theme-*/src --include="*.css" \
  --include="*.tsx" | grep -v "tokens.css"

# px thô cho radius/spacing/font-size ngoài tokens.css → FAIL
grep -rn "border-radius:\s*[0-9]" packages/theme-*/src | grep -v "tokens.css"
```

Kết quả rỗng = PASS.

---

## P1 — Design DNA

Website phải có **một Point of View duy nhất**.

Không được "vừa Booking vừa Apple vừa Luxury vừa Tropical".

### Blueprint bắt buộc khai đủ 5 khối

```
Theme Name
One Sentence
3 Keywords
Do
Don't
```

Ví dụ:

```
Theme Name:    Sunlit Coastal Booking

One Sentence:  Trang đặt phòng sáng, thật, thư giãn — ảnh biển tự nhiên
               dẫn dắt, chữ và khoảng trắng làm phần còn lại.

3 Keywords:    Bright · Honest · Relaxing

Do:
  ✓ nhiều khoảng trắng
  ✓ ảnh biển thật, ánh sáng ban ngày
  ✓ card nổi nhẹ (shadow level 1)

Don't:
  ✗ Glassmorphism
  ✗ Dark mode
  ✗ Gradient loè loẹt
```

### Cách kiểm

- Chụp 3 section bất kỳ, bỏ logo → vẫn nhận ra cùng một website. Nếu một
  section cắm sang website khách sạn bất kỳ mà không lạc lõng → đang là
  template, **FAIL**.
- 4 theme H1–H4 phải có 4 Design DNA **phân biệt được bằng mắt trong 3 giây**
  trên trang hub — đây chính là sản phẩm đang bán ("N giao diện").
- Mọi quyết định thiết kế sau đó đối chiếu với khối `Don't`. Có một thứ vi
  phạm `Don't` mà vẫn ship → **FAIL**.

---

## P2 — Color Discipline

Không phải palette đẹp. Mà là palette **được kiểm soát**.

### Cấu trúc bắt buộc

| Vai trò | Số lượng |
|---|---|
| Primary | 1 |
| Secondary | 1 |
| Accent | 1 |
| Neutral | 2–4 |
| Semantic | Success · Warning · Danger · Info |

**Tổng không quá 12 token màu.**

### Accent Ratio — 60 / 30 / 10

```
60%   Background
30%   Neutral
10%   Accent
```

Accent xuất hiện khắp nơi → **FAIL**. Accent hết là accent khi nó ở mọi chỗ.

### CTA

Toàn site **chỉ một màu CTA chính**. Nút phụ dùng ghost/outline, không đổi màu
để "cho khác".

### Cách kiểm

```bash
# đếm token màu trong tokens.css
grep -c "^\s*--color-" packages/theme-h1/src/tokens.css
```

> 12 → giải trình từng token thừa hoặc cắt bớt.

Chụp một viewport, đo diện tích accent bằng mắt — vượt ~10% → xem lại.

---

## P3 — Typography System

Typography tạo hierarchy. **Không phải màu.**

### Rule

Tối đa **2 font family**:

```
Display   1
Body      1
```

### Thang cỡ đóng — không tự đặt heading

Chỉ được dùng các bậc sau, khai trong `tokens.css`:

```
Display XXL
Display XL
Display L
H1
H2
H3
Body
Small
Caption
```

FAIL khi thấy: `36 / 39 / 42 / 43 / 47 …` — cỡ "một lần dùng" nằm ngoài thang.

### Tiếng Việt

Bắt buộc **đầy đủ glyph tiếng Việt**. Dấu không vỡ, không fallback giữa câu.

### Cách kiểm

- Render đoạn `"Đặt phòng nghỉ dưỡng — ưu đãi mùa hè, giữ chỗ trước 45 ngày"`
  ở mọi bậc chữ, zoom 200%, soi dấu `ữ ằ ợ ẫ ỹ`.
- `font-display: swap` (bắt buộc).
- Hierarchy phải đứng vững khi đổi toàn bộ chữ về một màu — nếu mất hierarchy
  thì hierarchy đang do màu gánh, **FAIL**.

---

## P4 — Visual Hierarchy

Một viewport **chỉ có 1 điểm nhìn chính**.

### Squint Test

Nheo mắt nhìn viewport. Nếu không biết nhìn đâu → **FAIL**.

### 5 Second Test

Cho người xem 5 giây, rồi hỏi:

```
Website bán gì?
CTA là gì?
Điểm mạnh là gì?
```

Trả lời sai bất kỳ câu nào → **FAIL**.

### Cách kiểm

Ghi vào PR: ai làm test, viewport nào, câu trả lời nhận được. Không tự chấm
"đạt" mà không có người thứ hai.

---

## P5 — Layout Rhythm

Khoảng trắng tạo ra sự cao cấp. Không phải decoration.

### Section spacing — thang đóng

```
80 · 96 · 120 · 160
```

FAIL: `72 / 111 / 147 …`

### Card spacing — 8pt Grid

Mọi padding/gap nội bộ là bội số của 8 (cho phép 4 ở cấp nhỏ nhất).

### Không "wall of text"

Một viewport không được là bức tường chữ phẳng. Section dài phải có nhịp:
xen kẽ layout, ảnh, số liệu, khoảng nghỉ.

### Cách kiểm

```bash
# spacing thô ngoài thang
grep -rnE "(padding|margin|gap):[^;]*[0-9]{2,3}px" packages/theme-*/src \
  | grep -v "tokens.css"
```

Cuộn toàn trang ở 1440px và 390px — nhịp section phải cảm nhận được, không
đều đều một mạch.

---

## P6 — Photography Direction

Ảnh phải cùng **một Art Direction**. Không phải "mỗi tấm đẹp riêng lẻ".

### Hero

Hero bán **Experience**, không bán **Room**.

Với Nam Du: biển, tàu cao tốc, bình minh trên đảo — không phải stock
"hotel room" vô danh.

### Gallery

Không trộn nguồn:

```
Drone · Stock · iPhone · DSLR
```

Trộn 4 nguồn trong một gallery = **FAIL** ngay cả khi từng tấm đẹp.

### Tone

Toàn bộ ảnh đồng nhất về:

```
Exposure · Temperature · Contrast · Saturation
```

### Crop

Không cắt **mặt · tay · chân**.

### Ràng buộc bản quyền (R9)

Ảnh crawl (`thenamduhill`, `Travlla`) **tuyệt đối không lên production**.
Ưu tiên: ảnh chụp thật của khách > ảnh sinh đúng art direction > curation chặt tay.

### Cách kiểm

Xếp toàn bộ ảnh dùng trong trang thành một contact sheet, nhìn một lượt — có
tấm nào "nhảy tông" là thấy ngay. Mọi ảnh có `alt` song ngữ (D4).

---

## P7 — Component Language

Card · Button · Input · Modal · Badge phải cùng một "ngôn ngữ".

### Radius

Radius `24` thì **mọi component 24**. Không mỗi chỗ một kiểu.

### Shadow

Đúng **2 bậc**:

```
Level 1
Level 2
```

Không có 5 shadow khác nhau.

### Icon

**1 style** — Outline **hoặc** Filled. Không trộn.

Icon là SVG, không dùng emoji trong sản phẩm mới (D5).

### 7 trạng thái (kế thừa D3 — bắt buộc)

```
default · hover · focus-visible · active · disabled · loading · error
```

Thiếu bất kỳ trạng thái nào = chưa xong.

### Cách kiểm

Dựng một trang `/_kitchen-sink` (dev-only) render mọi component ở mọi trạng
thái cạnh nhau. Nhìn một màn hình là thấy component nào lạc ngôn ngữ.

---

## P8 — Motion Design

Motion không để trang trí. Motion để **dẫn mắt**.

### Câu hỏi bắt buộc

Mỗi animation phải trả lời được:

```
Vì sao animation này tồn tại?
```

Không trả lời được → **xoá**.

### Motion Budget

Một viewport **không quá 2 animation chính**.

### Duration

| Loại | Khoảng |
|---|---|
| Hover | 150–250ms |
| Page transition | 300–500ms |

Lấy từ `--motion-*`, không viết số thô.

### Reduced Motion

`prefers-reduced-motion: reduce` phải PASS — tắt hết chuyển động không thiết yếu.

### Cấm

"AOS fade-up slop" gắn đại trà mọi section. Nghi ngờ thì bỏ hiệu ứng.

### Cách kiểm

Blueprint liệt kê từng animation kèm một dòng lý do. Đếm animation trên
viewport đông nhất — vượt 2 là cắt.

---

## P9 — Mobile-first Design

Không phải responsive. Mà là **thiết kế riêng**.

Mỗi section bắt buộc khai:

```
Desktop
   ↓
Mobile        ← khác biệt CÓ CHỦ ĐÍCH
```

### Ví dụ đúng

| Desktop | Mobile |
|---|---|
| 4 card hàng ngang | Carousel |
| Booking form bên hero | Sticky Bottom Sheet |
| Bảng dữ liệu | Thẻ (F6 — cấm cuộn ngang bảng) |

### FAIL

Chỉ `flex-direction: column`.

### Ràng buộc chạm

- CTA ≥ **44px**
- Mọi target ≥ **24px** (D4 / WCAG 2.2 §2.5.8)
- Hero mobile: thông điệp + ô tìm nằm **trong viewport đầu**, không bắt cuộn
  mới thấy

### Cách kiểm

Blueprint phải có cột "Mobile" cho **từng** section. Section nào ghi
"stack dọc" mà không nói gì thêm → chưa thiết kế.

---

## P10 — Conversion-first Design

Website đẹp không có nghĩa website bán được.

| Luật | |
|---|---|
| Hero | đúng **1 CTA** |
| Mỗi section | không quá **1 CTA chính** |
| Booking | **luôn nhìn thấy** (sticky bar / bottom sheet) |
| Trust | above the fold |
| Review | đặt gần CTA |
| Availability | nếu **có dữ liệu thật**: "Chỉ còn 3 phòng" |

> ⚠️ `Only 3 rooms left` chỉ được hiện khi `availableUnits` là **số thật** từ
> `Inventory` (booking-domain §B1). **Cấm bịa khan hiếm** — đó là dark pattern
> và làm mất niềm tin của chính khách trả tiền.

### Cách kiểm

Đi hết luồng đặt phòng trên mobile, ghi lại: ở mỗi viewport có nhìn thấy lối
vào booking không? Có viewport nào 2 CTA cùng cấp không?

---

## P11 — Premium Feeling

Đây là thứ khó nhất. Không đo bằng pixel — đo bằng 5 phát biểu **có thể phản
chứng**:

| Tiêu chí | Nghĩa là | Phản chứng (FAIL khi…) |
|---|---|---|
| **Calm** | Không ồn | nhiều thứ tranh nhau gây chú ý cùng lúc |
| **Confidence** | Không cần nhiều badge để chứng minh | rải badge "Best!", "Hot!", "#1" để tự trấn an |
| **Restraint** | Không dùng hiệu ứng để gây ấn tượng | hiệu ứng tồn tại vì "trông xịn", không vì dẫn mắt |
| **Editorial** | Có khoảng thở, có nhịp, có điểm nghỉ | cuộn liên tục không có chỗ mắt dừng |
| **Consistency** | Như được thiết kế trong cùng một ngày bởi cùng một designer | có section mang cảm giác copy từ template khác |

### Cách kiểm

Người thứ hai xem toàn trang, chấm từng dòng PASS/FAIL kèm một câu lý do. Ghi
vào PR. Không tự chấm một mình.

---

## P12 — Pixel Quality

Phần phân biệt designer giỏi với designer trung bình.

| Kiểm | Yêu cầu |
|---|---|
| Zoom 200% | không vỡ layout, không tràn chữ |
| Baseline | thẳng hàng giữa các cột |
| Alignment | mép trái/phải các khối thẳng nhau |
| Padding | đều, không lệch 1–2px |
| Border | không lệch, không double-border chỗ giáp nhau |
| Icon | căn giữa quang học trong khung |
| Typography | không orphan (một từ rơi xuống dòng cuối) |

### Cách kiểm

- Bật `outline: 1px solid red` toàn cục (dev-only) → lệch lộ ra ngay.
- Zoom trình duyệt 200% và 400%, cuộn hết trang.
- Đọc lại mọi heading: có heading nào rớt một từ xuống dòng riêng không.

---

## P13 — Luxury Test (bài kiểm cuối)

Bài kiểm cuối cùng **trước khi merge**.

Bỏ toàn bộ:

- animation
- hình nền
- ảnh hero

Chỉ còn:

- typography
- spacing
- layout
- màu

**Nếu website vẫn tạo cảm giác cao cấp → PASS.**

**Nếu bỏ ảnh đẹp đi mà giao diện trở nên nhạt và rẻ tiền → FAIL.**

### Cách kiểm

Thêm một query param dev-only (ví dụ `?naked=1`) hoặc một class trên `<html>`
tắt `background-image`, `animation`, `transition` và ẩn ảnh hero. Chụp màn hình
bản "naked" **đính vào PR**. Đây là ảnh chứng minh, không phải tuỳ chọn.

---

## P15 — Readability & Information Clarity Gate (Độ dễ đọc & Rõ ràng thông tin)

> **BẮT BUỘC:** Website không được chỉ "đẹp screenshot" như sản phẩm triển lãm Behance. Độ dễ đọc và khả năng hành động kinh doanh phải đứng song song với tính thẩm mỹ.

### Tiêu chí kiểm soát:

1. **Contrast độc lập với ảnh nền (WCAG AA ≥ 4.5:1):**
   - CẤM đè chữ trắng/xám trực tiếp lên ảnh sáng hoặc ảnh biến đổi mà không có container nền tối/sáng vững chắc (Solid card hoặc gradient scrim opacity ≥70%).
   - Tương phản chữ thân (`--color-text-primary`) và chữ phụ (`--color-text-secondary`) trên nền trang phải đạt **≥ 4.5:1** (đo kỹ bằng công cụ WCAG).
2. **5-Second Scanability Test:**
   - Trong vòng ≤ 5 giây nhìn vào viewport, người dùng phải xác định ngay lập tức: **Tiêu đề chính là gì, Giá phòng từ bao nhiêu, và Nút hành động (CTA) ở đâu**.
3. **Reading Comfort (Độ thoải mái khi đọc):**
   - Chiều rộng dòng chữ thân: 65–75 ký tự (`max-width: 65ch`). Line-height: 1.6–1.65.
   - Người dùng đọc liên tục 2–3 phút không mỏi mắt, không vỡ dấu tiếng Việt.
4. **Information Density Balance (Độ dày thông tin):**
   - Card phòng & Form phải hiển thị đủ thông số ra quyết định (giá, sức chứa, diện tích, chính sách hủy 1 dòng), không giấu thông tin bắt người dùng phải đoán.

---

## Vị trí trong quy trình

```
Khách gửi mẫu / yêu cầu
  → ① website-teardown        (chấm mẫu của khách theo P0–P15 ở Lớp 5)
  → ② customer-mindset         (nỗi đau, lời từ chối)
  → K0: hỏi user các câu chưa rõ  ← CHỐT: không đoán
  → ③ conversion-blueprint     (blueprint có mục "P-check": tự đối chiếu P0–P15)
  → thực thi (frontend-design / ui-ux-pro-max / Figma nhận blueprint)
  → ④ P14 Auto-Visual Inspection: Chụp screenshot 1440px & 375px tự kiểm P0–P15
  → nghiệm thu: P0–P15 + tự kiểm của design-tokens.md
```

---

## Checklist nghiệm thu

| Mục | Tiêu chí | Pass |
|---|---|:--:|
| P0 | Design System Integrity | ☐ |
| P1 | Design DNA | ☐ |
| P2 | Color Discipline | ☐ |
| P3 | Typography System | ☐ |
| P4 | Visual Hierarchy | ☐ |
| P5 | Layout Rhythm | ☐ |
| P6 | Photography Direction | ☐ |
| P7 | Component Language | ☐ |
| P8 | Motion Design | ☐ |
| P9 | Mobile-first Design | ☐ |
| P10 | Conversion-first Design | ☐ |
| P11 | Premium Feeling | ☐ |
| P12 | Pixel Quality | ☐ |
| P13 | Luxury Test | ☐ |
| P14 | Automated Visual Audit (Desktop 1440px + Mobile 375px Screenshot) | ☐ |
| P15 | Readability & Information Clarity (WCAG AA + 5-sec Scanability) | ☐ |

### Bằng chứng bắt buộc đính vào PR

Không có bằng chứng = mục đó chưa PASS.

| Bằng chứng | Cho mục |
|---|---|
| Kết quả `grep` hex/px thô (rỗng) | P0, P2, P5 |
| Khối Design DNA 5 phần | P1 |
| Số token màu | P2 |
| Ảnh chụp text tiếng Việt zoom 200% | P3, P12 |
| Kết quả 5 Second Test (người thứ hai) | P4 |
| Contact sheet toàn bộ ảnh | P6 |
| Ảnh `/_kitchen-sink` đủ 7 trạng thái | P7 |
| Danh sách animation + lý do từng cái | P8 |
| Bảng Desktop→Mobile từng section | P9 |
| Ảnh chụp mobile luồng booking | P10 |
| Bảng P11 do người thứ hai chấm | P11 |
| Ảnh chụp bản `?naked=1` | P13 |
| Số Lighthouse (LCP < 2s), tương phản đo được | P0, P4, P12 |

---

## Định nghĩa "Premium"

Một website chỉ được coi là **Premium** khi:

- **Không có mục nào từ P0–P13 bị FAIL.**
- Không đạt bằng cách dựa vào ảnh đẹp, animation nhiều hay hiệu ứng phức tạp.
- Chất lượng đến từ **hệ thống thiết kế, tính nhất quán, hierarchy,
  typography, khoảng trắng và khả năng chuyển đổi** — để ngay cả khi bỏ toàn
  bộ hiệu ứng, giao diện vẫn giữ được cảm giác cao cấp.

Đây mới là khác biệt lớn nhất giữa một website "đắt tiền" và một website chỉ
"trông đẹp".
