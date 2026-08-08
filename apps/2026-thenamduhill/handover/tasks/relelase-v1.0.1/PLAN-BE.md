# PLAN BACKEND — Release v1.0.1

> **Dành cho `ndh-be`.** Đây là file duy nhất cần đọc để biết làm gì, theo thứ tự nào,
> và khi nào được coi là xong.
> FE có file riêng: [PLAN-FE.md](./PLAN-FE.md) — **không cần đọc file đó.**
>
> Bối cảnh chung: [OVERVIEW.md](./OVERVIEW.md) · Cách test: [TEST-STRATEGY.md](./TEST-STRATEGY.md)
> · Nợ thông tin: [MANUAL.md](./MANUAL.md)

**9 ticket BE.** Ước lượng: 3 đợt, mỗi đợt tối đa 3 ticket ở `process/` (luật R3).

---

## 0. Ba luật đọc trước khi gõ dòng code đầu tiên

### L1 — Code là nguồn sự thật, tài liệu thì không

`API_INTEGRATION_MAP.md §M10` ghi *"chưa khai trong `vercel.json`"*. Kiểm bằng
code ngày 08/08/2026: **đã khai rồi**, commit `c848a07`. Tài liệu sai.

**Trước mỗi ticket 390, chạy 3 lệnh tự kiểm ở MAP §5** để đối chiếu thực tế. Lệch
thì tin lệnh, sửa MAP.

### L2 — Bốn bẫy đã gặp, đều "build xanh nhưng chạy lỗi"

Trích `API_INTEGRATION_MAP.md §3` — đọc kỹ, đây là kinh nghiệm mua bằng thời gian thật:

| Bẫy | Triệu chứng | Cách tránh |
|---|---|---|
| Migration chưa chạy | `PGRST202 Could not find the function` | So `list_migrations` với `supabase/migrations/` sau mỗi lần pull |
| Tên cột lệch schema | `42703 column does not exist` | **Đọc `information_schema.columns` TRƯỚC khi viết RPC** |
| Giá trị lệch CHECK constraint | `23514 violates check constraint` | `method` ∈ `bank-transfer\|card\|at-property\|momo` (**gạch ngang**) |
| TS không kiểm được ràng buộc DB | Union TS khai `bank_transfer`, DB nhận `bank-transfer` | SQL là nguồn sự thật; lệch thì **sửa TS** (luật BE8) |

**Tên cột dễ nhầm** (MAP §3): `payments.method` không phải `.payment_method` ·
`bookings.cancellation` (jsonb) không phải `.cancellation_reason` ·
`activity_logs."from"`/`"to"` phải trích dẫn (từ khoá SQL) · `room_units.code`
không phải `.name`.

### L3 — Không được báo xong khi thiếu 4 điều

Cổng bàn giao BE → FE, đã chốt với chủ dự án:

| # | Điều kiện | Lệnh kiểm |
|:--:|---|---|
| 1 | Tầng 1 (pgTAP) xanh — nếu ticket chạm SQL/RPC | `pnpm test:sql` |
| 2 | Tầng 2 (API integration) xanh, ≥1 negative test | `pnpm test:api` |
| 3 | **Cột BE trong MAP → ✅ kèm bằng chứng** | Đọc MAP |
| 4 | **Mục 9 của ticket điền đủ** | Đọc ticket |

⚠️ Luật của MAP: *"Không ghi ✅ nếu chưa chạy thử. Tài liệu sai nguy hiểm hơn
không có tài liệu."*

---

## 1. Bảng công việc BE — 9 ticket

