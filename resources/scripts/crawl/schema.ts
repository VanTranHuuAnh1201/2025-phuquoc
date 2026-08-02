/**
 * Schema mô tả dữ liệu khách sạn mà Firecrawl cần bóc tách.
 * Dùng JSON Schema thuần để truyền thẳng vào tham số `schema` của Firecrawl extract.
 */

export const hotelSchema = {
    type: "object",
    properties: {
        name: { type: "string", description: "Tên chính thức của khách sạn / resort" },
        tagline: { type: "string", description: "Slogan hoặc câu mô tả ngắn" },
        description: { type: "string", description: "Đoạn giới thiệu tổng quan" },
        address: { type: "string", description: "Địa chỉ đầy đủ" },
        location: { type: "string", description: "Khu vực / bãi biển / thành phố" },
        phone: { type: "string" },
        email: { type: "string" },
        rating: { type: "number", description: "Điểm đánh giá nếu hiển thị trên trang" },
        reviewCount: { type: "number" },
        images: {
            type: "array",
            description: "URL tuyệt đối của ảnh khách sạn",
            items: { type: "string" },
        },
        amenities: {
            type: "array",
            description: "Tiện ích chung của khách sạn",
            items: { type: "string" },
        },
        roomTypes: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    size: { type: "string", description: "Diện tích, ví dụ '21m²'" },
                    bedType: { type: "string" },
                    capacity: { type: "number", description: "Số khách tối đa" },
                    price: { type: "number", description: "Giá mỗi đêm, đơn vị VND, chỉ lấy số" },
                    currency: { type: "string" },
                    amenities: { type: "array", items: { type: "string" } },
                    images: { type: "array", items: { type: "string" } },
                },
                required: ["name"],
            },
        },
        dining: {
            type: "array",
            description: "Nhà hàng, bar, café",
            items: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                    openingHours: { type: "string" },
                },
                required: ["name"],
            },
        },
        experiences: {
            type: "array",
            description: "Hoạt động / trải nghiệm cho khách",
            items: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                    price: { type: "number" },
                },
                required: ["name"],
            },
        },
        policies: {
            type: "object",
            properties: {
                checkIn: { type: "string" },
                checkOut: { type: "string" },
                cancellation: { type: "string" },
                children: { type: "string" },
                pets: { type: "string" },
            },
        },
        nearbyAttractions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    distance: { type: "string" },
                },
                required: ["name"],
            },
        },
    },
    required: ["name"],
} as const;

/** Kiểu TypeScript tương ứng với schema ở trên. */
export interface CrawledHotel {
    name: string;
    tagline?: string;
    description?: string;
    address?: string;
    location?: string;
    phone?: string;
    email?: string;
    rating?: number;
    reviewCount?: number;
    images?: string[];
    amenities?: string[];
    roomTypes?: {
        name: string;
        size?: string;
        bedType?: string;
        capacity?: number;
        price?: number;
        currency?: string;
        amenities?: string[];
        images?: string[];
    }[];
    dining?: { name: string; description?: string; openingHours?: string }[];
    experiences?: { name: string; description?: string; price?: number }[];
    policies?: {
        checkIn?: string;
        checkOut?: string;
        cancellation?: string;
        children?: string;
        pets?: string;
    };
    nearbyAttractions?: { name: string; distance?: string }[];
}
