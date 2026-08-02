# Rules — Luồng màn hình client & CMS

Hợp đồng luồng cho sản phẩm Booking Hotel. Nghiệp vụ ở
[booking-domain.md](./booking-domain.md) · Token ở
[design-tokens.md](./design-tokens.md).

---

## F0 — Bản đồ route

```
CÔNG KHAI (không cần đăng nhập)
  /                     hub — danh sách 4 mẫu giao diện
  /h1 /h2 /h3 /h4       trang chủ từng mẫu
  /[theme]/rooms        danh sách hạng phòng
  /[theme]/rooms/[id]   chi tiết hạng phòng
  /[theme]/blog         blog
  /login                ĐĂNG NHẬP  ← có ?next= để quay lại

CẦN ĐĂNG NHẬP
  /[theme]/booking      luồng đặt phòng (bước 3 trở đi)
  /my-orders            lịch sử đơn
  /my-orders/[id]       chi tiết đơn

CMS
  /admin/login
  /admin/**             xem §F5
```

---

## F1 — Đăng nhập

**Chốt với khách:** đăng nhập là **bắt buộc**, chặn ở bước bấm "Đặt phòng"
sau khi khách đã chọn ngày và chọn phòng.

### Nút đăng nhập trên header

Mọi trang công khai có một **icon nhỏ ở top header**, cạnh nút chuyển ngôn ngữ:

```
┌──────────────────────────────────────────────────────┐
│  LOGO      Phòng  Ẩm thực  Tour  Liên hệ   VI|EN  ⟨👤⟩│
└──────────────────────────────────────────────────────┘
                                                     ↑
                    chưa login → icon người, bấm ra /login
                    đã login  → avatar + tên, bấm ra menu:
                                 Đơn của tôi / Đăng xuất
```

Yêu cầu: icon SVG (không emoji), target chạm ≥ 24×24px, có `aria-label` song ngữ.

### Luồng chặn

```
① Chọn ngày + số khách   ┐
② Chọn hạng phòng + gói  ┘ tự do, KHÔNG chặn
        │
   bấm [Đặt phòng]
        │
   đã đăng nhập? ──── không ──→  /login?next=/h1/booking
        │ có                          │
        │                        đăng nhập xong
        │                             │
        ↓←───────── fallback ─────────┘
③ Thông tin khách
④ Thanh toán
⑤ Thành công
```

Điều kiện bắt buộc: **giỏ hàng không được mất** khi đi qua login. Lựa chọn phòng
nằm trong `cart.store` có persist, nên quay lại là còn nguyên.

### Màn hình `/login`

Chưa có — phải dựng mới. Layout tối giản, một cột giữa màn hình:

```
┌────────────────────────────────────┐
│              [LOGO]                │
│                                    │
│         Đăng nhập                  │
│  Nhập số điện thoại hoặc email     │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ Số điện thoại / Email        │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │      Tiếp tục                │  │
│  └──────────────────────────────┘  │
│                                    │
│  ── hoặc ──                        │
│  Mã OTP demo: 1234                 │
│                                    │
│  ← Về trang chủ          VI | EN   │
└────────────────────────────────────┘
```

Hai bước: nhập định danh → nhập OTP 4 số. Bản demo chấp nhận OTP `1234` và
hiện gợi ý ngay trên màn hình (đây là demo, không phải production).

**Bắt buộc:** layout song ngữ VI/EN, chuyển ngôn ngữ ngay tại màn login.

Sau khi đăng nhập:
- Có `?next=` → điều hướng về đúng đó (fallback về thanh toán)
- Không có → về `/my-orders`

---

## F2 — Luồng đặt phòng, 4 bước

### Bước 1 — Tìm

Trên hero mỗi theme: nhận phòng · trả phòng · số khách → bấm Tìm.
Kết quả: danh sách hạng phòng **còn trống**, kèm giá đã tính cho đúng khoảng
ngày đó (không phải giá niêm yết).

Trạng thái rỗng phải nói rõ: *"Hết phòng cho 20/8–22/8. Thử ngày khác hoặc giảm
số khách."* — không phải "Không có kết quả".

### Bước 2 — Chọn

Chọn hạng phòng → chọn gói giá (`RatePlan`) → chọn dịch vụ thêm (`Addon`).

Bên phải là **thanh tóm tắt dính (sticky)** hiện breakdown giá theo đúng mẫu ở
[booking-domain.md §B4](./booking-domain.md). Giá đổi là breakdown đổi ngay.

Ô nhập mã khuyến mãi nằm ở đây. Mã sai → báo lỗi bằng chữ, không chỉ đổi màu.

### Bước 3 — Thông tin khách *(sau login)*

