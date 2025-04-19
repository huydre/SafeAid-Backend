const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const News = sequelize.define('News', {
  news_id: {
    type: DataTypes.STRING(255),
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT('long'),   // có thể lưu nhiều ký tự, chứa markdown hoặc HTML
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  author_id: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'News',
  timestamps: false  // đã có created_at, updated_at tự quản
});

module.exports = News;
