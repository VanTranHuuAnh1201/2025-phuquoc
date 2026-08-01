# PHẦN 1 — NGHIÊN CỨU HỆ THỐNG thenamduhill.com

> Tài liệu nghiên cứu (reverse-engineering) website The Nam Du Hill Resort.
> Ngày khảo sát: 01/08/2026. Phương pháp: crawl public pages + phân tích URL pattern.

---

## 1. Định danh hệ thống

| Thuộc tính | Giá trị |
|---|---|
| Tên | The Nam Du Hill Resort |
| Domain | https://thenamduhill.com |
| Loại hệ thống | Direct-booking website cho 1 property (single-property hotel site) |
| Địa chỉ | Ấp Củ Tron, Đặc khu Kiên Hải, tỉnh An Giang, Việt Nam |
| Hotline | 0985 000 650 |
| Email | thenamduhill@gmail.com |
| MST | 1702244746 |
| Ngày thành lập | 26/03/2021 · ĐKKD 18/10/2021 |
| Ngôn ngữ | VI (mặc định) + EN (switcher `VN | ENG`) |
| Dev by | DCWEB.VN |
| Nền tảng suy luận | **Haravan / Shopify-family (Liquid)**. Bằng chứng: URL `/collections/<handle>`, `/page/<slug>`, `/article/<slug>`, `/news/<blog-handle>` — đúng chuẩn Liquid routing. Booking engine là **custom app/theme section** ghép thêm. |

**Kết luận kiến trúc:** đây là e-commerce platform (bán "product") bị **uốn** thành hotel booking. `Room` = `Product`. Đây là hạn chế gốc: không có inventory theo đêm (date-based availability) đúng nghĩa.

---

## 2. Sitemap đầy đủ

### 2.1 Header navigation
| Label hiển thị | URL | Bản chất |
|---|---|---|
| Home | `/` | Trang chủ |
| Rooms & Suites | `/collections/rooms-suites` | Collection (catalog phòng) |
| Winning & Dinning *(sai chính tả: Wining & Dining)* | `/news/winning-dinning` | Blog category |
| Experiences | `/news/experiences-feel` | Blog category |
| Event | `/news/events` | Blog category |
| News | `/news/news-list` | Blog category |
| Gallery | `/gallery` | Trang custom |
| Contact Us | `/contact` | Form liên hệ |
| **Room Booking / "Đặt phòng"** | `/room-list` | **Booking engine — CTA chính** |

### 2.2 Trang khác
| URL | Nội dung |
|---|---|
| `/gioi-thieu` | Giới thiệu resort |
| `/coffee` | Trang dịch vụ Coffee & Tea |
| `/collections/all` | Toàn bộ product |
| `/article/<slug>` | Chi tiết bài viết |
| `/page/<slug>` | Trang tĩnh (CMS page) |

### 2.3 5 trang tĩnh (footer) — **lưu ý slug lỗi encode**
| Nội dung | URL thực tế | Ghi chú |
|---|---|---|
| Chính sách bảo mật | `/page/chinh-sach-baao-maat` | ❌ `baao-maat` — sai |
| Quy định chung | `/page/qui-dianh-chung` | ❌ `qui-dianh` — sai |
| Hướng dẫn đặt phòng | `/page/phuong-thuc-thanh-toan-va-giao-hang` | ⚠️ slug nói "thanh toán & giao hàng" nhưng nội dung là booking guide → dấu vết template e-commerce |
| HD nhận phòng / huỷ phòng | `/page/huong-dan-nhan-phong-huy-phong` | ✅ đúng |
| Hướng dẫn thanh toán | `/page/huoang-daan-thanh-toaan` | ❌ `huoang-daan-thanh-toaan` — sai nặng |

> **Nguyên nhân:** bộ slugify xử lý sai dấu tiếng Việt (ă→aa, ị→ia, ướ→uoa). Hại SEO trực tiếp.

---

## 3. DATA MODEL (reverse-engineered)

### 3.1 `Room` (= Product trong Liquid)
```ts
interface Room {
  id: string
  name: string              // "Phòng giường đôi có ban công nhìn ra biển"
  slug: string
  images: string[]          // CDN, có cache/resize theo kích thước
  price: number             // VND / đêm — đã gồm thuế & phí
  capacity: { min: number; max: number }   // 2..8
  bedConfig: string         // "1 giường đôi" | "2 giường đôi" | "King" | "4 đơn + 2 đôi"
  areaM2?: number           // 18 – 53
  viewType: 'bien' | 'vuon' | 'ho-boi' | 'thung-lung' | 'san-trong'
  roomCode?: string         // "08", "09", "11"
  amenities: string[]
  collection: 'rooms-suites'
}
```

