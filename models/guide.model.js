const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Guide = sequelize.define('Guide', {
  guide_id: {
    type: DataTypes.STRING(255),
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  thumbnail_path: {
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
  },
  view_count: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  category_id: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'Guides',
  timestamps: false
});

module.exports = Guide;