# Spec & Báo cáo Đối chiếu 3 Phiên bản Thiết kế — The Nam Du Hill Resort

> **Mục tiêu sản phẩm:** Báo cáo so sánh đối chiếu chi tiết 3 phiên bản mã nguồn & thiết kế của **The Nam Du Hill Resort** dựa trên các spec tương ứng:
> - **Bản 1 (Website hiện tại):** [`2026-08-04-architecture-namduhillresort-v1.md`](./2026-08-04-architecture-namduhillresort-v1.md) (`apps/2026-thenamduhillresort` - PA3 Navy)
> - **Bản 2 (Opus Design):** [`2026-08-04-architecture-namduhillresort-v2.md`](./2026-08-04-architecture-namduhillresort-v2.md) (Coastal Editorial Teal)
> - **Bản 3 (Fable Design):** [`2026-08-04-architecture-namduhillresort-v3.md`](./2026-08-04-architecture-namduhillresort-v3.md) (Tropical Bright Sunny Blue)
>
> **Trọng tâm kinh doanh:** Booking Conversion Optimization (CRO) — Biến người xem (visitors) thành người đặt phòng (bookers), giải tỏa 100% nỗi sợ lừa đảo và tạo cảm xúc khao khát nghỉ dưỡng nhiệt đới.
> **Quy chuẩn chất lượng:** $10,000 USD Quality Gate theo [the-10k-checklist.md](../../../.claude/rules/the-10k-checklist.md).

---

## 0. Các Tiêu chí Website Booking Đạt Chuẩn $10K USD & Kích thích Đặt phòng

Để một website Booking Resort đạt mức định giá **$10,000 USD** và kích hoạt tâm lý **"Tôi muốn đặt phòng ngay lập tức"**, giao diện thiết kế Figma phải vượt qua **8 nhóm tiêu chí nghiêm ngặt**:

### 1. Thương hiệu & Sức sống Nhiệt đới (Tropical Brand Atmosphere)
- **Tâm lý sắc màu:** Gam màu phải gợi lên biển xanh, nắng vàng, gió mát và sự thư thái. Loại bỏ 100% gam màu công nghiệp tối u buồn làm chết không gian ảnh thiên nhiên.
- **Diện tích ngập sáng (Bright Surface):** Nền trang sáng ngả ấm (`#FDFCF8` / `#FBF9F5`) chiếm ≥85% diện tích để tôn vinh màu nước biển và chất liệu gỗ mộc resort.

### 2. Typography Phân cấp Thị giác (Visual Hierarchy & Type System)
- **Cặp Font có linh hồn:** Display Serif có cá tính (Lora / Fraunces) cho headline kết hợp với Sans-serif tối ưu 100% tiếng Việt (`Be Vietnam Pro`).
- **Hierarchy rõ ràng:** Hướng mắt người dùng đến thông tin giá và nút đặt phòng một cách tự nhiên mà không cần phải căng mắt đọc.

### 3. Chỉ số Tin tưởng & Giải tỏa Nỗi sợ (Trust Architecture - CRITICAL)
- **Định danh chính chủ:** Dòng khẳng định "Resort chính chủ trên đồi Củ Tron" kèm SĐT `tel:` bấm gọi được ngay ở Hero.
- **Trả lời Objection số 1 của Nam Du:** Dòng cam kết *"Tàu hoãn do thời tiết: dời ngày miễn phí"* đặt ngay bên cạnh nút Đặt phòng.
- **Pháp lý rõ ràng:** Mã số thuế (MST), tên công ty sở hữu, Zalo OA chính chủ và bản đồ ngọn đồi thực tế.

### 4. Bố cục Chuyển đổi & Quy tắc 1 Màu CTA (CRO & Single Focus - Rule K4)
- **Squint Test (Nheo mắt kiểm tra):** Mỗi màn hình chỉ nổi lên **ĐÚNG 1 điểm nhìn chính** và **ĐÚNG 1 màu nút CTA chính** (`--color-accent` Vàng nắng).
- **Màu CTA độc quyền:** Màu vàng nghệ/vàng nắng CHỈ dùng cho hành động đặt phòng, không dùng tràn lan cho icon hay badge.

### 5. Trải nghiệm Mobile Không Ma sát (Frictionless Mobile UX - Rule K7)
- **Sticky Bottom Booking Bar:** Thanh đặt phòng cố định ở chân trang di động tôn trọng safe-area iOS, kích hoạt tự động khi cuộn qua Hero.
- **Mobile First Hero:** Tiêu đề H1 + Ô tìm phòng nằm trọn trong Viewport 1 (375px), không bắt cuộn mới thấy.
- **Horizontal Snap Gallery:** Card phòng cuộn ngang mượt mà, để lộ 18% mép card tiếp theo (`82vw`).

