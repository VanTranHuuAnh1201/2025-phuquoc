# Ánh xạ TS ↔ SQL — Schema Nam Du Hill v1.0.0

> **Đầu ra của ticket `000-01`** (SA). Đây là hợp đồng schema cuối cùng.
> `200-01` viết migration **theo đúng tài liệu này**, không tự quyết thêm.
>
> Nguồn sự thật: `packages/core/src/booking-types.ts` + `packages/core/src/types.ts`.
> **SQL bám theo TS, không ngược lại** (luật BE8).
>
> Thay thế hoàn toàn schema nháp 8 bảng ở Bản Dev `§1.2`. Chỗ nào tài liệu này
> khác bản nháp thì tài liệu này thắng — lý do ghi ở §10.

---

## 0. Sáu quyết định nền tảng (đọc trước khi viết dòng SQL nào)

| # | Quyết định | Chốt |
|---|---|---|
| **Q1** | Khoá chính | **`TEXT` slug do ứng dụng cấp**, KHÔNG `UUID` cho bảng danh mục |
| **Q2** | `I18nText` | **`jsonb` một cột** `{"vi":"…","en":"…"}` |
| **Q3** | `Room` + `RoomExtra` | **GỘP** thành một bảng `room_types` |
| **Q4** | Mô hình giá | **`base_price` + `seasons` + `inventory.price_override` + `rate_plans`**. Bỏ hẳn 3 cột `base_price_weekday/weekend/holiday` |
| **Q5** | `remaining_amount` | **KHÔNG lưu cột.** Dùng `GENERATED ALWAYS AS (total_amount - paid_amount) STORED` |
| **Q6** | Enum | **`VARCHAR + CHECK`**, giữ **nguyên xi** chuỗi TS (`'pending_payment'`, `'checked_in'`, `'bank-transfer'`…) |

Chi tiết lý do ở §1–§6.

---

## 1. Q1 — Khoá chính là `TEXT` slug, không phải `UUID`

### Vấn đề

Schema nháp dùng `UUID PRIMARY KEY DEFAULT gen_random_uuid()` cho mọi bảng.
Nhưng TS và toàn bộ dữ liệu seed đang dùng **id chuỗi có nghĩa**:

```ts
// packages/core/src/data/nam-du-hill.ts
{ id: 'room-suite-sea',  … }
{ id: 'addon-ferry',     … }
// packages/core/src/data/operations.seed.ts
{ id: 'standard',        … }   // RatePlan
{ id: 'high-summer',     … }   // Season
```

Những id này **đã bị hard-code trong dữ liệu và trong quan hệ chéo**:
`RatePlan.roomTypeIds`, `PromotionConditions.roomTypeIds`,
`Booking.addons` (khoá của `Record<string, number>` chính là `Addon.id`),
`BookingPriceLine.refId`, `roomBusinessInfo` khớp theo `Room.id`.

Đổi sang UUID thì phải viết một bảng tra `slug → uuid` và dịch ở mọi tầng — đúng
loại "tầng chuyển đổi thừa" mà §1 của ticket muốn tránh.

### Chốt

| Nhóm bảng | Kiểu PK | Lý do |
|---|---|---|
| Danh mục do biên tập/seed quyết định: `room_types`, `rate_plans`, `seasons`, `addons`, `promotions` | `TEXT PRIMARY KEY` | id đã nằm trong seed và trong quan hệ chéo dạng mảng |
| Bản ghi do hệ thống sinh: `bookings`, `payments`, `activity_logs`, `notifications`, `room_units`, `accounts` | `UUID PRIMARY KEY DEFAULT gen_random_uuid()` | không ai gõ tay, không nằm trong seed |
| `inventory` | PK tự nhiên **`(room_type_id, date)`** | xem §3 |

Ràng buộc bắt buộc cho mọi PK dạng `TEXT`:

```sql
CONSTRAINT chk_<bảng>_id_slug CHECK (id ~ '^[a-z0-9][a-z0-9-]{1,62}$')
```

Chặn id có dấu, có khoảng trắng, có chữ hoa — vì id đi vào URL và đi vào khoá
`jsonb`.

---

## 2. Q2 — `I18nText` lưu bằng `jsonb`, không phải hai cột

### Ba phương án đã cân nhắc

| Phương án | Ưu | Nhược |
|---|---|---|
| Hai cột `name_vi` / `name_en` | Query đơn giản, index dễ | `RoomExtra.amenities: I18nText[]` cần **mảng của cặp** → phải sinh bảng con. `PropertyData` có ~40 trường `I18nText` → ~80 cột |
| Bảng phụ `translations(entity, field, locale, text)` | Thêm ngôn ngữ không sửa schema | Mọi truy vấn phải join 5–10 lần. Quá nặng cho 2 ngôn ngữ cố định |
| **`jsonb` một cột** ✅ | Map 1:1 với TS `Record<Locale,string>`, `I18nText[]` thành `jsonb` mảng tự nhiên | Không index trực tiếp được → xem xử lý dưới |

### Chốt: `jsonb`

Lý do quyết định: TS `type I18nText = Record<Locale, string>` — `jsonb` là ánh
xạ **không mất mát và không cần adapter**. `SELECT name FROM room_types` trả về
đúng object mà TS mong đợi, không phải ghép `{vi: row.name_vi, en: row.name_en}`
ở mọi repository function.

Ràng buộc bắt buộc — `jsonb` không tự đảm bảo đủ hai ngôn ngữ (luật R6/C7). Dùng
domain để khỏi lặp CHECK ở mọi cột:

```sql
CREATE DOMAIN i18n_text AS jsonb
    CHECK (
        jsonb_exists(VALUE, 'vi') AND jsonb_exists(VALUE, 'en')
        AND jsonb_typeof(VALUE -> 'vi') = 'string'
        AND jsonb_typeof(VALUE -> 'en') = 'string'
        AND length(VALUE ->> 'vi') > 0
        AND length(VALUE ->> 'en') > 0
    );

-- Mảng chuỗi song ngữ: I18nText[]
CREATE DOMAIN i18n_text_array AS jsonb
    CHECK (
        jsonb_typeof(VALUE) = 'array'
        AND NOT EXISTS (
            SELECT 1 FROM jsonb_array_elements(VALUE) e
            WHERE NOT (jsonb_exists(e, 'vi') AND jsonb_exists(e, 'en'))
        )
    );
```

> ⚠️ **Cho BE — vì sao dùng `jsonb_exists(VALUE,'vi')` chứ không phải `VALUE ? 'vi'`:**
> hai cách tương đương về ngữ nghĩa, nhưng `?` là ký tự placeholder của nhiều
> driver (node-postgres, postgres-js). Migration chạy qua Supabase CLI thì `?`
> không sao, nhưng nếu sau này ai đó chạy cùng câu SQL này qua driver Node thì
> `?` bị nuốt mất và lỗi rất khó truy. **Dùng dạng hàm ở mọi nơi** — không phụ
> thuộc driver. Bản DDL chính thức ở §9.1 dùng đúng dạng này.

> ⚠️ **Giới hạn của `CREATE DOMAIN … CHECK`**: ràng buộc domain chỉ kiểm khi
> **gán giá trị vào cột kiểu domain**. Nó KHÔNG kiểm được các `I18nText` nằm
> lồng bên trong một `jsonb` tự do (ví dụ `bookings.price_lines[].label`,
> `notifications.payload.roomTypeName`). Những chỗ đó **ứng dụng phải tự bảo đảm
> đủ `{vi,en}`** — TS đã ép kiểu sẵn nên chỉ cần không `as any` khi ghi (luật C1).

**Index tìm kiếm** (CMS có ô tìm theo tên phòng):

```sql
CREATE INDEX idx_room_types_name_vi ON public.room_types ((name ->> 'vi'));
CREATE INDEX idx_room_types_name_en ON public.room_types ((name ->> 'en'));
```

Chỉ tạo index cho trường **thật sự được tìm kiếm** (`room_types.name`,
`promotions.name`) — không rải index lên cả 40 cột jsonb.

---

