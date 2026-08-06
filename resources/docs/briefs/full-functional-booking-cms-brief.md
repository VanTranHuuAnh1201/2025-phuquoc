# Brief Full Chức Năng Hệ Thống Hotel Booking & CMS (Lộ Trình 3 Giai Đoạn)

> **Loại tài liệu**: Functional Specification & Technical PM Checklist  
> **Dự án**: The Nam Du Hill Resort & Monorepo Multi-theme System  
> **Link Demo Thử Nghiệm**: `https://2026-thenamduhill.vercel.app/`  
> **Website Chính Thức Khách Hàng**: `https://thenamduhill.com/`  
> **Mục tiêu**: Lộ trình phát triển 3 Giai đoạn (GD1 Demo Mockup -> GD2 Dynamic APIs/Supabase/Vercel -> GD3 Production Handover).  
> **Phương thức thanh toán**: **Thẻ Visa/MasterCard**, **Chuyển khoản ngân hàng (Bank Transfer)**, **Thanh toán trực tiếp tại Resort**.  
> **Nghiệp vụ OTA**: **Thao tác thủ công** (Lễ tân xem đơn trên CMS rồi lên trang OTA đóng/mở phòng bằng tay).

---

## 1. Tổng Quan Kiến Trúc Lộ Trình 3 Giai Đoạn (3-Phase Architecture Roadmap)

```
2025-phuquoc /
├── GD1: DEMO MOCKUP DATA (No API)
│   ├── Client UI/UX & Web CMS tĩnh (sử dụng @repo/core PropertyData mock)
│   └── Mục đích: Duyệt nhanh giao diện, bố cục khuyến mãi & luồng chọn phòng với khách
│
├── GD2: DYNAMIC CMS & REAL APIS (Supabase + Vercel Free)
│   ├── Backend Node.js API Routes + DB Supabase Postgres real-time
│   └── Luồng 3 PTTT (Visa Sandbox, VietQR thật, Thanh toán tại chỗ)
│
└── GD3: PRODUCTION INFRASTRUCTURE & HANDOVER
    ├── Migrate sang Server Production / VPS / Supabase Pro + Domain chính thức
    └── Kích hoạt Live Visa Gateway, Đào tạo Lễ tân & Bàn giao hệ thống
```

---

## 2. Mô Hình Dữ Liệu CMS (Supabase Schema Specifications - GD2)

### 2.1 Bảng Cấu hình Resort & Property (`properties`)
- `id`: UUID (Primary Key)
- `name`: Text (VD: *The Nam Du Hill Resort*)
- `logo_url`, `favicon_url`: Text
- `hotline`, `zalo_number`, `email`: Text
- `address`, `map_location`: Text & GeoJSON
- `promotions`: JSONB (Danh sách các chương trình khuyến mãi hiện có của resort)
- `supported_payment_methods`: JSONB (`["VISA_MASTER", "BANK_TRANSFER", "PAY_AT_RESORT"]`)
- `policies`: JSONB (Chính sách dời ngày do thời tiết bão biển, chính sách hủy phòng)

### 2.2 Bảng Hạng phòng & Bảng Giá (`room_types`)
- `id`: UUID
- `slug`: Text (Unique, VD: `villa-hilltop-sea-view`)
- `name`: Text (VD: *Villa Đỉnh Đồi View Biển*)
- `description`: Text (Markdown / HTML)
- `base_price_weekday`: Numeric (Giá ngày thường T2 - T5)
- `base_price_weekend`: Numeric (Giá cuối tuần T6 - CN)
- `base_price_holiday`: Numeric (Giá ngày Lễ / Tết)
- `capacity_standard`: Integer (VD: 2 người lớn)
- `capacity_max`: Integer (VD: 4 người)
- `surcharge_rules`: JSONB (`{extra_bed_price: 300000, child_fee: 150000}`)
- `amenities`, `images`: JSONB Array
- `total_inventory`: Integer
- `is_active`: Boolean

