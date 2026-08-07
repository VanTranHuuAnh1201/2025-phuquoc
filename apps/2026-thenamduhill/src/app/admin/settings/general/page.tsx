'use client'

import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
    SettingsIcon,
} from '@/components/icons'
import { useLocale } from '@/components/LocaleProvider'
import { DataTable, useDataTable, type Column, Modal, Field, SelectField } from '@repo/ui'
import { useState } from 'react'

export interface BankConfigRowItem {
    id: string
    bankName: string
    accountNumber: string
    accountHolder: string
    branch: string
    qrProvider: 'vietqr' | 'momo' | 'vnpay'
    qrProviderLabel: string
    isDefault: boolean
    status: 'active' | 'inactive'
    statusLabel: string
}

const RESORT_BANKS: BankConfigRowItem[] = [
    {
        id: 'bnk-001',
        bankName: 'MBBank (Ngân hàng Quân Đội)',
        accountNumber: '9999202688',
        accountHolder: 'CÔNG TY TNHH KINH DOANH DU LỊCH NAM DU HILL',
        branch: 'CN Kiên Giang',
        qrProvider: 'vietqr',
        qrProviderLabel: 'VietQR Động',
        isDefault: true,
        status: 'active',
        statusLabel: 'Chính (Default)',
    },
    {
        id: 'bnk-002',
        bankName: 'Vietcombank (VCB)',
        accountNumber: '1029883344',
        accountHolder: 'NGUYỄN VĂN HẢI',
        branch: 'CN Rạch Giá',
        qrProvider: 'vietqr',
        qrProviderLabel: 'VietQR Tĩnh',
        isDefault: false,
        status: 'active',
        statusLabel: 'Dự phòng',
    },
    {
        id: 'bnk-003',
        bankName: 'Ví MoMo Business',
        accountNumber: '0912345678',
        accountHolder: 'Nam Du Hill Resort',
        branch: 'MoMo Gateway',
        qrProvider: 'momo',
        qrProviderLabel: 'Ví Điện Tử MoMo',
        isDefault: false,
        status: 'inactive',
        statusLabel: 'Tạm ngưng',
    },
]