## 3. Q3 — `Room` + `RoomExtra` gộp thành một bảng `room_types`

### Hiện trạng trong TS

`interface RoomType` **không tồn tại**. Vai trò đó do `Room` (`types.ts:76`) đảm
nhiệm, và `Room.id` chính là `roomTypeId` de-facto — bằng chứng
`data/demo-generator.ts` gán `roomTypeId: room.id` khi dựng `Inventory`, và
`availability.ts` dùng `room.id` làm khoá `inventoryKey(room.id, date)`.

`RoomExtra` (`types.ts:99`) **không có `id`**; nó nằm trong
`PropertyData.roomExtras: Record<string, RoomExtra>` với **khoá chính là `Room.id`**.

### Chốt: GỘP

Một bảng `room_types` chứa cả trường của `Room` lẫn `RoomExtra`.

**Lý do:**

1. Quan hệ đã là **1–1 bắt buộc theo cùng một khoá**. Tách hai bảng nối bằng
   `room_type_id` chỉ tạo thêm một JOIN mà không bao giờ có hàng mồ côi hay hàng
   thừa — đó là 1–1 giả tạo.
2. Cả hai đều do **một người sửa** (biên tập nội dung), cùng vòng đời, cùng lúc.
   Tách bảng nghĩa là mỗi lần sửa hạng phòng phải ghi hai bảng trong một
   transaction — thêm rủi ro, không thêm giá trị.
3. `RoomExtra` không có `id` → tách bảng buộc phải **bịa ra một PK** hoặc dùng
   `room_type_id` làm PK. Cái sau chính là định nghĩa của "nên gộp".

**Hệ quả cho repository (BE phải làm ở `200-01`):** `getRoomExtra(roomId)` đọc
cùng một hàng với `getRoom(roomId)`, chỉ trả về tập con các cột. Chữ ký hàm
**không đổi** — đúng nguyên tắc `repository.ts` async sẵn.

**Không sửa `types.ts`.** `Room` và `RoomExtra` giữ nguyên là hai interface;
chúng chỉ tình cờ cùng ở một bảng.

### Trường `remaining` — KHÔNG lên DB

`Room.remaining` (`types.ts:94`) là **số phòng trống còn lại** để hiện badge
"chỉ còn N phòng". Đây là **giá trị dẫn xuất từ `inventory`** cho một khoảng
ngày cụ thể, không phải thuộc tính của hạng phòng.

