# HANDOVER — DỰ ÁN NÂNG CẤP HỆ THỐNG BÁN TOUR PHÚ QUỐC

> **Ngày handover:** 01/08/2026
> **Repo:** `d:\2026\2025-phuquoc` · branch `main` → tạo `feat/tour-booking-wizard`
> **Phạm vi:** Nghiên cứu thenamduhill.com → thiết kế kiến trúc bán tour → plan triển khai

---

## 1. TÓM TẮT ĐIỀU HÀNH (Executive Summary)

### Đã làm
1. **Nghiên cứu đầy đủ** hệ thống thenamduhill.com: sitemap, data model, 18 loại phòng với giá thật, toàn bộ chức năng, inventory hình ảnh, và **11 điểm yếu** cần tránh.
2. **Trích xuất design system** từ codebase hiện có thành spec cố định — mọi code mới bắt buộc tuân theo.
3. **Thiết kế kiến trúc bán tour** 7 bước với user story chuẩn: *TP.HCM → Phú Quốc, 3N2Đ, 2 người lớn + 1 trẻ em*.
4. **Plan triển khai** 7 phase, 60+ task, 16 test case, có thứ tự ưu tiên cắt scope.

### Kết luận chiến lược

> thenamduhill.com chỉ bán **1 mắt xích** (phòng nghỉ). Hệ thống của bạn bán **cả chuỗi giá trị**:
> **Di chuyển → Đưa đón → Lưu trú → Trải nghiệm → Ẩm thực**
>
> Đây là khác biệt cốt lõi. Riêng việc **bán vé di chuyển tới đảo + hướng dẫn giờ đến** là chức năng thenamduhill hoàn toàn không có, và là lý do khách sẽ chọn bạn.

**Ví dụ AOV:** thenamduhill bán 1 phòng × 2 đêm = **5.6tr**. Hệ thống mới bán trọn gói cùng chuyến = **17.4tr** (gấp ~3 lần).

---

## 2. BỘ TÀI LIỆU

| File | Nội dung | Đọc khi nào |
|---|---|---|
| **00-HANDOVER.md** ← bạn đang đọc | Index + tóm tắt + quick start | Đầu tiên |
| [01-RESEARCH-thenamduhill.md](./01-RESEARCH-thenamduhill.md) | Nghiên cứu thenamduhill: sitemap, data model, 18 phòng + giá, chức năng, hình ảnh, gap analysis | Hiểu bối cảnh & tránh lỗi của họ |
| [02-DESIGN-SYSTEM.md](./02-DESIGN-SYSTEM.md) | **Format styles cố định** — màu, layout, card pattern, form, i18n, routing, checklist | ⭐ **Trước khi viết bất kỳ component** |
| [03-ARCHITECTURE-tour-booking.md](./03-ARCHITECTURE-tour-booking.md) | Kiến trúc 7 bước, data model mới, cấu trúc thư mục, logic giá, UI spec | ⭐ **Trước khi code từng step** |
| [04-IMPLEMENTATION-PLAN.md](./04-IMPLEMENTATION-PLAN.md) | 7 phase, task list, DoD, rủi ro, 16 test case, git workflow | Khi bắt tay làm |

---

## 3. QUICK START CHO NGƯỜI TIẾP NHẬN

```bash
cd d:\2026\2025-phuquoc
yarn install
yarn dev              # http://localhost:3000 → redirect /vi

git checkout -b feat/tour-booking-wizard
```

**Đọc theo thứ tự:**
1. `02-DESIGN-SYSTEM.md` §2 (màu) + §4 (card pattern) — nắm bản sắc visual
2. `03-ARCHITECTURE-tour-booking.md` §2 (luồng 7 bước) + §4 (data model)
3. `04-IMPLEMENTATION-PLAN.md` Phase 1 — bắt đầu code

---

## 4. TRẠNG THÁI CODEBASE HIỆN TẠI

### Stack
Next.js 15.5.4 (App Router + Turbopack) · React 19 · TypeScript 5 · Tailwind CSS v4 · lucide-react · i18n custom (`LanguageContext` + middleware, **không** dùng next-intl dù đã cài)

### Đã có
| Nhó| Chi tiết |
|---|---|
| **Trang public** | Home, about, blog, contact, privacy, terms, 1-things-to-do (+detail), hotels (+detail), pho-food, pho-retreat, pho-travel, not-found |
| **Admin** | dashboard, analytics, blog, customers, orders, settings, login, pho-food, pho-retreat, pho-travel |
| **Component sections** | Hero, PhoGroupHero, TopActivities, TopDestinations, Transportation, Hotels, TravelGuides, ActivityReviews, WeatherInfo, ContactBookingForm, FAQ, Header, Footer, TopBar, FloatingChat, Collections, Food, Retreat, Travel, Guide, TravelEssentials, ThingsCard, ThingsFilterBar(+New), FilterModal, TopPicks |
| **Layouts** | `ActivityDetailLayout`, `HotelDetailLayout`, `DestinationLayout` |
| **Shared** | `BookingForm`, `ImageGallery` |
| **Data** | `lib/data.ts` (hotels, travelGuides, weather, FAQ, footer, regions), mockData theo route |
| **Assets** | 40 file `public/images/*.webp` — đủ dùng, **không cần crawl ảnh từ thenamduhill** |

