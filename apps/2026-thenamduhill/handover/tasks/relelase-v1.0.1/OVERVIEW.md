# RELEASE v1.0.1 — Vá API, Tối Ưu Vận Hành, SEO & Sẵn Sàng Tích Hợp

> **App target**: `apps/2026-thenamduhill` · **Theme giao khách**: `@repo/theme-h3`
> **Xuất phát**: v1.0.0 đã ký 20/20 ticket — nhưng [API_INTEGRATION_MAP.md](../release-v1.0.0/API_INTEGRATION_MAP.md) cho thấy **9 API còn thiếu hoặc chưa nối**
> **Nguồn yêu cầu**: 6 mục góp ý của chủ resort 08/08/2026 + yêu cầu tách 2 workflow BE/FE
> **Tài liệu điều hành**: [MANUAL.md](./MANUAL.md) · [TEST-STRATEGY.md](./TEST-STRATEGY.md) · [API_INTEGRATION_MAP.md](../release-v1.0.0/API_INTEGRATION_MAP.md)

> ### 📋 Đọc file nào
>
> | Ai | File | Nội dung |
> |---|---|---|
> | **Chủ dự án** | **[RUNBOOK.md](./RUNBOOK.md)** | Gõ lệnh gì để chạy · 5 lượt · token · mẫu báo cáo |
> | **`ndh-be`** | **[PLAN-BE-BRIEF.md](./PLAN-BE-BRIEF.md)** | ← agent đọc file này (~9k) |
> | **`ndh-fe`** | **[PLAN-FE-BRIEF.md](./PLAN-FE-BRIEF.md)** | ← agent đọc file này (~11k) |
> | Chủ dự án / khi cần hiểu sâu | [PLAN-BE.md](./PLAN-BE.md) · [PLAN-FE.md](./PLAN-FE.md) | Bản đầy đủ, có giải thích "vì sao" |
>
> File này (OVERVIEW) là **bối cảnh chung** — đọc một lần để hiểu vì sao, rồi
> làm việc theo plan của vai trò mình.
>
> **Cách chạy đã chốt**: một phiên chat, `ndh-be` ∥ `ndh-fe` chạy song song bên
> trong, dừng báo cáo cuối mỗi đợt. Chi tiết + giới hạn: [RUNBOOK §1, §6](./RUNBOOK.md).

---

## 0. Hai thay đổi lớn so với bản plan đầu

### 0.1 Quy trình — tách thành **2 workflow độc lập**

Yêu cầu của chủ dự án: *"quy trình làm việc chưa thành 2 giai đoạn BE, FE. BE test
done, bàn giao cho FE integration. be, fe cần handle những việc của mình, sẽ chia
thành 2 workflow hoạt động độc lập."*

Bản plan đầu xếp ticket theo **chủ đề** (test / SEO / PMS), trong mỗi nhóm lẫn cả
BE và FE — nhìn vào không biết ai chặn ai. Bản này xếp theo **workflow**. Xem §3.

### 0.2 Phạm vi — thêm nhóm `390`, làm **TRƯỚC tất cả**

`API_INTEGRATION_MAP.md` (cập nhật 08/08/2026) cho thấy v1.0.0 **chưa thật sự
xong**: 22 API thì BE ✅ 22, nhưng **FE mới nối 13**, và 5 hạng mục còn lỗi.

Chủ dự án đã quyết: **đưa vào v1.0.1, làm trước.** Lý do ở §2.

**Tổng: 27 ticket** (2 nhóm 380 hợp đồng API + 7 nhóm 390 + 18 nhóm 400–440).

### 0.3 Bốn quyết định đã chốt — KHÔNG hỏi lại

| # | Chủ đề | Quyết định (08/08/2026) |
|---|---|---|
| **Đ1** | Thanh toán | **Chỉ hardcode 3 lựa chọn ở FE**: thẻ tín dụng · chuyển khoản · thanh toán trực tiếp. Chưa nối cổng thật nào. **Mặc định mọi action khi test = `at-property`.** Xử lý ở bản sau — **không hỏi lại liên quan.** |
| **Đ2** | OCR CCCD/Passport | Giảm thao tác cho khách online bằng **cắt field + autofill**, không bằng OCR. OCR chừa interface ở form check-in lễ tân. Lý do đầy đủ §5 |
| **Đ3** | PMS / Channel Manager | Chỉ dựng **adapter + outbox + webhook out**. Chưa nối nhà cung cấp nào |
| **Đ4** | Upload ảnh | **Supabase Storage + `sharp`**, 4 kích thước + WebP/AVIF, trả `srcset` |

