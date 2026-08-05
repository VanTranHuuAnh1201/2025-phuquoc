import type { ReactNode } from 'react'

/**
 * Bộ primitive dùng chung của mẫu 04.
 *
 * VÌ SAO GOM VÀO ĐÂY: P0 (Design System Integrity) và P7 (Component Language)
 * đòi MỘT vai trò một giá trị. Nếu mỗi section tự viết eyebrow/heading/nút thì
 * chỉ vài ngày là có bốn cỡ chữ eyebrow và ba kiểu nút. Gom lại thì cả HOME,
 * ROOMS và ROOM DETAIL cùng nói một thứ tiếng — và sửa một chỗ là đổi cả ba.
 *
 * Mọi giá trị hình ảnh đọc từ token (luật D0) — không có hex nào trong file.
 */

// ============================================================== khối bố cục

/** Bề rộng nội dung chuẩn của theme. */
export function Container({
    children,
    className = '',
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <div className={`mx-auto w-full max-w-[var(--container)] px-6 md:px-10 ${className}`}>
            {children}
        </div>
    )
}

/**
 * Một section với nhịp thở của theme.
 *
 * Nhịp: 80px trên mobile → 120px từ md → 160px từ lg (`--space-6/7/8`). Đây là
 * thang ĐÓNG của P5; section nào cũng lấy từ đây, không có `padding: 111px`.
 */
export function Section({
    id,
    children,
    tone = 'base',
    className = '',
}: {
    id?: string
    children: ReactNode
    /** Nền của section — ba lựa chọn, không hơn (P2). */
    tone?: 'base' | 'sand' | 'dark'
    className?: string
}) {
    const toneClass =
        tone === 'dark'
            ? 'bg-[var(--surface-dark)] text-text-inverse'
            : tone === 'sand'
              ? 'bg-[var(--surface-sand)] text-text-primary'
              : 'bg-surface-base text-text-primary'

    return (
        <section
            id={id}
            className={`py-[var(--space-6)] md:py-[var(--space-7)] lg:py-[var(--space-8)] ${toneClass} ${className}`}
        >
            {children}
        </section>
    )
}

// =============================================================== typography

/**
 * Nhãn nhỏ trên tiêu đề. Tracking rất rộng — dấu hiệu nhận dạng của theme.
 *
 * `--color-brand` chứ không phải accent: eyebrow xuất hiện ở MỌI section, mà
 * accent phải giữ dưới 10% diện tích (P2). Vàng chỉ dành cho CTA.
 */
export function Eyebrow({
    children,
    inverse = false,
}: {
    children: ReactNode
    inverse?: boolean
}) {
    return (
        <p
            className={`m-0 text-xs font-medium tracking-[0.28em] uppercase ${
                inverse ? 'text-[var(--accent)]' : 'text-brand'
            }`}
        >
            {children}
        </p>
    )
}

/**
 * Tiêu đề section — serif, nhẹ nét, cỡ 32px → 44px.
 *
 * `text-balance` để heading không rớt một từ xuống dòng riêng (orphan) — đúng
 * mục "Typography" của P12.
 */
export function SectionTitle({
    children,
    as: Tag = 'h2',
    className = '',
}: {
    children: ReactNode
    as?: 'h1' | 'h2' | 'h3'
    className?: string
}) {
    return (
        <Tag
            className={`m-0 font-display text-2xl leading-[1.15] font-normal tracking-[-0.01em] text-balance md:text-3xl ${className}`}
        >
            {children}
        </Tag>
    )
}

/** Đoạn dẫn dưới tiêu đề. Giới hạn 65ch theo P15 — đọc dài không mỏi mắt. */
export function Lede({
    children,
    className = '',
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <p
            className={`m-0 max-w-[var(--measure)] text-base leading-[var(--line-height-base)] text-text-secondary ${className}`}
        >
            {children}
        </p>
    )
}

/** Cụm eyebrow + tiêu đề + dẫn nhập — dùng ở đầu mọi section. */
export function SectionHeading({
    eyebrow,
    title,
    lede,
    inverse = false,
    align = 'left',
}: {
    eyebrow: string
    title: string
    lede?: string
    inverse?: boolean
    align?: 'left' | 'center'
}) {
    return (
        <header
            className={`flex flex-col gap-4 ${align === 'center' ? 'items-center text-center' : ''}`}
        >
            <Eyebrow inverse={inverse}>{eyebrow}</Eyebrow>
            <SectionTitle className={inverse ? 'text-text-inverse' : ''}>{title}</SectionTitle>
            {lede && (
                <Lede className={inverse ? 'text-[rgb(250_248_245/0.78)]' : ''}>{lede}</Lede>
            )}
        </header>
    )
}

// ==================================================================== nút

/**
 * CTA chính — nền vàng hoàng hôn, CHỮ TỐI.
 *
 * Chữ tối trên vàng cho 8.9:1 (AAA). Chữ trắng trên vàng chỉ được ~1.9:1 —
 * đó là cặp màu fail kinh điển mà P15 nhắm thẳng vào. Không đổi.
 *
 * Đủ 7 trạng thái theo D3/P7: default · hover · focus-visible · active ·
 * disabled · loading (nơi gọi truyền `disabled` khi chờ) · error (viền danger
 * do form bọc ngoài đặt). Target ≥ 44px chiều cao (P9).
 */
