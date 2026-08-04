# Spec — The Nam Du Hill Resort · Bản 4 "Sunlit Booking"

> Bản kiến trúc + thiết kế chi tiết cho vòng chốt hướng tiếp theo của The Nam Du Hill Resort.  
> Kế thừa trực tiếp: [v3 — Tropical Bright](./2026-08-04-architecture-namduhillresort-v3.md).  
> Brief: [thenamduhillresort.md](../../../resources/docs/briefs/thenamduhillresort.md).  
> Phạm vi chốt: **Home + Rooms + RoomDetail**. Các nội dung thanh toán thật và Zalo thật để dạng option/placeholder.

---

## 0. Kết luận khuyến nghị

### 0.1 Quyết định nên đi theo

**Khuyến nghị chọn Option A — Sunlit Coastal Booking.**

Lý do: bản trước failed vì màu u buồn, nên v4 phải ưu tiên cảm giác **sáng, sạch, chính chủ, dễ đặt phòng** hơn là cố làm "luxury" bằng nền tối. Option A dùng nền ngà sáng, xanh biển từ logo, vàng nắng chỉ cho nút đặt phòng. Nó giải quyết đúng 3 vấn đề: khách sợ web giả, khách khó so sánh phòng, khách chưa đủ niềm tin để cọc.

### 0.2 Hai option để trình khách

| Option | Tên | Cảm giác | Khi nào chọn | Khuyến nghị |
|---|---|---|---|---|
| **A** | **Sunlit Coastal Booking** | Buổi sáng trên đảo, sáng, rõ, có nắng, đáng tin | Muốn chốt nhanh, bám logo hiện có, giảm rủi ro "u buồn" | **Chọn** |
| B | Fresh Island Editorial | Xanh lá non + biển, tự nhiên hơn, ít "hotel booking" hơn | Nếu khách muốn cảm giác homestay/resort hoang sơ, gần cây cối hơn | Dùng làm bản so sánh |

**Không chọn lại:** navy/dark luxury, teal trầm, nâu cam đậm, slate lạnh. Những hướng này dễ lặp lỗi "tăm tối, u buồn".

### 0.3 Câu hỏi quyết định và đề xuất

| Câu hỏi | Option 1 | Option 2 | Tôi đề xuất |
|---|---|---|---|
| Hướng thiết kế chính | A. Sáng, biển, booking rõ | B. Tự nhiên, xanh lá, editorial | **A** vì ưu tiên chuyển đổi và trust |
| Màu chủ đạo | A. Xanh biển logo + vàng nắng | B. Xanh lá đảo + coral nhẹ | **A** vì khớp logo `OP5.png` |
| Phạm vi vòng này | A. Home + Rooms + RoomDetail | B. Làm thêm checkout/contact/news | **A** để chốt phần quan trọng nhất trước |
| Thanh toán | A. Hiển thị 3 option UI, chưa nối cổng | B. Nối payment thật ngay | **A** vì user đã xác nhận đây chưa phải kỳ vọng chính |
| Zalo | A. Placeholder fake data, ghi rõ chờ OA thật | B. Cố tìm/suy đoán Zalo thật | **A** để tránh sai thông tin liên hệ |
| Motion | A. Tĩnh + hover/focus nhẹ | B. Animation nhiều từ đầu | **A**; animation đồng bộ ở vòng cuối |
| Ảnh | A. Dùng ảnh đã có + crop/cảnh báo ảnh thiếu | B. Sinh toàn bộ ảnh mới | **A**; chỉ đề xuất ảnh cần chụp/sinh khi ảnh thật không đủ |

---

## 1. Mục tiêu sản phẩm

Website không chỉ là trang giới thiệu resort. Nó là phễu đặt phòng cho khách đi Nam Du:

1. **Home:** tạo thiện cảm, chứng minh đây là resort thật/chính chủ, dẫn vào xem phòng.
2. **Rooms:** giúp so sánh hạng phòng nhanh theo ngày, số khách, giá, view, sức chứa.
3. **RoomDetail:** làm người dùng đủ yên tâm để bấm đặt phòng/cọc.

