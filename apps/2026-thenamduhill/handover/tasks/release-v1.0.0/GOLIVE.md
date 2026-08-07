# Hướng Dẫn Nội Dung Go-Live & Mẫu Bản Dịch (GOLIVE.md)

Tài liệu này chứa các chuỗi nội dung văn bản (bằng cả tiếng Việt và tiếng Anh) được chuẩn hóa để chủ dự án sử dụng thủ công khi cấu hình hệ thống thực tế hoặc cập nhật các cài đặt trong trang CMS Admin trong giai đoạn Go-Live.

---

## 1. Thông Tin Liên Hệ & Pháp Lý (M6)

| Hạng mục (Field) | Tiếng Việt (VI) | Tiếng Anh (EN) |
| --- | --- | --- |
| **Tên Resort** | The Nam Du Hill Resort | The Nam Du Hill Resort |
| **Hotline** | 0985 000 650 | 0985 000 650 |
| **Email** | thenamduhill@gmail.com | thenamduhill@gmail.com |
| **Địa chỉ** | Ấp Củ Tron, Xã An Sơn, Huyện Kiên Hải, Tỉnh Kiên Giang | Cu Tron Hamlet, An Son Commune, Kien Hai District, Kien Giang Province |
| **Mã số thuế** | 1702244746 | 1702244746 |

---

## 2. Chính Sách Hủy Phòng & Đặt Cọc (M7)

Chủ dự án copy các đoạn văn này cấu hình trực tiếp vào mục chính sách chung hoặc chính sách kế hoạch giá (Rate Plans) tại giao diện quản trị CMS:

### Tiếng Việt (VI):
> Khách hàng đặt cọc trước **50% tổng giá trị đơn phòng** để giữ chỗ. Trong trường hợp khách hàng huỷ phòng, tiền đặt cọc sẽ không được hoàn trả, trừ phi có lý do bất khả kháng do thay đổi thời tiết (ví dụ: bão gió lớn, tàu cao tốc ngưng chạy và có xác nhận của hãng tàu).

### Tiếng Anh (EN):
> Guests are required to deposit **50% of the total booking value** to hold the reservation. In case of cancellation, the deposit is non-refundable, except for force majeure events related to weather conditions (e.g., storms, speedboat service cancellation confirmed by the operator).

---

## 3. Lịch Tàu Cao Tốc & Chỉ Đường (M10)

Nội dung này hiển thị ở email xác nhận đặt phòng và khối chân trang hỗ trợ khách di chuyển đến đảo Nam Du:

### Tiếng Việt (VI):
> **Tàu Cao Tốc:** Tuyến Rạch Giá – Nam Du hoạt động hàng ngày bằng tàu cao tốc (Superdong, Phú Quốc Express). Thời gian di chuyển khoảng 2 tiếng 30 phút. 
> *Khuyến nghị:* Quý khách nên đặt vé tàu trước từ 1-2 tuần trước khi khởi hành và gọi Hotline **0985 000 650** để Resort sắp xếp xe đón tại bến cảng Nam Du.

### Tiếng Anh (EN):
> **Speedboat Services:** The Rach Gia – Nam Du route operates daily via high-speed ferry (Superdong, Phu Quoc Express). Travel time is approximately 2.5 hours.
> *Recommendation:* Guests should book ferry tickets 1-2 weeks prior to departure and contact our Hotline at **0985 000 650** so the resort can arrange pickup at Nam Du harbor.

---

## 4. Tên 20 Hạng Phòng Dịch Thuật Chuẩn (M24)

Danh sách đối chiếu tên phòng phục vụ cấu hình database hoặc cập nhật file seed:

| ID Hạng phòng (Room Type ID) | Tên Tiếng Việt (VI) | Tên Tiếng Anh (EN) |
| --- | --- | --- |
| `room-vip-sea` | Phòng VIP View Biển | VIP Room with Sea View |
| `room-vip-garden` | Phòng VIP Hướng Vườn | VIP Room with Garden View |
| `room-standard-double` | Phòng Standard Giường Đôi | Standard Double Room |
| `room-standard-twin` | Phòng Standard 2 Giường Đơn | Standard Twin Room |
| `room-superior-sea` | Phòng Superior Hướng Biển | Superior Sea View Room |
| `room-family-garden` | Phòng Gia Đình Hướng Vườn | Family Garden View Room |
| `room-family-sea` | Phòng Gia Đình Hướng Biển | Family Sea View Room |
| `room-suite-luxury` | Phòng Suite Sang Trọng | Luxury Suite Room |
| `room-bungalow-sea` | Bungalow Hướng Biển | Beachfront Bungalow |
| `room-bungalow-hill` | Bungalow Hướng Đồi | Hillside Bungalow |
| `room-deluxe-double` | Phòng Deluxe Giường Đôi | Deluxe Double Room |
| `room-deluxe-twin` | Phòng Deluxe 2 Giường Đơn | Deluxe Twin Room |
| `room-vip-double` | Phòng VIP 1 Giường Đôi | VIP Double Room |
| `room-superior-double` | Phòng Superior Giường Đôi | Superior Double Room |
| `room-standard-triple` | Phòng Standard 3 Khách | Standard Triple Room |
| `room-deluxe-triple` | Phòng Deluxe 3 Khách | Deluxe Triple Room |
| `room-suite-family` | Suite Gia Đình | Family Suite Room |
| `room-villa-ocean` | Biệt Thự Hướng Đại Dương | Oceanfront Villa |
| `room-premium-double` | Phòng Premium Giường Đôi | Premium Double Room |
| `room-economic-double` | Phòng Tiết Kiệm Giường Đôi | Economy Double Room |

---

## 5. Danh Sách Câu Hỏi Thường Gặp - FAQs

Mẫu text song ngữ cập nhật cho mục FAQs của trang chủ để giảm thiểu cuộc gọi hỗ trợ:

### Câu 1: Giờ nhận & trả phòng
*   **VI:** Giờ nhận phòng từ 14:00 và trả phòng trước 12:00 trưa. Nhận phòng sớm hoặc trả phòng muộn có thể tính thêm phí tùy thuộc vào lượng phòng trống.
*   **EN:** Check-in time is from 14:00 and check-out is before 12:00 PM. Early check-in or late check-out is subject to room availability and extra fees.

### Câu 2: Mang thú cưng
*   **VI:** Resort rất tiếc hiện chưa cho phép mang theo thú cưng để đảm bảo không gian yên tĩnh và vệ sinh chung cho mọi du khách.
*   **EN:** We regret that pets are not allowed at the resort to ensure a quiet and hygienic environment for all guests.

### Câu 3: Cách thức thanh toán
*   **VI:** Chúng tôi chấp nhận chuyển khoản qua VietQR (cọc 50%), tiền mặt và thẻ tín dụng trực tiếp tại quầy lễ tân của resort.
*   **EN:** We accept bank transfers via VietQR (50% deposit), cash, and credit cards directly at the resort reception desk.
