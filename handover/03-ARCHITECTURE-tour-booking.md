# PHẦN 3 — KIẾN TRÚC HỆ THỐNG BÁN TOUR DU LỊCH

> Mục tiêu: nâng cấp từ *"website giới thiệu + đặt phòng"* (như thenamduhill) thành
> **hệ thống bán tour trọn gói đa dịch vụ**.
> User story chuẩn: *"Tôi ở TP.HCM, muốn đi Phú Quốc 3 ngày 2 đêm, 2 người lớn + 1 trẻ em."*

---

## 1. NGUYÊN LÝ THIẾT KẾ

### 1.1 Khác biệt cốt lõi so với thenamduhill

| | thenamduhill | Hệ thống mới |
|---|---|---|
| Bán gì | 1 phòng | **Trip** = Di chuyển + Lưu trú + Trải nghiệm + Ẩm thực + Đưa đón |
| Điểm bắt đầu | Chọn ngày → chọn phòng | **Chọn ngày + số khách + điểm khởi hành** |
| Di chuyển tới đảo | ❌ Khách tự lo | ✅ Bán vé máy bay / xe khách / phà + hướng dẫn tuyến |
| Trẻ em | ❌ Không phân biệt | ✅ Tách người lớn / trẻ em / em bé, giá theo độ tuổi |
| Giỏ hàng | Chỉ phòng | **Multi-service cart** (1 trip = n service) |
| AOV | 1 line item | 5–8 line item |

### 1.2 Triết lý UI — "Tối giản" (yêu cầu bắt buộc)

> User yêu cầu: *"nội dung trình bày cần đơn giản tối giản, đảm bảo bán tour cung cấp đầy đủ dịch vụ"*

**5 quy tắc tối giản:**
1. **1 màn hình = 1 quyết định.** Không nhồi nhiều lựa chọn cùng lúc.
2. **Progressive disclosure.** Chi tiết (hạng ghế, tiện nghi) chỉ hiện khi user mở.
3. **Smart defaults.** Luôn tick trước option phổ biến nhất (máy bay, phòng đôi, tour 3 đảo).
4. **Sticky summary bar.** Luôn thấy: đang chọn gì + tổng tiền + nút "Tiếp tục".
5. **Bỏ qua được.** Mỗi bước trừ Step 1 & 2 đều có **"Bỏ qua bước này"** — không chặn user.

---

## 2. LUỒNG NGHIỆP VỤ — 7 BƯỚC

