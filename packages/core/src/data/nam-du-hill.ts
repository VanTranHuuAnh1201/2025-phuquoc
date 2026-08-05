/**
 * Nội dung The Nam Du Hill.
 *
 * Port từ `resources/design/project/namdu-data.js` sang TypeScript có type đầy đủ.
 * Mọi chuỗi khách nhìn thấy đều song ngữ (luật R6).
 *
 * Đây là dữ liệu MẪU dùng để dựng giao diện ở môi trường phát triển.
 * Trước khi lên production phải thay bằng nội dung của khách hàng.
 */

import { t } from '../i18n'
import type { PropertyData } from '../types'

export const namDuHill: PropertyData = {
    brand: {
        name: 'The Nam Du Hill',
        suffix: 'Resort',
        tagline: t('Hành trình nghỉ dưỡng hoàn hảo', 'A perfect island escape'),
        address: t(
            'Bãi Đất Đỏ, An Sơn, Kiên Hải, Kiên Giang',
            'Bai Dat Do, An Son, Kien Hai, Kien Giang',
        ),
        phone: '0909 000 000',
        email: 'booking@thenamduhill.com',
        site: 'thenamduhill.com',
        logo: '/OP5.png',
    },

    nav: [
        { href: '#rooms', label: t('Phòng', 'Rooms & Suites') },
        { href: '#dining', label: t('Ẩm thực', 'Wining & Dining') },
        { href: '#places', label: t('Khám phá', 'Experiences') },
        { href: '#tours', label: t('Sự kiện', 'Events') },
        { href: '#gallery', label: t('Thư viện', 'Gallery') },
        { href: '#contact', label: t('Liên hệ', 'Contact Us') },
    ],

    hero: {
        kicker: t('Quần đảo Nam Du · Kiên Giang', 'Nam Du Archipelago · Kien Giang'),
        title: t(
            'Nghỉ dưỡng trên đồi, thức giấc cùng 21 hòn đảo',
            'Wake up on the hill, above 21 islands',
        ),
        sub: t(
            'Resort trên sườn đồi hướng biển tại Hòn Củ Tron — điểm xuất phát thuận tiện nhất cho hành trình khám phá Nam Du.',
            'A hillside resort facing the sea on Hon Cu Tron — the most convenient base for exploring Nam Du.',
        ),
        badges: [
            t('Trọn gói vé tàu + phòng + tour', 'Ferry + room + tour bundles'),
            t('Xác nhận trong 15 phút', 'Confirmed in 15 minutes'),
            t('Hỗ trợ đưa đón bến tàu', 'Free pier transfer'),
        ],
        images: ['/hero-1.jpg', '/hero-2.jpg'],
    },

    facts: [
        { value: '21', label: t('hòn đảo lớn nhỏ', 'islands in the group') },
        { value: '309m', label: t('đỉnh cao nhất Hòn Lớn', 'highest peak on Hon Lon') },
        { value: '9,12', label: t('km² tổng diện tích', 'km² total area') },
        { value: 'T12–T3', label: t('mùa biển đẹp nhất', 'best season to visit') },
    ],

    about: {
        title: t('The Nam Du Hill Resort', 'The Nam Du Hill Resort'),
        kicker: t('Hành trình nghỉ dưỡng hoàn hảo', 'A perfect island escape'),
        body: [
            t(
                'Tọa lạc trên sườn đồi hướng biển, The Nam Du Hill Resort là điểm dừng chân lý tưởng cho những ai tìm kiếm sự yên bình và thoải mái. Chúng tôi mang đến trải nghiệm nghỉ dưỡng khác biệt với từng khoảnh khắc được chăm chút bằng dịch vụ tận tâm.',
                'Set on an ocean-facing hillside, The Nam Du Hill Resort is the ideal stop for anyone seeking calm and comfort. Every moment here is shaped by attentive, personal service.',
            ),
            t(
                'Hệ thống phòng tiện nghi, không gian café & bar trên cao cùng đội ngũ nhân viên thân thiện sẽ mang lại cho bạn những ngày thư giãn trọn vẹn. Từ dịch vụ đưa đón, hỗ trợ tour khám phá đảo đến các tiện ích trải nghiệm địa phương tất cả đều được thiết kế để tối đa sự thoải mái cho du khách.',
                'Well-appointed rooms, a rooftop café & bar and a warm team make for genuinely restful days. From pier transfers and island tours to local experiences, everything is designed around your comfort.',
            ),
        ],
        services: [
            t('Dịch vụ lưu trú', 'Accommodation'),
            t('Nhà hàng & Bar', 'Restaurant & Bar'),
            t('Hồ bơi vô cực', 'Infinity pool'),
            t('BBQ & Karaoke', 'BBQ & Karaoke'),
        ],
    },

    rooms: [
        {
            id: 'room-suite-garden',
            name: t('Suite 02 phòng ngủ · 06 khách', 'Two-bedroom Suite · 6 guests'),
            desc: t(
                '03 giường đôi · 02 phòng ngủ · view vườn',
                '3 double beds · 2 bedrooms · garden view',
            ),
            area: '48 m²',
            guests: 6,
            price: 4287000,
            tags: [
                t('View vườn', 'Garden view'),
                t('Gia đình', 'Family'),
                t('Bếp nhỏ', 'Kitchenette'),
            ],
        },
        {
            id: 'room-suite-sea',
            name: t('Suite 02 phòng ngủ · 06 khách', 'Two-bedroom Suite · 6 guests'),
            desc: t(
                '02 phòng ngủ · 03 giường đôi · view biển',
                '2 bedrooms · 3 double beds · sea view',
            ),
            area: '48 m²',
            guests: 6,
            price: 4287000,
            tags: [
                t('View biển', 'Sea view'),
                t('Ban công', 'Balcony'),
                t('Ngắm hoàng hôn', 'Sunset'),
            ],
        },
        {
            id: 'room-suite-8',
            name: t('Suite 02 phòng ngủ · 08 khách', 'Two-bedroom Suite · 8 guests'),
            desc: t(
                '02 phòng ngủ: 04 giường đơn · 02 giường đôi cực lớn',
                '2 bedrooms: 4 singles · 2 extra-large doubles',
            ),
            area: '56 m²',
            guests: 8,
            price: 5662000,
            tags: [
                t('Nhóm bạn', 'Groups'),
                t('2 nhà vệ sinh', '2 bathrooms'),
                t('View biển', 'Sea view'),
            ],
        },
        {
            id: 'room-triple-balcony',
            name: t('Phòng 03 người · Có ban công', 'Triple Room · Balcony'),
            desc: t(
                'Ban công rộng · hướng thung lũng và biển',
                'Wide balcony · valley and sea view',
            ),
            area: '32 m²',
            guests: 3,
            price: 2411000,
            tags: [t('Ban công rộng', 'Wide balcony'), t('View thung lũng', 'Valley view')],
        },
        {
            id: 'room-triple-valley',
            name: t('Phòng 03 người · Hướng thung lũng / biển', 'Triple Room · Valley / Sea'),
            desc: t('Hướng nhìn ra biển và thung lũng', 'Facing the sea and the valley'),
            area: '26 m²',
            guests: 3,
            price: 2411000,
            tags: [t('Yên tĩnh', 'Quiet'), t('Hợp cặp đôi', 'Good for couples')],
        },
        {
            id: 'room-family-sea',
            name: t('First Floor Family · Sea View', 'First Floor Family · Sea View'),
            desc: t(
                '01 giường đôi trung và 01 giường đôi lớn',
                'One medium and one large double bed',
            ),
            area: '51 m²',
            guests: 4,
            price: 2087000,
            tags: [
                t('Tầng 1', 'Ground floor'),
                t('Gia đình', 'Family'),
                t('View biển', 'Sea view'),
            ],
        },
        {
            id: 'room-family-seaview',
            name: t('Phòng gia đình nhìn ra biển', 'Family Room with Sea View'),
            desc: t(
                'Ban công riêng, ghế trứng thư giãn, nhiều cửa sổ lớn',
                'Private balcony, egg lounge chair, large windows',
            ),
            area: '28 m²',
            guests: 2,
            price: 1890000,
            tags: [
                t('View biển', 'Sea view'),
                t('Ban công riêng', 'Private balcony'),
                t('Gia đình', 'Family'),
            ],
        },
    ],

    roomExtras: {
        'room-suite-garden': {
            maxGuests: 8,
            defaultGuests: 6,
            extraBed: 450000,
            bed: t('03 giường đôi', 'Three double beds'),
            view: t('Nhìn ra sân vườn rộng và xanh mát', 'Spacious green garden view'),
            long: t(
                'Suite 02 phòng ngủ với diện tích 48 m², thích hợp cho gia đình hoặc nhóm bạn 6–8 người. Không gian ấm cúng, thiết kế hiện đại hòa quyện với cảnh quan thiên nhiên bao quanh.',
                'Two-bedroom Suite with 48 m² space, ideal for families or groups of 6–8. Warm atmosphere and modern design surrounded by lush greenery.',
            ),
            long2: t(
                'Phòng được trang bị đầy đủ tiện nghi, góc bếp nhỏ tiện lợi và phòng tắm riêng biệt mang lại sự thoải mái tối đa.',
                'Equipped with full amenities, a convenient kitchenette, and a private bathroom for maximum comfort.',
            ),
            amenities: [
                t('Phòng không hút thuốc', 'Non-smoking room'),
                t('Đồ vệ sinh cá nhân miễn phí', 'Free toiletries'),
                t('Sử dụng hồ bơi và bida', 'Pool and billiards access'),
                t('Máy điều hòa', 'Air conditioning'),
                t('Bếp nhỏ', 'Kitchenette'),
                t('Mini bar (có tính phí)', 'Mini bar (chargeable)'),
                t('Dép mang trong nhà', 'Indoor slippers'),
                t('Ấm đun nước', 'Electric kettle'),
                t('Máy sấy tóc', 'Hair dryer'),
                t('Áo choàng tắm', 'Bathrobe'),
            ],
            conditions: [
                t('Không hút thuốc trong phòng', 'No smoking in the room'),
                t(
                    'Nhận phòng từ 14:00 · trả phòng trước 12:00',
                    'Check in from 14:00 · check out before 12:00',
                ),
                t(
                    'Trẻ dưới 6 tuổi ngủ chung miễn phí',
                    'Children under 6 stay free when sharing',
                ),
                t(
                    'Huỷ miễn phí trước 72 giờ',
                    'Free cancellation up to 72 hours before',
                ),
            ],
        },
        'room-suite-sea': {
            maxGuests: 8,
            defaultGuests: 6,
            extraBed: 450000,
            bed: t('03 giường đôi lớn', 'Three large double beds'),
            view: t('Nhìn thẳng ra biển Nam Du và hoàng hôn', 'Direct view of Nam Du sea and sunset'),
            long: t(
                'Suite 02 phòng ngủ hướng biển rộng 48 m² có ban công rộng ngắm trọn hoàng hôn Nam Du. Lựa chọn hàng đầu cho các chuyến du lịch gia đình hoặc nhóm bạn.',
                'Sea-view 48 m² two-bedroom suite with a wide balcony for sunset views. Top choice for family vacations and group trips.',
            ),
            long2: t(
                'Cửa kính lớn đón trọn ánh nắng tự nhiên và luồng gió biển trong lành, mang đến những khoảnh khắc nghỉ dưỡng tuyệt vời.',
                'Large glass doors let in natural sunlight and fresh ocean breezes for a memorable holiday.',
            ),
            amenities: [
                t('Phòng không hút thuốc', 'Non-smoking room'),
                t('Đồ vệ sinh cá nhân miễn phí', 'Free toiletries'),
                t('Sử dụng hồ bơi và bida', 'Pool and billiards access'),
                t('Máy điều hòa', 'Air conditioning'),
                t('Ban công hướng biển', 'Sea-view balcony'),
                t('Mini bar (có tính phí)', 'Mini bar (chargeable)'),
                t('Dép mang trong nhà', 'Indoor slippers'),
                t('Ấm đun nước', 'Electric kettle'),
                t('Máy sấy tóc', 'Hair dryer'),
                t('Áo choàng tắm', 'Bathrobe'),
            ],
            conditions: [
                t('Không hút thuốc trong phòng', 'No smoking in the room'),
                t(
                    'Nhận phòng từ 14:00 · trả phòng trước 12:00',
                    'Check in from 14:00 · check out before 12:00',
                ),
                t(
                    'Trẻ dưới 6 tuổi ngủ chung miễn phí',
                    'Children under 6 stay free when sharing',
                ),
                t(
                    'Huỷ miễn phí trước 72 giờ',
                    'Free cancellation up to 72 hours before',
                ),
            ],
        },
        'room-suite-8': {
            maxGuests: 10,
            defaultGuests: 8,
            extraBed: 450000,
            bed: t('04 giường đơn & 02 giường đôi cực lớn', 'Four single & two extra-large double beds'),
            view: t('Toàn cảnh biển ngọc và quần đảo', 'Panoramic ocean view of archipelago'),
            long: t(
                'Căn Suite lớn nhất resort với diện tích 56 m², 02 phòng ngủ độc lập và 02 nhà vệ sinh riêng. Sức chứa tiêu chuẩn 8 người, tối đa 10 người.',
                'The resort’s largest suite with 56 m², 2 separate bedrooms and 2 private bathrooms. Standard capacity for 8 guests, up to 10.',
            ),
            long2: t(
                'Không gian sinh hoạt chung rộng rãi, lý tưởng cho đoàn du lịch lớn cần sự thoải mái và tiện nghi đồng bộ.',
                'Spacious communal living area, ideal for large travel groups desiring convenience and comfort.',
            ),
            amenities: [
                t('Phòng không hút thuốc', 'Non-smoking room'),
                t('Đồ vệ sinh cá nhân miễn phí', 'Free toiletries'),
                t('Sử dụng hồ bơi và bida', 'Pool and billiards access'),
                t('Máy điều hòa', 'Air conditioning'),
                t('02 Nhà vệ sinh riêng', '2 Private bathrooms'),
                t('Mini bar (có tính phí)', 'Mini bar (chargeable)'),
                t('Dép mang trong nhà', 'Indoor slippers'),
                t('Ấm đun nước', 'Electric kettle'),
                t('Máy sấy tóc', 'Hair dryer'),
                t('Áo choàng tắm', 'Bathrobe'),
            ],
            conditions: [
                t('Không hút thuốc trong phòng', 'No smoking in the room'),
                t(
                    'Nhận phòng từ 14:00 · trả phòng trước 12:00',
                    'Check in from 14:00 · check out before 12:00',
                ),
                t(
                    'Trẻ dưới 6 tuổi ngủ chung miễn phí',
                    'Children under 6 stay free when sharing',
                ),
                t(
                    'Huỷ miễn phí trước 72 giờ',
                    'Free cancellation up to 72 hours before',
                ),
            ],
        },
        'room-triple-balcony': {
            maxGuests: 4,
            defaultGuests: 3,
            extraBed: 450000,
            bed: t('01 giường đôi lớn & 01 giường đơn', 'One king bed & one single bed'),
            view: t('Hướng thung lũng xanh và một góc biển', 'Facing green valley and sea view'),
            long: t(
                'Phòng 32 m² sở hữu ban công riêng rộng rãi lộng gió. Phù hợp cho nhóm 3 bạn trẻ hoặc gia đình nhỏ có trẻ em.',
                '32 m² room featuring a broad, breezy private balcony. Perfect for groups of 3 friends or small families.',
            ),
            long2: t(
                'Tận hưởng không khí trong lành buổi sáng từ ban công với tầm nhìn bao quát thung lũng đồi núi Nam Du.',
                'Enjoy crisp morning air from the balcony with panoramic views over Nam Du’s lush hills.',
            ),
            amenities: [
                t('Phòng không hút thuốc', 'Non-smoking room'),
                t('Đồ vệ sinh cá nhân miễn phí', 'Free toiletries'),
                t('Sử dụng hồ bơi và bida', 'Pool and billiards access'),
                t('Máy điều hòa', 'Air conditioning'),
                t('Ban công rộng', 'Spacious balcony'),
                t('Mini bar (có tính phí)', 'Mini bar (chargeable)'),
                t('Dép mang trong nhà', 'Indoor slippers'),
                t('Ấm đun nước', 'Electric kettle'),
                t('Máy sấy tóc', 'Hair dryer'),
            ],
            conditions: [
                t('Không hút thuốc trong phòng', 'No smoking in the room'),
                t(
                    'Nhận phòng từ 14:00 · trả phòng trước 12:00',
                    'Check in from 14:00 · check out before 12:00',
                ),
                t(
                    'Trẻ dưới 6 tuổi ngủ chung miễn phí',
                    'Children under 6 stay free when sharing',
                ),
                t(
                    'Huỷ miễn phí trước 72 giờ',
                    'Free cancellation up to 72 hours before',
                ),
            ],
        },
        'room-triple-valley': {
            maxGuests: 4,
            defaultGuests: 3,
            extraBed: 450000,
            bed: t('01 giường đôi & 01 giường đơn', 'One double bed & one single bed'),
            view: t('Hướng nhìn thung lũng thiên nhiên yên tĩnh', 'Quiet natural valley view'),
            long: t(
                'Phòng 26 m² ấm cúng hướng về phía thung lũng tĩnh mịch, đem lại không gian nghỉ ngơi thư thái tuyệt đối sau những giờ vui chơi trên biển.',
                'Cozy 26 m² room facing a quiet valley, offering peaceful rest after a long day at sea.',
            ),
            amenities: [
                t('Phòng không hút thuốc', 'Non-smoking room'),
                t('Đồ vệ sinh cá nhân miễn phí', 'Free toiletries'),
                t('Sử dụng hồ bơi và bida', 'Pool and billiards access'),
                t('Máy điều hòa', 'Air conditioning'),
                t('Két sắt an toàn', 'In-room safe'),
                t('Mini bar (có tính phí)', 'Mini bar (chargeable)'),
                t('Dép mang trong nhà', 'Indoor slippers'),
                t('Ấm đun nước', 'Electric kettle'),
                t('Máy sấy tóc', 'Hair dryer'),
            ],
            conditions: [
                t('Không hút thuốc trong phòng', 'No smoking in the room'),
                t(
                    'Nhận phòng từ 14:00 · trả phòng trước 12:00',
                    'Check in from 14:00 · check out before 12:00',
                ),
                t(
                    'Trẻ dưới 6 tuổi ngủ chung miễn phí',
                    'Children under 6 stay free when sharing',
                ),
                t(
                    'Huỷ miễn phí trước 72 giờ',
                    'Free cancellation up to 72 hours before',
                ),
            ],
        },
        'room-family-sea': {
            maxGuests: 5,
            defaultGuests: 4,
            extraBed: 450000,
            bed: t('01 giường đôi trung & 01 giường đôi lớn', 'One medium & one large double bed'),
            view: t('Tầng 1 nhìn thẳng ra vịnh biển Củ Tron', 'Ground floor direct view of Cu Tron bay'),
            long: t(
                'Phòng 51 m² tại tầng 1 với lối đi thuận tiện, diện tích cực rộng rãi dành cho gia đình 4 người. Tầm nhìn mở ra khoảng biển biếc tuyệt đẹp.',
                'Spacious 51 m² ground floor room with easy access, designed for families of 4. Open views facing the sparkling bay.',
            ),
            long2: t(
                'Bố trí nội thất tối giản tinh tế, giường nệm cao cấp giúp cả gia đình có giấc ngủ trọn vẹn.',
                'Minimalist elegant interior with premium mattresses for a restful night.',
            ),
            amenities: [
                t('Phòng không hút thuốc', 'Non-smoking room'),
                t('Đồ vệ sinh cá nhân miễn phí', 'Free toiletries'),
                t('Sử dụng hồ bơi và bida', 'Pool and billiards access'),
                t('Máy điều hòa', 'Air conditioning'),
                t('Két sắt an toàn', 'In-room safe'),
                t('Mini bar (có tính phí)', 'Mini bar (chargeable)'),
                t('Dép mang trong nhà', 'Indoor slippers'),
                t('Ấm đun nước', 'Electric kettle'),
                t('Máy sấy tóc', 'Hair dryer'),
                t('Áo choàng tắm', 'Bathrobe'),
            ],
            conditions: [
                t('Không hút thuốc trong phòng', 'No smoking in the room'),
                t(
                    'Nhận phòng từ 14:00 · trả phòng trước 12:00',
                    'Check in from 14:00 · check out before 12:00',
                ),
                t(
                    'Trẻ dưới 6 tuổi ngủ chung miễn phí',
                    'Children under 6 stay free when sharing',
                ),
                t(
                    'Huỷ miễn phí trước 72 giờ',
                    'Free cancellation up to 72 hours before',
                ),
            ],
        },
        'room-family-seaview': {
            maxGuests: 4,
            defaultGuests: 2,
            extraBed: 450000,
            bed: t('01 giường đôi lớn', 'One king bed'),
            view: t('Nhìn ra biển và sân vườn', 'Sea and garden view'),
            long: t(
                'Phòng có ban công riêng, diện tích khoảng 28 m², trang bị tủ áo và 01 ghế hình trứng thư giãn, wifi miễn phí. Phòng tắm, bàn lavabo và WC được bố trí chia khu riêng biệt, vòi tắm hoa sen kèm bộ tiện ích phòng tắm đa dạng.',
                'A private balcony, about 28 m², with a wardrobe and an egg lounge chair, free wifi. Bathroom, vanity and WC are laid out in separate zones, with a rain shower and a full set of bathroom amenities.',
            ),
            long2: t(
                'Nhiều khung cửa sổ lớn đón ánh sáng và gió mát tự nhiên. Nhìn từ trên đồi cao xuống thung lũng là một mảng xanh của hoa lá xung quanh, mang lại cảm giác thư giãn và rất gần gũi với thiên nhiên.',
                'Large windows bring in daylight and sea breeze. Looking down from the hill, the valley is a green sweep of foliage — restful and close to nature.',
            ),
            amenities: [
                t('Phòng không hút thuốc', 'Non-smoking room'),
                t('Đồ vệ sinh cá nhân miễn phí', 'Free toiletries'),
                t('Sử dụng hồ bơi và bida', 'Pool and billiards access'),
                t('Máy điều hòa', 'Air conditioning'),
                t('Két sắt an toàn', 'In-room safe'),
                t('Mini bar (có tính phí)', 'Mini bar (chargeable)'),
                t('Dép mang trong nhà', 'Indoor slippers'),
                t('Ấm đun nước', 'Electric kettle'),
                t('Máy sấy tóc', 'Hair dryer'),
                t('Áo choàng tắm', 'Bathrobe'),
            ],
            conditions: [
                t('Không hút thuốc trong phòng', 'No smoking in the room'),
                t(
                    'Nhận phòng từ 14:00 · trả phòng trước 12:00',
                    'Check in from 14:00 · check out before 12:00',
                ),
                t(
                    'Trẻ dưới 6 tuổi ngủ chung miễn phí',
                    'Children under 6 stay free when sharing',
                ),
                t(
                    'Huỷ miễn phí trước 72 giờ',
                    'Free cancellation up to 72 hours before',
                ),
            ],
        },
    },

    addons: [
        {
            id: 'addon-extrabed',
            name: t('Giường phụ', 'Extra bed'),
            price: 450000,
            unit: t('khách / đêm', 'guest / night'),
        },
        {
            id: 'addon-ferry',
            name: t('Vé tàu cao tốc khứ hồi', 'Return speedboat ticket'),
            price: 450000,
            unit: t('khách', 'guest'),
        },
        {
            id: 'addon-bike',
            name: t('Thuê xe máy vòng đảo', 'Motorbike rental'),
            price: 150000,
            unit: t('xe / ngày', 'bike / day'),
        },
        {
            id: 'addon-bbq',
            name: t('Set BBQ hải sản', 'Seafood BBQ set'),
            price: 320000,
            unit: t('khách', 'guest'),
        },
        {
            id: 'addon-tour',
            name: t('Tour lặn ngắm san hô', 'Snorkelling tour'),
            price: 400000,
            unit: t('khách', 'guest'),
        },
        {
            id: 'addon-pickup',
            name: t('Đưa đón bến tàu Bãi Chệt', 'Bai Chet pier transfer'),
            price: 0,
            unit: t('miễn phí', 'free'),
        },
    ],

    dining: [
        {
            id: 'dining-cafe',
            name: t('Nam Du Hill Coffee', 'Nam Du Hill Coffee'),
            desc: t(
                'Cà phê phin, trà đảo và mocktail trên tầng cao nhìn thẳng ra biển.',
                'Vietnamese drip coffee, island teas and mocktails on the rooftop.',
            ),
            note: t('06:30 – 22:00', '06:30 – 22:00'),
            image: '/uploads/nha-hang-view-bien.jpg',
        },
        {
            id: 'dining-bbq',
            name: t('BBQ hải sản ngoài trời', 'Outdoor Seafood BBQ'),
            desc: t(
                'Cá xương xanh nướng giấy bạc, nhum nướng mỡ hành, ghẹ xanh hấp bia.',
                'Foil-grilled needlefish, sea urchin with scallion oil, beer-steamed crab.',
            ),
            note: t('Từ 320.000đ / khách', 'From 320,000₫ per guest'),
            image: '/uploads/hoang-hon.jpg',
        },
        {
            id: 'dining-hotpot',
            name: t('Lẩu cá bớp Nam Du', 'Nam Du Cobia Hotpot'),
            desc: t(
                'Cá bớp nuôi lồng bè Hòn Ngang, nấu cùng rau rừng và me chua.',
                'Cobia raised in Hon Ngang floating pens, cooked with island greens.',
            ),
            note: t('Phục vụ theo nhóm 4–8 khách', 'Serves 4–8 guests'),
            image: '/uploads/hero-1.jpg',
        },
        {
            id: 'dining-bar',
            name: t('Sunset Bar & Karaoke', 'Sunset Bar & Karaoke'),
            desc: t(
                'Cocktail đảo, bia lạnh và phòng karaoke riêng cho nhóm.',
                'Island cocktails, cold beer and a private karaoke room.',
            ),
            note: t('17:00 – 24:00', '17:00 – 24:00'),
            image: '/uploads/hero-4.png',
        },
    ],

    tours: [
        {
            id: 'tour-2n1d',
            code: '2N1Đ',
            name: t('Nam Du 2 ngày 1 đêm', 'Nam Du 2 days 1 night'),
            summary: t(
                'Nén chặt các điểm cốt lõi, tối ưu cho cuối tuần.',
                'Core highlights, ideal for a weekend.',
            ),
            price: 2590000,
            days: [
                {
                    label: t('Ngày 1 · Rạch Giá → Nam Du', 'Day 1 · Rach Gia → Nam Du'),
                    items: [
                        t(
                            '06:00 — Đến cảng Rạch Giá, ăn sáng và làm thủ tục lên tàu cao tốc.',
                            '06:00 — Arrive at Rach Gia port, breakfast and ferry check-in.',
                        ),
                        t(
                            '08:00 — Tàu cao tốc ra Hòn Củ Tron (2–3 giờ). Nhận phòng tại resort.',
                            '08:00 — Speedboat to Hon Cu Tron (2–3 hrs). Check in at the resort.',
                        ),
                        t(
                            '13:30 — Tàu gỗ khám phá Hòn Mấu, Hòn Dầu, Hòn Hai Bờ Đập; lặn ngắm san hô.',
                            '13:30 — Wooden boat to Hon Mau, Hon Dau, Hon Hai Bo Dap; snorkelling.',
                        ),
                        t(
                            '18:30 — BBQ hải sản tại resort, karaoke và ngắm sao.',
                            '18:30 — Seafood BBQ at the resort, karaoke and stargazing.',
                        ),
                    ],
                },
                {
                    label: t('Ngày 2 · Vòng đảo → về đất liền', 'Day 2 · Island loop → mainland'),
                    items: [
                        t(
                            '06:00 — Ngắm bình minh, cà phê trên tầng cao.',
                            '06:00 — Sunrise and rooftop coffee.',
                        ),
                        t(
                            '07:30 — Xe máy vòng cung đường 11 km: Bãi Cây Mến, Bãi Ngự, Hải đăng Nam Du.',
                            '07:30 — Motorbike the 11 km loop: Bai Cay Men, Bai Ngu, Nam Du lighthouse.',
                        ),
                        t(
                            '11:00 — Trả phòng, ăn trưa hải sản tại Bãi Chệt.',
                            '11:00 — Check out, seafood lunch at Bai Chet.',
                        ),
                        t(
                            '13:00 — Tàu cao tốc về Rạch Giá, kết thúc hành trình.',
                            '13:00 — Ferry back to Rach Gia, end of trip.',
                        ),
                    ],
                },
            ],
        },
        {
            id: 'tour-3n2d',
            code: '3N2Đ',
            name: t('Nam Du 3 ngày 2 đêm', 'Nam Du 3 days 2 nights'),
            summary: t(
                'Nhịp độ thong thả, đi sâu vào đời sống làng chài.',
                'A slower pace, deeper into fishing-village life.',
            ),
            price: 3890000,
            days: [
                {
                    label: t('Ngày 1 · Làm quen Hòn Lớn', 'Day 1 · Getting to know Hon Lon'),
                    items: [
                        t(
                            '08:00 — Tàu cao tốc Rạch Giá → Nam Du, nhận phòng và nghỉ trưa.',
                            '08:00 — Ferry Rach Gia → Nam Du, check in and rest.',
                        ),
                        t(
                            '15:00 — Tắm biển Bãi Cây Mến dưới hàng dừa 70–80 năm tuổi.',
                            '15:00 — Swim at Bai Cay Men under 70–80-year-old coconut palms.',
                        ),
                        t(
                            '18:00 — Chợ hải sản Bãi Chệt, ăn tối tại làng chài.',
                            '18:00 — Bai Chet seafood market, dinner in the village.',
                        ),
                    ],
                },
                {
                    label: t('Ngày 2 · Tour 4 đảo', 'Day 2 · Four-island tour'),
                    items: [
                        t(
                            '07:30 — Tàu gỗ đi Hòn Mấu (5 bãi biển), Hòn Ngang, Hòn Dầu, Hòn Hai Bờ Đập.',
                            '07:30 — Wooden boat to Hon Mau (5 beaches), Hon Ngang, Hon Dau, Hon Hai Bo Dap.',
                        ),
                        t(
                            '11:30 — Ăn trưa trên nhà bè nổi Hòn Ngang, thưởng thức cá bớp tươi.',
                            '11:30 — Lunch on a floating raft house at Hon Ngang.',
                        ),
                        t(
                            '14:00 — Lặn ngắm san hô và chèo SUP tại Hòn Hai Bờ Đập.',
                            '14:00 — Snorkelling and SUP at Hon Hai Bo Dap.',
                        ),
                        t(
                            '19:00 — Cháo nhum và BBQ tại resort.',
                            '19:00 — Sea-urchin porridge and BBQ at the resort.',
                        ),
                    ],
                },
                {
                    label: t('Ngày 3 · Văn hóa & mua sắm', 'Day 3 · Culture & shopping'),
                    items: [
                        t(
                            '06:30 — Lên Hải đăng Nam Du (hơn 300m) ngắm toàn cảnh 21 hòn đảo.',
                            '06:30 — Climb Nam Du lighthouse (300m+) for the full 21-island view.',
                        ),
                        t(
                            '09:00 — Dinh Ông Nam Hải và Miếu Bà Chúa Xứ.',
                            '09:00 — Dinh Ong Nam Hai and Mieu Ba Chua Xu.',
                        ),
                        t(
                            '11:00 — Mua khô mực một nắng, khô cá xương xanh, nước mắm Nam Du.',
                            '11:00 — Buy dried squid, dried needlefish and Nam Du fish sauce.',
                        ),
                        t('13:00 — Tàu cao tốc về Rạch Giá.', '13:00 — Ferry back to Rach Gia.'),
                    ],
                },
            ],
        },
    ],

    places: [
        {
            id: 'place-cay-men',
            name: t('Bãi Cây Mến', 'Bai Cay Men'),
            tag: t('Bãi tắm', 'Beach'),
            desc: t(
                'Vịnh kín gió, cát trắng mịn, hàng dừa cổ thụ 70–80 năm tuổi nghiêng bóng ra biển.',
                'A wind-sheltered bay with fine white sand and 70–80-year-old coconut palms.',
            ),
            image: '/uploads/du-lich-bai-cay-men-nam-du.jpg',
        },
        {
            id: 'place-bai-ngu',
            name: t('Bãi Ngự & Giếng Ngự', "Bai Ngu & the King's Well"),
            tag: t('Lịch sử', 'History'),
            desc: t(
                'Nơi vua Gia Long từng dừng chân; giếng nước ngọt sát biển không bao giờ cạn.',
                'Where King Gia Long once sheltered; a freshwater well by the sea that never runs dry.',
            ),
            image: '/uploads/hero-2.jpg',
        },
        {
            id: 'place-hai-dang',
            name: t('Hải đăng Nam Du', 'Nam Du Lighthouse'),
            tag: t('Ngắm toàn cảnh', 'Viewpoint'),
            desc: t(
                'Trên đỉnh đồi hơn 300m — một trong những hải đăng cao nhất Việt Nam, thu trọn 21 hòn đảo.',
                "On a 300m+ hilltop, one of Vietnam's highest lighthouses, overlooking all 21 islands.",
            ),
            image: '/uploads/hai-dang-Ke-Ga-2.jpg',
        },
        {
            id: 'place-hon-mau',
            name: t('Hòn Mấu', 'Hon Mau'),
            tag: t('Đảo vệ tinh', 'Satellite island'),
            desc: t(
                'Năm bãi biển khác biệt: Bãi Chướng, Bãi Nam cát trắng; Bãi Bắc và Bãi Đá Đen đá cuội bóng.',
                'Five distinct beaches: white sand at Bai Chuong and Bai Nam, black pebbles at Bai Da Den.',
            ),
            image: '/uploads/du-lich-hon-mau.jpg',
        },
        {
            id: 'place-hai-bo-dap',
            name: t('Hòn Hai Bờ Đập', 'Hon Hai Bo Dap'),
            tag: t('Lặn san hô', 'Snorkelling'),
            desc: t(
                '"Maldives thu nhỏ" của Nam Du — hai đảo nối nhau bằng dải đá tự nhiên, nước nông và trong.',
                "Nam Du's \"mini Maldives\" — two islets joined by a natural stone spit, shallow and clear.",
            ),
            image: '/uploads/honhaibodap.jpg',
        },
        {
            id: 'place-hon-dau',
            name: t('Hòn Dầu', 'Hon Dau'),
            tag: t('Check-in', 'Photo spot'),
            desc: t(
                'Hơn 90% diện tích là rừng nguyên sinh; rặng dừa ngả ra biển và xích đu gỗ trên nước.',
                'Over 90% primary forest; palms leaning over the water and a wooden swing in the sea.',
            ),
            image: '/uploads/lan-ngan-san-ho.jpg',
        },
        {
            id: 'place-hon-ngang',
            name: t('Hòn Ngang', 'Hon Ngang'),
            tag: t('Làng bè', 'Floating village'),
            desc: t(
                'Vùng biển êm nhất quần đảo, trung tâm nuôi hải sản lồng bè — ăn cá bớp ngay trên bè.',
                'The calmest water in the archipelago and its aquaculture hub — eat cobia on the raft.',
            ),
            image: '/uploads/ho-boi.jpg',
        },
        {
            id: 'place-bai-chet',
            name: t('Bãi Chệt', 'Bai Chet'),
            tag: t('Chợ & bến tàu', 'Market & pier'),
            desc: t(
                'Bến tàu chính, chợ hải sản tươi sống và trung tâm dịch vụ sầm uất nhất trên đảo.',
                "The main pier, the fresh seafood market and the island's busiest service hub.",
            ),
            image: '/uploads/nha-hang-view-bien.jpg',
        },
    ],

    transport: [
        {
            leg: t('TP.HCM → Rạch Giá', 'HCMC → Rach Gia'),
            mode: t(
                'Xe giường nằm chạy đêm (23:00 → 06:00)',
                'Overnight sleeper bus (23:00 → 06:00)',
            ),
            price: t('210.000 – 250.000đ', '210,000 – 250,000₫'),
        },
        {
            leg: t('Rạch Giá → Nam Du', 'Rach Gia → Nam Du'),
            mode: t(
                'Tàu cao tốc, 2–3 giờ (Superdong, Phú Quốc Express…)',
                'Speedboat, 2–3 hrs (Superdong, Phu Quoc Express…)',
            ),
            price: t('~225.000đ / lượt', '~225,000₫ one way'),
        },
        {
            leg: t('Di chuyển trên đảo', 'Getting around the island'),
            mode: t(
                'Xe máy tự lái, cung đường vòng đảo 11 km',
                'Self-drive motorbike on the 11 km island loop',
            ),
            price: t('120.000 – 150.000đ / ngày', '120,000 – 150,000₫ per day'),
        },
        {
            leg: t('Tham quan đảo vệ tinh', 'Satellite island tour'),
            mode: t(
                'Tàu gỗ du lịch, ghép đoàn hoặc trọn gói',
                'Wooden tour boat, shared or private',
            ),
            price: t('200.000 – 400.000đ / khách', '200,000 – 400,000₫ per guest'),
        },
    ],

    faq: [
        {
            q: t('Đi Nam Du thời điểm nào đẹp nhất?', 'When is the best time to visit Nam Du?'),
            a: t(
                'Mùa khô từ tháng 12 đến tháng 3: biển êm, nước trong, ít say sóng và thuận lợi cho lặn ngắm san hô.',
                'The dry season from December to March: calm sea, clear water, less seasickness and ideal snorkelling.',
            ),
        },
        {
            q: t('Cần mang giấy tờ gì?', 'What documents do I need?'),
            a: t(
                'Bắt buộc mang CCCD hoặc giấy phép lái xe để làm thủ tục lên tàu. Khách quốc tế cần tìm hiểu trước quy định khu vực biên giới biển.',
                'You must carry a valid ID or driving licence for ferry check-in. International guests should check border-area regulations in advance.',
            ),
        },
        {
            q: t('Resort có hỗ trợ đặt vé tàu không?', 'Can the resort book ferry tickets?'),
            a: t(
                'Có. Chúng tôi giữ vé khứ hồi và đón khách tại bến tàu Bãi Chệt khi bạn đặt combo trọn gói.',
                'Yes. We hold return tickets and meet you at Bai Chet pier when you book a bundle.',
            ),
        },
        {
            q: t('Nếu biển động thì sao?', 'What if the sea gets rough?'),
            a: t(
                'Khi gió vượt cấp 6, tàu tuyến Rạch Giá – Nam Du tạm dừng. Chúng tôi hỗ trợ đổi ngày miễn phí trong trường hợp này.',
                'Ferries stop when winds exceed force 6. We reschedule your stay free of charge in that case.',
            ),
        },
        {
            q: t('Trên đảo có ATM không?', 'Are there ATMs on the island?'),
            a: t(
                'Hệ thống ATM còn hạn chế, bạn nên mang đủ tiền mặt cho chi phí ăn uống và thuê xe.',
                'ATMs are limited — bring enough cash for food and motorbike rental.',
            ),
        },
    ],

    notes: [
        t(
            'Đặt phòng và vé tàu trước 2–4 tuần trong cao điểm tháng 12 – tháng 3.',
            'Book rooms and ferry tickets 2–4 weeks ahead in the December–March peak.',
        ),
        t(
            'Không bẻ, đạp hay thu gom san hô — hệ sinh thái biển ở đây rất mong manh.',
            'Do not break, step on or collect coral — the reef here is fragile.',
        ),
        t(
            'Mang theo thuốc chống say sóng và theo dõi dự báo thời tiết trước 3 ngày.',
            'Bring motion-sickness tablets and check the forecast three days ahead.',
        ),
    ],

    gallery: [
        {
            id: 'gallery-beach',
            title: t('Bãi biển riêng', 'Private Beach'),
            subtitle: t('Yên bình & tĩnh lặng', 'Peaceful & Pristine'),
            image: '/uploads/hoang-hon.jpg',
        },
        {
            id: 'gallery-pool',
            title: t('Hồ bơi vô cực', 'Infinity Pool'),
            subtitle: t('View biển 360°', '360° Ocean Panorama'),
            image: '/uploads/ho-boi.jpg',
        },
        {
            id: 'gallery-dining',
            title: t('Nhà hàng view biển', 'Oceanfront Dining'),
            subtitle: t('Ẩm thực hải sản tươi sống', 'Fresh Island Seafood'),
            image: '/uploads/nha-hang-view-bien.jpg',
        },
        {
            id: 'gallery-diving',
            title: t('Lặn ngắm san hô', 'Coral Reef Diving'),
            subtitle: t('Khám phá đại dương', 'Underwater Discovery'),
            image: '/uploads/lan-ngan-san-ho.jpg',
        },
    ],

    /**
     * `icon` là tên icon dạng chuỗi, không phải component — `core` không chứa
     * JSX (luật R2). Theme tự ánh xạ tên sang bộ icon nó dùng.
     */
    amenities: [
        {
            id: 'amenity-pool',
            icon: 'waves',
            label: t('Hồ bơi vô cực', 'Infinity Pool'),
            desc: t('View biển', 'Sea view'),
        },
        {
            id: 'amenity-restaurant',
            icon: 'utensils',
            label: t('Nhà hàng', 'Restaurant'),
            desc: t('Ẩm thực đa dạng', 'Diverse cuisine'),
        },
        {
            id: 'amenity-wifi',
            icon: 'wifi',
            label: t('Wi-Fi miễn phí', 'Free Wi-Fi'),
            desc: t('Tốc độ cao', 'High speed'),
        },
        {
            id: 'amenity-transfer',
            icon: 'bus',
            label: t('Đưa đón', 'Transfer'),
            desc: t('Xe đưa đón tận nơi', 'Door-to-door shuttle'),
        },
        {
            id: 'amenity-pier-transfer',
            icon: 'car',
            label: t('Đón tiễn bến tàu miễn phí', 'Free pier transfer'),
        },
        {
            id: 'amenity-bike',
            icon: 'bike',
            label: t('Thuê xe máy', 'Motorbike rental'),
            desc: t('Khám phá đảo', 'Explore the island'),
        },
        {
            id: 'amenity-event',
            icon: 'sparkles',
            label: t('Tổ chức sự kiện', 'Event organizing'),
            desc: t('Hội nghị, tiệc cưới', 'Conferences, weddings'),
        },
        {
            id: 'amenity-canoe',
            icon: 'anchor',
            label: t('Tour cano lặn ngắm san hô', 'Private canoe & snorkeling'),
        },
        {
            id: 'amenity-breakfast',
            icon: 'utensils',
            label: t('Bữa sáng ngắm biển', 'Seaview breakfast'),
        },
        {
            id: 'amenity-billiards',
            icon: 'gamepad',
            label: t('Bàn bida & giải trí', 'Billiards & games'),
        },
        {
            id: 'amenity-support',
            icon: 'headphones',
            label: t('Hỗ trợ 24/7', '24/7 support'),
        },
    ],

    reviews: [
        {
            id: 'review-ngoc-anh',
            name: 'Ngọc Anh (TP.HCM)',
            date: '2026-05',
            rating: 5,
            comment: t(
                'Chủ nhà nhắn tin trước một ngày hỏi chuyến tàu mấy giờ, rồi có người chờ sẵn ở bến. Đi đảo mà không phải lo khâu nào.',
                'The host messaged a day ahead to ask which ferry we were on, then someone was waiting at the pier. Nothing left for us to arrange.',
            ),
        },
        {
            id: 'review-minh-tri',
            name: 'Minh Trí (Cần Thơ)',
            date: '2026-05',
            rating: 5,
            comment: t(
                'Dậy sớm ngồi ngoài hiên xem mặt trời lên khỏi mặt biển. Hai đêm ở đây đáng giá hơn cả tuần nghỉ ở chỗ đông người.',
                'We got up early and watched the sun come off the water from the terrace. Two nights here beat a whole week somewhere crowded.',
            ),
        },
        {
            id: 'review-thu-ha',
            name: 'Thu Hà (Hà Nội)',
            date: '2026-04',
            rating: 5,
            comment: t(
                'Phòng nhìn thẳng ra vịnh, sáng mở cửa là thấy biển. Đúng như ảnh, không có chuyện ảnh một đằng phòng một nẻo.',
                'The room looks straight onto the bay — you open the door in the morning and there it is. Exactly like the photos, no surprises.',
            ),
        },
        {
            id: 'review-quoc-bao',
            name: 'Quốc Bảo (Đà Nẵng)',
            date: '2026-04',
            rating: 5,
            comment: t(
                'Đi bốn người, thuê xe máy ngay tại resort rồi chạy vòng đảo. Chủ nhà chỉ đường tới mấy bãi vắng mà Google Maps không có.',
                'Four of us rented bikes right at the resort and rode around the island. The host pointed us to quiet beaches Google Maps does not show.',
            ),
        },
        {
            id: 'review-lan-phuong',
            name: 'Lan Phương (Bình Dương)',
            date: '2026-03',
            rating: 5,
            comment: t(
                'Bữa sáng ăn ngoài nhà hàng nhìn ra biển, cá mới đánh về nên ngọt. Bé nhà mình ăn hết cả phần người lớn.',
                'Breakfast at the seaside restaurant, with fish caught that morning. Our little one finished an adult portion.',
            ),
        },
        {
            id: 'review-duc-huy',
            name: 'Đức Huy (Nha Trang)',
            date: '2026-03',
            rating: 4,
            comment: t(
                'Hồ bơi vắng, chiều nào cũng gần như của riêng mình. Buổi tối ra bàn bi-a ngồi với mấy nhóm khách khác, vui.',
                'The pool was quiet — most afternoons we had it to ourselves. Evenings we played pool with the other guests.',
            ),
        },
        {
            id: 'review-kim-oanh',
            name: 'Kim Oanh (Rạch Giá)',
            date: '2026-02',
            rating: 5,
            comment: t(
                'Lần đầu ra đảo nên khá lo. Nhắn gì cũng được trả lời trong vài phút, kể cả lúc mười giờ đêm hỏi chuyện tàu về.',
                'It was our first island trip and we were nervous. Every message got an answer within minutes, even asking about the return ferry at ten at night.',
            ),
        },
        {
            id: 'review-thanh-tung',
            name: 'Thanh Tùng (Vũng Tàu)',
            date: '2026-02',
            rating: 5,
            comment: t(
                'Đưa cả nhà ba thế hệ đi, ông bà đi lại thoải mái vì phòng gần khu ăn uống. Chuyện nhỏ nhưng chỗ khác ít khi tính tới.',
                'We came as three generations. My parents got around easily because the rooms sit close to the dining area — a small thing most places overlook.',
            ),
        },
        {
            id: 'review-hai-yen',
            name: 'Hải Yến (Huế)',
            date: '2026-01',
            rating: 5,
            comment: t(
                'Đi lặn ngắm san hô theo tour chủ nhà giới thiệu, nước trong tới mức nhìn thấy đáy. Về tới nơi đã có nước ấm sẵn để tắm.',
                'We joined the snorkelling trip the host recommended — the water was clear to the bottom. Hot water was ready for us when we got back.',
            ),
        },
    ],
}
