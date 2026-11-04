cat > README.md <<'EOF'
# Hệ thống quản lý thiết bị lớp học

## 1. Thông tin sinh viên
- Họ tên: Lý Phương Nghi
- MSSV: 238269
- Lớp: DH23TIN10

## 2. Giới thiệu
Hệ thống quản lý thiết bị lớp học giúp người dùng quản lý thông tin thiết bị trong các phòng học.

Các chức năng chính:
- Hiển thị danh sách thiết bị.
- Xem thông tin chi tiết thiết bị.
- Thêm thiết bị mới.
- Cập nhật thông tin thiết bị.
- Xóa thiết bị.
- Tìm kiếm thiết bị.
- Quản lý trạng thái thiết bị.

Dữ liệu được lưu trữ trên MongoDB Atlas.

## 3. Công nghệ sử dụng
- Frontend: React, Vite
- Backend: Node.js, Express
- Database: MongoDB Atlas, Mongoose
- Source Code: Git, GitHub
- Container: Docker
- Docker Registry: Docker Hub
- Deployment: Render

## 4. Cấu trúc dự án
- backend/: Mã nguồn Backend.
- backend/models/: Mongoose models.
- backend/routes/: REST API.
- frontend/: Mã nguồn giao diện React.
- README.md: Tài liệu dự án.
- .gitignore: Các file không đưa lên GitHub.

## 5. Hướng dẫn cài đặt và chạy ứng dụng

### 5.1. Yêu cầu
- Node.js và npm.
- MongoDB Atlas.
- Git.

### 5.2. Cấu hình Backend

```bash
cd backend
npm install