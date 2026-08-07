-- =============================================================================
-- 20260102000000_fn_create_booking_atomic.sql
--
-- Ticket 200-03 — Hàm atomic tạo đơn và chống đặt trùng (SELECT FOR UPDATE).
-- =============================================================================

CREATE OR REPLACE FUNCTION public.create_booking_atomic(p_payload jsonb)
RETURNS public.bookings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_room_type_id          TEXT;
    v_rate_plan_id          TEXT;
    v_check_in              DATE;
    v_check_out             DATE;
    v_nights                INT;
    v_num_adults            INT;
    v_child_ages            INT[];
    v_addons                jsonb;
    v_guest_full_name       TEXT;
    v_guest_phone           TEXT;
    v_guest_email           TEXT;
    v_guest_id_number       TEXT;
    v_guest_est_arrival     TEXT;
    v_guest_special_req     TEXT;
    v_guest_tax_code        TEXT;
    v_guest_company_name    TEXT;
    v_customer_id           UUID;
    v_channel               VARCHAR(20);
    v_actor_id              TEXT;
    v_actor_name            TEXT;
    v_actor_role            VARCHAR(20);
    v_subtotal              DECIMAL(12,2);
    v_discount_total        DECIMAL(12,2);
    v_total_amount          DECIMAL(12,2);
    v_deposit_amount        DECIMAL(12,2);
    v_price_lines           jsonb;
    v_applied_promotions    jsonb;
    v_hold_minutes          INT;

    v_code                  TEXT;
    v_hold_expires_at       TIMESTAMPTZ;
    v_default_units         INT;
    v_inv                   RECORD;
    v_booking               public.bookings;
    v_promo_item            jsonb;
    v_promo_id              TEXT;
    v_promo_discount        DECIMAL(12,2);
