-- =============================================================================
-- 20260101000100_core_tables.sql
--
-- Ticket 200-01 §6.1 — toàn bộ bảng của schema `public`.
--
-- Nguồn sự thật: resources/docs/briefs/ndh-schema-mapping.md §9.2–§9.11,
-- thứ tự tạo bảng theo đúng checklist §13. SQL bám theo TS, không ngược lại
-- (luật BE8) — mọi enum giữ NGUYÊN XI chuỗi trong packages/core/src/*-types.ts.
--
-- ⚠️ File này CHỈ TẠO bảng. RLS + policy nằm ở 20260101000200_rls_policies.sql
-- (ticket 000-02) chạy ngay sau. Giữa hai file bảng chưa có RLS — chấp nhận
-- được vì cả hai chạy trong cùng một lệnh `supabase db push` trên DB chưa mở
-- cho ai (ticket §6.1). KHÔNG dùng lý do này để hoãn RLS sang deploy sau.
--
-- Cấm ALTER bảng do file khác tạo. Sai thì thêm file timestamp mới (BE7).
-- =============================================================================


-- =============================================================================
-- 1. property_settings — cấu hình + nội dung khối tĩnh. ĐÚNG MỘT HÀNG ở v1.0.0.
--    schema-mapping §9.10
-- =============================================================================

CREATE TABLE public.property_settings (
    id           TEXT PRIMARY KEY DEFAULT 'nam-du-hill',
    brand        jsonb NOT NULL DEFAULT '{}'::jsonb,   -- Brand (types.ts:10)
    hero         jsonb NOT NULL DEFAULT '{}'::jsonb,   -- Hero (types.ts:303)
    about        jsonb NOT NULL DEFAULT '{}'::jsonb,   -- About (types.ts:296)
    facts        jsonb NOT NULL DEFAULT '[]'::jsonb,   -- Fact[]
    nav          jsonb NOT NULL DEFAULT '[]'::jsonb,   -- NavItem[]
    transport    jsonb NOT NULL DEFAULT '[]'::jsonb,   -- TransportLeg[] (nợ T2)
    notes        jsonb NOT NULL DEFAULT '[]'::jsonb,   -- I18nText[]
    -- Mặc định lấy đúng operations.seed.ts:264
    child_policy jsonb NOT NULL DEFAULT
        '{"freeUnderAge":6,"halfPriceUntilAge":11,"childRate":250000}'::jsonb,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_property_settings_touch BEFORE UPDATE ON public.property_settings
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();


-- =============================================================================
-- 2. room_types — GỘP Room (types.ts:76) + RoomExtra (types.ts:99)
--    schema-mapping §3 (Q3) + §9.2
--
--    Quan hệ đã là 1–1 bắt buộc theo cùng khoá; RoomExtra không có `id` riêng
--    mà nằm trong PropertyData.roomExtras[Room.id]. Tách bảng chỉ tạo một JOIN
--    không bao giờ có hàng mồ côi.
--
--    `Room.remaining` KHÔNG có cột — là giá trị dẫn xuất từ inventory cho một
--    khoảng ngày cụ thể. Lưu cột là mời gọi dark pattern "bịa khan hiếm" mà
--    luật FE13/P10 cấm.
-- =============================================================================

CREATE TABLE public.room_types (
    id                TEXT PRIMARY KEY,
    property_id       TEXT NOT NULL DEFAULT 'nam-du-hill',

    -- ---- từ Room ----
    name              public.i18n_text NOT NULL,
    description       public.i18n_text NOT NULL,       -- Room.desc
    area              TEXT NOT NULL,                   -- "48 m²" — chuỗi nguyên văn theo TS
    guests            INT NOT NULL,                    -- số khách tiêu chuẩn
    base_price        DECIMAL(12,2) NOT NULL,          -- Room.price
    tags              public.i18n_text_array NOT NULL DEFAULT '[]'::jsonb,
    images            jsonb NOT NULL DEFAULT '[]'::jsonb,   -- string[]
    "group"           VARCHAR(20),                     -- RoomGroup; "group" là từ khoá SQL
    extra_bed_fee     DECIMAL(12,2),
    reviews           jsonb NOT NULL DEFAULT '[]'::jsonb,   -- RoomReview[]

    -- ---- từ RoomExtra — GỘP ----
    max_guests        INT NOT NULL,
    default_guests    INT NOT NULL,
    extra_bed         DECIMAL(12,2) NOT NULL DEFAULT 0,
    bed               public.i18n_text,
    view              public.i18n_text,
    long_desc         public.i18n_text,                -- RoomExtra.long
    long_desc_2       public.i18n_text,                -- RoomExtra.long2
    amenities         public.i18n_text_array NOT NULL DEFAULT '[]'::jsonb,
    conditions        public.i18n_text_array NOT NULL DEFAULT '[]'::jsonb,

    sort_order        INT NOT NULL DEFAULT 0,
    active            BOOLEAN NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_room_types_id_slug  CHECK (id ~ '^[a-z0-9][a-z0-9-]{1,62}$'),
    CONSTRAINT chk_room_types_group    CHECK ("group" IS NULL OR "group" IN ('couple','family','suite')),
    CONSTRAINT chk_room_types_price    CHECK (base_price >= 0),
    CONSTRAINT chk_room_types_capacity CHECK (max_guests >= guests AND guests > 0)
);

CREATE INDEX idx_room_types_active  ON public.room_types (active, sort_order);
CREATE INDEX idx_room_types_name_vi ON public.room_types ((name ->> 'vi'));
CREATE INDEX idx_room_types_name_en ON public.room_types ((name ->> 'en'));

CREATE TRIGGER trg_room_types_touch BEFORE UPDATE ON public.room_types
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();


-- =============================================================================
-- 3. room_units — RoomUnit (booking-types.ts:23). schema-mapping §9.3
--
--    ON DELETE RESTRICT chứ không CASCADE: xoá một hạng phòng mà xoá theo cả
--    phòng vật lý là mất dữ liệu thật. Ngừng bán thì đặt active = false.
-- =============================================================================

CREATE TABLE public.room_units (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code         TEXT NOT NULL,                        -- "201"
    room_type_id TEXT NOT NULL REFERENCES public.room_types(id) ON DELETE RESTRICT,
    floor        TEXT,
    status       VARCHAR(20) NOT NULL DEFAULT 'available',
    note         TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_room_units_code    UNIQUE (code),
    CONSTRAINT chk_room_units_status CHECK (
        status IN ('available','occupied','dirty','cleaning','maintenance'))
);

CREATE INDEX idx_room_units_type ON public.room_units (room_type_id, status);

CREATE TRIGGER trg_room_units_touch BEFORE UPDATE ON public.room_units
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();


-- =============================================================================
-- 4. inventory ⭐ — Inventory (booking-types.ts:54). schema-mapping §9.4
--
--    Bảng trung tâm của toàn hệ thống. availableUnits = total - booked - blocked.
--
--    Ba lớp chống overbooking (BE4 / booking-domain §B7):
--      ① ứng dụng  checkAvailability() trước khi cho đặt
--      ② giao dịch SELECT … FOR UPDATE trong cùng transaction
--      ③ tầng DB   chk_not_oversold  ← ĐỊNH NGHĨA Ở ĐÂY, lớp phòng thủ cuối
--
--    CHECK không thay được FOR UPDATE: CHECK chỉ TỪ CHỐI giao dịch thứ hai
--    (khách thấy lỗi 500 khó hiểu); FOR UPDATE XẾP HÀNG để giao dịch thứ hai
--    đọc số mới rồi trả 409 tử tế. Phải có cả hai.
--
--    "Không có hàng = còn nguyên phòng" — availability.ts:89 coi ngày chưa có
--    bản ghi là chưa ai đụng tới. 200-03 dùng INSERT … ON CONFLICT DO UPDATE.
-- =============================================================================

CREATE TABLE public.inventory (
    room_type_id        TEXT NOT NULL REFERENCES public.room_types(id) ON DELETE CASCADE,
    date                DATE NOT NULL,
    total_units         INT  NOT NULL,
    booked_units        INT  NOT NULL DEFAULT 0,
    blocked_units       INT  NOT NULL DEFAULT 0,
    price_override      DECIMAL(12,2),
    min_nights          INT,
    closed_to_arrival   BOOLEAN NOT NULL DEFAULT FALSE,
    closed_to_departure BOOLEAN NOT NULL DEFAULT FALSE,
    -- Optimistic locking chống hai lễ tân ghi đè nhau (§B7 điều 2).
    -- Mọi UPDATE từ CMS kèm `AND version = $expected`; 0 rows → 409.
    version             INT  NOT NULL DEFAULT 1,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- PK tự nhiên: một hạng phòng × một ngày = đúng một hàng
    CONSTRAINT pk_inventory PRIMARY KEY (room_type_id, date),

    -- ⭐ LỚP PHÒNG THỦ CUỐI CÙNG chống overbooking (AC-3)
    CONSTRAINT chk_not_oversold CHECK (booked_units + blocked_units <= total_units),

    CONSTRAINT chk_inventory_nonneg CHECK (
        total_units >= 0 AND booked_units >= 0 AND blocked_units >= 0),
    CONSTRAINT chk_inventory_price      CHECK (price_override IS NULL OR price_override >= 0),
    CONSTRAINT chk_inventory_min_nights CHECK (min_nights IS NULL OR min_nights >= 1),
    CONSTRAINT chk_inventory_version    CHECK (version >= 1)
);

-- Truy vấn nóng nhất: "hạng X, khoảng ngày Y–Z còn mấy phòng"
CREATE INDEX idx_inventory_date ON public.inventory (date, room_type_id);

CREATE TRIGGER trg_inventory_touch BEFORE UPDATE ON public.inventory
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();


-- =============================================================================
-- 5. seasons — Season (booking-types.ts:114). schema-mapping §9.5
-- =============================================================================

CREATE TABLE public.seasons (
    id                 TEXT PRIMARY KEY,
    name               public.i18n_text NOT NULL,
    date_from          DATE NOT NULL,           -- Season.from ("from" là từ khoá SQL)
    date_to            DATE NOT NULL,           -- Season.to
    multiplier         NUMERIC(5,3) NOT NULL,
    weekend_multiplier NUMERIC(5,3),
    priority           INT NOT NULL DEFAULT 100,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_seasons_id_slug    CHECK (id ~ '^[a-z0-9][a-z0-9-]{1,62}$'),
    CONSTRAINT chk_seasons_range      CHECK (date_to >= date_from),
    CONSTRAINT chk_seasons_multiplier CHECK (multiplier > 0
        AND (weekend_multiplier IS NULL OR weekend_multiplier > 0))
);

CREATE INDEX idx_seasons_range ON public.seasons (date_from, date_to);

CREATE TRIGGER trg_seasons_touch BEFORE UPDATE ON public.seasons
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();


-- =============================================================================
-- 6. rate_plans — RatePlan (booking-types.ts:134). schema-mapping §9.5
-- =============================================================================

CREATE TABLE public.rate_plans (
    id                 TEXT PRIMARY KEY,
    name               public.i18n_text NOT NULL,
    description        public.i18n_text NOT NULL,
    adjust_percent     NUMERIC(6,2) NOT NULL DEFAULT 0,       -- -15 = rẻ hơn 15%
    includes_breakfast BOOLEAN NOT NULL DEFAULT FALSE,
    refundable         BOOLEAN NOT NULL DEFAULT TRUE,
    cancellation_rules jsonb NOT NULL DEFAULT '[]'::jsonb,    -- CancellationRule[]
    deposit_percent    NUMERIC(5,2) NOT NULL DEFAULT 30,
    room_type_ids      jsonb NOT NULL DEFAULT '[]'::jsonb,    -- string[]; rỗng = mọi hạng
    active             BOOLEAN NOT NULL DEFAULT TRUE,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_rate_plans_id_slug CHECK (id ~ '^[a-z0-9][a-z0-9-]{1,62}$'),
    CONSTRAINT chk_rate_plans_deposit CHECK (deposit_percent BETWEEN 0 AND 100),
    CONSTRAINT chk_rate_plans_adjust  CHECK (adjust_percent > -100),
    -- refundable=false thì bậc thang hoàn tiền phải rỗng (booking-types.ts:148)
    CONSTRAINT chk_rate_plans_refund  CHECK (
        refundable OR cancellation_rules = '[]'::jsonb)
);

CREATE TRIGGER trg_rate_plans_touch BEFORE UPDATE ON public.rate_plans
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();


-- =============================================================================
-- 7. addons — Addon (types.ts:113). schema-mapping §9.5
--
--    Đưa đón tàu Rạch Giá đứng đầu danh sách (sort_order = 0) — booking-domain
--    §B6: với Nam Du đây gần như bắt buộc, không được chôn giữa các dịch vụ khác.
-- =============================================================================

CREATE TABLE public.addons (
    id          TEXT PRIMARY KEY,
    name        public.i18n_text NOT NULL,
    price       DECIMAL(12,2) NOT NULL,
    unit        public.i18n_text NOT NULL,       -- "khách / đêm"
    sort_order  INT NOT NULL DEFAULT 0,
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_addons_id_slug CHECK (id ~ '^[a-z0-9][a-z0-9-]{1,62}$'),
    CONSTRAINT chk_addons_price   CHECK (price >= 0)
);

CREATE TRIGGER trg_addons_touch BEFORE UPDATE ON public.addons
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();


-- =============================================================================
-- 8. promotions — Promotion (booking-types.ts:226). schema-mapping §9.5
--
--    `code` UNIQUE nhưng cho phép NULL — Postgres coi nhiều NULL là khác nhau,
--    nên vẫn tạo được nhiều KM tự động không mã. Đúng ý TS (`code?`).
-- =============================================================================

CREATE TABLE public.promotions (
    id                  TEXT PRIMARY KEY,
    code                TEXT UNIQUE,                 -- NULL = tự động áp
    name                public.i18n_text NOT NULL,
    description         public.i18n_text NOT NULL,
    type                VARCHAR(20) NOT NULL,
    value               DECIMAL(12,2) NOT NULL,
    conditions          jsonb NOT NULL DEFAULT '{}'::jsonb,   -- PromotionConditions
    stackable           BOOLEAN NOT NULL DEFAULT TRUE,
    priority            INT NOT NULL DEFAULT 100,             -- số nhỏ áp trước
    max_discount        DECIMAL(12,2),
    usage_limit         INT,
    usage_count         INT NOT NULL DEFAULT 0,
    per_customer_limit  INT,
    active              BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_promotions_id_slug CHECK (id ~ '^[a-z0-9][a-z0-9-]{1,62}$'),
    CONSTRAINT chk_promotions_type CHECK (type IN (
        'percent','fixed','nth-night-free','long-stay',
        'early-bird','last-minute','free-addon')),
    CONSTRAINT chk_promotions_usage CHECK (
        usage_count >= 0 AND (usage_limit IS NULL OR usage_count <= usage_limit))
);

CREATE INDEX idx_promotions_active ON public.promotions (active, priority);
CREATE INDEX idx_promotions_name_vi ON public.promotions ((name ->> 'vi'));

CREATE TRIGGER trg_promotions_touch BEFORE UPDATE ON public.promotions
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();


-- =============================================================================
-- 9. accounts — Account (booking-types.ts:476) + Customer (:488)
--    schema-mapping §9.6
--
--    MỘT bảng cho cả 5 vai trò, đúng theo TS (`Customer extends Account`).
--    Tách users/customers sẽ làm bookings.customer_id không biết trỏ vào đâu
--    khi lễ tân đặt hộ khách.
--
--    `email UNIQUE` + nhiều khách không có email: Postgres coi nhiều NULL là
--    khác nhau → để NULL, CẤM ghi chuỗi rỗng (bẫy #8 của ticket §6.7).
-- =============================================================================

CREATE TABLE public.accounts (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role          VARCHAR(20) NOT NULL DEFAULT 'customer',
    full_name     TEXT NOT NULL,
    phone         TEXT NOT NULL,
    email         TEXT,
    password_hash TEXT,                  -- NULL với khách đăng nhập OTP
    active        BOOLEAN NOT NULL DEFAULT TRUE,

    -- ---- chỉ có nghĩa với role='customer' (Customer extends Account) ----
    total_spent   DECIMAL(14,2) NOT NULL DEFAULT 0,
    stay_count    INT NOT NULL DEFAULT 0,
    internal_note TEXT,

    -- ---- chừa sẵn cho refresh token v1.1 (BE10 mục 2) — v1.0.0 LUÔN NULL ----
    refresh_token            TEXT,
    refresh_token_expires_at TIMESTAMPTZ,

    last_login_at TIMESTAMPTZ,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_accounts_phone UNIQUE (phone),   -- hồ sơ khách gộp theo SĐT (§B1)
    CONSTRAINT uq_accounts_email UNIQUE (email),
    CONSTRAINT chk_accounts_role CHECK (
        role IN ('owner','manager','receptionist','editor','customer')),
    -- Nhân viên bắt buộc có mật khẩu băm; khách đăng nhập OTP thì không
    CONSTRAINT chk_accounts_staff_pw CHECK (
        role = 'customer' OR password_hash IS NOT NULL),
    -- Chuỗi rỗng làm hỏng ngữ nghĩa "nhiều NULL là khác nhau" của UNIQUE
    CONSTRAINT chk_accounts_email_not_blank CHECK (email IS NULL OR length(email) > 0)
);

CREATE INDEX idx_accounts_role ON public.accounts (role, active);

CREATE TRIGGER trg_accounts_touch BEFORE UPDATE ON public.accounts
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();


-- =============================================================================
-- 10. bookings ⭐ — Booking (booking-types.ts:374). schema-mapping §9.7
-- =============================================================================

CREATE TABLE public.bookings (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- TEXT (không VARCHAR + CHECK regex ASCII) để chứa được 'Đ' của ĐH-2026-0042
    code          TEXT NOT NULL UNIQUE,
    property_id   TEXT NOT NULL DEFAULT 'nam-du-hill',   -- nợ T6: chưa multi-tenant

    room_type_id  TEXT NOT NULL REFERENCES public.room_types(id) ON DELETE RESTRICT,
    rate_plan_id  TEXT NOT NULL REFERENCES public.rate_plans(id) ON DELETE RESTRICT,

    check_in      DATE NOT NULL,
    check_out     DATE NOT NULL,
    nights        INT  NOT NULL,

    -- ---- GuestCount trải phẳng (schema-mapping §7) ----
    num_adults    INT   NOT NULL DEFAULT 1,
    child_ages    INT[] NOT NULL DEFAULT '{}',   -- TUỔI từng trẻ, không phải số lượng (§B2)

    addons        jsonb NOT NULL DEFAULT '{}'::jsonb,   -- Record<addonId, qty>

    -- ---- BookingGuest trải phẳng — lễ tân tìm đơn theo tên/SĐT/email hằng ngày ----
    guest_full_name              TEXT NOT NULL,
    guest_phone                  TEXT NOT NULL,
    guest_email                  TEXT NOT NULL,
    guest_id_number              TEXT,
    guest_estimated_arrival_time TEXT,           -- giờ tàu Rạch Giá — §B6
    guest_special_requests       TEXT,
    guest_tax_code               TEXT,
    guest_company_name           TEXT,

    customer_id   UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    channel       VARCHAR(20) NOT NULL DEFAULT 'web',

    status          VARCHAR(20) NOT NULL DEFAULT 'pending_payment',
    hold_expires_at TIMESTAMPTZ,

    -- ---- tiền: 4 con số + đã thu (§B1) ----
    subtotal        DECIMAL(12,2) NOT NULL,
    discount_total  DECIMAL(12,2) NOT NULL DEFAULT 0,
    total_amount    DECIMAL(12,2) NOT NULL,
    deposit_amount  DECIMAL(12,2) NOT NULL DEFAULT 0,
    paid_amount     DECIMAL(12,2) NOT NULL DEFAULT 0,
    -- Cột SINH, không ghi được → không thể lệch (Q5).
    -- ⚠️ BỎ khỏi mọi câu INSERT, kể cả seed (bẫy #3 của ticket §6.7).
    remaining_amount DECIMAL(12,2)
        GENERATED ALWAYS AS (total_amount - paid_amount) STORED,

    price_lines         jsonb NOT NULL DEFAULT '[]'::jsonb,  -- BookingPriceLine[]
    applied_promotions  jsonb NOT NULL DEFAULT '[]'::jsonb,  -- AppliedPromotion[]

    check_in_record     jsonb,                   -- CheckInRecord
    check_out_record    jsonb,                   -- CheckOutRecord (gồm incidentals[])
    cancellation        jsonb,                   -- {at,by,reason,refundAmount}

    -- Tách khỏi jsonb để index/FK được (schema-mapping §7)
    assigned_room_unit_id UUID REFERENCES public.room_units(id) ON DELETE SET NULL,
    cancelled_at          TIMESTAMPTZ,

    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_bookings_dates   CHECK (check_out > check_in),
    CONSTRAINT chk_bookings_nights  CHECK (nights = (check_out - check_in) AND nights > 0),
    CONSTRAINT chk_bookings_status  CHECK (status IN (
        'pending_payment','confirmed','checked_in','checked_out',
        'cancelled','no_show','expired')),
    CONSTRAINT chk_bookings_channel CHECK (channel IN ('web','phone','walk-in','ota')),
    CONSTRAINT chk_bookings_adults  CHECK (num_adults >= 1),
    -- Bốn con số tiền phải nhất quán (§B1)
    CONSTRAINT chk_bookings_money   CHECK (
        subtotal >= 0
        AND discount_total >= 0
        AND discount_total <= subtotal          -- luật: không bao giờ vượt subtotal
        AND total_amount = subtotal - discount_total
        AND deposit_amount >= 0 AND deposit_amount <= total_amount
        AND paid_amount >= 0),
    -- hold_expires_at chỉ có nghĩa khi đang chờ trả tiền (booking-types.ts:399).
    -- ⚠️ 200-04 khi xác nhận đơn phải SET hold_expires_at = NULL CÙNG LỆNH đổi
    --    status, nếu không CHECK này ném lỗi (bẫy #7 của ticket §6.7).
    CONSTRAINT chk_bookings_hold CHECK (
        hold_expires_at IS NULL OR status = 'pending_payment')
);

CREATE INDEX idx_bookings_status   ON public.bookings (status, check_in);
CREATE INDEX idx_bookings_dates    ON public.bookings (check_in, check_out);
CREATE INDEX idx_bookings_customer ON public.bookings (customer_id);
CREATE INDEX idx_bookings_phone    ON public.bookings (guest_phone);   -- tra cứu không cần login (F4)
CREATE INDEX idx_bookings_created  ON public.bookings (created_at DESC);
-- Cron nhả phòng quá hạn (200-05) quét đúng tập nhỏ này
CREATE INDEX idx_bookings_hold_expiry ON public.bookings (hold_expires_at)
    WHERE status = 'pending_payment';

CREATE TRIGGER trg_bookings_touch BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();


-- =============================================================================
-- 11. payments — Payment (booking-types.ts:324). schema-mapping §9.8
--
--    bookings.paid_amount = Σ payments kind ∈ (deposit,balance,surcharge)
--    trừ kind='refund'. BE cập nhật trong CÙNG transaction với INSERT payments;
--    không dùng cột sinh vì đây là tổng hợp qua bảng khác.
-- =============================================================================

CREATE TABLE public.payments (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id  UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    amount      DECIMAL(12,2) NOT NULL,
    method      VARCHAR(20) NOT NULL,
    kind        VARCHAR(20) NOT NULL,
    reference   TEXT,                    -- mã giao dịch cổng thanh toán
    note        TEXT,
    raw_payload jsonb,                   -- payload webhook, để đối soát (300-01)
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_payments_method CHECK (
        method IN ('bank-transfer','card','at-property','momo')),
    CONSTRAINT chk_payments_kind CHECK (
        kind IN ('deposit','balance','refund','surcharge')),
    -- refund là số DƯƠNG, dấu do `kind` mang; đừng lưu số âm
    CONSTRAINT chk_payments_amount CHECK (amount > 0)
);

CREATE INDEX idx_payments_booking ON public.payments (booking_id, at);
-- Chống ghi trùng khi webhook bắn lại cùng một giao dịch (300-01)
CREATE UNIQUE INDEX uq_payments_reference ON public.payments (reference)
    WHERE reference IS NOT NULL;

CREATE TRIGGER trg_payments_touch BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();


-- =============================================================================
-- 12. activity_logs — ActivityLog (booking-types.ts:456). BẤT BIẾN.
--     schema-mapping §9.9
--
--     KHÔNG có updated_at — CỐ Ý. Bảng này không bao giờ UPDATE.
--     Tính bất biến cưỡng chế bằng REVOKE UPDATE, DELETE ở file …000200.
--     ON DELETE RESTRICT: xoá đơn mà mất log là mất chính thứ cứu mình khi
--     tranh chấp với khách (BE5).
-- =============================================================================

CREATE TABLE public.activity_logs (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE RESTRICT,
    at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actor_id   TEXT NOT NULL,           -- TEXT: chứa được 'SYSTEM_CRON'
    actor_name TEXT NOT NULL,
    actor_role VARCHAR(20) NOT NULL,
    action     VARCHAR(30) NOT NULL,
    field      TEXT,
    "from"     TEXT,                    -- từ khoá SQL → phải trích dẫn
    "to"       TEXT,
    note       TEXT,
    -- Giữ cả old_data/new_data: backend.md BE5 ghi log dạng đó, TS chỉ có
    -- from/to chuỗi. Có cả hai thì cả hai cách ghi đều hợp lệ.
    old_data   jsonb,
    new_data   jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_logs_role CHECK (
        actor_role IN ('owner','manager','receptionist','editor','customer')),
    CONSTRAINT chk_logs_action CHECK (action IN (
        'created','status-changed','payment-recorded','checked-in','checked-out',
        'note-added','room-assigned','price-adjusted','cancelled'))
);

CREATE INDEX idx_logs_booking ON public.activity_logs (booking_id, at DESC);


-- =============================================================================
-- 13. notifications — Notification (booking-types.ts:508). schema-mapping §9.10
-- =============================================================================

CREATE TABLE public.notifications (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id   UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    kind         VARCHAR(30) NOT NULL,
    at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    read         BOOLEAN NOT NULL DEFAULT FALSE,
    booking_id   UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    booking_code TEXT,
    -- {roomTypeName, nights, amount} — core không chứa chuỗi UI.
    -- I18nText lồng ở đây do ứng dụng bảo đảm, domain không kiểm được.
    payload      jsonb,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_notifications_kind CHECK (kind IN (
        'booking-created','payment-success','booking-confirmed',
        'booking-cancelled','check-in-reminder','review-request'))
);

CREATE INDEX idx_notifications_unread ON public.notifications (account_id, read, at DESC);

CREATE TRIGGER trg_notifications_touch BEFORE UPDATE ON public.notifications
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();


-- =============================================================================
-- 14. booking_promotions — chỉ để đếm usage_limit / perCustomerLimit
--     schema-mapping §7 + §9.10
--
--     Ảnh chụp KM tại thời điểm đặt nằm ở bookings.applied_promotions jsonb
--     (admin sửa/xoá KM sau này thì breakdown cũ vẫn đúng nguyên văn).
--     Bảng này chỉ để promotion.ts:evaluatePromotion() đếm nhanh.
-- =============================================================================

CREATE TABLE public.booking_promotions (
    booking_id   UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    promotion_id TEXT NOT NULL REFERENCES public.promotions(id) ON DELETE RESTRICT,
    customer_id  UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    discount     DECIMAL(12,2) NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_booking_promotions PRIMARY KEY (booking_id, promotion_id),
    CONSTRAINT chk_booking_promotions_discount CHECK (discount >= 0)
);

CREATE INDEX idx_booking_promotions_cust ON public.booking_promotions (promotion_id, customer_id);


-- =============================================================================
-- 15. Nhóm nội dung marketing — DDL tối thiểu. schema-mapping §9.11
--
--     Cùng một khuôn: id/key TEXT PK, trường I18nText dùng domain i18n_text,
--     sort_order INT, active BOOLEAN, created_at, updated_at + trigger.
--     Mọi bảng ở đây có cột `active` vì file …000200 dùng `USING (active = TRUE)`.
-- =============================================================================

CREATE TABLE public.dining (
    id          TEXT PRIMARY KEY,
    name        public.i18n_text NOT NULL,
    description public.i18n_text NOT NULL,     -- Dining.desc
    note        public.i18n_text NOT NULL,
    image       TEXT,
    sort_order  INT NOT NULL DEFAULT 0,
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_dining_touch BEFORE UPDATE ON public.dining
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.tours (
    id          TEXT PRIMARY KEY,
    code        TEXT NOT NULL,
    name        public.i18n_text NOT NULL,
    summary     public.i18n_text NOT NULL,
    price       DECIMAL(12,2) NOT NULL DEFAULT 0,
    days        jsonb NOT NULL DEFAULT '[]'::jsonb,   -- TourDay[]
    sort_order  INT NOT NULL DEFAULT 0,
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_tours_price CHECK (price >= 0)
);
CREATE TRIGGER trg_tours_touch BEFORE UPDATE ON public.tours
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.places (
    id          TEXT PRIMARY KEY,
    name        public.i18n_text NOT NULL,
    tag         public.i18n_text NOT NULL,
    description public.i18n_text NOT NULL,     -- Place.desc
    image       TEXT,
    sort_order  INT NOT NULL DEFAULT 0,
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_places_touch BEFORE UPDATE ON public.places
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.gallery_items (
    id          TEXT PRIMARY KEY,
    title       public.i18n_text NOT NULL,
    subtitle    public.i18n_text NOT NULL,
    image       TEXT,
    sort_order  INT NOT NULL DEFAULT 0,
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_gallery_items_touch BEFORE UPDATE ON public.gallery_items
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- `icon` là TÊN icon (chuỗi), không phải JSX — core không chứa JSX (luật R2).
CREATE TABLE public.amenities (
    id          TEXT PRIMARY KEY,
    icon        TEXT NOT NULL,
    label       public.i18n_text NOT NULL,
    description public.i18n_text,                -- Amenity.desc — optional trong TS
    sort_order  INT NOT NULL DEFAULT 0,
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_amenities_touch BEFORE UPDATE ON public.amenities
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- `from_place` là I18nText: địa danh CÓ bản dịch, tên riêng thì không (types.ts:197).
CREATE TABLE public.reviews (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    from_place  public.i18n_text,
    date        DATE NOT NULL,                   -- nợ T3: TS để `string` không nói rõ format
    rating      INT NOT NULL,
    comment     public.i18n_text NOT NULL,
    avatar      TEXT,
    sort_order  INT NOT NULL DEFAULT 0,
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5)
);
CREATE TRIGGER trg_reviews_touch BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.explore_spots (
    id          TEXT PRIMARY KEY,
    name        public.i18n_text NOT NULL,
    dist        public.i18n_text NOT NULL,
    text        public.i18n_text NOT NULL,
    tip         public.i18n_text NOT NULL,
    sort_order  INT NOT NULL DEFAULT 0,
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_explore_spots_touch BEFORE UPDATE ON public.explore_spots
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.satellite_islands (
    id          TEXT PRIMARY KEY,
    name        public.i18n_text NOT NULL,
    badge       public.i18n_text NOT NULL,
    text        public.i18n_text NOT NULL,
    sort_order  INT NOT NULL DEFAULT 0,
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_satellite_islands_touch BEFORE UPDATE ON public.satellite_islands
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- PK là `key` theo TripPlan.key (types.ts:238).
CREATE TABLE public.trip_plans (
    key         TEXT PRIMARY KEY,
    name        public.i18n_text NOT NULL,
    legs        jsonb NOT NULL DEFAULT '[]'::jsonb,   -- ItineraryLeg[]
    costs       jsonb NOT NULL DEFAULT '[]'::jsonb,   -- CostItem[]
    total       TEXT NOT NULL,
    sort_order  INT NOT NULL DEFAULT 0,
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_trip_plans_touch BEFORE UPDATE ON public.trip_plans
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- PK là `key`; `items` là MenuItem[] (⚠️ MenuItem.id là number — nợ T4, nằm
-- trong jsonb nên không ảnh hưởng DB).
CREATE TABLE public.menu_categories (
    key         TEXT PRIMARY KEY,
    name        public.i18n_text NOT NULL,
    items       jsonb NOT NULL DEFAULT '[]'::jsonb,
    sort_order  INT NOT NULL DEFAULT 0,
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_menu_categories_touch BEFORE UPDATE ON public.menu_categories
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- `published_date` là DATE, không phải I18nText — nợ T1: TS BlogPost.date để
-- I18nText là sai kiểu, adapter format theo locale khi đọc. Không sửa TS ở đây.
CREATE TABLE public.blog_posts (
    id             TEXT PRIMARY KEY,
    category       public.i18n_text NOT NULL,
    title          public.i18n_text NOT NULL,
    lede           public.i18n_text NOT NULL,
    author         public.i18n_text NOT NULL,
    role           public.i18n_text NOT NULL,
    published_date DATE NOT NULL,
    read_min       INT NOT NULL DEFAULT 5,
    hero_slot      TEXT,
    hero_caption   public.i18n_text,
    tags           public.i18n_text_array NOT NULL DEFAULT '[]'::jsonb,
    blocks         jsonb NOT NULL DEFAULT '[]'::jsonb,   -- BlogBlock[]
    sort_order     INT NOT NULL DEFAULT 0,
    active         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_blog_posts_read_min CHECK (read_min >= 0)
);
CREATE INDEX idx_blog_posts_date ON public.blog_posts (published_date DESC);
CREATE TRIGGER trg_blog_posts_touch BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Faq (types.ts:291) không có `id` trong TS → PK sinh từ thứ tự khi seed.
CREATE TABLE public.faqs (
    id          TEXT PRIMARY KEY,
    question    public.i18n_text NOT NULL,       -- Faq.q
    answer      public.i18n_text NOT NULL,       -- Faq.a
    sort_order  INT NOT NULL DEFAULT 0,
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_faqs_touch BEFORE UPDATE ON public.faqs
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