Điểm đau lớn nhất theo brief: khách sợ lừa đảo, nhất là khi phải thanh toán/cọc qua website. Vì vậy trust phải nằm ở các điểm bấm chính, không chỉ nằm trong footer.

---

## 2. Design Direction

### 2.1 Option A — Sunlit Coastal Booking (khuyến nghị)

**Point of view:** "Nghỉ trên đồi, mở mắt ra là biển Nam Du trong nắng sớm."

| Trụ | Quyết định thiết kế | Lý do |
|---|---|---|
| Nền sáng | 85-90% diện tích là nền trắng ngà | Xoá cảm giác u buồn, làm ảnh biển/đảo nổi bật |
| Brand rõ | Xanh biển lấy cảm hứng từ logo `OP5.png`, tinh chỉnh đậm hơn để đạt tương phản | Khách thấy logo và UI cùng một chủ thể |
| CTA duy nhất | Vàng nắng chỉ dùng cho CTA chính | Người dùng luôn biết nút đặt phòng ở đâu |
| Layout booking | Ít card trang trí, nhiều dòng so sánh rõ | Booking hotel cần quyết định nhanh, không phải landing page marketing |
| Trust | Đặt thông tin chính chủ, hotline, chính sách tàu hoãn sát CTA | Trả lời nỗi sợ ngay tại nơi người dùng ra quyết định |

Token đề xuất:

```css
[data-theme='namdu'] {
  --color-brand: #1173B8;
  --color-accent: #F6B21B;
  --color-text-primary: #21323C;
  --color-text-secondary: #4C6270;
  --color-text-tertiary: #6F8088;
  --color-text-inverse: #FDFCF8;
  --color-surface-base: #FDFCF8;
  --color-surface-raised: #FFFFFF;
  --color-surface-sand: #F7F0E4;
  --color-surface-strong: #1173B8;
  --color-border-default: #DCD6CA;
  --color-border-muted: #ECE7DC;
  --color-success: #1E7A4E;
  --color-success-bg: #E7F3EC;
  --color-warning: #9A6A08;
  --color-warning-bg: #FBF1DB;
  --color-danger: #B3341F;
  --color-danger-bg: #FBEAE6;
  --color-info: #1173B8;
  --color-info-bg: #E6F1F9;
  --font-display: 'Lora', Georgia, serif;
  --font-family-primary: 'Be Vietnam Pro', system-ui, sans-serif;
}
```

Quy tắc dùng màu:

- Vàng `--color-accent` chỉ xuất hiện ở CTA chính: "Chọn ngày & xem phòng", "Chọn phòng", "Đặt phòng".
- Xanh đậm chỉ dùng cho header trạng thái cuộn, booking band, footer hoặc link quan trọng.
- Không dùng gradient tím/xanh đậm, không dùng nền navy, không dùng màu đen thuần.

### 2.2 Option B — Fresh Island Editorial

**Point of view:** "Một resort mộc trên đảo xanh, nhiều cây, nhiều gió, bớt cảm giác khách sạn."

Token đề xuất:

```css
[data-theme='namdu'] {
  --color-brand: #2F8F6B;
  --color-accent: #F2A93B;
  --color-text-primary: #24342E;
  --color-text-secondary: #53675E;
  --color-text-tertiary: #77877F;
  --color-text-inverse: #FBFFF9;
  --color-surface-base: #FBFFF9;
  --color-surface-raised: #FFFFFF;
  --color-surface-sand: #F3EAD8;
  --color-surface-strong: #2F8F6B;
  --color-border-default: #D8E0D8;
  --color-border-muted: #EAF0EA;
  --color-success: #1E7A4E;
  --color-success-bg: #E7F3EC;
  --color-warning: #9A6A08;
  --color-warning-bg: #FBF1DB;
  --color-danger: #B3341F;
  --color-danger-bg: #FBEAE6;
  --color-info: #1173B8;
  --color-info-bg: #E6F1F9;
  --font-display: 'Fraunces', Georgia, serif;
  --font-family-primary: 'Be Vietnam Pro', system-ui, sans-serif;
}
```

