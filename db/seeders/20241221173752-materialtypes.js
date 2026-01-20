'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('MaterialTypes', [
      {
        "id": 1,
        "name": "A"
      },
      {
        "id": 2,
        "name": "B"
      },
      {
        "id": 3,
        "name": "C"
      },
      {
        "id": 4,
        "name": "Bramo"
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('MaterialTypes', null, {});
  }
};
