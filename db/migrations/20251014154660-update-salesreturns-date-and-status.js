'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // ubah kolom date
    await queryInterface.sequelize.query(`
      ALTER TABLE "SalesReturns"
      ALTER COLUMN "date" TYPE DATE USING NULL;
    `);

    // ubah kolom return_date
    await queryInterface.sequelize.query(`
      ALTER TABLE "SalesReturns"
      ALTER COLUMN "return_date" TYPE DATE USING NULL;
    `);

    // ubah kolom status
    await queryInterface.sequelize.query(`
      ALTER TABLE "SalesReturns"
      ALTER COLUMN "status" TYPE BOOLEAN USING NULL;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE "SalesReturns"
      ALTER COLUMN "date" TYPE VARCHAR(255);
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "SalesReturns"
      ALTER COLUMN "return_date" TYPE VARCHAR(255);
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "SalesReturns"
      ALTER COLUMN "status" TYPE VARCHAR(255);
    `);
  }
};
