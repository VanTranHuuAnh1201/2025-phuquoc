# Hướng dẫn sử dụng hệ thống Claude của dự án

Tài liệu vận hành cho chủ repo. Mô tả toàn bộ các mảnh đã dựng trong `.claude/`
và **format chính xác** để ra lệnh cho Claude theo từng tình huống.

---

## 1. Bản đồ hệ thống

```
.claude/
  rules/                    LUẬT — Claude tự đọc, không cần gọi
    architecture.md           R1–R10  ranh giới monorepo, package
    booking-domain.md         B0–B8   nghiệp vụ đặt phòng, giá, khuyến mãi
    app-flows.md              F0–F8   luồng màn hình client + CMS
    design-tokens.md          D0–D6   hợp đồng token 4 theme
    the-10k-checklist.md      K0–K8   cổng chất lượng $10K + 5 câu hỏi bắt buộc
  agents/                   AGENT — gọi bằng cách NÊU TÊN trong câu lệnh
    customer-mindset.md       Phòng Sales/Marketing ảo (S1–S5, M1–M6, P1–P4)
    website-teardown.md       Bóc tách website mẫu 6 lớp
    conversion-blueprint.md   Tài liệu hệ thống tiền triển khai
    image-curator.md          Xem + tuyển ảnh cho hero/tiêu điểm/card

resources/scripts/crawl/    CÔNG CỤ — chạy bằng lệnh node/pnpm
    download-images.mjs       tải ảnh từ JSON crawl về đĩa để Claude XEM được

Skill có sẵn (gõ tên khi cần):  frontend-design · ui-ux-pro-max
```

**Cách gọi agent:** không có cú pháp đặc biệt — chỉ cần nêu tên agent trong
câu lệnh, ví dụ *"chạy website-teardown với https://…"*. Claude phiên chính sẽ
tự spawn agent đó và trả kết quả về.

**Đầu ra nằm ở đâu:**

| Agent | File xuất ra |
|---|---|
| website-teardown | `resources/docs/teardown/<mẫu>-teardown.md` |
| conversion-blueprint | `resources/docs/specs/<tên>-blueprint.md` |
| image-curator | `resources/docs/curation/<tên>-images.md` |
| customer-mindset | trả lời trực tiếp trong hội thoại, không ghi file |

---

## 2. Prompt khởi động chuẩn (kickoff)

Mỗi khách một **file brief**: copy `resources/docs/briefs/_template.md` thành
`resources/docs/briefs/<tên-khách>.md`, điền rồi gõ:

> `Khởi động theo brief resources/docs/briefs/<tên-khách>.md`

Hoặc gõ nhanh inline khi chưa kịp tạo brief:

```
Khởi động dự án mới:
- Website khách hàng hiện tại: <URL hoặc "không có">
- Website recommend (khách thích): <URL>
- Folder crawl: resources/scripts/crawl/output/<tên-khách>/  (hoặc "chưa crawl")
- Ảnh khách cung cấp: <đường dẫn hoặc "chưa có">
- K0: (1)… (2)… (3)… (4)… (5)…
```

Quy tắc Claude phải theo khi nhận kickoff:

- **Hai website có vai trò khác nhau** — website hiện tại = *hợp đồng chức
  năng* (remake phải đầy đủ chức năng như nó, teardown xuất parity checklist);
  website recommend = *tham chiếu thẩm mỹ*. Không rõ URL nào vai nào → hỏi.
