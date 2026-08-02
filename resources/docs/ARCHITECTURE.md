# Kiến trúc

Tài liệu này giải thích **vì sao** hệ thống được dựng như hiện tại. Phần luật
bắt buộc nằm ở [.claude/rules/architecture.md](../../.claude/rules/architecture.md);
bối cảnh làm việc hằng ngày ở [CLAUDE.md](../../CLAUDE.md).

---

## 1. Bài toán

Khách hàng muốn một website đặt phòng nhưng **chưa chọn được giao diện**. Cách
làm thông thường là dựng vài bản demo rồi bỏ đi những bản không được chọn — tốn
công và mỗi bản lại là một nhánh code chết.

Yêu cầu thật sự khắt khe hơn:

1. Cùng lúc có **N giao diện khác hẳn nhau về hình thức**.
2. Tất cả chạy trên **một nguồn dữ liệu và một bộ nghiệp vụ duy nhất**.
3. Sửa giá hay quy tắc huỷ phòng **một chỗ**, cả N giao diện cùng đổi.
4. N sẽ tăng — hôm nay là 4, sau này có thể 20.
5. Sau này còn thêm **sản phẩm khác** ngoài đặt phòng.

Điều kiện (4) và (5) loại bỏ mọi giải pháp kiểu "copy rồi sửa". Với 20 mẫu, một
thay đổi nghiệp vụ sẽ phải nhân lên 20 lần — đó là điểm hệ thống sụp đổ.

## 2. Bằng chứng từ bản thiết kế

Bộ prototype trong `resources/design/project/` đã tự trả lời phần lớn câu hỏi kiến trúc.

Khảo sát 4 file home cho thấy cả bốn cùng render **đúng một bộ section id**:

```
top · about · rooms · dining · tours · places · gallery · booking · contact
```

và cùng đọc từ **một module dữ liệu chung** (`namdu-data.js`) với mọi trường
đều song ngữ `{vi, en}`. Khác biệt giữa các mẫu nằm ở ba thứ:

| | H1 | H2 | H3 | H4 |
|---|---|---|---|---|
| Màu chính | `#075E9E` | `#066168` | `#066168` | `#066168` |
| Màu nhấn | — | `#FFAA0D` | `#FFAA0D` | `#85D200` |
| Chữ | Plus Jakarta Sans | Figtree | Figtree | Figtree |

Cộng thêm khác biệt về **thứ tự và cách bố cục** section.

Kết luận: khác biệt là **hình thức**, phần chung là **dữ liệu và nghiệp vụ**.
Đường cắt của kiến trúc phải trùng đúng ranh giới đó.

## 3. Các phương án đã cân nhắc

| Phương án | Vì sao loại |
|---|---|
| **Một app, đổi theme bằng CSS variable** | Rẻ nhất, nhưng chỉ đổi được màu. Bốn mẫu này khác nhau cả bố cục — kết quả sẽ là bốn bản giống hệt nhau, sai yêu cầu. |
| **Mỗi mẫu một Next app riêng** | Cô lập tốt, deploy riêng được. Nhưng 20 mẫu = 20 lần build, 20 job CI, 20 lần nâng phiên bản Next. Chi phí bảo trì tăng tuyến tính. |
| **Theme chỉ là file cấu hình** | Thêm mẫu không cần code — hấp dẫn. Nhưng bị nhốt trong các variant đã dựng sẵn, mà bốn mẫu này khác nhau quá sâu để mô tả bằng cấu hình. |
| **Một app + mỗi theme là một package** ✅ | Chọn phương án này. |

### Vì sao chọn theme-as-package

Đặt ranh giới ở **package** thay vì ở component hay ở file cấu hình đem lại:

- **Ranh giới do công cụ ép**, không phải do kỷ luật cá nhân. `theme-h1` không
  import được `theme-h2` vì nó không có trong `dependencies`.
- **Thêm mẫu = thêm một folder.** Không sửa code sẵn có. Nếu buộc phải sửa, đó
  là tín hiệu kiến trúc bị rò rỉ (luật R5).
- **Một lần build, một lần deploy.** Số mẫu tăng không làm phình pipeline.
- **Nghiệp vụ chỉ tồn tại một bản.** Giá phòng, quy tắc huỷ, cách tính đêm nằm
  trong `core` — không có chỗ thứ hai để lệch.

Đánh đổi phải chấp nhận: chi phí thiết lập ban đầu cao hơn, và cần kỷ luật để
không nhét nghiệp vụ vào theme. Luật R2–R4 tồn tại để chặn đúng chỗ đó.

## 4. Sơ đồ phụ thuộc

