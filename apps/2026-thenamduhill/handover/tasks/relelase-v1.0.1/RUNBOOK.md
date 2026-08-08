# RUNBOOK — Cách vận hành release v1.0.1

> Mô hình **contract-first**, chốt với chủ dự án 08/08/2026.
> File này trả lời: **ai chạy cái gì, khi nào, chủ dự án gõ gì để bắt đầu.**
>
> Plan chi tiết: [PLAN-BE.md](./PLAN-BE.md) · [PLAN-FE.md](./PLAN-FE.md)
> Bối cảnh: [OVERVIEW.md](./OVERVIEW.md) · Hợp đồng: [API_INTEGRATION_MAP.md](../release-v1.0.0/API_INTEGRATION_MAP.md)

---

## 1. Mô hình — contract-first, 5 lượt

Đây là mô hình do chủ dự án đề xuất, **thay cho** mô hình "bàn giao từng ticket"
của bản trước.

### 1.1 Vì sao đổi

| | Bàn giao từng ticket *(bản cũ)* | Contract-first *(bản này)* |
|---|---|---|
| FE bắt đầu khi | BE route **chạy được** | **Interface đã duyệt** |
| Điểm đồng bộ | Mỗi ticket một lần | **Một lần duy nhất, ở đầu** |
| FE chờ | Từng ticket một | Chỉ chờ lượt 1+2 |
| Phát hiện lệch hợp đồng | Lúc integration (muộn) | **Lúc SA review, trước khi ai code** |

**Điểm mấu chốt**: FE không cần route *chạy được*, FE cần biết *hình dạng dữ liệu*.
Hai thứ đó tách được — tách ra thì hai bên chạy song song thật, không phải xen kẽ.

### 1.2 Năm lượt

```
LƯỢT 1 ── ndh-be ────────────────────────────────────────────────
   Review 25 ticket → gen INTERFACE cho toàn bộ API
   Ghi vào api-contracts.ts + cột "Hợp đồng" của MAP
   KHÔNG viết thân hàm. Chỉ type + shape + mã lỗi.
                              │
                              ▼
LƯỢT 2 ── ndh-sa ────────────────────────────────────────────────
   Review kiến trúc mapping: đúng schema DB? đủ field nghiệp vụ?
   Ranh giới package? Mã lỗi đủ chưa?
   DUYỆT → 🔒 FREEZE INTERFACE
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
LƯỢT 3 ── ndh-fe ─────────────  ∥  ── LƯỢT 4 ── ndh-be ──────────
   Code ĐẦY ĐỦ UI/store/lỗi        Viết thân hàm 9 ticket BE
   Gọi fetch thật, chặn ở            + test tầng 1 (pgTAP)
   tầng mạng bằng mock trả           + test tầng 2 (integration)
   đúng shape interface                     │
              │                             ▼
              ▼                    Cột BE trong MAP → ✅
   Trạng thái: pending-be-testing
              │                             │
              └───────────────┬─────────────┘
                              ▼
LƯỢT 5 ── gỡ mock + ndh-qc ──────────────────────────────────────
   FE gỡ mock, trỏ route thật → E2E Playwright → ký done/
```

**Lượt 3 và lượt 4 chạy song song thật** — đây là chỗ tiết kiệm thời gian nhất.

### 1.3 Ba trạng thái mới của ticket FE

Ticket FE giờ có trạng thái trung gian, không chỉ `pending`/`process`/`done`:

| Trạng thái | Nghĩa | Ai chuyển |
|---|---|---|
| `process` | FE đang code theo interface + mock | `ndh-pm` |
| **`pending-be-testing`** | **FE code xong, mock chạy, chờ BE có route thật** | `ndh-fe` tự đánh dấu |
| `process` (lần 2) | Gỡ mock, trỏ route thật | `ndh-pm` khi ô BE ✅ |
| `done` | E2E xanh | **`ndh-qc` — độc quyền** |

`pending-be-testing` **không phải** `done`. Ticket vẫn nằm trong `process/`, chỉ
đánh dấu ở mục 8 để `ndh-pm` biết đang chờ gì.

---

## 2. LƯỢT 1 — `ndh-be` gen interface *(chạy đầu tiên, một mình)*

### Làm gì

Đọc 25 ticket → sinh **interface cho toàn bộ API** mà release này chạm tới.
**Không viết thân hàm.** Chỉ:

```
packages/core/src/api-contracts.ts    ← BE sở hữu, FE chỉ đọc
```

Mỗi endpoint khai đủ 4 thứ:

