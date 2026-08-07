# CMS Design System — `packages/cms-ui`

**Ngày:** 2026-08-07
**Trạng thái:** Đã duyệt hướng, chờ duyệt spec
**Phạm vi đợt này:** Dashboard (`/admin`) + Danh sách đơn (`/admin/orders`)

---

## 1. Vì sao làm việc này

CMS hiện tại bắt chước *chữ* của Sales Cloud (giữ nguyên "WHAT MOVED FOR ME",
"Rhythm today" tiếng Anh trộn tiếng Việt) nhưng bỏ mất *cấu trúc* làm nên độ
clean của nó. Đồng thời khảo sát 14 màn admin cho thấy code đang lặp nặng:

| Pattern | Số màn lặp | Bằng chứng |
|---|---|---|
| Badge chấm + chữ + width cố định | 6 màn / ~10 chỗ | mỗi màn tự khai `toneMap` + `dotMap`, bảng màu giống hệt |
| Page header (title + count pill) | 7 màn | class **giống hệt nhau** từng ký tự |
| KPI card | 6 màn | đã bị tách thủ công 2 lần độc lập (`KpiCard` ở `settings/rooms`, `TicketKpi` ở `settings/tickets`) |
| Table container | 7 màn | |
| Filter bar viết tay | 5 màn | trong khi 3 màn khác đã dùng `Toolbar` của `@repo/ui` |
| Pagination viết tay | 3 màn | trong khi `DataTable` đã có prop `pagination` |

`cms-ui` **không phải thêm một tầng trừu tượng** — nó thu hồi code đang lặp.
Đây là lý do chính; việc trông giống ảnh mẫu là lý do phụ.

### Quyết định đã chốt với chủ dự án

| # | Quyết định | Lý do |
|---|---|---|
| 1 | CMS có design system **riêng**, không lấy màu theme | CMS dùng chung nhiều sản phẩm; `app-flows.md §F5` đã chốt "một layout admin duy nhất, không mang bản sắc theme" |
| 2 | Đặt ở `packages/cms-ui/` | Chỉ hình thức này mới khiến "dùng chung nhiều sản phẩm" thành sự thật thay vì lời hứa. `C10` cấm copy |
| 3 | Token theo **hệ 8pt**, giữ tỷ lệ của ảnh | `P0` bắt mọi giá trị qua token, `P5` cấm spacing ngoài thang. Hệ có 37px/63px sẽ fail chính cổng chất lượng của repo |
| 4 | Accent **xanh `#2563EB`** như ảnh | Chủ dự án chốt. Kéo theo: phải sửa CTA/badge/focus ring ở 8 màn còn lại |
| 5 | Đợt này chỉ dashboard + danh sách đơn | "Triển khai nhanh"; duyệt ngôn ngữ thiết kế trên 2 màn trước khi nhân rộng |
| 6 | `orders/new` + `orders/[id]` để ticket riêng | 1843 dòng viết bằng inline `style`, tách hoàn toàn khỏi hệ Tailwind |

### Ngoài phạm vi (ghi rõ để không hiểu nhầm là bỏ sót)

- `orders/new/page.tsx` (593 dòng) và `orders/[id]/page.tsx` (1250 dòng) —
  viết bằng inline `style` + CSS vars. Ticket riêng.
- Tinh chỉnh layout bên trong 8 màn còn lại. Đợt này chỉ đảm bảo **không vỡ**
  và đổi accent amber → xanh.
- Inventory matrix, housekeeping grid, promotions calculator — đặc thù 1 màn,
  để nguyên.

---

## 2. Kiến trúc package

```
packages/cms-ui/
  package.json
  src/
    tokens.css          nguồn sự thật DUY NHẤT của mọi giá trị
    AppShell.tsx        rail trái + header + tab bar
    PageShell.tsx       khung trang, thay 3 biến thể space-y đang lẫn lộn
    PageHeaderBar.tsx   kicker + title + CountPill + actions
    MetricStrip.tsx     dải KPI liền, vách ngăn dọc
    KpiCard.tsx         một ô KPI (có biến thể clickable cho housekeeping)
    FilterBar.tsx       pill filter inline
    DataGrid.tsx        bảng theo §F6
    DotBadge.tsx        chấm màu + chữ + width cố định
    InlineAlert.tsx     role="alert" aria-live="polite" mặc định
    index.ts
```

### Phụ thuộc

```
cms-ui  →  ui  →  utils
```

