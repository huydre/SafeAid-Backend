const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Question = sequelize.define('Question', {
  question_id: {
    type: DataTypes.STRING(255),
    primaryKey: true
  },
  content: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  point: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  quiz_id: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'Question',
  timestamps: false
});

module.exports = Question;