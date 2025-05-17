'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('ProductTransactions', [
      {
        "id": 1,
        "name": "masuk"
      },
      {
        "id": 2,
        "name": "jual"
      },
      {
        "id": 3,
        "name": "giling"
      },
      {
        "id": 4,
        "name": "pindah"
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('ProductTransactions', null, {});
  }
};
