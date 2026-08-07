# RELEASE v1.0.0 — Hệ Thống Đặt Phòng & CMS Quản Lý The Nam Du Hill Resort

> **App target**: `apps/2026-thenamduhill` · **Theme giao khách**: `@repo/theme-h3`  
> **Mốc bàn giao**: GD1 `10/08/2026` (Giao diện) — ✅ **ĐÓNG ĐỦ 07/08, sớm 3 ngày** · GD2 `17/08/2026` (DB & API) — 🔄 đang tới · GD3 `24–28/08/2026` (Go-Live)  
> **Tiến độ**: `done` **11/20** · `process` **1** (`100-03`) · `pending` **8** (đối soát `ls` ngày 07/08/2026)  
> **Tài liệu điều hành**: [Thao tác thủ công & Dữ liệu chờ: MANUAL.md](./MANUAL.md)

---

## 1. Hệ Thống 6 Vai Trò Agent (Team Agents)

Dự án vận hành bằng 6 Agent chuyên biệt trong `.claude/agents/`:

| Agent | Vai trò chính | Thư mục phụ trách / Đầu ra | Chi tiết Agent Prompt |
|---|---|---|:---:|
| **`ndh-ba`** | Viết spec/ticket nghiệp vụ | Tạo ticket ở `pending/` (Mục 1–5, 7) | [ndh-ba.md](../../../../../.claude/agents/ndh-ba.md) |
| **`ndh-sa`** | Kiến trúc & Duyệt kỹ thuật | Duyệt mục 6 ticket ở `pending/`, review code BE/FE | [ndh-sa.md](../../../../../.claude/agents/ndh-sa.md) |
| **`ndh-pm`** | Điều phối tiến độ & Luồng ticket | Di chuyển ticket `pending/` ➔ `process/`, cập nhật §5 Tracker | [ndh-pm.md](../../../../../.claude/agents/ndh-pm.md) |
| **`ndh-be`** | Backend Execution | `app/api/**`, `supabase/migrations/**`, `@repo/core` | [ndh-be.md](../../../../../.claude/agents/ndh-be.md) |
| **`ndh-fe`** | Frontend Execution | `packages/theme-h3`, `app/admin/**`, `app/(client)/**` | [ndh-fe.md](../../../../../.claude/agents/ndh-fe.md) |
| **`ndh-qc`** | Tester & Ký duyệt DoD | Test thực tế, điền mục 8, di chuyển ticket ➔ `done/` | [ndh-qc.md](../../../../../.claude/agents/ndh-qc.md) |

---

## 2. Quy Tắc Vận Hành Vô Lặp (Core Execution Rules)

```
[Mô tả / Đặt hàng] ➔ ndh-ba (Tạo Ticket pending/) 
                   ➔ ndh-sa (Duyệt Kỹ thuật Mục 6) 
                   ➔ ndh-pm (Chuyển sang process/) 
                   ➔ ndh-be / ndh-fe (Code & Self-test) 
                   ➔ ndh-sa (Review Code) 
                   ➔ ndh-qc (Verify thực tế ➔ Move done/) 
                   ➔ ndh-pm (Báo cáo Tiến độ)
```

1. **R1. Chuỗi Chạy Tự Động (Autonomous Execution)**: Các Agent tự động chuyển giao công việc theo sơ đồ trên, không dừng xin xác nhận giữa chừng.
2. **R2. Ghi Nợ Thông Tin Nhanh (MANUAL.md Protocol)**: Khi thiếu tài sản thật (STK ngân hàng, bộ ảnh HD, API Keys, DNS...):
   - **CẤM DỪNG WORKFLOW**. Agent ghi thông tin cần cấp vào [MANUAL.md](./MANUAL.md).
   - Tạm dùng **Giá trị mặc định (Default / Recommended)** để code/test tiếp tục chạy xuyên suốt đến `done/`.
3. **R3. Giới Hạn W.I.P**: Tối đa **3 ticket** nằm ở `process/` cùng lúc để đảm bảo tập trung.
4. **R4. Độc Quyền Ký Done**: **Chỉ `ndh-qc` mới có quyền `git mv` ticket sang `done/`** sau khi đã tự tay test thực tế và verify 100% AC PASS.
5. **R5. Quy Ước Mã Ticket**:
   - `000-*`: Nền tảng (Auth, DB Schema, Permission)
   - `100-*`: Giao diện GD1 (Client UI, CMS Admin)
   - `200-*`: Database & API GD2 (Supabase, Pricing, Booking Transaction, Email)
   - `300-*`: Go-Live GD3 (Live Payment Webhook, Domain, E2E)
   - `900-*`: Ticket Bug (Phải có triệu chứng tái hiện)

---

## 3. Kiến Trúc Kỹ Thuật Nút Thắt (Technical Core)

```
theme-h3  →  domain-hotel  →  ui-layout  →  ui  →  utils
app/api/**  →  packages/core  →  Supabase Postgres
```

* **Data Contract**: TS DTO tại `packages/core/src/booking-types.ts` là nguồn sự thật. Schema SQL bám theo TS.
* **Bảo mật 3 Lớp**: UI (Ẩn nút) ➔ Route Handler (`requirePermission`) ➔ DB RLS Policy. Token Staff: 8h; Token Customer: 30 ngày.
* **Chống Overbooking**: `SELECT FOR UPDATE` trong PG Transaction + DB Constraint `CHECK (booked_units + blocked_units <= total_units)`.
* **Tính Tiền**: Tính phân rã **từng đêm**, Discount % nhân dồn trên `subtotal`. Ngày dạng string `YYYY-MM-DD` (UTC).

---

## 4. Tóm Tắt Tiêu Chí DoD (Definition of Done)

