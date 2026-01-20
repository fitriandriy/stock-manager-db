'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReturItems extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ReturItems.belongsTo(models.SalesReturns, {
        foreignKey: "sales_return_id",
        as: "salesreturns"
      })
    }
  }
  ReturItems.init({
    sales_return_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    amount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ReturItems',
    timestamps: false
  });
  return ReturItems;
};