Rủi ro của Option B: xanh lá nếu dùng quá nhiều sẽ thành "eco resort" chung chung, lệch nhận diện logo xanh biển. Nếu chọn B, vẫn phải giữ nền rất sáng và CTA vàng.

---

## 3. Phạm vi chức năng v4

### 3.1 Làm trong vòng này

- Home.
- Trang danh sách phòng `/h5/rooms`.
- Trang chi tiết phòng `/h5/rooms/[slug]`.
- Zalo floating/footer bằng placeholder fake data.
- Thanh toán hiển thị như option giao diện: thẻ tín dụng OnePay, chuyển khoản, thanh toán tại nơi.
- Copy song ngữ VI/EN cho các chuỗi quan trọng.
- Gán ảnh hiện có vào vị trí phù hợp, ghi rõ ảnh nào DEV-ONLY/chờ bản gốc.

### 3.2 Không làm trong vòng này

- Không nối cổng thanh toán thật.
- Không tự xác nhận MST/Zalo OA nếu chưa có dữ liệu chính chủ.
- Không dựng full News/Event/Gallery/Contact mới nếu hệ thống đã có fallback.
- Không thêm animation phức tạp.
- Không tự bịa promotion/discount.

---

## 4. Home

### 4.1 Vai trò

Home phải trả lời 4 câu trong 10 giây đầu:

1. Đây có phải resort thật/chính chủ không?
2. Resort nằm ở đâu trên Nam Du?
3. Có thể xem phòng/giá ngay không?
4. Nếu tàu/di chuyển khó thì resort hỗ trợ gì?

### 4.2 Thứ tự section

```text
top       Hero ảnh biển/resort + định danh chính chủ + search booking
trust     Dải xác thực ngắn: hotline, địa chỉ, đưa đón, chính sách tàu hoãn
about     Đường ra đảo + câu chuyện resort trên đồi Củ Tron
rooms     3-4 phòng nổi bật + CTA xem tất cả
dining    Ăn uống, BBQ, cafe/bar
places    Nam Du nên đi đâu: Bãi Cây Mến, Hòn Mấu, tour cano
gallery   Ảnh thật đã chọn lọc
booking   Dải chốt booking + FAQ
contact   Hotline, Zalo placeholder, social, địa chỉ
```

### 4.3 Hero

Desktop:

- Ảnh nền 85vh, ưu tiên `banner2.jpg` hoặc `hero-2.jpg` nếu chất lượng crop tốt hơn.
- H1: "Nghỉ trên đồi, thức dậy giữa biển Nam Du".
- Subline trust: "Resort chính chủ trên đồi Củ Tron · Hotline/Zalo 0985 000 650".
- Search widget: Ngày nhận, ngày trả, số khách, CTA "Chọn ngày & xem phòng".
- Dòng nhỏ dưới widget: "Đưa đón bến tàu · Cọc 50% · Tàu hoãn do thời tiết: dời ngày miễn phí".

Mobile:

- H1 và CTA phải nằm trong viewport đầu ở 375px.
- Widget thu thành một nút mở bottom-sheet, không nhồi 4 field ngang.
- Sticky bottom bar chỉ hiện sau khi qua hero.

### 4.4 Trust strip

Đặt ngay sau hero, không để cuối trang:

| Item | Nội dung |
|---|---|
| Chính chủ | "The Nam Du Hill Resort · Ấp Củ Tron, Kiên Hải" |
| Liên hệ | Hotline/Zalo `0985 000 650` |
| Di chuyển | "Xe resort đón tại cầu cảng" |
| Thời tiết | "Tàu hoãn: hỗ trợ dời ngày miễn phí" |