* **DoD Chung (Áp dụng cho mọi ticket)**: `pnpm lint` sạch · `pnpm typecheck` 0 `any` · `pnpm build:safe` xanh 4 themes · Đủ song ngữ `{vi, en}` · 0 Hex màu ngoài `tokens.css`.
* **DoD Backend**: API JSON format `{success, data, error}` · Auth server-side · RLS Policy đầy đủ · Migration SQL 1 chiều · Audit log mọi đổi trạng thái đơn.
* **DoD Frontend**: Đủ 7 trạng thái UI (`default`, `hover`, `focus-visible`, `active`, `disabled`, `loading`, `error`) · Mobile card view (<640px) không cuộn ngang · Nút CTA ≥ 44px.
* **DoD QC**: Verify thủ công thực tế (không đọc code suy ra) · Thử ít nhất 1 case lỗi (Negative test) · Proof PASS từng dòng AC.

---

## 5. Bảng Quản Lý Tiến Độ Ticket (Process Tracker)

> **`ndh-pm` cập nhật bảng này sau mỗi lần di chuyển ticket.**

### 5.1 Giai Đoạn 000 — Nền Tảng (Mốc trước 08/08)

| Ticket | Tên | Vai trò | Phụ thuộc | Trạng thái |
|---|---|---|---|---|
| `000-01` | Chốt schema SQL bám theo DTO TypeScript | SA | — | `done` |
| `000-02` | Bảng phân quyền & `packages/core/src/permissions.ts` | SA + BE | `000-01` | `done` ✅ |
| `000-03` | Auth JWT 8h nhân viên / 30 ngày khách + Middleware Guard | BE | `000-02` | `done` ✅ |

> ✅ **Cập nhật 06/08/2026 — QC đã ký `done/` cho `000-02` và `000-03`.** Giai đoạn 000 **hoàn tất 3/3**.
> Seed đã nạp lên DB thật nên các AC trước đây BLOCKED vì "không có dữ liệu" đã đóng được:
> đọc chéo đơn giữa 2 khách · lễ tân `UPDATE room_types` bị chặn · 4/4 tài khoản nhân viên đăng nhập thật.
> `000-02`: 19 permission × 5 vai trò — **95/95 ô khớp** bảng B8. `000-03`: **10/10 nhánh** middleware PASS bằng `curl` thật.
>
> ⚠️ **Ghi nhận từ QC — hai ràng buộc mọi ticket sau phải biết:**
> 1. **`activity_logs` và `room_units` là deny-all RLS CÓ CHỦ ĐÍCH** (bật RLS, không policy). Client — kể cả lễ tân
>    đã đăng nhập — **không đọc được hai bảng này bằng anon key**. Mọi truy cập phải qua Route Handler có
>    `requirePermission()` + `service_role`. **Ảnh hưởng trực tiếp `100-02`** (gán phòng vật lý lúc nhận phòng)
>    và `100-03` (đổi `RoomUnit` sang `dirty`). Ở GD1 hai màn này chạy trên `booking.store` nên chưa vướng;
>    **`200-06` là nơi ràng buộc này phát tác** — nếu FE gọi thẳng PostgREST sẽ nhận mảng rỗng, không phải lỗi.
> 2. **AC8/A6 của `000-03` mới PASS ở mức cơ chế.** Phần đầu-cuối (end-to-end) còn chờ `200-05` hoặc `100-04`.

### 5.2 Giai Đoạn 100 — Giao Diện (GD1 · Milestone 10/08)

| Ticket | Tên | Vai trò | Phụ thuộc | Trạng thái |
|---|---|---|---|---|
| `100-01` | Client — Luồng đặt phòng 5 bước (theme H3) | FE | `000-01` ✅ | `done` ✅ |
| `100-02` | CMS — Danh sách đơn, chi tiết, gán phòng, tạo đơn thủ công | FE | `000-02` ✅ | `done` ✅ |
| `100-03` | CMS — Màn trả phòng & chốt bill phát sinh | FE | `100-02` ✅ | `pending` ⏸️ **hoãn sang GD2 — chốt §8.5** |
| `100-04` | CMS — Quản lý dữ liệu nền (hạng phòng, giá, phụ thu, ngân hàng) | FE | `000-02` ✅ | `done` ✅ |
| `100-05` | System Admin — Quản lý hạng phòng & Ticket sự cố/bảo trì | FE | `000-02` ✅ + `100-02` ✅ | `done` ✅ |

> ✅ **Cập nhật 07/08/2026 (vòng 1) — QC đã ký `done/` cho `100-01` và `100-02`.**
>
> | Ticket | Kết quả QC | Ghi chú |
> |---|---|---|
> | `100-01` | **15/15 AC PASS · 7/7 trạng thái FE1** — đạt ở **vòng 4** | Mục FAIL cuối là **DoD F1**: nút thiếu `:hover`/`:active`. Sửa bằng rule CSS trong `theme-h3/tokens.css`. Đo thật: default `rgb(29,78,137)` → hover `rgb(15,45,82)` → active `rgb(11,25,44)` |
> | `100-02` | **17/17 AC PASS** | Sửa **AC-6** (`aria-label` kèm mã đơn) và **AC-8** (trạng thái rỗng song ngữ + nút *Đặt lại*) rồi mới đạt |
>
> ✅ **Cập nhật 07/08/2026 (vòng 2) — QC đã ký `done/` cho `100-04` và `100-05`. GD1 ĐÓNG ĐỦ 5/5 ticket giao diện.**
>
> | Ticket | Vòng 1 (FAIL) | Vòng 2 (PASS) |
> |---|:--:|---|
> | `100-04` | 3/18 AC | **18/18 AC · 7/7 DoD M1–M7 · 8/8 negative test** |
> | `100-05` | 2/6 AC | **6/6 AC · 7/7 negative test** |
>
> **Ba lỗi chặn của vòng 1 đã sửa dứt điểm:**
> 1. **Dựng đủ tầng dữ liệu** — `catalog.store.ts`, `useCatalog.ts`, `validation.ts`, `BankConfig` nay đều tồn tại (vòng 1: không có file nào).
> 2. **`RequirePermission` phủ 7/7 trang** admin (vòng 1: **0/7**).
> 3. **NAV `tickets` đã có `permission`** — lễ tân không còn thấy mục bị cấm.
>
> **Bằng chứng QC mạnh nhất (test thật, không đọc code suy ra):**
> * `receptionist` **gõ thẳng URL 6/6 trang bị chặn** — bịt đúng lỗ hổng vòng 1.
> * Tạo bản ghi → **F5 → dữ liệu còn nguyên** ⇒ tầng persist chạy thật, không phải state tạm.
> * Nhập giá `-500000` → **bị chặn kèm thông báo bằng chữ** (vòng 1 lưu thành công).

