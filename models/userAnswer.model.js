const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Question = require('./question.model');
const Answer = require('./answer.model');

const UserAnswer = sequelize.define(
  'UserAnswer',
  {
    user_answer_id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    question_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    quiz_attempt_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    selected_answer_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: 'UserAnswer',
    timestamps: false,
  }
);

UserAnswer.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });
UserAnswer.belongsTo(Answer, { foreignKey: 'selected_answer_id', as: 'selectedAnswer' });

module.exports = UserAnswer;