Lưu cột là mời gọi đúng cái dark pattern mà luật FE13/P10 cấm ("cấm bịa khan
hiếm"). Con số này **luôn tính từ `availableUnits(inventory)` tại thời điểm hỏi**.
Trường TS giữ lại vì seed demo đang dùng; repository Supabase để `undefined` và
để `checkAvailability()` trả `availableUnits` thật.

---

## 4. Q4 — Một mô hình giá duy nhất

### Hai cách đang mâu thuẫn

| | Schema nháp §1.2 | TypeScript |
|---|---|---|
| Cách mô hình | 3 cột cố định `base_price_weekday` / `_weekend` / `_holiday` + `min_nights_holiday` | `Room.price` (base) → `Season.multiplier`/`weekendMultiplier` → `Inventory.priceOverride` → `RatePlan.adjustPercent` |
| Ai cài đặt | chưa có | `pricing.ts:calculateNightlyPrice()` — **đã chạy, 4 theme đang dùng** |

### Chốt: theo TypeScript. Bỏ hẳn 3 cột giá cố định.

**Lý do:**

1. Ba cột cố định **không biểu diễn được** những thứ nghiệp vụ đã chốt ở
   `booking-domain.md §B3`: mùa cao/thấp điểm theo khoảng ngày (Nam Du có mùa mưa
   T9–T11 giảm 20%), giá ngày lễ **chính xác từng ngày** (30/4 khác 1/5), và
   gói giá theo kênh bán. "Holiday" trong 3 cột là một mức duy nhất cho mọi lễ.
2. `Inventory.price_override` đã bao trọn vai trò của `base_price_holiday`, và
   làm tốt hơn: lễ tân set đúng con số cho **đúng một ngày**.
3. `Inventory.min_nights` đã bao trọn `min_nights_holiday`, và cho phép khác nhau
   giữa các ngày lễ.
4. Đảo ngược thì phải viết lại `pricing.ts`, `availability.ts` và mọi nơi 4 theme
   gọi vào — đúng thứ ticket này sinh ra để ngăn.

**Thứ tự áp giá cố định (BE cài đặt trong `200-02` phải khớp `pricing.ts`):**

```
① room_types.base_price
② seasons.multiplier (hoặc weekend_multiplier nếu đêm rơi T7/CN)
③ inventory.price_override  → ĐÈ HẲN kết quả ②, không nhân tiếp
④ rate_plans.adjust_percent → price × (1 + adjust_percent/100)
⑤ làm tròn Math.round → giá một đêm
```

Tiền phòng = **tổng giá từng đêm**, không phải `giá × số đêm` (luật BE6/C6).

### `booking_surcharges` của bản nháp — bỏ, thay bằng `price_lines` jsonb

Bản nháp có bảng `booking_surcharges(category, description, amount, is_manual)`.
TS đã có `BookingPriceLine[]` (`booking-types.ts:428`) phủ đúng vai trò đó cho
phần **tính giá lúc đặt**, và `CheckOutRecord.incidentals: IncidentalCharge[]`
cho phần **phát sinh lúc trả phòng**.

Chốt: **không tạo bảng `booking_surcharges`**. Lý do ở §7 (quy tắc value object).

---

## 5. Q5 — `remaining_amount` không lưu cột, dùng cột sinh

TS `Booking` có bốn con số tiền + `paidAmount`, **không có** `remainingAmount`;
`balanceDue` được `buildQuote()` tính ra tại chỗ (`availability.ts:273`).

Bản nháp có `remaining_amount DECIMAL(12,2) NOT NULL` — nguy cơ lệch số với
`total_amount - paid_amount` mỗi khi ghi thiếu một chỗ.

### Chốt: `GENERATED ALWAYS AS … STORED`

```sql
remaining_amount DECIMAL(12,2)
    GENERATED ALWAYS AS (total_amount - paid_amount) STORED
```

**Lý do chọn cái này thay vì bỏ hẳn cột hay dùng trigger:**

- Postgres tự bảo đảm đồng bộ. **Không thể** ghi lệch — cột không nhận `INSERT`
  hay `UPDATE`.
- Vẫn `SELECT` và `WHERE remaining_amount > 0` được (báo cáo công nợ của lễ tân),
  vẫn index được. Bỏ hẳn cột thì mất khả năng lọc/sắp xếp phía DB.
- Trigger làm được điều tương tự nhưng là code phải bảo trì và có thể bị vô hiệu
  hoá; cột sinh là ràng buộc của schema.

Cùng lý do, **`total_amount` KHÔNG dùng cột sinh** dù `= subtotal - discount_total`:
nó là con số đã chốt với khách trên hợp đồng, phải bất biến kể cả khi sau này ai
đó sửa `subtotal`. Thay vào đó ràng buộc bằng CHECK (§8).

---

## 6. Q6 — Enum: `VARCHAR + CHECK`, giữ nguyên xi chuỗi TS

### Chọn `VARCHAR + CHECK`, không dùng `CREATE TYPE … AS ENUM`

| | `ENUM` Postgres | `VARCHAR + CHECK` ✅ |
|---|---|---|
| Thêm giá trị | `ALTER TYPE … ADD VALUE`, **không chạy được trong transaction** ở PG < 12 và vẫn không xoá được giá trị | Sửa CHECK trong migration mới, bình thường |
| Supabase PostgREST | trả về string, ok | trả về string, ok |
| Sửa sai | phải tạo type mới + chuyển cột | `DROP CONSTRAINT` + `ADD CONSTRAINT` |

Migration đi một chiều (BE7) → chọn cái dễ sửa bằng file mới.

### Bảng ánh xạ enum — giá trị PHẢI KHỚP TỪNG KÝ TỰ

| Type TS | Nguồn | Giá trị (giữ nguyên xi) |
|---|---|---|
| `BookingStatus` | `booking-types.ts:291` | `'pending_payment'`, `'confirmed'`, `'checked_in'`, `'checked_out'`, `'cancelled'`, `'no_show'`, `'expired'` |
| `RoomUnitStatus` | `:34` | `'available'`, `'occupied'`, `'dirty'`, `'cleaning'`, `'maintenance'` |
| `Role` | `:474` | `'owner'`, `'manager'`, `'receptionist'`, `'editor'`, `'customer'` |
| `PaymentMethod` | `:322` | `'bank-transfer'`, `'card'`, `'at-property'`, `'momo'` |
| `Payment.kind` | `:332` | `'deposit'`, `'balance'`, `'refund'`, `'surcharge'` |
| `Channel` | `:183` | `'web'`, `'phone'`, `'walk-in'`, `'ota'` |
| `PromotionType` | `:166` | `'percent'`, `'fixed'`, `'nth-night-free'`, `'long-stay'`, `'early-bird'`, `'last-minute'`, `'free-addon'` |
| `LogAction` | `:441` | `'created'`, `'status-changed'`, `'payment-recorded'`, `'checked-in'`, `'checked-out'`, `'note-added'`, `'room-assigned'`, `'price-adjusted'`, `'cancelled'` |
| `NotificationKind` | `:500` | `'booking-created'`, `'payment-success'`, `'booking-confirmed'`, `'booking-cancelled'`, `'check-in-reminder'`, `'review-request'` |
| `BookingPriceLine.kind` | `:429` | `'room'`, `'extra-bed'`, `'child'`, `'addon'`, `'surcharge'` |
| `cancellation.by` | `:422` | `'customer'`, `'admin'` |
| `RoomGroup` | `types.ts:67` | `'couple'`, `'family'`, `'suite'` |

> ⚠️ **Ba cái bẫy so với bản nháp §1.2 — BE đọc kỹ:**
> 1. `BookingStatus` dùng **gạch dưới** (`pending_payment`), còn `PaymentMethod`,
>    `Channel`, `PromotionType`, `LogAction`, `NotificationKind` dùng **gạch
>    ngang** (`bank-transfer`, `walk-in`, `status-changed`). Không "thống nhất"
>    lại — TS đang như vậy và state machine so sánh chuỗi nguyên văn.
> 2. Bản nháp viết HOA (`'PENDING'`, `'WEB'`, `'CLEAN'`) — **sai hết**, bỏ.
> 3. Bản nháp có `role IN ('SUPERADMIN','ADMIN','USER')` — **sai**. TS có **5 vai
>    trò** với bảng quyền ở `booking-domain.md §B8`. Ánh xạ: `SUPERADMIN`→`owner`,
>    `ADMIN`→`manager`, `USER`(lễ tân)→`receptionist`, thêm `editor` và `customer`.

---

## 7. Quy tắc lưu value object nhúng (không có `id`)

Bảy kiểu ở §2 của ticket. Áp một quy tắc chung, không quyết từng cái một:

> **Value object thuộc về đúng một đơn, không truy vấn độc lập, không có vòng
> đời riêng → `jsonb` trên chính bảng `bookings`.
> Thực thể có `id`, có truy vấn/báo cáo riêng → bảng riêng.**

| Kiểu TS | Chốt | Lý do |
|---|---|---|
| `BookingGuest` | **Trải phẳng thành cột** trên `bookings` | Lễ tân **tìm đơn theo tên/SĐT/email** hằng ngày (F6: "Tìm mã đơn, tên, SĐT…"). Cần index B-tree, không nên tìm trong jsonb |
| `GuestCount` | **Trải phẳng**: `num_adults INT` + `child_ages INT[]` | Cần lọc/thống kê theo số khách. `int[]` giữ đúng ngữ nghĩa "tuổi từng trẻ" của TS (§B2) |
| `BookingPriceLine[]` | `jsonb` | Chỉ đọc kèm đơn để dựng breakdown. Không ai truy vấn "mọi dòng extra-bed tháng 8" |
| `AppliedPromotion[]` | `jsonb` **+** bảng nối `booking_promotions` | Xem ghi chú dưới |
| `CheckInRecord` | `jsonb` **+** cột `assigned_room_unit_id` tách ra | Cần FK và index để trả lời "phòng 201 đang ai ở" |
| `CheckOutRecord` | `jsonb` (gồm cả `incidentals[]`) | Đọc kèm đơn. Doanh thu phát sinh lấy từ `payments` kind `'surcharge'` |
| `cancellation` | `jsonb` **+** cột `cancelled_at TIMESTAMPTZ` tách ra | Báo cáo "tỷ lệ huỷ theo tháng" cần index theo thời gian |
| `Payment` | **Bảng riêng** `payments` | Có `id`, nhiều lần thu trên một đơn, đối soát kế toán |
| `IncidentalCharge` | Nằm trong `check_out_record` jsonb | Có `id` nhưng chỉ để React key; không truy vấn độc lập |
| `CancellationRule[]` | `jsonb` trên `rate_plans` | Thuộc về gói giá, luôn đọc cả bộ |
| `PromotionConditions` | `jsonb` trên `promotions` | 15 trường optional, hầu hết `NULL` → 15 cột rỗng là lãng phí |
| `LongStayTier[]` | Nằm trong `promotions.conditions` jsonb | Là một trường của `PromotionConditions` |
| `ChildPolicy` | Bảng `property_settings` một hàng | Cấu hình toàn cơ sở, admin sửa |

**Vì sao `AppliedPromotion[]` vừa jsonb vừa bảng nối:** jsonb giữ **ảnh chụp tại
thời điểm đặt** (tên KM, số tiền giảm thực tế, `remainingAfter` để dựng bảng giải
thích) — nếu sau này admin sửa/xoá KM thì breakdown cũ vẫn đúng nguyên văn. Bảng
nối `booking_promotions(booking_id, promotion_id)` chỉ để **đếm `usage_count` và
`perCustomerLimit`** — hai thứ `promotion.ts:evaluatePromotion()` cần và không
đếm được nhanh trong jsonb.

---

## 8. Bảng ánh xạ đầy đủ — mọi interface

### 8.1 `booking-types.ts` — 25 kiểu, phủ 100%

| # | Kiểu TS | Dòng | Bảng SQL | Ghi chú |
|---|---|---|---|---|
| 1 | `RoomUnit` | 23 | `room_units` | |
| 2 | `RoomUnitStatus` | 34 | CHECK trên `room_units.status` | |
| 3 | `Inventory` | 54 | **`inventory`** | PK `(room_type_id, date)` — §9.4 |
| 4 | `AvailabilityResult` | 83 | ❌ **Không lên DB** | Kiểu **trả về** của `checkAvailability()`, tính tại chỗ từ `inventory`+`seasons`+`rate_plans`. Lưu là lưu cache giá sai |
| 5 | `NightlyPrice` | 98 | ❌ **Không lên DB** | Phần tử của `AvailabilityResult`. Bản đã chốt trên đơn nằm trong `bookings.price_lines` |
| 6 | `AvailabilityBlockReason` | 104 | ❌ **Không lên DB** | Mã lý do trả về cho UI, không phải dữ liệu lưu trữ |
| 7 | `Season` | 114 | `seasons` | |
| 8 | `RatePlan` | 134 | `rate_plans` | `roomTypeIds`, `cancellationRules` → jsonb |
| 9 | `CancellationRule` | 157 | ⤷ `rate_plans.cancellation_rules` jsonb | §7 |
| 10 | `PromotionType` | 166 | CHECK trên `promotions.type` | |
| 11 | `Channel` | 183 | CHECK trên `bookings.channel` | |
| 12 | `PromotionConditions` | 186 | ⤷ `promotions.conditions` jsonb | §7 |
| 13 | `LongStayTier` | 214 | ⤷ trong `conditions` jsonb | §7 |
| 14 | `Promotion` | 226 | `promotions` | |
| 15 | `AppliedPromotion` | 255 | ⤷ `bookings.applied_promotions` jsonb + `booking_promotions` | §7 |
| 16 | `ChildPolicy` | 270 | `property_settings.child_policy` jsonb | Một hàng cho cả cơ sở |
| 17 | `GuestCount` | 283 | ⤷ `bookings.num_adults` + `child_ages` | §7 |
| 18 | `BookingStatus` | 291 | CHECK trên `bookings.status` | |
| 19 | `BookingGuest` | 308 | ⤷ 8 cột `guest_*` trên `bookings` | §7 |
| 20 | `PaymentMethod` | 322 | CHECK trên `payments.method` | |
| 21 | `Payment` | 324 | `payments` | |
| 22 | `IncidentalCharge` | 339 | ⤷ trong `check_out_record` jsonb | §7 |
| 23 | `CheckInRecord` | 346 | ⤷ `bookings.check_in_record` jsonb | §7 |
| 24 | `CheckOutRecord` | 360 | ⤷ `bookings.check_out_record` jsonb | §7 |
| 25 | `Booking` | 374 | **`bookings`** | §9.5 |
| 26 | `BookingPriceLine` | 428 | ⤷ `bookings.price_lines` jsonb | §7 |
| 27 | `LogAction` | 441 | CHECK trên `activity_logs.action` | |
| 28 | `ActivityLog` | 456 | `activity_logs` | Bất biến, xem RLS §11 |
| 29 | `Role` | 474 | CHECK trên `accounts.role` | |
| 30 | `Account` | 476 | `accounts` | |
| 31 | `Customer` | 488 | ⤷ `accounts` (3 cột thêm) | `extends Account` với `role:'customer'` → cùng bảng, cột `total_spent`/`stay_count`/`internal_note` NULL với nhân viên |
| 32 | `NotificationKind` | 500 | CHECK trên `notifications.kind` | |
| 33 | `Notification` | 508 | `notifications` | |

**Đối chiếu S1**: 33 kiểu export trong `booking-types.ts` (interface + type
alias), 33 dòng ở bảng trên. Không sót.

### 8.2 `types.ts` — nội dung marketing

`PropertyData` là **gói nội dung của cơ sở lưu trú**, do biên tập sửa. Chốt
nguyên tắc chung:

> Thực thể có `id` và được tham chiếu từ nghiệp vụ → **bảng riêng**.
> Nội dung khối tĩnh của trang chủ → **`property_settings.content` jsonb**.

| Kiểu TS | Dòng | Bảng SQL | Ghi chú |
|---|---|---|---|
| `Brand` | 10 | ⤷ `property_settings.brand` jsonb | Một khối, sửa cả cụm |
| `SectionId` / `CustomSectionId` / `ThemeSectionId` | 40/54/57 | ❌ Không lên DB | Hợp đồng điều hướng của theme (R7), không phải dữ liệu |
| `NavItem` | 59 | ⤷ `property_settings.nav` jsonb | Menu — CMS "Menu & Footer" |
| `RoomGroup` | 67 | CHECK trên `room_types.group` | |
| `RoomReview` | 70 | ⤷ `room_types.reviews` jsonb | Không có `id`, đọc kèm phòng |
| **`Room`** | 76 | **`room_types`** | §9.2 — GỘP với `RoomExtra` |
| **`RoomExtra`** | 99 | ⤷ **cùng bảng `room_types`** | §3 |
| `Addon` | 113 | `addons` | Có `id`, `Booking.addons` tham chiếu |
| `Dining` | 123 | `dining` | Có `id` |
| `TourDay` | 131 | ⤷ `tours.days` jsonb | |
| `Tour` | 136 | `tours` | Có `id` |
| `Place` | 145 | `places` | Có `id` |
| `TransportLeg` | 153 | ⤷ `property_settings.transport` jsonb | Không có `id`. ⚠️ `price: I18nText` — xem §12 nợ kỹ thuật |
| `GalleryItem` | 168 | `gallery_items` | Có `id`, CMS "Thư viện ảnh" |
| `Amenity` | 181 | `amenities` | Có `id` |
| `Review` | 189 | `reviews` | Có `id`, CMS duyệt từng cái |
| `ExploreSpot` | 207 | `explore_spots` | Có `id` |
| `SatelliteIsland` | 218 | `satellite_islands` | Có `id` |
| `ItineraryLeg` | 225 | ⤷ `trip_plans.legs` jsonb | |
| `CostItem` | 232 | ⤷ `trip_plans.costs` jsonb | |
| `TripPlan` | 238 | `trip_plans` | PK là `key` |
| `MenuItem` | 246 | ⤷ `menu_categories.items` jsonb | ⚠️ `id: number` — khác mọi id khác |
| `MenuCategory` | 253 | `menu_categories` | PK là `key` |
| `BlogBlock` | 261 | ⤷ `blog_posts.blocks` jsonb | Nội dung bài, luôn đọc cả bộ |
| `BlogPost` | 269 | `blog_posts` | ⚠️ `date: I18nText` — §12 |
| `Fact` | 286 | ⤷ `property_settings.facts` jsonb | |
| `Faq` | 291 | `faqs` | Có sắp xếp thứ tự, CMS sửa từng cái |
| `About` | 296 | ⤷ `property_settings.about` jsonb | Một khối |
| `Hero` | 303 | ⤷ `property_settings.hero` jsonb | Một khối. CMS "Nội dung trang chủ" theo section id |
| `PropertyData` | 317 | ❌ Không lên DB | Là **kiểu tổng hợp** do `getProperty()` ghép từ nhiều bảng, không phải một bảng |

**Phạm vi v1.0.0**: các bảng nội dung marketing (`dining`, `tours`, `places`,
`gallery_items`, `amenities`, `reviews`, `explore_spots`, `satellite_islands`,
`trip_plans`, `menu_categories`, `blog_posts`, `faqs`) chỉ cần DDL tối thiểu ở
`200-01` để seed chạy được; **ưu tiên cao là 9 bảng nghiệp vụ** ở §9. DDL đầy đủ
cho nhóm marketing ở §9.12.

---

## 9. DDL đề xuất — bảng nghiệp vụ

Thứ tự tạo bảng đã sắp theo phụ thuộc FK, BE viết migration theo đúng thứ tự này.

### 9.1 Chuẩn bị

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Domain song ngữ (xem §2, chú ý cảnh báo về toán tử `?`)
CREATE DOMAIN i18n_text AS jsonb CHECK (
    jsonb_exists(VALUE, 'vi') AND jsonb_exists(VALUE, 'en')
    AND length(VALUE ->> 'vi') > 0 AND length(VALUE ->> 'en') > 0
);

CREATE DOMAIN i18n_text_array AS jsonb CHECK (
    jsonb_typeof(VALUE) = 'array' AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements(VALUE) e
        WHERE NOT (jsonb_exists(e, 'vi') AND jsonb_exists(e, 'en'))
    )
);

