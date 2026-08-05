# Rules — Nghiệp vụ đặt phòng

Mô hình dữ liệu và quy tắc nghiệp vụ của sản phẩm Booking Hotel.
Mọi thứ ở đây sống trong `packages/core` — **không JSX, không CSS** (luật R2).

Bối cảnh: [CLAUDE.md](../../CLAUDE.md) · Luật kiến trúc:
[architecture.md](./architecture.md) · Token: [design-tokens.md](./design-tokens.md)

---

## B0 — Hai thực thể phòng, đừng trộn

Đây là quyết định nền tảng. Nhầm chỗ này thì cả hệ thống sai.

| | `RoomType` — hạng phòng | `RoomUnit` — phòng vật lý |
|---|---|---|
| Ví dụ | "Bungalow Hướng Biển" | 201, 202, 203 |
| Chứa gì | tên, ảnh, mô tả, sức chứa, giá gốc | số phòng, tầng, tình trạng dọn dẹp |
| Khách chọn | ✅ khách đặt **hạng** | ❌ lễ tân gán lúc nhận phòng |
| Số lượng | 5–8 | 30–100 |
| Ai quản | biên tập nội dung | lễ tân / buồng phòng |

**Khách đặt hạng phòng. Lễ tân gán số phòng lúc check-in.** Toàn bộ bài toán
"còn trống không" nằm ở chỗ này: hạng Bungalow có 10 phòng, ngày 20/8 đã bán 8
→ còn 2.

`Room` cũ trong `types.ts` trộn cả hai. Đổi tên thành `RoomType`, giữ alias
`Room` một thời gian để 4 theme không vỡ ngay.

---

## B1 — Bộ type bắt buộc

```
RoomType      hạng phòng (thay cho Room cũ)
RoomTypeExtra chi tiết mở rộng (thay cho RoomExtra cũ)
RoomUnit      phòng vật lý
Inventory     tồn kho + giá theo NGÀY × HẠNG   ← trung tâm
RatePlan      gói giá (tiêu chuẩn / tiết kiệm / trọn gói)
Promotion     chương trình khuyến mãi          ← xem §B4
Booking       đơn hàng
BookingGuest  thông tin khách trên đơn
Payment       lần thanh toán
ActivityLog   nhật ký bất biến trên đơn
Customer      hồ sơ khách, gộp theo SĐT
Notification  thông báo cho chuông
```

### `Inventory` — bảng quan trọng nhất

```ts
interface Inventory {
    date: string          // YYYY-MM-DD
    roomTypeId: string
    totalUnits: number    // tổng phòng vật lý của hạng
    bookedUnits: number   // đã bán
    blockedUnits: number  // đóng thủ công (bảo trì, giữ chỗ)
    priceOverride?: number   // đè giá ngày này; không có thì lấy basePrice
    minNights?: number       // tối thiểu số đêm — hay dùng dịp lễ
    closedToArrival?: boolean   // cấm nhận phòng ngày này
    closedToDeparture?: boolean // cấm trả phòng ngày này
    version: number       // optimistic locking, chống ghi đè đa thiết bị
}
```

`availableUnits = totalUnits - bookedUnits - blockedUnits`

`version` là chốt chặn overbooking khi nhiều lễ tân cùng thao tác. Ghi mà
version không khớp → từ chối, bắt tải lại. Đây là yêu cầu "đảm bảo sync giữa
nhiều thiết bị" của khách.

### `Booking` — vòng đời

```
pending_payment → chờ trả tiền (giữ chỗ 15 phút)
confirmed       → đã cọc/trả đủ, giữ phòng chắc chắn
checked_in      → khách đã đến
checked_out     → đã trả phòng
cancelled       → huỷ (bởi khách hoặc admin)
no_show         → tới ngày không thấy khách
```

Chuyển trạng thái **chỉ đi theo đồ thị này**, không nhảy cóc:

```
pending_payment ──→ confirmed ──→ checked_in ──→ checked_out
       │                │              │
       ├──→ cancelled ←─┤              └──→ cancelled (huỷ giữa chừng, hiếm)
       │                │
       └──→ expired     └──→ no_show
```

`no_show` không được bỏ: nó quyết định hoàn cọc hay không và ảnh hưởng báo cáo.

### Tiền trên đơn — 4 con số, không phải 1

```ts
subtotal        tiền phòng + giường phụ + dịch vụ, TRƯỚC khuyến mãi
discountTotal   tổng giảm giá
totalAmount     subtotal - discountTotal
depositAmount   số tiền cọc yêu cầu (theo %)
paidAmount      đã thu thực tế
balanceDue      totalAmount - paidAmount
```

