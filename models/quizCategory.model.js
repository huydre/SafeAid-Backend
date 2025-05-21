const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
<<<<<<< HEAD
const Quiz = require('./quizzes.model'); // Import model Quiz

const QuizCategory = sequelize.define(
  'QuizCategory',
  {
    category_id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
=======

const QuizCategory = sequelize.define('QuizCategory', {
  category_id: {
    type: DataTypes.STRING(255),
    primaryKey: true
>>>>>>> f2f895e (Revert "Merge branch 'feature/tutorial' of https://github.com/huydre/SafeAid-Backend into feature/tutorial")
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'QuizCategory',
  timestamps: false
});

module.exports = QuizCategory;