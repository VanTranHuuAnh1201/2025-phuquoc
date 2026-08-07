# Rules — Workflow tự động 5 vai trò

Quy trình chạy **tự động qua nhiều vai trò**, chỉ dừng lại ở cuối để chủ dự án
review. Không hỏi ý kiến giữa chừng.

Agent: `ndh-runner` (Orchestrator) · `ndh-pm` · `ndh-ba` · `ndh-sa` · `ndh-be` · `ndh-fe` · `ndh-qc`

---

## W0 — Nguyên tắc gốc

> **Mỗi lượt yêu cầu đi qua đủ chuỗi vai trò rồi mới trả kết quả.**
> Vai trò sau verify vai trò trước. Không dừng lại xin xác nhận giữa chừng.

---

## W0b — Quy tắc Không Dừng Workflow (MANUAL.md Protocol)

Khi trong quá trình làm việc cần thông tin thủ công từ người dùng hoặc phía khách hàng (VD: Số tài khoản ngân hàng thật, Bộ ảnh HD thật, Đăng ký merchant cổng thanh toán, Cấu hình DNS domain, SendGrid API Keys...):

1. **TUYỆT ĐỐI KHÔNG DỪNG WORKFLOW HAY CHỜ PENDING.**
2. Ghi chi tiết hạng mục vào file `handover/tasks/<release>/MANUAL.md` theo cấu trúc:
   - **Hạng mục yêu cầu (Requirement)**: Tên hành động/thông tin cần người dùng cấp.
   - **Vị trí đang dùng (Location)**: Tên file/DB table/Component đang sử dụng.
   - **Giá trị mặc định tạm thời (Default/Recommended Fallback)**: Giá trị mẫu đang dùng để chạy code.
   - **Lý do (Reason)**: Vì sao cần thông tin thực tế bổ sung sau.
3. **Lập tức tiếp tục quy trình** bằng cách sử dụng giá trị mặc định / khuyên dùng (Default / Recommended) để toàn bộ chain Agent (BA ➔ SA ➔ BE/FE ➔ QC ➔ PM) chạy liên tục đến `done/`.
---

## W0c — Lệnh Thực Thi Một Dòng (`run-plan` Command)

Khi người dùng nhập câu lệnh có định dạng:
- `run-plan apps\2026-thenamduhill\handover\tasks\release-v1.0.0`
- hoặc `Thực thi release-v1.0.0`

**HỆ THỐNG SẼ TỰ ĐỘNG THỰC THI TOÀN BỘ CHUỖI:**

1. Kích hoạt **`ndh-pm`** kiểm tra thư mục `handover/tasks/<release>/`.
2. Đọc toàn bộ danh sách ticket từ `pending/` (hoặc tạo sinh tự động nếu chưa đủ 19 ticket theo `OVERVIEW.md`).
3. Lần lượt chạy chuỗi vô lặp qua các vai trò:
   - **`ndh-sa`**: Điền mục 6 Kỹ thuật.
   - **`ndh-pm`**: `git mv` sang `process/`.
   - **`ndh-be` / `ndh-fe`**: Viết code, tự test lint/typecheck.
   - **`ndh-sa`**: Review code.
   - **`ndh-qc`**: Test thực tế, điền mục 8 & `git mv` sang `done/`.
   - **`ndh-pm`**: Báo cáo bảng tiến độ §5 `OVERVIEW.md`.
4. Nếu gặp thông tin cần cấp thủ công ➔ tự động áp dụng **`MANUAL.md Protocol`** (ghi nợ & dùng fallback) để chạy **xuyên suốt 100% đến khi hoàn thành toàn bộ release**.

---

## W1 — Chuỗi chuẩn: thêm tính năng mới

```
Yêu cầu của chủ dự án
   │
   ▼
① ndh-ba    viết ticket → pending/
   │        (bối cảnh, phạm vi, dữ liệu vào/ra, tiêu chí chấp nhận)
   ▼
② ndh-sa    duyệt kỹ thuật, điền mục 6
   │        TRẢ VỀ ① nếu ticket thiếu thông tin
   ▼
③ ndh-pm    kiểm phụ thuộc + số ticket ở process/ → chuyển process/
   │        DỪNG nếu ticket phụ thuộc chưa done/
   ▼
④ ndh-be / ndh-fe   viết code, tự kiểm lint/typecheck/build
   │        (song song được nếu ticket độc lập)
   ▼
⑤ ndh-sa    review code
   │        TRẢ VỀ ④ nếu có vi phạm — kèm danh sách phải sửa
   ▼
⑥ ndh-qc    verify DoD, tự tay đi lại luồng, thử ít nhất 1 trường hợp lỗi
   │        TRẢ VỀ ④ nếu FAIL — kèm lý do
   ▼
⑦ ndh-pm    cập nhật OVERVIEW §7, báo cáo tổng
   │
   ▼
Chủ dự án review kết quả cuối
```

