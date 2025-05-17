'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MaterialTypes extends Model {
    static associate(models) {
      MaterialTypes.hasMany(models.Stocks, {
        foreignKey: "material_type_id",
        as: "stocks"
      })
    }
  }
  MaterialTypes.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'MaterialTypes',
    timestamps: false,
  });
  return MaterialTypes;
};