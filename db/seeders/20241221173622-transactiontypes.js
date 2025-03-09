'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('TransactionTypes', [
      {
        "name": "masuk"
      },
      {
        "name": "keluar"
      },
      {
        "name": "pindah"
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('TransactionTypes', null, {});
  }
};