-- Mọi bảng có updated_at đều gắn trigger này (yêu cầu BE7)
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 9.2 `room_types` — gộp `Room` + `RoomExtra`

```sql
CREATE TABLE public.room_types (
    id                TEXT PRIMARY KEY,
    property_id       TEXT NOT NULL DEFAULT 'nam-du-hill',

    -- ---- từ Room (types.ts:76) ----
    name              i18n_text NOT NULL,
    description       i18n_text NOT NULL,          -- Room.desc
    area              TEXT NOT NULL,               -- "48 m²" — nguyên văn theo TS
    guests            INT NOT NULL,                -- số khách tiêu chuẩn
    base_price        DECIMAL(12,2) NOT NULL,      -- Room.price — §4
    tags              i18n_text_array NOT NULL DEFAULT '[]'::jsonb,
    images            jsonb NOT NULL DEFAULT '[]'::jsonb,   -- string[]
    "group"           VARCHAR(20),                 -- RoomGroup; "group" là từ khoá SQL
    extra_bed_fee     DECIMAL(12,2),
    reviews           jsonb NOT NULL DEFAULT '[]'::jsonb,   -- RoomReview[]

    -- ---- từ RoomExtra (types.ts:99) — GỘP, xem §3 ----
    max_guests        INT NOT NULL,
    default_guests    INT NOT NULL,
    extra_bed         DECIMAL(12,2) NOT NULL DEFAULT 0,
    bed               i18n_text,
    view              i18n_text,
    long_desc         i18n_text,                   -- RoomExtra.long
    long_desc_2       i18n_text,                   -- RoomExtra.long2
    amenities         i18n_text_array NOT NULL DEFAULT '[]'::jsonb,
    conditions        i18n_text_array NOT NULL DEFAULT '[]'::jsonb,

    sort_order        INT NOT NULL DEFAULT 0,
    active            BOOLEAN NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_room_types_id_slug   CHECK (id ~ '^[a-z0-9][a-z0-9-]{1,62}$'),
    CONSTRAINT chk_room_types_group     CHECK ("group" IS NULL OR "group" IN ('couple','family','suite')),
    CONSTRAINT chk_room_types_price     CHECK (base_price >= 0),
    CONSTRAINT chk_room_types_capacity  CHECK (max_guests >= guests AND guests > 0)
);

CREATE INDEX idx_room_types_active  ON public.room_types (active, sort_order);
CREATE INDEX idx_room_types_name_vi ON public.room_types ((name ->> 'vi'));

CREATE TRIGGER trg_room_types_touch BEFORE UPDATE ON public.room_types
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
```

