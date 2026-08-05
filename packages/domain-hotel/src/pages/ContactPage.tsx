'use client'

import { useState, type CSSProperties, type FormEvent } from 'react'
import { pick, telHref, themeRoot, type Locale, type PropertyData } from '@repo/core'

import { Accordion } from '@repo/ui'
import { PageBody, PageFooter, PageHeader, PageHero } from '@repo/ui-layout'
import { defaultPageStrings, type PageStrings } from './strings'
import { shellPropsOf } from '../shell-adapter'

/**
 * Trang liên hệ — port từ `Contact - Nam Du Hill.dc.html`.
 *
 * Prototype chỉ có MỘT bản trang này, nên cả N mẫu dùng chung (luật R1).
 *
 * Bố cục bám sát prototype:
 *   hero 380px → lưới `1fr / 380px`: trái là biểu mẫu, phải là khối thông tin
 *   liên hệ → dải hỏi đáp → chân trang.
 *
 * Biểu mẫu CỐ Ý không gửi đi đâu — đây là bản demo, và luồng đặt phòng thật
 * nằm ở `/[theme]/rooms`. Nút bấm hiện thông báo thành công tại chỗ để trạng
 * thái `loading` và vùng `aria-live` vẫn kiểm chứng được (luật D3/D4).
 */

export interface ContactPageProps {
    data: PropertyData
    locale: Locale
    slug: string
    strings?: Record<Locale, PageStrings>
}

const SENT_MESSAGE: Record<Locale, string> = {
    vi: 'Đã ghi nhận. Bản demo chưa gửi dữ liệu đi đâu.',
    en: 'Received. This demo does not send the data anywhere.',
}

const REQUIRED_MESSAGE: Record<Locale, string> = {
    vi: 'Nhập họ tên và số điện thoại để chúng tôi gọi lại.',
    en: 'Enter your name and phone number so we can call you back.',
}

export function ContactPage({ data, locale, slug, strings }: ContactPageProps) {
    const t = (strings ?? defaultPageStrings)[locale]
    const { brand } = data

    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [status, setStatus] = useState<'idle' | 'error' | 'sent'>('idle')

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        // Thiếu trường bắt buộc thì báo bằng CHỮ, không chỉ đổi màu viền (luật D3).
        setStatus(name.trim() && phone.trim() ? 'sent' : 'error')
    }

    return (
        <PageBody theme={slug}>
            <PageHeader {...shellPropsOf(data, locale, slug, t)} />

            <PageHero
                title={t.contactTitle}
                sub={t.contactSub}
                crumbs={[{ label: t.home, href: themeRoot(slug) }, { label: t.contactPage }]}
                height={380}
            />

            <section
                id="contact"
                style={{
                    background: 'var(--surface)',
                    padding: 'var(--space-12) var(--space-6) var(--space-16)',
                    scrollMarginTop: '80px',
                }}
            >
                <div
                    className="ui-contact-grid"
                    style={{
                        maxWidth: 'var(--container)',
                        margin: '0 auto',
                        display: 'grid',
                        gap: 'var(--space-8)',
                        alignItems: 'start',
                    }}
                >
                    {/* ---- biểu mẫu ---- */}
                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        style={{
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: 'var(--space-6)',
                            background: 'var(--surface)',
                        }}
                    >
                        <h2 style={HEADING}>{t.formTitle}</h2>

                        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                            <TextRow
                                id="contact-name"
                                label={t.formName}
                                value={name}
                                onChange={setName}
                                required
                                invalid={status === 'error' && !name.trim()}
                            />
                            <TextRow
                                id="contact-phone"
                                label={t.formPhone}
                                type="tel"
                                value={phone}
                                onChange={setPhone}
                                required
                                invalid={status === 'error' && !phone.trim()}
                            />
                            <TextRow id="contact-email" label={t.formEmail} type="email" />

                            <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                                <label htmlFor="contact-message" style={LABEL}>
                                    {t.formMessage}
                                </label>
                                <textarea
                                    id="contact-message"
                                    rows={4}
                                    style={{ ...INPUT, resize: 'vertical', minHeight: 96 }}
                                />
                            </div>
                        </div>

                        {/* Vùng thông báo — screen reader đọc được khi trạng thái đổi. */}
                        <div
                            aria-live="polite"
                            style={{
                                minHeight: 22,
                                marginTop: 'var(--space-3)',
                                fontSize: 'var(--text-sm)',
                                fontWeight: 600,
                                color: status === 'error' ? 'var(--danger)' : 'var(--success)',
                            }}
                        >
                            {status === 'error' && REQUIRED_MESSAGE[locale]}
                            {status === 'sent' && SENT_MESSAGE[locale]}
                        </div>

                        <button
                            type="submit"
                            style={{
                                marginTop: 'var(--space-3)',
                                width: '100%',
                                padding: 'var(--space-3) var(--space-6)',
                                borderRadius: 'var(--radius-pill)',
                                border: 'none',
                                background: 'var(--accent)',
                                color: 'var(--text-inverse)',
                                fontSize: 'var(--text-sm)',
                                fontFamily: 'var(--font-body)',
                                fontWeight: 700,
                                cursor: 'pointer',
                                minHeight: 44,
                            }}
                        >
                            {t.formSubmit}
                        </button>

                        <p
                            style={{
                                marginTop: 'var(--space-3)',
                                marginBottom: 0,
                                fontSize: 'var(--text-xs)',
                                color: 'var(--text-muted)',
                                textAlign: 'center',
                            }}
                        >
                            {t.formNote}
                        </p>
                    </form>

                    {/* ---- thông tin liên hệ ---- */}
                    <aside style={{ display: 'grid', gap: 'var(--space-4)' }}>
                        <InfoCard title={t.addressTitle} body={pick(brand.address, locale)} />
                        <InfoCard
                            title={t.hotlineTitle}
                            body={brand.phone}
                            href={telHref(brand.phone)}
                        />
                        <InfoCard
                            title={t.emailTitle}
                            body={brand.email}
                            href={`mailto:${brand.email}`}
                        />
                        <InfoCard title={t.hoursTitle} body={t.hoursValue} />

                        {/* Bản đồ: ô giữ chỗ, chưa nhúng nhà cung cấp nào ở bản demo. */}
                        <div
                            style={{
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-lg)',
                                background: 'var(--surface-alt)',
                                minHeight: 200,
                                display: 'grid',
                                placeItems: 'center',
                                color: 'var(--text-muted)',
                                fontSize: 'var(--text-sm)',
                            }}
                        >
                            {t.mapTitle}
                        </div>
                    </aside>
                </div>
            </section>

            {/* ---- hỏi đáp ---- */}
            {data.faq.length > 0 && (
                <section
                    style={{
                        background: 'var(--surface-alt)',
                        padding: 'var(--space-16) var(--space-6)',
                    }}
                >
                    <div style={{ maxWidth: 760, margin: '0 auto' }}>
                        <h2 style={{ ...HEADING, textAlign: 'center', marginBottom: 'var(--space-6)' }}>
                            {t.faqTitle}
                        </h2>
                        <Accordion
                            items={data.faq.map((item, index) => ({
                                key: `faq-${index}`,
                                question: pick(item.q, locale),
                                answer: pick(item.a, locale),
                            }))}
                        />
                    </div>
                </section>
            )}

            <PageFooter {...shellPropsOf(data, locale, slug, t)} />

            <style>{`
                @media (min-width: 980px) {
                    .ui-contact-grid { grid-template-columns: minmax(0, 1fr) 380px; }
                }
            `}</style>
        </PageBody>
    )
}