Họ tên · SĐT · Email · CCCD (tuỳ chọn) · Giờ đến dự kiến · Yêu cầu đặc biệt ·
Xuất hoá đơn VAT (mở ra MST + tên công ty).

Trường đã có từ tài khoản thì điền sẵn.

### Bước 4 — Thanh toán

Chọn phương thức: chuyển khoản · thẻ · tại quầy. Bản demo **chỉ là giao diện**
→ bấm Xác nhận là chuyển thẳng sang thành công, không gọi cổng nào.

Hiện rõ: tổng tiền, **cọc phải trả bây giờ**, số còn lại trả tại quầy.

### Bước 5 — Thành công

Mã đơn (`ĐH-2026-0042`) · QR code · tóm tắt · nút "Xem đơn của tôi".
Đồng thời **bắn một thông báo vào chuông**.

---

## F3 — Chuông thông báo (client)

Icon chuông cạnh avatar trên header. Badge đỏ khi có thông báo chưa đọc.

Nội dung một thông báo — đúng như khách yêu cầu:

```
┌───────────────────────────────────────────────┐
│ 🔔 Thông báo                          Đọc hết │
├───────────────────────────────────────────────┤
│ ● Thanh toán thành công                       │
│   Bungalow Hướng Biển · 2 đêm                 │
│   4.245.750đ                                  │
│   02/08/2026 14:32                            │
├───────────────────────────────────────────────┤
│   Đơn ĐH-2026-0041 đã được xác nhận           │
│   01/08/2026 09:15                            │
└───────────────────────────────────────────────┘
```

Sự kiện sinh thông báo: đặt thành công · admin xác nhận · admin huỷ ·
nhắc trước ngày nhận phòng 1 ngày · check-out xong (mời đánh giá).

Lưu trong `notify.store` có persist.

---

## F4 — Trang "Đơn của tôi"

Ba tab: **Sắp tới · Đã ở · Đã huỷ**.

Dùng đúng **format bảng** ở §F6.

Chi tiết đơn có: dòng thời gian trạng thái, breakdown giá, QR check-in, nút
huỷ **hiện rõ mất bao nhiêu tiền** trước khi bấm, nút "Đặt lại".

Ngoài ra: **tra cứu không cần đăng nhập** — nhập mã đơn + SĐT là xem được. Rất
hay dùng khi người này đặt cho người khác.

---

## F5 — CMS

### Nguyên tắc số một: CMS quản **nội dung**, không quản **màn hình**

Khách đề xuất *"quản lý các màn hình, home thêm/xoá/sửa hero…"*. **Không làm
theo cách đó.** Nếu CMS gắn với màn hình thì 4 theme thành 4 bộ form quản trị,
và theme thứ 20 là sập — vi phạm chính luật R5.

Admin sửa **"Tiêu đề hero"**; dữ liệu đó chảy vào cả 4 theme. Theme quyết định
*trình bày thế nào*, admin quyết định *nói gì*. Đây đúng là mệnh đề "1 CMS data,
N render".

### Một layout CMS dùng chung cho cả 4 HOME

Chốt với khách: **một layout admin duy nhất**, không phải 4. CMS là công cụ nội
bộ, không cần mang bản sắc theme.

### Cây điều hướng

```
Tổng quan
  └ Bảng hôm nay          arrivals / departures / in-house / công suất

Vận hành
  ├ Đơn hàng              ← bảng chính, xem §F6
  ├ Lịch tồn kho          ← màn hình quan trọng nhất
  ├ Lịch phòng (Gantt)
  ├ Khách hàng
  └ Buồng phòng

Giá & Khuyến mãi
  ├ Hạng phòng & giá gốc
  ├ Gói giá (RatePlan)
  ├ Mùa & ngày lễ
  └ Khuyến mãi            ← màn riêng, xem booking-domain §B4

Nội dung
  ├ Thông tin cơ sở
  ├ Nội dung trang chủ    theo section id của luật R7
  ├ Hạng phòng (nội dung)
  ├ Ẩm thực / Tour / Điểm đến
  ├ Thư viện ảnh
  ├ Blog
  └ Menu & Footer

Hệ thống
  ├ Tài khoản             2 tab: Khách hàng | Quản trị viên
  ├ Phân quyền
  ├ Nhật ký hoạt động
  └ Cài đặt
```

### Màn hình lịch tồn kho

Đây là màn hình lễ tân nhìn cả ngày:

```
                 15/8  16/8  17/8  18/8  19/8  20/8
Bungalow biển     3/10  2/10  0/10  1/10  5/10  8/10
  giá            1.2tr 1.2tr 1.8tr 1.8tr 1.2tr 1.2tr
Villa gia đình    1/4   1/4   0/4   0/4   2/4   4/4
  giá            2.5tr 2.5tr 3.5tr 3.5tr 2.5tr 2.5tr
```

