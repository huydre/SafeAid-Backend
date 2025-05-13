const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const GuideStep = sequelize.define('GuideStep', {
  step_id: {
    type: DataTypes.STRING(255),
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  content: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  order_index: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE(6),
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE(6),
    defaultValue: DataTypes.NOW,
  },
  guide_id: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'GuideStep',
  timestamps: false
});

module.exports = GuideStep;