```ts
/** POST /api/admin/room-types — tạo hạng phòng mới. Quyền: price.edit */
export interface CreateRoomTypeRequest {
    name: I18nText              // BẮT BUỘC cả vi + en (luật R6)
    basePrice: number           // VNĐ nguyên, không thập phân
    capacity: { adults: number; children: number }
    // …
}

export interface CreateRoomTypeResponse {
    id: string                  // UUID, không phải slug
    // …
}

/** Mã lỗi FE phải xử lý riêng */
export type CreateRoomTypeError =
    | { code: 'VALIDATION_FAILED'; message: I18nText }   // 400
    | { code: 'FORBIDDEN';         message: I18nText }   // 403 — lễ tân
    | { code: 'DUPLICATE_NAME';    message: I18nText }   // 409
```

### Phạm vi — API nào phải khai

| Nhóm | Endpoint | Vì sao |
|---|---|---|
| **Mới hoàn toàn** | 4 nhóm danh mục (`390-01`) · `/lookup` (`390-03`) | Chưa tồn tại |
| **Đã có, FE sắp nối** | `/availability/search` (`390-05`) · `/cancel`, `/cancel/quote`, `/refund` (`390-07`) | FE cần shape để code |
| **Sắp đổi response** | `/admin/upload` (`430-01` thêm `srcSet`) | FE `430-02` cần biết trước |
| **Mới** | `/admin/outbox` (`420-03`) · `/admin/scan-id` (`440-04`) | Chưa tồn tại |

**Không cần khai**: route cron/webhook (FE không gọi).

### Ba luật của lượt 1

| # | Luật | Vì sao |
|:--:|---|---|
| 1 | **Đọc `information_schema.columns` TRƯỚC khi khai type** | Bẫy `42703 column does not exist` — MAP §3. Khai interface theo tưởng tượng rồi lượt 4 phát hiện DB khác là hỏng cả hai bên |
| 2 | **Giá trị enum bám DB, không bám TS** | `method` ∈ `bank-transfer\|card\|at-property\|momo` — **gạch ngang**. Bug này đã từng làm mọi lần duyệt cọc trả 500 |
| 3 | **Chạy 3 lệnh tự kiểm MAP §5** trước khi bắt đầu | Code là nguồn sự thật, MAP có chỗ ghi sai (§M10 nói cron chưa khai — thực tế đã khai) |

### Cập nhật MAP

Thêm cột **"Hợp đồng"** vào bảng module của `API_INTEGRATION_MAP.md`:

```
| API | Method | Hợp đồng | BE | FE | Ghi chú |
|---|:--:|:--:|:--:|:--:|---|
| /api/admin/room-types | POST | ✅ | 🔴 | 🔴 | interface đã khai, thân hàm chưa viết |
```

### Xong khi

- [ ] `api-contracts.ts` khai đủ endpoint ở bảng phạm vi trên
- [ ] Mỗi endpoint có: Request · Response · **mã lỗi + HTTP code** · quyền cần
- [ ] Mọi `I18nText` khai rõ **bắt buộc cả `vi` và `en`**
- [ ] Enum bám **giá trị DB thật**, đã đối chiếu `information_schema`
- [ ] 0 `any`
- [ ] Cột "Hợp đồng" trong MAP điền đủ
- [ ] **Chưa viết một dòng thân hàm nào** — đây là điều kiện, không phải gợi ý

---

## 3. LƯỢT 2 — `ndh-sa` review kiến trúc + FREEZE

### Review gì — 6 câu hỏi

| # | Câu hỏi | FAIL nếu |
|:--:|---|---|
| 1 | Type có khớp **schema DB thật** không? | Khai `roomTypeName` mà DB là `room_types.name` |
| 2 | Đủ field cho **nghiệp vụ** chưa? | `Booking` thiếu `depositAmount` — 4 con số tiền ở §B4 phải đủ |
| 3 | **Ranh giới package** đúng chưa? | Type nghiệp vụ lọt vào `packages/utils` (vi phạm R15) |
| 4 | **Mã lỗi đủ** cho FE xử lý chưa? | Chỉ có `ERROR` chung — FE không phân biệt được 401 (về login) với 403 (báo thiếu quyền) |
| 5 | **Song ngữ** khai bắt buộc chưa? | `message: string` thay vì `I18nText` |
| 6 | Có type nào **FE không dùng được** không? | Trả `Buffer`, `Date` object — FE cần chuỗi ISO |

### Freeze — nghĩa là gì

SA duyệt → `api-contracts.ts` **đóng băng**. Từ đó:

```
BE muốn đổi interface
   → mở ticket 900-*, ghi RÕ vì sao phải đổi
   → ndh-sa duyệt
   → sửa api-contracts.ts
   → FE typecheck ĐỎ NGAY  ← cơ chế bảo vệ tự động
   → FE sửa theo, ghi vào ticket
```

