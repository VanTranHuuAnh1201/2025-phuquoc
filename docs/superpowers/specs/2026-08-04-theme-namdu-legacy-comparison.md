# Spec & Báo cáo Đối chiếu 4 Phiên bản Thiết kế — The Nam Du Hill Resort

> **Mục tiêu sản phẩm:** Báo cáo so sánh đối chiếu chi tiết 4 phiên bản mã nguồn & thiết kế của **The Nam Du Hill Resort** dựa trên các spec tương ứng:
> - **Bản 1 (Website hiện tại):** [`2026-08-04-architecture-namduhillresort-v1.md`](./2026-08-04-architecture-namduhillresort-v1.md) (`apps/2026-thenamduhillresort` - PA3 Navy)
> - **Bản 2 (Opus Design):** [`2026-08-04-architecture-namduhillresort-v2.md`](./2026-08-04-architecture-namduhillresort-v2.md) (Coastal Editorial Teal)
> - **Bản 3 (Tropical Bright):** [`2026-08-04-architecture-namduhillresort-v3.md`](./2026-08-04-architecture-namduhillresort-v3.md) (Tropical Bright)
> - **Bản 4 (Sunlit Booking):** [`2026-08-04-architecture-namduhillresort-v4.md`](./2026-08-04-architecture-namduhillresort-v4.md) (Sunlit Coastal Booking - Full CRO & Trust Architecture)
>
> **Trọng tâm kinh doanh:** Booking Conversion Optimization (CRO) — Biến người xem (visitors) thành người đặt phòng (bookers), giải tỏa 100% nỗi sợ lừa đảo và tạo cảm xúc khao khát nghỉ dưỡng nhiệt đới.
> **Quy chuẩn chất lượng:** $10,000 USD Quality Gate theo [the-10k-checklist.md](../../../.claude/rules/the-10k-checklist.md).

---

## 0. Các Tiêu chí Website Booking Đạt Chuẩn $10K USD & Kích thích Đặt phòng

Để một website Booking Resort đạt mức định giá **$10,000 USD** và kích hoạt tâm lý **"Tôi muốn đặt phòng ngay lập tức"**, giao diện thiết kế Figma phải vượt qua **8 nhóm tiêu chí nghiêm ngặt**:

### 1. Thương hiệu & Sức sống Nhiệt đới (Tropical Brand Atmosphere)
- **Tâm lý sắc màu:** Gam màu phải gợi lên biển xanh, nắng vàng, gió mát và sự thư thái. Loại bỏ 100% gam màu công nghiệp tối u buồn làm chết không gian ảnh thiên nhiên.
- **Diện tích ngập sáng (Bright Surface):** Nền trang sáng ngả ấm (`#FDFCF8` / `#FBF9F5`) chiếm **85–90% diện tích** để tôn vinh màu nước biển và chất liệu gỗ mộc resort.

### 2. Typography Phân cấp Thị giác (Visual Hierarchy & Type System)
- **Cặp Font có linh hồn:** Display Serif có cá tính (Lora / Fraunces) cho headline kết hợp với Sans-serif tối ưu 100% tiếng Việt (`Be Vietnam Pro`).
- **Hierarchy rõ ràng:** Hướng mắt người dùng đến thông tin giá và nút đặt phòng một cách tự nhiên mà không cần phải căng mắt đọc.

### 3. Chỉ số Tin tưởng & Giải tỏa Nỗi sợ (Trust Architecture - CRITICAL)
- **Trust Strip ngay sau Hero:** Dải xác thực 4 mục (Chính chủ đồi Củ Tron, Hotline/Zalo `0985 000 650`, Xe resort đón tại bến tàu, Tàu hoãn dời ngày miễn phí).
- **Trả lời Objection số 1 của Nam Du:** Dòng cam kết *"Tàu hoãn do thời tiết: dời ngày miễn phí"* đặt ngay bên cạnh nút Đặt phòng.
- **Pháp lý rõ ràng:** Mã số thuế (MST), tên công ty sở hữu, Zalo OA chính chủ và bản đồ ngọn đồi thực tế.

