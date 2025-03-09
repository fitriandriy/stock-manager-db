'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Warehouses', [
      {
        "name": "GD1"
      },
      {
        "name": "GD2"
      },
      {
        "name": "GD3"
      },
      {
        "name": "GD4"
      },
      {
        "name": "GD5"
      },
      {
        "name": "GD6"
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Warehouses', null, {});
  }
};
