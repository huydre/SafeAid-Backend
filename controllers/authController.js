const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid'); // dùng để sinh UUID cho user_id

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key'; // Lấy JWT secret từ biến môi trường

/**
 * Đăng ký người dùng mới
 *
 * Yêu cầu nhập: username, email, password; phone_number (tùy chọn)
 */
exports.register = async (req, res) => {
  try {
    const { username, email, password, phone_number } = req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'username, email và password là bắt buộc.' });
    }

    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Tài khoản với email này đã tồn tại.' });
    }

    // Mã hóa mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Sinh user_id bằng UUID (do model định nghĩa user_id là kiểu VARCHAR(255))
    const user_id = uuidv4();

    // Tạo người dùng mới
    const newUser = await User.create({
      user_id,
      username,
      email,
      password: hashedPassword,
      phone_number: phone_number || null, // Nếu không có số điện thoại, lưu null
      role: 'user' // Mặc định người dùng đăng ký có role là 'user'
      // Các trường created_at, updated_at sẽ được tự động gán theo default hoặc qua migration
    });

    return res.status(201).json({
      message: 'Đăng ký thành công.',
      user: {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    return res.status(500).json({ error: 'Đã xảy ra lỗi khi đăng ký.' });
  }
};

/**
 * Đăng nhập người dùng
 *
 * Yêu cầu nhập: email, password
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (!email || !password) {
      return res.status(400).json({ error: 'Email và password là bắt buộc.' });
    }

    // Tìm người dùng theo email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Thông tin đăng nhập không hợp lệ.' });
    }

    // So sánh mật khẩu nhập vào với mật khẩu đã được mã hóa lưu trong CSDL
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Thông tin đăng nhập không hợp lệ.' });
    }

    // Cập nhật trường last_login với thời điểm hiện tại
    await user.update({ last_login: new Date() });

    // Tạo JWT token chứa thông tin cần thiết (user_id, email, role)
    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET
    );

    return res.json({
      message: 'Đăng nhập thành công.',
      token
    });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    return res.status(500).json({ error: 'Đã xảy ra lỗi khi đăng nhập.' });
  }
};
