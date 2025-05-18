const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Answer = require('./answer.model'); // Import model Answer

const Question = sequelize.define(
  'Question',
  {
    question_id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    quiz_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    point: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: 'Question',
    timestamps: false,
  }
);

Question.hasMany(Answer, { foreignKey: 'question_id', as: 'answers' });
Answer.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

module.exports = Question;