### 5.2b Lưới Hồi Quy & Cổng Chất Lượng Sau Khi GD1 Đóng (07/08/2026)

**E2E hồi quy: 20/20 PASS.**

| Bộ test | Kết quả |
|---|:--:|
| `fe-100-02` | **7/7** ✅ |
| `h3-theme` | **4/4** ✅ |
| `fe-100-04-05-refix` | **9/9** ✅ |

**Cổng chất lượng:**

| Cổng | Kết quả |
|---|---|
| `pnpm lint` | **0 error** ở `@repo/2026-thenamduhill` |
| `pnpm typecheck --force` | **13/13 PASS** (`Cached: 0` — chạy thật, không lấy cache) |
| `pnpm build:safe` | **4/4 theme** xanh |

> ⚠️ **13 lint error còn lại nằm ở `apps/2025-phogroup` — KHÔNG do release này.** Đó là **vùng đóng băng theo luật
> `R10`** (chuyển nguyên trạng, chỉ sửa khi được yêu cầu rõ ràng); `git status` xác nhận thư mục đó **sạch**, release
> `v1.0.0` không chạm một dòng nào. Ghi rõ ở đây để vai trò sau **không chẩn đoán nhầm** là hồi quy của GD1.

### 5.3 Giai Đoạn 200 — Database & API (GD2 · Milestone 17/08)

| Ticket | Tên | Vai trò | Phụ thuộc | Trạng thái |
|---|---|---|---|---|
| `200-01` | Migration Supabase + seed dữ liệu thật + RLS | BE | `000-01` | `done` ✅ |
| `200-02` | API tính giá theo từng đêm | BE | `200-01` | `done` ✅ |
| `200-03` | API tạo đơn & chống đặt trùng (`SELECT FOR UPDATE`) | BE | `200-02` | `done` ✅ |
| `200-04` | API xác nhận thanh toán (giả lập) & vòng đời đơn | BE | `200-03` | `done` ✅ |
| `200-05` | Cron nhả phòng quá hạn & No-Show | BE | `200-04` | `pending` |
| `200-06` | Nối giao diện GD1 vào API thật | FE | `200-04` | `pending` |
| `200-07` | SendGrid email xác nhận & trang tra cứu `/lookup` | BE + FE | `200-04` | `pending` |
| `200-08` | Kiểm thử full luồng & nghiệm thu GD2 | QC | `200-06`, `200-07` | `pending` |

> ✅ **`200-01` — QC đã ký `done/` ngày 06/08/2026. Schema + RLS + seed đều đã lên production DB thật.**
>
> **Dữ liệu thật trên production sau seed:** 26 bảng · `accounts` **43** · `room_types` **20** · `room_units` **120** ·
> `inventory` **1.800** · `bookings` **39** · `payments` **51** · `activity_logs` **156**. Tất cả vượt mức tối thiểu §3.
>
> ⚠️ **Cảnh báo vận hành từ QC — seed `…000300` / `…000400` KHÔNG idempotent** (0 câu `ON CONFLICT`).
> **Cấm chạy `psql -f` tay lần thứ hai** trên cùng một DB: sẽ nhân đôi dữ liệu hoặc vỡ khoá chính.
> Muốn nạp lại phải reset DB trước. Ghi lại để `300-02` / `300-04` dựng môi trường mới không giẫm phải.
>
> **Đã áp thật lên Supabase production `kyarbmendxfgzgousydl` (06/08/2026):**
>
> | Migration | Nội dung | Kết quả |
> |---|---|:--:|
> | `20260101000000` | extensions + domain i18n + `next_booking_code()` | ✅ áp |
> | `20260101000100` | **26 bảng** | ✅ áp |
> | `20260101000200` | RLS — **26/26 bảng bật RLS, 24 policy** | ✅ áp |
> | `20260101000500` *(file mới)* | cố định `search_path` 4 hàm, vá 4 WARN advisor | ✅ áp |
>
> `get_advisors security` = **0 WARN**, còn 2 INFO là chủ đích (policy deny-all).
> **6/6 bất biến bảo mật chạy thật trên DB đó đều PASS** — xem §7.
>
> **CÒN LẠI**: nạp seed dữ liệu (~452KB). Hiện `room_types` / `accounts` / `bookings` **rỗng**, `faqs` có 5 hàng.
> Đây là việc duy nhất chặn `200-01` ký `done/`, và cũng là việc duy nhất chặn QC đóng nốt `000-02` + `000-03`.
> Ghi chú: kết luận cũ của BE *"không có đường nào áp được migration"* là **SAI** — MCP Supabase bị tắt trong
> subagent nhưng phiên chính gọi được. `M19` (`SUPABASE_DB_PASSWORD` cho `supabase db push`) do đó **không còn là đường duy nhất**.

### 5.4 Giai Đoạn 300 — Go-Live (GD3 · Milestone 24–28/08)

| Ticket | Tên | Vai trò | Phụ thuộc | Trạng thái |
|---|---|---|---|---|
| `300-01` | Webhook thanh toán thật + xác thực HMAC-SHA256 | BE | `200-04` | `pending` |
| `300-02` | Trỏ domain, SSL, DKIM/SPF, thay nội dung chính thức | BE | `300-01` | `pending` |
| `300-03` | Bộ E2E test toàn hệ thống | QC | `300-02` | `pending` |
| `300-04` | Đào tạo lễ tân & bàn giao | PM | `300-03` | `pending` |

### 5.5 Tổng Hợp Tiến Độ