---

## 1. Tình trạng thực tế — khảo sát bằng code, không đọc tài liệu cũ

### 1.1 Đã có và chạy được ✅

| Hạng mục | Bằng chứng |
|---|---|
| 22 API, **BE xong 22/22** | `API_INTEGRATION_MAP.md §0` |
| Vòng đời đơn đầy đủ | RPC PL/pgSQL: `create_booking_atomic`, `confirm_booking_payment`, `check_in`, `check_out`, `cancel` |
| Chống overbooking 3 lớp | `SELECT FOR UPDATE` + `CHECK (booked_units + blocked_units <= total_units)` |
| RBAC 3 lớp | UI ẩn nút → `requirePermission()` → RLS |
| SEO cơ bản | `robots.ts` · `sitemap.ts` · `generateMetadata()` ở 13 trang |
| 3 lựa chọn thanh toán | Hardcode sẵn `app/booking/page.tsx:1257-1260` — **khớp Đ1** |
| Upload có nén | `sharp`, WebP, `MAX_WIDTH=2000` |
| E2E Playwright | 5 spec · `booking-lifecycle` 7/7 pass · `admin-room-types` 16/16 pass |

### 1.2 Lỗ hổng — phạm vi v1.0.1 ❌

**Nhóm A — API chưa xong (nhóm `390`, làm TRƯỚC):**

| # | Module | Lỗ hổng | Hệ quả với chủ resort | Ticket |
|---|---|---|---|---|
| **A1** | **M9** 🔴 | 4 API danh mục **chưa tồn tại**; CMS đọc/ghi `catalog.store` localStorage | **Hạng phòng chị tạo chỉ nằm trên máy đang dùng.** Đổi máy là mất. Trang khách không thấy | `390-01`,`390-02` |
| **A2** | **M11** 🔴 | `/lookup` gọi route có `withAuthGuard` → **401** | Khách **không tra được đơn**. §F4 coi như không có | `390-03`,`390-04` |
| **A3** | **M2** 🔴 | FE tính giá bằng `buildQuote()` **chạy ở trình duyệt** | **Chị sửa giá trong CMS, trang khách không đổi.** Giá khách thấy ≠ giá server chốt | `390-05` |
| **A4** | **M10** 🟡 | 2 cron **chưa khai trong `vercel.json`** | Đơn chưa trả tiền quá 15 phút **không được nhả** — tồn kho giữ vô thời hạn, mất doanh thu âm thầm | `390-06` |
| **A5** | **M4/M5** 🟡 | Huỷ đơn còn ghi store; hoàn tiền chưa nối | Huỷ xong F5 là mất; nút huỷ **không hiện số tiền mất** trước khi bấm (§F4) | `390-07` |

**Nhóm B — Lỗ hổng kỹ thuật (nhóm `400`–`440`):**

| # | Lỗ hổng | Hệ quả | Ticket |
|---|---|---|---|
| **B1** | **Không có tầng test backend nào.** Không Vitest, không pgTAP | Bug tính giá chỉ lộ ở E2E. Không gì bảo vệ 5 RPC khỏi hồi quy | `400-01`,`400-02` |
| **B2** | **0 dòng JSON-LD.** `grep "schema.org"` rỗng | Booking.com hiện giá+sao+ảnh trên Google, site chị hiện link trần | `410-01` |
| **B3** | **Ảnh ghi `public/uploads/`** — filesystem Vercel ephemeral | **Ảnh chị tải lên MẤT sau mỗi lần deploy** | `430-01` |
| **B4** | Inventory không có outbox | Nối Channel Manager sau này phải sửa lại 5 RPC — luật R5 cấm | `420-01` |
| **B5** | Bước 3 có 7 field, `idNumber` khách online không cần | Mỗi field bỏ được giảm rơi rụng trên mobile | `440-01` |
| **B6** | Không `hreflang`, không OG image động | Google coi vi/en là trùng lặp, tự chọn một bản | `410-02` |