### 4. Bố cục Chuyển đổi & Quy tắc 1 Màu CTA (CRO & Single Focus - Rule K4)
- **Squint Test (Nheo mắt kiểm tra):** Mỗi màn hình chỉ nổi lên **ĐÚNG 1 điểm nhìn chính** và **ĐÚNG 1 màu nút CTA chính** (`--color-accent` Vàng nắng `#F6B21B`).
- **Màu CTA độc quyền:** Màu vàng nắng CHỈ dùng cho hành động đặt phòng, không dùng tràn lan cho icon hay badge.

### 5. Trải nghiệm Mobile Không Ma sát (Frictionless Mobile UX - Rule K7)
- **Sticky Bottom Booking Bar:** Thanh đặt phòng cố định ở chân trang di động tôn trọng safe-area iOS, kích hoạt tự động khi cuộn qua Hero.
- **Mobile First Hero:** Tiêu đề H1 + Ô tìm phòng nằm trọn trong Viewport 1 (375px), không bắt cuộn mới thấy.
- **Horizontal Snap Gallery / Vertical Rows:** Card phòng di động thiết kế chuẩn ergonomics dễ thao tác bằng ngón tay cái.

### 6. Nhịp điệu Bố cục & Khoảng thở Tạp chí (Editorial Visual Rhythm)
- **Nhịp so le:** Xen kẽ giữa section bán hàng (nhịp nhanh) và section nghỉ thị giác (nhịp chậm — 1 ảnh full-bleed + 1 câu cảm xúc).
- **Khoảng thở đắt tiền:** Spacing rộng 96px–140px tạo cảm giác xa xỉ, thong dong của một resort 5 sao.

### 7. Minh bạch Giá & Phễu 3 Bước (Transparent Pricing & 3-Step Funnel)
- **Phễu 3 bước:** Home (Khám phá) → Rooms (So sánh) → RoomDetail (Quyết định cọc).
- **Bảng breakdown giá 4 dòng:** Tiền phòng + Phụ thu giường/trẻ em + Thành tiền + Số tiền cọc 50% + Số tiền còn lại trả tại quầy.

### 8. Hiệu năng & Khả năng Tiếp cận (Hidden Luxury Performance - Rule K8)
- Tốc độ tải trang LCP < 2 giây, tương phản chuẩn WCAG 2.2 AA (≥ 4.5:1), hỗ trợ bàn phím 100% không bẫy focus.

---

## 1. Bảng So sánh Chi tiết 4 Phiên bản Thiết kế (Focus: Figma UI/UX, CRO & $10K Standard)

