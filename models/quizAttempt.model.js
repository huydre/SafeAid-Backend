const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const QuizAttempt = sequelize.define('QuizAttempt', {
  attempt_id: {
    type: DataTypes.STRING(255),
    primaryKey: true
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  quiz_id: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'QuizAttempts',
  timestamps: false
});

module.exports = QuizAttempt;