| # | Mã | Tên | Đợt | Phụ thuộc | Bàn giao cho |
|:--:|---|---|:--:|---|---|
| 1 | `400-01` | Vitest + API integration test 21 route | **0** | — | — |
| 2 | `400-02` | pgTAP: RPC · RLS · overbooking đồng thời | **0** | `400-01` | — |
| 3 | `390-01` | API danh mục (M9) — room-types/rate-plans/addons/bank | **1** | `400-01` | `390-02` |
| 4 | `390-03` | `/api/bookings/lookup` công khai (M11) | **1** | `400-01` | `390-04` |
| 5 | `390-06` | Xác minh 2 cron chạy thật (M10) | **1** | `400-01` | — |
| 6 | `430-01` | Supabase Storage + 4 kích thước + srcset | **2** | `400-01` | `430-02` |
| 7 | `420-01` | Bảng `integration_outbox` + ghi event | **2** | `400-02` | — |
| 8 | `420-02` | `ChannelAdapter` + webhook out có retry | **2** | `420-01` | `420-03` |
| 9 | `440-04` | `IdDocumentScanner` ở form check-in | **2** | `400-01` | — |

---

## 2. ĐỢT 0 — Hạ tầng test *(chặn TẤT CẢ)*

Không có tầng test backend nào trong repo. Mọi ticket sau dựa vào đợt này.

### 2.1 `400-01` — Vitest + API integration test 21 route

**Làm gì**

1. Dựng `vitest.config.ts` cho app, environment `node`
2. Dựng Supabase local (`supabase start`) + script seed/teardown
3. Helper `loginAs(role)` cho 5 vai trò
4. Viết test cho **21 route**, gọi **thật** vào DB — **không mock Supabase**

**Cấu trúc**

```
tests/
  setup.ts
  helpers/{auth,seed,request}.ts
  api/
    auth.test.ts               4 route
    availability.test.ts       2 route
    bookings.test.ts           3 route
    booking-lifecycle.test.ts  6 route
    promotions.test.ts         1   room-units.test.ts  1
    admin.test.ts              2   cron.test.ts        2   webhooks.test.ts  1
```

**Chỉ tiêu: 53 case, ≥25 negative.** Phân bổ ở [TEST-STRATEGY §6](./TEST-STRATEGY.md).

**Bốn case bắt buộc không được bỏ**

| Case | Vì sao |
|---|---|
| Khuyến mãi **nhân dồn**: 1tr + KM 10% & 20% → giảm **280k**, không phải 300k | Sai chỗ này là sai mọi đơn có 2 KM |
| `receptionist` sửa giá → **403** | Luật B8, câu hỏi khách doanh nghiệp luôn hỏi |
| Không token → **401**; có token thiếu quyền → **403** | Client xử lý khác nhau: 401 về login, 403 hiện thông báo |
| Đặt phòng cuối → 201; đặt tiếp → **409** `SOLD_OUT` | Chống overbooking ở tầng HTTP |

**Cách làm đúng**

- Import Route Handler **trực tiếp** (không qua HTTP) — nhanh hơn, không cần server chạy, vẫn qua đủ `withAuthGuard`
- Test **tự dọn dữ liệu mình tạo** — seed không idempotent. Chạy `pnpm test:api` **3 lần liên tiếp** phải xanh cả 3
- **Không Docker?** Fallback Supabase branch (`create_branch` → test → `delete_branch`). Ghi vào MANUAL `M24`

**⚠️ Việc quan trọng nhất của ticket này:** rất có thể test sẽ **phát hiện route
đã lệch hợp đồng**. Khi đó **mở ticket `900-*` kèm triệu chứng tái hiện — KHÔNG
sửa lén route**. `ndh-sa` phân xử.

**Xong khi**: `pnpm test:api` xanh 3 lần liên tiếp · 53 case · ≥25 negative · 0 `any`

---

### 2.2 `400-02` — pgTAP: RPC · RLS · overbooking

**Vì sao cần dù đã có `400-01`**: ba loại bug sau **HTTP không chạm tới được**.

| Loại bug | Vì sao tầng 2 không bắt được |
|---|---|
| RLS hở — khách A đọc đơn khách B | Integration test đăng nhập đúng vai, không thử vai sai ở tầng Postgres |
| State machine nhảy cóc trong PL/pgSQL | Gọi thẳng RPC bỏ qua validation ở Route Handler |
| Race condition thật | Playwright/Vitest rất khó dựng 2 transaction song song |

**Cấu trúc**

