'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Suppliers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Suppliers.hasMany(models.Stocks, {
        foreignKey: "supplier_id",
        as: "stocks"
      })
    }
  }
  Suppliers.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Suppliers',
    timestamps: false,
  });
  return Suppliers;
};