```
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 0  KHỞI TẠO CHUYẾN ĐI          /vi/tour/tao-chuyen-di        │
│  Ngày đi · Ngày về · Người lớn · Trẻ em · Em bé · Điểm khởi hành    │
└──────────────────────────────┬──────────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 1  DI CHUYỂN ĐẾN PHÚ QUỐC      /vi/tour/di-chuyen            │
│  1.1 ✈️ Máy bay   → layout đặt vé (chọn chuyến, hạng ghế, chỗ)     │
│  1.2 🚌 Xe khách  → layout đặt vé (nhà xe, giờ, chọn giường)        │
│  1.3 🏍️ Xe máy/tự lái → hướng dẫn tuyến đường + phà               │
│  ➜ Tính giờ đến Phú Quốc → sinh hướng dẫn kế tiếp                  │
└──────────────────────────────┬──────────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 2  ĐƯA ĐÓN SÂN BAY/CẢNG        /vi/tour/dua-don   [bỏ qua]   │
│  Gợi ý theo giờ đến ở Step 1                                        │
└──────────────────────────────┬──────────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 3  LƯU TRÚ (2 đêm)             /vi/tour/luu-tru              │
│  Filter: giá · khu vực · loại · tiện nghi · số phòng cần            │
└──────────────────────────────┬──────────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 4  TRẢI NGHIỆM (14 điểm)       /vi/tour/trai-nghiem [bỏ qua] │
│  Gán activity vào Day 1 / 2 / 3 · cảnh báo trùng giờ               │
└──────────────────────────────┬──────────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 5  ẨM THỰC & ĐẶC SẢN           /vi/tour/am-thuc    [bỏ qua]  │
│  Đặt bàn nhà hàng · Combo hải sản · Đặc sản mang về                │
└──────────────────────────────┬──────────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 6  XEM LẠI LỊCH TRÌNH          /vi/tour/lich-trinh           │
│  Timeline 3 ngày 2 đêm · bảng giá chi tiết · cảnh báo xung đột     │
└──────────────────────────────┬──────────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 7  THANH TOÁN                  /vi/tour/thanh-toan           │
│  Thông tin liên hệ · Hành khách · Voucher · Cọc 30% / full         │
│  → /vi/tour/xac-nhan/[bookingCode]                                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. CHI TIẾT TỪNG BƯỚC

### STEP 0 — Khởi tạo chuyến đi

**Route:** `/[locale]/tour/tao-chuyen-di`

**Input:**
| Field | Kiểu | Ghi chú |
|---|---|---|
| Ngày đi | date | `min` = hôm nay |
| Ngày về | date | auto = ngày đi + 2 (preset 3N2Đ) |
| Người lớn | stepper | ≥ 12 tuổi, min 1, default 2 |
| Trẻ em | stepper | 2–11 tuổi, default 0 → **hiện input tuổi từng bé** |
| Em bé | stepper | < 2 tuổi, default 0 |
| Điểm khởi hành | select | **hardcode: TP.HCM** (mở rộng: Hà Nội, Đà Nẵng, Cần Thơ, Hà Tiên, Rạch Giá) |

**Preset nhanh (chip):** `3N2Đ` (default) · `4N3Đ` · `2N1Đ` · `Tuỳ chọn`

**Logic:**
```ts
nights = differenceInDays(endDate, startDate)      // = 2
days   = nights + 1                                // = 3
totalPax = adults + children                       // infant không tính chỗ
roomsSuggested = Math.ceil(totalPax / 2)           // gợi ý số phòng
```

> ⚠️ **Vị trí user:** yêu cầu gốc là lấy vị trí thật rồi dùng LLM suy ra tuyến.
> **Giai đoạn 1: HARDCODE `TP.HCM → Phú Quốc`.** Thiết kế sẵn interface để cắm LLM sau (xem §6).

---

### STEP 1 — Di chuyển đến Phú Quốc ⭐ khác biệt lớn nhất

**Route:** `/[locale]/tour/di-chuyen`

Hiển thị 3 tab phương tiện. **Data hardcode tuyến TP.HCM → Phú Quốc.**

#### 1.1 ✈️ Máy bay — Layout đặt vé

```
┌───────────────────────────────────────────────────────┐
│ SGN ✈ PQC   ·   Thứ 6, 15/08/2026   ·   2 NL + 1 TE  │
├───────────────────────────────────────────────────────┤
│ [ Sort: Giá ▾ ]  [ Giờ bay ]  [ Hãng ]                │
├───────────────────────────────────────────────────────┤
│ ⭕ VietJet  VJ457                                      │
│    06:20 SGN ──── 1h05 ────► 07:25 PQC   Bay thẳng    │
│    Phổ thông  ·  7kg tay                              │
│                              1.290.000₫/khách  [Chọn] │
├───────────────────────────────────────────────────────┤
│ ⭕ Vietnam Airlines  VN1821                            │
│    09:00 SGN ──── 1h00 ────► 10:00 PQC   Bay thẳng    │
│    Phổ thông  ·  23kg ký gửi                          │
│                              1.850.000₫/khách  [Chọn] │
├───────────────────────────────────────────────────────┤
│ ⭕ Bamboo  QH1521  11:40 → 12:45   1.560.000₫  [Chọn] │
└───────────────────────────────────────────────────────┘
   ▸ Mở rộng: chọn hạng ghế · thêm hành lý · chọn số ghế
