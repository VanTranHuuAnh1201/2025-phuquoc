# Bản đồ API — Cầu nối FE ↔ BE · Release v1.0.0

> **Tài liệu này là một thứ duy nhất**: danh sách API theo module, mỗi dòng nói
> rõ **Backend xong chưa** và **Frontend đã nối chưa**. Nhìn cột trạng thái là
> biết module nào còn lỗi, ai đang chặn ai.
>
> **Cập nhật lần cuối**: 08/08/2026

---

## 0. Bảng điều khiển — nhìn 10 giây biết tình hình

| Module | Tổng API | HĐ 🟡/✅ | BE ✅ | FE ✅ | Còn lỗi |
|---|:--:|:--:|:--:|:--:|---|
| M1 · Xác thực & Phiên | 4 | 0 | 4 | 3 | — |
| M2 · Tồn kho & Báo giá | 2 | 1 | 2 | 0 | 🔴 FE tính giá ở client, không gọi API |
| M3 · Đơn hàng — tạo & đọc | 3 | 0 | 3 | 3 | — |
| M4 · Vòng đời đơn | 4 | 1 | 4 | 3 | 🟡 Huỷ đơn chưa nối |
| M5 · Hoàn tiền | 2 | 2 | 2 | 0 | 🟡 BE xong (`900-01` đã vá) · FE chưa nối |
| M6 · Phòng vật lý | 1 | 0 | 1 | 1 | — |
| M7 · Khuyến mãi | 1 | 0 | 1 | 1 | 🔴 **Điều kiện KM bị mất sạch** (`M36`) — sai tiền mọi đơn |
| M8 · Quản trị & Nội dung | 2 | 2 | 2 | 2 | — |
| M9 · Danh mục (hạng phòng, giá) | 7 | 7 | 7 | 0 | 🟡 BE xong (`390-01`, 33 case) · 🔴 4 màn CMS **vẫn đọc `catalog.store`** — chờ `390-02` |
| M10 · Tự động & Webhook | 3 | — | 0 | — | 🔴 **`M42` cron nhả đơn nhưng KHÔNG trả tồn kho → 20 đêm hết phòng giả** (đã sửa `390-06`) · 🟡 thiếu log chứng minh lịch tự chạy (`M43`) · 🟡 Webhook chờ `PAYMENT_WEBHOOK_SECRET` (`M4`) |
| M11 · Tra cứu công khai | 1 | 1 | 1 | 0 | 🟡 BE xong (`390-03`) · 🔴 `/lookup` **vẫn gọi route cũ** ⇒ khách vẫn nhận 401 |
| M12 · Outbox tích hợp | 2 | 2 | 0 | 0 | 🔴 Chưa có bảng lẫn route |
| M13 · Quét giấy tờ | 1 | 1 | 0 | 0 | 🔴 Chưa có route |
| M14 · Revalidate cache | 1 | 1 | 0 | 0 | 🔴 Chưa có route |
| **Tổng** | **34** | **18** | **29** | **13** | **8 hạng mục** |

> **Cập nhật 08/08/2026 (`390-01`) — tổng 31→34, `BE ✅` 21→29.** M9 tách từ
> 4 dòng thành **7**: `room-types`, `rate-plans`, `addons` mỗi cái là **hai**
> Route Handler khác nhau (`route.ts` giữ GET+POST, `[id]/route.ts` giữ
> PATCH+DELETE) — gộp 4 method vào một dòng che mất việc thật và không khớp
> lệnh tự kiểm §5.1. Cả 7 lên ✅ với bằng chứng 33 case ở §M9.
>
> Cột `HĐ 🟡/✅` đếm số API **đã khai interface** ở
> `packages/core/src/api-contracts.ts` (ticket `380-01`). 14 API có hợp đồng,
> tất cả đang ở 🟡 — chờ `ndh-sa` duyệt ở `380-02` mới lên ✅ và freeze.
>
> **Tổng nhảy từ 22 lên 31** vì v1.0.1 thêm M12/M13/M14 và đếm đủ 4 API M9 + 1
> API M11 (bản trước ghi `0` cho hai module chưa có route — che mất khối lượng
> việc thật). `BE ✅` giảm 22→19 vì 3 route M10 hạ xuống 🟡: đã khai lịch nhưng
> chưa có log chứng minh chạy.
>
> 🔴 **Cập nhật 08/08/2026 — `BE ✅` giảm tiếp 19→16.** `400-01` dựng tầng test
> API và **gọi thật cả 21 route**. Ba route trước đây ghi ✅ dựa trên đọc code
> hoá ra **hỏng khi chạy**: `/refund`, `/cron/release-holds`, `/cron/no-show`.
> Thêm `/admin/accounts` hạ xuống 🔴 vì **không có kiểm quyền**.
>
> Đây đúng là lý do luật A3 tồn tại: *build xanh không phải bằng chứng*. Bốn
> route này build xanh, typecheck sạch, đọc code thấy hợp lý — và không chạy được.
>
> ✅ **Cập nhật 08/08/2026 (`900-02`) — `BE ✅` 16→17.** `/admin/accounts` đã vá
> bằng `withAuthGuard(..., 'account.manage')` và có **6 case** khoá lại (401 không
> cookie · 403 cho `editor`/`receptionist`/`manager`/`customer` · 200 cho `owner`).
> Đã rà **toàn bộ 21 route**: 8 route còn lại không có guard đều **cố ý công khai
> hoặc dùng cơ chế xác thực riêng** — đối chiếu từng file, xem §2.9.
>
> ✅ **Cập nhật 08/08/2026 (`900-01`) — `BE ✅` 17→18.** `/refund` đã vá bằng
> migration `20260103000000` mở rộng `chk_logs_action` từ 9 lên 10 giá trị
> (thêm `refund-processed`), `LogAction` trong `booking-types.ts` cập nhật cho
> khớp (BE8). Đã gọi thật: `200`, `paid_amount` giảm đúng 100.000, ghi **đúng 1
> dòng** `activity_logs` với `action='refund-processed'` + 1 dòng `payments`
> `kind='refund'`. Đã rà **cả 6 RPC** ghi log bằng `pg_get_functiondef()` trên DB
> thật — 8/8 vị trí ghi `action` đều nằm trong constraint, `/refund` là chỗ duy
> nhất vi phạm.
>
> ✅ **Cập nhật 08/08/2026 (`900-03`) — `BE ✅` 18→20.** Hai cron đã sửa tên cột
> (`check_in`, `check_out`, `assigned_room_unit_id`, `cancellation`/`cancelled_at`)
> và **gọi thật**: cả hai trả `200`, `failed = 0`. Bằng chứng hành vi, đọc lại từ
> server chứ không nhìn response: đơn `pending_payment` quá hạn → `expired`; đơn
> `confirmed` quá ngày → `no_show`. Bộ test tăng **79 → 85 case**.
>
> Ba route M10 nay đều đúng hợp đồng BE1 ⇒ **`LEGACY_SHAPE_ROUTES` trong
> `tests/helpers/request.ts` nay RỖNG**, mọi route đều bị wrapper kiểm ngặt
> `error.message = {vi,en}`. Webhook giữ 🟡 vì chưa cấu hình secret (`M4`), không
> phải vì code sai.
>
> ✅ **Cập nhật 08/08/2026 (`390-03`) — `BE ✅` 20→21.** Thêm route công khai
> `GET /api/bookings/lookup` (M11). Đã gọi thật không cookie: `200` với cặp
> `code`+`phone` đúng, `404` **cùng một body** cho cả hai nhánh sai, `429` khi
> vượt 10 lượt/5 phút. Kèm migration `20260104000100_api_rate_limits.sql` —
> bộ đếm rate limit **dùng chung** ở Postgres, vì bộ đếm in-memory cũ không có
> hiệu lực trên serverless nhiều instance.
>
> ⚠️ **`FE ✅` KHÔNG tăng.** `src/app/lookup/page.tsx:44` vẫn gọi
> `/api/bookings` cũ ⇒ với khách chưa đăng nhập tính năng **vẫn hỏng**. Ghi 🔴
> theo đúng luật A2: "còn dùng route cũ / store cục bộ = 🔴, không phải ✅".
> `390-04` [FE] mới hạ được ô đó.

### Ba việc chặn nặng nhất

*(sắp lại 08/08/2026 sau khi `400-01` đo thật — theo mức ảnh hưởng với người
dùng cuối, không theo độ khó kỹ thuật)*

| Ưu tiên | Việc | Ảnh hưởng |
|:--:|---|---|
| 🔴 1 | **`M36`** — điều kiện khuyến mãi bị mất sạch (`mapPromotionRow` đọc 13 cột không tồn tại) | **Sai tiền trên mọi đơn có KM.** Đo được: KM `fourth-night-free` áp cho đơn **1 đêm**, đồng thời loại 3 KM hợp lệ khác. Admin đặt điều kiện gì hệ thống cũng không theo |
| 🔴 2 | **`M9` [FE]** — BE đã xong (`390-01`), nhưng 4 màn CMS **vẫn ghi vào `catalog.store`** | Với chủ resort **chưa có gì thay đổi**: hạng phòng tạo trong CMS vẫn chỉ nằm trên máy vừa dùng, đổi máy là mất. `390-02` mới đóng được |
| 🔴 3 | **`M2`** — FE tự tính giá ở client (`stores/useQuote.ts:68`) | Giá khách thấy do client tính, giá chốt đơn do server tính — hai đường khác nhau. Admin sửa giá gốc trong CMS thì trang khách không đổi |

*(`900-02` — `/admin/accounts` không kiểm quyền — **đã vá 08/08/2026**, rời khỏi
bảng này. Nó từng đứng ưu tiên 1 vì là lỗ bảo mật khai thác được không cần tài
khoản; nay có 6 case khoá lại, gồm 5 negative.)*

*(`900-01` — `/refund` trả `500` mọi lần — **đã vá 08/08/2026**, rời khỏi bảng
này. Nguyên nhân gốc là `chk_logs_action` thiếu `refund-processed`; đã mở rộng
constraint bằng migration mới thay vì gộp hoàn tiền vào `payment-recorded`, để
nhật ký còn phân biệt được chiều tiền khi tranh chấp. `M11` lên thế chỗ.)*

*(`900-03` — 2 cron hỏng 100% vì sai tên cột — **đã vá 08/08/2026**, rời khỏi
bảng này. Nó từng đứng ưu tiên 2 vì gây **hết phòng giả** một cách âm thầm:
`vercel.json` chạy `release-holds` mỗi 5 phút, mỗi lần fail chỉ để lại log 500
nên không ai thấy. Nay có 6 case khoá lại, trong đó **2 case negative chứng minh
đơn `confirmed` không bị nhả** — đã kiểm bằng mutation test, gỡ guard là test đỏ.
`M9` lên thế chỗ.)*

*(`M11` — `/lookup` 401 — **BE đã vá 08/08/2026** (`390-03`), rời khỏi bảng này.
⚠️ Nhưng **với người dùng cuối tính năng chưa chạy**: trang `/lookup` vẫn gọi
route cũ, `390-04` [FE] mới đóng được. Nếu `390-04` trượt khỏi release thì mục
này phải quay lại bảng — route có mà không màn nào gọi thì khách vẫn không tra
được đơn. `M2` lên thế chỗ.)*

---

## 1. Quy ước trạng thái

### Cột `BE` — Backend

| | Nghĩa | Điều kiện ghi |
|:--:|---|---|
| ✅ `done` | Route chạy đúng, đã gọi thử thật | Có E2E xanh hoặc `curl` ghi lại kết quả |
| 🟡 `process` | Route tồn tại nhưng chưa chạy được đầu-cuối | Thiếu migration, thiếu cấu hình, chưa test |
| 🔴 `error` | Gọi vào là lỗi, **hoặc chưa có route** | Có mã lỗi tái hiện được |

