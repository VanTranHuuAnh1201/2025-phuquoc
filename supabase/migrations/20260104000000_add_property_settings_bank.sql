-- Migration: thêm cột `property_settings.bank` (Ticket 390-01, nợ M30)
--
-- Vì sao có file này:
--   `packages/core/src/booking-types.ts` khai `BankConfig` và ghi rằng nó map
--   vào `property_settings.bank` (jsonb). **Cột đó chưa bao giờ tồn tại.**
--   Đã đọc `information_schema.columns` trên DB sống ngày 08/08/2026 — bảng chỉ
--   có 11 cột: id, brand, hero, about, facts, nav, transport, notes,
--   child_policy, created_at, updated_at.
--
--   Viết `GET/PATCH /api/admin/settings/bank` trước khi thêm cột sẽ ăn
--     42703  column "bank" does not exist
--   mà `pnpm build` + `pnpm typecheck` vẫn XANH — TypeScript không biết gì về
--   schema Postgres. Đúng loại lỗi chỉ nổ lúc chạy.
--
-- Vì sao thêm CỘT chứ không tạo bảng `settings` key-value riêng (ndh-sa chốt ở
-- 380-02 §8.3 điểm 1):
--   Đây là cấu hình của MỘT cơ sở, đúng MỘT hàng. Thêm một bảng chỉ để giữ 4
--   trường là phức tạp thừa (C11), và làm mất tính nguyên tử khi sửa cùng lúc
--   nhiều nhóm cấu hình. `property_settings` đã là nơi 9 nhóm cấu hình khác
--   đang sống — bank thuộc về đúng chỗ đó.
--
-- Vì sao `NOT NULL DEFAULT '{}'::jsonb`:
--   `'{}'` là trạng thái HỢP LỆ, không phải trạng thái thiếu: cơ sở mới cài đặt
--   thì chưa nhập số tài khoản. Hợp đồng API (`BankSettingsDto`) vì vậy khai
--   MỌI trường tuỳ chọn — FE phải chịu được object rỗng, không được giả định
--   đã có số TK. Đặt NOT NULL để route không phải phân biệt `null` với `{}`
--   (hai cách biểu diễn cùng một ý nghĩa là mầm lỗi).
--   Với hàng đã có sẵn, DEFAULT lấp đầy ngay ⇒ không có bước backfill riêng.
--
-- RLS (luật BE3): `property_settings` ĐÃ bật RLS và ĐÃ có policy
--   `property_settings_public_read` (SELECT, anon+authenticated, USING true) từ
--   20260101000200_rls_policies.sql. Thêm một cột KHÔNG tạo ra bề mặt mới cần
--   policy mới — policy áp ở mức hàng, không phải mức cột.
--
--   ⚠️ Có chủ ý KHÔNG thêm policy ghi: mọi thao tác ghi cấu hình đi qua
--   Route Handler dùng service role, sau `requirePermission('settings.bank')`.
--   Thêm policy INSERT/UPDATE cho `authenticated` ở đây sẽ mở đường ghi thứ hai
--   KHÔNG qua kiểm quyền của app — rộng hơn hẳn thứ đang cần.
--
-- ⚠️ Cột này chứa số tài khoản nhận tiền cọc của khách. Policy đọc công khai
--   hiện tại (`USING true`) là kế thừa từ 20260101000200 và nằm NGOÀI phạm vi
--   ticket này; ghi nợ tại đây để không rơi mất — xem MANUAL.md M40.
--
-- BE7: file MỚI, không sửa migration đã chạy.

BEGIN;

ALTER TABLE public.property_settings
    ADD COLUMN IF NOT EXISTS bank jsonb NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.property_settings.bank IS
    'Tài khoản ngân hàng nhận cọc — {bankName, accountNumber, accountHolder, defaultDepositPercent}. '
    '`{}` là trạng thái hợp lệ khi cơ sở chưa nhập. Ticket 390-01.';

COMMIT;
