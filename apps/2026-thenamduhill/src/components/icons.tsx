/**
 * Icon SVG.
 *
 * Không dùng emoji làm icon trong sản phẩm mới — emoji render khác nhau trên
 * từng hệ điều hành, không đổi màu theo token, và screen reader đọc thành câu
 * kỳ quặc. `apps/2025-phogroup` đang dùng emoji nhưng đó là vùng đóng băng,
 * không nhân rộng (xem `.claude/rules/design-tokens.md` §D5).
 *
 * Mọi icon `aria-hidden` — ý nghĩa nằm ở `aria-label` của nút bọc ngoài.
 */

interface IconProps {
    size?: number
}

function svgProps(size: number) {
    return {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
        'aria-hidden': true,
    }
}

export function UserIcon({ size = 20 }: IconProps) {
    return (
        <svg {...svgProps(size)}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    )
}

export function MenuIcon({ size = 20 }: IconProps) {
    return (
        <svg {...svgProps(size)}>
            <path d="M3 6h18" />
            <path d="M3 12h18" />
            <path d="M3 18h18" />
        </svg>
    )
}

export function PlusIcon({ size = 18 }: IconProps) {
    return (
        <svg {...svgProps(size)}>
            <path d="M12 5v14" />
            <path d="M5 12h14" />
        </svg>
    )
}

export function DownloadIcon({ size = 18 }: IconProps) {
    return (
        <svg {...svgProps(size)}>
            <path d="M12 3v12" />
            <path d="m7 10 5 5 5-5" />
            <path d="M4 20h16" />
        </svg>
    )
}

export function BellIcon({ size = 20 }: IconProps) {
    return (
        <svg {...svgProps(size)}>
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    )
}

export function EyeIcon({ size = 18 }: IconProps) {
    return (
        <svg {...svgProps(size)}>
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    )
}

export function PencilIcon({ size = 18 }: IconProps) {
    return (
        <svg {...svgProps(size)}>
            <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        </svg>
    )
}

export function TrashIcon({ size = 18 }: IconProps) {
    return (
        <svg {...svgProps(size)}>
            <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6" />
        </svg>
    )
}

export function CheckIcon({ size = 18 }: IconProps) {
    return (
        <svg {...svgProps(size)}>
            <path d="m20 6-11 11-5-5" />
        </svg>
    )
}

export function ChevronLeftIcon({ size = 18 }: IconProps) {
    return (
        <svg {...svgProps(size)}>
            <path d="m15 18-6-6 6-6" />
        </svg>
    )
}

export function ChevronRightIcon({ size = 18 }: IconProps) {
    return (
        <svg {...svgProps(size)}>
            <path d="m9 18 6-6-6-6" />
        </svg>
    )
}

/** Dùng chung cho cả hai hướng lên/xuống — xoay 180° bằng `className` ở nơi
 *  gọi (vd nút thu gọn MetricStrip) thay vì thêm một icon `ChevronUpIcon`
 *  trùng lặp hình học. */
export function ChevronDownIcon({ size = 18 }: IconProps) {
    return (
        <svg {...svgProps(size)}>
            <path d="m6 9 6 6 6-6" />
        </svg>
    )
}

export function CalendarIcon({ size = 20 }: IconProps) {
    return (
        <svg {...svgProps(size)}>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
    )
}

export function TagIcon({ size = 20 }: IconProps) {
    return (
        <svg {...svgProps(size)}>
            <path d="M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
            <circle cx="7" cy="7" r="1.5" />
        </svg>
    )
}

export function GridIcon({ size = 20 }: IconProps) {
    return (
        <svg {...svgProps(size)}>
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
    )
}

export function UsersIcon({ size = 20 }: IconProps) {
    return (
        <svg {...svgProps(size)}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}

export function BedIcon({ size = 20 }: IconProps) {
    return (
        <svg {...svgProps(size)}>
            <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8M2 16h20M2 20V6M6 10V7a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3" />
        </svg>
    )
}

export function FileTextIcon({ size = 20 }: IconProps) {
    return (
        <svg {...svgProps(size)}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
            <path d="M14 2v6h6M8 13h8M8 17h6" />
        </svg>
    )
}

export function ExternalIcon({ size = 18 }: IconProps) {
    return (
        <svg {...svgProps(size)}>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
        </svg>
    )
}

export function SettingsIcon({ size = 20 }: IconProps) {
    return (
        <svg {...svgProps(size)}>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
        </svg>
    )
}

export function TicketIcon({ size = 20 }: IconProps) {
    return (
        <svg {...svgProps(size)}>
            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
            <path d="M13 5v14M9 9h.01M9 15h.01" />
        </svg>
    )
}

export function BuildingIcon({ size = 20 }: IconProps) {
    return (
        <svg {...svgProps(size)}>
            <path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
            <path d="M16 9h2a2 2 0 0 1 2 2v10" />
            <path d="M2 21h20M8 7h.01M12 7h.01M8 11h.01M12 11h.01M8 15h.01M12 15h.01" />
        </svg>
    )
}

export function CheckCircleIcon({ size = 20 }: IconProps) {
    return (
        <svg {...svgProps(size)}>
            <circle cx="12" cy="12" r="9" />
            <path d="m8.5 12.5 2.5 2.5 4.5-5" />
        </svg>
    )
}

export function AlertTriangleIcon({ size = 20 }: IconProps) {
    return (
        <svg {...svgProps(size)}>
            <path d="M10.3 3.9 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
            <path d="M12 9v4M12 17h.01" />
        </svg>
    )
}

export function WrenchIcon({ size = 20 }: IconProps) {
    return (
        <svg {...svgProps(size)}>
            <path d="M14.7 6.3a4 4 0 0 0 5.1 5.1l-8.4 8.4a2.8 2.8 0 0 1-4-4l8.4-8.4a4 4 0 0 0-1.1-1.1Z" />
        </svg>
    )
}

export function ClockIcon({ size = 20 }: IconProps) {
    return (
        <svg {...svgProps(size)}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
        </svg>
    )
}

export function StarIcon({ size = 20 }: IconProps) {
    return (
        <svg {...svgProps(size)}>
            <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.4l6.1-.9Z" />
        </svg>
    )
}

export function SearchIcon({ size = 18 }: IconProps) {
    return (
        <svg {...svgProps(size)}>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
        </svg>
    )
}

export function CoinsIcon({ size = 20 }: IconProps) {
    return (
        <svg {...svgProps(size)}>
            <circle cx="9" cy="8" r="5" />
            <path d="M15.5 4.2a5 5 0 0 1 0 15.6M6 15.5v.5a5 5 0 0 0 10 0" />
        </svg>
    )
}