### Assets mapping cho module tour
| Prefix | SL | Dùng cho |
|---|---|---|
| `phuongtiendulich-1..6` | 6 | **Step 1 & 2** — phương tiện, đưa đón |
| `khachsan-1..10` | 10 | **Step 3** — lưu trú |
| `diemthamquan-1..10` | 10 | **Step 4** — trải nghiệm (14 điểm, tái dùng ảnh) |
| `huongdandulich-1..4` | 4 | Blog / hướng dẫn |
| `1..11` + `hero-section.jpg` | 12 | Hero, ảnh chung |

---

## 5. NỢ KỸ THUẬT PHẢI XỬ LÝ

| # | Vấn đề | Mức | Xử lý ở |
|---|---|---|---|
| 1 | **Format tiền không nhất quán** — `Transportation.tsx` dùng `đ931,000`, `BookingForm.tsx` dùng `931.000₫` | Cao | Task 6.3 — tạo `lib/format.ts` từ Phase 1 |
| 2 | **Kiểu giá lẫn lộn** — `data.ts` dùng `string "2,800,000"`, `mockData.ts` dùng `number 590000` | Cao | Task 6.4 — chuẩn hoá về `number` |
| 3 | Màu: `tailwind.config.js` khai báo `brand-*` (blue) nhưng UI thực dùng orange/pink | TB | Ghi nhận ở design system §2 — không sửa, chỉ tuân thủ |
| 4 | `<img>` + `eslint-disable no-img-element` thay vì `next/image` | TB | Task 6.9 |
| 5 | i18n `en` chưa đầy đủ | TB | Task 6.5 |
| 6 | `next-intl` đã cài nhưng không dùng | Thấp | Cân nhắc xoá dependency |
| 7 | `ThingsFilterBar` + `ThingsFilterBarNew` trùng lặp | Thấp | Dọn khi refactor |

---

## 6. QUYẾT ĐỊNH ĐÃ CHỐT

| Quyết định | Lý do |
|---|---|
| **Hardcode tuyến TP.HCM → Phú Quốc** ở giai đoạn 1 | Theo yêu cầu — chưa có LLM. Đã thiết kế `RoutePlanner` interface để cắm LLM sau mà **không phải refactor** |
| **Không backend ở giai đoạn 1** — 100% mock data | Tránh scope creep; UI/UX chốt trước |
| Giữ **orange/pink** cho public UI, **blue** cho form | Tuân thủ codebase hiện có, không phá vỡ |
| Step 2, 4, 5 **có nút "Bỏ qua"** | Không chặn user; đóng đơn được với tối thiểu 2 dịch vụ |
| Giá: **`number` VND, không thập phân** | Loại bỏ lỗi parse string |
| Cọc **30%** hoặc thanh toán 100% | Giảm ma sát chuyển đổi |
| Trẻ em **75%**, em bé **10%** (mặc định) | Chuẩn ngành; override được theo dịch vụ |
| Tách 3 nhóm tuổi: NL (≥12) / TE (2–11) / EB (<2) | Khắc phục gap #8 của thenamduhill |

---

## 7. CÂU HỎI CẦN STAKEHOLDER XÁC NHẬN

Các điểm này tôi đã chọn mặc định hợp lý để không chặn tiến độ, nhưng nên được xác nhận:

| # | Câu hỏi | Mặc định đang dùng |
|---|---|---|
| 1 | Có 14 điểm du lịch cụ thể nào? | Lấy 14 điểm đầu từ `footerSectionsData` (Bãi Sao → Ong Lang). Xem bảng §3 Step 4 kiến trúc |
| 2 | Tỉ lệ giá trẻ em chuẩn của bạn? | TE 75%, EB 10% |
| 3 | Mức cọc? | 30% |
| 4 | Có bán vé máy bay/xe khách thật (cần hợp đồng đại lý) hay chỉ hướng dẫn + affiliate? | Giai đoạn 1: mock data, hiển thị như bán được |
| 5 | Payment gateway nào? | Để Phase 7 — VNPay/MoMo |
| 6 | Cần admin quản lý `TourBooking` ngay? | Để Phase 6 (task 6.8) |
| 7 | Điểm khởi hành mở rộng ngoài TP.HCM? | Hardcode 6 thành phố: HCM, Hà Nội, Đà Nẵng, Cần Thơ, Hà Tiên, Rạch Giá |

