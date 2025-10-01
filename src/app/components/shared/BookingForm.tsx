'use client'

import { useState } from 'react'

interface BookingFormProps {
    type: 'hotel' | 'activity' | 'restaurant'
    item: {
        id: string
        name: string
        price: number
        originalPrice?: number
        maxGuests?: number
        availableDates?: string[]
        roomTypes?: Array<{
            id: string
            name: string
            price: number
            availability: boolean
        }>
    }
    onSubmit?: (formData: BookingFormData) => void
    className?: string
}

interface BookingFormData {
    itemId: string
    date: string
    guests: number
    roomType?: string
    specialRequests?: string
    customerInfo: {
        name: string
        email: string
        phone: string
    }
}

export default function BookingForm({ type, item, onSubmit, className = '' }: BookingFormProps) {
    const [formData, setFormData] = useState<BookingFormData>({
        itemId: item.id,
        date: '',
        guests: type === 'hotel' ? 2 : 1,
        roomType: item.roomTypes?.[0]?.id || '',
        specialRequests: '',
        customerInfo: {
            name: '',
            email: '',
            phone: ''
        }
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.date) {
            newErrors.date = 'Vui lòng chọn ngày'
        }

        if (formData.guests < 1) {
            newErrors.guests = 'Số khách phải lớn hơn 0'
        }

        if (item.maxGuests && formData.guests > item.maxGuests) {
            newErrors.guests = `Tối đa ${item.maxGuests} khách`
        }

        if (type === 'hotel' && !formData.roomType) {
            newErrors.roomType = 'Vui lòng chọn loại phòng'
        }

        if (!formData.customerInfo.name.trim()) {
            newErrors.name = 'Vui lòng nhập họ tên'
        }

        if (!formData.customerInfo.email.trim()) {
            newErrors.email = 'Vui lòng nhập email'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerInfo.email)) {
            newErrors.email = 'Email không hợp lệ'
        }

        if (!formData.customerInfo.phone.trim()) {
            newErrors.phone = 'Vui lòng nhập số điện thoại'
        } else if (!/^[0-9+\-\s()]{10,}$/.test(formData.customerInfo.phone)) {
            newErrors.phone = 'Số điện thoại không hợp lệ'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        try {
            if (onSubmit) {
                await onSubmit(formData)
            }
            // Handle success (show message, redirect, etc.)
            alert('Đặt chỗ thành công! Chúng tôi sẽ liên hệ với bạn sớm.')
        } catch (error) {
            console.error('Booking error:', error)
            alert('Có lỗi xảy ra. Vui lòng thử lại.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const updateFormData = (field: string, value: any) => {
        if (field.startsWith('customerInfo.')) {
            const customerField = field.split('.')[1]
            setFormData(prev => ({
                ...prev,
                customerInfo: {
                    ...prev.customerInfo,
                    [customerField]: value
                }
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }))
        }

        // Clear error when user starts typing
        if (errors[field.split('.')[1] || field]) {
            setErrors(prev => ({
                ...prev,
                [field.split('.')[1] || field]: ''
            }))
        }
    }

    const selectedRoom = item.roomTypes?.find(room => room.id === formData.roomType)
    const totalPrice = (selectedRoom?.price || item.price) * formData.guests
    const discount = item.originalPrice
        ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
        : 0

    return (
        <div className={`bg-white border border-gray-200 rounded-lg p-6 shadow-lg ${className}`}>
            <h3 className="text-xl font-bold mb-6">
                {type === 'hotel' && 'Đặt phòng'}
                {type === 'activity' && 'Đặt tour'}
                {type === 'restaurant' && 'Đặt bàn'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Date Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {type === 'hotel' ? 'Ngày nhận phòng' : 'Ngày khởi hành'}
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => updateFormData('date', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.date ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                </div>

                {/* Guest Count */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {type === 'hotel' ? 'Số khách' : type === 'activity' ? 'Số người tham gia' : 'Số người'}
                        <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                            type="button"
                            onClick={() => updateFormData('guests', Math.max(1, formData.guests - 1))}
                            className="p-3 hover:bg-gray-50"
                        >
                            -
                        </button>
                        <span className="flex-1 text-center py-3">{formData.guests}</span>
                        <button
                            type="button"
                            onClick={() => updateFormData('guests', formData.guests + 1)}
                            className="p-3 hover:bg-gray-50"
                        >
                            +
                        </button>
                    </div>
                    {errors.guests && <p className="text-red-500 text-sm mt-1">{errors.guests}</p>}
                </div>

                {/* Room Type (for hotels) */}
                {type === 'hotel' && item.roomTypes && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Loại phòng <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.roomType}
                            onChange={(e) => updateFormData('roomType', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.roomType ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Chọn loại phòng</option>
                            {item.roomTypes.map((room) => (
                                <option key={room.id} value={room.id} disabled={!room.availability}>
                                    {room.name} - {room.price.toLocaleString('vi-VN')}₫
                                    {!room.availability && ' (Hết phòng)'}
                                </option>
                            ))}
                        </select>
                        {errors.roomType && <p className="text-red-500 text-sm mt-1">{errors.roomType}</p>}
                    </div>
                )}

                {/* Customer Information */}
                <div className="border-t pt-4">
                    <h4 className="font-medium mb-4">Thông tin liên hệ</h4>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Họ và tên <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.customerInfo.name}
                                onChange={(e) => updateFormData('customerInfo.name', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Nhập họ và tên"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={formData.customerInfo.email}
                                onChange={(e) => updateFormData('customerInfo.email', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Nhập địa chỉ email"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Số điện thoại <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                value={formData.customerInfo.phone}
                                onChange={(e) => updateFormData('customerInfo.phone', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Nhập số điện thoại"
                            />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>
                    </div>
                </div>

                {/* Special Requests */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Yêu cầu đặc biệt
                    </label>
                    <textarea
                        value={formData.specialRequests}
                        onChange={(e) => updateFormData('specialRequests', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ghi chú thêm (không bắt buộc)"
                    />
                </div>

                {/* Price Summary */}
                <div className="border-t pt-4">
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700">
                                {(selectedRoom?.price || item.price).toLocaleString('vi-VN')}₫ x {formData.guests}
                            </span>
                            <span>{totalPrice.toLocaleString('vi-VN')}₫</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between items-center text-green-600">
                                <span>Giảm giá ({discount}%)</span>
                                <span>-{((item.originalPrice! - item.price) * formData.guests).toLocaleString('vi-VN')}₫</span>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                        <span>Tổng cộng</span>
                        <span className="text-blue-600">{totalPrice.toLocaleString('vi-VN')}₫</span>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đặt chỗ'}
                </button>
            </form>

            {/* Terms */}
            <p className="text-xs text-gray-500 mt-4 text-center">
                Bằng cách đặt chỗ, bạn đồng ý với{' '}
                <a href="/vi/terms" className="text-blue-600 hover:underline">
                    Điều khoản sử dụng
                </a>{' '}
                và{' '}
                <a href="/vi/privacy" className="text-blue-600 hover:underline">
                    Chính sách bảo mật
                </a>{' '}
                của chúng tôi.
            </p>
        </div>
    )
}