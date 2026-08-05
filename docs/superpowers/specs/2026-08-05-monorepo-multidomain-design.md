# Thiết kế — Monorepo đa domain + pipeline thiết kế theme

> Ngày chốt: 2026-08-05 · Nhánh: `theme/namdu`
> Trạng thái: đã duyệt qua đối thoại, chờ user review file này

---

## 1. Vấn đề

Chủ repo đang làm việc quá thủ công: gọi tay từng agent, dựng tay từng theme.
Đồng thời `packages/` được chia sai, không chịu được mô hình thật của dự án.

### Mô hình thật (chủ repo phát biểu)

> Sẽ có **rất nhiều domain**. Một domain có **nhiều theme**. Các theme dùng
> **chung kiến trúc data**, riêng **style** của nó.

### Bằng chứng cấu trúc hiện tại không chịu được mô hình đó

Khảo sát 53 file, 13.495 dòng của `packages/core` + `packages/ui`:

| Package | Tổng | Thực chất |
|---|---:|---|
| `core` | 6.848 dòng | **96,6% là nghiệp vụ khách sạn.** Chỉ 236 dòng (3,4%) dùng chung được |
| `ui` | 6.647 dòng | **Không phải UI library.** 1.363 dòng primitive sạch + ~5.300 dòng app khách sạn đặt nhầm chỗ |

Vi phạm nặng nhất: `packages/ui/src/BookingCalendarModal.tsx` hard-code chuỗi
`'The Nam Du Hill (Ấp Củ Tron)'` và `'Tất cả 20 hạng phòng'` — **tên khách hàng
nằm trong package tên `ui`**. Thêm domain thứ hai là kéo theo cả cái đó.

Vi phạm có ghi chép: `packages/ui/src/index.ts` dòng 2 tự nhận *"primitive không
mang bản sắc thương hiệu"*, nhưng dòng 71–93 export 8 trang nghiệp vụ.

### Vì sao luật hiện hành không chặn được

`architecture.md` R1 cấm **import chéo** giữa các theme, nhưng **không cấm
copy-paste**. Hệ quả đo được: `theme-h1` 2.626 dòng → `theme-h2` 5.608 dòng.
Theme thứ hai gấp đôi theme đầu, trong khi kiến trúc đúng phải làm nó **mỏng dần**.

---

## 2. Nguyên tắc nền

> **Tầng nền không được biết domain nào tồn tại.**

Kiểm bằng một câu: *file này có nhắc khái niệm của một ngành cụ thể không?*
Không nhắc → tầng nền. Có nhắc → tầng domain.

Nguyên tắc này thay thế việc phải biết trước domain thứ hai. Thiết kế theo ví dụ
là sai với monorepo — nó phải chịu được domain mà hôm nay chưa ai biết tên.

---

## 3. Kiến trúc đích

```
packages/
  ┌─ TẦNG NỀN — không biết domain nào tồn tại ────────────────┐
  │  utils/            i18n, format, env, hook      ~250 dòng │
  │  ui/               13 primitive vô danh       ~1.360 dòng │
  │  ui-layout/        Shell, Header, Footer, Breadcrumbs,    │
  │                    Grid, Container, responsive card       │
  │                    → nhận brandName/navItems,             │
  │                      KHÔNG nhận PropertyData              │
  │  styling-tailwind/ preset Tailwind v4 + token bridge      │
  │  styling-css/      CSS variable thuần                     │
  └───────────────────────────────────────────────────────────┘
  ┌─ TẦNG DOMAIN — nghiệp vụ, không hình thức ────────────────┐
  │  domain-hotel/     types, pricing, promotion, booking,    │
  │                    availability, repository               │
  │    data/           seed Nam Du Hill                       │
  │    pages/          Checkout, Tours, Dining, Gallery…      │
  │  domain-<mới>/     ← sinh bằng /new-domain                │
  └───────────────────────────────────────────────────────────┘
  ┌─ TẦNG THEME — chỉ hình thức ──────────────────────────────┐
  │  theme-hotel-h1/ theme-hotel-h2/ …                        │
  └───────────────────────────────────────────────────────────┘
```