### Cột `FE` — Frontend integration

| | Nghĩa | Điều kiện ghi |
|:--:|---|---|
| ✅ `done` | Giao diện gọi thật, đã đi lại luồng | `grep` thấy `fetch()` + đã chạy thử |
| 🟡 `process` | Đang nối dở, hoặc chỉ một phần màn dùng | |
| 🔴 `error` | Gọi nhưng lỗi, **hoặc còn dùng store cục bộ** | |
| `—` | Không cần FE (cron, webhook) | |

> ⚠️ **Không ghi ✅ nếu chưa chạy thử.** Bản đầu của tài liệu này ghi
> "ĐÃ NỐI & PASS 100%" cho check-in/check-out, trong khi giao diện chỉ ghi vào
> `localStorage` — bấm xong F5 là mất. Tài liệu sai nguy hiểm hơn không có tài
> liệu, vì người sau tin rằng chỗ đó đã xong.

### Cột `Hợp đồng` — interface *(bổ sung v1.0.1)*

Mô hình contract-first: FE code theo interface **trước khi** BE viết thân hàm
(xem [v1.0.1 RUNBOOK](../relelase-v1.0.1/RUNBOOK.md)). Cần biết **ai đang dùng
phiên bản nào** của interface.

| Cột | Nghĩa | Ai ghi |
|---|---|---|
| `HĐ` | ✅ interface đã khai và SA đã duyệt · 🟡 đang khai · 🔴 chưa có | `ndh-be` (`380-01`) |
| `v` | Số phiên bản interface: `v1`, `v2`… **tăng mỗi lần đổi sau khi freeze** | `ndh-sa` khi duyệt `900-*` |
| `BE sửa` | Timestamp lần sửa interface gần nhất | `ndh-be` |
| `FE dùng` | Phiên bản + timestamp FE đọc để code | `ndh-fe` |
| `⚠` | **Tự đối chiếu**: `v` ≠ phiên bản ở `FE dùng` → đánh ⚠️ | Ai thấy trước |

```
| API | Method | HĐ | v | BE sửa | FE dùng | BE | FE | ⚠ |
|---|:--:|:--:|:-:|---|---|:--:|:--:|:-:|
| /api/admin/room-types | POST | ✅ | v2 | 08/08 15:10 | v2 · 08/08 15:30 | 🔴 | 🔴 | — |
| /api/bookings/lookup  | GET  | ✅ | v3 | 08/08 16:00 | v2 · 08/08 14:32 | 🟡 | 🔴 | ⚠️ |
```

**Vì sao cần cột `v` chứ không chỉ timestamp**: timestamp một mình không báo được
cho FE. Quan trọng hơn — đổi *ý nghĩa* mà giữ nguyên *kiểu* (ví dụ `amount` từ
VNĐ sang xu) thì **typecheck vẫn xanh mà chạy sai**. Cột `v` bắt buộc FE đọc lại,
không dựa vào typecheck.

⚠️ **Ô có ⚠️ = FE đang code theo bản cũ.** `ndh-pm` kiểm cột này mỗi lần đối soát
tiến độ; có ⚠️ thì báo ngay, không đợi đến lượt 5.

---

## 2. Danh sách API theo module

### M1 · Xác thực & Phiên

| API | Method | BE | FE | FE gọi ở đâu | Ghi chú |
|---|:--:|:--:|:--:|---|---|
| `/api/auth/login` | POST | ✅ | ✅ | `stores/auth.store.ts:129` | JWT cookie 8h (nhân viên) / 30 ngày (khách) |
| `/api/auth/logout` | POST | ✅ | ✅ | `stores/auth.store.ts:135` | Xoá cookie `ndh_session` |
| `/api/auth/me` | GET | ✅ | ✅ | `stores/auth.store.ts:144` | Trả user + `permissions` |
| `/api/auth/register` | POST | ✅ | 🟡 | `stores/auth.store.ts:131` | Có hàm store, chưa màn nào gọi |

**Vì sao ở đây**: `requireAuth()` đọc lại `accounts` từ DB **mỗi request** thay vì
tin payload token — vô hiệu hoá tài khoản hay đổi vai trò có hiệu lực ngay, và
body request gửi kèm `role` cũng vô nghĩa (luật BE2).

✅ **Đã kiểm bằng test tầng 2** (`tests/api/auth.test.ts`, 14 case) — bằng chứng
cho cả 4 dòng ✅ ở trên:

| Kiểm | Kết quả đo được |
|---|---|
| Đăng ký gửi kèm `role: 'owner'` | DB ghi `customer` — BE2 đứng vững |
| Sai mật khẩu **vs** email không tồn tại | **Cùng một** thông điệp `INVALID_CREDENTIALS` ⇒ không dò được email nào có thật |
| Tài khoản `active=false` | `403 ACCOUNT_DISABLED`, **phân biệt** với `401` |
| Token ký đúng nhưng account đã xoá | `401` ⇒ chứng minh guard **thật sự đọc lại DB**, không tin payload |
| Tài khoản bị khoá giữa ca | `403` ngay request kế tiếp |

---

### M2 · Tồn kho & Báo giá 🔴

| API | Method | HĐ | v | BE sửa | FE dùng | BE | FE | ⚠ | FE gọi ở đâu | Ghi chú |
|---|:--:|:--:|:-:|---|---|:--:|:--:|:-:|---|---|
| `/api/availability/search` | POST | 🟡 | v1 | 08/08 (`380-01`) | — | ✅ | 🔴 | — | **không nơi nào** | `AvailabilitySearchRequest/Response`. Trả `data.rooms[].{room, availability}` |
| `/api/availability` | POST | 🔴 | — | — | — | ✅ | 🔴 | — | **không nơi nào** | Không khai hợp đồng — `390-05` chỉ nối `/search` |

**Lỗi đang có**: trang `/booking` và các màn CMS tính giá bằng `buildQuote()` của
`@repo/core` **chạy ở trình duyệt** (`stores/useQuote.ts:68`), không gọi API.

**Hậu quả**: giá khách thấy do client tự tính, giá chốt đơn do server tính — hai
đường khác nhau. Admin sửa giá gốc trong CMS thì trang khách **không đổi** vì
client đọc seed cục bộ.

**Cách sửa**: `useQuote.ts` gọi `POST /api/availability/search` thay vì
`buildQuote()` trực tiếp. Công thức vẫn nằm ở `core` — chỉ đổi *nơi chạy*.

> Lưu ý: **không có** `/api/pricing/quote` như bản tài liệu cũ ghi.

---

### M3 · Đơn hàng — tạo & đọc

| API | Method | BE | FE | FE gọi ở đâu | Ghi chú |
|---|:--:|:--:|:--:|---|---|
| `/api/bookings` | GET | ✅ | ✅ | `stores/booking.store.ts` | Giới hạn 100 đơn |
| `/api/bookings` | POST | ✅ | ✅ | `admin/orders/_shared/NewBookingForm.tsx:169` | RPC `create_booking_atomic` + `SELECT FOR UPDATE` |
| `/api/bookings/[id]` | GET | ✅ | ✅ | `admin/orders/[id]/page.tsx` | Trả **hàng thô snake_case** + `activity_logs`, `payments` |

**Vì sao dùng admin client, không dựa RLS**: bảng `bookings` có đúng một policy
SELECT `customer_id = current_account_id()`. Nhân viên đăng nhập bằng JWT tự phát
hành nên hàm đó rỗng ⇒ **lễ tân nhận `[]` dù DB có 44 đơn**, HTTP vẫn `200` nên
không có lỗi để đọc. Nay lọc quyền ở tầng ứng dụng; khách vẫn bị ép
`customer_id` đúng bằng chính mình (E2E xác nhận không rò rỉ chéo).

**Vì sao `fetchBookingsFromApi()` không ghi đè khi API trả rỗng**: mảng rỗng là
kết quả hợp lệ khi DB chưa seed. Ghi đè sẽ xoá 30 đơn demo rồi `persist` lưu lại
trạng thái rỗng ⇒ F5 đọc đúng cái rỗng, **không bao giờ tự phục hồi**.

---

### M4 · Vòng đời đơn

| API | Method | HĐ | v | BE sửa | FE dùng | BE | FE | ⚠ | FE gọi ở đâu | Ghi chú |
|---|:--:|:--:|:-:|---|---|:--:|:--:|:-:|---|---|
| `/api/bookings/[id]/payments` | POST | 🔴 | — | — | — | ✅ | ✅ | — | `booking.store.ts` → `changeStatusViaApi('confirmed')` | Không trong phạm vi v1.0.1 |
| `/api/bookings/[id]/check-in` | POST | 🔴 | — | — | — | ✅ | ✅ | — | `changeStatusViaApi('checked_in')` | Bắt buộc `roomUnitId` (**UUID**) + `idNumber` |
| `/api/bookings/[id]/check-out` | POST | 🔴 | — | — | — | ✅ | ✅ | — | `changeStatusViaApi('checked_out')` | Chặn nếu chưa thu đủ (`NOT_SETTLED`) |
| `/api/bookings/[id]/cancel` | POST | 🟡 | v1 | 08/08 (`380-01`) | — | ✅ | 🟡 | — | **chưa nối** — `CancelDialog` còn gọi store | `CancelBookingRequest/Response`. ⚠️ Response là **hàng thô snake_case** |

**Vì sao mỗi bước một route riêng, không phải `PATCH /status` chung**:

| Bước | Dữ liệu bắt buộc kèm |
|---|---|
| Duyệt cọc | số tiền (mặc định `depositAmount`) |
| Nhận phòng | **phòng vật lý** + **CCCD** (khai báo lưu trú) |
| Trả phòng | phát sinh tại phòng + xác nhận đã thu đủ |
| Huỷ | lý do huỷ |

Gộp một endpoint sẽ phải kiểm điều kiện chéo và mất ý nghĩa nghiệp vụ từng bước.
Đây cũng là lý do nút "Nhận phòng" trên dashboard **mở drawer** thay vì đổi
trạng thái một chạm — một chạm sẽ tạo đơn thiếu phòng vật lý và thiếu CCCD.

**Vì sao phải qua API, không được ghi store**: `changeStatus()` chỉ ghi
`localStorage`. Badge đổi ngay nhưng **F5 quay lại trạng thái cũ**, máy lễ tân
khác không thấy gì. Trạng thái đơn là dữ liệu tranh chấp được với khách — phải
sống ở DB cùng `ActivityLog`.

**Trạng thái được thu tiền**: `pending_payment` · `confirmed` · **`checked_in`**.
Thiếu `checked_in` thì khách trả nốt tại quầy bị từ chối `422`, mà check-out lại
đòi thu đủ ⇒ **đơn kẹt vĩnh viễn**.

---

### M5 · Hoàn tiền 🟡

| API | Method | HĐ | v | BE sửa | FE dùng | BE | FE | ⚠ | FE gọi ở đâu | Ghi chú |
|---|:--:|:--:|:-:|---|---|:--:|:--:|:-:|---|---|
| `/api/bookings/[id]/refund` | POST | ✅ | v1 | 08/08 (`900-01`) | — | ✅ | 🔴 | — | **chưa nối** | **`900-01` đã vá.** Migration `20260103000000` mở rộng `chk_logs_action` 9→10 giá trị. **Đã gọi thật**: `200`, `paid_amount` giảm đúng, 1 dòng log `refund-processed` + 1 dòng `payments` `kind='refund'`. 4 case khoá (1 happy, 3 negative) |
| `/api/bookings/[id]/cancel/quote` | GET | ✅ | v1 | 08/08 (`400-01`) | — | ✅ | 🔴 | — | **chưa nối** | `CancelQuoteResponse` khớp 7 trường. **Đã gọi thật**: đơn nhận phòng sau 413 ngày → `refundPercent=100`, `refundAmount` = đúng số đã cọc |