| Tiêu chí $10K USD & CRO | Bản 1: Website Hiện tại (`apps/2026-thenamduhillresort`) | Bản 2: Opus Design (`2026-08-04-architecture-v2.md`) | Bản 3: Tropical Bright (`2026-08-04-architecture-v3.md`) | Bản 4: Sunlit Booking (`2026-08-04-architecture-v4.md`) |
|---|---|---|---|---|
| **1. Định vị Thẩm mỹ (Point of View - K1)** | **Luxury Corporate / Hotel phố**<br>• Dáng dấp khách sạn phố.<br>• Đóng khung dán cứng container. | **Coastal Editorial (Ấn phẩm biển)**<br>• Phong cách tạp chí nghỉ dưỡng.<br>• Tông màu ngọc lam trầm tĩnh. | **Tropical Bright (Rực nắng nhiệt đới)**<br>• Buổi sáng rực nắng trên đảo.<br>• Tinh khiết, ngập tràn sức sống. | **Sunlit Coastal Booking (Chốt chuyển đổi)**<br>• Sáng, sạch, chính chủ, dễ đặt phòng.<br>• Cân bằng hoàn hảo giữa Thẩm mỹ & CRO. |
| **2. Bảng màu & Tâm lý Màu sắc (Color Psychology)** | **Deep Midnight Navy + Slate**<br>• Navy `#0B192C` / `#0F2D52`<br>• Nền xám lạnh `#FAFAF8`<br>• **Khách chê: Màu u buồn, tăm tối.** | **Deep Sea Teal + Amber Gold**<br>• Brand Teal `#0E5B63`<br>• Nền Trắng ngà ấm `#FBF9F5`<br>• Đậm đà chất biển ngọc lam. | **Sunny Ocean Blue + Sunny Gold**<br>• Brand Blue `#1173B8`<br>• Nền Trắng ngà `#FDFCF8`<br>• **Sáng rực rỡ, xóa bỏ u buồn.** | **Sunlit Ocean Blue + Sunlit Gold**<br>• Brand Blue `#1173B8` (Khớp logo `OP5.png`)<br>• Nền ngà sáng **85–90% diện tích**<br>• **Vàng nắng `#F6B21B` duy nhất cho CTA.** |
| **3. Typography & Phông chữ (K2)** | **Serif hỗn hợp + Sans**<br>• Heading: `Playfair Display`<br>• Body: `Inter`<br>• Thiếu sự chỉn chu cho tiếng Việt. | **Display Serif thủ công + Sans Việt**<br>• Heading: `Fraunces` (Trục SOFT/WONK)<br>• Body: `Be Vietnam Pro`<br>• Độc bản hoang sơ. | **Display Serif thanh lịch + Sans Việt**<br>• Heading: `Lora` (Thanh lịch)<br>• Body: `Be Vietnam Pro`<br>• Chuẩn ấn phẩm du lịch. | **Display Serif cao cấp + Sans Việt**<br>• Heading: `Lora` (Nét uốn sang trọng)<br>• Body: `Be Vietnam Pro`<br>• Đạt WCAG 2.2 AA tương phản ≥ 4.5:1. |
| **4. Quy tắc Nút CTA (CRO K4)** | **Nút bấm rải rác nhiều màu**<br>• Nút Blue `#2563A6`, nút Gold rải rác.<br>• Tranh chấp điểm nhìn thị giác. | **Quy tắc 1 Màu Accent**<br>• Vàng nghệ `#E8A317` chỉ cho CTA đặt phòng.<br>• Nheo mắt thấy điểm bấm. | **Tuyệt đối hóa 1 Chấm Vàng**<br>• Vàng nắng `#F6B21B` CHỈ dùng cho CTA chính.<br>• Mỗi màn hình 1 nút vàng. | **CTA Vàng nắng Độc quyền**<br>• Vàng nắng `#F6B21B` **CHỈ dùng cho 3 nút đặt phòng chính** ("Chọn ngày", "Chọn phòng", "Đặt phòng"). |
| **5. Định danh & Trust Gate** | **Yếu**<br>• Thông tin Footer đơn giản.<br>• Khách sợ lừa đảo qua web giả. | **Khá**<br>• Thêm khối MST & Zalo OA.<br>• Chưa giải quyết nỗi sợ tàu hoãn. | **Tối thượng (Trust Architecture)**<br>• Hero định danh chính chủ.<br>• Cam kết dời ngày khi tàu hoãn gần nút Đặt. | **Trust Architecture Toàn diện**<br>• **Dải Trust Strip 4 mục** ngay sau Hero.<br>• Cam kết dời ngày do thời tiết nằm TRONG Booking Panel.<br>• Zalo placeholder có kiểm soát. |
| **6. Trải nghiệm Mobile (Mobile CRO - K7)** | **Form Tìm phòng 2 hàng**<br>• Sticky bottom CTA cơ bản.<br>• Form tìm phòng mobile chiếm diện tích. | **Mobile Snap Gallery**<br>• Form Hero thu 1 nút → Bottom-sheet.<br>• Card phòng cuộn ngang snap. | **Mobile First Funnel**<br>• Hero H1 + Nút tìm phòng nằm trọn **Viewport 1 (375px)**.<br>• Sticky bottom bar + Bottom-sheet. | **Mobile Booking Ergonomics**<br>• Viewport 1 (375px) hiển thị trọn H1 + Widget 1 nút.<br>• Sticky Bottom Bar + Bottom-sheet tự đóng mở mượt.<br>• Nút bấm ≥ 44px. |
| **7. Nhịp điệu Bố cục (Visual Rhythm)** | **Lưới đều chằn chặn**<br>• Section nào cũng lặp ô card nổi 18px.<br>• Gây mệt mỏi thị giác khi cuộn. | **Nhịp so le Ấn phẩm**<br>• Section `Places` 1 ảnh full-bleed 60vh + 1 câu mô tả.<br>• Khoảng thở lớn 96px - 140px. | **Bố cục Phễu Chuyển đổi**<br>• Home → Rooms → RoomDetail.<br>• Khối "Đường ra đảo" cát ấm `#F7F0E4`. | **Bố cục Phễu CRO 3 Bước Hoàn chỉnh**<br>• Home (Khám phá & Trust Strip) → Rooms (Row comparison) → RoomDetail (Booking Panel sticky).<br>• Nhịp thở cân đối. |
| **8. Xử lý Hạng phòng & Bảng Giá (CRO Rooms)** | **Card Lưới 3 Cột**<br>• Ảnh nén khung `16:10`.<br>• Chỉ có giá khởi điểm đơn giản. | **Card 3 Cột Ngang**<br>• Ảnh `4:5` tôn dáng phòng.<br>• Giá đếm theo đêm. | **Hàng ngang So sánh (Rooms Page)**<br>• Mỗi hạng phòng 1 hàng ngang.<br>• Date Bar dính top tính giá theo ngày thật. | **Row Comparison + Bảng Gộp 7 Hạng**<br>• Hàng ngang so sánh rõ nét.<br>• Gộp 20 phòng crawl thành 7 nhóm/hạng minh bạch.<br>• Bảng giá đếm theo đêm & tổng tiền. |
| **9. Chi tiết Đặt phòng (RoomDetail UX)** | **Chỉ có Popup AJAX**<br>• Không có trang chi tiết phòng riêng.<br>• SEO phòng = 0, không share link được. | **Slot RoomDetail cơ bản**<br>• Đã có trang chi tiết phòng nhưng thông tin còn sơ khai. | **Booking-First Panel (RoomDetail)**<br>• Panel sticky phải (5fr) hiển thị breakdown giá 4 dòng.<br>• Thang huỷ 7 ngày/3 ngày. | **Ultra-Conversion Booking Panel**<br>• Breakdown 4 dòng giá (Tiền phòng + Giường phụ + Cọc 50% + Trả tại quầy).<br>• Dòng cam kết tàu hoãn sát cạnh nút bấm 48px. |
| **10. Kết quả Chuyển đổi Booking (CRO Score)** | ❌ **Bị Reject** ("Màu u buồn, tăm tối, không đặc biệt") | 🟡 **Khá** (Đẹp ấn phẩm nhưng màu teal còn trầm) | 🟢 **Rất Tốt** (Sáng rực nắng, phễu chuyển đổi rõ ràng) | 🎯 **ĐỈNH CAO CRO & $10K GATE** (Sáng ngập nắng, Đáng tin tuyệt đối, Tối ưu chuyển đổi) |