Click một ô → sửa giá / đóng bán / đổi số phòng mở bán ngay tại chỗ. Đây chính
là "giao diện calendar" và "cho phép nhập thủ công, bật/tắt riêng" mà khách yêu
cầu.

Ô hết phòng tô `--color-danger-bg`, sắp hết tô `--color-warning-bg` — **kèm chữ**,
không chỉ màu (luật D4).

### Đơn hàng sau khi khách thanh toán

Trả lời câu hỏi của khách: đơn nằm ở trạng thái nào và admin làm gì tiếp.

```
Khách bấm "Xác nhận thanh toán"
        ↓
   pending_payment      ← đơn xuất hiện ở CMS NGAY, badge vàng "Chờ xác nhận"
        ↓
   admin đối soát tiền cọc, bấm [Xác nhận]
        ↓
   confirmed            ← badge xanh dương, phòng bị trừ khỏi tồn kho chắc chắn
        ↓
   ngày khách đến, lễ tân bấm [Nhận phòng]
        ↓  ← MỞ FORM NHẬN PHÒNG (xem dưới)
   checked_in           ← badge tím, phòng vật lý đã được gán
        ↓
   ngày trả, lễ tân bấm [Trả phòng]
        ↓  ← MỞ FORM TRẢ PHÒNG (xem dưới)
   checked_out          ← badge xám, đơn đóng
```

Nhánh phụ: `cancelled` (huỷ bất kỳ lúc nào trước check-in, hệ thống tự tính
hoàn tiền theo §B5) · `no_show` (quá ngày nhận phòng chưa tới).

### Form nhận phòng — các field bổ sung khách yêu cầu

Mở ra khi lễ tân bấm [Nhận phòng]:

| Trường | Kiểu | Bắt buộc |
|---|---|---|
| Gán phòng vật lý | chọn từ các `RoomUnit` trống của hạng đó | ✅ |
| Số CCCD / Hộ chiếu | text | ✅ (khai báo lưu trú) |
| Số khách thực tế | người lớn + trẻ em | ✅ |
| Giờ nhận thực tế | time, mặc định giờ hiện tại | ✅ |
| Nhận phòng sớm | checkbox → hiện phụ phí | |
| Biển số xe | text | |
| Ghi chú lễ tân | textarea | |

Lưu xong: đơn → `checked_in`, `RoomUnit` → `occupied`, ghi `ActivityLog`.

### Form trả phòng — comment khi kết thúc

Mở ra khi bấm [Trả phòng]:

| Trường | Kiểu |
|---|---|
| Giờ trả thực tế | time |
| Trả phòng muộn | checkbox → phụ phí |
| Phát sinh tại phòng | danh sách dòng: mô tả + số tiền (minibar, hư hỏng) |
| Số tiền thu thêm | tự tính, cho phép sửa |
| Đã thanh toán đủ | checkbox — chưa tick thì không cho đóng đơn |
| **Nhận xét kết thúc** | textarea — ghi chú của lễ tân về lượt lưu trú |
| Đánh giá khách | 1–5 sao, nội bộ ("khách tốt", "ồn ào") |

Lưu xong: đơn → `checked_out`, `RoomUnit` → `dirty` (chờ dọn), ghi `ActivityLog`,
cập nhật `Customer.totalSpent` và `Customer.stayCount`.

---

## F6 — Format bảng chuẩn

Khách nói rõ thích layout bảng đầy đủ thông tin. Đây là mẫu, **mọi bảng danh
sách trong CMS và trang Đơn của tôi đều theo**:

```
┌────────────────────────────────────────────────────────────────────────┐
│  Danh sách đơn hàng                                    [Xuất Excel]    │
│  128 đơn                                                               │
├────────────────────────────────────────────────────────────────────────┤
│  [🔍 Tìm mã đơn, tên, SĐT…] [30 ngày qua ▾] [Hạng phòng ▾]            │
│  [Trạng thái ▾] [Kênh ▾]  Đặt lại                                      │
├──┬──────────┬─────────────┬────────┬──────────┬─────────┬──────┬───────┤
│☐ │ MÃ ĐƠN   │ KHÁCH HÀNG  │ HẠNG   │ NHẬN–TRẢ │ TỔNG    │ T.T. │ THAO  │
├──┼──────────┼─────────────┼────────┼──────────┼─────────┼──────┼───────┤
│☐ │ĐH-26-0042│ Nguyễn Văn A│Bungalow│20/8–22/8 │4.245.750│●Chờ  │👁 ✏ 🗑│
│  │ 02/08 14:32│ 0901234567│ 2 đêm  │ 2 khách  │ cọc 30% │ x.n. │       │
├──┴──────────┴─────────────┴────────┴──────────┴─────────┴──────┴───────┤
│  Hiển thị 1–10 trong 128 đơn          ← Trước  [1] 2 3  Sau →          │
└────────────────────────────────────────────────────────────────────────┘
```

