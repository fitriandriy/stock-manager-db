'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionTypes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TransactionTypes.hasMany(models.Stocks, {
        foreignKey: "transaction_type_id",
        as: "stocks"
      })
    }
  }
  TransactionTypes.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TransactionTypes',
    timestamps: false,
  });
  return TransactionTypes;
};