Nếu dữ liệu nào chưa xác minh, label trong code/spec là `PLACEHOLDER_PENDING_CONFIRMATION`.

### 4.5 Rooms preview

Chỉ hiển thị 3-4 phòng để không làm Home thành trang danh sách. Card cần có:

- Ảnh phòng.
- Tên phòng thật + số phòng/hạng.
- "Phù hợp với ai".
- Giá từ.
- CTA phụ "Xem chi tiết", CTA chính của section vẫn là "Xem tất cả phòng".

Không dùng badge vàng cho tiện nghi. Vàng chỉ dành cho CTA.

---

## 5. Rooms Page

### 5.1 Vai trò

Rooms là trang so sánh. Không dùng layout card 3 cột làm mặc định desktop vì khó so giá/diện tích/view. Desktop dùng **row comparison**, mobile dùng thẻ dọc.

### 5.2 Desktop layout

```text
Banner mỏng 30vh
Sticky date bar: 20/08 -> 22/08 · 2 khách · Sửa
Room rows sorted by price
```

Mỗi row:

```text
[Ảnh 360x240] [Tên + mô tả + tiện nghi + chính sách] [Giá + còn phòng + CTA]
```

Thông tin bắt buộc:

- Tên phòng/hạng.
- Sức chứa mặc định và tối đa.
- Diện tích nếu có.
- View.
- Giá theo đêm và tổng theo ngày đã chọn.
- Phụ thu giường/trẻ em nếu liên quan.
- Tóm tắt huỷ: "Huỷ trước 7 ngày: hoàn 100% cọc".
- CTA "Chọn phòng".

### 5.3 Mobile layout

- Mỗi phòng là một card dọc.
- Ảnh 16:9 ở trên.
- Giá và CTA full-width ở đáy card.
- Date bar sticky top thu gọn: "20/08-22/08 · 2 khách · Sửa".
- Không cuộn ngang ở trang Rooms.

### 5.4 Bảng 20 phòng crawl hiện có

Các phòng dưới đây lấy từ `thenamduhill.full-site.json`; chưa tự gộp production nếu khách chưa duyệt.

| Phòng crawl | Mô tả ngắn | Giá crawl |
|---|---|---|
| Phòng gia đình nhìn ra biển - #01 | Mặc định 2 người, phụ thu 450.000đ/khách, tối đa 4 | 1.886.000đ / đêm |
| Phòng giường đôi nhìn ra vườn - #02 | Mặc định 2 người, phụ thu 410.000đ/khách, tối đa 3 | 1.546.000đ / đêm |
| Phòng giường đôi có ban công nhìn ra biển - #03-04 | 1 giường đôi lớn, ban công, nhìn ra biển | 1.546.000đ / đêm |
| Phòng tiêu chuẩn giường đôi (lục giác) - #05 | 1 giường đôi lớn, 21m2, view biển | 1.546.000đ / đêm |
| Phòng Deluxe - #06 | 1 giường đôi lớn, 20m2, view biển và hồ bơi | 1.776.000đ / đêm |
| Phòng Superior có giường cỡ King - #07 | 53m2, tối đa 4 người, phụ thu 410.000đ/người | 2.971.000đ / đêm |
| Phòng gia đình view biển (08) - #08 | 3 giường: 1 đôi, 2 đơn | 3.088.000đ / đêm |
| Phòng gia đình view biển (09) - #09 | 2 giường đôi lớn, view biển | 3.088.000đ / đêm |
| Phòng giường đôi có sân trong - #10 | Mặc định 2 người, phụ thu 410.000đ/khách, tối đa 3 | 1.776.000đ / đêm |
| Phòng gia đình view biển - #11 | 2 giường đôi, gia đình 4 khách | 3.088.000đ / đêm |
| Phòng giường đôi có ban công - #12 | 19m2, view biển | 1.862.000đ / đêm |
| Second Floor Family with Sea View - #13 | 2 giường đôi, 35m2 | 3.088.000đ / đêm |
| Rock Deluxe Room - #14 | 21m2, 1 giường đôi | 1.776.000đ / đêm |
| Phòng giường đôi - #15 | 1 giường đôi lớn, 18m2 | 1.587.000đ / đêm |
| First Floor Family with Sea View - #16 | 2 giường đôi, 31m2 | 2.987.000đ / đêm |
| Phòng 03 người - Hướng thung lũng/ biển - #17 | 26m2, view biển/thung lũng | 2.411.000đ / đêm |
| Phòng 03 người - Có ban công - #18 | 32m2, ban công rộng, view thung lũng/biển | 2.411.000đ / đêm |
| Suite 02 phòng ngủ (08 khách) - #08-09 | 2 phòng ngủ, 4 giường đơn, 2 giường đôi cực lớn | 5.662.000đ / đêm |
| Suite 02 phòng ngủ (06 khách) - #10-11 | 2 phòng ngủ, 3 giường đôi, view biển | 4.287.000đ / đêm |
| Suite 02 phòng ngủ (06 khách) - #15-16 | 2 phòng ngủ, 3 giường đôi, view vườn | 4.287.000đ / đêm |

