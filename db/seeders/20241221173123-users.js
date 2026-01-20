'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {
        "id": 1,
        "username": "fitri",
        "password": "fitri",
        "role": "admin"
      },
      {
        "id": 2,
        "username": "admin",
        "password": "adminsas",
        "role": "superadmin"
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
