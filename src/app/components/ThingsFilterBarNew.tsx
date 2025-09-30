'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import FilterModal from './FilterModal'

function formatDateLabel(date?: string) {
    if (!date) return 'Ngày'
    try {
        const d = new Date(date)
        const dd = d.getDate().toString().padStart(2, '0')
        const mm = (d.getMonth() + 1).toString().padStart(2, '0')
        return `${dd}/${mm}`
    } catch {
        return 'Ngày'
    }
}

export default function ThingsFilterBar() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const selectedCats = useMemo(() => (searchParams.get('cats')?.split(',').filter(Boolean) ?? []), [searchParams])
    const selectedDate = searchParams.get('date') ?? undefined
    const selectedPrice = searchParams.get('price') ?? undefined
    const selectedRating = searchParams.get('rating') ?? undefined

    const [showFilterModal, setShowFilterModal] = useState(false)

    const updateParams = (next: { cats?: string[]; date?: string | undefined; price?: string | undefined; rating?: string | undefined }) => {
        const params = new URLSearchParams(searchParams.toString())
        if ('cats' in next) {
            if (next.cats?.length) params.set('cats', Array.from(new Set(next.cats)).join(','))
            else params.delete('cats')
        }
        if ('date' in next) {
            if (next.date) params.set('date', next.date)
            else params.delete('date')
        }
        if ('price' in next) {
            if (next.price) params.set('price', next.price)
            else params.delete('price')
        }
        if ('rating' in next) {
            if (next.rating) params.set('rating', next.rating)
            else params.delete('rating')
        }
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }

    const onDateChange = (val: string) => {
        updateParams({ date: val || undefined })
    }

    const clearDate = () => updateParams({ date: undefined })

    const countSelected = selectedCats.length + (selectedPrice ? 1 : 0) + (selectedRating ? 1 : 0)

    const handleApplyFilters = (filters: { cats: string[]; price?: string; rating?: string }) => {
        updateParams(filters)
    }

    return (
        <>
            <div className="bg-gradient-to-r from-orange-50 via-pink-50 to-purple-50 border-b border-orange-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Date Filter */}
                        <div className="relative">
                            <label className="inline-flex items-center gap-2 px-4 py-3 border-2 border-white bg-white/80 backdrop-blur-sm rounded-xl text-sm cursor-pointer hover:border-orange-200 transition-all shadow-sm hover:shadow-md">
                                <svg className="w-4 h-4 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                <span className={selectedDate ? "text-gray-900 font-semibold" : "text-gray-600 font-medium"}>
                                    {formatDateLabel(selectedDate)}
                                </span>
                                {selectedDate && (
                                    <button
                                        onClick={(e) => { e.preventDefault(); clearDate() }}
                                        className="ml-1 text-gray-400 hover:text-red-500 font-bold text-lg"
                                    >
                                        ×
                                    </button>
                                )}
                                <input
                                    type="date"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    value={selectedDate || ''}
                                    onChange={(e) => onDateChange(e.target.value)}
                                />
                            </label>
                        </div>

                        {/* Filter Modal Button */}
                        <button
                            onClick={() => setShowFilterModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-3 border-2 border-white bg-white/80 backdrop-blur-sm hover:border-orange-200 rounded-xl text-sm transition-all shadow-sm hover:shadow-md group"
                        >
                            <svg className="w-4 h-4 text-orange-500 group-hover:rotate-12 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                            </svg>
                            <span className="font-semibold text-gray-700">
                                Lọc{countSelected > 0 ? ` (${countSelected})` : ''}
                            </span>
                            {countSelected > 0 && (
                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                            )}
                        </button>

                        {/* Quick Category Buttons */}
                        <div className="hidden md:flex gap-2">
                            <button
                                onClick={() => updateParams({ cats: ['tour-trong-ngay'] })}
                                className="px-3 py-2 text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
                            >
                                Tour & Trải nghiệm
                            </button>
                            <button
                                onClick={() => updateParams({ cats: ['ve-tham-quan'] })}
                                className="px-3 py-2 text-xs font-medium text-pink-600 bg-pink-50 border border-pink-200 rounded-lg hover:bg-pink-100 transition-colors"
                            >
                                Vé tham quan
                            </button>
                        </div>
                    </div>

                    {/* Active Filter Chips */}
                    {countSelected > 0 && (
                        <div className="mt-3 flex gap-2 flex-wrap items-center animate-fadeIn">
                            <span className="text-sm text-gray-600 font-medium">Đã chọn:</span>
                            {/* Category chips will be managed by the modal */}
                            <button
                                onClick={() => {
                                    updateParams({ cats: [], date: undefined, price: undefined, rating: undefined })
                                }}
                                className="text-sm text-orange-600 hover:text-orange-800 underline font-medium ml-2"
                            >
                                Xóa tất cả ({countSelected})
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Filter Modal */}
            <FilterModal
                isOpen={showFilterModal}
                onClose={() => setShowFilterModal(false)}
                selectedCats={selectedCats}
                selectedPrice={selectedPrice}
                selectedRating={selectedRating}
                onApplyFilters={handleApplyFilters}
            />

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
        </>
    )
}