### 3.2 `Booking` / Cart — "Giỏ đặt chỗ"
```ts
interface Booking {
  checkIn: Date
  checkOut: Date
  nights: number            // derived
  roomsQty: number
  guestsQty: number
  lineItems: { roomId: string; qty: number; price: number }[]
  totalAmount: number
}
```
- UI empty state: *"Chưa có phòng nào trong giỏ đặt chỗ"*
- **KHÔNG có:** breakdown người lớn / trẻ em, không có rate plan (chỉ 1 giá), không có add-on service, không có payment gateway online (thanh toán theo hướng dẫn thủ công).

### 3.3 `Article` / `Page` / `GalleryImage` / `ContactRequest`
```ts
interface Article {
  title: string; slug: string
  thumbnail: string         // 400x400
  publishedAt: string       // DD/MM/YYYY — tất cả đều 28/11/2025
  category: 'winning-dinning' | 'experiences-feel' | 'events' | 'news-list'
  // THIẾU: author, excerpt, tags, readTime
}

interface Page { title: string; slug: string; body: html }

interface GalleryImage {
  image: string; thumbnail: string
  category: 'Nhà hàng & Bar' | 'Coffce & Tea'   // ❌ typo "Coffce"
}

interface ContactRequest {
  fullName: string    // "Họ và tên"
  phone: string       // "Số điện thoại"
  email: string       // "Địa chỉ email"
  message: string     // "Nội dung"
}
```

---

## 4. DỮ LIỆU PHÒNG (18 loại — scrape thực tế)

| # | Tên phòng | Giá (VND/đêm) | Khách | Giường | DT (m²) | View |
|---|---|---:|---|---|---|---|
| 1 | Phòng giường đôi nhìn ra vườn | 1.546.000 | 2–3 | 1 đôi | — | Vườn |
| 2 | Phòng tiêu chuẩn giường đôi (lục giác) | 1.546.000 | — | 1 đôi | 21 | Biển |
| 3 | Phòng giường đôi có ban công nhìn ra biển | 1.546.000 | — | 1 đôi | — | Biển + ban công |
| 4 | Phòng giường đôi | 1.587.000 | — | 1 đôi | 18 | — |
| 5 | Rock Deluxe Room | 1.776.000 | — | 1 đôi | 21 | — |
| 6 | Phòng Deluxe | 1.776.000 | — | 1 đôi | 20 | Biển / hồ bơi |
| 7 | Phòng giường đôi có sân trong | 1.776.000 | 2–3 | 1 đôi | — | Vườn |
| 8 | Phòng giường đôi có ban công | 1.862.000 | — | 1 đôi | 19 | Biển |
| 9 | Phòng gia đình nhìn ra biển | 1.886.000 | 2–4 | 2 đôi | — | Biển |
| 10 | Phòng 03 người – Có ban công | 2.411.000 | 3 | — | 32 | Thung lũng / biển |
| 11 | Phòng 03 người – Hướng thung lũng/biển | 2.411.000 | 3 | — | 26 | Thung lũng / biển |
| 12 | Phòng Superior giường King | 2.971.000 | 2–4 | King | 53 | — |
| 13 | First Floor Family with Sea View | 2.987.000 | — | 2 đôi | 31 | Biển |
| 14 | Second Floor Family with Sea View | 3.088.000 | — | 2 đôi | 35 | Biển |
| 15 | Phòng gia đình view biển (08, 09, 11) | 3.088.000 | 4 | 2–3 đôi | — | Biển |
| 16 | Suite 02 phòng ngủ (06 khách) | 4.287.000 | 6 | 3 đôi | — | Vườn / biển |
| 17 | Suite 02 phòng ngủ (08 khách) | 5.662.000 | 8 | 4 đơn + 2 đôi | — | — |

**Khoảng giá:** 1.546.000đ → 5.662.000đ. Ghi chú giá: *"(*) Đã bao gồm thuế và phí"*.

### Tiện ích resort
Lễ tân 24/7 · Hồ bơi vô cực · Nhà hàng & Bar · BBQ & Karaoke · Cafe & Tea · Đưa đón sân bay/cầu cảng · Hỗ trợ tour đảo · Lặn ngắm san hô · Kayak · Câu cá · Tham quan làng chài · Cắm trại · Bungalow

---

## 5. TÀI SẢN HÌNH ẢNH (Image inventory)

| Nhóm | Nguồn | Số lượng | Kích thước |
|---|---|---|---|
| Hero banner | CDN `/` | 3–5 slide | full-width |
| Ảnh phòng | mỗi Room | 1 thumbnail + gallery | có cache resize |
| Gallery | `/gallery` | ~20 ảnh | 2 category, có lightbox |
| Thumbnail bài viết | `/article/*` | 1/bài | 400×400 |
| Ảnh dịch vụ | Coffee / Nhà hàng / Hồ bơi / BBQ | ~6–10 | — |

