'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Returs extends Model {
    static associate(models) {
      Returs.belongsTo(models.Products, {
        foreignKey: "product_id",
        as: "product"
      })
    }
  }
  Returs.init({
    date: DataTypes.STRING,
    product_id: DataTypes.INTEGER,
    stock: DataTypes.STRING,
    stock_description: DataTypes.STRING,
    items_out: DataTypes.STRING,
    items_out_description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Returs',
    timestamps: false
  });
  return Returs;
};