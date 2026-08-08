# FE BRIEF — v1.0.1

> **File này dành cho `ndh-fe` đọc mỗi lượt.** Bản đầy đủ có giải thích "vì sao":
> [PLAN-FE.md](./PLAN-FE.md) — chỉ mở khi cần hiểu sâu một quyết định.
> Vận hành: [RUNBOOK.md](./RUNBOOK.md) · Hợp đồng: [API_INTEGRATION_MAP.md](../release-v1.0.0/API_INTEGRATION_MAP.md)

---

## Cách làm việc — lượt 3 vs lượt 5

**Lượt 3**: code **đầy đủ** theo `api-contracts.ts`, gọi `fetch` thật, chặn ở
**tầng mạng** bằng mock → đánh dấu `pending-be-testing` ở mục 8 ticket.
**Lượt 5**: ô BE trong MAP ✅ → gỡ mock, trỏ route thật.

Mock chặn tầng mạng (không mock tầng hàm) ⇒ gỡ mock là **xoá cấu hình**, không
sửa code sản phẩm.

**Mock phải có đủ 3 kịch bản**: thành công · **từng mã lỗi trong interface**
(400/401/403/409/422/429) · **chậm 3 giây**. Không mock lỗi thì code xử lý lỗi
chưa bao giờ chạy.

---

## Ticket — 15 ticket

| Thứ tự | Mã | Việc | Phụ thuộc | Gỡ mock khi |
|:--:|---|---|---|---|
| 1 | `400-03` | Vitest + RTL: 6 store · format · component. ≥30 case, ≥8 neg | — | — |
| 2 | `390-05` | `useQuote` gọi API báo giá thay `buildQuote()` client (M2) | — | M2 ✅ sẵn |
| 3 | `390-07` | Huỷ đơn + hoàn tiền + hiện số tiền mất (M4/M5) | — | M4/M5 ✅ sẵn |
| 4 | `390-02` | Nối 4 màn danh mục + **di trú localStorage** (M9) | — | **M9 cột BE** |
| 5 | `390-04` | Nối trang `/lookup` (M11) | — | **M11 cột BE** |
| 6 | `410-01` | JSON-LD Hotel · HotelRoom · Offer · Breadcrumb · FAQ | `390-05` | — |
| 7 | `410-02` | `hreflang` vi/en + OG image động | `410-01` | ⚠️ **`M29` chặn** |
| 8 | `410-03` | `Article` blog · sitemap `lastmod` · ISR trang phòng | `410-01` | — |
| 9 | `430-02` | `ImageUploadField`: kéo-thả nhiều ảnh, tiến trình, sắp xếp | — | **M8 cột BE** |
| 10 | `420-03` | CMS màn "Tích hợp" — outbox, thử lại, bật/tắt adapter | — | `420-02` |
| 11 | `430-03` | Editor paste sạch từ Word/Google Docs | `400-03` | — |
| 12 | `430-04` | Nút "Xem trước" mở nội dung nháp trên theme H3 | `430-03` | — |
| 13 | `440-01` | Cắt bước 3: 7 → 5 field + `autoComplete`/`inputMode` | `400-03` | — |
| 14 | `440-02` | Điền sẵn từ `auth.store` · "Đặt lại" từ đơn cũ | `440-01` | — |
| 15 | `440-03` | Mobile gộp bước 3+4, sticky CTA ≥44px | `440-02` | — |

---

## Ghi chú riêng từng ticket

**`400-03`** — Repo có `catalog.store.ts` và `ticket.store.ts` (không phải
`inventory.store`) — kiểm `ls src/stores/` trước.
5 case bắt buộc: `cart.store` giữ giỏ qua logout/login · `auth.store.logout()`
xoá sạch không sót token · format ngày `'2026-08-20'` với `TZ=UTC` **và**
`TZ=Asia/Bangkok` đều ra `20/08/2026` · `StatusBadge` 6 trạng thái render **chữ** ·
`Field` error render **thông báo bằng chữ**.
`beforeEach` clear `localStorage` + reset store.

**`390-05`** — Sửa `useQuote.ts:68`: `buildQuote({...})` → `fetch POST
/api/availability/search`. **KHÔNG xoá `buildQuote()` khỏi `packages/core`** —
server vẫn dùng. Không có `/api/pricing/quote`.
Thêm: skeleton **giữ nguyên kích thước** · debounce khi đổi ngày · nút Thử lại.
⚠️ **Mất mạng KHÔNG được fallback về `buildQuote()` client** — đó là bug đang sửa.
⚠️ *"Chỉ còn 3 phòng"* chỉ hiện khi `availableUnits` là số thật từ API.
Bằng chứng chính: **sửa `priceOverride` trong CMS → trang khách đổi theo**.
Rủi ro: đổi sang async có thể vỡ nhiều màn — **đếm nơi dùng trước khi sửa**.