**Không được sửa lén.** Interface đổi lén là FE code theo bản cũ mà không biết,
đến lượt 5 mới vỡ — lúc đó sửa cả hai bên.

⚠️ **Vì sao freeze mà vẫn cho đổi**: nếu cấm hẳn thì khi interface sai về nghiệp
vụ (thiếu field DB bắt buộc), BE bị ép viết code sai. Freeze không phải cấm đổi —
là bắt **mọi lần đổi đều có vết và có người duyệt**.

### Xong khi

- [ ] 6 câu hỏi trên đều PASS, ghi kết luận từng câu
- [ ] Ghi rõ **"🔒 INTERFACE FROZEN — <ngày>"** vào đầu `api-contracts.ts`
- [ ] Lệch schema → trả về lượt 1, **không tự sửa**

---

## 4. LƯỢT 3 ∥ LƯỢT 4 — chạy song song

Đây là chỗ tiết kiệm thời gian nhất. Hai bên **không chạm file của nhau**.

### 4.1 LƯỢT 3 — `ndh-fe` code đầy đủ + mock

**Nguyên tắc: code như thể API đã có thật.**

```
UI · store · xử lý loading/error · 7 trạng thái · mobile · song ngữ
   ↓
fetch('/api/...')     ← gọi THẬT, không đổi thành hàm giả
   ↓
[ chặn ở TẦNG MẠNG bằng mock trả đúng shape interface ]
```

**Vì sao chặn ở tầng mạng, không mock ở tầng hàm**: mock tầng hàm thì lúc gỡ phải
sửa code. Chặn tầng mạng thì **gỡ mock là chạy** — không sửa một dòng nào.

**Mock phải trả đủ 3 loại kịch bản:**

| Kịch bản | Vì sao bắt buộc |
|---|---|
| Thành công | Đường hạnh phúc |
| **Mỗi mã lỗi trong interface** (400/401/403/409/422/429) | FE phải xử lý riêng từng cái (luật FE4). Không mock lỗi thì code xử lý lỗi **chưa bao giờ chạy** |
| **Chậm 3 giây** | Kiểm `loading` giữ nguyên kích thước, không nhảy layout |

**Xong lượt 3 khi** — ticket đánh dấu `pending-be-testing`:

- [ ] Code **đầy đủ**: UI, store, 7 trạng thái, mobile 375px, song ngữ
- [ ] Gọi `fetch` thật, mock chặn ở tầng mạng
- [ ] Mock có đủ 3 loại kịch bản trên
- [ ] `pnpm test:unit` (tầng 3) xanh
- [ ] `pnpm lint` + `typecheck` sạch, `build:safe` xanh 4 theme
- [ ] Ghi vào mục 8 ticket: **`pending-be-testing` — chờ endpoint nào**

### 4.2 LƯỢT 4 — `ndh-be` viết thân hàm + test

Làm theo [PLAN-BE.md](./PLAN-BE.md), 9 ticket, thứ tự:

```
400-01 → 400-02            hạ tầng test
   ├─ 390-01  API danh mục
   ├─ 390-03  /lookup
   ├─ 390-06  xác minh cron
   ├─ 430-01  Storage + srcset
   ├─ 420-01 → 420-02  outbox + adapter
   └─ 440-04  IdDocumentScanner
```

**Bắt buộc bám `api-contracts.ts` đã freeze.** Muốn đổi → ticket `900-*` qua SA.

**Xong mỗi ticket khi**: tầng 1 + tầng 2 xanh · **cột BE trong MAP → ✅ kèm bằng
chứng** · mục 9 ticket điền đủ.

---

## 5. LƯỢT 5 — Gỡ mock + E2E

### 5.1 FE gỡ mock

Điều kiện: **ô BE tương ứng trong MAP đã ✅**.

```
FE gỡ mock → trỏ route thật → chạy lại luồng
```

Nếu code lượt 3 làm đúng (mock chặn ở tầng mạng) thì đây là **xoá cấu hình mock**,
không sửa code sản phẩm.

**Ba thứ phải kiểm — mock không bắt được:**

| # | Kiểm | Vì sao mock không thấy |
|:--:|---|---|
| 1 | **Shape thật khớp interface** | Mock trả theo interface; route thật có thể lệch |
| 2 | **Độ trễ thật** | Mock 3s là giả định; mạng thật khác |
| 3 | **Lỗi thật** | Mock 409 là giả lập; DB trả 409 kèm payload có thể khác |

