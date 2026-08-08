# Rules — Duy trì bản đồ API (FE ↔ BE)

Áp cho **mọi thay đổi** chạm tới `app/api/**`, `src/stores/**`, hoặc bất kỳ chỗ
nào gọi `fetch('/api/...')`.

File phải cập nhật:
[`apps/2026-thenamduhill/handover/tasks/release-v1.0.0/API_INTEGRATION_MAP.md`](../../apps/2026-thenamduhill/handover/tasks/release-v1.0.0/API_INTEGRATION_MAP.md)

Luật chung: [common.md](./common.md) · Backend: [backend.md](./backend.md) ·
Frontend: [frontend.md](./frontend.md)

---

## A0 — Vì sao có luật này

Bản đầu của bản đồ ghi **"ĐÃ NỐI & PASS 100%"** cho check-in / check-out /
cancel. Thực tế giao diện chỉ ghi vào `localStorage`: bấm xong F5 là mất, máy lễ
tân khác không thấy gì. Người đọc tài liệu tin rằng chỗ đó đã xong nên không ai
kiểm lại — bug sống sót qua nhiều đợt review.

> **Tài liệu sai nguy hiểm hơn không có tài liệu.**

Bản đồ này là **cầu nối FE ↔ BE**: nhìn hai cột trạng thái là biết module nào
còn lỗi và ai đang chặn ai. Nó chỉ có giá trị khi phản ánh đúng code thật.

---

## A1 — Khi nào BẮT BUỘC cập nhật

Cập nhật **trong cùng thay đổi**, không để lần sau:

| Việc vừa làm | Phải sửa gì trong bản đồ |
|---|---|
| Thêm/xoá một Route Handler | Thêm/xoá dòng API + cập nhật `§0` bảng điều khiển |
| Đổi method của route đã có | Cột `Method` |
| FE bắt đầu gọi một API | Cột `FE` + cột "FE gọi ở đâu" (đường dẫn **có số dòng**) |
| Gỡ FE khỏi một API (quay về store) | Hạ cột `FE` xuống 🔴 kèm lý do |
| Phát hiện một endpoint hỏng | Hạ cột `BE` xuống 🔴 + ghi **mã lỗi tái hiện được** |
| Sửa xong một endpoint hỏng | Nâng trạng thái **chỉ khi đã chạy thử** (xem A3) |
| Thêm màn CMS mới | Dòng mới ở module tương ứng, hoặc mở module mới |
| Ticket có chữ "nối API" trong phạm vi | Toàn bộ module liên quan |

⚠️ **Không có ngoại lệ "sửa nhỏ".** Thêm một route mà quên ghi thì lần sau có
người viết lại route thứ hai làm đúng việc đó.

---

## A2 — Hai cột trạng thái, không gộp làm một

Mỗi API có **hai** trạng thái độc lập. Gộp lại là mất đúng thông tin cần nhất:
*backend xong rồi mà frontend chưa nối* — trường hợp phổ biến nhất.

### Cột `BE`

| | Nghĩa |
|:--:|---|
| ✅ `done` | Route chạy đúng, **đã gọi thử thật** |
| 🟡 `process` | Route tồn tại nhưng chưa chạy được đầu-cuối (thiếu migration, thiếu cấu hình, chưa test) |
| 🔴 `error` | Gọi vào là lỗi, **hoặc chưa có route** |

### Cột `FE`

| | Nghĩa |
|:--:|---|
| ✅ `done` | Giao diện gọi thật, đã đi lại luồng |
| 🟡 `process` | Nối dở, hoặc chỉ một phần màn dùng |
| 🔴 `error` | Gọi nhưng lỗi, **hoặc còn dùng store cục bộ** |
| `—` | Không cần FE (cron, webhook) |

**Còn dùng store cục bộ = 🔴, không phải ✅.** Màn hình chạy được trên máy đang
mở nhưng dữ liệu không lên server thì đó là lỗi, không phải "xong".

---

## A3 — Điều kiện để ghi ✅

Ghi ✅ chỉ khi có **một** trong hai bằng chứng:

1. **E2E xanh** phủ đúng luồng đó — ghi tên file spec vào `§4`
2. **Đã tự tay chạy thử** và ghi lại kết quả (mã HTTP, dữ liệu đọc lại từ server)

Không đủ để ghi ✅:

| Không đủ | Vì sao |
|---|---|
| Build xanh | Bốn bẫy ở `§3` của bản đồ đều build xanh rồi mới nổ lúc chạy |
| Typecheck sạch | TypeScript không kiểm được CHECK constraint trong Postgres |
| "Đọc code thấy đúng" | Migration chưa chạy thì code đúng vẫn 500 |
| Badge trên UI đổi | Đúng bug M4: badge đổi mà server không đổi |

**Với thay đổi trạng thái đơn**: bằng chứng phải là **đọc lại từ server**
(`GET /api/bookings`), không phải nhìn giao diện.

---

## A4 — Mỗi dòng phải trả lời "vì sao ở đó"

Bảng liệt kê là chưa đủ. Mỗi module cần một khối giải thích khi có quyết định
không hiển nhiên:

- **Vì sao endpoint này tồn tại** (nếu không rõ từ tên)
- **Vì sao đặt ở tầng này** chứ không tầng khác
- **Bug nào đã dẫn tới thiết kế hiện tại** — phần giá trị nhất, giữ người sau
  khỏi "sửa" lại thành bản cũ

