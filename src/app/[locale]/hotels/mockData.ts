// Mock data for hotels
export const hotelMockData = {
    "1": {
        id: "1",
        name: "Pho Retreat Villa Premium",
        location: "Bãi Trường, Phú Quốc",
        address: "123 Trần Hưng Đạo, Dương Đông, Phú Quốc, Kiên Giang",
        rating: 4.8,
        reviewCount: 156,
        images: [
            "/images/khachsan-1.webp",
            "/images/khachsan-2.webp",
            "/images/khachsan-3.webp",
            "/images/khachsan-4.webp",
            "/images/khachsan-5.png",
            "/images/khachsan-6.webp"
        ],
        description: "Pho Retreat Villa Premium là biệt thự nghỉ dưỡng cao cấp tại Phú Quốc, mang đến trải nghiệm lưu trú tuyệt vời với tầm nhìn ra biển tuyệt đẹp. Villa được thiết kế hiện đại, kết hợp với nét truyền thống Việt Nam, tạo nên không gian ấm cúng và sang trọng.",
        amenities: [
            { icon: "wifi", name: "WiFi miễn phí", available: true },
            { icon: "parking", name: "Bãi đỗ xe", available: true },
            { icon: "pool", name: "Hồ bơi riêng", available: true },
            { icon: "ac", name: "Điều hòa", available: true },
            { icon: "restaurant", name: "Nhà hàng", available: true },
            { icon: "security", name: "An ninh 24/7", available: true }
        ],
        roomTypes: [
            {
                id: "deluxe",
                name: "Deluxe Villa",
                size: "60m²",
                capacity: 4,
                price: 2500000,
                originalPrice: 3000000,
                amenities: [
                    "Giường king size",
                    "Ban công view biển",
                    "Bồn tắm jacuzzi",
                    "Minibar miễn phí",
                    "Smart TV 55 inch"
                ],
                images: ["/images/khachsan-1.webp"],
                availability: true
            },
            {
                id: "premium",
                name: "Premium Villa",
                size: "80m²",
                capacity: 6,
                price: 3500000,
                amenities: [
                    "2 phòng ngủ",
                    "Hồ bơi riêng",
                    "Bếp đầy đủ tiện nghi",
                    "Phòng khách rộng",
                    "Sân hiên BBQ"
                ],
                images: ["/images/khachsan-2.webp"],
                availability: true
            }
        ],
        policies: {
            checkIn: "14:00",
            checkOut: "12:00",
            cancellation: "Miễn phí hủy trước 24 giờ",
            children: "Trẻ em dưới 12 tuổi được miễn phí",
            pets: "Không cho phép thú cưng"
        },
        location_details: {
            nearbyAttractions: [
                { name: "Cáp treo Hòn Thơm", distance: "2.5 km" },
                { name: "Chợ đêm Phú Quốc", distance: "3.2 km" },
                { name: "Vinpearl Safari", distance: "15 km" },
                { name: "Bãi biển Sao", distance: "25 km" }
            ],
            coordinates: { lat: 10.2899, lng: 103.9840 }
        }
    }
}

export const hotelReviews = [
    {
        id: "1",
        author: "Nguyễn Văn A",
        rating: 5,
        comment: "Villa rất đẹp, tầm nhìn ra biển tuyệt vời. Dịch vụ chu đáo, nhân viên thân thiện. Sẽ quay lại lần sau!",
        date: "15/09/2024",
        room_type: "Deluxe Villa"
    },
    {
        id: "2",
        author: "Trần Thị B",
        rating: 4,
        comment: "Phòng sạch sẽ, tiện nghi đầy đủ. Hồ bơi riêng rất thích. Chỉ có điều wifi hơi yếu một chút.",
        date: "10/09/2024",
        room_type: "Premium Villa"
    },
    {
        id: "3",
        author: "John Smith",
        rating: 5,
        comment: "Amazing villa with great ocean view! Staff was very helpful and the facilities are top-notch.",
        date: "05/09/2024",
        room_type: "Premium Villa"
    }
]

export const similarHotels = [
    {
        id: "2",
        name: "Pho Retreat Beach Resort",
        image: "/images/khachsan-7.webp",
        rating: 4.6,
        price: 2200000,
        location: "Bãi Khem, Phú Quốc"
    },
    {
        id: "3",
        name: "Pho Retreat Mountain Villa",
        image: "/images/khachsan-8.webp",
        rating: 4.7,
        price: 2800000,
        location: "Hàm Ninh, Phú Quốc"
    },
    {
        id: "4",
        name: "Pho Retreat Family Suite",
        image: "/images/khachsan-9.webp",
        rating: 4.5,
        price: 1800000,
        location: "Dương Đông, Phú Quốc"
    },
    {
        id: "5",
        name: "Pho Retreat Luxury Villa",
        image: "/images/khachsan-10.webp",
        rating: 4.9,
        price: 4500000,
        location: "Ông Lang, Phú Quốc"
    }
]