Quy ước tên: **phẳng**, tên package = tên thư mục.

### Đồ thị phụ thuộc

```
theme  →  domain  →  ui-layout  →  ui  →  utils
```

Ngang hàng không thấy nhau: `domain-hotel` không biết `domain-<mới>`,
`theme-h1` không biết `theme-h2`.

### Token bridge — hợp đồng chung cho mọi styling engine

```
theme/tokens.css   →  --t-brand: #1173B8            (nguồn duy nhất)
styling-tailwind   →  --color-brand: var(--t-brand) →  class "bg-brand"
styling-css        →  đọc thẳng var(--t-brand)
styling-mui (sau)  →  createTheme({ primary: … })
```

**Một nguồn màu, N cách tiêu thụ** — tinh thần "1 data, N render" áp vào tầng style.

Hệ quả: styling engine là **lựa chọn của theme**, khai trong `package.json` của
theme đó. App không biết, không quan tâm. Nếu nhồi `@theme` vào `app/globals.css`
thì mọi theme **buộc** phải dùng Tailwind — vi phạm R5 (thêm theme không được sửa
code sẵn có).

### Tái sử dụng khi thêm domain mới (ví dụ SaaS)

| Tầng | Tái dùng | Lý do |
|---|---|---|
| `utils` | ✅ 100% | `pick()`, `formatDate()` không biết gì về phòng hay subscription |
| `ui` 13 primitive | ✅ 100% | Button, Modal, DataTable, Field — SaaS dashboard cần y hệt |
| `ui-layout` | ✅ 100% | Khung trang, responsive — mọi website đều có desktop/mobile |
| `styling-*` | ✅ 100% | Token bridge không mang nghiệp vụ |
| `domain-hotel` | ❌ 0% | `RoomType`, `Inventory` vô nghĩa với SaaS |
| `theme-hotel-*` | ❌ 0% | Style của resort |

Ước lượng tái dùng: **~2.500–3.000 dòng**, chỉ viết mới phần nghiệp vụ.

---

## 4. Quan hệ hai app

| App | Cổng | Vai trò |
|---|---|---|
| `2026-thenamduhill` | 3000 | Hub `/` liệt kê theme, click ra `/hN?lang=vi`. **Đích đến** |
| `2026-thenamduhillresort` | 3003 | 11.221 dòng, admin đầy đủ, **đã có Tailwind v4**. **Nguồn tham chiếu** |

Luồng sync đã chốt: `resort` → **common** → `thenamduhill`.

**Phát hiện quan trọng:** data **không bị fork**. `resort/src/data/property.ts`
đọc `getPropertySync()` từ `@repo/core`; 32 file import `@repo/core`. Nó chỉ là
adapter gắn đường dẫn ảnh (ảnh nằm trong `public/` từng app, không chia sẻ được).
Nên **"sync data" phần lớn đã xong sẵn** — chỉ cần rà soát.

---

## 5. Ba khối công việc

| # | Việc | Khối lượng | Token ước tính |
|---|---|---|---|
| **A** | Rà soát sync data resort ↔ core | ~0, chỉ kiểm 6 file | 20–40k |
| **B** | Common hoá component resort → `ui`/`ui-layout` | ~2.000–2.500 dòng vô danh | 150–250k |
| **C** | Migrate `theme-h1` + `theme-h2` sang Tailwind full | 8.234 dòng | 400–700k |

**Tổng: ~600k–1M token.** Chủ repo đã quyết làm hết **liền mạch**.

### Rủi ro đã nêu và đã được chấp nhận

`theme-h2` (5.608 dòng) và app resort có thể đang render cùng thứ bằng hai bộ
code — resort import `@repo/theme-h2` ở `layout.tsx`/`page.tsx` nhưng cũng tự
viết `components/home/`, `components/rooms/` riêng. Nếu trùng thật, migrate h2
là viết lại thứ sắp bị thay.

