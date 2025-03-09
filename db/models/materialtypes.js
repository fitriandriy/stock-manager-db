'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MaterialTypes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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