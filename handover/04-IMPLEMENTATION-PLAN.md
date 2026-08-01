# PHẦN 4 — PLAN THỰC HIỆN (Execution Plan)

> Kế hoạch triển khai kiến trúc bán tour vào codebase `d:\2026\2025-phuquoc`.
> **Không phá vỡ** code hiện có — chỉ **thêm** module `tour/` + refactor nhẹ.

---

## 0. NGUYÊN TẮC AN TOÀN

1. **Không sửa** các component trang chủ hiện có ở giai đoạn 1 (trừ thêm CTA).
2. Module mới nằm gọn trong `src/app/[locale]/tour/` + `src/app/components/tour/`.
3. Mỗi phase chạy được `yarn build` sạch trước khi sang phase kế.
4. Branch riêng: `feat/tour-booking-wizard`. Không commit trực tiếp lên `main`.
5. Data hardcode ở `mockData.ts` — **không** gọi API thật ở giai đoạn 1.

---

## PHASE 1 — Nền móng (Foundation)
**Mục tiêu:** có type, format, context, layout wizard. Chưa có UI bán được.

| # | Task | File | Ước lượng |
|---|---|---|---|
| 1.1 | Tạo type definitions | `src/app/lib/tour-types.ts` | S |
| 1.2 | Chuẩn hoá format tiền | `src/app/lib/format.ts` | XS |
| 1.3 | Logic giá theo độ tuổi | `src/app/lib/pricing.ts` | S |
| 1.4 | Interface route planner (cắm LLM sau) | `src/app/lib/route-planner.ts` | S |
| 1.5 | Logic timeline + detect conflict | `src/app/lib/itinerary.ts` | M |
| 1.6 | Cart context + localStorage persist | `src/app/contexts/TripCartContext.tsx` | M |
| 1.7 | Layout wizard (stepper + summary bar) | `src/app/[locale]/tour/layout.tsx` | M |
| 1.8 | `TourStepper` + `TripSummaryBar` | `components/tour/` | M |
| 1.9 | Redirect `/tour` → `/tour/tao-chuyen-di` | `tour/page.tsx` | XS |
| 1.10 | Thêm i18n keys `tour.*` (vi + en) | `src/i18n.ts` | S |

**DoD Phase 1:** vào `/vi/tour` → redirect đúng; stepper render 7 bước; summary bar sticky; cart persist qua F5; `yarn build` sạch.

---

## PHASE 2 — Step 0 & Step 1 (Khởi tạo + Di chuyển) ⭐ trọng tâm
**Mục tiêu:** user chọn được ngày/khách/điểm khởi hành và đặt được phương tiện tới Phú Quốc.

| # | Task | File | Ước lượng |
|---|---|---|---|
| 2.1 | `DateRangePicker` + preset 3N2Đ | `components/tour/DateRangePicker.tsx` | M |
| 2.2 | `PaxSelector` (NL/TE/EB + input tuổi trẻ em) | `components/tour/PaxSelector.tsx` | M |
| 2.3 | `OriginSelector` (hardcode TP.HCM + 5 thành phố) | `components/tour/OriginSelector.tsx` | S |
| 2.4 | **STEP 0** page | `tour/tao-chuyen-di/page.tsx` | M |
| 2.5 | Mock data tuyến HCM→PQ (3 phương tiện) | `tour/di-chuyen/mockData.ts` | M |
| 2.6 | `TransportModeTabs` (3 tab) | `components/tour/TransportModeTabs.tsx` | S |
| 2.7 | `FlightTicketCard` + progressive disclosure | `components/tour/FlightTicketCard.tsx` | M |
| 2.8 | `BusTicketCard` (2 chặng: xe + tàu) | `components/tour/BusTicketCard.tsx` | M |
| 2.9 | `SeatMap` (ghế bay + giường xe) | `components/tour/SeatMap.tsx` | L |
| 2.10 | `RouteGuideCard` (xe máy/tự lái) | `components/tour/RouteGuideCard.tsx` | M |
| 2.11 | `ArrivalGuideBlock` (⏱ tính giờ đến → hướng dẫn) | `components/tour/ArrivalGuideBlock.tsx` | M |
| 2.12 | **STEP 1** page — ghép tất cả | `tour/di-chuyen/page.tsx` | L |

**DoD Phase 2:**
- Chọn 15/08/2026 → 17/08/2026, 2 NL + 1 TE, TP.HCM → sang Step 1
- Tab máy bay: 3 chuyến, chọn VJ457 → giá tính đúng `1.290.000 × 2 + 1.290.000 × 0.75 = 3.547.500₫`
- Tab xe khách: hiện 2 chặng, cảnh báo chờ > 2h
- Tab xe máy: hiện tuyến + vé phà, không thêm vào cart
- Block ⏱ hiện đúng hướng dẫn theo giờ đến (test 4 mốc giờ ở §3 kiến trúc)
- Cart có 1 item `di-chuyen`, summary bar cập nhật

---

## PHASE 3 — Step 2 & Step 3 (Đưa đón + Lưu trú)