### 5.5 Đề xuất gộp hạng để trình duyệt

Khuyến nghị hiển thị 7 nhóm/hạng chính, phía dưới ghi rõ "bao gồm phòng #..." để không mất dữ liệu thật:

| Nhóm hiển thị | Gồm phòng | Lý do |
|---|---|---|
| Standard Double | #02, #03-04, #05, #15 | Nhóm giá thấp 1.546.000-1.587.000đ |
| Deluxe / Rock Double | #06, #10, #12, #14 | Nhóm 1 giường đôi, giá trung bình |
| Triple Balcony/View | #17, #18 | Nhóm 3 khách |
| Superior King | #07 | Phòng lớn 53m2, khác biệt rõ |
| Family Sea View | #01, #08, #09, #11, #13, #16 | Nhóm gia đình 4 khách |
| Suite 2BR 6 Guests | #10-11, #15-16 | Suite 6 khách |
| Suite 2BR 8 Guests | #08-09 | Suite 8 khách |

Trạng thái: **CHỜ DUYỆT**. Nếu khách muốn giữ đúng 20 phòng, UI vẫn dùng row comparison nhưng cần filter/nhóm mạnh hơn.

---

## 6. Room Detail

### 6.1 Vai trò

RoomDetail là nơi chuyển đổi. Không làm như bài giới thiệu dài. Trang cần giúp người dùng trả lời:

- Phòng này có hợp nhóm mình không?
- Tổng tiền/cọc/còn lại là bao nhiêu?
- Nếu tàu hoãn hoặc đổi kế hoạch thì sao?
- Có thể hỏi người thật trước khi đặt không?

### 6.2 Desktop layout

```text
Gallery 1 ảnh lớn + 4 thumbnail
Breadcrumb + H1
2 cột:
  Trái 7fr: mô tả, tiện nghi, chính sách trẻ em, vị trí, phòng khác
  Phải 5fr: booking panel sticky
```

Booking panel bắt buộc có:

- Ngày nhận/trả.
- Số khách, số trẻ em và tuổi từng trẻ nếu có.
- Breakdown:
  - Tiền phòng.
  - Phụ thu giường/trẻ em.
  - Giảm giá nếu có dữ liệu thật.
  - Thành tiền.
  - Cọc trả khi đặt 50%.
  - Còn lại trả tại quầy.
- Chính sách huỷ dạng bậc thang.
- Dòng nổi bật: **"Tàu hoãn do thời tiết: dời ngày miễn phí"**.
- CTA chính "Đặt phòng".
- CTA phụ "Hỏi phòng này qua Zalo".
- Payment options chỉ là UI: OnePay, chuyển khoản, tại quầy.

### 6.3 Mobile layout