```
supabase/tests/
  00-setup.sql          pgtap + helper đổi vai
  10-rpc-lifecycle.sql  5 RPC × hợp lệ + không hợp lệ
  20-rls-policies.sql   RLS 6 bảng × 5 vai trò   ← toàn bộ là negative
  30-overbooking.sql    2 transaction song song + CHECK constraint
```

**Chỉ tiêu: ≥20 case, ≥12 negative.**

**Sáu case bắt buộc**

| Case | Kỳ vọng |
|---|---|
| Đổi vai sang customer B → đọc đơn customer A | **0 rows** |
| `checked_out` → `confirmed` | Bị chặn |
| Gọi `check_in` hai lần | Bị chặn |
| 2 transaction cùng `SELECT FOR UPDATE` phòng cuối | Đúng **1 thắng, 1 bị chặn** |
| `UPDATE`/`DELETE` trên `booking_audit_logs` | Bị chặn (log bất biến) |
| Mỗi chuyển trạng thái | Ghi **đúng 1 dòng** `ActivityLog` — không 0, không 2 |

**Cách làm đúng**: đồng bộ 2 transaction bằng **advisory lock**, không dùng
`pg_sleep` (flaky). Test tự rollback hoặc tự dọn.

**⚠️ Nếu phát hiện RLS thật đang hở** → mở `900-*` **ưu tiên cao nhất**. Đây là
lỗ bảo mật, không phải bug thường.

**Xong khi**: `pnpm test:sql` xanh 3 lần · ≥20 case · ≥12 negative

---

## 3. ĐỢT 1 — Vá API đỏ *(ưu tiên cao nhất của release)*

Ba ticket này chạy **song song được** — không phụ thuộc nhau.

### 3.1 `390-01` — API danh mục (M9) 🔴

**Vấn đề đang có**: 4 màn CMS đọc/ghi `catalog.store` có `persist(localStorage)`.
Hạng phòng chủ resort tạo **chỉ nằm trên máy đang dùng**. Đổi máy là mất. Trang
khách không thấy.

**Làm gì** — 4 nhóm API CRUD:

```
/api/admin/room-types        GET, POST      /[id]  PATCH, DELETE
/api/admin/rate-plans        GET, POST      /[id]  PATCH, DELETE
/api/admin/addons            GET, POST      /[id]  PATCH, DELETE
/api/admin/settings/bank     GET, PATCH
```

**Thứ tự thao tác — không đảo**

1. **Đọc `information_schema.columns`** cho 3 bảng — bảng đã có từ `200-01` seed
   26 bảng, nhưng **cột có đủ so với `booking-types.ts` không?**
2. Thiếu cột → migration mới (**không sửa file cũ**, luật BE7)
3. Viết route + `requirePermission`
4. Viết test tầng 2 (16 case, 9 negative)
5. Cập nhật MAP cột BE của M9 → ✅

**Ba điều dễ làm sai**

| Sai | Đúng |
|---|---|
| `DELETE` xoá cứng `room_types` | **Soft delete** — hạng đã có đơn không được xoá, sẽ mồ côi `bookings.room_type_id` |
| Xoá hạng đang có đơn → 500 | **409** kèm *"Hạng phòng còn 3 đơn chưa trả phòng."* |
| Nhận dữ liệu thiếu `{vi, en}` | **400** — luật R6, song ngữ là bắt buộc ở tầng dữ liệu |

**Quyền**: `room-types`/`rate-plans` cần `price.edit` (lễ tân **không** được) ·
`addons` cần `content.edit`.

**⚠️ Không xoá `catalog.store` ở ticket này.** FE lo phần di trú (`390-02`), có
bước xuất dữ liệu hiện có trước. Xoá sớm = xoá dữ liệu chủ resort đã nhập.

**Xong khi**: 16 case ≥9 negative xanh · MAP M9 cột BE ✅ · mục 9 điền đủ

---

### 3.2 `390-03` — `/api/bookings/lookup` công khai (M11) 🔴

