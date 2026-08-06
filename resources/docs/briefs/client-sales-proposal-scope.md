# Tài Liệu Scope Dự Án & Kế Hoạch Triển Khai (The Nam Du Hill Resort)

> **Link Demo (GD1+GD2)**: `https://2026-thenamduhill.vercel.app/`  
> **Website Chính Thức GD3**: `https://thenamduhill.com/`  
> **Áp dụng cho**: PM / Account Executive dùng để chốt Phạm vi công việc (Scope) & Phỏng vấn chốt chính sách thực tế với Chủ Resort  
> **Tiêu chí tài liệu**: Chuẩn hóa 100% nhất quán nội bộ, Bảng Master Matrix phỏng vấn phủ đủ 15 Cases, Bảng Phân quyền 3 cấp (SuperAdmin/Admin/User) & Bảng Ma trận chức năng chi tiết.

---

# PHẦN 1: TÓM TẮT DỰ ÁN & LỘ TRÌNH TRIỂN KHAI

## 1.1 Lộ Trình 3 Giai Đoạn & Thời Gian Hoàn Thành (ETA)

| Giai đoạn | Mục tiêu chính | Thời gian (ETA) | Nguồn dữ liệu | Thanh toán & Thông báo |
|---|---|---|---|---|
| **GIAI ĐOẠN 1 (GD1)** | **Mockup Full** giao diện Client (Theme H3) & CMS Admin chuẩn nghiệp vụ booking OTA cơ bản. | **Thứ 2, 10/08/2026** | DB Supabase / Mockup | Hiển thị thông tin thanh toán (Số tài khoản / QR / Thẻ / Trực tiếp). |
| **GIAI ĐOẠN 2 (GD2)** | **API Full**, hoàn thiện kết nối Cơ sở dữ liệu Supabase DB & SendGrid Email tự động. | **Thứ 2, 17/08/2026** | Supabase DB (PostgreSQL) | API xác nhận thanh toán & chuyển trạng thái đơn hàng. |
| **GIAI ĐOẠN 3 (GD3)** | **Bàn giao & Go-Live** tên miền chính thức `thenamduhill.com`, đào tạo Lễ tân. | **24/08 – 28/08/2026** | Supabase Pro Production | Kích hoạt cổng thanh toán thật (bên Anh Tô hỗ trợ) & Bàn giao. |

### 1.1.1 Tối giản hóa theo Nghiệp vụ Booking OTA Cơ bản
Theo chỉ đạo mới nhất, dự án **loại bỏ các thủ tục rườm rà** để tập trung hoàn thiện xuất sắc luồng OTA tiêu chuẩn trước mốc **10/08/2026**:
* Khách chọn ngày, chọn hạng phòng, điền thông tin người đặt.
* Màn hình thanh toán đơn giản: Hiển thị đầy đủ thông tin tài khoản ngân hàng / QR chuyển khoản / Thẻ / Trực tiếp để khách đăng ký thông tin.
* Quản lý đơn hàng CMS cho Lễ tân theo đúng chuẩn vận hành resort nhẹ nhàng, trực quan.

---

## 1.2 Quản Trị Rủi Ro Hành Chính (Khởi động ngay, song song với quá trình phát triển)

> Ba hạng mục dưới đây là **thủ tục hành chính bên ngoài**, thời gian không rút ngắn được bằng nhân lực lập trình. Cần Resort khởi động **ngay từ bây giờ**, không chờ đến đúng giai đoạn.

