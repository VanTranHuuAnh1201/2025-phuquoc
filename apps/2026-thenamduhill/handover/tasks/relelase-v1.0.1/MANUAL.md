# Thao Tác & Thông Tin Cần Bổ Sung Thủ Công — Release v1.0.1

> **Quy tắc W0b**: Agent gặp thông tin cần người dùng/khách hàng cung cấp thì
> **KHÔNG DỪNG WORKFLOW**. Ghi vào bảng dưới, dùng giá trị mặc định để chạy tiếp
> đến `done/`. Chủ dự án đọc file này và bổ sung sau.

Kế thừa `M1`–`M21` của [release-v1.0.0/MANUAL.md](../release-v1.0.0/MANUAL.md) —
các hạng mục ⏳ ở đó **vẫn còn nợ**, không reset. Bản này bổ sung từ `M22`.

---

## Phần A — Bốn quyết định đã chốt với chủ dự án, KHÔNG hỏi lại

Ghi ở đây để mọi agent đọc là biết, không mở lại cuộc thảo luận.

| # | Chủ đề | Quyết định của chủ dự án (08/08/2026) |
|---|---|---|
| **Đ1** | Thanh toán | **Chỉ hardcode 3 lựa chọn ở FE**: thẻ tín dụng · chuyển khoản · thanh toán trực tiếp. Chưa nối cổng thật nào. **Mặc định mọi action khi test = `at-property`** (thanh toán trực tiếp). Sẽ xử lý ở bản sau — **không hỏi lại liên quan.** |
| **Đ2** | OCR CCCD/Passport | Yêu cầu là **giảm thao tác nhập liệu cho khách đặt online, đặc biệt trên điện thoại**. Phương án đã tư vấn: cắt field + autofill (§2 OVERVIEW), OCR chừa interface ở form check-in lễ tân. |
| **Đ3** | PMS / Channel Manager | Chỉ dựng **lớp adapter + outbox + webhook out**. Chưa nối nhà cung cấp nào. |
| **Đ4** | Upload ảnh | **Supabase Storage + `sharp` server-side**, 4 kích thước + WebP/AVIF, trả `srcset`. |

---

## Phần B — Hạng mục cần chủ dự án bổ sung

