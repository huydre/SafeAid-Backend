const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const NewsMedia = sequelize.define('NewsMedia', {
  media_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  media_type: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  media_url: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  order_index: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  caption: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  news_id: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'NewsMedia',
  timestamps: false
});

module.exports = NewsMedia;
