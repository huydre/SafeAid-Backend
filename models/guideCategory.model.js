const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const GuideCategory = sequelize.define('GuideCategory', {
  category_id: {
    type: DataTypes.STRING(255),
    primaryKey: true
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'GuideCategory',
  timestamps: false
});

module.exports = GuideCategory;