```
**Data:** thời gian bay **1h00–1h05**, SGN→PQC, giá 1.29tr–1.85tr/khách.
**Giá trẻ em:** 75% giá người lớn · **Em bé:** 10%.

#### 1.2 🚌 Xe khách — Layout đặt vé + hướng dẫn giờ

Tuyến TP.HCM → Phú Quốc **không đi trực tiếp** — phải qua cảng:
```
TP.HCM ──(xe khách 6-7h)──► Hà Tiên ──(phà/tàu cao tốc 1.5-2.5h)──► Phú Quốc
TP.HCM ──(xe khách 5-6h)──► Rạch Giá ──(tàu cao tốc 2.5h)──────────► Phú Quốc
```
```
┌───────────────────────────────────────────────────────┐
│ TP.HCM → Hà Tiên → Phú Quốc     Tổng ~9-10h           │
├───────────────────────────────────────────────────────┤
│ CHẶNG 1 · Xe khách giường nằm                         │
│ ⭕ Phương Trang  22:00 → 05:00 (+1)  7h  350.000₫     │
│ ⭕ Kumho Samco   23:30 → 06:30 (+1)  7h  320.000₫     │
│    ▸ Sơ đồ giường: [Chọn giường]  Tầng dưới/trên      │
├───────────────────────────────────────────────────────┤
│ CHẶNG 2 · Tàu cao tốc Hà Tiên → Phú Quốc              │
│ ⭕ Superdong   08:00 → 09:30   1h30   280.000₫        │
│ ⭕ Phú Quốc Express 13:00 → 14:15  1h15  350.000₫     │
├───────────────────────────────────────────────────────┤
│ ⏱ HƯỚNG DẪN GIỜ                                       │
│ 22:00 lên xe TP.HCM → 05:00 đến Hà Tiên               │
│ ⚠️ Chờ 3h tại cảng → gợi ý quán ăn sáng gần cảng      │
│ 08:00 lên tàu → 09:30 đến Phú Quốc                    │
│ ✅ Kịp nhận phòng 14:00                                │
└───────────────────────────────────────────────────────┘
```
Cảnh báo tự động khi thời gian chờ > 2h, và khi chặng 2 khởi hành **trước** giờ đến của chặng 1.

#### 1.3 🏍️ Xe máy / Tự lái — Hướng dẫn tuyến đường

**Không bán vé** — chỉ hướng dẫn + bán vé phà chở xe.
```
TP.HCM → Hà Tiên   ~340km · 7-8h   (QL1A → QL80 → Hà Tiên)
  Chặng nghỉ: Cần Thơ (170km, 3.5h) · Rạch Giá (280km, 6h)
Hà Tiên → Phú Quốc  Phà Thạnh Thới / Superdong  2.5h
  Vé phà kèm xe máy: 200.000₫ (xe) + 230.000₫ (người)
