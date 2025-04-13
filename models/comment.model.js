const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Comment = sequelize.define('Comment', {
  comment_id: {
    type: DataTypes.STRING(255),
    primaryKey: true
  },
  post_id: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  user_id: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Comment',
  timestamps: false
});

module.exports = Comment;
