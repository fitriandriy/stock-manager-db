'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Suppliers', [
      {
        "id": 0,
        "name": "Others",
        "address": "Gudang"
      },
      {
        "id": 1,
        "name": "Sunyoto",
        "address": "Taman Agung"
      },
      {
        "id": 2,
        "name": "A Giat",
        "address": "Kraksaan"
      },
      {
        "id": 3,
        "name": "Dwi",
        "address": "Ponorogo"
      },
      {
        "id": 4,
        "name": "Samen",
        "address": "Tuban"
      },
      {
        "id": 5,
        "name": "Merdeka",
        "address": "Kali Putih"
      },
      {
        "id": 6,
        "name": "Deo",
        "address": "Pedotan"
      },
      {
        "id": 7,
        "name": "SMM",
        "address": "Genteng"
      },
      {
        "id": 8,
        "name": "Bulog KOM",
        "address": "Wonosobo"
      },
      {
        "id": 9,
        "name": "Cong Ming",
        "address": "Singojuruh"
      },
      {
        "id": 10,
        "name": "Sumber Tani",
        "address": "Lumajang"
      },
      {
        "id": 11,
        "name": "Maron Jaya",
        "address": "Probolinggo"
      },
      {
        "id": 12,
        "name": "Surya Mas",
        "address": "Jajag"
      },
      {
        "id": 13,
        "name": "Karunia Alam",
        "address": "Situbondo"
      },
      {
        "id": 14,
        "name": "Rajin Jaya",
        "address": "Jember"
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Suppliers', null, {});
  }
};