---

## 8. LUỒNG NGHIỆP VỤ — 1 TRANG

```
STEP 0  Khởi tạo    Ngày đi/về · NL/TE/EB + tuổi · Điểm khởi hành (TP.HCM)
   ▼                Preset: [3N2Đ] 4N3Đ 2N1Đ
STEP 1  Di chuyển   ✈️ Máy bay (layout đặt vé, 1h05, 1.29–1.85tr)
   ▼    ⭐ CORE     🚌 Xe khách (2 chặng: xe 7h + tàu 1.5h, sơ đồ giường)
                    🏍️ Xe máy (hướng dẫn tuyến 340km + vé phà)
                    ⏱ → Tính giờ đến → sinh hướng dẫn tự động
STEP 2  Đưa đón     Xe sân bay 220k · Xe riêng 931k · Xe máy 150k/ngày   [bỏ qua]
   ▼
STEP 3  Lưu trú     10 khách sạn/villa · FILTER giá/khu vực/loại/tiện nghi
   ▼                Cảnh báo "cần N phòng"
STEP 4  Trải nghiệm 14 điểm · gán Day 1/2/3 · cảnh báo trùng giờ         [bỏ qua]
   ▼                Gợi ý combo tour 3 đảo
STEP 5  Ẩm thực     Đặt bàn · Combo BBQ · Đặc sản (ship về nhà)          [bỏ qua]
   ▼
STEP 6  Lịch trình  Timeline 3N2Đ · bảng giá chi tiết · sửa từng bước
   ▼
STEP 7  Thanh toán  Liên hệ · Hành khách (CMND nếu có vé bay) · Voucher
                    Cọc 30% / 100% → /tour/xac-nhan/[bookingCode]
```

**Ví dụ chốt đơn:** 2 NL + 1 TE, 15–17/08/2026 → **17.401.344₫**, cọc **5.220.403₫**
(Bay khứ hồi 7.095.000₫ + Đưa đón 396.344₫ + Villa 2 đêm 5.600.000₫ + Tour 3 đảo 1.787.500₫ + Cáp treo 1.622.500₫ + BBQ 900.000₫)

---

## 9. TRIẾT LÝ UI — "TỐI GIẢN" (yêu cầu bắt buộc)

1. **1 màn hình = 1 quyết định**
2. **Progressive disclosure** — chi tiết ẩn trong `<details>`
3. **Smart defaults** — tick trước option phổ biến (máy bay, 3N2Đ, phòng đôi)
4. **Sticky summary** — luôn thấy: đang chọn gì + tổng tiền + "Tiếp tục"
5. **Bỏ qua được** — mỗi bước trừ Step 0 & 1

---

## 10. BƯỚC TIẾP THEO NGAY

```
□ Đọc 02-DESIGN-SYSTEM.md (§2 màu, §4 card, §11 checklist)
□ Đọc 03-ARCHITECTURE §2 (luồng) + §4 (data model)
□ git checkout -b feat/tour-booking-wizard
□ Bắt đầu Phase 1 task 1.1: src/app/lib/tour-types.ts
□ Xác nhận 7 câu hỏi ở §7 với stakeholder (song song, không chặn Phase 1)
```

**Thứ tự ưu tiên nếu cắt scope:**
`P0` Phase 1→2→3→5 (đủ bán 1 tour) · `P1` Phase 4 (AOV) · `P2` Phase 6 (chuẩn hoá) · `P3` Phase 7 (LLM, payment thật)

---

## 11. GHI CHÚ VỀ ĐỘ TIN CẬY CỦA DỮ LIỆU

- **Dữ liệu thenamduhill** (18 phòng, giá, sitemap, chức năng): crawl từ trang public 01/08/2026 — **đáng tin**.
- **Nền tảng Haravan/Shopify**: **suy luận** từ URL pattern (`/collections/`, `/page/`, `/article/`, `/news/`), không xác nhận từ source. Không ảnh hưởng kế hoạch.
- **Availability theo đêm của thenamduhill**: **chưa xác nhận được** có inventory thật hay chỉ catalog giá tĩnh — cần đặt thử mới biết. Ghi nhận là gap #2.
- **Giá vé máy bay/xe khách/phà** trong kiến trúc: số liệu **tham khảo thị trường**, không phải API thật — dùng làm mock data, cần cập nhật khi tích hợp thật.
- **14 điểm du lịch**: lấy từ `footerSectionsData` trong codebase của bạn, cần stakeholder xác nhận danh sách chính thức (§7 câu 1).
