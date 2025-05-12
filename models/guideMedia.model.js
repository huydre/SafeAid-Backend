const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const GuideMedia = sequelize.define('GuideMedia', {
  media_id: {
    type: DataTypes.STRING(255),
    primaryKey: true
  },
  media_type: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  media_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  order_index: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  caption: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  guide_id: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'GuideMedia',
  timestamps: false
});

module.exports = GuideMedia;