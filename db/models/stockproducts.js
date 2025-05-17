'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StockProducts extends Model {
    static associate(models) {
      StockProducts.belongsTo(models.Products, {
        foreignKey: "product_id",
        as: "product"
      })

      StockProducts.belongsTo(models.Warehouses, {
        foreignKey: "warehouse_id",
        as: 'warehouse'
      })

      StockProducts.belongsTo(models.ProductTransactions, {
        foreignKey: "product_transaction_id",
        as: "product_transaction"
      })

      StockProducts.belongsTo(models.Users, {
        foreignKey: 'editor',
        as: "user"
      })
    }
  }
  StockProducts.init({
    product_id: DataTypes.INTEGER,
    warehouse_id: DataTypes.INTEGER,
    product_transaction_id: DataTypes.INTEGER,
    total: DataTypes.INTEGER,
    description: DataTypes.STRING,
    transfer_id: DataTypes.STRING,
    editor: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'StockProducts',
  });
  return StockProducts;
};