**`390-07`** — Gọi `/cancel/quote` **TRƯỚC** khi hiện hộp thoại; hộp thoại không
được hiện khi chưa có số.
Hộp thoại hiện: đã thanh toán · % hoàn · **số tiền hoàn** · **số tiền mất**. Giọng
C8: *"Huỷ đơn NDH-…-0042? Khách được hoàn 50% (636.862đ)."* — không *"Bạn có chắc?"*
Lý do huỷ **bắt buộc** (API cần).
3 AC: huỷ xong **F5 vẫn `cancelled`** · **tồn kho được nhả** · khách ở `/my-orders`
thấy **cùng con số** như admin.
⚠️ Mất mạng → **KHÔNG đánh dấu huỷ ở local**.

**`390-02`** — ⚠️ **Ticket nhạy cảm nhất release.** Chủ resort có thể đã nhập dữ
liệu thật vào `catalog.store`.
Bắt buộc hộp thoại di trú có **cả hai** nút: "Tải lên máy chủ" **và** "Tải file
sao lưu". Bấm **"Bỏ qua" → dữ liệu cũ vẫn giữ nguyên**, không xoá. Không xoá
localStorage trước khi tải lên thành công.
2 AC chứng minh: tạo hạng ở máy A → **thấy ở máy B** · hạng tạo trong CMS →
**hiện trên `/h3/rooms`**.
`grep` mọi nơi dùng `catalog.store` **trước khi** bỏ `persist`.

**`390-04`** — ⚠️ Sai mã và sai SĐT phải hiện **CÙNG MỘT câu**: *"Không tìm thấy
đơn khớp mã và số điện thoại đã nhập. Kiểm tra lại giúp bạn."* Nói rõ "sai SĐT"
là lộ mã đơn nào có thật.
`429` → *"Bạn đã tra cứu quá nhiều lần. Thử lại sau ít phút."*
Ô SĐT: `autoComplete="tel"` + `inputMode="tel"`.
**Không render** CCCD/ghi chú nội bộ kể cả khi API lỡ trả.

**`410-01`** — Đặt hàm ở `packages/domain-hotel/src/seo/` — **không** `packages/utils`
(R15). Theme không gọi thẳng repository (R13), dữ liệu qua props.
`Offer.price` phải là **giá thật** từ API, không `basePrice` cứng.
`FAQPage` **chỉ** ở trang thật sự có FAQ — nhồi mọi trang = spam.
Negative: hết phòng → `availability: 'SoldOut'` · thiếu dữ liệu → **bỏ field**,
không xuất `null`.
Bằng chứng: ảnh chụp Google Rich Results Test **0 lỗi**.

**`410-02`** — ⚠️ **KHÔNG chuyển `process/` khi `M29` còn ⏳.** Repo có 2 giá trị
mâu thuẫn; `thenamduhill.com` là site cũ **đang chạy** của chủ resort.
`site-url.ts` **phải throw** nếu thiếu env — không fallback thầm về localhost.
`ImageResponse` cần font đủ glyph tiếng Việt — kiểm `ữ ằ ợ ẫ ỹ`.

**`410-03`** — `Article.dateModified` **đổi thật** khi sửa bài. `sitemap.lastmod`
lấy từ **`updated_at` DB**, không phải thời điểm build. Sitemap **không chứa**
`/my-orders`, `/admin/**`, `/booking`. `/api/revalidate` **phải có `requirePermission`**.

**`430-02`** — ⚠️ Sắp xếp lại thứ tự phải làm được **bằng bàn phím** (FE11). Nhiều
thư viện kéo-thả không có — **chốt thư viện ở mục 6 TRƯỚC khi code**.
Mobile: kéo-thả không dùng được trên cảm ứng → nút "Chọn ảnh" mở thư viện điện thoại.
Alt song ngữ VI+EN **bắt buộc** mỗi ảnh.
Đo thật: ảnh 8MB từ điện thoại xong **dưới 10s**, có tiến trình.

**`420-03`** — Bảng theo **đủ format §F6**. Badge có **chữ**. Số liệu canh phải
`tabular-nums`. **Không cho sửa `payload`** (bản ghi sự kiện). Nút "Thử lại" chỉ
ở dòng `failed`/`dead`. `last_error` hiện **nguyên văn**.
Lễ tân → **không thấy menu** + API trả **403** (2 lớp).
Phân trang **server-side**, không tải hết rồi lọc client.