| # | Mã rủi ro | Thời gian thủ tục | Phương án xử lý | Bên chịu trách nhiệm |
|---|---|---|---|---|
| R1 | **Cổng thanh toán VietQR / Visa** | 5 – 15 ngày làm việc | Đăng ký tài khoản Merchant doanh nghiệp. Bản giao ngày 10/08 giả lập thanh toán thành công nên **không bị trễ tiến độ**; cổng thật kích hoạt ở GD3. | Resort cung cấp hồ sơ · **Anh Tô hỗ trợ kết nối** |
| R2 | **SMS Brandname nhà mạng** | 7 – 15 ngày làm việc | **Tuỳ chọn**: Nếu chưa duyệt Brandname kịp ngày 10/08, dự án **bỏ qua SMS, chỉ dùng Email SendGrid**. Không lùi tiến độ vì lý do này. | Resort cung cấp GPKD với nhà mạng |
| R3 | **Nội dung & Hình ảnh chính thức** | Phụ thuộc lịch chụp ảnh | Resort cung cấp bộ ảnh HD & nội dung bài viết trước khi Go-Live GD3. **Đây là điều kiện bắt buộc để bàn giao** — bản demo đang dùng nội dung tham chiếu, không được phép đưa lên tên miền chính thức. | Resort cung cấp bộ ảnh & nội dung |
| R4 | **Tài khoản ngân hàng doanh nghiệp** | Theo lịch của Resort | Tài khoản nhận tiền cọc **phải là tài khoản doanh nghiệp đứng tên Resort** (cổng thanh toán yêu cầu khớp Giấy phép kinh doanh, tài khoản cá nhân không đăng ký được). Resort tự nhập và tự sửa thông tin này trong CMS. | Resort cung cấp thông tin tài khoản |

---

## 1.3 Phạm Vi Công Việc (Scope of Work Summary)

| Hạng mục | Được bao gồm trong dự án (In-Scope) | Không bao gồm / Thao tác thủ công (Out-of-Scope) |
|---|---|---|
| **Web Client Booking** | - Giao diện Web responsive chuẩn Quiet Luxury (Theme H3).<br>- Tra cứu đơn hàng đơn giản qua **SĐT + Mã Booking `NDH-YYYYMMDD-XXXX`**. | - Không làm App Mobile Native (iOS/Android).<br>- Không kết nối phần mềm POS nhà hàng. |
| **Web CMS Admin** | - Quản lý phòng, bảng giá ngày thường/Lễ, quản lý đơn hàng.<br>- CMS gán phòng vật lý, đóng/mở phòng OTA thủ công & tạo đơn điện thoại.<br>- **Phân quyền 3 nhóm người dùng (SuperAdmin, Admin, User)**. | - **Không tự động Sync sàn OTA (Agoda, Booking)**.<br>- Lễ tân thực hiện **đóng/mở phòng thủ công** trên OTA. |
| **Thông báo cho khách** | - **Email tự động qua SendGrid**, kèm Mã đơn `NDH-YYYYMMDD-XXXX` để tra cứu. | - SMS chỉ làm nếu Resort kịp đăng ký Brandname (R2).<br>- Không tích hợp Zalo OA / ZNS. |

---

# PHẦN 2: BẢNG MASTER MA TRẬN BỘ CÂU HỎI PHỎNG VẤN CLEAN REQUIREMENTS (PM & KHÁCH HÀNG)

> **Hướng dẫn sử dụng tài liệu**: PM sử dụng Bảng Master duy nhất này trong các buổi làm việc với Chủ Resort. Mỗi câu hỏi đều là **câu hỏi mở**, kèm **Đề xuất khuyến nghị của PM** và cột **Ghi chú/Chốt của Khách hàng (`-`)** để ghi lại quyết định tại cuộc họp.