const BUTTON_BASE =
    'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius)] px-6 text-sm font-medium tracking-[0.08em] uppercase no-underline transition-[background-color,color,border-color] duration-[var(--motion-instant)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-55'

export const primaryButtonClass = `${BUTTON_BASE} border-none bg-[var(--accent)] text-text-primary hover:bg-[var(--accent-soft)] active:bg-[var(--accent)]`

/** Nút phụ — viền, không nền. Toàn site chỉ MỘT màu CTA chính (P2). */
export const ghostButtonClass = `${BUTTON_BASE} border border-solid border-[var(--border)] bg-transparent text-text-primary hover:border-[var(--brand)] hover:text-brand active:bg-[var(--brand-soft)]`

/** Nút phụ trên nền tối. */
export const ghostInverseButtonClass = `${BUTTON_BASE} border border-solid border-[rgb(250_248_245/0.34)] bg-transparent text-text-inverse hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-[var(--accent)]`

/**
 * Link văn bản có gạch chân mảnh — ngôn ngữ "khám phá tiếp" của theme.
 * Gạch chân luôn hiện (không chỉ khi hover): link phải nhận ra được mà không
 * cần rê chuột, và không được phân biệt chỉ bằng màu (D4).
 */
export const quietLinkClass =
    'inline-flex items-center gap-2 border-b border-solid border-[var(--border)] pb-1 text-sm font-medium tracking-[0.06em] text-brand uppercase no-underline transition-colors duration-[var(--motion-instant)] hover:border-[var(--brand)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand)]'

// ================================================================== ảnh

/**
 * Khung ảnh có tỷ lệ cố định.
 *
 * VÌ SAO BẮT BUỘC DÙNG: kho ảnh của resort trộn nhiều nguồn và nhiều tỷ lệ
 * (ảnh drone 16:9, ảnh phòng chụp điện thoại gần vuông, ảnh ghép marketing).
 * P6 cấm để sự pha trộn đó lộ ra. Ép mọi ảnh vào cùng một bộ tỷ lệ + cùng một
 * lớp phủ ấm là cách làm cho bộ ảnh trông như được chụp cùng một ngày.
 *
 * `data-decor="image"` để bài kiểm P13 (`?naked=1`) tắt được ảnh nền.
 */
export function Frame({
    src,
    alt,
    ratio = '4/5',
    className = '',
    priority = false,
    children,
}: {
    src: string
    alt: string
    /** Bộ tỷ lệ ĐÓNG — thêm tỷ lệ thứ tư phải có lý do, không tuỳ hứng. */
    ratio?: '4/5' | '16/9' | '21/9' | '1/1'
    className?: string
    priority?: boolean
    /** Nội dung đè lên ảnh — luôn nằm trong khối có scrim riêng. */
    children?: ReactNode
}) {
    const ratioClass =
        ratio === '16/9'
            ? 'aspect-[16/9]'
            : ratio === '21/9'
              ? 'aspect-[21/9]'
              : ratio === '1/1'
                ? 'aspect-square'
                : 'aspect-[4/5]'

    return (
        <figure
            data-decor="image"
            className={`relative m-0 overflow-hidden rounded-[var(--radius)] bg-[var(--surface-sand)] ${ratioClass} ${className}`}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={src}
                alt={alt}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
                fetchPriority={priority ? 'high' : 'auto'}
                className="absolute inset-0 h-full w-full object-cover"
            />
            {children}
        </figure>
    )
}

/**
 * Dải thông tin trên ảnh — nền gradient tối đủ dày để chữ trắng đạt AAA.
 *
 * Đây là câu trả lời cho P15: không bao giờ đặt chữ trần lên ảnh. Ảnh của Nam
 * Du có vùng trời rất sáng, chữ trắng trần lên đó là không đọc nổi.
 */
export function FrameCaption({ children }: { children: ReactNode }) {
    return (
        <figcaption className="absolute inset-x-0 bottom-0 bg-[image:var(--image-scrim)] px-5 pt-16 pb-5 text-text-inverse">
            {children}
        </figcaption>
    )
}

/** Cặp nhãn / giá trị — dùng ở thông số phòng và khối "cần biết". */
export function DataPair({
    label,
    value,
    inverse = false,
}: {
    label: string
    value: ReactNode
    inverse?: boolean
}) {
    return (
        <div className="flex flex-col gap-1">
            <dt
                className={`text-xs tracking-[0.16em] uppercase ${
                    inverse ? 'text-[rgb(250_248_245/0.66)]' : 'text-text-tertiary'
                }`}
            >
                {label}
            </dt>
            <dd
                className={`m-0 text-base font-medium ${
                    inverse ? 'text-text-inverse' : 'text-text-primary'
                }`}
            >
                {value}
            </dd>
        </div>
    )
}

/** Đường kẻ mảnh phân nhịp — thay cho việc đổ bóng để chia khối. */
export function Rule({ inverse = false }: { inverse?: boolean }) {
    return (
        <hr
            className={`m-0 h-px w-full border-none ${
                inverse ? 'bg-[rgb(250_248_245/0.18)]' : 'bg-[var(--border)]'
            }`}
        />
    )
}
