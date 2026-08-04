# Đưa dữ liệu `apps/2026-thenamduhillresort` về `packages/core`

**Status:** Approved · **Date:** 2026-08-04

## Bối cảnh

`apps/2026-thenamduhillresort` tự khai 2442 dòng dữ liệu trong `src/data/`
(`rooms.ts` 1693 · `blog.ts` 355 · `explore.ts` 326 · `dining.ts` 68), không
khai `@repo/core` trong `package.json`, và không đọc qua repository của core.
Đây là vi phạm trực tiếp luật R8 (một nguồn sự thật) và R6 (song ngữ ở tầng
dữ liệu — app này dùng cặp `name`/`nameEn` thay vì `I18nText {vi,en}`).

**Phát hiện quan trọng khi khảo sát:** `packages/core` ĐÃ CÓ đúng 20 hạng
phòng này, crawl từ cùng nguồn thenamduhill.com, trong
`data/nam-du-hill.seed.generated.ts`, đã map sang kiểu core qua `seed-dto.ts`
và phục vụ qua `repository.ts` (bật bằng cờ `USE_CRAWLED_SEED`, mặc định bật).

Đối chiếu phòng `#01`:

| | app resort (local) | core (seed) |
|---|---|---|
| Tên | Phòng gia đình nhìn ra biển | Phòng gia đình nhìn ra biển |
| Giá | 1.886.000 | 1.886.000 |
| Sức chứa | 4 | 4 |
| Giường phụ | 450.000 | 450.000 |
| Amenities | 10 mục | 10 mục (trùng) |
| Ảnh | hotlink thenamduhill.com | hotlink thenamduhill.com (nhiều hơn) |

Kết luận: dữ liệu phòng ở app resort là **bản sao thừa** của thứ core đã sở
hữu. Việc cần làm không phải "chuyển data lên core" mà là **xoá bản sao và
trỏ app về core**.

## Quyết định đã chốt với người dùng

1. Lấy bộ **20 phòng** làm chuẩn (không phải bộ 7 phòng thủ công trong
   `nam-du-hill.ts`).
2. `apps/2026-thenamduhill` **được phép** thay đổi hiển thị, miễn còn build
   và chạy được.
3. Làm **triệt để cả 2 bước**: data về core VÀ component đọc `{vi,en}` qua
   helper i18n — không giữ lớp adapter tạm.

## Phạm vi

### Phần A — phòng (dùng lại core, xoá bản sao)

- Thêm `@repo/core: workspace:*` vào `apps/2026-thenamduhillresort/package.json`,
  thêm vào `transpilePackages` trong `next.config.ts`.
- 11 điểm import `../data/rooms` đổi sang đọc qua repository của core
  (`getRooms()`, `getRoom()`, `getRoomExtra()`).
- Sửa component đọc `I18nText` qua `pick(text, locale)` thay vì `name`/`nameEn`.
- Thay `formatVND()` local bằng `formatPrice(amount, locale)` của core.
- `roomSlug()` không còn cần thiết — core đã dùng `id` dạng slug sẵn
  (`phong-gia-dinh-nhin-ra-bien-01`). Bỏ hàm, dùng thẳng `room.id`.
- Xoá `src/data/rooms.ts`.

**Hệ quả phải xử lý:** URL phòng đổi từ slug sinh bởi `roomSlug('#01')` sang
`id` của core. Route `/rooms/[id]` phải nhận id mới. Không giữ redirect —
đây là bản demo, chưa có traffic/SEO thật.

### Phần B — dining · explore · blog (chuyển lên core)

Ba loại này core CHƯA có ở dạng tương đương:

| Loại | core hiện có | app resort có | Xử lý |
|---|---|---|---|
| `dining` | 4 mục (nhà hàng/quán) | `DINING_MENU` 41 món, 3 nhóm | Bổ sung kiểu **menu** mới vào core, không đè `dining` cũ |
| `places` | 5 điểm đến | `SPOTS` + `SATELLITE_ISLANDS` + `TRIPS` | Ánh xạ sang `Place` + kiểu `TripPlan` mới |
| `blog` | không có | `BLOG_POSTS` | Thêm kiểu `BlogPost` mới vào core |

Với mỗi loại: định nghĩa type trong `packages/core/src/types.ts` theo chuẩn
`I18nText`, đặt dữ liệu trong `packages/core/src/data/`, thêm getter vào
`repository.ts` (`getDiningMenu()`, `getTrips()`, `getBlogPosts()`), rồi xoá
file local và đổi import.

Chuyển `nameVi`/`nameEn` → `t(vi, en)`. Giá dạng chuỗi `'35K'` trong menu đổi
thành số (35000) để `formatPrice()` xử lý theo locale — hiện `'35K'` là chuỗi
cứng không dịch được.

### Phần C — giữ `apps/2026-thenamduhill` build được

App này gắn id phòng vào booking/inventory/promotion đã seed
(`booking.roomTypeId`, `property.roomExtras[room.id]`,
`buildRoomUnits(property.rooms.map(r => r.id))`). Bộ 7 phòng thủ công và bộ
20 phòng seed có id khác nhau hoàn toàn.

Thực tế cờ `USE_CRAWLED_SEED` mặc định đã bật, nên app này **hiện đã đang
chạy trên 20 phòng seed** — id đã khớp sẵn. Cần xác minh điều này khi thực
thi; nếu đúng thì Phần C không phải sửa gì, chỉ chạy build để xác nhận.

## Ngoài phạm vi

- Không sửa `nam-du-hill.ts` (bộ 7 phòng thủ công) — nó là fallback khi tắt
  cờ seed.
- Không đụng hero overlay (người dùng đã tự comment lại, xử lý sau).
- Không đổi màu/thiết kế — đó là spec riêng
  (`2026-08-04-sunlit-coastal-palette-design.md`).
- Không tải ảnh về local; giữ hotlink như hiện trạng.

## Kiểm chứng

- `pnpm build` — **cả hai** app `2026-thenamduhillresort` và
  `2026-thenamduhill` phải build sạch (luật R5: thêm/sửa không được làm vỡ
  app khác).
- `pnpm check` (lint + typecheck) sạch.
- `grep -r "src/data" apps/2026-thenamduhillresort/src` không còn kết quả.
- `packages/core` vẫn không có JSX/CSS (luật R2).
- Mọi chuỗi mới thêm vào core có đủ `{vi, en}` (luật R6).
- Chạy dev, kiểm bằng mắt: trang chủ, `/rooms`, `/rooms/[id]`, `/dining`,
  `/explore`, `/blog`, `/checkout`, `/admin/rooms` — hiển thị đúng cả VI và EN.

## Rủi ro

| Rủi ro | Giảm thiểu |
|---|---|
| Bản EN trong seed là bản sao tiếng Việt (có `// TODO: dịch` trong `seed-dto.ts`) | Không phải lỗi mới do migration gây ra; ghi nhận, không chặn. Nêu lại với người dùng khi xong. |
| Đổi URL phòng làm hỏng link đã lưu | Bản demo, chấp nhận. Đã nêu ở Phần A. |
| `apps/2026-thenamduhill` vỡ do đổi core | Phần C xác minh trước; build cả hai app ở bước kiểm chứng. |
