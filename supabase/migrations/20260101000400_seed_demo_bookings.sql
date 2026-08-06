-- =============================================================================
-- 20260101000400_seed_demo_bookings.sql
--
-- SINH TỰ ĐỘNG bởi resources/scripts/seed/build-seed.ts — ĐỪNG SỬA TAY.
-- Chạy lại: pnpm seed:build
--
-- Ticket 200-01 §6.5 — tồn kho 90 ngày + ~30 đơn demo + payments + activity_logs
-- + notifications, NHẤT QUÁN NỘI BỘ với nhau.
--
-- Ngày mốc cố định: 2026-08-06 (không dùng new Date() — xem đầu build-seed.ts).
--
-- Ràng buộc đã bảo đảm khi sinh:
--   · bookings.paid_amount = Σ payments (deposit+balance+surcharge) − refund
--   · mỗi đơn có ≥1 activity_logs dòng 'created'
--   · inventory.booked_units = số đơn holdsInventory() phủ đêm đó
--   · đơn expired/cancelled/no_show KHÔNG cộng vào booked_units
--   · remaining_amount BỎ khỏi INSERT — là cột GENERATED (bẫy #3)
-- =============================================================================


-- ---------------------------------------------------------------------------
-- 1. accounts — 39 hồ sơ khách (role='customer')
-- ---------------------------------------------------------------------------

INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('a73667df-9606-490e-89c4-2829937cbaa0'::uuid, 'customer', 'Trần Thị Khánh', '0996138875', '0996138875@example.com', 6786990, 1, '2026-06-21T15:34:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('e476ccc6-14a7-4417-8584-72d878c584e9'::uuid, 'customer', 'Bùi Thanh Quân', '0945015171', '0945015171@example.com', 4477600, 1, '2026-07-07T19:05:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('da5fdc30-25ea-47e1-849d-78be0a7e1c87'::uuid, 'customer', 'Vũ Đức Hà', '0993312183', '0993312183@example.com', 4123750, 1, '2026-07-13T10:40:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('add275f7-33fb-4816-8f45-87b1c5027600'::uuid, 'customer', 'Sarah Johnson', '0995273375', '0995273375@example.com', 0, 0, '2026-09-09T22:49:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('1b0c33ba-4745-4daf-8b59-0be8f41b0e5d'::uuid, 'customer', 'Bùi Thanh Ngọc', '0930558830', '0930558830@example.com', 12284064, 1, '2026-06-13T11:06:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('28386a41-8a99-4078-860a-7ef3dcf5f18a'::uuid, 'customer', 'Michael Chen', '0975785957', '0975785957@example.com', 25189722, 1, '2026-06-21T12:03:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('b7e3006e-c6a6-4277-852f-bc14f9471785'::uuid, 'customer', 'Hoàng Thu Minh', '0959077899', '0959077899@example.com', 1850000, 1, '2026-07-06T15:53:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('42f5b509-17bd-4ac4-87e6-a24f868156f2'::uuid, 'customer', 'David Park', '0951321540', '0951321540@example.com', 0, 0, '2026-08-31T14:41:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('f999c879-dfc3-4010-8902-11f3eb860932'::uuid, 'customer', 'Đặng Kim Bình', '0969913087', '0969913087@example.com', 0, 0, '2026-07-24T20:42:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('b8a4cf36-6a1b-454f-8963-e98c65397515'::uuid, 'customer', 'Lê Hoàng An', '0948494537', '0948494537@example.com', 0, 0, '2026-07-09T18:07:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('ccbbe5a9-d1ac-4120-8503-9c337678a8ba'::uuid, 'customer', 'Nguyễn Văn Dũng', '0999475386', '0999475386@example.com', 0, 0, '2026-07-19T21:40:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('96aa3e2a-ef6f-4f3b-80c1-417c69715e6d'::uuid, 'customer', 'John Smith', '0933156923', '0933156923@example.com', 0, 0, '2026-09-15T20:07:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('bfc32598-da77-4685-88ca-df4abc209527'::uuid, 'customer', 'David Park', '0984916787', '0984916787@example.com', 5366900, 1, '2026-05-25T10:16:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('7e90f98f-d9fb-4512-87b2-45491377d93c'::uuid, 'customer', 'Hoàng Thu Minh', '0981539252', '0981539252@example.com', 0, 0, '2026-07-29T22:00:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('192545c7-dc9e-4b12-81c7-9c0dcfdc7ad8'::uuid, 'customer', 'Sarah Johnson', '0919594984', '0919594984@example.com', 0, 0, '2026-08-20T10:53:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('a1c379cc-287d-4669-8b1e-e492d848a94f'::uuid, 'customer', 'Đặng Kim An', '0973185851', '0973185851@example.com', 0, 0, '2026-09-16T08:56:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('569d8e96-7136-48f3-86a0-32c88093d44d'::uuid, 'customer', 'Michael Chen', '0914506369', '0914506369@example.com', 14155000, 1, '2026-07-21T15:51:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('e8c0be73-73af-42e6-8843-604502e389a8'::uuid, 'customer', 'Phạm Minh Quân', '0932909666', '0932909666@example.com', 0, 0, '2026-07-19T09:17:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('7a7eb493-475f-4dae-84d5-39d5e7687608'::uuid, 'customer', 'Đỗ Quang Ngọc', '0997020380', '0997020380@example.com', 12275748, 1, '2026-07-14T17:05:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('3df6f316-b1d4-4fb3-8b0d-e840d3818fdd'::uuid, 'customer', 'Trần Thị Phương', '0950046573', '0950046573@example.com', 0, 0, '2026-07-02T20:39:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('ff85f815-532e-4324-8184-9a23f4665d22'::uuid, 'customer', 'Nguyễn Văn Khánh', '0996594794', '0996594794@example.com', 2160000, 1, '2026-06-27T16:16:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('90a1ca43-ea15-4496-8b2d-5ce9af516004'::uuid, 'customer', 'Đỗ Quang Phương', '0964569566', '0964569566@example.com', 0, 0, '2026-07-19T19:27:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('7c7f6106-4f99-4c53-8919-d9989b1c9aa5'::uuid, 'customer', 'Vũ Đức Minh', '0967196256', '0967196256@example.com', 0, 0, '2026-08-19T08:58:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('820f2a6b-9d81-4986-8e38-7e5d065d8b80'::uuid, 'customer', 'Ngô Bảo An', '0996787606', '0996787606@example.com', 0, 0, '2026-09-05T16:39:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('a71bacee-739c-4d4f-8084-5d08d84a8b21'::uuid, 'customer', 'Đặng Kim Linh', '0941028427', '0941028427@example.com', 7684313, 1, '2026-07-03T11:23:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('c65351e5-d1f9-44bc-8241-26c369277e72'::uuid, 'customer', 'Đặng Kim Ngọc', '0971160877', '0971160877@example.com', 13978737, 1, '2026-06-04T15:36:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('e2df69bd-9dd3-4dfc-8ab9-118bd7d6517a'::uuid, 'customer', 'Hoàng Thu Ngọc', '0950262288', '0950262288@example.com', 0, 0, '2026-09-19T18:35:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('8ba4553c-4228-4715-8f4a-c936176f7d37'::uuid, 'customer', 'Emma Wilson', '0937000424', '0937000424@example.com', 3308875, 1, '2026-07-26T08:07:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('0c17f48f-6641-4766-8cc9-2de178acc888'::uuid, 'customer', 'Phạm Minh Phương', '0975652408', '0975652408@example.com', 4033750, 1, '2026-07-05T14:02:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('69678ea4-e1ae-4dc1-85aa-d6f6a83832c3'::uuid, 'customer', 'Vũ Đức Quân', '0931273318', '0931273318@example.com', 1755000, 1, '2026-06-04T16:21:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('59d8728f-f425-42de-83d9-54a9857f17c0'::uuid, 'customer', 'Bùi Thanh Quân', '0929600831', '0929600831@example.com', 0, 0, '2026-08-11T11:19:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('c01a8e88-7ef5-4a29-8d2e-146e0ace6597'::uuid, 'customer', 'Sarah Johnson', '0910702109', '0910702109@example.com', 12748680, 1, '2026-06-28T14:28:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('b8ca0053-c40b-468e-8c5f-469966047afc'::uuid, 'customer', 'Phạm Minh Minh', '0918930341', '0918930341@example.com', 0, 0, '2026-07-31T10:13:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('2357e7a8-30a3-44c5-8247-438a444adfe7'::uuid, 'customer', 'Sarah Johnson', '0984303130', '0984303130@example.com', 17348486, 1, '2026-06-07T12:21:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('620f4119-81eb-4b3c-8cec-02230391f34e'::uuid, 'customer', 'Emma Wilson', '0912478470', '0912478470@example.com', 0, 0, '2026-07-14T14:17:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('f098f7e8-fd7f-4435-83f4-290e7a6b3d93'::uuid, 'customer', 'Bùi Thanh Khánh', '0999112107', '0999112107@example.com', 0, 0, '2026-08-02T22:02:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('f35c17d2-7484-47b7-8799-acb874c24f15'::uuid, 'customer', 'Lê Hoàng Quân', '0911574897', '0911574897@example.com', 1020000, 1, '2026-06-16T13:21:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('d41257bf-0a13-49fe-8427-36457994c534'::uuid, 'customer', 'Bùi Thanh Minh', '0931090112', '0931090112@example.com', 0, 0, '2026-07-17T19:04:00.000Z');
INSERT INTO public.accounts (id, role, full_name, phone, email, total_spent, stay_count, created_at)
VALUES ('66dbda94-6113-46a9-8fd1-1f16959b2043'::uuid, 'customer', 'Sarah Johnson', '0973465692', '0973465692@example.com', 0, 0, '2026-07-31T08:26:00.000Z');

-- ---------------------------------------------------------------------------
-- 2. inventory — 1800 hàng, 90 ngày × 20 hạng
-- price_override: 3 ngày · min_nights: 162 ngày · closed_to_arrival: 1 ngày
-- (AC-9 yêu cầu ≥3 / ≥2 / ≥1 — phục vụ test 200-02)
-- ---------------------------------------------------------------------------

INSERT INTO public.inventory (room_type_id, date, total_units, booked_units, blocked_units, price_override, min_nights, closed_to_arrival, version) VALUES
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-08-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-08-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-08-08', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-08-09', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-08-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-08-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-08-12', 6, 0, 1, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-08-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-08-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-08-15', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-08-16', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-08-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-08-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-08-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-08-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-08-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-08-22', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-08-23', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-08-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-08-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-08-26', 6, 0, 0, 3394800, 2, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-08-27', 6, 0, 0, 3394800, 2, TRUE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-08-28', 6, 0, 0, 3394800, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-08-29', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-08-30', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-08-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-09-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-09-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-09-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-09-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-09-05', 6, 0, 5, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-09-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-09-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-09-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-09-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-09-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-09-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-09-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-09-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-09-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-09-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-09-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-09-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-09-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-09-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-09-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-09-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-09-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-09-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-09-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-09-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-09-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-09-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-09-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-09-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-09-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-10-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-10-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-10-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-10-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-10-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-10-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-10-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-10-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-10-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-10-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-10-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-10-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-10-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-10-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-10-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-10-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-10-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-10-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-10-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-10-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-10-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-10-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-10-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-10-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-10-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-10-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-10-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-10-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-10-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-10-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-10-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-11-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-11-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-nhin-ra-bien-01', '2026-11-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-08-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-08-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-08-08', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-08-09', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-08-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-08-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-08-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-08-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-08-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-08-15', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-08-16', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-08-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-08-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-08-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-08-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-08-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-08-22', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-08-23', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-08-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-08-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-08-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-08-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-08-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-08-29', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-08-30', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-08-31', 6, 0, 1, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-09-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-09-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-09-03', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-09-04', 6, 1, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-09-05', 6, 1, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-09-06', 6, 1, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-09-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-09-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-09-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-09-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-09-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-09-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-09-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-09-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-09-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-09-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-09-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-09-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-09-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-09-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-09-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-09-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-09-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-09-24', 6, 0, 1, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-09-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-09-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-09-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-09-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-09-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-09-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-10-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-10-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-10-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-10-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-10-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-10-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-10-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-10-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-10-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-10-10', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-10-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-10-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-10-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-10-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-10-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-10-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-10-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-10-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-10-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-10-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-10-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-10-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-10-23', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-10-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-10-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-10-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-10-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-10-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-10-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-10-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-10-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-11-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-11-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-08-08', '2026-11-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-08-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-08-07', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-08-08', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-08-09', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-08-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-08-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-08-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-08-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-08-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-08-15', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-08-16', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-08-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-08-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-08-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-08-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-08-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-08-22', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-08-23', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-08-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-08-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-08-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-08-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-08-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-08-29', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-08-30', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-08-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-09-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-09-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-09-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-09-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-09-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-09-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-09-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-09-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-09-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-09-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-09-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-09-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-09-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-09-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-09-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-09-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-09-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-09-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-09-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-09-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-09-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-09-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-09-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-09-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-09-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-09-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-09-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-09-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-09-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-09-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-10-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-10-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-10-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-10-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-10-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-10-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-10-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-10-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-10-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-10-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-10-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-10-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-10-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-10-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-10-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-10-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-10-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-10-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-10-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-10-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-10-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-10-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-10-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-10-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-10-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-10-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-10-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-10-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-10-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-10-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-10-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-11-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-11-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', '2026-11-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-08-06', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-08-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-08-08', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-08-09', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-08-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-08-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-08-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-08-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-08-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-08-15', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-08-16', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-08-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-08-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-08-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-08-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-08-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-08-22', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-08-23', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-08-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-08-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-08-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-08-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-08-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-08-29', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-08-30', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-08-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-09-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-09-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-09-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-09-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-09-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-09-06', 6, 1, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-09-07', 6, 1, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-09-08', 6, 1, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-09-09', 6, 1, 1, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-09-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-09-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-09-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-09-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-09-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-09-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-09-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-09-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-09-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-09-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-09-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-09-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-09-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-09-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-09-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-09-25', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-09-26', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-09-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-09-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-09-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-09-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-10-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-10-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-10-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-10-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-10-05', 6, 1, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-10-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-10-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-10-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-10-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-10-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-10-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-10-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-10-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-10-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-10-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-10-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-10-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-10-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-10-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-10-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-10-21', 6, 0, 1, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-10-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-10-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-10-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-10-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-10-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-10-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-10-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-10-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-10-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-10-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-11-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-11-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-tieu-chuan-giuong-doi-luc-giac-05', '2026-11-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-08-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-08-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-08-08', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-deluxe-06', '2026-08-09', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-deluxe-06', '2026-08-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-08-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-08-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-08-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-08-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-08-15', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-deluxe-06', '2026-08-16', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-deluxe-06', '2026-08-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-08-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-08-19', 6, 1, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-08-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-08-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-08-22', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-deluxe-06', '2026-08-23', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-deluxe-06', '2026-08-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-08-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-08-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-08-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-08-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-08-29', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-deluxe-06', '2026-08-30', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-deluxe-06', '2026-08-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-09-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-09-02', 6, 0, 1, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-09-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-09-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-09-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-09-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-09-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-09-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-09-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-09-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-09-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-09-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-09-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-09-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-09-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-09-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-09-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-09-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-09-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-09-20', 6, 0, 1, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-09-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-09-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-09-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-09-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-09-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-09-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-09-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-09-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-09-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-09-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-10-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-10-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-10-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-10-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-10-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-10-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-10-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-10-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-10-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-10-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-10-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-10-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-10-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-10-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-10-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-10-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-10-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-10-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-10-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-10-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-10-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-10-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-10-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-10-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-10-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-10-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-10-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-10-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-10-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-10-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-10-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-11-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-11-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-deluxe-06', '2026-11-03', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-08-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-08-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-08-08', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-08-09', 6, 0, 1, NULL, 2, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-08-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-08-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-08-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-08-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-08-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-08-15', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-08-16', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-08-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-08-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-08-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-08-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-08-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-08-22', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-08-23', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-08-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-08-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-08-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-08-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-08-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-08-29', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-08-30', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-08-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-09-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-09-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-09-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-09-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-09-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-09-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-09-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-09-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-09-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-09-10', 6, 1, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-09-11', 6, 1, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-09-12', 6, 1, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-09-13', 6, 1, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-09-14', 6, 1, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-09-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-09-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-09-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-09-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-09-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-09-20', 6, 0, 1, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-09-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-09-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-09-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-09-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-09-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-09-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-09-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-09-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-09-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-09-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-10-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-10-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-10-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-10-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-10-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-10-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-10-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-10-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-10-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-10-10', 6, 0, 1, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-10-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-10-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-10-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-10-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-10-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-10-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-10-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-10-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-10-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-10-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-10-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-10-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-10-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-10-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-10-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-10-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-10-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-10-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-10-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-10-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-10-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-11-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-11-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-superior-co-giuong-co-king-07', '2026-11-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-08-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-08-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-08-08', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-08-09', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-08-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-08-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-08-12', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-08-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-08-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-08-15', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-08-16', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-08-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-08-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-08-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-08-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-08-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-08-22', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-08-23', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-08-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-08-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-08-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-08-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-08-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-08-29', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-08-30', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-08-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-09-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-09-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-09-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-09-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-09-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-09-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-09-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-09-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-09-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-09-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-09-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-09-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-09-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-09-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-09-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-09-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-09-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-09-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-09-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-09-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-09-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-09-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-09-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-09-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-09-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-09-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-09-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-09-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-09-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-09-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-10-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-10-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-10-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-10-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-10-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-10-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-10-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-10-08', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-10-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-10-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-10-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-10-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-10-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-10-14', 6, 0, 1, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-10-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-10-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-10-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-10-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-10-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-10-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-10-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-10-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-10-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-10-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-10-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-10-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-10-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-10-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-10-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-10-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-10-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-11-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-11-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-nhin-ra-vuon-02', '2026-11-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-08-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-08-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-08-08', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-08-09', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-08-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-08-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-08-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-08-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-08-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-08-15', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-08-16', 6, 0, 2, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-08-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-08-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-08-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-08-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-08-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-08-22', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-08-23', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-08-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-08-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-08-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-08-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-08-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-08-29', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-08-30', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-08-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-09-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-09-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-09-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-09-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-09-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-09-06', 6, 1, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-09-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-09-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-09-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-09-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-09-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-09-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-09-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-09-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-09-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-09-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-09-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-09-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-09-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-09-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-09-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-09-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-09-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-09-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-09-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-09-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-09-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-09-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-09-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-09-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-10-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-10-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-10-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-10-04', 6, 1, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-10-05', 6, 1, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-10-06', 6, 1, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-10-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-10-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-10-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-10-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-10-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-10-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-10-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-10-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-10-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-10-16', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-10-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-10-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-10-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-10-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-10-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-10-22', 6, 0, 1, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-10-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-10-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-10-25', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-10-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-10-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-10-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-10-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-10-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-10-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-11-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-11-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-09-09', '2026-11-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-08-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-08-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-08-08', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-08-09', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-08-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-08-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-08-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-08-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-08-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-08-15', 6, 0, 2, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-08-16', 6, 0, 1, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-08-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-08-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-08-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-08-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-08-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-08-22', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-08-23', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-08-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-08-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-08-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-08-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-08-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-08-29', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-08-30', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-08-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-09-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-09-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-09-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-09-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-09-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-09-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-09-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-09-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-09-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-09-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-09-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-09-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-09-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-09-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-09-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-09-16', 6, 0, 1, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-09-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-09-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-09-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-09-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-09-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-09-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-09-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-09-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-09-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-09-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-09-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-09-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-09-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-09-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-10-01', 6, 1, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-10-02', 6, 1, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-10-03', 6, 1, 1, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-10-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-10-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-10-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-10-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-10-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-10-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-10-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-10-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-10-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-10-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-10-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-10-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-10-16', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-10-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-10-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-10-19', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-10-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-10-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-10-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-10-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-10-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-10-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-10-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-10-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-10-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-10-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-10-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-10-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-11-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-11-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-san-trong-10', '2026-11-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-08-06', 6, 1, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-08-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-08-08', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-08-09', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-08-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-08-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-08-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-08-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-08-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-08-15', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-08-16', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-08-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-08-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-08-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-08-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-08-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-08-22', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-08-23', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-08-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-08-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-08-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-08-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-08-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-08-29', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-08-30', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-08-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-09-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-09-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-09-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-09-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-09-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-09-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-09-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-09-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-09-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-09-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-09-11', 6, 0, 1, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-09-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-09-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-09-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-09-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-09-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-09-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-09-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-09-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-09-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-09-21', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-09-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-09-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-09-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-09-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-09-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-09-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-09-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-09-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-09-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-10-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-10-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-10-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-10-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-10-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-10-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-10-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-10-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-10-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-10-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-10-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-10-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-10-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-10-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-10-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-10-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-10-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-10-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-10-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-10-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-10-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-10-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-10-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-10-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-10-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-10-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-10-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-10-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-10-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-10-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-10-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-11-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-11-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-gia-dinh-view-bien-11', '2026-11-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-08-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-08-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-08-08', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-08-09', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-08-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-08-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-08-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-08-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-08-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-08-15', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-08-16', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-08-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-08-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-08-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-08-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-08-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-08-22', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-08-23', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-08-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-08-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-08-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-08-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-08-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-08-29', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-08-30', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-08-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-09-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-09-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-09-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-09-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-09-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-09-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-09-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-09-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-09-09', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-09-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-09-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-09-12', 6, 0, 1, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-09-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-09-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-09-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-09-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-09-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-09-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-09-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-09-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-09-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-09-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-09-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-09-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-09-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-09-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-09-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-09-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-09-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-09-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-10-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-10-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-10-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-10-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-10-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-10-06', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-10-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-10-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-10-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-10-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-10-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-10-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-10-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-10-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-10-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-10-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-10-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-10-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-10-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-10-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-10-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-10-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-10-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-10-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-10-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-10-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-10-27', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-10-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-10-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-10-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-10-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-11-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-11-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-co-ban-cong-12', '2026-11-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-08-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-08-07', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-08-08', 6, 0, 0, NULL, 2, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-08-09', 6, 0, 0, NULL, 2, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-08-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-08-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-08-12', 6, 0, 1, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-08-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-08-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-08-15', 6, 0, 0, NULL, 2, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-08-16', 6, 0, 0, NULL, 2, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-08-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-08-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-08-19', 6, 0, 1, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-08-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-08-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-08-22', 6, 0, 0, NULL, 2, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-08-23', 6, 0, 0, NULL, 2, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-08-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-08-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-08-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-08-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-08-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-08-29', 6, 0, 0, NULL, 2, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-08-30', 6, 0, 0, NULL, 2, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-08-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-09-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-09-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-09-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-09-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-09-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-09-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-09-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-09-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-09-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-09-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-09-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-09-12', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-09-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-09-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-09-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-09-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-09-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-09-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-09-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-09-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-09-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-09-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-09-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-09-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-09-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-09-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-09-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-09-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-09-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-09-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-10-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-10-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-10-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-10-04', 6, 0, 1, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-10-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-10-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-10-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-10-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-10-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-10-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-10-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-10-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-10-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-10-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-10-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-10-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-10-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-10-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-10-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-10-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-10-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-10-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-10-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-10-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-10-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-10-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-10-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-10-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-10-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-10-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-10-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-11-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-11-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('second-floor-family-with-sea-view-13', '2026-11-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-08-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-08-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-08-08', 6, 0, 0, NULL, 2, FALSE, 1),
    ('rock-deluxe-room-14', '2026-08-09', 6, 0, 0, NULL, 2, FALSE, 1),
    ('rock-deluxe-room-14', '2026-08-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-08-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-08-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-08-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-08-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-08-15', 6, 0, 0, NULL, 2, FALSE, 1),
    ('rock-deluxe-room-14', '2026-08-16', 6, 0, 0, NULL, 2, FALSE, 1),
    ('rock-deluxe-room-14', '2026-08-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-08-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-08-19', 6, 1, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-08-20', 6, 1, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-08-21', 6, 1, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-08-22', 6, 1, 0, NULL, 2, FALSE, 1),
    ('rock-deluxe-room-14', '2026-08-23', 6, 1, 0, NULL, 2, FALSE, 1),
    ('rock-deluxe-room-14', '2026-08-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-08-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-08-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-08-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-08-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-08-29', 6, 0, 0, NULL, 2, FALSE, 1),
    ('rock-deluxe-room-14', '2026-08-30', 6, 0, 0, NULL, 2, FALSE, 1),
    ('rock-deluxe-room-14', '2026-08-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-09-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-09-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-09-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-09-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-09-05', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-09-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-09-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-09-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-09-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-09-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-09-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-09-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-09-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-09-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-09-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-09-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-09-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-09-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-09-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-09-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-09-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-09-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-09-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-09-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-09-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-09-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-09-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-09-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-09-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-09-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-10-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-10-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-10-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-10-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-10-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-10-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-10-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-10-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-10-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-10-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-10-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-10-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-10-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-10-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-10-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-10-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-10-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-10-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-10-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-10-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-10-21', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-10-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-10-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-10-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-10-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-10-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-10-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-10-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-10-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-10-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-10-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-11-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-11-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('rock-deluxe-room-14', '2026-11-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-08-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-08-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-08-08', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-15', '2026-08-09', 6, 0, 1, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-15', '2026-08-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-08-11', 6, 1, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-08-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-08-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-08-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-08-15', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-15', '2026-08-16', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-15', '2026-08-17', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-08-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-08-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-08-20', 6, 1, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-08-21', 6, 1, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-08-22', 6, 1, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-15', '2026-08-23', 6, 1, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-15', '2026-08-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-08-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-08-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-08-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-08-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-08-29', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-15', '2026-08-30', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-giuong-doi-15', '2026-08-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-09-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-09-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-09-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-09-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-09-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-09-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-09-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-09-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-09-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-09-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-09-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-09-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-09-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-09-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-09-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-09-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-09-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-09-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-09-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-09-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-09-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-09-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-09-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-09-24', 6, 0, 1, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-09-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-09-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-09-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-09-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-09-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-09-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-10-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-10-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-10-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-10-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-10-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-10-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-10-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-10-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-10-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-10-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-10-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-10-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-10-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-10-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-10-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-10-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-10-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-10-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-10-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-10-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-10-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-10-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-10-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-10-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-10-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-10-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-10-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-10-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-10-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-10-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-10-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-11-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-11-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-giuong-doi-15', '2026-11-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-08-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-08-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-08-08', 6, 0, 0, NULL, 2, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-08-09', 6, 0, 0, NULL, 2, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-08-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-08-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-08-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-08-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-08-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-08-15', 6, 0, 0, NULL, 2, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-08-16', 6, 0, 0, NULL, 2, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-08-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-08-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-08-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-08-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-08-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-08-22', 6, 0, 0, NULL, 2, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-08-23', 6, 0, 1, NULL, 2, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-08-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-08-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-08-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-08-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-08-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-08-29', 6, 0, 0, NULL, 2, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-08-30', 6, 0, 0, NULL, 2, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-08-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-09-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-09-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-09-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-09-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-09-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-09-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-09-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-09-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-09-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-09-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-09-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-09-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-09-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-09-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-09-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-09-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-09-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-09-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-09-19', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-09-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-09-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-09-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-09-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-09-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-09-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-09-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-09-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-09-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-09-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-09-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-10-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-10-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-10-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-10-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-10-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-10-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-10-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-10-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-10-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-10-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-10-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-10-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-10-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-10-14', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-10-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-10-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-10-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-10-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-10-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-10-20', 6, 0, 1, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-10-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-10-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-10-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-10-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-10-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-10-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-10-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-10-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-10-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-10-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-10-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-11-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-11-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('first-floor-family-with-sea-view-16', '2026-11-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-08-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-08-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-08-08', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-08-09', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-08-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-08-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-08-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-08-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-08-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-08-15', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-08-16', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-08-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-08-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-08-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-08-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-08-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-08-22', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-08-23', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-08-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-08-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-08-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-08-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-08-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-08-29', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-08-30', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-08-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-09-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-09-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-09-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-09-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-09-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-09-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-09-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-09-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-09-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-09-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-09-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-09-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-09-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-09-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-09-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-09-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-09-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-09-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-09-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-09-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-09-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-09-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-09-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-09-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-09-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-09-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-09-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-09-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-09-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-09-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-10-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-10-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-10-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-10-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-10-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-10-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-10-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-10-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-10-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-10-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-10-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-10-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-10-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-10-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-10-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-10-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-10-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-10-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-10-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-10-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-10-21', 6, 0, 1, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-10-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-10-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-10-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-10-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-10-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-10-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-10-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-10-29', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-10-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-10-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-11-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-11-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-huong-thung-lung-bien-17', '2026-11-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-08-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-08-07', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-08-08', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-08-09', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-08-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-08-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-08-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-08-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-08-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-08-15', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-08-16', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-08-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-08-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-08-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-08-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-08-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-08-22', 6, 1, 0, NULL, 2, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-08-23', 6, 1, 0, NULL, 2, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-08-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-08-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-08-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-08-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-08-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-08-29', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-08-30', 6, 0, 0, NULL, 2, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-08-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-09-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-09-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-09-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-09-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-09-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-09-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-09-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-09-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-09-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-09-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-09-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-09-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-09-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-09-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-09-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-09-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-09-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-09-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-09-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-09-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-09-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-09-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-09-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-09-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-09-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-09-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-09-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-09-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-09-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-09-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-10-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-10-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-10-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-10-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-10-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-10-06', 6, 0, 1, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-10-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-10-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-10-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-10-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-10-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-10-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-10-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-10-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-10-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-10-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-10-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-10-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-10-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-10-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-10-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-10-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-10-23', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-10-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-10-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-10-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-10-27', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-10-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-10-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-10-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-10-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-11-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-11-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('phong-03-nguoi-co-ban-cong-18', '2026-11-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-08-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-08-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-08-08', 6, 0, 0, NULL, 2, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-08-09', 6, 0, 0, NULL, 2, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-08-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-08-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-08-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-08-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-08-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-08-15', 6, 0, 0, NULL, 2, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-08-16', 6, 0, 0, NULL, 2, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-08-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-08-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-08-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-08-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-08-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-08-22', 6, 0, 0, NULL, 2, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-08-23', 6, 0, 1, NULL, 2, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-08-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-08-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-08-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-08-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-08-28', 6, 1, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-08-29', 6, 1, 0, NULL, 2, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-08-30', 6, 1, 0, NULL, 2, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-08-31', 6, 1, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-09-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-09-02', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-09-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-09-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-09-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-09-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-09-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-09-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-09-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-09-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-09-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-09-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-09-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-09-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-09-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-09-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-09-17', 6, 1, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-09-18', 6, 1, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-09-19', 6, 1, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-09-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-09-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-09-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-09-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-09-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-09-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-09-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-09-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-09-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-09-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-09-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-10-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-10-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-10-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-10-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-10-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-10-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-10-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-10-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-10-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-10-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-10-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-10-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-10-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-10-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-10-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-10-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-10-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-10-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-10-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-10-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-10-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-10-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-10-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-10-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-10-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-10-26', 6, 0, 1, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-10-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-10-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-10-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-10-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-10-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-11-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-11-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-08-khach-08-09', '2026-11-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-08-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-08-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-08-08', 6, 0, 0, NULL, 2, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-08-09', 6, 0, 0, NULL, 2, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-08-10', 6, 0, 1, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-08-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-08-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-08-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-08-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-08-15', 6, 0, 0, NULL, 2, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-08-16', 6, 1, 0, NULL, 2, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-08-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-08-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-08-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-08-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-08-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-08-22', 6, 0, 0, NULL, 2, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-08-23', 6, 0, 0, NULL, 2, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-08-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-08-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-08-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-08-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-08-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-08-29', 6, 0, 0, NULL, 2, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-08-30', 6, 0, 0, NULL, 2, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-08-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-09-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-09-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-09-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-09-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-09-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-09-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-09-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-09-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-09-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-09-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-09-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-09-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-09-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-09-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-09-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-09-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-09-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-09-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-09-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-09-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-09-21', 6, 0, 1, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-09-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-09-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-09-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-09-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-09-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-09-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-09-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-09-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-09-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-10-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-10-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-10-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-10-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-10-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-10-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-10-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-10-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-10-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-10-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-10-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-10-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-10-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-10-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-10-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-10-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-10-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-10-18', 6, 0, 1, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-10-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-10-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-10-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-10-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-10-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-10-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-10-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-10-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-10-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-10-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-10-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-10-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-10-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-11-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-11-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-10-11', '2026-11-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-08-06', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-08-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-08-08', 6, 0, 2, NULL, 2, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-08-09', 6, 0, 0, NULL, 2, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-08-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-08-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-08-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-08-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-08-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-08-15', 6, 0, 0, NULL, 2, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-08-16', 6, 0, 0, NULL, 2, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-08-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-08-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-08-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-08-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-08-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-08-22', 6, 0, 0, NULL, 2, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-08-23', 6, 0, 0, NULL, 2, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-08-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-08-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-08-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-08-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-08-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-08-29', 6, 0, 0, NULL, 2, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-08-30', 6, 0, 0, NULL, 2, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-08-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-09-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-09-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-09-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-09-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-09-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-09-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-09-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-09-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-09-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-09-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-09-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-09-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-09-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-09-14', 6, 0, 2, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-09-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-09-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-09-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-09-18', 6, 0, 1, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-09-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-09-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-09-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-09-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-09-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-09-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-09-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-09-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-09-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-09-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-09-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-09-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-10-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-10-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-10-03', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-10-04', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-10-05', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-10-06', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-10-07', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-10-08', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-10-09', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-10-10', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-10-11', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-10-12', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-10-13', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-10-14', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-10-15', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-10-16', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-10-17', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-10-18', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-10-19', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-10-20', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-10-21', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-10-22', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-10-23', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-10-24', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-10-25', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-10-26', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-10-27', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-10-28', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-10-29', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-10-30', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-10-31', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-11-01', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-11-02', 6, 0, 0, NULL, NULL, FALSE, 1),
    ('suite-02-phong-ngu-06-khach-15-16', '2026-11-03', 6, 0, 0, NULL, NULL, FALSE, 1);

-- ---------------------------------------------------------------------------
-- 3. bookings — 39 đơn rải 105 ngày
-- Phân bố trạng thái: no_show=1 · checked_out=17 · checked_in=1 · confirmed=14 · expired=1 · cancelled=4 · pending_payment=1
-- ---------------------------------------------------------------------------

INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    '82ee7f38-e6c0-4ef7-8afa-052a113e2bb9'::uuid, 'ĐH-2026-0001', 'phong-giuong-doi-co-ban-cong-12', 'full-board',
    '2026-07-03', '2026-07-05', 2,
    1, '{}'::int[], '{"addon-pickup":1}'::jsonb,
    'Trần Thị Khánh', '0996138875', '0996138875@example.com', NULL,
    '19:00', NULL,
    'a73667df-9606-490e-89c4-2829937cbaa0'::uuid, 'web', 'no_show',
    6786990, 0, 6786990, 3393495, 3393495,
    '[{"kind":"room","refId":"phong-giuong-doi-co-ban-cong-12","quantity":2,"unitPrice":3393495,"total":6786990}]'::jsonb, '[]'::jsonb,
    NULL,
    NULL,
    NULL,
    NULL,
    '2026-06-21T15:34:00.000Z', '2026-06-21T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    '85ee83f1-e7c0-408a-89fa-03970e3e2700'::uuid, 'ĐH-2026-0002', 'phong-gia-dinh-view-bien-08-08', 'standard',
    '2026-07-26', '2026-07-27', 1,
    2, '{}'::int[], '{}'::jsonb,
    'Bùi Thanh Quân', '0945015171', '0945015171@example.com', NULL,
    NULL, NULL,
    'e476ccc6-14a7-4417-8584-72d878c584e9'::uuid, 'web', 'checked_out',
    4477600, 0, 4477600, 1343280, 4477600,
    '[{"kind":"room","refId":"phong-gia-dinh-view-bien-08-08","quantity":1,"unitPrice":4477600,"total":4477600}]'::jsonb, '[]'::jsonb,
    '{"at":"2026-07-26T14:13:00.000Z","roomUnitId":"phong-gia-dinh-view-bien-08-08-1","idNumber":"03483257135","actualGuests":{"adults":2,"children":[]},"earlyCheckIn":false,"staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    '{"at":"2026-07-27T11:49:00.000Z","lateCheckOut":false,"incidentals":[],"settled":true,"comment":"Vỡ một ly thuỷ tinh, đã tính phí.","guestRating":3,"staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    NULL,
    NULL,
    '2026-07-07T19:05:00.000Z', '2026-07-07T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    '84ee825e-e8c0-421d-88fa-02040f3e2893'::uuid, 'ĐH-2026-0003', 'phong-superior-co-giuong-co-king-07', 'standard',
    '2026-07-23', '2026-07-24', 1,
    1, '{3,4}'::int[], '{}'::jsonb,
    'Vũ Đức Hà', '0993312183', '0993312183@example.com', NULL,
    '19:00', 'Kỷ niệm ngày cưới, xin trang trí phòng',
    'da5fdc30-25ea-47e1-849d-78be0a7e1c87'::uuid, 'web', 'checked_out',
    4123750, 0, 4123750, 1237125, 4123750,
    '[{"kind":"room","refId":"phong-superior-co-giuong-co-king-07","quantity":1,"unitPrice":3713750,"total":3713750},{"kind":"extra-bed","refId":"phong-superior-co-giuong-co-king-07","quantity":1,"unitPrice":410000,"total":410000}]'::jsonb, '[]'::jsonb,
    '{"at":"2026-07-23T14:04:00.000Z","roomUnitId":"phong-superior-co-giuong-co-king-07-1","idNumber":"06816727678","actualGuests":{"adults":1,"children":[3,4]},"earlyCheckIn":false,"vehiclePlate":"65A-50411","staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    '{"at":"2026-07-24T11:39:00.000Z","lateCheckOut":true,"incidentals":[{"id":"inc-bk-0003","description":"Đồ uống nhà hàng","amount":100000}],"settled":true,"comment":"Có dùng minibar, đã thanh toán đủ.","guestRating":5,"staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    NULL,
    NULL,
    '2026-07-13T10:40:00.000Z', '2026-07-13T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    '87ee8717-e1c0-4718-87fa-0071143e3072'::uuid, 'ĐH-2026-0004', 'phong-gia-dinh-view-bien-11', 'full-board',
    '2026-08-05', '2026-08-07', 2,
    1, '{}'::int[], '{}'::jsonb,
    'Sarah Johnson', '0995273375', '0995273375@example.com', NULL,
    NULL, 'Đến bằng chuyến tàu chiều, xin giữ phòng',
    'add275f7-33fb-4816-8f45-87b1c5027600'::uuid, 'web', 'checked_in',
    7503840, 0, 7503840, 3751920, 3751920,
    '[{"kind":"room","refId":"phong-gia-dinh-view-bien-11","quantity":2,"unitPrice":3751920,"total":7503840}]'::jsonb, '[]'::jsonb,
    '{"at":"2026-08-05T14:00:00.000Z","roomUnitId":"phong-gia-dinh-view-bien-11-1","idNumber":"079200001234","actualGuests":{"adults":1,"children":[]},"earlyCheckIn":false,"staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    NULL,
    NULL,
    NULL,
    '2026-09-09T22:49:00.000Z', '2026-09-09T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    '89ee8a3d-e3c0-4a3e-85f9-fd4b123e2d4c'::uuid, 'ĐH-2026-0006', 'second-floor-family-with-sea-view-13', 'saver',
    '2026-07-08', '2026-07-12', 4,
    3, '{5}'::int[], '{}'::jsonb,
    'Bùi Thanh Ngọc', '0930558830', '0930558830@example.com', NULL,
    NULL, NULL,
    '1b0c33ba-4745-4daf-8b59-0be8f41b0e5d'::uuid, 'web', 'checked_out',
    13648960, 1364896, 12284064, 12284064, 12284064,
    '[{"kind":"room","refId":"second-floor-family-with-sea-view-13","quantity":4,"unitPrice":3412240,"total":13648960}]'::jsonb, '[{"promotionId":"long-stay","name":{"vi":"Ở dài ngày","en":"Long stay"},"type":"long-stay","discount":1364896,"remainingAfter":12284064,"cappedByMax":false}]'::jsonb,
    '{"at":"2026-07-08T14:53:00.000Z","roomUnitId":"second-floor-family-with-sea-view-13-1","idNumber":"06759462696","actualGuests":{"adults":3,"children":[5]},"earlyCheckIn":false,"vehiclePlate":"65A-47762","staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    '{"at":"2026-07-12T11:37:00.000Z","lateCheckOut":false,"incidentals":[],"settled":true,"comment":"Khách lịch sự, phòng sạch sẽ khi trả.","guestRating":4,"staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    NULL,
    NULL,
    '2026-06-13T11:06:00.000Z', '2026-06-13T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    '88ee88aa-e4c0-4bd1-84f9-fbb8133e2edf'::uuid, 'ĐH-2026-0007', 'suite-02-phong-ngu-08-khach-08-09', 'saver',
    '2026-06-26', '2026-06-30', 4,
    3, '{11,8}'::int[], '{}'::jsonb,
    'Michael Chen', '0975785957', '0975785957@example.com', NULL,
    NULL, NULL,
    '28386a41-8a99-4078-860a-7ef3dcf5f18a'::uuid, 'web', 'checked_out',
    27988580, 2798858, 25189722, 25189722, 25189722,
    '[{"kind":"room","refId":"suite-02-phong-ngu-08-khach-08-09","quantity":4,"unitPrice":6497145,"total":25988580},{"kind":"child","refId":"suite-02-phong-ngu-08-khach-08-09","quantity":8,"unitPrice":250000,"total":2000000}]'::jsonb, '[{"promotionId":"long-stay","name":{"vi":"Ở dài ngày","en":"Long stay"},"type":"long-stay","discount":2798858,"remainingAfter":25189722,"cappedByMax":false}]'::jsonb,
    '{"at":"2026-06-26T14:44:00.000Z","roomUnitId":"suite-02-phong-ngu-08-khach-08-09-1","idNumber":"05548103815","actualGuests":{"adults":3,"children":[11,8]},"earlyCheckIn":true,"staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    '{"at":"2026-06-30T11:30:00.000Z","lateCheckOut":true,"incidentals":[],"settled":true,"comment":"Vỡ một ly thuỷ tinh, đã tính phí.","guestRating":3,"staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    NULL,
    NULL,
    '2026-06-21T12:03:00.000Z', '2026-06-21T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    '7bee7433-ddc0-40cc-83f9-fa25183e36be'::uuid, 'ĐH-2026-0008', 'phong-03-nguoi-co-ban-cong-18', 'standard',
    '2026-08-04', '2026-08-06', 2,
    3, '{8}'::int[], '{"addon-extrabed":3}'::jsonb,
    'Hoàng Thu Minh', '0959077899', '0959077899@example.com', NULL,
    NULL, NULL,
    'b7e3006e-c6a6-4277-852f-bc14f9471785'::uuid, 'web', 'checked_out',
    1850000, 0, 1850000, 555000, 1850000,
    '[{"kind":"child","refId":"phong-03-nguoi-co-ban-cong-18","quantity":2,"unitPrice":250000,"total":500000},{"kind":"addon","refId":"addon-extrabed","quantity":3,"unitPrice":450000,"total":1350000}]'::jsonb, '[]'::jsonb,
    '{"at":"2026-08-04T14:31:00.000Z","roomUnitId":"phong-03-nguoi-co-ban-cong-18-1","idNumber":"01361876658","actualGuests":{"adults":3,"children":[8]},"earlyCheckIn":true,"staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    '{"at":"2026-08-06T11:37:00.000Z","lateCheckOut":false,"incidentals":[{"id":"inc-bk-0008","description":"Đồ uống nhà hàng","amount":350000}],"settled":true,"comment":"Có dùng minibar, đã thanh toán đủ.","guestRating":3,"staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    NULL,
    NULL,
    '2026-07-06T15:53:00.000Z', '2026-07-06T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    '7aee72a0-dec0-425f-82f9-f892193e3851'::uuid, 'ĐH-2026-0009', 'phong-tieu-chuan-giuong-doi-luc-giac-05', 'full-board',
    '2026-10-05', '2026-10-06', 1,
    3, '{}'::int[], '{"addon-ferry":3}'::jsonb,
    'David Park', '0951321540', '0951321540@example.com', NULL,
    NULL, NULL,
    '42f5b509-17bd-4ac4-87e6-a24f868156f2'::uuid, 'web', 'confirmed',
    1350000, 202500, 1147500, 573750, 573750,
    '[{"kind":"addon","refId":"addon-ferry","quantity":3,"unitPrice":450000,"total":1350000}]'::jsonb, '[{"promotionId":"early-bird-30","name":{"vi":"Đặt sớm 30 ngày","en":"Early bird 30 days"},"type":"early-bird","discount":202500,"remainingAfter":1147500,"cappedByMax":false}]'::jsonb,
    NULL,
    NULL,
    NULL,
    NULL,
    '2026-08-31T14:41:00.000Z', '2026-08-31T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    '7dec38c2-6bc3-4eed-85f7-beb496413baf'::uuid, 'ĐH-2026-0010', 'phong-03-nguoi-co-ban-cong-18', 'saver',
    '2026-08-16', '2026-08-20', 4,
    1, '{}'::int[], '{"addon-extrabed":1}'::jsonb,
    'Đặng Kim Bình', '0969913087', '0969913087@example.com', NULL,
    NULL, NULL,
    'f999c879-dfc3-4010-8902-11f3eb860932'::uuid, 'phone', 'expired',
    11106622, 1110662, 9995960, 9995960, 0,
    '[{"kind":"room","refId":"phong-03-nguoi-co-ban-cong-18","quantity":4,"unitPrice":2664156,"total":10656622},{"kind":"addon","refId":"addon-extrabed","quantity":1,"unitPrice":450000,"total":450000}]'::jsonb, '[{"promotionId":"long-stay","name":{"vi":"Ở dài ngày","en":"Long stay"},"type":"long-stay","discount":1110662,"remainingAfter":9995960,"cappedByMax":false}]'::jsonb,
    NULL,
    NULL,
    NULL,
    NULL,
    '2026-07-24T20:42:00.000Z', '2026-07-24T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    '7eec3a55-6ac3-4d5a-86f7-c04795413a1c'::uuid, 'ĐH-2026-0011', 'phong-gia-dinh-nhin-ra-bien-01', 'full-board',
    '2026-07-19', '2026-07-24', 5,
    3, '{11}'::int[], '{"addon-bbq":3}'::jsonb,
    'Lê Hoàng An', '0948494537', '0948494537@example.com', NULL,
    NULL, NULL,
    'b8a4cf36-6a1b-454f-8963-e98c65397515'::uuid, 'web', 'cancelled',
    23132345, 3469852, 19662493, 9831247, 9831247,
    '[{"kind":"room","refId":"phong-gia-dinh-nhin-ra-bien-01","quantity":5,"unitPrice":3284469,"total":16422345},{"kind":"extra-bed","refId":"phong-gia-dinh-nhin-ra-bien-01","quantity":10,"unitPrice":450000,"total":4500000},{"kind":"child","refId":"phong-gia-dinh-nhin-ra-bien-01","quantity":5,"unitPrice":250000,"total":1250000},{"kind":"addon","refId":"addon-bbq","quantity":3,"unitPrice":320000,"total":960000}]'::jsonb, '[{"promotionId":"long-stay","name":{"vi":"Ở dài ngày","en":"Long stay"},"type":"long-stay","discount":3469852,"remainingAfter":19662493,"cappedByMax":false}]'::jsonb,
    NULL,
    NULL,
    '{"at":"2026-07-14T10:00:00.000Z","by":"customer","reason":"Lý do cá nhân","refundAmount":4915624}'::jsonb,
    '2026-07-14T10:00:00.000Z',
    '2026-07-09T18:07:00.000Z', '2026-07-09T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    '7bec359c-69c3-4bc7-87f7-c1da98413ed5'::uuid, 'ĐH-2026-0012', 'rock-deluxe-room-14', 'saver',
    '2026-08-19', '2026-08-24', 5,
    1, '{5,11}'::int[], '{}'::jsonb,
    'Nguyễn Văn Dũng', '0999475386', '0999475386@example.com', NULL,
    NULL, 'Đến bằng chuyến tàu chiều, xin giữ phòng',
    'ccbbe5a9-d1ac-4120-8503-9c337678a8ba'::uuid, 'web', 'confirmed',
    1250000, 187500, 1062500, 1062500, 1062500,
    '[{"kind":"child","refId":"rock-deluxe-room-14","quantity":5,"unitPrice":250000,"total":1250000}]'::jsonb, '[{"promotionId":"long-stay","name":{"vi":"Ở dài ngày","en":"Long stay"},"type":"long-stay","discount":187500,"remainingAfter":1062500,"cappedByMax":false}]'::jsonb,
    NULL,
    NULL,
    NULL,
    NULL,
    '2026-07-19T21:40:00.000Z', '2026-07-19T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    '7cec372f-68c3-4a34-88f7-c36d97413d42'::uuid, 'ĐH-2026-0013', 'phong-giuong-doi-co-san-trong-10', 'saver',
    '2026-10-01', '2026-10-04', 3,
    1, '{}'::int[], '{}'::jsonb,
    'John Smith', '0933156923', '0933156923@example.com', NULL,
    NULL, 'Kỷ niệm ngày cưới, xin trang trí phòng',
    '96aa3e2a-ef6f-4f3b-80c1-417c69715e6d'::uuid, 'phone', 'confirmed',
    3774000, 377400, 3396600, 3396600, 3396600,
    '[{"kind":"room","refId":"phong-giuong-doi-co-san-trong-10","quantity":3,"unitPrice":1258000,"total":3774000}]'::jsonb, '[{"promotionId":"long-stay","name":{"vi":"Ở dài ngày","en":"Long stay"},"type":"long-stay","discount":377400,"remainingAfter":3396600,"cappedByMax":false}]'::jsonb,
    NULL,
    NULL,
    NULL,
    NULL,
    '2026-09-15T20:07:00.000Z', '2026-09-15T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    '79ec3276-67c3-48a1-81f7-b86892413563'::uuid, 'ĐH-2026-0014', 'phong-deluxe-06', 'full-board',
    '2026-07-02', '2026-07-04', 2,
    1, '{}'::int[], '{"addon-bbq":1}'::jsonb,
    'David Park', '0984916787', '0984916787@example.com', NULL,
    NULL, NULL,
    'bfc32598-da77-4685-88ca-df4abc209527'::uuid, 'web', 'checked_out',
    6314000, 947100, 5366900, 2683450, 5366900,
    '[{"kind":"room","refId":"phong-deluxe-06","quantity":2,"unitPrice":2997000,"total":5994000},{"kind":"addon","refId":"addon-bbq","quantity":1,"unitPrice":320000,"total":320000}]'::jsonb, '[{"promotionId":"early-bird-30","name":{"vi":"Đặt sớm 30 ngày","en":"Early bird 30 days"},"type":"early-bird","discount":947100,"remainingAfter":5366900,"cappedByMax":false}]'::jsonb,
    '{"at":"2026-07-02T14:43:00.000Z","roomUnitId":"phong-deluxe-06-1","idNumber":"01057389394","actualGuests":{"adults":1,"children":[]},"earlyCheckIn":false,"vehiclePlate":"65A-67650","staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    '{"at":"2026-07-04T11:26:00.000Z","lateCheckOut":false,"incidentals":[{"id":"inc-bk-0014","description":"Giặt ủi","amount":250000}],"settled":true,"comment":"Khách lịch sự, phòng sạch sẽ khi trả.","guestRating":3,"staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    NULL,
    NULL,
    '2026-05-25T10:16:00.000Z', '2026-05-25T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    '7aec3409-66c3-470e-82f7-b9fb914133d0'::uuid, 'ĐH-2026-0015', 'phong-gia-dinh-view-bien-09-09', 'standard',
    '2026-08-01', '2026-08-05', 4,
    2, '{}'::int[], '{"addon-bike":2}'::jsonb,
    'Hoàng Thu Minh', '0981539252', '0981539252@example.com', NULL,
    NULL, NULL,
    '7e90f98f-d9fb-4512-87b2-45491377d93c'::uuid, 'phone', 'cancelled',
    16975200, 1697520, 15277680, 4583304, 4583304,
    '[{"kind":"room","refId":"phong-gia-dinh-view-bien-09-09","quantity":4,"unitPrice":4168800,"total":16675200},{"kind":"addon","refId":"addon-bike","quantity":2,"unitPrice":150000,"total":300000}]'::jsonb, '[{"promotionId":"long-stay","name":{"vi":"Ở dài ngày","en":"Long stay"},"type":"long-stay","discount":1697520,"remainingAfter":15277680,"cappedByMax":false}]'::jsonb,
    NULL,
    NULL,
    '{"at":"2026-07-24T10:00:00.000Z","by":"customer","reason":"Thời tiết xấu","refundAmount":4583304}'::jsonb,
    '2026-07-24T10:00:00.000Z',
    '2026-07-29T22:00:00.000Z', '2026-07-29T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    '77ec2f50-65c3-457b-83f7-bb8e94413889'::uuid, 'ĐH-2026-0016', 'phong-03-nguoi-co-ban-cong-18', 'saver',
    '2026-08-22', '2026-08-24', 2,
    2, '{12}'::int[], '{}'::jsonb,
    'Sarah Johnson', '0919594984', '0919594984@example.com', NULL,
    NULL, NULL,
    '192545c7-dc9e-4b12-81c7-9c0dcfdc7ad8'::uuid, 'web', 'confirmed',
    5943116, 800000, 5143116, 5143116, 5143116,
    '[{"kind":"room","refId":"phong-03-nguoi-co-ban-cong-18","quantity":2,"unitPrice":2971558,"total":5943116}]'::jsonb, '[{"promotionId":"last-minute","name":{"vi":"Đặt sát ngày","en":"Last minute"},"type":"last-minute","discount":800000,"remainingAfter":5143116,"cappedByMax":true}]'::jsonb,
    NULL,
    NULL,
    NULL,
    NULL,
    '2026-08-20T10:53:00.000Z', '2026-08-20T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    '78ec30e3-64c3-43e8-84f7-bd21934136f6'::uuid, 'ĐH-2026-0017', 'suite-02-phong-ngu-08-khach-08-09', 'saver',
    '2026-09-17', '2026-09-20', 3,
    3, '{}'::int[], '{}'::jsonb,
    'Đặng Kim An', '0973185851', '0973185851@example.com', NULL,
    '16:00', NULL,
    'a1c379cc-287d-4669-8b1e-e492d848a94f'::uuid, 'web', 'confirmed',
    12031750, 1923175, 10108575, 10108575, 10108575,
    '[{"kind":"room","refId":"suite-02-phong-ngu-08-khach-08-09","quantity":3,"unitPrice":4010583,"total":12031750}]'::jsonb, '[{"promotionId":"last-minute","name":{"vi":"Đặt sát ngày","en":"Last minute"},"type":"last-minute","discount":800000,"remainingAfter":11231750,"cappedByMax":true},{"promotionId":"long-stay","name":{"vi":"Ở dài ngày","en":"Long stay"},"type":"long-stay","discount":1123175,"remainingAfter":10108575,"cappedByMax":false}]'::jsonb,
    NULL,
    NULL,
    NULL,
    NULL,
    '2026-09-16T08:56:00.000Z', '2026-09-16T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    '85ec455a-63c3-4255-8df7-b21c9e414847'::uuid, 'ĐH-2026-0018', 'suite-02-phong-ngu-08-khach-08-09', 'standard',
    '2026-07-27', '2026-07-29', 2,
    1, '{}'::int[], '{}'::jsonb,
    'Michael Chen', '0914506369', '0914506369@example.com', NULL,
    NULL, 'Xin phòng tầng cao, yên tĩnh',
    '569d8e96-7136-48f3-86a0-32c88093d44d'::uuid, 'phone', 'checked_out',
    14155000, 0, 14155000, 4246500, 14155000,
    '[{"kind":"room","refId":"suite-02-phong-ngu-08-khach-08-09","quantity":2,"unitPrice":7077500,"total":14155000}]'::jsonb, '[]'::jsonb,
    '{"at":"2026-07-27T14:28:00.000Z","roomUnitId":"suite-02-phong-ngu-08-khach-08-09-1","idNumber":"04347830563","actualGuests":{"adults":1,"children":[]},"earlyCheckIn":false,"staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    '{"at":"2026-07-29T11:55:00.000Z","lateCheckOut":false,"incidentals":[],"settled":true,"comment":"Khách hài lòng, hẹn quay lại mùa sau.","guestRating":5,"staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    NULL,
    NULL,
    '2026-07-21T15:51:00.000Z', '2026-07-21T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    '86ec46ed-62c3-40c2-8ef7-b3af9d4146b4'::uuid, 'ĐH-2026-0019', 'suite-02-phong-ngu-08-khach-08-09', 'standard',
    '2026-08-28', '2026-09-01', 4,
    1, '{}'::int[], '{}'::jsonb,
    'Phạm Minh Quân', '0932909666', '0932909666@example.com', NULL,
    NULL, 'Kỷ niệm ngày cưới, xin trang trí phòng',
    'e8c0be73-73af-42e6-8843-604502e389a8'::uuid, 'web', 'confirmed',
    33122700, 7783835, 25338865, 7601660, 7601660,
    '[{"kind":"room","refId":"suite-02-phong-ngu-08-khach-08-09","quantity":4,"unitPrice":8280675,"total":33122700}]'::jsonb, '[{"promotionId":"early-bird-30","name":{"vi":"Đặt sớm 30 ngày","en":"Early bird 30 days"},"type":"early-bird","discount":4968405,"remainingAfter":28154295,"cappedByMax":false},{"promotionId":"long-stay","name":{"vi":"Ở dài ngày","en":"Long stay"},"type":"long-stay","discount":2815430,"remainingAfter":25338865,"cappedByMax":false}]'::jsonb,
    NULL,
    NULL,
    NULL,
    NULL,
    '2026-07-19T09:17:00.000Z', '2026-07-19T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    'f7e92739-51c5-4496-87ff-2def2439cc74'::uuid, 'ĐH-2026-0020', 'phong-gia-dinh-nhin-ra-bien-01', 'full-board',
    '2026-07-29', '2026-08-02', 4,
    1, '{}'::int[], '{"addon-tour":1}'::jsonb,
    'Đỗ Quang Ngọc', '0997020380', '0997020380@example.com', NULL,
    NULL, NULL,
    '7a7eb493-475f-4dae-84d5-39d5e7687608'::uuid, 'web', 'checked_out',
    13639720, 1363972, 12275748, 6137874, 12275748,
    '[{"kind":"room","refId":"phong-gia-dinh-nhin-ra-bien-01","quantity":4,"unitPrice":3309930,"total":13239720},{"kind":"addon","refId":"addon-tour","quantity":1,"unitPrice":400000,"total":400000}]'::jsonb, '[{"promotionId":"long-stay","name":{"vi":"Ở dài ngày","en":"Long stay"},"type":"long-stay","discount":1363972,"remainingAfter":12275748,"cappedByMax":false}]'::jsonb,
    '{"at":"2026-07-29T14:22:00.000Z","roomUnitId":"phong-gia-dinh-nhin-ra-bien-01-1","idNumber":"06174386649","actualGuests":{"adults":1,"children":[]},"earlyCheckIn":false,"staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    '{"at":"2026-08-02T11:39:00.000Z","lateCheckOut":false,"incidentals":[],"settled":true,"comment":"Khách hài lòng, hẹn quay lại mùa sau.","guestRating":5,"staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    NULL,
    NULL,
    '2026-07-14T17:05:00.000Z', '2026-07-14T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    'f6e925a6-52c5-4629-86ff-2c5c2539ce07'::uuid, 'ĐH-2026-0021', 'phong-giuong-doi-15', 'full-board',
    '2026-08-11', '2026-08-12', 1,
    3, '{}'::int[], '{"addon-bike":3}'::jsonb,
    'Trần Thị Phương', '0950046573', '0950046573@example.com', NULL,
    '16:00', NULL,
    '3df6f316-b1d4-4fb3-8b0d-e840d3818fdd'::uuid, 'phone', 'confirmed',
    450000, 67500, 382500, 191250, 191250,
    '[{"kind":"addon","refId":"addon-bike","quantity":3,"unitPrice":150000,"total":450000}]'::jsonb, '[{"promotionId":"early-bird-30","name":{"vi":"Đặt sớm 30 ngày","en":"Early bird 30 days"},"type":"early-bird","discount":67500,"remainingAfter":382500,"cappedByMax":false}]'::jsonb,
    NULL,
    NULL,
    NULL,
    NULL,
    '2026-07-02T20:39:00.000Z', '2026-07-02T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    'f5e92413-4fc5-4170-89ff-31152639cf9a'::uuid, 'ĐH-2026-0022', 'phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04', 'saver',
    '2026-07-24', '2026-07-27', 3,
    2, '{11,10}'::int[], '{"addon-extrabed":2}'::jsonb,
    'Nguyễn Văn Khánh', '0996594794', '0996594794@example.com', NULL,
    '19:00', 'Xin phòng tầng cao, yên tĩnh',
    'ff85f815-532e-4324-8184-9a23f4665d22'::uuid, 'web', 'checked_out',
    2400000, 240000, 2160000, 2160000, 2160000,
    '[{"kind":"child","refId":"phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04","quantity":6,"unitPrice":250000,"total":1500000},{"kind":"addon","refId":"addon-extrabed","quantity":2,"unitPrice":450000,"total":900000}]'::jsonb, '[{"promotionId":"long-stay","name":{"vi":"Ở dài ngày","en":"Long stay"},"type":"long-stay","discount":240000,"remainingAfter":2160000,"cappedByMax":false}]'::jsonb,
    '{"at":"2026-07-24T14:18:00.000Z","roomUnitId":"phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04-1","idNumber":"01243041356","actualGuests":{"adults":2,"children":[11,10]},"earlyCheckIn":false,"vehiclePlate":"65A-24476","staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    '{"at":"2026-07-27T11:04:00.000Z","lateCheckOut":false,"incidentals":[],"settled":true,"comment":"Khách lịch sự, phòng sạch sẽ khi trả.","guestRating":5,"staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    NULL,
    NULL,
    '2026-06-27T16:16:00.000Z', '2026-06-27T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    'f4e92280-50c5-4303-88ff-2f822739d12d'::uuid, 'ĐH-2026-0023', 'suite-02-phong-ngu-06-khach-10-11', 'standard',
    '2026-08-16', '2026-08-17', 1,
    1, '{5,10}'::int[], '{}'::jsonb,
    'Đỗ Quang Phương', '0964569566', '0964569566@example.com', NULL,
    '16:00', NULL,
    '90a1ca43-ea15-4496-8b2d-5ce9af516004'::uuid, 'web', 'confirmed',
    6466150, 0, 6466150, 1939845, 1939845,
    '[{"kind":"room","refId":"suite-02-phong-ngu-06-khach-10-11","quantity":1,"unitPrice":6216150,"total":6216150},{"kind":"child","refId":"suite-02-phong-ngu-06-khach-10-11","quantity":1,"unitPrice":250000,"total":250000}]'::jsonb, '[]'::jsonb,
    NULL,
    NULL,
    NULL,
    NULL,
    '2026-07-19T19:27:00.000Z', '2026-07-19T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    'fbe92d85-55c5-4ae2-83ff-27a32039c628'::uuid, 'ĐH-2026-0024', 'phong-gia-dinh-view-bien-09-09', 'standard',
    '2026-09-06', '2026-09-07', 1,
    2, '{}'::int[], '{}'::jsonb,
    'Vũ Đức Minh', '0967196256', '0967196256@example.com', NULL,
    '16:00', NULL,
    '7c7f6106-4f99-4c53-8919-d9989b1c9aa5'::uuid, 'web', 'confirmed',
    2779200, 0, 2779200, 833760, 833760,
    '[{"kind":"room","refId":"phong-gia-dinh-view-bien-09-09","quantity":1,"unitPrice":2779200,"total":2779200}]'::jsonb, '[]'::jsonb,
    NULL,
    NULL,
    NULL,
    NULL,
    '2026-08-19T08:58:00.000Z', '2026-08-19T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    'fae92bf2-56c5-4c75-82ff-26102139c7bb'::uuid, 'ĐH-2026-0025', 'phong-superior-co-giuong-co-king-07', 'saver',
    '2026-09-10', '2026-09-15', 5,
    2, '{}'::int[], '{"addon-extrabed":2}'::jsonb,
    'Ngô Bảo An', '0996787606', '0996787606@example.com', NULL,
    '12:00', NULL,
    '820f2a6b-9d81-4986-8e38-7e5d065d8b80'::uuid, 'web', 'confirmed',
    11506470, 2020280, 9486190, 9486190, 9486190,
    '[{"kind":"room","refId":"phong-superior-co-giuong-co-king-07","quantity":5,"unitPrice":2121294,"total":10606470},{"kind":"addon","refId":"addon-extrabed","quantity":2,"unitPrice":450000,"total":900000}]'::jsonb, '[{"promotionId":"fourth-night-free","name":{"vi":"Đêm thứ 4 miễn phí","en":"4th night free"},"type":"nth-night-free","discount":2020280,"remainingAfter":9486190,"cappedByMax":false}]'::jsonb,
    NULL,
    NULL,
    NULL,
    NULL,
    '2026-09-05T16:39:00.000Z', '2026-09-05T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    'f9e92a5f-53c5-47bc-85ff-2ac92239c94e'::uuid, 'ĐH-2026-0026', 'suite-02-phong-ngu-06-khach-15-16', 'full-board',
    '2026-07-13', '2026-07-14', 1,
    3, '{}'::int[], '{"addon-bike":3}'::jsonb,
    'Đặng Kim Linh', '0941028427', '0941028427@example.com', NULL,
    NULL, NULL,
    'a71bacee-739c-4d4f-8084-5d08d84a8b21'::uuid, 'web', 'checked_out',
    7684313, 0, 7684313, 3842157, 7684313,
    '[{"kind":"room","refId":"suite-02-phong-ngu-06-khach-15-16","quantity":1,"unitPrice":7234313,"total":7234313},{"kind":"addon","refId":"addon-bike","quantity":3,"unitPrice":150000,"total":450000}]'::jsonb, '[]'::jsonb,
    '{"at":"2026-07-13T14:50:00.000Z","roomUnitId":"suite-02-phong-ngu-06-khach-15-16-1","idNumber":"08200414869","actualGuests":{"adults":3,"children":[]},"earlyCheckIn":false,"staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    '{"at":"2026-07-14T11:35:00.000Z","lateCheckOut":false,"incidentals":[],"settled":true,"comment":"Khách lịch sự, phòng sạch sẽ khi trả.","guestRating":5,"staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    NULL,
    NULL,
    '2026-07-03T11:23:00.000Z', '2026-07-03T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    'f8e928cc-54c5-494f-84ff-29362339cae1'::uuid, 'ĐH-2026-0027', 'phong-superior-co-giuong-co-king-07', 'full-board',
    '2026-07-09', '2026-07-12', 3,
    3, '{}'::int[], '{"addon-tour":3}'::jsonb,
    'Đặng Kim Ngọc', '0971160877', '0971160877@example.com', NULL,
    '14:00', NULL,
    'c65351e5-d1f9-44bc-8241-26c369277e72'::uuid, 'web', 'checked_out',
    18272859, 4294122, 13978737, 6989369, 13978737,
    '[{"kind":"room","refId":"phong-superior-co-giuong-co-king-07","quantity":3,"unitPrice":5280953,"total":15842859},{"kind":"extra-bed","refId":"phong-superior-co-giuong-co-king-07","quantity":3,"unitPrice":410000,"total":1230000},{"kind":"addon","refId":"addon-tour","quantity":3,"unitPrice":400000,"total":1200000}]'::jsonb, '[{"promotionId":"early-bird-30","name":{"vi":"Đặt sớm 30 ngày","en":"Early bird 30 days"},"type":"early-bird","discount":2740929,"remainingAfter":15531930,"cappedByMax":false},{"promotionId":"long-stay","name":{"vi":"Ở dài ngày","en":"Long stay"},"type":"long-stay","discount":1553193,"remainingAfter":13978737,"cappedByMax":false}]'::jsonb,
    '{"at":"2026-07-09T14:50:00.000Z","roomUnitId":"phong-superior-co-giuong-co-king-07-1","idNumber":"04180464897","actualGuests":{"adults":3,"children":[]},"earlyCheckIn":true,"vehiclePlate":"65A-10719","staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    '{"at":"2026-07-12T11:18:00.000Z","lateCheckOut":false,"incidentals":[],"settled":true,"comment":"Vỡ một ly thuỷ tinh, đã tính phí.","guestRating":5,"staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    NULL,
    NULL,
    '2026-06-04T15:36:00.000Z', '2026-06-04T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    'ffe933d1-59c5-412e-8fff-3a871c39bfdc'::uuid, 'ĐH-2026-0028', 'phong-gia-dinh-view-bien-09-09', 'full-board',
    '2026-10-04', '2026-10-07', 3,
    3, '{}'::int[], '{}'::jsonb,
    'Hoàng Thu Ngọc', '0950262288', '0950262288@example.com', NULL,
    NULL, 'Ăn chay, báo trước nhà bếp',
    'e2df69bd-9dd3-4dfc-8ab9-118bd7d6517a'::uuid, 'web', 'confirmed',
    10422000, 1042200, 9379800, 4689900, 4689900,
    '[{"kind":"room","refId":"phong-gia-dinh-view-bien-09-09","quantity":3,"unitPrice":3474000,"total":10422000}]'::jsonb, '[{"promotionId":"long-stay","name":{"vi":"Ở dài ngày","en":"Long stay"},"type":"long-stay","discount":1042200,"remainingAfter":9379800,"cappedByMax":false}]'::jsonb,
    NULL,
    NULL,
    NULL,
    NULL,
    '2026-09-19T18:35:00.000Z', '2026-09-19T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    'fee9323e-5ac5-42c1-8eff-38f41d39c16f'::uuid, 'ĐH-2026-0029', 'phong-tieu-chuan-giuong-doi-luc-giac-05', 'full-board',
    '2026-08-03', '2026-08-04', 1,
    1, '{10}'::int[], '{"addon-extrabed":1}'::jsonb,
    'Emma Wilson', '0937000424', '0937000424@example.com', NULL,
    '20:00', 'Ăn chay, báo trước nhà bếp',
    '8ba4553c-4228-4715-8f4a-c936176f7d37'::uuid, 'web', 'checked_out',
    3308875, 0, 3308875, 1654438, 3308875,
    '[{"kind":"room","refId":"phong-tieu-chuan-giuong-doi-luc-giac-05","quantity":1,"unitPrice":2608875,"total":2608875},{"kind":"child","refId":"phong-tieu-chuan-giuong-doi-luc-giac-05","quantity":1,"unitPrice":250000,"total":250000},{"kind":"addon","refId":"addon-extrabed","quantity":1,"unitPrice":450000,"total":450000}]'::jsonb, '[]'::jsonb,
    '{"at":"2026-08-03T14:50:00.000Z","roomUnitId":"phong-tieu-chuan-giuong-doi-luc-giac-05-1","idNumber":"02528015261","actualGuests":{"adults":1,"children":[10]},"earlyCheckIn":false,"vehiclePlate":"65A-45613","staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    '{"at":"2026-08-04T11:44:00.000Z","lateCheckOut":false,"incidentals":[{"id":"inc-bk-0029","description":"Giặt ủi","amount":50000}],"settled":true,"comment":"Khách trả phòng muộn 1 tiếng, đã thu phụ phí.","guestRating":5,"staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    NULL,
    NULL,
    '2026-07-26T08:07:00.000Z', '2026-07-26T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    'f1e6df30-57c7-4c9f-81fc-1c662a3c147d'::uuid, 'ĐH-2026-0030', 'first-floor-family-with-sea-view-16', 'standard',
    '2026-07-23', '2026-07-24', 1,
    2, '{}'::int[], '{"addon-bike":2}'::jsonb,
    'Phạm Minh Phương', '0975652408', '0975652408@example.com', NULL,
    NULL, NULL,
    '0c17f48f-6641-4766-8cc9-2de178acc888'::uuid, 'phone', 'checked_out',
    4033750, 0, 4033750, 1210125, 4033750,
    '[{"kind":"room","refId":"first-floor-family-with-sea-view-16","quantity":1,"unitPrice":3733750,"total":3733750},{"kind":"addon","refId":"addon-bike","quantity":2,"unitPrice":150000,"total":300000}]'::jsonb, '[]'::jsonb,
    '{"at":"2026-07-23T14:50:00.000Z","roomUnitId":"first-floor-family-with-sea-view-16-1","idNumber":"04146927821","actualGuests":{"adults":2,"children":[]},"earlyCheckIn":false,"vehiclePlate":"65A-30405","staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    '{"at":"2026-07-24T11:29:00.000Z","lateCheckOut":false,"incidentals":[],"settled":true,"comment":"Khách lịch sự, phòng sạch sẽ khi trả.","guestRating":4,"staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    NULL,
    NULL,
    '2026-07-05T14:02:00.000Z', '2026-07-05T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    'f2e6e0c3-56c7-4b0c-82fc-1df9293c12ea'::uuid, 'ĐH-2026-0031', 'phong-03-nguoi-co-ban-cong-18', 'standard',
    '2026-07-01', '2026-07-04', 3,
    3, '{12,8}'::int[], '{"addon-tour":3}'::jsonb,
    'Vũ Đức Quân', '0931273318', '0931273318@example.com', NULL,
    '17:00', 'Kỷ niệm ngày cưới, xin trang trí phòng',
    '69678ea4-e1ae-4dc1-85aa-d6f6a83832c3'::uuid, 'web', 'checked_out',
    1950000, 195000, 1755000, 526500, 1755000,
    '[{"kind":"child","refId":"phong-03-nguoi-co-ban-cong-18","quantity":3,"unitPrice":250000,"total":750000},{"kind":"addon","refId":"addon-tour","quantity":3,"unitPrice":400000,"total":1200000}]'::jsonb, '[{"promotionId":"long-stay","name":{"vi":"Ở dài ngày","en":"Long stay"},"type":"long-stay","discount":195000,"remainingAfter":1755000,"cappedByMax":false}]'::jsonb,
    '{"at":"2026-07-01T14:43:00.000Z","roomUnitId":"phong-03-nguoi-co-ban-cong-18-1","idNumber":"05318923048","actualGuests":{"adults":3,"children":[12,8]},"earlyCheckIn":false,"staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    '{"at":"2026-07-04T11:59:00.000Z","lateCheckOut":false,"incidentals":[],"settled":true,"comment":"Khách trả phòng muộn 1 tiếng, đã thu phụ phí.","guestRating":3,"staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    NULL,
    NULL,
    '2026-06-04T16:21:00.000Z', '2026-06-04T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    'f3e6e256-59c7-4fc5-8ffc-1940283c1157'::uuid, 'ĐH-2026-0032', 'phong-deluxe-06', 'saver',
    '2026-08-19', '2026-08-20', 1,
    1, '{}'::int[], '{}'::jsonb,
    'Bùi Thanh Quân', '0929600831', '0929600831@example.com', NULL,
    '14:00', NULL,
    '59d8728f-f425-42de-83d9-54a9857f17c0'::uuid, 'web', 'confirmed',
    1887000, 0, 1887000, 1887000, 1887000,
    '[{"kind":"room","refId":"phong-deluxe-06","quantity":1,"unitPrice":1887000,"total":1887000}]'::jsonb, '[]'::jsonb,
    NULL,
    NULL,
    NULL,
    NULL,
    '2026-08-11T11:19:00.000Z', '2026-08-11T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    'f4e6e3e9-58c7-4e32-80fc-1ad3273c0fc4'::uuid, 'ĐH-2026-0033', 'phong-gia-dinh-view-bien-08-08', 'standard',
    '2026-07-25', '2026-07-28', 3,
    3, '{}'::int[], '{"addon-extrabed":3}'::jsonb,
    'Sarah Johnson', '0910702109', '0910702109@example.com', NULL,
    '19:00', NULL,
    'c01a8e88-7ef5-4a29-8d2e-146e0ace6597'::uuid, 'phone', 'checked_out',
    14165200, 1416520, 12748680, 3824604, 12748680,
    '[{"kind":"room","refId":"phong-gia-dinh-view-bien-08-08","quantity":3,"unitPrice":4271733,"total":12815200},{"kind":"addon","refId":"addon-extrabed","quantity":3,"unitPrice":450000,"total":1350000}]'::jsonb, '[{"promotionId":"long-stay","name":{"vi":"Ở dài ngày","en":"Long stay"},"type":"long-stay","discount":1416520,"remainingAfter":12748680,"cappedByMax":false}]'::jsonb,
    '{"at":"2026-07-25T14:46:00.000Z","roomUnitId":"phong-gia-dinh-view-bien-08-08-1","idNumber":"05709323034","actualGuests":{"adults":3,"children":[]},"earlyCheckIn":false,"staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    '{"at":"2026-07-28T11:45:00.000Z","lateCheckOut":false,"incidentals":[{"id":"inc-bk-0033","description":"Đồ uống nhà hàng","amount":350000}],"settled":true,"comment":"Khách lịch sự, phòng sạch sẽ khi trả.","guestRating":5,"staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    NULL,
    NULL,
    '2026-06-28T14:28:00.000Z', '2026-06-28T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    'f5e6e57c-53c7-4653-85fc-22b2263c0e31'::uuid, 'ĐH-2026-0034', 'phong-gia-dinh-view-bien-08-08', 'saver',
    '2026-09-04', '2026-09-07', 3,
    2, '{8}'::int[], '{}'::jsonb,
    'Phạm Minh Minh', '0918930341', '0918930341@example.com', NULL,
    NULL, 'Đến bằng chuyến tàu chiều, xin giữ phòng',
    'b8ca0053-c40b-468e-8c5f-469966047afc'::uuid, 'web', 'confirmed',
    7574480, 757448, 6817032, 6817032, 6817032,
    '[{"kind":"room","refId":"phong-gia-dinh-view-bien-08-08","quantity":3,"unitPrice":2274827,"total":6824480},{"kind":"child","refId":"phong-gia-dinh-view-bien-08-08","quantity":3,"unitPrice":250000,"total":750000}]'::jsonb, '[{"promotionId":"long-stay","name":{"vi":"Ở dài ngày","en":"Long stay"},"type":"long-stay","discount":757448,"remainingAfter":6817032,"cappedByMax":false}]'::jsonb,
    NULL,
    NULL,
    NULL,
    NULL,
    '2026-07-31T10:13:00.000Z', '2026-07-31T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    'f6e6e70f-52c7-44c0-86fc-2445253c0c9e'::uuid, 'ĐH-2026-0035', 'phong-gia-dinh-view-bien-11', 'full-board',
    '2026-07-12', '2026-07-16', 4,
    2, '{10,3}'::int[], '{}'::jsonb,
    'Sarah Johnson', '0984303130', '0984303130@example.com', NULL,
    '14:00', 'Xin phòng tầng cao, yên tĩnh',
    '2357e7a8-30a3-44c5-8247-438a444adfe7'::uuid, 'phone', 'checked_out',
    22677760, 5329274, 17348486, 8674243, 17348486,
    '[{"kind":"room","refId":"phong-gia-dinh-view-bien-11","quantity":4,"unitPrice":5419440,"total":21677760},{"kind":"child","refId":"phong-gia-dinh-view-bien-11","quantity":4,"unitPrice":250000,"total":1000000}]'::jsonb, '[{"promotionId":"early-bird-30","name":{"vi":"Đặt sớm 30 ngày","en":"Early bird 30 days"},"type":"early-bird","discount":3401664,"remainingAfter":19276096,"cappedByMax":false},{"promotionId":"long-stay","name":{"vi":"Ở dài ngày","en":"Long stay"},"type":"long-stay","discount":1927610,"remainingAfter":17348486,"cappedByMax":false}]'::jsonb,
    '{"at":"2026-07-12T14:16:00.000Z","roomUnitId":"phong-gia-dinh-view-bien-11-1","idNumber":"07806059823","actualGuests":{"adults":2,"children":[10,3]},"earlyCheckIn":false,"staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    '{"at":"2026-07-16T11:14:00.000Z","lateCheckOut":false,"incidentals":[{"id":"inc-bk-0035","description":"Đồ uống nhà hàng","amount":400000}],"settled":true,"comment":"Có dùng minibar, đã thanh toán đủ.","guestRating":3,"staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    NULL,
    NULL,
    '2026-06-07T12:21:00.000Z', '2026-06-07T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    'f7e6e8a2-55c7-4979-83fc-1f8c243c0b0b'::uuid, 'ĐH-2026-0036', 'phong-giuong-doi-15', 'full-board',
    '2026-08-20', '2026-08-24', 4,
    1, '{}'::int[], '{"addon-extrabed":1}'::jsonb,
    'Emma Wilson', '0912478470', '0912478470@example.com', NULL,
    NULL, 'Có trẻ nhỏ, xin thêm cũi',
    '620f4119-81eb-4b3c-8cec-02230391f34e'::uuid, 'web', 'confirmed',
    12019232, 1201923, 10817309, 5408655, 5408655,
    '[{"kind":"room","refId":"phong-giuong-doi-15","quantity":4,"unitPrice":2892308,"total":11569232},{"kind":"addon","refId":"addon-extrabed","quantity":1,"unitPrice":450000,"total":450000}]'::jsonb, '[{"promotionId":"long-stay","name":{"vi":"Ở dài ngày","en":"Long stay"},"type":"long-stay","discount":1201923,"remainingAfter":10817309,"cappedByMax":false}]'::jsonb,
    NULL,
    NULL,
    NULL,
    NULL,
    '2026-07-14T14:17:00.000Z', '2026-07-14T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    'f8e6ea35-54c7-47e6-84fc-211f233c0978'::uuid, 'ĐH-2026-0037', 'phong-tieu-chuan-giuong-doi-luc-giac-05', 'standard',
    '2026-09-06', '2026-09-10', 4,
    1, '{}'::int[], '{}'::jsonb,
    'Bùi Thanh Khánh', '0999112107', '0999112107@example.com', NULL,
    NULL, 'Kỷ niệm ngày cưới, xin trang trí phòng',
    'f098f7e8-fd7f-4435-83f4-290e7a6b3d93'::uuid, 'web', 'pending_payment',
    5101800, 1236800, 3865000, 1159500, 0,
    '[{"kind":"room","refId":"phong-tieu-chuan-giuong-doi-luc-giac-05","quantity":4,"unitPrice":1275450,"total":5101800}]'::jsonb, '[{"promotionId":"fourth-night-free","name":{"vi":"Đêm thứ 4 miễn phí","en":"4th night free"},"type":"nth-night-free","discount":1236800,"remainingAfter":3865000,"cappedByMax":false}]'::jsonb,
    NULL,
    NULL,
    NULL,
    NULL,
    '2026-08-02T22:02:00.000Z', '2026-08-02T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    'f9e6ebc8-5fc8-4937-89fc-28fe223c07e5'::uuid, 'ĐH-2026-0038', 'phong-tieu-chuan-giuong-doi-luc-giac-05', 'standard',
    '2026-06-30', '2026-07-05', 5,
    3, '{5}'::int[], '{"addon-tour":3}'::jsonb,
    'Lê Hoàng Quân', '0911574897', '0911574897@example.com', NULL,
    '16:00', NULL,
    'f35c17d2-7484-47b7-8799-acb874c24f15'::uuid, 'web', 'checked_out',
    1200000, 180000, 1020000, 306000, 1020000,
    '[{"kind":"addon","refId":"addon-tour","quantity":3,"unitPrice":400000,"total":1200000}]'::jsonb, '[{"promotionId":"long-stay","name":{"vi":"Ở dài ngày","en":"Long stay"},"type":"long-stay","discount":180000,"remainingAfter":1020000,"cappedByMax":false}]'::jsonb,
    '{"at":"2026-06-30T14:49:00.000Z","roomUnitId":"phong-tieu-chuan-giuong-doi-luc-giac-05-1","idNumber":"07539655601","actualGuests":{"adults":3,"children":[5]},"earlyCheckIn":true,"staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    '{"at":"2026-07-05T11:20:00.000Z","lateCheckOut":false,"incidentals":[],"settled":true,"comment":"Khách trả phòng muộn 1 tiếng, đã thu phụ phí.","guestRating":3,"staffId":"staff-01","staffName":"Lê Thị Ngọc"}'::jsonb,
    NULL,
    NULL,
    '2026-06-16T13:21:00.000Z', '2026-06-16T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    'fae6ed5b-5ec8-47a4-8afc-2a91213c0652'::uuid, 'ĐH-2026-0039', 'rock-deluxe-room-14', 'full-board',
    '2026-07-31', '2026-08-03', 3,
    1, '{}'::int[], '{}'::jsonb,
    'Bùi Thanh Minh', '0931090112', '0931090112@example.com', NULL,
    NULL, 'Có trẻ nhỏ, xin thêm cũi',
    'd41257bf-0a13-49fe-8427-36457994c534'::uuid, 'web', 'cancelled',
    9950040, 995004, 8955036, 4477518, 4477518,
    '[{"kind":"room","refId":"rock-deluxe-room-14","quantity":3,"unitPrice":3316680,"total":9950040}]'::jsonb, '[{"promotionId":"long-stay","name":{"vi":"Ở dài ngày","en":"Long stay"},"type":"long-stay","discount":995004,"remainingAfter":8955036,"cappedByMax":false}]'::jsonb,
    NULL,
    NULL,
    '{"at":"2026-07-22T10:00:00.000Z","by":"admin","reason":"Đổi lịch công tác","refundAmount":2238759}'::jsonb,
    '2026-07-22T10:00:00.000Z',
    '2026-07-17T19:04:00.000Z', '2026-07-17T12:00:00.000Z'
);
INSERT INTO public.bookings (
    id, code, room_type_id, rate_plan_id, check_in, check_out, nights,
    num_adults, child_ages, addons,
    guest_full_name, guest_phone, guest_email, guest_id_number,
    guest_estimated_arrival_time, guest_special_requests,
    customer_id, channel, status,
    subtotal, discount_total, total_amount, deposit_amount, paid_amount,
    price_lines, applied_promotions,
    check_in_record, check_out_record, cancellation, cancelled_at,
    created_at, updated_at
) VALUES (
    'fbf8380f-4db6-43c0-83f0-1d19983472e2'::uuid, 'ĐH-2026-0040', 'phong-superior-co-giuong-co-king-07', 'saver',
    '2026-08-14', '2026-08-17', 3,
    2, '{7}'::int[], '{"addon-ferry":2}'::jsonb,
    'Sarah Johnson', '0973465692', '0973465692@example.com', NULL,
    NULL, NULL,
    '66dbda94-6113-46a9-8fd1-1f16959b2043'::uuid, 'web', 'cancelled',
    13360204, 1336020, 12024184, 12024184, 12024184,
    '[{"kind":"room","refId":"phong-superior-co-giuong-co-king-07","quantity":3,"unitPrice":3493401,"total":10480204},{"kind":"extra-bed","refId":"phong-superior-co-giuong-co-king-07","quantity":3,"unitPrice":410000,"total":1230000},{"kind":"child","refId":"phong-superior-co-giuong-co-king-07","quantity":3,"unitPrice":250000,"total":750000},{"kind":"addon","refId":"addon-ferry","quantity":2,"unitPrice":450000,"total":900000}]'::jsonb, '[{"promotionId":"long-stay","name":{"vi":"Ở dài ngày","en":"Long stay"},"type":"long-stay","discount":1336020,"remainingAfter":12024184,"cappedByMax":false}]'::jsonb,
    NULL,
    NULL,
    '{"at":"2026-08-10T10:00:00.000Z","by":"customer","reason":"Đổi lịch công tác","refundAmount":12024184}'::jsonb,
    '2026-08-10T10:00:00.000Z',
    '2026-07-31T08:26:00.000Z', '2026-07-31T12:00:00.000Z'
);

-- ---------------------------------------------------------------------------
-- 4. payments — 51 lần thu, tổng khớp bookings.paid_amount từng đơn
-- ---------------------------------------------------------------------------

INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('82ee7f38-e6c0-4ef7-8afa-052a113e2bb9'::uuid, '2026-06-21T15:34:00.000Z', 3393495, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('85ee83f1-e7c0-408a-89fa-03970e3e2700'::uuid, '2026-07-07T19:05:00.000Z', 1343280, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('85ee83f1-e7c0-408a-89fa-03970e3e2700'::uuid, '2026-07-27T11:49:00.000Z', 3134320, 'at-property', 'balance', 'Thu phần còn lại tại quầy');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('84ee825e-e8c0-421d-88fa-02040f3e2893'::uuid, '2026-07-13T10:40:00.000Z', 1237125, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('84ee825e-e8c0-421d-88fa-02040f3e2893'::uuid, '2026-07-24T11:39:00.000Z', 2886625, 'at-property', 'balance', 'Thu phần còn lại tại quầy');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('87ee8717-e1c0-4718-87fa-0071143e3072'::uuid, '2026-09-09T22:49:00.000Z', 3751920, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('89ee8a3d-e3c0-4a3e-85f9-fd4b123e2d4c'::uuid, '2026-06-13T11:06:00.000Z', 12284064, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('88ee88aa-e4c0-4bd1-84f9-fbb8133e2edf'::uuid, '2026-06-21T12:03:00.000Z', 25189722, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('7bee7433-ddc0-40cc-83f9-fa25183e36be'::uuid, '2026-07-06T15:53:00.000Z', 555000, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('7bee7433-ddc0-40cc-83f9-fa25183e36be'::uuid, '2026-08-06T11:37:00.000Z', 1295000, 'at-property', 'balance', 'Thu phần còn lại tại quầy');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('7aee72a0-dec0-425f-82f9-f892193e3851'::uuid, '2026-08-31T14:41:00.000Z', 573750, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('7eec3a55-6ac3-4d5a-86f7-c04795413a1c'::uuid, '2026-07-09T18:07:00.000Z', 9831247, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('7bec359c-69c3-4bc7-87f7-c1da98413ed5'::uuid, '2026-07-19T21:40:00.000Z', 1062500, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('7cec372f-68c3-4a34-88f7-c36d97413d42'::uuid, '2026-09-15T20:07:00.000Z', 3396600, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('79ec3276-67c3-48a1-81f7-b86892413563'::uuid, '2026-05-25T10:16:00.000Z', 2683450, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('79ec3276-67c3-48a1-81f7-b86892413563'::uuid, '2026-07-04T11:26:00.000Z', 2683450, 'at-property', 'balance', 'Thu phần còn lại tại quầy');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('7aec3409-66c3-470e-82f7-b9fb914133d0'::uuid, '2026-07-29T22:00:00.000Z', 4583304, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('77ec2f50-65c3-457b-83f7-bb8e94413889'::uuid, '2026-08-20T10:53:00.000Z', 5143116, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('78ec30e3-64c3-43e8-84f7-bd21934136f6'::uuid, '2026-09-16T08:56:00.000Z', 10108575, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('85ec455a-63c3-4255-8df7-b21c9e414847'::uuid, '2026-07-21T15:51:00.000Z', 4246500, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('85ec455a-63c3-4255-8df7-b21c9e414847'::uuid, '2026-07-29T11:55:00.000Z', 9908500, 'at-property', 'balance', 'Thu phần còn lại tại quầy');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('86ec46ed-62c3-40c2-8ef7-b3af9d4146b4'::uuid, '2026-07-19T09:17:00.000Z', 7601660, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('f7e92739-51c5-4496-87ff-2def2439cc74'::uuid, '2026-07-14T17:05:00.000Z', 6137874, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('f7e92739-51c5-4496-87ff-2def2439cc74'::uuid, '2026-08-02T11:39:00.000Z', 6137874, 'at-property', 'balance', 'Thu phần còn lại tại quầy');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('f6e925a6-52c5-4629-86ff-2c5c2539ce07'::uuid, '2026-07-02T20:39:00.000Z', 191250, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('f5e92413-4fc5-4170-89ff-31152639cf9a'::uuid, '2026-06-27T16:16:00.000Z', 2160000, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('f4e92280-50c5-4303-88ff-2f822739d12d'::uuid, '2026-07-19T19:27:00.000Z', 1939845, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('fbe92d85-55c5-4ae2-83ff-27a32039c628'::uuid, '2026-08-19T08:58:00.000Z', 833760, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('fae92bf2-56c5-4c75-82ff-26102139c7bb'::uuid, '2026-09-05T16:39:00.000Z', 9486190, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('f9e92a5f-53c5-47bc-85ff-2ac92239c94e'::uuid, '2026-07-03T11:23:00.000Z', 3842157, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('f9e92a5f-53c5-47bc-85ff-2ac92239c94e'::uuid, '2026-07-14T11:35:00.000Z', 3842156, 'at-property', 'balance', 'Thu phần còn lại tại quầy');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('f8e928cc-54c5-494f-84ff-29362339cae1'::uuid, '2026-06-04T15:36:00.000Z', 6989369, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('f8e928cc-54c5-494f-84ff-29362339cae1'::uuid, '2026-07-12T11:18:00.000Z', 6989368, 'at-property', 'balance', 'Thu phần còn lại tại quầy');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('ffe933d1-59c5-412e-8fff-3a871c39bfdc'::uuid, '2026-09-19T18:35:00.000Z', 4689900, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('fee9323e-5ac5-42c1-8eff-38f41d39c16f'::uuid, '2026-07-26T08:07:00.000Z', 1654438, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('fee9323e-5ac5-42c1-8eff-38f41d39c16f'::uuid, '2026-08-04T11:44:00.000Z', 1654437, 'at-property', 'balance', 'Thu phần còn lại tại quầy');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('f1e6df30-57c7-4c9f-81fc-1c662a3c147d'::uuid, '2026-07-05T14:02:00.000Z', 1210125, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('f1e6df30-57c7-4c9f-81fc-1c662a3c147d'::uuid, '2026-07-24T11:29:00.000Z', 2823625, 'at-property', 'balance', 'Thu phần còn lại tại quầy');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('f2e6e0c3-56c7-4b0c-82fc-1df9293c12ea'::uuid, '2026-06-04T16:21:00.000Z', 526500, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('f2e6e0c3-56c7-4b0c-82fc-1df9293c12ea'::uuid, '2026-07-04T11:59:00.000Z', 1228500, 'at-property', 'balance', 'Thu phần còn lại tại quầy');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('f3e6e256-59c7-4fc5-8ffc-1940283c1157'::uuid, '2026-08-11T11:19:00.000Z', 1887000, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('f4e6e3e9-58c7-4e32-80fc-1ad3273c0fc4'::uuid, '2026-06-28T14:28:00.000Z', 3824604, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('f4e6e3e9-58c7-4e32-80fc-1ad3273c0fc4'::uuid, '2026-07-28T11:45:00.000Z', 8924076, 'at-property', 'balance', 'Thu phần còn lại tại quầy');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('f5e6e57c-53c7-4653-85fc-22b2263c0e31'::uuid, '2026-07-31T10:13:00.000Z', 6817032, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('f6e6e70f-52c7-44c0-86fc-2445253c0c9e'::uuid, '2026-06-07T12:21:00.000Z', 8674243, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('f6e6e70f-52c7-44c0-86fc-2445253c0c9e'::uuid, '2026-07-16T11:14:00.000Z', 8674243, 'at-property', 'balance', 'Thu phần còn lại tại quầy');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('f7e6e8a2-55c7-4979-83fc-1f8c243c0b0b'::uuid, '2026-07-14T14:17:00.000Z', 5408655, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('f9e6ebc8-5fc8-4937-89fc-28fe223c07e5'::uuid, '2026-06-16T13:21:00.000Z', 306000, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('f9e6ebc8-5fc8-4937-89fc-28fe223c07e5'::uuid, '2026-07-05T11:20:00.000Z', 714000, 'at-property', 'balance', 'Thu phần còn lại tại quầy');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('fae6ed5b-5ec8-47a4-8afc-2a91213c0652'::uuid, '2026-07-17T19:04:00.000Z', 4477518, 'bank-transfer', 'deposit', 'Cọc theo gói giá');
INSERT INTO public.payments (booking_id, at, amount, method, kind, note)
VALUES ('fbf8380f-4db6-43c0-83f0-1d19983472e2'::uuid, '2026-07-31T08:26:00.000Z', 12024184, 'bank-transfer', 'deposit', 'Cọc theo gói giá');

-- ---------------------------------------------------------------------------
-- 5. activity_logs — 156 dòng, mỗi đơn ≥1 dòng 'created'
-- ---------------------------------------------------------------------------

INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('82ee7f38-e6c0-4ef7-8afa-052a113e2bb9'::uuid, '2026-06-21T15:34:00.000Z', 'cus-0996138875', 'Trần Thị Khánh', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua web');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('82ee7f38-e6c0-4ef7-8afa-052a113e2bb9'::uuid, '2026-06-21T15:34:00.000Z', 'cus-0996138875', 'Trần Thị Khánh', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 3.393.495đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('82ee7f38-e6c0-4ef7-8afa-052a113e2bb9'::uuid, '2026-06-21T15:34:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('82ee7f38-e6c0-4ef7-8afa-052a113e2bb9'::uuid, '2026-07-03T14:03:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-in', 'status', 'confirmed', 'checked_in', 'Gán phòng phong-giuong-doi-co-ban-cong-12-1');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('82ee7f38-e6c0-4ef7-8afa-052a113e2bb9'::uuid, '2026-07-05T11:56:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-out', 'status', 'checked_in', 'checked_out', 'Có dùng minibar, đã thanh toán đủ.');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('85ee83f1-e7c0-408a-89fa-03970e3e2700'::uuid, '2026-07-07T19:05:00.000Z', 'cus-0945015171', 'Bùi Thanh Quân', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua web');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('85ee83f1-e7c0-408a-89fa-03970e3e2700'::uuid, '2026-07-07T19:05:00.000Z', 'cus-0945015171', 'Bùi Thanh Quân', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 1.343.280đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('85ee83f1-e7c0-408a-89fa-03970e3e2700'::uuid, '2026-07-07T19:05:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('85ee83f1-e7c0-408a-89fa-03970e3e2700'::uuid, '2026-07-26T14:13:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-in', 'status', 'confirmed', 'checked_in', 'Gán phòng phong-gia-dinh-view-bien-08-08-1');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('85ee83f1-e7c0-408a-89fa-03970e3e2700'::uuid, '2026-07-27T11:49:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-out', 'status', 'checked_in', 'checked_out', 'Vỡ một ly thuỷ tinh, đã tính phí.');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('84ee825e-e8c0-421d-88fa-02040f3e2893'::uuid, '2026-07-13T10:40:00.000Z', 'cus-0993312183', 'Vũ Đức Hà', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua web');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('84ee825e-e8c0-421d-88fa-02040f3e2893'::uuid, '2026-07-13T10:40:00.000Z', 'cus-0993312183', 'Vũ Đức Hà', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 1.237.125đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('84ee825e-e8c0-421d-88fa-02040f3e2893'::uuid, '2026-07-13T10:40:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('84ee825e-e8c0-421d-88fa-02040f3e2893'::uuid, '2026-07-23T14:04:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-in', 'status', 'confirmed', 'checked_in', 'Gán phòng phong-superior-co-giuong-co-king-07-1');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('84ee825e-e8c0-421d-88fa-02040f3e2893'::uuid, '2026-07-24T11:39:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-out', 'status', 'checked_in', 'checked_out', 'Có dùng minibar, đã thanh toán đủ.');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('87ee8717-e1c0-4718-87fa-0071143e3072'::uuid, '2026-09-09T22:49:00.000Z', 'cus-0995273375', 'Sarah Johnson', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua web');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('87ee8717-e1c0-4718-87fa-0071143e3072'::uuid, '2026-09-09T22:49:00.000Z', 'cus-0995273375', 'Sarah Johnson', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 3.751.920đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('87ee8717-e1c0-4718-87fa-0071143e3072'::uuid, '2026-09-09T22:49:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('89ee8a3d-e3c0-4a3e-85f9-fd4b123e2d4c'::uuid, '2026-06-13T11:06:00.000Z', 'cus-0930558830', 'Bùi Thanh Ngọc', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua web');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('89ee8a3d-e3c0-4a3e-85f9-fd4b123e2d4c'::uuid, '2026-06-13T11:06:00.000Z', 'cus-0930558830', 'Bùi Thanh Ngọc', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 12.284.064đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('89ee8a3d-e3c0-4a3e-85f9-fd4b123e2d4c'::uuid, '2026-06-13T11:06:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('89ee8a3d-e3c0-4a3e-85f9-fd4b123e2d4c'::uuid, '2026-07-08T14:53:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-in', 'status', 'confirmed', 'checked_in', 'Gán phòng second-floor-family-with-sea-view-13-1');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('89ee8a3d-e3c0-4a3e-85f9-fd4b123e2d4c'::uuid, '2026-07-12T11:37:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-out', 'status', 'checked_in', 'checked_out', 'Khách lịch sự, phòng sạch sẽ khi trả.');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('88ee88aa-e4c0-4bd1-84f9-fbb8133e2edf'::uuid, '2026-06-21T12:03:00.000Z', 'cus-0975785957', 'Michael Chen', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua web');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('88ee88aa-e4c0-4bd1-84f9-fbb8133e2edf'::uuid, '2026-06-21T12:03:00.000Z', 'cus-0975785957', 'Michael Chen', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 25.189.722đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('88ee88aa-e4c0-4bd1-84f9-fbb8133e2edf'::uuid, '2026-06-21T12:03:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('88ee88aa-e4c0-4bd1-84f9-fbb8133e2edf'::uuid, '2026-06-26T14:44:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-in', 'status', 'confirmed', 'checked_in', 'Gán phòng suite-02-phong-ngu-08-khach-08-09-1');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('88ee88aa-e4c0-4bd1-84f9-fbb8133e2edf'::uuid, '2026-06-30T11:30:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-out', 'status', 'checked_in', 'checked_out', 'Vỡ một ly thuỷ tinh, đã tính phí.');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('7bee7433-ddc0-40cc-83f9-fa25183e36be'::uuid, '2026-07-06T15:53:00.000Z', 'cus-0959077899', 'Hoàng Thu Minh', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua web');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('7bee7433-ddc0-40cc-83f9-fa25183e36be'::uuid, '2026-07-06T15:53:00.000Z', 'cus-0959077899', 'Hoàng Thu Minh', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 555.000đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('7bee7433-ddc0-40cc-83f9-fa25183e36be'::uuid, '2026-07-06T15:53:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('7bee7433-ddc0-40cc-83f9-fa25183e36be'::uuid, '2026-08-04T14:31:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-in', 'status', 'confirmed', 'checked_in', 'Gán phòng phong-03-nguoi-co-ban-cong-18-1');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('7bee7433-ddc0-40cc-83f9-fa25183e36be'::uuid, '2026-08-06T11:37:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-out', 'status', 'checked_in', 'checked_out', 'Có dùng minibar, đã thanh toán đủ.');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('7aee72a0-dec0-425f-82f9-f892193e3851'::uuid, '2026-08-31T14:41:00.000Z', 'cus-0951321540', 'David Park', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua web');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('7aee72a0-dec0-425f-82f9-f892193e3851'::uuid, '2026-08-31T14:41:00.000Z', 'cus-0951321540', 'David Park', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 573.750đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('7aee72a0-dec0-425f-82f9-f892193e3851'::uuid, '2026-08-31T14:41:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('7dec38c2-6bc3-4eed-85f7-beb496413baf'::uuid, '2026-07-24T20:42:00.000Z', 'cus-0969913087', 'Đặng Kim Bình', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua phone');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('7eec3a55-6ac3-4d5a-86f7-c04795413a1c'::uuid, '2026-07-09T18:07:00.000Z', 'cus-0948494537', 'Lê Hoàng An', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua web');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('7eec3a55-6ac3-4d5a-86f7-c04795413a1c'::uuid, '2026-07-09T18:07:00.000Z', 'cus-0948494537', 'Lê Hoàng An', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 9.831.247đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('7eec3a55-6ac3-4d5a-86f7-c04795413a1c'::uuid, '2026-07-09T18:07:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('7eec3a55-6ac3-4d5a-86f7-c04795413a1c'::uuid, '2026-07-14T10:00:00.000Z', 'cus-0948494537', 'Lê Hoàng An', 'customer', 'cancelled', 'status', NULL, 'cancelled', 'Lý do cá nhân');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('7bec359c-69c3-4bc7-87f7-c1da98413ed5'::uuid, '2026-07-19T21:40:00.000Z', 'cus-0999475386', 'Nguyễn Văn Dũng', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua web');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('7bec359c-69c3-4bc7-87f7-c1da98413ed5'::uuid, '2026-07-19T21:40:00.000Z', 'cus-0999475386', 'Nguyễn Văn Dũng', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 1.062.500đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('7bec359c-69c3-4bc7-87f7-c1da98413ed5'::uuid, '2026-07-19T21:40:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('7cec372f-68c3-4a34-88f7-c36d97413d42'::uuid, '2026-09-15T20:07:00.000Z', 'cus-0933156923', 'John Smith', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua phone');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('7cec372f-68c3-4a34-88f7-c36d97413d42'::uuid, '2026-09-15T20:07:00.000Z', 'cus-0933156923', 'John Smith', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 3.396.600đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('7cec372f-68c3-4a34-88f7-c36d97413d42'::uuid, '2026-09-15T20:07:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('79ec3276-67c3-48a1-81f7-b86892413563'::uuid, '2026-05-25T10:16:00.000Z', 'cus-0984916787', 'David Park', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua web');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('79ec3276-67c3-48a1-81f7-b86892413563'::uuid, '2026-05-25T10:16:00.000Z', 'cus-0984916787', 'David Park', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 2.683.450đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('79ec3276-67c3-48a1-81f7-b86892413563'::uuid, '2026-05-25T10:16:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('79ec3276-67c3-48a1-81f7-b86892413563'::uuid, '2026-07-02T14:43:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-in', 'status', 'confirmed', 'checked_in', 'Gán phòng phong-deluxe-06-1');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('79ec3276-67c3-48a1-81f7-b86892413563'::uuid, '2026-07-04T11:26:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-out', 'status', 'checked_in', 'checked_out', 'Khách lịch sự, phòng sạch sẽ khi trả.');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('7aec3409-66c3-470e-82f7-b9fb914133d0'::uuid, '2026-07-29T22:00:00.000Z', 'cus-0981539252', 'Hoàng Thu Minh', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua phone');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('7aec3409-66c3-470e-82f7-b9fb914133d0'::uuid, '2026-07-29T22:00:00.000Z', 'cus-0981539252', 'Hoàng Thu Minh', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 4.583.304đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('7aec3409-66c3-470e-82f7-b9fb914133d0'::uuid, '2026-07-29T22:00:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('7aec3409-66c3-470e-82f7-b9fb914133d0'::uuid, '2026-07-24T10:00:00.000Z', 'cus-0981539252', 'Hoàng Thu Minh', 'customer', 'cancelled', 'status', NULL, 'cancelled', 'Thời tiết xấu');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('77ec2f50-65c3-457b-83f7-bb8e94413889'::uuid, '2026-08-20T10:53:00.000Z', 'cus-0919594984', 'Sarah Johnson', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua web');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('77ec2f50-65c3-457b-83f7-bb8e94413889'::uuid, '2026-08-20T10:53:00.000Z', 'cus-0919594984', 'Sarah Johnson', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 5.143.116đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('77ec2f50-65c3-457b-83f7-bb8e94413889'::uuid, '2026-08-20T10:53:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('78ec30e3-64c3-43e8-84f7-bd21934136f6'::uuid, '2026-09-16T08:56:00.000Z', 'cus-0973185851', 'Đặng Kim An', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua web');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('78ec30e3-64c3-43e8-84f7-bd21934136f6'::uuid, '2026-09-16T08:56:00.000Z', 'cus-0973185851', 'Đặng Kim An', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 10.108.575đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('78ec30e3-64c3-43e8-84f7-bd21934136f6'::uuid, '2026-09-16T08:56:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('85ec455a-63c3-4255-8df7-b21c9e414847'::uuid, '2026-07-21T15:51:00.000Z', 'cus-0914506369', 'Michael Chen', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua phone');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('85ec455a-63c3-4255-8df7-b21c9e414847'::uuid, '2026-07-21T15:51:00.000Z', 'cus-0914506369', 'Michael Chen', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 4.246.500đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('85ec455a-63c3-4255-8df7-b21c9e414847'::uuid, '2026-07-21T15:51:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('85ec455a-63c3-4255-8df7-b21c9e414847'::uuid, '2026-07-27T14:28:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-in', 'status', 'confirmed', 'checked_in', 'Gán phòng suite-02-phong-ngu-08-khach-08-09-1');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('85ec455a-63c3-4255-8df7-b21c9e414847'::uuid, '2026-07-29T11:55:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-out', 'status', 'checked_in', 'checked_out', 'Khách hài lòng, hẹn quay lại mùa sau.');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('86ec46ed-62c3-40c2-8ef7-b3af9d4146b4'::uuid, '2026-07-19T09:17:00.000Z', 'cus-0932909666', 'Phạm Minh Quân', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua web');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('86ec46ed-62c3-40c2-8ef7-b3af9d4146b4'::uuid, '2026-07-19T09:17:00.000Z', 'cus-0932909666', 'Phạm Minh Quân', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 7.601.660đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('86ec46ed-62c3-40c2-8ef7-b3af9d4146b4'::uuid, '2026-07-19T09:17:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f7e92739-51c5-4496-87ff-2def2439cc74'::uuid, '2026-07-14T17:05:00.000Z', 'cus-0997020380', 'Đỗ Quang Ngọc', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua web');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f7e92739-51c5-4496-87ff-2def2439cc74'::uuid, '2026-07-14T17:05:00.000Z', 'cus-0997020380', 'Đỗ Quang Ngọc', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 6.137.874đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f7e92739-51c5-4496-87ff-2def2439cc74'::uuid, '2026-07-14T17:05:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f7e92739-51c5-4496-87ff-2def2439cc74'::uuid, '2026-07-29T14:22:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-in', 'status', 'confirmed', 'checked_in', 'Gán phòng phong-gia-dinh-nhin-ra-bien-01-1');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f7e92739-51c5-4496-87ff-2def2439cc74'::uuid, '2026-08-02T11:39:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-out', 'status', 'checked_in', 'checked_out', 'Khách hài lòng, hẹn quay lại mùa sau.');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f6e925a6-52c5-4629-86ff-2c5c2539ce07'::uuid, '2026-07-02T20:39:00.000Z', 'cus-0950046573', 'Trần Thị Phương', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua phone');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f6e925a6-52c5-4629-86ff-2c5c2539ce07'::uuid, '2026-07-02T20:39:00.000Z', 'cus-0950046573', 'Trần Thị Phương', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 191.250đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f6e925a6-52c5-4629-86ff-2c5c2539ce07'::uuid, '2026-07-02T20:39:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f5e92413-4fc5-4170-89ff-31152639cf9a'::uuid, '2026-06-27T16:16:00.000Z', 'cus-0996594794', 'Nguyễn Văn Khánh', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua web');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f5e92413-4fc5-4170-89ff-31152639cf9a'::uuid, '2026-06-27T16:16:00.000Z', 'cus-0996594794', 'Nguyễn Văn Khánh', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 2.160.000đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f5e92413-4fc5-4170-89ff-31152639cf9a'::uuid, '2026-06-27T16:16:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f5e92413-4fc5-4170-89ff-31152639cf9a'::uuid, '2026-07-24T14:18:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-in', 'status', 'confirmed', 'checked_in', 'Gán phòng phong-giuong-doi-co-ban-cong-nhin-ra-bien-03-04-1');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f5e92413-4fc5-4170-89ff-31152639cf9a'::uuid, '2026-07-27T11:04:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-out', 'status', 'checked_in', 'checked_out', 'Khách lịch sự, phòng sạch sẽ khi trả.');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f4e92280-50c5-4303-88ff-2f822739d12d'::uuid, '2026-07-19T19:27:00.000Z', 'cus-0964569566', 'Đỗ Quang Phương', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua web');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f4e92280-50c5-4303-88ff-2f822739d12d'::uuid, '2026-07-19T19:27:00.000Z', 'cus-0964569566', 'Đỗ Quang Phương', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 1.939.845đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f4e92280-50c5-4303-88ff-2f822739d12d'::uuid, '2026-07-19T19:27:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('fbe92d85-55c5-4ae2-83ff-27a32039c628'::uuid, '2026-08-19T08:58:00.000Z', 'cus-0967196256', 'Vũ Đức Minh', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua web');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('fbe92d85-55c5-4ae2-83ff-27a32039c628'::uuid, '2026-08-19T08:58:00.000Z', 'cus-0967196256', 'Vũ Đức Minh', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 833.760đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('fbe92d85-55c5-4ae2-83ff-27a32039c628'::uuid, '2026-08-19T08:58:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('fae92bf2-56c5-4c75-82ff-26102139c7bb'::uuid, '2026-09-05T16:39:00.000Z', 'cus-0996787606', 'Ngô Bảo An', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua web');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('fae92bf2-56c5-4c75-82ff-26102139c7bb'::uuid, '2026-09-05T16:39:00.000Z', 'cus-0996787606', 'Ngô Bảo An', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 9.486.190đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('fae92bf2-56c5-4c75-82ff-26102139c7bb'::uuid, '2026-09-05T16:39:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f9e92a5f-53c5-47bc-85ff-2ac92239c94e'::uuid, '2026-07-03T11:23:00.000Z', 'cus-0941028427', 'Đặng Kim Linh', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua web');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f9e92a5f-53c5-47bc-85ff-2ac92239c94e'::uuid, '2026-07-03T11:23:00.000Z', 'cus-0941028427', 'Đặng Kim Linh', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 3.842.157đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f9e92a5f-53c5-47bc-85ff-2ac92239c94e'::uuid, '2026-07-03T11:23:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f9e92a5f-53c5-47bc-85ff-2ac92239c94e'::uuid, '2026-07-13T14:50:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-in', 'status', 'confirmed', 'checked_in', 'Gán phòng suite-02-phong-ngu-06-khach-15-16-1');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f9e92a5f-53c5-47bc-85ff-2ac92239c94e'::uuid, '2026-07-14T11:35:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-out', 'status', 'checked_in', 'checked_out', 'Khách lịch sự, phòng sạch sẽ khi trả.');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f8e928cc-54c5-494f-84ff-29362339cae1'::uuid, '2026-06-04T15:36:00.000Z', 'cus-0971160877', 'Đặng Kim Ngọc', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua web');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f8e928cc-54c5-494f-84ff-29362339cae1'::uuid, '2026-06-04T15:36:00.000Z', 'cus-0971160877', 'Đặng Kim Ngọc', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 6.989.369đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f8e928cc-54c5-494f-84ff-29362339cae1'::uuid, '2026-06-04T15:36:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f8e928cc-54c5-494f-84ff-29362339cae1'::uuid, '2026-07-09T14:50:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-in', 'status', 'confirmed', 'checked_in', 'Gán phòng phong-superior-co-giuong-co-king-07-1');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f8e928cc-54c5-494f-84ff-29362339cae1'::uuid, '2026-07-12T11:18:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-out', 'status', 'checked_in', 'checked_out', 'Vỡ một ly thuỷ tinh, đã tính phí.');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('ffe933d1-59c5-412e-8fff-3a871c39bfdc'::uuid, '2026-09-19T18:35:00.000Z', 'cus-0950262288', 'Hoàng Thu Ngọc', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua web');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('ffe933d1-59c5-412e-8fff-3a871c39bfdc'::uuid, '2026-09-19T18:35:00.000Z', 'cus-0950262288', 'Hoàng Thu Ngọc', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 4.689.900đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('ffe933d1-59c5-412e-8fff-3a871c39bfdc'::uuid, '2026-09-19T18:35:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('fee9323e-5ac5-42c1-8eff-38f41d39c16f'::uuid, '2026-07-26T08:07:00.000Z', 'cus-0937000424', 'Emma Wilson', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua web');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('fee9323e-5ac5-42c1-8eff-38f41d39c16f'::uuid, '2026-07-26T08:07:00.000Z', 'cus-0937000424', 'Emma Wilson', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 1.654.438đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('fee9323e-5ac5-42c1-8eff-38f41d39c16f'::uuid, '2026-07-26T08:07:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('fee9323e-5ac5-42c1-8eff-38f41d39c16f'::uuid, '2026-08-03T14:50:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-in', 'status', 'confirmed', 'checked_in', 'Gán phòng phong-tieu-chuan-giuong-doi-luc-giac-05-1');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('fee9323e-5ac5-42c1-8eff-38f41d39c16f'::uuid, '2026-08-04T11:44:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-out', 'status', 'checked_in', 'checked_out', 'Khách trả phòng muộn 1 tiếng, đã thu phụ phí.');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f1e6df30-57c7-4c9f-81fc-1c662a3c147d'::uuid, '2026-07-05T14:02:00.000Z', 'cus-0975652408', 'Phạm Minh Phương', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua phone');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f1e6df30-57c7-4c9f-81fc-1c662a3c147d'::uuid, '2026-07-05T14:02:00.000Z', 'cus-0975652408', 'Phạm Minh Phương', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 1.210.125đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f1e6df30-57c7-4c9f-81fc-1c662a3c147d'::uuid, '2026-07-05T14:02:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f1e6df30-57c7-4c9f-81fc-1c662a3c147d'::uuid, '2026-07-23T14:50:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-in', 'status', 'confirmed', 'checked_in', 'Gán phòng first-floor-family-with-sea-view-16-1');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f1e6df30-57c7-4c9f-81fc-1c662a3c147d'::uuid, '2026-07-24T11:29:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-out', 'status', 'checked_in', 'checked_out', 'Khách lịch sự, phòng sạch sẽ khi trả.');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f2e6e0c3-56c7-4b0c-82fc-1df9293c12ea'::uuid, '2026-06-04T16:21:00.000Z', 'cus-0931273318', 'Vũ Đức Quân', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua web');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f2e6e0c3-56c7-4b0c-82fc-1df9293c12ea'::uuid, '2026-06-04T16:21:00.000Z', 'cus-0931273318', 'Vũ Đức Quân', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 526.500đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f2e6e0c3-56c7-4b0c-82fc-1df9293c12ea'::uuid, '2026-06-04T16:21:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f2e6e0c3-56c7-4b0c-82fc-1df9293c12ea'::uuid, '2026-07-01T14:43:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-in', 'status', 'confirmed', 'checked_in', 'Gán phòng phong-03-nguoi-co-ban-cong-18-1');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f2e6e0c3-56c7-4b0c-82fc-1df9293c12ea'::uuid, '2026-07-04T11:59:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-out', 'status', 'checked_in', 'checked_out', 'Khách trả phòng muộn 1 tiếng, đã thu phụ phí.');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f3e6e256-59c7-4fc5-8ffc-1940283c1157'::uuid, '2026-08-11T11:19:00.000Z', 'cus-0929600831', 'Bùi Thanh Quân', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua web');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f3e6e256-59c7-4fc5-8ffc-1940283c1157'::uuid, '2026-08-11T11:19:00.000Z', 'cus-0929600831', 'Bùi Thanh Quân', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 1.887.000đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f3e6e256-59c7-4fc5-8ffc-1940283c1157'::uuid, '2026-08-11T11:19:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f4e6e3e9-58c7-4e32-80fc-1ad3273c0fc4'::uuid, '2026-06-28T14:28:00.000Z', 'cus-0910702109', 'Sarah Johnson', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua phone');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f4e6e3e9-58c7-4e32-80fc-1ad3273c0fc4'::uuid, '2026-06-28T14:28:00.000Z', 'cus-0910702109', 'Sarah Johnson', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 3.824.604đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f4e6e3e9-58c7-4e32-80fc-1ad3273c0fc4'::uuid, '2026-06-28T14:28:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f4e6e3e9-58c7-4e32-80fc-1ad3273c0fc4'::uuid, '2026-07-25T14:46:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-in', 'status', 'confirmed', 'checked_in', 'Gán phòng phong-gia-dinh-view-bien-08-08-1');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f4e6e3e9-58c7-4e32-80fc-1ad3273c0fc4'::uuid, '2026-07-28T11:45:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-out', 'status', 'checked_in', 'checked_out', 'Khách lịch sự, phòng sạch sẽ khi trả.');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f5e6e57c-53c7-4653-85fc-22b2263c0e31'::uuid, '2026-07-31T10:13:00.000Z', 'cus-0918930341', 'Phạm Minh Minh', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua web');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f5e6e57c-53c7-4653-85fc-22b2263c0e31'::uuid, '2026-07-31T10:13:00.000Z', 'cus-0918930341', 'Phạm Minh Minh', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 6.817.032đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f5e6e57c-53c7-4653-85fc-22b2263c0e31'::uuid, '2026-07-31T10:13:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f6e6e70f-52c7-44c0-86fc-2445253c0c9e'::uuid, '2026-06-07T12:21:00.000Z', 'cus-0984303130', 'Sarah Johnson', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua phone');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f6e6e70f-52c7-44c0-86fc-2445253c0c9e'::uuid, '2026-06-07T12:21:00.000Z', 'cus-0984303130', 'Sarah Johnson', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 8.674.243đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f6e6e70f-52c7-44c0-86fc-2445253c0c9e'::uuid, '2026-06-07T12:21:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f6e6e70f-52c7-44c0-86fc-2445253c0c9e'::uuid, '2026-07-12T14:16:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-in', 'status', 'confirmed', 'checked_in', 'Gán phòng phong-gia-dinh-view-bien-11-1');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f6e6e70f-52c7-44c0-86fc-2445253c0c9e'::uuid, '2026-07-16T11:14:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-out', 'status', 'checked_in', 'checked_out', 'Có dùng minibar, đã thanh toán đủ.');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f7e6e8a2-55c7-4979-83fc-1f8c243c0b0b'::uuid, '2026-07-14T14:17:00.000Z', 'cus-0912478470', 'Emma Wilson', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua web');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f7e6e8a2-55c7-4979-83fc-1f8c243c0b0b'::uuid, '2026-07-14T14:17:00.000Z', 'cus-0912478470', 'Emma Wilson', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 5.408.655đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f7e6e8a2-55c7-4979-83fc-1f8c243c0b0b'::uuid, '2026-07-14T14:17:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f8e6ea35-54c7-47e6-84fc-211f233c0978'::uuid, '2026-08-02T22:02:00.000Z', 'cus-0999112107', 'Bùi Thanh Khánh', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua web');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f9e6ebc8-5fc8-4937-89fc-28fe223c07e5'::uuid, '2026-06-16T13:21:00.000Z', 'cus-0911574897', 'Lê Hoàng Quân', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua web');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f9e6ebc8-5fc8-4937-89fc-28fe223c07e5'::uuid, '2026-06-16T13:21:00.000Z', 'cus-0911574897', 'Lê Hoàng Quân', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 306.000đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f9e6ebc8-5fc8-4937-89fc-28fe223c07e5'::uuid, '2026-06-16T13:21:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f9e6ebc8-5fc8-4937-89fc-28fe223c07e5'::uuid, '2026-06-30T14:49:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-in', 'status', 'confirmed', 'checked_in', 'Gán phòng phong-tieu-chuan-giuong-doi-luc-giac-05-1');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('f9e6ebc8-5fc8-4937-89fc-28fe223c07e5'::uuid, '2026-07-05T11:20:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'checked-out', 'status', 'checked_in', 'checked_out', 'Khách trả phòng muộn 1 tiếng, đã thu phụ phí.');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('fae6ed5b-5ec8-47a4-8afc-2a91213c0652'::uuid, '2026-07-17T19:04:00.000Z', 'cus-0931090112', 'Bùi Thanh Minh', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua web');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('fae6ed5b-5ec8-47a4-8afc-2a91213c0652'::uuid, '2026-07-17T19:04:00.000Z', 'cus-0931090112', 'Bùi Thanh Minh', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 4.477.518đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('fae6ed5b-5ec8-47a4-8afc-2a91213c0652'::uuid, '2026-07-17T19:04:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('fae6ed5b-5ec8-47a4-8afc-2a91213c0652'::uuid, '2026-07-22T10:00:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'cancelled', 'status', NULL, 'cancelled', 'Đổi lịch công tác');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('fbf8380f-4db6-43c0-83f0-1d19983472e2'::uuid, '2026-07-31T08:26:00.000Z', 'cus-0973465692', 'Sarah Johnson', 'customer', 'created', NULL, NULL, NULL, 'Đặt qua web');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('fbf8380f-4db6-43c0-83f0-1d19983472e2'::uuid, '2026-07-31T08:26:00.000Z', 'cus-0973465692', 'Sarah Johnson', 'customer', 'payment-recorded', NULL, NULL, NULL, 'Thu cọc 12.024.184đ');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('fbf8380f-4db6-43c0-83f0-1d19983472e2'::uuid, '2026-07-31T08:26:00.000Z', 'staff-01', 'Lê Thị Ngọc', 'receptionist', 'status-changed', 'status', 'pending_payment', 'confirmed', NULL);
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('fbf8380f-4db6-43c0-83f0-1d19983472e2'::uuid, '2026-08-10T10:00:00.000Z', 'cus-0973465692', 'Sarah Johnson', 'customer', 'cancelled', 'status', NULL, 'cancelled', 'Đổi lịch công tác');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('87ee8717-e1c0-4718-87fa-0071143e3072'::uuid, '2026-09-09T12:00:00.000Z', 'SYSTEM_SEED', 'Seed dữ liệu mẫu', 'manager', 'status-changed', 'status', 'confirmed', 'checked_in', 'Dữ liệu mẫu: dựng đủ 7 trạng thái để kiểm bộ lọc CMS');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('82ee7f38-e6c0-4ef7-8afa-052a113e2bb9'::uuid, '2026-06-21T12:00:00.000Z', 'SYSTEM_SEED', 'Seed dữ liệu mẫu', 'manager', 'status-changed', 'status', 'checked_out', 'no_show', 'Dữ liệu mẫu: dựng đủ 7 trạng thái để kiểm bộ lọc CMS');
INSERT INTO public.activity_logs (booking_id, at, actor_id, actor_name, actor_role, action, field, "from", "to", note)
VALUES ('7dec38c2-6bc3-4eed-85f7-beb496413baf'::uuid, '2026-07-24T12:00:00.000Z', 'SYSTEM_SEED', 'Seed dữ liệu mẫu', 'manager', 'status-changed', 'status', 'pending_payment', 'expired', 'Dữ liệu mẫu: dựng đủ 7 trạng thái để kiểm bộ lọc CMS');

-- ---------------------------------------------------------------------------
-- 6. notifications — 37 thông báo cho chuông
-- ---------------------------------------------------------------------------

INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('a73667df-9606-490e-89c4-2829937cbaa0'::uuid, 'payment-success', '2026-06-21T15:34:00.000Z', FALSE, '82ee7f38-e6c0-4ef7-8afa-052a113e2bb9'::uuid, 'ĐH-2026-0001', '{"roomTypeName":{"vi":"Phòng giường đôi có ban công","en":"Phòng giường đôi có ban công"},"nights":2,"amount":6786990}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('e476ccc6-14a7-4417-8584-72d878c584e9'::uuid, 'payment-success', '2026-07-07T19:05:00.000Z', FALSE, '85ee83f1-e7c0-408a-89fa-03970e3e2700'::uuid, 'ĐH-2026-0002', '{"roomTypeName":{"vi":"Phòng gia đình view biển (08)","en":"Phòng gia đình view biển (08)"},"nights":1,"amount":4477600}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('da5fdc30-25ea-47e1-849d-78be0a7e1c87'::uuid, 'payment-success', '2026-07-13T10:40:00.000Z', TRUE, '84ee825e-e8c0-421d-88fa-02040f3e2893'::uuid, 'ĐH-2026-0003', '{"roomTypeName":{"vi":"Phòng Superior có giường cỡ King","en":"Phòng Superior có giường cỡ King"},"nights":1,"amount":4123750}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('add275f7-33fb-4816-8f45-87b1c5027600'::uuid, 'payment-success', '2026-09-09T22:49:00.000Z', TRUE, '87ee8717-e1c0-4718-87fa-0071143e3072'::uuid, 'ĐH-2026-0004', '{"roomTypeName":{"vi":"Phòng gia đình view biển","en":"Phòng gia đình view biển"},"nights":2,"amount":7503840}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('1b0c33ba-4745-4daf-8b59-0be8f41b0e5d'::uuid, 'payment-success', '2026-06-13T11:06:00.000Z', FALSE, '89ee8a3d-e3c0-4a3e-85f9-fd4b123e2d4c'::uuid, 'ĐH-2026-0006', '{"roomTypeName":{"vi":"Second Floor Family with Sea View","en":"Second Floor Family with Sea View"},"nights":4,"amount":12284064}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('28386a41-8a99-4078-860a-7ef3dcf5f18a'::uuid, 'payment-success', '2026-06-21T12:03:00.000Z', FALSE, '88ee88aa-e4c0-4bd1-84f9-fbb8133e2edf'::uuid, 'ĐH-2026-0007', '{"roomTypeName":{"vi":"Suite 02 phòng ngủ (08 khách)","en":"Suite 02 phòng ngủ (08 khách)"},"nights":4,"amount":25189722}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('b7e3006e-c6a6-4277-852f-bc14f9471785'::uuid, 'payment-success', '2026-07-06T15:53:00.000Z', TRUE, '7bee7433-ddc0-40cc-83f9-fa25183e36be'::uuid, 'ĐH-2026-0008', '{"roomTypeName":{"vi":"Phòng 03 người - Có ban công","en":"Phòng 03 người - Có ban công"},"nights":2,"amount":1850000}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('42f5b509-17bd-4ac4-87e6-a24f868156f2'::uuid, 'payment-success', '2026-08-31T14:41:00.000Z', FALSE, '7aee72a0-dec0-425f-82f9-f892193e3851'::uuid, 'ĐH-2026-0009', '{"roomTypeName":{"vi":"Phòng tiêu chuẩn giường đôi (lục giác)","en":"Phòng tiêu chuẩn giường đôi (lục giác)"},"nights":1,"amount":1147500}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('b8a4cf36-6a1b-454f-8963-e98c65397515'::uuid, 'payment-success', '2026-07-09T18:07:00.000Z', FALSE, '7eec3a55-6ac3-4d5a-86f7-c04795413a1c'::uuid, 'ĐH-2026-0011', '{"roomTypeName":{"vi":"Phòng gia đình nhìn ra biển","en":"Phòng gia đình nhìn ra biển"},"nights":5,"amount":19662493}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('ccbbe5a9-d1ac-4120-8503-9c337678a8ba'::uuid, 'payment-success', '2026-07-19T21:40:00.000Z', TRUE, '7bec359c-69c3-4bc7-87f7-c1da98413ed5'::uuid, 'ĐH-2026-0012', '{"roomTypeName":{"vi":"Rock Deluxe Room","en":"Rock Deluxe Room"},"nights":5,"amount":1062500}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('96aa3e2a-ef6f-4f3b-80c1-417c69715e6d'::uuid, 'payment-success', '2026-09-15T20:07:00.000Z', FALSE, '7cec372f-68c3-4a34-88f7-c36d97413d42'::uuid, 'ĐH-2026-0013', '{"roomTypeName":{"vi":"Phòng giường đôi có sân trong","en":"Phòng giường đôi có sân trong"},"nights":3,"amount":3396600}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('bfc32598-da77-4685-88ca-df4abc209527'::uuid, 'payment-success', '2026-05-25T10:16:00.000Z', FALSE, '79ec3276-67c3-48a1-81f7-b86892413563'::uuid, 'ĐH-2026-0014', '{"roomTypeName":{"vi":"Phòng Deluxe","en":"Phòng Deluxe"},"nights":2,"amount":5366900}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('7e90f98f-d9fb-4512-87b2-45491377d93c'::uuid, 'payment-success', '2026-07-29T22:00:00.000Z', FALSE, '7aec3409-66c3-470e-82f7-b9fb914133d0'::uuid, 'ĐH-2026-0015', '{"roomTypeName":{"vi":"Phòng gia đình view biển (09)","en":"Phòng gia đình view biển (09)"},"nights":4,"amount":15277680}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('192545c7-dc9e-4b12-81c7-9c0dcfdc7ad8'::uuid, 'payment-success', '2026-08-20T10:53:00.000Z', TRUE, '77ec2f50-65c3-457b-83f7-bb8e94413889'::uuid, 'ĐH-2026-0016', '{"roomTypeName":{"vi":"Phòng 03 người - Có ban công","en":"Phòng 03 người - Có ban công"},"nights":2,"amount":5143116}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('a1c379cc-287d-4669-8b1e-e492d848a94f'::uuid, 'payment-success', '2026-09-16T08:56:00.000Z', FALSE, '78ec30e3-64c3-43e8-84f7-bd21934136f6'::uuid, 'ĐH-2026-0017', '{"roomTypeName":{"vi":"Suite 02 phòng ngủ (08 khách)","en":"Suite 02 phòng ngủ (08 khách)"},"nights":3,"amount":10108575}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('569d8e96-7136-48f3-86a0-32c88093d44d'::uuid, 'payment-success', '2026-07-21T15:51:00.000Z', TRUE, '85ec455a-63c3-4255-8df7-b21c9e414847'::uuid, 'ĐH-2026-0018', '{"roomTypeName":{"vi":"Suite 02 phòng ngủ (08 khách)","en":"Suite 02 phòng ngủ (08 khách)"},"nights":2,"amount":14155000}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('e8c0be73-73af-42e6-8843-604502e389a8'::uuid, 'payment-success', '2026-07-19T09:17:00.000Z', TRUE, '86ec46ed-62c3-40c2-8ef7-b3af9d4146b4'::uuid, 'ĐH-2026-0019', '{"roomTypeName":{"vi":"Suite 02 phòng ngủ (08 khách)","en":"Suite 02 phòng ngủ (08 khách)"},"nights":4,"amount":25338865}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('7a7eb493-475f-4dae-84d5-39d5e7687608'::uuid, 'payment-success', '2026-07-14T17:05:00.000Z', TRUE, 'f7e92739-51c5-4496-87ff-2def2439cc74'::uuid, 'ĐH-2026-0020', '{"roomTypeName":{"vi":"Phòng gia đình nhìn ra biển","en":"Phòng gia đình nhìn ra biển"},"nights":4,"amount":12275748}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('3df6f316-b1d4-4fb3-8b0d-e840d3818fdd'::uuid, 'payment-success', '2026-07-02T20:39:00.000Z', FALSE, 'f6e925a6-52c5-4629-86ff-2c5c2539ce07'::uuid, 'ĐH-2026-0021', '{"roomTypeName":{"vi":"Phòng giường đôi","en":"Phòng giường đôi"},"nights":1,"amount":382500}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('ff85f815-532e-4324-8184-9a23f4665d22'::uuid, 'payment-success', '2026-06-27T16:16:00.000Z', FALSE, 'f5e92413-4fc5-4170-89ff-31152639cf9a'::uuid, 'ĐH-2026-0022', '{"roomTypeName":{"vi":"Phòng giường đôi có ban công nhìn ra biển","en":"Phòng giường đôi có ban công nhìn ra biển"},"nights":3,"amount":2160000}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('90a1ca43-ea15-4496-8b2d-5ce9af516004'::uuid, 'payment-success', '2026-07-19T19:27:00.000Z', FALSE, 'f4e92280-50c5-4303-88ff-2f822739d12d'::uuid, 'ĐH-2026-0023', '{"roomTypeName":{"vi":"Suite 02 phòng ngủ (06 khách)","en":"Suite 02 phòng ngủ (06 khách)"},"nights":1,"amount":6466150}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('7c7f6106-4f99-4c53-8919-d9989b1c9aa5'::uuid, 'payment-success', '2026-08-19T08:58:00.000Z', FALSE, 'fbe92d85-55c5-4ae2-83ff-27a32039c628'::uuid, 'ĐH-2026-0024', '{"roomTypeName":{"vi":"Phòng gia đình view biển (09)","en":"Phòng gia đình view biển (09)"},"nights":1,"amount":2779200}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('820f2a6b-9d81-4986-8e38-7e5d065d8b80'::uuid, 'payment-success', '2026-09-05T16:39:00.000Z', FALSE, 'fae92bf2-56c5-4c75-82ff-26102139c7bb'::uuid, 'ĐH-2026-0025', '{"roomTypeName":{"vi":"Phòng Superior có giường cỡ King","en":"Phòng Superior có giường cỡ King"},"nights":5,"amount":9486190}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('a71bacee-739c-4d4f-8084-5d08d84a8b21'::uuid, 'payment-success', '2026-07-03T11:23:00.000Z', TRUE, 'f9e92a5f-53c5-47bc-85ff-2ac92239c94e'::uuid, 'ĐH-2026-0026', '{"roomTypeName":{"vi":"Suite 02 phòng ngủ (06 khách)","en":"Suite 02 phòng ngủ (06 khách)"},"nights":1,"amount":7684313}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('c65351e5-d1f9-44bc-8241-26c369277e72'::uuid, 'payment-success', '2026-06-04T15:36:00.000Z', FALSE, 'f8e928cc-54c5-494f-84ff-29362339cae1'::uuid, 'ĐH-2026-0027', '{"roomTypeName":{"vi":"Phòng Superior có giường cỡ King","en":"Phòng Superior có giường cỡ King"},"nights":3,"amount":13978737}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('e2df69bd-9dd3-4dfc-8ab9-118bd7d6517a'::uuid, 'payment-success', '2026-09-19T18:35:00.000Z', TRUE, 'ffe933d1-59c5-412e-8fff-3a871c39bfdc'::uuid, 'ĐH-2026-0028', '{"roomTypeName":{"vi":"Phòng gia đình view biển (09)","en":"Phòng gia đình view biển (09)"},"nights":3,"amount":9379800}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('8ba4553c-4228-4715-8f4a-c936176f7d37'::uuid, 'payment-success', '2026-07-26T08:07:00.000Z', TRUE, 'fee9323e-5ac5-42c1-8eff-38f41d39c16f'::uuid, 'ĐH-2026-0029', '{"roomTypeName":{"vi":"Phòng tiêu chuẩn giường đôi (lục giác)","en":"Phòng tiêu chuẩn giường đôi (lục giác)"},"nights":1,"amount":3308875}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('0c17f48f-6641-4766-8cc9-2de178acc888'::uuid, 'payment-success', '2026-07-05T14:02:00.000Z', TRUE, 'f1e6df30-57c7-4c9f-81fc-1c662a3c147d'::uuid, 'ĐH-2026-0030', '{"roomTypeName":{"vi":"First Floor Family with Sea View","en":"First Floor Family with Sea View"},"nights":1,"amount":4033750}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('69678ea4-e1ae-4dc1-85aa-d6f6a83832c3'::uuid, 'payment-success', '2026-06-04T16:21:00.000Z', TRUE, 'f2e6e0c3-56c7-4b0c-82fc-1df9293c12ea'::uuid, 'ĐH-2026-0031', '{"roomTypeName":{"vi":"Phòng 03 người - Có ban công","en":"Phòng 03 người - Có ban công"},"nights":3,"amount":1755000}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('59d8728f-f425-42de-83d9-54a9857f17c0'::uuid, 'payment-success', '2026-08-11T11:19:00.000Z', FALSE, 'f3e6e256-59c7-4fc5-8ffc-1940283c1157'::uuid, 'ĐH-2026-0032', '{"roomTypeName":{"vi":"Phòng Deluxe","en":"Phòng Deluxe"},"nights":1,"amount":1887000}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('c01a8e88-7ef5-4a29-8d2e-146e0ace6597'::uuid, 'payment-success', '2026-06-28T14:28:00.000Z', FALSE, 'f4e6e3e9-58c7-4e32-80fc-1ad3273c0fc4'::uuid, 'ĐH-2026-0033', '{"roomTypeName":{"vi":"Phòng gia đình view biển (08)","en":"Phòng gia đình view biển (08)"},"nights":3,"amount":12748680}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('b8ca0053-c40b-468e-8c5f-469966047afc'::uuid, 'payment-success', '2026-07-31T10:13:00.000Z', FALSE, 'f5e6e57c-53c7-4653-85fc-22b2263c0e31'::uuid, 'ĐH-2026-0034', '{"roomTypeName":{"vi":"Phòng gia đình view biển (08)","en":"Phòng gia đình view biển (08)"},"nights":3,"amount":6817032}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('2357e7a8-30a3-44c5-8247-438a444adfe7'::uuid, 'payment-success', '2026-06-07T12:21:00.000Z', TRUE, 'f6e6e70f-52c7-44c0-86fc-2445253c0c9e'::uuid, 'ĐH-2026-0035', '{"roomTypeName":{"vi":"Phòng gia đình view biển","en":"Phòng gia đình view biển"},"nights":4,"amount":17348486}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('620f4119-81eb-4b3c-8cec-02230391f34e'::uuid, 'payment-success', '2026-07-14T14:17:00.000Z', FALSE, 'f7e6e8a2-55c7-4979-83fc-1f8c243c0b0b'::uuid, 'ĐH-2026-0036', '{"roomTypeName":{"vi":"Phòng giường đôi","en":"Phòng giường đôi"},"nights":4,"amount":10817309}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('f35c17d2-7484-47b7-8799-acb874c24f15'::uuid, 'payment-success', '2026-06-16T13:21:00.000Z', TRUE, 'f9e6ebc8-5fc8-4937-89fc-28fe223c07e5'::uuid, 'ĐH-2026-0038', '{"roomTypeName":{"vi":"Phòng tiêu chuẩn giường đôi (lục giác)","en":"Phòng tiêu chuẩn giường đôi (lục giác)"},"nights":5,"amount":1020000}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('d41257bf-0a13-49fe-8427-36457994c534'::uuid, 'payment-success', '2026-07-17T19:04:00.000Z', TRUE, 'fae6ed5b-5ec8-47a4-8afc-2a91213c0652'::uuid, 'ĐH-2026-0039', '{"roomTypeName":{"vi":"Rock Deluxe Room","en":"Rock Deluxe Room"},"nights":3,"amount":8955036}'::jsonb);
INSERT INTO public.notifications (account_id, kind, at, read, booking_id, booking_code, payload)
VALUES ('66dbda94-6113-46a9-8fd1-1f16959b2043'::uuid, 'payment-success', '2026-07-31T08:26:00.000Z', TRUE, 'fbf8380f-4db6-43c0-83f0-1d19983472e2'::uuid, 'ĐH-2026-0040', '{"roomTypeName":{"vi":"Phòng Superior có giường cỡ King","en":"Phòng Superior có giường cỡ King"},"nights":3,"amount":12024184}'::jsonb);

-- ---------------------------------------------------------------------------
-- 7. room_units — cập nhật tình trạng theo đơn đang ở / vừa trả
-- ---------------------------------------------------------------------------

UPDATE public.room_units SET status = 'dirty' WHERE id = '7ae2326b-ae3e-46d4-83e2-bb39e1d878d2'::uuid;
