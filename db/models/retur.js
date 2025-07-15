'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Retur extends Model {
    static associate(models) {
      Retur.belongsTo(models.Products, {
        foreignKey: "product_id",
        as: "product"
      })
    }
  }
  Retur.init({
    date: DataTypes.STRING,
    product_id: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    stock_description: DataTypes.STRING,
    items_out: DataTypes.INTEGER,
    items_out_description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Retur',
    timestamps: false
  });
  return Retur;
};