# Brief — The Nam Du Hill Resort (Bản 5 - Amanoi Ultra-Luxury)

> File brief dành riêng cho **Bản 5 (`v5_amanoi`)** thiết kế theo chuẩn Ultra-Luxury của **Amanoi Resort**.

## Nguồn website & Benchmark Bản 5

| Trường | Giá trị |
|---|---|
| Website khách hàng hiện tại | `https://thenamduhill.com` |
| Benchmark Thiết kế chính | `https://www.aman.com/vi-vn/resorts/amanoi` (Amanoi Ultra-Luxury) |
| Spec thi công chính thức | `docs/superpowers/specs/2026-08-05-architecture-namduhillresort-v5-amanoi.md` |
| Theme Slug | `h4` (alias `v5_amanoi`) |
| Palette màu chính | Alabaster Warm `#FAF8F5` · Ocean Navy `#1E3A4C` · Champagne Gold `#C8A261` |
| Thư mục ảnh tuyển chọn | `apps/2026-thenamduhill/public/property/` |
| Thư mục ảnh crawl gốc | `resources/scripts/crawl/output/thenamduhill/assets/thenamduhill.com` |

## Định hướng Trọng tâm Bản 5 (`v5_amanoi`)

> **NGUYÊN TẮC: Kết hợp Thẩm mỹ Amanoi với Bảng Màu Tự Nhiên Đặc Trưng Đảo Nam Du (Đồi Củ Tron, Bãi Cây Mến & Logo OP5).**

### 1. Bảng Màu Tự Nhiên Đảo Nam Du (Nam Du Island Palette harmonized with Amanoi):
- **Nền Nắng Đảo (Alabaster Sunlit Surface):** `#FAF8F5` / `#FDFCF8` (Sáng ngập ánh nắng biển Nam Du, chiếm 85%).
- **Xanh Biển Ngọc Củ Tron (Nam Du Sea Blue - Logo OP5):** `#1173B8` / `#1E3A4C` (Màu đại dương ngắt biển Bãi Cây Mến & logo chính chủ).
- **Màu Đá Nắng Đồi Củ Tron (Hill Rock & Sand):** `#F3ECE1` (Dành cho dải thông tin & thẻ nội dung).
- **Vàng Hoàng Hôn Hòn Hàng Bè (Sunset Accent Gold):** `#F6B21B` / `#C8A261` (CHỈ dành cho nút CTA đặt phòng).

### 2. Điểm sáng CRO giữ lại từ V3 (Tối ưu chuyển đổi):
- **Tương phản Chữ P15:** Đạt WCAG AAA 14.1:1 (`#1A242B` trên nền ngà sáng), cấm đè chữ trắng trực tiếp lên ảnh sáng.
- **Tín nhiệm chính chủ:** Hotline/Zalo 0985 000 650 chính chủ đồi Củ Tron.
- **Giải tỏa lo âu thời tiết:** Dòng cam kết *"Tàu hoãn do thời tiết: Dời ngày miễn phí 100%"* sát nút bấm.

## 📋 Danh Sách Ảnh & Video Tuyển Chọn (`apps/2026-thenamduhill/public/`)

> **Ghi chú:** Bộ ảnh Hero dưới đây là **Ứng viên Đề xuất Linh hoạt** (AI Agent `image-curator` tự do đánh giá nét & tương phản để chọn ảnh tối ưu nhất):

| Tên File Asset (`public/`) | Vai trò & Đề xuất Sử dụng |
|---|---|
| 💡 `uploads/hero-1.jpg` (hoặc `property/hero-1.jpg`) | Ứng viên Hero Slide #1 (Ảnh đồi Củ Tron view biển góc rộng) |
| 💡 `uploads/hai-dang-Ke-Ga-2.jpg` (hoặc `property/hero-hai-dang.jpg`) | Ứng viên Hero Slide #2 (Hải đăng Nam Du) |
| 📸 `property/hero-drone.jpg` | Ứng viên Hero Slide #3 (Toàn cảnh đảo ngập nắng) |
| 🎬 `video/8102936365457.mp4` | **Video Giới thiệu Resort** (Tích hợp Modal Click-to-Play ở Section About) |
| 📸 `property/about-resort.png` | Section Về Nam Du Hill Resort trên đồi cao |
| 📸 `property/banner-rooms.jpg` | Banner trang Danh sách hạng phòng |
| 📸 `property/room-luc-giac.jpg` | Thẻ phòng Lục Giác tiêu chuẩn |
| 📸 `property/room-suite-6.jpg` | Thẻ phòng Suite gia đình 6 khách |
| 📸 `property/room-double-balcony.jpg` | Thẻ phòng Đôi ban công view biển |
| 📸 `property/place-cay-men.png` | Full-bleed bãi biển Cây Mến nước trong vắt |

---

## 🚀 Lệnh Chạy Server & Prompt Khởi Động Phiên Làm Việc

### 1. Lệnh Chạy Web Server (Terminal):
```bash
pnpm dev:thenamduhill
```
*(Đường dẫn xem trực tiếp: `http://localhost:3000/h4` hoặc `http://localhost:3000/v5_amanoi`)*

### 2. Prompt Ra Lệnh Cho AI Thi Công Bản 5 (Tối Ưu Phân Tích & Suy Luận):

```markdown
Chào AI, hãy giúp tôi thi công Bản 5 (v5_amanoi) cho dự án Nam Du Hill Resort:

THÔNG TIN THAM CHIẾU:
- File Spec: `docs/superpowers/specs/2026-08-05-architecture-namduhillresort-v5-amanoi.md`
- File Brief: `resources/docs/briefs/thenamduhillresort-v5-amanoi.md`
- Theme Target: `@repo/theme-h4` (slug: `h4` / `v5_amanoi`).
- Benchmark Thẩm mỹ chính: `https://www.aman.com/vi-vn/resorts/amanoi`
- Kho ảnh & Video có sẵn: `apps/2026-thenamduhill/public/property/`, `uploads/`, `video/`.

NẠP TƯ DUY & SUY LUẬN THIẾT KẾ:
1. Hãy tự phân tích và hòa quyện giữa tinh thần "Quiet Luxury" của Amanoi với "Cá tính Thiên nhiên Đảo Nam Du" (Biển xanh Củ Tron, nắng ngà, đá núi và vàng hoàng hôn).
2. Tự suy luận và chọn bộ màu HEX, khoảng thở spacing, typography serif/sans-serif sao cho vừa sang trọng như Amanoi vừa đạt chuẩn WCAG AAA dễ đọc (P15).
3. Đánh giá linh hoạt kho ảnh/video để chọn phương án Hero & Section hiệu quả nhất.
4. Khi hoàn thành, tự động chạy Agent `visual-auditor` chụp ảnh 1440px Desktop & 375px Mobile để tự đối chiếu bộ 16 Cổng P0–P15 và báo cáo kết quả.
```
