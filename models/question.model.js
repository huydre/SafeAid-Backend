const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
<<<<<<< HEAD
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
=======

const Question = sequelize.define('Question', {
  question_id: {
    type: DataTypes.STRING(255),
    primaryKey: true
>>>>>>> f2f895e (Revert "Merge branch 'feature/tutorial' of https://github.com/huydre/SafeAid-Backend into feature/tutorial")
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
