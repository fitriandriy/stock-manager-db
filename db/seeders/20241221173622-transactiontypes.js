'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('TransactionTypes', [
      {
        "id": 1,
        "name": "masuk"
      },
      {
        "id": 2,
        "name": "giling"
      },
      {
        "id": 3,
        "name": "pindah"
      },
      {
        "id": 4,
        "name": "jual"
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('TransactionTypes', null, {});
  }
};
