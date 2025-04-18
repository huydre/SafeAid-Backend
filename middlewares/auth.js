// middlewares/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key'; // Lấy JWT secret từ biến môi trường hoặc fallback

const authMiddleware = (req, res, next) => {
  // Lấy token từ header, yêu cầu dạng "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Bạn chưa đăng nhập. Vui lòng cung cấp token.' });
  }

  // Tách chuỗi để lấy phần token
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return res.status(401).json({ error: 'Token không hợp lệ. Cấu trúc token phải là "Bearer <token>".' });
  }

  const token = parts[1];

  // Xác thực token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn.' });
    }

    // Gắn thông tin người dùng đã giải mã vào req.user để sử dụng ở các route sau
    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;