**Cần cho**: nút huỷ phải **hiện rõ mất bao nhiêu tiền trước khi bấm** (§F4).
Hiện tại con số đó chưa lấy từ server.

**Vì sao mở rộng CHECK constraint thay vì đổi giá trị RPC ghi** (`900-01`,
08/08/2026): `/refund` từng ✅ dựa trên đọc code, `400-01` gọi thật thì **500 mọi
lần** — `23514 new row for relation "activity_logs" violates check constraint
"chk_logs_action"`. RPC `refund_booking_payment()` ghi `action='refund-processed'`
nhưng constraint chỉ nhận 9 giá trị:

```
created · status-changed · payment-recorded · checked-in · checked-out
note-added · room-assigned · price-adjusted · cancelled
```

Hai hướng sửa đều làm route hết 500. Chọn **mở rộng constraint** (migration mới
`20260103000000`, luật BE7) chứ không cho RPC ghi đè sang `payment-recorded`, vì
`ActivityLog` là bằng chứng khi tranh chấp với khách (§B1): gộp tiền thu và tiền
hoàn vào chung một mã thì nhật ký **mất chiều tiền** — đúng thứ nó sinh ra để
phân giải. Chi phí chênh lệch chỉ là một giá trị trong `LogAction`.

`LogAction` ở `packages/core/src/booking-types.ts` đã thêm `refund-processed`
cùng thay đổi này — SQL là nguồn sự thật, TS bám theo (BE8).

