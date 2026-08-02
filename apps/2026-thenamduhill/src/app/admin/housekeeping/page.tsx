'use client'

/**
 * Buồng phòng — tình trạng từng phòng vật lý.
 *
 * Không có màn này thì lễ tân phải gọi điện hỏi buồng phòng xem phòng nào dọn
 * xong, và không gán được phòng lúc khách đến.
 */

import { useMemo, useState } from 'react'
import { getPropertySync, pick } from '@repo/core'
import type { RoomUnitStatus } from '@repo/core'
import { Badge, StatCard } from '@repo/ui'
import { useLocale } from '@/components/LocaleProvider'
import { useBookingStore } from '@/stores/booking.store'
import { S, tr, UNIT_STATUS_LABEL, UNIT_STATUS_TONE } from '@/strings'

/** Vòng chuyển tình trạng: bấm một phòng là sang bước tiếp theo. */
const NEXT_STATUS: Record<RoomUnitStatus, RoomUnitStatus> = {
    dirty: 'cleaning',
    cleaning: 'available',
    available: 'maintenance',
    maintenance: 'available',
    // Phòng đang có khách chỉ đổi qua luồng trả phòng, không bấm tay ở đây.
    occupied: 'occupied',
}

const ALL_STATUSES: RoomUnitStatus[] = [
    'available',
    'occupied',
    'dirty',
    'cleaning',
    'maintenance',
]

export default function HousekeepingPage() {
    const { locale } = useLocale()
    const roomUnits = useBookingStore((s) => s.roomUnits)
    const setUnitStatus = useBookingStore((s) => s.setUnitStatus)
    const property = getPropertySync()

    const [filter, setFilter] = useState<RoomUnitStatus | ''>('')

    const counts = useMemo(() => {
        const result = {} as Record<RoomUnitStatus, number>
        for (const status of ALL_STATUSES) result[status] = 0
        for (const unit of roomUnits) result[unit.status] += 1
        return result
    }, [roomUnits])

    const byRoomType = useMemo(() => {
        return property.rooms
            .map((room) => ({
                room,
                units: roomUnits.filter(
                    (u) => u.roomTypeId === room.id && (!filter || u.status === filter),
                ),
            }))
            .filter((group) => group.units.length > 0)
    }, [property.rooms, roomUnits, filter])

    return (
        <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
            <header>
                <h1 style={{ margin: 0, fontSize: 'var(--text-2xl)', fontFamily: 'var(--font-display)' }}>
                    {tr(S.housekeeping, locale)}
                </h1>
                <p style={{ margin: 'var(--space-2) 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                    {locale === 'vi'
                        ? 'Bấm vào một phòng để chuyển sang tình trạng tiếp theo. Phòng đang có khách chỉ đổi qua luồng trả phòng.'
                        : 'Click a room to move it to the next status. Occupied rooms change only through check-out.'}
                </p>
            </header>

            <div
                style={{
                    display: 'grid',
                    gap: 'var(--space-4)',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                }}
            >
                {ALL_STATUSES.map((status) => (
                    <button
                        key={status}
                        type="button"
                        onClick={() => setFilter(filter === status ? '' : status)}
                        aria-pressed={filter === status}
                        style={{
                            padding: 0,
                            background: 'transparent',
                            border: filter === status ? '2px solid var(--brand)' : '2px solid transparent',
                            borderRadius: 'var(--radius-lg)',
                            cursor: 'pointer',
                            textAlign: 'left',
                        }}
                    >
                        <StatCard
                            label={tr(UNIT_STATUS_LABEL[status], locale)}
                            value={counts[status]}
                            tone={
                                status === 'dirty' || status === 'cleaning'
                                    ? 'warning'
                                    : status === 'maintenance'
                                      ? 'danger'
                                      : status === 'available'
                                        ? 'success'
                                        : 'default'
                            }
                        />
                    </button>
                ))}
            </div>

            {byRoomType.map(({ room, units }) => (
                <section
                    key={room.id}
                    style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-5)',
                    }}
                >
                    <h2
                        style={{
                            margin: '0 0 var(--space-4)',
                            fontSize: 'var(--text-base)',
                            fontFamily: 'var(--font-display)',
                        }}
                    >
                        {pick(room.name, locale)}{' '}
                        <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>
                            ({units.length})
                        </span>
                    </h2>

                    <div
                        style={{
                            display: 'grid',
                            gap: 'var(--space-3)',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                        }}
                    >
                        {units.map((unit) => {
                            const locked = unit.status === 'occupied'
                            return (
                                <button
                                    key={unit.id}
                                    type="button"
                                    disabled={locked}
                                    onClick={() => setUnitStatus(unit.id, NEXT_STATUS[unit.status])}
                                    aria-label={`${unit.code}: ${tr(UNIT_STATUS_LABEL[unit.status], locale)}`}
                                    style={{
                                        padding: 'var(--space-3)',
                                        display: 'grid',
                                        gap: 'var(--space-2)',
                                        justifyItems: 'center',
                                        background: 'var(--surface)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius)',
                                        cursor: locked ? 'not-allowed' : 'pointer',
                                        opacity: locked ? 0.7 : 1,
                                        fontFamily: 'var(--font-body)',
                                    }}
                                >
                                    <strong style={{ fontSize: 'var(--text-base)' }}>{unit.code}</strong>
                                    <Badge tone={UNIT_STATUS_TONE[unit.status]}>
                                        {tr(UNIT_STATUS_LABEL[unit.status], locale)}
                                    </Badge>
                                </button>
                            )
                        })}
                    </div>
                </section>
            ))}

            {byRoomType.length === 0 && (
                <p
                    style={{
                        padding: 'var(--space-16)',
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        fontSize: 'var(--text-sm)',
                    }}
                >
                    {locale === 'vi'
                        ? 'Không có phòng nào ở tình trạng này. Bấm lại ô đã chọn để bỏ lọc.'
                        : 'No rooms in this status. Click the selected card again to clear the filter.'}
                </p>
            )}
        </div>
    )
}
