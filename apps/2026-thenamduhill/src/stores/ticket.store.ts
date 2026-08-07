'use client'

/**
 * Ticket sự cố & bảo trì (ticket `100-05` màn 2).
 *
 * Có `persist` — AC-2/AC-4 đòi "tạo thành công", nghĩa là F5 phải còn nguyên.
 * Trước đây dữ liệu nằm trong `useState` cục bộ nên tải lại trang là mất sạch.
 *
 * Không dùng chung `catalog.store`: ticket sự cố là dữ liệu VẬN HÀNH (sinh ra
 * hằng ngày, có vòng đời riêng), không phải dữ liệu nền cấu hình một lần —
 * một store, một lý do để thay đổi (luật C2/R11).
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TicketStatus = 'pending' | 'in_progress' | 'resolved'
export type TicketCategory = 'electrical' | 'plumbing' | 'appliance' | 'internet' | 'other'

export interface MaintenanceTicket {
    id: string
    code: string
    /** Số phòng vật lý, ví dụ "102 (Bungalow Hill)". */
    roomUnit: string
    category: TicketCategory
    /** Tiêu đề và mô tả do người báo tự gõ — dữ liệu người dùng nhập, không
     *  phải chuỗi giao diện, nên KHÔNG song ngữ (luật R6 áp cho chuỗi hệ thống). */
    title: string
    description: string
    priority: TicketPriority
    status: TicketStatus
    reportedBy: string
    assignedTo: string
    /** ISO timestamp (luật C6). */
    createdAt: string
}

/**
 * Trạng thái đi MỘT CHIỀU: chờ → đang sửa → hoàn thành.
 *
 * Cho nhảy tự do thì ticket "đã hoàn thành" quay lại "chờ tiếp nhận" mà không
 * ai biết vì sao — cùng nguyên tắc với vòng đời đơn ở `booking-domain.md §B1`.
 * Cho phép giữ nguyên trạng thái hiện tại (chọn lại chính nó).
 */
const TICKET_TRANSITIONS: Record<TicketStatus, readonly TicketStatus[]> = {
    pending: ['pending', 'in_progress'],
    in_progress: ['in_progress', 'resolved'],
    resolved: ['resolved'],
}

export function canTransitionTicket(from: TicketStatus, to: TicketStatus): boolean {
    return TICKET_TRANSITIONS[from].includes(to)
}

export function nextTicketStatuses(from: TicketStatus): readonly TicketStatus[] {
    return TICKET_TRANSITIONS[from]
}

export type TicketWriteError = 'not-found' | 'invalid-transition' | 'validation-failed'

const SEED_TICKETS: MaintenanceTicket[] = [
    {
        id: 'tck-001',
        code: 'TCK-2026-001',
        roomUnit: '102 (Bungalow Hill)',
        category: 'appliance',
        title: 'Máy lạnh không lạnh, rò rỉ nước',
        description: 'Khách phản ánh máy lạnh kêu to và rò rỉ nước ở cục lạnh.',
        priority: 'urgent',
        status: 'in_progress',
        reportedBy: 'Lê Văn Tùng (Lễ tân)',
        assignedTo: 'Nguyễn Văn Minh (Kỹ thuật)',
        createdAt: '2026-08-06T14:30:00.000Z',
    },
    {
        id: 'tck-002',
        code: 'TCK-2026-002',
        roomUnit: '201 (Deluxe Ocean)',
        category: 'plumbing',
        title: 'Vòi sen bồn tắm bị nghẹt',
        description: 'Nước chảy rất yếu ở vòi sen bồn tắm.',
        priority: 'high',
        status: 'pending',
        reportedBy: 'Phạm Thu Hương (Buồng phòng)',
        assignedTo: 'Trần Văn Hoàng (Bảo trì)',
        createdAt: '2026-08-06T16:15:00.000Z',
    },
    {
        id: 'tck-003',
        code: 'TCK-2026-003',
        roomUnit: '305 (Villa Front Sea)',
        category: 'internet',
        title: 'Mất kết nối Wifi phòng 305',
        description: 'Tín hiệu wifi chập chờn khi kết nối từ phòng ngủ.',
        priority: 'medium',
        status: 'resolved',
        reportedBy: 'Hoàng Mai Chi (Lễ tân)',
        assignedTo: 'Đội IT Nam Du',
        createdAt: '2026-08-05T09:10:00.000Z',
    },
    {
        id: 'tck-004',
        code: 'TCK-2026-004',
        roomUnit: '104 (Bungalow Hill)',
        category: 'electrical',
        title: 'Hỏng ổ cắm điện đầu giường',
        description: 'Ổ cắm điện không có nguồn cấp.',
        priority: 'low',
        status: 'pending',
        reportedBy: 'Nguyễn Văn Hải (Khách ở)',
        assignedTo: 'Chờ phân công',
        createdAt: '2026-08-06T18:00:00.000Z',
    },
]

export interface CreateTicketInput {
    roomUnit: string
    category: TicketCategory
    title: string
    description: string
    priority: TicketPriority
    assignedTo: string
    reportedBy: string
}

interface TicketState {
    tickets: MaintenanceTicket[]
    nextSequence: number

    createTicket: (input: CreateTicketInput) => TicketWriteError | null
    changeStatus: (id: string, to: TicketStatus) => TicketWriteError | null
    removeTicket: (id: string) => TicketWriteError | null
    resetTickets: () => void
}

export const useTicketStore = create<TicketState>()(
    persist(
        (set, get) => ({
            tickets: SEED_TICKETS,
            nextSequence: SEED_TICKETS.length + 1,

            createTicket: (input) => {
                // Kiểm lại ở store chứ không chỉ ở form: store là ranh giới ghi
                // duy nhất, `200-05` sẽ thay thân hàm bằng lời gọi API mà giữ
                // nguyên hợp đồng này (§6.10 của `100-04`).
                if (!input.title.trim() || !input.roomUnit.trim()) return 'validation-failed'

                const state = get()
                const seq = state.nextSequence
                set({
                    tickets: [
                        {
                            id: `tck-${String(seq).padStart(3, '0')}`,
                            code: `TCK-2026-${String(seq).padStart(3, '0')}`,
                            roomUnit: input.roomUnit,
                            category: input.category,
                            title: input.title.trim(),
                            description: input.description.trim(),
                            priority: input.priority,
                            status: 'pending',
                            reportedBy: input.reportedBy,
                            assignedTo: input.assignedTo,
                            createdAt: new Date().toISOString(),
                        },
                        ...state.tickets,
                    ],
                    nextSequence: seq + 1,
                })
                return null
            },

            changeStatus: (id, to) => {
                const state = get()
                const ticket = state.tickets.find((t) => t.id === id)
                if (!ticket) return 'not-found'
                if (!canTransitionTicket(ticket.status, to)) return 'invalid-transition'

                set({
                    tickets: state.tickets.map((t) => (t.id === id ? { ...t, status: to } : t)),
                })
                return null
            },

            removeTicket: (id) => {
                const state = get()
                if (!state.tickets.some((t) => t.id === id)) return 'not-found'
                set({ tickets: state.tickets.filter((t) => t.id !== id) })
                return null
            },

            resetTickets: () =>
                set({ tickets: SEED_TICKETS, nextSequence: SEED_TICKETS.length + 1 }),
        }),
        { name: 'namduhill.tickets', version: 1 },
    ),
)
