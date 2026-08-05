# Thêm một domain mới

> Đọc file này khi có sản phẩm thuộc **ngành khác** — không phải thêm giao diện
> cho sản phẩm đã có. Thêm giao diện mới thì xem [CLAUDE.md §4](../../CLAUDE.md).

---

## 0. Phân biệt trước: domain hay theme?

Đây là câu hỏi đầu tiên, và trả lời sai thì làm sai cả tuần.

| Câu hỏi | Nếu ĐÚNG |
|---|---|
| Cùng nghiệp vụ, chỉ khác cách trình bày? | **Theme mới** — `packages/theme-hN/` |
| Khác nghiệp vụ (đặt phòng → bán khoá học)? | **Domain mới** — `packages/domain-<tên>/` |
| Cùng nghiệp vụ nhưng khách hàng khác? | **Chỉ đổi dữ liệu** — thêm seed trong domain sẵn có |

Phép thử nhanh: *"`RoomType`, `Inventory`, `RatePlan` có nghĩa gì với sản phẩm
này không?"* Không có nghĩa → domain mới.

---

## 1. Luồng làm việc

```
① Kickoff        →  bạn mô tả domain, Claude hỏi lại phần chưa rõ
② Scaffold       →  /new-domain <tên>  sinh khung package
③ Mô hình dữ liệu →  type + repository, chưa có giao diện
④ Trang nghiệp vụ →  các trang riêng của ngành
⑤ Theme đầu tiên →  /directions rồi /build-themes
```

Bước ① và ③ là nơi bạn tham gia. Bước ② ④ ⑤ Claude làm, bạn duyệt kết quả.

---

## 2. Prompt kickoff — copy rồi điền

Không cần viết dài. Bốn dòng dưới đây là đủ để bắt đầu:

```
Thêm domain mới: <tên ngắn, không dấu — ví dụ "clinic", "saas", "restaurant">

Sản phẩm bán gì:      <một câu>
Khách cuối là ai:     <một câu>
Hành động chính:      <việc mà mọi thứ khác phục vụ — "đặt lịch khám",
                       "mua gói cước", "đặt bàn">
Website tham chiếu:   <URL nếu có — hoặc "chưa có">
```

Claude sẽ hỏi lại những gì còn thiếu, **không tự bịa** (theo luật K0 trong
[premium-quality-gate.md](../../.claude/rules/premium-quality-gate.md)).

### Ví dụ đã điền

```
Thêm domain mới: clinic

Sản phẩm bán gì:      phần mềm đặt lịch khám cho phòng khám tư
Khách cuối là ai:     bệnh nhân đặt lịch online, và lễ tân xếp lịch
Hành động chính:      đặt lịch khám với một bác sĩ vào một khung giờ
Website tham chiếu:   chưa có
```

---

## 3. Cái gì dùng lại được, cái gì phải viết mới

Đây là lý do kiến trúc chia ba tầng. Số liệu thực tế từ domain đầu tiên:

| Tầng | Dùng lại? | Nội dung |
|---|---|---|
| `utils` | ✅ **100%** | `pick()`, `formatPrice()`, `formatDate()`, `readEnv()` |
| `ui` | ✅ **100%** | Button, Modal, Field, DataTable, Toolbar, Badge, Accordion |
| `ui-layout` | ✅ **100%** | Header, Hero, Breadcrumbs, Footer, PageBody |
| `styling-*` | ✅ **100%** | Cầu nối token cho Tailwind / CSS thuần |
| `core` | ❌ | Nghiệp vụ lưu trú — không liên quan |
| `domain-hotel` | ❌ | Trang của ngành lưu trú |
| `theme-h*` | ❌ | Style của resort |

**Ước lượng: tái dùng ~2.500–3.000 dòng.** Bạn chỉ viết phần nghiệp vụ.

Nếu trong lúc làm phát hiện một thứ ở `domain-hotel` mà domain mới cũng cần —
**đừng import chéo** (cấm bởi R1). Đẩy nó lên tầng nền sau khi gột sạch từ vựng
ngành, hoặc chấp nhận viết lại nếu chỉ giống bề ngoài.

---

## 4. Khung package sinh ra

`/new-domain clinic` tạo:

```
packages/domain-clinic/
  package.json          deps: core?, ui, ui-layout, utils
  tsconfig.json
  src/
    index.ts            barrel, có docblock giải thích ranh giới
    types.ts            type nghiệp vụ của ngành
    repository.ts       hàm đọc dữ liệu, async sẵn từ đầu
    strings.ts          chuỗi song ngữ {vi, en} của ngành
    shell-adapter.ts    dịch dữ liệu → prop của ui-layout
    pages/              trang nghiệp vụ
```

`shell-adapter.ts` là mảnh quan trọng nhất — nó là **chỗ duy nhất** biết cả dữ
liệu của bạn lẫn hợp đồng của tầng nền. Xem
[`packages/domain-hotel/src/shell-adapter.ts`](../../packages/domain-hotel/src/shell-adapter.ts)
làm mẫu.

---

## 5. Luật phải tuân thủ

Không có ngoại lệ cho domain mới:

| Luật | Nội dung |
|---|---|
| **R1** | `domain-a` **không** import `domain-b` — cùng lý do hai theme không import nhau |
| **R6** | Mọi chuỗi khách thấy đều `{vi, en}` |
| **R8** | Một nguồn sự thật — theme đọc qua repository, không tự khai dữ liệu |
| **R13** | Theme không gọi thẳng repository, phải qua props/hook |
| **R15** | Đừng nhét khái niệm ngành của bạn vào tầng nền |

Kiểm trước khi báo xong:

```bash
pnpm build          # cả N app phải xanh
pnpm lint
```

---

## 6. Sau khi có domain — làm giao diện

Domain xong mới tới giao diện. Ba lệnh, hai điểm bạn duyệt:

```
/research <khách>     nghiên cứu + brief      ⛔ bạn duyệt brief
/directions <khách>   N hướng thiết kế         ⛔ bạn chọn hướng
/build-themes <khách> dựng theme, hub tự hiện
```

Chi tiết ở [CLAUDE-GUIDE.md](./CLAUDE-GUIDE.md).