⚠️ Lưu ý: mang GPLX + đăng ký xe · đổ đầy bình trước phà · đến cảng trước 45'
```

#### 1.4 ⏱ Tính giờ đến + hướng dẫn kế tiếp (bắt buộc)

Sau khi user chọn xong phương tiện, **luôn** render block:
```ts
interface ArrivalPlan {
  arrivalTime: string          // "07:25"
  arrivalPoint: 'san-bay-PQC' | 'cang-Bai-Vong' | 'cang-Duong-Dong'
  canCheckInImmediately: boolean          // check-in 14:00
  waitingHours: number
  suggestions: Suggestion[]   // sinh theo giờ đến
}
```
| Giờ đến | Hướng dẫn tự động |
|---|---|
| < 12:00 | "Đến sớm — nhận phòng 14:00. Gợi ý: gửi hành lý, ăn trưa, ra Bãi Trường." → CTA **Đặt xe đưa đón** |
| 12:00–15:00 | "Về khách sạn nhận phòng luôn." → CTA **Đặt xe đưa đón** |
| 15:00–19:00 | "Nhận phòng rồi ra chợ đêm Dinh Cậu ăn hải sản." → CTA **Đặt bàn** |
| > 19:00 | "Đến muộn — xác nhận lễ tân trực đêm. Nên đặt xe đưa đón trước." → CTA **Đặt xe** (bắt buộc) |

---

### STEP 2 — Đưa đón sân bay/cảng  `[bỏ qua được]`
`/[locale]/tour/dua-don` — data từ `phuongtiendulich-*.webp`:
Xe đưa đón sân bay 220.191₫ · Thuê xe riêng có tài xế 931.000₫ / 1.380.000₫ · Thuê xe máy 150.000₫/ngày · Xe buýt 50.000₫.
Toggle: `Chỉ chiều đến` / `Khứ hồi (-10%)`.

### STEP 3 — Lưu trú
`/[locale]/tour/luu-tru` — **10 khách sạn/villa** (`khachsan-1..10`).
**Filter (khắc phục điểm yếu #1 của thenamduhill):** khoảng giá · khu vực (Dương Đông, Bãi Trường, Bãi Sao, Ong Lang, Bãi Khem, Bãi Dài) · loại (Villa/Resort/Khách sạn/Homestay) · tiện nghi · số phòng.
Mỗi item: badge `Xác nhận tức thời`, tổng tiền **2 đêm**, cảnh báo "Phòng chứa tối đa X khách — cần 2 phòng".

### STEP 4 — Trải nghiệm  `[bỏ qua được]`
`/[locale]/tour/trai-nghiem` — **14 điểm du lịch**:

| # | Điểm | Loại |
|---|---|---|
| 1 | Bãi Sao | Bãi biển |
| 2 | Grand World Phú Quốc | Giải trí |
| 3 | Vinpearl Safari | Sở thú |
| 4 | Hòn Thơm (cáp treo) | Cáp treo |
| 5 | Dương Đông (chợ đêm, Dinh Cậu) | Trung tâm |
| 6 | Vườn tiêu Phú Quốc | Tham quan |
| 7 | Nhà tù Phú Quốc | Lịch sử |
| 8 | Bãi Khem | Bãi biển |
| 9 | Hòn Mây Rút | Đảo/lặn |
| 10 | Chùa Hộ Quốc | Tâm linh |
| 11 | Gành Dầu | Bãi biển |
| 12 | Hòn Gầm Ghì | Đảo/lặn |
| 13 | Hòn Móng Tay | Đảo/lặn |
| 14 | Bãi biển Ong Lang | Bãi biển |
| + | Bãi Dài · Rạch Vẹm | Bổ sung |

**Tính năng:** gán activity vào **Day 1 / Day 2 / Day 3** · cảnh báo trùng giờ · gợi ý "Tour 3 đảo gộp #9+#12+#13 tiết kiệm hơn" · giá vé theo độ tuổi (trẻ < 1m: miễn phí).

### STEP 5 — Ẩm thực & Đặc sản  `[bỏ qua được]`
`/[locale]/tour/am-thuc` — Đặt bàn nhà hàng hải sản · Combo BBQ · Đặc sản mang về (cá khô, nước mắm, tiêu, sim rượu) — có thể **ship về nhà sau chuyến đi**.

### STEP 6 — Xem lại lịch trình
`/[locale]/tour/lich-trinh` — Timeline dọc 3 ngày:
```
NGÀY 1 · 15/08   06:20 Bay SGN→PQC · 07:25 Đến · 08:00 Xe đưa đón
                 14:00 Nhận phòng · 18:00 Chợ đêm Dinh Cậu
NGÀY 2 · 16/08   08:00 Tour 3 đảo · 17:00 Về · 19:00 BBQ hải sản
NGÀY 3 · 17/08   09:00 Cáp treo Hòn Thơm · 12:00 Trả phòng · 15:00 Bay về
```
Bảng giá chi tiết: từng dịch vụ × số khách → **Tổng cộng**. Nút chỉnh sửa từng bước.

### STEP 7 — Thanh toán
`/[locale]/tour/thanh-toan` → `/[locale]/tour/xac-nhan/[bookingCode]`
Thông tin liên hệ · Danh sách hành khách (tên, ngày sinh, CMND/passport cho vé bay) · Voucher · **Cọc 30% hoặc thanh toán 100%** · Chính sách huỷ.

---

## 4. DATA MODEL MỚI

```ts
// src/app/lib/tour-types.ts

/* ── STEP 0 ── */
export interface TripConfig {
  startDate: string          // ISO 'YYYY-MM-DD'
  endDate: string
  nights: number             // derived
  days: number               // derived = nights + 1
  pax: { adults: number; children: number; infants: number }
  childrenAges: number[]     // length === children
  origin: OriginCity
  destination: 'phu-quoc'
}

export interface OriginCity {
  code: string               // 'HCM'
  name: string               // 'TP. Hồ Chí Minh'
  airportCode?: string       // 'SGN'
  nearestPort?: string       // 'ha-tien'
}

/* ── STEP 1 ── */
export type TransportMode = 'may-bay' | 'xe-khach' | 'xe-may' | 'tau-cao-toc'