export default function GeneralSettingsPage() {
    const { locale } = useLocale()
    const [banks, setBanks] = useState<BankConfigRowItem[]>(RESORT_BANKS)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    // Modal Create State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [bankName, setBankName] = useState('MBBank')
    const [accountNumber, setAccountNumber] = useState('')
    const [accountHolder, setAccountHolder] = useState('')
    const [branch, setBranch] = useState('')

    const columns: Column<BankConfigRowItem>[] = [
        {
            key: 'bankName',
            header: 'TÊN NGÂN HÀNG & CỔNG THANH TOÁN',
            width: '240px',
            sortable: true,
            cell: (row) => (
                <div>
                    <div className="font-bold text-xs text-slate-900">{row.bankName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Cổng: {row.qrProviderLabel}</div>
                </div>
            ),
        },
        {
            key: 'accountNumber',
            header: 'SỐ TÀI KHOẢN & CHỦ TÀI KHOẢN',
            cell: (row) => (
                <div>
                    <div className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block">
                        {row.accountNumber}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-900 mt-0.5">{row.accountHolder}</div>
                    <div className="text-[10px] text-slate-400">{row.branch}</div>
                </div>
            ),
        },
        {
            key: 'isDefault',
            header: 'CẤU HÌNH VIETQR',
            width: '180px',
            cell: (row) => (
                row.isDefault ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                        ⭐ Cấu hình Nhận cọc chính
                    </span>
                ) : (
                    <span className="text-xs text-slate-500">Tài khoản phụ</span>
                )
            ),
        },
        {
            key: 'status',
            header: 'TRẠNG THÁI',
            width: '140px',
            cell: (row) => {
                const statusStyles: Record<string, string> = {
                    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    inactive: 'bg-slate-100 text-slate-600 border-slate-200',
                }
                const dotStyles: Record<string, string> = {
                    active: 'bg-emerald-500',
                    inactive: 'bg-slate-400',
                }
                return (
                    <span className={`inline-flex items-center justify-start gap-1.5 px-2.5 py-1 text-xs font-semibold border rounded-[4px] w-[120px] text-left shrink-0 ${statusStyles[row.status] || 'bg-slate-100'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotStyles[row.status] || 'bg-slate-400'}`} />
                        <span className="truncate">{row.statusLabel}</span>
                    </span>
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
                            if (confirm('Xác nhận xóa tài khoản ngân hàng này?')) {
                                setBanks((prev) => prev.filter((b) => b.id !== row.id))
                            }
                        }}
                        className="p-1 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
                        title="Xóa tài khoản"
                    >
                        <TrashIcon size={16} />
                    </button>
                </div>
            ),
        },
    ]

    const filteredData = banks.filter((item) => {
        if (search) {
            const q = search.toLowerCase()
            const matchBank = item.bankName.toLowerCase().includes(q)
            const matchAcc = item.accountNumber.includes(q)
            const matchHolder = item.accountHolder.toLowerCase().includes(q)
            if (!matchBank && !matchAcc && !matchHolder) return false
        }
        if (statusFilter !== 'all' && item.status !== statusFilter) return false
        return true
    })

    const { tableProps } = useDataTable<BankConfigRowItem>({
        data: filteredData,
        columns,
        rowKey: (row) => row.id,
        selectable: true,
        pageSize: 10,
    })

    const handleReset = () => {
        setSearch('')
        setStatusFilter('all')
    }

    const handleCreateBank = () => {
        if (!accountNumber.trim() || !accountHolder.trim()) return
        const newBank: BankConfigRowItem = {
            id: `bnk-00${banks.length + 1}`,
            bankName,
            accountNumber,
            accountHolder: accountHolder.toUpperCase(),
            branch: branch || 'Chi nhánh Kiên Giang',
            qrProvider: 'vietqr',
            qrProviderLabel: 'VietQR Động',
            isDefault: false,
            status: 'active',
            statusLabel: 'Hoạt động',
        }
        setBanks([...banks, newBank])
        setIsModalOpen(false)
        setAccountNumber('')
        setAccountHolder('')
        setBranch('')
    }

    const stats = {
        total: filteredData.length,
        active: filteredData.filter((i) => i.status === 'active').length,
        defaultBank: filteredData.find((i) => i.isDefault)?.bankName || 'MBBank',
    }

    return (
        <div className="w-full flex-1 flex flex-col min-h-0 space-y-2 overflow-hidden">
            {/* Top Bar: Title + All Filters & Actions in Header (Today Format) */}
            <div className="w-full bg-white p-2 rounded-lg border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2 shrink-0">
                {/* Left: Title & Count */}
                <div className="flex items-center gap-2 shrink-0">
                    <h1 className="text-base font-bold text-slate-900 tracking-tight">
                        Cài đặt Ngân hàng & ZNS Thông báo
                    </h1>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        {stats.total} tài khoản
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
                            placeholder="Tìm số tài khoản, ngân hàng, tên chủ TK…"
                            className="w-full pl-7 pr-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800"
                        />
                        <div className="absolute left-2 top-1.5 text-slate-400">
                            <EyeIcon size={13} />
                        </div>
                    </div>

                    {/* Status Select */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Tạm ngưng</option>
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
                        <span>+ Thêm Tài Khoản Ngân Hàng</span>
                    </button>
                </div>
            </div>

            {/* KPI Statistics Summary Cards (Today Format) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0">
                {/* Total Stats */}
                <div className="bg-white p-2 rounded-sm border border-amber-200 shadow-sm flex flex-col justify-between">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        CỔNG THANH TOÁN
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">{stats.total} tài khoản</span>
                        <span className="text-[11px] font-semibold text-amber-700">VietQR Active</span>
                    </div>
                </div>

                {/* Active Stats */}
                <div className="bg-white p-2 rounded-sm border border-emerald-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                            ĐANG HOẠT ĐỘNG
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">{stats.active} cổng</span>
                        <span className="text-[11px] font-semibold text-emerald-700">Tự động đối soát</span>
                    </div>
                </div>

                {/* Default Bank Stats */}
                <div className="bg-white p-2 rounded-sm border border-blue-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">
                            TK NHẬN CỌC CHÍNH
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-xs font-bold text-slate-900 truncate">{stats.defaultBank}</span>
                        <span className="text-[11px] font-semibold text-blue-700">Mặc định</span>
                    </div>
                </div>

                {/* ZNS Notification Stats */}
                <div className="bg-white p-2 rounded-sm border border-purple-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider">
                            ZNS THÔNG BÁO ZALO
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-bold text-slate-900">Sẵn sàng</span>
                        <span className="text-[11px] font-semibold text-purple-700">Tự động gửi ZNS</span>
                    </div>
                </div>
            </div>

            {/* Table Container (Today Format) */}
            <div className="flex-1 min-h-0 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <DataTable<BankConfigRowItem> {...tableProps} />
            </div>

            {/* Modal Create Bank Config */}
            {isModalOpen && (
                <Modal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Cấu Hình Tài Khoản Ngân Hàng & VietQR"
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
                                onClick={handleCreateBank}
                                className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded"
                            >
                                Lưu Tài Khoản
                            </button>
                        </>
                    }
                >
                    <div className="space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                            <SelectField
                                label="Ngân hàng"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                            >
                                <option value="MBBank (Ngân hàng Quân Đội)">MBBank (Ngân hàng Quân Đội)</option>
                                <option value="Vietcombank (VCB)">Vietcombank (VCB)</option>
                                <option value="Techcombank (TCB)">Techcombank (TCB)</option>
                                <option value="ACB (Á Châu)">ACB (Á Châu)</option>
                                <option value="Ví MoMo Business">Ví MoMo Business</option>
                            </SelectField>
                            <Field
                                label="Số tài khoản"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                placeholder="Ví dụ: 9999202688"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Field
                                label="Tên chủ tài khoản (Viết hoa)"
                                value={accountHolder}
                                onChange={(e) => setAccountHolder(e.target.value)}
                                placeholder="Ví dụ: CONG TY TNHH NAM DU HILL"
                                required
                            />
                            <Field
                                label="Chi nhánh ngân hàng"
                                value={branch}
                                onChange={(e) => setBranch(e.target.value)}
                                placeholder="Ví dụ: Chi nhánh Kiên Giang"
                            />
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}
