# BE BRIEF — v1.0.1

> **File này dành cho `ndh-be` đọc mỗi lượt.** Bản đầy đủ có giải thích "vì sao":
> [PLAN-BE.md](./PLAN-BE.md) — chỉ mở khi cần hiểu sâu một quyết định.
> Vận hành: [RUNBOOK.md](./RUNBOOK.md) · Hợp đồng: [API_INTEGRATION_MAP.md](../release-v1.0.0/API_INTEGRATION_MAP.md)

---

## Ticket — 11 ticket, theo thứ tự

| Thứ tự | Mã | Việc | Phụ thuộc | Giao cho FE |
|:--:|---|---|---|---|
| **1** | `380-01` | Gen interface toàn bộ API → `api-contracts.ts`. **KHÔNG viết thân hàm** | — | qua `380-02` |
| 2 | `400-01` | Vitest + integration test 21 route. 53 case, ≥25 negative | `380-02` | — |
| 3 | `400-02` | pgTAP: 5 RPC · RLS 6 bảng · overbooking đồng thời. ≥20 case, ≥12 neg | `400-01` | — |
| 4 | `390-01` | API danh mục: room-types · rate-plans · addons · settings/bank (M9) | `400-01` | `390-02` |
| 5 | `390-03` | `GET /api/bookings/lookup` công khai (M11) | `400-01` | `390-04` |
| 6 | `390-06` | Xác minh 2 cron **chạy thật** (M10) | `400-01` | — |
| 7 | `430-01` | Upload → Supabase Storage, 4 kích thước + WebP/AVIF + `srcSet` | `400-01` | `430-02` |
| 8 | `420-01` | Bảng `integration_outbox` + ghi event ở 5 RPC | `400-02` | — |
| 9 | `420-02` | `ChannelAdapter` + worker retry backoff | `420-01` | `420-03` |
| 10 | `440-04` | `IdDocumentScanner` interface + `manual` ở form check-in | `400-01` | — |
| 11 | `400-04` | Gộp `pnpm test` + CI *(`ndh-sa` làm)* | `400-01`,`02`,`400-03` | — |

---

## Bốn bẫy — đọc trước mỗi ticket

| Bẫy | Triệu chứng | Tránh bằng |
|---|---|---|
| Migration chưa chạy | `PGRST202 Could not find the function` | So `list_migrations` ↔ `supabase/migrations/` |
| Tên cột lệch schema | `42703 column does not exist` | **Đọc `information_schema.columns` TRƯỚC khi viết** |
| Lệch CHECK constraint | `23514 violates check constraint` | `method` ∈ `bank-transfer\|card\|at-property\|momo` — **gạch ngang** |
| TS không kiểm ràng buộc DB | Build xanh, chạy 500 | SQL là nguồn sự thật; lệch → **sửa TS** (BE8) |

**Tên cột dễ nhầm**: `payments.method` *(không phải `.payment_method`)* ·
`bookings.cancellation` jsonb *(không phải `.cancellation_reason`)* ·
`activity_logs."from"`/`"to"` *(từ khoá SQL, phải trích dẫn)* ·
`room_units.code` *(không phải `.name`)* · `room_units.id` là **UUID**, không phải slug.

**MAP có chỗ ghi sai** — §M10 nói cron chưa khai, thực tế đã khai (commit `c848a07`).
Chạy 3 lệnh tự kiểm ở MAP §5 trước khi tin bảng.

---

## Ghi chú riêng từng ticket

**`380-01`** — Khai Request + Response + **mã lỗi kèm HTTP code** + quyền cần, cho:
4 nhóm danh mục · `/lookup` · `/availability/search` · `/cancel` + `/cancel/quote` +
`/refund` · `/admin/upload` (thêm `srcSet`) · `/admin/outbox` · `/admin/scan-id` ·
`/revalidate`. Không khai cron/webhook. Mọi chuỗi khách thấy là `I18nText`, không
`string`. Ngày là chuỗi, không `Date`. **Viết một dòng thân hàm = FAIL.**

**`400-01`** — Import Route Handler trực tiếp, không qua HTTP. Không mock Supabase.
Test tự dọn dữ liệu mình tạo — chạy 3 lần liên tiếp phải xanh. Không Docker →
fallback Supabase branch (MANUAL `M24`).
4 case bắt buộc: KM nhân dồn (1tr + 10% + 20% = giảm **280k** không phải 300k) ·
`receptionist` sửa giá → **403** · không token → **401**, thiếu quyền → **403** ·
phòng cuối → 201, đặt tiếp → **409** `SOLD_OUT`.

**`400-02`** — Đồng bộ 2 transaction bằng **advisory lock**, không `pg_sleep`.
6 case bắt buộc: đổi vai đọc đơn người khác → **0 rows** · `checked_out`→`confirmed`
bị chặn · `check_in` 2 lần bị chặn · 2 transaction giành phòng cuối → đúng 1 thắng ·
`UPDATE`/`DELETE` trên `booking_audit_logs` bị chặn · mỗi chuyển trạng thái ghi
**đúng 1 dòng** `ActivityLog`.
**RLS hở → mở `900-*` ưu tiên cao nhất.**

