const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const QuizCategory = sequelize.define('QuizCategory', {
  category_id: {
    type: DataTypes.STRING(255),
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'QuizCategory',
  timestamps: false
});

module.exports = QuizCategory;