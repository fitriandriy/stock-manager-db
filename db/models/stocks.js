'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stocks extends Model {
    static associate(models) {
      Stocks.belongsTo(models.MaterialTypes, {
        foreignKey: "material_type_id",
        as: "material"
      })

      Stocks.belongsTo(models.Suppliers, {
        foreignKey: "supplier_id",
        as: "supplier"
      })

      Stocks.belongsTo(models.Customers, {
        foreignKey: "customer_id",
        as: "customer"
      })

      Stocks.belongsTo(models.TransactionTypes, {
        foreignKey: "transaction_type_id",
        as: "transaction_type"
      })

      Stocks.belongsTo(models.Users, {
        foreignKey: "editor_id",
        as: "user"
      })

      Stocks.belongsTo(models.Warehouses, {
        foreignKey: "warehouse_id",
        as: "warehouse"
      })
    }
  }
  Stocks.init({
    warehouse_id: DataTypes.INTEGER,
    supplier_id: DataTypes.INTEGER,
    customer_id: DataTypes.INTEGER,
    material_type_id: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    plate_number: DataTypes.STRING,
    transaction_type_id: DataTypes.INTEGER,
    editor_id: DataTypes.INTEGER,
    description: DataTypes.STRING,
    transfer_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Stocks',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });
  return Stocks;
};