---

## 2. Vì sao nhóm 390 phải làm TRƯỚC

Ba lý do, xếp theo mức nghiêm trọng:

**① Hai nhóm sau xây trên nền rỗng nếu không vá trước.**
- `410-01` (JSON-LD `Offer`) phải lấy **giá thật**. Mà M2 chưa nối thì FE đang đọc
  seed cục bộ — JSON-LD sẽ khai giá sai lên Google, và **giá sai trên kết quả tìm
  kiếm là thứ Google trừng phạt**.
- `420-01` (outbox cho Channel Manager) đồng bộ hạng phòng. Mà M9 chưa có API thì
  hạng phòng còn nằm localStorage — không có gì để đồng bộ.

**② M9 và M2 nghĩa là CMS chưa thật sự quản được dữ liệu.** Làm SEO cho một site
mà admin sửa giá không ăn sang trang khách là làm ngược thứ tự.

**③ M4/M10 là mất tiền âm thầm.** Tồn kho bị giữ vô thời hạn không báo lỗi ở đâu
cả — hệ thống chỉ báo "hết phòng" trong khi thực tế còn trống.

---

## 3. Mô hình contract-first — 5 lượt

> Mô hình do chủ dự án đề xuất, **thay cho** "bàn giao từng ticket" của bản trước.
> Vận hành chi tiết: [RUNBOOK.md](./RUNBOOK.md).

### 3.1 Vì sao đổi

**Điểm mấu chốt: FE không cần route *chạy được*, FE cần biết *hình dạng dữ liệu*.**
Tách hai thứ đó ra thì hai bên chạy song song thật, không phải xen kẽ.

| | Bàn giao từng ticket *(cũ)* | Contract-first *(bản này)* |
|---|---|---|
| FE bắt đầu khi | BE route **chạy được** | **Interface đã duyệt** |
| Điểm đồng bộ | Mỗi ticket một lần | **Một lần duy nhất, ở đầu** |
| FE chờ | Từng ticket một | Chỉ chờ lượt 1+2 |
| Phát hiện lệch hợp đồng | Lúc integration (muộn) | **Lúc SA review, trước khi ai code** |

### 3.2 Sơ đồ 5 lượt

```
LƯỢT 1 ── ndh-be ── ticket 380-01 ───────────────────────────────
   Review 27 ticket → gen INTERFACE toàn bộ API
   → packages/core/src/api-contracts.ts
   ⚠️ KHÔNG viết thân hàm. Chỉ type + shape + mã lỗi.
                              │
                              ▼
LƯỢT 2 ── ndh-sa ── ticket 380-02 ───────────────────────────────
   Review 6 câu hỏi: khớp schema DB? đủ field nghiệp vụ?
   ranh giới package? mã lỗi đủ? song ngữ? FE dùng được?
   PASS → 🔒 FREEZE INTERFACE     FAIL → trả về 380-01
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
LƯỢT 3 ── ndh-fe ─────────────  ∥  ── LƯỢT 4 ── ndh-be ──────────
   Code ĐẦY ĐỦ: UI · store ·        Viết thân hàm 9 ticket BE
   7 trạng thái · mobile ·            + tầng 1 (pgTAP)
   song ngữ · xử lý lỗi               + tầng 2 (integration)
   Gọi fetch THẬT, chặn ở                    │
   TẦNG MẠNG bằng mock                       ▼
              │                     Cột BE trong MAP → ✅
              ▼
   Ticket: pending-be-testing               │
              │                             │
              └───────────────┬─────────────┘
                              ▼
LƯỢT 5 ── gỡ mock + ndh-qc ──────────────────────────────────────
   FE gỡ mock → trỏ route thật → E2E Playwright → ký done/
```

**Lượt 3 và 4 chạy song song thật** — đây là chỗ tiết kiệm thời gian nhất.

### 3.3 Trạng thái mới của ticket FE