export interface RouteOption {
  id: string
  mode: TransportMode
  legs: RouteLeg[]           // >1 leg = phải trung chuyển
  totalDurationMin: number
  pricePerAdult: number
  childPriceRatio: number    // 0.75
  infantPriceRatio: number   // 0.10
  arrivalTime: string        // 'HH:mm'
  arrivalPoint: string
  transferWarning?: string
}

export interface RouteLeg {
  order: number
  mode: TransportMode
  operator: string           // 'VietJet' | 'Phương Trang' | 'Superdong'
  code?: string              // 'VJ457'
  from: string; to: string
  departTime: string; arriveTime: string
  durationMin: number
  price: number
  seatClass?: string
  baggage?: string
  seatMapAvailable: boolean
}

export interface ArrivalPlan {
  arrivalTime: string
  arrivalPoint: string
  canCheckInImmediately: boolean
  waitingHours: number
  suggestions: { icon: string; text: string; ctaLabel?: string; ctaHref?: string }[]
}

/* ── STEP 3 ── */
export interface Stay {
  id: string; name: string; slug: string
  type: 'villa' | 'resort' | 'khach-san' | 'homestay'
  area: string
  images: string[]
  rating: number; reviews: number
  pricePerNight: number
  maxGuestsPerRoom: number
  amenities: string[]
  badges: string[]
  instantConfirm: boolean
}

/* ── STEP 4 ── */
export interface Activity {
  id: string; name: string; slug: string
  category: string           // slug từ CATEGORIES
  destinationId: number      // 1..14
  images: string[]
  rating: number; reviews: number
  priceAdult: number; priceChild: number
  durationHours: number
  startTimes: string[]       // ['08:00','13:00']
  includes: string[]; excludes: string[]
  suitableForChildren: boolean
  assignedDay?: 1 | 2 | 3    // user gán
}

/* ── CART ── */
export type ServiceType =
  | 'di-chuyen' | 'dua-don' | 'luu-tru' | 'trai-nghiem' | 'am-thuc' | 'dac-san'

export interface CartItem {
  id: string
  serviceType: ServiceType
  refId: string
  name: string
  thumbnail: string
  day?: 1 | 2 | 3
  time?: string
  qty: { adults: number; children: number; infants: number }
  unitPrice: number
  subtotal: number
  cancellable: boolean
  note?: string
}

export interface TripCart {
  tripConfig: TripConfig
  items: CartItem[]
  subtotal: number
  discount: number
  voucherCode?: string
  total: number
  depositAmount: number      // 30%
  warnings: CartWarning[]
}

export interface CartWarning {
  level: 'info' | 'warning' | 'error'
  message: string
  relatedItemIds: string[]
}

/* ── BOOKING ── */
export interface TourBooking {
  bookingCode: string        // 'PQ-20260815-A7X2'
  status: 'cho-thanh-toan' | 'da-coc' | 'da-thanh-toan' | 'da-huy' | 'hoan-thanh'
  cart: TripCart
  contact: { fullName: string; phone: string; email: string; note?: string }
  passengers: Passenger[]
  payment: { method: 'chuyen-khoan'|'vnpay'|'momo'|'the'; paidAmount: number; paidAt?: string }
  createdAt: string
}

export interface Passenger {
  fullName: string
  type: 'nguoi-lon' | 'tre-em' | 'em-be'
  dob?: string
  idNumber?: string          // bắt buộc nếu có vé máy bay
}
```

---

## 5. CẤU TRÚC THƯ MỤC MỚI

```
src/app/[locale]/tour/
├── layout.tsx                    # TourWizardLayout: stepper + sticky summary
├── page.tsx                      # → redirect /tao-chuyen-di
├── tao-chuyen-di/page.tsx        # STEP 0
├── di-chuyen/
│   ├── page.tsx                  # STEP 1 — 3 tab
│   └── mockData.ts               # routeOptions hardcode HCM→PQ
├── dua-don/page.tsx              # STEP 2
├── luu-tru/
│   ├── page.tsx                  # STEP 3
│   └── mockData.ts
├── trai-nghiem/
│   ├── page.tsx                  # STEP 4 — 14 điểm
│   └── mockData.ts
├── am-thuc/page.tsx              # STEP 5
├── lich-trinh/page.tsx           # STEP 6
├── thanh-toan/page.tsx           # STEP 7
└── xac-nhan/[bookingCode]/page.tsx

