# Chiến Lược Kiểm Thử v1.0.1 — Minh Bạch Ranh Giới Backend / Frontend

> Tài liệu này trả lời trực tiếp yêu cầu của chủ dự án ngày 08/08/2026:
> *"tôi có 2 việc cần yêu cầu minh bạch, backend và fe, tôi nghĩ nên test các
> case backend riêng biệt và test e2e ở fe sau khi integration có được ko?"*
>
> **Trả lời: được, và nên làm đúng như vậy.** Dưới đây là cách làm cụ thể.

Luật liên quan: [workflow.md §W8](../../../../../.claude/rules/workflow.md) ·
[backend.md](../../../../../.claude/rules/backend.md) ·
[frontend.md](../../../../../.claude/rules/frontend.md)

---

## 1. Vì sao phải tách — nói bằng con số, không bằng nguyên tắc

Repo hiện tại có **5 spec E2E Playwright** và **không có một dòng test backend
nào**. Nghĩa là mọi bug logic đều phải chờ E2E phát hiện. Hệ quả:

| Tình huống thật | Chỉ có E2E | Có tách tầng |
|---|---|---|
| `buildQuote()` tính sai đêm cuối | Suite E2E đỏ ở bước 5, log ghi *"expected 4.245.750 got 4.100.000"*. Không biết sai ở hàm nào, phải đọc ngược cả luồng | Integration test `/api/availability` đỏ trong **2 giây**, chỉ đúng dòng và đúng ngày sai |
| RLS cho khách xem đơn người khác bị hở | E2E **không phát hiện được** — vì E2E đăng nhập đúng vai và không thử vai sai | pgTAP đỏ ngay: `SET ROLE customer_b; SELECT ... → 0 rows` FAIL |
| 2 khách đặt phòng cuối cùng cùng lúc | Playwright rất khó dựng đúng race condition | pgTAP mở 2 transaction song song, assert đúng 1 thắng 1 nhận `409` |
| FE gọi sai tên field (`total` thay vì `totalAmount`) | E2E đỏ — **và đây là đúng việc của E2E** | Integration test **không** phát hiện được. Cần E2E |

Bảng trên là lý do tách: **ba dòng đầu E2E không làm được hoặc làm rất tệ; dòng
cuối chỉ E2E làm được.** Chúng giải bài toán khác nhau, không thay thế nhau.

---

## 2. Bốn tầng — ai viết, chạy khi nào, ai ký

```
┌───────────────────────────────────────────────────────────────────────────┐
│ TẦNG 1 — SQL / RPC test              pgTAP          Không cần Next        │
│   5 RPC lifecycle · RLS 5 vai trò · constraint overbooking đồng thời      │
│   Viết: ndh-be    Ký: ndh-sa    Chạy: cùng migration, mỗi lần đổi SQL    │
├───────────────────────────────────────────────────────────────────────────┤
│ TẦNG 2 — API integration test        Vitest         Không cần trình duyệt │
│   21 route · hợp đồng {success,data,error} · HTTP 400/401/403/404/409/422 │
│   Gọi THẬT vào Supabase local — không mock DB                            │
│   Viết: ndh-be    Ký: ndh-sa → ndh-qc    Chạy: mỗi ticket BE xong        │
├───────────────────────────────────────────────────────────────────────────┤
│ TẦNG 3 — FE unit / store test        Vitest + RTL   Không cần backend     │
│   Store Zustand · format tiền/ngày · component thuần · mock API           │
│   Viết: ndh-fe    Ký: ndh-fe tự chạy    Chạy: mỗi ticket FE xong         │
└───────────────────────────────────────────────────────────────────────────┘

        ══════ RANH GIỚI: ba tầng trên KHÔNG cần stack thật chạy ══════

┌───────────────────────────────────────────────────────────────────────────┐
│ TẦNG 4 — E2E Playwright              stack thật (dev server + Supabase)   │
│   MỤC ĐÍCH DUY NHẤT: chứng minh CÁC MẢNH NỐI ĐÚNG                        │
│   KHÔNG dùng để tìm bug logic — việc đó là của tầng 1-2                  │
│   Viết: ndh-qc    Ký: ndh-qc (ĐỘC QUYỀN, luật W6.4)                      │
│   Chạy: sau integration mỗi nhóm ticket + cổng W8 cuối release            │
└───────────────────────────────────────────────────────────────────────────┘
```