---

## 2. Phân tích Chi tiết 4 Đột phá CRO Nổi bật Trong Bản 4 (Sunlit Booking)

### 2.1 Đột phá 1: Tối ưu Hóa Nhận diện Thương hiệu & Màu sắc (Brand & Color Harmony)
- **Điểm yếu ở các bản trước:** Bản 1 lạm dụng Navy tối `#0B192C` làm u buồn; Bản 2 dùng màu Ngọc lam trầm `#0E5B63` đôi khi hơi lệch tông với logo chính `OP5.png` (Xanh biển rực).
- **Giải pháp Bản 4 (Sunlit Coastal Booking):**
  - Sử dụng màu **Sunny Ocean Blue (`#1173B8`)** lấy cảm hứng trực tiếp từ logo `OP5.png`, tinh chỉnh độ đậm để đạt tỷ lệ tương phản WCAG 2.2 AA (≥ 4.9:1).
  - Giữ nền ngà sáng (`#FDFCF8`) chiếm **85–90% diện tích trang**, giúp bức ảnh resort biển ngập tràn ánh nắng tự nhiên.

---

### 2.2 Đột phá 2: Khối Trust Strip 4 Mục Ngay Sau Hero (Hero Trust Architecture)
Ngay sau khi cuộn qua Hero Banner, người dùng gặp ngay **Dải Xác thực 4 Mục (Trust Strip)** để giải tỏa tức thì tâm lý nghi ngại về web giả mạo:
1. *Chính chủ:* "The Nam Du Hill Resort · Ấp Củ Tron, Đặc Khu Kiên Hải"
2. *Hotline/Zalo:* `0985 000 650` (Bấm gọi 1-touch)
3. *Đưa đón:* "Xe resort đón miễn phí tại cầu cảng"
4. *Thời tiết:* "Tàu hoãn do thời tiết: Hỗ trợ dời ngày miễn phí"