src/app/components/tour/
├── TourStepper.tsx               # thanh 7 bước
├── TripSummaryBar.tsx            # sticky bottom (mobile) / right (desktop)
├── PaxSelector.tsx               # NL / TE / EB + tuổi
├── DateRangePicker.tsx           # + preset 3N2Đ
├── OriginSelector.tsx            # điểm khởi hành
├── TransportModeTabs.tsx         # 3 tab phương tiện
├── FlightTicketCard.tsx          # layout vé máy bay
├── BusTicketCard.tsx             # layout vé xe khách
├── SeatMap.tsx                   # sơ đồ ghế/giường
├── RouteGuideCard.tsx            # hướng dẫn xe máy/tự lái
├── ArrivalGuideBlock.tsx         # ⏱ giờ đến + hướng dẫn
├── TransferCard.tsx              # đưa đón
├── StayCard.tsx                  # lưu trú
├── StayFilterBar.tsx             # filter (khắc phục gap #1)
├── ActivityCard.tsx              # trải nghiệm
├── DayPlanner.tsx                # gán Day 1/2/3
├── ItineraryTimeline.tsx         # timeline STEP 6
├── PriceBreakdown.tsx            # bảng giá
├── PassengerForm.tsx             # thông tin hành khách
└── SkipStepButton.tsx            # "Bỏ qua bước này"

src/app/contexts/
└── TripCartContext.tsx           # state toàn wizard + localStorage

src/app/lib/
├── tour-types.ts                 # §4
├── format.ts                     # formatVND
├── pricing.ts                    # tính giá theo độ tuổi
├── route-planner.ts              # interface cắm LLM (§6)
└── itinerary.ts                  # build timeline + detect conflict
```

---

## 6. INTERFACE CẮM LLM (giai đoạn 2)

Giai đoạn 1 hardcode, nhưng **thiết kế sẵn** để không phải refactor:

```ts
// src/app/lib/route-planner.ts

export interface RoutePlannerInput {
  origin: { lat?: number; lng?: number; city?: string }   // từ geolocation hoặc select
  destination: 'phu-quoc'
  travelDate: string
  pax: { adults: number; children: number; infants: number }
  preference?: 'nhanh-nhat' | 'tiet-kiem' | 'thoai-mai'
}

export interface RoutePlanner {
  plan(input: RoutePlannerInput): Promise<RouteOption[]>
}

/** GIAI ĐOẠN 1 — hardcode TP.HCM → Phú Quốc */
export class HardcodedRoutePlanner implements RoutePlanner {
  async plan(input: RoutePlannerInput): Promise<RouteOption[]> {
    return HCM_TO_PQ_ROUTES   // từ di-chuyen/mockData.ts
  }
}

/** GIAI ĐOẠN 2 — LLM suy luận tuyến từ vị trí bất kỳ */
export class LLMRoutePlanner implements RoutePlanner {
  async plan(input: RoutePlannerInput): Promise<RouteOption[]> {
    // POST /api/route-planner → Claude API → parse RouteOption[]
    throw new Error('Chưa triển khai — giai đoạn 2')
  }
}

export const routePlanner: RoutePlanner = new HardcodedRoutePlanner()
```

**Lấy vị trí user (giai đoạn 2):**
```ts
navigator.geolocation.getCurrentPosition(...)   // cần HTTPS + user permission
// Fallback: IP geolocation → hoặc để user tự chọn (giai đoạn 1)
```

---

## 7. LOGIC TÍNH GIÁ THEO ĐỘ TUỔI

```ts
// src/app/lib/pricing.ts
export const AGE_POLICY = {
  adult:  { minAge: 12, ratio: 1.00 },
  child:  { minAge: 2, maxAge: 11, ratio: 0.75 },
  infant: { maxAge: 1, ratio: 0.10 },
} as const