| # | Hạng mục yêu cầu | Vị trí sử dụng | Giá trị mặc định tạm thời | Lý do cần bổ sung sau | Trạng thái |
|---|---|---|---|---|:---:|
| **M22** | **Nội dung & ảnh chính thức của resort thay cho bộ crawl** — tên phòng, mô tả, giá niêm yết, chính sách huỷ, bài blog | `packages/theme-h3/src/data/mock-content.ts` · Supabase Storage · seed `room_types` | Bộ crawl từ `thenamduhill.com` hiện tại | ⚠️ **CHẶN GO-LIVE (luật R9).** `thenamduhill.com` là **website cũ của chị đang chạy**. Đẩy bản crawl lên tên miền mới rồi để Google index → Google coi site mới là **bản sao của site cũ**, và tự chọn site cũ để xếp hạng. Đây là thứ làm hại chính SEO mình đang xây | ⏳ Chờ bổ sung |
| **M23** | **Ảnh chụp thật của resort** — chị đã hẹn *"hôm nào chị em mình sẽ ngồi lại để chọn và thay thế một số hình ảnh"* | Hero H3 · card phòng · gallery · OG image (`410-02`) | Bộ ảnh demo Quiet Luxury hiện tại | Ảnh hero là thứ quyết định khách có cuộn tiếp không. OG image động (`410-02`) sinh từ ảnh này — ảnh demo thì link chia sẻ Zalo/Facebook trông không phải của resort | ⏳ Chờ bổ sung |
| **M24** | **Docker Desktop trên máy chạy test** — `supabase start` cần Docker | Tầng 1 (pgTAP) + Tầng 2 (Vitest) của `400-01`, `400-02` | **Fallback đã chừa**: nếu không có Docker, chạy test trên Supabase branch (`create_branch` → test → `delete_branch`). Chậm hơn nhưng không chặn | Test tầng 1-2 chạy nhanh nhất trên local. Branch trên cloud mất ~30s khởi tạo mỗi lần | ⚠️ **CẢ HAI FALLBACK ĐỀU KHÔNG DÙNG ĐƯỢC** — xem `M24b` |
| **M24b** | **Không có môi trường DB cô lập cho test** — `400-01` đã đo trực tiếp, **cả hai** đường của `M24` đều chết:<br>① `docker ps` → `open //./pipe/docker_engine: The system cannot find the file specified` (Docker CLI 24.0.6 có cài, **daemon không chạy**)<br>② `POST /v1/projects/kyarbmendxfgzgousydl/branches` → **`402 entitlement_required`**, `"Branching is supported only on the Pro plan or above"` | `apps/2026-thenamduhill/tests/**` — toàn bộ tầng 2 | **Fallback đường 3 đang dùng — "run-scoped seed"**: test chạy **thẳng vào DB dev chung** (`kyarbmendxfgzgousydl`) nhưng **mọi bản ghi test đều mang tiền tố `zz-test-<runId>`** và **teardown xoá đúng những gì mình tạo** (ngược thứ tự khoá ngoại). Không đụng 148 đơn seed sẵn có. Xem `tests/helpers/seed.ts` | **Đây là rủi ro thật, không phải thủ tục.** Test ghi vào DB dev chung nghĩa là: ① chạy song song hai nhánh git là **giẫm chân nhau**; ② teardown fail giữa chừng để lại rác (đã chặn bằng `afterAll` + `sweepOrphans()` quét tiền tố ở lần chạy sau); ③ **không test được RLS** vì service role bỏ qua RLS — RLS là việc của `400-02`/pgTAP, mà pgTAP **cũng cần** một trong hai đường trên. **Cần chủ dự án chọn**: bật Docker Desktop trên máy build, **hoặc** nâng Pro plan (~25$/tháng) để dùng branching | ⏳ **Chờ chủ dự án quyết — chặn `400-02`** |
| **M25** | **Tài khoản API Ezcloud** (hoặc PMS/Channel Manager chị chọn) — endpoint, API key, tài liệu của họ | `420-02` — implementation thật của `ChannelAdapter` | **Adapter `noop`**: ghi outbox, log ra console, không gửi đi đâu. Toàn bộ luồng chạy đủ, chỉ thiếu bước gửi cuối | Theo Đ3 chỉ dựng lớp. Khi chị chốt nhà cung cấp, viết **1 adapter mới** — không sửa lõi (luật R5) | ⏳ Chờ bổ sung |
| **M26** | **Chốt nhà cung cấp PMS/Channel Manager** — Ezcloud · Hotellink · Kigo · hoặc khác | Quyết định kiến trúc cho `420-02` | Chưa chốt. Adapter thiết kế **không phụ thuộc nhà cung cấp cụ thể** | Mỗi nhà cung cấp có mô hình đồng bộ khác nhau (push webhook vs pull polling vs ARI). Interface hiện chừa đủ cho cả ba, nhưng biết trước thì viết adapter đầu tiên gọn hơn | ⏳ Chờ bổ sung |
| **M27** | **Bucket Supabase Storage** — tên bucket, chính sách public/signed URL, hạn mức | `430-01` — `persist()` trong `app/api/admin/upload/route.ts` | Bucket `media`, public read, ghi qua service role. Đường dẫn `media/{yyyy}/{mm}/{slug}-{hash}.{ext}` | Cần chị xác nhận trước khi tạo — bucket public nghĩa là **mọi ảnh tải lên đều truy cập được bằng URL trực tiếp**. Với ảnh marketing thì đúng; nếu sau này lưu giấy tờ khách thì phải bucket riêng có signed URL | ⏳ Chờ xác nhận |
| **M28** | **Nhà cung cấp OCR nếu bật thật** — FPT.AI eKYC hoặc VNPT eKYC | `440-04` — implementation thật của `IdDocumentScanner` | **Implementation `manual`**: lễ tân nhập tay như hiện tại | Theo Đ2, OCR chỉ chừa interface ở form check-in. Chi phí ~200-500đ/lần quét. Chỉ đáng bật khi lễ tân check-in ≥20 lượt/ngày | ⏳ Chờ quyết định |
| **M29** | **Tên miền chính thức để khai `hreflang` + canonical** | `410-02` · `NEXT_PUBLIC_SITE_URL` | `thenamduhillresort.com` (theo `DEPLOY.md`) | **Trùng nợ `M5` của v1.0.0 — chưa giải quyết.** `hreflang` và canonical khai sai tên miền còn tệ hơn không khai: Google index tên miền không ai truy cập. Phải chốt trước `410-02` | ⏳ **Chờ bổ sung — chặn `410-02`** |

