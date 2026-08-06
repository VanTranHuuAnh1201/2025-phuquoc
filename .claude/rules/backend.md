# Rules — Backend (Route Handlers · Database · API)

Áp cho `app/api/**`, `supabase/migrations/**`, `middleware.ts`, logic trong
`packages/core`.

Luật chung: [common.md](./common.md) · Nghiệp vụ: [booking-domain.md](./booking-domain.md)

---

## BE1 — Hợp đồng API cố định

```json
{ "success": true,  "data": { }, "error": null }

{ "success": false, "data": null,
  "error": {
    "code": "SOLD_OUT",
    "message": { "vi": "Hết phòng cho ngày đã chọn", "en": "Sold out for selected dates" }
  } }
```

Thông báo lỗi **song ngữ**, viết theo giọng `common.md C8`.

### Mã HTTP

| Mã | Dùng khi | Ví dụ |
|---|---|---|
| `200` | Thành công | |
| `201` | Tạo mới thành công | Tạo đơn |
| `400` | Dữ liệu vào sai | Thiếu trường, sai định dạng, vi phạm min-nights |
| `401` | Chưa đăng nhập / token hết hạn | |
| `403` | Đã đăng nhập, thiếu quyền | Lễ tân sửa giá |
| `404` | Không tìm thấy | Sai mã đơn |
| `409` | Xung đột | Hết phòng, sai `version` |
| `422` | Chuyển trạng thái không hợp lệ | `checked_out` → `confirmed` |
| `500` | Lỗi hệ thống | |

`401` và `403` **phải phân biệt được** — client xử lý khác nhau: `401` chuyển
về đăng nhập, `403` hiện thông báo thiếu quyền.

## BE2 — Kiểm quyền ở server, luôn luôn

```ts
/* ✅ */
const account = await requireAuth(req)          // đọc từ token đã verify
requirePermission(account.role, 'price.edit')

/* ❌ TUYỆT ĐỐI KHÔNG */
const { role } = await req.json()
if (role === 'owner') { /* … */ }
```

**Không bao giờ tin `role` gửi từ client.** Kể cả khi client gửi kèm trong body,
server phải bỏ qua và đọc từ token.

Mọi route ghi/sửa đều qua `requirePermission()`. Không ngoại lệ.

## BE3 — RLS bắt buộc, cùng migration

Bảng mới → policy mới, trong cùng file migration. Bảng nhạy cảm không RLS là lỗi
chặn duyệt:

```
bookings · accounts · payment_transactions · inventory · room_types · booking_audit_logs
```

Khách chỉ đọc được đơn có `customer_id` bằng chính mình.

RLS viết bằng vai trò Postgres, **không dựa vào biến do client gửi**.

## BE4 — Ba lớp chống overbooking

| Lớp | Cơ chế | Vai trò |
|---|---|---|
| Ứng dụng | `checkAvailability()` trước khi cho đặt | Trải nghiệm |
| Transaction | `SELECT FOR UPDATE` trong `create_booking_atomic()` | Người trước thắng |
| Tầng DB | `CHECK (booked_units + blocked_units <= total_units)` | Phòng thủ cuối |

```sql
SELECT * FROM inventory
WHERE room_type_id = $1 AND date = ANY($2)
FOR UPDATE;            -- người sau đợi, không đọc dữ liệu cũ
```

Kiểm `available >= 1` trong **cùng transaction** rồi mới `INSERT`. Không đủ → `409`.

Kiểm ở tầng ứng dụng là **không đủ** — hai request đồng thời đều lọt.

## BE5 — Mọi chuyển trạng thái đơn ghi log

```ts
await tx.insert('booking_audit_logs', {
    booking_id,
    action: 'status-changed',
    performed_by: actor.id,
    old_data: { status: from },
    new_data: { status: to },
})
```

Bảng log **bất biến** — không `UPDATE`, không `DELETE`. Đây là thứ cứu bạn khi
tranh chấp với khách.

Trạng thái chỉ đi theo đồ thị ở `booking-domain.md §B1`, **không nhảy cóc**.