> `Room.remaining` **không có cột** — xem §3.
> `area` giữ `TEXT` đúng theo TS ("48 m²" là chuỗi hiển thị nguyên văn).

### 9.3 `room_units` — `RoomUnit`

```sql
CREATE TABLE public.room_units (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code         TEXT NOT NULL,                    -- "201"
    room_type_id TEXT NOT NULL REFERENCES public.room_types(id) ON DELETE RESTRICT,
    floor        TEXT,
    status       VARCHAR(20) NOT NULL DEFAULT 'available',
    note         TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_room_units_code   UNIQUE (code),
    CONSTRAINT chk_room_units_status CHECK (
        status IN ('available','occupied','dirty','cleaning','maintenance'))
);

CREATE INDEX idx_room_units_type ON public.room_units (room_type_id, status);

CREATE TRIGGER trg_room_units_touch BEFORE UPDATE ON public.room_units
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
```

> `ON DELETE RESTRICT` chứ không `CASCADE`: xoá một hạng phòng mà xoá theo cả
> phòng vật lý là mất dữ liệu thật. Muốn ngừng bán thì `active = false`.

### 9.4 `inventory` — bảng trung tâm ⭐

Giải quyết §4.1 của ticket.

```sql
CREATE TABLE public.inventory (
    room_type_id        TEXT NOT NULL REFERENCES public.room_types(id) ON DELETE CASCADE,
    date                DATE NOT NULL,
    total_units         INT  NOT NULL,
    booked_units        INT  NOT NULL DEFAULT 0,
    blocked_units       INT  NOT NULL DEFAULT 0,
    price_override      DECIMAL(12,2),
    min_nights          INT,
    closed_to_arrival   BOOLEAN NOT NULL DEFAULT FALSE,
    closed_to_departure BOOLEAN NOT NULL DEFAULT FALSE,
    version             INT  NOT NULL DEFAULT 1,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- PK tự nhiên: một hạng phòng × một ngày = đúng một hàng
    CONSTRAINT pk_inventory PRIMARY KEY (room_type_id, date),

    -- ⭐ LỚP PHÒNG THỦ CUỐI CÙNG chống overbooking (BE4 / §B7)
    CONSTRAINT chk_not_oversold CHECK (booked_units + blocked_units <= total_units),

    CONSTRAINT chk_inventory_nonneg CHECK (
        total_units >= 0 AND booked_units >= 0 AND blocked_units >= 0),
    CONSTRAINT chk_inventory_price  CHECK (price_override IS NULL OR price_override >= 0),
    CONSTRAINT chk_inventory_min_nights CHECK (min_nights IS NULL OR min_nights >= 1),
    CONSTRAINT chk_inventory_version CHECK (version >= 1)
);

-- Truy vấn nóng nhất: "hạng X, khoảng ngày Y–Z còn mấy phòng"
CREATE INDEX idx_inventory_date ON public.inventory (date, room_type_id);

CREATE TRIGGER trg_inventory_touch BEFORE UPDATE ON public.inventory
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
```

**Ba điều BE bắt buộc tuân thủ khi dùng bảng này** (`200-03`):

1. **`SELECT … FOR UPDATE`** mọi hàng của khoảng ngày **trong cùng transaction**
   trước khi `UPDATE booked_units`. Kiểm ở tầng ứng dụng là không đủ — hai request
   đồng thời đều lọt (BE4).

   ```sql
   SELECT * FROM public.inventory
   WHERE room_type_id = $1 AND date >= $2 AND date < $3
   FOR UPDATE;
   ```
   (`date < check_out` — **đêm trả phòng không tính**, khớp `listStayDates()`.)

2. **`version` tự tăng mỗi lần ghi**, và mọi `UPDATE` từ CMS phải kèm
   `AND version = $expected`. `0 rows affected` → trả `409`, bắt lễ tân tải lại.

   ```sql
   UPDATE public.inventory
   SET booked_units = booked_units + 1, version = version + 1
   WHERE room_type_id = $1 AND date = $2 AND version = $3;
   ```

3. **Không có hàng = còn nguyên phòng.** `availability.ts:89` coi ngày chưa có
   bản ghi là chưa ai đụng tới. BE dùng `INSERT … ON CONFLICT (room_type_id, date)
   DO UPDATE` để tự tạo hàng khi cần, không giả định hàng đã tồn tại.

> `CHECK` không thay được `FOR UPDATE`: CHECK chỉ **từ chối** giao dịch thứ hai
> (khách thấy lỗi 500 khó hiểu). `FOR UPDATE` **xếp hàng** để giao dịch thứ hai
> đọc số mới rồi trả `409` với thông báo tử tế. Phải có cả hai.

### 9.5 `seasons`, `rate_plans`, `addons`, `promotions`

```sql
CREATE TABLE public.seasons (
    id                 TEXT PRIMARY KEY,
    name               i18n_text NOT NULL,
    date_from          DATE NOT NULL,           -- Season.from ("from" là từ khoá SQL)
    date_to            DATE NOT NULL,
    multiplier         NUMERIC(5,3) NOT NULL,
    weekend_multiplier NUMERIC(5,3),
    priority           INT NOT NULL DEFAULT 100,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_seasons_range      CHECK (date_to >= date_from),
    CONSTRAINT chk_seasons_multiplier CHECK (multiplier > 0
        AND (weekend_multiplier IS NULL OR weekend_multiplier > 0))
);
CREATE INDEX idx_seasons_range ON public.seasons (date_from, date_to);

CREATE TABLE public.rate_plans (
    id                 TEXT PRIMARY KEY,
    name               i18n_text NOT NULL,
    description        i18n_text NOT NULL,
    adjust_percent     NUMERIC(6,2) NOT NULL DEFAULT 0,   -- -15 = rẻ hơn 15%
    includes_breakfast BOOLEAN NOT NULL DEFAULT FALSE,
    refundable         BOOLEAN NOT NULL DEFAULT TRUE,
    cancellation_rules jsonb NOT NULL DEFAULT '[]'::jsonb, -- CancellationRule[]
    deposit_percent    NUMERIC(5,2) NOT NULL DEFAULT 30,
    room_type_ids      jsonb NOT NULL DEFAULT '[]'::jsonb, -- string[]; rỗng = mọi hạng
    active             BOOLEAN NOT NULL DEFAULT TRUE,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_rate_plans_deposit CHECK (deposit_percent BETWEEN 0 AND 100),
    CONSTRAINT chk_rate_plans_adjust  CHECK (adjust_percent > -100),
    -- refundable=false thì bậc thang hoàn tiền phải rỗng (booking-types.ts:148)
    CONSTRAINT chk_rate_plans_refund  CHECK (
        refundable OR cancellation_rules = '[]'::jsonb)
);

CREATE TABLE public.addons (
    id          TEXT PRIMARY KEY,
    name        i18n_text NOT NULL,
    price       DECIMAL(12,2) NOT NULL,
    unit        i18n_text NOT NULL,          -- "khách / đêm"
    sort_order  INT NOT NULL DEFAULT 0,
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_addons_price CHECK (price >= 0)
);

CREATE TABLE public.promotions (
    id                  TEXT PRIMARY KEY,
    code                TEXT UNIQUE,                 -- NULL = tự động áp
    name                i18n_text NOT NULL,
    description         i18n_text NOT NULL,
    type                VARCHAR(20) NOT NULL,
    value               DECIMAL(12,2) NOT NULL,
    conditions          jsonb NOT NULL DEFAULT '{}'::jsonb,   -- PromotionConditions
    stackable           BOOLEAN NOT NULL DEFAULT TRUE,
    priority            INT NOT NULL DEFAULT 100,
    max_discount        DECIMAL(12,2),
    usage_limit         INT,
    usage_count         INT NOT NULL DEFAULT 0,
    per_customer_limit  INT,
    active              BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_promotions_type CHECK (type IN (
        'percent','fixed','nth-night-free','long-stay',
        'early-bird','last-minute','free-addon')),
    CONSTRAINT chk_promotions_usage CHECK (
        usage_count >= 0 AND (usage_limit IS NULL OR usage_count <= usage_limit))
);
CREATE INDEX idx_promotions_active ON public.promotions (active, priority);
```

