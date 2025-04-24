const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const QuizAttempts = sequelize.define(
  'QuizAttempts',
  {
    attempt_id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_completed: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    quiz_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: 'QuizAttempts',
    timestamps: false,
  }
);

module.exports = QuizAttempts;
