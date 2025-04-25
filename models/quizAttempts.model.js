const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const UserAnswer = require('./userAnswer.model');

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
    max_score: {
      type: DataTypes.INTEGER,
    },
    duration: {
      type: DataTypes.INTEGER,
    },
    completed_at: {
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

QuizAttempts.hasMany(UserAnswer, { foreignKey: 'quiz_attempt_id', as: 'userAnswers' });
UserAnswer.belongsTo(QuizAttempts, { foreignKey: 'quiz_attempt_id', as: 'quizAttempt' });

module.exports = QuizAttempts;