### Nguyên tắc phân bổ — một case chỉ nằm ở MỘT tầng

> **Nếu một case đã xanh ở tầng dưới, KHÔNG viết lại nó ở tầng trên.**

Test trùng lặp là nợ: một thay đổi hợp đồng làm đỏ 3 chỗ, phải sửa 3 chỗ, và
không chỗ nào nói rõ hơn chỗ nào.

| Case | Tầng đúng | Vì sao KHÔNG ở tầng khác |
|---|:---:|---|
| Tính giá 3 đêm có 1 đêm `priceOverride` | 2 | E2E biết được con số cuối nhưng không biết đêm nào sai |
| Khuyến mãi cộng dồn **nhân** (1tr × 0.9 × 0.8) | 2 | Cần assert từng bước trung gian — E2E chỉ thấy tổng |
| `discountTotal` không vượt `subtotal` | 2 | Là bất biến của hàm, không phải của màn hình |
| Lễ tân **không** sửa được giá (RBAC) | 2 | Cần thử 5 vai trò × N route = quá chậm nếu qua trình duyệt |
| Khách A không đọc được đơn của khách B | 1 | RLS ở tầng Postgres — HTTP không chạm tới |
| `checked_out` → `confirmed` bị chặn (422) | 1 | Bất biến của state machine trong PL/pgSQL |
| 2 request đồng thời, đúng 1 thắng | 1 | Cần 2 transaction song song thật |
| `cart.store` giữ giỏ khi qua login | 3 | Là logic của store, mock API là đủ |
| Format tiền `4.245.750đ` | 3 | Hàm thuần |
| Badge trạng thái **có chữ** không chỉ màu | 3 | Render component, không cần backend |
| **Khách đặt hết 5 bước → thấy mã đơn đúng trên `/my-orders`** | 4 | Đây đúng là "các mảnh nối đúng" |
| **Giỏ không mất sau khi đi qua `/login?next=`** | 4 | Xuyên qua middleware + store + route thật |
| **Mobile 375px: bước 3 không cuộn ngang, CTA ≥44px** | 4 | Cần viewport thật |

---

## 3. Ranh giới trách nhiệm BE / FE — điểm giao duy nhất

Đây là phần "minh bạch" chị yêu cầu.

| | `ndh-be` | `ndh-fe` |
|---|---|---|
| **Sở hữu** | `app/api/**`<br>`supabase/migrations/**`<br>`packages/core`<br>`src/lib/**` | `packages/theme-h3`<br>`app/admin/**`<br>`app/(client)/**`<br>`app/booking/**`<br>`src/stores/**`<br>`src/components/**` |
| **Test phải viết** | Tầng 1 + Tầng 2 | Tầng 3 |
| **Tuyệt đối không chạm** | `packages/theme-*`, bất cứ file có `className` | SQL, Route Handler, migration |
| **Bàn giao gì** | File hợp đồng `.d.ts` + **ví dụ response thật** (JSON đã chạy, không phải mô tả bằng lời) | Danh sách route đã gọi + payload thật đã gửi |

### Cổng bàn giao BE → FE *(chốt 08/08/2026)*

Bốn tầng test ở trên là **công cụ**; cổng dưới đây là **luật vận hành**. `ndh-be`
không được báo xong khi thiếu bất kỳ điều nào:

| # | Điều kiện | Kiểm bằng |
|:--:|---|---|
| **1** | **Tầng 1 (pgTAP) xanh** — nếu ticket chạm SQL/RPC | `pnpm test:sql` |
| **2** | **Tầng 2 (API integration) xanh**, có ≥1 negative test | `pnpm test:api` |
| **3** | **Cột BE trong [`API_INTEGRATION_MAP.md`](../release-v1.0.0/API_INTEGRATION_MAP.md) → ✅** kèm bằng chứng | Đọc MAP |
| **4** | **Mục 9 của ticket điền đủ**: endpoint, ví dụ response thật (JSON), mã lỗi FE cần xử lý | Đọc ticket |

`ndh-sa` gác cổng. `ndh-pm` **không được** chuyển ticket FE sang `process/` khi ô
BE tương ứng trong MAP chưa ✅.

⚠️ **Luật của MAP, giữ nguyên**: *"Không ghi ✅ nếu chưa chạy thử. Tài liệu sai
nguy hiểm hơn không có tài liệu, vì người sau tin rằng chỗ đó đã xong."* — bản đầu
của MAP từng ghi "ĐÃ NỐI & PASS 100%" cho check-in/check-out trong khi giao diện
chỉ ghi `localStorage`, bấm xong F5 là mất.