| Trạng thái | Nghĩa | Ai chuyển |
|---|---|---|
| `process` | FE đang code theo interface + mock | `ndh-pm` |
| **`pending-be-testing`** | **Code xong, mock chạy, chờ route thật** | `ndh-fe` tự đánh dấu ở mục 8 |
| `process` (lần 2) | Gỡ mock, trỏ route thật | `ndh-pm` khi ô BE ✅ |
| `done` | E2E xanh | **`ndh-qc` — độc quyền** |

⚠️ `pending-be-testing` **không phải** `done`. Ticket vẫn nằm trong `process/`.

### 3.4 Freeze interface — luật sau lượt 2

```
BE muốn đổi interface
   → mở ticket 900-*, ghi RÕ vì sao (bằng chứng từ DB/nghiệp vụ)
   → ndh-sa duyệt
   → sửa api-contracts.ts
   → FE typecheck ĐỎ NGAY        ← cơ chế bảo vệ TỰ ĐỘNG
   → FE sửa theo
```

**Vì sao freeze mà vẫn cho đổi**: cấm hẳn thì khi interface sai về nghiệp vụ, BE
bị ép viết code sai. Freeze không phải cấm đổi — là bắt **mọi lần đổi đều có vết
và có người duyệt**.

**Cấm sửa lén** — FE sẽ code theo bản cũ mà không biết, đến lượt 5 mới vỡ.

### 3.5 Cổng bàn giao BE (lượt 4 → lượt 5)

`ndh-be` **không được** báo xong ticket khi thiếu bất kỳ điều nào:

| # | Điều kiện | Kiểm bằng |
|:--:|---|---|
| **1** | **Tầng 1 (pgTAP) xanh** — nếu ticket chạm SQL/RPC | `pnpm test:sql` |
| **2** | **Tầng 2 (API integration) xanh**, ≥1 negative test | `pnpm test:api` |
| **3** | **Cột BE trong MAP → ✅** kèm bằng chứng | Đọc MAP |
| **4** | **Mục 9 của ticket điền đủ** | Đọc ticket |

⚠️ **Luật của MAP**: *"Không ghi ✅ nếu chưa chạy thử. Tài liệu sai nguy hiểm hơn
không có tài liệu, vì người sau tin rằng chỗ đó đã xong."*

### 3.3 Ranh giới trách nhiệm

| | Workflow **BE** | Workflow **FE** |
|---|---|---|
| **Sở hữu** | `app/api/**` · `supabase/migrations/**` · `packages/core` · `src/lib/**` · `vercel.json` | `packages/theme-h3` · `app/admin/**` · `app/(client)/**` · `app/booking/**` · `src/stores/**` · `src/components/**` |
| **Test phải viết** | Tầng 1 + Tầng 2 | Tầng 3 |
| **Cập nhật MAP** | Cột **BE** | Cột **FE** |
| **Không chạm** | `packages/theme-*`, file có `className` | SQL, Route Handler, migration |

**Điểm giao duy nhất**: `packages/core/src/api-contracts.ts` (`400-04`). BE sửa
hợp đồng → FE typecheck đỏ ngay, không phải chờ E2E.

**Khi bất đồng**: `ndh-sa` phân xử bằng file hợp đồng. Bên nào lệch thì bên đó
sửa; hợp đồng sai thì `ndh-sa` sửa hợp đồng và mở ticket `900-*` ghi lý do.

---

## 4. Tư vấn: SEO — 6 việc kỹ thuật

| Ưu tiên | Việc | Vì sao | Ticket |
|:---:|---|---|---|
| **1** | **JSON-LD `Hotel` + `HotelRoom` + `Offer`** | Thứ khiến Google hiện **giá phòng ngay trên kết quả tìm kiếm**. Hiện repo có **0 dòng** | `410-01` |
| **2** | `BreadcrumbList` + `FAQPage` | Breadcrumb thay URL dài; FAQ chiếm thêm dòng | `410-01` |
| **3** | `hreflang` vi/en + `x-default` → vi | Không có thì Google coi 2 bản là trùng lặp, tự chọn — thường chọn sai | `410-02` |
| **4** | OG image động | Quyết định link có được bấm khi chia sẻ Zalo/Facebook | `410-02` |
| **5** | `Article` blog + sitemap `lastmod` | Cho Google biết trang nào mới đổi | `410-03` |
| **6** | ISR trang phòng | Giữ trang nhanh **khi giá đổi hằng ngày** | `410-03` |

