---
description: Nghiên cứu khách hàng → brief + blueprint. Dừng lại để user duyệt.
argument-hint: <tên-khách> (khớp tên file trong resources/docs/briefs/)
---

Chạy toàn bộ giai đoạn nghiên cứu cho khách `$1`, xuất brief để user duyệt.

## Đây là CỔNG 1 — kết thúc bằng việc dừng lại chờ user

Lệnh này **không** dựng theme. Nó dừng ở brief. Lý do: định vị sản phẩm là
quyết định của người trả tiền, không phải của AI.

## Trình tự

### ① Đọc bối cảnh đã có

- `resources/docs/briefs/$1.md` — nếu đã có, đọc để **không hỏi lại** những gì
  đã ghi (nguyên tắc CLAUDE.md)
- `resources/docs/briefs/_template.md` — nếu chưa có brief thì đây là khuôn
- `.claude/rules/premium-quality-gate.md` §K0 — giao thức hỏi trước khi phác thảo

### ② Bóc tách mẫu khách gửi

Nếu brief có URL website:

- **Website hiện tại của khách** = *hợp đồng chức năng*. Chạy agent
  `website-teardown`, xuất parity checklist — bản làm lại phải đủ chức năng
  như nó.
- **Website recommend** = *tham chiếu thẩm mỹ*, không phải chức năng.

Không rõ URL nào đóng vai nào → **hỏi user**, không đoán.

Review/comment của khách hàng cuối **không crawl** — social proof chỉ lấy từ tư
liệu khách cung cấp, không bịa số liệu (luật K0.0).

### ③ Phân tích tâm thế

Chạy agent `customer-mindset`: nỗi đau của người mua (chủ cơ sở) và người dùng
cuối, điều gì khiến họ **không** tin / **không** mua.

### ④ Hỏi 5 câu K0

Dùng AskUserQuestion. Câu nào đã có câu trả lời trong brief hoặc teardown thì
**bỏ qua**:

| # | Hỏi gì |
|---|---|
| Q1 | Design direction: editorial / dark-luxury / tropical-minimal…? |
| Q2 | Nguồn ảnh: đã có ảnh chụp thật chưa? |
| Q3 | Nội dung thật đã có bản chính thức chưa? |
| Q4 | Mức độ chuyển động: tĩnh sang trọng hay có scroll effect? |
| Q5 | Có brand asset bắt buộc tôn trọng không? |

### ⑤ Chốt positioning — HỘI TỤ VỀ MỘT

Đây là chỗ dễ làm sai nhất.

Nếu sản phẩm có thể định vị nhiều cách (ví dụ *booking hotel* vs *travel
resort*): **chọn ĐÚNG MỘT** dựa trên tài liệu và mục tiêu khách, làm cho tốt
nhất. Phương án còn lại ghi vào mục **"Pending"** của brief kèm lý do chưa
chọn — để dành, không làm song song.

Ngược lại với Design Direction ở bước sau: positioning **hội tụ**, direction
**phân kỳ**.

### ⑥ Xuất tài liệu

- `resources/docs/briefs/$1.md` — cập nhật, có mục "Positioning đã chọn +
  phương án pending"
- `resources/docs/briefs/$1-blueprint.md` — chạy agent `conversion-blueprint`,
  có mục "P-check" tự đối chiếu P0–P13

### ⑦ DỪNG LẠI

Báo user:

> Brief và blueprint đã xong tại `<đường dẫn>`. Đọc và cho biết cần sửa gì
> trước khi sang bước chọn hướng thiết kế (`/directions $1`).

**Không tự chạy `/directions`.** Chờ user.