### Điểm giao: một file hợp đồng, không phải một cuộc họp

```
packages/core/src/api-contracts.ts     ← BE sở hữu, FE chỉ đọc
```

**Vì sao đây là cách đúng:** BE sửa hợp đồng → `pnpm typecheck` ở FE **đỏ ngay**,
không phải chờ E2E đỏ nửa tiếng sau. Đây là thứ đã cứu dự án một lần: bug
`chk_payments_method` (gạch ngang vs gạch dưới) ghi trong
[lib/payment/index.ts:11-19](../../../src/lib/payment/index.ts#L11-L19) — TypeScript
không kiểm được ràng buộc nằm trong Postgres, nên **build vẫn xanh** mà mọi lần
duyệt cọc đều trả 500. Tầng 1 (pgTAP) sẽ bắt đúng loại bug này.

### Khi hai bên không đồng ý

Không tranh luận trong chat. `ndh-sa` phân xử bằng **file hợp đồng**: bên nào
lệch khỏi `api-contracts.ts` thì bên đó sửa. Nếu bản thân hợp đồng sai → `ndh-sa`
sửa hợp đồng, **cả hai bên cùng sửa theo**, và mở ticket `900-*` ghi lại vì sao.

---

## 4. Lệnh — mỗi tầng chạy riêng, và một lệnh chạy hết

Ticket `400-04` bổ sung vào `apps/2026-thenamduhill/package.json`:

```bash
pnpm test:sql          # Tầng 1 — pgTAP, cần Supabase local
pnpm test:api          # Tầng 2 — Vitest, cần Supabase local
pnpm test:unit         # Tầng 3 — Vitest, không cần gì
pnpm test:e2e          # Tầng 4 — Playwright, cần dev server (ĐÃ CÓ)

pnpm test              # Tầng 1+2+3 — cổng bắt buộc trước mọi commit
pnpm test:all          # cả 4 tầng — cổng W8 cuối release
```

⚠️ `pnpm test:e2e` cần dev server đang chạy. **Không** chạy `pnpm build` cùng lúc
— cả hai ghi vào `.next/`, sẽ giết dev server và kẹt cổng 3000 (luật C12). Dùng
`pnpm build:safe`.

---

## 5. Luật viết test — kế thừa W8.3, thêm 3 điều

| # | Luật | Vì sao |
|---|---|---|
| 1 | Mỗi spec có `expect()` thật. **Cấm** spec chỉ chụp ảnh rồi kết luận PASS | Ảnh không phải assertion |
| 2 | Mỗi tầng có **≥1 negative test** | Đường hạnh phúc xanh không chứng minh gì về đường lỗi |
| 3 | Bắt `pageerror` + `console.error` ở E2E | Lỗi runtime im lặng là thứ build xanh không thấy |
| 4 | Test tự dọn dữ liệu mình tạo | Seed **không** idempotent — test phải chạy lại được nhiều lần |
| 5 | `e2e-out/`, `playwright-report/`, `coverage/` đã `.gitignore` | Không commit ảnh vào cây mã nguồn |
| **6** | **Test bám AC đã ký. Không nới AC để test dễ xanh** (luật W8.4.1) | Ngược lại là tự lừa mình |
| **7** | **`ndh-qc` không có quyền sửa code sản phẩm** để chiều test (luật W6.4) | Test FAIL → mở ticket `900-*` kèm triệu chứng tái hiện, **không** xoá/skip test |
| **8** | **Không mock cái mình đang test.** Tầng 2 gọi Supabase **thật** (local), không mock DB | Mock DB thì test chỉ chứng minh mock hoạt động |

---

## 6. Độ phủ — đo trên danh sách chức năng, không đo dòng code

Luật W8.3 yêu cầu ghi rõ **mẫu số**, không ghi "90%" trần.

### Tầng 1-2 (Backend) — 21 route + 5 RPC

| Nhóm | Số case tối thiểu | Trong đó negative |
|---|:---:|:---:|
| Tính giá từng đêm + khuyến mãi nhân dồn | 8 | 2 (`discountTotal > subtotal`, `maxDiscount` cắt trần) |
| Chống overbooking | 4 | 2 (2 request đồng thời, `version` không khớp) |
| Vòng đời đơn — không nhảy cóc | 10 | 4 (`checked_out`→`confirmed`, huỷ sau check-in…) |
| RBAC 5 vai trò | 12 | 5 (mỗi vai trò 1 case bị từ chối đúng) |
| RLS — khách chỉ đọc đơn của mình | 5 | 5 (toàn bộ là negative) |
| Auth · token hết hạn · phân biệt 401/403 | 6 | 4 |
| Cron release-holds · no-show | 4 | 1 |
| Upload ảnh · outbox | 4 | 2 (file SVG bị loại, quá `MAX_BYTES`) |
| **Tổng** | **53** | **25** |

### Tầng 4 (E2E) — luồng nghiệp vụ

| # | Luồng | Đã có? |
|:--:|---|:---:|
| 1 | Đặt phòng 5 bước hoàn chỉnh → mã đơn hiện ở `/my-orders` | ✅ `booking-lifecycle.spec.ts` |
| 2 | Giỏ không mất khi qua `/login?next=` | ⬜ bổ sung |
| 3 | CMS: duyệt cọc → `confirmed` → check-in → check-out | ✅ `booking-lifecycle.spec.ts` |
| 4 | CMS: quản lý hạng phòng | ✅ `admin-room-types.spec.ts` |
| 5 | Tra cứu đơn không cần đăng nhập (mã đơn + SĐT) | ⬜ bổ sung |
| 6 | Lễ tân đăng nhập → **không thấy** nút sửa giá | ⬜ bổ sung |
| 7 | Mobile 375px: bước 3 ≤5 field, ≥3 field autofill, CTA ≥44px | ⬜ bổ sung (`440-03`) |
| 8 | Upload ảnh trong CMS → ảnh hiện đúng `srcset` | ⬜ bổ sung (`430-02`) |
| 9 | Đặt đơn → đúng 1 dòng trong `integration_outbox` | ⬜ bổ sung (`420-01`) |
| 10 | JSON-LD `Hotel`/`HotelRoom` có mặt và parse được | ⬜ bổ sung (`410-01`) |
| 11 | Theme H3 render đủ section | ✅ `h3-theme.spec.ts` |
| 12 | Regression FE-100-02 / 100-04-05 | ✅ 2 spec |

**Mục tiêu v1.0.1: 12/12 luồng có test** *(hiện 5/12)*.

---

## 7. Thứ tự viết — logic trước, giao diện sau (W8.2)

Không đảo thứ tự này. Mỗi tầng dưới chỉ có nghĩa khi tầng trên đã xanh.

| # | Nhóm | Tầng | Vì sao ưu tiên |
|:--:|---|:---:|---|
| 1 | Tính giá từng đêm + khuyến mãi nhân dồn | 2 | Sai một đồng là sai mọi đơn |
| 2 | Chống overbooking (2 request đồng thời) | 1 | Bán trùng phòng không sửa được bằng lời xin lỗi |
| 3 | Vòng đời đơn — không nhảy cóc | 1 | Mọi chuyển đổi phải ghi `ActivityLog` |
| 4 | RBAC 5 vai trò + RLS | 1+2 | Lễ tân **không** sửa được giá |
| 5 | Store & format ở FE | 3 | Nền cho mọi màn hình |
| 6 | Đặt phòng 5 bước + giữ giỏ qua login | 4 | Luồng khách cuối |
| 7 | CMS check-in / check-out | 4 | Màn lễ tân dùng hằng ngày |
| 8 | Giao diện: mobile 375px, badge có chữ | 4 | Sau cùng |

---

## 8. Trả lời gọn câu hỏi của chị

> *"test các case backend riêng biệt và test e2e ở fe sau khi integration"*

Đúng, và cụ thể là:

1. **BE test riêng biệt** = tầng 1 (pgTAP) + tầng 2 (Vitest gọi thật vào Supabase
   local). Chạy **không cần trình duyệt, không cần FE**. 53 case, 25 negative.
2. **FE test riêng biệt** = tầng 3 (Vitest + Testing Library). Chạy **không cần
   backend**, mock API.
3. **E2E sau integration** = tầng 4. Chỉ chạy khi cả hai bên đã xanh tầng của
   mình. Mục đích duy nhất: chứng minh **các mảnh nối đúng**, không tìm bug logic.

**Một case chỉ nằm ở một tầng.** Đây là điều giữ cho suite không phình và không
nói dối.