- Gallery swipe full-width.
- Nội dung một cột.
- Sticky bottom bar: "x.xxx.xxxđ · 2 đêm · Đặt phòng".
- Bấm CTA mở bottom-sheet chứa booking panel.
- Bottom-sheet phải có nút đóng, focus trap đúng, hỗ trợ safe-area.

### 6.4 Nội dung trust trong RoomDetail

Không chôn trust ở FAQ cuối trang. Ba dòng sau phải gần CTA:

| Nội dung | Vị trí |
|---|---|
| "Cọc 50%, còn lại trả tại quầy" | Trong breakdown |
| "Tàu hoãn do thời tiết: dời ngày miễn phí" | Ngay trên CTA |
| "Lễ tân xác nhận qua Zalo trong 30 phút" | Dưới CTA hoặc màn thành công |

---

## 7. Checkout và thanh toán

Theo brief, thanh toán chưa phải kỳ vọng chính trong vòng này. Vì vậy:

| Phương thức | Trạng thái v4 | Ghi chú UI |
|---|---|---|
| Thẻ tín dụng OnePay | Option UI, chưa nối cổng | Có radio, mô tả "đang cấu hình" nếu cần |
| Chuyển khoản | Option UI | Hiển thị sau khi xác nhận, không tự bịa số tài khoản |
| Thanh toán tại nơi | Option UI | Phù hợp với khách sợ cọc online |

Không thêm logic payment thật nếu chưa có thông tin merchant/bank/Zalo OA. Không tự bịa số tài khoản.

---

## 8. Zalo, footer và contact

### 8.1 Zalo placeholder

Dùng placeholder fake data có chủ đích:

```ts
const CONTACT_PLACEHOLDER = {
  hotline: '0985 000 650',
  zalo: '0985 000 650',
  zaloOaUrl: null,
  facebookUrl: null,
  tiktokUrl: null,
  youtubeUrl: null,
  status: 'PLACEHOLDER_PENDING_CONFIRMATION'
}
```

CTA Zalo luôn là phụ, không cạnh tranh màu với CTA đặt phòng.

### 8.2 Footer

Footer cần:

- Tên resort.
- Địa chỉ: "Ấp Củ Tron, Đặc Khu Kiên Hải, tỉnh An Giang, Việt Nam" theo crawl contact.
- Hotline.
- Email nếu có thật; nếu chưa có thì không hiển thị.
- MST nếu có dữ liệu nhưng đánh dấu **CHỜ XÁC MINH**.
- Link chính sách không được là `href="#"`.

---

## 9. Ảnh và asset

### 9.1 Nguồn dùng được

| Nguồn | Đánh giá |
|---|---|
| `apps/2026-thenamduhillresort/public/uploads/OP5.png` | Logo chính, 3000x3000, dùng làm brand source |
| `apps/2026-thenamduhillresort/public/uploads/hero-1.jpg` | 2568x1926, có thể dùng about/hero nếu crop ổn |
| `apps/2026-thenamduhillresort/public/uploads/hero-2.jpg` | 2048x1365, tốt cho hero phụ hoặc gallery |
| `resources/scripts/crawl/output/thenamduhill/assets/.../banner2.jpg` | 1920x1080, ứng viên hero chính |
| `.../banner/rooms.jpg` | 1920x640, banner Rooms |
| `.../banner/restaurant.jpg` | 1920x640, Dining |
| `.../room-suite/*cover*.jpg` | Phần lớn 1000x1000, dùng được cho card nếu crop có chủ đích |
| `.../gallery/sua-tam-*` | Nhiều ảnh dạng poster/marketing, không dùng làm gallery chính |

### 9.2 Gán ảnh đề xuất

| Vị trí | Ảnh đề xuất | Ghi chú |
|---|---|---|
| Hero Home | `image_catalog_banner_banner2_rtcx8y.jpg` hoặc `hero-2.jpg` | Kiểm screenshot thật trước khi chốt |
| Rooms banner | `image_catalog_banner_rooms_1voizus.jpg` | Crop wide tự nhiên |
| Dining | `image_catalog_banner_restaurant_1itsfr.jpg` | Dùng section ăn uống |
| About | `hero-1.jpg` hoặc `image_catalog_about_about_1wsv2q2.png` | Tránh crop làm mất resort |
| Room card/detail | `image_catalog_room-suite_*cover*.jpg` | Crop 4:3 hoặc 16:9, không kéo méo |
| Gallery | banner/news/hero ảnh thật, tránh `sua-tam-*` | Không dùng ảnh gắn chữ/logo dày |

