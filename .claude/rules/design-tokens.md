# Rules — Design tokens cho 4 mẫu HOME

Nguồn: bản trích xuất UI guidance của khách (Travlla home 2/3/5) + prototype
Figma trong `resources/design/project/`. Đây là **hợp đồng token**, không phải
gợi ý — theme nào lệch khỏi bảng này là sai.

Bối cảnh kiến trúc ở [CLAUDE.md](../../CLAUDE.md), luật chung ở
[architecture.md](./architecture.md).

---

## D0 — Nguyên tắc bất di bất dịch

| | |
|---|---|
| `packages/ui` hard-code màu/font/radius | ❌ Cấm (luật R3) |
| Theme khai token trong `tokens.css` | ✅ Bắt buộc |
| Component đọc `var(--…)` | ✅ Bắt buộc |
| Giá trị hex xuất hiện ngoài `tokens.css` | ❌ Cấm |

Phép thử: đọc bất kỳ file nào trong `packages/ui` phải **không đoán được** đang
là theme nào.

---

## D1 — Tên biến CSS chuẩn

Mọi theme phải khai **đủ** bộ này. Thiếu một biến = component `ui` vỡ ở theme đó.

### Màu — ngữ nghĩa, không phải tên màu

```css
--color-text-primary        chữ chính
--color-text-secondary      chữ phụ
--color-text-tertiary       chú thích, metadata
--color-text-inverse        chữ trên nền đậm
--color-surface-base        nền trang
--color-surface-raised      nền thẻ, panel
--color-surface-strong      nền nhấn (CTA, badge)
--color-border-default      viền mặc định
--color-border-muted        viền nhạt (divider)
--color-brand               màu thương hiệu chính
--color-accent              màu nhấn phụ
```

Sai lầm cần tránh: đặt `--color-teal`. Khi theme H4 đổi sang xanh lá, tên biến
thành nói dối. **Đặt tên theo vai trò, không theo màu.**

### Trạng thái — dùng chung cho cả booking lẫn CMS

```css
--color-success   / --color-success-bg
--color-warning   / --color-warning-bg
--color-danger    / --color-danger-bg
--color-info      / --color-info-bg
```

Badge trạng thái đơn hàng, badge tồn kho, toast đều đọc bộ này.

### Chữ

```css
--font-family-primary
--font-size-xs … --font-size-4xl
--font-weight-base / --font-weight-medium / --font-weight-bold
--line-height-base
```

### Khoảng cách · bo góc · đổ bóng · chuyển động

```css
--space-1 … --space-8
--radius-xs / --radius-sm / --radius-md / --radius-lg / --radius-xl
--shadow-1 / --shadow-2
--motion-instant / --motion-fast / --motion-normal
```

---

## D2 — Bảng token từng mẫu

### HOME 1 — Nam Du Hill (bản gốc, chưa nhận guidance của khách)

Nguồn: prototype `resources/design/project/`. Khách ghi *"cập nhật sau"* — khi
có bản chính thức thì cập nhật mục này, **không tự bịa**.

| Token | Giá trị |
|---|---|
| `--color-brand` | `#075E9E` |
| `--font-family-primary` | `Plus Jakarta Sans, sans-serif` |
| `--font-size-base` | `16px` |

Các token còn lại: xem trực tiếp [tokens.css](../../packages/theme-h1/src/tokens.css).

### HOME 2 — Travlla home-2

Nguồn: `https://travlla.botble.com/` · Đối tượng: người mua, đội nhóm, người ra
quyết định · Bề mặt: marketing site.

| Nhóm | Token | Giá trị |
|---|---|---|
| Font | `--font-family-primary` | `Figtree, sans-serif` |
| | `--font-size-base` | `14px` |
| | `--font-weight-base` | `400` |
| | `--line-height-base` | `21px` |
| Cỡ chữ | xs / sm / md / lg | `12px` / `13px` / `14px` / `16px` |
| | xl / 2xl / 3xl / 4xl | `17px` / `18px` / `20px` / `24px` |
| Màu | `--color-text-secondary` | `#066168` |
| | `--color-text-tertiary` | `#443935` |
| | `--color-text-inverse` | `#346065` |
| | `--color-border-default` | `#ffffff` |
| | `--color-surface-base` | `#000000` |
| | `--color-surface-strong` | `#ffaa0d` |
| Khoảng cách | 1–8 | `1 2 5 6 8 10 12 14` px |
| Bo góc | xs / sm / md / lg | `6px` / `20px` / `30px` / `50px` |
| Chuyển động | instant / fast | `150ms` / `500ms` |

