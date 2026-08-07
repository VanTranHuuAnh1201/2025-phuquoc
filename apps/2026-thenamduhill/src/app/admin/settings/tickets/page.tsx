'use client'

import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    TicketIcon,
    EyeIcon,
} from '@/components/icons'
import { useLocale } from '@/components/LocaleProvider'
import { DataTable, useDataTable, type Column, Modal, Field, SelectField, TextAreaField } from '@repo/ui'
import { useState } from 'react'

export interface MaintenanceTicket {
    id: string
    code: string
    roomUnit: string
    category: 'electrical' | 'plumbing' | 'appliance' | 'internet' | 'other'
    categoryLabel: string
    title: string
    description: string
    priority: 'low' | 'medium' | 'high' | 'urgent'
    priorityLabel: string
    status: 'pending' | 'in_progress' | 'resolved'
    statusLabel: string
    reportedBy: string
    assignedTo: string
    createdAt: string
}

const RESORT_TICKETS: MaintenanceTicket[] = [
    {
        id: 'tck-001',
        code: 'TCK-2026-001',
        roomUnit: '102 (Bungalow Hill)',
        category: 'appliance',
        categoryLabel: 'Thiết bị điện lạnh',
        title: 'Máy lạnh không lạnh, rò rỉ nước',
        description: 'Khách phản ánh máy lạnh kêu to và rò rỉ nước ở cục lạnh.',
        priority: 'urgent',
        priorityLabel: 'Khẩn cấp 🚨',
        status: 'in_progress',
        statusLabel: 'Đang sửa chữa',
        reportedBy: 'Lê Văn Tùng (Lễ tân)',
        assignedTo: 'Nguyễn Văn Minh (Kỹ thuật)',
        createdAt: '06/08/2026 14:30',
    },
    {
        id: 'tck-002',
        code: 'TCK-2026-002',
        roomUnit: '201 (Deluxe Ocean)',
        category: 'plumbing',
        categoryLabel: 'Điện nước & Bồn tắm',
        title: 'Vòi sen bồn tắm bị nghẹt',
        description: 'Nước chảy rất yếu ở vòi sen bồn tắm.',
        priority: 'high',
        priorityLabel: 'Ưu tiên Cao',
        status: 'pending',
        statusLabel: 'Chờ tiếp nhận',
        reportedBy: 'Phạm Thu Hương (Buồng phòng)',
        assignedTo: 'Trần Văn Hoàng (Bảo trì)',
        createdAt: '06/08/2026 16:15',
    },
    {
        id: 'tck-003',
        code: 'TCK-2026-003',
        roomUnit: '305 (Villa Front Sea)',
        category: 'internet',
        categoryLabel: 'Mạng Wifi & TV',
        title: 'Mất kết nối Wifi phòng 305',
        description: 'Tín hiệu wifi chập chờn khi kết nối từ phòng ngủ.',
        priority: 'medium',
        priorityLabel: 'Trung bình',
        status: 'resolved',
        statusLabel: 'Đã hoàn thành',
        reportedBy: 'Hoàng Mai Chi (Lễ tân)',
        assignedTo: 'Đội IT Nam Du',
        createdAt: '05/08/2026 09:10',
    },
    {
        id: 'tck-004',
        code: 'TCK-2026-004',
        roomUnit: '104 (Bungalow Hill)',
        category: 'electrical',
        categoryLabel: 'Hệ thống điện',
        title: 'Hỏng ổ cắm điện đầu giường',
        description: 'Ổ cắm điện không có nguồn cấp.',
        priority: 'low',
        priorityLabel: 'Bình thường',
        status: 'pending',
        statusLabel: 'Chờ tiếp nhận',
        reportedBy: 'Nguyễn Văn Hải (Khách ở)',
        assignedTo: 'Chờ phân công',
        createdAt: '06/08/2026 18:00',
    },
]

