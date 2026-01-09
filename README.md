# 🏡 Booking App - Hệ Thống Đặt Phòng Homestay

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/Node.js-v18+-green.svg)
![NestJS](https://img.shields.io/badge/Backend-NestJS-red.svg)
![NextJS](https://img.shields.io/badge/Frontend-Next.js-black.svg)

> Dự án Fullstack mô phỏng ứng dụng đặt phòng (tương tự Airbnb), kết nối giữa Chủ nhà (Host) và Khách thuê (Guest).

## 🚀 Tính Năng Chính

### 🔐 Authentication & Users
- [x] Đăng ký / Đăng nhập (JWT & Refresh Token).
- [x] Phân quyền (Guest, Host, Admin).
- [x] Quản lý hồ sơ cá nhân (Profile).

### 🏠 Quản lý Homestay (Property)
- [x] Đăng tin cho thuê phòng kèm hình ảnh (Upload Cloudinary).
- [x] Xem danh sách phòng, chi tiết phòng.
- [x] Tìm kiếm & Lọc theo giá, địa điểm.
- [x] Bản đồ vị trí (Google Maps/Mapbox - Coming soon).

### 📅 Booking & Reviews
- [x] Đặt phòng theo ngày (Check-in/Check-out).
- [x] Tự động tính tổng tiền.
- [x] Ngăn chặn đặt trùng lịch (Double booking check).
- [x] Đánh giá & Bình luận sau khi trải nghiệm.

---

## 🛠️ Công Nghệ Sử Dụng

| Phần | Công Nghệ |
| :--- | :--- |
| **Backend** | NestJS, TypeScript, Prisma ORM |
| **Database** | PostgreSQL |
| **Frontend** | Next.js 14 (App Router), TailwindCSS |
| **Upload** | Cloudinary |
| **API Docs** | Swagger UI |

---

## ⚙️ Cài Đặt & Chạy Dự Án

### 1. Yêu cầu (Prerequisites)
- Node.js (v18 trở lên)
- PostgreSQL (Cài trực tiếp hoặc qua Docker)
- Tài khoản Cloudinary (Để upload ảnh)

### 2. Clone dự án
```bash
git clone [https://github.com/NguyenDanh-vd/booking-backend.git](https://github.com/NguyenDanh-vd/booking-backend.git)
cd booking-backend