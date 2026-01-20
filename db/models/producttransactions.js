'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductTransactions extends Model {
    static associate(models) {
      ProductTransactions.hasMany(models.StockProducts, {
        foreignKey: 'product_transaction_id',
        as: "StockProducts"
      })
    }
  }
  ProductTransactions.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProductTransactions',
  });
  return ProductTransactions;
};