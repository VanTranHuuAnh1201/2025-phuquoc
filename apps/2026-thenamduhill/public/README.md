# Ảnh tĩnh dùng chung cho cả N mẫu

Đây là **chỗ duy nhất** đặt file ảnh local của app này. Cả bốn mẫu (h1…h4) và
mọi mẫu thêm sau đều đọc từ đây.

## Vì sao đặt ở app chứ không phải trong `packages/theme-*`

Next chỉ phục vụ file tĩnh nằm trong `public/` của app. Package trong workspace
không tự phục vụ file được — có nhét ảnh vào `packages/theme-h2/` thì trình
duyệt cũng không tải được.

Quan trọng hơn: logo và ảnh cơ sở lưu trú là **nội dung của khách hàng**, không
phải hình thức của một mẫu. Để trong theme nghĩa là mỗi mẫu giữ một bản sao —
đổi logo phải sửa bốn chỗ, và chỉ cần quên một chỗ là bốn mẫu hiện khác nhau.
Đó chính là thứ luật R8 sinh ra để chặn.

## Thư mục

| Thư mục | Đặt gì | Ai dùng |
|---|---|---|
| `brand/` | logo, favicon — nhận diện khách hàng | mọi mẫu, qua `BRAND_ASSETS` |
| `previews/` | ảnh xem trước từng mẫu | trang hub, qua `previewPath(slug)` |
| `property/` | ảnh phòng, ẩm thực, điểm đến | dữ liệu trong `core` |

## Cách dùng trong code

Đừng viết chuỗi đường dẫn thẳng vào theme. Lấy từ `@repo/core`:

```tsx
import { BRAND_ASSETS, previewPath, propertyPath } from '@repo/core'

<img src={BRAND_ASSETS.logo} alt="…" />
previewPath('h2')            // → /previews/h2.webp
propertyPath('phong-01.webp') // → /property/phong-01.webp
```

Lý do: đổi cấu trúc thư mục chỉ phải sửa `packages/core/src/assets.ts`, không
phải đi lùng chuỗi trong bốn theme.

## Quy ước tên file

- `previews/` — theo slug của mẫu: `h1.webp`, `h2.webp`…
- `property/` — không dấu, gạch nối: `phong-gia-dinh-01.webp`
- Ưu tiên `.webp`. Ảnh chụp thật nên nén xuống dưới ~200 KB.

## Việc còn tồn

`previews/` đang **rỗng** — bốn mẫu đã trỏ tới `h1.webp`…`h4.webp` nhưng file
chưa có. Trang hub hiện vẽ ô gradient thay thế nên không vỡ, nhưng khi có ảnh
chụp màn hình từng mẫu thì bỏ vào đây là tự hiện.

Ảnh phòng hiện **hotlink** về `thenamduhill.com`. Khi tải được ảnh gốc từ khách,
bỏ vào `property/` rồi sửa `propertyImages()` trong
`packages/core/src/data/seed-dto.ts` để trỏ vào đường dẫn local.
