'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Warehouses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Warehouses.hasMany(models.Stocks, {
        foreignKey: "warehouse_id",
        as: "stocks"
      })
    }
  }
  Warehouses.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Warehouses',
    timestamps: false
  });
  return Warehouses;
};