⚠️ **Lệch shape → mở `900-*`.** Không sửa FE để khớp route lệch, cũng không sửa
route để khớp FE — `ndh-sa` phân xử bằng `api-contracts.ts`.

### 5.2 `ndh-qc` chạy E2E

Mục tiêu **12/12 luồng có test** (hiện 5/12) — [TEST-STRATEGY §6](./TEST-STRATEGY.md).

Điều kiện vào cổng W8 (luật W8.1): `pending/` + `process/` **rỗng** (kiểm bằng
`ls`, **không tin bảng §9**) và `ndh-pm` đối soát KHỚP 100%.

**Chỉ `ndh-qc` được `git mv` sang `done/`** (luật W6.4).

---

## 6. Lệnh của chủ dự án

| Gõ | Em làm gì |
|---|---|
| `lượt 1` | `ndh-be` gen interface toàn bộ API → báo cáo |
| `lượt 2` | `ndh-sa` review kiến trúc → freeze hoặc trả về lượt 1 |
| `lượt 3+4` | Spawn `ndh-fe` ∥ `ndh-be` **song song** → báo cáo cuối mỗi đợt con |
| `lượt 5` | FE gỡ mock → `ndh-qc` E2E → ký `done/` |
| `tiếp` | Sang lượt kế tiếp |
| `tiến độ` | `ndh-pm` đối soát `ls` ↔ bảng §9 OVERVIEW |

Lượt 3+4 có 24 ticket nên chia đợt con, **dừng báo cáo cuối mỗi đợt** (đã chốt).

---

## 7. Luật vận hành

| # | Luật | Nguồn |
|:--:|---|---|
| 1 | **Interface freeze sau lượt 2** — đổi phải qua `900-*` + SA duyệt | Chốt 08/08 |
| 2 | Lượt 1 **không viết thân hàm**; lượt 3 **không sửa SQL/route** | Ranh giới §3.3 OVERVIEW |
| 3 | Mock chặn ở **tầng mạng**, không mock tầng hàm | §4.1 |
| 4 | `pending-be-testing` **không phải** `done` — ticket vẫn ở `process/` | §1.3 |
| 5 | Tối đa **3 ticket ở `process/`** mỗi workflow | R3 / W3 |
| 6 | **Chỉ `ndh-qc`** được `git mv` sang `done/` | W6.4 |
| 7 | Thiếu thông tin chủ dự án → **KHÔNG dừng**, ghi MANUAL.md, dùng fallback | W0b |
| 8 | Ngoại lệ luật 7: **`M29` chặn cứng `410-02`** — không có fallback an toàn | MANUAL Phần D |
| 9 | SA/QC trả về tối đa **2 vòng**; vòng 3 FAIL → dừng, báo chủ dự án | W1 |
| 10 | **Không `pnpm build`** khi dev server đang mở — dùng `build:safe` | C12 |

---

## 8. Rủi ro của mô hình này

Nói thẳng, vì mô hình nào cũng có giá:

| # | Rủi ro | Cách chặn |
|:--:|---|---|
| 1 | **Interface sai từ đầu → cả hai bên code sai** | Lượt 2 là cổng chặn duy nhất. SA phải đối chiếu `information_schema` thật, không duyệt bằng cảm tính |
| 2 | **FE code theo mock, route thật lệch** | Lượt 5 kiểm 3 thứ ở §5.1. Lệch → `900-*`, không bên nào tự chiều bên nào |
| 3 | **Mock quá "sạch"** — không có lỗi, không có độ trễ | §4.1 bắt buộc mock đủ 3 kịch bản, kể cả từng mã lỗi |
| 4 | Lượt 1 chậm → cả hai bên chờ | Lượt 1 chỉ khai type, **không code** — giữ nó nhẹ |
| 5 | BE đổi interface lén để nhanh | Freeze + typecheck đỏ ở FE. Đây là cơ chế **tự động**, không dựa vào kỷ luật |

---

## 9. Tiết kiệm token — 4 quyết định *(chốt 08/08/2026)*

Chi phí token của release **không nằm ở ticket**. Bóc tách một lượt agent:

| Thành phần | ~Token | % | Lặp lại |
|---|---:|---:|---|
| CLAUDE.md | 7.600 | 22% | Mọi agent — không tránh được |
| **PLAN của vai trò** | **10.000** | **29%** | **Mọi agent cùng vai trò** |
| Code agent đọc | 10.000–30.000 | 35% | Không tránh được |
| Agent definition | 1.700 | 5% | Đã tóm tắt luật sẵn — tốt |
| **Ticket** | **2.500** | **7%** | Khác nhau — phần việc thật |