**`430-03`** — Whitelist: `p·br·strong·em·u·h2·h3·ul·ol·li·a[href]·blockquote`.
Bỏ hết `style`, `class`, `mso-*`, `<script>`, `on*`.
⚠️ **AC quan trọng nhất: lọc CẢ Ở SERVER khi lưu**, không chỉ client — POST HTML
bẩn thẳng vào API là XSS lọt.
`sanitize.ts` ở `packages/core` → **không JSX/CSS**, chạy Node thuần (R2/BE9).
**Không tự viết sanitizer** — dùng thư viện đã kiểm chứng (BE12).

**`430-04`** — Render bằng **theme H3 thật**, không khung admin (nếu dùng khung
admin thì ticket vô nghĩa).
Bảo mật 2 lớp: `robots.ts` chặn `/preview/**` **và** meta `noindex,nofollow`.
Token **≥128 bit ngẫu nhiên**, không id tăng dần. Hết hạn 24h, tự dọn.

**`440-01`** — Bỏ `idNumber` + gộp giờ đến vào "Yêu cầu đặc biệt" → 7 còn 5 field.
⚠️ **KHÔNG xoá `idNumber` khỏi DB/type/API** — lễ tân vẫn nhập lúc check-in.
Hint phải nhắc giờ tàu Rạch Giá (song ngữ).
Đo trên **điện thoại thật** (DevTools không tính): bấm SĐT hiện **bàn phím số** ·
**≥3 field autofill** bằng một lần chọn.

**`440-02`** — Thứ tự ưu tiên: ① đang gõ dở (**KHÔNG BAO GIỜ ghi đè**) ② đơn gần
nhất ③ tài khoản ④ trống.
Nói rõ nguồn: *"Lấy từ tài khoản của bạn. Sửa được."*
"Đặt lại": copy hạng + gói + thông tin khách, **không copy ngày cũ**.
Sửa ở bước 3 **không** đồng bộ ngược vào `accounts`.

**`440-03`** — Chỉ gộp ở **< 768px**; desktop giữ 2 bước riêng.
⚠️ Stepper mobile phải đổi thành **3 bước** — để 4 bước mà có 3 trang là nói dối.
Mặc định **`at-property`** (Đ1).
Kiểm trên điện thoại thật: **bàn phím không che sticky CTA** khi gõ field cuối.

---

## Checklist — mọi ticket FE

- [ ] `pnpm test:unit` xanh, **≥1 negative test**
- [ ] `pnpm lint` + `typecheck` sạch, **0 `any`**
- [ ] `pnpm build:safe` xanh **4 theme** *(không `pnpm build` khi dev đang chạy)*
- [ ] Đủ **7 trạng thái**: default·hover·focus-visible·active·disabled·loading·error
- [ ] `loading` **giữ nguyên kích thước** · `error` có **chữ** + `aria-live="polite"`
- [ ] **Không `outline: none`**
- [ ] **0 hex ngoài `tokens.css`**; spacing/radius từ token
- [ ] **Song ngữ** kể cả lỗi, trạng thái rỗng, `aria-label`, `alt`
- [ ] Trạng thái rỗng **nói rõ phải làm gì** (FE7)
- [ ] **375px**: không cuộn ngang · target ≥24px · CTA ≥44px · bảng đổi **thẻ**
- [ ] Icon **SVG** (`lucide-react`), **không emoji**
- [ ] `<label>` gắn đúng — click label focus vào input
- [ ] Bám `api-contracts.ts` đã freeze
- [ ] **Không sửa SQL, Route Handler, migration**
- [ ] Lượt 3: mục 8 ghi **`pending-be-testing` — chờ endpoint nào**
- [ ] Lượt 5: **cột FE trong MAP → ✅**

---

## Khi gặp vấn đề

| Tình huống | Làm gì |
|---|---|
| Ô BE chưa ✅ (lượt 5) | **Không gỡ mock.** Báo `ndh-pm` |
| Route thật lệch shape interface | Mở `900-*`. **Không sửa FE để khớp route lệch** |
| Muốn fallback về cách cũ khi API lỗi | **Cấm** — đó là bug đang sửa |
| Thư viện không hỗ trợ bàn phím | Chốt lại ở mục 6 **trước khi code** |
| Thiếu thông tin chủ dự án | **KHÔNG dừng** — MANUAL.md + fallback (W0b). *Trừ `M29` chặn `410-02`* |