### 2.3 Bảng Danh Mục Số Phòng Cụ Thể (`physical_rooms`)
- `id`: UUID
- `room_number`: Text (Unique, VD: *Villa V.02*, *Phòng P.105*)
- `room_type_id`: FK -> `room_types.id`
- `current_status`: Enum (`VACANT`, `RESERVED`, `OCCUPIED`, `CHECKED_OUT`, `BLOCKED`)
- `cleanliness_status`: Enum (`CLEAN`, `DIRTY`, `IN_PROGRESS`)

### 2.4 Bảng Đơn Đặt Phòng & Khai Báo Lưu Trú (`bookings`)
- `id`: UUID
- `booking_code`: Text (Unique, VD: `NDH-2026-08839`)
- `customer_name`, `customer_phone`, `customer_email`: Text
- `room_type_id`: FK -> `room_types.id`
- `assigned_room_id`: FK -> `physical_rooms.id` (Nullable, gán khi Lễ tân duyệt đơn)
- `check_in`, `check_out`: Date
- `num_adults`, `num_children`, `num_extra_beds`: Integer
- `hold_expires_at`: Timestamp (Khóa phòng tạm 15 phút khi Checkout Session)
- `base_room_amount`, `surcharge_amount`, `addons_total_amount`: Numeric
- `total_amount`, `deposit_amount`, `remaining_balance`: Numeric
- `selected_addons`: JSONB (`[{id: "bbq-sea-food", name: "Tiệc BBQ Hải Sản", price: 350000, qty: 2}]`)
- `highlight_notes`: Text (Ghi chú kỷ niệm ngày cưới, order cafe đón cảng...)
- `room_switch_history`: JSONB Array (Nhật ký đổi phòng trong kỳ lưu trú)
- `rescheduled_history`: JSONB Array (Nhật ký dời ngày check-in/out)
- `vat_invoice_request`: JSONB (`{company_name: '...', tax_id: '...', address: '...', email: '...'}`)
- `residency_declaration`: JSONB Array (`[{guest_name: '...', id_type: 'CCCD'|'PASSPORT', id_number: '...', nationality: 'VN'}]`)
- `payment_method`: Enum (`VISA_MASTER`, `BANK_TRANSFER`, `PAY_AT_RESORT`)
- `payment_status`: Enum (`UNPAID`, `DEPOSIT_PAID`, `FULLY_PAID`, `CANCELLED`)
- `booking_status`: Enum (`DRAFT`, `PENDING_PAYMENT`, `CONFIRMED`, `CHECKED_IN`, `CHECKED_OUT`, `CANCELLED_BY_GUEST`, `CANCELLED_BY_RESORT`, `NO_SHOW`)

### 2.5 Bảng Chi Phí Phát Sinh Tại Phòng (`room_folios`)
- `id`: UUID
- `booking_id`: FK -> `bookings.id`
- `item_name`: Text (VD: *Minibar - RedBull*, *Giặt ủi*, *Thuê xe máy*, *Làm vỡ ly*)
- `category`: Enum (`MINIBAR`, `LAUNDRY`, `BIKE_RENTAL`, `DAMAGE_CHARGE`, `OTHER`)
- `unit_price`, `quantity`, `total_price`: Numeric
- `created_at`: Timestamp

---

## 3. PM DEV CHECKLIST — 3 GIAI ĐOẠN PHÁT TRIỂN

---

### 🟡 3.1 GIAI ĐOẠN 1 (GD1): DEMO MOCKUP DATA UI/UX (Không dùng Backend API)

- [ ] **Task DEV-GD1-01**: Tận dụng mock data trong `@repo/core` (`PropertyData.ts`) xây dựng UI Demo mượt mà trên Điện thoại & Máy tính.
- [ ] **Task DEV-GD1-02**: Hiển thị các **Chương trình Khuyến mãi (CTKM)** của resort thu thập từ PM Sales (Gạch giá gốc, hiển thị Badge ưu đãi).
- [ ] **Task DEV-GD1-03**: Xây dựng luồng giả lập Đặt phòng 3 bước (Chọn ngày -> Form khách -> Chọn 3 Phương thức Thanh toán).
- [ ] **Task DEV-GD1-04**: Deploy bản Mockup Demo trên Vercel Preview Link để PM Sales trình bày với Khách hàng.