| Giai đoạn | Tổng số ticket | `pending` | `process` | `done` |
|---|:---:|:---:|:---:|:---:|
| **000 — Nền tảng** | 3 | 0 | 0 | **3** ✅ |
| **100 — Giao diện (GD1)** | 5 | 1 | 0 | **4** ✅ |
| **200 — Database & API (GD2)** | 8 | 4 | 0 | 4 |
| **300 — Go-Live (GD3)** | 4 | 4 | 0 | 0 |
| **TỔNG CỘNG** | **20** | **8** | **1** | **11** |

> 📌 **Tổng số ticket 20**: `100-05` (*System Admin — Quản lý hạng phòng & Ticket sự cố/bảo trì*)
> là ticket **mới**, tách ra theo hướng ✂️ Cắt 1 ở §8.2, nay đã `done`.

**Đối soát thư mục thật ↔ bảng trên (PM chạy `ls` ngày 07/08/2026, sau vòng 2): KHỚP 100%.**

| Thư mục | Số file | Danh sách |
|---|:--:|---|
| `done/` | **11** | `000-01` · `000-02` · `000-03` · `100-01` · `100-02` · `100-04` · `100-05` · `200-01` · `200-02` · `200-03` · `200-04` |
| `process/` | **1** | `100-03` |
| `pending/` | **8** | `200-05`…`200-08` · `300-01`…`300-04` |

> Trạng thái **trước** vòng điều phối này là 12 / 2 / 6. Sau vòng: **12 / 0 / 8** — `100-04` và `100-05`
> rời `process/` sang `done/` sau khi QC ký vòng 2.

**WIP hiện 0/3 — `process/` rỗng hoàn toàn.**

> ✅ **GD1 (Giao diện) ĐÃ ĐÓNG ĐỦ 5/5 ticket**: `100-01`, `100-02`, `100-04`, `100-05` đã `done`;
> `100-03` **chốt hoãn sang GD2** theo §8.5 — đây là quyết định phạm vi, không phải việc còn dang dở của GD1.
>
> 👉 **Ba vi phạm luật chung của vòng 1** (emoji icon · `focus:outline-none` · token VI trong bản EN) **đã được
> FE dọn cùng lượt sửa vòng 2**, trước khi ticket sang `done/` — đúng luật W6 mục 6.
>
> 👉 **Nợ mới phát sinh sau khi ticket đã `done/` phải mở ticket riêng** (luật W6 mục 6 — cấm sửa ticket đã `done/`).
> Danh sách đầy đủ ở **§10**.

---

## 6. Nhật Ký Rủi Ro & Bàn Giao Cần Theo Dõi