export default function MaintenanceTicketsPage() {
    const { locale } = useLocale()
    const [tickets, setTickets] = useState<MaintenanceTicket[]>(RESORT_TICKETS)
    const [search, setSearch] = useState('')
    const [priorityFilter, setPriorityFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')

    // Modal Create State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [roomUnit, setRoomUnit] = useState('101 (Bungalow Hill)')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState<MaintenanceTicket['priority']>('medium')
    const [assignedTo, setAssignedTo] = useState('Nguyễn Văn Minh (Kỹ thuật)')

    const columns: Column<MaintenanceTicket>[] = [
        {
            key: 'code',
            header: 'MÃ TICKET',
            width: '130px',
            sortable: true,
            cell: (row) => (
                <span className="font-mono text-xs font-bold text-slate-800">{row.code}</span>
            ),
        },
        {
            key: 'roomUnit',
            header: 'PHÒNG VẬT LÝ',
            width: '180px',
            cell: (row) => (
                <span className="inline-flex items-center gap-1 font-semibold text-xs text-blue-800 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                    🛏️ {row.roomUnit}
                </span>
            ),
        },
        {
            key: 'title',
            header: 'NỘI DUNG SỰ CỐ & MÔ TẢ',
            cell: (row) => (
                <div>
                    <div className="font-bold text-xs text-slate-900">{row.title}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{row.description}</div>
                </div>
            ),
        },
        {
            key: 'priority',
            header: 'MỨC ĐỘ ƯU TIÊN',
            width: '140px',
            cell: (row) => {
                const toneMap: Record<string, string> = {
                    urgent: 'bg-rose-50 text-rose-700 border-rose-200',
                    high: 'bg-amber-50 text-amber-700 border-amber-200',
                    medium: 'bg-blue-50 text-blue-700 border-blue-200',
                    low: 'bg-slate-100 text-slate-700 border-slate-200',
                }
                const dotMap: Record<string, string> = {
                    urgent: 'bg-rose-500 animate-pulse',
                    high: 'bg-amber-500',
                    medium: 'bg-blue-500',
                    low: 'bg-slate-400',
                }
                return (
                    <span className={`inline-flex items-center justify-start gap-1.5 px-2.5 py-1 text-xs font-semibold border rounded-[4px] w-[120px] text-left shrink-0 ${toneMap[row.priority] || 'bg-slate-100'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotMap[row.priority]}`} />
                        <span className="truncate">{row.priorityLabel}</span>
                    </span>
                )
            },
        },
        {
            key: 'assignedTo',
            header: 'NGƯỜI XỬ LÝ',
            width: '180px',
            cell: (row) => (
                <div className="text-xs text-slate-700">
                    <div className="font-semibold text-slate-900">{row.assignedTo}</div>
                    <div className="text-[10px] text-slate-400">Báo bởi: {row.reportedBy}</div>
                </div>
            ),
        },
        {
            key: 'status',
            header: 'TRẠNG THÁI & CHUYỂN BƯỚC',
            width: '160px',
            align: 'right',
            cell: (row) => {
                const statusStyles: Record<string, string> = {
                    pending: 'bg-amber-50 text-amber-800 border-amber-300 font-bold',
                    in_progress: 'bg-blue-50 text-blue-800 border-blue-300 font-bold',
                    resolved: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold',
                }
                return (
                    <select
                        value={row.status}
                        onChange={(e) => {
                            const newStatus = e.target.value as MaintenanceTicket['status']
                            const labelMap = {
                                pending: 'Chờ tiếp nhận',
                                in_progress: 'Đang sửa chữa',
                                resolved: 'Đã hoàn thành',
                            }
                            setTickets((prev) =>
                                prev.map((t) => (t.id === row.id ? { ...t, status: newStatus, statusLabel: labelMap[newStatus] } : t))
                            )
                        }}
                        className={`text-xs px-2.5 py-1 rounded border focus:outline-none cursor-pointer ${statusStyles[row.status]}`}
                    >
                        <option value="pending">⏳ Chờ tiếp nhận</option>
                        <option value="in_progress">🛠️ Đang sửa chữa</option>
                        <option value="resolved">✅ Đã hoàn thành</option>
                    </select>
                )
            },
        },
        {
            key: 'action',
            header: 'THAO TÁC',
            align: 'right',
            width: '90px',
            cell: (row) => (
                <div className="flex items-center justify-end gap-1 text-slate-500">
                    <button
                        type="button"
                        onClick={() => {
                            if (confirm('Xác nhận xóa ticket này?')) {
                                setTickets((prev) => prev.filter((t) => t.id !== row.id))
                            }
                        }}
                        className="p-1 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
                        title="Xóa ticket"
                    >
                        <TrashIcon size={16} />
                    </button>
                </div>
            ),
        },
    ]

    const filteredData = tickets.filter((item) => {
        if (search) {
            const q = search.toLowerCase()
            const matchCode = item.code.toLowerCase().includes(q)
            const matchRoom = item.roomUnit.toLowerCase().includes(q)
            const matchTitle = item.title.toLowerCase().includes(q)
            if (!matchCode && !matchRoom && !matchTitle) return false
        }
        if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false
        if (statusFilter !== 'all' && item.status !== statusFilter) return false
        return true
    })

    const { tableProps } = useDataTable<MaintenanceTicket>({
        data: filteredData,
        columns,
        rowKey: (row) => row.id,
        selectable: true,
        pageSize: 10,
    })

    const handleReset = () => {
        setSearch('')
        setPriorityFilter('all')
        setStatusFilter('all')
    }

    const handleCreateTicket = () => {
        if (!title.trim()) return
        const newTicket: MaintenanceTicket = {
            id: `tck-00${tickets.length + 1}`,
            code: `TCK-2026-00${tickets.length + 1}`,
            roomUnit,
            category: 'appliance',
            categoryLabel: 'Thiết bị',
            title,
            description,
            priority,
            priorityLabel: priority === 'urgent' ? 'Khẩn cấp 🚨' : priority === 'high' ? 'Ưu tiên Cao' : 'Trung bình',
            status: 'pending',
            statusLabel: 'Chờ tiếp nhận',
            reportedBy: 'SuperAdmin (Owner)',
            assignedTo,
            createdAt: new Date().toLocaleDateString('vi-VN'),
        }
        setTickets([newTicket, ...tickets])
        setIsModalOpen(false)
        setTitle('')
        setDescription('')
    }

    const stats = {
        total: filteredData.length,
        pending: filteredData.filter((i) => i.status === 'pending').length,
        inProgress: filteredData.filter((i) => i.status === 'in_progress').length,
        urgent: filteredData.filter((i) => i.priority === 'urgent' || i.priority === 'high').length,
        resolved: filteredData.filter((i) => i.status === 'resolved').length,
    }

    return (
        <div className="w-full flex-1 flex flex-col min-h-0 space-y-2 overflow-hidden">
            {/* Top Bar: Title + All Filters & Actions in Header (Today Format) */}
            <div className="w-full bg-white p-2 rounded-lg border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2 shrink-0">
                {/* Left: Title & Count */}
                <div className="flex items-center gap-2 shrink-0">
                    <h1 className="text-base font-bold text-slate-900 tracking-tight">
                        Ticket Sự cố & Bảo trì
                    </h1>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        {stats.total} ticket
                    </span>
                </div>

                {/* Right: All Filters & Actions in Header */}
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                    {/* Search Field */}
                    <div className="relative w-44 sm:w-56">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm mã ticket, số phòng, nội dung…"
                            className="w-full pl-7 pr-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800"
                        />
                        <div className="absolute left-2 top-1.5 text-slate-400">
                            <EyeIcon size={13} />
                        </div>
                    </div>

                    {/* Priority Select */}
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    >
                        <option value="all">Tất cả mức ưu tiên</option>
                        <option value="urgent">🚨 Khẩn cấp</option>
                        <option value="high">Ưu tiên Cao</option>
                        <option value="medium">Trung bình</option>
                        <option value="low">Bình thường</option>
                    </select>

                    {/* Status Select */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="pending">⏳ Chờ tiếp nhận</option>
                        <option value="in_progress">🛠️ Đang sửa chữa</option>
                        <option value="resolved">✅ Đã hoàn thành</option>
                    </select>

                    {/* Reset Button */}
                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-2 py-1 text-xs text-amber-700 hover:text-amber-900 font-medium transition-colors"
                    >
                        Đặt lại
                    </button>

                    {/* Primary Action Button */}
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 text-xs font-bold rounded-md transition-all shadow-sm active:scale-[0.98] shrink-0 min-h-[32px]"
                    >
                        <PlusIcon size={14} />
                        <span>+ Báo Sự Cố Mới</span>
                    </button>
                </div>
            </div>

            {/* KPI Statistics Summary Cards (Today Format) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0">
                {/* Total Stats */}
                <div className="bg-white p-2 rounded-sm border border-amber-200 shadow-sm flex flex-col justify-between">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        TỔNG TICKET SỰ CỐ
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">{stats.total} ticket</span>
                        <span className="text-[11px] font-semibold text-amber-700">Hệ thống</span>
                    </div>
                </div>

                {/* Urgent Stats */}
                <div className="bg-white p-2 rounded-sm border border-rose-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider">
                            KHẨN CẤP / BÁO GẤP 🚨
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">{stats.urgent} sự cố</span>
                        <span className="text-[11px] font-semibold text-rose-600">Cần xử lý ngay</span>
                    </div>
                </div>

                {/* Pending Stats */}
                <div className="bg-white p-2 rounded-sm border border-amber-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">
                            CHỜ TIẾP NHẬN ⏳
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">{stats.pending} ticket</span>
                        <span className="text-[11px] font-semibold text-amber-700">Chờ phân công</span>
                    </div>
                </div>

                {/* In Progress Stats */}
                <div className="bg-white p-2 rounded-sm border border-blue-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">
                            ĐANG SỬA CHỮA 🛠️
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">{stats.inProgress} ticket</span>
                        <span className="text-[11px] font-semibold text-blue-700">Đang thực hiện</span>
                    </div>
                </div>
            </div>

            {/* Table Container (Today Format) */}
            <div className="flex-1 min-h-0 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <DataTable<MaintenanceTicket> {...tableProps} />
            </div>

            {/* Modal Create Ticket */}
            {isModalOpen && (
                <Modal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Tạo Ticket Sự Cố & Bảo Trì Mới"
                    footer={
                        <>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={handleCreateTicket}
                                className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded"
                            >
                                Tạo Ticket
                            </button>
                        </>
                    }
                >
                    <div className="space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                            <SelectField
                                label="Phòng vật lý bị ảnh hưởng"
                                value={roomUnit}
                                onChange={(e) => setRoomUnit(e.target.value)}
                            >
                                <option value="101 (Bungalow Hill)">Phòng 101 (Bungalow Hill)</option>
                                <option value="102 (Bungalow Hill)">Phòng 102 (Bungalow Hill)</option>
                                <option value="201 (Deluxe Ocean)">Phòng 201 (Deluxe Ocean)</option>
                                <option value="202 (Deluxe Ocean)">Phòng 202 (Deluxe Ocean)</option>
                                <option value="305 (Villa Front Sea)">Phòng 305 (Villa Front Sea)</option>
                            </SelectField>

                            <SelectField
                                label="Mức độ ưu tiên"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as MaintenanceTicket['priority'])}
                            >
                                <option value="low">Bình thường (Low)</option>
                                <option value="medium">Trung bình (Medium)</option>
                                <option value="high">Ưu tiên Cao (High)</option>
                                <option value="urgent">🚨 Khẩn cấp (Urgent)</option>
                            </SelectField>
                        </div>

                        <Field
                            label="Tiêu đề sự cố"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ví dụ: Máy lạnh hỏng, rò rỉ nước..."
                            required
                        />

                        <TextAreaField
                            label="Mô tả chi tiết sự cố"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ghi chú vị trí hoặc mô tả kỹ lưỡng hư hỏng..."
                        />

                        <SelectField
                            label="Phân công người xử lý"
                            value={assignedTo}
                            onChange={(e) => setAssignedTo(e.target.value)}
                        >
                            <option value="Nguyễn Văn Minh (Kỹ thuật)">Nguyễn Văn Minh (Kỹ thuật)</option>
                            <option value="Trần Văn Hoàng (Bảo trì)">Trần Văn Hoàng (Bảo trì)</option>
                            <option value="Đội IT Nam Du">Đội IT Nam Du</option>
                        </SelectField>
                    </div>
                </Modal>
            )}
        </div>
    )
}