| Mã Case | Module / Hạng mục | Tình huống nghiệp vụ | Câu hỏi phỏng vấn mở đối với Chủ Resort | Đề xuất & Ghi chú của PM (Recommendations & Proposals) | Ghi chú chốt của Khách hàng (Client Sign-off Note) | Tác động Kiến trúc Kỹ thuật (Tech & CMS Impact) |
|---|---|---|---|---|---|---|
| **P-01** | **Khuyến Mãi & Giảm Giá** | Các chương trình ưu đãi & Mã giảm giá | Resort hiện có những chính sách giảm giá nào? Có áp dụng mã Coupon Code trên Website không? | *Đề xuất*: Áp dụng 3 loại: Đặt sớm (Early Bird), Ở dài ngày (Long Stay) và Mã Coupon. Khách dùng tối đa 1 mã/đơn. | - | Cấu hình Rule Engine quản lý mã giảm giá (`promo_codes`). |
| **P-02a** | **Danh Mục Phụ Thu** | Phụ thu người thêm, nệm phụ, check-out muộn | Chính sách phụ thu của Resort gồm những khoản nào? Hệ thống tự động tính sẵn theo quy tắc hay cho phép Lễ tân nhập thủ công khoản phụ thu trên CMS? | *Đề xuất*: Hệ thống tự tính tự động trên Web Client + Cho phép Lễ tân linh hoạt nhập/sửa khoản phụ thu thủ công trên CMS. | - | Dựng Surcharges Engine + Ô nhập Phụ Thu linh hoạt trên CMS Admin. |
| **P-02b** | **Phụ Thu Trẻ Em Theo Tuổi** | Quy định độ tuổi trẻ em | Trẻ em dưới mấy tuổi được miễn phí, khoảng tuổi nào tính 50% giá phòng, từ mấy tuổi tính như người lớn? Form đặt phòng cần nhập tuổi từng bé không? | *Đề xuất*: Dưới 6t miễn phí, 6–11t tính 50%, từ 12t tính như người lớn. Form trên Web cho phép nhập số tuổi từng bé để tự áp giá. | - | Form nhập tuổi trẻ em + Logic phân rã giá phụ thu trẻ em Server-side. |
| **P-03** | **Thứ Tự Áp Giá & Phụ Thu** | Thứ tự tính toán Phụ thu và Khuyến mãi | Các khoản Phụ thu (người thêm, nệm phụ, minibar) sẽ được cộng vào tổng tiền trước hay sau khi trừ phần % Khuyến mãi? | *Đề xuất*: `% Khuyến mãi chỉ tính trên Giá phòng gốc (Base Rate)`. Các khoản Phụ thu cộng vào sau discount để tránh thất thoát doanh thu. | - | Chuẩn hóa công thức: `Total = (BaseRate - Discount) + Surcharges`. |
| **P-04** | **Đặt Cọc & Tiền Cọc** | Quy định tiền cọc và thanh toán | Resort có yêu cầu khách đặt cọc trực tuyến không? Nếu có thì quy định mức cọc bao nhiêu % tổng đơn? | *Đề xuất*: Cọc mặc định 50% tổng đơn qua VietQR. Khóa cứng số tiền cọc trong mã QR để khách trả chuẩn. | - | Lưu 3 chỉ số đơn (*Cọc / Đã trả / Còn lại*) & Dynamic QR Payload. |
| **P-05** | **Hoàn Tiền Hủy Đơn** | Chính sách hủy đơn & hoàn cọc | Khi khách chủ động hủy đơn, Resort áp dụng quy định hoàn cọc theo các mốc thời gian như thế nào? | *Đề xuất*: Hủy trước 7 ngày hoàn 100%, trước 3 ngày hoàn 50%, trong 24h mất cọc. | - | Hiển thị chính xác tiền hoàn trực tiếp trên nút `/lookup`. |
| **P-06** | **Đổi Ngày Lưu Trú** | Khách yêu cầu đổi ngày ở (Reschedule) | Khi khách muốn đổi sang ngày mới có giá khác, tiền chênh lệch và phí đổi ngày được tính toán thế nào? | *Đề xuất*: `Tiền mới = Giá phòng ngày mới + Phụ thu chênh lệch + Phí dịch vụ đổi ngày`. | - | Triển khai luồng Reschedule Recalculation & Audit Log. |
| **P-07** | **Số Đêm Tối Thiểu Dịp Lễ** | Ràng buộc đặt phòng ngày Lễ/Tết | Dịp Lễ Tết (30/4, 2/9, Tết), Resort có bắt buộc khách phải đặt tối thiểu 2 đến 3 đêm trở lên không? | *Đề xuất*: Cấu hình số đêm tối thiểu theo đợt Lễ trên CMS. Web Client từ chối chọn 1 đêm nếu rơi vào ngày Lễ kèm lý do. | - | Validation Check-in/out Date Range Guard Engine. |
| **B-01** | **Thời Gian Khóa Phòng Tạm** | Thời hạn mã QR cọc thanh toán | Khách tạo mã QR cọc rồi chưa chuyển tiền ngay — Resort muốn giữ phòng cho họ bao lâu trước khi nhả kho bán lại? | *Đề xuất*: Giữ phòng tạm 15 phút đồng bộ với thời hạn Bank QR Timeout. Quá 15 phút tự nhả kho bán lại. | - | Postgres `SELECT FOR UPDATE` + Cron Job nhả phòng tự động. |
| **B-02** | **Đụng Phòng OTA** | Xử lý đụng phòng với Agoda/Booking.com | Trường hợp dính đụng phòng nửa đêm với Agoda, Resort có chốt ưu tiên giữ đơn trên Website chính thức không? | *Đề xuất*: Ưu tiên đơn Website. Đơn Agoda Lễ tân gọi khách thỏa thuận chuyển sang phòng tương đương. | - | Nút Khóa phòng khẩn cấp trên CMS Mobile + Buffer đệm. |
| **B-03** | **Check-out Muộn** | Khách cũ trả phòng muộn, khách mới đang đợi | Trường hợp phòng cũ trả muộn, Lễ tân thao tác đổi khách mới sang phòng trống cùng hạng thế nào? | *Đề xuất*: Lễ tân dùng tính năng 1-click trên CMS để chuyển đơn khách mới sang phòng sạch cùng hạng. | - | Dynamic Room Allocation (Gán số phòng vật lý linh hoạt). |
| **B-04** | **Khách Vắng Mặt (No-Show)** | Khách cọc rồi biến mất không đến | Khách đã đặt cọc nhưng đến ngày check-in không tới và không liên lạc báo trước — Resort xử lý cọc và phòng thế nào? | *Đề xuất*: Giữ 100% tiền cọc. Nhả kho phòng tự động sau 18h00 ngày check-in nếu không liên lạc được khách. | - | Cron Job chuyển đơn thành `NO_SHOW` & nhả phòng lúc 18h00. |
| **B-05** | **Đặt Hộ Qua Điện Thoại** | Khách gọi điện/Zalo đặt phòng trực tiếp | Khách gọi điện/Zalo nhờ đặt phòng — Lễ tân tự tạo đơn thủ công trên CMS hay hướng dẫn khách lên Web tự đặt? | *Đề xuất*: CMS hỗ trợ màn hình tạo đơn thủ công cho Lễ tân, phân loại nguồn đơn (`WEB`, `PHONE`, `WALK_IN`, `OTA_MANUAL`). | - | CMS Manual Order Form + Trường `booking_source` trong DB. |
| **C-01** | **Cổng Thanh Toán** | Tích hợp cổng VietQR / Visa | Resort muốn tích hợp phương thức thanh toán VietQR tự động hay cả Thẻ quốc tế Visa/MasterCard? | *Đề xuất*: Tích hợp VietQR + Visa. **Bản giao 10/08 giả lập thanh toán thành công để chạy thông nghiệp vụ; GD3 mới kích hoạt Webhook thật**. | - | Webhook HMAC SHA256 Engine (Kích hoạt GD3). |
| **O-01** | **Phân Quyền CMS** | Phân chia quyền hạn tài khoản quản trị | Resort muốn phân biệt chi tiết quyền giữa Chủ Resort, Quản lý và Lễ tân hay dùng 1 tài khoản chung? | *Đề xuất*: Chuẩn hóa 3 nhóm quyền (SuperAdmin, Admin, User) với Bảng ma trận phân quyền để bảo mật tối đa. | - | Authentication Token + Refresh Token & RBAC Middleware Guard. |
| **N-01** | **Kênh Thông Báo** | Email SendGrid & SMS Brandname | Kênh thông báo chính cho khách là Email SendGrid. Nếu SMS Brandname trễ thủ tục, Resort đồng ý chỉ dùng Email chứ? | *Đề xuất*: Email SendGrid là bắt buộc, có ngay từ bản giao 10/08. SMS là tùy chọn nếu Resort hoàn thành thủ tục nhà mạng. | - | Tích hợp SendGrid Email API & Cấu hình `NOTIFY_RECIPIENTS`. |

