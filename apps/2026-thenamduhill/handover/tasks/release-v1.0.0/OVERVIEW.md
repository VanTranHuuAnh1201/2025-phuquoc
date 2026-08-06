# RELEASE v1.0.0 — Hệ Thống Đặt Phòng & CMS Quản Lý The Nam Du Hill Resort

> **App target**: `apps/2026-thenamduhill` · **Theme giao khách**: `@repo/theme-h3`  
> **Mốc bàn giao**: GD1 `10/08/2026` (Giao diện) · GD2 `17/08/2026` (DB & API) · GD3 `24–28/08/2026` (Go-Live)  
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
| `100-01` | Client — Luồng đặt phòng 5 bước (theme H3) | FE | `000-01` ✅ | `process` 🔵 |
| `100-02` | CMS — Danh sách đơn, chi tiết, gán phòng, tạo đơn thủ công | FE | `000-02` ✅ | `process` 🔵 |
| `100-03` | CMS — Màn trả phòng & chốt bill phát sinh | FE | `100-02` ⏳ | `pending` |
| `100-04` | CMS — Quản lý dữ liệu nền (hạng phòng, giá, phụ thu, ngân hàng) | FE | `000-02` ✅ | `process` 🔵 |

> 🔵 **Ba ticket vào `process/` ngày 06/08/2026 — WIP đầy 3/3.** Cả ba đã có §6 do SA điền và phụ thuộc đã `done`.
>
> | Ticket | Vì sao vào được | Việc còn lại |
> |---|---|---|
> | `100-01` | Phụ thuộc `000-01` `done`. **Code ĐÃ XONG, SA đã DUYỆT** (§6.11, review 06/08) — ticket bị bỏ quên ở `pending/` dù đã qua vòng code + review | **Chỉ chờ QC verify.** Đây là ticket gần `done/` nhất của cả release |
> | `100-02` | Phụ thuộc `000-02` vừa `done`. §6 SA đầy đủ 10 mục | FE code từ đầu |
> | `100-04` | Phụ thuộc `000-02` vừa `done`. §6 SA đầy đủ 8 mục | FE code từ đầu |
>
> ⛔ **`100-03` KHÔNG vào được** — phụ thuộc `100-02` chưa `done` (luật R3 §2). Đúng luật, không phải do hết chỗ WIP.
>
> ⚠️ **Xung đột tài nguyên `100-02` ↔ `100-04` — PM đã tuần tự hoá.** `100-04` §6 dòng 222 ghi rõ: `100-04` dùng
> prop `selectable` của `DataTable` do **`100-02` bổ sung**. Nếu chạy song song, **FE làm `100-04` CẤM tự sửa
> `packages/ui/src/DataTable.tsx`** — chờ `100-02` đẩy `selectable` lên trước, hoặc tạm bỏ chọn-nhiều ở 4 màn
> `100-04` và ghi lại. **Không được có hai bản selection** trong `@repo/ui`.

### 5.3 Giai Đoạn 200 — Database & API (GD2 · Milestone 17/08)

| Ticket | Tên | Vai trò | Phụ thuộc | Trạng thái |
|---|---|---|---|---|
| `200-01` | Migration Supabase + seed dữ liệu thật + RLS | BE | `000-01` | `done` ✅ |
| `200-02` | API tính giá theo từng đêm | BE | `200-01` | `pending` |
| `200-03` | API tạo đơn & chống đặt trùng (`SELECT FOR UPDATE`) | BE | `200-02` | `pending` |
| `200-04` | API xác nhận thanh toán (giả lập) & vòng đời đơn | BE | `200-03` | `pending` |
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
| **100 — Giao diện (GD1)** | 4 | 1 | 3 | 0 |
| **200 — Database & API (GD2)** | 8 | 7 | 0 | 1 |
| **300 — Go-Live (GD3)** | 4 | 4 | 0 | 0 |
| **TỔNG CỘNG** | **19** | **12** | **3** | **4** |

**Đối soát thư mục thật ↔ bảng trên (PM chạy `ls` ngày 06/08/2026, sau khi điều phối): KHỚP 100%.**
`pending/` 12 file · `process/` 3 file (`100-01`, `100-02`, `100-04`) · `done/` 4 file (`000-01`, `000-02`, `000-03`, `200-01`).

> Trạng thái **trước** vòng điều phối này là 15 / 0 / 4 — WIP rỗng 0/3, dây chuyền đứng. Đã nạp lại đầy 3/3.

**WIP đầy 3/3 — không nhận thêm ticket cho tới khi có ticket rời `process/`.**

| Ticket ở `process/` | Tình trạng | Đang chờ gì |
|---|---|---|
| `100-01` | **Code xong · SA đã DUYỆT** (§6.11) · lint 0 error · typecheck 13/13 | **QC verify** — mở thật 5 bước ở 1440px và 375px |
| `100-02` | §6 SA đầy đủ · phụ thuộc `000-02` `done` | **FE code** — nút thắt của GD1, `100-03` đứng sau nó |
| `100-04` | §6 SA đầy đủ · phụ thuộc `000-02` `done` | **FE code** — không được sửa `DataTable` trước `100-02` |

> 👉 **Đường tới hạn mới: `100-02`.** Nó vừa là ticket nặng nhất GD1, vừa chặn `100-03`, vừa giữ prop
> `selectable` mà `100-04` cần. Ưu tiên FE dồn vào `100-02` trước `100-04`.
>
> 👉 **`100-01` là điểm ghi bàn nhanh nhất** — chỉ cần QC verify là `done/`, mở ngay một chỗ WIP cho `100-03`.

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
| **R8** | **Đường găng GD1 dồn vào `100-02`** — ticket nặng nhất (5 nhóm màn CMS), đồng thời chặn `100-03` và giữ prop `selectable` mà `100-04` cần | **Chặn mốc GD1 10/08.** Còn 4 ngày cho 4 ticket giao diện, trong đó 3 ticket chưa viết dòng code nào | Dồn FE vào `100-02` trước. `100-01` đẩy QC ngay để giải phóng WIP. Nếu tới 08/08 `100-02` chưa xong: **cắt scope theo thứ tự ở §8** — bỏ "tạo đơn thủ công" khỏi `100-02`, hoãn `100-03` sang GD2 | 🔴 **Ưu tiên 1** |
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

> **PM nói thẳng: theo kế hoạch hiện tại, GD1 giao đủ 4 ticket vào 10/08 là KHÔNG KHẢ THI.**
> Dưới đây là cơ sở và phương án cắt scope. Không giấu để rồi báo trượt vào ngày cuối.

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
