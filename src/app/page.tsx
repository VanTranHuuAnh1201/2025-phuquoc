'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    // Get browser language preference
    const browserLang = navigator.language.split('-')[0]
    const supportedLocales = ['vi', 'en']
    const defaultLocale = 'vi'

    // Determine locale to redirect to
    const locale = supportedLocales.includes(browserLang) ? browserLang : defaultLocale

    // Redirect to localized version
    router.replace(`/${locale}`)
  }, [router])

  // Loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-lg">Đang chuyển hướng...</p>
      </div>
    </div>
  )
}
