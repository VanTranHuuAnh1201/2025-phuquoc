/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                soft: '0 8px 24px rgba(0,0,0,.08)',
            }, spacing: {
                container: 'max(1rem, env(safe-area-inset-left))',
            },
            animation: {
                'fadeInUp': 'fadeInUp 0.6s ease-out forwards',
                'slideUp': 'slideUp 0.3s ease-out',
                'bounce-slow': 'bounce 2s infinite',
            },
            keyframes: {
                fadeInUp: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(30px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)'
                    }
                },
                slideUp: {
                    '0%': {
                        transform: 'translateY(100%)'
                    },
                    '100%': {
                        transform: 'translateY(0)'
                    }
                }
            },
        },
    },
    plugins: [],
}