### 9.3 Ảnh nên xin/chụp thêm

| Ưu tiên | Ảnh cần có | Tỷ lệ |
|---|---|---|
| 1 | Toàn cảnh resort trên đồi thấy biển lúc sáng/hoàng hôn | 16:9 |
| 2 | 7 ảnh cover đơn đại diện 7 hạng phòng | 4:5 hoặc 3:2 |
| 3 | Bàn ăn/BBQ/hải sản có người thật | 4:3 |
| 4 | Bến tàu/xe đón khách/resort signage | 16:9 |
| 5 | Ảnh xác thực quầy lễ tân/biển hiệu | 4:3 |

---

## 10. Thông điệp song ngữ

| Vị trí | VI | EN |
|---|---|---|
| Hero H1 | Nghỉ trên đồi, thức dậy giữa biển Nam Du | Sleep on the hill, wake up to the Nam Du sea |
| Hero trust | Resort chính chủ trên đồi Củ Tron · Hotline/Zalo 0985 000 650 | Official resort on Cu Tron hill · Hotline/Zalo 0985 000 650 |
| Home CTA | Chọn ngày & xem phòng | Pick dates & see rooms |
| Trust strip | Xe resort đón tại cầu cảng | Resort shuttle pickup at the pier |
| Weather policy | Tàu hoãn do thời tiết: dời ngày miễn phí | Ferry cancelled by weather: reschedule free |
| Rooms CTA | Chọn phòng | Choose room |
| RoomDetail CTA | Đặt phòng | Book this room |
| Zalo CTA | Hỏi phòng này qua Zalo | Ask about this room on Zalo |
| Deposit | Cọc trả khi đặt (50%), còn lại trả tại quầy | 50% deposit now, balance at check-in |
| Success | Lễ tân sẽ nhắn Zalo xác nhận trong 30 phút | Our team will confirm by Zalo within 30 minutes |

---

## 11. Kiến trúc triển khai

### 11.1 Package theme

```text
packages/theme-namdu/
  package.json
  tsconfig.json
  src/
    tokens.css
    tokens.fresh.css
    meta.ts
    index.ts
    composition.tsx
    strings.ts
    sections/
      Header.tsx
      Hero.tsx
      TrustStrip.tsx
      About.tsx
      Rooms.tsx
      Dining.tsx
      Places.tsx
      Gallery.tsx
      Booking.tsx
      Contact.tsx
    pages/
      RoomsPage.tsx
      RoomDetailPage.tsx
    components/
      ButtonPrimary.tsx
      SearchWidget.tsx
      RoomRow.tsx
      BookingPanel.tsx
      PaymentOptions.tsx
      PolicyLadder.tsx
      ZaloFab.tsx
```

### 11.2 Chỗ đăng ký

Giữ đúng ranh giới theme package:

1. Tạo `packages/theme-namdu`.
2. Thêm dependency `@repo/theme-namdu` vào app.
3. Đăng ký theme trong `apps/2026-thenamduhill/src/themes/registry.ts`.
4. Import token/font ở layout app.
5. Thêm transpile package nếu cần.

Không sửa logic giá/availability trong theme. Theme chỉ nhận data từ core.

---

## 12. Backlog triển khai

