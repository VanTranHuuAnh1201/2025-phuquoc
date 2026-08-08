# Rules — Frontend (Theme H3 · CMS Admin · Store)

Áp cho `packages/theme-h3/**`, `app/admin/**`, `app/[theme]/**`,
`src/stores/**`, `src/components/**`.

Luật chung: [common.md](./common.md) · Token: [design-tokens.md](./design-tokens.md) ·
Cổng chất lượng: [premium-quality-gate.md](./premium-quality-gate.md)

> ⚠️ **Nối một màn vào API (hoặc gỡ ra) → cập nhật
> [`API_INTEGRATION_MAP.md`](../../apps/2026-thenamduhill/handover/tasks/release-v1.0.0/API_INTEGRATION_MAP.md)
> trong CÙNG thay đổi** (luật [api-integration-map.md](./api-integration-map.md)).
> Màn còn đọc store cục bộ ghi cột `FE` là `error`, **không phải** `done` — chạy
> được trên máy đang mở mà dữ liệu không lên server thì đó là lỗi.

---

## FE1 — Bảy trạng thái, không thiếu cái nào

```
default · hover · focus-visible · active · disabled · loading · error
```

| Trạng thái | Yêu cầu tối thiểu |
|---|---|
| `hover` | Đổi nền hoặc viền, chuyển trong `--motion-instant` |
| `focus-visible` | Viền outline **luôn thấy**, tương phản ≥ 3:1. **Không bao giờ `outline: none`** |
| `active` | Phản hồi tức thì |
| `disabled` | `cursor: not-allowed`, giảm độ đậm, **vẫn đọc được** |
| `loading` | Có chỉ báo, khoá tương tác, **giữ nguyên kích thước** để không nhảy layout |
| `error` | Viền `--color-danger` + **thông báo bằng chữ**, không chỉ đổi màu |

Thiếu một trạng thái = chưa xong.

## FE2 — Token, không hex

```css
/* ✅ */ background: var(--color-brand);
/* ❌ */ background: #1D4E89;
```
```tsx
/* ✅ */ <div className="bg-brand" />
/* ❌ */ <div className="bg-blue-500" />
```

Mọi màu, khoảng cách, bo góc, đổ bóng, cỡ chữ đọc từ `tokens.css` của theme.

Không dùng cỡ "một lần dùng" nằm ngoài thang token (`36 / 39 / 42 / 47…`).

## FE3 — Theme không chạm tầng dữ liệu

```tsx
/* ✅ dữ liệu vào qua props */
export function RoomsSection({ data, locale }: { data: PropertyData; locale: Locale }) {

/* ❌ theme gọi thẳng repository/pricing */
import { getRooms, buildQuote } from '@repo/core'
```

Hook lấy dữ liệu nằm ở **tầng app** (`src/stores/useQuote.ts`), không nằm trong
theme. Theme chỉ *hiển thị*.

## FE4 — Xử lý lỗi API bằng chữ

```tsx
/* ✅ */
if (!res.success) {
    setError(res.error.message[locale])
    return
}

/* ❌ */ để trang trắng, hoặc chỉ console.log
```

Ba mã lỗi phải xử lý riêng:

| Mã | Hiện gì |
|---|---|
| `409` | Toast *"Phòng vừa được khách khác đặt. Vui lòng chọn phòng khác."* |
| `401` | Chuyển `/login?next=<đường dẫn hiện tại>` |
| `403` | *"Tài khoản của bạn không có quyền thực hiện thao tác này."* |

**Giỏ hàng không được mất khi đi qua màn đăng nhập** — lựa chọn phòng nằm trong
`cart.store` có persist.

## FE5 — Mobile là thiết kế riêng

| Desktop | Mobile |
|---|---|
| 4 thẻ hàng ngang | Carousel |
| Form đặt phòng cạnh hero | Sticky bottom sheet |
| Bảng dữ liệu | **Thẻ** — cấm cuộn ngang bảng |

Chỉ `flex-direction: column` = chưa thiết kế mobile.

| Ràng buộc chạm | |
|---|---|
| CTA | ≥ **44px** |
| Mọi target | ≥ **24×24px** |
| Hero mobile | Thông điệp + ô tìm nằm **trong viewport đầu** |

Kiểm ở **1440px** và **375px**.

## FE6 — Song ngữ ở mọi chuỗi khách thấy

```tsx
/* ✅ */ {pick(t('Đặt phòng', 'Book now'), locale)}
/* ❌ */ Đặt phòng
```

Kể cả chuỗi lỗi, trạng thái rỗng, `aria-label`, `alt` của ảnh.

## FE7 — Trạng thái rỗng nói rõ phải làm gì

