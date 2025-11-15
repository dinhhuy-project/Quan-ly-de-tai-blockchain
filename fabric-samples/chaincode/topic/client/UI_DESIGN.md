# UI/UX Design Document

## Color Scheme

### Primary Colors
- **Blue (#3B82F6)**: Primary actions, headers, navigation
- **Purple (#8B5CF6)**: Secondary actions
- **Green (#10B981)**: Success states, approval
- **Yellow (#F59E0B)**: Warning states, pending
- **Red (#EF4444)**: Danger states, rejection

### Neutral Colors
- **White (#FFFFFF)**: Cards, backgrounds
- **Gray-50 (#F9FAFB)**: Page background
- **Gray-600 (#4B5563)**: Secondary text
- **Gray-900 (#111827)**: Primary text

## Layout Structure

### Header Component
```
┌─────────────────────────────────────────────────────┐
│ [Logo] Quản Lý Đề Tài      User Info   [Logout]   │
│                            Role: Sinh viên         │
│                            Org: Org1               │
└─────────────────────────────────────────────────────┘
```

### Login Page

```
┌────────────────────────────────────┐
│     Quản Lý Đề Tài - Blockchain    │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ ID       [_____________]     │  │
│  │ Tên      [_____________]     │  │
│  │ Vai Trò  [v] Sinh Viên      │  │
│  │ Tổ Chức  [v] Org 1          │  │
│  │                              │  │
│  │    [Đăng Nhập]              │  │
│  └──────────────────────────────┘  │
│                                    │
│  Hệ thống quản lý đề tài dựa    │
│  trên công nghệ Blockchain      │
└────────────────────────────────────┘
```

### Home Page - Student View

```
┌─────────────────────────────────────────────────────┐
│ [Logo] Quản Lý Đề Tài         [User Info] [Logout] │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Các Đề Tài Của Tôi                                 │
│                                                    │
│ [+ Đăng Ký Đề Tài Mới] [Trạng Thái ▼]            │
│                                                    │
│ ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│ │ Topic 1     │  │ Topic 2     │  │ Topic 3     │ │
│ │ TOPIC001    │  │ TOPIC002    │  │ TOPIC003    │ │
│ │ Description │  │ Description │  │ Description │ │
│ │             │  │             │  │             │ │
│ │ Sinh viên:  │  │ Sinh viên:  │  │ Sinh viên:  │ │
│ │ Nguyễn Văn A│  │ Trần Thị B  │  │ Lê Văn C    │ │
│ │             │  │             │  │             │ │
│ │ Lĩnh vực: AI│  │ Lĩnh vực:   │  │ Lĩnh vực:   │ │
│ │             │  │ Blockchain  │  │ Web Dev     │ │
│ │             │  │             │  │             │ │
│ │ [Chờ Duyệt] │  │ [Đã Duyệt]  │  │ [Bị Từ Chối]│ │
│ │             │  │             │  │             │ │
│ │ [Chi tiết]  │  │ [Chi tiết]  │  │ [Chi tiết]  │ │
│ └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Home Page - Supervisor View

```
┌─────────────────────────────────────────────────────┐
│ [Logo] Quản Lý Đề Tài         [User Info] [Logout] │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Đề Tài Cần Duyệt                                   │
│                                                    │
│ [Trạng Thái ▼]                                    │
│                                                    │
│ ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│ │ Topic 1     │  │ Topic 2     │  │ Topic 3     │ │
│ │ TOPIC001    │  │ TOPIC005    │  │ TOPIC008    │ │
│ │             │  │             │  │             │ │
│ │ Sinh viên:  │  │ Sinh viên:  │  │ Sinh viên:  │ │
│ │ Nguyễn Văn A│  │ Hoàng Minh D│  │ Phạm Thị E  │ │
│ │             │  │             │  │             │ │
│ │ [Chờ Duyệt] │  │ [Chờ Duyệt] │  │ [Đã Duyệt]  │ │
│ │             │  │             │  │             │ │
│ │ [Chi tiết]  │  │ [Chi tiết]  │  │ [Chi tiết]  │ │
│ │ [Phê duyệt] │  │ [Phê duyệt] │  │ [Đánh giá]  │ │
│ │ [Từ chối]   │  │ [Từ chối]   │  │             │ │
│ └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Register Topic Page

```
┌─────────────────────────────────────────────────────┐
│ [Logo] Quản Lý Đề Tài         [User Info] [Logout] │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Đăng Ký Đề Tài Mới                                 │
│                                                    │
│ ┌──────────────────────────────────────────────┐  │
│ │                                              │  │
│ │ ID Đề Tài [____________________]             │  │
│ │ Tiêu Đề   [____________________]             │  │
│ │ Mô Tả     [____________________             │  │
│ │           |____________________             │  │
│ │           |____________________|             │  │
│ │                                              │  │
│ │ ID Sinh Viên [____________________]         │  │
│ │ Tên Sinh Viên[____________________]         │  │
│ │ Lĩnh Vực     [v] Trí Tuệ Nhân Tạo│         │  │
│ │                                              │  │
│ │        [Đăng Ký Đề Tài]                     │  │
│ │                                              │  │
│ └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Topic Detail Page - Details Tab (Student View)

```
┌─────────────────────────────────────────────────────┐
│ [Logo] Quản Lý Đề Tài         [User Info] [Logout] │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ AI-powered Student Management System      [Chờ Duyệt│
│ TOPIC001                                            │
│                                                    │
│ [Chi Tiết] [Tiến Độ] [Lịch Sử]                   │
│ ───────────────────────────────────────────────    │
│                                                    │
│ ┌──────────────────────────────────────────────┐  │
│ │ Thông Tin Chung                              │  │
│ │                                              │  │
│ │ Sinh Viên: Nguyễn Văn A                     │  │
│ │ ID: SV001                                    │  │
│ │ Lĩnh Vực: AI                                │  │
│ │ Trạng Thái: Chờ Duyệt                      │  │
│ └──────────────────────────────────────────────┘  │
│                                                    │
│ ┌──────────────────────────────────────────────┐  │
│ │ Mô Tả                                        │  │
│ │                                              │  │
│ │ Hệ thống quản lý sinh viên sử dụng công    │  │
│ │ nghệ AI để tối ưu hóa quy trình quản lý...│  │
│ └──────────────────────────────────────────────┘  │
│                                                    │
│ ┌──────────────────────────────────────────────┐  │
│ │ Trạng Thái Phê Duyệt                         │  │
│ │                                              │  │
│ │ Trạng Thái: Chờ Duyệt                      │  │
│ └──────────────────────────────────────────────┘  │
│                                                    │
│                                    [← Quay Lại]   │
└─────────────────────────────────────────────────────┘
```

### Topic Detail Page - Details Tab (Supervisor Review)

```
┌──────────────────────────────────────────────────────┐
│ ... Topic Detail Header ...                          │
├──────────────────────────────────────────────────────┤
│                                                      │
│ ┌────────────────────────────────────────────────┐  │
│ │ Xử Lý Đề Tài: AI-powered Student Mgmt System │  │
│ │                                                │  │
│ │ Nhập bình luận [__________________________]  │  │
│ │               |__________________________| │  │
│ │               |___________________________|  │  │
│ │                                                │  │
│ │ [Hủy] [Phê Duyệt] [Từ Chối]                 │  │
│ │                                                │  │
│ │ Hoặc:                                         │  │
│ │ [Phê Duyệt]                                  │  │
│ │   → Nhập nhận xét phê duyệt                  │  │
│ │   → [Xác nhận phê duyệt]                     │  │
│ │                                                │  │
│ │ [Từ Chối]                                    │  │
│ │   → Nhập lý do từ chối                       │  │
│ │   → [Xác nhận từ chối]                       │  │
│ └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

### Topic Detail Page - Progress Tab

```
┌──────────────────────────────────────────────────────┐
│ ... Topic Detail Header ...                          │
├──────────────────────────────────────────────────────┤
│ [Chi Tiết] [Tiến Độ] [Lịch Sử]                     │
│ ────────────────────────────────────────────        │
│                                                      │
│ ┌────────────────────────────────────────────────┐  │
│ │ Cập Nhật Tiến Độ (Student) / Theo dõi (Supervisor)       │  │
│ │                                                │  │
│ │ Giai Đoạn [v] Phát Triển                     │  │
│ │ Tiến độ (%) [___] 75                         │  │
│ │ Chi Tiết    [_____________________          │  │
│ │             |_____________________         │  │
│ │             |_____________________|         │  │
│ │                                                │  │
│ │              [Cập Nhật Tiến Độ]            │  │
│ │                                                │  │
│ └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

### Topic Detail Page - History Tab

```
┌──────────────────────────────────────────────────────┐
│ ... Topic Detail Header ...                          │
├──────────────────────────────────────────────────────┤
│ [Chi Tiết] [Tiến Độ] [Lịch Sử]                     │
│ ──────────────────────────────────────────          │
│                                                      │
│ ┌────────────────────────────────────────────────┐  │
│ │ Lịch Sử Thay Đổi                              │  │
│ │                                                │  │
│ │ ┌─ 2024-01-15 10:30                          │  │
│ │ │ Topic đã được đăng ký                      │  │
│ │ │ Bởi: Nguyễn Văn A                          │  │
│ │ │                                             │  │
│ │ ├─ 2024-01-16 14:20                          │  │
│ │ │ Tiến độ được cập nhật: 50%                 │  │
│ │ │ Bởi: Nguyễn Văn A                          │  │
│ │ │                                             │  │
│ │ └─ 2024-01-17 09:15                          │  │
│ │   Topic được phê duyệt                       │  │
│ │   Bởi: Trần Thị Giáo Viên                   │  │
│ │                                                │  │
│ └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

## Responsive Design

### Breakpoints
- **Mobile**: < 640px (Single column layout)
- **Tablet**: 640px - 1024px (2 column layout)
- **Desktop**: > 1024px (3 column layout)

### Mobile View
- Header: Hamburger menu
- Cards: Stack vertically
- Forms: Full width inputs
- Buttons: Full width on small screens

### Tablet View
- Header: Horizontal navigation
- Cards: 2 column grid
- Forms: 2 column layouts where possible

### Desktop View
- Header: All items visible
- Cards: 3 column grid
- Forms: Optimized 2-3 column layouts
- Sidebar: Optional for filtering

## Component States

### Button States
- **Default**: Blue background, white text
- **Hover**: Darker blue background
- **Active**: Scale down animation
- **Disabled**: Gray background, reduced opacity

### Input States
- **Default**: Border gray-300
- **Focus**: Blue ring, transparent border
- **Error**: Red border, error message below
- **Disabled**: Gray background, reduced opacity

### Badge States
- **Success**: Green background, green text
- **Warning**: Yellow background, yellow text
- **Danger**: Red background, red text
- **Info**: Blue background, blue text

## Typography

### Headings
- **H1**: 2.25rem (36px), Bold
- **H2**: 1.875rem (30px), Bold
- **H3**: 1.5rem (24px), Bold

### Body Text
- **Regular**: 1rem (16px), Regular weight
- **Small**: 0.875rem (14px), Regular weight
- **Extra Small**: 0.75rem (12px), Regular weight

### Font Family
- Primary: System fonts (sans-serif)
- Fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto

## Accessibility Features

1. **ARIA Labels**: All interactive elements labeled
2. **Keyboard Navigation**: Tab through all elements
3. **Focus Indicators**: Visible focus rings
4. **Color Contrast**: WCAG AA compliant
5. **Screen Reader Support**: Semantic HTML used throughout

## Animation & Transitions

- **Page Transitions**: Smooth opacity fade
- **Button Hover**: 200ms ease transition
- **Loading Spinner**: Continuous rotation
- **Toast Notifications**: 300ms slide in/out
- **Form Errors**: 150ms slide down animation

## Icons

Using React Icons library for consistent icons:
- FiHome: Navigation
- FiLogOut: Logout
- FiMenu: Mobile menu
- FiCheck: Success states
- FiX: Error/close states
- FiEdit: Edit actions

## Dark Mode (Future)

Ready to implement with Tailwind dark mode:
- Dark background: #1F2937
- Dark card: #111827
- Light text: #F3F4F6
- Update CSS variables for easy theme switching