**Vòng lặp sửa lỗi**: ⑤ hoặc ⑥ trả về ④ thì tự chạy lại, **tối đa 2 vòng**. Vòng
thứ 3 vẫn FAIL → dừng, báo chủ dự án kèm phân tích vì sao không qua được.

---

## W2 — Chuỗi rút gọn theo loại việc

### Sửa lỗi (bug)

```
ndh-ba (ticket 900-*)  →  ndh-be/fe (tái hiện + sửa)  →  ndh-sa (review)  →  ndh-qc (verify)
```

Bỏ bước `ndh-pm` duyệt thứ tự — bug luôn ưu tiên cao nhất.

⚠️ Ticket `900-*` **bắt buộc xuất phát từ triệu chứng tái hiện được**, không
suy đoán từ đọc code tĩnh.

### Chỉnh giao diện nhỏ (đổi chữ, đổi khoảng cách)

```
ndh-fe (sửa)  →  ndh-qc (verify)
```

Không cần SA duyệt nếu **không đụng** cấu trúc dữ liệu, API, hay ranh giới package.

### Câu hỏi kiến trúc

```
ndh-sa (phân tích + khuyến nghị)  →  báo chủ dự án
```

Không tạo ticket, không viết code.

### Rà soát tiến độ

```
ndh-pm (đối soát thư mục ↔ OVERVIEW §7)  →  báo cáo
```

---

## W3 — Chạy song song

Được chạy song song khi ticket **không phụ thuộc nhau**:

```
✅ ndh-be làm 200-02 (API tính giá)   ║   ndh-fe làm 100-03 (màn trả phòng)
✅ ndh-ba viết 200-05, 200-06, 200-07 cùng lúc

❌ ndh-fe nối API khi ndh-be chưa xong API đó
❌ ndh-qc verify khi ndh-sa chưa review
```

Giới hạn: **tối đa 3 ticket ở `process/`** cùng lúc.

---

## W4 — Bàn giao giữa các vai trò

Mỗi lần chuyển vai trò phải mang theo đủ ngữ cảnh:

| Từ → Đến | Bàn giao gì |
|---|---|
| `ba` → `sa` | Đường dẫn ticket + điểm cần SA quyết |
| `sa` → `pm` | Ticket đã điền mục 6 + danh sách phụ thuộc |
| `pm` → `be/fe` | Đường dẫn ticket ở `process/` + thứ tự ưu tiên |
| `be/fe` → `sa` | File đã sửa + kết quả lint/typecheck + lệnh đã chạy thử |
| `sa` → `qc` | Kết luận DUYỆT + điểm cần QC kiểm kỹ |
| `qc` → `pm` | Kết quả PASS/FAIL từng tiêu chí + đã chuyển `done/` hay chưa |

---

## W5 — Báo cáo cuối cho chủ dự án

Sau khi chuỗi chạy xong, gom thành một báo cáo:

```markdown
## Đã hoàn thành
- <mã ticket> — <tên>  →  done/
  Ai làm: ndh-be · QC: N/M tiêu chí PASS

## Thay đổi kỹ thuật đáng chú ý
- <quyết định SA đã chốt và lý do>

## Đang chặn
- <mã> chờ <điều kiện>

## Khuyến nghị
- <việc nên làm tiếp và vì sao>

## Cần chủ dự án quyết
- <chỉ liệt kê nếu rơi vào 3 trường hợp ở W0>
```

Báo cáo **không quá 30 dòng**. Chi tiết nằm trong ticket, không lặp lại.

---

## W6 — Điều không được làm

| # | |
|---|---|
| 1 | **Không dừng giữa chừng hỏi "có nên làm tiếp không".** Đã giao thì làm hết chuỗi. |
| 2 | **Không bỏ bước verify** để nhanh hơn. QC không ký thì ticket không `done/`. |
| 3 | **Không tự nới DoD.** Không đạt là FAIL. |
| 4 | **Không để agent tự đánh giá kết quả của chính mình.** BE viết thì SA review, QC verify. |
| 5 | **Không đưa ticket vào `process/`** khi phụ thuộc chưa xong. |
| 6 | **Không sửa ticket đã ở `done/`.** Phát sinh thì mở ticket mới. |

