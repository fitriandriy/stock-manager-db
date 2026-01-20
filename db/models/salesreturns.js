'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SalesReturns extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SalesReturns.hasMany(models.ReturItems, {
        foreignKey: "sales_return_id",
        as: "returnitems"
      })
    }
  }
  SalesReturns.init({
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    toko: DataTypes.STRING,
    sopir_in: DataTypes.STRING,
    return_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    sopir_out: DataTypes.STRING,
    description: DataTypes.STRING,
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'SalesReturns',
    timestamps: false
  });
  return SalesReturns;
};