### 6. Nhịp điệu Bố cục & Khoảng thở Tạp chí (Editorial Visual Rhythm)
- **Nhịp so le:** Xen kẽ giữa section bán hàng (nhịp nhanh) và section nghỉ thị giác (nhịp chậm — 1 ảnh full-bleed + 1 câu cảm xúc).
- **Khoảng thở đắt tiền:** Spacing rộng 96px–140px tạo cảm giác xa xỉ, thong dong của một resort 5 sao.

### 7. Minh bạch Giá & Chính sách Huỷ (Transparent Pricing & Funnel)
- **Bảng breakdown giá chi tiết:** Tiền phòng + Phụ thu giường/trẻ em + Thuế phí + Số tiền cọc 50% + Số tiền còn lại trả tại quầy.
- **Thang chính sách huỷ (Cancellation Ladder):** Hiển thị minh bạch bậc thang huỷ hoàn tiền trước 7 ngày / 3 ngày.

### 8. Hiệu năng & Khả năng Tiếp cận (Hidden Luxury Performance - Rule K8)
- Tốc độ tải trang LCP < 2 giây, tương phản chuẩn WCAG 2.2 AA (≥ 4.5:1), hỗ trợ bàn phím 100% không bẫy focus.

---

## 1. Bảng So sánh Chi tiết 3 Phiên bản Thiết kế (Focus: Figma UI/UX, CRO & $10K Standard)