---

## Phần B2 — Nợ kỹ thuật nội bộ phát hiện ở `380-01` (KHÔNG cần hỏi chủ dự án)

Khác Phần B: hai mục này **`ndh-sa` quyết được**, không phải chờ khách. Ghi ở
đây để không rơi mất giữa hai ticket. Cả hai đã ghi kèm vào
[`API_INTEGRATION_MAP.md`](../release-v1.0.0/API_INTEGRATION_MAP.md) §M9 và §3.

| # | Hạng mục | Vị trí đang dùng | Fallback đang dùng | Lý do phải xử lý | Trạng thái |
|---|---|---|---|---|:---:|
| **M30** | **Cột `property_settings.bank` chưa tồn tại** — `booking-types.ts:512` khai `BankConfig` và ghi rằng nó map vào `property_settings.bank` (jsonb), nhưng `information_schema.columns` DB sống cho thấy bảng chỉ có `id, brand, hero, about, facts, nav, transport, notes, child_policy, created_at, updated_at` | `/api/admin/settings/bank` (`390-01`) · `GetBankSettingsResponse` | Hợp đồng khai **mọi trường `BankSettingsDto` là tuỳ chọn** — FE chịu được trạng thái rỗng, không giả định đã có số TK | Viết route trước khi thêm cột sẽ ăn `42703 column does not exist`. **`390-01` phải kèm migration** `ALTER TABLE property_settings ADD COLUMN bank jsonb NOT NULL DEFAULT '{}'` | ✅ **`380-02` đã chốt**: `390-01` **bắt buộc** kèm migration `ADD COLUMN bank jsonb NOT NULL DEFAULT '{}'::jsonb` đặt **trước** khi viết route. **Không** tạo bảng `settings` riêng. Xem `M34` |
| **M31** | **Migration trên DB lệch file trong repo** — `20260808092418_fix_lifecycle_rpcs_column_names` có trong `supabase_migrations.schema_migrations` nhưng **không có file nào** trong `supabase/migrations/`. Hai file RPC cũng được áp dưới timestamp khác tên file | `supabase/migrations/` | Không có — DB hiện tại vẫn đúng, chỉ repo là thiếu | Dựng lại DB từ repo sẽ ra schema **thiếu bản sửa tên cột** ⇒ RPC vòng đời đơn hỏng bằng `42703`, mà `pnpm build` vẫn xanh. Đây đúng loại lỗi chỉ nổ lúc chạy | ✅ **`380-02` đã chốt**: **kết xuất thành file**, giao **`400-02`**. **CẤM gộp/viết lại** 2 file `20260102*` — sửa migration đã chạy vi phạm BE7 |

### Ba nợ mới `ndh-sa` phát hiện khi review `380-02` (08/08/2026)

