'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      Users.hasMany(models.Stocks, {
        foreignKey: "editor_id",
        as: "stocks"
      })

      Users.hasMany(models.Fullskills, {
        foreignKey: "editor_id",
        as: "fullskill"
      })
    }
  }
  Users.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
    timestamps: false,
  });
  return Users;
};