⚠️ **Chặn Go-Live (R9)**: nội dung crawl từ `thenamduhill.com` — **website cũ của
chị đang chạy**. Đẩy bản sao lên tên miền mới thì Google coi site mới là bản sao
và xếp hạng site cũ. MANUAL.md `M22`.

---

## 5. Tư vấn: OCR CCCD ở luồng khách — em khuyên KHÔNG

Chị hỏi đúng vấn đề (*"đơn giản nhất, đặc biệt trên điện thoại"*), nhưng OCR ở
bước đặt phòng **giải sai bài toán**:

**① Khách online không bắt buộc khai CCCD** — nghĩa vụ khai báo lưu trú phát sinh
lúc nhận phòng, do lễ tân làm.

**② OCR thêm ma sát**: xin quyền camera → do dự → chụp → chờ server → sửa chỗ nhận
sai. Nhiều bước hơn gõ 1 field. **OCR chỉ thắng khi phải nhập ≥4 field từ giấy tờ.**

**③ Nhận dữ liệu CCCD sớm là nhận rủi ro sớm** — lưu số CCCD của khách chưa chắc
đặt phòng là lưu dữ liệu cá nhân không có mục đích tương ứng.

### Cái em làm thay — đo được

| Biện pháp | Trước | Sau | Ticket |
|---|---|---|---|
| Bỏ `idNumber` khỏi bước 3 | 7 field | 6 | `440-01` |
| Gộp giờ đến vào "Yêu cầu đặc biệt" | 6 | 5 | `440-01` |
| `autoComplete`/`inputMode` đúng chuẩn | 5 lần gõ | 1 lần autofill | `440-01` |
| Điền sẵn từ `auth.store` | 5 field trống | **0 field** | `440-02` |
| "Đặt lại" từ đơn cũ | nhập lại | 1 lần bấm | `440-02` |
| Mobile gộp bước 3+4 | 2 trang | 1 trang | `440-03` |

**Khách mới nhập 5 field (đa số autofill), khách quay lại nhập 0 field.** OCR
không cho con số nào tốt hơn.

**OCR vẫn chừa chỗ** — `440-04` dựng interface `IdDocumentScanner` cắm vào **form
check-in của lễ tân** (nhập 4 field từ giấy tờ, hàng chục lần/ngày). Bật thật =
thay một class.

---

## 6. Tư vấn: Quản trị website đơn giản

| Việc | Trạng thái | Ticket |
|---|---|---|
| Ảnh tự tối ưu, **không mất sau deploy** | `sharp` đã có — chỉ đổi thân hàm `persist()`, hợp đồng API không đổi | `430-01` |
| Kéo-thả nhiều ảnh + tiến trình + sắp xếp | `ImageUploadField.tsx` đang có, cần hoàn thiện | `430-02` |
| Copy/paste từ Word không tha rác HTML | Chưa có | `430-03` |
| Xem trước trước khi đăng | Chưa có | `430-04` |

---

## 7. Danh sách ticket — 27 ticket

### 7.0 LƯỢT 1 + 2 — Hợp đồng API *(2 ticket, chặn TẤT CẢ)*

| Mã | Tên | Ai làm | Lượt |
|---|---|:---:|:--:|
| **`380-01`** | **Gen interface toàn bộ API** vào `api-contracts.ts` | `ndh-be` | **1** |
| **`380-02`** | **Review kiến trúc mapping + FREEZE interface** | `ndh-sa` | **2** |

⚠️ Hai ticket này chặn 25 ticket còn lại. `380-02` là **cổng chặn duy nhất** trước
khi cả BE lẫn FE bắt đầu code.

### 7.1 WORKFLOW BE — 10 ticket *(lượt 4)*