**`390-01`** — Quyền: `room-types`/`rate-plans` cần `price.edit` (lễ tân KHÔNG),
`addons` cần `content.edit`. **DELETE `room_types` là soft delete**; xoá hạng đang
có đơn → **409** kèm số đơn còn lại. Thiếu `{vi,en}` → **400**.
**Không xoá `catalog.store`** — FE lo di trú ở `390-02`.

**`390-03`** — Route công khai duy nhất chạm dữ liệu đơn. Bắt buộc **cả `code` và
`phone`**, thiếu → 400. Chỉ trả **1 đơn**. Rate limit theo IP → 429 (in-memory
KHÔNG dùng được, serverless nhiều instance).
⚠️ **Sai `phone` và không tồn tại `code` phải trả CÙNG MỘT thông báo** — khác nhau
là lộ mã đơn nào có thật.
Không trả: email đầy đủ (che `a***@`) · CCCD · địa chỉ · ghi chú nội bộ · `activity_logs`.
Không dùng RLS `current_account_id()` (khách chưa đăng nhập không có id) — lọc ở
tầng ứng dụng, ghi comment lý do.

**`390-06`** — **Việc đầu tiên: xác định plan Vercel.** Hobby giới hạn cron 1
lần/ngày ⇒ `*/5` **im lặng không chạy**. Không cho `*/5` → phương án Supabase
`pg_cron`, `ndh-sa` chốt.
Bằng chứng là **log Vercel**, không phải file config.
⚠️ Case quan trọng nhất: đơn `confirmed` **không được** bị `release-holds` đụng vào.

**`430-01`** — Đổi **đúng thân hàm `persist()`**. Response chỉ **THÊM** `srcSet` +
`blurDataURL`, **giữ nguyên** `url`/`width`/`height` ⇒ CMS không sửa dòng nào.
4 bề ngang 480·960·1440·2000, không phóng to ảnh nhỏ hơn.
⚠️ Đo thật: ảnh 8MB xong **dưới 10s**. Không đạt → `ndh-sa` chốt phương án bất
đồng bộ, **không để timeout im lặng**.
Giữ `withAuthGuard('content.edit')` · `safeName()` · loại SVG.

**`420-01`** — ⚠️ `ndh-sa` phải chốt: ghi outbox **trong** transaction (đơn fail
nếu outbox fail) hay ngoài. Khuyến nghị **trong** — mất event `inventory.changed`
= OTA vẫn bán phòng đã bán.
Bắt buộc: RLS chỉ service role · retention 90 ngày + cron dọn **cùng migration** ·
index `(status, next_retry_at)` · `payload` tự đủ, adapter không phải query thêm.

**`420-02`** — Interface 3 method, đặt `packages/domain-hotel` (không tầng nền, R15).
⚠️ AC quan trọng nhất: thêm adapter mới **chỉ sửa `registry.ts`** — chứng minh
bằng adapter giả `echo`, `git diff` chỉ 2 file.
Retry backoff 1→5→25 phút, N lần → `dead`. Phân biệt 5xx/timeout (retry) với 4xx
sai dữ liệu (dead ngay). `last_error` ghi **nguyên văn**. Cron idempotent.

**`440-04`** — Hai điều tuyệt đối: ① **scanner lỗi KHÔNG chặn lễ tân nhập tay**
(khách đang đứng ở quầy) ② **không lưu ảnh giấy tờ** — không Storage, không DB,
không log.
`ScanResult` có `confidence` **từng field**; field không đọc được thì **không có
trong `fields`**, không trả chuỗi rỗng.

---

## Checklist — mọi ticket BE

- [ ] `pnpm test:sql` xanh *(nếu chạm SQL/RPC)*
- [ ] `pnpm test:api` xanh, **≥1 negative test**
- [ ] `pnpm lint` + `typecheck` sạch, **0 `any`**
- [ ] Hợp đồng `{success, data, error}`; lỗi **song ngữ** vi+en
- [ ] Route ghi/sửa có `requirePermission` (BE2)
- [ ] Bảng mới có RLS **cùng migration** (BE3)
- [ ] Migration **mới**, không sửa file đã chạy (BE7)
- [ ] Chuyển trạng thái đơn ghi `ActivityLog` (BE5)
- [ ] Tiền tính **từng đêm**; KM cộng dồn **nhân** (BE6)
- [ ] Bám `api-contracts.ts` đã freeze — đổi phải qua `900-*` + SA
- [ ] **Không sửa `packages/theme-*` hay file có `className`**
- [ ] **Cột BE trong MAP → ✅ kèm bằng chứng**
- [ ] **Mục 9 ticket điền đủ**: endpoint · ví dụ response thật · mã lỗi FE cần xử lý

---

## Khi gặp vấn đề

| Tình huống | Làm gì |
|---|---|
| Test phát hiện route lệch hợp đồng | Mở `900-*` kèm triệu chứng. **Không sửa lén** |
| RLS đang hở | `900-*` **ưu tiên cao nhất** |
| MAP khác thực tế | Tin code, sửa MAP, ghi nhật ký MAP §6 |
| Cần đổi interface đã freeze | `900-*` → SA duyệt → sửa → báo FE |
| Thiếu thông tin chủ dự án | **KHÔNG dừng** — ghi MANUAL.md, dùng fallback (W0b) |
| Không có Docker | Fallback Supabase branch (MANUAL `M24`) |
