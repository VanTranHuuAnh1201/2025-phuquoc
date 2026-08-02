# Crawl dữ liệu khách sạn bằng Firecrawl

Bộ script bóc tách thông tin khách sạn từ website thành JSON có cấu trúc, rồi
chuyển sang đúng shape mà `src/app/[locale]/hotels/mockData.ts` đang dùng.

## Trước khi dùng — lưu ý pháp lý

Chỉ crawl website **của bạn** hoặc website bạn có quyền. Với website của bên
thứ ba: kiểm tra `robots.txt` và điều khoản sử dụng trước. Nội dung mô tả và
đặc biệt là **ảnh** của họ có bản quyền — dùng làm tham khảo cấu trúc thì được,
copy vào sản phẩm thật thì không.

## Hai pipeline

| Pipeline | Cần API key | Dùng khi |
|---|---|---|
| **Node** (`crawl:pages` → `crawl:build`) | Không | Site render server-side. Nhanh, miễn phí. |
| **Firecrawl** (`crawl:hotel` → `crawl:seed`) | Có | Site render bằng JS, hoặc muốn LLM tự bóc tách schema. |

### Pipeline Node (khuyến nghị cho site đơn giản)

```bash
npm run crawl:full    # BFS toàn site, tự discover  -> output/full-site.json
npm run crawl:rooms   # cào chi tiết từng phòng     -> output/room-details.json
npm run crawl:build   # -> output/seed-data.json + thenamduhill-com.seed.ts
```

`crawl:full` bắt đầu từ trang chủ, đi theo mọi link cùng domain tới khi hết
(mặc định trần 300 trang, đổi bằng `--limit`). Dùng cái này khi không biết
trước sitemap. `crawl:pages` là bản cũ chạy theo danh sách `SEED_PAGES` cố
định — vẫn giữ vì nhanh hơn khi đã biết chính xác cần trang nào.

Script **không gọi** các route ghi dữ liệu của hệ thống đặt phòng
(`bookingcart.add`, `checkout.submit`, ...) — đó là hành động lên hệ thống của
họ chứ không phải nội dung để đọc.

### Chi tiết phòng nằm sau modal AJAX

Trang `/collections/rooms-suites` chỉ render danh sách. Nội dung khi bấm
"Xem chi tiết" (mô tả dài, QUYỀN LỢI & TIỆN NGHI, HƯỚNG TẦM NHÌN, ĐIỀU KIỆN
PHÒNG và gallery ~7 ảnh/phòng) được nạp bằng AJAX, nên crawl HTML tĩnh không
thấy. Endpoint tìm được trong `application/assets/js/dcweb.js`:

```
index.php?route=booking/roomlist.popup&language=vi&product_id=<id>
```

`product_id` lấy từ thuộc tính `data-product-id` trên link "Xem chi tiết" ở
trang danh sách. [crawl-room-details.mjs](crawl-room-details.mjs) ghép id này
với số phòng (`#01`, `#03-04`) rồi gọi thẳng endpoint.

Lưu ý khi đọc dữ liệu: mô tả chi tiết dùng **hai format khác nhau**. Đa số
phòng có heading `QUYỀN LỢI & TIỆN NGHI`; riêng #10 và #12 liệt kê theo nhóm
`Tiện nghi:` / `Trong phòng tắm riêng của bạn:`. Parser xử lý cả hai.

Sửa mảng `SEED_PAGES` trong [crawl-pages.mjs](crawl-pages.mjs) để đổi site/trang
cần cào. Hiện cấu hình 14 trang của thenamduhill.com (gồm 5 trang chính sách). Script tự đi theo link `/article/...` của các trang news, có delay 400ms
giữa mỗi request.

Ba bước tách riêng để dễ sửa:
- `crawl-pages.mjs` — fetch + gom text/ảnh/giá (không parse nghiệp vụ)
- `build-seed.mjs` — parse phòng, map ảnh theo số phòng, gom section
- `emit-ts.mjs` — sinh file `.ts` có type

## Cài đặt

Dependencies đã có sẵn trong `devDependencies`. Chỉ cần tạo file env:

```bash
cp .env.local.example .env.local
```

Rồi điền `FIRECRAWL_API_KEY` (lấy tại https://www.firecrawl.dev/app/api-keys —
free tier 500 credits, đủ cho vài chục site).

### Tuỳ chọn: self-host

Nếu muốn chạy Firecrawl trên máy mình thay vì dùng cloud:

```bash
git clone https://github.com/firecrawl/firecrawl
cd firecrawl
cp apps/api/.env.example apps/api/.env
docker compose up -d
```

Rồi trong `.env.local` của project này set `FIRECRAWL_API_URL=http://localhost:3002`.

## Sử dụng

**Bước 1 — crawl:**

```bash
npm run crawl:hotel -- https://ten-khach-san.com
npm run crawl:hotel -- https://ten-khach-san.com --limit 50 --out my-hotel
```

Kết quả:
- `output/<slug>.json` — dữ liệu đã bóc tách theo schema
- `output/<slug>.raw.json` — markdown + ảnh từng trang, để đối chiếu
- `output/<slug>.images.json` — toàn bộ ảnh, nhóm theo trang nguồn

### Về ảnh

LLM extract hay bỏ sót ảnh, nên script gom ảnh **bằng regex trên HTML thô**
thay vì dựa vào LLM. Bắt được `src`, `data-src`/`data-original` (lazy-load),
`srcset`, `background-image` trong inline style, và `<source>` trong `<picture>`.
Icon/logo/pixel tracking bị lọc qua `IMAGE_BLOCKLIST`.

Nhiều site (đặc biệt nền OpenCart/WordPress) đặt ảnh theo thư mục có tên phòng —
ví dụ `/image/catalog/room-suite/14-rock-deluxe-room/cover14.jpg`. Khi đó map ảnh
về đúng phòng rất chính xác. Script tự thử ghép theo tiêu đề trang; nếu site của
bạn theo pattern thư mục thì map thủ công theo đường dẫn sẽ chuẩn hơn.

Ảnh thumbnail thường có hậu tố size (`-600x600`). Bỏ `/cache/` và hậu tố đó
thường ra ảnh gốc full-size.

**Bước 2 — chuyển sang seed data:**

```bash
npm run crawl:seed -- <slug>
npm run crawl:seed -- <slug> --id 2   # đặt key cho hotel trong mockData
```

Sinh ra `output/<slug>.seed.ts`. **Kiểm tra lại giá và ảnh** rồi mới merge thủ
công vào `src/app/[locale]/hotels/mockData.ts` — script cố tình không tự ghi đè.

## Cấu trúc

| File | Vai trò |
|---|---|
| `schema.ts` | JSON Schema + type TS mô tả dữ liệu khách sạn |
| `firecrawl.ts` | Khởi tạo client, đọc env |
| `crawl-hotel.ts` | Crawl site → JSON thô |
| `to-seed.ts` | JSON thô → shape của `mockData.ts` |
| `output/` | Kết quả crawl |

Muốn thêm/bớt trường: sửa `hotelSchema` và interface `CrawledHotel` trong
`schema.ts`, rồi cập nhật phần map trong `to-seed.ts`.

## Điều chỉnh phạm vi crawl

`INCLUDE_PATHS` trong `crawl-hotel.ts` giới hạn các đường dẫn được crawl
(`*room*`, `*phong*`, `*dining*`, ...) để tiết kiệm credit. Nếu site dùng
đường dẫn khác, thêm pattern vào mảng đó — hoặc xoá tham số `includePaths`
để crawl toàn bộ.
