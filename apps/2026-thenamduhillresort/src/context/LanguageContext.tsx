'use client'

import { pick, type I18nText, type Locale } from '@repo/core'
import React, { createContext, useContext, useState, ReactNode } from 'react'

type Language = Locale

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (vi: string, en?: string) => string
  /** Đọc một chuỗi song ngữ từ `@repo/core` theo ngôn ngữ đang chọn. */
  tx: (text: I18nText) => string
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'vi',
  setLanguage: () => {},
  t: (vi) => vi,
  tx: (text) => text.vi,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('vi')

  const t = (vi: string, en?: string) => {
    if (language === 'en' && en) {
      return en
    }
    return vi
  }

  const tx = (text: I18nText) => pick(text, language)

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tx }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