**Vấn đề đang có**: `/lookup` gọi `GET /api/bookings?code=&phone=` — route bọc
`withAuthGuard` nên khách chưa đăng nhập nhận **401**. Đã đo bằng `curl` không
cookie. `app-flows §F4` yêu cầu tra cứu **không cần đăng nhập**.

**Đây là route công khai duy nhất chạm dữ liệu đơn. Ba ràng buộc bắt buộc:**

| # | Ràng buộc | Vì sao |
|:--:|---|---|
| 1 | **Bắt buộc cả `code` VÀ `phone`** — thiếu một → 400 | Chỉ có mã đơn thì đoán được mã là đọc được đơn |
| 2 | **Chỉ trả đúng 1 đơn**, không trả danh sách | Trả mảng là mở cửa liệt kê |
| 3 | **Rate limit theo IP** → 429 | Không có thì đây là cửa dò số điện thoại khách |

**Điều quan trọng nhất — thông báo lỗi phải GIỐNG NHAU**

```
sai `phone` nhưng đúng `code`  →  404 "Không tìm thấy đơn khớp mã và SĐT đã nhập."
`code` không tồn tại           →  404 "Không tìm thấy đơn khớp mã và SĐT đã nhập."
                                        ↑ CÙNG MỘT CÂU
```

Hai thông báo khác nhau là **lộ mã đơn nào có thật** — người dò sẽ biết mã đúng
rồi tấn công tiếp vào SĐT.

**Trả về tối thiểu**: mã đơn · hạng phòng · ngày nhận/trả · trạng thái · tổng
tiền · số dư.
**KHÔNG trả**: email đầy đủ (che thành `a***@example.com`) · CCCD · địa chỉ ·
ghi chú nội bộ · `activity_logs`.

**Lưu ý kỹ thuật**: **không dùng RLS `current_account_id()`** — khách chưa đăng
nhập không có id, hàm trả rỗng. Lọc ở tầng ứng dụng, **ghi comment nói rõ lý do**.

Chuẩn hoá `phone` khi so sánh: bỏ khoảng trắng, `+84` ↔ `0`.

**Rate limit**: in-memory **không dùng được** (serverless nhiều instance). Phải
là store dùng chung — `ndh-sa` chốt ở mục 6.

**Xong khi**: 10 case ≥7 negative xanh · MAP M11 cột BE ✅

---

### 3.3 `390-06` — Xác minh 2 cron chạy thật (M10) 🟡

**⚠️ MAP ghi sai ticket này.** MAP nói *"chưa khai trong `vercel.json`"* — thực tế
**đã khai**, commit `c848a07`:

```json
"crons": [
  { "path": "/api/cron/release-holds", "schedule": "*/5 * * * *" },
  { "path": "/api/cron/no-show",       "schedule": "5 1 * * *" }
]
```

**Vậy làm gì?** Khai file ≠ chạy thật. Ba điều chưa ai xác minh:

| # | Việc | Cách làm |
|:--:|---|---|
| **1** | **Xác định plan Vercel** — làm việc này ĐẦU TIÊN | Hobby plan giới hạn cron **1 lần/ngày** ⇒ `*/5` **im lặng không chạy**, không lỗi ở đâu cả |
| **2** | Mở log Vercel xem cron đã chạy chưa | Đính ảnh chụp vào ticket |
| **3** | Xác minh **nghiệp vụ đúng** — đơn quá 15 phút có được nhả không | Tạo đơn, đợi/giả lập, kiểm `availableUnits` tăng lại |

**Nếu plan không cho `*/5`**: phương án thay thế là Supabase `pg_cron` (chạy trong
DB, không phụ thuộc plan Vercel). `ndh-sa` chốt.

**Case negative quan trọng nhất**

> Đơn đã `confirmed` **không được** bị `release-holds` đụng vào.

Nhả nhầm đơn khách đã trả tiền là mất khách, không sửa được bằng lời xin lỗi.

Các case khác: gọi cron không `CRON_SECRET` → **401** (đây là URL công khai) ·
chạy 2 lần liền không xử lý trùng · một đơn lỗi thì xử lý tiếp các đơn còn lại.

