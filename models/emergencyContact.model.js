const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const EmergencyContact = sequelize.define('EmergencyContact', {
  contact_id: {
    type: DataTypes.STRING(255),
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  relationship: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  is_default: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  user_id: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'EmergencyContacts',
  timestamps: false
});

module.exports = EmergencyContact;