'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    static associate(models) {
      Products.hasMany(models.StockProducts, {
        foreignKey: "product_id",
        as: "StockProducts"
      })

      Products.hasMany(models.Purchases, {
        foreignKey: "product_id",
        as: "purchases"
      })

      Products.hasMany(models.Returs, {
        foreignKey: "product_id",
        as: 'returs'
      })
    }
  }
  Products.init({
    name: DataTypes.STRING,
    weight: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Products',
    timestamps: false
  });
  return Products;
};