- **Folder crawl chưa có / không rõ → HỎI lại user** ("crawl website nào,
  hay bạn gửi link bản crawl có sẵn?") — không tự ý crawl. Bản crawl nằm theo
  khách tại `resources/scripts/crawl/output/<tên-khách>/`.
- Review/comment của khách hàng cuối **không crawl được** (chính sách các
  nền tảng) — social proof lấy từ tư liệu khách cung cấp, không bịa số liệu.
- Trường nào brief ghi `chưa có` → hỏi đúng trường đó, các trường đã điền
  không hỏi lại.

Vì sao brief file thay vì `.env`: brief là tài liệu nhiều dòng, nhiều khách,
cần commit và người đọc được — `.env` chỉ hợp với secret/giá trị đơn và không
vào git. Đường dẫn crawl đã có quy ước cố định theo tên khách nên không cần
biến môi trường.

---

## 3. Quy trình chuẩn — dự án mới / theme mới từ mẫu khách gửi

Đây là dây chuyền đầy đủ, chạy đúng thứ tự. Mỗi bước ghi rõ: **bạn gõ gì**,
Claude làm gì, ra cái gì.

> **Trạng thái hiện tại của hệ thống: dừng ở Bước 6 (duyệt blueprint) + review
> kiến trúc — CHƯA bật tự động thực thi FE.** Sau khi test tốt sẽ tự động hoá
> dần (bỏ bước crawl tay), nhưng cổng "review kiến trúc trước khi code" giữ
> vĩnh viễn.

### Bước 0 — Thu thập từ khách + tạo brief (việc của bạn)

Xin khách: URL website hiện tại + website họ thích · logo + màu nhận diện ·
bộ ảnh thật · nội dung chính thức (tên phòng, giá, chính sách). Điền vào
brief. Thiếu cũng được — hệ thống sẽ chặn và nhắc ở bước 4.

### Bước 1 — Crawl website (nếu có site để crawl)

```bash
pnpm crawl:full                                   # nội dung → output/<khách>/…full-site.json
node resources/scripts/crawl/download-images.mjs  # ảnh → output/<khách>/assets/
```

Mặc định script đang trỏ vào `output/thenamduhill/`; khách khác thì truyền
tham số: `node download-images.mjs <file-json> <thư-mục-đích> [--max=N]`.

### Bước 2 — Bóc tách mẫu

> **Gõ:** `Khách thích website này: <URL hoặc đường dẫn file>. Chạy website-teardown.`

Claude bóc 6 lớp: UI spec đo được (HEX, px, ms) · phễu chuyển đổi · thông điệp
marketing · kỹ thuật nền · ưu/nhược theo 2 góc nhìn · khoảng cách với luật
dự án — kèm chấm điểm K1–K8.
→ Ra file teardown + tóm tắt "mẫu này ăn tiền ở đâu, 3 thứ phải giữ".

### Bước 3 — Soi tâm thế khách hàng

> **Gõ:** `Dùng customer-mindset phân tích: với mẫu vừa teardown, đâu là nỗi đau
> của P1/P2 mà bản của ta phải giải quyết tốt hơn? Áp dụng M6.`

→ Ra phân tích nhân vật – nỗi lo – lời từ chối – ưu điểm cần khuếch đại.

### Bước 4 — Trả lời 5 câu hỏi K0 (cổng chặn, không bỏ qua được)

Claude sẽ hỏi bạn (hoặc bạn chủ động trả lời trước cho nhanh):

1. **Design direction** — hướng thẩm mỹ nào? (editorial / dark-luxury / tropical-minimal…)
2. **Nguồn ảnh** — khách có ảnh thật chưa, hay dùng ảnh sinh / chờ chụp?
3. **Nội dung thật** — đã có bản chính thức, hay placeholder có đánh dấu?
4. **Mức độ motion** — tĩnh sang trọng hay có scroll effect?
5. **Brand asset** — logo/font/màu bắt buộc phải tôn trọng?

Trả lời gộp một lần được, ví dụ:
> `K0: (1) tropical editorial, (2) dùng ảnh crawl DEV-ONLY chờ khách chụp,
> (3) placeholder có đánh dấu, (4) motion nhẹ, (5) chỉ có logo trong public/`

### Bước 5 — Tài liệu hệ thống

> **Gõ:** `Chạy conversion-blueprint cho <theme-hN / sản phẩm X> dựa trên teardown
> và các câu trả lời K0 ở trên.`

→ Ra blueprint gồm: point of view · **danh sách chức năng** (bảng khách duyệt
phạm vi) · phễu 4 step · design system draft theo tên biến D1 ·
**UI/UX handoff spec** (token đổ thẳng vào tokens.css, inventory component
7 trạng thái, layout desktop + mobile riêng từng section R7) · thông điệp
song ngữ · K-check tự chấm.

**→ DỪNG Ở ĐÂY, đọc và duyệt blueprint trước khi cho code.** Đây là điểm rẻ
nhất để sửa hướng.

### Bước 6 — Tuyển ảnh

> **Gõ:** `Chạy image-curator: ảnh ở resources/scripts/crawl/output/<khách>/assets/
> (hoặc thư mục ảnh khách gửi), art direction theo blueprint <tên>.`

→ Ra bảng gán ảnh theo vị trí (hero/about/rooms/gallery) + gợi ý crop +
alt song ngữ + **danh sách ảnh còn thiếu phải xin khách**.

### Bước 7 — Review kiến trúc trước khi code (cổng bắt buộc, giữ vĩnh viễn)

> **Gõ:** `Trước khi code: review kế hoạch triển khai blueprint <tên> theo
> R1–R10, xác nhận không vi phạm ranh giới package, liệt kê file sẽ tạo/sửa.`

Claude phải trả về: danh sách file đụng tới · đối chiếu 5-chỗ-thêm-theme
(CLAUDE.md §4) · xác nhận parity checklist đã phủ đủ · điểm nào lệch luật.
**Bạn duyệt xong mới sang bước 8.** Kể cả sau này tự động hoá, cổng này
không bỏ.

### Bước 8 — Thực thi

> **Gõ:** `Triển khai section <X> của theme <hN> theo blueprint <tên>,
> dùng skill frontend-design.`

Quy tắc khi code (Claude tự biết, nhắc lại để bạn giám sát):
- Theme mới = đúng 5 chỗ trong CLAUDE.md §4, không đụng core/ui
- Hex chỉ nằm trong `tokens.css` · component đủ 7 trạng thái D3
- Chuỗi hiển thị đủ `{vi, en}` · ảnh crawl không vào đường production

### Bước 9 — Nghiệm thu

> **Gõ:** `Nghiệm thu <trang/section> bằng customer-mindset và the-10k-checklist.
> Kết luận: P1 đã gật đầu chưa?`

Kèm chạy máy: `pnpm check` (lint + typecheck) và cả 4 theme còn build.

---

## 4. Format nhanh theo tình huống

| Tình huống | Gõ gì |
|---|---|
| Khách gửi URL mẫu mới | `Chạy website-teardown với <URL>` |
| Cân nhắc có nên làm tính năng X | `Hỏi customer-mindset: tính năng X có đáng làm không?` |
| Review màn hình đã dựng | `Dùng customer-mindset review <file/route>, kết luận theo khuôn 6 bước` |
| Bắt đầu theme mới | Chạy đủ Bước 2→5 rồi mới code |
| Chỉ cần chọn ảnh | `node download-images.mjs` → `Chạy image-curator với <thư mục>` |
| Kiểm tra chất lượng trước giao | `Đối chiếu <trang> với K1–K8, ghi số đo (LCP, tương phản) vào báo cáo` |
| Sửa nhỏ, không cần dây chuyền | Ra lệnh thẳng — rules vẫn tự áp (R, D, F, B) |

## 5. Nguyên tắc vận hành

1. **Rules tự chạy, agent phải gọi.** Mọi phiên Claude đều đọc rules; agent
   chỉ hoạt động khi bạn nêu tên (hoặc Claude tự thấy cần và nói rõ).
2. **Không code trước blueprint** với việc lớn (theme mới, sản phẩm mới,
   redesign section). Việc nhỏ (sửa bug, chỉnh spacing) thì đi thẳng.
3. **K0 là cổng chặn** — Claude bị cấm tự bịa direction/ảnh/nội dung. Nếu nó
   hỏi, đó là hệ thống hoạt động đúng, đừng coi là phiền.
4. **Ảnh crawl = DEV-ONLY.** Trước khi lên production phải thay bằng ảnh
   khách cung cấp (R9). File curation ghi rõ nhãn từng ảnh.
5. **Thứ tự ưu tiên khi xung đột:** luật cũ thắng luật mới
   (R → B/F/D → K → agent), và P1 (khách trả tiền) > P2 > P3 > P4.
6. Đầu ra agent là tài liệu trong `resources/docs/` — commit chúng như
   sản phẩm, vì với dự án portfolio này, tài liệu cũng là thứ đem đi bán.

---

## 6. Sơ đồ tổng

```
Khách gửi mẫu/yêu cầu ──→ pnpm crawl:full ──→ node download-images.mjs
                                │
                                ▼
                     ① website-teardown ──── resources/docs/teardown/
                                │
                                ▼
                     ② customer-mindset  (S1–S5, M1–M6, P1–P4)
                                │
                                ▼
                     ③ CỔNG K0 — 5 câu hỏi, bạn trả lời
                                │
                                ▼
                     ④ conversion-blueprint ─ resources/docs/specs/   ←── BẠN DUYỆT
                                │
                                ▼
                     ⑤ image-curator ──────── resources/docs/curation/
                                │
                                ▼
                     ⑥ Thực thi (frontend-design / ui-ux-pro-max / Figma)
                                │
                                ▼
                     ⑦ Nghiệm thu: customer-mindset + K1–K8 + pnpm check
```
