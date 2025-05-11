const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const NewsComment = sequelize.define('NewsComment', {
  comment_id: {
    type: DataTypes.STRING(255),
    primaryKey: true
  },
  news_id: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  user_id: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  parent_comment_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'NewsComment',
  timestamps: false
});

module.exports = NewsComment;