| Ưu tiên | Việc | Ghi chú |
|---|---|---|
| P0 | Chốt Option A tokens + tạo `tokens.fresh.css` cho Option B | Cho phép demo 2 hướng |
| P0 | Home hero + trust strip + search widget | Chữa lỗi trust trước |
| P0 | Rooms row comparison desktop + card mobile | Trọng tâm so sánh phòng |
| P0 | RoomDetail booking panel + sticky bottom sheet mobile | Trọng tâm chuyển đổi |
| P1 | Gán ảnh thật, crop đúng tỷ lệ | Không kéo méo ảnh vuông |
| P1 | Zalo placeholder + footer không `href="#"` | Tránh tín hiệu thiếu uy tín |
| P1 | Payment option UI | Chỉ radio/summary, chưa nối cổng |
| P2 | Schema SEO cho phòng | Sau khi slug/data ổn |
| P2 | Animation nhẹ đồng bộ | Làm cuối |

---

## 13. Definition of Done

### 13.1 Thiết kế

- [ ] Nhìn toàn trang không còn cảm giác u buồn/tối.
- [ ] Nền sáng chiếm ít nhất 85% diện tích Home/Rooms/RoomDetail.
- [ ] Mỗi viewport chỉ có một CTA chính màu vàng.
- [ ] Không dùng gradient/orb/trang trí rời rạc.
- [ ] Home, Rooms, RoomDetail cùng một ngôn ngữ thiết kế.

### 13.2 Booking UX

- [ ] Home có search booking trong viewport đầu.
- [ ] Rooms so sánh được giá, sức chứa, view, chính sách.
- [ ] RoomDetail có breakdown cọc/còn lại trước khi checkout.
- [ ] "Tàu hoãn do thời tiết: dời ngày miễn phí" nằm gần CTA đặt phòng.
- [ ] Zalo là CTA phụ, không tranh với đặt phòng.

### 13.3 Mobile

- [ ] 375px không overflow ngang.
- [ ] H1 + CTA Home nằm trong viewport đầu.
- [ ] Rooms mobile không dùng table rộng hoặc row ngang.
- [ ] RoomDetail có sticky bottom bar và bottom-sheet dùng được.
- [ ] Tất cả CTA cao tối thiểu 44px.

### 13.4 Nội dung và dữ liệu

- [ ] Không tự bịa số tài khoản, Zalo OA, MST, promotion.
- [ ] Mọi chuỗi chính có VI/EN.
- [ ] 20 phòng crawl được giữ hoặc gộp theo bảng đã duyệt.
- [ ] Ảnh crawl được đánh dấu DEV-ONLY nếu chưa có quyền production.

### 13.5 Kỹ thuật

- [ ] Theme không gọi API và không tính giá riêng.
- [ ] Không hex màu ngoài token.
- [ ] Focus state thấy rõ, không `outline: none`.
- [ ] Ảnh dùng `next/image`, có `sizes`, hero priority.
- [ ] Đo lại contrast các cặp màu chính trước PR.
- [ ] Lint/typecheck pass.

---

## 14. Rủi ro còn mở

| Rủi ro | Ảnh hưởng | Cách xử lý |
|---|---|---|
| Chưa có Zalo OA thật | Cao với trust | Dùng placeholder, hỏi khách sau, không bịa |
| Chưa xác minh MST/chủ sở hữu | Cao | Đánh dấu pending confirmation |
| 20 phòng có thể quá nhiều | Trung bình | Trình bảng gộp 7 nhóm, chờ duyệt |
| Ảnh phòng nhiều ảnh vuông/collage | Trung bình | Crop có chủ đích, xin ảnh cover đơn |
| Thanh toán thật chưa nối | Trung bình | UI option trước, triển khai cổng sau |

---

## 15. Việc sau khi chốt v4

1. Dựng theme `@repo/theme-namdu` theo Option A.
2. Render 3 trang `/h5`, `/h5/rooms`, `/h5/rooms/[slug]`.
3. Chụp screenshot desktop/mobile để so với v3.
4. Nếu khách vẫn thấy thiếu "đảo hoang sơ", đổi sang token Option B mà không đổi layout.
5. Sau khi 3 trang chính đạt, mới làm thanh toán thật, chính sách thật, Zalo OA thật và animation.