```
        apps/2026-thenamduhill        apps/cms
            │               │
            ├───────┬───────┘
            ▼       ▼
      theme-h1 … theme-hN
            │
            ▼
           ui
            │
            ▼
          core          ← không phụ thuộc gì cả
```

Một chiều, không có vòng lặp. Ba tầng, mỗi tầng một trách nhiệm:

| Package | Trách nhiệm | Tuyệt đối không chứa |
|---|---|---|
| `core` | Type, dữ liệu, tính giá, nghiệp vụ, i18n | JSX, CSS, mã màu |
| `ui` | Primitive vô danh: Button, Input, Calendar | Màu/font hard-code |
| `theme-*` | Token, section, bố cục | Nghiệp vụ, gọi API, định nghĩa type |

Phép thử: `core` phải chạy được trong Node thuần; nhìn vào `ui` phải **không
đoán được** đang ở theme nào.

## 5. Thêm một mẫu mới

```
packages/theme-h5/
  tokens.css        biến CSS
  sections/         section riêng của mẫu
  composition.tsx   thứ tự + variant
  meta.ts           tên, mô tả, ảnh xem trước
  index.ts          export ThemeDefinition
```

Thêm một dòng vào registry là xong. Route `/[theme]` tự nhận, trang hub tự hiện
thêm thẻ mới, CMS không phải đổi gì.

**Không sửa `core`, `ui` hay `apps/2026-thenamduhill`.** Nếu phải sửa — dừng lại và trừu tượng
hoá, đừng vá tạm.

## 6. Vì sao pnpm

Yarn 1.22 (Classic) đang có sẵn trong repo nhưng cơ chế hoisting phẳng của nó
hay gây lỗi phiên bản chồng chéo với Next 15 + React 19 trong workspace nhiều
package. pnpm dùng liên kết cứng và `node_modules` không phẳng, nên **một
package chỉ nhìn thấy đúng những gì nó khai báo** — chính là thứ ép được ranh
giới ở mục 4.

## 7. Trạng thái hiện tại

| Hạng mục | Trạng thái |
|---|---|
| Bộ tài liệu + luật kiến trúc | ✅ Xong |
| Khung monorepo (pnpm + Turborepo) | ✅ Xong |
| `core` — type, dữ liệu song ngữ, tính giá, registry | ✅ Xong |
| `ui` — hợp đồng token + primitive | ✅ Xong |
| `apps/2025-phogroup` — chuyển nguyên trạng, vẫn build | ✅ Xong |
| Route `/booking-hotel/[theme]` + trang hub | ✅ Xong |
| Cấu hình Vercel + CI | ✅ Xong |
| `theme-h1` — khuôn mẫu (hero + rooms) | 🔶 Khung xong, còn 7 section |
| `theme-h2` … `h4` | ⏳ Sau khi duyệt khuôn mẫu |
| Luồng đặt phòng (UI) + CMS | ⏳ |

### Đã kiểm chứng, không phải chỉ khai báo

| Điều khẳng định | Cách kiểm | Kết quả |
|---|---|---|
| `core` chạy được trong Node thuần (R2) | chạy thẳng bằng `tsx` | ✅ |
| Tính giá đúng | 3 đêm + 2 giường phụ + 2 vé tàu = 9.270.000đ, khớp tính tay | ✅ |
| Thêm theme không sửa code sẵn có (R5) | dựng thử `theme-h2` rồi gỡ | ✅ chỉ đụng 5 chỗ đã ghi |
| N theme cùng một giá (R8) | so giá render trên `/h1` và `/h2` | ✅ trùng khít |
| Không import chéo theme (R1) | grep toàn bộ `packages/theme-*` | ✅ |
| `ui` không hard-code màu (R3) | grep hex trong `.ts`/`.tsx` | ✅ |
| Turborepo cache thật sự ăn | build lại khi không đổi gì | ✅ 45s → 36ms |

Thứ tự này là cố ý: dựng khuôn mẫu bằng **một** theme và duyệt nó trước, rồi mới
nhân bản. Nếu khuôn sai hướng, sửa một chỗ rẻ hơn sửa bốn chỗ.

## 8. Ghi chú

**`apps/2025-phogroup`** là dự án trước đó, chuyển vào nguyên trạng và không sửa bên
trong. Nó có i18n tự viết và design system riêng (cam→hồng); những ràng buộc đó
**không lan** sang sản phẩm mới. Chi tiết ở [CLAUDE.md](../../CLAUDE.md) §5.

**Nội dung bên thứ ba** — dữ liệu và ảnh crawl từ thenamduhill.com cùng theme
Travlla chỉ dùng để dựng cấu trúc ở môi trường phát triển. Bản triển khai thật
phải thay toàn bộ bằng nội dung của khách hàng.