---

### 2.3 Đột phá 3: Xử lý Bảng Gộp 7 Hạng Phòng từ 20 Phòng Crawl (`/h5/rooms`)
Bản 4 đề xuất giải pháp gộp 20 phòng crawl nhỏ lẻ thành **7 Hạng phòng lớn minh bạch** để người dùng không bị "ngợp" thông tin:
- **Standard Double:** Gộp phòng #02, #03-04, #05, #15 (`1.546.000đ - 1.587.000đ/đêm`)
- **Deluxe / Rock Double:** Gộp phòng #06, #10, #12, #14 (`1.776.000đ/đêm`)
- **Triple Balcony/View:** Gộp phòng #17, #18 (`2.411.000đ/đêm`)
- **Superior King:** Phòng #07 (53m² cực lớn - `2.971.000đ/đêm`)
- **Family Sea View:** Gộp phòng #01, #08, #09, #11, #13, #16 (`3.088.000đ/đêm`)
- **Suite 2BR 6 Guests:** Gộp phòng #10-11, #15-16 (`4.287.000đ/đêm`)
- **Suite 2BR 8 Guests:** Phòng #08-09 (`5.662.000đ/đêm`)

---

### 2.4 Đột phá 4: Phân rã Cọc 50% & Trả tại quầy minh bạch (RoomDetail Booking Panel)
Panel đặt phòng sticky cột phải trong Bản 4 phân rã tài chính cực kỳ sòng phẳng:
- *Tiền phòng (2 đêm):* `3.092.000đ`
- *Phụ thu giường phụ / trẻ em:* `410.000đ`
- *Cọc trả khi đặt (50%):* `1.751.000đ`
- *Số tiền còn lại trả tại quầy resort:* `1.751.000đ`
- *Dòng nổi bật bên cạnh nút bấm:* **"⛴ Tàu hoãn do thời tiết: DỜI NGÀY MIỄN PHÍ"**
- *Ghi chú sau nút bấm:* "Lễ tân sẽ nhắn Zalo xác nhận trong 30 phút".

---

## 3. Lộ trình Triển khai Chuẩn $10K USD cho Bản 4

1. **Khởi chạy Package `@repo/theme-namdu` (Slug `/h5`):** Cấu hình `tokens.css` theo Option A (*Sunlit Coastal Booking*), hỗ trợ `tokens.fresh.css` (Option B - *Fresh Island Editorial*) để làm bản so sánh khi trình khách.
2. **Triển khai Phễu 3 trang hoàn chỉnh:**
   - Step 1: `Home` (Hero + Trust Strip 4 mục + Khối "Đường ra đảo")
   - Step 2: `/h5/rooms` (Trang so sánh hàng ngang 7 hạng phòng + Sticky Date Bar)
   - Step 3: `/h5/rooms/[slug]` (Trang chi tiết phòng + Booking Panel sticky phân rã cọc 50%)
3. **Kiểm tra Quality Gate $10K USD:** Đảm bảo 100% lint/typecheck sạch, tương phản WCAG 2.2 AA đạt ≥ 4.5:1 và tốc độ LCP < 2 giây.
