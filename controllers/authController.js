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

exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (!email) {
      return res.status(400).json({ error: 'Email là bắt buộc.' });
    }

    // Tìm người dùng theo email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Trả về thông báo chung để tránh lộ thông tin người dùng
      return res.status(200).json({ 
        message: 'Nếu email tồn tại, một link đặt lại mật khẩu sẽ được gửi đến địa chỉ email đó.' 
      });
    }

    // Tạo token ngẫu nhiên
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Tạo ngày hết hạn (1 giờ sau)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Lưu token vào database
    await PasswordReset.create({
      user_id: user.user_id,
      token: resetToken,
      expires_at: expiresAt,
      used: false
    });

    // Tạo link reset password
    const resetLink = `${APP_URL}/api/auth/reset-password-confirm/${resetToken}`;

    // Gửi email với link reset password
    const emailSubject = 'Yêu cầu đặt lại mật khẩu - SafeAid App';
    const emailText = `Xin chào ${user.username},\n\nChúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng nhấp vào link dưới đây để đặt lại mật khẩu:\n\n${resetLink}\n\nLink này sẽ hết hạn sau 1 giờ.\n\nNếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.\n\nTrân trọng,\nĐội ngũ SafeAid`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4caf50;">Yêu cầu đặt lại mật khẩu - SafeAid App</h2>
        <p>Xin chào <strong>${user.username}</strong>,</p>
        <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng nhấp vào nút dưới đây để đặt lại mật khẩu:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #4caf50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Đặt lại mật khẩu</a>
        </p>
        <p>Hoặc bạn có thể sao chép và dán link này vào trình duyệt:</p>
        <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all;">${resetLink}</p>
        <p style="color: #f44336;"><em>Link này sẽ hết hạn sau 1 giờ.</em></p>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
        <p>Trân trọng,<br />Đội ngũ SafeAid</p>
      </div>
    `;

    const emailSent = await sendEmail(email, emailSubject, emailText, emailHtml);

    if (emailSent) {
      return res.status(200).json({ 
        message: 'Link đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư của bạn.' 
      });
    } else {
      return res.status(500).json({ error: 'Không thể gửi email. Vui lòng thử lại sau.' });
    }

  } catch (error) {
    console.error('Lỗi reset password:', error);
    return res.status(500).json({ error: 'Đã xảy ra lỗi khi yêu cầu đặt lại mật khẩu.' });
  }
};

/**
 * Xác nhận và tự động tạo mật khẩu mới khi người dùng click vào link
 * 
 * URL params: token
 */
exports.confirmResetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    // Tìm token trong database
    const resetRequest = await PasswordReset.findOne({
      where: {
        token: token,
        used: false
      }
    });

    if (!resetRequest) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Đặt lại mật khẩu thất bại</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              max-width: 600px; 
              margin: 20px auto; 
              padding: 15px; 
              text-align: center;
              line-height: 1.5;
            }
            .error { 
              color: #f44336; 
              margin-bottom: 15px;
            }
            .card {
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              border-radius: 8px;
              padding: 20px;
              background-color: #fff;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h2 class="error">Link đặt lại mật khẩu không hợp lệ!</h2>
            <p>Vui lòng yêu cầu đặt lại mật khẩu mới từ ứng dụng.</p>
          </div>
        </body>
        </html>
      `);
    }

    // Kiểm tra xem token đã hết hạn chưa
    const now = new Date();
    if (resetRequest.expires_at < now) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Đặt lại mật khẩu thất bại</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              max-width: 600px; 
              margin: 20px auto; 
              padding: 15px; 
              text-align: center;
              line-height: 1.5;
            }
            .error { 
              color: #f44336; 
              margin-bottom: 15px;
            }
            .card {
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              border-radius: 8px;
              padding: 20px;
              background-color: #fff;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h2 class="error">Link đặt lại mật khẩu đã hết hạn!</h2>
            <p>Vui lòng yêu cầu đặt lại mật khẩu mới từ ứng dụng.</p>
          </div>
        </body>
        </html>
      `);
    }

    // Tìm người dùng
    const user = await User.findOne({ where: { user_id: resetRequest.user_id } });
    if (!user) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Đặt lại mật khẩu thất bại</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              max-width: 600px; 
              margin: 20px auto; 
              padding: 15px; 
              text-align: center;
              line-height: 1.5;
            }
            .error { 
              color: #f44336; 
              margin-bottom: 15px;
            }
            .card {
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              border-radius: 8px;
              padding: 20px;
              background-color: #fff;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h2 class="error">Không tìm thấy tài khoản!</h2>
            <p>Vui lòng liên hệ với quản trị viên để được hỗ trợ.</p>
          </div>
        </body>
        </html>
      `);
    }

    // Tạo mật khẩu mới ngẫu nhiên (8 ký tự)
    const newPassword = Math.random().toString(36).slice(-8);

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu
    await user.update({ password: hashedPassword });

    // Đánh dấu token đã sử dụng
    await resetRequest.update({ used: true });

    // Hiển thị trang thành công với mật khẩu mới
    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Đặt lại mật khẩu thành công</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            max-width: 600px; 
            margin: 20px auto; 
            padding: 15px; 
            text-align: center;
            line-height: 1.5;
          }
          .success { 
            color: #4caf50; 
            margin-bottom: 15px;
          }
          .card {
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            border-radius: 8px;
            padding: 20px;
            background-color: #fff;
          }
          .password-box { 
            background-color: #f5f5f5; 
            padding: 15px; 
            border-radius: 4px; 
            margin: 20px 0; 
            font-size: 24px; 
            font-weight: bold; 
            letter-spacing: 2px; 
          }
          .warning { 
            color: #ff9800; 
            font-style: italic; 
            margin: 15px 0; 
          }
          .copy-btn {
            background-color: #4caf50;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h2 class="success">Mật khẩu đã được đặt lại!</h2>
          <p>Dưới đây là mật khẩu mới của bạn:</p>
          <div class="password-box" id="new-password">${newPassword}</div>
          <button class="copy-btn" onclick="copyPassword()">Sao chép mật khẩu</button>
          <p class="warning">Hãy ghi nhớ hoặc sao chép mật khẩu này và đổi mật khẩu mới sau khi đăng nhập.</p>
        </div>

        <script>
          function copyPassword() {
            const passwordText = document.getElementById('new-password').innerText;
            
            // Tạo element tạm để copy
            const tempInput = document.createElement('textarea');
            tempInput.value = passwordText;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            
            // Thông báo đã sao chép
            alert('Đã sao chép mật khẩu!');
          }
        </script>
      </body>
      </html>
    `);

  } catch (error) {
    console.error('Lỗi xác nhận reset password:', error);
    return res.status(500).send(`
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Đặt lại mật khẩu thất bại</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            max-width: 600px; 
            margin: 20px auto; 
            padding: 15px; 
            text-align: center;
            line-height: 1.5;
          }
          .error { 
            color: #f44336; 
            margin-bottom: 15px;
          }
          .card {
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            border-radius: 8px;
            padding: 20px;
            background-color: #fff;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h2 class="error">Đã xảy ra lỗi!</h2>
          <p>Vui lòng thử lại sau hoặc liên hệ với quản trị viên để được hỗ trợ.</p>
        </div>
      </body>
      </html>
    `);
  }
};