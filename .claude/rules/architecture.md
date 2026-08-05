# Rules — Kiến trúc monorepo

Ràng buộc bắt buộc. Vi phạm = phải sửa trước khi coi là xong.
Bối cảnh và lý do nằm ở [CLAUDE.md](../../CLAUDE.md); file này chỉ ghi luật.

---

## R1 — Đồ thị phụ thuộc một chiều

```
theme-*  →  domain-*  →  ui-layout  →  ui  →  utils
                                              ↑
                              styling-*  ─────┘  (theme chọn engine, xem R14)
```

Ba tầng:

| Tầng | Package | Biết gì |
|---|---|---|
| **Nền** | `utils` · `ui` · `ui-layout` · `styling-*` | Không biết domain nào tồn tại |
| **Domain** | `domain-hotel` · `domain-<khác>` | Nghiệp vụ một ngành, không biết hình thức |
| **Theme** | `theme-h1` · `theme-h2` … | Chỉ hình thức |

| Luật | |
|---|---|
| `theme-a` import `theme-b` | ❌ Cấm tuyệt đối, không có ngoại lệ |
| `domain-a` import `domain-b` | ❌ Cấm — cùng lý do với hai theme |
| Tầng nền import `domain-*` hoặc `theme-*` | ❌ Cấm |
| `ui` import `core` | ❌ Cấm — `ui` không phụ thuộc gì |
| `apps/*` import bất kỳ package nào | ✅ Được |

Nếu 2 theme của **cùng một domain** cần chung một thứ → đẩy lên `domain-*` đó.
Nếu 2 **domain** cần chung một thứ → đẩy lên `ui-layout`/`ui`/`utils`, và thứ đó
phải mất hết từ vựng của ngành trước khi lên (xem R15).

**Không bao giờ copy code giữa các theme** — đó là thứ kiến trúc này sinh ra để
loại bỏ.

## R2 — `packages/core` là vùng thuần logic

Được chứa: type, dữ liệu, tính giá, quy tắc nghiệp vụ, helper i18n, format tiền/ngày.

Không được chứa: JSX, CSS, `className`, mã màu, import từ `react-dom`, bất cứ
thứ gì gắn với trình duyệt.

Kiểm tra nhanh: `core` phải chạy được trong môi trường Node thuần.

## R3 — `packages/ui` không mang bản sắc thương hiệu

`ui` chứa primitive vô danh: Button, Input, Modal, Calendar, Carousel…
`ui-layout` chứa bố cục trang: Header, Hero, Breadcrumbs, Footer.

Cấm hard-code màu/font/radius. Mọi giá trị hình ảnh đọc từ CSS variable do
theme cấp — dù viết bằng engine nào:

