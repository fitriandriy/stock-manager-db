'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('MaterialTypes', [
      {
        "name": "A"
      },
      {
        "name": "B"
      },
      {
        "name": "C"
      },
      {
        "name": "Bramo"
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('MaterialTypes', null, {});
  }
};
