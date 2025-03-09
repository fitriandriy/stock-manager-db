'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Stocks', [
      {
        "warehouse_id": 1,
        "supplier_id": 1,
        "customer_id": null,
        "material_type_id": 2,
        "amount": 200,
        "transaction_type_id": 1,
        "editor_id": 1,
        "createdAt": new Date(),
        "updatedAt": new Date(),
      },
      {
        "warehouse_id": 2,
        "supplier_id": 4,
        "customer_id": null,
        "material_type_id": 1,
        "amount": 200,
        "transaction_type_id": 1,
        "editor_id": 1,
        "createdAt": new Date(),
        "updatedAt": new Date(),
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Stocks', null, {});
  }
};
