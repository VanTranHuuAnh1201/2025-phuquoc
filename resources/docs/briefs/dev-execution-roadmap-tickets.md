# Tài Liệu Kỹ Thuật, Schema SQL & Danh Sách Ticket Triển Khai (Dev Roadmap)

> **Dự án**: Hệ thống Website Đặt Phòng & Web CMS Quản Lý Resort (The Nam Du Hill Resort)  
> **Cấu trúc Monorepo**: `apps/2026-thenamduhill`, `@repo/core`, `@repo/ui`  
> **Áp dụng cho**: Đội ngũ Lập trình viên (Frontend Dev, Backend Dev, DB Eng), Tech Lead & QA / Tester  
> **Ánh xạ 1:1 với Bản PM**: Mô tả CSDL SQL Schema (bổ sung trường `booking_source`, `child_ages`, `min_nights_holiday`, phân quyền 3 cấp SuperAdmin/Admin/User, Auth Token/Refresh Token), phân rã Ticket với ETA FE/BE/Hoàn thành và DoD chi tiết.

---

# PHẦN 1: TỔNG QUAN QUALITY GATE & KIẾN TRÚC CƠ SỞ DỮ LIỆU SQL (DATABASE SCHEMA)

## 1.1 Bảng Quy Chuẩn Quality Gate Dành Cho Dev Team

| # | Tiêu chuẩn | Mô tả chi tiết Quality Gate | Điều kiện nghiệm thu (DoD) |
|---|---|---|---|
| **1.1.1** | **Code Quality & Type Safety** | Mọi file TypeScript trong `apps/2026-thenamduhill` và `@repo/*`. | Pass 100% `pnpm typecheck`, 0 warning, 0 type `any`. Tách biệt logic `@repo/core` và theme `@repo/theme-h3`. |
| **1.1.2** | **Database (Supabase PostgreSQL)** | Thiết kế Schema chuẩn Relational DB. | 100% bảng có Primary Key, Timestamp (`created_at`, `updated_at`), RLS policy cho Admin/Public và file Migration `.sql`. |
| **1.1.3** | **API & Realtime Sync** | Route Handlers Node.js/Next.js. | Trả về JSON chuẩn `{ success, data, error }`. Thao tác CRUD từ CMS phản ánh realtime lên Client/Lookup. |

---

## 1.2 Chi Tiết Các Bảng Dữ Liệu SQL (Supabase PostgreSQL Data Tables)

