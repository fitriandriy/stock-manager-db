'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Customers', [
      {
        "id": 1,
        "name": "Irawati",
        "address": "Genteng"
      },
      {
        "id": 2,
        "name": "KBS",
        "address": "Sragi"
      },
      {
        "id": 3,
        "name": "BULOG Kom",
        "address": "Wonosobo"
      },
      {
        "id": 4,
        "name": "MRMP Banyuwangi",
        "address": "Banyuwangi"
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Customers', null, {});
  }
};
