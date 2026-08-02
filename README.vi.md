<div align="center">

# Booking Platform

**Một nền tảng. Bao nhiêu giao diện cũng được.**

Các sản phẩm đặt phòng, đặt tour sẵn sàng chạy thật cho khách sạn, resort và
công ty lữ hành — cùng một nội dung, hiển thị thành những website khác hẳn nhau.

[English](./README.md) · [Kiến trúc](./resources/docs/ARCHITECTURE.md)

</div>

---

## Sản phẩm

### 🏨 Booking Hotel

Hệ thống đặt phòng hoàn chỉnh cho khách sạn và resort: danh sách hạng phòng,
trang chi tiết đầy đủ, tìm phòng trống, dịch vụ cộng thêm và luồng thanh toán.

**Bốn mẫu giao diện, một nguồn nội dung.** Chọn mẫu hợp với thương hiệu của bạn —
phòng, giá và đơn đặt phía sau đều là một.

| | Mẫu | Tính cách |
|---|---|---|
| **01** | Xanh biển | Gọn gàng, chuẩn mực. Bố cục chặt chẽ, tạo cảm giác tin cậy. |
| **02** | Teal & Cam | Ấm áp, hiếu khách. Nhịp điệu như tạp chí, hình ảnh lớn. |
| **03** | Boutique | Tinh tế, điềm đạm. Dẫn dắt bằng chữ, khoảng thở rộng. |
| **04** | Xanh lá | Tươi, năng động. Đậm nét, hợp trải nghiệm khám phá. |

→ **[Xem bản demo](https://thenamduhillresort.com)**

Sau này đổi ý muốn dùng mẫu khác, bạn chỉ cần đổi cấu hình chứ không phải làm
lại website. Dữ liệu phòng, đơn đặt và khách hàng giữ nguyên.

*Các sản phẩm tiếp theo đang được phát triển — nền tảng được dựng để mỗi sản
phẩm mới đều thừa hưởng sẵn phần móng này.*

---

## Bạn nhận được gì

**Song ngữ ngay từ đầu** — tiếng Việt và tiếng Anh nằm sẵn trong tầng dữ liệu
chứ không phải chắp vá về sau. Mọi mức giá, tên phòng và chính sách đều có đủ
hai ngôn ngữ.

**Dựng cho đơn đặt thật** — chọn ngày, số khách, giường phụ, vé tàu, đưa đón và
dịch vụ thêm; toàn bộ phần tính giá nằm một chỗ nên mọi giao diện luôn hiện cùng
một con số.

**Nhanh trên máy thật** — trang render sẵn ở máy chủ, ảnh được tối ưu. Khách
dùng wifi khách sạn hay 4G vẫn vào được mượt.

**Mở rộng được** — thêm mẫu thứ năm, thứ mười không đụng đến phần đang chạy tốt.

---

## Công nghệ

Chọn theo độ bền và khả năng tìm người, không chạy theo cái mới.

| Tầng | Lựa chọn |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Giao diện | React 19 · TypeScript 5 |
| CSS | Tailwind CSS v4, mỗi mẫu một bộ design token |
| Cấu trúc | Monorepo pnpm workspaces |
| Icon | lucide-react |

Điểm đáng nói nằm ở cấu trúc: mỗi giao diện là một package độc lập nhưng dùng
chung một lõi nghiệp vụ, nhờ vậy đa dạng về hình thức mà không nhân bản logic.
Lý do đầy đủ ở [resources/docs/ARCHITECTURE.md](./resources/docs/ARCHITECTURE.md).

---

## Cấu trúc kho mã

```
apps/
  portfolio/           Trang chính — danh mục sản phẩm
  2026-thenamduhill/   Booking Hotel — hub + mọi giao diện
  2025-phogroup/       Dự án trước, giữ nguyên
packages/
  core/                Type, dữ liệu, nghiệp vụ đặt phòng, i18n
  ui/                  Component không mang bản sắc thương hiệu
  theme-h1/            Mẫu 01 — token, section, bố cục
  theme-h2..h4/        Mẫu 02–04
resources/             Bundle thiết kế, tài liệu kiến trúc, hồ sơ bàn giao
```

Mỗi sản phẩm là một app, một Vercel Project và một domain riêng, nên phát hành
sản phẩm này không build lại sản phẩm kia.

---

## Chạy tại máy

```bash
pnpm install
pnpm dev
```

Rồi mở **http://localhost:3002** và click vào sản phẩm muốn xem.

### Lệnh cần nhớ

| Lệnh | Làm gì |
|---|---|
| `pnpm install` | Cài toàn bộ workspace |
| **`pnpm dev`** | **Chạy hết — bắt đầu ở đây, mở `:3002`** |
| `pnpm build` | Build toàn bộ (Turborepo cache sẵn) |
| `pnpm check` | Lint + typecheck toàn bộ |

<details>
<summary>Chạy riêng một app</summary>

Chỉ cần khi muốn nhẹ máy lúc tập trung sửa một app — các cổng còn lại sẽ không
có gì.

| Lệnh | Cổng | App |
|---|---|---|
| `pnpm dev:portfolio` | 3002 | Trang chính |
| `pnpm dev:thenamduhill` | 3000 | Booking Hotel |
| `pnpm dev:phogroup` | 3001 | Pho Group |

Build hoặc check riêng một package bằng filter:
`pnpm turbo build --filter=@repo/2026-thenamduhill`

</details>

### Cổng

| Cổng | App | |
|---|---|---|
| **3002** | `portfolio` | 🚪 Bắt đầu ở đây — link sang các trang khác |
| 3000 | `2026-thenamduhill` | Booking Hotel, hub chọn mẫu |
| 3001 | `2025-phogroup` | Pho Group Phú Quốc |

Mỗi app ghim cổng cố định nên lần nào chạy cũng nằm đúng chỗ đó.

---

## Gửi cho khách

Mỗi sản phẩm có domain riêng, nên **gửi thẳng link sản phẩm** — khách chỉ thấy
trang của họ, không thấy trang chính hay khách khác.

| Gửi cho | Link |
|---|---|
| Khách Nam Du Hill | `thenamduhillresort.com` |
| Muốn khách xem sẵn một mẫu | `thenamduhillresort.com/h1` |
| Khách Pho Group | `2025-phuquoc.vercel.app` |
| Nhà tuyển dụng, khách tiềm năng | `vantha.com.vn` (trang danh mục này) |

Khách không cần cài gì — mở trình duyệt là xem được, cả trên điện thoại.

Hướng dẫn deploy: [resources/docs/DEPLOY.md](./resources/docs/DEPLOY.md).

---

## Về tác giả
<!-- 
Phát triển và duy trì bởi **[CobyTran](https://github.com/CobyTran)**, senior
frontend engineer, làm việc với các sản phẩm đặt phòng và du lịch.

Nhận công việc về frontend và design system — liên hệ qua GitHub. -->

<sub>Nội dung của bên thứ ba dùng trong quá trình phát triển chỉ nhằm tham khảo
cấu trúc, không nằm trong bản triển khai thật.</sub>
