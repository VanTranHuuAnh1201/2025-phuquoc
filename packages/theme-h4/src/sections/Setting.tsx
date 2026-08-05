'use client'

import { useEffect, useRef, useState } from 'react'
import { pick, type Locale } from '@repo/core'

import { H4 } from '../strings'
import { Container, Eyebrow, Frame, Section, SectionTitle, ghostButtonClass } from './primitives'

/**
 * Section `about` — "Vị thế tĩnh lặng" + phim giới thiệu mở trong modal.
 *
 * VÌ SAO VIDEO NẰM TRONG MODAL, KHÔNG AUTOPLAY NỀN:
 *   1. Tốc độ — file mp4 của resort không nhỏ. Nhúng nền là kéo LCP xuống trên
 *      3G, mà đây là site khách đặt phòng từ điện thoại ngoài đảo.
 *   2. P8 — video tự chạy là chuyển động không ai yêu cầu, và không tắt được.
 *   3. P11 "Calm" — nền động sau chữ làm mắt không nghỉ.
 * Nên: một ảnh tĩnh + nút Play rõ ràng. `preload="none"` cho tới khi bấm.
 *
 * Bố cục hai cột so le: chữ bên trái nằm trên nền ngà (đọc AAA), ảnh bên phải
 * tràn ra mép phải của lưới. Trên mobile xếp dọc, ảnh trước chữ — vì ảnh là
 * thứ bán được câu chuyện, chữ là thứ xác nhận nó (P9).
 */

export interface SettingProps {
    locale: Locale
    /** Ảnh minh hoạ vị thế resort. Rỗng thì cột ảnh tự ẩn. */
    image?: string
    imageAlt?: string
    /** Phim giới thiệu. Rỗng thì ẩn nút Play, phần còn lại vẫn chạy. */
    videoSrc?: string
    /** Ảnh nền của khung video trước khi bấm play. */
    videoPoster?: string
}

export function Setting({ locale, image, imageAlt, videoSrc, videoPoster }: SettingProps) {
    const [playing, setPlaying] = useState(false)
    const closeRef = useRef<HTMLButtonElement>(null)

    // Esc để đóng — modal nào cũng phải có, không riêng modal này (D4).
    useEffect(() => {
        if (!playing) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setPlaying(false)
        }
        document.addEventListener('keydown', onKey)
        // Khoá cuộn nền: cuộn trang phía sau khi modal mở là mất phương hướng.
        const previous = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        closeRef.current?.focus()
        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = previous
        }
    }, [playing])

    return (
        <Section id="about" tone="base">
            <Container>
                <div className="grid items-center gap-[var(--space-6)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-[var(--space-7)]">
                    {/* ---------------------------------------------- cột chữ */}
                    <div className="h4-reveal order-2 flex flex-col gap-6 lg:order-1">
                        <Eyebrow>{pick(H4.aboutEyebrow, locale)}</Eyebrow>
                        <SectionTitle>{pick(H4.aboutTitle, locale)}</SectionTitle>

                        {/* 65ch — đọc 2–3 phút không mỏi (P15). */}
                        <p className="m-0 max-w-[var(--measure)] text-lg leading-[var(--line-height-base)] text-text-secondary">
                            {pick(H4.aboutBody, locale)}
                        </p>
                        <p className="m-0 max-w-[var(--measure)] text-base leading-[var(--line-height-base)] text-text-secondary">
                            {pick(H4.aboutBody2, locale)}
                        </p>

                        {videoSrc && (
                            <div className="mt-2">
                                <button
                                    type="button"
                                    onClick={() => setPlaying(true)}
                                    className={ghostButtonClass}
                                >
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                    {pick(H4.watchFilm, locale)}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ---------------------------------------------- cột ảnh */}
                    {image && (
                        <div className="order-1 lg:order-2">
                            <Frame
                                src={image}
                                alt={imageAlt ?? pick(H4.aboutTitle, locale)}
                                ratio="4/5"
                            />
                        </div>
                    )}
                </div>
            </Container>

            {/* ------------------------------------------------- modal video */}
            {playing && videoSrc && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={pick(H4.filmLabel, locale)}
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgb(12_28_36/0.94)] p-4"
                    onClick={() => setPlaying(false)}
                >
                    <button
                        ref={closeRef}
                        type="button"
                        onClick={() => setPlaying(false)}
                        aria-label={pick(H4.closeFilm, locale)}
                        className="absolute top-5 right-5 flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-[var(--radius)] border border-solid border-[rgb(250_248_245/0.3)] bg-transparent text-text-inverse transition-colors duration-[var(--motion-instant)] hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path
                                d="M18 6 6 18M6 6l12 12"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>

                    {/* Bấm vào chính video thì không đóng — chỉ bấm ra nền mới đóng. */}
                    {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                    <video
                        src={videoSrc}
                        poster={videoPoster}
                        controls
                        autoPlay
                        playsInline
                        preload="none"
                        onClick={(e) => e.stopPropagation()}
                        className="max-h-[82svh] w-full max-w-[1100px] rounded-[var(--radius)] bg-black"
                    />
                </div>
            )}
        </Section>
    )
}