> `promotions.code` **UNIQUE nhưng cho phép NULL** — Postgres coi nhiều NULL là
> khác nhau, nên vẫn tạo được nhiều KM tự động không mã. Đúng ý TS (`code?`).

### 9.6 `accounts` — `Account` + `Customer`

```sql
CREATE TABLE public.accounts (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role          VARCHAR(20) NOT NULL DEFAULT 'customer',
    full_name     TEXT NOT NULL,
    phone         TEXT NOT NULL,
    email         TEXT,
    password_hash TEXT,                  -- NULL với khách đăng nhập OTP
    active        BOOLEAN NOT NULL DEFAULT TRUE,

    -- ---- chỉ có nghĩa với role='customer' (Customer extends Account) ----
    total_spent   DECIMAL(14,2) NOT NULL DEFAULT 0,
    stay_count    INT NOT NULL DEFAULT 0,
    internal_note TEXT,

    -- ---- chừa sẵn cho refresh token v1.1 (BE10 mục 2) — v1.0.0 luôn NULL ----
    refresh_token            TEXT,
    refresh_token_expires_at TIMESTAMPTZ,

    last_login_at TIMESTAMPTZ,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_accounts_phone UNIQUE (phone),   -- hồ sơ khách gộp theo SĐT (§B1)
    CONSTRAINT uq_accounts_email UNIQUE (email),
    CONSTRAINT chk_accounts_role CHECK (
        role IN ('owner','manager','receptionist','editor','customer')),
    -- Nhân viên bắt buộc có mật khẩu băm; khách thì không
    CONSTRAINT chk_accounts_staff_pw CHECK (
        role = 'customer' OR password_hash IS NOT NULL)
);

CREATE INDEX idx_accounts_role ON public.accounts (role, active);
```

> **Một bảng cho cả 5 vai trò**, đúng theo TS (`Customer extends Account`).
> Tách `users` / `customers` như bản nháp gợi ý sẽ làm `bookings.customer_id`
> không biết trỏ vào đâu khi lễ tân tự đặt hộ.
>
> `password_hash` băm **bcrypt cost ≥ 12 hoặc argon2** — băm ở Route Handler chạy
> Node runtime, **không phải middleware Edge** (BE11).

### 9.7 `bookings` ⭐

Giải quyết §4.3 của ticket. Mọi cột thiếu đã bổ sung.

```sql
CREATE TABLE public.bookings (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code          TEXT NOT NULL UNIQUE,          -- "ĐH-2026-0042" (§9.7.1)
    property_id   TEXT NOT NULL DEFAULT 'nam-du-hill',

    room_type_id  TEXT NOT NULL REFERENCES public.room_types(id) ON DELETE RESTRICT,
    rate_plan_id  TEXT NOT NULL REFERENCES public.rate_plans(id) ON DELETE RESTRICT,  -- ← BỔ SUNG

    check_in      DATE NOT NULL,
    check_out     DATE NOT NULL,
    nights        INT  NOT NULL,                 -- ← BỔ SUNG

    -- ---- GuestCount trải phẳng (§7) ----
    num_adults    INT   NOT NULL DEFAULT 1,
    child_ages    INT[] NOT NULL DEFAULT '{}',   -- TUỔI từng trẻ, không phải số lượng

    addons        jsonb NOT NULL DEFAULT '{}'::jsonb,   -- ← BỔ SUNG Record<addonId, qty>

    -- ---- BookingGuest trải phẳng (§7) ----
    guest_full_name              TEXT NOT NULL,
    guest_phone                  TEXT NOT NULL,
    guest_email                  TEXT NOT NULL,
    guest_id_number              TEXT,
    guest_estimated_arrival_time TEXT,           -- giờ tàu Rạch Giá — §B6
    guest_special_requests       TEXT,
    guest_tax_code               TEXT,
    guest_company_name           TEXT,

    customer_id   UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    channel       VARCHAR(20) NOT NULL DEFAULT 'web',

    status          VARCHAR(20) NOT NULL DEFAULT 'pending_payment',
    hold_expires_at TIMESTAMPTZ,

    -- ---- tiền: 4 con số + đã thu (§B1) ----
    subtotal        DECIMAL(12,2) NOT NULL,
    discount_total  DECIMAL(12,2) NOT NULL DEFAULT 0,
    total_amount    DECIMAL(12,2) NOT NULL,
    deposit_amount  DECIMAL(12,2) NOT NULL DEFAULT 0,
    paid_amount     DECIMAL(12,2) NOT NULL DEFAULT 0,
    -- Cột SINH, không ghi được → không thể lệch (§5)
    remaining_amount DECIMAL(12,2)
        GENERATED ALWAYS AS (total_amount - paid_amount) STORED,

    price_lines         jsonb NOT NULL DEFAULT '[]'::jsonb,  -- ← BỔ SUNG BookingPriceLine[]
    applied_promotions  jsonb NOT NULL DEFAULT '[]'::jsonb,  -- ← BỔ SUNG AppliedPromotion[]

    check_in_record     jsonb,                   -- ← BỔ SUNG CheckInRecord
    check_out_record    jsonb,                   -- ← BỔ SUNG CheckOutRecord
    cancellation        jsonb,                   -- ← BỔ SUNG {at,by,reason,refundAmount}

    -- Tách khỏi jsonb để index/FK được (§7)
    assigned_room_unit_id UUID REFERENCES public.room_units(id) ON DELETE SET NULL,
    cancelled_at          TIMESTAMPTZ,

    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_bookings_dates   CHECK (check_out > check_in),
    CONSTRAINT chk_bookings_nights  CHECK (nights = (check_out - check_in) AND nights > 0),
    CONSTRAINT chk_bookings_status  CHECK (status IN (
        'pending_payment','confirmed','checked_in','checked_out',
        'cancelled','no_show','expired')),
    CONSTRAINT chk_bookings_channel CHECK (channel IN ('web','phone','walk-in','ota')),
    CONSTRAINT chk_bookings_adults  CHECK (num_adults >= 1),
    -- Tiền: bốn con số phải nhất quán (§B1)
    CONSTRAINT chk_bookings_money   CHECK (
        subtotal >= 0
        AND discount_total >= 0
        AND discount_total <= subtotal          -- luật: không bao giờ vượt subtotal
        AND total_amount = subtotal - discount_total
        AND deposit_amount >= 0 AND deposit_amount <= total_amount
        AND paid_amount >= 0),
    -- hold_expires_at chỉ có nghĩa khi đang chờ trả tiền (booking-types.ts:399)
    CONSTRAINT chk_bookings_hold CHECK (
        hold_expires_at IS NULL OR status = 'pending_payment')
);

CREATE INDEX idx_bookings_status    ON public.bookings (status, check_in);
CREATE INDEX idx_bookings_dates     ON public.bookings (check_in, check_out);
CREATE INDEX idx_bookings_customer  ON public.bookings (customer_id);
CREATE INDEX idx_bookings_phone     ON public.bookings (guest_phone);   -- tra cứu không cần login (F4)
CREATE INDEX idx_bookings_created   ON public.bookings (created_at DESC);
-- Cron nhả phòng quá hạn (200-05) quét đúng tập nhỏ này
CREATE INDEX idx_bookings_hold_expiry ON public.bookings (hold_expires_at)
    WHERE status = 'pending_payment';

CREATE TRIGGER trg_bookings_touch BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
```

