Clone repository về máy
Mở terminal (hoặc Command Prompt) và chạy lệnh:
git clone https://github.com/your_username/first-aid-app.git
Sau đó, chuyển vào thư mục project:
cd first-aid-app

Cài đặt dependencies
Chạy lệnh:
npm install
Lệnh này sẽ cài đặt tất cả các package cần thiết như Express, Sequelize, bcrypt, jsonwebtoken, v.v.

Cấu hình biến môi trường
Tạo một file có tên .env ở thư mục gốc của project (hoặc sao chép từ file .env.example nếu có). Nội dung bên trong file .env cần bao gồm các biến sau:

DB_HOST (ví dụ: localhost)

DB_USER (tên tài khoản MySQL của bạn)

DB_PASS (mật khẩu MySQL của bạn)

DB_NAME (đặt là first_aid_db)

JWT_SECRET (một chuỗi bí mật để tạo token)

PORT (ví dụ: 5000)

Ví dụ nội dung của file .env có thể như sau:

DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASS=your_mysql_password
DB_NAME=first_aid_db
JWT_SECRET=your_jwt_secret
PORT=5000

Tạo cơ sở dữ liệu MySQL
Đăng nhập vào MySQL thông qua terminal hoặc công cụ quản lý như MySQL Workbench. Sau đó, chạy lệnh sau để tạo database:

CREATE DATABASE IF NOT EXISTS first_aid_db
DEFAULT CHARACTER SET utf8mb4
DEFAULT COLLATE utf8mb4_unicode_ci;

Lệnh này sẽ tạo cơ sở dữ liệu first_aid_db nếu chưa có.

Đồng bộ các model với cơ sở dữ liệu
Nếu trong file app.js của bạn có dòng lệnh để đồng bộ (như db.sync()), bạn có thể bật nó trong môi trường phát triển để Sequelize tự tạo các bảng theo định nghĩa trong các model.
Nếu bạn đã sử dụng migration để quản lý schema, hãy chạy migration theo hướng dẫn của dự án.

Chạy ứng dụng
Sau khi đã hoàn thành các bước trên, khởi chạy server bằng lệnh:
npm run dev
Sau đó, mở trình duyệt và truy cập vào địa chỉ:
http://localhost:5000/
Nếu mọi thứ hoạt động bình thường, bạn sẽ thấy thông báo như “Database connected...”.