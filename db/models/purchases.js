'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Purchases extends Model {
    static associate(models) {
      Purchases.belongsTo(models.Customers, {
        foreignKey: "supplier_id",
        as: "supplier"
      }),

      Purchases.belongsTo(models.Products, {
        foreignKey: "product_id",
        as: "product"
      })
    }
  }
  Purchases.init({
    date: DataTypes.STRING,
    supplier_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    nominal: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Purchases',
    timestamps: false
  });
  return Purchases;
};