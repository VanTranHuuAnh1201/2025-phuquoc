# CMS — Panel chi tiết đơn & liên kết chéo giữa các màn vận hành

> Ngày: 2026-08-08 · Nhánh: `theme/namdu-develop`
> Phạm vi: `apps/2026-thenamduhill/src/app/admin/**`, `packages/cms-ui`, `stores/booking.store.ts`

---

## 1. Vấn đề

Hai vấn đề người dùng nêu thực ra là một: **dữ liệu có khoá nối nhưng UI không dùng.**

### 1.1 Chi tiết đơn bắt nhảy trang

Click một đơn ở Dashboard hoặc Đặt phòng → `router.push('/admin/orders/<id>')` → mất ngữ cảnh
bảng → xem xong bấm Back. Lễ tân duyệt 20 đơn là 40 lần chuyển trang.

### 1.2 Năm màn vận hành không nối nhau

Khảo sát tầng dữ liệu (`packages/core/src/booking-types.ts`):

| Cặp | Khoá ngoại | UI dùng? |
|---|---|---|
| `Booking` → `Customer` | `customerId?` (:394) | Một chiều (chỉ Khách→Đơn) |
| `Booking` → `RoomUnit` | `checkInRecord.roomUnitId` (:348) | Chỉ lúc check-in |
| `Booking` ↔ `Inventory` | ❌ không có — chỉ `bookedUnits: number` (:60) | Không |
| `Inventory` ↔ `RoomUnit` | ❌ không có — `totalUnits` và `RoomUnit[]` là hai nguồn song song | Không |

Hai selector join **đã có sẵn trong store nhưng không màn nào gọi**:
`bookingsOf(customerId)`, `availableUnitsOf(roomTypeId)` — `booking.store.ts:164-171`.

### 1.3 Hai bug nghiệp vụ thật

**Bug A — phòng bảo trì vẫn bán được.**
`setUnitStatus` (`booking.store.ts:530-535`) đổi `RoomUnit.status` mà không đụng
`Inventory.blockedUnits`. Đưa một phòng vào `maintenance` → hệ thống vẫn bán đủ
`totalUnits` suất. Khách đến thì không có phòng.

**Bug B — đơn CMS rơi khỏi hồ sơ khách.**
`orders/new/page.tsx:137-153` không gửi `customerId`. Khách quen đặt qua điện thoại 10 lần,
CRM vẫn ghi "khách mới, 0 đơn" → phân hạng VIP (`customers/page.tsx:98-106`) sai theo.

---

## 2. Ranh giới phạm vi

**Trong phạm vi**

- `SidePanel` — component drawer dùng chung, thêm vào `packages/cms-ui`
- `OrderDetailPanel` — nội dung đơn hàng, tab động theo trạng thái
- Liên kết chéo 5 màn (Dashboard · Đặt phòng · Phòng trống & giá · Buồng phòng · Khách hàng)
- Sửa bug A và bug B

**Ngoài phạm vi** (ghi nhận, làm sau)

- Thêm `RoomUnit.currentBookingId` vào `packages/core` — cần migration store, phạm vi rộng hơn
- Cơ chế đối soát `bookedUnits` ↔ `bookings` chống trôi lệch
- Migrate `orders/[id]` và `orders/new` sang token `--cms-*` (hiện là 2 outlier duy nhất trong 16 file admin)
- Tape chart ở Dashboard (`admin/page.tsx:604-615` đang là placeholder rỗng)

---

## 3. Thiết kế SidePanel

### 3.1 Vì sao panel phải, không phải modal giữa

Modal che bảng phía sau. Panel phải giữ bảng nhìn thấy → duyệt nhiều đơn liên tiếp
không mất chỗ. Đây là lý do vận hành, không phải thẩm mỹ.

### 3.2 Bố cục

```
┌─────────────────────────┬──────────────────────────────┐
│                         │ ← NDH-20260820-0042      [✕] │ header sticky
│   Bảng đơn hàng         │   Nguyễn Văn A · ●Đã xác nhận│
│   (vẫn thấy)            ├──────────────────────────────┤
│                         │ Tổng quan │Nhận phòng│Lịch sử│ tabbar sticky
│                         ├──────────────────────────────┤
│                         │                              │
│                         │   nội dung — cuộn dọc        │ scroll-Y
│                         │                              │
│                         ├──────────────────────────────┤
│                         │        [Đóng]  [Nhận phòng]  │ footer sticky
└─────────────────────────┴──────────────────────────────┘
                            520px · 100dvh
```

### 3.3 Quyết định và lý do

