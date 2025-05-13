const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FavouriteGuideItem = sequelize.define('FavouriteGuideItem', {
  guide_item_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  guide_id: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  favlist_id: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'FavouriteGuiideItem',
  timestamps: false
});

module.exports = FavouriteGuideItem;