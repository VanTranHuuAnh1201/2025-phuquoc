'use client'

/**
 * Ngôn ngữ đang chọn.
 *
 * Vì sao là context chứ không phải route `/vi`, `/en`: bản demo có 4 theme nhân
 * 2 ngôn ngữ; nhét locale vào đường dẫn sẽ thành `/vi/h1`, `/en/h1`… và làm
 * hỏng hợp đồng route `[theme]` hiện có. Khi lên production thật thì chuyển
 * sang route để SEO có `hreflang` đúng (xem `.claude/rules/app-flows.md` §F8).
 */

import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { DEFAULT_LOCALE, isLocale } from '@repo/core'
import type { Locale } from '@repo/core'

const STORAGE_KEY = 'namduhill.locale'

interface LocaleContextValue {
    locale: Locale
    setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue>({
    locale: DEFAULT_LOCALE,
    setLocale: () => {},
})

export function LocaleProvider({ children }: { children: ReactNode }) {
    // Khởi tạo bằng mặc định rồi mới đọc localStorage trong effect — đọc ngay ở
    // lần render đầu sẽ lệch với HTML server sinh ra (hydration mismatch).
    const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

    useEffect(() => {
        const saved = window.localStorage.getItem(STORAGE_KEY)
        if (saved && isLocale(saved)) setLocaleState(saved)
    }, [])

    useEffect(() => {
        document.documentElement.lang = locale
    }, [locale])

    const setLocale = (next: Locale) => {
        setLocaleState(next)
        window.localStorage.setItem(STORAGE_KEY, next)
    }

    return (
        <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>
    )
}

export function useLocale(): LocaleContextValue {
    return useContext(LocaleContext)
}