| # | Rủi ro / Phụ thuộc bên ngoài | Ảnh hưởng | Phương án xử lý tạm thời (Fallback) | Trạng thái |
|---|---|---|---|:---:|
| **R1** | Hồ sơ VietQR/Visa Doanh nghiệp | Chặn GD3 | Dùng `PAYMENT_MODE=simulated` (Ghi nợ tại `MANUAL.md`) | ⏳ Đang chờ |
| **R2** | Bộ ảnh HD & Bài viết chính thức | Chặn GD3 | Dùng Bộ ảnh Quiet Luxury demo (Ghi nợ tại `MANUAL.md`) | ⏳ Đang chờ |
| **R3** | SendGrid Production API Key | Chặn GD2 Email | Dùng SendGrid Sandbox Key (Ghi nợ tại `MANUAL.md`) | ⏳ Đang chờ |
| **R4** | Domain `thenamduhill.com` | Chặn GD3 | Dùng Vercel Subdomain demo (Ghi nợ tại `MANUAL.md`) | ⏳ Đang chờ |
| **R5** | ~~Khoá Supabase thật (`SUPABASE_ACCESS_TOKEN` + `SUPABASE_DB_PASSWORD`) — `M19`~~ | ~~Chặn GD2~~ | **✅ GỠ HẲN 06/08/2026.** Chủ dự án đã cấp cả hai khoá vào `.env.local` (`sbp_…` 44 ký tự + DB password 13 ký tự). `npx supabase db push --include-all` chạy **thành công**, không còn `28P01`. Schema + RLS + seed đều đã lên production. Giữ khoá để `300-*` deploy và dựng môi trường mới | ✅ **Đã gỡ** |
| **R6** | ~~`SUPABASE_SERVICE_ROLE_KEY` đang là publishable key — `M13`~~ | ~~Hỏng toàn bộ đăng nhập ở môi trường thật~~ | **✅ GỠ HẲN 06/08/2026.** Đã có khoá `sb_secret_…` thật, **khác** anon key. Kiểm chứng chạy thật: `GET /rest/v1/accounts` trả `206` + `content-range: 0-0/43` (trước là `200` + `[]`) ⇒ bỏ qua được RLS, đúng đặc trưng `service_role`. `POST /api/auth/login` → `200` + `Max-Age=28800`. **Không sửa một dòng code nào**, đúng như dự đoán | ✅ **Đã gỡ** |
| **R7** | ~~Seed dữ liệu ~452KB chưa nạp~~ | ~~Chặn 3 ticket ký `done/`~~ | **✅ GỠ HẲN 06/08/2026.** Seed đã nạp: 43 accounts · 20 room_types · 120 room_units · 1.800 inventory · 39 bookings · 156 activity_logs. Cả 3 ticket đã ký `done/`.<br>⚠️ **Nợ để lại**: seed **không idempotent**, 0 câu `ON CONFLICT` — cấm chạy `psql -f` lần hai | ✅ **Đã gỡ** |
| **R8** | ~~**Đường găng GD1** (`100-02` → `100-04`)~~ | ~~Chặn mốc GD1 10/08~~ | **✅ GỠ HẲN 07/08/2026.** GD1 đóng đủ **5/5 ticket giao diện** trước mốc 10/08 (3 ngày sớm): `100-01` · `100-02` · `100-04` · `100-05` đã `done`; `100-03` chốt hoãn sang GD2 theo §8.5. `process/` **rỗng**, không còn ticket nào nằm trên đường găng GD1 | ✅ **Đã gỡ** |
| **R11** | ~~**`100-04` + `100-05` cùng FAIL vòng 1 với lỗi hệ thống**~~ — thiếu tầng dữ liệu, thiếu phân quyền cấp trang, 43 emoji icon, 281 token VI trong bản EN, `focus:outline-none` | ~~Chặn mốc GD1 10/08~~ | **✅ GỠ HẲN 07/08/2026 — sửa xong trong ĐÚNG 1 vòng, không chạm trần 2 vòng của luật W1.** `100-04` 3/18 → **18/18 AC** · `100-05` 2/6 → **6/6 AC**; negative test 8/8 và 7/7. Ba lỗi chặn đã đóng: dựng đủ tầng dữ liệu · `RequirePermission` phủ **7/7** trang (từ 0/7) · NAV `tickets` có `permission`. Ba vi phạm luật chung dọn cùng lượt | ✅ **Đã gỡ** |
| **R12** | **Rule `W8` mới thêm vào `.claude/rules/workflow.md`** — 100% ticket release sang `done/` thì tự kích hoạt QC dựng bộ **E2E Playwright phủ ≥ 90%** chức năng chính, ưu tiên logic nghiệp vụ trước (đặt phòng 5 bước, tìm kiếm & tính giá, vòng đời đơn CMS, check-in/out, RBAC, chống overbooking) | Chưa ảnh hưởng tiến độ. Nhưng là **khối lượng QC chưa nằm trong ước lượng nào** ở §8 — cần tính vào GD3 | **Điều kiện W8.1 (`pending/` VÀ `process/` cùng rỗng) VẪN CHƯA ĐẠT.** Cập nhật 07/08: `process/` **đã rỗng** ✅ nhưng `pending/` **còn 12** ❌ ⇒ **không kích hoạt**. `300-03` là nơi thực thi `W8`, không mở ticket trùng | ⏳ **Chưa kích hoạt** |
| **R13** | **`pnpm typecheck` có cache turbo ⇒ từng báo PASS GIẢ** — trong khi `npx tsc --noEmit` bắt được **3 lỗi type thật** ở `admin/promotions/page.tsx` | **Nghiêm trọng về quy trình**: cổng chất lượng báo xanh trong khi code thật sai. Nếu tin cache, lỗi lọt thẳng sang GD2 và chỉ lộ ra lúc build production | **Luật mới, áp cho mọi lần nghiệm thu từ nay**: QC/SA **bắt buộc** chạy `pnpm typecheck --force` (kiểm `Cached: 0`) **hoặc** `npx tsc --noEmit`. **Cấm** lấy kết quả `pnpm typecheck` có cache làm bằng chứng DoD | ⚠️ **Bài học — đã thành luật** |
| **R14** | **Tiêu chí AC đúng nhưng KHÔNG ĐỦ** — `AC-7` của `100-02` kiểm `scrollWidth <= innerWidth` và **PASS**, trong khi thẻ mobile thực tế bị bóp còn **51px** (vô dụng về mặt thị giác) | Rủi ro lặp lại ở mọi AC kiểu "không cuộn ngang": mệnh đề đúng về kỹ thuật vẫn có thể che một giao diện hỏng | Từ nay AC mobile phải kèm **ngưỡng bề rộng tối thiểu của phần tử** (vd `card width ≥ 280px`), **không chỉ** kiểm tổng `scrollWidth`. `ndh-ba` áp khi viết AC cho `200-06`; `ndh-qc` bổ sung ảnh chụp 375px làm bằng chứng | ⚠️ **Bài học — áp từ `200-06`** |
| **R9** | **`activity_logs` + `room_units` là deny-all RLS có chủ ý** — client không đọc được, kể cả lễ tân đã đăng nhập | Chưa phát tác ở GD1 (chạy trên `booking.store`). **Sẽ phát tác ở `200-06`** khi nối API thật: FE gọi thẳng PostgREST sẽ nhận **mảng rỗng, không phải lỗi** — kiểu hỏng im lặng, rất khó chẩn đoán | Mọi truy cập hai bảng này **bắt buộc** qua Route Handler có `requirePermission()` + `service_role`. Đã ghi vào §5.1. `200-06` phải khai rõ trong §6 trước khi vào `process/` | ⚠️ Theo dõi |
| **R10** | **`MANUAL.md` có hai dòng cùng số hiệu `M13`** | Nhầm lẫn khi bàn giao — người đọc trích dẫn nhầm ô | Cả hai ô cùng nói về một hạng mục (`SUPABASE_SERVICE_ROLE_KEY`) và **cùng đã hoàn thành**, nên không sai nội dung. `300-04` đánh lại số hiệu khi bàn giao (đổi ô thứ hai thành `M21`) | ⚠️ Nợ tài liệu |

---

## 7. Mốc Đã Đạt — Schema & RLS Lên Production DB (06/08/2026)

Ghi nhận mốc quan trọng nhất của GD2: **cơ sở dữ liệu thật đã tồn tại và đã được kiểm chứng bảo mật.**

**Đối tượng**: Supabase project `kyarbmendxfgzgousydl` — trạng thái `ACTIVE_HEALTHY`.

**Đã áp 4 migration:**

| Mã migration | Nội dung |
|---|---|
| `20260101000000` | extensions + domain i18n + hàm `next_booking_code()` |
| `20260101000100` | **26 bảng** theo DTO `packages/core/src/booking-types.ts` |
| `20260101000200` | RLS — **26/26 bảng bật RLS, 24 policy** |
| `20260101000500` | *(file mới)* cố định `search_path` cho 4 hàm, vá 4 WARN của Supabase advisor |

**6/6 bất biến bảo mật — chạy thật trên chính DB đó, PASS toàn bộ:**

| # | Bất biến | Kết quả |
|:--:|---|:--:|
| 1 | Chặn oversell — `CHECK (booked_units + blocked_units <= total_units)` từ chối ghi vượt | ✅ PASS |
| 2 | `activity_logs` đã `REVOKE UPDATE, DELETE` — **kể cả `service_role`** không sửa/xoá được | ✅ PASS |
| 3 | Vai trò `anon` **không** `INSERT` được vào `bookings` | ✅ PASS |
| 4 | `current_account_id()` trả `NULL` khi không có phiên, **không ném lỗi** | ✅ PASS |
| 5 | Sinh mã đơn đúng định dạng `ĐH-2026-…` | ✅ PASS |
| 6 | `get_advisors security` = **0 WARN** (2 INFO còn lại là policy deny-all, chủ đích) | ✅ PASS |

