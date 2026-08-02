# Rules — Kiến trúc monorepo

Ràng buộc bắt buộc. Vi phạm = phải sửa trước khi coi là xong.
Bối cảnh và lý do nằm ở [CLAUDE.md](../../CLAUDE.md); file này chỉ ghi luật.

---

## R1 — Đồ thị phụ thuộc một chiều

```
theme-*  →  ui  →  core
```

| Luật | |
|---|---|
| `theme-a` import `theme-b` | ❌ Cấm tuyệt đối, không có ngoại lệ |
| `core` import `ui` hoặc `theme-*` | ❌ Cấm |
| `ui` import `theme-*` | ❌ Cấm |
| `apps/*` import bất kỳ package nào | ✅ Được |

Nếu 2 theme cần chung một thứ → đẩy lên `ui` (nếu có JSX) hoặc `core` (nếu là
logic/dữ liệu). **Không bao giờ copy code giữa các theme** — đó là thứ kiến
trúc này sinh ra để loại bỏ.

## R2 — `packages/core` là vùng thuần logic

Được chứa: type, dữ liệu, tính giá, quy tắc nghiệp vụ, helper i18n, format tiền/ngày.

Không được chứa: JSX, CSS, `className`, mã màu, import từ `react-dom`, bất cứ
thứ gì gắn với trình duyệt.

Kiểm tra nhanh: `core` phải chạy được trong môi trường Node thuần.

## R3 — `packages/ui` không mang bản sắc thương hiệu

`ui` chứa primitive vô danh: Button, Input, Modal, Calendar, Carousel…

Cấm hard-code màu/font/radius trong `ui`. Mọi giá trị hình ảnh đọc từ CSS
variable do theme cấp:

```css
/* ✅ */ background: var(--brand);
/* ❌ */ background: #066168;
```

Nhìn vào `ui` phải **không đoán được** đang là theme nào.

## R4 — Theme package: hình thức, không phải nghiệp vụ

Mỗi `packages/theme-*` bắt buộc có đúng bộ này:

```
theme-xx/
  tokens.css        biến CSS: màu, font, radius, shadow
  sections/         các section riêng của theme
  composition.tsx   thứ tự section + variant đã chọn
  index.ts          export ThemeDefinition
  meta.ts           tên, mô tả, ảnh xem trước (cho trang hub)
```

Theme **không được** chứa: gọi API, tính giá, quy tắc nghiệp vụ, định nghĩa
type dữ liệu. Nếu đang viết những thứ đó trong theme → sai chỗ, chuyển vào `core`.

## R5 — Thêm theme không được sửa code sẵn có

Thêm mẫu mới chỉ gồm: tạo folder `packages/theme-xx/` + thêm một dòng vào registry.

Nếu buộc phải sửa `core`, `ui` hay `apps/2026-thenamduhill` để thêm được theme → **kiến trúc
đang rò rỉ**, phải trừu tượng hoá lại chứ không vá tạm.

## R6 — Song ngữ là bắt buộc ở tầng dữ liệu

Mọi chuỗi khách nhìn thấy trong `core` đều mang dạng `{ vi, en }`. Cấm chuỗi
một ngôn ngữ ở tầng dữ liệu.

```ts
/* ✅ */ name: { vi: "Phòng gia đình", en: "Family Room" }
/* ❌ */ name: "Phòng gia đình"
```

Theme chỉ *hiển thị* ngôn ngữ đã được chọn, không tự dịch.

## R7 — Contract section ổn định

Cả N theme render cùng bộ section id, kế thừa từ prototype:

```
top · about · rooms · dining · tours · places · gallery · booking · contact
```

Theme được **bỏ bớt** section hoặc **đổi hoàn toàn cách trình bày**, nhưng
không được **đổi tên** id — điều hướng, deep-link và CMS phụ thuộc vào bộ id này.

## R8 — Một nguồn sự thật cho dữ liệu

Mọi theme đọc qua repository của `core` (`getRooms()`, `getTours()`…).

Cấm: theme tự khai mock data, tự fetch, hoặc giữ bản sao dữ liệu riêng.
Đổi giá một chỗ phải phản ánh ở cả N theme.

## R9 — Nội dung bên thứ ba không lên production

Dữ liệu/ảnh crawl (`scripts/crawl/output/`, theme Travlla, thenamduhill) chỉ
dùng dựng cấu trúc ở dev. Không hotlink, không commit vào đường dẫn production.

## R10 — `apps/2025-phogroup` là vùng đóng băng

Chuyển nguyên trạng, chỉ sửa khi được yêu cầu rõ ràng. Ràng buộc design system
cam→hồng của nó **không lan sang** sản phẩm mới.

---

## Tự kiểm trước khi báo xong

- [ ] Không có import chéo giữa các theme
- [ ] `core` sạch JSX/CSS
- [ ] `ui` không hard-code màu
- [ ] Dữ liệu mới đủ `{vi, en}`
- [ ] **Cả N theme còn build được**, không riêng theme đang sửa
- [ ] `pnpm lint` + typecheck sạch
