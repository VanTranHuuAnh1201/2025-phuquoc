---
description: Sinh N hướng thiết kế (Design DNA) từ blueprint, gắn ★ recommended
argument-hint: <tên-khách> [số-hướng, mặc định 6]
---

Đề xuất các hướng thiết kế cho khách `$1`. Mặc định 6 hướng, user đổi được
bằng tham số thứ hai.

## Đây là CỔNG 2 — kết thúc bằng việc dừng lại chờ user chọn

Lệnh này **không** dựng theme. Nó xuất danh sách hướng để user chọn.

## Điều kiện tiên quyết

`resources/docs/briefs/$1.md` và `$1-blueprint.md` phải tồn tại và **đã được
user duyệt**. Chưa có → nói user chạy `/research $1` trước, dừng lại.

## Design DNA là gì

Đọc `.claude/rules/premium-quality-gate.md` §P1. Mỗi hướng phải khai **đủ 5
khối**, không thiếu khối nào:

```
Theme Name     tên gọi ngắn, gợi hình
One Sentence   một câu mô tả point of view
3 Keywords     ba từ, ngăn bằng ·
Do             3–5 gạch đầu dòng — thứ hướng này theo đuổi
Don't          3–5 gạch đầu dòng — thứ hướng này TỪ CHỐI làm
```

Khối `Don't` là quan trọng nhất và hay bị viết hời hợt. Nó là thứ dùng để
nghiệm thu sau này: ship một thứ vi phạm `Don't` của chính mình = FAIL.

## Ràng buộc khi sinh

1. **Phân biệt được bằng mắt trong 3 giây** trên trang hub. Hai hướng mà nhìn
   lướt thấy giống nhau thì một trong hai là thừa — đây chính là sản phẩm đang
   bán ("N giao diện khác nhau").

2. **Mỗi hướng phải bám blueprint**, không phải ý thích. Nếu blueprint nói khách
   cần "trust above the fold" thì cả N hướng đều phải giải quyết điều đó, chỉ
   khác cách.

3. **Tôn trọng câu trả lời K0** trong brief: nếu user đã chốt "tĩnh sang trọng"
   ở Q4 thì không đề xuất hướng đầy scroll effect.

4. **Kèm bảng token dự kiến** cho mỗi hướng: `--color-brand`, `--color-accent`,
   font display, font body. Đủ để thấy chúng khác nhau thật, không chỉ khác tên.

5. **Chọn styling engine** cho mỗi hướng: `styling-tailwind` (mặc định) hoặc
   `styling-css`. Ghi rõ (luật R14).

## Gắn ★ RECOMMENDED

Đúng **một** hướng được gắn ★, kèm 2–3 câu lý do dựa trên blueprint và tâm thế
khách — không phải "tôi thấy đẹp".

Các hướng còn lại **giữ nguyên trong file** làm kho ý tưởng. Chúng không bị bỏ
đi, chỉ là chưa được chọn.

## Xuất

`resources/docs/directions/$1.md`:

```markdown
# Hướng thiết kế — <tên khách>

> Sinh từ `briefs/$1-blueprint.md` ngày <ngày>
> Chọn xong thì chạy `/build-themes $1`

## ★ 01 — <Theme Name>   RECOMMENDED

**Vì sao chọn:** <2-3 câu bám blueprint>

| | |
|---|---|
| One Sentence | … |
| 3 Keywords | … · … · … |
| Engine | styling-tailwind |
| brand / accent | `#…` / `#…` |
| Display / Body | … / … |

**Do:** …
**Don't:** …

## 02 — <Theme Name>
…
```

## DỪNG LẠI

Báo user bằng AskUserQuestion:

> Đã có N hướng tại `resources/docs/directions/$1.md`. Chạy hướng nào?
> - Chỉ ★ recommended
> - Tất cả N hướng
> - Chọn thủ công (user gõ số)

**Không tự chạy `/build-themes`.** Chờ user chọn.