export function calcServicePrice(
  unitPrice: number,
  pax: { adults: number; children: number; infants: number },
  overrides?: { childRatio?: number; infantRatio?: number; freeInfant?: boolean }
): number {
  const cr = overrides?.childRatio  ?? AGE_POLICY.child.ratio
  const ir = overrides?.freeInfant ? 0 : (overrides?.infantRatio ?? AGE_POLICY.infant.ratio)
  return Math.round(
    unitPrice * pax.adults +
    unitPrice * cr * pax.children +
    unitPrice * ir * pax.infants
  )
}
```

**Ngoại lệ theo loại dịch vụ:**
| Dịch vụ | Quy tắc |
|---|---|
| Máy bay | TE 75%, EB 10% (ngồi cùng người lớn) |
| Xe khách | TE 75%, EB miễn phí |
| Lưu trú | Giá **theo phòng/đêm**, không theo khách. TE < 6 tuổi ngủ cùng: miễn phí |
| Trải nghiệm | TE theo chiều cao (< 1m miễn phí, 1–1.4m 75%) |
| Đưa đón | Giá **theo xe**, không theo khách |

---

## 8. VÍ DỤ TÍNH TOÁN — 3N2Đ, 2 NL + 1 TE, TP.HCM → Phú Quốc

| Dịch vụ | Đơn giá | SL | Tổng |
|---|---:|---|---:|
| ✈️ VietJet VJ457 SGN→PQC 15/08 | 1.290.000₫ | 2 NL + 1 TE(75%) | 3.547.500₫ |
| ✈️ VietJet PQC→SGN 17/08 | 1.290.000₫ | 2 NL + 1 TE(75%) | 3.547.500₫ |
| 🚗 Xe đưa đón sân bay (khứ hồi -10%) | 220.191₫ | 2 chiều | 396.344₫ |
| 🏨 Villa Ocean Breeze × 2 đêm | 2.800.000₫ | 2 đêm (1 phòng) | 5.600.000₫ |
| 🏝️ Tour 3 đảo (Day 2) | 650.000₫ | 2 NL + 1 TE(75%) | 1.787.500₫ |
| 🚡 Cáp treo Hòn Thơm (Day 3) | 590.000₫ | 2 NL + 1 TE(75%) | 1.622.500₫ |
| 🦐 Combo BBQ hải sản (Day 2) | 900.000₫ | 1 combo/3 người | 900.000₫ |
| | | **Tổng cộng** | **17.401.344₫** |
| | | **Cọc 30%** | **5.220.403₫** |

> Khớp với FAQ hiện có: *"3N2Đ cho 2 người khoảng 10–18 triệu"* ✅

---

## 9. GIAO DIỆN — ÁP DỤNG DESIGN SYSTEM

Mọi component `tour/*` **bắt buộc** theo [02-DESIGN-SYSTEM.md](./02-DESIGN-SYSTEM.md):

### TourStepper
```tsx
<div className="sticky-tabs">
  <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3">
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
      {/* Bước hiện tại */}
      <span className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
                       bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md" />
      {/* Bước đã xong */}
      <span className="... bg-green-50 text-green-700 border border-green-200">✓ </span>
      {/* Bước chưa tới */}
      <span className="... bg-gray-100 text-gray-400" />
    </div>
  </div>
</div>
```

### TripSummaryBar (sticky)
```tsx
{/* Mobile: bottom bar · Desktop: right rail sticky */}
<div className="fixed bottom-0 inset-x-0 z-40 lg:static lg:z-auto
                bg-white/95 backdrop-blur-sm border-t lg:border lg:border-gray-200
                lg:rounded-2xl shadow-lg lg:shadow-soft p-3 sm:p-4 animate-slideUp lg:animate-none">
  <div className="flex items-center justify-between gap-3">
    <div>
      <p className="text-xs text-gray-500">{items.length} dịch vụ · {nights} đêm</p>
      <p className="text-lg font-bold text-gray-900">{formatVND(total)}</p>
    </div>
    <button className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500
                       hover:from-orange-600 hover:to-pink-600 text-white font-medium
                       rounded-xl shadow-lg transition-colors">
      Tiếp tục →
    </button>
  </div>