Chủ repo chọn **không xác minh trước, cứ migrate cả hai**. Nếu trong lúc làm
xuất hiện bằng chứng rõ ràng, phải **báo lại**, không tự đổi hướng.

---

## 6. Thi công — 14 lát, mỗi lát build xanh mới đi tiếp

### Giai đoạn tái cấu trúc

| Lát | Việc | Rủi ro |
|---|---|---|
| A | Rà soát sync data: 6 file `resort/src/data` vs `@repo/core` | Thấp |
| 1 | `packages/utils` — rút 236 dòng thuần khỏi core | Thấp |
| 2 | Gỡ nợ `core/booking.ts` (đã deprecated theo `index.ts:24`) | Thấp |
| 3 | `packages/ui` — giữ 13 primitive, bỏ 13 file domain ra | Trung bình |
| 4 | `packages/ui-layout` — tách `PageShell` (479 dòng) khỏi `PropertyData`, lấy bản Tailwind của resort làm gốc | **Cao — nút thắt** |
| 5 | `packages/domain-hotel` — gom nghiệp vụ từ core + 8 trang từ ui | **Cao** |
| 6 | `styling-tailwind` + `styling-css` | Trung bình |
| C1 | Migrate `theme-h1` sang Tailwind full | Trung bình |
| C2 | Migrate `theme-h2` sang Tailwind full | Trung bình |
| 7 | Cập nhật registry + 2 app | Trung bình |
| 8 | Cập nhật `.claude/rules/architecture.md` | Thấp |
| — | **Verify**: `pnpm build` + `pnpm lint` xanh cho **cả 2 app + mọi theme** | — |

**Nút thắt là lát 4–5**: 11 file trong `ui` phụ thuộc `PropertyData`, cả 8 trang
đi qua `PageShell`. Cắt sai là hỏng cả hai app cùng lúc.

### Giai đoạn pipeline

| Lát | Việc |
|---|---|
| 9 | `resources/docs/NEW-DOMAIN.md` + slash command `/new-domain <tên>` |
| 10 | `/research <khách>` — gói 4 agent sẵn có, **dừng ở brief chờ user duyệt** |
| 11 | `/directions <khách>` — sinh N Design DNA, gắn ★ recommended |
| 12 | `/build-themes <khách>` — sinh theme, tự đăng ký, hub tự hiện |
| 13 | Khảo sát wshobson/agents + awesome-skills → bảng đánh giá, port cái dùng được |
| 14 | Chạy thử end-to-end với Nam Du |

---

## 7. Pipeline thiết kế theme

```
GIAI ĐOẠN A — /research <khách>
  website-teardown → customer-mindset → K0 (5 câu) → conversion-blueprint
  xuất: briefs/<khách>.md + blueprint.md
        có mục "Positioning đã chọn + phương án pending"
                    │
          ⛔ CỔNG 1 — USER DUYỆT BRIEF
                    │
GIAI ĐOẠN B — /directions <khách> [--n=6]
  đọc blueprint → đề xuất N Design DNA (5 khối P1)
  1 cái gắn ★ RECOMMENDED kèm lý do; còn lại note làm kho ý tưởng
                    │
          ⛔ CỔNG 2 — USER CHỌN
             "chạy hết" / "chạy ★" / "chạy 1,3,5"
                    │
GIAI ĐOẠN C — /build-themes <khách>
  tuần tự từng direction → packages/theme-hotel-hN/
    tokens.css + 9 section id (luật R7) + composition
    CHỈ trang HOME, desktop + mobile
  tự động: đăng ký registry, package.json, layout, next.config
  tự động: check R9 + lint + build
                    │
        hub / tự hiện thẻ → user review
```

### Hai tầng lựa chọn — không được trộn

| Tầng | Ví dụ Nam Du | Cách xử lý |
|---|---|---|
| **Positioning** | *booking hotel* hay *travel resort*? | AI **chọn 1**, làm cho tốt nhất. Cái còn lại → **pending trong brief** |
| **Design Direction** | editorial / dark-luxury / tropical | **Phân kỳ ra N** — đây mới là chỗ khách chọn |

