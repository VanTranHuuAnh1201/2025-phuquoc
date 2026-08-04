/**
 * Ánh xạ tên icon (chuỗi trong `@repo/core`) sang component của lucide-react.
 *
 * VÌ SAO Ở APP MÀ KHÔNG Ở CORE: `core` không được chứa JSX hay bất cứ thứ gì
 * gắn với tầng hiển thị (luật R2), nên nó chỉ giữ TÊN icon. Mỗi app/theme tự
 * quyết định tên đó vẽ ra hình gì — theme khác dùng bộ icon khác vẫn đọc chung
 * được một nguồn dữ liệu.
 */

import {
    Anchor,
    Bike,
    Bus,
    Car,
    Gamepad2,
    Headphones,
    Sparkles,
    Utensils,
    Waves,
    Wifi,
    type LucideIcon,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
    anchor: Anchor,
    bike: Bike,
    bus: Bus,
    car: Car,
    gamepad: Gamepad2,
    headphones: Headphones,
    sparkles: Sparkles,
    utensils: Utensils,
    waves: Waves,
    wifi: Wifi,
}

/** Icon theo tên; rơi về `Sparkles` nếu chưa khai để không vỡ giao diện. */
export function iconFor(name: string): LucideIcon {
    return ICONS[name] ?? Sparkles
}
