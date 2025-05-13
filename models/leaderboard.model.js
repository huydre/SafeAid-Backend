const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Leaderboard = sequelize.define('Leaderboard', {
  entry_id: {
    type: DataTypes.STRING(255),
    primaryKey: true
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  rank: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  updated_at: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'Leaderboard',
  timestamps: false
});

module.exports = Leaderboard;