// Mock data for activities
export const activityMockData = {
    "1": {
        id: "1",
        title: "Tour 3 đảo Phú Quốc - Khám phá thiên đường biển đảo",
        location: "Phú Quốc, Kiên Giang",
        rating: 4.9,
        reviewCount: 234,
        price: 850000,
        originalPrice: 1200000,
        duration: "8 giờ",
        groupSize: "Tối đa 25 người",
        highlights: [
            "Tham quan 3 đảo xinh đẹp: Hòn Thơm, Hòn Mây Rút, Hòn Gầm Ghì",
            "Lặn ngắm san hô và cá nhiệt đới",
            "Thưởng thức hải sản tươi sống trên thuyền",
            "Tắm biển tại những bãi cát trắng tuyệt đẹp",
            "Xe đưa đón tận khách sạn",
            "Hướng dẫn viên tiếng Việt & English"
        ],
        description: "Khám phá vẻ đẹp hoang sơ của 3 hòn đảo nổi tiếng nhất Phú Quốc trong chuyến tour trọn gói. Bạn sẽ được trải nghiệm lặn ngắm san hô, thưởng thức hải sản tươi ngon và tận hưởng làn nước trong xanh của biển đảo. Tour bao gồm đầy đủ thiết bị lặn, bữa trưa hải sản và đồ uống giải khát.",
        images: [
            "/images/diemthamquan-1.webp",
            "/images/diemthamquan-2.webp",
            "/images/diemthamquan-3.webp",
            "/images/diemthamquan-4.webp",
            "/images/diemthamquan-5.webp",
            "/images/diemthamquan-6.webp"
        ],
        inclusions: [
            "Xe đưa đón tận khách sạn",
            "Thuyền cao tốc đi 3 đảo",
            "Thiết bị lặn (kính, ống thở, chân vịt)",
            "Bữa trưa hải sản trên thuyền",
            "Nước uống, trái cây tươi",
            "Hướng dẫn viên chuyên nghiệp",
            "Bảo hiểm du lịch",
            "Phí vào cửa các điểm tham quan"
        ],
        exclusions: [
            "Chi phí cá nhân",
            "Đồ uống có cồn",
            "Tip cho hướng dẫn viên",
            "Các hoạt động không nằm trong chương trình"
        ],
        cancellationPolicy: "Miễn phí hủy tour trước 24 giờ khởi hành. Hủy trong vòng 24 giờ sẽ bị tính phí 50%.",
        category: "Tour biển đảo"
    },
    "2": {
        id: "2",
        title: "Cáp treo Hòn Thơm - Trải nghiệm đỉnh cao",
        location: "Hòn Thơm, Phú Quốc",
        rating: 4.7,
        reviewCount: 189,
        price: 320000,
        originalPrice: 400000,
        duration: "4 giờ",
        groupSize: "Không giới hạn",
        highlights: [
            "Cáp treo dài nhất thế giới qua biển",
            "Tầm nhìn 360 độ ra biển và rừng nhiệt đới",
            "Trải nghiệm các trò chơi tại công viên Sun World",
            "Tắm biển tại bãi Dứa",
            "Chụp ảnh tại các điểm check-in nổi tiếng"
        ],
        description: "Trải nghiệm cáp treo vượt biển dài nhất thế giới với độ dài 7.899,9m, mang đến góc nhìn tuyệt đẹp về Phú Quốc từ trên cao. Khám phá công viên giải trí Sun World Hòn Thơm với nhiều trò chơi thú vị và thưởng thức vẻ đẹp của bãi biển Dứa.",
        images: [
            "/images/diemthamquan-7.webp",
            "/images/diemthamquan-8.webp",
            "/images/diemthamquan-9.webp",
            "/images/diemthamquan-10.webp"
        ],
        inclusions: [
            "Vé cáp treo khứ hồi",
            "Vé vào cửa Sun World Hòn Thơm",
            "Xe đưa đón từ khu vực trung tâm",
            "Hướng dẫn viên"
        ],
        exclusions: [
            "Ăn uống tại công viên",
            "Các trò chơi có phí",
            "Chi phí cá nhân"
        ],
        cancellationPolicy: "Miễn phí hủy trước 12 giờ. Không hoàn tiền nếu hủy trong ngày.",
        category: "Tham quan"
    }
}

export const activityReviews = [
    {
        id: "1",
        author: "Lê Văn C",
        rating: 5,
        comment: "Tour tuyệt vời! Hướng dẫn viên nhiệt tình, biển đẹp như tranh vẽ. Hải sản tươi ngon, đặc biệt là tôm hùm nướng. Sẽ giới thiệu cho bạn bè!",
        date: "20/09/2024",
        avatar: ""
    },
    {
        id: "2",
        author: "Phạm Thị D",
        rating: 4,
        comment: "Tour hay, tuy nhiên thời gian ở mỗi đảo hơi ngắn. Nước biển trong xanh, lặn ngắm san hô rất đẹp. Bữa trưa ngon.",
        date: "18/09/2024",
        avatar: ""
    },
    {
        id: "3",
        author: "Michael Johnson",
        rating: 5,
        comment: "Fantastic 3-island tour! The water is crystal clear and the snorkeling was amazing. Fresh seafood lunch was delicious. Highly recommended!",
        date: "15/09/2024",
        avatar: ""
    }
]

export const similarActivities = [
    {
        id: "2",
        title: "Cáp treo Hòn Thơm",
        image: "/images/diemthamquan-7.webp",
        price: 320000,
        rating: 4.7
    },
    {
        id: "3",
        title: "Safari Phú Quốc",
        image: "/images/1.webp",
        price: 550000,
        rating: 4.6
    },
    {
        id: "4",
        title: "Câu cá đêm Phú Quốc",
        image: "/images/2.webp",
        price: 450000,
        rating: 4.5
    },
    {
        id: "5",
        title: "Tour Rừng quốc gia",
        image: "/images/3.webp",
        price: 380000,
        rating: 4.4
    }
]