| # | Task | File | Ước lượng |
|---|---|---|---|
| 3.1 | Mock đưa đón (từ `phuongtiendulich-*.webp`) | `tour/dua-don/mockData.ts` | S |
| 3.2 | `TransferCard` + toggle khứ hồi -10% | `components/tour/TransferCard.tsx` | S |
| 3.3 | **STEP 2** page + `SkipStepButton` | `tour/dua-don/page.tsx` | M |
| 3.4 | Mock 10 lưu trú (từ `khachsan-*.webp` + `data.ts`) | `tour/luu-tru/mockData.ts` | M |
| 3.5 | `StayFilterBar` (giá/khu vực/loại/tiện nghi) ⭐ khắc phục gap #1 | `components/tour/StayFilterBar.tsx` | L |
| 3.6 | `StayCard` + tổng tiền 2 đêm + cảnh báo số phòng | `components/tour/StayCard.tsx` | M |
| 3.7 | **STEP 3** page | `tour/luu-tru/page.tsx` | M |

**DoD Phase 3:** filter lưu trú hoạt động (nhiều tiêu chí đồng thời); giá hiển thị **tổng 2 đêm**; cảnh báo "cần 2 phòng" khi pax > maxGuestsPerRoom; nút bỏ qua ở Step 2 hoạt động.

---

## PHASE 4 — Step 4 & Step 5 (Trải nghiệm + Ẩm thực)

