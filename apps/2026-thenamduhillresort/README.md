# The Nam Du Hill Resort Website

## Mandatory Requirement: Mobile Layout Preservation During Desktop Refactor

> **BẮT BUỘC (MANDATORY)**: Bản Mobile đã hoàn thành trước và phải được bảo vệ 100%, tuyệt đối KHÔNG làm thay đổi, vỡ hay vỡ layout Mobile khi tiến hành Refactor giao diện Desktop.

### Quy tắc triển khai Desktop Layout Refactor:
1. **Phân lập DOM / Component Isolation**:
   - Đối với các Section có cấu trúc UI/DOM trên Desktop khác biệt so với Mobile (Header, Hero Search, Filter Bar...):
     - **Mobile Container**: Tách biệt bằng `block md:hidden` (Giữ nguyên 100% JSX/CSS Mobile đã chốt).
     - **Desktop Container**: Tách biệt bằng `hidden md:block` (Thoải mái nâng cấp HTML/CSS cho Desktop theo `3-desktop.png` / Figma).
2. **Quy tắc Tailwind CSS Mobile-First**:
   - KHÔNG xóa hoặc thay đổi các class mặc định (không có prefix `md:`/`lg:`).
   - Mọi thuộc tính dành riêng cho Desktop BẮT BUỘC phải gắn prefix `md:`, `lg:`, `xl:`.
3. **Kiểm thử Dual-Viewport**:
   - Mọi thay đổi đều phải được kiểm tra lại trên Viewport Mobile (375px) để đảm bảo không bị ảnh hưởng.
