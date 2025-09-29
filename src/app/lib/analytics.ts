declare global {
    interface Window {
        gtag: (...args: unknown[]) => void;
    }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX';

export const pageview = (url: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', GA_TRACKING_ID, {
            page_location: url,
        });
    }
};

export const event = ({
    action,
    category,
    label,
    value,
}: {
    action: string;
    category: string;
    label?: string;
    value?: number;
}) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
};

export const trackBooking = (type: 'villa' | 'tour' | 'food', item: string, value: number) => {
    event({
        action: 'booking_attempted',
        category: `pho_${type}`,
        label: item,
        value: value,
    });
};

export const trackSearch = (query: string) => {
    event({
        action: 'search',
        category: 'user_interaction',
        label: query,
    });
};

export const trackLanguageChange = (language: string) => {
    event({
        action: 'language_change',
        category: 'user_preference',
        label: language,
    });
};