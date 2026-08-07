# Nam Du Hill Resort - CMS Admin Architecture

Hệ thống quản lý Nam Du Hill Resort CMS được thiết kế gọn gàng, chia làm 3 luồng chính (Three-stream Architecture) nhằm tối ưu tác nghiệp ca trực hàng ngày và phân quyền RBAC minh bạch.

## 📐 Cấu Trúc Navigation & Sidebar (CMS Admin Tree)

```text
├── 📋 OPERATIONS (1. VẬN HÀNH HÀNG NGÀY - ƯU TIÊN SỐ 1)
│   ├── 📊 dashboard/       -> Bàn điều hành hôm nay (Công suất %, Check-in/out, Duyệt cọc khẩn)
│   ├── 📑 orders/          -> Quản lý danh sách đơn đặt phòng & Chi tiết đơn
│   ├── 📅 availability/    -> Lịch tồn kho phòng & Đóng/mở bán, sửa giá theo ngày
│   ├── 🧹 housekeeping/    -> Sơ đồ buồng phòng & Trạng thái dọn dẹp (Sạch / Bẩn)
│   └── 👥 customers/       -> Hồ sơ khách hàng & Lịch sử lưu trú (CRM)
│
├── 🌐 CONTENT (2. QUẢN LÝ NỘI DUNG & TRANG WEB CLIENT)
│   ├── 📄 pages/           -> Cây quản lý trang tĩnh (Home, Giới thiệu, Trải nghiệm, Điều khoản)
│   ├── 🖼️ media/           -> Kho Media HD (Tự động nén WebP & Crop đúng tỷ lệ)
│   ├── 📣 banners/         -> Banner khuyến mãi & Popup hiển thị trang chủ
│   └── ✍️ blog/            -> Cẩm nang du lịch Nam Du & Tin tức resort
│
└── ⚙️ SYSTEM (3. CẤU HÌNH HỆ THỐNG & QUY TẮC BASE)
    ├── 🏨 room-types/      -> Danh mục Hạng phòng & Mã số phòng master (Room 101, Villa 02)
    ├── 🏷️ rate-plans/      -> Gói giá (Rate Plan), Chính sách cọc & Hoàn/hủy
    ├── 🪙 add-ons/         -> Danh mục Phụ thu & Dịch vụ đi kèm (Tour đảo, Buffet, BBQ)
    ├── 🎫 tickets/         -> Ticket báo sự cố & Bảo trì thiết bị phòng
    ├── 🔑 accounts/        -> Quản lý Tài khoản nhân viên & Phân quyền RBAC
    └── 💳 settings/        -> Cấu hình Tài khoản Ngân hàng QR, Zalo ZNS & SMS Notification
```

## 🎨 Quy Chuẩn UI/UX Design System

1. **Bảng màu (Color Palette):**
   - **Màu nền & Text:** Trắng - Đen - Ghi xám trung tính (`#0F172A`, `#F8FAFC`, `#E2E8F0`).
   - **Màu điểm nhấn (Accent Color):** Xanh dương thanh lịch (`#2563EB` / `blue-600`).
   - **Nguyên tắc:** Tối giản màu sắc, không dùng các khối rực rỡ (vàng, cam, tím, xanh lá) gây rối mắt. Giao diện Clean, Minimalist, Ultra-modern.

2. **Sidebar:**
   - Nhãn Heading cấp 1 ngắn gọn, tinh tế: `OPERATIONS`, `CONTENT`, `SYSTEM`.
   - Active item được tick/highlight xanh dương rõ ràng.
   - Nút `+ Tạo đơn mới` chuẩn hóa gọn gàng ở đầu sidebar.