| # | Hạng mục | Vị trí đang dùng | Fallback đang dùng | Lý do phải xử lý | Trạng thái |
|---|---|---|---|---|:---:|
| **M32** | **`fail()` không mang được field phụ của mã lỗi** — chữ ký `fail(status, code: string, message: I18nText)` ở `src/lib/auth/errors.ts:34` **chỉ nhận 3 tham số**. Nhưng hợp đồng có **8 mã lỗi kèm field dữ liệu**: `ROOM_TYPE_IN_USE`/`RATE_PLAN_IN_USE` (`activeBookingCount`), `INVALID_TRANSITION` (`currentStatus`), `EXCEEDS_PAID_AMOUNT` (`paidAmount`), `VALIDATION_FAILED` (`fields[]`), `RATE_LIMITED` (`retryAfterSeconds`) | `apps/2026-thenamduhill/src/lib/auth/errors.ts:34` | Hợp đồng khai **đúng ý định**; route hiện chỉ gửi được `code` + `message` | FE đọc `error.activeBookingCount` ra **`undefined`** mà **typecheck vẫn xanh** — đúng loại bug chỉ nổ lúc chạy. Admin thấy "còn đơn đang dùng" nhưng không biết **bao nhiêu** đơn ⇒ mất đúng thông tin để hành động | ⏳ **Ticket nào cài 8 mã đó phải mở rộng `fail()` TRƯỚC** (thêm tham số thứ 4 `extra?: Record<string, unknown>`). Sớm nhất: `390-01`/`390-02` |
| **M33** | **`/cancel` + `/refund` trả nguyên 41 cột hàng thô `bookings`** — cả hai route `return ok(updatedBooking)` với `updatedBooking` là kết quả RPC `RETURNS public.bookings`. Không chỉ lệch snake_case: **trả cả `guest_id_number` (CCCD), `customer_id`, `guest_email`, `guest_tax_code`** ra ngoài, cho một route mà `booking.cancel.own` cho phép **khách** gọi | `src/app/api/bookings/[id]/cancel/route.ts` · `.../refund/route.ts` | Hợp đồng khai **snake_case đúng hiện trạng** + cảnh báo tại chỗ | Đây là **rò dữ liệu định danh cá nhân**, không phải lỗi thẩm mỹ. Đồng thời FE đọc `paidAmount` ra `undefined` vì thực tế là `paid_amount` | ⏳ **`390-07`**: map tường minh sang camelCase, **CHỈ trả field có trong hợp đồng**. Đổi `CancelBookingResponse`/`RefundBookingResponse` phải mở **ticket `900-*`** theo luật freeze |
| **M34** | **`390-01` đổi phạm vi: 4 → 5 hạng mục** — ngoài 4 nhóm API danh mục, nay **bắt buộc kèm migration** thêm cột `property_settings.bank` (hệ quả M30 đã chốt) | `handover/.../pending/390-01.md` · `supabase/migrations/` | Không có | Không thêm cột trước thì route `/api/admin/settings/bank` ăn `42703` ngay lần gọi đầu | ⏳ **`ndh-pm` cập nhật phạm vi `390-01`** trước khi chuyển sang `process/` |

### Bốn phát hiện của `400-01` khi dựng tầng test API (08/08/2026)

Ba cái đầu là **bug sản phẩm**, đã mở ticket `900-*` theo AC-14 (không sửa lén).
Cái thứ tư là thiếu cấu hình.

| # | Hạng mục | Vị trí | Fallback đang dùng | Lý do phải xử lý | Trạng thái |
|---|---|---|---|---|:---:|
| **M35** | **`CRON_SECRET` và `PAYMENT_WEBHOOK_SECRET` chưa có trong `.env.local`** | 2 route `/api/cron/*` · `/api/webhooks/payment` | Cron: route tự fallback về chuỗi cứng `'demo_cron_secret_2026'` (`route.ts:14`). Webhook: **không fallback** — trả `500 WEBHOOK_SECRET_MISSING`, đúng luật C4 | Cron fallback sang secret **đoán được** (nằm ngay trong mã nguồn công khai) nghĩa là bất kỳ ai cũng gọi được cron trên production. Phải đặt `CRON_SECRET` thật **trước khi Go-Live**. Webhook chờ `M4` theo Đ1, không chặn v1.0.1 | ⏳ **`CRON_SECRET` chặn Go-Live** |
| **M36** | **`mapPromotionRow()` đọc 13 cột KHÔNG TỒN TẠI ⇒ mọi điều kiện khuyến mãi bị mất** — hàm map ở `src/lib/db/mappers.ts:178-189` đọc `row.min_nights`, `row.min_amount`, `row.stay_window`, `row.book_window`, `row.room_type_ids`, `row.rate_plan_ids`, `row.lead_time_days`, `row.channels`… nhưng bảng `promotions` **chỉ có một cột `conditions jsonb`**, và hàm **không đọc cột đó**. Xác nhận bằng `information_schema`: **0/13 cột tồn tại** | `src/lib/db/mappers.ts:178-189` | Không có | **Đã ĐO trực tiếp**, không suy đoán: đơn **1 đêm**, đặt trước 281 ngày, gọi `POST /api/availability` rồi đọc `promotion.evaluations` — cả 7 KM đều có `conditions = {}`.<br><br>Hậu quả quan sát được: **`fourth-night-free` ĐỦ ĐIỀU KIỆN trên đơn 1 đêm** (đáng lẽ cần `minNights: 4` **và** đêm ở nằm trong `2026-09-01..2026-11-30`). Vì nó `stackable=false`, nó **loại toàn bộ 3 KM còn lại** bằng `superseded-by-exclusive` — `early-bird-30`, `last-minute`, `long-stay` đều bị huỷ.<br><br>Nghĩa là khuyến mãi hiện **không chạy theo bất kỳ quy tắc nào admin đặt**: cái sai điều kiện thì được áp, cái đúng điều kiện thì bị loại. Đây là **sai tiền trên mọi đơn**, không phải lỗi hiển thị | ⏳ **Chưa mở ticket** — `ndh-sa` quyết gộp vào `390-02` (API khuyến mãi) hay mở `900-04` riêng. **Không tự mở** vì `390-02` sẽ viết lại chính hàm map này ⇒ mở ticket riêng có thể thành việc trùng |
| **M37** | **Không test được RLS ở tầng 2** | `tests/**` | Không có | Tầng 2 dùng service role (**bỏ qua RLS**) và JWT tự phát hành (nên `current_account_id()` rỗng). Cách ly khách A/khách B hiện do **tầng ứng dụng** đảm bảo, đã có test — nhưng bản thân **policy RLS thì chưa ai kiểm**. Việc đó là của `400-02`/pgTAP, mà pgTAP **cần Docker hoặc branching** — cả hai đang chết (xem `M24b`) | ⏳ **Chặn `400-02`**, phụ thuộc `M24b` |