## BE6 — Tiền tính theo từng đêm

```ts
/* ✅ */
const nights = listStayDates(checkIn, checkOut)
const total = nights.reduce((sum, d) => sum + priceOf(d), 0)

/* ❌ lỗi hay gặp nhất — đã từng phải gỡ một bản calculatePrice vì lỗi này */
const total = basePrice * nightCount
```

Thứ tự áp giá cố định: `basePrice` → `Season` → `priceOverride` (**đè hẳn**) →
`RatePlan`.

Khuyến mãi cộng dồn **nhân** trên số tiền còn lại. `discountTotal` không bao giờ
vượt `subtotal`.

## BE7 — Migration đi một chiều

```
supabase/migrations/<timestamp>_<mô_tả>.sql
```

Không sửa file migration đã chạy — sai thì thêm file mới. Mỗi bảng phải có
`id` (PK), `created_at`, `updated_at`.

## BE8 — SQL bám theo TypeScript

`packages/core/src/booking-types.ts` là nguồn sự thật. SQL và TS lệch nhau →
**sửa SQL**.

Giữ nguyên giá trị chuỗi enum: `'pending_payment'`, `'checked_in'` — không đổi
sang `PENDING`, vì state machine và mọi chỗ so sánh trạng thái đang dùng.

## BE9 — `packages/core` chạy được trong Node thuần

Không JSX, không CSS, không `import React`, không API trình duyệt
(`window`, `document`, `localStorage`).

## BE10 — Xác thực

| Đối tượng | Thời hạn token |
|---|---|
| Khách (`customer`) | 30 ngày |
| Nhân viên (4 vai trò còn lại) | **8 giờ** — đúng một ca làm việc |

Ba yêu cầu bắt buộc:

1. Cookie `HttpOnly` + `Secure` + `SameSite=Strict`
2. Mật khẩu nhân viên băm `bcrypt` (cost ≥ 12) hoặc `argon2`
3. Không bao giờ tin `role` từ client

**Refresh token hoãn v1.1, không bỏ.** Bốn chỗ chừa sẵn:

| # | Chỗ chừa |
|---|---|
| 1 | Payload JWT có `tokenType: 'access'` |
| 2 | Bảng `accounts` có `refresh_token` + `refresh_token_expires_at`, để `NULL` |
| 3 | Response `/api/auth/login` bọc trong `data` |
| 4 | Chừa đường dẫn `/api/auth/refresh` trong tài liệu, chưa cài đặt |

Ghi comment tại chỗ cấp token nói rõ đây là quyết định của v1.0.0.

## BE11 — Middleware chạy trên Edge Runtime

`middleware.ts` **không dùng được `bcrypt`** (cần Node API). Verify chữ ký JWT
bằng thư viện tương thích Edge (`jose`); so mật khẩu để trong Route Handler chạy
Node runtime.

Middleware chỉ kiểm **đã đăng nhập và không phải khách**. Kiểm quyền chi tiết
nằm trong từng Route Handler.

## BE12 — Không tự viết mã hoá

Không tự viết hàm ký/verify JWT, hàm băm mật khẩu, hàm so chữ ký HMAC. Dùng thư
viện đã kiểm chứng.

So chữ ký webhook phải dùng hàm so sánh **thời gian không đổi**
(`crypto.timingSafeEqual`), không dùng `===`.

---

## Tự kiểm

```bash
# any trong API
grep -rn ": any\|as any" apps/2026-thenamduhill/src/app/api/

# route thiếu kiểm quyền — mọi file có POST/PATCH/DELETE phải có requirePermission
grep -rLn "requirePermission\|requireAuth" apps/2026-thenamduhill/src/app/api/**/route.ts

# đọc role từ body
grep -rn "role.*=.*await.*json()\|body.role\|query.role" apps/2026-thenamduhill/src/app/api/

# RLS
psql -c "SELECT tablename FROM pg_tables WHERE schemaname='public'
         EXCEPT SELECT tablename FROM pg_policies WHERE schemaname='public'"
```

Ba cái đầu phải rỗng. Cái cuối chỉ được chứa bảng công khai.