#### 9.7.1 ⚠️ Mã đơn — hai format đang mâu thuẫn, chốt một

| Nguồn | Format |
|---|---|
| `booking-lifecycle.ts:146` `formatBookingCode()` | `ĐH-2026-0042` |
| `app-flows.md §F2` | `ĐH-2026-0042` |
| Bản Dev §1.2 + `frontend.md FE8` | `NDH-YYYYMMDD-XXXX` |

**Chốt: `ĐH-2026-0042`** — theo hàm đã cài đặt trong core, vì đây là thứ 4 theme
đang render và lễ tân đọc qua điện thoại.

Cột là `TEXT` nên chứa được ký tự `Đ`. **BE không được `VARCHAR(50)` + CHECK
regex ASCII** — sẽ chặn mất `Đ`.
Ghi nhận vào §12 để `ndh-ba` thống nhất lại tài liệu; **không đổi code ở ticket này.**

### 9.8 `payments` — `Payment`

```sql
CREATE TABLE public.payments (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    amount     DECIMAL(12,2) NOT NULL,
    method     VARCHAR(20) NOT NULL,
    kind       VARCHAR(20) NOT NULL,
    reference  TEXT,                    -- mã giao dịch cổng thanh toán
    note       TEXT,
    raw_payload jsonb,                  -- payload webhook, để đối soát (300-01)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_payments_method CHECK (
        method IN ('bank-transfer','card','at-property','momo')),
    CONSTRAINT chk_payments_kind CHECK (
        kind IN ('deposit','balance','refund','surcharge')),
    -- refund là số dương, dấu do `kind` mang; đừng lưu số âm
    CONSTRAINT chk_payments_amount CHECK (amount > 0)
);

CREATE INDEX idx_payments_booking ON public.payments (booking_id, at);
-- Chống ghi trùng khi webhook bắn lại cùng một giao dịch (300-01)
CREATE UNIQUE INDEX uq_payments_reference ON public.payments (reference)
    WHERE reference IS NOT NULL;
```

> `bookings.paid_amount` = `Σ payments` với `kind ∈ (deposit, balance, surcharge)`
> trừ `kind = 'refund'`. **BE cập nhật trong cùng transaction với `INSERT payments`**,
> không dùng cột sinh vì đây là tổng hợp qua bảng khác.

### 9.9 `activity_logs` — `ActivityLog`, BẤT BIẾN

```sql
CREATE TABLE public.activity_logs (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE RESTRICT,
    at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actor_id   TEXT NOT NULL,           -- TEXT: chứa được 'SYSTEM_CRON'
    actor_name TEXT NOT NULL,
    actor_role VARCHAR(20) NOT NULL,
    action     VARCHAR(30) NOT NULL,
    field      TEXT,
    "from"     TEXT,                    -- từ khoá SQL → phải trích dẫn
    "to"       TEXT,
    note       TEXT,
    old_data   jsonb,
    new_data   jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_logs_role CHECK (
        actor_role IN ('owner','manager','receptionist','editor','customer')),
    CONSTRAINT chk_logs_action CHECK (action IN (
        'created','status-changed','payment-recorded','checked-in','checked-out',
        'note-added','room-assigned','price-adjusted','cancelled'))
);

CREATE INDEX idx_logs_booking ON public.activity_logs (booking_id, at DESC);
```

> **Không có `updated_at` — cố ý.** Bảng này không bao giờ `UPDATE`.
> `ON DELETE RESTRICT`: xoá đơn mà mất log là mất chính thứ cứu mình khi tranh
> chấp. Tính bất biến cưỡng chế bằng RLS ở §11.
>
> Giữ luôn `old_data` / `new_data` jsonb của bản nháp — `backend.md BE5` viết
> log dưới dạng đó, mà TS chỉ có `from`/`to` chuỗi. Có cả hai thì cả hai cách ghi
> đều hợp lệ, không cần sửa TS.

### 9.10 `notifications`, `booking_promotions`, `property_settings`

