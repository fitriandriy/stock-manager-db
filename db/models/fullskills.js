'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Fullskills extends Model {
    static associate(models) {
      Fullskills.belongsTo(models.Fullskills, {
        foreignKey: "editor_id",
        as: "user"
      })
    }
  }
  Fullskills.init({
    warehouse_id: DataTypes.INTEGER,
    f1: DataTypes.INTEGER,
    f2: DataTypes.INTEGER,
    date: DataTypes.STRING,
    editor_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Fullskills',
    timestamps: false
  });
  return Fullskills;
};