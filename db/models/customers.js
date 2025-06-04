'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customers extends Model {
    static associate(models) {
      Customers.hasMany(models.Stocks, {
        foreignKey: "customer_id",
        as: "stocks"
      })

      Customers.hasMany(models.Purchases, {
        foreignKey: "supplier_id",
        as: "purchases"
      })
    }
  }
  Customers.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Customers',
    timestamps: false
  });
  return Customers;
};