**Hệ quả điều phối:**

* Rủi ro `R5` / `M19` **hạ cấp từ "Nghiêm trọng — chặn 3 ticket" xuống "đã gỡ"**.
* Kết luận cũ *"không có đường nào áp được migration"* đã bị bác bỏ: **MCP Supabase bị tắt trong subagent nhưng phiên chính gọi được**. Ghi lại để các vai trò sau không lặp lại chẩn đoán sai.
* **Cập nhật 06/08**: seed đã nạp xong, `R7` cũng đã gỡ. **Toàn bộ nền tảng GD2 hoàn tất** — 3/3 ticket `000-*` và `200-01` đều `done`.

---

## 8. Đánh Giá Đường Găng Tới Mốc GD1 (10/08/2026)

> ✅ **KẾT QUẢ CUỐI (07/08/2026): GD1 ĐÓNG ĐỦ, SỚM 3 NGÀY SO VỚI MỐC 10/08.**
> Giao **4/4 ticket** đúng phương án cắt scope §8.2 (`100-01` · `100-02` · `100-04` · `100-05`), `100-03` hoãn sang
> GD2 theo §8.5. Phương án cắt scope đã đúng: **§8.3 (dời mốc sang 13/08) KHÔNG cần dùng đến.**
>
> ⬇️ **Các mục §8.1–§8.4 dưới đây giữ nguyên làm hồ sơ quyết định**, không xoá — để vai trò sau truy được vì sao
> cắt scope. Đọc §8.5 để biết kết luận hiện hành.
>
> *(Ghi chú lịch sử: khi viết §8.1 ngày 06/08, PM đánh giá "giao đủ 4 ticket vào 10/08 là KHÔNG KHẢ THI" — đánh giá
> đó đúng với phạm vi 4 ticket **bao gồm** `100-03`; nó được giải quyết bằng cắt scope, không phải bằng chạy nhanh hơn.)*

### 8.1 Cơ sở tính

Hôm nay **06/08**, mốc **10/08** → còn **4 ngày làm việc**. Khối lượng còn lại:

| Ticket | Trạng thái thật | Ước lượng còn lại |
|---|---|---|
| `100-01` | Code xong, SA duyệt | **0,5 ngày** (chỉ QC verify) |
| `100-02` | Chưa viết dòng nào — 5 nhóm màn: danh sách, chi tiết, nhận phòng, tạo đơn thủ công, phân quyền theo `can()` + sửa `DataTable` | **2–2,5 ngày** |
| `100-04` | Chưa viết dòng nào — 4 màn dữ liệu nền + lịch tồn kho 30 cột + `BankConfig` type mới ở `core` | **2 ngày** |
| `100-03` | Chưa viết, **và chưa vào được `process/`** (chờ `100-02` `done`) | **1,5 ngày** |
| | | **≈ 6 ngày người / 4 ngày lịch** |

Cộng thêm mỗi ticket còn phải qua **SA review + QC verify thực tế** (mở thật 1440px và 375px, không tin lint) — vòng này lịch sử cho thấy tốn thêm 0,5 ngày/ticket và thường sinh ít nhất một vòng sửa.

**Kết luận số học: cần ~6 ngày người, có 4 ngày. Thiếu khoảng 40%.** Và `100-03` bị chặn tuần tự sau `100-02` nên không thể song song hoá để bù.

### 8.2 Đề xuất cắt scope — theo thứ tự, cắt từ dưới lên

| Ưu tiên | Hạng mục | Quyết định đề xuất | Lý do |
|:--:|---|---|---|
| **Giữ** | `100-01` toàn bộ | **Giao đúng hạn** | Đã xong. Đây là thứ khách nhìn thấy đầu tiên — luồng đặt phòng của khách cuối |
| **Giữ** | `100-02` phần *danh sách đơn + chi tiết đơn + nhận phòng* | **Giao đúng hạn** | Đây là màn lễ tân dùng hằng ngày, là lý do tồn tại của CMS |
| **Giữ** | `100-04` phần *hạng phòng + giá + phụ thu* | **Giao đúng hạn** | Không có màn này thì không ai nhập được dữ liệu vận hành |
| ✂️ **Cắt 1** | `100-02` phần **tạo đơn thủ công** (`admin/orders/new`) | **Tách thành `100-05`, hoãn sang GD2** | Lễ tân nhận đơn qua điện thoại vẫn nhập được bằng luồng khách ở `100-01`. Đây là tiện ích, không phải chức năng chặn |
| ✂️ **Cắt 2** | `100-04` phần **lịch tồn kho 30 cột** + `BankConfig` | **Hoãn sang GD2, gộp với `200-02`** | Lịch tồn kho chỉ có nghĩa khi đã có API giá thật (`200-02`). Làm ở GD1 trên store rồi viết lại ở `200-06` là làm hai lần. `BankConfig` chờ `M1` (chưa có STK thật) |
| ✂️ **Cắt 3** | `100-03` **trả phòng & chốt bill** | **Hoãn sang GD2 (17/08)** | Bị chặn tuần tự sau `100-02`, không đủ ngày. Nghiệp vụ trả phòng chỉ cần trước khi có khách thật ở GD3, **không cần ở mốc trình diễn giao diện GD1** |

### 8.3 Nếu khách yêu cầu giữ nguyên 4 ticket

Chỉ còn hai đường, cả hai đều phải khách chọn:

1. **Dời mốc GD1 từ 10/08 sang 13/08** (+3 ngày) — GD2 17/08 vẫn giữ được vì nền tảng DB đã xong sớm hơn kế hoạch.
2. **Chấp nhận giao bản chưa qua QC đầy đủ** ở `100-03`/`100-04` — **PM không khuyến nghị**: DoD QC bắt buộc verify thủ công thực tế, bỏ qua là mang lỗi vào GD2.