---

## 2.2 Các Thông Số Resort Tự Cấu Hình Trong CMS (Không Cần Chốt Trong Cuộc Họp)

> **Lưu ý cho PM**: Toàn bộ các thông số dưới đây **không phải câu hỏi phỏng vấn**. Hệ thống bàn giao kèm sẵn giá trị mặc định theo chuẩn ngành khách sạn, Resort đăng nhập CMS tự nhập và tự sửa bất cứ lúc nào mà không cần báo đội Dev. PM chỉ trình bày để Chủ Resort biết mình có toàn quyền chủ động, không cần khách trả lời từng dòng.

| Nhóm | Thông số Resort tự nhập & tự sửa trong CMS | Giá trị mặc định khi bàn giao |
|---|---|---|
| **Hạng phòng & Kho phòng** | Tên hạng phòng, mô tả, ảnh, sức chứa tối đa, danh sách số phòng vật lý (*P.101, Villa 02…*) | Nhập theo dữ liệu thực tế của Resort |
| **Bảng giá** | Giá gốc từng hạng, giá cuối tuần, giá từng đợt Lễ/Tết, giá đè theo ngày cụ thể | Nhập theo bảng giá thực tế của Resort |
| **Phụ thu** | Giá giường phụ, phụ thu người thêm, phí nhận phòng sớm, phí trả phòng muộn | Nhập theo chính sách của Resort |
| **Chính sách trẻ em** | Mốc tuổi miễn phí, mốc tuổi tính 50%, mốc tuổi tính như người lớn | Dưới 6 tuổi miễn phí · 6–11 tuổi tính 50% · từ 12 tuổi như người lớn |
| **Tiền cọc** | Bật/tắt yêu cầu cọc · mức cọc theo % tổng đơn | Bật · cọc 50% tổng đơn |
| **Chính sách huỷ & hoàn tiền** | Các mốc ngày và tỉ lệ hoàn tương ứng (thêm/bớt/sửa mốc tuỳ ý) | Trước 7 ngày hoàn 100% · trước 3 ngày hoàn 50% · trong 24h không hoàn |
| **Thông tin thanh toán** | Tên chủ tài khoản, số tài khoản, ngân hàng, nội dung chuyển khoản mẫu | Nhập theo tài khoản doanh nghiệp của Resort (xem rủi ro R4) |
| **Thông tin cơ sở** | Hotline, email, địa chỉ, Mã số thuế, liên kết mạng xã hội, giờ nhận/trả phòng | Nhập theo thông tin thực tế của Resort |
| **Nội dung & Hình ảnh** | Ảnh banner trang chủ, thư viện ảnh, bài viết giới thiệu, thực đơn, tour, blog | Nhập theo bộ ảnh & nội dung chính thức Resort cung cấp (rủi ro R3) |
| **Minibar & Phát sinh** | Danh mục đồ minibar kèm đơn giá; Lễ tân chọn hoặc nhập tay khi khách trả phòng | Nhập theo bảng giá dịch vụ của Resort |
| **Khuyến mãi** | Tạo/sửa/tắt chương trình giảm giá, mã Coupon, khoảng ngày áp dụng, điều kiện | Bàn giao kèm sẵn Đặt sớm & Ở dài ngày để Resort tham khảo |