| Mã | Tên | Phụ thuộc | Bàn giao cho |
|---|---|---|---|
| `400-01` | Vitest + API integration test 21 route | `380-02` | — |
| `400-02` | pgTAP: RPC lifecycle · RLS · overbooking đồng thời | `400-01` | — |
| **`390-01`** | **API danh mục** room-types/rate-plans/addons/bank (M9) | `400-01` | `390-02` |
| **`390-03`** | **`/api/bookings/lookup`** công khai (M11) | `400-01` | `390-04` |
| **`390-06`** | **Xác minh 2 cron chạy thật** (M10) | `400-01` | — *(không cần FE)* |
| `430-01` | Supabase Storage + 4 kích thước + srcset | `400-01` | `430-02` |
| `420-01` | Bảng `integration_outbox` + ghi event | `400-02` | — |
| `420-02` | `ChannelAdapter` + webhook out có retry | `420-01` | `420-03` |
| `440-04` | `IdDocumentScanner` ở form check-in | `400-01` | — |
| `400-04` | Gộp `pnpm test` + CI *(`ndh-sa`)* | `400-01`,`400-02`,`400-03` | — |

### 7.2 WORKFLOW FE — 15 ticket *(lượt 3, song song với lượt 4)*

> Cột "Nhận từ BE" giờ chỉ áp dụng ở **lượt 5** (gỡ mock). Ở lượt 3, FE code
> **toàn bộ 15 ticket** theo interface + mock, không chờ ai.

| Mã | Tên | Nhận từ BE | Chờ ô MAP |
|---|---|---|---|
| `400-03` | Vitest + RTL: store & component thuần | — *(độc lập)* | — |
| **`390-05`** | **`useQuote` gọi API báo giá** (M2) | — *(BE đã ✅)* | M2 ✅ sẵn |
| **`390-07`** | **Huỷ đơn + hoàn tiền + hiện số tiền mất** (M4/M5) | — *(BE đã ✅)* | M4/M5 ✅ sẵn |
| **`390-02`** | **Nối 4 màn danh mục** (M9) | `390-01` | **M9 cột BE** |
| **`390-04`** | **Nối trang `/lookup`** (M11) | `390-03` | **M11 cột BE** |
| `410-01` | JSON-LD Hotel/HotelRoom/Offer/Breadcrumb/FAQ | — | sau `390-05` |
| `410-02` | hreflang vi/en + OG image động | `410-01` | ⚠️ **`M29` chặn** |
| `410-03` | Article blog · sitemap lastmod · ISR | `410-01` | — |
| `430-02` | `ImageUploadField` kéo-thả nhiều ảnh | `430-01` | — |
| `430-03` | Editor paste sạch từ Word | `400-03` | — |
| `430-04` | Nút "Xem trước" trên theme H3 | `430-03` | — |
| `420-03` | CMS màn "Tích hợp" | `420-02` | — |
| `440-01` | Cắt bước 3 còn 5 field + autoComplete | `400-03` | — |
| `440-02` | Điền sẵn từ auth · "Đặt lại" từ đơn cũ | `440-01` | — |
| `440-03` | Mobile gộp bước 3+4, sticky CTA | `440-02` | — |

---

## 8. Thứ tự thực thi — 5 lượt

Giới hạn **3 ticket ở `process/`** mỗi workflow (luật R3/W3).

```
LƯỢT 1 ── ndh-be ──────────────────── một mình, chặn tất cả
   380-01  gen interface toàn bộ API

LƯỢT 2 ── ndh-sa ──────────────────── cổng chặn duy nhất
   380-02  review 6 câu hỏi → 🔒 FREEZE
              │
              ├──────────────────────────────┐
              ▼                              ▼
LƯỢT 3 ── ndh-fe (15 ticket) ──── ∥ ── LƯỢT 4 ── ndh-be (10 ticket)
                                 │
  Đợt 3a  400-03                 │   Đợt 4a  400-01 → 400-02
          390-05 · 390-07        │
  Đợt 3b  390-02 · 390-04        │   Đợt 4b  390-01 · 390-03 · 390-06
          410-01 → 410-02 → 410-03│
  Đợt 3c  430-02 · 420-03        │   Đợt 4c  430-01 · 420-01 → 420-02
          430-03 → 430-04        │           440-04
  Đợt 3d  440-01 → 440-02 → 440-03│  Đợt 4d  400-04 (SA)
                                 │
  Mọi ticket code theo interface │   Mỗi ticket xong → cột BE trong MAP ✅
  + mock → pending-be-testing    │
              │                              │
              └───────────────┬──────────────┘
                              ▼
LƯỢT 5 ── gỡ mock + QC ──────────────────────────────────────────
   FE gỡ mock (chỉ khi ô BE ✅) → trỏ route thật
   ndh-qc: E2E Playwright → ký done/
   Cổng W8: 12/12 luồng có test
```