**Đối chiếu asset có sẵn của bạn** (`public/images/`, tổng 40 file `.webp`):
- `1..11.webp` — ảnh chung
- `diemthamquan-1..10.webp` — **10 điểm tham quan**
- `khachsan-1..10` — 10 khách sạn/villa
- `phuongtiendulich-1..6.webp` — **6 phương tiện** (đủ cho module di chuyển)
- `huongdandulich-1..4.webp` — 4 hướng dẫn
- `hero-section.jpg`

> ✅ Asset hiện có **đủ** để dựng toàn bộ tour flow, không cần crawl ảnh từ thenamduhill.

---

## 6. CHỨC NĂNG — TAKE NOTE TOÀN BỘ

### A. Booking engine `/room-list` ⭐ core
1. **Form tìm kiếm:** Ngày nhận phòng · Ngày trả phòng · Số phòng · Số khách → nút **"Kiểm tra"**
2. **Kết quả:** grid 18+ phòng — ảnh, tên, mô tả (giường/DT/view), giá/đêm, nút **"Chọn"** + link **"Xem chi tiết"**
3. **Sidebar giỏ đặt chỗ (sticky phải):** check-in/out · số đêm · số phòng · số khách · tổng tiền
4. **Không có:** payment gateway, tách người lớn/trẻ em, rate plan, mã giảm giá, availability thật theo đêm

### B. Catalog `/collections/rooms-suites`
Grid tĩnh + "Xem tất cả". **Không filter, không sort, không pagination** ← điểm yếu lớn nhất với 18 loại phòng.

### C. CMS Blog — 4 category
Dining · Experiences · Events · News. Bài có title + thumbnail + ngày. Không author/tag/excerpt/pagination.

### D. Gallery
Lightbox + filter 2 category.

### E. Form liên hệ `/contact`
4 field (Họ tên, SĐT, Email, Nội dung) + nút "Gửi". Homepage có thêm block "Gửi yêu cầu tư vấn". **Không nhúng map.**

### F. Marketing / Trust
6 lý do chọn resort · Testimonials khách · Badge Bộ Công Thương · Social (FB/Twitter/LinkedIn/YouTube) · Block "Khám phá Nam Du" · Đặt qua Facebook / Zalo

---

## 7. ĐÁNH GIÁ — GAP ANALYSIS

### ✅ Điểm mạnh (nên học)
1. Giỏ đặt chỗ **multi-room** — đặt nhiều phòng 1 lần
2. Dữ liệu phòng chi tiết: diện tích, cấu hình giường, view, capacity range
3. Đủ 5 trang chính sách pháp lý (compliance VN)
4. Đa ngôn ngữ VI/EN
5. Giá đã gồm thuế & phí — minh bạch, không surprise fee

### ❌ Điểm yếu (phải tránh khi build)
| # | Vấn đề | Ảnh hưởng |
|---|---|---|
| 1 | Không filter/sort catalog | UX kém với 18+ item |
| 2 | Không rõ có availability thật theo đêm | Overbooking risk; chỉ là catalog giá tĩnh |
| 3 | Slug lỗi encode tiếng Việt | Hại SEO |
| 4 | Sai chính tả: "Winning & Dinning", "Coffce & Tea" | Mất uy tín |
| 5 | Blog thiếu author/tag/pagination | Nghèo nội dung, hại SEO |
| 6 | Contact không có map | Thiếu tiện ích |
| 7 | Mọi bài viết cùng 1 ngày (28/11/2025) | Nội dung nhập 1 lần, không cập nhật |
| 8 | Không tách người lớn / trẻ em | Không tính được giá theo độ tuổi |
| 9 | Không có online payment | Ma sát chuyển đổi cao |
| 10 | Không có **di chuyển đến điểm đến** | Khách phải tự lo — cơ hội lớn nhất của bạn |
| 11 | Chỉ bán phòng, không bán tour/combo | AOV thấp |

### 🎯 Cơ hội chiến lược
> thenamduhill chỉ bán **1 mắt xích** (phòng). Hệ thống của bạn bán **cả chuỗi**:
> **Di chuyển → Lưu trú → Trải nghiệm → Ẩm thực → Đưa đón**
> Đây chính là khác biệt cốt lõi của kiến trúc mới ở [PHẦN 2](./02-ARCHITECTURE-tour-booking.md).

---

## Nguồn tham chiếu
- https://thenamduhill.com/ · `/room-list` · `/collections/rooms-suites` · `/contact` · `/gallery` · `/gioi-thieu` · `/coffee`
- Facebook: https://www.facebook.com/thenamduhill/