**Nguyên tắc phân định**: Câu hỏi ở Bảng Master §2.1 là những **quyết định làm thay đổi cách hệ thống vận hành** (dev phải viết code khác đi). Còn các thông số ở bảng §2.2 này chỉ là **dữ liệu đầu vào** — hệ thống đã có sẵn ô nhập, Resort điền lúc nào cũng được, kể cả sau khi đã Go-Live.

---

# PHẦN 3: BẢNG MA TRẬN PHÂN QUYỀN VẬN HÀNH CMS ADMIN (RBAC PERMISSION MATRIX)

## 3.1 Quy Định Chi Tiết 3 Nhóm Quyền Quản Trị

| Quyền Hạn (Permission Scope) | SuperAdmin (Chủ Resort) | Admin / Manager (Quản lý Resort) | User / Receptionist (Lễ tân / Nhân viên) |
|---|:---:|:---:|:---:|
| **Quản lý Tài khoản Admin (CRUD Users & Roles)** | ✅ Full Access | ❌ Không có quyền | ❌ Không có quyền |
| **Báo cáo Doanh thu & Thống kê Theo Nguồn Đơn** | ✅ Full Báo cáo | ✅ Báo cáo tháng | ❌ Không có quyền |
| **Cấu hình Bảng giá gốc & Số đêm tối thiểu ngày Lễ** | ✅ Thay đổi & Duyệt giá | 👁️ Chỉ xem giá | 👁️ Chỉ xem giá |
| **Cấu hình Ngân hàng Doanh nghiệp & Mã QR** | ✅ Cấu hình & Sửa TK | ❌ Không có quyền | ❌ Không có quyền |
| **Tạo / Duyệt / Hủy Mã Giảm Giá (Promo Codes)** | ✅ Full Access | ✅ Xem & Áp dụng | 👁️ Chỉ xem mã |
| **Quản lý Đơn hàng (Tiếp nhận, Check-in/out)** | ✅ Full Access | ✅ Full Access | ✅ Thực thi hàng ngày |
| **Tạo Đơn Thủ Công (Khách gọi điện / Zalo / Walk-in)** | ✅ Full Access | ✅ Full Access | ✅ Tạo đơn trên CMS |
| **Gán Số phòng vật lý & Chuyển phòng (1-click)** | ✅ Full Access | ✅ Full Access | ✅ Thực thi hàng ngày |
| **Nhập Phụ thu Minibar & Đồ uống phát sinh** | ✅ Full Access | ✅ Full Access | ✅ Nhập trực tiếp trên CMS |
| **Khóa phòng Khẩn cấp OTA (Emergency Lock)** | ✅ Full Access | ✅ Full Access | ✅ Thao tác trên Mobile CMS |
| **Xác nhận & Chuyển hoàn cọc (Refund)** | ✅ Duyệt lệnh hoàn | ✅ Duyệt lệnh hoàn | ❌ Chỉ gửi yêu cầu hoàn |