**Ticket chỉ chiếm 7%.** Nên gộp ticket lại gần như không giảm được gì — chỗ tốn
là **PLAN bị đọc lại ở mọi agent**.

### Q1 — Tách PLAN-BRIEF *(giảm ~25%)*

| File | Ai đọc | Kích thước |
|---|---|---|
| `PLAN-BE.md` / `PLAN-FE.md` | **Chủ dự án** — có giải thích "vì sao" | 20–25k ký tự |
| **`PLAN-BE-BRIEF.md` / `PLAN-FE-BRIEF.md`** | **Agent** — bảng + cảnh báo + checklist | **~9–11k ký tự** |

Agent **chỉ đọc bản BRIEF**. Cần hiểu sâu một quyết định → mở bản đầy đủ, hiếm khi cần.

### Q2 — Bỏ SA review cho ticket FE thuần *(giảm ~15%)*

Luật W2 đã cho phép: ticket **chỉ đổi giao diện, không đụng cấu trúc dữ liệu, API,
hay ranh giới package** → chuỗi rút gọn:

```
ndh-fe → ndh-qc          (bỏ ndh-sa)
```

Áp dụng cho: `440-01` · `440-02` · `440-03` · `430-04`.
**KHÔNG áp dụng** cho ticket chạm API hoặc store dùng chung: `390-02`, `390-04`,
`390-05`, `390-07`, `430-02`, `430-03`, `420-03`, `410-*`.

Khi nghi ngờ → giữ SA review. Bỏ nhầm tốn hơn giữ thừa.

### Q3 — Cột `v` trong bảng mapping *(không giảm token, chặn lỗi)*

Xem [MAP §1](../release-v1.0.0/API_INTEGRATION_MAP.md). Interface đổi → tăng `v`;
FE ghi bản mình dùng. Lệch → ⚠️, `ndh-pm` báo ngay.

**Vì sao cần**: đổi *ý nghĩa* mà giữ nguyên *kiểu* (`amount` VNĐ → xu) thì
typecheck **xanh mà chạy sai**. Cột `v` bắt buộc FE đọc lại.

### Q4 — Luật viết ticket ngắn *(giảm ~4%)*

Ticket mới viết theo 4 luật này. Ticket đã có **không viết lại** — sửa khi có dịp
chạm vào.

| # | Luật | Vì sao |
|:--:|---|---|
| 1 | **Mục 1 (Bối cảnh) tối đa 6 dòng.** Chỉ ghi cái **riêng của ticket này**; bối cảnh chung đã có ở OVERVIEW | Đang chiếm 16%, phần lớn lặp OVERVIEW |
| 2 | **Không lặp lại luật đã có trong `.claude/rules/`** — dẫn mã luật là đủ: *"đủ 7 trạng thái (FE1)"* thay vì liệt kê 7 trạng thái | Agent đã biết luật qua definition |
| 3 | **AC viết thành bảng, mỗi dòng một câu.** Không đoạn văn | AC chiếm 30% — phần agent cần nhất, giữ nhưng nén |
| 4 | **Mục 4 (Luồng UI) chỉ vẽ khi bố cục MỚI.** Sửa màn có sẵn → mô tả bằng chữ | Sơ đồ ASCII tốn nhiều, giá trị thấp khi chỉ sửa |

**Không cắt**: mục 5 (AC) · mục 7 (Rủi ro) · các cảnh báo ⚠️. Đó là thứ giữ agent
khỏi làm sai — cắt đi thì tốn thêm vòng sửa, đắt hơn phần tiết kiệm được.

### Kết quả

| | Trước | Sau |
|---|---:|---:|
| Token/agent trung bình | ~35.000 | **~21.000** |
| Ước tính cả release | ~3.500.000 | **~2.100.000** |

Sai số ±40%, phụ thuộc nhiều nhất vào **số vòng sửa lỗi** — thứ không đoán trước được.

---

## 10. Giới hạn phải biết trước

| Điều | Thực tế |
|---|---|
| Agent chạy nền sau khi đóng máy | **Không.** Agent sống trong lượt hiện tại |
| 3 phiên chat độc lập do em tự tạo | **Không.** Chủ dự án tự mở cửa sổ nếu muốn |
| `ndh-be` ∥ `ndh-fe` song song thật ở lượt 3+4 | **Có.** Spawn cùng lúc, context riêng, không chờ nhau |
| Em nhớ tiến độ giữa các phiên | **Không.** Nguồn sự thật là thư mục `pending/process/done` + `api-contracts.ts` + MAP |

Vì luật cuối: **`git mv` ticket và cập nhật MAP là bắt buộc** — đó là bộ nhớ của
cả release, không phải thủ tục hình thức.
