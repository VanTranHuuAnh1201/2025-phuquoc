'use client'

import Image from 'next/image';
import { useRef } from 'react';

interface Review {
    id: number;
    username: string;
    date: string;
    rating: number;
    content: string;
    activity: string;
    activityImage: string;
    isVerified: boolean;
}

const reviewsData: Review[] = [
    {
        id: 1,
        username: "PhoGroup",
        date: "2025-08-23 16:32:50",
        rating: 5,
        content: "Nói chung là một trải nghiệm tốt nhưng vì Việt Nam mua rất nhiều nên không chơi được gì nhiều. Sự tiện lợi khi đặt qua PhoGroup. Tốt, về có thể đổi lấy nước trái cây hoặc bia. Vé cho phép chơi miễn phí tất cả các trò...",
        activity: "Vé Sun World Hon Thom",
        activityImage: "/images/1.webp",
        isVerified: true
    },
    {
        id: 2,
        username: "chachi **********",
        date: "2025-09-13 05:47:15",
        rating: 5,
        content: "Rất vui và đã mua esim này. Tôi không gặp bất kỳ vấn đề nào khi chúng tôi ở Việt Nam trong suốt chuyến đi. Nó rất dễ dùng. Không gặp phải bất kỳ sự gián đoạn nào. Ngay sau khi đặt phòng ở PhoGroup, tôi đã...",
        activity: "eSIM Việt Nam",
        activityImage: "/images/2.webp",
        isVerified: true
    },
    {
        id: 3,
        username: "Sharifah *******",
        date: "2025-09-15 00:56:24",
        rating: 5,
        content: "Ờ trời ơi, tôi thích cái này quá đi mất! Như mọi khi, có thể vào công viên chỉ với QR thôi! Quá dễ dàng luôn. Họ sẽ kiểm tra từ cửa ban ở lối vào em có đồ ăn thức uống không, kiểu chỉ vồ vồ thôi. Nhưng trong chuyến...",
        activity: "Vé VinWonders Phú Quốc",
        activityImage: "/images/3.webp",
        isVerified: true
    },
    {
        id: 4,
        username: "Minh Nguyen",
        date: "2025-09-10 14:22:30",
        rating: 5,
        content: "Tour 3 đảo rất tuyệt vời! Hướng dẫn viên nhiệt tình, thức ăn ngon. Đặc biệt là snorkeling ở Hòn Móng Tay rất đẹp, nước trong xanh và có nhiều cá. Tôi chắc chắn sẽ quay lại Phú Quốc một lần nữa!",
        activity: "Tour 3 Đảo Phú Quốc",
        activityImage: "/images/4.webp",
        isVerified: true
    },
    {
        id: 5,
        username: "Sarah Johnson",
        date: "2025-09-08 09:15:45",
        rating: 5,
        content: "Cáp treo Hòn Thơm thật sự là trải nghiệm không thể bỏ lỡ! View từ trên cao xuống biển rất đẹp. Bãi biển ở Hòn Thơm cũng rất sạch và đẹp. Giá vé hợp lý cho những gì trải nghiệm được.",
        activity: "Cáp Treo Hòn Thơm",
        activityImage: "/images/5.webp",
        isVerified: true
    },
    {
        id: 6,
        username: "Thanh Pham",
        date: "2025-09-05 18:30:12",
        rating: 5,
        content: "Safari Phú Quốc rất thú vị cho cả gia đình! Các em nhỏ rất thích xem động vật. Đặc biệt là show safari và feeding time. Staff rất friendly và hỗ trợ tốt. Recommend cho family có trẻ nhỏ!",
        activity: "Vinpearl Safari Phú Quốc",
        activityImage: "/images/6.webp",
        isVerified: true
    },
    {
        id: 7,
        username: "David Kim",
        date: "2025-09-02 11:45:20",
        rating: 5,
        content: "Chợ đêm Phú Quốc rất sôi động! Hải sản tươi ngon, giá cả hợp lý. Đặc biệt là bánh kẹp nướng và kem dừa rất ngon. Atmosphere rất good cho dinner với gia đình.",
        activity: "Chợ Đêm Phú Quốc",
        activityImage: "/images/7.webp",
        isVerified: true
    },
    {
        id: 8,
        username: "Anna Tran",
        date: "2025-08-30 16:20:15",
        rating: 5,
        content: "Spa ở resort rất relaxing! Treatment tốt, staff professional. Môi trường yên tĩnh, view ra biển. Perfect để unwind sau những ngày touring intensive. Giá hơi cao nhưng worth it!",
        activity: "Spa & Wellness Phú Quốc",
        activityImage: "/images/8.webp",
        isVerified: true
    }
];

function ReviewCard({ review }: { review: Review }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 hover:border-orange-300 transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md p-5">
            <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 min-w-10 min-h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {review.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-medium text-gray-900 text-nowrap flex-1">{review.username}</span>
                        <span className="min-w-6 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            ⭐ {review.rating}.0
                        </span>
                    </div>
                    <p className="text-xs text-gray-500">{review.date}</p>
                </div>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed mb-4 line-clamp-4">
                {review.content}
            </p>

            <div className="flex items-center gap-3 border-t border-gray-100">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                        src={review.activityImage}
                        alt={review.activity}
                        fill
                        className="object-cover"
                    />
                </div>
                <span className="text-sm font-medium text-gray-900 flex-1 line-clamp-2">
                    {review.activity}
                </span>
            </div>
        </div>
    );
}

export default function ActivityReviews() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            const containerWidth = scrollContainerRef.current.clientWidth;
            scrollContainerRef.current.scrollBy({ left: -containerWidth, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            const containerWidth = scrollContainerRef.current.clientWidth;
            scrollContainerRef.current.scrollBy({ left: containerWidth, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-4 sm:py-6 bg-white/90 backdrop-blur-sm rounded-2xl mx-2 sm:mx-3 lg:mx-4 shadow-lg">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <div className="flex-1">
                        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                            <strong style={{ backgroundColor: 'white', color: 'white' }}>⭐</strong> Đánh giá từ khách hàng
                        </h2>
                        <p className="text-gray-600 mt-2">Những trải nghiệm thực tế từ du khách</p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="hidden sm:flex items-center gap-1 sm:gap-2">
                            <button
                                onClick={scrollLeft}
                                className="p-2 sm:p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-orange-300 group"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={scrollRight}
                                className="p-2 sm:p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-orange-300 group"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="relative overflow-hidden">
                    <div
                        ref={scrollContainerRef}
                        className="grid auto-cols-[100%] grid-flow-col gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-3 sm:pb-4"
                        style={{ scrollSnapType: 'x mandatory' }}
                    >
                        {/* Group reviews into sets of 4 */}
                        {Array.from({ length: Math.ceil(reviewsData.length / 4) }, (_, groupIndex) => (
                            <div
                                key={groupIndex}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 min-w-0"
                                style={{ scrollSnapAlign: 'start' }}
                            >
                                {reviewsData.slice(groupIndex * 4, (groupIndex + 1) * 4).map((review) => (
                                    <div key={review.id} className="h-full">
                                        <ReviewCard review={review} />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}