Mật độ component đã biết: links 190 · buttons 44 · lists 21 · inputs 7 · nav 1.

> ⚠️ Bản trích xuất tự báo *"Audience and product surface inference confidence is
> low"*. Coi phần Brand là giả định, phần token là chắc chắn.

### HOME 3 — Travlla home-3

Nguồn: `https://travlla-home-3.botble.com/` · Đối tượng: người đọc, người tìm
hiểu thông tin.

| Nhóm | Token | Giá trị |
|---|---|---|
| Font | `--font-family-primary` | `Figtree, sans-serif` |
| | `--font-size-base` | `14px` / `400` / `21px` |
| Cỡ chữ | xs / sm / md / lg | `13px` / `14px` / `16px` / `18px` |
| | xl / 2xl / 3xl / 4xl | `20px` / `22px` / `24px` / `28px` |
| Màu | `--color-text-primary` | `#066168` |
| | `--color-text-tertiary` | `#346065` |
| | `--color-text-inverse` | `#443935` |
| | `--color-border-muted` | `#ffffff` |
| | `--color-surface-base` | `#000000` |
| | `--color-surface-raised` | `#ffaa0d` |
| Khoảng cách | 1–8 | `1 2 6 8 10 12 14 15` px |
| Bo góc | xs / sm / md / lg / xl | `6px` / `10px` / `20px` / `30px` / `50px` |
| Chuyển động | instant / fast / normal | `150ms` / `350ms` / `500ms` |

Mật độ: links 160 · buttons 27 · lists 27 · inputs 11 · nav 1.

### HOME 4 — Travlla home-5

Nguồn: `https://travlla-home-5.botble.com/` · Đối tượng: người đọc, người tìm
hiểu thông tin.

| Nhóm | Token | Giá trị |
|---|---|---|
| Font | `--font-family-primary` | `Figtree, sans-serif` |
| | `--font-size-base` | `14px` / `400` / `21px` |
| Cỡ chữ | xs / sm / md / lg | `12px` / `13px` / `14px` / `16px` |
| | xl / 2xl / 3xl / 4xl | `18px` / `24px` / `28px` / `36px` |
| Màu | `--color-text-primary` | `#066168` |
| | `--color-text-secondary` | `#346065` |
| | `--color-text-tertiary` | `#443935` |
| | `--color-text-inverse` | `#ffffff` |
| | `--color-surface-base` | `#000000` |
| | `--color-surface-strong` | `#85d200` |
| Khoảng cách | 1–8 | `1 5 6 8 10 12 14 15` px |
| Bo góc | xs / sm / md / lg | `6px` / `8px` / `20px` / `50px` |
| Đổ bóng | `--shadow-1` | `rgba(0,0,0,.08) 0 1px 2px 0` |
| Chuyển động | instant / fast / normal | `150ms` / `200ms` / `500ms` |

Mật độ: links 175 · buttons 42 · lists 29 · inputs 14 · nav 1.

> ⚠️ Cũng có cảnh báo confidence thấp ở phần Brand.

### Đọc bảng trên như thế nào

Ba mẫu Travlla **dùng chung một hệ chữ** (Figtree, base 14/400/21) và **chung
một họ màu** (teal `#066168` · nâu `#443935` · teal nhạt `#346065`). Khác nhau
thật sự chỉ ở:

- **màu nhấn**: H2/H3 cam `#ffaa0d` · H4 xanh lá `#85d200`
- **thang cỡ chữ**: H4 lớn nhất (4xl = 36px), H2 nhỏ nhất (24px)
- **bo góc**: H3 mềm nhất (5 bậc), H4 sắc nhất (sm chỉ 8px)

Đây là bằng chứng kiến trúc đang đúng: khác biệt nằm **trọn vẹn** trong
`tokens.css`, không rơi vào logic.

> **Lưu ý về `--color-surface-base: #000000`** — cả 3 mẫu đều trích ra đen. Đây
> gần như chắc chắn là artefact của bộ trích xuất (nó bắt màu `<body>` mặc định),
> không phải nền đen thật. Khi dựng theme, dùng nền sáng và ghi chú lại; **đừng
> làm site nền đen chỉ vì bảng trích xuất nói vậy.**

