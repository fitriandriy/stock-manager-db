'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Products', [
      {
        "id": 1,
        "name": "BERAS IR 64",
        "weight": 50
      },
      {
        "id": 2,
        "name": "BERAS MEMBRAMO",
        "weight": 50
      },
      {
        "id": 3,
        "name": "BERAS PS HIJAU @ 25 KG",
        "weight": 25
      },
      {
        "id": 4,
        "name": "BERAS PS HIJAU @ 10 KG",
        "weight": 10
      },
      {
        "id": 5,
        "name": "BERAS PS HIJAU @ 5 KG",
        "weight": 5
      },
      {
        "id": 6,
        "name": "BERAS PS MERAH @ 25 KG",
        "weight": 25
      },
      {
        "id": 7,
        "name": "BERAS PS MERAH @ 10 KG",
        "weight": 10
      },
      {
        "id": 8,
        "name": "BERAS PS MERAH @ 5 KG",
        "weight": 5
      },
      {
        "id": 9,
        "name": "BERAS MANGGA @ 25 KG",
        "weight": 25
      },
      {
        "id": 10,
        "name": "BERAS MANGGA @ 10 KG",
        "weight": 10
      },
      {
        "id": 11,
        "name": "BROKEN PREMIUM",
        "weight": 50
      },
      {
        "id": 12,
        "name": "MENIR KIBI PREMIUM",
        "weight": 50
      },
      {
        "id": 13,
        "name": "MENIR",
        "weight": 50
      },
      {
        "id": 14,
        "name": "BIG BROKEN EKONOMI",
        "weight": 25
      },
      {
        "id": 15,
        "name": "REJECT",
        "weight": 50
      },
      {
        "id": 16,
        "name": "BERAS LEBAH @ 25 KG",
        "weight": 25
      },
      {
        "id": 17,
        "name": "BERAS LEBAH @ 10 KG",
        "weight": 10
      },
      {
        "id": 18,
        "name": "BROKEN",
        "weight": 50
      },
      {
        "id": 19,
        "name": "MENIR KIBI",
        "weight": 50
      },
      {
        "id": 20,
        "name": "TEPUNG",
        "weight": 10
      },
      {
        "id": 21,
        "name": "KANJI",
        "weight": 50
      },
      {
        "id": 22,
        "name": "KIBI POLOS @ 25 KG",
        "weight": 25
      },
      {
        "id": 23,
        "name": "BERAS MURMER",
        "weight": 25
      },
      {
        "id": 24,
        "name": "KATUL",
        "weight": 50
      },
      {
        "id": 25,
        "name": "MENDANG",
        "weight": 50
      },
      {
        "id": 26,
        "name": "BERAS PS KUNING @ 25 KG",
        "weight": 25
      },
      {
        "id": 27,
        "name": "BERAS PS KUNING @ 10 KG",
        "weight": 10
      },
      {
        "id": 28,
        "name": "BERAS PS KUNING @ 5 KG",
        "weight": 5
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Products', null, {});
  }
};