BEGIN
    -- Extract payload
    v_room_type_id        := p_payload->>'room_type_id';
    v_rate_plan_id        := p_payload->>'rate_plan_id';
    v_check_in            := (p_payload->>'check_in')::date;
    v_check_out           := (p_payload->>'check_out')::date;
    v_nights              := (v_check_out - v_check_in);
    v_num_adults          := COALESCE((p_payload->>'num_adults')::int, 1);
    
    IF p_payload->'child_ages' IS NOT NULL AND jsonb_typeof(p_payload->'child_ages') = 'array' THEN
        SELECT ARRAY(SELECT jsonb_array_elements_text(p_payload->'child_ages')::int) INTO v_child_ages;
    ELSE
        v_child_ages := '{}';
    END IF;

    v_addons              := COALESCE(p_payload->'addons', '{}'::jsonb);
    v_guest_full_name     := p_payload->>'guest_full_name';
    v_guest_phone         := p_payload->>'guest_phone';
    v_guest_email         := p_payload->>'guest_email';
    v_guest_id_number     := p_payload->>'guest_id_number';
    v_guest_est_arrival   := p_payload->>'guest_estimated_arrival_time';
    v_guest_special_req   := p_payload->>'guest_special_requests';
    v_guest_tax_code      := p_payload->>'guest_tax_code';
    v_guest_company_name  := p_payload->>'guest_company_name';
    
    IF p_payload->>'customer_id' IS NOT NULL AND p_payload->>'customer_id' != '' THEN
        v_customer_id := (p_payload->>'customer_id')::uuid;
    ELSE
        v_customer_id := NULL;
    END IF;

    v_channel             := COALESCE(p_payload->>'channel', 'web');
    v_actor_id            := COALESCE(p_payload->>'actor_id', 'SYSTEM');
    v_actor_name          := COALESCE(p_payload->>'actor_name', 'Customer');
    v_actor_role          := COALESCE(p_payload->>'actor_role', 'customer');
    
    v_subtotal            := (p_payload->>'subtotal')::decimal;
    v_discount_total      := COALESCE((p_payload->>'discount_total')::decimal, 0);
    v_total_amount        := (p_payload->>'total_amount')::decimal;
    v_deposit_amount      := COALESCE((p_payload->>'deposit_amount')::decimal, 0);
    v_price_lines         := COALESCE(p_payload->'price_lines', '[]'::jsonb);
    v_applied_promotions  := COALESCE(p_payload->'applied_promotions', '[]'::jsonb);
    v_hold_minutes        := COALESCE((p_payload->>'hold_minutes')::int, 15);

    -- ⑦a Tạo trước MỌI hàng inventory còn thiếu
    SELECT COALESCE(
        (SELECT COUNT(*) FROM public.room_units WHERE room_type_id = v_room_type_id AND status != 'maintenance'),
        2
    ) INTO v_default_units;
    IF v_default_units <= 0 THEN
        v_default_units := 2;
    END IF;

    INSERT INTO public.inventory (room_type_id, date, total_units, version)
    SELECT v_room_type_id, d::date, v_default_units, 1
    FROM generate_series(v_check_in, v_check_out - INTERVAL '1 day', '1 day'::interval) d
    ON CONFLICT (room_type_id, date) DO NOTHING;

    -- ⑦b Khoá các hàng inventory trong khoảng ngày theo thứ tự date
    PERFORM 1 FROM public.inventory
    WHERE room_type_id = v_room_type_id
      AND date >= v_check_in AND date < v_check_out
    ORDER BY date
    FOR UPDATE;

    -- ⑧ Kiểm tra tồn kho từng đêm
    FOR v_inv IN
        SELECT date, total_units, booked_units, blocked_units
        FROM public.inventory
        WHERE room_type_id = v_room_type_id
          AND date >= v_check_in AND date < v_check_out
    LOOP
        IF (v_inv.total_units - v_inv.booked_units - v_inv.blocked_units) < 1 THEN
            RAISE EXCEPTION 'SOLD_OUT' USING ERRCODE = 'P0001';
        END IF;
    END LOOP;

    -- ⑨ Sinh mã đơn và thời gian hết hạn hold
    v_code := public.next_booking_code();
    v_hold_expires_at := NOW() + (v_hold_minutes || ' minutes')::interval;

    -- Tạo đơn đặt phòng
    INSERT INTO public.bookings (
        code,
        room_type_id,
        rate_plan_id,
        check_in,
        check_out,
        nights,
        num_adults,
        child_ages,
        addons,
        guest_full_name,
        guest_phone,
        guest_email,
        guest_id_number,
        guest_estimated_arrival_time,
        guest_special_requests,
        guest_tax_code,
        guest_company_name,
        customer_id,
        channel,
        status,
        hold_expires_at,
        subtotal,
        discount_total,
        total_amount,
        deposit_amount,
        paid_amount,
        price_lines,
        applied_promotions
    ) VALUES (
        v_code,
        v_room_type_id,
        v_rate_plan_id,
        v_check_in,
        v_check_out,
        v_nights,
        v_num_adults,
        v_child_ages,
        v_addons,
        v_guest_full_name,
        v_guest_phone,
        v_guest_email,
        v_guest_id_number,
        v_guest_est_arrival,
        v_guest_special_req,
        v_guest_tax_code,
        v_guest_company_name,
        v_customer_id,
        v_channel,
        'pending_payment',
        v_hold_expires_at,
        v_subtotal,
        v_discount_total,
        v_total_amount,
        v_deposit_amount,
        0,
        v_price_lines,
        v_applied_promotions
    ) RETURNING * INTO v_booking;

    -- ⑩ UPDATE inventory: booked_units += 1 cho mọi đêm
    UPDATE public.inventory
    SET booked_units = booked_units + 1,
        version = version + 1
    WHERE room_type_id = v_room_type_id
      AND date >= v_check_in AND date < v_check_out;

    -- ⑪ Ghi booking_promotions và đếm usage_count
    IF jsonb_array_length(v_applied_promotions) > 0 THEN
        FOR v_promo_item IN SELECT * FROM jsonb_array_elements(v_applied_promotions)
        LOOP
            v_promo_id := v_promo_item->>'promotionId';
            v_promo_discount := COALESCE((v_promo_item->>'discount')::decimal, 0);

            IF v_promo_id IS NOT NULL AND v_promo_id != '' THEN
                INSERT INTO public.booking_promotions (booking_id, promotion_id, customer_id, discount)
                VALUES (v_booking.id, v_promo_id, v_customer_id, v_promo_discount)
                ON CONFLICT (booking_id, promotion_id) DO NOTHING;

                UPDATE public.promotions
                SET usage_count = usage_count + 1
                WHERE id = v_promo_id;
            END IF;
        END LOOP;
    END IF;

    -- ⑫ Ghi activity_logs (action='created') trong cùng transaction
    INSERT INTO public.activity_logs (
        booking_id,
        actor_id,
        actor_name,
        actor_role,
        action,
        note,
        new_data
    ) VALUES (
        v_booking.id,
        v_actor_id,
        v_actor_name,
        v_actor_role,
        'created',
        'Booking created via API',
        to_jsonb(v_booking)
    );

    RETURN v_booking;
END;
$$;

COMMENT ON FUNCTION public.create_booking_atomic(jsonb) IS 'Atomic booking creation with SELECT FOR UPDATE over inventory';