---

## D3 — Trạng thái component (bắt buộc)

Guidance của khách yêu cầu **mọi** component tương tác phải định nghĩa đủ 7
trạng thái. Đây là luật, dùng `must`:

```
default · hover · focus-visible · active · disabled · loading · error
```

Thiếu bất kỳ trạng thái nào = chưa xong. Cụ thể:

| Trạng thái | Yêu cầu tối thiểu |
|---|---|
| `hover` | đổi nền hoặc viền, chuyển trong `--motion-instant` |
| `focus-visible` | viền outline **luôn nhìn thấy**, tương phản ≥ 3:1, không bao giờ `outline: none` |
| `active` | phản hồi tức thì (đổi nền/nhấn xuống) |
| `disabled` | `cursor: not-allowed`, giảm độ đậm, **vẫn đọc được** (≥ 4.5:1 nếu mang thông tin) |
| `loading` | có chỉ báo, khoá tương tác, giữ nguyên kích thước để không nhảy layout |
| `error` | viền `--color-danger` + thông báo bằng chữ, **không chỉ dùng màu** |

---

## D4 — Khả năng tiếp cận: WCAG 2.2 AA

Mọi tiêu chí phải **kiểm chứng được**, không phải khẩu hiệu.

| Tiêu chí | Cách kiểm |
|---|---|
| Tương phản chữ thường ≥ 4.5:1 | đo bằng công cụ, ghi số vào PR |
| Chữ lớn (≥18.66px bold / ≥24px) ≥ 3:1 | như trên |
| Viền focus ≥ 3:1 so với nền kề | như trên |
| Điều hướng bàn phím đầy đủ | Tab qua toàn trang, không bẫy focus |
| Thứ tự focus khớp thứ tự đọc | duyệt bằng Tab, so với thứ tự nhìn |
| Target chạm ≥ 24×24 CSS px | WCAG 2.2 mục 2.5.8 |
| Mọi ảnh có `alt` | ảnh trang trí thì `alt=""` |
| Form có `<label>` gắn đúng | click label phải focus vào input |
| Lỗi được đọc bởi screen reader | `aria-live="polite"` ở vùng lỗi |
| Không truyền tin **chỉ** bằng màu | mọi badge trạng thái có chữ kèm |

Riêng bảng dữ liệu (dùng rất nhiều ở CMS):
`<th scope="col">`, `<caption>` mô tả, sắp xếp phải có `aria-sort`.

---

## D5 — Chống hoa mỹ vô ích

Cấm — nêu thẳng trong guidance của khách:

- ❌ chữ tương phản thấp, viền focus bị ẩn
- ❌ khoảng cách/cỡ chữ "một lần dùng" nằm ngoài thang token
- ❌ nhãn mơ hồ (`Xem`, `Click here`) — phải là `Xem đơn ĐH-2026-0042`
- ❌ ship component mà chưa khai đủ trạng thái

Thêm từ phía tôi:

- ❌ dùng emoji làm icon trong sản phẩm mới (`apps/2025-phogroup` đang làm vậy —
  đó là vùng đóng băng, **không nhân rộng**). Sản phẩm mới dùng icon SVG.
- ❌ gradient nhiều màu cho CTA. H1 dùng màu phẳng; Travlla cũng vậy.

---

## D6 — Giọng viết

Ngắn gọn, chắc chắn, hướng thực thi.

| Thay vì | Viết |
|---|---|
| "Có vẻ như không còn phòng" | "Hết phòng cho ngày đã chọn" |
| "Vui lòng thử lại sau" | "Không lưu được. Kiểm tra kết nối rồi bấm Lưu lại." |
| "Bạn có chắc không?" | "Huỷ đơn ĐH-2026-0042? Khách được hoàn 50% (1.250.000đ)." |

Song ngữ là bắt buộc ở tầng dữ liệu (luật R6) — kể cả chuỗi lỗi.

---

## Tự kiểm trước khi báo xong

- [ ] `tokens.css` của theme khai **đủ** bộ biến ở D1
- [ ] Không có hex nào nằm ngoài `tokens.css`
- [ ] Mọi component tương tác có đủ 7 trạng thái ở D3
- [ ] Đo và ghi lại tương phản cho cặp màu chữ/nền mới
- [ ] Tab được qua toàn bộ luồng đặt phòng, không mất viền focus
- [ ] Cả 4 theme còn build được
