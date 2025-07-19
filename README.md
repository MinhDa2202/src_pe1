# Ứng Dụng Quản Lý Bài Đăng

Ứng dụng web full-stack hiện đại được xây dựng với Next.js, TypeScript và MongoDB để quản lý bài đăng với hình ảnh. Ứng dụng cho phép CRUD bài đăng mà không cần đăng nhập.

## ✨ Tính Năng

### 📝 Quản Lý Bài Đăng
- **Tạo bài đăng**: Thêm tiêu đề, mô tả và hình ảnh
- **Chỉnh sửa bài đăng**: Cập nhật thông tin và thay đổi hình ảnh
- **Xóa bài đăng**: Xóa với xác nhận an toàn
- **Xem bài đăng**: Hiển thị dạng lưới responsive

### 🔍 Tìm Kiếm & Sắp Xếp
- Tìm kiếm theo tiêu đề (real-time)
- Sắp xếp A-Z hoặc Z-A
- Phân trang thông minh

### 🎨 Giao Diện Người Dùng
- Thiết kế hiện đại với Tailwind CSS
- Chế độ sáng/tối (Dark/Light mode)
- Responsive trên mọi thiết bị
- Animations mượt mà

### 🖼️ Quản Lý Hình Ảnh
- Lưu trữ hình ảnh dưới dạng Base64 trong database
- Preview trước khi upload
- Hỗ trợ nhiều định dạng ảnh (JPEG, PNG, WebP, GIF)

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes
- **Database**: MongoDB với Mongoose
- **File Storage**: Base64 encoding trong database
- **Icons**: Lucide React

## 🚀 Cài Đặt và Chạy

### 1. Clone Repository
```bash
git clone <repository-url>
cd pe_sdn
```

### 2. Cài Đặt Dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Cấu Hình Environment Variables
Cập nhật file `.env.local` với MongoDB URI:

```env
# MongoDB - Đã được cấu hình
MONGODB_URI=mongodb+srv://ecommerce:voxuany2004@ecommerce.dptk32a.mongodb.net/post_management_app?retryWrites=true&w=majority&appName=ecommerce
```

### 4. Chạy Ứng Dụng
```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 📱 Hướng Dẫn Sử Dụng

### Tính Năng Chính
- Xem danh sách tất cả bài đăng
- Tìm kiếm và sắp xếp bài đăng
- Tạo bài đăng mới
- Chỉnh sửa bài đăng
- Xóa bài đăng với xác nhận
- Chuyển đổi chế độ sáng/tối

## 🏗️ Cấu Trúc Dự Án

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React Components
│   ├── ui/                # Base UI components
│   ├── Header.tsx         # Navigation header
│   ├── PostCard.tsx       # Post display card
│   ├── PostModal.tsx      # Create/Edit modal
│   └── ThemeProvider.tsx  # Dark mode provider
├── lib/                   # Utilities
│   ├── models/            # MongoDB schemas
│   ├── mongodb.ts         # Database connection
│   └── utils.ts           # Helper functions
└── types/                 # TypeScript definitions
```

## 🔒 Bảo Mật

- Validation dữ liệu đầu vào
- Giới hạn kích thước file upload (5MB)
- Kiểm tra định dạng file hình ảnh

## 📊 Database Schema

### Post Model
```typescript
{
  title: string (max 100 chars)
  description: string (max 500 chars)
  imageUrl: string
  createdAt: Date
  updatedAt: Date
}
```

## 🎯 Tính Năng Nâng Cao

- **Real-time Search**: Tìm kiếm tức thì không cần reload
- **Optimistic Updates**: UI cập nhật ngay lập tức
- **Image Optimization**: Tự động tối ưu hình ảnh
- **Responsive Design**: Hoạt động tốt trên mọi thiết bị
- **Error Handling**: Xử lý lỗi thân thiện với người dùng
- **Loading States**: Feedback rõ ràng cho mọi hành động

## 🚀 Deploy

### Vercel (Khuyến nghị)
1. Push code lên GitHub
2. Kết nối với Vercel
3. Cấu hình environment variables
4. Deploy tự động

### Các Platform Khác
- Netlify
- Railway
- Heroku
- DigitalOcean

## 🤝 Đóng Góp

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push và tạo Pull Request

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.

## 📞 Hỗ Trợ

Nếu gặp vấn đề, vui lòng tạo issue trên GitHub hoặc liên hệ qua email.

---

**Được xây dựng với ❤️ bằng Next.js và TypeScript**