const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Answer = sequelize.define('Answer', {
  answer_id: {
    type: DataTypes.STRING(255),
    primaryKey: true
  },
  content: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  is_correct: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  question_id: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'Answer',
  timestamps: false
});

module.exports = Answer;