---

# PHẦN 4: BẢNG MA TRẬN CHỨC NĂNG HỆ THỐNG CHI TIẾT (FULL FUNCTIONAL MATRIX)

| # | Module / Trang | Giao diện Client Web (Dành cho Khách) | Giao diện Web CMS Admin (Dành cho Lễ tân & Quản lý) |
|---|---|---|---|
| **4.1** | **Home (Trang chủ)** | Hero Video Banner drone, Thanh tìm kiếm nhanh, Khuyến mãi nổi bật. | Quản lý Banner & bài giới thiệu resort. |
| **4.2** | **Rooms & Suites (Đặt phòng)** | **Luồng Đặt phòng 5 bước**: (1) Chọn ngày ➔ (2) Chọn phòng ➔ (3) Điền info khách & tuổi trẻ em ➔ (4) Thanh toán cọc VietQR ➔ (5) Màn thành công. Sinh Mã `NDH-YYYYMMDD-XXXX`. Tra cứu qua SĐT + Mã tại `/lookup`. | - Quản lý Đơn hàng, Gán phòng *P.101*, Đóng/mở phòng OTA thủ công.<br>- **Tạo đơn thủ công** cho khách gọi điện/Zalo, phân loại nguồn đơn (`WEB`, `PHONE`, `WALK_IN`).<br>- Ghi nhận Minibar & Phụ thu phát sinh khi check-out.<br>- Cấu hình Bảng giá đêm, Số đêm tối thiểu Lễ Tết & Thông tin QR cọc.<br>- **Phân quyền 3 nhóm người dùng (SuperAdmin, Admin, User)**. |
| **4.3** | **Wining & Dining (Ẩm thực)** | Xem Thực đơn hải sản & thông tin tiệc BBQ bờ biển *(Chỉ hiển thị thông tin & Hotline liên hệ, không có luồng đặt phòng/đặt món online)*. | Quản lý Nội dung Bài viết & Thực đơn hải sản (CRUD). |
| **4.4** | **Experiences (Trải nghiệm)** | Xem thông tin Tour lặn san hô, Câu mực đêm, Thuê xe máy *(Chỉ hiển thị thông tin & Hotline liên hệ)*. | Quản lý Bài viết Trải nghiệm & Tour du lịch. |
| **4.5** | **Events (Sự kiện)** | Xem thông tin Gala Dinner, Tiệc sinh nhật & Form gửi yêu cầu báo giá *(Gửi Email thông báo nội bộ, không tạo đơn booking online)*. | Tiếp nhận & Quản lý Yêu cầu báo giá sự kiện từ Form. |
| **4.6** | **News & Promotions (Tin tức)** | Gói ưu đãi Đặt sớm, Cẩm nang du lịch Nam Du, Lịch tàu cao tốc. | Bài viết Blog (CRUD), Mã giảm giá (Promo Code). |
| **4.7** | **Gallery (Thư viện ảnh)** | Album ảnh Drone HD toàn cảnh, Trình chiếu Lightbox. | Quản lý & Tải lên Thư viện ảnh resort. |
| **4.8** | **Contact Us (Liên hệ)** | Bản đồ Google Maps, Hotline Zalo, Form gửi phản hồi. | Tiếp nhận & Phản hồi liên hệ của khách. |

