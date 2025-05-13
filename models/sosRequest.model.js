const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SOSRequest = sequelize.define('SOSRequest', {
  request_id: {
    type: DataTypes.STRING(255),
    primaryKey: true
  },
  location_lat: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  location_long: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  contact_id: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  user_id: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'SOSRequest',
  timestamps: false
});

module.exports = SOSRequest;