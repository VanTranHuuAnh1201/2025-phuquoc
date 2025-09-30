'use client';

import { createContext, useContext, useState } from 'react';
import { Locale, translations } from '../../i18n';

interface LanguageContextType {
    currentLocale: Locale;
    setCurrentLocale: (locale: Locale) => void;
    t: typeof translations[Locale];
    toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({
    children,
    initialLocale = 'vi',
}: {
    children: React.ReactNode;
    initialLocale?: string;
}) => {
    const [currentLocale, setCurrentLocale] = useState<Locale>(initialLocale as Locale);

    const toggleLanguage = () => {
        setCurrentLocale(currentLocale === 'vi' ? 'en' : 'vi');
    };

    const t = translations[currentLocale];

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
};

export function useLanguage(): LanguageContextType {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

