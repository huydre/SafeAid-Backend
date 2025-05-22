const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FavouriteGuideList = sequelize.define('FavouriteGuideList', {
  favlist_id: {
    type: DataTypes.STRING(255),
    primaryKey: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  user_id: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'FavouriteGuideList',
  timestamps: false
});

module.exports = FavouriteGuideList;