---

### 🟢 3.2 GIAI ĐOẠN 2 (GD2): REAL BACKEND APIS, DB SUPABASE & DEPLOY VERCEL FREE

#### 1. Database & APIs Node.js (Giai đoạn 2)
- [ ] **Task DEV-GD2-01**: Khởi tạo Database Postgres & Storage Buckets trên Supabase.
- [ ] **Task DEV-GD2-02**: Viết API Handler `GET /api/v1/property` (Lấy thông tin resort + danh mục CTKM).
- [ ] **Task DEV-GD2-03**: Viết API Handler `POST /api/v1/booking/check-availability` (Tính phòng trống real-time).
- [ ] **Task DEV-GD2-04**: Viết API Handler `POST /api/v1/booking/create` (Định danh bằng `customer_phone` & `customer_email`, phân nhánh 3 phương thức thanh toán).
- [ ] **Task DEV-GD2-05**: Viết API Handler Tra Cứu Đơn `GET /api/v1/booking/lookup?phone=...&code=...` (Tra cứu danh sách đơn theo Số điện thoại khách hàng không cần đăng nhập).
- [ ] **Task DEV-GD2-06**: Viết Webhook Controller `POST /api/v1/webhooks/payment` nhận IPN cập nhật trạng thái đơn tự động.

#### 2. Email Service Engine & Notification Module
- [ ] **Task DEV-GD2-07**: Tích hợp **Resend / SendGrid Client Helper** trong `@repo/core` (Sử dụng Free Tier 100 emails/ngày ~3.000/tháng).
- [ ] **Task DEV-GD2-08**: Viết HTML Email Templates (Email xác nhận đơn + VietQR, Email Lễ tân duyệt cọc, Email nhắc lịch đi tàu).
- [ ] **Task DEV-GD2-09**: Kích hoạt gửi Email tự động trong API `booking/create` và khi Lễ tân đổi trạng thái đơn trên CMS.

#### 3. Frontend React Query & Web CMS Mobile/Desktop
- [ ] **Task DEV-GD2-10**: Xây dựng Trang Tra Cứu Đơn Đặt Phòng `/lookup` (Form nhập SĐT + Mã Booking).
- [ ] **Task DEV-GD2-11**: Tích hợp `@tanstack/react-query` trong `@repo/core`, thay thế mock data GD1 bằng Real APIs.
- [ ] **Task DEV-GD2-12**: Tối ưu giao diện **Web CMS Dành cho Lễ tân** trên điện thoại di động (Tìm đơn theo SĐT, duyệt cọc 1-click & kích hoạt nút gửi Email/SMS).
- [ ] **Task DEV-GD2-13**: Deploy bản GD2 hoàn chỉnh trên **Vercel Free Tier** (`https://2026-thenamduhill.vercel.app/`).

---

### 🔵 3.3 GIAI ĐOẠN 3 (GD3): PRODUCTION MIGRATION & HANDOVER

- [ ] **Task DEV-GD3-01**: Cấu hình trỏ Tên miền chính thức (`https://thenamduhill.com/`) từ Vercel DNS / Cloudflare.
- [ ] **Task DEV-GD3-02**: Nâng cấp Database/Server từ Supabase Free sang **Production Server (VPS / Supabase Pro)**.
- [ ] **Task DEV-GD3-03**: Chuyển Cổng thanh toán thẻ Visa/MasterCard từ Sandbox sang **Live Mode** & Kích hoạt Email Custom Domain (`booking@thenamduhill.com`).
- [ ] **Task DEV-GD3-04**: Đào tạo Lễ tân vận hành Web CMS & hướng dẫn quy trình đóng phòng thủ công trên sàn OTA khi nhận đơn qua SĐT.
- [ ] **Task DEV-GD3-05**: Nghiệm thu và bàn giao tài khoản CMS chính thức cho Quản lý Resort.