| Quyết định | Lý do |
|---|---|
| `height: 100dvh` **không phải** `100vh` | `vh` trên iOS Safari tính cả thanh địa chỉ → footer sticky bị đẩy khuất dưới mép màn. Lỗi kinh điển của bottom bar. |
| Footer đổi nút theo tab | Tab *Tổng quan* → `[Đóng] [Xác nhận]`; tab *Nhận phòng* → `[Huỷ] [Lưu nhận phòng]`. Nút chính luôn nêu rõ hành động (luật C8/D6), không dùng "Submit". |
| Mobile < 640px: toàn màn, trượt từ dưới | Panel 520px trên máy 375px vô nghĩa. Làm bằng CSS `sm:` cho khớp `DataTable.tsx:327` — repo chưa có hook breakpoint và **không thêm** (khảo sát: 0 kết quả `matchMedia\|useMediaQuery` toàn repo). |
| Không nested panel | Form check-in/check-out vào tab, không mở panel chồng panel. Một lớp duy nhất, mobile không rối. |
| Giữ node khi đóng | `Modal` hiện tại `if (!open) return null` (`Modal.tsx:81`) → không chạy được exit animation. Panel trượt phải giữ node tới khi transition xong. |

### 3.4 Tab hiện theo trạng thái đơn

Tab **không cố định 4 cái**. Tab rỗng dạy người dùng bỏ qua tab.

| Trạng thái đơn | Tab hiện |
|---|---|
| `pending_payment`, `confirmed` (chưa tới ngày) | Tổng quan · Lịch sử |
| `confirmed` **và** hôm nay ≥ `checkIn` | Tổng quan · **Nhận phòng** · Lịch sử |
| `checked_in` | Tổng quan · **Trả phòng** · Lịch sử |
| `checked_out`, `cancelled`, `no_show` | Tổng quan · Lịch sử |

Tab *Nhận phòng* / *Trả phòng* chỉ hiện khi `nextStatuses(booking.status)` cho phép —
tái dùng đúng state machine của core, không tự suy diễn.

### 3.5 Ba cái bẫy kỹ thuật đã kiểm chứng

**Bẫy 1 — token CMS nằm trong `[data-cms]`, không phải `:root`.**
`packages/cms-ui/src/tokens.css:3-6` khai phạm vi `[data-cms]` (cố ý, để không rò sang
trang client `/h1`–`/h4`). `data-cms` gắn ở gốc `AppShell` (`AppShell.tsx:93`).
→ Nếu portal panel ra `document.body`, **mọi `var(--cms-*)` thành rỗng**, panel trắng trơn.
→ **Bắt buộc gắn `data-cms` lên node portal.**

**Bẫy 2 — repo chưa có token z-index.**
Toàn số ma thuật rải rác: `Modal.tsx:96` → 100; `AppShell.tsx:145` → `z-50`;
`admin/layout.tsx:210` → `z-50`; `DataTable.tsx:393` → `z-10`; `tokens.css:268` → 2.
→ Bổ sung một thang vào `tokens.css` thay vì thêm số ma thuật thứ tư.

**Bẫy 3 — `--space-*`, `--radius-lg`, `--shadow-lg`, `--overlay-scrim` không được map lại**
trong khối ánh xạ `tokens.css:100-115`. Panel dùng token `--cms-*` cho mọi giá trị nội bộ;
chỉ mượn `--overlay-scrim` / `--duration` / `--ease` từ `contract.css` (có sẵn ở `:root`).

### 3.6 Tái sử dụng từ `Modal.tsx`

Logic đã viết đúng, **không viết lại**: Escape (`:51-55`), focus-trap thủ công (`:25-26, 56-70`),
khoá scroll body (`:48-49, 76`), trả focus về phần tử cũ (`:43, 77`), click-outside (`:86-88`).

Phần **viết mới**: trình bày (Modal căn giữa `place-items:center` + `maxHeight:90vh`;
panel cần `inset-block:0; right:0; height:100dvh`), transition vào/ra, portal + `data-cms`,
tabbar, footer động.

### 3.7 Bảy trạng thái (luật FE1/D3)

Panel và mọi control bên trong khai đủ: `default · hover · focus-visible · active ·
disabled · loading · error`. Riêng panel:

- `loading` — đang tải đơn: skeleton giữ nguyên chiều cao, không nhảy layout
- `error` — không tìm thấy đơn: chữ rõ + nút "Đóng", không để trắng
- `focus-visible` — viền ≥ 3:1, không `outline: none`

### 3.8 URL

`?order=<id>&tab=<tab>` trên chính trang hiện tại.

Lý do **không phải** deep-link (người dùng đã nói admin hiếm gửi link cho nhau), mà là:
F5 không mất panel, và Back của trình duyệt đóng panel thay vì thoát trang.
Chi phí: một `useSearchParams`. Deep-link là hệ quả miễn phí.

`/admin/orders/[id]` **giữ nguyên** — không xoá route cũ trong đợt này.

---

## 4. Thiết kế liên kết chéo

### 4.1 Mỗi màn trả lời một câu hỏi khác nhau

| Màn | Câu hỏi | Ai dùng | Nhìn về |
|---|---|---|---|
| Dashboard | "Hôm nay phải làm gì?" | Quản lý | Hôm nay |
| Đặt phòng | "Đơn này thế nào?" | Lễ tân | Một đơn |
| Phòng trống & giá | "Ngày mai còn *suất* nào bán?" | Người bán | Tương lai |
| Buồng phòng | "Phòng 201 dọn xong chưa?" | Tổ buồng | Bây giờ |
| Khách hàng | "Ông này ở mấy lần rồi?" | Sale/CSKH | Quá khứ |