Rất ít resort Việt thu 100% online. Phổ biến: **cọc 30–50%** chuyển khoản, còn
lại trả tại quầy. Vì vậy `depositAmount` là **nghiệp vụ**, không phải chi tiết
thanh toán — phải có ngay cả khi chưa nối cổng.

### `ActivityLog` — bất biến

Mỗi thay đổi trên đơn ghi một dòng, **không bao giờ sửa hay xoá**:

```ts
interface ActivityLog {
    id: string
    bookingId: string
    at: string            // ISO timestamp
    actorId: string
    actorName: string
    actorRole: Role
    action: LogAction     // 'created' | 'status-changed' | 'note-added' | …
    field?: string
    from?: string
    to?: string
    note?: string
}
```

Đây là thứ cứu bạn khi tranh chấp với khách, và là thứ khách doanh nghiệp luôn
đánh giá cao.

---

## B2 — Khách: số nguyên là không đủ

```ts
interface GuestCount {
    adults: number
    children: number[]   // TUỔI từng trẻ, không phải số lượng
}
```

Chính sách trẻ em theo tuổi — khách Việt luôn hỏi:

```ts
interface ChildPolicy {
    freeUnderAge: number      // dưới 5 tuổi: miễn phí
    halfPriceUntilAge: number // 6–11 tuổi: 50%
    // từ tuổi này trở lên tính như người lớn
}
```

Không lưu tuổi thì không tính được giá, và lễ tân không biết chuẩn bị cũi hay
giường phụ.

---

## B3 — Giá: `basePrice` chỉ là điểm xuất phát

Giá khách sạn Việt Nam đổi theo 5 yếu tố:

| Yếu tố | Thực tế | Mô hình bằng |
|---|---|---|
| Ngày trong tuần | T6–T7 cao hơn 20–40% | `Season.weekendMultiplier` |
| Mùa | cao/thấp điểm | `Season` theo khoảng ngày |
| Lễ Tết | 30/4, 2/9, Tết ×1.5–2 | `Inventory.priceOverride` + `minNights` |
| Số đêm | ở dài giảm giá | `Promotion` kiểu `long-stay` |
| Kênh bán | web rẻ hơn OTA 15–18% | `RatePlan` theo kênh |

### Thứ tự áp giá — cố định, không đổi

```
① basePrice của RoomType
② Season         → nhân hệ số mùa / cuối tuần
③ priceOverride  → nếu ngày đó có, ĐÈ HẲN kết quả ②
④ RatePlan       → cộng/trừ theo gói (±%)
⑤ = giá một đêm cuối cùng
```

`priceOverride` **đè**, không cộng dồn — vì lễ tân set giá ngày lễ là muốn con
số chính xác đó, không muốn hệ thống nhân thêm.

### Công thức tiền phòng

```
tiềnPhòng = Σ (giáMộtĐêm[ngày])   với mọi ngày từ checkIn đến checkOut-1
```

Tính **theo từng đêm**, không lấy `giá × số đêm` — vì mỗi đêm có thể một giá.
Đây là lỗi hay gặp nhất, và là lý do bản `calculatePrice()` đầu tiên đã bị gỡ.
Mọi tính toán nay đi qua `buildQuote()` trong `availability.ts`.

---

## B4 — Khuyến mãi

Màn hình riêng, độc lập với bảng giá. Khuyến mãi **can thiệp vào giá tại thời
điểm áp**, không sửa `basePrice` hay `priceOverride`.

### Kiểu khuyến mãi (7 loại)

| Kiểu | Ý nghĩa | Ví dụ thực tế |
|---|---|---|
| `percent` | Giảm % trên tiền phòng | Giảm 10% hạng Bungalow từ 1/9–30/9 |
| `fixed` | Giảm số tiền cố định | Giảm 200.000đ cho mọi đơn |
| `nth-night-free` | Đêm thứ N miễn phí | Ở 4 đêm, đêm thứ 4 free |
| `long-stay` | Giảm theo bậc số đêm | ≥3 đêm −10%, ≥5 đêm −15% |
| `early-bird` | Đặt sớm trước N ngày | Đặt trước 30 ngày −15% |
| `last-minute` | Đặt sát ngày | Còn ≤3 ngày −20% (xả phòng ế) |
| `free-addon` | Tặng dịch vụ | Tặng đưa đón tàu Rạch Giá |

### Cấu trúc một khuyến mãi

