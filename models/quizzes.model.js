const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Quiz = sequelize.define(
  'Quiz',
  {
    quiz_id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    category_id: {
      type: DataTypes.STRING(255),
    },
    thumbnail_url: {
      type: DataTypes.STRING(255),
    },
    duration: {
      type: DataTypes.INTEGER,
    },
    guide_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      references: {
        model: 'Guides', // Tên bảng tham chiếu
        key: 'guide_id'
      }
    }
  },
  {
    tableName: 'Quizzes',
    timestamps: false,
  }
);

Quiz.belongsTo(require('./guide.model'), {
  foreignKey: 'guide_id',
  as: 'guide'
});

module.exports = Quiz;
