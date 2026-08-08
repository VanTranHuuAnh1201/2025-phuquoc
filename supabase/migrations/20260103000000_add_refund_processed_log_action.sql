-- Migration: mở rộng chk_logs_action thêm 'refund-processed' (Ticket 900-01)
--
-- Vì sao có file này (BUG 900-01):
--   `refund_booking_payment()` (20260102000100) ghi action = 'refund-processed',
--   nhưng `chk_logs_action` (20260101000100) chỉ nhận đúng 9 giá trị và KHÔNG có
--   giá trị đó ⇒ MỌI lời gọi POST /api/bookings/[id]/refund đều nổ
--     23514  new row for relation "activity_logs"
--            violates check constraint "chk_logs_action"
--   Route bắt lỗi RPC rồi trả serverError() ⇒ hoàn tiền hỏng 100%.
--   Đã đo trên DB thật: 9 giá trị cũ đều ACCEPT, 'refund-processed' REJECT.
--
-- Vì sao mở rộng constraint (hướng A) thay vì bắt RPC ghi 'payment-recorded':
--   ActivityLog là bằng chứng khi tranh chấp với khách (booking-domain §B1).
--   Gộp thu tiền và hoàn tiền vào chung một mã là tự bỏ mất chiều tiền — đúng
--   thứ nhật ký sinh ra để phân giải. Chi phí chênh lệch chỉ là một giá trị.
--
-- BE7: đây là file MỚI, không sửa file migration đã chạy.
-- BE8: `LogAction` trong packages/core/src/booking-types.ts được cập nhật cho
--   khớp trong cùng thay đổi này.

BEGIN;

-- ① Dọn rác do lần dò constraint của 900-01 để lại.
--    activity_logs là bảng BẤT BIẾN (BE5) — không có GRANT DELETE cho service
--    role, nên phải dọn ở đây, trong migration, một lần duy nhất.
DELETE FROM public.activity_logs WHERE actor_id = 'PROBE';

-- ② Mở rộng constraint: 9 giá trị cũ giữ nguyên + 'refund-processed'.
ALTER TABLE public.activity_logs DROP CONSTRAINT IF EXISTS chk_logs_action;

ALTER TABLE public.activity_logs ADD CONSTRAINT chk_logs_action CHECK (action IN (
    'created','status-changed','payment-recorded','checked-in','checked-out',
    'note-added','room-assigned','price-adjusted','cancelled',
    'refund-processed'
));

COMMIT;