```ts
interface Promotion {
    id: string
    code?: string              // có mã → khách phải nhập; không có → tự động
    name: I18nText
    description: I18nText      // hiện cho khách thấy
    type: PromotionType
    value: number              // % hoặc VNĐ, tuỳ type

    // ---- Điều kiện áp dụng (rules) ----
    conditions: {
        stayFrom?: string        // đêm ở nằm trong khoảng này
        stayTo?: string
        bookFrom?: string        // đơn được tạo trong khoảng này
        bookTo?: string
        roomTypeIds?: string[]   // rỗng = mọi hạng
        ratePlanIds?: string[]
        minNights?: number
        maxNights?: number
        minAmount?: number       // đơn tối thiểu bao nhiêu tiền
        weekdays?: number[]      // 0=CN … 6=T7, chỉ áp cho đêm rơi vào các thứ này
        daysBeforeCheckIn?: number  // early-bird / last-minute
        channels?: Channel[]     // web | phone | walk-in | ota
    }

    // ---- Quy tắc kết hợp ----
    stackable: boolean         // false = độc quyền, huỷ mọi KM khác
    priority: number           // số nhỏ áp trước
    maxDiscount?: number       // trần giảm, ví dụ "giảm 20% nhưng tối đa 500k"

    // ---- Giới hạn số lượng ----
    usageLimit?: number        // tổng lượt dùng
    usageCount: number
    perCustomerLimit?: number

    active: boolean
}
```

### Quy tắc kết hợp — phần dễ sai nhất

**Thuật toán áp khuyến mãi:**

```
① Lọc: giữ lại các KM có active=true, thoả MỌI điều kiện trong conditions,
   chưa vượt usageLimit.
② Sắp xếp theo priority tăng dần (số nhỏ áp trước).
③ Nếu có KM stackable=false:
      chọn DUY NHẤT cái có priority nhỏ nhất trong nhóm đó,
      bỏ toàn bộ KM còn lại.
   Ngược lại:
      áp lần lượt tất cả KM stackable=true.
④ Mỗi lần áp, tính trên SỐ TIỀN CÒN LẠI sau các lần áp trước (cộng dồn nhân),
   KHÔNG cộng % rồi trừ một lần.
⑤ Nếu KM có maxDiscount, cắt phần giảm xuống trần đó.
⑥ discountTotal = Σ các phần giảm. Không bao giờ vượt quá subtotal.
```

**Bước ④ là chỗ hay sai nhất.** So sánh, đơn 1.000.000đ, hai KM 10% và 20%:

| Cách | Phép tính | Kết quả |
|---|---|---|
| ❌ Cộng % rồi trừ | 1.000.000 × (1 − 0.30) | giảm 300.000 |
| ✅ Cộng dồn nhân | 1.000.000 × 0.9 = 900.000 <br> 900.000 × 0.8 = 720.000 | giảm 280.000 |

Chênh 20.000đ mỗi đơn. Một mùa cao điểm là con số thật.

**Chọn cách ✅** vì nó khớp cách khách hiểu ("giảm thêm 20% trên giá đã giảm")
và không bao giờ ra giảm quá 100%.

### Ví dụ đầy đủ — phải hiện đúng như thế này trên màn hình admin

Đơn: 3 đêm hạng Bungalow, 1.500.000đ/đêm, đặt trước 45 ngày.

```
Tiền phòng                        4.500.000đ
Giường phụ (1 × 3 đêm)              450.000đ
Đưa đón tàu (2 khách)               600.000đ
─────────────────────────────────────────────
Tạm tính (subtotal)               5.550.000đ

Khuyến mãi được áp:
  [1] Đặt sớm 45 ngày  −15%   stackable ✓  ưu tiên 10
      5.550.000 × 15%                −832.500đ
      Còn lại: 4.717.500đ
  [2] Ở dài ≥3 đêm     −10%   stackable ✓  ưu tiên 20
      4.717.500 × 10%                −471.750đ
      Còn lại: 4.245.750đ
─────────────────────────────────────────────
Tổng giảm                        −1.304.250đ
Thành tiền                        4.245.750đ
Cọc yêu cầu (30%)                 1.273.725đ
Còn lại trả tại quầy              2.972.025đ
```

**Bảng này phải hiện được cả ở màn khách lẫn màn admin** — cùng một hàm tính,
không ai tính lại (luật R8).

### Màn hình khuyến mãi của admin phải giải thích được

Yêu cầu của khách: *"giải thích nó ở ngay màn hình giảm giá của admin"*. Cụ thể
màn hình phải có:

1. **Bảng danh sách** — mã, tên, kiểu, giá trị, khoảng ngày, trạng thái, đã dùng
   bao nhiêu lượt.
2. **Form tạo/sửa** — mỗi trường có dòng giải thích ngắn ngay dưới. Ví dụ dưới ô
   `stackable`: *"Bật: cộng dồn được với KM khác. Tắt: nếu đơn thoả nhiều KM,
   chỉ KM này được áp."*
3. **Khối "Xem trước cách tính"** — nhập thử một kịch bản (hạng phòng, ngày,
   số đêm) → hiện đúng bảng breakdown ở trên. Đây là thứ khiến admin **tin**
   con số hệ thống đưa ra.
4. **Cảnh báo xung đột** — khi hai KM cùng khoảng ngày cùng hạng phòng và cả hai
   `stackable=false`, hiện cảnh báo nói rõ cái nào sẽ thắng và vì sao
   (priority nhỏ hơn).
5. **Bảng ưu tiên trực quan** — liệt kê KM đang hoạt động theo thứ tự áp, để
   admin thấy ngay dây chuyền tính.

---

## B5 — Chính sách huỷ là dữ liệu, không phải đoạn văn

```ts
interface CancellationRule {
    daysBeforeCheckIn: number   // huỷ trước bao nhiêu ngày
    refundPercent: number       // hoàn bao nhiêu %
}
```

Ví dụ bậc thang:

```
{ daysBeforeCheckIn: 7, refundPercent: 100 }
{ daysBeforeCheckIn: 3, refundPercent: 50  }
{ daysBeforeCheckIn: 0, refundPercent: 0   }
```

Hệ thống tự tính "khách huỷ hôm nay được hoàn bao nhiêu" và **hiện con số đó
trên nút huỷ** trước khi khách bấm. Không bắt admin tra tay.

---

## B6 — Trường bắt buộc mà dễ quên

| Trường | Vì sao |
|---|---|
| `taxCode` + `companyName` | Khách công ty luôn cần hoá đơn VAT |
| `specialRequests` | Trăng mật, sinh nhật, ăn chay — lễ tân cần biết trước |
| `estimatedArrivalTime` | Nam Du phụ thuộc chuyến tàu, giờ đến rất quan trọng |
| `earlyCheckIn` / `lateCheckOut` | Có phụ phí, phải là addon chứ không phải ghi chú |
| `channel` | web / điện thoại / walk-in / OTA — cần cho báo cáo nguồn khách |
| `idNumber` | CCCD, lễ tân ghi lúc nhận phòng (khai báo lưu trú) |

Riêng Nam Du: **đưa đón tàu cao tốc từ Rạch Giá** gần như bắt buộc. Để nó là
addon nổi bật ở đầu danh sách, không chôn giữa các dịch vụ khác.

---

## B7 — Chống overbooking

Ba lớp, phải có đủ:

1. **Giữ chỗ tạm** — khi khách vào bước thanh toán, `blockedUnits += 1` trong
   15 phút. Hết giờ không trả tiền thì nhả ra.
2. **Optimistic locking** — mọi ghi vào `Inventory` kèm `version`. Không khớp →
   từ chối.
3. **Ràng buộc tầng dữ liệu** — khi lên Postgres, dùng `EXCLUDE` constraint trên
   khoảng ngày. Kiểm ở tầng app là không đủ: hai request đồng thời đều lọt.

---

## B8 — Vai trò và quyền

| Vai trò | Xem đơn | Sửa đơn | Sửa giá | Sửa nội dung | Quản tài khoản |
|---|---|---|---|---|---|
| `owner` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `manager` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `receptionist` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `editor` | ❌ | ❌ | ❌ | ✅ | ❌ |
| `customer` | chỉ đơn của mình | huỷ đơn của mình | ❌ | ❌ | ❌ |

Lễ tân **không được sửa giá** — đây là câu hỏi khách doanh nghiệp luôn đặt ra.

---

## Tự kiểm

- [ ] `core` vẫn không có JSX/CSS
- [ ] Mọi chuỗi khách thấy đều `{vi, en}` (luật R6)
- [ ] Tiền phòng tính **theo từng đêm**, không nhân gộp
- [ ] Khuyến mãi cộng dồn **nhân**, không cộng %
- [ ] `discountTotal` không bao giờ > `subtotal`
- [ ] Mọi chuyển trạng thái đơn ghi `ActivityLog`
- [ ] Không theme nào tự tính giá
