-- Migration: RPCs for Booking Lifecycle Operations (Ticket 200-04)

CREATE OR REPLACE FUNCTION public.confirm_booking_payment(
    p_booking_id uuid,
    p_amount numeric,
    p_payment_method text,
    p_reference text,
    p_kind text,
    p_actor_id uuid,
    p_actor_name text,
    p_actor_role text,
    p_raw_payload jsonb DEFAULT '{}'::jsonb
) RETURNS public.bookings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_booking public.bookings%ROWTYPE;
    v_old_status text;
    v_new_status text;
BEGIN
    SELECT * INTO v_booking
    FROM public.bookings
    WHERE id = p_booking_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'BOOKING_NOT_FOUND' USING ERRCODE = 'P0002';
    END IF;

    v_old_status := v_booking.status;

    IF v_old_status = 'pending_payment' THEN
        v_new_status := 'confirmed';
    ELSE
        v_new_status := v_old_status;
    END IF;

    -- Record Payment
    INSERT INTO public.payments (booking_id, amount, method, kind, reference, raw_payload)
    VALUES (p_booking_id, p_amount, p_payment_method, p_kind, p_reference, p_raw_payload);

    -- Update Booking status & paid_amount, clear hold_expires_at
    UPDATE public.bookings
    SET status = v_new_status,
        paid_amount = paid_amount + p_amount,
        hold_expires_at = NULL,
        updated_at = NOW()
    WHERE id = p_booking_id
    RETURNING * INTO v_booking;

    -- Insert Activity Log for payment
    INSERT INTO public.activity_logs (
        booking_id,
        actor_id,
        actor_name,
        actor_role,
        action,
        field,
        "from",
        "to",
        note
    ) VALUES (
        p_booking_id,
        p_actor_id,
        p_actor_name,
        p_actor_role,
        'payment-recorded',
        'paid_amount',
        (v_booking.paid_amount - p_amount)::text,
        v_booking.paid_amount::text,
        'Payment recorded: ' || p_amount || ' (' || p_payment_method || ')'
    );

    -- If status changed, insert status-changed log
    IF v_old_status <> v_new_status THEN
        INSERT INTO public.activity_logs (
            booking_id,
            actor_id,
            actor_name,
            actor_role,
            action,
            field,
            "from",
            "to",
            note
        ) VALUES (
            p_booking_id,
            p_actor_id,
            p_actor_name,
            p_actor_role,
            'status-changed',
            'status',
            v_old_status,
            v_new_status,
            'Booking status changed to confirmed upon payment'
        );
    END IF;

    RETURN v_booking;
END;
$$;

-- Check-in RPC
CREATE OR REPLACE FUNCTION public.check_in_booking(
    p_booking_id uuid,
    p_room_unit_id uuid,
    p_check_in_record jsonb,
    p_actor_id uuid,
    p_actor_name text,
    p_actor_role text
) RETURNS public.bookings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_booking public.bookings%ROWTYPE;
    v_unit public.room_units%ROWTYPE;
    v_old_status text;
BEGIN
    -- 1. Lock booking
    SELECT * INTO v_booking
    FROM public.bookings
    WHERE id = p_booking_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'BOOKING_NOT_FOUND' USING ERRCODE = 'P0002';
    END IF;

    v_old_status := v_booking.status;
    IF v_old_status <> 'confirmed' THEN
        RAISE EXCEPTION 'INVALID_TRANSITION' USING ERRCODE = '22000';
    END IF;

    -- 2. Lock room unit
    SELECT * INTO v_unit
    FROM public.room_units
    WHERE id = p_room_unit_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'ROOM_UNIT_NOT_FOUND' USING ERRCODE = 'P0002';
    END IF;

    IF v_unit.room_type_id <> v_booking.room_type_id THEN
        RAISE EXCEPTION 'ROOM_UNIT_TYPE_MISMATCH' USING ERRCODE = '22000';
    END IF;

    IF v_unit.status <> 'available' THEN
        RAISE EXCEPTION 'ROOM_UNIT_TAKEN' USING ERRCODE = 'P0001';
    END IF;

    -- 3. Update room unit status to occupied
    UPDATE public.room_units
    SET status = 'occupied',
        updated_at = NOW()
    WHERE id = p_room_unit_id;

    -- 4. Update booking
    UPDATE public.bookings
    SET status = 'checked_in',
        assigned_room_unit_id = p_room_unit_id,
        check_in_record = p_check_in_record,
        updated_at = NOW()
    WHERE id = p_booking_id
    RETURNING * INTO v_booking;

    -- 5. Insert Activity Logs
    INSERT INTO public.activity_logs (
        booking_id, actor_id, actor_name, actor_role, action, field, "from", "to", note
    ) VALUES (
        p_booking_id, p_actor_id, p_actor_name, p_actor_role, 'room-assigned', 'assigned_room_unit_id', NULL, p_room_unit_id::text, 'Assigned room unit ' || v_unit.code
    );

    INSERT INTO public.activity_logs (
        booking_id, actor_id, actor_name, actor_role, action, field, "from", "to", note
    ) VALUES (
        p_booking_id, p_actor_id, p_actor_name, p_actor_role, 'status-changed', 'status', v_old_status, 'checked_in', 'Guest checked in'
    );

    RETURN v_booking;
END;
$$;

-- Check-out RPC
CREATE OR REPLACE FUNCTION public.check_out_booking(
    p_booking_id uuid,
    p_check_out_record jsonb,
    p_actor_id uuid,
    p_actor_name text,
    p_actor_role text
) RETURNS public.bookings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_booking public.bookings%ROWTYPE;
    v_old_status text;
    v_remaining numeric;
