---
description: Scaffold một domain mới trong monorepo — hỏi đủ trước khi sinh code
argument-hint: <tên-domain> (không dấu, ví dụ clinic / saas / restaurant)
---

Tạo domain mới `$1` trong monorepo này.

## Trước khi sinh bất cứ file nào

Đọc [resources/docs/NEW-DOMAIN.md](../../resources/docs/NEW-DOMAIN.md) và
[.claude/rules/architecture.md](../rules/architecture.md).

**Hỏi user bằng AskUserQuestion những điều chưa rõ** — không đoán, không bịa
(luật K0). Bốn điều tối thiểu phải biết:

| # | Cần rõ | Vì sao không được đoán |
|---|---|---|
| 1 | Sản phẩm bán gì, khách cuối là ai | Quyết định toàn bộ mô hình dữ liệu |
| 2 | **Hành động chính** — việc mà mọi thứ khác phục vụ | Đây là trục của cả domain; sai là sai hết |
| 3 | Ba đến năm thực thể nghiệp vụ chính | Là bộ type sẽ sinh ra |
| 4 | Có website tham chiếu không | Có thì chạy `website-teardown` trước |

Điều nào user đã nói trong prompt thì **không hỏi lại**.

**Kiểm tra trước tiên:** đây có thật sự là domain mới không, hay chỉ là theme
mới / dữ liệu mới? Phép thử: *"`RoomType`, `Inventory` có nghĩa gì với sản phẩm
này không?"* Có nghĩa → không phải domain mới, nói rõ với user và dừng lại.

## Sinh khung

Sau khi user trả lời, tạo `packages/domain-$1/`:

```
package.json      deps: @repo/ui, @repo/ui-layout, @repo/utils
tsconfig.json     extends @repo/tsconfig/react.json
src/
  index.ts        barrel + docblock ghi rõ ranh giới với tầng nền
  types.ts        type nghiệp vụ, mọi chuỗi khách thấy là I18nText
  repository.ts   async sẵn từ đầu (để đổi sang backend không đổi chữ ký)
  strings.ts      chuỗi song ngữ của ngành
  shell-adapter.ts dịch dữ liệu domain → prop nguyên thuỷ của ui-layout
  pages/          để trống, điền sau
```

Lấy [packages/domain-hotel](../../packages/domain-hotel) làm khuôn mẫu —
đặc biệt `shell-adapter.ts`, nó là mảnh nối quan trọng nhất.

## Luật bắt buộc khi sinh

- **R15** — không nhét khái niệm ngành của domain này vào `utils`/`ui`/`ui-layout`
- **R1** — không import `domain-*` khác, kể cả để "dùng tạm"
- **R6** — mọi chuỗi khách thấy là `{ vi, en }`, không ngoại lệ
- **R2** — `types.ts`/`repository.ts` không chứa JSX
- Comment tiếng Việt, giải thích **vì sao** chứ không mô tả cái mắt đã thấy

## Sau khi sinh

1. `pnpm install`
2. `pnpm build` — cả N app phải xanh
3. Báo cáo cho user: đã tạo gì, tái dùng được bao nhiêu từ tầng nền, bước tiếp
   theo là `/research` để làm giao diện

Không tự tuyên bố xong khi chưa chạy build.
