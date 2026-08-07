'use client'

import { PlusIcon, PencilIcon, TrashIcon } from '@/components/icons'
import { useLocale } from '@/components/LocaleProvider'
import { tr } from '@/strings'
import { formatPrice, getPropertySync } from '@repo/core'
import type { Room } from '@repo/core'
import { Badge, Button, DataTable, Field, Modal } from '@repo/ui'
import { useState } from 'react'

export default function RoomSettingsPage() {
    const { locale } = useLocale()
    const property = getPropertySync()

    const [rooms, setRooms] = useState<Room[]>(property.rooms)
    const [search, setSearch] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingRoom, setEditingRoom] = useState<Room | null>(null)

    // Form Draft State
    const [nameVi, setNameVi] = useState('')
    const [nameEn, setNameEn] = useState('')
    const [price, setPrice] = useState(1200000)
    const [guests, setGuests] = useState(2)
    const [area, setArea] = useState('35 m²')

    const filteredRooms = rooms.filter((r) => {
        const query = search.toLowerCase()
        return (
            r.name.vi.toLowerCase().includes(query) ||
            r.name.en.toLowerCase().includes(query) ||
            r.id.toLowerCase().includes(query)
        )
    })

    const handleOpenModal = (room?: Room) => {
        if (room) {
            setEditingRoom(room)
            setNameVi(room.name.vi)
            setNameEn(room.name.en)
            setPrice(room.price)
            setGuests(room.guests)
            setArea(room.area)
        } else {
            setEditingRoom(null)
            setNameVi('')
            setNameEn('')
            setPrice(1500000)
            setGuests(2)
            setArea('35 m²')
        }
        setIsModalOpen(true)
    }

    const handleSave = () => {
        if (!nameVi.trim() || !nameEn.trim()) return

        if (editingRoom) {
            setRooms((prev) =>
                prev.map((r) =>
                    r.id === editingRoom.id
                        ? {
                            ...r,
                            name: { vi: nameVi, en: nameEn },
                            price,
                            guests,
                            area,
                        }
                        : r
                )
            )
        } else {
            const newRoom: Room = {
                id: `room-${Date.now()}`,
                name: { vi: nameVi, en: nameEn },
                desc: { vi: 'Hạng phòng cao cấp hướng biển', en: 'Luxury ocean view room' },
                price,
                guests,
                area,
                tags: [{ vi: 'Hướng biển', en: 'Sea view' }],
                remaining: 4,
            }
            setRooms((prev) => [newRoom, ...prev])
        }

        setIsModalOpen(false)
    }

    const handleDelete = (id: string) => {
        if (confirm(locale === 'vi' ? 'Xác nhận xóa hạng phòng này?' : 'Delete this room type?')) {
            setRooms((prev) => prev.filter((r) => r.id !== id))
        }
    }

    const totalUnitsCount = rooms.reduce((acc, r) => acc + (r.remaining || 4), 0)

    return (
        <div className="h-full flex flex-col min-h-0 bg-slate-100 p-2 gap-2 overflow-hidden">
            {/* KPI Cards Header */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 shrink-0">
                <div className="bg-white p-2.5 rounded border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            {locale === 'vi' ? 'Hạng phòng' : 'Room Types'}
                        </div>
                        <div className="text-lg font-extrabold text-slate-900 mt-0.5">{rooms.length} hạng</div>
                    </div>
                    <div className="w-8 h-8 rounded bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                        🏨
                    </div>
                </div>

                <div className="bg-white p-2.5 rounded border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            {locale === 'vi' ? 'Tổng số phòng' : 'Total Units'}
                        </div>
                        <div className="text-lg font-extrabold text-emerald-600 mt-0.5">{totalUnitsCount} phòng</div>
                    </div>
                    <div className="w-8 h-8 rounded bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                        🛏️
                    </div>
                </div>

                <div className="bg-white p-2.5 rounded border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            {locale === 'vi' ? 'Đang hoạt động' : 'Active Status'}
                        </div>
                        <div className="text-lg font-extrabold text-blue-600 mt-0.5">100% Sẵn sàng</div>
                    </div>
                    <div className="w-8 h-8 rounded bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                        ✅
                    </div>
                </div>

                <div className="bg-white p-2.5 rounded border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            {locale === 'vi' ? 'Giá thấp nhất' : 'Min Base Price'}
                        </div>
                        <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                            {formatPrice(Math.min(...rooms.map((r) => r.price)), locale)}
                        </div>
                    </div>
                    <div className="w-8 h-8 rounded bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
                        🏷️
                    </div>
                </div>
            </div>

            {/* Filter Toolbar & Actions */}
            <div className="bg-white p-2 rounded border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                    <Field
                        label={locale === 'vi' ? 'Tìm kiếm hạng phòng' : 'Search room type'}
                        placeholder={locale === 'vi' ? 'Tìm theo tên hạng phòng...' : 'Search room type...'}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Button onClick={() => handleOpenModal()}>
                        <PlusIcon size={16} />
                        <span>{locale === 'vi' ? '+ Thêm Hạng phòng mới' : '+ Add Room Type'}</span>
                    </Button>
                </div>
            </div>

            {/* Room Types Table */}
            <div className="flex-1 min-h-0 bg-white rounded border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <DataTable<Room>
                    data={filteredRooms}
                    rowKey={(r) => r.id}
                    columns={[
                        {
                            key: 'id',
                            header: 'MÃ HẠNG',
                            cell: (r) => (
                                <span className="font-mono text-xs font-bold text-slate-700">{r.id}</span>
                            ),
                        },
                        {
                            key: 'name',
                            header: 'TÊN HẠNG PHÒNG',
                            cell: (r) => (
                                <div>
                                    <div className="font-bold text-xs text-slate-900">{tr(r.name, locale)}</div>
                                    <div className="text-[10px] text-slate-400">{r.area} · Sức chứa {r.guests} khách</div>
                                </div>
                            ),
                        },
                        {
                            key: 'guests',
                            header: 'SỨC CHỨA',
                            cell: (r) => (
                                <span className="text-xs text-slate-700">
                                    👤 {r.guests} khách
                                </span>
                            ),
                        },
                        {
                            key: 'price',
                            header: 'GIÁ GỐC / ĐÊM',
                            align: 'right',
                            cell: (r) => (
                                <span className="font-extrabold text-xs text-slate-900 tabular-nums">
                                    {formatPrice(r.price, locale)}
                                </span>
                            ),
                        },
                        {
                            key: 'remaining',
                            header: 'SỐ PHÒNG VẬT LÝ',
                            align: 'center',
                            cell: (r) => (
                                <Badge tone="info">
                                    {r.remaining || 4} phòng
                                </Badge>
                            ),
                        },
                        {
                            key: 'status',
                            header: 'TRẠNG THÁI',
                            cell: () => <Badge tone="success">Đang kinh doanh</Badge>,
                        },
                        {
                            key: 'actions',
                            header: 'THAO TÁC',
                            align: 'right',
                            cell: (r) => (
                                <div className="flex items-center justify-end gap-1">
                                    <Button size="sm" variant="ghost" onClick={() => handleOpenModal(r)}>
                                        <PencilIcon size={14} />
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => handleDelete(r.id)}>
                                        <TrashIcon size={14} />
                                    </Button>
                                </div>
                            ),
                        },
                    ]}
                />
            </div>

            {/* Modal Create/Edit Room Type */}
            {isModalOpen && (
                <Modal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={editingRoom ? (locale === 'vi' ? 'Cập nhật Hạng phòng' : 'Edit Room Type') : (locale === 'vi' ? 'Thêm Hạng phòng mới' : 'Add New Room Type')}
                    footer={
                        <>
                            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                                {locale === 'vi' ? 'Hủy' : 'Cancel'}
                            </Button>
                            <Button onClick={handleSave}>
                                {locale === 'vi' ? 'Lưu Hạng Phòng' : 'Save Room Type'}
                            </Button>
                        </>
                    }
                >
                    <div className="space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                            <Field
                                label="Tên Hạng Phòng (Tiếng Việt)"
                                value={nameVi}
                                onChange={(e) => setNameVi(e.target.value)}
                                placeholder="Ví dụ: Deluxe Ocean View"
                                required
                            />
                            <Field
                                label="Tên Hạng Phòng (English)"
                                value={nameEn}
                                onChange={(e) => setNameEn(e.target.value)}
                                placeholder="Example: Deluxe Ocean View"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Field
                                label="Giá gốc 1 đêm (VNĐ)"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value) || 0)}
                                required
                            />
                            <Field
                                label="Số Khách tối đa"
                                type="number"
                                value={guests}
                                onChange={(e) => setGuests(Number(e.target.value) || 1)}
                                required
                            />
                        </div>

                        <Field
                            label="Diện tích hiển thị"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            placeholder="Ví dụ: 48 m²"
                        />
                    </div>
                </Modal>
            )}
        </div>
    )
}