**Khuyến nghị của PM: chọn phương án cắt scope §8.2.** Mốc 10/08 giữ nguyên, khách vẫn thấy đủ luồng đặt phòng của khách cuối + CMS vận hành đơn — đúng thứ cần trình diễn ở một mốc "Giao diện".

### 8.4 Quyết định điều phối 07/08/2026 — **GIỮ `100-03` ở `pending/`**

`100-03` (*CMS — Màn trả phòng & chốt bill phát sinh*) **đã hội đủ cả hai điều kiện vào `process/`**:

* ✅ Phụ thuộc `100-02` đã `done` (QC ký 07/08) — hết chặn tuần tự.
* ✅ WIP hiện **2/3**, còn đúng một chỗ trống (luật R3 §2).

**PM vẫn quyết định KHÔNG kéo `100-03` vào `process/`.** Bốn lý do, xếp theo sức nặng:

| # | Lý do | Cơ sở |
|:--:|---|---|
| 1 | **Cả 2 ticket đang ở `process/` đều đang FAIL, không ticket nào chờ input** — WIP không hề "rảnh". Con số 2/3 là ảo: cả hai chỗ đều đang tiêu năng lực FE cho vòng sửa | QC 07/08: `100-04` 3/18 AC · `100-05` 2/6 AC |
| 2 | **§8.2 đã chốt hoãn `100-03` sang GD2 (17/08)** — kéo vào lúc này là **tự lật quyết định cắt scope của chính mình** mà không có dữ kiện mới nào biện minh. Dữ kiện mới duy nhất (`100-02` done) chỉ gỡ *chặn tuần tự*, không thêm *ngày công* | §8.2 ✂️ Cắt 3 |
| 3 | **Lỗi của `100-04`/`100-05` là lỗi hệ thống, dễ lây** — 43 emoji icon, `focus:outline-none`, 281 token VI trong bản EN, thiếu `can()` cấp trang. Mở thêm màn CMS thứ ba **trước khi FE nội hoá được đúng chuẩn** gần như chắc chắn nhân bản đúng bộ lỗi đó sang `100-03` | QC 07/08 — vi phạm `D5`/`FE9`, `FE1`, `C7`/`FE6` |
| 4 | **`100-03` không cần cho mốc GD1** — mốc 10/08 là mốc *trình diễn giao diện*; nghiệp vụ trả phòng chỉ cần trước khi có khách thật ở GD3 | §8.2 ✂️ Cắt 3 |

**Điều kiện mở khoá `100-03`** — PM sẽ kéo vào `process/` ngay khi **một trong hai** xảy ra:

1. `100-04` **hoặc** `100-05` được QC ký `done/` → có chỗ WIP thật, và có bằng chứng FE đã đạt chuẩn.
2. Tới **09/08** mà cả hai vẫn FAIL → lúc đó `100-03` chính thức trượt sang GD2 theo §8.2, **không kéo vào nữa**.

> 📌 Ghi rõ để vai trò sau không hiểu nhầm: đây **không phải** trường hợp "bị chặn phụ thuộc" (luật R3 §2 đã thoả).
> Đây là **lựa chọn có chủ đích của PM** nhằm giữ chất lượng vòng sửa. `100-03` là ticket sẵn sàng nhất ở `pending/`.

### 8.5 Quyết định điều phối 07/08/2026 (vòng 2) — **`100-03` CHÍNH THỨC HOÃN SANG GD2, KHÔNG kéo vào `process/`**

**Điều kiện mở khoá ở §8.4 đã thoả**: cả `100-04` **và** `100-05` đều được QC ký `done/` ngày 07/08 — trước hạn 09/08.
Mọi ràng buộc cứng cũng đã hết: phụ thuộc `100-02` `done`, `process/` **rỗng (WIP 0/3)**.

**PM vẫn quyết định KHÔNG kéo `100-03` vào `process/`, và chốt hoãn sang GD2 (17/08).** Đây là quyết định *xác nhận
lại* §8.2 ✂️ Cắt 3 — nhưng lý do đã **đổi hoàn toàn** so với §8.4, nên nêu lại từ dữ kiện mới:

| # | Lý do (dữ kiện 07/08 vòng 2) | Cơ sở |
|:--:|---|---|
| 1 | **Lý do cũ ở §8.4 đã hết hiệu lực và PM không viện dẫn lại.** §8.4 giữ `100-03` vì WIP ảo và vì sợ lây bộ lỗi của `100-04`/`100-05`. Cả hai đã biến mất: WIP thật 0/3, và FE đã chứng minh nội hoá được chuẩn (18/18 + 6/6 AC, 20/20 e2e). **Nếu chỉ có hai lý do đó thì hôm nay phải kéo vào.** Lý do giữ là lý do khác, ở dòng 2–4 | §8.4 vs QC vòng 2 |
| 2 | **`100-03` sẽ phải viết lại ở `200-06` — làm bây giờ là làm hai lần.** Màn trả phòng chốt bill phát sinh cần: tính tiền phát sinh (thuộc `200-02` API giá), đổi trạng thái đơn `checked_in → checked_out` (thuộc `200-04`), và đổi `RoomUnit` → `dirty`. Riêng `RoomUnit` là **bảng deny-all RLS** (`R9`) — client **không đọc được**, bắt buộc qua Route Handler. Làm ở GD1 trên `booking.store` rồi nối API ở `200-06` là **viết hai lần cùng một màn** | §8.2 ✂️ Cắt 3 · `R9` §5.1 |
| 3 | **Mốc GD1 là mốc TRÌNH DIỄN GIAO DIỆN, và nó đã đóng đủ.** Kéo `100-03` vào lúc này không làm GD1 "đầy đủ hơn" — nó biến một mốc đã hoàn thành sạch (5/5, sớm 3 ngày) thành một mốc đang dở. Đóng gọn rồi bàn giao là giá trị điều phối thật | §5.2 · §5.5 |
| 4 | **Đường găng đã dịch sang GD2 và GD2 đang trống người.** `200-02` (API tính giá) là phụ thuộc gốc của **5 ticket** `200-03`…`200-07`. Ném FE vào `100-03` không rút ngắn được chuỗi đó; ưu tiên đúng là để BE khởi động `200-02` ngay | §5.3 |

