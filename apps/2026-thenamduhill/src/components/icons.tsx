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