```sql
CREATE TABLE public.notifications (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id   UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    kind         VARCHAR(30) NOT NULL,
    at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    read         BOOLEAN NOT NULL DEFAULT FALSE,
    booking_id   UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    booking_code TEXT,
    payload      jsonb,        -- {roomTypeName, nights, amount} — core không chứa chuỗi UI
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_notifications_kind CHECK (kind IN (
        'booking-created','payment-success','booking-confirmed',
        'booking-cancelled','check-in-reminder','review-request'))
);
CREATE INDEX idx_notifications_unread ON public.notifications (account_id, read, at DESC);

-- Chỉ để đếm usage_limit / perCustomerLimit (§7)
CREATE TABLE public.booking_promotions (
    booking_id   UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    promotion_id TEXT NOT NULL REFERENCES public.promotions(id) ON DELETE RESTRICT,
    customer_id  UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    discount     DECIMAL(12,2) NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_booking_promotions PRIMARY KEY (booking_id, promotion_id)
);
CREATE INDEX idx_booking_promotions_cust ON public.booking_promotions (promotion_id, customer_id);

-- Cấu hình + nội dung khối tĩnh của cơ sở lưu trú. ĐÚNG MỘT HÀNG ở v1.0.0.
CREATE TABLE public.property_settings (
    id           TEXT PRIMARY KEY DEFAULT 'nam-du-hill',
    brand        jsonb NOT NULL DEFAULT '{}'::jsonb,   -- Brand
    hero         jsonb NOT NULL DEFAULT '{}'::jsonb,   -- Hero
    about        jsonb NOT NULL DEFAULT '{}'::jsonb,   -- About
    facts        jsonb NOT NULL DEFAULT '[]'::jsonb,   -- Fact[]
    nav          jsonb NOT NULL DEFAULT '[]'::jsonb,   -- NavItem[]
    transport    jsonb NOT NULL DEFAULT '[]'::jsonb,   -- TransportLeg[]
    notes        jsonb NOT NULL DEFAULT '[]'::jsonb,   -- I18nText[]
    child_policy jsonb NOT NULL DEFAULT
        '{"freeUnderAge":6,"halfPriceUntilAge":11,"childRate":250000}'::jsonb,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

> `child_policy` mặc định lấy đúng `operations.seed.ts:264`.

### 9.11 Bảng nội dung marketing — DDL tối thiểu

Cùng một khuôn: `id TEXT PK` (hoặc `key`), trường `I18nText` dùng domain
`i18n_text`, `sort_order INT`, `active BOOLEAN`, `created_at`, `updated_at`.

| Bảng | Cột đặc thù (ngoài khuôn chung) |
|---|---|
| `addons` | §9.5 |
| `dining` | `name` i18n, `description` i18n, `note` i18n, `image` TEXT |
| `tours` | `code` TEXT, `name` i18n, `summary` i18n, `price` DECIMAL, `days` jsonb |
| `places` | `name` i18n, `tag` i18n, `description` i18n, `image` TEXT |
| `gallery_items` | `title` i18n, `subtitle` i18n, `image` TEXT |
| `amenities` | `icon` TEXT (tên icon, không phải JSX — R2), `label` i18n, `description` i18n |
| `reviews` | `name` TEXT, `from_place` i18n, `date` DATE, `rating` INT CHECK 1–5, `comment` i18n, `avatar` TEXT |
| `explore_spots` | `name` i18n, `dist` i18n, `text` i18n, `tip` i18n |
| `satellite_islands` | `name` i18n, `badge` i18n, `text` i18n |
| `trip_plans` | PK `key` TEXT, `name` i18n, `legs` jsonb, `costs` jsonb, `total` TEXT |
| `menu_categories` | PK `key` TEXT, `name` i18n, `items` jsonb (MenuItem[]) |
| `blog_posts` | `category` i18n, `title` i18n, `lede` i18n, `author` i18n, `role` i18n, `published_date` **DATE** (xem §12), `read_min` INT, `hero_slot` TEXT, `hero_caption` i18n, `tags` i18n[], `blocks` jsonb |
| `faqs` | `question` i18n, `answer` i18n, `sort_order` INT |

---

## 10. Đối chiếu với schema nháp §1.2 — cái gì đổi và vì sao

| Bảng nháp | Xử lý | Lý do |
|---|---|---|
| `users` | → **`accounts`** | TS gọi là `Account`. 5 vai trò thay vì 3, chữ thường. Gộp `Customer` vào cùng bảng |
| `room_types` | **Sửa nhiều** | Bỏ 3 cột giá cố định (§4), bỏ `min_nights_holiday` (đã có `inventory.min_nights`), `name`/`description` → `i18n_text`, gộp thêm 9 cột của `RoomExtra` |
| `rooms` | → **`room_units`** | TS gọi là `RoomUnit`. `status` 5 giá trị chữ thường thay vì `CLEAN/DIRTY/MAINTENANCE` |
| `bookings` | **Sửa nhiều** | Thêm 8 cột thiếu (§4.3), `remaining_amount` → cột sinh, `status` chữ thường 7 giá trị, tách `guest_*` đủ 8 trường |
| `booking_surcharges` | **Bỏ** | Vai trò đã thuộc `bookings.price_lines` (lúc đặt) và `check_out_record.incidentals` (lúc trả) — §4 |
| `promo_codes` | → **`promotions`** | TS có 7 kiểu KM, không chỉ `PERCENTAGE`/`FIXED_AMOUNT`. Cần `conditions`, `stackable`, `priority`, `max_discount` để `promotion.ts` chạy được |
| `payment_transactions` | → **`payments`** | TS gọi là `Payment`. Thêm `kind`; `method` giữ chuỗi TS |
| `booking_audit_logs` | → **`activity_logs`** | TS gọi là `ActivityLog`. Giữ `old_data`/`new_data`, thêm `actor_*`, `field`/`from`/`to` |
| — | **Thêm `inventory`** ⭐ | §4.1 — bảng thiếu quan trọng nhất |
| — | **Thêm** `seasons`, `rate_plans`, `addons`, `notifications`, `booking_promotions`, `property_settings` | Có trong TS, không có trong nháp |

**Tên bảng chốt theo TS**, không theo nháp: repository sinh tự động theo tên
interface thì ít chỗ sai hơn.

---

## 11. RLS — bắt buộc cùng migration (BE3)

Bật RLS cho **mọi** bảng. Ba nhóm chính sách:

```sql
-- 1) Bảng công khai (khách chưa đăng nhập cũng đọc được):
--    room_types, addons, seasons, rate_plans, dining, tours, places,
--    gallery_items, amenities, reviews, explore_spots, satellite_islands,
--    trip_plans, menu_categories, blog_posts, faqs, property_settings
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY room_types_public_read ON public.room_types
    FOR SELECT USING (active = TRUE);
-- Ghi: chỉ service_role (Route Handler đã qua requirePermission)

-- 2) inventory — đọc công khai (cần cho tra phòng trống), ghi chỉ service_role
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY inventory_public_read ON public.inventory FOR SELECT USING (TRUE);

-- 3) Bảng nhạy cảm — bookings, accounts, payments, activity_logs,
--    notifications, booking_promotions
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY bookings_own_read ON public.bookings
    FOR SELECT USING (customer_id = auth.uid());
-- Nhân viên KHÔNG đi qua policy này: Route Handler dùng service_role sau khi
-- đã requirePermission() ở server (BE2). Không bao giờ tin `role` từ client.

-- activity_logs BẤT BIẾN — không có policy UPDATE/DELETE cho bất kỳ ai
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
REVOKE UPDATE, DELETE ON public.activity_logs FROM anon, authenticated, service_role;
```

> **Quy tắc chốt**: khách chỉ đọc được đơn có `customer_id` bằng chính mình.
> Mọi thao tác của nhân viên đi qua Route Handler dùng `service_role`, và
> `requirePermission()` chạy **trước** khi chạm DB. RLS là lớp phòng thủ thứ ba,
> không phải lớp duy nhất (A3).
>
> Bảng quyền chi tiết theo 5 vai trò thuộc ticket **`000-02`**, không mở rộng ở đây.

---

## 12. Nợ kỹ thuật ghi nhận — KHÔNG xử lý ở ticket này

| # | Vấn đề | Chỗ | Đề xuất |
|---|---|---|---|
| **T1** | `BlogPost.date: I18nText` — ngày tháng không phải chuỗi song ngữ | `types.ts:276` | DB dùng `DATE`; adapter format theo locale khi đọc. Sửa TS ở ticket riêng |
| **T2** | `TransportLeg.price: I18nText` — tiền không phải chuỗi | `types.ts:156` | Giữ jsonb ở v1.0.0 (là chuỗi hiển thị "250.000đ/người"). Sửa TS sau |
| **T3** | `Review.date: string` không nói rõ format | `types.ts:199` | DB `DATE`, ép `YYYY-MM-DD` |
| **T4** | `MenuItem.id: number` lệch với mọi id khác (string) | `types.ts:247` | Nằm trong jsonb nên không ảnh hưởng DB. Ghi nhận |
| **T5** | Mã đơn hai format (`ĐH-2026-0042` vs `NDH-YYYYMMDD-XXXX`) | §9.7.1 | Đã chốt `ĐH-2026-0042`. `ndh-ba` sửa lại tài liệu cho khớp |
| **T6** | `Booking.propertyId` có trong TS nhưng chưa multi-tenant | `booking-types.ts:378` | Cột `DEFAULT 'nam-du-hill'`, chưa tách tenant ở v1.0.0 |
| **T7** | `RatePlan` không có `channels` dù `booking-domain §B3` nói "RatePlan theo kênh" | `booking-types.ts:134` | Điều kiện kênh hiện nằm ở `PromotionConditions.channels`. Không thêm cột ở v1.0.0 |

---

## 13. Checklist cho BE trước khi viết `200-01`

- [ ] Tạo `pgcrypto`, domain `i18n_text` / `i18n_text_array`, hàm `touch_updated_at()`
- [ ] Thứ tự bảng: `property_settings` → `room_types` → `room_units` → `inventory` → `seasons` → `rate_plans` → `addons` → `promotions` → `accounts` → `bookings` → `payments` → `activity_logs` → `notifications` → `booking_promotions` → nhóm marketing
- [ ] `inventory` có PK `(room_type_id, date)`, cột `version`, `chk_not_oversold`
- [ ] Mọi enum viết **chữ thường, đúng gạch ngang/gạch dưới** theo §6
- [ ] `bookings.remaining_amount` là `GENERATED ALWAYS AS … STORED`
- [ ] Mọi bảng (trừ `activity_logs`) có `created_at` + `updated_at` + trigger
- [ ] RLS bật cho mọi bảng, cùng file migration (BE3)
- [ ] `activity_logs` bị `REVOKE UPDATE, DELETE`
- [ ] Seed đọc từ `packages/core/src/data/` — id giữ nguyên slug, không sinh UUID mới
- [ ] Sau seed: `SELECT` một hạng phòng, dựng lại object `Room` + `RoomExtra` và
      so khớp với `namDuHill` trong core — phải trùng từng trường

---

*Tài liệu do `ndh-sa` lập cho ticket `000-01`, release v1.0.0.
Sửa đổi phải mở ticket mới — không sửa trực tiếp khi `200-01` đã chạy.*