```css
/* ✅ */ background: var(--brand);
/* ❌ */ background: #066168;
```
```tsx
/* ✅ */ <div className="bg-brand" />        {/* trỏ vào token */}
/* ❌ */ <div className="bg-blue-500" />     {/* màu cứng của Tailwind */}
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
type dữ liệu. Nếu đang viết những thứ đó trong theme → sai chỗ, chuyển vào
`domain-*` (nếu là nghiệp vụ) hoặc `core` (nếu là dữ liệu).

## R5 — Thêm theme không được sửa code sẵn có

Thêm mẫu mới chỉ gồm: tạo folder `packages/theme-xx/` + thêm một dòng vào registry.

Nếu buộc phải sửa tầng nền, `domain-*` hay `apps/2026-thenamduhill` để thêm được
theme → **kiến trúc đang rò rỉ**, phải trừu tượng hoá lại chứ không vá tạm.

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

## R11 — Một đơn vị, một lý do để thay đổi

Mỗi function/component làm đúng một việc. Section của theme **chỉ được mang lý
do thay đổi "hình thức"**.

Phép thử: *"File này phải sửa khi nào?"* Nếu câu trả lời có nhiều hơn một loại
lý do — nội dung đổi, quy tắc nghiệp vụ đổi, cách lấy dữ liệu đổi — thì nó đang
giữ nhầm trách nhiệm, phải trích lên `domain-*` hoặc tầng nền.

> **Không có trần số dòng.** Một file 900 dòng gồm 30 function mỗi cái một
> nhiệm vụ thì lành mạnh; một file 400 dòng với 1 function làm 8 việc thì hỏng.
> Đếm dòng là đo triệu chứng, không đo bệnh.

## R12 — Một chuỗi, một nhà

| Chuỗi | Sống ở đâu |
|---|---|
| Dùng ở ≥2 theme của cùng domain | `domain-*/strings.ts` |
| Nhãn chung không mang từ vựng ngành | `ui`/`ui-layout` |
| Khẩu hiệu, giọng điệu riêng của một mẫu | ở lại theme đó |

Lý do: đổi một nhãn mà phải sửa 4 file là lỗi thiết kế, không phải công việc.

## R13 — Theme không chạm tầng dữ liệu

Section của theme **không được** gọi thẳng `repository`, `pricing`,
`promotion`, `availability`. Dữ liệu vào theme qua props hoặc hook do
`domain-*` cấp.

Kiểm nhanh — kết quả phải rỗng:

```bash
grep -rn "getRooms\|calculatePrice\|buildQuote\|applyPromotions" packages/theme-*/src
```

## R14 — Styling engine là lựa chọn của THEME

Theme khai trong `package.json` của mình dùng engine nào:

```
styling-tailwind   class Tailwind trỏ vào token  →  className="bg-brand"
styling-css        CSS variable thuần            →  var(--brand)
styling-<khác>     thêm sau, không sửa gì sẵn có
```

Mọi engine đọc **cùng một nguồn**: `tokens.css` của theme. Một nguồn màu, N
cách tiêu thụ.

| | |
|---|---|
| Nhồi `@theme` vào `globals.css` của app | ❌ Buộc mọi theme dùng Tailwind → vi phạm R5 |
| Theme khai engine trong `package.json` của nó | ✅ |
| Hai theme dùng hai engine khác nhau | ✅ Đúng thiết kế |

Với Tailwind trong pnpm workspace: **phải khai `@source`** trỏ tới thư mục
package, vì Tailwind mặc định bỏ qua `node_modules` và mọi `@repo/*` đều là
symlink nằm trong đó. Quên khai thì trang mất sạch style **dù build vẫn xanh**.

## R15 — Tầng nền không biết ngành nào tồn tại

Phép thử trước khi đặt bất cứ thứ gì vào `utils`/`ui`/`ui-layout`/`styling-*`:

> *"File này có nhắc khái niệm của một ngành cụ thể không?"*

Không nhắc → tầng nền. Có nhắc (phòng, đơn đặt, thực đơn, bệnh án, gói cước…)
→ `packages/domain-*`.

Cấm ở tầng nền: type nghiệp vụ (`PropertyData`, `RoomType`), tên khách hàng,
địa danh cụ thể, union liệt kê section của một ngành.

Cách cắt khi một component tầng nền lỡ nhận type domain: cho nó nhận **prop
nguyên thuỷ** (chuỗi, mảng nhãn+href), rồi viết một *adapter* ở tầng domain để
dịch. Xem `packages/domain-hotel/src/shell-adapter.ts` làm mẫu.

---

## Tự kiểm trước khi báo xong

- [ ] Không có import chéo giữa các theme, cũng không giữa các domain
- [ ] Tầng nền không nhắc khái niệm ngành nào (R15)
- [ ] `core` sạch JSX/CSS
- [ ] Không hex nào ngoài `tokens.css`; không class màu cứng của Tailwind
- [ ] Theme không gọi thẳng repository/pricing (R13)
- [ ] Chuỗi dùng chung không bị khai lại ở nhiều nơi (R12)
- [ ] Dữ liệu mới đủ `{vi, en}`
- [ ] **Cả N theme còn build được**, không riêng theme đang sửa
- [ ] Package mới đã khai vào `transpilePackages` và `@source` (R14)
- [ ] `pnpm lint` + typecheck sạch