---

## W7 — Định nghĩa "một lượt xong"

Một lượt yêu cầu coi là xong khi:

- [ ] Chuỗi vai trò đã chạy đủ, không bỏ bước
- [ ] `ndh-qc` đã ký hoặc đã ghi rõ FAIL kèm lý do
- [ ] `OVERVIEW.md §7` khớp với thư mục thật
- [ ] Báo cáo cuối theo mẫu W5
- [ ] Nếu có FAIL sau 2 vòng sửa → đã phân tích nguyên nhân, không im lặng

---

## W8 — Setup Test E2E Playwright Sau Khi Hoàn Thành Release v1.0.0

Khi tất cả các ticket thuộc bản release `v1.0.0` được hoàn thành và nghiệm thu (di chuyển 100% ticket sang `done/`), tự động kích hoạt vai trò `qc_lead` / `ndh-qc` để thực hiện setup bộ kiểm thử tự động E2E bằng **Playwright**:
- Đạt độ phủ **≥ 90%** trên các chức năng chính.
- Ưu tiên tập trung test **luồng logic nghiệp vụ** trước (Đặt phòng 5 bước, Tìm kiếm & tính giá, Quản lý trạng thái đơn CMS, Check-in/Check-out, Phân quyền RBAC, Chống overbooking).

### W8.1 — Điều kiện kích hoạt (không mơ hồ)

Chỉ kích hoạt khi **cả hai** đúng:

1. `pending/` và `process/` của release đó **rỗng** — kiểm bằng `ls`, không tin bảng §5 `OVERVIEW.md`.
2. `ndh-pm` đã đối soát thư mục thật ↔ `OVERVIEW.md §5` và ghi nhận **KHỚP 100%**.

Thiếu một trong hai → **chưa chạy W8**, tiếp tục dây chuyền W1 cho ticket còn lại.

### W8.2 — Thứ tự viết test (logic trước, giao diện sau)

Viết theo đúng thứ tự này, **không đảo**: mỗi tầng dưới chỉ có nghĩa khi tầng trên đã xanh.

| # | Nhóm | Vì sao ưu tiên |
|:--:|---|---|
| 1 | Tính giá từng đêm + khuyến mãi cộng dồn **nhân** | Sai một đồng là sai mọi đơn. Đối chiếu §B4 |
| 2 | Chống overbooking (2 request đồng thời) | Bán trùng phòng là lỗi không sửa được bằng lời xin lỗi |
| 3 | Vòng đời đơn — không nhảy cóc trạng thái | Đồ thị §B1, mọi chuyển đổi ghi `ActivityLog` |
| 4 | Phân quyền RBAC 5 vai trò | Lễ tân **không** sửa được giá (§B8) |
| 5 | Đặt phòng 5 bước + giữ giỏ qua login | Luồng khách cuối, §F2 |
| 6 | CMS check-in / check-out | Màn lễ tân dùng hằng ngày |
| 7 | Giao diện: mobile 375px không cuộn ngang, badge có chữ | Sau cùng — §F6 |

### W8.3 — Test phải chứng minh được, không chỉ chạy xanh

| Luật | |
|---|---|
| Mỗi spec có `expect()` thật | **Cấm** spec chỉ chụp ảnh rồi kết luận PASS |
| Mỗi nhóm ở W8.2 có **≥1 negative test** | Đường hạnh phúc xanh không chứng minh gì về đường lỗi |
| Bắt `pageerror` + `console.error` | Lỗi runtime im lặng là thứ build xanh không thấy |
| Test chạy lại được nhiều lần | Seed **không idempotent** (R7) — test tự dọn dữ liệu mình tạo |
| Ảnh chụp | `e2e-out/`, `playwright-report/` **đã `.gitignore`** — không commit vào cây mã nguồn |

Con số **≥90%** đo trên **danh sách chức năng chính ở W8.2**, không phải line coverage
của trình bao phủ mã. Ghi rõ mẫu số: *"27/29 luồng nghiệp vụ có test"*, không ghi "90%" trần.

### W8.4 — Không được làm

| # | |
|---|---|
| 1 | **Không nới DoD của ticket** để test dễ xanh. Test bám AC đã ký, không ngược lại |
| 2 | **Không sửa code sản phẩm** để chiều test — QC không có quyền sửa code (W6.4) |
| 3 | **Không chạy `pnpm build`** khi dev server đang mở — dùng `build:safe` (C12) |
| 4 | Test FAIL → mở ticket `900-*` kèm triệu chứng tái hiện, **không** xoá/skip test |