⚠️ **Lượt 3 không có phụ thuộc vào lượt 4.** FE code cả 15 ticket theo interface,
không chờ BE. Chỉ **lượt 5** (gỡ mock) mới cần ô BE ✅.

⚠️ `410-02` vẫn bị **`M29` chặn cứng** (chưa chốt tên miền) — không có fallback
an toàn cho `hreflang`/`canonical`.

**Điều kiện vào cổng W8** (luật W8.1): `pending/` và `process/` rỗng — kiểm bằng
`ls`, **không tin bảng §9** — và `ndh-pm` đối soát thư mục ↔ §9 KHỚP 100%.

---

## 9. Bảng tiến độ

> `ndh-pm` cập nhật sau mỗi `git mv`. Con số **luôn phải khớp `ls`**.

**Tiến độ: `done` 0/27 · `process` 0 · `pending` 27** *(khởi tạo 08/08/2026, đối soát bằng `ls`)*

### 9.0 Hợp đồng API — 2 ticket *(lượt 1+2, chặn tất cả)*

| Mã | Tên | Ai làm | Lượt | Trạng thái |
|---|---|:---:|:--:|:---:|
| `380-01` | Gen interface toàn bộ API | `ndh-be` | 1 | `pending` |
| `380-02` | Review kiến trúc + FREEZE | `ndh-sa` | 2 | `pending` |

### 9.1 Workflow BE — 10 ticket *(lượt 4)*

| Mã | Tên | Module MAP | Bàn giao cho | Trạng thái |
|---|---|:---:|:---:|:---:|
| `400-01` | Vitest + API integration test 21 route | — | — | `pending` |
| `400-02` | pgTAP: RPC · RLS · overbooking | — | — | `pending` |
| `390-01` | API danh mục (room-types/rate-plans/addons/bank) | **M9** | `390-02` | `pending` |
| `390-03` | `/api/bookings/lookup` công khai | **M11** | `390-04` | `pending` |
| `390-06` | Xác minh 2 cron chạy thật | **M10** | — | `pending` |
| `430-01` | Supabase Storage + srcset | M8 | `430-02` | `pending` |
| `420-01` | Bảng `integration_outbox` | — | — | `pending` |
| `420-02` | `ChannelAdapter` + webhook out | — | `420-03` | `pending` |
| `440-04` | `IdDocumentScanner` ở check-in | — | — | `pending` |
| `400-04` | Gộp test + CI + hợp đồng API *(SA)* | — | — | `pending` |

### 9.2 Workflow FE — 15 ticket *(lượt 3, song song lượt 4)*

> Cột "Nhận từ" chỉ áp dụng ở **lượt 5** (gỡ mock). Ở lượt 3, FE code cả 15
> ticket theo interface + mock, **không chờ ai**.

| Mã | Tên | Module MAP | Nhận từ *(lượt 5)* | Trạng thái |
|---|---|:---:|:---:|:---:|
| `400-03` | Vitest + RTL: store & component | — | — | `pending` |
| `390-05` | `useQuote` gọi API báo giá | **M2** | BE ✅ sẵn | `pending` |
| `390-07` | Huỷ đơn + hoàn tiền + số tiền mất | **M4/M5** | BE ✅ sẵn | `pending` |
| `390-02` | Nối 4 màn danh mục | **M9** | `390-01` | `pending` |
| `390-04` | Nối trang `/lookup` | **M11** | `390-03` | `pending` |
| `410-01` | JSON-LD Hotel/HotelRoom/Offer/FAQ | — | — | `pending` |
| `410-02` | hreflang + OG image động | — | `410-01` | `pending` |
| `410-03` | Article · sitemap lastmod · ISR | — | `410-01` | `pending` |
| `430-02` | `ImageUploadField` kéo-thả nhiều ảnh | M8 | `430-01` | `pending` |
| `430-03` | Editor paste sạch từ Word | — | `400-03` | `pending` |
| `430-04` | Nút "Xem trước" trên theme H3 | — | `430-03` | `pending` |
| `420-03` | CMS màn "Tích hợp" | — | `420-02` | `pending` |
| `440-01` | Cắt bước 3 còn 5 field | — | `400-03` | `pending` |
| `440-02` | Điền sẵn từ auth · "Đặt lại" | — | `440-01` | `pending` |
| `440-03` | Mobile gộp bước 3+4 | — | `440-02` | `pending` |