</div>
```

### FlightTicketCard — tối giản, không dùng card 16/10
```tsx
<label className="block bg-white rounded-xl border-2 border-gray-200 hover:border-orange-300
                  has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50/40
                  p-3 sm:p-4 cursor-pointer transition-all">
  <input type="radio" name="flight" className="sr-only peer" />
  <div className="flex items-center gap-3">
    <img className="w-10 h-10 object-contain flex-shrink-0" alt={operator} />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="font-medium text-gray-700">{operator}</span>
        <span>{code}</span>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-lg font-bold text-gray-900">{departTime}</span>
        <span className="flex-1 h-px bg-gray-300 relative">
          <span className="absolute left-1/2 -translate-x-1/2 -top-4 text-xs text-gray-500">
            {duration} · Bay thẳng
          </span>
        </span>
        <span className="text-lg font-bold text-gray-900">{arriveTime}</span>
      </div>
    </div>
    <div className="text-right flex-shrink-0">
      <p className="text-base sm:text-lg font-bold text-orange-600">{formatVND(price)}</p>
      <p className="text-xs text-gray-500">/khách</p>
    </div>
  </div>
  {/* progressive disclosure */}
  <details className="mt-2 pt-2 border-t border-gray-100">
    <summary className="text-xs text-gray-500 cursor-pointer hover:text-orange-600">
      Hạng ghế · Hành lý · Chọn chỗ
    </summary>
    {/* ... */}
  </details>
</label>
```

### ArrivalGuideBlock
```tsx
<div className="bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200
                rounded-xl p-3 sm:p-4">
  <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
    <span>⏱</span> Bạn đến Phú Quốc lúc {arrivalTime}
  </h4>
  <ul className="space-y-2">
    {suggestions.map(s => (
      <li className="flex items-start gap-2 text-sm text-gray-700">
        <span className="flex-shrink-0">{s.icon}</span>
        <span className="flex-1">{s.text}</span>
        {s.ctaLabel && (
          <Link href={s.ctaHref}
            className="flex-shrink-0 text-xs px-2.5 py-1 rounded-full font-medium
                       bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-sm">
            {s.ctaLabel}
          </Link>
        )}
      </li>
    ))}
  </ul>
</div>
```

---

## 10. STATE MANAGEMENT

```tsx
// src/app/contexts/TripCartContext.tsx
'use client'
export const TripCartProvider = ({ children }) => { /* ... */ }

export function useTripCart() {
  return {
    cart, tripConfig,
    setTripConfig, addItem, removeItem, updateItem, clearCart,
    setDay,                          // gán activity vào Day 1/2/3
    total, subtotal, depositAmount,
    warnings,                        // detect conflict
    currentStep, goToStep, skipStep,
  }
}
```
**Persist:** `localStorage` key `pq_trip_cart_v1`, TTL 7 ngày. Restore khi F5.
**Guard:** vào `/tour/di-chuyen` mà chưa có `tripConfig` → redirect `/tour/tao-chuyen-di`.

---

## 11. SO SÁNH TỔNG KẾT

| Chức năng | thenamduhill | Hệ thống mới |
|---|---|---|
| Chọn ngày + số khách | ✅ (chỉ tổng khách) | ✅ NL/TE/EB + tuổi |
| Di chuyển đến điểm đến | ❌ | ✅ 3 phương tiện + tính giờ đến |
| Layout đặt vé máy bay | ❌ | ✅ |
| Layout đặt vé xe khách + sơ đồ giường | ❌ | ✅ |
| Hướng dẫn tuyến xe máy | ❌ | ✅ |
| Hướng dẫn giờ đến | ❌ | ✅ tự sinh theo giờ |
| Đưa đón sân bay/cảng | ⚠️ chỉ nhắc | ✅ bán được |
| Lưu trú | ✅ | ✅ + **filter/sort** |
| Trải nghiệm / tour | ❌ | ✅ 14 điểm + gán ngày |
| Ẩm thực / đặc sản | ⚠️ giới thiệu | ✅ bán được + ship |
| Giỏ hàng đa dịch vụ | ⚠️ chỉ phòng | ✅ |
| Timeline lịch trình | ❌ | ✅ |
| Giá theo độ tuổi | ❌ | ✅ |
| Thanh toán online | ❌ | ✅ cọc 30% / full |
| Cảnh báo xung đột lịch | ❌ | ✅ |
| Slug SEO đúng | ❌ lỗi encode | ✅ |
| i18n | ✅ | ✅ |