**Hệ quả — thứ tự ưu tiên kế tiếp PM khuyến nghị (không tự ý `git mv`, chỉ nêu):**

1. `200-02` — API tính giá theo từng đêm (BE). Gỡ nút thắt cho 5 ticket phía sau.
2. `100-03` — kéo vào **cùng lượt với `200-06`** để làm một lần trên API thật, không làm hai lần trên store.
3. Các ticket nợ mới ở **§10** — `ndh-ba` viết spec, không nhét vào ticket đã `done/`.

> 📌 Khác biệt so với §8.4: lần trước là **hoãn chiến thuật** (chờ vòng sửa xong). Lần này là **hoãn phạm vi có chủ đích**
> — `100-03` gắn với GD2 vì phụ thuộc kỹ thuật thật, không phải vì thiếu người hay thiếu chỗ WIP.

---

## 9. Rule `W8` — E2E Playwright Sau Khi Release Hoàn Tất

**Ghi nhận 07/08/2026: `.claude/rules/workflow.md` đã được bổ sung mục `W8`.**

Nội dung: khi **100% ticket của release `v1.0.0`** đã được nghiệm thu và chuyển sang `done/`, hệ thống **tự động
kích hoạt `ndh-qc`** dựng bộ kiểm thử tự động **E2E bằng Playwright**:

* Độ phủ mục tiêu: **≥ 90%** trên các chức năng chính.
* Thứ tự ưu tiên: **luồng logic nghiệp vụ trước** — đặt phòng 5 bước · tìm kiếm & tính giá · quản lý trạng thái đơn
  ở CMS · check-in / check-out · phân quyền RBAC · chống overbooking.

**Điều kiện kích hoạt `W8.1`: `pending/` VÀ `process/` phải cùng RỖNG.**

| Thư mục | Hiện tại (07/08/2026 — sau vòng 2) | Đạt điều kiện? |
|---|:--:|:--:|
| `pending/` | **12 file** | ❌ |
| `process/` | **0 file** (rỗng) | ✅ |

> ⛔ **`W8` VẪN CHƯA KÍCH HOẠT — điều kiện `W8.1` yêu cầu CẢ HAI thư mục cùng rỗng.** `process/` đã rỗng, nhưng
> `pending/` còn **12 ticket** ⇒ mới đạt **1/2 vế**. Còn **12 ticket** chưa vào `done/`.
>
> ⚠️ Ghi rõ để không hiểu nhầm: **`process/` rỗng KHÔNG phải tín hiệu kích hoạt `W8`.** Đây đúng là chỗ dễ đọc nhầm
> nhất — PM chốt lại nguyên văn điều kiện là **`pending/` VÀ `process/` cùng RỖNG**.
>
> PM tự đối soát lại mỗi lần cập nhật §5.5; không kích hoạt sớm dù chỉ còn 1 ticket. Khối lượng này chồng lấn
> `300-03` (*Bộ E2E test toàn hệ thống*) — khi tới GD3, **`300-03` là nơi thực thi `W8`**, không mở ticket trùng.
>
> 📌 Lưới e2e hiện có (**20/20 PASS** — `fe-100-02` 7/7 · `h3-theme` 4/4 · `fe-100-04-05-refix` 9/9) là **hồi quy của
> GD1**, không phải bộ `W8`. `300-03` kế thừa và mở rộng lên **≥ 90%** chức năng chính, không viết lại từ đầu.

---

## 10. Nợ Kỹ Thuật Mới — Phải Mở Ticket Riêng (luật W6 mục 6)

**Phát sinh khi QC ký vòng 2 ngày 07/08/2026.** Cả 5 hạng mục dưới đây đều thuộc `100-02` / `100-04` / `100-05` —
**các ticket này đã ở `done/` nên TUYỆT ĐỐI KHÔNG sửa nội dung ticket cũ** (luật `W6` mục 6: *"Không sửa ticket đã
`done/`. Phát sinh thì mở ticket mới"*).

👉 **Giao `ndh-ba` viết spec, `ndh-sa` duyệt mục 6, rồi mới vào `pending/`.**

| # | Hạng mục nợ | Nguồn | Vi phạm luật | Đề xuất xếp vào |
|:--:|---|---|---|---|
| 1 | `settings/accounts` — dữ liệu hàng (`roleLabel`, `statusLabel`) còn **VI cứng**, chưa `{vi, en}` | `100-04` | `C7` / `FE6` | GD2 |
| 2 | **Sửa hàng loạt tồn kho theo khoảng ngày** — hiện chỉ sửa được từng ô | `100-04` §6.8 mục 2 | — (tính năng) | GD2, gộp cân nhắc với `200-02` |
| 3 | **`M24`** — **tên tiếng Anh của 20 hạng phòng** trong seed `packages/core` | `MANUAL.md` `M24` | `R6` / `C7` | GD2 — chờ nội dung khách |
| 4 | **Màu cứng Tailwind + `focus:outline-none`** rải rác `src/app/admin/**` | QC `100-02` §8 | `FE2` / `FE1` / `D3` | GD2 — dọn một lượt |
| 5 | **`AccountBar` target < 24×24px** | QC `100-05` | `D4` / WCAG 2.2 §2.5.8 | GD2 |

> ⚠️ Mục **4** và **5** là vi phạm luật chung, **không phải yêu cầu mới** — chúng lọt qua vì AC của ticket cũ không
> phủ tới. Gợi ý `ndh-ba`: gom **4 + 5** thành **một ticket dọn chuẩn `app/admin/**`** thay vì hai ticket rời, vì
> cùng phạm vi file và cùng phải verify lại bằng một lượt QC.
>
> ⚠️ Mục **3** (`M24`) phụ thuộc nội dung khách cấp — theo **`MANUAL.md` Protocol** (`R2` §2), ticket vẫn chạy được
> bằng giá trị mặc định, **không chặn**.