**Xong khi**: 7 case ≥5 negative xanh · **ảnh chụp log cron chạy thật** · MAP M10 ✅

---

## 4. ĐỢT 2 — Hạ tầng tích hợp & lưu trữ

### 4.1 `430-01` — Supabase Storage + srcset

**Vấn đề đang có**: route ghi vào `public/uploads/`. Chính comment trong file đã
cảnh báo — filesystem Vercel ephemeral, **ảnh mất sau mỗi lần deploy**.

**Làm gì: đổi ĐÚNG thân hàm `persist()`.** Hợp đồng request/response không đổi
⇒ CMS không phải sửa dòng nào.

**Response — chỉ THÊM field, không xoá field cũ:**

```ts
data: {
  url, width, height,          // GIỮ NGUYÊN — CMS cũ dùng
  srcSet: { avif: '…480w, …960w, …1440w, …2000w', webp: '…' },   // MỚI
  blurDataURL: 'data:image/webp;base64,…',                        // MỚI
}
```

4 bề ngang: **480 · 960 · 1440 · 2000**. Không phóng to ảnh nhỏ hơn
(`withoutEnlargement` — đã có trong code).
Đường dẫn: `media/{yyyy}/{mm}/{slug}-{hash}-{w}.{ext}`

**Giữ nguyên phần đang đúng**: `withAuthGuard(..., 'content.edit')` · `safeName()`
chống path traversal · loại SVG (chứa script được).

**⚠️ Rủi ro lớn nhất — timeout**: sinh 8 biến thể (4 kích thước × 2 định dạng)
trong một request có thể vượt 10s của Vercel. **AC-14 bắt buộc đo thật với ảnh
8MB.** Không đạt → `ndh-sa` chốt phương án bất đồng bộ. **Không để timeout im lặng.**

**Xong khi**: ảnh **còn sống sau một lần deploy thật** (ảnh chụp) · CMS upload
được không sửa dòng nào · 8 case ≥5 negative

---

### 4.2 `420-01` → `420-02` — Outbox + ChannelAdapter

Theo **Đ3**: chỉ dựng lớp, chưa nối nhà cung cấp nào.

**`420-01` — bảng `integration_outbox`**

**Vì sao phải làm BÂY GIỜ**: nếu không ghi outbox từ đầu, sau này nối Channel
Manager phải **sửa lại 5 RPC lifecycle** — đúng thứ luật R5 cấm. Sửa RPC đang giữ
tiền thật của khách là việc rủi ro nhất hệ thống.

Làm bây giờ = thêm 1 bảng + 1 dòng `INSERT` mỗi RPC.

**Quyết định cần `ndh-sa` chốt dứt điểm (AC-7/AC-8)**:

> Ghi outbox **trong** transaction (đơn fail nếu outbox fail) hay **ngoài**
> (đơn luôn thành công, có thể mất event)?
>
> **Khuyến nghị: TRONG transaction.** Mất một event `inventory.changed` nghĩa là
> OTA vẫn mở bán phòng đã bán → overbooking trên Booking.com. Đơn fail thì khách
> đặt lại được; overbooking thì không.

Bắt buộc: RLS chỉ service role · retention 90 ngày + cron dọn **cùng migration** ·
index `(status, next_retry_at)` · `payload` **tự đủ** để adapter không phải query thêm.

**`420-02` — `ChannelAdapter` + worker**

Interface 3 method, đặt ở `packages/domain-hotel` (**không** tầng nền, luật R15):

```ts
interface ChannelAdapter {
    readonly name: string
    push(event: OutboxEvent): Promise<PushResult>
    isRetryable(error: unknown): boolean   // 5xx/timeout: có · 4xx sai dữ liệu: không
}
```

**AC quan trọng nhất**: thêm adapter mới **KHÔNG cần sửa file nào ngoài
`registry.ts`** — chứng minh bằng cách thêm adapter giả `echo`, `git diff` chỉ
được có 2 file.

