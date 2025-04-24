const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
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
  },
  {
    tableName: 'QuizCategory',
    timestamps: false,
  }
);

QuizCategory.hasMany(Quiz, { foreignKey: 'category_id', as: 'quizzes' });
Quiz.belongsTo(QuizCategory, { foreignKey: 'category_id', as: 'category' });

module.exports = QuizCategory;