| **M39** | **Bộ test API đỏ ngẫu nhiên vì KM test rò rỉ giữa các lần chạy** — `teardown()` xoá `promotions` do test tạo, nhưng khi một lần chạy bị ngắt giữa chừng (hoặc file `availability.test.ts` fail sớm) thì các KM `zz-test-*` **còn `active = true`** nằm lại trong DB dev chung. Lần chạy sau, `buildQuote()` áp luôn các KM đó ⇒ sai số tiền | `tests/helpers/seed.ts` (`disablePromotions`, `withAutoPromotionsDisabled`, `sweepOrphans`) | Xoá tay: `DELETE FROM promotions WHERE id LIKE 'zz-test-%'` | **Đo được, và ĐÃ KIỂM là có TRƯỚC `900-03`**: stash toàn bộ thay đổi của `900-03` rồi chạy `availability.test.ts` — vẫn đỏ 2 case ở lần chạy đầu (`expected 280000 to be 585280`, `expected 200000 to be 2000000`), xanh ở lần thứ hai. Tìm thấy 3 KM mồ côi `zz-test-*-mskjpwbt5t7x` của một lần chạy **trước đó** còn `active=true`.<br><br>Ảnh hưởng: `pnpm test:api` **không tin được** khi chạy nhiều lần liên tiếp — đúng thứ làm người sau tưởng mình vừa làm hỏng cái gì. `sweepOrphans()` hiện chỉ quét `room_types`/`accounts`, **không quét `promotions`** | ⏳ **Chưa mở ticket** — `ndh-sa` quyết. Hướng sửa: thêm `promotions` vào `sweepOrphans()` và để `teardown()` chạy trong `finally`.<br><br>🔁 **Tái hiện lần 2 ở `390-03` (08/08/2026)** — bằng chứng độc lập, khác lần đo của `900-03`: `pnpm test:api` đỏ **5 case / 3 file** (`availability` 3, `bookings` 1, `misc-routes` 1). Truy vấn DB tìm thấy **6 KM `zz-test-*` còn `active = true`** của **hai** lần chạy trước (`msklbv52121q`, `msklcxv7jrfz`) — gồm `p10`/`p20` (percent) và `capped` (percent 50). Chạy `DELETE FROM promotions WHERE id LIKE 'zz-test-%'` rồi chạy lại: **136/136 xanh, 8/8 file**. Không đụng một dòng code sản phẩm nào giữa hai lần chạy ⇒ nguyên nhân là rác dữ liệu, không phải lỗi code.<br><br>Xác nhận thêm: `teardown()` chỉ xoá KM của **chính lần chạy này** (`createdPromotions`), nên KM mồ côi của lần trước tồn tại vĩnh viễn cho tới khi có người xoá tay. **Mức độ ưu tiên nên nâng** — đây là lần thứ hai một ticket khác nhau phải dừng lại điều tra cùng một triệu chứng.<br><br>✅ **ĐÃ SỬA (08/08/2026, phiên chính)** — nguyên nhân gốc **không phải** "`sweepOrphans()` không quét `promotions`" như hai lần đo trước kết luận. Hàm **có** quét (dòng 466 bản cũ), nhưng gọi `.delete()` mà **không kiểm `error`** ⇒ nuốt lỗi im lặng (vi phạm C3). KM đã dính `booking_promotions` bị `23503` chặn xoá, hàm vẫn chạy tiếp như thành công, KM ở lại với `active = true`.<br><br>Bản sửa đảo thứ tự: `UPDATE active = false` **trước** (luôn thành công kể cả khi khoá ngoại chặn), rồi mới `DELETE` và chỉ bỏ qua đúng mã `23503`, mọi lỗi khác vẫn ném. `typecheck` sạch. Cần một lượt `pnpm test:api` chạy 3 lần liên tiếp trên DB rảnh để nghiệm thu — `ndh-qc` xác nhận |

