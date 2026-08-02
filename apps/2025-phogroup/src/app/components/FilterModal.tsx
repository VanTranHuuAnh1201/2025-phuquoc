'use client'

import { useEffect, useState } from 'react'
import { CATEGORIES } from '../[locale]/1-things-to-do/mockData'

interface FilterModalProps {
    isOpen: boolean
    onClose: () => void
    selectedCats: string[]
    selectedPrice?: string
    selectedRating?: string
    onApplyFilters: (filters: { cats: string[]; price?: string; rating?: string }) => void
}

const PRICE_RANGES = [
    { slug: '0-500k', label: 'Dưới ₫500,000', min: 0, max: 500000 },
    { slug: '500k-1m', label: '₫500,000 - ₫1,000,000', min: 500000, max: 1000000 },
    { slug: '1m-2m', label: '₫1,000,000 - ₫2,000,000', min: 1000000, max: 2000000 },
    { slug: '2m+', label: 'Trên ₫2,000,000', min: 2000000, max: Infinity }
]

const RATING_FILTERS = [
    { slug: '4+', label: '4.0+ ⭐', min: 4.0 },
    { slug: '4.5+', label: '4.5+ ⭐', min: 4.5 },
    { slug: '4.8+', label: '4.8+ ⭐', min: 4.8 }
]

export default function FilterModal({ isOpen, onClose, selectedCats, selectedPrice, selectedRating, onApplyFilters }: FilterModalProps) {
    const [tempCats, setTempCats] = useState<string[]>(selectedCats)
    const [tempPrice, setTempPrice] = useState<string | undefined>(selectedPrice)
    const [tempRating, setTempRating] = useState<string | undefined>(selectedRating)

    useEffect(() => {
        setTempCats(selectedCats)
        setTempPrice(selectedPrice)
        setTempRating(selectedRating)
    }, [selectedCats, selectedPrice, selectedRating, isOpen])

    const toggleCategory = (slug: string) => {
        setTempCats(prev => {
            const set = new Set(prev)
            if (set.has(slug)) {
                set.delete(slug)
            } else {
                set.add(slug)
            }
            return Array.from(set)
        })
    }

    const clearAll = () => {
        setTempCats([])
        setTempPrice(undefined)
        setTempRating(undefined)
    }

    const applyFilters = () => {
        onApplyFilters({
            cats: tempCats,
            price: tempPrice,
            rating: tempRating
        })
        onClose()
    }

    const activeFiltersCount = tempCats.length + (tempPrice ? 1 : 0) + (tempRating ? 1 : 0)

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl max-h-[85vh] flex flex-col animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-gray-900">Lọc</h2>
                        {activeFiltersCount > 0 && (
                            <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-sm font-medium">
                                {activeFiltersCount}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-8">
                        {/* Main Categories */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Danh mục chính</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => toggleCategory('tour-trong-ngay')}
                                    className={`p-3 rounded-xl border-2 text-left transition-all ${tempCats.includes('tour-trong-ngay')
                                        ? 'border-orange-400 bg-orange-50 text-orange-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="font-medium text-sm">Tour & Trải nghiệm</div>
                                </button>
                                <button
                                    onClick={() => toggleCategory('ve-tham-quan')}
                                    className={`p-3 rounded-xl border-2 text-left transition-all ${tempCats.includes('ve-tham-quan')
                                        ? 'border-orange-400 bg-orange-50 text-orange-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="font-medium text-sm">Vé tham quan</div>
                                </button>
                            </div>
                        </div>

                        {/* All Categories */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Danh mục</h3>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {CATEGORIES.map((category) => (
                                    <label
                                        key={category.slug}
                                        className="flex items-center p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={tempCats.includes(category.slug)}
                                            onChange={() => toggleCategory(category.slug)}
                                            className="sr-only"
                                        />
                                        <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors ${tempCats.includes(category.slug)
                                            ? 'border-orange-400 bg-orange-400'
                                            : 'border-gray-300'
                                            }`}>
                                            {tempCats.includes(category.slug) && (
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="text-gray-700 font-medium">{category.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Giá</h3>
                            <div className="space-y-2">
                                {PRICE_RANGES.map((range) => (
                                    <label
                                        key={range.slug}
                                        className="flex items-center p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <input
                                            type="radio"
                                            name="price"
                                            value={range.slug}
                                            checked={tempPrice === range.slug}
                                            onChange={(e) => setTempPrice(e.target.checked ? range.slug : undefined)}
                                            className="sr-only"
                                        />
                                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-colors ${tempPrice === range.slug
                                            ? 'border-orange-400 bg-orange-400'
                                            : 'border-gray-300'
                                            }`}>
                                            {tempPrice === range.slug && (
                                                <div className="w-2 h-2 bg-white rounded-full" />
                                            )}
                                        </div>
                                        <span className="text-gray-700 font-medium">{range.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Rating */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Đánh giá</h3>
                            <div className="space-y-2">
                                {RATING_FILTERS.map((rating) => (
                                    <label
                                        key={rating.slug}
                                        className="flex items-center p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <input
                                            type="radio"
                                            name="rating"
                                            value={rating.slug}
                                            checked={tempRating === rating.slug}
                                            onChange={(e) => setTempRating(e.target.checked ? rating.slug : undefined)}
                                            className="sr-only"
                                        />
                                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-colors ${tempRating === rating.slug
                                            ? 'border-orange-400 bg-orange-400'
                                            : 'border-gray-300'
                                            }`}>
                                            {tempRating === rating.slug && (
                                                <div className="w-2 h-2 bg-white rounded-full" />
                                            )}
                                        </div>
                                        <span className="text-gray-700 font-medium">{rating.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-white">
                    <div className="flex gap-3">
                        <button
                            onClick={clearAll}
                            className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Xóa tất cả
                        </button>
                        <button
                            onClick={applyFilters}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg"
                        >
                            Hiện {activeFiltersCount > 0 ? `${activeFiltersCount} bộ lọc` : 'tất cả'}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
        </div>
    )
}
