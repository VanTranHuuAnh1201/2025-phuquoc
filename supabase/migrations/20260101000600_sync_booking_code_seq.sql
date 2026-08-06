-- =============================================================================
-- 20260101000600_sync_booking_code_seq.sql
--
-- Ticket 200-01 — VÁ LỖI phát hiện khi verify trên PostgreSQL 15 thật.
--
-- Triệu chứng: seed `…000400` chèn 39 đơn demo mang mã 'ĐH-2026-0001' …
-- 'ĐH-2026-0040' nhưng KHÔNG hề đụng tới `public.booking_code_seq`. Sequence
-- vẫn nằm ở 1, trong khi `bookings.code` có ràng buộc UNIQUE
-- (`bookings_code_key`).
--
-- Hệ quả nếu không vá: đơn thật ĐẦU TIÊN do `200-03` tạo gọi
-- `next_booking_code()` → nhận lại 'ĐH-2026-0001' → đụng đúng đơn demo đã có →
-- `duplicate key value violates unique constraint "bookings_code_key"`.
-- Nghĩa là luồng đặt phòng hỏng ngay ở lần đặt đầu tiên trên DB đã seed.
--
-- Vì sao là file MỚI chứ không sửa `…000400`: luật BE8 — migration đi một
-- chiều, cấm sửa file đã chạy. File này chạy sau nên thấy đủ dữ liệu seed.
--
-- Vì sao tính từ dữ liệu chứ không `setval(…, 41)` cứng: seed có thể đổi số
-- lượng đơn khi chạy lại `pnpm seed:build`. Đọc thẳng từ bảng thì đúng với
-- mọi trạng thái DB, kể cả DB trống (khi đó giữ nguyên sequence ở 1).
-- =============================================================================


DO $$
DECLARE
    max_seq bigint;
BEGIN
    -- Lấy phần số cuối của mã đơn đang có: 'ĐH-2026-0040' → 40.
    -- Chỉ xét mã đúng khuôn ĐH-<năm>-<4 số>; mã lạ (nếu có) bị bỏ qua thay vì
    -- làm đổ migration.
    SELECT COALESCE(max((regexp_match(code, '^ĐH-[0-9]{4}-([0-9]+)$'))[1]::bigint), 0)
      INTO max_seq
      FROM public.bookings
     WHERE code ~ '^ĐH-[0-9]{4}-[0-9]+$';

    -- `is_called = true` ⇒ nextval() kế tiếp trả max_seq + 1.
    -- DB trống (max_seq = 0): đặt lại về 1 với is_called = false ⇒ nextval()
    -- đầu tiên trả đúng 1, giữ nguyên hành vi hiện tại.
    IF max_seq > 0 THEN
        PERFORM setval('public.booking_code_seq', max_seq, TRUE);
    ELSE
        PERFORM setval('public.booking_code_seq', 1, FALSE);
    END IF;
END $$;
