'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { defaultLocale, Locale, translations } from '../../i18n';

interface LanguageContextType {
    currentLocale: Locale;
    setCurrentLocale: (locale: Locale) => void;
    t: typeof translations[Locale];
    toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [currentLocale, setCurrentLocale] = useState<Locale>(defaultLocale);
    const t = translations[currentLocale];

    const toggleLanguage = () => {
        setCurrentLocale(currentLocale === 'vi' ? 'en' : 'vi');
    };

    return (
        <LanguageContext.Provider value={{
            currentLocale,
            setCurrentLocale,
            t,
            toggleLanguage
        }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}