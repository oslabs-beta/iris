const { DataTypes } = require('sequelize');
const { DB_TABLE } = require('config');

module.exports = (sequelize) => sequelize.define(
  DB_TABLE,
  {
    key: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    identifier: {
      type: DataTypes.STRING,
    },
    metric: {
      type: DataTypes.STRING,
    },
    time: {
      type: DataTypes.NUMBER,
    },
    value: {
      type: DataTypes.NUMBER,
    },
  },
  {
    tableName: DB_TABLE,
    freezeTableName: true,
    timestamps: false, // Remove need to createdAt and updatedAt columns
  },
);
