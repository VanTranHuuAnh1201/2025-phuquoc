# Audit thị giác — Mẫu 04 `h4` (Nam Du Quiet Luxury / v5_amanoi)

Ngày: 2026-08-05 · Chụp bằng Playwright/Chromium, DPR 2, dev server cổng 3100.

## Ảnh chứng minh

| File | Nội dung |
|---|---|
| `final-home.png` / `final-home-m.png` | HOME 1440px / 375px |
| `final-rooms.png` / `final-rooms-m.png` | DANH SÁCH PHÒNG 1440px / 375px |
| `final-detail.png` / `final-detail-m.png` | CHI TIẾT PHÒNG 1440px / 375px |
| `_baseline-h3-header.png` | **Bằng chứng lịch sử**: header từng vỡ y hệt ở mẫu h3 → lỗi có sẵn ở `@repo/ui-layout`, không phải do h4. Đã được `617956e` trên `theme/namdu` sửa dứt điểm |
| `_metrics.json` | Số đo tương phản + hình học từ vòng audit đầu |

## Số đo sau khi sửa

| Trang | Chiều cao header | Tràn ngang | Chiều cao trang |
|---|---|---|---|
| Home 1440 | 68px | 0 | 6.237px |
| Home 375 | 68px | 0 | 8.605px |
| Rooms 1440 | 57px | 0 | 6.111px |
| Rooms 375 | 57px | 0 | 10.301px |
| Detail 1440 | 57px | 0 | 3.939px |
| Detail 375 | 57px | 0 | 5.870px |

Trước khi sửa: header **214px**, Rooms **16.522px** (desktop) / **28.617px** (mobile),
**hai** bộ chuyển ngôn ngữ. Đo lại sau khi rebase lên `theme/namdu`: đúng **một**
bộ chuyển ngôn ngữ trên mọi trang, không tràn ngang ở bất kỳ kích thước nào.

### Thanh đặt phòng — đo riêng, vì đây là chỗ vỡ dai nhất

`<input type="date">` không tự xuống dòng và không co chữ: hụt chỗ là nó cắt cụt
("08/13/2(") chứ không báo gì. Đã đo ở bốn bề rộng, không cụt và không tràn:

| Bề rộng | Bề rộng ô ngày | Nút CTA tràn? |
|---|---|---|
| 1600 | 141px | không |
| 1440 | 164px | không |
| 1280 | 164px | không |
| 1024 | 211px | không |

Ở dải 1024–1279px, nhãn "ĐẶT PHÒNG CÙNG LỄ TÂN" ẩn đi và nút rút gọn còn
"Tìm phòng" — nhường chỗ cho ba ô ngày.

## Tương phản đo được (P15 / D4)

| Cặp màu | Tỷ lệ | Chuẩn |
|---|---|---|
| `#16232B` trên `#FAF8F5` | 15,13:1 | AAA |
| `#46586A` trên `#FAF8F5` (chữ phụ) | 6,92:1 | AAA (chữ thường) |
| `#0E5E70` trên `#FAF8F5` (link/brand) | 6,94:1 | AAA |
| `#16232B` trên `#E8A317` (CTA chính) | **7,39:1** | AAA |
| Trắng trên `#1E3A4C` (section tối) | 11,90:1 | AAA |

> Ghi chú: spec ban đầu ghi CTA đạt ~8,9:1. Số đo thật là **7,39:1** — vẫn vượt
> AAA cho chữ lớn và AA cho mọi cỡ. Chữ trắng trên vàng sẽ chỉ được 2,17:1 và
> **không xuất hiện ở đâu** trong mẫu này.

## Lỗi đã sửa trong vòng này

| # | Lỗi | Chỗ sửa |
|---|---|---|
| 1 | Header cao 214px, tên thương hiệu rớt mỗi chữ một dòng, nhãn nav vỡ hai dòng | **Không sửa ở nhánh này** — `617956e` trên `theme/namdu` đã sửa, và sửa kỹ hơn (đổi tagline sang `brand.suffix` thay vì truncate địa chỉ 49 ký tự). Commit trùng của tôi đã bị drop khi rebase |
| 2 | Hiện **hai** bộ chuyển ngôn ngữ (`VI|EN VI|EN`) | Cũng do `617956e` xử lý ở tầng adapter (bỏ hẳn `locales` khỏi `siteHeaderPropsOf`). Bản vá `locales={[]}` của h4 đã được gỡ vì thành thừa |
| 3 | Nút CTA hero bị cắt ngoài mép phải ở 1440px | `Hero.tsx` — `min-w-0` cho cụm ô nhập |
| 4 | Hai ô ngày đè chữ lên nhau; ngày cụt "08/13/2(" | ô nhập bỏ `min-width` (phải co theo cha), ràng buộc dồn về `<label>` `basis-[190px]` + cụm cha `xl:min-w-[570px]`; nhãn concierge lên `2xl`, nút rút gọn ở dải `lg` |
| 5 | Câu dẫn ghi "Sáu hạng phòng" trong khi dữ liệu có 20 | bỏ số cứng khỏi câu dẫn; số thật hiện ở bộ đếm |
| 6 | Rooms đổ hết 20 dòng → trang dài 16.522px | phân trang 6 dòng/lần + dòng "Đang xem x–y trong z" |
| 7 | Bộ đếm kết quả bị đẩy xa bộ lọc bằng `ml-auto` | bỏ `ml-auto`, đặt cạnh bộ lọc |
| 8 | Tiêu đề section bị header cố định che khi deep-link | `scroll-margin-top` cho bộ id của R7 |

## Còn tồn tại (ghi nhận, chưa sửa)

- **Chất lượng ảnh nguồn (P6)** — kho ảnh của khách trộn nhiều nguồn: ảnh drone
  chuyên nghiệp, ảnh phòng chụp điện thoại (có tấm 351px), ảnh ghép marketing có
  logo in sẵn. Mẫu này đã hạn chế thiệt hại bằng cách ép mọi ảnh vào bộ tỷ lệ
  đóng trong `Frame` và **không** đưa ảnh phòng lên full-bleed. Muốn đạt P6 trọn
  vẹn thì phải có bộ ảnh chụp mới — đây là việc của khách, không phải của code.
- **Nội dung seed mâu thuẫn** — vài hạng phòng có mô tả nói 20m²/1 giường ở tiêu
  đề nhưng 40m²/2 giường ở đoạn dài, và có chuỗi CMS thô (`( bathroom amenities )`).
  Đây là dữ liệu trong `packages/core`, dùng chung cho cả 4 mẫu; sửa ở đây sẽ
  ảnh hưởng h1–h3 nên để nguyên (ngoài phạm vi bản này).
- **Chưa có hamburger trên mobile cho trang chủ** — `SiteHeader` dựng menu mobile
  theo điều kiện riêng của nó; đây là hành vi dùng chung, sửa phải tính cho cả
  bốn mẫu.
- **`?naked=1` (P13)** — CSS đã sẵn sàng trong `tokens.css` (`[data-naked]`),
  nhưng app chưa gắn thuộc tính đó lên `<html>`, nên chưa chụp được ảnh "naked".
