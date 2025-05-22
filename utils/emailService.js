const nodemailer = require('nodemailer');

/**
 * Cấu hình transporter cho việc gửi email
 * Lưu ý: Bạn cần thay đổi các thông tin này để sử dụng email server thực tế của bạn
 * Hoặc sử dụng dịch vụ như Gmail, SendGrid, Mailgun,...
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'hauthanha1k19@gmail.com',
    pass: process.env.EMAIL_PASS || 'hrkq xzrn ymea xpnl',
  },
});

/**
 * Hàm gửi email
 * @param {string} to - Địa chỉ email người nhận
 * @param {string} subject - Tiêu đề email
 * @param {string} text - Nội dung email dạng text
 * @param {string} html - Nội dung email dạng HTML (nếu có)
 */
const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'SafeAid App <your_email@gmail.com>',
      to,
      subject,
      text,
      html: html || text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = { sendEmail }; 