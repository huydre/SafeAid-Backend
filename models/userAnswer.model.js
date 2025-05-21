const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
<<<<<<< HEAD
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
=======

const UserAnswer = sequelize.define('UserAnswer', {
  user_answer_id: {
    type: DataTypes.STRING(255),
    primaryKey: true
>>>>>>> f2f895e (Revert "Merge branch 'feature/tutorial' of https://github.com/huydre/SafeAid-Backend into feature/tutorial")
  },
  is_correct: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  question_id: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  attempt_id: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'UserAnswer',
  timestamps: false
});

module.exports = UserAnswer;