---

# PHẦN 5: DANH SÁCH PACKAGES & CÔNG NGHỆ SỬ DỤNG (TECH STACK)

## 5.1 Core Framework & Language
* **Next.js 15 (App Router)**: Framework React full-stack tối ưu hóa tốc độ tải trang và SEO.
* **React 19 & TypeScript 5**: Thư viện giao diện chuẩn công nghiệp và ngôn ngữ lập trình an toàn.
* **Node.js (v22+)**: Môi trường thực thi server-side.

## 5.2 UI, Layout & Styling Packages
* **Vanilla CSS & Tailwind CSS v4**: Bộ mã nguồn dựng giao diện chuẩn Quiet Luxury.
* **Lucide React Icons**: Thư viện biểu tượng giao diện tối giản.
* **Turbopack**: Trình đóng gói ứng dụng tốc độ cao tích hợp trong Next.js.

## 5.3 State Management, Auth & Database
* **Authentication**: Token (JWT Access Token) & Refresh Token lưu trong Cookie HTTP-Only bảo mật.
* **Zustand (`zustand/middleware persist`)**: Quản lý trạng thái giao diện & giữ giỏ đặt phòng của khách qua bước đăng nhập.
* **Supabase Client (`@supabase/supabase-js`)**: Cơ sở dữ liệu PostgreSQL đám mây lưu trữ vĩnh viễn, kèm Row Level Security phân quyền 3 cấp.

## 5.4 Notification & Payment Packages
* **SendGrid API (`@sendgrid/mail`)**: Thư viện tự động gửi Email xác nhận đặt phòng cho khách.
* **Cổng Thanh Toán (Dự kiến)**: VietQR / PayOS / Thẻ quốc tế Visa (Chốt chính thức sau khi chốt Case `C-01` với Resort).

## 5.5 Infrastructure & Hosting Platform
* **Vercel Cloud Platform**: Hạ tầng máy chủ đám mây toàn cầu, tự động cấp phát SSL HTTPS bảo mật.
