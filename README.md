# Nhớ Notes

Ứng dụng quản lý ghi chú cá nhân frontend, xây dựng bằng Vue 3, Vite và TypeScript. Project là bản demo hoàn chỉnh, lưu dữ liệu trên trình duyệt và sẵn sàng triển khai dưới dạng SPA lên Vercel.

## Chức năng

- Tạo, chỉnh sửa và đổi màu ghi chú.
- Xóa mềm có xác nhận, khôi phục và xóa vĩnh viễn trong thùng rác.
- Tìm kiếm không phân biệt dấu tiếng Việt theo tiêu đề hoặc nội dung.
- Ghim, bỏ ghim, lưu trữ và bỏ lưu trữ.
- Lọc theo tất cả, đã ghim, lưu trữ và thùng rác.
- Sắp xếp theo lần cập nhật hoặc tiêu đề.
- Chuyển đổi hiển thị lưới/danh sách và giao diện sáng/tối.
- Thông báo kết quả thao tác và trạng thái rỗng phù hợp.
- Responsive cho desktop, tablet và điện thoại.
- Dữ liệu mẫu được giữ trong `localStorage` qua một lớp repository riêng.

## Công nghệ

- Vue 3 + Composition API
- Vite + TypeScript
- Vue Router
- Pinia
- Bootstrap 5 + Bootstrap Icons
- ESLint

## Yêu cầu môi trường

- Node.js `20.19+` hoặc `22.12+` (khuyến nghị dùng Node.js 22 LTS mới nhất)
- npm 10+

Kiểm tra phiên bản hiện tại:

```bash
node --version
npm --version
```

## Chạy project

Cài package:

```bash
npm install
```

Chạy môi trường phát triển:

```bash
npm run dev
```

Sau đó mở địa chỉ Vite hiển thị trong terminal, mặc định là `http://localhost:5173`.

Kiểm tra TypeScript và lint:

```bash
npm run type-check
npm run lint
```

Build production:

```bash
npm run build
```

Xem thử bản production đã build:

```bash
npm run preview
```

Thư mục đầu ra là `dist/`.

## Cấu trúc chính

```text
src/
├── components/       # Header, sidebar, card, modal, toolbar, toast
├── layouts/          # Bố cục ứng dụng chính
├── router/           # Cấu hình Vue Router
├── services/         # Repository contract và localStorage implementation
├── stores/           # Pinia stores cho ghi chú và trạng thái giao diện
├── styles/           # CSS toàn cục, theme và responsive
├── types/            # Interface Note và các kiểu TypeScript
├── utils/            # Hàm định dạng ngày giờ
└── views/            # Tổng quan, các danh sách ghi chú và trang 404
```

## Đưa source lên GitHub

Tại thư mục project, chạy:

```bash
git init
git add .
git commit -m "feat: create personal notes app"
git branch -M main
git remote add origin https://github.com/TEN-CUA-BAN/TEN-REPOSITORY.git
git push -u origin main
```

Thay `TEN-CUA-BAN` và `TEN-REPOSITORY` bằng thông tin repository thực tế. File `.gitignore` đã loại trừ `node_modules`, `dist`, file môi trường và cấu hình Vercel cục bộ.

## Deploy lên Vercel

1. Đăng nhập Vercel và chọn **Add New → Project**.
2. Import repository GitHub vừa tạo.
3. Vercel thường tự nhận diện framework là **Vite**. Nếu cần nhập thủ công:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. Chọn **Deploy**.

File `vercel.json` đã cấu hình SPA rewrite về `index.html`, vì vậy tải lại trực tiếp các URL như `/pinned`, `/archived` hoặc `/trash` vẫn hoạt động.

### Gắn tên miền sau này

Trong Vercel, mở project → **Settings → Domains** → nhập tên miền. Vercel sẽ hiển thị bản ghi DNS cần thêm tại nhà cung cấp tên miền. Chỉ thay đổi DNS sau khi đã đối chiếu đúng các bản ghi mà Vercel cung cấp.

## Dữ liệu demo và hướng nâng cấp API

Dữ liệu ghi chú hiện được lưu dưới khóa `nho-notes:v1` trong `localStorage` của từng trình duyệt. Component không truy cập trực tiếp vào nơi lưu trữ; mọi thao tác đi qua `NoteRepository` và Pinia store.

Ở giai đoạn bổ sung .NET 8 API hoặc Supabase:

1. Tạo implementation mới cho interface `NoteRepository`.
2. Thay instance được inject vào store bằng repository API.
3. Bổ sung cấu hình URL API qua biến môi trường Vite.
4. Xử lý trạng thái tải, phân trang, lỗi mạng và đồng bộ dữ liệu.
5. Sau khi có đăng nhập, liên kết mỗi ghi chú với người dùng ở backend.

Các view và component hiện tại có thể được giữ nguyên; phần thay đổi chính nằm ở tầng `services` và một phần xử lý bất đồng bộ trong store.
