'use client';

import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function ContactBookingForm() {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        checkIn: '',
        checkOut: '',
        guests: '2',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', formData);

        // Create WhatsApp message
        const whatsappMessage = `
Xin chào! Tôi muốn đặt phòng:
- Tên: ${formData.name}
- Email: ${formData.email}
- SĐT: ${formData.phone}
- Ngày nhận phòng: ${formData.checkIn}
- Ngày trả phòng: ${formData.checkOut}
- Số khách: ${formData.guests}
- Tin nhắn: ${formData.message}
        `.trim();

        const whatsappUrl = `https://wa.me/84123456789?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <section id="contact" className="py-12 bg-gradient-to-br from-blue-50 to-orange-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left side - Form */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                {t.sections.contact}
                            </h2>
                            <p className="text-gray-600">
                                {t.common.quickBooking} - Liên hệ ngay để nhận ưu đãi tốt nhất!
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t.common.name} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Nhập họ và tên"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t.common.phone} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="0123 456 789"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t.common.email}
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="email@example.com"
                                />
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t.common.checkIn}
                                    </label>
                                    <input
                                        type="date"
                                        name="checkIn"
                                        value={formData.checkIn}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t.common.checkOut}
                                    </label>
                                    <input
                                        type="date"
                                        name="checkOut"
                                        value={formData.checkOut}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t.common.guests}
                                    </label>
                                    <select
                                        name="guests"
                                        value={formData.guests}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="1">1 khách</option>
                                        <option value="2">2 khách</option>
                                        <option value="3">3 khách</option>
                                        <option value="4">4 khách</option>
                                        <option value="5">5 khách</option>
                                        <option value="6+">6+ khách</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t.common.message}
                                </label>
                                <textarea
                                    name="message"
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Yêu cầu đặc biệt, loại phòng mong muốn..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                {t.common.submit}
                            </button>
                        </form>
                    </div>

                    {/* Right side - Chat & External Links */}
                    <div className="space-y-8">
                        {/* Chat Buttons */}
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                                Chat trực tiếp
                            </h3>
                            <div className="grid gap-4">
                                <a
                                    href="https://wa.me/84123456789"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 bg-green-500 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.785" />
                                    </svg>
                                    {t.platforms.whatsapp}
                                </a>
                                <a
                                    href="https://zalo.me/84123456789"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 bg-blue-500 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.169-.224-.423-.384-.711-.449-.288-.064-.586-.034-.851.087-.265.12-.487.321-.634.574-.147.252-.214.543-.191.831.023.288.128.567.301.798.173.231.413.403.687.492.274.089.568.09.842.004.274-.087.515-.26.690-.492.175-.231.282-.511.307-.799.025-.288-.041-.579-.186-.807-.145-.228-.361-.415-.617-.529-.256-.113-.544-.14-.821-.077-.276.063-.532.201-.738.395-.206.194-.355.437-.427.698-.072.261-.066.537.017.795.083.258.228.494.416.678.188.184.423.312.676.367.253.055.516.036.757-.054.241-.09.456-.248.617-.453.161-.205.264-.454.294-.715.03-.261-.012-.524-.12-.762-.108-.238-.278-.446-.487-.595-.209-.149-.458-.234-.714-.244-.256-.01-.513.057-.737.193-.224.136-.407.334-.525.568-.118.234-.168.497-.143.758.025.261.12.511.272.716.152.205.358.358.590.438.232.08.482.085.717.014.235-.071.449-.216.614-.416.165-.2.276-.448.318-.712.042-.264.013-.534-.083-.786-.096-.252-.256-.475-.458-.639-.202-.164-.447-.263-.703-.284-.256-.021-.513.03-.738.146-.225.116-.412.293-.536.508-.124.215-.182.462-.166.708.016.246.089.485.208.693.119.208.285.382.476.499.191.117.408.173.622.161.214-.012.421-.085.593-.209.172-.124.305-.296.381-.493.076-.197.093-.411.049-.617-.044-.206-.135-.399-.260-.561-.125-.162-.285-.289-.459-.364-.174-.075-.364-.096-.545-.06-.181.036-.351.125-.488.255-.137.13-.238.301-.289.49-.051.189-.051.388.000.577.051.189.152.361.289.491.137.13.307.219.488.255.181.036.371.015.545-.06.174-.075.334-.202.459-.364.125-.162.216-.355.26-.561.044-.206.027-.42-.049-.617-.076-.197-.209-.369-.381-.493-.172-.124-.379-.197-.593-.209-.214-.012-.431.044-.622.161-.191.117-.357.291-.476.499-.119.208-.192.447-.208.693-.016.246.042.493.166.708.124.215.311.392.536.508.225.116.482.167.738.146.256-.021.501-.12.703-.284.202-.164.362-.387.458-.639.096-.252.125-.522.083-.786-.042-.264-.153-.512-.318-.712-.165-.2-.379-.345-.614-.416-.235-.071-.485-.066-.717.014-.232.08-.438.233-.59.438-.152.205-.247.455-.272.716-.025.261.025.524.143.758.118.234.301.432.525.568.224.136.481.203.737.193.256-.01.505-.095.714-.244.209-.149.379-.357.487-.595.108-.238.15-.501.12-.762-.03-.261-.133-.51-.294-.715-.161-.205-.376-.363-.617-.453-.241-.09-.504-.109-.757-.054-.253.055-.488.183-.676.367-.188.184-.333.42-.416.678-.083.258-.089.534-.017.795.072.261.221.504.427.698.206.194.462.332.738.395.276.063.565.036.821-.077.256-.113.472-.301.617-.529.145-.228.211-.519.186-.807-.025-.288-.132-.568-.307-.799-.175-.231-.416-.405-.69-.492-.274-.087-.568-.085-.842.004-.274.089-.514.261-.687.492-.173.231-.278.51-.301.798-.023.288.044.579.191.831.147.252.369.454.634.574.265.121.563.151.851.087.288-.065.542-.225.711-.449z" />
                                    </svg>
                                    {t.platforms.zalo}
                                </a>
                            </div>
                        </div>

                        {/* External Platform Links */}
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                                {t.sections.externalLinks}
                            </h3>
                            <div className="grid gap-4">
                                <a
                                    href="https://shopee.vn/phogroup"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-4 border-2 border-orange-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
                                >
                                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">S</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{t.platforms.shopee}</div>
                                        <div className="text-sm text-gray-600">Đặc sản cá khô, hải sản</div>
                                    </div>
                                </a>

                                <a
                                    href="https://www.tiktok.com/@phogroup"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-4 border-2 border-pink-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-all"
                                >
                                    <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">T</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{t.platforms.tiktokShop}</div>
                                        <div className="text-sm text-gray-600">Sản phẩm đặc sản</div>
                                    </div>
                                </a>

                                <a
                                    href="https://www.booking.com/hotel/vn/pho-retreat-phu-quoc.html"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                                >
                                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">B</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{t.platforms.bookingCom}</div>
                                        <div className="text-sm text-gray-600">Pho Retreat Villa</div>
                                    </div>
                                </a>

                                <a
                                    href="https://www.airbnb.com/users/show/pho-retreat"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-4 border-2 border-red-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all"
                                >
                                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">A</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{t.platforms.airbnb}</div>
                                        <div className="text-sm text-gray-600">Villa cao cấp</div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}