/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Supported locales
const locales = ['vi', 'en'] as const
const defaultLocale = 'vi' as const

function getLocale(request: NextRequest): string {
    // Check if there is any supported locale in the pathname
    const pathname = request.nextUrl.pathname
    const pathnameIsMissingLocale = locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    )

    // If path doesn't have locale, get from headers
    if (pathnameIsMissingLocale) {
        // Try to get locale from Accept-Language header
        const acceptLanguage = request.headers.get('accept-language')

        if (acceptLanguage) {
            // Simple language detection
            if (acceptLanguage.includes('vi')) return 'vi'
            if (acceptLanguage.includes('en')) return 'en'
        }

        return defaultLocale
    }

    // Extract locale from pathname
    const segments = pathname.split('/')
    const locale = segments[1]

    return locales.includes(locale as any) ? locale : defaultLocale
}

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

  // Skip middleware for API routes, static files, and internal paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

    // Check if there is any supported locale in the pathname
    const pathnameIsMissingLocale = locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    )

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
        const locale = getLocale(request)

        // Handle root path
        if (pathname === '/') {
            return NextResponse.redirect(new URL(`/${locale}`, request.url))
        }

        // Handle other paths
        return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
    }
}

export const config = {
    matcher: [
        // Skip all internal paths (_next)
        '/((?!_next|api|favicon.ico|admin).*)',
    ],
}
