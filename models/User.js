// models/User.js

const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/db'); // Đường dẫn tới file db.js của bạn

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.STRING(255),
    primaryKey: true,
    allowNull: false,
    comment: 'Khóa chính của bảng Users'
    // Nếu bạn muốn tự sinh UUID, có thể làm như sau:
    // defaultValue: Sequelize.UUIDV4
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Tên người dùng'
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    },
    comment: 'Email đăng nhập'
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Mật khẩu đã được mã hóa (hash)'
  },
  phone_number: {
    type: DataTypes.STRING(10),
    allowNull: true,
    comment: 'Số điện thoại'
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    comment: 'Thời điểm tạo'
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    comment: 'Thời điểm cập nhật'
    // Nếu muốn auto-update khi row thay đổi, bạn có thể sử dụng:
    // defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Lần đăng nhập gần nhất'
  },
  profile_image_path: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Đường dẫn hoặc ID ảnh đại diện (lưu dạng số?)'
  },
  role: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Quyền hạn (VD: user, admin)'
  }
}, {
  tableName: 'Users',   // Tên bảng trong CSDL
  timestamps: false,    // Vô hiệu hóa timestamps mặc định của Sequelize (createdAt/updatedAt)
  // Nếu muốn Sequelize tự quản lý createdAt, updatedAt, bạn có thể dùng:
  // timestamps: true,
  // underscored: true,
  // createdAt: 'created_at',
  // updatedAt: 'updated_at'
});

module.exports = User;