Viết theo mẫu:

```markdown
**Vì sao dùng admin client, không dựa RLS**: bảng `bookings` có đúng một policy
SELECT `customer_id = current_account_id()`. Nhân viên đăng nhập bằng JWT tự phát
hành nên hàm đó rỗng ⇒ lễ tân nhận `[]` dù DB có 44 đơn, HTTP vẫn `200` nên
không có lỗi để đọc.
```

Nêu **triệu chứng quan sát được**, không nêu cảm nhận.

---

## A5 — Ghi nợ kỹ thuật ngay tại chỗ, không giấu

Phát hiện lỗi ngoài phạm vi đang làm thì **vẫn ghi vào bản đồ**, kèm:

1. Mã lỗi / triệu chứng **tái hiện được**
2. Lỗi có từ trước hay do thay đổi này
3. Hướng sửa đúng (một câu)
4. Ảnh hưởng thực tế với người dùng

```markdown
**Lỗi tái hiện được**: `/lookup` gọi `GET /api/bookings?code=&phone=`, route đó
bọc `withAuthGuard` nên trả `401` cho khách chưa đăng nhập. Đã đo bằng `curl`
không cookie. Lỗi **có từ trước**, không do đợt sửa nào gần đây.

**Cách sửa đúng**: route công khai riêng, bắt buộc đủ cả hai `code` + `phone`.
```

Không tự ý mở rộng phạm vi để sửa — ghi nợ rồi báo chủ dự án quyết.

---

## A6 — Ba lệnh tự kiểm là nguồn sự thật

Trước khi sửa bảng, chạy ba lệnh trong `§5` của bản đồ:

```bash
cd apps/2026-thenamduhill

# 1. Endpoint nào THẬT SỰ tồn tại + method
for f in $(find src/app/api -name route.ts); do
  ep=$(echo $f | sed 's|src/app||;s|/route.ts||')
  v=$(grep -oE "export (const|async function) (GET|POST|PATCH|PUT|DELETE)" $f \
      | grep -oE "GET|POST|PATCH|PUT|DELETE" | sort -u | tr '\n' ',')
  echo "$v $ep"
done | sort -k2

# 2. FE gọi endpoint nào, từ file nào — KHÔNG nằm đây = đang dùng store
grep -rn "fetch(['\`]/api" src --include="*.ts" --include="*.tsx" | grep -v "src/app/api/"

# 3. Migration đã áp đủ chưa — MCP Supabase `list_migrations` so với supabase/migrations/
```

**Bảng lệch với lệnh thì sửa bảng, không sửa lệnh.**

Lệnh 2 đặc biệt quan trọng: một màn không xuất hiện trong kết quả nghĩa là nó
**đang đọc store cục bộ**, dù tài liệu có ghi gì đi nữa.

---

## A7 — Cập nhật `§0` bảng điều khiển cùng lúc

Sửa một dòng API mà quên `§0` thì bảng tổng và chi tiết nói hai chuyện khác nhau.

Phải khớp:

- Số `Tổng API`, `BE ✅`, `FE ✅` của module
- Cột `Còn lỗi` — nêu ngắn gọn việc đang chặn
- Bảng **"Ba việc chặn nặng nhất"** — sắp lại theo mức ảnh hưởng với người dùng
  cuối, không theo độ khó kỹ thuật

---

## A8 — Ghi nhật ký thay đổi

Thêm một dòng vào `§6` mỗi lần cập nhật:

```markdown
| 08/08/2026 | Nối API vòng đời đơn (M4). Thêm `GET /api/room-units` (M6). Phát hiện M11 (`/lookup` 401). Sửa lại cột trạng thái — bản trước ghi ✅ cho màn chưa nối. |
```

Ghi **việc đã làm và phát hiện được**, không ghi "cập nhật tài liệu".

---

## A9 — Điều không được làm

| # | |
|---|---|
| 1 | **Không ghi ✅ khi chưa chạy thử.** Build xanh không phải bằng chứng. |
| 2 | **Không gộp hai cột BE/FE** thành một cột "trạng thái". |
| 3 | **Không xoá dòng nợ kỹ thuật** khi chưa sửa xong — kể cả khi nó ngoài phạm vi. |
| 4 | **Không ghi đường dẫn file không có số dòng** ở cột "FE gọi ở đâu" — người sau phải `grep` lại. |
| 5 | **Không sửa bảng mà không chạy ba lệnh ở A6.** |
| 6 | **Không để `§0` lệch với bảng chi tiết.** |

---

## Tự kiểm trước khi báo xong

- [ ] Đã chạy ba lệnh ở A6, bảng khớp kết quả
- [ ] Mọi ✅ đều có bằng chứng theo A3 (E2E xanh hoặc kết quả chạy thử)
- [ ] Màn còn dùng store cục bộ đã ghi 🔴, không ghi ✅
- [ ] Quyết định không hiển nhiên đã có khối "vì sao" (A4)
- [ ] Lỗi phát hiện ngoài phạm vi đã ghi nợ (A5), không giấu
- [ ] `§0` bảng điều khiển khớp với bảng chi tiết
- [ ] `§6` có dòng nhật ký mới