| ❌ | ✅ |
|---|---|
| Không có kết quả | Hết phòng cho 20/8–22/8. Thử ngày khác hoặc giảm số khách. |
| Chưa có dữ liệu | Chưa có đơn nào trong 30 ngày qua. Đổi bộ lọc để xem thêm. |

## FE8 — Bảng theo format chuẩn

Mọi bảng trong CMS và trang "Đơn của tôi" theo `app-flows.md §F6`:

| Phần | Yêu cầu |
|---|---|
| Tiêu đề + đếm | "Danh sách đơn hàng" / "128 đơn" |
| Ô tìm kiếm | Placeholder nói rõ tìm được gì |
| Bộ lọc | Dropdown + nút **Đặt lại** |
| Chọn nhiều | Checkbox cột đầu + chọn tất cả ở header |
| Header | In hoa, `--font-size-xs`, `scope="col"` |
| Badge trạng thái | Chấm màu **+ chữ** — không chỉ màu |
| Số liệu | Canh phải, `tabular-nums` |
| Thao tác | Icon SVG có `aria-label` rõ ("Xem đơn NDH-20260820-0042") |
| Phân trang | "Hiển thị x–y trong z" + Trước/Sau |
| Mobile | < 640px đổi sang thẻ |

Thứ tự cột: **định danh → chủ thể → nội dung → thời gian → tiền → trạng thái → thao tác**.

## FE9 — Icon SVG, không emoji

Dùng `lucide-react` (đã có trong `theme-h3`). Emoji chỉ tồn tại ở
`apps/2025-phogroup` — vùng đóng băng, không nhân rộng.

Icon một style duy nhất: Outline **hoặc** Filled, không trộn.

## FE10 — Không copy giữa các theme

`theme-h3` import `theme-h1` là **cấm tuyệt đối**. Cần dùng chung → đẩy lên
`packages/domain-hotel`.

## FE11 — Khả năng tiếp cận WCAG 2.2 AA

| Tiêu chí | |
|---|---|
| Tương phản chữ thường | ≥ 4.5:1 |
| Chữ lớn (≥18.66px bold / ≥24px) | ≥ 3:1 |
| Viền focus | ≥ 3:1 so với nền kề |
| Điều hướng bàn phím | Tab qua toàn trang, không bẫy focus |
| Ảnh | Có `alt`; ảnh trang trí `alt=""` |
| Form | `<label>` gắn đúng — click label phải focus vào input |
| Lỗi | `aria-live="polite"` ở vùng lỗi |
| Không truyền tin **chỉ** bằng màu | Badge trạng thái luôn có chữ |

Bảng dữ liệu: `<th scope="col">`, `<caption>` mô tả, sắp xếp có `aria-sort`.

## FE12 — Motion có lý do

Mỗi animation phải trả lời được *"vì sao nó tồn tại"*. Không trả lời được → xoá.

| | |
|---|---|
| Một viewport | Không quá **2 animation chính** |
| Hover | 150–250ms |
| Chuyển trang | 300–500ms |
| `prefers-reduced-motion: reduce` | Phải tắt hết chuyển động không thiết yếu |

Lấy từ `--motion-*`, không viết số thô. Cấm "AOS fade-up" gắn đại trà mọi section.

## FE13 — Đặt phòng luôn nhìn thấy

| Luật | |
|---|---|
| Hero | Đúng **1 CTA** |
| Mỗi section | Không quá 1 CTA chính |
| Booking | **Luôn nhìn thấy** — sticky bar / bottom sheet |
| Trust | Above the fold |

⚠️ *"Chỉ còn 3 phòng"* chỉ hiện khi `availableUnits` là **số thật** từ
`Inventory`. **Cấm bịa khan hiếm** — đó là dark pattern.

## FE14 — Lệnh build

```bash
pnpm build:safe    # ← dùng cái này khi dev server đang chạy
```

Chạy `pnpm build` khi dev server đang mở sẽ giết dev server và kẹt cổng 3000.

---

## Tự kiểm

```bash
# hex ngoài tokens.css
grep -rn "#[0-9a-fA-F]\{3,8\}" packages/theme-h3/src --include="*.tsx" --include="*.css" \
  | grep -v tokens.css

# theme gọi thẳng tầng dữ liệu
grep -rn "getRooms\|buildQuote\|applyPromotions\|calculatePrice" packages/theme-*/src

# outline none
grep -rn "outline:\s*none\|outline-none" packages/theme-h3/src

# import chéo theme
grep -rn "@repo/theme-h[124]" packages/theme-h3/src

# px thô cho radius
grep -rn "border-radius:\s*[0-9]" packages/theme-h3/src | grep -v tokens.css
```

Cả năm phải rỗng.
