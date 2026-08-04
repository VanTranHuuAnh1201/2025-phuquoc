/**
 * Đầu section thống nhất cho cả trang Home — một giọng duy nhất (K1):
 * kicker chữ hoa xanh biển · tiêu đề Lora · tuỳ chọn link/hành động bên phải.
 *
 * Trang "rời rạc" phần lớn vì mỗi section tự trình bày đầu đề một kiểu;
 * component này là mô liên kết.
 */
export function SectionHead({
    kicker,
    title,
    lead,
    aside,
}: {
    kicker: string
    title: string
    lead?: string
    aside?: React.ReactNode
}) {
    return (
        <div
            className="h5-section-head"
            style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: 'var(--space-4)',
                flexWrap: 'wrap',
                marginBottom: 'var(--space-5)',
            }}
        >
            <div style={{ maxWidth: '62ch' }}>
                <p className="h5-kicker" style={{ margin: '0 0 var(--space-2)' }}>
                    {kicker}
                </p>
                <h2 className="h5-display" style={{ fontSize: 'var(--font-size-3xl)', margin: 0 }}>
                    {title}
                </h2>
                {lead && (
                    <p
                        style={{
                            margin: 'var(--space-3) 0 0',
                            color: 'var(--color-text-secondary)',
                        }}
                    >
                        {lead}
                    </p>
                )}
            </div>
            {aside && <div style={{ flexShrink: 0 }}>{aside}</div>}
        </div>
    )
}