---

## 10. Định nghĩa "xong" của v1.0.1

Kế thừa DoD v1.0.0, **thêm** 9 điều kiện:

**Về API (nhóm 390):**
- [ ] `API_INTEGRATION_MAP.md` — **cả 2 cột BE và FE đều ✅ cho M1–M11**, không còn ô 🔴/🟡
- [ ] Tạo hạng phòng ở máy A → **thấy ở máy B** và **hiện trên trang khách** (M9)
- [ ] Khách chưa đăng nhập **tra được đơn** bằng mã + SĐT (M11)
- [ ] **Sửa giá trong CMS → trang khách đổi theo** (M2)
- [ ] Cron chạy thật trên deploy — có ảnh chụp log, đơn quá hạn được nhả (M10)
- [ ] Huỷ đơn **F5 vẫn là `cancelled`**, tồn kho nhả, nút huỷ hiện số tiền mất (M4/M5)

**Về hạ tầng:**
- [ ] `pnpm test` chạy 4 tầng bằng **một lệnh**, xanh; mỗi tầng ≥1 negative test
- [ ] `grep "schema.org"` **không còn rỗng**; ảnh **còn sống sau một lần deploy thật**
- [ ] Bước 3 trên iPhone thật: **≤5 field, ≥3 field autofill được**

---

## 11. Rủi ro

| # | Rủi ro | Mức | Cách chặn |
|---|---|:---:|---|
| **RS1** | Viết test **sau** khi có 21 route → phát hiện route đã lệch hợp đồng | Cao | `400-01` làm **đầu tiên**. Lệch → mở `900-*`, **không sửa lén** |
| **RS2** | **Di trú `catalog.store` làm mất dữ liệu chị đã nhập** | **Cao** | `390-02` AC-2/AC-3: hộp thoại có nút tải lên **và** tải file sao lưu; "Bỏ qua" không xoá gì |
| **RS3** | **`/api/bookings/lookup` thành cửa dò dữ liệu khách** | **Cao** | `390-03`: bắt buộc cả `code`+`phone`, thông báo lỗi **giống nhau**, rate limit, không trả field nhạy cảm |
| **RS4** | Nội dung crawl lên production → Google coi site mới là bản sao **site cũ đang chạy** | **Cao** | Chặn cứng cổng W8. MANUAL `M22` |
| **RS5** | **Plan Vercel không cho cron 5 phút** → khai xong vẫn không chạy | Trung bình | `390-06` mục 6 kiểm **trước khi code**. AC-2 bắt buộc bằng chứng chạy thật |
| **RS6** | FE fallback về `buildQuote()` client khi API lỗi | Trung bình | `390-05` AC-11 **cấm** — đó là quay lại đúng bug đang sửa |
| **RS7** | Supabase local cần Docker | Trung bình | Fallback Supabase branch. MANUAL `M24` |
| **RS8** | Outbox phình to, không ai dọn | Trung bình | `420-01` retention 90 ngày + cron, cùng migration |
| **RS9** | Chưa nối cổng thanh toán thật (Đ1) mà Go-Live | Trung bình | `PAYMENT_MODE=simulated`, test dùng `at-property`. MANUAL `M4` giữ ⏳ |
| **RS10** | Cắt field bước 3 làm mất dữ liệu lễ tân cần | Thấp | `idNumber` chuyển sang check-in (`440-04`), **không xoá khỏi DB** |