Thành phần bắt buộc:

| Phần | Yêu cầu |
|---|---|
| Tiêu đề + đếm | "Danh sách đơn hàng" / "128 đơn" |
| Ô tìm kiếm | placeholder nói rõ tìm được gì |
| Bộ lọc | dropdown + nút **Đặt lại** |
| Chọn nhiều | checkbox cột đầu + checkbox chọn tất cả ở header |
| Header | in hoa, `--font-size-xs`, `--color-text-tertiary`, `scope="col"` |
| Badge trạng thái | chấm màu **+ chữ** (không chỉ màu) |
| Ô hai dòng | dòng chính đậm + dòng phụ nhạt (mã đơn / thời gian) |
| Số liệu | canh phải, font đều (`tabular-nums`) |
| Thao tác | icon SVG có `aria-label` rõ ("Xem đơn ĐH-26-0042") |
| Phân trang | "Hiển thị x–y trong z" + Trước/Sau |
| Trạng thái rỗng | câu nói rõ phải làm gì tiếp |
| Mobile | < 640px đổi sang thẻ, **không** cuộn ngang bảng |

Cột phải đọc từ trái sang phải theo thứ tự quan trọng: **định danh → chủ thể →
nội dung → thời gian → tiền → trạng thái → thao tác**.

---

## F7 — Nguồn dữ liệu demo

Ba giai đoạn, mỗi giai đoạn không phá giai đoạn trước:

| GĐ | Cách làm | Trạng thái |
|---|---|---|
| 1 | Zustand + persist(localStorage), seed sẵn ~30 đơn rải 60 ngày | ← đang làm |
| 2 | Next.js Route Handlers `app/api/**` gọi vào cùng repository | sau |
| 3 | Supabase (Postgres + Auth OTP + Realtime + RLS) | sau |

Chốt: **không dùng mock API bên ngoài** (MockAPI.io, json-server). Chúng là ngõ
cụt — viết code gọi API kiểu A rồi phải viết lại khi có backend thật.

`packages/core/src/repository.ts` đã `async` sẵn từ đầu, nên chuyển giai đoạn
**không đổi chữ ký hàm** — theme không phải sửa dòng nào.

### Store

```
apps/2026-thenamduhill/src/stores/
  auth.store.ts      user hiện tại, login(), logout()          persist
  cart.store.ts      lựa chọn đang đặt (giữ qua login)         persist
  booking.store.ts   danh sách đơn + chuyển trạng thái         persist
  notify.store.ts    thông báo chuông                          persist
  inventory.store.ts tồn kho theo ngày (admin sửa được)        persist
  promotion.store.ts khuyến mãi (admin CRUD)                   persist
```

Store **chỉ giữ state và gọi vào `core`** — không chứa công thức tính giá
(luật R8).

---

## F8 — SEO

Áp cho mọi trang công khai:

- Server Component + SSG cho trang nội dung; chỉ form đặt phòng mới client-side
- ISR cho trang phòng — giá đổi thì revalidate, không build lại
- `generateMetadata()` riêng từng trang, không dùng title chung
- `next/image`, AVIF/WebP — resort là site nặng ảnh, đây là yếu tố quyết định
- Schema.org: `Hotel` (trang chủ) · `HotelRoom` + `Offer` (từng hạng, để Google
  hiện giá) · `FAQPage` · `BreadcrumbList` · `Article` (blog)
- `hreflang` cặp vi/en, `x-default` trỏ về vi
- Nội dung: viết bài trả lời truy vấn thật ("đi Nam Du mùa nào đẹp", "tàu Rạch
  Giá Nam Du giá vé", "lịch trình Nam Du 3N2Đ") rồi dẫn về trang đặt phòng

⚠️ **Luật R9**: nội dung crawl từ thenamduhill.com đang trong seed. Đẩy lên
production và để Google index thì vừa là vấn đề bản quyền, vừa là duplicate
content **làm hại chính SEO của mình**. Phải thay bằng nội dung tự viết trước
khi lên production.

---

## Tự kiểm

- [ ] Giỏ hàng không mất khi đi qua màn login
- [ ] Màn login có song ngữ VI/EN
- [ ] CMS quản nội dung, không quản màn hình — 4 theme dùng chung một bộ dữ liệu
- [ ] Một layout CMS duy nhất cho cả 4 HOME
- [ ] Mọi bảng theo format §F6, có trạng thái rỗng
- [ ] Badge trạng thái có chữ, không chỉ màu
- [ ] Mọi chuyển trạng thái đơn ghi `ActivityLog`
- [ ] Store không chứa công thức tính giá
