'use client'

/**
 * Hub "Cài đặt & Cấu hình" — điểm vào của 6 màn cấu hình dữ liệu gốc.
 *
 * Đây là màn ĐIỀU HƯỚNG (card → link), không phải bảng danh sách — không có
 * dữ liệu để đếm/lọc/phân trang nên §F6 (format bảng) không áp được nguyên
 * văn. Vẫn dùng `PageHeaderBar` cho hàng tiêu đề và tông màu/khoảng cách của
 * `@repo/cms-ui` để nhất quán với các màn Vận hành đã áp — card cấu hình đọc
 * token `--cms-*` giống hệt `DataGrid`/`KpiCard`, chỉ khác ở chỗ nội dung bên
 * trong là một liên kết thay vì một dòng dữ liệu.
 *
 * `DotBadge` dùng cho hai badge "Cơ sở"/"Bảo mật" — đúng D4 (chấm + chữ),
 * không còn `bg-slate-100 text-slate-700` tô tay của bản cũ.
 */

import { ChevronRightIcon, BedIcon, CoinsIcon, SettingsIcon, TagIcon, TicketIcon, UsersIcon } from '@/components/icons'
import Link from 'next/link'
import { DotBadge, PageHeaderBar, type CmsTone } from '@repo/cms-ui'
import { useLocale } from '@/components/LocaleProvider'
import { S, tr } from '@/strings'
import type { I18nText } from '@repo/core'

interface ConfigSection {
    id: string
    title: I18nText
    description: I18nText
    href: string
    icon: React.ReactNode
    badge?: { label: I18nText; tone: CmsTone }
}

const CONFIG_SECTIONS: ConfigSection[] = [
    {
        id: 'rooms',
        title: S.settingsSectionRoomsTitle,
        description: S.settingsSectionRoomsDesc,
        href: '/admin/settings/rooms',
        icon: <BedIcon size={20} />,
        badge: { label: S.settingsBadgeCore, tone: 'blue' },
    },
    {
        id: 'rate-plans',
        title: S.settingsSectionRatePlansTitle,
        description: S.settingsSectionRatePlansDesc,
        href: '/admin/settings/rate-plans',
        icon: <TagIcon size={20} />,
    },
    {
        id: 'addons',
        title: S.settingsSectionAddonsTitle,
        description: S.settingsSectionAddonsDesc,
        href: '/admin/settings/addons',
        icon: <CoinsIcon size={20} />,
    },
    {
        id: 'tickets',
        title: S.settingsSectionTicketsTitle,
        description: S.settingsSectionTicketsDesc,
        href: '/admin/settings/tickets',
        icon: <TicketIcon size={20} />,
    },
    {
        id: 'accounts',
        title: S.settingsSectionAccountsTitle,
        description: S.settingsSectionAccountsDesc,
        href: '/admin/settings/accounts',
        icon: <UsersIcon size={20} />,
        badge: { label: S.settingsBadgeSecurity, tone: 'amber' },
    },
    {
        id: 'general',
        title: S.settingsSectionGeneralTitle,
        description: S.settingsSectionGeneralDesc,
        href: '/admin/settings/general',
        icon: <SettingsIcon size={20} />,
    },
]

export default function SystemSetupHubPage() {
    const { locale } = useLocale()

    return (
        <div className="flex w-full flex-1 flex-col min-h-0 bg-[var(--cms-bg)]">
            {/* HÀNG 1: tiêu đề + đếm bên trái — khớp hình mẫu dashboard/customers.
                Không có nút hành động bên phải: hub này chỉ điều hướng, không
                có thao tác tạo mới cấp trang. */}
            <PageHeaderBar
                title={tr(S.settingsHubTitle, locale)}
                count={{ value: CONFIG_SECTIONS.length, suffix: tr({ vi: 'mục', en: 'items' }, locale) }}
            />

            {/* HÀNG 2: mô tả ngắn — thay cho hàng bộ lọc (không có gì để lọc ở
                một hub điều hướng), giữ border-t 1px phân tách đúng nhịp các
                màn khác. */}
            <div className="border-t border-[var(--cms-border)] px-[var(--cms-pad)] py-3">
                <p className="text-[length:var(--cms-text-body)] text-[var(--cms-text-muted)] max-w-2xl">
                    {tr(S.settingsHubDesc, locale)}
                </p>
            </div>

            {/* Lưới card cấu hình — chiếm hết phần còn lại, tự cuộn khi thấp.
                Mỗi card là MỘT LIÊN KẾT tới màn con, đúng vai trò "hub" — CMS
                quản nội dung/dữ liệu, không quản màn hình (§F5). */}
            <div className="flex-1 min-h-0 overflow-y-auto border-t border-[var(--cms-border)] px-[var(--cms-pad)] py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {CONFIG_SECTIONS.map((config) => (
                        <Link
                            key={config.id}
                            href={config.href}
                            className="group flex flex-col justify-between border border-[var(--cms-border)] rounded-[var(--cms-radius)] p-4 bg-[var(--cms-bg)] hover:border-[var(--cms-accent)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cms-accent)]"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 rounded-[var(--cms-radius-sm)] bg-[var(--cms-bg-subtle)] text-[var(--cms-text-muted)] group-hover:text-[var(--cms-accent)] transition-colors">
                                        {config.icon}
                                    </div>
                                    {config.badge && (
                                        <DotBadge tone={config.badge.tone} label={tr(config.badge.label, locale)} />
                                    )}
                                </div>

                                <h2 className="font-semibold text-[length:var(--cms-text-body)] text-[var(--cms-text)] group-hover:text-[var(--cms-accent)] transition-colors">
                                    {tr(config.title, locale)}
                                </h2>

                                <p className="mt-1 text-[length:var(--cms-text-meta)] text-[var(--cms-text-muted)] leading-relaxed">
                                    {tr(config.description, locale)}
                                </p>
                            </div>

                            <div className="mt-3 pt-3 border-t border-[var(--cms-border)] flex items-center justify-between text-[length:var(--cms-text-meta)] font-semibold text-[var(--cms-accent)]">
                                <span>{tr(S.settingsManageCta, locale)}</span>
                                <ChevronRightIcon size={14} />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