**Không** import `core`, `domain-*`, `theme-*`. Qua phép thử `R15`: không file
nào trong package nhắc "phòng", "đơn đặt", "tồn kho" — chỉ có `label`, `value`,
`tone`, `count`.

### Cơ chế then chốt: ghi đè token trong phạm vi `[data-cms]`

`DataTable` của `@repo/ui` đã đọc token qua inline style:
`var(--border)`, `var(--text-muted)`, `var(--surface-alt)`, `var(--space-3)`.

Nên `tokens.css` ghi đè các biến này **trong `[data-cms]`**, không phải `:root`:

```css
[data-cms] {
    --border: var(--cms-border);
    --text-muted: var(--cms-text-muted);
    --surface-alt: var(--cms-bg-subtle);
    /* … */
}
```

Kết quả: `DataTable`, `Button`, `Badge` sẵn có **tự đổi diện mạo** khi nằm trong
shell CMS, không sửa một dòng nào trong `@repo/ui`, không ảnh hưởng trang client.

Đây là lý do 8 màn còn lại thừa hưởng diện mạo mới gần như miễn phí.

### Ba chỗ `@repo/ui` KHÔNG đọc token → lý do `DataGrid` tồn tại

| Chỗ | Class cứng hiện tại |
|---|---|
| Wrapper `DataTable` | `bg-white border-slate-200 rounded-lg shadow-sm` |
| Row hover | `hover:bg-slate-50/70` |
| Padding hàng | `8px 12px` (ảnh mẫu hàng cao 48px, thoáng hơn) |

`DataGrid` chỉ sửa đúng ba chỗ này — **không** thay thế `DataTable`.

---

## 3. Thang token (hệ 8pt)

Trích từ ảnh 2048px → quy về 1440px → làm tròn vào lưới 8pt.

### Kích thước

| Vai trò | Ảnh (quy 1440) | Token | Giá trị |
|---|---|---|---|
| Rail trái | ~63px | `--cms-rail-w` | **64px** |
| Header app | ~52px | `--cms-header-h` | **48px** |
| Tab bar | ~37px | `--cms-tabbar-h` | **40px** |
| Hàng bảng | ~48px | `--cms-row-h` | **48px** |
| Gap lưới | ~18px | `--cms-gap` | **16px** |
| Padding trang | ~24px | `--cms-pad` | **24px** |

### Chữ

| Vai trò | Token | Giá trị | Ghi chú |
|---|---|---|---|
| Số KPI | `--cms-text-metric` | **36px / 400** | **font-weight 400 — không đậm.** Đây là chi tiết làm nên vẻ clean của ảnh |
| Nhãn KPI | `--cms-text-label` | **12px / 600** | uppercase, `letter-spacing: .06em` |
| Tiêu đề trang | `--cms-text-title` | **24px / 400** | |
| Body / bảng | `--cms-text-body` | **13px / 400** | |
| Phụ, metadata | `--cms-text-meta` | **11px / 400** | |

### Màu

Nền **trắng**, phân tách bằng **đường kẻ 1px** thay vì shadow. Đây là khác biệt
lớn nhất so với code hiện tại (`bg-slate-100` + card shadow lồng nhau) và là
nguồn gốc trực tiếp của cảm giác "clean".

```css
--cms-bg          #FFFFFF   nền trang
--cms-bg-subtle   #F8FAFC   header bảng, vùng nhấn nhẹ
--cms-border      #E5E7EB   đường kẻ 1px — thay cho mọi shadow trang trí
--cms-text        #111827
--cms-text-muted  #6B7280
--cms-accent      #2563EB   xanh, đúng ảnh mẫu
--cms-accent-weak #EFF6FF   nền tab active, nền badge info
```

Tone trạng thái (thay 6 bảng `toneMap` đang lặp ở 6 màn):

```
emerald · blue · violet · amber · rose · slate
```

Mỗi tone 3 biến: `--cms-tone-{x}` (chữ), `--cms-tone-{x}-bg`, `--cms-tone-{x}-dot`.

Shadow chỉ **2 bậc**, chỉ dùng cho lớp nổi thật (dropdown, modal) — không dùng
cho card tĩnh. Đúng `P7`.

### Số token màu

