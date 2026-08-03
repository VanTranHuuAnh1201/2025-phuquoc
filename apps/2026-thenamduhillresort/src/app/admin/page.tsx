'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    const isAuth = typeof window !== 'undefined' && localStorage.getItem('ndh_admin_authenticated') === 'true'
    if (isAuth) {
      router.replace('/admin/dashboard')
    } else {
      router.replace('/admin/login')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xs font-semibold">
      Đang chuyển hướng tới CMS Admin...
    </div>
  )
}