Positioning **hội tụ**, direction **phân kỳ**.

### Màn review

**Giữ nguyên format hub hiện tại.** `apps/2026-thenamduhill/src/app/page.tsx`
sinh thẻ từ `registry` + `meta.ts` — theme mới **tự hiện, không sửa gì** (đúng
luật R5). Click ra `/hN?lang=vi`. Không tạo route `/review` mới.

Bổ sung: `meta.ts` cần thêm khối **Design DNA 5 phần** (P1) để khi review biết
mỗi theme theo hướng gì và `Don't` của nó là gì.

---

## 8. Thay đổi luật

| Luật | Quyết định | Nội dung |
|---|---|---|
| **R11** | ❌ **Bỏ** | Trần 800 dòng là proxy tệ. Đã Clean Architecture + module hoá thì số dòng vô nghĩa. Thay bằng "một đơn vị, một lý do để thay đổi" — nhưng không dựng script kiểm, không cảnh báo |
| **R12** | ✅ Thêm | **Một chuỗi một nhà.** Chuỗi dùng ở ≥2 theme → `ui/strings`. Chuỗi đặc trưng riêng → ở lại theme. Hiện có **4 file `strings`** trùng lặp |
| **R13** | ✅ Thêm | **Dependency Rule.** Theme không gọi thẳng `repository`/`pricing`, phải qua props/hook. *Đã tuân thủ sẵn* — grep xác nhận 0 vi phạm. Chi phí 0, giá trị là ngăn hồi quy |
| **R14** | ✅ Thêm | **Styling engine là lựa chọn của theme**, không phải của app. Theme khai trong `package.json` của nó |
| **R15** | ✅ Thêm | **Tầng nền không được nhắc khái niệm của bất kỳ ngành nào** |

---

## 9. Quyết định về thư viện skill

Chủ repo hỏi cài `wshobson/agents` và "agentic awesome skills".

**Không cài blanket.** Lý do: ~80 agent của wshobson phần lớn không liên quan
(Rust/K8s/ML/Terraform); cài hết làm loãng context và 4 agent nghiệp vụ đã viết
đúng (`website-teardown`, `customer-mindset`, `conversion-blueprint`,
`image-curator`) sẽ khó được chọn đúng.

Cách làm: **khảo sát → bảng đánh giá → chỉ port cái dùng được** (lát 13).

---

## 10. Rủi ro đã biết

1. **Lát 4–5 dễ hỏng nhất.** Làm trên branch riêng, verify bằng `pnpm build`
   thật cho cả 2 app + mọi theme. Không tuyên bố xong khi chưa chạy build.
2. **Hai memory cảnh báo đúng vùng này:**
   - BOM đầu `tokens.css` làm chết toàn bộ token theme trong bundle Next
   - Next dev watcher quét ra `D:\` làm CSS trả 404
   Phải kiểm cả hai sau lát 6.
3. **Nợ kỹ thuật mang sang:** `core/booking.ts` (142 dòng) là bản cũ giữ lại để
   theme không vỡ. Gỡ ở lát 2, trước khi tách domain.
4. **`ui-strings.ts` (390 dòng)** chưa đọc hết — có thể một phần khoá là nhãn
   generic tái dùng được. Cần đọc đủ trước khi xếp hẳn vào `domain-hotel`.

---

## 11. Định nghĩa "xong"

Kế thừa CLAUDE.md §7, bổ sung:

1. `pnpm lint` + typecheck sạch
2. `pnpm build` xanh cho **cả 2 app và mọi theme** — không chỉ cái đang sửa
3. Không vi phạm đồ thị phụ thuộc §3
4. Tầng nền không chứa khái niệm ngành nào (R15)
5. Dữ liệu mới trong domain có đủ `{vi, en}` (R6)
6. Không đưa nội dung/ảnh bên thứ ba lên đường dẫn production (R9)