| # | Task | File | Ước lượng |
|---|---|---|---|
| 4.1 | Mock 14 điểm du lịch + activity (`diemthamquan-*.webp`) | `tour/trai-nghiem/mockData.ts` | L |
| 4.2 | `ActivityCard` + giá theo độ tuổi/chiều cao | `components/tour/ActivityCard.tsx` | M |
| 4.3 | `DayPlanner` — gán Day 1/2/3, cảnh báo trùng giờ | `components/tour/DayPlanner.tsx` | L |
| 4.4 | Gợi ý combo (gộp #9+#12+#13 = tour 3 đảo) | `lib/itinerary.ts` | M |
| 4.5 | **STEP 4** page | `tour/trai-nghiem/page.tsx` | M |
| 4.6 | Mock ẩm thực + đặc sản | `tour/am-thuc/mockData.ts` | M |
| 4.7 | **STEP 5** page (đặt bàn / combo / đặc sản ship) | `tour/am-thuc/page.tsx` | M |

**DoD Phase 4:** gán activity vào Day 2 → hiện ở đúng ngày; chọn 2 activity trùng 08:00 → cảnh báo `warning`; đặc sản có option "ship về nhà sau chuyến đi".

---

## PHASE 5 — Step 6 & Step 7 (Lịch trình + Thanh toán)

| # | Task | File | Ước lượng |
|---|---|---|---|
| 5.1 | `ItineraryTimeline` (timeline dọc 3 ngày) | `components/tour/ItineraryTimeline.tsx` | L |
| 5.2 | `PriceBreakdown` (bảng giá chi tiết) | `components/tour/PriceBreakdown.tsx` | M |
| 5.3 | **STEP 6** page + nút sửa từng bước | `tour/lich-trinh/page.tsx` | M |
| 5.4 | `PassengerForm` (tên, DOB, CMND nếu có vé bay) | `components/tour/PassengerForm.tsx` | M |
| 5.5 | Voucher + cọc 30% / full | `tour/thanh-toan/page.tsx` | M |
| 5.6 | **STEP 7** page + validate (tái dùng rule `BookingForm`) | `tour/thanh-toan/page.tsx` | L |
| 5.7 | Sinh `bookingCode` (`PQ-YYYYMMDD-XXXX`) | `lib/booking.ts` | S |
| 5.8 | Trang xác nhận | `tour/xac-nhan/[bookingCode]/page.tsx` | M |

**DoD Phase 5:** timeline khớp lịch trình ví dụ §8; bảng giá tổng khớp `17.401.344₫` với input mẫu; cọc = 30%; form validate đúng rule; xác nhận hiện `bookingCode`.

---

## PHASE 6 — Tích hợp & hoàn thiện

| # | Task | Ước lượng |
|---|---|---|
| 6.1 | CTA "Đặt tour 3N2Đ" vào `PhoGroupHero` + `TopActivities` | S |
| 6.2 | Link `/tour` vào `Header` + `Footer` | S |
| 6.3 | Sửa `formatVND` toàn bộ codebase (chuẩn hoá 1 format) | M |
| 6.4 | Migrate `data.ts` price: `string` → `number` | M |
| 6.5 | Bổ sung đủ i18n `en` cho toàn module tour | M |
| 6.6 | SEO metadata + JSON-LD `TouristTrip` cho từng step | M |
| 6.7 | Responsive audit 375 / 768 / 1280 | M |
| 6.8 | Admin: trang quản lý `TourBooking` (list + detail) | L |
| 6.9 | `yarn lint` sạch + xoá `eslint-disable no-img-element` (chuyển `next/image`) | M |

---

## PHASE 7 — Giai đoạn 2 (sau khi giai đoạn 1 chạy ổn)

| # | Task | Ghi chú |
|---|---|---|
| 7.1 | `LLMRoutePlanner` — API route `/api/route-planner` | Claude API suy tuyến từ vị trí bất kỳ |
| 7.2 | Geolocation lấy vị trí user thật | cần HTTPS + fallback IP |
| 7.3 | Availability thật theo đêm (khắc phục gap #2) | cần backend/DB |
| 7.4 | Payment gateway VNPay / MoMo | |
| 7.5 | Email/SMS xác nhận booking | |
| 7.6 | Kết nối API vé máy bay/xe khách thật | |

---

## THỨ TỰ ƯU TIÊN (nếu phải cắt scope)

| Ưu tiên | Nội dung | Lý do |
|---|---|---|
| **P0 — bắt buộc** | Phase 1 → 2 → 3 → 5 | Đủ bán 1 tour: khởi tạo → di chuyển → lưu trú → thanh toán |
| **P1 — nên có** | Phase 4 | Trải nghiệm là nguồn AOV chính |
| **P2 — hoàn thiện** | Phase 6 | Chuẩn hoá, SEO, admin |
| **P3 — tương lai** | Phase 7 | LLM, payment thật, inventory thật |

> Nếu thời gian gấp: làm **P0** trước, Step 4 & 5 để nút "Bỏ qua" — flow vẫn đóng được đơn.

---

## RỦI RO & GIẢM THIỂU

| Rủi ro | Mức | Giảm thiểu |
|---|---|---|
| `SeatMap` phức tạp hơn dự kiến (task 2.9) | Cao | Giai đoạn 1 làm bản **tối giản**: grid ghế tĩnh, không realtime lock. Có thể lùi sang Phase 6. |
| Logic detect conflict lịch trình sai | TB | Viết unit test cho `itinerary.ts` trước khi làm UI |
| Giá không nhất quán giữa các step | Cao | **Chỉ 1 nguồn tính giá**: `pricing.ts`. Cấm tính giá inline trong component |
| Cart mất khi F5 | TB | localStorage + test restore ngay ở Phase 1 |
| i18n `en` bị bỏ sót | TB | Checklist §11 design system; lint rule kiểm key thiếu |
| Format tiền lệch (task 6.3) | TB | Làm `format.ts` từ Phase 1, code mới dùng ngay; migrate code cũ ở Phase 6 |
| Scope creep sang backend | Cao | Giai đoạn 1 **hardcode 100%**, không backend. Chốt rõ với stakeholder |

---

## KIỂM THỬ — TEST CASE CHÍNH

| # | Scenario | Kỳ vọng |
|---|---|---|
| T1 | 2 NL + 1 TE (8 tuổi), TP.HCM, 15–17/08/2026 | `nights=2`, `days=3`, `roomsSuggested=2` |
| T2 | Chọn VietJet VJ457 1.290.000₫ | Line item = 3.547.500₫ |
| T3 | Xe khách: chặng 1 đến 05:00, chặng 2 đi 08:00 | Cảnh báo "chờ 3h" + gợi ý ăn sáng |
| T4 | Xe khách: chặng 2 khởi hành **trước** giờ đến chặng 1 | Cảnh báo `error`, không cho chọn |
| T5 | Giờ đến 07:25 (< 12:00) | Hướng dẫn "đến sớm, nhận phòng 14:00" + CTA đưa đón |
| T6 | Giờ đến 20:30 (> 19:00) | Cảnh báo lễ tân đêm + CTA đưa đón (bắt buộc) |
| T7 | Chọn xe máy | Hiện hướng dẫn tuyến, **không** thêm vào cart (trừ vé phà) |
| T8 | Filter lưu trú: giá < 3tr + khu vực Ong Lang | Chỉ hiện item khớp cả 2 |
| T9 | pax=5, `maxGuestsPerRoom=2` | Cảnh báo "cần 3 phòng" |
| T10 | Gán 2 activity cùng 08:00 Day 2 | Cảnh báo trùng giờ |
| T11 | Bỏ qua Step 2, 4, 5 | Vẫn tới được Step 7, cart chỉ có di chuyển + lưu trú |
| T12 | F5 giữa Step 3 | Cart restore đầy đủ, đứng đúng Step 3 |
| T13 | Vào `/vi/tour/luu-tru` khi chưa có `tripConfig` | Redirect `/vi/tour/tao-chuyen-di` |
| T14 | Input mẫu §8 kiến trúc | Tổng = 17.401.344₫, cọc = 5.220.403₫ |
| T15 | Có vé máy bay trong cart | `PassengerForm` bắt buộc CMND/passport |
| T16 | Chuyển sang `/en/tour/...` | Toàn bộ text tiếng Anh, không lộ tiếng Việt |

---

## GIT WORKFLOW

```bash
git checkout -b feat/tour-booking-wizard

# commit theo phase, mỗi phase 1-3 commit
feat(tour): add type definitions and pricing logic      # Phase 1
feat(tour): add wizard layout with stepper and summary  # Phase 1
feat(tour): implement trip config step                  # Phase 2
feat(tour): implement transport selection with 3 modes  # Phase 2
...
```
- Mỗi phase: `yarn lint && yarn build` sạch trước khi commit.
- PR vào `main` sau khi xong **P0** (Phase 1,2,3,5).
