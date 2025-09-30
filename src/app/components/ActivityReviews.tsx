'use client'

import Image from 'next/image';

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
        username: "Klook",
        date: "2025-08-23 16:32:50",
        rating: 5,
        content: "Nói chung là một trải nghiệm tốt nhưng vì Việt Nam mua rất nhiều nên không chơi được gì nhiều. Sự tiện lợi khi đặt qua Klook. Tốt, về có thể đổi lấy nước trái cây hoặc bia. Vé cho phép chơi miễn phí tất cả các trò...",
        activity: "Vé Sun World Hon Thom",
        activityImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000",
        isVerified: true
    },
    {
        id: 2,
        username: "chachi **********",
        date: "2025-09-13 05:47:15",
        rating: 5,
        content: "Rất vui và đã mua esim này. Tôi không gặp bất kỳ vấn đề nào khi chúng tôi ở Việt Nam trong suốt chuyến đi. Nó rất dễ dùng. Không gặp phải bất kỳ sự gián đoạn nào. Ngay sau khi đặt phòng ở Klook, tôi đã...",
        activity: "[FLASH SALE] eSIM Việt Nam (Nhận Mã QR Kích Hoạt Qua Email)",
        activityImage: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=1000",
        isVerified: true
    },
    {
        id: 3,
        username: "Sharifah *******************",
        date: "2025-09-15 00:56:24",
        rating: 5,
        content: "Ờ trời ơi, tôi thích cái này quá đi mất! Như mọi khi, có thể vào công viên chỉ với QR thôi! Quá dễ dàng luôn. Họ sẽ kiểm tra từ cửa ban ở lối vào em có đồ ăn thức uống không, kiểu chỉ vồ vồ thôi. Nhưng trong chuyến...",
        activity: "Vé VinWonders Phú Quốc",
        activityImage: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?q=80&w=1000",
        isVerified: true
    },
    {
        id: 4,
        username: "Minh Nguyen",
        date: "2025-09-10 14:22:30",
        rating: 5,
        content: "Tour 3 đảo rất tuyệt vời! Hướng dẫn viên nhiệt tình, thức ăn ngon. Đặc biệt là snorkeling ở Hòn Móng Tay rất đẹp, nước trong xanh và có nhiều cá. Tôi chắc chắn sẽ quay lại Phú Quốc một lần nữa!",
        activity: "Tour 3 Đảo Phú Quốc",
        activityImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1000",
        isVerified: true
    },
    {
        id: 5,
        username: "Sarah Johnson",
        date: "2025-09-08 09:15:45",
        rating: 5,
        content: "Cáp treo Hòn Thơm thật sự là trải nghiệm không thể bỏ lỡ! View từ trên cao xuống biển rất đẹp. Bãi biển ở Hòn Thơm cũng rất sạch và đẹp. Giá vé hợp lý cho những gì trải nghiệm được.",
        activity: "Cáp Treo Hòn Thơm",
        activityImage: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?q=80&w=1000",
        isVerified: true
    },
    {
        id: 6,
        username: "Thanh Pham",
        date: "2025-09-05 18:30:12",
        rating: 5,
        content: "Safari Phú Quốc rất thú vị cho cả gia đình! Các em nhỏ rất thích xem động vật. Đặc biệt là show safari và feeding time. Staff rất friendly và hỗ trợ tốt. Recommend cho family có trẻ nhỏ!",
        activity: "Vinpearl Safari Phú Quốc",
        activityImage: "https://images.unsplash.com/photo-1549366021-9f761d040a87?q=80&w=1000",
        isVerified: true
    }
];

function ReviewCard({ review }: { review: Review }) {
    return (
        <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {review.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{review.username}</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            Hài lòng {review.rating}.0
                        </span>
                    </div>
                    <p className="text-xs text-gray-500">{review.date}</p>
                </div>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed mb-4">
                {review.content}
            </p>

            <div className="flex items-center gap-3 pt-4 border-t">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                        src={review.activityImage}
                        alt={review.activity}
                        fill
                        className="object-cover"
                    />
                </div>
                <span className="text-sm font-medium text-gray-900 flex-1">
                    {review.activity}
                </span>
            </div>
        </div>
    );
}

export default function ActivityReviews() {
    return (
        <section className="py-8 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                    Đánh giá về các hoạt động ở Phú Quốc
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviewsData.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>

                <div className="text-center mt-8">
                    <button className="px-6 py-3 border border-brand-600 text-brand-600 rounded-lg hover:bg-brand-50 font-semibold transition-colors">
                        Xem thêm đánh giá
                    </button>
                </div>
            </div>
        </section>
    )
}