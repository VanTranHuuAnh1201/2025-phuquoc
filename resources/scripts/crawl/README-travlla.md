# Crawl Travlla (Botble demo)

Bộ script crawl 5 biến thể trang chủ + toàn bộ trang con của theme Travlla,
xuất ra JSON có cấu trúc và file TypeScript đã gõ kiểu.

## Nguồn

| Biến thể | URL |
| --- | --- |
| home-1 | https://travlla.botble.com |
| home-2 | https://travlla-home-2.botble.com |
| home-3 | https://travlla-home-3.botble.com |
| home-4 | https://travlla-home-4.botble.com |
| home-5 | https://travlla-home-5.botble.com |

Preview gốc: https://preview.codecanyon.net/item/travlla-travel-tour-booking-laravel-system/full_screen_preview/64039943

## Chạy

```bash
npm run crawl:travlla         # crawl -> output/travlla/pages.json + images.json
npm run crawl:travlla:build   # -> seed-data.json + travlla-botble-com.seed.ts
```

Bước crawl mất ~1 phút (89 trang, có nghỉ 350ms giữa các request).

## Pipeline

```
crawl-travlla.mjs        # fetch HTML thô -> pages.json
  └─ build-travlla-seed.mjs   # bóc entity có cấu trúc -> seed-data.json
       └─ emit-travlla-ts.mjs # sinh type + data -> travlla-botble-com.seed.ts
```

## Kết quả

| Nhóm | Số lượng |
| --- | --- |
| Trang crawl | 89 |
| Biến thể trang chủ | 5 |
| Tour (đủ giá, lịch trình, includes/excludes, review, booking) | 8 |
| Điểm đến | 8 |
| Loại hình tour | 6 |
| Dịch vụ | 4 |
| Bộ ảnh gallery | 10 (91 ảnh) |
| Bài blog | 12 (+8 danh mục, 10 tag) |
| Thành viên team | 8 |
| Testimonial | 3 |
| FAQ | 10 |
| Gói giá | 3 |
| **Ảnh** | **503 tổng — 308 ảnh nội dung `/storage/` (đã kiểm 308/308 trả HTTP 200)** |

## Ghi chú kỹ thuật

Vài chỗ site không cho lấy dữ liệu theo cách thông thường, đã xử lý sẵn:

- **Cloudflare chặn user-agent lạ** → gửi kèm bộ header trình duyệt thật
  (`sec-ch-ua`, `sec-fetch-*`). `curl` mặc định trả 403.
- **Ảnh là thumbnail** dạng `1-320x240.jpg` → bỏ hậu tố `-WxH` để lấy bản gốc.
- **Includes vs Excludes** là 2 cột `<ul>` cạnh nhau, text phẳng không phân biệt
  được → đọc từ HTML theo class icon `bi-check-circle-fill` / `bi-x-circle-fill`.
  Vì vậy `pages.json` giữ lại HTML của `<main>` ở field `html`.
- **Menu/filter lặp trên mọi trang** → ngoài `text` (full) còn có `mainText`
  chỉ chứa nội dung trong `<main>`. Các parser đều dùng `mainText`.
- **`Activity Type` xuất hiện 2 lần** (filter sidebar mặc định "Any activity" và
  thông tin tour thật) → chỉ đọc field từ khối `Tour Overview` trở đi.
- **Email bị Cloudflare che** thành `[email protected]` → giải mã từ
  `data-cfemail` (XOR với byte đầu).
- **Trang chủ bị crawl 2 lần** do sitemap trả `https://host` còn link trả
  `https://host/` → chuẩn hoá URL trước khi so với tập đã thăm.

Đã bỏ khỏi phạm vi crawl: bản dịch `/ar` `/vi` `/fr`, các biến thể layout trùng
nội dung (`?layout=grid`, `?style=list`…), và trang tiện ích (`/compare`,
`/coming-soon`, `/error-404`).

Hai URL trả 404 ngay trên site nguồn (`/services/services`, `/our-team/1`) — là
link hỏng có sẵn của demo, đã lọc khỏi seed vì builder chỉ nhận trang status 200.

## Bản quyền

Dữ liệu và hình ảnh thuộc theme thương mại Travlla trên CodeCanyon. Dùng làm mẫu
cấu trúc để dựng UI ở môi trường dev thì được; **đưa lên production, hotlink ảnh
hoặc tái sử dụng nội dung là vi phạm bản quyền**. Thay toàn bộ bằng nội dung của
bạn trước khi lên production.
