# Handover — Quy Trình Làm Việc

Thư mục điều phối công việc của `apps/2026-thenamduhill`.

```
handover/
  README.md                 ← đang đọc
  plan/                     tài liệu kế hoạch dài hạn
  tasks/
    release-v1.0.0/
      OVERVIEW.md           ← ĐỌC ĐẦU TIÊN: vai trò, kiến trúc, DoD, bảng tiến độ
      pending/              ticket đã viết, chờ tới lượt
      process/              đang làm
      done/                 QC đã verify đạt DoD
```

## Bắt đầu từ đâu

1. Đọc [`tasks/release-v1.0.0/OVERVIEW.md`](tasks/release-v1.0.0/OVERVIEW.md) — toàn bộ kiến trúc, vai trò và Definition of Done.
2. Xem bảng tiến độ ở `OVERVIEW.md §7` để biết ticket nào đang ở đâu.
3. Mở ticket của mình trong `pending/` hoặc `process/`.

## Quy tắc ngắn gọn

| | |
|---|---|
| Đặt tên ticket | `<mã giai đoạn>-<số>.md` — ví dụ `200-03.md` |
| Ai đưa vào `process/` | PM, sau khi SA duyệt kỹ thuật |
| Ai đưa vào `done/` | **Chỉ QC**, sau khi verify từng dòng DoD |
| Tối đa ở `process/` | 3 ticket cùng lúc |
| Ticket ở `done/` | Không sửa nữa — phát sinh thì mở ticket mới |

## Mã giai đoạn

| Mã | Giai đoạn | Mốc |
|---|---|---|
| `000` | Nền tảng — Schema, Permission, Auth | trước 08/08 |
| `100` | Giao diện Client & CMS Admin | 10/08 |
| `200` | Database, API & Thông báo | 17/08 |
| `300` | Thanh toán thật, Domain & Bàn giao | 24–28/08 |
| `900` | Bug phát sinh | bất kỳ |

## Tài liệu liên quan

- [Bản PM — Scope & Bộ câu hỏi phỏng vấn khách](../../../resources/docs/briefs/client-sales-proposal-scope.md)
- [Bản Dev — Schema SQL & Danh sách ticket](../../../resources/docs/briefs/dev-execution-roadmap-tickets.md)
- [Luật kiến trúc monorepo](../../../.claude/rules/architecture.md)
- [Luật nghiệp vụ đặt phòng](../../../.claude/rules/booking-domain.md)
