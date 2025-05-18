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
    type: DataTypes.TEXT('long'),  
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
  thumbnail_path: {           
    type: DataTypes.STRING(255),
    allowNull: true
  },
  author_id: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  view_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
}, {
  tableName: 'News',
  timestamps: false  
});

module.exports = News;
