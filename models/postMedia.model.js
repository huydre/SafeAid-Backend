const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PostMedia = sequelize.define('PostMedia', {
  postmedia_id: {
    type: DataTypes.STRING(255),
    primaryKey: true
  },
  post_id: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  media_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  media_link: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  user_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'PostMedia',
  timestamps: false
});

module.exports = PostMedia;