Đếm: 6 nền/chữ + 2 accent + 18 tone = 26. Vượt trần 12 của `P2`.
**Giải trình:** trần `P2` áp cho theme marketing. CMS cần đủ 6 tone trạng thái
vì `F6` bắt badge phải phân biệt được ≥6 trạng thái đơn hàng
(`pending_payment / confirmed / checked_in / checked_out / cancelled / no_show`).
Ghi vào PR như một ngoại lệ có lý do, không im lặng bỏ qua.

---

## 4. Layout Dashboard

Theo đúng thứ tự dọc của ảnh:

```
┌──────────────────────────────────────────────────────────────┐
│ rail │ header 48px: logo · search · role · avatar            │
│ 64px ├──────────────────────────────────────────────────────┤
│      │ tab bar 40px: Dashboard Đơn Tồn kho Buồng Khách Setup│
│      ├──────────────────────────────────────────────────────┤
│      │ PageHeaderBar: kicker + "Tổng quan vận hành" + CTA   │
│      ├──────────────────────────────────────────────────────┤
│      │ FilterBar: pill inline, KHÔNG khung bao              │
│      ├──────────────────────────────────────────────────────┤
│      │ MetricStrip — dải LIỀN, vách ngăn dọc 1px            │
│      │  CÔNG SUẤT │ CHECK-IN │ CHECK-OUT │ CHỜ CỌC │ SẠCH   │
│      ├──────────────────────────────────────────────────────┤
│      │ ┌─ Nhịp hôm nay ────────────┬─ Vừa diễn ra ────────┐ │
│      │ │  DataGrid (2/3)           │  dòng sự kiện (1/3)  │ │
│      │ └───────────────────────────┴──────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### Bốn khác biệt so với code hiện tại

1. **Nền trắng**, bỏ `bg-slate-100` + bỏ card lồng card
2. **MetricStrip là một dải liền** chia bằng vách ngăn dọc — không phải 5 card
   rời có gap
3. **FilterBar không có khung bao** — pill nằm thẳng trên nền trang
4. **Số KPI `font-weight: 400`** — hiện tại đã đúng, nhưng đang nằm trong card
   có shadow nên mất hiệu quả

### Ngôn ngữ — sửa lỗi hiện tại

Code đang trộn tiếng Anh vào giao diện tiếng Việt: `WHAT MOVED FOR ME`,
`Rhythm today`, `OCCUPANCY RATE`, `OPERATIONS CONSOLE — TODAY OVERVIEW`.

Vi phạm `C7`/`FE6` (song ngữ ở mọi chuỗi khách thấy). Thay bằng:

| Hiện tại | Thay bằng |
|---|---|
| `OPERATIONS CONSOLE — TODAY OVERVIEW` | `VẬN HÀNH — HÔM NAY` |
| `Occupancy overview` | `Tổng quan vận hành` |
| `WHAT MOVED FOR ME` | `VỪA DIỄN RA` |
| `Rhythm today` | `Nhịp hôm nay` |
| `OCCUPANCY RATE` | `CÔNG SUẤT PHÒNG` |

Mọi chuỗi qua `tr()` với `{vi, en}`.

### Dữ liệu thật vs dữ liệu giả — bắt buộc sửa

Code hiện tại có 4 chỗ bịa số, phải xử lý:

| Chỗ | Hiện tại | Xử lý |
|---|---|---|
| `ACTIVITY_FEEDS` | 4 sự kiện hardcode | Đọc từ `ActivityLog` thật; chưa có thì hiện trạng thái rỗng theo `FE7` |
| `▲ 12% vs tuần trước` | Hardcode | Tính thật hoặc bỏ |
| `10/15 phòng` sạch | Hardcode | Đọc từ housekeeping store |
| `unitNumber` | `units[idx % units.length]` — **gán phòng giả** | Bỏ. Vi phạm `B0`: `RoomUnit` do lễ tân gán lúc check-in, không phải suy ra từ chỉ số mảng |

`FE13`/`P10` cấm bịa khan hiếm; bịa số vận hành cũng cùng bản chất — admin ra
quyết định trên số đó.

---

## 5. Layout Danh sách đơn

Theo `§F6`. Cột đọc trái→phải: **định danh → chủ thể → nội dung → thời gian →
tiền → trạng thái → thao tác**.

| Cột | Nội dung |
|---|---|
| ☐ | checkbox chọn nhiều |
| MÃ ĐƠN | mã đậm + ngày tạo nhạt (ô hai dòng) |
| KHÁCH HÀNG | tên đậm + SĐT nhạt |
| HẠNG PHÒNG | tên hạng + số đêm |
| NHẬN – TRẢ | `20/8 – 22/8` |
| TỔNG TIỀN | canh phải, `tabular-nums`, dòng phụ "còn thiếu" |
| TRẠNG THÁI | `DotBadge` — chấm **+ chữ** |
| THAO TÁC | icon SVG có `aria-label` đầy đủ ("Xem đơn ĐH-26-0042") |

Bắt buộc theo `F6`: tiêu đề + đếm, ô tìm kiếm nói rõ tìm được gì, bộ lọc +
nút Đặt lại, phân trang "Hiển thị x–y trong z", trạng thái rỗng nói rõ phải làm
gì tiếp, mobile <640px đổi sang thẻ (**cấm** cuộn ngang bảng).

Xoá pagination viết tay (3 màn đang lặp), dùng prop `pagination` của bảng.

---

## 6. Thứ tự thi công

| # | Việc | Vì sao thứ tự này |
|---|---|---|
| 1 | Scaffold `packages/cms-ui` + `tokens.css` | Token trước → bước 6 (lan 8 màn) thành thao tác rẻ |
| 2 | Khai `transpilePackages` + `@source` | **Quên bước này = mất sạch style mà build vẫn xanh** (`R14`) |
| 3 | Component nền: `DotBadge`, `KpiCard`, `MetricStrip`, `PageHeaderBar`, `FilterBar`, `DataGrid` | |
| 4 | `AppShell` + dashboard | Màn mẫu để chủ dự án duyệt ngôn ngữ thiết kế |
| 5 | Danh sách đơn | |
| 6 | Lan accent amber → xanh ở 8 màn còn lại | Sau khi hình khối đã được duyệt |
| 7 | Kiểm 8 màn không vỡ + `pnpm check` + `build:safe` | `C13` bắt build xanh cả app |

Bước 2 là bước dễ quên nhất và hậu quả im lặng — ghi riêng thành một dòng.

---

## 7. Định nghĩa xong

- [ ] `pnpm lint` + `pnpm typecheck` sạch, không `any`
- [ ] `pnpm build:safe` xanh — cả 4 theme, không riêng phần đang sửa
- [ ] `cms-ui` không import `core`/`domain-*`/`theme-*` (`R1`)
- [ ] Không file nào trong `cms-ui` nhắc từ vựng ngành (`R15`)
- [ ] Không hex ngoài `tokens.css` (`D0`)
- [ ] Không spacing ngoài thang 8pt (`P5`)
- [ ] Mọi component tương tác đủ 7 trạng thái (`D3`)
- [ ] `focus-visible` không bao giờ `outline: none`; tương phản ≥3:1
- [ ] Badge trạng thái có **chữ**, không chỉ màu (`D4`)
- [ ] Mọi chuỗi `{vi, en}` (`C7`)
- [ ] Bảng có `<th scope="col">`, `aria-sort`, trạng thái rỗng nói rõ việc tiếp
- [ ] Mobile 375px: bảng thành thẻ, không cuộn ngang
- [ ] 8 màn còn lại mở được, không vỡ layout
- [ ] Không còn số bịa trên dashboard

### Lệnh tự kiểm

```bash
# hex trong .tsx (mọi hex phải nằm ở tokens.css) — phải rỗng
grep -rn "#[0-9a-fA-F]\{3,8\}" packages/cms-ui/src --include="*.tsx"

# cms-ui phạm ranh giới — phải rỗng
grep -rn "@repo/core\|@repo/domain\|@repo/theme" packages/cms-ui/src

# từ vựng ngành trong tầng nền — phải rỗng
grep -rniE "booking|room|guest|hotel|phòng|đơn hàng" packages/cms-ui/src

# outline none — phải rỗng
grep -rn "outline:\s*none\|outline-none" packages/cms-ui/src
```

---

## 8. Rủi ro

| Rủi ro | Xử lý |
|---|---|
| Quên `@source` → mất sạch style, build vẫn xanh | Bước 2 tách riêng; kiểm bằng mắt ngay sau khi scaffold |
| Ghi đè token rò sang trang client | Ghi đè trong `[data-cms]`, **không** `:root`. Kiểm `/h1` sau khi xong |
| Đổi amber → xanh làm vỡ màn chưa kiểm | Bước 6 sau khi duyệt hình khối; mở đủ 8 màn ở bước 7 |
| `DataGrid` lệch `DataTable` theo thời gian | `DataGrid` **bọc** `DataTable`, chỉ ghi đè 3 chỗ; không fork |
