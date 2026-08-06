# Brief — The Nam Du Hill Resort (Mẫu H3 - Coastal Navy)

> **File brief chính thức dành riêng cho Phiên bản H3 (`theme-h3`)**.
> Định vị: **Coastal Navy (Navy ven biển & Trải nghiệm Năng động)**.
> Trạng thái: **Khác biệt hoàn toàn với Phong cách Amanoi (theme-h4)**.

## Nguồn website & Định hướng Thẩm mỹ

| Trường | Giá trị |
|---|---|
| Website khách hàng hiện tại | `https://thenamduhill.com` |
| Benchmark Thiết kế chính | **Coastal Navy / Editorial Sea** (Khác biệt hoàn toàn với Amanoi Quiet Luxury) |
| Spec thi công chính thức | `packages/theme-h3/src/tokens.css` |
| Theme Slug | `h3` (alias `coastal_navy`) |
| Palette màu chính | Deep Navy `#1D4E89` · Midnight Dark `#0B192C` · Gold Accent `#FFB800` (5%) |
| Typography | Playfair Display (Serif) + Inter (Sans-serif) |
| Thư mục ảnh tuyển chọn | `apps/2026-thenamduhill/public/property/` |

---

## 1. Định hướng Thiết kế H3 vs Amanoi (H4)

Bản H3 (Coastal Navy) được thiết kế theo trường phái khác hoàn toàn với Amanoi (H4):

| Tiêu chí | Bản H3 (Coastal Navy) | Bản H4 / v5_amanoi (Amanoi Style) |
|---|---|---|
| **Định vị & Cảm xúc** | **Hiện đại, Năng động, Đậm chất Biển khơi** | **Quiet Luxury, Tĩnh lặng, Xa xỉ biệt lập** |
| **Bảng màu chủ đạo** | **Deep Navy (`#1D4E89`) + Vàng nghệ (`#FFB800`)** trên nền trắng sữa/xám nhạt | **Alabaster Warm (`#FAF8F5`) + Ocean Navy (`#1E3A4C`) + Champagne Gold (`#C8A261`)** |
| **Typography** | `Playfair Display` + `Inter` (Trẻ trung, hiện đại) | `Lora` + `Be Vietnam Pro` (Thanh lịch, cổ điển) |
| **Hero Viewport 1** | Hero ảnh rộng tràn viền với **Thanh tìm kiếm nổi lớn** (`--shadow-hero`) | Hero ảnh tràn viền với **Concierge Bar chìm tinh tế** ở sát đáy |
| **Khoảng thở (Spacing)** | Spacing tiêu chuẩn (`96px` / `140px`) | Spacing siêu rộng (`120px` / `160px`) tạo cảm giác thong thả |
| **Chi tiết đặc trưng** | Lưới ảnh bất đối xứng, **lời đánh giá khách hàng cuộn dọc liên tục** (`HostService`) | Layout so le, mỗi block thông tin nằm trên thẻ nền riêng biệt |

---

## 2. Các thành phần chính của Theme H3 (`packages/theme-h3`)

### 2.1 Cấu trúc Giao diện trang HOME
1. **Hero Section (`top`):** Slider ảnh biển full-bleed với tiêu đề lớn, tích hợp thanh nhập ngày nhận/trả phòng nổi bật có bóng đổ ám xanh sâu.
2. **About Section (`about`):** Giới thiệu resort kết hợp với **Khung đánh giá (Testimonial Track)** cuộn dọc vô hạn bằng CSS keyframes tịnh tiến tuyến tính.
3. **Panorama Section (`panorama`):** Khung ảnh góc rộng hiển thị các danh lam thắng cảnh và hoạt động khám phá Nam Du.
4. **Rooms Preview (`rooms`):** Hiển thị các hạng phòng dưới dạng lưới hoặc hàng so sánh.
5. **Dining Section (`dining`):** Trải nghiệm ẩm thực hải sản Nam Du.
6. **Places Section (`places`):** Điểm đến và lịch trình tour du lịch Nam Du.
7. **Host Service Section (`host`):** Các đặc quyền dịch vụ tiện ích đi kèm của resort.
8. **Gallery Section (`gallery`):** Thư viện ảnh thật bất đối xứng.
9. **Practical Section (`faq`):** Câu hỏi thường gặp và thông tin thực dụng cho khách đi tàu ra đảo.

### 2.2 Các trang chức năng riêng
Khác với các theme khác sử dụng trang dùng chung ở `domain-hotel`, H3 tự xây dựng các trang con riêng để tối ưu hóa hiển thị:
- **RoomsPage (`/h3/rooms`):** Trang danh sách phòng 2 cột có sidebar lọc tiện ích.
- **RoomDetailPage (`/h3/rooms/[id]`):** Trang chi tiết phòng tối ưu SEO, hỗ trợ breakdown giá cọc và chính sách thời tiết.
- **CheckoutPage (`/h3/checkout`):** Thanh toán 3 bước gọn gàng.
- **ToursPage / GalleryPage / ContactPage / DiningPage / BlogPage / BlogDetailPage**.

---

## 3. Trả lời K0 (5 câu) cho Theme H3

1. **Design direction:** Coastal Navy (Biển khơi năng động, hiện đại).
2. **Nguồn ảnh:** Ảnh thực tế đã crawl + ảnh resort cung cấp (lọc bỏ ảnh spam/watermark).
3. **Nội dung thật:** Đồng bộ từ `PropertyData` của core (`@repo/core`), hỗ trợ đầy đủ song ngữ VI/EN.
4. **Mức độ motion:** Motion tự nhiên, hiệu ứng cuộn mượt mà ở Testimonial track (tự động dừng khi hover để khách dễ đọc).
5. **Brand asset:** Tôn trọng logo `OP5.png`, màu sắc chủ đạo Navy `#1D4E89` và Vàng nghệ `#FFB800`.