**Đã rà cả 6 RPC, không chỉ `/refund`** (rủi ro #2 của ticket): đọc
`pg_get_functiondef()` trên DB thật rồi tách literal ở đúng vị trí cột `action`
của mọi `INSERT INTO activity_logs`. 8/8 vị trí hợp lệ — `create_booking_atomic`
`created` · `check_in_booking` `room-assigned`+`status-changed` ·
`confirm_booking_payment` `payment-recorded`+`status-changed` ·
`check_out_booking` `status-changed` · `cancel_booking` `status-changed` ·
`refund_booking_payment` `refund-processed`. 3 chỗ ghi log bằng TS
(2 cron + webhook) đều ghi `status-changed`. `/refund` là chỗ duy nhất vi phạm.

Tin tốt của bug cũ: transaction rollback nguyên vẹn, `paid_amount` **không** bị
trừ sai lần nào.

> 🔴 **Nợ mới `M39` — test khuyến mãi rò dữ liệu, làm 3 case đỏ ngẫu nhiên**
> (phát hiện 08/08/2026 khi chạy `pnpm test:api` nhiều lần để verify `900-01`).
>
> **Tái hiện được**: chạy riêng `pnpm vitest run tests/api/availability.test.ts`
> → 2 failed / 10 passed dù không ai sửa file đó; chạy lại thì **tập case đỏ đổi
> khác**, có lần lan sang `bookings.test.ts` (`expected 384000 to be 600000`).
>
> **Nguyên nhân**: `availability.test.ts` tạo KM `zz-test-*` với `active=true`,
> `code=NULL` mà teardown **không dọn**. KM không có `code` là KM **tự động áp**
> ⇒ trừ thêm tiền vào báo giá của mọi case sau, kể cả file test khác.
> `withAutoPromotionsDisabled()` cố ý bỏ qua id `zz-test-` nên không chặn được.
> Không `DELETE` được vì `23503 booking_promotions_promotion_id_fkey`.
>
> **Có từ trước `900-01`**, không do ticket đó. **Cách sửa đúng**: teardown
> `UPDATE promotions SET active=false WHERE id LIKE 'zz-test-%'` (tắt, không
> xoá). Cần `ndh-sa` quyết ticket riêng hay gộp `M36`.
>
> ⚠️ Đây là lý do các con số test trong tài liệu này phải đọc kèm điều kiện *"đã
> dọn KM rác trước khi chạy"* — nếu không, một suite xanh thật vẫn có thể đỏ.

---

### M6 · Phòng vật lý

| API | Method | BE | FE | FE gọi ở đâu | Ghi chú |
|---|:--:|:--:|:--:|---|---|
| `/api/room-units` | GET | ✅ | ✅ | `booking.store.ts` (kèm `fetchBookingsFromApi`) | 120 phòng, id **UUID** |

**Vì sao phải có**: `buildRoomUnits()` của seed sinh id `phong-gia-dinh-01-01`,
DB dùng UUID. Dropdown chọn phòng đọc seed nên gửi id DB không hiểu ⇒
`22P02 invalid input syntax for type uuid` ⇒ **check-in không bao giờ thành công
qua giao diện**, dù backend hoàn toàn đúng.

---

### M7 · Khuyến mãi

| API | Method | BE | FE | FE gọi ở đâu | Ghi chú |
|---|:--:|:--:|:--:|---|---|
| `/api/promotions` | GET | ✅ | ✅ | `stores/promotion.store.ts` | Chỉ đọc; CRUD còn ở store. **Đã gọi thật**: trả 7 KM, đúng thứ tự `priority` tăng dần |

🔴 **Nợ nặng phát hiện ở `400-01` — `M36`: điều kiện khuyến mãi đang bị mất sạch.**

`mapPromotionRow()` (`src/lib/db/mappers.ts:178-189`) đọc 13 cột như
`row.min_nights`, `row.stay_window`, `row.lead_time_days`, `row.room_type_ids`…
nhưng bảng `promotions` **chỉ có một cột `conditions jsonb`**, và hàm **không đọc
cột đó**. Đối chiếu `information_schema`: **0/13 cột tồn tại**.

Đo trực tiếp qua `POST /api/availability` rồi đọc `promotion.evaluations` — đơn
**1 đêm**, đặt trước 281 ngày:

```
EVAL early-bird-30      eligible=false  reason=superseded-by-exclusive  cond={}
EVAL last-minute        eligible=false  reason=superseded-by-exclusive  cond={}
EVAL long-stay          eligible=false  reason=superseded-by-exclusive  cond={}
EVAL fourth-night-free  eligible=TRUE                                   cond={}
```

`fourth-night-free` đáng lẽ cần `minNights: 4` **và** đêm ở trong
`2026-09-01..2026-11-30` — nhưng `conditions` rỗng nên nó **đủ điều kiện trên đơn
1 đêm**, và vì `stackable=false` nó **loại nốt 3 KM còn lại**.

Nghĩa là khuyến mãi **không chạy theo bất kỳ quy tắc nào admin đặt**: cái sai
điều kiện được áp, cái đúng điều kiện bị loại. **Sai tiền trên mọi đơn.**

Chưa mở ticket: `390-02` sẽ viết lại chính hàm map này ⇒ `ndh-sa` quyết gộp vào
đó hay tách `900-04`, tránh làm trùng.

---

### M8 · Quản trị & Nội dung

| API | Method | HĐ | v | BE sửa | FE dùng | BE | FE | ⚠ | FE gọi ở đâu | Ghi chú |
|---|:--:|:--:|:-:|---|---|:--:|:--:|:-:|---|---|
| `/api/admin/accounts` | GET | ✅ | v1 | 08/08 (`900-02`) | — | ✅ | ✅ | — | `hooks/useAdminData.ts:125` | **Lỗ `900-02` ĐÃ VÁ.** Bọc `withAuthGuard(..., 'account.manage')` ⇒ chỉ `owner`. **Đã gọi thật**: không cookie → `401 UNAUTHENTICATED` (`data: null`, thân response không còn chuỗi `@namduhill.demo`); `editor`/`receptionist`/`manager`/`customer` → `403 FORBIDDEN`; `owner` → `200` danh sách như cũ |
| `/api/admin/upload` | POST | 🟡 | v1 | 08/08 (`400-01`) | — | ✅ | ✅ | — | `components/ImageUploadField.tsx:90` | **Đã gọi thật**: PNG 600×400 → `201`, đổi sang WebP, tên file làm sạch dấu tiếng Việt. SVG → `400 UNSUPPORTED_TYPE`; 16MB → `400 FILE_TOO_LARGE`; không token → `401`; `customer` → `403` |

✅ **`/api/admin/accounts` nâng 🔴 → ✅ ngày 08/08/2026 — lỗ bảo mật `900-02` đã
vá và có test hồi quy khoá lại.**

**Lỗ cũ (giữ lại để người sau không "sửa" ngược về bản cũ):** route khai
`export async function GET()` **trần** và dùng `createAdminClient()` (service
role, bỏ qua RLS) ⇒ **cả ba lớp phòng thủ của `backend.md` đều vắng mặt cùng
lúc**: middleware không phủ `/api/**`, không có `requirePermission()`, RLS bị vô
hiệu. Gọi không cookie trả `200` + 46 tài khoản kèm email, SĐT, vai trò.

**Cách vá:** `withAuthGuard(handler, 'account.manage')`. Chọn `account.manage`
chứ không phải một quyền đọc chung: §B8 chỉ cấp quyền này cho `owner`.
`manager` cố ý **không** có — đây là câu hỏi bỏ ngỏ ở mục 6 của ticket, chốt là
**không**, vì bản đồ tài khoản quản trị kèm vai trò là đầu vào trực tiếp cho
việc dò mật khẩu nên phải hẹp hơn quyền vận hành.

Bằng chứng đo được sau khi vá (`tests/api/admin.test.ts`, 6 case):

```
GET /api/admin/accounts  (KHÔNG cookie)          → 401 UNAUTHENTICATED, data: null
GET /api/admin/accounts  (editor)                → 403 FORBIDDEN
GET /api/admin/accounts  (receptionist)          → 403 FORBIDDEN
GET /api/admin/accounts  (manager)               → 403 FORBIDDEN
GET /api/admin/accounts  (customer)              → 403 FORBIDDEN
GET /api/admin/accounts  (owner)                 → 200, danh sách như cũ
```

Case `401` assert thêm rằng thân response **không còn chứa chuỗi
`@namduhill.demo`** — kiểm mã lỗi thôi là chưa đủ, một route trả `401` mà vẫn
kèm `data` thì lỗ vẫn nguyên.

Cột `FE` giữ ✅ xuyên suốt: màn `/admin/settings/accounts` **đã** bọc
`RequirePermission anyOf={['account.manage']}` — FE làm đúng phần của mình, lỗ
nằm hoàn toàn ở server. Vá **không làm hỏng FE**: `fetch` cùng origin vẫn gửi
cookie mặc định (`same-origin`), đã kiểm.

⚠️ **Giới hạn upload**: ghi vào `public/uploads/`. Filesystem Vercel là
ephemeral ⇒ **ảnh mất sau mỗi lần deploy**. Đổi hàm `persist()` sang Supabase
Storage trước khi lên production. Hợp đồng API không đổi nên FE không phải sửa.

---

### M9 · Danh mục (hạng phòng · gói giá · dịch vụ · ngân hàng) 🟡

| API cần viết | Method | HĐ | v | BE sửa | FE dùng | BE | FE | ⚠ | Màn đang chờ | Quyền |
|---|:--:|:--:|:-:|---|---|:--:|:--:|:-:|---|---|
| `/api/admin/room-types` | GET,POST | ✅ | v1 | 08/08 (`390-01`) | — | ✅ | 🔴 | — | `/admin/settings/rooms` | GET `price.view` · POST `price.edit` |
| `/api/admin/room-types/[id]` | PATCH,DELETE | ✅ | v1 | 08/08 (`390-01`) | — | ✅ | 🔴 | — | `/admin/settings/rooms` | `price.edit` |
| `/api/admin/rate-plans` | GET,POST | ✅ | v1 | 08/08 (`390-01`) | — | ✅ | 🔴 | — | `/admin/settings/rate-plans` | GET `price.view` · POST `price.edit` |
| `/api/admin/rate-plans/[id]` | PATCH,DELETE | ✅ | v1 | 08/08 (`390-01`) | — | ✅ | 🔴 | — | `/admin/settings/rate-plans` | `price.edit` |
| `/api/admin/addons` | GET,POST | ✅ | v1 | 08/08 (`390-01`) | — | ✅ | 🔴 | — | `/admin/settings/addons` | `content.edit` |
| `/api/admin/addons/[id]` | PATCH,DELETE | ✅ | v1 | 08/08 (`390-01`) | — | ✅ | 🔴 | — | `/admin/settings/addons` | `content.edit` |
| `/api/admin/settings/bank` | GET,PATCH | ✅ | v1 | 08/08 (`390-01`) | — | ✅ | 🔴 | — | `/admin/settings/general` | `settings.bank` (**chỉ `owner`**) |

**Bằng chứng cột BE ✅** (luật A3 — không ghi ✅ vì build xanh):
`tests/api/admin-catalog.test.ts` — **33/33 PASS, chạy 2 lần liên tiếp đều xanh**
(lần 2 không cần `sweepOrphans` ⇒ teardown sạch). 15 case negative. Mỗi khẳng
định "đã ghi" đều **đọc lại từ SERVER** qua `adminDb()`, không tin response của
chính lệnh ghi:

| Bằng chứng | Case |
|---|---|
| Tạo → GET thấy, `basePrice` là `number` (không phải chuỗi `numeric` của PostgREST) | [1] |
| 401 `UNAUTHENTICATED` khi không cookie — **phân biệt** với 403 | [2] [19] |
| **Lễ tân POST/PATCH giá → 403** (§B8), nhưng GET vẫn được (`price.view`) | [3] [4] [18] |
| **`editor` tạo được addon** bằng `content.edit`; **lễ tân 403** ở addon | [24] [25] |
| Thiếu `{vi,en}` → 400 kèm đúng tên ô (`fields[]`) | [5] [26] |
| Giá âm · `guests=0` · `basePrice` là chuỗi · slug CHỮ HOA → 400 (**không phải 500**) | [6] [7] [8] [9] |
| Trùng slug → 409 `DUPLICATE_ID` | [10] |
| **Soft delete**: hàng **CÒN trong DB**, `active=false`; `includeInactive=true` thấy lại | [14] [23] [27] |
| **409 `ROOM_TYPE_IN_USE` kèm `activeBookingCount = 1`** — đọc được ở FE (nợ `M32` đã trả) | [15] |
| Đơn `checked_out` **KHÔNG** chặn soft delete (ngưỡng SA chốt) | [16] |
| `REFUND_RULES_CONFLICT` cả ở POST lẫn PATCH (kiểm **sau khi trộn** với hàng hiện tại) | [20] [21] |
| **`manager` đọc bank → 403** (`settings.bank` chỉ `owner`) | [30] |
| PATCH bank là sửa **một phần** — đổi tên chủ TK không xoá mất số TK | [31] |
| Số TK có ký tự lạ → 400 **và không ghi gì vào DB** | [32] |

`pnpm test:api` toàn bộ: **136/136 PASS, 8/8 file** — 85 case cũ không vỡ.

**Hiện trạng FE (vẫn 🔴)**: bốn màn này **vẫn** đọc/ghi `catalog.store` có
`persist(localStorage)` — `390-01` chỉ làm BE. Di trú FE là việc của `390-02`.

**Hậu quả vẫn còn nguyên cho tới khi `390-02` xong**: hạng phòng tạo trong CMS
**chỉ tồn tại trên máy vừa dùng**. Đổi máy hoặc xoá cache là mất. Trang khách
cũng không thấy. **Không xoá `catalog.store` trước khi `390-02` xuất dữ liệu
hiện có** — xoá sớm là xoá dữ liệu chủ resort đã nhập.

**Kiểu id — đã đối chiếu `information_schema` ngày 08/08/2026**: `room_types.id`,
`rate_plans.id`, `addons.id` đều là **`text` slug** (`^[a-z0-9][a-z0-9-]{1,62}$`,
CHECK `chk_*_id_slug`), **KHÔNG phải UUID**. Chỉ `bookings.id`, `room_units.id`,
`accounts.id` mới là UUID. Gửi nhầm chiều nào cũng ra `22P02`.

**DELETE là soft delete** (`active = false`): `bookings.room_type_id` và
`.rate_plan_id` là khoá ngoại. Xoá cứng hạng đang có đơn làm mất lịch sử đơn —
thứ tranh chấp được với khách. Hạng còn đơn chưa đóng → **409** kèm
`activeBookingCount` để admin biết còn bao nhiêu đơn phải xử lý.

✅ **Nợ schema `M30` ĐÃ TRẢ ở `390-01`** — `property_settings.bank` nay tồn tại.
Migration `supabase/migrations/20260104000000_add_property_settings_bank.sql`
(`ADD COLUMN bank jsonb NOT NULL DEFAULT '{}'::jsonb`) đã **áp lên DB và xác minh
lại bằng `information_schema.columns`**: `bank | jsonb | NOT NULL | '{}'::jsonb`.
Hàng `nam-du-hill` sẵn có được DEFAULT lấp đầy ⇒ không cần backfill. Đã đăng ký
vào `supabase_migrations.schema_migrations` (`20260104000000`).

**RLS (BE3)**: 4 bảng `room_types`/`rate_plans`/`addons`/`property_settings` đều
đã bật RLS (`relrowsecurity = true`) và đã có policy đọc từ
`20260101000200_rls_policies.sql`. Thêm một **cột** không tạo bề mặt mới cần
policy mới — policy áp ở mức hàng. Có chủ ý **không** thêm policy ghi: mọi lệnh
ghi đi qua Route Handler dùng service role, **sau** `requirePermission()`; thêm
policy INSERT/UPDATE cho `authenticated` sẽ mở một đường ghi thứ hai **không qua
kiểm quyền của app**.

🔴 **Nợ mới `M40` phát hiện ở `390-01`** — `activity_logs` **không ghi được** vết
đổi cấu hình ngân hàng, dù hợp đồng yêu cầu (BE5). Lý do đo được:
`activity_logs.booking_id` là `uuid NOT NULL` + FK `REFERENCES bookings(id)` —
bảng đó gắn cứng vào **một đơn hàng**, mà đổi cấu hình cơ sở không thuộc đơn nào
⇒ **không có hàng hợp lệ nào để chèn**. Chèn bừa một `booking_id` là làm bẩn
nhật ký đơn của khách, tệ hơn hẳn thiếu vết. Fallback đang dùng: `console.info`
có đủ actor + giá trị cũ/mới, số TK che 4 số cuối. Hướng sửa đúng: bảng
`audit_logs` cấp hệ thống, **hoặc** nới `booking_id` nullable + thêm
`entity`/`entity_id`. Cả hai là thay đổi schema **ngoài phạm vi `390-01`**.

🔴 **Nợ `M41` — ĐÃ ĐO, không phải suy đoán**. Policy
`property_settings_public_read` là `USING (true)` cho `{anon, authenticated}`,
và cột `bank` nay nằm trong bảng đó. Gọi thẳng PostgREST bằng **anon key**:

```
GET /rest/v1/property_settings?select=id,bank   (apikey = NEXT_PUBLIC_..._ANON_KEY)
→ HTTP 200  [{"id":"nam-du-hill","bank":{}}]
```

Tức là `bank` **đọc được không cần đăng nhập**, trong khi route
`GET /api/admin/settings/bank` đòi `settings.bank` (chỉ `owner`). Hai đường vào
cùng một dữ liệu với hai mức quyền khác hẳn nhau — lớp kiểm quyền của app bị đi
vòng qua.

**Chưa rò gì lúc này** vì giá trị đang là `{}`; nó thành rò **đúng lúc chủ cơ sở
nhập số tài khoản thật** — nghĩa là sẽ không ai nhận ra ở thời điểm gây hại.

Policy kế thừa từ `20260101000200`, **không do `390-01` tạo ra**, nhưng cột mới
làm nó thành vấn đề thật. Hướng sửa: `GRANT`/policy theo cột cho `anon`, **hoặc**
tách `bank` sang bảng riêng chỉ service role đọc. Ngoài phạm vi `390-01` —
`ndh-sa` quyết ticket nào nhận.

---

### M10 · Tự động & Webhook 🟡

| API | Method | HĐ | v | BE sửa | FE dùng | BE | FE | ⚠ | Ghi chú |
|---|:--:|:--:|:-:|---|---|:--:|:--:|:-:|---|
| `/api/cron/release-holds` | GET,POST | `—` | — | 08/08 (`390-06`) | — | 🟡 | — | ⚠ | Thân hàm ✅ (`900-03` + **`M42` nhả tồn kho, `390-06`**). **Vẫn 🟡**: chưa có log Vercel chứng minh lịch `*/5` tự chạy — không truy cập được dashboard (`M43`) |
| `/api/cron/no-show` | GET,POST | `—` | — | 08/08 (`390-06`) | — | 🟡 | — | ⚠ | Như trên. Thân hàm ✅, thiếu bằng chứng lịch tự chạy (`M43`) |
| `/api/webhooks/payment` | POST | `—` | — | 08/08 (`900-03`) | — | 🟡 | — | ⚠ | Envelope đã đúng BE1 (`fail()`/`ok()`). Đã sửa 3 bug schema thân hàm: `payments.payment_method`→`method`, bỏ `payments.status` (dùng `kind`), `activity_logs.details`→`old_data`/`new_data` + `actor_role 'system'`→`'owner'`. **Vẫn 🟡**: `PAYMENT_WEBHOOK_SECRET` chưa cấu hình (nợ `M4`) ⇒ chưa chạy được đường thành công đầu-cuối |

Cột `HĐ` là `—`: cron và webhook **FE không gọi**, nên không khai hợp đồng
(ticket `380-01` §3 loại trừ rõ hai nhóm này).

**Vì sao hai cron từng 500 mọi lần, và vì sao lỗi này sống lâu** (`900-03`):
tên cột trong `supabase-js` đi qua **chuỗi**, nên `pnpm typecheck` không thấy gì
và build luôn xanh. Route dùng `check_in_date`, `check_out_date`, `room_unit_id`,
`cancel_reason` — đối chiếu `information_schema.columns` thì **không cột nào tồn
tại**; cột thật là `check_in`, `check_out`, `assigned_room_unit_id`, và lý do huỷ
nằm ở `cancellation` (jsonb) + `cancelled_at`. `vercel.json` vẫn gọi
`release-holds` mỗi 5 phút ⇒ trên production nó fail im lặng, đơn quá hạn không
bao giờ được nhả và hệ thống báo **hết phòng giả** trong khi phòng còn trống.

**Vì sao `hold_expires_at = NULL` phải đi CÙNG lệnh đổi status**: ràng buộc
`chk_bookings_hold CHECK (hold_expires_at IS NULL OR status = 'pending_payment')`
sẽ ném lỗi nếu để nguyên khi rời trạng thái đó — cùng loại bẫy với bug cột, chỉ
nổ lúc chạy.

**Vì sao `actor_role` của tác nhân hệ thống là `'owner'`, không phải `'system'`**:
`chk_logs_role` chỉ nhận 5 vai trò. Webhook ghi `'system'` nên dòng `activity_logs`
bị **từ chối im lặng** (route không đọc lỗi của lệnh insert). Nay cả 2 cron và
webhook đều dùng `'owner'` + `actor_id` là `SYSTEM_CRON` / `SYSTEM_WEBHOOK`, và
lỗi insert được ghi log thay vì nuốt (C3).

⚠️ **Đính chính bản 07–08/08**: bảng cũ ghi *"Chưa khai trong `vercel.json`"*.
**Sai.** `apps/2026-thenamduhill/vercel.json` có sẵn khối `crons` với đủ hai mục
(commit `c848a07`). Đã đọc lại file ngày 08/08/2026.

#### `390-06` — cron CÓ chạy, nhưng **làm thiếu một nửa việc** (`M42`)

Ticket giả định "cron chưa chạy". Đo trên DB dev ngày 08/08/2026 cho kết quả
**ngược lại**: `activity_logs` có **96 dòng** `actor_id = 'SYSTEM_CRON'`
(`pending_payment → expired`), mới nhất `2026-08-08 15:35:33+00`. Cron **đang
chạy thật**.

Nhưng triệu chứng ticket mô tả — *"báo hết phòng trong khi còn trống"* — **vẫn
đúng**, chỉ khác nguyên nhân:

| Bước | Ai làm | Có chạy? |
|---|---|:--:|
| Tạo đơn → `booked_units += 1` | `create_booking_atomic()` bước ⑩ | ✅ |
| Huỷ đơn → `booked_units -= 1` | RPC `cancel_booking` (dòng 299-306) | ✅ |
| Cron nhả đơn quá hạn → `booked_units -= 1` | **không ai** | ❌ |

Hai cron chỉ `UPDATE bookings SET status`, **không đụng `inventory`**. Đơn chết
nhưng phòng bị giữ vĩnh viễn.

**Số đo trên DB dev (tái hiện được bằng SQL bên dưới):**

- **20 đêm** có `available = 0` trong khi **không còn đơn sống nào** — hết phòng giả
- **82 đêm** lệch giữa `booked_units` và số đơn thật đang giữ
- ví dụ `ĐH-2026-0120`: đã `expired`, nhưng 2 đêm của nó vẫn `booked 6/6`

```sql
-- Đêm "hết phòng giả": available = 0 mà không có đơn nào đang giữ
SELECT count(*) FROM inventory i
WHERE (i.total_units - i.booked_units - i.blocked_units) <= 0
  AND (SELECT count(*) FROM bookings b
       WHERE b.room_type_id = i.room_type_id
         AND b.status IN ('pending_payment','confirmed','checked_in')
         AND i.date >= b.check_in AND i.date < b.check_out) = 0;
```

**Đã sửa** (`390-06`): cả hai cron trừ `booked_units` cho từng đêm sau khi lệnh
`UPDATE bookings` khớp đúng 1 hàng. Đặt sau lệnh đó là **có chủ ý** — lệnh mang
`.eq('status', …)` nên chạy cron hai lần không trừ chồng (idempotent).

⚠️ **Dữ liệu lệch sẵn trên DB dev chưa được nắn lại** — cần một migration
đối soát `booked_units` theo đơn thật. Ghi nợ `M42b`, ngoài phạm vi `390-06`.

**Cảnh báo cho người viết test sau — mutation test của `900-03` chưa đủ chặt.**
`900-03` ghi rằng gỡ guard trạng thái thì test đỏ. Đo lại ở `390-06`: **sai**.

| Mutation | Kết quả |
|---|---|
| Gỡ `.eq('status','pending_payment')` ở **UPDATE** | 🟢 vẫn xanh |
| Gỡ `.eq('status','pending_payment')` ở **SELECT** | 🟢 vẫn xanh |
| Gỡ **thêm** `.lt('hold_expires_at', now)` | 🔴 đỏ |

Lý do: đơn `confirmed` buộc có `hold_expires_at = NULL` (`chk_bookings_hold`),
nên **riêng bộ lọc thời gian** đã loại nó — guard trạng thái là lớp thứ hai,
không phải lớp bắt lỗi. Ai định gỡ hai guard đó vì "thừa" thì đừng: chúng là
phòng thủ chiều sâu cho trường hợp `hold_expires_at` bị ghi sai.

Hai case `M42` mới **đã mutation-test**: gỡ khối nhả tồn kho ⇒ đúng case tương
ứng đỏ với `expected [1,1] to deeply equal [0,0]`.

**Vì sao vẫn 🟡 chứ không ✅** (luật A3): thân hàm đã chứng minh đúng bằng 14
case xanh, nhưng **chưa có log Vercel** chứng minh lịch `*/5` tự kích hoạt.
Không đăng nhập được dashboard/CLI (`vercel whoami` treo ở bước login, không có
`VERCEL_TOKEN`, repo không có thư mục `.vercel`). Nếu dự án đang gói **Hobby**
thì cron bị ép về **1 lần/ngày** và `*/5` im lặng không chạy — ghi nợ `M43`,
cần chủ dự án xác nhận gói.

🔴 **Cập nhật 08/08/2026 — câu hỏi "cron có chạy không" nay thành thứ yếu.**
`400-01` gọi thật hai route bằng Bearer đúng: **cả hai trả `500`**.

```
POST /api/cron/release-holds  Bearer demo_cron_secret_2026
→ 500 { code: 'DB_ERROR', message: 'column bookings.check_in_date does not exist' }
```

Route truy vấn `check_in_date` và `room_unit_id`; cột thật là **`check_in`** và
**`assigned_room_unit_id`** (đối chiếu `information_schema.columns`). Nghĩa là
**dù Vercel có gọi đúng lịch, cron vẫn không làm được gì** — nó fail ở câu
`SELECT` đầu tiên, mỗi 5 phút, im lặng trong log.

Hậu quả đã thành hiện thực, không còn là giả định:
- đơn quá hạn giữ chỗ **không bao giờ** được nhả ⇒ **hết phòng giả**, mất doanh thu
- đơn khách không đến **không bao giờ** thành `no_show` ⇒ sai báo cáo, sai hoàn cọc

Xác thực Bearer thì **vẫn đúng** — không token/sai token đều `401`, đã kiểm.

---

### M11 · Tra cứu công khai 🟡 *(BE xong `390-03`, chờ FE `390-04`)*

| API cần viết | Method | HĐ | v | BE sửa | FE dùng | BE | FE | ⚠ | Màn đang chờ | Quyền |
|---|:--:|:--:|:-:|---|---|:--:|:--:|:-:|---|---|
| `/api/bookings/lookup` | GET | ✅ | v1 | 08/08 (`390-03`) | — | ✅ | 🔴 | — | `/lookup` | `public` — **không cần đăng nhập** |

**Lỗi tái hiện được (ĐÃ SỬA ở `390-03`)**: `/lookup` gọi
`GET /api/bookings?code=&phone=` (`src/app/lookup/page.tsx:44`), route đó bọc
`withAuthGuard` nên trả **`401`** cho khách chưa đăng nhập. Đã đo bằng `curl`
không cookie. Lỗi **có từ trước**, không do đợt sửa nào gần đây.

`app-flows.md §F4` yêu cầu tra cứu **không cần đăng nhập** — rất hay dùng khi
người này đặt hộ người khác.

**Đã làm**: route công khai riêng `src/app/api/bookings/lookup/route.ts`,
**KHÔNG** bọc `withAuthGuard`, bắt buộc đủ **cả hai** `code` + `phone`, trả
đúng một đơn trong `{ booking }`.

**Cột `FE` vẫn 🔴 có chủ ý**: `src/app/lookup/page.tsx:44` **vẫn đang gọi route
cũ** `/api/bookings` và vẫn nhận `401`. Route mới đã sẵn sàng nhưng chưa màn
nào gọi ⇒ với người dùng cuối, tính năng **chưa chạy**. `390-04` [FE] đổi lời
gọi rồi mới hạ được ô này.

#### Bằng chứng ghi ✅ cho cột BE (luật A3)

**① Hai nhánh 404 trả CÙNG body — đo trực tiếp, không suy từ code:**

```
A  code có thật + SAI phone   → 404 {"success":false,"data":null,"error":{"code":"LOOKUP_FAILED",
                                    "message":{"vi":"Không tìm thấy đơn khớp mã và SĐT đã nhập.",
                                               "en":"No booking matches the code and phone number entered."}}}
B  code KHÔNG tồn tại         → 404 (chuỗi JSON GIỐNG HỆT A, so bằng `===`)
```

Test `bookings-lookup.test.ts` so `JSON.stringify(body)` của hai nhánh, không
chỉ so `error.code` — khác nhau ở `message.vi` cũng đủ để phân biệt từ ngoài.

**② Response thật, không rò dữ liệu** (gọi bằng đơn thật `ĐH-2026-0044`):
`guest` chỉ có `fullName` · `phoneMasked: "097****029"` · `emailMasked:
"b***@gmail.com"`. **Không có** `guest_id_number` · `customer_id` ·
`guest_tax_code` · `check_in_record` · `check_out_record` · `activity_logs`.
Test quét trên **chuỗi JSON thô** chứ không assert từng field đã biết tên — cách
đó mới bắt được cột mới ai đó thêm vào bảng sau này (đúng loại lỗi của `M33`).

**③ 14 case / 9 negative xanh**, `pnpm test:api` **136/136 xanh, 8/8 file**
(85 case cũ nguyên vẹn; phần tăng còn lại từ ticket khác chạy cùng đợt).

⚠️ Lần chạy đầu đỏ **5 case / 3 file** — đã truy nguyên là **nợ `M39`** (6 KM
`zz-test-*` mồ côi còn `active=true` của hai lần chạy trước), **không phải** do
`390-03`: xoá rác rồi chạy lại xanh toàn bộ mà không đụng dòng code nào.

**Hai điều hợp đồng `LookupBookingRequest/Response` đã khoá lại**:

1. **Sai `phone`** và **`code` không tồn tại** trả **CÙNG MỘT** mã `LOOKUP_FAILED`
   với **cùng một thông báo**. Tách hai trường hợp là lộ mã đơn nào có thật ⇒ dò
   được cả dải mã. Đây là lý do `LookupBookingError` không có mã `WRONG_PHONE`.
2. Kiểu trả về là `PublicBookingDto` **riêng**, không dùng lại `Booking` của
   `booking-types.ts`. Dùng lại thì sớm muộn cũng có người `select('*')` rồi rò
   CCCD / email / ghi chú nội bộ ra internet. Email và SĐT đều **che bớt**
   (`emailMasked`, `phoneMasked`).

**Không dùng RLS**: policy SELECT của `bookings` là
`customer_id = current_account_id()`; khách chưa đăng nhập không có id ⇒ luôn
nhận `[]`. Route này lọc ở **tầng ứng dụng** bằng cặp `code` + `phone`, dùng
`createAdminClient()` (service role, bỏ qua RLS) — có ghi comment lý do ngay
trong file route.

#### Vì sao rate limit phải nằm ở Postgres, không phải trong RAM

`src/lib/api/rate-limit.ts` (đang dùng cho `/api/availability/search`) giữ
`Map<ip, …>` **trong RAM tiến trình** và tự ghi chú *"Multi-instance deployments
do not share this in-memory state"*. Trên Vercel mỗi lời gọi có thể rơi vào một
lambda khác, mỗi lambda một `Map` rỗng ⇒ ngưỡng gần như không bao giờ chạm tới.

Với `/availability/search` thì đó là phiền toái (dò được cũng chỉ ra giá phòng
công khai). Với `/bookings/lookup` — route công khai **duy nhất** chạm dữ liệu
đơn — đó là **cửa dò số điện thoại khách hàng**, nên `390-03` dựng store dùng
chung:

| | |
|---|---|
| Migration | `supabase/migrations/20260104000100_api_rate_limits.sql` |
| Bảng | `api_rate_limits(key, count, window_ends_at)` · RLS **bật, KHÔNG policy** ⇒ `anon`/`authenticated` không đọc được (bảng lưu IP khách) |
| Đếm | RPC `consume_rate_limit()` — **một** câu `INSERT … ON CONFLICT DO UPDATE`, nguyên tử |
| Helper | `src/lib/api/shared-rate-limit.ts` |
| Ngưỡng | **10 lượt / 5 phút / IP** — chặt hơn hẳn 60/60s của `/availability` |

**Vì sao Postgres chứ không Redis/Upstash**: Postgres đã có sẵn, đã có pool,
backup, đã nằm trong hợp đồng vận hành. Thêm Redis là thêm một nhà cung cấp,
một secret, một thứ có thể chết lúc 2 giờ sáng — cho một bộ đếm vài chục dòng.
Chi phí: một round-trip (~5ms cùng vùng). Đổi sang Redis sau này chỉ cần viết
lại **thân** `consumeSharedRateLimit()`; chữ ký không đổi nên route không sửa
dòng nào.

**Vì sao "SELECT rồi UPDATE" từ Node không dùng được**: hai round-trip và có
khe hở — hai request đến cùng lúc cùng đọc `count = 59`, cùng ghi `60`, cả hai
đều lọt. `ON CONFLICT DO UPDATE` khoá hàng trong lúc cập nhật nên ra `60` và
`61`, đúng một cái bị chặn. Cùng họ lý do với `SELECT FOR UPDATE` của
`create_booking_atomic`.

**Fail-open có chủ ý**: DB lỗi thì cho request đi tiếp thay vì trả `429` — bộ
đếm hỏng không được biến thành sự cố mất dịch vụ cho khách thật. Chấp nhận được
vì đây là lớp phòng thủ **thứ hai**; lớp thứ nhất (bắt buộc đủ `code` + `phone`,
404 không phân biệt) vẫn đứng nguyên khi bộ đếm chết. Lỗi vẫn ghi log (C3).

---

### M12 · Outbox tích hợp kênh bán 🔴 *(mới ở v1.0.1)*

| API cần viết | Method | HĐ | v | BE sửa | FE dùng | BE | FE | ⚠ | Màn đang chờ | Quyền |
|---|:--:|:--:|:-:|---|---|:--:|:--:|:-:|---|---|
| `/api/admin/outbox` | GET | 🟡 | v1 | 08/08 (`380-01`) | — | 🔴 | 🔴 | — | `/admin/system/outbox` *(chưa dựng)* | `report.view` |
| `/api/admin/outbox/[id]/retry` | POST | 🟡 | v1 | 08/08 (`380-01`) | — | 🔴 | 🔴 | — | như trên | `settings.bank` ⚠️ tạm |

**Vì sao cần màn này**: sự kiện `inventory.changed` gửi hỏng mà không ai biết thì
**OTA vẫn bán phòng đã bán** — đúng loại lỗi không sửa được bằng lời xin lỗi.
Đây là chỗ người vận hành nhìn thấy sự cố và bấm gửi lại.

⚠️ **Cần `ndh-sa` quyết ở `380-02`**: chưa có permission nào đúng nghĩa "vận hành
tích hợp". Hợp đồng tạm mượn `settings.bank` (cũng chỉ `owner` có). Phương án
sạch hơn là thêm `integration.manage` vào `permissions.ts` — nhưng đó là sửa type
ở `packages/core`, phải xin SA duyệt.

`OutboxStatus` ∈ `pending | sending | sent | failed | dead` sẽ thành **CHECK
constraint** ở migration `420-01`. Đổi ở TS mà quên đổi migration = `23514` lúc
chạy, build vẫn xanh.

---

### M13 · Quét giấy tờ tuỳ thân 🔴 *(mới ở v1.0.1)*

| API cần viết | Method | HĐ | v | BE sửa | FE dùng | BE | FE | ⚠ | Màn đang chờ | Quyền |
|---|:--:|:--:|:-:|---|---|:--:|:--:|:-:|---|---|
| `/api/admin/scan-id` | POST | 🟡 | v1 | 08/08 (`380-01`) | — | 🔴 | 🔴 | — | form nhận phòng (`440-04`) | `booking.change-status` |

**Hai điều hợp đồng đã khoá lại**:

1. **Scanner lỗi KHÔNG chặn lễ tân nhập tay.** Khách đang đứng ở quầy. Vì vậy
   `SCANNER_UNAVAILABLE` là **503** và FE **không** hiện lỗi đỏ — chuyển sang
   nhập tay im lặng. `ScanIdResult.empty` có mặt đúng để FE phân biệt "đọc xong
   nhưng không ra gì" với "hỏng".
2. **Không lưu ảnh giấy tờ** — không Storage, không DB, không log. Ảnh chỉ sống
   trong bộ nhớ suốt vòng đời request. Đây là dữ liệu định danh cá nhân.

`confidence` là **từng field**, không phải một số chung. Field không đọc được thì
**không có mặt** trong `fields` — không trả chuỗi rỗng, vì chuỗi rỗng sẽ ghi đè
giá trị lễ tân vừa gõ tay.

---

### M14 · Làm mới cache trang tĩnh 🔴 *(mới ở v1.0.1)*

| API cần viết | Method | HĐ | v | BE sửa | FE dùng | BE | FE | ⚠ | Màn đang chờ | Quyền |
|---|:--:|:--:|:-:|---|---|:--:|:--:|:-:|---|---|
| `/api/revalidate` | POST | 🟡 | v1 | 08/08 (`380-01`) | — | 🔴 | 🔴 | — | mọi màn CMS sửa nội dung (`410-03`) | `content.edit` |

**Vì sao cần**: trang phòng dùng ISR. Admin sửa giá gốc mà không revalidate thì
trang khách **vẫn hiện giá cũ** cho tới khi hết hạn cache — nhìn hệt như CMS
không hoạt động. Đây là triệu chứng rất dễ bị chẩn đoán nhầm thành "API lỗi".

---

### 2.9 · Rà soát kiểm quyền toàn bộ route *(08/08/2026, `900-02`)*

Ticket `900-02` chỉ nói về `/admin/accounts`, nhưng một route thiếu guard hầu
như không bao giờ đứng một mình — nên đã chạy lệnh tự kiểm ở `backend.md` trên
**cả 21 route** và **đối chiếu từng file**, không suy đoán theo tên:

```bash
grep -rLn "requirePermission\|requireAuth\|withAuthGuard" $(find src/app/api -name route.ts)
```

Sau khi vá, 8 file còn trong kết quả — **tất cả đều được miễn hợp lệ**:

| Route | Vì sao KHÔNG cần `withAuthGuard` |
|---|---|
| `/api/auth/login` POST | Đường cấp phiên. Bắt buộc gọi được khi **chưa** có phiên — bọc guard là khoá luôn lối vào. Tự bảo vệ bằng bcrypt + rate limit |
| `/api/auth/logout` POST | Chỉ xoá cookie phiên. Gọi khi chưa đăng nhập là no-op vô hại, không đọc/ghi dữ liệu |
| `/api/availability` POST | **Công khai có chủ ý** — khách chưa đăng nhập phải tra được phòng trống (§F2 bước 1). Dùng `createClient()` (anon key, **RLS còn hiệu lực**), không phải service role |
| `/api/availability/search` POST | Như trên, cùng lý do và cùng dùng anon key |
| `/api/promotions` GET | Công khai — khách cần thấy KM khi đặt phòng. ⚠️ Xem nợ mới bên dưới |
| `/api/cron/no-show` POST·GET | Xác thực **riêng**: `verifyCronAuth()` so `CRON_SECRET` bằng `crypto.timingSafeEqual` trên digest SHA-256 (BE12), hoặc header `x-vercel-cron`. Không có phiên người dùng để mà kiểm |
| `/api/cron/release-holds` POST·GET | Như trên |
| `/api/webhooks/payment` POST | Xác thực bằng **HMAC-SHA256** trên body thô + `timingSafeEqual` (BE12). Cổng thanh toán không có cookie |

**Kết luận: `/admin/accounts` là lỗ DUY NHẤT**, đúng như rủi ro 1 của ticket dự
đoán. Ghi lại đây để người sau không phải rà lại từ đầu.

**Nợ mới phát hiện khi rà (ngoài phạm vi `900-02`, không tự ý sửa):**

> **`M38` — `GET /api/promotions` trả `select('*')` toàn bộ bảng cho người gọi
> ẩn danh.** Route công khai là đúng, nhưng nó **không lọc `active`** và trả mọi
> cột, nên KM đang tắt / hết hạn / chưa tới ngày chạy — kể cả mã giảm giá nội bộ
> và `usage_limit` — đều lộ ra ngoài. Tái hiện: `GET /api/promotions` không
> cookie → `200` + đủ hàng của bảng `promotions`.
>
> Đây là **rò rỉ dữ liệu, không phải lỗ chiếm quyền**, và **có từ trước** `900-02`.
> Ảnh hưởng thực tế: khách đọc được mã KM chưa công bố rồi dùng sớm.
>
> **Cách sửa đúng**: giữ route công khai nhưng thêm `.eq('active', true)`, lọc
> theo khoảng ngày hiệu lực, và chỉ trả các cột khách cần hiển thị — không
> `select('*')`. Cần `ndh-sa` quyết có mở ticket riêng hay gộp vào `M36` (đang
> sửa chính hàm `mapPromotionRow` của module này).

---

## 3. Bẫy đã gặp — đọc trước khi sửa backend

Bốn lỗi dưới đều **build xanh, typecheck sạch**, chỉ nổ lúc chạy thật.

| Bẫy | Triệu chứng | Cách tránh |
|---|---|---|
| Migration chưa chạy | `PGRST202 Could not find the function …` | So `list_migrations` với `supabase/migrations/` sau mỗi lần pull |
| Tên cột lệch schema | `42703 column … does not exist` | Đọc `information_schema.columns` **trước khi** viết RPC |
| Giá trị lệch CHECK constraint | `23514 violates check constraint` | `method` ∈ `bank-transfer\|card\|at-property\|momo` (**gạch ngang**)<br>`kind` ∈ `deposit\|balance\|refund\|surcharge`<br>`action` ∈ 10 giá trị của `chk_logs_action` (xem ngay dưới) — `900-01` chết vì thiếu đúng một giá trị |
| TS không kiểm được ràng buộc trong DB | Union TS khai `bank_transfer`, DB nhận `bank-transfer` | SQL là nguồn sự thật; lệch thì **sửa TS** (luật BE8) |

### `chk_logs_action` — 10 giá trị hợp lệ

Ghi `action` ngoài danh sách này là `23514`, và vì nó nằm **trong** transaction
của RPC nên cả lời gọi rollback ⇒ route trả `500`, không phải lỗi 4xx đọc được.

```
created · status-changed · payment-recorded · checked-in · checked-out
note-added · room-assigned · price-adjusted · cancelled · refund-processed
```

`refund-processed` thêm ở migration `20260103000000` (`900-01`). Thêm giá trị
mới thì phải sửa **cả ba chỗ** cùng lúc: CHECK constraint · `LogAction` trong
`packages/core/src/booking-types.ts` · chỗ RPC/route ghi log.

### Tên cột dễ nhầm

| Viết sai | Đúng |
|---|---|
| `payments.payment_method` | `payments.method` |
| `payments.actor_id/name/role` | **không tồn tại** — actor ghi ở `activity_logs` |
| `bookings.cancellation_reason` | `bookings.cancellation` (jsonb) |
| `activity_logs.from_value/to_value` | `activity_logs."from"` / `"to"` (từ khoá SQL, phải trích dẫn) |
| `room_units.name` | `room_units.code` |
| `bookings.remaining_amount` | có thật, nullable — **không** tên `balance_due` |
| `room_types.long`/`long2` | `room_types.long_desc` / `long_desc_2` |
| `property_settings.bank` | **chưa tồn tại** — xem nợ schema ở M9 |

### Kiểu id — không phải cái nào cũng UUID

Đọc `information_schema.columns` DB sống ngày 08/08/2026:

| Bảng | Kiểu `id` | Ràng buộc |
|---|---|---|
| `room_types` · `rate_plans` · `addons` · `promotions` · `seasons` | **`text` slug** | `^[a-z0-9][a-z0-9-]{1,62}$` (`chk_*_id_slug`) |
| `bookings` · `room_units` · `accounts` · `payments` · `activity_logs` | **`uuid`** | `gen_random_uuid()` |

Danh mục dùng slug do người đặt, đơn hàng và phòng vật lý dùng UUID do DB sinh.
Gửi nhầm chiều nào cũng ra `22P02 invalid input syntax for type uuid`.

### Migration trong DB lệch tên file trong repo

`supabase_migrations.schema_migrations` (DB sống) so với `supabase/migrations/`:

| Trong DB | Trong repo |
|---|---|
| `20260808072627_fn_create_booking_atomic` | `20260102000000_fn_create_booking_atomic.sql` |
| `20260808091905_fn_booking_lifecycle_rpcs` | `20260102000100_fn_booking_lifecycle_rpcs.sql` |
| `20260808092418_fix_lifecycle_rpcs_column_names` | ❌ **không có file nào** |

Hai file RPC được áp dưới timestamp khác tên file, và có **một migration chỉ tồn
tại trên DB** — bản sửa tên cột RPC áp thẳng qua MCP, chưa hồi lại repo.

**Hậu quả**: dựng lại DB từ `supabase/migrations/` sẽ ra schema **thiếu bản sửa
tên cột** ⇒ RPC vòng đời đơn hỏng bằng `42703`, mà `pnpm build` vẫn xanh. Cần
`ndh-sa` quyết ở `380-02`: kết xuất `20260808092418` thành file trong repo, hay
gộp vào một migration hợp nhất.

---

## 4. Kiểm chứng — bằng chứng cho cột trạng thái

| Bộ test | Tầng | Phủ gì | Kết quả |
|---|:--:|---|---|
| `tests/api/auth.test.ts` | 2 | M1 — 4 route auth, phân biệt 401/403 | **14/14 pass** |
| `tests/api/availability.test.ts` | 2 | M2 — tính giá từng đêm, `priceOverride`, Season, RatePlan, KM nhân dồn | **12/12 pass** |
| `tests/api/bookings.test.ts` | 2 | M3 — tạo/đọc đơn, chống overbooking (kể cả 2 request đồng thời) | **13/13 pass** |
| `tests/api/booking-lifecycle.test.ts` | 2 | M4, M5 — 6 route vòng đời, đồ thị §B1 không nhảy cóc | **14/14 pass** |
| `tests/api/admin.test.ts` | 2 | M8 — accounts, upload | **9/9 pass** |
| `tests/api/misc-routes.test.ts` | 2 | M6, M7, M10 — room-units, promotions, 2 cron, webhook | **20/20 pass** |
| `e2e/booking-lifecycle.spec.ts` | 4 | M3, M4, M6 — vòng đời đơn đầy đủ, nhánh huỷ, 3 negative test | **7/7 pass** |
| `e2e/admin-room-types.spec.ts` | 4 | M9 (tầng store) — CRUD, validation, phân quyền | **16/16 pass** |

```bash
cd apps/2026-thenamduhill
pnpm test:api      # tầng 2 — 76 case, 53 negative, phủ 21/21 route
npx playwright test e2e/booking-lifecycle.spec.ts e2e/admin-room-types.spec.ts
```

**Tầng 2 chạy 3 lần liên tiếp đều xanh** (76/76 × 3) — điều kiện AC-12 của
`400-01`. Mỗi test tự dọn dữ liệu mình tạo; `globalSetup` quét rác của lần chạy
bị ngắt giữa chừng. Đã xác nhận sau 3 lần: **0 bản ghi `zz-test%` còn sót**, và
148 đơn + 46 tài khoản seed sẵn **không bị đụng**.

⚠️ **Giới hạn phải biết**: tầng 2 dùng service role ⇒ **bỏ qua RLS**. Cách ly
khách A/khách B hiện được kiểm ở **tầng ứng dụng**, còn bản thân policy RLS thì
**chưa ai kiểm** — việc đó thuộc `400-02`/pgTAP, đang chặn bởi `M24b` (không có
Docker, cũng không có branching). Ghi rõ ở đây để không ai đọc "76/76 pass" rồi
tưởng RLS đã an toàn.

Mọi assertion về trạng thái đơn **đọc lại từ server**, không nhìn badge — vì đúng
bug M4 sẽ khiến một bộ test chỉ nhìn badge xanh hoàn toàn. Cả hai bộ đã kiểm bằng
cách **cố tình gieo lại bug cũ**: test fail đúng chỗ, rồi khôi phục code.

---

## 5. Lệnh tự kiểm — chạy trước khi sửa bảng trên

```bash
cd apps/2026-thenamduhill

# 1. Endpoint nào THẬT SỰ tồn tại + method của nó
for f in $(find src/app/api -name route.ts); do
  ep=$(echo $f | sed 's|src/app||;s|/route.ts||')
  v=$(grep -oE "export (const|async function) (GET|POST|PATCH|PUT|DELETE)" $f \
      | grep -oE "GET|POST|PATCH|PUT|DELETE" | sort -u | tr '\n' ',')
  echo "$v $ep"
done | sort -k2

# 2. FE gọi endpoint nào, từ file nào (không nằm đây = đang dùng store)
grep -rn "fetch(['\`]/api" src --include="*.ts" --include="*.tsx" | grep -v "src/app/api/"

# 3. Migration đã áp đủ chưa (so với supabase/migrations/)
#    Dùng MCP Supabase: list_migrations
```

Ba lệnh này là **nguồn sự thật**. Bảng lệch với chúng thì sửa bảng, không sửa lệnh.

---

## 6. Nhật ký thay đổi

| Ngày | Thay đổi |
|---|---|
| 08/08/2026 | **`390-03` — THÊM route công khai `GET /api/bookings/lookup` (M11).** Route mới, **KHÔNG** bọc `withAuthGuard` — đó chính là bug đang sửa. Đọc `information_schema.columns` của `bookings` TRƯỚC khi viết (bẫy #2 của §3): cột thật là `check_in`/`check_out` (không phải `check_in_date`), `remaining_amount` (không phải `balance_due`), `cancellation` jsonb. **Điều quan trọng nhất — hai nhánh 404 trả CÙNG body**: "mã có thật + sai SĐT" và "mã không tồn tại" cùng dùng MỘT hằng `LOOKUP_FAILED_MESSAGE`, đo trực tiếp bằng cách gọi hai nhánh rồi so `JSON.stringify(body)` — `true`. Tách hai câu là lộ mã đơn nào có thật ⇒ người dò quét dải mã bằng SĐT rác rồi mới tấn công vào SĐT. **Map tường minh từng field** qua `toPublicBooking()` (danh sách trắng), **không** `return ok(row)` — đây đúng lỗi của nợ `M33` ở `/cancel`+`/refund` (RPC `RETURNS public.bookings` ⇒ rò cả 38 cột), mà ở route công khai thì không cần đăng nhập gì cả. Response thật kiểm chứng: `guest` chỉ còn `fullName` + `phoneMasked: "097****029"` + `emailMasked: "b***@gmail.com"`, **không có** `guest_id_number`/`customer_id`/`guest_tax_code`/`check_in_record`. **Rate limit dựng lại từ đầu**: `checkRateLimit()` cũ giữ `Map` trong RAM tiến trình, trên Vercel mỗi lambda một `Map` rỗng ⇒ gần như không bao giờ chạm ngưỡng. Thay bằng migration `20260104000100_api_rate_limits.sql` — bảng `api_rate_limits` (RLS bật, **KHÔNG policy** vì bảng lưu IP khách) + RPC `consume_rate_limit()` dùng **một** câu `INSERT … ON CONFLICT DO UPDATE` (nguyên tử; "SELECT rồi UPDATE" từ Node có khe hở: hai request cùng đọc `59`, cùng ghi `60`, cả hai đều lọt). Ngưỡng **10 lượt/5 phút/IP**, chặt hơn hẳn 60/60s của `/availability/search` vì ở đây mỗi lượt là một phép thử trên dữ liệu khách thật. Chọn Postgres thay Redis: đã có sẵn pool/backup/hợp đồng vận hành, đổi sang Redis sau chỉ cần viết lại thân `consumeSharedRateLimit()`. **Fail-open có chủ ý** khi DB lỗi — bộ đếm hỏng không được biến thành sự cố mất dịch vụ, lớp phòng thủ thứ nhất (bắt buộc đủ `code`+`phone`) vẫn đứng. Chuẩn hoá SĐT hai vế (`+84`/`0084`/`84` ↔ `0`, bỏ khoảng trắng và gạch) vì DB lưu đúng chuỗi khách gõ lúc đặt. **14 case / 9 negative**, gồm: thiếu `code` → 400 · thiếu `phone` → 400 · thiếu cả hai → 400 · hai nhánh 404 cùng body · vượt ngưỡng → 429 kèm `retryAfterSeconds` · IP khác không bị chặn lây · quét **chuỗi JSON thô** tìm CCCD/email/`customer_id` (assert từng field đã biết tên thì không bắt được cột mới ai đó thêm sau này). `BE ✅` 20→21. Test API: **136/136 xanh, 8/8 file** (85 case cũ nguyên vẹn; phần tăng còn lại từ ticket khác cùng đợt). Lần chạy đầu đỏ **5 case / 3 file** — đã truy nguyên là **nợ `M39`** (6 KM `zz-test-*` mồ côi còn `active=true` của **hai** lần chạy trước, gồm `p10`/`p20`/`capped`), **không phải** do `390-03`: xoá rác rồi chạy lại xanh toàn bộ mà không đụng một dòng code nào. Đã ghi bằng chứng tái hiện lần 2 vào `M39` của `MANUAL.md` kèm khuyến nghị nâng ưu tiên — đây là lần thứ hai một ticket khác nhau phải dừng điều tra cùng một triệu chứng. **Nợ mới `M40`**: bảng `api_rate_limits` chưa có ai gọi `purge_expired_rate_limits()` định kỳ (không chặn gì, chỉ tốn dung lượng) — cố ý giao `390-06` sau khi cron được xác minh chạy thật, để không trộn hai biến số. ⚠️ **Cột `FE` giữ 🔴**: `src/app/lookup/page.tsx:44` vẫn gọi `/api/bookings` cũ ⇒ với khách chưa đăng nhập tính năng **vẫn hỏng**; `390-04` [FE] mới đóng được (luật A2). |
| 08/08/2026 | **`900-01` — VÁ `/refund` 500 mọi lần.** Nguyên nhân đo trực tiếp trên DB thật (không đoán từ code): `chk_logs_action` chỉ nhận **9** giá trị — `created`, `status-changed`, `payment-recorded`, `checked-in`, `checked-out`, `note-added`, `room-assigned`, `price-adjusted`, `cancelled` — trong khi `refund_booking_payment()` ghi `refund-processed` ⇒ `23514` ⇒ rollback cả RPC ⇒ route trả `500`. Thử insert từng giá trị vào `activity_logs`: 9 giá trị trên ACCEPT, `refund-processed`/`refunded`/`payment-refunded` đều REJECT. **Chọn hướng A** — migration MỚI `20260103000000_add_refund_processed_log_action.sql` mở rộng constraint 9→10 (BE7, không sửa file đã chạy) — thay vì cho RPC ghi `payment-recorded`, vì gộp hai chiều tiền vào một mã làm `ActivityLog` mất giá trị làm bằng chứng tranh chấp (§B1). `LogAction` trong `booking-types.ts` thêm `refund-processed` cho khớp SQL (BE8). **Rà cả 6 RPC** bằng `pg_get_functiondef()` + tách literal ở đúng cột `action`: 8/8 vị trí hợp lệ, `/refund` là chỗ duy nhất vi phạm; 3 chỗ ghi log bằng TS (2 cron + webhook) đều `status-changed`. Migration còn dọn 10 dòng `actor_id='PROBE'` do lần dò constraint để lại — `activity_logs` bất biến (BE5), không có GRANT DELETE nên phải dọn trong migration. **Đảo test khoá hiện trạng** sang happy path (`200`, `paid_amount` giảm đúng, **đúng 1** dòng log `refund-processed` với `from`/`to` đúng, 1 dòng `payments` `kind='refund'`) + thêm 1 negative (`/refund` đơn chưa thu tiền → `400 EXCEEDS_PAID_AMOUNT`, không tác dụng phụ). `BE ✅` 17→18, M5 hết lỗi BE. Test API: **85/85 xanh** (79 case cũ nguyên vẹn; phần tăng còn lại từ ticket khác cùng đợt). `M11` (`/lookup` 401) lên thế chỗ ưu tiên 3. **Nợ mới `M39`**: `availability.test.ts` rò KM `zz-test-*` (`active=true`, `code=NULL` ⇒ tự động áp) làm 2–3 case đỏ **ngẫu nhiên** ở `availability`/`bookings`; có từ trước, không do `900-01` — xem khối nợ ở M5. |
| 08/08/2026 | **`900-02` — VÁ LỖ BẢO MẬT `GET /api/admin/accounts`.** Route khai `export async function GET()` trần + `createAdminClient()` (service role ⇒ bỏ qua RLS) nên gọi **không cookie** trả `200` + 46 tài khoản kèm email, SĐT, vai trò. Vá bằng `withAuthGuard(..., 'account.manage')` — §B8 chỉ cấp quyền này cho `owner`; **chốt `manager` KHÔNG được xem** (câu hỏi bỏ ngỏ ở mục 6 của ticket). **Đảo 2 test khoá hiện trạng** sang kỳ vọng đúng và thêm 3 case ⇒ 6 case cho route này, 5 negative: không cookie → `401 UNAUTHENTICATED` (assert thêm `data: null` và thân response không còn chuỗi `@namduhill.demo` — kiểm mã lỗi thôi là chưa đủ), `editor`/`receptionist`/`manager`/`customer` → `403 FORBIDDEN`, `owner` → `200`. **Đã rà kiểm quyền toàn bộ 21 route** (§2.9): 8 route còn thiếu guard đều miễn hợp lệ (2 auth · 2 availability dùng anon key nên RLS còn hiệu lực · promotions công khai · 2 cron `timingSafeEqual` trên `CRON_SECRET` · webhook HMAC-SHA256) ⇒ `/admin/accounts` là lỗ **duy nhất**. **Nợ mới `M38`**: `/api/promotions` `select('*')` không lọc `active` ⇒ lộ KM chưa công bố + `usage_limit` cho người ẩn danh (có từ trước, cần SA quyết ticket). `BE ✅` 16→17, M8 hết lỗi. Test API: **76 → 79 case, xanh toàn bộ**. |
| 08/08/2026 | **`900-03` — VÁ 2 CRON HỎNG 100% + đưa 3 route về hợp đồng BE1.** Đọc `information_schema.columns` của `bookings` TRƯỚC khi sửa (bẫy #2 của §3): 38 cột thật, **không có** `check_in_date`/`check_out_date`/`room_unit_id`/`cancel_reason` — cột đúng là `check_in`, `check_out`, `assigned_room_unit_id`, và lý do huỷ nằm ở `cancellation` (jsonb) + `cancelled_at`. Ticket chỉ nêu 2 tên sai; quét toàn bộ `src/app/api/**` + `supabase/migrations/**` tìm ra **7 chỗ** thuộc 4 nhóm cột. Ngoài 2 cron còn **3 bug schema trong webhook**: `payments.payment_method`→`method`, `payments.status` (không tồn tại)→`kind`, `activity_logs.details` (không tồn tại)→`old_data`/`new_data`; cộng `actor_role:'system'` vi phạm `chk_logs_role` ⇒ dòng log **bị từ chối im lặng** vì route không đọc lỗi insert. `p_payment_method`/`p_room_unit_id` trong RPC là **tham số**, không phải cột — không sửa. Thêm `hold_expires_at: null` cùng lệnh đổi status để không vướng `chk_bookings_hold`. **3 route** (`/cron/release-holds`, `/cron/no-show`, `/webhooks/payment`) chuyển sang `fail()`/`ok()` ⇒ `error.message` nay là `{vi,en}` và `error` là object có `code` ⇒ **`LEGACY_SHAPE_ROUTES` nay RỖNG**, mọi route bị wrapper kiểm ngặt. Test: đảo 2 case khoá hiện trạng, thêm 6 case — happy 200 cho cả 2 cron, `pending_payment` quá hạn → `expired` (đọc lại từ DB), `confirmed` quá ngày → `no_show`, chạy 2 lần không xử lý trùng, và **2 case negative "đơn `confirmed` không bị nhả"**. Hai case negative đã **kiểm bằng mutation test**: gỡ guard trạng thái + bộ lọc `hold_expires_at` thì test ĐỎ (`expected 'expired' to be 'confirmed'`) — bản test đầu tiên xanh cả khi gỡ guard nên đã viết lại thành kịch bản đua thật (khách trả tiền ở giây chót). `BE ✅` 18→20, M10 hết lỗi cron. Test API: **79 → 85 case, xanh toàn bộ**. Webhook giữ 🟡 vì `PAYMENT_WEBHOOK_SECRET` chưa cấu hình (`M4`/`M35`), không phải vì code sai. |
| 08/08/2026 | **`400-01` — dựng tầng 2 (Vitest API integration), gọi THẬT cả 21 route.** 76 case / 53 negative, chạy 3 lần liên tiếp đều xanh. **Bốn route bị hạ trạng thái vì chạy thử mới lộ**: `/refund` ✅→🔴 (`500`, RPC ghi `action` ngoài `chk_logs_action` — `900-01`) · `/admin/accounts` ✅→🔴 (**không có kiểm quyền, ai cũng đọc được 46 tài khoản** — `900-02`) · 2 cron 🟡→🔴 (`500`, truy vấn cột `check_in_date` không tồn tại — `900-03`). **Nợ mới**: `M35` (thiếu `CRON_SECRET`/`PAYMENT_WEBHOOK_SECRET`), `M36` (**`mapPromotionRow()` đọc 13 cột không tồn tại ⇒ mọi điều kiện KM bị mất, sai tiền mọi đơn**), `M37` (tầng 2 không kiểm được RLS), `M24b` (cả Docker lẫn branching đều không dùng được). Sắp lại "Ba việc chặn nặng nhất". `BE ✅` 19→16. Bổ sung bằng chứng test cho M1/M2/M3/M4/M6/M7/M8. |
| 08/08/2026 | **`380-01` — khai hợp đồng API `packages/core/src/api-contracts.ts`** cho 14 API (M2, M4, M5, M8, M9, M11, M12, M13, M14). Thêm cột `HĐ`/`v`/`BE sửa`/`FE dùng`/`⚠` vào 7 bảng module. Mở 3 module mới M12 (outbox), M13 (quét giấy tờ), M14 (revalidate). **Đính chính M10**: bản trước ghi *"chưa khai trong `vercel.json`"* — SAI, khối `crons` có sẵn đủ 2 mục; hạ BE xuống 🟡 vì chưa có log chứng minh chạy thật. **Phát hiện nợ schema**: `property_settings.bank` chưa tồn tại dù `booking-types.ts:512` khai `BankConfig` map vào đó ⇒ chặn `390-01`. **Phát hiện lệch migration**: `20260808092418_fix_lifecycle_rpcs_column_names` chỉ có trên DB, không có file trong repo. Sửa `§0` — tổng API 22→31, `BE ✅` 22→19. |
| 08/08/2026 | **Tổ chức lại theo module + tách 2 cột BE/FE.** Nối API vòng đời đơn (M4). Thêm `GET /api/room-units` (M6), `POST /api/admin/upload` (M8). Áp 2 migration còn thiếu, sửa tên cột RPC theo schema thật. Cho phép thu tiền khi `checked_in`. Phát hiện M2 (FE tự tính giá), M11 (`/lookup` 401), M9 (danh mục chưa có API). Sửa lại toàn bộ cột trạng thái — bản trước ghi ✅ cho những màn chưa nối. |
| 08/08/2026 | **`390-06` — cron CÓ chạy, nhưng làm THIẾU MỘT NỬA VIỆC (`M42`).** Ticket giả định "cron chưa bao giờ tự chạy"; đo trên DB dev cho kết quả **ngược lại**: `activity_logs` có **96 dòng** `actor_id='SYSTEM_CRON'` (`pending_payment→expired`), mới nhất `08/08 15:35:33+00`. Nhưng triệu chứng "hết phòng giả" **vẫn đúng**, khác nguyên nhân: `create_booking_atomic()` cộng `booked_units += 1`, RPC `cancel_booking` trừ lại, còn **hai cron chỉ `UPDATE bookings SET status` và KHÔNG đụng `inventory`** ⇒ đơn chết nhưng phòng bị giữ vĩnh viễn. Số đo: **20 đêm `available=0` mà không còn đơn sống nào**, **82 đêm** lệch `booked_units`; ví dụ `ĐH-2026-0120` đã `expired` nhưng 2 đêm vẫn `booked 6/6`. Đã sửa cả 2 cron: trừ `booked_units` từng đêm, đặt **sau** lệnh `UPDATE ... .eq('status', …)` khớp 1 hàng nên chạy lại không trừ chồng. **Đính chính `900-03`**: bản đó ghi mutation test đã chứng minh guard trạng thái; đo lại thì gỡ `.eq('status')` ở **cả SELECT lẫn UPDATE** test **vẫn xanh** — phải gỡ thêm `.lt('hold_expires_at')` mới đỏ, vì đơn `confirmed` luôn có `hold_expires_at=NULL` (`chk_bookings_hold`) nên bộ lọc thời gian mới là lớp chặn thật. Hai case `M42` mới đã mutation-test đúng chuẩn (gỡ khối nhả tồn kho ⇒ `expected [1,1] to deeply equal [0,0]`). Thêm 4 case (tồn kho ×2, ActivityLog `actor_role` hợp `chk_logs_role`, một đơn hỏng không chặn cả lô) ⇒ nhóm cron **14 case, 8 negative**. **M10 hạ ✅→🟡** theo luật A3: thân hàm đúng nhưng **không có log Vercel** chứng minh lịch `*/5` tự kích hoạt — `vercel whoami` treo ở bước đăng nhập, không có `VERCEL_TOKEN`, repo không có `.vercel/` ⇒ **không xác định được gói**; nếu là **Hobby** thì cron bị ép 1 lần/ngày và `*/5` im lặng không chạy (nợ `M43`). Nợ thêm `M42b` (dữ liệu `booked_units` lệch sẵn cần migration đối soát). Test API: **136/136 assertion xanh**; `availability.test.ts` đỏ ở tầng file do **nợ `M39` có sẵn** (teardown xoá `promotions` trước `booking_promotions` ⇒ `23503`), không liên quan cron. |
| 07/08/2026 | Bản đầu tiên |