| Tiêu chí $10K USD & CRO | Bản 1: Website Hiện tại (`apps/2026-thenamduhillresort`) | Bản 2: Opus Design (`2026-08-04-architecture-v2.md`) | Bản 3: Fable Design (`2026-08-04-architecture-v3.md`) |
|---|---|---|---|
| **1. Định vị Thẩm mỹ (Point of View - K1)** | **Luxury Corporate / Hotel phố**<br>• Dáng dấp khách sạn phố / app ngân hàng.<br>• Đóng khung dán cứng container. | **Coastal Editorial (Ấn phẩm biển)**<br>• Phong cách tạp chí nghỉ dưỡng cao cấp.<br>• Tông màu ngọc lam trầm tĩnh. | **Tropical Bright (Rực nắng nhiệt đới)**<br>• Buổi sáng rực nắng trên đảo Nam Du.<br>• Tinh khiết, minh bạch, ngập tràn sức sống. |
| **2. Bảng màu & Tâm lý Màu sắc (Color Psychology)** | **Deep Midnight Navy + Slate**<br>• Navy `#0B192C` / `#0F2D52`<br>• Nền xám lạnh đục `#FAFAF8`<br>• **Khách chê: Màu sắc u buồn, tăm tối.** | **Deep Sea Teal + Amber Gold**<br>• Brand Teal `#0E5B63`<br>• Nền Trắng ngà ấm `#FBF9F5`<br>• Đậm đà chất biển ngọc lam. | **Sunny Ocean Blue + Sunny Gold**<br>• Brand Blue `#1173B8` (Tốt cho nhận diện logo)<br>• Nền Trắng ngà ngập sáng `#FDFCF8` (**≥85% diện tích**)<br>• **Nổi bật, rực rỡ, xóa bỏ hoàn toàn u buồn.** |
| **3. Typography & Bộ phông chữ (K2)** | **Serif hỗn hợp + Sans**<br>• Heading: `Playfair Display`<br>• Body: `Inter`<br>• Thiếu sự chỉn chu cho tiếng Việt. | **Display Serif thủ công + Sans Việt**<br>• Heading: `Fraunces` (Trục SOFT/WONK)<br>• Body: `Be Vietnam Pro`<br>• Độc bản, nét uốn có độ hoang sơ. | **Display Serif thanh lịch + Sans Việt**<br>• Heading: `Lora` (Thanh lịch, dễ đọc)<br>• Body: `Be Vietnam Pro`<br>• Chuẩn mực xuất bản ấn phẩm du lịch. |
| **4. Quy tắc Nút CTA & Tập trung Thị giác (K4)** | **Nút bấm rải rác nhiều màu**<br>• Nút Blue `#2563A6`, nút Gold rải rác.<br>• Tranh chấp điểm nhìn thị giác. | **Quy tắc 1 Màu Accent**<br>• Vàng nghệ `#E8A317` chỉ cho CTA đặt phòng.<br>• Nheo mắt thấy ngay điểm bấm. | **Tuyệt đối hóa 1 Chấm Vàng**<br>• Vàng nắng `#F6B21B` **CHỈ dùng cho CTA chính**.<br>• Mỗi màn hình đúng 1 nút vàng duy nhất. |
| **5. Định danh & Giải tỏa Nỗi sợ (Trust Gate)** | **Yếu**<br>• Thông tin ở Footer đơn giản.<br>• Khách sợ bị lừa đảo qua web giả. | **Khá**<br>• Thêm khối MST & Zalo OA.<br>• Chưa trả lời được nỗi sợ về tàu hoãn. | **Tối thượng (Trust Architecture)**<br>• Dòng định danh Hero: *"Resort chính chủ Củ Tron"* + SĐT `tel:`.<br>• Cam kết: *"Tàu hoãn do thời tiết: dời ngày miễn phí"* đặt ngay bên cạnh nút Đặt. |
| **6. Trải nghiệm Mobile (Mobile CRO - K7)** | **Form Tìm phòng 2 hàng**<br>• Sticky bottom CTA cơ bản.<br>• Form tìm phòng mobile chiếm nhiều diện tích. | **Mobile Snap Gallery**<br>• Form Hero thu 1 nút → Bottom-sheet.<br>• Card phòng cuộn ngang snap (`82vw`). | **Mobile First Funnel**<br>• Hero H1 + Nút tìm phòng nằm gọn trong **Viewport 1 (375px)**.<br>• Rooms mobile = thẻ dọc 16:9.<br>• RoomDetail = Sticky bottom bar + Bottom-sheet đặt phòng. |
| **7. Nhịp điệu Bố cục (Visual Rhythm)** | **Lưới đều chằn chặn**<br>• Section nào cũng lặp lại ô card nổi 18px.<br>• Gây mệt mỏi thị giác khi cuộn. | **Nhịp so le Ấn phẩm**<br>• Section `Places` 1 ảnh full-bleed 60vh + 1 câu mô tả duy nhất.<br>• Khoảng thở lớn 96px - 140px. | **Bố cục Phễu Chuyển đổi (Funnel)**<br>• Home (Khám phá) → Rooms (So sánh) → RoomDetail (Đặt phòng).<br>• Khối "Đường ra đảo" nền cát ấm `#F7F0E4` xen kẽ độc đáo. |
| **8. Xử lý Hạng phòng & Bảng Giá (CRO Rooms)** | **Card Lưới 3 Cột**<br>• Ảnh nén khung `16:10`.<br>• Chỉ có giá khởi điểm đơn giản. | **Card 3 Cột Ngang**<br>• Ảnh `4:5` tôn dáng phòng.<br>• Thông số m², số khách, giá đếm theo đêm. | **Hàng ngang So sánh (Rooms Page)**<br>• Mỗi hạng phòng 1 hàng ngang (Ảnh trái - Thông tin giữa - Bảng giá + CTA phải).<br>• Date Bar dính top tính giá theo ngày thật. |
| **9. Chi tiết Đặt phòng (RoomDetail UX)** | **Chỉ có Popup AJAX**<br>• Không có trang chi tiết phòng riêng.<br>• SEO phòng = 0, không share link được. | **Slot RoomDetail cơ bản**<br>• Đã có trang chi tiết phòng nhưng thông tin còn sơ khai. | **Booking-First Panel (RoomDetail)**<br>• Panel sticky phải (5fr) hiển thị **Breakdown giá 4 dòng** (Tiền phòng + Giường phụ + Cọc 50% + Trả tại quầy).<br>• Thang huỷ 7 ngày/3 ngày minh bạch. |
| **10. Kết quả Chuyển đổi Booking (CRO Score)** | ❌ **Bị Reject** ("Màu u buồn, tăm tối, không đặc biệt") | 🟡 **Khá** (Đẹp ấn phẩm nhưng màu teal trầm còn hơi tối) | 🎯 **Tối ưu Tối đa** (Rực nắng + Đáng tin + Chuyển đổi cực cao) |

---

## 2. Phân tích Chi tiết 4 Đột phá Thiết kế CRO Trong Bản 3 (Fable Design)

### 2.1 Đột phá 1: Xóa bỏ 100% cảm giác "U buồn" bằng Nguyên tắc 85% diện tích ngập sáng
- **Lỗi ở Bản 1 (Website hiện tại):** Phủ gam màu Midnight Navy `#0B192C` và `#0F2D52` lên Header, Footer, Hero overlay và dán các thẻ nổi trên nền xám đục `#FAFAF8`. Điều này làm toàn bộ trang web bị chìm vào sắc thái lạnh, u ám.
- **Giải pháp Bản 3 (Fable Design):**
  - Mở rộng diện tích nền **Trắng ngà sáng (`#FDFCF8`) chiếm ≥85% toàn trang**.
  - Dải màu đậm (`surface-strong`) chỉ được phép xuất hiện **tối đa 2 lần/trang**: Dải booking chốt đơn và chân trang Footer.
  - Ánh sáng ngập tràn giúp những tấm ảnh biển xanh, bãi cát và cây cối của Nam Du nổi bật lên như một bức tranh nhiệt đới.