| **M40** | **Bảng `api_rate_limits` chưa có ai gọi dọn định kỳ** — `390-03` dựng bảng đếm rate limit dùng chung + hàm `public.purge_expired_rate_limits()`, nhưng **chưa nối vào cron nào**. Bảng phình theo số IP đã từng gọi `/api/bookings/lookup` | `supabase/migrations/20260104000100_api_rate_limits.sql` · `src/lib/api/shared-rate-limit.ts` | **Không chặn gì cả** — hàng hết hạn không làm sai kết quả (`consume_rate_limit()` tự mở cửa sổ mới khi `window_ends_at <= NOW()`), chỉ tốn dung lượng. Ước tính: mỗi IP một hàng ~80 byte, 10.000 IP/tháng ≈ 800KB | Gọn nhất là thêm một dòng `purge_expired_rate_limits()` vào cron `release-holds` (đã chạy mỗi 5 phút). **Cố ý KHÔNG làm ở `390-03`** vì `390-06` đang xác minh 2 cron đó chạy thật — chèn thêm việc vào lúc chưa biết cron có chạy hay không là trộn hai biến số, `390-06` fail thì không rõ vì cron hỏng hay vì việc mới thêm | ⏳ **Giao `390-06`** sau khi cron được xác minh chạy thật |

**Quyền mới đã SA duyệt** (không phải nợ, ghi để BE tra): thêm
`integration.manage` vào `packages/core/src/permissions.ts` — cấp cho **`owner` +
`manager`**, làm ở **`420-01`**. Thay cho việc mượn `settings.bank` sai ngữ nghĩa.

---

## Phần C — Hạng mục v1.0.0 còn nợ ảnh hưởng trực tiếp v1.0.1

Trích lại để không bị quên, chi tiết ở [release-v1.0.0/MANUAL.md](../release-v1.0.0/MANUAL.md):

| # | Hạng mục | Ảnh hưởng tới v1.0.1 |
|---|---|---|
| `M2` | Bộ ảnh HD & nội dung chính thức | Trùng `M22`/`M23`. **Chặn Go-Live** |
| `M4` | Live Payment Webhook | **Theo Đ1 giữ nguyên ⏳** — `PAYMENT_MODE=simulated`, mọi test dùng `at-property`. Không hỏi lại |
| `M5` | Chốt tên miền | Trùng `M29`. **Chặn `410-02`** |
| `M1` | Số tài khoản ngân hàng thật | Không chặn v1.0.1 (Đ1 chưa nối cổng). Chỉ hiện QR mẫu |
| `M3` | SendGrid API key thật | Không chặn v1.0.1. Email vẫn mock logger |

---

## Phần D — Hai thứ chặn cứng, không được bỏ qua

Khác với các dòng ⏳ ở trên (chạy tiếp bằng fallback được), hai điều này
**không có fallback**:

| # | Chặn gì | Vì sao không có fallback |
|---|---|---|
| **1** | **`M22` chặn Go-Live tên miền** | Không có giá trị mặc định nào thay được nội dung thật. Bản crawl lên production là vấn đề bản quyền **và** tự bắn vào chân SEO của mình. Cổng W8 phải FAIL nếu chưa thay |
| **2** | **`M29` chặn `410-02`** | `hreflang`/canonical trỏ sai tên miền gây hại nhiều hơn không khai. Ticket `410-02` **không được chuyển `process/`** khi `M29` còn ⏳ |
