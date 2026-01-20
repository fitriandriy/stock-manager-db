'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Warehouses', [
      {
        "id": 1,
        "name": "GD1"
      },
      {
        "id": 2,
        "name": "GD2"
      },
      {
        "id": 3,
        "name": "GD3"
      },
      {
        "id": 4,
        "name": "GD4"
      },
      {
        "id": 5,
        "name": "GD5"
      },
      {
        "id": 6,
        "name": "GD6"
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Warehouses', null, {});
  }
};