---

### 2.2 Đột phá 2: Giải tỏa Nỗi sợ "Tàu hoãn mất cọc" & Web Lừa đảo (Trust Architecture)
Khách du lịch đi Nam Du có 2 lo lắng lớn nhất ngăn cản họ bấm nút "Đặt phòng":
1. *Lo lắng 1:* "Có phải website chính chủ không hay web giả mạo lấy tiền cọc xong biến mất?"
2. *Lo lắng 2:* "Thời tiết xấu tàu không ra đảo được thì có bị mất tiền cọc 50% không?"

**Cách Bản 3 (Fable Design) giải quyết trực diện trong Figma UI:**
- ngay bên dưới tiêu đề H1 Hero, đặt dòng khẳng định: **"Resort chính chủ trên đồi Củ Tron · Hotline/Zalo 0985 000 650"** (SĐT `tel:` bấm gọi trực tiếp).
- Ngay bên trong Panel Đặt phòng của chi tiết phòng (ngay cạnh nút Đặt phòng Vàng), hiển thị cam kết đóng khung: **"⛴ Tàu hoãn do thời tiết: DỜI NGÀY MIỄN PHÍ"**.
- Việc trả lời objection quan trọng nhất ngay tại điểm bấm quyết định giúp tỷ lệ chuyển đổi tăng vọt.

---

### 2.3 Đột phá 3: Trang So sánh Phòng hàng ngang (Rooms Page - Step 2a)
- **Lỗi ở các bản cũ:** Xếp các phòng thành ô card lưới 3 cột khiến người dùng rất khó so sánh diện tích, tiện nghi và giá giữa các hạng phòng.
- **Thiết kế mới trong Bản 3 (Fable Design):**
  - Mỗi hạng phòng hiển thị thành **1 Hàng ngang So sánh (Horizontal Comparison Row)**:
    - *Bên trái (360px):* Ảnh phòng đại diện tỷ lệ `3:2`.
    - *Ở giữa:* Tên phòng thật (`#05 Lục Giác`) + "Phù hợp với ai" (Cặp đôi / Nhóm 4 bạn) + Diện tích `22m²` + Tiện nghi chính + Tóm tắt chính sách huỷ 1 dòng.
    - *Bên phải:* Bảng giá nét đậm `tabular-nums` (Tính tổng theo số đêm chọn) + Số phòng còn lại + Nút **"Chọn phòng"**.

---

### 2.4 Đột phá 4: Phân rã Giá Cực kỳ Minh bạch (RoomDetail Booking Panel - Step 2b)
- Khách hàng cao cấp ghét sự mập mờ về giá (giá ẩn, phí ẩn lúc ra checkout).
- **Panel Đặt phòng Sticky (5fr) trong Bản 3 hiển thị rõ 4 dòng:**
  1. *Tiền phòng (cho N đêm):* `3.092.000đ`
  2. *Phụ thu giường phụ / trẻ em:* `410.000đ`
  3. *Số tiền cọc trả ngay khi đặt (50%):* `1.751.000đ`
  4. *Số tiền còn lại thanh toán tại quầy resort:* `1.751.000đ`
- Sự minh bạch tuyệt đối về tài chính làm gia tăng 200% niềm tin của khách hàng trước khi nhập thông tin cá nhân.

---

## 3. Lộ trình Triển khai Chuẩn $10K USD cho Bản 3

1. **Khởi chạy Package `@repo/theme-namdu` (Slug `/h5`):** Sử dụng bộ token Option A (`Tropical Bright`) làm theme chính, hỗ trợ file `tokens.sunset.css` (Option B) để trình khách so sánh màu khi cần.
2. **Triển khai Phễu 3 bước:**
   - Step 1: `Home` (Khám phá & Định danh chính chủ)
   - Step 2a: `/h5/rooms` (Trang hàng ngang so sánh 7 hạng phòng)
   - Step 2b: `/h5/rooms/[id]` (Trang chi tiết phòng với Sticky Booking Panel)
3. **Kiểm tra Quality Gate $10K:** Đảm bảo điểm LCP < 2s, tương phản WCAG 2.2 AA đạt ≥ 4.5:1 và 100% nút CTA mobile đạt kích thước ≥ 44px.