// -------------------------------------------------------------------- phụ trợ

function TextRow({
    id,
    label,
    type = 'text',
    value,
    onChange,
    required,
    invalid,
}: {
    id: string
    label: string
    type?: string
    value?: string
    onChange?: (next: string) => void
    required?: boolean
    invalid?: boolean
}) {
    return (
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
            <label htmlFor={id} style={LABEL}>
                {label}
                {required && (
                    <span aria-hidden="true" style={{ color: 'var(--danger)' }}>
                        {' '}
                        *
                    </span>
                )}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                required={required}
                aria-invalid={invalid || undefined}
                onChange={onChange ? (e) => onChange(e.target.value) : undefined}
                style={{
                    ...INPUT,
                    borderColor: invalid ? 'var(--danger)' : 'var(--border-strong)',
                }}
            />
        </div>
    )
}

function InfoCard({ title, body, href }: { title: string; body: string; href?: string }) {
    return (
        <div
            style={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-5)',
                background: 'var(--surface)',
            }}
        >
            <div
                style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--brand)',
                    marginBottom: 'var(--space-2)',
                }}
            >
                {title}
            </div>
            {href ? (
                <a
                    href={href}
                    style={{
                        fontSize: 'var(--text-base)',
                        color: 'var(--text)',
                        textDecoration: 'none',
                        lineHeight: 1.6,
                    }}
                >
                    {body}
                </a>
            ) : (
                <div style={{ fontSize: 'var(--text-base)', color: 'var(--text)', lineHeight: 1.6 }}>
                    {body}
                </div>
            )}
        </div>
    )
}

const HEADING: CSSProperties = {
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--text-xl)',
    fontWeight: 800,
    color: 'var(--text)',
    margin: '0 0 var(--space-5)',
    letterSpacing: '-0.025em',
}

const LABEL: CSSProperties = {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--text)',
}

const INPUT: CSSProperties = {
    width: '100%',
    padding: 'var(--space-3) var(--space-4)',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border-strong)',
    background: 'var(--surface)',
    color: 'var(--text)',
    fontSize: 'var(--text-sm)',
    fontFamily: 'var(--font-body)',
    minHeight: 44,
}
