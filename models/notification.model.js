const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notification = sequelize.define('Notification', {
  notification_id: {
    type: DataTypes.STRING(255),
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING(50), // exam, news, community, ...
    allowNull: false,
  },
  ref_id: { // ID liên quan (quiz_id, news_id, post_id, ...)
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'Notification',
  timestamps: false,
});

module.exports = Notification;