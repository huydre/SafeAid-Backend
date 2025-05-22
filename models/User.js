// models/User.js

const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/db'); // Đường dẫn tới file db.js của bạn

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.STRING(255),
    primaryKey: true,
    allowNull: false,
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
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  profile_image_path: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING(255),
    allowNull: true,
  }
}, {
  tableName: 'Users', 
  timestamps: false,    
});

module.exports = User;
