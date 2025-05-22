// middlewares/upload.js
const multer = require('multer');
const path = require('path');

// Cấu hình lưu file vào thư mục 'uploads/' (bạn cần tạo thư mục này)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // hoặc đường dẫn theo mong muốn
  },
  filename: (req, file, cb) => {
    // Đặt tên file theo dạng unique (ví dụ: timestamp + original name)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Bộ lọc file: chỉ chấp nhận hình ảnh (jpeg, png, gif)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file hình ảnh!'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 } // giới hạn file kích thước 5MB
});

module.exports = upload;
