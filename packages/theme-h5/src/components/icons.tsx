/**
 * Bộ icon SVG của mẫu 05 — stroke 1.5, viewBox 24, ăn `currentColor`.
 *
 * Vì sao tự vẽ thay vì kéo thư viện: theme chỉ cần ~10 hình, và luật D5 cấm
 * emoji làm icon — một file SVG nội bộ rẻ hơn một dependency.
 */

interface IconProps {
    size?: number
    /** Icon trang trí mặc định ẩn với screen reader; truyền label khi icon đứng một mình. */
    label?: string
}

function Svg({ size = 20, label, children }: IconProps & { children: React.ReactNode }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden={label ? undefined : true}
            aria-label={label}
            role={label ? 'img' : undefined}
            style={{ flexShrink: 0 }}
        >
            {children}
        </svg>
    )
}

export function IconFerry(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M3 17c1 1 2.5 1 3.5 0s2.5-1 3.5 0 2.5 1 3.5 0 2.5-1 3.5 0 2.5 1 3.5 0" />
            <path d="M4 14l1.2-4.5A1 1 0 0 1 6.2 8.7H17.8a1 1 0 0 1 1 .8L20 14" />
            <path d="M9 8.5V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2.5" />
        </Svg>
    )
}

export function IconShuttle(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M4 16V8a2 2 0 0 1 2-2h9.5L20 10.5V16" />
            <path d="M4 16h16" />
            <circle cx="8" cy="17.5" r="1.5" />
            <circle cx="16" cy="17.5" r="1.5" />
            <path d="M13 6v4.5H20" />
        </Svg>
    )
}

export function IconHill(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M3 18L9.5 8l4 6 2.5-3.5L21 18Z" />
            <path d="M3 21h18" />
        </Svg>
    )
}

export function IconCheck(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M4.5 12.5l5 5 10-11" />
        </Svg>
    )
}

export function IconPhone(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M5 4h4l1.5 4.5L8 10a12 12 0 0 0 6 6l1.5-2.5L20 15v4a1 1 0 0 1-1 1A15 15 0 0 1 4 5a1 1 0 0 1 1-1Z" />
        </Svg>
    )
}

export function IconCalendar(props: IconProps) {
    return (
        <Svg {...props}>
            <rect x="4" y="5.5" width="16" height="15" rx="2" />
            <path d="M4 10h16M8 3.5v4M16 3.5v4" />
        </Svg>
    )
}

export function IconUsers(props: IconProps) {
    return (
        <Svg {...props}>
            <circle cx="9" cy="8" r="3.2" />
            <path d="M3.5 19.5c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" />
            <path d="M15.5 5.4a3.2 3.2 0 0 1 0 5.2M17.5 14.9c1.6.7 2.7 2.2 3 4.6" />
        </Svg>
    )
}

export function IconChevronDown(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M6 9.5l6 6 6-6" />
        </Svg>
    )
}

export function IconClose(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M6 6l12 12M18 6L6 18" />
        </Svg>
    )
}

export function IconWave(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M3 9c1.5 1.2 3.5 1.2 5 0s3.5-1.2 5 0 3.5 1.2 5 0 2-.8 3-.4" />
            <path d="M3 15c1.5 1.2 3.5 1.2 5 0s3.5-1.2 5 0 3.5 1.2 5 0 2-.8 3-.4" />
        </Svg>
    )
}

/** Logo chat Zalo tối giản — bong bóng thoại chữ Z. */
export function IconZalo(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M12 4C7 4 3.5 7.2 3.5 11.2c0 2.3 1.2 4.3 3 5.6L6 20l3.6-1.4c.8.2 1.6.3 2.4.3 5 0 8.5-3.2 8.5-7.2S17 4 12 4Z" />
            <path d="M9.5 9.5h5l-5 4.5h5" />
        </Svg>
    )
}

export function IconFacebook(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M14.5 8.5V7a1.5 1.5 0 0 1 1.5-1.5h1.5V3H15a4 4 0 0 0-4 4v1.5H9V11h2v9h3.5v-9H17l.5-2.5Z" />
        </Svg>
    )
}

export function IconTiktok(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M14.5 3v10.5a3.75 3.75 0 1 1-3.2-3.7" />
            <path d="M14.5 5.5c.8 1.8 2.3 3 4.5 3.2" />
        </Svg>
    )
}

export function IconYoutube(props: IconProps) {
    return (
        <Svg {...props}>
            <rect x="3" y="6.5" width="18" height="12" rx="3" />
            <path d="M10.5 10l4 2.5-4 2.5Z" />
        </Svg>
    )
}