```sql
-- 1. BẢNG NGUỜI DÙNG QUẢN TRỊ & PHÂN QUYỀN (users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(20) DEFAULT 'USER' NOT NULL, -- SUPERADMIN, ADMIN, USER
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    refresh_token TEXT, -- Token gia hạn phiên đăng nhập
    refresh_token_expires_at TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_user_role CHECK (role IN ('SUPERADMIN', 'ADMIN', 'USER'))
);

-- 2. BẢNG LOẠI PHÒNG (room_types)
CREATE TABLE public.room_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    base_price_weekday DECIMAL(12, 2) NOT NULL, -- Giá ngày thường
    base_price_weekend DECIMAL(12, 2) NOT NULL, -- Giá T6-T7 cuối tuần
    base_price_holiday DECIMAL(12, 2) NOT NULL, -- Giá ngày Lễ/Tết
    min_nights_holiday INT DEFAULT 2 NOT NULL, -- Số đêm ở tối thiểu ngày Lễ (P-07)
    max_adults INT DEFAULT 2 NOT NULL,
    max_children INT DEFAULT 2 NOT NULL,
    description TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG PHÒNG VẬT LÝ (rooms)
CREATE TABLE public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_number VARCHAR(50) UNIQUE NOT NULL, -- Ví dụ: P.101, Villa 02
    room_type_id UUID REFERENCES public.room_types(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'CLEAN' NOT NULL, -- CLEAN, DIRTY, MAINTENANCE
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BẢNG ĐƠN ĐẶT PHÒNG (bookings)
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code VARCHAR(50) UNIQUE NOT NULL, -- NDH-YYYYMMDD-XXXX (Thống nhất 1 format)
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_id_card VARCHAR(50), -- Số CCCD/Passport
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    room_type_id UUID REFERENCES public.room_types(id),
    assigned_room_id UUID REFERENCES public.rooms(id), -- Gán số phòng vật lý khi Lễ tân xếp
    num_adults INT DEFAULT 1 NOT NULL,
    num_children INT DEFAULT 0 NOT NULL,
    child_ages INT[] DEFAULT '{}', -- Mảng số tuổi từng trẻ em (P-02b)
    booking_source VARCHAR(50) DEFAULT 'WEB' NOT NULL, -- WEB, PHONE, WALK_IN, OTA_MANUAL (B-05)
    
    -- 3 Chỉ số tài chính bắt buộc theo Requirement P-04
    total_amount DECIMAL(12, 2) NOT NULL, -- Tổng thanh toán cuối cùng
    deposit_amount DECIMAL(12, 2) NOT NULL, -- Số tiền cần cọc (Mặc định 50%)
    remaining_amount DECIMAL(12, 2) NOT NULL, -- Số tiền còn lại thu tại quầy
    
    discount_amount DECIMAL(12, 2) DEFAULT 0.00,
    promo_code VARCHAR(50),
    
    status VARCHAR(50) DEFAULT 'PENDING' NOT NULL, 
    -- PENDING, HOLD_TEMPORARY, DEPOSITED, CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED, NO_SHOW, EXPIRED
    
    hold_expires_at TIMESTAMPTZ, -- Hạn giữ phòng 15 phút theo QR Timeout (B-01)
    vat_requested BOOLEAN DEFAULT FALSE,
    vat_company_name VARCHAR(255),
    vat_tax_code VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BẢNG PHỤ THU & PHÁT SINH (booking_surcharges)
CREATE TABLE public.booking_surcharges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- EXTRA_GUEST, CHILD_AGE, LATE_CHECKOUT, MINIBAR, RESCHEDULE_FEE
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    is_manual BOOLEAN DEFAULT FALSE NOT NULL, -- TRUE nếu Lễ tân nhập thủ công trên CMS
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BẢNG MÃ GIẢM GIÁ (promo_codes)
CREATE TABLE public.promo_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL, -- PERCENTAGE, FIXED_AMOUNT
    discount_value DECIMAL(12, 2) NOT NULL,
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL,
    max_uses INT DEFAULT 100,
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. BẢNG LỊCH SỬ GIAO DỊCH THANH TOÁN (payment_transactions)
CREATE TABLE public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    transaction_reference VARCHAR(100) NOT NULL, -- Mã giao dịch ngân hàng
    payment_method VARCHAR(50) NOT NULL, -- VIETQR, VISA, CASH
    amount DECIMAL(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'SUCCESS' NOT NULL,
    raw_payload JSONB, -- Payload Webhook lưu đối soát
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. BẢNG LOG VẾT THAY ĐỔI & ĐỔI NGÀY (booking_audit_logs)
CREATE TABLE public.booking_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL, -- CREATE, DEPOSIT_SUCCESS, RESCHEDULE, ROOM_CHANGE, NO_SHOW, CANCEL
    performed_by VARCHAR(100) NOT NULL, -- CLIENT, SYSTEM_CRON, ADMIN_EMAIL
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 1.3 Cơ Chế Xác Thực & Phân Quyền Authentication (JWT Token & Refresh Token)

- **Cơ chế Token**:
  - `Access Token`: Mã JWT ngắn hạn (Thời hạn 15 phút), lưu trong Header Bearer hoặc Cookie `access_token`.
  - `Refresh Token`: Mã JWT dài hạn (Thời hạn 7 ngày), lưu trong `HTTP-Only Cookie` bảo mật (`SameSite=Strict, Secure`), ghi nhận trong cột `refresh_token` của bảng `users`.
- **Middleware Security Guard (`middleware.ts`)**:
  - Kiểm tra `role` trong Payload Token khi truy cập `/admin/*` và Route Handlers `/api/admin/*`.
  - **SuperAdmin**: Quyền xem báo cáo tổng, sửa tài khoản, đổi cấu hình Ngân hàng.
  - **Admin**: Quyền quản lý đơn, tạo đơn điện thoại (`B-05`), duyệt hủy/hoàn cọc, khóa phòng OTA.
  - **User (Lễ tân)**: Quyền gán phòng, tạo đơn điện thoại (`B-05`), check-in/out, nhập minibar/phụ thu thủ công, khóa phòng khẩn cấp di động.

---

# PHẦN 2: BẢNG DANH SÁCH TICKET TRIỂN KHAI

> **Nguyên tắc triển khai**: Đơn giản hóa theo nghiệp vụ booking OTA chuẩn. Màn hình thông tin thanh toán hiển thị các thông tin thanh toán tài khoản (chuyển khoản bank / QR / thẻ / trực tiếp), cho phép đăng ký thông tin đơn giản, trực quan.
>
> **Không dựng dữ liệu giả**: GD1 dựng giao diện đầy đủ theo đúng cấu trúc dữ liệu thật ở `§1.2`, GD2 nối thẳng vào API — **không có bước trung gian phải làm lại**. Mỗi trường trên màn hình GD1 phải ánh xạ được về một cột trong Schema SQL.

## 2.1 GIAI ĐOẠN 1 (GD1): Giao Diện Client & CMS Admin Đầy Đủ (Hạn hoàn thành: Thứ 2, 10/08/2026)

| Mã Ticket | Title Công Việc | Nội Dung Chi Tiết Kỹ Thuật | Ánh Xạ PM | ETA FE | Definition of Done (DoD) |
|---|---|---|---|---|---|
| **DEV-101** | **Client — Full Luồng Booking OTA 5 Bước** | Dựng full 5 bước đặt phòng: Chọn ngày ➔ Chọn phòng ➔ Info khách ➔ Thông tin thanh toán (Bank info / QR / Thẻ / Trực tiếp) ➔ Xác nhận đơn. Hiển thị **bảng tiền phân rã từng đêm** trước khi khách xác nhận. | Luồng OTA, `P-03` | 12 Hours | - Hoàn thiện 100% UI/UX Client chuẩn Quiet Luxury.<br>- Form thu thập đủ thông tin đăng ký & hiển thị tài khoản thanh toán.<br>- Bảng tiền hiện rõ: tiền phòng từng đêm · phụ thu · giảm giá · **cọc phải trả** · còn lại trả tại quầy. |
| **DEV-102** | **CMS Admin — Quản Lý Đơn & Tạo Đơn Thủ Công** | Màn hình danh sách đơn đặt phòng (lọc/tìm/phân trang), chi tiết đơn, gán phòng vật lý và form tạo đơn thủ công cho Lễ tân kèm chọn nguồn đơn (`WEB` / `PHONE` / `WALK_IN` / `OTA_MANUAL`). | CMS Base, `B-05` | 12 Hours | - Lễ tân xem và thao tác đầy đủ các màn hình CMS Admin.<br>- Hiển thị trạng thái đơn hàng & nguồn booking.<br>- Bảng danh sách có trạng thái rỗng rõ ràng, mobile đổi sang dạng thẻ. |
| **DEV-103** | **CMS Admin — Màn Trả Phòng & Chốt Bill Phát Sinh** | Màn hình Lễ tân bấm [Trả phòng]: hiện bảng dòng tiền gồm **tiền phòng · cọc đã trả trước · các dòng phụ thu**. Lễ tân thêm dòng phát sinh (minibar, hư hỏng, trả muộn) chọn từ danh mục hoặc nhập tay ➔ hệ thống cộng ra **số còn phải thu** ➔ xác nhận đã thu và đóng đơn. | `P-02a` | 10 Hours | - Thêm / sửa / xoá dòng phụ thu, tổng tiền cập nhật ngay.<br>- Hiện rõ 3 con số: **Tổng tiền · Đã trả (cọc) · Còn phải thu**.<br>- Xác nhận xong: đơn ➔ `CHECKED_OUT`, phòng ➔ `DIRTY`. |
| **DEV-104** | **CMS Admin — Quản Lý Dữ Liệu Nền** | CRUD hạng phòng, phòng vật lý, bảng giá theo ngày, danh mục phụ thu & minibar, mã giảm giá, tài khoản quản trị, thông tin ngân hàng nhận cọc. Đây là các màn để Resort tự nhập thông số ở Bản PM `§2.2`. | PM `§2.2`, `P-01` | 12 Hours | - Resort tự thêm / sửa hạng phòng, giá, phụ thu mà **không cần gọi Dev**.<br>- Có màn cấu hình thông tin ngân hàng & mã QR nhận cọc (`R4`).<br>- Chỉ `SUPERADMIN` sửa được giá gốc và tài khoản. |

---

## 2.2 GIAI ĐOẠN 2 (GD2): API Full, Database Supabase & Mail Notification (Hạn hoàn thành: Thứ 2, 17/08/2026)

| Mã Ticket | Title Công Việc | Nội Dung Chi Tiết Kỹ Thuật | Ánh Xạ PM | ETA BE | Definition of Done (DoD) |
|---|---|---|---|---|---|
| **DEV-201** | **Supabase DB Schema & Auth Guard** | Đẩy SQL Migration 8 bảng lên Supabase Cloud. Seed dữ liệu thật của Resort. Tích hợp JWT Auth / Refresh Token bảo mật 3 cấp quyền (SuperAdmin, Admin, User) + RLS policy. | Schema & Auth, `O-01` | 12 Hours | - DB chạy chuẩn trên Supabase, cấp quyền phân tầng API chuẩn xác.<br>- Generates TypeScript types đầy đủ.<br>- Middleware trả `403 Forbidden` khi Lễ tân gọi API sửa giá (`BR-05`). |
| **DEV-202** | **API Tính Giá Theo Từng Đêm** | `POST /api/bookings/calculate-price`. Duyệt **từng đêm** trong khoảng lưu trú, tra giá ngày thường / cuối tuần / Lễ. Áp giảm giá trên giá phòng gốc, cộng phụ thu sau. Tính phụ thu trẻ em theo `child_ages`. Chặn đơn vi phạm `min_nights_holiday`. | `P-01`, `P-02b`, `P-03`, `P-07` | 10 Hours | - Trả về bảng phân rã **tiền từng đêm**, không nhân gộp giá đêm đầu (`PR-01`).<br>- Công thức đúng `Total = (BaseRate − Discount) + Surcharges`.<br>- Trả `400` kèm thông báo khi chọn 1 đêm dịp Lễ (`PR-03`).<br>- Ngày xử lý dạng chuỗi `YYYY-MM-DD`, không lệch khi server chạy múi giờ khác. |
| **DEV-203** | **API Tạo Đơn & Chống Đặt Trùng** | `GET /api/rooms/availability` · `POST /api/bookings`. Postgres Function `create_booking_atomic()` dùng `SELECT FOR UPDATE`: hai request đồng thời thì **người trước thắng, người sau nhận `409 Conflict`**. Đơn tạo ra ở `HOLD_TEMPORARY` kèm `hold_expires_at`. | `B-01` | 12 Hours | - Bắn 2 request đồng thời vào phòng cuối cùng: 1 thành công, 1 nhận `409` (`BR-01`).<br>- Frontend bắt `409` hiện toast *"Phòng vừa được khách khác đặt"*.<br>- Sinh mã booking chuẩn `NDH-YYYYMMDD-XXXX` duy nhất.<br>- Lưu đủ 3 chỉ số `total_amount` / `deposit_amount` / `remaining_amount`. |
| **DEV-204** | **API Xác Nhận Thanh Toán & Vòng Đời Đơn** | `POST /api/bookings/{code}/confirm-payment` — bản GD2 **đánh dấu thành công ngay**, chưa đối soát tiền (biến `PAYMENT_MODE=simulated`). Kèm các API chuyển trạng thái: nhận phòng, trả phòng, huỷ đơn (tự tính tiền hoàn theo `P-05`). Mọi chuyển trạng thái ghi `booking_audit_logs`. | `C-01`, `P-04`, `P-05` | 10 Hours | - Đơn chuyển đúng theo vòng đời, không nhảy cóc trạng thái.<br>- Huỷ đơn trả về **đúng số tiền hoàn** theo mốc ngày, nhả kho phòng.<br>- Cấu trúc API giữ nguyên khi GD3 cắm webhook thật — **không phải viết lại**. |
| **DEV-205** | **Cron Job Nhả Phòng & No-Show** | Supabase Edge Function chạy định kỳ: (1) đơn `HOLD_TEMPORARY` quá `hold_expires_at` ➔ `EXPIRED`, nhả kho; (2) đơn đã cọc quá 18h00 ngày check-in ➔ `NO_SHOW`, nhả kho. | `B-01`, `B-04` | 6 Hours | - Đơn quá hạn giữ chỗ tự nhả, kho phòng cộng lại đúng (`BR-02`).<br>- Đơn quá 18h00 chuyển `NO_SHOW`, giữ 100% cọc (`BR-06`).<br>- Mỗi lần chuyển ghi log với `performed_by = 'SYSTEM_CRON'`. |
| **DEV-206** | **Nối Giao Diện Client & CMS Vào API Thật** | Thay toàn bộ nguồn dữ liệu cục bộ của các màn đã dựng ở GD1 bằng API thật. Xử lý lỗi `409` (hết phòng) và `400` (vi phạm số đêm tối thiểu). | Toàn bộ GD1 | 14 Hours | - Đặt phòng thật trên điện thoại, đơn xuất hiện trong DB.<br>- Hai máy Lễ tân nhìn thấy cùng một dữ liệu.<br>- Không màn hình nào còn đọc dữ liệu cục bộ. |
| **DEV-207** | **SendGrid Email & Trang Tra Cứu `/lookup`** | Tích hợp SendGrid tự động gửi email xác nhận kèm **bảng tiền từng đêm**, cọc đã trả, còn lại trả tại quầy, chính sách huỷ và link tra cứu. Dựng trang `/lookup` tra đơn theo **SĐT + Mã đơn**, nút Huỷ **hiện rõ số tiền được hoàn** trước khi bấm. | `N-01`, `P-04`, `P-05` | 12 Hours | - Email tự động về hòm thư chính khách trong 1 phút, không rơi Spam.<br>- Nội dung email khớp chính xác bảng tiền khách thấy trên web.<br>- Khách tra cứu được đơn tại `/lookup`; sai SĐT hoặc sai mã báo lỗi rõ ràng. |
| **DEV-208** | **Kiểm Thử Full Luồng & Nghiệm Thu GD2** | Chạy thử toàn bộ trên thiết bị di động thật: đặt phòng ➔ email ➔ tra cứu ➔ Lễ tân nhận phòng ➔ thêm minibar ➔ trả phòng ➔ đóng đơn. Deploy Vercel, cùng PM review với Chủ Resort. | Master Matrix | 8 Hours | - Đi hết luồng không lỗi trên điện thoại thật.<br>- Test đặt trùng: 2 thiết bị cùng lúc, chỉ 1 đơn thành công.<br>- Khách hàng duyệt bản chạy thật và chốt 16 Case Requirements. |

### 2.2.1 Tổng hợp khối lượng GD1 + GD2

| Giai đoạn | Số ticket | Khối lượng | Hạn |
|---|---|---|---|
| GD1 — Giao diện Client & CMS | 4 | 46 giờ | 10/08/2026 |
| GD2 — Database, API & Thông báo | 8 | 84 giờ | 17/08/2026 |
| **Tổng** | **12 ticket** | **130 giờ** | |

**Thứ tự triển khai bắt buộc trong GD2**: `DEV-201` (DB & Auth) ➔ `DEV-202` ➔ `DEV-203` ➔ `DEV-204` ➔ `DEV-205`. Sau khi API xong, `DEV-206` và `DEV-207` chạy song song, `DEV-208` chốt cuối.

---

## 2.3 GIAI ĐOẠN 3 (GD3): Tích Hợp Thanh Toán Thật, Production Domain & Bàn Giao (24/08/2026 – 28/08/2026)

| Mã Ticket | Title Công Việc | Nội Dung Chi Tiết Kỹ Thuật | Ánh Xạ PM | ETA FE | ETA BE | ETA Hoàn Thành | Definition of Done (DoD) |
|---|---|---|---|---|---|---|---|
| **DEV-301** | **Tích hợp Thanh Toán Thật (Bên Anh Tô)** | Kết nối Webhook thanh toán VietQR / PayOS / Visa live mode (nhờ Tô hỗ trợ cổng thanh toán). | Payment Live | 4 Hours | 12 Hours | **26/08/2026** | - NhậnCallback/Webhook tự động cập nhật trạng thái đơn.<br>- Kiểm tra đối soát tiền chuyển về tài khoản doanh nghiệp. |
| **DEV-302** | **Production Domain, SSL & DNS** | Trỏ DNS tên miền chính thức `thenamduhill.com`, cấu hình SSL HTTPS Vercel & bản ghi DKIM/SPF SendGrid. | Technical Setup | 2 Hours | 6 Hours | **27/08/2026** | - Truy cập `https://thenamduhill.com/` ổn định, SSL xanh.<br>- Nâng cấp gói Supabase Pro. |
| **DEV-303** | **Đào Tạo Lễ Tân & Bàn Giao Hệ Thống** | Hướng dẫn Lễ tân thao tác CMS Admin: gán phòng, tạo đơn điện thoại, kiểm tra thanh toán, nhận phòng / trả phòng. | Handover | 4 Hours | 4 Hours | **28/08/2026** | - Lễ tân tự chủ vận hành 100% hệ thống.<br>- Ký biên bản nghiệm thu & bàn giao tài khoản Admin chính thức. |

---

# PHẦN 3: BẢNG TỔNG HỢP RỦI RO KỸ THUẬT & GIẢI PHÁP TRIỂN KHAI (FULL TECH RISK MATRIX)

| Mã Rủi ro | Tương ứng Case PM | Tên rủi ro nghiệp vụ | Mô tả tình huống & Hậu quả | Giải pháp xử lý Kỹ thuật (Dev) | Phương án Vận hành (Lễ tân) |
|---|---|---|---|---|---|
| **BR-01** | **B-01** | **Double Booking (Đụng trùng phòng)** | 2 khách trên 2 thiết bị bấm cọc căn phòng cuối cùng ở cùng 1 giây. | Dùng **Postgres Row-level Locking (`SELECT FOR UPDATE`)** trong `create_booking_atomic()` khóa phòng tạm 15 phút. | Khách thanh toán thành công trước giữ phòng, khách sau được hoàn cọc trong 5 phút. |
| **BR-02** | **B-01** | **Hold Time Expiry (Khóa phòng ảo)** | Khách tạo QR cọc nhưng bỏ đi không thanh toán. | **Auto-Expire Cron Job / Supabase Edge Function**: Tự động chuyển đơn sang `EXPIRED` sau 15 phút (theo Bank QR Timeout) và nhả kho phòng. | Không cần thao tác thủ công. Hệ thống tự động nhả kho phòng. |
| **BR-03** | **B-02** | **Manual OTA Sync Delay (Đụng phòng Agoda)** | Khách đặt Agoda lúc 2h sáng, Lễ tân ngủ chưa khóa CMS. | Tạo **Nút Khóa Phòng Khẩn Cấp (Emergency Lock)** trên CMS di động + giữ 1-2 phòng đệm (Buffer). | Website chính thức có quyền ưu tiên. Lễ tân liên hệ Agoda xin xếp phòng tương đương. |
| **BR-04** | **C-01** | **Fake Payment Callback (Giả mạo Webhook)** | Kẻ xấu gọi giả lập API `/api/webhooks/payment` báo "Đã cọc". | Bắt buộc kiểm tra **Chữ ký điện tử HMAC-SHA256** từ cổng thanh toán và đối soát `transaction_id`. | Lễ tân kiểm tra biến động số dư ngân hàng doanh nghiệp trước khi giao phòng. |
| **BR-05** | **O-01** | **Unauthorized Privilege Escalation (Vượt quyền)** | Lễ tân cố tình gọi API chỉnh sửa giá phòng gốc hoặc xóa tài khoản. | **JWT Access Token & Refresh Token + Next.js Middleware Guard**: Kiểm tra cờ `role` trên server-side. Trả về `403 Forbidden` nếu không phải `SUPERADMIN`. | Lễ tân chỉ được cấp tài khoản role `USER`. |
| **BR-06** | **B-04** | **No-Show Revenue & Room Loss (Khách vắng mặt)** | Khách cọc rồi biến mất không đến, phòng bị giữ ảo qua đêm. | **Cron Job Auto-NoShow**: Tự động chuyển đơn thành `NO_SHOW` và nhả kho phòng lúc 18h00 ngày Check-in nếu không có biến động. | Lễ tân kiểm tra danh sách khách chưa check-in lúc 17h30 để gọi điện nhắc khách. |
| **PR-01** | **P-03** | **Surcharge & Discount Calculation Bug** | Công thức tính % giảm giá trúng cả khoản phụ thu làm thất thoát tiền. | Chuẩn hóa công thức Server-side: **`Total = (BaseRate - Discount) + Surcharges`**. % Discount chỉ áp trên Giá phòng gốc. | Bảng phân rã chi tiết tiền hiển thị rõ trên Email xác nhận và `/lookup`. |
| **PR-02** | **P-06** | **Reschedule Audit Trail Bug** | Khách đổi ngày nhưng tiền chênh lệch không được lưu vết rõ ràng. | Viết API `/api/bookings/reschedule` tính lại tiền chênh lệch và tự động ghi log vào `booking_audit_logs`. | Lễ tân tra cứu lịch sử đổi ngày trực tiếp trên màn hình chi tiết đơn hàng CMS. |
| **PR-03** | **P-07** | **Min-Nights Holiday Bypass (Bỏ qua số đêm Lễ)** | Khách cố tình chọn 1 đêm vào dịp Lễ Tết làm mất doanh thu ngày Lễ. | **Server-side Validation Guard**: Kiểm tra `check_in_date` & `check_out_date` với `min_nights_holiday`. Trả về lỗi 400 Bad Request nếu phạm quy. | Màn hình đặt phòng hiển thị thông báo "Dịp Lễ yêu cầu đặt tối thiểu X đêm". |
