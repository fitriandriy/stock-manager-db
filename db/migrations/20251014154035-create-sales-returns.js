'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SalesReturns', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.STRING
      },
      toko: {
        type: Sequelize.STRING
      },
      sopir_in: {
        type: Sequelize.STRING
      },
      return_date: {
        type: Sequelize.STRING
      },
      sopir_out: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SalesReturns');
  }
};