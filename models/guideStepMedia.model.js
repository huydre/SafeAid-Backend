const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const GuideStepMedia = sequelize.define('GuideStepMedia', {
  media_id: {
    type: DataTypes.STRING(255),
    primaryKey: true,
  },
  media_type: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  media_url: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  caption: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  order_index: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE(6),
    defaultValue: DataTypes.NOW
  },
  step_id: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'GuideStepMedia',
  timestamps: false
});

module.exports = GuideStepMedia;