BEGIN
    SELECT * INTO v_booking
    FROM public.bookings
    WHERE id = p_booking_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'BOOKING_NOT_FOUND' USING ERRCODE = 'P0002';
    END IF;

    v_old_status := v_booking.status;
    IF v_old_status <> 'checked_in' THEN
        RAISE EXCEPTION 'INVALID_TRANSITION' USING ERRCODE = '22000';
    END IF;

    v_remaining := v_booking.total_amount - v_booking.paid_amount;
    IF v_remaining > 0 THEN
        RAISE EXCEPTION 'NOT_SETTLED:%', v_remaining USING ERRCODE = '22000';
    END IF;

    -- Update assigned room unit status to dirty if assigned
    IF v_booking.assigned_room_unit_id IS NOT NULL THEN
        UPDATE public.room_units
        SET status = 'dirty',
            updated_at = NOW()
        WHERE id = v_booking.assigned_room_unit_id;
    END IF;

    -- Update booking status to checked_out
    UPDATE public.bookings
    SET status = 'checked_out',
        check_out_record = p_check_out_record,
        updated_at = NOW()
    WHERE id = p_booking_id
    RETURNING * INTO v_booking;

    -- Update customer spent & stay count if customer_id is set
    IF v_booking.customer_id IS NOT NULL THEN
        UPDATE public.accounts
        SET stay_count = stay_count + 1,
            total_spent = total_spent + v_booking.paid_amount,
            updated_at = NOW()
        WHERE id = v_booking.customer_id;
    END IF;

    -- Insert Activity Log
    INSERT INTO public.activity_logs (
        booking_id, actor_id, actor_name, actor_role, action, field, "from", "to", note
    ) VALUES (
        p_booking_id, p_actor_id, p_actor_name, p_actor_role, 'status-changed', 'status', v_old_status, 'checked_out', 'Guest checked out'
    );

    RETURN v_booking;
END;
$$;

-- Cancel Booking RPC
CREATE OR REPLACE FUNCTION public.cancel_booking(
    p_booking_id uuid,
    p_reason text,
    p_actor_id uuid,
    p_actor_name text,
    p_actor_role text
) RETURNS public.bookings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_booking public.bookings%ROWTYPE;
    v_old_status text;
BEGIN
    SELECT * INTO v_booking
    FROM public.bookings
    WHERE id = p_booking_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'BOOKING_NOT_FOUND' USING ERRCODE = 'P0002';
    END IF;

    v_old_status := v_booking.status;

    IF v_old_status = 'checked_out' OR v_old_status = 'cancelled' OR v_old_status = 'no_show' OR v_old_status = 'expired' THEN
        RAISE EXCEPTION 'INVALID_TRANSITION' USING ERRCODE = '22000';
    END IF;

    -- Release room unit if occupied
    IF v_booking.assigned_room_unit_id IS NOT NULL THEN
        UPDATE public.room_units
        SET status = 'available',
            updated_at = NOW()
        WHERE id = v_booking.assigned_room_unit_id;
    END IF;

    -- Release inventory booked_units if old status held inventory
    IF v_old_status = 'pending_payment' OR v_old_status = 'confirmed' OR v_old_status = 'checked_in' THEN
        UPDATE public.inventory
        SET booked_units = GREATEST(booked_units - 1, 0),
            version = version + 1
        WHERE room_type_id = v_booking.room_type_id
          AND date >= v_booking.check_in
          AND date < v_booking.check_out;
    END IF;

    -- Update booking status to cancelled
    UPDATE public.bookings
    SET status = 'cancelled',
        cancelled_at = NOW(),
        cancellation = jsonb_build_object('reason', p_reason, 'by', p_actor_role, 'at', NOW()),
        hold_expires_at = NULL,
        updated_at = NOW()
    WHERE id = p_booking_id
    RETURNING * INTO v_booking;

    -- Insert Activity Log
    INSERT INTO public.activity_logs (
        booking_id, actor_id, actor_name, actor_role, action, field, "from", "to", note
    ) VALUES (
        p_booking_id, p_actor_id, p_actor_name, p_actor_role, 'status-changed', 'status', v_old_status, 'cancelled', COALESCE(p_reason, 'Booking cancelled')
    );

    RETURN v_booking;
END;
$$;

-- Refund Payment RPC
CREATE OR REPLACE FUNCTION public.refund_booking_payment(
    p_booking_id uuid,
    p_amount numeric,
    p_payment_method text,
    p_reference text,
    p_actor_id uuid,
    p_actor_name text,
    p_actor_role text
) RETURNS public.bookings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_booking public.bookings%ROWTYPE;
BEGIN
    SELECT * INTO v_booking
    FROM public.bookings
    WHERE id = p_booking_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'BOOKING_NOT_FOUND' USING ERRCODE = 'P0002';
    END IF;

    -- Record Refund Payment (positive amount, kind='refund')
    INSERT INTO public.payments (booking_id, amount, method, kind, reference)
    VALUES (p_booking_id, p_amount, p_payment_method, 'refund', p_reference);

    -- Update paid_amount
    UPDATE public.bookings
    SET paid_amount = GREATEST(paid_amount - p_amount, 0),
        updated_at = NOW()
    WHERE id = p_booking_id
    RETURNING * INTO v_booking;

    -- Insert Activity Log
    INSERT INTO public.activity_logs (
        booking_id, actor_id, actor_name, actor_role, action, field, "from", "to", note
    ) VALUES (
        p_booking_id, p_actor_id, p_actor_name, p_actor_role, 'refund-processed', 'paid_amount', (v_booking.paid_amount + p_amount)::text, v_booking.paid_amount::text, 'Refund processed: ' || p_amount
    );

    RETURN v_booking;
END;
$$;
