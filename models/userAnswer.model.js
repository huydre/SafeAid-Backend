const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserAnswer = sequelize.define(
  'UserAnswer',
  {
    user_answer_id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
    },
    is_correct: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    answer_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    question_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    attempt_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: 'UserAnswer',
    timestamps: false,
  }
);

module.exports = UserAnswer;
