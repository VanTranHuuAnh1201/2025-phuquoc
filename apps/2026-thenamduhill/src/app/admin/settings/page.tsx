'use client'

import {
    BedIcon,
    CoinsIcon,
    SettingsIcon,
    TagIcon,
    TicketIcon,
    UsersIcon,
} from '@/components/icons'
import Link from 'next/link'

interface ConfigSection {
    id: string
    title: string
    description: string
    href: string
    icon: React.ReactNode
    badge?: string
}

const CONFIG_SECTIONS: ConfigSection[] = [
    {
        id: 'rooms',
        title: 'Hạng Phòng & Số Hiệu Phòng Master',
        description: 'Tạo hạng phòng, gán số phòng vật lý (P.101, Villa 01), quản lý tầng và tình trạng thiết bị.',
        href: '/admin/settings/rooms',
        icon: <BedIcon size={24} />,
        badge: 'Cơ sở',
    },
    {
        id: 'rate-plans',
        title: 'Gói Giá & Chính Sách Đặt Phòng',
        description: 'Cấu hình gói giá (Rate Plan), tỷ lệ cọc %, điều kiện hoàn hủy và phụ thu người thứ 3.',
        href: '/admin/settings/rate-plans',
        icon: <TagIcon size={24} />,
    },
    {
        id: 'addons',
        title: 'Phụ Thu & Dịch Vụ Đi Kèm (Add-ons)',
        description: 'Danh mục dịch vụ thêm: Tour đảo Nam Du, Buffet hải sản, Đón bến tàu, BBQ ngoài trời.',
        href: '/admin/settings/addons',
        icon: <CoinsIcon size={24} />,
    },
    {
        id: 'tickets',
        title: 'Ticket Sự Cố & Bảo Trì Kỹ Thuật',
        description: 'Quản lý báo cáo sự cố phòng, lịch bảo trì máy lạnh, điện nước ca trực buồng phòng.',
        href: '/admin/settings/tickets',
        icon: <TicketIcon size={24} />,
    },
    {
        id: 'accounts',
        title: 'Tài Khoản Nhân Viên & Phân Quyền RBAC',
        description: 'Quản lý danh sách tài khoản lễ tân, quản lý, chủ cơ sở và phân quyền truy cập hệ thống.',
        href: '/admin/settings/accounts',
        icon: <UsersIcon size={24} />,
        badge: 'Bảo mật',
    },
    {
        id: 'general',
        title: 'Cài Đặt Ngân Hàng QR & ZNS Thông Báo',
        description: 'Cấu hình tài khoản VietQR nhận cọc tự động, mẫu tin nhắn Zalo ZNS và SMS xác nhận.',
        href: '/admin/settings/general',
        icon: <SettingsIcon size={24} />,
    },
]

export default function SystemSetupHubPage() {
    return (
        <div className="w-full flex-1 flex flex-col space-y-4 overflow-y-auto custom-scrollbar">
            {/* Header Banner */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                            <SettingsIcon size={18} />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-slate-900">
                                SYSTEM SETUP · BÀN CẤU HÌNH TỔNG QUAN HỆ THỐNG
                            </h1>
                            <p className="text-xs text-slate-500">
                                Quản lý master data cơ sở lưu trú, chính sách gói giá và cài đặt hệ thống Nam Du Hill
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded border border-slate-200">
                    Hệ thống: <span className="font-bold text-slate-800">Nam Du Hill Resort (Production)</span>
                </div>
            </div>

            {/* Config Hub Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {CONFIG_SECTIONS.map((config) => (
                    <Link
                        key={config.id}
                        href={config.href}
                        className="group bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2 bg-slate-50 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 rounded-md transition-colors">
                                    {config.icon}
                                </div>
                                {config.badge && (
                                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 rounded border border-slate-200">
                                        {config.badge}
                                    </span>
                                )}
                            </div>

                            <h2 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                                {config.title}
                            </h2>

                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                {config.description}
                            </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                            <span>Quản lý cài đặt →</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