Retry exponential backoff (1 phút → 5 → 25…), sau N lần → `dead`, **không retry
vô hạn**. `last_error` ghi **nguyên văn**, không nuốt (luật C3). Cron idempotent.

---

### 4.3 `440-04` — `IdDocumentScanner` ở form check-in

Theo **Đ2**: OCR **không** làm ở luồng khách online (lý do ở OVERVIEW §5). Ticket
này chừa chỗ ở **form check-in của lễ tân** — nơi phải nhập 4 field từ giấy tờ,
hàng chục lần mỗi ngày.

Bản v1.0.1 chỉ có implementation `manual` (nhập tay như hiện tại). Bật OCR thật
sau này = thay một class.

**Hai điều tuyệt đối không được sai**

| # | Luật | Vì sao |
|:--:|---|---|
| 1 | **Scanner lỗi KHÔNG được chặn lễ tân nhập tay** | Khách đang đứng ở quầy. Đây là AC quan trọng nhất ticket |
| 2 | **Không lưu ảnh giấy tờ** — quét xong bỏ ảnh, không Storage, không DB, không log | Lưu ảnh CCCD cần cơ sở pháp lý riêng và bucket có signed URL, không phải bucket `media` công khai |

`ScanResult` có **`confidence` từng field**, và **không bịa giá trị** — field
không đọc được thì không có trong `fields`, không trả chuỗi rỗng.

---

## 5. Lịch — 3 đợt

```
ĐỢT 0  400-01 ──→ 400-02          (400-02 cần hạ tầng của 400-01)

ĐỢT 1  390-01 ─┐
       390-03 ─┼─ song song, độc lập nhau
       390-06 ─┘
         │
         └─→ bàn giao 390-01→390-02, 390-03→390-04 cho FE

ĐỢT 2  430-01 ──→ bàn giao 430-02 cho FE
       420-01 → 420-02 ──→ bàn giao 420-03 cho FE
       440-04
```

Tối đa **3 ticket ở `process/`** cùng lúc.

---

## 6. Checklist chung mọi ticket BE

Trước khi báo xong bất kỳ ticket nào:

- [ ] `pnpm test:sql` xanh *(nếu chạm SQL/RPC)*
- [ ] `pnpm test:api` xanh, có **≥1 negative test**
- [ ] `pnpm lint` + `pnpm typecheck` sạch, **0 `any`**
- [ ] Hợp đồng `{success, data, error}` đúng; lỗi **song ngữ** vi+en
- [ ] Mọi route ghi/sửa có `requirePermission` (luật BE2)
- [ ] Bảng mới có RLS **cùng migration** (luật BE3)
- [ ] Migration **mới**, không sửa file đã chạy (luật BE7)
- [ ] Mọi chuyển trạng thái đơn ghi `ActivityLog` (luật BE5)
- [ ] Tiền tính **theo từng đêm**, khuyến mãi cộng dồn **nhân** (luật BE6)
- [ ] **Không sửa `packages/theme-*` hay bất cứ file nào có `className`**
- [ ] **Cột BE trong MAP → ✅ kèm bằng chứng**
- [ ] **Mục 9 của ticket điền đủ** — endpoint, ví dụ response thật, mã lỗi FE cần xử lý

---

## 7. Khi gặp vấn đề

| Tình huống | Làm gì |
|---|---|
| Test phát hiện route đã lệch hợp đồng | Mở `900-*` kèm triệu chứng tái hiện. **Không sửa lén** |
| Phát hiện RLS đang hở | Mở `900-*` **ưu tiên cao nhất** — lỗ bảo mật |
| MAP ghi khác thực tế | Tin code, sửa MAP, ghi vào nhật ký §6 của MAP |
| Thiếu thông tin từ chủ dự án (API key, tài khoản…) | **KHÔNG dừng** — ghi MANUAL.md, dùng giá trị mặc định, chạy tiếp (luật W0b) |
| Không có Docker cho Supabase local | Fallback Supabase branch. MANUAL `M24` |
| Bất đồng với FE về hợp đồng | `ndh-sa` phân xử bằng `api-contracts.ts`. Không tranh luận trong chat |