**Phòng trống & giá đếm *suất bán*** (Bungalow còn 2 suất ngày 20/8 — không quan tâm phòng nào).
**Buồng phòng theo dõi *phòng vật lý*** (phòng 201, sạch/bẩn/đang sửa — ngay bây giờ).

Khách đặt **hạng phòng**, lễ tân gán **số phòng** lúc check-in (luật B0). Nên hai màn buộc phải tách.

### 4.2 Sơ đồ nối

```
        Dashboard ──┐
                    ├──→ [OrderDetailPanel] ←── dùng chung mọi màn
   Buồng phòng ─────┤          │
                    │          ├──→ hồ sơ khách
   Khách hàng ──────┤          └──→ phòng vật lý đang ở
                    │
Phòng trống & giá ──┘
```

### 4.3 Sáu việc

| # | Việc | File | Ghi chú |
|---|---|---|---|
| 1 | Panel dùng chung, mở bằng `?order=` từ mọi màn | `cms-ui` + 5 màn admin | |
| 2 | Ô tồn kho → tab liệt kê đơn chiếm ngày đó | `inventory/page.tsx` | Cần hàm `bookingsOnDate(roomTypeId, date)` lọc qua `listStayDates` |
| 3 | Phòng `occupied` → hiện tên khách + mở panel đơn | `housekeeping/page.tsx:92` | Thêm `bookings` vào `useBookingsData()`; map `checkInRecord.roomUnitId → booking` |
| 4 | Đơn → hồ sơ khách (chiều còn thiếu) | `orders/page.tsx`, panel | Bọc Link khi `customerId` tồn tại |
| 5 | **Bug A**: phòng `maintenance` tự khoá suất bán | `booking.store.ts:530-535` | `setUnitStatus` đồng bộ `Inventory.blockedUnits` |
| 6 | **Bug B**: đơn CMS tra/tạo khách theo SĐT | `orders/new/page.tsx:137-153` | Gộp theo SĐT như `demo-generator.ts:352-364` |

Việc 3 và 4 dùng lại `bookingsOf()` / `availableUnitsOf()` đã có sẵn trong store.

### 4.4 Chi tiết bug A

Hiện tại `setUnitStatus` chỉ đổi `RoomUnit.status`. Cần: khi phòng chuyển **vào**
`maintenance` → `blockedUnits += 1` cho các ngày tương lai của hạng đó; khi chuyển **ra**
khỏi `maintenance` → `blockedUnits -= 1`.

Ràng buộc:
- Chỉ áp cho ngày ≥ hôm nay (quá khứ không sửa được)
- `blockedUnits` không vượt `totalUnits - bookedUnits` (giữ bất biến `availableUnits ≥ 0`)
- Ghi `ActivityLog` — mọi thay đổi ảnh hưởng tồn kho phải có vết (luật BE5)
- Tôn trọng `version` optimistic lock đang có (`updateInventory`, `booking.store.ts:513-528`)

### 4.5 Chi tiết bug B

`orders/new` khi tạo đơn: tra `customers` theo SĐT đã chuẩn hoá.
Có → dùng `customerId` đó. Không → tạo `Customer` mới rồi gán.
Khớp quy ước seed `cus-<phone>` (`demo-generator.ts:181, 268`).

---

## 5. Rủi ro

| Rủi ro | Giảm thiểu |
|---|---|
| Portal mất token CMS → panel trắng | Gắn `data-cms` lên node portal; kiểm bằng mắt ngay bước đầu |
| `orders/[id]` dùng hệ token cũ, bê nguyên sang panel sẽ lệch nhịp | Panel viết bằng `--cms-*` từ đầu; không copy nguyên style file cũ |
| Bug A gây trôi `blockedUnits` nếu chạy hai lần | Suy `blockedUnits` từ **đếm số phòng maintenance thực tế**, không cộng/trừ mù |
| Sửa 5 màn cùng lúc dễ vỡ | Làm tuần tự: SidePanel → panel đơn → gắn từng màn → 2 bug |

---

## 6. Định nghĩa xong

- [ ] `pnpm lint` + typecheck sạch, không `any`
- [ ] `pnpm build:safe` xanh — cả 4 theme
- [ ] Panel: 7 trạng thái đủ; Tab/Shift-Tab không thoát; Escape đóng; F5 giữ panel
- [ ] Mobile 375px: panel toàn màn, footer không bị khuất, không cuộn ngang
- [ ] Không hex ngoài `tokens.css`; panel dùng `--cms-*`
- [ ] Phòng `maintenance` → suất bán giảm đúng, `ActivityLog` có vết
- [ ] Đơn tạo ở CMS hiện trong lịch sử khách
- [ ] Ranh giới package: `cms-ui` không import `core`/`domain-*`
